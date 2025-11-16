/**
 * Problem Whitelist - 250 curated problems
 *
 * Breakdown:
 * - L1: 40 original real-world problems (Instagram, Twitter, etc.)
 * - L2-4: 35 distinct pattern examples (30 patterns + 5 DDIA gaps)
 * - L5: 107 platform problems (migrations, APIs, multi-tenant, etc.)
 * - L6: 10 next-gen problems (practical modern tech)
 * - DDIA Teaching: 58 concept-focused problems (new!)
 *
 * DDIA Teaching Problems (58 new):
 * - Chapter 5 Replication: 16 problems
 * - Chapter 6 Partitioning: 12 problems
 * - Chapter 7 Transactions: 16 problems
 * - Chapter 9 Consensus: 14 problems
 *
 * These teaching problems focus on individual DDIA concepts, providing
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
 * DDIA Teaching Problems - Concept-focused learning (58)
 */
export const ddiaTeachingProblems = [
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
];

/**
 * Complete whitelist of all problem IDs to keep
 */
export const problemWhitelist = new Set([
  ...originalProblems,      // 40
  ...patternProblems,       // 35 (30 original + 5 DDIA gaps)
  ...platformProblems,      // 107
  ...nextGenProblems,       // 10
  ...ddiaTeachingProblems,  // 58
  // Total: 250 problems
]);

/**
 * Helper function to check if a problem should be kept
 */
export function shouldKeepProblem(problemId: string): boolean {
  return problemWhitelist.has(problemId);
}
