import React, { useState } from 'react';
import { CodeChallenge, CodeSubmission, TestResult } from '../../types/codeChallenge';
import { runCodeTests } from '../../services/testRunner';

interface CodeChallengePanelProps {
  challenge: CodeChallenge;
  onClose: () => void;
}

export function CodeChallengePanel({ challenge, onClose }: CodeChallengePanelProps) {
  const [code, setCode] = useState(challenge.starterCode);
  const [submission, setSubmission] = useState<CodeSubmission | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'tests' | 'explanation'>('editor');

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const result = await runCodeTests(code, challenge);
      setSubmission(result);
      setActiveTab('tests');
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    setCode(challenge.referenceSolution);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const passedTests = submission?.results.filter(r => r.passed).length || 0;
  const totalTests = submission?.results.length || challenge.testCases.length;
  const allPassed = submission?.overallStatus === 'passed';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{challenge.title}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-line">{challenge.description}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('editor')}
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'editor'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              💻 Code Editor
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'tests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🧪 Test Results {submission && `(${passedTests}/${totalTests})`}
            </button>
            <button
              onClick={() => setActiveTab('explanation')}
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'explanation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📚 Explanation
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          {activeTab === 'editor' && (
            <div className="h-full flex flex-col">
              {/* Simple textarea editor (replace with Monaco in production) */}
              <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
                  spellCheck={false}
                  placeholder="Write your code here..."
                />
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="h-full overflow-y-auto">
              {!submission ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-lg font-medium">No test results yet</p>
                  <p className="text-sm">Click "Run Tests" to execute your code</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Overall Status */}
                  <div className={`p-4 rounded-lg border-2 ${
                    allPassed
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{allPassed ? '✅' : '❌'}</span>
                        <div>
                          <div className="font-semibold text-lg">
                            {allPassed ? 'All Tests Passed!' : 'Some Tests Failed'}
                          </div>
                          <div className="text-sm text-gray-700">
                            {passedTests} / {totalTests} test cases passed
                          </div>
                        </div>
                      </div>
                      {submission.performanceMetrics && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-700">Performance Score</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {submission.performanceMetrics.performanceScore}/100
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Individual Test Results */}
                  {submission.results.map((result) => (
                    <div
                      key={result.testCaseId}
                      className={`p-4 rounded-lg border ${
                        result.passed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{result.passed ? '✅' : '❌'}</span>
                            <span className="font-semibold text-gray-900">{result.testCaseName}</span>
                            {result.executionTimeMs && (
                              <span className="text-xs text-gray-500">
                                ({result.executionTimeMs.toFixed(2)}ms)
                              </span>
                            )}
                          </div>
                          {!result.passed && (
                            <div className="mt-2 space-y-1">
                              {result.error && (
                                <div className="text-sm text-red-700">
                                  <span className="font-medium">Error:</span> {result.error}
                                </div>
                              )}
                              {result.expectedOutput !== undefined && (
                                <>
                                  <div className="text-sm">
                                    <span className="font-medium text-gray-700">Expected:</span>{' '}
                                    <code className="bg-white px-2 py-1 rounded">
                                      {JSON.stringify(result.expectedOutput)}
                                    </code>
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-medium text-gray-700">Got:</span>{' '}
                                    <code className="bg-white px-2 py-1 rounded">
                                      {JSON.stringify(result.actualOutput)}
                                    </code>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Performance Metrics */}
                  {submission.performanceMetrics && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3">⚡ Performance Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-600">Avg Execution Time</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {submission.performanceMetrics.avgExecutionTimeMs.toFixed(2)}ms
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Throughput</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {submission.performanceMetrics.throughputPerSec.toLocaleString()} ops/sec
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Max Time</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {submission.performanceMetrics.maxExecutionTimeMs.toFixed(2)}ms
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Memory Used</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {submission.performanceMetrics.memoryUsedMB.toFixed(2)}MB
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'explanation' && (
            <div className="h-full overflow-y-auto space-y-6">
              {/* Solution Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">💡 Optimal Approach</h3>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line text-gray-800">
                    {challenge.solutionExplanation}
                  </div>
                </div>
              </div>

              {/* Interview Tips */}
              {challenge.interviewTips && challenge.interviewTips.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">🎯 Interview Tips</h3>
                  <ul className="space-y-2">
                    {challenge.interviewTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-600 font-bold">→</span>
                        <span className="text-gray-800">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reference Solution */}
              {showSolution && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3">✨ Reference Solution</h3>
                  <pre className="bg-white p-4 rounded border border-gray-300 overflow-x-auto">
                    <code className="text-sm">{challenge.referenceSolution}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <div className="flex gap-3">
            {!showSolution && (
              <button
                onClick={handleShowSolution}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                💡 Show Solution
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleRunTests}
              disabled={isRunning}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  ▶️ Run Tests
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
