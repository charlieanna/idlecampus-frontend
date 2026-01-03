/**
 * ModuleHealthWidget - Compact Module Decay Dashboard
 *
 * Shows at the top of Smart Practice to visualize module retention status:
 * - Overall retention percentage
 * - Count of modules needing review
 * - Mini health bars for each decaying module
 * - "Review Now" action for critical modules
 */

import React from 'react';
import { TrendingDown, AlertTriangle, CheckCircle, Activity, ChevronRight, RefreshCw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useGamificationStore } from '../../stores/gamificationStore';
import { getModuleInfo } from '../../data/moduleConceptMapping';
import type { DecayClassification } from '../../types/progress-decay';

interface ModuleHealthWidgetProps {
  onReviewModule?: (moduleId: string) => void;
  compact?: boolean;
}

// Color map for decay classifications
const DECAY_COLORS: Record<DecayClassification, { bg: string; text: string; bar: string }> = {
  fresh: { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  stable: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
  fading: { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-500' },
  decayed: { bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-500' },
  critical: { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' },
};

// Classification labels
const DECAY_LABELS: Record<DecayClassification, string> = {
  fresh: 'Fresh',
  stable: 'Stable',
  fading: 'Fading',
  decayed: 'Needs Review',
  critical: 'Critical',
};

export function ModuleHealthWidget({ onReviewModule, compact = false }: ModuleHealthWidgetProps) {
  const { colors } = useTheme();
  const {
    moduleMastery,
    getModulesNeedingReview,
    getModuleDecaySummary,
  } = useGamificationStore();

  const decaySummary = getModuleDecaySummary();
  const modulesNeedingReview = getModulesNeedingReview();

  // No completed modules yet
  if (decaySummary.totalModules === 0) {
    return null;
  }

  // Compact version - just shows overall stats
  if (compact) {
    const needsAttention = decaySummary.fadingCount + decaySummary.decayedCount + decaySummary.criticalCount;

    return (
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg" style={{ backgroundColor: colors.backgroundSecondary }}>
        <Activity className="w-4 h-4 text-slate-400" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {Math.round(decaySummary.averageRetention)}% retention
          </span>
          {needsAttention > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 rounded">
              {needsAttention} need review
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full version with module breakdown
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ backgroundColor: colors.backgroundSecondary, borderColor: colors.border }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          <span className="font-semibold">Module Health</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{Math.round(decaySummary.averageRetention)}%</span>
          <span className="text-sm" style={{ color: colors.textSecondary }}>retention</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-4 py-2 flex items-center gap-4 border-b text-sm" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{decaySummary.freshCount + decaySummary.stableCount} healthy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span>{decaySummary.fadingCount} fading</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>{decaySummary.decayedCount + decaySummary.criticalCount} urgent</span>
        </div>
      </div>

      {/* Module List (if any need review) */}
      {modulesNeedingReview.length > 0 && (
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.textSecondary }}>
            <TrendingDown className="w-4 h-4" />
            <span>Modules needing review</span>
          </div>
          <div className="space-y-2">
            {modulesNeedingReview.slice(0, 4).map(module => {
              const moduleInfo = getModuleInfo(module.moduleId);
              const decayColors = DECAY_COLORS[module.classification];
              const retentionPercent = Math.round(module.currentMastery);

              return (
                <div
                  key={module.moduleId}
                  className={`flex items-center gap-3 p-2 rounded-lg ${decayColors.bg} cursor-pointer hover:opacity-90 transition-opacity`}
                  onClick={() => onReviewModule?.(module.moduleId)}
                >
                  {/* Status Icon */}
                  {module.classification === 'critical' ? (
                    <AlertTriangle className={`w-4 h-4 ${decayColors.text}`} />
                  ) : (
                    <TrendingDown className={`w-4 h-4 ${decayColors.text}`} />
                  )}

                  {/* Module Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium truncate ${decayColors.text}`}>
                        {moduleInfo?.shortTitle || module.moduleName}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${decayColors.bg} ${decayColors.text}`}>
                        {DECAY_LABELS[module.classification]}
                      </span>
                    </div>
                    {/* Mini progress bar */}
                    <div className="mt-1 h-1.5 bg-white/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${decayColors.bar} transition-all`}
                        style={{ width: `${retentionPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Retention % */}
                  <span className={`text-sm font-bold ${decayColors.text}`}>
                    {retentionPercent}%
                  </span>

                  {/* Arrow */}
                  <ChevronRight className={`w-4 h-4 ${decayColors.text}`} />
                </div>
              );
            })}

            {modulesNeedingReview.length > 4 && (
              <div className="text-center text-sm" style={{ color: colors.textSecondary }}>
                +{modulesNeedingReview.length - 4} more modules
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Healthy State */}
      {modulesNeedingReview.length === 0 && decaySummary.totalModules > 0 && (
        <div className="px-4 py-4 flex items-center justify-center gap-2 text-emerald-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">All modules healthy!</span>
        </div>
      )}

      {/* Footer - Review Action */}
      {modulesNeedingReview.length > 0 && (
        <div
          className="px-4 py-3 border-t flex items-center justify-between"
          style={{ borderColor: colors.border, backgroundColor: colors.background }}
        >
          <span className="text-sm" style={{ color: colors.textSecondary }}>
            Practice problems from fading modules to recover retention
          </span>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => {
              const criticalModule = modulesNeedingReview.find(m => m.classification === 'critical');
              const targetModule = criticalModule || modulesNeedingReview[0];
              onReviewModule?.(targetModule.moduleId);
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Review Now
          </button>
        </div>
      )}
    </div>
  );
}

export default ModuleHealthWidget;
