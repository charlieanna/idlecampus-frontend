/**
 * Google L6-Level Test Case Generator (Fixed version with proper RPS fields)
 *
 * Automatically generates comprehensive NFR test cases for any system design problem
 * Following Google L6 standards: percentiles, distributions, time variance, durability
 */

import { TestCase, Challenge } from '../types/testCase';

/**
 * Generate L6-compliant test cases for any challenge
 */
export class L6TestGenerator {

  /**
   * Helper to create a test case with RPS fields properly set
   */
  private static createTestCase(
    name: string,
    baseRps: number,
    readRatio: number,
    rpsMultiplier: number = 1,
    passCriteria: any = {},
    additionalFields: any = {}
  ): TestCase {
    const totalRps = Math.floor(baseRps * rpsMultiplier);
    const readRps = Math.floor(totalRps * readRatio);
    const writeRps = totalRps - readRps;

    return {
      name,
      type: 'performance' as const,
      requirement: 'NFR-L6',
      description: `L6-level test: ${name}`,
      traffic: {
        type: 'mixed' as const,
        rps: totalRps,
        readRatio,
        readRps,
        writeRps,
      },
      duration: 60, // 60 seconds for L6 tests
      passCriteria,
      ...additionalFields,
    };
  }

  /**
   * Enhance any challenge with L6-level NFR tests
   */
  static enhanceChallenge(challenge: Challenge): Challenge {
    // Extract baseline metrics from existing tests or requirements
    const baselineMetrics = this.extractBaselineMetrics(challenge);

    // Generate L6 test suites
    const l6Tests: TestCase[] = [
      ...this.generateLatencyTests(baselineMetrics),
      ...this.generateScalabilityTests(baselineMetrics),
      ...this.generateReliabilityTests(baselineMetrics),
    ];

    // Add L6 NFRs to requirements
    const l6Nfrs = [
      `Latency: P50 < ${Math.floor(baselineMetrics.targetP99/3)}ms, P99 < ${baselineMetrics.targetP99}ms (NEVER use averages!)`,
      'Traffic Variance: Handle 3x daily peaks, 10x viral spikes',
      'Data Durability: Zero data loss for critical operations',
      'Distribution: Apply 80/20 rule (20% content gets 80% traffic)',
    ];

    return {
      ...challenge,
      requirements: {
        ...challenge.requirements,
        nfrs: [...(challenge.requirements.nfrs || []), ...l6Nfrs],
      },
      testCases: [...challenge.testCases, ...l6Tests],
      learningObjectives: [
        ...challenge.learningObjectives,
        'Understand percentile-based latency (P50, P90, P95, P99, P999)',
        'Model time-based traffic variance and viral events',
        'Apply power law distribution (80/20 rule)',
        'Design for zero data loss (RPO=0) when critical',
      ],
    };
  }

  /**
   * Extract baseline metrics from existing challenge
   */
  private static extractBaselineMetrics(challenge: Challenge): any {
    // Get from first test case if available
    const firstTest = challenge.testCases[0];
    if (firstTest && firstTest.totalRps) {
      return {
        baseRps: firstTest.totalRps,
        readRatio: firstTest.readRps ? firstTest.readRps / firstTest.totalRps : 0.9,
        targetP99: firstTest.passCriteria?.maxP99Latency || 100,
        systemType: this.inferSystemType(challenge),
        challengeId: challenge.id,
      };
    }

    // Otherwise parse from requirements
    const trafficStr = challenge.requirements.traffic || '1000 RPS';
    const rpsMatch = trafficStr.match(/(\d+)(?:K|k)?\s*RPS/i);
    let baseRps = 1000;
    if (rpsMatch) {
      baseRps = parseInt(rpsMatch[1]);
      if (trafficStr.toLowerCase().includes('k')) {
        baseRps *= 1000;
      }
    }

    const latencyStr = challenge.requirements.latency || 'P99 < 100ms';
    const p99Match = latencyStr.match(/[Pp]99\s*<?\s*(\d+)/);
    const targetP99 = p99Match ? parseInt(p99Match[1]) : 100;

    return {
      baseRps,
      readRatio: 0.9, // Default 90% reads
      targetP99,
      systemType: this.inferSystemType(challenge),
      challengeId: challenge.id,
    };
  }

  /**
   * Infer system type from challenge
   */
  private static inferSystemType(challenge: Challenge): string {
    const text = (challenge.title + ' ' + challenge.description).toLowerCase();

    if (text.includes('social') || text.includes('feed') || text.includes('timeline')) {
      return 'social';
    } else if (text.includes('e-commerce') || text.includes('payment') || text.includes('checkout')) {
      return 'ecommerce';
    } else if (text.includes('stream') || text.includes('video')) {
      return 'streaming';
    }
    return 'general';
  }

  /**
   * Get traffic multipliers based on system type
   */
  private static getTrafficMultipliers(systemType: string) {
    switch (systemType) {
      case 'social':
        return { peakHour: 3, viral: 10, seasonal: 5 };
      case 'ecommerce':
        return { peakHour: 3, viral: 5, seasonal: 20 }; // Black Friday
      case 'streaming':
        return { peakHour: 2, viral: 8, seasonal: 10 }; // Live events
      default:
        return { peakHour: 3, viral: 10, seasonal: 5 };
    }
  }

  /**
   * Generate L6 latency profile tests
   */
  private static generateLatencyTests(metrics: any): TestCase[] {
    const { baseRps, readRatio, targetP99 } = metrics;

    return [
      this.createTestCase(
        'L6 Latency Profile - Full Percentiles',
        baseRps,
        readRatio,
        1,
        {
          maxP50Latency: Math.floor(targetP99 / 3),
          maxP90Latency: Math.floor(targetP99 * 0.7),
          maxP95Latency: Math.floor(targetP99 * 0.85),
          maxP99Latency: targetP99,
          maxErrorRate: 0.001,
        }
      ),
      this.createTestCase(
        'L6 Tail Latency Amplification Check',
        baseRps,
        readRatio,
        1,
        {
          maxP99Latency: targetP99 * 1.5,
          maxErrorRate: 0.001,
        }
      ),
    ];
  }

  /**
   * Generate L6 scalability tests
   */
  private static generateScalabilityTests(metrics: any): TestCase[] {
    const { baseRps, readRatio, targetP99, systemType } = metrics;
    const multipliers = this.getTrafficMultipliers(systemType);

    return [
      this.createTestCase(
        'L6 Peak Load (3x traffic)',
        baseRps,
        readRatio,
        multipliers.peakHour,
        {
          maxP99Latency: targetP99 * 1.5,
          maxErrorRate: 0.01,
        }
      ),
      this.createTestCase(
        'L6 Viral Event (10x spike)',
        baseRps,
        Math.min(0.98, readRatio + 0.08), // More reads during viral
        multipliers.viral,
        {
          maxP99Latency: targetP99 * 3,
          maxErrorRate: 0.05,
        }
      ),
      this.createTestCase(
        'L6 Seasonal Peak',
        baseRps,
        readRatio,
        multipliers.seasonal,
        {
          maxP99Latency: targetP99 * 2,
          maxErrorRate: 0.02,
        }
      ),
    ];
  }

  /**
   * Generate L6 reliability tests
   */
  private static generateReliabilityTests(metrics: any): TestCase[] {
    const { baseRps, readRatio, targetP99 } = metrics;

    return [
      this.createTestCase(
        'L6 Cascading Failure Prevention',
        baseRps,
        readRatio,
        1,
        {
          maxP99Latency: targetP99 * 3,
          maxErrorRate: 0.05,
        }
      ),
      this.createTestCase(
        'L6 Gray Failure Detection',
        baseRps,
        readRatio,
        1,
        {
          maxP99Latency: targetP99 * 2,
          maxErrorRate: 0.02,
        }
      ),
      this.createTestCase(
        'L6 Power Law Distribution (80/20)',
        baseRps,
        readRatio,
        1,
        {
          maxP99Latency: targetP99,
          maxErrorRate: 0.01,
        }
      ),
      this.createTestCase(
        'L6 Hot Partition Resilience',
        baseRps,
        readRatio,
        1,
        {
          maxP99Latency: targetP99 * 1.5,
          maxErrorRate: 0.01,
        }
      ),
    ];
  }
}

// Export as default to replace the original
export default L6TestGenerator;