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
  // Tutorials (0) - Removed (tutorials are filtered out from problem catalog)
  // 'tutorial-simple-blog' - Removed
  // 'tutorial-intermediate-images' - Removed
  // 'tutorial-advanced-chat' - Removed
  // 'boe-walkthrough-chat' - Removed

  // DDIA Gap Problems (0) - All covered in comprehensive problems and DDIA lessons
  // 'batch-processing-mapreduce' - Removed (covered in comprehensive-ecommerce-platform + DDIA lessons)
  // 'explicit-sharding-design' - Removed (covered in comprehensive-cloud-storage-platform + DDIA lessons)
  // 'transaction-isolation-levels' - Removed (covered in comprehensive-ecommerce-platform + DDIA lessons)
  // 'data-warehouse-olap' - Removed (covered in DDIA lessons)
  // 'graph-database-social' - Removed (covered in DDIA lessons)

  // Caching (2 of 36) - Distinct patterns only
  'tiny-url-l6',                // URL shortener L6-level (percentile-based latency, tail amplification, cascading failures)
  'tinyurl',                    // URL shortener, classic caching (advanced version)
  // 'tiny_url' - Removed (simpler version, keep advanced 'tinyurl' instead)
  // 'session-store-basic' - Removed (covered in comprehensive-ecommerce-platform)
  // 'social-feed-cache' - Removed (covered in comprehensive-ecommerce-platform)
  // 'config-cache-basic' - Integrated into comprehensive-api-gateway-platform
  // 'multi-tenant-saas-cache' - Removed (covered in comprehensive-ecommerce-platform)

  // Gateway (0 of 36) - All covered in comprehensive-api-gateway-platform
  // 'rate-limiter' - Removed (covered in comprehensive-api-gateway-platform)
  // 'basic-api-gateway' - Removed (covered in comprehensive-api-gateway-platform)
  // 'authentication-gateway' - Removed (covered in comprehensive-api-gateway-platform)

  // Streaming (1 of 37) - Key streaming patterns
  // 'chat' - Removed (covered in comprehensive-social-media-platform)
  // 'ingestion' - Removed (covered in comprehensive-social-media-platform)
  // 'clickstream-analytics' - Removed (covered in comprehensive-social-media-platform)
  // 'event-sourcing-basic' - Removed (covered in comprehensive-social-media-platform)
  'kafka-streaming-pipeline',   // CDC/Change data capture (advanced, keep standalone)

  // Storage (0 of 35) - All covered in comprehensive-cloud-storage-platform
  // 'basic-database-design' - Removed (conceptual, better as lesson)
  // 'nosql-basics' - Removed (conceptual, better as lesson)
  // 'time-series-metrics' - Removed (conceptual, better as lesson)
  // 'distributed-database' - Removed (conceptual, better as lesson)

  // Search (0 of 35) - All covered in comprehensive-search-platform
  // 'basic-text-search' - Removed (covered in comprehensive-search-platform)
  // 'autocomplete-search' - Removed (covered in comprehensive-search-platform)
  // 'geo-search' - Removed (covered in comprehensive-search-platform)
  // 'faceted-search' - Removed (covered in comprehensive-search-platform)

  // Multiregion (3 of 35) - Key multi-region patterns
  'active-active-regions',      // Active-active replication (user-facing problem)
  // 'global-load-balancing' - Removed (covered in comprehensive problems)
  'cross-region-failover',      // Disaster recovery (user-facing problem)
  // 'conflict-resolution' - Removed (covered in comprehensive problems)
  'edge-computing',             // Edge computing (Cloudflare Workers) - unique concept

  // Additional Requested Problems
  'financial-trading-cache',    // Stock Exchange / High Frequency Trading
  'gaming-leaderboard-cache',   // Real-time Gaming Leaderboard
  'email-queue-system',         // Distributed Email System
];

/**
 * L5: Complex Platforms - KEEP 9 (was 70, removed 61 migration problems)
 * All numbered L5 problems (l5-*-1, l5-*-2, etc.) are migration problems and have been removed.
 * Only keeping named problems (Facebook, Netflix, Salesforce, Uber, Google, Apple, Datadog, Kubernetes, Meta, TikTok)
 */
export const platformProblems = [
  // Platform Migration (0) - Removed (migration problems are too abstract, focus on building systems first)
  // All 37 migration problems removed:
  // - 19 named migration problems (netflix, twitter, spotify, uber, etc.)
  // - 18 generic platform-migration problems
  // See lesson: platform-migration-strategies for migration concepts

  // API Platform (2 of 19) - Best examples only
  'l5-api-gateway-facebook',
  'l5-api-graphql-federation',
  // 'l5-api-platform-1' through '-8' - Removed (all migration problems, duplicates of removed migration problems)

  // Multi-tenant (1 of 18) - Best example only
  'l5-multitenant-salesforce',
  // 'l5-multi-tenant-1' through '-7' - Removed (all migration problems)

  // Data Platform (1 of 18) - Best example only
  'l5-data-platform-uber',
  // 'l5-data-platform-1' through '-9' - Removed (all migration problems)

  // Developer Productivity (1 of 18) - Best example only
  'l5-devprod-google-ci',
  // 'l5-developer-productivity-1' through '-7' - Removed (all migration problems)

  // Compliance & Security (1 of 18) - Best example only
  'l5-security-apple-encryption',
  // 'l5-compliance-security-1' through '-9' - Removed (all migration problems)

  // Observability (1 of 18) - Best example only
  'l5-observability-datadog',
  // 'l5-observability-1' through '-7' - Removed (all migration problems)

  // Infrastructure (1 of 18) - Best example only
  'l5-infra-kubernetes-platform',
  // 'l5-infrastructure-1' through '-7' - Removed (all migration problems)

  // ML Platform (1 of 18) - Best example only
  'l5-ml-platform-meta',
  // 'l5-ml-platform-1' through '-7' - Removed (all migration problems)
];

/**
 * L6: Next-Generation - KEEP 5 (only practical/interview-relevant)
 * Removed all speculative problems (quantum, DNA, interplanetary, biological, energy, economic)
 */
export const nextGenProblems = [
  // Next-gen Protocols (2 of 22) - Only practical ones
  'l6-protocol-6g-architecture',      // 5G/6G networking
  'l6-protocol-tcp-replacement',       // QUIC/HTTP3

  // Novel Databases (1 of 22) - Practical distributed systems only
  'l6-db-cap-theorem-breaker',         // NewSQL/Spanner-like
  // 'l6-novel-databases-1' - Removed (actually "DNA Storage Infrastructure" - speculative, not CRDTs as comment said)

  // AI Infrastructure (0) - Removed (all 21 problems are speculative: AGI, consciousness, quantum, biological computing)
  // Practical ML problems are covered by l5-ml-platform-* problems (Meta, OpenAI, MLflow, SageMaker, etc.)
  // 'l6-ai-infrastructure-1' - Removed (was labeled "LLM serving" but actually "AGI Training Infrastructure")
  // 'l6-ai-infrastructure-2' - Removed (was labeled "Vector databases" but actually "Consciousness Simulation Infrastructure")
  // 'l6-ai-infrastructure-3' - Removed (was labeled "Model fine-tuning" but actually "Swarm Intelligence Infrastructure")

  // Distributed Consensus (2 of 19) - Core algorithms
  'l6-distributed-consensus-1',        // Paxos/Raft
  'l6-distributed-consensus-2',        // Byzantine fault tolerance

  // Privacy Innovation (1 of 19) - Practical cryptography
  'l6-privacy-zkp-internet',           // Zero-knowledge proofs (blockchain)
];

/**
 * Comprehensive Problems - KEEP ALL 5
 * These are the flagship problems that integrate multiple concepts.
 */
export const comprehensiveProblems = [
  'comprehensive-social-media-platform',
  'comprehensive-ecommerce-platform',
  'comprehensive-search-platform',
  'comprehensive-api-gateway-platform',
  'comprehensive-cloud-storage-platform',
];

/**
 * NFR Teaching Problems - Chapter 0: Systems Thinking & Architecture Evolution (16 total)
 * Converted to lessons (see src/apps/system-design/builder/data/lessons/nfr/)
 * Concepts are also integrated into comprehensive problems (see comprehensive/*.ts)
 */
export const nfrTeachingProblems: string[] = [
  // All 16 problems converted to 2 comprehensive lessons:
  // - nfr-fundamentals (Throughput, Peak vs Average, Read-Write Ratio, Autoscaling, Burst Handling, Latency)
  // - nfr-data-consistency (Durability, Sharding, Consistency Models)
];

/**
 * DDIA Teaching Problems - Concept-focused learning (151 total - ALL CHAPTERS)
 */
export const ddiaTeachingProblems = [
  // Chapter 1: Reliability, Scalability, Maintainability
  // Note: All concepts are covered in comprehensive problems or converted to lessons
  // Fan-out has been integrated into comprehensive-social-media-platform

  // Chapter 2-4: Converted to lessons (concepts covered in comprehensive problems or lessons)
  // See: ddia-ch2-data-models, ddia-ch3-storage-retrieval, ddia-ch4-encoding-evolution lessons

  // Chapter 5-6: Converted to lessons (concepts integrated into comprehensive problems)
  // See: ddia-ch5-replication, ddia-ch6-partitioning lessons
  // Concepts are also integrated into:
  // - Multi-region problems (Ch. 5: Replication, read replicas, failover)
  // - Cloud Storage Platform (Ch. 5: Replication, Ch. 6: Partitioning, consistent hashing)

  // Chapter 7-12: Converted to lessons (concepts integrated into comprehensive problems or lessons)
  // See: ddia-ch7-transactions, ddia-ch8-distributed-systems, ddia-ch9-consensus,
  //      ddia-ch10-batch-processing, ddia-ch11-stream-processing, ddia-ch12-future-data-systems lessons
  // Concepts are also integrated into:
  // - E-commerce Platform (Ch. 7: Transactions, Ch. 10: Batch, Ch. 11: Stream, Ch. 12: Event Sourcing, CQRS)
  // - Social Media Platform (Ch. 11: Stream, Ch. 12: Event Sourcing, CQRS, Lambda/Kappa, CDC)
  // - API Gateway Platform (Ch. 8: Circuit breakers, timeouts, idempotency)
  // - Cloud Storage Platform (Ch. 9: Consensus/Raft, Ch. 10: Batch)
];

/**
 * System Design Primer Problems (77 total)
 * Converted to lessons (see src/apps/system-design/builder/data/lessons/sdp/)
 * Concepts are also integrated into comprehensive problems (see comprehensive/*.ts)
 */
export const systemDesignPrimerProblems: string[] = [
  // All 77 problems converted to 10 comprehensive lessons:
  // - sdp-performance-scalability (Performance, Scalability, CAP, Amdahl's Law, Little's Law)
  // - sdp-dns (DNS basics, records, caching, load balancing, geo-routing)
  // - sdp-cdn (CDN basics, push/pull, cache invalidation, SSL termination)
  // - sdp-load-balancers (Layer 4/7, algorithms, health checks, session affinity)
  // - sdp-application-layer (Microservices, service discovery, BFF, sidecar, bulkhead, retry, rate limiting)
  // - sdp-database (Denormalization, SQL optimization, NoSQL models)
  // - sdp-caching (Cache-aside, write-through, write-behind, refresh-ahead, eviction policies)
  // - sdp-asynchronism (Message queues, producer-consumer, priority queues, DLQ, backpressure)
  // - sdp-communication (HTTP, REST, gRPC, GraphQL, WebSocket)
  // - sdp-security (HTTPS/TLS, authentication, authorization, OAuth, SQL injection, XSS, CSRF)
];

/**
 * Complete whitelist of all problem IDs to keep
 */
export const problemWhitelist = new Set([
  ...originalProblems,                // 40
  ...patternProblems,                 // 6 (Filtered)
  ...platformProblems,                // 9 (Filtered)
  ...nextGenProblems,                 // 6 (Filtered)
  ...comprehensiveProblems,           // 5 (Flagship)
  ...nfrTeachingProblems,             // 0 (Converted to lessons)
  ...ddiaTeachingProblems,            // 0 (Converted to lessons)
  ...systemDesignPrimerProblems,      // 0 (Converted to lessons)
  // Total: 66 problems
]);

/**
 * Helper function to check if a problem should be kept
 */
export function shouldKeepProblem(problemId: string): boolean {
  return problemWhitelist.has(problemId);
}
