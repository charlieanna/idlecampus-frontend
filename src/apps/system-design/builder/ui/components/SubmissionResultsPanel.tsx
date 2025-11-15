import { TestCase, TestResult } from '../../types/testCase';
import { motion, AnimatePresence } from 'framer-motion';

interface SubmissionResultsPanelProps {
  testCases: TestCase[];
  testResults: Map<number, TestResult>;
  isRunning: boolean;
  currentTestIndex: number;
  onEditDesign: () => void;
  onShowSolution: () => void;
  onTryAgain: () => void;
}

export function SubmissionResultsPanel({
  testCases,
  testResults,
  isRunning,
  currentTestIndex,
  onEditDesign,
  onShowSolution,
  onTryAgain,
}: SubmissionResultsPanelProps) {
  // Calculate overall results
  const totalTests = testCases.length;
  const passedTests = Array.from(testResults.values()).filter(r => r.passed).length;
  const failedTests = Array.from(testResults.values()).filter(r => !r.passed).length;
  const allTestsPassed = passedTests === totalTests;

  // Calculate per-category results
  const functionalTests = testCases.filter(tc => tc.type === 'functional');
  const nonFunctionalTests = testCases.filter(tc => tc.type !== 'functional');

  const functionalPassed = functionalTests.filter((_, idx) => {
    const testIdx = testCases.indexOf(_);
    return testResults.get(testIdx)?.passed;
  }).length;

  const nonFunctionalPassed = nonFunctionalTests.filter((_, idx) => {
    const testIdx = testCases.indexOf(_);
    return testResults.get(testIdx)?.passed;
  }).length;

  // Collect failing requirements for quick FR/NFR summary
  const failingRequirements = testCases
    .map((tc, index) => {
      const result = testResults.get(index);
      return result && !result.passed ? tc.requirement : null;
    })
    .filter((req): req is string => !!req);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">
            {isRunning ? 'Running Tests...' : 'Test Results'}
          </h2>
          {isRunning && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          )}
        </div>

        {!isRunning && (
          <div className="space-y-1">
            <div className="text-sm">
              <span
                className={`font-bold ${
                  allTestsPassed ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {passedTests}/{totalTests} Tests Passed
              </span>
            </div>
            {failingRequirements.length > 0 && (
              <div className="text-xs text-red-600">
                Failing requirements:{' '}
                {Array.from(new Set(failingRequirements)).join(', ')}
              </div>
            )}
            <div className="text-xs space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Functional:</span>
                <span className={functionalPassed === functionalTests.length ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                  {functionalPassed}/{functionalTests.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Non-Functional:</span>
                <span className={nonFunctionalPassed === nonFunctionalTests.length ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                  {nonFunctionalPassed}/{nonFunctionalTests.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Results List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        <AnimatePresence>
          {testCases.map((testCase, index) => {
            const result = testResults.get(index);
            const isCurrentTest = isRunning && currentTestIndex === index;
            const notRunYet = !result && !isCurrentTest;

            // Check if this is the first non-functional test (add separator)
            const isFirstNonFunctional =
              testCase.type !== 'functional' &&
              (index === 0 || testCases[index - 1].type === 'functional');

            return (
              <div key={index}>
                {/* Section Header for Non-Functional Tests */}
                {isFirstNonFunctional && (
                  <div className="pt-2 pb-1 border-t-2 border-gray-300">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Non-Functional Requirements
                    </div>
                  </div>
                )}

                {/* Section Header for Functional Tests (first test) */}
                {index === 0 && testCase.type === 'functional' && (
                  <div className="pb-1">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      Functional Requirements
                    </div>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    result?.passed
                      ? 'bg-green-50 border-green-200'
                      : result && !result.passed
                      ? 'bg-red-50 border-red-200'
                      : isCurrentTest
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {/* Test Header */}
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {result?.passed && <span className="text-lg">✅</span>}
                      {result && !result.passed && <span className="text-lg">❌</span>}
                      {isCurrentTest && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                      {notRunYet && <span className="text-lg text-gray-400">⏹️</span>}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                          {testCase.requirement}
                        </span>
                      </div>
                      <div className="font-semibold text-sm text-gray-900">
                        {testCase.name}
                      </div>

                      {isCurrentTest && (
                        <div className="text-xs text-blue-600 mt-1">Running...</div>
                      )}

                      {notRunYet && (
                        <div className="text-xs text-gray-500 mt-1">Not run yet</div>
                      )}
                    </div>
                  </div>

                {/* Test Result Details */}
                {result && (
                  <div className="ml-6 space-y-2">
                    {/* Metrics */}
                    <div className="text-xs space-y-1">
                      {testCase.passCriteria.maxP99Latency && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">p99 Latency:</span>
                          <span
                            className={
                              result.metrics.p99Latency <= testCase.passCriteria.maxP99Latency
                                ? 'text-green-600 font-medium'
                                : 'text-red-600 font-medium'
                            }
                          >
                            {result.metrics.p99Latency.toFixed(0)}ms
                            <span className="text-gray-500">
                              {' '}
                              (max: {testCase.passCriteria.maxP99Latency}ms)
                            </span>
                          </span>
                        </div>
                      )}

                      {testCase.passCriteria.maxErrorRate !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Error Rate:</span>
                          <span
                            className={
                              result.metrics.errorRate <= testCase.passCriteria.maxErrorRate
                                ? 'text-green-600 font-medium'
                                : 'text-red-600 font-medium'
                            }
                          >
                            {(result.metrics.errorRate * 100).toFixed(1)}%
                            <span className="text-gray-500">
                              {' '}
                              (max: {(testCase.passCriteria.maxErrorRate * 100).toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                      )}

                      {testCase.passCriteria.minAvailability !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Availability:</span>
                          <span
                            className={
                              result.metrics.availability >= testCase.passCriteria.minAvailability
                                ? 'text-green-600 font-medium'
                                : 'text-red-600 font-medium'
                            }
                          >
                            {(result.metrics.availability * 100).toFixed(1)}%
                            <span className="text-gray-500">
                              {' '}
                              (min: {(testCase.passCriteria.minAvailability * 100).toFixed(1)}%)
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Actions Footer */}
      {!isRunning && (
        <div className="p-6 border-t border-gray-200 space-y-3">
          {allTestsPassed ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm font-semibold text-green-800 mb-1">
                🎉 All Tests Passed!
              </div>
              <div className="text-xs text-green-700">
                Your design meets all requirements. Great job!
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm font-semibold text-yellow-800 mb-1">
                ⚠️ Some Tests Failed
              </div>
              <div className="text-xs text-yellow-700">
                Review the issues above and improve your design.
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={onEditDesign}
              className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded transition-colors"
            >
              ✏️ Edit Design
            </button>
            <button
              onClick={onShowSolution}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded transition-colors"
            >
              💡 Solution
            </button>
          </div>

          {!allTestsPassed && (
            <button
              onClick={onTryAgain}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
            >
              🔄 Submit Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
