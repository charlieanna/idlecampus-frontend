/**
 * Progressive Lesson Sidebar Navigation
 * Displays all sections (lessons and problems) from a progressive lesson
 * Works for Modules 0-14 with sequential unlock flow
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  Lock,
  BookOpen,
  Code,
  Target,
  Award,
  Brain
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import type { 
  ProgressiveLesson, 
  LessonSection,
  ProgressiveLessonProgress 
} from '../../types/progressive-lesson-enhanced';
import { isSectionUnlocked, calculateLessonProgress } from '../../types/progressive-lesson-enhanced';

interface ProgressiveLessonSidebarProps {
  lesson: ProgressiveLesson;
  progress: ProgressiveLessonProgress;
  currentSectionIndex: number;
  onSelectSection: (sectionIndex: number) => void;
}

export const ProgressiveLessonSidebar: React.FC<ProgressiveLessonSidebarProps> = ({
  lesson,
  progress,
  currentSectionIndex,
  onSelectSection
}) => {
  const { isDark, colors } = useTheme();

  const getSectionIcon = (section: LessonSection, sectionIndex: number) => {
    const sectionProgress = progress.sectionsProgress.get(section.id);
    const isCompleted = sectionProgress?.status === 'completed';
    const isCurrent = sectionIndex === currentSectionIndex;

    if (isCompleted) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }

    switch (section.type) {
      case 'reading':
        return <BookOpen className={`w-4 h-4 ${isCurrent ? 'text-blue-500' : 'text-gray-400'}`} />;
      case 'exercise':
        return <Code className={`w-4 h-4 ${isCurrent ? 'text-blue-500' : 'text-gray-400'}`} />;
      case 'quiz':
        return <Brain className={`w-4 h-4 ${isCurrent ? 'text-blue-500' : 'text-gray-400'}`} />;
      default:
        return <Circle className={`w-4 h-4 ${isCurrent ? 'text-blue-500' : 'text-gray-400'}`} />;
    }
  };

  const getSectionTypeLabel = (type: string): string => {
    switch (type) {
      case 'reading': return 'Reading';
      case 'exercise': return 'Exercise';
      case 'quiz': return 'Quiz';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const trackedSections = lesson.sections.filter(section => {
    if (section.type === 'exercise') {
      return !(section as any).isPracticeOnly;
    }
    return true;
  });
  const completedCount = trackedSections.filter(section => {
    const sectionProgress = progress.sectionsProgress.get(section.id);
    return sectionProgress?.status === 'completed';
  }).length;
  const totalCount = trackedSections.length;
  const overallProgress = calculateLessonProgress(lesson, progress);

  return (
    <div 
      className="h-full flex flex-col border-r"
      style={{ 
        backgroundColor: colors.backgroundElevated,
        borderColor: colors.border
      }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 border-b"
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-blue-500" />
          <h2 className="font-semibold text-sm">{lesson.title}</h2>
        </div>
        <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
          {completedCount} / {totalCount} completed
        </p>
        <Progress value={overallProgress} className="h-1.5" />
      </div>

      {/* Section List */}
      <ScrollArea className="flex-1">
        <div className="p-2 pb-32 space-y-1">
          {lesson.sections.map((section, index) => {
            const sectionProgress = progress.sectionsProgress.get(section.id);
            const isCompleted = sectionProgress?.status === 'completed';
            const isCurrent = index === currentSectionIndex;
            const isPracticeOnly = section.type === 'exercise' && (section as any).isPracticeOnly;

            return (
              <motion.button
                key={section.id}
                onClick={() => {
                  // Allow navigation to all sections
                  onSelectSection(index);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors ${
                  isCurrent
                    ? 'bg-blue-500 bg-opacity-10 border border-blue-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex-shrink-0">
                  {getSectionIcon(section, index)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-xs truncate" style={{
                    color: isCurrent ? colors.text : colors.text,
                    fontWeight: isCurrent ? 600 : 400
                  }}>
                    {index + 1}. {section.title}
                  </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <Badge 
                      variant="outline" 
                      className="text-[10px] px-1 py-0 h-4"
                    >
                      {getSectionTypeLabel(section.type)}
                    </Badge>
                    {section.type === 'exercise' && (section as any).difficulty && (
                      <Badge 
                        variant={
                          (section as any).difficulty === 'easy' ? 'default' :
                          (section as any).difficulty === 'medium' ? 'secondary' :
                          'destructive'
                        }
                        className="text-[10px] px-1 py-0 h-4"
                      >
                        {(section as any).difficulty}
                      </Badge>
                    )}
                      {isPracticeOnly && (
                        <Badge 
                          variant="secondary"
                          className="text-[10px] px-1 py-0 h-4 bg-purple-100 text-purple-700 border-purple-200"
                        >
                          Smart Practice
                        </Badge>
                      )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProgressiveLessonSidebar;