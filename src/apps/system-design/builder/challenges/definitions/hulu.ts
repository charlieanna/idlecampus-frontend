import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Hulu - Video Streaming Platform
 * Comprehensive FR and NFR scenarios
 */
export const huluProblemDefinition: ProblemDefinition = {
  id: 'hulu',
  title: 'Hulu - TV & Movie Streaming',
  description: `Design a streaming platform like Hulu that:
- Users can watch TV shows and movies
- Platform offers live TV channels
- Users can record shows to watch later (DVR)
- Content is available with or without ads`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can watch TV shows and movies',
    'Users can record shows to watch later (DVR)'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process streaming requests',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, watch history, DVR recordings',
      },
      {
        type: 'object_storage',
        reason: 'Need to store video content',
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
        reason: 'App server needs to read/write viewing data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to stream videos',
      },
    ],
    dataModel: {
      entities: ['user', 'show', 'episode', 'watch_history', 'dvr_recording'],
      fields: {
        user: ['id', 'email', 'subscription_tier', 'created_at'],
        show: ['id', 'title', 'description', 'genre', 'created_at'],
        episode: ['id', 'show_id', 'season', 'episode_number', 'video_url', 'duration', 'created_at'],
        watch_history: ['user_id', 'episode_id', 'progress', 'watched_at'],
        dvr_recording: ['id', 'user_id', 'episode_id', 'expires_at', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Streaming content
        { type: 'write', frequency: 'high' },        // Recording watch history
      ],
    },
  },

  scenarios: generateScenarios('hulu', problemConfigs.hulu),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
