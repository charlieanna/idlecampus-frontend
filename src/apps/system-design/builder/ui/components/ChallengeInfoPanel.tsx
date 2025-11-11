import { Challenge, TestResult } from '../../types/testCase';

interface ChallengeInfoPanelProps {
  challenge: Challenge | null;
  testResults: TestResult[] | null;
  isRunning: boolean;
  onRunTests: () => void;
}

export function ChallengeInfoPanel({
  challenge,
  testResults,
  isRunning,
  onRunTests,
}: ChallengeInfoPanelProps) {
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
            🧪 Test Cases ({passedCount}/{totalCount} passed)
          </h3>
          <div className="space-y-2">
            {challenge.testCases.map((testCase, idx) => {
              const result = testResults?.[idx];
              const isPassed = result?.passed;
              const hasRun = result !== undefined;

              return (
                <div
                  key={idx}
                  className={`rounded border p-2 ${
                    !hasRun
                      ? 'border-gray-200 bg-gray-50'
                      : isPassed
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {!hasRun ? (
                      <span className="text-gray-400">○</span>
                    ) : isPassed ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-red-600">✗</span>
                    )}
                    <span className="text-xs font-medium text-gray-900">
                      {testCase.name}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 ml-5">
                    {testCase.traffic.rps} RPS
                    {testCase.duration && ` · ${testCase.duration}s`}
                  </div>
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
