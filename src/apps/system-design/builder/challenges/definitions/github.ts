import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * GitHub - Code Hosting Platform
 * Comprehensive FR and NFR scenarios
 */
export const githubProblemDefinition: ProblemDefinition = {
  id: 'github',
  title: 'GitHub - Code Hosting',
  description: `Design a code hosting platform like GitHub that:
- Users can host Git repositories
- Users can create pull requests and issues
- Platform supports code review and collaboration
- Users can fork and star repositories`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can host Git repositories',
    'Users can create pull requests and issues',
    'Users can fork and star repositories'
  ],

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process git operations and web requests',
      },
      {
        type: 'storage',
        reason: 'Need to store repository metadata, issues, PRs',
      },
      {
        type: 'object_storage',
        reason: 'Need to store git repository data',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends git and API requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store metadata',
      },
      {
        from: 'compute',
        to: 'object_storage',
        reason: 'App server needs to store git objects',
      },
    ],
    dataModel: {
      entities: ['user', 'repository', 'commit', 'pull_request', 'issue'],
      fields: {
        user: ['id', 'username', 'email', 'avatar_url', 'created_at'],
        repository: ['id', 'owner_id', 'name', 'description', 'is_private', 'stars', 'created_at'],
        commit: ['id', 'repo_id', 'author_id', 'message', 'sha', 'created_at'],
        pull_request: ['id', 'repo_id', 'author_id', 'title', 'status', 'created_at'],
        issue: ['id', 'repo_id', 'author_id', 'title', 'status', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Git pushes
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing repos
        { type: 'read_by_query', frequency: 'high' }, // Searching code
      ],
    },
  },

  scenarios: generateScenarios('github', problemConfigs.github),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
