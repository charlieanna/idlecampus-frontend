/**
 * Fix All Problems - Actually execute solutions to generate correct test cases
 * 
 * This function runs each problem's solution to compute correct expected outputs
 * and updates the test cases. It also exports the fixes so they can be applied.
 */

import { runPythonCode } from './pyodideRunner';
import { executeSolutionForExpectedOutput } from './testCaseGenerator';
import { getAllPracticeExercises, type PracticeExercise } from './practiceExerciseRegistry';

interface FixResult {
  problemId: string;
  title: string;
  fixed: boolean;
  error?: string;
  testCasesGenerated?: number;
}

/**
 * Fix a single problem by executing its solution to generate test cases
 */
async function fixProblem(
  problem: PracticeExercise
): Promise<FixResult & { fixedTestCases?: Array<{ input: string; expectedOutput: string; hidden?: boolean }> }> {
  if (!problem.solution || !problem.testCases || problem.testCases.length === 0) {
    return {
      problemId: problem.id,
      title: problem.title,
      fixed: false,
      error: 'No solution or test cases'
    };
  }

  try {
    // Extract solution code - handle both string and Map formats
    let solutionCode = problem.solution || '';

    if (!solutionCode || solutionCode.trim().length < 10) {
      return {
        problemId: problem.id,
        title: problem.title,
        fixed: false,
        error: 'Solution code is empty or too short'
      };
    }

    // Extract Python code from markdown if needed
    // Look for code blocks: ```python ... ``` or ``` ... ```
    const codeBlockMatch = solutionCode.match(/```(?:python)?\s*\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      solutionCode = codeBlockMatch[1].trim();
    }

    // Also try to extract code after "def " if markdown is present
    // Sometimes solutions have markdown before the actual code
    if (!solutionCode.includes('def ') && solutionCode.includes('```')) {
      // Try to find any Python code after markdown
      const pythonCodeMatch = solutionCode.match(/```[\s\S]*?```\s*\n([\s\S]*)/);
      if (pythonCodeMatch) {
        solutionCode = pythonCodeMatch[1].trim();
      }
    }

    // Extract function name from solution - handle markdown/comments
    // Look for function definitions, skip class definitions and helper functions
    let funcMatches = Array.from(solutionCode.matchAll(/def\s+([A-Za-z_]\w*)\s*\(/g));
    
    // If no function found in solution, try starterCode as fallback
    if (funcMatches.length === 0) {
      const starterCode = problem.starterCode || '';
      
      if (starterCode) {
        funcMatches = Array.from(starterCode.matchAll(/def\s+([A-Za-z_]\w*)\s*\(/g));
        // If we found function in starter code but solution is incomplete,
        // try to use starter code structure to build solution
        if (funcMatches.length > 0 && solutionCode.trim().length < 50) {
          // Solution seems incomplete, skip this problem
          return {
            problemId: problem.id,
            title: problem.title,
            fixed: false,
            error: 'Solution code appears incomplete or missing'
          };
        }
      }
    }
    
    if (funcMatches.length === 0) {
      return {
        problemId: problem.id,
        title: problem.title,
        fixed: false,
        error: 'Could not find function name in solution or starter code'
      };
    }

    // Find the main function (skip __init__, methods with self, helper functions)
    let functionName = '';
    for (const match of funcMatches) {
      const name = match[1];
      const params = solutionCode.substring(match.index! + match[0].length);
      const paramMatch = params.match(/^([^)]*)\)/);
      const paramStr = paramMatch ? paramMatch[1] : '';
      
      // Skip class methods, init, and private methods
      if (name !== '__init__' && 
          !paramStr.includes('self') && 
          !name.startsWith('__') &&
          name !== 'traverse' && // Common helper function name
          name !== 'helper' &&
          name !== 'dfs' &&
          name !== 'bfs') {
        functionName = name;
        break;
      }
    }

    // If no main function found, use the first one
    if (!functionName && funcMatches.length > 0) {
      functionName = funcMatches[0][1];
    }

    if (!functionName) {
      return {
        problemId: problem.id,
        title: problem.title,
        fixed: false,
        error: 'Could not find function name'
      };
    }
    let fixedCount = 0;
    const fixedTestCases: Array<{ input: string; expectedOutput: string; hidden?: boolean }> = [];

    // First, check if we need to generate test cases (if all are placeholders)
    const placeholders = ['see problem', 'see solution', 'see example', 'n/a', 'todo'];
    const hasValidInputs = problem.testCases.some(tc => {
      const input = (tc.input || '').trim().toLowerCase();
      return input && !placeholders.some(p => input.includes(p));
    });

    // If no valid inputs, generate test cases first using the test case generator
    if (!hasValidInputs || problem.testCases.length === 0) {
      const { generateTestCases } = await import('./testCaseGenerator');
      const generated = generateTestCases(solutionCode, functionName, problem.id);
      
      if (generated.length > 0) {
        // Use generated test cases
        for (const genTc of generated) {
          // Execute solution to get expected output for generated test case
          const expectedOutput = await executeSolutionForExpectedOutput(
            solutionCode,
            functionName,
            genTc.input,
            runPythonCode
          );

          if (expectedOutput && expectedOutput !== 'N/A' && expectedOutput !== 'ERROR') {
            fixedTestCases.push({
              input: genTc.input,
              expectedOutput: expectedOutput,
              hidden: genTc.hidden ?? false
            });
            fixedCount++;
          } else if (genTc.expectedOutput && genTc.expectedOutput !== 'N/A') {
            // Use computed expected output from generator if execution failed
            fixedTestCases.push({
              input: genTc.input,
              expectedOutput: genTc.expectedOutput,
              hidden: genTc.hidden ?? false
            });
            fixedCount++;
          }
        }
      }
    } else {
      // We have valid inputs, execute solution for each test case
      for (const testCase of problem.testCases) {
        const fixedTestCase = { ...testCase };
        
        const input = (testCase.input || '').trim();
        const inputLower = input.toLowerCase();
        
        // Skip placeholder inputs
        if (!input || placeholders.some(p => inputLower.includes(p))) {
          fixedTestCases.push(fixedTestCase);
          continue;
        }

        // Skip if expected output is already valid
        if (testCase.expectedOutput && 
            testCase.expectedOutput.trim() !== '' &&
            !testCase.expectedOutput.toLowerCase().includes('see') &&
            !testCase.expectedOutput.toLowerCase().includes('n/a')) {
          fixedTestCases.push(fixedTestCase);
          continue;
        }

        // Execute solution to get expected output
        const expectedOutput = await executeSolutionForExpectedOutput(
          solutionCode,
          functionName,
          testCase.input,
          runPythonCode
        );

        if (expectedOutput && expectedOutput !== 'N/A' && expectedOutput !== 'ERROR') {
          fixedTestCase.expectedOutput = expectedOutput;
          fixedCount++;
        }
        
        fixedTestCases.push(fixedTestCase);
      }
    }

    return {
      problemId: problem.id,
      title: problem.title,
      fixed: fixedCount > 0,
      testCasesGenerated: fixedCount,
      fixedTestCases: fixedCount > 0 ? fixedTestCases : undefined
    };
  } catch (error: any) {
    return {
      problemId: problem.id,
      title: problem.title,
      fixed: false,
      error: error.message || String(error)
    };
  }
}

/**
 * Fix all problems by executing their solutions
 * 
 * Usage: Run this in browser console after app loads
 * This will fix problems AND export them so they can be saved
 */
export async function fixAllProblems(): Promise<{
  total: number;
  fixed: number;
  failed: number;
  results: FixResult[];
  fixedProblems: Array<{ id: string; testCases: Array<{ input: string; expectedOutput: string; hidden?: boolean }> }>;
}> {
  console.log('🔧 Starting to fix practice exercises by executing solutions...');
  console.log('This will take a while for hundreds of exercises...\n');

  const problems = getAllPracticeExercises();
  console.log(`Found ${problems.length} exercises\n`);

  const results: FixResult[] = [];
  const fixedProblems: Array<{ id: string; testCases: Array<{ input: string; expectedOutput: string; hidden?: boolean }> }> = [];
  let fixedCount = 0;
  let failedCount = 0;

  // Process in batches
  const batchSize = 5;
  for (let i = 0; i < problems.length; i += batchSize) {
    const batch = problems.slice(i, i + batchSize);
    const processed = Math.min(i + batchSize, problems.length);
    
    console.log(`Fixing ${processed}/${problems.length}...`);

    const batchResults = await Promise.all(
      batch.map(problem => fixProblem(problem))
    );

    for (const result of batchResults) {
      results.push(result);
      if (result.fixed && result.fixedTestCases) {
        fixedCount++;
        fixedProblems.push({
          id: result.problemId,
          testCases: result.fixedTestCases
        });
        console.log(`✓ Fixed ${result.problemId}: ${result.testCasesGenerated} test cases`);
      } else if (result.error) {
        failedCount++;
        console.log(`✗ Failed ${result.problemId}: ${result.error}`);
      }
    }

    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✅ Fix Complete!');
  console.log(`Total: ${problems.length}`);
  console.log(`Fixed: ${fixedCount}`);
  console.log(`Failed: ${failedCount}`);

  // Export fixed problems as JSON for download
  const exportData = {
    timestamp: new Date().toISOString(),
    total: problems.length,
    fixed: fixedCount,
    failed: failedCount,
    fixes: fixedProblems
  };

  // Download the fixes
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `problem-fixes-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);

  console.log('\n📥 Fixed problems exported to JSON file!');
  console.log('You can use this file to update the source code.');

  return {
    total: problems.length,
    fixed: fixedCount,
    failed: failedCount,
    results,
    fixedProblems
  };
}

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).fixAllProblems = fixAllProblems;
  console.log('🔧 Problem fixer loaded! Run: fixAllProblems() to actually fix problems');
}

