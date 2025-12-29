import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ProblemCatalog } from './builder/ui/components/ProblemCatalog';
import { TieredSystemDesignBuilder } from './builder/ui/TieredSystemDesignBuilderRefactored';
import { LessonsPage } from './builder/ui/pages/LessonsPage';
import { LessonViewer } from './builder/ui/pages/LessonViewer';
import { GuidedTutorialHub } from './builder/ui/pages/GuidedTutorialHub';
import { GuidedCategoryPage } from './builder/ui/pages/GuidedCategoryPage';

// Reserved paths that should not be treated as challenge IDs
const RESERVED_PATHS = ['progressive', 'lessons', 'guided'];

// Simple 404 component
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a
          href="/system-design"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Go to System Design Catalog
        </a>
      </div>
    </div>
  );
}

// Component to handle dynamic challenge routes
// All challenges now use the tiered system (658 challenges with tier support)
function ChallengeRoute({
  guidedOverride = "classic",
}: {
  guidedOverride?: "auto" | "guided" | "classic";
}) {
  const { challengeId } = useParams<{ challengeId: string }>();

  // Redirect to catalog if no challengeId provided
  if (!challengeId) {
    return <Navigate to="/system-design" replace />;
  }

  // Check if this is a reserved path - return 404
  if (RESERVED_PATHS.includes(challengeId.toLowerCase())) {
    return <NotFound />;
  }

  return (
    <TieredSystemDesignBuilder
      challengeId={challengeId}
      guidedOverride={guidedOverride}
    />
  );
}

export default function SystemDesignApp() {
  return (
    <Routes>
      {/* Catalog view as the landing page */}
      <Route index element={<ProblemCatalog />} />
      <Route path="/" element={<ProblemCatalog />} />

      {/* Lessons routes */}
      <Route path="/lessons" element={<LessonsPage />} />
      <Route path="/lessons/:lessonId" element={<LessonViewer />} />

      {/* Guided Tutorial routes */}
      <Route path="/guided" element={<GuidedTutorialHub />} />
      <Route path="/guided/:categoryId" element={<GuidedCategoryPage />} />

      {/* Reserved paths - return 404 */}
      <Route path="/progressive" element={<NotFound />} />
      <Route path="/progressive/*" element={<NotFound />} />

      {/* Individual challenge routes - all use tiered system now */}
      {/* Only match if challengeId is not empty and not one of the reserved paths */}
      <Route
        path="/:challengeId/guided"
        element={<ChallengeRoute guidedOverride="guided" />}
      />
      <Route
        path="/:challengeId"
        element={<ChallengeRoute guidedOverride="classic" />}
      />

      {/* Fallback to catalog */}
      <Route path="*" element={<Navigate to="/system-design" replace />} />
    </Routes>
  );
}
