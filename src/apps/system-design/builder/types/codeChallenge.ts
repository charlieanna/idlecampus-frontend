/**
 * Code Challenge System
 * Allows users to implement and optimize specific algorithms/functions
 * for system design components
 */

export interface CodeChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';

  /** Component this challenge relates to */
  componentType?: string;

  /** The function signature users must implement */
  functionSignature: string;

  /** Starter code template */
  starterCode: string;

  /** Test cases to validate implementation */
  testCases: CodeTestCase[];

  /** Performance benchmarks */
  performanceTargets?: {
    maxTimeMs?: number;
    maxMemoryMB?: number;
    minThroughput?: number; // operations per second
  };

  /** Reference solution (shown after user attempts) */
  referenceSolution: string;

  /** Explanation of the optimal approach */
  solutionExplanation: string;

  /** Interview tips related to this code */
  interviewTips?: string[];
}

export interface CodeTestCase {
  id: string;
  name: string;
  input: any;
  expectedOutput: any;

  /** For performance testing */
  isPerformanceTest?: boolean;
  timeoutMs?: number;
}

export interface CodeSubmission {
  code: string;
  timestamp: number;
  results: TestResult[];
  overallStatus: 'passed' | 'failed' | 'error';
  performanceMetrics?: PerformanceMetrics;
}

export interface TestResult {
  testCaseId: string;
  testCaseName: string;
  passed: boolean;
  actualOutput?: any;
  expectedOutput?: any;
  error?: string;
  executionTimeMs?: number;
  memoryUsedMB?: number;
}

export interface PerformanceMetrics {
  avgExecutionTimeMs: number;
  maxExecutionTimeMs: number;
  minExecutionTimeMs: number;
  throughputPerSec: number;
  memoryUsedMB: number;

  /** Comparison to reference solution */
  performanceScore: number; // 0-100, 100 = as fast as reference
}

/**
 * Code challenge context - passed to running code
 */
export interface CodeChallengeContext {
  // Utility functions available to user code
  utils: {
    hash: (input: string) => string;
    random: (min: number, max: number) => number;
    timestamp: () => number;
  };
}
