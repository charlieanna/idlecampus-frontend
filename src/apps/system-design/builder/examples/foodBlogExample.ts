import { SystemGraph } from '../types/graph';
import { TestCase } from '../types/testCase';
import { TestRunner } from '../simulation/testRunner';

/**
 * Food Blog Challenge - Example Designs
 * Focus: CDN for static content, S3 for object storage, bandwidth optimization
 */

// Good Design: App + DB + Redis → HTML, S3 + CDN → Images
export const foodBlogGoodDesign: SystemGraph = {
  components: [
    {
      id: 'lb',
      type: 'load_balancer',
      config: {},
    },
    {
      id: 'app',
      type: 'app_server',
      config: {
        instances: 1,
      },
    },
    {
      id: 'cache',
      type: 'redis',
      config: {
        memorySizeGB: 2,
        ttl: 3600,
        hitRatio: 0.85, // Blog posts are frequently accessed
      },
    },
    {
      id: 'db',
      type: 'postgresql',
      config: {
        readCapacity: 500,
        writeCapacity: 100,
        replication: false,
      },
    },
    {
      id: 'cdn',
      type: 'cdn',
      config: {
        enabled: true,
      },
    },
    {
      id: 's3',
      type: 's3',
      config: {
        storageSizeGB: 100, // 1000 posts × 5 images × 2MB = ~10GB, with buffer
      },
    },
  ],
  connections: [
    { from: 'lb', to: 'app', type: 'read_write' },
    { from: 'app', to: 'cache', type: 'read' },
    { from: 'cache', to: 'db', type: 'read' },
    { from: 'cdn', to: 's3', type: 'read' },
  ],
};

// Mediocre Design: No CDN, S3 only (slow for distant users, but correct)
export const foodBlogMediocreDesign: SystemGraph = {
  components: [
    {
      id: 'lb',
      type: 'load_balancer',
      config: {},
    },
    {
      id: 'app',
      type: 'app_server',
      config: {
        instances: 1,
      },
    },
    {
      id: 'db',
      type: 'postgresql',
      config: {
        readCapacity: 500,
        writeCapacity: 100,
        replication: false,
      },
    },
    {
      id: 's3',
      type: 's3',
      config: {
        storageSizeGB: 100,
      },
    },
  ],
  connections: [
    { from: 'lb', to: 'app', type: 'read_write' },
    { from: 'app', to: 'db', type: 'read_write' },
    { from: 'app', to: 's3', type: 'read' },
  ],
};

// Bad Design: Over-provisioned app servers serving images (expensive!)
export const foodBlogBadDesign: SystemGraph = {
  components: [
    {
      id: 'lb',
      type: 'load_balancer',
      config: {},
    },
    {
      id: 'app',
      type: 'app_server',
      config: {
        instances: 5, // Need many servers to handle image bandwidth
      },
    },
    {
      id: 'db',
      type: 'postgresql',
      config: {
        readCapacity: 500,
        writeCapacity: 100,
        replication: false,
      },
    },
  ],
  connections: [
    { from: 'lb', to: 'app', type: 'read_write' },
    { from: 'app', to: 'db', type: 'read_write' },
  ],
};

// Test Cases
export const foodBlogTestCases: TestCase[] = [
  {
    name: 'Normal Load',
    traffic: {
      type: 'read',
      rps: 100, // HTML requests
      avgResponseSizeMB: 2, // Images: 5 images × 2MB each = 10MB per page view
    },
    duration: 60,
    passCriteria: {
      maxP99Latency: 500,
      maxErrorRate: 0.01,
      maxMonthlyCost: 300,
    },
  },
  {
    name: 'Viral Post',
    traffic: {
      type: 'read',
      rps: 2000, // 20x spike - post hits Reddit
      avgResponseSizeMB: 2,
    },
    duration: 300, // 5 minutes of viral traffic
    passCriteria: {
      maxP99Latency: 1000, // Degradation OK during spike
      maxErrorRate: 0.05,
      // Cost criteria relaxed during spike
    },
  },
  {
    name: 'Image Heavy Load',
    traffic: {
      type: 'read',
      rps: 100,
      avgResponseSizeMB: 5, // Users browsing galleries (more images)
    },
    duration: 60,
    passCriteria: {
      maxP99Latency: 600,
      maxErrorRate: 0.01,
      maxMonthlyCost: 400, // Higher due to more bandwidth
    },
  },
];

/**
 * Run the Food Blog example
 */
export function runFoodBlogExample() {
  const runner = new TestRunner();

  console.log('='.repeat(80));
  console.log('FOOD BLOG CHALLENGE - SIMULATION RESULTS');
  console.log('='.repeat(80));

  console.log('\n--- Testing GOOD DESIGN (S3 + CDN) ---\n');
  const goodResults = runner.runAllTestCases(
    foodBlogGoodDesign,
    foodBlogTestCases
  );
  goodResults.forEach((result, index) => {
    console.log(`\nTest Case ${index + 1}: ${foodBlogTestCases[index].name}`);
    console.log(result.explanation);
    console.log('-'.repeat(80));
  });

  console.log('\n\n--- Testing MEDIOCRE DESIGN (S3 only, no CDN) ---\n');
  const mediocreResults = runner.runAllTestCases(
    foodBlogMediocreDesign,
    foodBlogTestCases
  );
  mediocreResults.forEach((result, index) => {
    console.log(`\nTest Case ${index + 1}: ${foodBlogTestCases[index].name}`);
    console.log(result.explanation);
    console.log('-'.repeat(80));
  });

  console.log('\n\n--- Testing BAD DESIGN (App servers serving images) ---\n');
  const badResults = runner.runAllTestCases(
    foodBlogBadDesign,
    foodBlogTestCases
  );
  badResults.forEach((result, index) => {
    console.log(`\nTest Case ${index + 1}: ${foodBlogTestCases[index].name}`);
    console.log(result.explanation);
    console.log('-'.repeat(80));
  });

  // Summary
  const goodPassed = goodResults.filter((r) => r.passed).length;
  const mediocrePassed = mediocreResults.filter((r) => r.passed).length;
  const badPassed = badResults.filter((r) => r.passed).length;

  console.log('\n\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(
    `Good Design (S3 + CDN): ${goodPassed}/${goodResults.length} tests passed`
  );
  console.log(
    `Mediocre Design (S3 only): ${mediocrePassed}/${mediocreResults.length} tests passed`
  );
  console.log(
    `Bad Design (App servers): ${badPassed}/${badResults.length} tests passed`
  );
  console.log('='.repeat(80));

  console.log('\n💡 Key Learning:');
  console.log(
    '- CDN dramatically reduces latency (5ms vs 100ms) and cost for static content'
  );
  console.log(
    '- S3 alone works but is slow for users far from the region'
  );
  console.log(
    '- Serving images from app servers is extremely expensive (bandwidth costs)'
  );
  console.log('='.repeat(80));
}

// Export for use in tests or CLI
if (require.main === module) {
  runFoodBlogExample();
}
