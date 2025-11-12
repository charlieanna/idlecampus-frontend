import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Data-platform Problems (Auto-generated)
 * Generated from extracted-problems/system-design/data-platform.md
 */

/**
 * Uber Real-Time Data Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatformUberProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-uber',
  title: 'Uber Real-Time Data Platform',
  description: `Design Uber's data platform ingesting trip, payment, and driver data in real-time, supporting both streaming analytics and ML feature computation.
- Ingest 1 trillion events daily
- Support sub-minute data freshness
- Enable SQL queries on streaming data
- Compute ML features in real-time`,

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

  scenarios: generateScenarios('l5-data-platform-uber', problemConfigs['l5-data-platform-uber']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

