// Export all module lessons for easy import
export { module1ArrayIterationLesson } from './moduleArrayIterationLesson';
export { module2HashMapLesson } from './moduleHashMapLesson';
export { module3BitManipulationLesson } from './moduleBitManipulationLesson';
export { module4_5PythonOOPLesson } from './modulePythonOOPLesson';
export { module5LinkedListLesson } from './moduleLinkedListLesson';
export { module6TreesLesson } from './moduleTreesLesson';
export { module7BinarySearchLesson } from './moduleBinarySearchLesson';
export { module8GraphsLesson } from './moduleGraphsLesson';
export { module9UnionFindLesson } from './moduleUnionFindLesson';
// New module structure (Modules 10-14)
export { module9RecursionTreesLesson } from './moduleRecursionTreesLesson'; // TODO: Rename to module10
export { module11BacktrackingLesson } from './moduleBacktrackingLesson';
export { module11DynamicProgrammingLesson } from './moduleDynamicProgrammingLesson';
export { module10HeapsLesson } from './moduleHeapsLesson'; // Now Module 12
export { module12TriesLesson } from './moduleTriesLesson'; // Now Module 13
// module13AdvancedLesson removed - was just course completion, exercises moved to topic modules
export { timeComplexityFoundationsLesson } from './timeComplexityFoundationsLesson';
export { module14EdgeCaseDrillsLesson } from './moduleEdgeCaseDrillsLesson';
export { module00a_PythonMechanicsLesson } from './modulePythonMechanicsLesson';
export { module00b_PythonAlgorithmicLesson } from './modulePythonAlgorithmicLesson';
// export { module0_5PythonBasicsLesson } from './modulePythonBasicsLesson'; // Deprecated
export { module15ParenthesesLesson } from './moduleParenthesesLesson';
export { moduleSlidingWindowLesson } from './moduleSlidingWindowLesson';
export { modulePrefixSuffixLesson } from './modulePrefixSuffixLesson';
export { moduleStackLesson } from './moduleStackLesson';
export { moduleQueueLesson } from './moduleQueueLesson';
export { moduleArrayPartitioningLesson } from './moduleArrayPartitioningLesson';
export { moduleIntervalsLesson } from './moduleIntervalsLesson';
export { moduleGreedyLesson } from './moduleGreedyLesson';
export { moduleArrayHashMapLesson } from './moduleArrayHashMapLesson';
export { moduleConcurrencyLesson } from './moduleConcurrencyLesson';

// Import all for the map
import type { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { timeComplexityFoundationsLesson } from './timeComplexityFoundationsLesson';
import { module00a_PythonMechanicsLesson } from './modulePythonMechanicsLesson';
import { module00b_PythonAlgorithmicLesson } from './modulePythonAlgorithmicLesson';
// import { module0_5PythonBasicsLesson } from './modulePythonBasicsLesson';
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
// module13AdvancedLesson import removed
import { module14EdgeCaseDrillsLesson } from './moduleEdgeCaseDrillsLesson';
import { module15ParenthesesLesson } from './moduleParenthesesLesson';
import { moduleSlidingWindowLesson } from './moduleSlidingWindowLesson';
import { modulePrefixSuffixLesson } from './modulePrefixSuffixLesson';
import { moduleStackLesson } from './moduleStackLesson';
import { moduleQueueLesson } from './moduleQueueLesson';
import { moduleArrayPartitioningLesson } from './moduleArrayPartitioningLesson';
import { moduleIntervalsLesson } from './moduleIntervalsLesson';
import { moduleGreedyLesson } from './moduleGreedyLesson';
import { moduleArrayHashMapLesson } from './moduleArrayHashMapLesson';
import { moduleConcurrencyLesson } from './moduleConcurrencyLesson';

// Map module IDs to their progressive lessons

export const progressiveLessonsMap: Record<string, ProgressiveLesson> = {
  "time-complexity-foundations": timeComplexityFoundationsLesson,
  "python-mechanics": module00a_PythonMechanicsLesson,
  "python-algorithmic-thinking": module00b_PythonAlgorithmicLesson,
  // "python-basics-fundamentals": module0_5PythonBasicsLesson,
  "array-iteration-techniques": module1ArrayIterationLesson,
  "hash-map-fundamentals": module2HashMapLesson,
  "bit-manipulation-math": module3BitManipulationLesson,
  "python-oop-libraries": module4_5PythonOOPLesson,
  "linked-list-mastery": module5LinkedListLesson,
  "trees-traversals": module6TreesLesson,
  "binary-search-sorting": module7BinarySearchLesson,
  "graphs-bfs-dfs": module8GraphsLesson,
  "union-find-disjoint-set": module9UnionFindLesson,
  // New module structure (Modules 9-14)
  "recursion-trees-foundation": module9RecursionTreesLesson,
  "backtracking-decision-trees": module11BacktrackingLesson,
  "dynamic-programming": module11DynamicProgrammingLesson,
  "heaps-priority-queues": module10HeapsLesson, // Now Module 12
  "tries-string-patterns": module12TriesLesson, // Now Module 14
  // "advanced-topics-mastery" removed - exercises moved to topic modules
  "edge-case-drills": module14EdgeCaseDrillsLesson,
  "parentheses-balanced-strings": module15ParenthesesLesson,
  "sliding-window-mastery": moduleSlidingWindowLesson,
  "prefix-suffix-arrays": modulePrefixSuffixLesson,
  "stack-discovery-lifo": moduleStackLesson,
  "queue-discovery-fifo": moduleQueueLesson,
  "array-partitioning-toolbox": moduleArrayPartitioningLesson,
  "intervals-mastery": moduleIntervalsLesson,
  "greedy-algorithms": moduleGreedyLesson,
  "array-hashmap-patterns": moduleArrayHashMapLesson,
  "concurrency-threading": moduleConcurrencyLesson,
};
