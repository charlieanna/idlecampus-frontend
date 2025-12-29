import type { SystemDesignLesson } from '../../../types/lesson';

export const networkingFailureLesson: SystemDesignLesson = {
  id: 'sd-foundations-networking-failure',
  slug: 'networking-tcp-udp-websockets-failures',
  title: 'Networking Foundations: TCP, UDP, WebSockets — Failures & Resilience',
  description:
    'Understand how TCP, UDP, and WebSockets behave under failure: timeouts, drops, head-of-line blocking, reconnection, and backpressure. Learn pragmatic playbooks to keep user experience smooth.',
  difficulty: 'beginner',
  estimatedMinutes: 40,
  category: 'fundamentals',
  tags: ['tcp', 'udp', 'websocket', 'backpressure', 'timeouts', 'retries', 'quic'],
  moduleId: 'sd-module-7-failure-playbooks',
  sequenceOrder: 1,
  learningObjectives: [
    'Explain TCP vs UDP vs WebSockets trade-offs for reliability and latency',
    'Detect and handle partial failures, timeouts, and connection churn',
    'Implement retry, exponential backoff, jitter, and circuit breakers safely',
  ],
  stages: [
    {
      id: 'overview',
      type: 'concept',
      title: 'Overview: Transport Choices & UX Impact',
      content: {
        markdown: `
### What problem are we solving?
Picking the right transport determines **latency**, **reliability**, and **user experience** during failures.

#### Quick recap
- TCP: reliable ordered stream, head-of-line blocking, congestion control, built for reliability
- UDP: best-effort datagrams, no ordering/ack, great for real-time media with app-level recovery
- WebSockets: bidirectional stream (over TCP), persistent session semantics
- QUIC: UDP-based, stream multiplexing, better loss recovery and mobility
        `,
      },
      keyPoints: [
        'TCP favors reliability; UDP favors timeliness',
        'WebSockets ride on TCP; QUIC fixes TCP HO-L with stream multiplexing',
      ],
    },
    {
      id: 'failure-modes',
      type: 'concept',
      title: 'Common Failure Modes',
      content: {
        markdown: `
### What goes wrong
- Timeouts: slow paths, asymmetric reachability, SYN backlog saturation
- Packet loss & reordering: increases latency (TCP) or frame loss (UDP media)
- Head-of-line blocking (TCP): one lost packet stalls the stream
- NAT rebinding / mobile network changes: connection churn
- Server overload & backpressure: dropped accepts, RSTs, throttling
        `,
      },
      keyPoints: [
        'Expect loss, reordering, duplication',
        'Expect network path to change mid-session',
        'Expect servers to shed load under pressure',
      ],
    },
    {
      id: 'playbook',
      type: 'concept',
      title: 'Failure Playbook',
      content: {
        markdown: `
### Detection
- Client-side timeouts per operation; track TCP connect, TLS, request deadlines
- Heartbeats/pings (WebSockets) with missed-heartbeat thresholds
- Error budgets + SLO alerts on connect error rate, reconnect churn, tail latency

### Mitigation
- Retries with **exponential backoff + jitter**; avoid retry storms
- **Circuit breaker**: open on consecutive failures; half-open probing
- **Load-shed**: return fast-fail or degraded responses when saturated
- For WebSockets: auto-reconnect with **backoff**, resume user session state
- Consider **QUIC** (HTTP/3) for better mobility and HO-L avoidance

### Recovery & UX
- Idempotent operations: include request IDs to avoid duplicates
- Tolerant UI: optimistic updates with reconciliation on reconnect
- Graceful degradation: fewer updates, coalesce events, drop optional features
        `,
      },
      keyPoints: [
        'Exponential backoff + jitter on all retries',
        'Circuit breakers and load shedding protect the system',
        'Design idempotent actions to make retries safe',
      ],
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Check your understanding',
      questions: [
        {
          id: 'q1',
          question: 'Which is the primary cause of head-of-line blocking?',
          type: 'multiple_choice',
          options: ['UDP loss', 'TCP ordered delivery', 'Load balancer hash', 'TLS handshake'],
          correctAnswer: 'TCP ordered delivery',
          explanation: 'TCP delivers in order; a lost packet stalls the stream.',
        },
        {
          id: 'q2',
          question: 'What should always accompany retries?',
          type: 'multiple_choice',
          options: ['More threads', 'Backoff + jitter', 'Larger packets', 'Disabling TLS'],
          correctAnswer: 'Backoff + jitter',
          explanation: 'Backoff with jitter prevents synchronized retry storms.',
        },
      ],
      passingScore: 60,
      allowRetry: true,
    },
  ],
};


