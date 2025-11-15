import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';

// Import components
import { PythonCodeChallengePanel } from './components/PythonCodeChallengePanel';

// Import existing components (matching original layout)
import { DesignCanvas, getDefaultConfig } from './components/DesignCanvas';
import { ProblemDescriptionPanel } from './components/ProblemDescriptionPanel';
import { SubmissionResultsPanel } from './components/SubmissionResultsPanel';
import { ComponentPalette } from './components/ComponentPalette';
import { EnhancedInspector } from './components/EnhancedInspector';

// Import types and services
import { Challenge } from '../types/testCase';
import { SystemGraph } from '../types/graph';
import { TestResult } from '../types/testCase';
import { validateConnections, formatValidationErrors } from '../services/connectionValidator';
import { validateDatabaseSchema, formatSchemaErrors } from '../services/schemaValidator';
import { TieredChallenge } from '../types/challengeTiers';
import type { DatabaseSchema } from '../types/challengeTiers';
import { TestRunner } from '../simulation/testRunner';
import { apiService } from '../../../../services/api';

// Import example challenges
import { tieredChallenges } from '../challenges/tieredChallenges';

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

  // Python code state
  const [pythonCode, setPythonCode] = useState<string>('');

  // Test results state
  const [testResults, setTestResults] = useState<Map<number, TestResult>>(new Map());
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

  // Simulation test runner for system design FR/NFR testCases
  const [testRunner] = useState(() => new TestRunner());

  // Run Python TinyURL code tests via backend executor
  const handleRunPythonTests = useCallback(
    async (code: string, panelTestCases: any[]) => {
      const results: any[] = [];

      for (const testCase of panelTestCases) {
        const operationsJson = JSON.stringify(testCase.operations || []);
        const operationsLiteral = JSON.stringify(operationsJson);

        const script = `
import json

${code}

def run_test():
    operations = json.loads(${operationsLiteral})
    results = []
    codes = []
    previous_output = None

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

        if method == "shorten":
            actual_output = shorten(actual_input)
            codes.append(actual_output)
        elif method == "expand":
            actual_output = expand(actual_input)
        else:
            raise ValueError(f"Unknown method: {method}")

        # Evaluate expected result
        passed = False
        if expected == "VALID_CODE":
            if isinstance(actual_output, str) and actual_output is not None:
                length_ok = 4 <= len(actual_output) <= 16
                alnum_ok = actual_output.isalnum()
                passed = length_ok and alnum_ok
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

        // Use an existing code lab ID just to leverage the Python executor
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
    []
  );

  // UI state matching original
  const [canvasCollapsed, setCanvasCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('canvas');

  // Load challenge from URL if challengeId is provided
  useEffect(() => {
    if (challengeId && !selectedChallenge) {
      // Convert URL format (dashes) back to challenge ID format (underscores)
      const actualChallengeId = challengeId.replace(/-/g, '_');
      const challenge = challenges.find(c => c.id === actualChallengeId);
      if (challenge) {
        setSelectedChallenge(challenge);
      } else {
        console.error(`Challenge not found: ${actualChallengeId} (from URL: ${challengeId})`);
      }
    }
  }, [challengeId, challenges, selectedChallenge]);

  // Reset graph when challenge changes
  useEffect(() => {
    if (selectedChallenge) {
      // Initialize with client and app_server components (always add app_server for Python code)
      setSystemGraph({
        components: [
          {
            id: 'client',
            type: 'client',
            config: {
              displayName: 'Client',
              subtitle: 'User requests',
            },
          },
          {
            id: 'app_server',
            type: 'app_server',
            config: {
              displayName: 'App Server',
              subtitle: 'Python implementation',
            },
          },
        ],
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
    }
  }, [selectedChallenge]);

  // Handle component addition
  const handleAddComponent = (componentType: string) => {
    const id = `${componentType}_${Date.now()}`;
    const defaultConfig = getDefaultConfig(componentType);

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
    const updatedComponents = systemGraph.components.map((comp) =>
      comp.id === nodeId ? { ...comp, config: { ...comp.config, ...config } } : comp
    );

    setSystemGraph({
      ...systemGraph,
      components: updatedComponents,
    });
  }, [systemGraph]);

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

    if (activeTab === nodeId) {
      setActiveTab('canvas');
    }
  };

  // Handle submit - validate connections then run simulation tests
  const handleSubmit = async () => {
    if (!selectedChallenge) return;

    // Step 1: Validate Python code connections
    const connectionValidation = validateConnections(pythonCode, systemGraph);

    if (!connectionValidation.valid) {
      // Show connection validation errors
      const errorMessage = formatValidationErrors(connectionValidation.errors);
      alert(errorMessage);
      return;
    }

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
        const errorMessage = formatSchemaErrors(schemaValidation.errors);
        alert(errorMessage);
        return;
      }
    }

    // Step 3: Run system design simulation tests (FR + NFR) if testCases are defined
    if (selectedChallenge.testCases && selectedChallenge.testCases.length > 0) {
      setIsRunning(true);

      try {
        // Progressive flow: for TinyURL, Level 1 = functional tests only; Level 2 = all tests
        let testCasesToRun = selectedChallenge.testCases;
        if (selectedChallenge.id === 'tiny_url') {
          if (currentLevel === 1) {
            testCasesToRun = selectedChallenge.testCases.filter(tc => tc.type === 'functional');
          }
        }

        const resultsArray = testRunner.runAllTestCases(systemGraph, testCasesToRun);
        const resultsMap = new Map<number, TestResult>();

        resultsArray.forEach((result, index) => {
          // Preserve original index mapping so SubmissionResultsPanel lines up with testCases
          const originalIndex = selectedChallenge.testCases.indexOf(testCasesToRun[index]);
          resultsMap.set(originalIndex, result as TestResult);
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

          {/* Python Code Tab - Always show (app_server is always added) */}
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
                onShowSolution={() => {}}
                onTryAgain={handleSubmit}
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

        {/* Python Code Tab Content */}
        {activeTab === 'python' && (
          <PythonCodeChallengePanel
            pythonCode={pythonCode}
            setPythonCode={setPythonCode}
            systemGraph={systemGraph}
            onRunTests={handleRunPythonTests}
            onSubmit={handleSubmit}
          />
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
              />
            </div>
          );
        })}
      </div>

    </div>
  );
}
