import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Cross-regional Problems (Auto-generated)
 * Generated from extracted-problems/system-design/cross-regional.md
 */

/**
 * TikTok Cross-Border Data Platform
 * From extracted-problems/system-design/cross-regional.md
 */
export const l5RegionalTiktokPlatformProblemDefinition: ProblemDefinition = {
  id: 'l5-regional-tiktok-platform',
  title: 'TikTok Cross-Border Data Platform',
  description: `Design TikTok's platform handling different data sovereignty laws, content policies, and network restrictions across US, EU, and Asia while maintaining unified experience.
- Comply with regional data residency laws
- Support region-specific content filtering
- Enable cross-border content delivery
- Maintain unified recommendation system`,

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

  scenarios: generateScenarios('l5-regional-tiktok-platform', problemConfigs['l5-regional-tiktok-platform']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

