/**
 * React Hook for User Mastery Profile
 * 
 * Provides easy access to user mastery data with progress-aware decay calculations.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  UserMasteryProfile,
  ConceptWithDecay,
  ModuleProgressSummary,
  ConceptProgressSummary,
  SmartPracticeConfig,
  ModuleCompletion,
} from '../types/progress-decay';
import {
  ProgressDecayEngine,
  getUserMasteryProfile,
  saveUserMasteryProfile,
  initializeUserMasteryProfile,
  onModuleComplete,
  onSmartPracticeComplete,
} from '../services/progressDecayEngine';

// ============= Hook Interface =============

interface UseUserMasteryProfileReturn {
  // Profile data
  profile: UserMasteryProfile | null;
  isLoading: boolean;
  error: string | null;

  // Decay calculations (memoized)
  conceptsWithDecay: ConceptWithDecay[];
  moduleSummaries: ModuleProgressSummary[];
  conceptSummaries: ConceptProgressSummary[];

  // Quick access to key metrics
  totalModulesCompleted: number;
  totalProblemsCompleted: number;
  strengthCount: number;
  weaknessCount: number;

  // Concepts needing attention (fading, decayed, critical)
  conceptsNeedingReview: ConceptProgressSummary[];

  // Actions
  completeModule: (
    moduleId: string,
    moduleName: string,
    completionScore: number,
    problemsSolvedInModule: number,
    conceptsLearned: { conceptId: string; conceptName: string; masteryScore: number }[]
  ) => void;
  recordSmartPractice: (conceptId: string, success: boolean, submissionAttempts: number) => void;
  getConceptsForSmartPractice: (config: SmartPracticeConfig) => ConceptWithDecay[];
  getTestDifficulty: (conceptId: string) => 'easy' | 'medium' | 'hard';
  refreshProfile: () => void;
  resetProfile: () => void;
}

// ============= Default Configuration =============

const DEFAULT_USER_ID = 'default-user';

const DEFAULT_SMART_PRACTICE_CONFIG: SmartPracticeConfig = {
  problemCount: 5,
  focusWeaknesses: true,
  mixInStrengths: true,
  weaknessRatio: 0.7,
  prioritizeDecayed: true,
  excludeFresh: false,
  crossModuleReview: true,
  moduleWindow: 0, // 0 = all modules
};

// ============= Hook Implementation =============

export function useUserMasteryProfile(userId: string = DEFAULT_USER_ID): UseUserMasteryProfileReturn {
  const [profile, setProfile] = useState<UserMasteryProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create engine instance (memoized)
  const engine = useMemo(() => new ProgressDecayEngine(), []);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = useCallback(() => {
    setIsLoading(true);
    setError(null);

    try {
      let loadedProfile = getUserMasteryProfile(userId);
      
      // Initialize if not exists
      if (!loadedProfile) {
        loadedProfile = initializeUserMasteryProfile(userId);
        saveUserMasteryProfile(loadedProfile);
      }

      setProfile(loadedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Memoized decay calculations
  const conceptsWithDecay = useMemo(() => {
    if (!profile) return [];
    return engine.calculateAllConceptDecay(profile);
  }, [profile, engine]);

  const moduleSummaries = useMemo(() => {
    if (!profile) return [];
    return engine.getModuleDecaySummaries(profile);
  }, [profile, engine]);

  const conceptSummaries = useMemo(() => {
    if (!profile) return [];
    return engine.getConceptDecaySummaries(profile);
  }, [profile, engine]);

  // Concepts needing review (fading, decayed, or critical)
  const conceptsNeedingReview = useMemo(() => {
    return conceptSummaries.filter(c => 
      ['fading', 'decayed', 'critical'].includes(c.classification)
    );
  }, [conceptSummaries]);

  // Quick access metrics
  const totalModulesCompleted = profile?.totalModulesCompleted ?? 0;
  const totalProblemsCompleted = profile?.totalProblemsCompleted ?? 0;
  const strengthCount = profile?.strengths.length ?? 0;
  const weaknessCount = profile?.weaknesses.length ?? 0;

  // ============= Actions =============

  const completeModule = useCallback((
    moduleId: string,
    moduleName: string,
    completionScore: number,
    problemsSolvedInModule: number,
    conceptsLearned: { conceptId: string; conceptName: string; masteryScore: number }[]
  ) => {
    if (!profile) return;

    const updatedProfile = onModuleComplete(
      profile,
      moduleId,
      moduleName,
      completionScore,
      problemsSolvedInModule,
      conceptsLearned
    );

    setProfile(updatedProfile);
    saveUserMasteryProfile(updatedProfile);
  }, [profile]);

  const recordSmartPractice = useCallback((
    conceptId: string,
    success: boolean,
    submissionAttempts: number
  ) => {
    if (!profile) return;

    const updatedProfile = onSmartPracticeComplete(
      profile,
      conceptId,
      success,
      submissionAttempts
    );

    setProfile(updatedProfile);
    saveUserMasteryProfile(updatedProfile);
  }, [profile]);

  const getConceptsForSmartPractice = useCallback((
    config: SmartPracticeConfig = DEFAULT_SMART_PRACTICE_CONFIG
  ): ConceptWithDecay[] => {
    if (!profile) return [];
    return engine.selectConceptsForPractice(profile, config);
  }, [profile, engine]);

  const getTestDifficulty = useCallback((conceptId: string): 'easy' | 'medium' | 'hard' => {
    const concept = conceptsWithDecay.find(c => c.conceptId === conceptId);
    if (!concept) return 'medium';
    return engine.determineTestDifficulty(concept);
  }, [conceptsWithDecay, engine]);

  const refreshProfile = useCallback(() => {
    loadProfile();
  }, [loadProfile]);

  const resetProfile = useCallback(() => {
    const newProfile = initializeUserMasteryProfile(userId);
    setProfile(newProfile);
    saveUserMasteryProfile(newProfile);
  }, [userId]);

  return {
    // Data
    profile,
    isLoading,
    error,

    // Decay calculations
    conceptsWithDecay,
    moduleSummaries,
    conceptSummaries,

    // Quick metrics
    totalModulesCompleted,
    totalProblemsCompleted,
    strengthCount,
    weaknessCount,
    conceptsNeedingReview,

    // Actions
    completeModule,
    recordSmartPractice,
    getConceptsForSmartPractice,
    getTestDifficulty,
    refreshProfile,
    resetProfile,
  };
}

// ============= Utility Hook for Module Progress =============

interface UseModuleProgressReturn {
  moduleId: string;
  moduleName: string;
  currentRetention: number;
  decayPercentage: number;
  classification: string;
  conceptCount: number;
  strengthCount: number;
  weaknessCount: number;
  isDecaying: boolean;
  needsReview: boolean;
}

export function useModuleProgress(
  moduleId: string,
  profile: UserMasteryProfile | null
): UseModuleProgressReturn | null {
  const engine = useMemo(() => new ProgressDecayEngine(), []);

  return useMemo(() => {
    if (!profile) return null;

    const summaries = engine.getModuleDecaySummaries(profile);
    const moduleSummary = summaries.find(m => m.moduleId === moduleId);

    if (!moduleSummary) return null;

    return {
      moduleId: moduleSummary.moduleId,
      moduleName: moduleSummary.moduleName,
      currentRetention: moduleSummary.currentRetention,
      decayPercentage: moduleSummary.decayPercentage * 100,
      classification: moduleSummary.classification,
      conceptCount: moduleSummary.conceptCount,
      strengthCount: moduleSummary.strengthCount,
      weaknessCount: moduleSummary.weaknessCount,
      isDecaying: moduleSummary.classification !== 'fresh',
      needsReview: ['fading', 'decayed', 'critical'].includes(moduleSummary.classification),
    };
  }, [moduleId, profile, engine]);
}

// ============= Utility Hook for Concept Decay =============

interface UseConceptDecayReturn {
  conceptId: string;
  conceptName: string;
  originalMastery: number;
  currentRetention: number;
  decayPercentage: number;
  classification: string;
  isStrength: boolean;
  isWeakness: boolean;
  urgency: number;
  recommendedDifficulty: 'easy' | 'medium' | 'hard';
}

export function useConceptDecay(
  conceptId: string,
  profile: UserMasteryProfile | null
): UseConceptDecayReturn | null {
  const engine = useMemo(() => new ProgressDecayEngine(), []);

  return useMemo(() => {
    if (!profile) return null;

    const concept = profile.conceptMastery.get(conceptId);
    if (!concept) return null;

    const decay = engine.calculateProgressDecay(
      concept,
      profile.totalModulesCompleted,
      profile.totalProblemsCompleted
    );

    const conceptWithDecay: ConceptWithDecay = {
      ...concept,
      decayedMasteryScore: decay.decayedMastery,
      decayPercentage: decay.decayPercentage,
      decayClassification: decay.classification,
      decay,
      priority: 0,
    };

    return {
      conceptId: concept.conceptId,
      conceptName: concept.conceptName,
      originalMastery: concept.masteryScore,
      currentRetention: decay.decayedMastery,
      decayPercentage: decay.decayPercentage * 100,
      classification: decay.classification,
      isStrength: concept.isStrength,
      isWeakness: concept.isWeakness,
      urgency: decay.urgencyToReview,
      recommendedDifficulty: engine.determineTestDifficulty(conceptWithDecay),
    };
  }, [conceptId, profile, engine]);
}

export default useUserMasteryProfile;