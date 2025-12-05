import { motion } from 'framer-motion';
import { CelebrationContent } from '../../../types/guidedTutorial';

interface CelebrationPanelProps {
  celebration: CelebrationContent;
  stepNumber: number;
  totalSteps: number;
  isLastStep: boolean;
  onContinue: () => void;
}

/**
 * Full-screen celebration panel shown after completing a step
 * Shows achievements, metrics, and teases the next challenge
 */
export function CelebrationPanel({
  celebration,
  stepNumber,
  totalSteps,
  isLastStep,
  onContinue,
}: CelebrationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 flex items-center justify-center z-50"
    >
      <div className="max-w-2xl mx-auto px-8 text-center">
        {/* Confetti emoji burst */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-8xl mb-6"
        >
          {celebration.emoji || '🎉'}
        </motion.div>

        {/* Main celebration message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-4"
        >
          {celebration.message}
        </motion.h1>

        {/* Achievement description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-emerald-200 mb-8"
        >
          {celebration.achievement}
        </motion.p>

        {/* Metrics before/after */}
        {celebration.metrics && celebration.metrics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 border border-emerald-700/50 rounded-xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 gap-4">
              {celebration.metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between text-left"
                >
                  <span className="text-slate-400 font-medium">{metric.label}</span>
                  <div className="flex items-center gap-3">
                    {metric.before && (
                      <>
                        <span className="text-red-400 line-through">{metric.before}</span>
                        <span className="text-slate-500">→</span>
                      </>
                    )}
                    <span className="text-emerald-400 font-bold">{metric.after}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Next challenge teaser (if not last step) */}
        {!isLastStep && celebration.nextTeaser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 mb-8"
          >
            <p className="text-amber-300 italic">
              {celebration.nextTeaser}
            </p>
          </motion.div>
        )}

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-2 mb-8"
        >
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < stepNumber ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            />
          ))}
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onContinue}
          className={`font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg ${
            isLastStep
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
          }`}
        >
          {isLastStep ? 'Complete Tutorial' : 'Next Challenge'}
        </motion.button>
      </div>
    </motion.div>
  );
}
