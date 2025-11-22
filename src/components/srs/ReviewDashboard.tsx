/**
 * Spaced Repetition Review Dashboard
 *
 * Shows user's learning progress, due concepts, and mastery levels
 */

import React, { useState, useEffect } from 'react';
import { Concept, ConceptDueForReview, MasteryLevel } from '../../types/spacedRepetition';
import {
  getConceptsDueForReview,
  getWeakConcepts,
  getUserStatistics,
  createReviewSession,
} from '../../services/spacedRepetitionService';
import { systemDesignConcepts } from '../../data/srs/concepts';
import { scenarioQuestions } from '../../data/srs/scenarioQuestions';

interface Props {
  userId: string;
  onStartReview?: (sessionId: string) => void;
}

export const ReviewDashboard: React.FC<Props> = ({ userId, onStartReview }) => {
  const [stats, setStats] = useState(getUserStatistics(userId));
  const [dueConcepts, setDueConcepts] = useState<ConceptDueForReview[]>([]);
  const [weakConcepts, setWeakConcepts] = useState<ConceptDueForReview[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Refresh data
    const loadData = () => {
      setStats(getUserStatistics(userId));

      const due = getConceptsDueForReview(
        {
          userId,
          maxConcepts: 20,
          prioritizeWeak: false,
        },
        systemDesignConcepts
      );
      setDueConcepts(due);

      const weak = getWeakConcepts(userId, systemDesignConcepts, 10);
      setWeakConcepts(weak);
    };

    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [userId, selectedCategory]);

  const handleStartDailyReview = () => {
    const session = createReviewSession(
      userId,
      'daily_review',
      dueConcepts.slice(0, 5),
      scenarioQuestions
    );
    if (onStartReview) {
      onStartReview(session.id);
    }
  };

  const handleStartWeakConceptsReview = () => {
    const session = createReviewSession(
      userId,
      'weak_concepts',
      weakConcepts.slice(0, 5),
      scenarioQuestions
    );
    if (onStartReview) {
      onStartReview(session.id);
    }
  };

  const getMasteryColor = (level: MasteryLevel): string => {
    const colors = {
      not_started: 'bg-gray-200 text-gray-700',
      learning: 'bg-red-100 text-red-700',
      familiar: 'bg-yellow-100 text-yellow-700',
      proficient: 'bg-blue-100 text-blue-700',
      mastered: 'bg-green-100 text-green-700',
    };
    return colors[level];
  };

  const getMasteryLabel = (level: MasteryLevel): string => {
    const labels = {
      not_started: 'Not Started',
      learning: 'Learning',
      familiar: 'Familiar',
      proficient: 'Proficient',
      mastered: 'Mastered',
    };
    return labels[level];
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays > 1) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Your Learning Dashboard</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <div className="text-sm opacity-90">Concepts Reviewed</div>
            <div className="text-3xl font-bold">{stats.totalConceptsReviewed}</div>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <div className="text-sm opacity-90">Total Reviews</div>
            <div className="text-3xl font-bold">{stats.totalReviews}</div>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <div className="text-sm opacity-90">Average Score</div>
            <div className="text-3xl font-bold">{stats.averageScore}%</div>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <div className="text-sm opacity-90">Current Streak</div>
            <div className="text-3xl font-bold">{stats.streakDays} days</div>
          </div>
        </div>
      </div>

      {/* Mastery Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Mastery Progress</h2>
        <div className="grid grid-cols-5 gap-3">
          {(Object.keys(stats.masteryBreakdown) as MasteryLevel[]).map(level => (
            <div
              key={level}
              className={`p-4 rounded-lg text-center ${getMasteryColor(level)}`}
            >
              <div className="text-2xl font-bold">{stats.masteryBreakdown[level]}</div>
              <div className="text-sm">{getMasteryLabel(level)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Due for Review */}
      {dueConcepts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Due for Review ({dueConcepts.length})</h2>
            <button
              onClick={handleStartDailyReview}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Start Daily Review
            </button>
          </div>

          <div className="space-y-3">
            {dueConcepts.slice(0, 10).map(item => (
              <div
                key={item.conceptId}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{item.concept.title}</h3>
                  <p className="text-sm text-gray-600">{item.concept.description}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${getMasteryColor(item.state.masteryLevel)}`}>
                      {getMasteryLabel(item.state.masteryLevel)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.state.totalReviews} reviews
                    </span>
                    <span className="text-xs text-gray-500">
                      Ease: {item.state.easeFactor.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm font-semibold text-red-600">
                    {formatDate(item.state.nextReviewAt)}
                  </div>
                  <div className="text-xs text-gray-500">Priority: {item.priority.toFixed(0)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Reviews Due */}
      {dueConcepts.length === 0 && (
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="text-4xl mr-4">🎉</div>
            <div>
              <h3 className="font-bold text-green-800">All caught up!</h3>
              <p className="text-green-700">
                No concepts due for review right now.
                {stats.nextReviewDate && (
                  <span> Next review: {formatDate(stats.nextReviewDate)}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weak Concepts */}
      {weakConcepts.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Concepts to Strengthen ({weakConcepts.length})</h2>
            <button
              onClick={handleStartWeakConceptsReview}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
            >
              Practice Weak Areas
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            These concepts have low ease factors or low success rates. Extra practice will help!
          </p>

          <div className="space-y-3">
            {weakConcepts.map(item => (
              <div
                key={item.conceptId}
                className="flex items-center justify-between p-4 border border-orange-200 bg-orange-50 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{item.concept.title}</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-xs text-gray-600">
                      Success rate: {((item.state.totalCorrect / item.state.totalReviews) * 100).toFixed(0)}%
                    </span>
                    <span className="text-xs text-gray-600">
                      Ease factor: {item.state.easeFactor.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className={`px-3 py-1 rounded ${getMasteryColor(item.state.masteryLevel)}`}>
                    {getMasteryLabel(item.state.masteryLevel)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Browse All Concepts */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">All Concepts</h2>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {Array.from(new Set(systemDesignConcepts.map(c => c.category))).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded capitalize ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Concepts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemDesignConcepts
            .filter(c => !selectedCategory || c.category === selectedCategory)
            .map(concept => {
              const state = getUserStatistics(userId);
              // This is simplified - in real app, you'd fetch individual concept state
              return (
                <div key={concept.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <h3 className="font-semibold mb-1">{concept.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{concept.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {concept.estimatedTimeMinutes} min
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {concept.difficultyLevel}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ReviewDashboard;
