import { useState, useEffect } from 'react';
import { ReactFlowProvider, Node } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import 'reactflow/dist/style.css';
import { Challenge, Solution, TestResult } from '../types/testCase';
import { SystemGraph } from '../types/graph';
import { challenges } from '../challenges';
import { DesignCanvas, getComponentInfo, getDefaultConfig } from './components/DesignCanvas';
import { ProblemDescriptionPanel } from './components/ProblemDescriptionPanel';
import { SubmissionResultsPanel } from './components/SubmissionResultsPanel';
import { ComponentPalette } from './components/ComponentPalette';
import { ReferenceSolutionPanel } from './components/ReferenceSolutionPanel';
import { EnhancedInspector } from './components/EnhancedInspector';
import { ComponentJustificationModal } from './components/ComponentJustificationModal';
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
import { StorageAPIReference } from './components/StorageAPIReference';
import { PythonCodeChallengePanel } from './components/PythonCodeChallengePanel';
import { loadTestService } from '../services/loadTestService';
import type { LoadTestProgress, LoadTestResults as LoadTestResultsType, LoadTestScenario } from '../types/loadTest';
import { generateClientNodes } from '../challenges/generateClients';
import { isDatabaseComponentType, inferDatabaseType } from '../utils/database';
import { apiService } from '../../../../services/api';

// No storage.py needed - users create their own dictionaries!

// Initial graph with client components based on problem definition
const getInitialGraph = (problemDef?: ProblemDefinition | null): SystemGraph => {
  if (!problemDef) {
    // Fallback to default client if no problem definition
    return {
      components: [
        {
          id: 'client',
          type: 'client',
          config: {
            displayName: 'Client',
            subtitle: 'User requests',
          },
        },
      ],
      connections: [],
    };
  }

  // Generate clients dynamically from problem definition
  const clientComponents = generateClientNodes(problemDef);

  return {
    components: clientComponents,
    connections: [],
  };
};

interface SystemDesignBuilderAppProps {
  challengeId?: string;
}

// Get problem definition for a challenge ID
const getProblemDefinition = (challengeId: string): ProblemDefinition | null => {
  // Check manually created challenges first
  if (challengeId === 'tiny_url') {
    return tinyUrlProblemDefinition;
  }
  // Check generated challenges
  return allProblemDefinitions.find(def => def.id === challengeId) || null;
};

export default function SystemDesignBuilderApp({ challengeId }: SystemDesignBuilderAppProps) {
  const navigate = useNavigate();

  // Find challenge by ID or default to first challenge
  // Try both the original ID and with hyphens/underscores swapped
  // (some challenges use underscores, some use hyphens)
  const initialChallenge = challengeId
    ? challenges.find(c => c.id === challengeId) ||
      challenges.find(c => c.id === challengeId.replace(/-/g, '_')) ||
      challenges.find(c => c.id === challengeId.replace(/_/g, '-')) ||
      challenges[0]
    : challenges[0];

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    initialChallenge
  );

  // Initialize empty; seed after problem definition resolves to avoid incorrect default clients
  const [systemGraph, setSystemGraph] = useState<SystemGraph>({ components: [], connections: [] });
  const [currentTestIndex, setCurrentTestIndex] = useState(0); // Current test being run
  const [testResults, setTestResults] = useState<Map<number, TestResult>>(new Map()); // Per-level results
  const [isRunning, setIsRunning] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track if user has submitted
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSolutionPanel, setShowSolutionPanel] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [canvasCollapsed, setCanvasCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('canvas'); // 'canvas', 'python', or component ID
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  // Load test state
  const [loadTestRunning, setLoadTestRunning] = useState(false);
  const [loadTestProgress, setLoadTestProgress] = useState<LoadTestProgress | null>(null);
  const [loadTestResults, setLoadTestResults] = useState<LoadTestResultsType | null>(null);

  // Default Python starter code with database helpers
  const [pythonCode, setPythonCode] = useState(`# tinyurl.py
import hashlib
from typing import Optional

# You can create your own data structures here
# For example: url_map = {}

def shorten(url: str) -> Optional[str]:
    """
    Create a short code for the given URL.

    Args:
        url: The long URL to shorten

    Returns:
        A short code string, or None if invalid
    """
    # TODO: Implement this function
    # Hint: Use a dictionary to store URL mappings
    # Hint: Use hashlib to generate short codes
    pass

def expand(code: str) -> Optional[str]:
    """
    Retrieve the original URL from a short code.

    Args:
        code: The short code to expand

    Returns:
        The original URL, or None if not found
    """
    # TODO: Implement this function
    pass
`);

  // Convert challenge ID to URL-friendly path (replace underscores with hyphens)
  const challengeIdToPath = (id: string): string => {
    return id.replace(/_/g, '-');
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
    const problemDef = selectedChallenge ? getProblemDefinition(selectedChallenge.id) : null;
    setSystemGraph(getInitialGraph(problemDef));
    setTestResults(new Map());
    setCurrentTestIndex(0);
    setHasSubmitted(false);
    setSelectedNode(null);
    setShowSolutionPanel(false);
    setActiveTab('canvas');

    // Update Python code from challenge template if available
    if (selectedChallenge?.pythonTemplate) {
      setPythonCode(selectedChallenge.pythonTemplate);
    }
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

    // Justifications are optional for now (testing purposes)
    // No validation required before submission

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
    setLoadTestResults(null);
    setLoadTestProgress(null);

    try {
      const validator = new SystemDesignValidator();
      const newResults = new Map<number, TestResult>();

      // Step 1: Run system design validation tests
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

      // Step 2: If all system design tests passed, run load test automatically
      const allTestsPassed = Array.from(newResults.values()).every(r => r.passed);
      if (allTestsPassed) {
        // Show loading message
        setLoadTestRunning(true);

        // Run load test with default configuration
        const loadTestConfig = {
          scenario: 'quick' as LoadTestScenario,
          rps: 100,
          duration: 5,
          readWriteRatio: 0.8,
        };

        // Use the user's code directly - no storage.py needed
        const fullCode = pythonCode;

        const loadTestResults = await loadTestService.runLoadTest(
          {
            ...loadTestConfig,
            code: fullCode,
            challengeId: selectedChallenge.id,
          },
          (progress) => {
            setLoadTestProgress(progress);
          }
        );

        setLoadTestResults(loadTestResults);
        setLoadTestRunning(false);
        setLoadTestProgress(null);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error running tests. Check console for details.');
    } finally {
      setIsRunning(false);
      setLoadTestRunning(false);
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

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000); // Hide after 4 seconds
  };

  const handleAddComponent = (componentType: string, additionalConfig?: any) => {
    const id = `${componentType}_${Date.now()}`;

    const defaultConfig = getDefaultConfig(componentType);
    const config = additionalConfig ? { ...defaultConfig, ...additionalConfig } : defaultConfig;

    const newComponent = {
      id,
      type: componentType as any,
      config,
    };

    setSystemGraph({
      ...systemGraph,
      components: [...systemGraph.components, newComponent],
    });

    // Show toast notification for database and cache components
    if (componentType === 'database' || componentType === 'postgresql' || componentType === 'mongodb') {
      showToast('✅ Database added! Use db_write() and db_read() in the Python tab to interact with it.');
    } else if (componentType === 'cache' || componentType === 'redis') {
      showToast('⚡ Cache added! Use cache_set() and cache_get() in the Python tab for fast data access.');
    } else if (componentType === 'app_server') {
      showToast('📦 App Server added! Write your implementation logic in the Python tab.');
    }
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

  const handleSaveJustification = (nodeId: string, justification: string) => {
    const updatedComponents = systemGraph.components.map((comp) =>
      comp.id === nodeId ? { ...comp, config: { ...comp.config, justification } } : comp
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

  // Get configurable components for tabs (database, cache, message_queue)
  const getDatabaseComponents = () => {
    return systemGraph.components.filter(comp =>
      isDatabaseComponentType(comp.type) || ['cache', 'message_queue'].includes(comp.type)
    );
  };

  // Get component display name for tab
  const getComponentTabLabel = (component: any) => {
    // For database component, always show "Database"
    // (the specific type is visible on the canvas node)
    if (isDatabaseComponentType(component.type)) {
      return '💾 Database';
    }

    // For cache component, always show "Cache"
    // (the specific type is visible on the canvas node if needed)
    if (component.type === 'cache') {
      return '⚡ Cache';
    }

    const typeLabels: Record<string, string> = {
      message_queue: '📮 Message Queue',
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
      // Use the user's code directly
      const fullCode = pythonCode;

      const results = await loadTestService.runLoadTest(
        {
          ...config,
          code: fullCode,
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

  // Handler for running Python test cases (for LeetCode-style interface)
  const handleRunPythonTests = async (code: string, testCases: any[]): Promise<any[]> => {
    // Use the user's code directly
    const fullCode = code;

    const results = [];

    try {
      // Execute each test case
      for (const testCase of testCases) {
        const startTime = Date.now();
        const operationResults = [];
        let testPassed = true;
        let testError: string | undefined;

        // Store previous results for RESULT_FROM_PREV placeholders
        const previousResults: string[] = [];

        try {
          // Execute each operation in the test case sequentially
          for (const op of testCase.operations) {
            // Replace RESULT_FROM_PREV placeholders with actual previous results
            let actualInput = op.input;
            if (actualInput === 'RESULT_FROM_PREV') {
              actualInput = previousResults[previousResults.length - 1] || '';
            } else if (actualInput.startsWith('RESULT_FROM_PREV_')) {
              const index = parseInt(actualInput.split('_')[3]);
              actualInput = previousResults[index] || '';
            }

            // Create test code that calls the function and prints the result
            const testCode = fullCode + `\n\n# Test execution\nresult = ${op.method}("${actualInput}")\nprint(result if result is not None else "None")`;

            // Execute the code
            const response = await apiService.executeCode(
              'tinyurl_hash_function', // Challenge ID for TinyURL
              testCode,
              '' // No separate test input needed since we're including it in the code
            );

            const executionTime = Date.now() - startTime;

            // Parse the result from stdout
            let actual = response.output?.trim() || response.stdout?.trim() || '';
            let opPassed = false;

            // Handle different expected value types
            if (op.expected === 'VALID_CODE') {
              // For VALID_CODE, check if result is a non-empty string
              opPassed = actual && actual !== 'None' && actual.length >= 6;
              previousResults.push(actual);
            } else if (op.expected === null) {
              // For null, check if result is None
              opPassed = actual === 'None' || actual === '';
            } else if (op.expected === 'RESULT_FROM_PREV') {
              // For RESULT_FROM_PREV, check if it matches the previous result
              const expectedValue = previousResults[previousResults.length - 1];
              opPassed = actual === expectedValue;
            } else {
              // For exact match
              opPassed = actual === op.expected;
            }

            if (!opPassed) {
              testPassed = false;
            }

            operationResults.push({
              method: op.method,
              input: actualInput,
              expected: op.expected === 'VALID_CODE' ? '<valid code>' :
                       op.expected === 'RESULT_FROM_PREV' ? previousResults[previousResults.length - 1] :
                       op.expected === null ? 'None' :
                       op.expected,
              actual: actual || 'None',
              passed: opPassed
            });

            // If there was an error in execution, record it
            if (response.error) {
              testError = response.error;
              testPassed = false;
              break;
            }
          }
        } catch (error) {
          testPassed = false;
          testError = error instanceof Error ? error.message : 'Unknown error during execution';
        }

        const executionTime = Date.now() - startTime;

        results.push({
          testId: testCase.id,
          testName: testCase.name,
          passed: testPassed,
          operations: operationResults,
          error: testError,
          executionTime
        });
      }
    } catch (error) {
      console.error('Error running Python tests:', error);
      // Return error result
      return testCases.map(tc => ({
        testId: tc.id,
        testName: tc.name,
        passed: false,
        operations: [],
        error: error instanceof Error ? error.message : 'Failed to execute tests',
        executionTime: 0
      }));
    }

    return results;
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back to All Problems Button */}
          <button
            onClick={() => navigate('/system-design')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            title="View all problems"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            All Problems
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">
              🏗️ System Design Builder
            </h1>
            <span className="text-gray-300">|</span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {selectedChallenge?.title}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {selectedChallenge?.difficulty}
              </span>
            </div>
          </div>
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

          {/* Python Code Tab - Shows when app server exists */}
          {systemGraph.components.some(comp => comp.type === 'app_server') && (
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

        {/* Python Code Tab Content - LeetCode Style */}
        {activeTab === 'python' && (
          <PythonCodeChallengePanel
            pythonCode={pythonCode}
            setPythonCode={setPythonCode}
            onRunTests={handleRunPythonTests}
            onSubmit={handleSubmit}
          />
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

      {/* Component Justification Modal */}
      {selectedNode && selectedNode.data.componentType !== 'client' && (
        <ComponentJustificationModal
          node={selectedNode}
          initialJustification={
            systemGraph.components.find(c => c.id === selectedNode.id)?.config?.justification || ''
          }
          onSave={handleSaveJustification}
          onClose={() => setSelectedNode(null)}
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 max-w-md">
            <span className="text-lg">{toastMessage.split(' ')[0]}</span>
            <span className="text-sm">{toastMessage.substring(toastMessage.indexOf(' ') + 1)}</span>
          </div>
        </div>
      )}

    </div>
  );
}
