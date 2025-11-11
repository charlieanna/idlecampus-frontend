import { Challenge, TestResult, Solution } from '../../types/testCase';
import { useState } from 'react';

interface ChallengeInfoPanelProps {
  challenge: Challenge | null;
  testResults: TestResult[] | null;
  isRunning: boolean;
  onRunTests: () => void;
  onLoadSolution: (solution: Solution, testCaseIndex: number) => void;
}

export function ChallengeInfoPanel({
  challenge,
  testResults,
  isRunning,
  onRunTests,
  onLoadSolution,
}: ChallengeInfoPanelProps) {
  const [expandedSolution, setExpandedSolution] = useState<number | null>(null);

  if (!challenge) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <p className="text-gray-500">Select a challenge to begin</p>
      </div>
    );
  }

  const passedCount = testResults?.filter((r) => r.passed).length || 0;
  const totalCount = testResults?.length || challenge.testCases.length;

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Challenge Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {challenge.title}
        </h2>
        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {challenge.difficulty}
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
            {challenge.description}
          </p>
        </div>

        {/* Functional Requirements */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            📋 Functional Requirements
          </h3>
          <ul className="space-y-1">
            {challenge.requirements.functional.map((req, idx) => (
              <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Non-Functional Requirements */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            ⚡ Non-Functional Requirements
          </h3>
          <div className="space-y-2">
            <div className="bg-blue-50 rounded px-3 py-2">
              <div className="text-xs font-medium text-blue-900">Traffic</div>
              <div className="text-xs text-blue-700">{challenge.requirements.traffic}</div>
            </div>
            <div className="bg-blue-50 rounded px-3 py-2">
              <div className="text-xs font-medium text-blue-900">Latency</div>
              <div className="text-xs text-blue-700">{challenge.requirements.latency}</div>
            </div>
            <div className="bg-blue-50 rounded px-3 py-2">
              <div className="text-xs font-medium text-blue-900">Availability</div>
              <div className="text-xs text-blue-700">{challenge.requirements.availability}</div>
            </div>
            <div className="bg-blue-50 rounded px-3 py-2">
              <div className="text-xs font-medium text-blue-900">Budget</div>
              <div className="text-xs text-blue-700">{challenge.requirements.budget}</div>
            </div>
          </div>
        </div>

        {/* Test Cases */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            🧪 Test Cases {testResults && `(${passedCount}/${totalCount} passed)`}
          </h3>
          <div className="space-y-3">
            {challenge.testCases.map((testCase, idx) => {
              const result = testResults?.[idx];
              const isPassed = result?.passed;
              const hasRun = result !== undefined;

              return (
                <div
                  key={idx}
                  className={`rounded border p-3 ${
                    !hasRun
                      ? 'border-gray-200 bg-gray-50'
                      : isPassed
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  {/* Test Name */}
                  <div className="flex items-center gap-2 mb-2">
                    {!hasRun ? (
                      <span className="text-gray-400">○</span>
                    ) : isPassed ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-red-600">✗</span>
                    )}
                    <span className="text-xs font-semibold text-gray-900">
                      {testCase.name}
                    </span>
                  </div>

                  {/* Basic Info */}
                  {!hasRun && (
                    <div className="text-xs text-gray-600 ml-5">
                      {testCase.traffic.rps} RPS
                      {testCase.duration && ` · ${testCase.duration}s`}
                    </div>
                  )}

                  {/* Detailed Metrics (when test has run) */}
                  {hasRun && result && (
                    <div className="ml-5 space-y-1.5">
                      {/* Metrics */}
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">p99 Latency:</span>
                          <span className={`font-medium ${isPassed ? 'text-green-700' : 'text-red-700'}`}>
                            {result.metrics.p99Latency.toFixed(1)}ms
                            {testCase.passCriteria.maxP99Latency &&
                              ` (target: ${testCase.passCriteria.maxP99Latency}ms)`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Error Rate:</span>
                          <span className={`font-medium ${isPassed ? 'text-green-700' : 'text-red-700'}`}>
                            {(result.metrics.errorRate * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Cost:</span>
                          <span
                            className={`font-medium ${
                              testCase.passCriteria.maxMonthlyCost &&
                              result.metrics.monthlyCost > testCase.passCriteria.maxMonthlyCost
                                ? 'text-red-700'
                                : 'text-green-700'
                            }`}
                          >
                            ${result.metrics.monthlyCost.toFixed(0)}
                            {testCase.passCriteria.maxMonthlyCost &&
                              ` (budget: $${testCase.passCriteria.maxMonthlyCost})`}
                          </span>
                        </div>
                      </div>

                      {/* Bottlenecks */}
                      {result.bottlenecks.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-300">
                          <p className="text-xs font-medium text-gray-700 mb-1">
                            🔍 Bottlenecks:
                          </p>
                          <div className="space-y-1">
                            {result.bottlenecks.map((bottleneck, i) => (
                              <div
                                key={i}
                                className="text-xs bg-white rounded p-1.5 border border-gray-200"
                              >
                                <div className="font-medium text-gray-900">
                                  {bottleneck.componentId} ({(bottleneck.utilization * 100).toFixed(0)}% utilized)
                                </div>
                                <div className="text-gray-600 mt-0.5">
                                  💡 {bottleneck.recommendation}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show Solution Button */}
                  {testCase.solution && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <button
                        onClick={() => {
                          if (expandedSolution === idx) {
                            setExpandedSolution(null);
                          } else {
                            setExpandedSolution(idx);
                          }
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {expandedSolution === idx ? '▼ Hide Solution' : '▶ Show Solution'}
                      </button>

                      {expandedSolution === idx && (
                        <div className="mt-2 space-y-2">
                          <button
                            onClick={() => onLoadSolution(testCase.solution!, idx)}
                            className="w-full px-3 py-2 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                          >
                            📋 Load This Solution to Canvas
                          </button>
                          <div className="text-xs text-gray-700 bg-blue-50 rounded p-2 whitespace-pre-line">
                            {testCase.solution.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Run Button (Fixed at Bottom) */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onRunTests}
          disabled={isRunning}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
            isRunning
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunning ? '⏳ Running Tests...' : '▶️ Run All Tests'}
        </button>

        {testResults && (
          <div className="mt-2 text-center">
            {passedCount === totalCount ? (
              <span className="text-xs text-green-600 font-medium">
                ✅ All tests passed!
              </span>
            ) : (
              <span className="text-xs text-red-600 font-medium">
                ⚠️ {totalCount - passedCount} test(s) failed
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
