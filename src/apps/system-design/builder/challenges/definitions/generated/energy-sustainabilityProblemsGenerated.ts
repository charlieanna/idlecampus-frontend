import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Energy-sustainability Problems (Auto-generated)
 * Generated from extracted-problems/system-design/energy-sustainability.md
 */

/**
 * Carbon-Negative Data Center
 * From extracted-problems/system-design/energy-sustainability.md
 */
export const l6EnergyCarbonNegativeProblemDefinition: ProblemDefinition = {
  id: 'l6-energy-carbon-negative',
  title: 'Carbon-Negative Data Center',
  description: `Design data center that captures more CO2 than it produces through integrated direct air capture, using waste heat for carbon sequestration.
- Capture 1000 tons CO2 per year
- Use 100% renewable energy
- Utilize waste heat for DAC
- Support 100MW compute load`,

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

  scenarios: generateScenarios('l6-energy-carbon-negative', problemConfigs['l6-energy-carbon-negative']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Ocean Thermal Computing Platform
 * From extracted-problems/system-design/energy-sustainability.md
 */
export const l6EnergyOceanPoweredProblemDefinition: ProblemDefinition = {
  id: 'l6-energy-ocean-powered',
  title: 'Ocean Thermal Computing Platform',
  description: `Design submarine data center using ocean thermal gradients for power and cooling, supporting edge computing for maritime applications.
- Generate 10MW from OTEC
- Cool using deep ocean water
- Withstand 1000m depth pressure
- Support autonomous operation`,

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

  scenarios: generateScenarios('l6-energy-ocean-powered', problemConfigs['l6-energy-ocean-powered']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

