import { GuidedTutorial } from '../../types/guidedTutorial';

export const redditProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'reddit-progressive-guided',
  title: 'Design Reddit - Progressive Journey',
  description: 'Build a social news aggregation platform that evolves from basic posts to a community-driven content ecosystem with voting and moderation',
  difficulty: 'progressive',
  estimatedTime: '4-6 hours across all phases',

  systemContext: {
    title: 'Reddit',
    description: 'A social news aggregation and discussion platform organized into topic-based communities (subreddits)',
    requirements: [
      'Create and join communities (subreddits)',
      'Post links, text, images, and videos',
      'Upvote/downvote content with ranking algorithms',
      'Nested comment threads with voting',
      'Personalized home feed based on subscriptions',
      'Community moderation tools'
    ],
    existingInfrastructure: 'Starting fresh - you are building a new social content platform'
  },

  phases: [
    {
      id: 'phase-1-beginner',
      name: 'Phase 1: Basic Posting',
      description: 'Your startup "ThreadIt" is building a link sharing platform. Users need to post content and vote on it. Start with the fundamentals.',
      difficulty: 'beginner',
      requiredSteps: ['step-1', 'step-2', 'step-3'],
      unlockCriteria: null
    },
    {
      id: 'phase-2-intermediate',
      name: 'Phase 2: Communities & Comments',
      description: 'ThreadIt has 1M users! They want topic-based communities and discussions. Time to add subreddits and threaded comments.',
      difficulty: 'intermediate',
      requiredSteps: ['step-4', 'step-5', 'step-6'],
      unlockCriteria: { completedPhases: ['phase-1-beginner'] }
    },
    {
      id: 'phase-3-advanced',
      name: 'Phase 3: Feed & Moderation',
      description: 'ThreadIt has 50M users across thousands of communities. You need personalized feeds, moderation tools, and content policies.',
      difficulty: 'advanced',
      requiredSteps: ['step-7', 'step-8', 'step-9'],
      unlockCriteria: { completedPhases: ['phase-2-intermediate'] }
    },
    {
      id: 'phase-4-expert',
      name: 'Phase 4: Scale & Intelligence',
      description: 'ThreadIt is competing with Reddit. Time to add real-time features, recommendation algorithms, and handle viral content.',
      difficulty: 'expert',
      requiredSteps: ['step-10', 'step-11', 'step-12'],
      unlockCriteria: { completedPhases: ['phase-3-advanced'] }
    }
  ],

  steps: [
    // ============== PHASE 1: BASIC POSTING ==============
    {
      id: 'step-1',
      title: 'Post Data Model',
      phase: 'phase-1-beginner',
      description: 'Design the data model for posts supporting text, links, images, and videos',
      order: 1,

      educationalContent: {
        title: 'Modeling User-Generated Content',
        explanation: `Reddit posts can be text, links, images, videos, or polls. The data model must support all these types while tracking votes and engagement.

**Post Model:**
\`\`\`typescript
interface Post {
  id: string;
  subredditId: string;
  authorId: string;
  title: string;
  type: 'text' | 'link' | 'image' | 'video' | 'poll';

  // Content varies by type
  content?: string;        // For text posts
  url?: string;            // For link posts
  mediaUrls?: string[];    // For image/video posts
  thumbnail?: string;

  // Voting
  upvotes: number;
  downvotes: number;
  score: number;           // upvotes - downvotes
  upvoteRatio: number;     // upvotes / total votes

  // Engagement
  commentCount: number;
  isLocked: boolean;       // No new comments
  isStickied: boolean;     // Pinned to top

  // Metadata
  createdAt: Date;
  editedAt?: Date;
  flair?: string;          // Category tag
  nsfw: boolean;
  spoiler: boolean;
}
\`\`\`

**Vote Storage:**
\`\`\`typescript
interface Vote {
  id: string;
  userId: string;
  targetId: string;        // Post or comment ID
  targetType: 'post' | 'comment';
  value: 1 | -1;           // Upvote or downvote
  createdAt: Date;
}

// Index: (userId, targetId) - unique constraint
// Index: (targetId) - for counting votes
\`\`\`

**Denormalization for Performance:**
Store vote counts on the post itself (denormalized) for fast reads, update asynchronously.`,
        keyInsight: 'Vote counts are denormalized onto posts for fast reads, but individual votes are stored separately for user vote history and preventing double-voting',
        commonMistakes: [
          'Counting votes on every read (too slow)',
          'Not storing individual votes (cant show user their votes)',
          'Single content field for all post types'
        ],
        interviewTips: [
          'Explain denormalization of vote counts',
          'Discuss how to handle different post types',
          'Mention the upvote ratio for quality signals'
        ],
        realWorldExample: 'Reddit shows vote counts and your vote state instantly because counts are cached on posts, not computed per request.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Post Service', 'Post Database', 'Object Storage'],

      hints: [
        { trigger: 'stuck', content: 'Posts have different types (text, link, image). Store vote counts denormalized on the post.' },
        { trigger: 'count_votes', content: 'Dont count votes on every read. Denormalize the count onto the post.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Post Service' },
          { from: 'Post Service', to: 'Post Database' }
        ],
        requiredComponents: ['Post Service', 'Post Database', 'Object Storage']
      },

      thinkingFramework: {
        approach: 'data-modeling',
        questions: [
          'What types of content can users post?',
          'How do we efficiently track vote counts?',
          'How do we prevent users from voting twice?'
        ],
        tradeoffs: [
          { option: 'Count votes per request', pros: ['Always accurate'], cons: ['Slow', 'DB load'] },
          { option: 'Denormalized counts', pros: ['Fast reads'], cons: ['Eventual consistency'] }
        ]
      }
    },

    {
      id: 'step-2',
      title: 'Voting System',
      phase: 'phase-1-beginner',
      description: 'Implement upvoting and downvoting with score calculation',
      order: 2,

      educationalContent: {
        title: 'Building a Voting System',
        explanation: `Reddit's voting system is core to content ranking. Users can upvote, downvote, or remove their vote.

**Vote State Machine:**
\`\`\`
No vote → Upvote:    score += 1
No vote → Downvote:  score -= 1
Upvote → No vote:    score -= 1
Upvote → Downvote:   score -= 2
Downvote → No vote:  score += 1
Downvote → Upvote:   score += 2
\`\`\`

**Vote Processing:**
\`\`\`typescript
async function vote(userId: string, postId: string, value: 1 | -1 | 0) {
  const existingVote = await getVote(userId, postId);

  // Calculate score delta
  let delta = value;
  if (existingVote) {
    delta -= existingVote.value;
  }

  // Update or create vote record
  if (value === 0) {
    await deleteVote(userId, postId);
  } else {
    await upsertVote(userId, postId, value);
  }

  // Update post score (async for performance)
  await updatePostScore(postId, delta);
}
\`\`\`

**Vote Fuzzing:**
Reddit "fuzzes" exact vote counts for anti-manipulation:
\`\`\`
Actual: 1543 upvotes, 234 downvotes
Displayed: ~1500 upvotes (within ±5%)

Why? Prevents:
- Detecting shadowbans
- Gaming algorithms
- Vote manipulation detection
\`\`\`

**Karma System:**
User reputation from net upvotes received:
\`\`\`typescript
interface UserKarma {
  userId: string;
  postKarma: number;      // From post upvotes
  commentKarma: number;   // From comment upvotes
  awardeeKarma: number;   // From receiving awards
  awarderKarma: number;   // From giving awards
}
\`\`\``,
        keyInsight: 'Vote fuzzing prevents manipulation by hiding exact counts - users see approximate values while the system maintains accurate internal counts',
        commonMistakes: [
          'Allowing multiple votes per user',
          'Not handling vote changes (upvote to downvote)',
          'Showing exact vote counts (enables manipulation detection)'
        ],
        interviewTips: [
          'Explain the vote state machine',
          'Discuss vote fuzzing for anti-manipulation',
          'Mention karma as accumulated reputation'
        ],
        realWorldExample: 'Reddit vote counts fluctuate slightly on refresh - this is intentional fuzzing to prevent users from detecting if their votes are being counted.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Vote Service', 'Vote Database', 'Post Service', 'Kafka'],

      hints: [
        { trigger: 'stuck', content: 'Voting is a state machine: none→up, none→down, up→down, etc. Calculate delta correctly.' },
        { trigger: 'exact_counts', content: 'Fuzz vote counts slightly to prevent manipulation detection.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Vote Service' },
          { from: 'Vote Service', to: 'Vote Database' },
          { from: 'Vote Service', to: 'Kafka' }
        ],
        requiredComponents: ['Vote Service', 'Vote Database']
      },

      thinkingFramework: {
        approach: 'state-management',
        questions: [
          'What are all possible vote transitions?',
          'How do we prevent double voting?',
          'Why fuzz vote counts?'
        ],
        tradeoffs: [
          { option: 'Exact counts', pros: ['Transparent'], cons: ['Enables gaming'] },
          { option: 'Fuzzed counts', pros: ['Prevents manipulation'], cons: ['Less transparent'] }
        ]
      }
    },

    {
      id: 'step-3',
      title: 'Hot/New/Top Rankings',
      phase: 'phase-1-beginner',
      description: 'Implement different sorting algorithms for content discovery',
      order: 3,

      educationalContent: {
        title: 'Content Ranking Algorithms',
        explanation: `Reddit offers multiple sorting options, each with different algorithms:

**New:** Simple chronological
\`\`\`
ORDER BY created_at DESC
\`\`\`

**Top:** Highest score in time period
\`\`\`
ORDER BY score DESC
WHERE created_at > (now - period)
\`\`\`

**Hot (Reddit's Algorithm):**
\`\`\`python
def hot_score(ups, downs, created_at):
    score = ups - downs
    order = log10(max(abs(score), 1))
    sign = 1 if score > 0 else -1 if score < 0 else 0
    seconds = created_at - 1134028003  # Reddit epoch
    return round(sign * order + seconds / 45000, 7)
\`\`\`

Key insight: Time contributes linearly, votes logarithmically.
- 10 votes in first hour ≈ 100 votes in 10th hour
- New content gets a chance even with fewer votes

**Controversial:**
High engagement, split votes:
\`\`\`python
def controversial_score(ups, downs):
    if ups <= 0 or downs <= 0:
        return 0
    magnitude = ups + downs
    balance = min(ups, downs) / max(ups, downs)
    return magnitude * balance
\`\`\`

**Best (Wilson Score):**
Statistical confidence that content is good:
\`\`\`
Accounts for sample size
10 upvotes, 0 downvotes is less confident than
100 upvotes, 10 downvotes
\`\`\``,
        keyInsight: 'Hot ranking combines time decay with logarithmic vote scaling - this gives new posts a chance while still surfacing highly-voted content',
        commonMistakes: [
          'Only using vote count (old popular posts dominate)',
          'Linear time decay (too aggressive)',
          'Not offering multiple sort options'
        ],
        interviewTips: [
          'Explain the hot algorithm with time + log(votes)',
          'Discuss why new posts need a boost',
          'Mention Wilson score for statistical confidence'
        ],
        realWorldExample: 'Reddit Hot algorithm ensures a post with 100 votes posted 10 hours ago ranks similarly to a post with 10 votes posted 1 hour ago.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Ranking Service', 'Post Database', 'Redis Cache'],

      hints: [
        { trigger: 'stuck', content: 'Hot = time + log(votes). This balances recency with popularity.' },
        { trigger: 'votes_only', content: 'Pure vote count lets old posts dominate forever. Add time decay.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Ranking Service' },
          { from: 'Ranking Service', to: 'Redis Cache' }
        ],
        requiredComponents: ['Ranking Service', 'Redis Cache']
      },

      thinkingFramework: {
        approach: 'algorithm-design',
        questions: [
          'How do we balance recency vs popularity?',
          'Why use logarithmic scaling for votes?',
          'What sort options should users have?'
        ],
        tradeoffs: [
          { option: 'Pure chronological', pros: ['Simple', 'Fair to new'], cons: ['Quality varies'] },
          { option: 'Hot algorithm', pros: ['Quality + fresh'], cons: ['Complex', 'Gaming possible'] }
        ]
      }
    },

    // ============== PHASE 2: COMMUNITIES & COMMENTS ==============
    {
      id: 'step-4',
      title: 'Subreddits',
      phase: 'phase-2-intermediate',
      description: 'Build the community system with subreddit creation, rules, and membership',
      order: 4,

      educationalContent: {
        title: 'Topic-Based Communities',
        explanation: `Subreddits are Reddit's core organizational unit - topic-based communities with their own rules, moderators, and culture.

**Subreddit Model:**
\`\`\`typescript
interface Subreddit {
  id: string;
  name: string;           // r/programming
  displayName: string;    // Programming
  description: string;
  rules: Rule[];
  sidebar: string;        // Community info (markdown)

  // Settings
  type: 'public' | 'restricted' | 'private';
  nsfw: boolean;
  allowImages: boolean;
  allowVideos: boolean;
  allowPolls: boolean;
  requiredFlair: boolean;

  // Stats
  memberCount: number;
  activeUsers: number;    // Online now
  createdAt: Date;

  // Moderation
  moderatorIds: string[];
  bannedUserIds: string[];
  automodRules: AutomodRule[];
}

interface Membership {
  userId: string;
  subredditId: string;
  role: 'member' | 'moderator' | 'admin';
  joinedAt: Date;
}
\`\`\`

**Subreddit Types:**
- **Public:** Anyone can view and post
- **Restricted:** Anyone can view, only approved can post
- **Private:** Only approved members can view

**Post Flairs:**
Category tags defined by subreddit:
\`\`\`typescript
interface Flair {
  id: string;
  subredditId: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  modOnly: boolean;  // Only mods can assign
}
\`\`\``,
        keyInsight: 'Subreddits enable distributed moderation - each community sets its own rules and moderators enforce them, scaling content moderation horizontally',
        commonMistakes: [
          'Single global moderation (doesnt scale)',
          'No distinction between public/private communities',
          'Missing community-specific rules'
        ],
        interviewTips: [
          'Explain the three subreddit types',
          'Discuss how distributed moderation scales',
          'Mention post flairs for categorization'
        ],
        realWorldExample: 'r/science requires academic sources and has strict commenting rules, while r/memes allows anything. Different communities, different rules.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Subreddit Service', 'Subreddit Database', 'Membership Service'],

      hints: [
        { trigger: 'stuck', content: 'Subreddits have types (public/restricted/private) and community-specific rules.' },
        { trigger: 'global_rules', content: 'Each subreddit defines its own rules. Moderation is distributed.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Subreddit Service' },
          { from: 'Subreddit Service', to: 'Subreddit Database' }
        ],
        requiredComponents: ['Subreddit Service', 'Subreddit Database', 'Membership Service']
      },

      thinkingFramework: {
        approach: 'community-design',
        questions: [
          'What visibility options should communities have?',
          'How do community-specific rules work?',
          'How do we scale moderation across thousands of communities?'
        ],
        tradeoffs: [
          { option: 'Centralized moderation', pros: ['Consistent'], cons: ['Doesnt scale'] },
          { option: 'Distributed moderation', pros: ['Scales'], cons: ['Inconsistent enforcement'] }
        ]
      }
    },

    {
      id: 'step-5',
      title: 'Threaded Comments',
      phase: 'phase-2-intermediate',
      description: 'Implement nested comment threads with voting and collapsing',
      order: 5,

      educationalContent: {
        title: 'Nested Discussion Threads',
        explanation: `Reddit comments form a tree structure with unlimited nesting depth.

**Comment Model:**
\`\`\`typescript
interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentId?: string;      // null for top-level
  content: string;

  // Tree structure
  depth: number;          // 0 for top-level
  path: string;           // "001.003.002" for tree traversal

  // Voting
  score: number;
  upvotes: number;
  downvotes: number;

  // Metadata
  createdAt: Date;
  editedAt?: Date;
  isDeleted: boolean;     // Keep for tree structure
  childCount: number;
}
\`\`\`

**Tree Storage Options:**

**Adjacency List (Simple):**
\`\`\`sql
SELECT * FROM comments WHERE post_id = ?
-- Then build tree in application
\`\`\`

**Materialized Path:**
\`\`\`
path = "001.003.002"
-- Ancestor query: WHERE path LIKE '001.003%'
-- Efficient for subtree queries
\`\`\`

**Loading Strategy:**
\`\`\`
1. Load top N top-level comments (sorted by best/hot/new)
2. For each, load top M replies
3. Show "Load more comments" for rest
4. Deep threads: "Continue this thread →"
\`\`\`

**Deleted Comments:**
\`\`\`
[deleted] - User deleted, keep if has replies
[removed] - Mod removed, keep if has replies
Fully delete only if no children
\`\`\``,
        keyInsight: 'Comment trees use materialized paths for efficient subtree queries, with lazy loading to handle threads with thousands of comments',
        commonMistakes: [
          'Loading entire comment tree (crashes on popular posts)',
          'Deleting comments that have replies (breaks tree)',
          'No depth limit (infinite nesting is UX nightmare)'
        ],
        interviewTips: [
          'Explain materialized path for tree queries',
          'Discuss lazy loading strategy for large threads',
          'Mention handling deleted comments with replies'
        ],
        realWorldExample: 'Reddit caps visible depth at ~10 levels and shows "Continue this thread" to prevent infinite nesting in the UI.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Comment Service', 'Comment Database', 'Vote Service'],

      hints: [
        { trigger: 'stuck', content: 'Comments form a tree. Use materialized paths for efficient subtree queries.' },
        { trigger: 'load_all', content: 'Dont load entire tree. Lazy load with "Load more comments".' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Comment Service' },
          { from: 'Comment Service', to: 'Comment Database' }
        ],
        requiredComponents: ['Comment Service', 'Comment Database']
      },

      thinkingFramework: {
        approach: 'tree-structure',
        questions: [
          'How do we store hierarchical comments?',
          'How do we efficiently query subtrees?',
          'How do we handle very deep threads?'
        ],
        tradeoffs: [
          { option: 'Adjacency list', pros: ['Simple'], cons: ['Slow subtree queries'] },
          { option: 'Materialized path', pros: ['Fast subtree'], cons: ['Path updates on move'] }
        ]
      }
    },

    {
      id: 'step-6',
      title: 'User Subscriptions',
      phase: 'phase-2-intermediate',
      description: 'Implement subreddit subscriptions and subscription-based feeds',
      order: 6,

      educationalContent: {
        title: 'Personalized Subscriptions',
        explanation: `Users subscribe to subreddits to build their personalized home feed.

**Subscription Model:**
\`\`\`typescript
interface Subscription {
  userId: string;
  subredditId: string;
  subscribedAt: Date;
  notifications: 'all' | 'hot' | 'none';
}

// Index: (userId) - get all subscriptions
// Index: (subredditId) - get subscriber count
\`\`\`

**Home Feed Generation:**
\`\`\`
User's home feed = posts from subscribed subreddits

Challenge: User subscribes to 50 subreddits
Each has 100 new posts/day = 5000 posts

Approach:
1. Get user's subscriptions
2. Query hot posts from each (with limit)
3. Merge and rank globally
4. Cache result
\`\`\`

**Feed Personalization:**
\`\`\`
Weight by engagement:
- Subreddits you interact with more → higher weight
- Recently joined subreddits → boost to show content
- Low-activity subreddits → occasional surfacing

Prevent single subreddit domination:
- Max 3 posts from same subreddit in top 25
\`\`\`

**Default Subscriptions:**
New users auto-subscribe to popular defaults:
\`\`\`
r/announcements
r/funny
r/pics
r/askreddit
...
\`\`\``,
        keyInsight: 'Home feed merges posts from all subscribed subreddits with diversity constraints - no single subreddit should dominate the feed',
        commonMistakes: [
          'No diversity constraint (one active subreddit dominates)',
          'Querying all posts from all subscriptions (too slow)',
          'No default subscriptions for new users'
        ],
        interviewTips: [
          'Explain feed generation from subscriptions',
          'Discuss diversity constraints',
          'Mention engagement weighting'
        ],
        realWorldExample: 'Reddit limits the same subreddit to a few posts in your top feed, even if that subreddit is very active.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Subscription Service', 'Feed Service', 'Redis Cache'],

      hints: [
        { trigger: 'stuck', content: 'Home feed merges posts from subscriptions with diversity limits (max N from same subreddit).' },
        { trigger: 'no_diversity', content: 'Without limits, one active subreddit dominates. Cap posts per subreddit.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Feed Service' },
          { from: 'Feed Service', to: 'Subscription Service' },
          { from: 'Feed Service', to: 'Redis Cache' }
        ],
        requiredComponents: ['Subscription Service', 'Feed Service', 'Redis Cache']
      },

      thinkingFramework: {
        approach: 'feed-generation',
        questions: [
          'How do we generate a personalized home feed?',
          'How do we prevent one subreddit from dominating?',
          'How do we handle users with many subscriptions?'
        ],
        tradeoffs: [
          { option: 'All posts from subscriptions', pros: ['Complete'], cons: ['Slow', 'Overwhelming'] },
          { option: 'Sampled with diversity', pros: ['Fast', 'Diverse'], cons: ['May miss content'] }
        ]
      }
    },

    // ============== PHASE 3: FEED & MODERATION ==============
    {
      id: 'step-7',
      title: 'Moderation Tools',
      phase: 'phase-3-advanced',
      description: 'Build moderation features: remove posts, ban users, automod rules',
      order: 7,

      educationalContent: {
        title: 'Community Moderation',
        explanation: `Reddit's moderation is distributed - each subreddit has moderators who enforce community rules.

**Moderation Actions:**
\`\`\`typescript
interface ModAction {
  id: string;
  subredditId: string;
  moderatorId: string;
  action: 'remove_post' | 'remove_comment' | 'ban_user' |
          'mute_user' | 'approve' | 'lock' | 'sticky';
  targetId: string;
  targetType: 'post' | 'comment' | 'user';
  reason: string;
  createdAt: Date;
}

interface UserBan {
  userId: string;
  subredditId: string;
  bannedBy: string;
  reason: string;
  duration: number | null;  // null = permanent
  bannedAt: Date;
  expiresAt?: Date;
}
\`\`\`

**AutoModerator:**
Rule-based automatic moderation:
\`\`\`yaml
# Remove posts with certain keywords
type: submission
title (includes): ["spam", "scam"]
action: remove
action_reason: "Spam keyword in title"

# Require minimum karma to post
type: submission
author:
  karma: "< 100"
action: filter
action_reason: "New account filter"
\`\`\`

**Mod Queue:**
Items needing review:
- Reported content
- AutoMod filtered items
- Posts from new users (if configured)

**Mod Log:**
Transparent record of all mod actions for accountability.`,
        keyInsight: 'AutoModerator handles high-volume rule enforcement automatically, letting human moderators focus on edge cases and appeals',
        commonMistakes: [
          'No automated moderation (humans cant scale)',
          'No mod action logging (no accountability)',
          'Permanent bans only (no temp bans)'
        ],
        interviewTips: [
          'Explain the mod action types',
          'Discuss AutoModerator for scalable enforcement',
          'Mention mod queue for pending reviews'
        ],
        realWorldExample: 'Reddit AutoModerator can process thousands of posts per minute with rules like "remove posts from accounts less than 7 days old".'
      },

      requiredComponents: ['Client', 'API Gateway', 'Moderation Service', 'Mod Action Database', 'AutoMod Engine', 'Report Queue'],

      hints: [
        { trigger: 'stuck', content: 'Moderation = human actions + AutoMod rules. Log everything for accountability.' },
        { trigger: 'manual_only', content: 'Manual moderation doesnt scale. Add AutoModerator for rule-based filtering.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Moderation Service' },
          { from: 'Moderation Service', to: 'AutoMod Engine' },
          { from: 'Moderation Service', to: 'Report Queue' }
        ],
        requiredComponents: ['Moderation Service', 'AutoMod Engine', 'Report Queue']
      },

      thinkingFramework: {
        approach: 'moderation-at-scale',
        questions: [
          'How do we scale moderation across millions of posts?',
          'What actions can moderators take?',
          'How do we ensure moderator accountability?'
        ],
        tradeoffs: [
          { option: 'Human-only moderation', pros: ['Nuanced'], cons: ['Doesnt scale', 'Slow'] },
          { option: 'AutoMod + humans', pros: ['Scales'], cons: ['False positives'] }
        ]
      }
    },

    {
      id: 'step-8',
      title: 'Content Reporting',
      phase: 'phase-3-advanced',
      description: 'Implement user reporting with report routing and review workflows',
      order: 8,

      educationalContent: {
        title: 'User Report System',
        explanation: `Users report rule-violating content. Reports route to appropriate reviewers based on violation type.

**Report Model:**
\`\`\`typescript
interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: 'post' | 'comment' | 'user' | 'message';
  subredditId?: string;

  reason: 'spam' | 'harassment' | 'violence' | 'hate' |
          'misinformation' | 'copyright' | 'other';
  details?: string;

  status: 'pending' | 'reviewed' | 'actioned' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: Date;
  action?: string;
}
\`\`\`

**Report Routing:**
\`\`\`
Subreddit-specific rules → Subreddit moderators
Site-wide violations → Admin/Trust & Safety team

Examples:
- "Breaks r/science rules" → r/science mods
- "Harassment/threats" → Trust & Safety
- "Copyright violation" → Legal team
\`\`\`

**Report Aggregation:**
\`\`\`
Same content reported by multiple users:
- 1 report: Standard queue priority
- 5 reports: Elevated priority
- 10+ reports: Urgent review

Aggregate reports to reduce duplicate work
\`\`\`

**Reporter Reputation:**
Track report accuracy to weight future reports:
\`\`\`typescript
interface ReporterStats {
  userId: string;
  totalReports: number;
  actionedReports: number;
  dismissedReports: number;
  accuracy: number;
}
// High-accuracy reporters' reports get priority
\`\`\``,
        keyInsight: 'Report aggregation groups duplicate reports and prioritizes based on volume - 10 users reporting the same content indicates urgency',
        commonMistakes: [
          'Processing each report separately (duplicates)',
          'No routing (all reports to same queue)',
          'No reporter reputation tracking'
        ],
        interviewTips: [
          'Explain report routing by violation type',
          'Discuss report aggregation for efficiency',
          'Mention reporter reputation weighting'
        ],
        realWorldExample: 'Reddit shows "This has been reported N times" to moderators and prioritizes highly-reported content.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Report Service', 'Report Database', 'Report Queue', 'Trust & Safety Service'],

      hints: [
        { trigger: 'stuck', content: 'Reports route by type: subreddit rules to mods, site-wide to admins. Aggregate duplicates.' },
        { trigger: 'no_routing', content: 'Different violations go to different reviewers. Route based on reason.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Report Service' },
          { from: 'Report Service', to: 'Report Queue' },
          { from: 'Report Queue', to: 'Trust & Safety Service' }
        ],
        requiredComponents: ['Report Service', 'Report Queue', 'Trust & Safety Service']
      },

      thinkingFramework: {
        approach: 'report-workflow',
        questions: [
          'How do we route reports to appropriate reviewers?',
          'How do we handle duplicate reports?',
          'How do we prioritize urgent content?'
        ],
        tradeoffs: [
          { option: 'Single queue', pros: ['Simple'], cons: ['Wrong expertise'] },
          { option: 'Routed queues', pros: ['Right reviewers'], cons: ['More complex'] }
        ]
      }
    },

    {
      id: 'step-9',
      title: 'r/all and Popular',
      phase: 'phase-3-advanced',
      description: 'Build aggregated feeds across all subreddits with filtering',
      order: 9,

      educationalContent: {
        title: 'Cross-Community Aggregation',
        explanation: `r/all and r/popular aggregate content across all subreddits for discovery.

**r/all:**
All public subreddit posts ranked by hot algorithm.

**r/popular:**
Filtered r/all excluding:
- NSFW content
- Quarantined subreddits
- Controversial communities
- Subreddits that opt out

**Ranking Adjustments:**
\`\`\`
Problem: Large subreddits always dominate r/all

Solution: Normalize by subreddit size
adjusted_score = score / log(subscriber_count)

Or: Cap posts per subreddit in top 100
\`\`\`

**Filtering System:**
\`\`\`typescript
interface UserFilters {
  userId: string;
  blockedSubreddits: string[];  // Dont show in r/all
  blockedKeywords: string[];
  nsfwEnabled: boolean;
}
\`\`\`

**Geographic/Language Filtering:**
\`\`\`
r/popular varies by country:
- US: r/politics, r/nfl
- UK: r/ukpolitics, r/soccer
- Germany: r/de, r/soccer

Based on user location or preference
\`\`\``,
        keyInsight: 'r/all normalizes scores by subreddit size to prevent large communities from always dominating - giving smaller communities visibility',
        commonMistakes: [
          'Raw scores (big subreddits always win)',
          'No user filtering (cant block unwanted content)',
          'Same r/popular globally (regional relevance)'
        ],
        interviewTips: [
          'Explain score normalization by subreddit size',
          'Discuss r/popular vs r/all filtering',
          'Mention geographic customization'
        ],
        realWorldExample: 'Reddit r/popular excludes political subreddits by default and varies by country to show regionally relevant content.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Aggregation Service', 'Redis Cache', 'Filter Service'],

      hints: [
        { trigger: 'stuck', content: 'r/all normalizes by subreddit size. r/popular adds content filtering.' },
        { trigger: 'raw_scores', content: 'Big subreddits always win with raw scores. Normalize by subscriber count.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Aggregation Service' },
          { from: 'Aggregation Service', to: 'Redis Cache' },
          { from: 'Aggregation Service', to: 'Filter Service' }
        ],
        requiredComponents: ['Aggregation Service', 'Filter Service']
      },

      thinkingFramework: {
        approach: 'aggregation-fairness',
        questions: [
          'How do we prevent large subreddits from dominating?',
          'What content should be filtered from r/popular?',
          'How do we handle regional relevance?'
        ],
        tradeoffs: [
          { option: 'Pure hot ranking', pros: ['Simple'], cons: ['Big subs dominate'] },
          { option: 'Normalized ranking', pros: ['Fair'], cons: ['May surface lower quality'] }
        ]
      }
    },

    // ============== PHASE 4: SCALE & INTELLIGENCE ==============
    {
      id: 'step-10',
      title: 'Real-Time Updates',
      phase: 'phase-4-expert',
      description: 'Add live vote counts, new comment notifications, and real-time feed updates',
      order: 10,

      educationalContent: {
        title: 'Real-Time Reddit',
        explanation: `Reddit shows live updates for votes, comments, and active discussions.

**Real-Time Vote Updates:**
\`\`\`typescript
// WebSocket subscription per post
ws.subscribe('post:abc123:votes');

// Server broadcasts on vote
broadcast('post:abc123:votes', {
  score: 1543,
  upvoteRatio: 0.92
});

// Rate limit broadcasts (batch every 1-5 seconds)
\`\`\`

**Live Comments:**
\`\`\`
User viewing post → Subscribe to new comments
New comment posted → Broadcast to viewers
Client shows "5 new comments" indicator

For popular posts:
- Thousands of concurrent viewers
- Hundreds of new comments/minute
- Fan-out challenge
\`\`\`

**Presence System:**
\`\`\`typescript
interface SubredditPresence {
  subredditId: string;
  activeUsers: number;     // Currently viewing
  viewingPosts: Map<string, number>;  // Users per post
}

// Update every 15-30 seconds
// Show "X users here now" on subreddit
\`\`\`

**Architecture:**
\`\`\`
Post votes/comments → Kafka → WebSocket servers → Clients

WebSocket servers:
- Stateful (track subscriptions)
- Horizontally scaled with sticky sessions
- Or use pub/sub for cross-server broadcast
\`\`\``,
        keyInsight: 'Live updates use pub/sub per post - clients subscribe to posts they view, and votes/comments broadcast only to interested subscribers',
        commonMistakes: [
          'Broadcasting all updates to all users',
          'No batching (too many small updates)',
          'Single WebSocket server (cant scale)'
        ],
        interviewTips: [
          'Explain per-post subscription model',
          'Discuss batching for high-traffic posts',
          'Mention presence tracking for "users online"'
        ],
        realWorldExample: 'Reddit live threads (like sports events) can have 50,000 concurrent users with comments updating in real-time.'
      },

      requiredComponents: ['Client', 'API Gateway', 'WebSocket Gateway', 'Kafka', 'Presence Service', 'Redis Pub/Sub'],

      hints: [
        { trigger: 'stuck', content: 'Clients subscribe to posts they view. Broadcast updates only to subscribers.' },
        { trigger: 'broadcast_all', content: 'Dont broadcast to everyone. Use per-post subscriptions.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'WebSocket Gateway' },
          { from: 'WebSocket Gateway', to: 'Redis Pub/Sub' },
          { from: 'Kafka', to: 'WebSocket Gateway' }
        ],
        requiredComponents: ['WebSocket Gateway', 'Kafka', 'Presence Service', 'Redis Pub/Sub']
      },

      thinkingFramework: {
        approach: 'real-time-architecture',
        questions: [
          'How do we push updates to interested users only?',
          'How do we handle high-traffic posts?',
          'How do we scale WebSocket connections?'
        ],
        tradeoffs: [
          { option: 'Polling', pros: ['Simple'], cons: ['Delayed', 'Wasteful'] },
          { option: 'WebSocket pub/sub', pros: ['Real-time'], cons: ['Connection management'] }
        ]
      }
    },

    {
      id: 'step-11',
      title: 'Content Recommendations',
      phase: 'phase-4-expert',
      description: 'Build recommendation systems for subreddits and posts',
      order: 11,

      educationalContent: {
        title: 'Discovery Algorithms',
        explanation: `Reddit recommends subreddits to join and posts you might like based on your activity.

**Subreddit Recommendations:**
\`\`\`
Signals:
- Subreddits similar users subscribe to
- Subreddits with overlapping content
- Related by topic taxonomy

Collaborative filtering:
"Users who subscribe to r/python also subscribe to r/programming"
\`\`\`

**Post Recommendations:**
\`\`\`
For non-logged-in users:
- Popular content
- Trending topics
- Geographic relevance

For logged-in users:
- Posts from subreddits similar to subscriptions
- Upvoted posts in related communities
- Content from users you've interacted with
\`\`\`

**Cold Start:**
New users with no subscriptions:
\`\`\`
1. Ask interests on signup
2. Show r/popular content
3. Recommend based on first interactions
4. Quickly learn preferences
\`\`\`

**Topic Modeling:**
\`\`\`
Extract topics from post titles/content
Cluster similar subreddits
r/machinelearning ≈ r/deeplearning ≈ r/artificial

Recommend posts across related subreddits
\`\`\``,
        keyInsight: 'Subreddit recommendations use collaborative filtering - "users like you also joined these communities" - combined with topic similarity',
        commonMistakes: [
          'Only recommending popular subreddits',
          'No personalization for logged-in users',
          'Cold start not handled'
        ],
        interviewTips: [
          'Explain collaborative filtering for subreddit recs',
          'Discuss topic modeling for content similarity',
          'Mention cold start handling'
        ],
        realWorldExample: 'Reddit shows "Because you joined r/cats" recommendations, using collaborative filtering from similar users subscription patterns.'
      },

      requiredComponents: ['Recommendation Service', 'ML Model Service', 'Feature Store', 'Subscription Service', 'Topic Model'],

      hints: [
        { trigger: 'stuck', content: 'Use collaborative filtering: users who joined X also joined Y. Add topic similarity.' },
        { trigger: 'popular_only', content: 'Dont just recommend popular subs. Personalize based on user subscriptions.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Recommendation Service', to: 'ML Model Service' },
          { from: 'Recommendation Service', to: 'Feature Store' },
          { from: 'Recommendation Service', to: 'Topic Model' }
        ],
        requiredComponents: ['Recommendation Service', 'ML Model Service', 'Feature Store', 'Topic Model']
      },

      thinkingFramework: {
        approach: 'recommendation-systems',
        questions: [
          'How do we recommend relevant subreddits?',
          'How do we handle new users?',
          'How do we find similar communities?'
        ],
        tradeoffs: [
          { option: 'Popularity-based', pros: ['Simple'], cons: ['Not personalized'] },
          { option: 'Collaborative filtering', pros: ['Personalized'], cons: ['Cold start'] }
        ]
      }
    },

    {
      id: 'step-12',
      title: 'Handling Viral Content',
      phase: 'phase-4-expert',
      description: 'Design for viral posts that get millions of views in hours',
      order: 12,

      educationalContent: {
        title: 'Viral Content at Scale',
        explanation: `Viral posts can get millions of views and thousands of votes/comments per minute.

**Viral Post Characteristics:**
\`\`\`
Normal post: 100 views, 20 votes, 5 comments
Hot post: 10,000 views, 2,000 votes, 200 comments
Viral post: 10M views, 200K votes, 50K comments

All happening within hours!
\`\`\`

**Caching Strategy:**
\`\`\`
Tiered caching:
L1: Edge CDN (static content, thumbnails)
L2: Regional cache (post data)
L3: Origin database

For viral posts:
- Cache post content aggressively
- Aggregate vote updates (batch writes)
- Lazy load comments (paginate heavily)
\`\`\`

**Vote Aggregation:**
\`\`\`typescript
// Don't write to DB on every vote
// Accumulate in Redis, flush periodically

async function recordVote(postId: string, value: number) {
  await redis.hincrby(`votes:${postId}`, 'score', value);
  // Flush to DB every N votes or M seconds
}
\`\`\`

**Comment Sharding:**
\`\`\`
Post with 50,000 comments:
- Can't load all at once
- Shard by top-level comment ID
- Load top comments, lazy load rest
\`\`\`

**Rate Limiting:**
\`\`\`
Per-user: 1 vote per post, N comments per minute
Per-IP: Detect bot voting patterns
Gradual limits during surge
\`\`\``,
        keyInsight: 'Viral content requires write aggregation (batch votes), heavy caching, and aggressive pagination - direct database writes per action would fail under load',
        commonMistakes: [
          'Direct DB write per vote (overload)',
          'Loading all comments at once',
          'No rate limiting during surges'
        ],
        interviewTips: [
          'Explain vote aggregation in Redis',
          'Discuss tiered caching for viral content',
          'Mention comment sharding/pagination'
        ],
        realWorldExample: 'When Obama did an AMA, Reddit got 5+ million page views per hour. They had to implement aggressive caching and rate limiting to survive.'
      },

      requiredComponents: ['CDN', 'API Gateway', 'Redis Cache', 'Write Aggregator', 'Database Cluster', 'Rate Limiter'],

      hints: [
        { trigger: 'stuck', content: 'Viral posts need: write aggregation (batch votes in Redis), heavy caching, comment pagination.' },
        { trigger: 'direct_writes', content: 'Direct DB writes per vote will fail. Aggregate in Redis, flush periodically.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'CDN' },
          { from: 'CDN', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Redis Cache' },
          { from: 'Redis Cache', to: 'Write Aggregator' },
          { from: 'Write Aggregator', to: 'Database Cluster' }
        ],
        requiredComponents: ['CDN', 'Redis Cache', 'Write Aggregator', 'Rate Limiter']
      },

      thinkingFramework: {
        approach: 'surge-handling',
        questions: [
          'How do we handle 100K votes per minute?',
          'How do we serve millions of reads?',
          'How do we prevent service degradation?'
        ],
        tradeoffs: [
          { option: 'Direct writes', pros: ['Immediate consistency'], cons: ['Fails under load'] },
          { option: 'Aggregated writes', pros: ['Handles surge'], cons: ['Slight delay in counts'] }
        ]
      }
    }
  ],

  sandboxConfig: {
    availableComponents: [
      { type: 'Client', category: 'client' },
      { type: 'API Gateway', category: 'gateway' },
      { type: 'CDN', category: 'gateway' },
      { type: 'WebSocket Gateway', category: 'gateway' },
      { type: 'Post Service', category: 'service' },
      { type: 'Vote Service', category: 'service' },
      { type: 'Ranking Service', category: 'service' },
      { type: 'Subreddit Service', category: 'service' },
      { type: 'Comment Service', category: 'service' },
      { type: 'Subscription Service', category: 'service' },
      { type: 'Membership Service', category: 'service' },
      { type: 'Feed Service', category: 'service' },
      { type: 'Moderation Service', category: 'service' },
      { type: 'Report Service', category: 'service' },
      { type: 'Aggregation Service', category: 'service' },
      { type: 'Filter Service', category: 'service' },
      { type: 'Presence Service', category: 'service' },
      { type: 'Recommendation Service', category: 'service' },
      { type: 'Trust & Safety Service', category: 'service' },
      { type: 'AutoMod Engine', category: 'service' },
      { type: 'ML Model Service', category: 'service' },
      { type: 'Topic Model', category: 'service' },
      { type: 'Write Aggregator', category: 'service' },
      { type: 'Rate Limiter', category: 'service' },
      { type: 'Post Database', category: 'database' },
      { type: 'Vote Database', category: 'database' },
      { type: 'Subreddit Database', category: 'database' },
      { type: 'Comment Database', category: 'database' },
      { type: 'Report Database', category: 'database' },
      { type: 'Mod Action Database', category: 'database' },
      { type: 'Database Cluster', category: 'database' },
      { type: 'Object Storage', category: 'storage' },
      { type: 'Redis Cache', category: 'storage' },
      { type: 'Feature Store', category: 'storage' },
      { type: 'Kafka', category: 'messaging' },
      { type: 'Report Queue', category: 'messaging' },
      { type: 'Redis Pub/Sub', category: 'messaging' }
    ]
  },

  learningObjectives: [
    'Design content models supporting multiple post types',
    'Build voting systems with score calculation and fuzzing',
    'Implement ranking algorithms (hot, new, top, controversial)',
    'Create topic-based communities with distributed moderation',
    'Build nested comment threads with materialized paths',
    'Design subscription-based personalized feeds',
    'Implement moderation tools with AutoModerator',
    'Build report systems with routing and aggregation',
    'Create cross-community aggregation (r/all, r/popular)',
    'Add real-time updates with WebSocket pub/sub',
    'Build recommendation systems for content discovery',
    'Handle viral content with caching and write aggregation'
  ],

  prerequisites: [
    'Understanding of ranking algorithms',
    'Familiarity with tree data structures',
    'Basic knowledge of caching strategies',
    'Understanding of pub/sub patterns'
  ],

  interviewRelevance: {
    commonQuestions: [
      'Design Reddit',
      'Design a social news aggregation site',
      'How would you implement a voting system?',
      'Design a comment threading system',
      'How would you rank content by popularity and recency?'
    ],
    keyTakeaways: [
      'Vote counts are denormalized and fuzzed',
      'Hot ranking = time + log(votes)',
      'Comments use materialized paths for tree queries',
      'Distributed moderation scales with AutoMod',
      'Viral content needs write aggregation and heavy caching'
    ],
    frequentMistakes: [
      'Counting votes on every read',
      'Pure chronological or pure popularity ranking',
      'Loading entire comment trees',
      'Direct database writes for viral content'
    ]
  }
};
