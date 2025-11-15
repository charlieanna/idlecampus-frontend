import {
  UserProgress,
  ProblemProgress,
  TrackProgress,
  Achievement,
} from '../types/coachConfig';

/**
 * Progress Service
 * Manages user learning progress across problems and tracks
 */

const STORAGE_KEY = 'system_design_progress';
const STORAGE_VERSION = '1.0';

interface StorageData {
  version: string;
  userId: string;
  progress: UserProgress;
  lastUpdated: string;
}

class ProgressService {
  private userId: string;
  private progress: UserProgress | null = null;

  constructor() {
    this.userId = this.getUserId();
    this.loadProgress();
  }

  /**
   * Get or create user ID
   */
  private getUserId(): string {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', userId);
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

        // Version check
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
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }

  /**
   * Create fresh progress object
   */
  private createFreshProgress(): UserProgress {
    return {
      userId: this.userId,
      problemProgress: {},
      trackProgress: {},
      totalProblemsCompleted: 0,
      totalLevelsCompleted: 0,
      totalTimeSpent: 0,
      achievements: [],
    };
  }

  /**
   * Migrate old progress to new version
   */
  private migrateProgress(oldProgress: any): UserProgress {
    // Add migration logic here as schema evolves
    return {
      ...this.createFreshProgress(),
      ...oldProgress,
    };
  }

  /**
   * Get current user progress
   */
  getProgress(): UserProgress {
    if (!this.progress) {
      this.progress = this.createFreshProgress();
    }
    return this.progress;
  }

  /**
   * Get progress for a specific problem
   */
  getProblemProgress(problemId: string): ProblemProgress | null {
    if (!this.progress) return null;
    return this.progress.problemProgress[problemId] || null;
  }

  /**
   * Initialize progress for a new problem
   */
  startProblem(problemId: string): void {
    if (!this.progress) {
      this.progress = this.createFreshProgress();
    }

    if (!this.progress.problemProgress[problemId]) {
      this.progress.problemProgress[problemId] = {
        problemId,
        levelsCompleted: [],
        currentLevel: 1,
        lastAttempt: new Date(),
        totalAttempts: 0,
        timeSpent: 0,
        hintsUsed: 0,
        solutionsViewed: [],
      };
      this.saveProgress();
    }
  }

  /**
   * Record an attempt on a problem
   */
  recordAttempt(problemId: string, level: number): void {
    if (!this.progress) return;

    this.startProblem(problemId);
    this.progress.problemProgress[problemId].totalAttempts++;
    this.progress.problemProgress[problemId].lastAttempt = new Date();
    this.saveProgress();
  }

  /**
   * Mark a level as completed
   */
  markLevelComplete(
    problemId: string,
    level: number,
    score?: number,
    timeSpent?: number
  ): void {
    if (!this.progress) return;

    this.startProblem(problemId);
    const problemProgress = this.progress.problemProgress[problemId];

    // Add level to completed if not already there
    if (!problemProgress.levelsCompleted.includes(level)) {
      problemProgress.levelsCompleted.push(level);
      problemProgress.levelsCompleted.sort((a, b) => a - b);
      this.progress.totalLevelsCompleted++;
    }

    // Update best score
    if (score !== undefined) {
      problemProgress.bestScore = Math.max(problemProgress.bestScore || 0, score);
    }

    // Update time spent
    if (timeSpent !== undefined) {
      problemProgress.timeSpent += timeSpent;
      this.progress.totalTimeSpent += timeSpent;
    }

    // Update current level
    problemProgress.currentLevel = level + 1;

    this.saveProgress();

    // Check for achievements
    this.checkAchievements(problemId, level);
  }

  /**
   * Mark entire problem as completed
   */
  markProblemComplete(problemId: string): void {
    if (!this.progress) return;

    this.progress.totalProblemsCompleted++;
    this.saveProgress();

    // Check for completion achievements
    this.checkCompletionAchievements();
  }

  /**
   * Record hint usage
   */
  useHint(problemId: string): void {
    if (!this.progress) return;

    this.startProblem(problemId);
    this.progress.problemProgress[problemId].hintsUsed++;
    this.saveProgress();
  }

  /**
   * Record solution view
   */
  viewSolution(problemId: string, solutionId: string): void {
    if (!this.progress) return;

    this.startProblem(problemId);
    const problemProgress = this.progress.problemProgress[problemId];

    if (!problemProgress.solutionsViewed.includes(solutionId)) {
      problemProgress.solutionsViewed.push(solutionId);
      this.saveProgress();
    }
  }

  /**
   * Get track progress
   */
  getTrackProgress(trackId: string): TrackProgress | null {
    if (!this.progress) return null;
    return this.progress.trackProgress[trackId] || null;
  }

  /**
   * Start a learning track
   */
  startTrack(trackId: string, firstProblemId: string): void {
    if (!this.progress) {
      this.progress = this.createFreshProgress();
    }

    if (!this.progress.trackProgress[trackId]) {
      this.progress.trackProgress[trackId] = {
        trackId,
        problemsCompleted: [],
        currentProblem: firstProblemId,
        percentComplete: 0,
        startedAt: new Date(),
        lastActive: new Date(),
      };
      this.saveProgress();
    }
  }

  /**
   * Update track progress when a problem is completed
   */
  updateTrackProgress(
    trackId: string,
    problemId: string,
    totalProblems: number,
    nextProblemId?: string
  ): void {
    if (!this.progress) return;

    const trackProgress = this.progress.trackProgress[trackId];
    if (!trackProgress) return;

    if (!trackProgress.problemsCompleted.includes(problemId)) {
      trackProgress.problemsCompleted.push(problemId);
    }

    trackProgress.percentComplete =
      (trackProgress.problemsCompleted.length / totalProblems) * 100;
    trackProgress.currentProblem = nextProblemId || null;
    trackProgress.lastActive = new Date();

    this.saveProgress();
  }

  /**
   * Get next recommended problem based on current progress
   */
  getNextRecommendedProblem(currentProblemId: string): string | null {
    // This would be enhanced with actual recommendation logic
    // For now, return null and let the problem config handle it
    return null;
  }

  /**
   * Check and award achievements
   */
  private checkAchievements(problemId: string, level: number): void {
    if (!this.progress) return;

    const achievements: Achievement[] = [];

    // First level completion
    if (level === 1) {
      achievements.push({
        id: 'first_level_complete',
        name: 'Getting Started',
        description: 'Completed your first level!',
        icon: '🎯',
        unlockedAt: new Date(),
        rarity: 'common',
      });
    }

    // Problem-specific achievements
    if (problemId === 'tiny_url' && level === 2) {
      achievements.push({
        id: 'caching_master',
        name: 'Caching Master',
        description: 'Mastered caching for read-heavy workloads',
        icon: '💾',
        unlockedAt: new Date(),
        rarity: 'rare',
      });
    }

    // Perfect score achievements
    const problemProgress = this.progress.problemProgress[problemId];
    if (problemProgress.bestScore === 100) {
      achievements.push({
        id: `perfect_${problemId}`,
        name: 'Perfect Solution',
        description: `Achieved 100% score on ${problemId}`,
        icon: '⭐',
        unlockedAt: new Date(),
        rarity: 'epic',
      });
    }

    // Add new achievements
    achievements.forEach(achievement => {
      if (!this.progress!.achievements.find(a => a.id === achievement.id)) {
        this.progress!.achievements.push(achievement);
      }
    });

    if (achievements.length > 0) {
      this.saveProgress();
    }
  }

  /**
   * Check completion-based achievements
   */
  private checkCompletionAchievements(): void {
    if (!this.progress) return;

    const achievements: Achievement[] = [];
    const total = this.progress.totalProblemsCompleted;

    if (total === 1) {
      achievements.push({
        id: 'first_problem_complete',
        name: 'Problem Solver',
        description: 'Completed your first problem!',
        icon: '🏆',
        unlockedAt: new Date(),
        rarity: 'common',
      });
    } else if (total === 5) {
      achievements.push({
        id: 'five_problems',
        name: 'Getting Good',
        description: 'Completed 5 problems',
        icon: '🔥',
        unlockedAt: new Date(),
        rarity: 'rare',
      });
    } else if (total === 10) {
      achievements.push({
        id: 'ten_problems',
        name: 'System Design Expert',
        description: 'Completed 10 problems',
        icon: '🚀',
        unlockedAt: new Date(),
        rarity: 'epic',
      });
    }

    achievements.forEach(achievement => {
      if (!this.progress!.achievements.find(a => a.id === achievement.id)) {
        this.progress!.achievements.push(achievement);
      }
    });

    if (achievements.length > 0) {
      this.saveProgress();
    }
  }

  /**
   * Reset all progress (for testing or user request)
   */
  resetProgress(): void {
    this.progress = this.createFreshProgress();
    this.saveProgress();
  }

  /**
   * Export progress as JSON (for backup or transfer)
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

  /**
   * Get statistics summary
   */
  getStats(): {
    problemsCompleted: number;
    levelsCompleted: number;
    totalTimeSpent: number;
    averageTimePerProblem: number;
    achievementsUnlocked: number;
    currentStreak: number;
  } {
    if (!this.progress) {
      return {
        problemsCompleted: 0,
        levelsCompleted: 0,
        totalTimeSpent: 0,
        averageTimePerProblem: 0,
        achievementsUnlocked: 0,
        currentStreak: 0,
      };
    }

    const problemsCompleted = this.progress.totalProblemsCompleted;
    const averageTimePerProblem =
      problemsCompleted > 0
        ? this.progress.totalTimeSpent / problemsCompleted
        : 0;

    return {
      problemsCompleted,
      levelsCompleted: this.progress.totalLevelsCompleted,
      totalTimeSpent: this.progress.totalTimeSpent,
      averageTimePerProblem,
      achievementsUnlocked: this.progress.achievements.length,
      currentStreak: this.calculateStreak(),
    };
  }

  /**
   * Calculate current learning streak (days)
   */
  private calculateStreak(): number {
    // Simplified streak calculation
    // In production, this would check daily activity
    return 0; // TODO: Implement proper streak tracking
  }
}

// Export singleton instance
export const progressService = new ProgressService();

// Export class for testing
export { ProgressService };