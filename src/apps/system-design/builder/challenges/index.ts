import { tinyUrlChallenge } from './tinyUrl';
import { foodBlogChallenge } from './foodBlog';
import { todoAppChallenge } from './todoApp';
import { Challenge } from '../types/testCase';

// Export all challenges
export const challenges: Challenge[] = [
  tinyUrlChallenge,
  foodBlogChallenge,
  todoAppChallenge,
];

export { tinyUrlChallenge, foodBlogChallenge, todoAppChallenge };
