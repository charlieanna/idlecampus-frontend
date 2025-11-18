/**
 * Script to automatically add codeChallenges to all challenge definition files
 *
 * This script:
 * 1. Finds all challenge definition files in challenges/definitions/**\/*.ts
 * 2. Adds import for generateCodeChallengesFromFRs
 * 3. Adds codeChallenges generation at the end of each file
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFINITIONS_DIR = path.join(__dirname, '../src/apps/system-design/builder/challenges/definitions');

async function updateChallengeFile(filePath: string): Promise<void> {
  console.log(`Processing: ${path.basename(filePath)}`);

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if already has codeChallenges
  if (content.includes('generateCodeChallengesFromFRs')) {
    console.log(`  ✓ Already has codeChallenges - skipping`);
    return;
  }

  // Check if file exports a ProblemDefinition
  const exportMatch = content.match(/export const (\w+ProblemDefinition|\w+Problem):/);
  if (!exportMatch) {
    console.log(`  ⚠ No ProblemDefinition export found - skipping`);
    return;
  }

  const exportName = exportMatch[1];

  // Add import if not present
  let updatedContent = content;

  if (!content.includes('generateCodeChallengesFromFRs')) {
    // Find the last import statement at the TOP of the file (before any multi-line strings or comments)
    const lines = content.split('\n');
    let lastImportIndex = -1;
    let inMultilineString = false;

    for (let i = 0; i < Math.min(lines.length, 50); i++) { // Only check first 50 lines
      const line = lines[i].trim();

      // Track if we're inside a multiline string (backticks)
      if (line.includes('`')) {
        inMultilineString = !inMultilineString;
      }

      // Only count imports that are not inside strings
      if (!inMultilineString && line.startsWith('import ')) {
        lastImportIndex = i;
      }

      // Stop searching after we pass the import section
      if (lastImportIndex >= 0 && !line.startsWith('import ') && line && !line.startsWith('//') && !line.startsWith('/*')) {
        break;
      }
    }

    if (lastImportIndex >= 0) {
      // Insert import after last import
      lines.splice(
        lastImportIndex + 1,
        0,
        "import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';"
      );
      updatedContent = lines.join('\n');
    }
  }

  // Add codeChallenges generation at the end
  if (!updatedContent.includes(`.codeChallenges = generateCodeChallengesFromFRs`)) {
    updatedContent = updatedContent.trimEnd();
    updatedContent += `\n\n// Auto-generate code challenges from functional requirements\n`;
    updatedContent += `(${exportName} as any).codeChallenges = generateCodeChallengesFromFRs(${exportName});\n`;
  }

  // Write updated content
  fs.writeFileSync(filePath, updatedContent, 'utf-8');
  console.log(`  ✅ Added codeChallenges`);
}

async function main() {
  console.log('🚀 Adding codeChallenges to all challenge definitions...\n');

  // Find all .ts files in definitions directory
  const files = await glob(`${DEFINITIONS_DIR}/**/*.ts`);

  console.log(`Found ${files.length} definition files\n`);

  let processed = 0;
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    try {
      const beforeContent = fs.readFileSync(file, 'utf-8');
      await updateChallengeFile(file);
      const afterContent = fs.readFileSync(file, 'utf-8');

      processed++;

      if (beforeContent !== afterContent) {
        updated++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${path.basename(file)}:`, error);
    }
  }

  console.log(`\n✨ Done!`);
  console.log(`   Processed: ${processed} files`);
  console.log(`   Updated: ${updated} files`);
  console.log(`   Skipped: ${skipped} files`);
}

main().catch(console.error);
