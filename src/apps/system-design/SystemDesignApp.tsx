import { Routes, Route, Navigate } from 'react-router-dom';
import SystemDesignBuilderApp from './builder/ui/SystemDesignBuilderApp';

export default function SystemDesignApp() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/system-design/tiny-url" replace />} />
      <Route path="/tiny-url" element={<SystemDesignBuilderApp challengeId="tiny_url" />} />
      <Route path="/food-blog" element={<SystemDesignBuilderApp challengeId="food_blog" />} />
      <Route path="/todo-app" element={<SystemDesignBuilderApp challengeId="todo_app" />} />
      <Route path="*" element={<Navigate to="/system-design/tiny-url" replace />} />
    </Routes>
  );
}
