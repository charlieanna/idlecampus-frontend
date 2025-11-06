import { LessonViewer } from './LessonViewer';
import { QuizViewer } from './QuizViewer';
import { Lab } from './Lab';
import type { ModuleItem as ApiModuleItem } from '../../services/api';

/**
 * CourseItem Renderer
 * Smart component that renders the correct UI component based on item type
 *
 * Handles:
 * - CourseLesson → LessonViewer
 * - Quiz → QuizViewer
 * - HandsOnLab → Lab component (Terminal or CodeEditor)
 * - InteractiveLearningUnit → LessonViewer (with interactive content)
 */

export interface CourseItemProps {
  item: ApiModuleItem;
  isCompleted?: boolean;
  completedCommands?: Set<string>;
  completedTasks?: Set<string>;
  onLessonComplete?: () => void;
  onQuizComplete?: () => void;
  onLabComplete?: () => void;
  onTaskComplete?: (taskId: string, command: string) => void;
  onCommand?: (command: string) => string | null;
  onGoToLab?: () => void;
}

export function CourseItem({
  item,
  isCompleted = false,
  completedCommands = new Set(),
  completedTasks = new Set(),
  onLessonComplete,
  onQuizComplete,
  onLabComplete,
  onTaskComplete,
  onCommand,
  onGoToLab
}: CourseItemProps) {
  const itemType = item.item_type;

  // Render Lesson
  if (itemType === 'CourseLesson') {
    const lesson = {
      id: `lesson-${item.id}`,
      title: item.title,
      content: item.content || '',
      items: item.content ? [{
        type: 'content' as const,
        markdown: item.content
      }] : []
    };

    return (
      <LessonViewer
        lesson={lesson}
        isCompleted={isCompleted}
        completedCommands={completedCommands}
        onGoToLab={onGoToLab}
      />
    );
  }

  // Render Quiz
  if (itemType === 'Quiz') {
    const quiz = {
      id: `quiz-${item.id}`,
      title: item.title,
      description: item.description || '',
      questions: item.quiz ? [item.quiz] : []
    };

    return (
      <QuizViewer
        quiz={quiz}
        onComplete={onQuizComplete || (() => {})}
        isCompleted={isCompleted}
        onRegisterCommandHandler={() => {}}
        onGoToLab={onGoToLab}
      />
    );
  }

  // Render Hands-On Lab
  if (itemType === 'HandsOnLab') {
    const lab = {
      id: `lab-${item.id}`,
      title: item.title,
      description: item.description || '',
      labFormat: item.lab_format,
      labType: item.lab_type,
      difficulty: item.difficulty,
      estimatedMinutes: item.estimated_minutes,
      programmingLanguage: item.programming_language,
      starterCode: item.starter_code,
      solutionCode: item.solution_code,
      testCases: item.test_cases,
      allowedImports: item.allowed_imports,
      timeLimit: item.time_limit_seconds,
      memoryLimit: item.memory_limit_mb,
      tasks: convertStepsToTasks(item.steps || []),
      steps: item.steps
    };

    return (
      <Lab
        lab={lab}
        onTaskComplete={onTaskComplete}
        completedTasks={new Set(completedTasks)}
        onCommand={onCommand}
        onComplete={onLabComplete}
      />
    );
  }

  // Render Interactive Learning Unit (as a lesson)
  if (itemType === 'InteractiveLearningUnit') {
    const lesson = {
      id: `unit-${item.id}`,
      title: item.title,
      content: item.content || item.concept_explanation || '',
      items: [{
        type: 'content' as const,
        markdown: item.content || item.concept_explanation || ''
      }]
    };

    // Add command hints if available
    if (item.command_to_learn || item.practice_hints) {
      const commandSection = `
## Practice

${item.command_to_learn ? `**Command:** \`${item.command_to_learn}\`` : ''}

${item.practice_hints ? `
**Hints:**
${item.practice_hints.map((hint: string) => `- ${hint}`).join('\n')}
` : ''}
      `.trim();

      lesson.items.push({
        type: 'content',
        markdown: commandSection
      });
    }

    return (
      <LessonViewer
        lesson={lesson}
        isCompleted={isCompleted}
        completedCommands={completedCommands}
        onGoToLab={onGoToLab}
      />
    );
  }

  // Fallback: Unknown item type
  return (
    <div className="h-full flex items-center justify-center bg-white p-6">
      <div className="text-center">
        <div className="text-slate-400 mb-2">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">Unknown Item Type</h3>
        <p className="text-slate-500 text-sm">
          Item type "{itemType}" is not supported yet.
        </p>
      </div>
    </div>
  );
}

/**
 * Convert lab steps to tasks format for Lab component
 */
function convertStepsToTasks(steps: any[]): any[] {
  if (!steps || steps.length === 0) return [];

  return steps.map((step, index) => ({
    id: `task-${step.step_number || index + 1}`,
    description: step.instruction || step.title || `Step ${index + 1}`,
    hint: step.hint || '',
    validation: (cmd: string) => {
      const expected = step.expected_command || step.command;
      if (!expected) return true;

      // Simple validation - check if command matches or contains expected
      const normalizedCmd = cmd.trim().toLowerCase();
      const normalizedExpected = expected.trim().toLowerCase();

      return normalizedCmd === normalizedExpected ||
             normalizedCmd.includes(normalizedExpected);
    },
    solution: step.expected_command || step.command || ''
  }));
}

export default CourseItem;
