/**
 * Lesson: Leader-Follower Replication
 * DDIA Chapter 5 - The most common replication strategy
 *
 * Teaches: Single leader replication, async vs sync, failover, replication lag
 */

import { Lesson, LessonStep } from '../types/lesson';
import { SystemGraph } from '../types/graph';

// Initial system: Single PostgreSQL database
const singleDbGraph: SystemGraph = {
  components: [
    {
      id: 'client',
      type: 'client',
      config: {},
    },
    {
      id: 'lb',
      type: 'load_balancer',
      config: { algorithm: 'round-robin' },
    },
    {
      id: 'app-1',
      type: 'app_server',
      config: { instances: 2, instanceType: 'm5.large' },
    },
    {
      id: 'db-master',
      type: 'database',
      config: {
        dataModel: 'relational',
        instanceType: 'db.m5.large',
        replicas: 1,
        replicationStrategy: 'single-leader',
      },
    },
  ],
  connections: [
    { from: 'client', to: 'lb', type: 'http' },
    { from: 'lb', to: 'app-1', type: 'http' },
    { from: 'app-1', to: 'db-master', type: 'tcp' },
  ],
};

// System with read replicas added
const withReplicasGraph: SystemGraph = {
  components: [
    {
      id: 'client',
      type: 'client',
      config: {},
    },
    {
      id: 'lb',
      type: 'load_balancer',
      config: { algorithm: 'round-robin' },
    },
    {
      id: 'app-1',
      type: 'app_server',
      config: { instances: 2, instanceType: 'm5.large' },
    },
    {
      id: 'db-master',
      type: 'database',
      config: {
        dataModel: 'relational',
        instanceType: 'db.m5.large',
        replicas: 3,
        replicationStrategy: 'single-leader',
      },
    },
  ],
  connections: [
    { from: 'client', to: 'lb', type: 'http' },
    { from: 'lb', to: 'app-1', type: 'http' },
    { from: 'app-1', to: 'db-master', type: 'tcp' },
  ],
};

const lessonSteps: LessonStep[] = [
  // Step 1: Introduction
  {
    id: 'intro',
    type: 'theory',
    title: 'What is Replication?',
    theoryContent: {
      explanation: `
# Replication: Keeping Copies of Data

**Replication** means keeping a copy of the same data on multiple machines connected via a network.

## Why Replicate?

1. **High Availability** - Keep system running even if some machines fail
2. **Reduce Latency** - Keep data geographically close to users
3. **Increase Read Throughput** - Scale out the number of machines that can serve read queries

## The Challenge

If the data doesn't change over time, replication is easy: just copy it once.
**The difficulty lies in handling changes to replicated data.**

This is where replication strategies come in, each with different trade-offs.
      `,
      keyPoints: [
        'Replication = copies of same data on multiple machines',
        'Benefits: availability, latency, read throughput',
        'Challenge: handling changes across all copies',
        'Every strategy has trade-offs (consistency vs availability vs performance)',
      ],
      ddiaReference: {
        chapter: 5,
        title: 'Replication',
        section: 'Leaders and Followers',
        pageRange: '151-167',
        keyQuote:
          'The major difference between a thing that might go wrong and a thing that cannot possibly go wrong is that when a thing that cannot possibly go wrong goes wrong it usually turns out to be impossible to get at or repair.',
      },
    },
  },

  // Step 2: Show single DB under load
  {
    id: 'single-db-demo',
    type: 'demo',
    title: 'Starting Point: Single Database',
    demoContent: {
      description: `
Let's start with a simple system: one PostgreSQL database handling all reads and writes.

This is fine for low traffic, but what happens when traffic increases?
      `,
      initialGraph: singleDbGraph,
      highlightComponents: ['db-master'],
    },
  },

  // Step 3: Simulate traffic increase
  {
    id: 'simulate-saturation',
    type: 'simulate',
    title: 'The Problem: Database Saturation',
    simulateContent: {
      description: 'Watch what happens as we increase read traffic to your single database:',
      steps: [
        {
          description: 'Normal load: 1,000 RPS (80% reads, 20% writes)',
          traffic: { totalRps: 1000, readRatio: 0.8 },
          expectedOutcome: {
            type: 'success',
            metric: 'P99 = 50ms, DB utilization = 40%',
            explanation: 'System handles load comfortably',
          },
        },
        {
          description: 'Growing traffic: 3,000 RPS',
          traffic: { totalRps: 3000, readRatio: 0.8 },
          expectedOutcome: {
            type: 'degraded',
            metric: 'P99 = 150ms, DB utilization = 85%',
            explanation: 'Database starting to struggle, latency increasing',
          },
        },
        {
          description: 'Peak traffic: 5,000 RPS',
          traffic: { totalRps: 5000, readRatio: 0.8 },
          expectedOutcome: {
            type: 'failure',
            metric: 'P99 = 500ms+, DB utilization = 98%',
            explanation: 'Database saturated! Latency spikes, timeouts occurring',
          },
        },
      ],
      showMetrics: ['p99Latency', 'dbUtilization', 'errorRate'],
    },
  },

  // Step 4: Theory - Leader-Follower
  {
    id: 'leader-follower-theory',
    type: 'theory',
    title: 'Solution: Leader-Follower Replication',
    theoryContent: {
      explanation: `
# Leader-Follower (Master-Slave) Replication

The most common replication strategy. Here's how it works:

## Roles

1. **Leader (Master)** - One replica is designated the leader
   - All writes MUST go through the leader
   - Leader sends data changes to followers

2. **Followers (Slaves/Read Replicas)** - Other replicas
   - Apply writes in same order as leader
   - Serve read queries
   - Cannot accept writes directly

## Write Flow
\`\`\`
Client → Leader (writes) → Followers (replicate)
\`\`\`

## Read Flow
\`\`\`
Client → Any Replica (reads from leader OR followers)
\`\`\`

This allows you to **scale read throughput** by adding more followers!
      `,
      keyPoints: [
        'One leader handles ALL writes',
        'Multiple followers replicate from leader',
        'Followers can serve read queries',
        'Add more followers = more read capacity',
        'Leader is single point of failure for writes',
      ],
      ddiaReference: {
        chapter: 5,
        title: 'Leaders and Followers',
        section: 'Leader-based Replication',
        pageRange: '152-155',
      },
    },
  },

  // Step 5: Add replicas and see improvement
  {
    id: 'add-replicas',
    type: 'simulate',
    title: 'Adding Read Replicas',
    simulateContent: {
      description:
        "Now let's add 2 read replicas to distribute the read load. Same traffic, different result:",
      steps: [
        {
          description: 'Same peak traffic: 5,000 RPS with 3 replicas total',
          traffic: { totalRps: 5000, readRatio: 0.8 },
          expectedOutcome: {
            type: 'success',
            metric: 'P99 = 60ms, each replica at ~33% utilization',
            explanation:
              'Reads distributed across 3 replicas! Each only handles ~1,333 read RPS instead of 4,000',
          },
        },
        {
          description: 'Push further: 10,000 RPS',
          traffic: { totalRps: 10000, readRatio: 0.8 },
          expectedOutcome: {
            type: 'success',
            metric: 'P99 = 80ms, replicas at ~67% utilization',
            explanation: 'Still handling it! This is 2x the previous peak',
          },
        },
      ],
      showMetrics: ['p99Latency', 'dbUtilization', 'replicaDistribution'],
    },
  },

  // Step 6: THE BREAK - Replication Lag
  {
    id: 'break-replication-lag',
    type: 'break',
    title: 'The Trade-off: Replication Lag',
    breakContent: {
      description: `
Everything looks great! But watch what happens with this scenario:

1. User updates their profile name to "Alice"
2. The write goes to the leader
3. User immediately views their profile (read goes to a replica)
4. What name do they see?
      `,
      scenario: {
        id: 'replication-lag',
        name: 'Replication Lag',
        description: 'Read returns stale data because replica has not received the latest write',
        type: 'replication_lag',
        visualization: {
          highlightComponent: 'db-replica-1',
          errorMessage: 'User sees old name "Bob" instead of "Alice"!',
          metricAffected: 'Data Consistency',
          severity: 'warning',
        },
        lesson:
          'This is REPLICATION LAG - the time it takes for writes to propagate from leader to followers. With asynchronous replication, followers may be seconds behind!',
      },
      questionToUser: 'Why did the user see their old name?',
      correctAnswer:
        'The read went to a follower that had not yet received the write from the leader. This is called "replication lag" - an inherent trade-off of asynchronous leader-follower replication.',
    },
  },

  // Step 7: Decision - Sync vs Async
  {
    id: 'decision-sync-async',
    type: 'decision',
    title: 'Your Decision: Synchronous vs Asynchronous Replication',
    decisionContent: {
      question: 'How should writes be replicated to followers?',
      context: `
You've discovered replication lag causes stale reads. You have options:

**Synchronous**: Leader waits for follower(s) to confirm write before acknowledging to client
**Asynchronous**: Leader acknowledges immediately, followers catch up eventually

Your system is a social media platform where users post updates and view feeds.
      `,
      options: [
        {
          id: 'sync-all',
          title: 'Fully Synchronous',
          description: 'Leader waits for ALL followers to confirm every write',
          graphChanges: {
            updateConfigs: {
              'db-master': { replicationMode: 'synchronous-all' },
            },
          },
          expectedMetrics: {
            p99Latency: '200-500ms writes',
            consistency: 'Strong (no stale reads)',
            availability: 'Low (one replica down = all writes blocked)',
          },
          goodFor: ['Banking transactions', 'Inventory management'],
          badFor: ['Social media', 'High write throughput systems'],
          ddiaConceptTag: 'synchronous_replication',
        },
        {
          id: 'async-all',
          title: 'Fully Asynchronous',
          description: 'Leader never waits for followers, they replicate in background',
          graphChanges: {
            updateConfigs: {
              'db-master': { replicationMode: 'asynchronous' },
            },
          },
          expectedMetrics: {
            p99Latency: '20-50ms writes',
            consistency: 'Eventual (stale reads possible)',
            availability: 'High (writes succeed even if replicas down)',
          },
          goodFor: ['Social media feeds', 'Analytics', 'High throughput'],
          badFor: ['Financial transactions', 'User profile updates'],
          ddiaConceptTag: 'asynchronous_replication',
        },
        {
          id: 'semi-sync',
          title: 'Semi-Synchronous',
          description: 'Leader waits for ONE follower, others are async',
          graphChanges: {
            updateConfigs: {
              'db-master': { replicationMode: 'semi-synchronous' },
            },
          },
          expectedMetrics: {
            p99Latency: '50-100ms writes',
            consistency: 'At least one replica up-to-date',
            availability: 'Medium (can survive some replica failures)',
          },
          goodFor: ['Most production systems', 'Balanced trade-off'],
          badFor: ['Extreme low latency requirements'],
          ddiaConceptTag: 'semi_synchronous_replication',
        },
      ],
      hint: 'For a social media platform, is it critical that users see their post immediately on refresh? Or is a few seconds delay acceptable?',
      explanation: `
Most social media platforms use **asynchronous replication** because:
- Write performance matters more than perfect consistency
- Users can tolerate seeing posts a few seconds late
- High availability is critical (service should never go down)

However, they implement "read-your-writes" consistency by routing a user's reads to the leader for their own data immediately after a write.
      `,
    },
  },

  // Step 8: Failover scenario
  {
    id: 'break-leader-failure',
    type: 'break',
    title: 'Another Trade-off: Leader Failure',
    breakContent: {
      description: `
Your system is running smoothly with leader-follower replication. But suddenly...

**The leader database crashes!**

- All followers are still running
- They have data up to 5 seconds ago (replication lag)
- No one can accept writes

What happens now?
      `,
      scenario: {
        id: 'leader-failure',
        name: 'Leader Failure',
        description: 'Master database crashes, system cannot accept writes',
        type: 'leader_failure',
        visualization: {
          highlightComponent: 'db-master',
          errorMessage: 'Leader down! Write operations failing!',
          metricAffected: 'Write Availability',
          severity: 'critical',
        },
        lesson: `
This is the **FAILOVER** problem. You need:

1. **Detecting failure** - How do you know leader is dead vs just slow?
2. **Choosing new leader** - Which follower becomes leader?
3. **Reconfiguring clients** - Route writes to new leader
4. **Data loss risk** - New leader may not have all writes from old leader

Automatic failover is complex and can go wrong (split-brain, data loss). This is why services like AWS RDS handle it for you.
        `,
      },
      questionToUser: 'What challenges exist when promoting a follower to be the new leader?',
      correctAnswer:
        'Key challenges: (1) Detecting if leader is truly dead vs network issue, (2) Choosing which follower has most up-to-date data, (3) Preventing old leader from returning and causing split-brain, (4) Accepting potential data loss for writes not yet replicated',
    },
  },

  // Step 9: Summary
  {
    id: 'summary',
    type: 'summary',
    title: 'What You Learned',
    summaryContent: {
      conceptLearned: 'Leader-Follower Replication',
      keyTakeaways: [
        'Leader-follower is the most common replication strategy',
        'Scales READ throughput by adding followers (not writes!)',
        'Trade-off: Consistency vs Performance (replication lag)',
        'Trade-off: Availability vs Durability (async vs sync)',
        'Failover is complex - detecting failure, choosing new leader, avoiding split-brain',
        'Most systems use semi-synchronous or async with application-level consistency guarantees',
      ],
      ddiaReferences: [
        {
          chapter: 5,
          title: 'Replication',
          section: 'Leaders and Followers',
          pageRange: '152-167',
        },
        {
          chapter: 5,
          title: 'Replication',
          section: 'Problems with Replication Lag',
          pageRange: '161-167',
        },
        {
          chapter: 5,
          title: 'Replication',
          section: 'Handling Node Outages',
          pageRange: '156-159',
        },
      ],
      nextLesson: 'replication-multi-leader',
    },
  },
];

export const leaderFollowerReplicationLesson: Lesson = {
  id: 'replication-leader-follower',
  title: 'Leader-Follower Replication',
  subtitle: 'The Foundation of Data Replication',
  description:
    'Learn how leader-follower (master-slave) replication works, its trade-offs between consistency and performance, and how to handle failover scenarios.',

  estimatedTime: 35,
  difficulty: 'intermediate',

  ddiaChapter: 5,
  ddiaSection: 'Leaders and Followers',
  ddiaReferences: [
    {
      chapter: 5,
      title: 'Replication',
      section: 'Leaders and Followers',
      pageRange: '151-167',
    },
  ],

  module: 'replication',
  conceptTags: [
    'leader-follower',
    'master-slave',
    'replication-lag',
    'failover',
    'synchronous-replication',
    'asynchronous-replication',
    'read-scaling',
  ],

  prerequisites: [],

  steps: lessonSteps,

  learningObjectives: [
    'Understand how leader-follower replication distributes read load',
    'Recognize replication lag as the cost of asynchronous replication',
    'Choose between synchronous and asynchronous replication based on requirements',
    'Understand the challenges of leader failover',
  ],

  tradeoffsExplored: [
    'Consistency vs Read Performance',
    'Write Latency vs Durability',
    'Availability vs Data Loss Risk',
  ],

  relatedChallenges: ['tinyurl', 'twitter-feed', 'session-store'],
};
