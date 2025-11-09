# API Integration Guide

This document explains how to use the new Course API in the IdleCampus frontend application.

## Overview

The frontend is now integrated with a standardized REST API that provides:

### Public APIs (No Authentication Required)
- `GET /api/v1/courses` - List all courses
- `GET /api/v1/courses/:slug` - Get course details
- `GET /api/v1/courses/:slug/modules` - Get course modules and lessons

### Progress Tracking APIs (Authentication Required)
- `POST /api/v1/courses/:slug/enroll` - Enroll user in a course
- `GET /api/v1/courses/:slug/progress` - Get user's progress
- `POST /api/v1/courses/:slug/lessons/:lesson_slug/complete` - Mark lesson as complete

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Components                      │
│  (CourseSelectionDashboard, CourseViewer, etc.)         │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ uses
                 ▼
┌─────────────────────────────────────────────────────────┐
│                   Custom Hooks                           │
│  • useCourses()          - Fetch course list            │
│  • useCourse()           - Fetch single course          │
│  • useCourseModules()    - Fetch modules                │
│  • useCourseProgress()   - Track progress               │
│  • useCourseEnrollment() - Manage enrollment            │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ calls
                 ▼
┌─────────────────────────────────────────────────────────┐
│                   API Services                           │
│  • courseApi    - Course endpoints                      │
│  • authService  - Authentication & token management     │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ HTTP requests
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (Rails/Node/etc)                │
│              /api/v1/*                                   │
└─────────────────────────────────────────────────────────┘
```

## Files Created

### Services
- `/src/services/auth.ts` - Authentication service
- `/src/services/courseApi.ts` - Course API service

### Hooks
- `/src/hooks/useCourses.ts` - Course data hooks
- `/src/hooks/useCourseProgress.ts` - Progress tracking hooks

### Components
- `/src/components/course/CourseViewerExample.tsx` - Reference implementation

## Quick Start

### 1. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

For development, the default configuration uses the Vite proxy:
```env
VITE_API_URL=/api/v1
```

For production, set your actual API URL:
```env
VITE_API_URL=https://api.idlecampus.com/api/v1
```

### 2. Using the Hooks

#### Fetching Courses

```tsx
import { useCourses } from '../hooks/useCourses';

function MyCourseList() {
  const { courses, loading, error, refetch } = useCourses();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

#### Fetching a Single Course with Modules

```tsx
import { useCourseWithModules } from '../hooks/useCourses';

function CourseDetails({ slug }: { slug: string }) {
  const { course, modules, loading, error } = useCourseWithModules(slug);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <div>
        {modules.map(module => (
          <div key={module.id}>{module.title}</div>
        ))}
      </div>
    </div>
  );
}
```

#### Managing Enrollment and Progress

```tsx
import { useEnrolledCourseProgress } from '../hooks/useCourseProgress';
import { authService } from '../services/auth';

function CourseProgress({ courseSlug }: { courseSlug: string }) {
  const {
    enrolled,
    enrolling,
    enroll,
    progress,
    completeLesson,
    isLessonCompleted,
  } = useEnrolledCourseProgress(courseSlug);

  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <div>Please log in to track progress</div>;
  }

  if (!enrolled) {
    return (
      <button onClick={enroll} disabled={enrolling}>
        {enrolling ? 'Enrolling...' : 'Enroll in Course'}
      </button>
    );
  }

  return (
    <div>
      <div>Progress: {progress?.completion_percentage}%</div>
      <div>
        Completed: {progress?.completed_lessons} / {progress?.total_lessons}
      </div>
    </div>
  );
}
```

### 3. Using the API Service Directly

If you prefer not to use hooks:

```tsx
import { courseApi } from '../services/courseApi';

async function loadCourse(slug: string) {
  try {
    const course = await courseApi.getCourse(slug);
    const modules = await courseApi.getCourseModules(slug);

    console.log('Course:', course);
    console.log('Modules:', modules);
  } catch (error) {
    console.error('Failed to load course:', error);
  }
}

async function enrollInCourse(slug: string) {
  try {
    const result = await courseApi.enrollCourse(slug);
    console.log('Enrolled successfully:', result);
  } catch (error) {
    console.error('Enrollment failed:', error);
  }
}

async function trackLessonCompletion(courseSlug: string, lessonSlug: string) {
  try {
    const result = await courseApi.completeLesson(courseSlug, lessonSlug);
    console.log('Lesson completed:', result);
  } catch (error) {
    console.error('Failed to complete lesson:', error);
  }
}
```

## Authentication

### Setting Authentication Token

When a user logs in, store their token:

```tsx
import { authService } from '../services/auth';

function login(email: string, password: string) {
  // After successful login from your auth endpoint
  const user = {
    id: 1,
    email: 'user@example.com',
    name: 'John Doe',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  };

  authService.setUser(user);
}
```

### Checking Authentication Status

```tsx
import { authService } from '../services/auth';

function MyComponent() {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

### Logging Out

```tsx
import { authService } from '../services/auth';

function logout() {
  authService.logout();
  // Redirect to home or login page
  window.location.href = '/';
}
```

## API Response Types

### Course

```typescript
interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  difficulty_level: string;
  estimated_hours: number;
  certification_track: string;
  module_count?: number;
  learning_objectives?: string[];
  prerequisites?: string[];
}
```

### Module

```typescript
interface Module {
  id: number;
  slug: string;
  title: string;
  description: string;
  sequence_order: number;
  estimated_minutes: number;
  lesson_count?: number;
  items?: ModuleItem[];
}
```

### ModuleItem

```typescript
interface ModuleItem {
  id: number;
  sequence_order: number;
  item_type: 'CourseLesson' | 'Quiz' | 'HandsOnLab' | 'InteractiveLearningUnit';
  title: string;
  description?: string;
  content?: string;
  estimated_minutes?: number;
}
```

### Progress

```typescript
interface ProgressResponse {
  course_slug: string;
  total_lessons: number;
  completed_lessons: number;
  completion_percentage: number;
  enrolled_at: string;
  last_accessed_at: string;
  completed_lesson_slugs: string[];
}
```

## Error Handling

All API methods throw errors that can be caught with try/catch:

```tsx
try {
  const course = await courseApi.getCourse('invalid-slug');
} catch (error) {
  if (error instanceof Error) {
    console.error('Error message:', error.message);
  }
}
```

The hooks automatically handle errors and expose them via the `error` property:

```tsx
const { course, error } = useCourse('some-slug');

if (error) {
  // Display error to user
  return <div>Error: {error}</div>;
}
```

## Best Practices

### 1. Use Hooks for Components

Always prefer using hooks in React components for automatic state management:

```tsx
// ✅ Good - using hook
const { courses, loading } = useCourses();

// ❌ Avoid - manual state management
const [courses, setCourses] = useState([]);
useEffect(() => {
  courseApi.listCourses().then(setCourses);
}, []);
```

### 2. Handle Loading States

Always handle loading states for better UX:

```tsx
const { course, loading, error } = useCourse(slug);

if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (!course) return <NotFound />;

return <CourseContent course={course} />;
```

### 3. Check Authentication Before Progress APIs

Always check if user is authenticated before using progress APIs:

```tsx
const isAuth = authService.isAuthenticated();

if (isAuth) {
  const { progress } = useCourseProgress(courseSlug);
  // Show progress
}
```

### 4. Optimistic Updates

The progress hooks implement optimistic updates for better UX:

```tsx
const { completeLesson, isLessonCompleted } = useCourseProgress(courseSlug);

// This updates UI immediately and syncs with backend
await completeLesson('lesson-1');
```

### 5. Refetch When Needed

Use the `refetch` function when you need to reload data:

```tsx
const { courses, refetch } = useCourses();

// After creating a new course
await createCourse(newCourseData);
refetch(); // Reload the course list
```

## Migration from Old API

If you're migrating from the old API service:

### Old Way (apiService)

```tsx
import { apiService } from '../services/api';

const courses = await apiService.fetchCourses('kubernetes');
const course = await apiService.fetchCourse(slug, 'kubernetes');
const modules = await apiService.fetchModules(courseSlug, 'kubernetes');
```

### New Way (courseApi)

```tsx
import { courseApi } from '../services/courseApi';

const courses = await courseApi.listCourses();
const course = await courseApi.getCourse(slug);
const modules = await courseApi.getCourseModules(slug);
```

### Key Differences

1. **No Track Parameter**: The new API doesn't require a `track` parameter
2. **Simpler URLs**: `/api/v1/courses/:slug` instead of `/api/v1/:track/courses/:slug`
3. **Standard Response Format**: All responses follow a consistent structure
4. **Built-in Auth**: Authentication headers are automatically added when needed

## Example: Complete Integration

See `/src/components/course/CourseViewerExample.tsx` for a complete reference implementation that demonstrates:

- Loading course data
- Managing enrollment
- Tracking progress
- Completing lessons
- Navigation between modules and lessons
- Loading and error states

## Testing

The API services can be easily mocked for testing:

```tsx
import { courseApi } from '../services/courseApi';

jest.mock('../services/courseApi', () => ({
  courseApi: {
    listCourses: jest.fn().mockResolvedValue([
      { id: 1, slug: 'test-course', title: 'Test Course' }
    ]),
    getCourse: jest.fn().mockResolvedValue({
      id: 1,
      slug: 'test-course',
      title: 'Test Course'
    }),
  },
}));
```

## Troubleshooting

### API returns 404

- Check that `VITE_API_URL` is set correctly
- Verify the course slug is correct
- Check that the backend API is running

### Authentication errors (401/403)

- Verify that `authService.getToken()` returns a valid token
- Check that the token hasn't expired
- Ensure the user is enrolled in the course for progress APIs

### CORS errors

- Configure CORS on your backend to allow your frontend origin
- In development, use the Vite proxy (already configured)

### Data not updating

- Use the `refetch()` function to reload data
- Check browser console for error messages
- Verify network tab shows successful API responses

## Support

For issues or questions:
1. Check this documentation
2. Review the example component: `/src/components/course/CourseViewerExample.tsx`
3. Check the console for error messages
4. Verify API responses in the browser's Network tab
