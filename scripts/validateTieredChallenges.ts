import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { TestRunner } from '../src/apps/system-design/builder/simulation/testRunner.js';
import { Challenge, Solution, TestMetrics } from '../src/apps/system-design/builder/types/testCase.js';
import { SystemGraph } from '../src/apps/system-design/builder/types/graph.js';
import { ComponentType } from '../src/apps/system-design/builder/types/component.js';

// Get the current directory (ESM-compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load all tiered challenges
const tieredChallengesDir = path.join(__dirname, '../src/apps/system-design/builder/challenges/tiered');

// Result type for validation
interface ValidationResult {
  challenge: string;
  status: 'PASSED' | 'FAILED' | 'ERROR' | 'NO_SOLUTION';
  error?: string;
  testResults?: Array<{
    name: string;
    passed: boolean;
    metrics: TestMetrics;
  }>;
}

// Convert snake_case to camelCase for export names
function toCamelCase(str: string): string {
  return str.replace(/_([a-z0-9])/g, (g) => g[1].toUpperCase());
}

// Convert Solution to SystemGraph
function solutionToSystemGraph(solution: Solution): SystemGraph {
  // Generate unique IDs for components based on their type
  const componentCounts = new Map<string, number>();
  
  const components = solution.components.map((comp) => {
    const count = (componentCounts.get(comp.type) || 0) + 1;
    componentCounts.set(comp.type, count);
    const id = count === 1 ? comp.type : `${comp.type}_${count}`;
    
    return {
      id,
      type: comp.type as ComponentType,
      config: comp.config || {},
    };
  });

  // Map component types to their IDs for connections
  const typeToId = new Map<string, string>();
  const typeToIds = new Map<string, string[]>();
  
  components.forEach((comp) => {
    if (!typeToId.has(comp.type)) {
      typeToId.set(comp.type, comp.id);
    }
    
    const ids = typeToIds.get(comp.type) || [];
    ids.push(comp.id);
    typeToIds.set(comp.type, ids);
  });

  // Convert connections - use component type to find the ID
  const connections = solution.connections.map((conn) => {
    // For connections using component types, map to the corresponding IDs
    // If multiple components of same type exist, use the first one
    const fromId = typeToId.get(conn.from) || conn.from;
    const toId = typeToId.get(conn.to) || conn.to;
    
    return {
      from: fromId,
      to: toId,
      type: (conn as any).type || 'read_write',
    };
  });

  return { components, connections };
}

async function validateAllTieredChallenges() {
  console.log('Starting validation of all tiered challenges...\n');
  
  // Read all challenge files from the tiered directory
  const fs = await import('fs');
  let challengeFiles: string[] = [];
  
  try {
    challengeFiles = fs.readdirSync(tieredChallengesDir)
      .filter(f => f.endsWith('.ts') && f !== 'index.ts');
  } catch (error) {
    console.error('Error reading tiered challenges directory:', error);
    process.exit(1);
  }
  
  console.log(`Found ${challengeFiles.length} challenge files to validate.\n`);
  
  const results: ValidationResult[] = [];
  let totalPassed = 0;
  let totalFailed = 0;
  let totalNoSolution = 0;
  
  for (const file of challengeFiles) {
    const challengeFileName = file.replace('.ts', '');
    // Convert file name to camelCase and append "Challenge"
    const challengeExportName = toCamelCase(challengeFileName) + 'Challenge';
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Validating: ${challengeFileName}`);
    console.log('='.repeat(60));
    
    try {
      // Import the challenge module
      const modulePath = path.join(tieredChallengesDir, file);
      const module = await import(modulePath);
      
      // Try to find the challenge with the expected export name
      const challenge = module[challengeExportName] as Challenge;
      
      if (!challenge) {
        console.log(`[ERROR] No challenge export found for '${challengeExportName}'`);
        console.log(`  Available exports: ${Object.keys(module).join(', ')}`);
        results.push({
          challenge: challengeFileName,
          status: 'ERROR',
          error: `No challenge export named '${challengeExportName}'`,
        });
        totalFailed++;
        continue;
      }
      
      // Check if solution exists
      if (!challenge.solution) {
        console.log(`[WARNING] No solution found for '${challengeFileName}'`);
        results.push({
          challenge: challengeFileName,
          status: 'NO_SOLUTION',
        });
        totalNoSolution++;
        continue;
      }
      
      // Convert solution to SystemGraph
      const systemGraph = solutionToSystemGraph(challenge.solution);
      
      console.log(`\nSolution components:`);
      systemGraph.components.forEach(comp => {
        console.log(`  - ${comp.id} (${comp.type})`);
      });
      
      console.log(`\nSolution connections:`);
      systemGraph.connections.forEach(conn => {
        console.log(`  - ${conn.from} -> ${conn.to} (${conn.type})`);
      });
      
      // Run test cases
      const testRunner = new TestRunner();
      let allTestsPassed = true;
      const testResults: Array<{
        name: string;
        passed: boolean;
        metrics: TestMetrics;
      }> = [];
      
      console.log(`\nRunning ${challenge.testCases.length} test cases:`);
      
      for (let i = 0; i < challenge.testCases.length; i++) {
        const testCase = challenge.testCases[i];
        const testResult = testRunner.runTestCase(systemGraph, testCase);
        
        const testStatus = testResult.passed ? '[PASS]' : '[FAIL]';
        console.log(`  ${i + 1}. ${testCase.name}: ${testStatus}`);
        
        if (!testResult.passed) {
          allTestsPassed = false;
          console.log(`     Failures:`);
          
          // Extract failure details from the result
          if (testResult.metrics.errorRate > 0.01) {
            console.log(`     - Error rate: ${(testResult.metrics.errorRate * 100).toFixed(2)}%`);
          }
          if (testCase.passCriteria.maxP99Latency && testResult.metrics.p99Latency > testCase.passCriteria.maxP99Latency) {
            console.log(`     - P99 latency: ${testResult.metrics.p99Latency.toFixed(1)}ms (max: ${testCase.passCriteria.maxP99Latency}ms)`);
          }
          if (testCase.passCriteria.maxMonthlyCost && testResult.metrics.monthlyCost > testCase.passCriteria.maxMonthlyCost) {
            console.log(`     - Monthly cost: $${testResult.metrics.monthlyCost.toFixed(0)} (max: $${testCase.passCriteria.maxMonthlyCost})`);
          }
        }
        
        testResults.push({
          name: testCase.name,
          passed: testResult.passed,
          metrics: testResult.metrics,
        });
      }
      
      if (allTestsPassed) {
        console.log(`\n[SUCCESS] All tests PASSED for '${challengeFileName}'`);
        totalPassed++;
      } else {
        console.log(`\n[FAILURE] Some tests FAILED for '${challengeFileName}'`);
        totalFailed++;
      }
      
      results.push({
        challenge: challengeFileName,
        status: allTestsPassed ? 'PASSED' : 'FAILED',
        testResults,
      });
      
    } catch (error) {
      console.log(`[ERROR] Error validating '${challengeFileName}':`, error);
      results.push({
        challenge: challengeFileName,
        status: 'ERROR',
        error: error instanceof Error ? error.message : String(error),
      });
      totalFailed++;
    }
  }
  
  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total challenges: ${challengeFiles.length}`);
  console.log(`[PASS] Passed: ${totalPassed}`);
  console.log(`[FAIL] Failed: ${totalFailed}`);
  console.log(`[WARN] No solution: ${totalNoSolution}`);
  
  // List failed challenges
  if (totalFailed > 0) {
    console.log('\nFailed challenges:');
    results
      .filter(r => r.status === 'FAILED' || r.status === 'ERROR')
      .forEach(r => {
        console.log(`  - ${r.challenge}: ${r.status}`);
        if (r.error) {
          console.log(`    Error: ${r.error}`);
        }
      });
  }
  
  // List challenges without solutions
  if (totalNoSolution > 0) {
    console.log('\nChallenges without solutions:');
    results
      .filter(r => r.status === 'NO_SOLUTION')
      .forEach(r => {
        console.log(`  - ${r.challenge}`);
      });
  }
  
  // Save results to JSON
  const outputFile = path.join(__dirname, `validation-results-${new Date().toISOString().replace(/:/g, '-')}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${outputFile}`);
  
  process.exit(totalFailed > 0 ? 1 : 0);
}

// Run the validation
validateAllTieredChallenges().catch(console.error);