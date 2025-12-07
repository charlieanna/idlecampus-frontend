import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCategoriesWithCounts,
  getGuidedTutorialCount,
  groupByDifficulty,
  getEstimatedTime,
  GuidedCategory,
} from '../../utils/guidedTutorialUtils';
import { Challenge } from '../../types/testCase';

/**
 * GuidedTutorialHub - Main landing page for guided tutorials
 * Displays categories, popular tutorials, and difficulty-based navigation
 */

// Category card component
function CategoryCard({
  category,
  onClick,
}: {
  category: GuidedCategory & { count: number; challenges: Challenge[] };
  onClick: () => void;
}) {
  const topChallenges = category.challenges.slice(0, 3);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer p-6 border border-gray-200 hover:border-indigo-400 group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {category.name}
            </h3>
            <span className="text-sm text-gray-500">{category.count} tutorials</span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
          <span className="text-indigo-600 text-lg">→</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{category.description}</p>

      {/* Preview of tutorials */}
      <div className="space-y-2">
        {topChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className="text-xs text-gray-500 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="truncate">{challenge.title}</span>
          </div>
        ))}
        {category.challenges.length > 3 && (
          <div className="text-xs text-indigo-600 font-medium">
            +{category.challenges.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
}

// Featured tutorial card
function FeaturedTutorialCard({
  challenge,
  onClick,
}: {
  challenge: Challenge;
  onClick: () => void;
}) {
  const estimatedTime = getEstimatedTime(challenge);

  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200 hover:border-indigo-400 cursor-pointer transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 line-clamp-1">{challenge.title}</h4>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            challenge.difficulty === 'beginner'
              ? 'bg-green-100 text-green-700'
              : challenge.difficulty === 'intermediate'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {challenge.difficulty}
        </span>
      </div>
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{challenge.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>⏱️ {estimatedTime}</span>
        <span className="text-indigo-600 font-medium">Start →</span>
      </div>
    </div>
  );
}

// Difficulty section component
function DifficultySection({
  title,
  icon,
  challenges,
  color,
  onSelect,
}: {
  title: string;
  icon: string;
  challenges: Challenge[];
  color: string;
  onSelect: (id: string) => void;
}) {
  if (challenges.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className={`text-lg font-bold ${color} flex items-center gap-2 mb-4`}>
        {icon} {title}
        <span className="text-sm font-normal text-gray-500">({challenges.length})</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {challenges.slice(0, 8).map((challenge) => (
          <FeaturedTutorialCard
            key={challenge.id}
            challenge={challenge}
            onClick={() => onSelect(challenge.id)}
          />
        ))}
      </div>
      {challenges.length > 8 && (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            +{challenges.length - 8} more {title.toLowerCase()} tutorials
          </span>
        </div>
      )}
    </div>
  );
}

export const GuidedTutorialHub: React.FC = () => {
  const navigate = useNavigate();

  const categoriesWithCounts = useMemo(() => getCategoriesWithCounts(), []);
  const totalCount = useMemo(() => getGuidedTutorialCount(), []);

  // Get all guided challenges for difficulty breakdown
  const allGuidedChallenges = useMemo(() => {
    return categoriesWithCounts.flatMap((cat) => cat.challenges);
  }, [categoriesWithCounts]);

  const byDifficulty = useMemo(
    () => groupByDifficulty(allGuidedChallenges),
    [allGuidedChallenges]
  );

  const handleSelectCategory = (categoryId: string) => {
    navigate(`/system-design/guided/${categoryId}`);
  };

  const handleSelectChallenge = (challengeId: string) => {
    navigate(`/system-design/${challengeId.replace(/_/g, '-')}/guided`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => navigate('/system-design')}
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  ← Back to Problems
                </button>
              </div>
              <h1 className="text-4xl font-bold mb-4">Guided System Design Tutorials</h1>
              <p className="text-xl text-indigo-200 mb-6 max-w-2xl">
                Learn system design step-by-step with interactive tutorials.
                Master real-world architectures through hands-on practice.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{totalCount}</span>
                  <span className="text-indigo-200">tutorials</span>
                </div>
                <div className="h-8 w-px bg-indigo-400" />
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{categoriesWithCounts.length}</span>
                  <span className="text-indigo-200">categories</span>
                </div>
                <div className="h-8 w-px bg-indigo-400" />
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">6-10</span>
                  <span className="text-indigo-200">steps each</span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="hidden lg:flex flex-col gap-3">
              <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-4">
                <div className="text-sm text-indigo-200 mb-1">Beginner Friendly</div>
                <div className="text-2xl font-bold">{byDifficulty.beginner.length} tutorials</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-4">
                <div className="text-sm text-indigo-200 mb-1">Intermediate</div>
                <div className="text-2xl font-bold">{byDifficulty.intermediate.length} tutorials</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-4">
                <div className="text-sm text-indigo-200 mb-1">Advanced</div>
                <div className="text-2xl font-bold">{byDifficulty.advanced.length} tutorials</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCounts.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => handleSelectCategory(category.id)}
            />
          ))}
        </div>
      </div>

      {/* By Difficulty Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Difficulty</h2>

        <DifficultySection
          title="Beginner"
          icon="🟢"
          challenges={byDifficulty.beginner}
          color="text-green-700"
          onSelect={handleSelectChallenge}
        />

        <DifficultySection
          title="Intermediate"
          icon="🟡"
          challenges={byDifficulty.intermediate}
          color="text-yellow-700"
          onSelect={handleSelectChallenge}
        />

        <DifficultySection
          title="Advanced"
          icon="🔴"
          challenges={byDifficulty.advanced}
          color="text-red-700"
          onSelect={handleSelectChallenge}
        />
      </div>

      {/* Quick Start Section */}
      <div className="bg-indigo-50 border-t border-indigo-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start?</h2>
            <p className="text-gray-600">Jump into a beginner-friendly tutorial and learn system design fundamentals</p>
          </div>
          <div className="flex justify-center gap-4">
            {byDifficulty.beginner.slice(0, 3).map((challenge) => (
              <button
                key={challenge.id}
                onClick={() => handleSelectChallenge(challenge.id)}
                className="px-6 py-3 bg-white border border-indigo-200 rounded-lg hover:border-indigo-400 hover:shadow-md transition-all text-left max-w-xs"
              >
                <div className="font-semibold text-gray-900 mb-1 truncate">{challenge.title}</div>
                <div className="text-sm text-gray-500">⏱️ {getEstimatedTime(challenge)} • 🟢 Beginner</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
