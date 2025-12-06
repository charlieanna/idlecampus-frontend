import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactFlowProvider } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import { DesignCanvas } from '../components/DesignCanvas';
import { InspectorModal } from '../components/InspectorModal';
import { StoryPanel, CelebrationPanel, FullScreenLearnPanel, RequirementsGatheringPanel, ProgressRoadmapCollapsible, CostSummaryWidget, FriendlyFeedbackPanel, SandboxModeToggle, SandboxModeBanner, SolutionComparisonModal, InlineCodeEditor } from '../components/guided';
import { useCanvasStore, useGuidedStore, useCodeStore } from '../store';
import { Challenge } from '../../types/testCase';
import { validateStep } from '../../guided/validateStep';
import { generateGuidedTutorial } from '../../guided/generateGuidedTutorial';
import { StepValidationResult, GuidedStep, StepPhase } from '../../types/guidedTutorial';
import { ProblemDefinition } from '../../types/problemDefinition';

interface ChallengeWithProblemDefinition extends Challenge {
  problemDefinition?: ProblemDefinition;
}

interface GuidedWizardPageProps {
  challenge: ChallengeWithProblemDefinition;
}

/**
 * GuidedWizardPage - Step-by-step wizard tutorial
 *
 * Flow: Story → Learn → Practice (wizard) → Celebrate → Next Step
 *
 * Practice phase uses Option D: embedded canvas with focused task panel
 */
export const GuidedWizardPage: React.FC<GuidedWizardPageProps> = ({ challenge }) => {
  const navigate = useNavigate();

  // Canvas store
  const {
    systemGraph,
    setSystemGraph,
    selectedNode,
    setSelectedNode,
  } = useCanvasStore();

  // Code store (for validation)
  const { pythonCodeByServer } = useCodeStore();

  // Guided store
  const {
    tutorial,
    setTutorial,
    progress,
    advanceToNextStep,
    setPhase,
    incrementAttempt,
    setHintLevel,
    markTutorialComplete,
    isTutorialCompleted,
    askQuestion,
    completeRequirementsPhase,
  } = useGuidedStore();

  // Local state
  const [validationResult, setValidationResult] = useState<StepValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [inspectorNodeId, setInspectorNodeId] = useState<string | null>(null);
  const [isSandboxEnabled, setIsSandboxEnabled] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Initialize tutorial - only reset if no existing progress for this challenge
  useEffect(() => {
    console.log('[GuidedWizard] === MOUNT CHECK ===');
    console.log('[GuidedWizard] Challenge:', challenge?.id);

    if (!challenge?.problemDefinition) {
      console.log('[GuidedWizard] No problemDefinition found');
      return;
    }

    const loadedTutorial = challenge.problemDefinition.guidedTutorial
      ? challenge.problemDefinition.guidedTutorial
      : generateGuidedTutorial(challenge.problemDefinition);

    console.log('[GuidedWizard] Tutorial loaded:', loadedTutorial.steps.length, 'steps');

    // Check if we already have progress for this challenge
    const existingProgress = useGuidedStore.getState().progress;
    const existingTutorial = useGuidedStore.getState().tutorial;

    if (existingProgress?.problemId === challenge.id && existingTutorial) {
      console.log('[GuidedWizard] Resuming existing progress - step:', existingProgress.currentStepIndex, 'phase:', existingProgress.currentPhase);
      // Just sync local state with store, don't reset
      setTutorial(existingTutorial);
      setValidationResult(null);
      setShowHint(false);
      setIsValidating(false);

      // Don't pre-load any components - user should add everything themselves
      return;
    }

    console.log('[GuidedWizard] No existing progress, initializing fresh');

    // Reset EVERYTHING for new challenge
    // Check if tutorial has requirements phase - start there if so
    const hasRequirements = !!loadedTutorial.requirementsPhase;
    const firstStep = loadedTutorial.steps[0];
    
    // Determine initial phase:
    // 1. If has requirements phase -> start with 'requirements-intro' (welcome story)
    // 2. Else if first step has story -> 'story'
    // 3. Else -> 'learn'
    let initialPhase: StepPhase;
    if (hasRequirements) {
      initialPhase = 'requirements-intro'; // Show welcome story first, then requirements
    } else {
      initialPhase = firstStep?.story ? 'story' : 'learn';
    }

    console.log('[GuidedWizard] Starting at step 0, phase:', initialPhase, 'hasRequirements:', hasRequirements);

    // Set all state at once
    setTutorial(loadedTutorial);
    setValidationResult(null);
    setShowHint(false);
    setIsValidating(false);

    // Force the store state directly
    useGuidedStore.setState({
      mode: 'guided-tutorial',
      tutorial: loadedTutorial,
      progress: {
        problemId: challenge.id,
        currentStepIndex: 0,
        currentPhase: initialPhase,
        completedStepIds: [],
        attemptCounts: {},
        hintLevel: 'none',
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        quizAnswers: {},
        askedQuestionIds: [],
        requirementsPhaseComplete: false,
      },
    });

    // Start with empty canvas - user adds all components themselves
    setSystemGraph({
      components: [],
      connections: [],
    });

    console.log('[GuidedWizard] === INITIALIZATION COMPLETE ===');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount!

  // Get current step
  const currentStep = tutorial?.steps[progress?.currentStepIndex || 0] || null;
  const currentPhase = progress?.currentPhase || 'story';

  // Check if we're in requirements gathering phase
  const isInRequirementsPhase = currentPhase === 'requirements-questions' ||
                                 currentPhase === 'requirements-intro' ||
                                 currentPhase === 'requirements-summary';
  const requirementsPhase = tutorial?.requirementsPhase;

  // Debug logging
  console.log('[GuidedWizard] Render - stepIndex:', progress?.currentStepIndex, 'phase:', currentPhase, 'step:', currentStep?.story?.scenario?.substring(0, 30), 'inRequirementsPhase:', isInRequirementsPhase);

  // Handle story continue → go to learn
  const handleStoryContinue = useCallback(() => {
    setPhase('learn');
  }, [setPhase]);

  // Handle learn continue → go to practice
  const handleStartPractice = useCallback(() => {
    console.log('[GuidedWizard] Starting practice - resetting validation state');
    setValidationResult(null);  // MUST reset before changing phase
    setShowHint(false);
    setPhase('practice');
  }, [setPhase]);

  // Handle check design
  const handleCheckDesign = useCallback(() => {
    console.log('[GuidedWizard] handleCheckDesign called');
    if (!currentStep || !systemGraph) return;

    console.log('[GuidedWizard] Graph components:', systemGraph.components.map(c => ({ id: c.id, type: c.type })));
    console.log('[GuidedWizard] Graph connections:', systemGraph.connections);
    console.log('[GuidedWizard] Step validation requirements:', currentStep.validation);

    setIsValidating(true);
    setValidationResult(null);

    setTimeout(() => {
      const result = validateStep(currentStep, systemGraph, pythonCodeByServer);
      console.log('[GuidedWizard] Validation result:', JSON.stringify(result, null, 2));
      setValidationResult(result);
      setIsValidating(false);

      if (!result.passed) {
        incrementAttempt();
      }
    }, 500);
  }, [currentStep, systemGraph, incrementAttempt]);

  // Handle step complete → show celebration (only if validation actually passed)
  const handleStepComplete = useCallback(() => {
    console.log('[GuidedWizard] handleStepComplete called - validationResult:', validationResult);
    if (!validationResult?.passed) {
      console.log('[GuidedWizard] BLOCKED - no valid validation result!');
      return;
    }
    console.log('[GuidedWizard] Moving to celebrate');
    setPhase('celebrate');
  }, [setPhase, validationResult]);

  // Handle celebration continue → next step or finish
  const handleCelebrationContinue = useCallback(() => {
    setValidationResult(null);
    setShowHint(false);

    if (tutorial && progress && progress.currentStepIndex === tutorial.totalSteps - 1) {
      // Tutorial complete - go to solve on your own
      markTutorialComplete(challenge.id);
      navigate(`/system-design/${challenge.id}`);
    } else {
      advanceToNextStep();
    }
  }, [tutorial, progress, advanceToNextStep, markTutorialComplete, challenge?.id, navigate]);

  // Handle hint toggle
  const handleToggleHint = useCallback(() => {
    setShowHint((prev) => !prev);
    if (!showHint) {
      setHintLevel('level1');
    }
  }, [showHint, setHintLevel]);

  // Handle adding a component from the task panel
  const handleAddComponent = useCallback((type: string) => {
    console.log('[GuidedWizard] handleAddComponent called:', type, 'current graph:', systemGraph);
    if (!systemGraph) {
      console.log('[GuidedWizard] No systemGraph!');
      return;
    }

    const position = getPositionForType(type, systemGraph.components.length);
    const newComponent = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      config: {
        displayName: getDisplayName(type),
        position,
      },
    };

    const newGraph = {
      ...systemGraph,
      components: [...systemGraph.components, newComponent] as any,
    };
    console.log('[GuidedWizard] Setting new graph:', newGraph);
    setSystemGraph(newGraph);
  }, [systemGraph, setSystemGraph]);

  // Handle updating component config
  const handleUpdateConfig = useCallback((nodeId: string, config: Record<string, any>) => {
    if (!systemGraph) return;

    const newGraph = {
      ...systemGraph,
      components: systemGraph.components.map((comp) =>
        comp.id === nodeId ? { ...comp, config: { ...comp.config, ...config } } : comp
      ),
    };
    setSystemGraph(newGraph);
  }, [systemGraph, setSystemGraph]);

  // Handle node selection - open inspector for configuration
  const handleNodeSelect = useCallback((node: any) => {
    setSelectedNode(node);
    if (node) {
      setInspectorNodeId(node.id);
      setShowInspector(true);
    }
  }, [setSelectedNode]);

  // Handle closing inspector
  const handleCloseInspector = useCallback(() => {
    setShowInspector(false);
    setInspectorNodeId(null);
  }, []);

  // Handle asking an interview question (requirements phase)
  const handleAskQuestion = useCallback((questionId: string) => {
    console.log('[GuidedWizard] Question asked:', questionId);
    askQuestion(questionId);
  }, [askQuestion]);

  // Handle requirements intro continue → go to requirements questions
  const handleRequirementsIntroContinue = useCallback(() => {
    console.log('[GuidedWizard] Requirements intro complete, moving to questions');
    setPhase('requirements-questions');
  }, [setPhase]);

  // Handle completing requirements phase
  const handleCompleteRequirementsPhase = useCallback(() => {
    console.log('[GuidedWizard] Requirements phase complete');
    completeRequirementsPhase();
  }, [completeRequirementsPhase]);

  // Handle restart tutorial
  const handleRestartTutorial = useCallback(() => {
    if (!challenge?.problemDefinition) return;

    const loadedTutorial = challenge.problemDefinition.guidedTutorial
      ? challenge.problemDefinition.guidedTutorial
      : generateGuidedTutorial(challenge.problemDefinition);

    // Check if tutorial has requirements phase - start there if so
    const hasRequirements = !!loadedTutorial.requirementsPhase;
    const firstStep = loadedTutorial.steps[0];
    
    let initialPhase: StepPhase;
    if (hasRequirements) {
      initialPhase = 'requirements-intro'; // Show welcome story first, then requirements
    } else {
      initialPhase = firstStep?.story ? 'story' : 'learn';
    }

    // Reset everything
    setTutorial(loadedTutorial);
    setValidationResult(null);
    setShowHint(false);
    setIsValidating(false);

    useGuidedStore.setState({
      mode: 'guided-tutorial',
      tutorial: loadedTutorial,
      progress: {
        problemId: challenge.id,
        currentStepIndex: 0,
        currentPhase: initialPhase,
        completedStepIds: [],
        attemptCounts: {},
        hintLevel: 'none',
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        quizAnswers: {},
        askedQuestionIds: [],
        requirementsPhaseComplete: false,
      },
    });

    // Start with empty canvas - user adds all components themselves
    setSystemGraph({
      components: [],
      connections: [],
    });

    console.log('[GuidedWizard] Tutorial restarted');
  }, [challenge, setTutorial, setSystemGraph]);

  // Handle sandbox mode toggle
  const handleToggleSandbox = useCallback((enabled: boolean) => {
    setIsSandboxEnabled(enabled);
    console.log('[GuidedWizard] Sandbox mode:', enabled ? 'enabled' : 'disabled');
  }, []);

  // Handle comparison modal
  const handleShowComparison = useCallback(() => {
    setShowComparisonModal(true);
  }, []);

  const handleCloseComparison = useCallback(() => {
    setShowComparisonModal(false);
  }, []);

  // Check if tutorial is complete - use the persisted completion flag
  const isTutorialComplete = challenge?.id ? isTutorialCompleted(challenge.id) : false;

  // Get optimal solution from the last step's hints
  const optimalSolution = tutorial?.steps?.[tutorial.totalSteps - 1]?.hints || {
    solutionComponents: [],
    solutionConnections: [],
  };

  // Loading state
  if (!tutorial || !progress) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative">
      {/* Restart button - always visible in corner */}
      <button
        onClick={handleRestartTutorial}
        className="absolute top-2 right-2 z-[60] px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded border border-gray-300 transition-colors"
        title="Restart tutorial from beginning"
      >
        ↺ Restart
      </button>

      <AnimatePresence mode="wait">
        {/* Requirements Intro Phase - Welcome Story */}
        {currentPhase === 'requirements-intro' && requirementsPhase && (
          <StoryPanel
            key="requirements-intro"
            story={{
              emoji: '🎤',
              scenario: "Welcome, engineer! You've been hired to build TinyURL - a URL shortening service.",
              hook: "Before you start designing, you need to understand what you're building. In a real interview, you'd ask clarifying questions first.",
              challenge: "Let's gather the functional requirements by asking the right questions.",
            }}
            stepNumber={0}
            totalSteps={tutorial.totalSteps}
            onContinue={handleRequirementsIntroContinue}
          />
        )}

        {/* Requirements Gathering Phase (Step 0) */}
        {currentPhase === 'requirements-questions' && requirementsPhase && (
          <RequirementsGatheringPanel
            key="requirements"
            content={requirementsPhase}
            askedQuestionIds={progress.askedQuestionIds || []}
            onAskQuestion={handleAskQuestion}
            onComplete={handleCompleteRequirementsPhase}
          />
        )}

        {/* Story Phase */}
        {!isInRequirementsPhase && currentPhase === 'story' && currentStep?.story && (
          <StoryPanel
            key="story"
            story={currentStep.story}
            stepNumber={currentStep.stepNumber}
            totalSteps={tutorial.totalSteps}
            onContinue={handleStoryContinue}
          />
        )}

        {/* Learn Phase */}
        {!isInRequirementsPhase && currentPhase === 'learn' && currentStep?.learnPhase && (
          <FullScreenLearnPanel
            key="learn"
            content={currentStep.learnPhase}
            stepNumber={currentStep.stepNumber}
            totalSteps={tutorial.totalSteps}
            onStartPractice={handleStartPractice}
          />
        )}

        {/* Practice Phase - Wizard Style */}
        {!isInRequirementsPhase && currentPhase === 'practice' && currentStep && (
          <PracticeWizard
            key="practice"
            step={currentStep}
            totalSteps={tutorial.totalSteps}
            systemGraph={systemGraph}
            setSystemGraph={setSystemGraph}
            selectedNode={selectedNode}
            setSelectedNode={handleNodeSelect}
            validationResult={validationResult}
            isValidating={isValidating}
            showHint={showHint}
            attemptCount={progress?.attemptCounts?.[currentStep.id] || 0}
            onCheckDesign={handleCheckDesign}
            onStepComplete={handleStepComplete}
            onToggleHint={handleToggleHint}
            onAddComponent={handleAddComponent}
            onUpdateConfig={handleUpdateConfig}
          />
        )}

        {/* Celebration Phase */}
        {!isInRequirementsPhase && currentPhase === 'celebrate' && currentStep?.celebration && (
          <CelebrationPanel
            key="celebrate"
            celebration={currentStep.celebration}
            stepNumber={currentStep.stepNumber}
            totalSteps={tutorial.totalSteps}
            isLastStep={progress.currentStepIndex === tutorial.totalSteps - 1}
            onContinue={handleCelebrationContinue}
          />
        )}
      </AnimatePresence>

      {/* Progress Roadmap - shown during practice phase */}
      {!isInRequirementsPhase && currentPhase === 'practice' && tutorial && progress && (
        <ProgressRoadmapCollapsible
          tutorial={tutorial}
          progress={progress}
        />
      )}

      {/* Inspector Modal - shown when user clicks a component */}
      {showInspector && inspectorNodeId && systemGraph && (
        <InspectorModal
          nodeId={inspectorNodeId}
          systemGraph={systemGraph}
          onUpdateConfig={handleUpdateConfig}
          onClose={handleCloseInspector}
          availableAPIs={[
            'POST /api/v1/urls',
            'GET /api/v1/urls/:code',
          ]}
        />
      )}

      {/* Sandbox Mode Banner - shown when sandbox is enabled */}
      {isSandboxEnabled && (
        <SandboxModeBanner onExitSandbox={() => handleToggleSandbox(false)} />
      )}

      {/* Sandbox Mode Toggle - shown after tutorial completion */}
      <SandboxModeToggle
        isTutorialComplete={isTutorialComplete}
        isSandboxEnabled={isSandboxEnabled}
        onToggleSandbox={handleToggleSandbox}
      />

      {/* Compare Solution Button - shown after tutorial completion */}
      {isTutorialComplete && (
        <button
          onClick={handleShowComparison}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg transition-colors"
        >
          <span className="text-xl">📊</span>
          <span className="font-medium">Compare Solutions</span>
        </button>
      )}

      {/* Solution Comparison Modal */}
      <SolutionComparisonModal
        isOpen={showComparisonModal}
        onClose={handleCloseComparison}
        userGraph={systemGraph}
        optimalSolution={{
          components: optimalSolution.solutionComponents || [],
          connections: optimalSolution.solutionConnections || [],
        }}
        problemTitle={tutorial?.problemTitle || 'System Design'}
      />
    </div>
  );
};

// =============================================================================
// Practice Wizard Component (Option D Layout)
// =============================================================================

interface PracticeWizardProps {
  step: GuidedStep;
  totalSteps: number;
  systemGraph: any;
  setSystemGraph: (graph: any) => void;
  selectedNode: any;
  setSelectedNode: (node: any) => void;
  validationResult: StepValidationResult | null;
  isValidating: boolean;
  showHint: boolean;
  attemptCount: number;
  onCheckDesign: () => void;
  onStepComplete: () => void;
  onToggleHint: () => void;
  onAddComponent: (type: string) => void;
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;
}

function PracticeWizard({
  step,
  totalSteps,
  systemGraph,
  setSystemGraph,
  selectedNode,
  setSelectedNode,
  validationResult,
  isValidating,
  showHint,
  attemptCount,
  onCheckDesign,
  onStepComplete,
  onToggleHint,
  onAddComponent,
  onUpdateConfig,
}: PracticeWizardProps) {
  const { pythonCodeByServer } = useCodeStore();
  
  // Check if this step requires code implementation
  const requiresCode = step.validation.requireCodeImplementation;
  
  // Find the app server that needs code (first one with APIs configured)
  const appServer = systemGraph?.components.find(c => 
    (c.type === 'app_server' || c.type === 'compute') && 
    c.config?.handledAPIs?.length > 0
  );
  
  // Click to add component (simpler than drag-drop for embedded canvas)
  const handleAddClick = (componentType: string) => {
    console.log('[PracticeWizard] Adding component:', componentType);
    onAddComponent(componentType);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col h-full"
    >
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">
              Step {step.stepNumber} of {totalSteps}
            </span>
            <span className="text-sm text-blue-600 font-medium">Practice Mode</span>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i < step.stepNumber
                    ? 'bg-blue-500'
                    : i === step.stepNumber - 1
                    ? 'bg-blue-300'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Task Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {step.practicePhase.taskDescription}
              </h2>
              <p className="text-gray-600">
                {step.practicePhase.frText}
              </p>
            </div>

            {/* Task Content - varies by step type */}
            <div className="p-6 bg-gray-50">
              {step.practicePhase.componentsNeeded.length > 0 ? (
                /* "Add Component" type step */
                <>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Click to add this component to the canvas:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {step.practicePhase.componentsNeeded.map((comp) => (
                      <button
                        key={comp.type}
                        onClick={() => handleAddClick(comp.type)}
                        className="flex items-center gap-3 bg-blue-50 border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-100 rounded-lg px-4 py-3 cursor-pointer transition-all group"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{getComponentIcon(comp.type)}</span>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{comp.displayName}</p>
                          <p className="text-xs text-gray-500">{comp.reason}</p>
                        </div>
                        <span className="ml-2 text-blue-500 font-medium text-sm">+ Add</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                /* "Configuration" type step (no new components needed) */
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Your task:
                  </p>
                  <div className="space-y-3">
                    {step.practicePhase.successCriteria.map((criterion, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-800">{criterion}</span>
                      </div>
                    ))}
                  </div>
                  {!requiresCode && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">👆</span>
                        <div className="text-sm text-amber-800">
                          <strong>Tip:</strong> Click on the <span className="font-semibold">App Server</span> node in the canvas below to open the configuration panel. Then configure the APIs and write your Python code.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* CODE EDITOR SECTION - Show when step requires code */}
          {requiresCode && appServer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border-2 border-blue-300 mb-6 overflow-hidden"
            >
              <div className="h-[450px]">
                <InlineCodeEditor
                  appServer={appServer}
                  challenge={undefined}
                />
              </div>
            </motion.div>
          )}

          {/* Cost Summary Widget */}
          <div className="mb-6">
            <CostSummaryWidget
              systemGraph={systemGraph}
              budgetTarget={2500}
            />
          </div>

          {/* Canvas Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden"
          >
            <div className="h-[400px] relative">
              <ReactFlowProvider>
                <DesignCanvas
                  systemGraph={systemGraph || { components: [], connections: [] }}
                  onSystemGraphChange={setSystemGraph}
                  selectedNode={selectedNode}
                  onNodeSelect={setSelectedNode}
                  onAddComponent={(type) => onAddComponent(type)}
                  onUpdateConfig={onUpdateConfig}
                />
              </ReactFlowProvider>
            </div>
          </motion.div>

          {/* Hint Section */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-medium text-amber-900 mb-1">Hint</p>
                    <p className="text-amber-800">{step.hints.level1}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Validation Feedback - Enhanced Friendly Feedback */}
          <AnimatePresence>
            {(validationResult || isValidating) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <FriendlyFeedbackPanel
                  result={validationResult}
                  isValidating={isValidating}
                  step={step}
                  attemptCount={attemptCount}
                  onShowHint={onToggleHint}
                  onDismiss={() => {}}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={onToggleHint}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showHint
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>💡</span>
              {showHint ? 'Hide Hint' : 'Need a Hint?'}
            </button>

            {validationResult?.passed ? (
              <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={onStepComplete}
                className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
              >
                Continue →
              </motion.button>
            ) : (
              <button
                onClick={onCheckDesign}
                disabled={isValidating}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-colors"
              >
                {isValidating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Checking...
                  </span>
                ) : (
                  'Check My Design'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// Helper Functions
// =============================================================================

function getDisplayName(type: string): string {
  const names: Record<string, string> = {
    app_server: 'App Server',
    database: 'Database',
    cache: 'Cache (Redis)',
    load_balancer: 'Load Balancer',
    client: 'Client',
  };
  return names[type] || type;
}

function getComponentIcon(type: string): string {
  const icons: Record<string, string> = {
    app_server: '📦',
    database: '💾',
    cache: '⚡',
    load_balancer: '🌐',
    client: '👤',
  };
  return icons[type] || '📦';
}

function getPositionForType(type: string, existingCount: number): { x: number; y: number } {
  const basePositions: Record<string, { x: number; y: number }> = {
    app_server: { x: 300, y: 150 },
    database: { x: 500, y: 150 },
    cache: { x: 500, y: 50 },
    load_balancer: { x: 200, y: 150 },
  };

  const pos = basePositions[type] || { x: 300 + existingCount * 150, y: 150 };
  return pos;
}

export default GuidedWizardPage;
