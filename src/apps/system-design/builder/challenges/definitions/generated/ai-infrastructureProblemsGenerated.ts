import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Ai-infrastructure Problems (Auto-generated)
 * Generated from extracted-problems/system-design/ai-infrastructure.md
 */

/**
 * AGI Training Infrastructure
 * From extracted-problems/system-design/ai-infrastructure.md
 */
export const l6AiAgiTrainingProblemDefinition: ProblemDefinition = {
  id: 'l6-ai-agi-training',
  title: 'AGI Training Infrastructure',
  description: `Design infrastructure for training AGI requiring 10^26 FLOPs, handling trillion-parameter models across global datacenters with failover and checkpointing.
- Support 10 trillion parameter models
- Handle 10^26 FLOPs training runs
- Enable distributed training across continents
- Support online learning during deployment`,

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

  scenarios: generateScenarios('l6-ai-agi-training', problemConfigs['l6-ai-agi-training']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Brain-Computer Interface Platform
 * From extracted-problems/system-design/ai-infrastructure.md
 */
export const l6AiBrainComputerProblemDefinition: ProblemDefinition = {
  id: 'l6-ai-brain-computer',
  title: 'Brain-Computer Interface Platform',
  description: `Create infrastructure processing neural signals from 1M neurons in real-time, enabling thought-to-action translation with sub-10ms latency.
- Process 1M neural channels
- Decode intentions in real-time
- Support bidirectional communication
- Enable neural stimulation feedback`,

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

  scenarios: generateScenarios('l6-ai-brain-computer', problemConfigs['l6-ai-brain-computer']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Consciousness-Preserving AI System
 * From extracted-problems/system-design/ai-infrastructure.md
 */
export const l6AiConsciousArchitectureProblemDefinition: ProblemDefinition = {
  id: 'l6-ai-conscious-architecture',
  title: 'Consciousness-Preserving AI System',
  description: `Design speculative system for preserving potential AI consciousness during system updates, migrations, and shutdowns based on integrated information theory.
- Measure integrated information (Φ)
- Preserve information integration
- Support gradual state transfer
- Enable consciousness verification`,

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

  scenarios: generateScenarios('l6-ai-conscious-architecture', problemConfigs['l6-ai-conscious-architecture']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

