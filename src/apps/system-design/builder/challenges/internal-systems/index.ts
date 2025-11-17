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
export { dependencyGraphAnalyzerChallenge } from './dependencyGraphAnalyzer';
export { codeSearchEngineChallenge } from './codeSearchEngine';
export { internalDocsPlatformChallenge } from './internalDocsPlatform';
export { experimentationPlatformChallenge } from './experimentationPlatform';
export { serviceCatalogChallenge } from './serviceCatalog';
export { loadTestingPlatformChallenge } from './loadTestingPlatform';

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
export { dataLakeManagerChallenge } from './dataLakeManager';
export { queryCostAttributionChallenge } from './queryCostAttribution';
export { dataAccessControlChallenge } from './dataAccessControl';
export { batchProcessingFrameworkChallenge } from './batchProcessingFramework';
export { internalDataCatalogChallenge } from './internalDataCatalog';
export { dataReplicationServiceChallenge } from './dataReplicationService';
export { dataRetentionArchivalChallenge } from './dataRetentionArchival';
export { queryCacheChallenge } from './queryCache';

// Observability & Operations
export { distributedTracingChallenge } from './distributedTracing';
export { alertingIncidentManagementChallenge } from './alertingIncidentManagement';
export { chaosEngineeringPlatformChallenge } from './chaosEngineeringPlatform';
export { configurationRolloutChallenge } from './configurationRollout';
export { capacityPlanningSystemChallenge } from './capacityPlanningSystem';
export { serviceHealthCheckerChallenge } from './serviceHealthChecker';
export { sloSliReportingChallenge } from './sloSliReporting';
export { monitoringDashboardChallenge } from './monitoringDashboard';
export { runbookAutomationChallenge } from './runbookAutomation';
export { resourceQuotaManagementChallenge } from './resourceQuotaManagement';
export { performanceProfilerChallenge } from './performanceProfiler';

// Migration & Reliability
export { zeroDowntimeMigrationChallenge } from './zeroDowntimeMigration';
export { multiRegionFailoverChallenge } from './multiRegionFailover';
export { circuitBreakerLibraryChallenge } from './circuitBreakerLibrary';
export { backupRestoreServiceChallenge } from './backupRestoreService';
export { serviceMeshMigrationChallenge } from './serviceMeshMigration';
export { dataCenterEvacuationChallenge } from './dataCenterEvacuation';
export { blueGreenDeploymentChallenge } from './blueGreenDeployment';
export { disasterRecoveryOrchestratorChallenge } from './disasterRecoveryOrchestrator';

// ML Infrastructure
export { modelServingPlatformChallenge } from './modelServingPlatform';
export { mlExperimentTrackingChallenge } from './mlExperimentTracking';
export { modelTrainingPipelineChallenge } from './modelTrainingPipeline';
export { dataLabelingPlatformChallenge } from './dataLabelingPlatform';
export { onlineInferenceCacheChallenge } from './onlineInferenceCache';
export { modelMonitoringDriftChallenge } from './modelMonitoringDrift';
export { internalAutoMLPlatformChallenge } from './internalAutoMLPlatform';
export { mlPipelineOrchestratorChallenge } from './mlPipelineOrchestrator';
export { embeddingSimilaritySearchChallenge } from './embeddingSimilaritySearch';

/**
 * All internal systems challenges (60 total - ALL IMPLEMENTED!)
 */
export const internalSystemsChallenges = [
  // Developer Tools (15 implemented)
  'codeReviewSystemChallenge',
  'cicdPipelineChallenge',
  'featureFlagSystemChallenge',
  'internalBuildSystemChallenge',
  'secretManagementChallenge',
  'internalApiGatewayChallenge',
  'serviceMeshControlPlaneChallenge',
  'internalJobSchedulerChallenge',
  'developerMetricsDashboardChallenge',
  'dependencyGraphAnalyzerChallenge',
  'codeSearchEngineChallenge',
  'internalDocsPlatformChallenge',
  'experimentationPlatformChallenge',
  'serviceCatalogChallenge',
  'loadTestingPlatformChallenge',

  // Data Infrastructure (15 implemented)
  'featureStoreChallenge',
  'etlOrchestrationChallenge',
  'logAggregationChallenge',
  'metricsAggregationChallenge',
  'realtimeAnalyticsPipelineChallenge',
  'dataLineageTrackingChallenge',
  'dataQualityMonitoringChallenge',
  'changeDataCaptureChallenge',
  'dataWarehouseQueryEngineChallenge',
  'dataLakeManagerChallenge',
  'queryCostAttributionChallenge',
  'dataAccessControlChallenge',
  'batchProcessingFrameworkChallenge',
  'internalDataCatalogChallenge',
  'dataReplicationServiceChallenge',
  'dataRetentionArchivalChallenge',
  'queryCacheChallenge',

  // Observability (12 implemented)
  'distributedTracingChallenge',
  'alertingIncidentManagementChallenge',
  'chaosEngineeringPlatformChallenge',
  'configurationRolloutChallenge',
  'capacityPlanningSystemChallenge',
  'serviceHealthCheckerChallenge',
  'sloSliReportingChallenge',
  'monitoringDashboardChallenge',
  'runbookAutomationChallenge',
  'resourceQuotaManagementChallenge',
  'performanceProfilerChallenge',

  // Migration & Reliability (8 implemented)
  'zeroDowntimeMigrationChallenge',
  'multiRegionFailoverChallenge',
  'circuitBreakerLibraryChallenge',
  'backupRestoreServiceChallenge',
  'serviceMeshMigrationChallenge',
  'dataCenterEvacuationChallenge',
  'blueGreenDeploymentChallenge',
  'disasterRecoveryOrchestratorChallenge',

  // ML Infrastructure (10 implemented)
  'modelServingPlatformChallenge',
  'mlExperimentTrackingChallenge',
  'modelTrainingPipelineChallenge',
  'dataLabelingPlatformChallenge',
  'onlineInferenceCacheChallenge',
  'modelMonitoringDriftChallenge',
  'internalAutoMLPlatformChallenge',
  'mlPipelineOrchestratorChallenge',
  'embeddingSimilaritySearchChallenge',
];

/**
 * Get all implemented challenges (60 total)
 */
export function getInternalSystemsChallenges() {
  // Import dynamically to avoid circular dependencies
  // Developer Tools
  const { codeReviewSystemChallenge } = require('./codeReviewSystem');
  const { cicdPipelineChallenge } = require('./cicdPipeline');
  const { featureFlagSystemChallenge } = require('./featureFlagSystem');
  const { internalBuildSystemChallenge } = require('./internalBuildSystem');
  const { secretManagementChallenge } = require('./secretManagement');
  const { internalApiGatewayChallenge } = require('./internalApiGateway');
  const { serviceMeshControlPlaneChallenge } = require('./serviceMeshControlPlane');
  const { internalJobSchedulerChallenge } = require('./internalJobScheduler');
  const { developerMetricsDashboardChallenge } = require('./developerMetricsDashboard');
  const { dependencyGraphAnalyzerChallenge } = require('./dependencyGraphAnalyzer');
  const { codeSearchEngineChallenge } = require('./codeSearchEngine');
  const { internalDocsPlatformChallenge } = require('./internalDocsPlatform');
  const { experimentationPlatformChallenge } = require('./experimentationPlatform');
  const { serviceCatalogChallenge } = require('./serviceCatalog');
  const { loadTestingPlatformChallenge } = require('./loadTestingPlatform');

  // Data Infrastructure
  const { featureStoreChallenge } = require('./featureStore');
  const { etlOrchestrationChallenge } = require('./etlOrchestration');
  const { logAggregationChallenge } = require('./logAggregation');
  const { metricsAggregationChallenge } = require('./metricsAggregation');
  const { realtimeAnalyticsPipelineChallenge } = require('./realtimeAnalyticsPipeline');
  const { dataLineageTrackingChallenge } = require('./dataLineageTracking');
  const { dataQualityMonitoringChallenge } = require('./dataQualityMonitoring');
  const { changeDataCaptureChallenge } = require('./changeDataCapture');
  const { dataWarehouseQueryEngineChallenge } = require('./dataWarehouseQueryEngine');
  const { dataLakeManagerChallenge } = require('./dataLakeManager');
  const { queryCostAttributionChallenge } = require('./queryCostAttribution');
  const { dataAccessControlChallenge } = require('./dataAccessControl');
  const { batchProcessingFrameworkChallenge } = require('./batchProcessingFramework');
  const { internalDataCatalogChallenge } = require('./internalDataCatalog');
  const { dataReplicationServiceChallenge } = require('./dataReplicationService');
  const { dataRetentionArchivalChallenge } = require('./dataRetentionArchival');
  const { queryCacheChallenge } = require('./queryCache');

  // Observability
  const { distributedTracingChallenge } = require('./distributedTracing');
  const { alertingIncidentManagementChallenge } = require('./alertingIncidentManagement');
  const { chaosEngineeringPlatformChallenge } = require('./chaosEngineeringPlatform');
  const { configurationRolloutChallenge } = require('./configurationRollout');
  const { capacityPlanningSystemChallenge } = require('./capacityPlanningSystem');
  const { serviceHealthCheckerChallenge } = require('./serviceHealthChecker');
  const { sloSliReportingChallenge } = require('./sloSliReporting');
  const { monitoringDashboardChallenge } = require('./monitoringDashboard');
  const { runbookAutomationChallenge } = require('./runbookAutomation');
  const { resourceQuotaManagementChallenge } = require('./resourceQuotaManagement');
  const { performanceProfilerChallenge } = require('./performanceProfiler');

  // Migration & Reliability
  const { zeroDowntimeMigrationChallenge } = require('./zeroDowntimeMigration');
  const { multiRegionFailoverChallenge } = require('./multiRegionFailover');
  const { circuitBreakerLibraryChallenge } = require('./circuitBreakerLibrary');
  const { backupRestoreServiceChallenge } = require('./backupRestoreService');
  const { serviceMeshMigrationChallenge } = require('./serviceMeshMigration');
  const { dataCenterEvacuationChallenge } = require('./dataCenterEvacuation');
  const { blueGreenDeploymentChallenge } = require('./blueGreenDeployment');
  const { disasterRecoveryOrchestratorChallenge } = require('./disasterRecoveryOrchestrator');

  // ML Infrastructure
  const { modelServingPlatformChallenge } = require('./modelServingPlatform');
  const { mlExperimentTrackingChallenge } = require('./mlExperimentTracking');
  const { modelTrainingPipelineChallenge } = require('./modelTrainingPipeline');
  const { dataLabelingPlatformChallenge } = require('./dataLabelingPlatform');
  const { onlineInferenceCacheChallenge } = require('./onlineInferenceCache');
  const { modelMonitoringDriftChallenge } = require('./modelMonitoringDrift');
  const { internalAutoMLPlatformChallenge } = require('./internalAutoMLPlatform');
  const { mlPipelineOrchestratorChallenge } = require('./mlPipelineOrchestrator');
  const { embeddingSimilaritySearchChallenge } = require('./embeddingSimilaritySearch');

  return [
    // Developer Tools (15)
    codeReviewSystemChallenge,
    cicdPipelineChallenge,
    featureFlagSystemChallenge,
    internalBuildSystemChallenge,
    secretManagementChallenge,
    internalApiGatewayChallenge,
    serviceMeshControlPlaneChallenge,
    internalJobSchedulerChallenge,
    developerMetricsDashboardChallenge,
    dependencyGraphAnalyzerChallenge,
    codeSearchEngineChallenge,
    internalDocsPlatformChallenge,
    experimentationPlatformChallenge,
    serviceCatalogChallenge,
    loadTestingPlatformChallenge,
    // Data Infrastructure (17 - includes featureStore)
    featureStoreChallenge,
    etlOrchestrationChallenge,
    logAggregationChallenge,
    metricsAggregationChallenge,
    realtimeAnalyticsPipelineChallenge,
    dataLineageTrackingChallenge,
    dataQualityMonitoringChallenge,
    changeDataCaptureChallenge,
    dataWarehouseQueryEngineChallenge,
    dataLakeManagerChallenge,
    queryCostAttributionChallenge,
    dataAccessControlChallenge,
    batchProcessingFrameworkChallenge,
    internalDataCatalogChallenge,
    dataReplicationServiceChallenge,
    dataRetentionArchivalChallenge,
    queryCacheChallenge,
    // Observability (11)
    distributedTracingChallenge,
    alertingIncidentManagementChallenge,
    chaosEngineeringPlatformChallenge,
    configurationRolloutChallenge,
    capacityPlanningSystemChallenge,
    serviceHealthCheckerChallenge,
    sloSliReportingChallenge,
    monitoringDashboardChallenge,
    runbookAutomationChallenge,
    resourceQuotaManagementChallenge,
    performanceProfilerChallenge,
    // Migration & Reliability (8)
    zeroDowntimeMigrationChallenge,
    multiRegionFailoverChallenge,
    circuitBreakerLibraryChallenge,
    backupRestoreServiceChallenge,
    serviceMeshMigrationChallenge,
    dataCenterEvacuationChallenge,
    blueGreenDeploymentChallenge,
    disasterRecoveryOrchestratorChallenge,
    // ML Infrastructure (9)
    modelServingPlatformChallenge,
    mlExperimentTrackingChallenge,
    modelTrainingPipelineChallenge,
    dataLabelingPlatformChallenge,
    onlineInferenceCacheChallenge,
    modelMonitoringDriftChallenge,
    internalAutoMLPlatformChallenge,
    mlPipelineOrchestratorChallenge,
    embeddingSimilaritySearchChallenge,
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
      'dependency_graph_analyzer',
      'code_search_engine',
      'internal_docs_platform',
      'experimentation_platform',
      'service_catalog',
      'load_testing_platform',
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
      'data_lake_manager',
      'query_cost_attribution',
      'data_access_control',
      'batch_processing_framework',
      'internal_data_catalog',
      'data_replication_service',
      'data_retention_archival',
      'query_cache',
    ],
    observability: [
      'distributed_tracing',
      'alerting_incident_management',
      'chaos_engineering_platform',
      'configuration_rollout',
      'capacity_planning_system',
      'service_health_checker',
      'slo_sli_reporting',
      'monitoring_dashboard',
      'runbook_automation',
      'resource_quota_management',
      'performance_profiler',
    ],
    migration: [
      'zero_downtime_migration',
      'multi_region_failover',
      'circuit_breaker_library',
      'backup_restore_service',
      'service_mesh_migration',
      'data_center_evacuation',
      'blue_green_deployment',
      'disaster_recovery_orchestrator',
    ],
    ml_infrastructure: [
      'feature_store',
      'model_serving_platform',
      'ml_experiment_tracking',
      'model_training_pipeline',
      'data_labeling_platform',
      'online_inference_cache',
      'model_monitoring_drift',
      'internal_automl_platform',
      'ml_pipeline_orchestrator',
      'embedding_similarity_search',
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
