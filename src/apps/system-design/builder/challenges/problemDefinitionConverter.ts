import { ProblemDefinition } from '../types/problemDefinition';
import { Challenge, TestCase } from '../types/testCase';

/**
 * Converts a ProblemDefinition to a Challenge
 */
export function convertProblemDefinitionToChallenge(
  def: ProblemDefinition
): Challenge {
  // Determine difficulty based on requirements complexity
  const difficulty = determineDifficulty(def);

  // Convert scenarios to test cases
  const testCases: TestCase[] = def.scenarios.map((scenario, index) => {
    const isReadHeavy = (scenario.traffic.readWriteRatio || 0.5) >= 0.7;
    const trafficType =
      !scenario.traffic.readWriteRatio || scenario.traffic.readWriteRatio === 0.5
        ? 'mixed'
        : isReadHeavy
        ? 'read'
        : 'write';

    return {
      name: scenario.name,
      type: 'functional',
      requirement: `FR-${index + 1}`,
      description: scenario.description || scenario.name,
      traffic: {
        type: trafficType as 'read' | 'write' | 'mixed',
        rps: scenario.traffic.rps,
        readRatio: scenario.traffic.readWriteRatio || 0.5,
        avgResponseSizeMB: scenario.traffic.avgFileSize,
      },
      duration: 10,
      passCriteria: {
        maxP99Latency: scenario.passCriteria.maxLatency,
        maxErrorRate: scenario.passCriteria.maxErrorRate,
        maxMonthlyCost: scenario.passCriteria.maxCost,
        minAvailability: scenario.passCriteria.availability,
        maxDowntime: scenario.passCriteria.maxDowntime,
      },
    };
  });

  // Extract functional requirements as strings
  const functionalReqs = def.functionalRequirements.mustHave.map(
    (req) => req.reason
  );

  // Determine available components based on requirements
  const availableComponents = determineAvailableComponents(def);

  // Create learning objectives
  const learningObjectives = createLearningObjectives(def);

  return {
    id: def.id,
    title: def.title,
    difficulty,
    description: def.description,
    requirements: {
      functional: functionalReqs,
      traffic: formatTrafficRequirement(def.scenarios[0]),
      latency: formatLatencyRequirement(def.scenarios[0]),
      availability: formatAvailabilityRequirement(def.scenarios[0]),
      budget: 'Optimize for cost efficiency',
    },
    availableComponents,
    testCases,
    learningObjectives,
  };
}

function determineDifficulty(
  def: ProblemDefinition
): 'beginner' | 'intermediate' | 'advanced' {
  const componentCount = def.functionalRequirements.mustHave.length;
  const connectionCount = def.functionalRequirements.mustConnect.length;

  // Simple heuristic based on complexity
  if (componentCount <= 2 && connectionCount <= 2) {
    return 'beginner';
  } else if (componentCount <= 3 && connectionCount <= 4) {
    return 'intermediate';
  } else {
    return 'advanced';
  }
}

function determineAvailableComponents(def: ProblemDefinition): string[] {
  const baseComponents = [
    'load_balancer',
    'app_server',
    'postgresql',
    'mongodb',
    'cassandra',
    'redis',
    'message_queue',
    'cdn',
    's3',
  ];

  // Add specific components based on requirements
  const required: string[] = [];
  def.functionalRequirements.mustHave.forEach((req) => {
    switch (req.type) {
      case 'compute':
        required.push('app_server');
        break;
      case 'storage':
        required.push('postgresql', 'mongodb', 'cassandra');
        break;
      case 'cache':
        required.push('redis');
        break;
      case 'load_balancer':
        required.push('load_balancer');
        break;
      case 'message_queue':
        required.push('message_queue');
        break;
      case 'object_storage':
        required.push('s3');
        break;
      case 'cdn':
        required.push('cdn');
        break;
      case 'realtime_messaging':
        required.push('redis', 'message_queue');
        break;
    }
  });

  // Deduplicate using an object as a set
  const allComponents = baseComponents.concat(required);
  const uniqueMap: { [key: string]: boolean } = {};
  allComponents.forEach((comp) => {
    uniqueMap[comp] = true;
  });
  return Object.keys(uniqueMap);
}

function createLearningObjectives(def: ProblemDefinition): string[] {
  const objectives: string[] = [];

  // Add objectives based on required components
  const componentTypesMap: { [key: string]: boolean } = {};
  def.functionalRequirements.mustHave.forEach((req) => {
    componentTypesMap[req.type] = true;
  });

  if (componentTypesMap['compute']) {
    objectives.push('Understand client-server architecture');
  }
  if (componentTypesMap['storage']) {
    objectives.push('Learn database connectivity and data persistence');
  }
  if (componentTypesMap['cache']) {
    objectives.push('Understand caching strategies for performance');
  }
  if (componentTypesMap['load_balancer']) {
    objectives.push('Learn horizontal scaling with load balancers');
  }
  if (componentTypesMap['message_queue']) {
    objectives.push('Understand asynchronous processing patterns');
  }
  if (componentTypesMap['object_storage']) {
    objectives.push('Learn blob storage for large files');
  }
  if (componentTypesMap['cdn']) {
    objectives.push('Understand content delivery networks');
  }

  // Add data modeling objective if defined
  if (def.functionalRequirements.dataModel) {
    objectives.push('Design appropriate data models');
  }

  return objectives;
}

function formatTrafficRequirement(scenario: any): string {
  const rps = scenario.traffic.rps;
  const readWriteRatio = scenario.traffic.readWriteRatio || 0.5;
  const readPercent = Math.round(readWriteRatio * 100);
  const writePercent = 100 - readPercent;

  return `${rps} RPS (${readPercent}% reads, ${writePercent}% writes)`;
}

function formatLatencyRequirement(scenario: any): string {
  const maxLatency = scenario.passCriteria.maxLatency;
  if (!maxLatency) return 'Optimize for low latency';
  if (maxLatency >= 1000) return `p99 < ${maxLatency / 1000}s`;
  return `p99 < ${maxLatency}ms`;
}

function formatAvailabilityRequirement(scenario: any): string {
  const availability = scenario.passCriteria.availability;
  if (!availability) return 'Best effort availability';
  const percent = (availability * 100).toFixed(1);
  return `${percent}% uptime`;
}
