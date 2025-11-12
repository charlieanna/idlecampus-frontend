import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Discord - Gaming Chat Platform
 * Comprehensive FR and NFR scenarios
 */
export const discordProblemDefinition: ProblemDefinition = {
  id: 'discord',
  title: 'Discord - Gaming Chat',
  description: `Design a group chat platform like Discord that:
- Users can create servers with multiple channels
- Users can send text messages in real-time
- Users can join voice/video calls
- Messages are organized by channels and threads`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can create servers with multiple channels',
    'Users can send text messages in real-time',
    'Users can join voice/video calls'
  ],

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

  scenarios: generateScenarios('discord', problemConfigs.discord),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
