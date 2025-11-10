import { useState, useEffect, useCallback, useRef } from 'react';
import { courseApi } from '../services/courseApi';
import { authService } from '../services/auth';
import type {
  TrackAccessResponse,
  ResumePointResponse,
  ReviewSessionResponse,
} from '../services/courseApi';

/**
 * Hook to track course access
 * Automatically calls track_access when the component mounts
 * and when the course slug changes
 */
export function useTrackAccess(courseSlug: string | undefined) {
  const [tracking, setTracking] = useState(false);
  const [trackData, setTrackData] = useState<TrackAccessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasTracked = useRef(false);

  const trackAccess = useCallback(async () => {
    if (!courseSlug || !authService.isAuthenticated() || hasTracked.current) {
      return;
    }

    try {
      setTracking(true);
      setError(null);
      const result = await courseApi.trackCourseAccess(courseSlug);
      setTrackData(result);
      hasTracked.current = true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to track access';
      setError(message);
      console.error('Error tracking course access:', err);
      // Don't throw - tracking failures should not break the app
    } finally {
      setTracking(false);
    }
  }, [courseSlug]);

  // Auto-track on mount and when courseSlug changes
  useEffect(() => {
    hasTracked.current = false; // Reset when course changes
  }, [courseSlug]);

  useEffect(() => {
    trackAccess();
  }, [trackAccess]);

  return {
    tracking,
    trackData,
    error,
    trackAccess, // Expose for manual tracking if needed
  };
}

/**
 * Hook to get resume point for a course
 * Determines where the user should continue and if review is needed
 */
export function useResumePoint(courseSlug: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [resumePoint, setResumePoint] = useState<ResumePointResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchResumePoint = useCallback(async () => {
    if (!courseSlug || !authService.isAuthenticated()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await courseApi.getResumePoint(courseSlug);
      setResumePoint(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get resume point';
      setError(message);
      console.error('Error fetching resume point:', err);
    } finally {
      setLoading(false);
    }
  }, [courseSlug]);

  useEffect(() => {
    fetchResumePoint();
  }, [fetchResumePoint]);

  return {
    loading,
    resumePoint,
    error,
    refetch: fetchResumePoint,
    needsReview: resumePoint?.resume_point.type === 'review_session',
    shouldResume: resumePoint?.resume_point.type === 'resume',
    shouldStart: resumePoint?.resume_point.type === 'start',
  };
}

/**
 * Hook to manage review session
 * Creates and manages the state of a review session
 */
export function useReviewSession(courseSlug: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [reviewSession, setReviewSession] = useState<ReviewSessionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);

  const createReviewSession = useCallback(async () => {
    if (!courseSlug || !authService.isAuthenticated()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await courseApi.createReviewSession(courseSlug);
      setReviewSession(result);
      setIsActive(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create review session';
      setError(message);
      console.error('Error creating review session:', err);
    } finally {
      setLoading(false);
    }
  }, [courseSlug]);

  const dismissReview = useCallback(() => {
    setIsActive(false);
    setReviewSession(null);
  }, []);

  const completeReview = useCallback(() => {
    setIsActive(false);
    // Keep reviewSession data for reference but mark as inactive
  }, []);

  return {
    loading,
    reviewSession,
    error,
    isActive,
    createReviewSession,
    dismissReview,
    completeReview,
  };
}

/**
 * Combined hook that manages all progress tracking features
 * This is the main hook to use in course components
 */
export function useProgressTracking(courseSlug: string | undefined) {
  const trackAccess = useTrackAccess(courseSlug);
  const resumePoint = useResumePoint(courseSlug);
  const reviewSession = useReviewSession(courseSlug);

  // Automatically create review session if needed
  useEffect(() => {
    if (resumePoint.needsReview && !reviewSession.reviewSession && !reviewSession.loading) {
      // Don't auto-create, let the component decide when to show the prompt
      // The component can call reviewSession.createReviewSession() when user clicks "Start Review"
    }
  }, [resumePoint.needsReview, reviewSession.reviewSession, reviewSession.loading]);

  return {
    // Track access data
    tracking: trackAccess.tracking,
    trackData: trackAccess.trackData,
    trackError: trackAccess.error,

    // Resume point data
    resumeLoading: resumePoint.loading,
    resumePoint: resumePoint.resumePoint,
    resumeError: resumePoint.error,
    needsReview: resumePoint.needsReview,
    shouldResume: resumePoint.shouldResume,
    shouldStart: resumePoint.shouldStart,
    refetchResumePoint: resumePoint.refetch,

    // Review session data
    reviewLoading: reviewSession.loading,
    reviewSession: reviewSession.reviewSession,
    reviewError: reviewSession.error,
    reviewActive: reviewSession.isActive,
    createReviewSession: reviewSession.createReviewSession,
    dismissReview: reviewSession.dismissReview,
    completeReview: reviewSession.completeReview,
  };
}
