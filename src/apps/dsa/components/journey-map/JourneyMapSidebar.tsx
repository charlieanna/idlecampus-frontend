/**
 * JourneyMapSidebar Component
 *
 * The main navigation sidebar that displays the DSA Mastery Journey.
 * Replaces the traditional AppDSASidebar with a visual journey map.
 *
 * Features:
 * - XP progress bar and level display
 * - Streak indicator
 * - Visual journey through all 17 modules
 * - Progress rings on each module node
 * - Click module to expand/collapse sections
 * - Click section to navigate (if unlocked)
 * - Strict sequential progression - sections and modules locked until previous is complete
 */

import React from 'react';
import { Flame, Trophy, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { JourneyNode, type SectionInfo } from './JourneyNode';
import { JOURNEY_NODES, DIFFICULTY_PHASES, type JourneyNodeConfig } from './journeyMapConfig';
import { useGamificationStore } from '../../stores/gamificationStore';
import {
  isModuleUnlocked,
  getModuleChainIndex,
  getMissingPrerequisiteNames,
  isAlmostUnlocked as checkIsAlmostUnlocked
} from '../../utils/moduleChaining';
import type { DSACourse } from '../../types/dsa-course';
import type { ProgressiveLesson, ProgressiveLessonProgress, LessonSection } from '../../types/progressive-lesson-enhanced';

export interface JourneyMapSidebarProps {
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
  dsaCourse: DSACourse;

  // Progressive lessons map
  progressiveLessonsMap: Record<string, ProgressiveLesson>;

  // Progress state for all progressive lessons
  allProgressiveLessonProgress: Map<string, ProgressiveLessonProgress>;

  // Navigation callbacks
  onModuleClick: (moduleIndex: number, moduleId: string) => void;
  onSectionClick?: (moduleId: string, sectionIndex: number) => void;
}

/**
 * XP Progress Header Component
 */
function XPProgressHeader() {
  const {
    totalXP,
    currentLevel,
    currentStreak,
    getXPProgress,
  } = useGamificationStore();

  const xpProgress = getXPProgress();

  return (
    <div className="p-4 space-y-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Title and Level */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="font-bold text-lg">DSA Mastery</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
          <span className="text-yellow-400 text-sm font-medium">Lvl {currentLevel}</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-300">XP Progress</span>
          <span className="text-slate-300">{xpProgress.current} / {xpProgress.required}</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
            style={{ width: `${xpProgress.percentage}%` }}
          />
        </div>
        <div className="text-xs text-slate-400 text-center">
          {totalXP.toLocaleString()} total XP
        </div>
      </div>

      {/* Streak */}
      {currentStreak > 0 && (
        <div className="flex items-center justify-center gap-2 py-2 bg-orange-500/20 rounded-lg">
          <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
          <span className="text-orange-300 font-medium">{currentStreak} day streak!</span>
        </div>
      )}
    </div>
  );
}

/**
 * Phase divider component
 */
function PhaseDivider({ difficulty }: { difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' }) {
  const phase = DIFFICULTY_PHASES[difficulty];
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 ${phase.bgColor} rounded-lg border ${phase.borderColor}`}>
      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${phase.color}`} />
      <span className={`text-xs font-medium ${phase.textColor}`}>{phase.label}</span>
    </div>
  );
}

export function JourneyMapSidebar({
  colors,
  currentModuleIndex,
  dsaCourse,
  progressiveLessonsMap,
  allProgressiveLessonProgress,
  onModuleClick,
  onSectionClick,
}: JourneyMapSidebarProps) {
  const { completedModules, moduleProgress, reset } = useGamificationStore();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [expandedModules, setExpandedModules] = React.useState<Set<string>>(new Set());

  // Get list of completed module IDs for unlock checks
  const completedModuleIds = React.useMemo(() => {
    const ids: string[] = [...completedModules];
    // Also check allProgressiveLessonProgress for completed modules
    allProgressiveLessonProgress.forEach((progress, moduleId) => {
      const lesson = progressiveLessonsMap[moduleId];
      if (lesson) {
        const completedSections = Array.from(progress.sectionsProgress.values())
          .filter(sp => sp.status === 'completed').length;
        if (completedSections >= lesson.sections.length) {
          if (!ids.includes(moduleId)) ids.push(moduleId);
        }
      }
    });
    return ids;
  }, [completedModules, allProgressiveLessonProgress, progressiveLessonsMap]);

  // Toggle module expansion
  const toggleModuleExpand = (nodeId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Check if a section is unlocked
  // Section is unlocked if: (1) it's the first section AND module is unlocked, OR (2) previous section is completed
  const isSectionUnlocked = (
    moduleId: string,
    sectionIndex: number,
    lessonProgress: ProgressiveLessonProgress | undefined,
    lesson: ProgressiveLesson
  ): boolean => {
    // First section is unlocked if module is unlocked
    if (sectionIndex === 0) {
      return isModuleUnlocked(moduleId, completedModuleIds);
    }

    // Previous section must be completed
    if (!lessonProgress) return false;
    const prevSection = lesson.sections[sectionIndex - 1];
    const prevProgress = lessonProgress.sectionsProgress.get(prevSection.id);
    return prevProgress?.status === 'completed';
  };

  // Get section info for a module
  const getSectionsForModule = (node: JourneyNodeConfig): SectionInfo[] => {
    const lesson = progressiveLessonsMap[node.moduleId];
    if (!lesson) return [];

    const lessonProgress = allProgressiveLessonProgress.get(node.moduleId);
    const moduleUnlocked = isModuleUnlocked(node.moduleId, completedModuleIds);
    const currentModule = dsaCourse.modules[currentModuleIndex];
    const isCurrentModule = currentModule?.id === node.moduleId;

    return lesson.sections.map((section, idx): SectionInfo => {
      const sectionProgress = lessonProgress?.sectionsProgress.get(section.id);
      const isCompleted = sectionProgress?.status === 'completed';
      const isLocked = !isSectionUnlocked(node.moduleId, idx, lessonProgress, lesson);

      // Determine if this is the current section
      const isCurrent = isCurrentModule && !isLocked && !isCompleted &&
        (idx === 0 || lesson.sections.slice(0, idx).every((s, i) => {
          const sp = lessonProgress?.sectionsProgress.get(s.id);
          return sp?.status === 'completed';
        }));

      return {
        id: section.id,
        title: section.title,
        type: section.type as SectionInfo['type'],
        isLocked,
        isCompleted,
        isCurrent,
      };
    });
  };

  // Calculate progress for each module
  const getModuleProgress = (node: JourneyNodeConfig): number => {
    // Check gamification store first
    if (moduleProgress[node.id]) {
      return moduleProgress[node.id];
    }

    // Check progressive lesson progress
    const lessonProgress = allProgressiveLessonProgress.get(node.moduleId);
    if (lessonProgress) {
      const progressiveLesson = progressiveLessonsMap[node.moduleId];
      if (progressiveLesson) {
        const completedSections = Array.from(lessonProgress.sectionsProgress.values())
          .filter(sp => sp.status === 'completed').length;
        return (completedSections / progressiveLesson.sections.length) * 100;
      }
    }

    return 0;
  };

  // Check if module is completed
  const isModuleCompleted = (node: JourneyNodeConfig): boolean => {
    if (completedModules.includes(node.id) || completedModules.includes(node.moduleId)) {
      return true;
    }

    const progress = getModuleProgress(node);
    return progress >= 100;
  };

  // Check if module is currently active
  const isModuleActive = (node: JourneyNodeConfig): boolean => {
    const currentModule = dsaCourse.modules[currentModuleIndex];
    return currentModule?.id === node.moduleId;
  };

  // Check if module is locked (based on sequential progression)
  // In open access mode, all modules are unlocked
  const isModuleLocked = (node: JourneyNodeConfig): boolean => {
    return false; // All modules unlocked in open access mode
  };

  // Find module index in dsaCourse by moduleId
  const findModuleIndex = (moduleId: string): number => {
    return dsaCourse.modules.findIndex(m => m.id === moduleId);
  };

  // Group nodes by difficulty for phase dividers
  let currentPhase: string | null = null;

  const handleReset = () => {
    if (window.confirm('Reset all progress? This will clear all completed modules, lessons, XP, and badges.')) {
      reset();
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div
      className="w-[320px] h-full border-r flex flex-col flex-shrink-0"
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border
      }}
    >
      {/* XP Progress Header */}
      <XPProgressHeader />

      {/* Journey Map Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Learning Journey
        </span>
        {isCollapsed ? (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {/* Journey Map Content */}
      {!isCollapsed && (
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-3 space-y-2 pb-24">
              {JOURNEY_NODES.map((node, idx) => {
                const showPhaseDivider = node.difficulty !== currentPhase;
                currentPhase = node.difficulty;

                const moduleIndex = findModuleIndex(node.moduleId);
                const progress = getModuleProgress(node);
                const completed = isModuleCompleted(node);
                const active = isModuleActive(node);
                const locked = isModuleLocked(node);

                // Get prerequisite info for locked modules
                const missingPrereqs = locked
                  ? getMissingPrerequisiteNames(node.moduleId, completedModuleIds)
                  : [];
                const almostUnlocked = locked
                  ? checkIsAlmostUnlocked(node.moduleId, completedModuleIds)
                  : false;

                return (
                  <React.Fragment key={node.id}>
                    {showPhaseDivider && (
                      <div className="pt-2 pb-1">
                        <PhaseDivider difficulty={node.difficulty} />
                      </div>
                    )}
                    <JourneyNode
                      node={node}
                      progress={progress}
                      isCompleted={completed}
                      isActive={active}
                      isLocked={locked}
                      isExpanded={expandedModules.has(node.id)}
                      sections={getSectionsForModule(node)}
                      missingPrerequisites={missingPrereqs}
                      isAlmostUnlocked={almostUnlocked}
                      onToggleExpand={() => toggleModuleExpand(node.id)}
                      onSectionClick={(sectionIndex) => {
                        // Navigate to section if module exists and section callback provided
                        if (moduleIndex !== -1 && onSectionClick) {
                          onSectionClick(node.moduleId, sectionIndex);
                        } else if (moduleIndex !== -1) {
                          // Fallback to module navigation
                          onModuleClick(moduleIndex, node.moduleId);
                        }
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Footer with Reset */}
      <div
        className="p-3 border-t"
        style={{ borderColor: colors.border }}
      >
        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          className="w-full text-xs text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-300"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset Progress
        </Button>
      </div>
    </div>
  );
}

export default JourneyMapSidebar;
