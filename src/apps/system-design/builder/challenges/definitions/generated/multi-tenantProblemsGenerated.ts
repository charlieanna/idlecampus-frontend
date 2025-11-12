import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Multi-tenant Problems (Auto-generated)
 * Generated from extracted-problems/system-design/multi-tenant.md
 */

/**
 * Salesforce Multi-Tenant CRM Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultitenantSalesforceProblemDefinition: ProblemDefinition = {
  id: 'l5-multitenant-salesforce',
  title: 'Salesforce Multi-Tenant CRM Platform',
  description: `Design Salesforce-like multi-tenant platform supporting 100K enterprises, each with custom schemas, workflows, and integrations while maintaining performance and isolation.
- Support 100K tenant organizations
- Enable custom fields and objects per tenant
- Provide tenant-specific API limits
- Support custom workflows and triggers`,

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

  scenarios: generateScenarios('l5-multitenant-salesforce', problemConfigs['l5-multitenant-salesforce']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

