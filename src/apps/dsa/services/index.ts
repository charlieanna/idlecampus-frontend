/**
 * Services Index
 * 
 * Central export point for all service modules
 */

// Progress Decay Engine
export {
  ProgressDecayEngine,
  getUserMasteryProfile,
  saveUserMasteryProfile,
  initializeUserMasteryProfile,
  onModuleComplete,
  onSmartPracticeComplete,
  progressDecayEngine,
  DEFAULT_DECAY_CONFIG,
  STORAGE_KEYS,
} from './progressDecayEngine';

// Concept Scoring Engine
export {
  ConceptScoringEngine,
  initializeConcept,
  updateConceptScore,
  getPrioritizedConcepts,
  getMasteryLevel,
  getRecommendedDifficulty,
  calculateSequenceUrgency,
} from './conceptScoringEngine';

// Progress Decay Integration
export {
  ProgressDecayIntegration,
  progressDecayIntegration,
  convertToIntegratedScores,
  getPrioritizedConceptsWithDecay,
  selectProblemsWithDecayAwareness,
  getDecaySummary,
  getReviewRecommendations,
  type IntegratedConceptScore,
  type DecayAwareProblemSelection,
} from './progressDecayIntegration';

// Smart Practice Engine
export {
  SmartPracticeEngine,
  calculateWeaknessScore,
  updateWeaknessProfile,
  calculateNextReview,
  getReviewSchedule,
  selectProblemsWithConceptScoring,
  selectProblems,
  calculateInterviewReadiness,
  generateSkillRadar,
} from './smartPracticeEngine';

// Practice Storage
export * from './practiceStorage';

// Problem Generator
export * from './problemGenerator';

// Problem Variation Selector
export * from './problemVariationSelector';