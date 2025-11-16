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
export { internalBuildSystemChallenge } from './internalBuildSystem';
export { secretManagementChallenge } from './secretManagement';
export { internalApiGatewayChallenge } from './internalApiGateway';

// Data Infrastructure
export { featureStoreChallenge } from './featureStore';
export { etlOrchestrationChallenge } from './etlOrchestration';
export { logAggregationChallenge } from './logAggregation';

// Observability & Operations
export { distributedTracingChallenge } from './distributedTracing';

// Migration & Reliability
export { zeroDowntimeMigrationChallenge } from './zeroDowntimeMigration';

/**
 * All internal systems challenges
 */
export const internalSystemsChallenges = [
  // Developer Tools (6 implemented, 9 pending)
  'codeReviewSystemChallenge',
  'cicdPipelineChallenge',
  'featureFlagSystemChallenge',
  'internalBuildSystemChallenge',
  'secretManagementChallenge',
  'internalApiGatewayChallenge',
  // TODO: Add remaining 9 developer tools challenges

  // Data Infrastructure (3 implemented, 12 pending)
  'featureStoreChallenge',
  'etlOrchestrationChallenge',
  'logAggregationChallenge',
  // TODO: Add remaining 12 data infrastructure challenges

  // Observability (1 implemented, 11 pending)
  'distributedTracingChallenge',
  // TODO: Add remaining 11 observability challenges

  // Migration & Reliability (1 implemented, 7 pending)
  'zeroDowntimeMigrationChallenge',
  // TODO: Add remaining 7 migration challenges

  // ML Infrastructure (1 implemented, 9 pending)
  // featureStoreChallenge already exported in Data Infrastructure above
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
  const { internalBuildSystemChallenge } = require('./internalBuildSystem');
  const { secretManagementChallenge } = require('./secretManagement');
  const { internalApiGatewayChallenge } = require('./internalApiGateway');
  const { featureStoreChallenge } = require('./featureStore');
  const { etlOrchestrationChallenge } = require('./etlOrchestration');
  const { logAggregationChallenge } = require('./logAggregation');
  const { distributedTracingChallenge } = require('./distributedTracing');
  const { zeroDowntimeMigrationChallenge } = require('./zeroDowntimeMigration');

  return [
    // Developer Tools
    codeReviewSystemChallenge,
    cicdPipelineChallenge,
    featureFlagSystemChallenge,
    internalBuildSystemChallenge,
    secretManagementChallenge,
    internalApiGatewayChallenge,
    // Data Infrastructure
    featureStoreChallenge,
    etlOrchestrationChallenge,
    logAggregationChallenge,
    // Observability
    distributedTracingChallenge,
    // Migration & Reliability
    zeroDowntimeMigrationChallenge,
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
      'internal_build_system',
      'secret_management',
      'internal_api_gateway',
    ],
    data_infrastructure: [
      'feature_store',
      'etl_orchestration',
      'log_aggregation',
    ],
    observability: [
      'distributed_tracing',
    ],
    migration: [
      'zero_downtime_migration',
    ],
    ml_infrastructure: [
      'feature_store',
    ],
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
