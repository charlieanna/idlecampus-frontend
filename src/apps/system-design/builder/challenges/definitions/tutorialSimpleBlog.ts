import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';
import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';

/**
 * Tutorial 1: Personal Blog Platform
 * From extracted-problems/system-design/tutorial.md
 */
export const tutorialSimpleBlogProblemDefinition: ProblemDefinition = {
  id: 'tutorial-simple-blog',
  title: 'Tutorial 1: Personal Blog Platform',
  description: `Learn the basics of system design by building a simple blog platform that:
- Scales from 100 to 1,000 requests/sec
- Uses load balancers for high availability
- Implements read replicas for scaling reads
- Handles both reads (90%) and writes (10%)`,

  userFacingFRs: [
    '**GET /api/posts** - List all blog posts (paginated, 20 posts per page)',
    '**GET /api/posts/:id** - Read a specific blog post by ID',
    '**POST /api/posts** - Create a new blog post (requires authentication)',
    '**PUT /api/posts/:id** - Update an existing blog post (requires authentication)',
    '**DELETE /api/posts/:id** - Delete a blog post (requires authentication)',
    '**GET /api/posts/:id/comments** - Get all comments for a specific post',
    '**POST /api/posts/:id/comments** - Add a comment to a post',
    'System must handle 90% reads and 10% writes',
  ],

  userFacingNFRs: [
    '**Read Latency**: < 200ms p95 for fetching posts and comments',
    '**Write Latency**: < 500ms p95 for creating/updating posts',
    '**Throughput**: Support 100-1,000 requests/sec (growing from launch to 6 months)',
    '**Availability**: 99.9% uptime with load balancer failover',
    '**Scalability**: Read replicas handle 90% of traffic (read-heavy workload)',
    '**Response Time**: < 100ms p95 for cached responses',
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need app servers to handle blog requests (read/write)',
      },
      {
        type: 'storage',
        reason: 'Need database to store blog posts and comments',
      },
      {
        type: 'load_balancer',
        reason: 'Need LB for distributing traffic and high availability',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'load_balancer',
        reason: 'Readers connect through load balancer',
      },
      {
        from: 'load_balancer',
        to: 'compute',
        reason: 'LB distributes to app servers',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App servers read/write blog data',
      },
    ],
    dataModel: {
      entities: ['post', 'comment', 'author'],
      fields: {
        post: ['id', 'author_id', 'title', 'content', 'created_at'],
        comment: ['id', 'post_id', 'user_id', 'text', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' }, // Reading posts
        { type: 'write', frequency: 'low' },             // Publishing posts
      ],
    },
  },

  scenarios: generateScenarios('tutorial-simple-blog', problemConfigs['tutorial-simple-blog']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

// Auto-generate code challenges from functional requirements
(tutorialSimpleBlogProblemDefinition as any).codeChallenges = generateCodeChallengesFromFRs(tutorialSimpleBlogProblemDefinition);
