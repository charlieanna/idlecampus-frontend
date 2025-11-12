#!/usr/bin/env tsx
/**
 * Generate ALL 618 problems from ALL_PROBLEMS.md
 * This is the definitive source with all problems properly formatted
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parseMarkdownFile, generateProblemDefinition, generateProblemConfig, ParsedProblem } from './parseExtractedProblems.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function groupByCategory(problems: ParsedProblem[]): Map<string, ParsedProblem[]> {
  const grouped = new Map<string, ParsedProblem[]>();

  problems.forEach(problem => {
    const category = problem.category || 'uncategorized';
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(problem);
  });

  return grouped;
}

function generateCategoryFile(problems: ParsedProblem[], category: string): string {
  const problemDefinitions = problems.map(p => generateProblemDefinition(p)).join('\n');

  return `import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { basicFunctionalValidator } from '../../validation/validators/featureValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * ${category.charAt(0).toUpperCase() + category.slice(1)} Problems - Complete Set
 * Auto-generated from ALL_PROBLEMS.md
 * Total: ${problems.length} problems
 */

${problemDefinitions}
`;
}

function main() {
  const masterFile = path.join(__dirname, '../extracted-problems/system-design/ALL_PROBLEMS.md');
  const outputDir = path.join(__dirname, '../src/apps/system-design/builder/challenges/definitions/generated-all');

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🚀 Parsing ALL_PROBLEMS.md for all 618 problems...\n');

  const allProblems = parseMarkdownFile(masterFile);
  console.log(`✅ Successfully parsed ${allProblems.length} problems\n`);

  // Group by category
  const grouped = groupByCategory(allProblems);
  console.log(`📂 Found ${grouped.size} categories:\n`);

  let totalGenerated = 0;
  const allConfigs: string[] = [];
  const allImports: string[] = [];
  const allExports: string[] = [];
  const allArrayEntries: string[] = [];

  // Generate files for each category
  grouped.forEach((problems, category) => {
    console.log(`   ${category}: ${problems.length} problems`);

    const tsContent = generateCategoryFile(problems, category);
    const outputFile = path.join(outputDir, `${category}AllProblems.ts`);
    fs.writeFileSync(outputFile, tsContent);

    // Collect export names
    const exportNames = problems.map(p => {
      const camelCase = p.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/-/g, '');
      return `${camelCase}ProblemDefinition`;
    });

    allImports.push(`import { ${exportNames.join(', ')} } from './generated-all/${category}AllProblems';`);
    allExports.push(`export { ${exportNames.join(', ')} } from './generated-all/${category}AllProblems';`);
    allArrayEntries.push(`  // ${category} (${problems.length})`);
    exportNames.forEach(name => {
      allArrayEntries.push(`  ${name},`);
    });

    // Generate configs
    problems.forEach(p => {
      allConfigs.push(generateProblemConfig(p));
    });

    totalGenerated += problems.length;
  });

  console.log(`\n✅ Generated ${totalGenerated} problems across ${grouped.size} categories`);

  // Write integration instructions
  const instructionsPath = path.join(outputDir, 'INTEGRATION_INSTRUCTIONS.md');
  const instructions = `# Integration Instructions for ALL 618 Problems

Generated ${totalGenerated} problems from ALL_PROBLEMS.md

## Step 1: Add Imports to index.ts

\`\`\`typescript
// All 618 Problems from ALL_PROBLEMS.md
${allImports.join('\n')}
\`\`\`

## Step 2: Add Exports to index.ts

\`\`\`typescript
// All 618 Problems Exports
${allExports.join('\n')}
\`\`\`

## Step 3: Add to allProblemDefinitions Array

\`\`\`typescript
// All 618 Generated Problems
${allArrayEntries.join('\n')}
\`\`\`

## Step 4: Add to problemConfigs.ts

\`\`\`typescript
// All 618 Problem Configs
${allConfigs.join('\n')}
\`\`\`

## Summary

- Total problems generated: ${totalGenerated}
- Categories: ${grouped.size}
- Files created: ${grouped.size}
- Target total: ${40 + 41 + totalGenerated} (40 original + 41 manual + ${totalGenerated} generated)
`;

  fs.writeFileSync(instructionsPath, instructions);
  console.log(`\n📝 Integration instructions: ${instructionsPath}`);
  console.log(`\n🎉 ALL 618 PROBLEMS GENERATED!`);
  console.log(`   Total problems available: ${40 + 41 + totalGenerated} (40 original + 41 manual + ${totalGenerated} generated)`);
}

main();
