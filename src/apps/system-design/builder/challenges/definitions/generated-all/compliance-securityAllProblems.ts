import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Compliance-security Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 18 problems
 */

/**
 * Apple End-to-End Encryption Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5SecurityAppleEncryptionProblemDefinition: ProblemDefinition = {
  id: 'l5-security-apple-encryption',
  title: 'Apple End-to-End Encryption Platform',
  description: `Design Apple's E2E encryption system for iCloud data, supporting device sync, key recovery, and compliance with global regulations while maintaining usability.
- Encrypt all user data end-to-end
- Support multi-device synchronization
- Enable account recovery without Apple access
- Provide legal compliance mechanisms`,

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

  scenarios: generateScenarios('l5-security-apple-encryption', problemConfigs['l5-security-apple-encryption']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * CrowdStrike Gdpr Compliance Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity1ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-1',
  title: 'CrowdStrike Gdpr Compliance Platform',
  description: `CrowdStrike needs to implement GDPR compliance to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support GDPR compliance at CrowdStrike scale
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

  scenarios: generateScenarios('l5-compliance-security-1', problemConfigs['l5-compliance-security-1']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Palo Alto Pci-Dss Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity2ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-2',
  title: 'Palo Alto Pci-Dss Platform',
  description: `Palo Alto needs to implement PCI-DSS to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support PCI-DSS at Palo Alto scale
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

  scenarios: generateScenarios('l5-compliance-security-2', problemConfigs['l5-compliance-security-2']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Fortinet Hipaa Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity3ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-3',
  title: 'Fortinet Hipaa Platform',
  description: `Fortinet needs to implement HIPAA to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support HIPAA at Fortinet scale
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

  scenarios: generateScenarios('l5-compliance-security-3', problemConfigs['l5-compliance-security-3']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Check Point Zero Trust Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity4ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-4',
  title: 'Check Point Zero Trust Platform',
  description: `Check Point needs to implement zero trust to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support zero trust at Check Point scale
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

  scenarios: generateScenarios('l5-compliance-security-4', problemConfigs['l5-compliance-security-4']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Zscaler Data Encryption Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity5ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-5',
  title: 'Zscaler Data Encryption Platform',
  description: `Zscaler needs to implement data encryption to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data encryption at Zscaler scale
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

  scenarios: generateScenarios('l5-compliance-security-5', problemConfigs['l5-compliance-security-5']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Okta Gdpr Compliance Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity6ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-6',
  title: 'Okta Gdpr Compliance Platform',
  description: `Okta needs to implement GDPR compliance to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support GDPR compliance at Okta scale
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

  scenarios: generateScenarios('l5-compliance-security-6', problemConfigs['l5-compliance-security-6']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Auth0 Pci-Dss Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity7ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-7',
  title: 'Auth0 Pci-Dss Platform',
  description: `Auth0 needs to implement PCI-DSS to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support PCI-DSS at Auth0 scale
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

  scenarios: generateScenarios('l5-compliance-security-7', problemConfigs['l5-compliance-security-7']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Ping Identity Hipaa Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity8ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-8',
  title: 'Ping Identity Hipaa Platform',
  description: `Ping Identity needs to implement HIPAA to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support HIPAA at Ping Identity scale
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

  scenarios: generateScenarios('l5-compliance-security-8', problemConfigs['l5-compliance-security-8']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * OneLogin Zero Trust Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity9ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-9',
  title: 'OneLogin Zero Trust Platform',
  description: `OneLogin needs to implement zero trust to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support zero trust at OneLogin scale
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

  scenarios: generateScenarios('l5-compliance-security-9', problemConfigs['l5-compliance-security-9']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Cyberark Data Encryption Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity10ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-10',
  title: 'Cyberark Data Encryption Platform',
  description: `Cyberark needs to implement data encryption to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data encryption at Cyberark scale
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

  scenarios: generateScenarios('l5-compliance-security-10', problemConfigs['l5-compliance-security-10']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * HashiCorp Gdpr Compliance Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity11ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-11',
  title: 'HashiCorp Gdpr Compliance Platform',
  description: `HashiCorp needs to implement GDPR compliance to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support GDPR compliance at HashiCorp scale
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

  scenarios: generateScenarios('l5-compliance-security-11', problemConfigs['l5-compliance-security-11']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Beyond Trust Pci-Dss Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity12ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-12',
  title: 'Beyond Trust Pci-Dss Platform',
  description: `Beyond Trust needs to implement PCI-DSS to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support PCI-DSS at Beyond Trust scale
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

  scenarios: generateScenarios('l5-compliance-security-12', problemConfigs['l5-compliance-security-12']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Sailpoint Hipaa Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity13ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-13',
  title: 'Sailpoint Hipaa Platform',
  description: `Sailpoint needs to implement HIPAA to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support HIPAA at Sailpoint scale
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

  scenarios: generateScenarios('l5-compliance-security-13', problemConfigs['l5-compliance-security-13']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Varonis Zero Trust Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity14ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-14',
  title: 'Varonis Zero Trust Platform',
  description: `Varonis needs to implement zero trust to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support zero trust at Varonis scale
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

  scenarios: generateScenarios('l5-compliance-security-14', problemConfigs['l5-compliance-security-14']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Imperva Data Encryption Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity15ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-15',
  title: 'Imperva Data Encryption Platform',
  description: `Imperva needs to implement data encryption to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data encryption at Imperva scale
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

  scenarios: generateScenarios('l5-compliance-security-15', problemConfigs['l5-compliance-security-15']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Cloudflare Gdpr Compliance Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity16ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-16',
  title: 'Cloudflare Gdpr Compliance Platform',
  description: `Cloudflare needs to implement GDPR compliance to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support GDPR compliance at Cloudflare scale
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

  scenarios: generateScenarios('l5-compliance-security-16', problemConfigs['l5-compliance-security-16']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Akamai Pci-Dss Platform
 * From extracted-problems/system-design/compliance-security.md
 */
export const l5ComplianceSecurity17ProblemDefinition: ProblemDefinition = {
  id: 'l5-compliance-security-17',
  title: 'Akamai Pci-Dss Platform',
  description: `Akamai needs to implement PCI-DSS to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support PCI-DSS at Akamai scale
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

  scenarios: generateScenarios('l5-compliance-security-17', problemConfigs['l5-compliance-security-17']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

