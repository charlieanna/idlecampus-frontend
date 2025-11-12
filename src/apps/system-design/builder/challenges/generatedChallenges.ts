import { convertProblemDefinitionToChallenge } from './problemDefinitionConverter';
import { allProblemDefinitions } from './definitions';
import { Challenge } from '../types/testCase';

/**
 * All 658 challenges generated from problem definitions (40 original + 618 generated)
 */
export const generatedChallenges: Challenge[] = allProblemDefinitions.map(
  (def) => convertProblemDefinitionToChallenge(def)
);
