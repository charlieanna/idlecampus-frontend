import { GuidedTutorial } from '../../types/guidedTutorial';

export const facebookProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'facebook-progressive',
  title: 'Design Facebook',
  description: 'Build a social network from friend connections to global platform with billions of users',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design social graph storage and traversal',
    'Implement news feed generation at scale',
    'Build real-time notification system',
    'Handle privacy and data access controls',
    'Scale to billions of daily active users'
  ],
  prerequisites: ['Graph databases', 'Distributed systems', 'Feed algorithms'],
  tags: ['social-network', 'graph', 'feed', 'scale', 'privacy'],

  progressiveStory: {
    title: 'Facebook Evolution',
    premise: "You're building the world's largest social network. Starting with friend connections and profiles, you'll evolve to support the News Feed, groups, events, and billions of users sharing their lives online.",
    phases: [
      { phase: 1, title: 'Social Graph', description: 'Friends and profiles' },
      { phase: 2, title: 'News Feed', description: 'Content aggregation' },
      { phase: 3, title: 'Engagement', description: 'Reactions and comments' },
      { phase: 4, title: 'Platform Scale', description: 'Billions of users' }
    ]
  },

  steps: [
    // PHASE 1: Social Graph (Steps 1-3)
    {
      id: 'step-1',
      title: 'User Profiles',
      phase: 1,
      phaseTitle: 'Social Graph',
      learningObjective: 'Store and serve user profile data',
      thinkingFramework: {
        framework: 'Profile Data Model',
        approach: 'Profile = identity + personal info + settings. Structured data (name, birthday) + freeform (bio). Privacy per field. Version history.',
        keyInsight: 'Profile is read-heavy, write-rare. Cache aggressively. Profile photo is most viewed - optimize delivery. Privacy settings checked on every read.'
      },
      requirements: {
        functional: [
          'Create profile with basic info',
          'Upload profile and cover photos',
          'Update profile fields',
          'Per-field privacy settings'
        ],
        nonFunctional: [
          'Profile load < 200ms',
          'Photo delivery via CDN'
        ]
      },
      hints: [
        'Profile: {user_id, name, birthday, bio, location, work, education}',
        'Privacy: {field: visibility} where visibility = public|friends|only_me',
        'Photos: multiple sizes, CDN-delivered'
      ],
      expectedComponents: ['Profile Store', 'Privacy Manager', 'Photo Service'],
      successCriteria: ['Profiles created', 'Privacy enforced'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Friend Connections',
      phase: 1,
      phaseTitle: 'Social Graph',
      learningObjective: 'Model bidirectional friend relationships',
      thinkingFramework: {
        framework: 'Social Graph',
        approach: 'Friend = bidirectional edge. Request → pending → accepted/rejected. Unfriend removes both edges. Friend list with online status.',
        keyInsight: 'Graph is sparse - most users have <1000 friends out of billions. Adjacency list efficient. Friend-of-friend queries for suggestions.'
      },
      requirements: {
        functional: [
          'Send and receive friend requests',
          'Accept or reject requests',
          'View friend list',
          'Unfriend users'
        ],
        nonFunctional: [
          'Friend lookup < 10ms',
          'Support 5000 friends per user'
        ]
      },
      hints: [
        'Edge: {user_id, friend_id, status: pending|accepted, timestamp}',
        'Bidirectional: store both directions for fast lookup',
        'Request: create pending edge, notification to recipient'
      ],
      expectedComponents: ['Graph Store', 'Request Handler', 'Friend List'],
      successCriteria: ['Friend requests work', 'Graph correct'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Friend Suggestions',
      phase: 1,
      phaseTitle: 'Social Graph',
      learningObjective: 'Recommend people to connect with',
      thinkingFramework: {
        framework: 'Graph-Based Recommendations',
        approach: 'Mutual friends = strong signal. Same school/workplace = medium. Imported contacts = high intent. Rank by connection probability.',
        keyInsight: 'People You May Know drives network growth. Friends of friends are likely real-world connections. Contact upload provides ground truth.'
      },
      requirements: {
        functional: [
          'Find mutual friend connections',
          'Match by school/workplace',
          'Contact import matching',
          'Rank suggestions by relevance'
        ],
        nonFunctional: [
          'Suggestion generation: batch + real-time',
          'Exclude blocked/hidden users'
        ]
      },
      hints: [
        'Mutual: count friends-of-friends, rank by count',
        'Affinity: school_overlap + work_overlap + mutual_count',
        'Contact: hash phone/email, match against user db'
      ],
      expectedComponents: ['Suggestion Engine', 'Contact Matcher', 'Ranking Model'],
      successCriteria: ['Suggestions relevant', 'Drives connections'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: News Feed (Steps 4-6)
    {
      id: 'step-4',
      title: 'Posts and Timeline',
      phase: 2,
      phaseTitle: 'News Feed',
      learningObjective: 'Create and store user posts',
      thinkingFramework: {
        framework: 'Content Model',
        approach: 'Post = text + media + metadata. Timeline = users own posts chronologically. Audience selection per post. Edit history tracked.',
        keyInsight: 'Post is polymorphic: status, photo, video, link, life event. Unified storage with type-specific rendering. Timeline is simple - just users posts.'
      },
      requirements: {
        functional: [
          'Create post with text and media',
          'Set audience (public, friends, custom)',
          'Edit and delete posts',
          'View user timeline'
        ],
        nonFunctional: [
          'Post creation < 1 second',
          'Timeline load < 500ms'
        ]
      },
      hints: [
        'Post: {id, author_id, content, media_ids, audience, created_at, edited_at}',
        'Audience: public, friends, friends_except, specific_friends, only_me',
        'Timeline: posts WHERE author_id = user ORDER BY created_at DESC'
      ],
      expectedComponents: ['Post Store', 'Audience Manager', 'Timeline Service'],
      successCriteria: ['Posts created', 'Timeline shows correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'News Feed Generation',
      phase: 2,
      phaseTitle: 'News Feed',
      learningObjective: 'Aggregate and rank content from connections',
      thinkingFramework: {
        framework: 'Feed Assembly',
        approach: 'Pull model: query posts from friends. Rank by engagement prediction. Diversify content types. Filter seen posts.',
        keyInsight: 'Cant show everything - too many posts. Algorithm selects subset. Optimizes for engagement (likes, comments, shares). Balance friends vs pages.'
      },
      requirements: {
        functional: [
          'Aggregate posts from friends',
          'Rank by predicted engagement',
          'Mix content types (posts, stories, ads)',
          'Infinite scroll with pagination'
        ],
        nonFunctional: [
          'Feed generation < 500ms',
          'Fresh content priority'
        ]
      },
      hints: [
        'Candidates: friends posts + page posts + group posts',
        'Ranking: ML model predicting P(like), P(comment), P(share)',
        'Features: author affinity, content type, recency, engagement velocity'
      ],
      expectedComponents: ['Feed Aggregator', 'Ranking Service', 'Feed Cache'],
      successCriteria: ['Feed personalized', 'Engaging content surfaces'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-6',
      title: 'Feed Fanout',
      phase: 2,
      phaseTitle: 'News Feed',
      learningObjective: 'Optimize feed delivery at scale',
      thinkingFramework: {
        framework: 'Push vs Pull',
        approach: 'Push: on post, write to all followers feeds (fanout on write). Pull: on read, query followers posts (fanout on read). Hybrid based on follower count.',
        keyInsight: 'Celebrities cant push to millions of followers per post. Use hybrid: push to active users, pull for inactive. Cache hot feeds.'
      },
      requirements: {
        functional: [
          'Push posts to follower feeds',
          'Pull for inactive/celebrity follows',
          'Hybrid strategy based on user type',
          'Real-time feed updates'
        ],
        nonFunctional: [
          'Post visible in feed < 5 seconds',
          'Scale to 1000 friends posting'
        ]
      },
      hints: [
        'Push: post → queue → write to each follower feed cache',
        'Pull: on load, query recent posts from followed users',
        'Hybrid: push if followers < 10K, pull otherwise'
      ],
      expectedComponents: ['Fanout Service', 'Feed Cache', 'Hybrid Router'],
      successCriteria: ['Posts appear in feeds', 'Scales efficiently'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Engagement (Steps 7-9)
    {
      id: 'step-7',
      title: 'Reactions and Likes',
      phase: 3,
      phaseTitle: 'Engagement',
      learningObjective: 'Track user engagement with content',
      thinkingFramework: {
        framework: 'Engagement Signals',
        approach: 'Reactions: like, love, haha, wow, sad, angry. One reaction per user per post. Count aggregation for display. Real-time updates.',
        keyInsight: 'Reactions are high-volume events. Dont query for every view - cache counts. Update counts asynchronously. Show who reacted on demand.'
      },
      requirements: {
        functional: [
          'Add reaction to post/comment',
          'Change or remove reaction',
          'Display reaction counts',
          'Show who reacted (paginated)'
        ],
        nonFunctional: [
          'Reaction latency < 200ms',
          'Count accuracy: eventual (1 min)'
        ]
      },
      hints: [
        'Reaction: {user_id, post_id, type, timestamp}',
        'Counts: {post_id, like: N, love: M, ...} - cached',
        'Update: async increment/decrement counter'
      ],
      expectedComponents: ['Reaction Store', 'Count Cache', 'Real-Time Updater'],
      successCriteria: ['Reactions tracked', 'Counts accurate'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-8',
      title: 'Comments and Replies',
      phase: 3,
      phaseTitle: 'Engagement',
      learningObjective: 'Enable threaded discussions on posts',
      thinkingFramework: {
        framework: 'Nested Comments',
        approach: 'Comments on posts. Replies to comments (1 level deep). Sort by relevance or recency. Reactions on comments too.',
        keyInsight: 'Comment ranking matters for engagement. Show most relevant first. Viral posts have thousands of comments - pagination essential.'
      },
      requirements: {
        functional: [
          'Comment on posts',
          'Reply to comments',
          'Edit and delete comments',
          'Sort by relevance or time'
        ],
        nonFunctional: [
          'Comment load < 300ms',
          'Support 10K+ comments per post'
        ]
      },
      hints: [
        'Comment: {id, post_id, parent_id, author_id, content, timestamp}',
        'Threading: parent_id = null for top-level, post_id for reply',
        'Ranking: engagement + author affinity + recency'
      ],
      expectedComponents: ['Comment Store', 'Thread Builder', 'Comment Ranker'],
      successCriteria: ['Comments work', 'Threading correct'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Notifications',
      phase: 3,
      phaseTitle: 'Engagement',
      learningObjective: 'Alert users to relevant activity',
      thinkingFramework: {
        framework: 'Notification System',
        approach: 'Events → notifications: someone liked, commented, mentioned. Aggregate similar (5 people liked). Push to mobile, badge on web.',
        keyInsight: 'Notification fatigue is real. Aggregate aggressively. Prioritize close friends. Respect user preferences. Dont spam.'
      },
      requirements: {
        functional: [
          'Generate notifications for engagements',
          'Aggregate similar notifications',
          'Push to mobile devices',
          'Notification preferences'
        ],
        nonFunctional: [
          'Notification delivery < 5 seconds',
          'Aggregation window: 15 minutes'
        ]
      },
      hints: [
        'Notification: {user_id, type, actors: [], object_id, read, timestamp}',
        'Aggregation: group by (type, object_id) within window',
        'Push: FCM/APNs, batch multiple notifications'
      ],
      expectedComponents: ['Notification Generator', 'Aggregator', 'Push Service'],
      successCriteria: ['Notifications delivered', 'Well-aggregated'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Platform Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Groups and Pages',
      phase: 4,
      phaseTitle: 'Platform Scale',
      learningObjective: 'Enable community and business presence',
      thinkingFramework: {
        framework: 'Entity Types',
        approach: 'Groups: member-based communities. Pages: public business/creator presence. Different privacy and permission models. Admin hierarchies.',
        keyInsight: 'Groups and pages are different entities with different models. Groups have members who post. Pages have followers who consume.'
      },
      requirements: {
        functional: [
          'Create and manage groups',
          'Create business pages',
          'Group membership and moderation',
          'Page insights and analytics'
        ],
        nonFunctional: [
          'Group size: up to 1M members',
          'Page followers: unlimited'
        ]
      },
      hints: [
        'Group: {id, name, privacy: public|private|secret, members_count}',
        'Page: {id, name, category, followers_count, verified}',
        'Roles: owner, admin, moderator, member'
      ],
      expectedComponents: ['Group Service', 'Page Service', 'Admin Tools'],
      successCriteria: ['Groups functional', 'Pages manageable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Privacy and Access Control',
      phase: 4,
      phaseTitle: 'Platform Scale',
      learningObjective: 'Enforce complex privacy rules at scale',
      thinkingFramework: {
        framework: 'Permission Checking',
        approach: 'Every content access checks: viewer allowed? Consider: audience, blocks, privacy settings, account state. Precompute when possible.',
        keyInsight: 'Privacy check on every request. Must be fast. Precompute friend lists, cache block lists. Deny by default, explicit allow.'
      },
      requirements: {
        functional: [
          'Audience-based content visibility',
          'Block user functionality',
          'Hide from specific people',
          'Activity log for transparency'
        ],
        nonFunctional: [
          'Privacy check < 10ms',
          'Correct 100% of the time'
        ]
      },
      hints: [
        'Check: isFriend(viewer, author) && !isBlocked(viewer, author) && inAudience(viewer, post.audience)',
        'Cache: friend list, block list per user',
        'Activity log: who viewed, when, from where'
      ],
      expectedComponents: ['Permission Checker', 'Block Manager', 'Activity Logger'],
      successCriteria: ['Privacy enforced', 'No leaks'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Global Infrastructure',
      phase: 4,
      phaseTitle: 'Platform Scale',
      learningObjective: 'Serve billions of users worldwide',
      thinkingFramework: {
        framework: 'Planetary Scale',
        approach: 'Multi-region deployment. User data in nearest region. Global CDN for static content. Eventually consistent where possible, strong where needed.',
        keyInsight: 'Consistency vs latency tradeoff. Profile can be eventually consistent (1 sec lag ok). Friend acceptance needs strong consistency. Choose per operation.'
      },
      requirements: {
        functional: [
          'Multi-region data storage',
          'Global CDN for media',
          'Cross-region replication',
          'Disaster recovery'
        ],
        nonFunctional: [
          'Page load < 2 seconds globally',
          '99.99% availability'
        ]
      },
      hints: [
        'Regions: NA, EU, APAC, LATAM - user assigned to nearest',
        'Replication: async for most data, sync for critical',
        'Failover: automatic region failover, < 1 minute'
      ],
      expectedComponents: ['Region Router', 'Replication Engine', 'CDN Layer'],
      successCriteria: ['Global low latency', 'High availability'],
      estimatedTime: '8 minutes'
    }
  ]
};
