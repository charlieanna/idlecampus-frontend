import { useState } from 'react';
import { progressiveProgressService } from '../services/progressService';

/**
 * Skill Tree/Gamification Page
 * Shows skill tree with 4 main skills, each with 10 levels
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md and GAMIFICATION_FORMULAS.md
 */

interface Skill {
  id: string;
  name: string;
  description: string;
  currentLevel: number;
  maxLevel: number;
  xpContribution: number;
  prerequisites: string[];
  benefits: {
    level: number;
    description: string;
    active: boolean;
  }[];
}

const SKILLS: Skill[] = [
  {
    id: 'scaling',
    name: 'Scaling',
    description: 'Master horizontal and vertical scaling patterns',
    currentLevel: 0,
    maxLevel: 10,
    xpContribution: 0,
    prerequisites: [],
    benefits: [
      { level: 1, description: '+5% XP on scaling challenges', active: false },
      { level: 3, description: '+10% XP on scaling challenges', active: false },
      { level: 5, description: '+15% XP + unlock advanced patterns', active: false },
      { level: 10, description: '+25% XP + master badge', active: false },
    ],
  },
  {
    id: 'caching',
    name: 'Caching',
    description: 'Expert in caching strategies and CDNs',
    currentLevel: 0,
    maxLevel: 10,
    xpContribution: 0,
    prerequisites: [],
    benefits: [
      { level: 1, description: '+5% XP on caching challenges', active: false },
      { level: 3, description: '+10% XP on caching challenges', active: false },
      { level: 5, description: '+15% XP + unlock Redis/Memcached skills', active: false },
      { level: 10, description: '+25% XP + caching master badge', active: false },
    ],
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'Database design and optimization mastery',
    currentLevel: 0,
    maxLevel: 10,
    xpContribution: 0,
    prerequisites: [],
    benefits: [
      { level: 1, description: '+5% XP on database challenges', active: false },
      { level: 3, description: '+10% XP on database challenges', active: false },
      { level: 5, description: '+15% XP + unlock NoSQL skills', active: false },
      { level: 10, description: '+25% XP + database master badge', active: false },
    ],
  },
  {
    id: 'distributed_systems',
    name: 'Distributed Systems',
    description: 'Design fault-tolerant distributed systems',
    currentLevel: 0,
    maxLevel: 10,
    xpContribution: 0,
    prerequisites: ['scaling', 'databases'],
    benefits: [
      { level: 1, description: '+5% XP on distributed system challenges', active: false },
      { level: 3, description: '+10% XP on distributed system challenges', active: false },
      { level: 5, description: '+15% XP + unlock consensus algorithms', active: false },
      { level: 10, description: '+25% XP + distributed systems master', active: false },
    ],
  },
];

export function SkillTreePage() {
  const progress = progressiveProgressService.getProgress();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Calculate skill points available (1 point every 5 levels, +1 bonus every 10 levels)
  const skillPointsTotal = Math.floor(progress.currentLevel / 5) + Math.floor(progress.currentLevel / 10);
  const skillPointsUsed = 0; // TODO: Track in progress service
  const skillPointsAvailable = skillPointsTotal - skillPointsUsed;

  // Calculate XP progress
  const currentLevelXP = 100 * progress.currentLevel * (progress.currentLevel + 1) / 2;
  const nextLevelXP = 100 * (progress.currentLevel + 1) * (progress.currentLevel + 2) / 2;
  const xpInLevel = progress.totalXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const xpProgress = (xpInLevel / xpNeeded) * 100;

  // Get user rank (simplified calculation)
  const rank = Math.floor(1000 - (progress.currentLevel * 10));
  const rankPercentile = Math.max(1, Math.min(99, 100 - Math.floor((rank / 1000) * 100)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">🎮 Skill Tree</h1>
            <div className="flex items-center gap-6">
              <div className="text-sm">
                <span className="text-gray-600">Level {progress.currentLevel}</span>
                <span className="mx-2">•</span>
                <span className="text-gray-600">{progress.totalXP.toLocaleString()} XP</span>
                <span className="mx-2">•</span>
                <span className="text-gray-600">#{rank} (Top {rankPercentile}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{progress.currentLevel}</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progress.totalXP.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">#{rank}</div>
              <div className="text-sm text-gray-600">Global Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{progress.currentStreak} 🔥</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{rankPercentile}%</div>
              <div className="text-sm text-gray-600">Top Percentile</div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{xpInLevel} / {xpNeeded} XP</span>
              <span>{xpProgress.toFixed(0)}% to Level {progress.currentLevel + 1}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, xpProgress)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skill Points Available */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">💎 Skill Points Available: {skillPointsAvailable}</h2>
              <p className="text-purple-100 text-sm mt-1">
                Earn 1 point every 5 levels, bonus point every 10 levels
              </p>
            </div>
            <button className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50">
              Auto-Assign
            </button>
          </div>
        </div>

        {/* Skill Tree */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🌳 Skill Tree</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {SKILLS.map((skill) => {
              const isLocked = skill.prerequisites.length > 0 && 
                skill.prerequisites.some(prereq => {
                  const prereqSkill = SKILLS.find(s => s.id === prereq);
                  return !prereqSkill || prereqSkill.currentLevel === 0;
                });

              return (
                <div 
                  key={skill.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedSkill?.id === skill.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : isLocked
                      ? 'border-gray-300 bg-gray-50 opacity-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                  onClick={() => !isLocked && setSelectedSkill(skill)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{skill.name}</h3>
                      <p className="text-sm text-gray-600">{skill.description}</p>
                    </div>
                    {isLocked && <span className="text-2xl">🔒</span>}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(skill.maxLevel)].map((_, i) => (
                        <div 
                          key={i}
                          className={`h-2 flex-1 rounded ${
                            i < skill.currentLevel 
                              ? 'bg-yellow-500' 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      Level {skill.currentLevel} / {skill.maxLevel}
                      {skill.currentLevel === skill.maxLevel && (
                        <span className="ml-2 text-yellow-600 font-bold">MAXED ⭐</span>
                      )}
                    </div>
                  </div>

                  {/* XP Contribution */}
                  <div className="text-sm text-gray-600">
                    XP Contribution: <span className="font-bold text-blue-600">
                      {skill.xpContribution.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Skill Details */}
        {selectedSkill && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedSkill.name} (Level {selectedSkill.currentLevel}/{selectedSkill.maxLevel})
            </h2>

            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">📖 Benefits:</h3>
              <div className="space-y-2">
                {selectedSkill.benefits.map((benefit, index) => {
                  const isUnlocked = selectedSkill.currentLevel >= benefit.level;
                  const isNextLevel = selectedSkill.currentLevel === benefit.level - 1;
                  
                  return (
                    <div 
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        isUnlocked 
                          ? 'bg-green-50 border border-green-200' 
                          : isNextLevel
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <span className="text-lg">
                        {isUnlocked ? '✓' : isNextLevel ? '○' : '🔒'}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          Level {benefit.level}: {benefit.description}
                        </div>
                        {isUnlocked && (
                          <div className="text-sm text-green-600 font-medium">ACTIVE</div>
                        )}
                        {isNextLevel && (
                          <div className="text-sm text-blue-600">Next unlock at Level {benefit.level}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedSkill.prerequisites.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">📋 Requirements:</h3>
                <div className="space-y-2">
                  {selectedSkill.prerequisites.map((prereqId) => {
                    const prereqSkill = SKILLS.find(s => s.id === prereqId);
                    if (!prereqSkill) return null;
                    const isMet = prereqSkill.currentLevel > 0;
                    
                    return (
                      <div 
                        key={prereqId}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isMet ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <span>{isMet ? '✓' : '⚠'}</span>
                        <span className="text-gray-900">
                          {prereqSkill.name} skill required (Level 1+)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Allocate Point Button */}
            {selectedSkill.currentLevel < selectedSkill.maxLevel && (
              <button
                disabled={skillPointsAvailable === 0}
                className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all ${
                  skillPointsAvailable > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {skillPointsAvailable > 0 
                  ? `Allocate Point (${skillPointsAvailable} available)`
                  : 'No Skill Points Available'
                }
              </button>
            )}
            {selectedSkill.currentLevel === selectedSkill.maxLevel && (
              <div className="text-center py-3 px-6 bg-yellow-50 border-2 border-yellow-500 rounded-lg">
                <span className="text-yellow-700 font-bold">⭐ Skill Mastered! ⭐</span>
              </div>
            )}
          </div>
        )}

        {/* Active Bonuses */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Active Bonuses</h2>
          <div className="space-y-2">
            {progress.currentStreak >= 7 && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="font-medium text-gray-900">
                    {progress.currentStreak}-Day Streak: +{
                      progress.currentStreak <= 3 ? 10 :
                      progress.currentStreak <= 7 ? 25 :
                      progress.currentStreak <= 14 ? 50 :
                      progress.currentStreak <= 30 ? 75 : 100
                    }% XP multiplier
                  </div>
                  <div className="text-sm text-gray-600">Keep it up!</div>
                </div>
              </div>
            )}
            
            {SKILLS.filter(s => s.currentLevel > 0).map(skill => (
              <div key={skill.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="font-medium text-gray-900">
                    {skill.name} Level {skill.currentLevel}: Active bonuses
                  </div>
                  <div className="text-sm text-gray-600">
                    {skill.benefits.find(b => b.level <= skill.currentLevel && b.level > 0)?.description}
                  </div>
                </div>
              </div>
            ))}

            {progress.currentStreak === 0 && SKILLS.every(s => s.currentLevel === 0) && (
              <div className="text-center text-gray-500 py-4">
                Complete challenges to unlock bonuses!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}