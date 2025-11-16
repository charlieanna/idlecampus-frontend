import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface LevelSuccessModalProps {
  isOpen: boolean;
  level: number;
  celebrationMessage: string;
  stats?: {
    testsPassedLabel: string;
    testsPassedValue: string;
    latencyLabel: string;
    latencyValue: string;
    costLabel?: string;
    costValue?: string;
    availabilityLabel?: string;
    availabilityValue?: string;
  };
  achievements?: {
    icon: string;
    title: string;
    description: string;
  }[];
  hasNextLevel: boolean;
  nextLevelTitle?: string;
  nextProblemTitle?: string;
  onClose: () => void;
  onNextLevel?: () => void;
  onNextProblem?: () => void;
  onReviewDesign?: () => void;
}

export function LevelSuccessModal({
  isOpen,
  level,
  celebrationMessage,
  stats,
  achievements = [],
  hasNextLevel,
  nextLevelTitle,
  nextProblemTitle,
  onClose,
  onNextLevel,
  onNextProblem,
  onReviewDesign,
}: LevelSuccessModalProps) {
  const [showStats, setShowStats] = useState(false);

  // Trigger confetti on open
  useEffect(() => {
    if (isOpen) {
      // Initial burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
      });

      // Show stats after brief delay
      setTimeout(() => setShowStats(true), 500);

      // Additional confetti bursts
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
    } else {
      setShowStats(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-6 text-center relative overflow-hidden">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="text-6xl mb-3"
                >
                  🎉
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Level {level} Complete!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white text-opacity-90 text-sm"
                >
                  Outstanding work! 🚀
                </motion.p>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Celebration Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-6"
                >
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-900 whitespace-pre-wrap">
                      {celebrationMessage}
                    </p>
                  </div>
                </motion.div>

                {/* Stats */}
                {stats && showStats && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-6"
                  >
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      📊 Your Performance
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <StatCard
                        label={stats.testsPassedLabel}
                        value={stats.testsPassedValue}
                        icon="✅"
                        delay={0.7}
                      />
                      <StatCard
                        label={stats.latencyLabel}
                        value={stats.latencyValue}
                        icon="⚡"
                        delay={0.75}
                      />
                      {stats.costLabel && stats.costValue && (
                        <StatCard
                          label={stats.costLabel}
                          value={stats.costValue}
                          icon="💰"
                          delay={0.8}
                        />
                      )}
                      {stats.availabilityLabel && stats.availabilityValue && (
                        <StatCard
                          label={stats.availabilityLabel}
                          value={stats.availabilityValue}
                          icon="🎯"
                          delay={0.85}
                        />
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Achievements */}
                {achievements.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mb-6"
                  >
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      🏆 Achievements Unlocked
                    </h3>
                    <div className="space-y-2">
                      {achievements.map((achievement, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg"
                        >
                          <span className="text-2xl">{achievement.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-purple-900">
                              {achievement.title}
                            </div>
                            <div className="text-xs text-purple-700">
                              {achievement.description}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="space-y-3"
                >
                  {hasNextLevel ? (
                    <>
                      <button
                        onClick={onNextLevel}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <span>Continue to {nextLevelTitle || 'Next Level'}</span>
                        <span>→</span>
                      </button>
                      <button
                        onClick={onReviewDesign}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Review My Design
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 mb-3">
                        <div className="text-sm font-medium text-purple-900 mb-1">
                          🎓 Next Challenge
                        </div>
                        <div className="text-xs text-purple-700">
                          {nextProblemTitle || 'Try another problem to continue learning!'}
                        </div>
                      </div>
                      <button
                        onClick={onNextProblem}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <span>Start {nextProblemTitle || 'Next Problem'}</span>
                        <span>→</span>
                      </button>
                      <button
                        onClick={onReviewDesign}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Review My Design
                      </button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatCard({
  label,
  value,
  icon,
  delay,
}: {
  label: string;
  value: string;
  icon: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-white border border-gray-200 rounded-lg p-3 text-center"
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className="text-sm font-bold text-gray-900">{value}</div>
    </motion.div>
  );
}

/**
 * Minimal success notification (alternative to full modal)
 */
export function LevelSuccessToast({
  level,
  message,
  onNext,
}: {
  level: number;
  message: string;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl p-4 max-w-sm z-50 border border-green-200"
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">🎉</span>
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">Level {level} Complete!</h4>
          <p className="text-sm text-gray-600 mb-3">{message}</p>
          <button
            onClick={onNext}
            className="px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
          >
            Continue →
          </button>
        </div>
      </div>
    </motion.div>
  );
}