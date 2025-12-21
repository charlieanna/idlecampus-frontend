import { GuidedTutorial } from '../../types/guidedTutorial';

export const notificationSystemProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'notification-system-progressive',
  title: 'Design a Notification System',
  description: 'Build a notification platform from simple alerts to multi-channel intelligent delivery',
  difficulty: 'medium',
  estimatedTime: '75 minutes',
  category: 'Progressive System Design',
  learningObjectives: [
    'Design multi-channel notification delivery (push, email, SMS)',
    'Implement priority-based queuing and rate limiting',
    'Build user preference management',
    'Add intelligent delivery timing and deduplication',
    'Handle notification analytics and engagement tracking'
  ],
  prerequisites: ['Message queues', 'API design', 'Database basics'],
  tags: ['notifications', 'messaging', 'real-time', 'multi-channel', 'engagement'],

  progressiveStory: {
    title: 'Notification System Evolution',
    premise: "You're building a notification platform for a large application. Starting with simple email alerts, you'll evolve to deliver billions of notifications across multiple channels with intelligent timing.",
    phases: [
      { phase: 1, title: 'Basic Notifications', description: 'Send notifications via single channel' },
      { phase: 2, title: 'Multi-Channel Delivery', description: 'Support push, email, SMS, in-app' },
      { phase: 3, title: 'Smart Delivery', description: 'Preferences, batching, and rate limiting' },
      { phase: 4, title: 'Intelligence Layer', description: 'Optimal timing and engagement analytics' }
    ]
  },

  steps: [
    // PHASE 1: Basic Notifications (Steps 1-3)
    {
      id: 'step-1',
      title: 'Notification Data Model',
      phase: 1,
      phaseTitle: 'Basic Notifications',
      learningObjective: 'Design notification schema and storage',
      thinkingFramework: {
        framework: 'Event-Driven Design',
        approach: 'Notifications are events triggered by actions. Store: what happened, who should know, how to reach them, current status.',
        keyInsight: 'Separate notification content from delivery attempts. One notification can have multiple delivery attempts across channels.'
      },
      requirements: {
        functional: [
          'Store notification with recipient and content',
          'Track notification status (pending, sent, delivered, read)',
          'Support different notification types',
          'Link notifications to triggering events'
        ],
        nonFunctional: []
      },
      hints: [
        'Notification: {id, user_id, type, title, body, data, status, created_at}',
        'Delivery: {notification_id, channel, status, sent_at, delivered_at}',
        'Type determines template and channels'
      ],
      expectedComponents: ['Notification Store', 'Delivery Tracker', 'Event Linker'],
      successCriteria: ['Notifications stored correctly', 'Status tracked accurately'],
      estimatedTime: '6 minutes'
    },
    {
      id: 'step-2',
      title: 'Email Notification Delivery',
      phase: 1,
      phaseTitle: 'Basic Notifications',
      learningObjective: 'Send notifications via email',
      thinkingFramework: {
        framework: 'Provider Abstraction',
        approach: 'Integrate with email provider (SendGrid, SES). Abstract behind interface for swappable providers. Handle bounces and complaints.',
        keyInsight: 'Email delivery is async. Send returns quickly, but delivery/bounce feedback comes via webhook hours later. Track both.'
      },
      requirements: {
        functional: [
          'Send email notifications via provider',
          'Use templates for consistent formatting',
          'Handle delivery webhooks (delivered, bounced, complained)',
          'Track email-specific metrics (opens, clicks)'
        ],
        nonFunctional: [
          'Email sent within 1 minute of trigger'
        ]
      },
      hints: [
        'Provider interface: send(to, subject, body, template_id)',
        'Webhook: update delivery status on callback',
        'Tracking pixel for open tracking'
      ],
      expectedComponents: ['Email Provider Adapter', 'Template Engine', 'Webhook Handler'],
      successCriteria: ['Emails sent successfully', 'Delivery status tracked'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-3',
      title: 'Async Processing Queue',
      phase: 1,
      phaseTitle: 'Basic Notifications',
      learningObjective: 'Queue notifications for reliable delivery',
      thinkingFramework: {
        framework: 'Decouple Trigger from Delivery',
        approach: 'Trigger writes to queue, worker processes. Decouples sending from delivery. Enables retry, rate limiting, and scaling.',
        keyInsight: 'Queue provides durability. If worker crashes, message remains. At-least-once delivery with idempotent processing.'
      },
      requirements: {
        functional: [
          'Queue notification requests',
          'Process queue with worker pool',
          'Retry failed deliveries with backoff',
          'Dead letter queue for persistent failures'
        ],
        nonFunctional: [
          'Process 10K notifications/second',
          'Retry 3 times with exponential backoff'
        ]
      },
      hints: [
        'Queue: notification_id, channel, attempt_count',
        'Backoff: 1min, 5min, 15min',
        'DLQ after max retries for manual review'
      ],
      expectedComponents: ['Notification Queue', 'Worker Pool', 'Retry Manager', 'DLQ'],
      successCriteria: ['Notifications processed reliably', 'Failures retried'],
      estimatedTime: '8 minutes'
    },

    // PHASE 2: Multi-Channel Delivery (Steps 4-6)
    {
      id: 'step-4',
      title: 'Push Notification Channel',
      phase: 2,
      phaseTitle: 'Multi-Channel Delivery',
      learningObjective: 'Add mobile push notification support',
      thinkingFramework: {
        framework: 'Platform-Specific Delivery',
        approach: 'iOS (APNs) and Android (FCM) have different APIs. Abstract behind unified interface. Store device tokens per user.',
        keyInsight: 'Users have multiple devices. Send to all registered devices. Handle token refresh (tokens expire/change on app reinstall).'
      },
      requirements: {
        functional: [
          'Register device tokens per user',
          'Send push via APNs (iOS) and FCM (Android)',
          'Handle token invalidation',
          'Support rich push (images, actions)'
        ],
        nonFunctional: [
          'Push delivered within 5 seconds'
        ]
      },
      hints: [
        'Device: {user_id, token, platform, app_version, last_active}',
        'Unified send: route to APNs or FCM based on platform',
        'Invalid token callback: remove from registry'
      ],
      expectedComponents: ['Device Registry', 'APNs Adapter', 'FCM Adapter', 'Push Router'],
      successCriteria: ['Push works on iOS and Android', 'Invalid tokens cleaned up'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-5',
      title: 'SMS and In-App Channels',
      phase: 2,
      phaseTitle: 'Multi-Channel Delivery',
      learningObjective: 'Add SMS and in-app notification channels',
      thinkingFramework: {
        framework: 'Channel-Appropriate Content',
        approach: 'SMS is expensive and limited (160 chars). In-app is free but requires app open. Choose channel based on urgency and cost.',
        keyInsight: 'In-app notifications: store in DB, poll or push via WebSocket. User sees on next app open. Cheapest channel.'
      },
      requirements: {
        functional: [
          'Send SMS via provider (Twilio)',
          'Store in-app notifications for retrieval',
          'Mark in-app as read/unread',
          'Support notification badges (unread count)'
        ],
        nonFunctional: [
          'SMS for critical alerts only (cost)',
          'In-app: instant for online users'
        ]
      },
      hints: [
        'SMS: {to, body} - keep under 160 chars',
        'In-app: {user_id, notification_id, read: false}',
        'Badge count: COUNT(*) WHERE read = false'
      ],
      expectedComponents: ['SMS Provider Adapter', 'In-App Store', 'Badge Counter'],
      successCriteria: ['SMS delivered', 'In-app notifications visible in UI'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-6',
      title: 'Channel Routing',
      phase: 2,
      phaseTitle: 'Multi-Channel Delivery',
      learningObjective: 'Route notifications to appropriate channels',
      thinkingFramework: {
        framework: 'Channel Selection Logic',
        approach: 'Notification type determines channels. Order confirmation: email + push. Security alert: all channels. Like notification: in-app only.',
        keyInsight: 'Cascade: try push first, if fails/disabled fall back to email. Dont spam all channels for low-priority notifications.'
      },
      requirements: {
        functional: [
          'Configure channels per notification type',
          'Route to multiple channels if configured',
          'Support channel fallback on failure',
          'Respect user channel preferences'
        ],
        nonFunctional: []
      },
      hints: [
        'Type config: {type: "order", channels: ["push", "email"]}',
        'Fallback: if push disabled, use email',
        'User preference overrides type default'
      ],
      expectedComponents: ['Channel Router', 'Type Config Store', 'Fallback Handler'],
      successCriteria: ['Correct channels selected', 'Fallback works'],
      estimatedTime: '6 minutes'
    },

    // PHASE 3: Smart Delivery (Steps 7-9)
    {
      id: 'step-7',
      title: 'User Preferences',
      phase: 3,
      phaseTitle: 'Smart Delivery',
      learningObjective: 'Let users control notification settings',
      thinkingFramework: {
        framework: 'Granular Control',
        approach: 'Users want control: disable marketing, keep security. Preferences at category and channel level. Respect unsubscribe immediately.',
        keyInsight: 'Default to enabled, but make disabling easy. Forced notifications (security, legal) bypass preferences but use sparingly.'
      },
      requirements: {
        functional: [
          'Store preferences per user per category',
          'Enable/disable specific channels',
          'Set quiet hours (no notifications 10pm-8am)',
          'Support one-click unsubscribe'
        ],
        nonFunctional: [
          'Preference check < 10ms'
        ]
      },
      hints: [
        'Preference: {user_id, category, channel, enabled, quiet_hours}',
        'Cache preferences for fast lookup',
        'Unsubscribe token in email footer'
      ],
      expectedComponents: ['Preference Store', 'Preference Cache', 'Unsubscribe Handler'],
      successCriteria: ['Preferences respected', 'Quiet hours enforced'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-8',
      title: 'Rate Limiting & Batching',
      phase: 3,
      phaseTitle: 'Smart Delivery',
      learningObjective: 'Prevent notification overload',
      thinkingFramework: {
        framework: 'User Experience Protection',
        approach: 'Too many notifications = user disables all. Rate limit per user per channel. Batch similar notifications (5 people liked your post).',
        keyInsight: 'Batch window: collect likes for 5 minutes, send one notification. Better UX than 5 separate notifications.'
      },
      requirements: {
        functional: [
          'Rate limit notifications per user',
          'Batch similar notifications in time window',
          'Priority override for critical notifications',
          'Show batched count in notification'
        ],
        nonFunctional: [
          'Max 10 push notifications per hour per user',
          'Batch window: 5 minutes'
        ]
      },
      hints: [
        'Rate limit: sliding window counter per user',
        'Batch key: (user_id, notification_type, target_id)',
        'Priority levels: critical (bypass), high, normal, low'
      ],
      expectedComponents: ['Rate Limiter', 'Batch Aggregator', 'Priority Handler'],
      successCriteria: ['Rate limits enforced', 'Similar notifications batched'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-9',
      title: 'Deduplication',
      phase: 3,
      phaseTitle: 'Smart Delivery',
      learningObjective: 'Prevent duplicate notifications',
      thinkingFramework: {
        framework: 'Idempotent Delivery',
        approach: 'Same trigger can fire multiple times (retries, bugs). Dedup key based on trigger event. Dont send same notification twice.',
        keyInsight: 'Dedup key = hash(user_id, notification_type, trigger_id). Check before queueing. TTL-based expiry for dedup records.'
      },
      requirements: {
        functional: [
          'Generate dedup key for each notification',
          'Skip if notification already sent',
          'TTL for dedup records (24 hours)',
          'Allow re-sending after TTL'
        ],
        nonFunctional: [
          'Zero duplicate notifications'
        ]
      },
      hints: [
        'Dedup key: SHA256(user_id + type + trigger_id)',
        'Redis SETNX with TTL for atomic check-and-set',
        'Log skipped duplicates for debugging'
      ],
      expectedComponents: ['Dedup Store', 'Key Generator', 'Skip Logger'],
      successCriteria: ['No duplicates sent', 'Dedup transparent to sender'],
      estimatedTime: '6 minutes'
    },

    // PHASE 4: Intelligence Layer (Steps 10-12)
    {
      id: 'step-10',
      title: 'Optimal Send Time',
      phase: 4,
      phaseTitle: 'Intelligence Layer',
      learningObjective: 'Deliver notifications when users are most likely to engage',
      thinkingFramework: {
        framework: 'Engagement Optimization',
        approach: 'Users have different active times. Learn from historical engagement. Send when user typically opens app/emails.',
        keyInsight: 'Timezone + behavior pattern. User in PST, usually opens app at 8am and 6pm. Schedule notifications for those windows.'
      },
      requirements: {
        functional: [
          'Track user engagement times',
          'Learn optimal delivery windows per user',
          'Schedule non-urgent notifications for optimal time',
          'Respect quiet hours while optimizing'
        ],
        nonFunctional: [
          'Increase open rate by 20% with timing optimization'
        ]
      },
      hints: [
        'Engagement history: {user_id, hour_of_day, day_of_week, open_count}',
        'Optimal window: top 3 hours by open rate',
        'ML: predict P(open | send_time)'
      ],
      expectedComponents: ['Engagement Tracker', 'Send Time Optimizer', 'Scheduler'],
      successCriteria: ['Notifications timed optimally', 'Engagement improves'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-11',
      title: 'Notification Analytics',
      phase: 4,
      phaseTitle: 'Intelligence Layer',
      learningObjective: 'Track notification performance and engagement',
      thinkingFramework: {
        framework: 'Funnel Metrics',
        approach: 'Track full funnel: sent → delivered → opened → clicked → converted. Identify drop-offs. A/B test content and timing.',
        keyInsight: 'Delivery rate varies by channel. Email: 95% delivered, 20% opened, 2% clicked. Push: 99% delivered, 5% opened. Know your baselines.'
      },
      requirements: {
        functional: [
          'Track delivery, open, click events',
          'Calculate engagement rates by type/channel',
          'A/B test notification content',
          'Dashboard for notification performance'
        ],
        nonFunctional: [
          'Metrics available within 1 hour'
        ]
      },
      hints: [
        'Event: {notification_id, event_type, timestamp}',
        'Funnel: sent_count → delivered_count → opened_count',
        'A/B: split traffic, compare rates, statistical significance'
      ],
      expectedComponents: ['Event Tracker', 'Analytics Pipeline', 'A/B Framework', 'Dashboard'],
      successCriteria: ['Metrics tracked end-to-end', 'A/B tests actionable'],
      estimatedTime: '8 minutes'
    },
    {
      id: 'step-12',
      title: 'Template Management & Personalization',
      phase: 4,
      phaseTitle: 'Intelligence Layer',
      learningObjective: 'Manage notification content and personalize',
      thinkingFramework: {
        framework: 'Content Personalization',
        approach: 'Templates with variables (Hi {{name}}). Personalize based on user data and behavior. Localize for language/region.',
        keyInsight: 'Dynamic content increases engagement. "Your order shipped" < "Your Nike Air Max shipped". Include specific details.'
      },
      requirements: {
        functional: [
          'Create and version notification templates',
          'Support variable substitution',
          'Localize templates by language',
          'Personalize content based on user context'
        ],
        nonFunctional: [
          'Template rendering < 10ms'
        ]
      },
      hints: [
        'Template: {id, channel, locale, subject, body, variables}',
        'Variables: {{user.name}}, {{order.items[0].name}}',
        'Fallback: default locale if user locale not available'
      ],
      expectedComponents: ['Template Store', 'Renderer', 'Localization Service', 'Personalization Engine'],
      successCriteria: ['Templates render correctly', 'Personalization increases engagement'],
      estimatedTime: '8 minutes'
    }
  ]
};
