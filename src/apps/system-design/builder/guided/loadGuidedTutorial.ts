/**
 * Dynamic loader for guided tutorials
 * Loads the guided tutorial for a challenge ID from the separate files
 * Uses Vite's import.meta.glob for reliable dynamic imports
 */

import { GuidedTutorial } from '../types/guidedTutorial';
import { hasGuidedTutorial } from '../challenges/definitions/guidedTutorialIds';

// Use Vite's glob import to get all guided tutorial modules
// This creates a map of file paths to lazy import functions
const guidedModules = import.meta.glob<{ default: GuidedTutorial }>(
  '../challenges/definitions/*Guided.ts'
);

// Cache for loaded tutorials
const tutorialCache: Record<string, GuidedTutorial> = {};

/**
 * Convert kebab-case to camelCase for file names
 */
function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Clear the tutorial cache (useful for development or when switching challenges)
 */
export function clearTutorialCache(challengeId?: string): void {
  if (challengeId) {
    const normalizedId = challengeId.replace(/_/g, '-').toLowerCase();
    delete tutorialCache[normalizedId];
  } else {
    // Clear all cache
    Object.keys(tutorialCache).forEach(key => delete tutorialCache[key]);
  }
}

/**
 * Load a guided tutorial for a challenge ID
 * Returns null if no tutorial exists
 */
export async function loadGuidedTutorial(challengeId: string): Promise<GuidedTutorial | null> {
  // Normalize ID
  const normalizedId = challengeId.replace(/_/g, '-').toLowerCase();

  // Check cache first
  const cached = tutorialCache[normalizedId];
  if (cached) {
    // Verify the cached tutorial matches the requested challenge ID
    if (cached.problemId === normalizedId || cached.problemId === challengeId) {
      return cached;
    } else {
      // Cache mismatch - clear it and reload
      console.warn(`Cache mismatch for ${challengeId}: cached tutorial has problemId ${cached.problemId}, clearing cache`);
      delete tutorialCache[normalizedId];
    }
  }

  // Check if tutorial exists in our ID list
  if (!hasGuidedTutorial(normalizedId)) {
    return null;
  }

  try {
    // Convert to camelCase for the file name
    const camelCaseId = toCamelCase(normalizedId);
    const modulePath = `../challenges/definitions/${camelCaseId}Guided.ts`;

    // Find the matching module loader
    const moduleLoader = guidedModules[modulePath];

    if (!moduleLoader) {
      console.warn(`No module found for path: ${modulePath}`);
      return null;
    }

    // Load the module
    const module = await moduleLoader();
    const tutorial = module.default;

    if (tutorial) {
      // Verify the tutorial's problemId matches the requested challenge
      const tutorialProblemId = tutorial.problemId?.replace(/_/g, '-').toLowerCase();
      if (tutorialProblemId !== normalizedId && tutorialProblemId !== challengeId.replace(/_/g, '-').toLowerCase()) {
        console.warn(`Tutorial problemId mismatch: expected ${normalizedId}, got ${tutorial.problemId}`);
        // Don't cache mismatched tutorials
        return tutorial; // Still return it, but don't cache
      }
      
      tutorialCache[normalizedId] = tutorial;
      return tutorial;
    }

    return null;
  } catch (error) {
    console.warn(`Failed to load guided tutorial for ${challengeId}:`, error);
    return null;
  }
}

/**
 * Synchronous check if a tutorial is available
 */
export function isGuidedTutorialAvailable(challengeId: string): boolean {
  const normalizedId = challengeId.replace(/_/g, '-').toLowerCase();
  return hasGuidedTutorial(normalizedId);
}

/**
 * Preload a tutorial (for faster switching)
 */
export function preloadGuidedTutorial(challengeId: string): void {
  loadGuidedTutorial(challengeId).catch(() => {
    // Ignore preload errors
  });
}
