import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Pinterest - Visual Bookmarking Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const pinterestProblemDefinition: ProblemDefinition = {
  id: 'pinterest',
  title: 'Pinterest - Visual Bookmarking',
  description: `Design a visual discovery platform like Pinterest that:
- Users can create boards and pin images
- Users can browse and search for pins
- Users can follow boards and users
- Images are organized into categories`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process requests (pin, search)',
      },
      {
        type: 'storage',
        reason: 'Need to store pins, boards, users',
      },
      {
        type: 'object_storage',
        reason: 'Need to store images',
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
        reason: 'App server needs to read/write pin data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/retrieve images',
      },
    ],
    dataModel: {
      entities: ['user', 'board', 'pin', 'follow'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        board: ['id', 'user_id', 'name', 'description', 'created_at'],
        pin: ['id', 'board_id', 'user_id', 'image_url', 'title', 'description', 'source_url', 'created_at'],
        follow: ['follower_id', 'following_id', 'target_type', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'medium' },        // Pinning images
        { type: 'read_by_query', frequency: 'very_high' }, // Browsing pins
        { type: 'write_large_file', frequency: 'medium' }, // Uploading images
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
        avgFileSize: 1, // 1MB images
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
