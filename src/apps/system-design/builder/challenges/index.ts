import { tinyUrlChallenge } from './tinyUrl';
// Note: tinyUrlL6Challenge removed - converted to ProblemDefinition (tiny-url-l6)
import { foodBlogChallenge } from './foodBlog';
import { todoAppChallenge } from './todoApp';
import { webCrawlerChallenge } from './webCrawler';
import { generatedChallenges } from './generatedChallenges';
import { Challenge } from '../types/testCase';
import { L6TestGenerator } from '../services/l6TestGeneratorFixed';

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
const l6EnhancedChallenges = baseChallenges.map(challenge =>
  L6TestGenerator.enhanceChallenge(challenge)
);

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
