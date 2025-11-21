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
    traffic: '2000 RPS (write-heavy)',
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

  learningObjectives: [
    'Understand CRUD operations',
    'Learn database replication for availability',
    'Master write-heavy patterns',
    'Practice data consistency',
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
  "explanation": "Reference Solution for Collaborative Todo App:\n\n\ud83d\udcca Infrastructure Components:\n- **1 App Server Instance(s)**: Each instance handles ~1000 RPS. Total capacity: 1000 RPS (peak: 500 RPS with 20% headroom for traffic spikes).\n- **Direct Connection**: Single app server, no load balancer needed for current traffic.\n- **5GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~5 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: single leader configuration with 1 read replica.\n  \u2022 Read Capacity: 5 RPS across 2 database instance(s)\n  \u2022 Write Capacity: 5 RPS to primary leader\n  \u2022 Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n\ud83d\udca1 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Single-leader chosen for strong consistency. All writes go to primary, reads can use replicas with eventual consistency (DDIA Ch. 5).\n- **Vertical Scaling**: Single database shard sufficient for current load. Can add sharding later if write throughput exceeds single-node capacity.\n\n\u26a0\ufe0f Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n\u2705 Has all required components (from functionalRequirements.mustHave)\n\u2705 Has all required connections (from functionalRequirements.mustConnect)\n\u2705 Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
