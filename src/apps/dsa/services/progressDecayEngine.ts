/**
 * Progress-Aware Decay Engine
 * 
 * Calculates mastery decay based on learning progress (not calendar time).
 * As user learns new modules, older content automatically decays.
 */

import type {
  ConceptMastery,
  UserMasteryProfile,
  ModuleCompletion,
  ProgressDecayResult,
  ConceptWithDecay,
  DecayClassification,
  DecayConfig,
  StrengthWeakness,
  LearningEvent,
  ModuleProgressSummary,
  ConceptProgressSummary,
  SmartPracticeConfig,
} from '../types/progress-decay';

import { DEFAULT_DECAY_CONFIG, STORAGE_KEYS } from '../types/progress-decay';

// ============= Progress Decay Engine Class =============

export class ProgressDecayEngine {
  private config: DecayConfig;

  constructor(config: Partial<DecayConfig> = {}) {
    this.config = { ...DEFAULT_DECAY_CONFIG, ...config };
  }

  // ============= Core Decay Calculation =============

  /**
   * Calculate progress-decayed mastery score for a concept
   * 
   * @param concept - The concept to calculate decay for
   * @param totalModulesCompleted - Total modules the user has completed
   * @param totalProblemsCompleted - Total problems the user has solved
   * @returns Decay result with decayed mastery and classification
   */
  calculateProgressDecay(
    concept: ConceptMastery,
    totalModulesCompleted: number,
    totalProblemsCompleted: number
  ): ProgressDecayResult {
    // How many modules were completed AFTER this concept was learned?
    const modulesAfter = Math.max(0, totalModulesCompleted - concept.moduleSequence);

    // How many problems were solved in OTHER modules after this?
    const problemsAfter = Math.max(0, totalProblemsCompleted - concept.problemsAtTimeOfLearning);

    // === DECAY CALCULATION ===

    // Base decay per module completed after
    const moduleDecay = modulesAfter * this.config.moduleDecayRate;

    // Problem decay: per 10 problems in other topics (dampened as user progresses further)
    let problemDecay = 0;
    if (modulesAfter === 0) {
      problemDecay = 0;
    } else {
      const baseProblemDecay = (problemsAfter / 10) * this.config.problemDecayRate;
      if (modulesAfter <= 1) {
        problemDecay = baseProblemDecay;
      } else {
        const dampen = Math.max(
          0,
          1 - (modulesAfter - 1) * this.config.problemDecayDampenPerModule
        );
        problemDecay = baseProblemDecay * dampen;
      }
    }

    // === STRENGTH/WEAKNESS MODIFIER ===
    let decayMultiplier = 1.0;
    if (concept.isStrength) {
      decayMultiplier = this.config.strengthDecayMultiplier;  // Strengths decay slower
    } else if (concept.isWeakness) {
      decayMultiplier = this.config.weaknessDecayMultiplier;  // Weaknesses decay faster
    }

    // === PRACTICE RECOVERY ===
    let practiceRecovery = 0;
    if (concept.practiceCountAfterModule > 0) {
      // Each practice session recovers some decay
      practiceRecovery = Math.min(
        moduleDecay + problemDecay,  // Can't recover more than decayed
        concept.practiceCountAfterModule * this.config.practiceRecoveryRate
      );
    }

    // === FINAL DECAY ===
    const totalDecay = (moduleDecay + problemDecay) * decayMultiplier - practiceRecovery;
    const clampedDecay = Math.max(0, Math.min(this.config.maxDecay, totalDecay));

    // Apply decay to mastery
    const decayedMastery = parseFloat((concept.masteryScore * (1 - clampedDecay)).toFixed(6));

    // Calculate urgency (higher decay = more urgent to review)
    const urgencyToReview = clampedDecay * 100;

    let classification = this.classifyDecayLevel(clampedDecay);
    if (classification === 'stable' && modulesAfter >= 3) {
      classification = 'fading';
    }

    return {
      originalMastery: concept.masteryScore,
      decayedMastery,
      decayPercentage: clampedDecay,
      modulesAfter,
      problemsAfter,
      practiceRecovery,
      urgencyToReview,
      classification,
    };
  }

  /**
   * Classify decay level based on percentage
   */
  classifyDecayLevel(decayPercent: number): DecayClassification {
    if (decayPercent < this.config.freshThreshold) return 'fresh';
    if (decayPercent < this.config.stableThreshold) return 'stable';
    if (decayPercent < this.config.fadingThreshold) return 'fading';
    if (decayPercent < this.config.decayedThreshold) return 'decayed';
    return 'critical';
  }

  // ============= Bulk Operations =============

  /**
   * Calculate decay for all concepts in a user profile
   */
  calculateAllConceptDecay(profile: UserMasteryProfile): ConceptWithDecay[] {
    const results: ConceptWithDecay[] = [];

    for (const [_, concept] of profile.conceptMastery) {
      const decay = this.calculateProgressDecay(
        concept,
        profile.totalModulesCompleted,
        profile.totalProblemsCompleted
      );

      // Calculate priority for practice selection
      // Priority = Decay Urgency × 0.5 + Weakness × 0.3 + Variety × 0.2
      const priority =
        decay.urgencyToReview * 0.5 +
        (concept.isWeakness ? 40 : 0) +
        (1 - Math.min(concept.practiceCountAfterModule / 10, 1)) * 20;

      results.push({
        ...concept,
        decayedMasteryScore: decay.decayedMastery,
        decayPercentage: decay.decayPercentage,
        decayClassification: decay.classification,
        decay,
        priority,
      });
    }

    // Sort by priority (highest first)
    return results.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get module-level decay summaries
   */
  getModuleDecaySummaries(profile: UserMasteryProfile): ModuleProgressSummary[] {
    const moduleSummaries = new Map<string, ModuleProgressSummary>();

    // Initialize summaries from module completions
    for (const moduleCompletion of profile.moduleCompletions) {
      moduleSummaries.set(moduleCompletion.moduleId, {
        moduleId: moduleCompletion.moduleId,
        moduleName: moduleCompletion.moduleName,
        sequenceNumber: moduleCompletion.sequenceNumber,
        originalScore: moduleCompletion.completionScore,
        currentRetention: 0,
        decayPercentage: 0,
        classification: 'fresh',
        conceptCount: moduleCompletion.conceptsLearned.length,
        strengthCount: 0,
        weaknessCount: 0,
      });
    }

    // Calculate decay for each concept and aggregate by module
    const conceptsWithDecay = this.calculateAllConceptDecay(profile);
    const moduleConceptCounts = new Map<string, number>();
    const moduleTotalDecay = new Map<string, number>();
    const moduleTotalRetention = new Map<string, number>();

    for (const concept of conceptsWithDecay) {
      const moduleId = concept.moduleId;
      const current = moduleConceptCounts.get(moduleId) || 0;
      moduleConceptCounts.set(moduleId, current + 1);

      const currentDecay = moduleTotalDecay.get(moduleId) || 0;
      moduleTotalDecay.set(moduleId, currentDecay + concept.decay.decayPercentage);

      const currentRetention = moduleTotalRetention.get(moduleId) || 0;
      moduleTotalRetention.set(moduleId, currentRetention + concept.decay.decayedMastery);

      // Update strength/weakness counts
      const summary = moduleSummaries.get(moduleId);
      if (summary) {
        if (concept.isStrength) summary.strengthCount++;
        if (concept.isWeakness) summary.weaknessCount++;
      }
    }

    // Calculate averages for each module
    for (const [moduleId, summary] of moduleSummaries) {
      const count = moduleConceptCounts.get(moduleId) || 1;
      const totalDecay = moduleTotalDecay.get(moduleId) || 0;
      const totalRetention = moduleTotalRetention.get(moduleId) || summary.originalScore;

      summary.decayPercentage = totalDecay / count;
      summary.currentRetention = totalRetention / count;
      summary.classification = this.classifyDecayLevel(summary.decayPercentage);
    }

    return Array.from(moduleSummaries.values())
      .sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  }

  /**
   * Get concept-level summaries sorted by urgency
   */
  getConceptDecaySummaries(profile: UserMasteryProfile): ConceptProgressSummary[] {
    const conceptsWithDecay = this.calculateAllConceptDecay(profile);

    return conceptsWithDecay.map(concept => ({
      conceptId: concept.conceptId,
      conceptName: concept.conceptName,
      moduleId: concept.moduleId,
      originalMastery: concept.masteryScore,
      currentRetention: concept.decay.decayedMastery,
      decayPercentage: concept.decay.decayPercentage,
      classification: concept.decay.classification,
      isStrength: concept.isStrength,
      isWeakness: concept.isWeakness,
      practiceCount: concept.practiceCount,
      urgency: concept.decay.urgencyToReview,
    }));
  }

  // ============= Strength/Weakness Classification =============

  /**
   * Update strength/weakness classification based on current decay
   */
  updateStrengthWeaknessClassification(profile: UserMasteryProfile): void {
    const conceptsWithDecay = this.calculateAllConceptDecay(profile);
    
    if (conceptsWithDecay.length === 0) return;

    // Sort by decayed mastery
    const sortedByMastery = [...conceptsWithDecay]
      .sort((a, b) => b.decay.decayedMastery - a.decay.decayedMastery);

    // Top 25% are strengths, bottom 25% are weaknesses
    const strengthThreshold = Math.ceil(sortedByMastery.length * 0.25);
    const weaknessThreshold = Math.floor(sortedByMastery.length * 0.75);

    // Clear existing classifications
    profile.strengths = [];
    profile.weaknesses = [];

    for (let i = 0; i < sortedByMastery.length; i++) {
      const concept = sortedByMastery[i];
      const conceptMastery = profile.conceptMastery.get(concept.conceptId);
      
      if (!conceptMastery) continue;

      if (i < strengthThreshold) {
        conceptMastery.isStrength = true;
        conceptMastery.isWeakness = false;
        profile.strengths.push({
          conceptId: concept.conceptId,
          conceptName: concept.conceptName,
          classification: 'strength',
          confidence: Math.min(1, concept.decay.decayedMastery / 100),
          lastAssessed: new Date(),
          evidence: `Top ${strengthThreshold} performer with ${concept.decay.decayedMastery.toFixed(0)}% retention`,
          decayedScore: concept.decay.decayedMastery,
        });
      } else if (i >= weaknessThreshold) {
        conceptMastery.isStrength = false;
        conceptMastery.isWeakness = true;
        profile.weaknesses.push({
          conceptId: concept.conceptId,
          conceptName: concept.conceptName,
          classification: 'weakness',
          confidence: Math.min(1, (100 - concept.decay.decayedMastery) / 100),
          lastAssessed: new Date(),
          evidence: `Bottom performer with ${concept.decay.decayedMastery.toFixed(0)}% retention`,
          decayedScore: concept.decay.decayedMastery,
        });
      } else {
        conceptMastery.isStrength = false;
        conceptMastery.isWeakness = false;
      }
    }
  }

  // ============= Problem Selection for Smart Practice =============

  /**
   * Select concepts for smart practice based on decay and weaknesses
   */
  selectConceptsForPractice(
    profile: UserMasteryProfile,
    config: SmartPracticeConfig
  ): ConceptWithDecay[] {
    const conceptsWithDecay = this.calculateAllConceptDecay(profile);
    
    // Apply filters
    let filtered = conceptsWithDecay;

    // Exclude fresh concepts if configured
    if (config.excludeFresh) {
      filtered = filtered.filter(c => c.decay.classification !== 'fresh');
    }

    // Prioritize decayed concepts if configured
    if (config.prioritizeDecayed) {
      filtered = filtered.filter(c => 
        ['fading', 'decayed', 'critical'].includes(c.decay.classification)
      );
    }

    // Apply module window if configured
    if (config.moduleWindow > 0) {
      const minModuleSequence = Math.max(1, profile.totalModulesCompleted - config.moduleWindow);
      filtered = filtered.filter(c => c.moduleSequence >= minModuleSequence);
    }

    // Split into weaknesses and non-weaknesses
    const weaknesses = filtered.filter(c => c.isWeakness);
    const nonWeaknesses = filtered.filter(c => !c.isWeakness);
    const strengths = nonWeaknesses.filter(c => c.isStrength);

    // Calculate counts based on ratios
    const weaknessCount = config.focusWeaknesses
      ? Math.ceil(config.problemCount * config.weaknessRatio)
      : 0;
    const strengthCount = config.mixInStrengths
      ? Math.ceil(config.problemCount * (1 - config.weaknessRatio) * 0.3)
      : 0;
    const otherCount = config.problemCount - weaknessCount - strengthCount;

    // Select from each category
    const selected: ConceptWithDecay[] = [
      ...weaknesses.slice(0, weaknessCount),
      ...strengths.slice(0, strengthCount),
      ...nonWeaknesses.filter(c => !c.isStrength).slice(0, otherCount),
    ];

    // If we don't have enough, fill from all filtered
    if (selected.length < config.problemCount) {
      const selectedIds = new Set(selected.map(c => c.conceptId));
      const remaining = filtered.filter(c => !selectedIds.has(c.conceptId));
      selected.push(...remaining.slice(0, config.problemCount - selected.length));
    }

    return selected.slice(0, config.problemCount);
  }

  /**
   * Determine test difficulty based on concept decay
   */
  determineTestDifficulty(concept: ConceptWithDecay): 'easy' | 'medium' | 'hard' {
    // High decay = start with easier problems to rebuild
    if (concept.decay.classification === 'critical' || concept.decay.classification === 'decayed') {
      return 'easy';
    }

    // Low decay + high mastery = challenge with harder problems
    if (concept.decay.classification === 'fresh' && concept.masteryScore > 80) {
      return 'hard';
    }

    return 'medium';
  }
}

// ============= Storage Functions =============

/**
 * Get user mastery profile from localStorage
 */
export function getUserMasteryProfile(userId: string): UserMasteryProfile | null {
  try {
    const key = `${STORAGE_KEYS.USER_MASTERY_PROFILE}-${userId}`;
    const data = localStorage.getItem(key);
    if (!data) return null;

    const parsed = JSON.parse(data);
    
    // Convert plain object back to Map for conceptMastery
    const conceptMastery = new Map<string, ConceptMastery>();
    if (parsed.conceptMastery) {
      for (const [key, value] of Object.entries(parsed.conceptMastery)) {
        conceptMastery.set(key, {
          ...(value as ConceptMastery),
          lastPracticedInSmartMode: (value as ConceptMastery).lastPracticedInSmartMode 
            ? new Date((value as ConceptMastery).lastPracticedInSmartMode as unknown as string)
            : null,
        });
      }
    }

    return {
      ...parsed,
      conceptMastery,
      createdAt: new Date(parsed.createdAt),
      lastUpdatedAt: new Date(parsed.lastUpdatedAt),
      moduleCompletions: parsed.moduleCompletions.map((mc: ModuleCompletion) => ({
        ...mc,
        completedAt: new Date(mc.completedAt),
      })),
      learningTimeline: parsed.learningTimeline.map((event: LearningEvent) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      })),
    };
  } catch (error) {
    console.error('Error loading user mastery profile:', error);
    return null;
  }
}

/**
 * Save user mastery profile to localStorage
 */
export function saveUserMasteryProfile(profile: UserMasteryProfile): void {
  try {
    const key = `${STORAGE_KEYS.USER_MASTERY_PROFILE}-${profile.userId}`;
    
    // Convert Map to plain object for JSON serialization
    const conceptMasteryObj: Record<string, ConceptMastery> = {};
    for (const [key, value] of profile.conceptMastery) {
      conceptMasteryObj[key] = value;
    }

    const toSave = {
      ...profile,
      conceptMastery: conceptMasteryObj,
      lastUpdatedAt: new Date(),
    };

    localStorage.setItem(key, JSON.stringify(toSave));
  } catch (error) {
    console.error('Error saving user mastery profile:', error);
  }
}

/**
 * Initialize a new user mastery profile
 */
export function initializeUserMasteryProfile(userId: string): UserMasteryProfile {
  const now = new Date();
  return {
    userId,
    moduleCompletions: [],
    currentModuleIndex: 0,
    totalModulesCompleted: 0,
    totalProblemsCompleted: 0,
    totalSmartPracticeProblems: 0,
    conceptMastery: new Map(),
    strengths: [],
    weaknesses: [],
    learningTimeline: [],
    createdAt: now,
    lastUpdatedAt: now,
  };
}

// ============= Event Handlers =============

/**
 * Handle module completion - updates profile and initializes concept mastery
 */
export function onModuleComplete(
  profile: UserMasteryProfile,
  moduleId: string,
  moduleName: string,
  completionScore: number,
  problemsSolvedInModule: number,
  conceptsLearned: { conceptId: string; conceptName: string; masteryScore: number }[]
): UserMasteryProfile {
  const updated = { ...profile };
  const now = new Date();

  // Increment counters
  updated.totalModulesCompleted++;
  updated.totalProblemsCompleted += problemsSolvedInModule;
  updated.currentModuleIndex++;

  // Record module completion
  updated.moduleCompletions.push({
    moduleId,
    moduleName,
    sequenceNumber: updated.totalModulesCompleted,
    completedAt: now,
    completionScore,
    problemsSolvedInModule,
    totalProblemsAtCompletion: updated.totalProblemsCompleted,
    conceptsLearned: conceptsLearned.map(c => c.conceptId),
  });

  // Initialize concept mastery for new concepts
  for (const concept of conceptsLearned) {
    if (!updated.conceptMastery.has(concept.conceptId)) {
      updated.conceptMastery.set(concept.conceptId, {
        conceptId: concept.conceptId,
        conceptName: concept.conceptName,
        moduleId,
        moduleSequence: updated.totalModulesCompleted,
        problemsAtTimeOfLearning: updated.totalProblemsCompleted,
        masteryScore: concept.masteryScore,
        practiceCount: 0,
        successRate: 0,
        averageSubmissionAttempts: 0,
        isStrength: false,
        isWeakness: concept.masteryScore < 50,
        practiceCountAfterModule: 0,
        lastPracticedInSmartMode: null,
      });
    }
  }

  // Add to learning timeline
  updated.learningTimeline.push({
    type: 'module-completion',
    timestamp: now,
    moduleId,
    conceptIds: conceptsLearned.map(c => c.conceptId),
    score: completionScore,
  });

  updated.lastUpdatedAt = now;

  // Update strength/weakness classification
  const engine = new ProgressDecayEngine();
  engine.updateStrengthWeaknessClassification(updated);

  return updated;
}

/**
 * Handle smart practice problem completion - updates concept mastery and recovery
 */
export function onSmartPracticeComplete(
  profile: UserMasteryProfile,
  conceptId: string,
  success: boolean,
  submissionAttempts: number
): UserMasteryProfile {
  const updated = { ...profile };
  const now = new Date();

  const concept = updated.conceptMastery.get(conceptId);
  if (concept) {
    // Update practice count
    concept.practiceCount++;
    concept.practiceCountAfterModule++;
    concept.lastPracticedInSmartMode = now;

    // Update success rate
    const newSuccessRate = 
      (concept.successRate * (concept.practiceCount - 1) + (success ? 1 : 0)) / 
      concept.practiceCount;
    concept.successRate = newSuccessRate;

    // Update average submission attempts
    concept.averageSubmissionAttempts =
      (concept.averageSubmissionAttempts * (concept.practiceCount - 1) + submissionAttempts) /
      concept.practiceCount;

    // Update mastery based on performance
    if (success) {
      // Boost mastery on success (diminishing returns)
      const boost = (100 - concept.masteryScore) * 0.1;
      concept.masteryScore = Math.min(100, concept.masteryScore + boost);
    } else {
      // Small penalty on failure
      concept.masteryScore = Math.max(0, concept.masteryScore - 2);
    }
  }

  // Increment smart practice counter
  updated.totalSmartPracticeProblems++;

  // Add to learning timeline
  updated.learningTimeline.push({
    type: 'smart-practice',
    timestamp: now,
    conceptIds: [conceptId],
    score: success ? 100 : 0,
    details: { submissionAttempts },
  });

  updated.lastUpdatedAt = now;

  return updated;
}

// ============= Export Singleton Instance =============

export const progressDecayEngine = new ProgressDecayEngine();

// ============= Export Helper Functions =============

export {
  DEFAULT_DECAY_CONFIG,
  STORAGE_KEYS,
};