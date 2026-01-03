import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Upload,
  ChevronDown,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DSAProblem, TestResult, CodeSubmission } from '../../types/dsa-course';

interface PythonEditorLeetCodeProps {
  initialCode?: string;
  onRun?: (submission: CodeSubmission) => Promise<CodeSubmission | void>;
  problem?: DSAProblem | null;
  onHintUsed?: () => void;
}

export function PythonEditorLeetCode({
  initialCode = "# Write your code here\n\n",
  onRun,
  problem,
  onHintUsed,
}: PythonEditorLeetCodeProps) {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);

      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Execute code via parent component
  const runCode = async () => {
    if (!onRun) return;

    setIsRunning(true);
    setShowResults(true);

    try {
      // Create initial submission object
      const timestamp = new Date();

      // Call parent handler which should return the results
      // We expect onRun to return the submission object with results
      // But the current interface is void, so we need to update it or expect the parent to update some state
      // However, looking at the plan, we want onRun to return the results.
      // Let's assume onRun returns Promise<CodeSubmission | void>

      // For now, let's pass the code to the parent and let it handle execution and return the full submission
      // We'll create a temporary submission object to pass to onRun
      const tempSubmission: CodeSubmission = {
        code,
        timestamp,
        testResults: [],
        passed: false,
        executionTime: 0
      };

      // We need to cast onRun to any to await it if the type definition isn't updated yet in this file
      // But better to update the interface first. 
      // Let's update the interface in the same file edit if possible, or just assume the parent handles it.
      // Actually, the plan said "Update onRun prop signature".

      const result = await onRun(tempSubmission);

      // If the parent returns a submission with results, use it
      if (result && (result as any).testResults) {
        const submission = result as CodeSubmission;
        setTestResults(submission.testResults);

        // Update submission history if needed (handled by parent usually)
      }
    } catch (error) {
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setTestResults([]);
    setShowResults(false);
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(r => r.passed);
  const passedCount = testResults.filter(r => r.passed).length;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">
      {/* Editor Header */}
      <div className="border-b bg-white px-3 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <button className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 hover:bg-slate-50 rounded flex items-center gap-1">
            <span>Python3</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetCode}
            className="h-7 text-xs text-slate-600 hover:text-slate-900 px-2"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Code Editor - Fixed Height */}
      <div className="relative bg-slate-900 overflow-hidden" style={{ height: showResults ? '350px' : '500px' }}>
        <textarea
          ref={editorRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-full p-4 pl-14 font-mono text-sm bg-slate-900 text-slate-100 resize-none focus:outline-none overflow-auto"
          spellCheck={false}
          style={{ lineHeight: '1.6', tabSize: 4 }}
        />

        {/* Line numbers */}
        <div className="absolute left-0 top-0 w-12 h-full bg-slate-800 text-slate-500 text-sm font-mono p-4 select-none pointer-events-none overflow-hidden">
          {code.split('\n').map((_, i) => (
            <div key={i} style={{ lineHeight: '1.6' }}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar - ALWAYS VISIBLE */}
      <div className="border-t bg-white px-3 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Button
            onClick={runCode}
            disabled={isRunning}
            variant="outline"
            size="sm"
            className="h-8 text-sm font-medium px-4"
          >
            {isRunning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Clock className="w-4 h-4 mr-1.5" />
                </motion.div>
                Running
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1.5 fill-current" />
                Run Code
              </>
            )}
          </Button>
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-sm font-medium px-4"
            size="sm"
          >
            Submit
          </Button>
        </div>

        {testResults.length > 0 && (
          <span className={`text-sm font-medium ${allTestsPassed ? 'text-emerald-600' : 'text-slate-700'
            }`}>
            {allTestsPassed ? '✓ Accepted' : `${passedCount}/${testResults.length} test cases passed`}
          </span>
        )}
      </div>

      {/* Test Results Console */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 250 }}
            exit={{ height: 0 }}
            className="border-t bg-white overflow-hidden flex-shrink-0"
          >
            <div className="px-3 py-2 border-b bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="text-xs font-medium text-slate-900 pb-1 border-b-2 border-slate-900">
                  Test Cases
                </button>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <span className="text-lg leading-none">×</span>
              </button>
            </div>

            <div className="overflow-auto" style={{ height: '200px' }}>
              {isRunning ? (
                <div className="p-6 text-center text-slate-600">
                  <Clock className="w-5 h-5 mx-auto mb-2 animate-spin" />
                  <p className="text-xs">Running tests...</p>
                </div>
              ) : testResults.length > 0 ? (
                <div className="p-3 space-y-3">
                  {allTestsPassed ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="text-emerald-700 font-medium text-sm">
                          Accepted
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded p-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-700">
                          <span>Runtime</span>
                          <span className="font-medium">{testResults.reduce((sum, r) => sum + (r.executionTime || 0), 0)} ms</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                          <span>Test Cases</span>
                          <span className="font-medium">{testResults.length}/{testResults.length}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-rose-600" />
                        <span className="text-rose-700 font-medium text-sm">
                          Wrong Answer
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mb-2">
                        {passedCount} / {testResults.length} test cases passed
                      </div>

                      {/* Show first failed test case */}
                      {testResults.find(r => !r.passed) && (
                        <div className="bg-slate-50 rounded p-3 space-y-2 text-xs">
                          <div className="text-slate-700">
                            <div className="text-slate-500 mb-1">Input</div>
                            <div className="font-mono bg-white rounded px-2 py-1.5 border">
                              {typeof testResults.find(r => !r.passed)!.input === 'string'
                                ? testResults.find(r => !r.passed)!.input
                                : JSON.stringify(testResults.find(r => !r.passed)!.input)}
                            </div>
                          </div>
                          <div className="text-slate-700">
                            <div className="text-slate-500 mb-1">Expected</div>
                            <div className="font-mono bg-white rounded px-2 py-1.5 border">
                              {typeof testResults.find(r => !r.passed)!.expectedOutput === 'string'
                                ? testResults.find(r => !r.passed)!.expectedOutput
                                : JSON.stringify(testResults.find(r => !r.passed)!.expectedOutput)}
                            </div>
                          </div>
                          <div className="text-slate-700">
                            <div className="text-slate-500 mb-1">Output</div>
                            <div className="font-mono bg-white rounded px-2 py-1.5 border text-rose-700">
                              {typeof testResults.find(r => !r.passed)!.actualOutput === 'string'
                                ? testResults.find(r => !r.passed)!.actualOutput
                                : JSON.stringify(testResults.find(r => !r.passed)!.actualOutput)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs">
                  You must run your code first
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
