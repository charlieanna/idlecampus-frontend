/**
 * Challenge Tiers - Support for 400 scalable problems
 *
 * Tier 1 (Simple): Students write Python code
 * Tier 2 (Moderate): Students configure pre-built algorithms
 * Tier 3 (Advanced): Fully pre-built, focus on system design
 */

import { Challenge } from './testCase';

/**
 * Implementation tier levels
 */
export type ImplementationTier = 'simple' | 'moderate' | 'advanced';

/**
 * Algorithm configuration option for Tier 2 problems
 */
export interface AlgorithmOption {
  id: string;
  name: string;
  description: string;
  performanceProfile: {
    avgLatency: number; // milliseconds
    throughputMultiplier: number; // relative to baseline
    cpuIntensive: boolean;
    memoryIntensive: boolean;
    ioIntensive: boolean;
  };
  configCode?: string; // Optional code snippet showing the algorithm
}

/**
 * Configurable algorithm for Tier 2
 */
export interface ConfigurableAlgorithm {
  componentType: 'app_server' | 'worker';
  algorithmKey: string; // e.g., 'feed_ranking', 'cache_strategy'
  label: string;
  description: string;
  options: AlgorithmOption[];
  defaultOption: string;
}

/**
 * Pre-built behavior for Tier 3
 */
export interface PrebuiltBehavior {
  operation: string; // e.g., 'match_driver', 'calculate_surge'
  description: string;
  latency: number | { min: number; max: number; factors: string[] };
  throughput?: number; // operations per second
  dependencies: string[]; // Required components
  failureRate?: number; // Expected error rate
  implementationNotes?: string; // Explain what the pre-built logic does
}

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
 * Required Python implementations for Tier 1
 */
export interface RequiredImplementation {
  componentType: 'app_server' | 'worker';
  fileName: string; // e.g., 'app_server.py'
  template: string; // Starter code
  functions: {
    name: string; // Function to implement
    description: string;
    signature: string; // Function signature
    performanceTarget?: string; // e.g., "< 50ms per request"
  }[];
  contextAPI?: string; // Documentation for available context methods
}

/**
 * Extended Challenge interface with tier support
 */
export interface TieredChallenge extends Challenge {
  /**
   * Implementation tier - determines how students interact
   */
  implementationTier: ImplementationTier;

  /**
   * Tier 1: Required Python implementations
   */
  requiredImplementations?: RequiredImplementation[];

  /**
   * Tier 2: Configurable algorithms
   */
  configurableAlgorithms?: ConfigurableAlgorithm[];

  /**
   * Tier 3: Pre-built behaviors with realistic performance
   */
  prebuiltBehaviors?: {
    [componentType: string]: PrebuiltBehavior[];
  };

  /**
   * Component behaviors for simulation (all tiers)
   */
  componentBehaviors?: ComponentBehaviorConfig;

  /**
   * Whether to show Python code editor (Tier 1 & some Tier 2)
   */
  showCodeEditor?: boolean;

  /**
   * Whether to show algorithm configuration UI (Tier 2)
   */
  showAlgorithmConfig?: boolean;

  /**
   * Performance benchmarking settings
   */
  benchmarkSettings?: {
    sampleSize: number; // Number of requests to benchmark
    warmupRequests: number; // Requests to warm up before measuring
    timeoutMs: number; // Max time for a single request
  };
}

/**
 * Helper to determine UI requirements based on tier
 */
export function getTierUIRequirements(tier: ImplementationTier): {
  needsCodeEditor: boolean;
  needsAlgorithmConfig: boolean;
  needsArchitectureOnly: boolean;
} {
  switch (tier) {
    case 'simple':
      return {
        needsCodeEditor: true,
        needsAlgorithmConfig: false,
        needsArchitectureOnly: false,
      };
    case 'moderate':
      return {
        needsCodeEditor: false, // Optional
        needsAlgorithmConfig: true,
        needsArchitectureOnly: false,
      };
    case 'advanced':
      return {
        needsCodeEditor: false,
        needsAlgorithmConfig: false,
        needsArchitectureOnly: true,
      };
  }
}

/**
 * Get tier description for UI
 */
export function getTierDescription(tier: ImplementationTier): string {
  switch (tier) {
    case 'simple':
      return 'Write Python code to implement the core algorithms';
    case 'moderate':
      return 'Configure pre-built algorithms and tune parameters';
    case 'advanced':
      return 'Design the system architecture using pre-built components';
  }
}

/**
 * Check if a challenge requires Python execution
 */
export function requiresPythonExecution(challenge: TieredChallenge): boolean {
  return challenge.implementationTier === 'simple' ||
         (challenge.implementationTier === 'moderate' && challenge.showCodeEditor === true);
}