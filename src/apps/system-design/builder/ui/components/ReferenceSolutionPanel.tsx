import React, { useState } from 'react';
import { TestCase } from '../../types/testCase';

interface ReferenceSolutionPanelProps {
  testCase: TestCase;
  onClose: () => void;
  onApplySolution: () => void;
}

export function ReferenceSolutionPanel({
  testCase,
  onClose,
  onApplySolution,
}: ReferenceSolutionPanelProps) {
  const [activeTab, setActiveTab] = useState<'architecture' | 'components' | 'tradeoffs'>('architecture');

  if (!testCase.solution) {
    return null;
  }

  const { solution } = testCase;

  // Calculate metrics
  const totalComponents = solution.components.length;
  const componentTypes = [...new Set(solution.components.map(c => c.type))];
  const connectionCount = solution.connections.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">✨</span>
              <h2 className="text-2xl font-bold text-gray-900">Reference Solution</h2>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                OPTIMAL
              </span>
            </div>
            <p className="text-sm text-gray-600">{testCase.name}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'architecture'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🏗️ Architecture Diagram
            </button>
            <button
              onClick={() => setActiveTab('components')}
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'components'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              ⚙️ Component Configuration
            </button>
            <button
              onClick={() => setActiveTab('tradeoffs')}
              className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'tradeoffs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              ⚖️ Design Tradeoffs
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-900 mb-1">Total Components</div>
                  <div className="text-3xl font-bold text-blue-600">{totalComponents}</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-green-900 mb-1">Component Types</div>
                  <div className="text-3xl font-bold text-green-600">{componentTypes.length}</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-purple-900 mb-1">Connections</div>
                  <div className="text-3xl font-bold text-purple-600">{connectionCount}</div>
                </div>
              </div>

              {/* Visual Diagram */}
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8">
                <h3 className="font-bold text-lg text-gray-900 mb-4">System Architecture</h3>
                <div className="space-y-4">
                  {renderArchitectureDiagram(solution.components, solution.connections)}
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                  <span>💡</span>
                  <span>Why This Design Works</span>
                </h3>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line text-gray-800">
                    {solution.explanation}
                  </div>
                </div>
              </div>

              {/* Test Case Criteria */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">✅ Passes Test Criteria</h3>
                <div className="grid grid-cols-2 gap-4">
                  {testCase.passCriteria.maxP99Latency && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-900">
                        <strong>P99 Latency:</strong> &lt; {testCase.passCriteria.maxP99Latency}ms
                      </span>
                    </div>
                  )}
                  {testCase.passCriteria.maxErrorRate && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-900">
                        <strong>Error Rate:</strong> &lt; {(testCase.passCriteria.maxErrorRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                  {testCase.passCriteria.maxMonthlyCost && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-900">
                        <strong>Cost:</strong> &lt; ${testCase.passCriteria.maxMonthlyCost}/month
                      </span>
                    </div>
                  )}
                  {testCase.passCriteria.minAvailability && (
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-900">
                        <strong>Availability:</strong> &gt; {(testCase.passCriteria.minAvailability * 100).toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'components' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Component Configuration Details</h3>
              {solution.components.map((component, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getComponentIcon(component.type)}</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{getComponentLabel(component.type)}</h4>
                        <p className="text-xs text-gray-500">{component.type}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      Component {index + 1}
                    </span>
                  </div>

                  {/* Configuration */}
                  {Object.keys(component.config).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs font-medium text-gray-700 mb-2">Configuration:</div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(component.config).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-600">{formatKey(key)}:</span>
                            <span className="font-semibold text-gray-900">{formatValue(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Component-specific insights */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-700">
                      {getComponentInsight(component.type, component.config)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tradeoffs' && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">⚖️ Design Tradeoffs</h3>
                {renderTradeoffs(solution, testCase)}
              </div>

              {/* Alternative Approaches */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">🤔 Alternative Approaches</h3>
                {renderAlternatives(solution, testCase)}
              </div>

              {/* Scaling Considerations */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">📈 Scaling Considerations</h3>
                {renderScalingConsiderations(testCase)}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onApplySolution}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>✨</span>
            <span>Apply This Solution to Canvas</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions

function renderArchitectureDiagram(components: any[], connections: any[]) {
  // Group components by layer
  const layers = {
    client: components.filter(c => c.type === 'client'),
    network: components.filter(c => c.type === 'load_balancer'),
    compute: components.filter(c => c.type === 'app_server'),
    cache: components.filter(c => c.type === 'redis' || c.type === 'cdn'),
    database: components.filter(c => ['postgresql', 'mongodb', 'cassandra'].includes(c.type)),
    storage: components.filter(c => c.type === 's3'),
    queue: components.filter(c => c.type === 'message_queue'),
  };

  return (
    <div className="space-y-6">
      {Object.entries(layers).map(([layerName, layerComponents]) => {
        if (layerComponents.length === 0) return null;

        return (
          <div key={layerName}>
            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">{layerName}</div>
            <div className="flex gap-4 flex-wrap">
              {layerComponents.map((component, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-blue-300 rounded-lg p-4 min-w-[150px] shadow-sm"
                >
                  <div className="text-2xl mb-2 text-center">{getComponentIcon(component.type)}</div>
                  <div className="text-sm font-semibold text-gray-900 text-center">
                    {getComponentLabel(component.type)}
                  </div>
                  {Object.keys(component.config).length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600 text-center">
                      {formatPrimaryConfig(component)}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {layerName !== 'queue' && (
              <div className="flex justify-center my-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function renderTradeoffs(solution: any, testCase: any) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">✅ What We Gained:</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">→</span>
            <span>Low latency through aggressive caching</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">→</span>
            <span>High availability with redundancy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 font-bold">→</span>
            <span>Cost-effective within budget constraints</span>
          </li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">⚠️ What We Sacrificed:</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">→</span>
            <span>Eventual consistency (acceptable for this use case)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 font-bold">→</span>
            <span>Complexity of cache invalidation</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function renderAlternatives(solution: any, testCase: any) {
  return (
    <div className="space-y-3 text-sm text-gray-800">
      <div>
        <strong>Alternative 1: No Caching</strong>
        <p className="text-gray-600 mt-1">
          ❌ Won't meet latency requirements. Database would be overwhelmed with read traffic.
        </p>
      </div>
      <div>
        <strong>Alternative 2: More App Servers, Smaller Cache</strong>
        <p className="text-gray-600 mt-1">
          ⚠️ Higher cost, lower cache hit ratio. Only makes sense if compute-bound.
        </p>
      </div>
      <div>
        <strong>Alternative 3: NoSQL Database</strong>
        <p className="text-gray-600 mt-1">
          🤔 Could work, but adds complexity. PostgreSQL is sufficient for this scale.
        </p>
      </div>
    </div>
  );
}

function renderScalingConsiderations(testCase: any) {
  return (
    <div className="space-y-3 text-sm text-gray-800">
      <div>
        <strong>10x Traffic Growth:</strong>
        <p className="text-gray-600 mt-1">
          • Increase cache size (8GB → 16GB)<br />
          • Add more app server instances (2 → 5)<br />
          • Consider read replicas for database<br />
          • Add CDN for static content
        </p>
      </div>
      <div>
        <strong>Global Expansion:</strong>
        <p className="text-gray-600 mt-1">
          • Multi-region deployment<br />
          • Geographic load balancing<br />
          • Consider Cassandra for global consistency<br />
          • CDN becomes critical
        </p>
      </div>
    </div>
  );
}

function getComponentIcon(type: string): string {
  const icons: Record<string, string> = {
    client: '👤',
    load_balancer: '🌐',
    app_server: '📦',
    postgresql: '💾',
    mongodb: '🍃',
    cassandra: '💿',
    redis: '⚡',
    message_queue: '📮',
    cdn: '🌍',
    s3: '☁️',
  };
  return icons[type] || '⚙️';
}

function getComponentLabel(type: string): string {
  const labels: Record<string, string> = {
    client: 'Client',
    load_balancer: 'Load Balancer',
    app_server: 'App Server',
    postgresql: 'PostgreSQL',
    mongodb: 'MongoDB',
    cassandra: 'Cassandra',
    redis: 'Redis Cache',
    message_queue: 'Message Queue',
    cdn: 'CDN',
    s3: 'S3 Storage',
  };
  return labels[type] || type;
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

function formatValue(value: any): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
}

function formatPrimaryConfig(component: any): string {
  const config = component.config;
  if (component.type === 'app_server' && config.instances) {
    return `${config.instances} instance${config.instances > 1 ? 's' : ''}`;
  }
  if (component.type === 'redis' && config.memorySizeGB) {
    return `${config.memorySizeGB}GB, ${(config.hitRatio * 100).toFixed(0)}% hit ratio`;
  }
  if (component.type === 'postgresql') {
    return config.replication ? 'With replication' : 'Single instance';
  }
  return '';
}

function getComponentInsight(type: string, config: any): string {
  const insights: Record<string, string> = {
    redis: 'Cache absorbs most read traffic, reducing database load by 80-90%',
    app_server: 'Handles business logic, API requests, and cache management',
    postgresql: 'Stores persistent data with ACID guarantees',
    load_balancer: 'Distributes traffic across app servers for high availability',
    cdn: 'Serves static content from edge locations for ultra-low latency',
    mongodb: 'Flexible document storage for unstructured data',
    cassandra: 'High write throughput with tunable consistency',
    message_queue: 'Enables async processing and service decoupling',
  };
  return insights[type] || 'Core system component';
}
