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
    const { metrics, componentMetrics } = this.engine.simulateTraffic(
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
      bottlenecks
    );

    return {
      passed,
      metrics,
      bottlenecks,
      explanation,
      componentMetrics,
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
    bottlenecks: any[]
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

    return explanation;
  }
}
