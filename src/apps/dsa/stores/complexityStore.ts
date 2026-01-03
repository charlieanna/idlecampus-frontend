/**
 * Complexity Store - Zustand State Management
 * 
 * Manages complexity quiz state and tracking for progressive lessons
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ComplexityState {
  // Exercises awaiting complexity analysis
  exercisesAwaitingAnalysis: Set<string>;
  
  // Exercises where complexity quiz was completed BEFORE coding
  exercisesWithBeforeQuizCompleted: Set<string>;
  
  // Track when to show complexity explanation in left panel
  showingBeforeQuizExplanation: string | null;
  
  // Actions
  addExerciseAwaitingAnalysis: (exerciseId: string) => void;
  removeExerciseAwaitingAnalysis: (exerciseId: string) => void;
  markBeforeQuizCompleted: (exerciseId: string) => void;
  showBeforeQuizExplanation: (exerciseId: string) => void;
  hideBeforeQuizExplanation: () => void;
  reset: () => void;
}

const initialState = {
  exercisesAwaitingAnalysis: new Set<string>(),
  exercisesWithBeforeQuizCompleted: new Set<string>(),
  showingBeforeQuizExplanation: null,
};

export const useComplexityStore = create<ComplexityState>()(
  devtools(
    (set) => ({
      ...initialState,

      addExerciseAwaitingAnalysis: (exerciseId) =>
        set((state) => ({
          exercisesAwaitingAnalysis: new Set([...state.exercisesAwaitingAnalysis, exerciseId]),
        }), false, 'addExerciseAwaitingAnalysis'),

      removeExerciseAwaitingAnalysis: (exerciseId) =>
        set((state) => {
          const newSet = new Set(state.exercisesAwaitingAnalysis);
          newSet.delete(exerciseId);
          return { exercisesAwaitingAnalysis: newSet };
        }, false, 'removeExerciseAwaitingAnalysis'),

      markBeforeQuizCompleted: (exerciseId) =>
        set((state) => ({
          exercisesWithBeforeQuizCompleted: new Set([...state.exercisesWithBeforeQuizCompleted, exerciseId]),
        }), false, 'markBeforeQuizCompleted'),

      showBeforeQuizExplanation: (exerciseId) =>
        set({ showingBeforeQuizExplanation: exerciseId }, false, 'showBeforeQuizExplanation'),

      hideBeforeQuizExplanation: () =>
        set({ showingBeforeQuizExplanation: null }, false, 'hideBeforeQuizExplanation'),

      reset: () =>
        set(initialState, false, 'reset'),
    }),
    { name: 'ComplexityStore' }
  )
);

// Selectors
export const complexitySelectors = {
  exercisesAwaitingAnalysis: (state: ComplexityState) => state.exercisesAwaitingAnalysis,
  exercisesWithBeforeQuizCompleted: (state: ComplexityState) => state.exercisesWithBeforeQuizCompleted,
  showingBeforeQuizExplanation: (state: ComplexityState) => state.showingBeforeQuizExplanation,
};