import { GuidedTutorial } from '../../types/guidedTutorial';

export const notionProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'notion-progressive',
  title: 'Design Notion',
  description: 'Build an all-in-one workspace from documents to databases with real-time collaboration',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design block-based content model',
    'Implement flexible databases with views',
    'Build real-time collaborative editing',
    'Handle nested pages and linking',
    'Scale workspace organization'
  ],
  prerequisites: ['Document systems', 'Database design', 'Real-time collaboration'],
  tags: ['workspace', 'documents', 'databases', 'collaboration', 'blocks'],

  progressiveStory: {
    title: 'Notion Evolution',
    premise: "You're building an all-in-one workspace tool. Starting with a block-based document editor, you'll evolve to support databases, templates, real-time collaboration, and team workspaces.",
    phases: [
      { phase: 1, title: 'Blocks', description: 'Content building blocks' },
      { phase: 2, title: 'Databases', description: 'Structured data with views' },
      { phase: 3, title: 'Collaboration', description: 'Real-time and sharing' },
      { phase: 4, title: 'Workspace', description: 'Teams and scale' }
    ]
  },

  steps: [
    // PHASE 1: Blocks (Steps 1-3)
    {
      id: 'step-1',
      title: 'Block-Based Content Model',
      phase: 1,
      phaseTitle: 'Blocks',
      learningObjective: 'Store content as composable blocks',
      thinkingFramework: {
        framework: 'Block Tree',
        approach: 'Everything is a block. Blocks have type and content. Blocks can contain other blocks (nesting). Page is root block containing children.',
        keyInsight: 'Blocks enable flexibility. Same system for text, images, embeds, databases. Drag to rearrange. Transform block types. Composition over structure.'
      },
      requirements: {
        functional: [
          'Create blocks of various types',
          'Nest blocks within blocks',
          'Reorder blocks via drag-drop',
          'Transform block types'
        ],
        nonFunctional: [
          'Block operations < 50ms',
          'Deep nesting (10+ levels)'
        ]
      },
      hints: [
        'Block: {id, type, content, children: [block_ids], parent_id}',
        'Types: paragraph, heading, bullet, numbered, todo, toggle, quote',
        'Page: special block with title, icon, cover'
      ],
      expectedComponents: ['Block Store', 'Block Renderer', 'Tree Manager'],
      successCriteria: ['Blocks create and nest', 'Types work'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-2',
      title: 'Rich Text and Formatting',
      phase: 1,
      phaseTitle: 'Blocks',
      learningObjective: 'Support inline formatting within blocks',
      thinkingFramework: {
        framework: 'Inline Annotations',
        approach: 'Text content with inline styles. Bold, italic, code, links as annotations on ranges. Mentions for users and pages. Equations.',
        keyInsight: 'Separate structure (blocks) from formatting (inline). Text block content = array of text runs with annotations. Enables selective formatting.'
      },
      requirements: {
        functional: [
          'Bold, italic, underline, strikethrough',
          'Inline code and links',
          '@mentions for users and pages',
          'LaTeX equations'
        ],
        nonFunctional: [
          'Formatting instant',
          'Render < 16ms (60fps)'
        ]
      },
      hints: [
        'Text: [{text: "Hello ", annotations: []}, {text: "world", annotations: [bold]}]',
        'Annotations: bold, italic, code, link, color, mention',
        'Mention: @page or @user, resolves to link'
      ],
      expectedComponents: ['Text Renderer', 'Annotation Handler', 'Mention Resolver'],
      successCriteria: ['Formatting works', 'Mentions resolve'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Media and Embeds',
      phase: 1,
      phaseTitle: 'Blocks',
      learningObjective: 'Embed rich media in documents',
      thinkingFramework: {
        framework: 'Embed Blocks',
        approach: 'Images, videos, files as blocks. External embeds (YouTube, Twitter, Figma). Upload handling with preview. Responsive sizing.',
        keyInsight: 'Embeds are blocks with external content. Parse URLs to detect embed type. oEmbed protocol for third-party. Fallback to link card.'
      },
      requirements: {
        functional: [
          'Image and video blocks',
          'File attachments',
          'External embeds (YouTube, etc)',
          'Embed from URL paste'
        ],
        nonFunctional: [
          'Upload < 3 seconds',
          'Embed load < 1 second'
        ]
      },
      hints: [
        'Image: {type: image, url, width, caption}',
        'Embed: {type: embed, url, provider, html} - oEmbed response',
        'URL paste: detect supported embeds, create appropriate block'
      ],
      expectedComponents: ['Media Handler', 'Embed Parser', 'Upload Service'],
      successCriteria: ['Media embeds', 'URLs auto-embed'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Databases (Steps 4-6)
    {
      id: 'step-4',
      title: 'Database Pages',
      phase: 2,
      phaseTitle: 'Databases',
      learningObjective: 'Create structured data collections',
      thinkingFramework: {
        framework: 'Flexible Schema',
        approach: 'Database = collection of pages with properties. Properties are columns (text, number, select, date, etc). Each row is a full page.',
        keyInsight: 'Notion databases are unique - each row is a page with content. Properties are metadata on pages. Combines spreadsheet flexibility with document richness.'
      },
      requirements: {
        functional: [
          'Create database with properties',
          'Add property types (text, number, select, date)',
          'Add rows (pages with properties)',
          'Edit properties inline'
        ],
        nonFunctional: [
          'Support 10K+ rows',
          'Property add < 100ms'
        ]
      },
      hints: [
        'Database: {id, schema: [{name, type, options}], rows: [page_ids]}',
        'Property types: text, number, select, multi_select, date, person, relation',
        'Page: has block content + property values'
      ],
      expectedComponents: ['Database Store', 'Schema Manager', 'Property Editor'],
      successCriteria: ['Databases create', 'Properties work'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Database Views',
      phase: 2,
      phaseTitle: 'Databases',
      learningObjective: 'Display same data in different layouts',
      thinkingFramework: {
        framework: 'View Configurations',
        approach: 'Same database, multiple views. Table, board, list, calendar, gallery. Each view has filter, sort, visible properties. Saved configurations.',
        keyInsight: 'Data stays same, presentation changes. Project tracker: board for sprints, calendar for deadlines, table for all details. Views are saved queries.'
      },
      requirements: {
        functional: [
          'Table, board, list, calendar views',
          'Filter by property values',
          'Sort by properties',
          'Show/hide columns per view'
        ],
        nonFunctional: [
          'View switch < 300ms',
          'Filter evaluation < 100ms'
        ]
      },
      hints: [
        'View: {database_id, type, filter, sort, visible_properties, group_by}',
        'Board: group by select property (status, priority)',
        'Calendar: display by date property'
      ],
      expectedComponents: ['View Renderer', 'Filter Engine', 'Sort Handler'],
      successCriteria: ['Views render correctly', 'Filters work'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-6',
      title: 'Relations and Rollups',
      phase: 2,
      phaseTitle: 'Databases',
      learningObjective: 'Link databases and compute aggregates',
      thinkingFramework: {
        framework: 'Database Links',
        approach: 'Relation property links to another database. Rollup aggregates related values (count, sum, etc). Creates relational data model.',
        keyInsight: 'Relations turn Notion into a relational database. Tasks relate to Projects. Rollup: Project shows sum of task hours. Powerful for tracking.'
      },
      requirements: {
        functional: [
          'Create relation between databases',
          'Link pages via relation',
          'Rollup property (count, sum, etc)',
          'Bidirectional relations'
        ],
        nonFunctional: [
          'Rollup calculation < 500ms'
        ]
      },
      hints: [
        'Relation: {property pointing to database, linked_page_ids}',
        'Rollup: {relation_property, target_property, function: count|sum|avg}',
        'Bidirectional: create relation on both sides automatically'
      ],
      expectedComponents: ['Relation Manager', 'Rollup Calculator', 'Link UI'],
      successCriteria: ['Relations work', 'Rollups calculate'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Collaboration (Steps 7-9)
    {
      id: 'step-7',
      title: 'Real-Time Editing',
      phase: 3,
      phaseTitle: 'Collaboration',
      learningObjective: 'Enable simultaneous editing without conflicts',
      thinkingFramework: {
        framework: 'Block-Level CRDT',
        approach: 'Operational transform or CRDT for concurrent edits. Block-level granularity. See others cursors. Changes merge automatically.',
        keyInsight: 'Block-level OT is simpler than character-level. Each block edited by one person at a time usually. Merge at block boundaries.'
      },
      requirements: {
        functional: [
          'Multiple simultaneous editors',
          'See others selections',
          'Real-time content updates',
          'Presence indicators'
        ],
        nonFunctional: [
          'Edit latency < 100ms',
          'Support 50 concurrent editors'
        ]
      },
      hints: [
        'Operations: insert_block, update_block, move_block, delete_block',
        'Sync: WebSocket channel per page',
        'Presence: cursor position, selected block, user avatar'
      ],
      expectedComponents: ['CRDT Engine', 'Sync Server', 'Presence Service'],
      successCriteria: ['Concurrent editing works', 'No data loss'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Sharing and Permissions',
      phase: 3,
      phaseTitle: 'Collaboration',
      learningObjective: 'Control access to pages and workspaces',
      thinkingFramework: {
        framework: 'Page-Level ACL',
        approach: 'Share individual pages or whole workspace. Permission levels: full access, edit, comment, view. Public pages with URL.',
        keyInsight: 'Notion sharing is page-centric. Share a page = share its subpages. Can override permissions at any level. Powerful for partial sharing.'
      },
      requirements: {
        functional: [
          'Share page with users',
          'Permission levels',
          'Public page links',
          'Inherit and override permissions'
        ],
        nonFunctional: [
          'Permission check < 10ms'
        ]
      },
      hints: [
        'Permission: {page_id, user_id, level: full|edit|comment|view}',
        'Inheritance: check page, then parent, then workspace',
        'Public: generate URL, anyone can view'
      ],
      expectedComponents: ['Permission Manager', 'Share Dialog', 'Public Link Handler'],
      successCriteria: ['Sharing works', 'Permissions enforced'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Comments and Discussion',
      phase: 3,
      phaseTitle: 'Collaboration',
      learningObjective: 'Enable inline discussion on content',
      thinkingFramework: {
        framework: 'Inline Comments',
        approach: 'Comment on specific block or text selection. Thread replies. Resolve when done. Notifications for mentions and replies.',
        keyInsight: 'Comments are contextual. Attached to specific content. When content changes, comment follows (or marks outdated). Discussion stays relevant.'
      },
      requirements: {
        functional: [
          'Comment on blocks',
          'Comment on text selection',
          'Thread replies',
          'Resolve comments'
        ],
        nonFunctional: [
          'Comment load < 200ms'
        ]
      },
      hints: [
        'Comment: {id, page_id, block_id, text_range?, body, replies: [], resolved}',
        'Text range: {start, end} within block text',
        'Notification: notify mentioned users and thread participants'
      ],
      expectedComponents: ['Comment Store', 'Comment UI', 'Notification Service'],
      successCriteria: ['Comments work', 'Threading works'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Workspace (Steps 10-12)
    {
      id: 'step-10',
      title: 'Templates',
      phase: 4,
      phaseTitle: 'Workspace',
      learningObjective: 'Create reusable page and database templates',
      thinkingFramework: {
        framework: 'Template System',
        approach: 'Save page as template. Database row templates (button creates from template). Template gallery for discovery. Variables in templates.',
        keyInsight: 'Templates reduce friction for repeated structures. Meeting notes template, project page template. Database templates standardize entries.'
      },
      requirements: {
        functional: [
          'Save page as template',
          'Database row templates',
          'Template gallery',
          'Duplicate from template'
        ],
        nonFunctional: [
          'Template instantiation < 500ms'
        ]
      },
      hints: [
        'Template: {id, name, content: block_tree, database_id?}',
        'Database template: default content for new rows',
        'Duplicate: deep copy blocks, assign new IDs'
      ],
      expectedComponents: ['Template Store', 'Template Gallery', 'Duplicator'],
      successCriteria: ['Templates save', 'Instantiation works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Team Workspaces',
      phase: 4,
      phaseTitle: 'Workspace',
      learningObjective: 'Organize content for teams',
      thinkingFramework: {
        framework: 'Workspace Organization',
        approach: 'Workspace contains teamspaces. Teamspaces organize pages for different groups. Private vs shared sections. Member management.',
        keyInsight: 'Workspace is top level. Teamspaces segment for departments/projects. Default permissions per teamspace. Sidebar shows hierarchy.'
      },
      requirements: {
        functional: [
          'Create teamspaces',
          'Add members to teamspaces',
          'Private vs shared content',
          'Teamspace settings'
        ],
        nonFunctional: [
          'Workspace can have 1000s of pages'
        ]
      },
      hints: [
        'Workspace: {id, name, members, teamspaces}',
        'Teamspace: {id, name, members, default_access, pages}',
        'Sidebar: workspace → teamspaces → pages tree'
      ],
      expectedComponents: ['Workspace Manager', 'Teamspace Manager', 'Sidebar'],
      successCriteria: ['Teamspaces organize content', 'Permissions work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Search and Navigation',
      phase: 4,
      phaseTitle: 'Workspace',
      learningObjective: 'Find content across workspace',
      thinkingFramework: {
        framework: 'Universal Search',
        approach: 'Search page titles, content, database entries. Quick switcher (Cmd+K). Recent pages. Backlinks (pages linking to this page).',
        keyInsight: 'Navigation is crucial at scale. Cant browse 1000s of pages. Search + quick switcher + recent = fast access. Backlinks show context.'
      },
      requirements: {
        functional: [
          'Full-text search',
          'Quick switcher',
          'Recent pages',
          'Backlinks'
        ],
        nonFunctional: [
          'Search < 500ms',
          'Quick switcher instant'
        ]
      },
      hints: [
        'Index: page title, block content, property values',
        'Quick switcher: fuzzy match on titles, MRU boost',
        'Backlinks: index mentions and page links'
      ],
      expectedComponents: ['Search Index', 'Quick Switcher', 'Backlink Index'],
      successCriteria: ['Search finds content', 'Navigation fast'],
      estimatedTime: '8 minutes'
    }
  ]
};
