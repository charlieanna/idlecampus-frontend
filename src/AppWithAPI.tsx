import { useState, useEffect } from 'react';
import App from './App';
import { apiService } from './services/api';
import { transformCourseData, type Module } from './utils/dataTransformer';

// Loading component
function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 text-lg mb-2">Loading Kubernetes Course...</p>
        <p className="text-slate-400 text-sm">Fetching content from API...</p>
      </div>
    </div>
  );
}

// Error component
function ErrorScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md p-6">
        <div className="text-red-600 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Failed to Load Course</h2>
        <p className="text-slate-600 mb-4">{error}</p>
        <div className="bg-slate-100 p-4 rounded-lg mb-4 text-left">
          <p className="text-sm text-slate-700 mb-2"><strong>Make sure:</strong></p>
          <ol className="text-sm text-slate-700 list-decimal list-inside space-y-1 mb-3">
            <li>Rails server is running on port 3001</li>
            <li>Database has been seeded: <code className="bg-slate-200 px-1">rails db:seed</code></li>
          </ol>
          <p className="text-xs text-slate-600 mb-2">Start script should handle this automatically:</p>
          <pre className="text-xs bg-slate-900 text-green-400 p-2 rounded">
./start-kubernetes-course.sh
          </pre>
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

export default function AppWithAPI() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transformedModules, setTransformedModules] = useState<Module[]>([]);
  const [courseInfo, setCourseInfo] = useState<{
    title: string;
    moduleCount: number;
    labCount: number;
  } | null>(null);

  const loadCourseData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch the CKAD course (or CKA if CKAD doesn't exist)
      const courses = await apiService.fetchCourses();
      const ckadCourse = courses.find(c => c.certification_track === 'ckad') || 
                         courses.find(c => c.certification_track === 'cka') ||
                         courses[0];
      
      if (!ckadCourse) {
        throw new Error('No Kubernetes courses found. Please run: rails db:seed');
      }

      // Fetch detailed course data with modules
      const fullCourse = await apiService.fetchCourse(ckadCourse.slug);
      
      // Fetch modules with lessons
      const modules = await apiService.fetchModules(ckadCourse.slug);
      
      if (!modules || modules.length === 0) {
        throw new Error('No modules found in course. Please check database seeds.');
      }
      
      // Fetch labs
      const labs = await apiService.fetchLabs();

      // Transform API data to App component format
      const transformed = transformCourseData(fullCourse, modules, labs);
      
      console.log('✅ Course data loaded:', {
        course: fullCourse.title,
        modules: transformed.length,
        lessons: transformed.reduce((sum, m) => sum + m.lessons.length, 0),
        labs: transformed.reduce((sum, m) => sum + m.labs.length, 0)
      });

      setTransformedModules(transformed);
      setCourseInfo({
        title: fullCourse.title,
        moduleCount: transformed.length,
        labCount: labs.length
      });
    } catch (err) {
      console.error('❌ Error loading course data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={loadCourseData} />;
  }

  if (!transformedModules || transformedModules.length === 0) {
    return <ErrorScreen error="No course modules available" onRetry={loadCourseData} />;
  }

  // Pass the transformed API data to the main App component
  return (
    <>
      {/* Optional: Display API status banner */}
      {courseInfo && (
        <div className="bg-green-600 text-white text-center py-1.5 text-xs">
          ✅ Live Content • {courseInfo.title} • {courseInfo.moduleCount} Modules • {courseInfo.labCount} Labs
        </div>
      )}
      <App courseModules={transformedModules} />
    </>
  );
}

