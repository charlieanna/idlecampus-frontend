import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Data-platform Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 18 problems
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

/**
 * Databricks Data Lake Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform1ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-1',
  title: 'Databricks Data Lake Platform',
  description: `Databricks needs to implement data lake to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data lake at Databricks scale
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

  scenarios: generateScenarios('l5-data-platform-1', problemConfigs['l5-data-platform-1']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Snowflake Etl Pipeline Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform2ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-2',
  title: 'Snowflake Etl Pipeline Platform',
  description: `Snowflake needs to implement ETL pipeline to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support ETL pipeline at Snowflake scale
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

  scenarios: generateScenarios('l5-data-platform-2', problemConfigs['l5-data-platform-2']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Palantir Real-Time Analytics Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform3ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-3',
  title: 'Palantir Real-Time Analytics Platform',
  description: `Palantir needs to implement real-time analytics to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support real-time analytics at Palantir scale
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

  scenarios: generateScenarios('l5-data-platform-3', problemConfigs['l5-data-platform-3']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Splunk Ml Feature Store Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform4ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-4',
  title: 'Splunk Ml Feature Store Platform',
  description: `Splunk needs to implement ML feature store to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support ML feature store at Splunk scale
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

  scenarios: generateScenarios('l5-data-platform-4', problemConfigs['l5-data-platform-4']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Tableau Data Governance Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform5ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-5',
  title: 'Tableau Data Governance Platform',
  description: `Tableau needs to implement data governance to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data governance at Tableau scale
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

  scenarios: generateScenarios('l5-data-platform-5', problemConfigs['l5-data-platform-5']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Looker Data Lake Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform6ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-6',
  title: 'Looker Data Lake Platform',
  description: `Looker needs to implement data lake to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data lake at Looker scale
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

  scenarios: generateScenarios('l5-data-platform-6', problemConfigs['l5-data-platform-6']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Domo Etl Pipeline Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform7ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-7',
  title: 'Domo Etl Pipeline Platform',
  description: `Domo needs to implement ETL pipeline to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support ETL pipeline at Domo scale
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

  scenarios: generateScenarios('l5-data-platform-7', problemConfigs['l5-data-platform-7']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Sisense Real-Time Analytics Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform8ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-8',
  title: 'Sisense Real-Time Analytics Platform',
  description: `Sisense needs to implement real-time analytics to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support real-time analytics at Sisense scale
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

  scenarios: generateScenarios('l5-data-platform-8', problemConfigs['l5-data-platform-8']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * ThoughtSpot Ml Feature Store Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform9ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-9',
  title: 'ThoughtSpot Ml Feature Store Platform',
  description: `ThoughtSpot needs to implement ML feature store to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support ML feature store at ThoughtSpot scale
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

  scenarios: generateScenarios('l5-data-platform-9', problemConfigs['l5-data-platform-9']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Alteryx Data Governance Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform10ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-10',
  title: 'Alteryx Data Governance Platform',
  description: `Alteryx needs to implement data governance to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data governance at Alteryx scale
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

  scenarios: generateScenarios('l5-data-platform-10', problemConfigs['l5-data-platform-10']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Informatica Data Lake Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform11ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-11',
  title: 'Informatica Data Lake Platform',
  description: `Informatica needs to implement data lake to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data lake at Informatica scale
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

  scenarios: generateScenarios('l5-data-platform-11', problemConfigs['l5-data-platform-11']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Talend Etl Pipeline Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform12ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-12',
  title: 'Talend Etl Pipeline Platform',
  description: `Talend needs to implement ETL pipeline to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support ETL pipeline at Talend scale
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

  scenarios: generateScenarios('l5-data-platform-12', problemConfigs['l5-data-platform-12']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Fivetran Real-Time Analytics Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform13ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-13',
  title: 'Fivetran Real-Time Analytics Platform',
  description: `Fivetran needs to implement real-time analytics to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support real-time analytics at Fivetran scale
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

  scenarios: generateScenarios('l5-data-platform-13', problemConfigs['l5-data-platform-13']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Stitch Ml Feature Store Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform14ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-14',
  title: 'Stitch Ml Feature Store Platform',
  description: `Stitch needs to implement ML feature store to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support ML feature store at Stitch scale
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

  scenarios: generateScenarios('l5-data-platform-14', problemConfigs['l5-data-platform-14']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Segment Data Governance Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform15ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-15',
  title: 'Segment Data Governance Platform',
  description: `Segment needs to implement data governance to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data governance at Segment scale
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

  scenarios: generateScenarios('l5-data-platform-15', problemConfigs['l5-data-platform-15']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Census Data Lake Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform16ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-16',
  title: 'Census Data Lake Platform',
  description: `Census needs to implement data lake to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support data lake at Census scale
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

  scenarios: generateScenarios('l5-data-platform-16', problemConfigs['l5-data-platform-16']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Hightouch Etl Pipeline Platform
 * From extracted-problems/system-design/data-platform.md
 */
export const l5DataPlatform17ProblemDefinition: ProblemDefinition = {
  id: 'l5-data-platform-17',
  title: 'Hightouch Etl Pipeline Platform',
  description: `Hightouch needs to implement ETL pipeline to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support ETL pipeline at Hightouch scale
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

  scenarios: generateScenarios('l5-data-platform-17', problemConfigs['l5-data-platform-17']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

