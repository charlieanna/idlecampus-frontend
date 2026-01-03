import React, { useState, useCallback } from 'react';
import { CodeEditorCore } from './CodeEditorCore';
import { buildPythonTestHarness, parsePythonTestResults, normalizeSmartPracticeTestCases } from '../../utils/pythonTestHarness';
import { Play, CheckCircle2, XCircle, Lightbulb, RotateCcw, Clock } from 'lucide-react';

import { InlineExercise } from '../../types/progressive-lesson-enhanced';

interface InlineMiniEditorProps {
  exercise: InlineExercise;
  runPythonCode: (code: string) => Promise<{ output: string; error?: string }>;
  onComplete?: (exerciseId: string, timeSpent?: number) => void;
  height?: string;
}

interface TestResult {
  test: number;
  passed: boolean;
  input?: string;
  result?: any;
  expected?: any;
  error?: string;
}

export const InlineMiniEditor: React.FC<InlineMiniEditorProps> = ({
  exercise,
  runPythonCode,
  onComplete,
  height = '180px',
}) => {
  // Persistence Keys
  const STORAGE_KEY_PREFIX = `inline-editor-${exercise.id}`;

  const [code, setCode] = useState(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}-code`) || exercise.starterCode;
  });

  const [isCompleted, setIsCompleted] = useState(() => {
    return localStorage.getItem(`${STORAGE_KEY_PREFIX}-completed`) === 'true';
  });

  const [timeSpent, setTimeSpent] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}-time`);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(!isCompleted); // Start on mount if not complete

  // Persist code changes
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}-code`, newCode);
  }, [STORAGE_KEY_PREFIX]);

  // Sync completion state on mount if already completed
  React.useEffect(() => {
    if (isCompleted) {
      onComplete?.(exercise.id, timeSpent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && !isCompleted) {
      interval = setInterval(() => {
        setTimeSpent(t => {
          const newTime = t + 1;
          localStorage.setItem(`${STORAGE_KEY_PREFIX}-time`, newTime.toString());
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, isCompleted, STORAGE_KEY_PREFIX]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setResults([]);
    setLogs(null);
    setValidationMessage(null);
    setAttempts(prev => prev + 1);

    try {
      // Normalize test cases
      const normalizedTestCases = normalizeSmartPracticeTestCases(exercise.testCases);

      // Build the test harness
      const testCode = buildPythonTestHarness(
        code,
        normalizedTestCases,
        exercise.targetFunction
      );

      // Run the code
      const result = await runPythonCode(testCode);

      if (result.error) {
        setError(result.error);
        return;
      }

      // Parse results
      const parsed = parsePythonTestResults(result.output);

      if (parsed.error) {
        setError(parsed.error);
        return;
      }

      setResults(parsed.results);
      setLogs(parsed.logs || null);

      // Check if all tests passed
      const allPassed = parsed.results.length > 0 && parsed.results.every(r => r.passed);
      if (allPassed && !isCompleted) {
        setIsCompleted(true);
        setIsTimerActive(false);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}-completed`, 'true');

        // Handle custom validation if present
        if (exercise.validation) {
          const result = exercise.validation(code);
          if (result.message) {
            setValidationMessage(result.message);
          }
        }

        onComplete?.(exercise.id, timeSpent);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while running your code.');
    } finally {
      setIsRunning(false);
    }
  }, [code, exercise, runPythonCode, onComplete, isCompleted]);

  const handleReset = useCallback(() => {
    setCode(exercise.starterCode);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}-code`, exercise.starterCode);

    // Reset other state but keep completion/timer if we just want to reset code?
    // Usually reset matches "Start Over", so typically we might clear completion too, 
    // but for now let's just reset the code and ephemeral results.
    // If user wants to fully restart, they might need a harder reset.
    // For safety, let's strictly reset code and results, but NOT completion status 
    // if they already finished it, unless we want to force them to re-solve.
    // Assuming "Reset Code" just resets the editor content.

    setResults([]);
    setLogs(null);
    setError(null);
  }, [exercise.starterCode, STORAGE_KEY_PREFIX]);


  const passedCount = results.filter(r => r.passed).length;
  const totalTests = results.length;

  return (
    <div className={`my-6 rounded-lg border-2 overflow-hidden ${isCompleted
      ? 'border-green-400 bg-green-50/30'
      : 'border-slate-300 bg-slate-50/50'
      }`}>
      {/* Editor */}
      <div className="border-b border-slate-200">
        <CodeEditorCore
          code={code}
          language="python"
          readOnly={false}
          onChange={handleCodeChange}
          height={height}
        />
      </div>

      {/* Controls bar */}
      <div className="px-3 py-2 bg-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isRunning
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? 'Running...' : 'Run Tests'}
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm text-slate-600 hover:bg-slate-200 transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Show Solution button */}
          {exercise.solution && (
            <button
              onClick={() => handleCodeChange(exercise.solution!)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
              title="Show Solution"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Solution</span>
            </button>
          )}

          {/* Timer Display */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium text-slate-600 bg-slate-200/50 rounded-md border border-slate-200">
            <Clock className={`w-3.5 h-3.5 ${isTimerActive ? 'text-blue-500 animate-pulse' : 'text-slate-500'}`} />
            <span className="font-mono tabular-nums">{formatTime(timeSpent)}</span>
          </div>


        </div>

        {/* Results summary */}
        <div className="flex items-center gap-2">
          {results.length > 0 && (
            <div className={`flex items-center gap-1.5 text-sm font-medium ${passedCount === totalTests ? 'text-green-600' : 'text-slate-600'
              }`}>
              {passedCount === totalTests ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              {passedCount}/{totalTests} tests
            </div>
          )}
          {isCompleted && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              Complete!
            </span>
          )}
        </div>
      </div>


      {/* Error display */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Logs / Print Output */}
      {logs && (
        <pre className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-sm font-mono text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
          <div className="text-xs uppercase tracking-wide text-slate-500 mb-1 font-sans">Print Output</div>
          {logs}
        </pre>
      )}

      {/* Test results (collapsed by default, show on failure) */}
      {results.length > 0 && passedCount < totalTests && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-sm">
          <div className="space-y-1">
            {results.filter(r => !r.passed).slice(0, 2).map((result, idx) => (
              <div key={idx} className="text-red-700">
                <span className="font-medium">Test {result.test}:</span>{' '}
                {result.error ? (
                  result.error
                ) : (
                  <>
                    Input: <code className="bg-slate-200 px-1 rounded">{result.input}</code>,
                    Expected: <code className="bg-slate-200 px-1 rounded">{JSON.stringify(result.expected)}</code>,
                    Got: <code className="bg-slate-200 px-1 rounded">{JSON.stringify(result.result)}</code>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success message or custom validation message */}
      {isCompleted && (exercise.successMessage || validationMessage) && (
        <div className="px-4 py-2 bg-green-50 border-t border-green-200 text-sm text-green-700">
          {validationMessage || exercise.successMessage}
        </div>
      )}
    </div>
  );
};

export default InlineMiniEditor;
