#!/usr/bin/env node
/**
 * Complete integration of all 618 generated problems into index.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const indexPath = join(__dirname, '../src/apps/system-design/builder/challenges/definitions/index.ts');
const instructionsPath = join(__dirname, '../src/apps/system-design/builder/challenges/definitions/generated-all/INTEGRATION_INSTRUCTIONS.md');

console.log('📖 Reading files...');
const currentIndex = readFileSync(indexPath, 'utf-8');
const instructions = readFileSync(instructionsPath, 'utf-8');

// Extract the generated imports (Step 1)
const importsSection = instructions.match(/## Step 1: Add Imports to index\.ts\s+```typescript\s+([\s\S]+?)```/)?.[1] || '';
const generatedImportLines = importsSection.split('\n').filter(l => l.trim() && l.trim().startsWith('import'));

// Extract the generated exports (Step 2)
const exportsSection = instructions.match(/## Step 2: Add Exports to index\.ts\s+```typescript\s+([\s\S]+?)```/)?.[1] || '';
const generatedExportLines = exportsSection.split('\n').filter(l => l.trim() && l.trim().startsWith('export'));

// Extract array entries (Step 3)
const arraySection = instructions.match(/## Step 3: Add to allProblemDefinitions Array\s+```typescript\s+([\s\S]+?)```/)?.[1] || '';
const generatedArrayLines = arraySection.split('\n').filter(l => l.trim());

console.log(`Found ${generatedImportLines.length} import lines`);
console.log(`Found ${generatedExportLines.length} export lines`);
console.log(`Found ${generatedArrayLines.length} array entry lines`);

// Build new file
let newContent = `/**
 * All 658 System Design Challenge Definitions (40 original + 618 generated)
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

// Generated Problems - All 618 from ALL_PROBLEMS.md
${generatedExportLines.join('\n')}

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
${generatedImportLines.join('\n')}

export const allProblemDefinitions: ProblemDefinition[] = [
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

  // Generated 618 Problems from ALL_PROBLEMS.md
${generatedArrayLines.map(line => '  ' + line).join('\n')}
];
`;

console.log('💾 Writing new index.ts...');
writeFileSync(indexPath, newContent);

console.log('✅ Integration complete!');
console.log(`📊 Total problems: 658 (40 original + 618 generated)`);
console.log(`📏 New file size: ${newContent.split('\n').length} lines`);
