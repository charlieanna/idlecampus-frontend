/**
 * Challenge Migration: Add Python Templates and Auto-Generate Solutions
 *
 * Automatically adds Python templates to all challenges
 * and generates solutions by finding architectures that pass all test cases
 */

import { Challenge, Solution } from '../types/testCase';
import { generatePythonTemplate, detectRequiredAPIs } from './pythonTemplateGenerator';
import { TestRunner } from '../simulation/testRunner';
import { SystemGraph } from '../types/graph';

// Architecture patterns to try for solution generation
const SOLUTION_PATTERNS = {
  basic: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 2 } },
      { type: 'postgresql', config: { readCapacity: 2000, writeCapacity: 1000 } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'postgresql' },
    ],
  },
  withCache: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 5 } },
      { type: 'redis', config: { memorySizeGB: 32 } },
      { type: 'postgresql', config: { readCapacity: 10000, writeCapacity: 2000 } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'redis' },
      { from: 'app_server', to: 'postgresql' },
    ],
  },
  highTraffic: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 20 } },
      { type: 'redis', config: { memorySizeGB: 128 } },
      { type: 'postgresql', config: { readCapacity: 50000, writeCapacity: 10000 } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'redis' },
      { from: 'app_server', to: 'postgresql' },
    ],
  },
  withQueue: {
    components: [
      { type: 'client', config: {} },
      { type: 'load_balancer', config: {} },
      { type: 'app_server', config: { instances: 10 } },
      { type: 'redis', config: { memorySizeGB: 64 } },
      { type: 'message_queue', config: { maxThroughput: 100000 } },
      { type: 'postgresql', config: { readCapacity: 20000, writeCapacity: 5000 } },
    ],
    connections: [
      { from: 'client', to: 'load_balancer' },
      { from: 'load_balancer', to: 'app_server' },
      { from: 'app_server', to: 'redis' },
      { from: 'app_server', to: 'message_queue' },
      { from: 'app_server', to: 'postgresql' },
    ],
  },
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
 * Convert pattern to SystemGraph for simulation
 */
function patternToGraph(pattern: typeof SOLUTION_PATTERNS.basic): SystemGraph {
  const nodes: SystemGraph['nodes'] = [];
  const edges: SystemGraph['edges'] = [];

  pattern.components.forEach((comp, index) => {
    nodes.push({
      id: `${comp.type}_${index}`,
      type: comp.type,
      position: { x: index * 200, y: 100 },
      config: comp.config,
    });
  });

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

  return { nodes, edges };
}

/**
 * Generate explanation for solution
 */
function generateExplanation(pattern: typeof SOLUTION_PATTERNS.basic, challenge: Challenge): string {
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

  return `# Solution for ${challenge.title}

## Architecture Components
${componentList}

## Data Flow
${flowDescription}

## Requirements Met
- Traffic: ${challenge.requirements.traffic}
- Latency: ${challenge.requirements.latency}
- Availability: ${challenge.requirements.availability}

## Key Design Decisions
1. Load balancer distributes traffic evenly
2. Multiple app server instances for horizontal scaling
3. Cache layer reduces database load
4. Database sized for peak traffic requirements`;
}

/**
 * Auto-generate solution for a challenge by testing patterns
 */
export function generateSolutionForChallenge(challenge: Challenge): Solution | null {
  // Skip if already has solution
  if (challenge.solution) {
    return challenge.solution;
  }

  // Skip if no test cases
  if (!challenge.testCases || challenge.testCases.length === 0) {
    return null;
  }

  const testRunner = new TestRunner();
  const patterns = Object.entries(SOLUTION_PATTERNS);

  // Try each pattern from simplest to most complex
  for (const [, pattern] of patterns) {
    try {
      const graph = patternToGraph(pattern);
      const results = testRunner.runAllTestCases(graph, challenge.testCases);
      const allPassed = results.every(r => r.passed);

      if (allPassed) {
        return {
          components: pattern.components,
          connections: pattern.connections,
          explanation: generateExplanation(pattern, challenge),
        };
      }
    } catch {
      // Pattern failed, try next
      continue;
    }
  }

  return null;
}

/**
 * Add Python template to challenge
 *
 * All challenges now use Tier 1 approach (write Python code)
 */
export function addPythonTemplate(challenge: Challenge): Challenge {
  // If challenge already has a pythonTemplate, keep it (don't overwrite)
  if (challenge.pythonTemplate) {
    return challenge;
  }

  // Generate Python template based on challenge type
  const pythonTemplate = generatePythonTemplate(challenge);

  // Detect required APIs for this challenge
  const requiredAPIs = detectRequiredAPIs(challenge);

  return {
    ...challenge,
    pythonTemplate,
    requiredAPIs,
  };
}

/**
 * Add solution to challenge (auto-generate if not present)
 */
export function addSolution(challenge: Challenge): Challenge {
  if (challenge.solution) {
    return challenge;
  }

  const solution = generateSolutionForChallenge(challenge);
  if (solution) {
    return { ...challenge, solution };
  }

  return challenge;
}

/**
 * Add Python templates and solutions to all challenges
 */
export function migrateAllChallenges(challenges: Challenge[]): Challenge[] {
  return challenges.map(challenge => {
    const withTemplate = addPythonTemplate(challenge);
    const withSolution = addSolution(withTemplate);
    return withSolution;
  });
}
