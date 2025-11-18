import { Scenario } from '../types/problemDefinition';

/**
 * Generates comprehensive FR and NFR scenarios for a problem definition
 */

interface ScenarioConfig {
  baseRps: number; // Normal load RPS
  readRatio: number; // Read/write ratio
  maxLatency: number; // Target p99 latency in ms
  availability: number; // Target availability (0-1)
  avgFileSize?: number; // For file upload scenarios (MB)
  hasCdn?: boolean; // If CDN is needed
  hasCache?: boolean; // If caching is recommended
  hasObjectStorage?: boolean; // If S3/blob storage needed
}

/**
 * Analyze a user-facing FR and determine what architecture it needs
 */
function analyzeFeatureRequirements(fr: string): {
  requiresObjectStorage: boolean;
  requiresCache: boolean;
  requiresQueue: boolean;
  requiresSearch: boolean;
  isReadHeavy: boolean;
  isWriteHeavy: boolean;
} {
  const lowerFR = fr.toLowerCase();

  return {
    requiresObjectStorage: lowerFR.includes('photo') || lowerFR.includes('video') ||
                          lowerFR.includes('image') || lowerFR.includes('file') ||
                          lowerFR.includes('upload') || lowerFR.includes('media'),
    requiresCache: lowerFR.includes('view') || lowerFR.includes('read') ||
                  lowerFR.includes('get') || lowerFR.includes('feed') ||
                  lowerFR.includes('timeline') || lowerFR.includes('redirect'),
    requiresQueue: lowerFR.includes('notification') || lowerFR.includes('analytics') ||
                  lowerFR.includes('track') || lowerFR.includes('async') ||
                  lowerFR.includes('event'),
    requiresSearch: lowerFR.includes('search') || lowerFR.includes('find') ||
                   lowerFR.includes('query'),
    isReadHeavy: lowerFR.includes('view') || lowerFR.includes('read') ||
                lowerFR.includes('get') || lowerFR.includes('feed') ||
                lowerFR.includes('redirect'),
    isWriteHeavy: lowerFR.includes('create') || lowerFR.includes('post') ||
                 lowerFR.includes('upload') || lowerFR.includes('write') ||
                 lowerFR.includes('shorten'),
  };
}

/**
 * Generate test description for a feature
 */
function generateFeatureTestDescription(fr: string, analysis: ReturnType<typeof analyzeFeatureRequirements>): string {
  const parts: string[] = [`Verify "${fr}" works correctly.`];

  if (analysis.requiresObjectStorage) {
    parts.push('Must use object storage (S3) for files, not database.');
  }
  if (analysis.requiresCache && analysis.isReadHeavy) {
    parts.push('Should cache reads to reduce database load.');
  }
  if (analysis.requiresQueue) {
    parts.push('Should process asynchronously using message queue.');
  }
  if (analysis.requiresSearch) {
    parts.push('Must have search index for efficient queries.');
  }

  if (analysis.isReadHeavy) {
    parts.push('Test flow: Client → [Cache] → App → Database.');
  } else if (analysis.isWriteHeavy) {
    parts.push('Test flow: Client → App → Database.');
  }

  return parts.join(' ');
}

export function generateScenarios(
  problemId: string,
  config: ScenarioConfig,
  userFacingFRs?: string[]
): Scenario[] {
  const scenarios: Scenario[] = [];
  
  // Default config if none provided
  const defaultConfig: ScenarioConfig = {
    baseRps: 1000,
    readRatio: 0.9,
    maxLatency: 200,
    availability: 0.99,
    hasCdn: false,
    hasCache: false,
    hasObjectStorage: false,
  };

  // Use provided config or default
  config = config || defaultConfig;

  // ========== FUNCTIONAL REQUIREMENTS (FR) ==========
  // If userFacingFRs provided, generate feature-specific tests
  if (userFacingFRs && userFacingFRs.length > 0) {
    userFacingFRs.forEach((fr, index) => {
      const frNumber = index + 1;
      const analysis = analyzeFeatureRequirements(fr);

      // Determine traffic for this specific feature
      let rps = 10; // Default low traffic for FR tests
      let readWriteRatio = 0.5;

      if (analysis.isReadHeavy) {
        rps = 100;
        readWriteRatio = 0.9;
      } else if (analysis.isWriteHeavy) {
        rps = 50;
        readWriteRatio = 0.3;
      }

      scenarios.push({
        name: `FR-${frNumber}: ${fr.substring(0, 50)}${fr.length > 50 ? '...' : ''}`,
        description: generateFeatureTestDescription(fr, analysis),
        traffic: {
          rps,
          readWriteRatio,
          avgFileSize: analysis.requiresObjectStorage ? (config.avgFileSize || 2) : undefined,
        },
        passCriteria: {
          maxLatency: 5000, // 5 seconds - lenient for FR tests
          maxErrorRate: 0, // Must work perfectly
        },
      });
    });
  } else {
    // Fallback to generic FR tests (backward compatible)
    scenarios.push({
      name: 'FR-1: Basic Connectivity',
      description: `Verify basic connectivity path exists. Like algorithm brute force: ignore performance,
just verify Client → App → Database flow works. Very low traffic to test if system can handle basic operations.`,
      traffic: {
        rps: 1,
        readWriteRatio: config.readRatio,
        avgFileSize: config.avgFileSize,
      },
      passCriteria: {
        maxLatency: 10000,
        maxErrorRate: 0,
      },
    });

    scenarios.push({
      name: 'FR-2: Concurrent Users',
      description: `Multiple users accessing simultaneously. Test if system handles concurrent requests
without conflicts or errors. Moderate traffic to verify scalability basics.`,
      traffic: {
        rps: Math.max(50, config.baseRps * 0.1),
        readWriteRatio: config.readRatio,
        avgFileSize: config.avgFileSize,
      },
      passCriteria: {
        maxLatency: config.maxLatency * 2,
        maxErrorRate: 0.01,
      },
    });

    scenarios.push({
      name: 'FR-3: Data Persistence',
      description: `Verify data is correctly stored and retrieved. Write operations must persist data
to database. Read operations must return correct data. Tests data integrity.`,
      traffic: {
        rps: Math.max(100, config.baseRps * 0.2),
        readWriteRatio: 0.3,
        avgFileSize: config.avgFileSize,
      },
      passCriteria: {
        maxLatency: config.maxLatency * 2,
        maxErrorRate: 0,
      },
    });
  }

  // ========== PERFORMANCE REQUIREMENTS (NFR-P) ==========
  scenarios.push({
    name: 'NFR-P1: Normal Daily Load',
    description: `System handles expected daily traffic with target latency. This is the baseline performance
test - system must meet latency targets under normal conditions.`,
    traffic: {
      rps: config.baseRps,
      readWriteRatio: config.readRatio,
      avgFileSize: config.avgFileSize,
    },
    passCriteria: {
      maxLatency: config.maxLatency,
      maxErrorRate: 0.01,
      // ⚠️ Cost validation only happens at challenge level, not in individual tests
      // maxCost removed per SOLUTION_AND_TEST_PLAN.md
    },
  });

  scenarios.push({
    name: 'NFR-P2: Peak Hour Load',
    description: `Traffic increases during peak hours (${getPeakDescription(problemId)}).
System must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.`,
    traffic: {
      rps: config.baseRps * 2, // 2x peak traffic
      readWriteRatio: config.readRatio,
      avgFileSize: config.avgFileSize,
    },
    passCriteria: {
      maxLatency: config.maxLatency * 1.5, // 50% degradation OK
      maxErrorRate: 0.02,
      // ⚠️ Cost validation only happens at challenge level, not in individual tests
      // maxCost removed per SOLUTION_AND_TEST_PLAN.md
    },
  });

  // ========== SCALABILITY REQUIREMENTS (NFR-S) ==========
  scenarios.push({
    name: 'NFR-S1: Traffic Spike',
    description: `${getSpikDescription(problemId)} causes sudden 50% traffic increase.
System must handle spike gracefully without complete failure.`,
    traffic: {
      rps: config.baseRps * 1.5, // 50% spike
      readWriteRatio: config.readRatio,
      avgFileSize: config.avgFileSize,
    },
    passCriteria: {
      maxLatency: config.maxLatency * 2,
      maxErrorRate: 0.03,
    },
  });

  scenarios.push({
    name: 'NFR-S2: Viral Growth',
    description: `${getViralDescription(problemId)} - traffic triples!
This tests if architecture can scale horizontally. May require load balancers and multiple servers.`,
    traffic: {
      rps: config.baseRps * 3, // 3x growth
      readWriteRatio: config.readRatio,
      avgFileSize: config.avgFileSize,
    },
    passCriteria: {
      maxLatency: config.maxLatency * 2.5,
      maxErrorRate: 0.05,
    },
  });

  // ========== JUSTIFICATION-BASED TESTS (NFR-J) ==========
  // These tests demonstrate WHY specific architectural decisions are needed
  // Tests FAIL without proper architecture, PASS with it

  // Test for Read/Write Split (CQRS) justification
  if (config.readRatio >= 0.8 && config.baseRps >= 1000) {
    scenarios.push({
      name: 'NFR-P5: Read Latency Under Write Pressure',
      description: `Heavy write traffic (bursts of 20% of total RPS) causes read latency degradation in monolithic architecture.
**Why this test matters**: Monolithic app servers process reads and writes in same thread pool. Heavy writes block read threads, causing read latency spikes.
**How CQRS solves it**: Separate Read API and Write API with independent thread pools. Writes don't block reads.
**Pass criteria**: With CQRS (separate read/write services), read latency stays < ${config.maxLatency}ms even during write bursts. Without CQRS: read latency spikes to ${config.maxLatency * 3}ms+.`,
      traffic: {
        rps: config.baseRps,
        readWriteRatio: config.readRatio,
        avgFileSize: config.avgFileSize,
        // Inject write bursts to simulate heavy write pressure
        writeBurstPattern: true,
      },
      passCriteria: {
        maxLatency: config.maxLatency,  // Strict latency requirement for reads
        maxErrorRate: 0.01,
        readP99Latency: config.maxLatency,  // Read p99 must stay low even during write bursts
      },
    });
  }

  // Test for Read Replicas justification
  if (config.readRatio >= 0.7 && config.baseRps >= 500) {
    const dbReadRps = config.baseRps * config.readRatio;
    scenarios.push({
      name: 'NFR-S3: Heavy Read Load',
      description: `Read traffic of ${dbReadRps.toFixed(0)} RPS exceeds single database capacity (~1000 RPS).
**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.
**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.
**Pass criteria**: With ${Math.ceil(dbReadRps / 1000)} read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds ${config.maxLatency * 2}ms OR cost exceeds budget (vertical scaling is expensive).`,
      traffic: {
        rps: config.baseRps * 1.5,  // 50% higher read traffic
        readWriteRatio: config.readRatio,
        avgFileSize: config.avgFileSize,
      },
      passCriteria: {
        maxLatency: config.maxLatency,
        maxErrorRate: 0.02,
        // Cost validation: replicas are cheaper than vertical scaling
        maxCostMultiplier: 2.0,  // Solution shouldn't cost more than 2x baseline
      },
    });
  }

  // Test for Sharding/Multi-leader justification
  const writeRps = config.baseRps * (1 - config.readRatio);
  if (writeRps > 100) {
    scenarios.push({
      name: 'NFR-S4: Write Burst',
      description: `Write traffic bursts to ${(writeRps * 2).toFixed(0)} RPS, exceeding single-leader capacity (~100 RPS).
**Why this test matters**: Single-leader replication has limited write throughput. All writes go to one master, causing bottleneck.
**How sharding/multi-leader solves it**:
- Multi-leader: Multiple masters accept writes independently (~300 RPS per leader pair)
- Sharding: Partition data across shards, each with independent write capacity
**Pass criteria**: Handle write burst with latency < ${config.maxLatency * 2}ms. Without sharding/multi-leader: writes queue up, latency exceeds ${config.maxLatency * 5}ms.`,
      traffic: {
        rps: config.baseRps * 2,
        readWriteRatio: 0.3,  // Heavy write scenario (70% writes)
        avgFileSize: config.avgFileSize,
      },
      passCriteria: {
        maxLatency: config.maxLatency * 2,  // Acceptable degradation during burst
        maxErrorRate: 0.03,
        writeP99Latency: config.maxLatency * 2,
      },
    });
  }

  // ========== RELIABILITY REQUIREMENTS (NFR-R) ==========
  scenarios.push({
    name: 'NFR-R1: Database Failure',
    description: `Primary database crashes at 30s into test. System must failover to replica to maintain
availability. Without replication: complete outage. With replication: < 10s downtime.`,
    traffic: {
      rps: config.baseRps,
      readWriteRatio: config.readRatio,
      avgFileSize: config.avgFileSize,
    },
    failureInjection: {
      component: 'database',
      at: 30,
      recoveryAt: 90, // 60s downtime without replication
    },
    passCriteria: {
      availability: 0.95, // 95% minimum with replication
      maxErrorRate: 0.1,
      maxDowntime: 10, // Max 10s downtime with replication
    },
  });

  if (config.hasCache) {
    scenarios.push({
      name: 'NFR-R2: Cache Failure',
      description: `Cache (Redis) fails at 20s. System must continue operating by hitting database directly.
Performance degrades but system stays up. Tests graceful degradation.`,
      traffic: {
        rps: config.baseRps,
        readWriteRatio: config.readRatio,
        avgFileSize: config.avgFileSize,
      },
      failureInjection: {
        component: 'cache',
        at: 20,
      },
      passCriteria: {
        maxLatency: config.maxLatency * 3, // 3x latency OK
        maxErrorRate: 0.05,
        availability: 0.95,
      },
    });
  }

  return scenarios;
}

function calculateMonthlyCost(rps: number, config: ScenarioConfig): number {
  // Base cost estimation formula
  let cost = 100; // Base infrastructure

  // App server costs
  const appServers = Math.ceil(rps / 500); // 1 server per 500 RPS
  cost += appServers * 100; // $100/server

  // Database costs (writes are more expensive)
  const writeRps = rps * (1 - config.readRatio);
  const readRps = rps * config.readRatio;
  cost += writeRps * 0.5 + readRps * 0.1;

  // Cache costs
  if (config.hasCache) {
    cost += 50; // Redis instance
  }

  // CDN costs
  if (config.hasCdn) {
    cost += readRps * 0.02; // CDN bandwidth
  }

  // Object storage costs
  if (config.hasObjectStorage && config.avgFileSize) {
    const filesPerMonth = writeRps * 30 * 24 * 3600; // Write RPS over a month
    const storageCost = (filesPerMonth * config.avgFileSize * 0.023) / 1024; // $0.023/GB
    cost += storageCost;
    cost += readRps * config.avgFileSize * 0.0001; // Transfer costs
  }

  return Math.round(cost);
}

function getPeakDescription(problemId: string): string {
  const patterns: { [key: string]: string } = {
    instagram: 'evening when users post photos',
    twitter: 'breaking news event',
    reddit: 'popular thread goes viral',
    linkedin: 'business hours 9am-5pm',
    facebook: 'evening social browsing',
    tiktok: 'evening entertainment hours',
    youtube: 'evening video watching',
    netflix: '8pm prime time',
    spotify: 'morning commute time',
    uber: 'Friday night rush',
    airbnb: 'vacation booking season',
    amazon: 'holiday shopping season',
    shopify: 'Black Friday sales',
    doordash: 'lunch and dinner rush',
    slack: 'workday 9am-5pm',
    zoom: 'meeting-heavy mornings',
    github: 'end-of-sprint pushes',
  };

  return patterns[problemId] || 'peak usage hours';
}

function getSpikDescription(problemId: string): string {
  const patterns: { [key: string]: string } = {
    instagram: 'Celebrity posts viral content',
    twitter: 'Breaking news story breaks',
    reddit: 'AMA with famous person',
    youtube: 'New viral video drops',
    netflix: 'New season of popular show releases',
    spotify: 'Album drop from major artist',
    uber: 'Concert lets out',
    airbnb: 'Travel deal announced',
    amazon: 'Lightning deal starts',
    shopify: 'Flash sale begins',
    doordash: 'Rainy day order surge',
    tiktok: 'Trending challenge goes viral',
    github: 'Major security vulnerability announced',
    slack: 'Company-wide announcement',
    zoom: 'Emergency all-hands meeting',
    ticketmaster: 'Popular concert tickets go on sale',
  };

  return patterns[problemId] || 'Unexpected event';
}

function getViralDescription(problemId: string): string {
  const patterns: { [key: string]: string } = {
    instagram: 'App featured in App Store',
    twitter: 'Platform becomes go-to for major event',
    reddit: 'Reddit hug of death from front page',
    youtube: 'Video goes global viral',
    netflix: 'Word-of-mouth drives massive signups',
    tiktok: 'International expansion launches',
    uber: 'Service expands to 10 new cities',
    airbnb: 'Travel restrictions lifted globally',
    amazon: 'Prime Day traffic',
    shopify: 'Platform adopted by major retailers',
    github: 'Open source project explodes in popularity',
    slack: 'Mass remote work adoption',
    zoom: 'Pandemic-driven surge',
    ticketmaster: 'Multiple major events on sale',
  };

  return patterns[problemId] || 'Platform goes viral';
}
