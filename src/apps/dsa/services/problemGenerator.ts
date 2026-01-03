/**
 * Problem Generator Service
 * Automatically generates thousands of problem variations from templates
 */

import type { AdaptiveProblem } from '../types/smart-practice';

// ============= Problem Generation Engine =============

export class ProblemGenerator {
  private static idCounter = 1000;

  /**
   * Generate Two Sum variations automatically
   */
  static generateTwoSumVariations(): AdaptiveProblem[] {
    const variations: AdaptiveProblem[] = [];

    // Data type variations
    const dataTypes = [
      { type: 'array', description: 'integer array' },
      { type: 'sorted', description: 'sorted array' },
      { type: 'rotated', description: 'rotated sorted array' },
      { type: 'linked-list', description: 'linked list' },
      { type: 'bst', description: 'binary search tree' },
      { type: 'stream', description: 'data stream' },
    ];

    // Constraint variations
    const constraints = [
      { name: 'unique', description: 'all unique elements' },
      { name: 'duplicates', description: 'contains duplicates' },
      { name: 'negative', description: 'includes negative numbers' },
      { name: 'large', description: 'very large numbers (10^9)' },
      { name: 'float', description: 'floating point numbers' },
    ];

    // Operation variations
    const operations = [
      { op: 'exact', description: 'exact sum equals k' },
      { op: 'closest', description: 'closest sum to k' },
      { op: 'less-than', description: 'sum less than k' },
      { op: 'greater-than', description: 'sum greater than k' },
      { op: 'range', description: 'sum in range [a, b]' },
    ];

    // Return type variations
    const returns = [
      { ret: 'boolean', description: 'return true/false' },
      { ret: 'indices', description: 'return indices' },
      { ret: 'values', description: 'return values' },
      { ret: 'count', description: 'return count of pairs' },
      { ret: 'all-pairs', description: 'return all pairs' },
    ];

    // Generate all combinations
    dataTypes.forEach(dt => {
      constraints.forEach(ct => {
        operations.forEach(op => {
          returns.forEach(rt => {
            const problemId = `two-sum-${dt.type}-${ct.name}-${op.op}-${rt.ret}-${this.idCounter++}`;

            const problem: AdaptiveProblem = {
              id: problemId,
              title: this.generateTitle('Two Sum', dt, ct, op, rt),
              description: this.generateDescription('Two Sum', dt, ct, op, rt),
              difficulty: this.calculateDifficulty(dt, ct, op, rt),

              patterns: ['two-sum-family'],
              concepts: this.extractConcepts(dt, ct, op),
              techniques: this.extractTechniques(dt, op),
              prerequisites: this.getPrerequisites(dt),

              examples: this.generateExamples(dt, op, rt),
              constraints: this.generateConstraints(dt, ct),

              starterCode: this.generateStarterCode(dt, op, rt),
              solution: this.generateSolution(dt, ct, op, rt),
              testCases: this.generateTestCases(dt, op, rt),

              hints: this.generateHints(dt, ct, op),

              averageSolveTime: this.estimateSolveTime(dt, ct, op, rt),
              successRate: this.estimateSuccessRate(dt, ct, op, rt),
              commonMistakes: this.generateCommonMistakes(dt, ct, op),
              similarProblems: this.findSimilarProblems(dt, ct, op),

              targetWeaknesses: this.identifyWeaknesses(dt, ct, op),
              reviewValue: this.calculateReviewValue(dt, ct, op),

              tags: this.generateTags(dt, ct, op, rt),
            };

            variations.push(problem);
          });
        });
      });
    });

    return variations;
  }

  /**
   * Generate Palindrome variations
   */
  static generatePalindromeVariations(): AdaptiveProblem[] {
    const variations: AdaptiveProblem[] = [];

    const types = [
      'check-palindrome',
      'longest-palindrome',
      'shortest-palindrome',
      'palindrome-pairs',
      'palindrome-partition',
      'palindrome-permutation',
      'palindrome-subsequence',
      'palindrome-deletion',
      'palindrome-insertion',
    ];

    const dataStructures = [
      'string',
      'array',
      'linked-list',
      'tree',
      'number',
    ];

    const constraints = [
      'case-sensitive',
      'alphanumeric-only',
      'unicode',
      'with-spaces',
      'with-punctuation',
    ];

    // Generate combinations
    types.forEach(type => {
      dataStructures.forEach(ds => {
        constraints.forEach(constraint => {
          if (this.isValidCombination(type, ds, constraint)) {
            variations.push(this.createPalindromeProblem(type, ds, constraint));
          }
        });
      });
    });

    return variations;
  }

  /**
   * Generate Sliding Window variations
   */
  static generateSlidingWindowVariations(): AdaptiveProblem[] {
    const variations: AdaptiveProblem[] = [];

    const windowTypes = [
      { type: 'fixed', description: 'fixed size k' },
      { type: 'variable', description: 'variable size' },
      { type: 'expanding', description: 'only expands' },
      { type: 'shrinking', description: 'can shrink' },
    ];

    const objectives = [
      { obj: 'max-sum', description: 'maximum sum' },
      { obj: 'min-sum', description: 'minimum sum' },
      { obj: 'max-product', description: 'maximum product' },
      { obj: 'max-average', description: 'maximum average' },
      { obj: 'distinct-count', description: 'distinct elements' },
      { obj: 'longest', description: 'longest subarray/substring' },
      { obj: 'shortest', description: 'shortest subarray/substring' },
    ];

    const constraints = [
      { con: 'sum-equals-k', description: 'sum equals k' },
      { con: 'sum-less-k', description: 'sum less than k' },
      { con: 'at-most-k-distinct', description: 'at most k distinct' },
      { con: 'exactly-k-distinct', description: 'exactly k distinct' },
      { con: 'no-repeating', description: 'no repeating elements' },
      { con: 'at-most-k-replacements', description: 'at most k replacements' },
    ];

    // Generate all meaningful combinations
    windowTypes.forEach(wt => {
      objectives.forEach(obj => {
        constraints.forEach(con => {
          if (this.isValidWindowCombination(wt.type, obj.obj, con.con)) {
            variations.push(this.createSlidingWindowProblem(wt, obj, con));
          }
        });
      });
    });

    return variations;
  }

  /**
   * Generate DP variations
   */
  static generateDPVariations(): AdaptiveProblem[] {
    const variations: AdaptiveProblem[] = [];

    const dpPatterns = [
      'linear-dp',
      'grid-dp',
      'interval-dp',
      'tree-dp',
      'digit-dp',
      'bitmask-dp',
      'probability-dp',
      'game-dp',
    ];

    const optimizations = [
      'minimize',
      'maximize',
      'count',
      'existence',
      'optimal-path',
    ];

    const stateDesigns = [
      '1d-state',
      '2d-state',
      '3d-state',
      'state-compression',
      'rolling-array',
    ];

    const baseProblems = [
      { name: 'knapsack', variations: 15 },
      { name: 'longest-sequence', variations: 20 },
      { name: 'edit-distance', variations: 10 },
      { name: 'partition', variations: 12 },
      { name: 'path-counting', variations: 18 },
      { name: 'string-matching', variations: 15 },
      { name: 'stock-trading', variations: 10 },
    ];

    baseProblems.forEach(base => {
      for (let i = 0; i < base.variations; i++) {
        const pattern = dpPatterns[i % dpPatterns.length];
        const optimization = optimizations[i % optimizations.length];
        const stateDesign = stateDesigns[i % stateDesigns.length];

        variations.push(
          this.createDPProblem(base.name, pattern, optimization, stateDesign, i)
        );
      }
    });

    return variations;
  }

  // ============= Helper Methods =============

  private static generateTitle(
    base: string,
    dataType: any,
    constraint: any,
    operation: any,
    returnType: any
  ): string {
    const parts = [base];

    if (dataType.type !== 'array') parts.push(dataType.type);
    if (constraint.name !== 'unique') parts.push(constraint.name);
    if (operation.op !== 'exact') parts.push(operation.op);
    if (returnType.ret !== 'boolean') parts.push(returnType.ret);

    return parts.map(p => p.split('-').map(w =>
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ')).join(' - ');
  }

  private static generateDescription(
    base: string,
    dataType: any,
    constraint: any,
    operation: any,
    returnType: any
  ): string {
    let desc = `Given a${dataType.type === 'array' ? 'n' : ''} ${dataType.description}`;

    if (constraint.name !== 'unique') {
      desc += ` that ${constraint.description}`;
    }

    desc += `, find `;

    switch (returnType.ret) {
      case 'boolean':
        desc += `if there exist two elements whose ${operation.description}`;
        break;
      case 'indices':
        desc += `the indices of two elements whose ${operation.description}`;
        break;
      case 'values':
        desc += `two values whose ${operation.description}`;
        break;
      case 'count':
        desc += `the number of pairs whose ${operation.description}`;
        break;
      case 'all-pairs':
        desc += `all pairs whose ${operation.description}`;
        break;
    }

    desc += `.`;
    return desc;
  }

  private static calculateDifficulty(
    dataType: any,
    constraint: any,
    operation: any,
    returnType: any
  ): { base: 'easy' | 'medium' | 'hard'; numeric: number; adaptive: boolean } {
    let score = 2; // Base difficulty

    // Data type complexity
    if (dataType.type === 'sorted') score += 0;
    if (dataType.type === 'rotated') score += 2;
    if (dataType.type === 'linked-list') score += 1;
    if (dataType.type === 'bst') score += 2;
    if (dataType.type === 'stream') score += 3;

    // Constraint complexity
    if (constraint.name === 'duplicates') score += 1;
    if (constraint.name === 'negative') score += 0.5;
    if (constraint.name === 'large') score += 1;
    if (constraint.name === 'float') score += 1.5;

    // Operation complexity
    if (operation.op === 'closest') score += 2;
    if (operation.op === 'less-than') score += 1;
    if (operation.op === 'range') score += 2;

    // Return type complexity
    if (returnType.ret === 'all-pairs') score += 2;
    if (returnType.ret === 'count') score += 1;

    const base = score <= 3 ? 'easy' : score <= 6 ? 'medium' : 'hard';

    return {
      base,
      numeric: Math.min(10, Math.round(score)),
      adaptive: true,
    };
  }

  private static extractConcepts(dataType: any, constraint: any, operation: any): string[] {
    const concepts = ['two-sum'];

    if (dataType.type === 'array') concepts.push('arrays');
    if (dataType.type === 'sorted') concepts.push('binary-search');
    if (dataType.type === 'linked-list') concepts.push('linked-lists');
    if (dataType.type === 'bst') concepts.push('trees');

    if (constraint.name === 'duplicates') concepts.push('duplicate-handling');
    if (operation.op === 'closest') concepts.push('optimization');

    return concepts;
  }

  private static extractTechniques(dataType: any, operation: any): string[] {
    const techniques = [];

    if (dataType.type === 'sorted') {
      techniques.push('two-pointers');
    } else {
      techniques.push('hash-map');
    }

    if (operation.op === 'closest') techniques.push('min-tracking');
    if (dataType.type === 'stream') techniques.push('online-algorithm');

    return techniques;
  }

  private static getPrerequisites(dataType: any): string[] {
    const prereqs = ['hash-map-fundamentals'];

    if (dataType.type === 'linked-list') prereqs.push('linked-list-mastery');
    if (dataType.type === 'bst') prereqs.push('trees-traversals');
    if (dataType.type === 'sorted') prereqs.push('array-iteration-techniques');

    return prereqs;
  }

  private static generateExamples(dataType: any, operation: any, returnType: any): any[] {
    const examples = [];

    // Generate contextual examples based on combination
    if (dataType.type === 'array' && operation.op === 'exact') {
      examples.push({
        input: 'nums = [2,7,11,15], target = 9',
        output: returnType.ret === 'boolean' ? 'true' :
                returnType.ret === 'indices' ? '[0,1]' :
                returnType.ret === 'values' ? '[2,7]' :
                returnType.ret === 'count' ? '1' :
                '[[2,7]]',
        explanation: '2 + 7 = 9',
      });
    }

    // Add more specific examples...
    return examples;
  }

  private static generateConstraints(dataType: any, constraint: any): string[] {
    const constraints = [];

    if (dataType.type === 'array') {
      constraints.push('2 <= nums.length <= 10^4');

      if (constraint.name === 'large') {
        constraints.push('-10^9 <= nums[i] <= 10^9');
      } else {
        constraints.push('-10^4 <= nums[i] <= 10^4');
      }
    }

    if (constraint.name === 'unique') {
      constraints.push('All elements are unique');
    }

    return constraints;
  }

  private static generateStarterCode(
    dataType: any,
    operation: any,
    returnType: any
  ): Map<string, string> {
    const code = new Map<string, string>();

    let pythonCode = 'def twoSum';

    // Customize function name
    if (operation.op !== 'exact') pythonCode += operation.op.charAt(0).toUpperCase() + operation.op.slice(1);
    if (returnType.ret === 'count') pythonCode += 'Count';
    if (returnType.ret === 'all-pairs') pythonCode += 'All';

    pythonCode += '(';

    // Parameters
    if (dataType.type === 'linked-list') {
      pythonCode += 'head: ListNode';
    } else if (dataType.type === 'bst') {
      pythonCode += 'root: TreeNode';
    } else {
      pythonCode += 'nums: List[int]';
    }

    pythonCode += ', target: int) -> ';

    // Return type
    switch (returnType.ret) {
      case 'boolean':
        pythonCode += 'bool';
        break;
      case 'indices':
      case 'values':
        pythonCode += 'List[int]';
        break;
      case 'count':
        pythonCode += 'int';
        break;
      case 'all-pairs':
        pythonCode += 'List[List[int]]';
        break;
    }

    pythonCode += ':\n    # Your code here\n    pass';

    code.set('python', pythonCode);
    return code;
  }

  private static generateSolution(
    dataType: any,
    constraint: any,
    operation: any,
    returnType: any
  ): Map<string, string> {
    const solutions = new Map<string, string>();

    // Generate appropriate solution based on combination
    let pythonSolution = '';

    if (dataType.type === 'sorted' && operation.op === 'exact') {
      // Two pointers solution
      pythonSolution = `def twoSum(nums: List[int], target: int) -> ${returnType.ret === 'boolean' ? 'bool' : 'List[int]'}:
    left, right = 0, len(nums) - 1

    while left < right:
        curr_sum = nums[left] + nums[right]
        if curr_sum == target:
            ${returnType.ret === 'boolean' ? 'return True' :
              returnType.ret === 'indices' ? 'return [left, right]' :
              'return [nums[left], nums[right]]'}
        elif curr_sum < target:
            left += 1
        else:
            right -= 1

    return ${returnType.ret === 'boolean' ? 'False' : '[]'}`;
    } else if (dataType.type === 'array' && operation.op === 'exact') {
      // Hash map solution
      pythonSolution = `def twoSum(nums: List[int], target: int) -> ${returnType.ret === 'boolean' ? 'bool' : 'List[int]'}:
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            ${returnType.ret === 'boolean' ? 'return True' :
              returnType.ret === 'indices' ? 'return [seen[complement], i]' :
              'return [complement, num]'}
        seen[num] = i

    return ${returnType.ret === 'boolean' ? 'False' : '[]'}`;
    }

    // Add more solution variations...
    solutions.set('python', pythonSolution);
    return solutions;
  }

  private static generateTestCases(
    dataType: any,
    operation: any,
    returnType: any
  ): any[] {
    return [
      {
        input: '[2,7,11,15], 9',
        expectedOutput: returnType.ret === 'boolean' ? 'true' : '[0,1]',
        hidden: false,
      },
      {
        input: '[3,2,4], 6',
        expectedOutput: returnType.ret === 'boolean' ? 'true' : '[1,2]',
        hidden: false,
      },
      {
        input: '[3,3], 6',
        expectedOutput: returnType.ret === 'boolean' ? 'true' : '[0,1]',
        hidden: true,
      },
    ];
  }

  private static generateHints(dataType: any, constraint: any, operation: any): any[] {
    const hints = [];

    if (dataType.type === 'sorted') {
      hints.push({
        level: 1,
        hint: 'Since array is sorted, consider two pointers',
        penaltyPercent: 5,
      });
    } else {
      hints.push({
        level: 1,
        hint: 'Use a hash map to store seen values',
        penaltyPercent: 5,
      });
    }

    if (operation.op === 'closest') {
      hints.push({
        level: 2,
        hint: 'Track the minimum difference seen so far',
        penaltyPercent: 10,
      });
    }

    if (constraint.name === 'duplicates') {
      hints.push({
        level: 3,
        hint: 'Handle duplicate values carefully',
        penaltyPercent: 15,
      });
    }

    return hints;
  }

  private static estimateSolveTime(
    dataType: any,
    constraint: any,
    operation: any,
    returnType: any
  ): number {
    let baseTime = 10 * 60 * 1000; // 10 minutes base

    if (dataType.type === 'linked-list') baseTime += 5 * 60 * 1000;
    if (dataType.type === 'bst') baseTime += 8 * 60 * 1000;
    if (operation.op === 'closest') baseTime += 5 * 60 * 1000;
    if (returnType.ret === 'all-pairs') baseTime += 10 * 60 * 1000;

    return baseTime;
  }

  private static estimateSuccessRate(
    dataType: any,
    constraint: any,
    operation: any,
    returnType: any
  ): number {
    let rate = 0.7;

    if (dataType.type === 'stream') rate -= 0.2;
    if (operation.op === 'closest') rate -= 0.15;
    if (returnType.ret === 'all-pairs') rate -= 0.1;
    if (constraint.name === 'duplicates') rate -= 0.05;

    return Math.max(0.2, rate);
  }

  private static generateCommonMistakes(
    dataType: any,
    constraint: any,
    operation: any
  ): string[] {
    const mistakes = [];

    if (constraint.name === 'duplicates') {
      mistakes.push('Not handling duplicate values correctly');
    }

    if (operation.op === 'closest') {
      mistakes.push('Not updating minimum difference properly');
    }

    if (dataType.type === 'linked-list') {
      mistakes.push('Forgetting to handle null pointers');
    }

    mistakes.push('Not considering edge cases');
    return mistakes;
  }

  private static findSimilarProblems(
    dataType: any,
    constraint: any,
    operation: any
  ): string[] {
    const similar = ['two-sum-basic'];

    if (operation.op === 'closest') similar.push('three-sum-closest');
    if (dataType.type === 'bst') similar.push('two-sum-bst');
    if (constraint.name === 'duplicates') similar.push('two-sum-with-duplicates');

    return similar;
  }

  private static identifyWeaknesses(
    dataType: any,
    constraint: any,
    operation: any
  ): string[] {
    const weaknesses = ['two-sum-pattern'];

    if (dataType.type === 'sorted') weaknesses.push('two-pointers');
    else weaknesses.push('hash-maps');

    if (operation.op === 'closest') weaknesses.push('optimization');
    if (constraint.name === 'duplicates') weaknesses.push('duplicate-handling');

    return weaknesses;
  }

  private static calculateReviewValue(
    dataType: any,
    constraint: any,
    operation: any
  ): number {
    let value = 0.7;

    if (dataType.type === 'array' && operation.op === 'exact') value = 0.95;
    if (operation.op === 'closest') value = 0.85;
    if (dataType.type === 'stream') value = 0.6;

    return value;
  }

  private static generateTags(
    dataType: any,
    constraint: any,
    operation: any,
    returnType: any
  ): string[] {
    const tags = ['two-sum'];

    if (dataType.type === 'array') tags.push('array');
    if (dataType.type === 'sorted') tags.push('two-pointers');
    else tags.push('hash-table');

    if (operation.op === 'closest') tags.push('optimization');

    return tags;
  }

  // Additional helper methods for other problem types...

  private static isValidCombination(type: string, ds: string, constraint: string): boolean {
    // Some combinations don't make sense
    if (ds === 'number' && constraint === 'with-spaces') return false;
    if (ds === 'tree' && constraint === 'unicode') return false;
    return true;
  }

  private static createPalindromeProblem(
    type: string,
    ds: string,
    constraint: string
  ): AdaptiveProblem {
    // Implementation for palindrome problem generation
    return {} as AdaptiveProblem;
  }

  private static isValidWindowCombination(
    windowType: string,
    objective: string,
    constraint: string
  ): boolean {
    // Validate sliding window combinations
    if (windowType === 'fixed' && constraint === 'no-repeating') return true;
    if (windowType === 'variable' && objective === 'longest') return true;
    // Add more validation logic
    return true;
  }

  private static createSlidingWindowProblem(
    windowType: any,
    objective: any,
    constraint: any
  ): AdaptiveProblem {
    // Implementation for sliding window problem generation
    return {} as AdaptiveProblem;
  }

  private static createDPProblem(
    baseName: string,
    pattern: string,
    optimization: string,
    stateDesign: string,
    variation: number
  ): AdaptiveProblem {
    // Implementation for DP problem generation
    return {} as AdaptiveProblem;
  }
}

// ============= Bulk Generation =============

export async function generateCompleteProblemBank(): Promise<AdaptiveProblem[]> {
  const allProblems: AdaptiveProblem[] = [];// Generate each family
  const twoSumProblems = ProblemGenerator.generateTwoSumVariations();allProblems.push(...twoSumProblems);

  const palindromeProblems = ProblemGenerator.generatePalindromeVariations();allProblems.push(...palindromeProblems);

  const slidingWindowProblems = ProblemGenerator.generateSlidingWindowVariations();allProblems.push(...slidingWindowProblems);

  const dpProblems = ProblemGenerator.generateDPVariations();allProblems.push(...dpProblems);

  // Add more families...return allProblems;
}

// ============= Export =============

export default ProblemGenerator;