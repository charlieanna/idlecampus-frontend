/**
 * ReadingOnlyLesson Component
 *
 * Renders the CURRENT reading section in full-screen mode (no code editor).
 * This provides a focused reading experience for theory/concept sections.
 *
 * **Key Features:**
 * - Shows only the current section based on progressiveLessonProgress.currentSectionIndex
 * - Full-screen reading content (no split panels)
 * - Supports quick quizzes embedded in reading sections
 * - "Mark Complete" button to advance to next section
 *
 * @example
 * ```tsx
 * <ReadingOnlyLesson
 *   progressiveLesson={lesson}
 *   colors={colors}
 *   progressiveLessonProgress={progress}
 *   setProgressiveLessonProgress={setProgress}
 * />
 * ```
 */

import React from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { CheckCircle2 } from 'lucide-react';
import type { ReadingOnlyLessonProps } from './types';
import type { ReadingSection } from '../../types/progressive-lesson-enhanced';
import { EnhancedReadingSection } from '../core/EnhancedReadingSection';

export function ReadingOnlyLesson({
  progressiveLesson,
  colors,
  progressiveLessonProgress,
  setProgressiveLessonProgress,
  readingQuizAnswers,
  setReadingQuizAnswers,
  currentModuleIndex,
  setCurrentModuleIndex,
  totalModules,
  runPythonCode,
}: ReadingOnlyLessonProps) {
  // Get current section
  const currentIndex = progressiveLessonProgress?.currentSectionIndex ?? 0;
  const safeIndex = Math.max(0, Math.min(currentIndex, progressiveLesson.sections.length - 1));
  const currentSection = progressiveLesson.sections[safeIndex];

  // Check if current section is completed
  const sectionProgress = progressiveLessonProgress?.sectionsProgress?.get(currentSection.id);
  const isCompleted = sectionProgress?.status === 'completed';

  // Handle marking section as complete
  const handleComplete = () => {
    // Safety check - ensure sectionsProgress exists
    if (!progressiveLessonProgress?.sectionsProgress) {
      return;
    }
    const newSectionsProgress = new Map(progressiveLessonProgress.sectionsProgress);

    // Mark current section as completed
    newSectionsProgress.set(currentSection.id, {
      sectionId: currentSection.id,
      status: 'completed',
      attempts: sectionProgress?.attempts || 0,
      timeSpent: sectionProgress?.timeSpent || 0,
      completedAt: new Date().toISOString(),
    });

    // Unlock the next section if it exists
    const nextIndex = safeIndex + 1;

    if (nextIndex < progressiveLesson.sections.length) {
      const nextSection = progressiveLesson.sections[nextIndex];
      const nextSectionProgress = newSectionsProgress.get(nextSection.id);

      // Only unlock if not already unlocked or completed
      if (!nextSectionProgress || nextSectionProgress.status === 'locked') {
        newSectionsProgress.set(nextSection.id, {
          sectionId: nextSection.id,
          status: 'unlocked',
          attempts: 0,
          timeSpent: 0,
        });
      }

      // Navigate to next section
      setProgressiveLessonProgress({
        ...progressiveLessonProgress,
        sectionsProgress: newSectionsProgress,
        currentSectionIndex: nextIndex,
      });
    } else {
      // Last section - mark as complete and navigate to next module
      setProgressiveLessonProgress({
        ...progressiveLessonProgress,
        sectionsProgress: newSectionsProgress,
      });

      // Navigate to next module if available
      if (setCurrentModuleIndex && currentModuleIndex !== undefined && totalModules !== undefined) {
        const nextModuleIndex = currentModuleIndex + 1;
        if (nextModuleIndex < totalModules) {
          setCurrentModuleIndex(nextModuleIndex);
        }
      }
    }
  };

  // Render reading section content
  const renderReadingContent = () => {
    if (currentSection.type !== 'reading' && currentSection.type !== 'checkpoint') {
      return null;
    }

    const readingSection = currentSection as ReadingSection;

    return (
      <EnhancedReadingSection
        content={readingSection.content}
        isCompleted={isCompleted}
        onComplete={handleComplete}
        hasPracticeExercise={!!readingSection.practiceExercise}
        inlineExercises={readingSection.inlineExercises}
        runPythonCode={runPythonCode}
      />
    );
  };

  // Render checkpoint section
  const renderCheckpointContent = () => {
    if (currentSection.type !== 'checkpoint') return null;

    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentSection.title}</h2>
        <p className="text-gray-600 mb-8">
          You've completed this checkpoint! Continue to the next section.
        </p>
        {!isCompleted && (
          <Button onClick={handleComplete} size="lg">
            Continue to Next Section
          </Button>
        )}
      </div>
    );
  };

  return (
    <ScrollArea className="flex-1 h-full" data-scroll-region="main-content">
      <div className="max-w-4xl mx-auto p-8 pb-24">
        {currentSection.type === 'checkpoint' ? (
          renderCheckpointContent()
        ) : (
          renderReadingContent()
        )}
      </div>
    </ScrollArea>
  );
}

export default ReadingOnlyLesson;