import { tinyUrlChallenge } from './tinyUrl';
import { foodBlogChallenge } from './foodBlog';
import { todoAppChallenge } from './todoApp';
import { webCrawlerChallenge } from './webCrawler';
import { generatedChallenges } from './generatedChallenges';
import { Challenge } from '../types/testCase';

// Export all challenges (3 manually created + 40 generated from definitions)
export const challenges: Challenge[] = [
  // Manually created challenges with full test suites
  tinyUrlChallenge,
  foodBlogChallenge,
  todoAppChallenge,
  webCrawlerChallenge,

  // Generated challenges from problem definitions (40 challenges)
  ...generatedChallenges,
];

export { tinyUrlChallenge, foodBlogChallenge, todoAppChallenge, webCrawlerChallenge };

// Re-export all generated challenges
export * from './generatedChallenges';
