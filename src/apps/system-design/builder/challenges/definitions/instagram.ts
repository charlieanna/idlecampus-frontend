import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * Instagram - Photo Sharing Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const instagramProblemDefinition: ProblemDefinition = {
  id: 'instagram',
  title: 'Instagram - Photo Sharing Platform',
  description: `Design a photo sharing platform like Instagram that:
- Users can upload photos and videos
- Users can view a feed of photos from people they follow
- Users can like and comment on photos
- Users can search for other users and content`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process API requests (upload, view, like)',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, posts, likes, comments',
      },
      {
        type: 'object_storage',
        reason: 'Need to store photos and videos (large files)',
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
        reason: 'App server needs to read/write metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/retrieve media files',
      },
    ],
    dataModel: {
      entities: ['user', 'post', 'like', 'comment', 'follower'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        post: ['id', 'user_id', 'image_url', 'caption', 'created_at'],
        like: ['post_id', 'user_id', 'created_at'],
        comment: ['id', 'post_id', 'user_id', 'text', 'created_at'],
        follower: ['follower_id', 'following_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'medium' },        // Uploading posts
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing feed
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
        avgFileSize: 2, // 2MB photos
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
