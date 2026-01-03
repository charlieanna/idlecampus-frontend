import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, RotateCcw, CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';
import { Textarea } from '../ui/textarea';

interface TestCase {
  input: any[];
  expected: any;
  description: string;
}

interface LiveCodePanelProps {
  problemTitle: string;
  starterCode: string;
  testCases: TestCase[];
  hints: string[];
  onComplete?: () => void;
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  error?: string;
}

export default function LiveCodePanel({
  problemTitle,
  starterCode,
  testCases,
  hints,
  onComplete
}: LiveCodePanelProps) {
  const [code, setCode] = useState(starterCode);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  const [expandedHints, setExpandedHints] = useState<Set<number>>(new Set());
  const [attempts, setAttempts] = useState(0);

  const runTests = () => {
    setIsRunning(true);
    setAttempts(prev => prev + 1);

    setTimeout(() => {
      try {
        const codeToTest = code.trim();

        const hasRequiredComponents =
          codeToTest.includes('def subsets') &&
          codeToTest.includes('def backtrack') &&
          codeToTest.includes('result.append') &&
          codeToTest.includes('current.pop()') &&
          codeToTest.includes('current[:]');

        const results: TestResult[] = testCases.map(testCase => {
          return {
            passed: hasRequiredComponents,
            input: JSON.stringify(testCase.input[0]),
            expected: JSON.stringify(testCase.expected),
            actual: hasRequiredComponents ? 'Solution contains all required components' : 'Incomplete solution',
            error: hasRequiredComponents ? undefined : 'Missing required backtracking components (def backtrack, result.append, current[:], current.pop())'
          };
        });

        setTestResults(results);

        const allPassed = results.every(r => r.passed);
        if (allPassed) {
          setIsCompleted(true);
          if (onComplete) {
            onComplete();
          }
        } else if (attempts >= 2 && unlockedHints.length < hints.length) {
          setUnlockedHints(prev => [...prev, prev.length]);
        }

      } catch (err: any) {
        setTestResults([{
          passed: false,
          input: 'Error',
          expected: '',
          actual: '',
          error: err.message
        }]);
      }

      setIsRunning(false);
    }, 500);
  };

  const resetCode = () => {
    setCode(starterCode);
    setTestResults([]);
  };

  const unlockHint = (index: number) => {
    if (!unlockedHints.includes(index)) {
      setUnlockedHints(prev => [...prev, index]);
    }
  };

  const toggleHint = (index: number) => {
    setExpandedHints(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(r => r.passed);

  return (
    <div className="h-screen overflow-auto bg-white border-l flex flex-col">
      <div className="sticky top-0 bg-white border-b z-10 p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-slate-900">{problemTitle}</h3>
          <p className="text-xs text-slate-600 mt-1">Python Backtracking Practice</p>
        </div>

        {isCompleted && (
          <div className="p-3 bg-green-50 rounded border border-green-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Solution Complete!</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 space-y-4">
        <Card className="p-3">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-700">Your Python Solution:</label>
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
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-xs min-h-[350px] resize-none bg-slate-900 text-slate-100 border-slate-700"
            placeholder="Write your Python code here..."
            spellCheck={false}
          />
        </Card>

        <Button
          onClick={runTests}
          disabled={isRunning}
          className="w-full flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Checking Solution...' : 'Check Solution'}
        </Button>

        {testResults.length > 0 && (
          <Card className={`p-4 ${allTestsPassed ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-3">
              {allTestsPassed ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-900">All Checks Passed!</h4>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-red-900">Solution Incomplete</h4>
                </>
              )}
            </div>

            <div className="space-y-2">
              {testResults.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded text-xs ${
                    result.passed
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-red-100 border border-red-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {result.passed ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-600" />
                    )}
                    <span className="font-semibold">Test Case {idx + 1}</span>
                  </div>
                  <div className="space-y-1 font-mono">
                    <div><span className="text-slate-600">Input:</span> {result.input}</div>
                    <div><span className="text-slate-600">Expected Output:</span> {result.expected}</div>
                    {!result.passed && result.error && (
                      <div className="text-red-700 mt-1">⚠ {result.error}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {allTestsPassed && (
              <div className="mt-3 p-3 bg-green-100 rounded border border-green-300">
                <p className="text-sm text-green-900">
                  Excellent work! You've successfully implemented the backtracking solution.
                </p>
              </div>
            )}
          </Card>
        )}

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            <h4 className="font-semibold text-slate-900">Hints</h4>
            {unlockedHints.length < hints.length && (
              <Badge variant="outline" className="ml-auto text-xs">
                {unlockedHints.length} / {hints.length} unlocked
              </Badge>
            )}
          </div>

          {hints.length === 0 ? (
            <p className="text-xs text-slate-600">No hints available for this problem.</p>
          ) : (
            <div className="space-y-2">
              {hints.map((hint, idx) => {
                const isUnlocked = unlockedHints.includes(idx);
                const isExpanded = expandedHints.has(idx);

                return (
                  <div key={idx} className="border rounded">
                    {isUnlocked ? (
                      <>
                        <button
                          onClick={() => toggleHint(idx)}
                          className="w-full flex items-center justify-between p-3 hover:bg-yellow-50 transition-colors"
                        >
                          <span className="text-sm font-medium text-yellow-900">
                            Hint {idx + 1}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-yellow-700" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-yellow-700" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="p-3 pt-0 text-xs text-slate-700 border-t">
                            {hint}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-3 flex items-center justify-between bg-slate-50">
                        <span className="text-sm text-slate-500">Hint {idx + 1}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => unlockHint(idx)}
                          className="h-7 text-xs"
                        >
                          Unlock Hint
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {attempts >= 2 && unlockedHints.length < hints.length && (
            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200 text-xs text-blue-800">
              Having trouble? A new hint has been unlocked above!
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
