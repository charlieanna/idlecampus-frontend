/**
 * Tests for L6TestGenerator
 * Verifies that Google L6-level NFR tests are generated correctly
 */

import { L6TestGenerator } from './l6TestGeneratorFixed';
import { Challenge } from '../types/testCase';

// Simple test challenge
const testChallenge: Challenge = {
  id: 'test-challenge',
  title: 'Test Challenge',
  description: 'A test challenge for L6 generation',
  difficulty: 'medium',
  estimatedTime: '30 minutes',
  category: 'E-commerce',
  tier: 2,
  requirements: {
    traffic: '100K RPS',
    latency: 'P99 < 100ms',
    availability: '99.9%',
    budget: '$10K/month',
  },
  availableComponents: ['all'],
  testCases: [
    {
      name: 'Base Test',
      totalRps: 1000,
      readRps: 800,
      writeRps: 200,
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.01,
        maxMonthlyCost: 10000,
      },
    },
  ],
  learningObjectives: ['Test L6 generation'],
};

// Run the test
function testL6Generator() {
  console.log('Testing L6TestGenerator...\n');

  const enhanced = L6TestGenerator.enhanceChallenge(testChallenge);

  console.log('Original test cases:', testChallenge.testCases.length);
  console.log('Enhanced test cases:', enhanced.testCases.length);
  console.log('\nGenerated L6 tests:');

  // Show the new tests that were added
  const newTests = enhanced.testCases.slice(testChallenge.testCases.length);
  newTests.forEach((test, i) => {
    console.log(`\n${i + 1}. ${test.name}`);
    console.log(`   RPS: ${test.totalRps}`);
    console.log(`   Read/Write: ${test.readRps}/${test.writeRps}`);
    if (test.passCriteria) {
      console.log('   Pass Criteria:');
      if (test.passCriteria.maxP50Latency) {
        console.log(`     P50 < ${test.passCriteria.maxP50Latency}ms`);
      }
      if (test.passCriteria.maxP90Latency) {
        console.log(`     P90 < ${test.passCriteria.maxP90Latency}ms`);
      }
      if (test.passCriteria.maxP95Latency) {
        console.log(`     P95 < ${test.passCriteria.maxP95Latency}ms`);
      }
      if (test.passCriteria.maxP99Latency) {
        console.log(`     P99 < ${test.passCriteria.maxP99Latency}ms`);
      }
      if (test.passCriteria.maxP999Latency) {
        console.log(`     P999 < ${test.passCriteria.maxP999Latency}ms`);
      }
    }
  });

  // Verify we have L6-compliant tests
  const hasLatencyProfile = newTests.some(t => t.name.includes('Latency Profile'));
  const hasPeakLoad = newTests.some(t => t.name.includes('Peak Load'));
  const hasViralEvent = newTests.some(t => t.name.includes('Viral Event'));
  const hasCascadingFailure = newTests.some(t => t.name.includes('Cascading Failure'));

  console.log('\n✅ Test Results:');
  console.log(`   Latency Profile test: ${hasLatencyProfile ? '✓' : '✗'}`);
  console.log(`   Peak Load test: ${hasPeakLoad ? '✓' : '✗'}`);
  console.log(`   Viral Event test: ${hasViralEvent ? '✓' : '✗'}`);
  console.log(`   Cascading Failure test: ${hasCascadingFailure ? '✓' : '✗'}`);

  const allPassed = hasLatencyProfile && hasPeakLoad && hasViralEvent && hasCascadingFailure;
  console.log(`\n${allPassed ? '🎉 All L6 tests generated successfully!' : '❌ Some L6 tests missing'}`);
}

// Run the test
testL6Generator();