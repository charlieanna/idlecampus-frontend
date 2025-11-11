import React from 'react';
import { FlowVisualization as FlowVizData } from '../../types/request';

interface FlowVisualizationProps {
  flowViz: FlowVizData;
}

export const FlowVisualization: React.FC<FlowVisualizationProps> = ({ flowViz }) => {
  const { connectionFlows, componentSuccessRates, readPaths, writePaths, failures } = flowViz;

  return (
    <div className="flow-visualization">
      <h3 className="text-lg font-semibold mb-3">Traffic Flow Analysis</h3>

      {/* Connection Flows */}
      <div className="mb-4">
        <h4 className="font-medium text-sm mb-2">Connection Traffic (RPS)</h4>
        <div className="space-y-1">
          {connectionFlows.map((flow, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded"
            >
              <span className="font-mono">
                {flow.from} → {flow.to}
              </span>
              <span className={`font-medium ${flow.type === 'read' ? 'text-blue-600' : 'text-green-600'}`}>
                {flow.requestsPerSecond.toFixed(0)} RPS ({flow.type})
              </span>
            </div>
          ))}
          {connectionFlows.length === 0 && (
            <p className="text-xs text-gray-500 italic">No traffic flow detected</p>
          )}
        </div>
      </div>

      {/* Component Success Rates */}
      <div className="mb-4">
        <h4 className="font-medium text-sm mb-2">Component Success Rates</h4>
        <div className="space-y-1">
          {Array.from(componentSuccessRates.entries()).map(([nodeId, successRate]) => (
            <div
              key={nodeId}
              className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded"
            >
              <span className="font-mono">{nodeId}</span>
              <span
                className={`font-medium ${
                  successRate > 0.99
                    ? 'text-green-600'
                    : successRate > 0.95
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {(successRate * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Request Paths */}
      <div className="mb-4">
        <h4 className="font-medium text-sm mb-2">Request Paths</h4>
        <div className="space-y-2">
          {readPaths.length > 0 && (
            <div>
              <p className="text-xs text-blue-600 font-medium mb-1">Read Path:</p>
              <div className="text-xs font-mono bg-blue-50 p-2 rounded">
                {readPaths[0].join(' → ')}
              </div>
            </div>
          )}
          {writePaths.length > 0 && (
            <div>
              <p className="text-xs text-green-600 font-medium mb-1">Write Path:</p>
              <div className="text-xs font-mono bg-green-50 p-2 rounded">
                {writePaths[0].join(' → ')}
              </div>
            </div>
          )}
          {readPaths.length === 0 && writePaths.length === 0 && (
            <p className="text-xs text-red-500 italic">⚠️ No valid paths found - traffic cannot flow!</p>
          )}
        </div>
      </div>

      {/* Failures */}
      {failures.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2 text-red-600">Failures ({failures.length})</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {failures.slice(0, 5).map((failure, idx) => (
              <div key={idx} className="text-xs bg-red-50 p-2 rounded">
                <span className="font-mono text-red-700">{failure.failedAt}</span>
                <span className="text-gray-600"> - {failure.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-600">Total Paths:</span>
            <span className="ml-2 font-medium">{readPaths.length + writePaths.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Connections:</span>
            <span className="ml-2 font-medium">{connectionFlows.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Read Paths:</span>
            <span className="ml-2 font-medium text-blue-600">{readPaths.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Write Paths:</span>
            <span className="ml-2 font-medium text-green-600">{writePaths.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
