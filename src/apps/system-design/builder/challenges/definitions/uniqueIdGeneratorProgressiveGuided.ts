import { GuidedTutorial } from '../../types/guidedTutorial';

export const uniqueIdGeneratorProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'unique-id-generator-progressive',
  title: 'Design Unique ID Generator',
  description: 'Build a distributed unique ID generator from basic UUIDs to Twitter Snowflake-style globally ordered IDs',
  difficulty: 'medium',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Understand ID requirements for distributed systems',
    'Design UUID and auto-increment approaches',
    'Implement Twitter Snowflake algorithm',
    'Handle clock skew and ID ordering',
    'Scale to millions of IDs per second'
  ],
  prerequisites: ['Distributed systems', 'Binary representation', 'Time synchronization'],
  tags: ['id-generator', 'snowflake', 'distributed-systems', 'uuid', 'ordering'],

  progressiveStory: {
    title: 'Unique ID Generator Evolution',
    premise: "You're building the ID generation system for a large-scale platform. Starting with basic UUIDs, you'll evolve to support time-ordered, globally unique IDs that can be generated at millions per second across distributed data centers.",
    phases: [
      { phase: 1, title: 'Basics', description: 'UUID and simple approaches' },
      { phase: 2, title: 'Coordination', description: 'Distributed ID generation' },
      { phase: 3, title: 'Snowflake', description: 'Time-ordered unique IDs' },
      { phase: 4, title: 'Scale', description: 'High-throughput global IDs' }
    ]
  },

  steps: [
    // PHASE 1: Basics (Steps 1-3)
    {
      id: 'step-1',
      title: 'ID Requirements Analysis',
      phase: 1,
      phaseTitle: 'Basics',
      learningObjective: 'Understand what makes a good distributed ID',
      thinkingFramework: {
        framework: 'ID Properties',
        approach: 'Good distributed IDs need: uniqueness (no collisions), sortability (time-ordered preferred), compactness (fit in 64 bits), and generatability (no coordination needed).',
        keyInsight: 'Different systems need different ID properties. Auto-increment is simple but needs coordination. UUID is unique but not sortable. Snowflake gives both uniqueness and ordering.'
      },
      requirements: {
        functional: [
          'Globally unique across all nodes',
          'Sortable by generation time',
          'Fit in 64 bits (for DB indexes)',
          'Generate without coordination'
        ],
        nonFunctional: [
          'Generation latency < 1ms',
          '10K+ IDs per second per node'
        ]
      },
      hints: [
        'Uniqueness: guarantee no two IDs ever collide',
        'Sortability: IDs generated later should be larger',
        '64-bit: fits in BIGINT, good for B-tree indexes'
      ],
      expectedComponents: ['Requirements Doc', 'Trade-off Analysis'],
      successCriteria: ['Requirements clear', 'Trade-offs understood'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'UUID Approach',
      phase: 1,
      phaseTitle: 'Basics',
      learningObjective: 'Implement UUID-based ID generation',
      thinkingFramework: {
        framework: 'UUID Generation',
        approach: 'UUID v4: 128 bits of randomness. Collision probability negligible. No coordination needed. But: not sortable, 128 bits is large, random distribution hurts B-tree performance.',
        keyInsight: 'UUID is the simplest distributed ID. Generate anywhere, never coordinate. But random UUIDs cause index fragmentation - inserts scatter across B-tree pages instead of appending.'
      },
      requirements: {
        functional: [
          'Generate UUID v4 (random)',
          'Generate UUID v1 (time-based)',
          'String and binary representations',
          'Validate UUID format'
        ],
        nonFunctional: [
          'Generation < 1μs',
          'Collision probability < 1 in 2^122'
        ]
      },
      hints: [
        'UUID v4: crypto random 122 bits + version bits',
        'UUID v1: timestamp + MAC address + sequence',
        'String: 8-4-4-4-12 hex format (36 chars)'
      ],
      expectedComponents: ['UUID Generator', 'Format Converter', 'Validator'],
      successCriteria: ['UUIDs generated', 'Format correct'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Database Auto-Increment',
      phase: 1,
      phaseTitle: 'Basics',
      learningObjective: 'Understand centralized ID generation',
      thinkingFramework: {
        framework: 'Sequential IDs',
        approach: 'Single database generates sequential IDs. Simple, sortable, compact. But: single point of failure, scalability bottleneck, exposes business metrics (order count).',
        keyInsight: 'Auto-increment is perfect for single-node. For distributed: use ID ranges. Node A gets 1-1000, Node B gets 1001-2000. Reduces coordination but adds complexity.'
      },
      requirements: {
        functional: [
          'Generate sequential IDs',
          'Allocate ID ranges to nodes',
          'Handle range exhaustion',
          'Gap handling policy'
        ],
        nonFunctional: [
          'Single-node: 100K IDs/sec',
          'Range allocation < 10ms'
        ]
      },
      hints: [
        'Range: each node gets batch of 1000 IDs',
        'Exhaustion: request new range before current exhausted',
        'Gaps: acceptable - IDs dont need to be contiguous'
      ],
      expectedComponents: ['ID Allocator', 'Range Manager', 'Sequence Generator'],
      successCriteria: ['Sequential IDs work', 'Ranges allocated'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Coordination (Steps 4-6)
    {
      id: 'step-4',
      title: 'Multi-Node Coordination',
      phase: 2,
      phaseTitle: 'Coordination',
      learningObjective: 'Coordinate ID generation across nodes',
      thinkingFramework: {
        framework: 'Distributed Coordination',
        approach: 'Multiple nodes need unique IDs without collision. Options: central allocator (bottleneck), pre-allocated ranges (gaps), node ID in ID (Snowflake approach).',
        keyInsight: 'Coordination is expensive. Best approach: embed node identifier in ID. Node 1 generates 1-xxx, Node 2 generates 2-xxx. No coordination needed if nodes have unique IDs.'
      },
      requirements: {
        functional: [
          'Assign unique node IDs',
          'Embed node ID in generated IDs',
          'Handle node ID conflicts',
          'Support dynamic node addition'
        ],
        nonFunctional: [
          'Zero coordination per ID generation',
          'Node registration < 100ms'
        ]
      },
      hints: [
        'Node ID: from config, ZooKeeper, or IP-based',
        'Embedding: ID = (node_id << 54) | sequence',
        'Conflict: ZooKeeper ephemeral nodes for unique assignment'
      ],
      expectedComponents: ['Node Registry', 'ID Embedder', 'Conflict Resolver'],
      successCriteria: ['Nodes have unique IDs', 'No collisions'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Time-Based Component',
      phase: 2,
      phaseTitle: 'Coordination',
      learningObjective: 'Add timestamp to ID for ordering',
      thinkingFramework: {
        framework: 'Timestamp Embedding',
        approach: 'Embed millisecond timestamp in ID. IDs become roughly time-ordered. Timestamp as most significant bits ensures chronological sorting.',
        keyInsight: 'Twitter generates 400M tweets/day. Need IDs sortable by time for timeline queries. Timestamp in high bits = IDs naturally sort by creation time. ORDER BY id = ORDER BY created_at.'
      },
      requirements: {
        functional: [
          'Embed timestamp in ID',
          'Choose epoch (custom vs Unix)',
          'Extract timestamp from ID',
          'Handle timestamp overflow'
        ],
        nonFunctional: [
          'Timestamp precision: milliseconds',
          '69 years until overflow (41 bits)'
        ]
      },
      hints: [
        'Epoch: custom epoch saves bits (2010-01-01 vs 1970)',
        'Format: timestamp (41 bits) | node (10 bits) | sequence (12 bits)',
        'Extract: (id >> 22) + EPOCH to get timestamp'
      ],
      expectedComponents: ['Timestamp Generator', 'Epoch Manager', 'ID Parser'],
      successCriteria: ['Timestamps embedded', 'IDs time-ordered'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Sequence Number',
      phase: 2,
      phaseTitle: 'Coordination',
      learningObjective: 'Handle multiple IDs per millisecond',
      thinkingFramework: {
        framework: 'Sequence Counter',
        approach: 'Multiple IDs in same millisecond need differentiation. Sequence counter increments within millisecond, resets on new millisecond. 12 bits = 4096 IDs per ms per node.',
        keyInsight: '4096 IDs per millisecond = 4M IDs per second per node. If exhausted, wait for next millisecond. Simple backpressure prevents overflow.'
      },
      requirements: {
        functional: [
          'Sequence counter per millisecond',
          'Reset on new millisecond',
          'Handle sequence exhaustion',
          'Thread-safe increment'
        ],
        nonFunctional: [
          '4096 IDs per millisecond',
          'Atomic increment < 1μs'
        ]
      },
      hints: [
        'Counter: atomic increment, reset when timestamp changes',
        'Exhaustion: busy-wait until next millisecond',
        'Thread-safe: compare-and-swap or synchronized'
      ],
      expectedComponents: ['Sequence Counter', 'Overflow Handler', 'Atomic Operations'],
      successCriteria: ['Sequence increments', 'Overflow handled'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Snowflake (Steps 7-9)
    {
      id: 'step-7',
      title: 'Snowflake Implementation',
      phase: 3,
      phaseTitle: 'Snowflake',
      learningObjective: 'Implement Twitter Snowflake algorithm',
      thinkingFramework: {
        framework: 'Snowflake ID',
        approach: '64-bit ID: 1 bit unused, 41 bits timestamp, 10 bits node ID, 12 bits sequence. Globally unique, time-ordered, no coordination. 69 years of timestamps, 1024 nodes, 4096 IDs/ms.',
        keyInsight: 'Snowflake is elegant: pack timestamp + node + sequence into 64 bits. Each node generates independently. IDs are unique (node bits) and sortable (timestamp bits). Industry standard.'
      },
      requirements: {
        functional: [
          'Generate 64-bit Snowflake IDs',
          'Configure datacenter and worker IDs',
          'Parse ID to extract components',
          'Validate ID structure'
        ],
        nonFunctional: [
          '4M IDs per second per node',
          'Strict monotonic ordering per node'
        ]
      },
      hints: [
        'Layout: 0 | timestamp (41) | datacenter (5) | worker (5) | sequence (12)',
        'Generation: (timestamp << 22) | (dc << 17) | (worker << 12) | sequence',
        'Parse: bit shifts to extract each component'
      ],
      expectedComponents: ['Snowflake Generator', 'ID Parser', 'Configuration Manager'],
      successCriteria: ['Snowflake IDs generated', 'Components extractable'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Clock Skew Handling',
      phase: 3,
      phaseTitle: 'Snowflake',
      learningObjective: 'Handle clock synchronization issues',
      thinkingFramework: {
        framework: 'Clock Management',
        approach: 'System clocks can drift or jump backward (NTP sync). Backward jump could generate duplicate IDs. Solutions: wait for clock to catch up, use last timestamp, or fail.',
        keyInsight: 'Clock going backward is dangerous - same timestamp + sequence = duplicate ID. Must detect and handle. Conservative: refuse to generate until clock catches up. Ensures uniqueness.'
      },
      requirements: {
        functional: [
          'Detect clock moving backward',
          'Wait for clock to catch up',
          'Track last used timestamp',
          'Alert on persistent clock issues'
        ],
        nonFunctional: [
          'Handle skew up to 5 seconds',
          'Zero duplicate IDs from clock issues'
        ]
      },
      hints: [
        'Detect: current_time < last_timestamp',
        'Wait: spin until current_time >= last_timestamp',
        'Alert: if waiting > threshold, log warning'
      ],
      expectedComponents: ['Clock Monitor', 'Skew Handler', 'Alert System'],
      successCriteria: ['Clock skew detected', 'No duplicates from skew'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Worker ID Assignment',
      phase: 3,
      phaseTitle: 'Snowflake',
      learningObjective: 'Dynamically assign worker IDs',
      thinkingFramework: {
        framework: 'Dynamic Worker IDs',
        approach: 'Static worker IDs require configuration. Dynamic: use ZooKeeper for coordination. Each worker claims unique ID on startup. Release on shutdown. Handle worker ID exhaustion.',
        keyInsight: 'In Kubernetes, pods come and go. Cant statically assign worker IDs. ZooKeeper ephemeral nodes: claim ID, auto-release on disconnect. Or use IP/port hash with conflict detection.'
      },
      requirements: {
        functional: [
          'Claim worker ID on startup',
          'Release on shutdown',
          'Detect and handle conflicts',
          'Reclaim IDs from dead workers'
        ],
        nonFunctional: [
          'ID claim < 100ms',
          '1024 worker IDs available'
        ]
      },
      hints: [
        'ZooKeeper: create /workers/{id} ephemeral node',
        'Conflict: try next ID if current taken',
        'Reclaim: ephemeral nodes auto-delete on session timeout'
      ],
      expectedComponents: ['Worker Registry', 'ID Claimer', 'Conflict Handler'],
      successCriteria: ['Workers get unique IDs', 'IDs released on shutdown'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Multi-Datacenter Support',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Generate IDs across data centers',
      thinkingFramework: {
        framework: 'Geo-Distributed IDs',
        approach: 'Multiple data centers each running ID generators. Datacenter ID in Snowflake ensures global uniqueness. 5 bits = 32 data centers. Each DC independently generates unique IDs.',
        keyInsight: 'Global services need IDs from any datacenter. User in Tokyo and user in London both create posts. IDs must be unique. Datacenter bits solve this without cross-DC coordination.'
      },
      requirements: {
        functional: [
          'Configure datacenter IDs',
          'Ensure DC + worker uniqueness',
          'Handle DC failover',
          'Route requests to local DC'
        ],
        nonFunctional: [
          'Zero cross-DC coordination',
          '32 datacenters supported'
        ]
      },
      hints: [
        'DC ID: 5 bits in Snowflake, configured per deployment',
        'Uniqueness: DC bit + worker bit = globally unique',
        'Failover: if DC down, route to other DC (different DC ID)'
      ],
      expectedComponents: ['DC Manager', 'Global Router', 'Failover Handler'],
      successCriteria: ['Multi-DC works', 'IDs globally unique'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'High-Throughput Optimization',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Maximize ID generation throughput',
      thinkingFramework: {
        framework: 'Performance Optimization',
        approach: 'Lock-free generation using CAS. Batch ID allocation for high-volume callers. Pre-generate IDs during idle time. Minimize system calls for timestamp.',
        keyInsight: '4M IDs/sec/node is theoretical max. Real bottleneck: lock contention, system calls. Lock-free CAS loop. Cache timestamp, update periodically. Batch allocation reduces calls.'
      },
      requirements: {
        functional: [
          'Lock-free ID generation',
          'Batch ID allocation API',
          'Timestamp caching',
          'Pre-generation buffer'
        ],
        nonFunctional: [
          'Single node: 1M+ IDs/sec actual',
          'Batch: 10K IDs in single call'
        ]
      },
      hints: [
        'Lock-free: CAS loop on (timestamp, sequence) pair',
        'Batch: return array of IDs, increment sequence by batch size',
        'Timestamp cache: update every 1ms via background thread'
      ],
      expectedComponents: ['CAS Generator', 'Batch Allocator', 'Timestamp Cache'],
      successCriteria: ['High throughput achieved', 'Low latency maintained'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'ID Service API',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Build production ID generation service',
      thinkingFramework: {
        framework: 'ID Service',
        approach: 'Centralized service or embedded library? Service: easier management, network overhead. Library: no network, harder updates. Hybrid: local generation with service for worker IDs.',
        keyInsight: 'Twitter runs Snowflake as library embedded in services. No network hop for ID generation. Worker ID assignment via ZooKeeper. Best of both: local speed, coordinated uniqueness.'
      },
      requirements: {
        functional: [
          'REST/gRPC API for ID generation',
          'Embedded library option',
          'Health checks and metrics',
          'Graceful degradation'
        ],
        nonFunctional: [
          'API latency < 5ms p99',
          '99.99% availability'
        ]
      },
      hints: [
        'API: POST /ids?count=100 returns batch',
        'Library: import and call locally, no network',
        'Metrics: ids_generated_total, generation_latency_ms'
      ],
      expectedComponents: ['ID Service', 'Client Library', 'Metrics Exporter'],
      successCriteria: ['Service operational', 'High availability'],
      estimatedTime: '8 minutes'
    }
  ]
};
