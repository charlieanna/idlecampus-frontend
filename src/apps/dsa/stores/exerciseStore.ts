/**
 * Exercise Store - Zustand State Management
 * 
 * Manages exercise state, test results, and code execution
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

export interface ExerciseState {
  // Current exercise data
  currentExerciseId: string | null;
  code: string;
  
  // Test results
  testResults: TestResult[];
  isRunning: boolean;
  
  // Exercise progress
  attempts: number;
  hints: string[];
  hintsViewed: number;
  solutionViewed: boolean;
  
  // Actions
  setCurrentExercise: (exerciseId: string, starterCode?: string) => void;
  updateCode: (code: string) => void;
  runTests: (results: TestResult[]) => void;
  setRunning: (isRunning: boolean) => void;
  incrementAttempts: () => void;
  viewHint: (hint: string) => void;
  viewSolution: () => void;
  reset: () => void;
  resetExercise: (exerciseId: string) => void;
}

const initialState = {
  currentExerciseId: null,
  code: '',
  testResults: [],
  isRunning: false,
  attempts: 0,
  hints: [],
  hintsViewed: 0,
  solutionViewed: false,
};

export const useExerciseStore = create<ExerciseState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setCurrentExercise: (exerciseId, starterCode = '') =>
          set({
            currentExerciseId: exerciseId,
            code: starterCode,
            testResults: [],
            attempts: 0,
            hints: [],
            hintsViewed: 0,
            solutionViewed: false,
          }, false, 'setCurrentExercise'),

        updateCode: (code) =>
          set({ code }, false, 'updateCode'),

        runTests: (results) =>
          set({
            testResults: results,
            isRunning: false,
          }, false, 'runTests'),

        setRunning: (isRunning) =>
          set({ isRunning }, false, 'setRunning'),

        incrementAttempts: () =>
          set((state) => ({ attempts: state.attempts + 1 }), false, 'incrementAttempts'),

        viewHint: (hint) =>
          set((state) => ({
            hints: [...state.hints, hint],
            hintsViewed: state.hintsViewed + 1,
          }), false, 'viewHint'),

        viewSolution: () =>
          set({ solutionViewed: true }, false, 'viewSolution'),

        reset: () =>
          set(initialState, false, 'reset'),

        resetExercise: (exerciseId) =>
          set({
            currentExerciseId: exerciseId,
            code: '',
            testResults: [],
            attempts: 0,
            hints: [],
            hintsViewed: 0,
            solutionViewed: false,
          }, false, 'resetExercise'),
      }),
      {
        name: 'exercise-storage',
        partialize: (state) => ({
          currentExerciseId: state.currentExerciseId,
          attempts: state.attempts,
          hintsViewed: state.hintsViewed,
          solutionViewed: state.solutionViewed,
        }),
      }
    ),
    { name: 'ExerciseStore' }
  )
);

// Selectors
export const exerciseSelectors = {
  code: (state: ExerciseState) => state.code,
  testResults: (state: ExerciseState) => state.testResults,
  isRunning: (state: ExerciseState) => state.isRunning,
  attempts: (state: ExerciseState) => state.attempts,
  hintsViewed: (state: ExerciseState) => state.hintsViewed,
};