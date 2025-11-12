import { SystemDesignValidator } from './SystemDesignValidator';
import { tinyUrlProblemDefinition } from '../challenges/tinyUrlProblemDefinition';
import { SystemGraph } from '../types/graph';

/**
 * SIMPLE TEST: Easy to understand
 *
 * Show: System → Traffic → What Breaks → Why → How to Fix
 */

const validator = new SystemDesignValidator();

function drawBox(title: string) {
  console.log('\n┌' + '─'.repeat(78) + '┐');
  console.log('│ ' + title.padEnd(77) + '│');
  console.log('└' + '─'.repeat(78) + '┘\n');
}

function drawSystem(graph: SystemGraph) {
  console.log('SYSTEM ARCHITECTURE:');
  console.log('');

  // Show components
  graph.components.forEach(comp => {
    const config = Object.keys(comp.config).length > 0
      ? ` (${Object.entries(comp.config).map(([k, v]) => `${k}:${v}`).join(', ')})`
      : '';
    console.log(`  📦 ${comp.type}${config}`);
  });

  console.log('');
  console.log('CONNECTIONS:');
  graph.connections.forEach(conn => {
    const fromComp = graph.components.find(c => c.id === conn.from);
    const toComp = graph.components.find(c => c.id === conn.to);
    console.log(`  ${fromComp?.type} → ${toComp?.type}`);
  });
  console.log('');
}

// =============================================================================
// EXAMPLE 1: Simple System at Low Traffic (Should Work)
// =============================================================================
drawBox('EXAMPLE 1: Client → App → Database at LOW TRAFFIC');

const simpleSystem: SystemGraph = {
  components: [
    { id: 'client', type: 'client', config: {} },
    { id: 'app', type: 'app_server', config: { instances: 1 } },
    { id: 'db', type: 'postgresql', config: { readCapacity: 100, writeCapacity: 100 } },
  ],
  connections: [
    { from: 'client', to: 'app' },
    { from: 'app', to: 'db' },
  ],
};

drawSystem(simpleSystem);

console.log('SENDING TRAFFIC: 10 RPS');
console.log('');

const result1 = validator.validate(simpleSystem, tinyUrlProblemDefinition, 0);

console.log(`RESULT: ${result1.passed ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Latency: ${result1.metrics.p99Latency.toFixed(0)}ms`);
console.log(`  Error Rate: ${(result1.metrics.errorRate * 100).toFixed(1)}%`);
console.log(`  Monthly Cost: $${result1.metrics.totalCost.toFixed(0)}`);

if (result1.detailedAnalysis) {
  console.log('');
  console.log('COMPONENT HEALTH:');
  result1.detailedAnalysis.componentAnalysis.forEach(comp => {
    if (comp.type !== 'client') {
      const healthEmoji = comp.status === 'healthy' ? '✅' :
                         comp.status === 'warning' ? '⚠️' :
                         comp.status === 'saturated' ? '🔴' : '💰';
      console.log(`  ${healthEmoji} ${comp.type}: ${(comp.utilization * 100).toFixed(0)}% utilized`);
    }
  });
}

// =============================================================================
// EXAMPLE 2: Same System at HIGH TRAFFIC (Will Break)
// =============================================================================
drawBox('EXAMPLE 2: Same System at HIGH TRAFFIC (1000 RPS)');

console.log('Same architecture, but with 1000 RPS:');
console.log('');

const result2 = validator.validate(simpleSystem, tinyUrlProblemDefinition, 2);

console.log(`RESULT: ${result2.passed ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Latency: ${result2.metrics.p99Latency.toFixed(0)}ms (target: <100ms)`);
console.log(`  Error Rate: ${(result2.metrics.errorRate * 100).toFixed(1)}%`);
console.log('');

if (result2.bottlenecks.length > 0) {
  console.log('💥 WHAT BROKE:');
  result2.bottlenecks.forEach(b => {
    console.log(`  🔴 ${b.componentId}`);
    console.log(`     Utilization: ${(b.utilization * 100).toFixed(0)}%`);
    console.log(`     Problem: ${b.recommendation}`);
  });
  console.log('');
}

if (result2.detailedAnalysis) {
  const saturated = result2.detailedAnalysis.componentAnalysis.filter(c => c.status === 'saturated');
  if (saturated.length > 0) {
    console.log('DETAILED ANALYSIS:');
    saturated.forEach(comp => {
      console.log(`\n  Component: ${comp.type}`);
      console.log(`  Status: SATURATED`);
      console.log(`  Utilization: ${(comp.utilization * 100).toFixed(0)}%`);
      console.log(`  Capacity: ${comp.capacity.current} RPS`);
      console.log(`  Used: ${comp.capacity.used.toFixed(0)} RPS`);
      console.log(`  Headroom: ${comp.capacity.headroom.toFixed(0)}%`);
      console.log('');
      console.log('  Issues:');
      comp.issues.forEach(issue => console.log(`    ❌ ${issue}`));
      console.log('');
      console.log('  How to Fix:');
      comp.recommendations.forEach(rec => console.log(`    💡 ${rec}`));
    });
  }
}

// =============================================================================
// EXAMPLE 3: Fixed System with Cache (Should Work at High Traffic)
// =============================================================================
drawBox('EXAMPLE 3: Add Cache to Handle 1000 RPS');

const systemWithCache: SystemGraph = {
  components: [
    { id: 'client', type: 'client', config: {} },
    { id: 'app', type: 'app_server', config: { instances: 1 } },
    { id: 'cache', type: 'redis', config: { memorySizeGB: 4, hitRatio: 0.9 } },
    { id: 'db', type: 'postgresql', config: { readCapacity: 200, writeCapacity: 200 } },
  ],
  connections: [
    { from: 'client', to: 'app' },
    { from: 'app', to: 'cache' },
    { from: 'cache', to: 'db' },
  ],
};

drawSystem(systemWithCache);

console.log('SENDING TRAFFIC: 1000 RPS (same as before)');
console.log('');

const result3 = validator.validate(systemWithCache, tinyUrlProblemDefinition, 2);

console.log(`RESULT: ${result3.passed ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Latency: ${result3.metrics.p99Latency.toFixed(0)}ms`);
console.log(`  Error Rate: ${(result3.metrics.errorRate * 100).toFixed(1)}%`);
console.log(`  Monthly Cost: $${result3.metrics.totalCost.toFixed(0)}`);
console.log('');

if (result3.detailedAnalysis) {
  console.log('WHY IT WORKS NOW:');
  console.log('');

  const cache = result3.detailedAnalysis.componentAnalysis.find(c => c.type === 'redis');
  if (cache && cache.recommendations.length > 0) {
    cache.recommendations.forEach(rec => {
      if (rec.includes('reduces DB load')) {
        console.log(`  ✅ ${rec}`);
      }
    });
  }

  console.log('');
  console.log('COMPONENT HEALTH:');
  result3.detailedAnalysis.componentAnalysis.forEach(comp => {
    if (comp.type !== 'client') {
      const healthEmoji = comp.status === 'healthy' ? '✅' :
                         comp.status === 'warning' ? '⚠️' : '🔴';
      console.log(`  ${healthEmoji} ${comp.type}: ${(comp.utilization * 100).toFixed(0)}% utilized`);
    }
  });

  if (result3.detailedAnalysis.patterns.length > 0) {
    console.log('');
    console.log('PATTERNS DETECTED:');
    result3.detailedAnalysis.patterns.forEach(p => {
      console.log(`  ✅ ${p.name}`);
      console.log(`     ${p.description}`);
    });
  }
}

// =============================================================================
// EXAMPLE 4: Wrong Architecture (Missing App Server)
// =============================================================================
drawBox('EXAMPLE 4: Bad Architecture (Client → Database Directly)');

const badSystem: SystemGraph = {
  components: [
    { id: 'client', type: 'client', config: {} },
    { id: 'db', type: 'postgresql', config: { readCapacity: 1000, writeCapacity: 1000 } },
  ],
  connections: [
    { from: 'client', to: 'db' },
  ],
};

drawSystem(badSystem);

console.log('SENDING TRAFFIC: 100 RPS');
console.log('');

const result4 = validator.validate(badSystem, tinyUrlProblemDefinition, 1);

console.log(`RESULT: ${result4.passed ? '✅ PASS' : '❌ FAIL'}`);
console.log('');

if (result4.architectureFeedback && result4.architectureFeedback.length > 0) {
  console.log('ARCHITECTURE PROBLEMS:');
  result4.architectureFeedback.forEach(f => {
    console.log(`  ❌ ${f}`);
  });
}

// =============================================================================
// SUMMARY
// =============================================================================
drawBox('SUMMARY: What the Engine Can Analyze');

console.log('The validation engine can take ANY system and tell you:');
console.log('');
console.log('1. ✅ Does it work?');
console.log('   → Checks architecture, connections, performance');
console.log('');
console.log('2. 💥 What breaks under load?');
console.log('   → Finds saturated components, bottlenecks');
console.log('');
console.log('3. 💡 How to fix it?');
console.log('   → Specific recommendations (add cache, increase capacity, etc.)');
console.log('');
console.log('4. 💰 How much does it cost?');
console.log('   → Per-component cost breakdown');
console.log('');
console.log('5. ⚠️  What are the risks?');
console.log('   → Failure modes, single points of failure');
console.log('');
console.log('6. 🏗️  What patterns are used?');
console.log('   → Detects 3-tier, caching, load balancing, etc.');
console.log('');
console.log('You can test ANY architecture:');
console.log('  • AWS-style: ALB → EC2 → RDS → ElastiCache');
console.log('  • Microservices: API Gateway → Services → Kafka → Databases');
console.log('  • CDN: CloudFront → S3 → Lambda');
console.log('  • Whatever you build!');
console.log('');
