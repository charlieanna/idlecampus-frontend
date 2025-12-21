import { GuidedTutorial } from '../../types/guidedTutorial';

export const eventSourcingCqrsProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'event-sourcing-cqrs-progressive',
  title: 'Design an Event Sourcing & CQRS System',
  description: 'Build an event-driven architecture from simple event log to full CQRS with projections',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design immutable event logs as source of truth',
    'Implement aggregate roots and event handlers',
    'Build read models with projections',
    'Separate command and query responsibilities',
    'Scale event stores for high throughput'
  ],
  prerequisites: ['DDD basics', 'Database design', 'Message queues'],
  tags: ['event-sourcing', 'cqrs', 'ddd', 'architecture', 'event-driven'],

  progressiveStory: {
    title: 'Event Sourcing Evolution',
    premise: "You're building an event-sourced system for a complex domain. Starting with simple event logging, you'll evolve to full CQRS with multiple read models, event replay, and temporal queries.",
    phases: [
      { phase: 1, title: 'Event Log', description: 'Immutable event storage' },
      { phase: 2, title: 'Aggregates', description: 'Domain modeling with events' },
      { phase: 3, title: 'CQRS', description: 'Separate read and write models' },
      { phase: 4, title: 'Advanced Patterns', description: 'Sagas, snapshots, and scale' }
    ]
  },

  steps: [
    // PHASE 1: Event Log (Steps 1-3)
    {
      id: 'step-1',
      title: 'Event Store Design',
      phase: 1,
      phaseTitle: 'Event Log',
      learningObjective: 'Design immutable event storage',
      thinkingFramework: {
        framework: 'Append-Only Log',
        approach: 'Events are immutable facts. Never update, only append. Each event has: aggregate ID, type, data, timestamp, sequence. Order matters.',
        keyInsight: 'Event store is append-only. No updates, no deletes. To \"undo\", append compensating event. History is preserved forever.'
      },
      requirements: {
        functional: [
          'Append events to stream',
          'Events are immutable',
          'Assign sequential ID per stream',
          'Read events by stream ID'
        ],
        nonFunctional: [
          'Append latency < 10ms',
          'Strong ordering within stream'
        ]
      },
      hints: [
        'Event: {id, stream_id, type, data, timestamp, version}',
        'Stream: all events for one aggregate (e.g., Order-123)',
        'Version: sequential within stream (0, 1, 2, ...)'
      ],
      expectedComponents: ['Event Store', 'Event', 'Stream'],
      successCriteria: ['Events appended correctly', 'Order preserved'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Event Schema & Serialization',
      phase: 1,
      phaseTitle: 'Event Log',
      learningObjective: 'Define and evolve event schemas',
      thinkingFramework: {
        framework: 'Schema Evolution',
        approach: 'Events are forever. Schema must evolve without breaking old events. Add optional fields, never remove. Version events if breaking change needed.',
        keyInsight: 'Old code must read new events (forward compat). New code must read old events (backward compat). Design for both from day one.'
      },
      requirements: {
        functional: [
          'Define event types with schema',
          'Serialize events to JSON/binary',
          'Handle schema versioning',
          'Support upcasting old events'
        ],
        nonFunctional: [
          'Serialization < 1ms per event'
        ]
      },
      hints: [
        'Event type: \"OrderPlaced\", \"OrderShipped\"',
        'Schema: define required/optional fields',
        'Upcast: transform v1 event to v2 format on read'
      ],
      expectedComponents: ['Event Schema', 'Serializer', 'Upcaster'],
      successCriteria: ['Events serialized correctly', 'Old events still readable'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Event Subscription',
      phase: 1,
      phaseTitle: 'Event Log',
      learningObjective: 'Subscribe to event streams',
      thinkingFramework: {
        framework: 'Catch-Up Subscription',
        approach: 'Subscribe from position (all events since X). Real-time: new events pushed. Catch-up: read historical, then switch to live. Position tracking.',
        keyInsight: 'Subscriber tracks its position. Restart from last position to avoid duplicates. Idempotent handlers allow reprocessing.'
      },
      requirements: {
        functional: [
          'Subscribe to all events from position',
          'Subscribe to specific stream',
          'Persistent subscription position',
          'Handle subscriber failures'
        ],
        nonFunctional: [
          'Subscription latency < 100ms for new events'
        ]
      },
      hints: [
        'Subscription: {id, stream_pattern, position, handler}',
        'Position: global sequence number or per-stream version',
        'Checkpoint: save position after processing batch'
      ],
      expectedComponents: ['Subscription Manager', 'Position Tracker', 'Event Dispatcher'],
      successCriteria: ['Subscriptions receive events', 'Positions tracked'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Aggregates (Steps 4-6)
    {
      id: 'step-4',
      title: 'Aggregate Root',
      phase: 2,
      phaseTitle: 'Aggregates',
      learningObjective: 'Model domain with aggregate roots',
      thinkingFramework: {
        framework: 'Event-Sourced Aggregates',
        approach: 'Aggregate = consistency boundary. State reconstructed from events. Commands produce events. Events mutate state. No direct state mutation.',
        keyInsight: 'Aggregate state is derived, not stored. Load: replay all events. Save: append new events. State = fold(events, initial).'
      },
      requirements: {
        functional: [
          'Define aggregate with state',
          'Reconstruct state from events',
          'Apply events to mutate state',
          'Emit events from commands'
        ],
        nonFunctional: [
          'State reconstruction < 50ms for 1000 events'
        ]
      },
      hints: [
        'Aggregate: {id, version, state, uncommittedEvents}',
        'Load: events = store.read(id); state = replay(events)',
        'Apply: event → state mutation (no side effects)'
      ],
      expectedComponents: ['Aggregate Root', 'State Folder', 'Event Applicator'],
      successCriteria: ['Aggregates load from events', 'Commands produce events'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Command Handling',
      phase: 2,
      phaseTitle: 'Aggregates',
      learningObjective: 'Process commands and enforce invariants',
      thinkingFramework: {
        framework: 'Command → Events',
        approach: 'Command is intent (PlaceOrder). Handler loads aggregate, validates, produces events. Aggregate enforces invariants. Events are facts.',
        keyInsight: 'Validation in command handler. If invariant violated, reject command (no events). Only valid commands produce events.'
      },
      requirements: {
        functional: [
          'Receive and validate commands',
          'Load aggregate for command',
          'Enforce business invariants',
          'Append resulting events'
        ],
        nonFunctional: [
          'Command processing < 100ms'
        ]
      },
      hints: [
        'Command: {type, aggregateId, data}',
        'Handler: load aggregate, call method, save events',
        'Invariant: order.cancel() fails if already shipped'
      ],
      expectedComponents: ['Command Handler', 'Command Validator', 'Invariant Checker'],
      successCriteria: ['Commands validated', 'Invariants enforced'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Optimistic Concurrency',
      phase: 2,
      phaseTitle: 'Aggregates',
      learningObjective: 'Handle concurrent modifications',
      thinkingFramework: {
        framework: 'Version-Based Concurrency',
        approach: 'Load aggregate at version N. Append events with expected version N. Fail if current version != N (concurrent modification). Retry or fail.',
        keyInsight: 'No locks needed. Optimistic: assume no conflict, detect on save. Most domains have low contention. Conflicts are retried or rejected.'
      },
      requirements: {
        functional: [
          'Track aggregate version',
          'Append with expected version',
          'Detect concurrent modifications',
          'Handle conflicts (retry or reject)'
        ],
        nonFunctional: [
          'Conflict detection atomic'
        ]
      },
      hints: [
        'Append: INSERT events WHERE version = expected',
        'Conflict: WrongExpectedVersion exception',
        'Retry: reload aggregate, rerun command, try again'
      ],
      expectedComponents: ['Version Tracker', 'Conflict Detector', 'Retry Handler'],
      successCriteria: ['Concurrency conflicts detected', 'Data consistent'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: CQRS (Steps 7-9)
    {
      id: 'step-7',
      title: 'Read Model Projections',
      phase: 3,
      phaseTitle: 'CQRS',
      learningObjective: 'Build optimized read models from events',
      thinkingFramework: {
        framework: 'Derived Read Models',
        approach: 'Subscribe to events, update read-optimized model. SQL table, ElasticSearch, Redis - whatever serves queries best. Separate from write model.',
        keyInsight: 'One event stream, many read models. OrderPlaced → update order list, update customer history, update sales report. Each optimized for its query.'
      },
      requirements: {
        functional: [
          'Project events to read model',
          'Multiple read models from same events',
          'Rebuild projection from scratch',
          'Handle projection failures'
        ],
        nonFunctional: [
          'Projection lag < 1 second',
          'Full rebuild < 1 hour for 1M events'
        ]
      },
      hints: [
        'Projection: {name, position, handler, store}',
        'Handler: switch(event.type) { OrderPlaced: insert, OrderShipped: update }',
        'Rebuild: truncate read model, replay all events'
      ],
      expectedComponents: ['Projection Engine', 'Read Model Store', 'Rebuild Manager'],
      successCriteria: ['Read models updated', 'Rebuilds work'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Query Service',
      phase: 3,
      phaseTitle: 'CQRS',
      learningObjective: 'Serve queries from read models',
      thinkingFramework: {
        framework: 'Optimized Queries',
        approach: 'Queries hit read models, not event store. Each query served by purpose-built model. Denormalized for fast reads. Eventually consistent with writes.',
        keyInsight: 'CQRS tradeoff: eventual consistency for scalability. Read and write can scale independently. Accept query results may be slightly stale.'
      },
      requirements: {
        functional: [
          'Query read models directly',
          'Support complex queries (filter, sort, page)',
          'Multiple query endpoints',
          'Indicate data freshness'
        ],
        nonFunctional: [
          'Query latency < 50ms',
          'Consistency lag < 2 seconds'
        ]
      },
      hints: [
        'Query: SQL against read model, not event store',
        'Pagination: offset/limit or cursor-based',
        'Freshness: include projection_position in response'
      ],
      expectedComponents: ['Query Handler', 'Read Model Repository', 'Pagination'],
      successCriteria: ['Queries fast', 'Data fresh'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-9',
      title: 'Event Handlers & Side Effects',
      phase: 3,
      phaseTitle: 'CQRS',
      learningObjective: 'Trigger actions from events',
      thinkingFramework: {
        framework: 'Event-Driven Side Effects',
        approach: 'Events trigger: projections, notifications, integrations. Handler subscribes, performs action. Idempotent handlers for safe replay.',
        keyInsight: 'Side effects must be idempotent. Event replayed = same outcome. Use idempotency keys, check-then-act, or naturally idempotent operations.'
      },
      requirements: {
        functional: [
          'Subscribe handlers to event types',
          'Trigger notifications on events',
          'Integrate with external systems',
          'Handle failures with retry'
        ],
        nonFunctional: [
          'Handler processing < 1 second',
          'Retry with exponential backoff'
        ]
      },
      hints: [
        'Handler: on(OrderShipped) → send email, update inventory',
        'Idempotency: check if email already sent for event_id',
        'Outbox: store side effect intent, process separately'
      ],
      expectedComponents: ['Event Handler', 'Notification Service', 'Integration Adapter'],
      successCriteria: ['Handlers triggered correctly', 'Side effects idempotent'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Advanced Patterns (Steps 10-12)
    {
      id: 'step-10',
      title: 'Snapshots',
      phase: 4,
      phaseTitle: 'Advanced Patterns',
      learningObjective: 'Optimize aggregate loading with snapshots',
      thinkingFramework: {
        framework: 'State Checkpoints',
        approach: 'Long-lived aggregates have many events. Snapshot = serialized state at version N. Load: read snapshot, replay events since N. Much faster.',
        keyInsight: 'Snapshot every N events (100, 1000). Still replay events since snapshot. Tradeoff: snapshot storage vs load time.'
      },
      requirements: {
        functional: [
          'Create snapshot of aggregate state',
          'Load from snapshot + recent events',
          'Snapshot on threshold (every N events)',
          'Handle snapshot versioning'
        ],
        nonFunctional: [
          'Load with snapshot < 10ms',
          'Snapshot every 100 events'
        ]
      },
      hints: [
        'Snapshot: {aggregate_id, version, state, timestamp}',
        'Load: snapshot at v100 + events 101-150 → state at v150',
        'Version: snapshot format may change, handle old formats'
      ],
      expectedComponents: ['Snapshot Store', 'Snapshot Creator', 'Hybrid Loader'],
      successCriteria: ['Snapshots created', 'Loading faster'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Process Managers & Sagas',
      phase: 4,
      phaseTitle: 'Advanced Patterns',
      learningObjective: 'Coordinate long-running processes',
      thinkingFramework: {
        framework: 'Distributed Workflow',
        approach: 'Saga coordinates across aggregates. Receives events, sends commands. Maintains state of long-running process. Handles compensation on failure.',
        keyInsight: 'Saga is event-sourced too. SagaStarted, StepCompleted, SagaCompleted events. On failure, compensating events undo previous steps.'
      },
      requirements: {
        functional: [
          'Define multi-step process',
          'React to events with commands',
          'Track process state',
          'Compensate on failure'
        ],
        nonFunctional: [
          'Saga completion < timeout (configurable)'
        ]
      },
      hints: [
        'Saga: {id, state, completed_steps, pending_steps}',
        'OrderSaga: OrderPlaced → ReserveInventory → ProcessPayment → ShipOrder',
        'Compensation: PaymentFailed → ReleaseInventory'
      ],
      expectedComponents: ['Saga Orchestrator', 'Step Handler', 'Compensation Manager'],
      successCriteria: ['Sagas coordinate correctly', 'Failures compensated'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Temporal Queries & Audit',
      phase: 4,
      phaseTitle: 'Advanced Patterns',
      learningObjective: 'Query state at any point in time',
      thinkingFramework: {
        framework: 'Time Travel',
        approach: 'Replay events up to timestamp T → state at time T. Temporal projections for time-based queries. Complete audit trail built-in.',
        keyInsight: 'Event sourcing enables \"time travel\". What was account balance on Jan 1? Replay events up to Jan 1. Perfect for audit and debugging.'
      },
      requirements: {
        functional: [
          'Query aggregate state at past time',
          'Temporal projections (state over time)',
          'Audit trail of all changes',
          'Compliance reporting'
        ],
        nonFunctional: [
          'Temporal query < 1 second for 10K events'
        ]
      },
      hints: [
        'Replay: events.where(timestamp <= T).fold(state)',
        'Temporal projection: store state snapshots at intervals',
        'Audit: event log is complete audit trail, add actor info'
      ],
      expectedComponents: ['Temporal Query', 'Audit Reporter', 'Time-Based Projection'],
      successCriteria: ['Past state queryable', 'Audit complete'],
      estimatedTime: '8 minutes'
    }
  ]
};
