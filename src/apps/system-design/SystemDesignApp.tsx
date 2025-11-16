import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ProblemCatalog } from './builder/ui/components/ProblemCatalog';
import { TieredSystemDesignBuilder } from './builder/ui/TieredSystemDesignBuilder';
import { tieredChallenges } from './builder/challenges/tieredChallenges';
import { LessonCatalog } from './builder/ui/components/LessonCatalog';
import { LessonPlayer } from './builder/ui/components/LessonPlayer';
import { getLessonById, allLessons, allModules } from './builder/lessons';

// Component to handle dynamic challenge routes
// All challenges now use the tiered system (658 challenges with tier support)
function ChallengeRoute() {
  const { challengeId } = useParams<{ challengeId: string }>();
  return <TieredSystemDesignBuilder challengeId={challengeId} />;
}

// Component to wrap LessonCatalog with data and navigation
function LessonCatalogRoute() {
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('ddia-completed-lessons');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSelectLesson = (lessonId: string) => {
    navigate(`/system-design/learn/${lessonId}`);
  };

  return (
    <LessonCatalog
      modules={allModules}
      lessons={allLessons}
      completedLessons={completedLessons}
      onSelectLesson={handleSelectLesson}
    />
  );
}

// Component to handle individual lesson routes
function LessonRoute() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const lesson = lessonId ? getLessonById(lessonId) : undefined;

  if (!lesson) {
    return <Navigate to="/system-design/learn" replace />;
  }

  const handleComplete = () => {
    // Save completion to localStorage
    const saved = localStorage.getItem('ddia-completed-lessons');
    const completedLessons: string[] = saved ? JSON.parse(saved) : [];
    if (!completedLessons.includes(lesson.id)) {
      completedLessons.push(lesson.id);
      localStorage.setItem('ddia-completed-lessons', JSON.stringify(completedLessons));
    }
    console.log('Lesson completed:', lessonId);
  };

  const handleExit = () => {
    navigate('/system-design/learn');
  };

  return (
    <LessonPlayer
      lesson={lesson}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
}

export default function SystemDesignApp() {
  return (
    <Routes>
      {/* Catalog view as the landing page */}
      <Route path="/" element={<ProblemCatalog />} />

      {/* DDIA Learning routes */}
      <Route path="/learn" element={<LessonCatalogRoute />} />
      <Route path="/learn/:lessonId" element={<LessonRoute />} />

      {/* Individual challenge routes - all use tiered system now */}
      <Route path="/:challengeId" element={<ChallengeRoute />} />

      {/* Fallback to catalog */}
      <Route path="*" element={<Navigate to="/system-design" replace />} />
    </Routes>
  );
}
