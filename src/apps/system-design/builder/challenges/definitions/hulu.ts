import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Hulu - Video Streaming Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const huluProblemDefinition: ProblemDefinition = {
  id: 'hulu',
  title: 'Hulu - TV & Movie Streaming',
  description: `Design a streaming platform like Hulu that:
- Users can watch TV shows and movies
- Platform offers live TV channels
- Users can record shows to watch later (DVR)
- Content is available with or without ads`,

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

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database → S3 path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
        avgFileSize: 300, // 300MB video files
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
