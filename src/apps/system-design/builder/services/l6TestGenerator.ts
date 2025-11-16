/**
 * Google L6-Level Test Case Generator
 *
 * Automatically generates comprehensive NFR test cases for any system design problem
 * Following Google L6 standards: percentiles, distributions, time variance, durability
 */

import { TestCase, Challenge } from '../types/testCase';
import { L6LatencyMetrics, L6TimeVariance, L6Distribution } from '../types/l6Metrics';

/**
 * L6 Test Templates - Can be applied to any system
 */
export interface L6TestTemplate {
  category: 'latency' | 'scalability' | 'reliability' | 'durability' | 'distribution';
  generateTests: (baseRps: number, readRatio: number) => TestCase[];
}

/**
 * Generate L6-compliant test cases for any challenge
 */
export class L6TestGenerator {

  /**
   * Helper to create a test case with RPS fields
   */
  private static createTestCase(
    name: string,
    baseRps: number,
    readRatio: number,
    rpsMultiplier: number = 1,
    passCriteria: any = {},
    additionalFields: any = {}
  ): TestCase {
    const totalRps = baseRps * rpsMultiplier;
    return {
      name,
      totalRps,
      readRps: totalRps * readRatio,
      writeRps: totalRps * (1 - readRatio),
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
      ...this.generateDurabilityTests(baselineMetrics),
      ...this.generateDistributionTests(baselineMetrics),
    ];

    // Add L6 NFRs to requirements
    const l6Nfrs = this.generateL6Nfrs(baselineMetrics);

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
        'Prevent cascading failures in distributed systems',
      ],
    };
  }

  /**
   * Extract baseline metrics from existing challenge
   */
  private static extractBaselineMetrics(challenge: Challenge): any {
    // Parse traffic requirements (e.g., "1000 RPS reads, 100 RPS writes")
    const trafficStr = challenge.requirements.traffic || '100 RPS';
    const rpsMatch = trafficStr.match(/(\d+)\s*RPS/i);
    const baseRps = rpsMatch ? parseInt(rpsMatch[1]) : 100;

    // Determine read/write ratio
    const hasWrites = trafficStr.toLowerCase().includes('write');
    const readRatio = hasWrites ? 0.9 : 1.0; // Default 90% reads if mixed

    // Parse latency requirement
    const latencyStr = challenge.requirements.latency || 'p99 < 100ms';
    const p99Match = latencyStr.match(/p99\s*<?\s*(\d+)/i);
    const targetP99 = p99Match ? parseInt(p99Match[1]) : 100;

    // Determine system type
    const systemType = this.inferSystemType(challenge);

    return {
      baseRps,
      readRatio,
      targetP99,
      systemType,
      challengeId: challenge.id,
    };
  }

  /**
   * Infer system type from challenge description
   */
  private static inferSystemType(challenge: Challenge): string {
    const desc = challenge.description.toLowerCase();
    const title = challenge.title.toLowerCase();

    if (desc.includes('social') || desc.includes('feed') || desc.includes('timeline')) {
      return 'social';
    } else if (desc.includes('e-commerce') || desc.includes('payment') || desc.includes('checkout')) {
      return 'ecommerce';
    } else if (desc.includes('stream') || desc.includes('video') || desc.includes('live')) {
      return 'streaming';
    } else if (desc.includes('search') || desc.includes('index')) {
      return 'search';
    } else if (desc.includes('message') || desc.includes('chat') || desc.includes('real-time')) {
      return 'messaging';
    }
    return 'general';
  }

  /**
   * Generate L6 latency profile tests
   */
  private static generateLatencyTests(metrics: any): TestCase[] {
    const { baseRps, readRatio, targetP99 } = metrics;

    return [
      {
        name: 'L6 Latency Profile - Full Percentiles',
        totalRps: baseRps,
        readRps: baseRps * readRatio,
        writeRps: baseRps * (1 - readRatio),
        type: 'performance',
        requirement: 'L6-LAT-1',
        description: `Verify system meets L6 latency percentiles. NEVER use average!
        Target: P50 < ${targetP99/3}ms, P90 < ${targetP99*0.7}ms, P95 < ${targetP99*0.85}ms, P99 < ${targetP99}ms, P999 < ${targetP99*2}ms`,
        traffic: {
          type: 'mixed',
          rps: baseRps,
          readRatio,
        },
        duration: 300, // 5 minutes for statistical significance
        passCriteria: {
          maxP50Latency: targetP99 / 3,
          maxP90Latency: targetP99 * 0.7,
          maxP95Latency: targetP99 * 0.85,
          maxP99Latency: targetP99,
          // P999 would be targetP99 * 2
          maxErrorRate: 0.001,
        },
      },
      {
        name: 'L6 Tail Latency Amplification',
        totalRps: baseRps,
        readRps: baseRps * readRatio,
        writeRps: baseRps * (1 - readRatio),
        type: 'performance',
        requirement: 'L6-LAT-2',
        description: `Test tail amplification factor. In distributed systems, P99 compounds!
        Target: P99/P50 ratio < 3.5x (good), < 5x (acceptable), > 10x (bad)`,
        traffic: {
          type: 'mixed',
          rps: baseRps,
          readRatio,
        },
        duration: 60,
        passCriteria: {
          maxP99Latency: targetP99 * 1.5, // Allow some degradation
          maxErrorRate: 0.01,
          // Ideally check P99/P50 < 3.5
        },
      },
    ];
  }

  /**
   * Generate L6 scalability tests with time variance
   */
  private static generateScalabilityTests(metrics: any): TestCase[] {
    const { baseRps, readRatio, systemType } = metrics;

    // Different multipliers based on system type
    const multipliers = this.getTrafficMultipliers(systemType);

    return [
      {
        name: 'L6 Peak Hour (3x traffic)',
        totalRps: baseRps * multipliers.peakHour,
        readRps: (baseRps * multipliers.peakHour) * readRatio,
        writeRps: (baseRps * multipliers.peakHour) * (1 - readRatio),
        type: 'scalability',
        requirement: 'L6-SCALE-1',
        description: `Handle ${multipliers.peakHour}x traffic during daily peak hours.
        This happens EVERY DAY - design for it as normal, not exceptional!`,
        traffic: {
          type: 'mixed',
          rps: baseRps * multipliers.peakHour,
          readRatio,
        },
        duration: 120,
        passCriteria: {
          maxP99Latency: metrics.targetP99 * 1.5, // Allow 50% degradation
          maxErrorRate: 0.01,
          minAvailability: 0.999,
        },
      },
      {
        name: 'L6 Viral Event (10x spike)',
        totalRps: baseRps * multipliers.viral,
        readRps: (baseRps * multipliers.viral) * Math.min(0.98, readRatio + 0.08),
        writeRps: (baseRps * multipliers.viral) * (1 - Math.min(0.98, readRatio + 0.08)),
        type: 'scalability',
        requirement: 'L6-SCALE-2',
        description: `Survive ${multipliers.viral}x traffic during viral event.
        For social media: celebrity posts. For e-commerce: flash sales. For streaming: live events.`,
        traffic: {
          type: 'mixed',
          rps: baseRps * multipliers.viral,
          readRatio: Math.min(0.98, readRatio + 0.08), // More reads during viral
        },
        duration: 60,
        passCriteria: {
          maxP99Latency: metrics.targetP99 * 3, // OK to degrade significantly
          maxErrorRate: 0.05, // 5% errors acceptable
          minAvailability: 0.95, // Just don't crash!
        },
      },
      {
        name: 'L6 Seasonal Peak (Black Friday)',
        totalRps: baseRps * multipliers.seasonal,
        readRps: (baseRps * multipliers.seasonal) * readRatio,
        writeRps: (baseRps * multipliers.seasonal) * (1 - readRatio),
        type: 'scalability',
        requirement: 'L6-SCALE-3',
        description: `Handle ${multipliers.seasonal}x traffic during seasonal peaks.
        E-commerce: Black Friday. Social: New Year's Eve. Streaming: Super Bowl.`,
        traffic: {
          type: 'mixed',
          rps: baseRps * multipliers.seasonal,
          readRatio,
        },
        duration: 180,
        passCriteria: {
          maxP99Latency: metrics.targetP99 * 2,
          maxErrorRate: 0.02,
          minAvailability: 0.99,
        },
      },
    ];
  }

  /**
   * Generate L6 reliability tests
   */
  private static generateReliabilityTests(metrics: any): TestCase[] {
    const { baseRps, readRatio } = metrics;

    return [
      {
        name: 'L6 Cascading Failure Prevention',
        type: 'reliability',
        requirement: 'L6-REL-1',
        description: `Cache fails → DB overload → connection exhaustion → total failure.
        Test cascade prevention with circuit breakers and bulkheads.`,
        traffic: {
          type: 'mixed',
          rps: baseRps,
          readRatio,
        },
        duration: 120,
        failureInjection: {
          type: 'cache_flush',
          atSecond: 30,
        },
        passCriteria: {
          maxP99Latency: metrics.targetP99 * 3,
          maxErrorRate: 0.05,
          minAvailability: 0.95, // Degraded but alive
        },
      },
      {
        name: 'L6 Gray Failure Detection',
        type: 'reliability',
        requirement: 'L6-REL-2',
        description: `Component partially fails (slow but not dead).
        These are hardest to detect but cause most outages in practice.`,
        traffic: {
          type: 'mixed',
          rps: baseRps,
          readRatio,
        },
        duration: 120,
        failureInjection: {
          type: 'latency_injection',
          atSecond: 30,
          latencyMs: 5000, // Make one component very slow
        },
        passCriteria: {
          maxP99Latency: metrics.targetP99 * 2,
          maxErrorRate: 0.02,
          minAvailability: 0.99,
        },
      },
    ];
  }

  /**
   * Generate L6 durability tests
   */
  private static generateDurabilityTests(metrics: any): TestCase[] {
    const { baseRps, readRatio, systemType } = metrics;

    // Determine criticality based on system type
    const isCritical = ['ecommerce', 'messaging'].includes(systemType);

    return [
      {
        name: isCritical ? 'L6 Zero Data Loss (Critical)' : 'L6 Acceptable Data Loss Window',
        type: 'reliability',
        requirement: 'L6-DUR-1',
        description: isCritical
          ? `ZERO data loss acceptable. RPO = 0, RTO < 60s. Every transaction matters!`
          : `Small data loss window acceptable (< 5 min). Focus on availability over consistency.`,
        traffic: {
          type: 'mixed',
          rps: baseRps,
          readRatio,
        },
        duration: 180,
        failureInjection: {
          type: 'db_crash',
          atSecond: 60,
          recoverySecond: 120,
        },
        passCriteria: {
          minAvailability: isCritical ? 0.999 : 0.99,
          maxErrorRate: isCritical ? 0.001 : 0.01,
          // In real L6, verify actual data loss
        },
      },
    ];
  }

  /**
   * Generate L6 distribution tests (power law, hot partitions)
   */
  private static generateDistributionTests(metrics: any): TestCase[] {
    const { baseRps, readRatio, systemType } = metrics;

    return [
      {
        name: 'L6 Power Law Distribution (80/20)',
        type: 'performance',
        requirement: 'L6-DIST-1',
        description: `80% of traffic hits 20% of content (power law).
        Top 1% of items get 10% of all traffic. Cache is EXTREMELY effective!`,
        traffic: {
          type: 'mixed',
          rps: baseRps,
          readRatio,
          // In real L6, model skewed access pattern
        },
        duration: 120,
        passCriteria: {
          maxP99Latency: metrics.targetP99,
          maxErrorRate: 0.001,
        },
      },
      {
        name: 'L6 Hot Partition Resilience',
        type: 'performance',
        requirement: 'L6-DIST-2',
        description: `One partition gets 10x normal traffic (celebrity user, trending topic).
        System must not let hot partition affect others.`,
        traffic: {
          type: 'mixed',
          rps: baseRps * 1.5, // Some increase due to hot item
          readRatio,
        },
        duration: 60,
        passCriteria: {
          maxP99Latency: metrics.targetP99 * 1.5,
          maxErrorRate: 0.01,
        },
      },
    ];
  }

  /**
   * Get traffic multipliers based on system type
   */
  private static getTrafficMultipliers(systemType: string): any {
    const multipliers: Record<string, any> = {
      social: {
        peakHour: 3,
        viral: 10,
        seasonal: 5,
      },
      ecommerce: {
        peakHour: 2,
        viral: 5,
        seasonal: 20, // Black Friday!
      },
      streaming: {
        peakHour: 4,
        viral: 8,
        seasonal: 10, // Super Bowl
      },
      search: {
        peakHour: 2,
        viral: 3,
        seasonal: 2,
      },
      messaging: {
        peakHour: 3,
        viral: 5,
        seasonal: 10, // New Year's Eve
      },
      general: {
        peakHour: 3,
        viral: 5,
        seasonal: 5,
      },
    };

    return multipliers[systemType] || multipliers.general;
  }

  /**
   * Generate L6 NFRs for requirements section
   */
  private static generateL6Nfrs(metrics: any): string[] {
    const { targetP99, systemType } = metrics;

    const baseNfrs = [
      `Latency: P50 < ${targetP99/3}ms, P90 < ${targetP99*0.7}ms, P99 < ${targetP99}ms, P999 < ${targetP99*2}ms`,
      'Tail Amplification: P99/P50 ratio must be < 3.5x',
      'Distribution: 80% of traffic to 20% of content (power law)',
      'Hot Partition: Top 1% of items get 10% of traffic',
    ];

    // Add system-specific NFRs
    const systemSpecificNfrs: Record<string, string[]> = {
      social: [
        'Viral Traffic: Handle 10x spikes from celebrity posts',
        'User Distribution: P50 user has 100 friends, P99 has 10K friends',
      ],
      ecommerce: [
        'Data Durability: ZERO order loss acceptable (RPO = 0)',
        'Seasonal: 20x traffic on Black Friday',
        'Cart Size: P50 = 3 items, P99 = 50 items',
      ],
      streaming: [
        'Live Events: 10x concurrent viewers during premieres',
        'Bitrate Adaptation: P50 = 1080p, P99 = 4K',
      ],
      search: [
        'Query Complexity: P50 = 2 terms, P99 = 10 terms',
        'Result Size: P50 = 10 results, P99 = 1000 results',
      ],
      messaging: [
        'Message Delivery: < 100ms end-to-end P99',
        'Group Size: P50 = 5 members, P99 = 500 members',
      ],
    };

    const specific = systemSpecificNfrs[systemType] || [];

    return [...baseNfrs, ...specific];
  }

  /**
   * Generate L6 hints for common failures
   */
  static generateL6Hints(challengeId: string): any[] {
    return [
      {
        trigger: 'test_failed:L6 Latency Profile',
        message: `💡 Failed L6 latency requirements! Remember:

**The L6 Way:**
- NEVER optimize for average - optimize for P99
- P99 is where GC, slow queries, network issues live
- At 1000 RPS, P99 = 10 req/sec at worst latency

**Solutions:**
1. More instances (reduce per-instance GC impact)
2. Bigger cache (reduce P90-P99 cache misses)
3. Database replicas (reduce P99 DB latency)
4. Connection pooling (reduce connection overhead)`,
      },
      {
        trigger: 'test_failed:L6 Viral Event',
        message: `💡 Can't handle viral traffic! At L6 level:

**Key Insight:**
- Viral happens daily somewhere in your system
- Design for 10x as normal, not exceptional
- P99 can only degrade 2-3x even at 10x traffic

**L6 Solutions:**
1. Pre-warmed auto-scaling pools
2. Leverage power law (cache the viral content)
3. Graceful degradation (serve stale on overload)
4. Bulkheads (isolate viral traffic)`,
      },
      {
        trigger: 'test_failed:L6 Power Law',
        message: `💡 Not leveraging power law distribution!

**L6 Reality:**
- 80% of traffic → 20% of content
- Top 1% items → 10% of all traffic
- Cache is INSANELY effective here

**Smart Design:**
1. Small cache captures most traffic
2. Use LFU (not LRU) for hot data
3. Shard by popularity tiers
4. CDN for the ultra-hot content`,
      },
    ];
  }
}

/**
 * Helper to automatically enhance all existing challenges
 */
export function enhanceAllChallenges(challenges: Challenge[]): Challenge[] {
  return challenges.map(challenge => {
    // Skip if already L6-enhanced
    if (challenge.id.includes('_l6')) {
      return challenge;
    }

    // Check if has basic NFR tests
    const hasNfrTests = challenge.testCases.some(tc =>
      tc.type === 'performance' || tc.type === 'scalability'
    );

    // Only enhance challenges that have some NFR focus
    if (hasNfrTests) {
      const enhanced = L6TestGenerator.enhanceChallenge(challenge);
      // Add L6 hints
      enhanced.hints = [
        ...(enhanced.hints || []),
        ...L6TestGenerator.generateL6Hints(challenge.id),
      ];
      return enhanced;
    }

    return challenge;
  });
}

/**
 * Template for creating new L6-compliant challenges
 */
export function createL6Challenge(
  title: string,
  description: string,
  baseRps: number = 1000,
  readWriteRatio: number = 0.9
): Challenge {
  const baseChallenge: Challenge = {
    id: title.toLowerCase().replace(/\s+/g, '_') + '_l6',
    title: `${title} (L6 Standards)`,
    difficulty: 'advanced',
    description: `${description}

**L6 Principle:** NEVER use "average" latency. P99+ is where interesting things happen.`,
    requirements: {
      functional: [],
      traffic: `${baseRps} RPS baseline, ${baseRps * 10} RPS peak`,
      latency: 'P50 < 50ms, P99 < 200ms, P999 < 1000ms',
      availability: '99.99% (four 9s)',
      budget: '$5000/month',
    },
    availableComponents: [
      'client', 'load_balancer', 'app_server',
      'cache', 'database', 'message_queue', 'cdn', 's3'
    ],
    testCases: [],
    learningObjectives: [],
  };

  // Auto-generate L6 tests
  return L6TestGenerator.enhanceChallenge(baseChallenge);
}