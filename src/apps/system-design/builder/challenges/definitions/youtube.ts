import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * YouTube - Video Sharing Platform
 * Comprehensive FR and NFR scenarios
 */
export const youtubeProblemDefinition: ProblemDefinition = {
  id: 'youtube',
  title: 'YouTube - Video Sharing',
  description: `Design a video sharing platform like YouTube that:
- Users can upload and share videos
- Users can watch, like, comment on videos
- Users can subscribe to channels
- Videos are recommended based on viewing history`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can upload and share videos',
    'Users can watch, like, comment on videos',
    'Users can subscribe to channels'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process uploads, transcoding, streaming',
      },
      {
        type: 'storage',
        reason: 'Need to store video metadata, comments, users',
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
        reason: 'App server needs to read/write video metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to upload/stream videos',
      },
    ],
    dataModel: {
      entities: ['user', 'video', 'comment', 'subscription', 'like'],
      fields: {
        user: ['id', 'email', 'channel_name', 'created_at'],
        video: ['id', 'channel_id', 'title', 'description', 'video_url', 'thumbnail_url', 'views', 'created_at'],
        comment: ['id', 'video_id', 'user_id', 'text', 'created_at'],
        subscription: ['subscriber_id', 'channel_id', 'created_at'],
        like: ['video_id', 'user_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'write_large_file', frequency: 'high' }, // Uploading videos
        { type: 'read_by_key', frequency: 'very_high' }, // Watching videos
        { type: 'write', frequency: 'very_high' },    // Comments, likes
      ],
    },
  },

  scenarios: generateScenarios('youtube', problemConfigs.youtube),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
