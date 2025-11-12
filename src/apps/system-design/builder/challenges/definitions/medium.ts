import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Medium - Blogging Platform
 * Comprehensive FR and NFR scenarios
 */
export const mediumProblemDefinition: ProblemDefinition = {
  id: 'medium',
  title: 'Medium - Blogging Platform',
  description: `Design a blogging platform like Medium that:
- Users can write and publish articles
- Users can follow authors and topics
- Users can clap (like) and comment on articles
- Articles are ranked by popularity and engagement`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can write and publish articles',
    'Users can follow authors and topics',
    'Users can clap (like) and comment on articles'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process article creation and reading',
      },
      {
        type: 'storage',
        reason: 'Need to store articles, users, claps, comments',
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
        reason: 'App server needs to read/write article data',
      },
    ],
    dataModel: {
      entities: ['user', 'article', 'clap', 'comment', 'follow'],
      fields: {
        user: ['id', 'username', 'email', 'bio', 'avatar_url', 'created_at'],
        article: ['id', 'author_id', 'title', 'content', 'tags', 'published_at', 'read_time'],
        clap: ['article_id', 'user_id', 'count', 'created_at'],
        comment: ['id', 'article_id', 'user_id', 'text', 'created_at'],
        follow: ['follower_id', 'following_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'low' },        // Publishing articles
        { type: 'read_by_key', frequency: 'very_high' }, // Reading articles
        { type: 'read_by_query', frequency: 'high' }, // Browsing feed
      ],
    },
  },

  scenarios: generateScenarios('medium', problemConfigs.medium),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
