import { LabExercise, Lab as TerminalLab } from './LabExercise';
import { CodeEditor } from './CodeEditor';
import type { CodeLab } from '../../types/codeLab';

/**
 * Unified Lab Component
 * Automatically renders the appropriate lab type based on lab_format
 *
 * Supports:
 * - Terminal labs (Docker, Kubernetes, Linux commands)
 * - Code editor labs (Python, JavaScript, Go, SQL)
 * - Hybrid labs (future support)
 */

export interface UnifiedLabProps {
  lab: {
    id: string;
    title: string;
    description: string;
    labFormat?: string;
    labType?: string;
    difficulty?: string;
    estimatedMinutes?: number;
    programmingLanguage?: string;

    // Terminal lab specific
    tasks?: Array<{
      id: string;
      description: string;
      hint: string;
      validation: (command: string) => boolean;
      solution: string;
    }>;
    steps?: any[];

    // Code editor lab specific
    starterCode?: string;
    solutionCode?: string;
    testCases?: any[];
    allowedImports?: string[];
    timeLimit?: number;
    memoryLimit?: number;
  };
  onTaskComplete?: (taskId: string, command: string) => void;
  completedTasks?: Set<string>;
  onCommand?: (command: string) => string | null;
  onComplete?: () => void;
}

export function Lab({
  lab,
  onTaskComplete,
  completedTasks = new Set(),
  onCommand,
  onComplete
}: UnifiedLabProps) {
  const labFormat = lab.labFormat || 'terminal';

  // Determine lab type
  const isCodeEditorLab = labFormat === 'code_editor' || lab.programmingLanguage;
  const isTerminalLab = labFormat === 'terminal' || lab.tasks || lab.steps;

  // Render code editor lab
  if (isCodeEditorLab && lab.programmingLanguage) {
    const codeLab: CodeLab = {
      id: parseInt(lab.id.replace(/\D/g, '')) || 0,
      title: lab.title,
      description: lab.description,
      difficulty: lab.difficulty || 'medium',
      estimated_minutes: lab.estimatedMinutes || 30,
      programming_language: lab.programmingLanguage,
      starter_code: lab.starterCode || '',
      solution_code: lab.solutionCode || '',
      test_cases: lab.testCases || [],
      allowed_imports: lab.allowedImports || [],
      points_reward: 100,
      max_attempts: 5,
      time_limit_seconds: lab.timeLimit || 5,
      memory_limit_mb: lab.memoryLimit || 128
    };

    return (
      <CodeEditor
        lab={codeLab}
        onComplete={onComplete || (() => {})}
      />
    );
  }

  // Render terminal lab
  if (isTerminalLab && lab.tasks) {
    const terminalLab: TerminalLab = {
      id: lab.id,
      title: lab.title,
      description: lab.description,
      tasks: lab.tasks
    };

    return (
      <LabExercise
        lab={terminalLab}
        onTaskComplete={onTaskComplete || (() => {})}
        completedTasks={completedTasks}
        onCommand={onCommand || (() => null)}
      />
    );
  }

  // Fallback: render basic lab info if format not recognized
  return (
    <div className="h-full flex flex-col bg-white p-6">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{lab.title}</h1>
        <p className="text-slate-600 mb-4">{lab.description}</p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>Lab format not supported:</strong> {labFormat}
          </p>
          <p className="text-yellow-700 text-sm mt-2">
            This lab requires a specific format that hasn't been implemented yet.
          </p>
        </div>

        {lab.steps && lab.steps.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Lab Steps:</h2>
            <ol className="space-y-2">
              {lab.steps.map((step: any, index: number) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-slate-900">{step.title || step.instruction}</p>
                    {step.hint && (
                      <p className="text-sm text-slate-500 mt-1">💡 {step.hint}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lab;
