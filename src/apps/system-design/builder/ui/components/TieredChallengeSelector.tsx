import React, { useState } from 'react';
import { Code, Settings, Architecture, Search, ChevronRight, Star, Clock, DollarSign } from 'lucide-react';
import { TieredChallenge, getTierDescription, getTierUIRequirements } from '../../types/challengeTiers';

interface TieredChallengeSelectorProps {
  challenges: TieredChallenge[];
  onSelectChallenge: (challenge: TieredChallenge) => void;
}

/**
 * Challenge Selector with Tier Indicators
 *
 * Shows all available challenges grouped by tier
 * Helps students understand what they'll need to do for each challenge
 */
export function TieredChallengeSelector({
  challenges,
  onSelectChallenge,
}: TieredChallengeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<'all' | 'simple' | 'moderate' | 'advanced'>('all');
  const [hoveredChallenge, setHoveredChallenge] = useState<string | null>(null);

  // Group challenges by tier
  const challengesByTier = {
    simple: challenges.filter(c => c.implementationTier === 'simple'),
    moderate: challenges.filter(c => c.implementationTier === 'moderate'),
    advanced: challenges.filter(c => c.implementationTier === 'advanced'),
  };

  // Filter challenges based on search and tier
  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'all' || challenge.implementationTier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'simple':
        return <Code className="w-5 h-5" />;
      case 'moderate':
        return <Settings className="w-5 h-5" />;
      case 'advanced':
        return <Architecture className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'simple':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    const count = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3;
    return Array(3).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < count ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Select Challenge</h2>
        <p className="text-sm text-gray-600 mt-1">Choose a system design problem to solve</p>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tier Filter Pills */}
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedTier('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTier === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Tiers ({challenges.length})
          </button>

          <button
            onClick={() => setSelectedTier('simple')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              selectedTier === 'simple'
                ? 'bg-green-600 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Tier 1 ({challengesByTier.simple.length})</span>
          </button>

          <button
            onClick={() => setSelectedTier('moderate')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              selectedTier === 'moderate'
                ? 'bg-yellow-600 text-white'
                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Tier 2 ({challengesByTier.moderate.length})</span>
          </button>

          <button
            onClick={() => setSelectedTier('advanced')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              selectedTier === 'advanced'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <Architecture className="w-4 h-4" />
            <span>Tier 3 ({challengesByTier.advanced.length})</span>
          </button>
        </div>
      </div>

      {/* Tier Legend */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <Code className="w-4 h-4 text-green-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Tier 1 (Simple)</div>
              <div className="text-gray-600">Write Python code</div>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Settings className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Tier 2 (Moderate)</div>
              <div className="text-gray-600">Configure algorithms</div>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Architecture className="w-4 h-4 text-red-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">Tier 3 (Advanced)</div>
              <div className="text-gray-600">Design architecture</div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {filteredChallenges.map((challenge) => {
            const uiReqs = getTierUIRequirements(challenge.implementationTier);

            return (
              <div
                key={challenge.id}
                onClick={() => onSelectChallenge(challenge)}
                onMouseEnter={() => setHoveredChallenge(challenge.id)}
                onMouseLeave={() => setHoveredChallenge(null)}
                className={`
                  border rounded-lg p-4 cursor-pointer transition-all
                  ${hoveredChallenge === challenge.id
                    ? 'border-blue-400 shadow-md bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                {/* Challenge Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {challenge.title}
                      </h3>

                      {/* Tier Badge */}
                      <span className={`
                        inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border
                        ${getTierColor(challenge.implementationTier)}
                      `}>
                        {getTierIcon(challenge.implementationTier)}
                        <span>Tier {challenge.implementationTier === 'simple' ? 1 :
                                     challenge.implementationTier === 'moderate' ? 2 : 3}</span>
                      </span>

                      {/* Difficulty Stars */}
                      <div className="flex items-center">
                        {getDifficultyStars(challenge.difficulty)}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {challenge.description}
                    </p>

                    {/* Requirements Summary */}
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{challenge.requirements.latency}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-gray-500">
                        <DollarSign className="w-4 h-4" />
                        <span>{challenge.requirements.budget}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-gray-500">
                        <Architecture className="w-4 h-4" />
                        <span>{challenge.testCases.length} test cases</span>
                      </div>
                    </div>

                    {/* What You'll Do */}
                    <div className="mt-3 bg-white bg-opacity-60 rounded-lg p-2">
                      <div className="text-xs font-medium text-gray-700 mb-1">What you'll do:</div>
                      <div className="flex flex-wrap gap-2">
                        {uiReqs.needsArchitectureOnly && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            <Architecture className="w-3 h-3" />
                            <span>Design System</span>
                          </span>
                        )}
                        {uiReqs.needsCodeEditor && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            <Code className="w-3 h-3" />
                            <span>Write Python Code</span>
                          </span>
                        )}
                        {uiReqs.needsAlgorithmConfig && (
                          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                            <Settings className="w-3 h-3" />
                            <span>Configure Algorithms</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Learning Objectives (on hover) */}
                    {hoveredChallenge === challenge.id && challenge.learningObjectives && (
                      <div className="mt-3 p-2 bg-blue-100 bg-opacity-50 rounded-lg">
                        <div className="text-xs font-medium text-blue-900 mb-1">
                          You'll learn:
                        </div>
                        <ul className="text-xs text-blue-800 space-y-0.5">
                          {challenge.learningObjectives.slice(0, 3).map((obj, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-1">•</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <ChevronRight className={`
                    w-5 h-5 text-gray-400 ml-4 transition-transform
                    ${hoveredChallenge === challenge.id ? 'translate-x-1' : ''}
                  `} />
                </div>
              </div>
            );
          })}

          {filteredChallenges.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No challenges found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTier('all');
                }}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}