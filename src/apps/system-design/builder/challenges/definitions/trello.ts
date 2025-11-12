import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Trello - Project Management Platform
 * Level 1 ONLY: Brute force connectivity test
 */
export const trelloProblemDefinition: ProblemDefinition = {
  id: 'trello',
  title: 'Trello - Project Management',
  description: `Design a project management platform like Trello that:
- Users can create boards with lists and cards
- Cards can be moved between lists (drag and drop)
- Users can collaborate on boards
- Cards support comments, attachments, and checklists`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process board updates and card movements',
      },
      {
        type: 'storage',
        reason: 'Need to store boards, lists, cards, users',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends board update requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store board data',
      },
    ],
    dataModel: {
      entities: ['user', 'board', 'list', 'card', 'comment'],
      fields: {
        user: ['id', 'email', 'name', 'avatar_url', 'created_at'],
        board: ['id', 'name', 'owner_id', 'visibility', 'created_at'],
        list: ['id', 'board_id', 'name', 'position', 'created_at'],
        card: ['id', 'list_id', 'title', 'description', 'position', 'due_date', 'created_at'],
        comment: ['id', 'card_id', 'user_id', 'text', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Moving cards, adding comments
        { type: 'read_by_key', frequency: 'very_high' }, // Loading boards
      ],
    },
  },

  scenarios: [
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database path exists. No optimization needed.',
      traffic: {
        rps: 0.1,
        readWriteRatio: 0.5,
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
