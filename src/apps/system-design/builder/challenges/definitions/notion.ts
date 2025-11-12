import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Notion - Collaborative Workspace
 * Comprehensive FR and NFR scenarios
 */
export const notionProblemDefinition: ProblemDefinition = {
  id: 'notion',
  title: 'Notion - Collaborative Workspace',
  description: `Design a collaborative workspace like Notion that:
- Users can create pages with rich content (text, images, databases)
- Multiple users can edit pages in real-time
- Pages can be organized hierarchically
- Users can share and collaborate on workspaces`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process page edits and real-time sync',
      },
      {
        type: 'storage',
        reason: 'Need to store pages, blocks, users, workspaces',
      },
      {
        type: 'realtime_messaging',
        reason: 'Need real-time collaborative editing',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends edit requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store page data',
      },
      {
        from: 'compute',
        to: 'realtime_messaging',
        reason: 'App server syncs edits in real-time',
      },
    ],
    dataModel: {
      entities: ['user', 'workspace', 'page', 'block', 'permission'],
      fields: {
        user: ['id', 'email', 'name', 'created_at'],
        workspace: ['id', 'name', 'owner_id', 'created_at'],
        page: ['id', 'workspace_id', 'parent_page_id', 'title', 'created_at'],
        block: ['id', 'page_id', 'type', 'content', 'position', 'created_at'],
        permission: ['id', 'page_id', 'user_id', 'role', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'very_high' },  // Editing pages
        { type: 'read_by_key', frequency: 'very_high' }, // Loading pages
      ],
    },
  },

  scenarios: generateScenarios('notion', problemConfigs.notion),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
