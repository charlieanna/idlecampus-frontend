/**
 * Schema Validator Tests
 *
 * Tests for Python code schema validation against database schemas.
 */

import { describe, it, expect } from 'vitest';
import {
  extractFieldNames,
  extractTableNames,
  parseDatabaseOperations,
  validateDatabaseSchema,
  findClosestMatch,
  formatSchemaErrors,
} from '../services/schemaValidator';
import { DatabaseSchema } from '../types/challengeTiers';

describe('Schema Validator', () => {
  describe('extractFieldNames', () => {
    it('should extract fields from dictionary with double quotes', () => {
      const code = `{"short_code": code, "url": url}`;
      const fields = extractFieldNames(code);
      expect(fields).toContain('short_code');
      expect(fields).toContain('url');
    });

    it('should extract fields from dictionary with single quotes', () => {
      const code = `{'short_code': code, 'original_url': url}`;
      const fields = extractFieldNames(code);
      expect(fields).toContain('short_code');
      expect(fields).toContain('original_url');
    });

    it('should extract fields from dictionary without quotes', () => {
      const code = `{code: code, url: url}`;
      const fields = extractFieldNames(code);
      expect(fields).toContain('code');
      expect(fields).toContain('url');
    });

    it('should extract fields from bracket notation', () => {
      const code = `data["short_code"]`;
      const fields = extractFieldNames(code);
      expect(fields).toContain('short_code');
    });

    it('should extract fields from .get() calls', () => {
      const code = `data.get("url")`;
      const fields = extractFieldNames(code);
      expect(fields).toContain('url');
    });

    it('should extract multiple fields from complex code', () => {
      const code = `context.db.set(code, {"short_code": code, "url": url, "created_at": timestamp})`;
      const fields = extractFieldNames(code);
      expect(fields).toContain('short_code');
      expect(fields).toContain('url');
      expect(fields).toContain('created_at');
      expect(fields).toHaveLength(3);
    });

    it('should handle empty code', () => {
      const fields = extractFieldNames('');
      expect(fields).toEqual([]);
    });
  });

  describe('extractTableNames', () => {
    it('should extract table name from query operation', () => {
      const code = `context.db.query("urls", ...)`;
      const tables = extractTableNames(code);
      expect(tables).toContain('urls');
    });

    it('should extract table name from insert_one operation', () => {
      const code = `context.db.insert_one("url_mappings", data)`;
      const tables = extractTableNames(code);
      expect(tables).toContain('url_mappings');
    });

    it('should handle empty code', () => {
      const tables = extractTableNames('');
      expect(tables).toEqual([]);
    });
  });

  describe('parseDatabaseOperations', () => {
    it('should detect context.db.set operation', () => {
      const code = `
def shorten(url: str, context):
    code = generate_code()
    context.db.set(code, {"url": url})
    return code
`;
      const ops = parseDatabaseOperations(code);
      expect(ops).toHaveLength(1);
      expect(ops[0].operation).toBe('set');
      expect(ops[0].fields).toContain('url');
    });

    it('should detect context.db.get operation', () => {
      const code = `
def expand(code: str, context):
    data = context.db.get(code)
    return data["url"]
`;
      const ops = parseDatabaseOperations(code);
      expect(ops).toHaveLength(1);
      expect(ops[0].operation).toBe('get');
      // Note: .get() operations don't have fields inline, they're accessed later
      // So we don't expect any fields to be extracted from the operation itself
    });

    it('should detect multiple operations', () => {
      const code = `
def shorten(url: str, context):
    code = generate_code()
    context.db.set(code, {"short_code": code, "url": url})
    context.db.update(code, {"clicks": 0})
    return code
`;
      const ops = parseDatabaseOperations(code);
      expect(ops).toHaveLength(2);
      expect(ops[0].operation).toBe('set');
      expect(ops[1].operation).toBe('update');
    });

    it('should detect MongoDB operations', () => {
      const code = `
context.db.insert_one({"url": url})
context.db.find_one({"short_code": code})
context.db.update_one({"code": code}, {"$inc": {"clicks": 1}})
`;
      const ops = parseDatabaseOperations(code);
      expect(ops).toHaveLength(3);
      expect(ops[0].operation).toBe('insert_one');
      expect(ops[1].operation).toBe('find_one');
      expect(ops[2].operation).toBe('update_one');
    });

    it('should detect Redis hash operations', () => {
      const code = `
context.db.hset("urls", code, url)
context.db.hget("urls", code)
`;
      const ops = parseDatabaseOperations(code);
      expect(ops).toHaveLength(2);
      expect(ops[0].operation).toBe('hset');
      expect(ops[1].operation).toBe('hget');
    });

    it('should capture line numbers', () => {
      const code = `
def shorten(url: str, context):
    code = generate_code()
    context.db.set(code, {"url": url})
    return code
`;
      const ops = parseDatabaseOperations(code);
      expect(ops[0].lineNumber).toBe(4);
    });

    it('should handle empty code', () => {
      const ops = parseDatabaseOperations('');
      expect(ops).toEqual([]);
    });
  });

  describe('findClosestMatch', () => {
    it('should find exact match', () => {
      const match = findClosestMatch('short_code', ['short_code', 'url', 'created_at']);
      expect(match).toBe('short_code');
    });

    it('should find closest match with typo', () => {
      const match = findClosestMatch('shotcode', ['short_code', 'url', 'created_at']);
      expect(match).toBe('short_code');
    });

    it('should find match with underscore missing', () => {
      const match = findClosestMatch('shortcode', ['short_code', 'url', 'created_at']);
      expect(match).toBe('short_code');
    });

    it('should find match with case difference', () => {
      const match = findClosestMatch('SHORT_CODE', ['short_code', 'url', 'created_at']);
      expect(match).toBe('short_code');
    });

    it('should return null for very different string', () => {
      const match = findClosestMatch('completely_different', ['short_code', 'url']);
      expect(match).toBeNull();
    });

    it('should handle empty options', () => {
      const match = findClosestMatch('test', []);
      expect(match).toBeNull();
    });
  });

  describe('validateDatabaseSchema - Field Validation', () => {
    const tinyUrlSchema: DatabaseSchema = {
      tables: [
        {
          name: 'url_mappings',
          fields: [
            { name: 'short_code', type: 'string', indexed: true },
            { name: 'original_url', type: 'string' },
            { name: 'created_at', type: 'timestamp' },
            { name: 'clicks', type: 'integer' },
          ],
          primaryKey: 'short_code',
        },
      ],
    };

    it('should pass when all fields match schema', () => {
      const code = `
def shorten(url: str, context):
    code = generate_code()
    context.db.set(code, {"short_code": code, "original_url": url, "created_at": time.now(), "clicks": 0})
    return code
`;
      const result = validateDatabaseSchema(code, tinyUrlSchema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when field name is incorrect', () => {
      const code = `
def shorten(url: str, context):
    context.db.set(code, {"code": code, "url": url})
    return code
`;
      const result = validateDatabaseSchema(code, tinyUrlSchema);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      const codeError = result.errors.find(e => e.actual === 'code');
      expect(codeError).toBeDefined();
      expect(codeError?.type).toBe('field_not_found');
      expect(codeError?.suggestion).toContain('short_code');

      const urlError = result.errors.find(e => e.actual === 'url');
      expect(urlError).toBeDefined();
      expect(urlError?.suggestion).toContain('original_url');
    });

    it('should suggest closest match for typos', () => {
      const code = `context.db.set(code, {"shotcode": code})`;
      const result = validateDatabaseSchema(code, tinyUrlSchema);
      expect(result.valid).toBe(false);
      expect(result.errors[0].suggestion).toContain('short_code');
    });

    it('should handle underscore typos', () => {
      const code = `context.db.set(code, {"shortcode": code})`;
      const result = validateDatabaseSchema(code, tinyUrlSchema);
      expect(result.valid).toBe(false);
      expect(result.errors[0].suggestion).toContain('short_code');
    });

    it('should validate multiple fields', () => {
      const code = `
context.db.set(code, {
    "wrong_field1": value1,
    "wrong_field2": value2,
    "short_code": code
})
`;
      const result = validateDatabaseSchema(code, tinyUrlSchema);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });

    it('should pass with no schema provided', () => {
      const code = `context.db.set(code, {"anything": value})`;
      const result = validateDatabaseSchema(code, undefined);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateDatabaseSchema - Table Validation', () => {
    const multiTableSchema: DatabaseSchema = {
      tables: [
        {
          name: 'users',
          fields: [
            { name: 'user_id', type: 'string' },
            { name: 'name', type: 'string' },
          ],
          primaryKey: 'user_id',
        },
        {
          name: 'urls',
          fields: [
            { name: 'url_id', type: 'string' },
            { name: 'short_code', type: 'string' },
          ],
          primaryKey: 'url_id',
        },
      ],
    };

    it('should pass when table name matches schema', () => {
      const code = `context.db.query("users", filter)`;
      const result = validateDatabaseSchema(code, multiTableSchema, 'relational');
      expect(result.valid).toBe(true);
    });

    it('should fail when table name is incorrect', () => {
      const code = `context.db.query("url_mappings", filter)`;
      const result = validateDatabaseSchema(code, multiTableSchema, 'relational');
      expect(result.valid).toBe(false);
      expect(result.errors[0].type).toBe('table_not_found');
      expect(result.errors[0].actual).toBe('url_mappings');
      expect(result.errors[0].suggestion).toBe("Did you mean 'urls'?");
    });
  });

  describe('validateDatabaseSchema - Operation Type Validation', () => {
    const schema: DatabaseSchema = {
      tables: [
        {
          name: 'data',
          fields: [{ name: 'id', type: 'string' }],
          primaryKey: 'id',
        },
      ],
    };

    it('should fail when using MongoDB operations with relational database', () => {
      const code = `context.db.insert_one({"id": "1"})`;
      const result = validateDatabaseSchema(code, schema, 'relational');
      expect(result.valid).toBe(false);
      expect(result.errors[0].type).toBe('invalid_operation');
      expect(result.errors[0].message).toContain('insert_one');
      expect(result.errors[0].message).toContain('relational');
    });

    it('should fail when using Redis operations with document database', () => {
      const code = `context.db.hset("key", "field", "value")`;
      const result = validateDatabaseSchema(code, schema, 'document');
      expect(result.valid).toBe(false);
      expect(result.errors[0].type).toBe('invalid_operation');
    });

    it('should fail when using MongoDB operations with key-value store', () => {
      const code = `context.db.find_one({"id": "1"})`;
      const result = validateDatabaseSchema(code, schema, 'key-value');
      expect(result.valid).toBe(false);
      expect(result.errors[0].type).toBe('invalid_operation');
    });

    it('should pass when using correct operations for key-value store', () => {
      const code = `context.db.set("key", {"id": "1"})`;
      const result = validateDatabaseSchema(code, schema, 'key-value');

      // Should only fail on field validation, not operation type
      const opErrors = result.errors.filter(e => e.type === 'invalid_operation');
      expect(opErrors).toHaveLength(0);
    });
  });

  describe('validateDatabaseSchema - TinyURL Real-World Example', () => {
    const tinyUrlSchema: DatabaseSchema = {
      tables: [
        {
          name: 'url_mappings',
          fields: [
            { name: 'short_code', type: 'string', indexed: true },
            { name: 'original_url', type: 'string' },
            { name: 'created_at', type: 'timestamp' },
            { name: 'clicks', type: 'integer' },
          ],
          primaryKey: 'short_code',
        },
      ],
    };

    it('should catch common TinyURL implementation mistakes', () => {
      // Student uses 'code' instead of 'short_code' and 'url' instead of 'original_url'
      const wrongCode = `
def shorten(url: str, context):
    code = generate_code()
    context.db.set(code, {"code": code, "url": url})
    return code
`;
      const result = validateDatabaseSchema(wrongCode, tinyUrlSchema);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(2);

      const codeError = result.errors.find(e => e.actual === 'code');
      expect(codeError?.suggestion).toBe("Did you mean 'short_code'?");

      const urlError = result.errors.find(e => e.actual === 'url');
      expect(urlError?.suggestion).toBe("Did you mean 'original_url'?");
    });

    it('should pass correct TinyURL implementation', () => {
      const correctCode = `
def shorten(url: str, context):
    code = generate_code()
    context.db.set(code, {
        "short_code": code,
        "original_url": url,
        "created_at": time.now(),
        "clicks": 0
    })
    return code

def expand(code: str, context):
    data = context.db.get(code)
    if data:
        context.db.update(code, {"clicks": data["clicks"] + 1})
        return data["original_url"]
    return None
`;
      const result = validateDatabaseSchema(correctCode, tinyUrlSchema);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateDatabaseSchema - Edge Cases', () => {
    const schema: DatabaseSchema = {
      tables: [
        {
          name: 'data',
          fields: [{ name: 'field1', type: 'string' }],
          primaryKey: 'field1',
        },
      ],
    };

    it('should handle empty Python code', () => {
      const result = validateDatabaseSchema('', schema);
      expect(result.valid).toBe(true);
      expect(result.operations).toHaveLength(0);
    });

    it('should handle code with no database operations', () => {
      const code = `
def helper(x):
    return x * 2
`;
      const result = validateDatabaseSchema(code, schema);
      expect(result.valid).toBe(true);
      expect(result.operations).toHaveLength(0);
    });

    it('should handle malformed Python code', () => {
      const code = `
def broken(context  # Missing closing parenthesis
    context.db.set(key, {"field1": value})
`;
      const result = validateDatabaseSchema(code, schema);
      // Should still detect the operation despite syntax error
      expect(result.operations.length).toBeGreaterThan(0);
    });

    it('should handle very long field names', () => {
      const code = `context.db.set(key, {"this_is_a_very_long_field_name_that_might_be_truncated": value})`;
      const result = validateDatabaseSchema(code, schema);
      expect(result.valid).toBe(false);
    });

    it('should handle empty schema', () => {
      const emptySchema: DatabaseSchema = { tables: [] };
      const code = `context.db.set(key, {"any_field": value})`;
      const result = validateDatabaseSchema(code, emptySchema);
      expect(result.valid).toBe(true);
    });
  });

  describe('formatSchemaErrors', () => {
    it('should return empty string when no errors', () => {
      const formatted = formatSchemaErrors([]);
      expect(formatted).toBe('');
    });

    it('should format single error', () => {
      const errors = [
        {
          type: 'field_not_found' as const,
          message: "Field 'code' not found in schema",
          suggestion: "Did you mean 'short_code'?",
          lineNumber: 3,
          codeSnippet: 'context.db.set(code, {"code": code})',
          expected: ['short_code', 'original_url'],
          actual: 'code',
        },
      ];
      const formatted = formatSchemaErrors(errors);
      expect(formatted).toContain('Schema Validation Failed');
      expect(formatted).toContain("Field 'code' not found");
      expect(formatted).toContain('line 3');
      expect(formatted).toContain("Did you mean 'short_code'?");
      expect(formatted).toContain('short_code, original_url');
    });

    it('should format multiple errors', () => {
      const errors = [
        {
          type: 'field_not_found' as const,
          message: "Field 'code' not found",
          suggestion: "Did you mean 'short_code'?",
        },
        {
          type: 'field_not_found' as const,
          message: "Field 'url' not found",
          suggestion: "Did you mean 'original_url'?",
        },
      ];
      const formatted = formatSchemaErrors(errors);
      expect(formatted).toContain('1. ');
      expect(formatted).toContain('2. ');
      expect(formatted).toContain('code');
      expect(formatted).toContain('url');
    });

    it('should format error without suggestion', () => {
      const errors = [
        {
          type: 'table_not_found' as const,
          message: "Table 'invalid' not found",
        },
      ];
      const formatted = formatSchemaErrors(errors);
      expect(formatted).toContain("Table 'invalid' not found");
      expect(formatted).not.toContain('💡');
    });
  });

  describe('Integration - Complete Validation Flow', () => {
    const tinyUrlSchema: DatabaseSchema = {
      tables: [
        {
          name: 'url_mappings',
          fields: [
            { name: 'short_code', type: 'string', indexed: true },
            { name: 'original_url', type: 'string' },
            { name: 'created_at', type: 'timestamp' },
          ],
          primaryKey: 'short_code',
        },
      ],
    };

    it('should provide complete error report for incorrect implementation', () => {
      const wrongCode = `
def shorten(url: str, context):
    code = generate_code()
    # Wrong field names
    context.db.set(code, {"code": code, "url": url, "timestamp": time.now()})
    return code
`;
      const result = validateDatabaseSchema(wrongCode, tinyUrlSchema, 'key-value');
      const formatted = formatSchemaErrors(result.errors);

      expect(result.valid).toBe(false);
      expect(formatted).toContain('Schema Validation Failed');
      expect(formatted).toContain('short_code');
      expect(formatted).toContain('original_url');
      expect(formatted).toContain('created_at');
    });

    it('should validate complex multi-line operations', () => {
      const code = `
def shorten(url: str, context):
    code = generate_code()
    data = {
        "short_code": code,
        "original_url": url,
        "created_at": time.now()
    }
    context.db.set(code, data)

    # Update click count
    existing = context.db.get(code)
    if existing:
        context.db.update(code, {"wrong_field": 0})  # Should fail

    return code
`;
      const result = validateDatabaseSchema(code, tinyUrlSchema);
      expect(result.valid).toBe(false);
      expect(result.operations).toHaveLength(3);

      const wrongFieldError = result.errors.find(e => e.actual === 'wrong_field');
      expect(wrongFieldError).toBeDefined();
    });
  });
});
