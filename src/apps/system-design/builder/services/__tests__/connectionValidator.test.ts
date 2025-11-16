/**
 * Unit Tests for Connection Validator
 *
 * Tests all validation logic for Python code API usage and canvas connections
 */

import { describe, it, expect } from 'vitest';
import {
  detectAPIUsage,
  getConnectedComponents,
  componentTypesToAPIs,
  validateConnections,
  formatValidationErrors,
  APIType,
} from '../connectionValidator';
import { SystemGraph } from '../../types/graph';

describe('Connection Validator', () => {
  describe('detectAPIUsage', () => {
    it('should detect single API usage', () => {
      const code = `
def shorten(url: str, context) -> str:
    context.db.set(key, value)
    return code
`;
      const apis = detectAPIUsage(code);
      expect(apis).toEqual(['db']);
    });

    it('should detect multiple API usages', () => {
      const code = `
def shorten(url: str, context) -> str:
    cached = context.cache.get(url)
    if not cached:
        code = generate()
        context.db.set(code, url)
        context.cache.set(url, code, ttl=3600)
    return cached or code
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
      expect(apis).toHaveLength(2);
    });

    it('should detect all API types', () => {
      const code = `
context.db.get(key)
context.cache.set(key, val)
context.queue.publish(msg)
context.cdn.cache(url)
context.search.query(term)
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
      expect(apis).toContain('queue');
      expect(apis).toContain('cdn');
      expect(apis).toContain('search');
      expect(apis).toHaveLength(5);
    });

    it('should handle empty code', () => {
      const apis = detectAPIUsage('');
      expect(apis).toEqual([]);
    });

    it('should handle code with no API usage', () => {
      const code = `
def shorten(url: str, context) -> str:
    # TODO: implement
    pass
`;
      const apis = detectAPIUsage(code);
      expect(apis).toEqual([]);
    });

    it('should detect API usage in comments (intentional)', () => {
      const code = `
# Use context.db.get() to fetch data
def expand(code: str, context) -> str:
    context.db.get(code)
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
    });

    it('should be case insensitive', () => {
      const code = `CONTEXT.DB.GET(key)`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
    });

    it('should not duplicate APIs used multiple times', () => {
      const code = `
context.db.set(k1, v1)
context.db.set(k2, v2)
context.db.get(k1)
`;
      const apis = detectAPIUsage(code);
      expect(apis).toEqual(['db']);
    });
  });

  describe('getConnectedComponents', () => {
    it('should return empty array when no app_server', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'client', type: 'client', config: {} },
        ],
        connections: [],
      };
      const connected = getConnectedComponents(graph);
      expect(connected).toEqual([]);
    });

    it('should return empty array when app_server has no connections', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'client', type: 'client', config: {} },
          { id: 'app_server', type: 'app_server', config: {} },
        ],
        connections: [],
      };
      const connected = getConnectedComponents(graph);
      expect(connected).toEqual([]);
    });

    it('should return connected component types', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
          { id: 'cache1', type: 'redis', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db1' },
          { from: 'app_server', to: 'cache1' },
        ],
      };
      const connected = getConnectedComponents(graph);
      expect(connected).toContain('database');
      expect(connected).toContain('redis');
      expect(connected).toHaveLength(2);
    });

    it('should only include components FROM app_server', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'client', type: 'client', config: {} },
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [
          { from: 'client', to: 'app_server' },
          { from: 'app_server', to: 'db1' },
          { from: 'db1', to: 'app_server' }, // Reverse connection - ignored
        ],
      };
      const connected = getConnectedComponents(graph);
      expect(connected).toEqual(['database']);
    });

    it('should handle multiple connections to same type', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'postgresql', config: {} },
          { id: 'db2', type: 'mongodb', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db1' },
          { from: 'app_server', to: 'db2' },
        ],
      };
      const connected = getConnectedComponents(graph);
      expect(connected).toContain('postgresql');
      expect(connected).toContain('mongodb');
      expect(connected).toHaveLength(2);
    });
  });

  describe('componentTypesToAPIs', () => {
    it('should map database types to db API', () => {
      const types = ['database', 'postgresql', 'mongodb'];
      const apis = componentTypesToAPIs(types);
      expect(apis).toContain('db');
    });

    it('should map cache types to cache API', () => {
      const types = ['cache', 'redis', 'memcached'];
      const apis = componentTypesToAPIs(types);
      expect(apis).toContain('cache');
    });

    it('should map queue types to queue API', () => {
      const types = ['message_queue', 'kafka', 'rabbitmq'];
      const apis = componentTypesToAPIs(types);
      expect(apis).toContain('queue');
    });

    it('should map CDN types to cdn API', () => {
      const types = ['cdn', 'cloudfront'];
      const apis = componentTypesToAPIs(types);
      expect(apis).toContain('cdn');
    });

    it('should map search types to search API', () => {
      const types = ['search', 'elasticsearch'];
      const apis = componentTypesToAPIs(types);
      expect(apis).toContain('search');
    });

    it('should handle mixed component types', () => {
      const types = ['database', 'redis', 'kafka'];
      const apis = componentTypesToAPIs(types);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
      expect(apis).toContain('queue');
      expect(apis).toHaveLength(3);
    });

    it('should ignore unknown component types', () => {
      const types = ['load_balancer', 'api_gateway', 'unknown'];
      const apis = componentTypesToAPIs(types);
      expect(apis).toEqual([]);
    });

    it('should not duplicate APIs from multiple component types', () => {
      const types = ['database', 'postgresql', 'mongodb']; // All map to 'db'
      const apis = componentTypesToAPIs(types);
      expect(apis).toEqual(['db']);
    });
  });

  describe('validateConnections', () => {
    it('should pass when no APIs are used', () => {
      const code = `
def shorten(url: str, context) -> str:
    return "abc123"
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
        ],
        connections: [],
      };
      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass when all APIs have connections', () => {
      const code = `
context.db.set(key, val)
context.cache.get(key)
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
          { id: 'cache1', type: 'redis', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db1' },
          { from: 'app_server', to: 'cache1' },
        ],
      };
      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail when API used but no connection', () => {
      const code = `context.db.get(key)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
        ],
        connections: [],
      };
      const result = validateConnections(code, graph);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].apiType).toBe('db');
    });

    it('should report all missing connections', () => {
      const code = `
context.db.get(key)
context.cache.get(key)
context.queue.publish(msg)
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
        ],
        connections: [],
      };
      const result = validateConnections(code, graph);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors.map(e => e.apiType)).toContain('db');
      expect(result.errors.map(e => e.apiType)).toContain('cache');
      expect(result.errors.map(e => e.apiType)).toContain('queue');
    });

    it('should report partial missing connections', () => {
      const code = `
context.db.get(key)
context.cache.get(key)
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db1' },
        ],
      };
      const result = validateConnections(code, graph);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].apiType).toBe('cache');
    });

    it('should include helpful error messages', () => {
      const code = `context.cache.set(key, val)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
        ],
        connections: [],
      };
      const result = validateConnections(code, graph);
      expect(result.errors[0].message).toContain('context.cache');
      expect(result.errors[0].message).toContain('not connected');
      expect(result.errors[0].suggestion).toContain('Add a');
      expect(result.errors[0].suggestion).toContain('cache');
    });

    it('should return used and connected APIs', () => {
      const code = `
context.db.get(key)
context.cache.get(key)
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db1' },
        ],
      };
      const result = validateConnections(code, graph);
      expect(result.usedAPIs).toContain('db');
      expect(result.usedAPIs).toContain('cache');
      expect(result.connectedAPIs).toContain('db');
      expect(result.connectedAPIs).not.toContain('cache');
    });
  });

  describe('formatValidationErrors', () => {
    it('should return empty string when no errors', () => {
      const formatted = formatValidationErrors([]);
      expect(formatted).toBe('');
    });

    it('should format single error', () => {
      const errors = [
        {
          apiType: 'cache' as APIType,
          message: 'Code uses context.cache but no connection',
          suggestion: 'Add a cache component',
        },
      ];
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('❌ Connection Validation Errors');
      expect(formatted).toContain('1. Code uses context.cache');
      expect(formatted).toContain('💡 Add a cache component');
    });

    it('should format multiple errors with numbering', () => {
      const errors = [
        {
          apiType: 'cache' as APIType,
          message: 'Error 1',
          suggestion: 'Suggestion 1',
        },
        {
          apiType: 'queue' as APIType,
          message: 'Error 2',
          suggestion: 'Suggestion 2',
        },
      ];
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('1. Error 1');
      expect(formatted).toContain('2. Error 2');
      expect(formatted).toContain('💡 Suggestion 1');
      expect(formatted).toContain('💡 Suggestion 2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed Python code', () => {
      const code = `
def incomplete(
    context.db.get(
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db'); // Still detects the pattern
    });

    it('should handle very long code', () => {
      const longCode = 'context.db.get(key)\n'.repeat(10000);
      const apis = detectAPIUsage(longCode);
      expect(apis).toEqual(['db']);
    });

    it('should handle unicode and special characters', () => {
      const code = `
# 你好 context.db.get()
context.cache.set("🔑", "💾")
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('cache');
    });

    it('should handle null/undefined gracefully', () => {
      expect(() => detectAPIUsage(null as any)).not.toThrow();
      expect(() => detectAPIUsage(undefined as any)).not.toThrow();
    });

    it('should handle graph without app_server gracefully', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(false);
    });

    it('should handle circular connections', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db1' },
          { from: 'db1', to: 'app_server' },
        ],
      };
      const connected = getConnectedComponents(graph);
      expect(connected).toEqual(['database']);
    });

    it('should handle self-connections', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'app_server' },
        ],
      };
      const connected = getConnectedComponents(graph);
      expect(connected).toEqual(['app_server']);
    });
  });
});
