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
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 1 } },
          { type: 'postgresql', config: { readCapacity: 100, writeCapacity: 100 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `Minimal viable system - app server handles CRUD operations, PostgreSQL stores todos.`,
      },
    },
    {
      name: 'App Server Restart - Data Loss',
      type: 'functional',
      requirement: 'FR-1b',
      description: 'App server restarts at second 5. With only in-memory storage, all todos are lost!',
      traffic: {
        type: 'mixed',
        rps: 10,
        readRatio: 0.5,
      },
      duration: 10,
      failureInjection: {
        type: 'server_restart',
        atSecond: 5,
      },
      passCriteria: {
        maxErrorRate: 0, // After restart, should work but data is gone
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'app_server', config: { instances: 1 } },
          { type: 'postgresql', config: { readCapacity: 100, writeCapacity: 100 } },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `This test demonstrates why persistence is critical:

**With only in-memory storage (no database):**
- App server restart = ALL DATA LOST ❌
- Todos created before restart disappear
- Users lose all their work!

**With database connected:**
- App server restart = data persists ✅
- Todos remain after restart
- Users' work is safe

**Key insight:**
In-memory storage (context['todos']) is VOLATILE - gone when process dies.
Database provides PERSISTENCE - data survives restarts, crashes, deployments.`,
      },
    },
    {
      name: 'Concurrent Users',
      type: 'functional',
      requirement: 'FR-2',
      description: 'Multiple users can work on their todos simultaneously without conflicts.',
      traffic: {
        type: 'mixed',
        rps: 50,
        readRatio: 0.6,
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
    },
    {
      name: 'Data Consistency',
      type: 'functional',
      requirement: 'FR-3',
      description: 'System maintains data consistency across concurrent writes (no lost updates).',
      traffic: {
        type: 'mixed',
        rps: 100,
        readRatio: 0.4, // Heavy writes to test consistency
      },
      duration: 10,
      passCriteria: {
        maxErrorRate: 0,
      },
    },

    // ========== PERFORMANCE REQUIREMENTS (NFR-P) ==========
    {
      name: 'Normal Load',
      type: 'performance',
      requirement: 'NFR-P1',
      description: 'System handles typical daily traffic (500 RPS with 60% reads) with low latency and stays within budget.',
      traffic: {
        type: 'mixed',
        rps: 500,
        readRatio: 0.6, // 300 reads, 200 writes
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 200,
        maxErrorRate: 0.01,
        maxMonthlyCost: 800,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 400, replication: true } },
          { type: 'redis', config: { maxMemoryMB: 512 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `This solution handles 500 RPS efficiently with mixed read/write workload:

**Architecture:**
- Load balancer distributes traffic across 2 app servers
- Redis caches frequently accessed todos (60% reads benefit)
- PostgreSQL with replication for high availability
- Write capacity: 400 ops/sec for 200 WPS

**Why it works:**
- Redis cache reduces DB read load (~80% hit ratio)
- 2 app servers handle ~250 RPS each
- DB write capacity handles 200 WPS with headroom
- Replication provides failover capability
- Cost ~$750/month (within $800 budget)

**Key settings:**
- App Servers: 2 instances for redundancy
- PostgreSQL: writeCapacity=400, readCapacity=500, replication=true
- Redis: 512MB cache for active todos`,
      },
    },
    {
      name: 'Peak Hour Load',
      type: 'performance',
      requirement: 'NFR-P2',
      description: 'During peak work hours (morning standup), traffic increases to 800 RPS. System must maintain acceptable latency.',
      traffic: {
        type: 'mixed',
        rps: 800,
        readRatio: 0.6,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 250,
        maxErrorRate: 0.02,
        maxMonthlyCost: 1000,
      },
    },

    // ========== SCALABILITY REQUIREMENTS (NFR-S) ==========
    {
      name: 'Hot User (power user creating lots of todos)',
      type: 'scalability',
      requirement: 'NFR-S1',
      description: 'A power user creates many todos (project planning), increasing write load by 20%. System must handle the spike.',
      traffic: {
        type: 'mixed',
        rps: 600, // 500 normal + 100 from power user
        readRatio: 0.6,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 250, // Slight degradation OK
        maxErrorRate: 0.02,
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'postgresql', config: { readCapacity: 600, writeCapacity: 500, replication: true } },
          { type: 'redis', config: { maxMemoryMB: 512 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `This solution handles power user spikes:

**Challenge:**
- 20% increase in write load (200 → 240 WPS)
- Database write capacity is the bottleneck
- Can't cache writes effectively

**Solution:**
- Provision writeCapacity=500 (25% buffer above normal 200 WPS)
- This handles 240 WPS spike + headroom for more spikes
- Redis still helps with reads (reduces DB pressure)

**Why it works:**
- 500 write capacity handles 240 WPS comfortably
- 2 app servers distribute load
- Cache reduces read pressure, freeing DB for writes

**Key Insight:**
Write-heavy workloads need database capacity planning with buffer!`,
      },
    },
    {
      name: 'Team Collaboration Spike',
      type: 'scalability',
      requirement: 'NFR-S2',
      description: 'Multiple teams start using the app simultaneously (new company adoption). Traffic increases to 1000 RPS.',
      traffic: {
        type: 'mixed',
        rps: 1000,
        readRatio: 0.6,
      },
      duration: 60,
      passCriteria: {
        maxP99Latency: 300,
        maxErrorRate: 0.03,
      },
    },

    // ========== RELIABILITY REQUIREMENTS (NFR-R) ==========
    {
      name: 'Database Failure',
      type: 'reliability',
      requirement: 'NFR-R1',
      description: 'Primary database crashes at second 30. System must failover to replica and maintain high availability.',
      traffic: {
        type: 'mixed',
        rps: 500,
        readRatio: 0.6,
      },
      duration: 120, // 2 minutes
      failureInjection: {
        type: 'db_crash',
        atSecond: 30,
        recoverySecond: 90, // 60 seconds of downtime without replication
      },
      passCriteria: {
        minAvailability: 0.95, // 95% availability = max 6s downtime in 120s
        maxErrorRate: 0.1, // Some errors during failover OK
      },
      solution: {
        components: [
          { type: 'client', config: {} },
          { type: 'load_balancer', config: {} },
          { type: 'app_server', config: { instances: 2 } },
          { type: 'postgresql', config: { readCapacity: 500, writeCapacity: 400, replication: true } },
          { type: 'redis', config: { maxMemoryMB: 512 } },
        ],
        connections: [
          { from: 'client', to: 'load_balancer' },
          { from: 'load_balancer', to: 'app_server' },
          { from: 'app_server', to: 'redis' },
          { from: 'app_server', to: 'postgresql' },
        ],
        explanation: `This solution achieves 99.9% availability during database failure:

**Without replication:**
- Database crash = complete outage
- 60 seconds downtime = 50% availability ❌
- All user requests fail

**With replication:**
- Automatic failover to standby replica
- <10 seconds downtime = 95%+ availability ✅
- System stays up during primary failure

**For a collaborative app used by teams:**
- 99.9% availability is CRITICAL!
- Database is single point of failure
- Replication is non-negotiable

**Key setting:**
PostgreSQL: replication=true enables automatic failover`,
      },
    },
    {
      name: 'App Server Failure',
      type: 'reliability',
      requirement: 'NFR-R2',
      description: 'One app server crashes at second 20. Load balancer must route traffic to healthy servers.',
      traffic: {
        type: 'mixed',
        rps: 500,
        readRatio: 0.6,
      },
      duration: 60,
      failureInjection: {
        type: 'server_crash',
        atSecond: 20,
      },
      passCriteria: {
        maxP99Latency: 300,
        maxErrorRate: 0.05,
        minAvailability: 0.98,
      },
    },
    {
      name: 'Cache Failure',
      type: 'reliability',
      requirement: 'NFR-R3',
      description: 'Redis cache fails at second 15. System must continue operating with degraded performance.',
      traffic: {
        type: 'mixed',
        rps: 500,
        readRatio: 0.6,
      },
      duration: 60,
      failureInjection: {
        type: 'cache_flush',
        atSecond: 15,
      },
      passCriteria: {
        maxP99Latency: 400, // Higher latency acceptable
        maxErrorRate: 0.05,
        minAvailability: 0.95,
      },
    },
  ],

  learningObjectives: [
    'Design for high availability (99.9%+)',
    'Understand database replication and failover',
    'Handle mixed read/write workloads',
    'Plan for failure scenarios (chaos engineering)',
    'Balance consistency vs availability (CAP theorem)',
  ],

  hints: [
    {
      trigger: 'test_failed:App Server Restart - Data Loss',
      message: `💡 Your todos disappeared after app server restart!

**What happened:**
- You're using in-memory storage (context['todos'] or context.db)
- When app server restarts, memory is cleared
- ALL data is lost - todos, users, everything!

**Solutions:**
1. **Quick fix:** Add a Database component and connect it to app_server
2. **Better:** Use both Database (for persistence) and Cache (for performance)
3. **Best:** Database + Cache + Replication for high availability

**Remember:** In-memory storage is great for learning, terrible for production!

Try again with a Database component connected.`,
    },
    {
      trigger: 'test_failed:Database Failure',
      message: `💡 Your system failed during database failure!

Without replication:
- Database crash = complete outage
- 60 seconds downtime = 50% availability ❌
- All user requests fail

With replication:
- Automatic failover to standby replica
- <10 seconds downtime = 95%+ availability ✅
- System stays up during primary failure

For a collaborative app used by teams, 99.9% availability is CRITICAL!

Hint: Enable "replication" in PostgreSQL config`,
    },
    {
      trigger: 'test_failed:Normal Load',
      message: `💡 Your database is saturated under normal load.

This is a mixed workload (60% reads, 40% writes):
- Writes are ~10x more expensive than reads (50ms vs 5ms)
- Write capacity is the bottleneck

Solutions:
1. Increase writeCapacity (at least 400 ops/sec for 200 WPS)
2. Add read replicas (helps with reads, not writes)
3. Add session cache (Redis) to reduce read pressure

Remember: Writes don't benefit from caching as much as reads!`,
    },
    {
      trigger: 'test_failed:Hot User',
      message: `💡 Power user is overwhelming your database.

When one user creates tons of todos:
- Write load increases 20% (200 → 240 WPS)
- Database write capacity gets saturated

This is common with collaborative tools (Slack, Notion, etc.)

Solutions:
1. Provision write capacity with headroom (20-30% buffer)
2. Use caching for reads to free up DB resources
3. Consider rate limiting for power users

Hint: writeCapacity should be at least 400-500 to handle spikes`,
    },
  ],

  // Code challenges for hands-on implementation practice
  codeChallenges: todoAppCodeChallenges,

  // Python template for app server implementation
  pythonTemplate: `# Collaborative Todo App Server
# Implement CRUD operations with caching

def create_todo(user_id: str, title: str, context: dict) -> dict:
    """
    Create a new todo item for a user.

    Args:
        user_id: User identifier
        title: Todo title/description
        context: Shared context with db and cache access

    Returns:
        {
            'id': 'todo_123',
            'user_id': 'user_1',
            'title': 'Buy groceries',
            'completed': False,
            'created_at': 1234567890
        }

    Requirements:
    - Generate unique todo ID
    - Store in database (context['db'])
    - Invalidate user's todo cache
    - Return the created todo
    """
    # Your code here

    return {}


def get_todos(user_id: str, context: dict) -> list:
    """
    Get all todos for a user with caching.

    Args:
        user_id: User identifier
        context: Shared context with db and cache access

    Returns:
        List of todo dictionaries

    Requirements:
    - Check cache first (context['cache'])
    - If cache miss, fetch from database
    - Cache the result for future requests
    - Return list of todos
    """
    # Your code here

    return []


def update_todo(todo_id: str, completed: bool, context: dict) -> dict:
    """
    Update a todo's completion status.

    Args:
        todo_id: Todo identifier
        completed: New completion status
        context: Shared context with db and cache access

    Returns:
        Updated todo dictionary or None if not found

    Requirements:
    - Update in database
    - Invalidate cache for the todo's user
    - Return updated todo
    """
    # Your code here

    return {}


def delete_todo(todo_id: str, context: dict) -> bool:
    """
    Delete a todo item.

    Args:
        todo_id: Todo identifier
        context: Shared context with db and cache access

    Returns:
        True if deleted, False if not found

    Requirements:
    - Delete from database
    - Invalidate cache for the todo's user
    - Return success status
    """
    # Your code here

    return False


# App Server Handler
def handle_request(request: dict, context: dict) -> dict:
    """
    Handle incoming HTTP requests for the todo app.

    Args:
        request: {
            'method': 'GET' | 'POST' | 'PUT' | 'DELETE',
            'path': '/todos' | '/todos/:id',
            'body': {...},
            'user_id': 'user_1'
        }
        context: Shared context (db, cache)

    Returns:
        {
            'status': 200 | 404 | 500,
            'body': {...}
        }
    """
    method = request.get('method', 'GET')
    path = request.get('path', '')
    user_id = request.get('user_id', '')
    body = request.get('body', {})

    # GET /todos - List all todos for user
    if method == 'GET' and path == '/todos':
        todos = get_todos(user_id, context)
        return {'status': 200, 'body': {'todos': todos}}

    # POST /todos - Create new todo
    elif method == 'POST' and path == '/todos':
        title = body.get('title', '')
        todo = create_todo(user_id, title, context)
        return {'status': 201, 'body': todo}

    # PUT /todos/:id - Update todo
    elif method == 'PUT' and path.startswith('/todos/'):
        todo_id = path.split('/')[-1]
        completed = body.get('completed', False)
        todo = update_todo(todo_id, completed, context)
        if todo:
            return {'status': 200, 'body': todo}
        return {'status': 404, 'body': {'error': 'Todo not found'}}

    # DELETE /todos/:id - Delete todo
    elif method == 'DELETE' and path.startswith('/todos/'):
        todo_id = path.split('/')[-1]
        success = delete_todo(todo_id, context)
        if success:
            return {'status': 204, 'body': {}}
        return {'status': 404, 'body': {'error': 'Todo not found'}}

    return {'status': 404, 'body': {'error': 'Not found'}}
`,
};
