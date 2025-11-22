import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { progressiveProgressService } from '../services/progressService';
import { getAllProgressiveChallenges } from '../services/challengeMapper';
import { ChallengeLevel, LEVEL_NAMES, ProgressiveChallenge, ProgressiveChallengeLevel } from '../types';

/**
 * Challenge Detail Page with 5-Level Flow
 * Shows a single challenge with visual level progression
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md
 */

interface LevelCardProps {
  level: ChallengeLevel;
  isUnlocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  xpReward: number;
  description: string;
  onStart: () => void;
}

function LevelCard({ level, isUnlocked, isCompleted, isCurrent, xpReward, description, onStart }: LevelCardProps) {
  const levelName = LEVEL_NAMES[level];
  
  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-500 border-green-600';
    if (isCurrent) return 'bg-blue-500 border-blue-600';
    if (isUnlocked) return 'bg-gray-100 border-gray-300';
    return 'bg-gray-50 border-gray-200';
  };

  const getTextColor = () => {
    if (isCompleted || isCurrent) return 'text-white';
    return 'text-gray-900';
  };

  const getButtonText = () => {
    if (isCompleted) return 'Retry';
    if (isCurrent) return 'Continue';
    return 'Start';
  };

  return (
    <div className={`rounded-lg border-2 p-6 transition-all ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className={`text-sm font-medium ${getTextColor()} opacity-80`}>
            Level {level}
          </div>
          <div className={`text-xl font-bold ${getTextColor()}`}>
            {levelName}
          </div>
        </div>
        <div className={`text-lg font-bold ${getTextColor()}`}>
          {isCompleted && '✅'}
          {isCurrent && '▶️'}
          {!isUnlocked && '🔒'}
        </div>
      </div>

      <p className={`text-sm ${getTextColor()} ${isUnlocked ? 'opacity-90' : 'opacity-50'} mb-4`}>
        {description}
      </p>

      <div className="flex items-center justify-between">
        <div className={`text-sm font-medium ${getTextColor()}`}>
          {xpReward} XP
        </div>
        {isUnlocked ? (
          <button
            onClick={onStart}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isCompleted
                ? 'bg-white text-green-600 hover:bg-green-50'
                : isCurrent
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {getButtonText()} →
          </button>
        ) : (
          <div className="text-sm text-gray-500">
            Complete previous level
          </div>
        )}
      </div>
    </div>
  );
}

export function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<ChallengeLevel>(1);

  const allChallenges = getAllProgressiveChallenges();
  const challenges = [
    ...allChallenges.fundamentals,
    ...allChallenges.concepts,
    ...allChallenges.systems
  ];
  const challenge = challenges.find((c: ProgressiveChallenge) => c.id === id);
  const progress = progressiveProgressService.getProgress();
  const challengeProgress = progress.challengeProgress[id || ''];

  useEffect(() => {
    if (!challenge) {
      navigate('/system-design/progressive');
    }
  }, [challenge, navigate]);

  if (!challenge) {
    return null;
  }

  // Determine which levels are unlocked
  const completedLevels = challengeProgress?.levelsCompleted || [];
  const currentLevel = challengeProgress?.currentLevel || 1;
  
  const getLevelStatus = (level: ChallengeLevel) => {
    const isCompleted = completedLevels.includes(level);
    const isUnlocked = level === 1 || completedLevels.includes((level - 1) as ChallengeLevel);
    const isCurrent = level === currentLevel && !isCompleted;
    
    return { isCompleted, isUnlocked, isCurrent };
  };

  const handleStartLevel = (level: ChallengeLevel) => {
    // Navigate to the TieredSystemDesignBuilder with the specific level
    navigate(`/system-design/progressive/challenge/${id}/level/${level}`);
  };

  // Calculate total XP for challenge
  const totalXP = challenge.levels.reduce((sum: number, level: ProgressiveChallengeLevel) => sum + level.xpReward, 0);
  const earnedXP = challengeProgress?.xpEarned || 0;

  // Level descriptions
  const levelDescriptions: Record<ChallengeLevel, string> = {
    1: 'Build basic connectivity and core architecture',
    2: 'Scale to handle production traffic volumes',
    3: 'Optimize for performance and efficiency',
    4: 'Add resilience and fault tolerance',
    5: 'Achieve excellence with monitoring and best practices',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/system-design/progressive')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 5 Level Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Challenge Overview</h2>
              <p className="text-gray-700 mb-4">{challenge.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Track:</span>
                  <span className="font-medium text-gray-900 capitalize">{challenge.track}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-medium text-gray-900 capitalize">{challenge.difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Total XP:</span>
                  <span className="font-medium text-blue-600">{totalXP}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">
                    {completedLevels.length} / 5 levels
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedLevels.length / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Level Progression */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 5-Level Progression</h2>
              
              <div className="space-y-4">
                {challenge.levels.map((level: ProgressiveChallengeLevel) => {
                  const status = getLevelStatus(level.levelNumber);
                  return (
                    <LevelCard
                      key={level.levelNumber}
                      level={level.levelNumber}
                      isUnlocked={status.isUnlocked}
                      isCompleted={status.isCompleted}
                      isCurrent={status.isCurrent}
                      xpReward={level.xpReward}
                      description={levelDescriptions[level.levelNumber]}
                      onStart={() => handleStartLevel(level.levelNumber)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Prerequisites */}
            {challenge.prerequisites && challenge.prerequisites.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-900 mb-2">📋 Prerequisites</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {challenge.prerequisites.map((prereq: string, index: number) => (
                    <li key={index}>• {prereq}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* XP Rewards */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">💎 XP Rewards</h3>
              
              <div className="space-y-3">
                {challenge.levels.map((level: ProgressiveChallengeLevel) => {
                  const status = getLevelStatus(level.levelNumber);
                  return (
                    <div
                      key={level.levelNumber}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className={status.isCompleted ? 'text-green-600' : 'text-gray-600'}>
                          {status.isCompleted ? '✅' : '○'}
                        </span>
                        <span className="text-sm text-gray-700">
                          L{level.levelNumber}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${
                        status.isCompleted ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {level.xpReward} XP
                      </span>
                    </div>
                  );
                })}
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600">{totalXP} XP</span>
                </div>
              </div>

              {earnedXP > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-800">
                    You've earned <span className="font-bold">{earnedXP} XP</span> from this challenge!
                  </div>
                </div>
              )}
            </div>

            {/* Stats */}
            {challengeProgress && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">📊 Your Stats</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attempts:</span>
                    <span className="font-medium text-gray-900">
                      {challengeProgress.totalAttempts}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Score:</span>
                    <span className="font-medium text-gray-900">
                      {challengeProgress.bestScore}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Spent:</span>
                    <span className="font-medium text-gray-900">
                      {challengeProgress.timeSpentMinutes} min
                    </span>
                  </div>
                  {challengeProgress.completedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(challengeProgress.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* DDIA Topics */}
            {challenge.ddiaTopics && challenge.ddiaTopics.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">📚 DDIA Topics</h3>
                
                <div className="flex flex-wrap gap-2">
                  {challenge.ddiaTopics.map((topic: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-6 text-white">
              <h3 className="font-bold mb-4">🚀 Ready to Start?</h3>
              
              <p className="text-sm opacity-90 mb-4">
                Begin with Level 1 and progress through all 5 levels to master this challenge.
              </p>

              <button
                onClick={() => {
                  const nextLevel = completedLevels.length === 0 ? 1 : 
                    completedLevels.length === 5 ? 1 : 
                    (Math.max(...completedLevels) + 1) as ChallengeLevel;
                  handleStartLevel(nextLevel);
                }}
                className="w-full py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                {completedLevels.length === 0 ? 'Start Level 1' : 
                 completedLevels.length === 5 ? 'Retry Challenge' :
                 `Continue to Level ${Math.max(...completedLevels) + 1}`} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}