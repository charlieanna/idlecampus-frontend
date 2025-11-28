/**
 * Challenge Progress Card Component
 * 
 * Displays a single challenge with 5-level progression indicator.
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md section 3.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { getChallengeUrl } from '../../builder/utils/challengeUrl';
import { ProgressiveChallenge, ChallengeProgress } from '../types';

interface ChallengeProgressCardProps {
  challenge: ProgressiveChallenge;
  progress?: ChallengeProgress;
  isUnlocked: boolean;
  trackColor?: 'blue' | 'purple' | 'green';
}

/**
 * Challenge Progress Card Component
 */
export function ChallengeProgressCard({
  challenge,
  progress,
  isUnlocked,
  trackColor = 'blue'
}: ChallengeProgressCardProps) {
  const levelsCompleted = progress?.levelsCompleted || [];
  const currentLevel = progress?.currentLevel || 1;
  const totalXP = challenge.levels.reduce((sum, level) => sum + level.xpReward, 0);
  const earnedXP = progress?.xpEarned || 0;

  const getLevelStatus = (levelNum: number): 'completed' | 'available' | 'locked' => {
    if (levelsCompleted.includes(levelNum as any)) return 'completed';
    if (!isUnlocked) return 'locked';
    if (levelNum <= currentLevel) return 'available';
    return 'locked';
  };

  const colorClasses = {
    blue: {
      bg: 'bg-blue-600',
      border: 'border-blue-600',
      text: 'text-blue-600',
      hover: 'hover:bg-blue-700'
    },
    purple: {
      bg: 'bg-purple-600',
      border: 'border-purple-600',
      text: 'text-purple-600',
      hover: 'hover:bg-purple-700'
    },
    green: {
      bg: 'bg-green-600',
      border: 'border-green-600',
      text: 'text-green-600',
      hover: 'hover:bg-green-700'
    }
  };

  const colors = colorClasses[trackColor];

  return (
    <div
      className={`bg-white rounded-lg border-2 transition-all ${
        !isUnlocked
          ? 'border-gray-200 opacity-60'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      } p-5`}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900">
                {challenge.title}
              </h3>
              {!isUnlocked && (
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              )}
              {progress?.status === 'completed' && (
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {challenge.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="capitalize">{challenge.difficulty}</span>
          <span>•</span>
          <span>{earnedXP}/{totalXP} XP</span>
        </div>
      </div>

      {/* 5-Level Progression Visual */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">
            {levelsCompleted.length}/5 levels
          </span>
          <span className="text-xs text-gray-500">
            {Math.round((levelsCompleted.length / 5) * 100)}%
          </span>
        </div>

        {/* Level indicators */}
        <div className="flex items-center gap-1.5">
          {challenge.levels.map((level) => {
            const status = getLevelStatus(level.levelNumber);
            return (
              <div
                key={level.levelNumber}
                className="flex-1 flex flex-col items-center gap-1"
                title={`${level.levelName} - ${level.xpReward} XP`}
              >
                {/* Level circle */}
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all ${
                    status === 'completed'
                      ? `${colors.bg} ${colors.border} text-white`
                      : status === 'available'
                      ? `bg-white ${colors.border} ${colors.text}`
                      : 'bg-gray-100 border-gray-200 text-gray-400'
                  }`}
                >
                  {status === 'completed' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : status === 'locked' ? (
                    '🔒'
                  ) : (
                    level.levelNumber
                  )}
                </div>

                {/* Level name (abbreviated) */}
                <div className="text-xs text-gray-500 text-center truncate w-full">
                  L{level.levelNumber}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
          <div
            className={`${colors.bg} h-1 rounded-full transition-all duration-300`}
            style={{ width: `${(levelsCompleted.length / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Action */}
      <div className="flex items-center justify-between">
        {!isUnlocked ? (
          <span className="text-xs text-gray-500">🔒 Locked</span>
        ) : !progress ? (
          <Link
            to={getChallengeUrl(challenge.id)}
            className={`w-full text-center px-3 py-2 ${colors.bg} text-white text-sm font-medium rounded-md ${colors.hover}`}
          >
            Start →
          </Link>
        ) : progress.status === 'completed' ? (
          <Link
            to={getChallengeUrl(challenge.id)}
            className="w-full text-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
          >
            Review
          </Link>
        ) : (
          <Link
            to={getChallengeUrl(challenge.id)}
            className={`w-full text-center px-3 py-2 ${colors.bg} text-white text-sm font-medium rounded-md ${colors.hover}`}
          >
            Continue L{currentLevel} →
          </Link>
        )}
      </div>
    </div>
  );
}