import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CoachMessage,
  ConditionalHint,
  LevelCoachConfig,
  CoachContext,
  CoachAction,
  getActiveMessages,
  getAvailableHints,
} from '../../types/coachConfig';
import { SystemGraph } from '../../types/graph';
import { TestResult } from '../../types/testCase';

interface CoachPanelProps {
  problemId: string;
  levelConfig: LevelCoachConfig;
  systemGraph: SystemGraph;
  testResults: Map<number, TestResult>;
  currentLevel: number;
  attempts: number;
  timeSpent: number;
  bottlenecks?: string[];
  failedValidators?: string[];
  onAction?: (action: CoachAction) => void;
  onNextLevel?: () => void;
  onShowHint?: (hint: ConditionalHint) => void;
  className?: string;
}

export function CoachPanel({
  problemId,
  levelConfig,
  systemGraph,
  testResults,
  currentLevel,
  attempts,
  timeSpent,
  bottlenecks = [],
  failedValidators = [],
  onAction,
  onNextLevel,
  onShowHint,
  className = '',
}: CoachPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [shownMessages, setShownMessages] = useState<Set<string>>(new Set());
  const [selectedHintLevel, setSelectedHintLevel] = useState(1);

  // Build coach context
  const coachContext: CoachContext = useMemo(
    () => ({
      systemGraph,
      testResults,
      currentLevel,
      attempts,
      timeSpent,
      bottlenecks,
      failedValidators,
      recentActions: [],
    }),
    [systemGraph, testResults, currentLevel, attempts, timeSpent, bottlenecks, failedValidators]
  );

  // Get active messages and available hints
  const activeMessages = useMemo(
    () => getActiveMessages(levelConfig, coachContext, shownMessages),
    [levelConfig, coachContext, shownMessages]
  );

  const availableHints = useMemo(
    () => getAvailableHints(levelConfig, coachContext),
    [levelConfig, coachContext]
  );

  // Mark messages as shown
  useEffect(() => {
    activeMessages.forEach(msg => {
      if (msg.showOnce) {
        setShownMessages(prev => new Set(prev).add(JSON.stringify(msg.trigger)));
      }
    });
  }, [activeMessages]);

  // Calculate progress
  const totalTests = testResults.size || 1;
  const passedTests = Array.from(testResults.values()).filter(r => r.passed).length;
  const progressPercent = (passedTests / totalTests) * 100;

  // Handle action execution
  const handleAction = (action: CoachAction) => {
    if (action.type === 'next_level' && onNextLevel) {
      onNextLevel();
    } else if (onAction) {
      onAction(action);
    }
  };

  const messageTypeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    hint: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    warning: 'bg-orange-50 border-orange-200 text-orange-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    celebration: 'bg-purple-50 border-purple-200 text-purple-900',
  };

  const messageTypeIcons = {
    info: '💡',
    hint: '🔍',
    warning: '⚠️',
    success: '✅',
    celebration: '🎉',
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`flex flex-col bg-white border-r border-gray-200 ${className}`}
      style={{ width: isCollapsed ? '60px' : '320px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        {!isCollapsed && (
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              🎓 Coach
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Level {levelConfig.level}: {levelConfig.title}
            </p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-white rounded-lg transition-colors"
          title={isCollapsed ? 'Expand coach' : 'Collapse coach'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Level Goal */}
          <div className="p-4 border-b border-gray-100 bg-blue-50">
            <div className="flex items-start gap-2">
              <span className="text-xl">🎯</span>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Goal</h4>
                <p className="text-xs text-gray-700">{levelConfig.goal}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{passedTests}/{totalTests} tests</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Active Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {activeMessages.map((message, index) => (
                <motion.div
                  key={`${message.message}-${index}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-lg border ${
                    messageTypeStyles[message.messageType || 'info']
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg flex-shrink-0">
                      {message.icon || messageTypeIcons[message.messageType || 'info']}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>

                      {/* Action Button */}
                      {message.action && (
                        <button
                          onClick={() => handleAction(message.action!)}
                          className="mt-2 px-3 py-1.5 bg-white border border-current rounded-lg text-xs font-medium hover:bg-opacity-80 transition-colors"
                        >
                          {message.action.type === 'next_level' && 'Continue to Next Level →'}
                          {message.action.type === 'next_problem' && 'Try Next Problem →'}
                          {message.action.type === 'show_hint' && 'Show Hint'}
                          {message.action.type === 'show_solution' && 'View Solution'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* No Active Messages */}
            {activeMessages.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">Keep working on your design...</p>
                <p className="text-xs mt-1">I'll guide you when needed!</p>
              </div>
            )}
          </div>

          {/* Available Hints Section */}
          {availableHints.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-yellow-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💭</span>
                <h4 className="text-sm font-semibold text-gray-900">
                  Need a Hint?
                </h4>
              </div>

              {/* Hint Level Selector */}
              <div className="flex gap-2 mb-3">
                {[1, 2, 3].map(level => {
                  const hintsAtLevel = availableHints.filter(h => h.hintLevel === level);
                  if (hintsAtLevel.length === 0) return null;

                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedHintLevel(level)}
                      className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                        selectedHintLevel === level
                          ? 'bg-yellow-200 text-yellow-900 border border-yellow-300'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {level === 1 && '💡 Subtle'}
                      {level === 2 && '🔍 Specific'}
                      {level === 3 && '🎯 Direct'}
                    </button>
                  );
                })}
              </div>

              {/* Display Selected Hints */}
              <div className="space-y-2">
                {availableHints
                  .filter(hint => hint.hintLevel === selectedHintLevel)
                  .map((hint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-2.5 bg-white rounded border border-yellow-200 text-xs text-gray-700"
                    >
                      {hint.hint}
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* Stats Footer */}
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-gray-500">Attempts</div>
                <div className="text-sm font-semibold text-gray-900">{attempts}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Time</div>
                <div className="text-sm font-semibold text-gray-900">
                  {Math.floor(timeSpent / 60)}m
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Hints</div>
                <div className="text-sm font-semibold text-gray-900">
                  {availableHints.length}
                </div>
              </div>
            </div>
          </div>

          {/* Learning Objectives (Collapsible) */}
          {levelConfig.learningObjectives && levelConfig.learningObjectives.length > 0 && (
            <details className="border-t border-gray-200">
              <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-xs font-medium text-gray-700">
                📚 What You'll Learn
              </summary>
              <div className="px-4 pb-3 pt-1 bg-gray-50">
                <ul className="space-y-1.5">
                  {levelConfig.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          )}
        </>
      )}
    </motion.div>
  );
}

/**
 * Compact Coach Widget (for mobile or minimal UI)
 */
export function CoachWidget({
  activeMessagesCount,
  availableHintsCount,
  onExpand,
}: {
  activeMessagesCount: number;
  availableHintsCount: number;
  onExpand: () => void;
}) {
  return (
    <motion.button
      onClick={onExpand}
      className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex flex-col items-center">
        <span className="text-2xl">🎓</span>
        {(activeMessagesCount > 0 || availableHintsCount > 0) && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-500 rounded-full">
            {activeMessagesCount + availableHintsCount}
          </span>
        )}
      </div>
    </motion.button>
  );
}