import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GuidedTutorial,
  GuidedTutorialProgress,
  GuidedStep,
  BuilderMode,
  HintLevel,
  TutorialCompletionStatus,
  StepPhase,
} from '../../types/guidedTutorial';

/**
 * Guided Tutorial Store
 *
 * Manages the state for guided tutorial mode including:
 * - Current mode (solve-on-own vs guided)
 * - Tutorial data and progress
 * - Phase tracking (learn vs practice)
 * - Hint system state
 * - Completion tracking
 *
 * Pedagogy: TEACH → SOLVE → TEACH → SOLVE
 * Each step has two phases:
 * 1. Learn Phase: Read concepts, understand "why"
 * 2. Practice Phase: Build on canvas
 */

interface GuidedState {
  // Mode
  mode: BuilderMode;

  // Tutorial data
  tutorial: GuidedTutorial | null;

  // Progress
  progress: GuidedTutorialProgress | null;

  // Completion tracking (persisted per problem)
  completedTutorials: Record<string, TutorialCompletionStatus>;

  // Computed: current step (derived from progress)
  getCurrentStep: () => GuidedStep | null;

  // Mode actions
  setMode: (mode: BuilderMode) => void;

  // Tutorial actions
  setTutorial: (tutorial: GuidedTutorial | null) => void;
  initializeProgress: (problemId: string) => void;

  // Phase actions
  setPhase: (phase: StepPhase) => void;
  advanceToPracticePhase: () => void;
  getCurrentPhase: () => StepPhase;

  // Progress actions
  advanceToNextStep: () => void;
  goToStep: (stepIndex: number) => void;
  incrementAttempt: () => void;
  resetAttempts: () => void;
  setHintLevel: (level: HintLevel) => void;
  markStepComplete: (stepId: string) => void;

  // Quiz actions
  recordQuizAnswer: (stepId: string, selectedIndex: number, correct: boolean) => void;

  // Completion actions
  markTutorialComplete: (problemId: string) => void;
  isTutorialCompleted: (problemId: string) => boolean;

  // Reset
  resetProgress: () => void;
  resetAll: () => void;
}

const STORAGE_KEY = 'system-design-guided-tutorial';

export const useGuidedStore = create<GuidedState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'guided-tutorial', // New users start in guided mode
      tutorial: null,
      progress: null,
      completedTutorials: {},

      // Computed: Get current step
      getCurrentStep: () => {
        const { tutorial, progress } = get();
        if (!tutorial || !progress) return null;
        return tutorial.steps[progress.currentStepIndex] || null;
      },

      // Mode actions
      setMode: (mode) => set({ mode }),

      // Tutorial actions
      setTutorial: (tutorial) => set({ tutorial }),

      initializeProgress: (problemId) => {
        const { completedTutorials } = get();
        const isCompleted = completedTutorials[problemId]?.isCompleted;

        // If already completed, allow solve-on-own mode
        // Otherwise, force guided mode for new users
        const mode: BuilderMode = isCompleted ? 'solve-on-own' : 'guided-tutorial';

        set({
          mode,
          progress: {
            problemId,
            currentStepIndex: 0,
            currentPhase: 'learn', // Always start with learn phase
            completedStepIds: [],
            attemptCounts: {},
            hintLevel: 'none',
            startedAt: new Date().toISOString(),
            lastAccessedAt: new Date().toISOString(),
            quizAnswers: {},
          },
        });
      },

      // Phase actions
      setPhase: (phase) => {
        const { progress } = get();
        if (!progress) return;

        set({
          progress: {
            ...progress,
            currentPhase: phase,
            lastAccessedAt: new Date().toISOString(),
          },
        });
      },

      advanceToPracticePhase: () => {
        const { progress } = get();
        if (!progress) return;

        set({
          progress: {
            ...progress,
            currentPhase: 'practice',
            lastAccessedAt: new Date().toISOString(),
          },
        });
      },

      getCurrentPhase: () => {
        const { progress } = get();
        return progress?.currentPhase || 'learn';
      },

      // Quiz actions
      recordQuizAnswer: (stepId, selectedIndex, correct) => {
        const { progress } = get();
        if (!progress) return;

        set({
          progress: {
            ...progress,
            quizAnswers: {
              ...progress.quizAnswers,
              [stepId]: { selectedIndex, correct },
            },
            lastAccessedAt: new Date().toISOString(),
          },
        });
      },

      // Progress actions
      advanceToNextStep: () => {
        const { tutorial, progress } = get();
        if (!tutorial || !progress) return;

        const currentStep = tutorial.steps[progress.currentStepIndex];
        const nextIndex = progress.currentStepIndex + 1;

        // Mark current step as complete
        const completedStepIds = [...progress.completedStepIds];
        if (currentStep && !completedStepIds.includes(currentStep.id)) {
          completedStepIds.push(currentStep.id);
        }

        // Check if tutorial is complete
        if (nextIndex >= tutorial.totalSteps) {
          // Tutorial complete!
          set((state) => ({
            progress: {
              ...progress,
              completedStepIds,
              currentStepIndex: progress.currentStepIndex, // Stay on last step
              currentPhase: 'practice', // Stay in practice on completed
              hintLevel: 'none',
              completedAt: new Date().toISOString(),
              lastAccessedAt: new Date().toISOString(),
            },
            completedTutorials: {
              ...state.completedTutorials,
              [progress.problemId]: {
                problemId: progress.problemId,
                isCompleted: true,
                completedAt: new Date().toISOString(),
                totalSteps: tutorial.totalSteps,
                completedSteps: tutorial.totalSteps,
              },
            },
          }));
        } else {
          // Move to next step - start with learn phase
          set({
            progress: {
              ...progress,
              currentStepIndex: nextIndex,
              currentPhase: 'learn', // Reset to learn phase for new step
              completedStepIds,
              hintLevel: 'none',
              attemptCounts: {
                ...progress.attemptCounts,
                [tutorial.steps[nextIndex].id]: 0,
              },
              lastAccessedAt: new Date().toISOString(),
            },
          });
        }
      },

      goToStep: (stepIndex) => {
        const { tutorial, progress } = get();
        if (!tutorial || !progress) return;
        if (stepIndex < 0 || stepIndex >= tutorial.totalSteps) return;

        // Check if this step was already completed
        const stepId = tutorial.steps[stepIndex].id;
        const isCompleted = progress.completedStepIds.includes(stepId);

        set({
          progress: {
            ...progress,
            currentStepIndex: stepIndex,
            // If step is completed, go to practice; otherwise start with learn
            currentPhase: isCompleted ? 'practice' : 'learn',
            hintLevel: 'none',
            lastAccessedAt: new Date().toISOString(),
          },
        });
      },

      incrementAttempt: () => {
        const { tutorial, progress } = get();
        if (!tutorial || !progress) return;

        const currentStep = tutorial.steps[progress.currentStepIndex];
        if (!currentStep) return;

        const currentAttempts = progress.attemptCounts[currentStep.id] || 0;
        const newAttempts = currentAttempts + 1;

        // Auto-escalate hint level based on attempts
        let newHintLevel: HintLevel = progress.hintLevel;
        if (newAttempts === 1 && progress.hintLevel === 'none') {
          newHintLevel = 'level1';
        } else if (newAttempts === 2 && progress.hintLevel === 'level1') {
          newHintLevel = 'level2';
        } else if (newAttempts >= 3) {
          newHintLevel = 'solution';
        }

        set({
          progress: {
            ...progress,
            attemptCounts: {
              ...progress.attemptCounts,
              [currentStep.id]: newAttempts,
            },
            hintLevel: newHintLevel,
            lastAccessedAt: new Date().toISOString(),
          },
        });
      },

      resetAttempts: () => {
        const { progress } = get();
        if (!progress) return;

        set({
          progress: {
            ...progress,
            hintLevel: 'none',
            lastAccessedAt: new Date().toISOString(),
          },
        });
      },

      setHintLevel: (level) => {
        const { progress } = get();
        if (!progress) return;

        set({
          progress: {
            ...progress,
            hintLevel: level,
            lastAccessedAt: new Date().toISOString(),
          },
        });
      },

      markStepComplete: (stepId) => {
        const { progress } = get();
        if (!progress) return;

        if (!progress.completedStepIds.includes(stepId)) {
          set({
            progress: {
              ...progress,
              completedStepIds: [...progress.completedStepIds, stepId],
              lastAccessedAt: new Date().toISOString(),
            },
          });
        }
      },

      // Completion actions
      markTutorialComplete: (problemId) => {
        const { tutorial } = get();
        set((state) => ({
          completedTutorials: {
            ...state.completedTutorials,
            [problemId]: {
              problemId,
              isCompleted: true,
              completedAt: new Date().toISOString(),
              totalSteps: tutorial?.totalSteps || 0,
              completedSteps: tutorial?.totalSteps || 0,
            },
          },
        }));
      },

      isTutorialCompleted: (problemId) => {
        const { completedTutorials } = get();
        return completedTutorials[problemId]?.isCompleted || false;
      },

      // Reset
      resetProgress: () => {
        const { progress } = get();
        if (!progress) return;

        set({
          progress: {
            ...progress,
            currentStepIndex: 0,
            currentPhase: 'learn', // Reset to learn phase
            completedStepIds: [],
            attemptCounts: {},
            hintLevel: 'none',
            completedAt: undefined,
            quizAnswers: {},
            lastAccessedAt: new Date().toISOString(),
          },
        });
      },

      resetAll: () => {
        set({
          mode: 'guided-tutorial',
          tutorial: null,
          progress: null,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        completedTutorials: state.completedTutorials,
        // Don't persist tutorial/progress - regenerate on load
      }),
    }
  )
);
