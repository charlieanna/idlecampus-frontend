# Tiered Challenge Conversion Plan

## Overview
Convert all 400+ problem definitions to individual tiered challenge files, moving from in-memory conversion to persistent TypeScript files.

## Current State Analysis

### Existing Structure
- **4 Tiered Challenges** (already as individual files):
  - [`tinyUrl.ts`](src/apps/system-design/builder/challenges/tinyUrl.ts)
  - [`foodBlog.ts`](src/apps/system-design/builder/challenges/foodBlog.ts)
  - [`todoApp.ts`](src/apps/system-design/builder/challenges/todoApp.ts)
  - [`webCrawler.ts`](src/apps/system-design/builder/challenges/webCrawler.ts)

- **400+ Problem Definitions** in [`/challenges/definitions/`](src/apps/system-design/builder/challenges/definitions/)
  - Currently converted in-memory via [`generatedChallenges.ts`](src/apps/system-design/builder/challenges/generatedChallenges.ts)
  - Using [`convertProblemDefinitionToChallenge()`](src/apps/system-design/builder/challenges/problemDefinitionConverter.ts)

### Key Components
1. **Converter Function**: [`problemDefinitionConverter.ts`](src/apps/system-design/builder/challenges/problemDefinitionConverter.ts)
   - `convertProblemDefinitionToChallenge()` - Main conversion logic
   - `generateSolutionForChallenge()` - On-demand solution generation

2. **Type System**:
   - `Challenge` type - Used for tiered challenges with embedded test cases
   - `ProblemDefinition` type - Declarative format with scenarios and validators

## Implementation Plan

### Step 1: Create Generation Script
Create `scripts/generateTieredChallenges.ts` that will:

```typescript
#!/usr/bin/env tsx
/**
 * Script to generate individual tiered challenge files from all problem definitions
 * This converts ProblemDefinitions to Challenge format and creates separate .ts files
 */

import fs from 'fs';
import path from 'path';
import { convertProblemDefinitionToChallenge, generateSolutionForChallenge } from '../src/apps/system-design/builder/challenges/problemDefinitionConverter';
import { allProblemDefinitions } from '../src/apps/system-design/builder/challenges/definitions';
import { ProblemDefinition } from '../src/apps/system-design/builder/types/problemDefinition';
import { Challenge } from '../src/apps/system-design/builder/types/testCase';

const CHALLENGES_DIR = path.join(__dirname, '../src/apps/system-design/builder/challenges/tiered');
const INDEX_FILE = path.join(__dirname, '../src/apps/system-design/builder/challenges/tieredIndex.ts');

// Ensure the tiered directory exists
if (!fs.existsSync(CHALLENGES_DIR)) {
  fs.mkdirSync(CHALLENGES_DIR, { recursive: true });
}

function toCamelCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

function generateChallengeFile(problemDef: ProblemDefinition): { fileName: string; exportName: string } {
  const challenge = convertProblemDefinitionToChallenge(problemDef);
  
  // Generate solution on demand if not present
  if (!challenge.solution) {
    challenge.solution = generateSolutionForChallenge(challenge);
  }
  
  const fileName = `${problemDef.id.replace(/-/g, '_')}.ts`;
  const exportName = `${toCamelCase(problemDef.id)}Challenge`;
  
  // Generate the file content
  const fileContent = `/**
 * Generated Tiered Challenge: ${problemDef.title}
 * Converted from ProblemDefinition to Challenge format
 */

import { Challenge } from '../../types/testCase';
${challenge.codeChallenges ? "import { CodeChallenge } from '../../types/challengeTiers';" : ''}

${challenge.codeChallenges ? `const codeChallenges: CodeChallenge[] = ${JSON.stringify(challenge.codeChallenges, null, 2)};` : ''}

export const ${exportName}: Challenge = {
  id: '${challenge.id}',
  title: '${challenge.title.replace(/'/g, "\\'")}',
  difficulty: '${challenge.difficulty}',
  description: \`${challenge.description.replace(/`/g, '\\`')}\`,
  
  requirements: ${JSON.stringify(challenge.requirements, null, 2).replace(/"([^"]+)":/g, '$1:')},
  
  availableComponents: ${JSON.stringify(challenge.availableComponents, null, 2)},
  
  testCases: [
${challenge.testCases.map(tc => {
  const tcObj = {
    name: tc.name,
    type: tc.type,
    requirement: tc.requirement,
    description: tc.description,
    traffic: tc.traffic,
    duration: tc.duration,
    passCriteria: tc.passCriteria,
    ...(tc.failureInjection && { failureInjection: tc.failureInjection }),
    ...(tc.solution && { solution: tc.solution })
  };
  
  return '    ' + JSON.stringify(tcObj, null, 2).split('\n').join('\n    ');
}).join(',\n')}
  ],
  
  ${challenge.learningObjectives ? `learningObjectives: ${JSON.stringify(challenge.learningObjectives, null, 2)},` : ''}
  
  ${challenge.referenceLinks ? `referenceLinks: ${JSON.stringify(challenge.referenceLinks, null, 2)},` : ''}
  
  ${challenge.pythonTemplate ? `pythonTemplate: \`${challenge.pythonTemplate.replace(/`/g, '\\`')}\`,` : ''}
  
  ${challenge.codeChallenges ? `codeChallenges,` : ''}
  
  ${challenge.solution ? `solution: ${JSON.stringify(challenge.solution, null, 2).replace(/"([^"]+)":/g, '$1:')},` : ''}
};
`;

  const filePath = path.join(CHALLENGES_DIR, fileName);
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  
  return { fileName, exportName };
}

function generateIndexFile(exports: { fileName: string; exportName: string }[]) {
  const indexContent = `/**
 * Auto-generated index of all tiered challenges
 * Generated from problem definitions
 */

${exports.map(exp => `import { ${exp.exportName} } from './tiered/${exp.fileName.replace('.ts', '')}';`).join('\n')}

import { Challenge } from '../types/testCase';

// Export all tiered challenges as an array
export const allTieredChallenges: Challenge[] = [
${exports.map(exp => `  ${exp.exportName},`).join('\n')}
];

// Export individual challenges
${exports.map(exp => `export { ${exp.exportName} };`).join('\n')}

// Export challenge count
export const tieredChallengeCount = ${exports.length};

console.log(\`📊 Generated \${tieredChallengeCount} tiered challenges from problem definitions\`);
`;

  fs.writeFileSync(INDEX_FILE, indexContent, 'utf-8');
}

// Main execution
async function main() {
  console.log('🚀 Starting tiered challenge generation...');
  console.log(`📁 Output directory: ${CHALLENGES_DIR}`);
  console.log(`📝 Processing ${allProblemDefinitions.length} problem definitions...`);
  
  const exports: { fileName: string; exportName: string }[] = [];
  const errors: { problem: string; error: any }[] = [];
  
  for (const problemDef of allProblemDefinitions) {
    try {
      console.log(`  ✨ Generating challenge for: ${problemDef.id} - ${problemDef.title}`);
      const result = generateChallengeFile(problemDef);
      exports.push(result);
    } catch (error) {
      console.error(`  ❌ Error generating ${problemDef.id}:`, error);
      errors.push({ problem: problemDef.id, error });
    }
  }
  
  // Generate the index file
  console.log('\n📚 Generating index file...');
  generateIndexFile(exports);
  
  // Summary
  console.log('\n✅ Generation complete!');
  console.log(`  ✓ Successfully generated: ${exports.length} challenges`);
  console.log(`  ✗ Failed: ${errors.length} challenges`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:');
    errors.forEach(({ problem, error }) => {
      console.log(`  - ${problem}: ${error.message || error}`);
    });
  }
  
  console.log(`\n📁 Files generated in: ${CHALLENGES_DIR}`);
  console.log(`📄 Index file: ${INDEX_FILE}`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

### Step 2: Update Main Challenges Index
After generation, update [`src/apps/system-design/builder/challenges/index.ts`](src/apps/system-design/builder/challenges/index.ts) to:

```typescript
// Import existing manual challenges
import { foodBlogChallenge } from './foodBlog';
import { tinyUrlChallenge } from './tinyUrl';
import { todoAppChallenge } from './todoApp';
import { webCrawlerChallenge } from './webCrawler';

// Import all generated tiered challenges
import { allTieredChallenges } from './tieredIndex';

// Apply L6 enhancement
const challenges = [
  foodBlogChallenge,
  tinyUrlChallenge,
  todoAppChallenge,
  webCrawlerChallenge,
  ...allTieredChallenges
].map(enhanceWithL6Tests);

export { challenges };
```

### Step 3: Execute Generation
Run the script to generate all challenge files:
```bash
tsx scripts/generateTieredChallenges.ts
```

### Step 4: Verify Integration
1. Check that all files are generated in `/challenges/tiered/`
2. Verify the index file exports all challenges correctly
3. Test that the UI can load and display the new challenges
4. Ensure L6 enhancement still applies properly

## Expected Output Structure
```
src/apps/system-design/builder/challenges/
├── tiered/                       # New directory for generated challenges
│   ├── instagram.ts
│   ├── twitter.ts
│   ├── uber.ts
│   ├── netflix.ts
│   └── ... (400+ files)
├── tieredIndex.ts                # Auto-generated index
├── foodBlog.ts                   # Existing manual challenge
├── tinyUrl.ts                    # Existing manual challenge
├── todoApp.ts                    # Existing manual challenge
├── webCrawler.ts                 # Existing manual challenge
└── index.ts                      # Main index (updated to import tieredIndex)
```

## Benefits
1. **Individual Files**: Each challenge as a separate file for better organization
2. **Type Safety**: Full TypeScript support with proper imports
3. **Maintainability**: Easy to update individual challenges
4. **Version Control**: Better git history and diffs
5. **Performance**: No runtime conversion needed
6. **Consistency**: All challenges use the same structure

## Next Steps After Implementation
1. Remove the in-memory conversion from [`generatedChallenges.ts`](src/apps/system-design/builder/challenges/generatedChallenges.ts)
2. Update UI components to use the new challenge structure
3. Run validation scripts to ensure all challenges work correctly
4. Update documentation to reflect the new structure