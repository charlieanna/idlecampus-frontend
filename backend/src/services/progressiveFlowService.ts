/**
 * Progressive Flow Service Layer
 * 
 * Handles all database operations for the progressive learning flow system.
 * Includes user progress tracking, XP management, achievements, leaderboards, and more.
 */

import { Pool, PoolClient } from 'pg';

// Initialize database connection pool
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'idlecampus',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Types
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
  lastActivityDate: string;
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

export interface LevelPerformance {
  score: number;
  timeSpentMinutes: number;
  hintsUsed: number;
  designSnapshot: any;
  testResults: any;
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
  prerequisites: any;
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

/**
 * Get complete user progress including stats, challenges, achievements, and skills
 */
export async function getUserProgress(userId: string): Promise<UserProgress> {
  const client = await pool.connect();
  
  try {
    // Get user stats
    const statsResult = await client.query(`
      SELECT 
        total_xp,
        current_level,
        total_challenges_started,
        total_challenges_completed,
        total_levels_completed,
        total_time_spent_minutes,
        current_streak_days,
        longest_streak_days,
        last_activity_date,
        rank_percentile
      FROM user_stats
      WHERE user_id = $1
    `, [userId]);

    const stats: UserStats = statsResult.rows[0] || {
      totalXP: 0,
      currentLevel: 1,
      totalChallengesStarted: 0,
      totalChallengesCompleted: 0,
      totalLevelsCompleted: 0,
      totalTimeSpentMinutes: 0,
      currentStreakDays: 0,
      longestStreakDays: 0,
      lastActivityDate: null,
      rankPercentile: null,
    };

    // Get challenge progress
    const challengesResult = await client.query(`
      SELECT 
        ucp.challenge_id,
        c.slug as challenge_slug,
        c.title as challenge_title,
        ucp.status,
        ucp.current_level,
        ucp.levels_completed,
        ucp.total_attempts,
        ucp.total_time_spent_minutes,
        ucp.best_score,
        ucp.xp_earned,
        ucp.start_date,
        ucp.completion_date
      FROM user_challenge_progress ucp
      JOIN challenges c ON ucp.challenge_id = c.id
      WHERE ucp.user_id = $1
      ORDER BY ucp.start_date DESC
    `, [userId]);

    const challenges: ChallengeProgress[] = challengesResult.rows.map(row => ({
      challengeId: row.challenge_id,
      challengeSlug: row.challenge_slug,
      challengeTitle: row.challenge_title,
      status: row.status,
      currentLevel: row.current_level,
      levelsCompleted: row.levels_completed || [],
      totalAttempts: row.total_attempts,
      totalTimeSpentMinutes: row.total_time_spent_minutes,
      bestScore: row.best_score,
      xpEarned: row.xp_earned,
      startDate: row.start_date,
      completionDate: row.completion_date,
    }));

    // Get achievements
    const achievementsResult = await client.query(`
      SELECT 
        a.id,
        a.slug,
        a.name,
        a.description,
        a.icon_url,
        a.category,
        a.rarity,
        a.xp_reward,
        ua.unlocked_at,
        ua.progress
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
      WHERE a.is_active = true
      ORDER BY a.rarity DESC, a.name ASC
    `, [userId]);

    const achievements: Achievement[] = achievementsResult.rows.map(row => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      iconUrl: row.icon_url,
      category: row.category,
      rarity: row.rarity,
      xpReward: row.xp_reward,
      unlockedAt: row.unlocked_at,
      progress: row.progress || 0,
    }));

    // Get skills
    const skillsResult = await client.query(`
      SELECT 
        s.id as skill_id,
        s.slug as skill_slug,
        s.name as skill_name,
        COALESCE(us.current_level, 0) as current_level,
        COALESCE(us.points_allocated, 0) as points_allocated,
        s.max_level,
        us.unlocked_at,
        us.mastered_at
      FROM skills s
      LEFT JOIN user_skills us ON s.id = us.skill_id AND us.user_id = $1
      ORDER BY s.category, s.name
    `, [userId]);

    const skills: UserSkill[] = skillsResult.rows.map(row => ({
      skillId: row.skill_id,
      skillSlug: row.skill_slug,
      skillName: row.skill_name,
      currentLevel: row.current_level,
      pointsAllocated: row.points_allocated,
      maxLevel: row.max_level,
      unlockedAt: row.unlocked_at,
      masteredAt: row.mastered_at,
    }));

    // Calculate streak
    const streak = await getUserStreak(userId);

    return {
      userId,
      stats,
      challenges,
      achievements,
      skills,
      streak,
    };
  } finally {
    client.release();
  }
}

/**
 * Complete a level and award XP, checking for achievements
 */
export async function completeLevel(
  userId: string,
  challengeId: string,
  level: number,
  performance: LevelPerformance
): Promise<{ success: boolean; xpEarned: number; levelUp: boolean; newLevel?: number; achievementsUnlocked: string[] }> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Get level XP reward
    const levelResult = await client.query(`
      SELECT xp_reward 
      FROM challenge_levels 
      WHERE challenge_id = $1 AND level_number = $2
    `, [challengeId, level]);

    if (levelResult.rows.length === 0) {
      throw new Error(`Level ${level} not found for challenge ${challengeId}`);
    }

    const xpReward = levelResult.rows[0].xp_reward;

    // Record level attempt
    await client.query(`
      INSERT INTO level_attempts (
        user_id, challenge_id, level_number, attempt_number,
        design_snapshot, test_results, score, passed,
        xp_earned, hints_used, time_spent_minutes
      )
      SELECT 
        $1, $2, $3,
        COALESCE(MAX(attempt_number), 0) + 1,
        $4, $5, $6, true,
        $7, $8, $9
      FROM level_attempts
      WHERE user_id = $1 AND challenge_id = $2 AND level_number = $3
    `, [
      userId, challengeId, level,
      performance.designSnapshot, performance.testResults,
      performance.score, xpReward, performance.hintsUsed,
      performance.timeSpentMinutes
    ]);

    // Update user challenge progress
    await client.query(`
      INSERT INTO user_challenge_progress (
        user_id, challenge_id, status, current_level,
        levels_completed, total_attempts, total_time_spent_minutes,
        best_score, xp_earned, start_date
      )
      VALUES ($1, $2, 'in_progress', $3, ARRAY[$3], 1, $4, $5, $6, NOW())
      ON CONFLICT (user_id, challenge_id)
      DO UPDATE SET
        current_level = GREATEST(user_challenge_progress.current_level, $3),
        levels_completed = ARRAY(
          SELECT DISTINCT unnest(user_challenge_progress.levels_completed || ARRAY[$3])
          ORDER BY 1
        ),
        total_attempts = user_challenge_progress.total_attempts + 1,
        total_time_spent_minutes = user_challenge_progress.total_time_spent_minutes + $4,
        best_score = GREATEST(COALESCE(user_challenge_progress.best_score, 0), $5),
        xp_earned = user_challenge_progress.xp_earned + $6,
        status = CASE 
          WHEN $3 = 5 THEN 'completed'::text
          ELSE user_challenge_progress.status::text
        END,
        completion_date = CASE 
          WHEN $3 = 5 THEN NOW()
          ELSE user_challenge_progress.completion_date
        END
    `, [userId, challengeId, level, performance.timeSpentMinutes, performance.score, xpReward]);

    // Award XP
    const currentLevelBefore = await client.query(
      'SELECT current_level FROM user_stats WHERE user_id = $1',
      [userId]
    );
    
    const xpResult = await awardXP(
      userId,
      xpReward,
      'challenge_level',
      { challengeId, level },
      client
    );

    // Update streak
    await updateStreak(userId, client);

    // Check and unlock achievements
    const achievementsUnlocked = await checkAndUnlockAchievements(userId, client);

    await client.query('COMMIT');

    return {
      success: true,
      xpEarned: xpReward,
      levelUp: xpResult.levelUp,
      newLevel: xpResult.newLevel,
      achievementsUnlocked,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[progressiveFlowService] Error completing level:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Save assessment results and recommend track
 */
export async function saveAssessment(
  userId: string,
  answers: any,
  score: number
): Promise<{ skillLevel: string; recommendedTrack: string; challengeRecommendations: string[] }> {
  const client = await pool.connect();
  
  try {
    // Determine skill level based on score
    let skillLevel: string;
    let recommendedTrack: string;
    
    if (score < 40) {
      skillLevel = 'beginner';
      recommendedTrack = 'fundamentals';
    } else if (score < 70) {
      skillLevel = 'intermediate';
      recommendedTrack = 'concepts';
    } else {
      skillLevel = 'advanced';
      recommendedTrack = 'systems';
    }

    // Get challenge recommendations
    const recommendationsResult = await client.query(`
      SELECT slug
      FROM challenges
      WHERE difficulty_base = $1
        AND is_active = true
        AND prerequisites = '[]'::jsonb
      ORDER BY order_in_track
      LIMIT 5
    `, [skillLevel]);

    const challengeRecommendations = recommendationsResult.rows.map(row => row.slug);

    // Save assessment result
    await client.query(`
      INSERT INTO assessment_results (
        user_id, assessment_type, questions, responses,
        score, skill_level_recommendation, track_recommendations,
        challenge_recommendations
      )
      VALUES ($1, 'initial', '{}', $2, $3, $4, $5, $6)
    `, [
      userId,
      answers,
      score,
      skillLevel,
      JSON.stringify([recommendedTrack]),
      JSON.stringify(challengeRecommendations)
    ]);

    // Update user profile
    await client.query(`
      UPDATE users
      SET skill_level = $1, onboarding_completed = true, updated_at = NOW()
      WHERE id = $2
    `, [skillLevel, userId]);

    return {
      skillLevel,
      recommendedTrack,
      challengeRecommendations,
    };
  } finally {
    client.release();
  }
}

/**
 * Get all challenges, optionally filtered by track
 */
export async function getAllChallenges(trackId?: string): Promise<Challenge[]> {
  const client = await pool.connect();
  
  try {
    let query = `
      SELECT 
        c.id, c.slug, c.title, c.description, c.category,
        c.track_id, c.order_in_track, c.difficulty_base,
        c.xp_base, c.estimated_minutes, c.prerequisites,
        c.ddia_concepts, c.tags, c.metadata, c.is_active
      FROM challenges c
      WHERE c.is_active = true
    `;
    
    const params: any[] = [];
    if (trackId) {
      query += ' AND c.track_id = $1';
      params.push(trackId);
    }
    
    query += ' ORDER BY c.order_in_track';

    const result = await client.query(query, params);
    
    // Get levels for each challenge
    const challenges: Challenge[] = [];
    for (const row of result.rows) {
      const levelsResult = await client.query(`
        SELECT 
          id, challenge_id, level_number, level_name, description,
          requirements, test_cases, passing_criteria, xp_reward,
          hints, solution_approach, estimated_minutes
        FROM challenge_levels
        WHERE challenge_id = $1
        ORDER BY level_number
      `, [row.id]);

      challenges.push({
        ...row,
        difficultyBase: row.difficulty_base,
        xpBase: row.xp_base,
        estimatedMinutes: row.estimated_minutes,
        ddiaConcepts: row.ddia_concepts,
        isActive: row.is_active,
        levels: levelsResult.rows.map(level => ({
          id: level.id,
          challengeId: level.challenge_id,
          levelNumber: level.level_number,
          levelName: level.level_name,
          description: level.description,
          requirements: level.requirements,
          testCases: level.test_cases,
          passingCriteria: level.passing_criteria,
          xpReward: level.xp_reward,
          hints: level.hints,
          solutionApproach: level.solution_approach,
          estimatedMinutes: level.estimated_minutes,
        })),
      });
    }

    return challenges;
  } finally {
    client.release();
  }
}

/**
 * Get challenge by ID with all 5 levels
 */
export async function getChallengeById(challengeId: string): Promise<Challenge | null> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        id, slug, title, description, category,
        track_id, order_in_track, difficulty_base,
        xp_base, estimated_minutes, prerequisites,
        ddia_concepts, tags, metadata, is_active
      FROM challenges
      WHERE id = $1 OR slug = $1
    `, [challengeId]);

    if (result.rows.length === 0) {
      return null;
    }

    const challenge = result.rows[0];

    const levelsResult = await client.query(`
      SELECT 
        id, challenge_id, level_number, level_name, description,
        requirements, test_cases, passing_criteria, xp_reward,
        hints, solution_approach, estimated_minutes
      FROM challenge_levels
      WHERE challenge_id = $1
      ORDER BY level_number
    `, [challenge.id]);

    return {
      ...challenge,
      difficultyBase: challenge.difficulty_base,
      xpBase: challenge.xp_base,
      estimatedMinutes: challenge.estimated_minutes,
      ddiaConcepts: challenge.ddia_concepts,
      isActive: challenge.is_active,
      levels: levelsResult.rows.map(level => ({
        id: level.id,
        challengeId: level.challenge_id,
        levelNumber: level.level_number,
        levelName: level.level_name,
        description: level.description,
        requirements: level.requirements,
        testCases: level.test_cases,
        passingCriteria: level.passing_criteria,
        xpReward: level.xp_reward,
        hints: level.hints,
        solutionApproach: level.solution_approach,
        estimatedMinutes: level.estimated_minutes,
      })),
    };
  } finally {
    client.release();
  }
}

/**
 * Check if challenge is unlocked for user (prerequisites met)
 */
export async function checkChallengeUnlocked(userId: string, challengeId: string): Promise<{ unlocked: boolean; missingPrerequisites: string[] }> {
  const client = await pool.connect();
  
  try {
    // Get challenge prerequisites
    const challengeResult = await client.query(`
      SELECT prerequisites FROM challenges WHERE id = $1 OR slug = $1
    `, [challengeId]);

    if (challengeResult.rows.length === 0) {
      return { unlocked: false, missingPrerequisites: [] };
    }

    const prerequisites = challengeResult.rows[0].prerequisites || [];
    
    if (prerequisites.length === 0) {
      return { unlocked: true, missingPrerequisites: [] };
    }

    // Check which prerequisites are completed
    const completedResult = await client.query(`
      SELECT challenge_id
      FROM user_challenge_progress
      WHERE user_id = $1 
        AND challenge_id = ANY($2::uuid[])
        AND status = 'completed'
    `, [userId, prerequisites]);

    const completedIds = completedResult.rows.map(row => row.challenge_id);
    const missingPrerequisites = prerequisites.filter((id: string) => !completedIds.includes(id));

    return {
      unlocked: missingPrerequisites.length === 0,
      missingPrerequisites,
    };
  } finally {
    client.release();
  }
}

/**
 * Get today's daily challenge
 */
export async function getDailyChallenge(): Promise<any> {
  const client = await pool.connect();
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await client.query(`
      SELECT 
        dc.id,
        dc.date,
        dc.xp_multiplier,
        dc.participants_count,
        c.id as challenge_id,
        c.slug,
        c.title,
        c.description,
        c.category
      FROM daily_challenges dc
      JOIN challenges c ON dc.challenge_id = c.id
      WHERE dc.date = $1
    `, [today]);

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // If no daily challenge exists, create one
    const randomChallenge = await client.query(`
      SELECT id, slug, title, description, category
      FROM challenges
      WHERE is_active = true
      ORDER BY RANDOM()
      LIMIT 1
    `);

    if (randomChallenge.rows.length === 0) {
      return null;
    }

    const newDaily = await client.query(`
      INSERT INTO daily_challenges (challenge_id, date, xp_multiplier)
      VALUES ($1, $2, 2.0)
      RETURNING id, date, xp_multiplier, participants_count
    `, [randomChallenge.rows[0].id, today]);

    return {
      ...newDaily.rows[0],
      challenge_id: randomChallenge.rows[0].id,
      slug: randomChallenge.rows[0].slug,
      title: randomChallenge.rows[0].title,
      description: randomChallenge.rows[0].description,
      category: randomChallenge.rows[0].category,
    };
  } finally {
    client.release();
  }
}

/**
 * Award XP to user with transaction record
 */
export async function awardXP(
  userId: string,
  amount: number,
  source: string,
  metadata: any,
  client?: PoolClient
): Promise<{ success: boolean; levelUp: boolean; newLevel?: number }> {
  const shouldRelease = !client;
  if (!client) {
    client = await pool.connect();
  }
  
  try {
    // Get current level
    const currentStats = await client.query(
      'SELECT total_xp, current_level FROM user_stats WHERE user_id = $1',
      [userId]
    );

    let currentXP = 0;
    let currentLevel = 1;
    
    if (currentStats.rows.length > 0) {
      currentXP = currentStats.rows[0].total_xp;
      currentLevel = currentStats.rows[0].current_level;
    } else {
      // Initialize user stats if not exists
      await client.query(`
        INSERT INTO user_stats (user_id)
        VALUES ($1)
        ON CONFLICT (user_id) DO NOTHING
      `, [userId]);
    }

    // Record XP transaction
    await client.query(`
      INSERT INTO xp_transactions (user_id, amount, source_type, source_id, description)
      VALUES ($1, $2, $3, $4, $5)
    `, [userId, amount, source, metadata.challengeId || '', JSON.stringify(metadata)]);

    // Calculate new level
    const newXP = currentXP + amount;
    const newLevel = calculateLevelFromXP(newXP);
    const levelUp = newLevel > currentLevel;

    // Update user stats (trigger will handle this, but we update explicitly for consistency)
    await client.query(`
      UPDATE user_stats
      SET 
        total_xp = total_xp + $1,
        current_level = $2,
        updated_at = NOW()
      WHERE user_id = $3
    `, [amount, newLevel, userId]);

    return {
      success: true,
      levelUp,
      newLevel: levelUp ? newLevel : undefined,
    };
  } finally {
    if (shouldRelease && client) {
      client.release();
    }
  }
}

/**
 * Get user's current level and XP info
 */
export async function getUserLevel(userId: string): Promise<{
  currentLevel: number;
  totalXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpProgress: number;
  rank: string;
}> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT total_xp, current_level
      FROM user_stats
      WHERE user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return {
        currentLevel: 1,
        totalXP: 0,
        xpForCurrentLevel: 0,
        xpForNextLevel: 100,
        xpProgress: 0,
        rank: 'Novice',
      };
    }

    const { total_xp, current_level } = result.rows[0];
    const xpForCurrentLevel = calculateXPForLevel(current_level - 1);
    const xpForNextLevel = calculateXPForLevel(current_level);
    const xpProgress = total_xp - xpForCurrentLevel;

    return {
      currentLevel: current_level,
      totalXP: total_xp,
      xpForCurrentLevel,
      xpForNextLevel,
      xpProgress,
      rank: getRankName(current_level),
    };
  } finally {
    client.release();
  }
}

/**
 * Get user's streak information
 */
export async function getUserStreak(userId: string): Promise<StreakInfo> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT current_streak_days, longest_streak_days, last_activity_date
      FROM user_stats
      WHERE user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        isActiveToday: false,
      };
    }

    const { current_streak_days, longest_streak_days, last_activity_date } = result.rows[0];
    const today = new Date().toISOString().split('T')[0];
    const isActiveToday = last_activity_date === today;

    return {
      currentStreak: current_streak_days,
      longestStreak: longest_streak_days,
      lastActivityDate: last_activity_date,
      isActiveToday,
    };
  } finally {
    client.release();
  }
}

/**
 * Update user's activity streak
 */
export async function updateStreak(userId: string, client?: PoolClient): Promise<void> {
  const shouldRelease = !client;
  if (!client) {
    client = await pool.connect();
  }
  
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await client.query(`
      SELECT last_activity_date, current_streak_days, longest_streak_days
      FROM user_stats
      WHERE user_id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      await client.query(`
        INSERT INTO user_stats (user_id, last_activity_date, current_streak_days, longest_streak_days)
        VALUES ($1, $2, 1, 1)
      `, [userId, today]);
      return;
    }

    const { last_activity_date, current_streak_days, longest_streak_days } = result.rows[0];
    
    if (last_activity_date === today) {
      // Already active today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak: number;
    if (last_activity_date === yesterdayStr) {
      // Continuing streak
      newStreak = current_streak_days + 1;
    } else {
      // Streak broken
      newStreak = 1;
    }

    const newLongestStreak = Math.max(longest_streak_days, newStreak);

    await client.query(`
      UPDATE user_stats
      SET 
        last_activity_date = $1,
        current_streak_days = $2,
        longest_streak_days = $3,
        updated_at = NOW()
      WHERE user_id = $4
    `, [today, newStreak, newLongestStreak, userId]);
  } finally {
    if (shouldRelease && client) {
      client.release();
    }
  }
}

/**
 * Get all achievements
 */
export async function getAllAchievements(): Promise<Achievement[]> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        id, slug, name, description, icon_url,
        category, rarity, xp_reward
      FROM achievements
      WHERE is_active = true
      ORDER BY rarity DESC, category, name
    `);

    return result.rows.map(row => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      iconUrl: row.icon_url,
      category: row.category,
      rarity: row.rarity,
      xpReward: row.xp_reward,
      unlockedAt: null,
      progress: 0,
    }));
  } finally {
    client.release();
  }
}

/**
 * Get user's unlocked achievements
 */
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        a.id, a.slug, a.name, a.description, a.icon_url,
        a.category, a.rarity, a.xp_reward,
        ua.unlocked_at, ua.progress
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = $1
      ORDER BY ua.unlocked_at DESC
    `, [userId]);

    return result.rows.map(row => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      description: row.description,
      iconUrl: row.icon_url,
      category: row.category,
      rarity: row.rarity,
      xpReward: row.xp_reward,
      unlockedAt: row.unlocked_at,
      progress: row.progress,
    }));
  } finally {
    client.release();
  }
}

/**
 * Check and unlock achievements based on user progress
 */
export async function checkAndUnlockAchievements(userId: string, client?: PoolClient): Promise<string[]> {
  const shouldRelease = !client;
  if (!client) {
    client = await pool.connect();
  }
  
  try {
    const unlockedAchievements: string[] = [];

    // Get user stats for checking criteria
    const stats = await client.query(`
      SELECT 
        total_xp,
        current_level,
        total_challenges_completed,
        total_levels_completed,
        current_streak_days
      FROM user_stats
      WHERE user_id = $1
    `, [userId]);

    if (stats.rows.length === 0) {
      return unlockedAchievements;
    }

    const userStats = stats.rows[0];

    // Get all achievements with criteria
    const achievements = await client.query(`
      SELECT id, slug, criteria, xp_reward
      FROM achievements
      WHERE is_active = true
      AND id NOT IN (
        SELECT achievement_id 
        FROM user_achievements 
        WHERE user_id = $1
      )
    `, [userId]);

    // Check each achievement
    for (const achievement of achievements.rows) {
      const criteria = achievement.criteria;
      let shouldUnlock = false;

      // Check different criteria types
      if (criteria.challenges_completed && userStats.total_challenges_completed >= criteria.challenges_completed) {
        shouldUnlock = true;
      }
      
      if (criteria.levels_completed && userStats.total_levels_completed >= criteria.levels_completed) {
        shouldUnlock = true;
      }
      
      if (criteria.streak_days && userStats.current_streak_days >= criteria.streak_days) {
        shouldUnlock = true;
      }
      
      if (criteria.level && userStats.current_level >= criteria.level) {
        shouldUnlock = true;
      }
      
      if (criteria.total_xp && userStats.total_xp >= criteria.total_xp) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        await unlockAchievement(userId, achievement.id, client);
        unlockedAchievements.push(achievement.slug);
      }
    }

    return unlockedAchievements;
  } finally {
    if (shouldRelease && client) {
      client.release();
    }
  }
}

/**
 * Unlock a specific achievement for user
 */
export async function unlockAchievement(userId: string, achievementId: string, client?: PoolClient): Promise<void> {
  const shouldRelease = !client;
  if (!client) {
    client = await pool.connect();
  }
  
  try {
    // Get achievement details
    const achievement = await client.query(`
      SELECT xp_reward FROM achievements WHERE id = $1
    `, [achievementId]);

    if (achievement.rows.length === 0) {
      throw new Error(`Achievement ${achievementId} not found`);
    }

    // Unlock achievement
    await client.query(`
      INSERT INTO user_achievements (user_id, achievement_id, progress)
      VALUES ($1, $2, 100)
      ON CONFLICT (user_id, achievement_id) DO NOTHING
    `, [userId, achievementId]);

    // Award XP
    const xpReward = achievement.rows[0].xp_reward;
    if (xpReward > 0) {
      await awardXP(userId, xpReward, 'achievement', { achievementId }, client);
    }

    // Create notification
    await client.query(`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES ($1, 'achievement', 'Achievement Unlocked!', $2)
    `, [userId, `You've earned a new achievement!`]);
  } finally {
    if (shouldRelease && client) {
      client.release();
    }
  }
}

/**
 * Get leaderboard for specified period
 */
export async function getLeaderboard(
  period: 'daily' | 'weekly' | 'monthly' | 'all',
  limit: number = 100
): Promise<LeaderboardEntry[]> {
  const client = await pool.connect();
  
  try {
    let timeFilter = '';
    const today = new Date();
    
    if (period === 'daily') {
      timeFilter = `AND us.last_activity_date = '${today.toISOString().split('T')[0]}'`;
    } else if (period === 'weekly') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeFilter = `AND us.last_activity_date >= '${weekAgo.toISOString().split('T')[0]}'`;
    } else if (period === 'monthly') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeFilter = `AND us.last_activity_date >= '${monthAgo.toISOString().split('T')[0]}'`;
    }

    const result = await client.query(`
      SELECT 
        ROW_NUMBER() OVER (ORDER BY us.total_xp DESC) as rank,
        u.id as user_id,
        u.username,
        u.display_name,
        u.avatar_url,
        us.total_xp,
        us.current_level,
        us.total_challenges_completed,
        us.current_streak_days
      FROM users u
      JOIN user_stats us ON u.id = us.user_id
      WHERE 1=1 ${timeFilter}
      ORDER BY us.total_xp DESC
      LIMIT $1
    `, [limit]);

    return result.rows.map(row => ({
      rank: row.rank,
      userId: row.user_id,
      username: row.username,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      totalXP: row.total_xp,
      currentLevel: row.current_level,
      totalChallengesCompleted: row.total_challenges_completed,
      currentStreakDays: row.current_streak_days,
    }));
  } finally {
    client.release();
  }
}

/**
 * Get user's rank in leaderboard
 */
export async function getUserRank(
  userId: string,
  period: 'daily' | 'weekly' | 'monthly' | 'all'
): Promise<UserRank> {
  const client = await pool.connect();
  
  try {
    let timeFilter = '';
    const today = new Date();
    
    if (period === 'daily') {
      timeFilter = `AND us.last_activity_date = '${today.toISOString().split('T')[0]}'`;
    } else if (period === 'weekly') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      timeFilter = `AND us.last_activity_date >= '${weekAgo.toISOString().split('T')[0]}'`;
    } else if (period === 'monthly') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      timeFilter = `AND us.last_activity_date >= '${monthAgo.toISOString().split('T')[0]}'`;
    }

    const result = await client.query(`
      WITH ranked_users AS (
        SELECT 
          u.id,
          us.total_xp,
          ROW_NUMBER() OVER (ORDER BY us.total_xp DESC) as rank
        FROM users u
        JOIN user_stats us ON u.id = us.user_id
        WHERE 1=1 ${timeFilter}
      ),
      total_count AS (
        SELECT COUNT(*) as total FROM ranked_users
      )
      SELECT 
        r.rank,
        t.total as total_users,
        r.total_xp as metric_value,
        (100.0 * (t.total - r.rank) / t.total) as percentile
      FROM ranked_users r, total_count t
      WHERE r.id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return {
        userId,
        rank: 0,
        totalUsers: 0,
        percentile: 0,
        metricValue: 0,
      };
    }

    return {
      userId,
      rank: result.rows[0].rank,
      totalUsers: result.rows[0].total_users,
      percentile: result.rows[0].percentile,
      metricValue: result.rows[0].metric_value,
    };
  } finally {
    client.release();
  }
}

/**
 * Get user's skills
 */
export async function getUserSkills(userId: string): Promise<UserSkill[]> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        s.id as skill_id,
        s.slug as skill_slug,
        s.name as skill_name,
        COALESCE(us.current_level, 0) as current_level,
        COALESCE(us.points_allocated, 0) as points_allocated,
        s.max_level,
        us.unlocked_at,
        us.mastered_at
      FROM skills s
      LEFT JOIN user_skills us ON s.id = us.skill_id AND us.user_id = $1
      ORDER BY s.category, s.name
    `, [userId]);

    return result.rows.map(row => ({
      skillId: row.skill_id,
      skillSlug: row.skill_slug,
      skillName: row.skill_name,
      currentLevel: row.current_level,
      pointsAllocated: row.points_allocated,
      maxLevel: row.max_level,
      unlockedAt: row.unlocked_at,
      masteredAt: row.mastered_at,
    }));
  } finally {
    client.release();
  }
}

/**
 * Allocate skill point
 */
export async function allocateSkillPoint(userId: string, skillId: string): Promise<{ success: boolean; newLevel: number }> {
  const client = await pool.connect();
  
  try {
    // Check available skill points
    const availablePoints = await getSkillPointsAvailable(userId);
    
    if (availablePoints <= 0) {
      throw new Error('No skill points available');
    }

    // Get skill max level
    const skillResult = await client.query(`
      SELECT max_level FROM skills WHERE id = $1
    `, [skillId]);

    if (skillResult.rows.length === 0) {
      throw new Error('Skill not found');
    }

    const maxLevel = skillResult.rows[0].max_level;

    // Allocate point
    const result = await client.query(`
      INSERT INTO user_skills (user_id, skill_id, current_level, points_allocated, unlocked_at)
      VALUES ($1, $2, 1, 1, NOW())
      ON CONFLICT (user_id, skill_id)
      DO UPDATE SET
        current_level = LEAST(user_skills.current_level + 1, $3),
        points_allocated = user_skills.points_allocated + 1,
        mastered_at = CASE 
          WHEN user_skills.current_level + 1 >= $3 THEN NOW()
          ELSE user_skills.mastered_at
        END
      RETURNING current_level
    `, [userId, skillId, maxLevel]);

    return {
      success: true,
      newLevel: result.rows[0].current_level,
    };
  } finally {
    client.release();
  }
}

/**
 * Get available skill points
 */
export async function getSkillPointsAvailable(userId: string): Promise<number> {
  const client = await pool.connect();
  
  try {
    const result = await client.query(`
      SELECT 
        us.current_level,
        COALESCE(SUM(usk.points_allocated), 0) as points_used
      FROM user_stats us
      LEFT JOIN user_skills usk ON us.user_id = usk.user_id
      WHERE us.user_id = $1
      GROUP BY us.current_level
    `, [userId]);

    if (result.rows.length === 0) {
      return 0;
    }

    const { current_level, points_used } = result.rows[0];
    const pointsEarned = current_level; // 1 point per level
    
    return Math.max(0, pointsEarned - points_used);
  } finally {
    client.release();
  }
}

/**
 * Helper: Calculate level from total XP
 */
function calculateLevelFromXP(totalXP: number): number {
  // Level N requires: 100 * N * (N + 1) / 2 total XP
  // Inverse: level = floor((-1 + sqrt(1 + 8*xp/100)) / 2) + 1
  const level = Math.floor((-1 + Math.sqrt(1 + 8 * totalXP / 100)) / 2) + 1;
  return Math.max(1, level);
}

/**
 * Helper: Calculate XP required for a level
 */
function calculateXPForLevel(level: number): number {
  return 100 * level * (level + 1) / 2;
}

/**
 * Helper: Get rank name based on level
 */
function getRankName(level: number): string {
  if (level < 5) return 'Novice';
  if (level < 10) return 'Apprentice';
  if (level < 20) return 'Practitioner';
  if (level < 30) return 'Expert';
  if (level < 50) return 'Master';
  return 'Grandmaster';
}

/**
 * Export database pool for use in other services
 */
export { pool };