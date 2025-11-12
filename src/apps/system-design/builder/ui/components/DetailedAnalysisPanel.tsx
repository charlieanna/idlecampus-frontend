import React, { useState } from 'react';
import { DesignAnalysisResult } from '../../validation/DesignAnalyzer';

interface DetailedAnalysisPanelProps {
  analysis: DesignAnalysisResult;
  onClose: () => void;
}

export function DetailedAnalysisPanel({ analysis, onClose }: DetailedAnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState<'components' | 'patterns' | 'optimizations' | 'risks'>('components');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🔍 Design Analysis</h2>
              <p className="text-sm text-gray-600 mt-1">
                Deep dive into your system architecture
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-xs text-gray-500">Components</div>
              <div className="text-2xl font-bold text-gray-900">{analysis.summary.totalComponents}</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-xs text-gray-500">Connections</div>
              <div className="text-2xl font-bold text-gray-900">{analysis.summary.totalConnections}</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-xs text-gray-500">Monthly Cost</div>
              <div className="text-2xl font-bold text-gray-900">
                ${analysis.summary.estimatedMonthlyCost.toFixed(0)}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-xs text-gray-500">Health</div>
              <div className={`text-2xl font-bold ${
                analysis.summary.overallHealth === 'healthy' ? 'text-green-600' :
                analysis.summary.overallHealth === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {analysis.summary.overallHealth === 'healthy' ? '✓' :
                 analysis.summary.overallHealth === 'warning' ? '⚠' : '✗'}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            {['components', 'patterns', 'optimizations', 'risks'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 text-sm font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'components' && (
            <ComponentsTab components={analysis.componentAnalysis} />
          )}
          {activeTab === 'patterns' && (
            <PatternsTab patterns={analysis.patterns} />
          )}
          {activeTab === 'optimizations' && (
            <OptimizationsTab optimizations={analysis.optimizations} />
          )}
          {activeTab === 'risks' && (
            <RisksTab failureModes={analysis.failureModes} />
          )}
        </div>
      </div>
    </div>
  );
}

function ComponentsTab({ components }: { components: DesignAnalysisResult['componentAnalysis'] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Component Analysis</h3>
      {components.map(comp => (
        <div
          key={comp.id}
          className={`border rounded-lg p-4 ${
            comp.status === 'saturated' ? 'border-red-300 bg-red-50' :
            comp.status === 'warning' ? 'border-yellow-300 bg-yellow-50' :
            comp.status === 'over-provisioned' ? 'border-blue-300 bg-blue-50' :
            'border-gray-200 bg-white'
          }`}
        >
          {/* Component Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{comp.type}</h4>
              <p className="text-xs text-gray-500">{comp.id}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              comp.status === 'healthy' ? 'bg-green-100 text-green-800' :
              comp.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              comp.status === 'saturated' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {comp.status}
            </span>
          </div>

          {/* Utilization Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Utilization</span>
              <span className="font-medium">{(comp.utilization * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  comp.utilization > 0.9 ? 'bg-red-500' :
                  comp.utilization > 0.7 ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(comp.utilization * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Capacity */}
          {comp.capacity && (
            <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
              <div>
                <div className="text-gray-500">Capacity</div>
                <div className="font-semibold">{comp.capacity.current.toFixed(0)}</div>
              </div>
              <div>
                <div className="text-gray-500">Used</div>
                <div className="font-semibold">{comp.capacity.used.toFixed(0)}</div>
              </div>
              <div>
                <div className="text-gray-500">Headroom</div>
                <div className="font-semibold">{comp.capacity.headroom.toFixed(0)}%</div>
              </div>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="mb-3 p-3 bg-white bg-opacity-50 rounded">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-700">Monthly Cost</span>
              <span className="text-sm font-bold text-gray-900">
                ${comp.cost.monthly.toFixed(2)}
              </span>
            </div>
            <div className="space-y-1">
              {comp.cost.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-gray-600">
                  <span>{item.item}</span>
                  <span>${item.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Issues */}
          {comp.issues.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-red-700 mb-1">⚠️ Issues:</div>
              <ul className="space-y-1">
                {comp.issues.map((issue, idx) => (
                  <li key={idx} className="text-xs text-red-600">• {issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {comp.recommendations.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-700 mb-1">💡 Recommendations:</div>
              <ul className="space-y-1">
                {comp.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs text-gray-600">• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PatternsTab({ patterns }: { patterns: DesignAnalysisResult['patterns'] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Architectural Patterns Detected</h3>
      {patterns.length === 0 ? (
        <p className="text-gray-500">No standard patterns detected</p>
      ) : (
        patterns.map((pattern, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{pattern.name}</h4>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                ✓ Detected
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-green-700 mb-2">✓ Pros:</div>
                <ul className="space-y-1">
                  {pattern.pros.map((pro, i) => (
                    <li key={i} className="text-xs text-gray-600">• {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-medium text-red-700 mb-2">⚠️ Cons:</div>
                <ul className="space-y-1">
                  {pattern.cons.map((con, i) => (
                    <li key={i} className="text-xs text-gray-600">• {con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function OptimizationsTab({ optimizations }: { optimizations: DesignAnalysisResult['optimizations'] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Optimization Opportunities</h3>
      {optimizations.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-gray-600">Your design is well-optimized!</p>
        </div>
      ) : (
        optimizations.map((opt, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{opt.potential}</h4>
                <p className="text-sm text-green-600 mt-1">💰 {opt.impact}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                opt.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                opt.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {opt.difficulty}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function RisksTab({ failureModes }: { failureModes: DesignAnalysisResult['failureModes'] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Failure Modes & Risks</h3>
      {failureModes.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🛡️</div>
          <p className="text-gray-600">No critical failure modes detected</p>
        </div>
      ) : (
        failureModes.map((fm, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="font-semibold text-gray-900 mb-2">{fm.scenario}</h4>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-xs text-gray-500">Probability:</span>
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                  fm.probability === 'low' ? 'bg-green-100 text-green-800' :
                  fm.probability === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {fm.probability}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500">Impact:</span>
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                  fm.impact === 'low' ? 'bg-green-100 text-green-800' :
                  fm.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {fm.impact}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 rounded p-3">
              <div className="text-xs font-medium text-blue-900 mb-1">🛠️ Mitigation:</div>
              <p className="text-xs text-blue-800">{fm.mitigation}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
