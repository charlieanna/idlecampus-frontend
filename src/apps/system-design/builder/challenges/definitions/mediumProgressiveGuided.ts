import { GuidedTutorial } from '../../types/guidedTutorial';

export const mediumProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'medium-progressive',
  title: 'Design Medium',
  description: 'Build a blogging platform from simple articles to personalized content discovery',
  difficulty: 'medium',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design rich text editor and content storage',
    'Implement reading time and engagement metrics',
    'Build personalized content recommendations',
    'Handle publications and membership',
    'Scale for millions of articles and readers'
  ],
  prerequisites: ['Content management', 'Rich text', 'Recommendations'],
  tags: ['blogging', 'content', 'publishing', 'recommendations', 'membership'],

  progressiveStory: {
    title: 'Medium Evolution',
    premise: "You're building a blogging platform focused on quality content. Starting with a simple editor, you'll evolve to support publications, membership monetization, and personalized content discovery.",
    phases: [
      { phase: 1, title: 'Writing', description: 'Editor and publishing' },
      { phase: 2, title: 'Reading', description: 'Discovery and engagement' },
      { phase: 3, title: 'Growth', description: 'Publications and following' },
      { phase: 4, title: 'Monetization', description: 'Membership and payouts' }
    ]
  },

  steps: [
    // PHASE 1: Writing (Steps 1-3)
    {
      id: 'step-1',
      title: 'Rich Text Editor',
      phase: 1,
      phaseTitle: 'Writing',
      learningObjective: 'Create distraction-free writing experience',
      thinkingFramework: {
        framework: 'WYSIWYG Simplicity',
        approach: 'Minimal chrome, focus on writing. Inline formatting (bold, italic, links). Block types (headers, quotes, code). Images and embeds.',
        keyInsight: 'Medium-style editor hides complexity. No visible toolbar until needed. Formatting appears contextually. Writing feels like writing, not word processing.'
      },
      requirements: {
        functional: [
          'Rich text editing with formatting',
          'Insert images and embeds',
          'Headers, quotes, code blocks',
          'Auto-save drafts'
        ],
        nonFunctional: [
          'Typing latency < 16ms (60fps)',
          'Auto-save every 30 seconds'
        ]
      },
      hints: [
        'Editor: contenteditable with structured data model',
        'Blocks: [{type: paragraph|header|image|code, content}]',
        'Selection toolbar: appears on text selection'
      ],
      expectedComponents: ['Editor Component', 'Block Manager', 'Draft Store'],
      successCriteria: ['Smooth writing experience', 'All formatting works'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-2',
      title: 'Article Publishing',
      phase: 1,
      phaseTitle: 'Writing',
      learningObjective: 'Publish articles with metadata',
      thinkingFramework: {
        framework: 'Publishing Workflow',
        approach: 'Draft → publish flow. Add title, subtitle, tags. Feature image for social sharing. Schedule publishing for later.',
        keyInsight: 'Publishing is commitment. Preview how it looks. SEO metadata for search. Social card preview. Cant unpublish without consequences.'
      },
      requirements: {
        functional: [
          'Publish draft as article',
          'Add tags (up to 5)',
          'Set feature image',
          'Schedule publication'
        ],
        nonFunctional: [
          'Publish < 2 seconds',
          'Immediate availability'
        ]
      },
      hints: [
        'Article: {id, title, subtitle, content, tags, feature_image, published_at}',
        'Status: draft, scheduled, published, unlisted',
        'Schedule: published_at in future, job publishes at time'
      ],
      expectedComponents: ['Publish Flow', 'Tag Manager', 'Scheduler'],
      successCriteria: ['Articles publish', 'Scheduling works'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Reading Experience',
      phase: 1,
      phaseTitle: 'Writing',
      learningObjective: 'Deliver clean reading experience',
      thinkingFramework: {
        framework: 'Reader-First Design',
        approach: 'Estimated reading time. Progress indicator. Responsive typography. Minimal distractions. Highlighting for saving quotes.',
        keyInsight: 'Reading time sets expectations. 5 min read vs 20 min read = different commitment. Progress bar shows how much left.'
      },
      requirements: {
        functional: [
          'Calculate and show reading time',
          'Reading progress indicator',
          'Responsive typography',
          'Highlight and save quotes'
        ],
        nonFunctional: [
          'Article render < 500ms',
          'Smooth scroll'
        ]
      },
      hints: [
        'Reading time: word_count / 200 wpm (average reading speed)',
        'Progress: scroll position / total height',
        'Highlights: store {article_id, user_id, text, position}'
      ],
      expectedComponents: ['Article Renderer', 'Progress Tracker', 'Highlight Store'],
      successCriteria: ['Clean reading', 'Time accurate'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Reading (Steps 4-6)
    {
      id: 'step-4',
      title: 'Engagement Metrics',
      phase: 2,
      phaseTitle: 'Reading',
      learningObjective: 'Track how readers engage with content',
      thinkingFramework: {
        framework: 'Engagement Signals',
        approach: 'Claps (like but more expressive, 1-50). Read ratio (how much article was read). Time spent. These feed recommendations.',
        keyInsight: 'Claps are Medium-unique. Not binary like. Shows enthusiasm level. Read ratio reveals quality - people finishing = good content.'
      },
      requirements: {
        functional: [
          'Clap on articles (1-50 per user)',
          'Track read percentage',
          'Track time spent reading',
          'Show engagement to author'
        ],
        nonFunctional: [
          'Clap response < 100ms',
          'Metrics accurate within 1 hour'
        ]
      },
      hints: [
        'Clap: {article_id, user_id, count: 1-50}',
        'Read ratio: max_scroll_position / article_length',
        'Time: track active time (not tab-hidden)'
      ],
      expectedComponents: ['Clap Handler', 'Read Tracker', 'Stats Aggregator'],
      successCriteria: ['Claps work', 'Metrics tracked'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Personalized Feed',
      phase: 2,
      phaseTitle: 'Reading',
      learningObjective: 'Surface relevant articles for each reader',
      thinkingFramework: {
        framework: 'Interest-Based Discovery',
        approach: 'Learn interests from reading behavior. Recommend similar articles. Balance following, interests, trending. Fresh content priority.',
        keyInsight: 'Feed is not just following. Discover new writers through topics. Reading history reveals interests better than explicit preferences.'
      },
      requirements: {
        functional: [
          'Personalized home feed',
          'Topic-based recommendations',
          'Following feed (writers you follow)',
          'Mix fresh and popular content'
        ],
        nonFunctional: [
          'Feed generation < 500ms',
          'Update recommendations hourly'
        ]
      },
      hints: [
        'Signals: read articles, claps, follows, time spent per topic',
        'Candidates: followed writers, topic matches, trending, explore',
        'Ranking: predicted engagement × freshness × diversity'
      ],
      expectedComponents: ['Feed Generator', 'Interest Model', 'Ranking Engine'],
      successCriteria: ['Feed is relevant', 'Discovery works'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-6',
      title: 'Responses and Discussion',
      phase: 2,
      phaseTitle: 'Reading',
      learningObjective: 'Enable thoughtful discussion',
      thinkingFramework: {
        framework: 'Long-Form Comments',
        approach: 'Responses are mini-articles. Support formatting. Threaded replies. Author can feature responses. Quality over quantity.',
        keyInsight: 'Medium responses are not typical comments. Longer, more thoughtful. Featured responses surface best discussion. Discourages drive-by comments.'
      },
      requirements: {
        functional: [
          'Write response with formatting',
          'Reply to responses',
          'Feature responses (author choice)',
          'Clap on responses'
        ],
        nonFunctional: [
          'Response limit: 5000 words'
        ]
      },
      hints: [
        'Response: {id, article_id, parent_id, content, author_id, featured}',
        'Featured: author promotes quality responses',
        'Sort: featured first, then by claps'
      ],
      expectedComponents: ['Response Editor', 'Thread Manager', 'Feature Handler'],
      successCriteria: ['Responses work', 'Threading correct'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Growth (Steps 7-9)
    {
      id: 'step-7',
      title: 'Publications',
      phase: 3,
      phaseTitle: 'Growth',
      learningObjective: 'Create collaborative publishing homes',
      thinkingFramework: {
        framework: 'Shared Publishing',
        approach: 'Publication = shared blog with multiple writers. Editors curate and review. Custom branding. Publication followers see all content.',
        keyInsight: 'Publications aggregate audiences. Writer benefits from publication reach. Publication benefits from writer content. Win-win.'
      },
      requirements: {
        functional: [
          'Create publications',
          'Invite writers and editors',
          'Submit articles to publications',
          'Editorial review workflow'
        ],
        nonFunctional: [
          'Publication page load < 500ms'
        ]
      },
      hints: [
        'Publication: {id, name, description, logo, domain, editors, writers}',
        'Submission: {article_id, publication_id, status: pending|approved|rejected}',
        'Roles: owner, editor (approve), writer (submit only)'
      ],
      expectedComponents: ['Publication Manager', 'Submission Queue', 'Role System'],
      successCriteria: ['Publications work', 'Editorial flow works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Following and Notifications',
      phase: 3,
      phaseTitle: 'Growth',
      learningObjective: 'Build audience connections',
      thinkingFramework: {
        framework: 'Subscription Model',
        approach: 'Follow writers and publications. Email digest of new content. In-app notifications. Push for high-priority.',
        keyInsight: 'Follow is promise of value. Dont spam followers. Aggregate notifications. Email digest (not every article) to avoid unsubscribes.'
      },
      requirements: {
        functional: [
          'Follow writers and publications',
          'Notification feed',
          'Email digest (daily/weekly)',
          'Notification preferences'
        ],
        nonFunctional: [
          'New article notification < 5 minutes',
          'Digest at consistent time'
        ]
      },
      hints: [
        'Follow: {follower_id, following_id, following_type: user|publication}',
        'Notification: {user_id, type, data, read, timestamp}',
        'Digest: batch new content, send at preferred time'
      ],
      expectedComponents: ['Follow Manager', 'Notification Service', 'Digest Generator'],
      successCriteria: ['Following works', 'Notifications delivered'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Tags and Topics',
      phase: 3,
      phaseTitle: 'Growth',
      learningObjective: 'Organize content by subject',
      thinkingFramework: {
        framework: 'Topic Graph',
        approach: 'Tags applied by authors. Topics are curated collections. Follow topics for feed. Topic pages surface best content.',
        keyInsight: 'Tags are bottom-up (author applies). Topics are top-down (curated). Topics have editors who feature content. Discoverability mechanism.'
      },
      requirements: {
        functional: [
          'Add tags to articles',
          'Browse topic pages',
          'Follow topics',
          'Topic-based search'
        ],
        nonFunctional: [
          'Topic page load < 500ms'
        ]
      },
      hints: [
        'Tag: user-created, normalized (JavaScript → javascript)',
        'Topic: {id, name, description, featured_articles, editors}',
        'Topic feed: tagged articles ranked by engagement'
      ],
      expectedComponents: ['Tag System', 'Topic Manager', 'Topic Feed'],
      successCriteria: ['Tags organize content', 'Topics discoverable'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Monetization (Steps 10-12)
    {
      id: 'step-10',
      title: 'Metered Paywall',
      phase: 4,
      phaseTitle: 'Monetization',
      learningObjective: 'Gate premium content behind membership',
      thinkingFramework: {
        framework: 'Freemium Content',
        approach: 'Some articles free, some member-only. Metered: free articles per month, then paywall. Member-only stories marked. Preview before paywall.',
        keyInsight: 'Metered paywall balances reach and revenue. Free articles hook readers. Paywall converts engaged readers. Preview shows value before asking for money.'
      },
      requirements: {
        functional: [
          'Mark articles as member-only',
          'Track free article quota',
          'Show paywall when quota exceeded',
          'Preview with soft paywall'
        ],
        nonFunctional: [
          'Free quota: 3 articles/month',
          'Paywall render < 100ms'
        ]
      },
      hints: [
        'Article: {metered: boolean} - member-only if true',
        'Quota: track unique member-only views per user per month',
        'Preview: show first 3 paragraphs, blur rest with paywall'
      ],
      expectedComponents: ['Paywall Logic', 'Quota Tracker', 'Preview Renderer'],
      successCriteria: ['Paywall triggers correctly', 'Quota tracked'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Partner Program Payouts',
      phase: 4,
      phaseTitle: 'Monetization',
      learningObjective: 'Pay writers based on engagement',
      thinkingFramework: {
        framework: 'Revenue Share',
        approach: 'Pool of membership revenue. Distribute based on member reading time. More engagement = more earnings. Monthly payout.',
        keyInsight: 'Reading time is fairest metric. Long thoughtful article earns more than viral clickbait. Aligns incentives with quality content.'
      },
      requirements: {
        functional: [
          'Track member reading time per article',
          'Calculate earnings share',
          'Show earnings dashboard',
          'Monthly payout processing'
        ],
        nonFunctional: [
          'Earnings calculation: daily',
          'Payout: monthly (min $100)'
        ]
      },
      hints: [
        'Earnings: (author_member_time / total_member_time) × revenue_pool',
        'Member time: only paying members reading time counts',
        'Dashboard: daily/monthly earnings, top articles'
      ],
      expectedComponents: ['Time Tracker', 'Earnings Calculator', 'Payout Service'],
      successCriteria: ['Earnings calculated fairly', 'Payouts work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Scale and Performance',
      phase: 4,
      phaseTitle: 'Monetization',
      learningObjective: 'Handle millions of articles and readers',
      thinkingFramework: {
        framework: 'Content Delivery',
        approach: 'CDN for article pages. Cache rendered HTML. Lazy load images. Efficient recommendation serving. Search index optimization.',
        keyInsight: 'Articles are read-heavy, write-rare. Cache aggressively. Most articles have low traffic (long tail). Hot articles need CDN.'
      },
      requirements: {
        functional: [
          'CDN for article delivery',
          'Image optimization',
          'Search indexing',
          'Recommendation caching'
        ],
        nonFunctional: [
          'Article load < 1 second',
          'Search < 500ms'
        ]
      },
      hints: [
        'CDN: cache HTML, invalidate on edit',
        'Images: responsive sizes, WebP, lazy load',
        'Search: Elasticsearch with article text, title, tags'
      ],
      expectedComponents: ['CDN Layer', 'Image Optimizer', 'Search Index'],
      successCriteria: ['Fast loads', 'Search works'],
      estimatedTime: '8 minutes'
    }
  ]
};
