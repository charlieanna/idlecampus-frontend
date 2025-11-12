import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Ml-platform Problems (Auto-generated)
 * Generated from extracted-problems/system-design/ml-platform.md
 */

/**
 * Meta ML Training Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatformMetaProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-meta',
  title: 'Meta ML Training Platform',
  description: `Design Meta's ML platform supporting PyTorch training at scale, handling experiment tracking, feature engineering, and model deployment for all Meta products.
- Train 1000+ models concurrently
- Support distributed training on 10K GPUs
- Enable automatic hyperparameter tuning
- Provide experiment tracking and versioning`,

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

  scenarios: generateScenarios('l5-ml-platform-meta', problemConfigs['l5-ml-platform-meta']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

