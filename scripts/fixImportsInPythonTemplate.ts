/**
 * Fix files where the import was incorrectly added inside pythonTemplate
 *
 * The addCodeChallenges script mistakenly added imports inside Python code blocks
 * This script removes those incorrect imports and adds them in the right place
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFINITIONS_DIR = path.join(__dirname, '../src/apps/system-design/builder/challenges/definitions');

async function fixFile(filePath: string): Promise<boolean> {
  const filename = path.basename(filePath);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if the import exists inside pythonTemplate (wrong place)
  const wrongImportPattern = /pythonTemplate: `[^`]*import { generateCodeChallengesFromFRs }[^`]*`/s;

  if (!wrongImportPattern.test(content)) {
    return false; // File is fine
  }

  console.log(`Fixing: ${filename}`);

  // Remove the import from inside pythonTemplate
  content = content.replace(
    /^import { generateCodeChallengesFromFRs } from '\.\.\/\.\.\/utils\/codeChallengeGenerator';\n/gm,
    ''
  );

  // Find the correct place to add the import (after other imports at top of file)
  const lines = content.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < Math.min(lines.length, 20); i++) {
    const line = lines[i].trim();
    if (line.startsWith('import ') && !line.includes('pythonTemplate')) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex >= 0) {
    // Insert import after last import
    lines.splice(
      lastImportIndex + 1,
      0,
      "import { generateCodeChallengesFromFRs } from '../../utils/codeChallengeGenerator';"
    );
    content = lines.join('\n');
  }

  // Write the fixed content
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  ✅ Fixed ${filename}`);
  return true;
}

async function main() {
  console.log('🔧 Fixing imports that were added inside pythonTemplate...\n');

  const files = await glob(`${DEFINITIONS_DIR}/**/*.ts`);

  let fixedCount = 0;

  for (const file of files) {
    // Skip generated-all files
    if (file.includes('/generated-all/')) {
      continue;
    }

    try {
      const wasFixed = await fixFile(file);
      if (wasFixed) {
        fixedCount++;
      }
    } catch (error) {
      console.error(`  ❌ Error fixing ${path.basename(file)}:`, error);
    }
  }

  console.log(`\n✨ Done! Fixed ${fixedCount} files.`);
}

main().catch(console.error);
