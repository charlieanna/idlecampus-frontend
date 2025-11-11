import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';
import { ArrayVisualization } from './ArrayVisualization';

export interface SlidingWindowStep {
  windowStart: number;
  windowEnd: number;
  currentValue?: number; // sum, max, min, etc.
  pointers?: Record<number, string>;
  highlightIndices?: number[];
  explanation: string;
  code?: string; // Optional code snippet for this step
}

export interface SlidingWindowAnimationProps {
  array: (number | string)[];
  steps: SlidingWindowStep[];
  valueLabel?: string; // "Sum", "Max", "Min", etc.
  autoPlaySpeed?: number; // milliseconds between steps
  showCode?: boolean;
  className?: string;
}

export function SlidingWindowAnimation({
  array,
  steps,
  valueLabel = 'Current Value',
  autoPlaySpeed = 1000,
  showCode = false,
  className,
}: SlidingWindowAnimationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(autoPlaySpeed);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || isLastStep) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, speed, isLastStep]);

  const handlePlayPause = () => {
    if (isLastStep && !isPlaying) {
      // If at end, restart
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleStepChange = useCallback((value: number[]) => {
    setIsPlaying(false);
    setCurrentStepIndex(value[0]);
  }, []);

  const handleSpeedChange = useCallback((value: number[]) => {
    setSpeed(value[0]);
  }, []);

  return (
    <div className={className}>
      <Card className="p-6 space-y-6">
        {/* Array Visualization */}
        <ArrayVisualization
          array={array}
          activeRange={[currentStep.windowStart, currentStep.windowEnd]}
          pointers={currentStep.pointers}
          highlightIndices={currentStep.highlightIndices}
          animate={false}
          showIndices={true}
        />

        {/* Current Value Display */}
        {currentStep.currentValue !== undefined && (
          <div className="flex justify-center">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg px-6 py-3">
              <div className="text-sm text-blue-600 font-semibold">{valueLabel}</div>
              <div className="text-3xl font-bold text-blue-900">{currentStep.currentValue}</div>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="text-sm font-semibold text-slate-700 mb-2">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          <div className="text-slate-600">{currentStep.explanation}</div>
        </div>

        {/* Optional Code Display */}
        {showCode && currentStep.code && (
          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <pre>{currentStep.code}</pre>
          </div>
        )}

        {/* Progress Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Step {currentStepIndex + 1}</span>
            <span>{steps.length} steps</span>
          </div>
          <Slider
            value={[currentStepIndex]}
            min={0}
            max={steps.length - 1}
            step={1}
            onValueChange={handleStepChange}
            className="w-full"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            disabled={isFirstStep}
            title="Reset to start"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={isFirstStep || isPlaying}
            title="Previous step"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-12 h-12"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={isLastStep || isPlaying}
            title="Next step"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Animation Speed</span>
            <span>{(1000 / speed).toFixed(1)}x</span>
          </div>
          <Slider
            value={[speed]}
            min={200}
            max={2000}
            step={100}
            onValueChange={handleSpeedChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Fast</span>
            <span>Slow</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
