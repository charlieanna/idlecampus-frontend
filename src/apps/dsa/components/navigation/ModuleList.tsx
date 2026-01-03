import React from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';
import { useNavigationStore } from '../../stores/navigationStore';
import { useLessonStore } from '../../stores/lessonStore';
import { useTheme } from '../../contexts/ThemeContext';
import { DSACourse, DSAProblem } from '../../types/dsa-course';
import { progressiveLessonsMap } from '../../data/allModuleLessons';

interface ModuleListProps {
  course: DSACourse;
  solvedProblems: Set<string>;
  problems: DSAProblem[];
  onModuleClick: (moduleIndex: number) => void;
  onLessonClick: (moduleIndex: number, lessonIndex: number) => void;
  onSectionClick: (moduleIndex: number, sectionIndex: number) => void;
}

export function ModuleList({
  course,
  solvedProblems,
  problems,
  onModuleClick,
  onLessonClick,
  onSectionClick
}: ModuleListProps) {
  const { colors } = useTheme();
  const { currentModuleIndex, currentLessonIndex, expandedModules, toggleModule } = useNavigationStore();
  const progress = useLessonStore(state => state.progress);

  const isModuleCompleted = (module: any, moduleIdx: number): boolean => {
    if (module.progressiveLesson) {
      // For progressive lessons, check if all sections are completed
      const progressiveLesson = progressiveLessonsMap[module.id];
      if (progressiveLesson && progress?.lessonId === progressiveLesson.id) {
        return progressiveLesson.sections.every(section => {
          const sectionProgress = progress.sectionsProgress.get(section.id);
          return sectionProgress?.status === 'completed';
        });
      }
      return false;
    } else if (module.lessons && module.lessons.length > 0) {
      // For regular modules, check if all lesson problems are solved
      return module.lessons.every((lesson: any) => {
        const lessonProblems = lesson.problems
          .map((id: string) => problems.find((p) => p.id === id))
          .filter(Boolean) as DSAProblem[];
        return lessonProblems.every((p) => solvedProblems.has(p.id));
      });
    }
    return false;
  };

  return (
    <div className="space-y-3">
      {course.modules.map((module, moduleIdx) => {
        const moduleCompleted = isModuleCompleted(module, moduleIdx);
        const isExpanded = expandedModules.has(moduleIdx);
        const isCurrent = moduleIdx === currentModuleIndex;

        // Special handling for smart-practice and practice-dashboard modules
        const isSpecialModule = module.id === 'smart-practice' || module.id === 'practice-dashboard';

        return (
          <div key={module.id}>
            {/* Module Header */}
            <button
              onClick={() => {
                if (isSpecialModule) {
                  onModuleClick(moduleIdx);
                } else {
                  // Toggle expansion and navigate
                  toggleModule(moduleIdx);
                  onModuleClick(moduleIdx);
                }
              }}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 group ${
                isCurrent
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20"
                  : isExpanded
                  ? "bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-600 dark:text-slate-400"
              }`}
            >
              <span className={`text-lg flex-shrink-0 transition-transform duration-200 ${
                isCurrent ? "scale-110" : "group-hover:scale-110"
              }`}>
                {module.icon}
              </span>
              <span className={`text-sm font-medium flex-1 ${isCurrent ? "text-white" : ""}`}>
                {module.title}
              </span>
              {moduleCompleted && (
                <CheckCircle className={`w-4 h-4 flex-shrink-0 mr-1 ${
                  isCurrent ? "text-blue-200" : "text-green-500"
                }`} />
              )}
              {!isSpecialModule && (
                <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                } ${isCurrent ? "text-blue-100" : "text-slate-400"}`} />
              )}
            </button>

            {/* Progressive Lesson Sections */}
            {!isSpecialModule && isExpanded && module.progressiveLesson && progressiveLessonsMap[module.id] && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-slate-200 dark:border-slate-700/50 pl-2">
                {progressiveLessonsMap[module.id].sections.map((section, idx) => {
                  const sectionProgress = progress?.sectionsProgress.get(section.id);
                  const isCompleted = sectionProgress?.status === 'completed';
                  const isSectionCurrent = progress?.currentSectionIndex === idx &&
                    progress?.lessonId === progressiveLessonsMap[module.id].id;

                  return (
                    <button
                      key={`nav-section-${module.id}-${section.id}`}
                      onClick={() => onSectionClick(moduleIdx, idx)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center gap-2 ${
                        isSectionCurrent
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium -ml-[10px] pl-[10px] border-l-2 border-blue-500"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                      }`}
                    >
                      <span className={`text-xs font-mono ${
                        isSectionCurrent ? "text-blue-500/70" : "text-slate-400"
                      } flex-shrink-0`}>
                        {idx + 1}.
                      </span>
                      <span className="flex-1 truncate">{section.title}</span>
                      {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Regular Lessons */}
            {!isSpecialModule && isExpanded && module.lessons && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-slate-200 dark:border-slate-700/50 pl-2">
                {module.lessons.map((lesson, lessonIdx) => {
                  const lessonProblems = lesson.problems
                    .map((id: string) => problems.find((p) => p.id === id))
                    .filter(Boolean) as DSAProblem[];
                  const lessonSolved = lessonProblems.filter((p) => solvedProblems.has(p.id)).length;
                  const isLessonSelected = moduleIdx === currentModuleIndex && lessonIdx === currentLessonIndex;
                  const isLessonCompleted = lessonProblems.every((p) => solvedProblems.has(p.id));

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onLessonClick(moduleIdx, lessonIdx)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center gap-2 ${
                        isLessonSelected
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium -ml-[10px] pl-[10px] border-l-2 border-blue-500"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                      }`}
                    >
                      <span className={`text-xs font-mono ${
                        isLessonSelected ? "text-blue-500/70" : "text-slate-400"
                      } flex-shrink-0`}>
                        {lessonIdx + 1}.
                      </span>
                      <span className="flex-1 truncate">{lesson.title}</span>
                      {lesson.quizzes && lesson.quizzes.length > 0 && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded flex-shrink-0">
                          🧠
                        </span>
                      )}
                      {isLessonSelected && (
                        <div className="text-xs text-slate-600 mt-1 pl-5">
                          {lessonSolved}/{lessonProblems.length} solved
                          {lesson.quizzes && lesson.quizzes.length > 0 && (
                            <span className="text-blue-600 ml-2">• {lesson.quizzes.length} quiz questions</span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}