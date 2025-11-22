/**
 * Generated Tiered Challenge: Stack Overflow - Q&A Platform
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
import { CodeChallenge } from '../../types/challengeTiers';

const codeChallenges: CodeChallenge[] = [];

export const stackoverflowChallenge: Challenge = {
  id: 'stackoverflow',
  title: 'Stack Overflow - Q&A Platform',
  difficulty: 'beginner',
  description: `Design a Q&A platform like Stack Overflow that:
- Users can ask and answer questions
- Questions and answers can be upvoted/downvoted
- Users earn reputation points
- Questions have tags for categorization

Learning Objectives (DDIA Ch. 2, 3):
1. Design SQL schema with vote aggregation (DDIA Ch. 2)
2. Create secondary indexes for sorting by score/views (DDIA Ch. 3)
3. Implement composite indexes for tag queries (DDIA Ch. 3)
4. Denormalize vote counts for performance (DDIA Ch. 2)
5. Use full-text search indexes (DDIA Ch. 3)`,
  
  requirements: {
  functional: [
    "Users can ask and answer questions",
    "Questions and answers can be upvoted/downvoted",
    "Users earn reputation points",
    "Questions have tags for categorization"
  ],
  traffic: "10 RPS (50% reads, 50% writes)",
  latency: "p99 < 5s",
  availability: "Best effort availability",
  budget: "Optimize for cost efficiency",
  nfrs: [
    "Vote count update: < 50ms (DDIA Ch. 2: Denormalized score column)",
    "Tag page query: < 100ms (DDIA Ch. 3: Composite index on tag_id + score)",
    "Search latency: < 300ms (DDIA Ch. 3: Full-text search index)",
    "Hot questions: < 100ms (DDIA Ch. 3: Secondary index on score)"
  ]
},
  
  availableComponents: [
  "client",
  "load_balancer",
  "app_server",
  "database",
  "redis",
  "message_queue",
  "cdn",
  "s3"
],
  
  testCases: [
    {
      "name": "Users can ask and answer questions",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Verify \"Users can ask and answer questions\" works correctly.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Questions and answers can be upvoted/downvoted",
      "type": "functional",
      "requirement": "FR-2",
      "description": "Verify \"Questions and answers can be upvoted/downvoted\" works correctly.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Users earn reputation points",
      "type": "functional",
      "requirement": "FR-3",
      "description": "Verify \"Users earn reputation points\" works correctly.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "Questions have tags for categorization",
      "type": "functional",
      "requirement": "FR-4",
      "description": "Verify \"Questions have tags for categorization\" works correctly.",
      "traffic": {
        "type": "mixed",
        "rps": 10,
        "readRatio": 0.5
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 5000,
        "maxErrorRate": 0
      }
    },
    {
      "name": "NFR-P1: Normal Daily Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "System handles expected daily traffic with target latency. This is the baseline performance\ntest - system must meet latency targets under normal conditions.",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 200,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-P2: Peak Hour Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Traffic increases during peak hours (peak usage hours).\nSystem must maintain acceptable latency with 2x traffic. Slight degradation OK but system must stay up.",
      "traffic": {
        "type": "read",
        "rps": 3000,
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 300,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-S1: Traffic Spike",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Unexpected event causes sudden 50% traffic increase.\nSystem must handle spike gracefully without complete failure.",
      "traffic": {
        "type": "read",
        "rps": 2250,
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 400,
        "maxErrorRate": 0.03
      }
    },
    {
      "name": "NFR-S2: Viral Growth",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Platform goes viral - traffic triples!\nThis tests if architecture can scale horizontally. May require load balancers and multiple servers.",
      "traffic": {
        "type": "read",
        "rps": 4500,
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 500,
        "maxErrorRate": 0.05
      }
    },
    {
      "name": "NFR-P5: Read Latency Under Write Pressure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Heavy write traffic (bursts of 20% of total RPS) causes read latency degradation in monolithic architecture.\n**Why this test matters**: Monolithic app servers process reads and writes in same thread pool. Heavy writes block read threads, causing read latency spikes.\n**How CQRS solves it**: Separate Read API and Write API with independent thread pools. Writes don't block reads.\n**Pass criteria**: With CQRS (separate read/write services), read latency stays < 200ms even during write bursts. Without CQRS: read latency spikes to 600ms+.",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 200,
        "maxErrorRate": 0.01
      }
    },
    {
      "name": "NFR-S3: Heavy Read Load",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Read traffic of 1425 RPS exceeds single database capacity (~1000 RPS).\n**Why this test matters**: Single database instance has limited read capacity. High read traffic causes latency spikes and potential database overload.\n**How read replicas solve it**: Distribute read traffic across multiple replicas. Each replica handles ~1000 RPS, linearly scaling read capacity.\n**Pass criteria**: With 2 read replica(s), meet latency targets at acceptable cost. Without replicas: latency exceeds 400ms OR cost exceeds budget (vertical scaling is expensive).",
      "traffic": {
        "type": "read",
        "rps": 2250,
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 200,
        "maxErrorRate": 0.02
      }
    },
    {
      "name": "NFR-R1: Database Failure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Primary database crashes at 30s into test. System must failover to replica to maintain\navailability. Without replication: complete outage. With replication: < 10s downtime.",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxErrorRate": 0.1,
        "minAvailability": 0.95,
        "maxDowntime": 10
      },
      "failureInjection": {
        "type": "db_crash",
        "atSecond": 30,
        "recoverySecond": 90
      }
    },
    {
      "name": "NFR-R2: Cache Failure",
      "type": "functional",
      "requirement": "FR-1",
      "description": "Cache (Redis) fails at 20s. System must continue operating by hitting database directly.\nPerformance degrades but system stays up. Tests graceful degradation.",
      "traffic": {
        "type": "read",
        "rps": 1500,
        "readRatio": 0.95
      },
      "duration": 10,
      "passCriteria": {
        "maxP99Latency": 600,
        "maxErrorRate": 0.05,
        "minAvailability": 0.95
      },
      "failureInjection": {
        "type": "cache_flush",
        "atSecond": 20
      }
    }
  ],
  
  learningObjectives: [
  "Understand client-server architecture",
  "Learn database connectivity and data persistence",
  "Design appropriate data models"
],
  
  referenceLinks: [
  {
    "label": "Stack Overflow Blog",
    "url": "https://stackoverflow.blog/engineering/"
  },
  {
    "label": "Official Site",
    "url": "https://stackoverflow.com/"
  },
  {
    "label": "Stack Overflow Architecture",
    "url": "https://stackexchange.com/performance"
  }
],
  
  pythonTemplate: `from datetime import datetime
from typing import List, Dict

# In-memory storage (naive implementation)
users = {}
questions = {}
answers = {}
votes = {}
tags = {}

def ask_question(question_id: str, user_id: str, title: str, body: str,
                 tag_names: List[str] = None) -> Dict:
    """
    FR-1: Users can ask questions
    Naive implementation - stores question in memory
    """
    questions[question_id] = {
        'id': question_id,
        'user_id': user_id,
        'title': title,
        'body': body,
        'tags': tag_names or [],
        'views': 0,
        'score': 0,
        'created_at': datetime.now()
    }
    return questions[question_id]

def answer_question(answer_id: str, question_id: str, user_id: str,
                    body: str) -> Dict:
    """
    FR-1: Users can answer questions
    Naive implementation - stores answer in memory
    """
    answers[answer_id] = {
        'id': answer_id,
        'question_id': question_id,
        'user_id': user_id,
        'body': body,
        'score': 0,
        'is_accepted': False,
        'created_at': datetime.now()
    }
    return answers[answer_id]

def vote(vote_id: str, target_id: str, target_type: str, user_id: str,
         value: int) -> Dict:
    """
    Helper: Upvote/downvote questions and answers
    Naive implementation - records vote and updates score
    value: 1 for upvote, -1 for downvote
    """
    votes[vote_id] = {
        'id': vote_id,
        'target_id': target_id,
        'target_type': target_type,  # 'question' or 'answer'
        'user_id': user_id,
        'value': value,
        'created_at': datetime.now()
    }

    # Update score
    if target_type == 'question':
        question = questions.get(target_id)
        if question:
            question['score'] += value
    elif target_type == 'answer':
        answer = answers.get(target_id)
        if answer:
            answer['score'] += value

    return votes[vote_id]

def get_question_answers(question_id: str) -> List[Dict]:
    """
    Helper: Get all answers for a question
    Naive implementation - returns answers sorted by score
    """
    question_answers = []
    for answer in answers.values():
        if answer['question_id'] == question_id:
            question_answers.append(answer)

    # Sort by score (highest first), with accepted answer first
    question_answers.sort(key=lambda x: (not x['is_accepted'], -x['score']))
    return question_answers
`,
  
  codeChallenges,
  
  solution: {
  components: [
    {
      type: "client",
      config: {}
    },
    {
      type: "load_balancer",
      config: {
        algorithm: "least_connections"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 9,
        serviceName: "read-api",
        handledAPIs: [
          "GET /api/*"
        ],
        displayName: "Read API",
        subtitle: "9 instance(s)"
      }
    },
    {
      type: "app_server",
      config: {
        instances: 1,
        serviceName: "write-api",
        handledAPIs: [
          "POST /api/*",
          "PUT /api/*",
          "DELETE /api/*",
          "PATCH /api/*"
        ],
        displayName: "Write API",
        subtitle: "1 instance(s)"
      }
    },
    {
      type: "redis",
      config: {
        sizeGB: 17,
        strategy: "cache_aside",
        hitRatio: 0.9,
        replication: "master-slave",
        persistence: "rdb"
      }
    },
    {
      type: "postgresql",
      config: {
        instanceType: "commodity-db",
        replicationMode: "multi-leader",
        replication: {
          enabled: true,
          replicas: 3,
          mode: "async"
        },
        sharding: {
          enabled: true,
          shards: 9,
          shardKey: "user_id"
        },
        displayName: "PostgreSQL Master",
        subtitle: "Writes + 3 replicas (reads)"
      }
    },
    {
      type: "cdn",
      config: {
        enabled: true
      }
    },
    {
      type: "s3",
      config: {}
    },
    {
      type: "message_queue",
      config: {}
    }
  ],
  connections: [
    {
      from: "client",
      to: "load_balancer",
      type: "read_write"
    },
    {
      from: "load_balancer",
      to: "app_server",
      type: "read",
      label: "Read traffic (GET)"
    },
    {
      from: "load_balancer",
      to: "app_server",
      type: "write",
      label: "Write traffic (POST/PUT/DELETE)"
    },
    {
      from: "app_server",
      to: "redis",
      type: "read",
      label: "Read API checks cache"
    },
    {
      from: "app_server",
      to: "postgresql",
      type: "read",
      label: "Read API → Replicas"
    },
    {
      from: "app_server",
      to: "postgresql",
      type: "write",
      label: "Write API → Master"
    },
    {
      from: "redis",
      to: "postgresql",
      type: "read",
      label: "Cache miss → DB lookup"
    },
    {
      from: "client",
      to: "cdn",
      type: "read"
    },
    {
      from: "cdn",
      to: "s3",
      type: "read"
    },
    {
      from: "app_server",
      to: "s3",
      type: "read_write"
    },
    {
      from: "app_server",
      to: "message_queue",
      type: "write"
    }
  ],
  explanation: "Reference Solution for Stack Overflow - Q&A Platform (CQRS):\n\n📊 Infrastructure Components:\n- **Read API**: 6 instances handling 4275 read RPS (GET requests)\n- **Write API**: 1 instance handling 225 write RPS (POST/PUT/DELETE).\n- **Load Balancer**: Distributes traffic using least-connections algorithm. Routes requests to least-busy app server, ideal for long-lived connections (DDIA Ch. 1 - Scalability).\n- **17GB Redis Cache**: In-memory key-value store for hot data. Cache-aside pattern: ~3848 RPS served from cache (~90% hit ratio assumed). Reduces database load and improves p99 latency (SDP - Caching).\n- **PostgreSQL Database**: multi leader configuration with 3 read replicas and 9 shards (sharded by user_id).\n  • Read Capacity: 4275 RPS across 4 database instance(s)\n  • Write Capacity: 225 RPS distributed across leaders\n  • Replication: Asynchronous (eventual consistency, < 1s lag typical)\n- **CDN**: Content delivery network with 150+ global edge locations. Serves static content (images, videos, CSS, JS) from nearest location. Typical latency: < 50ms globally (SDP - CDN).\n- **S3 Object Storage**: Unlimited scalable storage for large files. 99.999999999% durability (eleven nines). Pay-per-use pricing: $0.023/GB/month + transfer costs.\n- **Message Queue**: Asynchronous processing queue for background jobs and event fan-out. Decouples services and provides buffering during traffic spikes (DDIA Ch. 11).\n\n👥 User-Centric Sharding:\n- **Sharded by user_id**: Horizontally partitions data across 9 database shards. Each shard contains data for subset of users (e.g., user_id % 9 = shard_index).\n- **Benefits**: Linear scaling of both read and write capacity. Adding more shards increases total throughput proportionally (DDIA Ch. 6).\n- **Trade-offs**: Cross-shard queries (e.g., \"find all users named John\") become expensive. Design ensures most queries are single-shard (e.g., \"get user's timeline\" only queries that user's shard).\n- **Hot Spots**: Hash-based sharding distributes load evenly across shards. Avoids celebrity user problem where one shard gets disproportionate traffic.\n\n🔄 CQRS (Command Query Responsibility Segregation):\n- **Justification**: Traffic pattern justifies read/write split (Read: 95.0%, Write: 5.0%, Total: 4500 RPS)\n- **Read API (6 instances)**: Handles GET requests. Optimized for low latency with:\n  • Direct connection to cache (check cache first, DB on miss)\n  • Routes to read replicas (not master) to avoid write contention\n  • Can use eventual consistency (stale data acceptable for reads)\n  • Horizontally scalable: Add instances to handle more read traffic\n- **Write API (1 instance)**: Handles POST/PUT/DELETE requests. Optimized for consistency with:\n  • Routes writes to database master (ensures strong consistency)\n  • Invalidates cache entries on writes (maintains cache freshness)\n  • Fewer instances needed (writes are 5.0% of traffic)\n  • Can use database transactions for atomicity\n- **Benefits** (validated by NFR tests):\n  • Reads don't get blocked by writes (see NFR-P5 test)\n  • Independent scaling: Add read instances without affecting writes\n  • Different optimization strategies (read: cache + replicas, write: transactions + master)\n  • Failure isolation: Read API failure doesn't affect writes (and vice versa)\n- **Trade-offs**: Increased complexity (2 services instead of 1), eventual consistency between read/write paths (DDIA Ch. 7 - Transactions)\n\n💡 Key Design Decisions:\n- **Capacity Planning**: Components sized with 20% headroom for traffic spikes without performance degradation.\n- **Caching Strategy**: Cache reduces database load by ~90%. Hot data (frequently accessed) stays in cache, cold data fetched from database on cache miss.\n- **Replication Mode**: Multi-leader chosen for write scalability (> 100 writes/s). Trade-off: Conflict resolution needed for concurrent writes to same record (DDIA Ch. 5).\n- **Horizontal Scaling**: 9 database shards enable linear scaling. Each shard is independent, can be scaled separately. Query routing based on user_id hash (DDIA Ch. 6 - Partitioning).\n\n⚠️ Important Note:\nThis is ONE valid solution that meets the requirements. The traffic simulator validates ANY architecture that:\n✅ Has all required components (from functionalRequirements.mustHave)\n✅ Has all required connections (from functionalRequirements.mustConnect)\n✅ Meets performance targets (latency, cost, error rate)\n\nYour solution may use different components (e.g., MongoDB instead of PostgreSQL, Memcached instead of Redis) and still pass all tests!"
},
};
