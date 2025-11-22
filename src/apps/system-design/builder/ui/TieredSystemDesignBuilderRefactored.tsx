import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "reactflow/dist/style.css";

// Import new architecture
import { MainLayout, TabLayout } from "./layouts";
import { Tab } from "./design-system";
import {
  CanvasPage,
  PythonCodePage,
  AppServerPage,
  LoadBalancerPage,
  LessonsPage,
  APIsPage,
} from "./pages";
import {
  useBuilderStore,
  useCanvasStore,
  useCodeStore,
  useTestStore,
  useUIStore,
} from "./store";

// Import existing components still needed
import { getDefaultConfig } from "./components/DesignCanvas";
import { InspectorModal } from "./components/InspectorModal";
import { SolutionModal } from "./components/SolutionModal";

// Import types and services
import { Challenge, Solution } from "../types/testCase";
import { SystemGraph } from "../types/graph";
import { TestResult } from "../types/testCase";
import {
  validateConnections,
  validateSmartConnections,
  formatValidationErrors,
} from "../services/connectionValidator";
import {
  validateDatabaseSchema,
  formatSchemaErrors,
} from "../services/schemaValidator";
import { TieredChallenge } from "../types/challengeTiers";
import type { DatabaseSchema } from "../types/challengeTiers";

// Import example challenges
import { tieredChallenges } from "../challenges/tieredChallenges";

// Import solution generator
import { generateSolutionForChallenge } from "../challenges/problemDefinitionConverter";

/**
 * Props for TieredSystemDesignBuilder
 */
interface TieredSystemDesignBuilderProps {
  challengeId?: string;
  challenges?: Challenge[];
}

/**
 * Refactored System Design Builder
 * Uses new modular architecture with centralized state management
 */
export function TieredSystemDesignBuilder({
  challengeId,
  challenges = tieredChallenges,
}: TieredSystemDesignBuilderProps = {}) {
  const navigate = useNavigate();

  // Store hooks
  const {
    selectedChallenge,
    setSelectedChallenge,
    hasSubmitted,
    setHasSubmitted,
    testRunner,
    solution,
    setSolution,
    showSolutionModal,
    setShowSolutionModal,
  } = useBuilderStore();

  const {
    systemGraph,
    setSystemGraph,
    updateSystemGraph,
    selectedNode,
    setSelectedNode,
    showInspectorModal,
    setShowInspectorModal,
    inspectorModalNodeId,
    setInspectorModalNodeId,
    addNode,
    removeNode,
    updateNode,
  } = useCanvasStore();

  const {
    pythonCode,
    setPythonCode,
    pythonCodeByServer,
    setPythonCodeByServer,
    connectionErrors,
    schemaErrors,
    setConnectionErrors,
    setSchemaErrors,
    clearErrors,
  } = useCodeStore();

  const {
    testResults,
    setTestResults,
    currentTestIndex,
    setCurrentTestIndex,
    isRunning,
    setIsRunning,
    clearTestResults,
  } = useTestStore();

  const {
    activeTab,
    setActiveTab,
  } = useUIStore();

  // Helper flags for challenge-specific behavior
  const isTinyUrl = selectedChallenge?.id === "tiny_url";
  const isWebCrawler = selectedChallenge?.id === "web_crawler";
  const hasCodeChallenges =
    selectedChallenge?.codeChallenges &&
    selectedChallenge.codeChallenges.length > 0;
  const hasPythonTemplate =
    selectedChallenge?.pythonTemplate &&
    selectedChallenge.pythonTemplate.length > 0;

  // Initialize challenge
  useEffect(() => {
    if (challengeId && challenges) {
      const challenge = challenges.find((c) => c.id === challengeId);
      if (challenge) {
        setSelectedChallenge(challenge);
        setActiveTab("canvas");
      }
    }
  }, [challengeId, challenges, setSelectedChallenge, setActiveTab]);

  // Load solution to canvas
  const loadSolutionToCanvas = useCallback(
    (solutionOverride?: Solution) => {
      const solution =
        solutionOverride ||
        (selectedChallenge
          ? generateSolutionForChallenge(selectedChallenge)
          : undefined);
      if (!solution) return;

      // Convert solution to SystemGraph format (components + connections)
      const components = solution.components.map((comp, index) => {
        const solutionConfig = comp.config || {};
        const defaultCfg = getDefaultConfig(comp.type);
        const mergedConfig: Record<string, any> = { ...defaultCfg, ...solutionConfig };

        // Return ComponentNode format
        return {
          id: mergedConfig.id || `${comp.type}_${index + 1}`,
          type: comp.type,
          config: mergedConfig,
        };
      });

      // Use connections directly from solution (they're already in Connection format)
      const connections = solution.connections || [];

      setSystemGraph({
        components,
        connections,
      });

      setSolution(solution);
      setShowSolutionModal(true);
    },
    [selectedChallenge, setSystemGraph, setSolution, setShowSolutionModal]
  );

  // Handle adding component
  const handleAddComponent = useCallback(
    (type: string) => {
      const componentCount = systemGraph.components?.filter((c) => c.type === type).length || 0;
      const id = `${type}_${Date.now()}`;
      const defaultConfig = getDefaultConfig(type);
      
      // For app_server, initialize with empty handledAPIs array
      if (type === "app_server") {
        defaultConfig.handledAPIs = [];
      }

      // Create ComponentNode format
      const newComponent = {
        id,
        type: type as any,
        config: defaultConfig,
      };

      addNode(newComponent);
    },
    [systemGraph, addNode]
  );

  // Handle updating config
  const handleUpdateConfig = useCallback(
    (nodeId: string, config: any) => {
      updateSystemGraph((currentGraph) => {
        const updatedComponents = currentGraph.components.map((comp) =>
          comp.id === nodeId
            ? { ...comp, config: { ...comp.config, ...config } }
            : comp
        );
        return {
          ...currentGraph,
          components: updatedComponents,
        };
      });
    },
    [updateSystemGraph]
  );

  // Handle submit
  const handleSubmit = useCallback(async () => {
    if (!selectedChallenge) return;

    setIsRunning(true);
    setHasSubmitted(true);
    clearErrors();

    // Run validation and tests
    try {
      // Connection validation
      const connectionValidation = validateSmartConnections(
        pythonCode,
        systemGraph,
      );
      if (!connectionValidation.valid) {
        setConnectionErrors(formatValidationErrors(connectionValidation.errors));
      }

      // Schema validation
      const tieredChallenge = selectedChallenge as TieredChallenge;
      if (tieredChallenge.componentBehaviors?.database?.schema) {
        const schemaValidation = validateDatabaseSchema(
          pythonCode,
          tieredChallenge.componentBehaviors.database.schema,
        );
        if (!schemaValidation.valid) {
          setSchemaErrors(formatSchemaErrors(schemaValidation.errors));
        }
      }

      // Run tests
      const results = await testRunner.runTests(
        selectedChallenge,
        systemGraph,
        pythonCode,
      );

      setTestResults(results);
    } catch (error) {
      console.error("Test execution error:", error);
    } finally {
      setIsRunning(false);
    }
  }, [
    selectedChallenge,
    systemGraph,
    pythonCode,
    testRunner,
    setIsRunning,
    setHasSubmitted,
    setConnectionErrors,
    setSchemaErrors,
    setTestResults,
    clearErrors,
  ]);

  // Handle Python tests
  const handleRunPythonTests = useCallback(() => {
    // Implementation for Python-specific tests
    console.log("Running Python tests...");
  }, []);

  // Handle back to challenges
  const handleBackToChallenges = useCallback(() => {
    navigate("/system-design");
  }, [navigate]);

  if (!selectedChallenge) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">No challenge selected</p>
      </div>
    );
  }

  // Define tabs
  const tabs: Tab[] = [
    { id: "canvas", label: "Canvas", icon: "🎨" },
    { id: "python", label: "Python Application Server", icon: "🐍", disabled: !hasPythonTemplate },
    { id: "app-server", label: "App Server", icon: "📦", disabled: !systemGraph.nodes?.some((n) => n.type === "app_server") },
    { id: "load-balancer", label: "Load Balancer", icon: "⚖️", disabled: !systemGraph.nodes?.some((n) => n.type === "load_balancer") },
    { id: "lessons", label: "Lessons", icon: "📖" },
    { id: "apis", label: "APIs Available", icon: "📚" },
  ];

  return (
    <MainLayout
      header={
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToChallenges}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Back to All Problems
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-xl font-bold text-gray-900">
              {selectedChallenge.title}
            </h1>
          </div>
        </div>
      }
    >
      <TabLayout
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {/* Canvas Tab */}
        {activeTab === "canvas" && (
          <CanvasPage
            challenge={selectedChallenge}
            onAddComponent={handleAddComponent}
            onUpdateConfig={handleUpdateConfig}
            onSubmit={handleSubmit}
            onLoadSolution={loadSolutionToCanvas}
          />
        )}

        {/* Python Code Tab */}
        {activeTab === "python" && hasPythonTemplate && (
          <PythonCodePage
            challenge={selectedChallenge}
            systemGraph={systemGraph}
            onRunTests={handleRunPythonTests}
            onSubmit={handleSubmit}
            isTinyUrl={isTinyUrl}
            isWebCrawler={isWebCrawler}
            hasCodeChallenges={hasCodeChallenges}
            hasPythonTemplate={hasPythonTemplate}
          />
        )}

        {/* App Server Tab */}
        {activeTab === "app-server" && (
          <AppServerPage
            systemGraph={systemGraph}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

        {/* Load Balancer Tab */}
        {activeTab === "load-balancer" && (
          <LoadBalancerPage
            systemGraph={systemGraph}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

        {/* Lessons Tab */}
        {activeTab === "lessons" && <LessonsPage />}

        {/* APIs Tab */}
        {activeTab === "apis" && <APIsPage />}
      </TabLayout>

      {/* Modals */}
      {showInspectorModal && inspectorModalNodeId && (
        <InspectorModal
          nodeId={inspectorModalNodeId}
          systemGraph={systemGraph}
          onClose={() => setShowInspectorModal(false)}
          onUpdateConfig={handleUpdateConfig}
        />
      )}

      {showSolutionModal && solution && (
        <SolutionModal
          solution={solution}
          onClose={() => setShowSolutionModal(false)}
        />
      )}
    </MainLayout>
  );
}

