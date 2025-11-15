/**
 * Python Code Execution Failure Tests
 *
 * Tests for various Python code failures:
 * - Syntax errors
 * - Runtime errors
 * - Logic errors
 * - Import errors
 * - Infinite loops/timeouts
 */

import { describe, it, expect } from 'vitest';
import { validateConnections } from '../services/connectionValidator';
import { SystemGraph } from '../types/graph';

describe('Python Code Execution Failures', () => {
  const validGraph: SystemGraph = {
    components: [
      { id: 'app_server', type: 'app_server', config: {} },
      { id: 'db1', type: 'database', config: {} },
      { id: 'cache1', type: 'redis', config: {} },
      { id: 'queue1', type: 'kafka', config: {} },
    ],
    connections: [
      { from: 'app_server', to: 'db1' },
      { from: 'app_server', to: 'cache1' },
      { from: 'app_server', to: 'queue1' },
    ],
  };

  describe('Syntax Errors', () => {
    it('should still validate connections even with syntax errors', () => {
      const syntaxErrorCode = `
def shorten(url: str, context  # Missing closing parenthesis
    context.db.set(code, url
    return code  # Missing closing parenthesis
`;
      const result = validateConnections(syntaxErrorCode, validGraph);
      // Validation should still work - detects context.db
      expect(result.usedAPIs).toContain('db');
    });

    it('should handle unclosed strings', () => {
      const code = `
def expand(code: str, context) -> str:
    result = context.db.get("key that never closes
    return result
`;
      const result = validateConnections(code, validGraph);
      expect(result.usedAPIs).toContain('db');
    });

    it('should handle invalid indentation', () => {
      const code = `
def shorten():
context.db.set(k, v)  # Invalid indentation
    context.cache.get(k)
`;
      const result = validateConnections(code, validGraph);
      expect(result.usedAPIs).toContain('db');
      expect(result.usedAPIs).toContain('cache');
    });

    it('should handle mixed tabs and spaces', () => {
      const code = `
def shorten():
\tcontext.db.set(k, v)  # Tab
    context.cache.get(k)  # Spaces
\t    context.queue.publish(m)  # Mixed
`;
      const result = validateConnections(code, validGraph);
      expect(result.usedAPIs).toContain('db');
      expect(result.usedAPIs).toContain('cache');
      expect(result.usedAPIs).toContain('queue');
    });
  });

  describe('Runtime Errors', () => {
    it('should validate code that will have NameError', () => {
      const code = `
def shorten(url: str, context) -> str:
    code = generate_code(url)  # NameError: generate_code not defined
    context.db.set(code, url)
    return code
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
      expect(result.usedAPIs).toContain('db');
    });

    it('should validate code that will have TypeError', () => {
      const code = `
def shorten(url: str, context) -> str:
    code = url + 123  # TypeError: can't concatenate str and int
    context.db.set(code, url)
    return code
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });

    it('should validate code that will have AttributeError', () => {
      const code = `
def expand(code: str, context) -> str:
    url = context.db.get(code)
    return url.non_existent_method()  # AttributeError
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });

    it('should validate code that will have KeyError', () => {
      const code = `
def expand(code: str, context) -> str:
    mapping = {"abc": "url1"}
    context.db.set("map", mapping)
    return mapping["xyz"]  # KeyError
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });

    it('should validate code that will have IndexError', () => {
      const code = `
def shorten(url: str, context) -> str:
    codes = ["abc", "def"]
    context.db.set("codes", codes)
    return codes[10]  # IndexError
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });

    it('should validate code that will have ZeroDivisionError', () => {
      const code = `
def shorten(url: str, context) -> str:
    score = len(url) / 0  # ZeroDivisionError
    context.db.set("score", score)
    return "abc"
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Logic Errors (Valid but Wrong)', () => {
    it('should validate code that returns wrong value', () => {
      const code = `
def shorten(url: str, context) -> str:
    # Wrong: Always returns same code
    context.db.set("abc123", url)
    return "abc123"
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
      expect(result.usedAPIs).toContain('db');
    });

    it('should validate code that has infinite loop', () => {
      const code = `
def shorten(url: str, context) -> str:
    while True:  # Infinite loop
        context.db.set("key", "value")
    return "never_reached"
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });

    it('should validate code that uses wrong API method', () => {
      const code = `
def expand(code: str, context) -> str:
    # Wrong: Using set instead of get
    context.db.set(code, "something")
    return "wrong"
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });

    it('should validate code with race conditions', () => {
      const code = `
def shorten(url: str, context) -> str:
    # Race condition: no locking
    count = context.db.get("counter") or 0
    count += 1
    context.db.set("counter", count)
    return f"url_{count}"
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Import Errors', () => {
    it('should validate code with non-existent imports', () => {
      const code = `
import non_existent_module  # ImportError

def shorten(url: str, context) -> str:
    context.db.set("key", "value")
    return "abc"
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });

    it('should validate code with wrong import syntax', () => {
      const code = `
from hashlib import md5, sha256, non_existent  # ImportError

def shorten(url: str, context) -> str:
    context.db.set("key", md5(url.encode()).hexdigest())
    return "abc"
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Missing API Usage', () => {
    it('should detect when code does not use context APIs at all', () => {
      const code = `
def shorten(url: str, context) -> str:
    # Student forgot to use context APIs!
    my_dict = {}
    my_dict["abc"] = url
    return "abc"
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true); // Valid because no APIs required
      expect(result.usedAPIs).toEqual([]);
    });

    it('should detect when code uses local storage instead of context', () => {
      const code = `
storage = {}  # Local dict instead of context.db

def shorten(url: str, context) -> str:
    code = "abc123"
    storage[code] = url  # Wrong: using local storage
    return code
`;
      const result = validateConnections(code, validGraph);
      expect(result.usedAPIs).toEqual([]);
    });
  });

  describe('Exception Handling Issues', () => {
    it('should validate code with unhandled exceptions', () => {
      const code = `
def expand(code: str, context) -> str:
    url = context.db.get(code)
    if not url:
        raise ValueError("Code not found")  # Unhandled
    return url
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });

    it('should validate code with broad except clauses', () => {
      const code = `
def shorten(url: str, context) -> str:
    try:
        context.db.set("key", url)
    except:  # Too broad
        pass
    return "abc"
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Resource Leaks', () => {
    it('should validate code that might leak resources', () => {
      const code = `
def shorten(url: str, context) -> str:
    # Potential memory leak: storing everything forever
    context.cache.set(url, "code", ttl=999999999)
    return "abc"
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Security Issues (Validation Still Works)', () => {
    it('should validate code with SQL injection vulnerability', () => {
      const code = `
def expand(code: str, context) -> str:
    # SQL injection vulnerable (if db supported raw SQL)
    query = f"SELECT url FROM urls WHERE code = '{code}'"
    context.db.execute(query)  # Vulnerable
    return "url"
`;
      const result = validateConnections(code, validGraph);
      expect(result.usedAPIs).toContain('db');
    });

    it('should validate code with no input validation', () => {
      const code = `
def shorten(url: str, context) -> str:
    # No validation of input
    context.db.set(url, url)  # What if url is malicious?
    return url
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Performance Issues (Validation Still Works)', () => {
    it('should validate code with O(n^2) complexity', () => {
      const code = `
def shorten(url: str, context) -> str:
    # Terrible performance
    for i in range(10000):
        for j in range(10000):
            context.db.get(f"key_{i}_{j}")
    return "abc"
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
    });

    it('should validate code with no caching when it should cache', () => {
      const code = `
def expand(code: str, context) -> str:
    # Missing cache - always hits database
    return context.db.get(code)
`;
      const result = validateConnections(code, validGraph);
      expect(result.valid).toBe(true);
      expect(result.usedAPIs).toEqual(['db']);
      // Note: validation doesn't check if cache SHOULD be used
    });
  });
});

describe('Connection Validation - Missing Connections Edge Cases', () => {
  describe('Queue Connection Validation', () => {
    it('should fail when code uses queue but no queue component exists', () => {
      const code = `
context.queue.publish({"event": "url_created"})
`;
      const graphNoQueue: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };

      const result = validateConnections(code, graphNoQueue);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].apiType).toBe('queue');
      expect(result.errors[0].message).toContain('context.queue');
      expect(result.errors[0].suggestion).toContain('message_queue');
    });

    it('should fail when queue exists but not connected to app_server', () => {
      const code = `context.queue.publish(msg)`;
      const graphQueueNotConnected: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
          { id: 'queue1', type: 'kafka', config: {} }, // Exists but not connected
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };

      const result = validateConnections(code, graphQueueNotConnected);
      expect(result.valid).toBe(false);
      expect(result.errors[0].apiType).toBe('queue');
    });

    it('should pass when queue connected in wrong direction initially, but fail validation', () => {
      const code = `context.queue.publish(msg)`;
      const graphWrongDirection: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'queue1', type: 'kafka', config: {} },
        ],
        connections: [
          { from: 'queue1', to: 'app_server' }, // Wrong direction
        ],
      };

      const result = validateConnections(code, graphWrongDirection);
      expect(result.valid).toBe(false); // Should fail - wrong direction
    });
  });

  describe('Multiple Database Types', () => {
    it('should accept PostgreSQL for db API', () => {
      const code = `context.db.set(key, val)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'pg', type: 'postgresql', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'pg' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should accept MongoDB for db API', () => {
      const code = `context.db.get(key)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'mongo', type: 'mongodb', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'mongo' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should accept DynamoDB for db API', () => {
      const code = `context.db.query(params)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'dynamo', type: 'dynamodb', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'dynamo' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should accept Cassandra for db API', () => {
      const code = `context.db.execute(query)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'cassandra', type: 'cassandra', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'cassandra' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should accept any database type when code uses db API', () => {
      const code = `
context.db.set("key1", "val1")
context.db.get("key2")
`;
      const graphMultipleDBs: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'pg', type: 'postgresql', config: {} },
          { id: 'mongo', type: 'mongodb', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'pg' },
          { from: 'app_server', to: 'mongo' },
        ],
      };

      const result = validateConnections(code, graphMultipleDBs);
      expect(result.valid).toBe(true);
      // Either DB satisfies the requirement
    });
  });

  describe('Multiple Cache Types', () => {
    it('should accept Redis for cache API', () => {
      const code = `context.cache.get(key)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'redis', type: 'redis', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'redis' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should accept Memcached for cache API', () => {
      const code = `context.cache.set(key, val, ttl)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'memcached', type: 'memcached', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'memcached' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should accept generic cache component', () => {
      const code = `context.cache.delete(key)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'cache', type: 'cache', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'cache' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Multiple Queue Types', () => {
    it('should accept Kafka for queue API', () => {
      const code = `context.queue.publish(message)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'kafka', type: 'kafka', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'kafka' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should accept RabbitMQ for queue API', () => {
      const code = `context.queue.consume()`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'rabbit', type: 'rabbitmq', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'rabbit' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });

    it('should accept SQS for queue API', () => {
      const code = `context.queue.send(msg)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'sqs', type: 'sqs', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'sqs' }],
      };

      const result = validateConnections(code, graph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Complex Multi-Component Scenarios', () => {
    it('should require all APIs used in code to be connected', () => {
      const code = `
def shorten(url: str, context) -> str:
    # Uses db, cache, and queue
    cached = context.cache.get(url)
    if cached:
        return cached

    code = generate_code()
    context.db.set(code, url)
    context.cache.set(url, code)
    context.queue.publish({"event": "url_created"})

    return code
`;

      // Missing queue connection
      const graphMissingQueue: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db', type: 'database', config: {} },
          { id: 'cache', type: 'redis', config: {} },
          { id: 'queue', type: 'kafka', config: {} }, // Exists but not connected!
        ],
        connections: [
          { from: 'app_server', to: 'db' },
          { from: 'app_server', to: 'cache' },
          // Missing: { from: 'app_server', to: 'queue' }
        ],
      };

      const result = validateConnections(code, graphMissingQueue);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].apiType).toBe('queue');
    });

    it('should pass when all required components are connected', () => {
      const code = `
context.db.set(k, v)
context.cache.get(k)
context.queue.publish(m)
context.cdn.cache(url)
context.search.index(doc)
`;
      const graphComplete: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db', type: 'postgresql', config: {} },
          { id: 'cache', type: 'redis', config: {} },
          { id: 'queue', type: 'kafka', config: {} },
          { id: 'cdn', type: 'cloudfront', config: {} },
          { id: 'search', type: 'elasticsearch', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db' },
          { from: 'app_server', to: 'cache' },
          { from: 'app_server', to: 'queue' },
          { from: 'app_server', to: 'cdn' },
          { from: 'app_server', to: 'search' },
        ],
      };

      const result = validateConnections(code, graphComplete);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });
});
