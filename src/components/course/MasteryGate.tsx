import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Target, TrendingUp, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

// ============================================
// TYPES
// ============================================

export interface WeakCommand {
  command: string;
  canonical_command: string;
  reason: 'not_attempted' | 'low_proficiency' | 'insufficient_attempts';
  current_score: number;
  required_score: number;
  total_attempts: number;
  min_attempts?: number;
  consecutive_failures?: number;
}

export interface GateStatus {
  can_progress: boolean;
  total_commands: number;
  mastered_count: number;
  weak_commands: WeakCommand[];
  completion_percentage: number;
  gate_message: string;
}

export interface MasteryGateProps {
  gateStatus: GateStatus;
  lessonTitle: string;
  onStartDrill?: () => void;
  onRetryCheck?: () => void;
  showDrillButton?: boolean;
}

// ============================================
// MASTERY GATE COMPONENT
// ============================================

export function MasteryGate({
  gateStatus,
  lessonTitle,
  onStartDrill,
  onRetryCheck,
  showDrillButton = true
}: MasteryGateProps) {
  const [expanded, setExpanded] = useState(false);

  // If can progress, show success state
  if (gateStatus.can_progress) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="my-6"
      >
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-300">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-green-900 mb-1">
                Mastery Achieved!
              </h3>
              <p className="text-green-700">
                {gateStatus.gate_message}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Badge className="bg-green-600 text-white">
                  {gateStatus.mastered_count}/{gateStatus.total_commands} Commands Mastered
                </Badge>
                <span className="text-green-600 text-sm font-medium">
                  {gateStatus.completion_percentage}% Complete
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Blocked state - show gate
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="my-6"
    >
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-300">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0">
            <Lock className="w-10 h-10 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-orange-900 mb-2">
              Mastery Gate: {lessonTitle}
            </h3>
            <p className="text-orange-800 mb-3">
              {gateStatus.gate_message}
            </p>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-700">
                  Progress to Unlock
                </span>
                <span className="text-sm font-bold text-orange-900">
                  {gateStatus.completion_percentage}%
                </span>
              </div>
              <Progress
                value={gateStatus.completion_percentage}
                className="h-3"
              />
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700">
                  {gateStatus.mastered_count}/{gateStatus.total_commands} Mastered
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-700">
                  {gateStatus.weak_commands.length} Need Practice
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Weak Commands List */}
        <div className="mb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-300 transition-colors">
              <span className="font-medium text-orange-900">
                Commands Requiring Mastery ({gateStatus.weak_commands.length})
              </span>
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
          </button>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 space-y-2"
            >
              {gateStatus.weak_commands.map((cmd, idx) => (
                <CommandRequirement key={idx} command={cmd} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {showDrillButton && onStartDrill && (
            <Button
              onClick={onStartDrill}
              className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Start Practice Drills
            </Button>
          )}
          {onRetryCheck && (
            <Button
              onClick={onRetryCheck}
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              Re-check Progress
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-orange-100 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800">
            <strong>💡 Tip:</strong> Complete the practice drills to master these commands.
            Each command requires at least 3 successful attempts with 80% proficiency to unlock the next lesson.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

// ============================================
// COMMAND REQUIREMENT SUB-COMPONENT
// ============================================

function CommandRequirement({ command }: { command: WeakCommand }) {
  const getReasonBadge = () => {
    switch (command.reason) {
      case 'not_attempted':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
            Not Attempted
          </Badge>
        );
      case 'low_proficiency':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            Low Proficiency
          </Badge>
        );
      case 'insufficient_attempts':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            Need More Practice
          </Badge>
        );
    }
  };

  const getProgressColor = () => {
    const score = command.current_score;
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-4 bg-white border-orange-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <code className="text-sm font-mono bg-slate-900 text-green-400 px-2 py-1 rounded">
            {command.command}
          </code>
        </div>
        {getReasonBadge()}
      </div>

      {/* Progress to Required Score */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-600">
            Current Proficiency
          </span>
          <span className="text-xs font-bold text-slate-900">
            {command.current_score}% / {command.required_score}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-500`}
            style={{ width: `${(command.current_score / command.required_score) * 100}%` }}
          />
        </div>
      </div>

      {/* Attempts */}
      <div className="flex items-center gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>
            {command.total_attempts} {command.total_attempts === 1 ? 'attempt' : 'attempts'}
          </span>
        </div>
        {command.min_attempts && command.total_attempts < command.min_attempts && (
          <span className="text-orange-600 font-medium">
            {command.min_attempts - command.total_attempts} more needed
          </span>
        )}
        {command.consecutive_failures && command.consecutive_failures > 0 && (
          <span className="text-red-600">
            {command.consecutive_failures} recent failures
          </span>
        )}
      </div>
    </Card>
  );
}
