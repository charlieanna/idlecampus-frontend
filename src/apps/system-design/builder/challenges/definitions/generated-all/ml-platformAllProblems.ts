import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../../validation/validators/commonValidators';
import { generateScenarios } from '../../scenarioGenerator';
import { problemConfigs } from '../../problemConfigs';

/**
 * Ml-platform Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 18 problems
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

/**
 * OpenAI Model Training Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform1ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-1',
  title: 'OpenAI Model Training Platform',
  description: `OpenAI needs to implement model training to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support model training at OpenAI scale
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

  scenarios: generateScenarios('l5-ml-platform-1', problemConfigs['l5-ml-platform-1']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Anthropic Model Serving Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform2ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-2',
  title: 'Anthropic Model Serving Platform',
  description: `Anthropic needs to implement model serving to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support model serving at Anthropic scale
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

  scenarios: generateScenarios('l5-ml-platform-2', problemConfigs['l5-ml-platform-2']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Cohere Feature Store Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform3ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-3',
  title: 'Cohere Feature Store Platform',
  description: `Cohere needs to implement feature store to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support feature store at Cohere scale
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

  scenarios: generateScenarios('l5-ml-platform-3', problemConfigs['l5-ml-platform-3']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Hugging Face Experiment Tracking Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform4ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-4',
  title: 'Hugging Face Experiment Tracking Platform',
  description: `Hugging Face needs to implement experiment tracking to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support experiment tracking at Hugging Face scale
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

  scenarios: generateScenarios('l5-ml-platform-4', problemConfigs['l5-ml-platform-4']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Weights & Biases Mlops Pipeline Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform5ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-5',
  title: 'Weights & Biases Mlops Pipeline Platform',
  description: `Weights & Biases needs to implement MLOps pipeline to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support MLOps pipeline at Weights & Biases scale
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

  scenarios: generateScenarios('l5-ml-platform-5', problemConfigs['l5-ml-platform-5']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * MLflow Model Training Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform6ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-6',
  title: 'MLflow Model Training Platform',
  description: `MLflow needs to implement model training to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support model training at MLflow scale
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

  scenarios: generateScenarios('l5-ml-platform-6', problemConfigs['l5-ml-platform-6']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Kubeflow Model Serving Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform7ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-7',
  title: 'Kubeflow Model Serving Platform',
  description: `Kubeflow needs to implement model serving to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support model serving at Kubeflow scale
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

  scenarios: generateScenarios('l5-ml-platform-7', problemConfigs['l5-ml-platform-7']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Seldon Feature Store Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform8ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-8',
  title: 'Seldon Feature Store Platform',
  description: `Seldon needs to implement feature store to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support feature store at Seldon scale
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

  scenarios: generateScenarios('l5-ml-platform-8', problemConfigs['l5-ml-platform-8']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * BentoML Experiment Tracking Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform9ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-9',
  title: 'BentoML Experiment Tracking Platform',
  description: `BentoML needs to implement experiment tracking to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support experiment tracking at BentoML scale
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

  scenarios: generateScenarios('l5-ml-platform-9', problemConfigs['l5-ml-platform-9']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Cortex Mlops Pipeline Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform10ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-10',
  title: 'Cortex Mlops Pipeline Platform',
  description: `Cortex needs to implement MLOps pipeline to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support MLOps pipeline at Cortex scale
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

  scenarios: generateScenarios('l5-ml-platform-10', problemConfigs['l5-ml-platform-10']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * SageMaker Model Training Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform11ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-11',
  title: 'SageMaker Model Training Platform',
  description: `SageMaker needs to implement model training to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support model training at SageMaker scale
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

  scenarios: generateScenarios('l5-ml-platform-11', problemConfigs['l5-ml-platform-11']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Vertex AI Model Serving Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform12ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-12',
  title: 'Vertex AI Model Serving Platform',
  description: `Vertex AI needs to implement model serving to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support model serving at Vertex AI scale
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

  scenarios: generateScenarios('l5-ml-platform-12', problemConfigs['l5-ml-platform-12']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Azure ML Feature Store Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform13ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-13',
  title: 'Azure ML Feature Store Platform',
  description: `Azure ML needs to implement feature store to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support feature store at Azure ML scale
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

  scenarios: generateScenarios('l5-ml-platform-13', problemConfigs['l5-ml-platform-13']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * DataRobot Experiment Tracking Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform14ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-14',
  title: 'DataRobot Experiment Tracking Platform',
  description: `DataRobot needs to implement experiment tracking to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support experiment tracking at DataRobot scale
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

  scenarios: generateScenarios('l5-ml-platform-14', problemConfigs['l5-ml-platform-14']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * H2O.ai Mlops Pipeline Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform15ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-15',
  title: 'H2O.ai Mlops Pipeline Platform',
  description: `H2O.ai needs to implement MLOps pipeline to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support MLOps pipeline at H2O.ai scale
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

  scenarios: generateScenarios('l5-ml-platform-15', problemConfigs['l5-ml-platform-15']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Dataiku Model Training Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform16ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-16',
  title: 'Dataiku Model Training Platform',
  description: `Dataiku needs to implement model training to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support model training at Dataiku scale
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

  scenarios: generateScenarios('l5-ml-platform-16', problemConfigs['l5-ml-platform-16']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Domino Model Serving Platform
 * From extracted-problems/system-design/ml-platform.md
 */
export const l5MlPlatform17ProblemDefinition: ProblemDefinition = {
  id: 'l5-ml-platform-17',
  title: 'Domino Model Serving Platform',
  description: `Domino needs to implement model serving to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support model serving at Domino scale
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

  scenarios: generateScenarios('l5-ml-platform-17', problemConfigs['l5-ml-platform-17']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

