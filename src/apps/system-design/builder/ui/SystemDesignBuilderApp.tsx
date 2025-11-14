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
  const [challengeMode, setChallengeMode] = useState(false); // Toggle for Challenge Mode
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  // Load test state
  const [loadTestRunning, setLoadTestRunning] = useState(false);
  const [loadTestProgress, setLoadTestProgress] = useState<LoadTestProgress | null>(null);
  const [loadTestResults, setLoadTestResults] = useState<LoadTestResultsType | null>(null);

  // Default Python starter code with database helpers
  const [pythonCode, setPythonCode] = useState(`# TinyURL Implementation
# Your code runs in the App Server component

import hashlib
import random
import string
from typing import Optional, Dict, Any

# ===========================================
# 📦 STORAGE API (PROVIDED)
# ===========================================
# These helpers provide in-memory storage for your URL shortener.
# In production, this would connect to the databases and caches
# shown in your system design canvas.
#
# Available Methods:
#   • store(key, value) - Save a key-value pair
#   • retrieve(key) - Get a value by key
#   • exists(key) - Check if a key exists
#
# Note: All data is stored in memory during test execution.
# ===========================================

# In-memory storage (simulates production database/cache)
storage = {}

def store(key: str, value: Any) -> bool:
    """
    Store a key-value pair in memory.

    Args:
        key: Unique identifier (e.g., 'abc123')
        value: Data to store (e.g., 'https://example.com')

    Returns:
        True if successful

    In production: Would persist to database
    """
    storage[key] = value
    return True

def retrieve(key: str) -> Optional[Any]:
    """
    Retrieve a value by key.

    Args:
        key: The key to look up

    Returns:
        Stored value or None if not found

    In production: Would query database/cache
    """
    return storage.get(key)

def exists(key: str) -> bool:
    """
    Check if a key exists in storage.

    Args:
        key: The key to check

    Returns:
        True if key exists, False otherwise
    """
    return key in storage

# ===========================================
# 🚀 YOUR IMPLEMENTATION BELOW
# ===========================================

def shorten(url: str) -> str:
    """
    Create a short code for the given URL.

    Implementation tips:
    - Choose a strategy: hash-based, counter, or random
    - Handle duplicate URLs (return same code)
    - Consider collision handling
    - Return None for invalid input

    Args:
        url: Original long URL to shorten

    Returns:
        Short code (e.g., 'abc123') or None
    """
    if not url:
        return None

    # Check if URL already exists (return same code for same URL)
    for key, value in storage.items():
        if value == url:
            return key

    # Strategy: Hash first 6 chars of MD5
    hash_value = hashlib.md5(url.encode()).hexdigest()[:6]

    # Handle collisions (if hash already exists with different URL)
    original_hash = hash_value
    counter = 0
    while exists(hash_value) and retrieve(hash_value) != url:
        counter += 1
        hash_value = original_hash + str(counter)

    # Store the URL mapping
    store(hash_value, url)

    return hash_value


def expand(code: str) -> str:
    """
    Retrieve the original URL from a short code.

    Args:
        code: Short code to expand

    Returns:
        Original URL or None if not found
    """
    if not code:
        return None

    # Simply retrieve from storage
    return retrieve(code)
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

  // Function to transform Python code to Challenge Mode (empty signatures)
  const transformToChallengMode = (code: string): string => {
    const lines = code.split('\n');
    const result: string[] = [];
    let insideFunction = false;
    let functionIndent = 0;
    let insideDocstring = false;
    let docstringQuote = '';

    for (const line of lines) {
      // Check if this is a function definition
      if (line.trim().startsWith('def ')) {
        result.push(line);
        insideFunction = true;
        functionIndent = line.length - line.trimStart().length;
        insideDocstring = false;
        continue;
      }

      if (insideFunction) {
        const currentIndent = line.length - line.trimStart().length;

        // Handle docstrings
        if (!insideDocstring && (line.trim().startsWith('"""') || line.trim().startsWith("'''"))) {
          insideDocstring = true;
          docstringQuote = line.includes('"""') ? '"""' : "'''";
          result.push(line);
          // Check if docstring ends on same line
          if (line.split(docstringQuote).length - 1 === 2) {
            insideDocstring = false;
            // Add TODO and pass after docstring
            const indent = ' '.repeat(functionIndent + 4);
            result.push(`${indent}# TODO: Implement your solution`);
            result.push(`${indent}pass`);
          }
          continue;
        }

        if (insideDocstring) {
          result.push(line);
          if (line.includes(docstringQuote)) {
            insideDocstring = false;
            // Add TODO and pass after docstring
            const indent = ' '.repeat(functionIndent + 4);
            result.push(`${indent}# TODO: Implement your solution`);
            result.push(`${indent}pass`);
          }
          continue;
        }

        // Check if we're at same or lower indentation (new function or non-function code)
        if (line.trim() && currentIndent <= functionIndent) {
          insideFunction = false;
          result.push(line);
        } else if (!line.trim()) {
          // Keep empty lines between functions
          if (!insideFunction || currentIndent <= functionIndent) {
            result.push(line);
          }
        }
        // Skip all implementation lines (those with greater indentation)
      } else {
        // Not inside a function
        result.push(line);
      }
    }

    return result.join('\n');
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
      const code = challengeMode
        ? transformToChallengMode(selectedChallenge.pythonTemplate)
        : selectedChallenge.pythonTemplate;
      setPythonCode(code);
    }
  }, [selectedChallenge?.id]);

  // Update Python code when challenge mode changes
  useEffect(() => {
    if (selectedChallenge?.pythonTemplate) {
      const code = challengeMode
        ? transformToChallengMode(selectedChallenge.pythonTemplate)
        : selectedChallenge.pythonTemplate;
      setPythonCode(code);
    }
  }, [challengeMode]);

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

        const loadTestResults = await loadTestService.runLoadTest(
          {
            ...loadTestConfig,
            code: pythonCode,
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

  // Handler for running Python test cases (for LeetCode-style interface)
  const handleRunPythonTests = async (code: string, testCases: any[]): Promise<any[]> => {
    // For now, simulate running tests locally
    // In production, this would call a backend API to execute the Python code
    const results = [];

    try {
      // Simulate test execution
      for (const testCase of testCases) {
        const result = {
          testId: testCase.id,
          testName: testCase.name,
          passed: Math.random() > 0.3, // Simulate 70% pass rate for demo
          operations: testCase.operations.map((op: any) => ({
            method: op.method,
            input: op.input,
            expected: op.expected === 'VALID_CODE' ? 'abc123' :
                     op.expected === 'RESULT_FROM_PREV' ? 'abc123' :
                     op.expected,
            actual: Math.random() > 0.3 ?
                   (op.expected === 'VALID_CODE' ? 'abc123' :
                    op.expected === 'RESULT_FROM_PREV' ? 'abc123' :
                    op.expected) : 'wrong_value',
            passed: Math.random() > 0.3
          })),
          executionTime: Math.floor(Math.random() * 50) + 10
        };
        results.push(result);

        // Add small delay to simulate execution
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error('Error running Python tests:', error);
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
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header with Mode Toggle */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Python Implementation</h2>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => setChallengeMode(false)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      !challengeMode
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    title="See working example code to learn from"
                  >
                    📚 Learn Mode
                  </button>
                  <button
                    onClick={() => setChallengeMode(true)}
                    className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                      challengeMode
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    title="Empty function signatures for you to implement"
                  >
                    🏆 Challenge Mode
                  </button>
                </div>
              </div>
            </div>

            {/* LeetCode-style Panel */}
            <PythonCodeChallengePanel
              pythonCode={challengeMode ? transformToChallengMode(pythonCode) : pythonCode}
              setPythonCode={setPythonCode}
              challengeMode={challengeMode}
              onRunTests={handleRunPythonTests}
              onSubmit={handleSubmit}
            />
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
