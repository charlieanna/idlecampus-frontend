import { GuidedTutorial } from '../../types/guidedTutorial';

export const trelloProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'trello-progressive',
  title: 'Design Trello',
  description: 'Build a kanban board from simple lists to real-time collaborative project management',
  difficulty: 'medium',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design drag-and-drop kanban boards',
    'Implement real-time collaboration',
    'Build flexible card system with attachments',
    'Handle permissions and team workspaces',
    'Scale for millions of boards'
  ],
  prerequisites: ['Real-time systems', 'Drag-and-drop UI', 'Collaboration'],
  tags: ['kanban', 'project-management', 'collaboration', 'real-time', 'productivity'],

  progressiveStory: {
    title: 'Trello Evolution',
    premise: "You're building a visual project management tool. Starting with simple lists and cards, you'll evolve to support real-time collaboration, power-ups, and team workspaces.",
    phases: [
      { phase: 1, title: 'Boards & Cards', description: 'Basic kanban' },
      { phase: 2, title: 'Real-Time', description: 'Live collaboration' },
      { phase: 3, title: 'Features', description: 'Power-ups and automation' },
      { phase: 4, title: 'Teams', description: 'Workspaces and scale' }
    ]
  },

  steps: [
    // PHASE 1: Boards & Cards (Steps 1-3)
    {
      id: 'step-1',
      title: 'Board and List Model',
      phase: 1,
      phaseTitle: 'Boards & Cards',
      learningObjective: 'Create boards with ordered lists',
      thinkingFramework: {
        framework: 'Hierarchical Structure',
        approach: 'Board contains lists. Lists contain cards. Each has position for ordering. Drag-and-drop reorders by updating positions.',
        keyInsight: 'Position ordering is tricky. Dont use integers (reorder requires updating many rows). Use fractional ranking or position strings.'
      },
      requirements: {
        functional: [
          'Create boards with title and background',
          'Add lists to boards',
          'Reorder lists via drag-and-drop',
          'Archive and delete lists'
        ],
        nonFunctional: [
          'Board load < 500ms',
          'Reorder < 100ms'
        ]
      },
      hints: [
        'Board: {id, name, background, owner_id, visibility}',
        'List: {id, board_id, name, position, archived}',
        'Position: use lexicographic strings (a, b, c... or fractional)'
      ],
      expectedComponents: ['Board Store', 'List Manager', 'Position Handler'],
      successCriteria: ['Boards created', 'Lists reorderable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Card System',
      phase: 1,
      phaseTitle: 'Boards & Cards',
      learningObjective: 'Create cards with rich content',
      thinkingFramework: {
        framework: 'Flexible Content',
        approach: 'Card = unit of work. Title required, description optional. Due dates, labels, members. Cards move between lists (workflow stages).',
        keyInsight: 'Cards are the core object. Everything attaches to cards. Keep card model flexible for future features. Markdown for descriptions.'
      },
      requirements: {
        functional: [
          'Create cards in lists',
          'Add descriptions (markdown)',
          'Set due dates',
          'Move cards between lists'
        ],
        nonFunctional: [
          'Card create < 200ms',
          'Card move < 100ms'
        ]
      },
      hints: [
        'Card: {id, list_id, title, description, position, due_date, created_at}',
        'Move: update list_id and position atomically',
        'Description: markdown with preview'
      ],
      expectedComponents: ['Card Store', 'Card Editor', 'Move Handler'],
      successCriteria: ['Cards created', 'Moving works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Labels and Members',
      phase: 1,
      phaseTitle: 'Boards & Cards',
      learningObjective: 'Categorize cards and assign ownership',
      thinkingFramework: {
        framework: 'Card Metadata',
        approach: 'Labels = colored tags for categorization. Members = assigned users. Both are many-to-many with cards. Filter board by label/member.',
        keyInsight: 'Labels are board-scoped. Define labels on board, apply to cards. Members are board-scoped too. Cant assign non-board-member to card.'
      },
      requirements: {
        functional: [
          'Create labels with colors and names',
          'Apply labels to cards',
          'Assign members to cards',
          'Filter by label/member'
        ],
        nonFunctional: [
          'Label application < 100ms',
          'Filter update instant'
        ]
      },
      hints: [
        'Label: {id, board_id, name, color}',
        'Card-Label: {card_id, label_id}',
        'Card-Member: {card_id, user_id}'
      ],
      expectedComponents: ['Label Manager', 'Member Assignment', 'Filter Engine'],
      successCriteria: ['Labels work', 'Assignments work'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Real-Time (Steps 4-6)
    {
      id: 'step-4',
      title: 'Real-Time Updates',
      phase: 2,
      phaseTitle: 'Real-Time',
      learningObjective: 'Sync changes across all viewers',
      thinkingFramework: {
        framework: 'Live Collaboration',
        approach: 'WebSocket connection per board viewer. Broadcast changes to all. Optimistic UI with reconciliation. Handle conflicts.',
        keyInsight: 'Real-time is what makes Trello collaborative. See teammates move cards instantly. Optimistic update first, then confirm or rollback.'
      },
      requirements: {
        functional: [
          'WebSocket connection per board',
          'Broadcast changes to viewers',
          'Optimistic UI updates',
          'Handle conflicting edits'
        ],
        nonFunctional: [
          'Update propagation < 200ms',
          'Reconnect on disconnect'
        ]
      },
      hints: [
        'Events: card_created, card_moved, list_added, etc.',
        'Room: board_id as channel, subscribers receive events',
        'Conflict: last-write-wins or operational transform'
      ],
      expectedComponents: ['WebSocket Server', 'Event Broadcaster', 'Conflict Resolver'],
      successCriteria: ['Changes sync instantly', 'Conflicts handled'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Activity Feed',
      phase: 2,
      phaseTitle: 'Real-Time',
      learningObjective: 'Track all board activity',
      thinkingFramework: {
        framework: 'Audit Log',
        approach: 'Record every action: who did what when. Show in card detail and board sidebar. Notifications for watched cards.',
        keyInsight: 'Activity is accountability. Who moved this card? When was due date changed? Essential for team coordination and debugging workflow.'
      },
      requirements: {
        functional: [
          'Log all card/list/board actions',
          'Show activity on card detail',
          'Board-level activity feed',
          'Filter by action type'
        ],
        nonFunctional: [
          'Activity write < 50ms (async ok)',
          'Load last 50 activities'
        ]
      },
      hints: [
        'Activity: {id, board_id, card_id, user_id, action, data, timestamp}',
        'Actions: created, moved, updated, commented, attached',
        'Data: {from_list, to_list} for moves, {field, old, new} for updates'
      ],
      expectedComponents: ['Activity Logger', 'Activity Feed', 'Notification Trigger'],
      successCriteria: ['Actions logged', 'Feed displays correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Comments and Mentions',
      phase: 2,
      phaseTitle: 'Real-Time',
      learningObjective: 'Enable discussion on cards',
      thinkingFramework: {
        framework: 'Card Discussion',
        approach: 'Comments on cards for discussion. @mentions notify users. Reactions for quick feedback. Edit/delete own comments.',
        keyInsight: 'Cards are discussion threads. Comments keep context with the work. Mentions pull in relevant people. Async communication hub.'
      },
      requirements: {
        functional: [
          'Comment on cards',
          '@mention users in comments',
          'Edit and delete comments',
          'React to comments'
        ],
        nonFunctional: [
          'Comment post < 200ms',
          'Mention notification instant'
        ]
      },
      hints: [
        'Comment: {id, card_id, user_id, body, created_at, edited_at}',
        'Mentions: parse @username, link to user, notify',
        'Reactions: emoji reactions to comments'
      ],
      expectedComponents: ['Comment Store', 'Mention Parser', 'Notification Service'],
      successCriteria: ['Comments work', 'Mentions notify'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Features (Steps 7-9)
    {
      id: 'step-7',
      title: 'Checklists and Attachments',
      phase: 3,
      phaseTitle: 'Features',
      learningObjective: 'Add subtasks and files to cards',
      thinkingFramework: {
        framework: 'Card Extensions',
        approach: 'Checklists = subtasks within card. Attachments = files, links, images. Progress tracking. Cover images.',
        keyInsight: 'Checklists break down work. Show completion percentage on card. Attachments keep files with context. Cover image for visual boards.'
      },
      requirements: {
        functional: [
          'Add checklists with items',
          'Track checklist completion',
          'Upload file attachments',
          'Set cover image from attachment'
        ],
        nonFunctional: [
          'File upload: up to 10MB',
          'Progress calculation instant'
        ]
      },
      hints: [
        'Checklist: {id, card_id, name, items: [{name, checked}]}',
        'Attachment: {id, card_id, filename, url, type, uploaded_by}',
        'Progress: checked_count / total_count per checklist'
      ],
      expectedComponents: ['Checklist Manager', 'File Uploader', 'Cover Handler'],
      successCriteria: ['Checklists track progress', 'Files attached'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Power-Ups (Integrations)',
      phase: 3,
      phaseTitle: 'Features',
      learningObjective: 'Extend boards with third-party integrations',
      thinkingFramework: {
        framework: 'Plugin Architecture',
        approach: 'Power-ups add features: calendar view, voting, time tracking. Third-party or built-in. Enable per board. API for custom power-ups.',
        keyInsight: 'Core product is simple. Power-ups add complexity for those who need it. Keeps base product clean while enabling advanced use cases.'
      },
      requirements: {
        functional: [
          'Enable power-ups per board',
          'Calendar power-up (due dates)',
          'Voting power-up (card votes)',
          'Custom fields power-up'
        ],
        nonFunctional: [
          'Power-up load < 500ms',
          'Isolated execution'
        ]
      },
      hints: [
        'Power-up: {id, name, capabilities: [card_badges, board_buttons, etc]}',
        'Enable: {board_id, powerup_id, settings}',
        'API: iframe-based with postMessage communication'
      ],
      expectedComponents: ['Power-Up Manager', 'Plugin Host', 'Settings Store'],
      successCriteria: ['Power-ups work', 'Extend functionality'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Automation (Butler)',
      phase: 3,
      phaseTitle: 'Features',
      learningObjective: 'Automate repetitive actions',
      thinkingFramework: {
        framework: 'Rule-Based Automation',
        approach: 'Trigger → condition → action. When card moved to Done → mark complete. Schedule-based rules. Natural language rule builder.',
        keyInsight: 'Automation removes toil. Common patterns: move to done → archive after X days, due date approaching → add label. User-defined rules.'
      },
      requirements: {
        functional: [
          'Create automation rules',
          'Trigger types: card move, due date, schedule',
          'Actions: move, label, assign, comment',
          'Natural language rule builder'
        ],
        nonFunctional: [
          'Rule execution < 1 second',
          'Rules per board: 100'
        ]
      },
      hints: [
        'Rule: {trigger, conditions: [], actions: []}',
        'Trigger: card_moved, due_date_reached, schedule_cron',
        'Action: {type: move_card, params: {list_id}}'
      ],
      expectedComponents: ['Rule Engine', 'Trigger Listener', 'Action Executor'],
      successCriteria: ['Rules execute', 'Automation saves time'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Teams (Steps 10-12)
    {
      id: 'step-10',
      title: 'Workspaces and Teams',
      phase: 4,
      phaseTitle: 'Teams',
      learningObjective: 'Organize boards into team workspaces',
      thinkingFramework: {
        framework: 'Team Organization',
        approach: 'Workspace = team container. Contains boards and members. Workspace settings inherited by boards. Billing at workspace level.',
        keyInsight: 'Workspaces aggregate boards for teams. Single place to manage members. Visibility controls: workspace-visible boards. Enterprise needs.'
      },
      requirements: {
        functional: [
          'Create workspaces',
          'Add boards to workspaces',
          'Manage workspace members',
          'Workspace-level settings'
        ],
        nonFunctional: [
          'Workspace can have 1000s of boards'
        ]
      },
      hints: [
        'Workspace: {id, name, members: [{user_id, role}]}',
        'Board: {workspace_id, ...} - belongs to workspace',
        'Roles: admin, normal, observer'
      ],
      expectedComponents: ['Workspace Manager', 'Member Management', 'Settings Service'],
      successCriteria: ['Workspaces organize boards', 'Members managed'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Permissions and Visibility',
      phase: 4,
      phaseTitle: 'Teams',
      learningObjective: 'Control access to boards and cards',
      thinkingFramework: {
        framework: 'Access Control',
        approach: 'Board visibility: private, workspace, public. Member roles: admin, member, observer. Card-level permissions for sensitive content.',
        keyInsight: 'Default should be secure. Workspace boards visible to workspace. Explicit sharing for external. Observer cant modify.'
      },
      requirements: {
        functional: [
          'Set board visibility',
          'Assign member roles',
          'Invite external collaborators',
          'Observer (read-only) role'
        ],
        nonFunctional: [
          'Permission check < 10ms'
        ]
      },
      hints: [
        'Visibility: private (members only), workspace (all ws members), public',
        'Board member: {board_id, user_id, role: admin|normal|observer}',
        'Permission: check user.role for write operations'
      ],
      expectedComponents: ['Permission Checker', 'Role Manager', 'Invite System'],
      successCriteria: ['Visibility enforced', 'Roles work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Scale and Performance',
      phase: 4,
      phaseTitle: 'Teams',
      learningObjective: 'Handle millions of boards and users',
      thinkingFramework: {
        framework: 'Efficient Data Loading',
        approach: 'Load board data in one request. Lazy load card details. WebSocket connection pooling. Cache frequently accessed boards.',
        keyInsight: 'Board load must be fast. One query for lists + cards (no N+1). Card details load on open. WebSockets per board, not global.'
      },
      requirements: {
        functional: [
          'Efficient board data loading',
          'Lazy load card details',
          'WebSocket scaling',
          'Board caching'
        ],
        nonFunctional: [
          'Board load < 1 second',
          'Support 100K concurrent board viewers'
        ]
      },
      hints: [
        'Board load: JOIN lists and cards in one query',
        'Card detail: load attachments, checklists, activity on expand',
        'WebSocket: shard by board_id, horizontal scale'
      ],
      expectedComponents: ['Data Loader', 'WebSocket Cluster', 'Board Cache'],
      successCriteria: ['Fast loads', 'Scales horizontally'],
      estimatedTime: '8 minutes'
    }
  ]
};
