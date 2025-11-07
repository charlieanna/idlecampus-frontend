/**
 * Chemistry Course Data Types
 *
 * Defines the structure for IIT JEE Chemistry curriculum
 * Supports Class 11 and Class 12 content
 */

export type QuestionType = 'mcq' | 'multiple_select' | 'fill_blank' | 'drag_drop' | 'matching' | 'numerical';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'jee_main' | 'jee_advanced';
export type ChemistryTopic = 'physical' | 'inorganic' | 'organic';

/**
 * Enhanced Quiz Question Types for Chemistry
 */
export interface ChemistryQuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  difficulty: DifficultyLevel;
  topic: ChemistryTopic;
  explanation: string;
  hint?: string;

  // For MCQ
  options?: string[];
  correctAnswer?: number | number[]; // Single or multiple correct answers

  // For matching questions
  leftItems?: string[];
  rightItems?: string[];
  correctMatches?: Record<number, number>;

  // For drag-drop categorization
  items?: string[];
  categories?: string[];
  correctCategories?: Record<string, number>;

  // For numerical questions
  correctNumerical?: number;
  tolerance?: number;
  unit?: string;

  // For fill in blank
  blanks?: { position: number; correctAnswers: string[] }[];

  // Visual aids
  imageUrl?: string;
  diagramUrl?: string;

  // LaTeX support
  hasLatex?: boolean;
}

export interface ChemistryQuiz {
  id: string;
  title: string;
  description: string;
  questions: ChemistryQuizQuestion[];
  passingScore: number;
  timeLimitMinutes?: number;
  maxAttempts: number;
  difficulty: DifficultyLevel;
}

export interface ChemistryLab {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  labType: 'simulation' | 'virtual_experiment' | 'problem_solving' | 'interactive_demo';

  // Lab content
  introduction?: string;
  objectives?: string[];
  materials?: string[];
  procedure?: string[];
  observations?: string[];
  safetyNotes?: string[];

  // Interactive elements
  interactiveComponent?: 'periodic_table' | 'molecule_builder' | 'equation_balancer' | 'calculator';

  // Assessment
  questions?: ChemistryQuizQuestion[];
}

export interface ChemistryLesson {
  id: string;
  title: string;
  content: string; // Markdown/HTML with LaTeX support
  sequenceOrder: number;
  estimatedMinutes: number;

  // Learning objectives
  objectives?: string[];
  keyTerms?: { term: string; definition: string }[];

  // Visual aids
  diagrams?: { title: string; url: string; caption: string }[];

  // Important concepts to highlight
  importantConcepts?: string[];

  // Real-world applications
  applications?: string[];

  // Common misconceptions to address
  misconceptions?: { misconception: string; correction: string }[];
}

export interface ChemistryModuleItem {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'lab';
  sequenceOrder: number;
  data: ChemistryLesson | ChemistryQuiz | ChemistryLab;
}

export interface ChemistryModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string; // lucide-react icon name
  sequenceOrder: number;
  estimatedHours: number;

  // Module metadata
  topic: ChemistryTopic;
  difficulty: DifficultyLevel;

  // Prerequisites
  prerequisites?: string[]; // Module IDs

  // Learning outcomes
  learningOutcomes?: string[];

  // Module items (lessons, quizzes, labs)
  items: ChemistryModuleItem[];
}

export interface ChemistryCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  class: 11 | 12;
  difficultyLevel: DifficultyLevel;
  estimatedHours: number;

  // Course metadata
  syllabus: string;
  examPattern?: string;

  // Modules
  modules: ChemistryModule[];

  // Course features
  features: {
    hasInteractiveDiagrams: boolean;
    hasMoleculeVisualizer: boolean;
    hasPeriodicTable: boolean;
    hasLatexSupport: boolean;
    hasSpacedRepetition: boolean;
    hasAdaptiveLearning: boolean;
  };
}
