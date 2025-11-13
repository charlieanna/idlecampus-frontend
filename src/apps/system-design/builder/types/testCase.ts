import { Bottleneck } from './graph';
import { FlowVisualization } from './request';
import { CodeChallenge } from './codeChallenge';

/**
 * Failure injection for test cases
 */
export interface FailureInjection {
  type: 'db_crash' | 'cache_flush' | 'network_partition';
  atSecond: number; // when to inject failure
  recoverySecond?: number; // when failure recovers
}

/**
 * Pass criteria for a test case
 */
export interface PassCriteria {
  maxP99Latency?: number; // milliseconds
  maxErrorRate?: number; // 0-1
  maxMonthlyCost?: number; // dollars
  minAvailability?: number; // 0-1
  maxDowntime?: number; // seconds
}

/**
 * Solution for a test case
 */
export interface Solution {
  components: {
    type: string;
    config: Record<string, any>;
  }[];
  connections: {
    from: string; // component type
    to: string; // component type
  }[];
  explanation: string;
}

/**
 * Test case types
 */
export type TestCaseType = 'functional' | 'performance' | 'scalability' | 'reliability' | 'cost';

/**
 * Test case definition
 */
export interface TestCase {
  name: string;
  type: TestCaseType; // FR or NFR category
  requirement: string; // FR-1, NFR-P1, etc.
  description: string; // Natural language explanation of what's being tested
  traffic: {
    type: 'read' | 'write' | 'mixed';
    rps: number;
    readRatio?: number; // for mixed workloads
    readRps?: number;
    writeRps?: number;
    avgResponseSizeMB?: number; // for CDN/S3
  };
  duration: number; // seconds
  failureInjection?: FailureInjection;
  passCriteria: PassCriteria;
  solution?: Solution; // Optional reference solution
}

/**
 * Test result metrics
 */
export interface TestMetrics {
  p50Latency: number;
  p99Latency: number;
  errorRate: number;
  monthlyCost: number;
  availability: number;
}

/**
 * Test result
 */
export interface TestResult {
  passed: boolean;
  metrics: TestMetrics;
  bottlenecks: Bottleneck[];
  explanation: string;
  componentMetrics: Map<string, any>; // detailed metrics per component
  flowViz?: FlowVisualization; // traffic flow visualization
}

/**
 * Challenge definition
 */
export interface Challenge {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  requirements: {
    functional: string[];
    traffic: string;
    latency: string;
    availability: string;
    budget: string;
    nfrs?: string[]; // User-facing NFRs (e.g., "Latency: P99 < 200ms", "Dataset Size: 10B URLs")
  };
  availableComponents: string[];
  testCases: TestCase[];
  learningObjectives: string[];
  hints?: {
    trigger: string;
    message: string;
  }[];
  codeChallenges?: CodeChallenge[]; // Optional code implementation challenges
  referenceLinks?: {
    label: string;
    url: string;
  }[];
  pythonTemplate?: string; // Naive Python implementation template for the problem
}
