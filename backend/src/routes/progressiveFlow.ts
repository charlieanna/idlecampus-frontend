/**
 * Progressive Flow API Routes
 * 
 * REST API endpoints for the progressive learning flow system.
 * Handles user progress, challenges, XP, achievements, leaderboards, and skills.
 */

import express, { Request, Response } from 'express';
import * as progressiveService from '../services/progressiveFlowService.js';

const router = express.Router();

/**
 * @route   GET /api/progressive/user/:userId/progress
 * @desc    Get complete user progress (stats, challenges, achievements, skills)
 * @access  Public
 */
router.get('/user/:userId/progress', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const progress = await progressiveService.getUserProgress(userId);
    
    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting user progress:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user progress',
    });
  }
});

/**
 * @route   POST /api/progressive/user/:userId/complete-level
 * @desc    Complete a challenge level and award XP
 * @access  Public
 */
router.post('/user/:userId/complete-level', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { challengeId, level, performance } = req.body;

    if (!challengeId || !level || !performance) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: challengeId, level, performance',
      });
    }

    const result = await progressiveService.completeLevel(
      userId,
      challengeId,
      level,
      performance
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error completing level:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to complete level',
    });
  }
});

/**
 * @route   POST /api/progressive/user/:userId/assessment
 * @desc    Save assessment results and get recommendations
 * @access  Public
 */
router.post('/user/:userId/assessment', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { answers, score } = req.body;

    if (!answers || score === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: answers, score',
      });
    }

    const result = await progressiveService.saveAssessment(userId, answers, score);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error saving assessment:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save assessment',
    });
  }
});

/**
 * @route   GET /api/progressive/challenges
 * @desc    Get all challenges, optionally filtered by track
 * @access  Public
 */
router.get('/challenges', async (req: Request, res: Response) => {
  try {
    const { trackId } = req.query;
    const challenges = await progressiveService.getAllChallenges(trackId as string);

    res.json({
      success: true,
      data: challenges,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting challenges:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get challenges',
    });
  }
});

/**
 * @route   GET /api/progressive/challenges/:challengeId
 * @desc    Get single challenge with all 5 levels
 * @access  Public
 */
router.get('/challenges/:challengeId', async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    const challenge = await progressiveService.getChallengeById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    res.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting challenge:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get challenge',
    });
  }
});

/**
 * @route   GET /api/progressive/challenges/:challengeId/unlocked/:userId
 * @desc    Check if challenge is unlocked (prerequisites met)
 * @access  Public
 */
router.get('/challenges/:challengeId/unlocked/:userId', async (req: Request, res: Response) => {
  try {
    const { challengeId, userId } = req.params;
    const result = await progressiveService.checkChallengeUnlocked(userId, challengeId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error checking challenge unlock:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check challenge unlock',
    });
  }
});

/**
 * @route   GET /api/progressive/daily-challenge
 * @desc    Get today's daily challenge
 * @access  Public
 */
router.get('/daily-challenge', async (req: Request, res: Response) => {
  try {
    const dailyChallenge = await progressiveService.getDailyChallenge();

    if (!dailyChallenge) {
      return res.status(404).json({
        success: false,
        error: 'No daily challenge available',
      });
    }

    res.json({
      success: true,
      data: dailyChallenge,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting daily challenge:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get daily challenge',
    });
  }
});

/**
 * @route   POST /api/progressive/user/:userId/award-xp
 * @desc    Award XP to user
 * @access  Public
 */
router.post('/user/:userId/award-xp', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { amount, source, metadata } = req.body;

    if (!amount || !source) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: amount, source',
      });
    }

    const result = await progressiveService.awardXP(
      userId,
      amount,
      source,
      metadata || {}
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error awarding XP:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to award XP',
    });
  }
});

/**
 * @route   GET /api/progressive/user/:userId/level
 * @desc    Get user's current level and XP info
 * @access  Public
 */
router.get('/user/:userId/level', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const levelInfo = await progressiveService.getUserLevel(userId);

    res.json({
      success: true,
      data: levelInfo,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting user level:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user level',
    });
  }
});

/**
 * @route   GET /api/progressive/user/:userId/streak
 * @desc    Get user's streak information
 * @access  Public
 */
router.get('/user/:userId/streak', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const streakInfo = await progressiveService.getUserStreak(userId);

    res.json({
      success: true,
      data: streakInfo,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting user streak:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user streak',
    });
  }
});

/**
 * @route   GET /api/progressive/achievements
 * @desc    Get all achievements
 * @access  Public
 */
router.get('/achievements', async (req: Request, res: Response) => {
  try {
    const achievements = await progressiveService.getAllAchievements();

    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting achievements:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get achievements',
    });
  }
});

/**
 * @route   GET /api/progressive/user/:userId/achievements
 * @desc    Get user's unlocked achievements
 * @access  Public
 */
router.get('/user/:userId/achievements', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const achievements = await progressiveService.getUserAchievements(userId);

    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting user achievements:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user achievements',
    });
  }
});

/**
 * @route   POST /api/progressive/user/:userId/check-achievements
 * @desc    Check and unlock achievements for user
 * @access  Public
 */
router.post('/user/:userId/check-achievements', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const unlockedAchievements = await progressiveService.checkAndUnlockAchievements(userId);

    res.json({
      success: true,
      data: {
        unlockedAchievements,
        count: unlockedAchievements.length,
      },
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error checking achievements:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check achievements',
    });
  }
});

/**
 * @route   GET /api/progressive/leaderboard
 * @desc    Get leaderboard for specified period
 * @access  Public
 */
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const { period = 'all', limit = '100' } = req.query;
    
    const validPeriods = ['daily', 'weekly', 'monthly', 'all'];
    if (!validPeriods.includes(period as string)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid period. Must be one of: daily, weekly, monthly, all',
      });
    }

    const leaderboard = await progressiveService.getLeaderboard(
      period as 'daily' | 'weekly' | 'monthly' | 'all',
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get leaderboard',
    });
  }
});

/**
 * @route   GET /api/progressive/user/:userId/rank
 * @desc    Get user's rank in leaderboard
 * @access  Public
 */
router.get('/user/:userId/rank', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { period = 'all' } = req.query;

    const validPeriods = ['daily', 'weekly', 'monthly', 'all'];
    if (!validPeriods.includes(period as string)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid period. Must be one of: daily, weekly, monthly, all',
      });
    }

    const rank = await progressiveService.getUserRank(
      userId,
      period as 'daily' | 'weekly' | 'monthly' | 'all'
    );

    res.json({
      success: true,
      data: rank,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting user rank:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user rank',
    });
  }
});

/**
 * @route   GET /api/progressive/user/:userId/skills
 * @desc    Get user's skills
 * @access  Public
 */
router.get('/user/:userId/skills', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const skills = await progressiveService.getUserSkills(userId);

    res.json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting user skills:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user skills',
    });
  }
});

/**
 * @route   POST /api/progressive/user/:userId/allocate-skill-point
 * @desc    Allocate a skill point
 * @access  Public
 */
router.post('/user/:userId/allocate-skill-point', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { skillId } = req.body;

    if (!skillId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: skillId',
      });
    }

    const result = await progressiveService.allocateSkillPoint(userId, skillId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error allocating skill point:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to allocate skill point',
    });
  }
});

/**
 * @route   GET /api/progressive/user/:userId/skill-points
 * @desc    Get available skill points
 * @access  Public
 */
router.get('/user/:userId/skill-points', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const availablePoints = await progressiveService.getSkillPointsAvailable(userId);

    res.json({
      success: true,
      data: {
        availablePoints,
      },
    });
  } catch (error) {
    console.error('[Progressive Flow API] Error getting skill points:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get skill points',
    });
  }
});

/**
 * @route   GET /api/progressive/health
 * @desc    Health check for progressive flow service
 * @access  Public
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      service: 'progressive-flow',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      service: 'progressive-flow',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;