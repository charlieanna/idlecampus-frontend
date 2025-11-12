import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * Api-platform Problems (Auto-generated)
 * Generated from extracted-problems/system-design/api-platform.md
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

  scenarios: generateScenarios('l5-api-gateway-facebook', problemConfigs['l5-api-gateway-facebook']),

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

  scenarios: generateScenarios('l5-api-graphql-federation', problemConfigs['l5-api-graphql-federation']),

  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
  ],
};

