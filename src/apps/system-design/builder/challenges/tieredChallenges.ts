/**
 * All Challenges with Python Templates
 *
 * All 658 challenges with auto-generated Python templates
 * Every challenge = Tier 1 (Write Python code using context API)
 *
 * Challenges are automatically enhanced with Python templates using challengeMigration.ts
 */

import { Challenge } from '../types/testCase';
import { challenges } from './index';
import { migrateAllChallenges } from './challengeMigration';

/**
 * All available challenges with Python templates (658 total)
 * Automatically migrated from legacy challenges
 */
export const tieredChallenges: Challenge[] = migrateAllChallenges(challenges);

// Log challenge count in development
if (process.env.NODE_ENV === 'development') {
  console.log('📊 Challenge Distribution:');
  console.log(`   Total challenges: ${tieredChallenges.length}`);
  console.log(`   All with Python templates for Tier 1 (write code)`);

  // Debug: Show sample challenges
  const samples = tieredChallenges.slice(0, 5);
  console.log('   Sample challenges:', samples.map(c => c.title).join(', '));
}

/**
 * Get challenge by ID
 */
export function getTieredChallenge(id: string): Challenge | undefined {
  return tieredChallenges.find(c => c.id === id);
}
