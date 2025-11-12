import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Bio-digital Problems (Auto-generated)
 * Generated from extracted-problems/system-design/bio-digital.md
 */

/**
 * Neural Implant Data Platform
 * From extracted-problems/system-design/bio-digital.md
 */
export const l6BioNeuralImplantProblemDefinition: ProblemDefinition = {
  id: 'l6-bio-neural-implant',
  title: 'Neural Implant Data Platform',
  description: `Design infrastructure for Neuralink-style brain implants managing neural data from 1M patients, enabling real-time processing and medical interventions.
- Process 1M neural streams
- Detect medical events in real-time
- Support remote firmware updates
- Enable neural stimulation control`,

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

  scenarios: generateScenarios('l6-bio-neural-implant', problemConfigs['l6-bio-neural-implant']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Human Digital Twin Platform
 * From extracted-problems/system-design/bio-digital.md
 */
export const l6BioDigitalTwinProblemDefinition: ProblemDefinition = {
  id: 'l6-bio-digital-twin',
  title: 'Human Digital Twin Platform',
  description: `Design platform creating comprehensive digital twins of humans, simulating organ systems, predicting disease, and optimizing treatments in real-time.
- Model all organ systems
- Integrate genomic data
- Simulate drug interactions
- Predict disease progression`,

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

  scenarios: generateScenarios('l6-bio-digital-twin', problemConfigs['l6-bio-digital-twin']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

