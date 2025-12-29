import type { SystemDesignLesson } from '../../../types/lesson';

export const chatFailureLesson: SystemDesignLesson = {
  id: 'sd-foundations-chat-failure',
  slug: 'realtime-chat-resilience',
  title: 'Real-time Chat — Ordering, Presence, Backpressure, Recovery',
  description:
    'Design a resilient chat system with WebSockets: connection churn, presence, message ordering, idempotency, and backpressure handling for stable UX.',
  difficulty: 'intermediate',
  estimatedMinutes: 45,
  category: 'patterns',
  tags: ['chat', 'websocket', 'ordering', 'presence', 'idempotency', 'backpressure'],
  moduleId: 'sd-module-7-failure-playbooks',
  sequenceOrder: 6,
  learningObjectives: [
    'Handle reconnects and session resumption with idempotent messaging',
    'Guarantee at-least-once with deduplication and per-conversation ordering',
    'Implement presence and backpressure without overload',
  ],
  stages: [
    {
      id: 'overview',
      type: 'concept',
      title: 'Architecture Overview',
      content: {
        markdown: `
### Components
- Gateway (WebSockets), message fan-out service, persistence store
- Presence service with heartbeats
- Per-conversation sequence numbers (or lamport/vector clocks)
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
- Mobile churn: frequent disconnects; duplicate sends on retry
- Out-of-order delivery due to parallel fan-out
- Backpressure on hot rooms; gateway overrun
- Presence flaps on unstable networks
        `,
      },
    },
    {
      id: 'playbook',
      type: 'concept',
      title: 'Failure Playbook',
      content: {
        markdown: `
### Message delivery
- **At-least-once** with **message IDs** + dedupe on server
- **Per-conversation sequence**: enforce ordering at consumer
- **Idempotent sends** from client (same message ID on retry)

### Connection management
- Auto-reconnect with backoff; **resume from last acked seq**
- **Flow control**: server pushes credits; client respects limits
- **Backpressure**: drop typing/presence updates first; prioritize messages

### Presence
- Heartbeats with missed-threshold; **grace period** to prevent flap
- Region failover: re-evaluate presence consistency vs latency
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
          question: 'To guarantee at-least-once without duplicates you need:',
          type: 'multiple_choice',
          options: ['TCP only', 'Message IDs + dedupe', 'Longer timeouts', 'Bigger servers'],
          correctAnswer: 'Message IDs + dedupe',
          explanation: 'Deduplication on server side makes retries safe.',
        },
        {
          id: 'q2',
          question: 'To maintain order per conversation:',
          type: 'multiple_choice',
          options: ['Global queue', 'Per-conversation sequence numbers', 'Random partitioning', 'CDN'],
          correctAnswer: 'Per-conversation sequence numbers',
          explanation: 'Per-conversation sequencing prevents interleaving.',
        },
      ],
      passingScore: 60,
      allowRetry: true,
    },
  ],
};


