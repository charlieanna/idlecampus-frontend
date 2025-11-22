import React from 'react';
import { SystemDesignLessonViewer } from '../components/SystemDesignLessonViewer';
import { LessonHub } from '../components/LessonHub';
import { SystemDesignLesson } from '../../types/lesson';
import { useUIStore } from '../store';

/**
 * LessonsPage - Lesson viewer
 * Maps to Figma: LessonsPage frame
 */
export const LessonsPage: React.FC = () => {
  const { selectedLesson, setSelectedLesson, setActiveTab } = useUIStore();

  const handleComplete = () => {
    setSelectedLesson(null);
    setActiveTab('canvas');
  };

  const handleSelectLesson = (lesson: SystemDesignLesson) => {
    setSelectedLesson(lesson);
  };

  return (
    <div className="flex-1 overflow-hidden">
      {selectedLesson ? (
        <SystemDesignLessonViewer
          lesson={selectedLesson}
          onComplete={handleComplete}
          onBack={() => setSelectedLesson(null)}
        />
      ) : (
        <LessonHub onSelectLesson={handleSelectLesson} />
      )}
    </div>
  );
};
