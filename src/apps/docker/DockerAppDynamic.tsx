import { useState, useEffect } from 'react';
import { apiService, Course as ApiCourse, Module as ApiModule, ModuleItem as ApiModuleItem } from '../../services/api';
import GenericCourseApp from '../generic/GenericCourseApp';
import { Module as UIModule } from '../../components/course/CourseNavigation';

/**
 * Dynamic Docker App - Fetches course data from API
 * Replaces hardcoded courseModules with API-fetched data
 */
export default function DockerAppDynamic() {
  const [modules, setModules] = useState<UIModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState('Docker Fundamentals');

  useEffect(() => {
    async function loadCourseData() {
      try {
        setLoading(true);

        // Fetch Docker course and modules
        console.log('🐳 Fetching Docker course data from API...');

        const course: ApiCourse = await apiService.fetchCourse('docker-fundamentals', 'docker');
        const apiModules: ApiModule[] = await apiService.fetchModules('docker-fundamentals', 'docker');

        console.log('✅ Docker course loaded:', course.title);
        console.log('📦 Modules:', apiModules.length);

        setCourseTitle(course.title);

        // Convert API modules to UI module format
        const uiModules: UIModule[] = await Promise.all(
          apiModules.map(async (apiModule) => convertToUIModule(apiModule))
        );

        setModules(uiModules);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to load Docker course:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    }

    loadCourseData();
  }, []);

  /**
   * Convert API module format to UI module format
   */
  async function convertToUIModule(apiModule: ApiModule): Promise<UIModule> {
    const items = apiModule.items || [];

    // Group items by type
    const lessons: any[] = [];
    const labs: any[] = [];
    const quizzes: any[] = [];

    for (const item of items) {
      switch (item.item_type) {
        case 'CourseLesson':
          lessons.push({
            id: `lesson-${item.id}`,
            title: item.title,
            content: item.content || '',
            items: item.content ? [{
              type: 'content',
              markdown: item.content
            }] : []
          });
          break;

        case 'HandsOnLab':
          labs.push({
            id: `lab-${item.id}`,
            title: item.title,
            description: item.description || '',
            labType: item.lab_type,
            labFormat: item.lab_format,
            difficulty: item.difficulty,
            estimatedMinutes: item.estimated_minutes,
            steps: item.steps || [],
            programmingLanguage: item.programming_language,
            starterCode: item.starter_code,
            solutionCode: item.solution_code,
            testCases: item.test_cases || [],
            tasks: convertStepsToTasks(item.steps || [])
          });
          break;

        case 'Quiz':
          // Fetch quiz questions if needed
          quizzes.push({
            id: `quiz-${item.id}`,
            title: item.title,
            description: item.description || '',
            questions: [] // Will be loaded on demand
          });
          break;

        case 'InteractiveLearningUnit':
          // Treat as a lesson with interactive content
          lessons.push({
            id: `unit-${item.id}`,
            title: item.title,
            content: item.content || item.concept_explanation || '',
            items: [{
              type: 'content',
              markdown: item.content || item.concept_explanation || ''
            }],
            commandToLearn: item.command_to_learn,
            practiceHints: item.practice_hints
          });
          break;
      }
    }

    return {
      id: apiModule.slug,
      title: apiModule.title,
      icon: getModuleIcon(apiModule.slug),
      description: apiModule.description,
      lessons,
      labs,
      quizzes
    };
  }

  /**
   * Convert lab steps to tasks format for LabExercise component
   */
  function convertStepsToTasks(steps: any[]): any[] {
    return steps.map((step, index) => ({
      id: `task-${index + 1}`,
      description: step.instruction || step.title,
      hint: step.hint || `Step ${index + 1}`,
      validation: (cmd: string) => {
        // Simple validation - check if command matches
        const expected = step.expected_command || step.command;
        if (!expected) return true;
        return cmd.includes(expected) || cmd.trim() === expected.trim();
      },
      solution: step.expected_command || step.command || ''
    }));
  }

  /**
   * Get icon name for module based on slug
   */
  function getModuleIcon(slug: string): string {
    const iconMap: Record<string, string> = {
      'container-basics': 'box',
      'images-dockerfiles': 'layers',
      'container-networking': 'network',
      'volumes-data-persistence': 'database',
      'docker-compose': 'layers',
      'production-best-practices': 'shield'
    };
    return iconMap[slug] || 'book-open';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading Docker course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to Load Course</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600">No modules found for this course.</p>
        </div>
      </div>
    );
  }

  return (
    <GenericCourseApp
      courseModules={modules}
      courseTitle={courseTitle}
      courseSubtitle="Master Docker from basics to production deployment"
    />
  );
}
