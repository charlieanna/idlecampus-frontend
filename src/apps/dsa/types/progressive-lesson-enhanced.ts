// Enhanced Progressive Lesson Types
import type { ReactNode } from 'react';

export type SectionType = 'reading' | 'exercise' | 'quiz' | 'checkpoint';

export interface ReadingSection {
  type: 'reading';
  id: string;
  title: string;
  content: string | ReactNode; // Markdown content OR React component
  estimatedReadTime?: number; // in seconds
  autoMarkComplete?: boolean; // Auto-complete after scrolling

  // Practice exercise for every reading section (ensures right panel is always used)
  practiceExercise?: {
    title: string;
    instruction: string; // Problem description
    starterCode?: string; // Initial code
    testCases?: {
      input: string;
      expectedOutput?: string;
      expected?: string;
    }[];
    difficulty?: 'easy' | 'medium' | 'hard';
    // Optional: If true, must complete to proceed
    requiredForProgress?: boolean;
    solution?: string | {
      afterAttempt: number;
      text: string;
    };
    // Optional target complexity to teach time/space explicitly per exercise
    targetComplexity?: {
      time: string;
      space: string;
      notes?: string;
    };
    // Solution explanation (markdown)
    solutionExplanation?: string;
  };

  // OR: Quick quiz instead of coding exercise
  quickQuiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };

  // Inline mini-editors embedded within reading content
  // Referenced by ID in HTML content via <code-editor data-id="...">
  inlineExercises?: InlineExercise[];
}

// Inline exercise for embedding in reading content
export interface InlineExercise {
  id: string;
  starterCode: string;
  testCases: {
    input: string;
    expectedOutput?: string;
    expected?: string;
  }[];
  targetFunction?: string;
  hints?: string[];
  solution?: string;
  successMessage?: string;
  validation?: (input: string) => { success: boolean; message: string };
}

export interface ExerciseSection {
  type: 'exercise';
  placement: 'module' | 'practice'; // identifies whether this exercise ships inside a module flow or Smart Practice
  id: string;
  title: string;
  description: string;
  instruction: string; // What they need to do
  expectedCommand?: string; // For terminal exercises
  expectedOutput?: string; // For code/SQL exercises
  validation?: (input: string) => { success: boolean; message: string };
  hints: {
    afterAttempt: number; // Show hint after N attempts
    text?: string; // Instructional hint text (used if no question)
    question?: string; // Socratic question to guide thinking
    thinkAbout?: string[]; // Sub-questions that expand to help user think
  }[];
  // Optional target complexity to teach time/space explicitly per exercise
  targetComplexity?: {
    time: string;
    space: string;
    notes?: string; // optional short explanation shown in UI
  };
  solution?: {
    afterAttempt: number; // Show solution after N attempts
    text: string;
  };
  solutionExplanation?: string; // Markdown explanation of time/space complexity after completion
  complexityQuizPlacement?: 'before' | 'after'; // When to show complexity quiz: 'before' = understand first, 'after' = analyze solution (default: 'after')
  requiredForProgress?: boolean; // Must complete to unlock next section
  // Python exercise specific properties
  starterCode?: string; // Initial code provided to user
  testCases?: {
    input: string;
    expectedOutput?: string;
    expected?: string; // Alias for expectedOutput
    description?: string;
  }[];
  targetFunction?: string; // Function name to test (when multiple functions exist, e.g., 'union' vs 'find')
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // Time limit in seconds
  passingScore?: number; // Score required to pass (0-100)

  // Learn vs Practice separation
  isVerification?: boolean; // true = verification exercise in Learn Mode, false/undefined = practice
  isPracticeOnly?: boolean; // true = only in Smart Practice, not in Learn Mode (exercises to filter out)
  conceptFamily?: string; // e.g., 'dp-fundamentals', '1d-dp', '2d-dp' for grouping

  // Optional reading time for exercises that have reading content
  estimatedReadTime?: number; // in seconds (typically used for reading sections)

  // Auto-complete flag for exercises that don't require explicit completion
  autoMarkComplete?: boolean;

  // Prerequisite help when user struggles
  prerequisiteHelp?: PrerequisiteHelp[];

  // Generic metadata for adaptive flow
  metadata?: {
    failureCategory?: string;
  };
}

// Help content shown when user struggles with an exercise
export interface PrerequisiteHelp {
  conceptId: string;           // Which concept this helps with
  fromModuleId: string;        // Which module teaches this concept

  // Level 1: Quick hint (shown after 3 failed attempts)
  hint: string;

  // Level 2: Mini-lesson (shown after 5 failures or 2+ hints used)
  refresher?: {
    title: string;
    content: string;           // Markdown content
    estimatedMinutes: number;
  };

  // Level 3: Link to full module
  moduleLink: {
    moduleId: string;
    title: string;
  };
}

export interface QuizSection {
  type: 'quiz';
  id: string;
  title: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  passingScore: number; // Percentage required to pass
  requiredForProgress: boolean;
  solutionExplanation?: string; // Markdown explanation of time/space complexity after completion
  complexityQuizPlacement?: 'before' | 'after'; // When to show complexity quiz: 'before' = understand first, 'after' = analyze solution (default: 'after')
  timeLimit?: number; // Optional time limit in seconds
  metadata?: {
    failureCategory?: string;
  };
}

export interface CheckpointSection {
  type: 'checkpoint';
  id: string;
  title: string;
  description: string;
  requirements: {
    sectionId: string;
    description: string;
  }[];
  celebrationMessage: string;
}

export type LessonSection =
  | ReadingSection
  | ExerciseSection
  | QuizSection
  | CheckpointSection;

export interface ProgressiveLesson {
  id: string;
  title: string;
  description: string;
  estimatedTime?: number; // Total time in minutes (optional)
  sections: LessonSection[];
  unlockMode: 'sequential' | 'flexible'; // Sequential = must complete in order
}

export interface SectionProgress {
  sectionId: string;
  status: 'locked' | 'unlocked' | 'in-progress' | 'completed';
  attempts: number;
  completedAt?: Date | string;
  startedAt?: Date | string;
  timeSpent: number; // in seconds
  solutionViewed?: boolean; // True if user gave up and looked at the solution
  hintsUsedCount?: number; // Number of hints used for this exercise
}

export interface ProgressiveLessonProgress {
  lessonId: string;
  currentSectionIndex: number;
  sectionsProgress: Map<string, SectionProgress>;
  overallProgress: number; // 0-100%
  startedAt: Date | string;
  lastActivityAt: Date | string;
  completedAt?: Date | string; // When the entire lesson was completed
  totalTimeSpent: number; // in seconds
}

// Helper function to determine if section is unlocked
// All sections are now unlocked by default for free navigation
export function isSectionUnlocked(
  _section: LessonSection,
  _sectionIndex: number,
  _lessonProgress: ProgressiveLessonProgress,
  _lesson: ProgressiveLesson
): boolean {
  // All sections unlocked - users can freely navigate
  return true;
}

// Helper function to check if exercise is required for progress
export function isProgressGated(section: LessonSection): boolean {
  if (section.type === 'exercise' || section.type === 'quiz') {
    return section.requiredForProgress ?? false;
  }
  return false;
}

// Calculate overall lesson progress
export function calculateLessonProgress(
  lesson: ProgressiveLesson,
  progress: ProgressiveLessonProgress
): number {
  const trackableSections = lesson.sections.filter(section => {
    if (section.type === 'exercise') {
      const exercise = section as ExerciseSection;
      return !exercise.isPracticeOnly;
    }
    return true;
  });

  if (trackableSections.length === 0) {
    return 100;
  }

  const completedSections = trackableSections.filter(section => {
    const sectionProgress = progress.sectionsProgress.get(section.id);
    return sectionProgress?.status === 'completed';
  }).length;

  return Math.round((completedSections / trackableSections.length) * 100);
}
