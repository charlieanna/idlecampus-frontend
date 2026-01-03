// Progressive lesson structure for incremental content unlocking

export type ProgressiveSectionType = 
  | 'content'     // Markdown content to read
  | 'practice'    // Interactive practice exercise
  | 'checkpoint'  // Knowledge check question
  | 'video'       // Video content
  | 'diagram';    // Visual diagram/illustration

export interface ProgressiveSection {
  id: string;
  type: ProgressiveSectionType;
  title?: string;
  
  // Content based on type
  content?: string;           // Markdown for 'content' type
  practice?: PracticeExercise; // For 'practice' type
  checkpoint?: CheckpointQuestion; // For 'checkpoint' type
  
  // Unlocking logic
  requiresCompletion: boolean; // Must complete to unlock next section
  autoUnlock?: boolean;        // Auto-unlock after time/scroll (for content sections)
  unlockDelay?: number;        // Delay in seconds before auto-unlock
  
  // Metadata
  estimatedTime?: number;      // Minutes to complete
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface PracticeExercise {
  description: string;
  expectedCommand: string;
  validation?: (command: string) => { valid: boolean; message?: string };
  hint?: string;
  hintUnlockAfter?: number;    // Show hint after N attempts
  solution?: string;
  solutionUnlockAfter?: number; // Show solution after N attempts
  placeholder?: string;         // Placeholder text for input
}

export interface CheckpointQuestion {
  question: string;
  type: 'mcq' | 'text' | 'code';
  options?: string[];           // For MCQ
  correctAnswer: string | number;
  explanation?: string;
  caseSensitive?: boolean;      // For text answers
}

export interface ProgressiveLesson {
  id: string;
  title: string;
  description: string;
  sections: ProgressiveSection[];
  
  // Completion tracking
  estimatedDuration?: number;   // Total minutes
  prerequisites?: string[];     // Lesson IDs that must be completed first
}

export interface SectionProgress {
  sectionId: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  completedAt?: Date;
  attempts?: number;
  timeSpent?: number;           // Seconds spent on this section
}

export interface LessonProgress {
  lessonId: string;
  sectionProgress: Map<string, SectionProgress>;
  currentSectionIndex: number;
  startedAt?: Date;
  completedAt?: Date;
  totalTimeSpent: number;       // Seconds
}

// Helper type for UI state
export interface ProgressiveLessonUIState {
  currentSection: number;
  attemptCounts: Map<string, number>;
  showHints: Set<string>;       // Section IDs where hint is visible
  showSolutions: Set<string>;   // Section IDs where solution is visible
  unlockedSections: Set<string>; // Section IDs that are unlocked
}
