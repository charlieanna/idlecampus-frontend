/**
 * Progressive Dashboard
 * 
 * Main entry point for the progressive learning flow.
 * Shows learning tracks, user progress, and available challenges.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { progressiveProgressService } from '../services/progressService';
import { getChallengeStats } from '../services/challengeMapper';
import {
  UserProgressState
} from '../types';
import { ProgressStatsWidget } from '../components/ProgressStatsWidget';
import { TrackCard } from '../components/TrackCard';

/**
 * Progressive Dashboard Component
 */
export function ProgressiveDashboard() {
  const [progress, setProgress] = useState<UserProgressState | null>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Load user progress
    const userProgress = progressiveProgressService.getProgress();
    setProgress(userProgress);

    // Load challenge stats
    const challengeStats = getChallengeStats();
    setStats(challengeStats);
  }, []);

  if (!progress || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                System Design Learning Path
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Master system design through progressive challenges
              </p>
            </div>
            <Link
              to="/system-design"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              ← Classic View
            </Link>
            <Link
              to="/progressive/all"
              className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              View All Challenges →
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Progress Stats Widget */}
        <div className="mb-8">
          <ProgressStatsWidget progress={progress} totalChallenges={stats.total} />
        </div>

        {/* Assessment Prompt */}
        {!progress.assessmentCompleted && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">
                  Take the Entry Assessment
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Take a quick 5-minute assessment to determine your skill level
                    and get personalized challenge recommendations.
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    to="/system-design/progressive/assessment"
                    className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    Start Assessment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Tracks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Learning Tracks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TrackCard
              trackId="fundamentals"
              name="Fundamentals"
              description="Master core system design concepts and basic patterns"
              icon="🎯"
              color="blue"
              progress={progress.trackProgress.fundamentals}
              estimatedHours={40}
            />
            <TrackCard
              trackId="concepts"
              name="Concepts"
              description="Learn advanced patterns and distributed systems concepts"
              icon="🚀"
              color="purple"
              progress={progress.trackProgress.concepts}
              estimatedHours={50}
            />
            <TrackCard
              trackId="systems"
              name="Systems"
              description="Design complex, production-grade distributed systems"
              icon="⚡"
              color="green"
              progress={progress.trackProgress.systems}
              estimatedHours={60}
            />
          </div>
        </div>

        {/* Recent Achievements */}
        {progress.achievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recent Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {progress.achievements.slice(-3).reverse().map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{achievement.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {achievement.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {achievement.description}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        +{achievement.xpReward} XP
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500">Total Challenges</div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Fundamentals</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.byTrack.fundamentals}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Concepts</div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.byTrack.concepts}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Systems</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.byTrack.systems}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}