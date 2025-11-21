import { Challenge } from '../types/testCase';
import { foodBlogCodeChallenges } from './code/foodBlogChallenges';

export const foodBlogChallenge: Challenge = {
  id: 'food_blog',
  title: 'Food Blog with Images',
  difficulty: 'beginner',
  description: `Design a food blogging platform where users can read articles and view high-resolution food photos.

The blog is read-heavy with lots of images. Most traffic comes from organic search and social media shares.

Example:
- GET /posts/chocolate-cake → HTML page (50KB)
- GET /images/chocolate-cake-1.jpg → Image (2MB)
- Each blog post has 5-10 images on average`,

  requirements: {
    functional: [
      'Serve blog posts (HTML pages)',
      'Serve high-resolution food images',
      'Handle viral traffic spikes from social media',
    ],
    traffic: '3000 RPS (read-heavy)',
    latency: 'p99 < 500ms for all assets',
    availability: '99% uptime',
    budget: '$3,000/month',
  },

  availableComponents: [
    'client',
    'load_balancer',
    'app_server',
    'database',
    'cache',
    'message_queue',
    'cdn',
    's3',
  ],

  learningObjectives: [
    'Understand CDN for static content delivery',
    'Learn object storage for large files',
    'Master read-heavy architecture patterns',
    'Practice caching for viral traffic',
  ],

  testCases: [
    // ========== FUNCTIONAL REQUIREMENTS (FR) ==========
    {
      name: 'Basic Connectivity',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can access blog posts and view images. The system must serve HTML pages and image files.',
      traffic: {
        type: 'read',
        rps: 10, // Very low traffic, just testing basic functionality
        avgResponseSizeMB: 1, // Mix of HTML and images
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0, // Must work perfectly
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
        "sizeGB": 4,
        "strategy": "cache_aside"
      }
    },
    {
      "type": "postgresql",
      "config": {
        "instanceType": "commodity-db",
        "replicationMode": "single-leader",
        "replication": {
          "enabled": false,
          "replicas": 0,
          "mode": "async"
        },
        "sharding": {
          "enabled": false,
          "shards": 1,
          "shardKey": "id"
        },
        "displayName": "PostgreSQL"
      }
    },
    {
      "type": "cdn",
      "config": {
        "enabled": true
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
      "from": "client",
      "to": "cdn",
      "type": "read"
    },
    {
      "from": "cdn",
      "to": "s3",
      "type": "read"
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
  "explanation": "Reference Solution for Food Blog with Images:\n\n\ud83d\udcca Infrastructure Components:\n- **1 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 1000 RPS (peak: 10 RPS with 20% headroom for traffic spikes).\n- **Direct Connection**: Single app server, no load balancer needed for current traffic.\n- **4GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~0 RPS served from cache (~0% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: single leader configuration with 0 read replicas.\n  \u2022 Read Capacity: 0 RPS across 1 database instance(s)\n  \u2022 Write Capacity: 0 RPS to primary leader\n  \u2022 Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n\ud83d\udca1 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching**: Cache layer for read optimization and reduced database load.\n- **Replication Mode**: Single-leader chosen for strong consistency. All writes go to primary, reads can use replicas with eventual consistency (DDIA Ch. 5).\n- **Vertical Scaling**: Single database shard sufficient for current load. Can add sharding later if write throughput exceeds single-node capacity.\n\n\u26a0\ufe0f Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n\u2705 Has all required components (from functionalRequirements.mustHave)\n\u2705 Has all required connections (from functionalRequirements.mustConnect)\n\u2705 Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
