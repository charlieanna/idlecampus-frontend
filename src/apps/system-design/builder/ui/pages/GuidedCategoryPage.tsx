import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getCategoriesWithCounts,
  groupByDifficulty,
  getEstimatedTime,
  GUIDED_CATEGORIES,
} from '../../utils/guidedTutorialUtils';
import { Challenge } from '../../types/testCase';

/**
 * GuidedCategoryPage - Shows all guided tutorials in a specific category
 */

// Tutorial card for category view
function TutorialCard({
  challenge,
  onClick,
}: {
  challenge: Challenge;
  onClick: () => void;
}) {
  const estimatedTime = getEstimatedTime(challenge);
  const stepCount = challenge.problemDefinition?.guidedTutorial?.steps?.length || 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-5 border border-gray-200 hover:border-indigo-400 group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {challenge.title}
        </h3>
        <span
          className={`ml-2 flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full ${
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

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{challenge.description}</p>

      {/* Requirements preview */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center text-xs text-gray-500">
          <span className="font-medium mr-2">📊</span>
          <span className="truncate">{challenge.requirements.traffic}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <span className="font-medium mr-2">⚡</span>
          <span>{challenge.requirements.latency}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>⏱️ {estimatedTime}</span>
          <span>📚 {stepCount} steps</span>
        </div>
        <span className="text-xs font-medium text-indigo-600 group-hover:text-indigo-700">
          Start Tutorial →
        </span>
      </div>
    </div>
  );
}

// Difficulty group component
function DifficultyGroup({
  title,
  icon,
  color,
  bgColor,
  challenges,
  onSelect,
}: {
  title: string;
  icon: string;
  color: string;
  bgColor: string;
  challenges: Challenge[];
  onSelect: (id: string) => void;
}) {
  if (challenges.length === 0) return null;

  return (
    <div className="mb-10">
      <div className={`${bgColor} rounded-lg p-4 mb-4`}>
        <h3 className={`text-lg font-bold ${color} flex items-center gap-2`}>
          {icon} {title}
          <span className="text-sm font-normal opacity-75">({challenges.length} tutorials)</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <TutorialCard
            key={challenge.id}
            challenge={challenge}
            onClick={() => onSelect(challenge.id)}
          />
        ))}
      </div>
    </div>
  );
}

export const GuidedCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const categoriesWithCounts = useMemo(() => getCategoriesWithCounts(), []);

  const currentCategory = useMemo(() => {
    return (
      categoriesWithCounts.find((cat) => cat.id === categoryId) ||
      GUIDED_CATEGORIES.find((cat) => cat.id === categoryId)
    );
  }, [categoriesWithCounts, categoryId]);

  const categoryData = useMemo(() => {
    return categoriesWithCounts.find((cat) => cat.id === categoryId);
  }, [categoriesWithCounts, categoryId]);

  const byDifficulty = useMemo(() => {
    if (!categoryData) return { beginner: [], intermediate: [], advanced: [] };
    return groupByDifficulty(categoryData.challenges);
  }, [categoryData]);

  const handleSelectChallenge = (challengeId: string) => {
    navigate(`/system-design/${challengeId.replace(/_/g, '-')}/guided`);
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h1>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/system-design/guided')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            ← Back to Guided Tutorials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <button
              onClick={() => navigate('/system-design')}
              className="hover:text-indigo-600 transition-colors"
            >
              Problems
            </button>
            <span>→</span>
            <button
              onClick={() => navigate('/system-design/guided')}
              className="hover:text-indigo-600 transition-colors"
            >
              Guided Tutorials
            </button>
            <span>→</span>
            <span className="text-gray-900 font-medium">{currentCategory.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{currentCategory.icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentCategory.name}</h1>
                <p className="text-gray-600 mt-1">{currentCategory.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600">
                  {categoryData?.count || 0}
                </div>
                <div className="text-sm text-gray-500">tutorials</div>
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {byDifficulty.beginner.length}
                </div>
                <div className="text-sm text-gray-500">beginner</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600">
                  {byDifficulty.intermediate.length}
                </div>
                <div className="text-sm text-gray-500">intermediate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600">
                  {byDifficulty.advanced.length}
                </div>
                <div className="text-sm text-gray-500">advanced</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DifficultyGroup
          title="Beginner"
          icon="🟢"
          color="text-green-800"
          bgColor="bg-green-50"
          challenges={byDifficulty.beginner}
          onSelect={handleSelectChallenge}
        />

        <DifficultyGroup
          title="Intermediate"
          icon="🟡"
          color="text-yellow-800"
          bgColor="bg-yellow-50"
          challenges={byDifficulty.intermediate}
          onSelect={handleSelectChallenge}
        />

        <DifficultyGroup
          title="Advanced"
          icon="🔴"
          color="text-red-800"
          bgColor="bg-red-50"
          challenges={byDifficulty.advanced}
          onSelect={handleSelectChallenge}
        />

        {categoryData?.challenges.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No tutorials yet</h2>
            <p className="text-gray-600 mb-6">
              Tutorials for this category are coming soon!
            </p>
            <button
              onClick={() => navigate('/system-design/guided')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              ← Browse Other Categories
            </button>
          </div>
        )}
      </div>

      {/* Other Categories */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Other Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categoriesWithCounts
              .filter((cat) => cat.id !== categoryId)
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/system-design/guided/${cat.id}`)}
                  className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow-sm transition-all text-sm"
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}
                  <span className="ml-2 text-gray-400">({cat.count})</span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
