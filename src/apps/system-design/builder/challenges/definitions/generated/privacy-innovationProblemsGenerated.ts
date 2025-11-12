import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Privacy-innovation Problems (Auto-generated)
 * Generated from extracted-problems/system-design/privacy-innovation.md
 */

/**
 * Homomorphic Cloud Computing
 * From extracted-problems/system-design/privacy-innovation.md
 */
export const l6PrivacyHomomorphicScaleProblemDefinition: ProblemDefinition = {
  id: 'l6-privacy-homomorphic-scale',
  title: 'Homomorphic Cloud Computing',
  description: `Design fully homomorphic encryption system enabling cloud providers to compute on encrypted data with practical performance for real applications.
- Support arbitrary computations
- Maintain full encryption
- Enable SQL on encrypted databases
- Support machine learning training`,

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

  scenarios: generateScenarios('l6-privacy-homomorphic-scale', problemConfigs['l6-privacy-homomorphic-scale']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Zero-Knowledge Internet
 * From extracted-problems/system-design/privacy-innovation.md
 */
export const l6PrivacyZkpInternetProblemDefinition: ProblemDefinition = {
  id: 'l6-privacy-zkp-internet',
  title: 'Zero-Knowledge Internet',
  description: `Create internet infrastructure where every interaction proves statements without revealing information, enabling perfect privacy with accountability.
- Generate ZK proofs for all requests
- Verify proofs in milliseconds
- Support recursive proof composition
- Enable selective disclosure`,

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

  scenarios: generateScenarios('l6-privacy-zkp-internet', problemConfigs['l6-privacy-zkp-internet']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

