import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Api-platform Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: 19 problems
 */

/**
 * Facebook Global API Gateway
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiGatewayFacebookProblemDefinition: ProblemDefinition = {
  id: 'l5-api-gateway-facebook',
  title: 'Facebook Global API Gateway',
  description: `Facebook needs a unified API gateway for 10,000+ internal services. Design system handling authentication, rate limiting, routing, and protocol translation at massive scale.
- Route to 10,000+ backend services
- Support REST, GraphQL, gRPC protocols
- Handle authentication and authorization
- Enable rate limiting per client`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Route to 10,000+ backend services',
    'Support REST, GraphQL, gRPC protocols',
    'Handle authentication and authorization',
    'Enable rate limiting per client',
    'Support API versioning and deprecation'
  ],
  userFacingNFRs: [
    'Latency: P99 < 10ms gateway overhead',
    'Request Rate: 100M requests/second',
    'Availability: 99.99% uptime'
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

  scenarios: generateScenarios('l5-api-gateway-facebook', problemConfigs['l5-api-gateway-facebook'], [
    'Route to 10,000+ backend services',
    'Support REST, GraphQL, gRPC protocols',
    'Handle authentication and authorization',
    'Enable rate limiting per client',
    'Support API versioning and deprecation'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Netflix GraphQL Federation Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiGraphqlFederationProblemDefinition: ProblemDefinition = {
  id: 'l5-api-graphql-federation',
  title: 'Netflix GraphQL Federation Platform',
  description: `Netflix has 1000 microservices with different APIs. Design federated GraphQL platform providing unified API for web, mobile, TV clients with optimized query execution.
- Federate 1000 service schemas
- Optimize query execution plans
- Support real-time subscriptions
- Enable field-level caching`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Federate 1000 service schemas',
    'Optimize query execution plans',
    'Support real-time subscriptions',
    'Enable field-level caching',
    'Handle partial failures gracefully'
  ],
  userFacingNFRs: [
    'Latency: P99 < 100ms for queries',
    'Dataset Size: 100K types and fields in schema',
    'Availability: 99.95% uptime'
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

  scenarios: generateScenarios('l5-api-graphql-federation', problemConfigs['l5-api-graphql-federation'], [
    'Federate 1000 service schemas',
    'Optimize query execution plans',
    'Support real-time subscriptions',
    'Enable field-level caching',
    'Handle partial failures gracefully'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Twilio Graphql Federation Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform1ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-1',
  title: 'Twilio Graphql Federation Platform',
  description: `Twilio needs to implement GraphQL federation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support GraphQL federation at Twilio scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support GraphQL federation at Twilio scale',
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

  scenarios: generateScenarios('l5-api-platform-1', problemConfigs['l5-api-platform-1'], [
    'Support GraphQL federation at Twilio scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * SendGrid Api Gateway Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform2ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-2',
  title: 'SendGrid Api Gateway Platform',
  description: `SendGrid needs to implement API gateway to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support API gateway at SendGrid scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support API gateway at SendGrid scale',
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

  scenarios: generateScenarios('l5-api-platform-2', problemConfigs['l5-api-platform-2'], [
    'Support API gateway at SendGrid scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Stripe Rate Limiting Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform3ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-3',
  title: 'Stripe Rate Limiting Platform',
  description: `Stripe needs to implement rate limiting to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support rate limiting at Stripe scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support rate limiting at Stripe scale',
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

  scenarios: generateScenarios('l5-api-platform-3', problemConfigs['l5-api-platform-3'], [
    'Support rate limiting at Stripe scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Square Webhook Platform Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform4ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-4',
  title: 'Square Webhook Platform Platform',
  description: `Square needs to implement webhook platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support webhook platform at Square scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support webhook platform at Square scale',
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

  scenarios: generateScenarios('l5-api-platform-4', problemConfigs['l5-api-platform-4'], [
    'Support webhook platform at Square scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Plaid Sdk Generation Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform5ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-5',
  title: 'Plaid Sdk Generation Platform',
  description: `Plaid needs to implement SDK generation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support SDK generation at Plaid scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support SDK generation at Plaid scale',
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

  scenarios: generateScenarios('l5-api-platform-5', problemConfigs['l5-api-platform-5'], [
    'Support SDK generation at Plaid scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Auth0 Graphql Federation Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform6ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-6',
  title: 'Auth0 Graphql Federation Platform',
  description: `Auth0 needs to implement GraphQL federation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support GraphQL federation at Auth0 scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support GraphQL federation at Auth0 scale',
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

  scenarios: generateScenarios('l5-api-platform-6', problemConfigs['l5-api-platform-6'], [
    'Support GraphQL federation at Auth0 scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Okta Api Gateway Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform7ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-7',
  title: 'Okta Api Gateway Platform',
  description: `Okta needs to implement API gateway to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support API gateway at Okta scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support API gateway at Okta scale',
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

  scenarios: generateScenarios('l5-api-platform-7', problemConfigs['l5-api-platform-7'], [
    'Support API gateway at Okta scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Segment Rate Limiting Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform8ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-8',
  title: 'Segment Rate Limiting Platform',
  description: `Segment needs to implement rate limiting to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support rate limiting at Segment scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support rate limiting at Segment scale',
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

  scenarios: generateScenarios('l5-api-platform-8', problemConfigs['l5-api-platform-8'], [
    'Support rate limiting at Segment scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Amplitude Webhook Platform Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform9ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-9',
  title: 'Amplitude Webhook Platform Platform',
  description: `Amplitude needs to implement webhook platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support webhook platform at Amplitude scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support webhook platform at Amplitude scale',
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

  scenarios: generateScenarios('l5-api-platform-9', problemConfigs['l5-api-platform-9'], [
    'Support webhook platform at Amplitude scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Datadog Sdk Generation Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform10ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-10',
  title: 'Datadog Sdk Generation Platform',
  description: `Datadog needs to implement SDK generation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support SDK generation at Datadog scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support SDK generation at Datadog scale',
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

  scenarios: generateScenarios('l5-api-platform-10', problemConfigs['l5-api-platform-10'], [
    'Support SDK generation at Datadog scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * New Relic Graphql Federation Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform11ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-11',
  title: 'New Relic Graphql Federation Platform',
  description: `New Relic needs to implement GraphQL federation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support GraphQL federation at New Relic scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support GraphQL federation at New Relic scale',
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

  scenarios: generateScenarios('l5-api-platform-11', problemConfigs['l5-api-platform-11'], [
    'Support GraphQL federation at New Relic scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * PagerDuty Api Gateway Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform12ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-12',
  title: 'PagerDuty Api Gateway Platform',
  description: `PagerDuty needs to implement API gateway to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support API gateway at PagerDuty scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support API gateway at PagerDuty scale',
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

  scenarios: generateScenarios('l5-api-platform-12', problemConfigs['l5-api-platform-12'], [
    'Support API gateway at PagerDuty scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Elastic Rate Limiting Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform13ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-13',
  title: 'Elastic Rate Limiting Platform',
  description: `Elastic needs to implement rate limiting to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support rate limiting at Elastic scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support rate limiting at Elastic scale',
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

  scenarios: generateScenarios('l5-api-platform-13', problemConfigs['l5-api-platform-13'], [
    'Support rate limiting at Elastic scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * MongoDB Webhook Platform Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform14ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-14',
  title: 'MongoDB Webhook Platform Platform',
  description: `MongoDB needs to implement webhook platform to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support webhook platform at MongoDB scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support webhook platform at MongoDB scale',
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

  scenarios: generateScenarios('l5-api-platform-14', problemConfigs['l5-api-platform-14'], [
    'Support webhook platform at MongoDB scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Redis Sdk Generation Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform15ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-15',
  title: 'Redis Sdk Generation Platform',
  description: `Redis needs to implement SDK generation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support SDK generation at Redis scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support SDK generation at Redis scale',
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

  scenarios: generateScenarios('l5-api-platform-15', problemConfigs['l5-api-platform-15'], [
    'Support SDK generation at Redis scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Confluent Graphql Federation Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform16ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-16',
  title: 'Confluent Graphql Federation Platform',
  description: `Confluent needs to implement GraphQL federation to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support GraphQL federation at Confluent scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support GraphQL federation at Confluent scale',
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

  scenarios: generateScenarios('l5-api-platform-16', problemConfigs['l5-api-platform-16'], [
    'Support GraphQL federation at Confluent scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

/**
 * Snowflake Api Gateway Platform
 * From extracted-problems/system-design/api-platform.md
 */
export const l5ApiPlatform17ProblemDefinition: ProblemDefinition = {
  id: 'l5-api-platform-17',
  title: 'Snowflake Api Gateway Platform',
  description: `Snowflake needs to implement API gateway to support their growing infrastructure. The system must handle millions of users while maintaining high availability and supporting hundreds of engineering teams.
- Support API gateway at Snowflake scale
- Enable gradual migration with zero downtime
- Maintain backward compatibility
- Support A/B testing and gradual rollout`,

  // User-facing requirements (interview-style)
  userFacingFRs: [
    'Support API gateway at Snowflake scale',
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

  scenarios: generateScenarios('l5-api-platform-17', problemConfigs['l5-api-platform-17'], [
    'Support API gateway at Snowflake scale',
    'Enable gradual migration with zero downtime',
    'Maintain backward compatibility',
    'Support A/B testing and gradual rollout',
    'Provide comprehensive monitoring and rollback'
  ]),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

