import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Observability Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 18 problems
 */

/**
 * DataDog-Scale Observability Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5ObservabilityDatadogProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-datadog',
  title: 'DataDog-Scale Observability Platform',
  description: `Design DataDog-scale platform ingesting metrics, logs, and traces from 10K companies, providing real-time dashboards, alerting, and anomaly detection.
- Ingest 10T data points daily
- Support 1M custom metrics
- Provide < 1 minute data latency
- Enable complex query language`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Ingest 10T data points daily',
    'Support 1M custom metrics',
    'Provide < 1 minute data latency',
    'Enable complex query language',
    'Support 100K dashboards'
  ],
  userFacingNFRs: [
    'Latency: P99 < 1s query response',
    'Availability: 99.95% API uptime',
    'Durability: 15 months data retention'
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

  scenarios: generateScenarios('l5-observability-datadog', problemConfigs['l5-observability-datadog']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Datadog Distributed Tracing Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability1ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-1',
  title: 'Datadog Distributed Tracing Platform',
  description: `Datadog needs to implement distributed tracing to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support distributed tracing at Datadog scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support distributed tracing at Datadog scale',
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

  scenarios: generateScenarios('l5-observability-1', problemConfigs['l5-observability-1']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * New Relic Metrics Aggregation Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability2ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-2',
  title: 'New Relic Metrics Aggregation Platform',
  description: `New Relic needs to implement metrics aggregation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support metrics aggregation at New Relic scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support metrics aggregation at New Relic scale',
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

  scenarios: generateScenarios('l5-observability-2', problemConfigs['l5-observability-2']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Splunk Log Management Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability3ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-3',
  title: 'Splunk Log Management Platform',
  description: `Splunk needs to implement log management to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support log management at Splunk scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support log management at Splunk scale',
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

  scenarios: generateScenarios('l5-observability-3', problemConfigs['l5-observability-3']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Dynatrace Apm Platform Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability4ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-4',
  title: 'Dynatrace Apm Platform Platform',
  description: `Dynatrace needs to implement APM platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support APM platform at Dynatrace scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support APM platform at Dynatrace scale',
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

  scenarios: generateScenarios('l5-observability-4', problemConfigs['l5-observability-4']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * AppDynamics Incident Response Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability5ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-5',
  title: 'AppDynamics Incident Response Platform',
  description: `AppDynamics needs to implement incident response to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support incident response at AppDynamics scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support incident response at AppDynamics scale',
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

  scenarios: generateScenarios('l5-observability-5', problemConfigs['l5-observability-5']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Elastic Distributed Tracing Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability6ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-6',
  title: 'Elastic Distributed Tracing Platform',
  description: `Elastic needs to implement distributed tracing to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support distributed tracing at Elastic scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support distributed tracing at Elastic scale',
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

  scenarios: generateScenarios('l5-observability-6', problemConfigs['l5-observability-6']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Grafana Metrics Aggregation Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability7ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-7',
  title: 'Grafana Metrics Aggregation Platform',
  description: `Grafana needs to implement metrics aggregation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support metrics aggregation at Grafana scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support metrics aggregation at Grafana scale',
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

  scenarios: generateScenarios('l5-observability-7', problemConfigs['l5-observability-7']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Prometheus Log Management Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability8ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-8',
  title: 'Prometheus Log Management Platform',
  description: `Prometheus needs to implement log management to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support log management at Prometheus scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support log management at Prometheus scale',
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

  scenarios: generateScenarios('l5-observability-8', problemConfigs['l5-observability-8']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Honeycomb Apm Platform Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability9ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-9',
  title: 'Honeycomb Apm Platform Platform',
  description: `Honeycomb needs to implement APM platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support APM platform at Honeycomb scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support APM platform at Honeycomb scale',
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

  scenarios: generateScenarios('l5-observability-9', problemConfigs['l5-observability-9']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Lightstep Incident Response Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability10ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-10',
  title: 'Lightstep Incident Response Platform',
  description: `Lightstep needs to implement incident response to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support incident response at Lightstep scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support incident response at Lightstep scale',
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

  scenarios: generateScenarios('l5-observability-10', problemConfigs['l5-observability-10']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Instana Distributed Tracing Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability11ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-11',
  title: 'Instana Distributed Tracing Platform',
  description: `Instana needs to implement distributed tracing to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support distributed tracing at Instana scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support distributed tracing at Instana scale',
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

  scenarios: generateScenarios('l5-observability-11', problemConfigs['l5-observability-11']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * SignalFx Metrics Aggregation Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability12ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-12',
  title: 'SignalFx Metrics Aggregation Platform',
  description: `SignalFx needs to implement metrics aggregation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support metrics aggregation at SignalFx scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support metrics aggregation at SignalFx scale',
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

  scenarios: generateScenarios('l5-observability-12', problemConfigs['l5-observability-12']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Wavefront Log Management Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability13ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-13',
  title: 'Wavefront Log Management Platform',
  description: `Wavefront needs to implement log management to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support log management at Wavefront scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support log management at Wavefront scale',
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

  scenarios: generateScenarios('l5-observability-13', problemConfigs['l5-observability-13']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Chronosphere Apm Platform Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability14ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-14',
  title: 'Chronosphere Apm Platform Platform',
  description: `Chronosphere needs to implement APM platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support APM platform at Chronosphere scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support APM platform at Chronosphere scale',
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

  scenarios: generateScenarios('l5-observability-14', problemConfigs['l5-observability-14']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Cribl Incident Response Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability15ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-15',
  title: 'Cribl Incident Response Platform',
  description: `Cribl needs to implement incident response to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support incident response at Cribl scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support incident response at Cribl scale',
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

  scenarios: generateScenarios('l5-observability-15', problemConfigs['l5-observability-15']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Mezmo Distributed Tracing Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability16ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-16',
  title: 'Mezmo Distributed Tracing Platform',
  description: `Mezmo needs to implement distributed tracing to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support distributed tracing at Mezmo scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support distributed tracing at Mezmo scale',
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

  scenarios: generateScenarios('l5-observability-16', problemConfigs['l5-observability-16']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Coralogix Metrics Aggregation Platform
 * From extracted-problems/system-design/observability.md
 */
export const l5Observability17ProblemDefinition: ProblemDefinition = {
  id: 'l5-observability-17',
  title: 'Coralogix Metrics Aggregation Platform',
  description: `Coralogix needs to implement metrics aggregation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support metrics aggregation at Coralogix scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support metrics aggregation at Coralogix scale',
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

  scenarios: generateScenarios('l5-observability-17', problemConfigs['l5-observability-17']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

