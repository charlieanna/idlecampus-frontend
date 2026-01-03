/**
 * JourneyNode Component
 *
 * Renders an individual module node in the journey map with:
 * - Progress ring showing completion percentage
 * - Module icon and title
 * - Status indicator (completed, active, available)
 * - Expandable sections list with lock states
 * - Click to expand, click section to navigate
 */

import React from 'react';
import { CheckCircle, Lock, Play, ChevronDown, ChevronRight, BookOpen, Code, Brain, Target } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { DIFFICULTY_PHASES, type JourneyNodeConfig } from './journeyMapConfig';
import type { LessonSection, SectionProgress } from '../../types/progressive-lesson-enhanced';

export interface SectionInfo {
  id: string;
  title: string;
  type: 'reading' | 'exercise' | 'quiz' | 'checkpoint';
  isLocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface JourneyNodeProps {
  node: JourneyNodeConfig;
  progress: number; // 0-100
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
  isExpanded: boolean;
  sections?: SectionInfo[]; // Sections to display when expanded
  missingPrerequisites?: string[]; // Names of missing prerequisites for locked modules
  isAlmostUnlocked?: boolean; // True if only 1 prerequisite remaining
  onToggleExpand: () => void;
  onSectionClick?: (sectionIndex: number) => void;
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
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isCompleted: boolean;
  isActive: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // Color based on state
  let strokeColor = 'stroke-slate-300';
  if (isCompleted) {
    strokeColor = 'stroke-green-500';
  } else if (isActive) {
    strokeColor = 'stroke-blue-500';
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
        className="stroke-slate-200 dark:stroke-slate-700"
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
        className={`${strokeColor} transition-all duration-500`}
      />
    </svg>
  );
}

/**
 * Get icon for section type
 */
function getSectionIcon(type: SectionInfo['type']) {
  switch (type) {
    case 'reading':
      return <BookOpen className="w-3.5 h-3.5" />;
    case 'exercise':
      return <Code className="w-3.5 h-3.5" />;
    case 'quiz':
      return <Brain className="w-3.5 h-3.5" />;
    case 'checkpoint':
      return <Target className="w-3.5 h-3.5" />;
    default:
      return <BookOpen className="w-3.5 h-3.5" />;
  }
}

export function JourneyNode({
  node,
  progress,
  isCompleted,
  isActive,
  isLocked,
  isExpanded,
  sections,
  missingPrerequisites,
  isAlmostUnlocked,
  onToggleExpand,
  onSectionClick,
}: JourneyNodeProps) {
  const phase = DIFFICULTY_PHASES[node.difficulty];

  // Determine node state and styling
  const getNodeStyles = () => {
    if (isCompleted) {
      return {
        container: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-green-100',
        icon: 'bg-green-100',
        text: 'text-green-800',
      };
    }
    if (isActive) {
      return {
        container: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-400 shadow-blue-200 ring-2 ring-blue-400 ring-offset-2',
        icon: 'bg-blue-100',
        text: 'text-blue-800',
      };
    }
    if (isLocked) {
      // Special "almost unlocked" styling - amber highlight
      if (isAlmostUnlocked) {
        return {
          container: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 opacity-90',
          icon: 'bg-amber-100',
          text: 'text-amber-700',
        };
      }
      return {
        container: 'bg-slate-100 border-slate-200 opacity-60',
        icon: 'bg-slate-200',
        text: 'text-slate-500',
      };
    }
    // Available but not started
    return {
      container: 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md',
      icon: 'bg-slate-50',
      text: 'text-slate-700',
    };
  };

  const styles = getNodeStyles();

  return (
    <div className="space-y-1">
      {/* Module Header - Click to expand */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onToggleExpand}
            className={`
              relative w-full flex items-center gap-3 p-3 rounded-xl border-2
              transition-all duration-200 cursor-pointer
              ${styles.container}
            `}
          >
            {/* Progress Ring with Icon */}
            <div className="relative flex-shrink-0">
              <ProgressRing
                progress={isCompleted ? 100 : progress}
                size={48}
                strokeWidth={3}
                isCompleted={isCompleted}
                isActive={isActive}
              />
              {/* Icon in center */}
              <div className="absolute inset-0 flex items-center justify-center text-xl">
                {isLocked ? (
                  <Lock className="w-5 h-5 text-slate-400" />
                ) : isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <span>{node.icon}</span>
                )}
              </div>
            </div>

            {/* Module Info */}
            <div className="flex-1 text-left min-w-0">
              <div className={`text-sm font-medium truncate ${styles.text}`}>
                {node.shortTitle}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs px-1.5 py-0.5 rounded ${phase.bgColor} ${phase.textColor}`}>
                  {node.difficulty === 'beginner' ? 'Beginner' :
                   node.difficulty === 'intermediate' ? 'Mid' :
                   node.difficulty === 'advanced' ? 'Adv' : 'Expert'}
                </span>
                {progress > 0 && !isCompleted && (
                  <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
                )}
              </div>
            </div>

            {/* Expand/Collapse Indicator */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {isActive && !isExpanded && (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                  <Play className="w-3 h-3 text-white fill-white" />
                </div>
              )}
              {isCompleted && !isExpanded && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs p-3">
          <div className="space-y-1">
            <div className="font-medium">{node.title}</div>
            <div className={`text-xs ${phase.textColor}`}>{phase.label}</div>
            {isLocked && missingPrerequisites && missingPrerequisites.length > 0 && (
              <div className={`text-xs ${isAlmostUnlocked ? 'text-amber-600' : 'text-slate-500'}`}>
                {isAlmostUnlocked ? (
                  <>
                    <span className="font-medium">Almost there!</span> Complete: {missingPrerequisites[0]}
                  </>
                ) : (
                  <>
                    <span className="font-medium">Prerequisites:</span>
                    <ul className="mt-1 ml-2 list-disc">
                      {missingPrerequisites.map((prereq, idx) => (
                        <li key={idx}>{prereq}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
            {isLocked && (!missingPrerequisites || missingPrerequisites.length === 0) && (
              <div className="text-xs text-red-500">Locked</div>
            )}
            {!isLocked && !isCompleted && progress > 0 && (
              <div className="text-xs text-slate-500">{Math.round(progress)}% complete</div>
            )}
            {isCompleted && (
              <div className="text-xs text-green-600">Completed</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Expanded Sections List */}
      {isExpanded && sections && sections.length > 0 && (
        <div className="ml-6 pl-4 border-l-2 border-slate-200 space-y-1">
          {sections.map((section, idx) => (
            <Tooltip key={section.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => !section.isLocked && onSectionClick?.(idx)}
                  disabled={section.isLocked}
                  className={`
                    w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left
                    transition-all duration-150 text-sm
                    ${section.isCurrent
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : section.isCompleted
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : section.isLocked
                          ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                          : 'bg-white text-slate-600 hover:bg-slate-100'
                    }
                  `}
                >
                  {/* Section icon */}
                  <span className={`flex-shrink-0 ${
                    section.isLocked ? 'text-slate-300' :
                    section.isCompleted ? 'text-green-500' :
                    section.isCurrent ? 'text-blue-500' : 'text-slate-400'
                  }`}>
                    {section.isLocked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      getSectionIcon(section.type)
                    )}
                  </span>

                  {/* Section number and title */}
                  <span className="flex-1 truncate">
                    <span className="text-xs opacity-60">{idx + 1}.</span>{' '}
                    {section.title}
                  </span>

                  {/* Status indicator */}
                  {section.isCompleted && (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  )}
                  {section.isCurrent && !section.isCompleted && (
                    <Play className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  )}
                </button>
              </TooltipTrigger>
              {section.isLocked && (
                <TooltipContent side="right">
                  <p className="text-xs">Complete previous section first</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}

export default JourneyNode;
