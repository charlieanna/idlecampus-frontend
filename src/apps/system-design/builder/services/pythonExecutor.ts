/**
 * Python Execution Service
 *
 * Executes Python code in the browser for system design simulations
 * Supports both real execution (via Pyodide) and simulated execution
 *
 * For MVP, we simulate execution with realistic performance characteristics
 * Later, we can integrate Pyodide for actual browser-based Python execution
 */

import { CustomLogic } from '../types/component';

/**
 * Execution context provided to Python code
 */
export interface ExecutionContext {
  db: MockDatabase;
  cache: MockRedisCache;
  queue: MockMessageQueue;
  config: Record<string, any>;
}

/**
 * Mock database for Python code
 */
export class MockDatabase {
  private data: Map<string, any> = new Map();
  private idCounter = 1;

  exists(key: string): boolean {
    return this.data.has(key);
  }

  get(key: string): any {
    return this.data.get(key);
  }

  insert(key: string, value: any): void {
    this.data.set(key, value);
  }

  get_next_id(): number {
    return this.idCounter++;
  }

  find_by_url(url: string): any {
    for (const [key, value] of this.data.entries()) {
      if (value === url) {
        return { short_code: key, long_url: value };
      }
    }
    return null;
  }
}

/**
 * Mock Redis cache for Python code
 */
export class MockRedisCache {
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  get(key: string): any {
    const entry = this.cache.get(key);
    if (entry && entry.expiry > Date.now()) {
      return entry.value;
    }
    return null;
  }

  set(key: string, value: any, ttl: number = 3600): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl * 1000,
    });
  }

  exists(key: string): boolean {
    const entry = this.cache.get(key);
    return !!(entry && entry.expiry > Date.now());
  }
}

/**
 * Mock message queue for Python code
 */
export class MockMessageQueue {
  private messages: any[] = [];

  enqueue(message: any): void {
    this.messages.push(message);
  }

  dequeue(): any {
    return this.messages.shift();
  }

  size(): number {
    return this.messages.length;
  }
}

/**
 * Benchmark result from Python execution
 */
export interface BenchmarkResult {
  avgLatency: number; // milliseconds
  p99Latency: number;
  errorRate: number;
  successCount: number;
  errorCount: number;
  samples: { latency: number; success: boolean }[];
}

/**
 * Python Executor Service
 */
export class PythonExecutor {
  private static instance: PythonExecutor;
  private pyodideReady = false;
  private simulationMode = true; // For MVP, we simulate execution

  private constructor() {}

  static getInstance(): PythonExecutor {
    if (!PythonExecutor.instance) {
      PythonExecutor.instance = new PythonExecutor();
    }
    return PythonExecutor.instance;
  }

  /**
   * Initialize Python runtime (Pyodide in the future)
   */
  async initialize(): Promise<void> {
    if (this.pyodideReady) return;

    // For MVP, we just simulate
    // In production, we would load Pyodide here:
    // const pyodide = await loadPyodide({
    //   indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
    // });

    this.pyodideReady = true;
  }

  /**
   * Execute Python function and return result
   */
  async execute(
    pythonCode: string,
    functionName: string,
    args: any[],
    context?: ExecutionContext
  ): Promise<any> {
    if (this.simulationMode) {
      return this.simulateExecution(pythonCode, functionName, args, context);
    }

    // Real Pyodide execution would go here
    throw new Error('Real Python execution not yet implemented');
  }

  /**
   * Benchmark Python code performance
   */
  async benchmark(
    pythonCode: string,
    functionName: string,
    sampleInputs: any[],
    context?: ExecutionContext,
    options: {
      sampleSize?: number;
      warmupRequests?: number;
      timeoutMs?: number;
    } = {}
  ): Promise<BenchmarkResult> {
    const { sampleSize = 100, warmupRequests = 10, timeoutMs = 5000 } = options;

    const samples: { latency: number; success: boolean }[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Warmup phase (not counted in results)
    for (let i = 0; i < warmupRequests; i++) {
      const input = sampleInputs[i % sampleInputs.length];
      await this.execute(pythonCode, functionName, [input], context);
    }

    // Actual benchmarking
    for (let i = 0; i < sampleSize; i++) {
      const input = sampleInputs[i % sampleInputs.length];
      const startTime = performance.now();

      try {
        const timeout = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout')), timeoutMs);
        });

        const execution = this.execute(pythonCode, functionName, [input], context);

        await Promise.race([execution, timeout]);

        const latency = performance.now() - startTime;
        samples.push({ latency, success: true });
        successCount++;
      } catch (error) {
        const latency = performance.now() - startTime;
        samples.push({ latency, success: false });
        errorCount++;
      }
    }

    // Calculate metrics
    const successfulSamples = samples.filter(s => s.success);
    const latencies = successfulSamples.map(s => s.latency).sort((a, b) => a - b);

    const avgLatency = latencies.length > 0
      ? latencies.reduce((sum, l) => sum + l, 0) / latencies.length
      : timeoutMs;

    const p99Index = Math.floor(latencies.length * 0.99);
    const p99Latency = latencies[p99Index] || timeoutMs;

    const errorRate = errorCount / sampleSize;

    return {
      avgLatency,
      p99Latency,
      errorRate,
      successCount,
      errorCount,
      samples,
    };
  }

  /**
   * Simulate Python execution for MVP
   * This provides realistic performance characteristics based on the algorithm
   */
  private async simulateExecution(
    pythonCode: string,
    functionName: string,
    args: any[],
    context?: ExecutionContext
  ): Promise<any> {
    // Simulate processing delay based on code complexity
    const complexity = this.analyzeCodeComplexity(pythonCode, functionName);
    const baseLatency = this.getBaseLatency(functionName);
    const actualLatency = baseLatency * complexity.factor;

    // Simulate async execution
    await new Promise(resolve => setTimeout(resolve, actualLatency));

    // Simulate different function behaviors
    switch (functionName) {
      case 'shorten':
        return this.simulateShorten(args[0], context, pythonCode);

      case 'redirect':
      case 'expand':
        return this.simulateRedirect(args[0], context);

      case 'process_message':
        return this.simulateProcessMessage(args[0], context);

      case 'get_feed':
        return this.simulateGetFeed(args[0], context);

      default:
        // Generic simulation
        return { success: true, result: `Simulated result for ${functionName}` };
    }
  }

  /**
   * Analyze code complexity to determine realistic latency
   */
  private analyzeCodeComplexity(pythonCode: string, functionName: string): { factor: number; issues: string[] } {
    const issues: string[] = [];
    let factor = 1.0;

    // Check for bad patterns
    if (pythonCode.includes('while') && pythonCode.includes('exists')) {
      // Collision checking in loop - very bad!
      issues.push('Collision checking in loop detected');
      factor *= 10;
    }

    if (pythonCode.includes('for') && pythonCode.includes('in range')) {
      // Nested loops potentially
      const forCount = (pythonCode.match(/for/g) || []).length;
      if (forCount > 1) {
        issues.push('Nested loops detected');
        factor *= Math.pow(2, forCount - 1);
      }
    }

    if (pythonCode.includes('requests.') || pythonCode.includes('urllib')) {
      // External HTTP calls
      issues.push('External HTTP calls detected');
      factor *= 5;
    }

    if (pythonCode.includes('sleep(')) {
      // Artificial delays
      issues.push('Sleep statements detected');
      factor *= 3;
    }

    // Check for good patterns
    if (pythonCode.includes('get_next_id()') || pythonCode.includes('counter')) {
      // Using auto-increment - good!
      factor *= 0.5;
    }

    if (pythonCode.includes('cache') && pythonCode.includes('get')) {
      // Using cache - good!
      factor *= 0.7;
    }

    return { factor, issues };
  }

  /**
   * Get base latency for a function type
   */
  private getBaseLatency(functionName: string): number {
    const latencyMap: Record<string, number> = {
      shorten: 10,
      redirect: 5,
      expand: 5,
      process_message: 50,
      get_feed: 30,
      match_driver: 100,
      calculate_surge: 50,
    };

    return latencyMap[functionName] || 20;
  }

  /**
   * Simulate URL shortening
   */
  private simulateShorten(longUrl: string, context?: ExecutionContext, pythonCode?: string): string {
    if (!context) {
      // Simple random code
      return Math.random().toString(36).substring(2, 8);
    }

    // Check if code uses collision checking (bad pattern)
    if (pythonCode && pythonCode.includes('while') && pythonCode.includes('exists')) {
      // Simulate multiple attempts
      let attempts = 0;
      let code: string;
      do {
        code = Math.random().toString(36).substring(2, 8);
        attempts++;
      } while (context.db.exists(code) && attempts < 10);

      context.db.insert(code, longUrl);
      return code;
    }

    // Good pattern: auto-increment
    const id = context.db.get_next_id();
    const code = this.base62Encode(id);
    context.db.insert(code, longUrl);
    return code;
  }

  /**
   * Simulate URL redirect/expand
   */
  private simulateRedirect(shortCode: string, context?: ExecutionContext): string | null {
    if (!context) return null;

    // Check cache first (if available)
    if (context.cache) {
      const cached = context.cache.get(shortCode);
      if (cached) return cached;
    }

    // Check database
    const url = context.db.get(shortCode);

    // Warm cache for next time
    if (url && context.cache) {
      context.cache.set(shortCode, url);
    }

    return url;
  }

  /**
   * Simulate message processing
   */
  private simulateProcessMessage(message: any, context?: ExecutionContext): boolean {
    if (!context) return true;

    // Simulate validation
    if (message.validate && Math.random() < 0.95) {
      return false; // Validation failed
    }

    // Simulate database write
    if (message.short_code && message.long_url) {
      context.db.insert(message.short_code, message.long_url);
    }

    return true;
  }

  /**
   * Simulate feed generation
   */
  private simulateGetFeed(userId: string, context?: ExecutionContext): any[] {
    // Return simulated feed items
    return Array.from({ length: 20 }, (_, i) => ({
      id: `post_${i}`,
      userId: `user_${Math.floor(Math.random() * 100)}`,
      content: `Post content ${i}`,
      timestamp: Date.now() - i * 3600000,
    }));
  }

  /**
   * Helper: Base62 encoding
   */
  private base62Encode(num: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    if (num === 0) return charset[0];

    let result = '';
    while (num > 0) {
      result = charset[num % 62] + result;
      num = Math.floor(num / 62);
    }
    return result;
  }
}

// Export singleton instance
export const pythonExecutor = PythonExecutor.getInstance();