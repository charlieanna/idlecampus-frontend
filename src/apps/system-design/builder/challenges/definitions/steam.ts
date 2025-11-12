import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Steam - Gaming Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const steamProblemDefinition: ProblemDefinition = {
  id: 'steam',
  title: 'Steam - Gaming Platform',
  description: `Design a gaming platform like Steam that:
- Users can browse and purchase games
- Users can download and launch games
- Platform supports user reviews and community features
- Users can add friends and view achievements`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process game purchases and downloads',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, games, purchases',
      },
      {
        type: 'object_storage',
        reason: 'Need to store game files',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends purchase and download requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store purchase data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to serve game downloads',
      },
    ],
    dataModel: {
      entities: ['user', 'game', 'purchase', 'review', 'achievement'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        game: ['id', 'title', 'developer', 'price', 'description', 'file_size', 'created_at'],
        purchase: ['user_id', 'game_id', 'price_paid', 'purchased_at'],
        review: ['id', 'game_id', 'user_id', 'rating', 'text', 'created_at'],
        achievement: ['id', 'game_id', 'name', 'description', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_query', frequency: 'very_high' }, // Browsing games
        { type: 'write', frequency: 'high' },        // Purchasing games
        { type: 'write_large_file', frequency: 'high' }, // Downloading games
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
        avgFileSize: 5000, // 5GB game files
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
