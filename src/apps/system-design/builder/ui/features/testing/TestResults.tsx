import React from 'react';
import { TestResult as TestResultType } from '../../../types/testCase';
import { Panel } from '../../design-system';

interface TestResultsProps {
  testResults: Map<number, TestResultType>;
  currentTestIndex: number;
}

/**
 * TestResults - Display test execution results
 * Maps to Figma: TestResults component
 */
export const TestResults: React.FC<TestResultsProps> = ({
  testResults,
  currentTestIndex,
}) => {
  const results = Array.from(testResults.values());
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;

  if (totalCount === 0) {
    return (
      <Panel className="text-center py-8">
        <p className="text-gray-500">No test results yet. Run tests to see results.</p>
      </Panel>
    );
  }

  return (
    <Panel padding="md">
      {/* Summary */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">
            Test Results
          </span>
          <span className={`text-lg font-bold ${passedCount === totalCount ? 'text-green-600' : 'text-red-600'}`}>
            {passedCount} / {totalCount} Passed
          </span>
        </div>
      </div>

      {/* Individual Test Results */}
      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border-2 ${
              result.passed
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                Test {index + 1}
              </span>
              <span className={`text-sm font-semibold ${
                result.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.passed ? '✓ PASSED' : '✗ FAILED'}
              </span>
            </div>
            {result.message && (
              <p className="mt-2 text-sm text-gray-700">{result.message}</p>
            )}
            {result.error && (
              <p className="mt-2 text-sm text-red-600 font-mono">{result.error}</p>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
};

