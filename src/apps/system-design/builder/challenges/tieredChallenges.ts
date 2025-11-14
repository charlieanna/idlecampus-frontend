/**
 * All Tiered Challenges
 *
 * Three-tier system for 400+ problems:
 * - Tier 1 (Simple): Students write Python code
 * - Tier 2 (Moderate): Students configure algorithms
 * - Tier 3 (Advanced): Students design architecture
 */

import { TieredChallenge } from '../types/challengeTiers';
import { tinyUrlTieredChallenge } from './tier1/tinyUrlTiered';
import { twitterFeedTieredChallenge } from './tier2/twitterFeedTiered';
import { uberMatchingTieredChallenge } from './tier3/uberMatchingTiered';

/**
 * All available tiered challenges
 */
export const tieredChallenges: TieredChallenge[] = [
  tinyUrlTieredChallenge,
  twitterFeedTieredChallenge,
  uberMatchingTieredChallenge,
];

/**
 * Get tiered challenge by ID
 */
export function getTieredChallenge(id: string): TieredChallenge | undefined {
  return tieredChallenges.find(c => c.id === id);
}

/**
 * Get challenges by tier
 */
export function getChallengesByTier(tier: 'simple' | 'moderate' | 'advanced'): TieredChallenge[] {
  return tieredChallenges.filter(c => c.implementationTier === tier);
}
