import { SystemGraph } from './graph';
import { TestResult } from './testCase';

/**
 * Coach/Navigator System Types
 * Provides contextual guidance and progression tracking
 */

/**
 * Message trigger conditions
 */
export type MessageTrigger =
  | { type: 'on_load' }
  | { type: 'on_first_visit' }
  | { type: 'after_test'; testIndex: number; result: 'pass' | 'fail' }
  | { type: 'all_tests_passed' }
  | { type: 'level_complete'; level: number }
  | { type: 'stuck'; attempts: number } // Same test failed N times
  | { type: 'bottleneck_detected'; component: string }
  | { type: 'validator_failed'; validatorName: string }
  | { type: 'component_added'; componentType: string }
  | { type: 'cost_exceeded'; maxCost: number }
  | { type: 'latency_exceeded'; maxLatency: number };

/**
 * Coach action types
 */
export type CoachAction =
  | { type: 'show_hint'; hintLevel: number } // Progressive hints
  | { type: 'highlight_component'; componentId: string }
  | { type: 'suggest_connection'; from: string; to: string }
  | { type: 'open_docs'; topic: string }
  | { type: 'show_solution'; solutionId: string }
  | { type: 'next_level' }
  | { type: 'next_problem'; problemId: string };

/**
 * Coach message definition
 */
export interface CoachMessage {
  trigger: MessageTrigger;
  message: string;
  messageType?: 'info' | 'hint' | 'warning' | 'success' | 'celebration';
  action?: CoachAction;
  icon?: string; // Emoji or icon name
  priority?: number; // Higher priority messages shown first
  showOnce?: boolean; // Only show this message once per session
}

/**
 * Conditional hint that unlocks based on attempts or time
 */
export interface ConditionalHint {
  condition: {
    minAttempts?: number;
    minTimeSeconds?: number;
    afterValidatorFails?: string[];
  };
  hint: string;
  hintLevel: number; // 1 = subtle, 2 = specific, 3 = very specific
}

/**
 * Coach configuration for a single level
 */
export interface LevelCoachConfig {
  level: number;
  title: string;
  goal: string; // Short description of level objective
  description?: string; // Longer explanation
  messages: CoachMessage[];
  unlockHints?: ConditionalHint[];
  estimatedTime?: string; // e.g., "5 minutes"
  learningObjectives?: string[];
}

/**
 * Problem coach configuration
 */
export interface ProblemCoachConfig {
  problemId: string;
  levelConfigs: Record<number, LevelCoachConfig>;
  celebrationMessages: Record<number, string>;
  nextProblemRecommendation?: string;
  archetype?: ProblemArchetype; // For pattern-based coaching
}

/**
 * Problem archetypes for pattern-based coaching
 */
export type ProblemArchetype =
  | 'url_shortener'
  | 'crud'
  | 'read_heavy'
  | 'write_heavy'
  | 'social_feed'
  | 'search'
  | 'messaging'
  | 'streaming'
  | 'transactions'
  | 'realtime'
  | 'analytics';

/**
 * Learning track definition
 */
export interface LearningTrack {
  id: string;
  name: string;
  description: string;
  icon?: string;
  problems: TrackProblem[];
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[]; // IDs of tracks that should be completed first
}

/**
 * Problem within a track
 */
export interface TrackProblem {
  problemId: string;
  order: number;
  levels: number;
  learningObjectives: string[];
  estimatedMinutes: number;
}

/**
 * User's progress on a specific problem
 */
export interface ProblemProgress {
  problemId: string;
  levelsCompleted: number[];
  currentLevel: number;
  lastAttempt: Date;
  totalAttempts: number;
  bestScore?: number; // 0-100 score
  timeSpent: number; // Seconds
  hintsUsed: number;
  solutionsViewed: string[];
}

/**
 * User's progress on a learning track
 */
export interface TrackProgress {
  trackId: string;
  problemsCompleted: string[];
  currentProblem: string | null;
  percentComplete: number;
  startedAt: Date;
  lastActive: Date;
}

/**
 * Complete user progress
 */
export interface UserProgress {
  userId: string;
  problemProgress: Record<string, ProblemProgress>;
  trackProgress: Record<string, TrackProgress>;
  totalProblemsCompleted: number;
  totalLevelsCompleted: number;
  totalTimeSpent: number; // Seconds
  achievements: Achievement[];
}

/**
 * Achievement/badge system
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

/**
 * Coach state for UI
 */
export interface CoachState {
  currentProblemId: string;
  currentLevel: number;
  activeMessages: CoachMessage[];
  availableHints: ConditionalHint[];
  levelProgress: {
    testsRun: number;
    testsPassed: number;
    attempts: number;
    timeSpent: number;
  };
  celebrationPending?: {
    level: number;
    message: string;
  };
}

/**
 * Context for evaluating coach triggers
 */
export interface CoachContext {
  systemGraph: SystemGraph;
  testResults: Map<number, TestResult>;
  currentLevel: number;
  attempts: number;
  timeSpent: number;
  bottlenecks: string[];
  failedValidators: string[];
  recentActions: CoachAction[];
}

/**
 * Coach pattern template for generating configs
 */
export interface CoachPattern {
  archetype: ProblemArchetype;
  defaultLevels: number;
  levelTemplates: Record<number, {
    title: string;
    goal: string;
    commonMessages: CoachMessage[];
    commonHints: ConditionalHint[];
  }>;
}

/**
 * Message template with placeholders
 */
export interface MessageTemplate {
  template: string;
  variables: Record<string, string | number>;
}

/**
 * Helper to create a message template
 */
export function createMessage(
  template: string,
  variables: Record<string, string | number>
): string {
  let message = template;
  Object.entries(variables).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{${key}}`, 'g'), String(value));
  });
  return message;
}

/**
 * Helper to evaluate if a trigger condition is met
 */
export function isTriggerMet(
  trigger: MessageTrigger,
  context: CoachContext
): boolean {
  switch (trigger.type) {
    case 'on_load':
      return context.attempts === 0;

    case 'after_test':
      const testResult = context.testResults.get(trigger.testIndex);
      if (!testResult) return false;
      return trigger.result === 'pass' ? testResult.passed : !testResult.passed;

    case 'all_tests_passed':
      return Array.from(context.testResults.values()).every(r => r.passed);

    case 'level_complete':
      return trigger.level === context.currentLevel &&
             Array.from(context.testResults.values()).every(r => r.passed);

    case 'stuck':
      return context.attempts >= trigger.attempts;

    case 'bottleneck_detected':
      return context.bottlenecks.includes(trigger.component);

    case 'validator_failed':
      return context.failedValidators.includes(trigger.validatorName);

    case 'component_added':
      return context.systemGraph.components.some(
        c => c.type === trigger.componentType
      );

    default:
      return false;
  }
}

/**
 * Helper to get active messages based on context
 */
export function getActiveMessages(
  config: LevelCoachConfig,
  context: CoachContext,
  shownMessages: Set<string> = new Set()
): CoachMessage[] {
  return config.messages
    .filter(msg => {
      // Skip if already shown and showOnce is true
      if (msg.showOnce && shownMessages.has(JSON.stringify(msg.trigger))) {
        return false;
      }
      // Check if trigger is met
      return isTriggerMet(msg.trigger, context);
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

/**
 * Helper to get available hints based on conditions
 */
export function getAvailableHints(
  config: LevelCoachConfig,
  context: CoachContext
): ConditionalHint[] {
  if (!config.unlockHints) return [];

  return config.unlockHints.filter(hint => {
    const { minAttempts, minTimeSeconds, afterValidatorFails } = hint.condition;

    // Check attempt requirement
    if (minAttempts && context.attempts < minAttempts) {
      return false;
    }

    // Check time requirement
    if (minTimeSeconds && context.timeSpent < minTimeSeconds) {
      return false;
    }

    // Check validator failure requirement
    if (afterValidatorFails && afterValidatorFails.length > 0) {
      const hasFailedValidator = afterValidatorFails.some(
        validator => context.failedValidators.includes(validator)
      );
      if (!hasFailedValidator) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => a.hintLevel - b.hintLevel); // Show simpler hints first
}