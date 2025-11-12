import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Distributed-consensus Problems (Auto-generated)
 * Generated from extracted-problems/system-design/distributed-consensus.md
 */

/**
 * Planetary-Scale Consensus Protocol
 * From extracted-problems/system-design/distributed-consensus.md
 */
export const l6ConsensusPlanetaryProblemDefinition: ProblemDefinition = {
  id: 'l6-consensus-planetary',
  title: 'Planetary-Scale Consensus Protocol',
  description: `Create consensus protocol for distributed systems spanning Earth, Mars, and Moon colonies, handling 24-minute delays and relativistic effects.
- Achieve consensus despite 24-min delays
- Handle relativistic time dilation
- Support partition-tolerant operation
- Enable local decision authority`,

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

  scenarios: generateScenarios('l6-consensus-planetary', problemConfigs['l6-consensus-planetary']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Million-Node Consensus System
 * From extracted-problems/system-design/distributed-consensus.md
 */
export const l6ConsensusMillionNodesProblemDefinition: ProblemDefinition = {
  id: 'l6-consensus-million-nodes',
  title: 'Million-Node Consensus System',
  description: `Create consensus protocol scaling to 1 million nodes with Byzantine fault tolerance, sub-second finality, and dynamic membership.
- Support 1 million validators
- Achieve sub-second finality
- Handle 33% Byzantine nodes
- Support dynamic membership`,

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

  scenarios: generateScenarios('l6-consensus-million-nodes', problemConfigs['l6-consensus-million-nodes']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

