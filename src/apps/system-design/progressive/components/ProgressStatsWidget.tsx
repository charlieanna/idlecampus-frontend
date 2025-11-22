/**
 * Progress Stats Widget Component
 * 
 * Shows user level, XP, streak, and completion stats.
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md section 3.
 */

import React from 'react';
import { UserProgressState, getXPProgressInLevel } from '../types';

interface ProgressStatsWidgetProps {
  progress: UserProgressState;
  totalChallenges: number;
}

/**
 * Progress Stats Widget Component
 */
export function ProgressStatsWidget({ progress, totalChallenges }: ProgressStatsWidgetProps) {
  const xpProgress = getXPProgressInLevel(progress.totalXP);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 Your Progress
      </h3>

      {/* Level and XP */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-sm font-medium text-gray-500">Current Level</div>
            <div className="text-3xl font-bold text-blue-600">
              {progress.currentLevel}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-500">Total XP</div>
            <div className="text-2xl font-bold text-purple-600">
              {progress.totalXP}
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>XP to Next Level</span>
            <span>
              {xpProgress.xpInLevel} / {xpProgress.xpNeeded}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress.progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">
            {Math.round(xpProgress.progressPercentage)}% complete
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Challenges Completed */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium text-gray-600">Completed</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {progress.totalChallengesCompleted}
          </div>
          <div className="text-xs text-gray-500">
            of {totalChallenges} challenges
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🔥</span>
            <span className="text-xs font-medium text-gray-600">Streak</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {progress.currentStreak}
          </div>
          <div className="text-xs text-gray-500">
            days • Best: {progress.longestStreak}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Levels Completed</span>
          <span className="font-semibold text-gray-900">
            {progress.totalLevelsCompleted}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Time Spent</span>
          <span className="font-semibold text-gray-900">
            {Math.round(progress.totalTimeSpentMinutes / 60)}h {progress.totalTimeSpentMinutes % 60}m
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Completion Rate</span>
          <span className="font-semibold text-gray-900">
            {Math.round((progress.totalChallengesCompleted / totalChallenges) * 100)}%
          </span>
        </div>
      </div>

      {/* Recent Achievements */}
      {progress.achievements.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            🏆 Recent Achievements
          </h4>
          <div className="space-y-2">
            {progress.achievements.slice(-3).reverse().map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
              >
                <span className="text-xl">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900 truncate">
                    {achievement.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    +{achievement.xpReward} XP
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}