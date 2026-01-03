import React from "react";
import {
  BookOpen,
  Code,
  HelpCircle,
  Trophy,
  CheckCircle,
  Lock,
  ChevronRight,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import type { DSACourse, DSAModule } from "../../types/dsa-course";
import type {
  ProgressiveLessonProgress,
  ProgressiveLesson,
  LessonSection,
} from "../../types/progressive-lesson-enhanced";
import { isSectionUnlocked } from "../../types/progressive-lesson-enhanced";

/**
 * Props interface for ModuleLessonSidebar component
 */
export interface ModuleLessonSidebarProps {
  // Theme colors
  colors: {
    background: string;
    backgroundSecondary: string;
    backgroundElevated: string;
    border: string;
    text: string;
    textSecondary: string;
  };

  // Current module context
  currentModule: DSAModule;
  currentModuleIndex: number;
  currentLessonIndex: number;

  // Progressive lesson state
  isProgressiveLesson: boolean;
  progressiveLesson: ProgressiveLesson | null;
  progressiveLessonProgress: ProgressiveLessonProgress;

  // Navigation callbacks
  onSectionClick: (sectionIndex: number) => void;
  onLessonClick: (lessonIndex: number) => void;

  // Solved problems tracking (for regular lessons)
  solvedProblems: Set<string>;
  dsaProblems: any[];
}

/**
 * ModuleLessonSidebar Component
 *
 * A dedicated sidebar that shows lessons/sections for the current module only.
 * This allows users to easily navigate between lessons within a module.
 *
 * Features:
 * - Shows all lessons/sections for the current module
 * - Highlights the currently active lesson/section
 * - Shows completion status for each lesson/section
 * - Supports both progressive lessons (sections) and regular lessons
 */
export function ModuleLessonSidebar({
  colors,
  currentModule,
  currentModuleIndex,
  currentLessonIndex,
  isProgressiveLesson,
  progressiveLesson,
  progressiveLessonProgress,
  onSectionClick,
  onLessonClick,
  solvedProblems,
  dsaProblems,
}: ModuleLessonSidebarProps) {
  const getSectionIcon = (section: LessonSection) => {
    switch (section.type) {
      case "reading":
        return <BookOpen className="w-4 h-4" />;
      case "exercise":
        return <Code className="w-4 h-4" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4" />;
      case "checkpoint":
        return <Trophy className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getSectionStatus = (section: LessonSection, sectionIndex: number) => {
    if (!progressiveLesson || !progressiveLessonProgress) {
      return { isUnlocked: false, isCompleted: false, isCurrent: false };
    }

    const sectionProgress = progressiveLessonProgress.sectionsProgress.get(
      section.id
    );
    const isUnlocked = isSectionUnlocked(
      section,
      sectionIndex,
      progressiveLessonProgress,
      progressiveLesson
    );
    const isCompleted = sectionProgress?.status === "completed";
    const isCurrent =
      progressiveLessonProgress.currentSectionIndex === sectionIndex &&
      progressiveLessonProgress.lessonId === progressiveLesson.id;

    return { isUnlocked, isCompleted, isCurrent };
  };

  return (
    <div
      className="w-[280px] h-full border-r flex flex-col flex-shrink-0"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
      }}
    >
      {/* Header */}
      <div
        className="p-4 border-b"
        style={{
          backgroundColor: colors.backgroundElevated,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{currentModule.icon}</span>
          <h3
            className="text-sm font-semibold truncate"
            style={{ color: colors.text }}
          >
            {currentModule.title}
          </h3>
        </div>
        <p
          className="text-xs truncate"
          style={{ color: colors.textSecondary }}
        >
          {isProgressiveLesson
            ? `${progressiveLesson?.sections.length || 0} sections`
            : `${currentModule.lessons?.length || 0} lessons`}
        </p>
      </div>

      {/* Lessons/Sections List */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 pb-32 space-y-1">
            {isProgressiveLesson && progressiveLesson ? (
              // Progressive Lesson: Show sections
              progressiveLesson.sections.length > 0 ? (
                progressiveLesson.sections.map((section, sectionIndex) => {
                const { isUnlocked, isCompleted, isCurrent } =
                  getSectionStatus(section, sectionIndex);

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      if (isUnlocked) {
                        onSectionClick(sectionIndex);
                      }
                    }}
                    disabled={!isUnlocked}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2.5 group ${
                      isCurrent
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium border-l-2 border-blue-500"
                        : isUnlocked
                        ? "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        : "text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 ${
                        isCurrent
                          ? "text-blue-600 dark:text-blue-400"
                          : isUnlocked
                          ? "text-slate-500 dark:text-slate-400"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    >
                      {isUnlocked ? (
                        getSectionIcon(section)
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono flex-shrink-0 ${
                            isCurrent
                              ? "text-blue-500/70"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {sectionIndex + 1}.
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex-1 truncate">
                              {section.title}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            {section.title}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      {section.type === "exercise" && (
                        <div className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">
                          Exercise
                        </div>
                      )}
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                    {isCurrent && (
                      <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })
              ) : (
                <div className="text-center py-8 text-sm" style={{ color: colors.textSecondary }}>
                  No sections available
                </div>
              )
            ) : (
              // Regular Module: Show lessons
              currentModule.lessons && currentModule.lessons.length > 0 ? (
                currentModule.lessons.map((lesson, lessonIdx) => {
                const lessonProblems = lesson.problems
                  .map((id: string) =>
                    dsaProblems.find((p: any) => p.id === id)
                  )
                  .filter(Boolean);
                const lessonSolved = lessonProblems.filter((p: any) =>
                  solvedProblems.has(p.id)
                ).length;
                const totalProblems = lessonProblems.length;
                const isCompleted = lessonProblems.every((p: any) =>
                  solvedProblems.has(p.id)
                );
                const isSelected = lessonIdx === currentLessonIndex;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onLessonClick(lessonIdx)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-2.5 group ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium border-l-2 border-blue-500"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 ${
                        isSelected
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono flex-shrink-0 ${
                            isSelected
                              ? "text-blue-500/70"
                              : "text-slate-400 dark:text-slate-500"
                          }`}
                        >
                          {lessonIdx + 1}.
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex-1 truncate">
                              {lesson.title}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            {lesson.title}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      {totalProblems > 0 && (
                        <div className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">
                          {lessonSolved}/{totalProblems} problems
                        </div>
                      )}
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                    {isSelected && (
                      <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })
              ) : (
                <div className="text-center py-8 text-sm" style={{ color: colors.textSecondary }}>
                  No lessons available
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

