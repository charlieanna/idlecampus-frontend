import { SystemGraph } from "../types/graph";
import {
  TestCase,
  TestResult,
  PassCriteria,
  TestMetrics,
} from "../types/testCase";
import { SimulationEngine } from "./engine";
import { ProblemDefinition } from "../types/problemDefinition";

/**
 * Test Runner
 * Executes test cases and evaluates pass/fail criteria
 */
export class TestRunner {
  private engine: SimulationEngine;
  private pythonCode: string = "";
  private problemDefinition?: ProblemDefinition;

  constructor() {
    this.engine = new SimulationEngine();
  }

  /**
   * Set problem definition for architecture validation
   */
  setProblemDefinition(problemDef: ProblemDefinition | undefined): void {
    this.problemDefinition = problemDef;
  }

  /**
   * Set Python code for code-aware simulation
   */
  setPythonCode(code: string): void {
    this.pythonCode = code;
    this.engine.setPythonCode(code);
  }

  /**
   * Run a single test case against a system design
   */
  runTestCase(graph: SystemGraph, testCase: TestCase): TestResult {
    // Basic validation: Check if graph has minimum required components
    // This prevents empty canvas from passing tests
    if (!graph.components || graph.components.length === 0) {
      return {
        passed: false,
        metrics: {
          p50Latency: 0,
          p90Latency: 0,
          p95Latency: 0,
          p99Latency: 0,
          errorRate: 1.0, // 100% error
          monthlyCost: 0,
        },
        bottlenecks: [],
        explanation: `No components found. Please add components to your design.`,
        componentMetrics: new Map(),
      };
    }

    // Check for basic required components
    const hasClient = graph.components.some((c) => c.type === "client");
    const hasCompute = graph.components.some(
      (c) => c.type === "app_server" || c.type === "lambda",
    );
    const hasStorage = graph.components.some(
      (c) =>
        c.type === "database" ||
        c.type === "postgresql" ||
        c.type === "mysql" ||
        c.type === "mongodb" ||
        c.type === "cassandra" ||
        c.type === "dynamodb",
    );

    if (!hasClient || !hasCompute || !hasStorage) {
      return {
        passed: false,
        metrics: {
          p50Latency: 0,
          p90Latency: 0,
          p95Latency: 0,
          p99Latency: 0,
          errorRate: 1.0, // 100% error
          monthlyCost: 0,
        },
        bottlenecks: [],
        explanation: `Missing required components. Need at least: client, compute (app_server), and storage (database).`,
        componentMetrics: new Map(),
      };
    }

    // Check for basic connectivity
    if (!graph.connections || graph.connections.length < 2) {
      return {
        passed: false,
        metrics: {
          p50Latency: 0,
          p90Latency: 0,
          p95Latency: 0,
          p99Latency: 0,
          errorRate: 1.0, // 100% error
          monthlyCost: 0,
        },
        bottlenecks: [],
        explanation: `Insufficient connections. Components must be connected to form a working system.`,
        componentMetrics: new Map(),
      };
    }

    // Run simulation
    console.log("[TestRunner] Starting simulation with graph:", {
      components: graph.components.map((c) => ({
        id: c.id,
        type: c.type,
        config: c.config,
      })),
      connections: graph.connections.map((c) => ({
        from: c.from,
        to: c.to,
        type: c.type,
      })),
    });

    const { metrics, componentMetrics, flowViz } = this.engine.simulateTraffic(
      graph,
      testCase,
    );

    console.log("[TestRunner] Simulation metrics:", metrics);
    
    // Log critical errors immediately with high visibility
    if (metrics.errorRate > 0.01) {
      const testName = testCase.name || testCase.requirement || 'Unknown Test';
      console.error(`🚨 [TestRunner] Test "${testName}" has ${(metrics.errorRate * 100).toFixed(1)}% error rate!`);
      console.error(`   Component metrics:`, Array.from(componentMetrics.entries()).map(([id, m]) => ({
        id,
        type: this.engine['components']?.get(id)?.type || 'unknown',
        errorRate: m.errorRate,
        utilization: m.utilization,
      })));
    }

    // Identify bottlenecks
    const bottlenecks = this.engine.identifyBottlenecks(componentMetrics);

    // Check pass criteria
    const { passed, failures } = this.checkPassCriteria(
      metrics,
      testCase.passCriteria,
    );
    
    // Log immediately if test failed with high error rate (for debugging)
    if (!passed && metrics.errorRate > 0.5) {
      const testName = testCase.name || testCase.requirement || 'Unknown Test';
      console.error(`🚨🚨🚨 TEST FAILED: "${testName}" - Error Rate: ${(metrics.errorRate * 100).toFixed(1)}%, P99 Latency: ${metrics.p99Latency.toFixed(1)}ms`);
      console.error(`   Component metrics:`, Array.from(componentMetrics.entries()).map(([id, m]) => ({
        id,
        type: this.engine['components']?.get(id)?.type || 'unknown',
        errorRate: m.errorRate,
        utilization: m.utilization,
        latency: m.latency,
      })));
    }

    // Generate explanation
    const explanation = this.generateExplanation(
      testCase,
      metrics,
      passed,
      failures,
      bottlenecks,
      graph,
    );

    return {
      passed,
      metrics,
      bottlenecks,
      explanation,
      componentMetrics,
      flowViz,
    };
  }

  /**
   * Run all test cases for a challenge
   */
  runAllTestCases(graph: SystemGraph, testCases: TestCase[]): TestResult[] {
    return testCases.map((testCase) => this.runTestCase(graph, testCase));
  }

  /**
   * Check if metrics meet pass criteria
   */
  private checkPassCriteria(
    metrics: TestMetrics,
    criteria: PassCriteria,
  ): { passed: boolean; failures: string[] } {
    const failures: string[] = [];

    if (
      criteria.maxP50Latency !== undefined &&
      metrics.p50Latency !== undefined &&
      metrics.p50Latency > criteria.maxP50Latency
    ) {
      failures.push(
        `p50 latency (${metrics.p50Latency.toFixed(1)}ms) exceeds target (${criteria.maxP50Latency}ms)`,
      );
    }

    if (
      criteria.maxP90Latency !== undefined &&
      metrics.p90Latency !== undefined &&
      metrics.p90Latency > criteria.maxP90Latency
    ) {
      failures.push(
        `p90 latency (${metrics.p90Latency.toFixed(1)}ms) exceeds target (${criteria.maxP90Latency}ms)`,
      );
    }

    if (
      criteria.maxP95Latency !== undefined &&
      metrics.p95Latency !== undefined &&
      metrics.p95Latency > criteria.maxP95Latency
    ) {
      failures.push(
        `p95 latency (${metrics.p95Latency.toFixed(1)}ms) exceeds target (${criteria.maxP95Latency}ms)`,
      );
    }

    if (
      criteria.maxP99Latency !== undefined &&
      metrics.p99Latency > criteria.maxP99Latency
    ) {
      failures.push(
        `p99 latency (${metrics.p99Latency.toFixed(1)}ms) exceeds target (${criteria.maxP99Latency}ms)`,
      );
    }

    if (
      criteria.maxErrorRate !== undefined &&
      metrics.errorRate > criteria.maxErrorRate
    ) {
      failures.push(
        `Error rate (${(metrics.errorRate * 100).toFixed(2)}%) exceeds target (${(criteria.maxErrorRate * 100).toFixed(2)}%)`,
      );
    }

    if (criteria.maxMonthlyCost !== undefined) {
      // Use infrastructure cost (excludes CDN/S3 operational costs) for budget validation
      // If infrastructureCost is not available, fall back to monthlyCost for backward compatibility
      const costToCheck = metrics.infrastructureCost ?? metrics.monthlyCost;
      if (costToCheck > criteria.maxMonthlyCost) {
        failures.push(
          `Monthly cost ($${costToCheck.toFixed(0)}) exceeds budget ($${criteria.maxMonthlyCost})`,
        );
      }
    }

    if (
      criteria.minAvailability !== undefined &&
      metrics.availability < criteria.minAvailability
    ) {
      failures.push(
        `Availability (${(metrics.availability * 100).toFixed(1)}%) below target (${(criteria.minAvailability * 100).toFixed(1)}%)`,
      );
    }

    return {
      passed: failures.length === 0,
      failures,
    };
  }

  /**
   * Generate human-readable explanation of results
   */
  private generateExplanation(
    testCase: TestCase,
    metrics: TestMetrics,
    passed: boolean,
    failures: string[],
    bottlenecks: any[],
    graph: SystemGraph,
  ): string {
    let explanation = "";

    if (passed) {
      explanation = `✅ Test PASSED: ${testCase.name}\n\n`;
      explanation += `Your design successfully handled the test case!\n\n`;
      explanation += `Metrics:\n`;
      explanation += `- p99 Latency: ${metrics.p99Latency.toFixed(1)}ms\n`;
      explanation += `- Error Rate: ${(metrics.errorRate * 100).toFixed(2)}%\n`;
      explanation += `- Monthly Cost: $${metrics.monthlyCost.toFixed(0)}\n`;
      explanation += `- Availability: ${(metrics.availability * 100).toFixed(1)}%\n`;

      if (bottlenecks.length > 0) {
        explanation += `\n⚠️  Note: Some components are under high load:\n`;
        bottlenecks.forEach((b) => {
          explanation += `- ${b.componentId}: ${(b.utilization * 100).toFixed(0)}% utilization\n`;
        });
      }
    } else {
      explanation = `❌ Test FAILED: ${testCase.name}\n\n`;
      explanation += `${testCase.requirement} failed. Please review your design.\n`;
    }

    return explanation;
  }

  /**
   * Detect if the design is empty or incomplete
   */
  private detectEmptyDesign(graph: SystemGraph, metrics: TestMetrics): boolean {
    // Empty design: 100% error rate and 0% availability
    if (metrics.errorRate >= 0.99 && metrics.availability < 0.01) {
      return true;
    }

    // Check if there are any connections
    if (graph.connections.length === 0) {
      return true;
    }

    // Check if client is connected to anything
    const clients = graph.components.filter((c) => c.type === "client");
    const hasClientConnection = clients.some((client) =>
      graph.connections.some((conn) => conn.from === client.id),
    );

    if (!hasClientConnection) {
      return true;
    }

    return false;
  }

  /**
   * Generate educational guidance for empty/incomplete designs
   */
  private generateEmptyDesignGuidance(
    testCase: TestCase,
    graph: SystemGraph,
  ): string {
    return `${testCase.requirement} failed. Please review your design.\n`;
  }

  /**
   * Validate architecture requirements from ProblemDefinition
   * Returns array of error messages (empty array = passed)
   */
  private validateArchitecture(
    graph: SystemGraph,
    problem: ProblemDefinition,
  ): string[] {
    const errors: string[] = [];
    const { mustHave, mustConnect } = problem.functionalRequirements;

    console.log("[TestRunner] Checking requirements:", {
      mustHave: mustHave.map((m) => m.type),
      mustConnect: mustConnect.map((c) => `${c.from} → ${c.to}`),
    });

    // Check must-have components
    for (const requirement of mustHave) {
      if (requirement.optional) continue;

      const hasComponent = this.hasComponentOfType(graph, requirement.type);

      console.log(
        `[TestRunner] Checking for ${requirement.type}: ${hasComponent ? "FOUND" : "MISSING"}`,
      );

      if (!hasComponent) {
        errors.push(`Missing ${requirement.type}: ${requirement.reason}`);
      }
    }

    // Check required connections
    for (const connReq of mustConnect) {
      const hasPath = this.hasConnectionPath(graph, connReq.from, connReq.to);

      console.log(
        `[TestRunner] Checking connection ${connReq.from} → ${connReq.to}: ${hasPath ? "FOUND" : "MISSING"}`,
      );

      if (!hasPath) {
        errors.push(
          `Need connection: ${connReq.from} → ${connReq.to}${connReq.reason ? ` (${connReq.reason})` : ""}`,
        );
      }
    }

    return errors;
  }

  /**
   * Check if graph has component of given type
   */
  private hasComponentOfType(graph: SystemGraph, type: string): boolean {
    // Map component types to actual component names
    if (type === "storage") {
      return graph.components.some((c) =>
        [
          "database",
          "postgresql",
          "mysql",
          "mongodb",
          "cassandra",
          "dynamodb",
        ].includes(c.type),
      );
    }

    const typeMapping: Record<string, string[]> = {
      client: ["client"],
      compute: ["app_server", "lambda", "ecs"],
      cache: ["cache", "redis", "memcached", "elasticache"],
      load_balancer: ["load_balancer"],
      message_queue: ["message_queue", "kafka", "rabbitmq", "sqs"],
      object_storage: ["s3", "blob_storage", "gcs"],
      cdn: ["cdn", "cloudfront"],
    };

    const validTypes = typeMapping[type] || [type];
    return graph.components.some((c) => validTypes.includes(c.type));
  }

  /**
   * Check if there's a connection path from -> to
   * Maps abstract types (compute, cache, storage) to actual component types
   */
  private hasConnectionPath(
    graph: SystemGraph,
    from: string,
    to: string,
  ): boolean {
    // Map abstract requirement types to actual component types
    const abstractToConcrete: Record<string, string[]> = {
      client: ["client"],
      compute: ["app_server", "lambda", "ecs"],
      cache: ["cache", "redis", "memcached", "elasticache"],
      storage: [
        "database",
        "postgresql",
        "mysql",
        "mongodb",
        "cassandra",
        "dynamodb",
      ],
      load_balancer: ["load_balancer"],
      message_queue: ["message_queue", "kafka", "rabbitmq", "sqs"],
      object_storage: ["s3", "blob_storage", "gcs"],
      cdn: ["cdn", "cloudfront"],
    };

    // Get concrete types for from and to
    const fromTypes = abstractToConcrete[from] || [from];
    const toTypes = abstractToConcrete[to] || [to];

    // Build adjacency map using actual component types
    const adjacency = new Map<string, Set<string>>();

    for (const conn of graph.connections) {
      const fromComponent = graph.components.find((c) => c.id === conn.from);
      const toComponent = graph.components.find((c) => c.id === conn.to);

      if (!fromComponent || !toComponent) continue;

      const fromType = fromComponent.type;
      const toType = toComponent.type;

      if (!adjacency.has(fromType)) {
        adjacency.set(fromType, new Set());
      }
      adjacency.get(fromType)!.add(toType);
    }

    // BFS to find path - check if any fromType can reach any toType
    for (const startType of fromTypes) {
      const queue = [startType];
      const visited = new Set<string>([startType]);

      while (queue.length > 0) {
        const current = queue.shift()!;

        // Check if current type matches any target type
        if (toTypes.includes(current)) {
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
    }

    return false;
  }
}
