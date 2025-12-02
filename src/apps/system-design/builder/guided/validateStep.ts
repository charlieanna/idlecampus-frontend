import { SystemGraph } from '../types/graph';
import { GuidedStep, StepValidationResult } from '../types/guidedTutorial';

/**
 * Component type normalizations for flexible matching
 */
const TYPE_NORMALIZATIONS: Record<string, string[]> = {
  'compute': ['compute', 'app_server'],
  'app_server': ['compute', 'app_server'],
  'storage': ['storage', 'postgresql', 'mysql', 'mongodb', 'database', 'cassandra', 'dynamodb', 'couchdb', 'hbase'],
  'postgresql': ['storage', 'postgresql', 'database'],
  'mysql': ['storage', 'mysql', 'database'],
  'mongodb': ['storage', 'mongodb', 'database'],
  'database': ['storage', 'postgresql', 'mysql', 'mongodb', 'database', 'cassandra', 'dynamodb'],
  'cache': ['cache', 'redis', 'memcached', 'elasticache'],
  'redis': ['cache', 'redis'],
  'object_storage': ['object_storage', 's3'],
  's3': ['object_storage', 's3'],
  'cdn': ['cdn'],
  'load_balancer': ['load_balancer'],
  'message_queue': ['message_queue', 'kafka', 'sqs', 'rabbitmq'],
  'realtime_messaging': ['realtime_messaging', 'websocket'],
};

/**
 * Get all acceptable types for a given required type
 */
function getAcceptableTypes(requiredType: string): string[] {
  return TYPE_NORMALIZATIONS[requiredType] || [requiredType];
}

/**
 * Check if a component type matches a required type
 */
function typeMatches(actualType: string, requiredType: string): boolean {
  const acceptableTypes = getAcceptableTypes(requiredType);
  return acceptableTypes.includes(actualType);
}

/**
 * Get display name for a component type
 */
function getDisplayName(type: string): string {
  const displayNames: Record<string, string> = {
    'compute': 'App Server',
    'app_server': 'App Server',
    'storage': 'Database',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
    'mongodb': 'MongoDB',
    'database': 'Database',
    'cache': 'Cache',
    'redis': 'Redis',
    'object_storage': 'Object Storage',
    's3': 'S3',
    'cdn': 'CDN',
    'load_balancer': 'Load Balancer',
    'message_queue': 'Message Queue',
    'realtime_messaging': 'Real-time Messaging',
    'client': 'Client',
  };
  return displayNames[type] || type;
}

/**
 * Find components on canvas that match a required type
 */
function findMatchingComponents(graph: SystemGraph, requiredType: string): string[] {
  return graph.components
    .filter(comp => typeMatches(comp.type, requiredType))
    .map(comp => comp.id);
}

/**
 * Check if a required connection exists on the canvas
 */
function connectionExists(
  graph: SystemGraph,
  fromType: string,
  toType: string
): boolean {
  // Find all components matching the from and to types
  const fromComponents = fromType === 'client'
    ? graph.components.filter(c => c.type === 'client').map(c => c.id)
    : findMatchingComponents(graph, fromType);

  const toComponents = findMatchingComponents(graph, toType);

  // Check if any connection exists between matching components
  return graph.connections.some(conn =>
    fromComponents.includes(conn.from) && toComponents.includes(conn.to)
  );
}

/**
 * Validate the current step against the user's canvas
 */
export function validateStep(
  step: GuidedStep,
  graph: SystemGraph
): StepValidationResult {
  const missingComponents: string[] = [];
  const missingConnections: Array<{ from: string; to: string }> = [];
  const suggestions: string[] = [];

  // Check required components
  for (const requiredType of step.validation.requiredComponents) {
    const matching = findMatchingComponents(graph, requiredType);
    if (matching.length === 0) {
      missingComponents.push(requiredType);
    }
  }

  // Check required connections
  for (const conn of step.validation.requiredConnections) {
    if (!connectionExists(graph, conn.fromType, conn.toType)) {
      missingConnections.push({
        from: conn.fromType,
        to: conn.toType,
      });
    }
  }

  // Generate feedback
  const passed = missingComponents.length === 0 && missingConnections.length === 0;
  let feedback = '';

  if (passed) {
    feedback = 'Great job! Your design satisfies this requirement. Moving to the next step...';
  } else {
    const issues: string[] = [];

    if (missingComponents.length > 0) {
      const componentNames = missingComponents.map(getDisplayName).join(', ');
      issues.push(`Missing components: ${componentNames}`);
      suggestions.push(`Add the following component(s): ${componentNames}`);
    }

    if (missingConnections.length > 0) {
      const connectionDescs = missingConnections
        .map(c => `${getDisplayName(c.from)} → ${getDisplayName(c.to)}`)
        .join(', ');
      issues.push(`Missing connections: ${connectionDescs}`);
      suggestions.push(`Connect: ${connectionDescs}`);
    }

    feedback = issues.join('. ');
  }

  return {
    passed,
    missingComponents,
    missingConnections,
    feedback,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Check if the tutorial is complete (all steps passed)
 */
export function isTutorialComplete(
  tutorial: { steps: GuidedStep[] },
  graph: SystemGraph
): boolean {
  // Validate the last step - if it passes, tutorial is complete
  const lastStep = tutorial.steps[tutorial.steps.length - 1];
  if (!lastStep) return false;

  const result = validateStep(lastStep, graph);
  return result.passed;
}

/**
 * Get progress percentage through the tutorial
 */
export function getTutorialProgress(
  completedSteps: number,
  totalSteps: number
): number {
  if (totalSteps === 0) return 0;
  return Math.round((completedSteps / totalSteps) * 100);
}

/**
 * Validate all steps up to and including the current step
 * Returns the first failing step index, or -1 if all pass
 */
export function findFirstFailingStep(
  steps: GuidedStep[],
  graph: SystemGraph,
  currentStepIndex: number
): number {
  for (let i = 0; i <= currentStepIndex; i++) {
    const result = validateStep(steps[i], graph);
    if (!result.passed) {
      return i;
    }
  }
  return -1;
}
