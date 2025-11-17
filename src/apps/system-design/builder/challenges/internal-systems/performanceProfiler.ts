import { Challenge } from '../../types/testCase';

export const performanceProfilerChallenge: Challenge = {
  id: 'performance_profiler',
  title: 'Performance Profiler (Production Sampling)',
  difficulty: 'advanced',
  description: `Design a performance profiler for production systems with minimal overhead.

Sample stack traces, heap allocations, and CPU usage in production to identify bottlenecks.
Generate flame graphs, detect memory leaks, and provide actionable optimization recommendations.

Example workflow:
- Enable profiling for service → Sample stack traces every 100ms
- Collect profiles → Aggregate across fleet
- Generate flame graph → Visualize hot paths
- Detect anomaly → Memory leak in cache layer

Key challenges:
- Low overhead (<1% CPU in production)
- Distributed profiling across fleet
- Symbol resolution for stack traces
- Real-time vs continuous profiling`,

  requirements: {
    functional: [
      'CPU profiling with stack trace sampling',
      'Heap profiling for memory leaks',
      'Flame graph generation',
      'Symbol resolution and demangling',
      'Anomaly detection (spikes, leaks)',
    ],
    traffic: 'Profile 1000 services with 10K instances',
    latency: 'Profiling overhead < 1% CPU',
    availability: '99.9% uptime',
    budget: '$6,000/month',
  },

  availableComponents: [
    'load_balancer',
    'app_server',
    'database',
    's3',
    'message_queue',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS ==========
    {
      name: 'CPU Profiling with Sampling',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Sample stack traces to identify CPU hotspots.',
      traffic: {
        type: 'profiling',
        instances: 100,
        samplingRate: 100, // 100 Hz
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        cpuOverhead: 0.01, // <1% overhead
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 3 } },
          { type: 'postgresql', config: { readCapacity: 200, writeCapacity: 100 } },
          { type: 's3', config: { storageSizeGB: 10000 } },
          { type: 'kafka', config: { partitions: 50 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
          { from: 'app_server', to: 's3' },
          { from: 'app_server', to: 'kafka' },
        ],
        explanation: `Architecture:
- Agents on instances collect stack samples
- Kafka streams samples to aggregation service
- S3 stores raw profiles and flame graphs
- PostgreSQL stores metadata and symbols`,
      },
    },

    {
      name: 'Heap Profiling and Leak Detection',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Track heap allocations to detect memory leaks.',
      traffic: {
        type: 'profiling',
        instances: 50,
        heapSamplingRate: 0.001, // Sample 0.1% allocations
      },
      duration: 300, // 5 minutes
      passCriteria: {
        maxErrorRate: 0,
        memoryOverhead: 0.05, // <5% memory overhead
        leakDetection: true,
      },
      hints: [
        'Sample heap allocations (not every allocation)',
        'Track allocation stack traces',
        'Compare snapshots to detect growth',
        'Identify objects never freed',
      ],
    },

    {
      name: 'Flame Graph Generation',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Generate flame graphs from stack samples.',
      traffic: {
        type: 'analytics',
        samples: 1000000, // 1M stack samples
      },
      duration: 60,
      passCriteria: {
        maxErrorRate: 0,
        flamegraphLatency: 10000, // <10s to generate
      },
      hints: [
        'Aggregate samples by stack trace',
        'Build call tree (parent → child)',
        'Width = sample count, height = stack depth',
        'Interactive drill-down by clicking',
      ],
    },

    // ========== PERFORMANCE REQUIREMENTS ==========
    {
      name: 'Low Profiling Overhead',
      type: 'performance',
      requirement: 'NFR-P',
      description: 'Profiling overhead < 1% CPU in production.',
      traffic: {
        type: 'profiling',
        instances: 1000,
        samplingRate: 100, // 100 Hz
      },
      duration: 300,
      passCriteria: {
        maxErrorRate: 0,
        cpuOverhead: 0.01, // <1%
        memoryOverhead: 0.02, // <2%
      },
      hints: [
        'Sampling (not instrumentation)',
        'Async symbol resolution (not on hot path)',
        'Batch sample upload (not per-sample)',
        'Use perf_events, eBPF (zero overhead)',
      ],
    },

    // ========== SCALABILITY REQUIREMENTS ==========
    {
      name: 'Fleet-Wide Profiling',
      type: 'scalability',
      requirement: 'NFR-S',
      description: 'Profile 10K instances simultaneously.',
      traffic: {
        type: 'profiling',
        instances: 10000,
        samplingRate: 100,
      },
      duration: 300,
      passCriteria: {
        maxErrorRate: 0.001,
        aggregationLatency: 60000, // <1min to aggregate
      },
      hints: [
        'Distributed aggregation (MapReduce)',
        'Shard by service or instance',
        'Pre-aggregate on instance before upload',
        'Store in columnar format (Parquet)',
      ],
    },

    // ========== RELIABILITY REQUIREMENTS ==========
    {
      name: 'Safe Production Profiling',
      type: 'reliability',
      requirement: 'NFR-R',
      description: 'Profiling does not crash production services.',
      traffic: {
        type: 'profiling',
        instances: 500,
        samplingRate: 100,
      },
      duration: 300,
      passCriteria: {
        maxErrorRate: 0,
        serviceCrashes: 0,
      },
      hints: [
        'Signal-safe profiling (async-signal-safe)',
        'Watchdog timer (kill profiler if hung)',
        'Gradual rollout (1% → 10% → 100%)',
        'Circuit breaker (disable on errors)',
      ],
    },
  ],

  hints: [
    {
      category: 'Profiling Techniques',
      items: [
        'CPU: Sample stack traces periodically (perf, pprof)',
        'Heap: Sample allocations (jemalloc, tcmalloc)',
        'Lock contention: Track mutex wait times',
        'I/O: Track disk and network operations',
      ],
    },
    {
      category: 'Symbol Resolution',
      items: [
        'Debug symbols: Separate symbol files (.debug, .dSYM)',
        'Symbol server: Centralized symbol storage',
        'Demangling: C++ name demangling',
        'Inline functions: Resolve inlined frames',
      ],
    },
    {
      category: 'Visualization',
      items: [
        'Flame graph: CPU hot paths',
        'Icicle graph: Top-down view',
        'Differential: Compare before/after',
        'Time-series: CPU usage over time',
      ],
    },
    {
      category: 'Optimization',
      items: [
        'Compression: Compress stack samples (save 70%)',
        'Symbolication: Async, offline',
        'Sampling rate: Adaptive (higher for slow functions)',
        'Data retention: 30 days (archive old profiles)',
      ],
    },
  ],

  learningObjectives: [
    'CPU and heap profiling techniques',
    'Low-overhead production profiling',
    'Flame graph generation and interpretation',
    'Symbol resolution and demangling',
    'Distributed profiling at scale',
  ],

  realWorldExample: `**Google pprof:**
- CPU, heap, mutex profiling
- Sampling-based (low overhead)
- Flame graphs and call trees
- Symbol server integration

**Netflix FlameScope:**
- Subsecond offset heat maps
- Flame graph generation
- Linux perf integration
- Diff mode for comparison

**Continuous Profiling (Datadog, Pyroscope):**
- Always-on profiling
- Multi-language support
- Time-series flamegraphs
- Anomaly detection`,

  pythonTemplate: `from typing import List, Dict
from collections import defaultdict
import time

class PerformanceProfiler:
    def __init__(self):
        self.db = None  # PostgreSQL
        self.storage = None  # S3
        self.queue = None  # Kafka

    def start_cpu_profile(self, service: str, duration: int,
                         sampling_rate: int = 100):
        """Start CPU profiling for service."""
        # TODO: Send profile request to service instances
        # TODO: Collect stack samples at sampling_rate Hz
        # TODO: Duration seconds
        # TODO: Return profile ID
        pass

    def collect_stack_sample(self) -> Dict:
        """Collect single stack trace sample."""
        # TODO: Walk stack (backtrace)
        # TODO: Capture instruction pointers
        # TODO: Add timestamp
        # TODO: Return sample
        import traceback
        stack = traceback.format_stack()
        return {
            'timestamp': time.time(),
            'stack': stack,
            'thread_id': 1
        }

    def aggregate_samples(self, samples: List[Dict]) -> Dict:
        """Aggregate stack samples into call tree."""
        # TODO: Group by stack trace
        # TODO: Count occurrences
        # TODO: Build parent-child relationships
        # TODO: Return call tree
        tree = defaultdict(int)
        for sample in samples:
            key = tuple(sample['stack'])
            tree[key] += 1
        return tree

    def generate_flamegraph(self, call_tree: Dict) -> str:
        """Generate flame graph SVG from call tree."""
        # TODO: Convert call tree to flamegraph format
        # TODO: Render as SVG
        # TODO: Return SVG string
        return '<svg>...</svg>'

    def start_heap_profile(self, service: str):
        """Start heap profiling to detect leaks."""
        # TODO: Sample allocations
        # TODO: Track allocation stack traces
        # TODO: Take periodic snapshots
        # TODO: Return profile ID
        pass

    def detect_memory_leak(self, snapshots: List[Dict]) -> List[Dict]:
        """Detect memory leaks from heap snapshots."""
        # TODO: Compare snapshots over time
        # TODO: Find objects with increasing count
        # TODO: Identify allocation sites
        # TODO: Return leak candidates
        return [
            {
                'object_type': 'Buffer',
                'count_increase': 1000,
                'size_increase_mb': 100,
                'stack_trace': ['allocate_buffer', 'handle_request']
            }
        ]

    def resolve_symbols(self, addresses: List[int],
                       binary_path: str) -> List[str]:
        """Resolve instruction pointers to function names."""
        # TODO: Load debug symbols
        # TODO: Map addresses to symbols
        # TODO: Demangle C++ names
        # TODO: Return function names
        return ['main', 'process_request', 'read_data']

    def compare_profiles(self, before_id: str, after_id: str) -> Dict:
        """Compare two profiles to find regressions."""
        # TODO: Load both profiles
        # TODO: Compute diff (CPU time per function)
        # TODO: Highlight regressions (slower functions)
        # TODO: Return diff report
        return {
            'regressions': [
                {'function': 'parse_json', 'cpu_increase': '50%'}
            ],
            'improvements': [
                {'function': 'compress', 'cpu_decrease': '30%'}
            ]
        }

# Example usage
if __name__ == '__main__':
    profiler = PerformanceProfiler()

    # Start CPU profile
    profile_id = profiler.start_cpu_profile(
        service='api-server',
        duration=60,
        sampling_rate=100
    )

    # Collect samples (simulated)
    samples = [profiler.collect_stack_sample() for _ in range(1000)]

    # Aggregate
    call_tree = profiler.aggregate_samples(samples)

    # Generate flamegraph
    svg = profiler.generate_flamegraph(call_tree)

    # Heap profiling
    heap_profile_id = profiler.start_heap_profile('api-server')

    # Detect leaks
    leaks = profiler.detect_memory_leak([])`,
};
