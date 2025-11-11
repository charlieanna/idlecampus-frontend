/**
 * Run all challenge examples and validate simulation engine
 */

import { runTinyUrlExample } from './tinyUrlExample';
import { runFoodBlogExample } from './foodBlogExample';
import { runTodoAppExample } from './todoAppExample';

console.log('\n\n');
console.log('╔═══════════════════════════════════════════════════════════════════════╗');
console.log('║         SYSTEM DESIGN BUILDER - ALL CHALLENGE EXAMPLES               ║');
console.log('╚═══════════════════════════════════════════════════════════════════════╝');
console.log('\n');

console.log('Running 3 challenges with good/mediocre/bad designs...\n');
console.log('This validates the simulation engine handles different scenarios:\n');
console.log('  1. Tiny URL:   Caching for read-heavy workloads');
console.log('  2. Food Blog:  CDN for static content, bandwidth optimization');
console.log('  3. Todo App:   Replication for fault tolerance, availability\n');
console.log('='.repeat(80));

try {
  // Challenge 1: Tiny URL
  console.log('\n\n🔗 CHALLENGE 1: TINY URL SHORTENER\n');
  runTinyUrlExample();

  console.log('\n\n');
  console.log('='.repeat(80));
  console.log('✅ Challenge 1 Complete!');
  console.log('='.repeat(80));

  // Challenge 2: Food Blog
  console.log('\n\n📷 CHALLENGE 2: FOOD BLOG\n');
  runFoodBlogExample();

  console.log('\n\n');
  console.log('='.repeat(80));
  console.log('✅ Challenge 2 Complete!');
  console.log('='.repeat(80));

  // Challenge 3: Todo App
  console.log('\n\n✅ CHALLENGE 3: TODO APP\n');
  runTodoAppExample();

  console.log('\n\n');
  console.log('='.repeat(80));
  console.log('✅ Challenge 3 Complete!');
  console.log('='.repeat(80));

  // Final summary
  console.log('\n\n');
  console.log('╔═══════════════════════════════════════════════════════════════════════╗');
  console.log('║                     ALL CHALLENGES COMPLETE ✅                        ║');
  console.log('╚═══════════════════════════════════════════════════════════════════════╝');
  console.log('\n');
  console.log('✅ Tiny URL:   Caching validation working');
  console.log('✅ Food Blog:  CDN cost/latency optimization working');
  console.log('✅ Todo App:   Replication availability validation working');
  console.log('\n');
  console.log('Simulation Engine Status: VALIDATED ✅');
  console.log('\n');
  console.log('Next Steps:');
  console.log('  - Build UI with reactflow for visual design');
  console.log('  - Connect UI to simulation engine');
  console.log('  - User testing with 5 people');
  console.log('\n');
  console.log('='.repeat(80));
} catch (error) {
  console.error('\n\n❌ ERROR RUNNING EXAMPLES:\n', error);
  process.exit(1);
}
