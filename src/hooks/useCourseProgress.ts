// Custom hooks for course progress tracking
import { useState, useEffect, useCallback } from 'react';
import { courseApi, type ProgressResponse } from '../services/courseApi';
import { authService } from '../services/auth';

/**
 * Hook to manage course enrollment
 */
export function useCourseEnrollment(courseSlug: string | undefined) {
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkEnrollment = useCallback(async () => {
    if (!courseSlug || !authService.isAuthenticated()) {
      setEnrolled(false);
      return;
    }

    try {
      const isEnrolled = await courseApi.isEnrolled(courseSlug);
      setEnrolled(isEnrolled);
    } catch (err) {
      console.error('Error checking enrollment:', err);
      setEnrolled(false);
    }
  }, [courseSlug]);

  const enroll = useCallback(async () => {
    if (!courseSlug) return;

    try {
      setEnrolling(true);
      setError(null);
      await courseApi.enrollCourse(courseSlug);
      setEnrolled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll in course');
      console.error('Error enrolling in course:', err);
    } finally {
      setEnrolling(false);
    }
  }, [courseSlug]);

  useEffect(() => {
    checkEnrollment();
  }, [checkEnrollment]);

  return {
    enrolled,
    enrolling,
    error,
    enroll,
    checkEnrollment,
  };
}

/**
 * Hook to manage and track course progress
 */
export function useCourseProgress(courseSlug: string | undefined) {
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const fetchProgress = useCallback(async () => {
    if (!courseSlug || !authService.isAuthenticated()) {
      setLoading(false);
      setProgress(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await courseApi.getCourseProgress(courseSlug);
      setProgress(data);
      setCompletedLessons(new Set(data.completed_lesson_slugs));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
      console.error('Error fetching progress:', err);
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }, [courseSlug]);

  const completeLesson = useCallback(async (lessonSlug: string) => {
    if (!courseSlug) return;

    try {
      await courseApi.completeLesson(courseSlug, lessonSlug);

      // Update local state optimistically
      setCompletedLessons(prev => new Set([...prev, lessonSlug]));

      // Refetch progress to get accurate completion percentage
      await fetchProgress();
    } catch (err) {
      console.error('Error completing lesson:', err);
      throw err;
    }
  }, [courseSlug, fetchProgress]);

  const isLessonCompleted = useCallback((lessonSlug: string): boolean => {
    return completedLessons.has(lessonSlug);
  }, [completedLessons]);

  /**
   * Check if a lesson can be accessed based on whether the previous lesson is completed
   * First lesson is always accessible, subsequent lessons require the previous one to be completed
   */
  const canAccessLesson = useCallback((
    lessonId: string,
    allLessonsInOrder: Array<{ id: string; sequenceOrder: number }>
  ): boolean => {
    // Sort lessons by sequence order to ensure correct ordering
    const sortedLessons = [...allLessonsInOrder].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

    // Find the index of the current lesson
    const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);

    // If lesson not found or is the first lesson, allow access
    if (currentIndex <= 0) {
      return true;
    }

    // Check if the previous lesson is completed
    const previousLesson = sortedLessons[currentIndex - 1];
    return completedLessons.has(previousLesson.id);
  }, [completedLessons]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    progress,
    loading,
    error,
    completedLessons,
    completeLesson,
    isLessonCompleted,
    canAccessLesson,
    refetch: fetchProgress,
  };
}

/**
 * Combined hook for enrollment and progress tracking
 */
export function useEnrolledCourseProgress(courseSlug: string | undefined) {
  const enrollment = useCourseEnrollment(courseSlug);
  const progress = useCourseProgress(courseSlug);

  return {
    ...enrollment,
    ...progress,
    isReady: !enrollment.enrolling && !progress.loading,
  };
}
