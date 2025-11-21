import { tinyUrlChallenge } from './tinyUrl';
// Note: tinyUrlL6Challenge removed - converted to ProblemDefinition (tiny-url-l6)
import { foodBlogChallenge } from './foodBlog';
import { todoAppChallenge } from './todoApp';
import { webCrawlerChallenge } from './webCrawler';
import { generatedChallenges } from './generatedChallenges';
import { Challenge } from '../types/testCase';
import { L6TestGenerator } from '../services/l6TestGeneratorFixed';
import { regenerateSolutionForChallenge } from './problemDefinitionConverter';

// Base challenges before L6 enhancement
const baseChallenges: Challenge[] = [
  // Manually created challenges with full test suites
  tinyUrlChallenge,
  foodBlogChallenge,
  todoAppChallenge,
  webCrawlerChallenge,

  // Generated challenges from problem definitions (40 challenges)
  ...generatedChallenges,
];

// Apply L6 enhancement to all challenges automatically
// This adds Google L6-level NFR test cases to each challenge
const l6EnhancedChallenges = baseChallenges.map(challenge => {
  const enhanced = L6TestGenerator.enhanceChallenge(challenge);
  
  // CRITICAL FIX: Always regenerate solution after L6 tests are added
  // L6 tests add high-load scenarios (10x spikes) that weren't in original solution calculation
  // This ensures ALL challenges have solutions that account for L6-level traffic
  // (e.g., Medium's 310 write RPS from L6 Viral Event)
  // This also generates solutions for challenges that didn't have them originally
  enhanced.solution = regenerateSolutionForChallenge(enhanced);
  
  return enhanced;
});

// Export all challenges with L6 enhancements
export const challenges: Challenge[] = [
  // Note: tinyUrlL6Challenge removed - converted to ProblemDefinition (tiny-url-l6)
  // See: challenges/definitions/generated-all/cachingAllProblems.ts

  // All other challenges with automatic L6 enhancement
  ...l6EnhancedChallenges,
];

export { tinyUrlChallenge, foodBlogChallenge, todoAppChallenge, webCrawlerChallenge };
// Note: tinyUrlL6Challenge removed - converted to ProblemDefinition (tiny-url-l6)

// Re-export all generated challenges
export * from './generatedChallenges';
