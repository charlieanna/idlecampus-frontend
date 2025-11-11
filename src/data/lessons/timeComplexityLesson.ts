import type { MultiStageLesson } from '../../types/multiStage';

/**
 * Example Multi-Stage Lesson: Understanding Time Complexity
 *
 * This demonstrates the multi-stage lesson system with:
 * - Concept introduction
 * - Visualizations
 * - Worked examples
 * - Practice problems
 * - Quiz assessment
 */
export const timeComplexityLesson: MultiStageLesson = {
  id: 'time-complexity-basics',
  slug: 'time-complexity-basics',
  title: 'Understanding Time Complexity',
  description:
    'Learn how to analyze algorithm efficiency using Big O notation through interactive visualizations and examples',
  difficulty: 'beginner',
  estimatedMinutes: 45,
  tags: ['algorithms', 'complexity', 'big-o', 'performance'],
  prerequisites: ['basic-programming'],
  learningObjectives: [
    'Understand what time complexity means',
    'Learn Big O notation basics',
    'Analyze simple algorithms',
    'Identify common time complexities',
  ],

  stages: [
    // Stage 1: Introduction to Time Complexity
    {
      id: 'intro-concept',
      type: 'concept',
      title: 'What is Time Complexity?',
      description: 'Understanding how we measure algorithm efficiency',
      estimatedMinutes: 8,
      completionCriteria: {
        type: 'auto',
        allowSkip: false,
      },
      content: {
        markdown: `
# Introduction to Time Complexity

Time complexity is a way to describe how the **runtime** of an algorithm grows as the input size increases. It helps us answer questions like:

- Will this algorithm work fast enough for 1 million items?
- Which sorting algorithm should I choose?
- Can I make my code faster?

## Why Do We Care?

Consider searching for a name in a phone book:

**Method 1: Linear Search** - Check every name one by one
- 100 names: ~50 checks on average
- 1,000 names: ~500 checks on average
- 1,000,000 names: ~500,000 checks 😱

**Method 2: Binary Search** - Use alphabetical order to eliminate half each time
- 100 names: ~7 checks
- 1,000 names: ~10 checks
- 1,000,000 names: ~20 checks 🚀

The difference becomes **massive** as data grows!

## Big O Notation

We express time complexity using **Big O notation**. It describes the worst-case scenario:

- **O(1)** - Constant: Same time regardless of input size
- **O(log n)** - Logarithmic: Doubles input, adds one operation
- **O(n)** - Linear: Time grows directly with input
- **O(n log n)** - Log-linear: Efficient sorting algorithms
- **O(n²)** - Quadratic: Nested loops over input
- **O(2ⁿ)** - Exponential: Doubles time when input increases by 1

> **Key Insight**: We focus on the **dominant term** and ignore constants.
> For example, \`3n² + 5n + 100\` becomes **O(n²)** because n² dominates as n grows large.
        `,
        externalLinks: [
          {
            title: 'Big O Cheat Sheet',
            url: 'https://www.bigocheatsheet.com/',
            type: 'documentation',
          },
        ],
      },
      keyPoints: [
        'Time complexity measures how runtime grows with input size',
        'Big O notation expresses worst-case performance',
        'We care about the dominant term, not constants',
        'Different algorithms have vastly different growth rates',
      ],
    },

    // Stage 2: Visual Comparison
    {
      id: 'complexity-visualization',
      type: 'visualization',
      title: 'Comparing Growth Rates',
      description: 'See how different complexities scale',
      estimatedMinutes: 5,
      visualizationType: 'array',
      config: {
        type: 'array',
        array: [1, 10, 100, 1000, 10000, 100000],
        highlightIndices: [3, 4, 5],
        animate: true,
      },
      explanation: `
## Growth Rate Comparison

Watch how quickly different time complexities grow as **n** (input size) increases:

| n | O(1) | O(log n) | O(n) | O(n log n) | O(n²) | O(2ⁿ) |
|---|------|----------|------|------------|-------|-------|
| 10 | 1 | 3 | 10 | 33 | 100 | 1,024 |
| 100 | 1 | 7 | 100 | 664 | 10,000 | 1.27e30 |
| 1,000 | 1 | 10 | 1,000 | 9,966 | 1,000,000 | ∞ |

Notice how **O(2ⁿ)** becomes impossible to compute even for small values!
      `,
      completionCriteria: {
        type: 'auto',
        allowSkip: false,
      },
    },

    // Stage 3: Array Access Example (O(1))
    {
      id: 'example-o1',
      type: 'example',
      title: 'Example: O(1) - Constant Time',
      description: 'Array element access',
      estimatedMinutes: 5,
      problem: 'Get the 5th element from an array of 1 million numbers.',
      solution: {
        steps: [
          {
            stepNumber: 1,
            title: 'Direct Access',
            explanation: `
Arrays store elements in **contiguous memory**, meaning each element is right next to the previous one.

The computer knows:
- Where the array starts in memory
- The size of each element
- Simple math: \`address = start + (index × element_size)\`
            `,
            code: `
// JavaScript
const numbers = [10, 20, 30, 40, 50, ...]; // Million elements
const fifth = numbers[4]; // Instant access!

// Time: O(1) - doesn't matter if array has 10 or 10 million elements
            `,
          },
          {
            stepNumber: 2,
            title: 'Why It\'s O(1)',
            explanation: `
The operation takes the **same amount of time** whether the array has:
- 10 elements
- 1,000 elements
- 1,000,000 elements

It's just one calculation: \`start + (4 × element_size)\`

No loops. No searching. **Constant time.**
            `,
          },
        ],
        finalAnswer: 'O(1) - Constant time complexity',
      },
      completionCriteria: {
        type: 'auto',
      },
    },

    // Stage 4: Linear Search Example (O(n))
    {
      id: 'example-on',
      type: 'example',
      title: 'Example: O(n) - Linear Time',
      description: 'Finding a value in an unsorted array',
      estimatedMinutes: 7,
      problem: 'Find the number 42 in an unsorted array.',
      solution: {
        steps: [
          {
            stepNumber: 1,
            title: 'The Algorithm',
            explanation: `
Since the array is **unsorted**, we have no choice but to check each element one by one until we find 42 (or reach the end).
            `,
            code: `
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found it!
    }
  }
  return -1; // Not found
}

const numbers = [15, 3, 88, 42, 9, 17];
linearSearch(numbers, 42); // Returns 3
            `,
          },
          {
            stepNumber: 2,
            title: 'Best Case vs Worst Case',
            explanation: `
**Best case**: Target is the first element → O(1)
**Average case**: Target is in the middle → O(n/2) = O(n)
**Worst case**: Target is last or not present → O(n)

We use **Big O for worst case**, so this is **O(n)**.
            `,
          },
          {
            stepNumber: 3,
            title: 'Why It\'s O(n)',
            explanation: `
The loop runs **at most n times** where n is the array length.

- 10 elements → up to 10 checks
- 100 elements → up to 100 checks
- n elements → up to **n checks**

Time grows **linearly** with input size.
            `,
          },
        ],
        finalAnswer: 'O(n) - Linear time complexity',
      },
      completionCriteria: {
        type: 'auto',
      },
    },

    // Stage 5: Sliding Window Visualization (O(n))
    {
      id: 'sliding-window-viz',
      type: 'visualization',
      title: 'Sliding Window: O(n) Optimization',
      description: 'See how sliding window reduces nested loops to linear time',
      estimatedMinutes: 10,
      visualizationType: 'sliding_window',
      config: {
        type: 'sliding_window',
        array: [2, 1, 5, 1, 3, 2],
        valueLabel: 'Window Sum',
        steps: [
          {
            windowStart: 0,
            windowEnd: 2,
            currentValue: 8,
            explanation: 'Initial window of size 3: sum = 2 + 1 + 5 = 8',
          },
          {
            windowStart: 1,
            windowEnd: 3,
            currentValue: 7,
            explanation: 'Slide right: subtract 2, add 1 → sum = 8 - 2 + 1 = 7',
          },
          {
            windowStart: 2,
            windowEnd: 4,
            currentValue: 9,
            explanation: 'Slide right: subtract 1, add 3 → sum = 7 - 1 + 3 = 9',
          },
          {
            windowStart: 3,
            windowEnd: 5,
            currentValue: 6,
            explanation: 'Slide right: subtract 5, add 2 → sum = 9 - 5 + 2 = 6',
          },
        ],
      },
      explanation: `
## Sliding Window Pattern

**Naive approach** (O(n²)): Recalculate sum for each window
\`\`\`javascript
for (let i = 0; i <= arr.length - k; i++) {
  let sum = 0;
  for (let j = i; j < i + k; j++) { // Nested loop!
    sum += arr[j];
  }
  maxSum = Math.max(maxSum, sum);
}
\`\`\`

**Sliding Window** (O(n)): Reuse previous sum
\`\`\`javascript
let sum = arr.slice(0, k).reduce((a,b) => a+b);
for (let i = k; i < arr.length; i++) {
  sum = sum - arr[i-k] + arr[i]; // Subtract left, add right
  maxSum = Math.max(maxSum, sum);
}
\`\`\`

We visit each element **once** → **O(n)** instead of O(n²)!
      `,
      completionCriteria: {
        type: 'auto',
      },
    },

    // Stage 6: Practice Problem
    {
      id: 'practice-complexity',
      type: 'practice',
      title: 'Practice: Identify Time Complexity',
      description: 'Analyze code and determine its time complexity',
      estimatedMinutes: 8,
      problem: `
Analyze this function and determine its time complexity:

\`\`\`javascript
function mysteryFunction(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}
\`\`\`

What is the time complexity and why?
      `,
      hints: [
        'Look at the nested loops - how many times does the inner loop run?',
        'If the outer loop runs n times and inner loop runs n times for each...',
        'Total operations = n × n = ?',
      ],
      validation: {
        type: 'free_form',
      },
      completionCriteria: {
        type: 'manual',
      },
    },

    // Stage 7: Quiz
    {
      id: 'quiz-assessment',
      type: 'quiz',
      title: 'Time Complexity Quiz',
      description: 'Test your understanding',
      estimatedMinutes: 7,
      passingScore: 70,
      allowRetry: true,
      showAnswersAfter: true,
      questions: [
        {
          id: 'q1',
          question: 'What is the time complexity of accessing an array element by index?',
          type: 'multiple_choice',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          correctAnswer: 'O(1)',
          explanation:
            'Array access by index is constant time because the address can be calculated directly.',
          points: 25,
        },
        {
          id: 'q2',
          question: 'Which time complexity grows the fastest?',
          type: 'multiple_choice',
          options: ['O(n)', 'O(n²)', 'O(log n)', 'O(2ⁿ)'],
          correctAnswer: 'O(2ⁿ)',
          explanation:
            'Exponential growth (O(2ⁿ)) grows much faster than polynomial (O(n²)) or linear (O(n)).',
          points: 25,
        },
        {
          id: 'q3',
          question: 'What does Big O notation describe?',
          type: 'multiple_choice',
          options: [
            'The exact runtime in milliseconds',
            'The worst-case growth rate',
            'The best possible performance',
            'The average case only',
          ],
          correctAnswer: 'The worst-case growth rate',
          explanation:
            'Big O describes how runtime grows in the worst-case scenario as input size increases.',
          points: 25,
        },
        {
          id: 'q4',
          question: 'A nested loop where both loops run n times has what complexity?',
          type: 'multiple_choice',
          options: ['O(n)', 'O(2n)', 'O(n²)', 'O(log n)'],
          correctAnswer: 'O(n²)',
          explanation:
            'Nested loops multiply: outer loop (n) × inner loop (n) = n × n = O(n²).',
          points: 25,
        },
      ],
      completionCriteria: {
        type: 'quiz',
        requiresScore: 70,
      },
    },
  ],
};
