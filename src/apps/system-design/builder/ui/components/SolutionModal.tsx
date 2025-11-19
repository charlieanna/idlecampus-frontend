import { useState } from 'react';
import { Solution } from '../../types/testCase';

interface SolutionModalProps {
  solution: Solution | undefined;
  challengeTitle: string;
  onClose: () => void;
}

export function SolutionModal({ solution, challengeTitle, onClose }: SolutionModalProps) {
  const [expandedDecisions, setExpandedDecisions] = useState<Set<number>>(new Set());

  const toggleDecision = (index: number) => {
    const newExpanded = new Set(expandedDecisions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDecisions(newExpanded);
  };
  // Build flow paths from connections
  const buildFlowPaths = () => {
    if (!solution || !solution.connections || !Array.isArray(solution.connections)) return [];

    const connections = solution.connections;
    const paths: string[][] = [];
    const used = new Set<number>();

    // Find paths starting from 'client'
    const clientConns = connections
      .map((conn, idx) => ({ conn, idx }))
      .filter(({ conn }) => conn.from === 'client');

    for (const { conn: startConn, idx: startIdx } of clientConns) {
      const path = [startConn.from, startConn.to];
      used.add(startIdx);

      // Build chain by finding connections where 'from' matches the last item in path
      let current = startConn.to;
      let foundNext = true;

      while (foundNext) {
        foundNext = false;
        for (let i = 0; i < connections.length; i++) {
          if (!used.has(i) && connections[i].from === current) {
            path.push(connections[i].to);
            used.add(i);
            current = connections[i].to;
            foundNext = true;
            break;
          }
        }
      }

      paths.push(path);
    }

    // Add remaining connections that weren't part of main paths
    connections.forEach((conn, idx) => {
      if (!used.has(idx)) {
        paths.push([conn.from, conn.to]);
      }
    });

    return paths;
  };

  const flowPaths = solution ? buildFlowPaths() : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Solution</h2>
            <p className="text-sm text-gray-600 mt-1">{challengeTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {solution ? (
            <div className="space-y-6">
              {/* Components Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Architecture Components</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {solution.components && Array.isArray(solution.components) && solution.components.map((comp, idx) => (
                    <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="font-semibold text-blue-900">{comp.type}</div>
                      {comp.config && Object.keys(comp.config).length > 0 && (
                        <div className="text-sm text-blue-700 mt-2 space-y-1">
                          {Object.entries(comp.config).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-blue-600">{key}:</span>
                              <span className="font-mono">{JSON.stringify(value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Connections Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Flow</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    {flowPaths.map((path, idx) => (
                      <div key={idx} className="flex items-center gap-2 flex-wrap">
                        {path.map((node, nodeIdx) => (
                          <div key={nodeIdx} className="flex items-center gap-2">
                            <span className="bg-white px-3 py-1.5 rounded border border-gray-300 font-mono text-sm">
                              {node}
                            </span>
                            {nodeIdx < path.length - 1 && (
                              <span className="text-gray-500 font-bold text-lg">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Explanation Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why This Works</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                    {solution.explanation}
                  </pre>
                </div>
              </div>

              {/* Solution Walkthrough Section */}
              {solution.walkthrough && (
                <div className="border-t-2 border-gray-300 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🎓</span>
                    <h3 className="text-xl font-bold text-gray-900">Solution Walkthrough</h3>
                  </div>

                  {/* Overview */}
                  <div className="mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Overview</h4>
                      <p className="text-sm text-blue-800 leading-relaxed">{solution.walkthrough.overview}</p>
                    </div>
                  </div>

                  {/* Architecture Decisions */}
                  {solution.walkthrough.architectureDecisions.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-3">Architecture Decisions</h4>
                      <div className="space-y-3">
                        {solution.walkthrough.architectureDecisions.map((decision, idx) => (
                          <div key={idx} className="border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleDecision(idx)}
                              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{expandedDecisions.has(idx) ? '▼' : '▶'}</span>
                                <span className="font-semibold text-gray-900">{decision.decision}</span>
                              </div>
                            </button>
                            {expandedDecisions.has(idx) && (
                              <div className="p-4 bg-white space-y-3">
                                <div>
                                  <span className="text-xs font-semibold text-gray-600 uppercase">Rationale</span>
                                  <p className="text-sm text-gray-800 mt-1">{decision.rationale}</p>
                                </div>
                                {decision.alternatives && (
                                  <div>
                                    <span className="text-xs font-semibold text-gray-600 uppercase">Alternatives Considered</span>
                                    <p className="text-sm text-gray-700 mt-1">{decision.alternatives}</p>
                                  </div>
                                )}
                                {decision.tradeoffs && (
                                  <div>
                                    <span className="text-xs font-semibold text-gray-600 uppercase">Trade-offs</span>
                                    <p className="text-sm text-gray-700 mt-1">{decision.tradeoffs}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Component Rationale */}
                  {solution.walkthrough.componentRationale.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-3">Component Rationale</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {solution.walkthrough.componentRationale.map((comp, idx) => (
                          <div key={idx} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">🔧</span>
                              <h5 className="font-semibold text-purple-900">{comp.component}</h5>
                            </div>
                            <p className="text-sm text-purple-800 mb-2">{comp.why}</p>
                            <div className="text-xs text-purple-700 bg-purple-100 rounded px-2 py-1">
                              Config: {comp.configuration}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirement Mapping */}
                  {solution.walkthrough.requirementMapping.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-3">Requirement Coverage</h4>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Requirement</th>
                              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">How Addressed</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {solution.walkthrough.requirementMapping.map((req, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                                    req.requirement.startsWith('FR')
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {req.requirement}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-800">{req.howAddressed}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Optimizations */}
                  {solution.walkthrough.optimizations && solution.walkthrough.optimizations.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-base font-semibold text-gray-900 mb-3">Optimizations</h4>
                      <div className="space-y-3">
                        {solution.walkthrough.optimizations.map((opt, idx) => (
                          <div key={idx} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <span className="text-lg mt-0.5">⚡</span>
                              <div className="flex-1">
                                <h5 className="font-semibold text-orange-900 mb-1">{opt.area}</h5>
                                <p className="text-sm text-orange-800 mb-2">{opt.strategy}</p>
                                <div className="text-xs text-orange-700 bg-orange-100 rounded px-2 py-1 inline-block">
                                  Impact: {opt.impact}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Takeaways */}
                  {solution.walkthrough.keyTakeaways.length > 0 && (
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 mb-3">Key Takeaways</h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <ul className="space-y-2">
                          {solution.walkthrough.keyTakeaways.map((takeaway, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-yellow-600 font-bold mt-0.5">•</span>
                              <span className="text-sm text-yellow-900">{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Solution Available Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                The complete solution for this challenge hasn't been generated yet.
                Solutions are auto-generated by finding architectures that pass all test cases.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
