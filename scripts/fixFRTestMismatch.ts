/**
 * Fix FR Test Mismatch Issue
 *
 * Problem: Challenges define userFacingFRs but don't pass them to generateScenarios()
 * Result: Users see specific requirements but tests run generic fallback tests
 *
 * This script:
 * 1. Finds all challenge definition files
 * 2. Extracts userFacingFRs array
 * 3. Updates generateScenarios() to include the FRs as 3rd parameter
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFINITIONS_DIR = path.join(__dirname, '../src/apps/system-design/builder/challenges/definitions');

interface FixResult {
  filename: string;
  status: 'fixed' | 'skipped' | 'error';
  reason?: string;
  frsCount?: number;
}

function extractUserFacingFRs(content: string): string[] | null {
  // Find userFacingFRs array
  const match = content.match(/userFacingFRs:\s*\[([\s\S]*?)\]/);

  if (!match) {
    return null;
  }

  const arrayContent = match[1];

  // Extract individual FR strings
  const frs: string[] = [];
  const frMatches = arrayContent.matchAll(/'([^'\\\\]|\\\\.)*'|"([^"\\\\]|\\\\.)*"/g);

  for (const frMatch of frMatches) {
    const fr = frMatch[0];
    // Remove quotes and unescape
    const cleaned = fr.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"');
    frs.push(cleaned);
  }

  return frs.length > 0 ? frs : null;
}

function hasGenerateScenarios(content: string): boolean {
  return /scenarios:\s*generateScenarios\(/.test(content);
}

function alreadyHasThirdParameter(content: string): boolean {
  // Check if generateScenarios already has 3 parameters
  const match = content.match(/scenarios:\s*generateScenarios\([^)]+\)/);

  if (!match) {
    return false;
  }

  const call = match[0];

  // Count commas to determine number of parameters
  // Need to be careful of commas inside arrays/objects
  let depth = 0;
  let commas = 0;

  for (const char of call) {
    if (char === '(' || char === '[' || char === '{') depth++;
    if (char === ')' || char === ']' || char === '}') depth++;
    if (char === ',' && depth === 1) commas++;
  }

  return commas >= 2; // 2 commas = 3 parameters
}

function updateGenerateScenarios(content: string, frs: string[]): string {
  // Find the generateScenarios call
  const regex = /(scenarios:\s*generateScenarios\([^,]+,\s*[^,)]+)(\))/;

  const match = content.match(regex);

  if (!match) {
    throw new Error('Could not find generateScenarios call');
  }

  // Build the FR array string
  const frsArray = frs.map(fr => {
    // Escape single quotes and backslashes
    const escaped = fr.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `    '${escaped}'`;
  }).join(',\n');

  // Replace the generateScenarios call
  const replacement = `${match[1]}, [\n${frsArray}\n  ])`;

  return content.replace(regex, replacement);
}

async function fixChallengeFile(filePath: string): Promise<FixResult> {
  const filename = path.basename(filePath);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Skip if no generateScenarios call
    if (!hasGenerateScenarios(content)) {
      return {
        filename,
        status: 'skipped',
        reason: 'No generateScenarios call found'
      };
    }

    // Skip if already has 3rd parameter
    if (alreadyHasThirdParameter(content)) {
      return {
        filename,
        status: 'skipped',
        reason: 'Already has 3rd parameter'
      };
    }

    // Extract userFacingFRs
    const frs = extractUserFacingFRs(content);

    if (!frs || frs.length === 0) {
      return {
        filename,
        status: 'skipped',
        reason: 'No userFacingFRs defined'
      };
    }

    // Update the file
    const updatedContent = updateGenerateScenarios(content, frs);

    fs.writeFileSync(filePath, updatedContent, 'utf-8');

    return {
      filename,
      status: 'fixed',
      frsCount: frs.length
    };

  } catch (error) {
    return {
      filename,
      status: 'error',
      reason: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function main() {
  console.log('🔧 Fixing FR Test Mismatch Issue...\n');
  console.log('This will update challenges to pass userFacingFRs to generateScenarios()\n');

  // Find all challenge definition files
  const files = await glob(`${DEFINITIONS_DIR}/**/*.ts`);

  // Skip generated-all files
  const challengeFiles = files.filter(file => !file.includes('/generated-all/'));

  console.log(`Found ${challengeFiles.length} challenge files\n`);

  const results: FixResult[] = [];

  for (const file of challengeFiles) {
    const result = await fixChallengeFile(file);
    results.push(result);

    if (result.status === 'fixed') {
      console.log(`✅ ${result.filename} - Added ${result.frsCount} FRs`);
    } else if (result.status === 'error') {
      console.log(`❌ ${result.filename} - Error: ${result.reason}`);
    }
  }

  // Summary
  const fixed = results.filter(r => r.status === 'fixed');
  const skipped = results.filter(r => r.status === 'skipped');
  const errors = results.filter(r => r.status === 'error');

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   Total files: ${results.length}`);
  console.log(`   ✅ Fixed: ${fixed.length}`);
  console.log(`   ⏭️  Skipped: ${skipped.length}`);
  console.log(`   ❌ Errors: ${errors.length}`);
  console.log('='.repeat(60));

  if (fixed.length > 0) {
    console.log('\n✨ Successfully fixed FR test mismatch!');
    console.log('\nFixed challenges:');
    fixed.forEach(r => console.log(`  - ${r.filename} (${r.frsCount} FRs)`));
  }

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach(r => console.log(`  - ${r.filename}: ${r.reason}`));
  }
}

main().catch(console.error);
