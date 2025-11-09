import { useMemo } from 'react';

export interface LessonInfo {
  id: string;
  title: string;
  sequenceOrder?: number;
}

export interface ModuleWithLessons {
  id: string;
  lessons: LessonInfo[];
}

/**
 * Hook to manage lesson gating logic
 * Returns functions to check if lessons are accessible and get lock messages
 */
export function useLessonGating(
  completedLessons: Set<string>,
  modules: ModuleWithLessons[]
) {
  /**
   * Check if a lesson can be accessed based on previous lesson completion
   */
  const canAccessLesson = useMemo(() => {
    return (lessonId: string, allLessonsInOrder: Array<{ id: string; sequenceOrder: number }>): boolean => {
      // Sort lessons by sequence order
      const sortedLessons = [...allLessonsInOrder].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

      // Find current lesson index
      const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);

      // First lesson is always accessible
      if (currentIndex <= 0) {
        return true;
      }

      // Check if previous lesson is completed
      const previousLesson = sortedLessons[currentIndex - 1];
      return completedLessons.has(previousLesson.id);
    };
  }, [completedLessons]);

  /**
   * Get the title of the previous lesson (for lock message)
   */
  const getPreviousLessonTitle = useMemo(() => {
    return (lessonId: string): string | undefined => {
      // Find the module containing this lesson
      const currentModule = modules.find(m =>
        m.lessons.some(l => l.id === lessonId)
      );
      if (!currentModule) return undefined;

      // Build sorted lesson list with titles
      const allLessons = currentModule.lessons.map((l, idx) => ({
        id: l.id,
        title: l.title,
        sequenceOrder: l.sequenceOrder ?? idx
      }));

      const sortedLessons = [...allLessons].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
      const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);

      if (currentIndex > 0) {
        return sortedLessons[currentIndex - 1].title;
      }

      return undefined;
    };
  }, [modules]);

  /**
   * Get accessibility info for a specific lesson
   */
  const getLessonAccessInfo = useMemo(() => {
    return (lessonId: string) => {
      // Find the module containing this lesson
      const currentModule = modules.find(m =>
        m.lessons.some(l => l.id === lessonId)
      );

      if (!currentModule) {
        return { isAccessible: true, previousLessonTitle: undefined };
      }

      const allLessonsInOrder = currentModule.lessons.map((l, idx) => ({
        id: l.id,
        sequenceOrder: l.sequenceOrder ?? idx
      }));

      const isAccessible = canAccessLesson(lessonId, allLessonsInOrder);
      const previousLessonTitle = isAccessible ? undefined : getPreviousLessonTitle(lessonId);

      return { isAccessible, previousLessonTitle };
    };
  }, [modules, canAccessLesson, getPreviousLessonTitle]);

  return {
    canAccessLesson,
    getPreviousLessonTitle,
    getLessonAccessInfo
  };
}
