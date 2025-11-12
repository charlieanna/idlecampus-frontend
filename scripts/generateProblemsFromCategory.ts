#!/usr/bin/env tsx
/**
 * Generate complete problem definition files from extracted-problems
 * Usage: npx tsx scripts/generateProblemsFromCategory.ts <category> [start] [count]
 * Example: npx tsx scripts/generateProblemsFromCategory.ts caching 6 10
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parseMarkdownFile, generateProblemDefinition, generateProblemConfig, ParsedProblem } from './parseExtractedProblems.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate complete TypeScript file for a category
 */
function generateCategoryFile(problems: ParsedProblem[], category: string): string {
  const problemDefinitions = problems.map(p => generateProblemDefinition(p)).join('\n');

  return `import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

${problemDefinitions}
`;
}

/**
 * Generate export statements for index.ts
 */
function generateIndexExports(problems: ParsedProblem[], category: string): string {
  const camelCaseIds = problems.map(p => {
    const camelCase = p.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/-/g, '');
    return `${camelCase}ProblemDefinition`;
  });

  const importStatement = `import { ${camelCaseIds.join(', ')} } from './${category}ProblemsExtended';`;
  const exportStatement = `export { ${camelCaseIds.join(', ')} } from './${category}ProblemsExtended';`;
  const arrayEntries = camelCaseIds.join(',\n  ');

  return {
    import: importStatement,
    export: exportStatement,
    arrayEntries,
  };
}

/**
 * Generate problemConfigs entries
 */
function generateConfigsBlock(problems: ParsedProblem[]): string {
  const configs = problems.map(p => generateProblemConfig(p)).join('\n');
  return configs;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: npx tsx scripts/generateProblemsFromCategory.ts <category> [start] [count]');
    console.error('Example: npx tsx scripts/generateProblemsFromCategory.ts caching 6 10');
    console.error('\nAvailable categories: caching, streaming, storage, gateway, search, multiregion');
    process.exit(1);
  }

  const category = args[0];
  const startIndex = args.length > 1 ? parseInt(args[1]) : 0;
  const count = args.length > 2 ? parseInt(args[2]) : 1000; // Default to all

  const extractedDir = path.join(__dirname, '../extracted-problems/system-design');
  const filePath = path.join(extractedDir, `${category}.md`);

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`\n=== Generating problems from ${category}.md ===`);
  console.log(`Start index: ${startIndex}, Count: ${count}\n`);

  const allProblems = parseMarkdownFile(filePath);
  console.log(`Total problems in file: ${allProblems.length}`);

  const selectedProblems = allProblems.slice(startIndex, startIndex + count);
  console.log(`Generating ${selectedProblems.length} problems (${startIndex} to ${startIndex + selectedProblems.length - 1})\n`);

  // Generate TypeScript file
  const tsContent = generateCategoryFile(selectedProblems, category);
  const outputFile = path.join(__dirname, `../src/apps/system-design/builder/challenges/definitions/${category}ProblemsExtended.ts`);
  fs.writeFileSync(outputFile, tsContent);
  console.log(`✅ Generated: ${outputFile}`);
  console.log(`   Contains ${selectedProblems.length} problem definitions\n`);

  // Generate index.ts additions
  const indexExports = generateIndexExports(selectedProblems, category);
  console.log('=== Add to index.ts ===\n');
  console.log('// Import statement:');
  console.log(indexExports.import);
  console.log('\n// Export statement:');
  console.log(indexExports.export);
  console.log('\n// Array entries (add to allProblemDefinitions):');
  console.log(indexExports.arrayEntries);

  // Generate problemConfigs additions
  const configsBlock = generateConfigsBlock(selectedProblems);
  console.log('\n\n=== Add to problemConfigs.ts ===\n');
  console.log(configsBlock);

  // Summary
  console.log('\n\n=== Summary ===');
  console.log(`Problems generated: ${selectedProblems.length}`);
  selectedProblems.forEach((p, i) => {
    console.log(`  ${startIndex + i + 1}. ${p.title} (${p.id})`);
  });

  console.log('\n✅ Generation complete!');
  console.log('\nNext steps:');
  console.log('1. Review the generated file');
  console.log('2. Add the import/export statements to index.ts');
  console.log('3. Add the problemConfigs entries to problemConfigs.ts');
  console.log('4. Run tests: npm test extractedProblems');
  console.log('5. Commit the changes');
}

// Run if called directly
main();
