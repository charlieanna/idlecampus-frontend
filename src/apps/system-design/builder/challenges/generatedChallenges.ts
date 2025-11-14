import { convertProblemDefinitionToChallenge } from './problemDefinitionConverter';
import { allProblemDefinitions } from './definitions';
import { Challenge } from '../types/testCase';

/**
 * All challenges generated from problem definitions (40 original + deduplicated generated)
 */
export const generatedChallenges: Challenge[] = allProblemDefinitions.map(
  (def) => convertProblemDefinitionToChallenge(def)
);
