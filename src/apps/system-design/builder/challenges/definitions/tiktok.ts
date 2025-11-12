import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';

/**
 * TikTok - Short Video Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const tiktokProblemDefinition: ProblemDefinition = {
  id: 'tiktok',
  title: 'TikTok - Short Video Platform',
  description: `Design a short-form video platform like TikTok that:
- Users can upload short videos (15-60 seconds)
- Users can scroll through an infinite feed of videos
- Users can like, comment, and share videos
- Videos auto-play as users scroll`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process API requests and video transcoding',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, video metadata',
      },
      {
        type: 'object_storage',
        reason: 'Need to store video files',
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
        reason: 'App server needs to upload/retrieve videos',
      },
    ],
    dataModel: {
      entities: ['user', 'video', 'like', 'comment'],
      fields: {
        user: ['id', 'username', 'profile_photo', 'created_at'],
        video: ['id', 'user_id', 'video_url', 'thumbnail_url', 'caption', 'views', 'created_at'],
        like: ['video_id', 'user_id', 'created_at'],
        comment: ['id', 'video_id', 'user_id', 'text', 'created_at'],
      },
      accessPatterns: [
        { type: 'write_large_file', frequency: 'high' }, // Uploading videos
        { type: 'read_by_query', frequency: 'very_high' }, // Viewing feed
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
        avgFileSize: 15, // 15MB video files
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
