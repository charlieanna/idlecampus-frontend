import { GuidedTutorial } from '../../types/guidedTutorial';

export const telegramProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'telegram-progressive',
  title: 'Design Telegram',
  description: 'Build a secure messaging platform from encrypted chat to channels with millions of subscribers',
  difficulty: 'hard',
  estimatedTime: '90 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design multi-device message sync',
    'Implement end-to-end encryption',
    'Build channels and supergroups at scale',
    'Handle bots and mini-apps platform',
    'Scale to billions of messages daily'
  ],
  prerequisites: ['Encryption', 'Distributed systems', 'Real-time messaging'],
  tags: ['messaging', 'encryption', 'channels', 'bots', 'real-time'],

  progressiveStory: {
    title: 'Telegram Evolution',
    premise: "You're building a cloud-based messaging platform. Starting with basic chat, you'll evolve to support encrypted messaging, massive channels, bot ecosystem, and a mini-app platform.",
    phases: [
      { phase: 1, title: 'Cloud Messaging', description: 'Multi-device sync' },
      { phase: 2, title: 'Groups & Channels', description: 'Large-scale communication' },
      { phase: 3, title: 'Security', description: 'Encryption and privacy' },
      { phase: 4, title: 'Platform', description: 'Bots and mini-apps' }
    ]
  },

  steps: [
    // PHASE 1: Cloud Messaging (Steps 1-3)
    {
      id: 'step-1',
      title: 'Multi-Device Sync',
      phase: 1,
      phaseTitle: 'Cloud Messaging',
      learningObjective: 'Sync messages across unlimited devices',
      thinkingFramework: {
        framework: 'Cloud-First Architecture',
        approach: 'Messages stored in cloud, not just on device. Any device can access full history. Login on new device → sync all conversations. No primary device.',
        keyInsight: 'Unlike WhatsApp (phone-primary), Telegram is cloud-native. Server is source of truth. Enables web, desktop, mobile with full feature parity.'
      },
      requirements: {
        functional: [
          'Login on multiple devices simultaneously',
          'Full message history on each device',
          'Real-time sync across devices',
          'Device management (logout remotely)'
        ],
        nonFunctional: [
          'Sync latency < 500ms',
          'Unlimited devices per account'
        ]
      },
      hints: [
        'Session: {user_id, device_id, auth_key, last_active, app_version}',
        'Sync: pull on connect, push on new messages',
        'State: server tracks read position per device'
      ],
      expectedComponents: ['Session Manager', 'Sync Service', 'Message Store'],
      successCriteria: ['Multi-device works', 'History accessible'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-2',
      title: 'Message Types & Media',
      phase: 1,
      phaseTitle: 'Cloud Messaging',
      learningObjective: 'Support rich message types',
      thinkingFramework: {
        framework: 'Polymorphic Messages',
        approach: 'Messages have types: text, photo, video, voice, document, sticker, poll. Each type has specific handling. Media uploaded to cloud storage.',
        keyInsight: 'Media handling is complex. Photos need multiple sizes. Videos need streaming. Documents need preview generation. Stickers need animation support.'
      },
      requirements: {
        functional: [
          'Text messages with formatting',
          'Photo/video with compression',
          'Voice messages and video notes',
          'Documents and file sharing'
        ],
        nonFunctional: [
          'File upload: up to 2GB',
          'Media compression on upload'
        ]
      },
      hints: [
        'Message: {id, chat_id, type, content, media_id, timestamp}',
        'Media: {id, type, sizes: [{width, height, url}], duration}',
        'Compression: photos to JPEG, videos to MP4/H264'
      ],
      expectedComponents: ['Message Handler', 'Media Processor', 'File Storage'],
      successCriteria: ['All types work', 'Media optimized'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'MTProto Protocol',
      phase: 1,
      phaseTitle: 'Cloud Messaging',
      learningObjective: 'Implement efficient binary protocol',
      thinkingFramework: {
        framework: 'Custom Protocol',
        approach: 'MTProto: binary protocol optimized for mobile. Encryption layer + transport layer. Works over TCP, HTTP, UDP. Handles unreliable networks.',
        keyInsight: 'Custom protocol vs HTTP: smaller payloads, connection reuse, built-in encryption. Worth complexity for messaging app with billions of messages.'
      },
      requirements: {
        functional: [
          'Binary serialization (TL schema)',
          'Transport encryption',
          'Connection multiplexing',
          'Automatic reconnection'
        ],
        nonFunctional: [
          'Message overhead < 50 bytes',
          'Reconnect < 1 second'
        ]
      },
      hints: [
        'TL: type language for schema definition, like protobuf',
        'Encryption: AES-256-IGE, per-message key derivation',
        'Transport: TCP with keep-alive, fallback to HTTP'
      ],
      expectedComponents: ['Protocol Handler', 'Serializer', 'Connection Manager'],
      successCriteria: ['Protocol efficient', 'Reliable delivery'],
      estimatedTime: '6 minutes'
    },

    // PHASE 2: Groups & Channels (Steps 4-6)
    {
      id: 'step-4',
      title: 'Supergroups',
      phase: 2,
      phaseTitle: 'Groups & Channels',
      learningObjective: 'Support groups with up to 200K members',
      thinkingFramework: {
        framework: 'Scalable Groups',
        approach: 'Regular group: everyone can see members. Supergroup: members fetched on demand. Messages stored server-side. Admin hierarchy.',
        keyInsight: 'Supergroup is fundamentally different from regular group. Cant send member list to 200K people. Lazy load members, paginated history.'
      },
      requirements: {
        functional: [
          'Create supergroups up to 200K members',
          'Admin roles and permissions',
          'Slow mode (rate limiting)',
          'Pinned messages and topics'
        ],
        nonFunctional: [
          'Message delivery to 200K: < 5 seconds',
          'Member list: paginated, not full'
        ]
      },
      hints: [
        'Supergroup: {id, title, members_count, admins, permissions}',
        'Permission: send_messages, send_media, add_members, pin_messages',
        'Slow mode: one message per user per N seconds'
      ],
      expectedComponents: ['Supergroup Manager', 'Permission System', 'Rate Limiter'],
      successCriteria: ['Large groups work', 'Permissions enforced'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'Channels (Broadcast)',
      phase: 2,
      phaseTitle: 'Groups & Channels',
      learningObjective: 'Enable one-to-many broadcasting',
      thinkingFramework: {
        framework: 'Broadcast Model',
        approach: 'Channel = one-way broadcast to subscribers. Only admins post. Subscribers receive. View counts. Unlimited subscribers.',
        keyInsight: 'Channels are media distribution, not conversation. Optimized for one sender, millions of receivers. Different fanout strategy than groups.'
      },
      requirements: {
        functional: [
          'Create channels with unlimited subscribers',
          'Multiple admins can post',
          'View counts per message',
          'Subscriber-only comments'
        ],
        nonFunctional: [
          'Post delivery: < 30 seconds to all',
          'Support 10M+ subscribers'
        ]
      },
      hints: [
        'Channel: {id, title, username, subscribers_count, admins}',
        'Post: no recipient list, broadcast to all subscribers',
        'Views: approximate count, not real-time accurate'
      ],
      expectedComponents: ['Channel Manager', 'Broadcast Service', 'View Counter'],
      successCriteria: ['Channels broadcast', 'Scales to millions'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Message Search & History',
      phase: 2,
      phaseTitle: 'Groups & Channels',
      learningObjective: 'Search across all messages',
      thinkingFramework: {
        framework: 'Full-Text Search',
        approach: 'Index all messages. Search within chat, globally, by type. Filter by date, sender, media type. Instant search results.',
        keyInsight: 'Cloud storage enables search. All messages indexed server-side. Privacy consideration: search only your chats, not others.'
      },
      requirements: {
        functional: [
          'Search within specific chat',
          'Global search across all chats',
          'Filter by message type',
          'Search in shared media'
        ],
        nonFunctional: [
          'Search results < 500ms',
          'Index update: near real-time'
        ]
      },
      hints: [
        'Index: message text, sender, chat, timestamp, type',
        'Query: full-text + filters (from:username, in:chat, type:photo)',
        'Results: paginated, newest first'
      ],
      expectedComponents: ['Search Index', 'Query Parser', 'Result Ranker'],
      successCriteria: ['Search works', 'Results relevant'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Security (Steps 7-9)
    {
      id: 'step-7',
      title: 'Secret Chats (E2EE)',
      phase: 3,
      phaseTitle: 'Security',
      learningObjective: 'Implement end-to-end encryption',
      thinkingFramework: {
        framework: 'Device-to-Device Encryption',
        approach: 'Secret chat: encrypted on sender device, decrypted on recipient device. Server cant read. No cloud backup. Device-specific.',
        keyInsight: 'E2EE trades convenience for security. No multi-device (keys on one device). No server search. Self-destruct timers. For sensitive conversations.'
      },
      requirements: {
        functional: [
          'Diffie-Hellman key exchange',
          'End-to-end encrypted messages',
          'Self-destruct timer',
          'Screenshot notification'
        ],
        nonFunctional: [
          'Key exchange < 1 second',
          'No server-side message storage'
        ]
      },
      hints: [
        'Key exchange: DH with server-relayed parameters',
        'Encryption: AES-256-IGE with message-specific key',
        'Verification: key fingerprint comparison'
      ],
      expectedComponents: ['Key Exchange', 'E2E Encryptor', 'Secret Chat Store'],
      successCriteria: ['E2EE works', 'Server cant decrypt'],
      estimatedTime: '10 minutes'
    },
    {
      id: 'step-8',
      title: 'Two-Factor Authentication',
      phase: 3,
      phaseTitle: 'Security',
      learningObjective: 'Add additional account security',
      thinkingFramework: {
        framework: 'Account Protection',
        approach: 'Phone code (first factor) + password (second factor). Password never sent to server (SRP protocol). Recovery email for password reset.',
        keyInsight: 'SRP (Secure Remote Password) means server never sees password. Only verifier stored. Even database breach doesnt reveal passwords.'
      },
      requirements: {
        functional: [
          'Set 2FA password',
          'SRP-based verification',
          'Recovery email setup',
          'Password hint'
        ],
        nonFunctional: [
          'Password never transmitted in clear',
          'Brute-force protection'
        ]
      },
      hints: [
        'SRP: client proves knowledge of password without sending it',
        'Verifier: stored on server, derived from password',
        'Recovery: email link to reset, requires phone code too'
      ],
      expectedComponents: ['SRP Handler', 'Recovery System', 'Rate Limiter'],
      successCriteria: ['2FA works', 'Password secure'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Privacy Controls',
      phase: 3,
      phaseTitle: 'Security',
      learningObjective: 'Give users control over their data',
      thinkingFramework: {
        framework: 'Granular Privacy',
        approach: 'Control who sees: phone number, last seen, profile photo, forwarded messages. Per-setting: everyone, contacts, nobody, exceptions.',
        keyInsight: 'Privacy is competitive advantage. Users want control. Hide phone number but still be reachable via username. Prevent tracking via last seen.'
      },
      requirements: {
        functional: [
          'Control last seen visibility',
          'Hide phone number',
          'Restrict who can add to groups',
          'Delete messages for everyone'
        ],
        nonFunctional: [
          'Privacy check < 10ms'
        ]
      },
      hints: [
        'Settings: {who_can_see, exceptions: {allow: [], block: []}}',
        'Options: everybody, contacts, nobody',
        'Forward privacy: hide original sender identity'
      ],
      expectedComponents: ['Privacy Settings', 'Visibility Checker', 'Message Deleter'],
      successCriteria: ['Privacy enforced', 'Users in control'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Platform (Steps 10-12)
    {
      id: 'step-10',
      title: 'Bot Platform',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Enable third-party bot integration',
      thinkingFramework: {
        framework: 'Bot API',
        approach: 'Bots = automated accounts controlled via API. Receive messages via webhook or polling. Can send messages, media, keyboards. Inline mode for cross-chat.',
        keyInsight: 'Bots extend platform without Telegram building everything. Weather, translations, games - community builds. API is growth engine.'
      },
      requirements: {
        functional: [
          'Create bot via BotFather',
          'Receive updates (webhook/polling)',
          'Send messages and media',
          'Custom keyboards and buttons'
        ],
        nonFunctional: [
          'Webhook delivery < 1 second',
          'Rate limit: 30 messages/second'
        ]
      },
      hints: [
        'Bot: {id, username, token, webhook_url}',
        'Update: {message, callback_query, inline_query}',
        'Keyboard: {buttons: [[{text, callback_data}]]}'
      ],
      expectedComponents: ['Bot API', 'Webhook Delivery', 'Update Queue'],
      successCriteria: ['Bots work', 'API reliable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Mini Apps (WebApps)',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Run web apps inside Telegram',
      thinkingFramework: {
        framework: 'Embedded Web Platform',
        approach: 'Mini App = web app in Telegram WebView. Access to user info (with permission). Payments via Telegram. Deep integration with chat.',
        keyInsight: 'Mini Apps turn Telegram into super-app. Games, commerce, utilities - all inside Telegram. No app store, instant distribution.'
      },
      requirements: {
        functional: [
          'Open web app in chat',
          'Pass user context to app',
          'Telegram login for web app',
          'In-app payments'
        ],
        nonFunctional: [
          'WebView load < 2 seconds',
          'Secure user data handling'
        ]
      },
      hints: [
        'Launch: button in bot message opens WebView',
        'Context: init_data with user_id, chat_id, signed by bot',
        'Payments: Stars currency or native payment providers'
      ],
      expectedComponents: ['WebView Container', 'Auth Bridge', 'Payment Gateway'],
      successCriteria: ['Mini apps run', 'Payments work'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Global Infrastructure',
      phase: 4,
      phaseTitle: 'Platform',
      learningObjective: 'Scale to billions of messages worldwide',
      thinkingFramework: {
        framework: 'Multi-DC Architecture',
        approach: 'Multiple datacenters worldwide. Users assigned to nearest DC. Cross-DC message routing. Failover between DCs.',
        keyInsight: 'Telegram uses 5 DCs globally. User belongs to one DC (based on phone prefix). Messages route between DCs for cross-region chats.'
      },
      requirements: {
        functional: [
          'Multiple datacenter deployment',
          'Cross-DC message routing',
          'DC migration for users',
          'Automatic failover'
        ],
        nonFunctional: [
          'Cross-DC latency < 300ms',
          '99.99% availability'
        ]
      },
      hints: [
        'DC assignment: phone country code → nearest DC',
        'Routing: message from DC1 user to DC2 user → route via backbone',
        'Migration: move user data between DCs if needed'
      ],
      expectedComponents: ['DC Router', 'Cross-DC Mesh', 'Failover Manager'],
      successCriteria: ['Global low latency', 'High availability'],
      estimatedTime: '8 minutes'
    }
  ]
};
