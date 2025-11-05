import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiService } from '../api';

// Mock fetch globally
global.fetch = vi.fn();

describe('ApiService - Course Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchCourses', () => {
    it('should fetch courses for kubernetes track', async () => {
      const mockCourses = [
        { id: 1, slug: 'kubernetes', title: 'Kubernetes CKAD', description: 'Learn K8s' }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ courses: mockCourses })
      });

      const courses = await apiService.fetchCourses('kubernetes');

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/kubernetes/courses'));
      expect(courses).toEqual(mockCourses);
    });

    it('should fetch courses for docker track', async () => {
      const mockCourses = [
        { id: 2, slug: 'docker', title: 'Docker Fundamentals', description: 'Learn Docker' }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ courses: mockCourses })
      });

      const courses = await apiService.fetchCourses('docker');

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/docker/courses'));
      expect(courses).toEqual(mockCourses);
    });

    it('should handle fetch errors gracefully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(apiService.fetchCourses('kubernetes')).rejects.toThrow('Failed to fetch courses');
    });
  });

  describe('fetchCourse', () => {
    const tracks = ['docker', 'kubernetes', 'linux', 'security', 'system_design', 'aws', 'postgresql', 'networking', 'envoy'];

    tracks.forEach(track => {
      it(`should fetch course for ${track} track`, async () => {
        const mockCourse = {
          id: 1,
          slug: track,
          title: `${track} Course`,
          description: 'Course description',
          difficulty_level: 'intermediate',
          estimated_hours: 20,
          certification_track: track
        };

        (global.fetch as any).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ course: mockCourse })
        });

        const course = await apiService.fetchCourse(track, track);

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(`/${track}/courses/${track}`));
        expect(course).toEqual(mockCourse);
      });
    });

    it('should handle 404 errors for missing courses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(apiService.fetchCourse('nonexistent', 'kubernetes')).rejects.toThrow('Failed to fetch course: nonexistent');
    });
  });

  describe('fetchModules', () => {
    it('should fetch modules for a course', async () => {
      const mockModules = [
        { id: 1, slug: 'intro', title: 'Introduction', sequence_order: 1, estimated_minutes: 30 },
        { id: 2, slug: 'basics', title: 'Basics', sequence_order: 2, estimated_minutes: 45 }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ modules: mockModules })
      });

      const modules = await apiService.fetchModules('docker', 'docker');

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/docker/courses/docker/modules'));
      expect(modules).toEqual(mockModules);
      expect(modules).toHaveLength(2);
    });

    it('should handle errors when fetching modules', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(apiService.fetchModules('docker', 'docker')).rejects.toThrow('Failed to fetch modules for course: docker');
    });
  });

  describe('fetchModule', () => {
    it('should fetch a specific module', async () => {
      const mockModule = {
        id: 1,
        slug: 'intro',
        title: 'Introduction',
        description: 'Intro module',
        sequence_order: 1,
        estimated_minutes: 30,
        lessons: []
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ module: mockModule })
      });

      const module = await apiService.fetchModule('docker', 'intro', 'docker');

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/docker/courses/docker/modules/intro'));
      expect(module).toEqual(mockModule);
    });
  });

  describe('fetchLabs', () => {
    it('should fetch labs for a track', async () => {
      const mockLabs = [
        { id: 1, title: 'Lab 1', difficulty: 'easy', estimated_minutes: 20, sequence_order: 1 },
        { id: 2, title: 'Lab 2', difficulty: 'medium', estimated_minutes: 30, sequence_order: 2 }
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ labs: mockLabs })
      });

      const labs = await apiService.fetchLabs('kubernetes');

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/kubernetes/labs'));
      expect(labs).toEqual(mockLabs);
    });

    it('should handle errors when fetching labs', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(apiService.fetchLabs('kubernetes')).rejects.toThrow('Failed to fetch labs');
    });
  });

  describe('Course Track Accessibility', () => {
    const allTracks = [
      'docker',
      'kubernetes',
      'linux',
      'security',
      'system_design',
      'aws',
      'postgresql',
      'networking',
      'envoy'
    ];

    allTracks.forEach(track => {
      it(`should successfully access ${track} course track`, async () => {
        const mockCourseData = {
          id: 1,
          slug: track,
          title: `${track} Course`,
          description: 'Test course',
          difficulty_level: 'intermediate',
          estimated_hours: 10,
          certification_track: track
        };

        (global.fetch as any).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ course: mockCourseData })
        });

        const course = await apiService.fetchCourse(track, track);

        expect(course).toBeDefined();
        expect(course.slug).toBe(track);
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(`/${track}/courses/${track}`));
      });
    });
  });

  describe('API Endpoint Structure', () => {
    it('should construct correct API URLs for different tracks', async () => {
      const tracks = ['docker', 'kubernetes', 'system_design'];

      for (const track of tracks) {
        (global.fetch as any).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ courses: [] })
        });

        await apiService.fetchCourses(track);

        expect(global.fetch).toHaveBeenLastCalledWith(expect.stringMatching(new RegExp(`/${track}/courses`)));
      }
    });
  });
});
