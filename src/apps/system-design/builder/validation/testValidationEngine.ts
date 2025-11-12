import { SystemDesignValidator } from '../validation/SystemDesignValidator';
import { tinyUrlProblemDefinition } from '../challenges/tinyUrlProblemDefinition';
import { SystemGraph } from '../types/graph';

/**
 * Test the validation engine with different designs
 */

console.log('=== Testing System Design Validation Engine ===\n');

// Test 1: Minimal design (should pass Level 1)
const minimalDesign: SystemGraph = {
  components: [
    { id: 'client_1', type: 'client', config: {} },
    { id: 'app_1', type: 'app_server', config: { instances: 1 } },
    { id: 'db_1', type: 'postgresql', config: { readCapacity: 10, writeCapacity: 10 } },
  ],
  connections: [
    { from: 'client_1', to: 'app_1' },
    { from: 'app_1', to: 'db_1' },
  ],
};

console.log('TEST 1: Minimal Design (Client → App → DB)');
console.log('Expected: Pass Level 1, Fail Level 2\n');

const validator = new SystemDesignValidator();

// Level 1 (1 RPS)
const level1Result = validator.validate(minimalDesign, tinyUrlProblemDefinition, 0);
console.log('Level 1 Result:', {
  passed: level1Result.passed,
  latency: level1Result.metrics.p99Latency.toFixed(0) + 'ms',
  cost: '$' + level1Result.metrics.totalCost.toFixed(0),
  architectureFeedback: level1Result.architectureFeedback,
});

// Level 2 (100 RPS)
const level2Result = validator.validate(minimalDesign, tinyUrlProblemDefinition, 1);
console.log('\nLevel 2 Result (100 RPS):', {
  passed: level2Result.passed,
  latency: level2Result.metrics.p99Latency.toFixed(0) + 'ms',
  cost: '$' + level2Result.metrics.totalCost.toFixed(0),
  bottlenecks: level2Result.bottlenecks.map(b => ({
    component: b.componentId,
    utilization: (b.utilization * 100).toFixed(0) + '%',
    recommendation: b.recommendation,
  })),
  architectureFeedback: level2Result.architectureFeedback,
});

// Test 2: Add cache (should pass Level 3)
const cachedDesign: SystemGraph = {
  components: [
    { id: 'client_1', type: 'client', config: {} },
    { id: 'app_1', type: 'app_server', config: { instances: 1 } },
    { id: 'redis_1', type: 'redis', config: { memorySizeGB: 4, hitRatio: 0.9 } },
    { id: 'db_1', type: 'postgresql', config: { readCapacity: 200, writeCapacity: 200 } },
  ],
  connections: [
    { from: 'client_1', to: 'app_1' },
    { from: 'app_1', to: 'redis_1' },
    { from: 'redis_1', to: 'db_1' },
  ],
};

console.log('\n\nTEST 2: Cached Design (Client → App → Redis → DB)');
console.log('Expected: Pass Level 3\n');

const level3Result = validator.validate(cachedDesign, tinyUrlProblemDefinition, 2);
console.log('Level 3 Result (1000 RPS with cache):', {
  passed: level3Result.passed,
  latency: level3Result.metrics.p99Latency.toFixed(0) + 'ms',
  cost: '$' + level3Result.metrics.totalCost.toFixed(0),
  bottlenecks: level3Result.bottlenecks.map(b => ({
    component: b.componentId,
    utilization: (b.utilization * 100).toFixed(0) + '%',
  })),
  architectureFeedback: level3Result.architectureFeedback,
});

// Test 3: Bad design (client → DB directly)
const badDesign: SystemGraph = {
  components: [
    { id: 'client_1', type: 'client', config: {} },
    { id: 'db_1', type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000 } },
  ],
  connections: [
    { from: 'client_1', to: 'db_1' },
  ],
};

console.log('\n\nTEST 3: Bad Design (Client → DB directly, no app server)');
console.log('Expected: Fail architecture validation\n');

const badResult = validator.validate(badDesign, tinyUrlProblemDefinition, 0);
console.log('Bad Design Result:', {
  passed: badResult.passed,
  architectureFeedback: badResult.architectureFeedback,
});

// Test 4: Wrong cache position
const wrongCachePosition: SystemGraph = {
  components: [
    { id: 'client_1', type: 'client', config: {} },
    { id: 'redis_1', type: 'redis', config: { memorySizeGB: 4, hitRatio: 0.9 } },
    { id: 'app_1', type: 'app_server', config: { instances: 1 } },
    { id: 'db_1', type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000 } },
  ],
  connections: [
    { from: 'client_1', to: 'redis_1' },
    { from: 'redis_1', to: 'app_1' },
    { from: 'app_1', to: 'db_1' },
  ],
};

console.log('\n\nTEST 4: Wrong Cache Position (Client → Cache → App → DB)');
console.log('Expected: Fail connection flow validation\n');

const wrongCacheResult = validator.validate(wrongCachePosition, tinyUrlProblemDefinition, 2);
console.log('Wrong Cache Result:', {
  passed: wrongCacheResult.passed,
  architectureFeedback: wrongCacheResult.architectureFeedback,
});

// Test 5: CDN overkill
const cdnDesign: SystemGraph = {
  components: [
    { id: 'client_1', type: 'client', config: {} },
    { id: 'cdn_1', type: 'cdn', config: {} },
    { id: 'app_1', type: 'app_server', config: { instances: 1 } },
    { id: 'db_1', type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000 } },
  ],
  connections: [
    { from: 'client_1', to: 'cdn_1' },
    { from: 'cdn_1', to: 'app_1' },
    { from: 'app_1', to: 'db_1' },
  ],
};

console.log('\n\nTEST 5: CDN for Dynamic Content (TinyURL)');
console.log('Expected: Fail CDN validation\n');

const cdnResult = validator.validate(cdnDesign, tinyUrlProblemDefinition, 2);
console.log('CDN Result:', {
  passed: cdnResult.passed,
  architectureFeedback: cdnResult.architectureFeedback,
});

console.log('\n\n=== Validation Engine Test Complete ===');
