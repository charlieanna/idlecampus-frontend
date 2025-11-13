/**
 * System Design Executor Service
 *
 * Executes user's Python implementations and validates against real infrastructure
 * Integrates Python code execution with database queries and traffic simulation
 */

import { pythonExecutor } from './pythonExecutor.js';
import { PythonExecutionResult } from '../types/index.js';

export interface UserImplementation {
  code: string;
  functionName: string;
}

export interface ExecutionContext {
  userCode: Record<string, UserImplementation>; // API name -> implementation
  databaseConnection?: any; // PostgreSQL connection (optional for now)
  problemId: string;
}

export interface TrafficPattern {
  rps: number;
  readWriteRatio: number;
  durationSeconds: number;
}

export interface ExecutionResult {
  passed: boolean;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  errorRate: number;
  errors: Array<{ request: number; error: string }>;
  metrics: {
    pythonExecutionTime: number;
    databaseQueryTime?: number;
    totalTime: number;
  };
}

export class SystemDesignExecutor {
  /**
   * Execute user's implementation with simulated traffic
   */
  async executeWithTraffic(
    context: ExecutionContext,
    traffic: TrafficPattern
  ): Promise<ExecutionResult> {
    const totalRequests = Math.floor(traffic.rps * traffic.durationSeconds);
    const writeRequests = Math.floor(totalRequests * (1 - traffic.readWriteRatio));
    const readRequests = totalRequests - writeRequests;

    console.log(`[SystemDesignExecutor] Executing ${totalRequests} requests (${writeRequests} writes, ${readRequests} reads)`);

    const results: Array<{ latency: number; success: boolean; error?: string }> = [];
    const errors: Array<{ request: number; error: string }> = [];

    // Execute write requests (create short URLs for TinyURL example)
    for (let i = 0; i < writeRequests; i++) {
      try {
        const startTime = Date.now();

        // Execute user's Python function
        const result = await this.executeUserFunction(
          context.userCode['create_short_url'],
          { long_url: `https://example.com/page/${i}` }
        );

        const latency = Date.now() - startTime;

        if (result.exitCode === 0 && result.stdout) {
          results.push({ latency, success: true });

          // TODO: Store in database when DB integration is ready
          // await context.databaseConnection.query(
          //   'INSERT INTO url_mappings (short_code, long_url) VALUES ($1, $2)',
          //   [result.stdout.trim(), `https://example.com/page/${i}`]
          // );
        } else {
          results.push({ latency, success: false, error: result.stderr || 'Unknown error' });
          errors.push({ request: i, error: result.stderr || 'Function returned no output' });
        }
      } catch (error) {
        results.push({ latency: 0, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        errors.push({ request: i, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    // Execute read requests (redirect for TinyURL example)
    for (let i = 0; i < readRequests; i++) {
      try {
        const startTime = Date.now();

        // Execute user's Python function
        const result = await this.executeUserFunction(
          context.userCode['redirect'] || context.userCode['get_original_url'],
          { short_code: `abc${i % writeRequests}` }
        );

        const latency = Date.now() - startTime;

        if (result.exitCode === 0) {
          results.push({ latency, success: true });
        } else {
          results.push({ latency, success: false, error: result.stderr || 'Unknown error' });
          errors.push({ request: writeRequests + i, error: result.stderr || 'Redirect failed' });
        }
      } catch (error) {
        results.push({ latency: 0, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        errors.push({ request: writeRequests + i, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    // Calculate metrics
    const successfulRequests = results.filter(r => r.success).length;
    const failedRequests = results.length - successfulRequests;
    const latencies = results.filter(r => r.success).map(r => r.latency).sort((a, b) => a - b);

    const averageLatency = latencies.length > 0
      ? latencies.reduce((sum, l) => sum + l, 0) / latencies.length
      : 0;

    const p50Latency = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.5)] : 0;
    const p95Latency = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.95)] : 0;
    const p99Latency = latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.99)] : 0;
    const errorRate = failedRequests / totalRequests;

    const passed = errorRate < 0.05 && p99Latency < 5000; // 5% error rate, 5s p99 latency

    return {
      passed,
      totalRequests,
      successfulRequests,
      failedRequests,
      averageLatency,
      p50Latency,
      p95Latency,
      p99Latency,
      errorRate,
      errors: errors.slice(0, 10), // Return first 10 errors
      metrics: {
        pythonExecutionTime: averageLatency,
        totalTime: Date.now(),
      },
    };
  }

  /**
   * Execute a single user function with input
   */
  private async executeUserFunction(
    implementation: UserImplementation,
    input: Record<string, any>
  ): Promise<PythonExecutionResult> {
    // Build Python code that calls user's function with input
    const testCode = `
${implementation.code}

# Test execution
import json
import sys

try:
    # Parse input
    test_input = ${JSON.stringify(input)}

    # Call user's function
    if '${implementation.functionName}' in dir():
        result = ${implementation.functionName}(**test_input)
        print(result)
    else:
        print("Function ${implementation.functionName} not found", file=sys.stderr)
        sys.exit(1)
except Exception as e:
    print(f"Error: {str(e)}", file=sys.stderr)
    sys.exit(1)
`;

    return await pythonExecutor.execute(testCode, {
      timeout: 5000,
      memoryLimit: 256,
    });
  }

  /**
   * Validate user's schema (text-based validation, no real DB yet)
   */
  validateSchema(schema: string, requiredTables: string[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const schemaLower = schema.toLowerCase();

    for (const table of requiredTables) {
      if (!schemaLower.includes(`create table ${table.toLowerCase()}`)) {
        errors.push(`Missing required table: ${table}`);
      }
    }

    // Check for primary keys
    if (!schemaLower.includes('primary key')) {
      errors.push('No PRIMARY KEY defined in schema');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Quick validation: Check if user's Python functions are syntactically correct
   */
  async quickValidate(userCode: Record<string, UserImplementation>): Promise<{
    valid: boolean;
    errors: Array<{ api: string; error: string }>;
  }> {
    const errors: Array<{ api: string; error: string }> = [];

    for (const [apiName, implementation] of Object.entries(userCode)) {
      try {
        // Try to execute the code with a dummy input
        const result = await pythonExecutor.execute(implementation.code, {
          timeout: 1000,
        });

        if (result.exitCode !== 0 && result.stderr && !result.stderr.includes('not found')) {
          errors.push({
            api: apiName,
            error: result.stderr,
          });
        }
      } catch (error) {
        errors.push({
          api: apiName,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const systemDesignExecutor = new SystemDesignExecutor();
