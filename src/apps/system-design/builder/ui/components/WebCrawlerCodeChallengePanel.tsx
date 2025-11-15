import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface CrawlStep {
  type: 'crawl';
  url: string;
  html: string;
  expectedLinks: string[];
}

interface FrontierStep {
  type: 'frontier';
  currentBatch: string[];
  seen: string[];
  expectedNext: string[];
}

type Step = CrawlStep | FrontierStep;

interface WebCrawlerTestCase {
  id: string;
  name: string;
  isExample: boolean;
  requirement?: string;
  steps: Step[];
}

interface WebCrawlerTestResult {
  testId: string;
  testName: string;
  passed: boolean;
  steps: {
    type: string;
    description: string;
    passed: boolean;
    details?: string;
  }[];
  error?: string;
}

interface WebCrawlerCodeChallengePanelProps {
  pythonCode: string;
  setPythonCode: (code: string) => void;
  onRunTests: (code: string, testCases: WebCrawlerTestCase[]) => Promise<WebCrawlerTestResult[]>;
  onSubmit: () => void;
}

const EXAMPLE_TESTS: WebCrawlerTestCase[] = [
  {
    id: 'crawl_example_1',
    name: 'FR-1: Basic Link Extraction',
    isExample: true,
    requirement: 'FR-1',
    steps: [
      {
        type: 'crawl',
        url: 'http://example.com',
        html: '<html><body><a href="http://example.com/about">About</a></body></html>',
        expectedLinks: ['http://example.com/about'],
      },
    ],
  },
  {
    id: 'frontier_example_1',
    name: 'FR-2: Basic Frontier Dedup',
    isExample: true,
    requirement: 'FR-2',
    steps: [
      {
        type: 'frontier',
        currentBatch: [
          'http://example.com',
          'http://example.com/about',
          'http://example.com',
        ],
        seen: ['http://example.com'],
        expectedNext: ['http://example.com/about'],
      },
    ],
  },
];

const HIDDEN_TESTS: WebCrawlerTestCase[] = [
  {
    id: 'crawl_hidden_1',
    name: 'FR-1: Ignore Non-HTTP Links',
    isExample: false,
    requirement: 'FR-1',
    steps: [
      {
        type: 'crawl',
        url: 'http://example.com',
        html: '<a href="mailto:test@example.com">Mail</a><a href="/contact">Contact</a>',
        expectedLinks: ['http://example.com/contact'],
      },
    ],
  },
  {
    id: 'frontier_hidden_1',
    name: 'FR-3: Frontier with Multiple Seen URLs',
    isExample: false,
    requirement: 'FR-3',
    steps: [
      {
        type: 'frontier',
        currentBatch: [
          'http://a.com',
          'http://b.com',
          'http://c.com',
          'http://a.com',
        ],
        seen: ['http://b.com', 'http://c.com'],
        expectedNext: ['http://a.com'],
      },
    ],
  },
];

export function WebCrawlerCodeChallengePanel({
  pythonCode,
  setPythonCode,
  onRunTests,
  onSubmit,
}: WebCrawlerCodeChallengePanelProps) {
  const [testResults, setTestResults] = useState<WebCrawlerTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showTestResultsPanel, setShowTestResultsPanel] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const formatTestResultsAsText = (results: WebCrawlerTestResult[]): string => {
    if (results.length === 0) {
      return 'No test results available.';
    }

    let output = 'Web Crawler Test Results\n';
    output += '='.repeat(50) + '\n\n';

    results.forEach((result, index) => {
      output += `Test ${index + 1}: ${result.testName}\n`;
      output += `Status: ${result.passed ? 'PASSED ✓' : 'FAILED ✗'}\n`;

      if (result.steps && result.steps.length > 0) {
        output += '\nSteps:\n';
        result.steps.forEach((step, stepIdx) => {
          output += `  ${stepIdx + 1}. ${step.description}\n`;
          output += `     ${step.passed ? '✓ PASSED' : '✗ FAILED'}\n`;
          if (step.details) {
            output += `     Details: ${step.details}\n`;
          }
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
      const results = await onRunTests(pythonCode, EXAMPLE_TESTS);
      setTestResults(results);
      setShowTestResultsPanel(true);
    } catch (error) {
      console.error('Error running web crawler tests:', error);
    } finally {
      setIsRunning(false);
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
      const allTests = [...EXAMPLE_TESTS, ...HIDDEN_TESTS];
      const results = await onRunTests(pythonCode, allTests);
      setTestResults(results);
      setShowTestResultsPanel(true);

      const allPassed = results.every(r => r.passed);
      if (allPassed) {
        onSubmit();
      }
    } catch (error) {
      console.error('Error submitting web crawler solution:', error);
    } finally {
      setIsRunning(false);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.layout();
        }
      }, 0);
    }
  };

  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editorInstance;

    if (editorContainerRef.current) {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }

      resizeObserverRef.current = new ResizeObserver(() => {
        if (editorRef.current) {
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

  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel: Problem Statement */}
      <div className="w-2/5 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Web Crawler Core Functions</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                  Intermediate
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  System Design · Crawling
                </span>
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700">
                Implement the core functions of a web crawler. Focus on <strong>link extraction</strong> and
                <strong>URL frontier management</strong>. Networking is simulated; we pass HTML as input.
              </p>
              <p className="text-gray-700 mt-2">
                You must implement:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li><code className="bg-gray-100 px-1 rounded">crawl_page(url, html)</code> – Extract links from HTML.</li>
                <li><code className="bg-gray-100 px-1 rounded">manage_frontier(current_batch, seen_urls)</code> – Deduplicate and pick next URLs to crawl.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Requirements</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>Extract <code>&lt;a href=&quot;...&quot;&gt;</code> links from HTML.</li>
                <li>Resolve relative links using the page URL.</li>
                <li>Ignore non-http(s) links (e.g., <code>mailto:</code>, <code>javascript:</code>).</li>
                <li>Return unique links only (no duplicates).</li>
                <li>Frontier should not return URLs already in <code>seen_urls</code>.</li>
                <li>Frontier results should not contain duplicates and should preserve order.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hints</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                <li>Use <code className="bg-gray-100 px-1">re.findall()</code> or a simple parser to extract href values.</li>
                <li>Use <code className="bg-gray-100 px-1">urllib.parse.urljoin()</code> to resolve relative URLs.</li>
                <li>Filter by <code>url.startswith(&quot;http&quot;)</code> to keep http/https links.</li>
                <li>Use a <code>set</code> to deduplicate links in both functions.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Code Editor + Actions */}
      <div className="flex-1 flex flex-col bg-gray-50 min-w-0 relative">
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
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
              onClick={() => setShowTestResultsPanel(false)}
            />

            <div
              className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 shadow-2xl z-50 animate-slide-up rounded-t-2xl overflow-hidden"
              style={{
                height: '40vh',
                maxHeight: '500px',
                width: '85%',
                maxWidth: '1200px',
                boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
              }}
            >
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

        {/* Action Buttons */}
        <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 flex justify-end gap-3 relative z-30">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Run Example Tests
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

