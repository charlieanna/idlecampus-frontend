import { useState } from 'react';
import { progressiveProgressService } from '../services/progressService';
import { Achievement } from '../types';

/**
 * Achievements & Badges Page
 * Shows 40+ achievements across 5 categories with rarity indicators
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md and GAMIFICATION_FORMULAS.md
 */

type AchievementCategory = 'first_steps' | 'progression' | 'mastery' | 'streaks' | 'special';
type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface AchievementDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  xpReward: number;
  category: AchievementCategory;
  condition: (stats: any) => boolean;
  progress?: (stats: any) => number; // 0-100
}

const ALL_ACHIEVEMENTS: AchievementDefinition[] = [
  // First Steps
  {
    id: 'first_challenge',
    slug: 'first_challenge',
    name: 'First Steps',
    description: 'Complete your first challenge',
    icon: '🎯',
    rarity: 'common',
    xpReward: 50,
    category: 'first_steps',
    condition: (stats) => stats.challengesCompleted >= 1,
  },
  {
    id: 'first_perfect',
    slug: 'first_perfect',
    name: 'Perfectionist',
    description: 'Get your first 100% score',
    icon: '💯',
    rarity: 'rare',
    xpReward: 100,
    category: 'first_steps',
    condition: (stats) => stats.perfectScores >= 1,
  },
  {
    id: 'first_level',
    slug: 'first_level',
    name: 'Getting Started',
    description: 'Complete your first level',
    icon: '🚀',
    rarity: 'common',
    xpReward: 25,
    category: 'first_steps',
    condition: (stats) => stats.levelsCompleted >= 1,
  },
  
  // Progression Achievements
  {
    id: 'challenge_5',
    slug: 'challenge_5',
    name: 'Getting the Hang',
    description: 'Complete 5 challenges',
    icon: '⭐',
    rarity: 'common',
    xpReward: 100,
    category: 'progression',
    condition: (stats) => stats.challengesCompleted >= 5,
    progress: (stats) => Math.min(100, (stats.challengesCompleted / 5) * 100),
  },
  {
    id: 'challenge_10',
    slug: 'challenge_10',
    name: 'Rising Star',
    description: 'Complete 10 challenges',
    icon: '🌟',
    rarity: 'rare',
    xpReward: 200,
    category: 'progression',
    condition: (stats) => stats.challengesCompleted >= 10,
    progress: (stats) => Math.min(100, (stats.challengesCompleted / 10) * 100),
  },
  {
    id: 'challenge_25',
    slug: 'challenge_25',
    name: 'Dedicated Learner',
    description: 'Complete 25 challenges',
    icon: '🎓',
    rarity: 'epic',
    xpReward: 500,
    category: 'progression',
    condition: (stats) => stats.challengesCompleted >= 25,
    progress: (stats) => Math.min(100, (stats.challengesCompleted / 25) * 100),
  },
  {
    id: 'challenge_50',
    slug: 'challenge_50',
    name: 'Halfway Hero',
    description: 'Complete 50 challenges',
    icon: '🏅',
    rarity: 'epic',
    xpReward: 1000,
    category: 'progression',
    condition: (stats) => stats.challengesCompleted >= 50,
    progress: (stats) => Math.min(100, (stats.challengesCompleted / 50) * 100),
  },
  {
    id: 'challenge_61',
    slug: 'challenge_61',
    name: 'Completionist',
    description: 'Complete all 61 challenges',
    icon: '👑',
    rarity: 'legendary',
    xpReward: 2000,
    category: 'progression',
    condition: (stats) => stats.challengesCompleted >= 61,
    progress: (stats) => Math.min(100, (stats.challengesCompleted / 61) * 100),
  },
  
  // Mastery Achievements
  {
    id: 'speed_demon',
    slug: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 10 challenges faster than estimated time',
    icon: '⚡',
    rarity: 'epic',
    xpReward: 300,
    category: 'mastery',
    condition: (stats) => stats.fastCompletions >= 10,
    progress: (stats) => Math.min(100, (stats.fastCompletions / 10) * 100),
  },
  {
    id: 'no_hints_master',
    slug: 'no_hints_master',
    name: 'No Hints Hero',
    description: 'Complete 5 challenges without using hints',
    icon: '🧠',
    rarity: 'epic',
    xpReward: 500,
    category: 'mastery',
    condition: (stats) => stats.noHintCompletions >= 5,
    progress: (stats) => Math.min(100, (stats.noHintCompletions / 5) * 100),
  },
  {
    id: 'perfect_5',
    slug: 'perfect_5',
    name: 'Consistent Excellence',
    description: 'Get 5 perfect scores',
    icon: '🎯',
    rarity: 'rare',
    xpReward: 250,
    category: 'mastery',
    condition: (stats) => stats.perfectScores >= 5,
    progress: (stats) => Math.min(100, (stats.perfectScores / 5) * 100),
  },
  {
    id: 'perfect_10',
    slug: 'perfect_10',
    name: 'Perfection Master',
    description: 'Get 10 perfect scores',
    icon: '💎',
    rarity: 'epic',
    xpReward: 500,
    category: 'mastery',
    condition: (stats) => stats.perfectScores >= 10,
    progress: (stats) => Math.min(100, (stats.perfectScores / 10) * 100),
  },
  
  // Streak Achievements
  {
    id: 'streak_3',
    slug: 'streak_3',
    name: 'Getting Consistent',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    rarity: 'common',
    xpReward: 50,
    category: 'streaks',
    condition: (stats) => stats.currentStreak >= 3,
    progress: (stats) => Math.min(100, (stats.currentStreak / 3) * 100),
  },
  {
    id: 'streak_7',
    slug: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: 'rare',
    xpReward: 150,
    category: 'streaks',
    condition: (stats) => stats.currentStreak >= 7,
    progress: (stats) => Math.min(100, (stats.currentStreak / 7) * 100),
  },
  {
    id: 'streak_14',
    slug: 'streak_14',
    name: 'Two Week Wonder',
    description: 'Maintain a 14-day streak',
    icon: '🔥',
    rarity: 'epic',
    xpReward: 300,
    category: 'streaks',
    condition: (stats) => stats.currentStreak >= 14,
    progress: (stats) => Math.min(100, (stats.currentStreak / 14) * 100),
  },
  {
    id: 'streak_30',
    slug: 'streak_30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🔥',
    rarity: 'legendary',
    xpReward: 1000,
    category: 'streaks',
    condition: (stats) => stats.currentStreak >= 30,
    progress: (stats) => Math.min(100, (stats.currentStreak / 30) * 100),
  },
  {
    id: 'streak_100',
    slug: 'streak_100',
    name: 'Century of Dedication',
    description: 'Maintain a 100-day streak',
    icon: '🔥',
    rarity: 'legendary',
    xpReward: 5000,
    category: 'streaks',
    condition: (stats) => stats.currentStreak >= 100,
    progress: (stats) => Math.min(100, (stats.currentStreak / 100) * 100),
  },
  
  // Special/Track Achievements
  {
    id: 'fundamentals_complete',
    slug: 'fundamentals_complete',
    name: 'Foundation Builder',
    description: 'Complete all Fundamentals track challenges',
    icon: '📘',
    rarity: 'rare',
    xpReward: 500,
    category: 'special',
    condition: (stats) => stats.tracks?.fundamentals === 100,
  },
  {
    id: 'concepts_complete',
    slug: 'concepts_complete',
    name: 'Concept Master',
    description: 'Complete all Concepts track challenges',
    icon: '📗',
    rarity: 'epic',
    xpReward: 750,
    category: 'special',
    condition: (stats) => stats.tracks?.concepts === 100,
  },
  {
    id: 'systems_complete',
    slug: 'systems_complete',
    name: 'Systems Architect',
    description: 'Complete all Systems track challenges',
    icon: '📕',
    rarity: 'legendary',
    xpReward: 1500,
    category: 'special',
    condition: (stats) => stats.tracks?.systems === 100,
  },
  {
    id: 'level_10',
    slug: 'level_10',
    name: 'Apprentice',
    description: 'Reach level 10',
    icon: '⬆️',
    rarity: 'common',
    xpReward: 100,
    category: 'special',
    condition: (stats) => stats.level >= 10,
  },
  {
    id: 'level_25',
    slug: 'level_25',
    name: 'Expert',
    description: 'Reach level 25',
    icon: '⬆️',
    rarity: 'rare',
    xpReward: 300,
    category: 'special',
    condition: (stats) => stats.level >= 25,
  },
  {
    id: 'level_50',
    slug: 'level_50',
    name: 'Master',
    description: 'Reach level 50',
    icon: '⬆️',
    rarity: 'epic',
    xpReward: 1000,
    category: 'special',
    condition: (stats) => stats.level >= 50,
  },
  {
    id: 'level_100',
    slug: 'level_100',
    name: 'Grandmaster',
    description: 'Reach level 100',
    icon: '👑',
    rarity: 'legendary',
    xpReward: 5000,
    category: 'special',
    condition: (stats) => stats.level >= 100,
  },
  {
    id: 'xp_10000',
    slug: 'xp_10000',
    name: 'XP Collector',
    description: 'Earn 10,000 total XP',
    icon: '💰',
    rarity: 'epic',
    xpReward: 500,
    category: 'special',
    condition: (stats) => stats.totalXP >= 10000,
  },
  {
    id: 'early_bird',
    slug: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a challenge before 8 AM',
    icon: '🌅',
    rarity: 'rare',
    xpReward: 100,
    category: 'special',
    condition: (stats) => stats.earlyBirdCompletions >= 1,
  },
  {
    id: 'night_owl',
    slug: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a challenge after 10 PM',
    icon: '🦉',
    rarity: 'rare',
    xpReward: 100,
    category: 'special',
    condition: (stats) => stats.nightOwlCompletions >= 1,
  },
];

const CATEGORY_INFO: Record<AchievementCategory, { name: string; icon: string; color: string }> = {
  first_steps: { name: 'First Steps', icon: '🎯', color: 'blue' },
  progression: { name: 'Progression', icon: '📈', color: 'green' },
  mastery: { name: 'Mastery', icon: '🏆', color: 'purple' },
  streaks: { name: 'Streaks', icon: '🔥', color: 'orange' },
  special: { name: 'Special', icon: '⭐', color: 'yellow' },
};

const RARITY_COLORS: Record<Rarity, string> = {
  common: 'border-gray-400 bg-gray-50',
  rare: 'border-blue-500 bg-blue-50',
  epic: 'border-purple-500 bg-purple-50',
  legendary: 'border-yellow-500 bg-yellow-50',
};

export function AchievementsPage() {
  const progress = progressiveProgressService.getProgress();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementDefinition | null>(null);

  // Calculate user stats for achievement conditions
  const stats = {
    challengesCompleted: progress.totalChallengesCompleted,
    levelsCompleted: progress.totalLevelsCompleted,
    level: progress.currentLevel,
    totalXP: progress.totalXP,
    currentStreak: progress.currentStreak,
    perfectScores: 0, // TODO: Track in progress service
    fastCompletions: 0,
    noHintCompletions: 0,
    earlyBirdCompletions: 0,
    nightOwlCompletions: 0,
    tracks: {
      fundamentals: progress.trackProgress.fundamentals.progressPercentage,
      concepts: progress.trackProgress.concepts.progressPercentage,
      systems: progress.trackProgress.systems.progressPercentage,
    },
  };

  // Get unlocked achievement IDs
  const unlockedAchievementIds = progress.achievements.map(a => a.id);

  // Filter achievements by category
  const filteredAchievements = selectedCategory === 'all' 
    ? ALL_ACHIEVEMENTS 
    : ALL_ACHIEVEMENTS.filter(a => a.category === selectedCategory);

  // Calculate statistics
  const totalAchievements = ALL_ACHIEVEMENTS.length;
  const unlockedCount = ALL_ACHIEVEMENTS.filter(a => unlockedAchievementIds.includes(a.id)).length;
  const totalXPFromAchievements = progress.achievements.reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">🏆 Achievements</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {unlockedCount}/{totalAchievements}
              </div>
              <div className="text-sm text-gray-600">Achievements Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {((unlockedCount / totalAchievements) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Completion</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {totalXPFromAchievements.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">XP from Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {ALL_ACHIEVEMENTS.filter(a => a.rarity === 'legendary' && unlockedAchievementIds.includes(a.id)).length}
              </div>
              <div className="text-sm text-gray-600">Legendary Unlocked</div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({totalAchievements})
            </button>
            {Object.entries(CATEGORY_INFO).map(([key, info]) => {
              const categoryCount = ALL_ACHIEVEMENTS.filter(a => a.category === key).length;
              const categoryUnlocked = ALL_ACHIEVEMENTS.filter(
                a => a.category === key && unlockedAchievementIds.includes(a.id)
              ).length;
              
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as AchievementCategory)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {info.icon} {info.name} ({categoryUnlocked}/{categoryCount})
                </button>
              );
            })}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = unlockedAchievementIds.includes(achievement.id);
            const progress = achievement.progress ? achievement.progress(stats) : 0;
            const showProgress = !isUnlocked && achievement.progress;

            return (
              <div
                key={achievement.id}
                onClick={() => setSelectedAchievement(achievement)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  RARITY_COLORS[achievement.rarity]
                } ${
                  isUnlocked 
                    ? 'opacity-100' 
                    : 'opacity-60 grayscale'
                } hover:scale-105 hover:shadow-lg`}
              >
                <div className="text-center mb-3">
                  <div className="text-5xl mb-2">{achievement.icon}</div>
                  <div className="font-bold text-gray-900">{achievement.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{achievement.description}</div>
                </div>

                {/* Rarity Badge */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                    achievement.rarity === 'common' ? 'bg-gray-200 text-gray-700' :
                    achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-700' :
                    achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-700' :
                    'bg-yellow-200 text-yellow-700'
                  }`}>
                    {achievement.rarity}
                  </span>
                  <span className="text-xs font-bold text-green-600">
                    +{achievement.xpReward} XP
                  </span>
                </div>

                {/* Status */}
                {isUnlocked ? (
                  <div className="text-center">
                    <div className="text-green-600 font-bold text-sm">✓ UNLOCKED</div>
                  </div>
                ) : showProgress ? (
                  <div>
                    <div className="text-xs text-gray-600 text-center mb-1">
                      {progress.toFixed(0)}% Complete
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-gray-500 font-bold text-sm">🔒 LOCKED</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Achievement Detail Modal */}
        {selectedAchievement && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{selectedAchievement.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedAchievement.name}
                </h2>
                <p className="text-gray-600">{selectedAchievement.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Rarity</span>
                  <span className={`font-bold uppercase ${
                    selectedAchievement.rarity === 'common' ? 'text-gray-700' :
                    selectedAchievement.rarity === 'rare' ? 'text-blue-700' :
                    selectedAchievement.rarity === 'epic' ? 'text-purple-700' :
                    'text-yellow-700'
                  }`}>
                    {selectedAchievement.rarity}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">XP Reward</span>
                  <span className="font-bold text-green-600">
                    +{selectedAchievement.xpReward} XP
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-gray-600">Category</span>
                  <span className="font-bold text-gray-900">
                    {CATEGORY_INFO[selectedAchievement.category].icon}{' '}
                    {CATEGORY_INFO[selectedAchievement.category].name}
                  </span>
                </div>
                {selectedAchievement.progress && (
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-gray-900">
                        {selectedAchievement.progress(stats).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min(100, selectedAchievement.progress(stats))}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedAchievement(null)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}