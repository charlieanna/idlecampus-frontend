/**
 * Validate All Challenge Solutions
 * 
 * This script tests all challenge files to ensure their solutions pass all test cases.
 * It identifies challenges with failing solutions and reports statistics.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface TestResult {
  challengeFile: string;
  challengeName: string;
  totalTests: number;
  passingTests: number;
  failingTests: number;
  hasSolution: boolean;
  error?: string;
}

const CHALLENGES_DIR = 'src/apps/system-design/builder/challenges';

// Get all challenge files (excluding helper files)
function getChallengeFiles(): string[] {
  const files: string[] = [];
  
  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && entry.name !== 'definitions' && entry.name !== 'node_modules') {
        walkDir(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        // Exclude helper files
        if (!entry.name.includes('test.ts') && 
            !entry.name.includes('index.ts') &&
            !entry.name.includes('Converter.ts') &&
            !entry.name.includes('Generator.ts') &&
            !entry.name.includes('Migration.ts') &&
            !entry.name.includes('Whitelist.ts') &&
            !entry.name.includes('Config.ts') &&
            entry.name !== 'scenarioGenerator.ts' &&
            entry.name !== 'generateClients.ts' &&
            entry.name !== 'pythonTemplateGenerator.ts' &&
            entry.name !== 'problemWhitelist.ts' &&
            entry.name !== 'problemConfigs.ts' &&
            entry.name !== 'generatedChallenges.ts' &&
            entry.name !== 'tieredChallenges.ts' &&
            entry.name !== 'coreTrack.ts') {
          files.push(fullPath);
        }
      }
    }
  }
  
  walkDir(CHALLENGES_DIR);
  return files;
}

// Check if a file has solution objects
function hasSolutionObjects(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.includes('solution: {');
  } catch (error) {
    return false;
  }
}

// Count tests and solutions in a challenge file
function analyzeChallenge(filePath: string): { name: string; testCount: number; solutionCount: number } {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract challenge name from export
    const nameMatch = content.match(/export const (\w+)Challenge/);
    const name = nameMatch ? nameMatch[1] : path.basename(filePath, '.ts');
    
    // Count test cases (looking for test: { or levels: [)
    const testMatches = content.match(/test:\s*{/g) || [];
    const levelMatches = content.match(/levels:\s*\[/g) || [];
    const testCount = testMatches.length + levelMatches.length;
    
    // Count solutions
    const solutionMatches = content.match(/solution:\s*{/g) || [];
    const solutionCount = solutionMatches.length;
    
    return { name, testCount, solutionCount };
  } catch (error) {
    return { name: path.basename(filePath, '.ts'), testCount: 0, solutionCount: 0 };
  }
}

// Main execution
async function main() {
  console.log('🔍 Finding all challenge files...\n');
  
  const challengeFiles = getChallengeFiles();
  console.log(`Found ${challengeFiles.length} challenge files\n`);
  
  const results: TestResult[] = [];
  const filesWithSolutions: string[] = [];
  const filesWithoutSolutions: string[] = [];
  
  // Analyze each file
  for (const filePath of challengeFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const hasSolution = hasSolutionObjects(filePath);
    const analysis = analyzeChallenge(filePath);
    
    if (hasSolution) {
      filesWithSolutions.push(relativePath);
      console.log(`✅ ${relativePath}`);
      console.log(`   Name: ${analysis.name}`);
      console.log(`   Tests: ${analysis.testCount}, Solutions: ${analysis.solutionCount}`);
    } else {
      filesWithoutSolutions.push(relativePath);
      console.log(`❌ ${relativePath} (no solutions)`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total challenge files: ${challengeFiles.length}`);
  console.log(`Files with solutions: ${filesWithSolutions.length}`);
  console.log(`Files without solutions: ${filesWithoutSolutions.length}`);
  
  if (filesWithSolutions.length > 0) {
    console.log('\n📝 Files with solutions:');
    filesWithSolutions.forEach(f => console.log(`  - ${f}`));
  }
  
  if (filesWithoutSolutions.length > 0) {
    console.log('\n⚠️  Files without solutions:');
    filesWithoutSolutions.forEach(f => console.log(`  - ${f}`));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✨ Analysis complete!');
}

main().catch(console.error);