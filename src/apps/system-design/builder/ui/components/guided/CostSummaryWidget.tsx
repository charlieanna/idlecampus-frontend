import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SystemGraph } from '../../../types/graph';
import { useCostEstimate } from '../../../hooks/useCostEstimate';

interface CostSummaryWidgetProps {
  systemGraph: SystemGraph | null;
  budgetTarget?: number;
  defaultCollapsed?: boolean;
}

export function CostSummaryWidget({
  systemGraph,
  budgetTarget = 2500,
  defaultCollapsed = true,
}: CostSummaryWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed);
  const { totalCost, breakdown, isUnderBudget, budgetRemaining, budgetUsedPercent } = useCostEstimate(
    systemGraph,
    budgetTarget
  );

  const statusColor = isUnderBudget ? 'green' : 'red';
  const statusIcon = isUnderBudget ? '✓' : '⚠';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-md border overflow-hidden transition-colors ${
        isUnderBudget ? 'border-green-200' : 'border-red-200'
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${
          isUnderBudget ? 'hover:bg-green-50' : 'hover:bg-red-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
              isUnderBudget ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {statusIcon}
          </div>
          <div className="text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                ${totalCost.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">/ mo</span>
            </div>
            <div className={`text-xs ${isUnderBudget ? 'text-green-600' : 'text-red-600'}`}>
              {isUnderBudget
                ? `$${budgetRemaining.toLocaleString()} under budget`
                : `$${Math.abs(budgetRemaining).toLocaleString()} over budget`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-gray-500">Budget</div>
            <div className="text-sm font-medium text-gray-700">
              ${budgetTarget.toLocaleString()}
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="mt-3 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Budget Usage</span>
                  <span className="text-xs font-medium text-gray-700">
                    {budgetUsedPercent.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, budgetUsedPercent)}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      budgetUsedPercent > 100
                        ? 'bg-red-500'
                        : budgetUsedPercent > 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                </div>
              </div>

              {breakdown.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Cost Breakdown
                  </div>
                  {breakdown.map((item) => (
                    <div
                      key={item.componentType}
                      className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getComponentEmoji(item.componentType)}</span>
                        <span className="text-sm text-gray-700">{item.displayName}</span>
                        {item.count > 1 && (
                          <span className="text-xs text-gray-400">×{item.count}</span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        ${item.totalCost.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-gray-400">
                  No components added yet
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function getComponentEmoji(type: string): string {
  const emojis: Record<string, string> = {
    app_server: '🖥️',
    load_balancer: '⚖️',
    postgresql: '🐘',
    mysql: '🐬',
    mongodb: '🍃',
    cassandra: '👁️',
    redis: '⚡',
    cache: '💾',
    cdn: '🌐',
    s3: '📦',
    message_queue: '📬',
    worker: '⚙️',
    elasticsearch: '🔍',
    dynamodb: '⚡',
  };
  return emojis[type] || '📦';
}

export function CostIndicatorCompact({
  systemGraph,
  budgetTarget = 2500,
}: {
  systemGraph: SystemGraph | null;
  budgetTarget?: number;
}) {
  const { totalCost, isUnderBudget } = useCostEstimate(systemGraph, budgetTarget);

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
        isUnderBudget
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      <span>{isUnderBudget ? '✓' : '⚠'}</span>
      <span>${totalCost.toLocaleString()}/mo</span>
    </div>
  );
}
