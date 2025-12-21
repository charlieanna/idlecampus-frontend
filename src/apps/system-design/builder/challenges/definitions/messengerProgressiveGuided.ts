import { GuidedTutorial } from '../../types/guidedTutorial';

export const messengerProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'messenger-progressive',
  title: 'Design Facebook Messenger',
  description: 'Build a messaging platform from simple chat to cross-platform communication hub',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design real-time message delivery',
    'Implement multi-platform sync',
    'Build group messaging at scale',
    'Handle media and rich messages',
    'Scale to billions of messages daily'
  ],
  prerequisites: ['Real-time systems', 'Messaging queues', 'Mobile development'],
  tags: ['messaging', 'real-time', 'chat', 'social', 'scale'],

  progressiveStory: {
    title: 'Messenger Evolution',
    premise: "You're building Facebook's messaging platform. Starting with simple direct messages, you'll evolve to support groups, video calls, bots, and billions of messages across all platforms.",
    phases: [
      { phase: 1, title: 'Direct Messages', description: 'One-on-one chat' },
      { phase: 2, title: 'Rich Media', description: 'Photos, videos, and more' },
      { phase: 3, title: 'Groups & Calls', description: 'Multi-party communication' },
      { phase: 4, title: 'Platform', description: 'Bots and scale' }
    ]
  },

  steps: [
    // PHASE 1: Direct Messages (Steps 1-3)
    {
      id: 'step-1',
      title: 'Message Delivery',
      phase: 1,
      phaseTitle: 'Direct Messages',
      learningObjective: 'Deliver messages in real-time',
      thinkingFramework: {
        framework: 'Push-Based Delivery',
        approach: 'Long-lived connection per device. Server pushes messages instantly. Queue for offline devices. Delivery receipts.',
        keyInsight: 'Messaging is push-first. Dont poll. Maintain persistent connection (MQTT, WebSocket). Push immediately, queue if offline.'
      },
      requirements: {
        functional: [
          'Send text messages',
          'Real-time delivery to online recipients',
          'Queue messages for offline users',
          'Delivery and read receipts'
        ],
        nonFunctional: [
          'Delivery latency < 200ms (online)',
          'Message persistence: forever'
        ]
      },
      hints: [
        'Message: {id, thread_id, sender, content, timestamp, status}',
        'Status: sent → delivered → read',
        'Connection: MQTT for mobile (battery efficient), WebSocket for web'
      ],
      expectedComponents: ['Message Store', 'Push Service', 'Receipt Handler'],
      successCriteria: ['Messages deliver instantly', 'Receipts work'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-2',
      title: 'Conversation Threads',
      phase: 1,
      phaseTitle: 'Direct Messages',
      learningObjective: 'Organize messages into conversations',
      thinkingFramework: {
        framework: 'Thread Model',
        approach: 'Thread = conversation between participants. Messages belong to thread. Thread has metadata (last message, unread count). Inbox is list of threads.',
        keyInsight: 'Thread is the organizing unit. User sees inbox of threads, not list of messages. Thread ordering by last activity. Unread badge per thread.'
      },
      requirements: {
        functional: [
          'Create conversation threads',
          'Add messages to threads',
          'Track unread count per thread',
          'Show inbox sorted by activity'
        ],
        nonFunctional: [
          'Inbox load < 300ms',
          'Unread counts accurate'
        ]
      },
      hints: [
        'Thread: {id, participants, last_message, updated_at}',
        'Unread: {user_id, thread_id, last_read_message_id}',
        'Inbox: threads ordered by updated_at DESC'
      ],
      expectedComponents: ['Thread Store', 'Inbox Manager', 'Unread Tracker'],
      successCriteria: ['Threads organize messages', 'Inbox works'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Typing Indicators',
      phase: 1,
      phaseTitle: 'Direct Messages',
      learningObjective: 'Show real-time typing status',
      thinkingFramework: {
        framework: 'Ephemeral Presence',
        approach: 'Send typing event when user types. Timeout after pause. Broadcast to other participants. Dont persist - presence only.',
        keyInsight: 'Typing indicators are ephemeral. No storage. Fire-and-forget delivery. Show for 3-5 seconds, auto-clear if no updates.'
      },
      requirements: {
        functional: [
          'Detect user typing',
          'Broadcast to thread participants',
          'Auto-clear after timeout',
          'Handle multiple typers'
        ],
        nonFunctional: [
          'Typing indicator delay < 100ms',
          'No persistence'
        ]
      },
      hints: [
        'Event: {thread_id, user_id, typing: true}',
        'Throttle: send at most once per second',
        'Clear: timeout after 5 seconds of no typing'
      ],
      expectedComponents: ['Typing Detector', 'Presence Broadcaster', 'Client Handler'],
      successCriteria: ['Typing shows in real-time', 'Clears correctly'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Rich Media (Steps 4-6)
    {
      id: 'step-4',
      title: 'Photo and Video Messages',
      phase: 2,
      phaseTitle: 'Rich Media',
      learningObjective: 'Share media in conversations',
      thinkingFramework: {
        framework: 'Media Pipeline',
        approach: 'Upload media → process → store → send message with media reference. Thumbnails for preview. Lazy load full media.',
        keyInsight: 'Media is heavy. Upload async from message send. Show thumbnail immediately. Full resolution on tap. Compress for mobile.'
      },
      requirements: {
        functional: [
          'Send photos and videos',
          'Generate thumbnails',
          'Progressive loading',
          'Download and save media'
        ],
        nonFunctional: [
          'Upload < 5 seconds for 10MB',
          'Thumbnail shows immediately'
        ]
      },
      hints: [
        'Message: {type: media, media_id, thumbnail_url, full_url}',
        'Processing: resize, compress, generate thumbnail',
        'Thumbnail: show in thread, tap for full resolution'
      ],
      expectedComponents: ['Media Upload', 'Media Processor', 'Media Store'],
      successCriteria: ['Media sends correctly', 'Thumbnails work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Reactions and Replies',
      phase: 2,
      phaseTitle: 'Rich Media',
      learningObjective: 'Enable rich interactions with messages',
      thinkingFramework: {
        framework: 'Message Interactions',
        approach: 'React with emoji to any message. Reply to specific message (threading). Forward messages. Edit and unsend.',
        keyInsight: 'Reactions reduce noise. Instead of "haha" message, just react. Replies create context. Unsend provides control but notifies others.'
      },
      requirements: {
        functional: [
          'React to messages with emoji',
          'Reply to specific message',
          'Forward messages',
          'Edit and unsend (within time limit)'
        ],
        nonFunctional: [
          'Reaction update real-time',
          'Unsend window: 10 minutes'
        ]
      },
      hints: [
        'Reaction: {message_id, user_id, emoji}',
        'Reply: {reply_to_message_id} in message',
        'Unsend: remove content, leave "message removed" placeholder'
      ],
      expectedComponents: ['Reaction Handler', 'Reply System', 'Edit/Unsend'],
      successCriteria: ['Reactions work', 'Replies thread correctly'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Stickers and GIFs',
      phase: 2,
      phaseTitle: 'Rich Media',
      learningObjective: 'Enable expressive visual content',
      thinkingFramework: {
        framework: 'Expression Library',
        approach: 'Sticker packs (downloadable sets). GIF search (GIPHY integration). Preview before send. Custom stickers.',
        keyInsight: 'Stickers drive engagement. Pack downloads = collection behavior. GIF search must be fast. Preview shows exact what recipient sees.'
      },
      requirements: {
        functional: [
          'Browse and send stickers',
          'Download sticker packs',
          'GIF search and send',
          'Recent stickers/GIFs'
        ],
        nonFunctional: [
          'GIF search < 500ms',
          'Sticker load instant (pre-cached)'
        ]
      },
      hints: [
        'Sticker: {pack_id, sticker_id, image_url}',
        'GIF: GIPHY API integration, embed URL',
        'Recents: store last 20 used stickers/GIFs per user'
      ],
      expectedComponents: ['Sticker Store', 'GIF Search', 'Recent Manager'],
      successCriteria: ['Stickers send', 'GIF search works'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Groups & Calls (Steps 7-9)
    {
      id: 'step-7',
      title: 'Group Messaging',
      phase: 3,
      phaseTitle: 'Groups & Calls',
      learningObjective: 'Enable multi-party conversations',
      thinkingFramework: {
        framework: 'Group Thread',
        approach: 'Thread with multiple participants. Fanout messages to all members. Admin controls. Leave/join functionality.',
        keyInsight: 'Group fanout is expensive. 100-person group = 100 deliveries per message. Optimize with pub/sub pattern. Lazy load member lists.'
      },
      requirements: {
        functional: [
          'Create group with multiple people',
          'Add and remove members',
          'Admin roles and permissions',
          'Leave group'
        ],
        nonFunctional: [
          'Group size: up to 250 members',
          'Message delivery to all < 1 second'
        ]
      },
      hints: [
        'Group: {id, name, icon, members: [{user_id, role, joined_at}]}',
        'Roles: admin, member',
        'Fanout: pub/sub topic per group, members subscribe'
      ],
      expectedComponents: ['Group Manager', 'Member Handler', 'Group Fanout'],
      successCriteria: ['Groups work', 'All members receive messages'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Voice and Video Calls',
      phase: 3,
      phaseTitle: 'Groups & Calls',
      learningObjective: 'Enable real-time calling',
      thinkingFramework: {
        framework: 'WebRTC Calls',
        approach: 'Signaling via message infrastructure. WebRTC for media. TURN relay for NAT traversal. Group calls via SFU.',
        keyInsight: 'Calls reuse connection infrastructure for signaling. Media is P2P when possible. SFU for groups (cant do mesh with many participants).'
      },
      requirements: {
        functional: [
          'Initiate voice and video calls',
          'Accept/decline incoming calls',
          'Group calls (up to 8)',
          'Screen sharing'
        ],
        nonFunctional: [
          'Call setup < 3 seconds',
          'Voice latency < 200ms'
        ]
      },
      hints: [
        'Signaling: offer/answer/ICE via existing message channel',
        'Media: WebRTC with STUN/TURN',
        'Group: SFU server receives all streams, forwards to participants'
      ],
      expectedComponents: ['Signaling Server', 'Media Server', 'Call State'],
      successCriteria: ['Calls connect', 'Group calls work'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-9',
      title: 'Message Sync Across Devices',
      phase: 3,
      phaseTitle: 'Groups & Calls',
      learningObjective: 'Keep all devices in sync',
      thinkingFramework: {
        framework: 'Multi-Device Sync',
        approach: 'Messages delivered to all user devices. Read state syncs (read on phone = read on web). Incremental sync on reconnect.',
        keyInsight: 'Users have phone + web + tablet. All must stay synced. Message read on one = read on all. Sync is eventual but fast.'
      },
      requirements: {
        functional: [
          'Deliver to all user devices',
          'Sync read status across devices',
          'Catch-up sync on reconnect',
          'Handle offline edits'
        ],
        nonFunctional: [
          'Cross-device sync < 2 seconds',
          'Reconnect sync efficient'
        ]
      },
      hints: [
        'Device: {user_id, device_id, connection, last_sync}',
        'Sync: on reconnect, fetch messages since last_sync timestamp',
        'Read sync: propagate read receipts to all user devices'
      ],
      expectedComponents: ['Device Manager', 'Sync Engine', 'Catch-Up Service'],
      successCriteria: ['All devices in sync', 'Read status syncs'],
      estimatedTime: '8 minutes'
    },

    // PHASE 4: Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Chat Bots',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Enable automated messaging agents',
      thinkingFramework: {
        framework: 'Bot Platform',
        approach: 'Bots are special accounts. Receive messages via webhook. Send messages via API. Rich templates for structured messages.',
        keyInsight: 'Bots enable business use cases. Customer support, ordering, notifications. Rich templates (carousels, buttons) make bots powerful.'
      },
      requirements: {
        functional: [
          'Create bot accounts',
          'Webhook message delivery',
          'Send messages via API',
          'Rich message templates'
        ],
        nonFunctional: [
          'Webhook delivery < 1 second',
          'API rate limits'
        ]
      },
      hints: [
        'Bot: {id, name, webhook_url, access_token}',
        'Templates: text, image, buttons, carousel, quick_replies',
        'Webhook: POST message events to bot URL'
      ],
      expectedComponents: ['Bot Manager', 'Webhook Service', 'Template Renderer'],
      successCriteria: ['Bots receive messages', 'Templates render'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'End-to-End Encryption',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Encrypt messages so server cant read them',
      thinkingFramework: {
        framework: 'E2EE Messaging',
        approach: 'Signal Protocol for key exchange. Messages encrypted client-side. Server only routes ciphertext. Multi-device key distribution.',
        keyInsight: 'E2EE means server cant read messages. Challenge: multi-device (need key on each device). Solution: send message encrypted per device.'
      },
      requirements: {
        functional: [
          'Key exchange between users',
          'Encrypt messages client-side',
          'Multi-device encryption',
          'Key verification'
        ],
        nonFunctional: [
          'Encryption overhead < 50ms',
          'Forward secrecy'
        ]
      },
      hints: [
        'Protocol: Signal (Double Ratchet, X3DH key exchange)',
        'Multi-device: encrypt message once per recipient device',
        'Verification: safety numbers / key fingerprint comparison'
      ],
      expectedComponents: ['Key Manager', 'Encryption Service', 'Verification UI'],
      successCriteria: ['Messages encrypted', 'Multi-device works'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-12',
      title: 'Scale to Billions',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Handle billions of messages daily',
      thinkingFramework: {
        framework: 'Massive Scale',
        approach: 'Shard by user ID. Connection servers stateless. Message store is log-structured. Cache hot threads. Geo-distributed.',
        keyInsight: 'Sharding is essential. User A messages user B? Message goes to both shards. Connection tier is stateless, can scale horizontally.'
      },
      requirements: {
        functional: [
          'Horizontal scaling',
          'Geographic distribution',
          'Hot thread caching',
          'Graceful degradation'
        ],
        nonFunctional: [
          '100B messages/day',
          '99.99% availability'
        ]
      },
      hints: [
        'Shard: user_id % num_shards → data location',
        'Connection: stateless, any server handles any user',
        'Cache: hot threads (recent activity) in memory'
      ],
      expectedComponents: ['Shard Router', 'Connection Pool', 'Thread Cache'],
      successCriteria: ['Handles scale', 'Low latency globally'],
      estimatedTime: '8 minutes'
    }
  ]
};
