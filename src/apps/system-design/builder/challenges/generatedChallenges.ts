import { convertProblemDefinitionToChallenge } from './problemDefinitionConverter';
import { allProblemDefinitions } from './definitions';
import { Challenge } from '../types/testCase';

/**
 * All 40 challenges generated from problem definitions
 */
export const generatedChallenges: Challenge[] = allProblemDefinitions.map(
  (def) => convertProblemDefinitionToChallenge(def)
);
