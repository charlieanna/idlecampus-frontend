/**
 * Load test types for Python code execution performance testing
 */

export type LoadTestScenario = 'quick' | 'normal' | 'spike' | 'sustained' | 'custom';

export interface LoadTestConfig {
  code: string;
  challengeId: string;
  scenario: LoadTestScenario;
  rps: number; // Requests per second
  duration: number; // Duration in seconds
  readWriteRatio: number; // 0-1, percentage of reads vs writes
}

export interface LoadTestProgress {
  completed: number;
  total: number;
  currentRPS: number;
  elapsed: number; // Seconds
  estimated: number; // Estimated remaining seconds
}

export interface RequestResult {
  success: boolean;
  latency: number; // Milliseconds
  error?: string;
  timestamp: number;
  type: 'read' | 'write';
}

export interface LoadTestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  errorRate: number; // 0-1

  minLatency: number;
  maxLatency: number;
  avgLatency: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;

  throughput: number; // Requests per second
  duration: number; // Actual test duration in seconds

  latencyDistribution: number[]; // Array of latencies for charting
  throughputOverTime: Array<{ timestamp: number; rps: number }>; // RPS over time
}

export interface Bottleneck {
  type: 'high_latency' | 'high_error_rate' | 'low_throughput' | 'timeout' | 'memory';
  severity: 'warning' | 'error' | 'critical';
  message: string;
  suggestions: string[];
  metric?: number; // The actual metric value that triggered this
}

export interface LoadTestResults {
  config: LoadTestConfig;
  metrics: LoadTestMetrics;
  bottlenecks: Bottleneck[];
  startTime: number;
  endTime: number;
  success: boolean;
  errors: string[]; // Unique error messages encountered
}

export interface ScenarioPreset {
  name: string;
  description: string;
  rps: number;
  duration: number;
  readWriteRatio: number;
}

export const LOAD_TEST_SCENARIOS: Record<LoadTestScenario, ScenarioPreset> = {
  quick: {
    name: 'Quick Test',
    description: 'Run 10 requests to validate code works',
    rps: 10,
    duration: 1,
    readWriteRatio: 0.5,
  },
  normal: {
    name: 'Normal Load',
    description: '1,000 RPS for 60 seconds (60K requests)',
    rps: 1000,
    duration: 60,
    readWriteRatio: 0.9,
  },
  spike: {
    name: 'Read Spike',
    description: '5,000 RPS for 30 seconds (150K requests)',
    rps: 5000,
    duration: 30,
    readWriteRatio: 0.98,
  },
  sustained: {
    name: 'Sustained Load',
    description: '500 RPS for 300 seconds (150K requests)',
    rps: 500,
    duration: 300,
    readWriteRatio: 0.8,
  },
  custom: {
    name: 'Custom',
    description: 'Configure your own test parameters',
    rps: 100,
    duration: 10,
    readWriteRatio: 0.9,
  },
};

// Enhanced types for intelligent analysis integration
export interface EnhancedLoadTestConfig extends LoadTestConfig {
  analysisMode?: boolean;
  pythonCode?: string;
}

export interface ArchitectureAnalysis {
  detectedPattern: 'in-memory' | 'database' | 'caching' | 'file-storage' | 'hybrid';
  confidence: number;
  recommendations: string[];
  performanceMetrics: {
    estimatedMemoryUsage: string;
    estimatedConcurrency: string;
    scalabilityRating: number;
  };
}

export interface EducationalInsight {
  type: 'warning' | 'suggestion' | 'optimization' | 'architectural_mismatch';
  title: string;
  description: string;
  recommendation?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface IntelligentTestResult {
  loadTestResults: LoadTestResults;
  architectureAnalysis?: ArchitectureAnalysis;
  educationalInsights?: EducationalInsight[];
}

// Performance test result from intelligent analyzer
export interface PerformanceTestResult {
  testName: string;
  success: boolean;
  metrics?: any;
  error?: string;
  timestamp: string;
}
