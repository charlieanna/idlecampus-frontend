import { describe, it, expect } from 'vitest';
import { TestRunner } from '../simulation/testRunner';
import { webCrawlerChallenge } from '../challenges/webCrawler';
import { SystemGraph } from '../types/graph';

describe('Web Crawler Challenge', () => {
  const runner = new TestRunner();

  // Convert solution to SystemGraph
  function solutionToGraph(solution: any): SystemGraph {
    const components = solution.components.map((comp: any, idx: number) => ({
      id: `${comp.type}_${idx}`,
      type: comp.type,
      config: comp.config,
    }));

    const connections = solution.connections.map((conn: any) => {
      const fromComp = solution.components.find((c: any) => c.type === conn.from);
      const toComp = solution.components.find((c: any) => c.type === conn.to);
      const fromIdx = solution.components.indexOf(fromComp);
      const toIdx = solution.components.indexOf(toComp);
      
      return {
        from: `${conn.from}_${fromIdx}`,
        to: `${conn.to}_${toIdx}`,
        type: 'read_write' as const,
      };
    });

    return { components, connections };
  }

  const graph = solutionToGraph(webCrawlerChallenge.solution!);

  describe('Solution Components', () => {
    it('should have all required components', () => {
      const componentTypes = new Set(
        webCrawlerChallenge.solution!.components.map((c) => c.type)
      );

      expect(componentTypes.has('client')).toBe(true);
      expect(componentTypes.has('load_balancer')).toBe(true);
      expect(componentTypes.has('app_server')).toBe(true);
      expect(componentTypes.has('worker')).toBe(true);
      expect(componentTypes.has('message_queue')).toBe(true);
      expect(componentTypes.has('redis')).toBe(true);
      expect(componentTypes.has('postgresql')).toBe(true);
      expect(componentTypes.has('s3')).toBe(true);
    });

    it('should have proper worker configuration', () => {
      const worker = webCrawlerChallenge.solution!.components.find(
        (c) => c.type === 'worker'
      );
      expect(worker).toBeDefined();
      expect(worker?.config?.instances).toBeGreaterThanOrEqual(5);
    });

    it('should have database replication enabled', () => {
      const db = webCrawlerChallenge.solution!.components.find(
        (c) => c.type === 'postgresql'
      );
      expect(db).toBeDefined();
      expect(db?.config?.replication?.enabled).toBe(true);
      expect(db?.config?.replication?.replicas).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Test Cases Validation', () => {
    it('should have 7 test cases', () => {
      expect(webCrawlerChallenge.testCases).toHaveLength(7);
    });

    it('should cover all test types', () => {
      const types = new Set(webCrawlerChallenge.testCases.map((tc) => tc.type));
      expect(types.has('functional')).toBe(true);
      expect(types.has('performance')).toBe(true);
      expect(types.has('scalability')).toBe(true);
      expect(types.has('reliability')).toBe(true);
    });

    it('should run all test cases against the solution', () => {
      const results = webCrawlerChallenge.testCases.map((testCase) => {
        const result = runner.runTestCase(graph, testCase);
        return {
          name: testCase.name,
          passed: result.passed,
          metrics: result.metrics,
          explanation: result.explanation,
        };
      });

      console.log('\n🧪 Web Crawler Test Results:');
      console.log('='.repeat(60));
      
      results.forEach((result, idx) => {
        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`\n${idx + 1}. ${status} - ${result.name}`);
        console.log(`   Latency: ${result.metrics.p99Latency.toFixed(2)}ms`);
        console.log(`   Error Rate: ${(result.metrics.errorRate * 100).toFixed(2)}%`);
        console.log(`   Availability: ${(result.metrics.availability * 100).toFixed(2)}%`);
        if (!result.passed) {
          console.log(`   Reason: ${result.explanation.substring(0, 150)}...`);
        }
      });

      const passedCount = results.filter((r) => r.passed).length;
      const totalCount = results.length;

      console.log('\n' + '='.repeat(60));
      console.log(`📊 Summary: ${passedCount}/${totalCount} tests passed`);
      console.log('='.repeat(60));

      // Assert that most tests pass (at least 14/16 based on user report)
      expect(passedCount).toBeGreaterThanOrEqual(6); // At least 6/7 should pass
    });
  });

  describe('Individual Test Cases', () => {
    it('FR-1: Basic Crawl Pipeline should pass', () => {
      const testCase = webCrawlerChallenge.testCases[0];
      const result = runner.runTestCase(graph, testCase);
      
      if (!result.passed) {
        console.log('FR-1 Failed:', result.explanation);
      }
      
      expect(result.passed).toBe(true);
    });

    it('FR-2: URL Frontier Management should pass', () => {
      const testCase = webCrawlerChallenge.testCases[1];
      const result = runner.runTestCase(graph, testCase);
      
      if (!result.passed) {
        console.log('FR-2 Failed:', result.explanation);
      }
      
      expect(result.passed).toBe(true);
    });

    it('FR-3: Duplicate Control should pass', () => {
      const testCase = webCrawlerChallenge.testCases[2];
      const result = runner.runTestCase(graph, testCase);
      
      if (!result.passed) {
        console.log('FR-3 Failed:', result.explanation);
      }
      
      expect(result.passed).toBe(true);
    });

    it('NFR-P1: Steady Crawl Throughput should pass', () => {
      const testCase = webCrawlerChallenge.testCases[3];
      const result = runner.runTestCase(graph, testCase);
      
      if (!result.passed) {
        console.log('NFR-P1 Failed:', result.explanation);
        console.log('NFR-P1 Metrics:', {
          p99Latency: result.metrics.p99Latency,
          errorRate: result.metrics.errorRate,
          monthlyCost: result.metrics.monthlyCost,
          infrastructureCost: result.metrics.infrastructureCost,
        });
        console.log('NFR-P1 Pass Criteria:', testCase.passCriteria);
      }
      
      expect(result.passed).toBe(true);
    });

    it('NFR-P2: Peak Crawl Burst should pass', () => {
      const testCase = webCrawlerChallenge.testCases[4];
      const result = runner.runTestCase(graph, testCase);
      
      if (!result.passed) {
        console.log('NFR-P2 Failed:', result.explanation);
      }
      
      expect(result.passed).toBe(true);
    });

    it('NFR-S1: Many Domains Crawl should pass', () => {
      const testCase = webCrawlerChallenge.testCases[5];
      const result = runner.runTestCase(graph, testCase);
      
      if (!result.passed) {
        console.log('NFR-S1 Failed:', result.explanation);
      }
      
      expect(result.passed).toBe(true);
    });

    it('NFR-R1: Database Failure should pass', () => {
      const testCase = webCrawlerChallenge.testCases[6];
      const result = runner.runTestCase(graph, testCase);
      
      if (!result.passed) {
        console.log('NFR-R1 Failed:', result.explanation);
      }
      
      expect(result.passed).toBe(true);
    });
  });
});