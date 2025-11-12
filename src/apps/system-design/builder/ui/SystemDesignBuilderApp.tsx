import { useState, useEffect } from 'react';
import { ReactFlowProvider, Node } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import 'reactflow/dist/style.css';
import { Challenge, Solution, TestResult } from '../types/testCase';
import { SystemGraph } from '../types/graph';
import { challenges } from '../challenges';
import { ChallengeSelector } from './components/ChallengeSelector';
import { DesignCanvas, getComponentInfo, getDefaultConfig } from './components/DesignCanvas';
import { ProblemDescriptionPanel } from './components/ProblemDescriptionPanel';
import { SubmissionResultsPanel } from './components/SubmissionResultsPanel';
import { ComponentPalette } from './components/ComponentPalette';
import { InspectorModal } from './components/InspectorModal';
import { ReferenceSolutionPanel } from './components/ReferenceSolutionPanel';
import { EnhancedInspector } from './components/EnhancedInspector';
import { SystemDesignValidator } from '../validation/SystemDesignValidator';
import { tinyUrlProblemDefinition } from '../challenges/tinyUrlProblemDefinition';
import { allProblemDefinitions } from '../challenges/definitions';
import { ProblemDefinition } from '../types/problemDefinition';
import { DetailedAnalysisPanel } from './components/DetailedAnalysisPanel';
import { DesignAnalysisResult } from '../validation/DesignAnalyzer';
import Editor from '@monaco-editor/react';
import { LoadTestControls } from './components/LoadTestControls';
import { LiveMetricsDisplay } from './components/LiveMetricsDisplay';
import { LoadTestResults } from './components/LoadTestResults';
import { BottleneckAnalysis } from './components/BottleneckAnalysis';
import { loadTestService } from '../services/loadTestService';
import type { LoadTestProgress, LoadTestResults as LoadTestResultsType } from '../types/loadTest';

// Initial graph with two Client components (Write and Read)
const getInitialGraph = (): SystemGraph => ({
  components: [
    {
      id: 'write_client',
      type: 'client',
      config: {
        displayName: 'Write Client',
        subtitle: 'Creates short URLs',
      },
    },
    {
      id: 'read_client',
      type: 'client',
      config: {
        displayName: 'Read Client',
        subtitle: 'Accesses short URLs',
      },
    },
  ],
  connections: [],
});

interface SystemDesignBuilderAppProps {
  challengeId?: string;
}

export default function SystemDesignBuilderApp({ challengeId }: SystemDesignBuilderAppProps) {
  const navigate = useNavigate();

  // Find challenge by ID or default to first challenge
  const initialChallenge = challengeId
    ? challenges.find(c => c.id === challengeId) || challenges[0]
    : challenges[0];

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    initialChallenge
  );
  const [systemGraph, setSystemGraph] = useState<SystemGraph>(getInitialGraph());
  const [currentTestIndex, setCurrentTestIndex] = useState(0); // Current test being run
  const [testResults, setTestResults] = useState<Map<number, TestResult>>(new Map()); // Per-level results
  const [isRunning, setIsRunning] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track if user has submitted
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSolutionPanel, setShowSolutionPanel] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [canvasCollapsed, setCanvasCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('canvas'); // 'canvas', 'python', or component ID

  // Load test state
  const [loadTestRunning, setLoadTestRunning] = useState(false);
  const [loadTestProgress, setLoadTestProgress] = useState<LoadTestProgress | null>(null);
  const [loadTestResults, setLoadTestResults] = useState<LoadTestResultsType | null>(null);

  // Default Python starter code
  const [pythonCode, setPythonCode] = useState(`import random, string, hashlib, base64

def shorten(url: str) -> str:
    """
    Implement logic to generate a short code for the given URL.
    You can use any Python library.
    Constraints:
      - Must return a string of 6–10 chars.
      - Must avoid collisions.
      - Should be deterministic (same input → same code).
    """
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(6))

def expand(code: str, store: dict) -> str:
    """
    Optional: implement decode logic.
    \`store\` is a dict of {code: url}.
    Return the original URL or raise KeyError.
    """
    return store.get(code)
`);

  // Convert challenge ID to URL-friendly path (replace underscores with hyphens)
  const challengeIdToPath = (id: string): string => {
    return id.replace(/_/g, '-');
  };

  // Get problem definition for a challenge ID
  const getProblemDefinition = (challengeId: string): ProblemDefinition | null => {
    // Check manually created challenges first
    if (challengeId === 'tiny_url') {
      return tinyUrlProblemDefinition;
    }
    // Check generated challenges
    return allProblemDefinitions.find(def => def.id === challengeId) || null;
  };

  // Handle challenge selection - update URL and state
  const handleChallengeSelect = (challenge: Challenge) => {
    const path = challengeIdToPath(challenge.id);
    navigate(`/system-design/${path}`);
    setSelectedChallenge(challenge);
  };

  // Sync selectedChallenge with challengeId prop when URL changes
  useEffect(() => {
    if (challengeId) {
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge && challenge.id !== selectedChallenge?.id) {
        setSelectedChallenge(challenge);
      }
    }
  }, [challengeId]);

  // Reset graph when challenge changes
  useEffect(() => {
    setSystemGraph(getInitialGraph());
    setTestResults(new Map());
    setCurrentTestIndex(0);
    setHasSubmitted(false);
    setSelectedNode(null);
    setShowSolutionPanel(false);
    setActiveTab('canvas');
  }, [selectedChallenge?.id]);

  // Keyboard handler for Delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNode) {
        e.preventDefault();
        handleDeleteComponent(selectedNode.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode]);

  // Submit solution - runs all tests sequentially
  const handleSubmit = async () => {
    if (!selectedChallenge) return;

    // Get the problem definition for this challenge
    const problemDefinition = getProblemDefinition(selectedChallenge.id);
    if (!problemDefinition) {
      alert(`Problem definition not found for challenge: ${selectedChallenge.id}`);
      return;
    }

    // Clear previous results and start fresh
    setTestResults(new Map());
    setCurrentTestIndex(0);
    setIsRunning(true);
    setHasSubmitted(true);

    try {
      const validator = new SystemDesignValidator();
      const newResults = new Map<number, TestResult>();

      // Run tests sequentially, stop on first failure
      for (let i = 0; i < selectedChallenge.testCases.length; i++) {
        setCurrentTestIndex(i);

        // Simulate async operation for visual feedback
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Run the test with the correct problem definition
        const result = validator.validate(systemGraph, problemDefinition, i);

        // Store result
        newResults.set(i, result);
        setTestResults(new Map(newResults));

        // Stop on first failure
        if (!result.passed) {
          break;
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error running tests. Check console for details.');
    } finally {
      setIsRunning(false);
    }
  };

  // Handle edit design - goes back to canvas
  const handleEditDesign = () => {
    setHasSubmitted(false);
    setTestResults(new Map());
    setCurrentTestIndex(0);
  };

  // Handle try again - reruns all tests
  const handleTryAgain = () => {
    handleSubmit();
  };

  const handleAddComponent = (componentType: string) => {
    const id = `${componentType}_${Date.now()}`;

    const newComponent = {
      id,
      type: componentType as any,
      config: getDefaultConfig(componentType),
    };

    setSystemGraph({
      ...systemGraph,
      components: [...systemGraph.components, newComponent],
    });
  };

  const handleUpdateConfig = (nodeId: string, config: Record<string, any>) => {
    const updatedComponents = systemGraph.components.map((comp) =>
      comp.id === nodeId ? { ...comp, config: { ...comp.config, ...config } } : comp
    );

    setSystemGraph({
      ...systemGraph,
      components: updatedComponents,
    });
  };

  const handleBackToPalette = () => {
    setSelectedNode(null);
  };

  const handleDeleteComponent = (nodeId: string) => {
    // Find the component
    const component = systemGraph.components.find(c => c.id === nodeId);

    // Prevent deletion of client (locked component)
    if (component?.type === 'client') {
      alert('Cannot delete the Client component - it is locked');
      return;
    }

    // Remove component from components array
    const updatedComponents = systemGraph.components.filter(c => c.id !== nodeId);

    // Remove all connections involving this component
    const updatedConnections = systemGraph.connections.filter(
      conn => conn.from !== nodeId && conn.to !== nodeId
    );

    setSystemGraph({
      components: updatedComponents,
      connections: updatedConnections,
    });

    // Close inspector if this node was selected
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }

    // Switch to canvas tab if the deleted component's tab was active
    if (activeTab === nodeId) {
      setActiveTab('canvas');
    }
  };

  const handleLoadSolution = (solution: Solution) => {
    // Safety check
    if (!solution || !solution.components || !solution.connections) {
      console.error('Invalid solution structure:', solution);
      return;
    }

    // Convert solution to SystemGraph
    const components = solution.components.map((comp, index) => ({
      id: `${comp.type}_${Date.now()}_${index}`,
      type: comp.type as any,
      config: comp.config,
    }));

    // Build connections using component types
    const typeToIdMap = new Map<string, string>();
    components.forEach((comp) => {
      const type = comp.type;
      typeToIdMap.set(type, comp.id);
    });

    const connections = solution.connections.map((conn) => ({
      from: typeToIdMap.get(conn.from)!,
      to: typeToIdMap.get(conn.to)!,
    }));

    setSystemGraph({ components, connections });
    setSelectedNode(null);
    setShowSolutionPanel(false);
  };

  // Get database components for tabs (postgresql, mongodb, cassandra, redis, etc.)
  const getDatabaseComponents = () => {
    return systemGraph.components.filter(comp =>
      ['postgresql', 'mongodb', 'cassandra', 'redis', 'dynamodb'].includes(comp.type)
    );
  };

  // Get component display name for tab
  const getComponentTabLabel = (component: any) => {
    const typeLabels: Record<string, string> = {
      postgresql: '🐘 PostgreSQL',
      mongodb: '🍃 MongoDB',
      cassandra: '📊 Cassandra',
      redis: '🔴 Redis',
      dynamodb: '⚡ DynamoDB',
    };
    return typeLabels[component.type] || component.type;
  };

  const databaseComponents = getDatabaseComponents();

  // Load test handlers
  const handleRunLoadTest = async (config: Omit<LoadTestConfig, 'code' | 'challengeId'>) => {
    setLoadTestRunning(true);
    setLoadTestProgress(null);
    setLoadTestResults(null);

    try {
      const results = await loadTestService.runLoadTest(
        {
          ...config,
          code: pythonCode,
          challengeId: 'tinyurl_hash_function', // TODO: Make this dynamic based on selected challenge
        },
        (progress) => {
          setLoadTestProgress(progress);
        }
      );

      setLoadTestResults(results);
    } catch (error) {
      console.error('Load test failed:', error);
      alert('Load test failed. Check console for details.');
    } finally {
      setLoadTestRunning(false);
      setLoadTestProgress(null);
    }
  };

  const handleCancelLoadTest = () => {
    loadTestService.cancel();
    setLoadTestRunning(false);
    setLoadTestProgress(null);
  };

  const handleResetLoadTest = () => {
    setLoadTestResults(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            🏗️ System Design Builder
          </h1>
          <ChallengeSelector
            challenges={challenges}
            selectedChallenge={selectedChallenge}
            onSelectChallenge={handleChallengeSelect}
          />
        </div>
      </div>

      {/* Tab Bar - Always show with dynamic tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {/* Canvas Tab */}
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'canvas'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            🎨 Canvas
          </button>

          {/* Python Code Tab - Only for TinyURL */}
          {selectedChallenge?.id === 'tiny_url' && (
            <button
              onClick={() => setActiveTab('python')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'python'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              🐍 Python Application Server
            </button>
          )}

          {/* Dynamic Database Component Tabs */}
          {databaseComponents.map((component) => (
            <button
              key={component.id}
              onClick={() => setActiveTab(component.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === component.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {getComponentTabLabel(component)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Conditional based on active tab */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Tab Content */}
        {activeTab === 'canvas' && (
          <>
            {/* Left Panel - Problem Description OR Submission Results */}
            {selectedChallenge && (
              hasSubmitted ? (
                <SubmissionResultsPanel
                  testCases={selectedChallenge.testCases}
                  testResults={testResults}
                  isRunning={isRunning}
                  currentTestIndex={currentTestIndex}
                  onEditDesign={handleEditDesign}
                  onShowSolution={() => setShowSolutionPanel(true)}
                  onTryAgain={handleTryAgain}
                />
              ) : (
                <ProblemDescriptionPanel challenge={selectedChallenge} />
              )
            )}

            {/* Center Panel - Collapsible Design Canvas */}
            {canvasCollapsed ? (
          // Collapsed: Thin strip with expand button
          <div className="w-12 bg-gray-100 border-r border-gray-300 flex flex-col items-center justify-center">
            <button
              onClick={() => setCanvasCollapsed(false)}
              className="writing-mode-vertical px-2 py-4 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-blue-600 transition-colors rounded"
              title="Expand Canvas"
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg">◀</span>
                <span className="transform rotate-90 whitespace-nowrap text-xs">Design Canvas</span>
              </div>
            </button>
          </div>
        ) : (
          // Expanded: Full canvas with collapse button
          <div className="flex-1 relative">
            <ReactFlowProvider>
              <DesignCanvas
                systemGraph={systemGraph}
                onSystemGraphChange={setSystemGraph}
                selectedNode={selectedNode}
                onNodeSelect={setSelectedNode}
                onAddComponent={handleAddComponent}
                onUpdateConfig={handleUpdateConfig}
              />
            </ReactFlowProvider>

            {/* Collapse Button (overlay on canvas) */}
            <button
              onClick={() => setCanvasCollapsed(true)}
              className="absolute top-2 right-2 px-3 py-2 bg-white border border-gray-300 rounded shadow-md hover:bg-gray-50 hover:shadow-lg transition-all z-10"
              title="Collapse Canvas (focus on configuration)"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-700">Hide Canvas</span>
                <span className="text-sm">▶</span>
              </div>
            </button>
          </div>
        )}

            {/* Right Panel - Component Palette with Submit Button */}
            {!hasSubmitted && (
              <div className={`flex flex-col bg-white border-l border-gray-200 transition-all ${
                canvasCollapsed ? 'flex-1' : 'w-80'
              }`}>
                {/* Component Palette */}
                <div className="flex-1 overflow-y-auto">
                  <ComponentPalette
                    availableComponents={selectedChallenge?.availableComponents || []}
                    onAddComponent={handleAddComponent}
                  />
                </div>

                {/* Submit Button */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={handleSubmit}
                    disabled={isRunning}
                    className="w-full px-6 py-3 text-base font-semibold text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg transition-colors shadow-md hover:shadow-lg"
                  >
                    {isRunning ? '⏳ Running Tests...' : '▶️ Submit Solution'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Python Code Tab Content with Load Testing */}
        {activeTab === 'python' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel: Code Editor (60%) */}
            <div className="flex-1 flex flex-col bg-gray-50">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <h2 className="text-2xl font-bold text-gray-900">Application Server Implementation</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Write your Python code and test it under realistic load conditions
                </p>
              </div>

              {/* Code Editor */}
              <div className="flex-1 p-6">
                <div className="h-full border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
                  <Editor
                    height="100%"
                    defaultLanguage="python"
                    value={pythonCode}
                    onChange={(value) => setPythonCode(value || '')}
                    theme="vs-light"
                    options={{
                      minimap: { enabled: true },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 4,
                      wordWrap: 'on',
                      formatOnPaste: true,
                      formatOnType: true,
                      readOnly: loadTestRunning,
                    }}
                  />
                </div>
              </div>

              {/* Footer with actions */}
              <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  💡 Tip: Optimize for low latency and high throughput
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const blob = new Blob([pythonCode], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'tinyurl_server.py';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pythonCode);
                      alert('Code copied to clipboard!');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel: Load Testing (40%) */}
            <div className="w-2/5 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
              {!loadTestResults ? (
                <>
                  {/* Load Test Controls */}
                  {!loadTestRunning && !loadTestProgress && (
                    <LoadTestControls
                      onRunTest={handleRunLoadTest}
                      isRunning={loadTestRunning}
                      onCancel={handleCancelLoadTest}
                    />
                  )}

                  {/* Live Metrics During Test */}
                  {loadTestRunning && loadTestProgress && (
                    <div className="flex-1 flex flex-col">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Running Load Test</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Testing your code with real traffic
                        </p>
                      </div>
                      <LiveMetricsDisplay progress={loadTestProgress} />
                      <div className="p-4 border-t border-gray-200">
                        <button
                          onClick={handleCancelLoadTest}
                          className="w-full px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                          ⏹ Cancel Test
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Test Results and Bottleneck Analysis */
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <LoadTestResults
                      metrics={loadTestResults.metrics}
                      onReset={handleResetLoadTest}
                    />
                    <BottleneckAnalysis bottlenecks={loadTestResults.bottlenecks} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Database Component Tab Content */}
        {databaseComponents.map((component) => {
          if (activeTab !== component.id) return null;

          return (
            <div key={component.id} className="flex-1 flex flex-col bg-white overflow-hidden">
              <EnhancedInspector
                node={{
                  id: component.id,
                  type: component.type,
                  position: { x: 0, y: 0 },
                  data: {
                    label: getComponentTabLabel(component),
                    componentType: component.type,
                  },
                }}
                systemGraph={systemGraph}
                onUpdateConfig={handleUpdateConfig}
                isModal={false}
              />
            </div>
          );
        })}
      </div>

      {/* Inspector Modal */}
      {selectedNode && (
        <InspectorModal
          node={selectedNode}
          systemGraph={systemGraph}
          onUpdateConfig={handleUpdateConfig}
          onClose={() => setSelectedNode(null)}
          onDelete={handleDeleteComponent}
        />
      )}

      {/* Reference Solution Modal */}
      {showSolutionPanel && selectedChallenge?.testCases[0]?.solution && (
        <ReferenceSolutionPanel
          testCase={selectedChallenge.testCases[0]}
          onClose={() => setShowSolutionPanel(false)}
          onApplySolution={handleLoadSolution}
        />
      )}
    </div>
  );
}
