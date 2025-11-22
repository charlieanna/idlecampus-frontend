/**
 * Progressive Flow Type Definitions
 * 
 * This module defines all types for the progressive learning flow system,
 * including challenge progression, user progress tracking, and gamification.
 */

import { Challenge, TestCase } from '../../builder/types/testCase';

/**
 * Learning Track Types
 * Three main tracks: Fundamentals, Concepts, Systems
 */
export type LearningTrackType = 'fundamentals' | 'concepts' | 'systems';

/**
 * Challenge Level (1-5)
 * L1: Connectivity - Basic architecture
 * L2: Capacity - Handle scale
 * L3: Optimization - Improve performance
 * L4: Resilience - Handle failures
 * L5: Excellence - Perfect implementation
 */
export type ChallengeLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Level names for UI display
 */
export const LEVEL_NAMES: Record<ChallengeLevel, string> = {
  1: 'Connectivity',
  2: 'Capacity',
  3: 'Optimization',
  4: 'Resilience',
  5: 'Excellence'
};

/**
 * Progressive Challenge
 * Extends base Challenge with progressive flow metadata
 */
export interface ProgressiveChallenge extends Challenge {
  // Progressive flow metadata
  track: LearningTrackType;
  orderInTrack: number;
  prerequisites: string[]; // Challenge IDs that must be completed first
  
  // Level structure (5 levels per challenge)
  levels: ProgressiveChallengeLevel[];
  
  // XP and rewards
  baseXP: number;
  
  // DDIA concept mapping
  ddiaChapters?: string[];
  ddiaTopics?: string[];
  
  // Category for filtering
  category: string; // 'caching', 'messaging', 'storage', etc.
}

/**
 * Progressive Challenge Level
 * Each challenge has 5 levels with increasing difficulty
 */
export interface ProgressiveChallengeLevel {
  levelNumber: ChallengeLevel;
  levelName: string;
  description: string;
  
  // Test cases for this level
  testCases: TestCase[];
  
  // XP reward for completing this level
  xpReward: number;
  
  // Hints available at this level
  hints: string[];
  
  // Estimated time to complete
  estimatedMinutes: number;
}

/**
 * User Progress
 * Tracks overall user progress across the progressive flow
 */
export interface UserProgressState {
  userId: string;
  
  // XP and Level
  totalXP: number;
  currentLevel: number;
  
  // Challenge completion
  challengeProgress: Record<string, ChallengeProgress>;
  
  // Track progress
  trackProgress: Record<LearningTrackType, TrackProgress>;
  
  // Unlocked challenges
  unlockedChallenges: string[];
  
  // Achievements and badges
  achievements: Achievement[];
  badges: Badge[];
  
  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // ISO date string
  
  // Stats
  totalChallengesStarted: number;
  totalChallengesCompleted: number;
  totalLevelsCompleted: number;
  totalTimeSpentMinutes: number;
  
  // Skill assessment
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  assessmentCompleted: boolean;
}

/**
 * Progress for a single challenge
 */
export interface ChallengeProgress {
  challengeId: string;
  status: 'locked' | 'unlocked' | 'in_progress' | 'completed';
  
  // Levels completed (1-5)
  levelsCompleted: ChallengeLevel[];
  currentLevel: ChallengeLevel;
  
  // Attempts and performance
  totalAttempts: number;
  bestScore: number; // 0-100
  
  // Time tracking
  timeSpentMinutes: number;
  startedAt?: string; // ISO date string
  completedAt?: string; // ISO date string
  
  // XP earned from this challenge
  xpEarned: number;
  
  // Help used
  hintsUsed: number;
  solutionViewed: boolean;
}

/**
 * Track Progress
 * Progress within a learning track (Fundamentals, Concepts, Systems)
 */
export interface TrackProgress {
  trackId: LearningTrackType;
  status: 'locked' | 'in_progress' | 'completed';
  
  // Completion metrics
  challengesCompleted: number;
  totalChallenges: number;
  progressPercentage: number;
  
  // Current position in track
  currentChallengeId?: string;
  
  // Time tracking
  timeSpentMinutes: number;
  startedAt?: string;
  completedAt?: string;
}

/**
 * Achievement
 * Unlockable achievements for completing milestones
 */
export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt: string; // ISO date string
  category: 'completion' | 'speed' | 'mastery' | 'streak' | 'exploration';
}

/**
 * Badge
 * Visual badges for track completion and milestones
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedAt: string; // ISO date string
  trackId?: LearningTrackType;
}

/**
 * Skill Assessment
 * Entry assessment to determine starting point
 */
export interface SkillAssessment {
  id: string;
  userId: string;
  questions: AssessmentQuestion[];
  responses: AssessmentResponse[];
  score: number; // 0-100
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  recommendedTrack: LearningTrackType;
  recommendedChallenges: string[];
  completedAt: string; // ISO date string
}

/**
 * Assessment Question
 */
export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'scenario' | 'diagram';
  options: string[];
  correctAnswer: number; // Index of correct option
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
}

/**
 * Assessment Response
 */
export interface AssessmentResponse {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

/**
 * Learning Track Definition
 */
export interface LearningTrack {
  id: LearningTrackType;
  name: string;
  description: string;
  difficulty: 'fundamentals' | 'concepts' | 'systems';
  estimatedHours: number;
  challenges: string[]; // Challenge IDs in order
  icon: string;
  color: string;
  prerequisites: LearningTrackType[];
}

/**
 * Prerequisite Definition
 */
export interface Prerequisite {
  challengeId: string;
  requiredChallenges: string[];
  requiredLevel?: number; // User level requirement
  requiredTrackProgress?: {
    trackId: LearningTrackType;
    minPercentage: number;
  };
}

/**
 * XP Transaction
 * Record of XP earned
 */
export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  source: 'challenge_level' | 'achievement' | 'daily_bonus' | 'streak_bonus';
  sourceId: string;
  description: string;
  timestamp: string; // ISO date string
}

/**
 * Leaderboard Entry
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  totalXP: number;
  level: number;
  challengesCompleted: number;
  streak: number;
}

/**
 * Daily Challenge
 */
export interface DailyChallenge {
  id: string;
  date: string; // ISO date string
  challengeId: string;
  level: ChallengeLevel;
  xpMultiplier: number; // e.g., 2.0 for double XP
  participantCount: number;
}

/**
 * Challenge Unlock Status
 * Helper type for UI to show lock status
 */
export interface ChallengeUnlockStatus {
  challengeId: string;
  isUnlocked: boolean;
  missingPrerequisites: string[];
  levelRequirement?: number;
  userLevel: number;
}

/**
 * Helper function to calculate user level from XP
 * Based on GAMIFICATION_FORMULAS.md
 */
export function calculateUserLevel(totalXP: number): number {
  // Level N requires: 100 * N * (N + 1) / 2 total XP
  // Inverse formula: level = floor((-1 + sqrt(1 + 8*xp/100)) / 2) + 1
  const level = Math.floor((-1 + Math.sqrt(1 + 8 * totalXP / 100)) / 2) + 1;
  return Math.max(1, level);
}

/**
 * Helper function to get XP required for a specific level
 */
export function getXPForLevel(level: number): number {
  return 100 * level * (level + 1) / 2;
}

/**
 * Helper function to get XP progress in current level
 */
export function getXPProgressInLevel(totalXP: number): {
  level: number;
  xpInLevel: number;
  xpNeeded: number;
  progressPercentage: number;
} {
  const level = calculateUserLevel(totalXP);
  const xpForCurrentLevel = getXPForLevel(level - 1);
  const xpForNextLevel = getXPForLevel(level);
  
  const xpInLevel = totalXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = (xpInLevel / xpNeeded) * 100;
  
  return {
    level,
    xpInLevel,
    xpNeeded,
    progressPercentage
  };
}