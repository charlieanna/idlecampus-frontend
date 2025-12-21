import { GuidedTutorial } from '../../types/guidedTutorial';

export const stackoverflowProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'stackoverflow-progressive',
  title: 'Design Stack Overflow',
  description: 'Build a Q&A platform from basic questions to knowledge base serving millions of developers',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design Q&A with voting and reputation',
    'Implement full-text search for technical content',
    'Build gamification and reputation system',
    'Handle duplicate detection and moderation',
    'Scale to millions of questions'
  ],
  prerequisites: ['Full-text search', 'Voting systems', 'Content moderation'],
  tags: ['q&a', 'knowledge-base', 'search', 'gamification', 'community'],

  progressiveStory: {
    title: 'Stack Overflow Evolution',
    premise: "You're building a Q&A platform for developers. Starting with basic questions and answers, you'll evolve to support voting, reputation, tags, search, and a self-moderating community.",
    phases: [
      { phase: 1, title: 'Q&A Core', description: 'Questions and answers' },
      { phase: 2, title: 'Community', description: 'Voting and reputation' },
      { phase: 3, title: 'Discovery', description: 'Search and tags' },
      { phase: 4, title: 'Scale', description: 'Moderation and performance' }
    ]
  },

  steps: [
    // PHASE 1: Q&A Core (Steps 1-3)
    {
      id: 'step-1',
      title: 'Question Posting',
      phase: 1,
      phaseTitle: 'Q&A Core',
      learningObjective: 'Create well-structured questions',
      thinkingFramework: {
        framework: 'Structured Content',
        approach: 'Question = title + body + tags. Markdown for code formatting. Required fields to ensure quality. Preview before posting.',
        keyInsight: 'Question quality determines answer quality. Force structure: clear title, code examples, what was tried. Bad questions get bad answers.'
      },
      requirements: {
        functional: [
          'Post question with title and body',
          'Markdown formatting with code blocks',
          'Add tags (1-5 required)',
          'Edit question after posting'
        ],
        nonFunctional: [
          'Question save < 500ms',
          'Markdown rendering < 100ms'
        ]
      },
      hints: [
        'Question: {id, title, body, author_id, tags, created_at, updated_at, views}',
        'Markdown: highlight.js for code, sanitize HTML',
        'Tags: predefined list + ability to create new'
      ],
      expectedComponents: ['Question Store', 'Markdown Parser', 'Tag System'],
      successCriteria: ['Questions posted', 'Formatting works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Answer System',
      phase: 1,
      phaseTitle: 'Q&A Core',
      learningObjective: 'Enable answers to questions',
      thinkingFramework: {
        framework: 'Answer Model',
        approach: 'Multiple answers per question. One accepted answer (by asker). Sort by votes or activity. Prevent duplicate answers.',
        keyInsight: 'Accepted answer is not always best. High-voted answer might be better. Show both: accepted at top, then by votes.'
      },
      requirements: {
        functional: [
          'Post answer to question',
          'Accept answer (question author)',
          'Edit answers',
          'Sort answers by votes'
        ],
        nonFunctional: [
          'Answer save < 500ms',
          'Multiple answers per question'
        ]
      },
      hints: [
        'Answer: {id, question_id, body, author_id, accepted, votes, created_at}',
        'Accept: only question author can accept, one accepted max',
        'Sort: accepted first, then by vote score descending'
      ],
      expectedComponents: ['Answer Store', 'Accept Handler', 'Sort Engine'],
      successCriteria: ['Answers posted', 'Acceptance works'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Comments',
      phase: 1,
      phaseTitle: 'Q&A Core',
      learningObjective: 'Allow clarifications without full answers',
      thinkingFramework: {
        framework: 'Lightweight Feedback',
        approach: 'Comments on questions and answers. Not for answers, for clarifications. Limited length. Upvote only (no downvote).',
        keyInsight: 'Comments prevent answer pollution. Quick clarification shouldnt be a full answer. Keeps signal-to-noise ratio high.'
      },
      requirements: {
        functional: [
          'Comment on questions and answers',
          'Upvote comments',
          'Flag inappropriate comments',
          'Delete own comments'
        ],
        nonFunctional: [
          'Comment limit: 600 characters',
          'Collapse after 5 comments'
        ]
      },
      hints: [
        'Comment: {id, parent_type: question|answer, parent_id, body, author_id, votes}',
        'Privilege: need 50 rep to comment (prevent spam)',
        'Display: top 5 by votes, expand to see all'
      ],
      expectedComponents: ['Comment Store', 'Vote Handler', 'Display Logic'],
      successCriteria: ['Comments work', 'Collapsing works'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Community (Steps 4-6)
    {
      id: 'step-4',
      title: 'Voting System',
      phase: 2,
      phaseTitle: 'Community',
      learningObjective: 'Rank content by community votes',
      thinkingFramework: {
        framework: 'Crowdsourced Quality',
        approach: 'Upvote = useful, downvote = not useful. Vote score determines visibility. Downvoting costs reputation (prevents abuse). One vote per user per post.',
        keyInsight: 'Downvoting should have friction. Costs 1 rep to downvote answer. Prevents pile-on. Upvoting is free - encourages positive contribution.'
      },
      requirements: {
        functional: [
          'Upvote and downvote questions/answers',
          'One vote per user per post',
          'Change or retract vote',
          'Calculate vote score'
        ],
        nonFunctional: [
          'Vote recording < 100ms',
          'Score update: real-time'
        ]
      },
      hints: [
        'Vote: {user_id, post_type, post_id, vote_type: up|down, timestamp}',
        'Score: SUM(CASE vote_type WHEN up THEN 1 ELSE -1 END)',
        'Constraints: unique (user_id, post_type, post_id)'
      ],
      expectedComponents: ['Vote Store', 'Score Calculator', 'Vote Validator'],
      successCriteria: ['Voting works', 'Scores accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Reputation System',
      phase: 2,
      phaseTitle: 'Community',
      learningObjective: 'Reward quality contributions',
      thinkingFramework: {
        framework: 'Gamified Trust',
        approach: 'Earn rep from upvotes, accepted answers, edits. Lose rep from downvotes. Rep unlocks privileges. Creates incentive for quality.',
        keyInsight: 'Reputation is trust currency. High rep = proven contributor. Privileges scale with trust. Prevents gaming by new accounts.'
      },
      requirements: {
        functional: [
          'Award rep for upvotes (+10/+5)',
          'Award rep for accepted answer (+15)',
          'Deduct rep for downvotes (-2)',
          'Track rep history'
        ],
        nonFunctional: [
          'Rep update: immediate',
          'Starting rep: 1'
        ]
      },
      hints: [
        'Rep events: {user_id, event_type, amount, post_id, timestamp}',
        'Amounts: question_upvote=+5, answer_upvote=+10, accept=+15, downvote=-2',
        'Total: SUM(amounts) or cached counter'
      ],
      expectedComponents: ['Rep Calculator', 'Event Logger', 'Privilege Checker'],
      successCriteria: ['Rep calculated correctly', 'History tracked'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Privileges and Badges',
      phase: 2,
      phaseTitle: 'Community',
      learningObjective: 'Unlock abilities with reputation',
      thinkingFramework: {
        framework: 'Progressive Trust',
        approach: 'Rep thresholds unlock actions: 15=upvote, 50=comment, 125=downvote, 2000=edit. Badges for achievements. Creates progression.',
        keyInsight: 'Privileges prevent spam while rewarding contribution. New user cant downvote-bomb. Trusted users can edit without approval.'
      },
      requirements: {
        functional: [
          'Check privileges before actions',
          'Award badges for achievements',
          'Display user privileges',
          'Privilege notifications'
        ],
        nonFunctional: [
          'Privilege check < 10ms'
        ]
      },
      hints: [
        'Privileges: [{rep_required, action}] - e.g., {50, comment}, {2000, edit_any}',
        'Badges: gold (rare), silver (notable), bronze (participation)',
        'Examples: Guru (accepted answer with 40+ votes), Fanatic (100 day streak)'
      ],
      expectedComponents: ['Privilege System', 'Badge Awarder', 'Achievement Tracker'],
      successCriteria: ['Privileges enforced', 'Badges awarded'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Discovery (Steps 7-9)
    {
      id: 'step-7',
      title: 'Tag System',
      phase: 3,
      phaseTitle: 'Discovery',
      learningObjective: 'Organize questions by topic',
      thinkingFramework: {
        framework: 'Taxonomy',
        approach: 'Tags = topics (javascript, react, python). Hierarchical (react → javascript). Tag wiki for descriptions. Follow tags for feed.',
        keyInsight: 'Tags are primary navigation. Users follow technologies they know. Tag pages become mini-communities. Expert-per-tag reputation.'
      },
      requirements: {
        functional: [
          'Add tags to questions',
          'Browse questions by tag',
          'Follow/ignore tags',
          'Tag wiki and synonyms'
        ],
        nonFunctional: [
          'Tag lookup < 50ms',
          'Tag autocomplete < 100ms'
        ]
      },
      hints: [
        'Tag: {name, description, question_count, followers, wiki}',
        'Synonyms: react-js → react, reactjs → react',
        'Following: personalized feed based on followed tags'
      ],
      expectedComponents: ['Tag Store', 'Tag Browser', 'Follow Manager'],
      successCriteria: ['Tags organize content', 'Following works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Search Engine',
      phase: 3,
      phaseTitle: 'Discovery',
      learningObjective: 'Find questions by content and code',
      thinkingFramework: {
        framework: 'Technical Search',
        approach: 'Full-text search on title, body, answers. Code-aware tokenization. Filter by tags, votes, answered. Ranking by relevance + quality.',
        keyInsight: 'Code search is different from text search. Must handle: function names, error messages, stack traces. Exact match often more important than fuzzy.'
      },
      requirements: {
        functional: [
          'Search questions and answers',
          'Filter by tag, answered, votes',
          'Code-aware search',
          'Advanced search operators'
        ],
        nonFunctional: [
          'Search < 500ms',
          'Results ranked by relevance'
        ]
      },
      hints: [
        'Index: title (boost 2x), body, answers, tags',
        'Operators: [tag], is:answered, score:10, user:123',
        'Code: special tokenizer for camelCase, snake_case, dots'
      ],
      expectedComponents: ['Search Index', 'Query Parser', 'Ranker'],
      successCriteria: ['Search finds relevant results', 'Filters work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Duplicate Detection',
      phase: 3,
      phaseTitle: 'Discovery',
      learningObjective: 'Identify and link duplicate questions',
      thinkingFramework: {
        framework: 'Deduplication',
        approach: 'On new question, suggest similar existing questions. Community marks duplicates. Duplicate links to canonical. Merges search juice.',
        keyInsight: 'Duplicates fragment knowledge. One canonical answer better than 10 partial. Duplicate linking preserves SEO while consolidating knowledge.'
      },
      requirements: {
        functional: [
          'Suggest similar questions on ask',
          'Mark question as duplicate',
          'Link to canonical question',
          'Search across duplicates'
        ],
        nonFunctional: [
          'Similar detection < 1 second',
          'Duplicate closing: 5 votes'
        ]
      },
      hints: [
        'Similar: title embedding similarity, same tags boost',
        'Duplicate: closed with link to original',
        'Redirect: duplicate still in search, links to canonical'
      ],
      expectedComponents: ['Similarity Detector', 'Duplicate Linker', 'Close Vote Handler'],
      successCriteria: ['Duplicates detected', 'Knowledge consolidated'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Community Moderation',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Enable community self-moderation',
      thinkingFramework: {
        framework: 'Distributed Moderation',
        approach: 'Users with rep can: flag, vote to close, edit. Consensus required for actions. Review queues for flagged content. Scales with community.',
        keyInsight: 'Cant hire enough moderators. Community scales moderation. High-rep users are invested, moderate well. Consensus prevents abuse.'
      },
      requirements: {
        functional: [
          'Flag for moderator attention',
          'Vote to close questions',
          'Review queues for edits/flags',
          'Moderator tools for elected mods'
        ],
        nonFunctional: [
          'Flag handling < 24 hours',
          'Close votes: 5 to close'
        ]
      },
      hints: [
        'Flag: {post_id, flagger_id, reason, status: pending|helpful|declined}',
        'Close reasons: duplicate, off-topic, unclear, too broad',
        'Review: suggested edits, close votes, low quality, late answers'
      ],
      expectedComponents: ['Flag System', 'Close Vote Handler', 'Review Queues'],
      successCriteria: ['Community moderates', 'Quality maintained'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'SEO and Google',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Optimize for search engine traffic',
      thinkingFramework: {
        framework: 'Search Discoverability',
        approach: 'Most traffic from Google. Clean URLs, structured data, fast loading. Question title = page title. Good answers rank high.',
        keyInsight: '90% of Stack Overflow traffic is from search engines. SEO is existential. Question pages are long-tail gold. Each question targets specific query.'
      },
      requirements: {
        functional: [
          'SEO-friendly URLs',
          'Structured data (JSON-LD)',
          'Meta descriptions from content',
          'Sitemap generation'
        ],
        nonFunctional: [
          'Page load < 2 seconds',
          'Mobile-friendly'
        ]
      },
      hints: [
        'URL: /questions/{id}/{slug} - e.g., /questions/123/how-to-parse-json',
        'Schema: QAPage with Question and Answer objects',
        'Meta: truncated question body as description'
      ],
      expectedComponents: ['URL Generator', 'Schema Markup', 'Sitemap Builder'],
      successCriteria: ['Pages indexed', 'Good search rankings'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-12',
      title: 'Performance at Scale',
      phase: 4,
      phaseTitle: 'Scale',
      learningObjective: 'Handle millions of questions and users',
      thinkingFramework: {
        framework: 'Read-Heavy Optimization',
        approach: 'Q&A is read-heavy (100:1). Cache question pages aggressively. CDN for static content. Database read replicas. Search index sharding.',
        keyInsight: 'Same questions viewed millions of times. Full-page caching with short TTL. Invalidate on edit. Most pages can be served from cache.'
      },
      requirements: {
        functional: [
          'Page caching with invalidation',
          'Database read replicas',
          'Search index scaling',
          'CDN for assets'
        ],
        nonFunctional: [
          'Page response < 200ms (cached)',
          '99.9% availability'
        ]
      },
      hints: [
        'Cache: question page HTML, invalidate on answer/edit',
        'Read replicas: search and listing queries to replicas',
        'CDN: static assets, user avatars'
      ],
      expectedComponents: ['Page Cache', 'DB Replicas', 'CDN Layer'],
      successCriteria: ['Fast page loads', 'Handles traffic'],
      estimatedTime: '8 minutes'
    }
  ]
};
