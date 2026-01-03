import React from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { ComplexityFeedback } from './ComplexitySelector';

interface TestResult {
  passed: boolean;
  input?: any;
  expected?: any;
  result?: any;
  error?: string;
}

interface TestResultsPanelProps {
  isRunning: boolean;
  isSuccess: boolean | null;
  error: string;
  output: string;
  testResults: TestResult[] | null;
  complexityFeedback: ComplexityFeedback | null;
  timeComplexity: string;
  spaceComplexity: string;
  requireComplexity: boolean;
  hasNext: boolean;
  onNext?: () => void;
  onClose: () => void;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({
  isRunning,
  isSuccess,
  error,
  output,
  testResults,
  complexityFeedback,
  timeComplexity,
  spaceComplexity,
  requireComplexity,
  hasNext,
  onNext,
  onClose,
}) => {
  return (
    <div className="flex-shrink-0 border-t-2 border-slate-700 bg-slate-950 flex flex-col" style={{ height: '40%', minHeight: '200px', maxHeight: '400px' }}>
      {/* Header with tabs */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 text-sm font-medium text-white bg-slate-800 rounded">
            Test Result
          </button>
          {requireComplexity && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              {complexityFeedback?.timeCorrect ? (
                <span className="text-green-400">✓ Time: {timeComplexity}</span>
              ) : complexityFeedback && (
                <span className="text-red-400">✗ Time: {timeComplexity} (Expected: {complexityFeedback.timeExpected})</span>
              )}
              {complexityFeedback?.spaceCorrect ? (
                <span className="text-green-400">✓ Space: {spaceComplexity}</span>
              ) : complexityFeedback && (
                <span className="text-red-400">✗ Space: {spaceComplexity} (Expected: {complexityFeedback.spaceExpected})</span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {isRunning && (
          <div className="flex items-center justify-center h-full">
            <div className="text-blue-400">Running tests...</div>
          </div>
        )}

        {!isRunning && error && (
          <div className="bg-red-950 border border-red-800 rounded p-4">
            <div className="text-red-400 font-mono text-sm whitespace-pre-wrap">
              <span className="font-bold">Error:</span> {error}
            </div>
          </div>
        )}

        {!isRunning && !error && output && (
          <div>
            {/* Status Badge */}
            <div className="mb-4">
              {isSuccess ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-950 border border-green-800 rounded">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-400 font-semibold">Accepted</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-950 border border-red-800 rounded">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-400 font-semibold">Wrong Answer</span>
                </div>
              )}
            </div>

            {/* Test Results */}
            {testResults && testResults.length > 0 ? (
              <div className="space-y-2">
                {testResults.map((result, idx) => (
                  <div key={idx} className={`p-3 rounded border ${result.passed ? 'bg-green-950/30 border-green-900' : 'bg-red-950/30 border-red-900'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                        Test Case {idx + 1}
                      </span>
                      {result.passed ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    {!result.passed && (
                      <div className="text-xs text-slate-300 mt-2 space-y-1 font-mono">
                        {result.input && <div><span className="text-slate-500">Input:</span> {JSON.stringify(result.input)}</div>}
                        {result.expected && <div><span className="text-slate-500">Expected:</span> {JSON.stringify(result.expected)}</div>}
                        {result.result && <div><span className="text-slate-500">Actual:</span> {JSON.stringify(result.result)}</div>}
                        {result.error && <div className="text-red-400"><span className="text-red-500">Error:</span> {result.error}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                <div className={`whitespace-pre-wrap ${isSuccess ? 'text-green-400' : 'text-slate-300'}`}>
                  {output}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Next Problem Button - FIXED AT BOTTOM - shows when success and has next */}
      {isSuccess && hasNext && onNext && (
        <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-900">
          <Button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
          >
            Continue to Next Problem <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

