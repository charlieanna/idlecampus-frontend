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
import { TestRunner } from "../simulation/testRunner";

// Import challenges
import { tieredChallenges } from "../challenges/tieredChallenges";
import { challenges as challengesFromIndex } from "../challenges/index";

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

  // Ensure challenges is populated (fallback chain: props -> tieredChallenges -> challengesFromIndex)
  const effectiveChallenges = 
    challenges && challenges.length > 0 
      ? challenges 
      : (tieredChallenges && tieredChallenges.length > 0 
          ? tieredChallenges 
          : challengesFromIndex || []);
  
  console.log('TieredSystemDesignBuilder initialized:', {
    challengeId,
    challengesLength: effectiveChallenges.length,
    hasChallenges: !!effectiveChallenges && effectiveChallenges.length > 0,
  });

  // Store hooks
  const {
    selectedChallenge,
    setSelectedChallenge,
    hasSubmitted,
    setHasSubmitted,
  } = useBuilderStore();

  // Test runner - create locally (not in Zustand - class instances don't serialize well)
  const [testRunner] = useState(() => new TestRunner());

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

  // Get available APIs for API assignment to app servers
  const getAvailableAPIs = useCallback((): string[] => {
    if (!selectedChallenge) return [];
    
    // Check if challenge has explicit API definitions
    const problemDef = (selectedChallenge as any).problemDefinition;
    if (problemDef?.userFacingFRs) {
      // Extract APIs from functional requirements
      const apis: string[] = [];
      const frs = problemDef.userFacingFRs;
      
      // Common patterns
      if (frs.some(fr => fr.toLowerCase().includes('create') || fr.toLowerCase().includes('shorten'))) {
        apis.push('POST /api/v1/urls');
      }
      if (frs.some(fr => fr.toLowerCase().includes('redirect') || fr.toLowerCase().includes('expand') || fr.toLowerCase().includes('get'))) {
        apis.push('GET /api/v1/urls/*');
      }
      if (frs.some(fr => fr.toLowerCase().includes('stats') || fr.toLowerCase().includes('analytics'))) {
        apis.push('GET /api/v1/stats');
      }
      
      if (apis.length > 0) return apis;
    }
    
    // Challenge-specific API definitions
    if (selectedChallenge.id === "tiny_url") {
      return ["POST /api/v1/urls", "GET /api/v1/urls/*", "GET /api/v1/stats"];
    }
    
    // Generic fallback - extract from functional requirements
    const functionalReqs = selectedChallenge.requirements?.functional || [];
    const apis: string[] = [];
    
    functionalReqs.forEach(req => {
      const lowerReq = req.toLowerCase();
      if (lowerReq.includes('create') || lowerReq.includes('post') || lowerReq.includes('add')) {
        apis.push('POST /api/v1/*');
      }
      if (lowerReq.includes('read') || lowerReq.includes('get') || lowerReq.includes('retrieve')) {
        apis.push('GET /api/v1/*');
      }
      if (lowerReq.includes('update') || lowerReq.includes('put') || lowerReq.includes('modify')) {
        apis.push('PUT /api/v1/*');
      }
      if (lowerReq.includes('delete') || lowerReq.includes('remove')) {
        apis.push('DELETE /api/v1/*');
      }
    });
    
    // Remove duplicates and return
    return Array.from(new Set(apis));
  }, [selectedChallenge]);

  // Initialize challenge
  useEffect(() => {
    if (!challengeId) {
      console.log("No challengeId provided");
      return;
    }
    
    if (!effectiveChallenges || effectiveChallenges.length === 0) {
      console.warn("Challenges array is empty or undefined");
      return;
    }
    
    console.log(`Looking for challenge: ${challengeId}, total challenges available: ${effectiveChallenges.length}`);
    
    // Try exact match first
    let challenge = effectiveChallenges.find((c) => c.id === challengeId);
    
    // If not found, try normalizing hyphens to underscores (for URL slugs like tiny-url -> tiny_url)
    if (!challenge) {
      const normalizedId = challengeId.replace(/-/g, '_');
      console.log(`Trying normalized ID: ${normalizedId}`);
      challenge = effectiveChallenges.find((c) => c.id === normalizedId);
    }
    
    // If still not found, try the reverse (underscores to hyphens)
    if (!challenge) {
      const reverseId = challengeId.replace(/_/g, '-');
      console.log(`Trying reverse ID: ${reverseId}`);
      challenge = effectiveChallenges.find((c) => c.id === reverseId);
    }
    
    // If still not found, try finding by slug pattern (e.g., tiny-url -> tiny-url-l6)
    if (!challenge) {
      console.log(`Trying prefix match for: ${challengeId}`);
      challenge = effectiveChallenges.find((c) => c.id?.startsWith(challengeId));
    }
    
    if (challenge) {
      console.log(`✅ Found challenge: ${challenge.id} - ${challenge.title}`);
      setSelectedChallenge(challenge);
      setActiveTab("canvas");
    } else {
      console.error(`❌ Challenge not found: ${challengeId}`);
      // Show first few available challenge IDs for debugging
      const sampleIds = effectiveChallenges.slice(0, 10).map(c => c.id);
      console.log(`Sample available challenge IDs:`, sampleIds);
    }
  }, [challengeId, effectiveChallenges, setSelectedChallenge, setActiveTab]);

  // Initialize Python code and reset state when challenge changes
  useEffect(() => {
    if (selectedChallenge) {
      console.log(`[ChallengeInit] Initializing challenge: ${selectedChallenge.id}`);
      console.log(`[ChallengeInit] Has pythonTemplate:`, !!selectedChallenge.pythonTemplate);
      console.log(`[ChallengeInit] Template length:`, selectedChallenge.pythonTemplate?.length || 0);
      
      // Initialize Python code from template
      const template = selectedChallenge.pythonTemplate || "";
      setPythonCode(template);
      setPythonCodeByServer({});
      
      // Reset canvas
      setSystemGraph({
        components: [],
        connections: [],
      });
      
      // Reset test state
      clearTestResults();
      setHasSubmitted(false);
      setSelectedNode(null);
      
      // Set problem definition for test runner
      const problemDef = (selectedChallenge as any).problemDefinition;
      if (problemDef) {
        testRunner.setProblemDefinition(problemDef);
      }
      
      console.log(`[ChallengeInit] Python code initialized:`, template.substring(0, 100) + "...");
    }
  }, [selectedChallenge, setPythonCode, setPythonCodeByServer, setSystemGraph, clearTestResults, setHasSubmitted, setSelectedNode, testRunner]);

  // Load solution to canvas
  const loadSolutionToCanvas = useCallback(
    (solutionOverride?: Solution) => {
      const solution =
        solutionOverride ||
        (selectedChallenge
          ? generateSolutionForChallenge(selectedChallenge)
          : undefined);
      if (!solution) return;

      console.log("📋 Loading solution:", solutionOverride ? "test-case-specific" : "generated-fresh");
      console.log("📋 Solution components count:", solution.components?.length || 0);
      console.log("📋 Solution connections:", solution.connections?.length || 0);

      // Safety check for components and connections
      if (!solution.components || !Array.isArray(solution.components)) {
        console.error("Solution missing components array");
        return;
      }
      if (!solution.connections || !Array.isArray(solution.connections)) {
        console.error("Solution missing connections array");
        return;
      }

      // Convert solution components to SystemGraph components with full config
      const components = solution.components.map((comp, index) => {
        const solutionConfig = comp.config || {};
        const defaultCfg = getDefaultConfig(comp.type);
        const mergedConfig: Record<string, any> = { ...solutionConfig };

        // Only add defaults for fields that are truly missing
        Object.keys(defaultCfg).forEach((key) => {
          if (!(key in solutionConfig)) {
            mergedConfig[key] = defaultCfg[key];
          }
        });

        // Ensure app_server has instances if not specified
        if (comp.type === "app_server" && solutionConfig.instances === undefined) {
          mergedConfig.instances = mergedConfig.instances || 1;
        }

        // Use ID from config if available, otherwise generate one
        const componentId = mergedConfig.id || `${comp.type}_${Date.now()}_${index}`;

        return {
          id: componentId,
          type: comp.type as any,
          config: mergedConfig,
        };
      });

      // Convert solution connections to use actual component IDs (not types)
      const connections = solution.connections
        .map((conn) => {
          // Find the component IDs by type
          const fromCandidates = components.filter((c) => c.type === conn.from);
          const toCandidates = components.filter((c) => c.type === conn.to);

          let fromComp: any | undefined;
          let toComp: any | undefined;

          // Select from component
          if (fromCandidates.length === 1) {
            fromComp = fromCandidates[0];
          } else if (fromCandidates.length > 1) {
            fromComp = fromCandidates[0];
          }

          // Select to component with smart matching for multiple candidates
          if (toCandidates.length === 1) {
            toComp = toCandidates[0];
          } else if (toCandidates.length > 1) {
            // For message_queue → app_server, prefer the conflict resolver
            if (conn.from === "message_queue" && conn.to === "app_server") {
              toComp =
                toCandidates.find(
                  (c) =>
                    c.config?.serviceName === "conflict-resolver" ||
                    c.config?.displayName?.toLowerCase().includes("conflict"),
                ) || toCandidates[0];
            } else {
              toComp = toCandidates[0];
            }
          }

          if (!fromComp || !toComp) {
            console.warn(
              `Missing component for connection: ${conn.from} -> ${conn.to}`,
              {
                fromCandidates: fromCandidates.length,
                toCandidates: toCandidates.length,
              },
            );
            return null;
          }

          return {
            from: fromComp.id,
            to: toComp.id,
            type: (conn.type || "read_write") as "read" | "write" | "read_write",
          };
        })
        .filter((c) => c !== null) as any[];

      // Update the system graph
      console.log("📋 Setting system graph with components:", components.length);
      console.log("📋 Setting system graph with connections:", connections.length);

      setSystemGraph({
        components,
        connections,
      });

      // Reset submission state so user can see Component Palette and Submit button again
      setHasSubmitted(false);
      clearTestResults();

      // Don't show modal - just load to canvas (matching old behavior)
    },
    [selectedChallenge, setSystemGraph, setHasSubmitted, clearTestResults]
  );

  // Handle adding component
  const handleAddComponent = useCallback(
    (type: string, configOverride?: any) => {
      // Get current systemGraph from store to ensure we have latest state
      const currentGraph = useCanvasStore.getState().systemGraph;
      const componentCount = currentGraph.components?.filter((c) => c.type === type).length || 0;
      
      // Generate unique ID with timestamp and random suffix to avoid collisions
      const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const defaultConfig = getDefaultConfig(type);
      
      // Merge any provided config override
      const mergedConfig = configOverride 
        ? { ...defaultConfig, ...configOverride }
        : defaultConfig;
      
      // For app_server, initialize with empty handledAPIs array if not provided
      if (type === "app_server" && !mergedConfig.handledAPIs) {
        mergedConfig.handledAPIs = [];
      }

      // Ensure app_server has instances
      if (type === "app_server" && !mergedConfig.instances) {
        mergedConfig.instances = 1;
      }

      // Create ComponentNode format
      const newComponent = {
        id,
        type: type as any,
        config: mergedConfig,
      };

      console.log(`[AddComponent] Adding ${type} component:`, {
        id,
        type,
        config: mergedConfig,
        currentComponentCount: currentGraph.components.length,
      });

      addNode(newComponent);
      
      // Verify it was added (for debugging)
      setTimeout(() => {
        const updatedGraph = useCanvasStore.getState().systemGraph;
        const added = updatedGraph.components.find(c => c.id === id);
        if (!added) {
          console.error(`[AddComponent] Component ${id} was not added! Current components:`, updatedGraph.components.map(c => ({ id: c.id, type: c.type })));
        } else {
          console.log(`[AddComponent] Component ${id} successfully added. Total components:`, updatedGraph.components.length);
        }
      }, 100);
    },
    [addNode]
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

      // Split tests into FR and NFR
      const frTests = selectedChallenge.testCases.filter(
        (tc) => tc.type === "functional",
      );
      const nfrTests = selectedChallenge.testCases.filter(
        (tc) => tc.type !== "functional",
      );

      console.log(`🚀 Running ${frTests.length} FR tests...`);

      // Pass Python code to test runner for code-aware simulation
      testRunner.setPythonCode(pythonCode);

      // Run FR tests first
      const frResults = testRunner.runAllTestCases(systemGraph, frTests);
      const allFrPassed = frResults.every((r) => r.passed);

      // If FR tests pass, automatically run NFR tests
      let nfrResults: TestResult[] = [];
      if (allFrPassed && nfrTests.length > 0) {
        console.log(`🚀 Running ${nfrTests.length} NFR tests...`);
        nfrResults = testRunner.runAllTestCases(systemGraph, nfrTests);
      } else if (!allFrPassed) {
        console.log(
          `⚠️ Skipping NFR tests because ${frResults.filter((r) => !r.passed).length} FR test(s) failed`,
        );
      }

      // Combine results (FR first, then NFR if they ran)
      const resultsArray = [...frResults, ...nfrResults];
      const resultsMap = new Map<number, TestResult>();

      // Create combined test cases array (FR first, then NFR only if they were run)
      const allTestCasesToRun = allFrPassed
        ? [...frTests, ...nfrTests]
        : frTests;

      resultsArray.forEach((result, index) => {
        // Preserve original index mapping so SubmissionResultsPanel lines up with testCases
        const testCase = allTestCasesToRun[index];
        const originalIndex = selectedChallenge.testCases.indexOf(testCase);
        resultsMap.set(originalIndex, result);
      });

      setTestResults(resultsMap);
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
    { id: "app-server", label: "App Server", icon: "📦", disabled: !systemGraph.components?.some((c) => c.type === "app_server") },
    { id: "load-balancer", label: "Load Balancer", icon: "⚖️", disabled: !systemGraph.components?.some((c) => c.type === "load_balancer") },
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
            availableAPIs={getAvailableAPIs()}
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
    </MainLayout>
  );
}

