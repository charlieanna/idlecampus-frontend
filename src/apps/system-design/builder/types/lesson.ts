/**
 * DDIA Interactive Lesson System
 *
 * Teaches system design concepts through live traffic simulations
 * showing problems, fixes, and trade-offs in action.
 */

import { SystemGraph } from './graph';
import { ComponentNode } from './component';

/**
 * DDIA Chapter References
 */
export interface DDIAReference {
  chapter: number;
  title: string;
  section?: string;
  pageRange?: string;
  keyQuote?: string;
}

/**
 * Trade-off option when making architectural decisions
 */
export interface TradeoffOption {
  id: string;
  title: string;
  description: string;

  // Changes to apply to the system graph
  graphChanges: {
    addComponents?: Partial<ComponentNode>[];
    removeComponentIds?: string[];
    updateConfigs?: Record<string, any>; // componentId -> config changes
  };

  // Expected results after applying this option
  expectedMetrics: {
    p99Latency?: string; // "50ms", "200ms"
    throughput?: string; // "10K RPS"
    consistency?: string; // "Strong", "Eventual"
    availability?: string; // "99.99%"
    cost?: string; // "$500/month"
  };

  // When this option is good/bad
  goodFor: string[]; // ["Banking", "Inventory management"]
  badFor: string[]; // ["Social feeds", "Analytics dashboards"]

  // DDIA concept this demonstrates
  ddiaConceptTag: string; // "eventual_consistency", "strong_consistency"
}

/**
 * Simulation step showing traffic running through system
 */
export interface SimulationStep {
  description: string;

  // Traffic configuration
  traffic: {
    totalRps: number;
    readRatio: number; // 0-1
    duration?: number; // seconds
  };

  // Expected outcome
  expectedOutcome: {
    type: 'success' | 'degraded' | 'failure';
    metric: string; // "P99 < 100ms" or "DB utilization > 90%"
    explanation: string;
  };
}

/**
 * Break scenario that demonstrates a trade-off
 */
export interface BreakScenario {
  id: string;
  name: string;
  description: string;

  // What to simulate
  type:
    | 'replication_lag' // Write then read returns stale data
    | 'cache_stampede' // Cache expires, all requests hit DB
    | 'cache_stale_read' // Cached data is outdated
    | 'db_saturation' // DB at 100% utilization
    | 'hot_partition' // One shard overloaded
    | 'cross_shard_query' // Query needs multiple shards
    | 'network_partition' // Network split between nodes
    | 'leader_failure' // Master DB goes down
    | 'split_brain' // Two leaders after partition
    | 'dirty_read' // See uncommitted transaction
    | 'phantom_read' // New rows appear mid-transaction
    | 'write_conflict' // Concurrent writes to same record
    | 'message_loss' // Message queue loses message
    | 'duplicate_processing'; // Same message processed twice

  // What the user sees
  visualization: {
    highlightComponent?: string; // ID of component with issue
    errorMessage: string; // "Stale read detected!"
    metricAffected: string; // "Data consistency"
    severity: 'warning' | 'error' | 'critical';
  };

  // Teaching moment
  lesson: string; // "This is the cost of eventual consistency (DDIA Ch.5)"
}

/**
 * Individual step in a lesson
 */
export interface LessonStep {
  id: string;
  type: 'theory' | 'demo' | 'simulate' | 'break' | 'decision' | 'summary';
  title: string;

  // For 'theory' - explain concept
  theoryContent?: {
    explanation: string; // Markdown content
    keyPoints: string[]; // Bullet points
    diagram?: string; // Optional diagram URL or component
    ddiaReference?: DDIAReference;
  };

  // For 'demo' - show initial system state
  demoContent?: {
    description: string;
    initialGraph: SystemGraph;
    highlightComponents?: string[]; // IDs to highlight
  };

  // For 'simulate' - run traffic and show results
  simulateContent?: {
    description: string;
    steps: SimulationStep[];
    showMetrics: string[]; // ["p99Latency", "dbUtilization", "cacheHitRate"]
  };

  // For 'break' - demonstrate what goes wrong
  breakContent?: {
    description: string;
    scenario: BreakScenario;
    questionToUser: string; // "Why did this happen?"
    correctAnswer: string;
  };

  // For 'decision' - user picks trade-off
  decisionContent?: {
    question: string; // "Which consistency model should you choose?"
    context: string; // "You're building a shopping cart..."
    options: TradeoffOption[];
    hint?: string;
    explanation?: string; // Show after decision
  };

  // For 'summary' - recap what was learned
  summaryContent?: {
    conceptLearned: string;
    keyTakeaways: string[];
    ddiaReferences: DDIAReference[];
    nextLesson?: string; // ID of next lesson
  };
}

/**
 * Complete lesson teaching a DDIA concept
 */
export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  description: string;

  // Metadata
  estimatedTime: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  // DDIA mapping
  ddiaChapter: number;
  ddiaSection: string;
  ddiaReferences: DDIAReference[];

  // Categorization
  module: string; // "replication", "partitioning", "transactions"
  conceptTags: string[]; // ["leader-follower", "replication-lag", "failover"]

  // Prerequisites
  prerequisites?: string[]; // IDs of lessons that should be completed first

  // The actual lesson content
  steps: LessonStep[];

  // Learning outcomes
  learningObjectives: string[];
  tradeoffsExplored: string[]; // ["Consistency vs Availability", "Latency vs Durability"]

  // Related challenges
  relatedChallenges?: string[]; // Challenge IDs that use these concepts
}

/**
 * Module grouping multiple lessons
 */
export interface LessonModule {
  id: string;
  title: string;
  description: string;
  ddiaPartReference: string; // "Part II: Distributed Data"
  lessons: string[]; // Lesson IDs in order
  estimatedTotalTime: number; // minutes
  iconEmoji: string;
}

/**
 * User's progress through lessons
 */
export interface LessonProgress {
  lessonId: string;
  startedAt: string;
  completedAt?: string;
  currentStepIndex: number;
  decisionsHistory: Array<{
    stepId: string;
    chosenOptionId: string;
    timestamp: string;
  }>;
  conceptsMastered: string[];
}

/**
 * Catalog of all available lessons
 */
export interface LessonCatalog {
  modules: LessonModule[];
  lessons: Lesson[];
  totalEstimatedTime: number;
  conceptsCovered: string[];
}
