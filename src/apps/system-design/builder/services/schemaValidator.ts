/**
 * Schema Validation Service
 *
 * Validates Python code against database schema definitions.
 * Checks field names, table names, and API methods match the expected schema.
 */

import { DatabaseSchema } from '../types/challengeTiers';

/**
 * Database operation types detected in Python code
 */
export type DatabaseOperation =
  | 'get' | 'set' | 'delete' | 'update' | 'query' | 'scan'
  | 'insert_one' | 'find_one' | 'find' | 'update_one' | 'delete_one' | 'aggregate'
  | 'hget' | 'hset' | 'hdel' | 'hgetall' | 'sadd' | 'smembers' | 'zadd' | 'zrange';

/**
 * Parsed database operation from Python code
 */
export interface ParsedDatabaseOp {
  operation: DatabaseOperation;
  tableName?: string;
  collectionName?: string;
  fields: string[]; // Field names used in the operation
  lineNumber?: number;
  codeSnippet?: string;
}

/**
 * Schema validation error with suggestions
 */
export interface SchemaValidationError {
  type: 'field_not_found' | 'table_not_found' | 'invalid_operation' | 'type_mismatch';
  message: string;
  suggestion?: string;
  lineNumber?: number;
  codeSnippet?: string;
  expected?: string[];
  actual?: string;
}

/**
 * Schema validation result
 */
export interface SchemaValidationResult {
  valid: boolean;
  errors: SchemaValidationError[];
  operations: ParsedDatabaseOp[];
}

/**
 * Calculate Levenshtein distance for fuzzy matching
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Find the closest matching field name using a combination of strategies:
 * 1. Exact substring match gets highest priority
 * 2. Contains target as substring
 * 3. Common prefix (e.g., "url_mappings" vs "urls")
 * 4. Levenshtein distance
 */
export function findClosestMatch(target: string, options: string[]): string | null {
  if (options.length === 0) return null;

  const targetLower = target.toLowerCase();

  // Check for exact substring match or contains target
  for (const option of options) {
    const optionLower = option.toLowerCase();

    // If target is a substring of option (e.g., "code" in "short_code")
    if (optionLower.includes(targetLower)) {
      return option;
    }

    // If option is a substring of target (e.g., "url" in "original_url")
    if (targetLower.includes(optionLower)) {
      return option;
    }
  }

  // Check for common prefix (e.g., "url_mappings" vs "urls")
  for (const option of options) {
    const optionLower = option.toLowerCase();
    const minLength = Math.min(targetLower.length, optionLower.length);
    let commonPrefixLength = 0;

    for (let i = 0; i < minLength; i++) {
      if (targetLower[i] === optionLower[i]) {
        commonPrefixLength++;
      } else {
        break;
      }
    }

    // If they share at least 3 characters as a prefix, consider them related
    if (commonPrefixLength >= 3) {
      return option;
    }
  }

  // Fall back to Levenshtein distance
  let closestMatch = options[0];
  let minDistance = levenshteinDistance(targetLower, options[0].toLowerCase());

  for (let i = 1; i < options.length; i++) {
    const distance = levenshteinDistance(targetLower, options[i].toLowerCase());
    if (distance < minDistance) {
      minDistance = distance;
      closestMatch = options[i];
    }
  }

  // Only suggest if it's reasonably close (within 50% of the target length or 6 characters, whichever is larger)
  const threshold = Math.max(6, Math.ceil(target.length * 0.5));
  if (minDistance <= threshold) {
    return closestMatch;
  }

  return null;
}

/**
 * Extract field names from Python dictionary/object syntax
 * Examples:
 *   {"short_code": code, "url": url} -> ["short_code", "url"]
 *   {code: code, url: url} -> ["code", "url"]
 *   data["short_code"] -> ["short_code"]
 *   data.get("url") -> ["url"]
 */
export function extractFieldNames(codeSnippet: string): string[] {
  const fields = new Set<string>();

  // Match dictionary keys with quotes: {"key": value} or {'key': value}
  const quotedKeyPattern = /[{,]\s*['"](\w+)['"]\s*:/g;
  let match;
  while ((match = quotedKeyPattern.exec(codeSnippet)) !== null) {
    fields.add(match[1]);
  }

  // Match dictionary keys without quotes: {key: value}
  // But be strict - must be after { or , and followed by : and a value
  const unquotedKeyPattern = /[{,]\s*(\w+)\s*:\s*\w+/g;
  while ((match = unquotedKeyPattern.exec(codeSnippet)) !== null) {
    // Don't add if it looks like a type annotation (e.g., url: str)
    if (!codeSnippet.includes(match[1] + ': str') &&
        !codeSnippet.includes(match[1] + ': int') &&
        !codeSnippet.includes(match[1] + ': float') &&
        !codeSnippet.includes(match[1] + ': bool')) {
      fields.add(match[1]);
    }
  }

  // Match bracket notation: data["key"] or data['key']
  const bracketPattern = /\[['"](\w+)['"]\]/g;
  while ((match = bracketPattern.exec(codeSnippet)) !== null) {
    fields.add(match[1]);
  }

  // Match .get() calls: .get("key") or .get('key')
  const getPattern = /\.get\(['"](\w+)['"]\)/g;
  while ((match = getPattern.exec(codeSnippet)) !== null) {
    fields.add(match[1]);
  }

  return Array.from(fields);
}

/**
 * Extract table/collection names from Python code
 * Examples:
 *   context.db.query("urls", ...) -> ["urls"]
 *   context['db'].query("urls", ...) -> ["urls"]
 *   collection = "url_mappings" -> ["url_mappings"]
 */
export function extractTableNames(codeSnippet: string): string[] {
  const tables = new Set<string>();

  // Match context.db or context['db'] operations with table name as first argument
  const tablePattern = /context(\['db'\]|\.db)\.\w+\(['"](\w+)['"]/g;
  let match;
  while ((match = tablePattern.exec(codeSnippet)) !== null) {
    tables.add(match[2]); // match[2] is the table name (match[1] is the db accessor)
  }

  return Array.from(tables);
}

/**
 * Extract a multi-line context around a database operation
 * This helps capture fields that span multiple lines
 */
function extractOperationContext(lines: string[], startIndex: number): string {
  let context = lines[startIndex];
  let openParens = (context.match(/\(/g) || []).length - (context.match(/\)/g) || []).length;

  // Look ahead up to 10 lines to find the closing parenthesis
  let currentIndex = startIndex + 1;
  while (openParens > 0 && currentIndex < lines.length && currentIndex < startIndex + 10) {
    const line = lines[currentIndex];
    context += '\n' + line;
    openParens += (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
    currentIndex++;
  }

  return context;
}

/**
 * Parse database operations from Python code
 */
export function parseDatabaseOperations(pythonCode: string): ParsedDatabaseOp[] {
  const operations: ParsedDatabaseOp[] = [];
  const lines = pythonCode.split('\n');

  // Patterns for different database operations
  // Supports both context.db.method() and context['db'].method() syntax
  const dbOperationPatterns: { pattern: RegExp; operation: DatabaseOperation }[] = [
    // Key-value operations
    { pattern: /context(\['db'\]|\.db)\.get\(/i, operation: 'get' },
    { pattern: /context(\['db'\]|\.db)\.set\(/i, operation: 'set' },
    { pattern: /context(\['db'\]|\.db)\.delete\(/i, operation: 'delete' },
    { pattern: /context(\['db'\]|\.db)\.update\(/i, operation: 'update' },
    { pattern: /context(\['db'\]|\.db)\.insert\(/i, operation: 'set' }, // insert is same as set
    { pattern: /context(\['db'\]|\.db)\.query\(/i, operation: 'query' },
    { pattern: /context(\['db'\]|\.db)\.scan\(/i, operation: 'scan' },

    // MongoDB-style operations
    { pattern: /context(\['db'\]|\.db)\.insert_one\(/i, operation: 'insert_one' },
    { pattern: /context(\['db'\]|\.db)\.find_one\(/i, operation: 'find_one' },
    { pattern: /context(\['db'\]|\.db)\.find\(/i, operation: 'find' },
    { pattern: /context(\['db'\]|\.db)\.update_one\(/i, operation: 'update_one' },
    { pattern: /context(\['db'\]|\.db)\.delete_one\(/i, operation: 'delete_one' },
    { pattern: /context(\['db'\]|\.db)\.aggregate\(/i, operation: 'aggregate' },

    // Redis-style operations
    { pattern: /context(\['db'\]|\.db)\.hget\(/i, operation: 'hget' },
    { pattern: /context(\['db'\]|\.db)\.hset\(/i, operation: 'hset' },
    { pattern: /context(\['db'\]|\.db)\.hdel\(/i, operation: 'hdel' },
    { pattern: /context(\['db'\]|\.db)\.hgetall\(/i, operation: 'hgetall' },
    { pattern: /context(\['db'\]|\.db)\.sadd\(/i, operation: 'sadd' },
    { pattern: /context(\['db'\]|\.db)\.smembers\(/i, operation: 'smembers' },
    { pattern: /context(\['db'\]|\.db)\.zadd\(/i, operation: 'zadd' },
    { pattern: /context(\['db'\]|\.db)\.zrange\(/i, operation: 'zrange' },
  ];

  lines.forEach((line, index) => {
    for (const { pattern, operation } of dbOperationPatterns) {
      if (pattern.test(line)) {
        // Extract multi-line context for operations that span multiple lines
        const context = extractOperationContext(lines, index);
        const fields = extractFieldNames(context);
        const tables = extractTableNames(context);

        operations.push({
          operation,
          tableName: tables[0],
          fields,
          lineNumber: index + 1,
          codeSnippet: line.trim(),
        });
      }
    }
  });

  return operations;
}

/**
 * Validate database operations against schema
 */
export function validateDatabaseSchema(
  pythonCode: string,
  schema: DatabaseSchema | undefined,
  databaseType: 'relational' | 'document' | 'key-value' = 'key-value'
): SchemaValidationResult {
  const errors: SchemaValidationError[] = [];
  const operations = parseDatabaseOperations(pythonCode);

  // If no schema provided, skip validation
  if (!schema || !schema.tables || schema.tables.length === 0) {
    return { valid: true, errors: [], operations };
  }

  // Get all valid field names from schema
  const allValidFields = schema.tables.flatMap(table =>
    table.fields.map(field => field.name)
  );

  // Get all valid table names from schema
  const allValidTables = schema.tables.map(table => table.name);

  // Define operation categories
  const mongoOps: DatabaseOperation[] = ['insert_one', 'find_one', 'find', 'update_one', 'delete_one', 'aggregate'];
  const redisOps: DatabaseOperation[] = ['hget', 'hset', 'hdel', 'hgetall', 'sadd', 'smembers', 'zadd', 'zrange'];
  const kvOps: DatabaseOperation[] = ['get', 'set', 'delete', 'update'];
  const sqlOps: DatabaseOperation[] = ['query', 'scan'];

  // Validate each operation
  for (const op of operations) {
    // Validate operation type FIRST - if operation is invalid, skip other validations
    let hasInvalidOperation = false;

    if (databaseType === 'relational' && (mongoOps.includes(op.operation) || redisOps.includes(op.operation))) {
      errors.push({
        type: 'invalid_operation',
        message: `Operation '${op.operation}' is not valid for relational databases`,
        suggestion: `Use operations like 'query' or 'scan' for relational databases`,
        lineNumber: op.lineNumber,
        codeSnippet: op.codeSnippet,
      });
      hasInvalidOperation = true;
    }

    if (databaseType === 'document' && (redisOps.includes(op.operation) || sqlOps.includes(op.operation))) {
      errors.push({
        type: 'invalid_operation',
        message: `Operation '${op.operation}' is not valid for document databases`,
        suggestion: `Use operations like 'insert_one', 'find_one', 'update_one' for document databases`,
        lineNumber: op.lineNumber,
        codeSnippet: op.codeSnippet,
      });
      hasInvalidOperation = true;
    }

    if (databaseType === 'key-value' && (mongoOps.includes(op.operation) || sqlOps.includes(op.operation))) {
      errors.push({
        type: 'invalid_operation',
        message: `Operation '${op.operation}' is not valid for key-value stores`,
        suggestion: `Use operations like 'get', 'set', 'delete' for key-value stores`,
        lineNumber: op.lineNumber,
        codeSnippet: op.codeSnippet,
      });
      hasInvalidOperation = true;
    }

    // Skip table/field validation if operation itself is invalid
    if (hasInvalidOperation) {
      continue;
    }

    // Validate table name if specified (only for SQL/document operations)
    if (op.tableName && !redisOps.includes(op.operation) && !allValidTables.includes(op.tableName)) {
      const closestTable = findClosestMatch(op.tableName, allValidTables);
      errors.push({
        type: 'table_not_found',
        message: `Table '${op.tableName}' not found in schema`,
        suggestion: closestTable ? `Did you mean '${closestTable}'?` : undefined,
        lineNumber: op.lineNumber,
        codeSnippet: op.codeSnippet,
        expected: allValidTables,
        actual: op.tableName,
      });
    }

    // Validate field names (only for write operations like set/insert/update)
    // Note: 'insert' operation is mapped to 'set' in parsing
    const writeOps: DatabaseOperation[] = ['set', 'update', 'insert_one', 'update_one'];
    if (writeOps.includes(op.operation)) {
      for (const field of op.fields) {
        if (!allValidFields.includes(field)) {
          const closestField = findClosestMatch(field, allValidFields);
          errors.push({
            type: 'field_not_found',
            message: `Field '${field}' not found in schema`,
            suggestion: closestField ? `Did you mean '${closestField}'?` : undefined,
            lineNumber: op.lineNumber,
            codeSnippet: op.codeSnippet,
            expected: allValidFields,
            actual: field,
          });
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    operations,
  };
}

/**
 * Format schema validation errors into a user-friendly message
 */
export function formatSchemaErrors(errors: SchemaValidationError[]): string {
  if (errors.length === 0) return '';

  let message = '❌ Schema Validation Failed:\n\n';

  errors.forEach((error, index) => {
    message += `${index + 1}. ${error.message}`;
    if (error.lineNumber) {
      message += ` (line ${error.lineNumber})`;
    }
    message += '\n';

    if (error.codeSnippet) {
      message += `   Code: ${error.codeSnippet}\n`;
    }

    if (error.suggestion) {
      message += `   💡 ${error.suggestion}\n`;
    }

    if (error.expected && error.expected.length > 0) {
      message += `   Valid options: ${error.expected.join(', ')}\n`;
    }

    message += '\n';
  });

  return message;
}
