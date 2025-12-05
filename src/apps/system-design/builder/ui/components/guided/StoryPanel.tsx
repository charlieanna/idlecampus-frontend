import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { StoryContent } from '../../../types/guidedTutorial';

interface StoryPanelProps {
  story: StoryContent;
  stepNumber: number;
  totalSteps: number;
  onContinue: () => void;
}

/**
 * Full-screen story panel that introduces each step with a narrative
 * Creates an engaging, story-driven experience before the task
 */
export function StoryPanel({ story, stepNumber, totalSteps, onContinue }: StoryPanelProps) {
  // Add keyboard support for Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onContinue();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onContinue]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50"
    >
      <div className="max-w-2xl mx-auto px-8 text-center">
        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <span className="text-slate-400 text-sm font-medium">
            Step {stepNumber} of {totalSteps}
          </span>
        </motion.div>

        {/* Big emoji */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-8xl mb-8"
        >
          {story.emoji || '🎯'}
        </motion.div>

        {/* Scenario - the situation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-white mb-6 leading-tight"
        >
          {story.scenario}
        </motion.h1>

        {/* Hook - the emotional draw */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl text-slate-300 mb-8 leading-relaxed"
        >
          {story.hook}
        </motion.p>

        {/* Challenge - what needs to be done */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-10"
        >
          <div className="text-amber-400 text-sm font-semibold mb-2 uppercase tracking-wide">
            Your Mission
          </div>
          <p className="text-lg text-white">
            {story.challenge}
          </p>
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={onContinue}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg shadow-blue-900/30"
        >
          Let's Do This
        </motion.button>

        {/* Skip hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-slate-500 text-sm mt-6"
        >
          Press Enter or click to continue
        </motion.p>
      </div>
    </motion.div>
  );
}
