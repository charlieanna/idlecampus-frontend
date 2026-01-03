import { ProblemAttempt, ProblemProgress, WeaknessMetrics, SpacedRepetitionConfig } from '../types/practice';

const STORAGE_KEY = 'dsa-practice-data';
const CONFIG_KEY = 'dsa-spaced-repetition-config';

const DEFAULT_CONFIG: SpacedRepetitionConfig = {
  easyInterval: 7,
  mediumInterval: 3,
  hardInterval: 1,
  failedInterval: 0.5,
};

export class PracticeStorage {
  private static getData(): Record<string, ProblemProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      return {};
    }
  }

  private static saveData(data: Record<string, ProblemProgress>): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      // Error saving to localStorage
    }
  }

  static getConfig(): SpacedRepetitionConfig {
    try {
      const config = localStorage.getItem(CONFIG_KEY);
      return config ? JSON.parse(config) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  static recordAttempt(
    problemId: string,
    successful: boolean,
    hintsUsedThisAttempt: number, // Hints revealed DURING this specific attempt
    timeSpentThisAttempt: number // Time spent on this specific attempt
  ): void {
    const data = this.getData();
    const now = Date.now();

    const attempt: ProblemAttempt = {
      timestamp: now,
      successful,
      hintsUsed: hintsUsedThisAttempt,
      timeSpentSeconds: timeSpentThisAttempt,
    };

    if (!data[problemId]) {
      data[problemId] = {
        problemId,
        attempts: [],
        totalAttempts: 0,
        successfulAttempts: 0,
        failedAttempts: 0,
        totalHintsUsed: 0,
        firstAttemptDate: now,
        lastAttemptDate: now,
        isSolved: false,
        averageHintsPerAttempt: 0,
      };
    }

    const progress = data[problemId];
    progress.attempts.push(attempt);
    progress.totalAttempts++;
    progress.lastAttemptDate = now;
    progress.totalHintsUsed += hintsUsedThisAttempt;

    if (successful) {
      progress.successfulAttempts++;
      if (!progress.isSolved) {
        progress.isSolved = true;
      }
      if (!progress.bestTimeSeconds || timeSpentThisAttempt < progress.bestTimeSeconds) {
        progress.bestTimeSeconds = timeSpentThisAttempt;
      }
      progress.nextReviewDate = this.calculateNextReview(progress);
    } else {
      progress.failedAttempts++;
      progress.nextReviewDate = this.calculateNextReview(progress);
    }

    progress.averageHintsPerAttempt = progress.totalHintsUsed / progress.totalAttempts;

    this.saveData(data);
  }

  private static calculateNextReview(progress: ProblemProgress): number {
    const config = this.getConfig();
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (progress.failedAttempts > progress.successfulAttempts) {
      return now + config.failedInterval * oneDayMs;
    }

    const failureRate = progress.failedAttempts / progress.totalAttempts;
    const avgHints = progress.averageHintsPerAttempt;

    let intervalDays: number;
    if (failureRate > 0.5 || avgHints > 2) {
      intervalDays = config.hardInterval;
    } else if (failureRate > 0.2 || avgHints > 1) {
      intervalDays = config.mediumInterval;
    } else {
      intervalDays = config.easyInterval;
    }

    return now + intervalDays * oneDayMs;
  }

  static getProgress(problemId: string): ProblemProgress | null {
    const data = this.getData();
    return data[problemId] || null;
  }

  static getAllProgress(): ProblemProgress[] {
    const data = this.getData();
    return Object.values(data);
  }

  static getWeaknesses(): WeaknessMetrics[] {
    const data = this.getData();
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const weaknesses: WeaknessMetrics[] = Object.values(data).map((progress) => {
      const failureRate = progress.failedAttempts / progress.totalAttempts;
      const avgHintsUsed = progress.averageHintsPerAttempt;
      const daysSinceLastPractice = (now - progress.lastAttemptDate) / oneDayMs;

      // Weakness score formula: failureRate × 40 + hints × 10 + days × 2
      const weaknessScore =
        failureRate * 40 +
        avgHintsUsed * 10 +
        daysSinceLastPractice * 2;

      const needsReview = progress.nextReviewDate ? now >= progress.nextReviewDate : false;

      return {
        problemId: progress.problemId,
        weaknessScore,
        failureRate,
        avgHintsUsed,
        daysSinceLastPractice,
        needsReview,
      };
    });

    return weaknesses.sort((a, b) => b.weaknessScore - a.weaknessScore);
  }

  static getProblemsForReview(): string[] {
    const data = this.getData();
    const now = Date.now();

    return Object.values(data)
      .filter((progress) => progress.nextReviewDate && now >= progress.nextReviewDate)
      .sort((a, b) => (a.nextReviewDate || 0) - (b.nextReviewDate || 0))
      .map((progress) => progress.problemId);
  }

  static resetProgress(problemId?: string): void {
    if (problemId) {
      const data = this.getData();
      delete data[problemId];
      this.saveData(data);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  static exportData(): string {
    return JSON.stringify(this.getData(), null, 2);
  }

  static importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      this.saveData(data);
    } catch (error) {
      throw new Error('Invalid data format');
    }
  }
}
