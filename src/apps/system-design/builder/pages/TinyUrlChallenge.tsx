import { useState } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ComponentConfigWizard } from '../ui/components/ComponentConfigWizard';
import { tinyUrlProblemDefinition } from '../challenges/tinyUrlProblemDefinition';
import { SystemDesignValidator } from '../validation/SystemDesignValidator';
import { SystemGraph } from '../types/graph';

type ComponentType = 'app_server' | 'postgresql' | 'redis' | 'load_balancer';

interface ComponentConfig {
  type: ComponentType;
  config: Record<string, any>;
}

/**
 * TinyURL Challenge Page
 *
 * Complete flow:
 * 1. User selects components to add
 * 2. Wizard asks intentional configuration questions
 * 3. System validates design with real EC2 instances
 * 4. Shows detailed test results
 */
export function TinyUrlChallenge() {
  const [components, setComponents] = useState<ComponentConfig[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [currentComponentType, setCurrentComponentType] = useState<ComponentType | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState(0);

  const handleAddComponent = (type: ComponentType) => {
    setCurrentComponentType(type);
    setShowWizard(true);
  };

  const handleWizardComplete = (config: Record<string, any>) => {
    if (currentComponentType) {
      setComponents([...components, { type: currentComponentType, config }]);
    }
    setShowWizard(false);
    setCurrentComponentType(null);
  };

  const handleRemoveComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const handleRunTests = () => {
    // Build SystemGraph from components
    const graph: SystemGraph = {
      components: [
        { id: 'client', type: 'client', config: {} },
        ...components.map((comp, i) => ({
          id: `${comp.type}_${i}`,
          type: comp.type,
          config: comp.config,
        })),
      ],
      connections: buildConnections(components),
    };

    // Run validation
    const validator = new SystemDesignValidator();
    const result = validator.validate(graph, tinyUrlProblemDefinition, currentLevel);

    setTestResults(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            TinyURL System Design Challenge
          </h1>
          <p className="text-gray-600 mt-2">
            Design a URL shortening service using real EC2 commodity machines
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Problem & Configuration */}
          <div className="space-y-6">
            {/* Problem Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Problem Requirements
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Functional Requirements
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Accept long URLs and generate short codes</li>
                    <li>Redirect short codes to original URLs</li>
                    <li>Ensure short codes are unique</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Access Patterns
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Write (creating short URLs): Low frequency</li>
                    <li>Read by key (redirecting): Very high frequency</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Data Model
                  </h3>
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <p className="font-mono text-gray-800">url_mapping:</p>
                    <ul className="ml-4 mt-1 text-gray-600 space-y-0.5">
                      <li>• short_code (PK)</li>
                      <li>• long_url</li>
                      <li>• created_at</li>
                      <li>• user_id</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Traffic Levels
                  </h3>
                  <div className="space-y-2">
                    {tinyUrlProblemDefinition.scenarios.map((scenario, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentLevel(i)}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          currentLevel === i
                            ? 'bg-blue-50 border border-blue-300 text-blue-900'
                            : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Level {i + 1}</span>
                          <span className="text-xs">
                            {scenario.traffic.rps} RPS (
                            {((scenario.traffic.readWriteRatio || 0.5) * 100).toFixed(0)}% reads)
                          </span>
                        </div>
                        <p className="text-xs mt-1 opacity-75">
                          {scenario.name.replace(`Level ${i + 1}: `, '')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Component Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Build Your Architecture
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Add components and answer questions about your design decisions
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAddComponent('app_server')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-900">App Server</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Application logic
                  </div>
                </button>

                <button
                  onClick={() => handleAddComponent('postgresql')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-900">Database</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Persistent storage
                  </div>
                </button>

                <button
                  onClick={() => handleAddComponent('redis')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-900">Cache</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Reduce DB load
                  </div>
                </button>

                <button
                  onClick={() => handleAddComponent('load_balancer')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-900">Load Balancer</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Distribute traffic
                  </div>
                </button>
              </div>
            </div>

            {/* Current Architecture */}
            {components.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Architecture
                </h2>
                <div className="space-y-3">
                  {components.map((comp, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          {getComponentName(comp.type)}
                        </div>
                        <div className="text-xs text-gray-600 space-y-0.5">
                          {renderComponentConfig(comp)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveComponent(i)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleRunTests}
                  className="mt-4 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                >
                  <Play className="w-5 h-5" />
                  Run Validation Tests
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Test Results */}
          <div className="space-y-6">
            {testResults ? (
              <>
                {/* Overall Result */}
                <div
                  className={`rounded-lg shadow-sm border-2 p-6 ${
                    testResults.passed
                      ? 'bg-green-50 border-green-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    {testResults.passed ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-600" />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {testResults.passed ? 'Test Passed!' : 'Test Failed'}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Level {currentLevel + 1} •{' '}
                        {tinyUrlProblemDefinition.scenarios[currentLevel].traffic.rps} RPS
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Latency (p99)</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {testResults.metrics.p99Latency.toFixed(0)}ms
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Error Rate</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {(testResults.metrics.errorRate * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Monthly Cost</div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${testResults.metrics.totalCost.toFixed(0)}
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-50 rounded p-3">
                      <div className="text-xs text-gray-600 mb-1">Availability</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {(testResults.metrics.availability * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottlenecks */}
                {testResults.bottlenecks && testResults.bottlenecks.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Bottlenecks Detected
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {testResults.bottlenecks.map((bottleneck: any, i: number) => (
                        <div
                          key={i}
                          className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">
                              {bottleneck.componentId}
                            </span>
                            <span className="px-2 py-1 bg-orange-200 text-orange-900 text-xs rounded-full font-medium">
                              {(bottleneck.utilization * 100).toFixed(0)}% utilized
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {bottleneck.issue}
                          </p>
                          <div className="flex items-start gap-2 text-sm">
                            <span className="text-blue-600 font-medium">💡</span>
                            <span className="text-gray-600">
                              {bottleneck.recommendation}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Component Analysis */}
                {testResults.detailedAnalysis?.componentAnalysis && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Component Analysis
                    </h3>
                    <div className="space-y-4">
                      {testResults.detailedAnalysis.componentAnalysis
                        .filter((comp: any) => comp.type !== 'client')
                        .map((comp: any, i: number) => (
                          <div
                            key={i}
                            className="p-4 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-gray-900">
                                {comp.type}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  comp.status === 'healthy'
                                    ? 'bg-green-100 text-green-800'
                                    : comp.status === 'saturated'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {comp.status}
                              </span>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Utilization:</span>
                                <span className="font-medium text-gray-900">
                                  {(comp.utilization * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Capacity:</span>
                                <span className="font-medium text-gray-900">
                                  {comp.capacity?.current || 'N/A'} RPS
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Cost:</span>
                                <span className="font-medium text-gray-900">
                                  ${comp.cost?.total?.toFixed(0) || 'N/A'}/mo
                                </span>
                              </div>
                            </div>

                            {comp.recommendations && comp.recommendations.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-600 mb-2">
                                  Recommendations:
                                </p>
                                <ul className="space-y-1">
                                  {comp.recommendations.slice(0, 2).map((rec: string, j: number) => (
                                    <li key={j} className="text-xs text-blue-600 flex items-start gap-1">
                                      <span>•</span>
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Architecture Feedback */}
                {testResults.architectureFeedback &&
                  testResults.architectureFeedback.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Architecture Feedback
                      </h3>
                      <ul className="space-y-2">
                        {testResults.architectureFeedback.map(
                          (feedback: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-gray-700"
                            >
                              <span className="text-blue-500 font-bold">→</span>
                              <span>{feedback}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Play className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Test
                </h3>
                <p className="text-sm text-gray-600">
                  Add components to your architecture and click "Run Validation Tests"
                  to see how your design performs
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Wizard Modal */}
      {showWizard && currentComponentType && (
        <ComponentConfigWizard
          componentType={currentComponentType}
          problemDefinition={tinyUrlProblemDefinition}
          onComplete={handleWizardComplete}
          onCancel={() => {
            setShowWizard(false);
            setCurrentComponentType(null);
          }}
        />
      )}
    </div>
  );
}

// Helper functions

function getComponentName(type: ComponentType): string {
  const names: Record<ComponentType, string> = {
    app_server: 'App Server',
    postgresql: 'PostgreSQL Database',
    redis: 'Redis Cache',
    load_balancer: 'Load Balancer',
  };
  return names[type] || type;
}

function renderComponentConfig(comp: ComponentConfig) {
  switch (comp.type) {
    case 'app_server':
      return (
        <>
          <div>Instance: {comp.config.instanceType || 't3.medium'}</div>
          <div>Count: {comp.config.instances || 1} instance(s)</div>
        </>
      );
    case 'postgresql':
      return (
        <>
          <div>Instance: {comp.config.instanceType || 'db.t3.medium'}</div>
          <div>Engine: {comp.config.engine || 'postgresql'}</div>
          <div>
            Isolation: {comp.config.isolationLevel || 'read-committed'}
          </div>
          {comp.config.replication?.enabled && (
            <div>
              Replication: {comp.config.replication.mode || 'async'} (
              {comp.config.replication.replicas || 1} replicas)
            </div>
          )}
        </>
      );
    case 'redis':
      return (
        <>
          <div>Instance: {comp.config.instanceType || 'cache.t3.small'}</div>
          <div>Engine: {comp.config.engine || 'redis'}</div>
          <div>Eviction: {comp.config.evictionPolicy || 'lru'}</div>
          <div>Hit Ratio: {((comp.config.hitRatio || 0.9) * 100).toFixed(0)}%</div>
          <div>Persistence: {comp.config.persistence || 'rdb'}</div>
        </>
      );
    case 'load_balancer':
      return <div>Standard configuration</div>;
    default:
      return null;
  }
}

function buildConnections(components: ComponentConfig[]) {
  const connections: any[] = [];

  // Find component indices
  const hasLB = components.some(c => c.type === 'load_balancer');
  const hasApp = components.some(c => c.type === 'app_server');
  const hasCache = components.some(c => c.type === 'redis');
  const hasDB = components.some(c => c.type === 'postgresql');

  // Build connection chain: Client → [LB] → App → [Cache] → DB
  let currentNode = 'client';

  if (hasLB) {
    connections.push({ from: currentNode, to: 'load_balancer_0' });
    currentNode = 'load_balancer_0';
  }

  if (hasApp) {
    const appIndex = components.findIndex(c => c.type === 'app_server');
    connections.push({ from: currentNode, to: `app_server_${appIndex}` });
    currentNode = `app_server_${appIndex}`;
  }

  if (hasCache) {
    const cacheIndex = components.findIndex(c => c.type === 'redis');
    connections.push({ from: currentNode, to: `redis_${cacheIndex}` });
    currentNode = `redis_${cacheIndex}`;
  }

  if (hasDB) {
    const dbIndex = components.findIndex(c => c.type === 'postgresql');
    connections.push({ from: currentNode, to: `postgresql_${dbIndex}` });
  }

  return connections;
}
