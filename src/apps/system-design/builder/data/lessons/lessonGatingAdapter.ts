/**
 * Adapter to convert system design course modules to the format expected by useLessonGating hook
 */

import type { ModuleWithLessons, LessonInfo } from '../../../../../hooks/useLessonGating';
import { courseModules } from './modules';
import { allLessons } from './index';

/**
 * Convert system design lessons to LessonInfo format
 */
export function adaptLessonsForGating(moduleId: string): LessonInfo[] {
  return allLessons
    .filter(lesson => lesson.moduleId === moduleId)
    .sort((a, b) => (a.sequenceOrder || 0) - (b.sequenceOrder || 0))
    .map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      sequenceOrder: lesson.sequenceOrder
    }));
}

/**
 * Convert all course modules to the format expected by useLessonGating
 */
export function adaptModulesForGating(): ModuleWithLessons[] {
  return courseModules
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder)
    .map(module => ({
      id: module.id,
      title: module.title,
      lessons: adaptLessonsForGating(module.id),
      sequenceOrder: module.sequenceOrder
    }));
}

/**
 * Get completed lesson IDs from user progress
 * This should be replaced with actual API call to get user's completed lessons
 */
export function getCompletedLessonIds(userProgress?: any): Set<string> {
  // TODO: Replace with actual API call
  // For now, return empty set (all lessons locked except first)
  if (!userProgress) {
    return new Set<string>();
  }

  // If user progress data is available, extract completed lesson IDs
  const completedIds = new Set<string>();

  if (userProgress.completedLessons && Array.isArray(userProgress.completedLessons)) {
    userProgress.completedLessons.forEach((lessonId: string) => {
      completedIds.add(lessonId);
    });
  }

  return completedIds;
}

/**
 * Helper to check if a specific lesson is completed
 */
export function isLessonCompleted(lessonId: string, completedLessons: Set<string>): boolean {
  return completedLessons.has(lessonId);
}

/**
 * Get the first accessible lesson in the course
 */
export function getFirstAccessibleLesson(completedLessons: Set<string>): string | undefined {
  const modules = adaptModulesForGating();

  for (const module of modules) {
    for (const lesson of module.lessons) {
      // If this is the very first lesson, it's always accessible
      if (module.sequenceOrder === 1 && lesson.sequenceOrder === 1) {
        return lesson.id;
      }

      // Otherwise, find the first uncompleted lesson
      if (!completedLessons.has(lesson.id)) {
        return lesson.id;
      }
    }
  }

  // All lessons completed, return the last lesson
  const lastModule = modules[modules.length - 1];
  const lastLesson = lastModule?.lessons[lastModule.lessons.length - 1];
  return lastLesson?.id;
}
