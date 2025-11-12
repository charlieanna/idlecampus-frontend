import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Telegram - Cloud Messaging Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const telegramProblemDefinition: ProblemDefinition = {
  id: 'telegram',
  title: 'Telegram - Cloud Messaging',
  description: `Design a cloud messaging platform like Telegram that:
- Users can send messages, photos, and videos
- Messages are stored in the cloud (accessible from any device)
- Users can create channels for broadcasting
- Platform supports bots and automation`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process messages and bot requests',
      },
      {
        type: 'storage',
        reason: 'Need to store messages, users, channels',
      },
      {
        type: 'object_storage',
        reason: 'Need to store media files',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time message delivery',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends messages',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store messages in cloud',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store media',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server pushes messages in real-time',
      },
    ],
    dataModel: {
      entities: ['user', 'chat', 'message', 'channel', 'bot'],
      fields: {
        user: ['id', 'phone', 'username', 'name', 'created_at'],
        chat: ['id', 'type', 'title', 'created_at'],
        message: ['id', 'chat_id', 'sender_id', 'content', 'media_url', 'created_at'],
        channel: ['chat_id', 'name', 'description', 'subscribers', 'created_at'],
        bot: ['id', 'username', 'token', 'webhook_url', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending messages
        { type: 'read_by_key', frequency: 'very_high' }, // Loading chats
        { type: 'read_by_query', frequency: 'high' }, // Searching messages
      ],
    },
  },

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database → S3 → WebSocket path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
        avgFileSize: 10, // 10MB media files
      },
      passCriteria: {
        maxLatency: 30000,
        maxErrorRate: 0.99,
      },
    },
  ],

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
