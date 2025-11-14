import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface TestCase {
  id: string;
  name: string;
  operations: Operation[];
  isExample: boolean;
}

interface Operation {
  method: 'shorten' | 'expand';
  input: string;
  expected: string | 'VALID_CODE' | 'RESULT_FROM_PREV' | null;
}

interface TestResult {
  testId: string;
  testName: string;
  passed: boolean;
  operations: OperationResult[];
  error?: string;
  executionTime?: number;
}

interface OperationResult {
  method: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

interface PythonCodeChallengePanelProps {
  pythonCode: string;
  setPythonCode: (code: string) => void;
  onRunTests: (code: string, testCases: TestCase[]) => Promise<TestResult[]>;
  onSubmit: () => void;
}

const EXAMPLE_TEST_CASES: TestCase[] = [
  {
    id: 'example1',
    name: 'Basic Shorten and Expand',
    isExample: true,
    operations: [
      { method: 'shorten', input: 'https://example.com', expected: 'VALID_CODE' },
      { method: 'expand', input: 'RESULT_FROM_PREV', expected: 'https://example.com' }
    ]
  },
  {
    id: 'example2',
    name: 'Multiple URLs',
    isExample: true,
    operations: [
      { method: 'shorten', input: 'https://google.com', expected: 'VALID_CODE' },
      { method: 'shorten', input: 'https://github.com', expected: 'VALID_CODE' },
      { method: 'expand', input: 'RESULT_FROM_PREV_0', expected: 'https://google.com' },
      { method: 'expand', input: 'RESULT_FROM_PREV_1', expected: 'https://github.com' }
    ]
  },
  {
    id: 'example3',
    name: 'Non-existent Code',
    isExample: true,
    operations: [
      { method: 'expand', input: 'notexist', expected: null }
    ]
  }
];

const HIDDEN_TEST_CASES: TestCase[] = [
  {
    id: 'hidden1',
    name: 'Duplicate URL Handling',
    isExample: false,
    operations: [
      { method: 'shorten', input: 'https://example.com', expected: 'VALID_CODE' },
      { method: 'shorten', input: 'https://example.com', expected: 'RESULT_FROM_PREV' }
    ]
  },
  {
    id: 'hidden2',
    name: 'Empty Input',
    isExample: false,
    operations: [
      { method: 'shorten', input: '', expected: null },
      { method: 'expand', input: '', expected: null }
    ]
  },
  {
    id: 'hidden3',
    name: 'Very Long URL',
    isExample: false,
    operations: [
      { method: 'shorten', input: 'https://example.com/' + 'a'.repeat(1000), expected: 'VALID_CODE' },
      { method: 'expand', input: 'RESULT_FROM_PREV', expected: 'https://example.com/' + 'a'.repeat(1000) }
    ]
  }
];

export function PythonCodeChallengePanel({
  pythonCode,
  setPythonCode,
  onRunTests,
  onSubmit
}: PythonCodeChallengePanelProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'problem'>('problem');
  const [showResults, setShowResults] = useState(false);

  const handleRunCode = async () => {
    setIsRunning(true);
    setShowResults(true);
    try {
      const results = await onRunTests(pythonCode, EXAMPLE_TEST_CASES);
      setTestResults(results);
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    setIsRunning(true);
    setShowResults(true);
    try {
      // Run all test cases (example + hidden)
      const allTestCases = [...EXAMPLE_TEST_CASES, ...HIDDEN_TEST_CASES];
      const results = await onRunTests(pythonCode, allTestCases);
      setTestResults(results);

      // If all tests pass, trigger the main submit (which runs load tests)
      const allPassed = results.every(r => r.passed);
      if (allPassed) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel: Problem Statement (40%) */}
      <div className="w-2/5 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
              {/* Problem Title */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">URL Shortener Implementation</h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Easy</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">System Design</span>
                </div>
              </div>

              {/* Problem Description */}
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700">
                  Implement a URL shortener service with two main functions:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li><code className="bg-gray-100 px-1 rounded">shorten(url)</code> - Takes a long URL and returns a short code</li>
                  <li><code className="bg-gray-100 px-1 rounded">expand(code)</code> - Takes a short code and returns the original URL</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Your implementation should:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Store URL mappings using the provided storage methods</li>
                  <li>Handle duplicate URLs consistently (same URL {'->'} same code)</li>
                  <li>Return <code className="bg-gray-100 px-1 rounded">None</code> for invalid inputs</li>
                  <li>Handle hash collisions if they occur</li>
                </ul>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                <div className="space-y-4">
                  {EXAMPLE_TEST_CASES.map((testCase, idx) => {
                    return (
                    <div key={testCase.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="font-medium text-gray-900 mb-2">Example {idx + 1}: {testCase.name}</div>
                      <div className="space-y-1 text-sm font-mono">
                        {testCase.operations.map((op, opIdx) => {
                          const inputDisplay = op.input.startsWith('RESULT_FROM_PREV') 
                            ? (op.input === 'RESULT_FROM_PREV' ? '<code from step 1>' 
                               : op.input === 'RESULT_FROM_PREV_0' ? '<code from step 1>' 
                               : op.input === 'RESULT_FROM_PREV_1' ? '<code from step 2>' 
                               : op.input) 
                            : op.input;
                          
                          const expectedDisplay = op.expected === 'VALID_CODE' 
                            ? '<valid short code>' 
                            : op.expected === null 
                            ? 'None' 
                            : `"${op.expected}"`;
                          
                          return (
                          <div key={opIdx} className="text-gray-700">
                            {op.method}("{inputDisplay}") {'->'} {expectedDisplay}
                          </div>
                          );
                        })}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Constraints</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>URLs are valid HTTP/HTTPS URLs</li>
                  <li>Short codes should be 6-8 characters</li>
                  <li>Use alphanumeric characters for codes</li>
                  <li>The same URL should always produce the same short code</li>
                </ul>
              </div>

              {/* Hints */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hints</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Use <code className="bg-gray-100 px-1">store()</code> to save URL mappings</li>
                  <li>Use <code className="bg-gray-100 px-1">retrieve()</code> to get URLs by code</li>
                  <li>Use <code className="bg-gray-100 px-1">exists()</code> to check for collisions</li>
                  <li>Hash functions can generate consistent codes from URLs</li>
                  <li>Remember to check if a URL already has a code before creating a new one</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      {/* Right Panel: Code Editor + Results (60%) */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Code Editor */}
        <div className={showResults ? 'h-1/2' : 'flex-1'}>
          <div className="h-full flex flex-col bg-white">
            {/* Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                defaultLanguage="python"
                value={pythonCode}
                onChange={(value) => setPythonCode(value || '')}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  wordWrap: 'on',
                  readOnly: isRunning,
                }}
              />
            </div>
          </div>
        </div>

        {/* Test Results */}
        {showResults && (
          <div className="h-1/2 flex flex-col bg-white border-t border-gray-300">
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Test Results</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {isRunning ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <div className="mt-2 text-sm text-gray-600">Running tests...</div>
                  </div>
                </div>
              ) : testResults.length > 0 ? (
                <div className="space-y-3">
                  {testResults.map((result) => (
                    <div
                      key={result.testId}
                      className={`border rounded-lg p-3 ${
                        result.passed
                          ? 'border-green-300 bg-green-50'
                          : 'border-red-300 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.passed ? (
                            <span className="text-green-600">✓</span>
                          ) : (
                            <span className="text-red-600">✗</span>
                          )}
                          <span className={`font-medium ${
                            result.passed ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {result.testName}
                          </span>
                        </div>
                        {result.executionTime && (
                          <span className="text-xs text-gray-600">
                            {result.executionTime}ms
                          </span>
                        )}
                      </div>

                      {!result.passed && result.operations && (
                        <div className="mt-2 space-y-1">
                          {result.operations.filter(op => !op.passed).map((op, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="font-mono text-xs text-red-700">
                                {op.method}("{op.input}")
                              </div>
                              <div className="text-xs text-red-600 ml-4">
                                Expected: {op.expected || 'None'}
                              </div>
                              <div className="text-xs text-red-600 ml-4">
                                Got: {op.actual || 'None'}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {result.error && (
                        <div className="mt-2 text-xs text-red-700 font-mono">
                          {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Click "Run Code" to test your solution
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Run Code
          </button>
          <button
            onClick={handleSubmitSolution}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Solution
          </button>
        </div>
      </div>
    </div>
  );
}