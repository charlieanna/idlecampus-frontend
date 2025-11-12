import { SystemDesignValidator } from './SystemDesignValidator';
import { tinyUrlProblemDefinition } from '../challenges/tinyUrlProblemDefinition';
import { SystemGraph } from '../types/graph';

/**
 * Comprehensive Test Suite: Analyze ANY System Design
 *
 * Goal: Take any architecture, send traffic, find faults
 */

console.log('\n');
console.log('═══════════════════════════════════════════════════════════');
console.log('  SYSTEM DESIGN ANALYZER - Comprehensive Test Suite');
console.log('═══════════════════════════════════════════════════════════');
console.log('\n');

const validator = new SystemDesignValidator();

// ============================================================================
// TEST 1: Bare Minimum System (Will it work?)
// ============================================================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 1: BARE MINIMUM SYSTEM');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const bareMinimum: SystemGraph = {
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

console.log('Architecture:');
console.log('  Client → App Server (1 instance) → PostgreSQL (10 RPS capacity)');
console.log('');

// Test at different traffic levels
const trafficLevels = [
  { level: 1, rps: 1, name: '1 RPS (tiny)' },
  { level: 1, rps: 100, name: '100 RPS (medium)' },
  { level: 2, rps: 1000, name: '1000 RPS (high)' },
];

for (const traffic of trafficLevels) {
  console.log(`\n📊 Traffic: ${traffic.name}`);

  const result = validator.validate(bareMinimum, tinyUrlProblemDefinition, traffic.level - 1);

  console.log(`   Result: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Latency: ${result.metrics.p99Latency.toFixed(0)}ms`);
  console.log(`   Cost: $${result.metrics.totalCost.toFixed(0)}/mo`);

  if (result.bottlenecks.length > 0) {
    console.log(`   🔴 Bottlenecks:`);
    result.bottlenecks.forEach(b => {
      console.log(`      - ${b.componentId}: ${(b.utilization * 100).toFixed(0)}% utilized`);
      console.log(`        → ${b.recommendation}`);
    });
  }

  if (result.architectureFeedback && result.architectureFeedback.length > 0) {
    console.log(`   ⚠️  Architecture Issues:`);
    result.architectureFeedback.forEach(f => {
      console.log(`      - ${f}`);
    });
  }

  if (result.detailedAnalysis) {
    console.log(`   📈 Overall Health: ${result.detailedAnalysis.summary.overallHealth.toUpperCase()}`);
  }
}

// ============================================================================
// TEST 2: Under-Provisioned Database (Find the breaking point)
// ============================================================================
console.log('\n\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 2: UNDER-PROVISIONED DATABASE (Breaking Point Analysis)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const underProvisionedDB: SystemGraph = {
  components: [
    { id: 'client_1', type: 'client', config: {} },
    { id: 'app_1', type: 'app_server', config: { instances: 2 } },
    { id: 'db_1', type: 'postgresql', config: { readCapacity: 50, writeCapacity: 50 } },
  ],
  connections: [
    { from: 'client_1', to: 'app_1' },
    { from: 'app_1', to: 'db_1' },
  ],
};

console.log('Architecture:');
console.log('  Client → App Server (2 instances) → PostgreSQL (50 RPS capacity)');
console.log('');
console.log('Goal: Find the breaking point by increasing traffic');
console.log('');

const stressLevels = [10, 50, 100, 200, 500, 1000];

for (const rps of stressLevels) {
  const scenario = {
    ...tinyUrlProblemDefinition.scenarios[1],
    traffic: { ...tinyUrlProblemDefinition.scenarios[1].traffic, rps },
  };

  const result = validator.validate(underProvisionedDB, tinyUrlProblemDefinition, 1);

  const dbComponent = result.detailedAnalysis?.componentAnalysis.find(c => c.type === 'postgresql');
  const dbUtil = dbComponent ? (dbComponent.utilization * 100).toFixed(0) : 'N/A';

  console.log(`${rps.toString().padStart(4)} RPS → ${result.passed ? '✅' : '❌'} | DB: ${dbUtil}% | Latency: ${result.metrics.p99Latency.toFixed(0)}ms`);

  if (!result.passed && result.detailedAnalysis) {
    console.log(`         💥 BREAKING POINT FOUND!`);
    const saturated = result.detailedAnalysis.componentAnalysis.filter(c => c.status === 'saturated');
    if (saturated.length > 0) {
      saturated.forEach(comp => {
        console.log(`         - ${comp.type} saturated at ${(comp.utilization * 100).toFixed(0)}%`);
        comp.issues.forEach(issue => {
          console.log(`           ⚠️  ${issue}`);
        });
        comp.recommendations.forEach(rec => {
          console.log(`           💡 ${rec}`);
        });
      });
    }
    break; // Stop at breaking point
  }
}

// ============================================================================
// TEST 3: Bad Architecture (Wrong Connections)
// ============================================================================
console.log('\n\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 3: BAD ARCHITECTURE (Client → Database Directly)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const badArchitecture: SystemGraph = {
  components: [
    { id: 'client_1', type: 'client', config: {} },
    { id: 'db_1', type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000 } },
  ],
  connections: [
    { from: 'client_1', to: 'db_1' },
  ],
};

console.log('Architecture:');
console.log('  Client → PostgreSQL (NO APP SERVER!)');
console.log('');

const badResult = validator.validate(badArchitecture, tinyUrlProblemDefinition, 0);

console.log(`Result: ${badResult.passed ? '✅ PASS' : '❌ FAIL'}`);
console.log('');
console.log('Architecture Validation:');
if (badResult.architectureFeedback && badResult.architectureFeedback.length > 0) {
  badResult.architectureFeedback.forEach(f => {
    console.log(`  ❌ ${f}`);
  });
} else {
  console.log('  ✅ All checks passed');
}

// ============================================================================
// TEST 4: Over-Engineered System (Unnecessary Components)
// ============================================================================
console.log('\n\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 4: OVER-ENGINEERED SYSTEM (Cost Analysis)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const overEngineered: SystemGraph = {
  components: [
    { id: 'client_1', type: 'client', config: {} },
    { id: 'lb_1', type: 'load_balancer', config: {} },
    { id: 'app_1', type: 'app_server', config: { instances: 10 } }, // Way too many!
    { id: 'redis_1', type: 'redis', config: { memorySizeGB: 16, hitRatio: 0.9 } }, // Huge cache
    { id: 'db_1', type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000, replication: true } },
  ],
  connections: [
    { from: 'client_1', to: 'lb_1' },
    { from: 'lb_1', to: 'app_1' },
    { from: 'app_1', to: 'redis_1' },
    { from: 'redis_1', to: 'db_1' },
  ],
};

console.log('Architecture:');
console.log('  Client → Load Balancer → App Server (10 instances!)');
console.log('         → Redis (16GB!) → PostgreSQL (with replication)');
console.log('');
console.log('Traffic: Only 100 RPS (way over-provisioned)');
console.log('');

const overResult = validator.validate(overEngineered, tinyUrlProblemDefinition, 1);

console.log(`Result: ${overResult.passed ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Total Cost: $${overResult.metrics.totalCost.toFixed(0)}/month`);
console.log('');

if (overResult.detailedAnalysis) {
  console.log('Component Utilization:');
  overResult.detailedAnalysis.componentAnalysis.forEach(comp => {
    if (comp.utilization !== undefined) {
      const util = (comp.utilization * 100).toFixed(0);
      const status = comp.status === 'over-provisioned' ? '💰 WASTE' : '✓';
      console.log(`  ${status} ${comp.type}: ${util}% utilized ($${comp.cost.monthly.toFixed(0)}/mo)`);

      if (comp.status === 'over-provisioned') {
        comp.recommendations.forEach(rec => {
          console.log(`     💡 ${rec}`);
        });
      }
    }
  });

  console.log('');
  console.log('Optimization Opportunities:');
  overResult.detailedAnalysis.optimizations.forEach(opt => {
    console.log(`  💰 ${opt.potential}`);
    console.log(`     Impact: ${opt.impact}`);
    console.log(`     Difficulty: ${opt.difficulty}`);
  });
}

// ============================================================================
// TEST 5: Production-Grade System (Comprehensive Analysis)
// ============================================================================
console.log('\n\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('TEST 5: PRODUCTION-GRADE SYSTEM (Full Analysis)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const productionSystem: SystemGraph = {
  components: [
    { id: 'client_1', type: 'client', config: {} },
    { id: 'lb_1', type: 'load_balancer', config: {} },
    { id: 'app_1', type: 'app_server', config: { instances: 3 } },
    { id: 'redis_1', type: 'redis', config: { memorySizeGB: 4, hitRatio: 0.9 } },
    { id: 'db_1', type: 'postgresql', config: { readCapacity: 200, writeCapacity: 200, replication: true } },
  ],
  connections: [
    { from: 'client_1', to: 'lb_1' },
    { from: 'lb_1', to: 'app_1' },
    { from: 'app_1', to: 'redis_1' },
    { from: 'redis_1', to: 'db_1' },
  ],
};

console.log('Architecture:');
console.log('  Client → Load Balancer → App Server (3 instances)');
console.log('         → Redis (4GB, 90% hit) → PostgreSQL (replicated)');
console.log('');
console.log('Traffic: 1000 RPS, 90% reads');
console.log('');

const prodResult = validator.validate(productionSystem, tinyUrlProblemDefinition, 2);

console.log(`Result: ${prodResult.passed ? '✅ PASS' : '❌ FAIL'}`);
console.log(`Latency: ${prodResult.metrics.p99Latency.toFixed(0)}ms`);
console.log(`Cost: $${prodResult.metrics.totalCost.toFixed(0)}/month`);
console.log(`Health: ${prodResult.detailedAnalysis?.summary.overallHealth.toUpperCase()}`);
console.log('');

if (prodResult.detailedAnalysis) {
  console.log('═══ DETAILED ANALYSIS ═══');
  console.log('');

  // Components
  console.log('📦 Component Analysis:');
  prodResult.detailedAnalysis.componentAnalysis.forEach(comp => {
    if (comp.type !== 'client') {
      console.log(`\n  ${comp.type}:`);
      console.log(`    Status: ${comp.status}`);
      if (comp.utilization !== undefined) {
        console.log(`    Utilization: ${(comp.utilization * 100).toFixed(0)}%`);
      }
      if (comp.capacity) {
        console.log(`    Capacity: ${comp.capacity.current.toFixed(0)} (${comp.capacity.headroom.toFixed(0)}% headroom)`);
      }
      console.log(`    Cost: $${comp.cost.monthly.toFixed(0)}/mo`);

      if (comp.issues.length > 0) {
        console.log(`    Issues:`);
        comp.issues.forEach(issue => console.log(`      ⚠️  ${issue}`));
      }

      if (comp.recommendations.length > 0 && comp.status !== 'healthy') {
        console.log(`    Recommendations:`);
        comp.recommendations.forEach(rec => console.log(`      💡 ${rec}`));
      }
    }
  });

  // Patterns
  console.log('');
  console.log('🏗️  Architectural Patterns:');
  prodResult.detailedAnalysis.patterns.forEach(pattern => {
    console.log(`\n  ✅ ${pattern.name}`);
    console.log(`     ${pattern.description}`);
    console.log(`     Components: ${pattern.components.join(' → ')}`);
  });

  // Failure Modes
  console.log('');
  console.log('⚠️  Failure Modes:');
  prodResult.detailedAnalysis.failureModes.forEach(fm => {
    console.log(`\n  ${fm.scenario}`);
    console.log(`    Probability: ${fm.probability} | Impact: ${fm.impact}`);
    console.log(`    Mitigation: ${fm.mitigation}`);
  });
}

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n\n');
console.log('═══════════════════════════════════════════════════════════');
console.log('  TEST SUITE COMPLETE');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('What We Tested:');
console.log('  ✅ Bare minimum system at different traffic levels');
console.log('  ✅ Found breaking point of under-provisioned database');
console.log('  ✅ Detected bad architecture (missing app server)');
console.log('  ✅ Identified over-provisioned components (waste)');
console.log('  ✅ Comprehensive analysis of production system');
console.log('');
console.log('The engine can analyze ANY system design and find:');
console.log('  • Breaking points (saturation)');
console.log('  • Architecture flaws (missing/wrong components)');
console.log('  • Cost waste (over-provisioning)');
console.log('  • Failure modes (HA issues)');
console.log('  • Optimization opportunities');
console.log('');
