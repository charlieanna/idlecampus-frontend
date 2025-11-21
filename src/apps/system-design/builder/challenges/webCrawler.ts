import { Challenge } from '../types/testCase';

export const webCrawlerChallenge: Challenge = {
  id: 'web_crawler',
  title: 'Web Crawler',
  difficulty: 'intermediate',
  description: `Design a web crawler that discovers and indexes web pages while being polite and scalable.

The crawler should manage a URL frontier, fetch pages, respect basic politeness constraints, and store crawled content for downstream indexing.

Example:
- Worker pops URL from frontier → fetches page → extracts links → enqueues new URLs
- Persist crawled pages and metadata in storage for later search/indexing`,

  requirements: {
    functional: [
      'Maintain a URL frontier of pages to crawl',
      'Fetch and parse pages from the web',
      'Avoid re-crawling the same URL repeatedly',
      'Persist crawled content and metadata',
    ],
    traffic: '200 RPS (mix of page fetches and frontier operations)',
    latency: 'p99 < 500ms for frontier operations',
    availability: '99.9% uptime',
    budget: '$1,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'worker',
    'database',
    'cache',
    'message_queue',
    's3',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS (FR) ==========
    {
      name: 'Basic Crawl Pipeline',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Crawler can fetch pages and store them in storage. Client can trigger crawl jobs that flow through app → worker → storage.',
      traffic: {
        type: 'mixed',
        rps: 10,
        readRatio: 0.3,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
      solution: {
  components: [
    {
      type: 'client',
      config: {}
    },
    {
      type: 'load_balancer',
      config: {
        algorithm: 'least_connections'
      }
    },
    {
      type: 'app_server',
      config: {
        instances: 2
      }
    },
    {
      type: 'redis',
      config: {
        sizeGB: 5,
        strategy: 'cache_aside'
      }
    },
    {
      type: 'postgresql',
      config: {
        instanceType: 'commodity-db',
        replicationMode: 'multi-leader',
        replication: {
          enabled: true,
          replicas: 3,
          mode: 'async'
        },
        sharding: {
          enabled: true,
          shards: 18,
          shardKey: 'id'
        },
        displayName: 'PostgreSQL Master',
        subtitle: 'Writes + 3 replicas (reads)'
      }
    },
    {
      type: 's3',
      config: {}
    },
    {
      type: 'message_queue',
      config: {}
    }
  ],
  connections: [
    {
      from: 'client',
      to: 'load_balancer',
      type: 'read_write'
    },
    {
      from: 'load_balancer',
      to: 'app_server',
      type: 'read_write'
    },
    {
      from: 'app_server',
      to: 'redis',
      type: 'read_write'
    },
    {
      from: 'app_server',
      to: 'postgresql',
      type: 'read_write'
    },
    {
      from: 'redis',
      to: 'postgresql',
      type: 'read',
      label: 'Cache miss → DB lookup'
    },
    {
      from: 'app_server',
      to: 's3',
      type: 'read_write'
    },
    {
      from: 'app_server',
      to: 'message_queue',
      type: 'write'
    }
  ],
  explanation: `Reference Solution for Web Crawler:\n\n📊 Infrastructure Components:\n- **2 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 2000 RPS (peak: 800 RPS with 20% headroom for traffic spikes).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **5GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~288 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 18 shards (sharded by id).\n  • Read Capacity: 320 RPS across 4 database instance(s)\n  • Write Capacity: 480 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 18 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!`
      },
    },
  ],
};
