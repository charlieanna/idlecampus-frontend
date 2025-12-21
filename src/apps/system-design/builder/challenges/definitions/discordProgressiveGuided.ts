import { GuidedTutorial } from '../../types/guidedTutorial';

export const discordProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'discord-progressive',
  title: 'Design Discord',
  description: 'Build a real-time communication platform from chat rooms to millions of concurrent voice users',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design real-time messaging with WebSockets',
    'Implement voice and video communication',
    'Build server/channel organization',
    'Handle presence and status updates',
    'Scale to millions of concurrent connections'
  ],
  prerequisites: ['WebSockets', 'Real-time systems', 'Media streaming'],
  tags: ['messaging', 'voice', 'real-time', 'community', 'gaming'],

  progressiveStory: {
    title: 'Discord Evolution',
    premise: "You're building a communication platform for gaming communities. Starting with simple chat rooms, you'll evolve to support voice channels, video streaming, and millions of concurrent users across thousands of servers.",
    phases: [
      { phase: 1, title: 'Chat Rooms', description: 'Basic text messaging' },
      { phase: 2, title: 'Servers & Channels', description: 'Community organization' },
      { phase: 3, title: 'Voice & Video', description: 'Real-time media' },
      { phase: 4, title: 'Platform Scale', description: 'Millions of users' }
    ]
  },

  steps: [
    // PHASE 1: Chat Rooms (Steps 1-3)
    {
      id: 'step-1',
      title: 'Real-Time Messaging',
      phase: 1,
      phaseTitle: 'Chat Rooms',
      learningObjective: 'Deliver messages instantly via WebSockets',
      thinkingFramework: {
        framework: 'Persistent Connections',
        approach: 'WebSocket per client for bidirectional communication. Server pushes messages instantly. No polling. Connection state managed per user.',
        keyInsight: 'WebSockets eliminate polling latency. Message sent → server broadcasts → all connected clients receive in <100ms. Essential for chat feel.'
      },
      requirements: {
        functional: [
          'Establish WebSocket connection per user',
          'Send messages to chat room',
          'Receive messages in real-time',
          'Handle connection drops and reconnects'
        ],
        nonFunctional: [
          'Message delivery < 100ms',
          'Reconnect within 5 seconds'
        ]
      },
      hints: [
        'Connection: ws://server/gateway, auth token in first message',
        'Message: {type: MESSAGE_CREATE, channel_id, content, author}',
        'Heartbeat: ping/pong every 30s to detect dead connections'
      ],
      expectedComponents: ['WebSocket Gateway', 'Message Handler', 'Connection Manager'],
      successCriteria: ['Messages delivered instantly', 'Reconnection works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Message Persistence',
      phase: 1,
      phaseTitle: 'Chat Rooms',
      learningObjective: 'Store and retrieve message history',
      thinkingFramework: {
        framework: 'Append-Heavy Storage',
        approach: 'Messages are append-only (rarely edited/deleted). Store in time-series fashion. Partition by channel for locality. Index for search later.',
        keyInsight: 'Chat is write-heavy, read-recent. Optimize for appending new messages and fetching last N messages. Historical search is secondary.'
      },
      requirements: {
        functional: [
          'Persist all messages to database',
          'Load message history on join',
          'Support message editing and deletion',
          'Paginate through old messages'
        ],
        nonFunctional: [
          'Write latency < 50ms',
          'Load last 50 messages < 100ms'
        ]
      },
      hints: [
        'Message: {id (snowflake), channel_id, author_id, content, timestamp, edited_at}',
        'Partition: by channel_id for query locality',
        'Pagination: before_id cursor, not offset'
      ],
      expectedComponents: ['Message Store', 'History Loader', 'Pagination'],
      successCriteria: ['Messages persisted', 'History loads correctly'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-3',
      title: 'User Presence',
      phase: 1,
      phaseTitle: 'Chat Rooms',
      learningObjective: 'Track and broadcast online status',
      thinkingFramework: {
        framework: 'Presence System',
        approach: 'Track connection state: online, idle, dnd, offline. Broadcast presence changes to relevant users. Aggregate presence across multiple devices.',
        keyInsight: 'Presence is eventually consistent. Small delay (1-2s) acceptable. Dont broadcast every keystroke - batch presence updates.'
      },
      requirements: {
        functional: [
          'Track user online/offline status',
          'Support multiple status types (online, idle, dnd)',
          'Broadcast presence to friends/server members',
          'Handle multi-device presence'
        ],
        nonFunctional: [
          'Presence update propagation < 2 seconds'
        ]
      },
      hints: [
        'Status: online (active), idle (inactive 5min), dnd, invisible, offline',
        'Multi-device: user online if ANY device online',
        'Broadcast: only to users who can see (friends, shared servers)'
      ],
      expectedComponents: ['Presence Tracker', 'Status Aggregator', 'Presence Broadcaster'],
      successCriteria: ['Presence tracked correctly', 'Updates broadcast'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Servers & Channels (Steps 4-6)
    {
      id: 'step-4',
      title: 'Server & Channel Model',
      phase: 2,
      phaseTitle: 'Servers & Channels',
      learningObjective: 'Organize communities into servers and channels',
      thinkingFramework: {
        framework: 'Hierarchical Organization',
        approach: 'Server = community. Channels = topics within server. Categories group channels. Members join servers, access specific channels based on roles.',
        keyInsight: 'Server is the unit of community. User joins server once, sees all permitted channels. Simplifies permission model vs per-channel membership.'
      },
      requirements: {
        functional: [
          'Create servers with name and icon',
          'Create text and voice channels',
          'Organize channels into categories',
          'Join/leave servers'
        ],
        nonFunctional: [
          'User can join up to 100 servers',
          'Server can have up to 500 channels'
        ]
      },
      hints: [
        'Server: {id, name, icon, owner_id, created_at}',
        'Channel: {id, server_id, name, type: text|voice, category_id, position}',
        'Member: {user_id, server_id, joined_at, nickname}'
      ],
      expectedComponents: ['Server Manager', 'Channel Manager', 'Membership'],
      successCriteria: ['Servers created', 'Channels organized'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-5',
      title: 'Roles & Permissions',
      phase: 2,
      phaseTitle: 'Servers & Channels',
      learningObjective: 'Control access with role-based permissions',
      thinkingFramework: {
        framework: 'Permission Hierarchy',
        approach: 'Roles have permission bitmask. Users have multiple roles. Effective permission = combine all role permissions. Channel overrides for exceptions.',
        keyInsight: 'Permission is a bitmask. SEND_MESSAGES = 0x800, READ_MESSAGES = 0x400. Combine with OR, check with AND. Fast permission checks.'
      },
      requirements: {
        functional: [
          'Create roles with permissions',
          'Assign roles to members',
          'Calculate effective permissions',
          'Channel-level permission overrides'
        ],
        nonFunctional: [
          'Permission check < 1ms'
        ]
      },
      hints: [
        'Role: {id, server_id, name, permissions: bigint, position, color}',
        'Permissions: bitmask (ADMINISTRATOR, MANAGE_CHANNELS, SEND_MESSAGES, etc)',
        'Override: {channel_id, role_id, allow: bigint, deny: bigint}'
      ],
      expectedComponents: ['Role Manager', 'Permission Calculator', 'Override Handler'],
      successCriteria: ['Roles control access', 'Overrides work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Invites & Onboarding',
      phase: 2,
      phaseTitle: 'Servers & Channels',
      learningObjective: 'Grow communities with invite system',
      thinkingFramework: {
        framework: 'Viral Growth',
        approach: 'Invite links with optional expiry and use limits. Track invite source for analytics. Onboarding flow for new members (rules, role selection).',
        keyInsight: 'Invite links are growth engine. discord.gg/CODE format. Vanity URLs for established servers. Track which invites bring most members.'
      },
      requirements: {
        functional: [
          'Generate invite links with expiry',
          'Track invite usage and source',
          'Vanity URLs for servers',
          'Member onboarding flow'
        ],
        nonFunctional: [
          'Invite resolution < 50ms'
        ]
      },
      hints: [
        'Invite: {code, server_id, channel_id, inviter_id, uses, max_uses, expires_at}',
        'Vanity: server_id → custom code mapping',
        'Onboarding: rules acceptance, role selection, welcome channel'
      ],
      expectedComponents: ['Invite Generator', 'Invite Resolver', 'Onboarding Flow'],
      successCriteria: ['Invites work', 'Members onboarded'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Voice & Video (Steps 7-9)
    {
      id: 'step-7',
      title: 'Voice Channels',
      phase: 3,
      phaseTitle: 'Voice & Video',
      learningObjective: 'Enable real-time voice communication',
      thinkingFramework: {
        framework: 'Voice Architecture',
        approach: 'Separate voice servers from chat. WebRTC for peer connections. SFU (Selective Forwarding Unit) for group calls. Opus codec for low latency.',
        keyInsight: 'Voice needs dedicated infrastructure. Chat server handles signaling (who joins), voice server handles media. Separate scaling concerns.'
      },
      requirements: {
        functional: [
          'Join/leave voice channels',
          'Transmit voice in real-time',
          'Support multiple participants',
          'Mute/deafen controls'
        ],
        nonFunctional: [
          'Voice latency < 200ms',
          'Support 25 users per channel'
        ]
      },
      hints: [
        'Signaling: WebSocket messages for join/leave/mute',
        'Media: WebRTC with SFU, Opus codec at 64kbps',
        'SFU: receives all streams, forwards selectively'
      ],
      expectedComponents: ['Voice Gateway', 'SFU Server', 'WebRTC Handler'],
      successCriteria: ['Voice works in real-time', 'Multiple users supported'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Video & Screen Share',
      phase: 3,
      phaseTitle: 'Voice & Video',
      learningObjective: 'Add video and screen sharing capabilities',
      thinkingFramework: {
        framework: 'Bandwidth Management',
        approach: 'Video is bandwidth-heavy. Simulcast: send multiple quality levels. SFU selects based on viewer bandwidth. Screen share at higher resolution, lower framerate.',
        keyInsight: 'Simulcast is key for group video. Sender encodes 3 qualities (720p, 360p, 180p). SFU picks best for each receiver. Adapts to network.'
      },
      requirements: {
        functional: [
          'Enable camera in voice channel',
          'Share screen with participants',
          'Adaptive quality based on bandwidth',
          'Picture-in-picture and layouts'
        ],
        nonFunctional: [
          'Video: 720p at 30fps',
          'Screen: 1080p at 15fps'
        ]
      },
      hints: [
        'Simulcast: VP8/H264, three spatial layers',
        'Screen share: capture API, separate track from camera',
        'Layout: active speaker, grid, focus mode'
      ],
      expectedComponents: ['Video Handler', 'Screen Capture', 'Quality Adapter'],
      successCriteria: ['Video streams work', 'Screen share functional'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Go Live Streaming',
      phase: 3,
      phaseTitle: 'Voice & Video',
      learningObjective: 'Stream gameplay to channel viewers',
      thinkingFramework: {
        framework: 'One-to-Many Streaming',
        approach: 'Game capture with audio. Stream to voice channel viewers. Higher quality than video call. Viewer-side controls (quality, volume).',
        keyInsight: 'Go Live is different from video call. One sender, many viewers. Can use more bandwidth per viewer since only one upstream. Better quality.'
      },
      requirements: {
        functional: [
          'Capture game window with audio',
          'Stream to channel viewers',
          'Viewer quality selection',
          'Stream preview before going live'
        ],
        nonFunctional: [
          'Stream quality: up to 1080p 60fps',
          'Stream latency < 500ms'
        ]
      },
      hints: [
        'Capture: game-specific or window capture API',
        'Encoding: H264 at variable bitrate 2-8 Mbps',
        'Distribution: SFU multicasts to viewers'
      ],
      expectedComponents: ['Game Capture', 'Stream Encoder', 'Viewer Distribution'],
      successCriteria: ['Streaming works', 'Viewers can watch'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Platform Scale (Steps 10-12)
    {
      id: 'step-10',
      title: 'Gateway Sharding',
      phase: 4,
      phaseTitle: 'Platform Scale',
      learningObjective: 'Scale WebSocket connections horizontally',
      thinkingFramework: {
        framework: 'Connection Sharding',
        approach: 'Single server cant handle millions of connections. Shard by user ID or server ID. Each gateway handles subset. Coordinate via message bus.',
        keyInsight: 'Gateway is stateful (holds connections). Shard assignment must be deterministic. User reconnects to same shard. Message routing via pub/sub.'
      },
      requirements: {
        functional: [
          'Distribute connections across gateways',
          'Route messages to correct gateway',
          'Handle gateway failures',
          'Rebalance on scaling'
        ],
        nonFunctional: [
          'Support 1M concurrent connections',
          'Failover < 30 seconds'
        ]
      },
      hints: [
        'Shard: user_id % num_shards → gateway assignment',
        'Routing: pub/sub (Redis, Kafka) for cross-gateway messages',
        'Failover: detect dead gateway, redistribute connections'
      ],
      expectedComponents: ['Gateway Cluster', 'Shard Router', 'Failover Manager'],
      successCriteria: ['Connections distributed', 'Messages routed correctly'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-11',
      title: 'Large Server Optimization',
      phase: 4,
      phaseTitle: 'Platform Scale',
      learningObjective: 'Handle servers with millions of members',
      thinkingFramework: {
        framework: 'Lazy Loading',
        approach: 'Dont send full member list for large servers. Lazy load: request members as needed. Presence only for visible users. Efficient member search.',
        keyInsight: 'Server with 500K members cant send full list on join. Send online count, load members on demand. Search API for finding specific members.'
      },
      requirements: {
        functional: [
          'Lazy load member list',
          'Efficient member search',
          'Presence for visible members only',
          'Member list pagination'
        ],
        nonFunctional: [
          'Support servers with 1M+ members',
          'Member search < 500ms'
        ]
      },
      hints: [
        'Lazy: GUILD_MEMBERS_CHUNK event, request specific ranges',
        'Search: index by username, nickname, discriminator',
        'Presence: subscribe to presence for sidebar members only'
      ],
      expectedComponents: ['Member Loader', 'Member Search', 'Presence Subscription'],
      successCriteria: ['Large servers performant', 'Search works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Stage Channels & Events',
      phase: 4,
      phaseTitle: 'Platform Scale',
      learningObjective: 'Host large-scale audio events',
      thinkingFramework: {
        framework: 'Broadcast Mode',
        approach: 'Stage = one-to-many audio. Speakers broadcast, audience listens. Raise hand to request speaking. Scheduled events with discovery.',
        keyInsight: 'Stage channels solve the large voice problem. Regular voice: everyone can talk. Stage: controlled speakers, passive audience. Scales to thousands.'
      },
      requirements: {
        functional: [
          'Create stage channels',
          'Speaker and audience roles',
          'Raise hand / invite to speak',
          'Scheduled events with notifications'
        ],
        nonFunctional: [
          'Support 10K+ listeners',
          'Speaker latency < 500ms'
        ]
      },
      hints: [
        'Stage: speakers in voice, audience receive-only',
        'Request to speak: queue, moderator approves',
        'Event: {server_id, channel_id, name, start_time, description}'
      ],
      expectedComponents: ['Stage Manager', 'Speaker Queue', 'Event Scheduler'],
      successCriteria: ['Stage channels work', 'Events discoverable'],
      estimatedTime: '8 minutes'
    }
  ]
};
