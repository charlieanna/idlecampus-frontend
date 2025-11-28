import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, SkipForward, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';
import type {
  MultiStage,
  MultiStageLesson,
  MultiStageProgress,
  StageNavigation,
} from '../../types/multiStage';

export interface StageManagerProps {
  lesson: MultiStageLesson;
  initialProgress?: MultiStageProgress;
  onStageComplete?: (stageId: string, score?: number) => void;
  onLessonComplete?: () => void;
  onExit?: () => void;
  renderStage: (stage: MultiStage, onComplete: () => void) => React.ReactNode;
}

/**
 * StageManager component manages the flow through multi-stage lessons
 * Handles navigation, progress tracking, and stage completion
 */
export function StageManager({
  lesson,
  initialProgress,
  onStageComplete,
  onLessonComplete,
  onExit,
  renderStage,
}: StageManagerProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(
    initialProgress?.currentStageIndex ?? 0
  );
  const [completedStages, setCompletedStages] = useState<Set<string>>(
    initialProgress?.completedStages ?? new Set()
  );
  const [stageScores, setStageScores] = useState<Map<string, number>>(
    initialProgress?.stageScores ?? new Map()
  );
  const [startTime] = useState(Date.now());
  const stageStartTime = useRef(Date.now());

  const currentStage = lesson.stages[currentStageIndex];
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === lesson.stages.length - 1;
  const isCurrentStageComplete = completedStages.has(currentStage.id);
  const completionPercentage = (completedStages.size / lesson.stages.length) * 100;

  // Calculate if user can proceed
  const canGoNext =
    isCurrentStageComplete ||
    currentStage.optional ||
    currentStage.completionCriteria?.allowSkip;

  // Navigation state
  const navigation: StageNavigation = {
    canGoBack: !isFirstStage,
    canGoNext: !isLastStage && canGoNext,
    canSkip: currentStage.completionCriteria?.allowSkip ?? false,
    totalStages: lesson.stages.length,
    currentStageIndex,
    completionPercentage,
  };

  // Handle stage completion
  const handleStageComplete = useCallback(
    (score?: number) => {
      const stageId = currentStage.id;
      const timeSpent = Math.floor((Date.now() - stageStartTime.current) / 1000);

      // Update completed stages
      setCompletedStages((prev) => new Set(prev).add(stageId));

      // Update score if provided
      if (score !== undefined) {
        setStageScores((prev) => new Map(prev).set(stageId, score));
      }

      // Notify parent
      onStageComplete?.(stageId, score);

      // Auto-advance to next stage if not last
      if (!isLastStage) {
        setTimeout(() => {
          handleNext();
        }, 500);
      } else {
        // Lesson complete
        onLessonComplete?.();
      }
    },
    [currentStage, isLastStage, onStageComplete, onLessonComplete]
  );

  // Navigation handlers
  const handleNext = () => {
    if (!isLastStage && canGoNext) {
      setCurrentStageIndex((prev) => prev + 1);
      stageStartTime.current = Date.now();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (!isFirstStage) {
      setCurrentStageIndex((prev) => prev - 1);
      stageStartTime.current = Date.now();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkip = () => {
    if (currentStage.completionCriteria?.allowSkip && !isLastStage) {
      handleNext();
    }
  };

  const handleGoToStage = (index: number) => {
    // Only allow going to previously visited stages or next immediate stage
    const canGoTo =
      index < currentStageIndex ||
      (index === currentStageIndex + 1 && canGoNext) ||
      index === currentStageIndex;

    if (canGoTo && index >= 0 && index < lesson.stages.length) {
      setCurrentStageIndex(index);
      stageStartTime.current = Date.now();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Save progress to localStorage
  useEffect(() => {
    // Ensure we only have serializable primitives by converting Sets/Maps to arrays first
    let completedStagesArray: string[] = [];
    try {
      completedStagesArray = Array.from(completedStages).filter(
        (id) => typeof id === 'string' && id !== null && id !== undefined
      ) as string[];
    } catch (e) {
      console.error('Error converting completedStages to array:', e);
      completedStagesArray = [];
    }
    
    let stageScoresArray: [string, number][] = [];
    try {
      stageScoresArray = Array.from(stageScores.entries())
        .filter(([key, value]) => 
          typeof key === 'string' && 
          typeof value === 'number' && 
          !isNaN(value) &&
          key !== null && 
          key !== undefined
        )
        .map(([key, value]) => [String(key), Number(value)]) as [string, number][];
    } catch (e) {
      console.error('Error converting stageScores to array:', e);
      stageScoresArray = [];
    }

    // Create a serializable progress object with only primitives - avoid any spread operators
    const serializableProgress: Record<string, unknown> = {
      lessonId: String(lesson.id || ''),
      currentStageIndex: Number(currentStageIndex || 0),
      completedStages: completedStagesArray,
      stageScores: stageScoresArray,
      lastAccessedAt: new Date().toISOString(),
      timeSpentSeconds: Math.floor((Date.now() - (startTime || Date.now())) / 1000),
    };

    try {
      // Use JSON.stringify with a replacer function to catch any remaining circular references
      const jsonString = JSON.stringify(serializableProgress, (key, value) => {
        // Skip any non-primitive values that shouldn't be there
        if (typeof value === 'object' && value !== null) {
          if (value instanceof Set || value instanceof Map) {
            return undefined; // Skip Sets/Maps that weren't converted
          }
          if (value instanceof HTMLElement) {
            return undefined; // Skip DOM elements
          }
          if (value.constructor && value.constructor.name === 'FiberNode') {
            return undefined; // Skip React fibers
          }
        }
        return value;
      });
      
      localStorage.setItem(
        `multiStageProgress_${lesson.id}`,
        jsonString
      );
    } catch (error) {
      console.error('Failed to save progress to localStorage:', error);
      // Last resort: just save the essential data
      try {
        localStorage.setItem(
          `multiStageProgress_${lesson.id}`,
          JSON.stringify({
            lessonId: String(lesson.id || ''),
            currentStageIndex: Number(currentStageIndex || 0),
          })
        );
      } catch (finalError) {
        console.error('Failed to save essential progress:', finalError);
      }
    }
  }, [lesson.id, currentStageIndex, completedStages, stageScores, startTime]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with progress */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
          </div>
          {onExit && (
            <Button
              onClick={onExit}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              <Home className="w-4 h-4 mr-2" />
              Exit Lesson
            </Button>
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Stage {currentStageIndex + 1} of {lesson.stages.length}
            </span>
            <span>{Math.round(completionPercentage)}% Complete</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Stage breadcrumbs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {lesson.stages.map((stage, index) => {
            const isCompleted = completedStages.has(stage.id);
            const isCurrent = index === currentStageIndex;
            const isAccessible =
              index < currentStageIndex ||
              (index === currentStageIndex + 1 && canGoNext) ||
              isCurrent;

            return (
              <button
                key={stage.id}
                onClick={() => handleGoToStage(index)}
                disabled={!isAccessible}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                  isCurrent &&
                    'bg-blue-100 text-blue-900 ring-2 ring-blue-500',
                  !isCurrent && isCompleted && 'bg-green-50 text-green-900',
                  !isCurrent &&
                    !isCompleted &&
                    isAccessible &&
                    'bg-gray-100 text-gray-700 hover:bg-gray-200',
                  !isAccessible &&
                    'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                )}
              >
                {isCompleted && <Check className="w-4 h-4" />}
                <span className="font-mono">{index + 1}</span>
                <span>{stage.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current stage content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Stage header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-semibold text-blue-600 uppercase">
                {currentStage.type}
              </span>
              {currentStage.optional && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Optional
                </span>
              )}
              {currentStage.estimatedMinutes && (
                <span className="text-xs text-gray-500">
                  ~{currentStage.estimatedMinutes} min
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {currentStage.title}
            </h2>
            {currentStage.description && (
              <p className="text-gray-600 mt-2">{currentStage.description}</p>
            )}
          </div>

          {/* Render the stage */}
          {renderStage(currentStage, handleStageComplete)}
        </div>
      </div>

      {/* Navigation footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            onClick={handlePrevious}
            disabled={isFirstStage}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {navigation.canSkip && !isCurrentStageComplete && (
              <Button onClick={handleSkip} variant="outline">
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
            )}

            {isLastStage && isCurrentStageComplete ? (
              <Button
                onClick={onLessonComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Finish Lesson
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canGoNext}
                className={cn(
                  canGoNext
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                )}
              >
                {isCurrentStageComplete ? 'Continue' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
