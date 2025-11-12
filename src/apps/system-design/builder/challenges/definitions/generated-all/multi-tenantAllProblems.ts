import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * Multi-tenant Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 18 problems
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

/**
 * Salesforce Tenant Isolation Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant1ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-1',
  title: 'Salesforce Tenant Isolation Platform',
  description: `Salesforce needs to implement tenant isolation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support tenant isolation at Salesforce scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-1', problemConfigs['l5-multi-tenant-1']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Workday Resource Allocation Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant2ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-2',
  title: 'Workday Resource Allocation Platform',
  description: `Workday needs to implement resource allocation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support resource allocation at Workday scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-2', problemConfigs['l5-multi-tenant-2']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * ServiceNow Data Partitioning Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant3ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-3',
  title: 'ServiceNow Data Partitioning Platform',
  description: `ServiceNow needs to implement data partitioning to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data partitioning at ServiceNow scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-3', problemConfigs['l5-multi-tenant-3']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Zendesk Custom Domains Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant4ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-4',
  title: 'Zendesk Custom Domains Platform',
  description: `Zendesk needs to implement custom domains to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support custom domains at Zendesk scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-4', problemConfigs['l5-multi-tenant-4']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * HubSpot Compliance Per Tenant Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant5ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-5',
  title: 'HubSpot Compliance Per Tenant Platform',
  description: `HubSpot needs to implement compliance per tenant to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support compliance per tenant at HubSpot scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-5', problemConfigs['l5-multi-tenant-5']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Atlassian Tenant Isolation Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant6ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-6',
  title: 'Atlassian Tenant Isolation Platform',
  description: `Atlassian needs to implement tenant isolation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support tenant isolation at Atlassian scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-6', problemConfigs['l5-multi-tenant-6']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Slack Resource Allocation Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant7ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-7',
  title: 'Slack Resource Allocation Platform',
  description: `Slack needs to implement resource allocation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support resource allocation at Slack scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-7', problemConfigs['l5-multi-tenant-7']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Microsoft Teams Data Partitioning Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant8ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-8',
  title: 'Microsoft Teams Data Partitioning Platform',
  description: `Microsoft Teams needs to implement data partitioning to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data partitioning at Microsoft Teams scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-8', problemConfigs['l5-multi-tenant-8']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Box Custom Domains Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant9ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-9',
  title: 'Box Custom Domains Platform',
  description: `Box needs to implement custom domains to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support custom domains at Box scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-9', problemConfigs['l5-multi-tenant-9']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Dropbox Compliance Per Tenant Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant10ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-10',
  title: 'Dropbox Compliance Per Tenant Platform',
  description: `Dropbox needs to implement compliance per tenant to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support compliance per tenant at Dropbox scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-10', problemConfigs['l5-multi-tenant-10']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * DocuSign Tenant Isolation Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant11ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-11',
  title: 'DocuSign Tenant Isolation Platform',
  description: `DocuSign needs to implement tenant isolation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support tenant isolation at DocuSign scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-11', problemConfigs['l5-multi-tenant-11']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Zoom Resource Allocation Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant12ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-12',
  title: 'Zoom Resource Allocation Platform',
  description: `Zoom needs to implement resource allocation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support resource allocation at Zoom scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-12', problemConfigs['l5-multi-tenant-12']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Figma Data Partitioning Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant13ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-13',
  title: 'Figma Data Partitioning Platform',
  description: `Figma needs to implement data partitioning to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data partitioning at Figma scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-13', problemConfigs['l5-multi-tenant-13']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Notion Custom Domains Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant14ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-14',
  title: 'Notion Custom Domains Platform',
  description: `Notion needs to implement custom domains to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support custom domains at Notion scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-14', problemConfigs['l5-multi-tenant-14']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Airtable Compliance Per Tenant Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant15ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-15',
  title: 'Airtable Compliance Per Tenant Platform',
  description: `Airtable needs to implement compliance per tenant to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support compliance per tenant at Airtable scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-15', problemConfigs['l5-multi-tenant-15']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Monday Tenant Isolation Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant16ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-16',
  title: 'Monday Tenant Isolation Platform',
  description: `Monday needs to implement tenant isolation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support tenant isolation at Monday scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-16', problemConfigs['l5-multi-tenant-16']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Asana Resource Allocation Platform
 * From extracted-problems/system-design/multi-tenant.md
 */
export const l5MultiTenant17ProblemDefinition: ProblemDefinition = {
  id: 'l5-multi-tenant-17',
  title: 'Asana Resource Allocation Platform',
  description: `Asana needs to implement resource allocation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support resource allocation at Asana scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  functionalRequirements: {
    mustHave: [
      {
        type: 'load_balancer',
        reason: 'Need LB for high availability and traffic distribution',
      }
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

  scenarios: generateScenarios('l5-multi-tenant-17', problemConfigs['l5-multi-tenant-17']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

