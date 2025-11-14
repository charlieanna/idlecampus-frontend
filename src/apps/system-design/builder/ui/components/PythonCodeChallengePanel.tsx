import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

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
  exampleTestCases?: TestCase[];
  hiddenTestCases?: TestCase[];
}

// Default TinyURL test cases (used if no test cases provided)
const DEFAULT_EXAMPLE_TEST_CASES: TestCase[] = [
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
  }
];

const DEFAULT_HIDDEN_TEST_CASES: TestCase[] = [
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
  onSubmit,
  exampleTestCases = DEFAULT_EXAMPLE_TEST_CASES,
  hiddenTestCases = DEFAULT_HIDDEN_TEST_CASES
}: PythonCodeChallengePanelProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showTestResultsPanel, setShowTestResultsPanel] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const formatTestResultsAsText = (results: TestResult[]): string => {
    if (results.length === 0) {
      return 'No test results available.';
    }

    let output = 'Test Results\n';
    output += '='.repeat(50) + '\n\n';

    results.forEach((result, index) => {
      output += `Test ${index + 1}: ${result.testName}\n`;
      output += `Status: ${result.passed ? 'PASSED ✓' : 'FAILED ✗'}\n`;
      
      if (result.executionTime) {
        output += `Execution Time: ${result.executionTime}ms\n`;
      }

      if (result.operations && result.operations.length > 0) {
        output += '\nOperations:\n';
        result.operations.forEach((op, opIdx) => {
          output += `  ${opIdx + 1}. ${op.method}("${op.input}")\n`;
          output += `     Expected: ${op.expected || 'None'}\n`;
          output += `     Actual: ${op.actual || 'None'}\n`;
          output += `     ${op.passed ? '✓ PASSED' : '✗ FAILED'}\n`;
        });
      }

      if (result.error) {
        output += `\nError: ${result.error}\n`;
      }

      output += '\n' + '-'.repeat(50) + '\n\n';
    });

    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    output += `Summary: ${passedCount}/${totalCount} tests passed\n`;

    return output;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const results = await onRunTests(pythonCode, exampleTestCases);
      setTestResults(results);
      setShowTestResultsPanel(true);
    } catch (error) {
      console.error('Error running tests:', error);
    } finally {
      setIsRunning(false);
      // Force editor layout update after state changes
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.layout();
        }
      }, 0);
    }
  };

  const handleSubmitSolution = async () => {
    setIsRunning(true);
    try {
      // Run all test cases (example + hidden)
      const allTestCases = [...exampleTestCases, ...hiddenTestCases];
      const results = await onRunTests(pythonCode, allTestCases);
      setTestResults(results);
      setShowTestResultsPanel(true);

      // If all tests pass, trigger the main submit (which runs load tests)
      const allPassed = results.every(r => r.passed);
      if (allPassed) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
    } finally {
      setIsRunning(false);
      // Force editor layout update after state changes
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.layout();
        }
      }, 0);
    }
  };

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    
    // Set up ResizeObserver for the editor container
    if (editorContainerRef.current) {
      // Clean up existing observer if any
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      
      resizeObserverRef.current = new ResizeObserver(() => {
        if (editorRef.current) {
          // Use requestAnimationFrame to ensure layout happens after DOM updates
          requestAnimationFrame(() => {
            if (editorRef.current) {
              editorRef.current.layout();
            }
          });
        }
      });
      
      resizeObserverRef.current.observe(editorContainerRef.current);
    }
  };

  // Cleanup ResizeObserver on unmount
  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

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
                  <li>Store URL mappings in a dictionary</li>
                  <li>Handle duplicate URLs consistently (same URL → same code)</li>
                  <li>Return <code className="bg-gray-100 px-1 rounded">None</code> for invalid inputs</li>
                  <li>Use hash functions to generate short codes</li>
                </ul>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                <div className="space-y-4">
                  {exampleTestCases.map((testCase, idx) => (
                    <div key={testCase.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="font-medium text-gray-900 mb-2">Example {idx + 1}: {testCase.name}</div>
                      <div className="space-y-1 text-sm font-mono">
                        {testCase.operations.map((op, opIdx) => (
                          <div key={opIdx} className="text-gray-700">
                            {op.method}("{
                              op.input.startsWith('RESULT_FROM_PREV') ?
                                (op.input === 'RESULT_FROM_PREV' ? '<code from step 1>' :
                                 op.input === 'RESULT_FROM_PREV_0' ? '<code from step 1>' :
                                 op.input === 'RESULT_FROM_PREV_1' ? '<code from step 2>' :
                                 op.input) : op.input
                            }") → {
                              op.expected === 'VALID_CODE' ? '<valid short code>' :
                              op.expected === null ? 'None' :
                              `"${op.expected}"`
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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
                  <li>Create a dictionary to store URL-to-code mappings</li>
                  <li>Use <code className="bg-gray-100 px-1">hashlib.md5()</code> to generate consistent short codes</li>
                  <li>Check if a URL already exists before creating a new code</li>
                  <li>Handle edge cases: empty URLs, None values, etc.</li>
                </ul>
              </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Code Editor (Full Width) */}
      <div className="flex-1 flex flex-col bg-gray-50 min-w-0 relative">
        {/* Code Editor - Full width */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          <div className="p-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h3 className="font-semibold text-gray-900">Code Editor</h3>
          </div>
          <div 
            ref={editorContainerRef}
            className="flex-1 overflow-hidden"
            style={{ minWidth: 0, width: '100%' }}
          >
            <Editor
              height="100%"
              defaultLanguage="python"
              value={pythonCode}
              onChange={(value) => setPythonCode(value || '')}
              onMount={handleEditorDidMount}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: false,
                tabSize: 4,
                wordWrap: 'on',
                readOnly: isRunning,
              }}
            />
          </div>
        </div>

        {/* Bottom Overlay Panel - Test Results */}
        {showTestResultsPanel && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
              onClick={() => setShowTestResultsPanel(false)}
            />
            
            {/* Panel - positioned above buttons, centered and narrower */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-2xl z-50 animate-slide-up rounded-t-2xl overflow-hidden"
                 style={{ 
                   height: '40vh', 
                   maxHeight: '500px',
                   width: '85%',
                   maxWidth: '1200px',
                   boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)'
                 }}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
                <h3 className="font-semibold text-gray-900">Test Results</h3>
                <button
                  onClick={() => setShowTestResultsPanel(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-all hover:scale-110"
                  title="Close"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="h-full overflow-hidden flex flex-col rounded-b-2xl" style={{ height: 'calc(100% - 60px)' }}>
                {isRunning ? (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <div className="mt-2 text-sm text-gray-600">Running tests...</div>
                    </div>
                  </div>
                ) : (
                  <textarea
                    readOnly
                    value={formatTestResultsAsText(testResults)}
                    className="flex-1 w-full p-4 font-mono text-sm bg-gray-900 text-green-400 border-0 resize-none focus:outline-none rounded-b-2xl"
                    style={{ fontFamily: 'monospace' }}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Action Buttons - Fixed at bottom, below overlay */}
        <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 flex justify-end gap-3 relative z-30">
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