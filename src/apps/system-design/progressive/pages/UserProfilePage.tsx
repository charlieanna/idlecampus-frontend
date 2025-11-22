import { useState } from 'react';
import { progressiveProgressService } from '../services/progressService';
import { getXPProgressInLevel } from '../types';

/**
 * User Profile Page
 * Shows comprehensive user statistics, activity, achievements, and progress
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md and GAMIFICATION_FORMULAS.md
 */

interface ActivityDataPoint {
  date: string;
  challenges: number;
  xp: number;
}

interface PerformanceMetrics {
  averageTimePerChallenge: number;
  successRate: number;
  perfectCompletions: number;
  totalAttempts: number;
}

// Generate mock activity data for the last 30 days
const generateActivityData = (): ActivityDataPoint[] => {
  const data: ActivityDataPoint[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const challenges = Math.floor(Math.random() * 5); // 0-4 challenges per day
    const xp = challenges * (150 + Math.floor(Math.random() * 100)); // Variable XP
    
    data.push({
      date: date.toISOString().split('T')[0],
      challenges,
      xp,
    });
  }
  
  return data;
};

export function UserProfilePage() {
  const progress = progressiveProgressService.getProgress();
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'achievements'>('overview');
  
  // Calculate XP progress in current level
  const xpProgress = getXPProgressInLevel(progress.totalXP);
  
  const activityData = generateActivityData();
  const totalChallengesLast30Days = activityData.reduce((sum, day) => sum + day.challenges, 0);
  const totalXPLast30Days = activityData.reduce((sum, day) => sum + day.xp, 0);
  
  // Performance metrics (mock data - would come from backend)
  const performanceMetrics: PerformanceMetrics = {
    averageTimePerChallenge: 42, // minutes
    successRate: 87, // percentage
    perfectCompletions: 12,
    totalAttempts: progress.totalChallengesCompleted + 8, // Some failures
  };

  // Calculate skill breakdown
  const skillBreakdown = [
    { skill: 'Scaling', level: 7, xp: 3200, maxXp: 4000, percentage: 80 },
    { skill: 'Caching', level: 5, xp: 2100, maxXp: 3000, percentage: 70 },
    { skill: 'Databases', level: 6, xp: 2800, maxXp: 3500, percentage: 80 },
    { skill: 'Distributed Systems', level: 4, xp: 1600, maxXp: 2500, percentage: 64 },
  ];

  // Recent achievements (mock - would come from backend)
  const recentAchievements = [
    { name: 'Speed Demon', icon: '⚡', date: '2 days ago', rarity: 'epic' },
    { name: 'Week Warrior', icon: '🗓️', date: '5 days ago', rarity: 'rare' },
    { name: 'First Blood', icon: '🎯', date: '1 week ago', rarity: 'common' },
  ];

  // Track progress
  const trackProgress = [
    { 
      track: 'Fundamentals', 
      completed: 12, 
      total: 18, 
      percentage: 67,
      xp: 1800,
      averageScore: 92
    },
    { 
      track: 'Core Concepts', 
      completed: 8, 
      total: 22, 
      percentage: 36,
      xp: 1200,
      averageScore: 88
    },
    { 
      track: 'Real-World Systems', 
      completed: 4, 
      total: 21, 
      percentage: 19,
      xp: 800,
      averageScore: 85
    },
  ];

  const maxActivityChallenges = Math.max(...activityData.map(d => d.challenges));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 shadow-lg">
              U
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="opacity-90">Level:</span>
                  <span className="font-bold">{progress.currentLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="opacity-90">Total XP:</span>
                  <span className="font-bold">{progress.totalXP.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="opacity-90">Rank:</span>
                  <span className="font-bold">#234</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="opacity-90">Member since:</span>
                  <span className="font-bold">Recently</span>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="mt-4 max-w-md">
                <div className="flex justify-between text-xs mb-1">
                  <span>Level {progress.currentLevel}</span>
                  <span>{xpProgress.xpNeeded - xpProgress.xpInLevel} XP to next level</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${xpProgress.progressPercentage}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold">{progress.totalChallengesCompleted}</div>
                <div className="text-xs opacity-90">Challenges</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                <div className="text-2xl font-bold">🔥 {progress.currentStreak}</div>
                <div className="text-xs opacity-90">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {(['overview', 'activity', 'achievements'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-all border-b-2 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Performance Insights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Performance Insights</h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{performanceMetrics.averageTimePerChallenge}</div>
                  <div className="text-sm text-gray-600 mt-1">Avg. Time (minutes)</div>
                  <div className="text-xs text-gray-500 mt-1">Per challenge</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{performanceMetrics.successRate}%</div>
                  <div className="text-sm text-gray-600 mt-1">Success Rate</div>
                  <div className="text-xs text-gray-500 mt-1">First attempt</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{performanceMetrics.perfectCompletions}</div>
                  <div className="text-sm text-gray-600 mt-1">Perfect Scores</div>
                  <div className="text-xs text-gray-500 mt-1">100% completion</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{performanceMetrics.totalAttempts}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Attempts</div>
                  <div className="text-xs text-gray-500 mt-1">All challenges</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <div className="font-bold text-gray-900">Insight:</div>
                    <div className="text-sm text-gray-700">
                      Your success rate is above average! Focus on completing more advanced challenges to improve your ranking.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">🎯 Skill Breakdown</h2>
              
              <div className="space-y-4">
                {skillBreakdown.map((skill) => (
                  <div key={skill.skill}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="font-bold text-gray-900">{skill.skill}</span>
                        <span className="text-sm text-gray-600 ml-2">Level {skill.level}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {skill.xp.toLocaleString()} / {skill.maxXp.toLocaleString()} XP
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="font-bold text-green-900 mb-1">🎓 Strongest Skill</div>
                  <div className="text-sm text-green-700">
                    Scaling & Databases (both Level {skillBreakdown[0].level})
                  </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="font-bold text-yellow-900 mb-1">📈 Focus Area</div>
                  <div className="text-sm text-yellow-700">
                    Distributed Systems (Level {skillBreakdown[3].level})
                  </div>
                </div>
              </div>
            </div>

            {/* Track Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">🛤️ Progress by Track</h2>
              
              <div className="space-y-6">
                {trackProgress.map((track) => (
                  <div key={track.track} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{track.track}</h3>
                        <div className="text-sm text-gray-600">
                          {track.completed} / {track.total} challenges completed
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-600">
                          {track.xp.toLocaleString()} XP
                        </div>
                        <div className="text-xs text-gray-600">
                          Avg. Score: {track.averageScore}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${track.percentage}%` }}
                      />
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      {track.percentage}% complete
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 Recent Achievements</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                {recentAchievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.rarity === 'epic'
                        ? 'border-purple-500 bg-purple-50'
                        : achievement.rarity === 'rare'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <div className="font-bold text-gray-900">{achievement.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{achievement.date}</div>
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                View All Achievements →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* 30-Day Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📅 Last 30 Days</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{totalChallengesLast30Days}</div>
                  <div className="text-sm text-gray-600 mt-1">Challenges Completed</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{totalXPLast30Days.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mt-1">XP Earned</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{(totalChallengesLast30Days / 30).toFixed(1)}</div>
                  <div className="text-sm text-gray-600 mt-1">Avg. per Day</div>
                </div>
              </div>

              {/* Activity Graph */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Daily Activity</h3>
                <div className="flex items-end gap-1 h-48">
                  {activityData.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col justify-end group relative">
                      <div
                        className="bg-blue-500 hover:bg-blue-600 rounded-t transition-all cursor-pointer"
                        style={{
                          height: `${maxActivityChallenges > 0 ? (day.challenges / maxActivityChallenges) * 100 : 0}%`,
                          minHeight: day.challenges > 0 ? '4px' : '0'
                        }}
                      />
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {day.date}<br/>
                        {day.challenges} challenges<br/>
                        {day.xp} XP
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{activityData[0]?.date}</span>
                  <span>Today</span>
                </div>
              </div>
            </div>

            {/* Activity Milestones */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">🎯 Activity Milestones</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl">✅</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">7-Day Streak</div>
                    <div className="text-sm text-gray-600">Keep it up! You're on fire!</div>
                  </div>
                  <div className="text-xl">🔥</div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl">📚</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">20 Challenges This Month</div>
                    <div className="text-sm text-gray-600">Above your monthly average!</div>
                  </div>
                  <div className="text-xl">📈</div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl">⚡</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">Peak Performance Week</div>
                    <div className="text-sm text-gray-600">Best week in the last 30 days</div>
                  </div>
                  <div className="text-xl">🌟</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 All Achievements</h2>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Achievement Progress</span>
                <span className="font-bold text-gray-900">15 / 40 unlocked</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full"
                  style={{ width: '37.5%' }}
                />
              </div>
            </div>

            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🏆</div>
              <p>View all achievements in the dedicated Achievements page</p>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Go to Achievements →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}