import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { progressiveProgressService } from '../services/progressService';
import { getAllProgressiveChallenges } from '../services/challengeMapper';
import { ProgressiveChallenge, LearningTrackType } from '../types';

/**
 * Progress Dashboard Page
 * Comprehensive overview of all 61 challenges with filtering and sorting
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md
 */

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'locked' | 'in_progress' | 'completed';
type SortBy = 'order' | 'xp' | 'difficulty' | 'completion';

export function ProgressDashboardPage() {
  const navigate = useNavigate();
  const progress = progressiveProgressService.getProgress();
  const allChallenges = getAllProgressiveChallenges();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterTrack, setFilterTrack] = useState<LearningTrackType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortBy>('order');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine all challenges
  const challenges = [
    ...allChallenges.fundamentals,
    ...allChallenges.concepts,
    ...allChallenges.systems
  ];

  // Filter and sort challenges
  const filteredChallenges = challenges.filter((challenge: ProgressiveChallenge) => {
    // Track filter
    if (filterTrack !== 'all' && challenge.track !== filterTrack) return false;

    // Status filter
    const challengeProgress = progress.challengeProgress[challenge.id];
    if (filterStatus !== 'all') {
      const status = challengeProgress?.status || 'locked';
      if (status !== filterStatus) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        challenge.title.toLowerCase().includes(query) ||
        challenge.description.toLowerCase().includes(query) ||
        challenge.category.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort challenges
  const sortedChallenges = [...filteredChallenges].sort((a: ProgressiveChallenge, b: ProgressiveChallenge) => {
    switch (sortBy) {
      case 'xp':
        return b.baseXP - a.baseXP;
      case 'difficulty':
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'completion':
        const aProgress = progress.challengeProgress[a.id]?.levelsCompleted.length || 0;
        const bProgress = progress.challengeProgress[b.id]?.levelsCompleted.length || 0;
        return bProgress - aProgress;
      default: // order
        return a.orderInTrack - b.orderInTrack;
    }
  });

  // Calculate statistics
  const stats = {
    total: challenges.length,
    completed: Object.values(progress.challengeProgress).filter((p) => p.status === 'completed').length,
    inProgress: Object.values(progress.challengeProgress).filter((p) => p.status === 'in_progress').length,
    locked: challenges.length - Object.keys(progress.challengeProgress).length,
  };

  const trackStats = {
    fundamentals: {
      total: allChallenges.fundamentals.length,
      completed: allChallenges.fundamentals.filter((c: ProgressiveChallenge) => 
        progress.challengeProgress[c.id]?.status === 'completed'
      ).length,
    },
    concepts: {
      total: allChallenges.concepts.length,
      completed: allChallenges.concepts.filter((c: ProgressiveChallenge) => 
        progress.challengeProgress[c.id]?.status === 'completed'
      ).length,
    },
    systems: {
      total: allChallenges.systems.length,
      completed: allChallenges.systems.filter((c: ProgressiveChallenge) => 
        progress.challengeProgress[c.id]?.status === 'completed'
      ).length,
    },
  };

  const getStatusBadge = (challengeId: string) => {
    const challengeProgress = progress.challengeProgress[challengeId];
    if (!challengeProgress) {
      return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">🔒 Locked</span>;
    }

    switch (challengeProgress.status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-200 text-green-700 text-xs font-medium rounded">✅ Completed</span>;
      case 'in_progress':
        return <span className="px-2 py-1 bg-blue-200 text-blue-700 text-xs font-medium rounded">▶️ In Progress</span>;
      case 'unlocked':
        return <span className="px-2 py-1 bg-yellow-200 text-yellow-700 text-xs font-medium rounded">🔓 Unlocked</span>;
      default:
        return <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">🔒 Locked</span>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600';
      case 'intermediate':
        return 'text-yellow-600';
      case 'advanced':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrackColor = (track: LearningTrackType) => {
    switch (track) {
      case 'fundamentals':
        return 'bg-blue-100 text-blue-700';
      case 'concepts':
        return 'bg-purple-100 text-purple-700';
      case 'systems':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">📊 Progress Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your progress across all 61 challenges</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Total Challenges</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-500 mt-1">
              {((stats.completed / stats.total) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">In Progress</div>
            <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Locked</div>
            <div className="text-3xl font-bold text-gray-400">{stats.locked}</div>
          </div>
        </div>

        {/* Track Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Track Completion</h2>
          
          <div className="space-y-4">
            {(['fundamentals', 'concepts', 'systems'] as LearningTrackType[]).map((track) => (
              <div key={track}>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 capitalize">{track}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTrackColor(track)}`}>
                      {trackStats[track].completed} / {trackStats[track].total}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {((trackStats[track].completed / trackStats[track].total) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      track === 'fundamentals' ? 'bg-blue-600' :
                      track === 'concepts' ? 'bg-purple-600' :
                      'bg-orange-600'
                    }`}
                    style={{
                      width: `${(trackStats[track].completed / trackStats[track].total) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Track Filter */}
            <select
              value={filterTrack}
              onChange={(e) => setFilterTrack(e.target.value as LearningTrackType | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tracks</option>
              <option value="fundamentals">Fundamentals</option>
              <option value="concepts">Concepts</option>
              <option value="systems">Systems</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="locked">Locked</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="order">By Order</option>
              <option value="xp">By XP</option>
              <option value="difficulty">By Difficulty</option>
              <option value="completion">By Completion</option>
            </select>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {sortedChallenges.length} of {challenges.length} challenges
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Challenges Display */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedChallenges.map((challenge: ProgressiveChallenge) => {
              const challengeProgress = progress.challengeProgress[challenge.id];
              const levelsCompleted = challengeProgress?.levelsCompleted.length || 0;

              return (
                <div
                  key={challenge.id}
                  className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/system-design/progressive/challenge/${challenge.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 flex-1">{challenge.title}</h3>
                    {getStatusBadge(challenge.id)}
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {challenge.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTrackColor(challenge.track)}`}>
                      {challenge.track}
                    </span>
                    <span className={`text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {challenge.baseXP} XP
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{levelsCompleted} / 5 levels</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(levelsCompleted / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Challenge
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Track
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    XP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedChallenges.map((challenge: ProgressiveChallenge) => {
                  const challengeProgress = progress.challengeProgress[challenge.id];
                  const levelsCompleted = challengeProgress?.levelsCompleted.length || 0;

                  return (
                    <tr
                      key={challenge.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/system-design/progressive/challenge/${challenge.id}`)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{challenge.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {challenge.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTrackColor(challenge.track)}`}>
                          {challenge.track}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium capitalize ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(levelsCompleted / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{levelsCompleted}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-blue-600">{challenge.baseXP}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(challenge.id)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {sortedChallenges.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <div className="text-gray-900 font-bold mb-2">No challenges found</div>
            <div className="text-gray-600">Try adjusting your filters or search query</div>
          </div>
        )}
      </div>
    </div>
  );
}