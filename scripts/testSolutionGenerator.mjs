#!/usr/bin/env node

/**
 * Test the solution generator for problem definitions
 */

import { generateSolution } from '../src/apps/system-design/builder/challenges/solutionGenerator.ts';
import { problemConfigs } from '../src/apps/system-design/builder/challenges/problemConfigs.ts';

const testProblems = [
  {
    id: 'instagram',
    frs: [
      'Users can upload photos and videos',
      'Users can view a feed of photos from people they follow',
      'Users can like and comment on photos',
      'Users can search for other users and content'
    ]
  },
  {
    id: 'spotify',
    frs: [
      'Users can search and play songs',
      'Users can create and share playlists',
      'Users can follow artists and other users'
    ]
  },
  {
    id: 'uber',
    frs: [
      'Riders can request rides',
      'Drivers can accept ride requests',
      'Platform matches riders with nearby drivers in real-time',
      'Real-time location tracking during rides'
    ]
  }
];

console.log('🧪 Testing Solution Generator\n');

for (const problem of testProblems) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${problem.id.toUpperCase()}`);
  console.log('='.repeat(60));

  const config = problemConfigs[problem.id];
  if (!config) {
    console.log(`❌ No config found for ${problem.id}`);
    continue;
  }

  try {
    const solution = generateSolution(problem.id, config, problem.frs);
    
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
    console.log('   ... (truncated)');

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log(error.stack);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log('✅ Solution Generator Test Complete');
console.log('='.repeat(60));