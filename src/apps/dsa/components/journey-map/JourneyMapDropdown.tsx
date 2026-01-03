/**
 * JourneyMapDropdown Component
 *
 * Converts the sidebar journey map into a compact dropdown menu.
 * Displays the full journey map when clicked, with the same functionality as the sidebar.
 *
 * Features:
 * - Compact button showing current module + XP info
 * - Click to expand into full dropdown panel
 * - Click outside or Escape to close
 * - Same navigation and section locking as sidebar
 */

import React from 'react';
import { ChevronDown, Trophy, Flame, RotateCcw } from 'lucide-react';
import { JourneyNode, type SectionInfo } from './JourneyNode';
import { JOURNEY_NODES, DIFFICULTY_PHASES, type JourneyNodeConfig } from './journeyMapConfig';
import { useGamificationStore } from '../../stores/gamificationStore';
import {
  isModuleUnlocked,
  getMissingPrerequisiteNames,
  isAlmostUnlocked as checkIsAlmostUnlocked
} from '../../utils/moduleChaining';
import type { DSACourse } from '../../types/dsa-course';
import type { ProgressiveLesson, ProgressiveLessonProgress, LessonSection } from '../../types/progressive-lesson-enhanced';

export interface JourneyMapDropdownProps {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    backgroundSecondary: string;
    backgroundElevated: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  currentModuleIndex: number;
  dsaCourse: DSACourse;
  progressiveLessonsMap: Record<string, ProgressiveLesson>;
  allProgressiveLessonProgress: Map<string, ProgressiveLessonProgress>;
  onModuleClick: (moduleIndex: number, moduleId: string) => void;
  onSectionClick?: (moduleId: string, sectionIndex: number) => void;
}

/**
 * XP Progress Header for dropdown button
 */
function CompactXPHeader({ currentModuleName }: { currentModuleName?: string }) {
  const { totalXP, currentLevel, currentStreak } = useGamificationStore();

  return (
    <div className="flex items-center gap-3">
      {/* Level Badge */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-100 rounded-lg">
        <Trophy className="w-3.5 h-3.5 text-indigo-600" />
        <span className="text-xs font-bold text-indigo-600">Lvl {currentLevel}</span>
      </div>

      {/* XP */}
      <span className="text-xs text-slate-600 font-medium">{totalXP.toLocaleString()} XP</span>

      {/* Streak */}
      {currentStreak > 0 && (
        <div className="flex items-center gap-1 text-orange-500">
          <Flame className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{currentStreak}d</span>
        </div>
      )}

      {/* Current Module */}
      {currentModuleName && (
        <>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500 truncate max-w-[150px]">{currentModuleName}</span>
        </>
      )}
    </div>
  );
}

/**
 * Full XP Progress Header for dropdown panel
 */
function FullXPHeader() {
  const { totalXP, currentLevel, currentStreak, getXPProgress } = useGamificationStore();
  const xpProgress = getXPProgress();

  return (
    <div className="p-4 space-y-3 bg-slate-50 border-b border-slate-200">
      {/* Title and Level */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-lg text-slate-800">DSA Mastery</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-100 rounded-full">
          <span className="text-indigo-600 text-sm font-semibold">Lvl {currentLevel}</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">XP Progress</span>
          <span className="text-slate-500">{xpProgress.current} / {xpProgress.required}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
            style={{ width: `${xpProgress.percentage}%` }}
          />
        </div>
        <div className="text-xs text-slate-400 text-center">{totalXP.toLocaleString()} total XP</div>
      </div>

      {/* Streak */}
      {currentStreak > 0 && (
        <div className="flex items-center justify-center gap-2 py-2 bg-orange-50 border border-orange-200 rounded-lg">
          <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
          <span className="text-orange-600 font-medium">{currentStreak} day streak!</span>
        </div>
      )}
    </div>
  );
}

export function JourneyMapDropdown({
  colors,
  currentModuleIndex,
  dsaCourse,
  progressiveLessonsMap,
  allProgressiveLessonProgress,
  onModuleClick,
  onSectionClick,
}: JourneyMapDropdownProps) {
  const { completedModules, moduleProgress, reset } = useGamificationStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedModules, setExpandedModules] = React.useState<Set<string>>(new Set());
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Get list of completed module IDs for unlock checks
  const completedModuleIds = React.useMemo(() => {
    const ids: string[] = [...completedModules];
    allProgressiveLessonProgress.forEach((progress, moduleId) => {
      const lesson = progressiveLessonsMap[moduleId];
      if (lesson) {
        const completedSections = Array.from(progress.sectionsProgress.values()).filter(
          sp => sp.status === 'completed'
        ).length;
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
  const isSectionUnlocked = (
    moduleId: string,
    sectionIndex: number,
    lessonProgress: ProgressiveLessonProgress | undefined,
    lesson: ProgressiveLesson
  ): boolean => {
    if (sectionIndex === 0) {
      return isModuleUnlocked(moduleId, completedModuleIds);
    }
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
    const currentModule = dsaCourse.modules[currentModuleIndex];
    const isCurrentModule = currentModule?.id === node.moduleId;

    return lesson.sections.map((section, idx): SectionInfo => {
      const sectionProgress = lessonProgress?.sectionsProgress.get(section.id);
      const isCompleted = sectionProgress?.status === 'completed';
      const isLocked = !isSectionUnlocked(node.moduleId, idx, lessonProgress, lesson);

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
    if (moduleProgress[node.id]) {
      return moduleProgress[node.id];
    }

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

  // Check if module is locked
  // In open access mode, all modules are unlocked
  const isModuleLocked = (node: JourneyNodeConfig): boolean => {
    return false; // All modules unlocked in open access mode
  };

  const handleReset = () => {
    if (window.confirm('Reset all progress? This will clear all completed modules, lessons, XP, and badges.')) {
      reset();
      localStorage.clear();
      window.location.reload();
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape key
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Get current module name for display
  const currentModule = dsaCourse.modules[currentModuleIndex];
  const currentModuleName = currentModule?.title;

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-3 px-4 py-2.5 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-all shadow-sm hover:shadow border border-slate-200"
      >
        <CompactXPHeader currentModuleName={currentModuleName} />
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Panel */}
          <div
            className="absolute left-0 top-full mt-3 w-[380px] bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl z-50"
          >
            {/* Header */}
            <FullXPHeader />

            {/* Content - Scrollable with explicit max-height */}
            <div
              className="overflow-y-auto p-4 space-y-3"
              style={{ maxHeight: 'calc(70vh - 180px)' }}
            >
              {JOURNEY_NODES.map(node => {
                const moduleIndex = dsaCourse.modules.findIndex(m => m.id === node.moduleId);
                const progress = getModuleProgress(node);
                const completed = isModuleCompleted(node);
                const active = isModuleActive(node);
                const locked = isModuleLocked(node);
                const sections = getSectionsForModule(node);

                // Get prerequisite info for locked modules
                const missingPrereqs = locked
                  ? getMissingPrerequisiteNames(node.moduleId, completedModuleIds)
                  : [];
                const almostUnlocked = locked
                  ? checkIsAlmostUnlocked(node.moduleId, completedModuleIds)
                  : false;

                return (
                  <JourneyNode
                    key={node.id}
                    node={node}
                    progress={progress}
                    isCompleted={completed}
                    isActive={active}
                    isLocked={locked}
                    isExpanded={expandedModules.has(node.id)}
                    sections={sections}
                    missingPrerequisites={missingPrereqs}
                    isAlmostUnlocked={almostUnlocked}
                    onToggleExpand={() => {
                      // For modules without sections (like Smart Practice), navigate directly
                      if (sections.length === 0 && moduleIndex !== -1 && !locked) {
                        onModuleClick(moduleIndex, node.moduleId);
                        setIsOpen(false);
                      } else {
                        toggleModuleExpand(node.id);
                      }
                    }}
                    onSectionClick={sectionIndex => {
                      if (moduleIndex !== -1 && onSectionClick) {
                        onSectionClick(node.moduleId, sectionIndex);
                        setIsOpen(false); // Close dropdown after selection
                      }
                    }}
                  />
                );
              })}
            </div>

            {/* Footer - Reset Button */}
            <div className="border-t p-4" style={{ borderColor: colors.border }}>
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Progress
              </button>
            </div>
          </div>

          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
          />
        </>
      )}
    </div>
  );
}

export default JourneyMapDropdown;
