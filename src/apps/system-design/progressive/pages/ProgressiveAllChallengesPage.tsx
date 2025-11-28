/**
 * All Challenges Page
 * 
 * Shows all available progressive challenges in a single list.
 * Allows users to browse and access any challenge regardless of track.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { progressiveProgressService } from '../services/progressService';
import { getAllProgressiveChallenges, isChallengeUnlocked } from '../services/challengeMapper';
import {
  ProgressiveChallenge,
  ChallengeProgress,
  UserProgressState
} from '../types';

/**
 * All Challenges Page Component
 */
export function ProgressiveAllChallengesPage() {
  const [progress, setProgress] = useState<UserProgressState | null>(null);
  const [challenges, setChallenges] = useState<ProgressiveChallenge[]>([]);

  useEffect(() => {
    const userProgress = progressiveProgressService.getProgress();
    setProgress(userProgress);

    // Get all challenges and flatten them into a single array
    const allChallenges = getAllProgressiveChallenges();
    const flattenedChallenges = [
      ...allChallenges.fundamentals,
      ...allChallenges.concepts,
      ...allChallenges.systems
    ];
    setChallenges(flattenedChallenges);
  }, []);

  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading challenges...</p>
        </div>
      </div>
    );
  }

  const completedChallenges = Object.keys(progress.challengeProgress).filter(
    id => progress.challengeProgress[id].status === 'completed'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/system-design/progressive"
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">📚</span>
                  <h1 className="text-2xl font-bold text-gray-900">
                    All Challenges
                  </h1>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Browse all {challenges.length} system design challenges
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Challenge List */}
        <div>
          <div className="space-y-4">
            {challenges.map((challenge) => {
              const challengeProgress = progress.challengeProgress[challenge.id];
              const isUnlocked = isChallengeUnlocked(
                challenge.id,
                completedChallenges,
                progress.currentLevel,
                progress.trackProgress
              );

              // Determine track color
              let trackColor = 'blue';
              if (challenge.track === 'concepts') trackColor = 'purple';
              if (challenge.track === 'systems') trackColor = 'green';

              return (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  progress={challengeProgress}
                  isUnlocked={isUnlocked}
                  trackColor={trackColor}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Challenge Card Component
 * (Duplicated from TrackDetailPage for independence, could be refactored to shared component)
 */
interface ChallengeCardProps {
  challenge: ProgressiveChallenge;
  progress?: ChallengeProgress;
  isUnlocked: boolean;
  trackColor: string;
}

function ChallengeCard({ challenge, progress, isUnlocked, trackColor }: ChallengeCardProps) {
  const levelsCompleted = progress?.levelsCompleted || [];
  const currentLevel = progress?.currentLevel || 1;
  const totalXP = challenge.levels.reduce((sum, level) => sum + level.xpReward, 0);
  const earnedXP = progress?.xpEarned || 0;

  const getLevelStatus = (levelNum: number): 'completed' | 'current' | 'available' | 'locked' => {
    if (levelsCompleted.includes(levelNum as any)) return 'completed';
    // For "All Challenges" view, we might want to show everything as unlocked or keep lock logic
    // Keeping lock logic for consistency
    if (!isUnlocked) return 'locked';
    if (levelNum === currentLevel && progress?.status === 'in_progress') return 'current';
    if (levelNum <= currentLevel) return 'available';
    return 'locked';
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 ${!isUnlocked ? 'border-gray-200 opacity-60' : 'border-gray-200 hover:border-gray-300'
      } p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {challenge.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${challenge.track === 'fundamentals' ? 'bg-blue-100 text-blue-800' :
              challenge.track === 'concepts' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
              {challenge.track}
            </span>
            {!isUnlocked && (
              <span className="text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            )}
            {progress?.status === 'completed' && (
              <span className="text-green-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Difficulty: {challenge.difficulty}</span>
            <span>•</span>
            <span>Max XP: {totalXP}</span>
            {progress && (
              <>
                <span>•</span>
                <span className="text-blue-600 font-medium">
                  Earned: {earnedXP} XP
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 5-Level Progression */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Progress: {levelsCompleted.length}/5 levels
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((levelsCompleted.length / 5) * 100)}%
          </span>
        </div>

        {/* Visual level progression */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
            <div
              className={`h-full bg-${trackColor}-600 transition-all duration-500`}
              style={{ width: `${(levelsCompleted.length / 5) * 100}%` }}
            ></div>
          </div>

          {/* Level nodes */}
          <div className="relative grid grid-cols-5 gap-2">
            {challenge.levels.map((level) => {
              const status = getLevelStatus(level.levelNumber);
              return (
                <div key={level.levelNumber} className="flex flex-col items-center">
                  {/* Level circle */}
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center z-10 transition-all ${status === 'completed'
                      ? `bg-${trackColor}-600 border-${trackColor}-600 text-white`
                      : status === 'current'
                        ? `bg-white border-${trackColor}-600 text-${trackColor}-600`
                        : status === 'available'
                          ? 'bg-white border-gray-300 text-gray-500'
                          : 'bg-gray-100 border-gray-200 text-gray-400'
                      }`}
                  >
                    {status === 'completed' ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : status === 'locked' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">L{level.levelNumber}</span>
                    )}
                  </div>

                  {/* Level info */}
                  <div className="mt-2 text-center">
                    <div className="text-xs font-medium text-gray-700">
                      {level.levelName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {level.xpReward} XP
                    </div>
                    {status === 'completed' && progress && (
                      <div className="text-xs text-green-600 mt-1">✓</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
        {!isUnlocked && (
          <div className="text-sm text-gray-500">
            🔒 Complete prerequisites to unlock
          </div>
        )}
        {isUnlocked && !progress && (
          <Link
            to={`/system-design/progressive/challenge/${challenge.id}`}
            className={`px-4 py-2 bg-${trackColor}-600 text-white text-sm font-medium rounded-md hover:bg-${trackColor}-700`}
          >
            Start Challenge →
          </Link>
        )}
        {isUnlocked && progress && progress.status !== 'completed' && (
          <Link
            to={`/system-design/progressive/challenge/${challenge.id}`}
            className={`px-4 py-2 bg-${trackColor}-600 text-white text-sm font-medium rounded-md hover:bg-${trackColor}-700`}
          >
            Continue Level {currentLevel} →
          </Link>
        )}
        {progress && progress.status === 'completed' && (
          <Link
            to={`/system-design/progressive/challenge/${challenge.id}`}
            className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
          >
            Review Challenge
          </Link>
        )}
      </div>
    </div>
  );
}
