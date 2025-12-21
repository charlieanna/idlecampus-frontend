import { motion } from 'framer-motion';
import { ScaleFramework, ScaleFrameworkStep } from '../../../types/guidedTutorial';

// =============================================================================
// SCALE FRAMEWORK CARD COMPONENT
// =============================================================================

interface ScaleFrameworkCardProps {
  step: ScaleFrameworkStep;
  index: number;
}

function ScaleFrameworkCard({ step, index }: ScaleFrameworkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-200 p-5 mb-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{step.icon}</span>
        <h3 className="font-semibold text-gray-900 text-lg">{step.title}</h3>
      </div>

      {/* The Question */}
      <div className="bg-purple-50 rounded-lg p-4 mb-3 border border-purple-100">
        <div className="text-sm text-purple-600 font-medium mb-1">Ask yourself:</div>
        <p className="text-purple-900 font-medium text-lg">"{step.question}"</p>
      </div>

      {/* Why It Matters */}
      <p className="text-gray-700 mb-3">{step.whyItMatters}</p>

      {/* Example */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="text-sm text-gray-500 font-medium mb-1">For this system:</div>
        <p className="text-gray-800 text-sm">{step.example}</p>
      </div>
    </motion.div>
  );
}

// =============================================================================
// MAIN SCALE FRAMEWORK PANEL
// =============================================================================

interface ScaleFrameworkPanelProps {
  scaleFramework: ScaleFramework;
  onContinue: () => void;
}

/**
 * Panel shown after Step 3 to introduce the Scale Framework.
 * This is the "progressive reveal" - after basic system works,
 * we introduce the scale questions.
 */
export function ScaleFrameworkPanel({ scaleFramework, onContinue }: ScaleFrameworkPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white z-50 overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Celebration that basic system works */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎉</span>
            <h2 className="text-2xl font-bold text-green-900">
              {scaleFramework.celebrationMessage}
            </h2>
          </div>
          <p className="text-green-800">
            You've built a working system that handles events from producers to consumers.
            The basic functionality is there!
          </p>
        </motion.div>

        {/* The "But..." hook */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8"
        >
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <span>⚠️</span> But can it scale?
          </h3>
          <p className="text-amber-800 text-lg">
            {scaleFramework.hookMessage}
          </p>
        </motion.div>

        {/* Scale Framework Introduction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span>🧠</span> {scaleFramework.title}
          </h2>
          <p className="text-gray-600 text-lg">
            {scaleFramework.intro}
          </p>
        </motion.div>

        {/* Scale Framework Cards */}
        <div className="mb-8">
          {scaleFramework.steps.map((step, index) => (
            <ScaleFrameworkCard key={step.id} step={step} index={index} />
          ))}
        </div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
        >
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span>🚀</span> What's Next?
          </h3>
          <p className="text-blue-800">
            {scaleFramework.nextStepsPreview}
          </p>
        </motion.div>

        {/* Key Takeaway */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
            <span>💡</span> Key Takeaway
          </h3>
          <p className="text-indigo-800 text-lg">
            <strong>First make it work, then make it scale.</strong> You now have a reusable framework:
            ask about Throughput, Latency, Durability, and Availability to guide every scaling decision.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center pt-4 pb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContinue}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-10 py-4 rounded-xl text-lg shadow-lg shadow-purple-200"
          >
            Let's Scale It! →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default ScaleFrameworkPanel;
