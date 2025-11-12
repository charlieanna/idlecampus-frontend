#!/usr/bin/env tsx
/**
 * Complete the integration of all 618 generated problems into index.ts
 * This script will update the index.ts file with all imports, exports, and array entries
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.join(__dirname, '../src/apps/system-design/builder/challenges/definitions/index.ts');
const instructionsPath = path.join(__dirname, '../src/apps/system-design/builder/challenges/definitions/generated-all/INTEGRATION_INSTRUCTIONS.md');

console.log('📝 Reading integration instructions...');
const instructions = fs.readFileSync(instructionsPath, 'utf-8');

// Extract imports section
const importsMatch = instructions.match(/## Step 1: Add Imports to index\.ts\s+```typescript\s+([\s\S]+?)```/);
const imports = importsMatch ? importsMatch[1].trim() : '';

// Extract exports section
const exportsMatch = instructions.match(/## Step 2: Add Exports to index\.ts\s+```typescript\s+([\s\S]+?)```/);
const exports = exportsMatch ? exportsMatch[1].trim() : '';

// Extract array entries section
const arrayMatch = instructions.match(/## Step 3: Add to allProblemDefinitions Array\s+```typescript\s+([\s\S]+?)```/);
const arrayEntries = arrayMatch ? arrayMatch[1].trim() : '';

console.log('📖 Reading current index.ts...');
let indexContent = fs.readFileSync(indexPath, 'utf-8');

// Remove old generated imports (lines 150-177 from the system reminder)
console.log('🗑️  Removing old partial imports...');
indexContent = indexContent.replace(/\/\/ Generated Problems \(232 total\)[\s\S]*?import { l6PrivacyHomomorphicScaleProblemDefinition, l6PrivacyZkpInternetProblemDefinition } from '\.\/generated\/privacy-innovationProblemsGenerated';/g, '');

// Find the end of existing imports (before export const allProblemDefinitions)
const exportsStartIndex = indexContent.indexOf('export const allProblemDefinitions');

if (exportsStartIndex === -1) {
  console.error('❌ Could not find allProblemDefinitions array');
  process.exit(1);
}

// Find the last import before the exports
const lastImportIndex = indexContent.lastIndexOf('import {', exportsStartIndex);
const insertImportsAt = indexContent.indexOf('\n', lastImportIndex) + 1;

// Insert new imports
console.log('➕ Adding all 618 problem imports...');
const beforeImports = indexContent.substring(0, insertImportsAt);
const afterImports = indexContent.substring(insertImportsAt);

indexContent = beforeImports + '\n' + imports + '\n' + afterImports;

// Now find the allProblemDefinitions array and update it
const arrayStartMatch = indexContent.match(/export const allProblemDefinitions: ProblemDefinition\[\] = \[/);

if (!arrayStartMatch) {
  console.error('❌ Could not find allProblemDefinitions array start');
  process.exit(1);
}

const arrayStart = arrayStartMatch.index! + arrayStartMatch[0].length;

// Find the end of the array (the closing ];)
let arrayEnd = indexContent.indexOf('];', arrayStart);

if (arrayEnd === -1) {
  console.error('❌ Could not find array end');
  process.exit(1);
}

// Replace the array contents
console.log('📝 Updating allProblemDefinitions array...');
const beforeArray = indexContent.substring(0, arrayStart);
const afterArray = indexContent.substring(arrayEnd);

// Parse array entries to add them properly
const arrayLines = arrayEntries.split('\n').filter(line => line.trim());

indexContent = beforeArray + '\n  ' + arrayLines.join('\n  ') + '\n' + afterArray;

// Update the header comment
indexContent = indexContent.replace(
  /\/\*\*\s+\* All \d+ System Design Challenge Definitions.+?\*\//s,
  `/**
 * All 658 System Design Challenge Definitions (40 original + 618 generated)
 *
 * Each challenge has ONLY Level 1: "The Brute Force Test - Does It Even Work?"
 * Focus: Verify connectivity (Client → App → Database path exists)
 * No performance optimization, just basic connectivity
 */`
);

// Write the updated file
console.log('💾 Writing updated index.ts...');
fs.writeFileSync(indexPath, indexContent);

console.log('✅ Integration complete!');
console.log('📊 Total problems: 658 (40 original + 618 generated)');
console.log('\n⚠️  Note: You still need to add problemConfigs entries manually');
console.log('   Check INTEGRATION_INSTRUCTIONS.md Step 4 for the configs');
