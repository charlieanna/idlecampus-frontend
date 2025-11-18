import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import Editor from '@monaco-editor/react';

// Import components
import { PythonCodeChallengePanel } from './components/PythonCodeChallengePanel';
import { WebCrawlerCodeChallengePanel } from './components/WebCrawlerCodeChallengePanel';
import { APIsReference } from './components/APIsReference';

// Import existing components (matching original layout)
import { DesignCanvas, getDefaultConfig } from './components/DesignCanvas';
import { ProblemDescriptionPanel } from './components/ProblemDescriptionPanel';
import { SubmissionResultsPanel } from './components/SubmissionResultsPanel';
import { ComponentPalette } from './components/ComponentPalette';
import { AppServerConfigPanel } from './components/AppServerConfigPanel';
import { LoadBalancerConfigPanel } from './components/LoadBalancerConfigPanel';
import { EnhancedInspector } from './components/EnhancedInspector';
import { SolutionModal } from './components/SolutionModal';

// Import types and services
import { Challenge } from '../types/testCase';
import { SystemGraph } from '../types/graph';
import { TestResult } from '../types/testCase';
import { validateConnections, validateSmartConnections, formatValidationErrors } from '../services/connectionValidator';
import { validateDatabaseSchema, formatSchemaErrors } from '../services/schemaValidator';
import { TieredChallenge } from '../types/challengeTiers';
import type { DatabaseSchema } from '../types/challengeTiers';
import { TestRunner } from '../simulation/testRunner';
import { apiService } from '../../../../services/api';

// Import example challenges
import { tieredChallenges } from '../challenges/tieredChallenges';

/**
 * Extract function names from Python code
 */
function extractFunctionNames(code: string): string[] {
  const functionRegex = /def\s+(\w+)\s*\(/g;
  const functions: string[] = [];
  let match;

  while ((match = functionRegex.exec(code)) !== null) {
    functions.push(match[1]);
  }

  return functions;
}

// TinyURL database schema for Python schema validation
const TINY_URL_DATABASE_SCHEMA: DatabaseSchema = {
  tables: [
    {
      name: 'url_mapping',
      primaryKey: 'short_code',
      fields: [
        { name: 'short_code', type: 'string', indexed: true },
        { name: 'long_url', type: 'string' },
        { name: 'created_at', type: 'datetime' },
        { name: 'user_id', type: 'string', indexed: true },
      ],
    },
  ],
  estimatedSize: '10M rows',
};

// Generate TinyURL Python code based on architecture
function generateTinyUrlCode(hasCache: boolean, hasDatabase: boolean, hasQueue: boolean): string {
  return `# TinyURL App Server
# Implementation that uses ${hasCache ? 'cache' : ''}${hasCache && hasDatabase ? ' + ' : ''}${hasDatabase ? 'database' : ''}${!hasCache && !hasDatabase ? 'in-memory storage' : ''}

def shorten(long_url: str, context: dict) -> str:
    """Generate a short code for a long URL."""
    # Validate input
    if not long_url or not isinstance(long_url, str) or len(long_url.strip()) == 0:
        return None

    # Initialize storage
    if 'url_mappings' not in context:
        context['url_mappings'] = {}
    if 'reverse_mappings' not in context:
        context['reverse_mappings'] = {}
    if 'next_id' not in context:
        context['next_id'] = 0

    # Check if URL already exists (duplicate handling)
    if long_url in context['reverse_mappings']:
        return context['reverse_mappings'][long_url]

    # Get next ID
    id = context['next_id']
    context['next_id'] = id + 1

    # Generate short code
    code = base62_encode(id)

    # Store in memory (always, for fallback)
    context['url_mappings'][code] = long_url
${hasDatabase ? `
    # Also store in database if available
    if 'db' in context:
        context['db'].insert(code, long_url)
` : ''}${hasCache ? `
    # Cache the mapping for fast reads
    if 'cache' in context:
        context['cache'].set(code, long_url, ttl=3600)
` : ''}
    # Track reverse mapping
    context['reverse_mappings'][long_url] = code

    return code


def redirect(short_code: str, context: dict) -> str:
    """Get the original URL from a short code."""
    # Validate input
    if not short_code or not isinstance(short_code, str) or len(short_code.strip()) == 0:
        return None

${hasCache ? `    # Try cache first
    if 'cache' in context:
        cached = context['cache'].get(short_code)
        if cached:
            return cached
` : ''}${hasDatabase ? `
    # Try database if available
    if 'db' in context:
        result = context['db'].get(short_code)
        if result:
${hasCache ? `            # Update cache
            if 'cache' in context:
                context['cache'].set(short_code, result, ttl=3600)
` : ''}            return result
        # If db exists but didn't find it, still check memory as fallback
` : ''}
    # Fallback to in-memory lookup (for testing or if db/cache not available)
    if 'url_mappings' not in context:
        context['url_mappings'] = {}
    return context['url_mappings'].get(short_code)


def base62_encode(num: int) -> str:
    """Convert number to base62 string."""
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    if num == 0:
        return charset[0]
    
    result = ''
    while num > 0:
        result = charset[num % 62] + result
        num //= 62
    return result
`;
}

/**
 * Props for TieredSystemDesignBuilder
 */
interface TieredSystemDesignBuilderProps {
  challengeId?: string;
  challenges?: Challenge[];
}

/**
 * Main System Design Builder
 *
 * All challenges use Tier 1 approach: Write Python code using context API
 */
export function TieredSystemDesignBuilder({
  challengeId,
  challenges = tieredChallenges
}: TieredSystemDesignBuilderProps = {}) {
  const navigate = useNavigate();

  // Challenge state
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  // System graph state
  const [systemGraph, setSystemGraph] = useState<SystemGraph>({ components: [], connections: [] });
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Python code state - Multi-server support
  const [pythonCodeByServer, setPythonCodeByServer] = useState<Record<string, {code: string, apis: string[]}>>({});
  // Legacy pythonCode for backward compatibility
  const [pythonCode, setPythonCode] = useState<string>('');

  // Test results state
  const [testResults, setTestResults] = useState<Map<number, TestResult>>(new Map());
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showSolutionModal, setShowSolutionModal] = useState(false);

  // Simulation test runner for system design FR/NFR testCases
  const [testRunner] = useState(() => new TestRunner());

  // Helper flags for challenge-specific behavior
  const isTinyUrl = selectedChallenge?.id === 'tiny_url';
  const isWebCrawler = selectedChallenge?.id === 'web_crawler';
  const isFoodBlog = selectedChallenge?.id === 'food_blog';
  const hasCodeChallenges = selectedChallenge?.codeChallenges && selectedChallenge.codeChallenges.length > 0;
  const hasPythonTemplate = selectedChallenge?.pythonTemplate && selectedChallenge.pythonTemplate.length > 0;

  // Load solution to canvas (can be challenge-level or test-case-specific)
  const loadSolutionToCanvas = useCallback((solutionOverride?: Solution) => {
    const solution = solutionOverride || selectedChallenge?.solution;
    if (!solution) return;
    
    console.log('📋 Loading solution:', solutionOverride ? 'test-case-specific' : 'challenge-level');
    console.log('Solution components:', solution.components);

    // Safety check for components and connections
    if (!solution.components || !Array.isArray(solution.components)) {
      console.error('Solution missing components array');
      return;
    }
    if (!solution.connections || !Array.isArray(solution.connections)) {
      console.error('Solution missing connections array');
      return;
    }

    // Convert solution components to SystemGraph components with full config
    const components = solution.components.map((comp, index) => {
      // Use solution config directly, only fill in essential defaults if missing
      const solutionConfig = comp.config || {};
      const mergedConfig: Record<string, any> = { ...solutionConfig };

      // Only add defaults for fields that are truly missing (not falsy values)
      const defaultCfg = getDefaultConfig(comp.type);
      Object.keys(defaultCfg).forEach(key => {
        if (!(key in solutionConfig)) {
          mergedConfig[key] = defaultCfg[key];
        } else if (key === 'sharding' && solutionConfig.sharding) {
          // Special handling for sharding: preserve the entire object from solution
          mergedConfig[key] = solutionConfig.sharding;
        }
      });

      // Don't set default capacity - let simulation derive it from replication/sharding
      // Capacity is now calculated from commodity spec + replication mode + sharding

      // Ensure app_server has instances if not specified in solution
      if (comp.type === 'app_server' && solutionConfig.instances === undefined) {
        mergedConfig.instances = mergedConfig.instances || 1;
      }

      // Copy schema from challenge componentBehaviors to database config
      if ((comp.type === 'database' || comp.type === 'postgresql' || comp.type === 'mongodb') &&
          !solutionConfig.schema) {
        // First try to get schema from challenge componentBehaviors
        const challengeSchema = (selectedChallenge as TieredChallenge)?.componentBehaviors?.database?.schema;

        if (challengeSchema) {
          mergedConfig.schema = challengeSchema.tables || challengeSchema;
          console.log(`  📋 ${comp.type}: Adding schema from challenge:`, mergedConfig.schema);
        } else if (selectedChallenge?.id === 'tiny_url') {
          // Fallback: Use default TinyURL schema (relational)
          mergedConfig.schema = [
            {
              name: 'url_mapping',
              columns: [
                { name: 'short_code', type: 'varchar(10)', primaryKey: true, nullable: false, indexed: true },
                { name: 'long_url', type: 'text', nullable: false },
                { name: 'created_at', type: 'timestamp', nullable: false, indexed: true },
                { name: 'user_id', type: 'varchar(50)', nullable: true, indexed: true },
              ],
            }
          ];
          mergedConfig.dataModel = 'relational';
          console.log(`  📋 ${comp.type}: Adding default TinyURL schema`);
        } else if (selectedChallenge?.id === 'facebook') {
          // Facebook: Use document/graph model for social graph
          mergedConfig.schema = [
            {
              name: 'users',
              columns: [
                { name: 'id', type: 'string', primaryKey: true, nullable: false, indexed: true },
                { name: 'name', type: 'string', nullable: false },
                { name: 'email', type: 'string', nullable: false, indexed: true },
                { name: 'profile_photo_url', type: 'string', nullable: true },
                { name: 'friend_count', type: 'integer', nullable: false },
                { name: 'created_at', type: 'timestamp', nullable: false, indexed: true },
              ],
            },
            {
              name: 'posts',
              columns: [
                { name: 'id', type: 'string', primaryKey: true, nullable: false, indexed: true },
                { name: 'user_id', type: 'string', nullable: false, indexed: true },
                { name: 'content', type: 'text', nullable: false },
                { name: 'media_url', type: 'string', nullable: true },
                { name: 'like_count', type: 'integer', nullable: false },
                { name: 'created_at', type: 'timestamp', nullable: false, indexed: true },
              ],
            },
            {
              name: 'friendships',
              columns: [
                { name: 'user_id_1', type: 'string', nullable: false, indexed: true },
                { name: 'user_id_2', type: 'string', nullable: false, indexed: true },
                { name: 'status', type: 'string', nullable: false },
                { name: 'created_at', type: 'timestamp', nullable: false, indexed: true },
              ],
            },
            {
              name: 'comments',
              columns: [
                { name: 'id', type: 'string', primaryKey: true, nullable: false, indexed: true },
                { name: 'post_id', type: 'string', nullable: false, indexed: true },
                { name: 'user_id', type: 'string', nullable: false, indexed: true },
                { name: 'text', type: 'text', nullable: false },
                { name: 'created_at', type: 'timestamp', nullable: false, indexed: true },
              ],
            },
          ];
          mergedConfig.dataModel = 'document'; // Document DB or Graph DB for flexible social graph
          console.log(`  📋 ${comp.type}: Adding default Facebook schema (document model)`);
        }
      }

            // Debug log for app_server instances
            if (comp.type === 'app_server') {
              console.log(`  📋 ${comp.type}: solution.instances=${solutionConfig.instances}, merged.instances=${mergedConfig.instances}`);
            }

            // Debug log for database sharding
            if (comp.type === 'database' || comp.type === 'postgresql') {
              console.log(`  📋 ${comp.type}: solution.sharding=`, solutionConfig.sharding, `merged.sharding=`, mergedConfig.sharding);
            }

      return {
        id: `${comp.type}_${Date.now()}_${index}`,
        type: comp.type as any,
        config: mergedConfig,
      };
    });

    // Convert solution connections to use actual component IDs
    const connections = solution.connections.map(conn => {
      // Find the component IDs by type
      const fromComp = components.find(c => c.type === conn.from);
      const toComp = components.find(c => c.type === conn.to);

      if (!fromComp || !toComp) {
        console.warn(`Missing component for connection: ${conn.from} -> ${conn.to}`);
        return null;
      }

      return {
        from: fromComp.id,
        to: toComp.id,
        type: 'read_write' as const,
      };
    }).filter(c => c !== null) as any[];

    // Update the system graph
    console.log('📋 Setting system graph with components:', components.map(c => ({ type: c.type, config: c.config })));
    
    // Verify app_server instances if present
    const appServerComp = components.find(c => c.type === 'app_server');
    if (appServerComp) {
      console.log(`✅ Solution loaded: app_server has ${appServerComp.config.instances} instances`);
    }
    
    setSystemGraph({
      components,
      connections,
    });

    // Generate Python code that matches the solution architecture
    const hasCache = components.some(c => c.type === 'cache' || c.type === 'redis' || c.type === 'memcached');
    const hasDatabase = components.some(c => 
      c.type === 'database' || c.type === 'postgresql' || c.type === 'mongodb' || 
      c.type === 'dynamodb' || c.type === 'cassandra'
    );
    const hasQueue = components.some(c => 
      c.type === 'message_queue' || c.type === 'kafka' || c.type === 'rabbitmq' || c.type === 'sqs'
    );

    // Generate appropriate Python code based on architecture
    let generatedCode = selectedChallenge.pythonTemplate || '';
    
    // For TinyURL challenge, generate code that uses the solution's components
    if (selectedChallenge.id === 'tiny_url' && (hasCache || hasDatabase)) {
      generatedCode = generateTinyUrlCode(hasCache, hasDatabase, hasQueue);
    }

    setPythonCode(generatedCode);

    // Close modal and stay on canvas tab
    setShowSolutionModal(false);
    setHasSubmitted(false);
    setTestResults(new Map());
    setCurrentTestIndex(0);
  }, [selectedChallenge]);

  // Run Python code tests via backend executor (generic for all challenges)
  const handleRunPythonTests = useCallback(
    async (code: string, panelTestCases: any[]) => {
      const results: any[] = [];

      if (!panelTestCases || panelTestCases.length === 0) {
        return results;
      }

      // Determine which code to use: multi-server or legacy single code
      let combinedCode = code;

      // Check if we have any non-empty server-specific code with assigned APIs
      // Validate against current systemGraph to ensure servers still exist and have APIs
      const validServerEntries = Object.entries(pythonCodeByServer).filter(([serverId, entry]) => {
        // Check entry has code and APIs
        if (!entry.code || entry.code.trim().length === 0) return false;
        if (!entry.apis || entry.apis.length === 0) return false;

        // Verify server still exists in systemGraph with APIs assigned
        const currentServer = systemGraph.components.find(c => c.id === serverId);
        if (!currentServer || currentServer.type !== 'app_server') return false;

        const currentAPIs = currentServer.config.handledAPIs || [];
        return currentAPIs.length > 0;
      });

      if (validServerEntries.length > 0) {
        // Use multi-server code: combine all valid server codes
        const validCodes = validServerEntries.map(([_, entry]) => entry.code);
        combinedCode = validCodes.join('\n\n# ---\n\n');
      }
      // Otherwise, fall back to legacy pythonCode (already set to `code` parameter)

      // Extract function names from the combined code
      const functionNames = extractFunctionNames(combinedCode);

      for (const testCase of panelTestCases) {
        const operationsJson = JSON.stringify(testCase.operations || []);
        const operationsLiteral = JSON.stringify(operationsJson);

        const script = `
import json

${combinedCode}

def run_test():
    operations = json.loads(${operationsLiteral})
    results = []
    codes = []
    previous_output = None
    
    # Initialize context for function calls
    context = {}

    for op in operations:
        method = op.get("method")
        raw_input = op.get("input")
        expected = op.get("expected")

        actual_input = raw_input

        # Resolve special input markers like RESULT_FROM_PREV, RESULT_FROM_PREV_0, etc.
        if isinstance(raw_input, str) and raw_input.startswith("RESULT_FROM_PREV"):
            if raw_input == "RESULT_FROM_PREV":
                if previous_output is None:
                    raise ValueError("No previous result available for RESULT_FROM_PREV")
                actual_input = previous_output
            else:
                # RESULT_FROM_PREV_<index>
                parts = raw_input.split("_")
                idx_str = parts[-1]
                idx = int(idx_str)
                if idx < 0 or idx >= len(codes):
                    raise IndexError("Invalid RESULT_FROM_PREV index")
                actual_input = codes[idx]

        # Dynamic function call - call the function by name
        # Available functions: ${functionNames.join(', ')}
        if method not in globals():
            raise ValueError(f"Unknown method: {method}")

        func = globals()[method]
        actual_output = func(actual_input, context)

        # Store codes for methods that generate codes (like shorten)
        if method in ["shorten", "generate", "create"]:
            codes.append(actual_output)

        # Evaluate expected result
        passed = False
        if expected == "VALID_CODE":
            # Just check if it's a non-empty string - the real test is whether expand() works
            if isinstance(actual_output, str) and actual_output is not None and len(actual_output) > 0:
                passed = True
        elif expected == "RESULT_FROM_PREV":
            if previous_output is not None:
                passed = actual_output == previous_output
        elif expected is None:
            passed = actual_output is None
        else:
            passed = actual_output == expected

        results.append({
            "method": method,
            "input": actual_input,
            "expected": expected,
            "actual": actual_output,
            "passed": passed,
        })

        previous_output = actual_output

    overall_passed = all(r["passed"] for r in results)
    return {
        "testId": ${JSON.stringify(testCase.id)},
        "testName": ${JSON.stringify(testCase.name)},
        "passed": overall_passed,
        "operations": results,
    }

if __name__ == "__main__":
    try:
        result = run_test()
        print("__TEST_RESULT__", json.dumps(result))
    except Exception as e:
        failure = {
            "testId": ${JSON.stringify(testCase.id)},
            "testName": ${JSON.stringify(testCase.name)},
            "passed": False,
            "operations": [],
            "error": str(e),
        }
        print("__TEST_RESULT__", json.dumps(failure))
`;

        // Use the actual challenge ID for execution (backend will use category-based config)
        const challengeId = selectedChallenge?.id || 'generic';
        const response = await apiService.executeCode(challengeId, script);
        const output: string = response.output || '';

        const marker = '__TEST_RESULT__';
        const line = (output || '')
          .split('\n')
          .find((l: string) => l.includes(marker));

        if (!line) {
          results.push({
            testId: testCase.id,
            testName: testCase.name,
            passed: false,
            operations: [],
            error: 'No test result produced by Python execution',
          });
          continue;
        }

        const jsonStr = line.substring(line.indexOf(marker) + marker.length).trim();
        try {
          const parsed = JSON.parse(jsonStr);
          results.push(parsed);
        } catch (e) {
          results.push({
            testId: testCase.id,
            testName: testCase.name,
            passed: false,
            operations: [],
            error: 'Failed to parse Python test result',
          });
        }
      }

      return results;
    },
    [pythonCodeByServer, systemGraph]
  );

  // Web Crawler harness: assumes crawl_page(url, html) and manage_frontier(current_batch, seen_urls)
  const handleRunWebCrawlerTests = useCallback(
    async (code: string, testCases: any[]) => {
      const results: any[] = [];

      if (!testCases || testCases.length === 0) {
        return results;
      }

      for (const testCase of testCases) {
        const stepsJson = JSON.stringify(testCase.steps || []);
        const stepsLiteral = JSON.stringify(stepsJson);

        const script = `
import json

${code}

def run_test():
    steps = json.loads(${stepsLiteral})
    step_results = []

    for step in steps:
        step_type = step.get("type")

        if step_type == "crawl":
            url = step.get("url")
            html = step.get("html") or ""
            expected_links = step.get("expectedLinks") or []

            actual = crawl_page(url, html)
            actual_links = sorted(list(set(actual.get("links") or [])))
            expected_sorted = sorted(list(set(expected_links)))

            passed = actual_links == expected_sorted
            description = f'crawl_page({url}) should return links {expected_sorted}'
            details = f'Actual links: {actual_links}'

            step_results.append({
                "type": "crawl",
                "description": description,
                "passed": passed,
                "details": details,
            })

        elif step_type == "frontier":
            current_batch = step.get("currentBatch") or []
            seen = set(step.get("seen") or [])
            expected_next = step.get("expectedNext") or []

            actual_next = manage_frontier(current_batch, seen)
            actual_unique = list(dict.fromkeys(actual_next))
            expected_unique = list(dict.fromkeys(expected_next))

            passed = actual_unique == expected_unique
            description = 'manage_frontier(...) should return next URLs ' + str(expected_unique)
            details = f'Actual: {actual_unique}'

            step_results.append({
                "type": "frontier",
                "description": description,
                "passed": passed,
                "details": details,
            })

        else:
            step_results.append({
                "type": step_type or "unknown",
                "description": "Unknown step type",
                "passed": False,
                "details": "Unsupported step type in test definition",
            })

    overall_passed = all(s["passed"] for s in step_results)
    return {
        "testId": ${JSON.stringify(testCase.id)},
        "testName": ${JSON.stringify(testCase.name)},
        "passed": overall_passed,
        "steps": step_results,
    }

if __name__ == "__main__":
    try:
        result = run_test()
        print("__TEST_RESULT__", json.dumps(result))
    except Exception as e:
        failure = {
            "testId": ${JSON.stringify(testCase.id)},
            "testName": ${JSON.stringify(testCase.name)},
            "passed": False,
            "steps": [],
            "error": str(e),
        }
        print("__TEST_RESULT__", json.dumps(failure))
`;

        const response = await apiService.executeCode('tinyurl_hash_function', script);
        const output: string = response.output || '';

        const marker = '__TEST_RESULT__';
        const line = (output || '')
          .split('\n')
          .find((l: string) => l.includes(marker));

        if (!line) {
          results.push({
            testId: testCase.id,
            testName: testCase.name,
            passed: false,
            steps: [],
            error: 'No test result produced by Python execution',
          });
          continue;
        }

        const jsonStr = line.substring(line.indexOf(marker) + marker.length).trim();
        try {
          const parsed = JSON.parse(jsonStr);
          results.push(parsed);
        } catch (e) {
          results.push({
            testId: testCase.id,
            testName: testCase.name,
            passed: false,
            steps: [],
            error: 'Failed to parse Python test result',
          });
        }
      }

      return results;
    },
    []
  );

  // UI state matching original
  const [canvasCollapsed, setCanvasCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('canvas');

  // Load challenge from URL if challengeId is provided
  useEffect(() => {
    if (challengeId && !selectedChallenge) {
      // Try to find challenge - first with the exact URL ID (which may use hyphens)
      let challenge = challenges.find(c => c.id === challengeId);

      // If not found, try converting dashes to underscores (for legacy IDs)
      if (!challenge) {
        const underscoreId = challengeId.replace(/-/g, '_');
        challenge = challenges.find(c => c.id === underscoreId);
      }

      if (challenge) {
        setSelectedChallenge(challenge);
      } else {
        console.error(`Challenge not found: ${challengeId}`);
      }
    }
  }, [challengeId, challenges, selectedChallenge]);

  // Reset graph when challenge changes
  useEffect(() => {
    if (selectedChallenge) {
      // Initialize with empty canvas - users will add components themselves
      setSystemGraph({
        components: [],
        connections: [],
      });
      setTestResults(new Map());
      setCurrentTestIndex(0);
      setHasSubmitted(false);
      setSelectedNode(null);
      setActiveTab('canvas');
      setCurrentLevel(1);

      // Initialize Python code from template (all challenges have pythonTemplate now)
      setPythonCode(selectedChallenge.pythonTemplate || '');
      setPythonCodeByServer({});
    }
  }, [selectedChallenge]);

  // Sync pythonCodeByServer entries with current app_server handledAPIs
  useEffect(() => {
    const appServers = systemGraph.components.filter(
      c => c.type === 'app_server' && c.config.handledAPIs && c.config.handledAPIs.length > 0
    );

    // Update apis field for existing entries that might be stale
    const needsUpdate = appServers.some(server => {
      const entry = pythonCodeByServer[server.id];
      if (entry) {
        const currentAPIs = server.config.handledAPIs || [];
        const cachedAPIs = entry.apis || [];
        // Check if APIs are different
        return JSON.stringify(currentAPIs.sort()) !== JSON.stringify(cachedAPIs.sort());
      }
      return false;
    });

    if (needsUpdate) {
      const updated = { ...pythonCodeByServer };
      appServers.forEach(server => {
        if (updated[server.id]) {
          updated[server.id] = {
            ...updated[server.id],
            apis: server.config.handledAPIs || []
          };
        }
      });
      setPythonCodeByServer(updated);
    }
  }, [systemGraph.components]);

  // Handle component addition
  const handleAddComponent = (componentType: string) => {
    const id = `${componentType}_${Date.now()}`;
    const defaultConfig = getDefaultConfig(componentType);

    // For app_server, initialize with empty handledAPIs array
    if (componentType === 'app_server') {
      defaultConfig.handledAPIs = [];
    }

    const newComponent = {
      id,
      type: componentType as any,
      config: defaultConfig,
    };

    setSystemGraph({
      ...systemGraph,
      components: [...systemGraph.components, newComponent],
    });
  };

  // Handle component config update
  const handleUpdateConfig = useCallback((nodeId: string, config: Record<string, any>) => {
    const component = systemGraph.components.find(c => c.id === nodeId);
    const updatedComponents = systemGraph.components.map((comp) =>
      comp.id === nodeId ? { ...comp, config: { ...comp.config, ...config } } : comp
    );

    setSystemGraph({
      ...systemGraph,
      components: updatedComponents,
    });

    // Synchronize pythonCodeByServer when app_server's handledAPIs change
    if (component?.type === 'app_server' && config.handledAPIs !== undefined) {
      const existingEntry = pythonCodeByServer[nodeId];
      if (existingEntry) {
        // Update the apis field to match the new handledAPIs
        setPythonCodeByServer({
          ...pythonCodeByServer,
          [nodeId]: {
            ...existingEntry,
            apis: config.handledAPIs
          }
        });
      }
    }
  }, [systemGraph, pythonCodeByServer]);

  // Handle delete component
  const handleDeleteComponent = (nodeId: string) => {
    const component = systemGraph.components.find(c => c.id === nodeId);
    if (component?.type === 'client') {
      alert('Cannot delete the Client component - it is locked');
      return;
    }

    const updatedComponents = systemGraph.components.filter(c => c.id !== nodeId);
    const updatedConnections = systemGraph.connections.filter(
      conn => conn.from !== nodeId && conn.to !== nodeId
    );

    setSystemGraph({
      components: updatedComponents,
      connections: updatedConnections,
    });

    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }

    // If deleting an app_server, clean up its code from pythonCodeByServer
    if (component?.type === 'app_server' && pythonCodeByServer[nodeId]) {
      const newCodeByServer = { ...pythonCodeByServer };
      delete newCodeByServer[nodeId];
      setPythonCodeByServer(newCodeByServer);
    }

    // If deleting an app_server and Python tab is active, switch to canvas
    if (component?.type === 'app_server' && activeTab === 'python') {
      setActiveTab('canvas');
    }

    if (activeTab === nodeId) {
      setActiveTab('canvas');
    }
  };

  // Handle submit - validate connections then run simulation tests
  const handleSubmit = async () => {
    if (!selectedChallenge) return;

    // Step 1: Smart Validation - Only validate connections for components on canvas
    // If user has database/cache on canvas but not connected, that's an error
    // If user doesn't have database/cache on canvas, that's OK (uses in-memory)
    const connectionValidation = validateSmartConnections(pythonCode, systemGraph);

    if (!connectionValidation.valid) {
      console.error('❌ Connection validation failed:', connectionValidation.errors);
      // Instead of showing alert, create failed test results for all test cases
      const resultsMap = new Map<number, TestResult>();

      if (selectedChallenge.testCases && selectedChallenge.testCases.length > 0) {
        selectedChallenge.testCases.forEach((testCase, index) => {
          resultsMap.set(index, {
            passed: false,
            message: 'Failed - ' + connectionValidation.errors[0]?.message || 'Connection error',
            executionTime: 0
          });
        });
      }

      setTestResults(resultsMap);
      setCurrentTestIndex(0);
      setHasSubmitted(true);
      return;
    }
    
    console.log('✅ Connection validation passed');

    // Step 2: Validate Python code against database schema (if challenge has schema)
    const tieredChallenge = selectedChallenge as TieredChallenge;
    let databaseSchema: DatabaseSchema | undefined =
      tieredChallenge.componentBehaviors?.database?.schema;
    let databaseType: 'relational' | 'document' | 'key-value' =
      (tieredChallenge.componentBehaviors?.database?.dataModel as
        | 'relational'
        | 'document'
        | 'key-value') || 'key-value';

    // Fallback: TinyURL specific schema for key-value URL mapping
    if (!databaseSchema && selectedChallenge.id === 'tiny_url') {
      databaseSchema = TINY_URL_DATABASE_SCHEMA;
      databaseType = 'key-value';
    }

    if (databaseSchema) {
      const schemaValidation = validateDatabaseSchema(
        pythonCode,
        databaseSchema,
        databaseType
      );

      if (!schemaValidation.valid) {
        console.error('❌ Schema validation failed:', schemaValidation.errors);
        console.error('Schema validation details:', JSON.stringify(schemaValidation.errors, null, 2));
        // Instead of showing alert, create failed test results for all test cases
        const resultsMap = new Map<number, TestResult>();

        if (selectedChallenge.testCases && selectedChallenge.testCases.length > 0) {
          selectedChallenge.testCases.forEach((testCase, index) => {
            resultsMap.set(index, {
              passed: false,
              message: 'Failed - ' + (schemaValidation.errors?.[0] || 'Schema validation error'),
              executionTime: 0
            });
          });
        }

        setTestResults(resultsMap);
        setCurrentTestIndex(0);
        setHasSubmitted(true);
        return;
      }
      
      console.log('✅ Schema validation passed');
    }

    // Step 3: Run system design simulation tests (FR + NFR) if testCases are defined
    if (selectedChallenge.testCases && selectedChallenge.testCases.length > 0) {
      setIsRunning(true);

      try {
        // Check if solution was loaded (verify app_server instances)
        const appServerInGraph = systemGraph.components.find(c => c.type === 'app_server');
        if (appServerInGraph) {
          const instances = appServerInGraph.config?.instances || 1;
          if (instances === 1) {
            console.warn('⚠️ WARNING: App server has only 1 instance. Did you load a solution? For NFR tests, you may need to load test-case-specific solutions.');
          } else {
            console.log(`✅ App server configured with ${instances} instances`);
          }
        }
        
        // Step 1: Run FR tests first
        const frTests = selectedChallenge.testCases.filter(tc => tc.type === 'functional');
        const nfrTests = selectedChallenge.testCases.filter(tc => tc.type !== 'functional');
        
        console.log(`🚀 Running ${frTests.length} FR tests...`);

        // Pass Python code to test runner for code-aware simulation
        testRunner.setPythonCode(pythonCode);
        
        // Run FR tests first
        const frResults = testRunner.runAllTestCases(systemGraph, frTests);
        const allFrPassed = frResults.every(r => r.passed);
        
        // If FR tests pass, automatically run NFR tests
        let nfrResults: TestResult[] = [];
        if (allFrPassed && nfrTests.length > 0) {
          console.log(`🚀 Running ${nfrTests.length} NFR tests...`);
          console.log(`📋 NFR test names:`, nfrTests.map(tc => tc.name));
          nfrResults = testRunner.runAllTestCases(systemGraph, nfrTests);
          console.log(`📊 NFR results:`, {
            total: nfrResults.length,
            passed: nfrResults.filter(r => r.passed).length,
            failed: nfrResults.filter(r => !r.passed).length,
            results: nfrResults.map((r, i) => ({
              testName: nfrTests[i]?.name,
              passed: r.passed,
              errorRate: r.metrics?.errorRate,
              latency: r.metrics?.p99Latency
            }))
          });
        } else if (!allFrPassed) {
          console.log(`⚠️ Skipping NFR tests because ${frResults.filter(r => !r.passed).length} FR test(s) failed`);
        }
        
        // Combine results (FR first, then NFR if they ran)
        const resultsArray = [...frResults, ...nfrResults];
        
        const resultsMap = new Map<number, TestResult>();

        // Create combined test cases array (FR first, then NFR only if they were run)
        const allTestCasesToRun = allFrPassed ? [...frTests, ...nfrTests] : frTests;

        resultsArray.forEach((result, index) => {
          // Preserve original index mapping so SubmissionResultsPanel lines up with testCases
          const testCase = allTestCasesToRun[index];
          const originalIndex = selectedChallenge.testCases.indexOf(testCase);
          
          const status = result.passed ? '✅' : '❌';
          console.log(`${status} ${testCase.name}:`, {
            p99Latency: result.metrics?.p99Latency?.toFixed(1) + 'ms',
            errorRate: ((result.metrics?.errorRate || 0) * 100).toFixed(2) + '%',
            cost: '$' + (result.metrics?.monthlyCost || 0).toFixed(0),
            passed: result.passed,
            originalIndex,
            testCaseIndex: index,
          });
          
          resultsMap.set(originalIndex, result as TestResult);
        });
        
        const passedCount = resultsArray.filter(r => r.passed).length;
        console.log(`\n📊 Summary: ${passedCount}/${resultsArray.length} tests passed`);
        console.log(`📊 Results Map after setting:`, {
          mapSize: resultsMap.size,
          passedInMap: Array.from(resultsMap.values()).filter(r => r.passed).length,
          mapEntries: Array.from(resultsMap.entries()).map(([idx, r]) => ({ idx, passed: r.passed }))
        });

        // Validate challenge-level budget (independent of test results - cost is only checked at challenge level)
        if (selectedChallenge.requirements?.budget) {
          // Extract budget number from string like "$500/month" or "$2,000/month"
          // Remove $ and commas, then parse
          const budgetStr = selectedChallenge.requirements.budget.replace(/[$,]/g, '').match(/\d+/);
          if (budgetStr) {
            const budgetLimit = parseInt(budgetStr[0], 10);
            // Use infrastructure cost (excludes CDN/S3 operational costs) for budget validation
            // If infrastructureCost is not available, fall back to monthlyCost for backward compatibility
            const totalCost = Math.max(...resultsArray.map(r => (r?.metrics?.infrastructureCost ?? r?.metrics?.monthlyCost) ?? 0), 0);
            
            if (totalCost > budgetLimit) {
              console.warn(`⚠️ Challenge budget exceeded: $${totalCost.toFixed(0)} > $${budgetLimit} (infrastructure cost, excluding CDN/S3)`);
              // Budget is a challenge-level concern - don't overwrite individual test results
              // Instead, add a budget warning to the explanation of each test result
              const budgetExceededMsg = `\n\n⚠️ Challenge Budget Exceeded: Total cost $${totalCost.toFixed(0)}/month exceeds budget of $${budgetLimit}/month.\n\n💡 Note: Individual tests may pass, but the overall solution exceeds the budget. Optimize your architecture to reduce costs (reduce shards, use single-leader replication, smaller cache, fewer app server instances).`;
              
              console.log(`⚠️ Budget exceeded - adding warning to all test results (not marking as failed)`);
              allTestCasesToRun.forEach((testCase, index) => {
                const originalIndex = selectedChallenge.testCases.indexOf(testCase);
                const existingResult = resultsMap.get(originalIndex);
                if (existingResult) {
                  // Keep the original passed/failed status, just add budget warning to explanation
                  resultsMap.set(originalIndex, {
                    ...existingResult,
                    // Keep passed status as-is - don't overwrite with false
                    explanation: existingResult.explanation 
                      ? `${existingResult.explanation}${budgetExceededMsg}`
                      : budgetExceededMsg,
                  });
                }
              });
              console.log(`📊 Results Map after budget check:`, {
                mapSize: resultsMap.size,
                passedInMap: Array.from(resultsMap.values()).filter(r => r.passed).length,
                note: 'Budget warning added but test results preserved'
              });
            } else {
              console.log(`✅ Challenge budget met: $${totalCost.toFixed(0)} ≤ $${budgetLimit}`);
            }
          }
        }

        console.log(`📊 Final Results Map before setState:`, {
          mapSize: resultsMap.size,
          passedInMap: Array.from(resultsMap.values()).filter(r => r.passed).length,
          failedInMap: Array.from(resultsMap.values()).filter(r => !r.passed).length,
          totalTestCases: selectedChallenge.testCases.length,
        });
        setTestResults(resultsMap);
        setCurrentTestIndex(0);
        setHasSubmitted(true);

        // TinyURL level progression: if all tests for this level passed and more tests exist, advance level
        if (selectedChallenge.id === 'tiny_url') {
          const allPassed = resultsArray.every(r => r.passed);
          const hasMoreLevels =
            currentLevel === 1 &&
            selectedChallenge.testCases.some(tc => tc.type !== 'functional');

          if (allPassed && hasMoreLevels) {
            setCurrentLevel(2);
          }
        }
      } finally {
        setIsRunning(false);
      }
      return;
    }

    // If no testCases are defined, just show as submitted without simulation
    setHasSubmitted(true);
  };

  if (!selectedChallenge) return null;

  // Get database/cache components for tabs (similar to original)
  const getDatabaseComponents = () => {
    return systemGraph.components.filter(comp =>
      ['database', 'postgresql', 'mongodb', 'cache', 'redis', 'message_queue'].includes(comp.type)
    );
  };

  const getComponentTabLabel = (component: any) => {
    const typeLabels: Record<string, string> = {
      database: '💾 Database',
      postgresql: '💾 Database',
      mongodb: '💾 Database',
      cache: '⚡ Cache',
      redis: '⚡ Cache',
      message_queue: '📮 Message Queue',
    };
    return typeLabels[component.type] || component.type;
  };

  const databaseComponents = getDatabaseComponents();

  // Check if app_server component exists on canvas
  const hasAppServer = systemGraph.components.some(comp => comp.type === 'app_server');
  
  // Check if load_balancer component exists on canvas
  const hasLoadBalancer = systemGraph.components.some(comp => comp.type === 'load_balancer');

  // Get available APIs from challenge (for API assignment in inspector)
  const getAvailableAPIs = (): string[] => {
    // For TinyURL, define standard APIs
    if (selectedChallenge.id === 'tiny_url') {
      return [
        'POST /api/v1/urls',
        'GET /api/v1/urls/*',
        'GET /api/v1/stats',
      ];
    }
    // For other challenges, could use challenge.requiredAPIs or derive from pythonTemplate
    return [];
  };

  const availableAPIs = getAvailableAPIs();

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Top Bar - Matching original exactly */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back to All Problems Button */}
          <button
            onClick={() => navigate('/system-design')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            title="View all problems"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            All Problems
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              🏗️ System Design Builder
            </h1>
            <span className="text-gray-300">|</span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {selectedChallenge.title}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {selectedChallenge.difficulty || 'Intermediate'}
              </span>
              {selectedChallenge.id === 'tiny_url' && (
                <span className="text-xs text-blue-600 font-medium">
                  Level {currentLevel} of 2
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar - Dynamic tabs matching original */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {/* Canvas Tab */}
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'canvas'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            🎨 Canvas
          </button>

          {/* App Server Tab - Only show when app_server component is on canvas */}
          {hasAppServer && (
            <button
              onClick={() => setActiveTab('app-server')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'app-server'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              📦 App Server
            </button>
          )}

          {/* Load Balancer Tab - Only show when load_balancer component is on canvas */}
          {hasLoadBalancer && (
            <button
              onClick={() => setActiveTab('load-balancer')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'load-balancer'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              ⚖️ Load Balancer
            </button>
          )}

          {/* Python Code Tab - Only show when app_server component is on canvas */}
          {hasAppServer && (
            <button
              onClick={() => setActiveTab('python')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'python'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              🐍 Python Application Server
            </button>
          )}

          {/* APIs Reference Tab - Always show */}
          <button
            onClick={() => setActiveTab('apis')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'apis'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            📚 APIs Available
          </button>

          {/* Dynamic Database Component Tabs */}
          {databaseComponents.map((component) => (
            <button
              key={component.id}
              onClick={() => setActiveTab(component.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === component.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {getComponentTabLabel(component)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Conditional based on active tab */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Tab Content */}
        {activeTab === 'canvas' && (
          <>
            {/* Left Panel - Problem Description OR Submission Results */}
            {hasSubmitted ? (
              <SubmissionResultsPanel
                testCases={selectedChallenge.testCases}
                testResults={testResults}
                isRunning={isRunning}
                currentTestIndex={currentTestIndex}
                onEditDesign={() => {
                  setHasSubmitted(false);
                  setTestResults(new Map());
                  setCurrentTestIndex(0);
                }}
                onShowSolution={loadSolutionToCanvas}
                hasChallengeSolution={!!selectedChallenge?.solution}
              />
            ) : (
              <ProblemDescriptionPanel challenge={selectedChallenge} />
            )}

            {/* Center Panel - Collapsible Design Canvas */}
            {canvasCollapsed ? (
              // Collapsed: Thin strip with expand button
              <div className="w-12 bg-gray-100 border-r border-gray-300 flex flex-col items-center justify-center">
                <button
                  onClick={() => setCanvasCollapsed(false)}
                  className="writing-mode-vertical px-2 py-4 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-blue-600 transition-colors rounded"
                  title="Expand Canvas"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg">◀</span>
                    <span className="transform rotate-90 whitespace-nowrap text-xs">Design Canvas</span>
                  </div>
                </button>
              </div>
            ) : (
              // Expanded: Full canvas with collapse button
              <div className="flex-1 relative">
                <ReactFlowProvider>
                  <DesignCanvas
                    systemGraph={systemGraph}
                    onSystemGraphChange={setSystemGraph}
                    selectedNode={selectedNode}
                    onNodeSelect={setSelectedNode}
                    onAddComponent={handleAddComponent}
                    onUpdateConfig={handleUpdateConfig}
                  />
                </ReactFlowProvider>

                {/* Collapse Button (overlay on canvas) */}
                <button
                  onClick={() => setCanvasCollapsed(true)}
                  className="absolute top-2 right-2 px-3 py-2 bg-white border border-gray-300 rounded shadow-md hover:bg-gray-50 hover:shadow-lg transition-all z-10"
                  title="Collapse Canvas (focus on configuration)"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-700">Hide Canvas</span>
                    <span className="text-sm">▶</span>
                  </div>
                </button>
              </div>
            )}

            {/* Right Panel - Component Palette with Submit Button */}
            {!hasSubmitted && (
              <div className={`flex flex-col bg-white border-l border-gray-200 transition-all ${
                canvasCollapsed ? 'flex-1' : 'w-80'
              }`}>
                {/* Component Palette */}
                <div className="flex-1 overflow-y-auto">
                  <ComponentPalette
                    availableComponents={selectedChallenge.availableComponents || []}
                    onAddComponent={handleAddComponent}
                  />
                </div>

                {/* Submit Button */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={handleSubmit}
                    disabled={isRunning}
                    className="w-full px-6 py-3 text-base font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    {isRunning ? '⏳ Running Tests...' : '▶️ Submit Solution'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* App Server Configuration Tab Content */}
        {activeTab === 'app-server' && (
          <AppServerConfigPanel
            systemGraph={systemGraph}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

        {/* Load Balancer Configuration Tab Content */}
        {activeTab === 'load-balancer' && (
          <LoadBalancerConfigPanel
            systemGraph={systemGraph}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

        {/* Python Code Tab Content */}
        {activeTab === 'python' && isTinyUrl && (
          <PythonCodeChallengePanel
            pythonCode={pythonCode}
            setPythonCode={setPythonCode}
            pythonCodeByServer={pythonCodeByServer}
            setPythonCodeByServer={setPythonCodeByServer}
            systemGraph={systemGraph}
            onRunTests={handleRunPythonTests}
            onSubmit={handleSubmit}
          />
        )}

        {activeTab === 'python' && isWebCrawler && (
          <WebCrawlerCodeChallengePanel
            pythonCode={pythonCode}
            setPythonCode={setPythonCode}
            onRunTests={handleRunWebCrawlerTests}
            onSubmit={handleSubmit}
          />
        )}

        {/* Generic Code Challenges using PythonCodeChallengePanel */}
        {activeTab === 'python' && !isTinyUrl && !isWebCrawler && hasCodeChallenges && (
          <PythonCodeChallengePanel
            pythonCode={pythonCode}
            setPythonCode={setPythonCode}
            pythonCodeByServer={pythonCodeByServer}
            setPythonCodeByServer={setPythonCodeByServer}
            systemGraph={systemGraph}
            onRunTests={handleRunPythonTests}
            onSubmit={handleSubmit}
          />
        )}

        {/* Generic Python Editor for challenges with pythonTemplate but no codeChallenges */}
        {activeTab === 'python' && !isTinyUrl && !isWebCrawler && !hasCodeChallenges && hasPythonTemplate && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel: Problem Statement (40%) */}
            <div className="w-2/5 bg-white border-r border-gray-200 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Problem Title */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedChallenge?.title}</h2>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        selectedChallenge?.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        selectedChallenge?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {selectedChallenge?.difficulty || 'Medium'}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">System Design</span>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700">
                      {selectedChallenge?.description}
                    </p>
                  </div>

                  {/* Functional Requirements */}
                  {selectedChallenge?.requirements && selectedChallenge.requirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {selectedChallenge.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Non-Functional Requirements */}
                  {selectedChallenge?.nonFunctionalRequirements && selectedChallenge.nonFunctionalRequirements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Requirements</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {selectedChallenge.nonFunctionalRequirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Constraints */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Constraints</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      <li>Your implementation should be efficient</li>
                      <li>Handle error cases gracefully</li>
                      <li>Follow the function signatures provided</li>
                    </ul>
                  </div>

                  {/* Hints */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Hints</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      <li>Use the context API to interact with databases and caches</li>
                      {selectedChallenge?.requiredAPIs && selectedChallenge.requiredAPIs.length > 0 && (
                        <li>Available APIs: {selectedChallenge.requiredAPIs.join(', ')}</li>
                      )}
                      <li>Complete the TODO sections in the code</li>
                      <li>Handle edge cases appropriately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Code Editor (60%) */}
            <div className="flex-1 flex flex-col bg-gray-50 min-w-0 relative">
              {/* Code Editor */}
              <div className="flex-1 flex flex-col bg-white min-w-0">
                <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Code Editor</h3>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden" style={{ minWidth: 0, width: '100%' }}>
                  <Editor
                    height="100%"
                    defaultLanguage="python"
                    value={pythonCode}
                    onChange={(value) => setPythonCode(value || '')}
                    theme="vs-light"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 4,
                      wordWrap: 'on',
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Run Code
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Solution
                </button>
              </div>
            </div>
          </div>
        )}

        {/* APIs Reference Tab Content */}
        {activeTab === 'apis' && (
          <div className="flex-1 overflow-auto">
            <APIsReference />
          </div>
        )}

        {/* Database Component Tab Content */}
        {databaseComponents.map((component) => {
          if (activeTab !== component.id) return null;

          return (
            <div key={component.id} className="flex-1 flex flex-col bg-white overflow-hidden">
              <EnhancedInspector
                node={{
                  id: component.id,
                  type: component.type,
                  position: { x: 0, y: 0 },
                  data: {
                    label: getComponentTabLabel(component),
                    componentType: component.type,
                  },
                }}
                systemGraph={systemGraph}
                onUpdateConfig={handleUpdateConfig}
                isModal={false}
                availableAPIs={availableAPIs}
              />
            </div>
          );
        })}
      </div>

      {/* Solution Modal */}
      {showSolutionModal && (
        <SolutionModal
          solution={selectedChallenge.solution}
          challengeTitle={selectedChallenge.title}
          onClose={() => setShowSolutionModal(false)}
        />
      )}
    </div>
  );
}
