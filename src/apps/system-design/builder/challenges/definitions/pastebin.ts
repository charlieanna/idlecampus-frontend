import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Pastebin - Text Sharing Service
 * Level 1 ONLY: Brute force connectivity test
 */
export const pastebinProblemDefinition: ProblemDefinition = {
  id: 'pastebin',
  title: 'Pastebin - Text Sharing',
  description: `Design a text sharing service like Pastebin that:
- Users can paste text and get a shareable URL
- Pastes can be public or private
- Pastes can expire after a certain time
- Users can view paste syntax highlighting`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process paste creation and retrieval',
      },
      {
        type: 'storage',
        reason: 'Need to store paste content and metadata',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends paste requests',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to store pastes',
      },
    ],
    dataModel: {
      entities: ['paste', 'user'],
      fields: {
        paste: ['id', 'user_id', 'title', 'content', 'language', 'visibility', 'expires_at', 'created_at'],
        user: ['id', 'email', 'username', 'created_at'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'high' },        // Creating pastes
        { type: 'read_by_key', frequency: 'very_high' }, // Viewing pastes
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
