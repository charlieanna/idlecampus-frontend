/**
 * Test Runner Service
 * Validates Python code against test cases
 */

import { pythonExecutor } from './pythonExecutor.js';
import {
  TestCase,
  TestResult,
  ValidationResult,
  CodeLabChallenge,
} from '../types/index.js';

export class TestRunner {
  /**
   * Run all test cases for a code lab challenge
   */
  async runTests(
    userCode: string,
    testCases: TestCase[],
    options: {
      timeout?: number;
      memoryLimit?: number;
    } = {}
  ): Promise<ValidationResult> {
    const results: TestResult[] = [];
    let passed = 0;
    let failed = 0;

    for (const testCase of testCases) {
      const result = await this.runSingleTest(userCode, testCase, options);
      results.push(result);

      if (result.passed) {
        passed++;
      } else {
        failed++;
      }
    }

    return {
      success: failed === 0,
      passed,
      failed,
      total: testCases.length,
      test_results: results,
    };
  }

  /**
   * Run a single test case
   */
  private async runSingleTest(
    userCode: string,
    testCase: TestCase,
    options: {
      timeout?: number;
      memoryLimit?: number;
    }
  ): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Build test code
      const testCode = this.buildTestCode(userCode, testCase);

      // Execute test
      const result = await pythonExecutor.execute(testCode, {
        timeout: options.timeout,
        memoryLimit: options.memoryLimit,
      });

      const executionTime = (Date.now() - startTime) / 1000;

      // Check for execution errors
      if (result.exitCode !== 0 || result.error) {
        return {
          name: testCase.name,
          passed: false,
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          error: result.stderr || result.error || 'Execution failed',
          execution_time: executionTime,
        };
      }

      // Parse output to get actual result
      const actual = this.parseTestOutput(result.stdout);

      // Compare actual with expected
      const passed = this.compareResults(actual, testCase.expected);

      return {
        name: testCase.name,
        passed,
        input: testCase.input,
        expected: testCase.expected,
        actual,
        error: passed ? undefined : 'Output does not match expected result',
        execution_time: executionTime,
      };
    } catch (error) {
      const executionTime = (Date.now() - startTime) / 1000;
      return {
        name: testCase.name,
        passed: false,
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        error: error instanceof Error ? error.message : 'Test execution failed',
        execution_time: executionTime,
      };
    }
  }

  /**
   * Build test code that runs user code with test input and captures output
   */
  private buildTestCode(userCode: string, testCase: TestCase): string {
    const inputJson = JSON.stringify(testCase.input);

    return `
import json
import sys

# User's code
${userCode}

# Test execution
try:
    # Parse test input
    test_input = json.loads('${inputJson.replace(/'/g, "\\'")}')

    # Determine the function to test
    # Look for the main function in user code
    import re
    function_match = re.search(r'def\\s+(\\w+)\\s*\\(', """${userCode.replace(/"/g, '\\"')}""")

    if function_match:
        function_name = function_match.group(1)

        # Call the function with test input
        if test_input is None:
            result = eval(f'{function_name}()')
        elif isinstance(test_input, list):
            result = eval(f'{function_name}(*test_input)')
        elif isinstance(test_input, dict):
            result = eval(f'{function_name}(**test_input)')
        else:
            result = eval(f'{function_name}(test_input)')

        # Output result as JSON
        print("__TEST_RESULT__:", json.dumps(result))
    else:
        # No function found, try to execute and capture output
        print("__TEST_RESULT__:", json.dumps(None))

except Exception as e:
    print(f"__TEST_ERROR__: {str(e)}", file=sys.stderr)
    sys.exit(1)
`;
  }

  /**
   * Parse test output to extract the result
   */
  private parseTestOutput(output: string): any {
    // Look for the test result marker
    const resultLine = output
      .split('\n')
      .find((line) => line.includes('__TEST_RESULT__:'));

    if (resultLine) {
      try {
        const jsonStr = resultLine.split('__TEST_RESULT__:')[1].trim();
        return JSON.parse(jsonStr);
      } catch (error) {
        return output.trim();
      }
    }

    // If no marker found, return the full output
    return output.trim();
  }

  /**
   * Compare actual and expected results
   */
  private compareResults(actual: any, expected: any): boolean {
    // Deep equality check
    return JSON.stringify(actual) === JSON.stringify(expected);
  }

  /**
   * Calculate score based on test results
   */
  calculateScore(validation: ValidationResult): number {
    if (validation.total === 0) return 0;
    return Math.round((validation.passed / validation.total) * 100);
  }

  /**
   * Generate feedback based on test results
   */
  generateFeedback(validation: ValidationResult): string {
    if (validation.success) {
      return 'Excellent! All test cases passed. Your solution is correct.';
    }

    const failedTests = validation.test_results.filter((t) => !t.passed);
    const feedback = [`${validation.failed} out of ${validation.total} tests failed:\n`];

    failedTests.forEach((test, index) => {
      feedback.push(`${index + 1}. ${test.name}:`);
      if (test.error) {
        feedback.push(`   Error: ${test.error}`);
      } else {
        feedback.push(`   Expected: ${JSON.stringify(test.expected)}`);
        feedback.push(`   Actual: ${JSON.stringify(test.actual)}`);
      }
      feedback.push('');
    });

    return feedback.join('\n');
  }
}

// Export singleton instance
export const testRunner = new TestRunner();
