/**
 * System Design Validation API Routes
 *
 * Endpoints for validating system design implementations with real execution
 */

import { Router } from 'express';
import { systemDesignExecutor, UserImplementation } from '../services/systemDesignExecutor.js';
import { databaseSetup } from '../services/databaseSetup.js';

const router = Router();

/**
 * POST /api/v1/system-design/:problemId/validate
 *
 * Validate user's system design with real code execution
 *
 * Request body:
 * {
 *   userCode: {
 *     create_short_url: { code: "...", functionName: "shorten" },
 *     redirect: { code: "...", functionName: "redirect" }
 *   },
 *   userSchema: "CREATE TABLE url_mappings ...",
 *   level: 0,  // Test level (0 = brute force, 1 = basic, etc.)
 *   traffic: { rps: 1, readWriteRatio: 0.5, durationSeconds: 10 }
 * }
 */
router.post('/:problemId/validate', async (req, res) => {
  const { problemId } = req.params;
  const { userCode, userSchema, level, traffic } = req.body;

  console.log(`[SystemDesign API] Validating ${problemId} at level ${level}`);

  try {
    // Step 1: Quick validation of Python syntax
    console.log('[SystemDesign API] Step 1: Validating Python code syntax...');
    const syntaxCheck = await systemDesignExecutor.quickValidate(userCode);

    if (!syntaxCheck.valid) {
      return res.status(400).json({
        success: false,
        error: 'Python code has syntax errors',
        details: syntaxCheck.errors,
      });
    }

    // Step 2: Validate schema (text-based for now)
    console.log('[SystemDesign API] Step 2: Validating database schema...');
    const requiredTables = getRequiredTables(problemId);
    const schemaValidation = await systemDesignExecutor.validateSchema(userSchema, requiredTables);

    if (!schemaValidation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Database schema validation failed',
        details: schemaValidation.errors,
      });
    }

    // Step 3: Check if PostgreSQL is available
    const dbAvailable = await databaseSetup.isAvailable();
    let dbSession = null;

    if (dbAvailable) {
      console.log('[SystemDesign API] Step 3: Setting up database...');
      try {
        dbSession = await databaseSetup.createSession(userSchema, problemId);
        console.log(`[SystemDesign API] Database session created: ${dbSession.sessionId}`);
      } catch (dbError) {
        console.error('[SystemDesign API] Database setup failed:', dbError);
        return res.status(500).json({
          success: false,
          error: 'Failed to setup database',
          details: dbError instanceof Error ? dbError.message : 'Unknown error',
        });
      }
    } else {
      console.log('[SystemDesign API] PostgreSQL not available, running in simulation mode');
    }

    // Step 4: Execute with traffic
    console.log('[SystemDesign API] Step 4: Executing with traffic...');
    const executionResult = await systemDesignExecutor.executeWithTraffic(
      {
        userCode,
        databaseConnection: dbSession,
        problemId,
      },
      traffic || { rps: 1, readWriteRatio: 0.5, durationSeconds: 10 }
    );

    // Step 5: Clean up database session
    if (dbSession) {
      console.log('[SystemDesign API] Step 5: Cleaning up database session...');
      await databaseSetup.destroySession(dbSession.sessionId);
    }

    // Return validation result
    return res.json({
      success: true,
      result: {
        passed: executionResult.passed,
        level,
        metrics: {
          totalRequests: executionResult.totalRequests,
          successfulRequests: executionResult.successfulRequests,
          failedRequests: executionResult.failedRequests,
          errorRate: executionResult.errorRate,
          averageLatency: executionResult.averageLatency,
          p50Latency: executionResult.p50Latency,
          p95Latency: executionResult.p95Latency,
          p99Latency: executionResult.p99Latency,
        },
        errors: executionResult.errors,
        databaseAvailable: dbAvailable,
      },
    });
  } catch (error) {
    console.error('[SystemDesign API] Validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/v1/system-design/:problemId/quick-validate
 *
 * Quick validation (syntax check only, no execution)
 */
router.post('/:problemId/quick-validate', async (req, res) => {
  const { problemId } = req.params;
  const { userCode, userSchema } = req.body;

  try {
    // Validate Python syntax
    const syntaxCheck = await systemDesignExecutor.quickValidate(userCode);

    // Validate schema
    const requiredTables = getRequiredTables(problemId);
    const schemaValidation = await systemDesignExecutor.validateSchema(userSchema, requiredTables);

    return res.json({
      success: true,
      result: {
        codeValid: syntaxCheck.valid,
        codeErrors: syntaxCheck.errors,
        schemaValid: schemaValidation.valid,
        schemaErrors: schemaValidation.errors,
      },
    });
  } catch (error) {
    console.error('[SystemDesign API] Quick validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Quick validation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/v1/system-design/health
 *
 * Check system design validation service health
 */
router.get('/health', async (req, res) => {
  const dbAvailable = await databaseSetup.isAvailable();

  return res.json({
    status: 'healthy',
    services: {
      pythonExecutor: 'available',
      postgreSQL: dbAvailable ? 'available' : 'not available (simulation mode)',
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Helper: Get required tables for a problem
 */
function getRequiredTables(problemId: string): string[] {
  const tableMap: Record<string, string[]> = {
    'tiny_url': ['url_mappings'],
    'basic-text-search': ['documents'],
    'web-crawler': ['crawled_pages', 'url_queue'],
    // Add more as needed
  };

  return tableMap[problemId] || [];
}

export default router;
