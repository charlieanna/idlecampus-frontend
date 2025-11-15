import React, { useState, useMemo } from 'react';
import { Code, Settings, Building2, Search, Star, Clock, DollarSign } from 'lucide-react';
import { Challenge } from '../../types/testCase';

interface TieredChallengeSelectorProps {
  challenges: Challenge[];
  onSelectChallenge: (challenge: Challenge) => void;
}

// Extract category from challenge
function extractCategory(challenge: Challenge): string {
  const id = challenge.id.toLowerCase();
  const title = challenge.title.toLowerCase();

  // Caching
  if (id.includes('cache') || id.includes('cdn') || id.includes('redis')) {
    return 'Caching';
  }

  // API Gateway
  if (id.includes('gateway') || id.includes('rate-limit') || id.includes('api-')) {
    return 'API Gateway';
  }

  // Streaming
  if (id.includes('stream') || id.includes('queue') || id.includes('kafka') || id.includes('notification')) {
    return 'Streaming';
  }

  // Storage
  if (id.includes('storage') || id.includes('database') || id.includes('nosql') || id.includes('db-')) {
    return 'Storage';
  }

  // Search
  if (id.includes('search') || id.includes('elastic')) {
    return 'Search';
  }

  // Multiregion
  if (id.includes('multiregion') || id.includes('multi-region') || id.includes('global') || id.includes('cross-region')) {
    return 'Multiregion';
  }

  // AI Infrastructure
  if (id.includes('ai-') || id.includes('agi') || id.includes('brain') || id.includes('ml-') || id.includes('model')) {
    return 'AI Infrastructure';
  }

  // Distributed Consensus
  if (id.includes('consensus') || id.includes('raft') || id.includes('paxos')) {
    return 'Distributed Consensus';
  }

  // Economic Systems
  if (id.includes('economic') || id.includes('cbdc')) {
    return 'Economic Systems';
  }

  // Energy & Sustainability
  if (id.includes('energy') || id.includes('carbon')) {
    return 'Energy & Sustainability';
  }

  // Existential Infrastructure
  if (id.includes('existential') || id.includes('nuclear') || id.includes('pandemic')) {
    return 'Existential Infrastructure';
  }

  // Next-gen Computing
  if (id.includes('quantum') || id.includes('biological')) {
    return 'Next-gen Computing';
  }

  // Next-gen Protocols
  if (id.includes('protocol') || id.includes('6g') || id.includes('interplanetary')) {
    return 'Next-gen Protocols';
  }

  // Privacy
  if (id.includes('privacy') || id.includes('homomorphic') || id.includes('zkp')) {
    return 'Privacy';
  }

  // Bio-digital
  if (id.includes('bio-') || id.includes('neural-implant')) {
    return 'Bio-digital';
  }

  // Observability
  if (id.includes('observability') || id.includes('datadog')) {
    return 'Observability';
  }

  // Security & Compliance
  if (id.includes('security') || id.includes('compliance') || id.includes('encryption')) {
    return 'Security & Compliance';
  }

  // Social Media
  if (id.includes('instagram') || id.includes('twitter') || id.includes('facebook') ||
      id.includes('reddit') || id.includes('linkedin') || id.includes('tiktok') ||
      id.includes('snapchat') || id.includes('discord') || id.includes('pinterest') ||
      id.includes('medium')) {
    return 'Social Media';
  }

  // E-commerce & Services
  if (id.includes('amazon') || id.includes('shopify') || id.includes('stripe') ||
      id.includes('uber') || id.includes('airbnb') || id.includes('doordash')) {
    return 'E-commerce & Services';
  }

  // Streaming & Media
  if (id.includes('netflix') || id.includes('spotify') || id.includes('youtube') ||
      id.includes('twitch') || id.includes('hulu')) {
    return 'Streaming & Media';
  }

  // Messaging
  if (id.includes('whatsapp') || id.includes('slack') || id.includes('telegram') ||
      id.includes('messenger') || title.includes('chat') || title.includes('messaging')) {
    return 'Messaging';
  }

  // Infrastructure
  if (id.includes('pastebin') || id.includes('dropbox') || id.includes('drive') ||
      id.includes('github') || id.includes('stackoverflow') || id.includes('kubernetes')) {
    return 'Infrastructure';
  }

  // URL Services
  if (id.includes('url') || title.includes('url')) {
    return 'URL Services';
  }

  return 'General';
}

// Difficulty badge component
function DifficultyStars({ difficulty }: { difficulty: string }) {
  const count = difficulty === 'beginner' ? 1 : difficulty === 'intermediate' ? 2 : 3;
  return (
    <div className="flex items-center gap-0.5">
      {Array(3).fill(0).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

// Tier badge component
function TierBadge({ tier }: { tier: 'simple' | 'moderate' | 'advanced' }) {
  const config = {
    simple: {
      color: 'bg-green-100 text-green-800',
      label: 'Tier 1',
    },
    moderate: {
      color: 'bg-yellow-100 text-yellow-800',
      label: 'Tier 2',
    },
    advanced: {
      color: 'bg-red-100 text-red-800',
      label: 'Tier 3',
    },
  };

  const { color, label } = config[tier];

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
      {label}
    </span>
  );
}

// Category badge component
function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
      {category}
    </span>
  );
}

// Challenge card component
function ChallengeCard({ challenge, onClick }: { challenge: TieredChallenge; onClick: () => void }) {
  const category = extractCategory(challenge);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4 border border-gray-200 hover:border-blue-400 mb-3"
    >
      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
        {challenge.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {challenge.description.split('\n')[0]}
      </p>

      {/* Requirements Preview */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center text-xs text-gray-500">
          <span className="font-medium mr-2">📊</span>
          <span className="truncate">{challenge.requirements.traffic}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <span className="font-medium mr-2">⚡</span>
          <span>{challenge.requirements.latency}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <TierBadge tier={challenge.implementationTier} />
        <CategoryBadge category={category} />
      </div>
    </div>
  );
}

/**
 * Tiered Challenge Selector - Card-based Layout
 *
 * Shows all challenges organized by tier in a 3-column board view
 */
export function TieredChallengeSelector({
  challenges,
  onSelectChallenge,
}: TieredChallengeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(challenges.map(extractCategory));
    return ['All', ...Array.from(cats).sort()];
  }, [challenges]);

  // Filter challenges based on search and category
  const filteredChallenges = useMemo(() => {
    let filtered = challenges;

    // Filter by category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(c => extractCategory(c) === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(term) ||
        challenge.description.toLowerCase().includes(term) ||
        extractCategory(challenge).toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [challenges, searchTerm, selectedCategory]);

  // Group challenges by tier
  const challengesByTier = useMemo(() => ({
    simple: filteredChallenges.filter(c => c.implementationTier === 'simple'),
    moderate: filteredChallenges.filter(c => c.implementationTier === 'moderate'),
    advanced: filteredChallenges.filter(c => c.implementationTier === 'advanced'),
  }), [filteredChallenges]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Tiered System Design Challenges</h1>
              <p className="text-base text-gray-600">
                {challenges.length} problems • {filteredChallenges.length} filtered • 3-tier learning system
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search challenges by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 overflow-x-auto pb-3">
            <span className="text-sm font-medium text-gray-700 flex-shrink-0">Category:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors flex-shrink-0 ${
                  (category === 'All' && !selectedCategory) || category === selectedCategory
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tier Legend */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl">
            <div className="flex items-start space-x-3">
              <Code className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <div className="font-bold text-gray-900 text-base mb-1">Tier 1: Simple</div>
                <div className="text-gray-600 text-sm">Write Python code with provided templates</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Settings className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <div className="font-bold text-gray-900 text-base mb-1">Tier 2: Moderate</div>
                <div className="text-gray-600 text-sm">Configure algorithms and strategies</div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Building2 className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <div className="font-bold text-gray-900 text-base mb-1">Tier 3: Advanced</div>
                <div className="text-gray-600 text-sm">Design system architecture</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Board View - 3 Columns */}
      <div className="max-w-[1920px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Tier 1 Column */}
          <div className="flex flex-col">
            <div className="bg-green-100 rounded-t-lg p-4 border-b-4 border-green-600">
              <h2 className="text-lg font-bold text-green-900 flex items-center justify-between">
                <span>🟢 Tier 1: Simple</span>
                <span className="text-sm bg-green-200 px-2 py-1 rounded-full">{challengesByTier.simple.length}</span>
              </h2>
            </div>
            <div className="bg-gray-100 rounded-b-lg p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {challengesByTier.simple.length > 0 ? (
                challengesByTier.simple.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onClick={() => onSelectChallenge(challenge)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No Tier 1 challenges found
                </div>
              )}
            </div>
          </div>

          {/* Tier 2 Column */}
          <div className="flex flex-col">
            <div className="bg-yellow-100 rounded-t-lg p-4 border-b-4 border-yellow-600">
              <h2 className="text-lg font-bold text-yellow-900 flex items-center justify-between">
                <span>🟡 Tier 2: Moderate</span>
                <span className="text-sm bg-yellow-200 px-2 py-1 rounded-full">{challengesByTier.moderate.length}</span>
              </h2>
            </div>
            <div className="bg-gray-100 rounded-b-lg p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {challengesByTier.moderate.length > 0 ? (
                challengesByTier.moderate.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onClick={() => onSelectChallenge(challenge)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No Tier 2 challenges found
                </div>
              )}
            </div>
          </div>

          {/* Tier 3 Column */}
          <div className="flex flex-col">
            <div className="bg-red-100 rounded-t-lg p-4 border-b-4 border-red-600">
              <h2 className="text-lg font-bold text-red-900 flex items-center justify-between">
                <span>🔴 Tier 3: Advanced</span>
                <span className="text-sm bg-red-200 px-2 py-1 rounded-full">{challengesByTier.advanced.length}</span>
              </h2>
            </div>
            <div className="bg-gray-100 rounded-b-lg p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              {challengesByTier.advanced.length > 0 ? (
                challengesByTier.advanced.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onClick={() => onSelectChallenge(challenge)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No Tier 3 challenges found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* No Results */}
      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No challenges found matching your criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
