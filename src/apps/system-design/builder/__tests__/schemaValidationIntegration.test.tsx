/**
 * Schema Validation Integration Tests
 *
 * Tests that schema validation is properly integrated into the submission flow.
 */

import { describe, it, expect } from 'vitest';
import { validateDatabaseSchema, formatSchemaErrors } from '../services/schemaValidator';
import { DatabaseSchema } from '../types/challengeTiers';

describe('Schema Validation Integration', () => {
  describe('TinyURL Challenge - Real-World Scenarios', () => {
    const tinyUrlSchema: DatabaseSchema = {
      tables: [
        {
          name: 'urls',
          fields: [
            { name: 'short_code', type: 'varchar(10)', indexed: true },
            { name: 'long_url', type: 'text' },
            { name: 'created_at', type: 'timestamp', indexed: true },
            { name: 'click_count', type: 'integer' },
          ],
          primaryKey: 'short_code',
        },
      ],
    };

    it('should REJECT code with wrong field names (common student mistake)', () => {
      const incorrectCode = `
def shorten(long_url: str, context):
    code = generate_code()
    # WRONG: using "code" and "url" instead of "short_code" and "long_url"
    context['db'].insert(code, {"code": code, "url": long_url})
    return code
`;

      const result = validateDatabaseSchema(incorrectCode, tinyUrlSchema, 'relational');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      // Should suggest correct field names
      const codeError = result.errors.find(e => e.actual === 'code');
      expect(codeError).toBeDefined();
      expect(codeError?.suggestion).toContain('short_code');

      const urlError = result.errors.find(e => e.actual === 'url');
      expect(urlError).toBeDefined();
      expect(urlError?.suggestion).toContain('long_url');

      // Format errors for user
      const formatted = formatSchemaErrors(result.errors);
      expect(formatted).toContain('Schema Validation Failed');
      expect(formatted).toContain('short_code');
      expect(formatted).toContain('long_url');
    });

    it('should ACCEPT code with correct field names', () => {
      const correctCode = `
def shorten(long_url: str, context):
    # CORRECT: using schema field names
    context['db'].insert("abc123", {
        "short_code": "abc123",
        "long_url": "https://example.com",
        "created_at": "2024-01-01",
        "click_count": 0
    })
    return "abc123"
`;

      const result = validateDatabaseSchema(correctCode, tinyUrlSchema, 'relational');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should provide helpful suggestions for typos', () => {
      const typoCode = `
def shorten(long_url: str, context):
    # Typo: "shortcode" instead of "short_code"
    context['db'].insert(code, {"shortcode": code, "longurl": long_url})
    return code
`;

      const result = validateDatabaseSchema(typoCode, tinyUrlSchema, 'relational');

      expect(result.valid).toBe(false);

      const shortcodeError = result.errors.find(e => e.actual === 'shortcode');
      expect(shortcodeError?.suggestion).toContain('short_code');

      const longurlError = result.errors.find(e => e.actual === 'longurl');
      expect(longurlError?.suggestion).toContain('long_url');
    });

    it('should validate multiple database operations in same code', () => {
      const multiOpCode = `
def shorten(long_url: str, context):
    code = generate_code()

    # First operation - WRONG field names
    context['db'].insert(code, {"wrong_field_1": code})

    # Second operation - ALSO WRONG
    context['db'].update(code, {"wrong_field_2": 0})

    return code
`;

      const result = validateDatabaseSchema(multiOpCode, tinyUrlSchema, 'relational');

      expect(result.valid).toBe(false);
      expect(result.operations).toHaveLength(2);
      expect(result.errors.length).toBeGreaterThan(0);

      const formatted = formatSchemaErrors(result.errors);
      expect(formatted).toContain('wrong_field_1');
      expect(formatted).toContain('wrong_field_2');
    });
  });

  describe('Submission Flow Simulation', () => {
    const schema: DatabaseSchema = {
      tables: [
        {
          name: 'data',
          fields: [
            { name: 'id', type: 'string' },
            { name: 'value', type: 'string' },
          ],
          primaryKey: 'id',
        },
      ],
    };

    it('should simulate full validation flow: connection + schema', () => {
      // Simulates what happens in TieredSystemDesignBuilder.handleSubmit()

      const studentCode = `
def process(data: dict, context):
    # Student uses wrong field name
    context['db'].set(data['id'], {"wrong_field": data['value']})
`;

      // Step 1: Connection validation (would happen first)
      // ... connection validation would pass here ...

      // Step 2: Schema validation
      const schemaValidation = validateDatabaseSchema(studentCode, schema, 'key-value');

      if (!schemaValidation.valid) {
        const errorMessage = formatSchemaErrors(schemaValidation.errors);

        // This is what would be shown to the user
        expect(errorMessage).toContain('Schema Validation Failed');
        expect(errorMessage).toContain('wrong_field');
        expect(errorMessage).toContain('Did you mean');

        // Submission would be blocked here
        expect(schemaValidation.valid).toBe(false);
      }
    });

    it('should allow submission when both connection and schema are valid', () => {
      const correctCode = `
def process(data_dict, context):
    # Correct field names matching schema
    context['db'].set("key1", {"id": "123", "value": "test"})
`;

      // Schema validation passes
      const schemaValidation = validateDatabaseSchema(correctCode, schema, 'key-value');

      expect(schemaValidation.valid).toBe(true);
      expect(schemaValidation.errors).toHaveLength(0);

      // Submission would proceed to test execution
    });
  });

  describe('Error Message Quality', () => {
    const schema: DatabaseSchema = {
      tables: [
        {
          name: 'users',
          fields: [
            { name: 'user_id', type: 'string' },
            { name: 'email', type: 'string' },
            { name: 'created_at', type: 'timestamp' },
          ],
          primaryKey: 'user_id',
        },
      ],
    };

    it('should provide clear, actionable error messages', () => {
      const badCode = `context['db'].insert(id, {"userId": id, "mail": email})`;

      const result = validateDatabaseSchema(badCode, schema, 'relational');
      const formatted = formatSchemaErrors(result.errors);

      // Check error message quality
      expect(formatted).toContain('Schema Validation Failed');
      expect(formatted).toContain('not found');
      expect(formatted).toContain('Did you mean');
      expect(formatted).toContain('user_id'); // Suggestion for userId
      expect(formatted).toContain('email'); // Suggestion for mail

      // Should include valid options
      expect(formatted).toContain('Valid options:');
    });

    it('should include line numbers in error messages', () => {
      const multiLineCode = `
def process(data, context):
    # Line 2
    context['db'].insert(data['id'], {"wrong1": "value"})
    # Line 4
    context['db'].update(data['id'], {"wrong2": "value"})
`;

      const result = validateDatabaseSchema(multiLineCode, schema, 'relational');

      // Errors should have line numbers
      expect(result.errors[0].lineNumber).toBeDefined();
      expect(result.errors[0].lineNumber).toBeGreaterThan(0);
    });
  });
});
