#!/usr/bin/env tsx

import { ticketMasterChallenge } from '../src/apps/system-design/builder/challenges/ticketMaster';
import { TestRunner } from '../src/apps/system-design/builder/simulation/testRunner';

console.log('🎟️ Testing TicketMaster Challenge Solution\n');

const runner = new TestRunner(ticketMasterChallenge);

if (!ticketMasterChallenge.solution) {
  console.error('❌ No solution defined for ticketMaster challenge');
  process.exit(1);
}

const testCases = ticketMasterChallenge.testCases;

for (let i = 0; i < testCases.length; i++) {
  const testCase = testCases[i];
  console.log(`\n📝 Test ${i + 1}: ${testCase.name}`);
  console.log(`   Type: ${testCase.type} (${testCase.requirement})`);
  console.log(`   Traffic: ${testCase.traffic.rps} RPS (read ratio: ${testCase.traffic.readRatio || 0})`);
  
  try {
    const result = runner.runTest(testCase, ticketMasterChallenge.solution);
    
    console.log(`   Metrics:`);
    console.log(`     - Latency: p50=${result.metrics.p50Latency}ms, p99=${result.metrics.p99Latency}ms`);
    console.log(`     - Error Rate: ${(result.metrics.errorRate * 100).toFixed(2)}%`);
    console.log(`     - Cost: $${result.metrics.monthlyCost.toFixed(2)}/mo`);
    console.log(`     - Availability: ${(result.metrics.availability * 100).toFixed(2)}%`);
    
    if (testCase.passCriteria.maxP99Latency) {
      const passed = result.metrics.p99Latency <= testCase.passCriteria.maxP99Latency;
      console.log(`     - Latency Check: ${passed ? '✅' : '❌'} (${result.metrics.p99Latency}ms vs ${testCase.passCriteria.maxP99Latency}ms limit)`);
    }
    
    if (testCase.passCriteria.maxErrorRate !== undefined) {
      const passed = result.metrics.errorRate <= testCase.passCriteria.maxErrorRate;
      console.log(`     - Error Rate Check: ${passed ? '✅' : '❌'} (${(result.metrics.errorRate * 100).toFixed(2)}% vs ${(testCase.passCriteria.maxErrorRate * 100).toFixed(2)}% limit)`);
    }
    
    if (testCase.passCriteria.maxMonthlyCost) {
      const costToCheck = result.metrics.infrastructureCost ?? result.metrics.monthlyCost;
      const passed = costToCheck <= testCase.passCriteria.maxMonthlyCost;
      console.log(`     - Cost Check: ${passed ? '✅' : '❌'} ($${costToCheck.toFixed(2)} vs $${testCase.passCriteria.maxMonthlyCost} limit)`);
    }
    
    if (testCase.passCriteria.minAvailability !== undefined) {
      const passed = result.metrics.availability >= testCase.passCriteria.minAvailability;
      console.log(`     - Availability Check: ${passed ? '✅' : '❌'} (${(result.metrics.availability * 100).toFixed(2)}% vs ${(testCase.passCriteria.minAvailability * 100).toFixed(2)}% minimum)`);
    }
    
    console.log(`   Result: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
    if (!result.passed) {
      console.log(`   Reason: ${result.explanation}`);
    }
  } catch (error) {
    console.error(`   ❌ ERROR: ${error}`);
  }
}

console.log('\n' + '='.repeat(80));