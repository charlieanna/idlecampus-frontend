import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import KubernetesApp from './apps/kubernetes/KubernetesApp';
import DockerApp from './apps/docker/DockerApp';
import LinuxApp from './apps/linux/LinuxApp';
import SecurityApp from './apps/security/SecurityApp';
import SystemDesignApp from './apps/system-design/SystemDesignApp';
import PythonApp from './apps/python/PythonApp';
import GolangApp from './apps/golang/GolangApp';
import GenericCourseApp from './apps/generic/GenericCourseApp';
import IITJEECourseSelection from './apps/iit-jee/IITJEECourseSelection';
import UpscApp from './apps/upsc/UpscApp';
import CatApp from './apps/cat/CatApp';
import DSAApp from './apps/dsa/DSAApp';
import CourseSelectionDashboard from './components/CourseSelectionDashboard';
import { ProgressiveModuleViewer } from './components/course/ProgressiveModuleViewer';
import { ReviewSessionPrompt } from './components/course/ReviewSessionPrompt';
import { apiService } from './services/api';
import { transformCourseData, type Module } from './utils/dataTransformer';
import { useProgressTracking } from './hooks/useProgressTracking';
import { authService } from './services/auth';

// ============================================
// TYPES
// ============================================

type CourseType = 'kubernetes' | 'docker' | 'docker-bootcamp' | 'system-design' | 'system_design' | 'aws' | 'envoy' | 'postgresql' | 'networking' | 'linux' | 'security' | 'chemistry' | 'mathematics';

interface CourseData {
  type: CourseType;
  title: string;
  modules: Module[];
  moduleCount: number;
  labCount: number;
}

// ============================================
// LOADING SCREEN
// ============================================

function LoadingScreen({ courseType }: { courseType?: string }) {
  const courseNames: Record<string, string> = {
    'docker': 'Docker',
    'docker-bootcamp': 'Docker Bootcamp',
    'kubernetes': 'Kubernetes',
    'system-design': 'System Design',
    'system_design': 'System Design',
    'aws': 'AWS Cloud Architecture',
    'envoy': 'Envoy Proxy',
    'postgresql': 'PostgreSQL',
    'networking': 'Networking',
    'chemistry': 'IIT JEE Chemistry',
    'mathematics': 'IIT JEE Mathematics'
  };

  const courseName = courseType ? (courseNames[courseType] || 'Course') : 'Course';

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg mb-2">Loading {courseName} Course...</p>
        <p className="text-slate-400 text-sm">Fetching content from API...</p>
      </div>
    </div>
  );
}

// ============================================
// ERROR SCREEN
// ============================================

function ErrorScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md p-6">
        <div className="text-red-600 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Failed to Load Course</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <div className="bg-slate-100 p-4 rounded-lg mb-4 text-left">
          <p className="text-sm text-slate-700 mb-2"><strong>Make sure:</strong></p>
          <ol className="text-sm text-slate-700 list-decimal list-inside space-y-1">
            <li>Rails server is running on port 3000</li>
            <li>Database has been seeded</li>
          </ol>
        </div>
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

// ============================================
// COURSE PAGE WRAPPER - Loads API data for a specific course
// ============================================

type ApiCourseType = 'docker' | 'docker-bootcamp' | 'kubernetes' | 'system_design' | 'aws' | 'envoy' | 'postgresql' | 'networking' | 'linux' | 'security' | 'chemistry' | 'mathematics';

function CoursePageWrapper({ courseType }: { courseType: ApiCourseType }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [courseSlug, setCourseSlug] = useState<string | undefined>(undefined);

  // Progress tracking hooks - only active when user is authenticated
  const progressTracking = useProgressTracking(
    authService.isAuthenticated() ? courseSlug : undefined
  );

  const loadCourseData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Map course types to their API tracks and course slugs
      const courseConfig: Record<string, { track: string; slug: string }> = {
        'docker': { track: 'docker', slug: 'docker-fundamentals' },
        'docker-bootcamp': { track: 'docker', slug: 'docker-containers-bootcamp' },
        'kubernetes': { track: 'kubernetes', slug: 'kubernetes-complete-guide' },
        'linux': { track: 'linux', slug: 'linux-shell-fundamentals' },
        'security': { track: 'linux', slug: 'linux-shell-fundamentals' }, // Use Linux track for security
        'aws': { track: 'aws', slug: 'aws-cloud-fundamentals' },
        'system_design': { track: 'system_design', slug: 'system-design' },
        'envoy': { track: 'envoy', slug: 'envoy' },
        'postgresql': { track: 'postgresql', slug: 'postgresql' },
        'networking': { track: 'networking', slug: 'networking' }
      };

      const config = courseConfig[courseType];

      console.log('📡 Loading course data for:', { courseType, config });

      if (!config) {
        throw new Error(`No course mapping found for: ${courseType}`);
      }

      const { track, slug: targetSlug } = config;

      // Fetch courses using the track-based API
      const courses = await apiService.fetchCourses(track);
      console.log('📚 Available courses:', courses.map(c => ({ title: c.title, slug: c.slug })));

      const targetCourse = courses.find(c => c.slug === targetSlug) || courses[0];

      console.log('🎯 Selected course:', JSON.stringify({ title: targetCourse?.title, slug: targetCourse?.slug }, null, 2));

      if (!targetCourse) {
        throw new Error(`Course not found: ${targetSlug}. Please run: rails db:seed`);
      }

      // Fetch detailed course data using track-based API
      console.log('🔍 Step 1: Fetching course...');
      const fullCourse = await apiService.fetchCourse(targetCourse.slug, track);
      console.log('✅ Step 1 complete:', fullCourse?.title);
      
      console.log('🔍 Step 2: Fetching modules...');
      const modules = await apiService.fetchModules(targetCourse.slug, track);
      console.log('✅ Step 2 complete:', modules?.length, 'modules');
      
      console.log('🔍 Step 3: Fetching labs...');
      const labs = await apiService.fetchLabs(track);
      console.log('✅ Step 3 complete:', labs?.length, 'labs');

      if (!modules || modules.length === 0) {
        throw new Error('No modules found in course. Please check database seeds.');
      }

      // Transform API data
      console.log('🔍 Step 4: Transforming course data...');
      const transformed = transformCourseData(fullCourse, modules, labs);
      console.log('✅ Step 4 complete:', transformed.length, 'transformed modules');

      console.log('✅ Course data loaded:', {
        type: courseType,
        course: fullCourse.title,
        modules: transformed.length,
        lessons: transformed.reduce((sum, m) => sum + m.lessons.length, 0),
        labs: labs.length
      });

      setCourseData({
        type: courseType,
        title: fullCourse.title,
        modules: transformed,
        moduleCount: transformed.length,
        labCount: labs.length
      });

      // Set course slug for progress tracking
      setCourseSlug(targetCourse.slug);
    } catch (err) {
      console.error('❌ Error loading course data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, [courseType]);

  // Loading state
  if (loading) {
    return <LoadingScreen courseType={courseType} />;
  }

  // Error state
  if (error) {
    return <ErrorScreen error={error} onRetry={loadCourseData} />;
  }

  // No data
  if (!courseData) {
    return <ErrorScreen error="No course data available" onRetry={loadCourseData} />;
  }

  // Success banner
  const SuccessBanner = () => (
    <div className="bg-green-600 text-white text-center py-1.5 text-xs">
      ✅ Live Content • {courseData.title} • {courseData.moduleCount} Modules • {courseData.labCount} Labs
    </div>
  );

  // Course title mapping for subtitles
  const courseTitles: Record<string, { title: string; subtitle: string }> = {
    'docker': { title: 'Docker Course', subtitle: 'Docker Fundamentals' },
    'docker-bootcamp': { title: 'Docker Containers Professional Bootcamp', subtitle: '7-Week Intensive Training' },
    'kubernetes': { title: 'Kubernetes Course', subtitle: 'CKAD Preparation' },
    'system_design': { title: 'System Design', subtitle: 'Back-of-Envelope Calculations' },
    'aws': { title: 'AWS Cloud Architecture', subtitle: 'Solutions Architect Path' },
    'envoy': { title: 'Envoy Proxy', subtitle: 'Service Mesh Mastery' },
    'postgresql': { title: 'PostgreSQL', subtitle: 'Database Mastery' },
    'networking': { title: 'Networking Fundamentals', subtitle: 'TCP/IP, DNS, and Routing' },
    'chemistry': { title: 'IIT JEE Chemistry', subtitle: 'Organic & Physical Chemistry' },
    'mathematics': { title: 'IIT JEE Mathematics', subtitle: 'Calculus, Algebra & Trigonometry' }
  };

  const courseInfo = courseTitles[courseType] || { title: courseData.title, subtitle: '' };

  // Handle review session actions
  const handleStartReview = async () => {
    await progressTracking.createReviewSession();
    // Review session will be managed by GenericCourseApp
  };

  const handleSkipReview = () => {
    progressTracking.dismissReview();
  };

  // Render the appropriate app
  return (
    <>
      <SuccessBanner />

      {/* Show review prompt if needed */}
      {authService.isAuthenticated() &&
       progressTracking.needsReview &&
       progressTracking.resumePoint &&
       !progressTracking.reviewActive && (
        <ReviewSessionPrompt
          resumePoint={progressTracking.resumePoint.resume_point}
          daysSinceLastAccess={progressTracking.resumePoint.days_since_last_access}
          courseName={courseData.title}
          onStartReview={handleStartReview}
          onSkipReview={handleSkipReview}
        />
      )}

      {courseType === 'linux' ? (
        <LinuxApp courseModules={courseData.modules} />
      ) : courseType === 'security' ? (
        <SecurityApp courseModules={courseData.modules} />
      ) : courseType === 'docker' || courseType === 'docker-bootcamp' ? (
        <DockerApp courseModules={courseData.modules} />
      ) : courseType === 'kubernetes' ? (
        <KubernetesApp courseModules={courseData.modules} />
      ) : (
        <GenericCourseApp
          courseModules={courseData.modules}
          courseTitle={courseInfo.title}
          courseSubtitle={courseInfo.subtitle}
          resumePoint={progressTracking.resumePoint?.resume_point}
          reviewSession={progressTracking.reviewSession}
        />
      )}
    </>
  );
}

// ============================================
// PROGRESSIVE MODULE WRAPPER
// ============================================

function ProgressiveModuleWrapper() {
  const { moduleSlug } = useParams<{ moduleSlug: string }>();

  if (!moduleSlug) {
    return <Navigate to="/docker" replace />;
  }

  return (
    <ProgressiveModuleViewer
      courseSlug="docker-fundamentals"
      moduleSlug={moduleSlug}
    />
  );
}

// ============================================
// IIT JEE COURSE WRAPPER - Loads a single IIT JEE course
// ============================================

function IITJEECourseWrapper({ subject }: { subject: 'chemistry' | 'mathematics' }) {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);

  const loadCourseData = async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      console.log(`📡 Loading ${subject} course:`, slug);

      // Fetch detailed course data
      const fullCourse = await apiService.fetchCourse(slug, subject);
      const moduleSummaries = await apiService.fetchModules(slug, subject);
      const labs = await apiService.fetchLabs(subject);

      if (!moduleSummaries || moduleSummaries.length === 0) {
        throw new Error('No modules found in course. Please check database seeds.');
      }

      // Fetch detailed module data (with items) for each module
      const detailedModules = await Promise.all(
        moduleSummaries.map(mod => apiService.fetchModule(slug, mod.slug, subject))
      );

      // Transform API data
      const transformed = transformCourseData(fullCourse, detailedModules, labs);

      console.log('✅ Course data loaded:', {
        type: subject,
        course: fullCourse.title,
        modules: transformed.length,
        lessons: transformed.reduce((sum, m) => sum + m.lessons.length, 0),
        labs: labs.length
      });

      setCourseData({
        type: subject,
        title: fullCourse.title,
        modules: transformed,
        moduleCount: transformed.length,
        labCount: labs.length
      });
    } catch (err) {
      console.error(`❌ Error loading ${subject} course:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, [slug, subject]);

  // Loading state
  if (loading) {
    return <LoadingScreen courseType={subject} />;
  }

  // Error state
  if (error) {
    return <ErrorScreen error={error} onRetry={loadCourseData} />;
  }

  // No data
  if (!courseData) {
    return <ErrorScreen error="No course data available" onRetry={loadCourseData} />;
  }

  const subjectTitles = {
    chemistry: 'IIT JEE Chemistry',
    mathematics: 'IIT JEE Mathematics'
  };

  // Success banner
  const SuccessBanner = () => (
    <div className="bg-green-600 text-white text-center py-1.5 text-xs">
      ✅ Live Content • {courseData.title} • {courseData.moduleCount} Modules • {courseData.labCount} Labs
    </div>
  );

  // Render the generic course app
  return (
    <>
      <SuccessBanner />
      <GenericCourseApp
        courseModules={courseData.modules}
        courseTitle={courseData.title}
        courseSubtitle={subjectTitles[subject]}
      />
    </>
  );
}

// ============================================
// APP ROUTER - Main component with routes
// ============================================

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<CourseSelectionDashboard />} />
      <Route path="/linux" element={<CoursePageWrapper courseType="linux" />} />
      <Route path="/security" element={<CoursePageWrapper courseType="security" />} />
      <Route path="/docker" element={<CoursePageWrapper courseType="docker" />} />
      <Route path="/docker-bootcamp" element={<CoursePageWrapper courseType="docker-bootcamp" />} />
      <Route path="/docker/progressive/:moduleSlug" element={<ProgressiveModuleWrapper />} />
      <Route path="/kubernetes" element={<CoursePageWrapper courseType="kubernetes" />} />
            <Route path="/system-design/*" element={<SystemDesignApp />} />
      <Route path="/python" element={<PythonApp />} />
      <Route path="/golang" element={<GolangApp />} />

      {/* New courses */}
      <Route path="/system_design/*" element={<SystemDesignApp />} />
      <Route path="/aws" element={<CoursePageWrapper courseType="aws" />} />
      <Route path="/envoy" element={<CoursePageWrapper courseType="envoy" />} />
      <Route path="/postgresql" element={<CoursePageWrapper courseType="postgresql" />} />
      <Route path="/networking" element={<CoursePageWrapper courseType="networking" />} />

      {/* IIT JEE Courses - Course Selection Pages */}
      <Route path="/chemistry" element={<IITJEECourseSelection subject="chemistry" />} />
      <Route path="/mathematics" element={<IITJEECourseSelection subject="mathematics" />} />

      {/* IIT JEE Courses - Individual Course Pages */}
      <Route path="/chemistry/:slug" element={<IITJEECourseWrapper subject="chemistry" />} />
      <Route path="/mathematics/:slug" element={<IITJEECourseWrapper subject="mathematics" />} />

      {/* UPSC CSE Preparation Platform */}
      <Route path="/upsc/*" element={<UpscApp />} />

      {/* CAT MBA Entrance Preparation */}
      <Route path="/cat/*" element={<CatApp />} />

      {/* DSA Course with Python */}
      <Route path="/dsa/*" element={<DSAApp />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
