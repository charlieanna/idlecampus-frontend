#!/usr/bin/env node

/**
 * Test the solution generator for active-active-regions
 */

import { generateSolution } from '../src/apps/system-design/builder/challenges/solutionGenerator.ts';
import { problemConfigs } from '../src/apps/system-design/builder/challenges/problemConfigs.ts';
import { activeActiveRegionsProblemDefinition } from '../src/apps/system-design/builder/challenges/definitions/multiregionProblems.ts';

console.log('🧪 Testing Active-Active Solution Generator\n');

const problemId = 'active-active-regions';
const config = problemConfigs[problemId];

if (!config) {
  console.error(`❌ No config found for ${problemId}`);
  process.exit(1);
}

try {
  const solution = generateSolution(problemId, config, activeActiveRegionsProblemDefinition.userFacingFRs);
  
  console.log(`\n✅ Solution generated successfully!`);
  console.log(`\n📦 Components (${solution.components.length}):`);
  solution.components.forEach(comp => {
    const configStr = Object.keys(comp.config).length > 0 
      ? JSON.stringify(comp.config) 
      : '{}';
    console.log(`   - ${comp.type}: ${configStr}`);
  });

  console.log(`\n🔗 Connections (${solution.connections.length}):`);
  solution.connections.forEach(conn => {
    console.log(`   - ${conn.from} → ${conn.to}`);
  });

  console.log(`\n📝 Explanation preview:`);
  const preview = solution.explanation.split('\n').slice(0, 10).join('\n');
  console.log(preview);

} catch (error) {
  console.log(`❌ Error: ${error.message}`);
  console.log(error.stack);
}