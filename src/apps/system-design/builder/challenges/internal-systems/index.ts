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
export { metricsAggregationChallenge } from './metricsAggregation';

// Observability & Operations
export { distributedTracingChallenge } from './distributedTracing';
export { alertingIncidentManagementChallenge } from './alertingIncidentManagement';
export { chaosEngineeringPlatformChallenge } from './chaosEngineeringPlatform';

// Migration & Reliability
export { zeroDowntimeMigrationChallenge } from './zeroDowntimeMigration';
export { multiRegionFailoverChallenge } from './multiRegionFailover';

// ML Infrastructure
export { modelServingPlatformChallenge } from './modelServingPlatform';

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

  // Data Infrastructure (4 implemented, 11 pending)
  'featureStoreChallenge',
  'etlOrchestrationChallenge',
  'logAggregationChallenge',
  'metricsAggregationChallenge',
  // TODO: Add remaining 11 data infrastructure challenges

  // Observability (3 implemented, 9 pending)
  'distributedTracingChallenge',
  'alertingIncidentManagementChallenge',
  'chaosEngineeringPlatformChallenge',
  // TODO: Add remaining 9 observability challenges

  // Migration & Reliability (2 implemented, 6 pending)
  'zeroDowntimeMigrationChallenge',
  'multiRegionFailoverChallenge',
  // TODO: Add remaining 6 migration challenges

  // ML Infrastructure (2 implemented, 8 pending)
  // featureStoreChallenge already exported in Data Infrastructure above
  'modelServingPlatformChallenge',
  // TODO: Add remaining 8 ML infrastructure challenges
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
  const { metricsAggregationChallenge } = require('./metricsAggregation');
  const { distributedTracingChallenge } = require('./distributedTracing');
  const { alertingIncidentManagementChallenge } = require('./alertingIncidentManagement');
  const { chaosEngineeringPlatformChallenge } = require('./chaosEngineeringPlatform');
  const { zeroDowntimeMigrationChallenge } = require('./zeroDowntimeMigration');
  const { multiRegionFailoverChallenge } = require('./multiRegionFailover');
  const { modelServingPlatformChallenge } = require('./modelServingPlatform');

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
    metricsAggregationChallenge,
    // Observability
    distributedTracingChallenge,
    alertingIncidentManagementChallenge,
    chaosEngineeringPlatformChallenge,
    // Migration & Reliability
    zeroDowntimeMigrationChallenge,
    multiRegionFailoverChallenge,
    // ML Infrastructure
    modelServingPlatformChallenge,
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
      'metrics_aggregation_service',
    ],
    observability: [
      'distributed_tracing',
      'alerting_incident_management',
      'chaos_engineering_platform',
    ],
    migration: [
      'zero_downtime_migration',
      'multi_region_failover',
    ],
    ml_infrastructure: [
      'feature_store',
      'model_serving_platform',
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
