import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatedChallenges } from '../../challenges/generatedChallenges';
import { Challenge } from '../../types/testCase';

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

export function ProblemCatalog() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'difficulty'>('title');

  // Enrich challenges with metadata
  const enrichedChallenges = useMemo(() => {
    return generatedChallenges.map(challenge => ({
      ...challenge,
      category: extractCategory(challenge.id),
      company: extractCompany(challenge),
    }));
  }, []);

  // Get unique values for filters
  const categories = useMemo(() => {
    const cats = new Set(enrichedChallenges.map(c => c.category));
    return ['all', ...Array.from(cats).sort()];
  }, [enrichedChallenges]);

  const companies = useMemo(() => {
    const comps = new Set(enrichedChallenges.map(c => c.company).filter(Boolean) as string[]);
    return ['all', ...Array.from(comps).sort()];
  }, [enrichedChallenges]);

  // Filter and sort challenges
  const filteredChallenges = useMemo(() => {
    let filtered = enrichedChallenges;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term) ||
        c.category.toLowerCase().includes(term)
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(c => c.difficulty === selectedDifficulty);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }

    // Company filter
    if (selectedCompany !== 'all') {
      filtered = filtered.filter(c => c.company === selectedCompany);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'difficulty') {
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
      }
      return a.title.localeCompare(b.title);
    });

    return filtered;
  }, [enrichedChallenges, searchTerm, selectedDifficulty, selectedCategory, selectedCompany, sortBy]);

  const handleSelectChallenge = (challengeId: string) => {
    // Convert challenge ID to URL format (replace _ with -)
    const urlId = challengeId.replace(/_/g, '-');
    navigate(`/system-design/${urlId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Design Problems</h1>
          <p className="text-lg text-gray-600">
            {enrichedChallenges.length} problems to master system design • From basic caching to interplanetary protocols
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-blue-600">{enrichedChallenges.length}</div>
            <div className="text-sm text-gray-600">Total Problems</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-green-600">
              {enrichedChallenges.filter(c => c.difficulty === 'beginner').length}
            </div>
            <div className="text-sm text-gray-600">Beginner</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-yellow-600">
              {enrichedChallenges.filter(c => c.difficulty === 'intermediate').length}
            </div>
            <div className="text-sm text-gray-600">Intermediate</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-3xl font-bold text-red-600">
              {enrichedChallenges.filter(c => c.difficulty === 'advanced').length}
            </div>
            <div className="text-sm text-gray-600">Advanced</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Companies</option>
                {companies.filter(c => c !== 'all').map(comp => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort and Results */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <button
                onClick={() => setSortBy('title')}
                className={`px-3 py-1 text-sm rounded ${sortBy === 'title' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Title
              </button>
              <button
                onClick={() => setSortBy('difficulty')}
                className={`px-3 py-1 text-sm rounded ${sortBy === 'difficulty' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Difficulty
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredChallenges.length} of {enrichedChallenges.length} problems
            </div>
          </div>
        </div>

        {/* Problem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              onClick={() => handleSelectChallenge(challenge.id)}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow cursor-pointer p-6 border border-gray-200 hover:border-blue-500"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {challenge.title}
                </h3>
                <DifficultyBadge difficulty={challenge.difficulty} />
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {challenge.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <CategoryBadge category={challenge.category} />
                {challenge.company && <CompanyBadge company={challenge.company} />}
              </div>

              {/* Requirements Preview */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex items-center text-xs text-gray-500">
                  <span className="font-medium mr-2">📊 Traffic:</span>
                  <span className="truncate">{challenge.requirements.traffic}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="font-medium mr-2">⚡ Latency:</span>
                  <span>{challenge.requirements.latency}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="font-medium mr-2">✅ Availability:</span>
                  <span>{challenge.requirements.availability}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Start Challenge →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredChallenges.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No problems found</h3>
            <p className="text-gray-600">Try adjusting your filters or search term</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDifficulty('all');
                setSelectedCategory('all');
                setSelectedCompany('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
