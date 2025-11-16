import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { tieredChallenges } from '../../challenges/tieredChallenges';
import { Challenge } from '../../types/testCase';
import { isCoreProblem, getCoreStage } from '../../challenges/coreTrack';

// Extract category from problem ID
function extractCategory(id: string): string {
  // Map prefixes to categories
  if (id.includes('tutorial')) return 'Tutorial';
  if (id.includes('cache') || id.includes('cdn') || id.includes('redis')) return 'Caching';
  if (id.includes('gateway') || id.includes('rate-limit')) return 'API Gateway';
  if (id.includes('stream') || id.includes('queue') || id.includes('kafka') || id.includes('notification')) return 'Streaming';
  if (id.includes('storage') || id.includes('database') || id.includes('nosql') || id.includes('db')) return 'Storage';
  if (id.includes('search') || id.includes('elastic')) return 'Search';
  if (id.includes('multiregion') || id.includes('multi-region') || id.includes('global') || id.includes('cross-region')) return 'Multiregion';
  if (id.includes('migration') || id.includes('netflix') || id.includes('uber') || id.includes('twitter')) return 'Platform Migration';
  if (id.includes('api-') || id.includes('graphql') || id.includes('facebook')) return 'API Platform';
  if (id.includes('multi-tenant') || id.includes('multitenant') || id.includes('salesforce')) return 'Multi-tenant';
  if (id.includes('data-platform')) return 'Data Platform';
  if (id.includes('devprod') || id.includes('ci')) return 'Developer Productivity';
  if (id.includes('ai-') || id.includes('agi') || id.includes('brain')) return 'AI Infrastructure';
  if (id.includes('consensus') || id.includes('raft') || id.includes('paxos')) return 'Distributed Consensus';
  if (id.includes('economic') || id.includes('cbdc')) return 'Economic Systems';
  if (id.includes('energy') || id.includes('carbon')) return 'Energy & Sustainability';
  if (id.includes('existential') || id.includes('nuclear') || id.includes('pandemic')) return 'Existential Infrastructure';
  if (id.includes('infra') || id.includes('kubernetes')) return 'Infrastructure';
  if (id.includes('ml-') || id.includes('model')) return 'ML Platform';
  if (id.includes('quantum') || id.includes('biological')) return 'Next-gen Computing';
  if (id.includes('protocol') || id.includes('6g') || id.includes('interplanetary')) return 'Next-gen Protocols';
  if (id.includes('db-') || id.includes('dna-storage') || id.includes('neuromorphic')) return 'Novel Databases';
  if (id.includes('observability') || id.includes('datadog')) return 'Observability';
  if (id.includes('privacy') || id.includes('homomorphic') || id.includes('zkp')) return 'Privacy';
  if (id.includes('bio-') || id.includes('neural-implant')) return 'Bio-digital';
  if (id.includes('security') || id.includes('compliance') || id.includes('encryption')) return 'Security & Compliance';

  // Default categories based on title/description keywords
  return 'General';
}

// Extract company from problem title/ID
function extractCompany(challenge: Challenge): string | null {
  const text = `${challenge.id} ${challenge.title} ${challenge.description}`.toLowerCase();

  if (text.includes('netflix')) return 'Netflix';
  if (text.includes('twitter')) return 'Twitter';
  if (text.includes('uber')) return 'Uber';
  if (text.includes('spotify')) return 'Spotify';
  if (text.includes('airbnb')) return 'Airbnb';
  if (text.includes('stripe')) return 'Stripe';
  if (text.includes('slack')) return 'Slack';
  if (text.includes('github')) return 'GitHub';
  if (text.includes('instagram')) return 'Instagram';
  if (text.includes('doordash')) return 'DoorDash';
  if (text.includes('zoom')) return 'Zoom';
  if (text.includes('pinterest')) return 'Pinterest';
  if (text.includes('linkedin')) return 'LinkedIn';
  if (text.includes('reddit')) return 'Reddit';
  if (text.includes('snapchat')) return 'Snapchat';
  if (text.includes('shopify')) return 'Shopify';
  if (text.includes('twitch')) return 'Twitch';
  if (text.includes('coinbase')) return 'Coinbase';
  if (text.includes('figma')) return 'Figma';
  if (text.includes('facebook')) return 'Facebook';
  if (text.includes('google')) return 'Google';
  if (text.includes('amazon')) return 'Amazon';
  if (text.includes('salesforce')) return 'Salesforce';
  if (text.includes('apple')) return 'Apple';
  if (text.includes('meta')) return 'Meta';
  if (text.includes('tiktok')) return 'TikTok';
  if (text.includes('datadog')) return 'Datadog';

  return null;
}

// Difficulty badge component
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
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

// Company badge component
function CompanyBadge({ company }: { company: string }) {
  return (
    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
      🏢 {company}
    </span>
  );
}

// Problem card component
function ProblemCard({ challenge, onClick }: { challenge: Challenge; onClick: () => void }) {
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
        {challenge.description}
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
        {challenge.company && <CompanyBadge company={challenge.company} />}
        {challenge.isCore && (
          <span className="px-2 py-1 text-[10px] font-semibold rounded-full bg-purple-100 text-purple-800">
            Core Track{challenge.coreStage ? ` · Stage ${challenge.coreStage}` : ''}
          </span>
        )}
      </div>
    </div>
  );
}

export function ProblemCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'difficulty' | 'category'>('difficulty');
  const [trackFilter, setTrackFilter] = useState<'all' | 'core'>('all');

  // Enrich challenges with metadata and filter out tutorials
  const enrichedChallenges = useMemo(() => {
    return tieredChallenges
      .filter(challenge => !challenge.id.includes('tutorial') && !challenge.id.includes('boe-walkthrough'))
      .map(challenge => ({
        ...challenge,
        category: extractCategory(challenge.id),
        company: extractCompany(challenge),
        isCore: isCoreProblem(challenge),
        coreStage: getCoreStage(challenge),
      }));
  }, []);

  // Get unique values for categories
  const categories = useMemo(() => {
    const cats = new Set(enrichedChallenges.map(c => c.category));
    return Array.from(cats).sort();
  }, [enrichedChallenges]);

  // Filter challenges
  const filteredChallenges = useMemo(() => {
    let list = enrichedChallenges;

    if (trackFilter === 'core') {
      list = list.filter(c => c.isCore);
    }

    if (!searchTerm) return list;

    const term = searchTerm.toLowerCase();
    return list.filter(c =>
      c.title.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term)
    );
  }, [enrichedChallenges, searchTerm, trackFilter]);

  // Group by difficulty
  const byDifficulty = useMemo(() => {
    return {
      beginner: filteredChallenges.filter(c => c.difficulty === 'beginner'),
      intermediate: filteredChallenges.filter(c => c.difficulty === 'intermediate'),
      advanced: filteredChallenges.filter(c => c.difficulty === 'advanced'),
    };
  }, [filteredChallenges]);

  // Group by category
  const byCategory = useMemo(() => {
    const grouped: Record<string, typeof enrichedChallenges> = {};
    filteredChallenges.forEach(challenge => {
      if (!grouped[challenge.category]) {
        grouped[challenge.category] = [];
      }
      grouped[challenge.category].push(challenge);
    });
    return grouped;
  }, [filteredChallenges]);

  const handleSelectChallenge = (challengeId: string) => {
    // Convert challenge ID to URL format (replace _ with -)
    const urlId = challengeId.replace(/_/g, '-');
    navigate(`/system-design/${urlId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Design Problems</h1>
              <p className="text-sm text-gray-600 mt-1">
                {enrichedChallenges.length} total • {enrichedChallenges.filter(c => c.isCore).length} core • {filteredChallenges.length} shown
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Track Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Track:</span>
                <button
                  onClick={() => setTrackFilter('all')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    trackFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Problems
                </button>
                <button
                  onClick={() => setTrackFilter('core')}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    trackFilter === 'core'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Core Track
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View by:</span>
                <button
                  onClick={() => setViewMode('difficulty')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'difficulty'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Difficulty
                </button>
                <button
                  onClick={() => setViewMode('category')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    viewMode === 'category'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Category
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Board View */}
      <div className="max-w-[1800px] mx-auto p-6">
        {viewMode === 'difficulty' ? (
          // Difficulty Columns
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Beginner Column */}
            <div className="flex flex-col">
              <div className="bg-green-100 rounded-t-lg p-4 border-b-4 border-green-600">
                <h2 className="text-lg font-bold text-green-900 flex items-center justify-between">
                  <span>🟢 Beginner</span>
                  <span className="text-sm bg-green-200 px-2 py-1 rounded-full">{byDifficulty.beginner.length}</span>
                </h2>
              </div>
              <div className="bg-gray-100 rounded-b-lg p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                {byDifficulty.beginner.map((challenge) => (
                  <ProblemCard
                    key={challenge.id}
                    challenge={challenge}
                    onClick={() => handleSelectChallenge(challenge.id)}
                  />
                ))}
                {byDifficulty.beginner.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">No problems found</p>
                )}
              </div>
            </div>

            {/* Intermediate Column */}
            <div className="flex flex-col">
              <div className="bg-yellow-100 rounded-t-lg p-4 border-b-4 border-yellow-600">
                <h2 className="text-lg font-bold text-yellow-900 flex items-center justify-between">
                  <span>🟡 Intermediate</span>
                  <span className="text-sm bg-yellow-200 px-2 py-1 rounded-full">{byDifficulty.intermediate.length}</span>
                </h2>
              </div>
              <div className="bg-gray-100 rounded-b-lg p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                {byDifficulty.intermediate.map((challenge) => (
                  <ProblemCard
                    key={challenge.id}
                    challenge={challenge}
                    onClick={() => handleSelectChallenge(challenge.id)}
                  />
                ))}
                {byDifficulty.intermediate.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">No problems found</p>
                )}
              </div>
            </div>

            {/* Advanced Column */}
            <div className="flex flex-col">
              <div className="bg-red-100 rounded-t-lg p-4 border-b-4 border-red-600">
                <h2 className="text-lg font-bold text-red-900 flex items-center justify-between">
                  <span>🔴 Advanced</span>
                  <span className="text-sm bg-red-200 px-2 py-1 rounded-full">{byDifficulty.advanced.length}</span>
                </h2>
              </div>
              <div className="bg-gray-100 rounded-b-lg p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                {byDifficulty.advanced.map((challenge) => (
                  <ProblemCard
                    key={challenge.id}
                    challenge={challenge}
                    onClick={() => handleSelectChallenge(challenge.id)}
                  />
                ))}
                {byDifficulty.advanced.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">No problems found</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Category Columns (horizontal scroll)
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
              {categories.map((category) => {
                const problems = byCategory[category] || [];
                return (
                  <div key={category} className="flex flex-col w-80 flex-shrink-0">
                    <div className="bg-blue-100 rounded-t-lg p-4 border-b-4 border-blue-600">
                      <h2 className="text-lg font-bold text-blue-900 flex items-center justify-between">
                        <span className="truncate">{category}</span>
                        <span className="text-sm bg-blue-200 px-2 py-1 rounded-full">{problems.length}</span>
                      </h2>
                    </div>
                    <div className="bg-gray-100 rounded-b-lg p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                      {problems.map((challenge) => (
                        <ProblemCard
                          key={challenge.id}
                          challenge={challenge}
                          onClick={() => handleSelectChallenge(challenge.id)}
                        />
                      ))}
                      {problems.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-8">No problems found</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
