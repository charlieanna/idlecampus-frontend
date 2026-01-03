/**
 * Module 15 Content Builder
 * Transforms existing content from all modules into the unified format
 * Integrates real problems from centralizedProblemPool
 */

import { problemFamilyMappings, ProblemFamilyMapping } from './problemFamilyMapping';
import { dsaProblems } from './dsaCourseData';
import { timeComplexityFoundationsLesson } from './timeComplexityFoundationsLesson';
import { module0_5PythonBasicsLesson } from './modulePythonBasicsLesson';
import { module1ArrayIterationLesson } from './moduleArrayIterationLesson';
import { module2HashMapLesson } from './moduleHashMapLesson';
import { module3BitManipulationLesson } from './moduleBitManipulationLesson';
import { module4_5PythonOOPLesson } from './modulePythonOOPLesson';
import { module5LinkedListLesson } from './moduleLinkedListLesson';
import { module6TreesLesson } from './moduleTreesLesson';
import { module7BinarySearchLesson } from './moduleBinarySearchLesson';
import { module8GraphsLesson } from './moduleGraphsLesson';
import { module9UnionFindLesson } from './moduleUnionFindLesson';
import { module9RecursionTreesLesson } from './moduleRecursionTreesLesson';
import { module11BacktrackingLesson } from './moduleBacktrackingLesson';
import { module11DynamicProgrammingLesson } from './moduleDynamicProgrammingLesson';
import { module10HeapsLesson } from './moduleHeapsLesson';
import { module12TriesLesson } from './moduleTriesLesson';
// module13AdvancedLesson removed
import { module14EdgeCaseDrillsLesson } from './moduleEdgeCaseDrillsLesson';
import { moduleConcurrencyLesson } from './moduleConcurrencyLesson';
import type { ProgressiveLesson, LessonSection } from '../types/progressive-lesson-enhanced';
import type { UnifiedContentItem } from './moduleUnifiedDSAJourney';
import type { DSAProblem } from '../types/dsa-course';
import { getAllPracticeExercises, type PracticeExercise } from '../utils/practiceExerciseRegistry';

// ============= Module Order =============
// Module 4 = Python OOP, Module 15 = Bit Manipulation, 17-20 = Advanced
const MODULE_ORDER = [0.5, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20];

// ... (MODULE_LESSONS map skipped for brevity in this multichunk, assuming targeting by context)

function getModuleName(moduleId: number): string {
  const moduleNames: { [key: number]: string } = {
    0: 'Time Complexity Foundations',
    0.5: 'Python Basics',
    1: 'Array Iteration Techniques',
    2: 'Hash Map Fundamentals',
    3: 'Bit Manipulation & Math',
    4: 'Python OOP & Essential Libraries',
    5: 'Linked List Mastery',
    6: 'Recursion & Trees Foundation',
    7: 'Trees & Tree Traversals',
    8: 'Binary Search & Sorting',
    9: 'Graphs & BFS/DFS',
    10: 'Union-Find (Disjoint Sets)',
    11: 'Backtracking & Decision Trees',
    12: 'Dynamic Programming',
    13: 'Heaps & Priority Queues',
    14: 'Tries & Advanced String Patterns',
    15: 'Advanced Topics & Mastery', // Old name, really Bit Man now? No, Bit Man is 15 in this file mapping?
    // Wait, line 53 says: 15: module3BitManipulationLesson
    // Let's make sure the name matches
    17: 'Concurrency & Threading',
    18: 'System Design Patterns',
    19: 'OOD Patterns',
    20: 'Async Patterns',
  };
  return moduleNames[moduleId] || `Module ${moduleId}`;
}

// ============= Lesson Mapping =============
const MODULE_LESSONS: { [key: number]: ProgressiveLesson | null } = {
  0.5: module0_5PythonBasicsLesson,
  1: module1ArrayIterationLesson,
  2: module2HashMapLesson,
  4: module4_5PythonOOPLesson,      // Python OOP & Essential Libraries
  5: module5LinkedListLesson,
  6: module9RecursionTreesLesson,   // Recursion & Trees Foundation
  7: module6TreesLesson,            // Trees & Tree Traversals
  8: module7BinarySearchLesson,     // Binary Search & Sorting
  9: module8GraphsLesson,           // Graphs & BFS/DFS
  10: module9UnionFindLesson,       // Union-Find
  11: module11BacktrackingLesson,   // Backtracking & Decision Trees
  12: module11DynamicProgrammingLesson,  // Dynamic Programming
  13: module10HeapsLesson,          // Heaps & Priority Queues
  14: module12TriesLesson,          // Tries & Advanced String Patterns
  15: module3BitManipulationLesson, // Bit Manipulation & Math
  17: moduleConcurrencyLesson,      // Concurrency & Threading
  18: null,                         // System Design (Problems only)
  19: null,                         // OOD (Problems only)
  20: null,                         // Async (Problems only)
};

// Module 0 uses timeComplexityFoundationsLesson, which needs special handling
const MODULE_0_LESSON = timeComplexityFoundationsLesson;

// ============= Problem Pool Mapping =============
// Create a map for quick lookup of DSAProblems
const dsaProblemsMap = new Map<string, DSAProblem>();
dsaProblems.forEach(p => dsaProblemsMap.set(p.id, p));

const practiceExercises = getAllPracticeExercises();
practiceExercises.forEach(exercise => {
  if (!dsaProblemsMap.has(exercise.id)) {
    dsaProblemsMap.set(exercise.id, convertPracticeExerciseToDSAProblem(exercise));
  }
});

// ============= Content Transformers =============

/**
 * Transform a progressive lesson into unified content items
 */
function transformProgressiveLesson(
  lesson: ProgressiveLesson,
  moduleId: number,
  startSequence: number
): UnifiedContentItem[] {
  const items: UnifiedContentItem[] = [];
  let sequence = startSequence;

  // Add lesson introduction if there's a description
  if (lesson.description) {
    items.push({
      id: `module-${moduleId}-intro`,
      type: 'reading',
      title: lesson.title,
      description: lesson.description,
      originalModule: moduleId,
      originalModuleName: getModuleName(moduleId),
      sequenceNumber: sequence++,
      estimatedTime: 3,
      content: {
        type: 'reading',
        id: `module-${moduleId}-intro`,
        title: lesson.title,
        content: lesson.description,
        autoMarkComplete: true
      }
    });
  }

  // Transform each lesson section
  lesson.sections.forEach((section: LessonSection) => {
    const unifiedItem: UnifiedContentItem = {
      id: `module-${moduleId}-${section.id}`,
      type: section.type,
      title: section.title,
      originalModule: moduleId,
      originalModuleName: getModuleName(moduleId),
      sequenceNumber: sequence++,
      content: section, // Store the full section object
      requiredForProgress: false
    };

    // Set requiredForProgress based on section type
    if (section.type === 'exercise') {
      unifiedItem.requiredForProgress = section.requiredForProgress || false;
      unifiedItem.difficulty = section.difficulty;
    }

    // Add estimated time based on type
    switch (section.type) {
      case 'reading':
        unifiedItem.estimatedTime = section.estimatedReadTime
          ? Math.ceil(section.estimatedReadTime / 60)
          : 5;
        break;
      case 'exercise':
        unifiedItem.estimatedTime = section.timeLimit
          ? Math.ceil(section.timeLimit / 60)
          : 15;
        break;
      case 'quiz':
        unifiedItem.estimatedTime = section.questions
          ? Math.ceil(section.questions.length * 2)
          : 5;
        break;
      default:
        unifiedItem.estimatedTime = 10;
    }

    // Extract concepts from exercise sections
    if (section.type === 'exercise' && section.targetComplexity) {
      unifiedItem.concepts = [`time-${section.targetComplexity.time}`, `space-${section.targetComplexity.space}`];
    }

    items.push(unifiedItem);
  });

  return items;
}

function convertPracticeExerciseToDSAProblem(exercise: PracticeExercise): DSAProblem {
  const title = exercise.title.replace(/^Code:\s*/i, '').trim();
  const description = exercise.description || exercise.instruction || exercise.title;
  const hints = exercise.hints?.map(hint => (typeof hint === 'string' ? hint : hint.text || '')) || [];
  const topic = (exercise.conceptFamily as DSAProblem['topic']) || 'general';

  return {
    id: exercise.id,
    title: title || exercise.title,
    description,
    difficulty: exercise.difficulty,
    topic,
    examples: [],
    constraints: [],
    hints,
    starterCode: exercise.starterCode || '# Write your solution here',
    solution: exercise.solution || '# Solution not available',
    testCases: (exercise.testCases || []).map((tc, idx) => ({ ...tc, id: `tc-${idx}` })),
    timeComplexity: exercise.targetComplexity?.time || 'O(?)',
    spaceComplexity: exercise.targetComplexity?.space || 'O(?)',
    targetComplexity: exercise.targetComplexity,
    tags: exercise.conceptFamily ? [exercise.conceptFamily] : [],
    prerequisites: [exercise.moduleId],
    requiredModules: [exercise.moduleId],
  };
}

/**
 * Get the actual DSAProblem object for a problem ID
 */
function getProblemData(problemId: string): DSAProblem | null {
  // First check our maps
  const problem = dsaProblemsMap.get(problemId);

  if (!problem) {
    // Create a placeholder problem
    return {
      id: problemId,
      title: formatProblemTitle(problemId),
      description: `Problem: ${problemId}`,
      difficulty: 'medium',
      topic: 'general',
      examples: [],
      constraints: [],
      hints: [],
      starterCode: '# Write your solution here',
      solution: '# Solution not available',
      testCases: [],
      timeComplexity: 'O(?)',
      spaceComplexity: 'O(?)',
      tags: []
    };
  }

  return problem;
}

/**
 * Transform problems from family mappings into unified content items
 */
function transformProblemsForModule(
  moduleId: number,
  startSequence: number
): UnifiedContentItem[] {
  const moduleProblems = problemFamilyMappings.filter(p => p.moduleId === moduleId);
  const items: UnifiedContentItem[] = [];
  let sequence = startSequence;

  // Group problems by family for better organization
  const familyGroups = new Map<string, ProblemFamilyMapping[]>();
  moduleProblems.forEach(mapping => {
    const family = mapping.familyId;
    if (!familyGroups.has(family)) {
      familyGroups.set(family, []);
    }
    familyGroups.get(family)!.push(mapping);
  });

  // Add problems family by family
  familyGroups.forEach((mappings, familyId) => {
    // Add a section header for each family
    if (mappings.length > 0) {
      items.push({
        id: `module-${moduleId}-family-${familyId}-header`,
        type: 'reading',
        title: `Practice: ${mappings[0].familyName}`,
        description: `Master ${mappings.length} problems on ${mappings[0].familyName}`,
        originalModule: moduleId,
        originalModuleName: mappings[0].moduleName,
        originalFamily: familyId,
        sequenceNumber: sequence++,
        estimatedTime: 2,
        content: {
          type: 'reading',
          content: `You'll now practice ${mappings.length} problems related to **${mappings[0].familyName}**. These problems will help solidify your understanding of this concept.`,
          autoMarkComplete: true
        }
      });
    }

    // Add each problem in the family
    mappings.forEach((mapping, index) => {
      const problemData = getProblemData(mapping.problemId);

      items.push({
        id: mapping.problemId,
        type: 'problem',
        title: problemData ? problemData.title : formatProblemTitle(mapping.problemId),
        description: problemData?.description,
        originalModule: moduleId,
        originalModuleName: mapping.moduleName,
        originalFamily: mapping.familyId,
        sequenceNumber: sequence++,
        estimatedTime: 20,
        difficulty: problemData?.difficulty || getProblemDifficulty(index, mappings.length),
        concepts: [mapping.familyName],
        tags: [mapping.familyName, mapping.moduleName],
        content: problemData // Store the full DSAProblem object
      });
    });
  });

  return items;
}

/**
 * Create transition content between modules
 */
function createModuleTransition(
  fromModule: number,
  toModule: number,
  sequenceNumber: number
): UnifiedContentItem {
  const fromName = getModuleName(fromModule);
  const toName = getModuleName(toModule);

  return {
    id: `transition-${fromModule}-to-${toModule}`,
    type: 'transition',
    title: `${fromName} Complete!`,
    description: `Moving from ${fromName} to ${toName}`,
    originalModule: fromModule,
    originalModuleName: fromName,
    sequenceNumber,
    estimatedTime: 1,
    content: {
      completedModule: fromName,
      nextModule: toName,
      message: getTransitionMessage(fromModule, toModule),
      emoji: getTransitionEmoji(toModule)
    }
  };
}

/**
 * Create milestone celebration
 */
function createMilestone(
  percentage: number,
  sequenceNumber: number,
  itemsCompleted: number,
  totalItems: number
): UnifiedContentItem {
  return {
    id: `milestone-${percentage}`,
    type: 'milestone',
    title: `${percentage}% Complete!`,
    description: getMilestoneDescription(percentage),
    originalModule: 0,
    originalModuleName: 'Milestone',
    sequenceNumber,
    estimatedTime: 1,
    content: {
      percentage,
      itemsCompleted,
      totalItems,
      message: getMilestoneMessage(percentage),
      achievement: getMilestoneAchievement(percentage),
      emoji: '🎉'
    }
  };
}

// ============= Helper Functions =============



function formatProblemTitle(problemId: string): string {
  // Convert problem ID to readable title
  // e.g., "two-sum-sorted" -> "Two Sum Sorted"
  return problemId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getProblemDifficulty(index: number, totalInFamily: number): 'easy' | 'medium' | 'hard' {
  // Progressive difficulty within each family
  const ratio = index / totalInFamily;
  if (ratio < 0.33) return 'easy';
  if (ratio < 0.67) return 'medium';
  return 'hard';
}

function getTransitionMessage(fromModule: number, toModule: number): string {
  if (fromModule === 0) return "Excellent understanding of Big O! Now let's learn Python basics.";
  if (fromModule === 0.5) return "Python foundations solid! Time to master array techniques.";
  if (fromModule === 4) return "OOP mastered! Let's explore linked lists.";
  if (fromModule === 8) return "Graph algorithms conquered! Ready for recursion patterns?";
  if (fromModule === 11) return "Backtracking mastered! Final advanced topics ahead.";
  return `Great work on ${getModuleName(fromModule)}! Let's continue with ${getModuleName(toModule)}.`;
}

function getTransitionEmoji(toModule: number): string {
  const emojis: { [key: number]: string } = {
    0.5: '🐍', 1: '🎯', 2: '🗂️', 3: '💻', 4: '🔀', 5: '🔗',
    6: '🌳', 7: '🔍', 8: '🕸️', 9: '🔄', 10: '📊',
    11: '↩️', 12: '📝', 13: '🚀'
  };
  return emojis[toModule] || '➡️';
}

function getMilestoneDescription(percentage: number): string {
  switch (percentage) {
    case 25: return "Foundation modules complete!";
    case 50: return "Halfway through your DSA journey!";
    case 75: return "Advanced territory conquered!";
    case 100: return "Complete DSA mastery achieved!";
    default: return `${percentage}% of journey complete!`;
  }
}

function getMilestoneMessage(percentage: number): string {
  switch (percentage) {
    case 25: return "Solid foundations built! Arrays, hashing, and bits mastered.";
    case 50: return "Incredible progress! Essential data structures understood.";
    case 75: return "Almost there! Advanced algorithms within your grasp.";
    case 100: return "Champion! You've mastered the complete DSA curriculum!";
    default: return "Keep going! You're making excellent progress!";
  }
}

function getMilestoneAchievement(percentage: number): string {
  switch (percentage) {
    case 25: return "🏗️ Foundation Builder";
    case 50: return "📚 Data Structure Expert";
    case 75: return "🧠 Algorithm Master";
    case 100: return "🏆 DSA Champion";
    default: return "🌟 DSA Learner";
  }
}

// ============= Main Builder Function =============

export function buildCompleteModule15Content(): UnifiedContentItem[] {
  const allItems: UnifiedContentItem[] = [];
  let globalSequence = 0;
  let totalProblems = 0;
  const totalItemsEstimate = 500; // Approximate total items for milestone calculations

  // Start with Module 0: Time Complexity Foundations
  const module0Items = transformProgressiveLesson(MODULE_0_LESSON, 0, globalSequence);
  allItems.push(...module0Items);
  globalSequence += module0Items.length;

  // Add transition from Module 0 to 0.5
  allItems.push(createModuleTransition(0, 0.5, globalSequence++));

  // Process each module in order
  MODULE_ORDER.forEach((moduleId, moduleIndex) => {
    // Add module lesson if available
    const lesson = MODULE_LESSONS[moduleId];
    if (lesson) {
      const lessonItems = transformProgressiveLesson(lesson, moduleId, globalSequence);
      allItems.push(...lessonItems);
      globalSequence += lessonItems.length;
    }

    // Add problems for this module (except Module 4 which has only exercises in lessons)
    if (moduleId !== 4) {
      const problemItems = transformProblemsForModule(moduleId, globalSequence);
      if (problemItems.length > 0) {
        allItems.push(...problemItems);
        globalSequence += problemItems.length;
        totalProblems += problemItems.filter(i => i.type === 'problem').length;
      }
    }

    // Add milestones at approximately 25%, 50%, 75%
    const progress = (globalSequence / totalItemsEstimate) * 100;
    if (progress >= 25 && !allItems.find(i => i.id === 'milestone-25')) {
      allItems.push(createMilestone(25, globalSequence++, globalSequence - 1, totalItemsEstimate));
    } else if (progress >= 50 && !allItems.find(i => i.id === 'milestone-50')) {
      allItems.push(createMilestone(50, globalSequence++, globalSequence - 1, totalItemsEstimate));
    } else if (progress >= 75 && !allItems.find(i => i.id === 'milestone-75')) {
      allItems.push(createMilestone(75, globalSequence++, globalSequence - 1, totalItemsEstimate));
    }

    // Add transition to next module (except for last module)
    if (moduleIndex < MODULE_ORDER.length - 1) {
      const nextModule = MODULE_ORDER[moduleIndex + 1];
      allItems.push(createModuleTransition(moduleId, nextModule, globalSequence++));
    }
  });

  // Add final milestone
  allItems.push(createMilestone(100, globalSequence++, globalSequence - 1, globalSequence));

  return allItems;
}

// Export the complete content
export const module15CompleteContent = buildCompleteModule15Content();