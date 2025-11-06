import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

// ============================================
// TYPES
// ============================================

export interface MasteryProgress {
  canonical_command: string;
  proficiency_score: number;
  current_score: number;
  total_attempts: number;
  successful_attempts: number;
  consecutive_successes: number;
  consecutive_failures: number;
  mastered: boolean;
  needs_practice: boolean;
  needs_review: boolean;
  shield_level?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface MasteryProgressIndicatorProps {
  mastery: MasteryProgress;
  compact?: boolean;
  showDetails?: boolean;
}

// ============================================
// MASTERY PROGRESS INDICATOR COMPONENT
// ============================================

export function MasteryProgressIndicator({
  mastery,
  compact = false,
  showDetails = true
}: MasteryProgressIndicatorProps) {
  const getStatusColor = () => {
    if (mastery.mastered) return 'text-green-600';
    if (mastery.needs_review) return 'text-red-600';
    if (mastery.needs_practice) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getProgressBarColor = () => {
    if (mastery.current_score >= 80) return 'bg-green-500';
    if (mastery.current_score >= 60) return 'bg-yellow-500';
    if (mastery.current_score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusBadge = () => {
    if (mastery.mastered) {
      return (
        <Badge className="bg-green-600 text-white flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Mastered
        </Badge>
      );
    }
    if (mastery.needs_review) {
      return (
        <Badge className="bg-red-600 text-white flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Needs Review
        </Badge>
      );
    }
    if (mastery.needs_practice) {
      return (
        <Badge className="bg-yellow-600 text-white flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          Needs Practice
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-blue-600 border-blue-300">
        In Progress
      </Badge>
    );
  };

  const getTrendIcon = () => {
    switch (mastery.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getShieldBadge = () => {
    if (!mastery.shield_level) return null;

    const shieldColors = {
      bronze: 'bg-amber-700',
      silver: 'bg-slate-400',
      gold: 'bg-yellow-500',
      platinum: 'bg-blue-400'
    };

    return (
      <Badge className={`${shieldColors[mastery.shield_level as keyof typeof shieldColors]} text-white flex items-center gap-1`}>
        <Shield className="w-3 h-3" />
        {mastery.shield_level}
      </Badge>
    );
  };

  // Compact view (single line)
  if (compact) {
    return (
      <div className="flex items-center gap-3 py-2">
        <code className="text-sm font-mono text-slate-700 min-w-[120px]">
          {mastery.canonical_command}
        </code>
        <div className="flex-1">
          <Progress value={mastery.current_score} className="h-2" />
        </div>
        <span className={`text-sm font-bold ${getStatusColor()} min-w-[50px] text-right`}>
          {mastery.current_score.toFixed(0)}%
        </span>
        {getStatusBadge()}
      </div>
    );
  }

  // Full view (detailed card)
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <code className="text-base font-mono font-semibold text-slate-900">
            {mastery.canonical_command}
          </code>
        </div>
        <div className="flex items-center gap-2">
          {getShieldBadge()}
          {getStatusBadge()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-600">
            Current Proficiency
          </span>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-sm font-bold ${getStatusColor()}`}>
              {mastery.current_score.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getProgressBarColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${mastery.current_score}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        {/* Threshold marker at 80% */}
        <div className="relative h-1">
          <div
            className="absolute top-0 h-1 w-px bg-slate-400"
            style={{ left: '80%' }}
          />
          <span
            className="absolute top-0 text-xs text-slate-500"
            style={{ left: '80%', transform: 'translateX(-50%)' }}
          >
            80%
          </span>
        </div>
      </div>

      {/* Details */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span className="text-slate-600">Total Attempts</span>
            <span className="font-bold text-slate-900">{mastery.total_attempts}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
            <span className="text-slate-600">Success Rate</span>
            <span className="font-bold text-slate-900">
              {mastery.total_attempts > 0
                ? ((mastery.successful_attempts / mastery.total_attempts) * 100).toFixed(0)
                : 0}%
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <span className="text-green-700">Consecutive Wins</span>
            <span className="font-bold text-green-900">{mastery.consecutive_successes}</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-red-50 rounded">
            <span className="text-red-700">Consecutive Fails</span>
            <span className="font-bold text-red-900">{mastery.consecutive_failures}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// MASTERY PROGRESS LIST COMPONENT
// ============================================

export interface MasteryProgressListProps {
  masteries: MasteryProgress[];
  sortBy?: 'score' | 'attempts' | 'command';
  filterBy?: 'all' | 'mastered' | 'needs_practice' | 'needs_review';
  compact?: boolean;
}

export function MasteryProgressList({
  masteries,
  sortBy = 'score',
  filterBy = 'all',
  compact = false
}: MasteryProgressListProps) {
  // Filter
  let filtered = masteries;
  if (filterBy === 'mastered') {
    filtered = masteries.filter(m => m.mastered);
  } else if (filterBy === 'needs_practice') {
    filtered = masteries.filter(m => m.needs_practice);
  } else if (filterBy === 'needs_review') {
    filtered = masteries.filter(m => m.needs_review);
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.current_score - a.current_score;
      case 'attempts':
        return b.total_attempts - a.total_attempts;
      case 'command':
        return a.canonical_command.localeCompare(b.canonical_command);
      default:
        return 0;
    }
  });

  if (sorted.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No commands found matching the filter.
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-1' : 'space-y-3'}>
      {sorted.map((mastery, idx) => (
        <MasteryProgressIndicator
          key={idx}
          mastery={mastery}
          compact={compact}
          showDetails={!compact}
        />
      ))}
    </div>
  );
}

// ============================================
// MASTERY STATS SUMMARY COMPONENT
// ============================================

export interface MasteryStatsSummaryProps {
  masteries: MasteryProgress[];
}

export function MasteryStatsSummary({ masteries }: MasteryStatsSummaryProps) {
  const totalCommands = masteries.length;
  const masteredCount = masteries.filter(m => m.mastered).length;
  const needsPracticeCount = masteries.filter(m => m.needs_practice).length;
  const needsReviewCount = masteries.filter(m => m.needs_review).length;
  const averageScore = totalCommands > 0
    ? masteries.reduce((sum, m) => sum + m.current_score, 0) / totalCommands
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="text-2xl font-bold text-green-900 mb-1">
          {masteredCount}
        </div>
        <div className="text-sm text-green-700">Mastered</div>
      </div>
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-2xl font-bold text-yellow-900 mb-1">
          {needsPracticeCount}
        </div>
        <div className="text-sm text-yellow-700">Needs Practice</div>
      </div>
      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="text-2xl font-bold text-red-900 mb-1">
          {needsReviewCount}
        </div>
        <div className="text-sm text-red-700">Needs Review</div>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-2xl font-bold text-blue-900 mb-1">
          {averageScore.toFixed(0)}%
        </div>
        <div className="text-sm text-blue-700">Average Score</div>
      </div>
    </div>
  );
}
