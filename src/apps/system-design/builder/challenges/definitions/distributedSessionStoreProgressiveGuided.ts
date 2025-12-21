import { GuidedTutorial } from '../../types/guidedTutorial';

export const distributedSessionStoreProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'distributed-session-store-progressive',
  title: 'Design Distributed Session Store',
  description: 'Build a distributed session management system from basic storage to global, highly-available sessions',
  difficulty: 'medium',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design session storage with TTL',
    'Implement distributed session replication',
    'Build session affinity and failover',
    'Handle cross-datacenter sessions',
    'Scale to millions of concurrent sessions'
  ],
  prerequisites: ['Caching', 'Distributed systems', 'Web sessions'],
  tags: ['sessions', 'distributed-cache', 'authentication', 'state-management', 'scale'],

  progressiveStory: {
    title: 'Distributed Session Store Evolution',
    premise: "You're building the session management system for a large web application. Starting with simple session storage, you'll evolve to support sticky sessions, failover, cross-datacenter replication, and millions of users.",
    phases: [
      { phase: 1, title: 'Storage', description: 'Basic session management' },
      { phase: 2, title: 'Distribution', description: 'Multi-node sessions' },
      { phase: 3, title: 'Reliability', description: 'Failover and consistency' },
      { phase: 4, title: 'Scale', description: 'Global sessions' }
    ]
  },

  steps: [
    // PHASE 1: Storage (Steps 1-3)
    {
      id: 'step-1',
      title: 'Session Data Model',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'Design session structure and storage',
      thinkingFramework: {
        framework: 'Session Object',
        approach: 'Session = user state between requests. Session ID in cookie. Store user_id, permissions, preferences. TTL for automatic expiration.',
        keyInsight: 'HTTP is stateless. Sessions add state. Session ID is secret key to user state. Store minimum necessary - sessions should be lightweight.'
      },
      requirements: {
        functional: [
          'Create sessions with unique ID',
          'Store arbitrary session data',
          'Get session by ID',
          'Delete session (logout)'
        ],
        nonFunctional: [
          'Session lookup < 5ms',
          'Session size < 1MB'
        ]
      },
      hints: [
        'Session: {id, user_id, data: {}, created_at, expires_at, last_accessed}',
        'ID generation: cryptographically random, 128+ bits',
        'Storage: key-value store (Redis ideal)'
      ],
      expectedComponents: ['Session Store', 'ID Generator', 'Data Serializer'],
      successCriteria: ['Sessions created', 'Data stored'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'TTL and Expiration',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'Handle session lifecycle',
      thinkingFramework: {
        framework: 'Time-Based Expiration',
        approach: 'Sessions expire after inactivity. Sliding window: activity extends TTL. Absolute timeout: max session length. Background cleanup of expired.',
        keyInsight: 'Expired sessions are security risk. "Remember me" = longer TTL. Sliding window keeps active users logged in. Absolute prevents forever sessions.'
      },
      requirements: {
        functional: [
          'Set TTL on session creation',
          'Sliding window expiration',
          'Absolute maximum lifetime',
          'Clean up expired sessions'
        ],
        nonFunctional: [
          'TTL precision: seconds',
          'Cleanup lag < 1 minute'
        ]
      },
      hints: [
        'Sliding: update expires_at on each access',
        'Absolute: created_at + max_lifetime',
        'Cleanup: background job or Redis native TTL'
      ],
      expectedComponents: ['TTL Manager', 'Expiration Handler', 'Cleanup Worker'],
      successCriteria: ['Sessions expire', 'Cleanup works'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Session Security',
      phase: 1,
      phaseTitle: 'Storage',
      learningObjective: 'Secure session handling',
      thinkingFramework: {
        framework: 'Session Security',
        approach: 'Session ID must be unguessable. Regenerate on privilege change. Bind to IP/user-agent optionally. Encrypt sensitive data in session.',
        keyInsight: 'Session hijacking = attacker gets your session ID. Mitigations: secure random ID, HttpOnly cookie, regenerate on login, validate binding.'
      },
      requirements: {
        functional: [
          'Cryptographically secure session IDs',
          'Regenerate session on login',
          'Optional IP/user-agent binding',
          'Encrypt sensitive session data'
        ],
        nonFunctional: [
          'ID entropy: 128+ bits',
          'Encryption: AES-256'
        ]
      },
      hints: [
        'ID: crypto.randomBytes(32).toString(hex)',
        'Regenerate: new ID, copy data, delete old',
        'Binding: hash(session_id + ip + user_agent) as verification'
      ],
      expectedComponents: ['Secure ID Generator', 'Session Regenerator', 'Encryption Layer'],
      successCriteria: ['IDs unguessable', 'Regeneration works'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Distribution (Steps 4-6)
    {
      id: 'step-4',
      title: 'Centralized Session Store',
      phase: 2,
      phaseTitle: 'Distribution',
      learningObjective: 'Share sessions across app servers',
      thinkingFramework: {
        framework: 'External Session Store',
        approach: 'Move sessions from app server memory to shared store (Redis). Any app server can serve any request. No sticky sessions required.',
        keyInsight: 'In-memory sessions dont scale. Server A creates session, server B cant read it. Shared store enables horizontal scaling of app tier.'
      },
      requirements: {
        functional: [
          'Store sessions in Redis',
          'Any server reads any session',
          'Atomic session updates',
          'Handle store unavailability'
        ],
        nonFunctional: [
          'External lookup < 10ms',
          'Handle Redis failover'
        ]
      },
      hints: [
        'Redis: SET session:{id} {data} EX {ttl}',
        'Serialization: JSON or MessagePack',
        'Unavailable: graceful degradation or error'
      ],
      expectedComponents: ['Redis Client', 'Session Adapter', 'Fallback Handler'],
      successCriteria: ['Shared storage works', 'Any server access'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Session Replication',
      phase: 2,
      phaseTitle: 'Distribution',
      learningObjective: 'Replicate sessions for availability',
      thinkingFramework: {
        framework: 'Replicated Cache',
        approach: 'Redis cluster with replication. Primary handles writes, replicas handle reads. Automatic failover to replica. Async vs sync replication trade-off.',
        keyInsight: 'Single Redis = single point of failure. Replication provides HA. Async replication: fast but may lose recent session updates. Sync: safe but slower.'
      },
      requirements: {
        functional: [
          'Replicate sessions to standby',
          'Read from replicas',
          'Automatic failover',
          'Detect and handle split-brain'
        ],
        nonFunctional: [
          'Replication lag < 100ms',
          'Failover < 30 seconds'
        ]
      },
      hints: [
        'Redis Sentinel: automatic failover',
        'Read replicas: READONLY flag for read scaling',
        'Sync: WAIT command for synchronous replication'
      ],
      expectedComponents: ['Replication Manager', 'Failover Controller', 'Replica Router'],
      successCriteria: ['Replication works', 'Failover automatic'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Session Partitioning',
      phase: 2,
      phaseTitle: 'Distribution',
      learningObjective: 'Distribute sessions across shards',
      thinkingFramework: {
        framework: 'Sharded Sessions',
        approach: 'Redis Cluster: hash session ID to determine shard. Each shard handles subset of sessions. Linear scalability. Consistent hashing for minimal reshuffling.',
        keyInsight: 'Single Redis maxes out at ~100K ops/sec. Sharding distributes load. Session ID as shard key ensures same session always on same shard.'
      },
      requirements: {
        functional: [
          'Shard sessions by ID',
          'Route to correct shard',
          'Handle shard failures',
          'Rebalance on cluster changes'
        ],
        nonFunctional: [
          'Linear scalability',
          'Minimal reshuffling on changes'
        ]
      },
      hints: [
        'Hash slot: CRC16(session_id) mod 16384',
        'Cluster: automatic slot routing',
        'Consistent hashing: virtual nodes for balance'
      ],
      expectedComponents: ['Shard Router', 'Cluster Manager', 'Hash Calculator'],
      successCriteria: ['Sharding works', 'Routing correct'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Reliability (Steps 7-9)
    {
      id: 'step-7',
      title: 'Sticky Sessions',
      phase: 3,
      phaseTitle: 'Reliability',
      learningObjective: 'Route user to same server',
      thinkingFramework: {
        framework: 'Session Affinity',
        approach: 'Load balancer routes user to same app server. Server caches session locally. Reduces external store load. Fallback to store on cache miss.',
        keyInsight: 'Every request hitting Redis is expensive. Sticky sessions enable local caching. 90% cache hit rate = 90% reduction in Redis load.'
      },
      requirements: {
        functional: [
          'Load balancer session affinity',
          'Local session cache',
          'Cache invalidation on update',
          'Fallback to store on miss'
        ],
        nonFunctional: [
          'Local cache hit rate > 90%',
          'Cache coherence maintained'
        ]
      },
      hints: [
        'Affinity: cookie-based routing (SERVERID cookie)',
        'Local cache: LRU with TTL, invalidate on write',
        'Coherence: write-through to Redis on every update'
      ],
      expectedComponents: ['Affinity Handler', 'Local Cache', 'Invalidation Manager'],
      successCriteria: ['Sticky routing works', 'Cache effective'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Graceful Failover',
      phase: 3,
      phaseTitle: 'Reliability',
      learningObjective: 'Handle server failures without losing sessions',
      thinkingFramework: {
        framework: 'Failover Strategy',
        approach: 'Server dies: load balancer detects, routes to other server. Other server fetches session from store. User continues without re-login.',
        keyInsight: 'Sticky sessions + shared store = graceful failover. User experiences brief delay, not logout. Health checks detect failures quickly.'
      },
      requirements: {
        functional: [
          'Detect server failures',
          'Re-route to healthy server',
          'Fetch session from store',
          'Preserve session state'
        ],
        nonFunctional: [
          'Failover < 10 seconds',
          'Zero session loss'
        ]
      },
      hints: [
        'Health check: /health endpoint, 3 failures = unhealthy',
        'Re-route: remove from LB pool, existing connections drain',
        'Session fetch: transparent to application'
      ],
      expectedComponents: ['Health Checker', 'Failover Router', 'Session Recovery'],
      successCriteria: ['Failures detected', 'Sessions preserved'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Concurrent Session Handling',
      phase: 3,
      phaseTitle: 'Reliability',
      learningObjective: 'Handle concurrent requests safely',
      thinkingFramework: {
        framework: 'Session Concurrency',
        approach: 'Multiple requests with same session concurrently. Race conditions on session update. Options: last-write-wins, optimistic locking, request serialization.',
        keyInsight: 'User opens multiple tabs, clicks simultaneously. Both read session, both modify, one overwrites other. Need concurrency control strategy.'
      },
      requirements: {
        functional: [
          'Detect concurrent modifications',
          'Optimistic locking option',
          'Merge conflict resolution',
          'Request ordering option'
        ],
        nonFunctional: [
          'No lost updates',
          'Minimal performance impact'
        ]
      },
      hints: [
        'Version: session has version field, CAS on update',
        'Last-write-wins: simple but may lose data',
        'Merge: application-specific conflict resolution'
      ],
      expectedComponents: ['Version Manager', 'CAS Handler', 'Conflict Resolver'],
      successCriteria: ['Concurrent updates safe', 'No lost data'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Multi-Datacenter Sessions',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Sessions across data centers',
      thinkingFramework: {
        framework: 'Geo-Distributed Sessions',
        approach: 'Users access from multiple regions. Session in one DC, request hits another. Options: replicate all sessions globally, or route user to session DC.',
        keyInsight: 'Cross-DC latency is 100ms+. Cant fetch session from remote DC on every request. Either replicate proactively or route user to session home.'
      },
      requirements: {
        functional: [
          'Session creation in local DC',
          'Cross-DC session access',
          'DC-aware routing',
          'Handle DC failures'
        ],
        nonFunctional: [
          'Local access < 10ms',
          'Cross-DC access < 200ms'
        ]
      },
      hints: [
        'Replication: async to other DCs, eventual consistency',
        'Routing: session ID encodes home DC',
        'Failover: promote replica DC on failure'
      ],
      expectedComponents: ['Geo-Router', 'Cross-DC Replicator', 'DC Failover'],
      successCriteria: ['Multi-DC works', 'Latency acceptable'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Session Compression',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Optimize session storage and transfer',
      thinkingFramework: {
        framework: 'Storage Optimization',
        approach: 'Compress session data. Store only deltas for updates. Lazy loading of session parts. Reduces memory, bandwidth, latency.',
        keyInsight: 'Session with user cart, preferences, history can be 100KB. Compression reduces to 10KB. 10x more sessions in same memory. Faster network transfer.'
      },
      requirements: {
        functional: [
          'Compress session data',
          'Decompress on read',
          'Partial session loading',
          'Delta updates'
        ],
        nonFunctional: [
          'Compression ratio > 5x',
          'Compress/decompress < 1ms'
        ]
      },
      hints: [
        'Algorithm: LZ4 for speed, zstd for ratio',
        'Threshold: only compress if > 1KB',
        'Partial: store cart separate from preferences'
      ],
      expectedComponents: ['Compressor', 'Partial Loader', 'Delta Calculator'],
      successCriteria: ['Compression works', 'Memory reduced'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-12',
      title: 'Session Analytics',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Monitor and analyze sessions',
      thinkingFramework: {
        framework: 'Session Observability',
        approach: 'Track active sessions, creation rate, expiration rate. Detect anomalies (session bombing). Monitor store health. Alerting on thresholds.',
        keyInsight: 'Sessions are security surface. Spike in sessions = attack? Average session duration dropping = UX issue? Metrics enable proactive response.'
      },
      requirements: {
        functional: [
          'Count active sessions',
          'Track session lifecycle events',
          'Detect anomalies',
          'Dashboard and alerting'
        ],
        nonFunctional: [
          'Metrics lag < 1 minute',
          'Alert within 5 minutes of anomaly'
        ]
      },
      hints: [
        'Metrics: active_sessions, created/sec, expired/sec, avg_duration',
        'Anomaly: sudden spike in creations (attack), mass expirations (bug)',
        'Dashboard: Grafana with Redis metrics'
      ],
      expectedComponents: ['Metrics Collector', 'Anomaly Detector', 'Alert Manager'],
      successCriteria: ['Metrics collected', 'Anomalies detected'],
      estimatedTime: '8 minutes'
    }
  ]
};
