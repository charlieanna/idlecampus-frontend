import { useState, useEffect } from 'react';
import { ReactFlowProvider, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { Challenge, Solution, TestResult } from '../types/testCase';
import { SystemGraph } from '../types/graph';
import { challenges } from '../challenges';
import { ChallengeSelector } from './components/ChallengeSelector';
import { DesignCanvas, getComponentInfo, getDefaultConfig } from './components/DesignCanvas';
import { ProgressiveTestSidebar } from './components/ProgressiveTestSidebar';
import { ProgressiveGuidancePanel } from './components/ProgressiveGuidancePanel';
import { ComponentPalette } from './components/ComponentPalette';
import { EnhancedInspector } from './components/EnhancedInspector';
import { ReferenceSolutionPanel } from './components/ReferenceSolutionPanel';
import { TestRunner } from '../simulation/testRunner';

// Initial graph with Client component
const getInitialGraph = (): SystemGraph => ({
  components: [
    {
      id: 'client_1',
      type: 'client',
      config: {},
    },
  ],
  connections: [],
});

export default function SystemDesignBuilderApp() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    challenges[0] // Start with Tiny URL
  );
  const [systemGraph, setSystemGraph] = useState<SystemGraph>(getInitialGraph());
  const [activeTestIndex, setActiveTestIndex] = useState(0); // Current level
  const [testResults, setTestResults] = useState<Map<number, TestResult>>(new Map()); // Per-level results
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showSolutionPanel, setShowSolutionPanel] = useState(false);

  // Reset graph when challenge changes
  useEffect(() => {
    setSystemGraph(getInitialGraph());
    setTestResults(new Map());
    setActiveTestIndex(0);
    setSelectedNode(null);
    setShowSolutionPanel(false);
  }, [selectedChallenge?.id]);

  const handleRunTest = async (testIndex: number) => {
    if (!selectedChallenge) return;

    setIsRunning(true);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const runner = new TestRunner();
      const testCase = selectedChallenge.testCases[testIndex];
      const result = runner.runTestCase(systemGraph, testCase);

      // Update results map
      const newResults = new Map(testResults);
      newResults.set(testIndex, result);
      setTestResults(newResults);
    } catch (error) {
      console.error('Simulation error:', error);
      alert('Error running simulation. Check console for details.');
    } finally {
      setIsRunning(false);
    }
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

  const handleLoadSolution = (solution: Solution) => {
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

  const currentTestCase = selectedChallenge?.testCases[activeTestIndex];
  const currentTestResult = currentTestCase ? testResults.get(activeTestIndex) : undefined;

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
            onSelectChallenge={setSelectedChallenge}
          />
        </div>
      </div>

      {/* Main Content - Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Progressive Test Sidebar */}
        {selectedChallenge && (
          <ProgressiveTestSidebar
            testCases={selectedChallenge.testCases}
            activeTestIndex={activeTestIndex}
            testResults={testResults}
            onSelectTest={setActiveTestIndex}
            onRunTest={handleRunTest}
          />
        )}

        {/* Center Panel - Design Canvas */}
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

        {/* Right Panel - Progressive Guidance + Palette/Inspector */}
        <div className="flex flex-col w-96 bg-white border-l border-gray-200">
          {/* Top: Progressive Guidance Panel */}
          {currentTestCase && (
            <div className="flex-shrink-0">
              <ProgressiveGuidancePanel
                testCase={currentTestCase}
                testResult={currentTestResult}
                currentComponentCount={systemGraph.components.length}
                onShowSolution={() => setShowSolutionPanel(true)}
              />
            </div>
          )}

          {/* Bottom: Component Palette or Inspector */}
          <div className="flex-1 overflow-y-auto border-t border-gray-200">
            {selectedNode ? (
              <EnhancedInspector
                node={selectedNode}
                systemGraph={systemGraph}
                onUpdateConfig={handleUpdateConfig}
                onBack={handleBackToPalette}
              />
            ) : (
              <ComponentPalette
                availableComponents={selectedChallenge?.availableComponents || []}
                onAddComponent={handleAddComponent}
              />
            )}
          </div>
        </div>
      </div>

      {/* Reference Solution Modal */}
      {showSolutionPanel && currentTestCase?.solution && (
        <ReferenceSolutionPanel
          testCase={currentTestCase}
          onClose={() => setShowSolutionPanel(false)}
          onApplySolution={handleLoadSolution}
        />
      )}
    </div>
  );
}
