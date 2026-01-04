import React, { useState, useEffect, useMemo } from "react";
import {
  GripVertical,
  Code2,
  Trophy,
  CheckCircle,
  CheckCircle2,
  BookOpen,
  Code,
  Lock,
  Clock,
  Zap,
  Settings,
  Filter,
  Target,
  Brain,
  Play,
  AlertCircle,
  HelpCircle,
  Box,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { AppDSAHeader } from "./components/layout/AppDSAHeader";
import { AppDSASidebar } from "./components/layout/AppDSASidebar";
import { ModuleLessonSidebar } from "./components/layout/ModuleLessonSidebar";
import { ModuleDashboard } from "./components/journey-map";
import { ContentRouter } from "./components/content/ContentRouter";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/core/ThemeToggle";
import * as ResizablePrimitive from "react-resizable-panels";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { ScrollArea } from "./components/ui/scroll-area";
import { Switch } from "./components/ui/switch";
import { dsaCourse, dsaProblems } from "./data/dsaCourseData";
import { DSAProblem } from "./types/dsa-course";
import { motion, AnimatePresence } from "framer-motion";
import { PythonEditorLeetCode } from "./components/core/PythonEditorLeetCode";
import { CodeEditor } from "./components/core/CodeEditor";
import { DSALessonViewer } from "./components/core/DSALessonViewer";
import { LeetCodeProblemPage } from "./components/core/LeetCodeProblemPage";
import { runPythonCode } from "./utils/pyodideRunner";
import { buildPythonTestHarness, parsePythonTestResults, normalizeSmartPracticeTestCases } from "./utils/pythonTestHarness";
import { preprocessCodeForExecution } from "./utils/codePreprocessor";
import { PyodideLoader } from "./components/core/PyodideLoader";
import { validateAllProblemsInBrowser } from "./utils/validateProblemsInBrowser";
import { fixAllProblems } from "./utils/fixAllProblems";
import { DSAMCQViewer } from "./components/core/DSAMCQViewer";
import { DSAMCQSidePanel } from "./components/core/DSAMCQSidePanel";
import { ProgressiveLessonViewer } from "./components/core/ProgressiveLessonViewer";
import { ProgressiveLessonTwoPanel, ProgressiveLessonRightPanel } from "./components/core/ProgressiveLessonTwoPanel";
import { ProgressiveLessonSidebar } from "./components/core/ProgressiveLessonSidebar";
import { renderStyledText } from "./utils/styledTextRenderer";
import { cleanInstruction } from "./utils/cleanInstruction";
import { EnhancedReadingSection } from "./components/core/EnhancedReadingSection";
import { ComplexityAnalysisPanel } from "./components/core/ComplexityAnalysisPanel";
import { timeComplexityFoundationsLesson } from "./data/timeComplexityFoundationsLesson";
import { module0_5PythonBasicsLesson } from "./data/modulePythonBasicsLesson";
import { module00a_PythonMechanicsLesson } from "./data/modulePythonMechanicsLesson";
import { module00b_PythonAlgorithmicLesson } from "./data/modulePythonAlgorithmicLesson";
import { module1ArrayIterationLesson } from "./data/moduleArrayIterationLesson";
import { module2HashMapLesson } from "./data/moduleHashMapLesson";
import { module3BitManipulationLesson } from "./data/moduleBitManipulationLesson";
import { moduleSlidingWindowLesson } from "./data/moduleSlidingWindowLesson";
import { modulePrefixSuffixLesson } from "./data/modulePrefixSuffixLesson";
import { moduleStackLesson } from "./data/moduleStackLesson";
import { moduleQueueLesson } from "./data/moduleQueueLesson";
import { moduleIntervalsLesson } from "./data/moduleIntervalsLesson";
import { moduleConcurrencyLesson } from "./data/moduleConcurrencyLesson";
import { module4_5PythonOOPLesson } from "./data/modulePythonOOPLesson";
import { module5LinkedListLesson } from "./data/moduleLinkedListLesson";
import LinkedListPracticeSection from "./components/core/LinkedListPracticeSection";
import { module6TreesLesson } from "./data/moduleTreesLesson";
import { module7BinarySearchLesson } from "./data/moduleBinarySearchLesson";
import { module8GraphsLesson } from "./data/moduleGraphsLesson";
import { module9UnionFindLesson } from "./data/moduleUnionFindLesson";
// New module structure (Modules 9-14)
import { module9RecursionTreesLesson } from "./data/moduleRecursionTreesLesson";
import { module11BacktrackingLesson } from "./data/moduleBacktrackingLesson";
import { module11DynamicProgrammingLesson } from "./data/moduleDynamicProgrammingLesson";
import { module10HeapsLesson } from "./data/moduleHeapsLesson"; // Now Module 12
import { module12TriesLesson } from "./data/moduleTriesLesson"; // Now Module 13
// module13AdvancedLesson removed - exercises moved to topic modules
import { module15ParenthesesLesson } from "./data/moduleParenthesesLesson";
import { Module0StageManager } from "./components/core/Module0StageManager";
import { Module0QuizPanel } from "./components/core/Module0QuizPanel";
import { GenericLessonStageManager } from "./components/core/GenericLessonStageManager";
import { GenericLessonQuizPanel } from "./components/core/GenericLessonQuizPanel";
import { module15CompleteContent } from "./data/moduleContentBuilder";
import { PracticeDashboard } from "./components/core/PracticeDashboard";
import { MasteryDashboard } from "./components/mastery-challenge/MasteryDashboard";
import { MasteryFeedbackModal } from "./components/mastery-challenge/MasteryFeedbackModal";
import { AdaptiveStreamView } from "./components/core/AdaptiveStreamView";
import {
  getStudiedModules,
  getProblemsForStudiedModules,
  type ModuleStudyStatus
} from "./data/moduleUnifiedDSAJourney";

import {
  checkModuleCompletion,
  unlockNextModule,
  getNextModule,
  MODULE_PREREQUISITES,
  type ModuleCompletionCheck
} from "./utils/moduleChaining";
import { MODULE_ORDER } from "./data/moduleConceptMapping";
import type {
  ProgressiveLessonProgress,
  SectionProgress,
  QuizSection,
  ProgressiveLesson,
  ExerciseSection,
  LessonSection,
} from "./types/progressive-lesson-enhanced";
import {
  calculateLessonProgress,
  isSectionUnlocked,
} from "./types/progressive-lesson-enhanced";
import { useGamificationStore } from "./stores/gamificationStore";

const SOLUTION_DEFINITION_REGEX = /def\s+solution\s*\(/i;

// ═══════════════════════════════════════════════════════════
// LOCAL STORAGE PERSISTENCE HELPERS
// ═══════════════════════════════════════════════════════════

const STORAGE_KEY_PROGRESS = 'dsa-course-progress';
const STORAGE_KEY_HINTS = 'dsa-course-hints';
const STORAGE_KEY_POSITION = 'dsa-course-position';
const STORAGE_KEY_SOLVED_PROBLEMS = 'dsa-course-solved-problems';

// Helper to serialize Date or string to ISO string
const toISOStringOrPassthrough = (value: Date | string | undefined): string | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString();
  return value; // Already a string
};

// Serialize ProgressiveLessonProgress for localStorage
const serializeProgress = (progress: ProgressiveLessonProgress): object => ({
  ...progress,
  sectionsProgress: Array.from(progress.sectionsProgress.entries()),
  startedAt: toISOStringOrPassthrough(progress.startedAt),
  lastActivityAt: toISOStringOrPassthrough(progress.lastActivityAt),
  completedAt: toISOStringOrPassthrough(progress.completedAt),
});

// Deserialize ProgressiveLessonProgress from localStorage
const deserializeProgress = (data: any): ProgressiveLessonProgress => ({
  ...data,
  sectionsProgress: new Map(data.sectionsProgress || []),
  startedAt: data.startedAt ? new Date(data.startedAt) : new Date(),
  lastActivityAt: data.lastActivityAt ? new Date(data.lastActivityAt) : new Date(),
  completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
});

// Load all progress from localStorage
const loadProgressFromStorage = (): {
  allProgress: Map<string, ProgressiveLessonProgress>;
  hintsUsed: Map<string, number>;
  position: { moduleIndex: number; lessonIndex: number } | null;
} => {
  try {
    const savedProgress = localStorage.getItem(STORAGE_KEY_PROGRESS);
    const savedHints = localStorage.getItem(STORAGE_KEY_HINTS);
    const savedPosition = localStorage.getItem(STORAGE_KEY_POSITION);

    let allProgress = new Map<string, ProgressiveLessonProgress>();
    let hintsUsed = new Map<string, number>();
    let position: { moduleIndex: number; lessonIndex: number } | null = null;

    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      if (Array.isArray(parsed)) {
        parsed.forEach(([key, value]: [string, any]) => {
          allProgress.set(key, deserializeProgress(value));
        });
      }
    }

    if (savedHints) {
      const parsed = JSON.parse(savedHints);
      if (Array.isArray(parsed)) {
        hintsUsed = new Map(parsed);
      }
    }

    if (savedPosition) {
      position = JSON.parse(savedPosition);
    }

    return { allProgress, hintsUsed, position };
  } catch (error) {
    console.error('Error loading progress from localStorage:', error);
    return { allProgress: new Map(), hintsUsed: new Map(), position: null };
  }
};

// Save all progress to localStorage
const saveProgressToStorage = (
  allProgress: Map<string, ProgressiveLessonProgress>,
  hintsUsed: Map<string, number>,
  position?: { moduleIndex: number; lessonIndex: number }
) => {
  try {
    const serializedProgress = Array.from(allProgress.entries()).map(
      ([key, value]) => [key, serializeProgress(value)]
    );
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(serializedProgress));
    localStorage.setItem(STORAGE_KEY_HINTS, JSON.stringify(Array.from(hintsUsed.entries())));
    if (position) {
      localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(position));
    }
  } catch (error) {
    console.error('Error saving progress to localStorage:', error);
  }
};

interface SolutionWrapperOptions {
  code: string;
  defaultFuncName?: string;
  isLinkedListProblem: boolean;
  isTreeProblem: boolean;
  isTrieProblem: boolean;
  isListOfStringsExercise: boolean;
  isNestedDictTrieExercise: boolean;
}

const ensureSolutionWrapper = ({
  code,
  defaultFuncName,
  isLinkedListProblem,
  isTreeProblem,
  isTrieProblem,
  isListOfStringsExercise,
  isNestedDictTrieExercise,
}: SolutionWrapperOptions): string => {
  // Add typing imports BEFORE user code so type hints like List[int] work
  const typingImports = 'from typing import List, Dict, Optional, Tuple, Set, Any\n\n';

  if (SOLUTION_DEFINITION_REGEX.test(code)) {
    return typingImports + code;
  }

  if (!defaultFuncName || defaultFuncName === "solution") {
    return typingImports + code;
  }

  // Special exercises need custom solution wrappers
  if (isListOfStringsExercise) {
    // List of Strings exercise uses numeric test inputs (1-6) to call different functions
    return `${typingImports}${code}

# Auto-generated solution wrapper for List of Strings exercise
def solution(test_input):
    # Helper to recursively extract a numeric value from nested structures
    def extract_number(value):
        if isinstance(value, (int, float)):
            return int(value)
        if isinstance(value, str):
            try:
                return int(value.strip())
            except (ValueError, TypeError):
                return 1
        if isinstance(value, (list, tuple)):
            if len(value) > 0:
                return extract_number(value[0])
            return 1
        if isinstance(value, dict):
            # Try to extract from common patterns
            if '__call__' in value:
                args = value.get('args', [])
                if args and len(args) > 0:
                    return extract_number(args[0])
                kwargs = value.get('kwargs', {})
                if kwargs:
                    return extract_number(list(kwargs.values())[0])
            # Try first value in dict
            if value:
                return extract_number(list(value.values())[0])
            return 1
        # Fallback
        try:
            return int(value)
        except (ValueError, TypeError):
            return 1
    
    test_num = extract_number(test_input)
    
    words = ["apple", "application", "apply", "banana", "band"]
    
    if test_num == 1:
        return search(words, "apple")
    elif test_num == 2:
        return search(words, "app")
    elif test_num == 3:
        return startsWith(words, "app")
    elif test_num == 4:
        return wordsWithPrefix(words, "app")
    elif test_num == 5:
        return wordsWithPrefix(words, "ban")
    elif test_num == 6:
        return search(words, "orange")
    return False
`;
  }

  if (isNestedDictTrieExercise) {
    // Nested Dictionary Trie exercise uses numeric test inputs (1-7) to call different functions
    return `${typingImports}${code}

# Auto-generated solution wrapper for Nested Dictionary Trie exercise
def solution(test_input):
    # Helper to recursively extract a numeric value from nested structures
    def extract_number(value):
        if isinstance(value, (int, float)):
            return int(value)
        if isinstance(value, str):
            try:
                return int(value.strip())
            except (ValueError, TypeError):
                return 1
        if isinstance(value, (list, tuple)):
            if len(value) > 0:
                return extract_number(value[0])
            return 1
        if isinstance(value, dict):
            # Try to extract from common patterns
            if '__call__' in value:
                args = value.get('args', [])
                if args and len(args) > 0:
                    return extract_number(args[0])
                kwargs = value.get('kwargs', {})
                if kwargs:
                    return extract_number(list(kwargs.values())[0])
            # Try first value in dict
            if value:
                return extract_number(list(value.values())[0])
            return 1
        # Fallback
        try:
            return int(value)
        except (ValueError, TypeError):
            return 1
    
    test_num = extract_number(test_input)
    
    trie = {}
    
    if test_num == 1:
        insert(trie, "cat")
        return search(trie, "cat")
    elif test_num == 2:
        insert(trie, "cat")
        return search(trie, "ca")
    elif test_num == 3:
        insert(trie, "cat")
        return startsWith(trie, "ca")
    elif test_num == 4:
        insert(trie, "dog")
        return search(trie, "dog")
    elif test_num == 5:
        insert(trie, "dog")
        return search(trie, "do")
    elif test_num == 6:
        insert(trie, "dog")
        return startsWith(trie, "do")
    elif test_num == 7:
        insert(trie, "cat")
        return search(trie, "bird")
    return False
`;
  }

  if (isTrieProblem) {
    // Trie class problem uses numeric test inputs (1-8) to call Trie methods
    return `${code}

# Auto-generated solution wrapper for Trie class exercise
def solution(test_input):
    # Helper to recursively extract a numeric value from nested structures
    def extract_number(value):
        if isinstance(value, (int, float)):
            return int(value)
        if isinstance(value, str):
            try:
                return int(value.strip())
            except (ValueError, TypeError):
                return 1
        if isinstance(value, (list, tuple)):
            if len(value) > 0:
                return extract_number(value[0])
            return 1
        if isinstance(value, dict):
            # Try to extract from common patterns
            if '__call__' in value:
                args = value.get('args', [])
                if args and len(args) > 0:
                    return extract_number(args[0])
                kwargs = value.get('kwargs', {}):
                    return extract_number(list(kwargs.values())[0])
            # Try first value in dict
            if value:
                return extract_number(list(value.values())[0])
            return 1
        # Fallback
        try:
            return int(value)
        except (ValueError, TypeError):
            return 1
    
    test_num = extract_number(test_input)
    
    trie = Trie()
    if test_num == 1:
        trie.insert("apple")
        return trie.search("apple")
    elif test_num == 2:
        trie.insert("apple")
        return trie.search("app")
    elif test_num == 3:
        trie.insert("apple")
        return trie.startsWith("app")
    elif test_num == 4:
        trie.insert("")
        return trie.search("")
    elif test_num == 5:
        trie.insert("a")
        return trie.search("a")
    elif test_num == 6:
        trie.insert("app")
        trie.insert("apple")
        return trie.search("app")
    elif test_num == 7:
        trie.insert("hello")
        trie.insert("hell")
        return trie.search("hell")
    elif test_num == 8:
        trie.insert("car")
        trie.insert("card")
        return trie.startsWith("car")
    return False
`;
  }

  const wrapperParts: string[] = [];

  wrapperParts.push("\n# Auto-generated solution wrapper for consistent test execution");
  wrapperParts.push("import ast");
  wrapperParts.push(`
def __parse_test_input(value):
    if value is None:
        return None
    if isinstance(value, str):
        stripped = value.strip()
        if stripped == "":
            return ""
        lowered = stripped.lower()
        if lowered == "none":
            return None
        if lowered == "true":
            return True
        if lowered == "false":
            return False
        normalized = stripped.replace('null', 'None')
        try:
            return ast.literal_eval(normalized)
        except Exception:
            return value
    return value

def __prepare_call_args(parsed):
    if isinstance(parsed, dict) and parsed.get('__call__') == 'kwargs':
        return [], parsed.get('kwargs', {})
    if isinstance(parsed, dict) and parsed.get('__call__') == 'args':
        return list(parsed.get('args', [])), {}
    if isinstance(parsed, tuple):
        return list(parsed), {}
    if isinstance(parsed, list):
        return [parsed], {}
    return [parsed], {}
`);

  if (isLinkedListProblem) {
    wrapperParts.push(`
def __convert_linked_list_input(value):
    if isinstance(value, list):
        if value and all(isinstance(item, list) for item in value):
            return [__convert_linked_list_input(item) for item in value]
        if 'list_to_linkedlist' in globals():
            return list_to_linkedlist(value)
    return value

def __convert_linked_list_output(value):
    if isinstance(value, list):
        return [__convert_linked_list_output(item) for item in value]
    if 'ListNode' in globals() and isinstance(value, ListNode):
        return linkedlist_to_list(value)
    return value
`);
  }

  if (isTreeProblem) {
    wrapperParts.push(`
def __convert_tree_input(value):
    if isinstance(value, list) and 'deserialize_tree' in globals():
        return deserialize_tree(value)
    return value

def __convert_tree_output(value):
    if 'TreeNode' in globals() and isinstance(value, TreeNode) and 'serialize_tree' in globals():
        return serialize_tree(value)
    if isinstance(value, list):
        return [__convert_tree_output(item) for item in value]
    return value
`);
  }

  wrapperParts.push(`
def solution(test_input):
    parsed = __parse_test_input(test_input)
    args, kwargs = __prepare_call_args(parsed)
`);

  if (isLinkedListProblem) {
    wrapperParts.push(`
    args = [__convert_linked_list_input(arg) for arg in args]
    if kwargs:
        kwargs = {k: __convert_linked_list_input(v) for k, v in kwargs.items()}
`);
  }

  if (isTreeProblem) {
    wrapperParts.push(`
    args = [__convert_tree_input(arg) for arg in args]
    if kwargs:
        kwargs = {k: __convert_tree_input(v) for k, v in kwargs.items()}
`);
  }

  wrapperParts.push(`
    result = ${defaultFuncName}(*args, **kwargs)
`);

  if (isLinkedListProblem) {
    wrapperParts.push("    result = __convert_linked_list_output(result)");
  }

  if (isTreeProblem) {
    wrapperParts.push("    result = __convert_tree_output(result)");
  }

  wrapperParts.push("    return result");

  return `${typingImports}${code}\n${wrapperParts.join("\n")}`;
};

// formatTestResultsOutput - formats test results for display
const formatTestResultsOutput = (results: any[]): string => {
  if (!results.length) {
    return 'No tests were executed.';
  }

  return results.map((r: any) => {
    if (r.error) {
      return `Test ${r.test}: ✗ FAIL\nError: ${r.error}\nExpected: ${JSON.stringify(r.expected)}\n`;
    }
    const status = r.passed ? '✓ PASS' : '✗ FAIL';
    const resultLine = `Result: ${JSON.stringify(r.result)}`;
    const expectedLine = r.passed ? '' : `\nExpected: ${JSON.stringify(r.expected)}`;
    return `Test ${r.test}: ${status}\n${resultLine}${expectedLine}\n`;
  }).join('\n');
};

// Smart Practice System imports
import type { ConceptScore, PracticeAttempt } from "./types/smart-practice";
import {
  initializeConcept,
  updateConceptScore,
  getPrioritizedConcepts,
  ConceptScoringEngine
} from "./services/conceptScoringEngine";
import {
  problemFamilyMappings,
  getFamilyForProblem,
  getAllFamilies,
  getFamiliesForModule,
  getProblemsForFamily
} from "./data/problemFamilyMapping";

// Map module IDs to their progressive lessons
const progressiveLessonsMap: Record<string, ProgressiveLesson> = {
  "time-complexity-foundations": timeComplexityFoundationsLesson,
  "python-mechanics": module00a_PythonMechanicsLesson,
  "python-algorithmic-thinking": module00b_PythonAlgorithmicLesson,
  "python-basics-fundamentals": module0_5PythonBasicsLesson,
  "array-iteration-techniques": module1ArrayIterationLesson,
  "hash-map-fundamentals": module2HashMapLesson,
  "bit-manipulation-math": module3BitManipulationLesson,
  "sliding-window-mastery": moduleSlidingWindowLesson,
  "prefix-suffix-arrays": modulePrefixSuffixLesson,
  "stack-discovery-lifo": moduleStackLesson,
  "queue-discovery-fifo": moduleQueueLesson,
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
  "parentheses-balanced-strings": module15ParenthesesLesson,
  "intervals-mastery": moduleIntervalsLesson,
  "concurrency-threading": moduleConcurrencyLesson,
};

// Helper function to get default practice exercise for reading sections
function getDefaultPracticeForSection(section: LessonSection): any {
  // Return a simple default exercise based on section ID or module
  if (section.id.includes('intro') || section.id.includes('welcome')) {
    return {
      title: 'Try It: Find Maximum Element',
      instruction: `# Find the Maximum Element

Given an array of integers, find and return the maximum element.

**Examples:**
- \`[1, 5, 3, 9, 2]\` → \`9\`
- \`[-1, -5, -3]\` → \`-1\`
- \`[42]\` → \`42\`

**Your Task:**
Write a function \`find_max(arr)\` that returns the maximum element.

**Hint:** Start with brute force - iterate through the array and keep track of the maximum value you've seen so far.`,
      starterCode: `def find_max(arr):
    # Your code here
    # Hint: Initialize max_val with the first element, then iterate
    pass

# Test your solution
print(find_max([1, 5, 3, 9, 2]))  # Should print 9
print(find_max([-1, -5, -3]))     # Should print -1
print(find_max([42]))              # Should print 42`,
      testCases: [
        { input: '[1, 5, 3, 9, 2]', expectedOutput: '9' },
        { input: '[-1, -5, -3]', expectedOutput: '-1' },
        { input: '[42]', expectedOutput: '42' },
        { input: '[0, 0, 0]', expectedOutput: '0' },
      ]
    };
  }
  // Add more defaults based on section types if needed
  return null;
}

// Helper function to extract just the problem statement from instruction field
// Removes instructional steps and explanations, keeping only the core problem description
function extractProblemStatement(instruction: string | undefined): string {
  if (!instruction) return '';

  // Try to extract content from "## The Problem" section
  const problemMatch = instruction.match(/##\s+The\s+Problem\s*\n\n([\s\S]*?)(?=\n##|\n###|$)/i);
  if (problemMatch) {
    let problemText = problemMatch[1].trim();
    // Remove code blocks but keep their content description
    problemText = problemText.replace(/```[\s\S]*?```/g, '');
    // Clean up extra whitespace
    problemText = problemText.replace(/\n{3,}/g, '\n\n').trim();
    if (problemText.length > 0) {
      return problemText;
    }
  }

  // If no "The Problem" section, extract everything before first "Step" or instructional heading
  const beforeStepsMatch = instruction.match(/^([\s\S]*?)(?=\n###\s+Step|\n##\s+(Your Task|How|What|The Fix|Memory|The Recursive|The Copy))/i);
  if (beforeStepsMatch) {
    let text = beforeStepsMatch[1].trim();
    // Remove markdown headers but keep content
    text = text.replace(/^#+\s+/gm, '');
    // Remove code blocks but keep their content description
    text = text.replace(/```[\s\S]*?```/g, '');
    // Clean up extra whitespace
    text = text.replace(/\n{3,}/g, '\n\n').trim();
    if (text.length > 0 && text.length < 500) { // Reasonable length check
      return text;
    }
  }

  // Fallback: return first paragraph or first 200 characters
  const firstParagraph = instruction.split('\n\n')[0].replace(/^#+\s+/gm, '').trim();
  if (firstParagraph.length > 0 && firstParagraph.length < 300) {
    return firstParagraph;
  }

  return '';
}

// Helper function to extract all exercises from progressive lessons
function getAllExercisesFromLessons(): DSAProblem[] {
  const exercises: DSAProblem[] = [];

  Object.entries(progressiveLessonsMap).forEach(([lessonId, lesson]) => {
    // Get prerequisites for this lesson's module
    // The lesson ID matches the module ID in MODULE_PREREQUISITES
    const basePrereqs = MODULE_PREREQUISITES[lessonId] || [];
    // Include the teaching module/lesson itself as the last prerequisite so
    // Smart Practice can treat it as the problem's \"home\" module.
    const prerequisites = [...basePrereqs, lessonId];
    // Compute a base curriculum order offset from the module index
    const moduleIndex = MODULE_ORDER.indexOf(lessonId);
    const moduleOffset = moduleIndex >= 0 ? moduleIndex * 100 : Number.MAX_SAFE_INTEGER;

    lesson.sections.forEach((section, sectionIndex) => {
      if (section.type === 'exercise') {
        // Convert exercise section to DSAProblem format
        // Hints in exercises have {afterAttempt, text} structure, extract just text
        const hints = (section.hints || [])
          .map(hint => typeof hint === 'string' ? hint : hint.text)
          .filter((hint): hint is string => hint !== undefined);

        // Handle solution which can be string or {afterAttempt, text}
        // Also check expectedOutput as fallback (some exercises use this for solution code)
        let solutionText = typeof section.solution === 'string'
          ? section.solution
          : section.solution?.text || '';

        // If no solution found, try expectedOutput (used by some exercises)
        if (!solutionText && (section as any).expectedOutput) {
          solutionText = (section as any).expectedOutput;
        }

        // Convert testCases to DSATestCase format with id
        const testCases = (section.testCases || []).map((tc, idx) => ({
          id: `${section.id}-test-${idx}`,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          hidden: false
        }));

        // For Smart Practice, use the FULL instruction (not just description)
        // The instruction contains the complete problem with examples and explanation
        // Fall back to description only if instruction is not available
        const fullDescription = section.instruction || section.description || '';

        exercises.push({
          id: section.id,
          title: section.title,
          description: fullDescription,
          difficulty: section.difficulty || 'easy',
          topic: 'arrays', // Default topic since 'exercise' is not a valid DSATopic
          examples: [], // ExerciseSection doesn't have examples property
          constraints: [], // ExerciseSection doesn't have constraints property
          hints: hints,
          starterCode: section.starterCode || '',
          solution: solutionText,
          testCases: testCases,
          timeComplexity: section.targetComplexity?.time || '',
          spaceComplexity: section.targetComplexity?.space || '',
          targetComplexity: section.targetComplexity,
          tags: [],
          // Assign prerequisites based on the lesson's module
          // This ensures problems are properly prioritized in Smart Practice
          prerequisites,
          requiredModules: prerequisites, // Also set requiredModules for compatibility
          // Curriculum order for Smart Practice tie-breaking: earlier modules/sections first
          curriculumOrder: moduleOffset + sectionIndex,
        } as DSAProblem);
      }
    });
  });

  return exercises;
}

// Combined problems: standalone LeetCode problems + exercises from progressive lessons + Smart Practice
const allProblems: DSAProblem[] = [...dsaProblems, ...getAllExercisesFromLessons()];

// Helper function to handle Python task validation with Pyodide
async function handlePythonTaskRun(
  code: string,
  currentTask: any,
  setCompletedTasks: any,
  setCurrentTaskId: any,
  interactiveTasks: any[]
): Promise<{ success: boolean; output: string; error?: string }> {
  try {
    // Run the Python code using Pyodide
    const result = await runPythonCode(code);

    if (result.error) {
      return {
        success: false,
        output: "",
        error: result.error,
      };
    }

    // Check if output matches expected
    const actualOutput = result.output.trim();
    const expectedOutput = currentTask.expectedOutput.trim();
    const isValid = actualOutput === expectedOutput;

    if (isValid) {
      // Mark task as complete
      setCompletedTasks((prev: Set<string>) =>
        new Set([...prev, currentTask.id])
      );

      const currentIndex = interactiveTasks.findIndex(
        (t) => t.id === currentTask.id
      );

      return {
        success: true,
        output: `✓ Correct! Great job!\n\nOutput:\n${actualOutput}\n\n${currentIndex < interactiveTasks.length - 1
          ? "Click 'Next' to continue."
          : "🎉 All tasks completed! Switch to Practice Mode to solve problems."
          }`,
      };
    } else {
      return {
        success: false,
        output: `✗ Not quite right.\n\nYour output:\n${actualOutput}\n\nExpected:\n${expectedOutput}\n\n${currentTask.hint ? `Hint: ${currentTask.hint}` : ''}`,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      output: "",
      error: err.message,
    };
  }
}

// Utility function
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

// Resizable components
function ResizablePanelGroup({
  className = "",
  ...props
}: any) {
  return (
    <ResizablePrimitive.PanelGroup
      className={cn("flex h-full w-full", className)}
      {...props}
    />
  );
}

function ResizablePanel(props: any) {
  return <ResizablePrimitive.Panel {...props} />;
}

function ResizableHandle({
  withHandle,
  className = "",
  ...props
}: any) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        "relative flex w-px items-center justify-center bg-slate-200 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-slate-200 bg-slate-100">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

function getTopicIcon(topic: string) {
  const icons: Record<string, string> = {
    arrays: "📊",
    "linked-lists": "🔗",
    "stacks-queues": "📚",
    trees: "🌳",
    graphs: "🕸️",
    sorting: "🔄",
    searching: "🔍",
    "dynamic-programming": "💡",
    greedy: "🎯",
    backtracking: "🔙",
  };
  return icons[topic] || "💻";
}

// Check URL params for dev/testing mode
const getDevModeParams = () => {
  if (typeof window === 'undefined') return { devMode: false, startModule: null };
  const params = new URLSearchParams(window.location.search);
  const devMode = params.get('dev') === 'true' || params.get('unlockAll') === 'true';
  const startModule = params.get('module') ? parseInt(params.get('module')!, 10) : null;
  return { devMode, startModule };
};

// Store dev mode globally so moduleChaining can access it
(window as any).__DSA_DEV_MODE__ = getDevModeParams().devMode;

function AppDSAContent() {
  const { devMode, startModule } = getDevModeParams();

  // Parse URL path for module navigation (e.g., /dsa/module/python-basics-fundamentals)
  // Also supports /dsa/module/smart-practice/problem/{problemId}
  const parseUrlPath = () => {
    const path = window.location.pathname;

    // Check if we're at the root /dsa path
    if (path === '/dsa' || path === '/dsa/') {
      return { moduleIndex: 0, showDashboard: true };
    }

    const match = path.match(/^\/dsa\/module\/(.+)$/);
    if (!match) return null;

    const modulePath = match[1];

    // Check for smart-practice problem pattern: /dsa/module/smart-practice/problem/{problemId}
    const problemMatch = modulePath.match(/^smart-practice\/problem\/(.+)$/);
    if (problemMatch) {
      const problemId = problemMatch[1];
      const smartPracticeIndex = dsaCourse.modules.findIndex(m => m.id === 'smart-practice');
      if (smartPracticeIndex >= 0) {
        return { moduleIndex: smartPracticeIndex, showDashboard: false, problemId };
      }
    }

    // Try to find by module ID first (most common case)
    const moduleIndex = dsaCourse.modules.findIndex(m => m.id === modulePath);
    if (moduleIndex >= 0) {
      return { moduleIndex, showDashboard: false };
    }

    // Fallback: try to find by index (e.g., /dsa/module/0, /dsa/module/1)
    const indexMatch = modulePath.match(/^(\d+)$/);
    if (indexMatch) {
      const index = parseInt(indexMatch[1], 10);
      if (index >= 0 && index < dsaCourse.modules.length) {
        return { moduleIndex: index, showDashboard: false };
      }
    }

    return null;
  };

  // Update URL path when module changes
  const updateUrlPath = (moduleIndex: number) => {
    const module = dsaCourse.modules[moduleIndex];
    if (module) {
      const newPath = `/dsa/module/${module.id}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    }
  };

  // Initialize state from URL or defaults
  const urlState = parseUrlPath();
  const [showDashboard, setShowDashboard] = useState(() => {
    if (urlState) return urlState.showDashboard;
    // If URL has a specific module, go directly to it
    if (startModule !== null && startModule >= 0) {
      return false;
    }
    return true;
  });

  const [currentModuleIndex, setCurrentModuleIndex] = useState(() => {
    if (urlState) return urlState.moduleIndex;
    // URL param takes priority
    if (startModule !== null && startModule >= 0 && startModule < dsaCourse.modules.length) {
      return startModule;
    }
    const { position } = loadProgressFromStorage();
    return position?.moduleIndex ?? 0;
  });

  // Listen for browser back/forward button
  useEffect(() => {
    const handlePopState = () => {
      const urlState = parseUrlPath();
      if (urlState) {
        setCurrentModuleIndex(urlState.moduleIndex);
        setShowDashboard(urlState.showDashboard);
        // Update problemId if it's in the URL
        if ((urlState as any).problemId) {
          setCurrentProblemId((urlState as any).problemId);
        } else {
          // Check if we're navigating to smart-practice without a problemId
          const module = dsaCourse.modules[urlState.moduleIndex];
          if (module?.id === 'smart-practice') {
            // If we're on smart-practice but no problemId in URL, clear it
            setCurrentProblemId(null);
          } else {
            // For other modules, clear problemId
            setCurrentProblemId(null);
          }
        }
      } else {
        // No module path = dashboard
        setShowDashboard(true);
        setCurrentProblemId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when module index changes
  useEffect(() => {
    if (!showDashboard) {
      updateUrlPath(currentModuleIndex);
    } else {
      // Go to root /dsa when showing dashboard
      if (window.location.pathname !== '/dsa' && window.location.pathname !== '/dsa/') {
        window.history.pushState(null, '', '/dsa');
      }
    }
  }, [currentModuleIndex, showDashboard]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(() => {
    const { position } = loadProgressFromStorage();
    return position?.lessonIndex ?? 0;
  });
  const { isDark, colors } = useTheme();
  const { completeModule, completedModules: gamificationCompletedModules } = useGamificationStore();

  // Sync existing completed modules from localStorage to gamification store on mount
  // Make validator and fixer available in browser console
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).validateAllProblems = validateAllProblemsInBrowser;
      // Add common typo alias
      (window as any).validateAllPRoblems = validateAllProblemsInBrowser;
      (window as any).fixAllProblems = fixAllProblems;
      console.log('🔍 Problem tools loaded!');
      console.log('  - validateAllProblems() - Check which problems fail');
      console.log('  - fixAllProblems() - Actually fix problems by running solutions');
    }
  }, []);

  // This ensures Smart Practice prerequisites work for modules completed before the fix
  useEffect(() => {
    const { allProgress } = loadProgressFromStorage();

    // Check each saved progress and sync completed modules
    for (const [lessonId, progress] of allProgress.entries()) {
      // Skip if already in gamification store
      if (gamificationCompletedModules.includes(lessonId)) continue;

      // Check if module is complete (100% progress)
      if (progress.overallProgress === 100) {
        // Find the module to get its title
        const module = dsaCourse.modules.find(m => m.id === lessonId);
        const moduleTitle = module?.title || lessonId;

        // Count completed sections
        let completedCount = 0;
        for (const [, sectionProgress] of progress.sectionsProgress) {
          if (sectionProgress.status === 'completed') {
            completedCount++;
          }
        }

        completeModule(lessonId, moduleTitle, 100, completedCount);
      }
    }
  }, []); // Run once on mount - completeModule is stable from Zustand

  const [currentProblemId, setCurrentProblemId] = useState<
    string | null
  >(() => {
    // Initialize from URL if it's a smart-practice problem
    const urlState = parseUrlPath();
    return (urlState as any)?.problemId || null;
  });
  // Load solvedProblems from localStorage on mount
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOLVED_PROBLEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Set(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading solved problems from localStorage:', error);
    }
    return new Set();
  });
  const [attemptedProblems, setAttemptedProblems] = useState<
    Set<string>
  >(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [exerciseSuccess, setExerciseSuccess] = useState<{
    exerciseId: string;
    exerciseTitle: string;
  } | null>(null);

  // Module completion modal state
  const [showModuleCompleteModal, setShowModuleCompleteModal] = useState(false);
  const [completedModuleInfo, setCompletedModuleInfo] = useState<{
    completedModule: string;
    nextModule: { moduleId: string; moduleTitle: string } | null;
  } | null>(null);

  // Mastery Feedback state
  const [masteryFeedbackData, setMasteryFeedbackData] = useState<{
    earnedXp: number;
    masteryGain: number;
    problemTitle: string;
  } | null>(null);

  // Interactive task state
  const [currentTaskId, setCurrentTaskId] = useState<
    string | null
  >(null);

  const [currentView, setCurrentView] = useState<
    "dashboard" | "lesson" | "problem" | "playground" | "progressive-lesson" | "enhanced-reading" | "complexity-analysis" | "mastery-dashboard" | "adaptive-stream"
  >("dashboard");
  const [completedTasks, setCompletedTasks] = useState<
    Set<string>
  >(new Set());
  const [expandedHints, setExpandedHints] = useState<
    Set<string>
  >(new Set());
  const [showQuiz, setShowQuiz] = useState(false);

  // Quiz completion state for progressive lessons
  const [completedQuizzes, setCompletedQuizzes] = useState<
    Set<string>
  >(new Set());

  // Current quiz index for Time Complexity progressive lesson
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  // Time Complexity stage index
  const [timeComplexityStageIndex, setTimeComplexityStageIndex] = useState(0);

  // Progressive lesson quiz index (CKAD-style progression) - works for all progressive modules
  const [progressiveQuizIndex, setProgressiveQuizIndex] = useState(0);

  // State for quick quiz answers in reading sections
  const [readingQuizAnswers, setReadingQuizAnswers] = useState<Map<string, { answer: number | null; completed: boolean }>>(new Map());

  // State for showing linked list practice
  const [showLinkedListPractice, setShowLinkedListPractice] = useState(false);

  // Progressive lesson state (for CKAD-style lessons like Time Complexity)
  // Initialize from localStorage if available - use saved position to determine which module's progress to load
  const [progressiveLessonProgress, setProgressiveLessonProgress] = useState<ProgressiveLessonProgress>(() => {
    const { allProgress, position } = loadProgressFromStorage();

    // Get the module ID based on saved position
    const savedModuleIndex = position?.moduleIndex ?? 0;
    const savedModuleId = dsaCourse.modules[savedModuleIndex]?.id;

    // Try to load progress for the saved module first
    if (savedModuleId) {
      const savedProgress = allProgress.get(savedModuleId);
      if (savedProgress) {
        return savedProgress;
      }
    }

    // Fallback: try time-complexity-foundations
    const fallbackProgress = allProgress.get('time-complexity-foundations');
    if (fallbackProgress) {
      return fallbackProgress;
    }

    return {
      lessonId: 'time-complexity-foundations',
      currentSectionIndex: 0,
      sectionsProgress: new Map<string, SectionProgress>([
        // Only unlock the first section initially
        ['intro-why-speed', { sectionId: 'intro-why-speed', status: 'unlocked', attempts: 0, timeSpent: 0 }]
      ]),
      overallProgress: 0,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      totalTimeSpent: 0,
    };
  });

  // Track exercises awaiting complexity analysis (tests passed but questions not answered)
  const [exercisesAwaitingAnalysis, setExercisesAwaitingAnalysis] = useState<Set<string>>(new Set());

  // Track exercises where complexity quiz was completed BEFORE coding (for 'before' placement)
  const [exercisesWithBeforeQuizCompleted, setExercisesWithBeforeQuizCompleted] = useState<Set<string>>(new Set());

  // Track when to show complexity explanation in left panel after 'before' quiz completion
  const [showingBeforeQuizExplanation, setShowingBeforeQuizExplanation] = useState<string | null>(null);

  // ═══════════════════════════════════════════════════════════
  // SMART PRACTICE SYSTEM STATE
  // ═══════════════════════════════════════════════════════════

  // Current practice module (0.5, 1-4, 4.5, 5-13)
  const [currentPracticeModule, setCurrentPracticeModule] = useState<number>(0.5);

  // Module order for progression (Module 0 excluded - quizzes only)
  // Module order for Smart Practice progression
  // Module 3 (was 4) = Array+HashMap, Module 4 (was 4.5) = Python OOP
  // Module 16 = Bit Manipulation (moved from old Module 3)
  const MODULE_ORDER = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  // Concept scores for all 63 families (initialized when user completes modules)
  const [conceptScores, setConceptScores] = useState<ConceptScore[]>([]);

  // UNIFIED TRACKING (works in BOTH Learn and Practice modes)
  // Submission attempts tracking: problemId -> number of attempts
  const [submissionAttempts, setSubmissionAttempts] = useState<Map<string, number>>(new Map());

  // Hints used per problem: problemId -> number of hints (loaded from localStorage)
  const [hintsUsed, setHintsUsed] = useState<Map<string, number>>(() => {
    const { hintsUsed: savedHints } = loadProgressFromStorage();
    return savedHints;
  });

  // Expandable lessons per exercise (for Phase 1 hint system)
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());

  // Expanded modules in sidebar (for collapse/expand functionality)
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0])); // Start with Module 0 expanded

  // Journey Map vs Detailed Sidebar toggle
  const [useJourneyMap, setUseJourneyMap] = useState<boolean>(true); // Default to Journey Map

  // Track all progressive lesson progress across all modules (loaded from localStorage)
  const [allProgressiveLessonProgress, setAllProgressiveLessonProgress] = useState<Map<string, ProgressiveLessonProgress>>(() => {
    const { allProgress } = loadProgressFromStorage();
    return allProgress;
  });

  // Collapsed problem descriptions (auto-collapse when hints appear)
  const [collapsedDescriptions, setCollapsedDescriptions] = useState<Set<string>>(new Set());

  // Track exercises solved with brute force (O(n log n)) - unlock hint #3
  const [bruteForceSolved, setBruteForceSolved] = useState<Set<string>>(new Set());

  // Track when to show/highlight the brute force blocker message
  const [showBruteForceBlocker, setShowBruteForceBlocker] = useState<Set<string>>(new Set());
  const [highlightBruteForceBlocker, setHighlightBruteForceBlocker] = useState<string | null>(null);

  // Module 15 Smart Practice Integration
  const [module15CompletedItems, setModule15CompletedItems] = useState<Set<string>>(() => {
    // Load from localStorage
    try {
      const saved = localStorage.getItem('module15-progress-default');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedItems && Array.isArray(parsed.completedItems)) {
          return new Set(parsed.completedItems);
        }
      }
    } catch (err) {
    }
    return new Set();
  });


  // Get studied modules from Module 15 progress
  const baseStudiedModules = getStudiedModules(module15CompletedItems, module15CompleteContent);

  // Also include modules that have been completed via progressive lessons
  const studiedModules = useMemo(() => {
    const modules = [...baseStudiedModules];

    // Always add DP module so Smart Practice shows DP problems
    // DP exercises are heavily used in Smart Practice regardless of unlock order
    const hasDP = modules.some(m => m.moduleId === 11);
    if (!hasDP) {
      const dpSections = module11DynamicProgrammingLesson.sections.length;
      // Check if user has any progress in DP
      const dpLessonProgress = allProgressiveLessonProgress.get('dynamic-programming');
      let dpProgress = 0;
      let completedSections = 0;
      if (dpLessonProgress) {
        dpProgress = calculateLessonProgress(module11DynamicProgrammingLesson, dpLessonProgress);
        completedSections = Math.round((dpProgress / 100) * dpSections);
      }

      // Add DP module unconditionally - mark as in-progress if no progress yet
      modules.push({
        moduleId: 11,
        name: 'Dynamic Programming',
        concepts: ['dp', 'memoization', 'bottom-up', 'dynamic-programming'],
        status: dpProgress >= 100 ? 'completed' : 'in-progress',
        completedItems: completedSections || 1, // At least 1 to show as in-progress
        totalItems: dpSections,
        percentage: dpProgress || 1 // At least 1% to show as in-progress
      });
    }

    return modules;
  }, [baseStudiedModules, allProgressiveLessonProgress]);

  // ═══════════════════════════════════════════════════════════
  // PROGRESS PERSISTENCE
  // ═══════════════════════════════════════════════════════════

  // Sync progressiveLessonProgress to allProgressiveLessonProgress when it changes
  useEffect(() => {
    if (progressiveLessonProgress.lessonId) {
      setAllProgressiveLessonProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(progressiveLessonProgress.lessonId, progressiveLessonProgress);
        return newMap;
      });
    }
  }, [progressiveLessonProgress]);

  // Save progress to localStorage whenever allProgressiveLessonProgress, hintsUsed, or position changes
  useEffect(() => {
    saveProgressToStorage(
      allProgressiveLessonProgress,
      hintsUsed,
      { moduleIndex: currentModuleIndex, lessonIndex: currentLessonIndex }
    );
  }, [allProgressiveLessonProgress, hintsUsed, currentModuleIndex, currentLessonIndex]);

  // Save solvedProblems to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SOLVED_PROBLEMS, JSON.stringify(Array.from(solvedProblems)));
    } catch (error) {
      console.error('Error saving solved problems to localStorage:', error);
    }
  }, [solvedProblems]);

  // Reset all progress function
  const resetAllProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY_PROGRESS);
      localStorage.removeItem(STORAGE_KEY_HINTS);
      localStorage.removeItem(STORAGE_KEY_POSITION);
      localStorage.removeItem(STORAGE_KEY_SOLVED_PROBLEMS);

      // Reset state
      setAllProgressiveLessonProgress(new Map());
      setHintsUsed(new Map());
      setProgressiveLessonProgress({
        lessonId: 'time-complexity-foundations',
        currentSectionIndex: 0,
        sectionsProgress: new Map<string, SectionProgress>([
          ['intro-why-speed', { sectionId: 'intro-why-speed', status: 'unlocked', attempts: 0, timeSpent: 0 }]
        ]),
        overallProgress: 0,
        startedAt: new Date(),
        lastActivityAt: new Date(),
        totalTimeSpent: 0,
      });
      setExpandedLessons(new Set());
      setCollapsedDescriptions(new Set());
      setBruteForceSolved(new Set());
      setShowBruteForceBlocker(new Set());
      setExercisesAwaitingAnalysis(new Set());
      setExercisesWithBeforeQuizCompleted(new Set());
      setSolvedProblems(new Set());

      // Go back to first module
      setCurrentModuleIndex(0);
      setCurrentLessonIndex(0);
    }
  };

  // Initialize concept scores when component mounts
  // Checks existing progress and sets appropriate initial weakness
  useEffect(() => {
    // Get all unique families and initialize them with learning sequence
    const families = getAllFamilies();

    const initialScores = families.map((family, index) => {
      // Check how many problems in this family are already solved
      const familyProblems = problemFamilyMappings
        .filter(m => m.familyId === family.familyId)
        .map(m => m.problemId);

      const solvedCount = familyProblems.filter(pid =>
        solvedProblems.has(pid)
      ).length;

      // Initialize base concept
      const concept = initializeConcept(
        family.familyId,
        family.familyName,
        index + 1, // Learning sequence (1-63)
        `module-${family.moduleId}`
      );

      // Adjust initial weakness based on existing progress
      // Each solved problem reduces weakness by 8 points
      if (solvedCount > 0) {
        const weaknessReduction = solvedCount * 8;
        concept.weaknessScore = Math.max(0, concept.weaknessScore - weaknessReduction);
        concept.practiceCount = solvedCount;
        concept.successCount = solvedCount;
        concept.successRate = 1.0; // Assume all solved problems were successful
      }

      return concept;
    });
    setConceptScores(initialScores);
  }, []); // Only run once on mount

  // Auto-select starting practice module based on existing progress
  // DISABLED: Always start at Module 0, user can navigate with Next Module button
  // useEffect(() => {
  //   if (conceptScores.length === 0) return;

  //   // Find first module with high avg weakness (> 30)
  //   for (const moduleNum of MODULE_ORDER) {
  //     const moduleFamilies = getFamiliesForModule(moduleNum);
  //     const moduleScores = conceptScores.filter(c =>
  //       moduleFamilies.some(f => f.familyId === c.conceptId)
  //     );

  //     if (moduleScores.length === 0) continue;

  //     const avgWeakness = moduleScores.reduce((sum, c) => sum + c.weaknessScore, 0) / moduleScores.length;

  //     // If avg weakness > 30, start here (needs practice)
  //     if (avgWeakness > 30) {
  //       setCurrentPracticeModule(moduleNum);
  //       return;
  //     }
  //   }

  //   // If all modules have low weakness, default to Module 0 (Time Complexity)
  //   setCurrentPracticeModule(0);
  // }, [conceptScores]); // Run when conceptScores are initialized

  // Get recommended problems for practice mode based on concept priorities (MODULE-SCOPED)
  const getRecommendedProblems = (): DSAProblem[] => {
    if (conceptScores.length === 0) {
      return [];
    }

    // Get families for CURRENT practice module only, in NATURAL ORDER
    const moduleFamilies = getFamiliesForModule(currentPracticeModule);

    if (moduleFamilies.length === 0) {
      return [];
    }

    // Create natural order index for each family (based on order in problemFamilyMapping.ts)
    const familyOrderMap = new Map<string, number>();
    moduleFamilies.forEach((family, index) => {
      familyOrderMap.set(family.familyId, index);
    });

    // Determine which families are unlocked (sequential progression)
    const unlockedFamilies = new Set<string>();
    const familiesInOrder = [...moduleFamilies].sort((a, b) =>
      familyOrderMap.get(a.familyId)! - familyOrderMap.get(b.familyId)!
    );

    for (let i = 0; i < familiesInOrder.length; i++) {
      const family = familiesInOrder[i];

      // First family is always unlocked
      if (i === 0) {
        unlockedFamilies.add(family.familyId);
        continue;
      }

      // Check if previous family has at least one solved problem
      const previousFamily = familiesInOrder[i - 1];
      const previousFamilyProblems = problemFamilyMappings
        .filter(m => m.familyId === previousFamily.familyId && m.moduleId === currentPracticeModule)
        .map(m => m.problemId);

      const hasSolvedInPrevious = previousFamilyProblems.some(pid => solvedProblems.has(pid));

      if (hasSolvedInPrevious) {
        unlockedFamilies.add(family.familyId);
      } else {
        // Stop unlocking - all subsequent families are locked
        break;
      }
    }

    // Filter concept scores to this module's UNLOCKED families
    const moduleConceptScores = conceptScores.filter(c =>
      moduleFamilies.some(f => f.familyId === c.conceptId) &&
      unlockedFamilies.has(c.conceptId)
    );

    if (moduleConceptScores.length === 0) {
      return [];
    }

    // Get prioritized concepts (by weakness)
    const prioritized = getPrioritizedConcepts(moduleConceptScores);

    // HYBRID SORT: weakness (primary) + natural order (tiebreaker)
    const sortedConcepts = [...prioritized].sort((a, b) => {
      // Primary sort: by weakness priority (descending - higher priority = weaker)
      const priorityDiff = b.priority - a.priority;
      if (Math.abs(priorityDiff) > 5) { // Significant difference threshold
        return priorityDiff;
      }

      // Tiebreaker: by natural order (ascending - lower index = earlier in lessons)
      const orderA = familyOrderMap.get(a.conceptId) ?? 999;
      const orderB = familyOrderMap.get(b.conceptId) ?? 999;
      return orderA - orderB;
    });

    // Pick ONE problem from each family, in sorted order
    const recommendedProblems: DSAProblem[] = [];

    for (const concept of sortedConcepts) {
      // Get all problems for this family in this module
      const familyProblemIds = problemFamilyMappings
        .filter(m => m.familyId === concept.conceptId && m.moduleId === currentPracticeModule)
        .map(m => m.problemId);

      if (familyProblemIds.length === 0) continue;

      // Pick the first unsolved problem from this family, or the first one if all solved
      const unsolvedProblem = familyProblemIds.find(pid => !solvedProblems.has(pid));
      const selectedProblemId = unsolvedProblem || familyProblemIds[0];

      // Find the actual problem object
      const problemObj = allProblems.find(p => p.id === selectedProblemId);

      if (problemObj) {
        recommendedProblems.push(problemObj);
      }
    }
    return recommendedProblems;
  };

  // UNIFIED PROGRESS UPDATE FUNCTION (works in BOTH Learn and Practice modes)
  // Updates concept scores based on problem solving performance
  const updateProgressOnSolve = (problemId: string, submissionCount: number, hintsCount: number, problem: DSAProblem) => {
    // Mark problem as solved (using functional update to avoid stale closure)
    setSolvedProblems(prev => new Set([...prev, problemId]));

    // Find which concept family this problem belongs to
    const familyMapping = getFamilyForProblem(problemId);

    if (familyMapping) {
      // Create practice attempt record (NO TIME TRACKING)
      const attempt: PracticeAttempt = {
        success: true,
        timeSpent: 0,  // Not used anymore
        expectedTime: 0,  // Not used anymore
        hintsUsed: hintsCount,
        submissionAttempts: submissionCount,  // PRIMARY weakness indicator
        problemDifficulty: problem.difficulty as 'easy' | 'medium' | 'hard',
      };

      // Update concept score using scoring engine
      setConceptScores(prevScores => {
        const conceptIndex = prevScores.findIndex(c => c.conceptId === familyMapping.familyId);
        if (conceptIndex === -1) return prevScores;

        const updatedConcept = updateConceptScore(prevScores[conceptIndex], attempt);
        const newScores = [...prevScores];
        newScores[conceptIndex] = updatedConcept;
        return newScores;
      });

      // Reset tracking for this problem
      setSubmissionAttempts(new Map(submissionAttempts).set(problemId, 0));
      setHintsUsed(new Map(hintsUsed).set(problemId, 0));
    }
  };

  // Handle practice mode code run with submission tracking
  // Uses the shared test harness utility for consistent behavior across module exercises and Smart Practice
  const handlePracticeCodeRun = async (code: string, problemId: string, complexity?: { time: string; space: string }) => {
    const problem = allProblems.find(p => p.id === problemId);
    if (!problem) return { success: false, output: '', error: 'Problem not found' };

    // Get target complexity for this problem
    const targetComplexity = problem.targetComplexity ||
      (problem.timeComplexity && problem.spaceComplexity
        ? { time: problem.timeComplexity, space: problem.spaceComplexity }
        : { time: 'O(n)', space: 'O(1)' });

    // Increment submission attempts
    const currentAttempts = submissionAttempts.get(problemId) || 0;
    const newAttempts = currentAttempts + 1;
    setSubmissionAttempts(new Map(submissionAttempts).set(problemId, newAttempts));

    try {
      // Preprocess code (adds tree/linked list helpers) - same logic as modules use
      const preprocessedCode = preprocessCodeForExecution(code, {
        id: problem.id,
        title: problem.title,
        instruction: problem.description,
        starterCode: problem.starterCode,
        testCases: problem.testCases.map(tc => ({
          input: tc.input,
          expectedOutput: tc.expectedOutput
        }))
      });

      // Convert test cases to normalized format
      const normalizedTestCases = normalizeSmartPracticeTestCases(problem.testCases);

      // Build test harness using shared utility (with preprocessed code)
      const testCode = buildPythonTestHarness(preprocessedCode, normalizedTestCases);

      // Run the test code
      const result = await runPythonCode(testCode);

      if (result.error) {
        return { success: false, output: '', error: result.error };
      }

      // Parse results using shared utility
      const { results: testResults, error: parseError } = parsePythonTestResults(result.output);

      if (parseError) {
        return { success: false, output: '', error: parseError };
      }

      const allPassed = testResults.every((r: any) => r.passed);

      // If all passed, use unified update function
      if (allPassed) {
        const hintsCount = hintsUsed.get(problemId) || 0;
        updateProgressOnSolve(problemId, newAttempts, hintsCount, problem);

        // Trigger Mastery Feedback Modal for Smart Practice
        // Check if we are in smart practice module or mastery dashboard view
        const currentModule = dsaCourse.modules[currentModuleIndex];
        if (currentModule.id === 'smart-practice' || currentView === 'mastery-dashboard') {
          setMasteryFeedbackData({
            earnedXp: problem.difficulty === 'hard' ? 100 : problem.difficulty === 'medium' ? 50 : 25,
            masteryGain: 5,
            problemTitle: problem.title
          });
        }
      }

      // Format output
      const output = testResults.map((r: any, i: number) => {
        if (r.error) {
          return `Test ${i + 1}: ✗ FAIL\nError: ${r.error}\n`;
        }
        return `Test ${i + 1}: ${r.passed ? '✓ PASS' : '✗ FAIL'}\n` +
          `Result: ${JSON.stringify(r.result)}\n` +
          (r.passed ? '' : `Expected: ${JSON.stringify(r.expected)}\n`);
      }).join('\n');

      // Normalize complexity for comparison (handle different notations)
      const normalizeComplexity = (comp: string): string => {
        if (!comp) return comp;
        return comp
          .replace(/·/g, '*')      // Replace middle dot (·) with asterisk
          .replace(/×/g, '*')      // Replace multiplication sign (×) with asterisk
          .replace(/\s*\*\s*/g, '*')  // Remove spaces around asterisks
          .replace(/\s+/g, '')     // Remove all remaining whitespace
          .trim()
          .toLowerCase();
      };

      // Validate complexity if provided
      const complexityFeedback = complexity ? {
        timeCorrect: normalizeComplexity(complexity.time) === normalizeComplexity(targetComplexity.time),
        spaceCorrect: normalizeComplexity(complexity.space) === normalizeComplexity(targetComplexity.space),
        timeExpected: targetComplexity.time,
        spaceExpected: targetComplexity.space
      } : undefined;

      return {
        success: allPassed,
        output: output + (allPassed ? '\n🎉 All tests passed!' : '\n❌ Some tests failed'),
        error: undefined,
        testResults: testResults,
        complexityFeedback
      };
    } catch (err: any) {
      return { success: false, output: '', error: err.message };
    }
  };

  // MASTERY NAVIGATION
  const handleStartMasteryPractice = (familyId: string) => {
    // 1. Check for L5 Advanced Modules (Concurrency, System Design, etc.)
    // These IDs match between Family ID and Module ID
    const directModuleIndex = dsaCourse.modules.findIndex(m => m.id === familyId);
    if (directModuleIndex !== -1) {
      setCurrentModuleIndex(directModuleIndex);
      setCurrentView('adaptive-stream');
      return;
    }

    // 2. Standard Problem Navigation
    const variations = getProblemsForFamily(familyId);

    if (variations.length > 0) {
      // Pick the first variation for MVP - ideally should be next unmastered
      // Or random from variations
      const problemId = variations[0];

      if (problemId) {
        setCurrentProblemId(problemId);

        // Navigate to Smart Practice module
        const smartPracticeIdx = dsaCourse.modules.findIndex(m => m.id === 'smart-practice');
        if (smartPracticeIdx !== -1) {
          setCurrentModuleIndex(smartPracticeIdx);
          setCurrentView('dashboard');
        }
      }
    }
  };

  // MODULE NAVIGATION FUNCTIONS
  // ═══════════════════════════════════════════════════════════

  const goToNextPracticeModule = () => {
    const currentIdx = MODULE_ORDER.indexOf(currentPracticeModule);
    if (currentIdx < MODULE_ORDER.length - 1) {
      setCurrentPracticeModule(MODULE_ORDER[currentIdx + 1]);
    }
  };

  const goToPrevPracticeModule = () => {
    const currentIdx = MODULE_ORDER.indexOf(currentPracticeModule);
    if (currentIdx > 0) {
      setCurrentPracticeModule(MODULE_ORDER[currentIdx - 1]);
    }
  };

  const getModuleName = (moduleNum: number): string => {
    const moduleMap: Record<number, string> = {
      0: 'Time Complexity Foundations',
      0.5: 'Python Basics',
      1: 'Array Iteration',
      2: 'Hash Maps',
      3: 'Bit Manipulation',
      4: 'Python OOP & Libraries',
      5: 'Linked Lists',
      6: 'Trees',
      7: 'Binary Search',
      8: 'Graphs',
      9: 'Dynamic Programming',
      10: 'Heaps',
      11: 'Backtracking',
      12: 'Tries',
      13: 'Advanced Topics'
    };
    return moduleMap[moduleNum] || 'Unknown';
  };

  const calculateModuleProgress = (): number => {
    if (currentPracticeModule === 0) {
      // Module 0: Quiz-based, calculate differently
      // For now, return 0
      return 0;
    }

    const moduleFamilies = getFamiliesForModule(currentPracticeModule);
    const moduleScores = conceptScores.filter(c =>
      moduleFamilies.some(f => f.familyId === c.conceptId)
    );

    if (moduleScores.length === 0) return 0;

    const totalWeakness = moduleScores.reduce((sum, c) => sum + c.weaknessScore, 0);
    const avgWeakness = totalWeakness / moduleScores.length;

    // Progress = 0% at weakness 85, 100% at weakness 0
    return Math.max(0, Math.min(100, ((85 - avgWeakness) / 85) * 100));
  };

  const isModuleComplete = (): boolean => {
    if (currentPracticeModule === 0) {
      // Module 0: All quiz concepts practiced + avg weakness < 50
      // For now, just return false (needs quiz implementation)
      return false;
    }

    const moduleFamilies = getFamiliesForModule(currentPracticeModule);
    const moduleScores = conceptScores.filter(c =>
      moduleFamilies.some(f => f.familyId === c.conceptId)
    );

    if (moduleScores.length === 0) return false;

    const avgWeakness = moduleScores.reduce((sum, c) => sum + c.weaknessScore, 0) / moduleScores.length;
    const allFamiliesPracticed = moduleScores.every(c => c.practiceCount > 0);

    return allFamiliesPracticed && avgWeakness < 50;
  };

  const getModuleStats = (): string => {
    const recommended = getRecommendedProblems();
    const solved = recommended.filter(p => solvedProblems.has(p.id)).length;
    const total = recommended.length;
    return `${solved}/${total} problems solved`;
  };

  const currentModule = dsaCourse.modules[currentModuleIndex];

  // Helper to navigate to Smart Practice with a specific module selected
  const navigateToSmartPractice = (moduleId: number) => {
    // Find the smart-practice module index
    const smartPracticeIndex = dsaCourse.modules.findIndex(m => m.id === 'smart-practice');
    if (smartPracticeIndex !== -1) {
      setCurrentPracticeModule(moduleId);
      setCurrentModuleIndex(smartPracticeIndex);
      setCurrentProblemId(null); // Clear any selected problem
    }
  };

  // Global CTA: open Smart Practice in Manual mode (Explorer/list)
  const openPracticeExplorer = () => {
    try {
      sessionStorage.setItem('smartPractice.openExplorer', '1');
    } catch {
      // ignore
    }

    const smartPracticeIndex = dsaCourse.modules.findIndex(m => m.id === 'smart-practice');
    if (smartPracticeIndex !== -1) {
      setCurrentModuleIndex(smartPracticeIndex);
      setCurrentLessonIndex(0);
      setCurrentTaskId(null);
      setShowQuiz(false);
      setCurrentQuizIndex(0);
      setCurrentProblemId(null);
      setShowDashboard(false);
      setExpandedModules(prev => new Set([...prev, smartPracticeIndex]));
    }
  };

  // Auto-select first problem when practice module changes
  useEffect(() => {
    if (currentModule?.id === 'smart-practice' && conceptScores.length > 0) {
      const recommended = getRecommendedProblems();
      if (recommended.length > 0) {
        // Always set to first problem when module changes
        setCurrentProblemId(recommended[0].id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPracticeModule, currentModuleIndex, conceptScores]);

  // Check if this is a progressive lesson module
  const isProgressiveLesson = (currentModule as any).progressiveLesson === true;
  const progressiveLesson = isProgressiveLesson ? progressiveLessonsMap[currentModule.id] : null;
  const isModule0 = currentModule.id === 'time-complexity-foundations';

  const currentLesson = isProgressiveLesson ? null : currentModule.lessons[currentLessonIndex];

  // Initialize progress state when module changes
  useEffect(() => {
    if (isProgressiveLesson && progressiveLesson) {
      // Check if current progressiveLessonProgress already matches this lesson
      const currentProgressMatches = progressiveLessonProgress.lessonId === progressiveLesson.id;

      if (!currentProgressMatches) {
        // Check if we have saved progress for this module in allProgressiveLessonProgress
        const savedProgress = allProgressiveLessonProgress.get(progressiveLesson.id);

        if (savedProgress) {
          // Restore saved progress for this module
          setProgressiveLessonProgress(savedProgress);
        } else {
          // No saved progress - initialize fresh
          const firstSection = progressiveLesson.sections[0];
          if (!firstSection) {
            // If no sections exist, initialize with empty progress
            setProgressiveLessonProgress({
              lessonId: progressiveLesson.id,
              currentSectionIndex: 0,
              sectionsProgress: new Map(),
              overallProgress: 0,
              startedAt: new Date(),
              lastActivityAt: new Date(),
              totalTimeSpent: 0,
            });
            return;
          }

          const initialSections = new Map<string, SectionProgress>([
            [firstSection.id, {
              sectionId: firstSection.id,
              status: 'unlocked',
              attempts: 0,
              timeSpent: 0
            }]
          ]);

          setProgressiveLessonProgress({
            lessonId: progressiveLesson.id,
            currentSectionIndex: 0,
            sectionsProgress: initialSections,
            overallProgress: 0,
            startedAt: new Date(),
            lastActivityAt: new Date(),
            totalTimeSpent: 0,
          });
        }
      }
    }
  }, [currentModuleIndex, isProgressiveLesson, progressiveLesson, allProgressiveLessonProgress]);

  // Scroll to top when a progressive lesson is selected
  useEffect(() => {
    if (isProgressiveLesson) {
      // Only scroll main content areas to top, preserve sidebar scroll position
      setTimeout(() => {
        const mainContentAreas = document.querySelectorAll('[data-scroll-region="main-content"]');
        mainContentAreas.forEach(area => {
          const viewport = area.querySelector('[data-radix-scroll-area-viewport]');
          if (viewport) {
            viewport.scrollTop = 0;
          }
        });
      }, 50);
    }
  }, [isProgressiveLesson, currentModuleIndex]);

  // Reset progressive quiz index when module changes
  useEffect(() => {
    setProgressiveQuizIndex(0);
  }, [currentModuleIndex]);

  // Sync current module progress to all-progress map for Journey Map display
  useEffect(() => {
    if (isProgressiveLesson && progressiveLesson && progressiveLessonProgress.lessonId === progressiveLesson.id) {
      setAllProgressiveLessonProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(progressiveLesson.id, progressiveLessonProgress);
        return newMap;
      });
    }
  }, [progressiveLessonProgress, isProgressiveLesson, progressiveLesson]);

  // ═══════════════════════════════════════════════════════════
  // CENTRALIZED MODULE CHAINING - Auto-unlock next module
  // Fix bugs here once, works everywhere!
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (!isProgressiveLesson || !progressiveLesson) return;

    // Check completion by comparing against ACTUAL lesson sections
    // This ensures we don't get confused by old/stale progress data
    const actualSectionIds = progressiveLesson.sections.map(s => s.id);
    const sectionsProgress = progressiveLessonProgress.sectionsProgress;

    // Count how many of the ACTUAL sections are completed
    let completedCount = 0;
    for (const sectionId of actualSectionIds) {
      const sectionProgress = sectionsProgress.get(sectionId);
      if (sectionProgress?.status === 'completed') {
        completedCount++;
      }
    }

    const totalSections = actualSectionIds.length;
    const isModuleComplete = totalSections > 0 && completedCount === totalSections;

    // Auto-unlock next module when current completes
    if (isModuleComplete) {
      const result = unlockNextModule(currentModule.id);

      // Mark module as completed in gamification store (for Smart Practice prerequisites)
      // Use the progressive lesson ID which matches the prerequisites in the problem bank
      const moduleId = progressiveLesson?.id || currentModule.id;
      if (!gamificationCompletedModules.includes(moduleId)) {
        completeModule(moduleId, currentModule.title, 100, completedCount);
      }

      if (result.success && result.nextModuleInfo) {
        // Show module completion modal with next module info
        // Only show if we haven't already shown for this module (check if modal not already showing)
        if (!showModuleCompleteModal && !completedModuleInfo) {
          setCompletedModuleInfo({
            completedModule: currentModule.title,
            nextModule: {
              moduleId: result.nextModuleInfo.moduleId,
              moduleTitle: result.nextModuleInfo.title
            }
          });
          setShowModuleCompleteModal(true);
        }
      }
    }
  }, [progressiveLessonProgress, module15CompletedItems, currentModule.id, isProgressiveLesson, progressiveLesson, showModuleCompleteModal, completedModuleInfo, currentModule.title, gamificationCompletedModules, completeModule]);

  // Get problems for current lesson
  const lessonProblems = (currentLesson?.problems || [])
    .map((id) => dsaProblems.find((p) => p.id === id))
    .filter(Boolean) as DSAProblem[];

  // Get current problem (from combined problems: standalone + exercises)
  const currentProblem = currentProblemId
    ? allProblems.find((p) => p.id === currentProblemId)
    : null;

  // Extract interactive tasks from content
  const interactiveTasks = (currentLesson && Array.isArray(currentLesson.content))
    ? currentLesson.content
      .filter((item) => item.type === "task" && item.task)
      .map((item) => item.task!)
    : [];
  const currentTask =
    interactiveTasks.find((t) => t.id === currentTaskId) ||
    interactiveTasks[0] ||
    null;

  // Auto-select first task when switching lessons (if no problem selected)
  if (
    interactiveTasks.length > 0 &&
    !currentTaskId &&
    !currentProblemId
  ) {
    setCurrentTaskId(interactiveTasks[0].id);
  }

  const handleCodeRun = (code: string) => {
    if (!currentProblem)
      return {
        success: false,
        output: "",
        error: "No problem selected",
      };

    setAttemptedProblems(
      (prev) => new Set([...prev, currentProblem.id]),
    );

    // Track submission attempts (UNIFIED TRACKING)
    const currentAttempts = submissionAttempts.get(currentProblem.id) || 0;
    const newAttempts = currentAttempts + 1;
    setSubmissionAttempts(new Map(submissionAttempts).set(currentProblem.id, newAttempts));

    try {
      const testResults = currentProblem.testCases.map(
        (testCase) => {
          // Parse input string to array if needed
          const inputArray = typeof testCase.input === 'string'
            ? JSON.parse(testCase.input)
            : testCase.input;
          const func = new Function("return " + code)();
          const result = func(...(Array.isArray(inputArray) ? inputArray : [inputArray]));
          const expectedValue = typeof testCase.expectedOutput === 'string'
            ? JSON.parse(testCase.expectedOutput)
            : testCase.expectedOutput;
          const passed =
            JSON.stringify(result) ===
            JSON.stringify(expectedValue);

          return {
            input: testCase.input,
            expected: expectedValue,
            actual: result,
            passed,
          };
        },
      );

      const allPassed = testResults.every((r) => r.passed);

      if (allPassed) {
        // Use unified update function (same as Practice mode)
        const hintsCount = hintsUsed.get(currentProblem.id) || 0;
        updateProgressOnSolve(currentProblem.id, newAttempts, hintsCount, currentProblem);

        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      const output = testResults
        .map(
          (r, i) =>
            `Test ${i + 1}: ${r.passed ? "✓" : "✗"}\n` +
            `Input: ${JSON.stringify(r.input)}\n` +
            `Expected: ${JSON.stringify(r.expected)}\n` +
            `Got: ${JSON.stringify(r.actual)}\n`,
        )
        .join("\n");

      return {
        success: allPassed,
        output: allPassed
          ? output + "\n🎉 All tests passed!"
          : output,
        error: "",
      };
    } catch (err: any) {
      return {
        success: false,
        output: "",
        error: err.message,
      };
    }
  };

  const toggleHint = (hintIndex: number) => {
    if (!currentProblem) return;
    const key = `${currentProblem.id}-${hintIndex}`;
    setExpandedHints((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Handle navigation to next module after completion modal
  const handleContinueToNextModule = () => {
    if (completedModuleInfo?.nextModule) {
      const nextModuleIndex = dsaCourse.modules.findIndex(
        m => m.id === completedModuleInfo.nextModule!.moduleId
      );
      if (nextModuleIndex !== -1) {
        setCurrentModuleIndex(nextModuleIndex);
        setCurrentLessonIndex(0);
        setCurrentTaskId(null);
        setShowQuiz(false);
        setCurrentQuizIndex(0);
        setCurrentProblemId(null);
      }
    }
    setShowModuleCompleteModal(false);
    setCompletedModuleInfo(null);
  };

  const solvedInLesson = lessonProblems.filter((p) =>
    solvedProblems.has(p.id),
  ).length;
  const totalProblems = lessonProblems.length;

  // Handle module selection from dashboard
  const handleDashboardModuleClick = (moduleIndex: number, moduleId: string) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(0);
    setCurrentTaskId(null);
    setShowQuiz(false);
    setCurrentQuizIndex(0);
    setCurrentProblemId(null);
    setExpandedModules(prev => new Set([...prev, moduleIndex]));
    setShowDashboard(false);
    // URL will be updated by the useEffect above
  };

  // Handler for clicking on a section in the module lesson sidebar
  const handleSectionClick = (sectionIndex: number) => {
    if (isProgressiveLesson && progressiveLesson) {
      setProgressiveLessonProgress(prev => ({
        ...prev,
        currentSectionIndex: sectionIndex,
      }));
    }
  };

  // Handler for clicking on a lesson in the module lesson sidebar
  const handleLessonClick = (lessonIndex: number) => {
    setCurrentLessonIndex(lessonIndex);
    setCurrentTaskId(null);
    setCurrentProblemId(null);
    setShowQuiz(false);
    setCurrentQuizIndex(0);
  };

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{
        backgroundColor: colors.background,
        color: colors.text
      }}
    >
      <PyodideLoader />
      <ThemeToggle />

      {/* Dashboard View */}
      {showDashboard ? (
        <ModuleDashboard
          colors={colors}
          dsaCourse={dsaCourse}
          progressiveLessonsMap={progressiveLessonsMap}
          allProgressiveLessonProgress={allProgressiveLessonProgress}
          onModuleClick={handleDashboardModuleClick}
          onOpenPractice={openPracticeExplorer}
          onOpenMastery={() => {
            setShowDashboard(false);
            setCurrentView('mastery-dashboard');
          }}
        />
      ) : (
        /* Main Content Area - shown when a module is selected */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with Back to Dashboard button */}
          <div className="px-6 py-3 border-b flex items-center justify-between relative z-10 bg-white" style={{ borderColor: colors.border, backgroundColor: colors.background }}>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowDashboard(true);
                  window.history.pushState(null, '', '/dsa');
                }}
                className="gap-2"
                style={{ color: colors.textSecondary }}
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back to Dashboard</span>
              </Button>
              {currentModule && (
                <>
                  <div className="h-6 w-px" style={{ backgroundColor: colors.border }} />
                  <h2 className="font-semibold" style={{ color: colors.text }}>
                    {currentModule.title}
                  </h2>
                </>
              )}
            </div>

            {/* Reset Progress Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAllProgress}
              className="text-slate-500 hover:text-red-500 hover:bg-red-50 gap-2"
              title="Reset all progress"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Progress</span>
            </Button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden min-w-0" style={{ minWidth: 0 }}>
            {useJourneyMap ? null : (
              <AppDSASidebar
                colors={colors}
                currentModuleIndex={currentModuleIndex}
                currentLessonIndex={currentLessonIndex}
                dsaCourse={dsaCourse}
                isProgressiveLesson={isProgressiveLesson}
                progressiveLesson={progressiveLesson}
                progressiveLessonProgress={progressiveLessonProgress}
                setProgressiveLessonProgress={setProgressiveLessonProgress}
                progressiveLessonsMap={progressiveLessonsMap}
                solvedProblems={solvedProblems}
                dsaProblems={dsaProblems}
                expandedModules={expandedModules}
                setExpandedModules={setExpandedModules}
                setCurrentModuleIndex={setCurrentModuleIndex}
                setCurrentLessonIndex={setCurrentLessonIndex}
                setCurrentTaskId={setCurrentTaskId}
                setShowQuiz={setShowQuiz}
                setCurrentQuizIndex={setCurrentQuizIndex}
                setCurrentPracticeModule={setCurrentPracticeModule}
                setCurrentProblemId={setCurrentProblemId}
                setCurrentView={setCurrentView}
              />
            )}

            {/* Module Lesson Sidebar - Shows lessons/sections for current module only */}
            {!showDashboard && currentModule.id !== 'smart-practice' && currentModule.id !== 'practice-dashboard' && (
              <ModuleLessonSidebar
                colors={colors}
                currentModule={currentModule}
                currentModuleIndex={currentModuleIndex}
                currentLessonIndex={currentLessonIndex}
                isProgressiveLesson={isProgressiveLesson}
                progressiveLesson={progressiveLesson}
                progressiveLessonProgress={progressiveLessonProgress}
                onSectionClick={handleSectionClick}
                onLessonClick={handleLessonClick}
                solvedProblems={solvedProblems}
                dsaProblems={dsaProblems}
              />
            )}

            {/* Main Content or Mastery Dashboard */}
            {currentView === "mastery-dashboard" ? (
              <div className="flex-1 overflow-hidden">
                <MasteryDashboard onStartPractice={handleStartMasteryPractice} />
              </div>
            ) : currentView === "adaptive-stream" ||
              (currentModule && [
                'concurrency-threading',
                'system-design-patterns',
                'ood-patterns',
                'async-patterns'
              ].includes(currentModule.id)) ? (
              <div className="flex-1 overflow-hidden">
                <AdaptiveStreamView moduleId={currentModule?.id || '01_arrays_hashing'} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col pl-6 min-w-0" style={{ minWidth: 0, flexShrink: 0 }}>
                {/* Header Bar - Hidden in Smart Practice and Practice Dashboard modes */}
                {currentModule.id !== 'smart-practice' && currentModule.id !== 'practice-dashboard' && (
                  <AppDSAHeader
                    currentProblem={currentProblem}
                    lessonTitle={currentLesson?.title}
                    moduleTitle={currentModule.title}
                    showQuizToggle={!currentProblemId && interactiveTasks.length > 0 && !!currentLesson?.quizzes && currentLesson.quizzes.length > 0}
                    isQuizMode={showQuiz}
                    onQuizToggle={() => setShowQuiz(!showQuiz)}
                    interactiveTasksCount={interactiveTasks.length}
                    quizCount={currentLesson?.quizzes?.length || 0}
                    onOpenPractice={openPracticeExplorer}
                  />
                )}

                {/* Content Area - Replaced with ContentRouter */}
                <ContentRouter
                  currentModule={currentModule}
                  currentModuleIndex={currentModuleIndex}
                  totalModules={dsaCourse.modules.length}
                  currentProblemId={currentProblemId}
                  isProgressiveLesson={isProgressiveLesson}
                  progressiveLesson={progressiveLesson}
                  progressiveLessonProgress={progressiveLessonProgress}
                  setProgressiveLessonProgress={setProgressiveLessonProgress}
                  allProblems={allProblems}
                  dsaProblems={dsaProblems as any}
                  colors={colors}
                  solvedProblems={solvedProblems}
                  setSolvedProblems={setSolvedProblems}
                  setCurrentProblemId={setCurrentProblemId}
                  setCurrentModuleIndex={setCurrentModuleIndex}
                  setCurrentPracticeModule={setCurrentPracticeModule}
                  onNavigateToSmartPractice={navigateToSmartPractice}
                  handlePracticeCodeRun={handlePracticeCodeRun}
                  submissionAttempts={submissionAttempts}
                  setSubmissionAttempts={setSubmissionAttempts}
                  getRecommendedProblems={getRecommendedProblems}
                  studiedModules={studiedModules}
                  problemFamilyMappings={problemFamilyMappings}
                  showLinkedListPractice={showLinkedListPractice}
                  setShowLinkedListPractice={setShowLinkedListPractice}
                  module5LinkedListLesson={module5LinkedListLesson}
                  progressiveQuizIndex={progressiveQuizIndex}
                  setProgressiveQuizIndex={setProgressiveQuizIndex}
                  hintsUsed={hintsUsed}
                  setHintsUsed={setHintsUsed}
                  expandedLessons={expandedLessons}
                  setExpandedLessons={setExpandedLessons}
                  collapsedDescriptions={collapsedDescriptions}
                  setCollapsedDescriptions={setCollapsedDescriptions}
                  showBruteForceBlocker={showBruteForceBlocker}
                  setShowBruteForceBlocker={setShowBruteForceBlocker}
                  highlightBruteForceBlocker={highlightBruteForceBlocker}
                  setHighlightBruteForceBlocker={setHighlightBruteForceBlocker}
                  bruteForceSolved={bruteForceSolved}
                  setBruteForceSolved={setBruteForceSolved}
                  exercisesAwaitingAnalysis={exercisesAwaitingAnalysis}
                  setExercisesAwaitingAnalysis={setExercisesAwaitingAnalysis}
                  exercisesWithBeforeQuizCompleted={exercisesWithBeforeQuizCompleted}
                  setExercisesWithBeforeQuizCompleted={setExercisesWithBeforeQuizCompleted}
                  showingBeforeQuizExplanation={showingBeforeQuizExplanation}
                  setShowingBeforeQuizExplanation={setShowingBeforeQuizExplanation}
                  readingQuizAnswers={readingQuizAnswers}
                  setReadingQuizAnswers={setReadingQuizAnswers}
                  runPythonCode={runPythonCode}
                  renderStyledText={renderStyledText}
                  cleanInstruction={cleanInstruction}
                  ensureSolutionWrapper={ensureSolutionWrapper}
                  buildPythonTestHarness={buildPythonTestHarness}
                  parsePythonTestResults={parsePythonTestResults}
                  formatTestResultsOutput={formatTestResultsOutput}
                  getDefaultPracticeForSection={getDefaultPracticeForSection}
                  isSectionUnlocked={(section, progress, lesson) =>
                    isSectionUnlocked(section, 0, progress, lesson)
                  }
                  calculateLessonProgress={calculateLessonProgress}
                />
              </div>
            )}

            {/* End of main content flex */}
          </div>

          {/* End of content area flex */}
        </div>
      )}

      {/* Exercise Success Modal */}
      <AnimatePresence>
        {exerciseSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setExerciseSuccess(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center mb-4"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Excellent Work!
                </h2>
                <p className="text-slate-600 mb-1">
                  You've successfully completed
                </p>
                <p className="text-slate-900 font-semibold mb-4">
                  {exerciseSuccess.exerciseTitle}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Clock className="w-4 h-4" />
                  </motion.div>
                  <span>Moving to next exercise...</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 1.5 }}
                className="mt-6 h-1 bg-green-500 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Module Complete Modal */}
      <AnimatePresence>
        {showModuleCompleteModal && completedModuleInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl p-8 max-w-lg mx-4 shadow-2xl"
            >
              {/* Trophy Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-14 h-14 text-white" />
                </div>
              </motion.div>

              {/* Congratulations Text */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Module Complete!
                </h2>
                <p className="text-lg text-slate-600 mb-4">
                  Congratulations! You've completed
                </p>
                <div className="inline-block px-4 py-2 bg-indigo-100 rounded-lg mb-6">
                  <p className="text-indigo-700 font-semibold text-lg">
                    {completedModuleInfo.completedModule}
                  </p>
                </div>

                {/* Next Module Preview */}
                {completedModuleInfo.nextModule && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6"
                  >
                    <p className="text-sm text-slate-500 mb-2">Next up:</p>
                    <div className="flex items-center justify-center gap-2">
                      <ChevronRight className="w-5 h-5 text-green-500" />
                      <span className="text-lg font-medium text-slate-800">
                        {completedModuleInfo.nextModule.moduleTitle}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Continue Button */}
                <motion.button
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  onClick={handleContinueToNextModule}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {completedModuleInfo.nextModule
                    ? 'Continue to Next Module'
                    : 'Continue'}
                </motion.button>
              </motion.div>

              {/* Celebration particles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 0, x: 0, opacity: 1 }}
                    animate={{
                      y: [-20, -80],
                      x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 10)],
                      opacity: [1, 0],
                    }}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      duration: 1.5,
                      ease: 'easeOut',
                    }}
                    className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa', '#fb923c'][i],
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mastery Feedback Modal */}
      {masteryFeedbackData && (
        <MasteryFeedbackModal
          isOpen={!!masteryFeedbackData}
          onClose={() => setMasteryFeedbackData(null)}
          onContinue={() => {
            setMasteryFeedbackData(null);
          }}
          earnedXp={masteryFeedbackData.earnedXp}
          masteryGain={masteryFeedbackData.masteryGain}
          problemTitle={masteryFeedbackData.problemTitle}
        />
      )}
    </div>
  );
}

// isSectionUnlocked and calculateLessonProgress are imported from "./types/progressive-lesson-enhanced"

// Export wrapper with ThemeProvider
export default function AppDSA() {
  return (
    <ThemeProvider>
      <AppDSAContent />
    </ThemeProvider>
  );
}

