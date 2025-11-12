import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Developer-productivity Problems (Auto-generated)
 * Generated from extracted-problems/system-design/developer-productivity.md
 */

/**
 * Google Monorepo CI/CD System
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DevprodGoogleCiProblemDefinition: ProblemDefinition = {
  id: 'l5-devprod-google-ci',
  title: 'Google Monorepo CI/CD System',
  description: `Design CI/CD infrastructure for Google's monorepo handling 50K engineer commits daily, running millions of tests, and deploying to production thousands of times per day.
- Handle 100K commits daily
- Run 100M tests per day
- Support 5000 deployments daily
- Enable incremental builds`,

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

  scenarios: generateScenarios('l5-devprod-google-ci', problemConfigs['l5-devprod-google-ci']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

