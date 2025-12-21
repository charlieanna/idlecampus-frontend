import { GuidedTutorial } from '../../types/guidedTutorial';

export const collaborativeEditorProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'collaborative-editor-progressive',
  title: 'Design a Collaborative Document Editor (Google Docs)',
  description: 'Build a real-time collaborative editor from single-user to globally distributed editing',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Implement real-time text synchronization',
    'Design conflict resolution with OT or CRDTs',
    'Build presence and cursor tracking',
    'Handle offline editing and sync',
    'Scale to millions of concurrent editors'
  ],
  prerequisites: ['Real-time systems', 'Distributed systems', 'Data structures'],
  tags: ['collaboration', 'real-time', 'crdt', 'ot', 'sync'],

  progressiveStory: {
    title: 'Collaborative Editor Evolution',
    premise: "You're building a collaborative document editor like Google Docs. Starting with basic text editing, you'll evolve to handle millions of concurrent editors with real-time sync and offline support.",
    phases: [
      { phase: 1, title: 'Single User Editor', description: 'Basic document editing and persistence' },
      { phase: 2, title: 'Real-Time Collaboration', description: 'Multiple users editing simultaneously' },
      { phase: 3, title: 'Rich Features', description: 'Formatting, comments, and history' },
      { phase: 4, title: 'Scale & Reliability', description: 'Offline, global distribution' }
    ]
  },

  steps: [
    // PHASE 1: Single User Editor (Steps 1-3)
    {
      id: 'step-1',
      title: 'Document Data Model',
      phase: 1,
      phaseTitle: 'Single User Editor',
      learningObjective: 'Design document storage structure',
      thinkingFramework: {
        framework: 'Structured vs Plain Text',
        approach: 'Rich text needs structure: paragraphs, spans with formatting. JSON tree or flat array of operations. Each element has ID for stable references.',
        keyInsight: 'Flat list of characters with attributes vs tree of nodes. Flat is simpler for OT/CRDT. Tree is better for complex formatting.'
      },
      requirements: {
        functional: [
          'Store document text content',
          'Support basic formatting (bold, italic)',
          'Assign unique IDs to document elements',
          'Track document metadata (title, owner, created)'
        ],
        nonFunctional: []
      },
      hints: [
        'Document: {id, title, content: [...], owner, version}',
        'Content options: string, [{char, attrs}], tree nodes',
        'Stable IDs: UUID or position-based (fractional indexing)'
      ],
      expectedComponents: ['Document Store', 'Content Model', 'ID Generator'],
      successCriteria: ['Documents created and stored', 'Formatting represented'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Edit Operations',
      phase: 1,
      phaseTitle: 'Single User Editor',
      learningObjective: 'Model user edits as operations',
      thinkingFramework: {
        framework: 'Operation-Based Editing',
        approach: 'Dont store full document on each change. Store operations: insert(pos, char), delete(pos), format(range, style). Replay operations to reconstruct document.',
        keyInsight: 'Operations enable: undo/redo, version history, collaboration sync. Foundation for everything else.'
      },
      requirements: {
        functional: [
          'Define insert, delete, format operations',
          'Apply operations to document state',
          'Store operations for history',
          'Support undo/redo via operation reversal'
        ],
        nonFunctional: [
          'Operation apply < 10ms'
        ]
      },
      hints: [
        'Insert: {type: "insert", pos, char, attrs}',
        'Delete: {type: "delete", pos, count}',
        'Inverse: insert ↔ delete for undo'
      ],
      expectedComponents: ['Operation Model', 'Operation Applier', 'Undo Stack'],
      successCriteria: ['Operations modify document', 'Undo/redo works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Document Persistence',
      phase: 1,
      phaseTitle: 'Single User Editor',
      learningObjective: 'Save and load documents reliably',
      thinkingFramework: {
        framework: 'Auto-Save Pattern',
        approach: 'Save on every change or debounced (every 2 seconds of inactivity). Store current state or operation log. Version for conflict detection.',
        keyInsight: 'Save both snapshot and operations. Snapshot for fast load, operations for history and sync. Periodic checkpointing.'
      },
      requirements: {
        functional: [
          'Auto-save documents periodically',
          'Save on explicit user action',
          'Load document state on open',
          'Handle save conflicts'
        ],
        nonFunctional: [
          'Auto-save debounce: 2 seconds',
          'Load time < 1 second for 100KB doc'
        ]
      },
      hints: [
        'Debounce: save 2s after last edit',
        'Optimistic concurrency: version check on save',
        'Snapshot: serialize current state periodically'
      ],
      expectedComponents: ['Auto-Saver', 'Document API', 'Conflict Resolver'],
      successCriteria: ['Documents saved reliably', 'No data loss'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Real-Time Collaboration (Steps 4-6)
    {
      id: 'step-4',
      title: 'Operational Transformation',
      phase: 2,
      phaseTitle: 'Real-Time Collaboration',
      learningObjective: 'Handle concurrent edits with OT',
      thinkingFramework: {
        framework: 'Transform for Concurrency',
        approach: 'Two users edit simultaneously. Each sends operation. Server transforms to account for concurrent changes. OT ensures convergence.',
        keyInsight: 'Transform(op1, op2) returns op1 adjusted for op2. If user A inserts at pos 5, user B inserts at pos 3, A needs to shift to pos 6.'
      },
      requirements: {
        functional: [
          'Transform concurrent insert operations',
          'Transform concurrent delete operations',
          'Ensure all clients converge to same state',
          'Handle operation ordering'
        ],
        nonFunctional: [
          'Transform < 1ms per operation'
        ]
      },
      hints: [
        'Transform(ins(5), ins(3)) = ins(6) if pos >= other_pos',
        'Transform(del(5), ins(3)) = del(6) if del_pos >= ins_pos',
        'Server is authority for operation order'
      ],
      expectedComponents: ['OT Engine', 'Transform Functions', 'Server Sequencer'],
      successCriteria: ['Concurrent edits merge correctly', 'All clients converge'],
      estimatedTime: '12 minutes'
    },
    {
      id: 'step-5',
      title: 'Real-Time Sync',
      phase: 2,
      phaseTitle: 'Real-Time Collaboration',
      learningObjective: 'Broadcast changes to all editors',
      thinkingFramework: {
        framework: 'WebSocket Broadcast',
        approach: 'Client sends operation to server. Server transforms, applies, broadcasts to all other clients. Optimistic local apply for responsiveness.',
        keyInsight: 'Optimistic UI: apply locally before server confirm. If server rejects, rollback. Users see instant feedback.'
      },
      requirements: {
        functional: [
          'Send local operations to server',
          'Receive and apply remote operations',
          'Handle network latency gracefully',
          'Reconnect and resync on disconnect'
        ],
        nonFunctional: [
          'Sync latency < 100ms',
          'Support 50 concurrent editors'
        ]
      },
      hints: [
        'WebSocket for bidirectional real-time',
        'Operation buffer for pending confirmation',
        'Resync: fetch ops since last known version'
      ],
      expectedComponents: ['WebSocket Server', 'Sync Client', 'Operation Buffer'],
      successCriteria: ['Changes sync in real-time', 'Reconnect works'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-6',
      title: 'Presence & Cursors',
      phase: 2,
      phaseTitle: 'Real-Time Collaboration',
      learningObjective: 'Show other users and their cursors',
      thinkingFramework: {
        framework: 'Ephemeral State',
        approach: 'Cursor position is transient, not persisted. Broadcast cursor updates to all users. Show colored cursors with user names.',
        keyInsight: 'Cursor updates are high-frequency but low-priority. Throttle to 10 updates/sec. Dont block document operations.'
      },
      requirements: {
        functional: [
          'Track users currently viewing document',
          'Show cursor positions for each user',
          'Display user name/avatar at cursor',
          'Update presence on join/leave'
        ],
        nonFunctional: [
          'Cursor update latency < 50ms'
        ]
      },
      hints: [
        'Presence: {user_id, cursor_pos, selection, color}',
        'Throttle cursor updates: max 10/sec',
        'Cursor position transforms with OT too'
      ],
      expectedComponents: ['Presence Service', 'Cursor Renderer', 'User List'],
      successCriteria: ['Cursors visible for all users', 'Presence accurate'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Rich Features (Steps 7-9)
    {
      id: 'step-7',
      title: 'Rich Text Formatting',
      phase: 3,
      phaseTitle: 'Rich Features',
      learningObjective: 'Support complex text formatting',
      thinkingFramework: {
        framework: 'Attribute-Based Formatting',
        approach: 'Each character or span has attributes: {bold: true, fontSize: 14}. Format operation toggles attributes on range. Overlapping formats merge.',
        keyInsight: 'Inline vs block formatting. Inline (bold) applies to characters. Block (heading) applies to paragraphs. Different operation types.'
      },
      requirements: {
        functional: [
          'Support inline formatting (bold, italic, underline)',
          'Support block formatting (headings, lists)',
          'Support hyperlinks',
          'Handle format operations in OT'
        ],
        nonFunctional: []
      },
      hints: [
        'Format op: {type: "format", range, attrs: {bold: true}}',
        'Character: {char, marks: ["bold", "link"]}',
        'OT: format transforms with insert/delete'
      ],
      expectedComponents: ['Format Engine', 'Mark Applier', 'Toolbar'],
      successCriteria: ['Formatting applies correctly', 'OT handles format ops'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Comments & Suggestions',
      phase: 3,
      phaseTitle: 'Rich Features',
      learningObjective: 'Enable discussion and review workflow',
      thinkingFramework: {
        framework: 'Anchored Annotations',
        approach: 'Comment anchored to text range. Range may move as document edited. Track range with markers that transform with OT.',
        keyInsight: 'Comments are out-of-band data. Dont modify document content. Store separately with range references. Resolve when accepted/rejected.'
      },
      requirements: {
        functional: [
          'Add comments on text selection',
          'Reply to comments (threads)',
          'Suggest edits (tracked changes)',
          'Resolve/accept/reject suggestions'
        ],
        nonFunctional: []
      },
      hints: [
        'Comment: {id, range: {start, end}, text, author, replies}',
        'Range markers transform with OT',
        'Suggestion: pending operation, accept = apply, reject = discard'
      ],
      expectedComponents: ['Comment Service', 'Range Tracker', 'Suggestion Manager'],
      successCriteria: ['Comments anchor correctly', 'Suggestions workflow works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Version History',
      phase: 3,
      phaseTitle: 'Rich Features',
      learningObjective: 'Track and restore document versions',
      thinkingFramework: {
        framework: 'Named Checkpoints',
        approach: 'Store periodic snapshots with all operations between. Named versions for milestones. Restore = load snapshot, apply ops.',
        keyInsight: 'Operation log grows unbounded. Checkpoint collapses history. Keep recent ops for undo, checkpoint older ones.'
      },
      requirements: {
        functional: [
          'Auto-save version checkpoints',
          'Allow manual "save version" with name',
          'Show version history timeline',
          'Restore any previous version'
        ],
        nonFunctional: [
          'Version history retained 30 days'
        ]
      },
      hints: [
        'Version: {id, doc_id, snapshot, timestamp, name?}',
        'Auto-checkpoint every 100 operations',
        'Restore: create new document from version snapshot'
      ],
      expectedComponents: ['Version Store', 'Checkpoint Manager', 'History UI'],
      successCriteria: ['Versions saved automatically', 'Restore works correctly'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale & Reliability (Steps 10-12)
    {
      id: 'step-10',
      title: 'Offline Editing',
      phase: 4,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Enable editing without network connection',
      thinkingFramework: {
        framework: 'Offline-First Architecture',
        approach: 'Store operations locally when offline. Sync when back online. CRDTs better than OT for offline (no server needed to transform).',
        keyInsight: 'CRDTs (Conflict-free Replicated Data Types) merge without coordination. Each operation is designed to commute. Eventual consistency guaranteed.'
      },
      requirements: {
        functional: [
          'Queue operations when offline',
          'Sync queued operations on reconnect',
          'Handle conflicts from long offline periods',
          'Show sync status to user'
        ],
        nonFunctional: [
          'Support 24 hours offline editing'
        ]
      },
      hints: [
        'CRDT: each char has unique ID (Lamport timestamp + client)',
        'Merge: union of all operations, ordered by ID',
        'Conflict: rare with CRDTs, just merge both versions'
      ],
      expectedComponents: ['Offline Store', 'Sync Queue', 'CRDT Engine', 'Status Indicator'],
      successCriteria: ['Offline editing works', 'Sync resolves conflicts'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Document Sharding',
      phase: 4,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Handle very large documents',
      thinkingFramework: {
        framework: 'Chunked Documents',
        approach: 'Large documents split into pages/sections. Each section syncs independently. Load only visible sections. Enables massive documents.',
        keyInsight: 'Book-length document: load chapter user is viewing. Other chapters load on demand. Reduces memory and sync overhead.'
      },
      requirements: {
        functional: [
          'Split document into independent sections',
          'Load sections on demand',
          'Sync sections independently',
          'Handle cross-section operations'
        ],
        nonFunctional: [
          'Support documents with 1000+ pages',
          'Initial load < 2 seconds regardless of size'
        ]
      },
      hints: [
        'Section: independent OT/CRDT state',
        'Lazy load: fetch section when scrolled into view',
        'Cross-section: move content = delete from A, insert to B'
      ],
      expectedComponents: ['Section Manager', 'Lazy Loader', 'Cross-Section Handler'],
      successCriteria: ['Large documents performant', 'Sections sync independently'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Global Distribution',
      phase: 4,
      phaseTitle: 'Scale & Reliability',
      learningObjective: 'Scale to millions of concurrent documents',
      thinkingFramework: {
        framework: 'Regional Collaboration Servers',
        approach: 'Users connect to nearest region. Regions sync with each other. Document ownership can migrate. Handle cross-region latency.',
        keyInsight: 'CRDTs enable multi-master. Each region accepts writes, merges eventually. OT needs single authority (more complex for multi-region).'
      },
      requirements: {
        functional: [
          'Route users to nearest region',
          'Sync document state across regions',
          'Handle region failures gracefully',
          'Minimize cross-region latency impact'
        ],
        nonFunctional: [
          'Support 1M concurrent documents',
          'Cross-region sync < 500ms'
        ]
      },
      hints: [
        'CRDT: each region is peer, async merge',
        'OT: primary region, replicas forward ops',
        'Conflict-free: CRDTs guarantee eventual consistency'
      ],
      expectedComponents: ['Region Router', 'Cross-Region Sync', 'Failover Manager'],
      successCriteria: ['Global editing works', 'Region failure handled'],
      estimatedTime: '10 minutes'
    }
  ]
};
