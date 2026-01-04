/**
 * ModuleDashboard Component
 *
 * A full-page grid layout showing all modules with progress indicators.
 * Replaces the JourneyMapDropdown with a more visual dashboard view.
 *
 * Features:
 * - Grid of module cards grouped by difficulty phase
 * - Progress indicators showing completion percentage
 * - XP, Level, and Streak display in header
 * - Responsive layout (4 cols desktop, 2 tablet, 1 mobile)
 */

import React from 'react';
import { CheckCircle, Trophy, Flame, RotateCcw, Play, BookOpen } from 'lucide-react';
import { JOURNEY_NODES, DIFFICULTY_PHASES, type JourneyNodeConfig } from './journeyMapConfig';
import { useGamificationStore } from '../../stores/gamificationStore';
import {
  isModuleUnlocked,
  getMissingPrerequisiteNames,
  isAlmostUnlocked as checkIsAlmostUnlocked
} from '../../utils/moduleChaining';
import type { DSACourse } from '../../types/dsa-course';
import type { ProgressiveLesson, ProgressiveLessonProgress } from '../../types/progressive-lesson-enhanced';
import { Button } from '../ui/button';

export interface ModuleDashboardProps {
  colors: {
    primary: string;
    background: string;
    backgroundSecondary: string;
    backgroundElevated: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  dsaCourse: DSACourse;
  progressiveLessonsMap: Record<string, ProgressiveLesson>;
  allProgressiveLessonProgress: Map<string, ProgressiveLessonProgress>;
  onModuleClick: (moduleIndex: number, moduleId: string) => void;
  onReset?: () => void;
  onOpenPractice?: () => void;
  onOpenMastery?: () => void;
}

type DashboardColors = ModuleDashboardProps['colors'];

function hexToRgba(hex: string, alpha: number) {
  const cleaned = hex.trim().replace('#', '');
  const isShort = cleaned.length === 3;
  const isFull = cleaned.length === 6;
  if (!isShort && !isFull) return `rgba(0,0,0,${alpha})`;

  const r = parseInt(isShort ? cleaned[0] + cleaned[0] : cleaned.slice(0, 2), 16);
  const g = parseInt(isShort ? cleaned[1] + cleaned[1] : cleaned.slice(2, 4), 16);
  const b = parseInt(isShort ? cleaned[2] + cleaned[2] : cleaned.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.trim().replace('#', '');
  const isShort = cleaned.length === 3;
  const isFull = cleaned.length === 6;
  if (!isShort && !isFull) return null;
  const r = parseInt(isShort ? cleaned[0] + cleaned[0] : cleaned.slice(0, 2), 16);
  const g = parseInt(isShort ? cleaned[1] + cleaned[1] : cleaned.slice(2, 4), 16);
  const b = parseInt(isShort ? cleaned[2] + cleaned[2] : cleaned.slice(4, 6), 16);
  return { r, g, b };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function pickReadableTextColor(bgHex: string) {
  const rgb = hexToRgb(bgHex);
  if (!rgb) return '#ffffff';
  return relativeLuminance(rgb) > 0.55 ? '#0f172a' : '#ffffff';
}

/**
 * Progress ring SVG component
 */
function ProgressRing({
  progress,
  size = 64,
  strokeWidth = 4,
  isCompleted,
  isActive,
  isLocked,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // Color based on state
  let strokeColor = 'stroke-slate-300 dark:stroke-slate-600';
  let bgColor = 'stroke-slate-100 dark:stroke-slate-800';

  if (isLocked) {
    strokeColor = 'stroke-slate-200 dark:stroke-slate-700';
  } else if (isCompleted) {
    strokeColor = 'stroke-emerald-500';
    bgColor = 'stroke-emerald-100 dark:stroke-emerald-900/30';
  } else if (isActive) {
    strokeColor = 'stroke-blue-500';
    bgColor = 'stroke-blue-100 dark:stroke-blue-900/30';
  } else if (progress > 0) {
    strokeColor = 'stroke-blue-400';
  }

  return (
    <svg
      width={size}
      height={size}
      className="transform -rotate-90"
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className={`${bgColor} transition-colors duration-300`}
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={`${strokeColor} transition-all duration-500 ease-out`}
      />
    </svg>
  );
}

/**
 * XP Progress Header for dashboard
 */
function DashboardHeader({
  colors,
  onReset,
  onOpenPractice,
  onOpenMastery,
}: {
  colors: DashboardColors;
  onReset?: () => void;
  onOpenPractice?: () => void;
  onOpenMastery?: () => void;
}) {
  const { totalXP, currentLevel, currentStreak, getXPProgress } = useGamificationStore();
  const xpProgress = getXPProgress();

  // Theme-safe header background
  const headerStart = colors.primary;
  const headerEnd = '#1d4ed8';
  const headerText = pickReadableTextColor(headerStart);
  const headerSubText = headerText === '#ffffff' ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.6)';

  return (
    <div className="mb-10 max-w-[1800px] mx-auto px-4">
      <div
        className="p-8 rounded-3xl shadow-xl relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${headerStart} 0%, ${headerEnd} 100%)`,
          color: headerText,
        }}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative z-10">
          {/* Top row: Title and Stats */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Title */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: headerText === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.1)' }}
              >
                <Trophy className="w-8 h-8" style={{ color: headerText === '#ffffff' ? '#fde047' : '#b45309' }} />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">DSA Mastery Journey</h1>
                <p className="text-sm mt-0.5" style={{ color: headerSubText }}>Complete modules to level up your skills</p>
              </div>
            </div>

            {/* Right: Stats row */}
            <div className="flex items-center gap-3 lg:gap-4 flex-wrap">
              {/* Practice Button */}
              {onOpenPractice && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onOpenPractice}
                  className="h-10 px-4 font-medium backdrop-blur-sm border transition-all hover:scale-105"
                  style={{
                    backgroundColor: headerText === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.08)',
                    color: headerText,
                    borderColor: headerText === '#ffffff' ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.15)',
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Practice
                </Button>
              )}

              {/* Stats Cards */}
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Level */}
                <div
                  className="px-4 py-2 rounded-xl text-center min-w-[70px]"
                  style={{ backgroundColor: headerText === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.08)' }}
                >
                  <div className="text-2xl font-bold">{currentLevel}</div>
                  <div className="text-[10px] uppercase tracking-wider font-medium" style={{ color: headerSubText }}>Level</div>
                </div>

                {/* XP */}
                <div
                  className="px-4 py-2 rounded-xl text-center min-w-[80px]"
                  style={{ backgroundColor: headerText === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.08)' }}
                >
                  <div className="text-2xl font-bold">{totalXP.toLocaleString()}</div>
                  <div className="text-[10px] uppercase tracking-wider font-medium" style={{ color: headerSubText }}>XP</div>
                </div>

                {/* Streak */}
                {currentStreak > 0 && (
                  <div
                    className="px-4 py-2 rounded-xl text-center min-w-[70px]"
                    style={{ backgroundColor: headerText === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.08)' }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Flame className="w-5 h-5" style={{ color: headerText === '#ffffff' ? '#fb923c' : '#ea580c' }} />
                      <span className="text-2xl font-bold">{currentStreak}</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-wider font-medium" style={{ color: headerSubText }}>Streak</div>
                  </div>
                )}

                {/* Reset Button */}
                {onReset && (
                  <button
                    onClick={onReset}
                    className="p-2.5 rounded-xl transition-all hover:scale-105"
                    style={{
                      backgroundColor: headerText === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.06)',
                    }}
                    title="Reset Progress"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs mb-2 font-medium" style={{ color: headerSubText }}>
              <span>Level {currentLevel} Progress</span>
              <span>{xpProgress.current} / {xpProgress.required} XP</span>
            </div>
            <div
              className="h-2.5 rounded-full overflow-hidden"
              style={{ backgroundColor: headerText === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.12)' }}
            >
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 transition-all duration-500 rounded-full"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual Module Card
 */
function ModuleCard({
  node,
  moduleIndex,
  colors,
  progress,
  isCompleted,
  isActive,
  isLocked,
  sectionsCompleted,
  totalSections,
  missingPrereqs,
  isAlmostUnlocked,
  onClick,
}: {
  node: JourneyNodeConfig;
  moduleIndex: number;
  colors: DashboardColors;
  progress: number;
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
  sectionsCompleted: number;
  totalSections: number;
  missingPrereqs: string[];
  isAlmostUnlocked: boolean;
  onClick: () => void;
}) {
  const phase = DIFFICULTY_PHASES[node.difficulty];

  const backgroundColor = colors.backgroundElevated || colors.backgroundSecondary || colors.background;

  const borderColor = (() => {
    if (isActive) return hexToRgba(colors.primary, 0.6);
    if (isCompleted) return hexToRgba('#10b981', 0.4);
    return colors.border;
  })();

  const cardContent = (
    <a
      href={`/dsa/module/${node.moduleId}`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`
        relative p-5 rounded-2xl block border-2
        transition-all duration-300 cursor-pointer
        hover:shadow-lg hover:-translate-y-1
        ${isActive ? 'ring-2 ring-offset-2' : ''}
        ${isCompleted ? 'ring-emerald-500/20' : 'ring-primary/20'}
      `}
      style={{
        backgroundColor,
        backgroundImage: `linear-gradient(to right, ${backgroundColor}, transparent)`,
        borderColor,
        textDecoration: 'none',
      }}
    >
      {/* Completed overlay shimmer */}
      {isCompleted && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
      )}

      {/* Progress Ring with Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <ProgressRing
            progress={isCompleted ? 100 : progress}
            size={52}
            strokeWidth={4}
            isCompleted={isCompleted}
            isActive={isActive}
            isLocked={false}
          />
          {/* Icon in center */}
          <div className="absolute inset-0 flex items-center justify-center text-xl">
            {isCompleted ? (
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            ) : (
              <span>{node.icon}</span>
            )}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-col items-end gap-1.5">
          <span
            className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold uppercase tracking-wide ${phase.borderColor} ${phase.textColor}`}
          >
            {phase.label}
          </span>
          {isActive && !isCompleted && (
            <span
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-medium dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
            >
              <Play className="w-3 h-3" />
              Active
            </span>
          )}
        </div>
      </div>

      {/* Module Title */}
      <h3
        className="text-xl font-bold mb-1 leading-tight"
        style={{ color: colors.text }}
      >
        {node.shortTitle}
      </h3>
      <p
        className="text-xs mb-4 line-clamp-2"
        style={{ color: colors.textSecondary }}
      >
        {node.title}
      </p>

      {/* Progress Bar */}
      {totalSections > 0 && (
        <div className="mb-3">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: hexToRgba(colors.border, 0.5) }}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-primary'
                }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Progress Info */}
      <div className="flex items-center justify-between">
        {totalSections > 0 ? (
          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: colors.textSecondary }}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>{sectionsCompleted}/{totalSections}</span>
          </div>
        ) : (
          <div className="text-xs" style={{ color: colors.textSecondary }}>—</div>
        )}

        {progress > 0 && (
          <span
            className={`text-sm font-bold ${isCompleted ? 'text-emerald-600' : ''}`}
            style={{ color: isCompleted ? undefined : colors.primary }}
          >
            {Math.round(progress)}%
          </span>
        )}
      </div>
    </a>
  );

  return cardContent;
}

/**
 * Phase Section - Groups modules by difficulty
 */
function PhaseSection({
  title,
  nodes,
  colors,
  dsaCourse,
  progressiveLessonsMap,
  allProgressiveLessonProgress,
  completedModuleIds,
  currentModuleIndex,
  moduleProgress,
  completedModules,
  onModuleClick,
}: {
  title: string;
  nodes: JourneyNodeConfig[];
  colors: DashboardColors;
  dsaCourse: DSACourse;
  progressiveLessonsMap: Record<string, ProgressiveLesson>;
  allProgressiveLessonProgress: Map<string, ProgressiveLessonProgress>;
  completedModuleIds: string[];
  currentModuleIndex: number;
  moduleProgress: Record<string, number>;
  completedModules: string[];
  onModuleClick: (moduleIndex: number, moduleId: string) => void;
}) {
  if (nodes.length === 0) return null;

  const phase = DIFFICULTY_PHASES[nodes[0].difficulty];

  // Count completed modules in this phase
  const completedCount = nodes.filter(node =>
    completedModules.includes(node.id) || completedModules.includes(node.moduleId)
  ).length;

  return (
    <div className="mb-10">
      {/* Phase Header */}
      <div className="max-w-[1800px] mx-auto px-4 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-8 rounded-full bg-gradient-to-b ${phase.color}`} />
            <div>
              <h2 className="text-xl font-bold tracking-tight" style={{ color: colors.text }}>{title}</h2>
              <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                {completedCount} of {nodes.length} modules completed
              </p>
            </div>
          </div>
          {/* Phase completion badge */}
          {completedCount === nodes.length && nodes.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800">
              <CheckCircle className="w-3.5 h-3.5" />
              Complete
            </span>
          )}
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 max-w-[1800px] mx-auto px-4">
        {nodes.map(node => {
          const moduleIndex = dsaCourse.modules.findIndex(m => m.id === node.moduleId);
          const lesson = progressiveLessonsMap[node.moduleId];
          const lessonProgress = allProgressiveLessonProgress.get(node.moduleId);

          // Calculate progress
          let progress = moduleProgress[node.id] || 0;
          let sectionsCompleted = 0;
          let totalSections = 0;

          if (lesson) {
            totalSections = lesson.sections.length;
            if (lessonProgress) {
              sectionsCompleted = Array.from(lessonProgress.sectionsProgress.values())
                .filter(sp => sp.status === 'completed').length;
              progress = (sectionsCompleted / totalSections) * 100;
            }
          }

          const isCompleted = completedModules.includes(node.id) ||
            completedModules.includes(node.moduleId) ||
            progress >= 100;
          const isActive = dsaCourse.modules[currentModuleIndex]?.id === node.moduleId;
          const isLocked = !isModuleUnlocked(node.moduleId, completedModuleIds);
          const missingPrereqs = isLocked ? getMissingPrerequisiteNames(node.moduleId, completedModuleIds) : [];
          const isAlmostUnlocked = isLocked ? checkIsAlmostUnlocked(node.moduleId, completedModuleIds) : false;

          return (
            <ModuleCard
              key={node.id}
              node={node}
              moduleIndex={moduleIndex}
              colors={colors}
              progress={progress}
              isCompleted={isCompleted}
              isActive={isActive}
              isLocked={isLocked}
              sectionsCompleted={sectionsCompleted}
              totalSections={totalSections}
              missingPrereqs={missingPrereqs}
              isAlmostUnlocked={isAlmostUnlocked}
              onClick={() => onModuleClick(moduleIndex, node.moduleId)}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * Main Module Dashboard Component
 */
export function ModuleDashboard({
  colors,
  dsaCourse,
  progressiveLessonsMap,
  allProgressiveLessonProgress,
  onModuleClick,
  onReset,
  onOpenPractice,
  onOpenMastery,
}: ModuleDashboardProps) {
  const { completedModules, moduleProgress } = useGamificationStore();

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

  // Current module index (for highlighting active module)
  const [currentModuleIndex, setCurrentModuleIndex] = React.useState(0);

  // Group nodes by difficulty phase
  const beginnerNodes = JOURNEY_NODES.filter(n => n.difficulty === 'beginner');
  const intermediateNodes = JOURNEY_NODES.filter(n => n.difficulty === 'intermediate');
  const advancedNodes = JOURNEY_NODES.filter(n => n.difficulty === 'advanced');
  const expertNodes = JOURNEY_NODES.filter(n => n.difficulty === 'expert');

  return (
    <div
      className="flex-1 overflow-auto"
      style={{ backgroundColor: colors.background }}
    >
      {/* Full-width layout - header and grids are centered individually */}
      <div className="w-full min-h-screen py-8">
        {/* Header */}
        <DashboardHeader colors={colors} onReset={onReset} onOpenPractice={onOpenPractice} onOpenMastery={onOpenMastery} />

        {/* Phase Sections */}
        <PhaseSection
          title="Foundation"
          nodes={beginnerNodes}
          colors={colors}
          dsaCourse={dsaCourse}
          progressiveLessonsMap={progressiveLessonsMap}
          allProgressiveLessonProgress={allProgressiveLessonProgress}
          completedModuleIds={completedModuleIds}
          currentModuleIndex={currentModuleIndex}
          moduleProgress={moduleProgress}
          completedModules={completedModules}
          onModuleClick={onModuleClick}
        />

        <PhaseSection
          title="Building Skills"
          nodes={intermediateNodes}
          colors={colors}
          dsaCourse={dsaCourse}
          progressiveLessonsMap={progressiveLessonsMap}
          allProgressiveLessonProgress={allProgressiveLessonProgress}
          completedModuleIds={completedModuleIds}
          currentModuleIndex={currentModuleIndex}
          moduleProgress={moduleProgress}
          completedModules={completedModules}
          onModuleClick={onModuleClick}
        />

        <PhaseSection
          title="Advanced"
          nodes={advancedNodes}
          colors={colors}
          dsaCourse={dsaCourse}
          progressiveLessonsMap={progressiveLessonsMap}
          allProgressiveLessonProgress={allProgressiveLessonProgress}
          completedModuleIds={completedModuleIds}
          currentModuleIndex={currentModuleIndex}
          moduleProgress={moduleProgress}
          completedModules={completedModules}
          onModuleClick={onModuleClick}
        />

        <PhaseSection
          title="Expert"
          nodes={expertNodes}
          colors={colors}
          dsaCourse={dsaCourse}
          progressiveLessonsMap={progressiveLessonsMap}
          allProgressiveLessonProgress={allProgressiveLessonProgress}
          completedModuleIds={completedModuleIds}
          currentModuleIndex={currentModuleIndex}
          moduleProgress={moduleProgress}
          completedModules={completedModules}
          onModuleClick={onModuleClick}
        />

        {/* Bottom spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}

export default ModuleDashboard;