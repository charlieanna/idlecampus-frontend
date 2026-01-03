import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Play, RotateCcw, CheckCircle2, XCircle, Lightbulb, ChevronRight } from 'lucide-react';
import { Textarea } from '../ui/textarea';

interface Task {
  id: string;
  title: string;
  description: string;
  instruction: string;
  starterCode: string;
  solution: string;
  hints: string[];
  validation: (code: string) => { passed: boolean; error?: string };
}

interface TaskProgressPanelProps {
  problemTitle: string;
  tasks: Task[];
  onAllTasksComplete?: () => void;
}

export default function TaskProgressPanel({
  problemTitle,
  tasks,
  onAllTasksComplete
}: TaskProgressPanelProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [taskCodes, setTaskCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    tasks.forEach(task => {
      initial[task.id] = task.starterCode;
    });
    return initial;
  });
  const [testResult, setTestResult] = useState<{ passed: boolean; error?: string } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const currentTask = tasks.find(task => !completedTasks.has(task.id));
  const currentTaskIndex = currentTask ? tasks.indexOf(currentTask) : tasks.length;
  const currentCode = currentTask ? taskCodes[currentTask.id] : '';

  const completedCount = completedTasks.size;
  const progress = (completedCount / tasks.length) * 100;

  useEffect(() => {
    setShowHints(false);
    setShowSolution(false);
    setTestResult(null);
    setFailedAttempts(0);
  }, [currentTask?.id]);

  const runTest = () => {
    if (!currentTask) return;

    setIsRunning(true);

    setTimeout(() => {
      const result = currentTask.validation(currentCode);
      setTestResult(result);

      if (result.passed) {
        setCompletedTasks(prev => new Set([...prev, currentTask.id]));
        setFailedAttempts(0);

        if (completedTasks.size + 1 === tasks.length && onAllTasksComplete) {
          setTimeout(() => onAllTasksComplete(), 500);
        }
      } else {
        setFailedAttempts(prev => prev + 1);
      }

      setIsRunning(false);
    }, 500);
  };

  const resetCode = () => {
    if (currentTask) {
      setTaskCodes(prev => ({
        ...prev,
        [currentTask.id]: currentTask.starterCode
      }));
      setTestResult(null);
    }
  };

  const updateCode = (code: string) => {
    if (currentTask) {
      setTaskCodes(prev => ({
        ...prev,
        [currentTask.id]: code
      }));
    }
  };

  const canShowHint = failedAttempts >= 2;

  if (!currentTask) {
    return (
      <div className="h-full overflow-auto bg-white border-l flex flex-col">
        <div className="sticky top-0 bg-white border-b z-10 p-4">
          <h3 className="font-semibold text-slate-900">{problemTitle}</h3>
          <p className="text-xs text-slate-600 mt-1">All Tasks Complete!</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-6 bg-green-50 border-green-200 max-w-md">
            <div className="text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-green-900 mb-2">Congratulations!</h4>
              <p className="text-sm text-green-800">
                You've successfully built the complete backtracking solution step by step.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-white border-l flex flex-col">
      <div className="sticky top-0 bg-white border-b z-10 p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-slate-900">{problemTitle}</h3>
          <p className="text-xs text-slate-600 mt-1">Complete Each Task to Unlock the Next</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-600">
              Task {currentTaskIndex + 1} of {tasks.length}
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <Card className="p-4 border-blue-300 bg-blue-50">
          <div className="flex items-start gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {currentTaskIndex + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900">{currentTask.title}</h4>
              <p className="text-sm text-blue-800 mt-1">{currentTask.description}</p>
            </div>
          </div>

          <div className="p-3 bg-white rounded border border-blue-200">
            <p className="text-xs font-semibold text-slate-900 mb-1">What to do:</p>
            <p className="text-sm text-slate-700">{currentTask.instruction}</p>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Your Code:</label>
            <Button
              size="sm"
              variant="ghost"
              onClick={resetCode}
              className="h-6 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
          <Textarea
            value={currentCode}
            onChange={(e) => updateCode(e.target.value)}
            className="font-mono text-xs min-h-[250px] resize-none bg-slate-900 text-slate-100 border-slate-700"
            placeholder="Write your Python code here..."
            spellCheck={false}
          />
        </Card>

        <Button
          onClick={runTest}
          disabled={isRunning}
          className="w-full flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Checking...' : 'Check Task'}
        </Button>

        {testResult && (
          <Card className={`p-4 ${testResult.passed ? 'border-green-500 bg-green-50' : 'border-red-300 bg-red-50'}`}>
            <div className="flex items-start gap-2">
              {testResult.passed ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900">Task Complete!</h4>
                    <p className="text-sm text-green-800 mt-1">
                      {currentTaskIndex < tasks.length - 1
                        ? 'Great job! The next task will appear automatically.'
                        : 'Congratulations! You\'ve completed all tasks!'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900">Not Quite Right</h4>
                    {testResult.error && (
                      <p className="text-sm text-red-800 mt-1">{testResult.error}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {currentTask.hints.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <h4 className="text-sm font-semibold text-slate-900">Need Help?</h4>
            </div>
            {canShowHint ? (
              <div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowHints(!showHints)}
                  className="w-full mb-2"
                >
                  <Lightbulb className="w-3 h-3 mr-1" />
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </Button>
                {showHints && (
                  <div className="space-y-2">
                    {currentTask.hints.map((hint, idx) => (
                      <div key={idx} className="p-3 bg-yellow-50 rounded border border-yellow-200">
                        <p className="text-xs font-semibold text-yellow-900 mb-1">Hint {idx + 1}:</p>
                        <p className="text-xs text-slate-700">{hint}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-600">
                Hints will unlock after {2 - failedAttempts} more {failedAttempts === 1 ? 'attempt' : 'attempts'}
              </p>
            )}
          </Card>
        )}

        {testResult?.passed && (
          <Card className="p-4 bg-slate-50">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowSolution(!showSolution)}
              className="w-full mb-3"
            >
              <ChevronRight className={`w-4 h-4 mr-1 transition-transform ${showSolution ? 'rotate-90' : ''}`} />
              {showSolution ? 'Hide Reference Solution' : 'View Reference Solution'}
            </Button>
            {showSolution && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">Reference Solution:</p>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs font-mono overflow-x-auto">
                  {currentTask.solution}
                </pre>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
