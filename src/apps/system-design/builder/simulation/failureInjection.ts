/**
 * Failure Injection Module (Phase 3.3)
 *
 * Provides chaos engineering scenarios:
 * - Component failures (crash, slow, error)
 * - Network partitions
 * - Cascading failures
 * - Recovery patterns
 */

import { isEnabled, verboseLog } from './featureFlags';

/**
 * Failure types
 */
export type FailureType =
  | 'crash' // Component completely down
  | 'slow' // High latency
  | 'error_rate' // Increased error rate
  | 'partial' // Partial availability
  | 'network_partition' // Network isolation
  | 'resource_exhaustion'; // CPU/memory exhaustion

/**
 * Failure injection configuration
 */
export interface FailureInjectionConfig {
  type: FailureType;
  targetComponents: string[]; // Component IDs to fail
  startTimeSeconds: number;
  durationSeconds: number;
  severity: number; // 0-1, where 1 is complete failure
  cascading?: boolean; // Does failure spread to dependent components?
  recoveryPattern?: 'instant' | 'gradual' | 'flapping';
}

/**
 * Failure effect on a component
 */
export interface FailureEffect {
  latencyMultiplier: number; // Multiply base latency
  errorRateIncrease: number; // Add to error rate
  availabilityFactor: number; // Reduce capacity (0 = down, 1 = full)
  isAffected: boolean;
  failureDescription: string;
}

/**
 * Cascading failure state
 */
export interface CascadeState {
  failedComponents: Set<string>;
  affectedComponents: Set<string>;
  cascadeDepth: number;
  recoveryProgress: Map<string, number>; // Component -> recovery %
}

/**
 * Calculate failure effect on a component at given time
 */
export function calculateFailureEffect(
  componentId: string,
  currentTimeSeconds: number,
  injections: FailureInjectionConfig[]
): FailureEffect {
  if (!isEnabled('ENABLE_FAILURE_INJECTION')) {
    return {
      latencyMultiplier: 1.0,
      errorRateIncrease: 0,
      availabilityFactor: 1.0,
      isAffected: false,
      failureDescription: '',
    };
  }

  // Check each injection
  for (const injection of injections) {
    if (!injection.targetComponents.includes(componentId)) {
      continue;
    }

    const effect = getFailureEffectAtTime(injection, currentTimeSeconds);
    if (effect.isAffected) {
      verboseLog('Failure effect applied', {
        componentId,
        failureType: injection.type,
        effect,
      });
      return effect;
    }
  }

  return {
    latencyMultiplier: 1.0,
    errorRateIncrease: 0,
    availabilityFactor: 1.0,
    isAffected: false,
    failureDescription: '',
  };
}

/**
 * Get failure effect at specific time
 */
function getFailureEffectAtTime(
  config: FailureInjectionConfig,
  currentTimeSeconds: number
): FailureEffect {
  const { startTimeSeconds, durationSeconds, severity, type, recoveryPattern = 'instant' } = config;

  // Before failure starts
  if (currentTimeSeconds < startTimeSeconds) {
    return createNoEffect();
  }

  // After failure ends
  const endTime = startTimeSeconds + durationSeconds;
  if (currentTimeSeconds > endTime) {
    // Check recovery pattern
    const recoveryTime = currentTimeSeconds - endTime;
    return applyRecoveryPattern(type, severity, recoveryTime, recoveryPattern);
  }

  // During failure
  const timeIntoFailure = currentTimeSeconds - startTimeSeconds;
  const failureProgress = timeIntoFailure / durationSeconds;

  return applyFailureType(type, severity, failureProgress);
}

/**
 * Apply specific failure type
 */
function applyFailureType(
  type: FailureType,
  severity: number,
  progress: number
): FailureEffect {
  switch (type) {
    case 'crash':
      return {
        latencyMultiplier: Infinity,
        errorRateIncrease: 1.0,
        availabilityFactor: 0,
        isAffected: true,
        failureDescription: 'Component crashed - not responding',
      };

    case 'slow':
      // Latency increases with severity
      const slowMultiplier = 1 + severity * 20; // Up to 21x slower
      return {
        latencyMultiplier: slowMultiplier,
        errorRateIncrease: severity * 0.1, // Some timeouts
        availabilityFactor: 1.0,
        isAffected: true,
        failureDescription: `High latency (${slowMultiplier.toFixed(1)}x normal)`,
      };

    case 'error_rate':
      return {
        latencyMultiplier: 1.0,
        errorRateIncrease: severity * 0.5, // Up to 50% error rate increase
        availabilityFactor: 1.0,
        isAffected: true,
        failureDescription: `Elevated error rate (+${(severity * 50).toFixed(0)}%)`,
      };

    case 'partial':
      // Only some requests go through
      const availability = 1 - severity;
      return {
        latencyMultiplier: 1.5, // Slight slowdown
        errorRateIncrease: severity * 0.3,
        availabilityFactor: availability,
        isAffected: true,
        failureDescription: `Partial availability (${(availability * 100).toFixed(0)}% capacity)`,
      };

    case 'network_partition':
      return {
        latencyMultiplier: Infinity,
        errorRateIncrease: 1.0,
        availabilityFactor: 0,
        isAffected: true,
        failureDescription: 'Network partition - component isolated',
      };

    case 'resource_exhaustion':
      // CPU/memory pressure causes slowdown and errors
      const exhaustionMultiplier = 1 + severity * 10;
      return {
        latencyMultiplier: exhaustionMultiplier,
        errorRateIncrease: severity * 0.4,
        availabilityFactor: 1 - severity * 0.5,
        isAffected: true,
        failureDescription: `Resource exhaustion (${(severity * 100).toFixed(0)}% severity)`,
      };

    default:
      return createNoEffect();
  }
}

/**
 * Apply recovery pattern after failure ends
 */
function applyRecoveryPattern(
  type: FailureType,
  originalSeverity: number,
  recoveryTimeSeconds: number,
  pattern: 'instant' | 'gradual' | 'flapping'
): FailureEffect {
  switch (pattern) {
    case 'instant':
      return createNoEffect();

    case 'gradual':
      // Exponential recovery (half life = 60 seconds)
      const recoveryFactor = Math.exp(-recoveryTimeSeconds / 60);
      if (recoveryFactor < 0.05) {
        return createNoEffect();
      }

      const reducedSeverity = originalSeverity * recoveryFactor;
      return applyFailureType(type, reducedSeverity, 1.0);

    case 'flapping':
      // Oscillate between healthy and failed
      const period = 30; // 30 second cycles
      const phase = (recoveryTimeSeconds % period) / period;
      const isInFailedPhase = phase < 0.3; // 30% of time in failed state

      if (isInFailedPhase) {
        return applyFailureType(type, originalSeverity * 0.5, 1.0);
      }
      return createNoEffect();

    default:
      return createNoEffect();
  }
}

/**
 * Create no-effect result
 */
function createNoEffect(): FailureEffect {
  return {
    latencyMultiplier: 1.0,
    errorRateIncrease: 0,
    availabilityFactor: 1.0,
    isAffected: false,
    failureDescription: '',
  };
}

/**
 * Calculate cascading failure spread
 * Returns set of components affected by cascade
 */
export function calculateCascadingFailure(
  initialFailures: string[],
  dependencies: Map<string, string[]>, // Component -> depends on
  cascadeThreshold: number = 0.5 // Error rate threshold to cascade
): CascadeState {
  const failedComponents = new Set<string>(initialFailures);
  const affectedComponents = new Set<string>();
  const recoveryProgress = new Map<string, number>();

  let cascadeDepth = 0;
  let changed = true;

  // Iterate until no more cascades
  while (changed && cascadeDepth < 10) {
    changed = false;
    cascadeDepth++;

    for (const [component, deps] of dependencies.entries()) {
      if (failedComponents.has(component)) {
        continue; // Already failed
      }

      // Check if any dependency has failed
      const failedDeps = deps.filter((d) => failedComponents.has(d));
      const failureRatio = failedDeps.length / deps.length;

      if (failureRatio >= cascadeThreshold) {
        failedComponents.add(component);
        affectedComponents.add(component);
        changed = true;

        verboseLog('Cascading failure', {
          component,
          failedDependencies: failedDeps,
          cascadeDepth,
        });
      }
    }
  }

  // Initialize recovery progress
  for (const comp of failedComponents) {
    recoveryProgress.set(comp, 0);
  }

  return {
    failedComponents,
    affectedComponents,
    cascadeDepth,
    recoveryProgress,
  };
}

/**
 * Generate chaos experiment scenarios
 */
export function generateChaosScenarios(
  componentIds: string[],
  durationSeconds: number
): FailureInjectionConfig[] {
  const scenarios: FailureInjectionConfig[] = [];

  // Scenario 1: Single component crash
  if (componentIds.length > 0) {
    scenarios.push({
      type: 'crash',
      targetComponents: [componentIds[0]],
      startTimeSeconds: durationSeconds * 0.25,
      durationSeconds: 60,
      severity: 1.0,
      recoveryPattern: 'instant',
    });
  }

  // Scenario 2: Slow database
  const dbComponents = componentIds.filter(
    (id) => id.includes('db') || id.includes('postgres')
  );
  if (dbComponents.length > 0) {
    scenarios.push({
      type: 'slow',
      targetComponents: dbComponents,
      startTimeSeconds: durationSeconds * 0.5,
      durationSeconds: 120,
      severity: 0.7,
      recoveryPattern: 'gradual',
    });
  }

  // Scenario 3: Network partition
  if (componentIds.length >= 2) {
    scenarios.push({
      type: 'network_partition',
      targetComponents: [componentIds[componentIds.length - 1]],
      startTimeSeconds: durationSeconds * 0.75,
      durationSeconds: 30,
      severity: 1.0,
      recoveryPattern: 'flapping',
    });
  }

  return scenarios;
}

/**
 * Calculate blast radius of a failure
 * Returns set of all potentially affected components
 */
export function calculateBlastRadius(
  failedComponent: string,
  dependencies: Map<string, string[]>,
  reverseDependencies: Map<string, string[]>
): Set<string> {
  const blastRadius = new Set<string>([failedComponent]);
  const queue = [failedComponent];

  // BFS to find all dependent components
  while (queue.length > 0) {
    const current = queue.shift()!;
    const dependents = reverseDependencies.get(current) || [];

    for (const dependent of dependents) {
      if (!blastRadius.has(dependent)) {
        blastRadius.add(dependent);
        queue.push(dependent);
      }
    }
  }

  return blastRadius;
}

/**
 * Estimate Mean Time To Recovery (MTTR)
 */
export function estimateMTTR(
  failureType: FailureType,
  severity: number,
  hasAutomaticRecovery: boolean = false
): number {
  let baseMTTRSeconds: number;

  switch (failureType) {
    case 'crash':
      baseMTTRSeconds = hasAutomaticRecovery ? 60 : 600; // 1 min auto, 10 min manual
      break;
    case 'slow':
      baseMTTRSeconds = hasAutomaticRecovery ? 120 : 300;
      break;
    case 'error_rate':
      baseMTTRSeconds = hasAutomaticRecovery ? 180 : 900;
      break;
    case 'network_partition':
      baseMTTRSeconds = 300; // Usually requires manual intervention
      break;
    case 'resource_exhaustion':
      baseMTTRSeconds = hasAutomaticRecovery ? 30 : 180;
      break;
    default:
      baseMTTRSeconds = 300;
  }

  // Higher severity = longer recovery
  return baseMTTRSeconds * (1 + severity);
}

/**
 * Calculate availability impact of failures
 * Returns overall system availability percentage
 */
export function calculateAvailabilityImpact(
  failures: FailureInjectionConfig[],
  totalDurationSeconds: number
): number {
  let totalDowntimeSeconds = 0;

  for (const failure of failures) {
    const downtimeFactor = failure.type === 'crash' || failure.type === 'network_partition' ? 1.0 : failure.severity * 0.5;

    totalDowntimeSeconds += failure.durationSeconds * downtimeFactor;
  }

  const availability = 1 - totalDowntimeSeconds / totalDurationSeconds;
  return Math.max(0, Math.min(1, availability));
}
