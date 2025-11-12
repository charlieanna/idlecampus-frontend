import { useState } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle, Database, X, Download, Code } from 'lucide-react';
import { SchemaEditor } from '../ui/components/SchemaEditor';
import { tinyUrlProblemDefinition } from '../challenges/tinyUrlProblemDefinition';
import { SystemDesignValidator } from '../validation/SystemDesignValidator';
import { SystemGraph } from '../types/graph';
import { RDS_INSTANCES, EC2_INSTANCES, REDIS_INSTANCES } from '../types/instanceTypes';

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
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [currentComponentType, setCurrentComponentType] = useState<ComponentType | null>(null);
  const [currentConfig, setCurrentConfig] = useState<Record<string, any>>({});
  const [testResults, setTestResults] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showPythonChallenge, setShowPythonChallenge] = useState(false);

  const handleAddComponent = (type: ComponentType) => {
    setCurrentComponentType(type);
    // Set default config based on type
    const defaultConfig = getDefaultConfig(type);
    setCurrentConfig(defaultConfig);
    setShowConfigModal(true);
  };

  const handleConfigComplete = () => {
    if (currentComponentType) {
      setComponents([...components, { type: currentComponentType, config: currentConfig }]);
    }
    setShowConfigModal(false);
    setCurrentComponentType(null);
    setCurrentConfig({});
  };

  const getDefaultConfig = (type: ComponentType): Record<string, any> => {
    switch (type) {
      case 'app_server':
        return {
          instanceType: 't3.medium',
          instances: 1,
        };
      case 'postgresql':
        return {
          instanceType: 'db.t3.medium',
          engine: 'postgresql',
          isolationLevel: 'read-committed',
          replication: { enabled: false, replicas: 1, mode: 'async' },
          storageType: 'gp3',
          storageSizeGB: 100,
          schema: [],
        };
      case 'redis':
        return {
          instanceType: 'cache.t3.small',
          engine: 'redis',
          evictionPolicy: 'lru',
          ttl: 3600,
          hitRatio: 0.9,
          persistence: 'rdb',
        };
      case 'load_balancer':
        return {};
      default:
        return {};
    }
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

  const handleDownloadPython = () => {
    // Download the Python file
    const link = document.createElement('a');
    link.href = '/tinyurl_challenge.py';
    link.download = 'tinyurl_challenge.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

            {/* Python Coding Challenge */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Coding Challenge: URL Shortening Algorithm
                  </h2>
                </div>
                <button
                  onClick={() => setShowPythonChallenge(!showPythonChallenge)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showPythonChallenge ? 'Hide' : 'Show'}
                </button>
              </div>

              {!showPythonChallenge ? (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    Practice implementing the URL shortening algorithm in Python.
                    Optimize for collision resistance, performance, and code quality.
                  </p>
                  <button
                    onClick={handleDownloadPython}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Python Template
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Implement and optimize the <code className="px-2 py-0.5 bg-gray-100 rounded text-sm font-mono">shorten(url)</code> function
                    to generate short codes for long URLs.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Requirements:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Generate 6-10 character short codes</li>
                      <li>Must be collision-resistant</li>
                      <li>Should handle 1000+ URLs per second</li>
                      <li>Can be deterministic or use collision handling</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Available Libraries:</h3>
                    <div className="flex flex-wrap gap-2">
                      <code className="px-2 py-1 bg-white rounded text-xs font-mono border border-blue-200">random</code>
                      <code className="px-2 py-1 bg-white rounded text-xs font-mono border border-blue-200">string</code>
                      <code className="px-2 py-1 bg-white rounded text-xs font-mono border border-blue-200">hashlib</code>
                      <code className="px-2 py-1 bg-white rounded text-xs font-mono border border-blue-200">base64</code>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h3 className="text-sm font-semibold text-yellow-900 mb-2">💡 Optimization Strategies:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li><strong>MD5/SHA256 + Base64</strong> - Deterministic, fast</li>
                      <li><strong>Base62 Encoding</strong> - Production-grade, no collisions</li>
                      <li><strong>Random + Collision Detection</strong> - Simple but needs retry logic</li>
                      <li><strong>Hybrid Approach</strong> - Best of both worlds</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadPython}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Template
                    </button>
                    <a
                      href="/tinyurl_challenge.py"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Code className="w-4 h-4" />
                      View in Browser
                    </a>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    The template includes test cases, multiple optimization examples, and interview tips.
                  </div>
                </div>
              )}
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

      {/* Configuration Modal */}
      {showConfigModal && currentComponentType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Configure {getComponentName(currentComponentType)}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Define configuration and data model
                </p>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {currentComponentType === 'app_server' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instance Type
                    </label>
                    <select
                      value={currentConfig.instanceType || 't3.medium'}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, instanceType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <optgroup label="T3 - Burstable">
                        <option value="t3.micro">t3.micro - 2 vCPU, 1GB RAM, 100 RPS ($8/mo)</option>
                        <option value="t3.small">t3.small - 2 vCPU, 2GB RAM, 250 RPS ($15/mo)</option>
                        <option value="t3.medium">t3.medium - 2 vCPU, 4GB RAM, 500 RPS ($30/mo)</option>
                      </optgroup>
                      <optgroup label="M5 - General Purpose">
                        <option value="m5.large">m5.large - 2 vCPU, 8GB RAM, 1000 RPS ($70/mo)</option>
                        <option value="m5.xlarge">m5.xlarge - 4 vCPU, 16GB RAM, 2000 RPS ($140/mo)</option>
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Instances
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={currentConfig.instances || 1}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, instances: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {currentComponentType === 'postgresql' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instance Type
                    </label>
                    <select
                      value={currentConfig.instanceType || 'db.t3.medium'}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, instanceType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <optgroup label="T3 - Dev/Testing">
                        <option value="db.t3.micro">db.t3.micro - 2 vCPU, 1GB RAM, 50 RPS ($13/mo)</option>
                        <option value="db.t3.small">db.t3.small - 2 vCPU, 2GB RAM, 100 RPS ($26/mo)</option>
                        <option value="db.t3.medium">db.t3.medium - 2 vCPU, 4GB RAM, 200 RPS ($53/mo)</option>
                      </optgroup>
                      <optgroup label="M5 - Production">
                        <option value="db.m5.large">db.m5.large - 2 vCPU, 8GB RAM, 500 RPS ($133/mo)</option>
                        <option value="db.m5.xlarge">db.m5.xlarge - 4 vCPU, 16GB RAM, 1000 RPS ($266/mo)</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Isolation Level
                    </label>
                    <select
                      value={currentConfig.isolationLevel || 'read-committed'}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, isolationLevel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="read-committed">Read Committed (Default)</option>
                      <option value="serializable">Serializable (Slower, more consistent)</option>
                    </select>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <label className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        checked={currentConfig.replication?.enabled || false}
                        onChange={(e) =>
                          setCurrentConfig({
                            ...currentConfig,
                            replication: {
                              ...currentConfig.replication,
                              enabled: e.target.checked,
                              replicas: 1,
                              mode: 'async',
                            },
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Enable Replication</span>
                    </label>

                    {currentConfig.replication?.enabled && (
                      <div className="ml-6 space-y-3">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Replicas:</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={currentConfig.replication?.replicas || 1}
                            onChange={(e) =>
                              setCurrentConfig({
                                ...currentConfig,
                                replication: {
                                  ...currentConfig.replication,
                                  replicas: parseInt(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">Replication Mode:</label>
                          <select
                            value={currentConfig.replication?.mode || 'async'}
                            onChange={(e) =>
                              setCurrentConfig({
                                ...currentConfig,
                                replication: {
                                  ...currentConfig.replication,
                                  mode: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="async">Async (Fast, eventual consistency)</option>
                            <option value="sync">Sync (10x slower, strong consistency)</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            Sync replication is 10x slower but guarantees no data loss
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Schema Editor */}
                  <div className="border-t border-gray-200 pt-4">
                    <SchemaEditor
                      database="TinyURL Database"
                      dbType="PostgreSQL"
                      initialSchema={currentConfig.schema}
                      onSchemaChange={(schema) =>
                        setCurrentConfig({ ...currentConfig, schema })
                      }
                    />
                  </div>
                </>
              )}

              {currentComponentType === 'redis' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instance Type
                    </label>
                    <select
                      value={currentConfig.instanceType || 'cache.t3.small'}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, instanceType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <optgroup label="T3 - Small Workloads">
                        <option value="cache.t3.micro">cache.t3.micro - 0.5GB RAM, 10K RPS ($12/mo)</option>
                        <option value="cache.t3.small">cache.t3.small - 1.4GB RAM, 25K RPS ($25/mo)</option>
                      </optgroup>
                      <optgroup label="M5 - Medium Workloads">
                        <option value="cache.m5.large">cache.m5.large - 6.4GB RAM, 50K RPS ($99/mo)</option>
                      </optgroup>
                      <optgroup label="R5 - High Memory">
                        <option value="cache.r5.large">cache.r5.large - 13GB RAM, 75K RPS ($137/mo)</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Eviction Policy
                    </label>
                    <select
                      value={currentConfig.evictionPolicy || 'lru'}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, evictionPolicy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="lru">LRU - Least Recently Used</option>
                      <option value="lfu">LFU - Least Frequently Used</option>
                      <option value="ttl">TTL - Time To Live</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      How to remove items when cache is full
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TTL (seconds): {currentConfig.ttl || 3600}
                    </label>
                    <input
                      type="range"
                      min="60"
                      max="7200"
                      step="60"
                      value={currentConfig.ttl || 3600}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, ttl: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Hit Ratio: {((currentConfig.hitRatio || 0.9) * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={currentConfig.hitRatio || 0.9}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, hitRatio: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Higher hit ratio = less database load. 90% is typical.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Persistence
                    </label>
                    <select
                      value={currentConfig.persistence || 'rdb'}
                      onChange={(e) => setCurrentConfig({ ...currentConfig, persistence: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">None - Fastest, lose data on restart</option>
                      <option value="rdb">RDB - Periodic snapshots (good balance)</option>
                      <option value="aof">AOF - Write log (most durable, +10% cost)</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfigComplete}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Component
              </button>
            </div>
          </div>
        </div>
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
