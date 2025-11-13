import { useState } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle, Database, X, Download, Code, Settings } from 'lucide-react';
import { SchemaEditor } from '../ui/components/SchemaEditor';
import { tinyUrlProblemDefinition } from '../challenges/tinyUrlProblemDefinition';
import { SystemDesignValidator } from '../validation/SystemDesignValidator';
import { SystemGraph } from '../types/graph';
import { RDS_INSTANCES, EC2_INSTANCES, REDIS_INSTANCES } from '../types/instanceTypes';
import { getMinimalComponentConfig, getConfigDescription } from '../services/componentDefaults';

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
  const [activeTab, setActiveTab] = useState<'canvas' | 'python'>('canvas');

  const handleAddComponent = (type: ComponentType) => {
    // NEW: Instantly add component with minimal config - no modal!
    const minimalConfig = getMinimalComponentConfig(type, tinyUrlProblemDefinition);
    setComponents([...components, { type, config: minimalConfig }]);
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

  const handleRunRealExecution = async () => {
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

    // Run validation with real execution
    const validator = new SystemDesignValidator();
    setTestResults({ loading: true });

    try {
      const result = await validator.validateWithRealExecution(
        graph,
        tinyUrlProblemDefinition,
        currentLevel
      );

      if (result.success && result.result) {
        // Convert backend result format to TestResult format
        setTestResults({
          passed: result.result.passed,
          executionMode: 'real',
          metrics: {
            totalRequests: result.result.metrics.totalRequests,
            successfulRequests: result.result.metrics.successfulRequests,
            failedRequests: result.result.metrics.failedRequests,
            avgLatency: result.result.metrics.averageLatency,
            p50Latency: result.result.metrics.p50Latency,
            p95Latency: result.result.metrics.p95Latency,
            p99Latency: result.result.metrics.p99Latency,
            errorRate: result.result.metrics.errorRate,
          },
          errors: result.result.errors || [],
          databaseAvailable: result.result.databaseAvailable,
        });
      } else {
        setTestResults({
          passed: false,
          executionMode: 'real',
          error: result.error || 'Validation failed',
          details: result.details,
        });
      }
    } catch (error) {
      setTestResults({
        passed: false,
        executionMode: 'real',
        error: 'Failed to execute validation',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
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

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'canvas'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                System Design Canvas
              </div>
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'python'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Python Coding Challenge
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Canvas Tab */}
        {activeTab === 'canvas' && (
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
                Click to add components with minimal config. Connect them first, optimize later!
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
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {getComponentName(comp.type)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {getConfigDescription(comp.type)}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveComponent(i)}
                          className="text-gray-400 hover:text-red-600 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Minimal config preview */}
                      <div className="text-xs text-gray-600 space-y-0.5 mt-2 pl-3 border-l-2 border-gray-300">
                        {renderComponentConfig(comp)}
                      </div>

                      {/* Optimize button */}
                      <button
                        onClick={() => {
                          setCurrentComponentType(comp.type);
                          setCurrentConfig(comp.config);
                          setShowConfigModal(true);
                        }}
                        className="mt-2 w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1.5"
                      >
                        <Settings className="w-3 h-3" />
                        Optimize Configuration
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleRunTests}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                  >
                    <Play className="w-5 h-5" />
                    Run Simulation Test
                  </button>

                  <button
                    onClick={handleRunRealExecution}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-medium"
                    disabled={testResults?.loading}
                  >
                    <Code className="w-5 h-5" />
                    {testResults?.loading ? 'Running Real Execution...' : 'Run with Real Python + DB'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Test Results */}
          <div className="space-y-6">
            {testResults ? (
              <>
                {testResults.loading ? (
                  <div className="rounded-lg shadow-sm border-2 border-blue-500 bg-blue-50 p-6">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Running Real Execution...
                        </h2>
                        <p className="text-sm text-gray-600">
                          Executing Python code with PostgreSQL database
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
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
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-900">
                              {testResults.passed ? 'Test Passed!' : 'Test Failed'}
                            </h2>
                            {testResults.executionMode === 'real' && (
                              <span className="px-2 py-1 text-xs font-semibold bg-green-200 text-green-800 rounded">
                                REAL EXECUTION
                              </span>
                            )}
                            {!testResults.executionMode && (
                              <span className="px-2 py-1 text-xs font-semibold bg-blue-200 text-blue-800 rounded">
                                SIMULATION
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Level {currentLevel + 1} •{' '}
                            {tinyUrlProblemDefinition.scenarios[currentLevel].traffic.rps} RPS
                            {testResults.databaseAvailable !== undefined && (
                              <span className="ml-2">
                                • {testResults.databaseAvailable ? '✓ DB Connected' : '⚠ DB Unavailable'}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white bg-opacity-50 rounded p-3">
                          <div className="text-xs text-gray-600 mb-1">Latency (p99)</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {testResults.metrics.p99Latency?.toFixed(0) || 'N/A'}ms
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-50 rounded p-3">
                          <div className="text-xs text-gray-600 mb-1">Error Rate</div>
                          <div className="text-2xl font-bold text-gray-900">
                            {((testResults.metrics.errorRate || 0) * 100).toFixed(2)}%
                          </div>
                        </div>
                        {testResults.metrics.totalCost !== undefined && (
                          <div className="bg-white bg-opacity-50 rounded p-3">
                            <div className="text-xs text-gray-600 mb-1">Monthly Cost</div>
                            <div className="text-2xl font-bold text-gray-900">
                              ${testResults.metrics.totalCost.toFixed(0)}
                            </div>
                          </div>
                        )}
                        {testResults.metrics.availability !== undefined && (
                          <div className="bg-white bg-opacity-50 rounded p-3">
                            <div className="text-xs text-gray-600 mb-1">Availability</div>
                            <div className="text-2xl font-bold text-gray-900">
                              {(testResults.metrics.availability * 100).toFixed(2)}%
                            </div>
                          </div>
                        )}
                        {testResults.executionMode === 'real' && (
                          <>
                            <div className="bg-white bg-opacity-50 rounded p-3">
                              <div className="text-xs text-gray-600 mb-1">Total Requests</div>
                              <div className="text-2xl font-bold text-gray-900">
                                {testResults.metrics.totalRequests || 0}
                              </div>
                            </div>
                            <div className="bg-white bg-opacity-50 rounded p-3">
                              <div className="text-xs text-gray-600 mb-1">Successful</div>
                              <div className="text-2xl font-bold text-gray-900">
                                {testResults.metrics.successfulRequests || 0}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Execution Errors */}
                {testResults.error && (
                  <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Execution Error
                      </h3>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-900 mb-2">
                        {testResults.error}
                      </p>
                      {testResults.details && (
                        <p className="text-xs text-red-700 font-mono">
                          {testResults.details}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Python Errors */}
                {testResults.errors && testResults.errors.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Python Errors
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {testResults.errors.map((error: string, i: number) => (
                        <div
                          key={i}
                          className="p-3 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <p className="text-xs text-red-900 font-mono">{error}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
        )}

        {/* Python Tab */}
        {activeTab === 'python' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  URL Shortening Algorithm Challenge
                </h2>
                <p className="text-gray-600">
                  Practice implementing the URL shortening algorithm in Python.
                  Download the template, optimize the <code className="px-2 py-0.5 bg-gray-100 rounded text-sm font-mono">shorten(url)</code> function,
                  and test your solution against automated benchmarks.
                </p>
              </div>

              {/* Download Section */}
              <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Download Python Template
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Complete template with starter code, test suite, and multiple optimization examples.
                      Includes automated testing for correctness, collision detection, and performance.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={handleDownloadPython}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Download tinyurl_challenge.py
                      </button>
                      <a
                        href="/tinyurl_challenge.py"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        <Code className="w-4 h-4" />
                        View in Browser
                      </a>
                    </div>
                  </div>
                  <div className="text-6xl">🐍</div>
                </div>
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Requirements
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Generate 6-10 character short codes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Must be collision-resistant (&lt;1% collision rate)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Handle 1000+ URLs per second</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Use only URL-safe characters (a-z, A-Z, 0-9)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span>Can be deterministic or handle collisions</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Available Libraries
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <code className="px-3 py-1.5 bg-white rounded text-sm font-mono border border-blue-300 inline-block">
                        random
                      </code>
                      <p className="text-xs text-gray-600 mt-1 ml-1">Random string generation</p>
                    </div>
                    <div>
                      <code className="px-3 py-1.5 bg-white rounded text-sm font-mono border border-blue-300 inline-block">
                        string
                      </code>
                      <p className="text-xs text-gray-600 mt-1 ml-1">Character sets (ascii_letters, digits)</p>
                    </div>
                    <div>
                      <code className="px-3 py-1.5 bg-white rounded text-sm font-mono border border-blue-300 inline-block">
                        hashlib
                      </code>
                      <p className="text-xs text-gray-600 mt-1 ml-1">MD5, SHA256 hashing</p>
                    </div>
                    <div>
                      <code className="px-3 py-1.5 bg-white rounded text-sm font-mono border border-blue-300 inline-block">
                        base64
                      </code>
                      <p className="text-xs text-gray-600 mt-1 ml-1">Base64 encoding</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimization Strategies */}
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 mb-8">
                <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                  💡 Optimization Strategies
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-yellow-900 font-bold">1.</span>
                    <div>
                      <p className="font-semibold text-yellow-900">MD5/SHA256 + Base64</p>
                      <p className="text-gray-700">Deterministic hashing approach. Fast and collision-resistant.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-yellow-900 font-bold">2.</span>
                    <div>
                      <p className="font-semibold text-yellow-900">Base62 Encoding</p>
                      <p className="text-gray-700">Production-grade approach used by bit.ly. Zero collisions with counter-based IDs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-yellow-900 font-bold">3.</span>
                    <div>
                      <p className="font-semibold text-yellow-900">Random + Collision Detection</p>
                      <p className="text-gray-700">Simple but requires retry logic and database lookups.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-yellow-900 font-bold">4.</span>
                    <div>
                      <p className="font-semibold text-yellow-900">Hybrid Approach</p>
                      <p className="text-gray-700">Combine hashing with collision handling for best of both worlds.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📦 What's Included in the Template
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Code & Examples:</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Starter implementation</li>
                      <li>• 4 optimization approaches</li>
                      <li>• Production-ready examples</li>
                      <li>• Detailed code comments</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Testing & Validation:</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• 6 automated test cases</li>
                      <li>• Performance benchmarks</li>
                      <li>• Collision rate monitoring</li>
                      <li>• URL-safety validation</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Interview Prep:</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Trade-off discussions</li>
                      <li>• Complexity analysis</li>
                      <li>• Best practices</li>
                      <li>• Interview talking points</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Advanced Topics:</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Distributed ID generation</li>
                      <li>• Redis implementation</li>
                      <li>• Lua scripting examples</li>
                      <li>• Snowflake algorithm</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* How to Use */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  🚀 How to Use
                </h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>Download the Python template using the button above</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>Run <code className="px-2 py-0.5 bg-white rounded text-xs font-mono border border-blue-300">python tinyurl_challenge.py</code> to see the starter implementation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>Optimize the <code className="px-2 py-0.5 bg-white rounded text-xs font-mono border border-blue-300">shorten()</code> function using the provided examples</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-blue-600">4.</span>
                    <span>Test your solution against automated benchmarks and improve based on results</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-blue-600">5.</span>
                    <span>Review the interview tips and be ready to discuss trade-offs in your approach</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}
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
