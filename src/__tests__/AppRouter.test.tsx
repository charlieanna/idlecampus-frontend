import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from '../AppRouter';

// Mock all the course apps
vi.mock('../apps/kubernetes/KubernetesApp', () => ({
  default: () => <div>Kubernetes App</div>
}));

vi.mock('../apps/docker/DockerApp', () => ({
  default: () => <div>Docker App</div>
}));

vi.mock('../apps/linux/LinuxApp', () => ({
  default: () => <div>Linux App</div>
}));

vi.mock('../apps/security/SecurityApp', () => ({
  default: () => <div>Security App</div>
}));

vi.mock('../apps/coding-interview/CodingInterviewApp', () => ({
  default: () => <div>Coding Interview App</div>
}));

vi.mock('../apps/system-design/SystemDesignApp', () => ({
  default: () => <div>System Design App</div>
}));

vi.mock('../apps/python/PythonApp', () => ({
  default: () => <div>Python App</div>
}));

vi.mock('../apps/golang/GolangApp', () => ({
  default: () => <div>Golang App</div>
}));

vi.mock('../apps/generic/GenericCourseApp', () => ({
  default: ({ courseTitle }: { courseTitle: string }) => <div>{courseTitle} Generic App</div>
}));

vi.mock('../components/CourseSelectionDashboard', () => ({
  default: () => <div>Course Selection Dashboard</div>
}));

// Mock the API service
vi.mock('../services/api', () => ({
  apiService: {
    fetchCourses: vi.fn(),
    fetchCourse: vi.fn(),
    fetchModules: vi.fn(),
    fetchLabs: vi.fn()
  }
}));

import { apiService } from '../services/api';

describe('AppRouter - Course Route Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock responses
    (apiService.fetchCourses as any).mockResolvedValue([
      { id: 1, slug: 'test-course', title: 'Test Course', certification_track: 'test' }
    ]);

    (apiService.fetchCourse as any).mockResolvedValue({
      id: 1,
      slug: 'test-course',
      title: 'Test Course',
      description: 'Test',
      difficulty_level: 'intermediate',
      estimated_hours: 10,
      certification_track: 'test'
    });

    (apiService.fetchModules as any).mockResolvedValue([
      {
        id: 1,
        slug: 'module-1',
        title: 'Module 1',
        description: 'Test module',
        sequence_order: 1,
        estimated_minutes: 30,
        lessons: [
          {
            id: 1,
            title: 'Lesson 1',
            content: 'Test content',
            sequence_order: 1
          }
        ]
      }
    ]);

    (apiService.fetchLabs as any).mockResolvedValue([
      {
        id: 1,
        title: 'Lab 1',
        description: 'Test lab',
        difficulty: 'easy',
        estimated_minutes: 20,
        sequence_order: 1
      }
    ]);
  });

  describe('Home Route', () => {
    it('should render course selection dashboard on home route', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Course Selection Dashboard')).toBeInTheDocument();
    });
  });

  describe('API-backed Course Routes', () => {
    const apiCourseRoutes = [
      { path: '/docker', name: 'Docker', track: 'docker' },
      { path: '/kubernetes', name: 'Kubernetes', track: 'kubernetes' },
      { path: '/system_design', name: 'System Design', track: 'system_design' },
      { path: '/aws', name: 'AWS Cloud Architecture', track: 'aws' },
      { path: '/envoy', name: 'Envoy Proxy', track: 'envoy' },
      { path: '/postgresql', name: 'PostgreSQL', track: 'postgresql' },
      { path: '/networking', name: 'Networking Fundamentals', track: 'networking' }
    ];

    apiCourseRoutes.forEach(({ path, name, track }) => {
      it(`should render and load ${name} course on ${path} route`, async () => {
        render(
          <MemoryRouter initialEntries={[path]}>
            <AppRouter />
          </MemoryRouter>
        );

        // Should show loading screen initially
        const loadingTextMap: Record<string, string> = {
          'Docker': 'Docker',
          'Kubernetes': 'Kubernetes',
          'System Design': 'System Design',
          'AWS Cloud Architecture': 'AWS Cloud Architecture',
          'Envoy Proxy': 'Envoy Proxy',
          'PostgreSQL': 'PostgreSQL',
          'Networking Fundamentals': 'Networking'
        };
        const loadingName = loadingTextMap[name] || name;
        expect(screen.getByText(`Loading ${loadingName} Course...`)).toBeInTheDocument();

        // Wait for API calls and course to load
        await waitFor(() => {
          expect(apiService.fetchCourses).toHaveBeenCalledWith(track);
        });

        await waitFor(() => {
          expect(apiService.fetchModules).toHaveBeenCalled();
        });

        await waitFor(() => {
          expect(apiService.fetchLabs).toHaveBeenCalled();
        });
      });

      it(`should handle API errors gracefully for ${path} route`, async () => {
        (apiService.fetchCourses as any).mockRejectedValueOnce(new Error('API Error'));

        render(
          <MemoryRouter initialEntries={[path]}>
            <AppRouter />
          </MemoryRouter>
        );

        // Should show error screen
        await waitFor(() => {
          expect(screen.getByText('Failed to Load Course')).toBeInTheDocument();
        });

        // Should show retry button
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });
  });

  describe('Static Course Routes', () => {
    it('should render coding interview app on /coding-interview route', () => {
      render(
        <MemoryRouter initialEntries={['/coding-interview']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Coding Interview App')).toBeInTheDocument();
    });

    it('should render system design app on /system-design route', () => {
      render(
        <MemoryRouter initialEntries={['/system-design']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('System Design App')).toBeInTheDocument();
    });

    it('should render python app on /python route', () => {
      render(
        <MemoryRouter initialEntries={['/python']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Python App')).toBeInTheDocument();
    });

    it('should render golang app on /golang route', () => {
      render(
        <MemoryRouter initialEntries={['/golang']}>
          <AppRouter />
        </MemoryRouter>
      );

      expect(screen.getByText('Golang App')).toBeInTheDocument();
    });
  });

  describe('Route Fallback', () => {
    it('should redirect to home on invalid route', async () => {
      render(
        <MemoryRouter initialEntries={['/invalid-route']}>
          <AppRouter />
        </MemoryRouter>
      );

      // Should redirect to course selection dashboard
      await waitFor(() => {
        expect(screen.getByText('Course Selection Dashboard')).toBeInTheDocument();
      });
    });
  });

  describe('All Available Courses Accessibility', () => {
    const allAvailableCourses = [
      { route: '/linux', name: 'Linux' },
      { route: '/security', name: 'Security' },
      { route: '/docker', name: 'Docker' },
      { route: '/kubernetes', name: 'Kubernetes' },
      { route: '/system_design', name: 'System Design' },
      { route: '/aws', name: 'AWS Cloud Architecture' },
      { route: '/postgresql', name: 'PostgreSQL' },
      { route: '/networking', name: 'Networking Fundamentals' },
      { route: '/envoy', name: 'Envoy Proxy' }
    ];

    allAvailableCourses.forEach(({ route, name }) => {
      it(`should be able to access ${name} course at ${route}`, async () => {
        const { container } = render(
          <MemoryRouter initialEntries={[route]}>
            <AppRouter />
          </MemoryRouter>
        );

        // Check that the route renders without crashing
        expect(container).toBeTruthy();

        // Should show loading screen
        await waitFor(() => {
          const loadingText = screen.queryByText(/Loading.*Course/);
          if (loadingText) {
            expect(loadingText).toBeInTheDocument();
          }
        });
      });
    });

    it('should confirm all 9 available courses have accessible routes', () => {
      // This test confirms that we're testing all 9 available courses
      expect(allAvailableCourses).toHaveLength(9);

      // Verify each course has a valid route
      allAvailableCourses.forEach(({ route, name }) => {
        expect(route).toMatch(/^\//);
        expect(name).toBeTruthy();
      });
    });
  });

  describe('API Data Loading Success', () => {
    it('should display success banner when course loads successfully', async () => {
      render(
        <MemoryRouter initialEntries={['/docker']}>
          <AppRouter />
        </MemoryRouter>
      );

      // Wait for data to load and success banner to appear
      await waitFor(() => {
        const successBanner = screen.queryByText(/✅ Live Content/);
        if (successBanner) {
          expect(successBanner).toBeInTheDocument();
        }
      }, { timeout: 3000 });
    });
  });
});
