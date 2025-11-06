import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Trophy,
  ChevronRight,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Terminal } from './Terminal';

// ============================================
// TYPES
// ============================================

export interface Drill {
  drill_id: string;
  canonical_command: string;
  display_command: string;
  expected_command: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
  hints: string[];
  success_criteria: any;
  max_attempts: number;
  time_limit_seconds: number;
  points: number;
  current_score: number;
  reason: string;
}

export interface DrillSessionData {
  session_id: string;
  drills: Drill[];
  total_drills: number;
  estimated_time_minutes: number;
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export interface DrillSessionProps {
  session: DrillSessionData;
  onSessionComplete?: (results: DrillResult[]) => void;
  onExit?: () => void;
}

export interface DrillResult {
  drill_id: string;
  canonical_command: string;
  success: boolean;
  attempts_used: number;
  time_taken: number;
  hints_viewed: number;
  points_earned: number;
}

// ============================================
// DRILL SESSION COMPONENT
// ============================================

export function DrillSession({ session, onSessionComplete, onExit }: DrillSessionProps) {
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [results, setResults] = useState<DrillResult[]>([]);
  const [currentAttempts, setCurrentAttempts] = useState(0);
  const [hintsViewed, setHintsViewed] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showHints, setShowHints] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; time: number } | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);

  const currentDrill = session.drills[currentDrillIndex];
  const isLastDrill = currentDrillIndex === session.drills.length - 1;

  // Initialize time remaining for current drill
  useEffect(() => {
    if (currentDrill) {
      setTimeRemaining(currentDrill.time_limit_seconds);
      setStartTime(Date.now());
      setCurrentAttempts(0);
      setHintsViewed(0);
      setShowHints(false);
      setLastResult(null);
    }
  }, [currentDrillIndex, currentDrill]);

  // Countdown timer
  useEffect(() => {
    if (!currentDrill || sessionComplete) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - mark as failed
          handleDrillFailure();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentDrill, sessionComplete]);

  // Handle command validation
  const handleCommandValidation = async (command: string) => {
    const trimmedInput = command.trim();
    const expectedCmd = currentDrill.expected_command.trim();
    const isCorrect = trimmedInput === expectedCmd;

    const timeTaken = Date.now() - startTime;
    const newAttempts = currentAttempts + 1;
    setCurrentAttempts(newAttempts);

    if (isCorrect) {
      // Success!
      await handleDrillSuccess(timeTaken, newAttempts);
      return null;
    } else {
      // Failure
      if (newAttempts >= currentDrill.max_attempts) {
        // Out of attempts
        handleDrillFailure();
        return `✗ Out of attempts. The correct command was: ${currentDrill.expected_command}`;
      }

      setLastResult({ success: false, time: timeTaken });
      return `✗ Not quite. ${currentDrill.max_attempts - newAttempts} attempts remaining.`;
    }
  };

  // Handle successful drill completion
  const handleDrillSuccess = async (timeTaken: number, attempts: number) => {
    setLastResult({ success: true, time: timeTaken });

    const result: DrillResult = {
      drill_id: currentDrill.drill_id,
      canonical_command: currentDrill.canonical_command,
      success: true,
      attempts_used: attempts,
      time_taken: timeTaken,
      hints_viewed: hintsViewed,
      points_earned: calculatePoints(timeTaken, attempts)
    };

    // Save result
    setResults([...results, result]);

    // Call API to record completion
    await completeDrill(result);

    // Move to next drill after delay
    setTimeout(() => {
      if (isLastDrill) {
        setSessionComplete(true);
      } else {
        setCurrentDrillIndex(currentDrillIndex + 1);
      }
    }, 2000);
  };

  // Handle failed drill completion
  const handleDrillFailure = async () => {
    const timeTaken = Date.now() - startTime;

    const result: DrillResult = {
      drill_id: currentDrill.drill_id,
      canonical_command: currentDrill.canonical_command,
      success: false,
      attempts_used: currentAttempts,
      time_taken: timeTaken,
      hints_viewed: hintsViewed,
      points_earned: 0
    };

    setResults([...results, result]);
    await completeDrill(result);

    // Move to next drill
    setTimeout(() => {
      if (isLastDrill) {
        setSessionComplete(true);
      } else {
        setCurrentDrillIndex(currentDrillIndex + 1);
      }
    }, 2000);
  };

  // Calculate points based on performance
  const calculatePoints = (timeTaken: number, attempts: number): number => {
    let points = currentDrill.points;

    // Penalty for multiple attempts
    points -= (attempts - 1) * 5;

    // Penalty for hints
    points -= hintsViewed * 3;

    // Bonus for speed (if under half the time limit)
    const timeLimit = currentDrill.time_limit_seconds * 1000;
    if (timeTaken < timeLimit / 2) {
      points += 10;
    }

    return Math.max(0, points);
  };

  // Call API to complete drill
  const completeDrill = async (result: DrillResult) => {
    try {
      await fetch('/api/mastery/complete_drill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drill_id: result.drill_id,
          canonical_command: result.canonical_command,
          success: result.success,
          response_time: result.time_taken,
          attempts_used: result.attempts_used,
          hints_used: result.hints_viewed
        })
      });
    } catch (error) {
      console.error('Failed to record drill completion:', error);
    }
  };

  // Toggle hints
  const handleShowHints = () => {
    if (!showHints) {
      setHintsViewed(hintsViewed + 1);
    }
    setShowHints(!showHints);
  };

  // Session complete view
  if (sessionComplete) {
    return <SessionSummary session={session} results={results} onComplete={onSessionComplete} onExit={onExit} />;
  }

  // Drill view
  const progressPercentage = ((currentDrillIndex + 1) / session.total_drills) * 100;
  const difficultyColor = {
    easy: 'bg-green-600',
    medium: 'bg-yellow-600',
    hard: 'bg-red-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="my-6"
    >
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-900">
              Practice Drill {currentDrillIndex + 1}/{session.total_drills}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={difficultyColor[currentDrill.difficulty]}>
              {currentDrill.difficulty.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {currentDrill.points} pts
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className={`font-mono font-bold ${timeRemaining < 30 ? 'text-red-600' : 'text-blue-900'}`}>
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900">
              {currentAttempts}/{currentDrill.max_attempts} attempts
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900">
              {hintsViewed} hints used
            </span>
          </div>
        </div>

        {/* Explanation */}
        <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
          <p className="text-blue-900 font-medium mb-2">
            {currentDrill.explanation}
          </p>
          <div className="p-3 bg-slate-900 rounded">
            <code className="text-green-400 font-mono text-sm">
              {currentDrill.display_command}
            </code>
          </div>
        </div>

        {/* Hints */}
        {currentDrill.hints && currentDrill.hints.length > 0 && (
          <div className="mb-4">
            <Button
              onClick={handleShowHints}
              variant="outline"
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHints ? 'Hide Hints' : 'Show Hints'} (-3 pts per hint)
            </Button>

            {showHints && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <ul className="space-y-1">
                  {currentDrill.hints.map((hint, idx) => (
                    <li key={idx} className="text-sm text-yellow-900 list-disc ml-4">
                      {hint}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        )}

        {/* Terminal */}
        <div className="mb-4 h-64">
          <Terminal
            trackMastery={false}
            expectedCommand={currentDrill.expected_command}
            onCommand={handleCommandValidation}
            currentContext="practice"
          />
        </div>

        {/* Feedback */}
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-lg border ${
              lastResult.success
                ? 'bg-green-100 border-green-300'
                : 'bg-red-100 border-red-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {lastResult.success ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-green-900 font-medium">Excellent! Correct answer!</p>
                    <p className="text-green-700 text-sm">
                      +{calculatePoints(lastResult.time, currentAttempts)} points
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                    <p className="text-red-900 font-medium">Try again</p>
                    <p className="text-red-700 text-sm">
                      {currentDrill.max_attempts - currentAttempts} attempts remaining
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Exit Button */}
        {onExit && (
          <div className="mt-4">
            <Button
              onClick={onExit}
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900"
            >
              Exit Drill Session
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

// ============================================
// SESSION SUMMARY SUB-COMPONENT
// ============================================

function SessionSummary({
  session,
  results,
  onComplete,
  onExit
}: {
  session: DrillSessionData;
  results: DrillResult[];
  onComplete?: (results: DrillResult[]) => void;
  onExit?: () => void;
}) {
  const totalPoints = results.reduce((sum, r) => sum + r.points_earned, 0);
  const successCount = results.filter(r => r.success).length;
  const successRate = (successCount / results.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="my-6"
    >
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300">
        <div className="text-center mb-6">
          <Trophy className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-purple-900 mb-2">
            Drill Session Complete!
          </h2>
          <p className="text-purple-700">
            You completed {successCount} out of {results.length} drills successfully
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center bg-white">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {successRate.toFixed(0)}%
            </div>
            <div className="text-sm text-slate-600">Success Rate</div>
          </Card>
          <Card className="p-4 text-center bg-white">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {totalPoints}
            </div>
            <div className="text-sm text-slate-600">Points Earned</div>
          </Card>
          <Card className="p-4 text-center bg-white">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {results.length}
            </div>
            <div className="text-sm text-slate-600">Drills Completed</div>
          </Card>
        </div>

        {/* Results List */}
        <div className="space-y-2 mb-6">
          {results.map((result, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-lg ${
                result.success ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {result.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <code className="text-sm font-mono">{result.canonical_command}</code>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className={result.success ? 'text-green-700' : 'text-red-700'}>
                  {result.attempts_used} {result.attempts_used === 1 ? 'attempt' : 'attempts'}
                </span>
                <Badge className={result.success ? 'bg-green-600' : 'bg-red-600'}>
                  {result.points_earned} pts
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          {onComplete && (
            <Button
              onClick={() => onComplete(results)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Continue Learning
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {onExit && (
            <Button
              onClick={onExit}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              Exit
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
