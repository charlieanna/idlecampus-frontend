import { Solution } from '../../types/testCase';

interface SolutionModalProps {
  solution: Solution | undefined;
  challengeTitle: string;
  onClose: () => void;
}

export function SolutionModal({ solution, challengeTitle, onClose }: SolutionModalProps) {
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
