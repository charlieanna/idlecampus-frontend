// API service for fetching Kubernetes course content from Rails backend

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export interface Course {
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
  modules?: Module[];
}

export type ModuleItemType = 'CourseLesson' | 'Quiz' | 'HandsOnLab' | 'InteractiveLearningUnit';

export interface ModuleItem {
  id: number;
  module_item_id?: number;
  sequence_order: number;
  item_type: ModuleItemType;
  title: string;
  description?: string;
  content?: string;
  estimated_minutes?: number;
  difficulty?: string;
  lesson_id?: number;
  quiz?: {
    question: string;
    type?: string;
    options?: any[];
    correct_answer?: string;
    explanation?: string;
  };
  command_to_learn?: string;
  practice_hints?: string[];
  concept_tags?: string[];
  lab_id?: number;
  lab_type?: string;
  lab_format?: string;
  programming_language?: string;
  starter_code?: string;
  solution_code?: string;
  test_cases?: any[];
  allowed_imports?: string[];
  learning_objectives?: any;
  prerequisites?: any;
  steps?: any[];
  hints?: any[];
  points_reward?: number;
  max_attempts?: number;
  time_limit_seconds?: number;
  memory_limit_mb?: number;
}

export interface Module {
  id: number;
  slug: string;
  title: string;
  description: string;
  sequence_order: number;
  estimated_minutes: number;
  lesson_count?: number;
  lessons?: Lesson[];
  items?: ModuleItem[];
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  sequence_order: number;
  estimated_minutes?: number;
  learning_objectives?: string[];
  key_commands?: string[];
  exercises?: Array<{
    type: string;
    sequence_order: number;
    question?: string;
    prompt?: string;
    options?: string[];
    correct_answer?: string;
    correct_answer_index?: number;
    explanation?: string;
    description?: string;
    hints?: string[];
    require_pass?: boolean;
    difficulty?: string;
    slug?: string;
    command?: string;
    timeout_sec?: number;
    language?: string;
    starter_code?: string;
    solution_code?: string;
  }>;
}

export interface Lab {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  estimated_minutes: number;
  objectives?: string[];
  prerequisites?: string[];
  steps?: any[];
  validation_commands?: string[];
  hints?: string[];
  solution?: string;
  sequence_order: number;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    // eslint-disable-next-line no-console
    console.log('API_BASE_URL =', this.baseUrl);
  }

  async fetchAllCourses(): Promise<Course[]> {
    const response = await fetch(`${this.baseUrl}/courses`);
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    const data = await response.json();
    return data.courses;
  }

  async fetchCourses(track: string = 'kubernetes'): Promise<Course[]> {
    const url = `${this.baseUrl}/${track}/courses`;
    
    try {
      const response = await fetch(url);
      
      // Check if response is HTML (indicates redirect to Rails root or error page)
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error(
          `API endpoint returned HTML instead of JSON: ${url}\n\n` +
          `This usually means:\n` +
          `1. The backend route doesn't exist (Rails redirected to root)\n` +
          `2. Rails backend is running but route /api/v1/${track}/courses is missing\n\n` +
          `Fix:\n` +
          `- Check Rails routes: rails routes | grep ${track}\n` +
          `- Ensure route exists: get ':track/courses', to: 'courses#index'\n` +
          `- Verify backend is running: curl http://localhost:3000/api/v1/${track}/courses`
        );
      }
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(
          `Failed to fetch courses: ${response.status} ${response.statusText}\n` +
          `URL: ${url}\n` +
          `Response: ${errorText.substring(0, 200)}`
        );
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || !data.courses) {
        throw new Error(
          `Invalid API response format from ${url}\n` +
          `Expected: { courses: [...] }\n` +
          `Got: ${JSON.stringify(data).substring(0, 200)}`
        );
      }
      
      return data.courses;
    } catch (error) {
      // Re-throw with additional context if it's a network/CORS error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(
          `Network error fetching courses from ${url}\n\n` +
          `Possible causes:\n` +
          `1. Backend not running on port 3000\n` +
          `2. CORS not configured in Rails backend\n` +
          `3. Route doesn't exist (check Rails routes)\n\n` +
          `Original error: ${error.message}`
        );
      }
      throw error;
    }
  }

  async fetchCourse(slug: string, track: string = 'kubernetes'): Promise<Course> {
    const url = `${this.baseUrl}/${track}/courses/${slug}`;
    
    try {
      const response = await fetch(url);
      
      // Check if response is HTML (indicates redirect to Rails root or error page)
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error(
          `API endpoint returned HTML instead of JSON: ${url}\n\n` +
          `The backend route doesn't exist. Check Rails routes.`
        );
      }
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(
          `Failed to fetch course ${slug}: ${response.status} ${response.statusText}\n` +
          `URL: ${url}\n` +
          `Response: ${errorText.substring(0, 200)}`
        );
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || !data.course) {
        throw new Error(
          `Invalid API response format from ${url}\n` +
          `Expected: { course: {...} }\n` +
          `Got: ${JSON.stringify(data).substring(0, 200)}`
        );
      }
      
      return data.course;
    } catch (error) {
      // Re-throw with additional context if it's a network/CORS error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(
          `Network error fetching course from ${url}\n\n` +
          `Possible causes:\n` +
          `1. Backend not running\n` +
          `2. CORS not configured\n` +
          `3. Route doesn't exist\n\n` +
          `Original error: ${error.message}`
        );
      }
      throw error;
    }
  }

  async fetchModules(courseSlug: string, track: string = 'kubernetes'): Promise<Module[]> {
    const response = await fetch(`${this.baseUrl}/${track}/courses/${courseSlug}/modules`);
    if (!response.ok) {
      const error: any = new Error(`Failed to fetch modules for course: ${courseSlug}`);
      error.status = response.status;
      throw error;
    }
    const data = await response.json();
    return data.modules;
  }

  async fetchModule(courseSlug: string, moduleSlug: string, track: string = 'kubernetes'): Promise<Module> {
    const response = await fetch(`${this.baseUrl}/${track}/courses/${courseSlug}/modules/${moduleSlug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch module: ${moduleSlug}`);
    }
    const data = await response.json();
    return data.module;
  }

  async fetchLabs(track: string = 'kubernetes'): Promise<Lab[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${track}/labs`);
      if (!response.ok) {
        throw new Error(`Failed to fetch labs: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('📦 Labs API response:', { success: data.success, labsCount: data.labs?.length, totalCount: data.total_count });
      return data.labs || [];
    } catch (error) {
      console.error('❌ Error in fetchLabs:', error);
      throw error;
    }
  }

  async fetchLab(id: number, track: string = 'kubernetes'): Promise<Lab> {
    const response = await fetch(`${this.baseUrl}/${track}/labs/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch lab: ${id}`);
    }
    const data = await response.json();
    return data.lab;
  }

  // Code Labs API methods
  async fetchCodeLabs(params?: { language?: string; difficulty?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.language) queryParams.append('language', params.language);
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty);

    const url = `${this.baseUrl}/code_labs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch code labs');
    }

    return response.json();
  }

  async fetchCodeLab(id: number) {
    const response = await fetch(`${this.baseUrl}/code_labs/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch code lab: ${id}`);
    }

    return response.json();
  }

  async executeCode(labId: number | string, code: string, testInput?: string) {
    const response = await fetch(`${this.baseUrl}/code_labs/${labId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, test_input: testInput }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to execute code';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async validateCode(labId: number, code: string) {
    const response = await fetch(`${this.baseUrl}/code_labs/${labId}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to validate code');
    }

    return response.json();
  }

  async submitCode(labId: number, code: string) {
    const response = await fetch(`${this.baseUrl}/code_labs/${labId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    return data;
  }

  async getCodeLabHint(labId: number) {
    const response = await fetch(`${this.baseUrl}/code_labs/${labId}/hint`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch hint');
    }

    return response.json();
  }

  async getCodeLabSolution(labId: number) {
    const response = await fetch(`${this.baseUrl}/code_labs/${labId}/solution`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch solution');
    }

    return response.json();
  }

  // Fetch quiz questions for a given quiz id (track default is 'kubernetes')
  async fetchQuizQuestions(quizId: number | string, track: string = 'kubernetes') {
    const response = await fetch(`${this.baseUrl}/${track}/quizzes/${quizId}/questions`);

    if (!response.ok) {
      throw new Error(`Failed to fetch quiz questions for quiz: ${quizId}`);
    }

    const data = await response.json();
    // Expecting { questions: [...] }
    return data.questions || [];
  }
}

export const apiService = new ApiService();
