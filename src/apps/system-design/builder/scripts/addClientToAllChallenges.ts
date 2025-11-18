/**
 * Script to add 'client' to availableComponents in all challenge files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const challengesDir = path.join(__dirname, '../challenges');

function processFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check if file has availableComponents
  if (!content.includes('availableComponents:')) {
    return false;
  }

  // Check if 'client' is already in availableComponents
  const hasClient = /availableComponents:\s*\[\s*[^[\]]*'client'/s.test(content);
  if (hasClient) {
    console.log(`✓ ${path.relative(challengesDir, filePath)} already has 'client'`);
    return false;
  }

  // Add 'client' as first item in availableComponents array
  const updated = content.replace(
    /availableComponents:\s*\[/,
    `availableComponents: [\n    'client',`
  );

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf-8');
    console.log(`✅ Added 'client' to ${path.relative(challengesDir, filePath)}`);
    return true;
  }

  return false;
}

function processDirectory(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let updated = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      updated += processDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      if (processFile(fullPath)) {
        updated++;
      }
    }
  }

  return updated;
}

const updatedCount = processDirectory(challengesDir);
console.log(`\n📊 Summary: Added 'client' to ${updatedCount} challenge files`);
