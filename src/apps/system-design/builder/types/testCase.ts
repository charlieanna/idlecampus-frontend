import { Bottleneck } from './graph';
import { FlowVisualization } from './request';
import { CodeChallenge } from './codeChallenge';
import { ProblemDefinition } from './problemDefinition';

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
  maxP50Latency?: number; // milliseconds
  maxP90Latency?: number; // milliseconds
  maxP95Latency?: number; // milliseconds
  maxP99Latency?: number; // milliseconds
  maxErrorRate?: number; // 0-1
  maxMonthlyCost?: number; // dollars
  minAvailability?: number; // 0-1
  maxDowntime?: number; // seconds
}

/**
 * Architecture decision details
 */
export interface ArchitectureDecision {
  decision: string;
  rationale: string;
  alternatives?: string;
  tradeoffs?: string;
}

/**
 * Component rationale details
 */
export interface ComponentRationale {
  component: string;
  why: string;
  configuration: string;
}

/**
 * Requirement mapping details
 */
export interface RequirementMapping {
  requirement: string; // FR-1, NFR-P1, etc.
  howAddressed: string;
}

/**
 * Optimization strategy details
 */
export interface OptimizationStrategy {
  area: string;
  strategy: string;
  impact: string;
}

/**
 * Solution walkthrough for educational purposes
 */
export interface SolutionWalkthrough {
  overview: string;
  architectureDecisions: ArchitectureDecision[];
  componentRationale: ComponentRationale[];
  requirementMapping: RequirementMapping[];
  optimizations?: OptimizationStrategy[];
  keyTakeaways: string[];
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
  walkthrough?: SolutionWalkthrough; // Optional detailed walkthrough
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
  p90Latency?: number; // Optional for backward compatibility
  p95Latency?: number; // Optional for backward compatibility
  p99Latency: number;
  p999Latency?: number; // Optional for backward compatibility
  errorRate: number;
  monthlyCost: number; // Total cost (including CDN/S3 operational costs)
  infrastructureCost?: number; // Infrastructure cost (excluding CDN/S3) for budget validation
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
  pythonTemplate?: string; // Python implementation template for the problem
  requiredAPIs?: string[]; // Required context APIs: ['db', 'cache', 'queue', 'cdn', 'search']
  solution?: Solution; // Complete solution that passes all test cases
  problemDefinition?: ProblemDefinition; // Full problem definition with guided tutorial
}
