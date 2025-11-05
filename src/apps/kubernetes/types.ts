// ============================================
// KUBERNETES COURSE TYPES
// ============================================

export interface Command {
  command: string;
  description: string;
  example: string;
}

export type LessonItem =
  | { type: 'content'; markdown: string }
  | { type: 'command'; command: Command };

export interface Lesson {
  id: string;
  title: string;
  items: LessonItem[];
  content?: string;
  commands?: Command[];
}

export interface Task {
  id: string;
  description: string;
  hint: string;
  validation: (command: string) => boolean;
  solution: string;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}

export type QuizQuestion =
  | {
      id: string;
      type: 'mcq';
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }
  | {
      id: string;
      type: 'command';
      question: string;
      expectedCommand: string;
      hint: string;
      explanation: string;
    };

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  lessons: Lesson[];
  labs: Lab[];
  quizzes?: Quiz[];
}
