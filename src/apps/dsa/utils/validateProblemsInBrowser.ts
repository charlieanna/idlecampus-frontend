/**
 * Browser-based Problem Validator
 * 
 * Run this in the browser console to validate all problems:
 * 
 * import { validateAllProblemsInBrowser } from './utils/validateProblemsInBrowser';
 * validateAllProblemsInBrowser().then(results => console.log(results));
 */

import { buildPythonTestHarness, normalizeSmartPracticeTestCases } from './pythonTestHarness';
import { runPythonCode } from './pyodideRunner';
import { getAllPracticeExercises } from './practiceExerciseRegistry';

export interface ValidationResult {
  problemId: string;
  title: string;
  passed: boolean;
  error?: string;
  failedTestCases?: number;
  totalTestCases?: number;
  testDetails?: Array<{ passed: boolean; error?: string }>;
}

/**
 * Validate a single problem
 */
async function validateProblem(
  problem: {
    id: string;
    title: string;
    solution: string;
    testCases: Array<{ input: string; expectedOutput: string; hidden?: boolean }>;
  }
): Promise<ValidationResult> {
  if (!problem.solution || !problem.testCases || problem.testCases.length === 0) {
    return {
      problemId: problem.id,
      title: problem.title,
      passed: false,
      error: 'No solution or test cases',
      totalTestCases: 0
    };
  }

  try {
    const normalizedTestCases = normalizeSmartPracticeTestCases(problem.testCases);
    const testCode = buildPythonTestHarness(problem.solution, normalizedTestCases);
    const result = await runPythonCode(testCode);

    if (result.error) {
      return {
        problemId: problem.id,
        title: problem.title,
        passed: false,
        error: result.error,
        totalTestCases: problem.testCases.length
      };
    }

    // Parse JSON results from output
    let testResults: any[] = [];
    try {
      // Look for JSON array in output
      const jsonArrayMatch = result.output.match(/\[[\s\S]*\]/);
      if (jsonArrayMatch) {
        testResults = JSON.parse(jsonArrayMatch[0]);
      } else {
        // Try to find individual test results
        const jsonObjMatch = result.output.match(/\{[\s\S]*\}/);
        if (jsonObjMatch) {
          const parsed = JSON.parse(jsonObjMatch[0]);
          testResults = Array.isArray(parsed) ? parsed : [parsed];
        }
      }
    } catch (e) {
      // If parsing fails, check output for success indicators
      const outputLower = result.output.toLowerCase();
      if (outputLower.includes('all tests passed') || 
          outputLower.includes('passed') && !outputLower.includes('failed')) {
        return {
          problemId: problem.id,
          title: problem.title,
          passed: true,
          totalTestCases: problem.testCases.length
        };
      }
    }

    if (testResults.length === 0) {
      return {
        problemId: problem.id,
        title: problem.title,
        passed: false,
        error: 'Could not parse test results from output',
        totalTestCases: problem.testCases.length
      };
    }

    const passed = testResults.every((r: any) => r.passed);
    const failedCount = testResults.filter((r: any) => !r.passed).length;
    const testDetails = testResults.map((r: any) => ({
      passed: r.passed,
      error: r.error
    }));

    return {
      problemId: problem.id,
      title: problem.title,
      passed,
      failedTestCases: failedCount,
      totalTestCases: testResults.length,
      testDetails
    };
  } catch (error: any) {
    return {
      problemId: problem.id,
      title: problem.title,
      passed: false,
      error: error.message || String(error)
    };
  }
}

/**
 * Validate all problems in the browser
 * 
 * Usage: Call this function in the browser console after the app is loaded
 */
export async function validateAllProblemsInBrowser(): Promise<{
  total: number;
  passed: number;
  failed: number;
  results: ValidationResult[];
  failedProblems: ValidationResult[];
}> {
  console.log('Loading all practice exercises...');
  const problems = getAllPracticeExercises();
  console.log(`Found ${problems.length} problems\n`);

  const results: ValidationResult[] = [];
  const failedProblems: ValidationResult[] = [];

  // Process in small batches to avoid blocking the browser
  const batchSize = 5;
  let processed = 0;

  for (let i = 0; i < problems.length; i += batchSize) {
    const batch = problems.slice(i, i + batchSize);
    processed += batch.length;
    
    console.log(`Validating ${processed}/${problems.length}...`);

    const batchResults = await Promise.all(
      batch.map(problem => validateProblem(problem))
    );

    for (const result of batchResults) {
      results.push(result);
      if (!result.passed) {
        failedProblems.push(result);
        console.log(`✗ ${result.problemId}: ${result.title}`);
        if (result.error) {
          console.log(`  Error: ${result.error}`);
        }
        if (result.failedTestCases !== undefined) {
          console.log(`  Failed: ${result.failedTestCases}/${result.totalTestCases} test cases`);
        }
      }
    }

    // Small delay between batches to keep browser responsive
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  console.log('\n=== Validation Complete ===');
  console.log(`Total: ${problems.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);

  return {
    total: problems.length,
    passed: passedCount,
    failed: failedCount,
    results,
    failedProblems
  };
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).validateAllProblems = validateAllProblemsInBrowser;
  console.log('Problem validator loaded! Run: validateAllProblems()');
}

