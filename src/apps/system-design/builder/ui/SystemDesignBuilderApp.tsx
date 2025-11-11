import { useState, useEffect } from 'react';
import { ReactFlowProvider, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { Challenge, Solution } from '../types/testCase';
import { SystemGraph } from '../types/graph';
import { TestResult } from '../types/testCase';
import { challenges } from '../challenges';
import { ChallengeSelector } from './components/ChallengeSelector';
import { DesignCanvas, getComponentInfo, getDefaultConfig } from './components/DesignCanvas';
import { ChallengeInfoPanel } from './components/ChallengeInfoPanel';
import { RightSidebar } from './components/RightSidebar';
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
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Reset graph when challenge changes
  useEffect(() => {
    setSystemGraph(getInitialGraph());
    setTestResults(null);
    setSelectedNode(null);
  }, [selectedChallenge?.id]);

  const handleRunTests = async () => {
    if (!selectedChallenge) return;

    setIsRunning(true);
    setTestResults(null);

    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      const runner = new TestRunner();
      const results = runner.runAllTestCases(
        systemGraph,
        selectedChallenge.testCases
      );
      setTestResults(results);
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

  const handleLoadSolution = (solution: Solution, testCaseIndex: number) => {
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
    setTestResults(null);
    setSelectedNode(null);
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
            onSelectChallenge={setSelectedChallenge}
          />
        </div>
      </div>

      {/* Main Content - Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Challenge Info */}
        {selectedChallenge && (
          <ChallengeInfoPanel
            challenge={selectedChallenge}
            testResults={testResults}
            isRunning={isRunning}
            onRunTests={handleRunTests}
            onLoadSolution={handleLoadSolution}
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

        {/* Right Panel - Component Palette / Inspector */}
        <RightSidebar
          availableComponents={selectedChallenge?.availableComponents || []}
          onAddComponent={handleAddComponent}
          selectedNode={selectedNode}
          systemGraph={systemGraph}
          onUpdateConfig={handleUpdateConfig}
          onBackToPalette={handleBackToPalette}
        />
      </div>
    </div>
  );
}
