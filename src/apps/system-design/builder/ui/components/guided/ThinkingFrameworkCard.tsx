import { motion } from 'framer-motion';
import { FrameworkStep } from '../../../types/guidedTutorial';

interface ThinkingFrameworkCardProps {
  step: FrameworkStep;
  index: number;
}

/**
 * Card component that displays a single step in the expert thinking framework.
 * Shows: Category → "Always Ask" → "Why It Matters" → "Expert Breakdown"
 *
 * Used in:
 * - Requirements phase (Step 0) for functional framework
 * - Can be reused for scale framework display
 */
export function ThinkingFrameworkCard({ step, index }: ThinkingFrameworkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-200 p-6 mb-4 shadow-sm"
    >
      {/* Header: Step number + title */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{step.icon}</span>
        <div>
          <span className="text-sm text-gray-500 font-medium">Step {index + 1}</span>
          <h3 className="font-semibold text-gray-900 text-lg">{step.title}</h3>
        </div>
      </div>

      {/* Always Ask - The key question */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
        <div className="text-sm text-blue-600 font-medium mb-1">Always ask:</div>
        <p className="text-blue-900 font-medium text-lg">"{step.alwaysAsk}"</p>
      </div>

      {/* Why It Matters - The reasoning */}
      <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-100">
        <div className="text-sm text-amber-600 font-medium mb-1">Why this matters:</div>
        <p className="text-amber-900">{step.whyItMatters}</p>
      </div>

      {/* Expert Breakdown - The specific answer for this problem */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-100">
        <div className="text-sm text-green-600 font-medium mb-2 flex items-center gap-1">
          <span>🎯</span> Expert breakdown:
        </div>
        {step.expertBreakdown.intro && (
          <p className="text-green-800 mb-3 font-medium">{step.expertBreakdown.intro}</p>
        )}
        <ul className="space-y-2">
          {step.expertBreakdown.points.map((point, i) => (
            <li key={i} className="text-green-800 flex items-start gap-2">
              <span className="text-green-600 font-medium min-w-[20px]">{i + 1}.</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default ThinkingFrameworkCard;
