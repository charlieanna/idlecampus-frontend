/**
 * Progressive Flow API Client
 * 
 * Axios-based HTTP client for communicating with the Progressive Flow backend API.
 * Handles all API requests with proper error handling, retry logic, and TypeScript types.
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_PROGRESSIVE_FLOW_API_URL || 'http://localhost:3001';
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

// Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UserProgress {
  userId: string;
  stats: UserStats;
  challenges: ChallengeProgress[];
  achievements: Achievement[];
  skills: UserSkill[];
  streak: StreakInfo;
}

export interface UserStats {
  totalXP: number;
  currentLevel: number;
  totalChallengesStarted: number;
  totalChallengesCompleted: number;
  totalLevelsCompleted: number;
  totalTimeSpentMinutes: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastActivityDate: string | null;
  rankPercentile: number | null;
}

export interface ChallengeProgress {
  challengeId: string;
  challengeSlug: string;
  challengeTitle: string;
  status: 'not_started' | 'in_progress' | 'completed';
  currentLevel: number;
  levelsCompleted: number[];
  totalAttempts: number;
  totalTimeSpentMinutes: number;
  bestScore: number | null;
  xpEarned: number;
  startDate: string | null;
  completionDate: string | null;
}

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconUrl: string | null;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt: string | null;
  progress: number;
}

export interface UserSkill {
  skillId: string;
  skillSlug: string;
  skillName: string;
  currentLevel: number;
  pointsAllocated: number;
  maxLevel: number;
  unlockedAt: string | null;
  masteredAt: string | null;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  isActiveToday: boolean;
}

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  trackId: string | null;
  orderInTrack: number | null;
  difficultyBase: 'beginner' | 'intermediate' | 'advanced';
  xpBase: number;
  estimatedMinutes: number;
  prerequisites: string[];
  ddiaConcepts: any;
  tags: any;
  metadata: any;
  isActive: boolean;
  levels: ChallengeLevel[];
}

export interface ChallengeLevel {
  id: string;
  challengeId: string;
  levelNumber: number;
  levelName: string;
  description: string | null;
  requirements: any;
  testCases: any;
  passingCriteria: any;
  xpReward: number;
  hints: any;
  solutionApproach: string | null;
  estimatedMinutes: number;
}

export interface LevelPerformance {
  score: number;
  timeSpentMinutes: number;
  hintsUsed: number;
  designSnapshot: any;
  testResults: any;
}

export interface CompleteLevelResult {
  success: boolean;
  xpEarned: number;
  levelUp: boolean;
  newLevel?: number;
  achievementsUnlocked: string[];
}

export interface AssessmentResult {
  skillLevel: string;
  recommendedTrack: string;
  challengeRecommendations: string[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  totalXP: number;
  currentLevel: number;
  totalChallengesCompleted: number;
  currentStreakDays: number;
}

export interface UserRank {
  userId: string;
  rank: number;
  totalUsers: number;
  percentile: number;
  metricValue: number;
}

export interface UserLevelInfo {
  currentLevel: number;
  totalXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpProgress: number;
  rank: string;
}

export interface ChallengeUnlockStatus {
  unlocked: boolean;
  missingPrerequisites: string[];
}

/**
 * Progressive Flow API Client
 */
class ProgressiveFlowAPIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] Response: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: AxiosError) => {
        console.error('[API] Response error:', error.message);
        
        // Retry logic for network errors
        const config = error.config as AxiosRequestConfig & { _retry?: number };
        if (!config || !config._retry) {
          config._retry = 0;
        }

        if (config._retry < MAX_RETRIES && this.shouldRetry(error)) {
          config._retry++;
          console.log(`[API] Retrying request (${config._retry}/${MAX_RETRIES})`);
          await this.delay(1000 * config._retry);
          return this.client(config);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: AxiosError): boolean {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message || 'API request failed';
      throw new Error(message);
    }
    throw error;
  }

  // ==================== User Progress APIs ====================

  /**
   * Get complete user progress
   */
  async getUserProgress(userId: string): Promise<UserProgress> {
    try {
      const response = await this.client.get<APIResponse<UserProgress>>(
        `/api/progressive/user/${userId}/progress`
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Complete a challenge level
   */
  async completeLevel(
    userId: string,
    challengeId: string,
    level: number,
    performance: LevelPerformance
  ): Promise<CompleteLevelResult> {
    try {
      const response = await this.client.post<APIResponse<CompleteLevelResult>>(
        `/api/progressive/user/${userId}/complete-level`,
        { challengeId, level, performance }
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Save assessment results
   */
  async saveAssessment(
    userId: string,
    answers: any,
    score: number
  ): Promise<AssessmentResult> {
    try {
      const response = await this.client.post<APIResponse<AssessmentResult>>(
        `/api/progressive/user/${userId}/assessment`,
        { answers, score }
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== Challenge APIs ====================

  /**
   * Get all challenges
   */
  async getAllChallenges(trackId?: string): Promise<Challenge[]> {
    try {
      const params = trackId ? { trackId } : {};
      const response = await this.client.get<APIResponse<Challenge[]>>(
        '/api/progressive/challenges',
        { params }
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get challenge by ID
   */
  async getChallengeById(challengeId: string): Promise<Challenge> {
    try {
      const response = await this.client.get<APIResponse<Challenge>>(
        `/api/progressive/challenges/${challengeId}`
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Check if challenge is unlocked
   */
  async checkChallengeUnlocked(
    userId: string,
    challengeId: string
  ): Promise<ChallengeUnlockStatus> {
    try {
      const response = await this.client.get<APIResponse<ChallengeUnlockStatus>>(
        `/api/progressive/challenges/${challengeId}/unlocked/${userId}`
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get daily challenge
   */
  async getDailyChallenge(): Promise<any> {
    try {
      const response = await this.client.get<APIResponse<any>>(
        '/api/progressive/daily-challenge'
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== XP & Leveling APIs ====================

  /**
   * Award XP to user
   */
  async awardXP(
    userId: string,
    amount: number,
    source: string,
    metadata: any = {}
  ): Promise<{ success: boolean; levelUp: boolean; newLevel?: number }> {
    try {
      const response = await this.client.post<APIResponse<any>>(
        `/api/progressive/user/${userId}/award-xp`,
        { amount, source, metadata }
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get user level info
   */
  async getUserLevel(userId: string): Promise<UserLevelInfo> {
    try {
      const response = await this.client.get<APIResponse<UserLevelInfo>>(
        `/api/progressive/user/${userId}/level`
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get user streak
   */
  async getUserStreak(userId: string): Promise<StreakInfo> {
    try {
      const response = await this.client.get<APIResponse<StreakInfo>>(
        `/api/progressive/user/${userId}/streak`
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== Achievement APIs ====================

  /**
   * Get all achievements
   */
  async getAllAchievements(): Promise<Achievement[]> {
    try {
      const response = await this.client.get<APIResponse<Achievement[]>>(
        '/api/progressive/achievements'
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get user achievements
   */
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const response = await this.client.get<APIResponse<Achievement[]>>(
        `/api/progressive/user/${userId}/achievements`
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Check and unlock achievements
   */
  async checkAchievements(userId: string): Promise<{ unlockedAchievements: string[]; count: number }> {
    try {
      const response = await this.client.post<APIResponse<any>>(
        `/api/progressive/user/${userId}/check-achievements`
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== Leaderboard APIs ====================

  /**
   * Get leaderboard
   */
  async getLeaderboard(
    period: 'daily' | 'weekly' | 'monthly' | 'all' = 'all',
    limit: number = 100
  ): Promise<LeaderboardEntry[]> {
    try {
      const response = await this.client.get<APIResponse<LeaderboardEntry[]>>(
        '/api/progressive/leaderboard',
        { params: { period, limit } }
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get user rank
   */
  async getUserRank(
    userId: string,
    period: 'daily' | 'weekly' | 'monthly' | 'all' = 'all'
  ): Promise<UserRank> {
    try {
      const response = await this.client.get<APIResponse<UserRank>>(
        `/api/progressive/user/${userId}/rank`,
        { params: { period } }
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== Skill APIs ====================

  /**
   * Get user skills
   */
  async getUserSkills(userId: string): Promise<UserSkill[]> {
    try {
      const response = await this.client.get<APIResponse<UserSkill[]>>(
        `/api/progressive/user/${userId}/skills`
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Allocate skill point
   */
  async allocateSkillPoint(
    userId: string,
    skillId: string
  ): Promise<{ success: boolean; newLevel: number }> {
    try {
      const response = await this.client.post<APIResponse<any>>(
        `/api/progressive/user/${userId}/allocate-skill-point`,
        { skillId }
      );
      return response.data.data!;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Get available skill points
   */
  async getSkillPointsAvailable(userId: string): Promise<number> {
    try {
      const response = await this.client.get<APIResponse<{ availablePoints: number }>>(
        `/api/progressive/user/${userId}/skill-points`
      );
      return response.data.data!.availablePoints;
    } catch (error) {
      this.handleError(error);
    }
  }

  // ==================== Health Check ====================

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/progressive/health');
      return response.data.success === true;
    } catch (error) {
      console.error('[API] Health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiClient = new ProgressiveFlowAPIClient();

// Export class for testing
export { ProgressiveFlowAPIClient };