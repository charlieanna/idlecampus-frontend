import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Facebook Messenger - Messaging Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const messengerProblemDefinition: ProblemDefinition = {
  id: 'messenger',
  title: 'Facebook Messenger - Chat App',
  description: `Design a messaging platform like Facebook Messenger that:
- Users can send text messages and media
- Users can make voice and video calls
- Group chats support multiple participants
- Messages sync across all devices`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process messages and calls',
      },
      {
        type: 'storage',
        reason: 'Need to store messages, users, conversations',
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
        reason: 'App server needs to store messages',
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
      entities: ['user', 'conversation', 'message', 'participant', 'media'],
      fields: {
        user: ['id', 'name', 'email', 'profile_photo', 'last_active', 'created_at'],
        conversation: ['id', 'type', 'created_at'],
        message: ['id', 'conversation_id', 'sender_id', 'content', 'created_at'],
        participant: ['conversation_id', 'user_id', 'joined_at'],
        media: ['id', 'message_id', 'url', 'type', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending messages
        { type: 'read_by_query', frequency: 'very_high' }, // Loading conversations
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
        avgFileSize: 3, // 3MB media files
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
