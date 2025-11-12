import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import SystemDesignBuilderApp from './builder/ui/SystemDesignBuilderApp';
import { ProblemCatalog } from './builder/ui/components/ProblemCatalog';

// Component to handle dynamic challenge routes
// Note: Challenge IDs can use either hyphens or underscores depending on when they were created
// - Manually created challenges: use underscores (tiny_url, food_blog, todo_app)
// - Generated challenges: use hyphens (l6-bio-digital-10, instagram, etc.)
// We pass the URL challengeId as-is and let SystemDesignBuilderApp handle the lookup
function ChallengeRoute() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const id = challengeId || 'tiny-url';
  return <SystemDesignBuilderApp challengeId={id} />;
}

export default function SystemDesignApp() {
  return (
    <Routes>
      {/* Catalog view as the landing page */}
      <Route path="/" element={<ProblemCatalog />} />

      {/* Individual challenge routes - pass the hyphenated URL ID and let SystemDesignBuilderApp handle the lookup */}
      <Route path="/tiny-url" element={<SystemDesignBuilderApp challengeId="tiny-url" />} />
      <Route path="/food-blog" element={<SystemDesignBuilderApp challengeId="food-blog" />} />
      <Route path="/todo-app" element={<SystemDesignBuilderApp challengeId="todo-app" />} />
      <Route path="/:challengeId" element={<ChallengeRoute />} />

      {/* Fallback to catalog */}
      <Route path="*" element={<Navigate to="/system-design" replace />} />
    </Routes>
  );
}
