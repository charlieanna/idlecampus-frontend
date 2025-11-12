import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Telegram - Cloud Messaging Platform
 * Comprehensive FR and NFR scenarios
 */
export const telegramProblemDefinition: ProblemDefinition = {
  id: 'telegram',
  title: 'Telegram - Cloud Messaging',
  description: `Design a cloud messaging platform like Telegram that:
- Users can send messages, photos, and videos
- Messages are stored in the cloud (accessible from any device)
- Users can create channels for broadcasting
- Platform supports bots and automation`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can send messages, photos, and videos',
    'Users can create channels for broadcasting'
  ],

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

  scenarios: generateScenarios('telegram', problemConfigs.telegram),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
