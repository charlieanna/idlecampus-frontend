import { SystemGraph } from './graph';
import { TestCase } from './testCase';

/**
 * Problem Definition - Defines how to validate any system design problem
 */

// Component requirements
export type ComponentType = 'compute' | 'storage' | 'cache' | 'load_balancer' | 'message_queue' | 'object_storage' | 'cdn' | 'realtime_messaging';

export interface ComponentRequirement {
  type: ComponentType;
  reason: string;  // Why is this needed? For student feedback
  optional?: boolean;
}

export interface ConnectionRequirement {
  from: string;  // Component type or 'client'
  to: string;    // Component type
  reason?: string;
}

// Data model requirements
export interface DataModelRequirement {
  entities: string[];  // e.g., ['user', 'post', 'url_mapping']
  fields?: Record<string, string[]>;  // entity -> fields
  accessPatterns: AccessPattern[];
}

export interface AccessPattern {
  type: 'write' | 'read_by_key' | 'read_by_query' | 'scan' | 'write_large_file' | 'geospatial_query';
  frequency: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
}

// Test scenario definition
export interface Scenario {
  name: string;
  description?: string;

  // Traffic configuration
  traffic: {
    rps: number;
    readWriteRatio?: number;  // 0.9 = 90% reads, 10% writes
    avgFileSize?: number;     // For file upload scenarios (in MB)
    geospatialQueries?: boolean;
  };

  // Failure injection (optional)
  failureInjection?: {
    component: string;  // Component type that fails
    at: number;         // Seconds into test
    recoveryAt?: number; // When it recovers
  };

  // Pass criteria
  passCriteria: {
    maxLatency?: number;        // p99 latency in ms
    maxCost?: number;           // Monthly cost in $
    maxErrorRate?: number;      // 0-1 (e.g., 0.01 = 1%)
    maxDowntime?: number;       // Seconds of downtime allowed
    dataLoss?: boolean;         // Is data loss acceptable?
    availability?: number;      // e.g., 0.999 = 99.9%
    [key: string]: any;         // Allow custom criteria
  };
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  hint?: string;
  details?: any;
}

// Validator function type
export type ValidatorFunction = (graph: SystemGraph, scenario: Scenario) => ValidationResult;

// Client description for initial canvas
export interface ClientDescription {
  name: string;        // e.g., "Tweet Client", "Timeline Client"
  subtitle: string;    // e.g., "Posts tweets", "Reads timeline"
  id?: string;         // Optional custom ID (defaults to snake_case of name)
}

// Complete problem definition
export interface ProblemDefinition {
  id: string;
  title: string;
  description: string;

  // User-facing requirements (interview-style)
  userFacingFRs?: string[]; // e.g., "Users can upload photos", "Users can view feed"
  userFacingNFRs?: string[]; // e.g., "Latency: P99 < 200ms", "Availability: 99.9% uptime"

  // Client descriptions for initial canvas (optional - will be auto-generated if not provided)
  clientDescriptions?: ClientDescription[];

  // Architectural requirements (for validation)
  functionalRequirements: {
    mustHave: ComponentRequirement[];
    mustConnect: ConnectionRequirement[];
    dataModel?: DataModelRequirement;
  };

  // Test scenarios (one per level)
  scenarios: Scenario[];

  // Custom validators
  validators: {
    name: string;
    validate: ValidatorFunction;
  }[];

  // Naive Python implementation template
  pythonTemplate?: string;
}
