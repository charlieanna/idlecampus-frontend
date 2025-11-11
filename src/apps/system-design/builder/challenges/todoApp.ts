import { Challenge } from '../types/testCase';

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
    'postgresql',
    'redis',
  ],

  testCases: [
    {
      name: 'Normal Load',
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
    },
    {
      name: 'Database Failure',
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
    },
    {
      name: 'Hot User (power user creating lots of todos)',
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
};
