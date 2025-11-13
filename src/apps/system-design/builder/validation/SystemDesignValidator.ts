import { SystemGraph } from '../types/graph';
import { ProblemDefinition, Scenario, ValidationResult } from '../types/problemDefinition';
import { TestResult } from '../types/testCase';
import { TestRunner } from '../simulation/testRunner';
import { DesignAnalyzer, DesignAnalysisResult } from './DesignAnalyzer';
import { getAPIFiles, getSchemaFile } from '../services/componentDefaults';
import { isDatabaseComponentType } from '../utils/database';

/**
 * SystemDesignValidator - Generic validation engine for any system design problem
 *
 * Takes:
 * - Student's design (SystemGraph with components + configs)
 * - Problem definition (requirements, scenarios, validators)
 * - Level number (which scenario to test)
 *
 * Returns:
 * - Pass/fail result
 * - Detailed feedback
 * - Performance metrics
 * - Deep analysis
 */
export class SystemDesignValidator {
  private testRunner: TestRunner;
  private analyzer: DesignAnalyzer;

  constructor() {
    this.testRunner = new TestRunner();
    this.analyzer = new DesignAnalyzer();
  }

  /**
   * Main validation method
   */
  validate(
    studentGraph: SystemGraph,
    problem: ProblemDefinition,
    levelIndex: number
  ): TestResult & { architectureFeedback?: string[]; detailedAnalysis?: DesignAnalysisResult } {
    const scenario = problem.scenarios[levelIndex];
    const results: ValidationResult[] = [];

    // Step 1: Validate architecture (must-have components, connections)
    const archResults = this.validateArchitecture(studentGraph, problem);
    results.push(...archResults);

    // Step 2: Run custom validators
    for (const validator of problem.validators) {
      try {
        const customResult = validator.validate(studentGraph, scenario);
        results.push(customResult);
      } catch (error) {
        console.error(`Validator "${validator.name}" failed:`, error);
        results.push({
          valid: false,
          hint: `Validation error: ${validator.name}`,
        });
      }
    }

    // Step 3: Simulate performance
    const perfResult = this.simulatePerformance(studentGraph, scenario);

    // Step 4: Deep analysis
    const detailedAnalysis = this.analyzer.analyze(studentGraph, scenario);

    // Aggregate results
    const architecturePassed = results.every(r => r.valid);
    const performancePassed = perfResult.passed;
    const allPassed = architecturePassed && performancePassed;

    // Collect feedback
    const architectureFeedback = results
      .filter(r => !r.valid && r.hint)
      .map(r => r.hint!);

    return {
      ...perfResult,
      passed: allPassed,
      architectureFeedback,
      detailedAnalysis,
    };
  }

  /**
   * Validate architectural requirements
   */
  private validateArchitecture(
    graph: SystemGraph,
    problem: ProblemDefinition
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    const { mustHave, mustConnect } = problem.functionalRequirements;

    // Check must-have components
    for (const requirement of mustHave) {
      if (requirement.optional) continue;

      const hasComponent = this.hasComponentOfType(graph, requirement.type);

      if (!hasComponent) {
        results.push({
          valid: false,
          hint: `Missing ${requirement.type}: ${requirement.reason}`,
        });
      } else {
        results.push({ valid: true });
      }
    }

    // Check required connections
    for (const connReq of mustConnect) {
      const hasPath = this.hasConnectionPath(graph, connReq.from, connReq.to);

      if (!hasPath) {
        results.push({
          valid: false,
          hint: `Need connection: ${connReq.from} → ${connReq.to}${connReq.reason ? ` (${connReq.reason})` : ''}`,
        });
      } else {
        results.push({ valid: true });
      }
    }

    return results;
  }

  /**
   * Check if graph has component of given type
   */
  private hasComponentOfType(graph: SystemGraph, type: string): boolean {
    // Map component types to actual component names
    if (type === 'storage') {
      return graph.components.some(c => isDatabaseComponentType(c.type));
    }

    const typeMapping: Record<string, string[]> = {
      'compute': ['app_server'],
      'cache': ['redis'],
      'load_balancer': ['load_balancer'],
      'message_queue': ['message_queue'],
      'object_storage': ['s3'],
      'cdn': ['cdn'],
    };

    const validTypes = typeMapping[type] || [type];
    return graph.components.some(c => validTypes.includes(c.type));
  }

  /**
   * Check if there's a connection path from -> to
   */
  private hasConnectionPath(graph: SystemGraph, from: string, to: string): boolean {
    // Build adjacency map
    const adjacency = new Map<string, Set<string>>();

    for (const conn of graph.connections) {
      const fromType = this.getComponentType(graph, conn.from);
      const toType = this.getComponentType(graph, conn.to);

      if (!adjacency.has(fromType)) {
        adjacency.set(fromType, new Set());
      }
      adjacency.get(fromType)!.add(toType);
    }

    // BFS to find path
    const queue = [from];
    const visited = new Set<string>([from]);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current === to) {
        return true;
      }

      const neighbors = adjacency.get(current) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return false;
  }

  /**
   * Get component type by ID
   */
  private getComponentType(graph: SystemGraph, componentId: string): string {
    const component = graph.components.find(c => c.id === componentId);
    return component?.type || componentId;
  }

  /**
   * Simulate performance using existing TestRunner
   */
  private simulatePerformance(graph: SystemGraph, scenario: Scenario): TestResult {
    // Convert scenario to TestCase format
    const testCase = {
      name: scenario.name,
      traffic: {
        type: 'mixed' as const,
        rps: scenario.traffic.rps,
        readRatio: scenario.traffic.readWriteRatio || 0.5,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: scenario.passCriteria.maxLatency,
        maxErrorRate: scenario.passCriteria.maxErrorRate || 0.05,
        maxMonthlyCost: scenario.passCriteria.maxCost,
      },
      failureInjection: scenario.failureInjection,
    };

    return this.testRunner.runTestCase(graph, testCase);
  }

  /**
   * Validate with real Python execution and database
   * This method calls the backend API to execute user's code
   */
  async validateWithRealExecution(
    studentGraph: SystemGraph,
    problem: ProblemDefinition,
    levelIndex: number
  ): Promise<{
    success: boolean;
    result?: {
      passed: boolean;
      level: number;
      metrics: {
        totalRequests: number;
        successfulRequests: number;
        failedRequests: number;
        errorRate: number;
        averageLatency: number;
        p50Latency: number;
        p95Latency: number;
        p99Latency: number;
      };
      errors?: string[];
      databaseAvailable: boolean;
    };
    error?: string;
    details?: string;
  }> {
    const scenario = problem.scenarios[levelIndex];

    try {
      // Step 1: Get API files and schema for this problem
      const apiFiles = getAPIFiles(problem);
      const schemaFile = getSchemaFile(problem);

      if (apiFiles.length === 0) {
        return {
          success: false,
          error: 'No API files defined for this problem',
          details: 'This problem does not have Python implementation files yet',
        };
      }

      // Step 2: Fetch file contents from public directory
      const userCode: Record<string, { code: string; functionName: string }> = {};

      for (const apiFile of apiFiles) {
        const response = await fetch(apiFile);
        if (!response.ok) {
          return {
            success: false,
            error: `Failed to load API file: ${apiFile}`,
            details: `HTTP ${response.status}: ${response.statusText}`,
          };
        }
        const code = await response.text();

        // Extract function name from file
        // tinyurl_create_short_url.py -> create_short_url
        const functionName = this.extractFunctionName(apiFile, code);

        // Map to API endpoint name (e.g., 'create_short_url')
        const apiName = apiFile.split('/').pop()?.replace('.py', '').replace('tinyurl_', '').replace('search_', '').replace('webcrawler_', '') || '';

        userCode[apiName] = { code, functionName };
      }

      // Step 3: Fetch schema if available
      let userSchema = '';
      if (schemaFile) {
        const schemaResponse = await fetch(schemaFile);
        if (schemaResponse.ok) {
          userSchema = await schemaResponse.text();
        }
      }

      // Step 4: Call backend validation API
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/v1/system-design/${problem.id}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userCode,
          userSchema,
          level: levelIndex,
          traffic: {
            rps: scenario.traffic.rps,
            readWriteRatio: scenario.traffic.readWriteRatio || 0.5,
            durationSeconds: 10,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Validation failed',
          details: result.details || `HTTP ${response.status}`,
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to execute validation',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Extract main function name from Python code
   */
  private extractFunctionName(filename: string, code: string): string {
    // Try to extract function name from code (look for def function_name)
    const match = code.match(/^def\s+(\w+)\s*\(/m);
    if (match) {
      return match[1];
    }

    // Fallback: derive from filename
    // tinyurl_create_short_url.py -> create_short_url
    const basename = filename.split('/').pop() || '';
    return basename.replace('.py', '').replace(/^[^_]+_/, '');
  }
}
