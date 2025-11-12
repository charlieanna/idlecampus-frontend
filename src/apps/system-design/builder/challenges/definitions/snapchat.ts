import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Snapchat - Ephemeral Messaging Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const snapchatProblemDefinition: ProblemDefinition = {
  id: 'snapchat',
  title: 'Snapchat - Ephemeral Messaging',
  description: `Design an ephemeral messaging platform like Snapchat that:
- Users can send photos/videos that disappear after viewing
- Users can post stories that last 24 hours
- Users can send messages that auto-delete
- Content expires automatically`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process media uploads and messages',
      },
      {
        type: 'storage',
        reason: 'Need to store user data and message metadata',
      },
      {
        type: 'object_storage',
        reason: 'Need temporary storage for photos/videos',
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
        reason: 'App server needs to read/write message metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store/delete ephemeral media',
      },
    ],
    dataModel: {
      entities: ['user', 'snap', 'story', 'friendship'],
      fields: {
        user: ['id', 'username', 'phone', 'created_at'],
        snap: ['id', 'sender_id', 'receiver_id', 'media_url', 'viewed_at', 'expires_at', 'created_at'],
        story: ['id', 'user_id', 'media_url', 'expires_at', 'created_at'],
        friendship: ['user_id_1', 'user_id_2', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Sending snaps
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing snaps
        { type: 'write_large_file', frequency: 'very_high' }, // Uploading media
      ],
    },
  },

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database → S3 path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
        avgFileSize: 3, // 3MB photos
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
