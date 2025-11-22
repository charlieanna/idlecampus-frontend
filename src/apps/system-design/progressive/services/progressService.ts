/**
 * Progress Service
 * 
 * Manages user progress in the progressive flow system.
 * Uses localStorage initially, backward compatible with existing progress service.
 * Implements XP calculation based on GAMIFICATION_FORMULAS.md
 */

import {
  UserProgressState,
  ChallengeProgress,
  TrackProgress,
  LearningTrackType,
  ChallengeLevel,
  Achievement,
  Badge,
  XPTransaction,
  calculateUserLevel,
  getXPForLevel
} from '../types';
import { getAllProgressiveChallenges, isChallengeUnlocked } from './challengeMapper';

/**
 * Storage keys
 */
const STORAGE_KEY = 'progressive_flow_progress';
const STORAGE_VERSION = '1.0';

/**
 * Storage data structure
 */
interface StorageData {
  version: string;
  userId: string;
  progress: UserProgressState;
  lastUpdated: string;
}

/**
 * Progressive Flow Progress Service
 */
class ProgressiveProgressService {
  private userId: string;
  private progress: UserProgressState | null = null;

  constructor() {
    this.userId = this.getUserId();
    this.loadProgress();
  }

  /**
   * Get or create user ID
   */
  private getUserId(): string {
    let userId = localStorage.getItem('progressive_userId');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('progressive_userId', userId);
    }
    return userId;
  }

  /**
   * Load progress from localStorage
   */
  private loadProgress(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StorageData = JSON.parse(stored);
        
        if (data.version !== STORAGE_VERSION) {
          console.warn('Progress data version mismatch. Migrating...');
          this.progress = this.migrateProgress(data.progress);
        } else {
          this.progress = data.progress;
        }
      } else {
        this.progress = this.createFreshProgress();
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      this.progress = this.createFreshProgress();
    }
  }

  /**
   * Save progress to localStorage
   */
  private saveProgress(): void {
    if (!this.progress) return;

    try {
      const data: StorageData = {
        version: STORAGE_VERSION,
        userId: this.userId,
        progress: this.progress,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  /**
   * Create fresh progress object
   */
  private createFreshProgress(): UserProgressState {
    return {
      userId: this.userId,
      totalXP: 0,
      currentLevel: 1,
      challengeProgress: {},
      trackProgress: {
        fundamentals: this.createTrackProgress('fundamentals'),
        concepts: this.createTrackProgress('concepts'),
        systems: this.createTrackProgress('systems')
      },
      unlockedChallenges: [],
      achievements: [],
      badges: [],
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date().toISOString(),
      totalChallengesStarted: 0,
      totalChallengesCompleted: 0,
      totalLevelsCompleted: 0,
      totalTimeSpentMinutes: 0,
      assessmentCompleted: false
    };
  }

  /**
   * Create track progress object
   */
  private createTrackProgress(trackId: LearningTrackType): TrackProgress {
    const challenges = getAllProgressiveChallenges()[trackId];
    return {
      trackId,
      status: trackId === 'fundamentals' ? 'in_progress' : 'locked',
      challengesCompleted: 0,
      totalChallenges: challenges.length,
      progressPercentage: 0,
      timeSpentMinutes: 0
    };
  }

  /**
   * Migrate old progress to new version
   */
  private migrateProgress(oldProgress: any): UserProgressState {
    return {
      ...this.createFreshProgress(),
      ...oldProgress
    };
  }

  /**
   * Get current user progress
   */
  getProgress(): UserProgressState {
    if (!this.progress) {
      this.progress = this.createFreshProgress();
    }
    return this.progress;
  }

  /**
   * Get progress for a specific challenge
   */
  getChallengeProgress(challengeId: string): ChallengeProgress | null {
    if (!this.progress) return null;
    return this.progress.challengeProgress[challengeId] || null;
  }

  /**
   * Initialize progress for a new challenge
   */
  startChallenge(challengeId: string): void {
    if (!this.progress) {
      this.progress = this.createFreshProgress();
    }

    if (!this.progress.challengeProgress[challengeId]) {
      this.progress.challengeProgress[challengeId] = {
        challengeId,
        status: 'in_progress',
        levelsCompleted: [],
        currentLevel: 1,
        totalAttempts: 0,
        bestScore: 0,
        timeSpentMinutes: 0,
        xpEarned: 0,
        hintsUsed: 0,
        solutionViewed: false
      };
      
      this.progress.totalChallengesStarted++;
      this.unlockChallenge(challengeId);
      this.saveProgress();
    }
  }

  /**
   * Mark a level as completed
   * Implements XP calculation from GAMIFICATION_FORMULAS.md
   */
  markLevelComplete(
    challengeId: string,
    level: ChallengeLevel,
    score: number,
    timeSpentMinutes: number,
    hintsUsed: number = 0,
    solutionViewed: boolean = false
  ): { xpEarned: number; levelUp: boolean } {
    if (!this.progress) {
      this.progress = this.createFreshProgress();
    }

    this.startChallenge(challengeId);
    const challengeProgress = this.progress.challengeProgress[challengeId];

    // Don't re-award XP for already completed levels
    if (challengeProgress.levelsCompleted.includes(level)) {
      return { xpEarned: 0, levelUp: false };
    }

    // Calculate XP based on performance
    const xpEarned = this.calculateLevelXP(score, level, hintsUsed, solutionViewed);
    
    const oldLevel = this.progress.currentLevel;

    // Update challenge progress
    challengeProgress.levelsCompleted.push(level);
    challengeProgress.levelsCompleted.sort((a, b) => a - b);
    challengeProgress.currentLevel = Math.min(level + 1, 5) as ChallengeLevel;
    challengeProgress.bestScore = Math.max(challengeProgress.bestScore, score);
    challengeProgress.timeSpentMinutes += timeSpentMinutes;
    challengeProgress.xpEarned += xpEarned;
    
    if (hintsUsed > 0) {
      challengeProgress.hintsUsed += hintsUsed;
    }
    if (solutionViewed) {
      challengeProgress.solutionViewed = true;
    }

    // Check if challenge is complete
    if (challengeProgress.levelsCompleted.length === 5) {
      challengeProgress.status = 'completed';
      challengeProgress.completedAt = new Date().toISOString();
      this.progress.totalChallengesCompleted++;
      this.markChallengeComplete(challengeId);
    }

    // Update user stats
    this.progress.totalXP += xpEarned;
    this.progress.currentLevel = calculateUserLevel(this.progress.totalXP);
    this.progress.totalLevelsCompleted++;
    this.progress.totalTimeSpentMinutes += timeSpentMinutes;

    // Update streak
    this.updateStreak();

    // Save progress
    this.saveProgress();

    // Check for achievements
    this.checkAchievements(challengeId, level);

    const levelUp = this.progress.currentLevel > oldLevel;

    return { xpEarned, levelUp };
  }

  /**
   * Calculate XP for completing a level
   * Based on GAMIFICATION_FORMULAS.md
   */
  private calculateLevelXP(
    score: number,
    level: ChallengeLevel,
    hintsUsed: number,
    solutionViewed: boolean
  ): number {
    // Base XP per level
    const baseXP: Record<ChallengeLevel, number> = {
      1: 100,
      2: 150,
      3: 200,
      4: 250,
      5: 300
    };

    let xp = baseXP[level];

    // Performance multiplier
    if (score >= 100) {
      xp *= 1.5; // Perfect
    } else if (score >= 90) {
      xp *= 1.25; // Excellent
    } else if (score >= 75) {
      xp *= 1.0; // Good
    } else if (score >= 60) {
      xp *= 0.75; // Pass
    } else {
      return 0; // Fail - no XP
    }

    // Hint penalties
    if (hintsUsed > 0) {
      const hintPenalty = Math.max(0.5, 1 - (hintsUsed * 0.1));
      xp *= hintPenalty;
    }

    // Solution viewing penalty
    if (solutionViewed) {
      xp *= 0.5;
    }

    // Streak bonus
    const streakBonus = this.getStreakBonus();
    xp *= streakBonus;

    return Math.floor(xp);
  }

  /**
   * Get streak bonus multiplier
   */
  private getStreakBonus(): number {
    if (!this.progress) return 1.0;
    
    const streak = this.progress.currentStreak;
    if (streak === 0) return 1.0;
    if (streak <= 3) return 1.1;
    if (streak <= 7) return 1.25;
    if (streak <= 14) return 1.5;
    if (streak <= 30) return 1.75;
    return 2.0;
  }

  /**
   * Update user streak
   */
  private updateStreak(): void {
    if (!this.progress) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = this.progress.lastActivityDate.split('T')[0];

    const daysDiff = this.getDaysDifference(lastActivity, today);

    if (daysDiff === 0) {
      // Same day - no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day - increment streak
      this.progress.currentStreak++;
      this.progress.longestStreak = Math.max(
        this.progress.longestStreak,
        this.progress.currentStreak
      );
    } else {
      // Streak broken
      this.progress.currentStreak = 1;
    }

    this.progress.lastActivityDate = new Date().toISOString();
  }

  /**
   * Get days difference between two dates
   */
  private getDaysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Mark entire challenge as completed and unlock next challenges
   */
  private markChallengeComplete(challengeId: string): void {
    if (!this.progress) return;

    // Update track progress
    const challenge = getAllProgressiveChallenges();
    let track: LearningTrackType | null = null;

    for (const [trackId, challenges] of Object.entries(challenge)) {
      if (challenges.some(c => c.id === challengeId)) {
        track = trackId as LearningTrackType;
        break;
      }
    }

    if (track) {
      const trackProgress = this.progress.trackProgress[track];
      trackProgress.challengesCompleted++;
      trackProgress.progressPercentage = 
        (trackProgress.challengesCompleted / trackProgress.totalChallenges) * 100;

      if (trackProgress.progressPercentage >= 100) {
        trackProgress.status = 'completed';
        trackProgress.completedAt = new Date().toISOString();
      }
    }

    // Unlock dependent challenges
    this.unlockDependentChallenges();
  }

  /**
   * Unlock a challenge
   */
  private unlockChallenge(challengeId: string): void {
    if (!this.progress) return;
    
    if (!this.progress.unlockedChallenges.includes(challengeId)) {
      this.progress.unlockedChallenges.push(challengeId);
    }

    const progress = this.progress.challengeProgress[challengeId];
    if (progress && progress.status === 'locked') {
      progress.status = 'unlocked';
    }
  }

  /**
   * Unlock challenges that have prerequisites met
   */
  private unlockDependentChallenges(): void {
    if (!this.progress) return;

    const completed = Object.keys(this.progress.challengeProgress)
      .filter(id => this.progress!.challengeProgress[id].status === 'completed');

    const allChallenges = getAllProgressiveChallenges();
    const allChallengesList = [
      ...allChallenges.fundamentals,
      ...allChallenges.concepts,
      ...allChallenges.systems
    ];

    allChallengesList.forEach(challenge => {
      const unlocked = isChallengeUnlocked(
        challenge.id,
        completed,
        this.progress!.currentLevel,
        this.progress!.trackProgress
      );

      if (unlocked) {
        this.unlockChallenge(challenge.id);
      }
    });
  }

  /**
   * Get unlocked challenges
   */
  getUnlockedChallenges(): string[] {
    if (!this.progress) return [];
    return this.progress.unlockedChallenges;
  }

  /**
   * Check and award achievements
   */
  private checkAchievements(challengeId: string, level: ChallengeLevel): void {
    if (!this.progress) return;

    const newAchievements: Achievement[] = [];

    // First level completion
    if (this.progress.totalLevelsCompleted === 1) {
      newAchievements.push({
        id: 'first_level',
        slug: 'first_level',
        name: 'Getting Started',
        description: 'Completed your first level!',
        icon: '🎯',
        rarity: 'common',
        xpReward: 50,
        unlockedAt: new Date().toISOString(),
        category: 'completion'
      });
    }

    // First challenge completion
    if (this.progress.totalChallengesCompleted === 1) {
      newAchievements.push({
        id: 'first_challenge',
        slug: 'first_challenge',
        name: 'Challenge Accepted',
        description: 'Completed your first challenge!',
        icon: '🏆',
        rarity: 'common',
        xpReward: 100,
        unlockedAt: new Date().toISOString(),
        category: 'completion'
      });
    }

    // Milestone achievements
    if (this.progress.totalChallengesCompleted === 10) {
      newAchievements.push({
        id: 'challenge_10',
        slug: 'challenge_10',
        name: 'Rising Star',
        description: 'Completed 10 challenges',
        icon: '⭐',
        rarity: 'rare',
        xpReward: 200,
        unlockedAt: new Date().toISOString(),
        category: 'completion'
      });
    }

    // Streak achievements
    if (this.progress.currentStreak === 7) {
      newAchievements.push({
        id: 'streak_7',
        slug: 'streak_7',
        name: 'Week Warrior',
        description: '7 day streak!',
        icon: '🔥',
        rarity: 'rare',
        xpReward: 150,
        unlockedAt: new Date().toISOString(),
        category: 'streak'
      });
    }

    // Add achievements and award XP
    newAchievements.forEach(achievement => {
      if (!this.progress!.achievements.find(a => a.id === achievement.id)) {
        this.progress!.achievements.push(achievement);
        this.progress!.totalXP += achievement.xpReward;
      }
    });

    if (newAchievements.length > 0) {
      this.saveProgress();
    }
  }

  /**
   * Record hint usage
   */
  useHint(challengeId: string): void {
    if (!this.progress) return;
    
    this.startChallenge(challengeId);
    const progress = this.progress.challengeProgress[challengeId];
    progress.hintsUsed++;
    this.saveProgress();
  }

  /**
   * Record solution view
   */
  viewSolution(challengeId: string): void {
    if (!this.progress) return;
    
    this.startChallenge(challengeId);
    const progress = this.progress.challengeProgress[challengeId];
    progress.solutionViewed = true;
    this.saveProgress();
  }

  /**
   * Get track progress
   */
  getTrackProgress(trackId: LearningTrackType): TrackProgress | null {
    if (!this.progress) return null;
    return this.progress.trackProgress[trackId] || null;
  }

  /**
   * Complete assessment
   */
  completeAssessment(
    skillLevel: 'beginner' | 'intermediate' | 'advanced'
  ): void {
    if (!this.progress) {
      this.progress = this.createFreshProgress();
    }

    this.progress.assessmentCompleted = true;
    this.progress.skillLevel = skillLevel;

    // Unlock initial challenges based on skill level
    this.unlockInitialChallenges(skillLevel);
    
    this.saveProgress();
  }

  /**
   * Unlock initial challenges based on skill level
   */
  private unlockInitialChallenges(skillLevel: string): void {
    const allChallenges = getAllProgressiveChallenges();
    
    if (skillLevel === 'beginner') {
      // Unlock first 3 fundamentals challenges
      allChallenges.fundamentals.slice(0, 3).forEach(c => {
        this.unlockChallenge(c.id);
      });
    } else if (skillLevel === 'intermediate') {
      // Unlock all fundamentals and first 3 concepts
      allChallenges.fundamentals.forEach(c => this.unlockChallenge(c.id));
      allChallenges.concepts.slice(0, 3).forEach(c => this.unlockChallenge(c.id));
    } else {
      // Unlock everything except L6
      allChallenges.fundamentals.forEach(c => this.unlockChallenge(c.id));
      allChallenges.concepts.forEach(c => this.unlockChallenge(c.id));
      allChallenges.systems
        .filter(c => !c.id.startsWith('l6_'))
        .forEach(c => this.unlockChallenge(c.id));
    }
  }

  /**
   * Reset progress (for testing)
   */
  resetProgress(): void {
    this.progress = this.createFreshProgress();
    this.saveProgress();
  }

  /**
   * Export progress as JSON
   */
  exportProgress(): string {
    return JSON.stringify(this.getProgress(), null, 2);
  }

  /**
   * Import progress from JSON
   */
  importProgress(jsonData: string): boolean {
    try {
      const imported = JSON.parse(jsonData);
      this.progress = imported;
      this.saveProgress();
      return true;
    } catch (error) {
      console.error('Failed to import progress:', error);
      return false;
    }
  }
}

// Export singleton instance
export const progressiveProgressService = new ProgressiveProgressService();

// Export class for testing
export { ProgressiveProgressService };