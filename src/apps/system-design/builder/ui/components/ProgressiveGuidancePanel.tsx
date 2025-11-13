import React, { useState } from 'react';
import { TestCase, TestResult } from '../../types/testCase';

interface ProgressiveGuidancePanelProps {
  testCase: TestCase;
  testResult?: TestResult & { architectureFeedback?: string[]; detailedAnalysis?: any };
  currentComponentCount: number;
  onShowSolution: () => void;
  onShowDetailedAnalysis?: () => void;
}

export function ProgressiveGuidancePanel({
  testCase,
  testResult,
  currentComponentCount,
  onShowSolution,
  onShowDetailedAnalysis,
}: ProgressiveGuidancePanelProps) {
  const [showHint, setShowHint] = useState(false);

  // Extract level number from test name
  const levelMatch = testCase.name.match(/Level (\d+)/);
  const level = levelMatch ? parseInt(levelMatch[1]) : 0;

  // Level-specific guidance
  const levelGuidance: Record<number, {
    objective: string;
    newConcept: string;
    componentsNeeded: number;
    quickTip: string;
  }> = {
    1: {
      objective: 'Connect 3 components to make a working system',
      newConcept: 'Basic client-server-database flow',
      componentsNeeded: 3,
      quickTip: 'Just connect them: Client → App Server → PostgreSQL',
    },
    2: {
      objective: 'Handle 100x more traffic',
      newConcept: 'Capacity planning',
      componentsNeeded: 3,
      quickTip: 'Same components, but check database capacity!',
    },
    3: {
      objective: 'Scale to 1000 RPS efficiently',
      newConcept: 'Caching to reduce database load',
      componentsNeeded: 4,
      quickTip: 'Add Redis between App Server and Database',
    },
    4: {
      objective: 'Survive server failures',
      newConcept: 'High availability through redundancy',
      componentsNeeded: 5,
      quickTip: 'Add Load Balancer, multiple app servers, DB replication',
    },
    5: {
      objective: 'Optimize cost while meeting all requirements',
      newConcept: 'Cost vs performance tradeoffs',
      componentsNeeded: 5,
      quickTip: 'Remove unnecessary redundancy to save money',
    },
  };

  const guidance = levelGuidance[level] || levelGuidance[1];

  return (
    <div className="bg-white overflow-y-auto">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
            LEVEL {level}
          </span>
          {testResult?.passed && (
            <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">
              ✓ PASSED
            </span>
          )}
        </div>
        <h2 className="text-lg font-bold text-gray-900">
          {testCase.name.replace(/🎯\s*Level \d+:\s*/, '')}
        </h2>
      </div>

      {/* Learning Objective */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-700 mb-1">🎯 Learning Objective</h3>
        <p className="text-xs text-gray-900 font-medium">{guidance.objective}</p>
      </div>

      {/* What's New */}
      <div className="p-3 border-b border-gray-200 bg-yellow-50">
        <h3 className="text-xs font-semibold text-yellow-900 mb-1">✨ New Concept</h3>
        <p className="text-xs text-yellow-800">{guidance.newConcept}</p>
      </div>

      {/* Requirements Card */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">📋 Requirements</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Traffic:</span>
            <span className="font-semibold text-gray-900">{testCase.traffic.rps} RPS</span>
          </div>

          {testCase.passCriteria.maxP99Latency && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Max Latency:</span>
              <span className={`font-semibold ${
                testResult && testResult.metrics && (testResult.metrics.p99Latency ?? 0) <= testCase.passCriteria.maxP99Latency
                  ? 'text-green-600'
                  : 'text-gray-900'
              }`}>
                &lt; {testCase.passCriteria.maxP99Latency}ms
                {testResult && testResult.metrics && testResult.metrics.p99Latency != null && (
                  <span className="ml-2 text-xs">
                    (yours: {(testResult.metrics.p99Latency ?? 0).toFixed(0)}ms)
                  </span>
                )}
              </span>
            </div>
          )}

          {testCase.passCriteria.maxMonthlyCost && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Max Cost:</span>
              <span className={`font-semibold ${
                testResult && testResult.metrics && (testResult.metrics.monthlyCost ?? 0) <= testCase.passCriteria.maxMonthlyCost
                  ? 'text-green-600'
                  : 'text-gray-900'
              }`}>
                &lt; ${testCase.passCriteria.maxMonthlyCost}/mo
                {testResult && testResult.metrics && testResult.metrics.monthlyCost != null && (
                  <span className="ml-2 text-xs">
                    (yours: ${(testResult.metrics.monthlyCost ?? 0).toFixed(0)})
                  </span>
                )}
              </span>
            </div>
          )}

          {testCase.passCriteria.minAvailability && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Min Availability:</span>
              <span className="font-semibold text-gray-900">
                &gt; {(testCase.passCriteria.minAvailability * 100).toFixed(1)}%
              </span>
            </div>
          )}

          {testCase.failureInjection && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-xs font-semibold text-orange-900 mb-1">⚠️ Failure Scenario</div>
              <div className="text-xs text-orange-800">
                {testCase.failureInjection.type === 'db_crash' && 'Database will crash during test'}
                {testCase.failureInjection.type === 'cache_flush' && 'Cache will be flushed during test'}
                {testCase.failureInjection.type === 'network_partition' && 'Network partition will occur'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Tip */}
      <div className="p-3 border-b border-gray-200 bg-blue-50">
        <h3 className="text-xs font-semibold text-blue-900 mb-1">💡 Quick Tip</h3>
        <p className="text-xs text-blue-800">{guidance.quickTip}</p>
      </div>

      {/* Progress Indicator */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">🔧 Your Progress</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Components Added:</span>
            <span className={`font-semibold ${
              currentComponentCount >= guidance.componentsNeeded
                ? 'text-green-600'
                : 'text-orange-600'
            }`}>
              {currentComponentCount} / {guidance.componentsNeeded}
            </span>
          </div>

          {currentComponentCount < guidance.componentsNeeded && (
            <div className="text-xs text-orange-600">
              Add {guidance.componentsNeeded - currentComponentCount} more component(s)
            </div>
          )}

          {currentComponentCount > guidance.componentsNeeded && level < 4 && (
            <div className="text-xs text-yellow-600">
              You might have too many components (check if all are necessary)
            </div>
          )}
        </div>
      </div>

      {/* Test Result Summary */}
      {testResult && (
        <div className={`p-3 border-b border-gray-200 ${
          testResult.passed ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <h3 className={`text-xs font-semibold mb-2 ${
            testResult.passed ? 'text-green-900' : 'text-red-900'
          }`}>
            {testResult.passed ? '✅ Test Passed!' : '❌ Test Failed'}
          </h3>

          {testResult.passed ? (
            <div className="space-y-2 text-sm text-green-800">
              <p>Great job! Your design meets all requirements.</p>
              {testResult.explanation && (
                <p className="text-xs mt-2">{testResult.explanation.substring(0, 150)}...</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {!showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="mt-3 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  💡 Show Hint
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Hint (if test failed) */}
      {showHint && testResult && !testResult.passed && (
        <div className="p-3 border-b border-gray-200 bg-purple-50">
          <h3 className="text-xs font-semibold text-purple-900 mb-2">💡 Hint</h3>
          <div className="text-xs text-purple-800 space-y-2">
            {level === 1 && (
              <>
                <p>Every system needs 3 basic parts:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Client (already on canvas)</li>
                  <li>App Server (drag from left palette)</li>
                  <li>PostgreSQL (drag from left palette)</li>
                </ol>
                <p className="mt-2">Then connect them in order:</p>
                <p className="ml-4">Client → App Server → PostgreSQL</p>
                <p className="mt-2 text-xs">No configuration needed - just connect them!</p>
              </>
            )}
            {level === 2 && (
              <>
                <p>Your Level 1 design should work!</p>
                <p>But check the PostgreSQL configuration:</p>
                <ul className="list-disc ml-4">
                  <li>Click PostgreSQL in canvas</li>
                  <li>Look at Inspector (right)</li>
                  <li>Set capacity ≥ 100 RPS</li>
                </ul>
              </>
            )}
            {level === 3 && (
              <>
                <p>Database is saturated! Add caching:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Drag Redis Cache from palette</li>
                  <li>Insert between App Server and PostgreSQL</li>
                  <li>Configure: 4GB memory, 90% hit ratio</li>
                </ol>
                <p className="mt-2">This reduces DB load by 90%!</p>
              </>
            )}
            {level === 4 && (
              <>
                <p>Need high availability:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Add Load Balancer before app servers</li>
                  <li>Add second App Server instance</li>
                  <li>Enable PostgreSQL replication</li>
                </ol>
                <p className="mt-2">This survives component failures!</p>
              </>
            )}
            {level === 5 && (
              <>
                <p>Optimize cost while keeping performance:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Database replication: Do you NEED it? (-$100)</li>
                  <li>Redis size: Can you use less memory?</li>
                  <li>Keep 2 app servers (needed for HA)</li>
                </ul>
                <p className="mt-2">Target: Under $500/month</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-3 space-y-2">
        {/* Show detailed analysis if test has been run */}
        {testResult && testResult.detailedAnalysis && onShowDetailedAnalysis && (
          <button
            onClick={onShowDetailedAnalysis}
            className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-md"
          >
            🔍 View Detailed Analysis
          </button>
        )}

        {testResult?.passed && testCase.solution && (
          <button
            onClick={onShowSolution}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
          >
            ✨ View Detailed Explanation
          </button>
        )}

        {testResult && !testResult.passed && testCase.solution && (
          <button
            onClick={onShowSolution}
            className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-all"
          >
            👀 Peek at Solution
          </button>
        )}
      </div>

      {/* Level-Specific Tips */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <h3 className="text-[10px] font-semibold text-gray-700 mb-1">📚 What You'll Learn</h3>
        <div className="text-xs text-gray-600 space-y-1">
          {level === 1 && (
            <>
              <p>• How to connect components</p>
              <p>• Client-server-database pattern</p>
              <p>• Building your first working system</p>
            </>
          )}
          {level === 2 && (
            <>
              <p>• Capacity planning</p>
              <p>• Component utilization</p>
              <p>• When scaling is needed</p>
            </>
          )}
          {level === 3 && (
            <>
              <p>• Why caching matters</p>
              <p>• Cache hit ratio impact</p>
              <p>• Reducing database load</p>
            </>
          )}
          {level === 4 && (
            <>
              <p>• High availability design</p>
              <p>• Redundancy strategies</p>
              <p>• Surviving failures</p>
            </>
          )}
          {level === 5 && (
            <>
              <p>• Cost optimization</p>
              <p>• Performance vs cost tradeoffs</p>
              <p>• Production-ready design</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
