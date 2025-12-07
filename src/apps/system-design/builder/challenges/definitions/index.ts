/**
 * Curated System Design Challenge Definitions
 *
 * Total: 400+ problems
 * - L1: 40 original real-world problems (Instagram, Twitter, Netflix, etc.)
 * - L2-4: 35 distinct pattern examples (30 patterns + 5 DDIA gaps)
 * - L5: 107 platform problems (migrations, APIs, multi-tenant, etc.)
 * - L6: 10 next-gen problems (practical modern tech only)
 * - DDIA Teaching: 151 concept-focused problems (COMPLETE!)
 *
 * DDIA Teaching Problems (151 total - ALL CHAPTERS):
 * - Chapter 1: Reliability, Scalability, Maintainability (15 problems)
 * - Chapter 2: Data Models & Query Languages (12 problems)
 * - Chapter 3: Storage & Retrieval (10 problems)
 * - Chapter 4: Encoding & Evolution (8 problems)
 * - Chapter 5: Replication (16 problems)
 * - Chapter 6: Partitioning (12 problems)
 * - Chapter 7: Transactions (16 problems)
 * - Chapter 8: Distributed Systems (15 problems)
 * - Chapter 9: Consensus (14 problems)
 * - Chapter 10: Batch Processing (10 problems)
 * - Chapter 11: Stream Processing (15 problems)
 * - Chapter 12: Future of Data Systems (8 problems)
 *
 * These teaching problems provide a progressive learning path from individual
 * DDIA concepts to complex real-world system design challenges.
 *
 * Each challenge has ONLY Level 1: "The Brute Force Test - Does It Even Work?"
 * Focus: Verify connectivity (Client → App → Database path exists)
 * No performance optimization, just basic connectivity
 */

import { problemWhitelist } from '../problemWhitelist';

// Social Media & Dating (11)
export { instagramProblemDefinition } from './instagram';
export { instagramGuidedTutorial } from './instagramGuided';
export { twitterProblemDefinition } from './twitter';
export { twitterGuidedTutorial } from './twitterGuided';
export { redditProblemDefinition } from './reddit';
export { redditGuidedTutorial } from './redditGuided';
export { linkedinProblemDefinition } from './linkedin';
export { facebookProblemDefinition } from './facebook';
export { tiktokProblemDefinition } from './tiktok';
export { pinterestProblemDefinition } from './pinterest';
export { snapchatProblemDefinition } from './snapchat';
export { tinderProblemDefinition } from './tinder';
export { discordProblemDefinition } from './discord';
export { discordGuidedTutorial } from './discordGuided';
export { mediumProblemDefinition } from './medium';

// E-commerce & Services (5)
export { amazonProblemDefinition } from './amazon';
export { amazonGuidedTutorial } from './amazonGuided';
export { shopifyProblemDefinition } from './shopify';
export { stripeProblemDefinition } from './stripe';
export { stripeGuidedTutorial } from './stripeGuided';
export { uberProblemDefinition } from './uber';
export { airbnbProblemDefinition } from './airbnb';
export { airbnbGuidedTutorial } from './airbnbGuided';

// Streaming & Media (5)
export { netflixProblemDefinition } from './netflix';
export { netflixGuidedTutorial } from './netflixGuided';
export { spotifyProblemDefinition } from './spotify';
export { spotifyGuidedTutorial } from './spotifyGuided';
export { youtubeProblemDefinition } from './youtube';
export { youtubeGuidedTutorial } from './youtubeGuided';
export { twitchProblemDefinition } from './twitch';
export { huluProblemDefinition } from './hulu';

// Messaging (4)
export { whatsappProblemDefinition } from './whatsapp';
export { slackProblemDefinition } from './slack';
export { slackGuidedTutorial } from './slackGuided';
export { telegramProblemDefinition } from './telegram';
export { messengerProblemDefinition } from './messenger';

// Infrastructure (5)
export { pastebinProblemDefinition } from './pastebin';
export { dropboxProblemDefinition } from './dropbox';
export { dropboxGuidedTutorial } from './dropboxGuided';
export { googledriveProblemDefinition } from './googledrive';
export { githubProblemDefinition } from './github';
export { githubGuidedTutorial } from './githubGuided';
export { stackoverflowProblemDefinition } from './stackoverflow';

// Food & Delivery (3)
export { doordashProblemDefinition } from './doordash';
export { doordashGuidedTutorial } from './doordashGuided';
export { instacartProblemDefinition } from './instacart';
export { yelpProblemDefinition } from './yelp';

// Productivity (4)
export { notionProblemDefinition } from './notion';
export { trelloProblemDefinition } from './trello';
export { googlecalendarProblemDefinition } from './googlecalendar';
export { zoomProblemDefinition } from './zoom';
export { zoomGuidedTutorial } from './zoomGuided';

// Gaming & Other (4)
export { steamProblemDefinition } from './steam';
export { ticketmasterProblemDefinition } from './ticketmaster';
export { bookingcomProblemDefinition } from './bookingcom';
export { weatherapiProblemDefinition } from './weatherapi';

// Guided Tutorials - Gaming
export { gamingLeaderboardCacheGuidedTutorial } from './gamingLeaderboardCacheGuided';

// Guided Tutorials - Analytics
export { analyticsDashboardCacheGuidedTutorial } from './analyticsDashboardCacheGuided';

// Generated Problems - All 618 from ALL_PROBLEMS.md
// Tutorial Problems - Removed (tutorials are filtered out from problem catalog)
// export { tutorialSimpleBlogProblemDefinition, tutorialIntermediateImagesProblemDefinition, tutorialAdvancedChatProblemDefinition, boeWalkthroughChatProblemDefinition } from './generated-all/tutorialAllProblems';
export { tinyUrlL6ProblemDefinition, tinyurlProblemDefinition, basicWebCacheProblemDefinition, staticContentCdnProblemDefinition, databaseQueryCacheProblemDefinition, apiRateLimitCacheProblemDefinition, productCatalogCacheProblemDefinition, gamingLeaderboardCacheProblemDefinition, geoLocationCacheProblemDefinition, videoStreamingCacheProblemDefinition, searchSuggestionCacheProblemDefinition, newsAggregatorCacheProblemDefinition, graphqlCacheProblemDefinition, shoppingCartCacheProblemDefinition, analyticsDashboardCacheProblemDefinition, cmsCacheProblemDefinition, authTokenCacheProblemDefinition, pricingEngineCacheProblemDefinition, recommendationEngineCacheProblemDefinition, rtbAdCacheProblemDefinition, gamingMatchmakingCacheProblemDefinition, iotDeviceCacheProblemDefinition, globalInventoryCacheProblemDefinition, hybridCdnCacheProblemDefinition, globalInventoryMasteryProblemDefinition, financialTradingCacheProblemDefinition, gameAssetCdnMasteryProblemDefinition, sportsBettingCacheProblemDefinition, autonomousVehicleCacheProblemDefinition, stockMarketDataCacheProblemDefinition, multiRegionSocialCacheProblemDefinition, healthcareRecordsCacheProblemDefinition, supplyChainCacheProblemDefinition } from './generated-all/cachingAllProblems';
// Removed: sessionStoreBasicProblemDefinition, socialFeedCacheProblemDefinition, multiTenantSaasCacheProblemDefinition (covered in comprehensive-ecommerce-platform)
export { simpleRateLimiterProblemDefinition, loadBalancingGatewayProblemDefinition, requestTransformGatewayProblemDefinition, corsGatewayProblemDefinition, retryGatewayProblemDefinition, compressionGatewayProblemDefinition, loggingGatewayProblemDefinition, healthCheckGatewayProblemDefinition, apiRoutingGatewayProblemDefinition, responseTransformGatewayProblemDefinition, apiAggregationGatewayProblemDefinition, graphqlGatewayProblemDefinition, oauth2GatewayProblemDefinition, websocketGatewayProblemDefinition, grpcGatewayProblemDefinition, mobileGatewayProblemDefinition, partnerGatewayProblemDefinition, webhookGatewayProblemDefinition, serverlessGatewayProblemDefinition, multiProtocolGatewayProblemDefinition, versioningGatewayProblemDefinition, quotaGatewayProblemDefinition, monetizationGatewayProblemDefinition, zeroTrustGatewayProblemDefinition, mlModelGatewayProblemDefinition, fraudDetectionGatewayProblemDefinition, hftGatewayProblemDefinition, iotGatewayProblemDefinition, blockchainGatewayProblemDefinition, globalTrafficGatewayProblemDefinition, edgeComputeGatewayProblemDefinition, apiCachingGatewayProblemDefinition, serviceDiscoveryGatewayProblemDefinition } from './generated-all/gatewayAllProblems';
// Removed: rateLimiterProblemDefinition, basicApiGatewayProblemDefinition, authenticationGatewayProblemDefinition (covered in comprehensive-api-gateway-platform)
export { basicMessageQueueProblemDefinition, realtimeNotificationsProblemDefinition, basicEventLogProblemDefinition, simplePubsubProblemDefinition, realtimeChatMessagesProblemDefinition, serverLogAggregationProblemDefinition, sensorDataCollectionProblemDefinition, emailQueueSystemProblemDefinition, orderProcessingStreamProblemDefinition, paymentTransactionLogProblemDefinition, stockPriceUpdatesProblemDefinition, socialMediaFeedProblemDefinition, videoUploadPipelineProblemDefinition, fraudDetectionStreamProblemDefinition, userActivityTrackingProblemDefinition, iotTelemetryAggregationProblemDefinition, gameEventProcessingProblemDefinition, deliveryTrackingUpdatesProblemDefinition, notificationFanoutProblemDefinition, contentModerationQueueProblemDefinition, searchIndexUpdatesProblemDefinition, recommendationPipelineProblemDefinition, auditLogStreamingProblemDefinition, kafkaStreamingPipelineProblemDefinition, exactlyOncePaymentProblemDefinition, globalEventSourcingSystemProblemDefinition, multiDcStreamReplicationProblemDefinition, realtimeMlFeatureStoreProblemDefinition, gdprCompliantStreamingProblemDefinition, financialSettlementStreamProblemDefinition, autonomousVehicleTelemetryProblemDefinition, healthcareDataStreamHipaaProblemDefinition, globalCdcPipelineProblemDefinition } from './generated-all/streamingAllProblems';
// Removed: chatProblemDefinition, ingestionProblemDefinition, clickstreamAnalyticsProblemDefinition, eventSourcingBasicProblemDefinition (covered in comprehensive-social-media-platform)
export { keyValueStoreProblemDefinition, productCatalogProblemDefinition, sessionStoreProblemDefinition, fileMetadataStoreProblemDefinition, configManagementProblemDefinition, ecommerceOrderDbProblemDefinition, socialGraphDbProblemDefinition, analyticsWarehouseProblemDefinition, multiTenantSaasProblemDefinition, inventoryManagementProblemDefinition, cmsMediaStorageProblemDefinition, bankingTransactionDbProblemDefinition, healthcareRecordsProblemDefinition, iotTimeSeriesProblemDefinition, gamingLeaderboardProblemDefinition, bookingReservationProblemDefinition, auditTrailProblemDefinition, searchIndexStorageProblemDefinition, mlModelRegistryProblemDefinition, rateLimitCountersProblemDefinition, contentDeliveryStorageProblemDefinition, multiModelDatabaseProblemDefinition, distributedTransactionsProblemDefinition, multiMasterReplicationProblemDefinition, globalInventoryStrongProblemDefinition, financialLedgerProblemDefinition, blockchainStateDbProblemDefinition, realtimeGamingStateProblemDefinition, autonomousVehicleMapProblemDefinition, petabyteDataLakeProblemDefinition, blockStorageProblemDefinition } from './generated-all/storageAllProblems';
// Removed: basicDatabaseDesignProblemDefinition, nosqlBasicsProblemDefinition, timeSeriesMetricsProblemDefinition, distributedDatabaseProblemDefinition (conceptual, better as lessons)
export { fuzzySearchProblemDefinition, synonymSearchProblemDefinition, highlightSearchProblemDefinition, boostingSearchProblemDefinition, productDiscoveryProblemDefinition, searchSuggestionsProblemDefinition, ecommerceSearchProblemDefinition, multilingualSearchProblemDefinition, searchAnalyticsProblemDefinition, personalizedSearchProblemDefinition, voiceSearchProblemDefinition, imageSearchProblemDefinition, realtimeIndexingProblemDefinition, federatedSearchProblemDefinition, logSearchProblemDefinition, codeSearchProblemDefinition, hybridSearchProblemDefinition, videoSearchProblemDefinition, securityEventSearchProblemDefinition, medicalRecordSearchProblemDefinition, socialMediaSearchProblemDefinition, semanticSearchPlatformProblemDefinition, jobSearchProblemDefinition, travelSearchProblemDefinition, academicPaperSearchProblemDefinition, recipeSearchProblemDefinition, legalDocSearchProblemDefinition, newsSearchProblemDefinition, musicSearchProblemDefinition, appStoreSearchProblemDefinition, documentCollabSearchProblemDefinition } from './generated-all/searchAllProblems';
// Removed: basicTextSearchProblemDefinition, autocompleteSearchProblemDefinition, facetedSearchProblemDefinition, geoSearchProblemDefinition (covered in comprehensive-search-platform)
export { basicMultiRegionProblemDefinition, activeActiveRegionsProblemDefinition, globalCdnProblemDefinition, distributedSessionStoreProblemDefinition, multiregionBackupProblemDefinition, globalDnsProblemDefinition, globalIpAnycastProblemDefinition, geofencedFeaturesProblemDefinition, partialRegionFailureProblemDefinition, globalSocialNetworkProblemDefinition, crossRegionFailoverProblemDefinition, geoPinningProblemDefinition, multiregionStreamingProblemDefinition, latencyBasedRoutingProblemDefinition, multiregionSearchProblemDefinition, crossRegionAnalyticsProblemDefinition, multiregionCacheProblemDefinition, globalContentDeliveryProblemDefinition, edgeComputingProblemDefinition, multiregionQueueProblemDefinition, regionalShardingProblemDefinition, crossRegionObservabilityProblemDefinition, regionalQuotaEnforcementProblemDefinition, crossRegionSecretsProblemDefinition, planetScaleDatabaseProblemDefinition, globalRateLimitingProblemDefinition, readYourWritesProblemDefinition, regionalComplianceProblemDefinition, crossRegionMigrationProblemDefinition, timeSynchronizationProblemDefinition, globalLeaderElectionProblemDefinition, multiregionCrdtProblemDefinition, multiregionOrchestrationProblemDefinition } from './generated-all/multiregionAllProblems';
// Removed: globalLoadBalancingProblemDefinition, conflictResolutionProblemDefinition (covered in comprehensive problems)
// Platform Migration Problems - Removed (37 problems)
// Migration problems are too abstract and focus on migration strategy rather than building systems
// Users should focus on building systems first (L1-L4) before tackling migration problems
// export { l5MigrationNetflixMicroservicesProblemDefinition, ... } from './generated-all/platform-migrationAllProblems';
export { l5ApiGatewayFacebookProblemDefinition, l5ApiGraphqlFederationProblemDefinition } from './generated-all/api-platformAllProblems';
// l5ApiPlatform1-17 removed (all migration problems)
export { l5MultitenantSalesforceProblemDefinition } from './generated-all/multi-tenantAllProblems';
// l5MultiTenant1-17 removed (all migration problems)
export { l5DataPlatformUberProblemDefinition } from './generated-all/data-platformAllProblems';
// l5DataPlatform1-17 removed (all migration problems)
export { l5DevprodGoogleCiProblemDefinition } from './generated-all/developer-productivityAllProblems';
// l5DeveloperProductivity1-17 removed (all migration problems)
export { l5SecurityAppleEncryptionProblemDefinition } from './generated-all/compliance-securityAllProblems';
// l5ComplianceSecurity1-17 removed (all migration problems)
export { l5ObservabilityDatadogProblemDefinition } from './generated-all/observabilityAllProblems';
// l5Observability1-17 removed (all migration problems)
export { l5InfraKubernetesPlatformProblemDefinition } from './generated-all/infrastructureAllProblems';
// l5Infrastructure1-17 removed (all migration problems)
export { l5MlPlatformMetaProblemDefinition } from './generated-all/ml-platformAllProblems';
// l5MlPlatform1-17 removed (all migration problems)
export { l5RegionalTiktokPlatformProblemDefinition } from './generated-all/cross-regionalAllProblems';
// l5CrossRegional1-17 removed (all migration problems)
export { l6Protocol6gArchitectureProblemDefinition, l6ProtocolTcpReplacementProblemDefinition } from './generated-all/next-gen-protocolsAllProblems';
// l6ProtocolQuantumInternet, l6ProtocolInterplanetary, l6NextGenProtocols1-18 removed (speculative, not in whitelist)
export { l6DbCapTheoremBreakerProblemDefinition } from './generated-all/novel-databasesAllProblems';
// l6NovelDatabases1 removed (actually "DNA Storage Infrastructure" - speculative, not CRDTs)
// l6DbQuantumResistant, l6DbDnaStorage, l6DbNeuromorphic, l6NovelDatabases2-18 not in whitelist (speculative)
// AI Infrastructure (0) - Removed (all 21 problems are speculative: AGI, consciousness, quantum, biological computing)
// Practical ML problems are covered by l5-ml-platform-* problems (Meta, OpenAI, MLflow, SageMaker, etc.)
// export { l6AiAgiTrainingProblemDefinition, ... } from './generated-all/ai-infrastructureAllProblems';
export { l6DistributedConsensus1ProblemDefinition, l6DistributedConsensus2ProblemDefinition } from './generated-all/distributed-consensusAllProblems';
// l6ConsensusPlanetary, l6ConsensusMillionNodes, l6DistributedConsensus3-17 removed (not in whitelist)
// new-computing, energy-sustainability removed (speculative, not in whitelist)
export { l6PrivacyZkpInternetProblemDefinition } from './generated-all/privacy-innovationAllProblems';
// l6PrivacyHomomorphicScale, l6PrivacyInnovation1-17 removed (not in whitelist)
// economic-systems, bio-digital, existential-infrastructure removed (speculative, not in whitelist)

// DDIA Gap Problems - Converted to lessons (see src/apps/system-design/builder/data/lessons/ddia/)
// All 5 problems removed - concepts covered in comprehensive problems and DDIA lessons
// Removed: batchProcessingMapreduceProblemDefinition, explicitShardingDesignProblemDefinition, transactionIsolationLevelsProblemDefinition, dataWarehouseOlapProblemDefinition, graphDatabaseSocialProblemDefinition

// NFR Teaching Problems - Converted to lessons (see src/apps/system-design/builder/data/lessons/nfr/)
// All 16 problems converted to 2 comprehensive lessons covering throughput, latency, durability, sharding, and consistency

// DDIA Teaching Problems - Concept-focused learning problems (151 total - ALL CHAPTERS)
export { ddiaChapter1Problems } from './generated-all/ddiaTeachingChapter1';
// Chapters 2-4, 7-12: Converted to lessons (see src/apps/system-design/builder/data/lessons/ddia/)
// Chapters 5-6: Also converted to lessons (see src/apps/system-design/builder/data/lessons/ddia/)
// export { ddiaReplicationProblems } from './generated-all/ddiaTeachingReplication';
// export { ddiaPartitioningProblems } from './generated-all/ddiaTeachingPartitioning';
// Chapters 7-12: Concepts integrated into comprehensive problems (see comprehensive/*.ts)

// Comprehensive Problems - Real-world application scenarios
export { comprehensiveSocialMediaPlatformDefinition } from './comprehensive/socialMediaPlatform';
export { comprehensiveEcommercePlatformDefinition } from './comprehensive/ecommercePlatform';
export { comprehensiveSearchPlatformDefinition } from './comprehensive/searchPlatform';
export { comprehensiveApiGatewayPlatformDefinition } from './comprehensive/apiGatewayPlatform';
export { comprehensiveCloudStoragePlatformDefinition } from './comprehensive/cloudStoragePlatform';

// System Design Primer - Converted to lessons (see src/apps/system-design/builder/data/lessons/sdp/)
// All 77 problems converted to 10 comprehensive lessons covering infrastructure and data concepts

// Extracted Problems - Tutorials (3)
// Note: These are now imported from generated-all/tutorialAllProblems

// Extracted Problems - Caching (16)
// Note: These are now imported from generated-all/cachingAllProblems

// Extracted Problems - Streaming (5)
// Note: These are now imported from generated-all/streamingAllProblems

// Extracted Problems - Storage (5)
// Note: These are now imported from generated-all/storageAllProblems

// Extracted Problems - Gateway (4)
// Note: These are now imported from generated-all/gatewayAllProblems

// Extracted Problems - Search (4)
// Note: These are now imported from generated-all/searchAllProblems

// Extracted Problems - Multiregion (4)
// Note: These are now imported from generated-all/multiregionAllProblems

// Array of all problem definitions
import { ProblemDefinition } from '../../types/problemDefinition';
import { instagramProblemDefinition } from './instagram';
import { twitterProblemDefinition } from './twitter';
import { redditProblemDefinition } from './reddit';
import { linkedinProblemDefinition } from './linkedin';
import { facebookProblemDefinition } from './facebook';
import { tiktokProblemDefinition } from './tiktok';
import { pinterestProblemDefinition } from './pinterest';
import { snapchatProblemDefinition } from './snapchat';
import { discordProblemDefinition } from './discord';
import { tinderProblemDefinition } from './tinder';
import { mediumProblemDefinition } from './medium';
import { amazonProblemDefinition } from './amazon';
import { shopifyProblemDefinition } from './shopify';
import { stripeProblemDefinition } from './stripe';
import { uberProblemDefinition } from './uber';
import { airbnbProblemDefinition } from './airbnb';
import { netflixProblemDefinition } from './netflix';
import { spotifyProblemDefinition } from './spotify';
import { youtubeProblemDefinition } from './youtube';
import { twitchProblemDefinition } from './twitch';
import { huluProblemDefinition } from './hulu';
import { whatsappProblemDefinition } from './whatsapp';
import { slackProblemDefinition } from './slack';
import { telegramProblemDefinition } from './telegram';
import { messengerProblemDefinition } from './messenger';
import { pastebinProblemDefinition } from './pastebin';
import { dropboxProblemDefinition } from './dropbox';
import { googledriveProblemDefinition } from './googledrive';
import { githubProblemDefinition } from './github';
import { stackoverflowProblemDefinition } from './stackoverflow';
import { doordashProblemDefinition } from './doordash';
import { instacartProblemDefinition } from './instacart';
import { yelpProblemDefinition } from './yelp';
import { notionProblemDefinition } from './notion';
import { trelloProblemDefinition } from './trello';
import { googlecalendarProblemDefinition } from './googlecalendar';
import { zoomProblemDefinition } from './zoom';
import { steamProblemDefinition } from './steam';
import { ticketmasterProblemDefinition } from './ticketmaster';
import { bookingcomProblemDefinition } from './bookingcom';
import { weatherapiProblemDefinition } from './weatherapi';

// Generated Problem Imports
// Tutorial Problems - Removed
// import { tutorialSimpleBlogProblemDefinition, tutorialIntermediateImagesProblemDefinition, tutorialAdvancedChatProblemDefinition, boeWalkthroughChatProblemDefinition } from './generated-all/tutorialAllProblems';
import { tinyUrlL6ProblemDefinition, tinyurlProblemDefinition, basicWebCacheProblemDefinition, staticContentCdnProblemDefinition, databaseQueryCacheProblemDefinition, apiRateLimitCacheProblemDefinition, productCatalogCacheProblemDefinition, gamingLeaderboardCacheProblemDefinition, geoLocationCacheProblemDefinition, videoStreamingCacheProblemDefinition, searchSuggestionCacheProblemDefinition, newsAggregatorCacheProblemDefinition, graphqlCacheProblemDefinition, shoppingCartCacheProblemDefinition, analyticsDashboardCacheProblemDefinition, cmsCacheProblemDefinition, authTokenCacheProblemDefinition, pricingEngineCacheProblemDefinition, recommendationEngineCacheProblemDefinition, rtbAdCacheProblemDefinition, gamingMatchmakingCacheProblemDefinition, iotDeviceCacheProblemDefinition, globalInventoryCacheProblemDefinition, hybridCdnCacheProblemDefinition, globalInventoryMasteryProblemDefinition, financialTradingCacheProblemDefinition, gameAssetCdnMasteryProblemDefinition, sportsBettingCacheProblemDefinition, autonomousVehicleCacheProblemDefinition, stockMarketDataCacheProblemDefinition, multiRegionSocialCacheProblemDefinition, healthcareRecordsCacheProblemDefinition, supplyChainCacheProblemDefinition } from './generated-all/cachingAllProblems';
// Removed: sessionStoreBasicProblemDefinition, socialFeedCacheProblemDefinition, multiTenantSaasCacheProblemDefinition
import { simpleRateLimiterProblemDefinition, loadBalancingGatewayProblemDefinition, requestTransformGatewayProblemDefinition, corsGatewayProblemDefinition, retryGatewayProblemDefinition, compressionGatewayProblemDefinition, loggingGatewayProblemDefinition, healthCheckGatewayProblemDefinition, apiRoutingGatewayProblemDefinition, responseTransformGatewayProblemDefinition, apiAggregationGatewayProblemDefinition, graphqlGatewayProblemDefinition, oauth2GatewayProblemDefinition, websocketGatewayProblemDefinition, grpcGatewayProblemDefinition, mobileGatewayProblemDefinition, partnerGatewayProblemDefinition, webhookGatewayProblemDefinition, serverlessGatewayProblemDefinition, multiProtocolGatewayProblemDefinition, versioningGatewayProblemDefinition, quotaGatewayProblemDefinition, monetizationGatewayProblemDefinition, zeroTrustGatewayProblemDefinition, mlModelGatewayProblemDefinition, fraudDetectionGatewayProblemDefinition, hftGatewayProblemDefinition, iotGatewayProblemDefinition, blockchainGatewayProblemDefinition, globalTrafficGatewayProblemDefinition, edgeComputeGatewayProblemDefinition, apiCachingGatewayProblemDefinition, serviceDiscoveryGatewayProblemDefinition } from './generated-all/gatewayAllProblems';
// Removed: rateLimiterProblemDefinition, basicApiGatewayProblemDefinition, authenticationGatewayProblemDefinition
import { basicMessageQueueProblemDefinition, realtimeNotificationsProblemDefinition, basicEventLogProblemDefinition, simplePubsubProblemDefinition, realtimeChatMessagesProblemDefinition, serverLogAggregationProblemDefinition, sensorDataCollectionProblemDefinition, emailQueueSystemProblemDefinition, orderProcessingStreamProblemDefinition, paymentTransactionLogProblemDefinition, stockPriceUpdatesProblemDefinition, socialMediaFeedProblemDefinition, videoUploadPipelineProblemDefinition, fraudDetectionStreamProblemDefinition, userActivityTrackingProblemDefinition, iotTelemetryAggregationProblemDefinition, gameEventProcessingProblemDefinition, deliveryTrackingUpdatesProblemDefinition, notificationFanoutProblemDefinition, contentModerationQueueProblemDefinition, searchIndexUpdatesProblemDefinition, recommendationPipelineProblemDefinition, auditLogStreamingProblemDefinition, kafkaStreamingPipelineProblemDefinition, exactlyOncePaymentProblemDefinition, globalEventSourcingSystemProblemDefinition, multiDcStreamReplicationProblemDefinition, realtimeMlFeatureStoreProblemDefinition, gdprCompliantStreamingProblemDefinition, financialSettlementStreamProblemDefinition, autonomousVehicleTelemetryProblemDefinition, healthcareDataStreamHipaaProblemDefinition, globalCdcPipelineProblemDefinition } from './generated-all/streamingAllProblems';
// Removed: chatProblemDefinition, ingestionProblemDefinition, clickstreamAnalyticsProblemDefinition, eventSourcingBasicProblemDefinition
import { keyValueStoreProblemDefinition, productCatalogProblemDefinition, sessionStoreProblemDefinition, fileMetadataStoreProblemDefinition, configManagementProblemDefinition, ecommerceOrderDbProblemDefinition, socialGraphDbProblemDefinition, analyticsWarehouseProblemDefinition, multiTenantSaasProblemDefinition, inventoryManagementProblemDefinition, cmsMediaStorageProblemDefinition, bankingTransactionDbProblemDefinition, healthcareRecordsProblemDefinition, iotTimeSeriesProblemDefinition, gamingLeaderboardProblemDefinition, bookingReservationProblemDefinition, auditTrailProblemDefinition, searchIndexStorageProblemDefinition, mlModelRegistryProblemDefinition, rateLimitCountersProblemDefinition, contentDeliveryStorageProblemDefinition, multiModelDatabaseProblemDefinition, distributedTransactionsProblemDefinition, multiMasterReplicationProblemDefinition, globalInventoryStrongProblemDefinition, financialLedgerProblemDefinition, blockchainStateDbProblemDefinition, realtimeGamingStateProblemDefinition, autonomousVehicleMapProblemDefinition, petabyteDataLakeProblemDefinition, blockStorageProblemDefinition } from './generated-all/storageAllProblems';
// Removed: basicDatabaseDesignProblemDefinition, nosqlBasicsProblemDefinition, timeSeriesMetricsProblemDefinition, distributedDatabaseProblemDefinition
import { fuzzySearchProblemDefinition, synonymSearchProblemDefinition, highlightSearchProblemDefinition, boostingSearchProblemDefinition, productDiscoveryProblemDefinition, searchSuggestionsProblemDefinition, ecommerceSearchProblemDefinition, multilingualSearchProblemDefinition, searchAnalyticsProblemDefinition, personalizedSearchProblemDefinition, voiceSearchProblemDefinition, imageSearchProblemDefinition, realtimeIndexingProblemDefinition, federatedSearchProblemDefinition, logSearchProblemDefinition, codeSearchProblemDefinition, hybridSearchProblemDefinition, videoSearchProblemDefinition, securityEventSearchProblemDefinition, medicalRecordSearchProblemDefinition, socialMediaSearchProblemDefinition, semanticSearchPlatformProblemDefinition, jobSearchProblemDefinition, travelSearchProblemDefinition, academicPaperSearchProblemDefinition, recipeSearchProblemDefinition, legalDocSearchProblemDefinition, newsSearchProblemDefinition, musicSearchProblemDefinition, appStoreSearchProblemDefinition, documentCollabSearchProblemDefinition } from './generated-all/searchAllProblems';
// Removed: basicTextSearchProblemDefinition, autocompleteSearchProblemDefinition, facetedSearchProblemDefinition, geoSearchProblemDefinition
import { basicMultiRegionProblemDefinition, activeActiveRegionsProblemDefinition, globalCdnProblemDefinition, distributedSessionStoreProblemDefinition, multiregionBackupProblemDefinition, globalDnsProblemDefinition, globalIpAnycastProblemDefinition, geofencedFeaturesProblemDefinition, partialRegionFailureProblemDefinition, globalSocialNetworkProblemDefinition, crossRegionFailoverProblemDefinition, geoPinningProblemDefinition, multiregionStreamingProblemDefinition, latencyBasedRoutingProblemDefinition, multiregionSearchProblemDefinition, crossRegionAnalyticsProblemDefinition, multiregionCacheProblemDefinition, globalContentDeliveryProblemDefinition, edgeComputingProblemDefinition, multiregionQueueProblemDefinition, regionalShardingProblemDefinition, crossRegionObservabilityProblemDefinition, regionalQuotaEnforcementProblemDefinition, crossRegionSecretsProblemDefinition, planetScaleDatabaseProblemDefinition, globalRateLimitingProblemDefinition, readYourWritesProblemDefinition, regionalComplianceProblemDefinition, crossRegionMigrationProblemDefinition, timeSynchronizationProblemDefinition, globalLeaderElectionProblemDefinition, multiregionCrdtProblemDefinition, multiregionOrchestrationProblemDefinition } from './generated-all/multiregionAllProblems';
// Removed: globalLoadBalancingProblemDefinition, conflictResolutionProblemDefinition
// Platform Migration Problems - Removed (37 problems)
// import { l5MigrationNetflixMicroservicesProblemDefinition, ... } from './generated-all/platform-migrationAllProblems';
import { l5ApiGatewayFacebookProblemDefinition, l5ApiGraphqlFederationProblemDefinition } from './generated-all/api-platformAllProblems';
// l5ApiPlatform1-17 removed (all migration problems)
import { l5MultitenantSalesforceProblemDefinition } from './generated-all/multi-tenantAllProblems';
// l5MultiTenant1-17 removed (all migration problems)
import { l5DataPlatformUberProblemDefinition } from './generated-all/data-platformAllProblems';
// l5DataPlatform1-17 removed (all migration problems)
import { l5DevprodGoogleCiProblemDefinition } from './generated-all/developer-productivityAllProblems';
// l5DeveloperProductivity1-17 removed (all migration problems)
import { l5SecurityAppleEncryptionProblemDefinition } from './generated-all/compliance-securityAllProblems';
// l5ComplianceSecurity1-17 removed (all migration problems)
import { l5ObservabilityDatadogProblemDefinition } from './generated-all/observabilityAllProblems';
// l5Observability1-17 removed (all migration problems)
import { l5InfraKubernetesPlatformProblemDefinition } from './generated-all/infrastructureAllProblems';
// l5Infrastructure1-17 removed (all migration problems)
import { l5MlPlatformMetaProblemDefinition } from './generated-all/ml-platformAllProblems';
// l5MlPlatform1-17 removed (all migration problems)
import { l5RegionalTiktokPlatformProblemDefinition } from './generated-all/cross-regionalAllProblems';
// l5CrossRegional1-17 removed (all migration problems)
import { l6Protocol6gArchitectureProblemDefinition, l6ProtocolTcpReplacementProblemDefinition } from './generated-all/next-gen-protocolsAllProblems';
// l6ProtocolQuantumInternet, l6ProtocolInterplanetary, l6NextGenProtocols1-18 removed (speculative, not in whitelist)
import { l6DbCapTheoremBreakerProblemDefinition } from './generated-all/novel-databasesAllProblems';
// l6NovelDatabases1 removed (actually "DNA Storage Infrastructure" - speculative, not CRDTs)
// l6DbQuantumResistant, l6DbDnaStorage, l6DbNeuromorphic, l6NovelDatabases2-18 not in whitelist (speculative)
// AI Infrastructure (0) - Removed (all 21 problems are speculative)
// import { l6AiAgiTrainingProblemDefinition, ... } from './generated-all/ai-infrastructureAllProblems';
import { l6DistributedConsensus1ProblemDefinition, l6DistributedConsensus2ProblemDefinition } from './generated-all/distributed-consensusAllProblems';
// l6ConsensusPlanetary, l6ConsensusMillionNodes, l6DistributedConsensus3-17 removed (not in whitelist)
// new-computing, energy-sustainability removed (speculative, not in whitelist)
import { l6PrivacyZkpInternetProblemDefinition } from './generated-all/privacy-innovationAllProblems';
// l6PrivacyHomomorphicScale, l6PrivacyInnovation1-17 removed (not in whitelist)
// economic-systems, bio-digital, existential-infrastructure removed (speculative, not in whitelist)

// DDIA Gap Problems - Filling missing DDIA concepts
// DDIA Gap Problems - Removed (covered in comprehensive problems and DDIA lessons)
// import { batchProcessingMapreduceProblemDefinition, explicitShardingDesignProblemDefinition, transactionIsolationLevelsProblemDefinition, dataWarehouseOlapProblemDefinition, graphDatabaseSocialProblemDefinition } from './generated-all/ddiaGapProblems';

// NFR Teaching Problems - Converted to lessons (see src/apps/system-design/builder/data/lessons/nfr/)
// import { nfrTeachingIntroProblems } from './generated-all/nfrTeachingIntro';
// import { nfrTeachingChapter0Problems } from './generated-all/nfrTeachingChapter0';

// DDIA Teaching Problems - Concept-focused learning (151 total)
import { ddiaChapter1Problems } from './generated-all/ddiaTeachingChapter1';
// Chapters 2-4, 7-12: Converted to lessons (see src/apps/system-design/builder/data/lessons/ddia/)
// Chapters 5-6: Also converted to lessons (see src/apps/system-design/builder/data/lessons/ddia/)
// import { ddiaReplicationProblems } from './generated-all/ddiaTeachingReplication';
// import { ddiaPartitioningProblems } from './generated-all/ddiaTeachingPartitioning';
// Chapters 7-12: Concepts integrated into comprehensive problems (see comprehensive/*.ts)

// Comprehensive Problems
import { comprehensiveSocialMediaPlatformDefinition } from './comprehensive/socialMediaPlatform';
import { comprehensiveEcommercePlatformDefinition } from './comprehensive/ecommercePlatform';
import { comprehensiveSearchPlatformDefinition } from './comprehensive/searchPlatform';
import { comprehensiveApiGatewayPlatformDefinition } from './comprehensive/apiGatewayPlatform';
import { comprehensiveCloudStoragePlatformDefinition } from './comprehensive/cloudStoragePlatform';

// Note: Individual problem definitions that were previously imported here are now imported from generated-all files above

export const allProblemDefinitions: ProblemDefinition[] = [
  // Comprehensive Problems (Real-world application scenarios)
  comprehensiveSocialMediaPlatformDefinition,
  comprehensiveEcommercePlatformDefinition,
  comprehensiveSearchPlatformDefinition,
  comprehensiveApiGatewayPlatformDefinition,
  comprehensiveCloudStoragePlatformDefinition,
  
  // Original 40 Problems
  instagramProblemDefinition,
  twitterProblemDefinition,
  redditProblemDefinition,
  linkedinProblemDefinition,
  facebookProblemDefinition,
  tiktokProblemDefinition,
  pinterestProblemDefinition,
  snapchatProblemDefinition,
  tinderProblemDefinition,
  discordProblemDefinition,
  mediumProblemDefinition,
  amazonProblemDefinition,
  shopifyProblemDefinition,
  stripeProblemDefinition,
  uberProblemDefinition,
  airbnbProblemDefinition,
  netflixProblemDefinition,
  spotifyProblemDefinition,
  youtubeProblemDefinition,
  twitchProblemDefinition,
  huluProblemDefinition,
  whatsappProblemDefinition,
  slackProblemDefinition,
  telegramProblemDefinition,
  messengerProblemDefinition,
  pastebinProblemDefinition,
  dropboxProblemDefinition,
  googledriveProblemDefinition,
  githubProblemDefinition,
  stackoverflowProblemDefinition,
  doordashProblemDefinition,
  instacartProblemDefinition,
  yelpProblemDefinition,
  notionProblemDefinition,
  trelloProblemDefinition,
  googlecalendarProblemDefinition,
  zoomProblemDefinition,
  steamProblemDefinition,
  ticketmasterProblemDefinition,
  bookingcomProblemDefinition,
  weatherapiProblemDefinition,

  // Generated Problems from ALL_PROBLEMS.md
  // Tutorial Problems (0) - Removed (filtered out from problem catalog)
  // tutorialSimpleBlogProblemDefinition,
  // tutorialIntermediateImagesProblemDefinition,
  // tutorialAdvancedChatProblemDefinition,
  // boeWalkthroughChatProblemDefinition,
    // caching (34) - Removed 3: sessionStoreBasicProblemDefinition, socialFeedCacheProblemDefinition, multiTenantSaasCacheProblemDefinition
    tinyUrlL6ProblemDefinition, // L6-level version with percentile-based latency, tail amplification, cascading failures
    tinyurlProblemDefinition,
    basicWebCacheProblemDefinition,
    staticContentCdnProblemDefinition,
    databaseQueryCacheProblemDefinition,
    apiRateLimitCacheProblemDefinition,
    productCatalogCacheProblemDefinition,
    gamingLeaderboardCacheProblemDefinition,
    geoLocationCacheProblemDefinition,
    // configCacheBasicProblemDefinition - Integrated into comprehensive-api-gateway-platform
    videoStreamingCacheProblemDefinition,
    searchSuggestionCacheProblemDefinition,
    newsAggregatorCacheProblemDefinition,
    graphqlCacheProblemDefinition,
    shoppingCartCacheProblemDefinition,
    analyticsDashboardCacheProblemDefinition,
    // multiTenantSaasCacheProblemDefinition - Removed (covered in comprehensive-ecommerce-platform)
    cmsCacheProblemDefinition,
    authTokenCacheProblemDefinition,
    pricingEngineCacheProblemDefinition,
    recommendationEngineCacheProblemDefinition,
    rtbAdCacheProblemDefinition,
    gamingMatchmakingCacheProblemDefinition,
    iotDeviceCacheProblemDefinition,
    globalInventoryCacheProblemDefinition,
    hybridCdnCacheProblemDefinition,
    globalInventoryMasteryProblemDefinition,
    financialTradingCacheProblemDefinition,
    gameAssetCdnMasteryProblemDefinition,
    sportsBettingCacheProblemDefinition,
    autonomousVehicleCacheProblemDefinition,
    stockMarketDataCacheProblemDefinition,
    multiRegionSocialCacheProblemDefinition,
    healthcareRecordsCacheProblemDefinition,
    supplyChainCacheProblemDefinition,
    // gateway (33) - Removed 3: rateLimiterProblemDefinition, basicApiGatewayProblemDefinition, authenticationGatewayProblemDefinition
    simpleRateLimiterProblemDefinition,
    loadBalancingGatewayProblemDefinition,
    requestTransformGatewayProblemDefinition,
    corsGatewayProblemDefinition,
    retryGatewayProblemDefinition,
    compressionGatewayProblemDefinition,
    loggingGatewayProblemDefinition,
    healthCheckGatewayProblemDefinition,
    apiRoutingGatewayProblemDefinition,
    responseTransformGatewayProblemDefinition,
    apiAggregationGatewayProblemDefinition,
    graphqlGatewayProblemDefinition,
    oauth2GatewayProblemDefinition,
    websocketGatewayProblemDefinition,
    grpcGatewayProblemDefinition,
    mobileGatewayProblemDefinition,
    partnerGatewayProblemDefinition,
    webhookGatewayProblemDefinition,
    serverlessGatewayProblemDefinition,
    multiProtocolGatewayProblemDefinition,
    versioningGatewayProblemDefinition,
    quotaGatewayProblemDefinition,
    monetizationGatewayProblemDefinition,
    zeroTrustGatewayProblemDefinition,
    mlModelGatewayProblemDefinition,
    fraudDetectionGatewayProblemDefinition,
    hftGatewayProblemDefinition,
    iotGatewayProblemDefinition,
    blockchainGatewayProblemDefinition,
    globalTrafficGatewayProblemDefinition,
    edgeComputeGatewayProblemDefinition,
    apiCachingGatewayProblemDefinition,
    serviceDiscoveryGatewayProblemDefinition,
    // streaming (33) - Removed 4: chatProblemDefinition, ingestionProblemDefinition, clickstreamAnalyticsProblemDefinition, eventSourcingBasicProblemDefinition
    basicMessageQueueProblemDefinition,
    realtimeNotificationsProblemDefinition,
    basicEventLogProblemDefinition,
    simplePubsubProblemDefinition,
    realtimeChatMessagesProblemDefinition,
    serverLogAggregationProblemDefinition,
    sensorDataCollectionProblemDefinition,
    emailQueueSystemProblemDefinition,
    // eventSourcingBasicProblemDefinition - Removed (covered in comprehensive-social-media-platform)
    orderProcessingStreamProblemDefinition,
    paymentTransactionLogProblemDefinition,
    stockPriceUpdatesProblemDefinition,
    socialMediaFeedProblemDefinition,
    videoUploadPipelineProblemDefinition,
    fraudDetectionStreamProblemDefinition,
    userActivityTrackingProblemDefinition,
    iotTelemetryAggregationProblemDefinition,
    gameEventProcessingProblemDefinition,
    deliveryTrackingUpdatesProblemDefinition,
    notificationFanoutProblemDefinition,
    contentModerationQueueProblemDefinition,
    searchIndexUpdatesProblemDefinition,
    recommendationPipelineProblemDefinition,
    auditLogStreamingProblemDefinition,
    kafkaStreamingPipelineProblemDefinition,
    exactlyOncePaymentProblemDefinition,
    globalEventSourcingSystemProblemDefinition,
    multiDcStreamReplicationProblemDefinition,
    realtimeMlFeatureStoreProblemDefinition,
    gdprCompliantStreamingProblemDefinition,
    financialSettlementStreamProblemDefinition,
    autonomousVehicleTelemetryProblemDefinition,
    healthcareDataStreamHipaaProblemDefinition,
    globalCdcPipelineProblemDefinition,
    // storage (31) - Removed 4: basicDatabaseDesignProblemDefinition, nosqlBasicsProblemDefinition, timeSeriesMetricsProblemDefinition, distributedDatabaseProblemDefinition
    keyValueStoreProblemDefinition,
    productCatalogProblemDefinition,
    sessionStoreProblemDefinition,
    fileMetadataStoreProblemDefinition,
    configManagementProblemDefinition,
    ecommerceOrderDbProblemDefinition,
    socialGraphDbProblemDefinition,
    analyticsWarehouseProblemDefinition,
    multiTenantSaasProblemDefinition,
    inventoryManagementProblemDefinition,
    cmsMediaStorageProblemDefinition,
    bankingTransactionDbProblemDefinition,
    healthcareRecordsProblemDefinition,
    iotTimeSeriesProblemDefinition,
    gamingLeaderboardProblemDefinition,
    bookingReservationProblemDefinition,
    auditTrailProblemDefinition,
    searchIndexStorageProblemDefinition,
    mlModelRegistryProblemDefinition,
    rateLimitCountersProblemDefinition,
    // distributedDatabaseProblemDefinition - Removed (conceptual, better as lesson)
    contentDeliveryStorageProblemDefinition,
    multiModelDatabaseProblemDefinition,
    distributedTransactionsProblemDefinition,
    multiMasterReplicationProblemDefinition,
    globalInventoryStrongProblemDefinition,
    financialLedgerProblemDefinition,
    blockchainStateDbProblemDefinition,
    realtimeGamingStateProblemDefinition,
    autonomousVehicleMapProblemDefinition,
    petabyteDataLakeProblemDefinition,
    blockStorageProblemDefinition,
    // search (31) - Removed 4: basicTextSearchProblemDefinition, autocompleteSearchProblemDefinition, facetedSearchProblemDefinition, geoSearchProblemDefinition
    fuzzySearchProblemDefinition,
    synonymSearchProblemDefinition,
    highlightSearchProblemDefinition,
    boostingSearchProblemDefinition,
    productDiscoveryProblemDefinition,
    searchSuggestionsProblemDefinition,
    ecommerceSearchProblemDefinition,
    multilingualSearchProblemDefinition,
    searchAnalyticsProblemDefinition,
    personalizedSearchProblemDefinition,
    voiceSearchProblemDefinition,
    imageSearchProblemDefinition,
    realtimeIndexingProblemDefinition,
    federatedSearchProblemDefinition,
    logSearchProblemDefinition,
    codeSearchProblemDefinition,
    hybridSearchProblemDefinition,
    videoSearchProblemDefinition,
    securityEventSearchProblemDefinition,
    medicalRecordSearchProblemDefinition,
    socialMediaSearchProblemDefinition,
    semanticSearchPlatformProblemDefinition,
    jobSearchProblemDefinition,
    travelSearchProblemDefinition,
    academicPaperSearchProblemDefinition,
    recipeSearchProblemDefinition,
    legalDocSearchProblemDefinition,
    newsSearchProblemDefinition,
    musicSearchProblemDefinition,
    appStoreSearchProblemDefinition,
    documentCollabSearchProblemDefinition,
    // multiregion (35)
    basicMultiRegionProblemDefinition,
    activeActiveRegionsProblemDefinition,
    globalCdnProblemDefinition,
    // globalLoadBalancingProblemDefinition - Removed (covered in comprehensive problems)
    distributedSessionStoreProblemDefinition,
    multiregionBackupProblemDefinition,
    globalDnsProblemDefinition,
    globalIpAnycastProblemDefinition,
    geofencedFeaturesProblemDefinition,
    partialRegionFailureProblemDefinition,
    globalSocialNetworkProblemDefinition,
    crossRegionFailoverProblemDefinition,
    geoPinningProblemDefinition,
    multiregionStreamingProblemDefinition,
    latencyBasedRoutingProblemDefinition,
    multiregionSearchProblemDefinition,
    crossRegionAnalyticsProblemDefinition,
    multiregionCacheProblemDefinition,
    globalContentDeliveryProblemDefinition,
    edgeComputingProblemDefinition,
    multiregionQueueProblemDefinition,
    regionalShardingProblemDefinition,
    crossRegionObservabilityProblemDefinition,
    regionalQuotaEnforcementProblemDefinition,
    crossRegionSecretsProblemDefinition,
    planetScaleDatabaseProblemDefinition,
    // conflictResolutionProblemDefinition - Removed (covered in comprehensive problems)
    globalRateLimitingProblemDefinition,
    readYourWritesProblemDefinition,
    regionalComplianceProblemDefinition,
    crossRegionMigrationProblemDefinition,
    timeSynchronizationProblemDefinition,
    globalLeaderElectionProblemDefinition,
    multiregionCrdtProblemDefinition,
    multiregionOrchestrationProblemDefinition,
    // platform-migration (0) - Removed (37 problems)
    // All migration problems removed - focus on building systems first (L1-L4)
    // See lesson: platform-migration-strategies for migration concepts
    // api-platform (2) - Only named problems kept
    l5ApiGatewayFacebookProblemDefinition,
    l5ApiGraphqlFederationProblemDefinition,
    // l5ApiPlatform1-17 removed (all migration problems)
    // multi-tenant (1) - Only named problem kept
    l5MultitenantSalesforceProblemDefinition,
    // l5MultiTenant1-17 removed (all migration problems)
    // data-platform (1) - Only named problem kept
    l5DataPlatformUberProblemDefinition,
    // l5DataPlatform1-17 removed (all migration problems)
    // developer-productivity (1) - Only named problem kept
    l5DevprodGoogleCiProblemDefinition,
    // l5DeveloperProductivity1-17 removed (all migration problems)
    // compliance-security (1) - Only named problem kept
    l5SecurityAppleEncryptionProblemDefinition,
    // l5ComplianceSecurity1-17 removed (all migration problems)
    // observability (1) - Only named problem kept
    l5ObservabilityDatadogProblemDefinition,
    // l5Observability1-17 removed (all migration problems)
    // infrastructure (1) - Only named problem kept
    l5InfraKubernetesPlatformProblemDefinition,
    // l5Infrastructure1-17 removed (all migration problems)
    // ml-platform (1) - Only named problem kept
    l5MlPlatformMetaProblemDefinition,
    // l5MlPlatform1-17 removed (all migration problems)
    // cross-regional (1) - Only named problem kept
    l5RegionalTiktokPlatformProblemDefinition,
    // l5CrossRegional1-17 removed (all migration problems)
    // next-gen-protocols (2) - Only practical ones kept
    l6Protocol6gArchitectureProblemDefinition,
    l6ProtocolTcpReplacementProblemDefinition,
    // l6ProtocolQuantumInternet, l6ProtocolInterplanetary, l6NextGenProtocols1-18 removed (speculative, not in whitelist)
    // novel-databases (1) - Only practical one kept
    l6DbCapTheoremBreakerProblemDefinition,
    // l6NovelDatabases1 removed (actually "DNA Storage Infrastructure" - speculative, not CRDTs)
    // l6DbQuantumResistant, l6DbDnaStorage, l6DbNeuromorphic, l6NovelDatabases2-18 not in whitelist (speculative)
    // ai-infrastructure (0) - Removed (all 21 problems are speculative: AGI, consciousness, quantum, biological computing)
    // Practical ML problems are covered by l5-ml-platform-* problems (Meta, OpenAI, MLflow, SageMaker, etc.)
    // distributed-consensus (2) - Only practical ones kept
    l6DistributedConsensus1ProblemDefinition,
    l6DistributedConsensus2ProblemDefinition,
    // l6ConsensusPlanetary, l6ConsensusMillionNodes, l6DistributedConsensus3-17 removed (not in whitelist)
    // new-computing, energy-sustainability, economic-systems, bio-digital, existential-infrastructure (0) - Removed (all speculative, not in whitelist)
    // privacy-innovation (1) - Only practical one kept
    l6PrivacyZkpInternetProblemDefinition,
    // l6PrivacyHomomorphicScale, l6PrivacyInnovation1-17 removed (not in whitelist)
    // DDIA Gap Problems (5)
    // DDIA Gap Problems (5) - Removed (covered in comprehensive problems and DDIA lessons)
    // batchProcessingMapreduceProblemDefinition,
    // explicitShardingDesignProblemDefinition,
    // transactionIsolationLevelsProblemDefinition,
    // dataWarehouseOlapProblemDefinition,
    // graphDatabaseSocialProblemDefinition,
    // NFR Teaching Problems: Converted to lessons (see src/apps/system-design/builder/data/lessons/nfr/)
    // DDIA Teaching Problems
    // Chapter 1: Reliability, Scalability, Maintainability (converted to lessons)
    ...ddiaChapter1Problems,
    // Chapters 2-6, 7-12: Converted to lessons (see src/apps/system-design/builder/data/lessons/ddia/)
    // Concepts are also integrated into comprehensive problems (see comprehensive/*.ts)
    // System Design Primer: Converted to lessons (see src/apps/system-design/builder/data/lessons/sdp/)
].filter((problem, index, self) => {
  // Deduplicate by title - keep only the first occurrence of each title
  return index === self.findIndex(p => p.title === problem.title);
}).filter((problem) => {
  // Filter to keep only whitelisted problems (165 curated, non-repetitive problems)
  return problemWhitelist.has(problem.id);
});
