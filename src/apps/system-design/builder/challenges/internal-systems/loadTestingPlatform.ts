import { Challenge } from '../../types/testCase';

export const loadTestingPlatformChallenge: Challenge = {
  id: 'load_testing_platform',
  title: 'Load Testing Platform',
  difficulty: 'advanced',
  description: `Design a load testing platform for performance validation before production deploys.

Engineers define load test scenarios, replay production traffic, and analyze performance.
The system generates realistic traffic patterns, measures latency/throughput, and identifies bottlenecks.

Example workflow:
- POST /tests → Create load test with target URL and traffic pattern
- POST /tests/:id/start → Start test (ramp up to 10K RPS)
- GET /tests/:id/results → View real-time metrics
- POST /tests/:id/replay → Replay production traffic from logs

Key challenges:
- Generate realistic traffic patterns (ramp-up, spike, sustained)
- Distributed load generation (avoid single-machine limits)
- Real-time metrics aggregation during test
- Resource isolation (don't impact production)`,

  requirements: {
    functional: [
      'Define custom traffic patterns (ramp, spike, sustained)',
      'Distributed load generation (10K+ RPS)',
      'Real-time metrics (latency, throughput, errors)',
      'Production traffic replay from logs',
      'Resource isolation and safety controls',
    ],
    traffic: '50 concurrent load tests, each generating 1K-10K RPS',
    latency: 'Metrics update latency < 5s',
    availability: '99% uptime',
    budget: '$10,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'worker_pool',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'Basic Load Test Execution',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Execute simple load test with constant RPS.',
      traffic: {
        type: 'load_test',
        targetRps: 1000,
        duration: 60,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        achievedRps: 1000,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'postgresql', config: { readCapacity: 100, writeCapacity: 50 } },
          { type: 'redis', config: { memorySizeGB: 4 } },
          { type: 'kafka', config: { partitions: 20 } },
          { type: 'worker_pool', config: { workers: 100 } },
          { type: 's3', config: { storageSizeGB: 100 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'kafka' },
          { from: 'kafka', to: 'worker_pool' },
          { from: 'worker_pool', to: 's3' },
        ],
        explanation: `Architecture:
- App servers orchestrate load tests
- Kafka distributes load gen tasks to workers
- Worker pool generates HTTP requests
- Redis aggregates real-time metrics
- S3 stores test results and traffic logs`,
      },
    },

    {
      name: 'Traffic Pattern Simulation',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Support ramp-up, spike, and sustained traffic patterns.',
      traffic: {
        type: 'load_test',
        pattern: 'ramp',
        startRps: 100,
        endRps: 5000,
        duration: 120,
      },
      duration: 120,
      passCriteria: {
        maxErrorRate: 0,
        patternAccuracy: 0.95, // 95% match to target pattern
      },
      hints: [
        'Ramp-up: Linear increase from startRps to endRps',
        'Spike: Sudden jump to peak RPS, then drop',
        'Sustained: Constant RPS for duration',
        'Coordinate workers to achieve target aggregate RPS',
      ],
    },

    {
      name: 'Production Traffic Replay',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Replay production traffic from access logs.',
      traffic: {
        type: 'load_test',
        source: 'production_logs',
        duration: 60,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        replayAccuracy: 0.9, // 90% match to original traffic
      },
      hints: [
        'Parse production logs (timestamp, method, path, headers)',
        'Preserve request timing and ordering',
        'Anonymize sensitive data (PII, auth tokens)',
        'Scale traffic (e.g., 10x for stress testing)',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'High RPS Generation',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Generate 10K RPS with distributed workers.',
      traffic: {
        type: 'load_test',
        targetRps: 10000,
        duration: 60,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        achievedRps: 10000,
        workerUtilization: 0.8, // 80% worker efficiency
      },
      hints: [
        'Horizontal scaling: Spin up more workers',
        'Each worker generates 100-200 RPS',
        'Use async I/O (asyncio, aiohttp) for efficiency',
        'Connection pooling to reduce overhead',
      ],
    },

    {
      name: 'Real-Time Metrics Aggregation',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Aggregate metrics from 100 workers in < 5s.',
      traffic: {
        type: 'load_test',
        targetRps: 5000,
        workers: 100,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        metricsLatency: 5000, // 5s update frequency
      },
      hints: [
        'Workers push metrics to Redis every 1s',
        'Use Redis sorted sets for percentile calculations',
        'Aggregate in-memory (don\'t query DB)',
        'WebSocket for real-time dashboard updates',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Concurrent Load Tests',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Run 50 concurrent load tests without interference.',
      traffic: {
        type: 'load_test',
        concurrentTests: 50,
        rpsPerTest: 500,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0.001,
        testIsolation: 1.0, // No cross-test interference
      },
      hints: [
        'Worker pool partitioning (dedicated workers per test)',
        'Rate limiting per test to avoid resource exhaustion',
        'Separate Redis keys per test for metrics',
        'Auto-scale worker pool based on demand',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Safety Controls',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Prevent load tests from impacting production.',
      traffic: {
        type: 'load_test',
        targetRps: 10000,
        duration: 60,
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        productionImpact: 0.0, // No production impact
      },
      hints: [
        'Require target URL whitelist (staging environments only)',
        'Circuit breaker: Stop test if error rate > 50%',
        'Max RPS limit (prevent accidental DDoS)',
        'Separate network/VPC for load testing',
      ],
    },
  ],

  hints: [
    {
      category: 'Load Generation',
      items: [
        'Master-worker architecture: Master schedules, workers execute',
        'Each worker: HTTP client pool, metrics buffer',
        'Async I/O for high concurrency (asyncio, Go goroutines)',
        'Connection reuse to reduce handshake overhead',
      ],
    },
    {
      category: 'Traffic Patterns',
      items: [
        'Ramp: RPS(t) = startRps + (endRps - startRps) * (t / duration)',
        'Spike: RPS = peakRps for [t1, t2], else baseRps',
        'Sustained: RPS = constant',
        'Coordinate workers via Kafka (timestamped tasks)',
      ],
    },
    {
      category: 'Metrics Aggregation',
      items: [
        'Workers emit: timestamp, latency, status_code, error',
        'Redis aggregation: P50, P95, P99 (sorted set)',
        'Time-series DB (InfluxDB) for historical data',
        'Real-time: WebSocket push to dashboard',
      ],
    },
    {
      category: 'Production Replay',
      items: [
        'Parse logs: Apache/Nginx format → (timestamp, request)',
        'Preserve inter-request timing for realism',
        'Sanitize: Remove auth tokens, PII',
        'Scale factor: Multiply RPS for stress testing',
      ],
    },
  ],

  learningObjectives: [
    'Distributed load generation architecture',
    'Real-time metrics aggregation (Redis, time-series)',
    'Traffic pattern simulation (ramp, spike, sustained)',
    'Production log parsing and replay',
    'Safety controls and resource isolation',
  ],

  realWorldExample: `**Gatling:**
- Scenario DSL for traffic patterns
- Async I/O for high concurrency
- Real-time metrics and reports
- Distributed execution mode

**JMeter:**
- GUI for test design
- Plugin ecosystem
- Distributed testing (master-slave)
- Result aggregation and visualization

**Google internal load testing:**
- Traffic replay from production logs
- Hermetic test environments
- Automated performance regression detection
- Integration with CI/CD for pre-deploy validation`,

  pythonTemplate: `from typing import Dict, List
import asyncio
import aiohttp
from datetime import datetime

class LoadTestingPlatform:
    def __init__(self):
        self.db = None  # PostgreSQL
        self.cache = None  # Redis
        self.queue = None  # Kafka
        self.workers = []

    def create_test(self, target_url: str, pattern: Dict,
                   duration: int) -> str:
        """Create a load test configuration."""
        # TODO: Validate target URL (whitelist check)
        # TODO: Store test config in DB
        # TODO: Return test ID
        pass

    def start_test(self, test_id: str) -> bool:
        """Start load test execution."""
        # TODO: Load test config
        # TODO: Calculate worker allocation
        # TODO: Distribute tasks via Kafka
        # TODO: Monitor real-time metrics
        # TODO: Return success
        return True

    async def load_worker(self, test_id: str, target_rps: int,
                         duration: int):
        """Worker that generates HTTP load."""
        async with aiohttp.ClientSession() as session:
            start_time = datetime.now()
            request_count = 0

            while (datetime.now() - start_time).seconds < duration:
                # TODO: Compute current target RPS (for ramp-up)
                # TODO: Make HTTP request
                # TODO: Measure latency
                # TODO: Emit metrics to Redis
                # TODO: Sleep to maintain target RPS
                await asyncio.sleep(1.0 / target_rps)
                request_count += 1

    def aggregate_metrics(self, test_id: str) -> Dict:
        """Aggregate real-time metrics from workers."""
        # TODO: Read metrics from Redis
        # TODO: Compute percentiles (P50, P95, P99)
        # TODO: Calculate throughput and error rate
        # TODO: Return aggregated results
        return {}

    def replay_production_traffic(self, test_id: str,
                                  log_file: str) -> bool:
        """Replay production traffic from logs."""
        # TODO: Parse log file (timestamp, method, path, headers)
        # TODO: Extract request timing
        # TODO: Anonymize sensitive data
        # TODO: Schedule requests via Kafka
        # TODO: Execute with workers
        return True

    def stop_test(self, test_id: str) -> bool:
        """Stop running load test."""
        # TODO: Send stop signal to workers (via Kafka)
        # TODO: Wait for workers to finish
        # TODO: Finalize metrics
        # TODO: Store results in S3
        return True

# Example usage
if __name__ == '__main__':
    platform = LoadTestingPlatform()

    # Create test
    test_id = platform.create_test(
        target_url='https://staging.example.com/api',
        pattern={'type': 'ramp', 'start_rps': 100, 'end_rps': 5000},
        duration=120
    )

    # Start test
    platform.start_test(test_id)

    # Get real-time metrics
    metrics = platform.aggregate_metrics(test_id)

    # Stop test
    platform.stop_test(test_id)`,
};
