import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Compliance-security Problems (Auto-generated)
 * Generated from extracted-problems/system-design/compliance-security.md
 */

/**
 * Apple End-to-End Encryption Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5SecurityAppleEncryptionProblemDefinition: ProblemDefinition = {
  id: 'l5-security-apple-encryption',
  title: 'Apple End-to-End Encryption Platform',
  description: `Design Apple's E2E encryption system for iCloud data, supporting device sync, key recovery, and compliance with global regulations while maintaining usability.
- Encrypt all user data end-to-end
- Support multi-device synchronization
- Enable account recovery without Apple access
- Provide legal compliance mechanisms`,

  functionalRequirements: {
    mustHave: [

    ],
    mustConnect: [

    ],
    dataModel: {
      entities: ['data'],
      fields: {
        data: ['id', 'value', 'created_at'],
      },
      accessPatterns: [
        { type: 'read_by_key', frequency: 'very_high' },
        { type: 'write', frequency: 'medium' },
      ],
    },
  },

  scenarios: generateScenarios('l5-security-apple-encryption', problemConfigs['l5-security-apple-encryption']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

