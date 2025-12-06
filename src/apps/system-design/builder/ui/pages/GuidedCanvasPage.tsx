import { useState, useCallback, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import { DesignCanvas } from '../components/DesignCanvas';
import { InspectorModal } from '../components/InspectorModal';
import { GuidedTeachingPanel, GuidedSidebar, ModeSwitcher, StoryPanel, CelebrationPanel, FullScreenLearnPanel } from '../components/guided';
import { TutorialCompleteModal } from '../components/guided/TutorialCompleteModal';
import { PythonCodePage } from './PythonCodePage';
import { LoadBalancerPage } from './LoadBalancerPage';
import { APIsPage } from './APIsPage';
import { TabLayout } from '../layouts';
import { Tab } from '../design-system';
import { useCanvasStore, useGuidedStore, useCodeStore, useUIStore } from '../store';
import { Challenge } from '../../types/testCase';
import { validateStep } from '../../guided/validateStep';
import { generateGuidedTutorial } from '../../guided/generateGuidedTutorial';
import { StepValidationResult, StepPhase } from '../../types/guidedTutorial';
import { ProblemDefinition } from '../../types/problemDefinition';

// Extended Challenge type that includes problemDefinition
interface ChallengeWithProblemDefinition extends Challenge {
  problemDefinition?: ProblemDefinition;
}

interface GuidedCanvasPageProps {
  challenge: ChallengeWithProblemDefinition;
  onAddComponent: (type: string) => void;
  onUpdateConfig: (nodeId: string, config: any) => void;
  onModeChange?: (mode: 'solve-on-own' | 'guided-tutorial') => void;
}

/**
 * GuidedCanvasPage - Step-by-step guided tutorial mode
 * Teaches users the system design framework by implementing one FR at a time
 */
export const GuidedCanvasPage: React.FC<GuidedCanvasPageProps> = ({
  challenge,
  onAddComponent,
  onUpdateConfig,
  onModeChange,
}) => {
  const navigate = useNavigate();

  // Store state
  const {
    systemGraph,
    setSystemGraph,
    selectedNode,
    setSelectedNode,
    showInspectorModal,
    setShowInspectorModal,
    inspectorModalNodeId,
    setInspectorModalNodeId,
    removeNode,
    clearCanvas,
  } = useCanvasStore();
  const {
    mode,
    setMode,
    tutorial,
    setTutorial,
    progress,
    initializeProgress,
    advanceToNextStep,
    goToStep,
    incrementAttempt,
    setHintLevel,
    setPhase,
    recordQuizAnswer,
    isTutorialCompleted,
    markTutorialComplete,
  } = useGuidedStore();

  // Code store for Python tabs (used by PythonCodePage internally and for validation)
  const { pythonCodeByServer } = useCodeStore();

  // UI store for active tab
  const { activeTab, setActiveTab } = useUIStore();

  // Local state
  const [validationResult, setValidationResult] = useState<StepValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Get app servers with configured APIs from the system graph
  const appServersWithAPIs = systemGraph?.components?.filter(
    (c) => c.type === 'app_server' && c.config?.handledAPIs && c.config.handledAPIs.length > 0
  ) || [];

  // Check if there's a load balancer
  const hasLoadBalancer = systemGraph?.components?.some(
    (c) => c.type === 'load_balancer'
  ) || false;

  // Helper flags
  const isTinyUrl = challenge?.id === 'tiny_url';
  const isWebCrawler = challenge?.id === 'web_crawler';
  const hasCodeChallenges = !!(challenge?.codeChallenges && challenge.codeChallenges.length > 0);
  const hasPythonTemplate = !!(challenge?.pythonTemplate && challenge.pythonTemplate.length > 0);

  // Get available APIs for API assignment to app servers
  const getAvailableAPIs = useCallback((): string[] => {
    if (!challenge) return [];

    // Check if challenge has explicit API definitions in problemDefinition
    const problemDef = challenge.problemDefinition;
    if (problemDef?.userFacingFRs) {
      const apis: string[] = [];
      const frs = problemDef.userFacingFRs;

      // Common patterns based on FRs
      if (frs.some((fr: string) => fr.toLowerCase().includes('create') || fr.toLowerCase().includes('shorten'))) {
        apis.push('POST /api/v1/urls');
      }
      if (frs.some((fr: string) => fr.toLowerCase().includes('redirect') || fr.toLowerCase().includes('expand') || fr.toLowerCase().includes('get'))) {
        apis.push('GET /api/v1/urls/*');
      }
      if (frs.some((fr: string) => fr.toLowerCase().includes('stats') || fr.toLowerCase().includes('analytics'))) {
        apis.push('GET /api/v1/stats');
      }

      if (apis.length > 0) return apis;
    }

    // Challenge-specific API definitions
    if (challenge.id === 'tiny_url') {
      return ['POST /api/v1/urls', 'GET /api/v1/urls/*', 'GET /api/v1/stats'];
    }

    // Generic fallback
    return ['POST /api/v1/*', 'GET /api/v1/*'];
  }, [challenge]);

  // Initialize tutorial when challenge loads
  useEffect(() => {
    if (challenge?.problemDefinition) {
      // Clear canvas when starting/restarting tutorial
      // Each step should start fresh for better learning
      clearCanvas();

      // Use pre-defined rich tutorial if available, otherwise generate basic one
      const loadedTutorial = challenge.problemDefinition.guidedTutorial
        ? challenge.problemDefinition.guidedTutorial
        : generateGuidedTutorial(challenge.problemDefinition);

      setTutorial(loadedTutorial);
      initializeProgress(challenge.id);

      // Check if already completed
      const completed = isTutorialCompleted(challenge.id);
      setTutorialComplete(completed);
    }
  }, [challenge?.id, clearCanvas]);

  // Open inspector modal when a node is selected
  useEffect(() => {
    if (selectedNode && selectedNode.id) {
      setInspectorModalNodeId(selectedNode.id);
      setShowInspectorModal(true);
    }
  }, [selectedNode, setInspectorModalNodeId, setShowInspectorModal]);

  // Get current step
  const currentStep = tutorial?.steps[progress?.currentStepIndex || 0] || null;

  // Determine if we should show story panel
  // Show story only when phase is explicitly 'story'
  const shouldShowStory = (() => {
    if (!currentStep?.story || tutorialComplete) return false;
    return progress?.currentPhase === 'story';
  })();

  // Handle checking the user's design
  const handleCheckDesign = useCallback(() => {
    if (!currentStep || !systemGraph) return;

    setIsValidating(true);
    setValidationResult(null);

    // Simulate a short delay for UX
    setTimeout(() => {
      const result = validateStep(currentStep, systemGraph, pythonCodeByServer);
      setValidationResult(result);
      setIsValidating(false);

      if (!result.passed) {
        incrementAttempt();
      }
    }, 500);
  }, [currentStep, systemGraph, incrementAttempt]);

  // Handle modal actions
  const handleTryAnotherChallenge = useCallback(() => {
    setShowCompleteModal(false);
    navigate('/system-design');
  }, [navigate]);

  const handleSolveOnYourOwn = useCallback(() => {
    setShowCompleteModal(false);
    handleModeChange('solve-on-own');
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowCompleteModal(false);
  }, []);

  // Handle going to a specific step
  const handleGoToStep = useCallback((stepIndex: number) => {
    setValidationResult(null);
    // Clear canvas so user starts fresh on each step
    clearCanvas();
    goToStep(stepIndex);
  }, [goToStep, clearCanvas]);

  // Handle hint request
  const handleRequestHint = useCallback(() => {
    if (!progress) return;

    const currentHint = progress.hintLevel;
    if (currentHint === 'none') {
      setHintLevel('level1');
    } else if (currentHint === 'level1') {
      setHintLevel('level2');
    }
  }, [progress, setHintLevel]);

  // Handle show solution
  const handleShowSolution = useCallback(() => {
    setHintLevel('solution');
  }, [setHintLevel]);

  // Handle phase change (learn <-> practice)
  const handlePhaseChange = useCallback((phase: StepPhase) => {
    setPhase(phase);
  }, [setPhase]);

  // Handle quiz answer
  const handleQuizAnswer = useCallback((stepId: string, selectedIndex: number, correct: boolean) => {
    recordQuizAnswer(stepId, selectedIndex, correct);
  }, [recordQuizAnswer]);

  // Handle mode change
  const handleModeChange = useCallback((newMode: 'solve-on-own' | 'guided-tutorial') => {
    setMode(newMode);
    setValidationResult(null);
    onModeChange?.(newMode);
  }, [setMode, onModeChange]);

  // Handle drag start for component palette
  const handleDragStart = useCallback((_componentType: string) => {
    // This is handled by the canvas via the onAddComponent callback
  }, []);

  // Stub handlers for Python tests (can be enhanced later)
  const handleRunPythonTests = useCallback(() => {
    console.log('Running Python tests...');
  }, []);

  const handleSubmit = useCallback(() => {
    console.log('Submitting solution...');
  }, []);

  // Handle deleting a node
  const handleDeleteNode = useCallback((nodeId: string) => {
    removeNode(nodeId);
    setShowInspectorModal(false);
  }, [removeNode, setShowInspectorModal]);

  // Handle API assignment - auto-switch to Python tab
  const handleAPIAssigned = useCallback((serverId: string) => {
    setShowInspectorModal(false);
    setSelectedNode(null);
    setActiveTab(`app-server-${serverId}`);
  }, [setShowInspectorModal, setSelectedNode, setActiveTab]);

  // Handle story panel "continue" - go to learn phase
  const handleStoryContinue = useCallback(() => {
    // After story, go to learn phase to show full-screen learning content
    setPhase('learn');
  }, [setPhase]);

  // Handle learn panel "start practice" - go to practice phase
  const handleStartPractice = useCallback(() => {
    // After learning, go to practice phase to show the canvas
    setPhase('practice');
  }, [setPhase]);

  // Handle celebration "continue" - go to next step's story or complete tutorial
  const handleCelebrationContinue = useCallback(() => {
    setValidationResult(null);
    // Check if this was the last step
    if (tutorial && progress && progress.currentStepIndex === tutorial.totalSteps - 1) {
      // Tutorial complete!
      setTutorialComplete(true);
      setShowCompleteModal(true);
      markTutorialComplete(challenge.id);
    } else {
      // Clear canvas so user starts fresh on each step
      // This reinforces learning by requiring full implementation each time
      clearCanvas();
      // Advance to next step and show story
      advanceToNextStep();
      // The new step will start with 'story' phase
    }
  }, [tutorial, progress, advanceToNextStep, markTutorialComplete, challenge?.id, clearCanvas]);

  // Modified: When step is validated successfully, show celebration instead of advancing
  const handleStepComplete = useCallback(() => {
    // Show celebration phase
    setPhase('celebrate');
  }, [setPhase]);

  // If no tutorial or progress, show loading
  if (!tutorial || !progress) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  // Build dynamic tabs based on what's in the system graph
  const appServerTabs: Tab[] = appServersWithAPIs.map((server) => ({
    id: `app-server-${server.id}`,
    label: server.config?.displayName || server.config?.serviceName || `Server ${server.id.slice(0, 6)}`,
    icon: '🐍',
  }));

  const tabs: Tab[] = [
    { id: 'canvas', label: 'Canvas', icon: '🎨' },
    ...appServerTabs,
    ...(hasLoadBalancer ? [{ id: 'load-balancer', label: 'Load Balancer', icon: '⚖️' }] : []),
    { id: 'apis', label: 'APIs Reference', icon: '📚' },
  ];

  // Ensure canvas is active tab if current tab no longer exists
  const currentTabExists = tabs.some(t => t.id === activeTab);
  if (!currentTabExists && activeTab !== 'canvas') {
    setActiveTab('canvas');
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      {/* Mode Switcher Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Mode:</span>
          <ModeSwitcher
            mode={mode}
            onModeChange={handleModeChange}
            isTutorialCompleted={tutorialComplete}
          />
        </div>
        {tutorialComplete && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Tutorial Completed
          </span>
        )}
      </div>

      {/* Tab Layout */}
      <TabLayout
        tabs={tabs}
        activeTab={activeTab || 'canvas'}
        onTabChange={setActiveTab}
      >
        {/* Canvas Tab */}
        {(activeTab === 'canvas' || !activeTab) && (
          <div className="flex-1 flex h-full min-h-0 relative">
            {/* Full-screen Story Panel */}
            {shouldShowStory && currentStep?.story && (
              <StoryPanel
                story={currentStep.story}
                stepNumber={currentStep.stepNumber}
                totalSteps={tutorial.totalSteps}
                onContinue={handleStoryContinue}
              />
            )}

            {/* Full-screen Learn Panel (when in learn phase) */}
            {!shouldShowStory && progress.currentPhase === 'learn' && currentStep?.learnPhase && (
              <FullScreenLearnPanel
                content={currentStep.learnPhase}
                stepNumber={currentStep.stepNumber}
                totalSteps={tutorial.totalSteps}
                onStartPractice={handleStartPractice}
              />
            )}

            {/* Full-screen Celebration Panel (when in celebrate phase) */}
            {progress.currentPhase === 'celebrate' && currentStep?.celebration && (
              <CelebrationPanel
                celebration={currentStep.celebration}
                stepNumber={currentStep.stepNumber}
                totalSteps={tutorial.totalSteps}
                isLastStep={progress.currentStepIndex === tutorial.totalSteps - 1}
                onContinue={handleCelebrationContinue}
              />
            )}

            {/* Canvas view (only during practice phase) */}
            {!shouldShowStory && progress.currentPhase === 'practice' && (
              <>
                {/* Left Panel - Guided Teaching Panel */}
                <GuidedTeachingPanel
                  tutorial={tutorial}
                  progress={progress}
                  validationResult={validationResult}
                  isValidating={isValidating}
                  onCheckDesign={handleCheckDesign}
                  onNextStep={handleStepComplete}
                  onGoToStep={handleGoToStep}
                  onRequestHint={handleRequestHint}
                  onShowSolution={handleShowSolution}
                  isTutorialComplete={tutorialComplete}
                  onPhaseChange={handlePhaseChange}
                  onQuizAnswer={handleQuizAnswer}
                />

                {/* Center Panel - Design Canvas */}
                <div className="flex-1 relative">
                  <div className="absolute inset-0">
                    <ReactFlowProvider>
                      <DesignCanvas
                        systemGraph={systemGraph || { components: [], connections: [] }}
                        onSystemGraphChange={setSystemGraph}
                        selectedNode={selectedNode}
                        onNodeSelect={setSelectedNode}
                        onAddComponent={onAddComponent}
                        onUpdateConfig={onUpdateConfig}
                      />
                    </ReactFlowProvider>
                  </div>
                </div>

                {/* Right Panel - Guided Sidebar */}
                <GuidedSidebar
                  currentStep={currentStep}
                  onDragStart={handleDragStart}
                />
              </>
            )}
          </div>
        )}

        {/* Dynamic App Server Python Code Tabs */}
        {appServersWithAPIs.map((server) => (
          activeTab === `app-server-${server.id}` && (
            <PythonCodePage
              key={server.id}
              challenge={challenge}
              systemGraph={systemGraph || { components: [], connections: [] }}
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
        {activeTab === 'load-balancer' && (
          <LoadBalancerPage
            systemGraph={systemGraph || { components: [], connections: [] }}
            onUpdateConfig={onUpdateConfig}
          />
        )}

        {/* APIs Reference Tab */}
        {activeTab === 'apis' && <APIsPage />}
      </TabLayout>

      {/* Tutorial Complete Modal */}
      <TutorialCompleteModal
        isOpen={showCompleteModal}
        tutorialTitle={tutorial.problemTitle}
        totalSteps={tutorial.totalSteps}
        hintsUsed={progress.hintLevel !== 'none' ? 1 : 0}
        onTryAnotherChallenge={handleTryAnotherChallenge}
        onSolveOnYourOwn={handleSolveOnYourOwn}
        onClose={handleCloseModal}
      />

      {/* Inspector Modal for configuring components */}
      {showInspectorModal && inspectorModalNodeId && (
        <InspectorModal
          nodeId={inspectorModalNodeId}
          systemGraph={systemGraph || { components: [], connections: [] }}
          onClose={() => {
            setShowInspectorModal(false);
            setSelectedNode(null);
          }}
          onUpdateConfig={onUpdateConfig}
          onDelete={handleDeleteNode}
          availableAPIs={getAvailableAPIs()}
          onAPIAssigned={handleAPIAssigned}
        />
      )}
    </div>
  );
};

export default GuidedCanvasPage;
