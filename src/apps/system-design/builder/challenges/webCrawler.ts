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
    traffic: '1000 RPS (write-heavy)',
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

  learningObjectives: [
    'Understand distributed crawling',
    'Learn queue-based architecture',
    'Master worker patterns',
    'Practice politeness constraints',
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
    },
  ],


  solution: {
  "components": [
    {
      "type": "client",
      "config": {}
    },
    {
      "type": "app_server",
      "config": {
        "instances": 1
      }
    },
    {
      "type": "redis",
      "config": {
        "sizeGB": 5,
        "strategy": "cache_aside"
      }
    },
    {
      "type": "postgresql",
      "config": {
        "instanceType": "commodity-db",
        "replicationMode": "single-leader",
        "replication": {
          "enabled": true,
          "replicas": 1,
          "mode": "async"
        },
        "sharding": {
          "enabled": false,
          "shards": 1,
          "shardKey": "id"
        },
        "displayName": "PostgreSQL Master",
        "subtitle": "Writes + 1 replica (reads)"
      }
    },
    {
      "type": "s3",
      "config": {}
    },
    {
      "type": "message_queue",
      "config": {}
    }
  ],
  "connections": [
    {
      "from": "client",
      "to": "app_server",
      "type": "read_write"
    },
    {
      "from": "app_server",
      "to": "redis",
      "type": "read_write"
    },
    {
      "from": "app_server",
      "to": "postgresql",
      "type": "read_write"
    },
    {
      "from": "redis",
      "to": "postgresql",
      "type": "read",
      "label": "Cache miss \u2192 DB lookup"
    },
    {
      "from": "app_server",
      "to": "s3",
      "type": "read_write"
    },
    {
      "from": "app_server",
      "to": "message_queue",
      "type": "write"
    }
  ],
  "explanation": "Reference Solution for Web Crawler:\n\n\ud83d\udcca Infrastructure Components:\n- **1 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 1000 RPS (peak: 200 RPS with 20% headroom for traffic spikes).\n- **Direct Connection**: Single app server, no load balancer needed for current traffic.\n- **5GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~3 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: single leader configuration with 1 read replica.\n  \u2022 Read Capacity: 3 RPS across 2 database instance(s)\n  \u2022 Write Capacity: 7 RPS to primary leader\n  \u2022 Replication: Asynchronous (eventual consistency, < 1s lag typical)\n\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n\ud83d\udca1 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Single-leader chosen for strong consistency. All writes go to primary, reads can use replicas with eventual consistency (DDIA Ch. 5).\n- **Vertical Scaling**: Single database shard sufficient for current load. Can add sharding later if write throughput exceeds single-node capacity.\n\n\u26a0\ufe0f Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n\u2705 Has all required components (from functionalRequirements.mustHave)\n\u2705 Has all required connections (from functionalRequirements.mustConnect)\n\u2705 Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
