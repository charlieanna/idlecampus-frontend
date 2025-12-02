/**
 * Guided Tutorial Mode
 *
 * This module provides a step-by-step teaching mode for system design problems.
 * Users learn the system design framework by implementing one FR at a time.
 */

export { generateGuidedTutorial, canGenerateTutorial } from './generateGuidedTutorial';
export {
  validateStep,
  isTutorialComplete,
  getTutorialProgress,
  findFirstFailingStep,
} from './validateStep';
