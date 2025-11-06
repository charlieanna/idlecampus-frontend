import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Target } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Terminal } from './Terminal';

// ============================================
// TYPES
// ============================================

export interface ReviewContent {
  canonical_command: string;
  display_command: string;
  explanation: string;
  hints: string[];
  expected_output?: string;
  validation?: any;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface StealthReviewPromptProps {
  reviews: ReviewContent[];
  strategy: string;
  insertionPoint: { position: string; percentage: number };
  priority: number;
  onReviewComplete?: (results: ReviewResult[]) => void;
}

export interface ReviewResult {
  canonical_command: string;
  success: boolean;
  response_time: number;
}

// ============================================
// STEALTH REVIEW PROMPT COMPONENT
// ============================================

export function StealthReviewPrompt({
  reviews,
  strategy,
  insertionPoint,
  priority,
  onReviewComplete
}: StealthReviewPromptProps) {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; time: number } | null>(null);

  const currentReview = reviews[currentReviewIndex];
  const isLastReview = currentReviewIndex === reviews.length - 1;

  // Reset start time when moving to new review
  useEffect(() => {
    setStartTime(Date.now());
    setShowFeedback(false);
  }, [currentReviewIndex]);

  // Handle command validation
  const handleCommandValidation = async (command: string) => {
    const normalizedInput = command.trim().toLowerCase();
    const normalizedExpected = currentReview.canonical_command.trim().toLowerCase();
    const isCorrect = normalizedInput === normalizedExpected;

    const responseTime = Date.now() - startTime;

    // Store result
    const result: ReviewResult = {
      canonical_command: currentReview.canonical_command,
      success: isCorrect,
      response_time: responseTime
    };

    // Send to API
    await completeReview(result);

    // Update local state
    setResults([...results, result]);
    setLastResult({ success: isCorrect, time: responseTime });
    setShowFeedback(true);

    if (isCorrect) {
      // Move to next review after brief delay
      setTimeout(() => {
        if (isLastReview) {
          // All reviews complete
          if (onReviewComplete) {
            onReviewComplete([...results, result]);
          }
        } else {
          setCurrentReviewIndex(currentReviewIndex + 1);
        }
      }, 1500);

      return null; // Success, no error message
    } else {
      return `✗ Not quite. Expected: ${currentReview.display_command}`;
    }
  };

  // Call API to mark review as complete
  const completeReview = async (result: ReviewResult) => {
    try {
      const response = await fetch('/api/mastery/complete_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          canonical_command: result.canonical_command,
          success: result.success,
          response_time: result.response_time
        }),
      });

      if (!response.ok) {
        console.error('Failed to complete review:', response.status);
      }
    } catch (error) {
      console.error('Error completing review:', error);
    }
  };

  // Difficulty badge color
  const difficultyColors = {
    easy: 'bg-green-600',
    medium: 'bg-yellow-600',
    hard: 'bg-red-600'
  };

  // Strategy display text
  const strategyText = {
    lesson_opener: 'Quick Review',
    mid_lesson_break: 'Practice Break',
    concept_transition: 'Concept Review',
    lesson_closer: 'Review Summary'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="my-6"
    >
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">
              {strategyText[strategy as keyof typeof strategyText] || 'Practice Review'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={difficultyColors[currentReview.difficulty]}>
              {currentReview.difficulty}
            </Badge>
            {reviews.length > 1 && (
              <Badge variant="outline" className="text-purple-700 border-purple-300">
                {currentReviewIndex + 1} of {reviews.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Explanation */}
        <div className="mb-4">
          <p className="text-purple-800 text-sm leading-relaxed">
            {currentReview.explanation}
          </p>
        </div>

        {/* Prompt */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
          <p className="text-sm font-medium text-purple-900 mb-2">
            Try this command:
          </p>
          <code className="block bg-slate-900 text-green-400 p-3 rounded font-mono text-sm">
            {currentReview.display_command}
          </code>
        </div>

        {/* Hints */}
        {currentReview.hints && currentReview.hints.length > 0 && (
          <div className="mb-4">
            <details className="text-sm">
              <summary className="cursor-pointer text-purple-700 font-medium hover:text-purple-900">
                💡 Need a hint?
              </summary>
              <ul className="mt-2 ml-4 space-y-1 text-purple-800">
                {currentReview.hints.map((hint, idx) => (
                  <li key={idx} className="list-disc">
                    {hint}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}

        {/* Terminal */}
        <div className="mb-4 h-64">
          <Terminal
            trackMastery={false}
            expectedCommand={currentReview.canonical_command}
            onCommand={handleCommandValidation}
            currentContext="practice"
          />
        </div>

        {/* Feedback */}
        {showFeedback && lastResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-3 p-4 rounded-lg ${
              lastResult.success
                ? 'bg-green-100 border border-green-300'
                : 'bg-red-100 border border-red-300'
            }`}
          >
            {lastResult.success ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-green-900 font-medium">Great job!</p>
                  <div className="flex items-center gap-2 text-sm text-green-700 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Completed in {(lastResult.time / 1000).toFixed(1)}s</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                  <p className="text-red-900 font-medium">Try again</p>
                  <p className="text-sm text-red-700 mt-1">
                    Check the hints above if you need help
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Progress Indicator */}
        {reviews.length > 1 && (
          <div className="mt-4 flex gap-1">
            {reviews.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx < currentReviewIndex
                    ? 'bg-green-500'
                    : idx === currentReviewIndex
                    ? 'bg-purple-500'
                    : 'bg-purple-200'
                }`}
              />
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
