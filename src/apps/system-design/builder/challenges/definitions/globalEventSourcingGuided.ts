import {
  GuidedTutorial,
  GuidedStep,
  TeachingContent,
  StoryContent,
  CelebrationContent,
  RequirementsGatheringContent,
} from '../../types/guidedTutorial';

/**
 * Global Event Sourcing System Guided Tutorial - FR-FIRST EDITION
 *
 * A story-driven tutorial teaching event sourcing at global scale with
 * cross-region replication, CQRS, and event versioning.
 *
 * Flow:
 * Phase 0: Requirements gathering (event ordering, snapshots, replay)
 * Steps 1-3: Basic event store
 * Steps 4-6: Cross-region replication
 * Steps 7-9: CQRS and read optimization
 * Step 10: Event versioning
 *
 * Key Concepts:
 * - Event Sourcing fundamentals
 * - Event Store architecture
 * - Event ordering and causality
 * - Snapshot optimization
 * - Cross-region event replication
 * - CQRS pattern
 * - Event versioning and schema evolution
 * - Global consistency guarantees
 */

// =============================================================================
// PHASE 0: Requirements Gathering
// =============================================================================

const globalEventSourcingRequirementsPhase: RequirementsGatheringContent = {
  problemStatement: "Design a global event sourcing system for a financial trading platform",

  interviewer: {
    name: 'Dr. Sarah Chen',
    role: 'Chief Architect at GlobalFinance Corp',
    avatar: '👩‍💼',
  },

  questions: [
    // FUNCTIONAL REQUIREMENTS
    {
      id: 'core-event-sourcing',
      category: 'functional',
      question: "What is event sourcing and why do we need it for our trading platform?",
      answer: "Event sourcing means storing all changes as an append-only log of events instead of updating state in place.\n\nFor trading:\n1. **Complete audit trail** - Every trade, order, cancellation stored forever\n2. **Point-in-time reconstruction** - Rebuild account state at any moment in history\n3. **Regulatory compliance** - SEC requires 7-year audit logs\n4. **Temporal queries** - 'What was my portfolio value at 3:47 PM yesterday?'\n5. **Event replay** - Recompute analytics or fix bugs by replaying events",
      importance: 'critical',
      revealsRequirement: 'FR-1, FR-2, FR-3',
      learningPoint: "Event sourcing is the source of truth: events are facts about what happened, state is derived",
    },
    {
      id: 'event-append',
      category: 'functional',
      question: "How should we store events in the system?",
      answer: "Events are stored in an **append-only log** per entity (account, order):\n- Each entity has its own event stream\n- Events are immutable once written\n- Events are ordered by sequence number\n- Never update or delete events (only append)\n- Each event has metadata: timestamp, event_id, version, causality",
      importance: 'critical',
      revealsRequirement: 'FR-1',
      learningPoint: "Append-only logs are the foundation: like a bank ledger, you never erase history",
    },
    {
      id: 'state-reconstruction',
      category: 'functional',
      question: "How do we get the current state of an account if we only store events?",
      answer: "**Replay all events** from the beginning:\n\n1. Start with empty state\n2. Read events in order: OrderPlaced, OrderFilled, BalanceDebited\n3. Apply each event to update state\n4. Final state = current account state\n\nExample: account_id=123\n- Event 1: Deposit $1000 → Balance: $1000\n- Event 2: Buy 10 shares @ $50 → Balance: $500, Shares: 10\n- Event 3: Sell 5 shares @ $60 → Balance: $800, Shares: 5",
      importance: 'critical',
      revealsRequirement: 'FR-2',
      learningPoint: "State is derived by replaying events: current state = f(all events)",
    },
    {
      id: 'event-ordering',
      category: 'clarification',
      question: "How do we ensure events are processed in the correct order?",
      answer: "Use **sequence numbers** within each entity stream:\n- Each event gets monotonically increasing sequence number\n- Sequence 1, 2, 3, ... (no gaps)\n- Reject out-of-order events\n- For cross-entity causality, use **vector clocks** or **causal ordering**",
      importance: 'critical',
      insight: "Ordering is critical: processing events out of order can corrupt state",
    },
    {
      id: 'snapshot-optimization',
      category: 'clarification',
      question: "What if an account has 1 million events? Do we replay all of them?",
      answer: "Use **snapshots** for performance:\n- Periodically save state snapshot (every 1000 events)\n- To rebuild: Load snapshot + replay events since snapshot\n- Example: Load snapshot at event 100,000, replay 900,000-1,000,000\n- Reduces replay from millions to thousands",
      importance: 'critical',
      insight: "Snapshots are optimization, not source of truth: always verify against events",
    },
    {
      id: 'event-replay',
      category: 'functional',
      question: "Why would we need to replay historical events?",
      answer: "Multiple critical use cases:\n1. **Bug fixes** - Bad calculation? Replay with fixed code\n2. **New analytics** - Want new metric? Replay to compute from history\n3. **Regulatory audit** - Prove account balance at specific time\n4. **Disaster recovery** - Rebuild state from event log\n5. **Testing** - Replay production events in staging",
      importance: 'critical',
      revealsRequirement: 'FR-3',
      learningPoint: "Event replay is a superpower: time travel through your system's history",
    },

    // SCALE & NFRs
    {
      id: 'throughput-events',
      category: 'throughput',
      question: "How many events per second must the system handle?",
      answer: "Peak: 500,000 events/second globally during market hours\n- Stock trades: 200K/sec\n- Order updates: 200K/sec\n- Account changes: 100K/sec\n\nThat's 1.8 billion events per trading hour",
      importance: 'critical',
      calculation: {
        formula: "500K events/sec × 3600 sec × 6.5 hours = 11.7B events/day",
        result: "~11.7 billion events per trading day",
      },
      learningPoint: "High write throughput requires horizontal sharding of event streams",
    },
    {
      id: 'latency-write',
      category: 'latency',
      question: "How fast must events be written and acknowledged?",
      answer: "Write latency p99 < 10ms. Trading decisions depend on immediate confirmation:\n- Order placed → confirmed in < 10ms\n- Balance updated → confirmed in < 10ms\n- Slow writes = delayed trades = lost money",
      importance: 'critical',
      learningPoint: "Low-latency writes require in-memory buffers and batching",
    },
    {
      id: 'latency-read',
      category: 'latency',
      question: "How fast must we reconstruct current state from events?",
      answer: "Read latency p99 < 100ms:\n- Load snapshot: 10ms\n- Replay 1000 events: 50ms\n- Return state: 100ms total\n\nUsers need instant portfolio views",
      importance: 'critical',
      learningPoint: "Fast reads require snapshots + CQRS materialized views",
    },
    {
      id: 'global-replication',
      category: 'availability',
      question: "We have offices in New York, London, and Tokyo. How do we keep events in sync?",
      answer: "**Cross-region event replication**:\n- Each region has local event store\n- Events written locally (low latency)\n- Async replication to other regions (< 100ms)\n- Eventual consistency across regions\n- Conflict resolution for concurrent writes",
      importance: 'critical',
      learningPoint: "Global event sourcing requires multi-master replication with conflict resolution",
    },
    {
      id: 'consistency-guarantees',
      category: 'consistency',
      question: "What consistency guarantees do we need for events?",
      answer: "Within a region:\n- **Strong consistency** - Events ordered strictly\n- Read-after-write consistency\n\nAcross regions:\n- **Eventual consistency** - Events propagate within 100ms\n- **Causal consistency** - Causally related events maintain order\n- **Conflict-free** - Use CRDTs or last-write-wins with timestamps",
      importance: 'critical',
      learningPoint: "Event sourcing at global scale requires careful consistency trade-offs",
    },
    {
      id: 'retention-compliance',
      category: 'reliability',
      question: "How long must we retain events?",
      answer: "Financial regulations require:\n- **7 years minimum** for all trading events\n- **Indefinite** for some compliance events\n- Hot storage (SSD): 90 days for fast access\n- Cold storage (S3): 7+ years for compliance\n- Never delete events, only archive to cheaper storage",
      importance: 'critical',
      learningPoint: "Event sourcing storage grows forever: plan for archival and tiered storage",
    },
    {
      id: 'event-versioning',
      category: 'reliability',
      question: "What happens when we need to change event schema over time?",
      answer: "Use **event versioning**:\n- OrderPlaced_v1: {order_id, quantity}\n- OrderPlaced_v2: {order_id, quantity, limit_price}\n- Old consumers read v1, new consumers read v2\n- Upcasters convert v1 → v2 during replay\n- Never break old event readers",
      importance: 'important',
      insight: "Event schema evolution is inevitable: design for backward compatibility from day 1",
    },
    {
      id: 'cqrs-pattern',
      category: 'scalability',
      question: "Reading by replaying events is slow for dashboards. How do we optimize reads?",
      answer: "Implement **CQRS (Command Query Responsibility Segregation)**:\n- Write side: Append events (optimized for writes)\n- Read side: Materialized views in database (optimized for queries)\n- Event handlers update materialized views asynchronously\n- Dashboards query views, not event log\n\nExample: Portfolio view updated in real-time from events",
      importance: 'critical',
      learningPoint: "CQRS separates write model (events) from read model (views) for optimal performance",
    },
  ],

  minimumQuestionsRequired: 3,
  criticalQuestionIds: ['core-event-sourcing', 'event-append', 'state-reconstruction', 'event-ordering'],
  criticalFRQuestionIds: ['core-event-sourcing', 'event-append', 'state-reconstruction', 'event-replay'],
  criticalScaleQuestionIds: ['throughput-events', 'latency-write', 'global-replication', 'consistency-guarantees'],

  confirmedFRs: [
    {
      id: 'fr-1',
      text: 'FR-1: Append events to immutable log',
      description: 'Store all state changes as ordered, immutable events',
      emoji: '📝',
    },
    {
      id: 'fr-2',
      text: 'FR-2: Reconstruct state from events',
      description: 'Rebuild current state by replaying event history',
      emoji: '🔄',
    },
    {
      id: 'fr-3',
      text: 'FR-3: Support event replay',
      description: 'Allow replaying events from any point in time',
      emoji: '⏮️',
    },
    {
      id: 'fr-4',
      text: 'FR-4: Cross-region replication',
      description: 'Replicate events across global regions',
      emoji: '🌍',
    },
    {
      id: 'fr-5',
      text: 'FR-5: Optimized read queries',
      description: 'Fast queries via CQRS materialized views',
      emoji: '⚡',
    },
  ],

  scaleMetrics: {
    dailyActiveUsers: '10 million traders',
    writesPerDay: '11.7 billion events',
    readsPerDay: '50 billion queries',
    peakMultiplier: 5,
    readWriteRatio: '4:1',
    calculatedWriteRPS: { average: 135416, peak: 500000 },
    calculatedReadRPS: { average: 578703, peak: 2000000 },
    maxPayloadSize: '~2KB per event',
    storagePerRecord: '~2KB',
    storageGrowthPerYear: '~8.5 PB',
    redirectLatencySLA: 'p99 < 100ms (read)',
    createLatencySLA: 'p99 < 10ms (write)',
  },

  architecturalImplications: [
    '✅ 500K events/sec → Horizontal sharding by entity_id required',
    '✅ Write latency < 10ms → In-memory event buffers with async persistence',
    '✅ Read latency < 100ms → Snapshots every 1000 events + CQRS views',
    '✅ Global scale → Multi-region event replication with causal ordering',
    '✅ 7 year retention → Tiered storage: hot (SSD) + cold (S3)',
    '✅ Fast queries → CQRS materialized views in read-optimized database',
  ],

  outOfScope: [
    'Event-driven microservices communication',
    'Complex event processing (CEP)',
    'Real-time analytics pipelines',
    'Multi-tenant isolation',
    'Event encryption at rest',
  ],

  keyInsight: "First, let's make it WORK. We'll build a basic event store that appends events and reconstructs state. The complexity of snapshots, cross-region replication, and CQRS comes later. Functionality first!",
};

// =============================================================================
// STEP 1: Build Basic Event Store
// =============================================================================

const step1Story: StoryContent = {
  emoji: '📝',
  scenario: "Welcome to GlobalFinance Corp! You're building an event sourcing system for trading.",
  hook: "Traditional databases update records in place. We need a complete audit trail of every change.",
  challenge: "Set up the basic event store architecture to accept and store events.",
  illustration: 'startup-launch',
};

const step1Celebration: CelebrationContent = {
  emoji: '🎉',
  message: 'Event store is operational!',
  achievement: 'Your system can now receive and store events',
  metrics: [
    { label: 'Event store status', after: 'Online' },
    { label: 'Accepting events', after: '✓' },
  ],
  nextTeaser: "But events are just being stored, not processed...",
};

const step1LearnPhase: TeachingContent = {
  conceptTitle: 'Event Sourcing: Facts Over State',
  conceptExplanation: `**Event Sourcing** is a fundamentally different way of storing data:

**Traditional Database:**
UPDATE accounts SET balance = 500 WHERE id = 123
(Previous balance lost forever)

**Event Sourcing:**
Append events:
1. AccountCreated: {id: 123, balance: 1000}
2. MoneyWithdrawn: {id: 123, amount: 500}
Current balance = 1000 - 500 = 500

The complete history is preserved! You can answer:
- What was the balance yesterday?
- How many withdrawals this month?
- Replay events to fix bugs

Event Store Architecture:
1. **Client** - Trading application
2. **App Server** - Validates and appends events
3. **Event Store** - Append-only log database`,

  whyItMatters: 'Financial systems need complete audit trails. Event sourcing provides immutable history for compliance and debugging.',

  realWorldExample: {
    company: 'Goldman Sachs',
    scenario: 'Trading platform with billions of transactions',
    howTheyDoIt: 'Uses event sourcing for all trades. Can reconstruct portfolio state at any millisecond for regulatory audits.',
  },

  keyPoints: [
    'Events are immutable facts about what happened',
    'State is derived by replaying events',
    'Complete audit trail for compliance',
    'Client → App Server → Event Store',
  ],

  keyConcepts: [
    { title: 'Event', explanation: 'Immutable record of a state change', icon: '📋' },
    { title: 'Event Store', explanation: 'Append-only database for events', icon: '🗄️' },
    { title: 'Append-Only', explanation: 'Never update or delete, only add', icon: '➕' },
  ],
};

const step1: GuidedStep = {
  id: 'event-sourcing-step-1',
  stepNumber: 1,
  frIndex: 0,

  story: step1Story,
  learnPhase: step1LearnPhase,

  practicePhase: {
    frText: 'Setting up foundation for event sourcing',
    taskDescription: 'Build the basic flow: Client → App Server → Event Store',
    componentsNeeded: [
      { type: 'client', reason: 'Trading applications generating events', displayName: 'Trading Client' },
      { type: 'app_server', reason: 'Validates and processes events', displayName: 'Event API' },
      { type: 'database', reason: 'Stores events in append-only log', displayName: 'Event Store' },
    ],
    successCriteria: [
      'All components added to canvas',
      'Client → App Server → Event Store connected',
    ],
  },

  celebration: step1Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
  },

  hints: {
    level1: 'Drag Client, App Server, and Database onto the canvas',
    level2: 'Connect them in order: Client → App Server → Database',
    solutionComponents: [
      { type: 'client' },
      { type: 'app_server' },
      { type: 'database' },
    ],
    solutionConnections: [
      { from: 'client', to: 'app_server' },
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 2: Implement Event Append Logic
// =============================================================================

const step2Story: StoryContent = {
  emoji: '💻',
  scenario: "Events are arriving, but the app server doesn't know how to handle them!",
  hook: "A trader just placed an order, but it returned 404 Not Found.",
  challenge: "Write the Python code to append events to the store.",
  illustration: 'code-editor',
};

const step2Celebration: CelebrationContent = {
  emoji: '✅',
  message: 'Events are being appended!',
  achievement: 'Your event store can now persist events',
  metrics: [
    { label: 'Events appended', after: '1000+' },
    { label: 'Event ordering', after: 'Sequential' },
    { label: 'Validation', after: 'Enabled' },
  ],
  nextTeaser: "But how do we read current state from events?...",
};

const step2LearnPhase: TeachingContent = {
  conceptTitle: 'Event Append: Writing Immutable History',
  conceptExplanation: `Appending events requires careful handling:

**Event Structure:**
{
  event_id: "uuid-v4",
  entity_id: "account-123",
  event_type: "MoneyDeposited",
  sequence_number: 42,
  timestamp: "2025-01-15T10:30:00Z",
  data: { amount: 1000, currency: "USD" }
}

**Append Logic:**
1. Validate event schema
2. Check entity exists
3. Assign next sequence number (atomic!)
4. Write to event log
5. Return acknowledgment

**Critical: Sequence Numbers**
- Must be sequential: 1, 2, 3, ... (no gaps)
- Ensures event ordering
- Detect missing events
- Use database atomic increment or compare-and-swap`,

  whyItMatters: 'Event ordering is critical. Out-of-order events can corrupt state reconstruction.',

  famousIncident: {
    title: 'Knight Capital Trading Disaster',
    company: 'Knight Capital',
    year: '2012',
    whatHappened: 'Software deployed with a flag that caused old test code to execute. The code sent 4 million erroneous orders in 45 minutes. Lost $440 million. If they had event sourcing with proper validation, they could have replayed and identified the bad events.',
    lessonLearned: 'Validate events before appending. Event sourcing enables post-disaster analysis.',
    icon: '💸',
  },

  realWorldExample: {
    company: 'Klarna',
    scenario: 'Processing millions of payment events',
    howTheyDoIt: 'Every payment event is validated and assigned a sequence number before appending. Can replay events to reconstruct exact account state at any time.',
  },

  keyPoints: [
    'Events must have sequential sequence numbers',
    'Validate schema before appending',
    'Append operation must be atomic',
    'Never modify existing events',
  ],

  quickCheck: {
    question: 'Why are sequence numbers critical in event sourcing?',
    options: [
      'To make events unique',
      'To ensure events are processed in the correct order',
      'To improve query performance',
      'To enable compression',
    ],
    correctIndex: 1,
    explanation: 'Sequence numbers guarantee ordering. Processing events out of order can produce incorrect state.',
  },

  keyConcepts: [
    { title: 'Sequence Number', explanation: 'Monotonically increasing event order', icon: '🔢' },
    { title: 'Atomic Append', explanation: 'All-or-nothing event write', icon: '⚛️' },
    { title: 'Event Validation', explanation: 'Check schema before accepting', icon: '✅' },
  ],
};

const step2: GuidedStep = {
  id: 'event-sourcing-step-2',
  stepNumber: 2,
  frIndex: 0,

  story: step2Story,
  learnPhase: step2LearnPhase,

  practicePhase: {
    frText: 'FR-1: Append events to immutable log',
    taskDescription: 'Implement event append handlers in Python',
    successCriteria: [
      'Click on App Server to open inspector',
      'Assign POST /events and GET /events APIs',
      'Open the Python tab',
      'Implement append_event() and get_events() functions',
    ],
  },

  celebration: step2Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Click on App Server, assign POST /events and GET /events APIs',
    level2: 'Implement append_event() to validate and store events with sequence numbers',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['POST /events', 'GET /events'] } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 3: Implement State Reconstruction
// =============================================================================

const step3Story: StoryContent = {
  emoji: '🔄',
  scenario: "Events are being stored, but traders can't see their account balances!",
  hook: "They want to know: 'What's my current balance?' but we only have events, not state.",
  challenge: "Implement state reconstruction by replaying events.",
  illustration: 'data-sync',
};

const step3Celebration: CelebrationContent = {
  emoji: '🎯',
  message: 'State reconstruction is working!',
  achievement: 'Current state can be derived from event history',
  metrics: [
    { label: 'Events replayed', after: '1000+' },
    { label: 'State accuracy', after: '100%' },
    { label: 'Reconstruction time', after: '< 50ms' },
  ],
  nextTeaser: "But replaying thousands of events is too slow...",
};

const step3LearnPhase: TeachingContent = {
  conceptTitle: 'State Reconstruction: Replaying History',
  conceptExplanation: `**State reconstruction** is how we get current state from events:

**Algorithm:**
1. Start with initial state (empty)
2. Load all events for entity in sequence order
3. For each event, apply to current state
4. Final state = current state

**Example:**
Account-123 events:
1. AccountCreated: {balance: 0}
2. Deposited: {amount: 1000} → State: {balance: 1000}
3. Withdrew: {amount: 200} → State: {balance: 800}
4. Deposited: {amount: 500} → State: {balance: 1300}

Current balance = 1300

**Event Handlers (Reducers):**
Each event type has a handler function:
- AccountCreated → Initialize account
- Deposited → Add to balance
- Withdrew → Subtract from balance

State is deterministic: Same events → Same state`,

  whyItMatters: 'State reconstruction is the core of event sourcing. It proves events are the source of truth.',

  famousIncident: {
    title: 'Robinhood Trading Halt',
    company: 'Robinhood',
    year: '2020',
    whatHappened: 'During volatile trading, their system had a bug that incorrectly calculated account balances. Some users saw negative balances. If they used event sourcing, they could replay events with fixed logic to correct all balances.',
    lessonLearned: 'Event sourcing enables fixing bugs by replaying with corrected logic.',
    icon: '📈',
  },

  realWorldExample: {
    company: 'Eventide',
    scenario: 'Banking platform',
    howTheyDoIt: 'Every account balance is computed by replaying events. Can answer "What was balance on Dec 1 at 2:30 PM?" by replaying up to that timestamp.',
  },

  diagram: `
Event Stream:
Event 1: AccountCreated → State: {balance: 0}
Event 2: Deposit $1000  → State: {balance: 1000}
Event 3: Withdraw $200  → State: {balance: 800}
Event 4: Deposit $500   → State: {balance: 1300}

Current State = Replay all events = {balance: 1300}

Temporal Query (balance at Event 2):
Replay Events 1-2 → {balance: 1000}
`,

  keyPoints: [
    'State = f(all events) - deterministic',
    'Replay events in sequence order',
    'Each event type has a handler/reducer',
    'Can reconstruct state at any point in time',
  ],

  quickCheck: {
    question: 'What is the advantage of reconstructing state from events?',
    options: [
      'It\'s faster than querying a database',
      'It provides a complete audit trail and enables time travel',
      'It uses less storage',
      'It simplifies the code',
    ],
    correctIndex: 1,
    explanation: 'Reconstructing from events gives you complete history and ability to query state at any point in time.',
  },

  keyConcepts: [
    { title: 'Event Replay', explanation: 'Processing events to rebuild state', icon: '⏮️' },
    { title: 'Event Handler', explanation: 'Function that applies event to state', icon: '🔧' },
    { title: 'Temporal Query', explanation: 'State at a specific point in time', icon: '⏰' },
  ],
};

const step3: GuidedStep = {
  id: 'event-sourcing-step-3',
  stepNumber: 3,
  frIndex: 1,

  story: step3Story,
  learnPhase: step3LearnPhase,

  practicePhase: {
    frText: 'FR-2: Reconstruct state from events',
    taskDescription: 'Implement state reconstruction logic',
    successCriteria: [
      'Add GET /state/:entity_id API',
      'Implement reconstruct_state() function',
      'Handle each event type with reducer functions',
      'Return current state from replayed events',
    ],
  },

  celebration: step3Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add GET /state/:entity_id API to App Server',
    level2: 'Implement reconstruct_state() that fetches events and applies each one sequentially',
    solutionComponents: [
      { type: 'app_server', config: { handledAPIs: ['GET /state/:entity_id'] } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 4: Add Snapshot Optimization
// =============================================================================

const step4Story: StoryContent = {
  emoji: '🐌',
  scenario: "State reconstruction is working but incredibly slow!",
  hook: "A high-frequency trading account has 500,000 events. Replaying takes 30 seconds!",
  challenge: "Implement snapshots to speed up state reconstruction.",
  illustration: 'slow-loading',
};

const step4Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'Snapshots make reconstruction blazing fast!',
  achievement: 'State reconstruction is 100x faster with snapshots',
  metrics: [
    { label: 'Reconstruction time', before: '30 seconds', after: '< 100ms' },
    { label: 'Events replayed', before: '500,000', after: '< 1,000' },
    { label: 'Snapshot interval', after: 'Every 1000 events' },
  ],
  nextTeaser: "But we're still single-region. What about global scale?...",
};

const step4LearnPhase: TeachingContent = {
  conceptTitle: 'Snapshots: Optimizing Event Replay',
  conceptExplanation: `**Snapshots** are periodic state saves to speed up reconstruction:

**Without Snapshots:**
Reconstruct account with 100,000 events:
1. Load events 1-100,000
2. Replay all 100,000 events
3. Time: ~10 seconds

**With Snapshots (every 1000 events):**
Reconstruct account with 100,000 events:
1. Load snapshot at event 99,000
2. Replay events 99,001-100,000 (1000 events)
3. Time: ~100ms

**Snapshot Strategy:**
- Create snapshot every N events (e.g., 1000)
- Store: {entity_id, sequence_number, state}
- Reconstruction: Load latest snapshot + replay since
- Snapshots are optimization, NOT source of truth
- Always validate against events if suspicious

**When to Snapshot:**
- After every N events
- Before critical operations
- During low-traffic periods`,

  whyItMatters: 'Without snapshots, event sourcing doesn\'t scale. Snapshots make O(n) reconstruction into O(1) + small delta.',

  famousIncident: {
    title: 'IEX Exchange Snapshot Strategy',
    company: 'IEX',
    year: '2016',
    whatHappened: 'IEX is a stock exchange that uses event sourcing for order books. They snapshot order book state every second. During flash crashes, they can replay from last snapshot to analyze what happened within microsecond precision.',
    lessonLearned: 'Smart snapshot strategy balances performance with granularity.',
    icon: '📊',
  },

  realWorldExample: {
    company: 'Axon (formerly AxonFramework)',
    scenario: 'Event sourcing framework used by banks',
    howTheyDoIt: 'Default snapshot every 500 events. Can customize per aggregate. Snapshots stored alongside events.',
  },

  diagram: `
Event Timeline:
0     1000    2000    3000    4000    5000
|      |       |       |       |       |
📋     📸      📸      📸      📸      📸
      snap    snap    snap    snap    snap

Reconstruct at event 4500:
1. Load snapshot @ 4000
2. Replay events 4001-4500 (500 events)
3. Done!

Without snapshot:
1. Replay events 1-4500 (4500 events)
2. Much slower!
`,

  keyPoints: [
    'Snapshots = periodic state saves',
    'Reduce replay from thousands to hundreds of events',
    'Snapshot every N events (typically 500-1000)',
    'Snapshots are cache, events are source of truth',
  ],

  quickCheck: {
    question: 'Why are events still the source of truth even with snapshots?',
    options: [
      'Events are more reliable',
      'Snapshots can be corrupted or buggy; events can always rebuild state',
      'Events use less storage',
      'Snapshots are slower',
    ],
    correctIndex: 1,
    explanation: 'If a snapshot has a bug, you can delete it and rebuild from events. Events are immutable truth.',
  },

  keyConcepts: [
    { title: 'Snapshot', explanation: 'Periodic saved state for fast loading', icon: '📸' },
    { title: 'Snapshot Interval', explanation: 'How often to create snapshots', icon: '⏱️' },
    { title: 'Snapshot Validation', explanation: 'Verify snapshots against events', icon: '✅' },
  ],
};

const step4: GuidedStep = {
  id: 'event-sourcing-step-4',
  stepNumber: 4,
  frIndex: 1,

  story: step4Story,
  learnPhase: step4LearnPhase,

  practicePhase: {
    frText: 'FR-2: Reconstruct state (optimized with snapshots)',
    taskDescription: 'Add snapshot creation and loading logic',
    componentsNeeded: [
      { type: 'cache', reason: 'Store snapshots for fast state reconstruction', displayName: 'Snapshot Store' },
    ],
    successCriteria: [
      'Add Cache component for snapshots',
      'Connect App Server to Cache',
      'Implement create_snapshot() every 1000 events',
      'Modify reconstruct_state() to load snapshot first',
    ],
  },

  celebration: step4Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
    ],
    requireAPIConfiguration: true,
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add Cache component and connect to App Server',
    level2: 'Create snapshot every 1000 events and load from cache in reconstruct_state()',
    solutionComponents: [
      { type: 'cache' },
    ],
    solutionConnections: [
      { from: 'app_server', to: 'cache' },
    ],
  },
};

// =============================================================================
// STEP 5: Add Cross-Region Event Replication
// =============================================================================

const step5Story: StoryContent = {
  emoji: '🌍',
  scenario: "You have offices in New York, London, and Tokyo. Events only exist in NY!",
  hook: "London traders see stale data. Tokyo office experiences 200ms latency for every read.",
  challenge: "Implement cross-region event replication for global scale.",
  illustration: 'global-network',
};

const step5Celebration: CelebrationContent = {
  emoji: '🌐',
  message: 'Events are now globally replicated!',
  achievement: 'All regions have local event stores with replication',
  metrics: [
    { label: 'Regions', before: '1', after: '3' },
    { label: 'Replication lag', after: '< 100ms' },
    { label: 'Write latency', after: '< 10ms (local)' },
  ],
  nextTeaser: "But reads are still slow because we replay events...",
};

const step5LearnPhase: TeachingContent = {
  conceptTitle: 'Cross-Region Event Replication',
  conceptExplanation: `**Global event sourcing** requires events in multiple regions:

**Single Region Problem:**
- NY traders: 5ms write latency
- London traders: 100ms write latency (cross-Atlantic)
- Tokyo traders: 200ms write latency (cross-Pacific)

**Multi-Region Solution:**
Each region has local event store:
- NY → US-East Event Store
- London → EU-West Event Store
- Tokyo → Asia-Pacific Event Store

**Replication Strategy:**
1. Write to local region (< 10ms)
2. Async replicate to other regions (< 100ms)
3. Each region maintains full event log
4. Eventual consistency across regions

**Conflict Resolution:**
- Events have global unique IDs
- Use vector clocks for causality
- Last-write-wins with timestamps
- Or use CRDTs for commutative operations

**Causal Ordering:**
If Event A caused Event B:
- A must appear before B in all regions
- Use Lamport timestamps or vector clocks`,

  whyItMatters: 'Global trading happens 24/7. Low latency in every region is critical for competitive advantage.',

  famousIncident: {
    title: 'NASDAQ Flash Crash',
    company: 'NASDAQ',
    year: '2010',
    whatHappened: 'Orders from different regions arrived out of order due to network delays. Combined with algorithmic trading, caused a flash crash where stocks lost 60% value in minutes. Better causal ordering of events could have prevented cascading failures.',
    lessonLearned: 'Event ordering matters at global scale. Implement causal consistency.',
    icon: '📉',
  },

  realWorldExample: {
    company: 'Interactive Brokers',
    scenario: 'Trading in 135+ markets globally',
    howTheyDoIt: 'Local event stores in each region. Events replicate with vector clocks to maintain causal order globally.',
  },

  diagram: `
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   US-East   │       │   EU-West   │       │ Asia-Pacific│
│ Event Store │◀─────▶│ Event Store │◀─────▶│ Event Store │
└─────────────┘       └─────────────┘       └─────────────┘
      ▲                     ▲                      ▲
      │ < 10ms             │ < 10ms               │ < 10ms
      │ local write        │ local write          │ local write
      │                    │                       │
 NY Traders          London Traders         Tokyo Traders

Events replicate async (< 100ms) between regions
Eventual consistency: All regions converge to same state
`,

  keyPoints: [
    'Local writes for low latency (< 10ms)',
    'Async replication for global consistency',
    'Vector clocks for causal ordering',
    'Eventual consistency across regions',
  ],

  quickCheck: {
    question: 'Why replicate events asynchronously instead of synchronously?',
    options: [
      'Async is more reliable',
      'Sync would add cross-region latency (100ms+) to every write',
      'Async is cheaper',
      'Sync doesn\'t work across regions',
    ],
    correctIndex: 1,
    explanation: 'Sync replication would require waiting for cross-region acknowledgment, adding 100-200ms to writes. Async keeps writes fast.',
  },

  keyConcepts: [
    { title: 'Multi-Region', explanation: 'Event stores in multiple geographic locations', icon: '🌍' },
    { title: 'Vector Clock', explanation: 'Tracks causality across distributed events', icon: '🕰️' },
    { title: 'Eventual Consistency', explanation: 'All regions converge to same state', icon: '🔄' },
  ],
};

const step5: GuidedStep = {
  id: 'event-sourcing-step-5',
  stepNumber: 5,
  frIndex: 3,

  story: step5Story,
  learnPhase: step5LearnPhase,

  practicePhase: {
    frText: 'FR-4: Cross-region replication',
    taskDescription: 'Add event stores in EU and Asia with replication',
    componentsNeeded: [
      { type: 'database', reason: 'Event store in EU region', displayName: 'Event Store (EU)' },
      { type: 'database', reason: 'Event store in Asia region', displayName: 'Event Store (Asia)' },
    ],
    successCriteria: [
      'Add two more Database components (EU and Asia)',
      'Enable bidirectional replication between all event stores',
      'Configure async replication with < 100ms lag',
    ],
  },

  celebration: step5Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'database', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'cache' },
      { fromType: 'database', toType: 'database' }, // Replication
      { fromType: 'database', toType: 'database' }, // Replication
    ],
  },

  hints: {
    level1: 'Add two more Database components for EU and Asia event stores',
    level2: 'Connect all three databases bidirectionally to enable replication',
    solutionComponents: [
      { type: 'database', displayName: 'Event Store (EU)' },
      { type: 'database', displayName: 'Event Store (Asia)' },
    ],
    solutionConnections: [
      { from: 'database', to: 'database' },
      { from: 'database', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 6: Implement CQRS Read Model
// =============================================================================

const step6Story: StoryContent = {
  emoji: '📊',
  scenario: "Dashboards are timing out! Replaying events for every query is too slow.",
  hook: "Portfolio dashboard needs to show 1000 accounts. That's 1000 event replays per request!",
  challenge: "Implement CQRS pattern with materialized views for fast reads.",
  illustration: 'dashboard',
};

const step6Celebration: CelebrationContent = {
  emoji: '⚡',
  message: 'CQRS makes reads lightning fast!',
  achievement: 'Materialized views provide instant query responses',
  metrics: [
    { label: 'Dashboard load time', before: '30 seconds', after: '< 100ms' },
    { label: 'Read queries/sec', after: '100K+' },
    { label: 'View update lag', after: '< 1 second' },
  ],
  nextTeaser: "But we need to handle event schema changes...",
};

const step6LearnPhase: TeachingContent = {
  conceptTitle: 'CQRS: Separating Reads and Writes',
  conceptExplanation: `**CQRS** (Command Query Responsibility Segregation) separates write model from read model:

**Write Model (Commands):**
- Append events to event store
- Optimized for writes
- Source of truth

**Read Model (Queries):**
- Materialized views in database
- Optimized for queries
- Derived from events

**How It Works:**
1. Command: User deposits $1000
2. Write: Append "Deposited" event
3. Event Handler: Update materialized view
4. Query: Read from view (instant!)

**Materialized Views:**
- account_balances: {account_id, balance, updated_at}
- portfolio_positions: {account_id, symbol, shares}
- transaction_history: {account_id, transaction_id, amount}

**Benefits:**
- Writes stay fast (append-only)
- Reads stay fast (pre-computed views)
- Can have multiple views for different use cases
- Scale reads and writes independently

**Trade-off:**
- Eventual consistency: views lag events by ~1 second
- More storage: events + views
- More complexity: keep views in sync`,

  whyItMatters: 'Event sourcing alone is slow for queries. CQRS makes it practical for production systems.',

  famousIncident: {
    title: 'PayPal CQRS Migration',
    company: 'PayPal',
    year: '2018',
    whatHappened: 'PayPal had a monolithic database that couldn\'t handle read and write load. Migrated to event sourcing + CQRS. Write path uses event store, read path uses Elasticsearch views. Scaled to 10x traffic.',
    lessonLearned: 'CQRS enables independent scaling of reads and writes.',
    icon: '💳',
  },

  realWorldExample: {
    company: 'Danske Bank',
    scenario: 'Processing millions of banking transactions',
    howTheyDoIt: 'Events in event store. Materialized views in PostgreSQL for account balances, MongoDB for transaction search.',
  },

  diagram: `
┌──────────────────────────────────────────┐
│           WRITE SIDE                     │
│  Command → Event Store (append-only)     │
│  Optimized for: throughput, durability   │
└────────────┬─────────────────────────────┘
             │
             │ Event Stream
             ▼
    ┌────────────────┐
    │ Event Handlers │
    └───────┬────────┘
            │ Updates
            ▼
┌──────────────────────────────────────────┐
│           READ SIDE                      │
│  Materialized Views (pre-computed)       │
│  - account_balances (SQL)                │
│  - portfolio_positions (SQL)             │
│  - transaction_search (Elasticsearch)    │
│  Optimized for: query speed              │
└────────────▲─────────────────────────────┘
             │
             │ Query
        User Dashboard
`,

  keyPoints: [
    'Write model: Event store (append-only)',
    'Read model: Materialized views (queryable)',
    'Event handlers keep views in sync',
    'Eventual consistency: views lag ~1 second',
  ],

  quickCheck: {
    question: 'What is the main benefit of CQRS in event sourcing?',
    options: [
      'It reduces storage requirements',
      'It enables fast reads via pre-computed views while keeping writes fast',
      'It simplifies the architecture',
      'It guarantees strong consistency',
    ],
    correctIndex: 1,
    explanation: 'CQRS separates write optimization (event store) from read optimization (views), making both fast.',
  },

  keyConcepts: [
    { title: 'CQRS', explanation: 'Separate models for commands and queries', icon: '🔀' },
    { title: 'Materialized View', explanation: 'Pre-computed queryable state', icon: '📊' },
    { title: 'Event Handler', explanation: 'Updates views when events occur', icon: '🔧' },
  ],
};

const step6: GuidedStep = {
  id: 'event-sourcing-step-6',
  stepNumber: 6,
  frIndex: 4,

  story: step6Story,
  learnPhase: step6LearnPhase,

  practicePhase: {
    frText: 'FR-5: Optimized read queries',
    taskDescription: 'Add read database for materialized views',
    componentsNeeded: [
      { type: 'database', reason: 'Stores materialized views for fast queries', displayName: 'Read Database' },
    ],
    successCriteria: [
      'Add Read Database component',
      'Connect App Server to Read Database',
      'Implement event handlers to update views',
      'Query views instead of replaying events',
    ],
  },

  celebration: step6Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'database'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' }, // Event store
      { fromType: 'app_server', toType: 'database' }, // Read DB
      { fromType: 'app_server', toType: 'cache' },
    ],
  },

  hints: {
    level1: 'Add a Database component for the read model (materialized views)',
    level2: 'Connect App Server to Read Database and implement view update logic in event handlers',
    solutionComponents: [
      { type: 'database', displayName: 'Read Database' },
    ],
    solutionConnections: [
      { from: 'app_server', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 7: Add Message Queue for Event Distribution
// =============================================================================

const step7Story: StoryContent = {
  emoji: '🌊',
  scenario: "Event handlers are called synchronously. If one fails, the whole write fails!",
  hook: "The analytics view update is slow. It's blocking critical trading operations!",
  challenge: "Add message queue to distribute events asynchronously.",
  illustration: 'message-queue',
};

const step7Celebration: CelebrationContent = {
  emoji: '📬',
  message: 'Event distribution is decoupled!',
  achievement: 'Message queue enables async event processing',
  metrics: [
    { label: 'Write latency', before: '50ms', after: '< 10ms' },
    { label: 'Event handlers', after: 'Async' },
    { label: 'Reliability', after: 'Guaranteed delivery' },
  ],
  nextTeaser: "But we need to monitor event processing...",
};

const step7LearnPhase: TeachingContent = {
  conceptTitle: 'Event Distribution: Publish-Subscribe Pattern',
  conceptExplanation: `**Message Queue** decouples event producers from consumers:

**Without Message Queue:**
1. Append event to store
2. Call handler 1 (update balance view) - 10ms
3. Call handler 2 (update analytics) - 100ms
4. Call handler 3 (send notification) - 50ms
Total: 160ms (slow!)

**With Message Queue:**
1. Append event to store
2. Publish to message queue
3. Return to client (10ms - fast!)
4. Handlers consume async from queue

**Benefits:**
- Fast writes: don't wait for handlers
- Reliability: queue guarantees delivery
- Scalability: add more consumers
- Decoupling: handlers don't affect writes

**Event Topics:**
- account.events: All account events
- trade.events: All trade events
- Each handler subscribes to relevant topics

**Exactly-Once Processing:**
- Idempotent handlers
- Deduplication by event_id
- Transactional view updates`,

  whyItMatters: 'Async event processing prevents slow consumers from blocking critical writes.',

  realWorldExample: {
    company: 'Shopify',
    scenario: 'Processing order events',
    howTheyDoIt: 'Events published to Kafka. 100+ consumers process events for inventory, billing, notifications, analytics independently.',
  },

  keyPoints: [
    'Publish events to message queue after appending',
    'Handlers consume asynchronously',
    'Decouple writes from view updates',
    'Guaranteed delivery with retries',
  ],

  keyConcepts: [
    { title: 'Pub-Sub', explanation: 'Publishers and subscribers decoupled', icon: '📡' },
    { title: 'Async Processing', explanation: 'Non-blocking event handling', icon: '⚡' },
    { title: 'Guaranteed Delivery', explanation: 'Queue ensures events are processed', icon: '✅' },
  ],
};

const step7: GuidedStep = {
  id: 'event-sourcing-step-7',
  stepNumber: 7,
  frIndex: 0,

  story: step7Story,
  learnPhase: step7LearnPhase,

  practicePhase: {
    frText: 'Enabling async event distribution for all FRs',
    taskDescription: 'Add message queue for event distribution',
    componentsNeeded: [
      { type: 'message_queue', reason: 'Distributes events to multiple consumers', displayName: 'Event Queue' },
    ],
    successCriteria: [
      'Add Message Queue component',
      'Publish events to queue after appending to store',
      'Connect consumers to queue instead of direct calls',
    ],
  },

  celebration: step7Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'message_queue', toType: 'database' }, // Consumers update views
    ],
  },

  hints: {
    level1: 'Add Message Queue component and connect it between App Server and consumers',
    level2: 'Publish events to queue after appending, let consumers process async',
    solutionComponents: [
      { type: 'message_queue' },
    ],
    solutionConnections: [
      { from: 'app_server', to: 'message_queue' },
      { from: 'message_queue', to: 'database' },
    ],
  },
};

// =============================================================================
// STEP 8: Add Monitoring and Observability
// =============================================================================

const step8Story: StoryContent = {
  emoji: '📊',
  scenario: "Events are being published, but you have no visibility into what's happening!",
  hook: "Is event lag growing? Are snapshots being created? You have no idea!",
  challenge: "Add monitoring to track event processing metrics.",
  illustration: 'monitoring',
};

const step8Celebration: CelebrationContent = {
  emoji: '👀',
  message: 'System is fully observable!',
  achievement: 'Monitoring provides visibility into event processing',
  metrics: [
    { label: 'Metrics tracked', after: '10+' },
    { label: 'Dashboards', after: 'Real-time' },
    { label: 'Alerts', after: 'Configured' },
  ],
  nextTeaser: "But event schemas will change over time...",
};

const step8LearnPhase: TeachingContent = {
  conceptTitle: 'Observability: Monitoring Event Processing',
  conceptExplanation: `**Monitoring** is critical for event sourcing systems:

**Key Metrics:**
1. **Write Metrics:**
   - Events appended/sec
   - Write latency (p50, p99)
   - Event store disk usage

2. **Read Metrics:**
   - State reconstructions/sec
   - Snapshot hit rate
   - Replay time distribution

3. **Replication Metrics:**
   - Cross-region replication lag
   - Event ordering violations
   - Conflict resolution rate

4. **CQRS Metrics:**
   - View update lag
   - Event handler failures
   - View freshness

**Alerts:**
- Replication lag > 1 second
- Snapshot hit rate < 80%
- Event handler failures
- Event store disk > 80%

**Dashboards:**
- Real-time event throughput
- Regional replication status
- Event handler processing lag
- System health overview`,

  whyItMatters: 'Event sourcing systems are complex. Observability helps detect and debug issues before they impact users.',

  realWorldExample: {
    company: 'Ticketmaster',
    scenario: 'Monitoring event-driven ticket sales',
    howTheyDoIt: 'Monitors event lag, handler failures, and view freshness. Alerts on-call if lag exceeds thresholds during high-demand sales.',
  },

  keyPoints: [
    'Monitor write, read, and replication metrics',
    'Alert on lag and failures',
    'Dashboards for real-time visibility',
    'Track event handler performance',
  ],

  keyConcepts: [
    { title: 'Monitoring', explanation: 'Tracking system metrics and health', icon: '📈' },
    { title: 'Observability', explanation: 'Understanding system behavior from outputs', icon: '🔍' },
    { title: 'Event Lag', explanation: 'Delay between event write and processing', icon: '⏱️' },
  ],
};

const step8: GuidedStep = {
  id: 'event-sourcing-step-8',
  stepNumber: 8,
  frIndex: 0,

  story: step8Story,
  learnPhase: step8LearnPhase,

  practicePhase: {
    frText: 'Adding observability for all components',
    taskDescription: 'Add monitoring service to track metrics',
    componentsNeeded: [
      { type: 'monitoring', reason: 'Tracks event processing metrics and health', displayName: 'Monitoring' },
    ],
    successCriteria: [
      'Add Monitoring component',
      'Connect to Event Store, Message Queue, and App Server',
      'Configure metrics collection',
      'Set up alerts for critical thresholds',
    ],
  },

  celebration: step8Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue', 'monitoring'],
    requiredConnections: [
      { fromType: 'monitoring', toType: 'app_server' },
      { fromType: 'monitoring', toType: 'database' },
      { fromType: 'monitoring', toType: 'message_queue' },
    ],
  },

  hints: {
    level1: 'Add Monitoring component and connect to key services',
    level2: 'Configure monitoring to track event metrics, lag, and failures',
    solutionComponents: [
      { type: 'monitoring' },
    ],
    solutionConnections: [
      { from: 'monitoring', to: 'app_server' },
      { from: 'monitoring', to: 'database' },
      { from: 'monitoring', to: 'message_queue' },
    ],
  },
};

// =============================================================================
// STEP 9: Implement Event Versioning
// =============================================================================

const step9Story: StoryContent = {
  emoji: '🔄',
  scenario: "Product wants to add a new field to OrderPlaced events. But old code will break!",
  hook: "You have 2 years of OrderPlaced_v1 events. How do you introduce OrderPlaced_v2?",
  challenge: "Implement event versioning and upcasting for schema evolution.",
  illustration: 'version-control',
};

const step9Celebration: CelebrationContent = {
  emoji: '📦',
  message: 'Event versioning is working!',
  achievement: 'System handles multiple event schema versions gracefully',
  metrics: [
    { label: 'Event versions', after: 'v1, v2 supported' },
    { label: 'Backward compatibility', after: '100%' },
    { label: 'Upcasters', after: 'Configured' },
  ],
  nextTeaser: "Final step: let's optimize for scale...",
};

const step9LearnPhase: TeachingContent = {
  conceptTitle: 'Event Versioning: Schema Evolution',
  conceptExplanation: `**Event versioning** handles schema changes over time:

**The Problem:**
You have millions of OrderPlaced_v1 events:
{event_type: "OrderPlaced", order_id, quantity}

New requirement: add limit_price
OrderPlaced_v2:
{event_type: "OrderPlaced", version: 2, order_id, quantity, limit_price}

How to handle old events?

**Solutions:**

1. **Event Version Field:**
   - Add version to all events
   - v1 events: {version: 1, ...}
   - v2 events: {version: 2, ...}

2. **Upcasters:**
   - Convert old events to new schema during replay
   - Upcaster v1→v2: Add limit_price=null

3. **Multiple Handlers:**
   - Handle v1 and v2 separately
   - Or upcast to latest version first

**Best Practices:**
- Always include version field
- Never break old events
- Upcasters are one-way (v1→v2, not v2→v1)
- Test with historical events
- Document schema changes

**Example Upcaster:**
\`\`\`python
def upcast_v1_to_v2(event_v1):
    return {
        **event_v1,
        'version': 2,
        'limit_price': None  # Default for old events
    }
\`\`\``,

  whyItMatters: 'Event schemas evolve. Without versioning, you can\'t change schemas without breaking old events.',

  famousIncident: {
    title: 'Netflix Schema Evolution',
    company: 'Netflix',
    year: '2016',
    whatHappened: 'Netflix changed their user event schema without versioning. Old events couldn\'t be replayed. Lost ability to reprocess historical viewing data for ML models. Now uses Avro with schema registry for versioning.',
    lessonLearned: 'Plan for schema evolution from day 1 of event sourcing.',
    icon: '📺',
  },

  realWorldExample: {
    company: 'Eventstore (Database)',
    scenario: 'Event versioning in the database itself',
    howTheyDoIt: 'Stores event_type with version: "OrderPlaced-v2". Upcasters registered per version. Automatic upcast during replay.',
  },

  diagram: `
Event Timeline:

Year 1: OrderPlaced_v1 events
{version: 1, order_id, quantity}

Year 2: OrderPlaced_v2 introduced
{version: 2, order_id, quantity, limit_price}

Replay Today:
┌─────────────────────────────────┐
│ Read v1 event                   │
│         ↓                       │
│  Upcast v1 → v2                │
│  (add limit_price=null)         │
│         ↓                       │
│ Apply v2 handler               │
└─────────────────────────────────┘

Result: All events processed as v2
`,

  keyPoints: [
    'Include version field in all events',
    'Use upcasters to convert old → new',
    'Maintain backward compatibility',
    'Document schema changes',
  ],

  quickCheck: {
    question: 'Why use upcasters instead of updating old events in the store?',
    options: [
      'Upcasters are faster',
      'Events are immutable - you never modify them, only upcast during replay',
      'Upcasters use less storage',
      'It\'s required by law',
    ],
    correctIndex: 1,
    explanation: 'Events are immutable facts. Upcasting happens during replay, preserving the original event.',
  },

  keyConcepts: [
    { title: 'Event Version', explanation: 'Schema version of an event', icon: '🏷️' },
    { title: 'Upcaster', explanation: 'Converts old event to new schema', icon: '⬆️' },
    { title: 'Schema Evolution', explanation: 'Changing event structure over time', icon: '📈' },
  ],
};

const step9: GuidedStep = {
  id: 'event-sourcing-step-9',
  stepNumber: 9,
  frIndex: 0,

  story: step9Story,
  learnPhase: step9LearnPhase,

  practicePhase: {
    frText: 'Supporting schema evolution for all event types',
    taskDescription: 'Implement event versioning and upcasting',
    successCriteria: [
      'Add version field to all events',
      'Implement upcaster functions (v1 → v2)',
      'Modify event handlers to work with versioned events',
      'Test replay with mixed v1 and v2 events',
    ],
  },

  celebration: step9Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
    ],
    requireCodeImplementation: true,
  },

  hints: {
    level1: 'Add version field to event structure and create upcaster functions',
    level2: 'Implement upcast logic in replay that converts v1 events to v2 before processing',
    solutionComponents: [],
    solutionConnections: [],
  },
};

// =============================================================================
// STEP 10: Optimize for Scale
// =============================================================================

const step10Story: StoryContent = {
  emoji: '🚀',
  scenario: "The system is working, but can it handle 500K events/sec at global scale?",
  hook: "Black Monday trading volume: 10x normal. System needs to scale!",
  challenge: "Implement final optimizations for production scale.",
  illustration: 'scaling',
};

const step10Celebration: CelebrationContent = {
  emoji: '🏆',
  message: 'Congratulations! You built a global event sourcing system!',
  achievement: 'Production-ready event sourcing at massive scale',
  metrics: [
    { label: 'Write throughput', after: '500K events/sec' },
    { label: 'Write latency', after: 'p99 < 10ms' },
    { label: 'Read latency', after: 'p99 < 100ms' },
    { label: 'Global regions', after: '3' },
    { label: 'Event retention', after: '7+ years' },
    { label: 'Uptime', after: '99.99%' },
  ],
  nextTeaser: "You've mastered event sourcing at global scale!",
};

const step10LearnPhase: TeachingContent = {
  conceptTitle: 'Scaling Event Sourcing: Production Optimizations',
  conceptExplanation: `**Final optimizations** for production scale:

**1. Sharding Event Store:**
- Shard by entity_id hash
- Each shard handles subset of entities
- Horizontal scaling for writes
- 10 shards → 10x write throughput

**2. Event Batching:**
- Batch multiple events before writing
- Reduces disk I/O
- Trade-off: small latency for throughput

**3. Compression:**
- Compress events before storage
- 5x storage savings
- Slightly slower reads (acceptable)

**4. Tiered Storage:**
- Hot tier (SSD): Recent events (90 days)
- Cold tier (S3): Historical events (7 years)
- 90% cost reduction for old events

**5. Read Replicas:**
- Dedicated replicas for read queries
- Write to primary, read from replicas
- Scales read throughput

**6. Connection Pooling:**
- Reuse database connections
- Reduces connection overhead
- Critical at high concurrency

**Performance Targets Achieved:**
✅ 500K events/sec write throughput
✅ p99 < 10ms write latency
✅ p99 < 100ms read latency
✅ 99.99% availability
✅ 7-year retention`,

  whyItMatters: 'Production systems need optimization for cost and performance at scale.',

  realWorldExample: {
    company: 'Coinbase',
    scenario: 'Processing cryptocurrency trades',
    howTheyDoIt: 'Event sourcing with sharding, compression, and tiered storage. Handles millions of trades/day with complete audit trail for regulatory compliance.',
  },

  keyPoints: [
    'Shard event store by entity_id for horizontal scaling',
    'Use tiered storage for cost optimization',
    'Batch events to reduce I/O',
    'Monitor and optimize continuously',
  ],

  keyConcepts: [
    { title: 'Sharding', explanation: 'Partitioning data across multiple databases', icon: '🗂️' },
    { title: 'Tiered Storage', explanation: 'Hot and cold storage tiers', icon: '🗄️' },
    { title: 'Batching', explanation: 'Grouping operations for efficiency', icon: '📦' },
  ],
};

const step10: GuidedStep = {
  id: 'event-sourcing-step-10',
  stepNumber: 10,
  frIndex: 0,

  story: step10Story,
  learnPhase: step10LearnPhase,

  practicePhase: {
    frText: 'Optimizing all components for production scale',
    taskDescription: 'Implement final optimizations for scale and cost',
    successCriteria: [
      'Configure event store sharding (10 shards)',
      'Enable event compression',
      'Set up tiered storage (hot + cold)',
      'Add read replicas for query scaling',
      'Verify all performance targets met',
    ],
  },

  celebration: step10Celebration,

  validation: {
    requiredComponents: ['client', 'app_server', 'database', 'cache', 'message_queue', 'monitoring'],
    requiredConnections: [
      { fromType: 'client', toType: 'app_server' },
      { fromType: 'app_server', toType: 'database' },
      { fromType: 'app_server', toType: 'message_queue' },
      { fromType: 'monitoring', toType: 'app_server' },
    ],
  },

  hints: {
    level1: 'Configure sharding, compression, and tiered storage in event store settings',
    level2: 'Enable all optimizations: sharding, compression, tiered storage, read replicas',
    solutionComponents: [
      { type: 'database', config: { sharding: { enabled: true, shards: 10 }, compression: true, tieredStorage: true } },
    ],
    solutionConnections: [],
  },
};

// =============================================================================
// EXPORT THE COMPLETE TUTORIAL
// =============================================================================

export const globalEventSourcingGuidedTutorial: GuidedTutorial = {
  problemId: 'global-event-sourcing',
  title: 'Design Global Event Sourcing System',
  description: 'Build a production event sourcing system with cross-region replication, CQRS, snapshots, and event versioning',
  difficulty: 'advanced',
  estimatedMinutes: 80,

  welcomeStory: {
    emoji: '🌍',
    hook: "You've been hired as Chief Architect at GlobalFinance Corp!",
    scenario: "Your mission: Build a global event sourcing system for a financial trading platform that processes 500,000 events/second across New York, London, and Tokyo with complete audit trail for regulatory compliance.",
    challenge: "Can you design a system that achieves sub-10ms writes, sub-100ms reads, and 7-year event retention at global scale?",
  },

  requirementsPhase: globalEventSourcingRequirementsPhase,

  steps: [step1, step2, step3, step4, step5, step6, step7, step8, step9, step10],

  concepts: [
    'Event Sourcing',
    'Append-Only Logs',
    'State Reconstruction',
    'Event Replay',
    'Snapshots',
    'Cross-Region Replication',
    'CQRS Pattern',
    'Materialized Views',
    'Event Versioning',
    'Event Distribution',
    'Eventual Consistency',
    'Causal Ordering',
    'Tiered Storage',
  ],

  ddiaReferences: [
    'Chapter 3: Storage and Retrieval (log-structured storage)',
    'Chapter 5: Replication (multi-datacenter)',
    'Chapter 9: Consistency and Consensus (ordering guarantees)',
    'Chapter 11: Stream Processing (event logs)',
  ],
};

export default globalEventSourcingGuidedTutorial;
