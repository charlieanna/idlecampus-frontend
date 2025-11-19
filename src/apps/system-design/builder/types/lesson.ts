// Types for System Design Lessons
// Extends the multi-stage lesson system with system design specific features

import { MultiStageLesson, MultiStage, BaseStage } from '../../../../types/multiStage';
import { SystemGraph } from './graph';
import { ComponentNode } from './component';

/**
 * System Design specific stage types
 */
export type SystemDesignStageType =
  | 'canvas-practice'      // Interactive canvas practice
  | 'traffic-simulation'   // Traffic flow visualization
  | 'cost-analysis';       // Cost calculation and optimization

/**
 * Extended stage type for system design lessons
 */
export type ExtendedStageType = MultiStage['type'] | SystemDesignStageType;

/**
 * System Design Concept
 */
export interface SystemDesignConcept {
  id: string;
  name: string;
  type: 'component' | 'pattern' | 'technique' | 'metric';
  difficulty: number; // 1-5
  description?: string;
}

/**
 * Component configuration for practice exercises
 */
export interface ComponentConfig {
  type: string;
  required: boolean;
  config?: Record<string, any>;
}

/**
 * Canvas Practice Stage - Interactive canvas practice within lessons
 */
export interface CanvasPracticeStage extends BaseStage {
  type: 'canvas-practice';
  scenario: {
    description: string;
    requirements: string[];
    constraints?: string[];
  };
  initialCanvas?: SystemGraph;
  targetMetrics?: {
    minRPS?: number;
    maxLatency?: number;
    maxCost?: number;
    minAvailability?: number;
  };
  hints: string[];
  solution: SystemGraph;
  solutionExplanation: string;
  steps?: PracticeStep[];
}

/**
 * Practice step for guided canvas practice
 */
export interface PracticeStep {
  instruction: string;
  expectedAction: 'add-component' | 'add-connection' | 'configure' | 'validate';
  validation: (canvas: SystemGraph) => boolean;
  hint?: string;
  componentType?: string;
  connectionFrom?: string;
  connectionTo?: string;
}

/**
 * Traffic Simulation Stage - Visualize traffic flow through system
 */
export interface TrafficSimulationStage extends BaseStage {
  type: 'traffic-simulation';
  systemGraph: SystemGraph;
  traffic: {
    rps: number;
    readRatio: number;
    duration: number; // seconds
  };
  showMetrics: {
    latency: boolean;
    throughput: boolean;
    errorRate: boolean;
    bottlenecks: boolean;
  };
  explanation?: string;
}

/**
 * Cost Analysis Stage - Analyze and optimize system costs
 */
export interface CostAnalysisStage extends BaseStage {
  type: 'cost-analysis';
  systemGraph: SystemGraph;
  traffic: {
    rps: number;
    readRatio: number;
  };
  budget?: number;
  showBreakdown: boolean;
  optimizationHints?: string[];
}

/**
 * Extended stage union type
 */
export type SystemDesignStage =
  | MultiStage
  | CanvasPracticeStage
  | TrafficSimulationStage
  | CostAnalysisStage;

/**
 * System Design Lesson - Extends MultiStageLesson with SD-specific features
 */
export interface SystemDesignLesson extends MultiStageLesson {
  // System Design specific metadata
  category: 'fundamentals' | 'components' | 'patterns' | 'scaling' | 'problem-solving';
  
  // Related challenges this lesson helps with
  relatedChallenges?: string[]; // Challenge IDs
  
  // Components to practice with
  practiceComponents?: ComponentConfig[];
  
  // Learning path
  nextLessons?: string[]; // Suggested next lesson slugs
  
  // Concepts covered in this lesson
  conceptsCovered?: SystemDesignConcept[];
  
  // Override stages to use extended stage types
  stages: SystemDesignStage[];
}

/**
 * Lesson category metadata
 */
export interface LessonCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
}

/**
 * Lesson progress specific to system design
 */
export interface SystemDesignLessonProgress {
  lessonId: string;
  userId?: string;
  currentStageIndex: number;
  completedStages: Set<string>;
  stageScores: Map<string, number>;
  canvasPracticeAttempts: Map<string, number>; // Stage ID -> attempts
  startedAt?: Date;
  lastAccessedAt?: Date;
  completedAt?: Date;
  timeSpentSeconds?: number;
}

