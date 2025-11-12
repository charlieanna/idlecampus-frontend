#!/usr/bin/env node
/**
 * Fix the original 40 problems to add userFacingFRs and userFacingNFRs
 * Extracts them from descriptions and problem configs
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const originalProblems = [
  'instagram', 'twitter', 'reddit', 'linkedin', 'facebook', 'tiktok',
  'pinterest', 'snapchat', 'discord', 'medium', 'amazon', 'shopify',
  'stripe', 'uber', 'airbnb', 'netflix', 'spotify', 'youtube', 'twitch',
  'hulu', 'whatsapp', 'slack', 'telegram', 'messenger', 'pastebin',
  'dropbox', 'googledrive', 'github', 'stackoverflow', 'doordash',
  'instacart', 'yelp', 'notion', 'trello', 'googlecalendar', 'zoom',
  'steam', 'ticketmaster', 'bookingcom', 'weatherapi'
];

function extractFRsFromDescription(description) {
  // Extract bulleted items that look like functional requirements
  const lines = description.split('\n');
  const frs = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- Users can') ||
        trimmed.startsWith('- User can') ||
        trimmed.startsWith('- Users should') ||
        trimmed.startsWith('- System') ||
        trimmed.startsWith('- Support')) {
      frs.push(trimmed.substring(2));  // Remove "- "
    }
  }

  return frs;
}

function addUserFacingFields(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if it already has userFacingFRs
  if (content.includes('userFacingFRs')) {
    console.log(`   ✓ Already has userFacingFRs`);
    return false;
  }

  // Extract description
  const descMatch = content.match(/description: `([^`]+)`/s);
  if (!descMatch) {
    console.log(`   ✗ Could not find description`);
    return false;
  }

  const description = descMatch[1];
  const frs = extractFRsFromDescription(description);

  if (frs.length === 0) {
    console.log(`   ⚠ No FRs found in description`);
    return false;
  }

  // Format FRs
  const frLines = frs.map(fr => `    '${fr.replace(/'/g, "\\'")}'`).join(',\n');

  // Insert userFacingFRs after description
  const insertPoint = content.indexOf('description: `' + description + '`,') + ('description: `' + description + '`,').length;

  const insertion = `\n\n  // User-facing requirements (interview-style)\n  userFacingFRs: [\n${frLines}\n  ],`;

  content = content.slice(0, insertPoint) + insertion + content.slice(insertPoint);

  fs.writeFileSync(filePath, content);
  console.log(`   ✓ Added ${frs.length} FRs`);
  return true;
}

console.log('🔧 Fixing original 40 problems...\n');

let fixed = 0;
originalProblems.forEach(problem => {
  const filePath = path.join(__dirname, `../src/apps/system-design/builder/challenges/definitions/${problem}.ts`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠ ${problem}: File not found`);
    return;
  }

  console.log(`📝 ${problem}:`);
  if (addUserFacingFields(filePath)) {
    fixed++;
  }
});

console.log(`\n✅ Fixed ${fixed} problems`);
