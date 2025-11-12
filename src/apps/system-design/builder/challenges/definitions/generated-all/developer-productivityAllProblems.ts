import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * Developer-productivity Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 18 problems
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

/**
 * GitHub Ci/Cd Pipeline Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity1ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-1',
  title: 'GitHub Ci/Cd Pipeline Platform',
  description: `GitHub needs to implement CI/CD pipeline to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support CI/CD pipeline at GitHub scale
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

  scenarios: generateScenarios('l5-developer-productivity-1', problemConfigs['l5-developer-productivity-1']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * GitLab Code Review Platform Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity2ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-2',
  title: 'GitLab Code Review Platform Platform',
  description: `GitLab needs to implement code review platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support code review platform at GitLab scale
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

  scenarios: generateScenarios('l5-developer-productivity-2', problemConfigs['l5-developer-productivity-2']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Bitbucket Testing Infrastructure Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity3ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-3',
  title: 'Bitbucket Testing Infrastructure Platform',
  description: `Bitbucket needs to implement testing infrastructure to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support testing infrastructure at Bitbucket scale
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

  scenarios: generateScenarios('l5-developer-productivity-3', problemConfigs['l5-developer-productivity-3']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * CircleCI Deployment Automation Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity4ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-4',
  title: 'CircleCI Deployment Automation Platform',
  description: `CircleCI needs to implement deployment automation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support deployment automation at CircleCI scale
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

  scenarios: generateScenarios('l5-developer-productivity-4', problemConfigs['l5-developer-productivity-4']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Travis CI Developer Portal Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity5ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-5',
  title: 'Travis CI Developer Portal Platform',
  description: `Travis CI needs to implement developer portal to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support developer portal at Travis CI scale
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

  scenarios: generateScenarios('l5-developer-productivity-5', problemConfigs['l5-developer-productivity-5']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Jenkins Ci/Cd Pipeline Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity6ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-6',
  title: 'Jenkins Ci/Cd Pipeline Platform',
  description: `Jenkins needs to implement CI/CD pipeline to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support CI/CD pipeline at Jenkins scale
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

  scenarios: generateScenarios('l5-developer-productivity-6', problemConfigs['l5-developer-productivity-6']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * TeamCity Code Review Platform Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity7ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-7',
  title: 'TeamCity Code Review Platform Platform',
  description: `TeamCity needs to implement code review platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support code review platform at TeamCity scale
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

  scenarios: generateScenarios('l5-developer-productivity-7', problemConfigs['l5-developer-productivity-7']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Bamboo Testing Infrastructure Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity8ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-8',
  title: 'Bamboo Testing Infrastructure Platform',
  description: `Bamboo needs to implement testing infrastructure to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support testing infrastructure at Bamboo scale
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

  scenarios: generateScenarios('l5-developer-productivity-8', problemConfigs['l5-developer-productivity-8']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * CodeShip Deployment Automation Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity9ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-9',
  title: 'CodeShip Deployment Automation Platform',
  description: `CodeShip needs to implement deployment automation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support deployment automation at CodeShip scale
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

  scenarios: generateScenarios('l5-developer-productivity-9', problemConfigs['l5-developer-productivity-9']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Buildkite Developer Portal Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity10ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-10',
  title: 'Buildkite Developer Portal Platform',
  description: `Buildkite needs to implement developer portal to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support developer portal at Buildkite scale
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

  scenarios: generateScenarios('l5-developer-productivity-10', problemConfigs['l5-developer-productivity-10']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Codefresh Ci/Cd Pipeline Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity11ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-11',
  title: 'Codefresh Ci/Cd Pipeline Platform',
  description: `Codefresh needs to implement CI/CD pipeline to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support CI/CD pipeline at Codefresh scale
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

  scenarios: generateScenarios('l5-developer-productivity-11', problemConfigs['l5-developer-productivity-11']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Harness Code Review Platform Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity12ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-12',
  title: 'Harness Code Review Platform Platform',
  description: `Harness needs to implement code review platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support code review platform at Harness scale
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

  scenarios: generateScenarios('l5-developer-productivity-12', problemConfigs['l5-developer-productivity-12']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Spinnaker Testing Infrastructure Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity13ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-13',
  title: 'Spinnaker Testing Infrastructure Platform',
  description: `Spinnaker needs to implement testing infrastructure to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support testing infrastructure at Spinnaker scale
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

  scenarios: generateScenarios('l5-developer-productivity-13', problemConfigs['l5-developer-productivity-13']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * ArgoCD Deployment Automation Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity14ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-14',
  title: 'ArgoCD Deployment Automation Platform',
  description: `ArgoCD needs to implement deployment automation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support deployment automation at ArgoCD scale
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

  scenarios: generateScenarios('l5-developer-productivity-14', problemConfigs['l5-developer-productivity-14']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Flux Developer Portal Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity15ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-15',
  title: 'Flux Developer Portal Platform',
  description: `Flux needs to implement developer portal to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support developer portal at Flux scale
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

  scenarios: generateScenarios('l5-developer-productivity-15', problemConfigs['l5-developer-productivity-15']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Pulumi Ci/Cd Pipeline Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity16ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-16',
  title: 'Pulumi Ci/Cd Pipeline Platform',
  description: `Pulumi needs to implement CI/CD pipeline to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support CI/CD pipeline at Pulumi scale
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

  scenarios: generateScenarios('l5-developer-productivity-16', problemConfigs['l5-developer-productivity-16']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Terraform Code Review Platform Platform
 * From extracted-problems/system-design/developer-productivity.md
 */
export const l5DeveloperProductivity17ProblemDefinition: ProblemDefinition = {
  id: 'l5-developer-productivity-17',
  title: 'Terraform Code Review Platform Platform',
  description: `Terraform needs to implement code review platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support code review platform at Terraform scale
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

  scenarios: generateScenarios('l5-developer-productivity-17', problemConfigs['l5-developer-productivity-17']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

