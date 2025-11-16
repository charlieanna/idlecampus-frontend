/**
 * L4-L5 Internal Systems Design Problems
 *
 * This module exports system design challenges focused on internal infrastructure
 * commonly asked at Google, Uber, Airbnb for Senior/Staff (L4-L5) level positions.
 *
 * These problems focus on:
 * - Internal developer tools and platforms
 * - Data infrastructure and analytics
 * - Observability and operations
 * - Migration and reliability
 * - ML infrastructure
 *
 * Unlike customer-facing problems (Instagram, Uber app), these focus on
 * internal systems that engineers build for other engineers.
 */

// Developer Tools & Platforms
export { codeReviewSystemChallenge } from './codeReviewSystem';
export { cicdPipelineChallenge } from './cicdPipeline';
export { featureFlagSystemChallenge } from './featureFlagSystem';

// Data Infrastructure & ML
export { featureStoreChallenge } from './featureStore';

// Observability & Operations
export { distributedTracingChallenge } from './distributedTracing';

/**
 * All internal systems challenges
 */
export const internalSystemsChallenges = [
  // Developer Tools (5 implemented, 10 pending)
  'codeReviewSystemChallenge',
  'cicdPipelineChallenge',
  'featureFlagSystemChallenge',
  // TODO: Add remaining 12 developer tools challenges

  // Data Infrastructure (1 implemented, 14 pending)
  'featureStoreChallenge',
  // TODO: Add remaining 14 data infrastructure challenges

  // Observability (1 implemented, 11 pending)
  'distributedTracingChallenge',
  // TODO: Add remaining 11 observability challenges

  // Migration & Reliability (0 implemented, 8 pending)
  // TODO: Add all 8 migration challenges

  // ML Infrastructure (1 implemented, 9 pending)
  // Already exported featureStoreChallenge above
  // TODO: Add remaining 9 ML infrastructure challenges
];

/**
 * Get all implemented challenges
 */
export function getInternalSystemsChallenges() {
  // Import dynamically to avoid circular dependencies
  const { codeReviewSystemChallenge } = require('./codeReviewSystem');
  const { cicdPipelineChallenge } = require('./cicdPipeline');
  const { featureFlagSystemChallenge } = require('./featureFlagSystem');
  const { featureStoreChallenge } = require('./featureStore');
  const { distributedTracingChallenge } = require('./distributedTracing');

  return [
    codeReviewSystemChallenge,
    cicdPipelineChallenge,
    featureFlagSystemChallenge,
    featureStoreChallenge,
    distributedTracingChallenge,
  ];
}

/**
 * Get challenges by category
 */
export function getChallengesByCategory(category: string) {
  const all = getInternalSystemsChallenges();

  const categoryMap: { [key: string]: string[] } = {
    developer_tools: [
      'code_review_system',
      'cicd_pipeline',
      'feature_flag_system',
    ],
    data_infrastructure: ['feature_store'],
    observability: ['distributed_tracing'],
    migration: [],
    ml_infrastructure: ['feature_store'],
  };

  const challengeIds = categoryMap[category] || [];
  return all.filter((c) => challengeIds.includes(c.id));
}

/**
 * Get challenges by difficulty
 */
export function getChallengesByDifficulty(difficulty: 'advanced') {
  const all = getInternalSystemsChallenges();
  return all.filter((c) => c.difficulty === difficulty);
}
