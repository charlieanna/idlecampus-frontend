import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Tutorial 3: Real-Time Chat System
 * From extracted-problems/system-design/tutorial.md
 */
export const tutorialRealtimeChatProblemDefinition: ProblemDefinition = {
  id: 'tutorial-advanced-chat',
  title: 'Tutorial 3: Real-Time Chat System',
  description: `Master complex architectures with real-time features by building a production-ready chat system that:
- Supports 100K concurrent users with real-time messaging
- Handles 50,000 messages/sec during peak
- Uses WebSockets for persistent connections
- Implements message queues for reliability and ordering
- Achieves <500ms P99 message delivery latency`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need API servers to handle REST requests',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need WebSocket servers for persistent connections',
      },
      {
        type: 'message_queue',
        reason: 'Need Kafka for reliable message delivery and ordering',
      },
      {
        type: 'cache',
        reason: 'Need Redis for room membership and recent messages',
      },
      {
        type: 'storage',
        reason: 'Need database for message history',
      },
      {
        type: 'object_storage',
        reason: 'Need S3 for file attachments',
      },
      {
        type: 'cdn',
        reason: 'Need CDN for static assets (avatars, JS, CSS)',
      },
      {
        type: 'load_balancer',
        reason: 'Need LBs for API and WebSocket traffic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'cdn',
        reason: 'Users load static assets from CDN',
      },
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'API requests go through LB',
      },
      {
        from: 'client',
        to: 'realtime_messaging',
        reason: 'WebSocket connections for real-time messages',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB distributes API traffic',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'API servers publish messages to queue',
      },
      {
        from: 'realtime_messaging',
        to: 'message_queue',
        reason: 'WS servers consume messages from queue',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers cache room data',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers persist message history',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App servers store file attachments',
      },
    ],
    dataModel: {
      entities: ['message', 'room', 'user', 'attachment'],
      fields: {
        message: ['id', 'room_id', 'user_id', 'text', 'created_at'],
        room: ['id', 'name', 'member_count', 'created_at'],
        attachment: ['id', 'message_id', 's3_url', 'size_bytes'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },       // Sending messages
        { type: 'read_by_key', frequency: 'high' },      // Loading history
        { type: 'write_large_file', frequency: 'medium' }, // File uploads
      ],
    },
  },

  scenarios: generateScenarios('tutorial-advanced-chat', problemConfigs['tutorial-advanced-chat']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
