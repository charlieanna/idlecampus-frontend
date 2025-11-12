import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Economic-systems Problems (Auto-generated)
 * Generated from extracted-problems/system-design/economic-systems.md
 */

/**
 * Central Bank Digital Currency
 * From extracted-problems/system-design/economic-systems.md
 */
export const l6EconomicCbdcProblemDefinition: ProblemDefinition = {
  id: 'l6-economic-cbdc',
  title: 'Central Bank Digital Currency',
  description: `Design Federal Reserve digital dollar infrastructure handling all US transactions with privacy, programmability, and monetary policy integration.
- Process 150B transactions/year
- Support programmable money
- Enable instant settlement
- Provide offline transactions`,

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

  scenarios: generateScenarios('l6-economic-cbdc', problemConfigs['l6-economic-cbdc']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Interplanetary Economic System
 * From extracted-problems/system-design/economic-systems.md
 */
export const l6EconomicInterplanetaryProblemDefinition: ProblemDefinition = {
  id: 'l6-economic-interplanetary',
  title: 'Interplanetary Economic System',
  description: `Design economic system handling Earth-Mars trade with 24-minute delays, currency exchange, and resource allocation for million-person Mars colony.
- Handle 24-minute transaction delays
- Support resource futures trading
- Enable currency exchange
- Manage supply chain financing`,

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

  scenarios: generateScenarios('l6-economic-interplanetary', problemConfigs['l6-economic-interplanetary']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

