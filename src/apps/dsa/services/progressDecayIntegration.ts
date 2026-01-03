/**
 * Progress-Aware Decay Integration Service
 * 
 * Bridges the gap between:
 * - ProgressDecayEngine (decay calculation based on learning progress)
 * - ConceptScoringEngine (problem selection and scoring)
 * - SmartPracticeEngine (practice session management)
 * 
 * This integration ensures that:
 * 1. Concept scores incorporate progress decay
 * 2. Problem selection considers decayed mastery
 * 3. Module completions update both systems
 */

import type {
  UserMasteryProfile,
  ConceptMastery,
  ConceptWithDecay,
  SmartPracticeConfig,
  DecayClassification,
  ProgressDecayResult,
} from '../types/progress-decay';

import type {
  ConceptScore,
  ConceptPriorityResult,
  PracticeAttempt,
  AdaptiveProblem,
  SelectedProblemSet,
  ProblemSelectionCriteria,
} from '../types/smart-practice';

import {
  ProgressDecayEngine,
  getUserMasteryProfile,
  saveUserMasteryProfile,
  onModuleComplete,
  onSmartPracticeComplete,
} from './progressDecayEngine';

import {
  ConceptScoringEngine,
  initializeConcept,
  updateConceptScore,
  getPrioritizedConcepts,
  getRecommendedDifficulty,
} from './conceptScoringEngine';

import {
  problemFamilyMappings,
  getFamilyForProblem,
  getProblemsForFamily,
} from '../data/problemFamilyMapping';

// ============= Types =============

export interface IntegratedConceptScore extends ConceptScore {
  // Progress decay data
  progressDecay?: ProgressDecayResult;
  decayedMastery?: number;
  decayClassification?: DecayClassification;
  
  // Integrated priority (combines urgency, weakness, AND decay)
  integratedPriority: number;
}

export interface DecayAwareProblemSelection {
  problems: Array<{
    problem: AdaptiveProblem;
    conceptId: string;
    conceptName: string;
    decayStatus: DecayClassification;
    decayedMastery: number;
    priority: number;
    reason: 'decay-recovery' | 'weakness' | 'challenge' | 'variety';
    recommendedDifficulty: 'easy' | 'medium' | 'hard';
  }>;
  totalProblems: number;
  decayRecoveryProblems: number;
  weaknessProblems: number;
  challengeProblems: number;
}

// ============= Integration Engine =============

export class ProgressDecayIntegration {
  private decayEngine: ProgressDecayEngine;
  
  constructor() {
    this.decayEngine = new ProgressDecayEngine();
  }

  /**
   * Convert UserMasteryProfile concepts to ConceptScores with decay integration
   */
  convertToIntegratedScores(profile: UserMasteryProfile): IntegratedConceptScore[] {
    const conceptsWithDecay = this.decayEngine.calculateAllConceptDecay(profile);
    
    return conceptsWithDecay.map(concept => {
      // Calculate sequence number for ConceptScore format
      const learningSequence = concept.moduleSequence;
      
      // Convert to ConceptScore format
      const conceptScore: ConceptScore = {
        conceptId: concept.conceptId,
        conceptName: concept.conceptName,
        learningSequence,
        baseUrgency: 100 - concept.decay.decayedMastery, // Higher decay = higher urgency
        urgencyScore: concept.decay.urgencyToReview,
        weaknessScore: concept.isWeakness ? 80 : (concept.isStrength ? 20 : 50),
        combinedPriority: concept.priority,
        practiceCount: concept.practiceCount,
        successCount: Math.round(concept.successRate * concept.practiceCount),
        failureCount: Math.round((1 - concept.successRate) * concept.practiceCount),
        lastPracticed: concept.lastPracticedInSmartMode,
        successRate: concept.successRate,
        averageSolveTime: 0, // Not tracked in ConceptMastery
        totalHintsUsed: 0, // Not tracked in ConceptMastery
        lastUpdateTime: new Date(),
        moduleId: concept.moduleId,
        learnedAt: undefined, // Could be derived from profile.moduleCompletions
      };

      // Calculate integrated priority (combines original priority + decay)
      // Weight: 40% urgency, 30% weakness, 30% decay status
      const decayWeight = this.getDecayWeight(concept.decay.classification);
      const integratedPriority = 
        (concept.decay.urgencyToReview * 0.4) +
        (conceptScore.weaknessScore * 0.3) +
        (decayWeight * 0.3);

      return {
        ...conceptScore,
        progressDecay: concept.decay,
        decayedMastery: concept.decay.decayedMastery,
        decayClassification: concept.decay.classification,
        integratedPriority,
      };
    });
  }

  /**
   * Get decay weight for priority calculation
   */
  private getDecayWeight(classification: DecayClassification): number {
    switch (classification) {
      case 'fresh': return 10;
      case 'stable': return 25;
      case 'fading': return 50;
      case 'decayed': return 75;
      case 'critical': return 100;
      default: return 50;
    }
  }

  /**
   * Get prioritized concepts incorporating decay
   */
  getPrioritizedConceptsWithDecay(profile: UserMasteryProfile): ConceptPriorityResult[] {
    const integratedScores = this.convertToIntegratedScores(profile);
    
    // Sort by integrated priority (highest first)
    const sorted = integratedScores.sort((a, b) => b.integratedPriority - a.integratedPriority);
    
    return sorted.map(concept => ({
      conceptId: concept.conceptId,
      conceptName: concept.conceptName,
      priority: concept.integratedPriority,
      urgencyScore: concept.urgencyScore,
      weaknessScore: concept.weaknessScore,
      reason: this.getPriorityReason(concept),
      color: this.getPriorityColor(concept.integratedPriority),
    }));
  }

  /**
   * Generate priority reason based on concept state
   */
  private getPriorityReason(concept: IntegratedConceptScore): string {
    if (concept.decayClassification === 'critical') {
      return '🚨 Critical decay - urgent review needed';
    }
    if (concept.decayClassification === 'decayed') {
      return '⚠️ Significant forgetting - practice recommended';
    }
    if (concept.decayClassification === 'fading') {
      return '📉 Memory fading - review to reinforce';
    }
    if (concept.weaknessScore > 70) {
      return '⚠️ Struggling with this concept';
    }
    if (concept.urgencyScore > 80) {
      return '📚 Recently learned - needs reinforcement';
    }
    if (concept.practiceCount === 0) {
      return '🆕 Never practiced';
    }
    if (concept.decayClassification === 'fresh') {
      return '✅ Recently reviewed - stable';
    }
    return '📊 Regular practice maintains mastery';
  }

  /**
   * Get color based on priority
   */
  private getPriorityColor(priority: number): 'red' | 'yellow' | 'green' {
    if (priority >= 70) return 'red';
    if (priority >= 40) return 'yellow';
    return 'green';
  }

  /**
   * Select problems for smart practice with decay awareness
   */
  async selectProblemsWithDecayAwareness(
    profile: UserMasteryProfile,
    problemBank: AdaptiveProblem[],
    config: SmartPracticeConfig
  ): Promise<DecayAwareProblemSelection> {
    const selectedProblems: DecayAwareProblemSelection['problems'] = [];
    const conceptsWithDecay = this.decayEngine.calculateAllConceptDecay(profile);
    
    // Separate by decay status
    const criticalConcepts = conceptsWithDecay.filter(c => c.decay.classification === 'critical');
    const decayedConcepts = conceptsWithDecay.filter(c => c.decay.classification === 'decayed');
    const fadingConcepts = conceptsWithDecay.filter(c => c.decay.classification === 'fading');
    const weakConcepts = conceptsWithDecay.filter(c => c.isWeakness && !['critical', 'decayed'].includes(c.decay.classification));
    const stableConcepts = conceptsWithDecay.filter(c => !c.isWeakness && ['stable', 'fresh'].includes(c.decay.classification));

    // Calculate distribution
    const totalCount = config.problemCount;
    const decayRecoveryCount = Math.ceil(totalCount * 0.4); // 40% for decay recovery
    const weaknessCount = Math.ceil(totalCount * 0.3); // 30% for weaknesses
    const challengeCount = totalCount - decayRecoveryCount - weaknessCount; // Rest for challenge/variety

    let counters = { decay: 0, weakness: 0, challenge: 0 };

    // 1. First, select problems for critical/decayed concepts
    const decayPriorityConcepts = [...criticalConcepts, ...decayedConcepts, ...fadingConcepts];
    for (const concept of decayPriorityConcepts) {
      if (counters.decay >= decayRecoveryCount) break;
      
      const problem = this.findProblemForConcept(concept, problemBank, selectedProblems.map(p => p.problem.id));
      if (problem) {
        selectedProblems.push({
          problem,
          conceptId: concept.conceptId,
          conceptName: concept.conceptName,
          decayStatus: concept.decay.classification,
          decayedMastery: concept.decay.decayedMastery,
          priority: concept.priority,
          reason: 'decay-recovery',
          recommendedDifficulty: this.decayEngine.determineTestDifficulty(concept),
        });
        counters.decay++;
      }
    }

    // 2. Select problems for weakness concepts
    for (const concept of weakConcepts) {
      if (counters.weakness >= weaknessCount) break;
      
      const problem = this.findProblemForConcept(concept, problemBank, selectedProblems.map(p => p.problem.id));
      if (problem) {
        selectedProblems.push({
          problem,
          conceptId: concept.conceptId,
          conceptName: concept.conceptName,
          decayStatus: concept.decay.classification,
          decayedMastery: concept.decay.decayedMastery,
          priority: concept.priority,
          reason: 'weakness',
          recommendedDifficulty: this.decayEngine.determineTestDifficulty(concept),
        });
        counters.weakness++;
      }
    }

    // 3. Add challenge/variety problems from stable concepts
    for (const concept of stableConcepts) {
      if (counters.challenge >= challengeCount) break;
      
      const problem = this.findProblemForConcept(concept, problemBank, selectedProblems.map(p => p.problem.id));
      if (problem) {
        selectedProblems.push({
          problem,
          conceptId: concept.conceptId,
          conceptName: concept.conceptName,
          decayStatus: concept.decay.classification,
          decayedMastery: concept.decay.decayedMastery,
          priority: concept.priority,
          reason: 'challenge',
          recommendedDifficulty: this.decayEngine.determineTestDifficulty(concept),
        });
        counters.challenge++;
      }
    }

    return {
      problems: selectedProblems,
      totalProblems: selectedProblems.length,
      decayRecoveryProblems: counters.decay,
      weaknessProblems: counters.weakness,
      challengeProblems: counters.challenge,
    };
  }

  /**
   * Find a problem for a given concept
   */
  private findProblemForConcept(
    concept: ConceptWithDecay,
    problemBank: AdaptiveProblem[],
    excludeIds: string[]
  ): AdaptiveProblem | null {
    // Get family info for this concept
    const familyProblems = problemFamilyMappings
      .filter(m => m.familyId === concept.conceptId || m.familyName.toLowerCase().includes(concept.conceptName.toLowerCase()))
      .map(m => m.problemId);

    // Find matching problems in problem bank
    const matchingProblems = problemBank.filter(p => 
      !excludeIds.includes(p.id) && 
      (familyProblems.includes(p.id) || 
       p.concepts.includes(concept.conceptId) ||
       p.patterns.some(pattern => pattern.toLowerCase().includes(concept.conceptName.toLowerCase())))
    );

    if (matchingProblems.length === 0) return null;

    // Determine target difficulty based on decay
    const targetDifficulty = this.decayEngine.determineTestDifficulty(concept);

    // Filter by difficulty
    const difficultyMatched = matchingProblems.filter(p => p.difficulty.base === targetDifficulty);
    
    if (difficultyMatched.length > 0) {
      return difficultyMatched[Math.floor(Math.random() * difficultyMatched.length)];
    }

    // If no exact match, return any matching problem
    return matchingProblems[Math.floor(Math.random() * matchingProblems.length)];
  }

  /**
   * Sync ConceptScore updates back to UserMasteryProfile
   */
  syncScoreToProfile(
    profile: UserMasteryProfile,
    conceptId: string,
    attempt: PracticeAttempt
  ): UserMasteryProfile {
    // Use the existing onSmartPracticeComplete function
    return onSmartPracticeComplete(
      profile,
      conceptId,
      attempt.success,
      attempt.submissionAttempts
    );
  }

  /**
   * Initialize concept in both systems when completing a module
   */
  initializeConceptsForModule(
    profile: UserMasteryProfile,
    moduleId: string,
    moduleName: string,
    completionScore: number,
    problemsSolved: number,
    concepts: { conceptId: string; conceptName: string; masteryScore: number }[]
  ): UserMasteryProfile {
    return onModuleComplete(
      profile,
      moduleId,
      moduleName,
      completionScore,
      problemsSolved,
      concepts
    );
  }

  /**
   * Get decay summary for dashboard display
   */
  getDecaySummary(profile: UserMasteryProfile): {
    totalConcepts: number;
    freshCount: number;
    stableCount: number;
    fadingCount: number;
    decayedCount: number;
    criticalCount: number;
    averageRetention: number;
    urgentReviewCount: number;
    recommendedPracticeTime: number; // in minutes
  } {
    const conceptsWithDecay = this.decayEngine.calculateAllConceptDecay(profile);
    
    const counts = {
      fresh: 0,
      stable: 0,
      fading: 0,
      decayed: 0,
      critical: 0,
    };

    let totalRetention = 0;
    let urgentCount = 0;

    for (const concept of conceptsWithDecay) {
      counts[concept.decay.classification]++;
      totalRetention += concept.decay.decayedMastery;
      if (['fading', 'decayed', 'critical'].includes(concept.decay.classification)) {
        urgentCount++;
      }
    }

    const avgRetention = conceptsWithDecay.length > 0 
      ? totalRetention / conceptsWithDecay.length 
      : 100;

    // Estimate practice time: 15 min per urgent concept
    const recommendedTime = Math.max(15, urgentCount * 15);

    return {
      totalConcepts: conceptsWithDecay.length,
      freshCount: counts.fresh,
      stableCount: counts.stable,
      fadingCount: counts.fading,
      decayedCount: counts.decayed,
      criticalCount: counts.critical,
      averageRetention: avgRetention,
      urgentReviewCount: urgentCount,
      recommendedPracticeTime: recommendedTime,
    };
  }

  /**
   * Get next review recommendations
   */
  getReviewRecommendations(profile: UserMasteryProfile, maxRecommendations: number = 5): Array<{
    conceptId: string;
    conceptName: string;
    decayStatus: DecayClassification;
    currentRetention: number;
    recommendedDifficulty: 'easy' | 'medium' | 'hard';
    urgencyReason: string;
    moduleSource: string;
  }> {
    const conceptsWithDecay = this.decayEngine.calculateAllConceptDecay(profile);
    
    // Sort by priority (highest first)
    const sorted = conceptsWithDecay.sort((a, b) => b.priority - a.priority);
    
    return sorted.slice(0, maxRecommendations).map(concept => ({
      conceptId: concept.conceptId,
      conceptName: concept.conceptName,
      decayStatus: concept.decay.classification,
      currentRetention: concept.decay.decayedMastery,
      recommendedDifficulty: this.decayEngine.determineTestDifficulty(concept),
      urgencyReason: this.getUrgencyReason(concept),
      moduleSource: concept.moduleId,
    }));
  }

  /**
   * Get urgency reason for a concept
   */
  private getUrgencyReason(concept: ConceptWithDecay): string {
    const { decay } = concept;
    
    if (decay.classification === 'critical') {
      return `Critical: ${decay.modulesAfter} modules learned since, ${(decay.decayPercentage * 100).toFixed(0)}% forgotten`;
    }
    if (decay.classification === 'decayed') {
      return `Decayed: Practice needed to rebuild ${(decay.decayPercentage * 100).toFixed(0)}% lost retention`;
    }
    if (decay.classification === 'fading') {
      return `Fading: ${decay.modulesAfter} modules since learning, review recommended`;
    }
    if (concept.isWeakness) {
      return `Weakness: Struggling with ${(100 - concept.masteryScore).toFixed(0)}% difficulty`;
    }
    return `Regular review to maintain ${concept.masteryScore.toFixed(0)}% mastery`;
  }
}

// ============= Export Singleton =============

export const progressDecayIntegration = new ProgressDecayIntegration();

// ============= Export Functions =============

export const convertToIntegratedScores = (profile: UserMasteryProfile) =>
  progressDecayIntegration.convertToIntegratedScores(profile);

export const getPrioritizedConceptsWithDecay = (profile: UserMasteryProfile) =>
  progressDecayIntegration.getPrioritizedConceptsWithDecay(profile);

export const selectProblemsWithDecayAwareness = (
  profile: UserMasteryProfile,
  problemBank: AdaptiveProblem[],
  config: SmartPracticeConfig
) => progressDecayIntegration.selectProblemsWithDecayAwareness(profile, problemBank, config);

export const getDecaySummary = (profile: UserMasteryProfile) =>
  progressDecayIntegration.getDecaySummary(profile);

export const getReviewRecommendations = (profile: UserMasteryProfile, max?: number) =>
  progressDecayIntegration.getReviewRecommendations(profile, max);