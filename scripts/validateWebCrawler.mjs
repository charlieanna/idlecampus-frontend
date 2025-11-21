#!/usr/bin/env node

/**
 * Validate web-crawler challenge solution against all test cases
 */

import { webCrawlerChallenge } from '../src/apps/system-design/builder/challenges/webCrawler.ts';

console.log('🧪 Validating Web Crawler Challenge Solution\n');
console.log('=' .repeat(60));

const solution = webCrawlerChallenge.solution;

console.log('\n📦 Solution Components:');
solution.components.forEach(comp => {
  console.log(`   - ${comp.type}: ${JSON.stringify(comp.config)}`);
});

console.log('\n🔗 Solution Connections:');
solution.connections.forEach(conn => {
  console.log(`   - ${conn.from} → ${conn.to}`);
});

console.log('\n🧪 Test Cases:');
console.log('=' .repeat(60));

const testResults = webCrawlerChallenge.testCases.map((test, idx) => {
  console.log(`\n${idx + 1}. [${test.type.toUpperCase()}] ${test.name}`);
  console.log(`   Requirement: ${test.requirement || 'N/A'}`);
  console.log(`   Traffic: ${test.traffic.rps} RPS (${test.traffic.type})`);
  
  // Check if test has a specific solution requirement
  const hasTestSolution = test.solution !== undefined;
  
  if (hasTestSolution) {
    console.log(`   ✅ Has embedded test solution`);
    console.log(`   Required components: ${test.solution.components.map(c => c.type).join(', ')}`);
  } else {
    console.log(`   ⚠️  Uses global solution`);
  }
  
  // Check pass criteria
  const criteria = test.passCriteria;
  console.log(`   Pass Criteria:`);
  if (criteria.maxP99Latency) console.log(`      - Max p99 latency: ${criteria.maxP99Latency}ms`);
  if (criteria.maxErrorRate !== undefined) console.log(`      - Max error rate: ${(criteria.maxErrorRate * 100).toFixed(2)}%`);
  if (criteria.maxMonthlyCost) console.log(`      - Max monthly cost: $${criteria.maxMonthlyCost}`);
  if (criteria.minAvailability) console.log(`      - Min availability: ${(criteria.minAvailability * 100).toFixed(2)}%`);
  
  // Validation logic
  const componentTypes = new Set(solution.components.map(c => c.type));
  const requiredComponents = ['worker', 'message_queue', 'redis', 'postgresql', 's3'];
  const missingComponents = requiredComponents.filter(c => !componentTypes.has(c));
  
  if (missingComponents.length > 0) {
    console.log(`   ❌ LIKELY FAIL - Missing components: ${missingComponents.join(', ')}`);
    return { test: test.name, status: 'FAIL', reason: `Missing: ${missingComponents.join(', ')}` };
  }
  
  // Check worker instances for performance tests
  const workerComp = solution.components.find(c => c.type === 'worker');
  if (test.type === 'performance' && test.traffic.rps >= 200) {
    if (!workerComp || workerComp.config.instances < 4) {
      console.log(`   ⚠️  WARNING - May need more workers (current: ${workerComp?.config?.instances || 0})`);
      return { test: test.name, status: 'WARNING', reason: 'Insufficient workers' };
    }
  }
  
  // Check database replication for reliability tests
  if (test.type === 'reliability') {
    const dbComp = solution.components.find(c => c.type === 'postgresql');
    if (!dbComp?.config?.replication?.enabled) {
      console.log(`   ❌ LIKELY FAIL - Database replication not enabled`);
      return { test: test.name, status: 'FAIL', reason: 'No DB replication' };
    }
  }
  
  console.log(`   ✅ LIKELY PASS`);
  return { test: test.name, status: 'PASS', reason: '' };
});

console.log('\n' + '=' .repeat(60));
console.log('📊 Summary:');
console.log('=' .repeat(60));

const summary = testResults.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] || 0) + 1;
  return acc;
}, {});

console.log(`\n   ✅ Likely PASS: ${summary.PASS || 0}`);
console.log(`   ⚠️  WARNING: ${summary.WARNING || 0}`);
console.log(`   ❌ Likely FAIL: ${summary.FAIL || 0}`);
console.log(`   Total: ${testResults.length}`);

// Show failures
const failures = testResults.filter(r => r.status === 'FAIL');
if (failures.length > 0) {
  console.log('\n❌ Failed Tests:');
  failures.forEach(f => {
    console.log(`   - ${f.test}: ${f.reason}`);
  });
}

const warnings = testResults.filter(r => r.status === 'WARNING');
if (warnings.length > 0) {
  console.log('\n⚠️  Warning Tests:');
  warnings.forEach(w => {
    console.log(`   - ${w.test}: ${w.reason}`);
  });
}

console.log('\n' + '=' .repeat(60));
console.log(`Expected: 14/16 passing (user report)`);
console.log(`Predicted: ${summary.PASS || 0}/${testResults.length} passing`);
console.log('=' .repeat(60));