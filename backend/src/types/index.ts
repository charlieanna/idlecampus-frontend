/**
 * Type definitions for the IdleCampus Backend API
 */

export interface ExecuteCodeRequest {
  code: string;
  testInput?: string;
  timeout?: number; // in seconds
}

export interface ExecuteCodeResponse {
  success: boolean;
  output: string;
  error?: string;
  execution_time: number; // in seconds
  memory_used?: number; // in MB
}

export interface ValidateCodeRequest {
  code: string;
}

export interface TestCase {
  name: string;
  input?: any;
  expected: any;
  description?: string;
}

export interface TestResult {
  name: string;
  passed: boolean;
  input?: any;
  expected: any;
  actual: any;
  error?: string;
  execution_time: number;
}

export interface ValidationResult {
  success: boolean;
  passed: number;
  failed: number;
  total: number;
  test_results: TestResult[];
}

export interface ValidateCodeResponse {
  success: boolean;
  output: string;
  error?: string;
  execution_time: number;
  validation: ValidationResult;
}

export interface SubmitCodeRequest {
  code: string;
}

export interface SubmitCodeResponse extends ValidateCodeResponse {
  score: number; // percentage 0-100
  feedback: string;
}

export interface CodeLabChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starter_code: string;
  test_cases: TestCase[];
  hints?: string[];
  solution?: string;
  time_limit?: number; // seconds
  memory_limit?: number; // MB
}

export interface PythonExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
  memoryUsed?: number;
  timedOut: boolean;
  error?: string;
}
