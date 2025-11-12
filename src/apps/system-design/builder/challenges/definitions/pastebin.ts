import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Pastebin - Text Sharing Service
 * Comprehensive FR and NFR scenarios
 */
export const pastebinProblemDefinition: ProblemDefinition = {
  id: 'pastebin',
  title: 'Pastebin - Text Sharing',
  description: `Design a text sharing service like Pastebin that:
- Users can paste text and get a shareable URL
- Pastes can be public or private
- Pastes can expire after a certain time
- Users can view paste syntax highlighting`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Users can paste text and get a shareable URL',
    'Users can view paste syntax highlighting'
  ],

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

  scenarios: generateScenarios('pastebin', problemConfigs.pastebin),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};
