import { GuidedTutorial } from '../../types/guidedTutorial';

export const tinderProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'tinder-progressive',
  title: 'Design Tinder',
  description: 'Build a dating app from basic matching to AI-powered recommendations',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design geolocation-based user discovery',
    'Implement swipe and matching algorithms',
    'Build real-time chat for matches',
    'Handle recommendation and ranking',
    'Scale to millions of active users'
  ],
  prerequisites: ['Geolocation', 'Real-time systems', 'Recommendation systems'],
  tags: ['dating', 'matching', 'geolocation', 'real-time', 'recommendations'],

  progressiveStory: {
    title: 'Tinder Evolution',
    premise: "You're building a location-based dating app. Starting with simple profile cards and swipes, you'll evolve to support smart matching, real-time chat, and AI-powered recommendations.",
    phases: [
      { phase: 1, title: 'Profiles & Swipes', description: 'Basic matching mechanics' },
      { phase: 2, title: 'Discovery', description: 'Location and preferences' },
      { phase: 3, title: 'Matching', description: 'Smart recommendations' },
      { phase: 4, title: 'Engagement', description: 'Chat and features' }
    ]
  },

  steps: [
    // PHASE 1: Profiles & Swipes (Steps 1-3)
    {
      id: 'step-1',
      title: 'User Profiles',
      phase: 1,
      phaseTitle: 'Profiles & Swipes',
      learningObjective: 'Create compelling dating profiles',
      thinkingFramework: {
        framework: 'Profile Optimization',
        approach: 'Photos are primary (up to 9). Bio and prompts secondary. Verify photos to reduce catfishing. Smart photo ordering based on performance.',
        keyInsight: 'First photo determines 90% of swipes. Photo quality and order matter more than bio. A/B test photo order to maximize right swipes.'
      },
      requirements: {
        functional: [
          'Upload up to 9 photos',
          'Add bio and prompts',
          'Set basic info (age, gender, job)',
          'Photo verification'
        ],
        nonFunctional: [
          'Photo upload < 3 seconds',
          'Profile load < 500ms'
        ]
      },
      hints: [
        'Profile: {user_id, photos: [{url, order, verified}], bio, prompts: [{question, answer}]}',
        'Verification: selfie matching against photos using face recognition',
        'Smart photos: track swipe rate per photo, auto-reorder'
      ],
      expectedComponents: ['Profile Store', 'Photo Service', 'Verification System'],
      successCriteria: ['Profiles created', 'Photos verified'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Swipe Mechanics',
      phase: 1,
      phaseTitle: 'Profiles & Swipes',
      learningObjective: 'Implement the core swipe interaction',
      thinkingFramework: {
        framework: 'Binary Decision',
        approach: 'Left = pass, Right = like, Up = super like. Record every swipe. Mutual likes = match. Rate limit swipes (free tier).',
        keyInsight: 'Swipe is fast, low-commitment action. Average user swipes 100+ times per session. Storage and processing must handle high volume.'
      },
      requirements: {
        functional: [
          'Swipe left (pass) or right (like)',
          'Super like (limited per day)',
          'Undo last swipe (premium)',
          'Record all swipe decisions'
        ],
        nonFunctional: [
          'Swipe recording < 100ms',
          'Rate limit: 100 right swipes/day (free)'
        ]
      },
      hints: [
        'Swipe: {swiper_id, swiped_id, action: pass|like|superlike, timestamp}',
        'Super like: limited resource, 1/day free, more with premium',
        'Undo: soft delete last swipe, time-limited'
      ],
      expectedComponents: ['Swipe Handler', 'Rate Limiter', 'Swipe Store'],
      successCriteria: ['Swipes recorded', 'Rate limits enforced'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Match Detection',
      phase: 1,
      phaseTitle: 'Profiles & Swipes',
      learningObjective: 'Detect mutual likes and create matches',
      thinkingFramework: {
        framework: 'Mutual Interest',
        approach: 'On like, check if other person already liked you. If yes → match! Notify both users. Match unlocks chat.',
        keyInsight: 'Match check must be fast - happens on every like. Index swipes by (swiper, swiped) for O(1) lookup. Match is the magic moment.'
      },
      requirements: {
        functional: [
          'Detect mutual likes instantly',
          'Create match record',
          'Notify both users',
          'Show match animation'
        ],
        nonFunctional: [
          'Match detection < 50ms',
          'Notification delivery < 1 second'
        ]
      },
      hints: [
        'Check: SELECT * FROM swipes WHERE swiper_id = B AND swiped_id = A AND action = like',
        'Match: {user_a, user_b, matched_at, chat_id}',
        'Notification: push + in-app animation'
      ],
      expectedComponents: ['Match Detector', 'Match Store', 'Notification Service'],
      successCriteria: ['Matches detected', 'Users notified'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Discovery (Steps 4-6)
    {
      id: 'step-4',
      title: 'Location-Based Discovery',
      phase: 2,
      phaseTitle: 'Discovery',
      learningObjective: 'Find users within distance radius',
      thinkingFramework: {
        framework: 'Geospatial Queries',
        approach: 'Store user location. Query users within radius. Update location periodically. Balance precision vs privacy.',
        keyInsight: 'Exact location is sensitive. Use geohash for approximate matching. Show distance range (2 miles away) not exact. Update on app open.'
      },
      requirements: {
        functional: [
          'Store user location',
          'Query users within radius',
          'Distance preference setting',
          'Show approximate distance'
        ],
        nonFunctional: [
          'Location query < 200ms',
          'Radius: 1-100 miles'
        ]
      },
      hints: [
        'Location: {user_id, lat, lng, geohash, updated_at}',
        'Query: geohash prefix match + distance filter',
        'Privacy: round to nearest mile for display'
      ],
      expectedComponents: ['Location Store', 'Geo Query', 'Distance Calculator'],
      successCriteria: ['Nearby users found', 'Distance accurate'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Preference Filtering',
      phase: 2,
      phaseTitle: 'Discovery',
      learningObjective: 'Filter candidates by user preferences',
      thinkingFramework: {
        framework: 'Preference Matching',
        approach: 'User sets preferences: age range, gender, distance. Filter candidates before showing. Bidirectional - both users preferences must match.',
        keyInsight: 'Bidirectional matching is key. You want women 25-35, but are you in their preference? Both sides must match for candidate to appear.'
      },
      requirements: {
        functional: [
          'Set age range preference',
          'Set gender preference',
          'Set distance preference',
          'Bidirectional preference matching'
        ],
        nonFunctional: [
          'Filter evaluation < 50ms per candidate'
        ]
      },
      hints: [
        'Preferences: {min_age, max_age, genders: [], max_distance}',
        'Bidirectional: A sees B only if A matches B.prefs AND B matches A.prefs',
        'Deal breakers: hard filters vs nice-to-haves'
      ],
      expectedComponents: ['Preference Store', 'Filter Engine', 'Bidirectional Matcher'],
      successCriteria: ['Preferences filter correctly', 'Bidirectional works'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-6',
      title: 'Card Stack Generation',
      phase: 2,
      phaseTitle: 'Discovery',
      learningObjective: 'Generate the swipe deck efficiently',
      thinkingFramework: {
        framework: 'Candidate Pipeline',
        approach: 'Fetch batch of candidates meeting criteria. Exclude already swiped. Order by recommendation score. Prefetch next batch.',
        keyInsight: 'Users swipe fast - need candidates ready. Prefetch 20-50 profiles. Exclude seen users. Balance freshness vs recommendation quality.'
      },
      requirements: {
        functional: [
          'Generate candidate batch',
          'Exclude already swiped users',
          'Order by relevance',
          'Prefetch next batch'
        ],
        nonFunctional: [
          'Batch generation < 500ms',
          'Batch size: 20-50 profiles'
        ]
      },
      hints: [
        'Pipeline: nearby → preferences → not_swiped → rank → top_N',
        'Exclusion: bloom filter for seen users (memory efficient)',
        'Prefetch: load next batch when 5 cards remaining'
      ],
      expectedComponents: ['Candidate Generator', 'Exclusion Filter', 'Batch Manager'],
      successCriteria: ['Cards generated fast', 'No repeats'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Matching (Steps 7-9)
    {
      id: 'step-7',
      title: 'Recommendation Algorithm',
      phase: 3,
      phaseTitle: 'Matching',
      learningObjective: 'Rank candidates by match probability',
      thinkingFramework: {
        framework: 'Match Prediction',
        approach: 'Predict P(mutual like) for each candidate. Features: attractiveness score, preference alignment, behavior similarity. ML model trained on historical matches.',
        keyInsight: 'Show users theyre likely to match with. Wasted swipes = bad UX. Elo-like rating system for desirability. Similar ratings match better.'
      },
      requirements: {
        functional: [
          'Score each candidate',
          'Rank by match probability',
          'Balance exploration vs exploitation',
          'Update scores from feedback'
        ],
        nonFunctional: [
          'Scoring < 10ms per candidate',
          'Model update: daily'
        ]
      },
      hints: [
        'Features: elo_score, age_diff, distance, shared_interests, photo_quality',
        'Model: logistic regression or neural network on match outcomes',
        'Exploration: 10% random candidates to avoid filter bubbles'
      ],
      expectedComponents: ['Scoring Model', 'Ranking Engine', 'Feedback Loop'],
      successCriteria: ['Relevant candidates shown', 'Match rate improves'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Elo Rating System',
      phase: 3,
      phaseTitle: 'Matching',
      learningObjective: 'Track user desirability dynamically',
      thinkingFramework: {
        framework: 'Desirability Score',
        approach: 'Like chess Elo: high-rated person likes you → your score increases more. Rejected by high-rated → smaller decrease. Converges to true desirability.',
        keyInsight: 'Not all likes are equal. Like from someone selective = more signal. Elo captures this elegantly. Show users with similar Elo for better match rates.'
      },
      requirements: {
        functional: [
          'Initialize Elo for new users',
          'Update on swipe outcomes',
          'Decay for inactive users',
          'Use Elo in candidate ranking'
        ],
        nonFunctional: [
          'Elo update: real-time',
          'Score range: 0-5000'
        ]
      },
      hints: [
        'Update: winner gains K * (1 - expected), loser loses K * expected',
        'Expected: 1 / (1 + 10^((elo_b - elo_a) / 400))',
        'K factor: 32 for new users, 16 for established'
      ],
      expectedComponents: ['Elo Calculator', 'Score Store', 'Decay Worker'],
      successCriteria: ['Elo reflects desirability', 'Similar Elos match better'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Boost and Visibility',
      phase: 3,
      phaseTitle: 'Matching',
      learningObjective: 'Monetize with visibility features',
      thinkingFramework: {
        framework: 'Premium Visibility',
        approach: 'Boost: temporarily show profile to more users. See who liked you: reveal likers. Priority placement in stack. Revenue driver.',
        keyInsight: 'Visibility is valuable. Free users see limited profiles. Premium gets priority. Boost is time-limited visibility spike. Creates urgency.'
      },
      requirements: {
        functional: [
          'Boost profile for 30 minutes',
          'Show who already liked you',
          'Priority in others stacks',
          'Track boost effectiveness'
        ],
        nonFunctional: [
          'Boost effect: 10x visibility',
          'Real-time liker reveal'
        ]
      },
      hints: [
        'Boost: multiply ranking score during boost window',
        'Likes you: queue of users who liked, reveal with premium',
        'Priority: premium users appear in first 10 cards'
      ],
      expectedComponents: ['Boost Manager', 'Liker Queue', 'Premium Ranker'],
      successCriteria: ['Boosts increase matches', 'Premium valuable'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Engagement (Steps 10-12)
    {
      id: 'step-10',
      title: 'Match Chat',
      phase: 4,
      phaseTitle: 'Engagement',
      learningObjective: 'Enable messaging between matches',
      thinkingFramework: {
        framework: 'Gated Messaging',
        approach: 'Chat unlocked only after match. Real-time messaging. Read receipts. Typing indicators. GIFs and reactions.',
        keyInsight: 'Chat is where connections happen. But also where harassment can occur. Match requirement + reporting keeps quality high.'
      },
      requirements: {
        functional: [
          'Create chat on match',
          'Send text and media messages',
          'Read receipts and typing indicators',
          'GIFs and reactions'
        ],
        nonFunctional: [
          'Message delivery < 500ms',
          'Offline message queuing'
        ]
      },
      hints: [
        'Chat: {match_id, messages: [{sender, content, type, read, timestamp}]}',
        'Real-time: WebSocket for active chats',
        'Typing: ephemeral event, no storage'
      ],
      expectedComponents: ['Chat Service', 'Message Store', 'Real-Time Handler'],
      successCriteria: ['Chat works', 'Real-time updates'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Safety Features',
      phase: 4,
      phaseTitle: 'Engagement',
      learningObjective: 'Protect users from harassment',
      thinkingFramework: {
        framework: 'Trust and Safety',
        approach: 'Report and block users. Photo moderation for explicit content. Message filtering. Unmatch and delete. Safety check-in for dates.',
        keyInsight: 'Safety is existential for dating apps. One bad experience = user leaves forever. Proactive moderation + easy reporting essential.'
      },
      requirements: {
        functional: [
          'Report user with reason',
          'Block and unmatch',
          'AI content moderation',
          'Date safety check-in'
        ],
        nonFunctional: [
          'Report review < 24 hours',
          'Explicit content blocked < 1 second'
        ]
      },
      hints: [
        'Report: {reporter, reported, reason, evidence, status}',
        'Moderation: NSFW classifier on photos, toxicity on messages',
        'Check-in: share date details, timed check-in prompt'
      ],
      expectedComponents: ['Report System', 'Content Moderator', 'Safety Features'],
      successCriteria: ['Reports handled', 'Users feel safe'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Scale and Performance',
      phase: 4,
      phaseTitle: 'Engagement',
      learningObjective: 'Handle millions of concurrent swipers',
      thinkingFramework: {
        framework: 'High-Volume Optimization',
        approach: 'Swipes are write-heavy. Location queries are read-heavy. Cache hot profiles. Shard by geography. Async match detection.',
        keyInsight: 'Peak hours see 10x traffic. Cache aggressively - profiles dont change often. Geoshard for locality. Eventually consistent match detection ok.'
      },
      requirements: {
        functional: [
          'Handle traffic spikes (Sunday evening)',
          'Geographic sharding',
          'Profile caching',
          'Async processing'
        ],
        nonFunctional: [
          'Support 1M concurrent users',
          '99.9% availability'
        ]
      },
      hints: [
        'Shard: by geohash prefix, users in same area on same shard',
        'Cache: profile + photos CDN, 1 hour TTL',
        'Async: swipe write to queue, match detection worker'
      ],
      expectedComponents: ['Geo Sharder', 'Profile Cache', 'Async Workers'],
      successCriteria: ['Handles load', 'Low latency'],
      estimatedTime: '8 minutes'
    }
  ]
};
