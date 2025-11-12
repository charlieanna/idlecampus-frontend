import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Reddit Comment System - Multi-layer Caching
 * From extracted-problems/system-design/caching.md
 */
export const redditCommentSystemProblemDefinition: ProblemDefinition = {
  id: 'reddit-comment-system',
  title: 'Reddit Comment System',
  description: `Design a Reddit-scale comment system that:
- Handles 5M reads/sec during normal operation and 50M reads/sec during viral events
- Implements multi-layer caching for hot content
- Provides hot-key protection for viral threads
- Handles cache stampede during failures
- Maintains sub-100ms P99 latency`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process comment read/write requests',
      },
      {
        type: 'storage',
        reason: 'Need to store comment data persistently',
      },
      {
        type: 'cache',
        reason: 'Need caching to handle high read load with 98% hit rate',
      },
      {
        type: 'cdn',
        reason: 'Need CDN for static comment rendering',
      },
      {
        type: 'load_balancer',
        reason: 'Need to distribute traffic across thousands of app servers',
      },
      {
        type: 'message_queue',
        reason: 'Need async vote updates to handle write load',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Client sends requests through load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB distributes traffic to app servers',
      },
      {
        from: 'cdn',
        to: 'compute',
        reason: 'CDN pulls rendered comments from app servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers cache hot comment threads',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers read/write comment data',
      },
      {
        from: 'compute',
        to: 'message_queue',
        reason: 'App servers publish vote updates to queue',
      },
    ],
    dataModel: {
      entities: ['comment', 'thread', 'vote', 'user'],
      fields: {
        comment: ['id', 'thread_id', 'parent_id', 'user_id', 'text', 'votes', 'created_at'],
        thread: ['id', 'title', 'comment_count', 'is_viral', 'created_at'],
        vote: ['comment_id', 'user_id', 'direction', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Reading comment threads
        { type: 'write', frequency: 'high' },             // Adding comments
        { type: 'write', frequency: 'very_high' },        // Vote counting
      ],
    },
  },

  scenarios: generateScenarios('reddit-comment-system', problemConfigs['reddit-comment-system']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
