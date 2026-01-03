/**
 * AppDSAHeader - Header bar for DSA Course
 * 
 * Displays current lesson/problem title with mode indicator
 */

import React from 'react';
import { Code, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../../contexts/ThemeContext';
import type { DSAProblem } from '../../types/dsa-course';

export interface AppDSAHeaderProps {
  /** Current problem being viewed */
  currentProblem?: DSAProblem | null;
  
  /** Current lesson title */
  lessonTitle?: string;
  
  /** Current module title */
  moduleTitle?: string;
  
  /** Whether to show quiz toggle button */
  showQuizToggle?: boolean;
  
  /** Current quiz mode state */
  isQuizMode?: boolean;
  
  /** Callback when quiz toggle is clicked */
  onQuizToggle?: () => void;
  
  /** Number of interactive tasks */
  interactiveTasksCount?: number;
  
  /** Number of quizzes */
  quizCount?: number;

  /** Jump into Smart Practice (Manual) */
  onOpenPractice?: () => void;
}

export function AppDSAHeader({
  currentProblem,
  lessonTitle,
  moduleTitle,
  showQuizToggle = false,
  isQuizMode = false,
  onQuizToggle,
  interactiveTasksCount = 0,
  quizCount = 0,
  onOpenPractice,
}: AppDSAHeaderProps) {
  const { colors } = useTheme();

  // Determine mode label
  const getModeLabel = () => {
    if (currentProblem) return '💻 Practice Mode';
    if (interactiveTasksCount === 0 && quizCount > 0) return '🧠 Interactive Quiz';
    if (isQuizMode) return '🧠 Quiz Mode';
    return '📚 Learning Mode';
  };

  return (
    <div
      className="border-b px-6 py-3 flex items-center justify-between"
      style={{
        backgroundColor: colors.backgroundElevated,
        borderColor: colors.border
      }}
    >
      {/* Left: Title and description */}
      <div className="flex items-center gap-3">
        {currentProblem ? (
          <>
            <Code className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium" style={{ color: colors.text }}>
                Problem: {currentProblem.title}
              </h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                Solve the coding challenge
              </p>
            </div>
          </>
        ) : (
          <>
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium" style={{ color: colors.text }}>
                {lessonTitle || moduleTitle}
              </h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                Interactive lesson with coding tasks
              </p>
            </div>
          </>
        )}
      </div>

      {/* Right: Controls and mode indicator */}
      <div className="flex items-center gap-3">
        {/* Practice CTA */}
        {onOpenPractice && (
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenPractice}
          >
            ⚡ Practice
          </Button>
        )}

        {/* Quiz toggle button */}
        {showQuizToggle && !currentProblem && interactiveTasksCount > 0 && quizCount > 0 && onQuizToggle && (
          <Button
            size="sm"
            variant={isQuizMode ? "default" : "outline"}
            onClick={onQuizToggle}
            className={isQuizMode ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {isQuizMode ? "📚 Back to Lesson" : "🧠 Take Quiz"}
          </Button>
        )}

        {/* Mode indicator */}
        <div className="text-sm text-slate-600">
          {getModeLabel()}
        </div>
      </div>
    </div>
  );
}