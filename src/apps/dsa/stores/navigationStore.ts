/**
 * Navigation Store - Zustand State Management
 * 
 * Manages module/lesson navigation and UI state
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface NavigationState {
  // Module/Lesson navigation
  currentModuleIndex: number;
  currentLessonIndex: number;
  
  // Task/Quiz state
  currentTaskId: string | null;
  currentQuizIndex: number;
  progressiveQuizIndex: number;
  timeComplexityStageIndex: number;
  
  // UI toggles
  showQuiz: boolean;
  showLinkedListPractice: boolean;
  showCelebration: boolean;
  
  // Expandable UI state
  expandedHints: Set<string>;
  expandedLessons: Set<string>;
  expandedModules: Set<number>;
  collapsedDescriptions: Set<string>;
  
  // Completed tracking
  completedTasks: Set<string>;
  completedQuizzes: Set<string>;
  
  // Reading quiz answers
  readingQuizAnswers: Map<string, { answer: number | null; completed: boolean }>;
  
  // Exercise success modal
  exerciseSuccess: { exerciseId: string; exerciseTitle: string } | null;
  
  // Actions
  setCurrentModule: (index: number) => void;
  setCurrentLesson: (index: number) => void;
  setCurrentTask: (taskId: string | null) => void;
  setCurrentQuizIndex: (index: number) => void;
  setProgressiveQuizIndex: (index: number) => void;
  setTimeComplexityStageIndex: (index: number) => void;
  toggleQuiz: () => void;
  setShowLinkedListPractice: (show: boolean) => void;
  setShowCelebration: (show: boolean) => void;
  toggleHint: (hintKey: string) => void;
  toggleLesson: (lessonId: string) => void;
  toggleModule: (moduleIndex: number) => void;
  toggleDescription: (descriptionId: string) => void;
  markTaskCompleted: (taskId: string) => void;
  markQuizCompleted: (quizId: string) => void;
  setReadingQuizAnswer: (questionId: string, answer: number | null, completed: boolean) => void;
  showExerciseSuccess: (exerciseId: string, exerciseTitle: string) => void;
  hideExerciseSuccess: () => void;
  reset: () => void;
}

const initialState = {
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  currentTaskId: null,
  currentQuizIndex: 0,
  progressiveQuizIndex: 0,
  timeComplexityStageIndex: 0,
  showQuiz: false,
  showLinkedListPractice: false,
  showCelebration: false,
  expandedHints: new Set<string>(),
  expandedLessons: new Set<string>(),
  expandedModules: new Set<number>([0]), // Module 0 expanded by default
  collapsedDescriptions: new Set<string>(),
  completedTasks: new Set<string>(),
  completedQuizzes: new Set<string>(),
  readingQuizAnswers: new Map<string, { answer: number | null; completed: boolean }>(),
  exerciseSuccess: null,
};

export const useNavigationStore = create<NavigationState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setCurrentModule: (index) =>
          set({ currentModuleIndex: index }, false, 'setCurrentModule'),

        setCurrentLesson: (index) =>
          set({ currentLessonIndex: index }, false, 'setCurrentLesson'),

        setCurrentTask: (taskId) =>
          set({ currentTaskId: taskId }, false, 'setCurrentTask'),

        setCurrentQuizIndex: (index) =>
          set({ currentQuizIndex: index }, false, 'setCurrentQuizIndex'),

        setProgressiveQuizIndex: (index) =>
          set({ progressiveQuizIndex: index }, false, 'setProgressiveQuizIndex'),

        setTimeComplexityStageIndex: (index) =>
          set({ timeComplexityStageIndex: index }, false, 'setTimeComplexityStageIndex'),

        toggleQuiz: () =>
          set((state) => ({ showQuiz: !state.showQuiz }), false, 'toggleQuiz'),

        setShowLinkedListPractice: (show) =>
          set({ showLinkedListPractice: show }, false, 'setShowLinkedListPractice'),

        setShowCelebration: (show) =>
          set({ showCelebration: show }, false, 'setShowCelebration'),

        toggleHint: (hintKey) =>
          set((state) => {
            const newSet = new Set(state.expandedHints);
            if (newSet.has(hintKey)) {
              newSet.delete(hintKey);
            } else {
              newSet.add(hintKey);
            }
            return { expandedHints: newSet };
          }, false, 'toggleHint'),

        toggleLesson: (lessonId) =>
          set((state) => {
            const newSet = new Set(state.expandedLessons);
            if (newSet.has(lessonId)) {
              newSet.delete(lessonId);
            } else {
              newSet.add(lessonId);
            }
            return { expandedLessons: newSet };
          }, false, 'toggleLesson'),

        toggleModule: (moduleIndex) =>
          set((state) => {
            const newSet = new Set(state.expandedModules);
            if (newSet.has(moduleIndex)) {
              newSet.delete(moduleIndex);
            } else {
              newSet.add(moduleIndex);
            }
            return { expandedModules: newSet };
          }, false, 'toggleModule'),

        toggleDescription: (descriptionId) =>
          set((state) => {
            const newSet = new Set(state.collapsedDescriptions);
            if (newSet.has(descriptionId)) {
              newSet.delete(descriptionId);
            } else {
              newSet.add(descriptionId);
            }
            return { collapsedDescriptions: newSet };
          }, false, 'toggleDescription'),

        markTaskCompleted: (taskId) =>
          set((state) => ({
            completedTasks: new Set([...state.completedTasks, taskId]),
          }), false, 'markTaskCompleted'),

        markQuizCompleted: (quizId) =>
          set((state) => ({
            completedQuizzes: new Set([...state.completedQuizzes, quizId]),
          }), false, 'markQuizCompleted'),

        setReadingQuizAnswer: (questionId, answer, completed) =>
          set((state) => {
            const newMap = new Map(state.readingQuizAnswers);
            newMap.set(questionId, { answer, completed });
            return { readingQuizAnswers: newMap };
          }, false, 'setReadingQuizAnswer'),

        showExerciseSuccess: (exerciseId, exerciseTitle) =>
          set({ exerciseSuccess: { exerciseId, exerciseTitle } }, false, 'showExerciseSuccess'),

        hideExerciseSuccess: () =>
          set({ exerciseSuccess: null }, false, 'hideExerciseSuccess'),

        reset: () =>
          set(initialState, false, 'reset'),
      }),
      {
        name: 'navigation-storage',
        partialize: (state) => ({
          currentModuleIndex: state.currentModuleIndex,
          currentLessonIndex: state.currentLessonIndex,
          expandedModules: Array.from(state.expandedModules),
          completedTasks: Array.from(state.completedTasks),
          completedQuizzes: Array.from(state.completedQuizzes),
        }),
      }
    ),
    { name: 'NavigationStore' }
  )
);

// Selectors
export const navigationSelectors = {
  currentModuleIndex: (state: NavigationState) => state.currentModuleIndex,
  currentLessonIndex: (state: NavigationState) => state.currentLessonIndex,
  expandedModules: (state: NavigationState) => state.expandedModules,
  showQuiz: (state: NavigationState) => state.showQuiz,
  exerciseSuccess: (state: NavigationState) => state.exerciseSuccess,
};