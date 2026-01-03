import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowRight, Zap, Target, Star, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { useFamilyMasteryStore } from '../../stores/familyMasteryStore';

interface MasteryFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  earnedXp?: number;
  masteryGain?: number;
  problemTitle?: string;
}

export const MasteryFeedbackModal: React.FC<MasteryFeedbackModalProps> = ({
  isOpen,
  onClose,
  onContinue,
  earnedXp = 50,
  masteryGain = 5,
  problemTitle = "Problem Solved"
}) => {
  const { learningQueue } = useFamilyMasteryStore();
  const nextItem = learningQueue.queue[0]; // Next item in queue

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header / Celebration */}
          <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-center overflow-hidden">
            {/* Background Decorations */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl"
            />

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative z-10 mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4"
            >
              <Trophy className="w-10 h-10 text-yellow-500 fill-yellow-500" />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 text-2xl font-bold text-white mb-1"
            >
              Excellent!
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 text-indigo-100 font-medium"
            >
              You've mastered {problemTitle}
            </motion.p>
          </div>

          {/* Stats & Progress */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30 text-center">
                <div className="flex justify-center mb-2">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-500">+{earnedXp}</div>
                <div className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium uppercase tracking-wide">XP Earned</div>
              </Card>
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30 text-center">
                <div className="flex justify-center mb-2">
                  <Target className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-500">+{masteryGain}%</div>
                <div className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium uppercase tracking-wide">Family Mastery</div>
              </Card>
            </div>

            {/* Next Up Preview */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Up Next in Queue</h3>
              {nextItem ? (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${nextItem.priority > 8 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                    <Star className="w-5 h-5 fill-current opacity-20" />
                    <span className="absolute font-bold text-xs">{nextItem.priority}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-slate-700 dark:text-slate-200 truncate">
                      {nextItem.familyId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      Reason: {nextItem.reason}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-sm italic">
                  <CheckCircle className="w-4 h-4" />
                  Queue is empty! Great job!
                </div>
              )}
            </div>

            {/* Actions */}
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25"
              onClick={onContinue}
            >
              Continue Journey <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
