import {
  CodeChallenge,
  CodeSubmission,
  TestResult,
  PerformanceMetrics,
} from '../types/codeChallenge';

/**
 * Test Runner Service
 * Executes user code against test cases and measures performance
 */

/**
 * Run code tests for a challenge
 */
export async function runCodeTests(
  userCode: string,
  challenge: CodeChallenge
): Promise<CodeSubmission> {
  const results: TestResult[] = [];
  const executionTimes: number[] = [];
  let overallStatus: 'passed' | 'failed' | 'error' = 'passed';

  try {
    // Execute each test case
    for (const testCase of challenge.testCases) {
      try {
        const result = await executeTestCase(userCode, testCase);
        results.push(result);

        if (!result.passed) {
          overallStatus = 'failed';
        }

        if (result.executionTimeMs) {
          executionTimes.push(result.executionTimeMs);
        }
      } catch (error: any) {
        results.push({
          testCaseId: testCase.id,
          testCaseName: testCase.name,
          passed: false,
          error: error.message || 'Unknown error',
          expectedOutput: testCase.expectedOutput,
        });
        overallStatus = 'error';
      }
    }

    // Calculate performance metrics
    const performanceMetrics = calculatePerformanceMetrics(
      executionTimes,
      challenge.performanceTargets
    );

    return {
      code: userCode,
      timestamp: Date.now(),
      results,
      overallStatus,
      performanceMetrics,
    };
  } catch (error: any) {
    return {
      code: userCode,
      timestamp: Date.now(),
      results: [],
      overallStatus: 'error',
    };
  }
}

/**
 * Execute a single test case
 */
async function executeTestCase(
  userCode: string,
  testCase: any
): Promise<TestResult> {
  const startTime = performance.now();
  let actualOutput: any;
  let passed = false;
  let error: string | undefined;

  try {
    // Create isolated execution context
    const executionContext = createExecutionContext(userCode);

    // Handle different test case formats
    if (testCase.input.userId !== undefined) {
      // Rate limiter test
      actualOutput = executeRateLimiterTest(executionContext, testCase);
    } else if (testCase.input.requests !== undefined) {
      // Burst test
      actualOutput = executeBurstTest(executionContext, testCase);
    } else if (testCase.input.sequence !== undefined) {
      // Sequence test
      actualOutput = executeSequenceTest(executionContext, testCase);
    } else {
      // Simple function call
      actualOutput = executionContext.fn(testCase.input);
    }

    // Check if output matches expected
    passed = compareOutputs(actualOutput, testCase.expectedOutput);

    if (!passed && testCase.expectedOutput.pattern) {
      // Check regex pattern
      passed = testCase.expectedOutput.pattern.test(actualOutput);
    }
  } catch (err: any) {
    error = err.message;
    passed = false;
  }

  const endTime = performance.now();
  const executionTimeMs = endTime - startTime;

  return {
    testCaseId: testCase.id,
    testCaseName: testCase.name,
    passed,
    actualOutput,
    expectedOutput: testCase.expectedOutput,
    error,
    executionTimeMs,
  };
}

/**
 * Create isolated execution context for user code
 */
function createExecutionContext(userCode: string): any {
  try {
    // For simple function challenges
    if (userCode.includes('function generateShortCode')) {
      // eslint-disable-next-line no-new-func
      const fn = new Function('id', `
        ${userCode}
        return generateShortCode(id);
      `);
      return { fn };
    }

    if (userCode.includes('class RateLimiter')) {
      // eslint-disable-next-line no-new-func
      const RateLimiterClass = new Function(`
        ${userCode}
        return RateLimiter;
      `)();
      return { RateLimiter: RateLimiterClass };
    }

    if (userCode.includes('function resolveCollision')) {
      // eslint-disable-next-line no-new-func
      const fn = new Function('shortCode', 'attemptCount', `
        ${userCode}
        return resolveCollision(shortCode, attemptCount);
      `);
      return { fn };
    }

    throw new Error('Unable to parse function signature');
  } catch (error: any) {
    throw new Error(`Syntax error: ${error.message}`);
  }
}

/**
 * Execute rate limiter test
 */
function executeRateLimiterTest(context: any, testCase: any): boolean {
  const limiter = new context.RateLimiter();
  return limiter.allowRequest(testCase.input.userId, testCase.input.timestamp);
}

/**
 * Execute burst test (multiple requests)
 */
function executeBurstTest(context: any, testCase: any): any {
  const limiter = new context.RateLimiter();
  let allowed = 0;
  let rejected = 0;

  for (let i = 0; i < testCase.input.requests; i++) {
    if (limiter.allowRequest(testCase.input.userId, testCase.input.timestamp)) {
      allowed++;
    } else {
      rejected++;
    }
  }

  return { allowed, rejected };
}

/**
 * Execute sequence test (multiple time points)
 */
function executeSequenceTest(context: any, testCase: any): any {
  const limiter = new context.RateLimiter();
  const results: any = {};

  for (let i = 0; i < testCase.input.sequence.length; i++) {
    const seq = testCase.input.sequence[i];
    let allowed = 0;

    for (let j = 0; j < seq.requests; j++) {
      if (limiter.allowRequest(testCase.input.userId, seq.timestamp)) {
        allowed++;
      }
    }

    results[`${i === 0 ? 'first' : 'second'}Burst`] = allowed;
  }

  return results;
}

/**
 * Compare actual output with expected output
 */
function compareOutputs(actual: any, expected: any): boolean {
  if (typeof expected === 'object' && expected.pattern) {
    // Regex pattern comparison handled in executeTestCase
    return false; // Will be checked in caller
  }

  if (typeof expected === 'object' && !Array.isArray(expected)) {
    return JSON.stringify(actual) === JSON.stringify(expected);
  }

  return actual === expected;
}

/**
 * Calculate performance metrics
 */
function calculatePerformanceMetrics(
  executionTimes: number[],
  targets?: {
    maxTimeMs?: number;
    maxMemoryMB?: number;
    minThroughput?: number;
  }
): PerformanceMetrics | undefined {
  if (executionTimes.length === 0) {
    return undefined;
  }

  const avgExecutionTimeMs =
    executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length;
  const maxExecutionTimeMs = Math.max(...executionTimes);
  const minExecutionTimeMs = Math.min(...executionTimes);

  // Estimate throughput (operations per second)
  const throughputPerSec =
    avgExecutionTimeMs > 0 ? (1000 / avgExecutionTimeMs) : 0;

  // Simple memory estimation (not accurate in browser)
  const memoryUsedMB = 0.1;

  // Calculate performance score (0-100)
  let performanceScore = 100;

  if (targets?.maxTimeMs && avgExecutionTimeMs > targets.maxTimeMs) {
    performanceScore -= ((avgExecutionTimeMs - targets.maxTimeMs) / targets.maxTimeMs) * 50;
  }

  if (targets?.minThroughput && throughputPerSec < targets.minThroughput) {
    performanceScore -= ((targets.minThroughput - throughputPerSec) / targets.minThroughput) * 30;
  }

  performanceScore = Math.max(0, Math.min(100, performanceScore));

  return {
    avgExecutionTimeMs,
    maxExecutionTimeMs,
    minExecutionTimeMs,
    throughputPerSec,
    memoryUsedMB,
    performanceScore,
  };
}

/**
 * Run performance benchmark
 */
export async function runPerformanceBenchmark(
  userCode: string,
  iterations: number = 10000
): Promise<PerformanceMetrics> {
  const executionTimes: number[] = [];
  const context = createExecutionContext(userCode);

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    try {
      if (context.fn) {
        context.fn(i);
      } else if (context.RateLimiter) {
        const limiter = new context.RateLimiter();
        limiter.allowRequest(`user${i}`, Date.now());
      }
    } catch {
      // Ignore errors in benchmark
    }

    const endTime = performance.now();
    executionTimes.push(endTime - startTime);
  }

  return calculatePerformanceMetrics(executionTimes)!;
}
