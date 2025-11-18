import { TestCase } from '../../types/testCase';

interface SolutionsPanelProps {
  testCases: TestCase[];
}

export function SolutionsPanel({ testCases }: SolutionsPanelProps) {
  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Case Solutions</h2>

        <div className="space-y-8">
          {testCases.map((testCase, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Test Case Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {testCase.requirement}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    testCase.type === 'functional'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {testCase.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mt-2">
                  {index + 1}. {testCase.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{testCase.description}</p>
              </div>

              {/* Solution Content */}
              <div className="p-4">
                {testCase.solution ? (
                  <div className="space-y-4">
                    {/* Components */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Components</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {testCase.solution.components.map((comp, idx) => (
                          <div key={idx} className="bg-blue-50 border border-blue-200 rounded p-2">
                            <div className="font-medium text-blue-900 text-sm">{comp.type}</div>
                            {Object.keys(comp.config).length > 0 && (
                              <div className="text-xs text-blue-700 mt-1">
                                {Object.entries(comp.config).map(([key, value]) => (
                                  <div key={key}>
                                    {key}: {JSON.stringify(value)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Connections */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Connections</h4>
                      <div className="space-y-1">
                        {testCase.solution.connections.map((conn, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="bg-gray-100 px-2 py-1 rounded font-mono">{conn.from}</span>
                            <span className="text-gray-500">→</span>
                            <span className="bg-gray-100 px-2 py-1 rounded font-mono">{conn.to}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explanation */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Explanation</h4>
                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                          {testCase.solution.explanation}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🔧</div>
                    <div className="font-medium">No solution provided yet</div>
                    <div className="text-sm mt-1">Solution will be auto-generated</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {testCases.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <div className="font-medium">No test cases available</div>
          </div>
        )}
      </div>
    </div>
  );
}
