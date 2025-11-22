/**
 * Solution Generator
 *
 * Automatically generates solutions for system design challenges by running traffic simulation
 * to find architectures that pass all test cases' requirements.
 *
 * ## Overview
 * This module provides utilities to auto-generate solutions for challenges. Each solution
 * consists of:
 * - **components**: List of infrastructure components (app servers, databases, caches, etc.)
 * - **connections**: How components are wired together (data flow)
 * - **explanation**: Human-readable explanation of why this architecture works
 *
 * ## How It Works
 * 1. Define common architecture patterns (basic, withCache, highTraffic, etc.)
 * 2. For each test case, try patterns from simplest to most complex
 * 3. Run traffic simulation to verify if pattern passes requirements
 * 4. Generate explanation based on the successful pattern
 *
 * ## Usage
 *
 * ### In Browser Console:
 * ```javascript
 * // Generate solution for single test case
 * const solution = generateSolutions.findSolutionForTestCase(testCase);
 *
 * // Generate solutions for entire challenge
 * const updatedChallenge = generateSolutions.generateSolutionsForChallenge(challenge);
 *
 * // Generate solutions for all challenges
 * const updatedChallenges = generateSolutions.generateAllSolutions(challenges);
 * ```
 *
 * ### Generate Complete Challenge Solution:
 * ```javascript
 * // Find architecture that passes ALL test cases
 * const completeSolution = generateSolutions.findCompleteSolution(challenge);
 * challenge.solution = completeSolution;
 * ```
 *
 * ## Architecture Patterns
 * Patterns are tried in order from simplest to most complex:
 * 1. **basic**: client -> LB -> app -> DB (for simple CRUD)
 * 2. **withCache**: Adds Redis cache layer (for read-heavy workloads)
 * 3. **highTraffic**: More instances, larger cache (for 10k+ RPS)
 * 4. **withQueue**: Adds message queue (for async/write-heavy)
 * 5. **massive**: Full stack with S3 (for 100k+ RPS)
 *
 * ## Adding New Patterns
 * Add to ARCHITECTURE_PATTERNS object:
 * ```typescript
 * customPattern: {
 *   components: [
 *     { type: 'client', config: {} },
 *     { type: 'load_balancer', config: {} },
 *     // ... more components
 *   ],
 *   connections: [
 *     { from: 'client', to: 'load_balancer' },
 *     // ... more connections
 *   ],
 * }
 * ```
 */

import { Challenge, TestCase, Solution } from '../types/testCase';
import { SystemGraph } from '../types/graph';
import { SimulationEngine } from '../simulation/engine';
import { TestRunner } from '../simulation/testRunner';

// Common architecture patterns to try
const ARCHITECTURE_PATTERNS = {
  // Basic pattern: client -> LB -> app -> DB
  basic: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 1 } },
      { type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 500 } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'postgresql' },
    ],
  },

  // Add cache layer
  withCache: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 3 } },
      { type: 'redis', config: { memorySizeGB: 16 } },
      { type: 'postgresql', config: { readCapacity: 5000, writeCapacity: 1000 } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'redis' },
      { from: 'app_server', to: 'postgresql' },
    ],
  },

  // High traffic pattern
  highTraffic: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 10 } },
      { type: 'redis', config: { memorySizeGB: 64 } },
      { type: 'postgresql', config: { readCapacity: 20000, writeCapacity: 5000 } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'redis' },
      { from: 'app_server', to: 'postgresql' },
    ],
  },

  // With message queue for async
  withQueue: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 5 } },
      { type: 'redis', config: { memorySizeGB: 32 } },
      { type: 'message_queue', config: { maxThroughput: 100000 } },
      { type: 'postgresql', config: { readCapacity: 10000, writeCapacity: 2000 } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'redis' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'postgresql' },
    ],
  },

  // Massive scale pattern
  massive: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 50 } },
      { type: 'redis', config: { memorySizeGB: 256 } },
      { type: 'message_queue', config: { maxThroughput: 1000000 } },
      { type: 'postgresql', config: { readCapacity: 100000, writeCapacity: 20000 } },
      { type: 's3', config: { storageSizeGB: 100000 } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'redis' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'postgresql' },
      { from: 'app_server', to: 's3' },
    ],
  },
};

/**
 * Convert architecture pattern to SystemGraph
 */
function patternToGraph(pattern: typeof ARCHITECTURE_PATTERNS.basic): SystemGraph {
  const nodes: SystemGraph['nodes'] = [];
  const edges: SystemGraph['edges'] = [];

  // Create nodes
  pattern.components.forEach((comp, index) => {
    // Use config.id if available, otherwise comp.id, otherwise generate one
    const id = comp.config?.id || comp.id || `${comp.type}_${index}`;
    
    nodes.push({
      id,
      type: comp.type,
      position: { x: index * 200, y: 100 },
      config: comp.config,
    });
  });

  // Create edges
  pattern.connections.forEach((conn, index) => {
    const sourceNode = nodes.find(n => n.type === conn.from);
    const targetNode = nodes.find(n => n.type === conn.to);
    if (sourceNode && targetNode) {
      edges.push({
        id: `edge_${index}`,
        source: sourceNode.id,
        target: targetNode.id,
      });
    }
  });

  return {
    components: nodes,
    connections: edges.map(e => ({
      from: e.source,
      to: e.target,
      id: e.id
    }))
  };
}

/**
 * Generate explanation for the solution
 */
function generateExplanation(pattern: typeof ARCHITECTURE_PATTERNS.basic, testCase: TestCase): string {
  const componentList = pattern.components
    .map(c => {
      const configStr = Object.entries(c.config)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      return `- ${c.type}${configStr ? ` (${configStr})` : ''}`;
    })
    .join('\n');

  const flowDescription = pattern.connections
    .map(c => `${c.from} → ${c.to}`)
    .join(' → ');

  return `Architecture for: ${testCase.name}

Components:
${componentList}

Data Flow:
${flowDescription}

This architecture handles ${testCase.traffic.rps} RPS with ${(testCase.traffic.readRatio || 0.9) * 100}% reads.
Target: P99 latency < ${testCase.passCriteria.maxP99Latency || 100}ms, error rate < ${(testCase.passCriteria.maxErrorRate || 0.01) * 100}%`;
}

/**
 * Find a solution for a single test case
 */
export function findSolutionForTestCase(testCase: TestCase): Solution | null {
  const testRunner = new TestRunner();
  const patternsToTry = Object.values(ARCHITECTURE_PATTERNS);

  // Try each pattern from simplest to most complex
  for (const pattern of patternsToTry) {
    const graph = patternToGraph(pattern);
    const result = testRunner.runTestCase(graph, testCase);

    if (result.passed) {
      return {
        components: pattern.components,
        connections: pattern.connections,
        explanation: generateExplanation(pattern, testCase),
      };
    }
  }

  // No solution found with predefined patterns
  return null;
}

/**
 * Generate solutions for all test cases in a challenge
 */
export function generateSolutionsForChallenge(challenge: Challenge): Challenge {
  const updatedTestCases = challenge.testCases.map(testCase => {
    // Skip if solution already exists
    if (testCase.solution) {
      return testCase;
    }

    const solution = findSolutionForTestCase(testCase);
    if (solution) {
      return { ...testCase, solution };
    }

    return testCase;
  });

  return {
    ...challenge,
    testCases: updatedTestCases,
  };
}

/**
 * Generate solutions for all challenges
 */
export function generateAllSolutions(challenges: Challenge[]): Challenge[] {
  return challenges.map(challenge => {
    console.log(`Generating solutions for: ${challenge.title}`);
    const updated = generateSolutionsForChallenge(challenge);

    const totalTests = updated.testCases.length;
    const withSolutions = updated.testCases.filter(tc => tc.solution).length;
    console.log(`  ${withSolutions}/${totalTests} test cases have solutions`);

    return updated;
  });
}

/**
 * Find a complete solution that passes ALL test cases in a challenge
 * This is the main function for generating the challenge's solution field
 */
export function findCompleteSolution(challenge: Challenge): Solution | null {
  const testRunner = new TestRunner();
  const patternsToTry = Object.entries(ARCHITECTURE_PATTERNS);

  // Try patterns from simplest to most complex
  // We need ONE architecture that passes ALL tests
  for (const [patternName, pattern] of patternsToTry) {
    const graph = patternToGraph(pattern);
    const results = testRunner.runAllTestCases(graph, challenge.testCases);

    const allPassed = results.every(r => r.passed);
    const passedCount = results.filter(r => r.passed).length;

    console.log(`  Pattern "${patternName}": ${passedCount}/${challenge.testCases.length} tests passed`);

    if (allPassed) {
      // Found a solution that passes all tests!
      const explanation = generateCompleteSolutionExplanation(pattern, challenge);
      return {
        components: pattern.components,
        connections: pattern.connections,
        explanation,
      };
    }
  }

  // No single pattern passes all tests
  console.log(`  No pattern passes all tests for ${challenge.title}`);
  return null;
}

/**
 * Generate explanation for a complete challenge solution
 */
function generateCompleteSolutionExplanation(
  pattern: typeof ARCHITECTURE_PATTERNS.basic,
  challenge: Challenge
): string {
  const componentList = pattern.components
    .map(c => {
      const configStr = Object.entries(c.config)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ');
      return `- **${c.type}**${configStr ? ` (${configStr})` : ''}`;
    })
    .join('\n');

  const flowDescription = pattern.connections
    .map(c => `${c.from} → ${c.to}`)
    .join('\n');

  return `# Complete Solution for ${challenge.title}

## Architecture Components
${componentList}

## Data Flow
${flowDescription}

## Why This Works
This architecture is designed to handle:
- Traffic: ${challenge.requirements.traffic}
- Latency: ${challenge.requirements.latency}
- Availability: ${challenge.requirements.availability}

The solution passes all ${challenge.testCases.length} test cases including:
${challenge.testCases.slice(0, 5).map(tc => `- ${tc.name} (${tc.type})`).join('\n')}
${challenge.testCases.length > 5 ? `...and ${challenge.testCases.length - 5} more` : ''}

## Key Design Decisions
1. Load balancer distributes traffic evenly across app servers
2. Multiple app server instances provide horizontal scaling
3. Redis cache reduces database load for read-heavy workloads
4. Database configured with sufficient capacity for peak traffic
`;
}

/**
 * Generate complete solutions for all challenges
 * This populates the challenge.solution field (not individual test case solutions)
 */
export function generateAllCompleteSolutions(challenges: Challenge[]): Challenge[] {
  return challenges.map(challenge => {
    console.log(`Finding complete solution for: ${challenge.title}`);

    // Skip if already has a solution
    if (challenge.solution) {
      console.log(`  Already has solution, skipping`);
      return challenge;
    }

    const solution = findCompleteSolution(challenge);
    if (solution) {
      console.log(`  ✓ Found complete solution`);
      return { ...challenge, solution };
    }

    console.log(`  ✗ No complete solution found`);
    return challenge;
  });
}

// Export for use in browser console or tests
if (typeof window !== 'undefined') {
  (window as any).generateSolutions = {
    findSolutionForTestCase,
    generateSolutionsForChallenge,
    generateAllSolutions,
    findCompleteSolution,
    generateAllCompleteSolutions,
    ARCHITECTURE_PATTERNS,
  };
}
