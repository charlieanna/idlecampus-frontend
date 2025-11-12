import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import SystemDesignBuilderApp from './builder/ui/SystemDesignBuilderApp';

// Helper function to convert URL path to challenge ID
function pathToChallengeId(path: string): string {
  return path.replace(/-/g, '_');
}

// Component to handle dynamic challenge routes
function ChallengeRoute() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const id = challengeId ? pathToChallengeId(challengeId) : 'tiny_url';
  return <SystemDesignBuilderApp challengeId={id} />;
}

export default function SystemDesignApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/system-design/tiny-url" replace />} />
      <Route path="/tiny-url" element={<SystemDesignBuilderApp challengeId="tiny_url" />} />
      <Route path="/food-blog" element={<SystemDesignBuilderApp challengeId="food_blog" />} />
      <Route path="/todo-app" element={<SystemDesignBuilderApp challengeId="todo_app" />} />
      <Route path="/:challengeId" element={<ChallengeRoute />} />
      <Route path="*" element={<Navigate to="/system-design/tiny-url" replace />} />
    </Routes>
  );
}
