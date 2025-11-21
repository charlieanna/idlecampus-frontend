#!/usr/bin/env node
/**
 * Update challenge files with newly generated L6-aware solutions
 */

import { readFileSync, writeFileSync } from 'fs';

const CHALLENGES = [
  {
    id: 'tiny_url',
    file: 'src/apps/system-design/builder/challenges/tinyUrl.ts',
    solutionFile: 'backend/temp/tiny_url_solution.json'
  },
  {
    id: 'food_blog',
    file: 'src/apps/system-design/builder/challenges/foodBlog.ts',
    solutionFile: 'backend/temp/food_blog_solution.json'
  },
  {
    id: 'todo_app',
    file: 'src/apps/system-design/builder/challenges/todoApp.ts',
    solutionFile: 'backend/temp/todo_app_solution.json'
  },
  {
    id: 'web_crawler',
    file: 'src/apps/system-design/builder/challenges/webCrawler.ts',
    solutionFile: 'backend/temp/web_crawler_solution.json'
  },
];

/**
 * Convert JSON solution to TypeScript object literal string
 */
function jsonToTS(solution) {
  // Convert JSON to TypeScript-formatted string
  const tsString = JSON.stringify(solution, null, 2)
    // Replace double quotes with single quotes for strings (except in keys)
    .replace(/"([^"]+)":/g, "$1:") // Remove quotes from object keys
    .replace(/: "([^"]*)"/g, ": '$1'") // Replace double quotes with single quotes for string values
    .replace(/\["([^"]+)"\]/g, "['$1']") // Replace array string elements
    .replace(/\[(\s*)"([^"]+)"/g, "[$1'$2'"); // Fix arrays of strings
  
  return tsString;
}

for (const { id, file, solutionFile } of CHALLENGES) {
  console.log(`\n📝 Updating ${id}...`);
  
  // Read the solution JSON
  const solution = JSON.parse(readFileSync(solutionFile, 'utf8'));
  
  // Read the challenge file
  const content = readFileSync(file, 'utf8');
  
  // Find the solution field
  const solutionRegex = /(\s+solution: )\{[\s\S]*?\n  \},?\n(\};)/;
  
  // Check if we found the solution
  if (!solutionRegex.test(content)) {
    console.error(`❌ Could not find solution field in ${file}`);
    continue;
  }
  
  // Convert solution to TS format
  const tsObjectString = jsonToTS(solution);
  
  // Replace the solution
  const updatedContent = content.replace(
    solutionRegex,
    `$1${tsObjectString},\n$2`
  );
  
  // Write back to file
  writeFileSync(file, updatedContent);
  console.log(`   ✅ Updated ${file}`);
}

console.log('\n✅ All challenge files updated!');
console.log('\nNext step: Run validation to verify all tests pass');
console.log('  cd src/apps/system-design/builder && npx tsx scripts/validateAllSolutions.ts\n');
