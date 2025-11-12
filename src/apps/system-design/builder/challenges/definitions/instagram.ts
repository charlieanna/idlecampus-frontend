import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Instagram - Photo Sharing Platform
 * Comprehensive FR and NFR scenarios
 */
export const instagramProblemDefinition: ProblemDefinition = {
  id: 'instagram',
  title: 'Instagram - Photo Sharing Platform',
  description: `Design a photo sharing platform like Instagram that:
- Users can upload photos and videos
- Users can view a feed of photos from people they follow
- Users can like and comment on photos
- Users can search for other users and content`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can upload photos and videos',
    'Users can view a feed of photos from people they follow',
    'Users can like and comment on photos',
    'Users can search for other users and content'
  ],

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
      {
        type: 'cdn',
        reason: 'Need CDN for fast global image delivery',
      },
      {
        type: 'cache',
        reason: 'Need caching for feed performance',
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
      {
        from: 'compute',
        to: 'cache',
        reason: 'App server caches feeds and user data',
      },
      {
        from: 'cdn',
        to: 'object_storage',
        reason: 'CDN pulls images from object storage',
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

  scenarios: generateScenarios('instagram', problemConfigs.instagram),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
