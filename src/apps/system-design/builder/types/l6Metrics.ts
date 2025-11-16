/**
 * Google L6-Level System Design Metrics
 *
 * Based on Google's L6 system design interview requirements
 * Never use "average" - always use percentiles for latency
 */

/**
 * Enhanced latency metrics with full percentile distribution
 */
export interface L6LatencyMetrics {
  // Core percentiles that matter
  p50: number;  // Median - typical experience
  p90: number;  // 90% of requests
  p95: number;  // 95% of requests
  p99: number;  // 99% of requests - where interesting things happen
  p999: number; // 99.9% of requests - tail latency, GC events, etc.

  // Distribution analysis
  min: number;
  max: number;

  // Tail latency amplification factor
  // In distributed systems, overall latency = max(downstream latencies)
  tailAmplificationFactor: number; // p99/p50 ratio
}

/**
 * Data durability requirements (L6 critical)
 */
export interface L6DurabilityRequirements {
  // Durability levels
  acceptableDataLossWindow: number; // seconds of data loss tolerable
  dataRetentionPeriod: number; // days to keep data
  replicationFactor: number; // number of copies

  // Recovery objectives
  rpo: number; // Recovery Point Objective (max data loss in seconds)
  rto: number; // Recovery Time Objective (max downtime in seconds)

  // Data criticality
  criticalityLevel: 'non-critical' | 'important' | 'critical' | 'regulatory-required';
  reconstructable: boolean; // Can data be rebuilt if lost?
}

/**
 * Time-based variance patterns (L6 advanced)
 */
export interface L6TimeVariance {
  // Daily patterns
  peakHourMultiplier: number; // Peak traffic vs baseline
  offPeakMultiplier: number; // Off-peak traffic vs baseline

  // Weekly patterns
  weekendMultiplier: number; // Weekend vs weekday

  // Seasonal patterns
  holidayMultiplier: number; // Holiday spikes
  blackFridayMultiplier?: number; // For e-commerce

  // Unpredictable spikes
  viralEventMultiplier: number; // Social media virality
  ddosMultiplier: number; // Attack scenarios
}

/**
 * Distribution of parameters (L6 advanced)
 */
export interface L6Distribution {
  // Head/tail relationships
  headPercentage: number; // % of requests in head (small)
  tailPercentage: number; // % of requests in tail (large)

  // Size distributions
  p50Size: number; // Median request/response size
  p90Size: number;
  p99Size: number;
  p999Size: number;

  // User behavior distributions
  p50UserRequests: number; // Requests per user
  p99UserRequests: number;

  // Data skew
  hottestEntityTrafficPercentage: number; // % of traffic to hottest entity
  top10EntitiesTrafficPercentage: number; // % of traffic to top 10
}

/**
 * L6-level test case with comprehensive metrics
 */
export interface L6TestCase {
  name: string;
  category: 'latency' | 'durability' | 'scalability' | 'reliability' | 'cost';

  // Latency requirements (NEVER use average!)
  latencyRequirements: {
    requestResponse: L6LatencyMetrics;
    dataProcessing?: L6LatencyMetrics;
    endToEnd?: L6LatencyMetrics;
  };

  // Traffic patterns
  traffic: {
    baseline: number; // RPS
    variance: L6TimeVariance;
    distribution: L6Distribution;
  };

  // Data requirements
  durability: L6DurabilityRequirements;

  // Dataset characteristics
  dataset: {
    totalSize: string; // "10TB", "1PB", etc.
    growthRate: string; // "10GB/day", "2x/year"
    hotDataPercentage: number; // % accessed frequently
    coldDataPercentage: number; // % rarely accessed
  };

  // Pass criteria with L6 standards
  passCriteria: {
    // Latency (percentile-based, no averages!)
    maxP50Latency?: number;
    maxP90Latency?: number;
    maxP95Latency?: number;
    maxP99Latency?: number;
    maxP999Latency?: number;

    // Availability & Durability
    minAvailability?: number; // e.g., 0.9999 for four 9s
    maxDataLossSeconds?: number;

    // Tail behavior
    maxTailAmplification?: number; // p99/p50 ratio limit

    // Cost
    maxMonthlyCost?: number;
    maxCostPerRequest?: number;
  };
}

/**
 * Example L6 test cases for different scenarios
 */
export const L6_TEST_EXAMPLES = {
  // Google Search-like requirements
  searchEngine: {
    latencyRequirements: {
      requestResponse: {
        p50: 50,
        p90: 80,
        p95: 100,
        p99: 150,
        p999: 500,
        min: 20,
        max: 2000,
        tailAmplificationFactor: 3.0
      }
    },
    durability: {
      acceptableDataLossWindow: 0, // Zero data loss
      dataRetentionPeriod: 365 * 10, // 10 years
      replicationFactor: 3,
      rpo: 0,
      rto: 60, // 1 minute max downtime
      criticalityLevel: 'critical',
      reconstructable: false
    }
  },

  // Social media feed (Twitter/Reddit-like)
  socialMediaFeed: {
    traffic: {
      baseline: 100000, // 100K RPS
      variance: {
        peakHourMultiplier: 3.0, // 3x during peak
        offPeakMultiplier: 0.3,
        weekendMultiplier: 1.2,
        holidayMultiplier: 1.5,
        viralEventMultiplier: 10.0, // 10x during viral events
        ddosMultiplier: 20.0
      },
      distribution: {
        headPercentage: 80, // 80% small requests
        tailPercentage: 20, // 20% large requests
        p50Size: 1024, // 1KB median
        p90Size: 10240, // 10KB
        p99Size: 102400, // 100KB
        p999Size: 1048576, // 1MB
        p50UserRequests: 10,
        p99UserRequests: 1000, // Power users
        hottestEntityTrafficPercentage: 5, // Celebrity tweets
        top10EntitiesTrafficPercentage: 25
      }
    }
  },

  // E-commerce checkout (Amazon-like)
  ecommerceCheckout: {
    latencyRequirements: {
      requestResponse: {
        p50: 200,
        p90: 400,
        p95: 500,
        p99: 800,
        p999: 2000,
        min: 100,
        max: 5000,
        tailAmplificationFactor: 4.0 // Higher due to multiple services
      }
    },
    durability: {
      acceptableDataLossWindow: 0, // NEVER lose orders
      dataRetentionPeriod: 365 * 7, // 7 years for tax
      replicationFactor: 5, // Critical data
      rpo: 0,
      rto: 30, // 30 seconds max
      criticalityLevel: 'regulatory-required',
      reconstructable: false
    }
  }
};

/**
 * Helper to validate L6 compliance
 */
export function validateL6Metrics(metrics: any): string[] {
  const issues: string[] = [];

  // Check for "average" usage (forbidden at L6)
  if (metrics.avgLatency !== undefined || metrics.averageLatency !== undefined) {
    issues.push("NEVER use average latency! Use percentiles (p50, p90, p95, p99, p999)");
  }

  // Check for missing percentiles
  if (!metrics.p99Latency) {
    issues.push("Missing p99 latency - critical for understanding tail behavior");
  }

  if (!metrics.p999Latency && metrics.category === 'critical') {
    issues.push("Critical systems must track p999 latency for GC and tail events");
  }

  // Check for durability specs
  if (!metrics.durability) {
    issues.push("Missing durability requirements - what happens on data loss?");
  }

  // Check for distribution analysis
  if (!metrics.distribution) {
    issues.push("Missing distribution analysis - need head/tail relationships");
  }

  return issues;
}

/**
 * Convert legacy metrics to L6 standards
 */
export function upgradeToL6Metrics(legacyMetrics: any): L6LatencyMetrics {
  // If only p99 is provided, estimate others
  const p99 = legacyMetrics.p99Latency || legacyMetrics.maxP99Latency || 100;

  return {
    p50: legacyMetrics.p50Latency || p99 / 3,  // Rough estimate
    p90: legacyMetrics.p90Latency || p99 * 0.7,
    p95: legacyMetrics.p95Latency || p99 * 0.85,
    p99: p99,
    p999: legacyMetrics.p999Latency || p99 * 2, // Tail is typically 2x p99
    min: legacyMetrics.minLatency || p99 / 10,
    max: legacyMetrics.maxLatency || p99 * 10,
    tailAmplificationFactor: p99 / (legacyMetrics.p50Latency || p99 / 3)
  };
}