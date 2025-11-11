import React from 'react';
import { TestCase, TestResult } from '../../types/testCase';

interface ProgressiveTestSidebarProps {
  testCases: TestCase[];
  activeTestIndex: number;
  testResults: Map<number, TestResult>;
  onSelectTest: (index: number) => void;
  onRunTest: (index: number) => void;
}

export function ProgressiveTestSidebar({
  testCases,
  activeTestIndex,
  testResults,
  onSelectTest,
  onRunTest,
}: ProgressiveTestSidebarProps) {
  // Determine which tests are unlocked
  const getTestStatus = (index: number): 'locked' | 'unlocked' | 'passed' | 'failed' => {
    if (index === 0) return 'unlocked'; // First test always unlocked

    // Check if previous test passed
    const prevResult = testResults.get(index - 1);
    if (!prevResult) return 'locked';
    if (!prevResult.passed) return 'locked';

    // Previous test passed, this one is unlocked
    const currentResult = testResults.get(index);
    if (!currentResult) return 'unlocked';
    return currentResult.passed ? 'passed' : 'failed';
  };

  return (
    <div className="w-80 bg-gradient-to-b from-blue-50 to-white border-r border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-2">🎮 Learning Path</h2>
        <p className="text-sm text-gray-600">
          Complete each level to unlock the next!
        </p>
      </div>

      {/* Progress Bar */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">Overall Progress</span>
          <span className="text-xs font-semibold text-blue-600">
            {Array.from(testResults.values()).filter(r => r.passed).length}/{testCases.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(Array.from(testResults.values()).filter(r => r.passed).length / testCases.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Test Cases */}
      <div className="p-4 space-y-3">
        {testCases.map((testCase, index) => {
          const status = getTestStatus(index);
          const isActive = index === activeTestIndex;
          const result = testResults.get(index);

          return (
            <button
              key={index}
              onClick={() => status !== 'locked' && onSelectTest(index)}
              disabled={status === 'locked'}
              className={`w-full text-left transition-all duration-200 ${
                status === 'locked'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-102 cursor-pointer'
              }`}
            >
              <div
                className={`p-4 rounded-lg border-2 ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : status === 'passed'
                    ? 'border-green-300 bg-green-50'
                    : status === 'failed'
                    ? 'border-red-300 bg-red-50'
                    : status === 'unlocked'
                    ? 'border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                {/* Header with status icon */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Status Icon */}
                      {status === 'locked' && (
                        <span className="text-lg">🔒</span>
                      )}
                      {status === 'unlocked' && (
                        <span className="text-lg">🎯</span>
                      )}
                      {status === 'passed' && (
                        <span className="text-lg">✅</span>
                      )}
                      {status === 'failed' && (
                        <span className="text-lg">❌</span>
                      )}

                      {/* Level Badge */}
                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-600 text-white">
                        Level {index + 1}
                      </span>
                    </div>

                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                      {testCase.name}
                    </h3>
                  </div>
                </div>

                {/* Test Details (for unlocked/active tests) */}
                {status !== 'locked' && (
                  <div className="mt-3 space-y-2">
                    {/* Traffic Info */}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-medium">Traffic:</span>
                      <span>{testCase.traffic.rps} RPS</span>
                    </div>

                    {/* Pass Criteria */}
                    {testCase.passCriteria.maxP99Latency && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium">Latency:</span>
                        <span>&lt; {testCase.passCriteria.maxP99Latency}ms</span>
                      </div>
                    )}

                    {testCase.passCriteria.maxMonthlyCost && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium">Budget:</span>
                        <span>&lt; ${testCase.passCriteria.maxMonthlyCost}/mo</span>
                      </div>
                    )}

                    {/* Test Result */}
                    {result && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-gray-500">Latency</div>
                            <div className={`font-semibold ${
                              result.metrics.p99Latency <= (testCase.passCriteria.maxP99Latency || Infinity)
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {result.metrics.p99Latency.toFixed(0)}ms
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Cost</div>
                            <div className={`font-semibold ${
                              result.metrics.totalCost <= (testCase.passCriteria.maxMonthlyCost || Infinity)
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              ${result.metrics.totalCost.toFixed(0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    {isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRunTest(index);
                        }}
                        className="mt-3 w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {result ? '🔄 Run Again' : '▶️ Run Test'}
                      </button>
                    )}
                  </div>
                )}

                {/* Locked Message */}
                {status === 'locked' && (
                  <div className="mt-2 text-xs text-gray-500">
                    Complete Level {index} to unlock
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Completion Message */}
      {Array.from(testResults.values()).filter(r => r.passed).length === testCases.length && (
        <div className="p-6 m-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-400 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="font-bold text-green-900 mb-1">All Levels Complete!</h3>
            <p className="text-sm text-green-800">
              You've mastered TinyURL system design!
            </p>
            <button className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
              💻 Try Code Challenges
            </button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="p-6 m-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-sm text-blue-900 mb-2">💡 How It Works</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Drag components from palette</li>
          <li>• Connect them with arrows</li>
          <li>• Configure in right sidebar</li>
          <li>• Run test to see if you pass!</li>
          <li>• Each level adds complexity</li>
        </ul>
      </div>
    </div>
  );
}
