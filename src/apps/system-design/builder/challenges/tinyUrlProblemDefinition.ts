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

  // User-facing functional requirements and problem-specific clients
  userFacingFRs: [
    'Users can create short URLs',
    'Users can redirect to original URLs using short codes',
  ],

  // Single locked client (compact canvas)
  clientDescriptions: [
    {
      name: 'URL Client',
      subtitle: 'Creates and redirects short URLs',
      id: 'url_client',
    },
  ],

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
    // Level 1: Brute Force - Does it work at all?
    {
      name: 'Level 1: The Brute Force Test - Does It Even Work?',
      description: 'Like algorithm brute force: ignore performance, just verify connectivity. Client → App → Database path exists. No optimization needed.',
      traffic: {
        rps: 0.1,  // Nearly zero traffic - just checking connectivity
        readWriteRatio: 0.5,
      },
      passCriteria: {
        maxLatency: 30000,  // 30 seconds - we don't care about speed
        maxErrorRate: 0.99, // 99% errors allowed - just need ONE request to work
      },
    },

    // Level 2: First optimization - capacity planning
    {
      name: 'Level 2: Basic Optimization - Scale to 100 RPS',
      description: 'Like algorithm O(n): it works, but now make it handle real load. Size your components for capacity.',
      traffic: {
        rps: 100,
        readWriteRatio: 0.9,
      },
      passCriteria: {
        maxLatency: 200,
        maxErrorRate: 0.05,
      },
    },

    // Level 3: Better optimization - caching
    {
      name: 'Level 3: Better Optimization - Add Caching for 1,000 RPS',
      description: 'Like algorithm O(log n): use caching to handle 10x more traffic efficiently.',
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

    // Level 4: Handle edge cases - failures
    {
      name: 'Level 4: Edge Cases - Survive Server Failures',
      description: 'Like handling null pointers: what if your database crashes? Add redundancy.',
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

    // Level 5: Optimal solution - cost/performance balance
    {
      name: 'Level 5: Optimal Solution - Balance Cost vs Performance',
      description: 'Like finding optimal time/space tradeoff: meet requirements at lowest cost.',
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

  pythonTemplate: `# tinyurl.py
import hashlib
from typing import Optional

# You can create your own data structures here
# For example: url_map = {}

def shorten(url: str) -> Optional[str]:
    """
    Create a short code for the given URL.

    Args:
        url: The long URL to shorten

    Returns:
        A short code string, or None if invalid
    """
    # TODO: Implement this function
    # Hint: Use a dictionary to store URL mappings
    # Hint: Use hashlib to generate short codes
    pass

def expand(code: str) -> Optional[str]:
    """
    Retrieve the original URL from a short code.

    Args:
        code: The short code to expand

    Returns:
        The original URL, or None if not found
    """
    # TODO: Implement this function
    pass
`,
};
