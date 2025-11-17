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
export { internalJobSchedulerChallenge } from './internalJobScheduler';
export { developerMetricsDashboardChallenge } from './developerMetricsDashboard';

// Data Infrastructure
export { featureStoreChallenge } from './featureStore';
export { etlOrchestrationChallenge } from './etlOrchestration';
export { logAggregationChallenge } from './logAggregation';
export { metricsAggregationChallenge } from './metricsAggregation';
export { realtimeAnalyticsPipelineChallenge } from './realtimeAnalyticsPipeline';
export { dataLineageTrackingChallenge } from './dataLineageTracking';
export { dataQualityMonitoringChallenge } from './dataQualityMonitoring';
export { changeDataCaptureChallenge } from './changeDataCapture';
export { dataWarehouseQueryEngineChallenge } from './dataWarehouseQueryEngine';

// Observability & Operations
export { distributedTracingChallenge } from './distributedTracing';
export { alertingIncidentManagementChallenge } from './alertingIncidentManagement';
export { chaosEngineeringPlatformChallenge } from './chaosEngineeringPlatform';
export { configurationRolloutChallenge } from './configurationRollout';
export { capacityPlanningSystemChallenge } from './capacityPlanningSystem';
export { serviceHealthCheckerChallenge } from './serviceHealthChecker';
export { sloSliReportingChallenge } from './sloSliReporting';

// Migration & Reliability
export { zeroDowntimeMigrationChallenge } from './zeroDowntimeMigration';
export { multiRegionFailoverChallenge } from './multiRegionFailover';
export { circuitBreakerLibraryChallenge } from './circuitBreakerLibrary';
export { backupRestoreServiceChallenge } from './backupRestoreService';

// ML Infrastructure
export { modelServingPlatformChallenge } from './modelServingPlatform';
export { mlExperimentTrackingChallenge } from './mlExperimentTracking';
export { modelTrainingPipelineChallenge } from './modelTrainingPipeline';

/**
 * All internal systems challenges
 */
export const internalSystemsChallenges = [
  // Developer Tools (8 implemented, 7 pending)
  'codeReviewSystemChallenge',
  'cicdPipelineChallenge',
  'featureFlagSystemChallenge',
  'internalBuildSystemChallenge',
  'secretManagementChallenge',
  'internalApiGatewayChallenge',
  'serviceMeshControlPlaneChallenge',
  'internalJobSchedulerChallenge',
  // TODO: Add remaining 7 developer tools challenges

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
  const { internalJobSchedulerChallenge } = require('./internalJobScheduler');
  const { developerMetricsDashboardChallenge } = require('./developerMetricsDashboard');
  const { featureStoreChallenge } = require('./featureStore');
  const { etlOrchestrationChallenge } = require('./etlOrchestration');
  const { logAggregationChallenge } = require('./logAggregation');
  const { metricsAggregationChallenge } = require('./metricsAggregation');
  const { realtimeAnalyticsPipelineChallenge } = require('./realtimeAnalyticsPipeline');
  const { dataLineageTrackingChallenge } = require('./dataLineageTracking');
  const { dataQualityMonitoringChallenge } = require('./dataQualityMonitoring');
  const { changeDataCaptureChallenge } = require('./changeDataCapture');
  const { dataWarehouseQueryEngineChallenge } = require('./dataWarehouseQueryEngine');
  const { distributedTracingChallenge } = require('./distributedTracing');
  const { alertingIncidentManagementChallenge } = require('./alertingIncidentManagement');
  const { chaosEngineeringPlatformChallenge } = require('./chaosEngineeringPlatform');
  const { configurationRolloutChallenge } = require('./configurationRollout');
  const { capacityPlanningSystemChallenge } = require('./capacityPlanningSystem');
  const { serviceHealthCheckerChallenge } = require('./serviceHealthChecker');
  const { sloSliReportingChallenge } = require('./sloSliReporting');
  const { zeroDowntimeMigrationChallenge } = require('./zeroDowntimeMigration');
  const { multiRegionFailoverChallenge } = require('./multiRegionFailover');
  const { circuitBreakerLibraryChallenge } = require('./circuitBreakerLibrary');
  const { backupRestoreServiceChallenge } = require('./backupRestoreService');
  const { modelServingPlatformChallenge } = require('./modelServingPlatform');
  const { mlExperimentTrackingChallenge } = require('./mlExperimentTracking');
  const { modelTrainingPipelineChallenge } = require('./modelTrainingPipeline');

  return [
    // Developer Tools
    codeReviewSystemChallenge,
    cicdPipelineChallenge,
    featureFlagSystemChallenge,
    internalBuildSystemChallenge,
    secretManagementChallenge,
    internalApiGatewayChallenge,
    serviceMeshControlPlaneChallenge,
    internalJobSchedulerChallenge,
    developerMetricsDashboardChallenge,
    // Data Infrastructure
    featureStoreChallenge,
    etlOrchestrationChallenge,
    logAggregationChallenge,
    metricsAggregationChallenge,
    realtimeAnalyticsPipelineChallenge,
    dataLineageTrackingChallenge,
    dataQualityMonitoringChallenge,
    changeDataCaptureChallenge,
    dataWarehouseQueryEngineChallenge,
    // Observability
    distributedTracingChallenge,
    alertingIncidentManagementChallenge,
    chaosEngineeringPlatformChallenge,
    configurationRolloutChallenge,
    capacityPlanningSystemChallenge,
    serviceHealthCheckerChallenge,
    sloSliReportingChallenge,
    // Migration & Reliability
    zeroDowntimeMigrationChallenge,
    multiRegionFailoverChallenge,
    circuitBreakerLibraryChallenge,
    backupRestoreServiceChallenge,
    // ML Infrastructure
    modelServingPlatformChallenge,
    mlExperimentTrackingChallenge,
    modelTrainingPipelineChallenge,
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
      'internal_job_scheduler',
      'developer_metrics_dashboard',
    ],
    data_infrastructure: [
      'feature_store',
      'etl_orchestration',
      'log_aggregation',
      'metrics_aggregation_service',
      'realtime_analytics_pipeline',
      'data_lineage_tracking',
      'data_quality_monitoring',
      'change_data_capture',
      'data_warehouse_query_engine',
    ],
    observability: [
      'distributed_tracing',
      'alerting_incident_management',
      'chaos_engineering_platform',
      'configuration_rollout',
      'capacity_planning_system',
      'service_health_checker',
      'slo_sli_reporting',
    ],
    migration: [
      'zero_downtime_migration',
      'multi_region_failover',
      'circuit_breaker_library',
      'backup_restore_service',
    ],
    ml_infrastructure: [
      'feature_store',
      'model_serving_platform',
      'ml_experiment_tracking',
      'model_training_pipeline',
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
