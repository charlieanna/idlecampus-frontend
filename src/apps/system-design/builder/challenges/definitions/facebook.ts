import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Facebook - Social Networking Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const facebookProblemDefinition: ProblemDefinition = {
  id: 'facebook',
  title: 'Facebook - Social Network',
  description: `Design a social networking platform like Facebook that:
- Users can create profiles and friend other users
- Users can post status updates, photos, and videos
- Users can see a news feed of friends' posts
- Users can like and comment on posts`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process requests (posts, feed generation)',
      },
      {
        type: 'storage',
        reason: 'Need to store users, posts, friendships',
      },
      {
        type: 'object_storage',
        reason: 'Need to store photos and videos',
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
        reason: 'App server needs to read/write social data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/retrieve media',
      },
    ],
    dataModel: {
      entities: ['user', 'post', 'friendship', 'like', 'comment'],
      fields: {
        user: ['id', 'name', 'email', 'profile_photo_url', 'created_at'],
        post: ['id', 'user_id', 'content', 'media_url', 'created_at'],
        friendship: ['user_id_1', 'user_id_2', 'status', 'created_at'],
        like: ['post_id', 'user_id', 'created_at'],
        comment: ['id', 'post_id', 'user_id', 'text', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Creating posts
        { type: 'read_by_query', frequency: 'very_high' }, // Viewing news feed
        { type: 'write_large_file', frequency: 'medium' }, // Uploading media
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
        avgFileSize: 5, // 5MB videos
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
