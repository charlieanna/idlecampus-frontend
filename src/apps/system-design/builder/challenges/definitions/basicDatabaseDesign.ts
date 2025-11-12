import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Basic RDBMS Design - Blog Database
 * From extracted-problems/system-design/storage.md
 */
export const basicDatabaseDesignProblemDefinition: ProblemDefinition = {
  id: 'basic-database-design',
  title: 'Basic RDBMS Design',
  description: `Design a relational database for a blog platform that:
- Stores users, posts, and comments with normalization
- Supports tags, categories, and user relationships
- Enables full-text search on posts
- Handles 10k reads/sec and 1k writes/sec
- Uses read replicas for scaling reads`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need app servers to handle API requests',
      },
      {
        type: 'storage',
        reason: 'Need primary database for writes',
      },
      {
        type: 'storage',
        reason: 'Need read replicas to scale reads',
      },
      {
        type: 'cache',
        reason: 'Need query cache to reduce DB load',
      },
      {
        type: 'load_balancer',
        reason: 'Need to distribute API traffic',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Users access blog through load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB routes to blog API servers',
      },
      {
        from: 'compute',
        to: 'cache',
        reason: 'App servers cache query results',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers read/write to database',
      },
    ],
    dataModel: {
      entities: ['user', 'post', 'comment', 'tag', 'follower'],
      fields: {
        user: ['id', 'username', 'email', 'created_at'],
        post: ['id', 'user_id', 'title', 'content', 'view_count', 'created_at'],
        comment: ['id', 'post_id', 'user_id', 'text', 'created_at'],
        tag: ['id', 'name'],
        follower: ['follower_id', 'following_id', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing posts
        { type: 'read_by_query', frequency: 'high' },    // Searching posts
        { type: 'write', frequency: 'medium' },          // Creating posts
      ],
    },
  },

  scenarios: generateScenarios('basic-database-design', problemConfigs['basic-database-design']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
