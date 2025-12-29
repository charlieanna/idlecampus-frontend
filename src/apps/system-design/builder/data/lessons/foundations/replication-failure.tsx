import type { SystemDesignLesson } from '../../../types/lesson';

export const replicationFailureLesson: SystemDesignLesson = {
  id: 'sd-foundations-replication-failure',
  slug: 'replication-modes-failover-conflicts',
  title: 'Replication Modes — Failover, Conflicts, and User Impact',
  description:
    'Single-leader, multi-leader, and leaderless replication: how they behave under partitions and failures, and how to handle conflicts and failover without surprising users.',
  difficulty: 'intermediate',
  estimatedMinutes: 45,
  category: 'components',
  tags: ['replication', 'consistency', 'failover', 'conflict-resolution', 'read replicas'],
  moduleId: 'sd-module-7-failure-playbooks',
  sequenceOrder: 3,
  learningObjectives: [
    'Compare consistency, availability, and latency trade-offs across replication modes',
    'Design safe failover and recovery procedures',
    'Handle conflicts with deterministic resolution strategies',
  ],
  stages: [
    {
      id: 'overview',
      type: 'concept',
      title: 'Replication Modes & Trade-offs',
      content: {
        markdown: `
### Modes
- Single-leader: clear write path, simpler semantics, failover complexity
- Multi-leader: better multi-region write latency, but conflicts
- Leaderless (e.g., quorum): tunable consistency with read/write quorums

### User impact
- Stale reads after failover
- Conflicting writes resolved unexpectedly
- Higher write latency for cross-region sync
        `,
      },
    },
    {
      id: 'failure-modes',
      type: 'concept',
      title: 'Failure Modes',
      content: {
        markdown: `
### What goes wrong
- Leader crash / AZ loss / Region loss
- Network partition: split-brain risk (multi-leader)
- Catch-up lag on replicas causes stale reads
- Conflict storms under high write skew
        `,
      },
    },
    {
      id: 'playbook',
      type: 'concept',
      title: 'Failure Playbook',
      content: {
        markdown: `
### Detection
- Health checks for leader, replication lag metrics, quorum health
- SLOs on staleness and conflict rates

### Mitigation
- Automated, gated failover: require quorum + fencing tokens
- Read-from-replica with max-staleness bounds; fallback to consistent reads when needed
- Conflict resolution policies: **LWW**, version vectors, CRDTs for commutative ops
- Write routing: pin hot users/tenants to a home region

### Recovery
- Fast rejoin: snapshot + change streams to catch up
- Post-incident reconciliation (read-repair, background merge)
- Communicate user-visible effects (e.g., comments may re-order)
        `,
      },
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Quick check',
      questions: [
        {
          id: 'q1',
          question: 'A multi-leader system under partition risks:',
          type: 'multiple_choice',
          options: ['Leader crash', 'Split-brain conflicts', 'Higher read latency', 'TLS errors'],
          correctAnswer: 'Split-brain conflicts',
          explanation: 'Independent leaders accept writes, causing conflicts upon heal.',
        },
        {
          id: 'q2',
          question: 'To prevent stale reads exceeding SLA you should:',
          type: 'multiple_choice',
          options: ['Disable replication', 'Bound staleness or read from leader', 'Only use caches', 'Always async replicate'],
          correctAnswer: 'Bound staleness or read from leader',
          explanation: 'Use max-staleness bounds or leader reads for critical paths.',
        },
      ],
      passingScore: 60,
      allowRetry: true,
    },
  ],
};


