export type CatSection = 'QUANT' | 'DILR' | 'VARC';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'CHALLENGER';

export interface CatTopic {
  id: string;
  section: CatSection;
  title: string;
  description: string;
  order: number;
}

export interface CatLesson {
  id: string;
  topicId: string;
  title: string;
  contentMarkdown: string; // Evaluation theory, formulas, tricks
  keyTakeaways: string[];
  durationMinutes: number;
}

export interface CatProblem {
  id: string;
  topicId: string;
  difficulty: Difficulty;
  questionMarkdown: string; // The specific question text
  options?: string[]; // For MCQs
  correctOptionIndex?: number; // For MCQs
  correctValue?: number; // For TITA (Type In The Answer)
  type: 'MCQ' | 'TITA';
  solutionMarkdown: string; // Detailed breakdown
  previousYearTag?: string; // e.g., "CAT 2022 Slot 1"
  estimatedTimeSeconds: number; // Ideal time to solve
}

// Special structure for DILR and VARC Sets
export interface CatProblemSet {
  id: string;
  topicId: string; // e.g., "RC", "Arrangements"
  commonDataMarkdown: string; // The passage or the data table
  subQuestions: CatProblem[];
  difficulty: Difficulty;
  estimatedTimeMinutes: number;
}

// Utility to hold content
export interface CatContentModule {
  topic: CatTopic;
  lessons: CatLesson[];
  problems: CatProblem[];
  problemSets?: CatProblemSet[];
}

export interface MockTest {
  id: string;
  title: string;
  description: string;
  totalDurationMinutes: number;
  sections: {
    id: string; // e.g., 'quant-section'
    type: CatSection;
    title: string;
    durationMinutes: number;
    description: string;
    problemIds: string[]; // List of problem IDs to include
    problemSetIds?: string[]; // List of problem sets to include
  }[];
}
