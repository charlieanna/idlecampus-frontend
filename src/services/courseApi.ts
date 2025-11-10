// New Course API service for the standardized course endpoints
import { authService } from './auth';
import type { Course, Module, Lesson } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export interface CourseListResponse {
  courses: Course[];
}

export interface CourseDetailResponse {
  course: Course;
}

export interface ModulesResponse {
  modules: Module[];
}

export interface EnrollmentResponse {
  success: boolean;
  enrollment: {
    id: number;
    course_slug: string;
    enrolled_at: string;
  };
}

export interface ProgressResponse {
  course_slug: string;
  total_lessons: number;
  completed_lessons: number;
  completion_percentage: number;
  enrolled_at: string;
  last_accessed_at: string;
  completed_lesson_slugs: string[];
}

export interface LessonCompleteResponse {
  success: boolean;
  lesson_slug: string;
  completed_at: string;
}

// Progress Tracking Interfaces
export interface ResumePointItem {
  type: string;
  id: number;
  title: string;
  slug: string;
}

export interface ResumePoint {
  type: 'review_session' | 'resume' | 'start';
  review_type?: 'quick_refresh' | 'comprehensive_review' | 'forgotten_content';
  message?: string;
  item?: ResumePointItem;
}

export interface TrackAccessResponse {
  message: string;
  last_accessed_at: string;
  needs_review: boolean;
}

export interface ResumePointResponse {
  resume_point: ResumePoint;
  days_since_last_access: number;
}

export interface ReviewModule {
  id: number;
  title: string;
  slug: string;
  lessons: Lesson[];
}

export interface ReviewSessionResponse {
  id: number;
  course_slug: string;
  review_type: 'quick_refresh' | 'comprehensive_review' | 'forgotten_content';
  days_since_last_access: number;
  total_items: number;
  items_to_review: number;
  review_modules: ReviewModule[];
  created_at: string;
}

export interface EnhancedProgressResponse extends ProgressResponse {
  days_since_last_access: number;
  resume_point?: ResumePoint;
  needs_review?: boolean;
  review_type?: string;
  review_message?: string;
  current_item?: ResumePointItem;
  current_module?: {
    id: number;
    title: string;
    slug: string;
  };
}

class CourseApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    console.log('Course API Base URL:', this.baseUrl);
  }

  /**
   * Get common headers for API requests
   */
  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const authHeaders = authService.getAuthHeaders();
      Object.assign(headers, authHeaders);
    }

    return headers;
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || errorData.message || `API error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // ==================== Public APIs (No Auth Required) ====================

  /**
   * GET /api/v1/courses
   * List all courses
   */
  async listCourses(): Promise<Course[]> {
    const response = await fetch(`${this.baseUrl}/courses`, {
      headers: this.getHeaders(false),
    });

    const data = await this.handleResponse<CourseListResponse>(response);
    return data.courses;
  }

  /**
   * GET /api/v1/courses/:slug
   * Get course details by slug
   */
  async getCourse(slug: string): Promise<Course> {
    const response = await fetch(`${this.baseUrl}/courses/${slug}`, {
      headers: this.getHeaders(false),
    });

    const data = await this.handleResponse<CourseDetailResponse>(response);
    return data.course;
  }

  /**
   * GET /api/v1/courses/:slug/modules
   * Get modules and lessons for a course
   */
  async getCourseModules(courseSlug: string): Promise<Module[]> {
    const response = await fetch(`${this.baseUrl}/courses/${courseSlug}/modules`, {
      headers: this.getHeaders(false),
    });

    const data = await this.handleResponse<ModulesResponse>(response);
    return data.modules;
  }

  // ==================== Progress Tracking APIs (Auth Required) ====================

  /**
   * POST /api/v1/courses/:slug/enroll
   * Enroll user in a course
   */
  async enrollCourse(courseSlug: string): Promise<EnrollmentResponse> {
    const response = await fetch(`${this.baseUrl}/courses/${courseSlug}/enroll`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<EnrollmentResponse>(response);
  }

  /**
   * GET /api/v1/courses/:slug/progress
   * Get user's progress for a course
   */
  async getCourseProgress(courseSlug: string): Promise<ProgressResponse> {
    const response = await fetch(`${this.baseUrl}/courses/${courseSlug}/progress`, {
      headers: this.getHeaders(true),
    });

    return this.handleResponse<ProgressResponse>(response);
  }

  /**
   * POST /api/v1/courses/:slug/lessons/:lesson_slug/complete
   * Mark a lesson as complete
   */
  async completeLesson(courseSlug: string, lessonSlug: string): Promise<LessonCompleteResponse> {
    const response = await fetch(`${this.baseUrl}/courses/${courseSlug}/lessons/${lessonSlug}/complete`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<LessonCompleteResponse>(response);
  }

  /**
   * Helper method to check if user is enrolled in a course
   */
  async isEnrolled(courseSlug: string): Promise<boolean> {
    if (!authService.isAuthenticated()) {
      return false;
    }

    try {
      await this.getCourseProgress(courseSlug);
      return true;
    } catch (error) {
      // If we get a 404 or unauthorized, user is not enrolled
      return false;
    }
  }

  // ==================== Advanced Progress Tracking APIs ====================

  /**
   * POST /api/v1/courses/:slug/track_access
   * Track when user accesses a course
   * Updates last_accessed_at and determines if review is needed
   */
  async trackCourseAccess(courseSlug: string): Promise<TrackAccessResponse> {
    const response = await fetch(`${this.baseUrl}/courses/${courseSlug}/track_access`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<TrackAccessResponse>(response);
  }

  /**
   * GET /api/v1/courses/:slug/resume_point
   * Get the resume point for a course
   * Determines where user should continue and if review is needed
   */
  async getResumePoint(courseSlug: string): Promise<ResumePointResponse> {
    const response = await fetch(`${this.baseUrl}/courses/${courseSlug}/resume_point`, {
      headers: this.getHeaders(true),
    });

    return this.handleResponse<ResumePointResponse>(response);
  }

  /**
   * POST /api/v1/courses/:slug/review_session
   * Create a review session for a course
   * Returns review modules with items to review based on time away
   */
  async createReviewSession(courseSlug: string): Promise<ReviewSessionResponse> {
    const response = await fetch(`${this.baseUrl}/courses/${courseSlug}/review_session`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return this.handleResponse<ReviewSessionResponse>(response);
  }

  /**
   * GET /api/v1/courses/:slug/progress (Enhanced)
   * Get comprehensive course progress including resume point
   * Note: This method signature is compatible with the existing one,
   * but the backend may return additional fields
   */
  async getEnhancedProgress(courseSlug: string): Promise<EnhancedProgressResponse> {
    const response = await fetch(`${this.baseUrl}/courses/${courseSlug}/progress`, {
      headers: this.getHeaders(true),
    });

    return this.handleResponse<EnhancedProgressResponse>(response);
  }
}

export const courseApi = new CourseApiService();
