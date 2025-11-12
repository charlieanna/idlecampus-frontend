import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Slack - Team Collaboration Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const slackProblemDefinition: ProblemDefinition = {
  id: 'slack',
  title: 'Slack - Team Collaboration',
  description: `Design a team collaboration platform like Slack that:
- Users can send messages in channels and direct messages
- Workspaces organize teams with multiple channels
- Users can share files and integrate apps
- Messages support threads and reactions`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process messages and file uploads',
      },
      {
        type: 'storage',
        reason: 'Need to store messages, channels, workspaces',
      },
      {
        type: 'object_storage',
        reason: 'Need to store file attachments',
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
        reason: 'Client sends requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store messages',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store files',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server pushes messages in real-time',
      },
    ],
    dataModel: {
      entities: ['workspace', 'channel', 'user', 'message', 'thread', 'reaction'],
      fields: {
        workspace: ['id', 'name', 'domain', 'created_at'],
        channel: ['id', 'workspace_id', 'name', 'is_private', 'created_at'],
        user: ['id', 'workspace_id', 'email', 'name', 'avatar_url', 'created_at'],
        message: ['id', 'channel_id', 'user_id', 'content', 'created_at'],
        thread: ['parent_message_id', 'reply_message_id', 'created_at'],
        reaction: ['message_id', 'user_id', 'emoji', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending messages
        { type: 'read_by_query', frequency: 'very_high' }, // Loading channel history
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
        avgFileSize: 5, // 5MB file attachments
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
