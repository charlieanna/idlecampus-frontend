import { ProblemDefinition } from '../types/problemDefinition';
import {
  cacheForReadHeavyValidator,
  databaseWriteCapacityValidator,
  highAvailabilityValidator,
  costOptimizationValidator,
  validConnectionFlowValidator,
} from '../validation/validators/commonValidators';

/**
 * TinyURL Problem Definition
 *
 * This defines the complete validation rules for TinyURL system design problem.
 * Can be tested at multiple levels with increasing complexity.
 */
export const tinyUrlProblemDefinition: ProblemDefinition = {
  id: 'tiny_url',
  title: 'URL Shortener (TinyURL)',
  description: `Design a URL shortening service like bit.ly that:
- Accepts long URLs and generates short codes
- Redirects short codes to original URLs
- Ensures short codes are unique`,

  // What architecture is required?
  functionalRequirements: {
    mustHave: [
      {
        type: 'compute',
        reason: 'Need to process requests and generate short codes',
      },
      {
        type: 'storage',
        reason: 'Need to store URL mappings persistently',
      },
    ],
    mustConnect: [
      {
        from: 'client',
        to: 'compute',
        reason: 'Client sends requests to app server',
      },
      {
        from: 'compute',
        to: 'storage',
        reason: 'App server needs to read/write URL mappings',
      },
    ],
    dataModel: {
      entities: ['url_mapping'],
      fields: {
        url_mapping: ['short_code', 'long_url', 'created_at', 'user_id'],
      },
      accessPatterns: [
        { type: 'write', frequency: 'low' },        // Creating short URLs
        { type: 'read_by_key', frequency: 'very_high' },  // Redirecting
      ],
    },
  },

  // Test scenarios for each level
  scenarios: [
    // Level 1: Basic connectivity
    {
      name: 'Level 1: Build Your First Working System',
      description: 'Just get components connected correctly',
      traffic: {
        rps: 1,
        readWriteRatio: 0.5,
      },
      passCriteria: {
        maxLatency: 5000,  // Very generous
        maxErrorRate: 0.9, // Almost always passes
      },
    },

    // Level 2: Capacity planning
    {
      name: 'Level 2: Scale to 100 RPS',
      description: 'Learn about component capacity',
      traffic: {
        rps: 100,
        readWriteRatio: 0.9,
      },
      passCriteria: {
        maxLatency: 200,
        maxErrorRate: 0.05,
      },
    },

    // Level 3: Caching
    {
      name: 'Level 3: Scale to 1,000 RPS with Caching',
      description: 'Add caching to handle high read traffic',
      traffic: {
        rps: 1000,
        readWriteRatio: 0.9,
      },
      passCriteria: {
        maxLatency: 100,
        maxErrorRate: 0.05,
        maxCost: 300,
      },
    },

    // Level 4: High availability
    {
      name: 'Level 4: Survive Server Failures',
      description: 'Add redundancy to handle failures',
      traffic: {
        rps: 1000,
        readWriteRatio: 0.9,
      },
      failureInjection: {
        component: 'postgresql',
        at: 20,
        recoveryAt: 40,
      },
      passCriteria: {
        maxLatency: 150,
        maxDowntime: 10,
        availability: 0.999,
      },
    },

    // Level 5: Cost optimization
    {
      name: 'Level 5: Optimize Cost While Meeting Requirements',
      description: 'Make tradeoffs to reduce cost',
      traffic: {
        rps: 1000,
        readWriteRatio: 0.9,
      },
      passCriteria: {
        maxLatency: 100,
        maxErrorRate: 0.05,
        maxCost: 500,
        availability: 0.99,  // Lower than Level 4
      },
    },
  ],

  // Custom validators for TinyURL-specific rules
  validators: [
    {
      name: 'Valid Connection Flow',
      validate: validConnectionFlowValidator,
    },
    {
      name: 'Cache for Read-Heavy Traffic',
      validate: cacheForReadHeavyValidator,
    },
    {
      name: 'Database Write Capacity',
      validate: databaseWriteCapacityValidator,
    },
    {
      name: 'High Availability Requirements',
      validate: highAvailabilityValidator,
    },
    {
      name: 'Cost Optimization',
      validate: costOptimizationValidator,
    },
    {
      name: 'CDN is Overkill for Dynamic Content',
      validate: (graph, scenario) => {
        const hasCDN = graph.components.some(c => c.type === 'cdn');

        if (hasCDN) {
          return {
            valid: false,
            hint: 'CDN is overkill for TinyURL! Responses are dynamic (database lookups), not static files. CDN cannot cache redirects.',
          };
        }

        return { valid: true };
      },
    },
  ],
};
