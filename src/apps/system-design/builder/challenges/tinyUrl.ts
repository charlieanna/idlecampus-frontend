import { Challenge } from '../types/testCase';
import { tinyUrlCodeChallenges } from './code/tinyUrlChallenges';
import { tinyUrlProblemDefinition } from './tinyUrlProblemDefinition';

export const tinyUrlChallenge: Challenge = {
  id: 'tiny_url',
  title: 'Tiny URL Shortener',
  difficulty: 'beginner',
  // Attach problem definition with guided tutorial
  problemDefinition: tinyUrlProblemDefinition,
  description: `Design a URL shortening service (like bit.ly) that accepts long URLs and returns short codes.

Users can then use these short codes to redirect to the original URLs.

Example:
- POST /shorten with https://example.com/very/long/url → returns abc123
- GET /abc123 → redirects to https://example.com/very/long/url`,

  requirements: {
    functional: [
      'Accept long URLs, generate short codes',
      'Redirect short codes to original URLs',
      'Short codes should be unique',
    ],
    traffic: '1,000 RPS reads (redirects), 100 RPS writes (create short URLs)',
    latency: 'p99 < 100ms for redirects',
    availability: '99.9% uptime',
    budget: '$2,500/month', // Realistic budget for handling all NFR tests including write spikes requiring sharding (4 shards + multi-leader replication)
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
      description: 'Users can create short URLs and access them for redirects. The system must accept requests and return responses.',
      traffic: {
        type: 'mixed',
        rps: 10, // Very low traffic, just testing basic functionality
        readRps: 5,
        writeRps: 5,
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
        instances: 10,
        serviceName: 'read-api',
        handledAPIs: [
          'GET /api/*'
        ],
        displayName: 'Read API',
        subtitle: '10 instance(s)'
      }
    },
    {
      type: 'app_server',
      config: {
        instances: 2,
        serviceName: 'write-api',
        handledAPIs: [
          'POST /api/*',
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: 'Write API',
        subtitle: '2 instance(s)'
      }
    },
    {
      type: 'redis',
      config: {
        sizeGB: 19,
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
          shards: 38,
          shardKey: 'id'
        },
        displayName: 'PostgreSQL Master',
        subtitle: 'Writes + 3 replicas (reads)'
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
  explanation: 'Reference Solution for Tiny URL Shortener (CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 6 instances handling 4998 read RPS (GET requests)\n- **Write API**: 2 instances handling 1000 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **19GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~4498 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 38 shards (sharded by id).\n  • Read Capacity: 4998 RPS across 4 database instance(s)\n  • Write Capacity: 1000 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 98.0%, Write: 2.0%, Total: 5100 RPS)\n- **Read API (6 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (2 instances)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 2.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don\'t get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn\'t affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 38 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!'
      }
    },
    {
      name: 'Fast Redirects',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Redirect short codes to the original URL within the latency target. Requires cache-aside pattern so hot URLs avoid the database.',
      traffic: {
        type: 'read',
        rps: 500,
        readRps: 500,
      },
      duration: 30,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.01,
      },
    },
    {
      name: 'Unique Short Codes',
      type: 'functional',
      requirement: 'FR-3',
      description: 'Ensure duplicate URLs map to a single code while distinct URLs remain unique. Detect collisions and route writes through a consistent ID generator.',
      traffic: {
        type: 'mixed',
        rps: 50,
        readRps: 25,
        writeRps: 25,
      },
      duration: 30,
      passCriteria: {
        maxErrorRate: 0,
      },
    },
    // ========== NON-FUNCTIONAL REQUIREMENTS (NFR) ==========
    {
      name: 'NFR-P1: Redirect Latency Budget',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'Handle the stated steady-state traffic of 1,000 redirect RPS while keeping p99 latency under 100ms.',
      traffic: {
        type: 'read',
        rps: 1000,
        readRps: 1000,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.01,
      },
    },
    {
      name: 'NFR-S1: Viral Traffic Spike',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'Absorb a sudden viral spike where total traffic jumps to 2,000 RPS (90% reads, 10% writes) without overwhelming app servers or databases.',
      traffic: {
        type: 'mixed',
        rps: 2000,
        readRps: 1800,
        writeRps: 200,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 150,
        maxErrorRate: 0.05,
      },
    },
    {
      name: 'NFR-R1: Database Failover',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Primary database fails mid-test. Architecture must promote a replica or serve from cache so availability stays within SLA.',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRps: 1000,
        writeRps: 100,
      },
      duration: 90,
      failureInjection: {
        type: 'db_crash',
        atSecond: 45,
        recoverySecond: 65,
      },
      passCriteria: {
        minAvailability: 0.99,
        maxDowntime: 10,
        maxErrorRate: 0.1,
      },
    },
    {
      name: 'NFR-C1: Cost Guardrail',
      type: 'cost',
      requirement: 'NFR-C1',
      description: 'Meet the $2,500/month budget target while sustaining normal production traffic. Encourages right-sizing of cache, DB replicas, and CDN usage.',
      traffic: {
        type: 'mixed',
        rps: 1100,
        readRps: 1000,
        writeRps: 100,
      },
      duration: 60,
      passCriteria: {
        maxMonthlyCost: 2500,
        maxErrorRate: 0.05,
      },
    },
  ]
};
