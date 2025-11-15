/**
 * Challenge Migration: Add Python Templates
 *
 * Automatically adds Python templates to all 658 challenges
 * Every challenge = Tier 1 (Write Python code)
 */

import { Challenge } from '../types/testCase';
import { generatePythonTemplate, detectRequiredAPIs } from './pythonTemplateGenerator';

/**
 * Add Python template to challenge
 *
 * All challenges now use Tier 1 approach (write Python code)
 */
export function addPythonTemplate(challenge: Challenge): Challenge {
  // Generate Python template based on challenge type
  const pythonTemplate = generatePythonTemplate(challenge);

  // Detect required APIs for this challenge
  const requiredAPIs = detectRequiredAPIs(challenge);

  return {
    ...challenge,
    pythonTemplate,
    requiredAPIs,
  };
}

/**
 * Add Python templates to all challenges
 */
export function migrateAllChallenges(challenges: Challenge[]): Challenge[] {
  return challenges.map(addPythonTemplate);
}
