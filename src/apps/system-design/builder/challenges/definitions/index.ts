/**
 * All 313 System Design Challenge Definitions (40 original + 41 extracted + 232 generated)
 *
 * Each challenge has ONLY Level 1: "The Brute Force Test - Does It Even Work?"
 * Focus: Verify connectivity (Client → App → Database path exists)
 * No performance optimization, just basic connectivity
 */

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

// Extracted Problems - Tutorials (3)
export { tutorialSimpleBlogProblemDefinition } from './tutorialSimpleBlog';
export { tutorialImageHostingProblemDefinition } from './tutorialImageHosting';
export { tutorialRealtimeChatProblemDefinition } from './tutorialRealtimeChat';

// Extracted Problems - Caching (16)
export { redditCommentSystemProblemDefinition } from './redditCommentSystem';
export { staticContentCdnProblemDefinition } from './staticContentCdn';
export { sessionStoreBasicProblemDefinition, databaseQueryCacheProblemDefinition, apiRateLimitCacheProblemDefinition, productCatalogCacheProblemDefinition } from './cachingProblems';
export { gamingLeaderboardCacheProblemDefinition, geoLocationCacheProblemDefinition, configCacheBasicProblemDefinition, socialFeedCacheProblemDefinition, videoStreamingCacheProblemDefinition, searchSuggestionCacheProblemDefinition, newsAggregatorCacheProblemDefinition, graphqlCacheProblemDefinition, shoppingCartCacheProblemDefinition, analyticsDashboardCacheProblemDefinition } from './cachingProblemsExtended';

// Extracted Problems - Streaming (5)
export { basicMessageQueueProblemDefinition } from './basicMessageQueue';
export { realtimeNotificationsProblemDefinition, basicEventLogProblemDefinition, simplePubsubProblemDefinition, realtimeChatMessagesProblemDefinition } from './streamingProblems';

// Extracted Problems - Storage (5)
export { basicDatabaseDesignProblemDefinition } from './basicDatabaseDesign';
export { nosqlBasicsProblemDefinition, keyValueStoreProblemDefinition, productCatalogProblemDefinition, objectStorageSystemProblemDefinition } from './storageProblems';

// Extracted Problems - Gateway (4)
export { basicApiGatewayProblemDefinition, simpleRateLimiterProblemDefinition, authenticationGatewayProblemDefinition, graphqlGatewayProblemDefinition } from './gatewayProblems';

// Extracted Problems - Search (4)
export { basicTextSearchProblemDefinition, autocompleteSearchProblemDefinition, facetedSearchProblemDefinition, geoSearchProblemDefinition } from './searchProblems';

// Extracted Problems - Multiregion (4)
export { basicMultiRegionProblemDefinition, activeActiveRegionsProblemDefinition, globalCdnProblemDefinition, crossRegionDrProblemDefinition } from './multiregionProblems';

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
import { tutorialSimpleBlogProblemDefinition } from './tutorialSimpleBlog';
import { tutorialImageHostingProblemDefinition } from './tutorialImageHosting';
import { tutorialRealtimeChatProblemDefinition } from './tutorialRealtimeChat';
import { redditCommentSystemProblemDefinition } from './redditCommentSystem';
import { staticContentCdnProblemDefinition } from './staticContentCdn';
import { basicMessageQueueProblemDefinition } from './basicMessageQueue';
import { basicDatabaseDesignProblemDefinition } from './basicDatabaseDesign';
import { sessionStoreBasicProblemDefinition, databaseQueryCacheProblemDefinition, apiRateLimitCacheProblemDefinition, productCatalogCacheProblemDefinition } from './cachingProblems';
import { gamingLeaderboardCacheProblemDefinition, geoLocationCacheProblemDefinition, configCacheBasicProblemDefinition, socialFeedCacheProblemDefinition, videoStreamingCacheProblemDefinition, searchSuggestionCacheProblemDefinition, newsAggregatorCacheProblemDefinition, graphqlCacheProblemDefinition, shoppingCartCacheProblemDefinition, analyticsDashboardCacheProblemDefinition } from './cachingProblemsExtended';
import { realtimeNotificationsProblemDefinition, basicEventLogProblemDefinition, simplePubsubProblemDefinition, realtimeChatMessagesProblemDefinition } from './streamingProblems';
import { nosqlBasicsProblemDefinition, keyValueStoreProblemDefinition, productCatalogProblemDefinition, objectStorageSystemProblemDefinition } from './storageProblems';
import { basicApiGatewayProblemDefinition, simpleRateLimiterProblemDefinition, authenticationGatewayProblemDefinition, graphqlGatewayProblemDefinition } from './gatewayProblems';
import { basicTextSearchProblemDefinition, autocompleteSearchProblemDefinition, facetedSearchProblemDefinition, geoSearchProblemDefinition } from './searchProblems';
import { basicMultiRegionProblemDefinition, activeActiveRegionsProblemDefinition, globalCdnProblemDefinition, crossRegionDrProblemDefinition } from './multiregionProblems';

// Generated Problems (232 total)
import { multiTenantSaasCacheProblemDefinition, cmsCacheProblemDefinition, authTokenCacheProblemDefinition, pricingEngineCacheProblemDefinition, recommendationEngineCacheProblemDefinition, rtbAdCacheProblemDefinition, gamingMatchmakingCacheProblemDefinition, iotDeviceCacheProblemDefinition, globalInventoryCacheProblemDefinition, hybridCdnCacheProblemDefinition, globalInventoryMasteryProblemDefinition, financialTradingCacheProblemDefinition, gameAssetCdnMasteryProblemDefinition, sportsBettingCacheProblemDefinition, autonomousVehicleCacheProblemDefinition, stockMarketDataCacheProblemDefinition, multiRegionSocialCacheProblemDefinition, healthcareRecordsCacheProblemDefinition, supplyChainCacheProblemDefinition } from './generated/cachingProblemsGenerated';
import { clickstreamAnalyticsProblemDefinition, serverLogAggregationProblemDefinition, sensorDataCollectionProblemDefinition, emailQueueSystemProblemDefinition, eventSourcingBasicProblemDefinition, orderProcessingStreamProblemDefinition, paymentTransactionLogProblemDefinition, stockPriceUpdatesProblemDefinition, socialMediaFeedProblemDefinition, videoUploadPipelineProblemDefinition, fraudDetectionStreamProblemDefinition, userActivityTrackingProblemDefinition, iotTelemetryAggregationProblemDefinition, gameEventProcessingProblemDefinition, deliveryTrackingUpdatesProblemDefinition, notificationFanoutProblemDefinition, contentModerationQueueProblemDefinition, searchIndexUpdatesProblemDefinition, recommendationPipelineProblemDefinition, auditLogStreamingProblemDefinition, kafkaStreamingPipelineProblemDefinition, exactlyOncePaymentProblemDefinition, globalEventSourcingSystemProblemDefinition, multiDcStreamReplicationProblemDefinition, realtimeMlFeatureStoreProblemDefinition, gdprCompliantStreamingProblemDefinition, financialSettlementStreamProblemDefinition, autonomousVehicleTelemetryProblemDefinition, healthcareDataStreamHipaaProblemDefinition, globalCdcPipelineProblemDefinition } from './generated/streamingProblemsGenerated';
import { sessionStoreProblemDefinition, fileMetadataStoreProblemDefinition, configManagementProblemDefinition, ecommerceOrderDbProblemDefinition, socialGraphDbProblemDefinition, analyticsWarehouseProblemDefinition, multiTenantSaasProblemDefinition, inventoryManagementProblemDefinition, cmsMediaStorageProblemDefinition, bankingTransactionDbProblemDefinition, healthcareRecordsProblemDefinition, iotTimeSeriesProblemDefinition, gamingLeaderboardProblemDefinition, bookingReservationProblemDefinition, auditTrailProblemDefinition, searchIndexStorageProblemDefinition, mlModelRegistryProblemDefinition, rateLimitCountersProblemDefinition, distributedDatabaseProblemDefinition, contentDeliveryStorageProblemDefinition, multiModelDatabaseProblemDefinition, distributedTransactionsProblemDefinition, multiMasterReplicationProblemDefinition, globalInventoryStrongProblemDefinition, financialLedgerProblemDefinition, blockchainStateDbProblemDefinition, realtimeGamingStateProblemDefinition, autonomousVehicleMapProblemDefinition, petabyteDataLakeProblemDefinition, blockStorageProblemDefinition } from './generated/storageProblemsGenerated';
import { requestTransformGatewayProblemDefinition, corsGatewayProblemDefinition, retryGatewayProblemDefinition, compressionGatewayProblemDefinition, loggingGatewayProblemDefinition, healthCheckGatewayProblemDefinition, apiRoutingGatewayProblemDefinition, responseTransformGatewayProblemDefinition, apiAggregationGatewayProblemDefinition, graphqlGatewayProblemDefinition, oauth2GatewayProblemDefinition, websocketGatewayProblemDefinition, grpcGatewayProblemDefinition, mobileGatewayProblemDefinition, partnerGatewayProblemDefinition, webhookGatewayProblemDefinition, serverlessGatewayProblemDefinition, multiProtocolGatewayProblemDefinition, versioningGatewayProblemDefinition, quotaGatewayProblemDefinition, monetizationGatewayProblemDefinition, zeroTrustGatewayProblemDefinition, mlModelGatewayProblemDefinition, fraudDetectionGatewayProblemDefinition, hftGatewayProblemDefinition, iotGatewayProblemDefinition, blockchainGatewayProblemDefinition, globalTrafficGatewayProblemDefinition, edgeComputeGatewayProblemDefinition, apiCachingGatewayProblemDefinition, serviceDiscoveryGatewayProblemDefinition } from './generated/gatewayProblemsGenerated';
import { fuzzySearchProblemDefinition, synonymSearchProblemDefinition, highlightSearchProblemDefinition, boostingSearchProblemDefinition, productDiscoveryProblemDefinition, searchSuggestionsProblemDefinition, ecommerceSearchProblemDefinition, multilingualSearchProblemDefinition, searchAnalyticsProblemDefinition, personalizedSearchProblemDefinition, voiceSearchProblemDefinition, imageSearchProblemDefinition, realtimeIndexingProblemDefinition, federatedSearchProblemDefinition, logSearchProblemDefinition, codeSearchProblemDefinition, hybridSearchProblemDefinition, videoSearchProblemDefinition, securityEventSearchProblemDefinition, medicalRecordSearchProblemDefinition, socialMediaSearchProblemDefinition, semanticSearchPlatformProblemDefinition, jobSearchProblemDefinition, travelSearchProblemDefinition, academicPaperSearchProblemDefinition, recipeSearchProblemDefinition, legalDocSearchProblemDefinition, newsSearchProblemDefinition, musicSearchProblemDefinition, appStoreSearchProblemDefinition, documentCollabSearchProblemDefinition } from './generated/searchProblemsGenerated';
import { distributedSessionStoreProblemDefinition, multiregionBackupProblemDefinition, globalDnsProblemDefinition, globalIpAnycastProblemDefinition, geofencedFeaturesProblemDefinition, partialRegionFailureProblemDefinition, globalSocialNetworkProblemDefinition, crossRegionFailoverProblemDefinition, geoPinningProblemDefinition, multiregionStreamingProblemDefinition, latencyBasedRoutingProblemDefinition, multiregionSearchProblemDefinition, crossRegionAnalyticsProblemDefinition, multiregionCacheProblemDefinition, globalContentDeliveryProblemDefinition, edgeComputingProblemDefinition, multiregionQueueProblemDefinition, regionalShardingProblemDefinition, crossRegionObservabilityProblemDefinition, regionalQuotaEnforcementProblemDefinition, crossRegionSecretsProblemDefinition, planetScaleDatabaseProblemDefinition, conflictResolutionProblemDefinition, globalRateLimitingProblemDefinition, readYourWritesProblemDefinition, regionalComplianceProblemDefinition, crossRegionMigrationProblemDefinition, timeSynchronizationProblemDefinition, globalLeaderElectionProblemDefinition, multiregionCrdtProblemDefinition, multiregionOrchestrationProblemDefinition } from './generated/multiregionProblemsGenerated';
import { tutorialSimpleBlogProblemDefinition as tutorialSimpleBlogGeneratedProblemDefinition, tutorialIntermediateImagesProblemDefinition, tutorialAdvancedChatProblemDefinition as tutorialAdvancedChatGeneratedProblemDefinition, boeWalkthroughChatProblemDefinition } from './generated/tutorialProblemsGenerated';
import { l6AiAgiTrainingProblemDefinition, l6AiBrainComputerProblemDefinition, l6AiConsciousArchitectureProblemDefinition } from './generated/ai-infrastructureProblemsGenerated';
import { l5ApiGatewayFacebookProblemDefinition, l5ApiGraphqlFederationProblemDefinition } from './generated/api-platformProblemsGenerated';
import { l6BioNeuralImplantProblemDefinition, l6BioDigitalTwinProblemDefinition } from './generated/bio-digitalProblemsGenerated';
import { l5SecurityAppleEncryptionProblemDefinition } from './generated/compliance-securityProblemsGenerated';
import { l5RegionalTiktokPlatformProblemDefinition } from './generated/cross-regionalProblemsGenerated';
import { l5DataPlatformUberProblemDefinition } from './generated/data-platformProblemsGenerated';
import { l5DevprodGoogleCiProblemDefinition } from './generated/developer-productivityProblemsGenerated';
import { l6ConsensusPlanetaryProblemDefinition, l6ConsensusMillionNodesProblemDefinition } from './generated/distributed-consensusProblemsGenerated';
import { l6EconomicCbdcProblemDefinition, l6EconomicInterplanetaryProblemDefinition } from './generated/economic-systemsProblemsGenerated';
import { l6EnergyCarbonNegativeProblemDefinition, l6EnergyOceanPoweredProblemDefinition } from './generated/energy-sustainabilityProblemsGenerated';
import { l6ExistentialNuclearResilientProblemDefinition, l6ExistentialClimateAdaptationProblemDefinition, l6ExistentialPandemicResponseProblemDefinition, l6ExistentialAsteroidDefenseProblemDefinition } from './generated/existential-infrastructureProblemsGenerated';
import { l5InfraKubernetesPlatformProblemDefinition } from './generated/infrastructureProblemsGenerated';
import { l5MlPlatformMetaProblemDefinition } from './generated/ml-platformProblemsGenerated';
import { l5MultitenantSalesforceProblemDefinition } from './generated/multi-tenantProblemsGenerated';
import { l6ComputeQuantumCloudProblemDefinition, l6ComputeBiologicalProblemDefinition } from './generated/new-computingProblemsGenerated';
import { l6ProtocolQuantumInternetProblemDefinition, l6ProtocolInterplanetaryProblemDefinition, l6Protocol6gArchitectureProblemDefinition, l6ProtocolTcpReplacementProblemDefinition } from './generated/next-gen-protocolsProblemsGenerated';
import { l6DbQuantumResistantProblemDefinition, l6DbDnaStorageProblemDefinition, l6DbNeuromorphicProblemDefinition, l6DbCapTheoremBreakerProblemDefinition } from './generated/novel-databasesProblemsGenerated';
import { l5ObservabilityDatadogProblemDefinition } from './generated/observabilityProblemsGenerated';
import { l5MigrationNetflixMicroservicesProblemDefinition, l5MigrationTwitterEventDrivenProblemDefinition, l5MigrationSpotifyServerlessProblemDefinition, l5MigrationUberMultiRegionProblemDefinition, l5MigrationAirbnbGraphqlProblemDefinition, l5MigrationStripeDatabaseProblemDefinition, l5MigrationSlackWebsocketProblemDefinition, l5MigrationGithubMonorepoProblemDefinition, l5MigrationInstagramCassandraProblemDefinition, l5MigrationDoordashRoutingProblemDefinition, l5MigrationZoomWebrtcProblemDefinition, l5MigrationPinterestRecommendationProblemDefinition, l5MigrationLinkedinKafkaProblemDefinition, l5MigrationRedditPostgresProblemDefinition, l5MigrationSnapchatStorageProblemDefinition, l5MigrationShopifyMultiCloudProblemDefinition, l5MigrationTwitchLowLatencyProblemDefinition, l5MigrationCoinbaseMatchingProblemDefinition, l5MigrationFigmaCollaborationProblemDefinition } from './generated/platform-migrationProblemsGenerated';
import { l6PrivacyHomomorphicScaleProblemDefinition, l6PrivacyZkpInternetProblemDefinition } from './generated/privacy-innovationProblemsGenerated';

export const allProblemDefinitions: ProblemDefinition[] = [
  // Social Media (10)
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

  // E-commerce & Services (5)
  amazonProblemDefinition,
  shopifyProblemDefinition,
  stripeProblemDefinition,
  uberProblemDefinition,
  airbnbProblemDefinition,

  // Streaming & Media (5)
  netflixProblemDefinition,
  spotifyProblemDefinition,
  youtubeProblemDefinition,
  twitchProblemDefinition,
  huluProblemDefinition,

  // Messaging (4)
  whatsappProblemDefinition,
  slackProblemDefinition,
  telegramProblemDefinition,
  messengerProblemDefinition,

  // Infrastructure (5)
  pastebinProblemDefinition,
  dropboxProblemDefinition,
  googledriveProblemDefinition,
  githubProblemDefinition,
  stackoverflowProblemDefinition,

  // Food & Delivery (3)
  doordashProblemDefinition,
  instacartProblemDefinition,
  yelpProblemDefinition,

  // Productivity (4)
  notionProblemDefinition,
  trelloProblemDefinition,
  googlecalendarProblemDefinition,
  zoomProblemDefinition,

  // Gaming & Other (4)
  steamProblemDefinition,
  ticketmasterProblemDefinition,
  bookingcomProblemDefinition,
  weatherapiProblemDefinition,

  // Extracted Problems (41 total)
  // Tutorials (3)
  tutorialSimpleBlogProblemDefinition,
  tutorialImageHostingProblemDefinition,
  tutorialRealtimeChatProblemDefinition,
  // Caching (16)
  redditCommentSystemProblemDefinition,
  staticContentCdnProblemDefinition,
  sessionStoreBasicProblemDefinition,
  databaseQueryCacheProblemDefinition,
  apiRateLimitCacheProblemDefinition,
  productCatalogCacheProblemDefinition,
  gamingLeaderboardCacheProblemDefinition,
  geoLocationCacheProblemDefinition,
  configCacheBasicProblemDefinition,
  socialFeedCacheProblemDefinition,
  videoStreamingCacheProblemDefinition,
  searchSuggestionCacheProblemDefinition,
  newsAggregatorCacheProblemDefinition,
  graphqlCacheProblemDefinition,
  shoppingCartCacheProblemDefinition,
  analyticsDashboardCacheProblemDefinition,
  // Streaming (5)
  basicMessageQueueProblemDefinition,
  realtimeNotificationsProblemDefinition,
  basicEventLogProblemDefinition,
  simplePubsubProblemDefinition,
  realtimeChatMessagesProblemDefinition,
  // Storage (5)
  basicDatabaseDesignProblemDefinition,
  nosqlBasicsProblemDefinition,
  keyValueStoreProblemDefinition,
  productCatalogProblemDefinition,
  objectStorageSystemProblemDefinition,
  // Gateway (4)
  basicApiGatewayProblemDefinition,
  simpleRateLimiterProblemDefinition,
  authenticationGatewayProblemDefinition,
  graphqlGatewayProblemDefinition,
  // Search (4)
  basicTextSearchProblemDefinition,
  autocompleteSearchProblemDefinition,
  facetedSearchProblemDefinition,
  geoSearchProblemDefinition,
  // Multiregion (4)
  basicMultiRegionProblemDefinition,
  activeActiveRegionsProblemDefinition,
  globalCdnProblemDefinition,
  crossRegionDrProblemDefinition,
];
