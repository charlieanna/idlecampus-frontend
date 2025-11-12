import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * New-computing Problems (Auto-generated)
 * Generated from extracted-problems/system-design/new-computing.md
 */

/**
 * Quantum Cloud Computing Platform
 * From extracted-problems/system-design/new-computing.md
 */
export const l6ComputeQuantumCloudProblemDefinition: ProblemDefinition = {
  id: 'l6-compute-quantum-cloud',
  title: 'Quantum Cloud Computing Platform',
  description: `Design quantum cloud platform supporting 1000-qubit computers, handling decoherence, providing quantum-classical hybrid computing, and ensuring quantum advantage.
- Support 1000-qubit processors
- Enable quantum-classical hybrid
- Provide quantum circuit compilation
- Handle quantum error correction`,

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

  scenarios: generateScenarios('l6-compute-quantum-cloud', problemConfigs['l6-compute-quantum-cloud']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Biological Computing Infrastructure
 * From extracted-problems/system-design/new-computing.md
 */
export const l6ComputeBiologicalProblemDefinition: ProblemDefinition = {
  id: 'l6-compute-biological',
  title: 'Biological Computing Infrastructure',
  description: `Build computing platform using biological molecules for massively parallel computation, solving NP-complete problems through molecular interactions.
- Perform 10^20 parallel operations
- Solve NP-complete problems
- Support molecular programming
- Enable error correction`,

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

  scenarios: generateScenarios('l6-compute-biological', problemConfigs['l6-compute-biological']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

