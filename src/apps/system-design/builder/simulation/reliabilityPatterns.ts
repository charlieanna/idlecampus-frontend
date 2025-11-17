/**
 * Reliability Patterns Module (Phase 4)
 *
 * Provides pessimistic reliability modeling:
 * - Retry logic with exponential backoff (retries increase load)
 * - Circuit breaker pattern (trip after N failures)
 * - Timeout enforcement (hard timeouts cause errors)
 * - Backpressure and queue modeling (overflow causes errors)
 */

import { isEnabled, verboseLog } from './featureFlags';

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number; // Maximum number of retry attempts
  initialDelayMs: number; // Initial retry delay
  maxDelayMs: number; // Maximum retry delay
  backoffMultiplier: number; // Exponential backoff multiplier (typically 2)
  jitterFactor: number; // Random jitter factor (0-1)
  retryableErrorRate: number; // Fraction of errors that are retryable (0-1)
}

/**
 * Retry effect on system
 */
export interface RetryEffect {
  effectiveRps: number; // Actual RPS including retries
  amplificationFactor: number; // How much traffic is amplified
  additionalLatencyMs: number; // Extra latency from retries
  retriesPerRequest: number; // Average retries per original request
  warnings: string[];
}

/**
 * Circuit breaker state
 */
export type CircuitState = 'closed' | 'open' | 'half_open';

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures to trip circuit
  successThreshold: number; // Number of successes to close circuit
  timeoutSeconds: number; // Time before attempting half-open
  halfOpenRequests: number; // Number of requests to allow in half-open state
}

/**
 * Circuit breaker effect
 */
export interface CircuitBreakerEffect {
  state: CircuitState;
  rejectedRequests: number; // Requests rejected by open circuit
  effectiveErrorRate: number; // Error rate including circuit breaker effects
  latencySavedMs: number; // Latency saved by fast-failing
  warnings: string[];
}

/**
 * Timeout configuration
 */
export interface TimeoutConfig {
  requestTimeoutMs: number; // Hard timeout per request
  connectTimeoutMs: number; // Connection establishment timeout
  idleTimeoutMs: number; // Idle connection timeout
}

/**
 * Timeout effect
 */
export interface TimeoutEffect {
  timedOutRequests: number; // Requests that hit timeout
  timeoutErrorRate: number; // Additional error rate from timeouts
  effectiveLatencyMs: number; // Latency capped by timeout
  warnings: string[];
}

/**
 * Queue/backpressure configuration
 */
export interface QueueConfig {
  maxQueueSize: number; // Maximum requests in queue
  maxWaitTimeMs: number; // Maximum time request waits in queue
  processingRateRps: number; // Rate at which queue is processed
}

/**
 * Queue effect
 */
export interface QueueEffect {
  queueDepth: number; // Current queue depth
  queueWaitTimeMs: number; // Average wait time in queue
  overflowRate: number; // Fraction of requests rejected due to overflow
  effectiveLatencyMs: number; // Latency including queue wait
  warnings: string[];
}

/**
 * Calculate retry effect on system load
 * Key insight: Retries amplify load on failing components
 */
export function calculateRetryEffect(
  baseRps: number,
  baseErrorRate: number,
  config: RetryConfig
): RetryEffect {
  const warnings: string[] = [];

  if (!isEnabled('ENABLE_RETRY_LOGIC')) {
    return {
      effectiveRps: baseRps,
      amplificationFactor: 1.0,
      additionalLatencyMs: 0,
      retriesPerRequest: 0,
      warnings: [],
    };
  }

  // Calculate expected retries per request
  // P(retry) = baseErrorRate * retryableErrorRate
  const retryProbability = baseErrorRate * config.retryableErrorRate;

  // Expected number of attempts = 1 + P(retry) + P(retry)^2 + ... up to maxRetries
  // This is a geometric series
  let expectedAttempts = 1;
  let currentProbability = retryProbability;

  for (let i = 0; i < config.maxRetries; i++) {
    expectedAttempts += currentProbability;
    currentProbability *= retryProbability; // Probability of needing another retry
  }

  const retriesPerRequest = expectedAttempts - 1;
  const amplificationFactor = expectedAttempts;

  // Effective RPS including retries
  const effectiveRps = baseRps * amplificationFactor;

  // Calculate additional latency from retries (exponential backoff)
  let additionalLatencyMs = 0;
  let delay = config.initialDelayMs;

  for (let i = 0; i < config.maxRetries; i++) {
    // Probability of reaching this retry attempt
    const reachProbability = Math.pow(retryProbability, i + 1);
    additionalLatencyMs += reachProbability * delay;

    // Apply backoff for next retry
    delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs);
  }

  // Apply jitter (increases average by jitterFactor/2)
  additionalLatencyMs *= 1 + config.jitterFactor / 2;

  verboseLog('Retry effect calculated', {
    baseRps,
    baseErrorRate,
    effectiveRps,
    amplificationFactor,
    retriesPerRequest,
    additionalLatencyMs,
  });

  // Generate warnings
  if (amplificationFactor > 2) {
    warnings.push(
      `High retry amplification (${amplificationFactor.toFixed(1)}x). Consider fixing root cause of errors.`
    );
  }

  if (effectiveRps > baseRps * 3) {
    warnings.push(
      `Retry storm risk: ${effectiveRps.toFixed(0)} effective RPS from ${baseRps} base RPS`
    );
  }

  return {
    effectiveRps,
    amplificationFactor,
    additionalLatencyMs,
    retriesPerRequest,
    warnings,
  };
}

/**
 * Calculate circuit breaker effect
 * Pessimistic: Circuit breaker adds complexity and can mask problems
 */
export function calculateCircuitBreakerEffect(
  errorRate: number,
  rps: number,
  config: CircuitBreakerConfig,
  currentTime: number
): CircuitBreakerEffect {
  const warnings: string[] = [];

  if (!isEnabled('ENABLE_CIRCUIT_BREAKER')) {
    return {
      state: 'closed',
      rejectedRequests: 0,
      effectiveErrorRate: errorRate,
      latencySavedMs: 0,
      warnings: [],
    };
  }

  // Determine circuit state based on error rate
  let state: CircuitState;
  let rejectedRequests = 0;
  let effectiveErrorRate = errorRate;
  let latencySavedMs = 0;

  // Calculate failures per second
  const failuresPerSecond = rps * errorRate;

  // If failures exceed threshold rate (failures/timeout period), circuit trips
  const failureRate = failuresPerSecond * config.timeoutSeconds;

  if (failureRate >= config.failureThreshold) {
    state = 'open';

    // In open state, most requests are rejected immediately
    rejectedRequests = rps * 0.95; // 95% rejected
    effectiveErrorRate = 0.95; // Fast-fail

    // Latency saved by not waiting for timeout
    latencySavedMs = 50; // Average latency saved per request

    warnings.push(`Circuit breaker OPEN: ${failureRate.toFixed(0)} failures in ${config.timeoutSeconds}s`);
  } else if (failureRate >= config.failureThreshold * 0.5) {
    state = 'half_open';

    // In half-open, only limited requests go through
    const letThroughRate = config.halfOpenRequests / rps;
    rejectedRequests = rps * Math.max(0, 1 - letThroughRate);
    effectiveErrorRate = errorRate * letThroughRate + (1 - letThroughRate);

    latencySavedMs = 25;

    warnings.push(`Circuit breaker HALF-OPEN: Testing with ${config.halfOpenRequests} requests`);
  } else {
    state = 'closed';
    rejectedRequests = 0;
    effectiveErrorRate = errorRate;
    latencySavedMs = 0;
  }

  verboseLog('Circuit breaker effect', {
    state,
    failureRate,
    rejectedRequests,
    effectiveErrorRate,
  });

  return {
    state,
    rejectedRequests,
    effectiveErrorRate,
    latencySavedMs,
    warnings,
  };
}

/**
 * Calculate timeout enforcement effect
 * Pessimistic: Timeouts cause errors and resource waste
 */
export function calculateTimeoutEffect(
  expectedLatencyMs: number,
  latencyVariance: number, // Standard deviation of latency
  rps: number,
  config: TimeoutConfig
): TimeoutEffect {
  const warnings: string[] = [];

  if (!isEnabled('ENABLE_TIMEOUT_ENFORCEMENT')) {
    return {
      timedOutRequests: 0,
      timeoutErrorRate: 0,
      effectiveLatencyMs: expectedLatencyMs,
      warnings: [],
    };
  }

  // Calculate probability of timeout
  // Assuming lognormal distribution of latencies
  // P(latency > timeout) using normal approximation
  const sigma = Math.sqrt(Math.log(1 + (latencyVariance / expectedLatencyMs) ** 2));
  const mu = Math.log(expectedLatencyMs) - sigma ** 2 / 2;

  // Z-score for timeout
  const timeoutLogValue = Math.log(config.requestTimeoutMs);
  const zScore = (timeoutLogValue - mu) / sigma;

  // Approximate tail probability (P(latency > timeout))
  // Using simple approximation for normal CDF tail
  let timeoutProbability: number;
  if (zScore > 3) {
    timeoutProbability = 0.001; // Very unlikely
  } else if (zScore < -3) {
    timeoutProbability = 0.999; // Almost certain
  } else {
    // Approximate using logistic function
    timeoutProbability = 1 / (1 + Math.exp(1.7 * zScore));
  }

  const timedOutRequests = rps * timeoutProbability;
  const timeoutErrorRate = timeoutProbability;

  // Effective latency is capped by timeout
  // But for timed-out requests, they still consumed resources
  const effectiveLatencyMs = Math.min(expectedLatencyMs, config.requestTimeoutMs);

  verboseLog('Timeout effect', {
    expectedLatencyMs,
    timeoutProbability,
    timedOutRequests,
    config,
  });

  if (timeoutProbability > 0.1) {
    warnings.push(
      `High timeout rate: ${(timeoutProbability * 100).toFixed(1)}% of requests timing out`
    );
  }

  if (config.requestTimeoutMs < expectedLatencyMs * 2) {
    warnings.push(
      `Timeout (${config.requestTimeoutMs}ms) is less than 2x expected latency (${expectedLatencyMs.toFixed(0)}ms)`
    );
  }

  return {
    timedOutRequests,
    timeoutErrorRate,
    effectiveLatencyMs,
    warnings,
  };
}

/**
 * Calculate queue/backpressure effect
 * Pessimistic: Queues add latency and can overflow
 */
export function calculateQueueEffect(incomingRps: number, config: QueueConfig): QueueEffect {
  const warnings: string[] = [];

  if (!isEnabled('ENABLE_BACKPRESSURE')) {
    return {
      queueDepth: 0,
      queueWaitTimeMs: 0,
      overflowRate: 0,
      effectiveLatencyMs: 0,
      warnings: [],
    };
  }

  // Little's Law: L = λW (queue depth = arrival rate * wait time)
  // Also: utilization ρ = λ/μ (arrival rate / service rate)
  const utilization = incomingRps / config.processingRateRps;

  let queueDepth: number;
  let queueWaitTimeMs: number;
  let overflowRate = 0;

  if (utilization >= 1) {
    // Queue is growing unboundedly - will overflow
    queueDepth = config.maxQueueSize;
    queueWaitTimeMs = config.maxWaitTimeMs;

    // Calculate overflow rate (requests that can't fit in queue)
    const overflowRps = incomingRps - config.processingRateRps;
    overflowRate = overflowRps / incomingRps;

    warnings.push(
      `Queue overflow: ${(overflowRate * 100).toFixed(1)}% of requests rejected (${overflowRps.toFixed(0)} RPS)`
    );
  } else {
    // M/M/1 queue model
    // Average queue length: ρ / (1 - ρ)
    queueDepth = utilization / (1 - utilization);

    // Average wait time: 1 / (μ - λ) in seconds
    const avgWaitSeconds = 1 / (config.processingRateRps - incomingRps);
    queueWaitTimeMs = avgWaitSeconds * 1000;

    // Check if queue exceeds max size
    if (queueDepth > config.maxQueueSize) {
      const overflow = queueDepth - config.maxQueueSize;
      overflowRate = overflow / queueDepth;
      queueDepth = config.maxQueueSize;

      warnings.push(`Queue at capacity: ${config.maxQueueSize} requests queued`);
    }

    // Check if wait time exceeds max
    if (queueWaitTimeMs > config.maxWaitTimeMs) {
      const timeoutFraction = (queueWaitTimeMs - config.maxWaitTimeMs) / queueWaitTimeMs;
      overflowRate = Math.max(overflowRate, timeoutFraction);
      queueWaitTimeMs = config.maxWaitTimeMs;

      warnings.push(`Queue wait time (${queueWaitTimeMs.toFixed(0)}ms) exceeds limit`);
    }
  }

  const effectiveLatencyMs = queueWaitTimeMs;

  verboseLog('Queue effect', {
    incomingRps,
    utilization,
    queueDepth,
    queueWaitTimeMs,
    overflowRate,
  });

  if (utilization > 0.8) {
    warnings.push(
      `High queue utilization: ${(utilization * 100).toFixed(1)}% - approaching capacity`
    );
  }

  return {
    queueDepth,
    queueWaitTimeMs,
    overflowRate,
    effectiveLatencyMs,
    warnings,
  };
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 100,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  jitterFactor: 0.1,
  retryableErrorRate: 0.5, // 50% of errors are retryable (e.g., 5xx but not 4xx)
};

/**
 * Default circuit breaker configuration
 */
export const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 10, // 10 failures to trip
  successThreshold: 5, // 5 successes to close
  timeoutSeconds: 60, // 1 minute timeout
  halfOpenRequests: 3, // Allow 3 test requests
};

/**
 * Default timeout configuration
 */
export const DEFAULT_TIMEOUT_CONFIG: TimeoutConfig = {
  requestTimeoutMs: 30000, // 30 second timeout
  connectTimeoutMs: 5000, // 5 second connect timeout
  idleTimeoutMs: 60000, // 1 minute idle timeout
};

/**
 * Default queue configuration
 */
export const DEFAULT_QUEUE_CONFIG: QueueConfig = {
  maxQueueSize: 1000, // Max 1000 requests in queue
  maxWaitTimeMs: 5000, // Max 5 second wait
  processingRateRps: 100, // Process 100 RPS
};

/**
 * Calculate combined reliability effect
 * Models the interaction between all reliability patterns
 */
export function calculateCombinedReliabilityEffect(
  baseRps: number,
  baseErrorRate: number,
  baseLatencyMs: number,
  latencyVariance: number,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG,
  circuitConfig: CircuitBreakerConfig = DEFAULT_CIRCUIT_BREAKER_CONFIG,
  timeoutConfig: TimeoutConfig = DEFAULT_TIMEOUT_CONFIG,
  queueConfig: QueueConfig = DEFAULT_QUEUE_CONFIG
): {
  effectiveRps: number;
  effectiveErrorRate: number;
  effectiveLatencyMs: number;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Step 1: Calculate retry amplification
  const retryEffect = calculateRetryEffect(baseRps, baseErrorRate, retryConfig);
  warnings.push(...retryEffect.warnings);

  // Step 2: Apply queue backpressure to amplified traffic
  const queueEffect = calculateQueueEffect(retryEffect.effectiveRps, queueConfig);
  warnings.push(...queueEffect.warnings);

  // Step 3: Calculate timeout effect
  const totalLatency = baseLatencyMs + retryEffect.additionalLatencyMs + queueEffect.queueWaitTimeMs;
  const timeoutEffect = calculateTimeoutEffect(totalLatency, latencyVariance, baseRps, timeoutConfig);
  warnings.push(...timeoutEffect.warnings);

  // Step 4: Apply circuit breaker based on combined error rate
  const combinedErrorRate = 1 - (1 - baseErrorRate) * (1 - queueEffect.overflowRate) * (1 - timeoutEffect.timeoutErrorRate);
  const circuitEffect = calculateCircuitBreakerEffect(combinedErrorRate, baseRps, circuitConfig, 0);
  warnings.push(...circuitEffect.warnings);

  // Final metrics
  const effectiveRps = retryEffect.effectiveRps * (1 - queueEffect.overflowRate);
  const effectiveErrorRate = circuitEffect.effectiveErrorRate;
  const effectiveLatencyMs = timeoutEffect.effectiveLatencyMs - circuitEffect.latencySavedMs;

  verboseLog('Combined reliability effect', {
    effectiveRps,
    effectiveErrorRate,
    effectiveLatencyMs,
    retryAmplification: retryEffect.amplificationFactor,
    circuitState: circuitEffect.state,
    queueUtilization: queueEffect.queueDepth / queueConfig.maxQueueSize,
  });

  return {
    effectiveRps,
    effectiveErrorRate,
    effectiveLatencyMs: Math.max(0, effectiveLatencyMs),
    warnings,
  };
}

/**
 * Estimate retry storm probability
 * High probability indicates risk of cascading failure
 */
export function estimateRetryStormProbability(
  baseRps: number,
  baseErrorRate: number,
  maxCapacityRps: number,
  config: RetryConfig
): number {
  const retryEffect = calculateRetryEffect(baseRps, baseErrorRate, config);

  if (retryEffect.effectiveRps <= maxCapacityRps) {
    return 0; // No storm risk
  }

  // Calculate how much over capacity
  const overloadFactor = retryEffect.effectiveRps / maxCapacityRps;

  // Storm probability increases with overload
  return Math.min(1, (overloadFactor - 1) * 2);
}

/**
 * Calculate graceful degradation thresholds
 * Returns recommended load shedding percentages
 */
export function calculateGracefulDegradation(
  currentRps: number,
  maxCapacityRps: number,
  errorRate: number
): {
  shouldShedLoad: boolean;
  shedPercentage: number;
  healthScore: number;
} {
  const utilization = currentRps / maxCapacityRps;
  const healthScore = (1 - errorRate) * (1 - Math.max(0, utilization - 1));

  let shouldShedLoad = false;
  let shedPercentage = 0;

  if (utilization > 0.9 || errorRate > 0.1) {
    shouldShedLoad = true;

    // Shed more load as conditions worsen
    if (utilization > 1.0) {
      shedPercentage = Math.min(0.5, (utilization - 1) * 2);
    } else if (errorRate > 0.2) {
      shedPercentage = errorRate * 0.5;
    } else {
      shedPercentage = 0.1;
    }
  }

  return {
    shouldShedLoad,
    shedPercentage,
    healthScore: Math.max(0, Math.min(1, healthScore)),
  };
}
