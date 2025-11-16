/**
 * API Routing Utilities
 *
 * Handles API pattern matching and routing logic for microservices architecture
 */

import { ComponentNode } from '../types/component';

/**
 * Parse an API pattern string into method and path
 * Examples:
 * - "GET /api/v1/urls/*" -> { method: "GET", path: "/api/v1/urls/*" }
 * - "* /api/v1/stats/*" -> { method: "*", path: "/api/v1/stats/*" }
 * - "/api/v1/urls" -> { method: "*", path: "/api/v1/urls" } (default to all methods)
 */
export function parseAPIPattern(pattern: string): { method: string; path: string } {
  const parts = pattern.trim().split(/\s+/);

  if (parts.length === 1) {
    // No method specified, assume all methods
    return { method: '*', path: parts[0] };
  }

  if (parts.length === 2) {
    return { method: parts[0].toUpperCase(), path: parts[1] };
  }

  // Handle multiple methods like "GET,POST /api/v1/users/*"
  if (parts[0].includes(',')) {
    return { method: parts[0].toUpperCase(), path: parts[1] };
  }

  // Invalid pattern
  console.warn(`Invalid API pattern: ${pattern}`);
  return { method: '*', path: pattern };
}

/**
 * Check if a request matches an API pattern
 * @param requestMethod - HTTP method of the request
 * @param requestPath - Path of the request
 * @param pattern - API pattern to match against
 */
export function matchesAPIPattern(
  requestMethod: string,
  requestPath: string,
  pattern: string
): boolean {
  const { method: patternMethod, path: patternPath } = parseAPIPattern(pattern);

  // Check method match
  if (patternMethod !== '*') {
    if (patternMethod.includes(',')) {
      // Multiple methods specified
      const methods = patternMethod.split(',').map(m => m.trim());
      if (!methods.includes(requestMethod.toUpperCase())) {
        return false;
      }
    } else if (patternMethod !== requestMethod.toUpperCase()) {
      return false;
    }
  }

  // Check path match
  return matchesPath(requestPath, patternPath);
}

/**
 * Check if a request path matches a pattern path
 * Supports wildcards (*) and path parameters (:param)
 */
export function matchesPath(requestPath: string, patternPath: string): boolean {
  // Exact match
  if (requestPath === patternPath) {
    return true;
  }

  // Convert pattern to regex
  let regexPattern = patternPath
    // Escape special regex characters except * and :
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    // Replace * with .* (match any characters)
    .replace(/\*/g, '.*')
    // Replace :param with [^/]+ (match path parameters)
    .replace(/:(\w+)/g, '[^/]+');

  // Add start and end anchors
  regexPattern = '^' + regexPattern + '$';

  const regex = new RegExp(regexPattern);
  return regex.test(requestPath);
}

/**
 * Find all app servers that can handle a specific request
 */
export function findHandlingServers(
  components: ComponentNode[],
  requestMethod: string,
  requestPath: string
): ComponentNode[] {
  return components.filter(component => {
    // Only app servers can handle APIs
    if (component.type !== 'app_server') {
      return false;
    }

    const config = component.config;

    // If no APIs specified, this server handles everything (backward compatibility)
    if (!config.handledAPIs || config.handledAPIs.length === 0) {
      // But only if it doesn't have a serviceName (which implies it's specialized)
      return !config.serviceName;
    }

    // Check if any of the handled APIs match the request
    return config.handledAPIs.some((pattern: string) =>
      matchesAPIPattern(requestMethod, requestPath, pattern)
    );
  });
}

/**
 * Get a display-friendly name for an app server
 */
export function getServerDisplayName(component: ComponentNode): string {
  if (component.config.serviceName) {
    return component.config.serviceName;
  }

  // Try to infer from handled APIs
  const apis = component.config.handledAPIs;
  if (apis && apis.length > 0) {
    // Extract common path prefix
    const firstAPI = parseAPIPattern(apis[0]);
    const pathParts = firstAPI.path.split('/').filter(p => p && !p.includes('*'));
    if (pathParts.length > 0) {
      return `${pathParts[pathParts.length - 1]}-service`;
    }
  }

  return 'app-server';
}

/**
 * Generate a color for a service based on its name/type
 * Used for visual differentiation in the UI
 */
export function getServiceColor(serviceName: string): string {
  const colors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
  ];

  // Use a simple hash to consistently assign colors
  let hash = 0;
  for (let i = 0; i < serviceName.length; i++) {
    hash = serviceName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Format API routes for display
 */
export function formatAPIRoute(pattern: string): string {
  const { method, path } = parseAPIPattern(pattern);

  if (method === '*') {
    return path;
  }

  return `${method} ${path}`;
}

/**
 * Common API patterns for quick selection
 */
export const COMMON_API_PATTERNS = {
  reads: [
    'GET /api/v1/*',
    'GET /api/*',
    'HEAD /api/*',
  ],
  writes: [
    'POST /api/v1/*',
    'PUT /api/v1/*',
    'DELETE /api/v1/*',
    'PATCH /api/v1/*',
  ],
  specific: {
    urls: [
      'GET /api/v1/urls/*',
      'POST /api/v1/urls',
      'PUT /api/v1/urls/*',
      'DELETE /api/v1/urls/*',
    ],
    users: [
      'GET /api/v1/users/*',
      'POST /api/v1/users',
      'PUT /api/v1/users/*',
      'DELETE /api/v1/users/*',
    ],
    stats: [
      '* /api/v1/stats/*',
      '* /api/v1/analytics/*',
    ],
    auth: [
      'POST /api/v1/auth/login',
      'POST /api/v1/auth/logout',
      'POST /api/v1/auth/register',
      'GET /api/v1/auth/verify',
    ],
  },
};

/**
 * Validate API pattern syntax
 */
export function validateAPIPattern(pattern: string): { valid: boolean; error?: string } {
  if (!pattern || pattern.trim().length === 0) {
    return { valid: false, error: 'Pattern cannot be empty' };
  }

  const { method, path } = parseAPIPattern(pattern);

  // Validate method
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS', '*'];
  if (method !== '*' && !method.includes(',')) {
    if (!validMethods.includes(method)) {
      return { valid: false, error: `Invalid HTTP method: ${method}` };
    }
  } else if (method.includes(',')) {
    const methods = method.split(',').map(m => m.trim());
    for (const m of methods) {
      if (!validMethods.includes(m)) {
        return { valid: false, error: `Invalid HTTP method: ${m}` };
      }
    }
  }

  // Validate path
  if (!path.startsWith('/')) {
    return { valid: false, error: 'Path must start with /' };
  }

  return { valid: true };
}