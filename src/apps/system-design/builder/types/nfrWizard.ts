/**
 * NFR Wizard Types - Interactive teaching flow for NFR-driven design
 */

import { ComponentType } from './problemDefinition';

/**
 * Question types for the wizard
 */
export type WizardQuestionType =
  | 'numeric_input'     // Single number input
  | 'single_choice'     // Radio buttons
  | 'multi_choice'      // Checkboxes
  | 'calculation'       // Show calculation, student confirms
  | 'decision_matrix';  // Show decision table, student picks

/**
 * Answer option for choice-based questions
 */
export interface WizardAnswerOption {
  id: string;
  label: string;
  description?: string;
  consequence?: string;  // What happens if this is chosen
}

/**
 * Architecture change triggered by answer
 */
export interface ArchitectureChange {
  action: 'add_component' | 'configure_component' | 'add_connection' | 'highlight' | 'remove_component';
  componentType?: ComponentType;
  componentId?: string;
  config?: Record<string, any>;
  from?: string;
  to?: string;
  reason: string;  // Explanation shown to student
}

/**
 * Decision matrix row for complex decisions
 */
export interface DecisionMatrixRow {
  condition: string;
  recommendation: string;
  reasoning: string;
}

/**
 * Individual wizard question
 */
export interface WizardQuestion {
  id: string;
  step: number;
  category: 'throughput' | 'latency' | 'durability' | 'dataset_size' | 'consistency' | 'cost';

  // Question content
  title: string;
  description: string;
  questionType: WizardQuestionType;

  // For numeric input
  numericConfig?: {
    placeholder: string;
    unit?: string;  // e.g., "RPS", "GB", "ms"
    min?: number;
    max?: number;
    suggestedValue?: number;
  };

  // For choice questions
  options?: WizardAnswerOption[];

  // For calculations
  calculation?: {
    formula: string;
    explanation: string;
    exampleInputs?: Record<string, number>;
    exampleOutput?: string;
  };

  // For decision matrices
  decisionMatrix?: DecisionMatrixRow[];

  // Teaching content
  whyItMatters: string;  // Educational explanation
  commonMistakes?: string[];

  // Architecture impact
  onAnswer?: (answer: any, previousAnswers: Record<string, any>) => ArchitectureChange[];

  // Conditional display
  showIf?: (previousAnswers: Record<string, any>) => boolean;
}

/**
 * Complete wizard flow for a problem
 */
export interface NFRWizardFlow {
  enabled: boolean;
  title: string;
  subtitle: string;

  // Learning objectives
  objectives: string[];

  // Sequential questions
  questions: WizardQuestion[];

  // Final summary shown after all questions
  summary?: {
    title: string;
    keyTakeaways: string[];
    nextSteps?: string;
  };
}

/**
 * Wizard state during interaction
 */
export interface WizardState {
  currentStep: number;
  answers: Record<string, any>;
  architectureChanges: ArchitectureChange[];
  completed: boolean;
}
