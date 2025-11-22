import { useState } from 'react';
import { progressiveProgressService } from '../services/progressService';

/**
 * Leaderboard Page
 * Shows rankings with Daily/Weekly/Monthly/All-Time tabs
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md and GAMIFICATION_FORMULAS.md
 */

type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time';
type SortMetric = 'xp' | 'challenges' | 'streak';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  totalXP: number;
  level: number;
  challengesCompleted: number;
  streak: number;
  isCurrentUser?: boolean;
}

// Mock leaderboard data - in production this would come from backend
const generateMockLeaderboard = (period: LeaderboardPeriod, currentUserId: string): LeaderboardEntry[] => {
  const names = [
    'Sarah_Code', 'Mike_Design', 'Emma_Sys', 'John_Arch', 'Lisa_Dev',
    'Tom_Builder', 'Amy_Designer', 'Chris_Code', 'Nina_Sys', 'Dave_Scale',
    'Alex_Cloud', 'Jordan_Stack', 'Taylor_Full', 'Morgan_Data', 'Casey_Web',
    'Riley_Mobile', 'Quinn_Backend', 'Avery_Frontend', 'Blake_DevOps', 'Cameron_ML'
  ];

  const entries: LeaderboardEntry[] = names.map((name, index) => {
    const baseXP = period === 'daily' ? 1250 : period === 'weekly' ? 5000 : period === 'monthly' ? 15000 : 50000;
    const xpVariation = Math.floor(Math.random() * baseXP * 0.3);
    
    return {
      rank: index + 1,
      userId: `user_${index}`,
      username: name.toLowerCase(),
      displayName: name,
      totalXP: baseXP - (index * 100) + xpVariation,
      level: Math.floor((baseXP - (index * 100)) / 500) + 10,
      challengesCompleted: Math.floor((baseXP - (index * 100)) / 200),
      streak: Math.floor(Math.random() * 90) + 1,
      isCurrentUser: false,
    };
  });

  // Add current user
  const currentUserRank = 234;
  const progress = progressiveProgressService.getProgress();
  
  entries.push({
    rank: currentUserRank,
    userId: currentUserId,
    username: 'you',
    displayName: 'You',
    totalXP: period === 'daily' ? 240 : period === 'weekly' ? 1800 : period === 'monthly' ? 7200 : progress.totalXP,
    level: progress.currentLevel,
    challengesCompleted: progress.totalChallengesCompleted,
    streak: progress.currentStreak,
    isCurrentUser: true,
  });

  return entries.sort((a, b) => b.totalXP - a.totalXP);
};

export function LeaderboardPage() {
  const progress = progressiveProgressService.getProgress();
  const [period, setPeriod] = useState<LeaderboardPeriod>('daily');
  const [sortBy, setSortBy] = useState<SortMetric>('xp');

  const leaderboard = generateMockLeaderboard(period, progress.userId);
  const currentUserEntry = leaderboard.find(e => e.isCurrentUser);
  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Calculate stats for current user
  const xpToTopHundred = leaderboard[99]?.totalXP - (currentUserEntry?.totalXP || 0);
  const challengesToTopHundred = Math.ceil(xpToTopHundred / 200); // Assuming ~200 XP per challenge

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">🏆 Leaderboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period and Sort Selectors */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Period Tabs */}
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly', 'all_time'] as LeaderboardPeriod[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    period === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p === 'all_time' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortMetric)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
            >
              <option value="xp">By XP</option>
              <option value="challenges">By Challenges</option>
              <option value="streak">By Streak</option>
            </select>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            Updated: 2 minutes ago • {leaderboard.length.toLocaleString()} active users today
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">🥇 Top 3 Performers</h2>
          
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-12">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-3xl mb-2">
                🥈
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-gray-900">{topThree[1]?.displayName}</div>
                <div className="text-sm text-gray-600">Level {topThree[1]?.level}</div>
                <div className="text-lg font-bold text-blue-600 mt-1">
                  {topThree[1]?.totalXP.toLocaleString()} XP
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {topThree[1]?.challengesCompleted} challenges
                </div>
                <div className="text-xs text-orange-600">
                  🔥 {topThree[1]?.streak} days
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-4xl mb-2 shadow-lg">
                🥇
              </div>
              <div className="text-center">
                <div className="font-bold text-xl text-gray-900">{topThree[0]?.displayName}</div>
                <div className="text-sm text-gray-600">Level {topThree[0]?.level}</div>
                <div className="text-xl font-bold text-yellow-600 mt-1">
                  {topThree[0]?.totalXP.toLocaleString()} XP
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {topThree[0]?.challengesCompleted} challenges
                </div>
                <div className="text-sm text-orange-600">
                  🔥 {topThree[0]?.streak} days
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-16">
              <div className="w-14 h-14 bg-orange-300 rounded-full flex items-center justify-center text-2xl mb-2">
                🥉
              </div>
              <div className="text-center">
                <div className="font-bold text-base text-gray-900">{topThree[2]?.displayName}</div>
                <div className="text-xs text-gray-600">Level {topThree[2]?.level}</div>
                <div className="text-base font-bold text-orange-600 mt-1">
                  {topThree[2]?.totalXP.toLocaleString()} XP
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {topThree[2]?.challengesCompleted} challenges
                </div>
                <div className="text-xs text-orange-600">
                  🔥 {topThree[2]?.streak} days
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    XP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Streak
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rest.slice(0, 10).map((entry) => (
                  <tr
                    key={entry.userId}
                    className={entry.isCurrentUser ? 'bg-blue-50 border-2 border-blue-500' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.isCurrentUser && '▶ '}
                      #{entry.rank}
                      {entry.isCurrentUser && ' ◀'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          {entry.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {entry.displayName}
                            {entry.isCurrentUser && ' (YOU)'}
                          </div>
                          <div className="text-xs text-gray-500">@{entry.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                      {entry.totalXP.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.challengesCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                      🔥 {entry.streak}
                    </td>
                  </tr>
                ))}
                
                {/* Current User Entry if not in top 10 */}
                {currentUserEntry && currentUserEntry.rank > 13 && (
                  <>
                    <tr>
                      <td colSpan={6} className="px-6 py-2 text-center text-gray-500">...</td>
                    </tr>
                    <tr className="bg-blue-50 border-2 border-blue-500">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ▶ #{currentUserEntry.rank} ◀
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                            Y
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">You</div>
                            <div className="text-xs text-gray-500">@you</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                        {currentUserEntry.totalXP.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {currentUserEntry.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {currentUserEntry.challengesCompleted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                        🔥 {currentUserEntry.streak}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Your Stats */}
        {currentUserEntry && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Your Stats</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Today:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Rank:</span>
                    <span className="font-bold text-gray-900">
                      #{currentUserEntry.rank} (↑ 12 from yesterday)
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">XP Earned:</span>
                    <span className="font-bold text-blue-600">{currentUserEntry.totalXP.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Challenges Completed:</span>
                    <span className="font-bold text-gray-900">{currentUserEntry.challengesCompleted}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Time Spent:</span>
                    <span className="font-bold text-gray-900">
                      {(progress.totalTimeSpentMinutes / 60).toFixed(1)} hours
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">To break into Top 100:</h3>
                {xpToTopHundred > 0 ? (
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Need:</span>
                      <span className="font-bold text-orange-600">
                        {xpToTopHundred.toLocaleString()} more XP
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Estimated:</span>
                      <span className="font-bold text-gray-900">
                        {challengesToTopHundred} more challenges
                      </span>
                    </li>
                    <li className="mt-4">
                      <div className="text-xs text-gray-600 mb-1">Progress to Top 100</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, ((currentUserEntry.totalXP / (leaderboard[99]?.totalXP || 1)) * 100))}%`
                          }}
                        />
                      </div>
                    </li>
                  </ul>
                ) : (
                  <div className="text-green-600 font-bold">
                    🎉 You're in the Top 100!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Daily Challenge */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-sm p-6 text-white mb-6">
          <h2 className="text-xl font-bold mb-4">🎯 Daily Challenge - Bonus XP!</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="mb-3">
                <div className="text-sm opacity-90">Today's Challenge:</div>
                <div className="text-lg font-bold">Rate Limiter L1</div>
              </div>
              <div className="space-y-1 text-sm opacity-90">
                <div>Reward: <span className="font-bold">2x XP (300 XP total)</span></div>
                <div>Participants: <span className="font-bold">342</span></div>
                <div>Time Remaining: <span className="font-bold">14h 23m</span></div>
              </div>
            </div>

            <div>
              <div className="text-sm opacity-90 mb-2">Top Daily Challenge Performers:</div>
              <ol className="space-y-1 text-sm">
                <li>1. Sarah_Code - 100% in 28 min</li>
                <li>2. Emma_Sys - 100% in 31 min</li>
                <li>3. Mike_Design - 95% in 25 min</li>
              </ol>
            </div>
          </div>

          <button className="mt-4 w-full md:w-auto px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-colors">
            Accept Challenge →
          </button>
        </div>

        {/* Rising Stars */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🌟 Rising Stars (Biggest Movers Today)</h2>
          
          <div className="space-y-3">
            {[
              { name: 'NewUser_123', xp: 2840, rankChange: 456 },
              { name: 'Learning_Fast', xp: 1920, rankChange: 312 },
              { name: 'Determined_Dev', xp: 1680, rankChange: 278 },
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-gray-400">{index + 1}.</div>
                  <div>
                    <div className="font-bold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">+{user.xp.toLocaleString()} XP today</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-bold">
                  <span>↑ {user.rankChange} ranks</span>
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}