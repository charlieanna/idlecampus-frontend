/**
 * Universal Course App
 *
 * Replaces 10+ specialized course apps with a single adaptive app
 * that configures itself based on course metadata and plugins.
 *
 * Features:
 * - Fetches course config from API (lab format, plugins, theme)
 * - Adaptive layout based on lab type
 * - Plugin-based feature loading
 * - Supports all course types: Docker, K8s, Linux, Python, SQL, etc.
 *
 * Usage:
 *   <UniversalCourseApp courseSlug="docker-fundamentals" />
 */

import { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { CourseNavigation, Module } from '../components/course/CourseNavigation';
import { LessonViewer } from '../components/course/LessonViewer';
import { QuizViewer } from '../components/course/QuizViewer';
import { LabExercise } from '../components/course/LabExercise';
import LabRenderer from '../components/course/LabRenderer';
import PluginLoader from '../plugins/PluginLoader';
import { ModuleItem } from '../services/api';
import { apiService } from '../services/api';
import { transformCourseData } from '../utils/dataTransformer';

// ============================================
// TYPES
// ============================================

interface CourseConfig {
  slug: string;
  title: string;
  lab_format: 'terminal' | 'code_editor' | 'sql_editor' | 'hybrid';
  plugins: string[];
  theme: string;
  features: Record<string, any>;
  custom_config: Record<string, any>;
}

interface UniversalCourseAppProps {
  courseSlug: string;
  courseType?: string; // For backward compatibility
}

type ViewMode = 'lesson' | 'quiz' | 'lab';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================
// RESIZABLE COMPONENTS
// ============================================

function ResizablePanelGroup({ className = '', ...props }: any) {
  return (
    <ResizablePrimitive.PanelGroup
      className={cn('flex h-full w-full', className)}
      {...props}
    />
  );
}

function ResizablePanel(props: any) {
  return <ResizablePrimitive.Panel {...props} />;
}

function ResizableHandle({ withHandle, className = '', ...props }: any) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        'relative flex w-px items-center justify-center bg-slate-200 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-slate-200 bg-slate-100">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

// ============================================
// LOADING/ERROR SCREENS
// ============================================

function LoadingScreen({ courseName }: { courseName?: string }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg mb-2">Loading {courseName || 'Course'}...</p>
        <p className="text-slate-400 text-sm">Fetching content from API...</p>
      </div>
    </div>
  );
}

function ErrorScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md p-6">
        <div className="text-red-600 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Failed to Load Course</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function UniversalCourseApp({ courseSlug, courseType }: UniversalCourseAppProps) {
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseConfig, setCourseConfig] = useState<CourseConfig | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('lesson');

  // Load course data
  const loadCourseData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📡 [UniversalCourseApp] Loading course:', courseSlug);

      // Fetch course configuration
      const configResponse = await fetch(`/api/v1/courses/${courseSlug}/config`);
      if (!configResponse.ok) {
        throw new Error(`Failed to fetch course config: ${configResponse.statusText}`);
      }
      const configData = await configResponse.json();

      if (!configData.success) {
        throw new Error(configData.error || 'Failed to load course configuration');
      }

      console.log('✅ Course config loaded:', configData.config);
      setCourseConfig(configData.config);

      // Fetch modules with items
      const modulesResponse = await fetch(`/api/v1/courses/${courseSlug}/modules`);
      if (!modulesResponse.ok) {
        throw new Error(`Failed to fetch modules: ${modulesResponse.statusText}`);
      }
      const modulesData = await modulesResponse.json();

      if (!modulesData.success || !modulesData.modules) {
        throw new Error('Failed to load course modules');
      }

      console.log('✅ Modules loaded:', modulesData.modules.length);

      // Fetch detailed module data with items
      const detailedModules = await Promise.all(
        modulesData.modules.map(async (module: any) => {
          const moduleResponse = await fetch(
            `/api/v1/courses/${courseSlug}/modules/${module.slug}`
          );
          const moduleData = await moduleResponse.json();
          return moduleData.success ? moduleData.module : null;
        })
      );

      const validModules = detailedModules.filter(Boolean);

      // Transform to expected format
      const transformedModules = transformModulesForDisplay(validModules);
      setModules(transformedModules);

      console.log('✅ Course loaded successfully:', {
        modules: transformedModules.length,
        labFormat: configData.config.lab_format,
        plugins: configData.config.plugins
      });

      setLoading(false);
    } catch (err: any) {
      console.error('❌ Error loading course:', err);
      setError(err.message || 'Failed to load course');
      setLoading(false);
    }
  };

  // Transform modules to display format
  const transformModulesForDisplay = (apiModules: any[]): Module[] => {
    return apiModules.map((module) => ({
      id: module.id.toString(),
      title: module.title,
      icon: getModuleIcon(module.title),
      lessons: transformItems(module.items || [])
    }));
  };

  // Get icon for module based on title
  const getModuleIcon = (title: string): string => {
    const lower = title.toLowerCase();
    if (lower.includes('pod')) return 'box';
    if (lower.includes('deploy')) return 'rocket';
    if (lower.includes('service')) return 'network';
    if (lower.includes('storage') || lower.includes('volume')) return 'database';
    if (lower.includes('config')) return 'settings';
    if (lower.includes('security')) return 'shield';
    return 'book-open';
  };

  // Transform module items to lessons format
  const transformItems = (items: any[]) => {
    return items.map((item: any) => ({
      id: `${item.type}-${item.id}`,
      title: item.title || 'Untitled',
      type: mapItemType(item.type),
      data: item
    }));
  };

  // Map API item types to view types
  const mapItemType = (itemType: string): 'content' | 'quiz' | 'lab' => {
    if (itemType === 'CourseLesson') return 'content';
    if (itemType === 'Quiz') return 'quiz';
    if (itemType === 'HandsOnLab' || itemType === 'InteractiveLearningUnit') return 'lab';
    return 'content';
  };

  // Load data on mount
  useEffect(() => {
    loadCourseData();
  }, [courseSlug]);

  // Navigation handlers
  const handleNavigation = (moduleIndex: number, lessonIndex: number) => {
    setCurrentModuleIndex(moduleIndex);
    setCurrentItemIndex(lessonIndex);

    const currentModule = modules[moduleIndex];
    if (currentModule?.lessons[lessonIndex]) {
      const item = currentModule.lessons[lessonIndex];
      setViewMode(item.type as ViewMode);
    }
  };

  const handleNext = () => {
    const currentModule = modules[currentModuleIndex];
    if (!currentModule) return;

    if (currentItemIndex < currentModule.lessons.length - 1) {
      handleNavigation(currentModuleIndex, currentItemIndex + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      handleNavigation(currentModuleIndex + 1, 0);
    }
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      handleNavigation(currentModuleIndex, currentItemIndex - 1);
    } else if (currentModuleIndex > 0) {
      const prevModule = modules[currentModuleIndex - 1];
      handleNavigation(currentModuleIndex - 1, prevModule.lessons.length - 1);
    }
  };

  // Render states
  if (loading) {
    return <LoadingScreen courseName={courseConfig?.title} />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={loadCourseData} />;
  }

  if (!courseConfig || modules.length === 0) {
    return (
      <ErrorScreen
        error="No course content available"
        onRetry={loadCourseData}
      />
    );
  }

  // Get current item
  const currentModule = modules[currentModuleIndex];
  const currentItem = currentModule?.lessons[currentItemIndex];

  // Determine layout based on lab format
  const needsTerminalOrEditor =
    courseConfig.lab_format === 'terminal' ||
    courseConfig.lab_format === 'code_editor' ||
    courseConfig.lab_format === 'sql_editor';

  const isHybrid = courseConfig.lab_format === 'hybrid';

  // Apply theme (if specified)
  const themeClass = courseConfig.theme ? `theme-${courseConfig.theme}` : '';

  return (
    <div className={cn('h-screen flex flex-col', themeClass)}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-slate-900">{courseConfig.title}</h1>
        <p className="text-sm text-slate-600 mt-1">
          {currentModule?.title} • {currentItem?.title}
        </p>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Navigation Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <div className="h-full overflow-y-auto bg-slate-50 border-r border-slate-200">
              <CourseNavigation
                modules={modules}
                currentModuleIndex={currentModuleIndex}
                currentLessonIndex={currentItemIndex}
                onNavigate={handleNavigation}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Content Area */}
          <ResizablePanel defaultSize={needsTerminalOrEditor ? 50 : 80}>
            <div className="h-full overflow-y-auto bg-white">
              {viewMode === 'lesson' && currentItem?.data && (
                <LessonViewer
                  lesson={{
                    id: currentItem.data.lesson_id || currentItem.data.id,
                    title: currentItem.title,
                    content: currentItem.data.content || '',
                    sequence_order: currentItemIndex + 1,
                    estimated_minutes: currentItem.data.estimated_minutes
                  }}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  hasNext={
                    currentItemIndex < currentModule.lessons.length - 1 ||
                    currentModuleIndex < modules.length - 1
                  }
                  hasPrevious={currentItemIndex > 0 || currentModuleIndex > 0}
                />
              )}

              {viewMode === 'quiz' && currentItem?.data && (
                <QuizViewer
                  quiz={{
                    id: currentItem.data.quiz_id || currentItem.data.id,
                    title: currentItem.title,
                    description: currentItem.data.description || '',
                    questions: currentItem.data.questions || [],
                    passing_score: currentItem.data.passing_score || 70,
                    time_limit_minutes: currentItem.data.time_limit_minutes,
                    max_attempts: currentItem.data.max_attempts || 3
                  }}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  hasNext={
                    currentItemIndex < currentModule.lessons.length - 1 ||
                    currentModuleIndex < modules.length - 1
                  }
                  hasPrevious={currentItemIndex > 0 || currentModuleIndex > 0}
                />
              )}

              {viewMode === 'lab' && currentItem?.data && (
                <LabExercise
                  lab={{
                    id: currentItem.data.lab_id || currentItem.data.id,
                    title: currentItem.title,
                    description: currentItem.data.description || '',
                    difficulty: currentItem.data.difficulty || 'medium',
                    estimated_minutes: currentItem.data.estimated_minutes || 30,
                    lab_type: currentItem.data.lab_type || courseConfig.lab_format,
                    lab_format: currentItem.data.lab_format || courseConfig.lab_format,
                    steps: currentItem.data.steps || [],
                    starter_code: currentItem.data.starter_code,
                    test_cases: currentItem.data.test_cases
                  }}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  hasNext={
                    currentItemIndex < currentModule.lessons.length - 1 ||
                    currentModuleIndex < modules.length - 1
                  }
                  hasPrevious={currentItemIndex > 0 || currentModuleIndex > 0}
                />
              )}
            </div>
          </ResizablePanel>

          {/* Terminal/Editor Panel (if needed for lab format) */}
          {needsTerminalOrEditor && viewMode === 'lab' && currentItem?.data && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={30} minSize={20}>
                <div className="h-full bg-slate-900">
                  <LabRenderer
                    lab={{
                      id: currentItem.data.lab_id || currentItem.data.id,
                      title: currentItem.title,
                      description: currentItem.data.description || '',
                      lab_type: currentItem.data.lab_type || courseConfig.lab_format,
                      lab_format: currentItem.data.lab_format || courseConfig.lab_format,
                      difficulty: currentItem.data.difficulty,
                      estimated_minutes: currentItem.data.estimated_minutes,
                      steps: currentItem.data.steps,
                      programming_language: currentItem.data.programming_language,
                      starter_code: currentItem.data.starter_code,
                      solution_code: currentItem.data.solution_code,
                      test_cases: currentItem.data.test_cases,
                      time_limit_seconds: currentItem.data.time_limit_seconds,
                      memory_limit_mb: currentItem.data.memory_limit_mb,
                      schema_setup: currentItem.data.schema_setup,
                      sample_data: currentItem.data.sample_data
                    }}
                    courseSlug={courseSlug}
                    onComplete={handleNext}
                  />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Plugin Components (loaded dynamically) */}
      <PluginLoader
        plugins={courseConfig.plugins}
        pluginOptions={courseConfig.custom_config?.plugin_options || {}}
        courseSlug={courseSlug}
      />
    </div>
  );
}
