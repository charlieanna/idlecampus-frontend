import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "reactflow/dist/style.css";

// Import new architecture
import { MainLayout, TabLayout } from "./layouts";
import { Tab } from "./design-system";
import {
  CanvasPage,
  GuidedCanvasPage,
  GuidedWizardPage,
  PythonCodePage,
  LoadBalancerPage,
  APIsPage,
} from "./pages";
import {
  useBuilderStore,
  useCanvasStore,
  useCodeStore,
  useTestStore,
  useUIStore,
  useGuidedStore,
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
  guidedOverride?: "auto" | "guided" | "classic";
}

/**
 * Refactored System Design Builder
 * Uses new modular architecture with centralized state management
 */
export function TieredSystemDesignBuilder({
  challengeId,
  challenges = tieredChallenges,
  guidedOverride = "auto",
}: TieredSystemDesignBuilderProps = {}) {
  const navigate = useNavigate();

  // Ensure challenges is populated (fallback chain: props -> tieredChallenges -> challengesFromIndex)
  const effectiveChallenges = 
    challenges && challenges.length > 0 
      ? challenges 
      : (tieredChallenges && tieredChallenges.length > 0 
          ? tieredChallenges 
          : challengesFromIndex || []);
  
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

  // Guided tutorial store
  const {
    mode: guidedMode,
    setMode: setGuidedMode,
    isTutorialCompleted,
  } = useGuidedStore();

  useEffect(() => {
    if (guidedOverride === "guided") {
      setGuidedMode("guided-tutorial");
    } else if (guidedOverride === "classic") {
      setGuidedMode("solve-on-own");
    }
  }, [guidedOverride, setGuidedMode]);

  // Helper flags for challenge-specific behavior
  const isTinyUrl = selectedChallenge?.id === "tiny_url";
  const isWebCrawler = selectedChallenge?.id === "web_crawler";
  const hasCodeChallenges =
    selectedChallenge?.codeChallenges &&
    selectedChallenge.codeChallenges.length > 0;
  const hasPythonTemplate =
    selectedChallenge?.pythonTemplate &&
    selectedChallenge.pythonTemplate.length > 0;

  const tutorialCompleted =
    selectedChallenge?.id ? isTutorialCompleted(selectedChallenge.id) : false;
  const wantsGuidedExperience =
    guidedOverride === "guided" ||
    (guidedOverride !== "classic" && guidedMode === "guided-tutorial");
  const shouldShowGuidedWizard =
    Boolean(selectedChallenge?.problemDefinition) &&
    wantsGuidedExperience &&
    (guidedOverride === "guided" || !tutorialCompleted);

  // Check if any app server has APIs configured
  const hasAppServerWithAPIs = systemGraph.components?.some(
    (c) => c.type === "app_server" && c.config?.handledAPIs && c.config.handledAPIs.length > 0
  ) || false;

  // Get app servers with their configured APIs
  const appServersWithAPIs = systemGraph.components?.filter(
    (c) => c.type === "app_server" && c.config?.handledAPIs && c.config.handledAPIs.length > 0
  ) || [];

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
      return;
    }
    
    if (!effectiveChallenges || effectiveChallenges.length === 0) {
      return;
    }
    
    
    // Try exact match first
    let challenge = effectiveChallenges.find((c) => c.id === challengeId);
    
    // If not found, try normalizing hyphens to underscores (for URL slugs like tiny-url -> tiny_url)
    if (!challenge) {
      const normalizedId = challengeId.replace(/-/g, '_');
      challenge = effectiveChallenges.find((c) => c.id === normalizedId);
    }
    
    // If still not found, try the reverse (underscores to hyphens)
    if (!challenge) {
      const reverseId = challengeId.replace(/_/g, '-');
      challenge = effectiveChallenges.find((c) => c.id === reverseId);
    }
    
    // If still not found, try finding by slug pattern (e.g., tiny-url -> tiny-url-l6)
    if (!challenge) {
      challenge = effectiveChallenges.find((c) => c.id?.startsWith(challengeId));
    }
    
    if (challenge) {
      setSelectedChallenge(challenge);
      setActiveTab("canvas");
    } else {
      // Show first few available challenge IDs for debugging
      const sampleIds = effectiveChallenges.slice(0, 10).map(c => c.id);
    }
  }, [challengeId, effectiveChallenges, setSelectedChallenge, setActiveTab]);

  // Initialize Python code and reset state when challenge changes
  useEffect(() => {
    if (selectedChallenge) {
      
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


      // Safety check for components and connections
      if (!solution.components || !Array.isArray(solution.components)) {
        return;
      }
      if (!solution.connections || !Array.isArray(solution.connections)) {
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

      addNode(newComponent);
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


      // Pass Python code to test runner for code-aware simulation
      testRunner.setPythonCode(pythonCode);

      // Run FR tests first
      const frResults = testRunner.runAllTestCases(systemGraph, frTests);
      const allFrPassed = frResults.every((r) => r.passed);

      // If FR tests pass, automatically run NFR tests
      let nfrResults: TestResult[] = [];
      if (allFrPassed && nfrTests.length > 0) {
        nfrResults = testRunner.runAllTestCases(systemGraph, nfrTests);
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

  // Check which components exist on canvas
  const hasLoadBalancer = systemGraph.components?.some((c) => c.type === "load_balancer") || false;

  // Define tabs - only show tabs for components that exist on canvas
  // Create a separate tab for each app server with APIs configured
  const appServerTabs: Tab[] = appServersWithAPIs.map((server) => ({
    id: `app-server-${server.id}`,
    label: server.config?.displayName || server.config?.serviceName || `Server ${server.id.slice(0, 6)}`,
    icon: "🐍",
  }));

  const tabs: Tab[] = [
    { id: "canvas", label: "Canvas", icon: "🎨" },
    // Add a tab for each app server with APIs
    ...appServerTabs,
    ...(hasLoadBalancer ? [{ id: "load-balancer", label: "Load Balancer", icon: "⚖️" }] : []),
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
        {/* Canvas Tab - Show Wizard for new users, Canvas for completed users */}
        {activeTab === "canvas" && (
          shouldShowGuidedWizard ? (
            <GuidedWizardPage challenge={selectedChallenge as any} />
          ) : (
            <CanvasPage
              challenge={selectedChallenge}
              onAddComponent={handleAddComponent}
              onUpdateConfig={handleUpdateConfig}
              onSubmit={handleSubmit}
              onLoadSolution={loadSolutionToCanvas}
              availableAPIs={getAvailableAPIs()}
            />
          )
        )}

        {/* Dynamic App Server Tabs - Each shows Python code for that server's APIs */}
        {appServersWithAPIs.map((server) => (
          activeTab === `app-server-${server.id}` && (
            <PythonCodePage
              key={server.id}
              challenge={selectedChallenge}
              systemGraph={systemGraph}
              onRunTests={handleRunPythonTests}
              onSubmit={handleSubmit}
              isTinyUrl={isTinyUrl}
              isWebCrawler={isWebCrawler}
              hasCodeChallenges={hasCodeChallenges}
              hasPythonTemplate={hasPythonTemplate}
              appServersWithAPIs={[server]}
            />
          )
        ))}

        {/* Load Balancer Tab */}
        {activeTab === "load-balancer" && (
          <LoadBalancerPage
            systemGraph={systemGraph}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

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

