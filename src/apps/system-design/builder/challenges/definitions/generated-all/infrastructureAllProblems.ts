import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Infrastructure Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 18 problems
 */

/**
 * Google Kubernetes Engine Architecture
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5InfraKubernetesPlatformProblemDefinition: ProblemDefinition = {
  id: 'l5-infra-kubernetes-platform',
  title: 'Google Kubernetes Engine Architecture',
  description: `Design GKE-scale platform managing 100K Kubernetes clusters, handling upgrades, scaling, and multi-tenancy while maintaining security and performance.
- Manage 100K Kubernetes clusters
- Support zero-downtime upgrades
- Enable auto-scaling and auto-healing
- Provide multi-tenancy isolation`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Manage 100K Kubernetes clusters',
    'Support zero-downtime upgrades',
    'Enable auto-scaling and auto-healing',
    'Provide multi-tenancy isolation',
    'Support custom controllers'
  ],
  userFacingNFRs: [
    'Latency: P99 < 5s for API operations',
    'Availability: 99.95% control plane SLA'
  ],

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

  scenarios: generateScenarios('l5-infra-kubernetes-platform', problemConfigs['l5-infra-kubernetes-platform']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * AWS Kubernetes Platform Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure1ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-1',
  title: 'AWS Kubernetes Platform Platform',
  description: `AWS needs to implement Kubernetes platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support Kubernetes platform at AWS scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support Kubernetes platform at AWS scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 10M requests per second',
    'Dataset Size: 100TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-1', problemConfigs['l5-infrastructure-1']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * GCP Service Mesh Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure2ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-2',
  title: 'GCP Service Mesh Platform',
  description: `GCP needs to implement service mesh to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support service mesh at GCP scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support service mesh at GCP scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 11M requests per second',
    'Dataset Size: 110TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-2', problemConfigs['l5-infrastructure-2']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Azure Infrastructure As Code Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure3ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-3',
  title: 'Azure Infrastructure As Code Platform',
  description: `Azure needs to implement infrastructure as code to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support infrastructure as code at Azure scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support infrastructure as code at Azure scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 12M requests per second',
    'Dataset Size: 120TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-3', problemConfigs['l5-infrastructure-3']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * DigitalOcean Hybrid Cloud Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure4ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-4',
  title: 'DigitalOcean Hybrid Cloud Platform',
  description: `DigitalOcean needs to implement hybrid cloud to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support hybrid cloud at DigitalOcean scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support hybrid cloud at DigitalOcean scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 13M requests per second',
    'Dataset Size: 130TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-4', problemConfigs['l5-infrastructure-4']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Linode Edge Computing Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure5ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-5',
  title: 'Linode Edge Computing Platform',
  description: `Linode needs to implement edge computing to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support edge computing at Linode scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support edge computing at Linode scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 14M requests per second',
    'Dataset Size: 140TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-5', problemConfigs['l5-infrastructure-5']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Vultr Kubernetes Platform Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure6ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-6',
  title: 'Vultr Kubernetes Platform Platform',
  description: `Vultr needs to implement Kubernetes platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support Kubernetes platform at Vultr scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support Kubernetes platform at Vultr scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 15M requests per second',
    'Dataset Size: 150TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-6', problemConfigs['l5-infrastructure-6']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * OVH Service Mesh Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure7ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-7',
  title: 'OVH Service Mesh Platform',
  description: `OVH needs to implement service mesh to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support service mesh at OVH scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support service mesh at OVH scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 16M requests per second',
    'Dataset Size: 160TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-7', problemConfigs['l5-infrastructure-7']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Hetzner Infrastructure As Code Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure8ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-8',
  title: 'Hetzner Infrastructure As Code Platform',
  description: `Hetzner needs to implement infrastructure as code to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support infrastructure as code at Hetzner scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support infrastructure as code at Hetzner scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 17M requests per second',
    'Dataset Size: 170TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-8', problemConfigs['l5-infrastructure-8']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Equinix Hybrid Cloud Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure9ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-9',
  title: 'Equinix Hybrid Cloud Platform',
  description: `Equinix needs to implement hybrid cloud to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support hybrid cloud at Equinix scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support hybrid cloud at Equinix scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 18M requests per second',
    'Dataset Size: 180TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-9', problemConfigs['l5-infrastructure-9']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * CoreOS Edge Computing Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure10ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-10',
  title: 'CoreOS Edge Computing Platform',
  description: `CoreOS needs to implement edge computing to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support edge computing at CoreOS scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support edge computing at CoreOS scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 19M requests per second',
    'Dataset Size: 190TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-10', problemConfigs['l5-infrastructure-10']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Rancher Kubernetes Platform Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure11ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-11',
  title: 'Rancher Kubernetes Platform Platform',
  description: `Rancher needs to implement Kubernetes platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support Kubernetes platform at Rancher scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support Kubernetes platform at Rancher scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 20M requests per second',
    'Dataset Size: 200TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-11', problemConfigs['l5-infrastructure-11']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * OpenShift Service Mesh Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure12ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-12',
  title: 'OpenShift Service Mesh Platform',
  description: `OpenShift needs to implement service mesh to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support service mesh at OpenShift scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support service mesh at OpenShift scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 21M requests per second',
    'Dataset Size: 210TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-12', problemConfigs['l5-infrastructure-12']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Tanzu Infrastructure As Code Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure13ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-13',
  title: 'Tanzu Infrastructure As Code Platform',
  description: `Tanzu needs to implement infrastructure as code to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support infrastructure as code at Tanzu scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support infrastructure as code at Tanzu scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 22M requests per second',
    'Dataset Size: 220TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-13', problemConfigs['l5-infrastructure-13']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Anthos Hybrid Cloud Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure14ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-14',
  title: 'Anthos Hybrid Cloud Platform',
  description: `Anthos needs to implement hybrid cloud to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support hybrid cloud at Anthos scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support hybrid cloud at Anthos scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 23M requests per second',
    'Dataset Size: 230TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-14', problemConfigs['l5-infrastructure-14']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * EKS Edge Computing Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure15ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-15',
  title: 'EKS Edge Computing Platform',
  description: `EKS needs to implement edge computing to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support edge computing at EKS scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support edge computing at EKS scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 24M requests per second',
    'Dataset Size: 240TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-15', problemConfigs['l5-infrastructure-15']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * GKE Kubernetes Platform Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure16ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-16',
  title: 'GKE Kubernetes Platform Platform',
  description: `GKE needs to implement Kubernetes platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support Kubernetes platform at GKE scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support Kubernetes platform at GKE scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 25M requests per second',
    'Dataset Size: 250TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-16', problemConfigs['l5-infrastructure-16']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * AKS Service Mesh Platform
 * From extracted-problems/system-design/infrastructure.md
 */
export const l5Infrastructure17ProblemDefinition: ProblemDefinition = {
  id: 'l5-infrastructure-17',
  title: 'AKS Service Mesh Platform',
  description: `AKS needs to implement service mesh to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support service mesh at AKS scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support service mesh at AKS scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for all operations',
    'Request Rate: 26M requests per second',
    'Dataset Size: 260TB data migration',
    'Availability: 99.99% uptime during migration'
  ],

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

  scenarios: generateScenarios('l5-infrastructure-17', problemConfigs['l5-infrastructure-17']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

