/**
 * Code Labs API Routes
 * Handles Python code execution, validation, and submission
 */

import { Router, Request, Response } from 'express';
import { pythonExecutor } from '../services/pythonExecutor.js';
import { testRunner } from '../services/testRunner.js';
import {
  getChallenge,
  getAllChallenges,
  challengeExists,
} from '../services/challengeLoader.js';
import {
  ExecuteCodeRequest,
  ExecuteCodeResponse,
  ValidateCodeRequest,
  ValidateCodeResponse,
  SubmitCodeRequest,
  SubmitCodeResponse,
} from '../types/index.js';

const router = Router();

/**
 * GET /api/v1/code_labs
 * List all available code lab challenges
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const challenges = getAllChallenges();
    res.json({
      success: true,
      challenges: challenges.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        difficulty: c.difficulty,
      })),
    });
  } catch (error) {
    console.error('Error listing challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list challenges',
    });
  }
});

/**
 * GET /api/v1/code_labs/:id
 * Get challenge details including starter code
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const challenge = getChallenge(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    res.json({
      success: true,
      challenge: {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        starter_code: challenge.starter_code,
        time_limit: challenge.time_limit,
        memory_limit: challenge.memory_limit,
      },
    });
  } catch (error) {
    console.error('Error getting challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get challenge',
    });
  }
});

/**
 * POST /api/v1/code_labs/:id/execute
 * Execute Python code with optional test input
 */
router.post('/:id/execute', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, testInput, timeout }: ExecuteCodeRequest = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required',
      });
    }

    const challenge = getChallenge(id);
    const timeLimit = timeout || challenge?.time_limit || 5;
    const memoryLimit = challenge?.memory_limit;

    // Execute code
    const result = await pythonExecutor.execute(code, {
      timeout: timeLimit * 1000,
      stdin: testInput,
      memoryLimit,
    });

    const response: ExecuteCodeResponse = {
      success: result.exitCode === 0 && !result.error,
      output: result.stdout || result.stderr,
      error: result.error || (result.exitCode !== 0 ? result.stderr : undefined),
      execution_time: result.executionTime,
      memory_used: result.memoryUsed,
    };

    res.json(response);
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Execution failed',
      execution_time: 0,
    });
  }
});

/**
 * POST /api/v1/code_labs/:id/validate
 * Validate code against test cases
 */
router.post('/:id/validate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code }: ValidateCodeRequest = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required',
      });
    }

    const challenge = getChallenge(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    // Run tests
    const validation = await testRunner.runTests(code, challenge.test_cases, {
      timeout: (challenge.time_limit || 5) * 1000,
      memoryLimit: challenge.memory_limit,
    });

    const totalTime = validation.test_results.reduce(
      (sum, t) => sum + t.execution_time,
      0
    );

    const response: ValidateCodeResponse = {
      success: validation.success,
      output: validation.success
        ? `All ${validation.passed} tests passed!`
        : testRunner.generateFeedback(validation),
      execution_time: totalTime,
      validation,
    };

    res.json(response);
  } catch (error) {
    console.error('Error validating code:', error);
    res.status(500).json({
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Validation failed',
      execution_time: 0,
      validation: {
        success: false,
        passed: 0,
        failed: 0,
        total: 0,
        test_results: [],
      },
    });
  }
});

/**
 * POST /api/v1/code_labs/:id/submit
 * Submit code for final grading
 */
router.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code }: SubmitCodeRequest = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required',
      });
    }

    const challenge = getChallenge(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    // Run tests
    const validation = await testRunner.runTests(code, challenge.test_cases, {
      timeout: (challenge.time_limit || 5) * 1000,
      memoryLimit: challenge.memory_limit,
    });

    const score = testRunner.calculateScore(validation);
    const feedback = testRunner.generateFeedback(validation);
    const totalTime = validation.test_results.reduce(
      (sum, t) => sum + t.execution_time,
      0
    );

    const response: SubmitCodeResponse = {
      success: validation.success,
      output: feedback,
      execution_time: totalTime,
      validation,
      score,
      feedback,
    };

    res.json(response);
  } catch (error) {
    console.error('Error submitting code:', error);
    res.status(500).json({
      success: false,
      output: '',
      error: error instanceof Error ? error.message : 'Submission failed',
      execution_time: 0,
      validation: {
        success: false,
        passed: 0,
        failed: 0,
        total: 0,
        test_results: [],
      },
      score: 0,
      feedback: 'Submission failed',
    });
  }
});

/**
 * GET /api/v1/code_labs/:id/hint
 * Get hint for a challenge
 */
router.get('/:id/hint', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const challenge = getChallenge(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    res.json({
      success: true,
      hints: challenge.hints || [],
    });
  } catch (error) {
    console.error('Error getting hint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get hint',
    });
  }
});

/**
 * GET /api/v1/code_labs/:id/solution
 * Get solution for a challenge
 */
router.get('/:id/solution', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const challenge = getChallenge(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    res.json({
      success: true,
      solution: challenge.solution || 'No solution available',
    });
  } catch (error) {
    console.error('Error getting solution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get solution',
    });
  }
});

export default router;
