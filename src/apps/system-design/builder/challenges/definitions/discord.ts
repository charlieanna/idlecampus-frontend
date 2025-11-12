import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Discord - Gaming Chat Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const discordProblemDefinition: ProblemDefinition = {
  id: 'discord',
  title: 'Discord - Gaming Chat',
  description: `Design a group chat platform like Discord that:
- Users can create servers with multiple channels
- Users can send text messages in real-time
- Users can join voice/video calls
- Messages are organized by channels and threads`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process chat messages and user actions',
      },
      {
        type: 'storage',
        reason: 'Need to store messages, servers, channels, users',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time message delivery via WebSockets',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests to app server',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write chat data',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server pushes messages to WebSocket server',
      },
    ],
    dataModel: {
      entities: ['user', 'server', 'channel', 'message', 'member'],
      fields: {
        user: ['id', 'username', 'email', 'avatar_url', 'created_at'],
        server: ['id', 'name', 'icon_url', 'owner_id', 'created_at'],
        channel: ['id', 'server_id', 'name', 'type', 'created_at'],
        message: ['id', 'channel_id', 'user_id', 'content', 'created_at'],
        member: ['server_id', 'user_id', 'role', 'joined_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending messages
        { type: 'read_by_query', frequency: 'very_high' }, // Loading chat history
      ],
    },
  },

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database → WebSocket path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
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
