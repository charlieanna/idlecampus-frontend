/**
 * All 40 System Design Challenge Definitions
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

// Extracted Problems - Caching (6)
export { redditCommentSystemProblemDefinition } from './redditCommentSystem';
export { staticContentCdnProblemDefinition } from './staticContentCdn';
export { sessionStoreBasicProblemDefinition, databaseQueryCacheProblemDefinition, apiRateLimitCacheProblemDefinition, productCatalogCacheProblemDefinition } from './cachingProblems';

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
import { realtimeNotificationsProblemDefinition, basicEventLogProblemDefinition, simplePubsubProblemDefinition, realtimeChatMessagesProblemDefinition } from './streamingProblems';
import { nosqlBasicsProblemDefinition, keyValueStoreProblemDefinition, productCatalogProblemDefinition, objectStorageSystemProblemDefinition } from './storageProblems';
import { basicApiGatewayProblemDefinition, simpleRateLimiterProblemDefinition, authenticationGatewayProblemDefinition, graphqlGatewayProblemDefinition } from './gatewayProblems';
import { basicTextSearchProblemDefinition, autocompleteSearchProblemDefinition, facetedSearchProblemDefinition, geoSearchProblemDefinition } from './searchProblems';
import { basicMultiRegionProblemDefinition, activeActiveRegionsProblemDefinition, globalCdnProblemDefinition, crossRegionDrProblemDefinition } from './multiregionProblems';

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

  // Extracted Problems (31 total)
  // Tutorials (3)
  tutorialSimpleBlogProblemDefinition,
  tutorialImageHostingProblemDefinition,
  tutorialRealtimeChatProblemDefinition,
  // Caching (6)
  redditCommentSystemProblemDefinition,
  staticContentCdnProblemDefinition,
  sessionStoreBasicProblemDefinition,
  databaseQueryCacheProblemDefinition,
  apiRateLimitCacheProblemDefinition,
  productCatalogCacheProblemDefinition,
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
