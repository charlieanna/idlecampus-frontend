// Custom hooks for course data management
import { useState, useEffect, useCallback } from 'react';
import { courseApi } from '../services/courseApi';
import type { Course, Module } from '../services/api';

/**
 * Hook to fetch and manage list of all courses
 */
export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await courseApi.listCourses();
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
  };
}

/**
 * Hook to fetch and manage a single course's details
 */
export function useCourse(slug: string | undefined) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await courseApi.getCourse(slug);
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load course');
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return {
    course,
    loading,
    error,
    refetch: fetchCourse,
  };
}

/**
 * Hook to fetch and manage course modules
 */
export function useCourseModules(courseSlug: string | undefined) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = useCallback(async () => {
    if (!courseSlug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await courseApi.getCourseModules(courseSlug);
      setModules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load modules');
      console.error('Error fetching modules:', err);
    } finally {
      setLoading(false);
    }
  }, [courseSlug]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return {
    modules,
    loading,
    error,
    refetch: fetchModules,
  };
}

/**
 * Hook to fetch course with its modules in a single call
 */
export function useCourseWithModules(slug: string | undefined) {
  const [courseData, setCourseData] = useState<{
    course: Course | null;
    modules: Module[];
  }>({
    course: null,
    modules: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseData = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch course and modules in parallel
      const [course, modules] = await Promise.all([
        courseApi.getCourse(slug),
        courseApi.getCourseModules(slug),
      ]);

      setCourseData({ course, modules });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load course data');
      console.error('Error fetching course data:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  return {
    course: courseData.course,
    modules: courseData.modules,
    loading,
    error,
    refetch: fetchCourseData,
  };
}
