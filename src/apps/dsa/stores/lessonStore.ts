/**
 * Lesson Store - Zustand State Management
 * 
 * Replaces 40+ useState calls in AppDSA.tsx with centralized state
 * 
 * Benefits:
 * - Single source of truth for lesson state
 * - Easy to debug with Redux DevTools
 * - No prop drilling
 * - Automatic re-renders only when needed
 * - TypeScript autocomplete everywhere
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { 
  ProgressiveLesson, 
  ProgressiveLessonProgress,
  SectionProgress 
} from '../types/progressive-lesson-enhanced';

interface LessonState {
  // Current lesson data
  currentLesson: ProgressiveLesson | null;
  currentLessonId: string | null;
  currentModuleId: string | null;
  
  // Progress tracking
  progress: ProgressiveLessonProgress | null;
  completedLessons: Set<string>;
  completedModules: Set<string>;
  
  // UI state
  currentSectionIndex: number;
  expandedSections: Set<string>;
  
  // Actions
  setCurrentLesson: (lesson: ProgressiveLesson, moduleId: string) => void;
  setProgress: (progress: ProgressiveLessonProgress) => void;
  updateSectionProgress: (sectionId: string, updates: Partial<SectionProgress>) => void;
  completeSection: (sectionId: string) => void;
  completeLesson: (lessonId: string) => void;
  completeModule: (moduleId: string) => void;
  goToSection: (index: number) => void;
  toggleSection: (sectionId: string) => void;
  reset: () => void;
}

const initialState = {
  currentLesson: null,
  currentLessonId: null,
  currentModuleId: null,
  progress: null,
  completedLessons: new Set<string>(),
  completedModules: new Set<string>(),
  currentSectionIndex: 0,
  expandedSections: new Set<string>(),
};

export const useLessonStore = create<LessonState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setCurrentLesson: (lesson, moduleId) => 
          set({ 
            currentLesson: lesson,
            currentLessonId: lesson.id,
            currentModuleId: moduleId,
            currentSectionIndex: 0,
          }, false, 'setCurrentLesson'),

        setProgress: (progress) => 
          set({ progress }, false, 'setProgress'),

        updateSectionProgress: (sectionId, updates) => 
          set((state) => {
            if (!state.progress) return state;
            
            const currentProgress = state.progress.sectionsProgress.get(sectionId) || {
              sectionId,
              status: 'locked',
              attempts: 0,
              timeSpent: 0,
            };
            
            const updatedProgress = { ...currentProgress, ...updates };
            const newSectionsProgress = new Map(state.progress.sectionsProgress);
            newSectionsProgress.set(sectionId, updatedProgress);
            
            return {
              progress: {
                ...state.progress,
                sectionsProgress: newSectionsProgress,
              },
            };
          }, false, 'updateSectionProgress'),

        completeSection: (sectionId) => 
          set((state) => {
            const { updateSectionProgress } = get();
            updateSectionProgress(sectionId, { status: 'completed' });
            
            return state;
          }, false, 'completeSection'),

        completeLesson: (lessonId) => 
          set((state) => ({
            completedLessons: new Set([...state.completedLessons, lessonId]),
          }), false, 'completeLesson'),

        completeModule: (moduleId) => 
          set((state) => ({
            completedModules: new Set([...state.completedModules, moduleId]),
          }), false, 'completeModule'),

        goToSection: (index) => 
          set({ currentSectionIndex: index }, false, 'goToSection'),

        toggleSection: (sectionId) => 
          set((state) => {
            const newExpanded = new Set(state.expandedSections);
            if (newExpanded.has(sectionId)) {
              newExpanded.delete(sectionId);
            } else {
              newExpanded.add(sectionId);
            }
            return { expandedSections: newExpanded };
          }, false, 'toggleSection'),

        reset: () => 
          set(initialState, false, 'reset'),
      }),
      {
        name: 'lesson-storage',
        partialize: (state) => ({
          completedLessons: Array.from(state.completedLessons),
          completedModules: Array.from(state.completedModules),
          currentLessonId: state.currentLessonId,
          currentModuleId: state.currentModuleId,
          progress: state.progress,
        }),
      }
    ),
    { name: 'LessonStore' }
  )
);

// Selectors for optimized re-renders
export const lessonSelectors = {
  currentLesson: (state: LessonState) => state.currentLesson,
  progress: (state: LessonState) => state.progress,
  completedLessons: (state: LessonState) => state.completedLessons,
  currentSectionIndex: (state: LessonState) => state.currentSectionIndex,
  currentModuleId: (state: LessonState) => state.currentModuleId,
};