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

// Social Media (10)
export { instagramProblemDefinition } from './instagram';
export { twitterProblemDefinition } from './twitter';
export { redditProblemDefinition } from './reddit';
export { linkedinProblemDefinition } from './linkedin';
export { facebookProblemDefinition } from './facebook';
export { tiktokProblemDefinition } from './tiktok';
export { pinterestProblemDefinition } from './pinterest';
export { snapchatProblemDefinition } from './snapchat';
export { discordProblemDefinition } from './discord';
export { mediumProblemDefinition } from './medium';

// E-commerce & Services (5)
export { amazonProblemDefinition } from './amazon';
export { shopifyProblemDefinition } from './shopify';
export { stripeProblemDefinition } from './stripe';
export { uberProblemDefinition } from './uber';
export { airbnbProblemDefinition } from './airbnb';

// Streaming & Media (5)
export { netflixProblemDefinition } from './netflix';
export { spotifyProblemDefinition } from './spotify';
export { youtubeProblemDefinition } from './youtube';
export { twitchProblemDefinition } from './twitch';
export { huluProblemDefinition } from './hulu';

// Messaging (4)
export { whatsappProblemDefinition } from './whatsapp';
export { slackProblemDefinition } from './slack';
export { telegramProblemDefinition } from './telegram';
export { messengerProblemDefinition } from './messenger';

// Infrastructure (5)
export { pastebinProblemDefinition } from './pastebin';
export { dropboxProblemDefinition } from './dropbox';
export { googledriveProblemDefinition } from './googledrive';
export { githubProblemDefinition } from './github';
export { stackoverflowProblemDefinition } from './stackoverflow';

// Food & Delivery (3)
export { doordashProblemDefinition } from './doordash';
export { instacartProblemDefinition } from './instacart';
export { yelpProblemDefinition } from './yelp';

// Productivity (4)
export { notionProblemDefinition } from './notion';
export { trelloProblemDefinition } from './trello';
export { googlecalendarProblemDefinition } from './googlecalendar';
export { zoomProblemDefinition } from './zoom';

// Gaming & Other (4)
export { steamProblemDefinition } from './steam';
export { ticketmasterProblemDefinition } from './ticketmaster';
export { bookingcomProblemDefinition } from './bookingcom';
export { weatherapiProblemDefinition } from './weatherapi';

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
export { l5ApiGatewayFacebookProblemDefinition, l5ApiGraphqlFederationProblemDefinition, l5ApiPlatform1ProblemDefinition, l5ApiPlatform2ProblemDefinition, l5ApiPlatform3ProblemDefinition, l5ApiPlatform4ProblemDefinition, l5ApiPlatform5ProblemDefinition, l5ApiPlatform6ProblemDefinition, l5ApiPlatform7ProblemDefinition, l5ApiPlatform8ProblemDefinition, l5ApiPlatform9ProblemDefinition, l5ApiPlatform10ProblemDefinition, l5ApiPlatform11ProblemDefinition, l5ApiPlatform12ProblemDefinition, l5ApiPlatform13ProblemDefinition, l5ApiPlatform14ProblemDefinition, l5ApiPlatform15ProblemDefinition, l5ApiPlatform16ProblemDefinition, l5ApiPlatform17ProblemDefinition } from './generated-all/api-platformAllProblems';
export { l5MultitenantSalesforceProblemDefinition, l5MultiTenant1ProblemDefinition, l5MultiTenant2ProblemDefinition, l5MultiTenant3ProblemDefinition, l5MultiTenant4ProblemDefinition, l5MultiTenant5ProblemDefinition, l5MultiTenant6ProblemDefinition, l5MultiTenant7ProblemDefinition, l5MultiTenant8ProblemDefinition, l5MultiTenant9ProblemDefinition, l5MultiTenant10ProblemDefinition, l5MultiTenant11ProblemDefinition, l5MultiTenant12ProblemDefinition, l5MultiTenant13ProblemDefinition, l5MultiTenant14ProblemDefinition, l5MultiTenant15ProblemDefinition, l5MultiTenant16ProblemDefinition, l5MultiTenant17ProblemDefinition } from './generated-all/multi-tenantAllProblems';
export { l5DataPlatformUberProblemDefinition, l5DataPlatform1ProblemDefinition, l5DataPlatform2ProblemDefinition, l5DataPlatform3ProblemDefinition, l5DataPlatform4ProblemDefinition, l5DataPlatform5ProblemDefinition, l5DataPlatform6ProblemDefinition, l5DataPlatform7ProblemDefinition, l5DataPlatform8ProblemDefinition, l5DataPlatform9ProblemDefinition, l5DataPlatform10ProblemDefinition, l5DataPlatform11ProblemDefinition, l5DataPlatform12ProblemDefinition, l5DataPlatform13ProblemDefinition, l5DataPlatform14ProblemDefinition, l5DataPlatform15ProblemDefinition, l5DataPlatform16ProblemDefinition, l5DataPlatform17ProblemDefinition } from './generated-all/data-platformAllProblems';
export { l5DevprodGoogleCiProblemDefinition, l5DeveloperProductivity1ProblemDefinition, l5DeveloperProductivity2ProblemDefinition, l5DeveloperProductivity3ProblemDefinition, l5DeveloperProductivity4ProblemDefinition, l5DeveloperProductivity5ProblemDefinition, l5DeveloperProductivity6ProblemDefinition, l5DeveloperProductivity7ProblemDefinition, l5DeveloperProductivity8ProblemDefinition, l5DeveloperProductivity9ProblemDefinition, l5DeveloperProductivity10ProblemDefinition, l5DeveloperProductivity11ProblemDefinition, l5DeveloperProductivity12ProblemDefinition, l5DeveloperProductivity13ProblemDefinition, l5DeveloperProductivity14ProblemDefinition, l5DeveloperProductivity15ProblemDefinition, l5DeveloperProductivity16ProblemDefinition, l5DeveloperProductivity17ProblemDefinition } from './generated-all/developer-productivityAllProblems';
export { l5SecurityAppleEncryptionProblemDefinition, l5ComplianceSecurity1ProblemDefinition, l5ComplianceSecurity2ProblemDefinition, l5ComplianceSecurity3ProblemDefinition, l5ComplianceSecurity4ProblemDefinition, l5ComplianceSecurity5ProblemDefinition, l5ComplianceSecurity6ProblemDefinition, l5ComplianceSecurity7ProblemDefinition, l5ComplianceSecurity8ProblemDefinition, l5ComplianceSecurity9ProblemDefinition, l5ComplianceSecurity10ProblemDefinition, l5ComplianceSecurity11ProblemDefinition, l5ComplianceSecurity12ProblemDefinition, l5ComplianceSecurity13ProblemDefinition, l5ComplianceSecurity14ProblemDefinition, l5ComplianceSecurity15ProblemDefinition, l5ComplianceSecurity16ProblemDefinition, l5ComplianceSecurity17ProblemDefinition } from './generated-all/compliance-securityAllProblems';
export { l5ObservabilityDatadogProblemDefinition, l5Observability1ProblemDefinition, l5Observability2ProblemDefinition, l5Observability3ProblemDefinition, l5Observability4ProblemDefinition, l5Observability5ProblemDefinition, l5Observability6ProblemDefinition, l5Observability7ProblemDefinition, l5Observability8ProblemDefinition, l5Observability9ProblemDefinition, l5Observability10ProblemDefinition, l5Observability11ProblemDefinition, l5Observability12ProblemDefinition, l5Observability13ProblemDefinition, l5Observability14ProblemDefinition, l5Observability15ProblemDefinition, l5Observability16ProblemDefinition, l5Observability17ProblemDefinition } from './generated-all/observabilityAllProblems';
export { l5InfraKubernetesPlatformProblemDefinition, l5Infrastructure1ProblemDefinition, l5Infrastructure2ProblemDefinition, l5Infrastructure3ProblemDefinition, l5Infrastructure4ProblemDefinition, l5Infrastructure5ProblemDefinition, l5Infrastructure6ProblemDefinition, l5Infrastructure7ProblemDefinition, l5Infrastructure8ProblemDefinition, l5Infrastructure9ProblemDefinition, l5Infrastructure10ProblemDefinition, l5Infrastructure11ProblemDefinition, l5Infrastructure12ProblemDefinition, l5Infrastructure13ProblemDefinition, l5Infrastructure14ProblemDefinition, l5Infrastructure15ProblemDefinition, l5Infrastructure16ProblemDefinition, l5Infrastructure17ProblemDefinition } from './generated-all/infrastructureAllProblems';
export { l5MlPlatformMetaProblemDefinition, l5MlPlatform1ProblemDefinition, l5MlPlatform2ProblemDefinition, l5MlPlatform3ProblemDefinition, l5MlPlatform4ProblemDefinition, l5MlPlatform5ProblemDefinition, l5MlPlatform6ProblemDefinition, l5MlPlatform7ProblemDefinition, l5MlPlatform8ProblemDefinition, l5MlPlatform9ProblemDefinition, l5MlPlatform10ProblemDefinition, l5MlPlatform11ProblemDefinition, l5MlPlatform12ProblemDefinition, l5MlPlatform13ProblemDefinition, l5MlPlatform14ProblemDefinition, l5MlPlatform15ProblemDefinition, l5MlPlatform16ProblemDefinition, l5MlPlatform17ProblemDefinition } from './generated-all/ml-platformAllProblems';
export { l5RegionalTiktokPlatformProblemDefinition, l5CrossRegional1ProblemDefinition, l5CrossRegional2ProblemDefinition, l5CrossRegional3ProblemDefinition, l5CrossRegional4ProblemDefinition, l5CrossRegional5ProblemDefinition, l5CrossRegional6ProblemDefinition, l5CrossRegional7ProblemDefinition, l5CrossRegional8ProblemDefinition, l5CrossRegional9ProblemDefinition, l5CrossRegional10ProblemDefinition, l5CrossRegional11ProblemDefinition, l5CrossRegional12ProblemDefinition, l5CrossRegional13ProblemDefinition, l5CrossRegional14ProblemDefinition, l5CrossRegional15ProblemDefinition, l5CrossRegional16ProblemDefinition, l5CrossRegional17ProblemDefinition } from './generated-all/cross-regionalAllProblems';
export { l6ProtocolQuantumInternetProblemDefinition, l6ProtocolInterplanetaryProblemDefinition, l6Protocol6gArchitectureProblemDefinition, l6ProtocolTcpReplacementProblemDefinition, l6NextGenProtocols1ProblemDefinition, l6NextGenProtocols2ProblemDefinition, l6NextGenProtocols3ProblemDefinition, l6NextGenProtocols4ProblemDefinition, l6NextGenProtocols5ProblemDefinition, l6NextGenProtocols6ProblemDefinition, l6NextGenProtocols7ProblemDefinition, l6NextGenProtocols8ProblemDefinition, l6NextGenProtocols9ProblemDefinition, l6NextGenProtocols10ProblemDefinition, l6NextGenProtocols11ProblemDefinition, l6NextGenProtocols12ProblemDefinition, l6NextGenProtocols13ProblemDefinition, l6NextGenProtocols14ProblemDefinition, l6NextGenProtocols15ProblemDefinition, l6NextGenProtocols16ProblemDefinition, l6NextGenProtocols17ProblemDefinition, l6NextGenProtocols18ProblemDefinition } from './generated-all/next-gen-protocolsAllProblems';
export { l6DbQuantumResistantProblemDefinition, l6DbDnaStorageProblemDefinition, l6DbNeuromorphicProblemDefinition, l6DbCapTheoremBreakerProblemDefinition, l6NovelDatabases1ProblemDefinition, l6NovelDatabases2ProblemDefinition, l6NovelDatabases3ProblemDefinition, l6NovelDatabases4ProblemDefinition, l6NovelDatabases5ProblemDefinition, l6NovelDatabases6ProblemDefinition, l6NovelDatabases7ProblemDefinition, l6NovelDatabases8ProblemDefinition, l6NovelDatabases9ProblemDefinition, l6NovelDatabases10ProblemDefinition, l6NovelDatabases11ProblemDefinition, l6NovelDatabases12ProblemDefinition, l6NovelDatabases13ProblemDefinition, l6NovelDatabases14ProblemDefinition, l6NovelDatabases15ProblemDefinition, l6NovelDatabases16ProblemDefinition, l6NovelDatabases17ProblemDefinition, l6NovelDatabases18ProblemDefinition } from './generated-all/novel-databasesAllProblems';
export { l6AiAgiTrainingProblemDefinition, l6AiBrainComputerProblemDefinition, l6AiConsciousArchitectureProblemDefinition, l6AiInfrastructure1ProblemDefinition, l6AiInfrastructure2ProblemDefinition, l6AiInfrastructure3ProblemDefinition, l6AiInfrastructure4ProblemDefinition, l6AiInfrastructure5ProblemDefinition, l6AiInfrastructure6ProblemDefinition, l6AiInfrastructure7ProblemDefinition, l6AiInfrastructure8ProblemDefinition, l6AiInfrastructure9ProblemDefinition, l6AiInfrastructure10ProblemDefinition, l6AiInfrastructure11ProblemDefinition, l6AiInfrastructure12ProblemDefinition, l6AiInfrastructure13ProblemDefinition, l6AiInfrastructure14ProblemDefinition, l6AiInfrastructure15ProblemDefinition, l6AiInfrastructure16ProblemDefinition, l6AiInfrastructure17ProblemDefinition, l6AiInfrastructure18ProblemDefinition } from './generated-all/ai-infrastructureAllProblems';
export { l6ConsensusPlanetaryProblemDefinition, l6ConsensusMillionNodesProblemDefinition, l6DistributedConsensus1ProblemDefinition, l6DistributedConsensus2ProblemDefinition, l6DistributedConsensus3ProblemDefinition, l6DistributedConsensus4ProblemDefinition, l6DistributedConsensus5ProblemDefinition, l6DistributedConsensus6ProblemDefinition, l6DistributedConsensus7ProblemDefinition, l6DistributedConsensus8ProblemDefinition, l6DistributedConsensus9ProblemDefinition, l6DistributedConsensus10ProblemDefinition, l6DistributedConsensus11ProblemDefinition, l6DistributedConsensus12ProblemDefinition, l6DistributedConsensus13ProblemDefinition, l6DistributedConsensus14ProblemDefinition, l6DistributedConsensus15ProblemDefinition, l6DistributedConsensus16ProblemDefinition, l6DistributedConsensus17ProblemDefinition } from './generated-all/distributed-consensusAllProblems';
export { l6ComputeQuantumCloudProblemDefinition, l6ComputeBiologicalProblemDefinition, l6NewComputing1ProblemDefinition, l6NewComputing2ProblemDefinition, l6NewComputing3ProblemDefinition, l6NewComputing4ProblemDefinition, l6NewComputing5ProblemDefinition, l6NewComputing6ProblemDefinition, l6NewComputing7ProblemDefinition, l6NewComputing8ProblemDefinition, l6NewComputing9ProblemDefinition, l6NewComputing10ProblemDefinition, l6NewComputing11ProblemDefinition, l6NewComputing12ProblemDefinition, l6NewComputing13ProblemDefinition, l6NewComputing14ProblemDefinition, l6NewComputing15ProblemDefinition, l6NewComputing16ProblemDefinition, l6NewComputing17ProblemDefinition } from './generated-all/new-computingAllProblems';
export { l6EnergyCarbonNegativeProblemDefinition, l6EnergyOceanPoweredProblemDefinition, l6EnergySustainability1ProblemDefinition, l6EnergySustainability2ProblemDefinition, l6EnergySustainability3ProblemDefinition, l6EnergySustainability4ProblemDefinition, l6EnergySustainability5ProblemDefinition, l6EnergySustainability6ProblemDefinition, l6EnergySustainability7ProblemDefinition, l6EnergySustainability8ProblemDefinition, l6EnergySustainability9ProblemDefinition, l6EnergySustainability10ProblemDefinition, l6EnergySustainability11ProblemDefinition, l6EnergySustainability12ProblemDefinition, l6EnergySustainability13ProblemDefinition, l6EnergySustainability14ProblemDefinition, l6EnergySustainability15ProblemDefinition, l6EnergySustainability16ProblemDefinition, l6EnergySustainability17ProblemDefinition } from './generated-all/energy-sustainabilityAllProblems';
export { l6PrivacyHomomorphicScaleProblemDefinition, l6PrivacyZkpInternetProblemDefinition, l6PrivacyInnovation1ProblemDefinition, l6PrivacyInnovation2ProblemDefinition, l6PrivacyInnovation3ProblemDefinition, l6PrivacyInnovation4ProblemDefinition, l6PrivacyInnovation5ProblemDefinition, l6PrivacyInnovation6ProblemDefinition, l6PrivacyInnovation7ProblemDefinition, l6PrivacyInnovation8ProblemDefinition, l6PrivacyInnovation9ProblemDefinition, l6PrivacyInnovation10ProblemDefinition, l6PrivacyInnovation11ProblemDefinition, l6PrivacyInnovation12ProblemDefinition, l6PrivacyInnovation13ProblemDefinition, l6PrivacyInnovation14ProblemDefinition, l6PrivacyInnovation15ProblemDefinition, l6PrivacyInnovation16ProblemDefinition, l6PrivacyInnovation17ProblemDefinition } from './generated-all/privacy-innovationAllProblems';
export { l6EconomicCbdcProblemDefinition, l6EconomicInterplanetaryProblemDefinition, l6EconomicSystems1ProblemDefinition, l6EconomicSystems2ProblemDefinition, l6EconomicSystems3ProblemDefinition, l6EconomicSystems4ProblemDefinition, l6EconomicSystems5ProblemDefinition, l6EconomicSystems6ProblemDefinition, l6EconomicSystems7ProblemDefinition, l6EconomicSystems8ProblemDefinition, l6EconomicSystems9ProblemDefinition, l6EconomicSystems10ProblemDefinition, l6EconomicSystems11ProblemDefinition, l6EconomicSystems12ProblemDefinition, l6EconomicSystems13ProblemDefinition, l6EconomicSystems14ProblemDefinition, l6EconomicSystems15ProblemDefinition, l6EconomicSystems16ProblemDefinition, l6EconomicSystems17ProblemDefinition } from './generated-all/economic-systemsAllProblems';
export { l6BioNeuralImplantProblemDefinition, l6BioDigitalTwinProblemDefinition, l6BioDigital1ProblemDefinition, l6BioDigital2ProblemDefinition, l6BioDigital3ProblemDefinition, l6BioDigital4ProblemDefinition, l6BioDigital5ProblemDefinition, l6BioDigital6ProblemDefinition, l6BioDigital7ProblemDefinition, l6BioDigital8ProblemDefinition, l6BioDigital9ProblemDefinition, l6BioDigital10ProblemDefinition, l6BioDigital11ProblemDefinition, l6BioDigital12ProblemDefinition, l6BioDigital13ProblemDefinition, l6BioDigital14ProblemDefinition, l6BioDigital15ProblemDefinition, l6BioDigital16ProblemDefinition, l6BioDigital17ProblemDefinition } from './generated-all/bio-digitalAllProblems';
export { l6ExistentialNuclearResilientProblemDefinition, l6ExistentialClimateAdaptationProblemDefinition, l6ExistentialPandemicResponseProblemDefinition, l6ExistentialAsteroidDefenseProblemDefinition, l6ExistentialInfrastructure1ProblemDefinition, l6ExistentialInfrastructure2ProblemDefinition, l6ExistentialInfrastructure3ProblemDefinition, l6ExistentialInfrastructure4ProblemDefinition, l6ExistentialInfrastructure5ProblemDefinition, l6ExistentialInfrastructure6ProblemDefinition, l6ExistentialInfrastructure7ProblemDefinition, l6ExistentialInfrastructure8ProblemDefinition, l6ExistentialInfrastructure9ProblemDefinition, l6ExistentialInfrastructure10ProblemDefinition, l6ExistentialInfrastructure11ProblemDefinition, l6ExistentialInfrastructure12ProblemDefinition, l6ExistentialInfrastructure13ProblemDefinition, l6ExistentialInfrastructure14ProblemDefinition, l6ExistentialInfrastructure15ProblemDefinition, l6ExistentialInfrastructure16ProblemDefinition, l6ExistentialInfrastructure17ProblemDefinition } from './generated-all/existential-infrastructureAllProblems';

// DDIA Gap Problems - Converted to lessons (see src/apps/system-design/builder/data/lessons/ddia/)
// All 5 problems removed - concepts covered in comprehensive problems and DDIA lessons
// Removed: batchProcessingMapreduceProblemDefinition, explicitShardingDesignProblemDefinition, transactionIsolationLevelsProblemDefinition, dataWarehouseOlapProblemDefinition, graphDatabaseSocialProblemDefinition

// NFR Teaching Problems - Converted to lessons (see src/apps/system-design/builder/data/lessons/nfr/)
// All 16 problems converted to 2 comprehensive lessons covering throughput, latency, durability, sharding, and consistency

// DDIA Teaching Problems - Concept-focused learning problems (151 total - ALL CHAPTERS)
export { ddiaChapter1Problems } from './generated-all/ddiaTeachingChapter1';
// Chapters 2-4, 7-12: Converted to lessons (see src/apps/system-design/builder/data/lessons/ddia/)
export { ddiaReplicationProblems } from './generated-all/ddiaTeachingReplication';
export { ddiaPartitioningProblems } from './generated-all/ddiaTeachingPartitioning';
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
import { l5ApiGatewayFacebookProblemDefinition, l5ApiGraphqlFederationProblemDefinition, l5ApiPlatform1ProblemDefinition, l5ApiPlatform2ProblemDefinition, l5ApiPlatform3ProblemDefinition, l5ApiPlatform4ProblemDefinition, l5ApiPlatform5ProblemDefinition, l5ApiPlatform6ProblemDefinition, l5ApiPlatform7ProblemDefinition, l5ApiPlatform8ProblemDefinition, l5ApiPlatform9ProblemDefinition, l5ApiPlatform10ProblemDefinition, l5ApiPlatform11ProblemDefinition, l5ApiPlatform12ProblemDefinition, l5ApiPlatform13ProblemDefinition, l5ApiPlatform14ProblemDefinition, l5ApiPlatform15ProblemDefinition, l5ApiPlatform16ProblemDefinition, l5ApiPlatform17ProblemDefinition } from './generated-all/api-platformAllProblems';
import { l5MultitenantSalesforceProblemDefinition, l5MultiTenant1ProblemDefinition, l5MultiTenant2ProblemDefinition, l5MultiTenant3ProblemDefinition, l5MultiTenant4ProblemDefinition, l5MultiTenant5ProblemDefinition, l5MultiTenant6ProblemDefinition, l5MultiTenant7ProblemDefinition, l5MultiTenant8ProblemDefinition, l5MultiTenant9ProblemDefinition, l5MultiTenant10ProblemDefinition, l5MultiTenant11ProblemDefinition, l5MultiTenant12ProblemDefinition, l5MultiTenant13ProblemDefinition, l5MultiTenant14ProblemDefinition, l5MultiTenant15ProblemDefinition, l5MultiTenant16ProblemDefinition, l5MultiTenant17ProblemDefinition } from './generated-all/multi-tenantAllProblems';
import { l5DataPlatformUberProblemDefinition, l5DataPlatform1ProblemDefinition, l5DataPlatform2ProblemDefinition, l5DataPlatform3ProblemDefinition, l5DataPlatform4ProblemDefinition, l5DataPlatform5ProblemDefinition, l5DataPlatform6ProblemDefinition, l5DataPlatform7ProblemDefinition, l5DataPlatform8ProblemDefinition, l5DataPlatform9ProblemDefinition, l5DataPlatform10ProblemDefinition, l5DataPlatform11ProblemDefinition, l5DataPlatform12ProblemDefinition, l5DataPlatform13ProblemDefinition, l5DataPlatform14ProblemDefinition, l5DataPlatform15ProblemDefinition, l5DataPlatform16ProblemDefinition, l5DataPlatform17ProblemDefinition } from './generated-all/data-platformAllProblems';
import { l5DevprodGoogleCiProblemDefinition, l5DeveloperProductivity1ProblemDefinition, l5DeveloperProductivity2ProblemDefinition, l5DeveloperProductivity3ProblemDefinition, l5DeveloperProductivity4ProblemDefinition, l5DeveloperProductivity5ProblemDefinition, l5DeveloperProductivity6ProblemDefinition, l5DeveloperProductivity7ProblemDefinition, l5DeveloperProductivity8ProblemDefinition, l5DeveloperProductivity9ProblemDefinition, l5DeveloperProductivity10ProblemDefinition, l5DeveloperProductivity11ProblemDefinition, l5DeveloperProductivity12ProblemDefinition, l5DeveloperProductivity13ProblemDefinition, l5DeveloperProductivity14ProblemDefinition, l5DeveloperProductivity15ProblemDefinition, l5DeveloperProductivity16ProblemDefinition, l5DeveloperProductivity17ProblemDefinition } from './generated-all/developer-productivityAllProblems';
import { l5SecurityAppleEncryptionProblemDefinition, l5ComplianceSecurity1ProblemDefinition, l5ComplianceSecurity2ProblemDefinition, l5ComplianceSecurity3ProblemDefinition, l5ComplianceSecurity4ProblemDefinition, l5ComplianceSecurity5ProblemDefinition, l5ComplianceSecurity6ProblemDefinition, l5ComplianceSecurity7ProblemDefinition, l5ComplianceSecurity8ProblemDefinition, l5ComplianceSecurity9ProblemDefinition, l5ComplianceSecurity10ProblemDefinition, l5ComplianceSecurity11ProblemDefinition, l5ComplianceSecurity12ProblemDefinition, l5ComplianceSecurity13ProblemDefinition, l5ComplianceSecurity14ProblemDefinition, l5ComplianceSecurity15ProblemDefinition, l5ComplianceSecurity16ProblemDefinition, l5ComplianceSecurity17ProblemDefinition } from './generated-all/compliance-securityAllProblems';
import { l5ObservabilityDatadogProblemDefinition, l5Observability1ProblemDefinition, l5Observability2ProblemDefinition, l5Observability3ProblemDefinition, l5Observability4ProblemDefinition, l5Observability5ProblemDefinition, l5Observability6ProblemDefinition, l5Observability7ProblemDefinition, l5Observability8ProblemDefinition, l5Observability9ProblemDefinition, l5Observability10ProblemDefinition, l5Observability11ProblemDefinition, l5Observability12ProblemDefinition, l5Observability13ProblemDefinition, l5Observability14ProblemDefinition, l5Observability15ProblemDefinition, l5Observability16ProblemDefinition, l5Observability17ProblemDefinition } from './generated-all/observabilityAllProblems';
import { l5InfraKubernetesPlatformProblemDefinition, l5Infrastructure1ProblemDefinition, l5Infrastructure2ProblemDefinition, l5Infrastructure3ProblemDefinition, l5Infrastructure4ProblemDefinition, l5Infrastructure5ProblemDefinition, l5Infrastructure6ProblemDefinition, l5Infrastructure7ProblemDefinition, l5Infrastructure8ProblemDefinition, l5Infrastructure9ProblemDefinition, l5Infrastructure10ProblemDefinition, l5Infrastructure11ProblemDefinition, l5Infrastructure12ProblemDefinition, l5Infrastructure13ProblemDefinition, l5Infrastructure14ProblemDefinition, l5Infrastructure15ProblemDefinition, l5Infrastructure16ProblemDefinition, l5Infrastructure17ProblemDefinition } from './generated-all/infrastructureAllProblems';
import { l5MlPlatformMetaProblemDefinition, l5MlPlatform1ProblemDefinition, l5MlPlatform2ProblemDefinition, l5MlPlatform3ProblemDefinition, l5MlPlatform4ProblemDefinition, l5MlPlatform5ProblemDefinition, l5MlPlatform6ProblemDefinition, l5MlPlatform7ProblemDefinition, l5MlPlatform8ProblemDefinition, l5MlPlatform9ProblemDefinition, l5MlPlatform10ProblemDefinition, l5MlPlatform11ProblemDefinition, l5MlPlatform12ProblemDefinition, l5MlPlatform13ProblemDefinition, l5MlPlatform14ProblemDefinition, l5MlPlatform15ProblemDefinition, l5MlPlatform16ProblemDefinition, l5MlPlatform17ProblemDefinition } from './generated-all/ml-platformAllProblems';
import { l5RegionalTiktokPlatformProblemDefinition, l5CrossRegional1ProblemDefinition, l5CrossRegional2ProblemDefinition, l5CrossRegional3ProblemDefinition, l5CrossRegional4ProblemDefinition, l5CrossRegional5ProblemDefinition, l5CrossRegional6ProblemDefinition, l5CrossRegional7ProblemDefinition, l5CrossRegional8ProblemDefinition, l5CrossRegional9ProblemDefinition, l5CrossRegional10ProblemDefinition, l5CrossRegional11ProblemDefinition, l5CrossRegional12ProblemDefinition, l5CrossRegional13ProblemDefinition, l5CrossRegional14ProblemDefinition, l5CrossRegional15ProblemDefinition, l5CrossRegional16ProblemDefinition, l5CrossRegional17ProblemDefinition } from './generated-all/cross-regionalAllProblems';
import { l6ProtocolQuantumInternetProblemDefinition, l6ProtocolInterplanetaryProblemDefinition, l6Protocol6gArchitectureProblemDefinition, l6ProtocolTcpReplacementProblemDefinition, l6NextGenProtocols1ProblemDefinition, l6NextGenProtocols2ProblemDefinition, l6NextGenProtocols3ProblemDefinition, l6NextGenProtocols4ProblemDefinition, l6NextGenProtocols5ProblemDefinition, l6NextGenProtocols6ProblemDefinition, l6NextGenProtocols7ProblemDefinition, l6NextGenProtocols8ProblemDefinition, l6NextGenProtocols9ProblemDefinition, l6NextGenProtocols10ProblemDefinition, l6NextGenProtocols11ProblemDefinition, l6NextGenProtocols12ProblemDefinition, l6NextGenProtocols13ProblemDefinition, l6NextGenProtocols14ProblemDefinition, l6NextGenProtocols15ProblemDefinition, l6NextGenProtocols16ProblemDefinition, l6NextGenProtocols17ProblemDefinition, l6NextGenProtocols18ProblemDefinition } from './generated-all/next-gen-protocolsAllProblems';
import { l6DbQuantumResistantProblemDefinition, l6DbDnaStorageProblemDefinition, l6DbNeuromorphicProblemDefinition, l6DbCapTheoremBreakerProblemDefinition, l6NovelDatabases1ProblemDefinition, l6NovelDatabases2ProblemDefinition, l6NovelDatabases3ProblemDefinition, l6NovelDatabases4ProblemDefinition, l6NovelDatabases5ProblemDefinition, l6NovelDatabases6ProblemDefinition, l6NovelDatabases7ProblemDefinition, l6NovelDatabases8ProblemDefinition, l6NovelDatabases9ProblemDefinition, l6NovelDatabases10ProblemDefinition, l6NovelDatabases11ProblemDefinition, l6NovelDatabases12ProblemDefinition, l6NovelDatabases13ProblemDefinition, l6NovelDatabases14ProblemDefinition, l6NovelDatabases15ProblemDefinition, l6NovelDatabases16ProblemDefinition, l6NovelDatabases17ProblemDefinition, l6NovelDatabases18ProblemDefinition } from './generated-all/novel-databasesAllProblems';
import { l6AiAgiTrainingProblemDefinition, l6AiBrainComputerProblemDefinition, l6AiConsciousArchitectureProblemDefinition, l6AiInfrastructure1ProblemDefinition, l6AiInfrastructure2ProblemDefinition, l6AiInfrastructure3ProblemDefinition, l6AiInfrastructure4ProblemDefinition, l6AiInfrastructure5ProblemDefinition, l6AiInfrastructure6ProblemDefinition, l6AiInfrastructure7ProblemDefinition, l6AiInfrastructure8ProblemDefinition, l6AiInfrastructure9ProblemDefinition, l6AiInfrastructure10ProblemDefinition, l6AiInfrastructure11ProblemDefinition, l6AiInfrastructure12ProblemDefinition, l6AiInfrastructure13ProblemDefinition, l6AiInfrastructure14ProblemDefinition, l6AiInfrastructure15ProblemDefinition, l6AiInfrastructure16ProblemDefinition, l6AiInfrastructure17ProblemDefinition, l6AiInfrastructure18ProblemDefinition } from './generated-all/ai-infrastructureAllProblems';
import { l6ConsensusPlanetaryProblemDefinition, l6ConsensusMillionNodesProblemDefinition, l6DistributedConsensus1ProblemDefinition, l6DistributedConsensus2ProblemDefinition, l6DistributedConsensus3ProblemDefinition, l6DistributedConsensus4ProblemDefinition, l6DistributedConsensus5ProblemDefinition, l6DistributedConsensus6ProblemDefinition, l6DistributedConsensus7ProblemDefinition, l6DistributedConsensus8ProblemDefinition, l6DistributedConsensus9ProblemDefinition, l6DistributedConsensus10ProblemDefinition, l6DistributedConsensus11ProblemDefinition, l6DistributedConsensus12ProblemDefinition, l6DistributedConsensus13ProblemDefinition, l6DistributedConsensus14ProblemDefinition, l6DistributedConsensus15ProblemDefinition, l6DistributedConsensus16ProblemDefinition, l6DistributedConsensus17ProblemDefinition } from './generated-all/distributed-consensusAllProblems';
import { l6ComputeQuantumCloudProblemDefinition, l6ComputeBiologicalProblemDefinition, l6NewComputing1ProblemDefinition, l6NewComputing2ProblemDefinition, l6NewComputing3ProblemDefinition, l6NewComputing4ProblemDefinition, l6NewComputing5ProblemDefinition, l6NewComputing6ProblemDefinition, l6NewComputing7ProblemDefinition, l6NewComputing8ProblemDefinition, l6NewComputing9ProblemDefinition, l6NewComputing10ProblemDefinition, l6NewComputing11ProblemDefinition, l6NewComputing12ProblemDefinition, l6NewComputing13ProblemDefinition, l6NewComputing14ProblemDefinition, l6NewComputing15ProblemDefinition, l6NewComputing16ProblemDefinition, l6NewComputing17ProblemDefinition } from './generated-all/new-computingAllProblems';
import { l6EnergyCarbonNegativeProblemDefinition, l6EnergyOceanPoweredProblemDefinition, l6EnergySustainability1ProblemDefinition, l6EnergySustainability2ProblemDefinition, l6EnergySustainability3ProblemDefinition, l6EnergySustainability4ProblemDefinition, l6EnergySustainability5ProblemDefinition, l6EnergySustainability6ProblemDefinition, l6EnergySustainability7ProblemDefinition, l6EnergySustainability8ProblemDefinition, l6EnergySustainability9ProblemDefinition, l6EnergySustainability10ProblemDefinition, l6EnergySustainability11ProblemDefinition, l6EnergySustainability12ProblemDefinition, l6EnergySustainability13ProblemDefinition, l6EnergySustainability14ProblemDefinition, l6EnergySustainability15ProblemDefinition, l6EnergySustainability16ProblemDefinition, l6EnergySustainability17ProblemDefinition } from './generated-all/energy-sustainabilityAllProblems';
import { l6PrivacyHomomorphicScaleProblemDefinition, l6PrivacyZkpInternetProblemDefinition, l6PrivacyInnovation1ProblemDefinition, l6PrivacyInnovation2ProblemDefinition, l6PrivacyInnovation3ProblemDefinition, l6PrivacyInnovation4ProblemDefinition, l6PrivacyInnovation5ProblemDefinition, l6PrivacyInnovation6ProblemDefinition, l6PrivacyInnovation7ProblemDefinition, l6PrivacyInnovation8ProblemDefinition, l6PrivacyInnovation9ProblemDefinition, l6PrivacyInnovation10ProblemDefinition, l6PrivacyInnovation11ProblemDefinition, l6PrivacyInnovation12ProblemDefinition, l6PrivacyInnovation13ProblemDefinition, l6PrivacyInnovation14ProblemDefinition, l6PrivacyInnovation15ProblemDefinition, l6PrivacyInnovation16ProblemDefinition, l6PrivacyInnovation17ProblemDefinition } from './generated-all/privacy-innovationAllProblems';
import { l6EconomicCbdcProblemDefinition, l6EconomicInterplanetaryProblemDefinition, l6EconomicSystems1ProblemDefinition, l6EconomicSystems2ProblemDefinition, l6EconomicSystems3ProblemDefinition, l6EconomicSystems4ProblemDefinition, l6EconomicSystems5ProblemDefinition, l6EconomicSystems6ProblemDefinition, l6EconomicSystems7ProblemDefinition, l6EconomicSystems8ProblemDefinition, l6EconomicSystems9ProblemDefinition, l6EconomicSystems10ProblemDefinition, l6EconomicSystems11ProblemDefinition, l6EconomicSystems12ProblemDefinition, l6EconomicSystems13ProblemDefinition, l6EconomicSystems14ProblemDefinition, l6EconomicSystems15ProblemDefinition, l6EconomicSystems16ProblemDefinition, l6EconomicSystems17ProblemDefinition } from './generated-all/economic-systemsAllProblems';
import { l6BioNeuralImplantProblemDefinition, l6BioDigitalTwinProblemDefinition, l6BioDigital1ProblemDefinition, l6BioDigital2ProblemDefinition, l6BioDigital3ProblemDefinition, l6BioDigital4ProblemDefinition, l6BioDigital5ProblemDefinition, l6BioDigital6ProblemDefinition, l6BioDigital7ProblemDefinition, l6BioDigital8ProblemDefinition, l6BioDigital9ProblemDefinition, l6BioDigital10ProblemDefinition, l6BioDigital11ProblemDefinition, l6BioDigital12ProblemDefinition, l6BioDigital13ProblemDefinition, l6BioDigital14ProblemDefinition, l6BioDigital15ProblemDefinition, l6BioDigital16ProblemDefinition, l6BioDigital17ProblemDefinition } from './generated-all/bio-digitalAllProblems';
import { l6ExistentialNuclearResilientProblemDefinition, l6ExistentialClimateAdaptationProblemDefinition, l6ExistentialPandemicResponseProblemDefinition, l6ExistentialAsteroidDefenseProblemDefinition, l6ExistentialInfrastructure1ProblemDefinition, l6ExistentialInfrastructure2ProblemDefinition, l6ExistentialInfrastructure3ProblemDefinition, l6ExistentialInfrastructure4ProblemDefinition, l6ExistentialInfrastructure5ProblemDefinition, l6ExistentialInfrastructure6ProblemDefinition, l6ExistentialInfrastructure7ProblemDefinition, l6ExistentialInfrastructure8ProblemDefinition, l6ExistentialInfrastructure9ProblemDefinition, l6ExistentialInfrastructure10ProblemDefinition, l6ExistentialInfrastructure11ProblemDefinition, l6ExistentialInfrastructure12ProblemDefinition, l6ExistentialInfrastructure13ProblemDefinition, l6ExistentialInfrastructure14ProblemDefinition, l6ExistentialInfrastructure15ProblemDefinition, l6ExistentialInfrastructure16ProblemDefinition, l6ExistentialInfrastructure17ProblemDefinition } from './generated-all/existential-infrastructureAllProblems';

// DDIA Gap Problems - Filling missing DDIA concepts
// DDIA Gap Problems - Removed (covered in comprehensive problems and DDIA lessons)
// import { batchProcessingMapreduceProblemDefinition, explicitShardingDesignProblemDefinition, transactionIsolationLevelsProblemDefinition, dataWarehouseOlapProblemDefinition, graphDatabaseSocialProblemDefinition } from './generated-all/ddiaGapProblems';

// NFR Teaching Problems - Converted to lessons (see src/apps/system-design/builder/data/lessons/nfr/)
// import { nfrTeachingIntroProblems } from './generated-all/nfrTeachingIntro';
// import { nfrTeachingChapter0Problems } from './generated-all/nfrTeachingChapter0';

// DDIA Teaching Problems - Concept-focused learning (151 total)
import { ddiaChapter1Problems } from './generated-all/ddiaTeachingChapter1';
// Chapters 2-4, 7-12: Converted to lessons (see src/apps/system-design/builder/data/lessons/ddia/)
import { ddiaReplicationProblems } from './generated-all/ddiaTeachingReplication';
import { ddiaPartitioningProblems } from './generated-all/ddiaTeachingPartitioning';
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
    // api-platform (19)
    l5ApiGatewayFacebookProblemDefinition,
    l5ApiGraphqlFederationProblemDefinition,
    l5ApiPlatform1ProblemDefinition,
    l5ApiPlatform2ProblemDefinition,
    l5ApiPlatform3ProblemDefinition,
    l5ApiPlatform4ProblemDefinition,
    l5ApiPlatform5ProblemDefinition,
    l5ApiPlatform6ProblemDefinition,
    l5ApiPlatform7ProblemDefinition,
    l5ApiPlatform8ProblemDefinition,
    l5ApiPlatform9ProblemDefinition,
    l5ApiPlatform10ProblemDefinition,
    l5ApiPlatform11ProblemDefinition,
    l5ApiPlatform12ProblemDefinition,
    l5ApiPlatform13ProblemDefinition,
    l5ApiPlatform14ProblemDefinition,
    l5ApiPlatform15ProblemDefinition,
    l5ApiPlatform16ProblemDefinition,
    l5ApiPlatform17ProblemDefinition,
    // multi-tenant (18)
    l5MultitenantSalesforceProblemDefinition,
    l5MultiTenant1ProblemDefinition,
    l5MultiTenant2ProblemDefinition,
    l5MultiTenant3ProblemDefinition,
    l5MultiTenant4ProblemDefinition,
    l5MultiTenant5ProblemDefinition,
    l5MultiTenant6ProblemDefinition,
    l5MultiTenant7ProblemDefinition,
    l5MultiTenant8ProblemDefinition,
    l5MultiTenant9ProblemDefinition,
    l5MultiTenant10ProblemDefinition,
    l5MultiTenant11ProblemDefinition,
    l5MultiTenant12ProblemDefinition,
    l5MultiTenant13ProblemDefinition,
    l5MultiTenant14ProblemDefinition,
    l5MultiTenant15ProblemDefinition,
    l5MultiTenant16ProblemDefinition,
    l5MultiTenant17ProblemDefinition,
    // data-platform (18)
    l5DataPlatformUberProblemDefinition,
    l5DataPlatform1ProblemDefinition,
    l5DataPlatform2ProblemDefinition,
    l5DataPlatform3ProblemDefinition,
    l5DataPlatform4ProblemDefinition,
    l5DataPlatform5ProblemDefinition,
    l5DataPlatform6ProblemDefinition,
    l5DataPlatform7ProblemDefinition,
    l5DataPlatform8ProblemDefinition,
    l5DataPlatform9ProblemDefinition,
    l5DataPlatform10ProblemDefinition,
    l5DataPlatform11ProblemDefinition,
    l5DataPlatform12ProblemDefinition,
    l5DataPlatform13ProblemDefinition,
    l5DataPlatform14ProblemDefinition,
    l5DataPlatform15ProblemDefinition,
    l5DataPlatform16ProblemDefinition,
    l5DataPlatform17ProblemDefinition,
    // developer-productivity (18)
    l5DevprodGoogleCiProblemDefinition,
    l5DeveloperProductivity1ProblemDefinition,
    l5DeveloperProductivity2ProblemDefinition,
    l5DeveloperProductivity3ProblemDefinition,
    l5DeveloperProductivity4ProblemDefinition,
    l5DeveloperProductivity5ProblemDefinition,
    l5DeveloperProductivity6ProblemDefinition,
    l5DeveloperProductivity7ProblemDefinition,
    l5DeveloperProductivity8ProblemDefinition,
    l5DeveloperProductivity9ProblemDefinition,
    l5DeveloperProductivity10ProblemDefinition,
    l5DeveloperProductivity11ProblemDefinition,
    l5DeveloperProductivity12ProblemDefinition,
    l5DeveloperProductivity13ProblemDefinition,
    l5DeveloperProductivity14ProblemDefinition,
    l5DeveloperProductivity15ProblemDefinition,
    l5DeveloperProductivity16ProblemDefinition,
    l5DeveloperProductivity17ProblemDefinition,
    // compliance-security (18)
    l5SecurityAppleEncryptionProblemDefinition,
    l5ComplianceSecurity1ProblemDefinition,
    l5ComplianceSecurity2ProblemDefinition,
    l5ComplianceSecurity3ProblemDefinition,
    l5ComplianceSecurity4ProblemDefinition,
    l5ComplianceSecurity5ProblemDefinition,
    l5ComplianceSecurity6ProblemDefinition,
    l5ComplianceSecurity7ProblemDefinition,
    l5ComplianceSecurity8ProblemDefinition,
    l5ComplianceSecurity9ProblemDefinition,
    l5ComplianceSecurity10ProblemDefinition,
    l5ComplianceSecurity11ProblemDefinition,
    l5ComplianceSecurity12ProblemDefinition,
    l5ComplianceSecurity13ProblemDefinition,
    l5ComplianceSecurity14ProblemDefinition,
    l5ComplianceSecurity15ProblemDefinition,
    l5ComplianceSecurity16ProblemDefinition,
    l5ComplianceSecurity17ProblemDefinition,
    // observability (18)
    l5ObservabilityDatadogProblemDefinition,
    l5Observability1ProblemDefinition,
    l5Observability2ProblemDefinition,
    l5Observability3ProblemDefinition,
    l5Observability4ProblemDefinition,
    l5Observability5ProblemDefinition,
    l5Observability6ProblemDefinition,
    l5Observability7ProblemDefinition,
    l5Observability8ProblemDefinition,
    l5Observability9ProblemDefinition,
    l5Observability10ProblemDefinition,
    l5Observability11ProblemDefinition,
    l5Observability12ProblemDefinition,
    l5Observability13ProblemDefinition,
    l5Observability14ProblemDefinition,
    l5Observability15ProblemDefinition,
    l5Observability16ProblemDefinition,
    l5Observability17ProblemDefinition,
    // infrastructure (18)
    l5InfraKubernetesPlatformProblemDefinition,
    l5Infrastructure1ProblemDefinition,
    l5Infrastructure2ProblemDefinition,
    l5Infrastructure3ProblemDefinition,
    l5Infrastructure4ProblemDefinition,
    l5Infrastructure5ProblemDefinition,
    l5Infrastructure6ProblemDefinition,
    l5Infrastructure7ProblemDefinition,
    l5Infrastructure8ProblemDefinition,
    l5Infrastructure9ProblemDefinition,
    l5Infrastructure10ProblemDefinition,
    l5Infrastructure11ProblemDefinition,
    l5Infrastructure12ProblemDefinition,
    l5Infrastructure13ProblemDefinition,
    l5Infrastructure14ProblemDefinition,
    l5Infrastructure15ProblemDefinition,
    l5Infrastructure16ProblemDefinition,
    l5Infrastructure17ProblemDefinition,
    // ml-platform (18)
    l5MlPlatformMetaProblemDefinition,
    l5MlPlatform1ProblemDefinition,
    l5MlPlatform2ProblemDefinition,
    l5MlPlatform3ProblemDefinition,
    l5MlPlatform4ProblemDefinition,
    l5MlPlatform5ProblemDefinition,
    l5MlPlatform6ProblemDefinition,
    l5MlPlatform7ProblemDefinition,
    l5MlPlatform8ProblemDefinition,
    l5MlPlatform9ProblemDefinition,
    l5MlPlatform10ProblemDefinition,
    l5MlPlatform11ProblemDefinition,
    l5MlPlatform12ProblemDefinition,
    l5MlPlatform13ProblemDefinition,
    l5MlPlatform14ProblemDefinition,
    l5MlPlatform15ProblemDefinition,
    l5MlPlatform16ProblemDefinition,
    l5MlPlatform17ProblemDefinition,
    // cross-regional (18)
    l5RegionalTiktokPlatformProblemDefinition,
    l5CrossRegional1ProblemDefinition,
    l5CrossRegional2ProblemDefinition,
    l5CrossRegional3ProblemDefinition,
    l5CrossRegional4ProblemDefinition,
    l5CrossRegional5ProblemDefinition,
    l5CrossRegional6ProblemDefinition,
    l5CrossRegional7ProblemDefinition,
    l5CrossRegional8ProblemDefinition,
    l5CrossRegional9ProblemDefinition,
    l5CrossRegional10ProblemDefinition,
    l5CrossRegional11ProblemDefinition,
    l5CrossRegional12ProblemDefinition,
    l5CrossRegional13ProblemDefinition,
    l5CrossRegional14ProblemDefinition,
    l5CrossRegional15ProblemDefinition,
    l5CrossRegional16ProblemDefinition,
    l5CrossRegional17ProblemDefinition,
    // next-gen-protocols (22)
    l6ProtocolQuantumInternetProblemDefinition,
    l6ProtocolInterplanetaryProblemDefinition,
    l6Protocol6gArchitectureProblemDefinition,
    l6ProtocolTcpReplacementProblemDefinition,
    l6NextGenProtocols1ProblemDefinition,
    l6NextGenProtocols2ProblemDefinition,
    l6NextGenProtocols3ProblemDefinition,
    l6NextGenProtocols4ProblemDefinition,
    l6NextGenProtocols5ProblemDefinition,
    l6NextGenProtocols6ProblemDefinition,
    l6NextGenProtocols7ProblemDefinition,
    l6NextGenProtocols8ProblemDefinition,
    l6NextGenProtocols9ProblemDefinition,
    l6NextGenProtocols10ProblemDefinition,
    l6NextGenProtocols11ProblemDefinition,
    l6NextGenProtocols12ProblemDefinition,
    l6NextGenProtocols13ProblemDefinition,
    l6NextGenProtocols14ProblemDefinition,
    l6NextGenProtocols15ProblemDefinition,
    l6NextGenProtocols16ProblemDefinition,
    l6NextGenProtocols17ProblemDefinition,
    l6NextGenProtocols18ProblemDefinition,
    // novel-databases (22)
    l6DbQuantumResistantProblemDefinition,
    l6DbDnaStorageProblemDefinition,
    l6DbNeuromorphicProblemDefinition,
    l6DbCapTheoremBreakerProblemDefinition,
    l6NovelDatabases1ProblemDefinition,
    l6NovelDatabases2ProblemDefinition,
    l6NovelDatabases3ProblemDefinition,
    l6NovelDatabases4ProblemDefinition,
    l6NovelDatabases5ProblemDefinition,
    l6NovelDatabases6ProblemDefinition,
    l6NovelDatabases7ProblemDefinition,
    l6NovelDatabases8ProblemDefinition,
    l6NovelDatabases9ProblemDefinition,
    l6NovelDatabases10ProblemDefinition,
    l6NovelDatabases11ProblemDefinition,
    l6NovelDatabases12ProblemDefinition,
    l6NovelDatabases13ProblemDefinition,
    l6NovelDatabases14ProblemDefinition,
    l6NovelDatabases15ProblemDefinition,
    l6NovelDatabases16ProblemDefinition,
    l6NovelDatabases17ProblemDefinition,
    l6NovelDatabases18ProblemDefinition,
    // ai-infrastructure (21)
    l6AiAgiTrainingProblemDefinition,
    l6AiBrainComputerProblemDefinition,
    l6AiConsciousArchitectureProblemDefinition,
    l6AiInfrastructure1ProblemDefinition,
    l6AiInfrastructure2ProblemDefinition,
    l6AiInfrastructure3ProblemDefinition,
    l6AiInfrastructure4ProblemDefinition,
    l6AiInfrastructure5ProblemDefinition,
    l6AiInfrastructure6ProblemDefinition,
    l6AiInfrastructure7ProblemDefinition,
    l6AiInfrastructure8ProblemDefinition,
    l6AiInfrastructure9ProblemDefinition,
    l6AiInfrastructure10ProblemDefinition,
    l6AiInfrastructure11ProblemDefinition,
    l6AiInfrastructure12ProblemDefinition,
    l6AiInfrastructure13ProblemDefinition,
    l6AiInfrastructure14ProblemDefinition,
    l6AiInfrastructure15ProblemDefinition,
    l6AiInfrastructure16ProblemDefinition,
    l6AiInfrastructure17ProblemDefinition,
    l6AiInfrastructure18ProblemDefinition,
    // distributed-consensus (19)
    l6ConsensusPlanetaryProblemDefinition,
    l6ConsensusMillionNodesProblemDefinition,
    l6DistributedConsensus1ProblemDefinition,
    l6DistributedConsensus2ProblemDefinition,
    l6DistributedConsensus3ProblemDefinition,
    l6DistributedConsensus4ProblemDefinition,
    l6DistributedConsensus5ProblemDefinition,
    l6DistributedConsensus6ProblemDefinition,
    l6DistributedConsensus7ProblemDefinition,
    l6DistributedConsensus8ProblemDefinition,
    l6DistributedConsensus9ProblemDefinition,
    l6DistributedConsensus10ProblemDefinition,
    l6DistributedConsensus11ProblemDefinition,
    l6DistributedConsensus12ProblemDefinition,
    l6DistributedConsensus13ProblemDefinition,
    l6DistributedConsensus14ProblemDefinition,
    l6DistributedConsensus15ProblemDefinition,
    l6DistributedConsensus16ProblemDefinition,
    l6DistributedConsensus17ProblemDefinition,
    // new-computing (19)
    l6ComputeQuantumCloudProblemDefinition,
    l6ComputeBiologicalProblemDefinition,
    l6NewComputing1ProblemDefinition,
    l6NewComputing2ProblemDefinition,
    l6NewComputing3ProblemDefinition,
    l6NewComputing4ProblemDefinition,
    l6NewComputing5ProblemDefinition,
    l6NewComputing6ProblemDefinition,
    l6NewComputing7ProblemDefinition,
    l6NewComputing8ProblemDefinition,
    l6NewComputing9ProblemDefinition,
    l6NewComputing10ProblemDefinition,
    l6NewComputing11ProblemDefinition,
    l6NewComputing12ProblemDefinition,
    l6NewComputing13ProblemDefinition,
    l6NewComputing14ProblemDefinition,
    l6NewComputing15ProblemDefinition,
    l6NewComputing16ProblemDefinition,
    l6NewComputing17ProblemDefinition,
    // energy-sustainability (19)
    l6EnergyCarbonNegativeProblemDefinition,
    l6EnergyOceanPoweredProblemDefinition,
    l6EnergySustainability1ProblemDefinition,
    l6EnergySustainability2ProblemDefinition,
    l6EnergySustainability3ProblemDefinition,
    l6EnergySustainability4ProblemDefinition,
    l6EnergySustainability5ProblemDefinition,
    l6EnergySustainability6ProblemDefinition,
    l6EnergySustainability7ProblemDefinition,
    l6EnergySustainability8ProblemDefinition,
    l6EnergySustainability9ProblemDefinition,
    l6EnergySustainability10ProblemDefinition,
    l6EnergySustainability11ProblemDefinition,
    l6EnergySustainability12ProblemDefinition,
    l6EnergySustainability13ProblemDefinition,
    l6EnergySustainability14ProblemDefinition,
    l6EnergySustainability15ProblemDefinition,
    l6EnergySustainability16ProblemDefinition,
    l6EnergySustainability17ProblemDefinition,
    // privacy-innovation (19)
    l6PrivacyHomomorphicScaleProblemDefinition,
    l6PrivacyZkpInternetProblemDefinition,
    l6PrivacyInnovation1ProblemDefinition,
    l6PrivacyInnovation2ProblemDefinition,
    l6PrivacyInnovation3ProblemDefinition,
    l6PrivacyInnovation4ProblemDefinition,
    l6PrivacyInnovation5ProblemDefinition,
    l6PrivacyInnovation6ProblemDefinition,
    l6PrivacyInnovation7ProblemDefinition,
    l6PrivacyInnovation8ProblemDefinition,
    l6PrivacyInnovation9ProblemDefinition,
    l6PrivacyInnovation10ProblemDefinition,
    l6PrivacyInnovation11ProblemDefinition,
    l6PrivacyInnovation12ProblemDefinition,
    l6PrivacyInnovation13ProblemDefinition,
    l6PrivacyInnovation14ProblemDefinition,
    l6PrivacyInnovation15ProblemDefinition,
    l6PrivacyInnovation16ProblemDefinition,
    l6PrivacyInnovation17ProblemDefinition,
    // economic-systems (19)
    l6EconomicCbdcProblemDefinition,
    l6EconomicInterplanetaryProblemDefinition,
    l6EconomicSystems1ProblemDefinition,
    l6EconomicSystems2ProblemDefinition,
    l6EconomicSystems3ProblemDefinition,
    l6EconomicSystems4ProblemDefinition,
    l6EconomicSystems5ProblemDefinition,
    l6EconomicSystems6ProblemDefinition,
    l6EconomicSystems7ProblemDefinition,
    l6EconomicSystems8ProblemDefinition,
    l6EconomicSystems9ProblemDefinition,
    l6EconomicSystems10ProblemDefinition,
    l6EconomicSystems11ProblemDefinition,
    l6EconomicSystems12ProblemDefinition,
    l6EconomicSystems13ProblemDefinition,
    l6EconomicSystems14ProblemDefinition,
    l6EconomicSystems15ProblemDefinition,
    l6EconomicSystems16ProblemDefinition,
    l6EconomicSystems17ProblemDefinition,
    // bio-digital (19)
    l6BioNeuralImplantProblemDefinition,
    l6BioDigitalTwinProblemDefinition,
    l6BioDigital1ProblemDefinition,
    l6BioDigital2ProblemDefinition,
    l6BioDigital3ProblemDefinition,
    l6BioDigital4ProblemDefinition,
    l6BioDigital5ProblemDefinition,
    l6BioDigital6ProblemDefinition,
    l6BioDigital7ProblemDefinition,
    l6BioDigital8ProblemDefinition,
    l6BioDigital9ProblemDefinition,
    l6BioDigital10ProblemDefinition,
    l6BioDigital11ProblemDefinition,
    l6BioDigital12ProblemDefinition,
    l6BioDigital13ProblemDefinition,
    l6BioDigital14ProblemDefinition,
    l6BioDigital15ProblemDefinition,
    l6BioDigital16ProblemDefinition,
    l6BioDigital17ProblemDefinition,
    // existential-infrastructure (21)
    l6ExistentialNuclearResilientProblemDefinition,
    l6ExistentialClimateAdaptationProblemDefinition,
    l6ExistentialPandemicResponseProblemDefinition,
    l6ExistentialAsteroidDefenseProblemDefinition,
    l6ExistentialInfrastructure1ProblemDefinition,
    l6ExistentialInfrastructure2ProblemDefinition,
    l6ExistentialInfrastructure3ProblemDefinition,
    l6ExistentialInfrastructure4ProblemDefinition,
    l6ExistentialInfrastructure5ProblemDefinition,
    l6ExistentialInfrastructure6ProblemDefinition,
    l6ExistentialInfrastructure7ProblemDefinition,
    l6ExistentialInfrastructure8ProblemDefinition,
    l6ExistentialInfrastructure9ProblemDefinition,
    l6ExistentialInfrastructure10ProblemDefinition,
    l6ExistentialInfrastructure11ProblemDefinition,
    l6ExistentialInfrastructure12ProblemDefinition,
    l6ExistentialInfrastructure13ProblemDefinition,
    l6ExistentialInfrastructure14ProblemDefinition,
    l6ExistentialInfrastructure15ProblemDefinition,
    l6ExistentialInfrastructure16ProblemDefinition,
    l6ExistentialInfrastructure17ProblemDefinition,
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
