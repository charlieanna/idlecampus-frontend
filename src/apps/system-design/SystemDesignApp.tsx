import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ProblemCatalog } from './builder/ui/components/ProblemCatalog';
import { TieredSystemDesignBuilder } from './builder/ui/TieredSystemDesignBuilder';
import { LessonsPage } from './builder/ui/pages/LessonsPage';
import { LessonViewer } from './builder/ui/pages/LessonViewer';

// Component to handle dynamic challenge routes
// All challenges now use the tiered system (658 challenges with tier support)
function ChallengeRoute() {
  const { challengeId } = useParams<{ challengeId: string }>();
  return <TieredSystemDesignBuilder challengeId={challengeId} />;
}

export default function SystemDesignApp() {
  return (
    <Routes>
      {/* Catalog view as the landing page */}
      <Route path="/" element={<ProblemCatalog />} />

      {/* Lessons routes */}
      <Route path="/lessons" element={<LessonsPage />} />
      <Route path="/lessons/:lessonId" element={<LessonViewer />} />

      {/* Individual challenge routes - all use tiered system now */}
      <Route path="/:challengeId" element={<ChallengeRoute />} />

      {/* Fallback to catalog */}
      <Route path="*" element={<Navigate to="/system-design" replace />} />
    </Routes>
  );
}
