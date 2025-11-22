/**
 * Track Card Component
 * 
 * Visual card for each learning track showing progress and status.
 * Based on PROGRESSIVE_FLOW_WIREFRAMES.md section 3.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { LearningTrackType, TrackProgress } from '../types';

interface TrackCardProps {
  trackId: LearningTrackType;
  name: string;
  description: string;
  icon: string;
  color: 'blue' | 'purple' | 'green';
  progress: TrackProgress;
  estimatedHours: number;
}

/**
 * Track Card Component
 */
export function TrackCard({
  trackId,
  name,
  description,
  icon,
  color,
  progress,
  estimatedHours
}: TrackCardProps) {
  const isLocked = progress.status === 'locked';
  const isCompleted = progress.status === 'completed';
  const isInProgress = progress.status === 'in_progress';

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      progress: 'bg-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      progress: 'bg-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      progress: 'bg-green-600',
      button: 'bg-green-600 hover:bg-green-700'
    }
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`border-2 rounded-lg p-6 transition-all ${
        isLocked
          ? 'bg-gray-50 border-gray-200'
          : `${colors.bg} ${colors.border} hover:shadow-md`
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">{icon}</div>
        {isLocked && (
          <div className="text-gray-400">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        )}
        {isCompleted && (
          <div className="text-green-600">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {isInProgress && !isCompleted && (
          <div className={colors.text}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        )}
      </div>

      {/* Title and Description */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {/* Stats */}
      <div className="mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2 mb-1">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Est: {estimatedHours} hours</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{progress.totalChallenges} challenges</span>
        </div>
      </div>

      {/* Progress Section */}
      {!isLocked && (
        <>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className={`font-semibold ${colors.text}`}>
                {Math.round(progress.progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`${colors.progress} h-2.5 rounded-full transition-all duration-500`}
                style={{ width: `${progress.progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <div className="flex items-center justify-between">
              <span>Completed:</span>
              <span className="font-semibold text-gray-900">
                {progress.challengesCompleted} of {progress.totalChallenges}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          {isCompleted && (
            <div className="mb-4 inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              ✓ Completed
            </div>
          )}
          {isInProgress && !isCompleted && (
            <div className="mb-4 inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              ⚡ In Progress
            </div>
          )}

          {/* Action Button */}
          <Link
            to={`/system-design/progressive/track/${trackId}`}
            className={`block w-full text-center px-4 py-2.5 text-white text-sm font-medium rounded-md transition-colors ${colors.button}`}
          >
            {isCompleted ? 'Review Track' : isInProgress ? 'Continue →' : 'Start Track'}
          </Link>
        </>
      )}

      {/* Locked State */}
      {isLocked && (
        <div className="text-sm text-gray-500">
          <div className="flex items-start gap-2">
            <svg className="h-4 w-4 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Complete previous tracks to unlock</span>
          </div>
        </div>
      )}
    </div>
  );
}