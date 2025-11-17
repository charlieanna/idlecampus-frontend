/**
 * Problem Whitelist - 440+ curated problems
 *
 * Breakdown:
 * - L1: 40 original real-world problems (Instagram, Twitter, etc.)
 * - L2-4: 35 distinct pattern examples (30 patterns + 5 DDIA gaps)
 * - L5: 107 platform problems (migrations, APIs, multi-tenant, etc.)
 * - L6: 10 next-gen problems (practical modern tech)
 * - DDIA Teaching: 151 concept-focused problems (ALL CHAPTERS!)
 * - System Design Primer: 77 infrastructure & data problems
 *
 * DDIA Teaching Problems (151 total - ALL CHAPTERS):
 * - Chapter 1: Reliability, Scalability, Maintainability (15)
 * - Chapter 2: Data Models & Query Languages (12)
 * - Chapter 3: Storage & Retrieval (10)
 * - Chapter 4: Encoding & Evolution (8)
 * - Chapter 5: Replication (16)
 * - Chapter 6: Partitioning (12)
 * - Chapter 7: Transactions (16)
 * - Chapter 8: Distributed Systems (15)
 * - Chapter 9: Consensus (14)
 * - Chapter 10: Batch Processing (10)
 * - Chapter 11: Stream Processing (15)
 * - Chapter 12: Future of Data Systems (8)
 *
 * System Design Primer (77 total):
 * - Infrastructure: Performance, DNS, CDN, Load Balancers, Reverse Proxy, App Layer (41)
 * - Data & Communication: Database, Caching, Asynchronism, Communication, Security (36)
 *
 * These teaching problems focus on individual concepts, providing
 * a progressive learning path from single concepts to complex real-world systems.
 */

/**
 * L1: Original Problems - KEEP ALL 40
 */
export const originalProblems = [
  // Social Media (10)
  'instagram',
  'twitter',
  'reddit',
  'linkedin',
  'facebook',
  'tiktok',
  'pinterest',
  'snapchat',
  'discord',
  'medium',

  // E-commerce & Services (5)
  'amazon',
  'shopify',
  'stripe',
  'uber',
  'airbnb',

  // Streaming & Media (5)
  'netflix',
  'spotify',
  'youtube',
  'twitch',
  'hulu',

  // Messaging (4)
  'whatsapp',
  'slack',
  'telegram',
  'messenger',

  // Infrastructure (5)
  'pastebin',
  'dropbox',
  'googledrive',
  'github',
  'stackoverflow',

  // Food & Delivery (3)
  'doordash',
  'instacart',
  'yelp',

  // Productivity (4)
  'notion',
  'trello',
  'googlecalendar',
  'zoom',

  // Gaming & Other (4)
  'steam',
  'ticketmaster',
  'bookingcom',
  'weatherapi',
];

/**
 * L2-4: Pattern Extraction - KEEP 35 (30 original + 5 DDIA gaps)
 */
export const patternProblems = [
  // Tutorials (4) - Keep all
  'tutorial-simple-blog',
  'tutorial-intermediate-images',
  'tutorial-advanced-chat',
  'boe-walkthrough-chat',

  // DDIA Gap Problems (5) - Fill missing DDIA concepts
  'batch-processing-mapreduce',     // Ch 10: Batch Processing (MapReduce/Spark)
  'explicit-sharding-design',       // Ch 6: Partitioning (sharding strategy)
  'transaction-isolation-levels',   // Ch 7: Transactions (isolation levels)
  'data-warehouse-olap',            // Ch 3: Storage (columnar, OLAP)
  'graph-database-social',          // Ch 2: Data Models (graph databases)

  // Caching (5 of 36) - Distinct patterns only
  'tinyurl',                    // URL shortener, classic caching
  'session-store-basic',        // Distributed session management
  'social-feed-cache',          // Nested/hierarchical caching (like Reddit comments)
  'config-cache-basic',         // Configuration caching
  'multi-tenant-saas-cache',    // Multi-tenant caching patterns

  // Gateway (3 of 36) - Core gateway patterns
  'rate-limiter',               // Rate limiting (essential)
  'basic-api-gateway',          // API gateway basics
  'authentication-gateway',     // OAuth/JWT authentication

  // Streaming (5 of 37) - Key streaming patterns
  'chat',                       // Real-time chat/WebSocket
  'ingestion',                  // Log aggregation (Kafka/Kinesis)
  'clickstream-analytics',      // Stream processing/real-time analytics
  'event-sourcing-basic',       // Event sourcing pattern
  'kafka-streaming-pipeline',   // CDC/Change data capture

  // Storage (4 of 35) - Distinct storage patterns
  'basic-database-design',      // Relational DB design
  'nosql-basics',               // NoSQL (document/key-value)
  'time-series-metrics',        // Time-series DB
  'distributed-database',       // Distributed storage (HDFS-like)

  // Search (4 of 35) - Core search patterns
  'basic-text-search',          // Full-text search (Elasticsearch)
  'autocomplete-search',        // Autocomplete/typeahead
  'geo-search',                 // Geo-spatial search
  'faceted-search',             // Faceted search/filtering

  // Multiregion (5 of 35) - Key multi-region patterns
  'active-active-regions',      // Active-active replication
  'global-load-balancing',      // GeoDNS/global LB
  'cross-region-failover',      // Disaster recovery
  'conflict-resolution',        // CRDT/conflict resolution
  'edge-computing',             // Edge computing (Cloudflare Workers)
];

/**
 * L5: Complex Platforms - KEEP 85
 */
export const platformProblems = [
  // Platform Migration (37) - Keep all, these are valuable real-world case studies
  'l5-migration-netflix-microservices',
  'l5-migration-twitter-event-driven',
  'l5-migration-spotify-serverless',
  'l5-migration-uber-multi-region',
  'l5-migration-airbnb-graphql',
  'l5-migration-stripe-database',
  'l5-migration-slack-websocket',
  'l5-migration-github-monorepo',
  'l5-migration-instagram-cassandra',
  'l5-migration-doordash-routing',
  'l5-migration-zoom-webrtc',
  'l5-migration-pinterest-recommendation',
  'l5-migration-linkedin-kafka',
  'l5-migration-reddit-postgres',
  'l5-migration-snapchat-storage',
  'l5-migration-shopify-multi-cloud',
  'l5-migration-twitch-low-latency',
  'l5-migration-coinbase-matching',
  'l5-migration-figma-collaboration',
  'l5-platform-migration-1',
  'l5-platform-migration-2',
  'l5-platform-migration-3',
  'l5-platform-migration-4',
  'l5-platform-migration-5',
  'l5-platform-migration-6',
  'l5-platform-migration-7',
  'l5-platform-migration-8',
  'l5-platform-migration-9',
  'l5-platform-migration-10',
  'l5-platform-migration-11',
  'l5-platform-migration-12',
  'l5-platform-migration-13',
  'l5-platform-migration-14',
  'l5-platform-migration-15',
  'l5-platform-migration-16',
  'l5-platform-migration-17',
  'l5-platform-migration-18',

  // API Platform (10 of 19) - Best examples
  'l5-api-gateway-facebook',
  'l5-api-graphql-federation',
  'l5-api-platform-1',
  'l5-api-platform-2',
  'l5-api-platform-3',
  'l5-api-platform-4',
  'l5-api-platform-5',
  'l5-api-platform-6',
  'l5-api-platform-7',
  'l5-api-platform-8',

  // Multi-tenant (8 of 18)
  'l5-multitenant-salesforce',
  'l5-multi-tenant-1',
  'l5-multi-tenant-2',
  'l5-multi-tenant-3',
  'l5-multi-tenant-4',
  'l5-multi-tenant-5',
  'l5-multi-tenant-6',
  'l5-multi-tenant-7',

  // Data Platform (10 of 18)
  'l5-data-platform-uber',
  'l5-data-platform-1',
  'l5-data-platform-2',
  'l5-data-platform-3',
  'l5-data-platform-4',
  'l5-data-platform-5',
  'l5-data-platform-6',
  'l5-data-platform-7',
  'l5-data-platform-8',
  'l5-data-platform-9',

  // Developer Productivity (8 of 18)
  'l5-devprod-google-ci',
  'l5-developer-productivity-1',
  'l5-developer-productivity-2',
  'l5-developer-productivity-3',
  'l5-developer-productivity-4',
  'l5-developer-productivity-5',
  'l5-developer-productivity-6',
  'l5-developer-productivity-7',

  // Compliance & Security (10 of 18)
  'l5-security-apple-encryption',
  'l5-compliance-security-1',
  'l5-compliance-security-2',
  'l5-compliance-security-3',
  'l5-compliance-security-4',
  'l5-compliance-security-5',
  'l5-compliance-security-6',
  'l5-compliance-security-7',
  'l5-compliance-security-8',
  'l5-compliance-security-9',

  // Observability (8 of 18)
  'l5-observability-datadog',
  'l5-observability-1',
  'l5-observability-2',
  'l5-observability-3',
  'l5-observability-4',
  'l5-observability-5',
  'l5-observability-6',
  'l5-observability-7',

  // Infrastructure (8 of 18)
  'l5-infra-kubernetes-platform',
  'l5-infrastructure-1',
  'l5-infrastructure-2',
  'l5-infrastructure-3',
  'l5-infrastructure-4',
  'l5-infrastructure-5',
  'l5-infrastructure-6',
  'l5-infrastructure-7',

  // ML Platform (8 of 18)
  'l5-ml-platform-meta',
  'l5-ml-platform-1',
  'l5-ml-platform-2',
  'l5-ml-platform-3',
  'l5-ml-platform-4',
  'l5-ml-platform-5',
  'l5-ml-platform-6',
  'l5-ml-platform-7',
];

/**
 * L6: Next-Generation - KEEP 10 (only practical/interview-relevant)
 */
export const nextGenProblems = [
  // Next-gen Protocols (2 of 22) - Only practical ones
  'l6-protocol-6g-architecture',      // 5G/6G networking
  'l6-protocol-tcp-replacement',       // QUIC/HTTP3

  // Novel Databases (2 of 22) - Practical distributed systems
  'l6-db-cap-theorem-breaker',         // NewSQL/Spanner-like
  'l6-novel-databases-1',              // CRDTs

  // AI Infrastructure (3 of 21) - Practical ML/AI patterns
  'l6-ai-infrastructure-1',            // LLM serving
  'l6-ai-infrastructure-2',            // Vector databases
  'l6-ai-infrastructure-3',            // Model fine-tuning

  // Distributed Consensus (2 of 19) - Core algorithms
  'l6-distributed-consensus-1',        // Paxos/Raft
  'l6-distributed-consensus-2',        // Byzantine fault tolerance

  // Privacy Innovation (1 of 19) - Practical cryptography
  'l6-privacy-zkp-internet',           // Zero-knowledge proofs (blockchain)
];

/**
 * NFR Teaching Problems - Chapter 0: Systems Thinking & Architecture Evolution (8 total)
 */
export const nfrTeachingProblems = [
  // Module 1: Throughput & Horizontal Scaling (4)
  'nfr-ch0-throughput-calc',
  'nfr-ch0-peak-vs-avg',
  'nfr-ch0-read-write-ratio',
  'nfr-ch0-autoscaling',
  // Module 2: Burst Handling & Write Queues (2)
  'nfr-ch0-burst-qps',
  'nfr-ch0-write-queue-batching',
  // Module 3: Latency - Request-Response & Data Processing (2)
  'nfr-ch0-request-response-latency',
  'nfr-ch0-data-processing-latency',
];

/**
 * DDIA Teaching Problems - Concept-focused learning (151 total - ALL CHAPTERS)
 */
export const ddiaTeachingProblems = [
  // Chapter 1: Reliability, Scalability, Maintainability (15)
  'ddia-ch1-spof',
  'ddia-ch1-hardware-faults',
  'ddia-ch1-software-errors',
  'ddia-ch1-human-errors',
  'ddia-ch1-chaos-engineering',
  'ddia-ch1-vertical-scaling',
  'ddia-ch1-horizontal-scaling',
  'ddia-ch1-load-parameters',
  'ddia-ch1-performance-metrics',
  'ddia-ch1-fanout',
  'ddia-ch1-operability',
  'ddia-ch1-simplicity',
  'ddia-ch1-evolvability',
  'ddia-ch1-observability',
  'ddia-ch1-technical-debt',

  // Chapter 2: Data Models & Query Languages (12)
  'ddia-ch2-relational-schema',
  'ddia-ch2-foreign-keys',
  'ddia-ch2-sql-optimization',
  'ddia-ch2-indexing',
  'ddia-ch2-document-schema',
  'ddia-ch2-embedded-vs-referenced',
  'ddia-ch2-schema-on-read',
  'ddia-ch2-json-bson',
  'ddia-ch2-graph-basics',
  'ddia-ch2-graph-traversal',
  'ddia-ch2-property-graphs',
  'ddia-ch2-cypher-queries',

  // Chapter 3: Storage & Retrieval (10)
  'ddia-ch3-append-only-log',
  'ddia-ch3-lsm-trees',
  'ddia-ch3-bloom-filters',
  'ddia-ch3-btrees',
  'ddia-ch3-wal',
  'ddia-ch3-copy-on-write',
  'ddia-ch3-star-schema',
  'ddia-ch3-snowflake-schema',
  'ddia-ch3-columnar-storage',
  'ddia-ch3-materialized-views',

  // Chapter 4: Encoding & Evolution (8)
  'ddia-ch4-json-encoding',
  'ddia-ch4-binary-encoding',
  'ddia-ch4-avro-schema',
  'ddia-ch4-thrift',
  'ddia-ch4-forward-compatibility',
  'ddia-ch4-backward-compatibility',
  'ddia-ch4-schema-versioning',
  'ddia-ch4-migration-strategies',

  // Chapter 5: Replication (16)
  'ddia-read-replicas',
  'ddia-async-replication',
  'ddia-sync-replication',
  'ddia-replication-lag',
  'ddia-failover',
  'ddia-multi-datacenter',
  'ddia-write-conflicts',
  'ddia-conflict-resolution',
  'ddia-circular-topology',
  'ddia-star-topology',
  'ddia-quorum',
  'ddia-dynamo-style',
  'ddia-sloppy-quorum',
  'ddia-hinted-handoff',
  'ddia-read-repair',
  'ddia-anti-entropy',

  // Chapter 6: Partitioning (12)
  'ddia-hash-partitioning',
  'ddia-range-partitioning',
  'ddia-consistent-hashing',
  'ddia-hot-spot-avoidance',
  'ddia-composite-partitioning',
  'ddia-local-secondary-index',
  'ddia-global-secondary-index',
  'ddia-index-maintenance',
  'ddia-fixed-partitions',
  'ddia-dynamic-partitioning',
  'ddia-proportional-partitioning',
  'ddia-automatic-rebalancing',

  // Chapter 7: Transactions (16)
  'ddia-atomicity',
  'ddia-consistency',
  'ddia-isolation',
  'ddia-durability',
  'ddia-read-committed',
  'ddia-snapshot-isolation',
  'ddia-serializable',
  'ddia-repeatable-read',
  'ddia-dirty-reads',
  'ddia-dirty-writes',
  'ddia-read-skew',
  'ddia-write-skew',
  'ddia-phantom-reads',
  'ddia-two-phase-locking',
  'ddia-optimistic-concurrency',
  'ddia-deadlock-detection',

  // Chapter 8: Distributed Systems (15)
  'ddia-ch8-network-partitions',
  'ddia-ch8-timeouts',
  'ddia-ch8-circuit-breakers',
  'ddia-ch8-idempotency',
  'ddia-ch8-tcp-vs-udp',
  'ddia-ch8-time-of-day-clocks',
  'ddia-ch8-monotonic-clocks',
  'ddia-ch8-lamport-timestamps',
  'ddia-ch8-vector-clocks',
  'ddia-ch8-ntp',
  'ddia-ch8-byzantine-faults',
  'ddia-ch8-merkle-trees',
  'ddia-ch8-digital-signatures',
  'ddia-ch8-pbft',
  'ddia-ch8-blockchain',

  // Chapter 9: Consensus (14)
  'ddia-linearizability',
  'ddia-eventual-consistency',
  'ddia-causal-consistency',
  'ddia-read-your-writes',
  'ddia-monotonic-reads',
  'ddia-paxos',
  'ddia-raft',
  'ddia-leader-election',
  'ddia-distributed-locks',
  'ddia-fencing-tokens',
  'ddia-g-counter',
  'ddia-pn-counter',
  'ddia-lww-register',
  'ddia-or-set',

  // Chapter 10: Batch Processing (10)
  'ddia-ch10-map-function',
  'ddia-ch10-reduce-function',
  'ddia-ch10-combiner',
  'ddia-ch10-distributed-sort',
  'ddia-ch10-join-algorithms',
  'ddia-ch10-spark-rdds',
  'ddia-ch10-dag-execution',
  'ddia-ch10-lazy-evaluation',
  'ddia-ch10-caching-results',
  'ddia-ch10-lineage-recovery',

  // Chapter 11: Stream Processing (15)
  'ddia-ch11-message-brokers',
  'ddia-ch11-pubsub',
  'ddia-ch11-partitioned-logs',
  'ddia-ch11-consumer-groups',
  'ddia-ch11-offset-management',
  'ddia-ch11-tumbling-windows',
  'ddia-ch11-sliding-windows',
  'ddia-ch11-session-windows',
  'ddia-ch11-event-time',
  'ddia-ch11-watermarks',
  'ddia-ch11-stream-joins',
  'ddia-ch11-stream-aggregations',
  'ddia-ch11-stream-table-duality',
  'ddia-ch11-exactly-once',
  'ddia-ch11-checkpointing',

  // Chapter 12: Future of Data Systems (8)
  'ddia-ch12-lambda-architecture',
  'ddia-ch12-kappa-architecture',
  'ddia-ch12-cdc',
  'ddia-ch12-event-sourcing',
  'ddia-ch12-materialized-views-derived',
  'ddia-ch12-cache-invalidation-derived',
  'ddia-ch12-search-index-maintenance',
  'ddia-ch12-cqrs',
];

/**
 * System Design Primer Problems (77 total)
 */
export const systemDesignPrimerProblems = [
  // Performance & Scalability (10)
  'sdp-performance-vs-scalability',
  'sdp-latency-vs-throughput',
  'sdp-cap-theorem',
  'sdp-amdahls-law',
  'sdp-littles-law',
  'sdp-load-testing',
  'sdp-stress-testing',
  'sdp-capacity-planning',
  'sdp-performance-profiling',
  'sdp-cost-optimization',

  // DNS (5)
  'sdp-dns-basics',
  'sdp-dns-records',
  'sdp-dns-caching',
  'sdp-dns-load-balancing',
  'sdp-geo-routing',

  // CDN (6)
  'sdp-cdn-basics',
  'sdp-push-cdn',
  'sdp-pull-cdn',
  'sdp-cdn-cache-invalidation',
  'sdp-cdn-ssl-termination',
  'sdp-cdn-ddos-protection',

  // Load Balancers (8)
  'sdp-layer4-load-balancing',
  'sdp-layer7-load-balancing',
  'sdp-round-robin-lb',
  'sdp-least-connections-lb',
  'sdp-ip-hash-lb',
  'sdp-health-checks-lb',
  'sdp-session-affinity-lb',
  'sdp-active-passive-failover',

  // Reverse Proxy (4)
  'sdp-nginx-reverse-proxy',
  'sdp-ssl-termination-proxy',
  'sdp-compression-proxy',
  'sdp-static-asset-proxy',

  // Application Layer (8)
  'sdp-microservices',
  'sdp-service-discovery',
  'sdp-bff',
  'sdp-sidecar',
  'sdp-bulkhead',
  'sdp-retry-backoff',
  'sdp-rate-limiting',
  'sdp-api-versioning',

  // Database (4)
  'sdp-denormalization',
  'sdp-sql-optimization',
  'sdp-key-value-store',
  'sdp-wide-column-store',

  // Caching (6)
  'sdp-client-side-caching',
  'sdp-web-server-caching',
  'sdp-cache-aside',
  'sdp-write-behind-cache',
  'sdp-refresh-ahead-cache',
  'sdp-cache-eviction-policies',

  // Asynchronism (5)
  'sdp-task-queues',
  'sdp-producer-consumer',
  'sdp-priority-queues',
  'sdp-dead-letter-queues',
  'sdp-back-pressure',

  // Communication (12)
  'sdp-http-methods',
  'sdp-http-status-codes',
  'sdp-http2',
  'sdp-http3',
  'sdp-grpc',
  'sdp-thrift',
  'sdp-json-rpc',
  'sdp-xml-rpc',
  'sdp-restful-api-design',
  'sdp-hateoas',
  'sdp-graphql',
  'sdp-websocket',

  // Security (9)
  'sdp-https-tls',
  'sdp-ssl-certificates',
  'sdp-authentication',
  'sdp-authorization',
  'sdp-api-keys',
  'sdp-oauth2',
  'sdp-sql-injection-prevention',
  'sdp-xss-prevention',
  'sdp-csrf-prevention',
];

/**
 * Complete whitelist of all problem IDs to keep
 */
export const problemWhitelist = new Set([
  ...originalProblems,                // 40
  ...patternProblems,                 // 35 (30 original + 5 DDIA gaps)
  ...platformProblems,                // 107
  ...nextGenProblems,                 // 10
  ...nfrTeachingProblems,             // 7 (Chapter 0: Modules 1-3)
  ...ddiaTeachingProblems,            // 151 (ALL CHAPTERS!)
  ...systemDesignPrimerProblems,      // 77
  // Total: 427 problems
]);

/**
 * Helper function to check if a problem should be kept
 */
export function shouldKeepProblem(problemId: string): boolean {
  return problemWhitelist.has(problemId);
}
