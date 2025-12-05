import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ProblemCatalog } from './builder/ui/components/ProblemCatalog';
import { TieredSystemDesignBuilder } from './builder/ui/TieredSystemDesignBuilderRefactored';
import { LessonsPage } from './builder/ui/pages/LessonsPage';
import { LessonViewer } from './builder/ui/pages/LessonViewer';
import { ProgressiveDashboard } from './progressive/pages/ProgressiveDashboard';
import { AssessmentPage } from './progressive/pages/AssessmentPage';
import { TrackDetailPage } from './progressive/pages/TrackDetailPage';
import { SkillTreePage } from './progressive/pages/SkillTreePage';
import { AchievementsPage } from './progressive/pages/AchievementsPage';
import { LeaderboardPage } from './progressive/pages/LeaderboardPage';
import { UserProfilePage } from './progressive/pages/UserProfilePage';
import { ChallengeDetailPage } from './progressive/pages/ChallengeDetailPage';
import { ProgressDashboardPage } from './progressive/pages/ProgressDashboardPage';
import { ProgressiveAllChallengesPage } from './progressive/pages/ProgressiveAllChallengesPage';

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

      {/* Progressive Flow routes */}
      <Route path="/progressive" element={<ProgressiveDashboard />} />
      <Route path="/progressive/assessment" element={<AssessmentPage />} />
      <Route path="/progressive/track/:trackId" element={<TrackDetailPage />} />
      <Route path="/progressive/tracks" element={<Navigate to="/progressive" replace />} />
      <Route path="/progressive/skills" element={<SkillTreePage />} />
      <Route path="/progressive/achievements" element={<AchievementsPage />} />
      <Route path="/progressive/leaderboard" element={<LeaderboardPage />} />
      <Route path="/progressive/profile" element={<UserProfilePage />} />
      <Route path="/progressive/challenge/:id" element={<ChallengeDetailPage />} />
      <Route path="/progressive/progress" element={<ProgressDashboardPage />} />
      <Route path="/progressive/all" element={<ProgressiveAllChallengesPage />} />

      {/* Lessons routes */}
      <Route path="/lessons" element={<LessonsPage />} />
      <Route path="/lessons/:lessonId" element={<LessonViewer />} />

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
