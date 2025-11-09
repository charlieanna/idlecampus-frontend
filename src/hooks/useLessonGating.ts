import { useMemo } from 'react';

export interface LessonInfo {
  id: string;
  title: string;
  sequenceOrder?: number;
}

export interface ModuleWithLessons {
  id: string;
  title?: string;
  lessons: LessonInfo[];
  sequenceOrder?: number;
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
   * Check if all lessons in a module are completed
   */
  const isModuleCompleted = useMemo(() => {
    return (moduleId: string): boolean => {
      const module = modules.find(m => m.id === moduleId);
      if (!module || module.lessons.length === 0) return false;

      return module.lessons.every(lesson => completedLessons.has(lesson.id));
    };
  }, [modules, completedLessons]);

  /**
   * Check if a module can be accessed based on previous module completion
   */
  const canAccessModule = useMemo(() => {
    return (moduleId: string): boolean => {
      // Sort modules by sequence order
      const sortedModules = [...modules].sort((a, b) =>
        (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0)
      );

      // Find current module index
      const currentIndex = sortedModules.findIndex(m => m.id === moduleId);

      // First module is always accessible
      if (currentIndex <= 0) {
        return true;
      }

      // Check if all lessons in previous module are completed
      const previousModule = sortedModules[currentIndex - 1];
      return isModuleCompleted(previousModule.id);
    };
  }, [modules, isModuleCompleted]);

  /**
   * Get the title of the previous module (for lock message)
   */
  const getPreviousModuleTitle = useMemo(() => {
    return (moduleId: string): string | undefined => {
      const sortedModules = [...modules].sort((a, b) =>
        (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0)
      );

      const currentIndex = sortedModules.findIndex(m => m.id === moduleId);

      if (currentIndex > 0) {
        return sortedModules[currentIndex - 1].title;
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
        return { isAccessible: true, previousLessonTitle: undefined, moduleAccessible: true };
      }

      // First check if the module itself is accessible
      const moduleAccessible = canAccessModule(currentModule.id);

      if (!moduleAccessible) {
        const previousModuleTitle = getPreviousModuleTitle(currentModule.id);
        return {
          isAccessible: false,
          previousLessonTitle: undefined,
          moduleAccessible: false,
          previousModuleTitle
        };
      }

      // If module is accessible, check lesson accessibility
      const allLessonsInOrder = currentModule.lessons.map((l, idx) => ({
        id: l.id,
        sequenceOrder: l.sequenceOrder ?? idx
      }));

      const isAccessible = canAccessLesson(lessonId, allLessonsInOrder);
      const previousLessonTitle = isAccessible ? undefined : getPreviousLessonTitle(lessonId);

      return {
        isAccessible,
        previousLessonTitle,
        moduleAccessible: true
      };
    };
  }, [modules, canAccessLesson, getPreviousLessonTitle, canAccessModule, getPreviousModuleTitle]);

  /**
   * Get accessibility info for a specific module
   */
  const getModuleAccessInfo = useMemo(() => {
    return (moduleId: string) => {
      const isAccessible = canAccessModule(moduleId);
      const previousModuleTitle = isAccessible ? undefined : getPreviousModuleTitle(moduleId);
      const isCompleted = isModuleCompleted(moduleId);

      return { isAccessible, previousModuleTitle, isCompleted };
    };
  }, [canAccessModule, getPreviousModuleTitle, isModuleCompleted]);

  return {
    canAccessLesson,
    getPreviousLessonTitle,
    getLessonAccessInfo,
    canAccessModule,
    isModuleCompleted,
    getPreviousModuleTitle,
    getModuleAccessInfo
  };
}
