import { Box, Check, Lock, ChevronRight } from 'lucide-react';

// Simple utility for conditional classnames
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export interface CourseSidebarProps {
  currentModule?: {
    id: string;
    title: string;
    lessons: Array<{ id: string }>;
  };
  currentLesson?: {
    id: string;
    title: string;
    description?: string;
    learningObjectives?: string[];
  };
  selectedLesson: string;
  completedLessons: Set<string>;
  getModuleCompletionPercentage?: (moduleId: string) => number;
  canAccessLesson?: (lessonId: string, allLessons: Array<{ id: string; sequenceOrder: number }>) => boolean;
  onSelectLesson?: (moduleId: string, lessonId: string) => void;
}

/**
 * Reusable sidebar component for all course apps
 * Shows current module progress, lesson info, objectives, tips, and next lesson
 */
export function CourseSidebar({
  currentModule,
  currentLesson,
  selectedLesson,
  completedLessons,
  getModuleCompletionPercentage,
  canAccessLesson,
  onSelectLesson,
}: CourseSidebarProps) {
  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto">
      {/* Current Module Progress */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Current Module
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Box className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {currentModule?.title || 'Select a module'}
              </p>
              <p className="text-xs text-slate-500">
                {currentModule ? `${currentModule.lessons.filter(l => completedLessons.has(l.id)).length}/${currentModule.lessons.length} lessons` : 'No module selected'}
              </p>
            </div>
          </div>
          {currentModule && getModuleCompletionPercentage && (
            <div className="pt-2">
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${getModuleCompletionPercentage(currentModule.id)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Lesson Info */}
      {currentLesson && (
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            This Lesson
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-slate-900 mb-1">
                {currentLesson.title}
              </p>
              {currentLesson.description && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLesson.description}
                </p>
              )}
            </div>
            {completedLessons.has(selectedLesson) && (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  Completed
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Learning Objectives */}
      {currentLesson?.learningObjectives && currentLesson.learningObjectives.length > 0 && (
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            What You'll Learn
          </h3>
          <ul className="space-y-2">
            {currentLesson.learningObjectives.map((objective, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <span className="text-xs text-slate-700 leading-relaxed">
                  {objective}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Tips */}
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Pro Tips
        </h3>
        <div className="space-y-2">
          <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800 leading-relaxed">
              💡 Use the terminal on the right to practice commands as you learn
            </p>
          </div>
          {!completedLessons.has(selectedLesson) && (
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 leading-relaxed">
                🎯 Complete this lesson to unlock the next one
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Next Up */}
      {currentModule && currentLesson && canAccessLesson && onSelectLesson && (() => {
        const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === selectedLesson);
        const nextLesson = currentModule.lessons[currentLessonIndex + 1];

        if (nextLesson) {
          const allLessonsInModule = currentModule.lessons.map((l, idx) => ({
            id: l.id,
            sequenceOrder: idx
          }));
          const isNextAccessible = canAccessLesson(nextLesson.id, allLessonsInModule);

          return (
            <div className="p-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Next Up
              </h3>
              <button
                onClick={() => isNextAccessible && onSelectLesson(currentModule.id, nextLesson.id)}
                disabled={!isNextAccessible}
                className={cn(
                  'w-full text-left p-3 rounded-lg border transition-all',
                  isNextAccessible
                    ? 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                    : 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {isNextAccessible ? (
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="text-xs font-medium text-slate-900">
                    Next Lesson
                  </span>
                </div>
                {!isNextAccessible && (
                  <p className="text-xs text-slate-500 ml-6">
                    Complete current lesson first
                  </p>
                )}
              </button>
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
}
