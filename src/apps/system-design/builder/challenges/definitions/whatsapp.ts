import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * WhatsApp - Messaging Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const whatsappProblemDefinition: ProblemDefinition = {
  id: 'whatsapp',
  title: 'WhatsApp - Messaging App',
  description: `Design a messaging platform like WhatsApp that:
- Users can send text messages in real-time
- Users can send photos, videos, and voice messages
- Messages are end-to-end encrypted
- Users can create group chats`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process messages and media',
      },
      {
        type: 'storage',
        reason: 'Need to store messages, users, group data',
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
      entities: ['user', 'message', 'chat', 'group', 'media'],
      fields: {
        user: ['id', 'phone', 'name', 'profile_photo', 'last_seen', 'created_at'],
        message: ['id', 'chat_id', 'sender_id', 'content', 'media_url', 'created_at'],
        chat: ['id', 'type', 'created_at'],
        group: ['chat_id', 'name', 'admin_id', 'created_at'],
        media: ['id', 'message_id', 'url', 'type', 'size', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending messages
        { type: 'read_by_key', frequency: 'very_high' }, // Loading chats
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
        avgFileSize: 2, // 2MB media files
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
