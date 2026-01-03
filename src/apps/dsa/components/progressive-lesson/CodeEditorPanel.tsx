import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import {
  Play,
  Code2,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { CodeEditor } from '../core/CodeEditor';
import { ComplexityAnalysisPanel } from '../core/ComplexityAnalysisPanel';
import { runPythonCode } from '../../utils/pyodideRunner';
import { renderStyledText } from '../../utils/styledTextRenderer';
import { cleanInstruction } from '../../utils/cleanInstruction';
import { buildPythonTestHarness, parsePythonTestResults } from '../../utils/pythonTestHarness';
import type {
  CodeEditorPanelProps,
  ExerciseSection,
  QuizSection,
  SectionProgress,
  ComplexityFeedback,
  ProgressiveLessonProgress,
  NormalizedTestCase
} from './types';
import type { ProgressiveLesson } from '../../types/progressive-lesson-enhanced';

// Constants for solution wrapper generation
const SOLUTION_DEFINITION_REGEX = /def\s+solution\s*\(/i;

interface SolutionWrapperOptions {
  code: string;
  defaultFuncName?: string;
  isLinkedListProblem: boolean;
  isTreeProblem: boolean;
  isTrieProblem: boolean;
  isListOfStringsExercise: boolean;
  isNestedDictTrieExercise: boolean;
  isDesignProblem: boolean;
  designClassName?: string;
}

// Helper functions from AppDSA
export const ensureSolutionWrapper = ({
  code,
  defaultFuncName,
  isLinkedListProblem,
  isTreeProblem,
  isTrieProblem,
  isListOfStringsExercise,
  isNestedDictTrieExercise,
  isDesignProblem,
  designClassName,
}: SolutionWrapperOptions): string => {
  // Add typing imports BEFORE user code so type hints like List[int] work
  const typingImports = 'from typing import List, Dict, Optional, Tuple, Set, Any\n\n';

  // If code already has a solution function, return as-is
  if (SOLUTION_DEFINITION_REGEX.test(code)) {
    return typingImports + code;
  }

  // If no function name provided, we can't create a wrapper
  if (!defaultFuncName) {
    return typingImports + code;
  }

  // If defaultFuncName is "solution" and code already has it, return as-is
  // Otherwise, we need to create a wrapper
  if (defaultFuncName === "solution" && code.includes("def solution")) {
    return typingImports + code;
  }

  // For all other cases (including when defaultFuncName is not "solution"),
  // we need to create a wrapper function

  // Special exercises need custom solution wrappers
  if (isListOfStringsExercise) {
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
            if '__call__' in value:
                args = value.get('args', [])
                if args and len(args) > 0:
                    return extract_number(args[0])
                kwargs = value.get('kwargs', {})
                if kwargs:
                    return extract_number(list(kwargs.values())[0])
            if value:
                return extract_number(list(value.values())[0])
            return 1
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
            if '__call__' in value:
                args = value.get('args', [])
                if args and len(args) > 0:
                    return extract_number(args[0])
                kwargs = value.get('kwargs', {})
                if kwargs:
                    return extract_number(list(kwargs.values())[0])
            if value:
                return extract_number(list(value.values())[0])
            return 1
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
    return `${typingImports}${code}

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
            if '__call__' in value:
                args = value.get('args', [])
                if args and len(args) > 0:
                    return extract_number(args[0])
                kwargs = value.get('kwargs', {})
                if kwargs:
                    return extract_number(list(kwargs.values())[0])
            if value:
                return extract_number(list(value.values())[0])
            return 1
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

  if (isDesignProblem && designClassName) {
    return `${typingImports}${code}

# Auto-generated solution wrapper for Design Problem (Class-based)
def solution(*args, **kwargs):
    # Handle multiple calling conventions:
    # 1. solution([commands, inputs]) - single list/tuple argument
    # 2. solution(commands, inputs) - two separate arguments (from tuple unpacking)
    # 3. solution({'args': [[commands, inputs]]}) - dict with args key

    if len(args) == 2 and isinstance(args[0], list) and isinstance(args[1], list):
        # Called as solution(commands, inputs) - two separate arguments
        commands = args[0]
        inputs = args[1]
    elif len(args) == 1:
        # Single argument - could be [commands, inputs] or {'args': ...}
        test_input = args[0]
        if isinstance(test_input, dict) and 'args' in test_input:
            data = test_input['args'][0]
        else:
            data = test_input

        if not isinstance(data, (list, tuple)) or len(data) != 2:
            return None
        commands = data[0]
        inputs = data[1]
    else:
        return None

    # Validate commands and inputs
    if not isinstance(commands, list) or not isinstance(inputs, list):
        return None
    if len(commands) != len(inputs):
        return None

    results = [None]  # Constructor returns null

    # First command is the class name
    if commands[0] != "${designClassName}":
        return None

    # Constructor args
    ctor_args = inputs[0]
    obj = ${designClassName}(*ctor_args)

    for i in range(1, len(commands)):
        cmd = commands[i]
        method_args = inputs[i]

        if hasattr(obj, cmd):
            method = getattr(obj, cmd)
            val = method(*method_args)
            results.append(val)
        else:
            results.append(None)

    return results
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
        # IMPORTANT:
        # value is often already a real runtime string coming from the test harness
        # (e.g. "12321"). If we blindly ast.literal_eval it, numeric-looking strings
        # become ints, which breaks string problems (len(int) errors).
        #
        # Only attempt literal_eval for container-like literals (lists/tuples/dicts)
        # or explicitly-quoted strings.
        normalized = stripped.replace('null', 'None').replace('true', 'True').replace('false', 'False')
        looks_like_literal = (
            normalized[:1] in ['[', '(', '{'] or
            (len(normalized) >= 2 and normalized[0] in ['"', "'"] and normalized[-1] == normalized[0])
        )
        if looks_like_literal:
            try:
                return ast.literal_eval(normalized)
            except Exception:
                return value
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
    # Skip conversion if value is already a Node/ListNode object
    if hasattr(value, 'val') and (hasattr(value, 'next') or hasattr(value, 'random')):
        return value
    if not isinstance(value, list):
        return value
    # Empty list -> None (empty linked list)
    if not value:
        return None
    # Check for random pointer format: [[val, idx], [val, idx], ...]
    is_random_pointer_format = all(
        isinstance(item, list) and len(item) == 2 and
        (isinstance(item[0], (int, float)) or item[0] is None) and
        (isinstance(item[1], int) or item[1] is None)
        for item in value
    )
    if is_random_pointer_format:
        if 'list_to_random_list' in globals():
            return list_to_random_list(value)
    # Check for nested lists that need recursive conversion
    if all(isinstance(item, list) for item in value) and not is_random_pointer_format:
        return [__convert_linked_list_input(item) for item in value]
    # Regular flat list -> linked list
    if 'list_to_linkedlist' in globals():
        return list_to_linkedlist(value)
    return value

def __convert_linked_list_output(value):
    # Handle None -> empty list
    if value is None:
        return []
    # Handle list (recursively convert items)
    if isinstance(value, list):
        return [__convert_linked_list_output(item) for item in value]
    # Handle Node with random pointer (has both .val and .random attributes)
    if hasattr(value, 'random') and hasattr(value, 'val'):
        if 'random_list_to_list' in globals():
            return random_list_to_list(value)
    # Handle regular ListNode (has .val and .next but not .random)
    if hasattr(value, 'next') and hasattr(value, 'val'):
        if 'linkedlist_to_list' in globals():
            return linkedlist_to_list(value)
    return value
`);
  }

  if (isTreeProblem) {
    wrapperParts.push(`
# Track if we're dealing with multi-list input (like buildTree with preorder, inorder)
# In that case, don't convert any lists to trees
_MULTI_LIST_INPUT = False

def __set_multi_list_input(args):
    global _MULTI_LIST_INPUT
    # If we have multiple list arguments, assume they're raw arrays (like preorder/inorder)
    list_count = sum(1 for arg in args if isinstance(arg, list))
    _MULTI_LIST_INPUT = list_count >= 2

def __convert_tree_input(value):
    global _MULTI_LIST_INPUT
    # Don't convert if we detected multiple list inputs (like buildTree)
    if _MULTI_LIST_INPUT:
        return value
    # Only convert lists that LOOK like tree serializations
    # Tree serializations contain None for missing children
    # Raw data arrays (like for binary search) don't have None
    if isinstance(value, list) and 'deserialize_tree' in globals():
        # Empty list represents empty tree
        if len(value) == 0:
            return None
        # Only convert if the list contains None (tree serialization marker)
        if any(v is None for v in value):
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

  // Debug: log wrapper building
  console.log('Building solution wrapper:', {
    isLinkedListProblem,
    isTreeProblem,
    defaultFuncName
  });

  wrapperParts.push(`
def solution(*input_args, **input_kwargs):
    # Handle multiple calling conventions:
    # 1. solution(arg1, arg2, ...) - multiple separate arguments (from tuple unpacking)
    # 2. solution(single_value) - single argument that needs parsing
    # 3. solution({'args': [...]}) - dict with args key

    if len(input_args) == 1 and not input_kwargs:
        # Single argument - parse it
        parsed = __parse_test_input(input_args[0])
        args, kwargs = __prepare_call_args(parsed)
    elif len(input_args) > 1:
        # Multiple arguments passed directly (e.g., from tuple unpacking)
        args = list(input_args)
        kwargs = input_kwargs
    else:
        args = list(input_args)
        kwargs = input_kwargs
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
    # Detect multi-list input (like buildTree with preorder, inorder)
    __set_multi_list_input(args)
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

const formatTestResultsOutput = (results: any[]): string => {
  if (!results.length) {
    return 'No tests were executed.';
  }

  return results.map((r: any) => {
    const status = r.passed ? '✓ PASS' : '✗ FAIL';
    const inputLine = r.input ? `Input: ${r.input}` : '';

    if (r.error) {
      return `Test ${r.test}: ${status}\n${inputLine}\nError: ${r.error}\nExpected: ${JSON.stringify(r.expected)}\n`;
    }

    const resultLine = `Your Output: ${JSON.stringify(r.result)}`;
    const expectedLine = r.passed ? '' : `\nExpected: ${JSON.stringify(r.expected)}`;
    return `Test ${r.test}: ${status}\n${inputLine}\n${resultLine}${expectedLine}\n`;
  }).join('\n');
};

/**
 * CodeEditorPanel - Right panel containing the Monaco code editor with test execution
 * Handles exercise coding, test running, complexity analysis, and hint requests
 */
export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  activeExercise,
  currentSection,
  progressiveLesson,
  progressiveLessonProgress,
  hintsUsed,
  bruteForceSolved,
  showBruteForceBlocker,
  exercisesAwaitingAnalysis,
  exercisesWithBeforeQuizCompleted,
  showingBeforeQuizExplanation,
  expandedLessons,
  collapsedDescriptions,
  readingQuizAnswers,
  onUpdateProgress,
  onHintRequest,
  onExpandLesson,
  onCollapseDescription,
  onCompleteBeforeQuiz,
  onShowBeforeQuizExplanation,
  onBruteForceSolved,
  onShowBruteForceBlocker,
  onHighlightBruteForceBlocker,
  onQuizAnswer
}) => {
  // CRITICAL: Always check currentSection first if it's an exercise
  // This ensures exercises are detected even if activeExercise is undefined
  if (currentSection && currentSection.type === 'exercise') {
    const exerciseData = currentSection as ExerciseSection;
    const quizPlacement = exerciseData.complexityQuizPlacement || 'after';
    const hasBeforeQuizCompleted = exercisesWithBeforeQuizCompleted.has(exerciseData.id);
    const isShowingExplanation = showingBeforeQuizExplanation === exerciseData.id;

    // If exercise has 'before' placement and quiz not yet completed, show quiz first
    if (quizPlacement === 'before' && !hasBeforeQuizCompleted && !isShowingExplanation && exerciseData.solutionExplanation) {
      const sectionNumber = progressiveLesson?.sections.findIndex(s => s.id === exerciseData.id) ?? -1;

      return (
        <ComplexityAnalysisPanel
          exercise={exerciseData}
          placement="before"
          lessonTitle={progressiveLesson?.title}
          sectionNumber={sectionNumber >= 0 ? sectionNumber + 1 : undefined}
          onComplete={() => {
            onCompleteBeforeQuiz?.(exerciseData.id);
            onShowBeforeQuizExplanation?.(exerciseData.id);
          }}
        />
      );
    }

    // Render the exercise editor
    return (
      <div className="h-full w-full flex flex-col min-w-0">
        {/* Banner when showing complexity explanation */}
        {isShowingExplanation && (
          <div className="p-4 bg-blue-50 border-b-2 border-blue-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-900">Review Complexity Analysis</div>
                <div className="text-sm text-blue-700">
                  The explanation is shown on the left. Click "Start Coding" when ready to begin.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monaco Code Editor */}
        <ExerciseCodeEditor
          exercise={exerciseData}
          progressiveLesson={progressiveLesson}
          progressiveLessonProgress={progressiveLessonProgress}
          hintsUsed={hintsUsed}
          bruteForceSolved={bruteForceSolved}
          showBruteForceBlocker={showBruteForceBlocker}
          onUpdateProgress={onUpdateProgress || (() => { })}
          onHintRequest={onHintRequest || (() => { })}
          onExpandLesson={onExpandLesson || (() => { })}
          onCollapseDescription={onCollapseDescription || (() => { })}
          onBruteForceSolved={onBruteForceSolved || (() => { })}
          onShowBruteForceBlocker={onShowBruteForceBlocker || (() => { })}
          onHighlightBruteForceBlocker={onHighlightBruteForceBlocker || (() => { })}
        />
      </div>
    );
  }

  // Fallback: Check activeExercise (for backwards compatibility)
  // This handles cases where activeExercise is provided but currentSection is not an exercise
  if (activeExercise && activeExercise.type === 'exercise') {
    const exerciseData = activeExercise as ExerciseSection;
    const quizPlacement = exerciseData.complexityQuizPlacement || 'after';
    const hasBeforeQuizCompleted = exercisesWithBeforeQuizCompleted.has(exerciseData.id);
    const isShowingExplanation = showingBeforeQuizExplanation === exerciseData.id;

    // If exercise has 'before' placement and quiz not yet completed, show quiz first
    if (quizPlacement === 'before' && !hasBeforeQuizCompleted && !isShowingExplanation && exerciseData.solutionExplanation) {
      const sectionNumber = progressiveLesson?.sections.findIndex(s => s.id === exerciseData.id) ?? -1;

      return (
        <ComplexityAnalysisPanel
          exercise={exerciseData}
          placement="before"
          lessonTitle={progressiveLesson?.title}
          sectionNumber={sectionNumber >= 0 ? sectionNumber + 1 : undefined}
          onComplete={() => {
            onCompleteBeforeQuiz?.(exerciseData.id);
            onShowBeforeQuizExplanation?.(exerciseData.id);
          }}
        />
      );
    }

    return (
      <div className="h-full w-full flex flex-col min-w-0">
        {/* Banner when showing complexity explanation */}
        {isShowingExplanation && (
          <div className="p-4 bg-blue-50 border-b-2 border-blue-200 flex-shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-900">Review Complexity Analysis</div>
                <div className="text-sm text-blue-700">
                  The explanation is shown on the left. Click "Start Coding" when ready to begin.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Monaco Code Editor */}
        <ExerciseCodeEditor
          exercise={exerciseData}
          progressiveLesson={progressiveLesson}
          progressiveLessonProgress={progressiveLessonProgress}
          hintsUsed={hintsUsed}
          bruteForceSolved={bruteForceSolved}
          showBruteForceBlocker={showBruteForceBlocker}
          onUpdateProgress={onUpdateProgress || (() => { })}
          onHintRequest={onHintRequest || (() => { })}
          onExpandLesson={onExpandLesson || (() => { })}
          onCollapseDescription={onCollapseDescription || (() => { })}
          onBruteForceSolved={onBruteForceSolved || (() => { })}
          onShowBruteForceBlocker={onShowBruteForceBlocker || (() => { })}
          onHighlightBruteForceBlocker={onHighlightBruteForceBlocker || (() => { })}
        />
      </div>
    );
  }

  // Handle reading sections with practice exercises or quizzes
  if (currentSection && currentSection.type === 'reading') {
    const practiceExercise = (currentSection as any)?.practiceExercise;
    const quickQuiz = (currentSection as any)?.quickQuiz;

    // If reading section has practice exercise
    if (practiceExercise) {
      return <PracticeExerciseEditor
        practiceExercise={practiceExercise}
        currentSection={currentSection}
        progressiveLesson={progressiveLesson}
        progressiveLessonProgress={progressiveLessonProgress}
        hintsUsed={hintsUsed}
        expandedLessons={expandedLessons}
        onUpdateProgress={onUpdateProgress}
        onHintRequest={onHintRequest}
        onExpandLesson={onExpandLesson}
      />;
    }

    // If reading section has quick quiz
    if (quickQuiz) {
      return <QuickQuizPanel
        quickQuiz={quickQuiz}
        currentSection={currentSection}
        readingQuizAnswers={readingQuizAnswers}
        progressiveLessonProgress={progressiveLessonProgress}
        onQuizAnswer={onQuizAnswer || (() => { })}
        onUpdateProgress={onUpdateProgress}
      />;
    }

    // Check if there's a quiz section following this reading section
    const currentIdx = progressiveLesson.sections.findIndex(s => s.id === currentSection.id);
    if (currentIdx >= 0 && currentIdx < progressiveLesson.sections.length - 1) {
      const nextSection = progressiveLesson.sections[currentIdx + 1];
      if (nextSection.type === 'quiz') {
        const followingQuizSection = nextSection as QuizSection;
        return <FollowingQuizPanel
          quizSection={followingQuizSection}
          readingQuizAnswers={readingQuizAnswers}
          progressiveLessonProgress={progressiveLessonProgress}
          currentSection={currentSection}
          onQuizAnswer={onQuizAnswer}
          onUpdateProgress={onUpdateProgress}
        />;
      }
    }

    // Check if there's an exercise following this reading - show its editor
    let nextExerciseSection = currentIdx >= 0
      ? progressiveLesson.sections.slice(currentIdx + 1).find(s => s.type === 'exercise')
      : null;

    if (!nextExerciseSection) {
      nextExerciseSection = progressiveLesson.sections.find(s => s.type === 'exercise') || null;
    }

    if (nextExerciseSection && nextExerciseSection.type === 'exercise') {
      const nextExercise = nextExerciseSection as ExerciseSection;

      return (
        <div className="h-full w-full flex flex-col overflow-y-auto min-w-0">
          <div className="flex-shrink-0 w-full">
            <NextExerciseEditor
              exercise={nextExercise}
              progressiveLesson={progressiveLesson}
              progressiveLessonProgress={progressiveLessonProgress}
              hintsUsed={hintsUsed}
              bruteForceSolved={bruteForceSolved}
              showBruteForceBlocker={showBruteForceBlocker}
              expandedLessons={expandedLessons}
              collapsedDescriptions={collapsedDescriptions}
              onUpdateProgress={onUpdateProgress}
              onHintRequest={onHintRequest}
              onExpandLesson={onExpandLesson}
              onCollapseDescription={onCollapseDescription}
              onBruteForceSolved={onBruteForceSolved}
              onShowBruteForceBlocker={onShowBruteForceBlocker}
              onHighlightBruteForceBlocker={onHighlightBruteForceBlocker}
            />
          </div>
        </div>
      );
    }

    // Fallback: Show default practice exercise
    return <DefaultPracticeEditor currentSection={currentSection} />;
  }

  // Fallback for no active exercise or reading
  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 min-w-0">
      <div className="text-center p-8">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
        <h3 className="text-slate-700 mb-2">Practice Exercise Needed</h3>
        <p className="text-slate-500 text-sm">This section should have a practice exercise</p>
      </div>
    </div>
  );
};

/**
 * Ensure exercise has targetComplexity with sensible defaults based on exercise characteristics
 */
const ensureTargetComplexity = (ex: ExerciseSection): ExerciseSection => {
  if (ex.targetComplexity && ex.targetComplexity.time && ex.targetComplexity.space) {
    return ex; // Already has targetComplexity
  }

  // Determine default complexity based on exercise characteristics
  let defaultTime = 'O(n)';
  let defaultSpace = 'O(1)';

  // Analyze exercise to determine likely complexity
  const title = (ex.title || '').toLowerCase();
  const instruction = (ex.instruction || '').toLowerCase();
  const starterCode = (ex.starterCode || '').toLowerCase();
  const combined = `${title} ${instruction} ${starterCode}`;

  // Check for common patterns
  if (combined.includes('sort') || combined.includes('merge') || combined.includes('quick sort')) {
    defaultTime = 'O(n log n)';
    defaultSpace = 'O(log n)';
  } else if (combined.includes('binary search') || combined.includes('bst')) {
    defaultTime = 'O(log n)';
    defaultSpace = 'O(1)';
  } else if (combined.includes('hash') || combined.includes('dict') || combined.includes('set')) {
    defaultTime = 'O(n)';
    defaultSpace = 'O(n)';
  } else if (combined.includes('two pointer') || combined.includes('sliding window')) {
    defaultTime = 'O(n)';
    defaultSpace = 'O(1)';
  } else if (combined.includes('nested loop') || (combined.includes('for i') && combined.includes('for j'))) {
    defaultTime = 'O(n²)';
    defaultSpace = 'O(1)';
  } else if (combined.includes('recursion') || combined.includes('dfs') || combined.includes('bfs')) {
    defaultTime = 'O(n)';
    defaultSpace = 'O(n)'; // Usually O(h) for recursion depth or O(n) for visited nodes
  } else if (combined.includes('tree') || combined.includes('graph')) {
    defaultTime = 'O(n)';
    defaultSpace = 'O(n)';
  }

  // Return exercise with default targetComplexity
  return {
    ...ex,
    targetComplexity: {
      time: defaultTime,
      space: defaultSpace,
      notes: 'Default complexity - please verify based on your solution'
    }
  };
};

// Sub-components for different editor types
interface ExerciseCodeEditorProps {
  exercise: ExerciseSection;
  progressiveLesson: any;
  progressiveLessonProgress: any;
  hintsUsed: Map<string, number>;
  bruteForceSolved: Set<string>;
  showBruteForceBlocker: Set<string>;
  onUpdateProgress: (updates: Partial<ProgressiveLessonProgress>) => void;
  onHintRequest: (sectionId: string) => void;
  onExpandLesson: (sectionId: string) => void;
  onCollapseDescription: (sectionId: string) => void;
  onBruteForceSolved: (sectionId: string) => void;
  onShowBruteForceBlocker: (sectionId: string) => void;
  onHighlightBruteForceBlocker: (sectionId: string | null) => void;
}

const ExerciseCodeEditor: React.FC<ExerciseCodeEditorProps> = ({
  exercise,
  progressiveLesson,
  progressiveLessonProgress,
  hintsUsed,
  bruteForceSolved,
  showBruteForceBlocker,
  onUpdateProgress,
  onHintRequest,
  onExpandLesson,
  onCollapseDescription,
  onBruteForceSolved,
  onShowBruteForceBlocker,
  onHighlightBruteForceBlocker
}) => {
  // Guard against undefined exercise (can happen if saved progress references deleted exercise)
  if (!exercise || !exercise.id) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-6 max-w-md">
          <h3 className="text-yellow-400 font-semibold mb-2">Exercise Not Found</h3>
          <p className="text-gray-300 text-sm mb-4">
            This exercise may have been removed or updated. Please clear your progress and try again.
          </p>
          <button
            onClick={() => {
              // Clear progress for this module and reload
              const moduleId = progressiveLesson?.id;
              if (moduleId) {
                Object.keys(localStorage).forEach(key => {
                  if (key.includes(moduleId)) {
                    localStorage.removeItem(key);
                  }
                });
              }
              window.location.reload();
            }}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors"
          >
            Clear Progress & Reload
          </button>
        </div>
      </div>
    );
  }

  // Memoize to prevent creating new object references on every render
  const exerciseWithComplexity = React.useMemo(
    () => ensureTargetComplexity(exercise),
    [exercise.id, exercise.targetComplexity?.time, exercise.targetComplexity?.space]
  );

  const handleRun = async (code: string, complexity?: { time: string; space: string }): Promise<{
    success: boolean;
    output: string;
    error?: string;
    complexityFeedback?: ComplexityFeedback;
  }> => {
    try {
      // Build test cases
      const testCases = buildTestCases(exerciseWithComplexity);

      // Debug: log built test cases
      console.log('Built test cases:', {
        count: testCases.length,
        exerciseTestCasesRaw: exerciseWithComplexity.testCases?.length || 0,
        testCases: testCases
      });

      // Validate test cases exist
      if (!testCases || testCases.length === 0) {
        return {
          success: false,
          output: '',
          error: 'No test cases found for this exercise. Please check the exercise configuration.'
        };
      }

      const codeToRun = prepareCodeForExecution(code, exerciseWithComplexity);

      // Validate code before building test harness
      if (!codeToRun || codeToRun.trim().length === 0) {
        return {
          success: false,
          output: '',
          error: 'No code provided. Please write your solution in the editor.'
        };
      }

      let testCode: string;
      try {
        testCode = buildPythonTestHarness(codeToRun, testCases, exerciseWithComplexity.targetFunction);

        // Debug: log the generated test harness (first 500 chars)
        console.log('Generated test harness preview:', testCode.substring(0, 500));
      } catch (harnessError: any) {
        return {
          success: false,
          output: '',
          error: `Error preparing test harness: ${harnessError.message || 'Unknown error'}`
        };
      }

      // Try a simple test first to verify Pyodide output capture works
      const simpleTest = await runPythonCode('print("SIMPLE_TEST")');
      console.log('Simple test result:', simpleTest);

      const result = await runPythonCode(testCode);

      // Ensure output is always a string
      const output = result.output || '';

      // Debug: log the raw output to help diagnose
      console.log('Python execution result:', {
        success: result.success,
        outputLength: output.length,
        outputPreview: output.substring(0, 200),
        error: result.error
      });

      if (result.error) {
        // Check if it's a syntax error and provide more helpful message
        let errorMessage = result.error;
        if (result.error.includes('SyntaxError') || result.error.includes('invalid syntax') || result.error.includes('AST')) {
          errorMessage = `Syntax Error: There's a syntax error in your Python code. Please check:\n\n${result.error}\n\nCommon issues:\n- Missing colons (:) after if/for/while/def statements\n- Unmatched parentheses, brackets, or quotes\n- Incorrect indentation\n- Missing commas in function calls or lists`;
        }
        return {
          success: false,
          output: '',
          error: errorMessage
        };
      }

      // If output is empty, try to get more info
      if (!output || output.trim().length === 0) {
        console.error('Python code executed but produced no output. This suggests the test harness may have failed silently.');
        return {
          success: false,
          output: '',
          error: `No output from Python execution. The test harness may have failed to execute.\n\nDebug info: Check browser console for details.`
        };
      }

      const { results: testResults, error: parseError } = parsePythonTestResults(output);
      if (parseError) {
        return {
          success: false,
          output: '',
          error: parseError
        };
      }

      const allTestsPassed = testResults.length > 0 ? testResults.every((r: any) => r.passed) : false;
      const targetComp = exerciseWithComplexity.targetComplexity;
      let complexityFeedback: ComplexityFeedback | undefined = undefined;

      // Normalize complexity strings for comparison (handle different notations)
      const normalizeComplexity = (comp: string): string => {
        if (!comp) return comp;
        // Normalize various multiplication notations and spacing
        return comp
          .replace(/·/g, '*')      // Replace middle dot (·) with asterisk
          .replace(/×/g, '*')      // Replace multiplication sign (×) with asterisk
          .replace(/\s*\*\s*/g, '*')  // Remove spaces around asterisks: "n * m" -> "n*m"
          .replace(/\s+/g, '')     // Remove all remaining whitespace
          .trim()
          .toLowerCase();
      };

      // Check if user's complexity matches expected (lenient - allows simplifications)
      const matchesComplexity = (userComp: string, expectedComp: string): boolean => {
        const normalizedUser = normalizeComplexity(userComp);
        const normalizedExpected = normalizeComplexity(expectedComp);

        // Exact match
        if (normalizedUser === normalizedExpected) return true;

        // If expected has multiple terms (e.g., "O(n log n + n*m + k)"), check if user's selection
        // matches one of the dominant terms or is a valid simplification
        if (normalizedExpected.includes('+')) {
          // Extract terms from expected (split by +)
          const expectedTerms = normalizedExpected.split('+').map(t => t.trim());
          // Check if user's selection matches any term or is contained in expected
          for (const term of expectedTerms) {
            if (normalizedUser === term || normalizedUser.includes(term) || term.includes(normalizedUser)) {
              return true;
            }
          }
          // Check if user's selection is a common simplification pattern
          // e.g., "O(n log n)" from "O(n log n + n*m + k)"
          if (normalizedExpected.includes('nlogn') && normalizedUser.includes('nlogn')) {
            return true;
          }
          if (normalizedExpected.includes('n*m') && normalizedUser.includes('n*m')) {
            return true;
          }
        }

        // Check if user's selection is contained in expected (for cases like "O(n)" in "O(n + m)")
        if (normalizedExpected.includes(normalizedUser)) {
          return true;
        }

        return false;
      };

      if (targetComp && complexity) {
        const timeCorrect = matchesComplexity(complexity.time, targetComp.time);
        const spaceCorrect = matchesComplexity(complexity.space, targetComp.space);
        complexityFeedback = {
          timeCorrect,
          spaceCorrect,
          timeExpected: targetComp.time,
          spaceExpected: targetComp.space
        };
      }

      // Calculate allPass more explicitly for debugging
      let allPass = false;
      if (allTestsPassed) {
        if (!targetComp) {
          // No complexity required - tests passing is enough
          allPass = true;
        } else if (complexityFeedback && complexityFeedback.timeCorrect === true && complexityFeedback.spaceCorrect === true) {
          // Both complexity checks passed
          allPass = true;
        }
      }

      // Debug logging to diagnose "Wrong Answer" issue
      console.log('Test execution debug:', {
        testResultsCount: testResults.length,
        testResultsDetail: testResults.map((r: any) => ({ test: r.test, passed: r.passed })),
        failingTests: testResults.filter((r: any) => !r.passed).map((r: any) => ({
          test: r.test,
          input: r.input,
          expected: r.expected,
          actual: r.result,
          error: r.error
        })),
        allTestsPassed,
        hasTargetComplexity: !!targetComp,
        targetComplexity: targetComp,
        userComplexity: complexity,
        complexityFeedback,
        allPass
      });

      // Check for brute force solution
      if (allTestsPassed && complexity && complexity.time === 'O(n log n)') {
        onBruteForceSolved(exercise.id);
      }

      // Increment attempts on every run (not just successful ones)
      const currentProgress = progressiveLessonProgress.sectionsProgress.get(exerciseWithComplexity.id);
      const updatedSectionProgress = new Map<string, SectionProgress>(progressiveLessonProgress.sectionsProgress);
      const newAttempts = (currentProgress?.attempts || 0) + 1;

      // Update progress - always increment attempts, but only mark as completed if allPass
      if (allPass) {
        updatedSectionProgress.set(exerciseWithComplexity.id, {
          sectionId: exerciseWithComplexity.id,
          status: 'completed' as const,
          completedAt: new Date(),
          attempts: newAttempts,
          timeSpent: currentProgress?.timeSpent || 0,
          startedAt: currentProgress?.startedAt
        });

        // Find current section index and unlock next section if it exists
        const currentSectionIndex = progressiveLesson.sections.findIndex(s => s.id === exerciseWithComplexity.id);
        if (currentSectionIndex >= 0 && currentSectionIndex < progressiveLesson.sections.length - 1) {
          const nextSection = progressiveLesson.sections[currentSectionIndex + 1];
          // Unlock the next section
          if (!updatedSectionProgress.has(nextSection.id)) {
            updatedSectionProgress.set(nextSection.id, {
              sectionId: nextSection.id,
              status: 'unlocked',
              attempts: 0,
              timeSpent: 0,
            });
          }
        }

        // Calculate updated overall progress
        const completedCount = Array.from(updatedSectionProgress.values())
          .filter(sp => sp.status === 'completed').length;
        const overallProgress = Math.round((completedCount / progressiveLesson.sections.length) * 100);

        onExpandLesson(exercise.id);
        // Ensure description is visible when exercise completes - expand it if collapsed
        // We'll handle this in the parent component by ensuring it's not in collapsedDescriptions

        // If exercise has solutionExplanation with 'after' placement, mark as awaiting analysis
        const quizPlacement = exercise.complexityQuizPlacement || 'after';
        if (exercise.solutionExplanation && quizPlacement === 'after') {
          // This will trigger showing the complexity analysis in the left panel
          // The exercisesAwaitingAnalysis state is managed by the parent component
        }

        // Auto-scroll to solution/explanation in left panel
        setTimeout(() => {
          const solutionSection = document.querySelector(`[data-solution-section="${exerciseWithComplexity.id}"]`);
          if (solutionSection) {
            solutionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      } else {
        // Even if not passing, update attempts count
        updatedSectionProgress.set(exerciseWithComplexity.id, {
          ...currentProgress,
          attempts: newAttempts,
          status: currentProgress?.status || 'unlocked'
        });
      }

      // Always update progress with new attempts count (whether passing or not)
      // This ensures solution shows after N attempts even if not passing
      const completedCount = Array.from(updatedSectionProgress.values())
        .filter(sp => sp.status === 'completed').length;
      const overallProgress = Math.round((completedCount / progressiveLesson.sections.length) * 100);

      onUpdateProgress({
        sectionsProgress: updatedSectionProgress,
        overallProgress: overallProgress
      });

      const formattedResults = formatTestResultsOutput(testResults);
      let feedbackMsg = formattedResults;
      if (allPass) {
        feedbackMsg = '🎉 Perfect! All tests passed with correct complexity!\n\n' + formattedResults;
      } else if (allTestsPassed && complexityFeedback && (!complexityFeedback?.timeCorrect || !complexityFeedback?.spaceCorrect)) {
        feedbackMsg = '✅ Tests passed but complexity analysis incorrect.\n\n' + formattedResults;
      } else if (!allTestsPassed) {
        feedbackMsg = '❌ Some tests failed:\n\n' + formattedResults;
      }

      return {
        success: allPass,
        output: feedbackMsg,
        complexityFeedback
      };
    } catch (err: any) {
      return {
        success: false,
        output: '',
        error: err.message
      };
    }
  };

  // Get solution text (using exerciseWithComplexity from component scope)
  let solutionText = typeof exerciseWithComplexity.solution === 'string'
    ? exerciseWithComplexity.solution
    : exerciseWithComplexity.solution?.text || '';

  // Extract Python code from markdown if present
  const pythonCodeMatch = solutionText.match(/```python\n([\s\S]*?)```/);
  if (pythonCodeMatch && pythonCodeMatch[1]) {
    solutionText = pythonCodeMatch[1].trim();
  }

  // For tree problems, prepend TreeNode class if needed
  const isTreeProblem = (exerciseWithComplexity.title || '').toLowerCase().includes('tree') ||
    (exerciseWithComplexity.id || '').toLowerCase().includes('tree');

  if (isTreeProblem && solutionText && !solutionText.includes('class TreeNode')) {
    const treeNodeClass = `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

`;
    solutionText = treeNodeClass + solutionText;
  }

  // Calculate if there's a next section
  const currentSectionIndex = progressiveLesson.sections.findIndex(s => s?.id === exerciseWithComplexity.id);
  const hasNextSection = currentSectionIndex >= 0 && currentSectionIndex < progressiveLesson.sections.length - 1;

  // Handler for "Continue" button
  const handleNext = () => {
    if (hasNextSection) {
      onUpdateProgress({
        currentSectionIndex: currentSectionIndex + 1
      });
      // Scroll to top of the page when navigating to next section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter test calls from starter code display (backend will call the function)
  const getCleanStarterCode = (starterCode: string | undefined): string => {
    if (!starterCode) return '';

    const lines = starterCode.split('\n');
    const filteredLines: string[] = [];
    let inTestSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const originalLine = lines[i];

      // Detect start of test section
      if (line === '# Test' || line.startsWith('# Test')) {
        inTestSection = true;
        continue;
      }

      // Detect start of output section
      if (line === '# Output:' || line.startsWith('# Output:')) {
        inTestSection = true;
        continue;
      }

      // If we're in a test section, skip all lines until we hit a non-comment, non-call line
      if (inTestSection) {
        // Skip function calls
        if (!line.startsWith('def ') && !line.startsWith('class ') && /^[a-zA-Z_]\w*\s*\(/.test(line)) {
          continue;
        }
        // Skip output comment lines (lines starting with # that aren't regular comments)
        if (line.startsWith('# ') && (line.includes('enter') || line.includes('exit') || line.includes('leaf'))) {
          continue;
        }
        // If we hit a blank line or a function definition, exit test section
        if (line === '' || line.startsWith('def ') || line.startsWith('class ')) {
          inTestSection = false;
          // Don't skip blank lines or function definitions
          if (line !== '' || filteredLines.length === 0 || filteredLines[filteredLines.length - 1].trim() !== '') {
            filteredLines.push(originalLine);
          }
          continue;
        }
        // Skip other lines in test section
        continue;
      }

      // Skip lines that look like function calls (but not function definitions)
      // Pattern: function_name(...) but not def function_name(...)
      if (!line.startsWith('def ') && !line.startsWith('class ') && /^[a-zA-Z_]\w*\s*\([^)]*\)\s*$/.test(line)) {
        continue;
      }

      filteredLines.push(originalLine);
    }

    return filteredLines.join('\n').trim();
  };

  return (
    <CodeEditor
      key={`code-editor-${exercise.id}`}
      language="python"
      initialCode={getCleanStarterCode(exercise.starterCode) ||
        (exercise.instruction?.match(/```python\n([\s\S]*?)```/)?.[1] || '# Write your code here\n').trim()}
      solution={solutionText}
      requireComplexity={true}
      targetComplexity={exerciseWithComplexity.targetComplexity}
      exerciseTitle={exerciseWithComplexity.title}
      hasNext={hasNextSection}
      onNext={handleNext}
      onHintRequest={(exerciseWithComplexity.hints && Array.isArray(exerciseWithComplexity.hints) && exerciseWithComplexity.hints.length > 0) ? () => {
        const currentHintLevel = hintsUsed.get(exerciseWithComplexity.id) || 0;

        // Check for brute force blocker
        if (currentHintLevel >= 5 && !bruteForceSolved.has(exerciseWithComplexity.id)) {
          onShowBruteForceBlocker(exerciseWithComplexity.id);
          onExpandLesson(exerciseWithComplexity.id);
          onHighlightBruteForceBlocker(exerciseWithComplexity.id);
          setTimeout(() => onHighlightBruteForceBlocker(null), 1000);

          setTimeout(() => {
            const blockerSection = document.querySelector(`[data-brute-force-blocker="${exerciseWithComplexity.id}"]`);
            if (blockerSection) {
              blockerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);

          return;
        }

        onHintRequest(exerciseWithComplexity.id);
        onExpandLesson(exerciseWithComplexity.id);
        onCollapseDescription(exerciseWithComplexity.id);

        setTimeout(() => {
          const hintsSection = document.querySelector(`[data-hints-section="${exerciseWithComplexity.id}"]`);
          if (hintsSection) {
            hintsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      } : undefined}
      onRun={handleRun}
    />
  );
};

// Helper functions for test case building and code preparation
const buildTestCases = (exercise: ExerciseSection): NormalizedTestCase[] => {
  let structuredCases: any[] = Array.isArray(exercise.testCases)
    ? exercise.testCases
    : [];

  if (structuredCases.length > 0) {
    return structuredCases.map((tc: any) => {
      // If test case already has inputExpr/expectedExpr, use it directly (snippet mode)
      if (tc.inputExpr !== undefined || tc.expectedExpr !== undefined) {
        return {
          mode: 'snippet',
          inputExpr: tc.inputExpr || '',
          expectedExpr: tc.expectedExpr || '',
        };
      }
      // If test case already has inputJson/expectedJson, use it directly (json mode)
      if (tc.inputJson !== undefined || tc.expectedJson !== undefined) {
        return {
          mode: 'json',
          inputJson: tc.inputJson || 'null',
          expectedJson: tc.expectedJson || 'null',
        };
      }
      // Otherwise, convert from input/expectedOutput format
      const inp = tc.input;
      const exp = (tc.expectedOutput !== undefined) ? tc.expectedOutput : tc.expected;
      const inputType = typeof inp;

      // Check if input looks like Python code or variable assignment
      const inputTrimmed = inputType === 'string' ? String(inp).trim() : '';
      const inputLooksLikeCode = inputTrimmed.length > 0 && (
        '[{(\'"0123456789-'.includes(inputTrimmed[0]) ||
        /^\w+\s*=/.test(inputTrimmed) // matches "var = value" pattern
      );

      // Check if expectedOutput looks like Python code (for no-arg functions)
      const expTrimmed = typeof exp === 'string' ? String(exp).trim() : '';
      const expLooksLikeCode = expTrimmed.length > 0 &&
        ('[{(\'"0123456789TFNtfn'.includes(expTrimmed[0])); // T/t=True, F/f=False, N/n=None

      // Check if input is comma-separated (like "2, []") and expected is a string (printed output)
      // This suggests we need to capture stdout from a function call
      const isCommaSeparatedInput = inputType === 'string' && /^\s*\d+\s*,\s*\[/.test(inputTrimmed);
      const expectedIsString = typeof exp === 'string' && exp.includes('\\n');
      const needsStdoutCapture = isCommaSeparatedInput && expectedIsString;

      // Use snippet mode if input OR expected looks like Python code
      // Also use snippet mode for empty input (no-arg functions)
      // Or if we need to capture stdout from a function call
      if (inputLooksLikeCode || expLooksLikeCode || (inputType === 'string' && inputTrimmed === '') || needsStdoutCapture) {
        let expectedExpr: string;
        if (typeof exp === 'string') {
          // Convert JavaScript boolean strings to Python format
          const expLower = exp.toLowerCase().trim();
          if (expLower === 'true') {
            expectedExpr = 'True';
          } else if (expLower === 'false') {
            expectedExpr = 'False';
          } else if (expLower === 'null' || expLower === 'none') {
            expectedExpr = 'None';
          } else {
            expectedExpr = String(exp);
          }
        } else if (typeof exp === 'boolean') {
          expectedExpr = exp ? 'True' : 'False';
        } else if (typeof exp === 'number') {
          expectedExpr = String(exp);
        } else {
          expectedExpr = JSON.stringify(exp);
        }

        // For comma-separated inputs that need stdout capture, convert to a snippet
        // that captures stdout, similar to the trace test case
        // Format: import io, sys; _buf = io.StringIO(); _old = sys.stdout; sys.stdout = _buf; func_name(args); sys.stdout = _old; _buf.getvalue().strip()
        let inputExpr = String(inp);
        if (needsStdoutCapture) {
          // The function name will be detected by the test harness and replaced
          // We use a placeholder that the harness will recognize and replace with the actual function name
          // The harness will detect this pattern and build the proper function call
          inputExpr = `import io, sys; _buf = io.StringIO(); _old = sys.stdout; sys.stdout = _buf; _FUNC_NAME(${inputTrimmed}); sys.stdout = _old; _buf.getvalue().strip()`;
        }

        return {
          mode: 'snippet',
          inputExpr,
          expectedExpr,
        };
      }

      return {
        mode: 'json',
        inputJson: JSON.stringify(inp),
        expectedJson: JSON.stringify(exp),
      };
    });
  } else {
    const exampleMatches = exercise.instruction.matchAll(/Input:\s*`([^`]+)`[\s\S]*?Output:\s*`([^`]+)`/g);
    return Array.from(exampleMatches).map((match: any) => ({
      mode: 'snippet',
      inputExpr: match[1],
      expectedExpr: match[2]
    }));
  }
};

const prepareCodeForExecution = (code: string, exercise: ExerciseSection): string => {
  let funcSource = code || exercise.starterCode || '';
  const starterCode = exercise.starterCode || '';

  // Filter out test calls and example calls from user code
  // Lines like "push_pop_trace(2, [])" or "# Test\npush_pop_trace(2, [])" should be removed
  // This prevents the test call from executing when the code runs
  const lines = funcSource.split('\n');
  const filteredLines: string[] = [];
  let skipNextLine = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip comment-only lines that indicate test sections
    if (line === '# Test' || line.startsWith('# Test') || line === '# Output:' || line.startsWith('# Output:')) {
      skipNextLine = true;
      continue;
    }

    // Skip lines that look like function calls (but not function definitions)
    // Pattern: function_name(...) but not def function_name(...)
    if (skipNextLine || (!line.startsWith('def ') && !line.startsWith('class ') && /^[a-zA-Z_]\w*\s*\([^)]*\)\s*$/.test(line))) {
      skipNextLine = false;
      continue;
    }

    skipNextLine = false;
    filteredLines.push(lines[i]);
  }

  funcSource = filteredLines.join('\n');

  // Also check test cases for tree-like output format (e.g., [5, null, 7])
  // IMPORTANT: Only match if it contains 'null' or 'None' - otherwise plain arrays
  // like [3, 4] for binary search would incorrectly match!
  const hasTreeLikeTestCase = Array.isArray(exercise.testCases) && exercise.testCases.some(tc => {
    if (tc.expectedOutput === undefined || tc.expectedOutput === null) return false;
    const expected = typeof tc.expectedOutput === 'string'
      ? tc.expectedOutput
      : (JSON.stringify(tc.expectedOutput) || '');
    // Check if expected output looks like a serialized tree (must contain null/None)
    return expected && typeof expected === 'string' &&
      expected.startsWith('[') &&
      (expected.includes('null') || expected.includes('None'));
  });

  // Detect problem types
  const isListOfStringsExercise = exercise.id === 'exercise-list-of-strings';
  const isNestedDictTrieExercise = exercise.id === 'exercise-nested-dicts';
  const isTrieProblem = funcSource.includes('class Trie');

  // Detect WordDictionary problem (needs wrapper functions for addWord/search)
  const isWordDictionaryProblem = (
    exercise.id === 'exercise-add-search-word' &&
    funcSource.includes('class WordDictionary') &&
    funcSource.includes('addWord') &&
    funcSource.includes('search')
  );

  // Check BOTH user code AND starter code for ListNode/Node (user might not have typed the class)
  const codeHasListNode = funcSource.includes('ListNode') || starterCode.includes('ListNode');
  const codeHasNodeClass = funcSource.includes('class Node') || starterCode.includes('class Node');
  const codeHasRandomPointer = funcSource.includes('.random') || starterCode.includes('.random');
  const isLinkedListProblem = !isListOfStringsExercise && (
    codeHasListNode ||
    codeHasNodeClass ||  // For problems using Node class instead of ListNode
    codeHasRandomPointer ||  // For "Copy List with Random Pointer"
    funcSource.includes('reverse_list') ||
    funcSource.includes('.next') ||  // Common linked list pattern
    starterCode.includes('.next') ||
    (exercise.title?.toLowerCase().includes('linked list')) ||
    (exercise.title?.toLowerCase().includes('sorted list')) ||  // "Remove Duplicates from Sorted List"
    (exercise.title?.toLowerCase().includes('random pointer')) ||  // "Copy List with Random Pointer"
    exercise.id === 'exercise-create-linkedlist' ||
    exercise.id?.includes('linkedlist') ||
    exercise.id?.includes('linked-list') ||
    exercise.id?.includes('random-pointer') ||
    (exercise.instruction?.toLowerCase().includes('linked list'))
  );
  // More robust tree detection: check code, starter code, title, id, and test case format
  // IMPORTANT: Don't treat as tree problem if it's already a linked list problem
  // (linked list inputs like [1,2,3] can look like tree serialization)
  const isTreeProblem = !isLinkedListProblem && (
    funcSource.includes('TreeNode') ||
    starterCode.includes('TreeNode') ||
    exercise.title?.toLowerCase().includes('tree') ||
    exercise.id?.toLowerCase().includes('tree') ||
    hasTreeLikeTestCase
  );

  // Detect design problem
  let isDesignProblem = false;
  let designClassName = '';

  if (Array.isArray(exercise.testCases) && exercise.testCases.length > 0) {
    const firstInput = exercise.testCases[0].input;
    if (typeof firstInput === 'string' && firstInput.trim().startsWith('["')) {
      try {
        const match = firstInput.match(/^\s*\["([a-zA-Z0-9_]+)"/);
        if (match && match[1]) {
          const className = match[1];
          if (funcSource.includes(`class ${className}`)) {
            isDesignProblem = true;
            designClassName = className;
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }

  let codeToUse = code;

  // Also check if code has ListNode or Node class anywhere as a safety fallback
  const needsLinkedListHelpers = isLinkedListProblem || codeToUse.includes('ListNode') || codeToUse.includes('class Node');
  const needsNodeClass = codeHasNodeClass || codeHasRandomPointer || starterCode.includes('class Node');

  // Inject helpers as needed
  if (needsLinkedListHelpers) {
    const linkedListHelper = `# ListNode definition
if 'ListNode' not in dir():
    class ListNode:
        def __init__(self, val=0, next=None):
            self.val = val
            self.next = next

# Helper: Convert list to linked list
def list_to_linkedlist(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next
    return head

# Helper: Convert linked list to list
def linkedlist_to_list(head):
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result`;

    // Add Node class for random pointer problems
    const nodeClassHelper = needsNodeClass ? `

# Node definition (for problems with random pointer)
if 'Node' not in dir():
    class Node:
        def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
            self.val = int(x)
            self.next = next
            self.random = random

# Helper: Convert [[val, random_idx], ...] to Node linked list with random pointers
def list_to_random_list(arr):
    if not arr:
        return None
    # Create all nodes first
    nodes = [Node(item[0]) for item in arr]
    # Set next pointers
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    # Set random pointers
    for i, item in enumerate(arr):
        if len(item) > 1 and item[1] is not None:
            nodes[i].random = nodes[item[1]]
    return nodes[0] if nodes else None

# Helper: Convert Node linked list with random pointers to [[val, random_idx], ...]
def random_list_to_list(head):
    if not head:
        return []
    # First pass: collect all nodes and create index map
    nodes = []
    node_to_idx = {}
    current = head
    idx = 0
    while current:
        nodes.append(current)
        node_to_idx[id(current)] = idx
        current = current.next
        idx += 1
    # Second pass: build output array
    result = []
    for node in nodes:
        random_idx = node_to_idx.get(id(node.random)) if node.random else None
        result.append([node.val, random_idx])
    return result
` : '';

    const fullHelper = linkedListHelper + nodeClassHelper;
    codeToUse = `${fullHelper}\n${code}`;
  }

  // Debug: log tree problem detection
  console.log('Tree problem detection:', {
    isTreeProblem,
    hasTreeNode: funcSource.includes('TreeNode'),
    hasTreeInTitle: exercise.title?.toLowerCase().includes('tree'),
    exerciseId: exercise.id
  });

  // Also check if code has TreeNode anywhere as a safety fallback
  const needsTreeHelpers = isTreeProblem || codeToUse.includes('TreeNode');

  if (needsTreeHelpers) {
    // Always inject tree helpers for tree problems, but only add TreeNode if not already present
    const needsTreeNode = !codeToUse.includes('class TreeNode');
    const treeHelper = needsTreeNode ? `
import collections

# TreeNode definition
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
` : `
import collections
`;

    const serializeHelpers = `
# Helper: Deserialize list to Tree (LeetCode style)
def deserialize_tree(data):
    if not data:
        return None
    
    root = TreeNode(data[0])
    queue = collections.deque([root])
    i = 1
    while queue and i < len(data):
        node = queue.popleft()
        
        if i < len(data) and data[i] is not None:
            node.left = TreeNode(data[i])
            queue.append(node.left)
        i += 1
        
        if i < len(data) and data[i] is not None:
            node.right = TreeNode(data[i])
            queue.append(node.right)
        i += 1
    return root

# Helper: Serialize Tree to list (LeetCode style)
def serialize_tree(root):
    if not root:
        return []
    result = []
    queue = collections.deque([root])
    while queue:
        node = queue.popleft()
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    
    # Remove trailing Nones
    while result and result[-1] is None:
        result.pop()
    return result
`;
    codeToUse = `${treeHelper}${serializeHelpers}\n${codeToUse}`;
  }

  // Add WordDictionary wrapper functions if needed
  if (isWordDictionaryProblem) {
    const wordDictHelper = `
# WordDictionary wrapper functions
# Create global instance
wordDict = WordDictionary()

# Wrapper functions for test cases
def addWord(word):
    wordDict.addWord(word)

def search(word):
    return wordDict.search(word)
`;
    codeToUse = `${codeToUse}\n${wordDictHelper}`;
  }

  // Determine default function name
  // Match function definitions with their parameters to detect methods (self parameter)
  const allFuncMatchesWithParams = Array.from(codeToUse.matchAll(/def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)/g));

  let defaultFuncName: string;
  if (isTrieProblem || isListOfStringsExercise || isNestedDictTrieExercise) {
    defaultFuncName = 'solution';
  } else {
    // Filter to get only standalone functions (not methods with 'self')
    // Exclude all helper functions that are injected
    const HELPER_FUNC_NAMES = new Set([
      'deserialize_tree', 'serialize_tree',
      'list_to_linkedlist', 'linkedlist_to_list',
      'list_to_random_list', 'random_list_to_list',
      'solution'  // Also skip if 'solution' already exists
    ]);
    const userFunctions = allFuncMatchesWithParams
      .filter(match => {
        const name = match[1];
        const params = match[2];
        const isSelfMethod = /\bself\b/.test(params);
        return !name.startsWith('__') &&
          !isSelfMethod &&
          !HELPER_FUNC_NAMES.has(name);
      })
      .map(match => match[1]);

    // Use the first user function found (now that helpers are excluded)
    defaultFuncName = userFunctions[0];
    if (!defaultFuncName) {
      // Fallback: try to find function name in the instruction
      const fallbackMatch = exercise.instruction.match(/def\s+([A-Za-z_]\w*)\s*\(/);
      defaultFuncName = fallbackMatch ? fallbackMatch[1] : 'solution';
    }
  }

  // IMPORTANT: Linked list and tree problems are mutually exclusive for conversion purposes
  // If it's a linked list problem, don't apply tree conversion (even if TreeNode is mentioned)
  const effectiveIsLinkedListProblem = needsLinkedListHelpers;
  const effectiveIsTreeProblem = needsTreeHelpers && !needsLinkedListHelpers;

  return ensureSolutionWrapper({
    code: codeToUse,
    defaultFuncName,
    isLinkedListProblem: effectiveIsLinkedListProblem,
    isTreeProblem: effectiveIsTreeProblem,
    isTrieProblem,
    isListOfStringsExercise,
    isNestedDictTrieExercise,
    isDesignProblem,
    designClassName,
  });
};

// Additional sub-components for other editor types
interface PracticeExerciseEditorProps {
  practiceExercise: {
    title: string;
    instruction: string;
    starterCode?: string;
    testCases?: {
      input: string;
      expectedOutput: string;
    }[];
    difficulty?: 'easy' | 'medium' | 'hard';
    solution?: string | {
      afterAttempt: number;
      text: string;
    };
  };
  currentSection: any;
  progressiveLesson: ProgressiveLesson;
  progressiveLessonProgress: ProgressiveLessonProgress;
  hintsUsed: Map<string, number>;
  expandedLessons: Set<string>;
  onUpdateProgress: (updates: Partial<ProgressiveLessonProgress>) => void;
  onHintRequest: (sectionId: string) => void;
  onExpandLesson: (sectionId: string) => void;
}

const PracticeExerciseEditor: React.FC<PracticeExerciseEditorProps> = ({
  practiceExercise,
  currentSection,
  progressiveLesson,
  progressiveLessonProgress,
  hintsUsed,
  expandedLessons,
  onUpdateProgress,
  onHintRequest,
  onExpandLesson,
}) => {
  // Convert practice exercise to ExerciseSection format for ExerciseCodeEditor
  const exerciseSection: ExerciseSection = {
    type: 'exercise',
    id: `${currentSection.id}-practice`,
    title: practiceExercise.title,
    instruction: practiceExercise.instruction,
    description: practiceExercise.instruction,
    starterCode: practiceExercise.starterCode || '',
    testCases: practiceExercise.testCases?.map(tc => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      expected: tc.expectedOutput,
    })) || [],
    difficulty: practiceExercise.difficulty || 'easy',
    solution: practiceExercise.solution,
    targetComplexity: undefined,
    hints: [],
  };

  return (
    <div className="h-full w-full flex flex-col min-w-0">
      <ExerciseCodeEditor
        exercise={exerciseSection}
        progressiveLesson={progressiveLesson}
        progressiveLessonProgress={progressiveLessonProgress}
        hintsUsed={hintsUsed}
        bruteForceSolved={new Set()}
        showBruteForceBlocker={new Set()}
        onUpdateProgress={onUpdateProgress}
        onHintRequest={onHintRequest}
        onExpandLesson={onExpandLesson}
        onCollapseDescription={() => { }}
        onBruteForceSolved={() => { }}
        onShowBruteForceBlocker={() => { }}
        onHighlightBruteForceBlocker={() => { }}
      />
    </div>
  );
};

interface QuickQuizPanelProps {
  quickQuiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  currentSection: any;
  readingQuizAnswers: Map<string, { answer: number | null; completed: boolean }>;
  progressiveLessonProgress: ProgressiveLessonProgress;
  onQuizAnswer?: (questionId: string, answer: number) => void;
  onUpdateProgress: (updates: Partial<ProgressiveLessonProgress>) => void;
}

const QuickQuizPanel: React.FC<QuickQuizPanelProps> = ({
  quickQuiz,
  currentSection,
  readingQuizAnswers,
  progressiveLessonProgress,
  onQuizAnswer,
  onUpdateProgress,
}) => {
  const questionId = `${currentSection.id}-quickquiz`;
  const savedAnswer = readingQuizAnswers.get(questionId);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(
    savedAnswer?.answer ?? null
  );
  const [isSubmitted, setIsSubmitted] = React.useState(savedAnswer?.completed ?? false);
  const [showExplanation, setShowExplanation] = React.useState(savedAnswer?.completed ?? false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(answerIndex);
    if (onQuizAnswer) {
      onQuizAnswer(questionId, answerIndex);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || isSubmitted) return;

    setIsSubmitted(true);
    setShowExplanation(true);

    const isCorrect = selectedAnswer === quickQuiz.correctAnswer;

    // Update reading quiz answers
    const updatedAnswers = new Map(readingQuizAnswers);
    updatedAnswers.set(questionId, {
      answer: selectedAnswer,
      completed: true,
    });

    // If correct, mark reading section as completed
    if (isCorrect) {
      const updatedSectionProgress = new Map(progressiveLessonProgress.sectionsProgress);
      updatedSectionProgress.set(currentSection.id, {
        sectionId: currentSection.id,
        status: 'completed',
        attempts: 1,
        timeSpent: 0,
        completedAt: new Date(),
      });

      onUpdateProgress({
        sectionsProgress: updatedSectionProgress,
      });
    }
  };

  const isCorrect = selectedAnswer === quickQuiz.correctAnswer;

  return (
    <div className="h-full w-full flex flex-col bg-white min-w-0">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-indigo-50">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-indigo-900">Quick Quiz</h3>
        </div>
        <p className="text-sm text-indigo-700 mt-1">Test your understanding of the reading material</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Question */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-slate-900 mb-6 whitespace-pre-wrap">
              {renderStyledText(quickQuiz.question)}
            </div>

            {/* Options */}
            <div className="space-y-2">
              {quickQuiz.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                const isCorrectOption = optionIndex === quickQuiz.correctAnswer;
                const showResult = isSubmitted && showExplanation;

                return (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(optionIndex)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${showResult && isCorrectOption
                        ? 'border-green-500 bg-green-50'
                        : showResult && isSelected && !isCorrect
                          ? 'border-red-500 bg-red-50'
                          : isSelected
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${showResult && isCorrectOption
                          ? 'border-green-500 bg-green-500'
                          : showResult && isSelected && !isCorrect
                            ? 'border-red-500 bg-red-500'
                            : isSelected
                              ? 'border-indigo-500 bg-indigo-500'
                              : 'border-slate-300'
                        }`}>
                        {showResult && isCorrectOption && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <AlertCircle className="w-3 h-3 text-white" />
                        )}
                        {isSelected && !showResult && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-slate-700">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Submit Button */}
            {!isSubmitted && selectedAnswer !== null && (
              <div className="mt-4">
                <Button
                  onClick={handleSubmit}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Submit Answer
                </Button>
              </div>
            )}

            {/* Explanation */}
            {showExplanation && quickQuiz.explanation && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
                  }`}
              >
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className={`font-semibold mb-1 ${isCorrect ? 'text-green-900' : 'text-amber-900'
                      }`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </div>
                    <div className={`text-sm ${isCorrect ? 'text-green-800' : 'text-amber-800'
                      }`}>
                      {renderStyledText(quickQuiz.explanation)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface FollowingQuizPanelProps {
  quizSection: QuizSection;
  readingQuizAnswers: Map<string, { answer: number | null; completed: boolean }>;
  progressiveLessonProgress: ProgressiveLessonProgress;
  currentSection: any;
  onQuizAnswer?: (questionId: string, answer: number) => void;
  onUpdateProgress: (updates: Partial<ProgressiveLessonProgress>) => void;
}

const FollowingQuizPanel: React.FC<FollowingQuizPanelProps> = ({
  quizSection,
  readingQuizAnswers,
  progressiveLessonProgress,
  currentSection,
  onQuizAnswer,
  onUpdateProgress,
}) => {
  const [selectedAnswers, setSelectedAnswers] = React.useState<Map<string, number>>(new Map());
  const [showExplanations, setShowExplanations] = React.useState<Set<string>>(new Set());
  const [submittedQuestions, setSubmittedQuestions] = React.useState<Set<string>>(new Set());

  // Initialize answers from readingQuizAnswers if available
  React.useEffect(() => {
    const initialAnswers = new Map<string, number>();
    quizSection.questions.forEach(question => {
      const savedAnswer = readingQuizAnswers.get(question.id);
      if (savedAnswer?.answer !== null && savedAnswer?.answer !== undefined) {
        initialAnswers.set(question.id, savedAnswer.answer);
        if (savedAnswer.completed) {
          setSubmittedQuestions(prev => new Set(prev).add(question.id));
          setShowExplanations(prev => new Set(prev).add(question.id));
        }
      }
    });
    setSelectedAnswers(initialAnswers);
  }, [quizSection.questions, readingQuizAnswers]);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (submittedQuestions.has(questionId)) return; // Already submitted

    const newAnswers = new Map(selectedAnswers);
    newAnswers.set(questionId, answerIndex);
    setSelectedAnswers(newAnswers);

    // Call onQuizAnswer callback if provided
    if (onQuizAnswer) {
      onQuizAnswer(questionId, answerIndex);
    }
  };

  const handleSubmitAnswer = (questionId: string) => {
    if (submittedQuestions.has(questionId)) return;

    const selected = selectedAnswers.get(questionId);
    if (selected === undefined) return; // No answer selected

    setSubmittedQuestions(prev => new Set(prev).add(questionId));
    setShowExplanations(prev => new Set(prev).add(questionId));

    // Update progress
    const question = quizSection.questions.find(q => q.id === questionId);
    if (question) {
      const isCorrect = selected === question.correctAnswer;
      const updatedAnswers = new Map(readingQuizAnswers);
      updatedAnswers.set(questionId, {
        answer: selected,
        completed: true,
      });

      // Check if all questions are answered
      const allAnswered = quizSection.questions.every(q =>
        submittedQuestions.has(q.id) || q.id === questionId
      );
      const allCorrect = quizSection.questions.every(q => {
        const answer = q.id === questionId ? selected : selectedAnswers.get(q.id);
        return answer === q.correctAnswer;
      });

      // Update section progress if all questions are answered correctly
      if (allAnswered && allCorrect) {
        const updatedSectionProgress = new Map(progressiveLessonProgress.sectionsProgress);
        updatedSectionProgress.set(quizSection.id, {
          sectionId: quizSection.id,
          status: 'completed',
          attempts: 1,
          timeSpent: 0,
          completedAt: new Date(),
        });

        onUpdateProgress({
          sectionsProgress: updatedSectionProgress,
        });
      }
    }
  };

  const allQuestionsAnswered = quizSection.questions.every(q => submittedQuestions.has(q.id));
  const allCorrect = quizSection.questions.every(q => {
    const answer = selectedAnswers.get(q.id);
    return answer === q.correctAnswer;
  });

  return (
    <div className="h-full w-full flex flex-col bg-white min-w-0">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-indigo-50">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-indigo-900">{quizSection.title || 'Quiz'}</h3>
        </div>
        {(quizSection as any).description && (
          <p className="text-sm text-indigo-700 mt-1">{(quizSection as any).description}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6 max-w-3xl mx-auto">
          {quizSection.questions.map((question, qIndex) => {
            const selected = selectedAnswers.get(question.id);
            const isSubmitted = submittedQuestions.has(question.id);
            const isCorrect = selected === question.correctAnswer;
            const showExplanation = showExplanations.has(question.id);

            return (
              <div key={question.id} className="space-y-4">
                {/* Question */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
                    {qIndex + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-900 mb-4 whitespace-pre-wrap">
                      {renderStyledText(question.question)}
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selected === optionIndex;
                        const isCorrectOption = optionIndex === question.correctAnswer;
                        const showResult = isSubmitted && showExplanation;

                        return (
                          <button
                            key={optionIndex}
                            onClick={() => !isSubmitted && handleAnswerSelect(question.id, optionIndex)}
                            disabled={isSubmitted}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${showResult && isCorrectOption
                                ? 'border-green-500 bg-green-50'
                                : showResult && isSelected && !isCorrect
                                  ? 'border-red-500 bg-red-50'
                                  : isSelected
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                              } ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${showResult && isCorrectOption
                                  ? 'border-green-500 bg-green-500'
                                  : showResult && isSelected && !isCorrect
                                    ? 'border-red-500 bg-red-500'
                                    : isSelected
                                      ? 'border-indigo-500 bg-indigo-500'
                                      : 'border-slate-300'
                                }`}>
                                {showResult && isCorrectOption && (
                                  <CheckCircle2 className="w-3 h-3 text-white" />
                                )}
                                {showResult && isSelected && !isCorrect && (
                                  <AlertCircle className="w-3 h-3 text-white" />
                                )}
                                {isSelected && !showResult && (
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                              <span className="text-slate-700">{option}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit Button */}
                    {!isSubmitted && selected !== undefined && (
                      <div className="mt-4">
                        <Button
                          onClick={() => handleSubmitAnswer(question.id)}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          Submit Answer
                        </Button>
                      </div>
                    )}

                    {/* Explanation */}
                    {showExplanation && question.explanation && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
                          }`}
                      >
                        <div className="flex items-start gap-2">
                          {isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className={`font-semibold mb-1 ${isCorrect ? 'text-green-900' : 'text-amber-900'
                              }`}>
                              {isCorrect ? 'Correct!' : 'Incorrect'}
                            </div>
                            <div className={`text-sm ${isCorrect ? 'text-green-800' : 'text-amber-800'
                              }`}>
                              {renderStyledText(question.explanation)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {allQuestionsAnswered && allCorrect && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg text-center"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-green-900 mb-1">Quiz Completed!</h3>
            <p className="text-green-700">All answers are correct. Great job!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

interface NextExerciseEditorProps {
  exercise: ExerciseSection;
  progressiveLesson: any;
  progressiveLessonProgress: any;
  hintsUsed: Map<string, number>;
  bruteForceSolved: Set<string>;
  showBruteForceBlocker: Set<string>;
  expandedLessons: Set<string>;
  collapsedDescriptions: Set<string>;
  onUpdateProgress: (updates: Partial<ProgressiveLessonProgress>) => void;
  onHintRequest: (sectionId: string) => void;
  onExpandLesson: (sectionId: string) => void;
  onCollapseDescription: (sectionId: string) => void;
  onBruteForceSolved: (sectionId: string) => void;
  onShowBruteForceBlocker: (sectionId: string) => void;
  onHighlightBruteForceBlocker: (sectionId: string | null) => void;
}

const NextExerciseEditor: React.FC<NextExerciseEditorProps> = ({
  exercise,
  progressiveLesson,
  progressiveLessonProgress,
  hintsUsed,
  bruteForceSolved,
  showBruteForceBlocker,
  expandedLessons,
  collapsedDescriptions,
  onUpdateProgress,
  onHintRequest,
  onExpandLesson,
  onCollapseDescription,
  onBruteForceSolved,
  onShowBruteForceBlocker,
  onHighlightBruteForceBlocker
}) => {
  // Show a banner indicating this is a preview of the next exercise
  return (
    <div className="h-full w-full flex flex-col min-w-0">
      <div className="p-4 bg-amber-50 border-b-2 border-amber-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <div>
            <div className="font-semibold text-amber-900">Upcoming Exercise Preview</div>
            <div className="text-sm text-amber-700">
              Complete the current reading section to unlock this exercise: <strong>{exercise.title}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Use the same ExerciseCodeEditor component */}
      <ExerciseCodeEditor
        exercise={exercise}
        progressiveLesson={progressiveLesson}
        progressiveLessonProgress={progressiveLessonProgress}
        hintsUsed={hintsUsed}
        bruteForceSolved={bruteForceSolved}
        showBruteForceBlocker={showBruteForceBlocker}
        onUpdateProgress={onUpdateProgress}
        onHintRequest={onHintRequest}
        onExpandLesson={onExpandLesson}
        onCollapseDescription={onCollapseDescription}
        onBruteForceSolved={onBruteForceSolved}
        onShowBruteForceBlocker={onShowBruteForceBlocker}
        onHighlightBruteForceBlocker={onHighlightBruteForceBlocker}
      />
    </div>
  );
};

const DefaultPracticeEditor: React.FC<{ currentSection: any }> = ({ currentSection }) => {
  // For reading sections without practice exercises, show a helpful message
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 min-w-0">
      <div className="text-center p-8 max-w-md">
        <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-500" />
        <h3 className="text-slate-700 mb-2 text-lg font-semibold">Reading Section</h3>
        <p className="text-slate-600 text-sm mb-4">
          Read through the lesson content on the left. When you're ready, continue to the next section to start coding exercises.
        </p>
        {currentSection?.type === 'reading' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 <strong>Tip:</strong> Complete the reading section to unlock the next exercise.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditorPanel;