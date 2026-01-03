/**
 * Test Case Generator
 * 
 * Generates proper test cases for problems that have empty or placeholder test cases.
 * Analyzes the solution code and function signature to generate appropriate test inputs.
 */

/**
 * Generate test cases based on function signature and solution code
 * 
 * For problems where we can't execute the code, we use pattern matching
 * and known algorithms to generate correct test cases.
 */
export function generateTestCases(
  solutionCode: string,
  functionName: string,
  problemId: string
): Array<{ input: string; expectedOutput: string; hidden: boolean }> {
  // Extract function signature
  const funcMatch = solutionCode.match(new RegExp(`def\\s+${functionName}\\s*\\(([^)]*)\\)`));
  if (!funcMatch) {
    return [];
  }

  const params = funcMatch[1].trim();
  const paramNames = params.split(',').map(p => p.split(':')[0].trim()).filter(p => p && p !== 'self');
  
  // Try to detect algorithm from solution code
  const codeLower = solutionCode.toLowerCase();
  const isClimbStairs = codeLower.includes('climb') || codeLower.includes('stair') || 
                        problemId.includes('climb');
  const isFibonacci = codeLower.includes('fib') || problemId.includes('fib');
  const isTwoSum = codeLower.includes('two') && codeLower.includes('sum') || problemId.includes('two_sum');
  const isMatrixSum = codeLower.includes('matrix') || codeLower.includes('2d') || 
                      codeLower.includes('nested') || problemId.includes('matrix') || problemId.includes('2d');

  // Generate test cases based on common patterns
  const testCases: Array<{ input: string; expectedOutput: string; hidden: boolean }> = [];

  // Pattern 1: Single integer parameter (like climb_stairs, fibonacci)
  // Input format: just the value, not "n = 1"
  if (paramNames.length === 1 && paramNames[0].match(/^[a-z]$/)) {
    testCases.push(
      { input: '1', expectedOutput: '1', hidden: false },
      { input: '2', expectedOutput: '2', hidden: false },
      { input: '3', expectedOutput: '3', hidden: false },
      { input: '5', expectedOutput: '8', hidden: false }
    );
  }

  // Pattern 2: Two parameters - detect types from parameter names
  if (paramNames.length === 2) {
    const [p1, p2] = paramNames;

    // Two strings (like count_char(s, target))
    // Use more specific matching to avoid false positives like 'groups'.includes('s')
    const isStringParam1 = p1 === 's' || p1 === 'str' || p1 === 'text' || p1 === 'string' || p1.startsWith('str');
    const isCharParam2 = p2 === 'c' || p2 === 'char' || p2 === 'target' || p2.includes('char');
    if (isStringParam1 || isCharParam2) {
      testCases.push(
        { input: '"hello", "l"', expectedOutput: '2', hidden: false },
        { input: '"Python", "P"', expectedOutput: '1', hidden: false },
        { input: '"hello", "x"', expectedOutput: '0', hidden: false }
      );
    }
    // String and integer (like find_char(s, n))
    // Use more specific matching
    else if ((p1 === 's' || p1 === 'str' || p1 === 'string') &&
             (p2 === 'n' || p2 === 'num' || p2 === 'i' || p2 === 'idx' || p2 === 'index')) {
      testCases.push(
        { input: '"hello", 0', expectedOutput: '"h"', hidden: false },
        { input: '"world", 2', expectedOutput: '"r"', hidden: false }
      );
    }
    // Two integers
    else if (paramNames.every(p => p.match(/^[a-z]$/))) {
      testCases.push(
        { input: '1, 2', expectedOutput: '3', hidden: false },
        { input: '5, 3', expectedOutput: '8', hidden: false },
        { input: '10, 20', expectedOutput: '30', hidden: false }
      );
    }
  }

  // Pattern 3: Array/List parameter
  // Input format: just the array literal
  if (paramNames.some(p => p.includes('arr') || p.includes('list') || p.includes('nums') || p.includes('array'))) {
    testCases.push(
      { input: '[1, 2, 3]', expectedOutput: '6', hidden: false },
      { input: '[1, 2, 3, 4, 5]', expectedOutput: '15', hidden: false },
      { input: '[]', expectedOutput: '0', hidden: false }
    );
  }

  // Pattern 4: String parameter
  // Input format: just the string literal
  // Use more specific matching to avoid false positives
  if (paramNames.some(p => p === 's' || p === 'str' || p === 'string' || p === 'text' || p.startsWith('str'))) {
    testCases.push(
      { input: '"hello"', expectedOutput: '"hello"', hidden: false },
      { input: '"world"', expectedOutput: '"world"', hidden: false },
      { input: '""', expectedOutput: '""', hidden: false }
    );
  }

  // Pattern 5: Specific problem patterns with computed expected outputs
  // Input format: just the value(s), not "n = 1"
  if (isClimbStairs || problemId.includes('climb_stairs') || problemId.includes('climb-stairs')) {
    testCases.length = 0; // Clear generic cases
    // Climb stairs: ways(n) = ways(n-1) + ways(n-2), base cases: 1->1, 2->2
    const climbStairs = (n: number): number => {
      if (n <= 2) return n;
      let prev = 1, curr = 2;
      for (let i = 3; i <= n; i++) {
        [prev, curr] = [curr, prev + curr];
      }
      return curr;
    };
    testCases.push(
      { input: '1', expectedOutput: String(climbStairs(1)), hidden: false },
      { input: '2', expectedOutput: String(climbStairs(2)), hidden: false },
      { input: '3', expectedOutput: String(climbStairs(3)), hidden: false },
      { input: '4', expectedOutput: String(climbStairs(4)), hidden: false },
      { input: '5', expectedOutput: String(climbStairs(5)), hidden: false }
    );
  }

  if (isFibonacci || problemId.includes('fibonacci') || problemId.includes('fib')) {
    testCases.length = 0;
    // Fibonacci: fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2)
    const fibonacci = (n: number): number => {
      if (n <= 1) return n;
      let prev = 0, curr = 1;
      for (let i = 2; i <= n; i++) {
        [prev, curr] = [curr, prev + curr];
      }
      return curr;
    };
    testCases.push(
      { input: '0', expectedOutput: String(fibonacci(0)), hidden: false },
      { input: '1', expectedOutput: String(fibonacci(1)), hidden: false },
      { input: '2', expectedOutput: String(fibonacci(2)), hidden: false },
      { input: '5', expectedOutput: String(fibonacci(5)), hidden: false },
      { input: '10', expectedOutput: String(fibonacci(10)), hidden: false }
    );
  }

  if (isTwoSum || problemId.includes('two_sum') || problemId.includes('two-sum')) {
    testCases.length = 0;
    // Two sum: array and target - format as tuple
    testCases.push(
      { input: '([2, 7, 11, 15], 9)', expectedOutput: '[0, 1]', hidden: false },
      { input: '([3, 2, 4], 6)', expectedOutput: '[1, 2]', hidden: false },
      { input: '([3, 3], 6)', expectedOutput: '[0, 1]', hidden: false }
    );
  }
  
  // Pattern for count_char specifically
  if (problemId.includes('count_char') || problemId.includes('count-char') || 
      (functionName === 'count_char' && paramNames.length === 2)) {
    testCases.length = 0;
    testCases.push(
      { input: '"hello", "l"', expectedOutput: '2', hidden: false },
      { input: '"Python", "P"', expectedOutput: '1', hidden: false },
      { input: '"hello", "x"', expectedOutput: '0', hidden: false },
      { input: '"mississippi", "s"', expectedOutput: '4', hidden: false }
    );
  }

  if (isMatrixSum || problemId.includes('matrix_sum') || problemId.includes('2d') || problemId.includes('nested-loops')) {
    testCases.length = 0;
    testCases.push(
      { input: '[[1, 2], [3, 4]]', expectedOutput: '10', hidden: false },
      { input: '[[1, 2, 3], [4, 5, 6]]', expectedOutput: '21', hidden: false },
      { input: '[[]]', expectedOutput: '0', hidden: false }
    );
  }

  if (problemId.includes('get_names') || problemId.includes('student')) {
    testCases.length = 0;
    // For OOP problems, we need to create the objects first
    // This is complex - skip for now or use a different approach
    // testCases.push(
    //   { input: '[Student("Alice", 90), Student("Bob", 85)]', expectedOutput: '["Alice", "Bob"]', hidden: false }
    // );
  }

  // If no specific pattern matched and we have generic cases, return them
  // Otherwise, try to execute the solution with sample inputs to generate expected outputs
  if (testCases.length === 0) {
    // Fallback: generate basic test cases based on parameter count
    if (paramNames.length === 1) {
      testCases.push(
        { input: '1', expectedOutput: '1', hidden: false },
        { input: '2', expectedOutput: '2', hidden: false }
      );
    } else if (paramNames.length === 2) {
      testCases.push(
        { input: '1, 2', expectedOutput: '3', hidden: false },
        { input: '2, 3', expectedOutput: '5', hidden: false }
      );
    }
  }

  return testCases;
}

/**
 * Check if test cases are empty or contain placeholders
 */
export function hasInvalidTestCases(testCases: Array<{ input: string; expectedOutput: string }>): boolean {
  if (!testCases || testCases.length === 0) {
    return true;
  }

  const placeholders = ['see problem', 'see solution', 'see example', 'n/a', 'todo'];
  
  return testCases.every(tc => {
    const input = (tc.input || '').trim();
    const expected = (tc.expectedOutput || '').trim();
    
    // Empty
    if (input === '' && expected === '') return true;
    
    // Placeholder
    if (placeholders.some(p => input.toLowerCase().includes(p))) return true;
    if (placeholders.some(p => expected.toLowerCase().includes(p))) return true;
    
    return false;
  });
}

/**
 * Compute expected output by analyzing solution code
 * This is a best-effort approach - for accurate results, solutions should be executed
 */
function computeExpectedOutput(
  solutionCode: string,
  functionName: string,
  input: string,
  problemId: string
): string | null {
  // For known algorithms, compute expected output
  if (problemId.includes('climb_stairs') || problemId.includes('climb-stairs')) {
    const n = parseInt(input);
    if (!isNaN(n)) {
      if (n <= 2) return String(n);
      let prev = 1, curr = 2;
      for (let i = 3; i <= n; i++) {
        [prev, curr] = [curr, prev + curr];
      }
      return String(curr);
    }
  }

  if (problemId.includes('fibonacci') || problemId.includes('fib')) {
    const n = parseInt(input);
    if (!isNaN(n)) {
      if (n <= 1) return String(n);
      let prev = 0, curr = 1;
      for (let i = 2; i <= n; i++) {
        [prev, curr] = [curr, prev + curr];
      }
      return String(curr);
    }
  }

  if (problemId.includes('matrix_sum') || problemId.includes('2d') || problemId.includes('nested-loops')) {
    // Try to parse as 2D array and sum
    try {
      const matrix = JSON.parse(input.replace(/'/g, '"'));
      if (Array.isArray(matrix)) {
        let sum = 0;
        for (const row of matrix) {
          if (Array.isArray(row)) {
            for (const val of row) {
              sum += typeof val === 'number' ? val : 0;
            }
          }
        }
        return String(sum);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  if (problemId.includes('count_char') || functionName === 'count_char') {
    // Parse input as "string", "char"
    try {
      const match = input.match(/"([^"]+)",\s*"([^"]+)"/);
      if (match) {
        const [, str, char] = match;
        let count = 0;
        for (let i = 0; i < str.length; i++) {
          if (str[i] === char) count++;
        }
        return String(count);
      }
    } catch (e) {
      // Ignore
    }
  }

  // For sum operations on arrays
  if (solutionCode.includes('sum(') || solutionCode.includes('+= ') || solutionCode.includes('total')) {
    try {
      const arr = JSON.parse(input.replace(/'/g, '"'));
      if (Array.isArray(arr)) {
        const sum = arr.reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0);
        return String(sum);
      }
    } catch (e) {
      // Ignore
    }
  }

  return null;
}

/**
 * Execute solution code with test input to get expected output using Pyodide
 * This actually runs the Python code to compute correct expected outputs
 */
export async function executeSolutionForExpectedOutput(
  solutionCode: string,
  functionName: string,
  input: string,
  runPythonCode?: (code: string) => Promise<{ output: string; error?: string }>
): Promise<string | null> {
  if (!runPythonCode) {
    return null;
  }

  try {
    // Parse input based on format
    let parsedInput: any;
    try {
      // Try parsing as JSON first
      parsedInput = JSON.parse(input.replace(/'/g, '"'));
    } catch {
      // If not JSON, try as Python literal
      parsedInput = input;
    }

    // Build test code that calls the function with the input
    const testCode = `
${solutionCode}

# Test input
test_input = ${typeof parsedInput === 'string' ? JSON.stringify(parsedInput) : JSON.stringify(parsedInput)}

# Call function
try:
    if isinstance(test_input, tuple):
        result = ${functionName}(*test_input)
    elif isinstance(test_input, list) and len(test_input) > 0 and not isinstance(test_input[0], (int, float, str, bool, type(None))):
        # Multiple arguments as list
        result = ${functionName}(*test_input)
    else:
        result = ${functionName}(test_input)
    print(result)
except Exception as e:
    print(f"ERROR: {e}")
`;

    const result = await runPythonCode(testCode);
    
    if (result.error) {
      return null;
    }

    // Extract the output (should be the result)
    const output = result.output.trim();
    if (output.startsWith('ERROR:')) {
      return null;
    }

    return output;
  } catch (e) {
    return null;
  }
}

/**
 * Fix test cases for a problem by generating them if missing
 */
export function fixTestCases(
  problem: {
    id: string;
    solution: string | Map<string, string>;
    testCases: Array<{ input: string; expectedOutput: string; hidden?: boolean }>;
  }
): Array<{ input: string; expectedOutput: string; hidden: boolean }> {
  // If test cases are valid, return them
  if (!hasInvalidTestCases(problem.testCases)) {
    return problem.testCases.map(tc => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      hidden: tc.hidden ?? false
    }));
  }

  // Extract solution code
  let solutionCode = '';
  if (typeof problem.solution === 'string') {
    solutionCode = problem.solution;
  } else if (problem.solution instanceof Map) {
    solutionCode = problem.solution.get('python') || '';
  }

  if (!solutionCode) {
    // Can't generate test cases without solution
    return [];
  }

  // Detect function name
  const funcMatches = Array.from(solutionCode.matchAll(/def\s+([A-Za-z_]\w*)\s*\(/g));
  if (funcMatches.length === 0) {
    return [];
  }

  // Find the main function (skip __init__, methods with self, etc.)
  let functionName = '';
  for (const match of funcMatches) {
    const name = match[1];
    const params = solutionCode.substring(match.index! + match[0].length);
    const paramMatch = params.match(/^([^)]*)\)/);
    const paramStr = paramMatch ? paramMatch[1] : '';
    
    if (name !== '__init__' && !paramStr.includes('self') && !name.startsWith('__')) {
      functionName = name;
      break;
    }
  }

  if (!functionName) {
    return [];
  }

  // Generate test cases
  const generated = generateTestCases(solutionCode, functionName, problem.id);
  
  // Try to compute expected outputs for generated test cases
  return generated.map(tc => {
    // If expected output is generic, try to compute it
    if (tc.expectedOutput === '1' || tc.expectedOutput === '2' || tc.expectedOutput === '3') {
      const computed = computeExpectedOutput(solutionCode, functionName, tc.input, problem.id);
      if (computed) {
        return { ...tc, expectedOutput: computed };
      }
    }
    return tc;
  });
}

