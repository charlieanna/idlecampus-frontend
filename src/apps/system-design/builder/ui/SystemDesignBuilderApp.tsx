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
import { SystemDesignValidator } from '../validation/SystemDesignValidator';
import { tinyUrlProblemDefinition } from '../challenges/tinyUrlProblemDefinition';
import { DetailedAnalysisPanel } from './components/DetailedAnalysisPanel';
import { DesignAnalysisResult } from '../validation/DesignAnalyzer';

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

  // Map challenge IDs to URL paths
  const challengeIdToPath: Record<string, string> = {
    'tiny_url': 'tiny-url',
    'food_blog': 'food-blog',
    'todo_app': 'todo-app',
  };

  // Handle challenge selection - update URL and state
  const handleChallengeSelect = (challenge: Challenge) => {
    const path = challengeIdToPath[challenge.id] || challenge.id;
    navigate(`/system-design/${path}`);
    setSelectedChallenge(challenge);
  };

  // Reset graph when challenge changes
  useEffect(() => {
    setSystemGraph(getInitialGraph());
    setTestResults(new Map());
    setCurrentTestIndex(0);
    setHasSubmitted(false);
    setSelectedNode(null);
    setShowSolutionPanel(false);
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

        // Run the test
        const result = validator.validate(systemGraph, tinyUrlProblemDefinition, i);

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

      {/* Main Content - Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
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
