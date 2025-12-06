/**
 * Tiered Challenge: Tinder - Dating & Matching
 * Converted from ProblemDefinition to Challenge format at runtime
 */

import { Challenge } from '../../types/testCase';
import { convertProblemDefinitionToChallenge } from '../problemDefinitionConverter';
import { tinderProblemDefinition } from '../definitions/tinder';

// Convert ProblemDefinition → Challenge so we keep FR/NFRs and problemDefinition attached
const baseTinderChallenge: Challenge = convertProblemDefinitionToChallenge(tinderProblemDefinition);

export const tinderChallenge: Challenge = {
  ...baseTinderChallenge,
  // Explicitly set difficulty for the tiered catalog
  difficulty: 'intermediate',
};


