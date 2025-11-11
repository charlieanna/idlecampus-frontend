import { TestResult } from '../../types/testCase';
import { Challenge } from '../../types/testCase';

interface ResultsPanelProps {
  results: TestResult[];
  challenge: Challenge | null;
  onClose: () => void;
}

export function ResultsPanel({ results, challenge, onClose }: ResultsPanelProps) {
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Simulation Results
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close results and edit components"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              allPassed
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {allPassed ? '✅ All Passed' : `⚠️ ${passedCount}/${totalCount} Passed`}
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {results.map((result, index) => {
          const testCase = challenge?.testCases[index];
          return (
            <div
              key={index}
              className={`border rounded-lg p-4 ${
                result.passed
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              {/* Test Name */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm text-gray-900">
                  {result.passed ? '✅' : '❌'} {testCase?.name}
                </h3>
              </div>

              {/* Metrics */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">p99 Latency:</span>
                  <span
                    className={`font-medium ${
                      result.passed ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {result.metrics.p99Latency.toFixed(1)}ms
                    {testCase?.passCriteria.maxP99Latency &&
                      ` (target: ${testCase.passCriteria.maxP99Latency}ms)`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Error Rate:</span>
                  <span
                    className={`font-medium ${
                      result.passed ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {(result.metrics.errorRate * 100).toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Cost:</span>
                  <span
                    className={`font-medium ${
                      testCase?.passCriteria.maxMonthlyCost &&
                      result.metrics.monthlyCost >
                        testCase.passCriteria.maxMonthlyCost
                        ? 'text-red-700'
                        : 'text-green-700'
                    }`}
                  >
                    ${result.metrics.monthlyCost.toFixed(0)}
                    {testCase?.passCriteria.maxMonthlyCost &&
                      ` (budget: $${testCase.passCriteria.maxMonthlyCost})`}
                  </span>
                </div>

                {result.metrics.availability < 1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-medium text-red-700">
                      {(result.metrics.availability * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Bottlenecks */}
              {result.bottlenecks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    🔍 Bottlenecks:
                  </p>
                  <div className="space-y-2">
                    {result.bottlenecks.map((bottleneck, i) => (
                      <div
                        key={i}
                        className="text-xs bg-white rounded p-2 border border-gray-200"
                      >
                        <div className="font-medium text-gray-900">
                          {bottleneck.componentId} (
                          {(bottleneck.utilization * 100).toFixed(0)}% utilized)
                        </div>
                        <div className="text-gray-600 mt-1">
                          💡 {bottleneck.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation Preview */}
              {!result.passed && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <details className="text-xs">
                    <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                      View Details
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap text-gray-600 bg-white p-2 rounded border border-gray-200">
                      {result.explanation}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {!allPassed && (
        <div className="p-4 bg-yellow-50 border-t border-yellow-200">
          <p className="text-sm text-yellow-800">
            💡 <strong>Tip:</strong> Review the bottlenecks and adjust your
            design. Try increasing capacity, adding caching, or enabling
            replication.
          </p>
        </div>
      )}

      {allPassed && (
        <div className="p-4 bg-green-50 border-t border-green-200">
          <p className="text-sm text-green-800">
            🎉 <strong>Congratulations!</strong> Your design passed all test
            cases! Try optimizing for cost or handling higher traffic.
          </p>
        </div>
      )}
    </div>
  );
}
