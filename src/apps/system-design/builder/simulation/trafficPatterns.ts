/**
 * Traffic Pattern Modeling Module (Phase 3.1)
 *
 * Provides realistic traffic patterns:
 * - Daily/weekly cycles (sine waves)
 * - Flash crowds and viral events
 * - Geographic distribution effects
 * - Gradual ramp-up scenarios
 */

import { isEnabled, verboseLog } from './featureFlags';

/**
 * Traffic pattern types
 */
export type TrafficPatternType =
  | 'constant' // Flat traffic
  | 'daily_cycle' // 24-hour sine wave
  | 'weekly_cycle' // 7-day pattern
  | 'flash_crowd' // Sudden spike (viral event)
  | 'gradual_ramp' // Linear increase
  | 'stepwise' // Step function increases
  | 'custom'; // Custom pattern

/**
 * Traffic pattern configuration
 */
export interface TrafficPatternConfig {
  type: TrafficPatternType;
  baseRps: number; // Baseline RPS
  peakRps?: number; // Maximum RPS (for patterns with peaks)
  valleyRps?: number; // Minimum RPS (for patterns with valleys)
  peakTimeHour?: number; // Hour of day for peak (0-23)
  flashCrowdStartSecond?: number; // When flash crowd starts
  flashCrowdDurationSeconds?: number; // How long flash crowd lasts
  rampUpDurationSeconds?: number; // Duration of ramp-up
  customPattern?: number[]; // Custom RPS values over time
}

/**
 * Traffic pattern result
 */
export interface TrafficAtTime {
  rps: number;
  readRps: number;
  writeRps: number;
  isSpike: boolean;
  patternPhase: string; // Description of current phase
}

/**
 * Calculate traffic at a specific time based on pattern
 */
export function calculateTrafficAtTime(
  currentTimeSeconds: number,
  config: TrafficPatternConfig,
  readRatio: number = 0.9
): TrafficAtTime {
  if (!isEnabled('ENABLE_TRAFFIC_PATTERNS')) {
    // Legacy behavior - constant traffic
    const readRps = config.baseRps * readRatio;
    const writeRps = config.baseRps * (1 - readRatio);
    return {
      rps: config.baseRps,
      readRps,
      writeRps,
      isSpike: false,
      patternPhase: 'constant',
    };
  }

  let rps: number;
  let isSpike = false;
  let patternPhase: string;

  switch (config.type) {
    case 'constant':
      rps = config.baseRps;
      patternPhase = 'constant';
      break;

    case 'daily_cycle':
      const result = calculateDailyCycle(currentTimeSeconds, config);
      rps = result.rps;
      patternPhase = result.phase;
      break;

    case 'weekly_cycle':
      const weeklyResult = calculateWeeklyCycle(currentTimeSeconds, config);
      rps = weeklyResult.rps;
      patternPhase = weeklyResult.phase;
      break;

    case 'flash_crowd':
      const flashResult = calculateFlashCrowd(currentTimeSeconds, config);
      rps = flashResult.rps;
      isSpike = flashResult.isSpike;
      patternPhase = flashResult.phase;
      break;

    case 'gradual_ramp':
      const rampResult = calculateGradualRamp(currentTimeSeconds, config);
      rps = rampResult.rps;
      patternPhase = rampResult.phase;
      break;

    case 'stepwise':
      const stepResult = calculateStepwise(currentTimeSeconds, config);
      rps = stepResult.rps;
      patternPhase = stepResult.phase;
      break;

    case 'custom':
      const customResult = calculateCustomPattern(currentTimeSeconds, config);
      rps = customResult.rps;
      patternPhase = 'custom';
      break;

    default:
      rps = config.baseRps;
      patternPhase = 'unknown';
  }

  const readRps = rps * readRatio;
  const writeRps = rps * (1 - readRatio);

  verboseLog('Traffic pattern calculated', {
    currentTimeSeconds,
    patternType: config.type,
    rps,
    patternPhase,
    isSpike,
  });

  return {
    rps,
    readRps,
    writeRps,
    isSpike,
    patternPhase,
  };
}

/**
 * Calculate daily cycle (24-hour pattern)
 * Peak typically at 2-4 PM, valley at 3-5 AM
 */
function calculateDailyCycle(
  currentTimeSeconds: number,
  config: TrafficPatternConfig
): { rps: number; phase: string } {
  const peakHour = config.peakTimeHour ?? 15; // 3 PM default
  const peakRps = config.peakRps ?? config.baseRps * 2;
  const valleyRps = config.valleyRps ?? config.baseRps * 0.3;

  // Convert seconds to hour of day
  const hourOfDay = (currentTimeSeconds / 3600) % 24;

  // Sine wave centered on peak hour
  const hourDiff = hourOfDay - peakHour;
  const radians = (hourDiff / 24) * 2 * Math.PI;
  const sineValue = Math.cos(radians); // 1 at peak, -1 at valley

  // Map sine to RPS range
  const amplitude = (peakRps - valleyRps) / 2;
  const midpoint = (peakRps + valleyRps) / 2;
  const rps = midpoint + amplitude * sineValue;

  // Determine phase
  let phase: string;
  if (sineValue > 0.5) {
    phase = 'peak_hours';
  } else if (sineValue < -0.5) {
    phase = 'off_peak';
  } else if (hourDiff > 0) {
    phase = 'declining';
  } else {
    phase = 'rising';
  }

  return { rps, phase };
}

/**
 * Calculate weekly cycle
 * Weekdays higher than weekends
 */
function calculateWeeklyCycle(
  currentTimeSeconds: number,
  config: TrafficPatternConfig
): { rps: number; phase: string } {
  const dayOfWeek = Math.floor(currentTimeSeconds / 86400) % 7; // 0 = Monday
  const peakRps = config.peakRps ?? config.baseRps * 1.5;
  const valleyRps = config.valleyRps ?? config.baseRps * 0.6;

  let rps: number;
  let phase: string;

  if (dayOfWeek < 5) {
    // Weekday
    rps = peakRps;
    phase = 'weekday';
  } else {
    // Weekend
    rps = valleyRps;
    phase = 'weekend';
  }

  // Add daily variation on top
  const dailyResult = calculateDailyCycle(currentTimeSeconds, {
    ...config,
    baseRps: rps,
    peakRps: rps * 1.3,
    valleyRps: rps * 0.5,
  });

  return {
    rps: dailyResult.rps,
    phase: `${phase}_${dailyResult.phase}`,
  };
}

/**
 * Calculate flash crowd (viral event)
 * Sudden spike in traffic
 */
function calculateFlashCrowd(
  currentTimeSeconds: number,
  config: TrafficPatternConfig
): { rps: number; isSpike: boolean; phase: string } {
  const startTime = config.flashCrowdStartSecond ?? 300; // Default: 5 minutes in
  const duration = config.flashCrowdDurationSeconds ?? 600; // Default: 10 minute spike
  const peakRps = config.peakRps ?? config.baseRps * 10; // 10x spike

  if (currentTimeSeconds < startTime) {
    return { rps: config.baseRps, isSpike: false, phase: 'pre_spike' };
  }

  const timeIntoSpike = currentTimeSeconds - startTime;

  if (timeIntoSpike > duration) {
    // After spike - gradual return to normal
    const recoveryTime = timeIntoSpike - duration;
    const recoveryFactor = Math.exp(-recoveryTime / 300); // Exponential decay
    const rps = config.baseRps + (peakRps - config.baseRps) * recoveryFactor;
    return { rps, isSpike: false, phase: 'recovery' };
  }

  // During spike - quick ramp up, sustain, then decay
  const spikePhase = timeIntoSpike / duration;

  let rps: number;
  let phase: string;

  if (spikePhase < 0.1) {
    // Rapid ramp up (10% of duration)
    const rampProgress = spikePhase / 0.1;
    rps = config.baseRps + (peakRps - config.baseRps) * rampProgress;
    phase = 'spike_ramp_up';
  } else if (spikePhase < 0.7) {
    // Sustain (60% of duration)
    rps = peakRps;
    phase = 'spike_peak';
  } else {
    // Gradual decay (30% of duration)
    const decayProgress = (spikePhase - 0.7) / 0.3;
    rps = peakRps - (peakRps - config.baseRps * 2) * decayProgress;
    phase = 'spike_decay';
  }

  return { rps, isSpike: true, phase };
}

/**
 * Calculate gradual ramp
 * Linear increase over time
 */
function calculateGradualRamp(
  currentTimeSeconds: number,
  config: TrafficPatternConfig
): { rps: number; phase: string } {
  const duration = config.rampUpDurationSeconds ?? 3600; // Default: 1 hour
  const peakRps = config.peakRps ?? config.baseRps * 3;

  if (currentTimeSeconds >= duration) {
    return { rps: peakRps, phase: 'peak' };
  }

  const progress = currentTimeSeconds / duration;
  const rps = config.baseRps + (peakRps - config.baseRps) * progress;

  return { rps, phase: `ramp_${Math.floor(progress * 100)}%` };
}

/**
 * Calculate stepwise increase
 * Discrete steps every interval
 */
function calculateStepwise(
  currentTimeSeconds: number,
  config: TrafficPatternConfig
): { rps: number; phase: string } {
  const stepDuration = 600; // 10 minutes per step
  const peakRps = config.peakRps ?? config.baseRps * 4;
  const numSteps = 4;

  const currentStep = Math.min(Math.floor(currentTimeSeconds / stepDuration), numSteps);
  const rpsPerStep = (peakRps - config.baseRps) / numSteps;
  const rps = config.baseRps + rpsPerStep * currentStep;

  return { rps, phase: `step_${currentStep}` };
}

/**
 * Calculate custom pattern from array
 */
function calculateCustomPattern(
  currentTimeSeconds: number,
  config: TrafficPatternConfig
): { rps: number } {
  const pattern = config.customPattern ?? [config.baseRps];
  const index = Math.floor(currentTimeSeconds / 60) % pattern.length; // 1 minute resolution

  return { rps: pattern[index] };
}

/**
 * Generate traffic spike events
 * Returns list of spike times and magnitudes
 */
export function generateSpikeEvents(
  durationSeconds: number,
  spikeFrequency: number = 0.001, // Spikes per second
  avgSpikeMagnitude: number = 3 // Average spike multiplier
): Array<{ timeSeconds: number; magnitude: number; durationSeconds: number }> {
  const spikes: Array<{ timeSeconds: number; magnitude: number; durationSeconds: number }> = [];

  // Poisson process for spike occurrence
  let currentTime = 0;
  while (currentTime < durationSeconds) {
    // Exponential inter-arrival time
    const interArrival = -Math.log(Math.random()) / spikeFrequency;
    currentTime += interArrival;

    if (currentTime < durationSeconds) {
      // Spike magnitude follows power law
      const magnitude = avgSpikeMagnitude * (0.5 + 1.5 * Math.random());
      const duration = 60 + Math.random() * 540; // 1-10 minutes

      spikes.push({
        timeSeconds: currentTime,
        magnitude,
        durationSeconds: duration,
      });
    }
  }

  return spikes;
}

/**
 * Calculate geographic traffic distribution
 * Traffic varies by region based on time zones
 */
export function calculateGeoDistribution(
  totalRps: number,
  currentTimeSeconds: number
): Map<string, number> {
  const regions = new Map<string, number>();

  // Convert to hours
  const utcHour = (currentTimeSeconds / 3600) % 24;

  // US East (UTC-5)
  const usEastHour = (utcHour - 5 + 24) % 24;
  const usEastTraffic = calculateRegionTraffic(usEastHour);

  // US West (UTC-8)
  const usWestHour = (utcHour - 8 + 24) % 24;
  const usWestTraffic = calculateRegionTraffic(usWestHour);

  // Europe (UTC+1)
  const europeHour = (utcHour + 1) % 24;
  const europeTraffic = calculateRegionTraffic(europeHour);

  // Asia (UTC+8)
  const asiaHour = (utcHour + 8) % 24;
  const asiaTraffic = calculateRegionTraffic(asiaHour);

  // Normalize to total
  const totalWeight = usEastTraffic + usWestTraffic + europeTraffic + asiaTraffic;

  regions.set('us-east', (usEastTraffic / totalWeight) * totalRps);
  regions.set('us-west', (usWestTraffic / totalWeight) * totalRps);
  regions.set('europe', (europeTraffic / totalWeight) * totalRps);
  regions.set('asia', (asiaTraffic / totalWeight) * totalRps);

  return regions;
}

/**
 * Calculate regional traffic weight based on local hour
 */
function calculateRegionTraffic(localHour: number): number {
  // Peak at 2 PM local time, valley at 3 AM
  const peakHour = 14;
  const hourDiff = localHour - peakHour;
  const radians = (hourDiff / 24) * 2 * Math.PI;

  return 0.5 + 0.5 * Math.cos(radians);
}
