/**
 * Fix script for generated-all files that have multiple ProblemDefinition exports
 *
 * These files were incorrectly updated by addCodeChallenges.ts
 * This script removes the incorrect additions
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GENERATED_ALL_DIR = path.join(__dirname, '../src/apps/system-design/builder/challenges/definitions/generated-all');

async function fixGeneratedAllFile(filePath: string): Promise<void> {
  console.log(`Fixing: ${path.basename(filePath)}`);

  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove the incorrect import if it exists
  if (content.includes("import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';")) {
    content = content.replace(
      /import { generateCodeChallengesFromFRs } from '\.\.\/\.\.\/utils\/codeChallengeGenerator';\n/g,
      ''
    );
    console.log(`  ✅ Removed incorrect import`);
  }

  // Remove any code challenge generation lines
  const beforeLines = content.split('\n').length;
  content = content.replace(
    /\n\/\/ Auto-generate code challenges from functional requirements\n\(.*? as any\)\.codeChallenges = generateCodeChallengesFromFRs\(.*?\);/g,
    ''
  );
  const afterLines = content.split('\n').length;

  if (beforeLines !== afterLines) {
    console.log(`  ✅ Removed ${beforeLines - afterLines} lines of incorrect code challenge generation`);
  }

  // Write the fixed content
  fs.writeFileSync(filePath, content, 'utf-8');
}

async function main() {
  console.log('🔧 Fixing generated-all files...\n');

  const files = await glob(`${GENERATED_ALL_DIR}/*.ts`);

  console.log(`Found ${files.length} files in generated-all directory\n`);

  for (const file of files) {
    try {
      await fixGeneratedAllFile(file);
    } catch (error) {
      console.error(`  ❌ Error fixing ${path.basename(file)}:`, error);
    }
  }

  console.log(`\n✨ Done! Fixed all generated-all files.`);
  console.log(`\nNote: generated-all files export multiple ProblemDefinitions.`);
  console.log(`They don't need codeChallenges added - they aggregate other definitions.`);
}

main().catch(console.error);
