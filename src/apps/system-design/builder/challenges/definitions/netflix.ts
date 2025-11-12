import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Netflix - Video Streaming Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const netflixProblemDefinition: ProblemDefinition = {
  id: 'netflix',
  title: 'Netflix - Video Streaming',
  description: `Design a video streaming platform like Netflix that:
- Users can browse movies and TV shows
- Users can stream videos on-demand
- Platform recommends content based on viewing history
- Videos are available in multiple qualities (SD, HD, 4K)`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process API requests and streaming',
      },
      {
        type: 'storage',
        reason: 'Need to store user data, viewing history, metadata',
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
        reason: 'App server needs to read/write viewing data',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to stream video files',
      },
    ],
    dataModel: {
      entities: ['user', 'video', 'watch_history', 'subscription'],
      fields: {
        user: ['id', 'email', 'name', 'subscription_tier', 'created_at'],
        video: ['id', 'title', 'description', 'duration', 'video_url', 'thumbnail_url', 'created_at'],
        watch_history: ['user_id', 'video_id', 'progress', 'watched_at'],
        subscription: ['user_id', 'tier', 'status', 'expires_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Streaming videos
        { type: 'write', frequency: 'high' },        // Recording watch history
        { type: 'read_by_query', frequency: 'very_high' }, // Browsing content
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
        avgFileSize: 500, // 500MB video files
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
