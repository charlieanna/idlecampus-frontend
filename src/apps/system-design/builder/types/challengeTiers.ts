/**
 * Challenge Tiers - Simplified to Tier 1 Only
 *
 * ALL 618 challenges use Tier 1: Students write Python code using context API
 *
 * Every problem has:
 * - Python template with TODO comments
 * - Context API (db, cache, queue, cdn, search, external)
 * - Performance targets in comments
 * - Example usage
 *
 * Tier 2 and Tier 3 are removed for simplicity.
 */

import { Challenge } from './testCase';

/**
 * REMOVED: Tier 2 and Tier 3 interfaces
 * Keeping only Tier 1 (Python implementation) for all challenges
 */

/**
 * Worker behavior types
 */
export type WorkerBehavior =
  | 'simple_write'          // Just write to DB
  | 'validate_and_write'    // Validate then write
  | 'transform_and_write'   // Transform data then write
  | 'external_api_call'     // Call external service
  | 'custom';                // Student implements

/**
 * Component behavior configuration for simulation
 */
export interface ComponentBehaviorConfig {
  appServer?: {
    operations: {
      create?: OperationSpec;
      read?: OperationSpec;
      update?: OperationSpec;
      delete?: OperationSpec;
    };
  };

  worker?: {
    behavior: WorkerBehavior;
    validations?: string[]; // e.g., 'url_reachable', 'not_malicious'
    transformations?: string[]; // e.g., 'resize_image', 'extract_metadata'
    externalApis?: string[]; // e.g., 'sendgrid', 'twilio'
  };

  database?: {
    dataModel: 'relational' | 'document' | 'key-value' | 'wide-column' | 'graph';
    schema?: DatabaseSchema;
  };
}

/**
 * Operation specification for app server
 */
export interface OperationSpec {
  baseLatency: number; // milliseconds
  cpuIntensive?: boolean;
  memoryIntensive?: boolean;
  ioIntensive?: boolean;
  complexityFactors?: string[]; // What affects performance
}

/**
 * Database schema definition
 */
export interface DatabaseSchema {
  tables: {
    name: string;
    fields: { name: string; type: string; indexed?: boolean }[];
    primaryKey: string;
    foreignKeys?: { field: string; references: string }[];
  }[];
  estimatedSize?: string; // e.g., "10M rows", "100GB"
}

/**
 * Python implementation for Tier 1 (all challenges)
 *
 * Simplified: Python template is stored directly in Challenge.pythonTemplate
 * No separate RequiredImplementation interface needed
 */

/**
 * SIMPLIFIED: All challenges are now just regular Challenge objects
 *
 * Every challenge has:
 * - challenge.pythonTemplate (required)
 * - challenge.requiredAPIs (detected automatically)
 *
 * TieredChallenge is now just an alias to Challenge for backwards compatibility
 */
export type TieredChallenge = Challenge;

/**
 * SIMPLIFIED: All challenges use Tier 1 (Python code editor)
 */

/**
 * Check if a challenge has a Python template
 */
export function hasPythonTemplate(challenge: Challenge): boolean {
  return !!challenge.pythonTemplate;
}

/**
 * Get required APIs for a challenge
 */
export function getRequiredAPIs(challenge: Challenge): string[] {
  return (challenge as any).requiredAPIs || ['db'];
}