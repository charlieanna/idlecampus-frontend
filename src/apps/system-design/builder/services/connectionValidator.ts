/**
 * Connection Validator
 *
 * Validates that Python code API calls match canvas component connections
 * If code uses context.cache.get(), app_server must be connected to a cache component
 */

import { SystemGraph } from '../types/graph';

/**
 * API types that can be used in Python code
 */
export type APIType = 'db' | 'cache' | 'queue' | 'cdn' | 'search';

/**
 * Map API types to component types
 */
const API_TO_COMPONENT_TYPE: Record<APIType, string[]> = {
  db: ['database', 'postgresql', 'mongodb', 'dynamodb', 'cassandra'],
  cache: ['cache', 'redis', 'memcached'],
  queue: ['message_queue', 'kafka', 'rabbitmq', 'sqs'],
  cdn: ['cdn', 'cloudfront', 'akamai'],
  search: ['search', 'elasticsearch', 'opensearch'],
};

/**
 * Validation error for connection mismatch
 */
export interface ConnectionValidationError {
  apiType: APIType;
  message: string;
  suggestion: string;
}

/**
 * Validation result
 */
export interface ConnectionValidationResult {
  valid: boolean;
  errors: ConnectionValidationError[];
  usedAPIs: APIType[];
  connectedAPIs: APIType[];
}

/**
 * Detect API usage in Python code
 *
 * Looks for patterns like:
 * - context.db.get(...)
 * - context.cache.set(...)
 * - context.queue.publish(...)
 * etc.
 */
export function detectAPIUsage(pythonCode: string): APIType[] {
  const apis: Set<APIType> = new Set();

  // Check for each API type
  if (/context\.db\./i.test(pythonCode)) {
    apis.add('db');
  }
  if (/context\.cache\./i.test(pythonCode)) {
    apis.add('cache');
  }
  if (/context\.queue\./i.test(pythonCode)) {
    apis.add('queue');
  }
  if (/context\.cdn\./i.test(pythonCode)) {
    apis.add('cdn');
  }
  if (/context\.search\./i.test(pythonCode)) {
    apis.add('search');
  }

  return Array.from(apis);
}

/**
 * Get connected component types from app_server
 */
export function getConnectedComponents(systemGraph: SystemGraph): string[] {
  // Find app_server component
  const appServer = systemGraph.components.find(c => c.type === 'app_server');
  if (!appServer) {
    return [];
  }

  // Find all components connected FROM app_server
  const connectedComponentIds = systemGraph.connections
    .filter(conn => conn.from === appServer.id)
    .map(conn => conn.to);

  // Get component types
  const connectedTypes = systemGraph.components
    .filter(comp => connectedComponentIds.includes(comp.id))
    .map(comp => comp.type);

  return connectedTypes;
}

/**
 * Map component types to API types
 */
export function componentTypesToAPIs(componentTypes: string[]): APIType[] {
  const apis: Set<APIType> = new Set();

  for (const componentType of componentTypes) {
    for (const [apiType, validTypes] of Object.entries(API_TO_COMPONENT_TYPE)) {
      if (validTypes.includes(componentType)) {
        apis.add(apiType as APIType);
      }
    }
  }

  return Array.from(apis);
}

/**
 * Validate that Python code API calls match canvas connections
 *
 * Returns validation errors if:
 * - Code uses context.cache but no cache component connected
 * - Code uses context.db but no database component connected
 * etc.
 */
export function validateConnections(
  pythonCode: string,
  systemGraph: SystemGraph
): ConnectionValidationResult {
  const usedAPIs = detectAPIUsage(pythonCode);
  const connectedTypes = getConnectedComponents(systemGraph);
  const connectedAPIs = componentTypesToAPIs(connectedTypes);

  const errors: ConnectionValidationError[] = [];

  // Check each used API
  for (const apiType of usedAPIs) {
    if (!connectedAPIs.includes(apiType)) {
      const validComponentTypes = API_TO_COMPONENT_TYPE[apiType];
      const componentTypeLabel = validComponentTypes.join(' or ');

      errors.push({
        apiType,
        message: `Code uses context.${apiType} but app_server is not connected to a ${apiType} component`,
        suggestion: `Add a ${componentTypeLabel} component and connect it to app_server`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    usedAPIs,
    connectedAPIs,
  };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ConnectionValidationError[]): string {
  if (errors.length === 0) {
    return '';
  }

  const lines = [
    '❌ Connection Validation Errors:',
    '',
    ...errors.map((error, index) => {
      return `${index + 1}. ${error.message}\n   💡 ${error.suggestion}`;
    }),
  ];

  return lines.join('\n');
}
