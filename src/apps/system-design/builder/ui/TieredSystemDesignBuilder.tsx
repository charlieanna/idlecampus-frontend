import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Code,
  Settings,
  Architecture,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Info,
  BookOpen,
  Target
} from 'lucide-react';

// Import our new tiered components
import { TieredChallengeSelector } from './components/TieredChallengeSelector';
import { AlgorithmConfigModal } from './components/AlgorithmConfigModal';
import { PythonExecutionStatus } from './components/PythonExecutionStatus';
import { ComponentBehaviorVisualizer } from './components/ComponentBehaviorVisualizer';
import { PythonCodeChallengePanel } from './components/PythonCodeChallengePanel';

// Import existing components
import { DesignCanvas } from './components/DesignCanvas';
import { ResultsPanel } from './components/ResultsPanel';

// Import types and services
import { TieredChallenge, getTierUIRequirements } from '../types/challengeTiers';
import { ComponentNode, ComponentType } from '../types/component';
import { SystemGraph } from '../types/graph';
import { TestResult } from '../types/testCase';
import { pythonExecutor, BenchmarkResult } from '../services/pythonExecutor';
import { SimulationEngine } from '../simulation/engine';

// Import example challenges
import { tinyUrlTieredChallenge } from '../challenges/tier1/tinyUrlTiered';
import { twitterFeedTieredChallenge } from '../challenges/tier2/twitterFeedTiered';
import { uberMatchingTieredChallenge } from '../challenges/tier3/uberMatchingTiered';

/**
 * Main Tiered System Design Builder
 *
 * Integrates all three tiers of challenges with appropriate UI
 */
export function TieredSystemDesignBuilder() {
  // Challenge and tier state
  const [selectedChallenge, setSelectedChallenge] = useState<TieredChallenge | null>(null);
  const [showChallengeSelector, setShowChallengeSelector] = useState(true);

  // Component and graph state
  const [components, setComponents] = useState<ComponentNode[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Algorithm configuration (Tier 2)
  const [algorithmConfig, setAlgorithmConfig] = useState<Record<string, string>>({});
  const [showAlgorithmModal, setShowAlgorithmModal] = useState(false);

  // Python code state (Tier 1)
  const [pythonCode, setPythonCode] = useState<Record<string, string>>({});
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [pythonBenchmarks, setPythonBenchmarks] = useState<Record<string, BenchmarkResult>>({});
  const [isExecutingPython, setIsExecutingPython] = useState(false);

  // Test results state
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // View state
  const [activeView, setActiveView] = useState<'design' | 'code' | 'results'>('design');
  const [showBehaviorPanel, setShowBehaviorPanel] = useState(true);

  // Available challenges (would come from API in production)
  const availableChallenges: TieredChallenge[] = [
    tinyUrlTieredChallenge,
    twitterFeedTieredChallenge,
    uberMatchingTieredChallenge,
  ];

  // Initialize challenge
  useEffect(() => {
    if (selectedChallenge) {
      const uiReqs = getTierUIRequirements(selectedChallenge.implementationTier);

      // Show appropriate UI based on tier
      if (uiReqs.needsCodeEditor) {
        setShowCodeEditor(true);
        // Initialize Python templates
        const templates: Record<string, string> = {};
        selectedChallenge.requiredImplementations?.forEach(impl => {
          templates[impl.fileName] = impl.template;
        });
        setPythonCode(templates);
      }

      if (uiReqs.needsAlgorithmConfig && selectedChallenge.configurableAlgorithms) {
        // Initialize with defaults
        const defaults: Record<string, string> = {};
        selectedChallenge.configurableAlgorithms.forEach(alg => {
          defaults[alg.algorithmKey] = alg.defaultOption;
        });
        setAlgorithmConfig(defaults);
      }
    }
  }, [selectedChallenge]);

  // Handle challenge selection
  const handleChallengeSelect = (challenge: TieredChallenge) => {
    setSelectedChallenge(challenge);
    setShowChallengeSelector(false);
    setComponents([]);
    setConnections([]);
    setTestResults([]);
  };

  // Handle component addition
  const handleAddComponent = (type: ComponentType) => {
    const newComponent: ComponentNode = {
      id: `${type}_${Date.now()}`,
      type,
      config: {},
    };

    // Check if component needs custom logic (Tier 1)
    if (selectedChallenge?.implementationTier === 'simple') {
      const impl = selectedChallenge.requiredImplementations?.find(
        i => i.componentType === type
      );
      if (impl) {
        newComponent.customLogic = {
          enabled: true,
          pythonFile: impl.fileName,
          functionName: impl.functions[0]?.name,
        };
      }
    }

    setComponents([...components, newComponent]);
  };

  // Handle running tests
  const handleRunTests = async () => {
    if (!selectedChallenge) return;

    setIsRunningTests(true);

    try {
      // For Tier 1: Benchmark Python code first
      if (selectedChallenge.implementationTier === 'simple' && pythonCode) {
        setIsExecutingPython(true);

        for (const [fileName, code] of Object.entries(pythonCode)) {
          const impl = selectedChallenge.requiredImplementations?.find(
            i => i.fileName === fileName
          );
          if (impl) {
            for (const func of impl.functions) {
              const result = await pythonExecutor.benchmark(
                code,
                func.name,
                generateSampleInputs(func.name),
                undefined,
                selectedChallenge.benchmarkSettings
              );

              setPythonBenchmarks(prev => ({
                ...prev,
                [func.name]: result,
              }));

              // Update component with benchmarked latency
              setComponents(prev => prev.map(comp => {
                if (comp.customLogic?.functionName === func.name) {
                  return {
                    ...comp,
                    customLogic: {
                      ...comp.customLogic,
                      benchmarkedLatency: result.avgLatency,
                    },
                  };
                }
                return comp;
              }));
            }
          }
        }

        setIsExecutingPython(false);
      }

      // Build system graph
      const graph: SystemGraph = {
        components,
        connections,
      };

      // Run simulation
      const engine = new SimulationEngine();
      const results: TestResult[] = [];

      for (const testCase of selectedChallenge.testCases) {
        const result = engine.simulateTraffic(graph, testCase);

        const passed = checkTestPassed(result.metrics, testCase.passCriteria);

        results.push({
          passed,
          metrics: result.metrics,
          bottlenecks: [],
          explanation: generateTestExplanation(testCase, result.metrics, passed),
          componentMetrics: result.componentMetrics,
        });
      }

      setTestResults(results);
      setActiveView('results');
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunningTests(false);
      setIsExecutingPython(false);
    }
  };

  // Helper: Generate sample inputs for benchmarking
  const generateSampleInputs = (functionName: string): any[] => {
    switch (functionName) {
      case 'shorten':
        return Array.from({ length: 100 }, (_, i) => `https://example.com/page/${i}`);
      case 'redirect':
      case 'expand':
        return Array.from({ length: 100 }, (_, i) => `abc${i}`);
      case 'process_message':
        return Array.from({ length: 100 }, (_, i) => ({
          short_code: `abc${i}`,
          long_url: `https://example.com/page/${i}`,
          timestamp: Date.now(),
        }));
      default:
        return Array.from({ length: 100 }, (_, i) => `input_${i}`);
    }
  };

  // Helper: Check if test passed
  const checkTestPassed = (metrics: any, criteria: any): boolean => {
    if (criteria.maxP99Latency && metrics.p99Latency > criteria.maxP99Latency) return false;
    if (criteria.maxErrorRate && metrics.errorRate > criteria.maxErrorRate) return false;
    if (criteria.maxMonthlyCost && metrics.monthlyCost > criteria.maxMonthlyCost) return false;
    if (criteria.minAvailability && metrics.availability < criteria.minAvailability) return false;
    return true;
  };

  // Helper: Generate test explanation
  const generateTestExplanation = (testCase: any, metrics: any, passed: boolean): string => {
    if (passed) {
      return `✅ Test passed! P99 latency: ${metrics.p99Latency.toFixed(0)}ms, Error rate: ${(metrics.errorRate * 100).toFixed(2)}%`;
    } else {
      const issues = [];
      if (testCase.passCriteria.maxP99Latency && metrics.p99Latency > testCase.passCriteria.maxP99Latency) {
        issues.push(`P99 latency ${metrics.p99Latency.toFixed(0)}ms > ${testCase.passCriteria.maxP99Latency}ms`);
      }
      if (testCase.passCriteria.maxErrorRate && metrics.errorRate > testCase.passCriteria.maxErrorRate) {
        issues.push(`Error rate ${(metrics.errorRate * 100).toFixed(2)}% > ${(testCase.passCriteria.maxErrorRate * 100).toFixed(2)}%`);
      }
      return `❌ Test failed: ${issues.join(', ')}`;
    }
  };

  if (showChallengeSelector) {
    return (
      <div className="h-screen flex bg-gray-50">
        <div className="w-full max-w-6xl mx-auto p-8">
          <TieredChallengeSelector
            challenges={availableChallenges}
            onSelectChallenge={handleChallengeSelect}
          />
        </div>
      </div>
    );
  }

  if (!selectedChallenge) return null;

  const uiReqs = getTierUIRequirements(selectedChallenge.implementationTier);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowChallengeSelector(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900">{selectedChallenge.title}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`
                  inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium
                  ${selectedChallenge.implementationTier === 'simple' ? 'bg-green-100 text-green-800' :
                    selectedChallenge.implementationTier === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}
                `}>
                  {selectedChallenge.implementationTier === 'simple' && <Code className="w-3 h-3" />}
                  {selectedChallenge.implementationTier === 'moderate' && <Settings className="w-3 h-3" />}
                  {selectedChallenge.implementationTier === 'advanced' && <Architecture className="w-3 h-3" />}
                  <span>
                    Tier {selectedChallenge.implementationTier === 'simple' ? 1 :
                          selectedChallenge.implementationTier === 'moderate' ? 2 : 3}
                  </span>
                </span>

                <span className="text-sm text-gray-600">
                  {selectedChallenge.requirements.traffic}
                </span>
              </div>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveView('design')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'design'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Architecture className="w-4 h-4 inline mr-2" />
              Design
            </button>

            {uiReqs.needsCodeEditor && (
              <button
                onClick={() => setActiveView('code')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'code'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Code className="w-4 h-4 inline mr-2" />
                Code
              </button>
            )}

            {testResults.length > 0 && (
              <button
                onClick={() => setActiveView('results')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'results'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Target className="w-4 h-4 inline mr-2" />
                Results
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {uiReqs.needsAlgorithmConfig && (
              <button
                onClick={() => setShowAlgorithmModal(true)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Configure Algorithms</span>
              </button>
            )}

            <button
              onClick={handleRunTests}
              disabled={isRunningTests}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isRunningTests ? 'Running...' : 'Run Tests'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {activeView === 'design' && (
            <div className="p-4 space-y-4">
              {/* Problem Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  {selectedChallenge.requirements.functional.map((req, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Component Palette */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Available Components</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedChallenge.availableComponents.map(type => (
                    <button
                      key={type}
                      onClick={() => handleAddComponent(type as ComponentType)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4 inline mr-1" />
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Python Execution Status (Tier 1) */}
              {isExecutingPython && (
                <PythonExecutionStatus
                  isExecuting={isExecutingPython}
                  benchmarkResult={Object.values(pythonBenchmarks)[0]}
                  componentType="app_server"
                  functionName="shorten"
                />
              )}
            </div>
          )}
        </div>

        {/* Center: Canvas or Code Editor */}
        <div className="flex-1 p-4">
          {activeView === 'design' && (
            <div className="h-full bg-white rounded-lg border border-gray-200 p-4">
              <DesignCanvas
                components={components}
                connections={connections}
                onComponentsChange={setComponents}
                onConnectionsChange={setConnections}
              />
            </div>
          )}

          {activeView === 'code' && uiReqs.needsCodeEditor && (
            <PythonCodeChallengePanel
              pythonCode={pythonCode['app_server.py'] || ''}
              setPythonCode={(code) => setPythonCode(prev => ({...prev, 'app_server.py': code}))}
              onRunTests={async () => {}}
              onSubmit={() => {}}
            />
          )}

          {activeView === 'results' && testResults.length > 0 && (
            <ResultsPanel
              results={testResults}
              testCases={selectedChallenge.testCases}
            />
          )}
        </div>

        {/* Right Panel: Behavior Visualizer */}
        {showBehaviorPanel && activeView === 'design' && (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto p-4">
            <ComponentBehaviorVisualizer
              components={components}
              challenge={selectedChallenge}
              selectedComponentId={selectedComponentId}
              onSelectComponent={setSelectedComponentId}
            />
          </div>
        )}
      </div>

      {/* Algorithm Configuration Modal (Tier 2) */}
      {selectedChallenge.configurableAlgorithms && (
        <AlgorithmConfigModal
          isOpen={showAlgorithmModal}
          onClose={() => setShowAlgorithmModal(false)}
          algorithms={selectedChallenge.configurableAlgorithms}
          onConfigComplete={setAlgorithmConfig}
          challengeTitle={selectedChallenge.title}
        />
      )}
    </div>
  );
}