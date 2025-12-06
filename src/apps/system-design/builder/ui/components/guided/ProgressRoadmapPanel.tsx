import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GuidedTutorial, GuidedTutorialProgress } from '../../../types/guidedTutorial';

interface ProgressRoadmapPanelProps {
  tutorial: GuidedTutorial;
  progress: GuidedTutorialProgress;
  onStepClick?: (stepIndex: number) => void;
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
}

function formatTimeSpent(startedAt: string): string {
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m`;
}

function getStepTitle(step: { 
  practicePhase?: { frText?: string; taskDescription?: string }; 
  learnPhase?: { conceptTitle?: string };
  teaching?: { frText?: string };
}): string {
  return (
    step.practicePhase?.taskDescription ||
    step.learnPhase?.conceptTitle ||
    step.practicePhase?.frText ||
    step.teaching?.frText ||
    'Step'
  );
}

export function ProgressRoadmapPanel({
  tutorial,
  progress,
  onStepClick,
  isCollapsible = true,
  defaultCollapsed = false,
}: ProgressRoadmapPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  
  const { steps } = tutorial;
  const { currentStepIndex, completedStepIds, startedAt } = progress;
  
  const completedCount = completedStepIds.length;
  const totalSteps = tutorial.totalSteps;
  const percentage = Math.round((completedCount / totalSteps) * 100);
  const timeSpent = useMemo(() => formatTimeSpent(startedAt), [startedAt]);

  if (isCollapsible && isCollapsed) {
    return (
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setIsCollapsed(false)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-white shadow-lg rounded-r-xl border border-gray-200 border-l-0 p-3 hover:bg-gray-50 transition-colors group"
        title="Show progress roadmap"
      >
        <div className="flex flex-col items-center gap-2">
          <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">{percentage}%</span>
          </div>
          <span className="text-xs text-gray-500 writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
            Progress
          </span>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden w-72"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Tutorial Progress</h3>
          {isCollapsible && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Collapse"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        {/* Completion Stats */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            You've completed {completedCount}/{totalSteps} steps!
          </span>
          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
            {percentage}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
          />
        </div>
        
        {/* Time Spent */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Time spent: <strong className="text-gray-700">{timeSpent}</strong></span>
        </div>
      </div>

      {/* Roadmap Steps */}
      <div className="max-h-[400px] overflow-y-auto">
        <div className="p-4">
          {steps.map((step, index) => {
            const isCompleted = completedStepIds.includes(step.id);
            const isCurrent = index === currentStepIndex;
            const isPast = index < currentStepIndex;
            const canNavigate = isPast || isCompleted;
            const stepTitle = getStepTitle(step);

            return (
              <div key={step.id} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 w-0.5 h-full -mb-2 transition-colors duration-300 ${
                      isCompleted ? 'bg-green-400' : isPast ? 'bg-blue-300' : 'bg-gray-200'
                    }`}
                  />
                )}

                {/* Step Item */}
                <motion.button
                  onClick={() => canNavigate && onStepClick?.(index)}
                  disabled={!canNavigate}
                  className={`relative flex items-start gap-3 w-full text-left p-2 rounded-lg transition-all duration-200 mb-1 ${
                    isCurrent
                      ? 'bg-blue-50 border border-blue-200'
                      : canNavigate
                      ? 'hover:bg-gray-50 cursor-pointer'
                      : 'cursor-default'
                  }`}
                  whileHover={canNavigate ? { scale: 1.02 } : {}}
                  whileTap={canNavigate ? { scale: 0.98 } : {}}
                >
                  {/* Step Circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      initial={false}
                      animate={isCurrent ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                      transition={isCurrent ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        isCompleted
                          ? 'bg-green-500 text-white shadow-sm'
                          : isCurrent
                          ? 'bg-blue-500 text-white ring-4 ring-blue-200 shadow-md'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                      ) : (
                        index + 1
                      )}
                    </motion.div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium ${
                          isCompleted
                            ? 'text-green-600'
                            : isCurrent
                            ? 'text-blue-600'
                            : 'text-gray-400'
                        }`}
                      >
                        Step {index + 1}
                      </span>
                      {isCurrent && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded"
                        >
                          CURRENT
                        </motion.span>
                      )}
                    </div>
                    <p
                      className={`text-sm truncate ${
                        isCompleted
                          ? 'text-gray-700'
                          : isCurrent
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-500'
                      }`}
                      title={stepTitle}
                    >
                      {stepTitle}
                    </p>
                  </div>

                  {/* Navigation Arrow for past steps */}
                  {canNavigate && !isCurrent && (
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {percentage === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 bg-green-50 border-t border-green-100"
        >
          <div className="flex items-center gap-2 text-green-700">
            <span className="text-lg">🎉</span>
            <span className="text-sm font-medium">Tutorial Complete!</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export function ProgressRoadmapCollapsible({
  tutorial,
  progress,
  onStepClick,
}: Omit<ProgressRoadmapPanelProps, 'isCollapsible' | 'defaultCollapsed'>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-20 z-50 bg-white shadow-lg rounded-lg border border-gray-200 p-2 hover:bg-gray-50 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title="Toggle progress roadmap"
      >
        <div className="flex items-center gap-2">
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-600">
              {progress.completedStepIds.length}/{tutorial.totalSteps}
            </span>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(progress.completedStepIds.length / tutorial.totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </motion.button>

      {/* Roadmap Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-4 top-32 z-50"
          >
            <ProgressRoadmapPanel
              tutorial={tutorial}
              progress={progress}
              onStepClick={(stepIndex) => {
                onStepClick?.(stepIndex);
                setIsOpen(false);
              }}
              isCollapsible={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/10 z-40"
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function ProgressRoadmapInline({
  tutorial,
  progress,
  onStepClick,
}: Omit<ProgressRoadmapPanelProps, 'isCollapsible' | 'defaultCollapsed'>) {
  return (
    <ProgressRoadmapPanel
      tutorial={tutorial}
      progress={progress}
      onStepClick={onStepClick}
      isCollapsible={false}
    />
  );
}
