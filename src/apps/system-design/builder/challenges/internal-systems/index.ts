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
export { serviceMeshControlPlaneChallenge } from './serviceMeshControlPlane';

// Data Infrastructure
export { featureStoreChallenge } from './featureStore';
export { etlOrchestrationChallenge } from './etlOrchestration';
export { logAggregationChallenge } from './logAggregation';
export { metricsAggregationChallenge } from './metricsAggregation';
export { realtimeAnalyticsPipelineChallenge } from './realtimeAnalyticsPipeline';

// Observability & Operations
export { distributedTracingChallenge } from './distributedTracing';
export { alertingIncidentManagementChallenge } from './alertingIncidentManagement';
export { chaosEngineeringPlatformChallenge } from './chaosEngineeringPlatform';

// Migration & Reliability
export { zeroDowntimeMigrationChallenge } from './zeroDowntimeMigration';
export { multiRegionFailoverChallenge } from './multiRegionFailover';
export { circuitBreakerLibraryChallenge } from './circuitBreakerLibrary';

// ML Infrastructure
export { modelServingPlatformChallenge } from './modelServingPlatform';

/**
 * All internal systems challenges
 */
export const internalSystemsChallenges = [
  // Developer Tools (7 implemented, 8 pending)
  'codeReviewSystemChallenge',
  'cicdPipelineChallenge',
  'featureFlagSystemChallenge',
  'internalBuildSystemChallenge',
  'secretManagementChallenge',
  'internalApiGatewayChallenge',
  'serviceMeshControlPlaneChallenge',
  // TODO: Add remaining 8 developer tools challenges

  // Data Infrastructure (5 implemented, 10 pending)
  'featureStoreChallenge',
  'etlOrchestrationChallenge',
  'logAggregationChallenge',
  'metricsAggregationChallenge',
  'realtimeAnalyticsPipelineChallenge',
  // TODO: Add remaining 10 data infrastructure challenges

  // Observability (3 implemented, 9 pending)
  'distributedTracingChallenge',
  'alertingIncidentManagementChallenge',
  'chaosEngineeringPlatformChallenge',
  // TODO: Add remaining 9 observability challenges

  // Migration & Reliability (3 implemented, 5 pending)
  'zeroDowntimeMigrationChallenge',
  'multiRegionFailoverChallenge',
  'circuitBreakerLibraryChallenge',
  // TODO: Add remaining 5 migration challenges

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
  const { serviceMeshControlPlaneChallenge } = require('./serviceMeshControlPlane');
  const { featureStoreChallenge } = require('./featureStore');
  const { etlOrchestrationChallenge } = require('./etlOrchestration');
  const { logAggregationChallenge } = require('./logAggregation');
  const { metricsAggregationChallenge } = require('./metricsAggregation');
  const { realtimeAnalyticsPipelineChallenge } = require('./realtimeAnalyticsPipeline');
  const { distributedTracingChallenge } = require('./distributedTracing');
  const { alertingIncidentManagementChallenge } = require('./alertingIncidentManagement');
  const { chaosEngineeringPlatformChallenge } = require('./chaosEngineeringPlatform');
  const { zeroDowntimeMigrationChallenge } = require('./zeroDowntimeMigration');
  const { multiRegionFailoverChallenge } = require('./multiRegionFailover');
  const { circuitBreakerLibraryChallenge } = require('./circuitBreakerLibrary');
  const { modelServingPlatformChallenge } = require('./modelServingPlatform');

  return [
    // Developer Tools
    codeReviewSystemChallenge,
    cicdPipelineChallenge,
    featureFlagSystemChallenge,
    internalBuildSystemChallenge,
    secretManagementChallenge,
    internalApiGatewayChallenge,
    serviceMeshControlPlaneChallenge,
    // Data Infrastructure
    featureStoreChallenge,
    etlOrchestrationChallenge,
    logAggregationChallenge,
    metricsAggregationChallenge,
    realtimeAnalyticsPipelineChallenge,
    // Observability
    distributedTracingChallenge,
    alertingIncidentManagementChallenge,
    chaosEngineeringPlatformChallenge,
    // Migration & Reliability
    zeroDowntimeMigrationChallenge,
    multiRegionFailoverChallenge,
    circuitBreakerLibraryChallenge,
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
      'service_mesh_control_plane',
    ],
    data_infrastructure: [
      'feature_store',
      'etl_orchestration',
      'log_aggregation',
      'metrics_aggregation_service',
      'realtime_analytics_pipeline',
    ],
    observability: [
      'distributed_tracing',
      'alerting_incident_management',
      'chaos_engineering_platform',
    ],
    migration: [
      'zero_downtime_migration',
      'multi_region_failover',
      'circuit_breaker_library',
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
