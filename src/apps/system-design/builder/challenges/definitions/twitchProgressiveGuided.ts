import { GuidedTutorial } from '../../types/guidedTutorial';

export const twitchProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'twitch-progressive',
  title: 'Design Twitch',
  description: 'Build a live streaming platform from basic broadcasts to interactive entertainment at scale',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design live video ingest and transcoding',
    'Implement real-time chat at scale',
    'Build discovery and recommendation systems',
    'Handle monetization (subscriptions, bits)',
    'Scale to millions of concurrent viewers'
  ],
  prerequisites: ['Video streaming', 'Real-time systems', 'CDN'],
  tags: ['streaming', 'live-video', 'chat', 'gaming', 'entertainment'],

  progressiveStory: {
    title: 'Twitch Evolution',
    premise: "You're building a live streaming platform. Starting with basic video broadcast and chat, you'll evolve to support interactive features, monetization, and millions of concurrent viewers watching their favorite streamers.",
    phases: [
      { phase: 1, title: 'Streaming', description: 'Live video broadcast' },
      { phase: 2, title: 'Interaction', description: 'Chat and engagement' },
      { phase: 3, title: 'Discovery', description: 'Finding content' },
      { phase: 4, title: 'Monetization', description: 'Creator economy' }
    ]
  },

  steps: [
    // PHASE 1: Streaming (Steps 1-3)
    {
      id: 'step-1',
      title: 'Video Ingest',
      phase: 1,
      phaseTitle: 'Streaming',
      learningObjective: 'Receive live video from streamers',
      thinkingFramework: {
        framework: 'RTMP Ingest',
        approach: 'Streamers broadcast via RTMP. Ingest servers receive stream. Authenticate stream key. Multiple quality transcoding. Edge servers for viewing.',
        keyInsight: 'RTMP is standard for broadcast software (OBS). Ingest at PoPs close to streamer for low latency. Transcode to multiple qualities for different bandwidths.'
      },
      requirements: {
        functional: [
          'Accept RTMP stream from broadcasters',
          'Authenticate via stream key',
          'Transcode to multiple qualities',
          'Handle stream start/stop'
        ],
        nonFunctional: [
          'Ingest latency < 1 second',
          'Support 1080p60 input'
        ]
      },
      hints: [
        'Ingest: RTMP server, validates stream key, routes to transcoder',
        'Transcoding: 1080p, 720p, 480p, 360p - adaptive bitrate',
        'Stream key: {channel_id, key, created_at} - revocable'
      ],
      expectedComponents: ['RTMP Server', 'Stream Authenticator', 'Transcoder'],
      successCriteria: ['Streams ingested', 'Transcoding works'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-2',
      title: 'Live Video Delivery',
      phase: 1,
      phaseTitle: 'Streaming',
      learningObjective: 'Deliver video to viewers globally',
      thinkingFramework: {
        framework: 'HLS Distribution',
        approach: 'Convert to HLS/DASH segments. CDN distribution globally. Adaptive bitrate based on viewer bandwidth. Low-latency mode for interaction.',
        keyInsight: 'HLS is web-compatible. Segments enable CDN caching. Adaptive bitrate prevents buffering. Trade-off: lower latency = less caching efficiency.'
      },
      requirements: {
        functional: [
          'Segment video for HLS',
          'CDN distribution',
          'Adaptive bitrate selection',
          'Low-latency mode'
        ],
        nonFunctional: [
          'Glass-to-glass latency < 5 seconds',
          'Low-latency mode < 2 seconds'
        ]
      },
      hints: [
        'HLS: 2-second segments, .m3u8 playlist',
        'CDN: edge servers cache segments, refresh on new segments',
        'Low-latency: smaller segments, reduced buffer'
      ],
      expectedComponents: ['Segmenter', 'CDN', 'Playlist Generator'],
      successCriteria: ['Video plays', 'Adaptive works'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-3',
      title: 'Channel Management',
      phase: 1,
      phaseTitle: 'Streaming',
      learningObjective: 'Configure broadcast settings',
      thinkingFramework: {
        framework: 'Streamer Dashboard',
        approach: 'Channel page with branding. Stream settings (title, game, tags). Go live/offline status. Stream health monitoring.',
        keyInsight: 'Streamers need control. Title/game affect discovery. Tags help categorization. Stream health (bitrate, dropped frames) essential for quality.'
      },
      requirements: {
        functional: [
          'Channel page customization',
          'Set stream title and category',
          'Stream key management',
          'View stream health stats'
        ],
        nonFunctional: [
          'Dashboard load < 500ms',
          'Health update < 10 seconds'
        ]
      },
      hints: [
        'Channel: {id, name, avatar, banner, description, social_links}',
        'Stream: {channel_id, title, game_id, tags, started_at, viewer_count}',
        'Health: {bitrate, fps, dropped_frames, encoder}'
      ],
      expectedComponents: ['Channel Store', 'Stream Manager', 'Health Monitor'],
      successCriteria: ['Channels work', 'Health displayed'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Interaction (Steps 4-6)
    {
      id: 'step-4',
      title: 'Real-Time Chat',
      phase: 2,
      phaseTitle: 'Interaction',
      learningObjective: 'Enable viewer chat at scale',
      thinkingFramework: {
        framework: 'Pub/Sub Chat',
        approach: 'WebSocket connection per viewer. Pub/sub for message distribution. Chat rooms per channel. Handle thousands of messages per second in popular streams.',
        keyInsight: 'Popular streams have 100K+ chatters. Cant send every message to every viewer. Sample/throttle for very active chats. Moderation is critical.'
      },
      requirements: {
        functional: [
          'Real-time chat messages',
          'Emotes and badges',
          'Chat history (limited)',
          'Handle high message volume'
        ],
        nonFunctional: [
          'Message delivery < 500ms',
          'Handle 10K messages/second per channel'
        ]
      },
      hints: [
        'Connection: WebSocket per viewer, subscribe to channel',
        'Message: {channel_id, user_id, text, emotes, badges, timestamp}',
        'Scale: message fan-out via pub/sub (Redis, Kafka)'
      ],
      expectedComponents: ['Chat Server', 'Pub/Sub System', 'Message Handler'],
      successCriteria: ['Chat works', 'Scales to many viewers'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-5',
      title: 'Moderation Tools',
      phase: 2,
      phaseTitle: 'Interaction',
      learningObjective: 'Keep chat safe and civil',
      thinkingFramework: {
        framework: 'Content Moderation',
        approach: 'Streamer-appointed moderators. AutoMod for automatic filtering. Timeout and ban users. Slow mode, subscriber-only mode. Blocked terms.',
        keyInsight: 'Chat toxicity kills communities. AutoMod catches obvious violations. Human mods handle context. Tools empower streamers to set their culture.'
      },
      requirements: {
        functional: [
          'Appoint moderators',
          'Timeout and ban users',
          'AutoMod content filtering',
          'Chat modes (slow, sub-only, emote-only)'
        ],
        nonFunctional: [
          'Mod action < 100ms',
          'AutoMod latency < 50ms'
        ]
      },
      hints: [
        'Moderator: {channel_id, user_id, appointed_by}',
        'Action: {channel_id, target_user, action: timeout|ban, duration, reason}',
        'AutoMod: ML model for toxicity, blocked word list, spam detection'
      ],
      expectedComponents: ['Mod Service', 'AutoMod', 'Action Handler'],
      successCriteria: ['Moderation works', 'AutoMod filters'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Interactive Features',
      phase: 2,
      phaseTitle: 'Interaction',
      learningObjective: 'Enable viewer participation',
      thinkingFramework: {
        framework: 'Engagement Tools',
        approach: 'Polls for viewer voting. Predictions (bet channel points). Raids to send viewers to other channels. Clips to capture moments.',
        keyInsight: 'Interactivity is Twitchs edge over YouTube. Viewers participate, not just watch. Polls/predictions create investment. Clips enable viral moments.'
      },
      requirements: {
        functional: [
          'Create and vote on polls',
          'Predictions with channel points',
          'Raid other channels',
          'Create clips from live stream'
        ],
        nonFunctional: [
          'Poll vote < 100ms',
          'Clip creation < 5 seconds'
        ]
      },
      hints: [
        'Poll: {channel_id, question, options: [], votes: {}, end_time}',
        'Prediction: {channel_id, outcomes: [], bets: {}, status: active|locked|resolved}',
        'Clip: {stream_id, start_offset, duration, created_by}'
      ],
      expectedComponents: ['Poll Service', 'Prediction Engine', 'Clip Creator'],
      successCriteria: ['Polls work', 'Clips create'],
      estimatedTime: '8 minutes'
    },

    // PHASE 3: Discovery (Steps 7-9)
    {
      id: 'step-7',
      title: 'Browse and Categories',
      phase: 3,
      phaseTitle: 'Discovery',
      learningObjective: 'Help viewers find content',
      thinkingFramework: {
        framework: 'Content Discovery',
        approach: 'Browse by category (games, Just Chatting). Sort by viewers. Tags for filtering. Live thumbnails updated frequently.',
        keyInsight: 'Games are primary category (Twitch roots). Viewer count is quality signal. Tags help niche discovery. Live thumbnails show whats happening.'
      },
      requirements: {
        functional: [
          'Browse by game/category',
          'Sort by viewer count',
          'Filter by tags and language',
          'Live thumbnail previews'
        ],
        nonFunctional: [
          'Browse load < 500ms',
          'Thumbnail refresh: 5 minutes'
        ]
      },
      hints: [
        'Category: {id, name, box_art, viewer_count}',
        'Stream list: sorted by viewers, filtered by tags/language',
        'Thumbnail: captured from stream every 5 min'
      ],
      expectedComponents: ['Browse Service', 'Category Manager', 'Thumbnail Generator'],
      successCriteria: ['Categories work', 'Discovery effective'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-8',
      title: 'Following and Notifications',
      phase: 3,
      phaseTitle: 'Discovery',
      learningObjective: 'Build viewer-streamer connections',
      thinkingFramework: {
        framework: 'Social Graph',
        approach: 'Follow channels for updates. Notification when followed channels go live. Following feed of live channels. Differentiate follow from subscribe.',
        keyInsight: 'Follow is free, subscribe is paid. Follow builds relationship. Live notification drives viewership. Following feed surfaces content from people you care about.'
      },
      requirements: {
        functional: [
          'Follow channels',
          'Live notifications',
          'Following feed',
          'Notification preferences'
        ],
        nonFunctional: [
          'Live notification < 30 seconds',
          'Support millions of followers per channel'
        ]
      },
      hints: [
        'Follow: {user_id, channel_id, followed_at, notifications: boolean}',
        'Live event: channel goes live → notify all followers with notifications on',
        'Feed: live channels you follow, sorted by viewer count'
      ],
      expectedComponents: ['Follow Service', 'Notification System', 'Feed Generator'],
      successCriteria: ['Following works', 'Notifications timely'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Recommendations',
      phase: 3,
      phaseTitle: 'Discovery',
      learningObjective: 'Surface relevant streams',
      thinkingFramework: {
        framework: 'Live Content Recommendations',
        approach: 'Recommend based on watch history. Similar to channels you follow. Trending in your interests. Cold start: popular in your region.',
        keyInsight: 'Recommendations drive discovery of new streamers. Live content = time-sensitive recommendations. Promote variety to prevent staleness.'
      },
      requirements: {
        functional: [
          'Personalized stream recommendations',
          'Similar channels',
          'Trending live streams',
          'New streamer discovery'
        ],
        nonFunctional: [
          'Recommendations < 200ms',
          'Update hourly'
        ]
      },
      hints: [
        'Signals: watch history, follows, chat activity, categories watched',
        'Similar: collaborative filtering (viewers of X also watch Y)',
        'Trending: velocity of viewer growth'
      ],
      expectedComponents: ['Recommendation Engine', 'Similarity Model', 'Trending Calculator'],
      successCriteria: ['Recommendations relevant', 'Discovery improved'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Monetization (Steps 10-12)
    {
      id: 'step-10',
      title: 'Subscriptions',
      phase: 4,
      phaseTitle: 'Monetization',
      learningObjective: 'Enable paid channel support',
      thinkingFramework: {
        framework: 'Creator Subscriptions',
        approach: 'Monthly subscription to channels. Multiple tiers with different benefits. Emotes for subscribers. Gift subs to others. Revenue split with creator.',
        keyInsight: 'Subscriptions are recurring revenue for creators. Emotes are exclusive value. Gift subs drive virality. Prime Gaming subs (included with Amazon Prime) expand base.'
      },
      requirements: {
        functional: [
          'Subscribe to channels',
          'Multiple subscription tiers',
          'Subscriber emotes and badges',
          'Gift subscriptions'
        ],
        nonFunctional: [
          'Subscription instant',
          'Emote availability < 1 second'
        ]
      },
      hints: [
        'Subscription: {user_id, channel_id, tier, started_at, renews_at, gifted_by}',
        'Tiers: $4.99 (50%), $9.99 (60%), $24.99 (70%) - creator split',
        'Benefits: {tier, emotes: [], badge, ad_free}'
      ],
      expectedComponents: ['Subscription Service', 'Tier Manager', 'Benefit Handler'],
      successCriteria: ['Subscriptions work', 'Benefits granted'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Bits and Donations',
      phase: 4,
      phaseTitle: 'Monetization',
      learningObjective: 'Enable one-time support',
      thinkingFramework: {
        framework: 'Virtual Currency',
        approach: 'Bits = virtual currency bought with real money. Cheer with Bits in chat. Animated cheermotes. Creator gets $0.01 per Bit. Visible support in chat.',
        keyInsight: 'Bits enable impulse donations during hype moments. Cheermotes make donations visible and fun. Price anchoring ($1.40 for 100 Bits). Creator gets predictable cut.'
      },
      requirements: {
        functional: [
          'Purchase Bits',
          'Cheer with Bits in chat',
          'Cheermotes (animated emotes)',
          'Bit leaderboards'
        ],
        nonFunctional: [
          'Bit purchase < 3 seconds',
          'Cheer display instant'
        ]
      },
      hints: [
        'Bits: {user_id, balance, purchased_total, cheered_total}',
        'Cheer: {channel_id, user_id, bits, message, emote}',
        'Pricing: 100 bits = $1.40, 1500 bits = $19.95 (bulk discount)'
      ],
      expectedComponents: ['Bits Wallet', 'Cheer Handler', 'Leaderboard'],
      successCriteria: ['Bits work', 'Cheers display'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Platform Scale',
      phase: 4,
      phaseTitle: 'Monetization',
      learningObjective: 'Handle millions of concurrent viewers',
      thinkingFramework: {
        framework: 'Live Event Scale',
        approach: 'Major esports events = millions of viewers on one stream. CDN capacity planning. Chat sharding for massive channels. Regional edge deployment.',
        keyInsight: 'One stream can have 1M+ viewers. Single chat room with 1M users impossible - shard and sample. CDN must pre-position for events. Graceful degradation essential.'
      },
      requirements: {
        functional: [
          'Handle viral streams',
          'Chat at massive scale',
          'Global low-latency delivery',
          'Event capacity planning'
        ],
        nonFunctional: [
          'Handle 5M concurrent on single stream',
          '99.99% stream availability'
        ]
      },
      hints: [
        'CDN: pre-warm edges for scheduled events',
        'Chat: shard by viewer, sample messages in massive rooms',
        'Degradation: disable chat before video, reduce quality before dropping'
      ],
      expectedComponents: ['Capacity Planner', 'Chat Scaler', 'Edge Infrastructure'],
      successCriteria: ['Handles massive events', 'Graceful degradation'],
      estimatedTime: '8 minutes'
    }
  ]
};
