/**
 * Validate All Challenge Solutions
 * 
 * This script validates that all challenge solutions pass their test cases
 * by running the TestRunner against each solution.
 */

import { TestRunner } from '../src/apps/system-design/builder/simulation/testRunner.js';
import { patternToGraph } from '../src/apps/system-design/builder/services/patternTransformer.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to validate
const CHALLENGE_FILES = [
  'webCrawler.ts',
  'todoApp.ts',
  'ticketMaster.ts',
  'foodBlog.ts',
  'tinyUrl.ts',
  'tinyUrlL6.ts',
  'tinyUrlProgressive.ts',
];

async function validateChallenge(challengePath) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📝 Validating: ${path.basename(challengePath)}`);
  console.log('='.repeat(80));
  
  try {
    // Dynamically import the challenge
    const challengeModule = await import(challengePath);
    const challengeExport = Object.values(challengeModule).find(
      exp => exp && typeof exp === 'object' && exp.id && exp.testCases
    );
    
    if (!challengeExport) {
      console.log('⚠️  No challenge export found');
      return { file: path.basename(challengePath), status: 'no_export', passed: 0, failed: 0 };
    }
    
    const challenge = challengeExport;
    
    if (!challenge.solution) {
      console.log('⚠️  No solution defined');
      return { file: path.basename(challengePath), status: 'no_solution', passed: 0, failed: 0 };
    }
    
    if (!challenge.testCases || challenge.testCases.length === 0) {
      console.log('⚠️  No test cases defined');
      return { file: path.basename(challengePath), status: 'no_tests', passed: 0, failed: 0 };
    }
    
    console.log(`Challenge: ${challenge.title || challenge.id}`);
    console.log(`Test cases: ${challenge.testCases.length}`);
    
    // Create test runner
    const testRunner = new TestRunner();
    
    // Convert solution to graph
    const graph = patternToGraph(challenge.solution);
    
    // Run all test cases
    let passedCount = 0;
    let failedCount = 0;
    const failures = [];
    
    for (const testCase of challenge.testCases) {
      const result = testRunner.runTestCase(graph, testCase);
      
      if (result.passed) {
        passedCount++;
        console.log(`  ✅ ${testCase.name}`);
      } else {
        failedCount++;
        console.log(`  ❌ ${testCase.name}`);
        failures.push({
          testCase: testCase.name,
          explanation: result.explanation,
          metrics: result.metrics
        });
      }
    }
    
    console.log(`\nResults: ${passedCount}/${challenge.testCases.length} passed`);
    
    if (failures.length > 0) {
      console.log('\n❌ Failed tests:');
      failures.forEach(f => {
        console.log(`\n  ${f.testCase}:`);
        console.log(`  ${f.explanation.split('\n')[0]}`);
      });
    }
    
    return {
      file: path.basename(challengePath),
      status: failedCount === 0 ? 'passed' : 'failed',
      passed: passedCount,
      failed: failedCount,
      total: challenge.testCases.length,
      failures
    };
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return {
      file: path.basename(challengePath),
      status: 'error',
      error: error.message,
      passed: 0,
      failed: 0
    };
  }
}

async function main() {
  console.log('🔍 Validating All Challenge Solutions\n');
  
  const results = [];
  const challengesDir = path.join(__dirname, '../src/apps/system-design/builder/challenges');
  
  for (const file of CHALLENGE_FILES) {
    const challengePath = path.join(challengesDir, file);
    
    // Check if file exists
    if (!fs.existsSync(challengePath)) {
      console.log(`⚠️  File not found: ${file}`);
      results.push({ file, status: 'not_found', passed: 0, failed: 0 });
      continue;
    }
    
    const result = await validateChallenge(challengePath);
    results.push(result);
  }
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  
  const passed = results.filter(r => r.status === 'passed');
  const failed = results.filter(r => r.status === 'failed');
  const errors = results.filter(r => r.status === 'error');
  const others = results.filter(r => !['passed', 'failed', 'error'].includes(r.status));
  
  console.log(`\n✅ Passed: ${passed.length}`);
  passed.forEach(r => console.log(`   - ${r.file}: ${r.passed}/${r.total} tests`));
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}`);
    failed.forEach(r => console.log(`   - ${r.file}: ${r.passed}/${r.total} tests (${r.failed} failures)`));
  }
  
  if (errors.length > 0) {
    console.log(`\n⚠️  Errors: ${errors.length}`);
    errors.forEach(r => console.log(`   - ${r.file}: ${r.error}`));
  }
  
  if (others.length > 0) {
    console.log(`\n⚠️  Other issues: ${others.length}`);
    others.forEach(r => console.log(`   - ${r.file}: ${r.status}`));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`Total: ${results.length} challenges validated`);
  console.log('='.repeat(80));
  
  // Exit with error code if any failures
  if (failed.length > 0 || errors.length > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});