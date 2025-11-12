import { SystemGraph } from '../types/graph';
import { TestCase, TestResult, PassCriteria, TestMetrics } from '../types/testCase';
import { SimulationEngine } from './engine';

/**
 * Test Runner
 * Executes test cases and evaluates pass/fail criteria
 */
export class TestRunner {
  private engine: SimulationEngine;

  constructor() {
    this.engine = new SimulationEngine();
  }

  /**
   * Run a single test case against a system design
   */
  runTestCase(graph: SystemGraph, testCase: TestCase): TestResult {
    // Run simulation
    const { metrics, componentMetrics, flowViz } = this.engine.simulateTraffic(
      graph,
      testCase
    );

    // Identify bottlenecks
    const bottlenecks = this.engine.identifyBottlenecks(componentMetrics);

    // Check pass criteria
    const { passed, failures } = this.checkPassCriteria(
      metrics,
      testCase.passCriteria
    );

    // Generate explanation
    const explanation = this.generateExplanation(
      testCase,
      metrics,
      passed,
      failures,
      bottlenecks,
      graph
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
    criteria: PassCriteria
  ): { passed: boolean; failures: string[] } {
    const failures: string[] = [];

    if (
      criteria.maxP99Latency !== undefined &&
      metrics.p99Latency > criteria.maxP99Latency
    ) {
      failures.push(
        `p99 latency (${metrics.p99Latency.toFixed(1)}ms) exceeds target (${criteria.maxP99Latency}ms)`
      );
    }

    if (
      criteria.maxErrorRate !== undefined &&
      metrics.errorRate > criteria.maxErrorRate
    ) {
      failures.push(
        `Error rate (${(metrics.errorRate * 100).toFixed(2)}%) exceeds target (${(criteria.maxErrorRate * 100).toFixed(2)}%)`
      );
    }

    if (
      criteria.maxMonthlyCost !== undefined &&
      metrics.monthlyCost > criteria.maxMonthlyCost
    ) {
      failures.push(
        `Monthly cost ($${metrics.monthlyCost.toFixed(0)}) exceeds budget ($${criteria.maxMonthlyCost})`
      );
    }

    if (
      criteria.minAvailability !== undefined &&
      metrics.availability < criteria.minAvailability
    ) {
      failures.push(
        `Availability (${(metrics.availability * 100).toFixed(1)}%) below target (${(criteria.minAvailability * 100).toFixed(1)}%)`
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
    graph: SystemGraph
  ): string {
    let explanation = '';

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

      // Detect empty/incomplete design and provide educational guidance
      const isEmptyDesign = this.detectEmptyDesign(graph, metrics);

      if (isEmptyDesign) {
        explanation += this.generateEmptyDesignGuidance(testCase, graph);
      } else {
        explanation += `Failures:\n`;
        failures.forEach((failure) => {
          explanation += `- ${failure}\n`;
        });

        if (bottlenecks.length > 0) {
          explanation += `\n🔍 Bottlenecks Detected:\n`;
          bottlenecks.forEach((b) => {
            explanation += `\n${b.componentId} (${b.componentType}):\n`;
            explanation += `  Issue: ${b.issue}\n`;
            explanation += `  Utilization: ${(b.utilization * 100).toFixed(0)}%\n`;
            explanation += `  💡 Recommendation: ${b.recommendation}\n`;
          });
        }

        explanation += `\nActual Metrics:\n`;
        explanation += `- p99 Latency: ${metrics.p99Latency.toFixed(1)}ms\n`;
        explanation += `- Error Rate: ${(metrics.errorRate * 100).toFixed(2)}%\n`;
        explanation += `- Monthly Cost: $${metrics.monthlyCost.toFixed(0)}\n`;
        explanation += `- Availability: ${(metrics.availability * 100).toFixed(1)}%\n`;
      }
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
    const clients = graph.components.filter(c => c.type === 'client');
    const hasClientConnection = clients.some(client =>
      graph.connections.some(conn => conn.from === client.id)
    );

    if (!hasClientConnection) {
      return true;
    }

    return false;
  }

  /**
   * Generate educational guidance for empty/incomplete designs
   */
  private generateEmptyDesignGuidance(testCase: TestCase, graph: SystemGraph): string {
    let guidance = '';

    // Check what's missing
    const clients = graph.components.filter(c => c.type === 'client');
    const appServers = graph.components.filter(c => c.type === 'app_server');
    const databases = graph.components.filter(c =>
      c.type === 'postgresql' || c.type === 'mongodb' || c.type === 'cassandra'
    );
    const hasConnections = graph.connections.length > 0;

    guidance += `🔴 No valid request path found!\n\n`;

    if (testCase.type === 'functional') {
      guidance += `This is a **Functional Requirement** test - it checks if your system can handle basic requests.\n\n`;
    }

    guidance += `📋 What's missing:\n`;

    if (appServers.length === 0) {
      guidance += `• ❌ No App Server component found\n`;
    } else {
      guidance += `• ✅ App Server present\n`;
    }

    if (databases.length === 0) {
      guidance += `• ❌ No Database component found\n`;
    } else {
      guidance += `• ✅ Database present\n`;
    }

    if (!hasConnections) {
      guidance += `• ❌ No connections between components\n`;
    } else {
      const clientConnected = clients.some(client =>
        graph.connections.some(conn => conn.from === client.id)
      );
      if (!clientConnected) {
        guidance += `• ❌ Client not connected to any component\n`;
      } else {
        guidance += `• ✅ Client connected\n`;
      }
    }

    guidance += `\n💡 To fix this:\n`;
    guidance += `1. Drag an **App Server** from the right panel onto the canvas\n`;
    guidance += `2. Drag a **Database** (PostgreSQL, MongoDB, or Cassandra) onto the canvas\n`;
    guidance += `3. Connect them: **Client → App Server → Database**\n`;
    guidance += `   (Click and drag from one component's edge to another)\n\n`;

    guidance += `🎯 Goal: Create a complete request path so the system can:\n`;
    if (testCase.traffic.type === 'write' || testCase.traffic.type === 'mixed') {
      guidance += `• Accept write requests (create short URLs)\n`;
    }
    if (testCase.traffic.type === 'read' || testCase.traffic.type === 'mixed') {
      guidance += `• Handle read requests (redirect to original URLs)\n`;
    }
    guidance += `• Store and retrieve data reliably\n`;

    return guidance;
  }
}
