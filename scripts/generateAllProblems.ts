#!/usr/bin/env tsx
/**
 * Generate ALL problems from ALL categories
 * This script processes all markdown files in extracted-problems/system-design/
 * and generates complete TypeScript problem definitions for each
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parseMarkdownFile, generateProblemDefinition, generateProblemConfig, ParsedProblem } from './parseExtractedProblems.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CategoryConfig {
  name: string;
  startIndex: number;
  count: number;
}

// Categories to process with their starting indices and counts
const CATEGORIES_TO_PROCESS: CategoryConfig[] = [
  // Already partially done - complete them
  { name: 'caching', startIndex: 16, count: 19 },
  { name: 'streaming', startIndex: 5, count: 30 },
  { name: 'storage', startIndex: 5, count: 30 },
  { name: 'gateway', startIndex: 4, count: 31 },
  { name: 'search', startIndex: 4, count: 31 },
  { name: 'multiregion', startIndex: 4, count: 31 },

  // New categories - process all
  { name: 'tutorial', startIndex: 0, count: 100 },
  { name: 'ai-infrastructure', startIndex: 0, count: 100 },
  { name: 'api-platform', startIndex: 0, count: 100 },
  { name: 'bio-digital', startIndex: 0, count: 100 },
  { name: 'compliance-security', startIndex: 0, count: 100 },
  { name: 'cross-regional', startIndex: 0, count: 100 },
  { name: 'data-platform', startIndex: 0, count: 100 },
  { name: 'developer-productivity', startIndex: 0, count: 100 },
  { name: 'distributed-consensus', startIndex: 0, count: 100 },
  { name: 'economic-systems', startIndex: 0, count: 100 },
  { name: 'energy-sustainability', startIndex: 0, count: 100 },
  { name: 'existential-infrastructure', startIndex: 0, count: 100 },
  { name: 'infrastructure', startIndex: 0, count: 100 },
  { name: 'ml-platform', startIndex: 0, count: 100 },
  { name: 'multi-tenant', startIndex: 0, count: 100 },
  { name: 'new-computing', startIndex: 0, count: 100 },
  { name: 'next-gen-protocols', startIndex: 0, count: 100 },
  { name: 'novel-databases', startIndex: 0, count: 100 },
  { name: 'observability', startIndex: 0, count: 100 },
  { name: 'platform-migration', startIndex: 0, count: 100 },
  { name: 'privacy-innovation', startIndex: 0, count: 100 },
];

function generateCategoryFile(problems: ParsedProblem[], category: string): string {
  const problemDefinitions = problems.map(p => generateProblemDefinition(p)).join('\n');

  return `import { ProblemDefinition } from '../../types/problemDefinition';
import { validConnectionFlowValidator } from '../../validation/validators/commonValidators';
import { generateScenarios } from '../scenarioGenerator';
import { problemConfigs } from '../problemConfigs';

/**
 * ${category.charAt(0).toUpperCase() + category.slice(1)} Problems (Auto-generated)
 * Generated from extracted-problems/system-design/${category}.md
 */

${problemDefinitions}
`;
}

function main() {
  const extractedDir = path.join(__dirname, '../extracted-problems/system-design');
  const outputDir = path.join(__dirname, '../src/apps/system-design/builder/challenges/definitions/generated');

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('🚀 Starting bulk problem generation...\n');

  let totalProblemsGenerated = 0;
  const generatedFiles: string[] = [];
  const allConfigs: string[] = [];
  const allExports: Array<{ category: string; names: string[] }> = [];

  CATEGORIES_TO_PROCESS.forEach((categoryConfig) => {
    const { name: category, startIndex, count } = categoryConfig;
    const filePath = path.join(extractedDir, `${category}.md`);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${category} - file not found`);
      return;
    }

    console.log(`\n📂 Processing ${category}.md...`);

    try {
      const allProblems = parseMarkdownFile(filePath);
      const selectedProblems = allProblems.slice(startIndex, startIndex + count);

      if (selectedProblems.length === 0) {
        console.log(`   ℹ️  No problems found (requested ${startIndex}-${startIndex + count}, total available: ${allProblems.length})`);
        return;
      }

      console.log(`   Found ${allProblems.length} total, generating ${selectedProblems.length} (indices ${startIndex}-${startIndex + selectedProblems.length - 1})`);

      // Generate TypeScript file
      const tsContent = generateCategoryFile(selectedProblems, category);
      const outputFile = path.join(outputDir, `${category}ProblemsGenerated.ts`);
      fs.writeFileSync(outputFile, tsContent);
      generatedFiles.push(outputFile);

      // Collect export names
      const exportNames = selectedProblems.map(p => {
        const camelCase = p.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase()).replace(/-/g, '');
        return `${camelCase}ProblemDefinition`;
      });
      allExports.push({ category, names: exportNames });

      // Generate configs
      selectedProblems.forEach(p => {
        allConfigs.push(generateProblemConfig(p));
      });

      totalProblemsGenerated += selectedProblems.length;
      console.log(`   ✅ Generated ${selectedProblems.length} problems`);

    } catch (error) {
      console.error(`   ❌ Error processing ${category}:`, error);
    }
  });

  console.log(`\n\n🎉 Generation Complete!`);
  console.log(`📊 Total problems generated: ${totalProblemsGenerated}`);
  console.log(`📁 Files created: ${generatedFiles.length}`);

  // Write summary file with integration instructions
  const summaryPath = path.join(outputDir, 'INTEGRATION_INSTRUCTIONS.md');
  let summaryContent = `# Integration Instructions

Generated ${totalProblemsGenerated} problems across ${generatedFiles.length} categories.

## Files Generated

${generatedFiles.map(f => `- ${path.basename(f)}`).join('\n')}

## Step 1: Add Imports to index.ts

Add these imports after the existing imports:

\`\`\`typescript
// Generated Problems
`;

  allExports.forEach(({ category, names }) => {
    summaryContent += `import { ${names.join(', ')} } from './generated/${category}ProblemsGenerated';\n`;
  });

  summaryContent += `\`\`\`

## Step 2: Add Exports to index.ts

Add these exports:

\`\`\`typescript
// Generated Problems
`;

  allExports.forEach(({ category, names }) => {
    summaryContent += `export { ${names.join(', ')} } from './generated/${category}ProblemsGenerated';\n`;
  });

  summaryContent += `\`\`\`

## Step 3: Add to allProblemDefinitions Array

Add these entries:

\`\`\`typescript
// Generated Problems (${totalProblemsGenerated} total)
`;

  allExports.forEach(({ category, names }) => {
    summaryContent += `  // ${category} (${names.length})\n`;
    names.forEach(name => {
      summaryContent += `  ${name},\n`;
    });
  });

  summaryContent += `\`\`\`

## Step 4: Add to problemConfigs.ts

Add these configurations:

\`\`\`typescript
// Generated Problem Configs
${allConfigs.join('\n')}
\`\`\`

## Step 5: Update Tests

Update extractedProblems.test.ts to expect ${40 + 41 + totalProblemsGenerated} total problems.

`;

  fs.writeFileSync(summaryPath, summaryContent);
  console.log(`\n📝 Integration instructions written to: ${summaryPath}`);
}

main();
