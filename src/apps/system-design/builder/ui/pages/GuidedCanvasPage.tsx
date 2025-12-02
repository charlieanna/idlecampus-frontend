import { useState, useCallback, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { useNavigate } from 'react-router-dom';
import { DesignCanvas } from '../components/DesignCanvas';
import { GuidedTeachingPanel, GuidedSidebar, ModeSwitcher } from '../components/guided';
import { TutorialCompleteModal } from '../components/guided/TutorialCompleteModal';
import { useCanvasStore, useGuidedStore } from '../store';
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
  const { systemGraph, setSystemGraph, selectedNode, setSelectedNode } = useCanvasStore();
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

  // Local state
  const [validationResult, setValidationResult] = useState<StepValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Initialize tutorial when challenge loads
  useEffect(() => {
    if (challenge?.problemDefinition) {
      // Use pre-defined rich tutorial if available, otherwise generate basic one
      const tutorial = challenge.problemDefinition.guidedTutorial
        ? challenge.problemDefinition.guidedTutorial
        : generateGuidedTutorial(challenge.problemDefinition);

      setTutorial(tutorial);
      initializeProgress(challenge.id);

      // Check if already completed
      const completed = isTutorialCompleted(challenge.id);
      setTutorialComplete(completed);
    }
  }, [challenge?.id]);

  // Get current step
  const currentStep = tutorial?.steps[progress?.currentStepIndex || 0] || null;

  // Handle checking the user's design
  const handleCheckDesign = useCallback(() => {
    if (!currentStep || !systemGraph) return;

    setIsValidating(true);
    setValidationResult(null);

    // Simulate a short delay for UX
    setTimeout(() => {
      const result = validateStep(currentStep, systemGraph);
      setValidationResult(result);
      setIsValidating(false);

      if (!result.passed) {
        incrementAttempt();
      }
    }, 500);
  }, [currentStep, systemGraph, incrementAttempt]);

  // Handle advancing to next step
  const handleNextStep = useCallback(() => {
    setValidationResult(null);

    // Check if this was the last step
    if (tutorial && progress && progress.currentStepIndex === tutorial.totalSteps - 1) {
      // Tutorial complete! Show celebration modal
      setTutorialComplete(true);
      setShowCompleteModal(true);
      markTutorialComplete(challenge.id);
    } else {
      advanceToNextStep();
    }
  }, [tutorial, progress, advanceToNextStep, markTutorialComplete, challenge?.id]);

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
    goToStep(stepIndex);
  }, [goToStep]);

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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Guided Teaching Panel */}
        <GuidedTeachingPanel
          tutorial={tutorial}
          progress={progress}
          validationResult={validationResult}
          isValidating={isValidating}
          onCheckDesign={handleCheckDesign}
          onNextStep={handleNextStep}
          onGoToStep={handleGoToStep}
          onRequestHint={handleRequestHint}
          onShowSolution={handleShowSolution}
          isTutorialComplete={tutorialComplete}
          onPhaseChange={handlePhaseChange}
          onQuizAnswer={handleQuizAnswer}
        />

        {/* Center Panel - Design Canvas */}
        <div className="flex-1 relative h-full">
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

        {/* Right Panel - Guided Sidebar */}
        <GuidedSidebar
          currentStep={currentStep}
          onDragStart={handleDragStart}
        />
      </div>

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
    </div>
  );
};

export default GuidedCanvasPage;
