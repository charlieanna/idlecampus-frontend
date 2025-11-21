import { SystemGraph } from '../types/graph';
import { TestCase, TestResult, PassCriteria, TestMetrics } from '../types/testCase';
import { SimulationEngine } from './engine';

/**
 * Test Runner
 * Executes test cases and evaluates pass/fail criteria
 */
export class TestRunner {
  private engine: SimulationEngine;
  private pythonCode: string = '';

  constructor() {
    this.engine = new SimulationEngine();
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

    // Debug logging for L6 tests
    if (criteria.maxP50Latency !== undefined || criteria.maxP90Latency !== undefined) {
      console.log('[checkPassCriteria] Percentile validation:', {
        p50: { actual: metrics.p50Latency, target: criteria.maxP50Latency },
        p90: { actual: metrics.p90Latency, target: criteria.maxP90Latency },
        p95: { actual: metrics.p95Latency, target: criteria.maxP95Latency },
        p99: { actual: metrics.p99Latency, target: criteria.maxP99Latency },
      });
    }

    if (
      criteria.maxP50Latency !== undefined &&
      metrics.p50Latency !== undefined &&
      metrics.p50Latency > criteria.maxP50Latency
    ) {
      failures.push(
        `p50 latency (${metrics.p50Latency.toFixed(1)}ms) exceeds target (${criteria.maxP50Latency}ms)`
      );
    }

    if (
      criteria.maxP90Latency !== undefined &&
      metrics.p90Latency !== undefined &&
      metrics.p90Latency > criteria.maxP90Latency
    ) {
      failures.push(
        `p90 latency (${metrics.p90Latency.toFixed(1)}ms) exceeds target (${criteria.maxP90Latency}ms)`
      );
    }

    if (
      criteria.maxP95Latency !== undefined &&
      metrics.p95Latency !== undefined &&
      metrics.p95Latency > criteria.maxP95Latency
    ) {
      failures.push(
        `p95 latency (${metrics.p95Latency.toFixed(1)}ms) exceeds target (${criteria.maxP95Latency}ms)`
      );
    }

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
      criteria.maxMonthlyCost !== undefined
    ) {
      // Use infrastructure cost (excludes CDN/S3 operational costs) for budget validation
      // If infrastructureCost is not available, fall back to monthlyCost for backward compatibility
      const costToCheck = metrics.infrastructureCost ?? metrics.monthlyCost;
      if (costToCheck > criteria.maxMonthlyCost) {
        failures.push(
          `Monthly cost ($${costToCheck.toFixed(0)}) exceeds budget ($${criteria.maxMonthlyCost})`
        );
      }
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
    return `${testCase.requirement} failed. Please review your design.\n`;
  }
}
