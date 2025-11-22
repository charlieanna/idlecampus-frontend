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
    traffic: '2,000 RPS reads (90% images, 10% HTML)',
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
        instances: 1,
        serviceName: 'read-api',
        handledAPIs: [
          'GET /api/*'
        ],
        displayName: 'Read API',
        subtitle: '1 instance(s)'
      }
    },
    {
      type: 'app_server',
      config: {
        instances: 1,
        serviceName: 'write-api',
        handledAPIs: [
          'POST /api/*',
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: 'Write API',
        subtitle: '1 instance(s)'
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
        replicationMode: 'single-leader',
        replication: {
          enabled: true,
          replicas: 1,
          mode: 'async'
        },
        sharding: {
          enabled: false,
          shards: 1,
          shardKey: 'id'
        },
        displayName: 'PostgreSQL Master',
        subtitle: 'Writes + 1 replica (reads)'
      }
    },
    {
      type: 'cdn',
      config: {
        enabled: true
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
      type: 'read',
      label: 'Read traffic (GET)'
    },
    {
      from: 'load_balancer',
      to: 'app_server',
      type: 'write',
      label: 'Write traffic (POST/PUT/DELETE)'
    },
    {
      from: 'app_server',
      to: 'redis',
      type: 'read',
      label: 'Read API checks cache'
    },
    {
      from: 'app_server',
      to: 'postgresql',
      type: 'read',
      label: 'Read API → Replicas'
    },
    {
      from: 'app_server',
      to: 'postgresql',
      type: 'write',
      label: 'Write API → Master'
    },
    {
      from: 'redis',
      to: 'postgresql',
      type: 'read',
      label: 'Cache miss → DB lookup'
    },
    {
      from: 'client',
      to: 'cdn',
      type: 'read'
    },
    {
      from: 'cdn',
      to: 's3',
      type: 'read'
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
  explanation: 'Reference Solution for Food Blog with Images (CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 1 instance handling 98 read RPS (GET requests)\n- **Write API**: 1 instance handling 5 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **5GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~88 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: single leader configuration with 1 read replica.\n  • Read Capacity: 98 RPS across 2 database instance(s)\n  • Write Capacity: 5 RPS to primary leader\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 1.0%, Write: 99.0%, Total: 10000 RPS)\n- **Read API (1 instance)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (1 instance)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 99.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don\'t get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn\'t affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Single-leader chosen for strong consistency. All writes go to primary, reads can use replicas with eventual consistency (DDIA Ch. 5).\n- **Vertical Scaling**: Single database shard sufficient for current load. Can add sharding later if write throughput exceeds single-node capacity.\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!'
      }
    }
  ]
};
