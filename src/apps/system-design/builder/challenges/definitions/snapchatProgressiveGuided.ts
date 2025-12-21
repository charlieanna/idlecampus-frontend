import { GuidedTutorial } from '../../types/guidedTutorial';

export const snapchatProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'snapchat-progressive',
  title: 'Design Snapchat',
  description: 'Build an ephemeral media sharing app from disappearing messages to AR platform',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design ephemeral content with automatic deletion',
    'Implement real-time media messaging',
    'Build Stories with 24-hour expiry',
    'Handle AR lenses and filters',
    'Scale media delivery globally'
  ],
  prerequisites: ['Media processing', 'Real-time systems', 'Mobile architecture'],
  tags: ['ephemeral', 'media', 'messaging', 'ar', 'stories'],

  progressiveStory: {
    title: 'Snapchat Evolution',
    premise: "You're building an ephemeral media platform. Starting with disappearing photos, you'll evolve to support Stories, real-time video chat, AR lenses, and a global content platform.",
    phases: [
      { phase: 1, title: 'Disappearing Media', description: 'Ephemeral messages' },
      { phase: 2, title: 'Stories', description: '24-hour content' },
      { phase: 3, title: 'Real-Time Features', description: 'Video chat and maps' },
      { phase: 4, title: 'AR Platform', description: 'Lenses and discovery' }
    ]
  },

  steps: [
    // PHASE 1: Disappearing Media (Steps 1-3)
    {
      id: 'step-1',
      title: 'Ephemeral Media Storage',
      phase: 1,
      phaseTitle: 'Disappearing Media',
      learningObjective: 'Store media that automatically deletes',
      thinkingFramework: {
        framework: 'Time-Bound Storage',
        approach: 'Media has TTL (time-to-live). Store with expiry metadata. Background job deletes expired content. No permanent storage - privacy by design.',
        keyInsight: 'Ephemeral is the feature, not a bug. Users share more when content disappears. TTL enforced at storage layer, not application layer.'
      },
      requirements: {
        functional: [
          'Upload photo/video with view duration',
          'Store with expiry timestamp',
          'Delete after recipient views',
          'Prevent screenshots (detect + alert)'
        ],
        nonFunctional: [
          'Upload < 3 seconds',
          'Deletion within 1 second of view'
        ]
      },
      hints: [
        'Snap: {id, sender, recipient, media_url, view_duration: 1-10s, expires_at}',
        'Storage: object store with lifecycle policy',
        'Screenshot: OS API detection, notify sender'
      ],
      expectedComponents: ['Media Store', 'TTL Manager', 'Screenshot Detector'],
      successCriteria: ['Media uploaded', 'Auto-deletes correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Snap Delivery',
      phase: 1,
      phaseTitle: 'Disappearing Media',
      learningObjective: 'Deliver snaps with read receipts',
      thinkingFramework: {
        framework: 'Delivery States',
        approach: 'Snap states: sent → delivered → opened → screenshot/replayed. Push notification on receive. Track exact view time for deletion countdown.',
        keyInsight: 'View timestamp starts deletion timer, not delivery. User opens snap → timer starts → expires after view_duration seconds.'
      },
      requirements: {
        functional: [
          'Send snap to one or multiple friends',
          'Push notification on delivery',
          'Track opened/viewed state',
          'Support replay (one replay per snap)'
        ],
        nonFunctional: [
          'Delivery notification < 1 second',
          'State sync across devices'
        ]
      },
      hints: [
        'State machine: pending → sent → delivered → opened → expired',
        'Replay: one_replay_allowed boolean, tracks if used',
        'Multi-send: separate delivery state per recipient'
      ],
      expectedComponents: ['Delivery Service', 'State Tracker', 'Push Notifier'],
      successCriteria: ['Snaps delivered', 'States tracked'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'Chat Messaging',
      phase: 1,
      phaseTitle: 'Disappearing Media',
      learningObjective: 'Enable ephemeral text chat',
      thinkingFramework: {
        framework: 'Disappearing Chat',
        approach: 'Text messages also ephemeral by default. Delete after both parties leave chat. Option to save specific messages. Real-time typing indicators.',
        keyInsight: 'Chat deletion trigger = both users leave conversation. Not time-based like snaps. Saved messages persist until manually deleted.'
      },
      requirements: {
        functional: [
          'Send text messages in chat',
          'Delete when both leave chat',
          'Save individual messages',
          'Typing indicators'
        ],
        nonFunctional: [
          'Message delivery < 500ms',
          'Typing indicator < 200ms'
        ]
      },
      hints: [
        'Message: {id, chat_id, sender, content, saved: boolean, viewed_by: []}',
        'Deletion: on_chat_leave → delete where saved=false and all viewed',
        'Typing: ephemeral presence event, no storage'
      ],
      expectedComponents: ['Chat Service', 'Message Cleaner', 'Presence Handler'],
      successCriteria: ['Chat works', 'Messages disappear'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Stories (Steps 4-6)
    {
      id: 'step-4',
      title: 'Story Creation',
      phase: 2,
      phaseTitle: 'Stories',
      learningObjective: 'Post content visible for 24 hours',
      thinkingFramework: {
        framework: '24-Hour Lifecycle',
        approach: 'Story = media visible to all friends for 24 hours. Chain of snaps in sequence. Each snap has its own 24h window from post time.',
        keyInsight: 'Story is broadcast to all friends, not sent to each. One upload, multiple viewers. Different privacy model than direct snaps.'
      },
      requirements: {
        functional: [
          'Post snap to story',
          'Auto-delete after 24 hours',
          'View story sequentially',
          'See who viewed each snap'
        ],
        nonFunctional: [
          'Story visible within 5 seconds of post',
          'Viewer list accurate within 1 minute'
        ]
      },
      hints: [
        'Story: {user_id, snaps: [{id, media_url, posted_at, expires_at}]}',
        'Expiry: posted_at + 24 hours, background job cleans up',
        'Viewers: append-only list per snap'
      ],
      expectedComponents: ['Story Manager', 'Expiry Worker', 'Viewer Tracker'],
      successCriteria: ['Stories post', 'Auto-delete at 24h'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Story Feed',
      phase: 2,
      phaseTitle: 'Stories',
      learningObjective: 'Aggregate friends stories into feed',
      thinkingFramework: {
        framework: 'Feed Assembly',
        approach: 'Pull friends list → get active stories → sort by recency/engagement. Pre-fetch next stories for smooth playback. Mark viewed to not repeat.',
        keyInsight: 'Story order matters for engagement. Best friend stories first, then recent, then older. Algorithm balances recency with relationship strength.'
      },
      requirements: {
        functional: [
          'Show friends with active stories',
          'Sort by relevance (best friends first)',
          'Track viewed stories',
          'Seamless story-to-story playback'
        ],
        nonFunctional: [
          'Feed load < 1 second',
          'Prefetch next 3 stories'
        ]
      },
      hints: [
        'Feed: friends with stories, sorted by interaction_score + recency',
        'Viewed: store last_viewed_at per friend story',
        'Prefetch: while viewing story N, load N+1, N+2, N+3'
      ],
      expectedComponents: ['Feed Aggregator', 'Ranking Engine', 'Prefetcher'],
      successCriteria: ['Feed shows stories', 'Playback smooth'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Story Privacy Controls',
      phase: 2,
      phaseTitle: 'Stories',
      learningObjective: 'Control who sees your stories',
      thinkingFramework: {
        framework: 'Audience Selection',
        approach: 'Public story, friends only, custom list, close friends. Block specific users. Private story = selected viewers only.',
        keyInsight: 'Privacy controls drive sharing. Close Friends story feels more intimate → users share more personal content. Increases engagement.'
      },
      requirements: {
        functional: [
          'Friends-only stories (default)',
          'Custom friend lists',
          'Close Friends (private story)',
          'Block users from viewing'
        ],
        nonFunctional: [
          'Privacy check < 10ms per viewer'
        ]
      },
      hints: [
        'Visibility: public | friends | custom_list | close_friends',
        'Custom list: {id, owner, name, members: [user_ids]}',
        'Check: is viewer in allowed set AND not in blocked set'
      ],
      expectedComponents: ['Privacy Manager', 'List Manager', 'Access Checker'],
      successCriteria: ['Privacy controls work', 'Unauthorized cant view'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Real-Time Features (Steps 7-9)
    {
      id: 'step-7',
      title: 'Video Chat',
      phase: 3,
      phaseTitle: 'Real-Time Features',
      learningObjective: 'Enable real-time video calling',
      thinkingFramework: {
        framework: 'Peer-to-Peer Video',
        approach: 'WebRTC for direct peer connection when possible. TURN relay when NAT blocked. Signaling via existing chat connection. Filters in real-time.',
        keyInsight: 'P2P reduces server load and latency. NAT traversal via STUN/TURN. Most calls are P2P, relay only when necessary.'
      },
      requirements: {
        functional: [
          'Initiate video call from chat',
          'Real-time video and audio',
          'Apply filters during call',
          'Group video (up to 16)'
        ],
        nonFunctional: [
          'Call setup < 3 seconds',
          'Video latency < 300ms'
        ]
      },
      hints: [
        'Signaling: offer/answer/ice via chat WebSocket',
        'Media: WebRTC, H264/VP8, Opus audio',
        'Filters: GPU shader on device, not server'
      ],
      expectedComponents: ['Signaling Server', 'TURN Relay', 'Filter Engine'],
      successCriteria: ['Video calls work', 'Filters apply live'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Snap Map',
      phase: 3,
      phaseTitle: 'Real-Time Features',
      learningObjective: 'Show friends location on map',
      thinkingFramework: {
        framework: 'Location Sharing',
        approach: 'Opt-in location sharing. Update location periodically. Show friends on map with Bitmoji. Ghost mode to hide. Heat maps for events.',
        keyInsight: 'Privacy first: ghost mode is prominent. Location is sensitive - clear controls, easy to disable. Battery optimization critical.'
      },
      requirements: {
        functional: [
          'Share location with friends',
          'Ghost mode (invisible)',
          'See friends on map',
          'Our Story: location-based public stories'
        ],
        nonFunctional: [
          'Location update: every 15 minutes when app open',
          'Battery impact < 5%'
        ]
      },
      hints: [
        'Location: {user_id, lat, lng, updated_at, accuracy}',
        'Ghost mode: dont send location updates, show as offline',
        'Geofence: detect when entering event area'
      ],
      expectedComponents: ['Location Service', 'Map Renderer', 'Privacy Controller'],
      successCriteria: ['Map shows friends', 'Ghost mode works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Memories',
      phase: 3,
      phaseTitle: 'Real-Time Features',
      learningObjective: 'Save snaps for later access',
      thinkingFramework: {
        framework: 'Personal Archive',
        approach: 'Save snaps before they expire. Private storage, not ephemeral. Search by date, location, content (ML). Re-share to story or friends.',
        keyInsight: 'Memories adds permanence option to ephemeral platform. User controls what persists. Creates emotional attachment to app.'
      },
      requirements: {
        functional: [
          'Save snaps to Memories',
          'Organize by date/location',
          'Search memories',
          'Re-share saved content'
        ],
        nonFunctional: [
          'Unlimited storage',
          'Search results < 1 second'
        ]
      },
      hints: [
        'Memory: {id, user_id, media_url, saved_at, location, tagged_friends}',
        'Search: ML-based content tagging (beach, birthday, food)',
        'On This Day: surface memories from same date previous years'
      ],
      expectedComponents: ['Memory Store', 'Content Tagger', 'Search Index'],
      successCriteria: ['Memories saved', 'Searchable'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: AR Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'AR Lenses',
      phase: 4,
      phaseTitle: 'AR Platform',
      learningObjective: 'Apply augmented reality effects',
      thinkingFramework: {
        framework: 'Real-Time AR',
        approach: 'Face detection → landmark extraction → overlay 3D model. GPU rendering at 30fps. Pre-made lenses + user-created. Download on demand.',
        keyInsight: 'Lenses must run on-device for real-time. Detect face landmarks, transform 3D mesh to match. All GPU, no server round-trip.'
      },
      requirements: {
        functional: [
          'Face detection and tracking',
          'Apply 3D overlays (dog ears, etc)',
          'World lenses (3D objects in scene)',
          'Lens carousel and discovery'
        ],
        nonFunctional: [
          '30fps with lens active',
          'Lens download < 2 seconds'
        ]
      },
      hints: [
        'Face: 68 landmark points, tracked each frame',
        'Lens bundle: 3D models + shaders + scripts, < 5MB',
        'World: ARKit/ARCore plane detection, anchor objects'
      ],
      expectedComponents: ['Face Tracker', 'AR Renderer', 'Lens Store'],
      successCriteria: ['Lenses apply smoothly', 'Face tracking accurate'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Lens Studio (Creator Platform)',
      phase: 4,
      phaseTitle: 'AR Platform',
      learningObjective: 'Enable creators to build lenses',
      thinkingFramework: {
        framework: 'UGC AR Platform',
        approach: 'Desktop tool to create lenses. Templates for common effects. Scripting for interactivity. Review process before publishing.',
        keyInsight: 'Creator ecosystem scales content. Cant build every lens internally. Provide tools, let community create. Viral lenses drive app usage.'
      },
      requirements: {
        functional: [
          'Lens creation tool (Lens Studio)',
          'Templates and tutorials',
          'Publish and review workflow',
          'Analytics for creators'
        ],
        nonFunctional: [
          'Review time: < 24 hours',
          'Lens limit: 100 per creator'
        ]
      },
      hints: [
        'Templates: face mask, 3D object, mini-game, world effect',
        'Scripting: JavaScript for lens behavior',
        'Review: automated checks + human review for policy'
      ],
      expectedComponents: ['Lens Studio', 'Review Pipeline', 'Creator Analytics'],
      successCriteria: ['Creators can publish', 'Quality maintained'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Discover & Spotlight',
      phase: 4,
      phaseTitle: 'AR Platform',
      learningObjective: 'Surface premium and viral content',
      thinkingFramework: {
        framework: 'Content Curation',
        approach: 'Discover: premium publisher content. Spotlight: viral user content (TikTok competitor). Algorithmic feed based on interests. Revenue share with creators.',
        keyInsight: 'Spotlight competes with TikTok. Short-form, full-screen, algorithmic. Pay creators for viral content. Shifts from friends to entertainment.'
      },
      requirements: {
        functional: [
          'Discover section with publisher stories',
          'Spotlight for viral short videos',
          'Algorithmic content ranking',
          'Creator monetization'
        ],
        nonFunctional: [
          'Content moderation < 1 hour',
          'Spotlight payouts: $1M/day pool'
        ]
      },
      hints: [
        'Discover: curated publisher channels, ad-supported',
        'Spotlight: submit from camera, goes into algorithmic feed',
        'Ranking: watch time, completion rate, shares, saves'
      ],
      expectedComponents: ['Content Feed', 'Ranking Algorithm', 'Payout System'],
      successCriteria: ['Discover shows content', 'Spotlight viral'],
      estimatedTime: '8 minutes'
    }
  ]
};
