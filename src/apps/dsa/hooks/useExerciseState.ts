import { useState, useCallback } from 'react';

/**
 * Centralized hook for managing exercise state across all modules
 * Handles hints, solution display, completion status, and auto-scroll
 */

export interface ExerciseState {
  hintsShown: number;
  solutionShown: boolean;
  isCompleted: boolean;
  attempts: number;
}

export interface UseExerciseStateReturn extends ExerciseState {
  showNextHint: () => void;
  showSolution: () => void;
  markCompleted: () => void;
  recordAttempt: () => void;
  scrollToHints: (exerciseId: string) => void;
  scrollToSolution: (exerciseId: string) => void;
  resetState: () => void;
}

export function useExerciseState(exerciseId: string): UseExerciseStateReturn {
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionShown, setSolutionShown] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const showNextHint = useCallback(() => {
    setHintsShown(prev => prev + 1);
  }, [exerciseId, hintsShown]);

  const showSolution = useCallback(() => {
    setSolutionShown(true);
  }, [exerciseId]);

  const markCompleted = useCallback(() => {
    setIsCompleted(true);
    setSolutionShown(true); // Auto-show solution on completion
  }, [exerciseId]);

  const recordAttempt = useCallback(() => {
    setAttempts(prev => prev + 1);
  }, [exerciseId, attempts]);

  const scrollToHints = useCallback((exerciseId: string) => {
    setTimeout(() => {
      const hintsSection = document.querySelector(`[data-hints-section="${exerciseId}"]`);
      if (hintsSection) {
        hintsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }, []);

  const scrollToSolution = useCallback((exerciseId: string) => {
    setTimeout(() => {
      const solutionSection = document.querySelector(`[data-solution-section="${exerciseId}"]`);
      if (solutionSection) {
        solutionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }, []);

  const resetState = useCallback(() => {
    setHintsShown(0);
    setSolutionShown(false);
    setIsCompleted(false);
    setAttempts(0);
  }, [exerciseId]);

  return {
    hintsShown,
    solutionShown,
    isCompleted,
    attempts,
    showNextHint,
    showSolution,
    markCompleted,
    recordAttempt,
    scrollToHints,
    scrollToSolution,
    resetState
  };
}
