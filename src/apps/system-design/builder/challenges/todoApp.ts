import { Challenge } from '../types/testCase';
import { todoAppCodeChallenges } from './code/todoAppChallenges';

export const todoAppChallenge: Challenge = {
  id: 'todo_app',
  title: 'Collaborative Todo App',
  difficulty: 'intermediate',
  description: `Design a collaborative todo list application where users can create, read, update, and delete tasks.

The app requires high availability because teams rely on it for work. Any downtime directly impacts productivity.

Example:
- GET /todos → List all todos for user
- POST /todos → Create new todo
- PUT /todos/:id → Update todo (mark complete)
- DELETE /todos/:id → Delete todo`,

  requirements: {
    functional: [
      'Create, read, update, delete todos',
      'Support concurrent users',
      'Maintain data consistency',
      'Handle database failures gracefully',
    ],
    traffic: '500 RPS (60% reads, 40% writes)',
    latency: 'p99 < 200ms',
    availability: '99.9% uptime (critical!)',
    budget: '$800/month',
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
      name: 'Basic CRUD Operations',
      type: 'functional',
      requirement: 'FR-1',
      description: 'Users can create, read, update, and delete todos. System must handle basic todo operations.',
      traffic: {
        type: 'mixed',
        rps: 10,
        readRatio: 0.5,
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
        sizeGB: 6,
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
          shards: 15,
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
  explanation: `Reference Solution for Collaborative Todo App:\n\n📊 Infrastructure Components:\n- **2 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 2000 RPS (peak: 1000 RPS with 20% headroom for traffic spikes).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **6GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~540 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 15 shards (sharded by id).\n  • Read Capacity: 600 RPS across 4 database instance(s)\n  • Write Capacity: 400 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 15 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!`
      },
    },
  ],
};
