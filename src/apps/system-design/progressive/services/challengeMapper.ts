/**
 * Challenge Mapper Service
 * 
 * Maps existing tiered challenges to progressive flow format.
 * Extracts 5 levels from test cases and categorizes into learning tracks.
 */

import { tieredChallenges } from '../../builder/challenges/tieredChallenges';
import { Challenge, TestCase } from '../../builder/types/testCase';
import {
  ProgressiveChallenge,
  ProgressiveChallengeLevel,
  LearningTrackType,
  ChallengeLevel,
  LEVEL_NAMES,
  Prerequisite
} from '../types';

/**
 * Base XP values per level (multiplied by difficulty)
 */
const BASE_XP_PER_LEVEL: Record<ChallengeLevel, number> = {
  1: 100,  // Connectivity
  2: 150,  // Capacity
  3: 200,  // Optimization
  4: 250,  // Resilience
  5: 300   // Excellence
};

/**
 * Difficulty multipliers for XP
 */
const DIFFICULTY_MULTIPLIER = {
  beginner: 1.0,
  intermediate: 1.5,
  advanced: 2.0
};

/**
 * Map challenge to learning track based on difficulty and category
 */
function mapToTrack(challenge: Challenge): LearningTrackType {
  const category = challenge.id.toLowerCase();
  
  // Fundamentals track - Basic challenges
  if (challenge.difficulty === 'beginner' || 
      category.includes('tinyurl') ||
      category.includes('pastebin') ||
      category.includes('weatherapi')) {
    return 'fundamentals';
  }
  
  // Systems track - Advanced challenges
  if (challenge.difficulty === 'advanced' ||
      category.includes('l6_') ||
      category.includes('l5_') ||
      category.includes('distributed')) {
    return 'systems';
  }
  
  // Concepts track - Intermediate challenges
  return 'concepts';
}

/**
 * Categorize challenge by primary pattern
 */
function categorizeChallenge(challenge: Challenge): string {
  const id = challenge.id.toLowerCase();
  const title = challenge.title.toLowerCase();
  
  if (id.includes('cache') || title.includes('cache')) return 'caching';
  if (id.includes('message') || id.includes('chat') || id.includes('messenger')) return 'messaging';
  if (id.includes('stream') || id.includes('kafka')) return 'streaming';
  if (id.includes('storage') || id.includes('drive') || id.includes('dropbox')) return 'storage';
  if (id.includes('search') || id.includes('elastic')) return 'search';
  if (id.includes('cdn') || id.includes('netflix')) return 'cdn';
  if (id.includes('database') || id.includes('db')) return 'database';
  if (id.includes('queue')) return 'queue';
  if (id.includes('api') || id.includes('gateway')) return 'api';
  if (id.includes('failover') || id.includes('region')) return 'reliability';
  
  return 'general';
}

/**
 * Extract 5 levels from test cases
 * Groups test cases by type and distributes across 5 levels
 */
function extractLevels(challenge: Challenge): ProgressiveChallengeLevel[] {
  const testCases = challenge.testCases || [];
  const totalTests = testCases.length;
  
  if (totalTests === 0) {
    // Create default 5 levels with placeholder test cases
    return [1, 2, 3, 4, 5].map(levelNum => ({
      levelNumber: levelNum as ChallengeLevel,
      levelName: LEVEL_NAMES[levelNum as ChallengeLevel],
      description: getDefaultLevelDescription(levelNum as ChallengeLevel),
      testCases: [],
      xpReward: calculateLevelXP(challenge.difficulty, levelNum as ChallengeLevel),
      hints: [],
      estimatedMinutes: 15 * levelNum
    }));
  }
  
  // Distribute test cases across 5 levels
  const levels: ProgressiveChallengeLevel[] = [];
  
  // Group test cases by type
  const functionalTests = testCases.filter(tc => tc.type === 'functional');
  const performanceTests = testCases.filter(tc => tc.type === 'performance');
  const scalabilityTests = testCases.filter(tc => tc.type === 'scalability');
  const reliabilityTests = testCases.filter(tc => tc.type === 'reliability');
  const costTests = testCases.filter(tc => tc.type === 'cost');
  
  // Level 1: Connectivity - Basic functional tests
  levels.push({
    levelNumber: 1,
    levelName: LEVEL_NAMES[1],
    description: 'Build basic connectivity and satisfy core functional requirements',
    testCases: functionalTests.slice(0, Math.ceil(functionalTests.length / 2)),
    xpReward: calculateLevelXP(challenge.difficulty, 1),
    hints: extractHints(challenge, 1),
    estimatedMinutes: 15
  });
  
  // Level 2: Capacity - Remaining functional + basic performance
  levels.push({
    levelNumber: 2,
    levelName: LEVEL_NAMES[2],
    description: 'Handle scale and meet performance requirements',
    testCases: [
      ...functionalTests.slice(Math.ceil(functionalTests.length / 2)),
      ...performanceTests.slice(0, Math.ceil(performanceTests.length / 2))
    ],
    xpReward: calculateLevelXP(challenge.difficulty, 2),
    hints: extractHints(challenge, 2),
    estimatedMinutes: 20
  });
  
  // Level 3: Optimization - Advanced performance + scalability
  levels.push({
    levelNumber: 3,
    levelName: LEVEL_NAMES[3],
    description: 'Optimize for better performance and scalability',
    testCases: [
      ...performanceTests.slice(Math.ceil(performanceTests.length / 2)),
      ...scalabilityTests.slice(0, Math.ceil(scalabilityTests.length / 2))
    ],
    xpReward: calculateLevelXP(challenge.difficulty, 3),
    hints: extractHints(challenge, 3),
    estimatedMinutes: 25
  });
  
  // Level 4: Resilience - Remaining scalability + reliability
  levels.push({
    levelNumber: 4,
    levelName: LEVEL_NAMES[4],
    description: 'Ensure resilience and handle failures gracefully',
    testCases: [
      ...scalabilityTests.slice(Math.ceil(scalabilityTests.length / 2)),
      ...reliabilityTests
    ],
    xpReward: calculateLevelXP(challenge.difficulty, 4),
    hints: extractHints(challenge, 4),
    estimatedMinutes: 30
  });
  
  // Level 5: Excellence - Cost optimization + all requirements
  levels.push({
    levelNumber: 5,
    levelName: LEVEL_NAMES[5],
    description: 'Perfect implementation with cost optimization',
    testCases: costTests,
    xpReward: calculateLevelXP(challenge.difficulty, 5),
    hints: extractHints(challenge, 5),
    estimatedMinutes: 35
  });
  
  return levels;
}

/**
 * Calculate XP for a level based on difficulty
 */
function calculateLevelXP(difficulty: Challenge['difficulty'], level: ChallengeLevel): number {
  const baseXP = BASE_XP_PER_LEVEL[level];
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty];
  return Math.floor(baseXP * multiplier);
}

/**
 * Get default level description
 */
function getDefaultLevelDescription(level: ChallengeLevel): string {
  const descriptions: Record<ChallengeLevel, string> = {
    1: 'Build basic connectivity and satisfy core functional requirements',
    2: 'Handle scale and meet performance requirements',
    3: 'Optimize for better performance and scalability',
    4: 'Ensure resilience and handle failures gracefully',
    5: 'Perfect implementation with cost optimization'
  };
  return descriptions[level];
}

/**
 * Extract hints for a specific level from challenge hints
 */
function extractHints(challenge: Challenge, level: ChallengeLevel): string[] {
  if (!challenge.hints) return [];
  
  // Distribute hints across levels
  const hints = challenge.hints.map(h => h.message);
  const hintsPerLevel = Math.ceil(hints.length / 5);
  const startIdx = (level - 1) * hintsPerLevel;
  const endIdx = startIdx + hintsPerLevel;
  
  return hints.slice(startIdx, endIdx);
}

/**
 * Map challenge to ProgressiveChallenge format
 */
export function mapToProgressiveChallenge(
  challenge: Challenge,
  orderInTrack: number
): ProgressiveChallenge {
  const track = mapToTrack(challenge);
  const category = categorizeChallenge(challenge);
  const levels = extractLevels(challenge);
  
  // Calculate total base XP
  const baseXP = levels.reduce((sum, level) => sum + level.xpReward, 0);
  
  return {
    ...challenge,
    track,
    orderInTrack,
    prerequisites: [], // Will be set by prerequisite system
    levels,
    baseXP,
    category,
    ddiaChapters: [],
    ddiaTopics: []
  };
}

/**
 * Get all progressive challenges organized by track
 */
export function getAllProgressiveChallenges(): {
  fundamentals: ProgressiveChallenge[];
  concepts: ProgressiveChallenge[];
  systems: ProgressiveChallenge[];
} {
  const mapped = tieredChallenges.map((challenge, index) => 
    mapToProgressiveChallenge(challenge, index)
  );
  
  // Group by track
  const fundamentals = mapped
    .filter(c => c.track === 'fundamentals')
    .map((c, idx) => ({ ...c, orderInTrack: idx }));
    
  const concepts = mapped
    .filter(c => c.track === 'concepts')
    .map((c, idx) => ({ ...c, orderInTrack: idx }));
    
  const systems = mapped
    .filter(c => c.track === 'systems')
    .map((c, idx) => ({ ...c, orderInTrack: idx }));
  
  return { fundamentals, concepts, systems };
}

/**
 * Get progressive challenge by ID
 */
export function getProgressiveChallengeById(id: string): ProgressiveChallenge | null {
  const challenge = tieredChallenges.find(c => c.id === id);
  if (!challenge) return null;
  
  return mapToProgressiveChallenge(challenge, 0);
}

/**
 * Define prerequisites for challenges
 * Based on complexity and dependencies
 */
export function definePrerequisites(): Prerequisite[] {
  const prerequisites: Prerequisite[] = [];
  
  // TinyURL is the entry point - no prerequisites
  
  // Pastebin requires TinyURL (similar pattern)
  prerequisites.push({
    challengeId: 'pastebin',
    requiredChallenges: ['tinyurl']
  });
  
  // Instagram requires understanding of TinyURL and basic caching
  prerequisites.push({
    challengeId: 'instagram',
    requiredChallenges: ['tinyurl', 'pastebin']
  });
  
  // Twitter requires Instagram (social feed pattern)
  prerequisites.push({
    challengeId: 'twitter',
    requiredChallenges: ['instagram']
  });
  
  // Facebook requires Twitter (more complex social)
  prerequisites.push({
    challengeId: 'facebook',
    requiredChallenges: ['twitter']
  });
  
  // Messaging apps require social understanding
  prerequisites.push({
    challengeId: 'whatsapp',
    requiredChallenges: ['instagram']
  });
  
  prerequisites.push({
    challengeId: 'messenger',
    requiredChallenges: ['whatsapp']
  });
  
  // Video streaming requires understanding of CDN and caching
  prerequisites.push({
    challengeId: 'youtube',
    requiredChallenges: ['instagram']
  });
  
  prerequisites.push({
    challengeId: 'netflix',
    requiredChallenges: ['youtube']
  });
  
  // Advanced challenges require completing fundamentals track
  prerequisites.push({
    challengeId: 'active_active_regions',
    requiredChallenges: [],
    requiredTrackProgress: {
      trackId: 'fundamentals',
      minPercentage: 50
    }
  });
  
  prerequisites.push({
    challengeId: 'cross_region_failover',
    requiredChallenges: [],
    requiredTrackProgress: {
      trackId: 'fundamentals',
      minPercentage: 50
    }
  });
  
  // L6 challenges require completing concepts track
  const l6Challenges = tieredChallenges
    .filter(c => c.id.startsWith('l6_'))
    .map(c => c.id);
    
  l6Challenges.forEach(challengeId => {
    prerequisites.push({
      challengeId,
      requiredChallenges: [],
      requiredLevel: 10,
      requiredTrackProgress: {
        trackId: 'concepts',
        minPercentage: 75
      }
    });
  });
  
  return prerequisites;
}

/**
 * Check if a challenge is unlocked for a user
 */
export function isChallengeUnlocked(
  challengeId: string,
  completedChallenges: string[],
  userLevel: number,
  trackProgress: Record<LearningTrackType, { progressPercentage: number }>
): boolean {
  const prerequisites = definePrerequisites();
  const prereq = prerequisites.find(p => p.challengeId === challengeId);
  
  // No prerequisites means it's unlocked
  if (!prereq) return true;
  
  // Check required challenges
  if (prereq.requiredChallenges.length > 0) {
    const allCompleted = prereq.requiredChallenges.every(
      reqId => completedChallenges.includes(reqId)
    );
    if (!allCompleted) return false;
  }
  
  // Check level requirement
  if (prereq.requiredLevel && userLevel < prereq.requiredLevel) {
    return false;
  }
  
  // Check track progress requirement
  if (prereq.requiredTrackProgress) {
    const { trackId, minPercentage } = prereq.requiredTrackProgress;
    const progress = trackProgress[trackId]?.progressPercentage || 0;
    if (progress < minPercentage) return false;
  }
  
  return true;
}

/**
 * Get challenges by track
 */
export function getChallengesByTrack(track: LearningTrackType): ProgressiveChallenge[] {
  const all = getAllProgressiveChallenges();
  return all[track];
}

/**
 * Get total challenge count
 */
export function getTotalChallengeCount(): number {
  return tieredChallenges.length;
}

/**
 * Get challenge statistics
 */
export function getChallengeStats() {
  const all = getAllProgressiveChallenges();
  
  return {
    total: tieredChallenges.length,
    byTrack: {
      fundamentals: all.fundamentals.length,
      concepts: all.concepts.length,
      systems: all.systems.length
    },
    byDifficulty: {
      beginner: tieredChallenges.filter(c => c.difficulty === 'beginner').length,
      intermediate: tieredChallenges.filter(c => c.difficulty === 'intermediate').length,
      advanced: tieredChallenges.filter(c => c.difficulty === 'advanced').length
    }
  };
}