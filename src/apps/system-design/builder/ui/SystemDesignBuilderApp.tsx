import { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { Challenge } from '../types/testCase';
import { SystemGraph } from '../types/graph';
import { TestResult } from '../types/testCase';
import { challenges } from '../challenges';
import { ChallengeSelector } from './components/ChallengeSelector';
import { DesignCanvas } from './components/DesignCanvas';
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

  // Reset graph when challenge changes
  useEffect(() => {
    setSystemGraph(getInitialGraph());
    setTestResults(null);
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

  const handleClearResults = () => {
    setTestResults(null);
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
        <button
          onClick={handleRunTests}
          disabled={isRunning || systemGraph.components.length === 0}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isRunning || systemGraph.components.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunning ? '⏳ Running...' : '▶️ Run Simulation'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ReactFlowProvider>
          <DesignCanvas
            challenge={selectedChallenge}
            systemGraph={systemGraph}
            onSystemGraphChange={setSystemGraph}
            testResults={testResults}
            onClearResults={handleClearResults}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
