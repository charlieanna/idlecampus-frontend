import { apiService } from '../../../../services/api';
import type {
  LoadTestConfig,
  LoadTestProgress,
  LoadTestResults,
  LoadTestMetrics,
  RequestResult,
  Bottleneck,
} from '../types/loadTest';

/**
 * Load Test Service
 * Executes Python code via backend API and measures performance under load
 */
export class LoadTestService {
  private abortController: AbortController | null = null;

  /**
   * Run a load test with the given configuration
   */
  async runLoadTest(
    config: LoadTestConfig,
    onProgress?: (progress: LoadTestProgress) => void
  ): Promise<LoadTestResults> {
    this.abortController = new AbortController();

    const startTime = Date.now();
    const totalRequests = Math.floor(config.rps * config.duration);
    const results: RequestResult[] = [];
    const errors: Set<string> = new Set();

    // Calculate request timings
    const intervalMs = 1000 / config.rps; // Time between requests
    const numReads = Math.floor(totalRequests * config.readWriteRatio);
    const numWrites = totalRequests - numReads;

    try {
      // Execute requests in batches to avoid overwhelming the browser
      const batchSize = Math.min(100, config.rps);
      const numBatches = Math.ceil(totalRequests / batchSize);

      for (let batch = 0; batch < numBatches; batch++) {
        if (this.abortController.signal.aborted) {
          throw new Error('Load test cancelled');
        }

        const batchStart = batch * batchSize;
        const batchEnd = Math.min((batch + 1) * batchSize, totalRequests);
        const batchPromises: Promise<RequestResult>[] = [];

        // Create batch of concurrent requests
        for (let i = batchStart; i < batchEnd; i++) {
          const requestType = i < numReads ? 'read' : 'write';

          const promise = this.executeRequest(
            config.code,
            config.challengeId,
            requestType,
            i
          ).catch((error) => {
            errors.add(error.message);
            return {
              success: false,
              latency: 0,
              error: error.message,
              timestamp: Date.now(),
              type: requestType,
            } as RequestResult;
          });

          batchPromises.push(promise);

          // Small delay between requests to spread load
          if (i < batchEnd - 1) {
            await this.sleep(intervalMs);
          }
        }

        // Wait for batch to complete
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);

        // Report progress
        if (onProgress) {
          const elapsed = (Date.now() - startTime) / 1000;
          const completed = results.length;
          const rate = completed / elapsed;
          const remaining = totalRequests - completed;
          const estimated = remaining / rate;

          onProgress({
            completed,
            total: totalRequests,
            currentRPS: rate,
            elapsed,
            estimated,
          });
        }
      }

      const endTime = Date.now();
      const metrics = this.calculateMetrics(results, startTime, endTime);
      const bottlenecks = this.detectBottlenecks(metrics, config);

      return {
        config,
        metrics,
        bottlenecks,
        startTime,
        endTime,
        success: metrics.errorRate < 0.05, // Success if <5% errors
        errors: Array.from(errors),
      };
    } catch (error) {
      const endTime = Date.now();
      const metrics = this.calculateMetrics(results, startTime, endTime);

      return {
        config,
        metrics,
        bottlenecks: [{
          type: 'high_error_rate',
          severity: 'critical',
          message: `Load test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          suggestions: ['Check your code for errors', 'Reduce test load', 'Check backend connectivity'],
        }],
        startTime,
        endTime,
        success: false,
        errors: Array.from(errors),
      };
    }
  }

  /**
   * Execute a single request to the backend
   */
  private async executeRequest(
    code: string,
    challengeId: string,
    type: 'read' | 'write',
    index: number
  ): Promise<RequestResult> {
    const requestStart = Date.now();

    try {
      // Prepare test input based on request type
      const testInput = type === 'read'
        ? `expand("code${index}", {})`
        : `shorten("https://example.com/url${index}")`;

      const response = await apiService.executeCode(
        challengeId,
        code,
        testInput
      );

      const latency = Date.now() - requestStart;

      return {
        success: response.success && !response.error,
        latency,
        error: response.error,
        timestamp: Date.now(),
        type,
      };
    } catch (error) {
      const latency = Date.now() - requestStart;

      return {
        success: false,
        latency,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        type,
      };
    }
  }

  /**
   * Calculate performance metrics from request results
   */
  private calculateMetrics(
    results: RequestResult[],
    startTime: number,
    endTime: number
  ): LoadTestMetrics {
    if (results.length === 0) {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        errorRate: 1,
        minLatency: 0,
        maxLatency: 0,
        avgLatency: 0,
        p50Latency: 0,
        p95Latency: 0,
        p99Latency: 0,
        throughput: 0,
        duration: (endTime - startTime) / 1000,
        latencyDistribution: [],
        throughputOverTime: [],
      };
    }

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const latencies = results.map(r => r.latency).sort((a, b) => a - b);

    const duration = (endTime - startTime) / 1000; // seconds
    const throughput = results.length / duration;

    // Calculate percentiles
    const p50Index = Math.floor(latencies.length * 0.5);
    const p95Index = Math.floor(latencies.length * 0.95);
    const p99Index = Math.floor(latencies.length * 0.99);

    // Calculate throughput over time (in 1-second buckets)
    const throughputOverTime: Array<{ timestamp: number; rps: number }> = [];
    const buckets = new Map<number, number>();

    results.forEach(result => {
      const bucket = Math.floor((result.timestamp - startTime) / 1000);
      buckets.set(bucket, (buckets.get(bucket) || 0) + 1);
    });

    buckets.forEach((count, bucket) => {
      throughputOverTime.push({
        timestamp: bucket,
        rps: count,
      });
    });

    return {
      totalRequests: results.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
      errorRate: failed.length / results.length,

      minLatency: Math.min(...latencies),
      maxLatency: Math.max(...latencies),
      avgLatency: latencies.reduce((a, b) => a + b, 0) / latencies.length,
      p50Latency: latencies[p50Index] || 0,
      p95Latency: latencies[p95Index] || 0,
      p99Latency: latencies[p99Index] || 0,

      throughput,
      duration,
      latencyDistribution: latencies,
      throughputOverTime: throughputOverTime.sort((a, b) => a.timestamp - b.timestamp),
    };
  }

  /**
   * Detect performance bottlenecks and provide suggestions
   */
  private detectBottlenecks(
    metrics: LoadTestMetrics,
    config: LoadTestConfig
  ): Bottleneck[] {
    const bottlenecks: Bottleneck[] = [];

    // Check P99 latency
    if (metrics.p99Latency > 100) {
      bottlenecks.push({
        type: 'high_latency',
        severity: metrics.p99Latency > 500 ? 'critical' : metrics.p99Latency > 200 ? 'error' : 'warning',
        message: `P99 latency (${metrics.p99Latency.toFixed(0)}ms) exceeds target (100ms)`,
        suggestions: [
          'Optimize algorithm complexity (reduce O(n²) to O(n log n))',
          'Add caching for frequently accessed data',
          'Use more efficient data structures (dict instead of list for lookups)',
          'Reduce string concatenation operations',
        ],
        metric: metrics.p99Latency,
      });
    }

    // Check error rate
    if (metrics.errorRate > 0.01) {
      bottlenecks.push({
        type: 'high_error_rate',
        severity: metrics.errorRate > 0.1 ? 'critical' : metrics.errorRate > 0.05 ? 'error' : 'warning',
        message: `Error rate (${(metrics.errorRate * 100).toFixed(1)}%) exceeds target (1%)`,
        suggestions: [
          'Add error handling for edge cases',
          'Validate input parameters',
          'Check for division by zero or null references',
          'Handle exceptions gracefully',
        ],
        metric: metrics.errorRate,
      });
    }

    // Check throughput vs target
    const targetThroughput = config.rps;
    if (metrics.throughput < targetThroughput * 0.8) {
      bottlenecks.push({
        type: 'low_throughput',
        severity: 'warning',
        message: `Actual throughput (${metrics.throughput.toFixed(0)} RPS) is below target (${targetThroughput} RPS)`,
        suggestions: [
          'Code execution is too slow to handle target load',
          'Consider simplifying algorithm',
          'Remove unnecessary computations',
          'Backend may need horizontal scaling',
        ],
        metric: metrics.throughput,
      });
    }

    // Check for timeout patterns
    if (metrics.maxLatency > 5000) {
      bottlenecks.push({
        type: 'timeout',
        severity: 'error',
        message: `Maximum latency (${metrics.maxLatency.toFixed(0)}ms) suggests timeout issues`,
        suggestions: [
          'Remove blocking operations (time.sleep)',
          'Avoid infinite loops',
          'Reduce computational complexity',
          'Check for deadlocks',
        ],
        metric: metrics.maxLatency,
      });
    }

    // Check for high variance in latency
    const latencyVariance = metrics.p99Latency - metrics.p50Latency;
    if (latencyVariance > metrics.p50Latency * 2) {
      bottlenecks.push({
        type: 'high_latency',
        severity: 'warning',
        message: `High latency variance detected (P99-P50: ${latencyVariance.toFixed(0)}ms)`,
        suggestions: [
          'Performance is inconsistent across requests',
          'Check for conditional branches with varying complexity',
          'Consider memoization for expensive operations',
          'Profile code to identify slow paths',
        ],
        metric: latencyVariance,
      });
    }

    return bottlenecks;
  }

  /**
   * Cancel the current load test
   */
  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  /**
   * Helper to sleep for a given number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const loadTestService = new LoadTestService();
