/**
 * Progress Service with Backend Integration
 * 
 * Extends the localStorage-based progress service with backend API integration.
 * Provides seamless switching between localStorage and backend storage.
 */

import { apiClient } from './apiClient';
import { ProgressiveProgressService } from './progressService';
import {
  UserProgressState,
  ChallengeProgress,
  ChallengeLevel,
} from '../types';

// Configuration flag - reads from environment variable
const USE_BACKEND = import.meta.env.VITE_PROGRESSIVE_FLOW_USE_BACKEND === 'true';

/**
 * Backend-integrated Progress Service
 */
class BackendProgressService extends ProgressiveProgressService {
  private useBackend: boolean = USE_BACKEND;
  private backendAvailable: boolean = false;

  constructor() {
    super();
    this.checkBackendAvailability();
  }

  /**
   * Check if backend is available
   */
  private async checkBackendAvailability(): Promise<void> {
    if (!this.useBackend) {
      this.backendAvailable = false;
      return;
    }

    try {
      this.backendAvailable = await apiClient.healthCheck();
      console.log(`[ProgressService] Backend ${this.backendAvailable ? 'available' : 'unavailable'}`);
      
      if (this.backendAvailable) {
        // Sync local data to backend if needed
        await this.syncToBackend();
      }
    } catch (error) {
      console.error('[ProgressService] Backend health check failed:', error);
      this.backendAvailable = false;
    }
  }

  /**
   * Get current user progress
   * Override to use backend if available
   */
  override getProgress(): UserProgressState {
    if (this.useBackend && this.backendAvailable) {
      // Return cached progress immediately, refresh in background
      this.refreshFromBackend();
    }
    return super.getProgress();
  }

  /**
   * Refresh progress from backend
   */
  private async refreshFromBackend(): Promise<void> {
    try {
      const userId = this['userId']; // Access private property
      const backendProgress = await apiClient.getUserProgress(userId);
      
      // Convert backend format to frontend format
      const converted = this.convertBackendToFrontend(backendProgress);
      this['progress'] = converted; // Update private property
      this['saveProgress'](); // Save to localStorage as cache
    } catch (error) {
      console.error('[ProgressService] Failed to refresh from backend:', error);
      // Fall back to localStorage
      this.backendAvailable = false;
    }
  }

  /**
   * Mark a level as completed
   * Override to sync with backend
   */
  override markLevelComplete(
    challengeId: string,
    level: ChallengeLevel,
    score: number,
    timeSpentMinutes: number,
    hintsUsed: number = 0,
    solutionViewed: boolean = false
  ): { xpEarned: number; levelUp: boolean } {
    // Call parent implementation first
    const result = super.markLevelComplete(
      challengeId,
      level,
      score,
      timeSpentMinutes,
      hintsUsed,
      solutionViewed
    );

    // Sync to backend if available
    if (this.useBackend && this.backendAvailable) {
      this.syncLevelCompletionToBackend(
        challengeId,
        level,
        score,
        timeSpentMinutes,
        hintsUsed,
        solutionViewed
      ).catch(error => {
        console.error('[ProgressService] Failed to sync level completion:', error);
      });
    }

    return result;
  }

  /**
   * Sync level completion to backend
   */
  private async syncLevelCompletionToBackend(
    challengeId: string,
    level: ChallengeLevel,
    score: number,
    timeSpentMinutes: number,
    hintsUsed: number,
    solutionViewed: boolean
  ): Promise<void> {
    try {
      const userId = this['userId'];
      const progress = this.getProgress();
      const challengeProgress = progress.challengeProgress[challengeId];

      await apiClient.completeLevel(userId, challengeId, level, {
        score,
        timeSpentMinutes,
        hintsUsed,
        designSnapshot: {}, // Would contain actual design data
        testResults: {}, // Would contain actual test results
      });
    } catch (error) {
      console.error('[ProgressService] Backend sync failed:', error);
      throw error;
    }
  }

  /**
   * Complete assessment
   * Override to sync with backend
   */
  override completeAssessment(
    skillLevel: 'beginner' | 'intermediate' | 'advanced'
  ): void {
    super.completeAssessment(skillLevel);

    if (this.useBackend && this.backendAvailable) {
      this.syncAssessmentToBackend(skillLevel).catch(error => {
        console.error('[ProgressService] Failed to sync assessment:', error);
      });
    }
  }

  /**
   * Sync assessment to backend
   */
  private async syncAssessmentToBackend(
    skillLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<void> {
    try {
      const userId = this['userId'];
      const score = skillLevel === 'beginner' ? 30 : skillLevel === 'intermediate' ? 60 : 85;
      
      await apiClient.saveAssessment(userId, { skillLevel }, score);
    } catch (error) {
      console.error('[ProgressService] Assessment sync failed:', error);
      throw error;
    }
  }

  /**
   * Sync local progress to backend
   */
  async syncToBackend(): Promise<void> {
    if (!this.backendAvailable) {
      console.warn('[ProgressService] Backend not available for sync');
      return;
    }

    try {
      const progress = this.getProgress();
      const userId = this['userId'];

      // Sync each completed level
      for (const [challengeId, challengeProgress] of Object.entries(progress.challengeProgress)) {
        if (challengeProgress.status === 'completed' || challengeProgress.levelsCompleted.length > 0) {
          // Sync each completed level
          for (const level of challengeProgress.levelsCompleted) {
            await this.syncLevelCompletionToBackend(
              challengeId,
              level,
              challengeProgress.bestScore,
              challengeProgress.timeSpentMinutes,
              challengeProgress.hintsUsed,
              challengeProgress.solutionViewed
            );
          }
        }
      }

      console.log('[ProgressService] Successfully synced to backend');
    } catch (error) {
      console.error('[ProgressService] Sync to backend failed:', error);
      throw error;
    }
  }

  /**
   * Convert backend progress format to frontend format
   */
  private convertBackendToFrontend(backendProgress: any): UserProgressState {
    const progress = super.getProgress(); // Get current progress as base

    // Update with backend data
    progress.totalXP = backendProgress.stats.totalXP;
    progress.currentLevel = backendProgress.stats.currentLevel;
    progress.totalChallengesStarted = backendProgress.stats.totalChallengesStarted;
    progress.totalChallengesCompleted = backendProgress.stats.totalChallengesCompleted;
    progress.totalLevelsCompleted = backendProgress.stats.totalLevelsCompleted;
    progress.totalTimeSpentMinutes = backendProgress.stats.totalTimeSpentMinutes;
    progress.currentStreak = backendProgress.streak.currentStreak;
    progress.longestStreak = backendProgress.streak.longestStreak;
    progress.lastActivityDate = backendProgress.streak.lastActivityDate || new Date().toISOString();

    // Convert challenge progress
    backendProgress.challenges.forEach((challenge: any) => {
      progress.challengeProgress[challenge.challengeId] = {
        challengeId: challenge.challengeId,
        status: challenge.status,
        levelsCompleted: challenge.levelsCompleted,
        currentLevel: challenge.currentLevel || 1,
        totalAttempts: challenge.totalAttempts,
        bestScore: challenge.bestScore || 0,
        timeSpentMinutes: challenge.totalTimeSpentMinutes,
        xpEarned: challenge.xpEarned,
        hintsUsed: 0,
        solutionViewed: false,
        startedAt: challenge.startDate,
        completedAt: challenge.completionDate,
      };
    });

    // Convert achievements
    progress.achievements = backendProgress.achievements
      .filter((a: any) => a.unlockedAt)
      .map((a: any) => ({
        id: a.id,
        slug: a.slug,
        name: a.name,
        description: a.description,
        icon: a.iconUrl || '🏆',
        rarity: a.rarity,
        xpReward: a.xpReward,
        unlockedAt: a.unlockedAt,
        category: a.category,
      }));

    return progress;
  }

  /**
   * Enable backend mode
   */
  enableBackend(): void {
    this.useBackend = true;
    this.checkBackendAvailability();
  }

  /**
   * Disable backend mode
   */
  disableBackend(): void {
    this.useBackend = false;
    this.backendAvailable = false;
  }

  /**
   * Check if using backend
   */
  isUsingBackend(): boolean {
    return this.useBackend && this.backendAvailable;
  }

  /**
   * Force sync to backend
   */
  async forceSync(): Promise<void> {
    await this.syncToBackend();
  }
}

/**
 * Factory function to get the appropriate progress service
 */
export function getProgressService(): ProgressiveProgressService {
  if (USE_BACKEND) {
    return new BackendProgressService();
  }
  return new ProgressiveProgressService();
}

// Export singleton instance
export const progressService = getProgressService();

// Export class for testing
export { BackendProgressService };