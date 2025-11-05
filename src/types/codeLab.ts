// TypeScript types for code editor-based labs

export type ProgrammingLanguage = 'python' | 'golang' | 'javascript' | 'ruby' | 'java';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type LabFormat = 'terminal' | 'code_editor' | 'hybrid';

export interface TestCase {
  test_number?: number;
  description: string;
  input?: string;
  expected_output: string;
  actual_output?: string;
  passed?: boolean;
  execution_time?: number;
  error?: string;
  hidden?: boolean;
  message?: string;
}

export interface ValidationResult {
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  results: TestCase[];
  all_passed: boolean;
  pass_percentage: number;
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  execution_time?: number;
  memory_used?: number;
  timeout?: boolean;
  forbidden_imports?: string[];
}

export interface CodeLabSummary {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  programming_language: ProgrammingLanguage;
  estimated_minutes: number;
  points_reward: number;
  test_case_count: number;
  sequence_order: number;
  times_completed: number;
  average_success_rate: number;
}

export interface CodeLab {
  id: number;
  title: string;
  description: string;
  difficulty: Difficulty;
  programming_language: ProgrammingLanguage;
  lab_format: LabFormat;
  estimated_minutes: number;
  starter_code: string;
  test_cases: TestCase[];
  file_structure?: Record<string, string>;
  allowed_imports: string[];
  objectives: string[];
  points_reward: number;
  max_attempts: number;
  time_limit_seconds: number;
  memory_limit_mb: number;
  has_solution: boolean;
  has_hints: boolean;
}

export interface HintResponse {
  success: boolean;
  hint?: string;
  attempt_count?: number;
  total_hints?: number;
  error?: string;
}

export interface SolutionResponse {
  success: boolean;
  solution?: string;
  message?: string;
  error?: string;
  attempts_remaining?: number;
}

export interface SubmitResponse {
  success: boolean;
  message: string;
  validation: ValidationResult;
  points_earned?: number;
  lab_completed?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CodeLabsListResponse {
  success: boolean;
  labs: CodeLabSummary[];
}

export interface CodeLabResponse {
  success: boolean;
  lab: CodeLab;
}

// UI State types
export interface CodeEditorState {
  code: string;
  output: string;
  isRunning: boolean;
  isValidating: boolean;
  isSubmitting: boolean;
  validationResult: ValidationResult | null;
  customInput: string;
  showHint: boolean;
  hint: string;
  attemptCount: number;
  showSolution: boolean;
  solution: string;
}

export type EditorTab = 'editor' | 'tests' | 'output' | 'instructions';

// Monaco Editor language modes
export const LANGUAGE_MODES: Record<ProgrammingLanguage, string> = {
  python: 'python',
  golang: 'go',
  javascript: 'javascript',
  ruby: 'ruby',
  java: 'java',
};

// Language display names
export const LANGUAGE_NAMES: Record<ProgrammingLanguage, string> = {
  python: 'Python',
  golang: 'Go',
  javascript: 'JavaScript',
  ruby: 'Ruby',
  java: 'Java',
};

// Difficulty colors
export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'bg-green-600',
  medium: 'bg-yellow-600',
  hard: 'bg-red-600',
};

// Language colors
export const LANGUAGE_COLORS: Record<ProgrammingLanguage, string> = {
  python: 'bg-blue-600',
  golang: 'bg-cyan-600',
  javascript: 'bg-yellow-500',
  ruby: 'bg-red-500',
  java: 'bg-orange-600',
};
