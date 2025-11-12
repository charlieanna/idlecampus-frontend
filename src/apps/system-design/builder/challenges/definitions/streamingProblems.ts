import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Real-time Push Notifications - WebSocket delivery for live updates
 * From extracted-problems/system-design/streaming.md
 */
export const realtimeNotificationsProblemDefinition: ProblemDefinition = {
  id: 'realtime-notifications',
  title: 'Real-time Push Notifications',
  description: `Build a real-time notification system using WebSockets that:
- Maintains millions of persistent WebSocket connections
- Pushes notifications instantly to subscribed users
- Handles connection drops and reconnects gracefully
- Delivers 100k notifications/sec with <50ms P95 latency`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need sticky LB for WebSocket connections',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need WebSocket servers for persistent connections',
      },
      {
        type: 'message_queue',
        reason: 'Need pub/sub (Redis/Kafka) for cross-server fan-out',
      },
      {
        type: 'cache',
        reason: 'Need cache for connection registry (user→server mapping)',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Users connect through sticky LB',
      },
      {
        from: 'load_balancer',
        to: 'realtime_messaging',
        reason: 'LB routes to WebSocket servers with session affinity',
      },
      {
        from: 'realtime_messaging',
        to: 'message_queue',
        reason: 'WS servers publish/subscribe for fan-out',
      },
      {
        from: 'realtime_messaging',
        to: 'cache',
        reason: 'WS servers track connection mappings',
      },
    ],
    dataModel: {
      entities: ['notification', 'subscription', 'connection'],
      fields: {
        notification: ['id', 'user_id', 'type', 'message', 'created_at'],
        subscription: ['user_id', 'topic', 'created_at'],
        connection: ['user_id', 'server_id', 'socket_id', 'connected_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' }, // Publishing notifications
        { type: 'read_by_key', frequency: 'very_high' }, // Connection lookups
      ],
    },
  },

  scenarios: generateScenarios('realtime-notifications', problemConfigs['realtime-notifications']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Basic Event Log Streaming - Stream application events
 * From extracted-problems/system-design/streaming.md
 */
export const basicEventLogProblemDefinition: ProblemDefinition = {
  id: 'basic-event-log',
  title: 'Basic Event Log Streaming',
  description: `Create a centralized event logging system that:
- Collects application events from multiple services
- Streams 50k events/sec through Kafka
- Processes and enriches logs with workers
- Enables real-time search with Elasticsearch`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need log collector to aggregate from services',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka to buffer and stream events reliably',
      },
      {
        type: 'compute',
        reason: 'Need worker instances to parse and enrich logs',
      },
      {
        type: 'storage',
        reason: 'Need Elasticsearch for log search and analytics',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'App services send logs to collector',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Collector publishes to Kafka',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Workers consume from Kafka',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Workers write processed logs to Elasticsearch',
      },
    ],
    dataModel: {
      entities: ['log_event'],
      fields: {
        log_event: ['id', 'service', 'level', 'message', 'timestamp', 'metadata'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' }, // Log ingestion
        { type: 'read_by_query', frequency: 'high' }, // Log search
      ],
    },
  },

  scenarios: generateScenarios('basic-event-log', problemConfigs['basic-event-log']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Simple Pub/Sub Notification - Topic-based message routing
 * From extracted-problems/system-design/streaming.md
 */
export const simplePubsubProblemDefinition: ProblemDefinition = {
  id: 'simple-pubsub',
  title: 'Simple Pub/Sub Notification',
  description: `Implement a topic-based pub/sub system that:
- Publishes messages to topics with wildcard support
- Routes to millions of subscribed workers
- Filters by topic patterns
- Handles 10k messages/sec with subscriber backpressure`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need publisher API to accept messages',
      },
      {
        type: 'message_queue',
        reason: 'Need Redis pub/sub or RabbitMQ for topic routing',
      },
      {
        type: 'cache',
        reason: 'Need cache to store subscription metadata',
      },
      {
        type: 'compute',
        reason: 'Need subscriber workers to consume messages',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Publishers send messages to API',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'API publishes to topic-based queue',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'API caches subscription mappings',
      },
      {
        from: 'message_queue',
        to: 'compute',
        reason: 'Workers subscribe and consume from topics',
      },
    ],
    dataModel: {
      entities: ['message', 'topic', 'subscription'],
      fields: {
        message: ['id', 'topic', 'payload', 'timestamp'],
        topic: ['id', 'name', 'subscriber_count'],
        subscription: ['id', 'subscriber_id', 'topic_pattern', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' }, // Publishing
        { type: 'read_by_key', frequency: 'very_high' }, // Topic lookups
      ],
    },
  },

  scenarios: generateScenarios('simple-pubsub', problemConfigs['simple-pubsub']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Real-time Chat Messages - Instant messaging system
 * From extracted-problems/system-design/streaming.md
 */
export const realtimeChatMessagesProblemDefinition: ProblemDefinition = {
  id: 'realtime-chat-messages',
  title: 'Real-time Chat Messages',
  description: `Design a Slack-like real-time chat system that:
- Sends messages in real-time via WebSockets
- Supports channels and direct messages
- Shows online presence
- Handles 20k messages/sec with message ordering`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for WebSocket connections',
      },
      {
        type: 'compute',
        reason: 'Need chat servers to maintain WebSocket connections',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka for message ordering and persistence',
      },
      {
        type: 'cache',
        reason: 'Need Redis for online presence tracking',
      },
      {
        type: 'storage',
        reason: 'Need database for message history',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Chat users connect through WebSocket LB',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to chat servers',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'Chat servers publish messages to Kafka for ordering',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'Chat servers track presence in Redis',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'Chat servers persist message history',
      },
      {
        from: 'message_queue',
        to: 'storage',
        reason: 'Kafka consumers write to message DB',
      },
    ],
    dataModel: {
      entities: ['message', 'channel', 'user', 'presence'],
      fields: {
        message: ['id', 'channel_id', 'user_id', 'text', 'timestamp'],
        channel: ['id', 'name', 'member_count', 'type'],
        presence: ['user_id', 'status', 'last_seen'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' }, // Sending messages
        { type: 'read_by_key', frequency: 'high' }, // Loading history
      ],
    },
  },

  scenarios: generateScenarios('realtime-chat-messages', problemConfigs['realtime-chat-messages']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
