import React from "react";
import {
  Code2,
  Trophy,
  CheckCircle,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import type { DSAProblem, DSACourse } from "../../types/dsa-course";
import type {
  ProgressiveLessonProgress,
  ProgressiveLesson,
} from "../../types/progressive-lesson-enhanced";
import { calculateLessonProgress } from "../../types/progressive-lesson-enhanced";

/**
 * Props interface for AppDSASidebar component
 */
export interface AppDSASidebarProps {
  // Theme colors
  colors: {
    background: string;
    backgroundSecondary: string;
    backgroundElevated: string;
    border: string;
    text: string;
    textSecondary: string;
  };

  // Current module/lesson context
  currentModuleIndex: number;
  currentLessonIndex: number;
  dsaCourse: DSACourse;

  // Progressive lesson state
  isProgressiveLesson: boolean;
  progressiveLesson: ProgressiveLesson | null;
  progressiveLessonProgress: ProgressiveLessonProgress;
  setProgressiveLessonProgress: React.Dispatch<React.SetStateAction<ProgressiveLessonProgress>>;

  // Progressive lessons map
  progressiveLessonsMap: Record<string, ProgressiveLesson>;

  // Solved problems tracking
  solvedProblems: Set<string>;
  dsaProblems: DSAProblem[];

  // UI state
  expandedModules: Set<number>;
  setExpandedModules: React.Dispatch<React.SetStateAction<Set<number>>>;

  // Navigation callbacks
  setCurrentModuleIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentLessonIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentTaskId: React.Dispatch<React.SetStateAction<string | null>>;
  setShowQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentQuizIndex: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPracticeModule: React.Dispatch<React.SetStateAction<number>>;
  setCurrentProblemId: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentView: React.Dispatch<React.SetStateAction<"dashboard" | "lesson" | "problem" | "playground" | "progressive-lesson" | "enhanced-reading" | "complexity-analysis" | "mastery-dashboard" | "adaptive-stream">>;
}

/**
 * AppDSASidebar Component
 * 
 * Renders the always-visible sidebar navigation for the DSA Course application.
 * 
 * Features:
 * - Course title and reset progress button
 * - Progress stats display (different for progressive lessons vs regular modules)
 * - Module/lesson navigation with expand/collapse functionality
 * - Progressive lesson section navigation
 * - Completion indicators for modules, lessons, and sections
 * 
 * View Modes:
 * 1. Progressive Lesson: Shows section-based progress with sequential unlocking
 * 2. Module 0 (Time Complexity): Foundation module indicator
 * 3. Regular Lessons: Shows problem-based progress
 */
export function AppDSASidebar({
  colors,
  currentModuleIndex,
  currentLessonIndex,
  dsaCourse,
  isProgressiveLesson,
  progressiveLesson,
  progressiveLessonProgress,
  setProgressiveLessonProgress,
  progressiveLessonsMap,
  solvedProblems,
  dsaProblems,
  expandedModules,
  setExpandedModules,
  setCurrentModuleIndex,
  setCurrentLessonIndex,
  setCurrentTaskId,
  setShowQuiz,
  setCurrentQuizIndex,
  setCurrentPracticeModule,
  setCurrentProblemId,
  setCurrentView,
}: AppDSASidebarProps) {
  const currentModule = dsaCourse.modules[currentModuleIndex];
  const isModule0 = currentModule.id === 'time-complexity-foundations';
  const currentLesson = isProgressiveLesson ? null : currentModule.lessons[currentLessonIndex];

  // Calculate lesson progress for non-progressive lessons
  const lessonProblems = (currentLesson?.problems || [])
    .map((id) => dsaProblems.find((p) => p.id === id))
    .filter(Boolean) as DSAProblem[];
  const solvedInLesson = lessonProblems.filter((p) => solvedProblems.has(p.id)).length;
  const totalProblems = lessonProblems.length;

  return (
    <div
      className="w-[350px] h-full border-r flex flex-col flex-shrink-0"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border
      }}
    >
      {/* Header - Course Title and Reset Button */}
      <div
        className="p-4 border-b"
        style={{
          backgroundColor: colors.backgroundElevated,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Code2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-blue-600">DSA Course</h2>
            <p className="text-xs text-slate-600">
              Data Structures & Algorithms
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (window.confirm('Reset all progress? This will clear all completed modules, lessons, and problems.')) {
              // Clear all localStorage
              localStorage.clear();
              // Reload page to reset state
              window.location.reload();
            }
          }}
          className="w-full text-xs text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-300"
          title="Reset all progress"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset All Progress
        </Button>
      </div>

      {/* Mastery Dashboard Link */}
      <div className="px-4 pt-4 pb-2 space-y-2">
        <Button
          variant="ghost"
          onClick={() => setCurrentView('mastery-dashboard')}
          className="w-full justify-start gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border border-purple-200/50 text-purple-700 dark:text-purple-300"
        >
          <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          Mastery Dashboard
        </Button>

        <Button
          variant="ghost"
          onClick={() => setCurrentView('adaptive-stream' as any)}
          className="w-full justify-start gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 border border-green-200/50 text-green-700 dark:text-green-300"
        >
          <RotateCcw className="w-4 h-4 text-green-600 dark:text-green-400" />
          L5 Adaptive Stream
        </Button>
      </div>

      {/* Progress Stats - Different views for progressive lessons, Module 0, and regular lessons */}
      {isProgressiveLesson && progressiveLesson ? (
        <div
          className="px-4 py-3 border-b"
          style={{
            backgroundColor: colors.backgroundElevated,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: colors.textSecondary }}>Progress</span>
            <Trophy className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-sm mb-2" style={{ color: colors.text }}>
            {Array.from(progressiveLessonProgress.sectionsProgress.values()).filter(sp => sp.status === 'completed').length} / {progressiveLesson.sections.length} sections
          </div>
          <Progress
            value={calculateLessonProgress(progressiveLesson, progressiveLessonProgress)}
            className="h-2"
          />
        </div>
      ) : isModule0 ? (
        <div className="px-4 py-3 border-b bg-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⏱️</span>
            <span className="text-sm font-semibold text-blue-900">Foundation Module</span>
          </div>
          <p className="text-xs text-blue-700">
            Learn time complexity fundamentals before diving into DSA patterns
          </p>
        </div>
      ) : (
        <div
          className="px-4 py-3 border-b"
          style={{
            backgroundColor: colors.backgroundElevated,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: colors.textSecondary }}>Progress</span>
            <Trophy className="w-4 h-4 text-yellow-600" />
          </div>
          <div className="text-sm mb-2" style={{ color: colors.text }}>
            {solvedInLesson} / {totalProblems} in current lesson
          </div>
          <Progress
            value={(solvedInLesson / totalProblems) * 100}
            className="h-2"
          />
        </div>
      )}

      {/* Module/Lesson Navigation */}
      <div className="flex-1 min-h-0 overflow-hidden backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-r border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <ScrollArea className="h-full" data-scroll-region="sidebar">
          <div className="p-4 space-y-3 pb-32">
            {/* Modules */}
            {dsaCourse.modules.map((module, moduleIdx) => {
              // Check if module is completed
              let moduleCompleted = false;

              if ((module as any).progressiveLesson) {
                // For progressive lessons, check if all sections are completed
                const progressiveLesson = progressiveLessonsMap[module.id];
                if (progressiveLesson && progressiveLessonProgress.lessonId === progressiveLesson.id) {
                  const allSectionsCompleted = progressiveLesson.sections.every(section => {
                    const sectionProgress = progressiveLessonProgress.sectionsProgress.get(section.id);
                    return sectionProgress?.status === 'completed';
                  });
                  moduleCompleted = allSectionsCompleted;
                }
              } else if (module.lessons && module.lessons.length > 0) {
                // For regular modules, check if all lesson problems are solved
                moduleCompleted = module.lessons.every((lesson) => {
                  const lessonProblemsList = lesson.problems
                    .map((id) => dsaProblems.find((p) => p.id === id))
                    .filter(Boolean) as DSAProblem[];
                  return lessonProblemsList.every((p) => solvedProblems.has(p.id));
                });
              }

              const isExpanded = expandedModules.has(moduleIdx);

              return (
                <div key={module.id}>
                  {/* Module Header - Different click handlers for practice vs lesson modules */}
                  {module.id === 'smart-practice' || module.id === 'practice-dashboard' ? (
                    <button
                      onClick={() => {
                        setCurrentModuleIndex(moduleIdx);
                        setCurrentLessonIndex(0);
                        setCurrentTaskId(null);
                        setShowQuiz(false);
                        setCurrentQuizIndex(0);

                        // Start Smart Practice at Module 0.5 (Python Basics) if smart-practice
                        if (module.id === 'smart-practice') {
                          setCurrentPracticeModule(0.5);
                        }
                        setCurrentProblemId(null);
                      }}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 group ${moduleIdx === currentModuleIndex
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      <span className={`text-lg flex-shrink-0 transition-transform duration-200 ${moduleIdx === currentModuleIndex ? "scale-110" : "group-hover:scale-110"}`}>
                        {module.icon}
                      </span>
                      <span className={`text-sm font-medium ${moduleIdx === currentModuleIndex ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>
                        {module.title}
                      </span>
                      {moduleCompleted && <CheckCircle className={`w-4 h-4 ml-auto flex-shrink-0 ${moduleIdx === currentModuleIndex ? "text-blue-200" : "text-green-500"}`} />}
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        // Toggle module expansion and always add to expanded set when navigating
                        setExpandedModules(prev => {
                          const newSet = new Set(prev);
                          // If already expanded and it's the current module, collapse it
                          if (newSet.has(moduleIdx) && moduleIdx === currentModuleIndex) {
                            newSet.delete(moduleIdx);
                          } else {
                            // Otherwise, expand it (whether it's a new module or collapsed current module)
                            newSet.add(moduleIdx);
                          }
                          return newSet;
                        });

                        // Navigate to module (always navigate when clicking)
                        setCurrentModuleIndex(moduleIdx);
                        setCurrentLessonIndex(0);
                        setCurrentTaskId(null);
                        setShowQuiz(false);
                        setCurrentQuizIndex(0);
                      }}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 group ${moduleIdx === currentModuleIndex
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20"
                        : isExpanded
                          ? "bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      <span className={`text-lg flex-shrink-0 transition-transform duration-200 ${moduleIdx === currentModuleIndex ? "scale-110" : "group-hover:scale-110"}`}>
                        {module.icon}
                      </span>
                      <span className={`text-sm font-medium flex-1 ${moduleIdx === currentModuleIndex ? "text-white" : ""}`}>
                        {module.title}
                      </span>
                      {moduleCompleted && <CheckCircle className={`w-4 h-4 flex-shrink-0 mr-1 ${moduleIdx === currentModuleIndex ? "text-blue-200" : "text-green-500"}`} />}
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${moduleIdx === currentModuleIndex ? "text-blue-100" : "text-slate-400"}`} />
                    </button>
                  )}

                  {/* Progressive Lesson Sections - Show if this is a progressive module AND it's expanded AND exists in map */}
                  {(() => {
                    const hasProgressiveLesson = !!(module as any).progressiveLesson;
                    const existsInMap = !!progressiveLessonsMap[module.id];

                    if (!hasProgressiveLesson || !isExpanded || !existsInMap) {
                      return null;
                    }

                    const progressiveLesson = progressiveLessonsMap[module.id];
                    if (!progressiveLesson) return null; // Extra safety check

                    return (
                      <div className="ml-6 mt-2 space-y-1 border-l-2 border-slate-200 dark:border-slate-700/50 pl-2">
                        {progressiveLesson.sections.map((section, idx) => {
                          const sectionProgress = progressiveLessonProgress.sectionsProgress.get(section.id);
                          const isCompleted = sectionProgress?.status === 'completed';
                          const isCurrent = progressiveLessonProgress.currentSectionIndex === idx &&
                            progressiveLessonProgress.lessonId === progressiveLesson.id;

                          return (
                            <button
                              key={`nav-section-${progressiveLesson.id}-${section.id}`}
                              onClick={() => {
                                // Navigate to this module if not already there
                                if (moduleIdx !== currentModuleIndex) {
                                  setCurrentModuleIndex(moduleIdx);
                                  setCurrentLessonIndex(0);
                                  setCurrentTaskId(null);
                                  setShowQuiz(false);
                                  setCurrentQuizIndex(0);
                                }
                                // Update section index
                                setProgressiveLessonProgress(prev => ({
                                  ...prev,
                                  currentSectionIndex: idx
                                }));
                              }}
                              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center gap-2 ${isCurrent
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium -ml-[10px] pl-[10px] border-l-2 border-blue-500"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                                }`}
                            >
                              <span className={`text-xs font-mono ${isCurrent ? "text-blue-500/70" : "text-slate-400"} flex-shrink-0`}>{idx + 1}.</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex-1 truncate">{section.title}</span>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="max-w-xs">
                                  {section.title}
                                </TooltipContent>
                              </Tooltip>
                              {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Lessons - Indented - Show only if expanded */}
                  {isExpanded && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-slate-200 dark:border-slate-700/50 pl-2">
                      {module.lessons && module.lessons.map((lesson, lessonIdx) => {
                        const lessonProblemsList = lesson.problems
                          .map((id) =>
                            dsaProblems.find((p) => p.id === id),
                          )
                          .filter(Boolean) as DSAProblem[];
                        const lessonSolved =
                          lessonProblemsList.filter((p) =>
                            solvedProblems.has(p.id),
                          ).length;
                        const isSelected =
                          moduleIdx === currentModuleIndex &&
                          lessonIdx === currentLessonIndex;
                        const isCompleted = lessonProblemsList.every((p) => solvedProblems.has(p.id));

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setCurrentModuleIndex(moduleIdx);
                              setCurrentLessonIndex(lessonIdx);
                              setCurrentTaskId(null);
                              setCurrentProblemId(null);
                              setShowQuiz(false);
                              setCurrentQuizIndex(0);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center gap-2 ${isSelected
                              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium -ml-[10px] pl-[10px] border-l-2 border-blue-500"
                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                              }`}
                          >
                            <span className={`text-xs font-mono ${isSelected ? "text-blue-500/70" : "text-slate-400"} flex-shrink-0`}>{lessonIdx + 1}.</span>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex-1 truncate">{lesson.title}</span>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                {lesson.title}
                              </TooltipContent>
                            </Tooltip>
                            {lesson.quizzes && lesson.quizzes.length > 0 && (
                              <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded flex-shrink-0">
                                🧠
                              </span>
                            )}
                            {isSelected && (
                              <div className="text-xs text-slate-600 mt-1 pl-5">
                                {lessonSolved}/{lessonProblemsList.length} solved
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
        </ScrollArea>
      </div>
    </div>
  );
}