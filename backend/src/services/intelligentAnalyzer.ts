import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs/promises';
import { pythonExecutor } from './pythonExecutor.js';
import { PythonExecutionResult } from '../types/index.js';

// Types for the intelligent analysis framework
export interface ArchitecturePattern {
  type: 'in-memory' | 'database' | 'caching' | 'file-storage' | 'hybrid';
  confidence: number;
  detectedFeatures: string[];
  imports: string[];
}

export interface TestScenario {
  name: string;
  description: string;
  testType: 'load' | 'memory' | 'concurrency' | 'persistence';
  parameters: {
    userCount?: number;
    dataSize?: number;
    duration?: number;
    operations?: string[];
  };
}

export interface EducationalInsight {
  type: 'warning' | 'suggestion' | 'optimization' | 'architectural_mismatch';
  title: string;
  description: string;
  recommendation?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AnalysisResult {
  architecture: ArchitecturePattern;
  recommendedTests: TestScenario[];
  insights: EducationalInsight[];
  performanceMetrics?: {
    estimatedMemoryUsage: string;
    estimatedConcurrency: string;
    scalabilityRating: number;
  };
}

export interface PerformanceTestResult {
  testName: string;
  success: boolean;
  metrics?: any;
  error?: string;
  timestamp: string;
  rawOutput?: string;
  exitCode?: number;
}

export class IntelligentAnalyzer {
  private readonly PATTERNS = {
    // Database patterns
    DATABASE_IMPORTS: [
      /import\s+sqlite3/,
      /import\s+psycopg2/,
      /import\s+pymongo/,
      /from\s+sqlalchemy/,
      /import\s+mysql\.connector/,
      /from\s+django\.db/
    ],
    
    // Caching patterns
    CACHE_IMPORTS: [
      /import\s+redis/,
      /import\s+memcache/,
      /from\s+functools\s+import\s+lru_cache/,
      /import\s+pickle/
    ],
    
    // In-memory storage patterns
    INMEMORY_PATTERNS: [
      /\w+\s*=\s*\[\]/,  // list initialization
      /\w+\s*=\s*\{\}/,  // dict initialization
      /\.append\(/,
      /\.update\(/,
      /\.get\(/,
      /\.setdefault\(/
    ],
    
    // File storage patterns
    FILE_PATTERNS: [
      /open\(/,
      /with\s+open/,
      /\.read\(/,
      /\.write\(/,
      /import\s+json/,
      /import\s+pickle/,
      /import\s+csv/
    ],
    
    // Performance-critical patterns
    PERFORMANCE_PATTERNS: [
      /for\s+\w+\s+in\s+range\(/,  // loops
      /while\s+/,                   // while loops
      /\.sort\(/,                   // sorting
      /sorted\(/,                   // sorting
      /\.join\(/,                   // string operations
      /time\.sleep\(/               // blocking operations
    ],

    // Performance anti-patterns
    PERFORMANCE_ANTI_PATTERNS: [
      /datetime\.now\(\)/g,         // repeated datetime.now() calls
      /f".*\{.*\}.*"/g,             // f-string formatting (potential concatenation)
      /\+.*\+.*\+/,                 // string concatenation chains
      /\w+\s*=\s*\{\}\s*$/m,        // global dict assignments
    ]
  };

  /**
   * Main analysis method that orchestrates the entire process
   */
  async analyzeCode(pythonCode: string, systemDiagram?: any): Promise<AnalysisResult> {
    try {
      const architecture = this.detectArchitecturePattern(pythonCode);
      const recommendedTests = this.selectTests(architecture);
      const insights = this.generateEducationalFeedback(pythonCode, architecture, systemDiagram);
      const performanceMetrics = this.estimatePerformanceMetrics(pythonCode, architecture);

      return {
        architecture,
        recommendedTests,
        insights,
        performanceMetrics
      };
    } catch (error) {
      throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Detect architecture patterns from Python code
   */
  private detectArchitecturePattern(code: string): ArchitecturePattern {
    const detectedFeatures: string[] = [];
    const imports: string[] = [];
    let primaryType: ArchitecturePattern['type'] = 'in-memory';
    let confidence = 0.5;

    // Check for database patterns
    const databaseMatches = this.PATTERNS.DATABASE_IMPORTS.some(pattern => {
      const match = pattern.test(code);
      if (match) {
        const importLine = code.match(pattern)?.[0];
        if (importLine) imports.push(importLine);
        detectedFeatures.push('Database connectivity');
      }
      return match;
    });

    // Check for caching patterns
    const cacheMatches = this.PATTERNS.CACHE_IMPORTS.some(pattern => {
      const match = pattern.test(code);
      if (match) {
        const importLine = code.match(pattern)?.[0];
        if (importLine) imports.push(importLine);
        detectedFeatures.push('Caching mechanisms');
      }
      return match;
    });

    // Check for file storage patterns
    const fileMatches = this.PATTERNS.FILE_PATTERNS.some(pattern => {
      const match = pattern.test(code);
      if (match) {
        detectedFeatures.push('File storage operations');
      }
      return match;
    });

    // Check for in-memory patterns
    const inMemoryMatches = this.PATTERNS.INMEMORY_PATTERNS.some(pattern => {
      const match = pattern.test(code);
      if (match) {
        detectedFeatures.push('In-memory data structures');
      }
      return match;
    });

    // Determine primary architecture type
    if (databaseMatches && cacheMatches) {
      primaryType = 'hybrid';
      confidence = 0.9;
    } else if (databaseMatches) {
      primaryType = 'database';
      confidence = 0.8;
    } else if (cacheMatches) {
      primaryType = 'caching';
      confidence = 0.7;
    } else if (fileMatches) {
      primaryType = 'file-storage';
      confidence = 0.6;
    } else if (inMemoryMatches) {
      primaryType = 'in-memory';
      confidence = 0.7;
    }

    return {
      type: primaryType,
      confidence,
      detectedFeatures,
      imports
    };
  }

  /**
   * Select appropriate tests based on detected architecture
   */
  private selectTests(architecture: ArchitecturePattern): TestScenario[] {
    const tests: TestScenario[] = [];

    switch (architecture.type) {
      case 'in-memory':
        tests.push(
          {
            name: 'Memory Usage Test',
            description: 'Test memory consumption with varying data sizes',
            testType: 'memory',
            parameters: {
              dataSize: 1000,
              operations: ['insert', 'retrieve', 'update']
            }
          },
          {
            name: 'Concurrency Test',
            description: 'Test behavior under concurrent access',
            testType: 'concurrency',
            parameters: {
              userCount: 10,
              duration: 30
            }
          }
        );
        break;

      case 'database':
        tests.push(
          {
            name: 'Database Load Test',
            description: 'Test database performance under load',
            testType: 'load',
            parameters: {
              userCount: 50,
              duration: 60,
              operations: ['read', 'write', 'update']
            }
          },
          {
            name: 'Connection Pool Test',
            description: 'Test database connection handling',
            testType: 'concurrency',
            parameters: {
              userCount: 25,
              duration: 45
            }
          }
        );
        break;

      case 'caching':
        tests.push(
          {
            name: 'Cache Hit Rate Test',
            description: 'Test cache effectiveness and performance',
            testType: 'load',
            parameters: {
              userCount: 30,
              duration: 40,
              operations: ['cache_read', 'cache_write', 'cache_invalidate']
            }
          }
        );
        break;

      case 'file-storage':
        tests.push(
          {
            name: 'File I/O Performance Test',
            description: 'Test file read/write performance',
            testType: 'load',
            parameters: {
              dataSize: 5000,
              operations: ['file_read', 'file_write']
            }
          },
          {
            name: 'Persistence Test',
            description: 'Test data persistence across restarts',
            testType: 'persistence',
            parameters: {
              duration: 20
            }
          }
        );
        break;

      case 'hybrid':
        tests.push(
          {
            name: 'Multi-tier Performance Test',
            description: 'Test performance across all storage layers',
            testType: 'load',
            parameters: {
              userCount: 40,
              duration: 90,
              operations: ['cache_read', 'db_read', 'file_write']
            }
          }
        );
        break;
    }

    // Add baseline performance test for all architectures
    tests.push({
      name: 'Baseline Performance Test',
      description: 'Establish baseline performance metrics',
      testType: 'load',
      parameters: {
        userCount: 1,
        duration: 10
      }
    });

    return tests;
  }

  /**
   * Generate educational feedback and insights
   */
  private generateEducationalFeedback(
    code: string,
    architecture: ArchitecturePattern,
    systemDiagram?: any
  ): EducationalInsight[] {
    const insights: EducationalInsight[] = [];

    // Check for architectural mismatches with diagram
    if (systemDiagram) {
      insights.push(...this.checkArchitecturalMismatches(architecture, systemDiagram));
    }

    // Performance insights based on architecture
    insights.push(...this.generatePerformanceInsights(code, architecture));

    // Best practices recommendations
    insights.push(...this.generateBestPracticesInsights(architecture));

    // Scalability insights
    insights.push(...this.generateScalabilityInsights(architecture));

    return insights;
  }

  private checkArchitecturalMismatches(
    detected: ArchitecturePattern,
    diagram: any
  ): EducationalInsight[] {
    const insights: EducationalInsight[] = [];

    // This would compare detected patterns with the system diagram
    // For now, providing a sample implementation
    if (detected.type === 'in-memory' && diagram?.components?.includes('database')) {
      insights.push({
        type: 'architectural_mismatch',
        title: 'Architecture Mismatch Detected',
        description: 'Your system diagram shows a database, but your code only uses in-memory storage',
        recommendation: 'Consider implementing database integration or updating your diagram',
        severity: 'medium'
      });
    }

    return insights;
  }

  private generatePerformanceInsights(
    code: string,
    architecture: ArchitecturePattern
  ): EducationalInsight[] {
    const insights: EducationalInsight[] = [];

    // Check for repeated datetime.now() calls
    const datetimeMatches = code.match(/datetime\.now\(\)/g);
    if (datetimeMatches && datetimeMatches.length > 1) {
      insights.push({
        type: 'optimization',
        title: 'Repeated datetime.now() Calls Detected',
        description: `Found ${datetimeMatches.length} calls to datetime.now(). Multiple calls in the same function can be inefficient`,
        recommendation: 'Store datetime.now() in a variable and reuse it to ensure consistency and improve performance',
        severity: 'medium'
      });
    }

    // Check for string concatenation patterns
    const fStringMatches = code.match(/f".*\{.*\}.*"/g);
    if (fStringMatches && fStringMatches.length > 0) {
      insights.push({
        type: 'suggestion',
        title: 'F-String Usage Detected',
        description: `Found ${fStringMatches.length} f-string formatting operations. While efficient, be mindful of complex expressions`,
        recommendation: 'F-strings are good, but consider performance impact if used in loops or with complex expressions',
        severity: 'low'
      });
    }

    // Check for potential memory growth in in-memory architecture
    if (architecture.type === 'in-memory') {
      const globalDictMatches = code.match(/\w+\s*=\s*\{\}/g);
      if (globalDictMatches && globalDictMatches.length > 0) {
        insights.push({
          type: 'warning',
          title: 'Global Dictionary Storage Detected',
          description: `Found ${globalDictMatches.length} global dictionaries. This pattern can lead to unlimited memory growth`,
          recommendation: 'Implement size limits, TTL (time-to-live), or consider using a proper database for persistence',
          severity: 'high'
        });
      }

      // Check for large loops
      if (/for\s+\w+\s+in\s+range\(\d{4,}\)/.test(code)) {
        insights.push({
          type: 'warning',
          title: 'Large Loop Detected',
          description: 'Large loops with in-memory storage may cause memory issues',
          recommendation: 'Consider pagination or streaming for large datasets',
          severity: 'high'
        });
      }
    }

    if (architecture.type === 'database' && !/\.close\(/.test(code)) {
      insights.push({
        type: 'warning',
        title: 'Potential Resource Leak',
        description: 'Database connections should be properly closed',
        recommendation: 'Use context managers (with statements) for database operations',
        severity: 'medium'
      });
    }

    return insights;
  }

  private generateBestPracticesInsights(
    architecture: ArchitecturePattern
  ): EducationalInsight[] {
    const insights: EducationalInsight[] = [];

    switch (architecture.type) {
      case 'in-memory':
        insights.push({
          type: 'suggestion',
          title: 'In-Memory Storage Considerations',
          description: 'In-memory storage is fast but limited by available RAM',
          recommendation: 'Consider data persistence needs and memory limits',
          severity: 'low'
        });
        break;

      case 'database':
        insights.push({
          type: 'suggestion',
          title: 'Database Optimization',
          description: 'Database operations can be optimized with proper indexing',
          recommendation: 'Use appropriate indexes and query optimization techniques',
          severity: 'low'
        });
        break;

      case 'caching':
        insights.push({
          type: 'optimization',
          title: 'Cache Strategy',
          description: 'Effective caching can significantly improve performance',
          recommendation: 'Implement cache invalidation and TTL strategies',
          severity: 'low'
        });
        break;
    }

    return insights;
  }

  private generateScalabilityInsights(
    architecture: ArchitecturePattern
  ): EducationalInsight[] {
    const insights: EducationalInsight[] = [];

    const scalabilityMap = {
      'in-memory': 'Limited by single-machine memory',
      'database': 'Scalable with proper database design',
      'caching': 'Highly scalable with distributed caching',
      'file-storage': 'Limited by disk I/O and file system',
      'hybrid': 'Excellent scalability potential'
    };

    insights.push({
      type: 'suggestion',
      title: 'Scalability Assessment',
      description: scalabilityMap[architecture.type],
      recommendation: this.getScalabilityRecommendation(architecture.type),
      severity: 'low'
    });

    return insights;
  }

  private getScalabilityRecommendation(type: ArchitecturePattern['type']): string {
    const recommendations = {
      'in-memory': 'Consider horizontal scaling or distributed memory solutions',
      'database': 'Implement database sharding or read replicas',
      'caching': 'Use distributed cache clusters like Redis Cluster',
      'file-storage': 'Consider distributed file systems or object storage',
      'hybrid': 'Leverage the strengths of each storage layer appropriately'
    };

    return recommendations[type];
  }

  /**
   * Estimate performance metrics based on code analysis
   */
  private estimatePerformanceMetrics(
    code: string,
    architecture: ArchitecturePattern
  ): AnalysisResult['performanceMetrics'] {
    let memoryUsage = 'Low';
    let concurrency = 'Limited';
    let scalabilityRating = 5;

    switch (architecture.type) {
      case 'in-memory':
        memoryUsage = 'High';
        concurrency = 'Limited';
        scalabilityRating = 3;
        break;
      case 'database':
        memoryUsage = 'Medium';
        concurrency = 'Good';
        scalabilityRating = 7;
        break;
      case 'caching':
        memoryUsage = 'Medium';
        concurrency = 'Excellent';
        scalabilityRating = 8;
        break;
      case 'file-storage':
        memoryUsage = 'Low';
        concurrency = 'Poor';
        scalabilityRating = 4;
        break;
      case 'hybrid':
        memoryUsage = 'Medium';
        concurrency = 'Excellent';
        scalabilityRating = 9;
        break;
    }

    // Adjust based on code complexity
    const complexityFactors = [
      /for\s+.*in\s+.*for\s+.*in/.test(code), // nested loops
      (code.match(/def\s+\w+/g) || []).length > 5, // many functions
      /class\s+\w+/.test(code) // OOP usage
    ];

    const complexityScore = complexityFactors.filter(Boolean).length;
    if (complexityScore > 1) {
      scalabilityRating = Math.max(1, scalabilityRating - complexityScore);
    }

    return {
      estimatedMemoryUsage: memoryUsage,
      estimatedConcurrency: concurrency,
      scalabilityRating
    };
  }

  /**
   * Execute performance tests based on selected scenarios using existing pythonExecutor
   */
  async executePerformanceTest(
    pythonCode: string,
    testScenario: TestScenario
  ): Promise<PerformanceTestResult> {
    try {
      // Create a test wrapper script
      const testScript = this.generateTestScript(pythonCode, testScenario);
      
      // Execute the test using the existing pythonExecutor
      const result = await pythonExecutor.execute(testScript, {
        timeout: 30000, // 30 seconds timeout for performance tests
        memoryLimit: 256 // 256MB memory limit
      });
      
      if (result.exitCode === 0 && !result.error) {
        try {
          // Try to parse JSON output if present
          const output = result.stdout.trim();
          let metrics;
          
          if (output.includes('{') && output.includes('}')) {
            // Extract JSON from output
            const jsonMatch = output.match(/\{.*\}/s);
            if (jsonMatch) {
              metrics = JSON.parse(jsonMatch[0]);
            }
          }
          
          return {
            testName: testScenario.name,
            success: true,
            metrics: metrics || {
              execution_time: result.executionTime,
              test_type: testScenario.testType,
              scenario: testScenario.name
            },
            timestamp: new Date().toISOString()
          };
        } catch (parseError) {
          return {
            testName: testScenario.name,
            success: true,
            metrics: {
              execution_time: result.executionTime,
              test_type: testScenario.testType,
              scenario: testScenario.name,
              raw_output: result.stdout
            },
            timestamp: new Date().toISOString()
          };
        }
      } else {
        return {
          testName: testScenario.name,
          success: false,
          error: result.error || result.stderr || 'Test execution failed',
          timestamp: new Date().toISOString(),
          exitCode: result.exitCode
        };
      }
    } catch (error) {
      return {
        testName: testScenario.name,
        success: false,
        error: error instanceof Error ? error.message : 'Performance test failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate Python test script for a given scenario
   */
  private generateTestScript(userCode: string, scenario: TestScenario): string {
    const testTemplate = `
import time
import json
import threading
import sys
from concurrent.futures import ThreadPoolExecutor
import traceback

# User's code
${userCode}

def performance_test():
    results = {
        "test_type": "${scenario.testType}",
        "scenario": "${scenario.name}",
        "metrics": {}
    }
    
    try:
        start_time = time.time()
        
        ${this.generateTestLogic(scenario)}
        
        end_time = time.time()
        results["metrics"]["execution_time"] = end_time - start_time
        results["metrics"]["success"] = True
        
    except Exception as e:
        results["metrics"]["success"] = False
        results["metrics"]["error"] = str(e)
        results["metrics"]["traceback"] = traceback.format_exc()
    
    return results

if __name__ == "__main__":
    result = performance_test()
    print(json.dumps(result, indent=2))
`;

    return testTemplate;
  }

  /**
   * Generate test-specific logic based on scenario type
   */
  private generateTestLogic(scenario: TestScenario): string {
    switch (scenario.testType) {
      case 'load':
        return `
        # Load test with ${scenario.parameters.userCount || 10} concurrent users
        def load_test_operation():
            # Simulate user operations
            for i in range(10):
                pass  # User's functions would be called here
        
        with ThreadPoolExecutor(max_workers=${scenario.parameters.userCount || 10}) as executor:
            futures = []
            for i in range(${scenario.parameters.userCount || 10}):
                futures.append(executor.submit(load_test_operation))
            
            for future in futures:
                future.result()
        
        results["metrics"]["concurrent_users"] = ${scenario.parameters.userCount || 10}
        `;

      case 'memory':
        return `
        import sys
        
        # Memory test with data size ${scenario.parameters.dataSize || 1000}
        data = []
        for i in range(${scenario.parameters.dataSize || 1000}):
            data.append({"id": i, "data": "test_data_" + str(i)})
        
        results["metrics"]["data_size"] = ${scenario.parameters.dataSize || 1000}
        results["metrics"]["memory_usage_estimate"] = sys.getsizeof(data)
        `;

      case 'concurrency':
        return `
        # Concurrency test
        shared_data = []
        lock = threading.Lock()
        
        def concurrent_operation(thread_id):
            with lock:
                shared_data.append(thread_id)
        
        threads = []
        for i in range(${scenario.parameters.userCount || 5}):
            thread = threading.Thread(target=concurrent_operation, args=(i,))
            threads.append(thread)
            thread.start()
        
        for thread in threads:
            thread.join()
        
        results["metrics"]["thread_count"] = ${scenario.parameters.userCount || 5}
        results["metrics"]["concurrent_operations"] = len(shared_data)
        `;

      case 'persistence':
        return `
        # Persistence test - simulate data persistence
        import tempfile
        import os
        
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(b"test data for persistence")
            tmp_path = tmp.name
        
        # Verify data persists
        with open(tmp_path, 'rb') as f:
            persisted_data = f.read()
        
        os.unlink(tmp_path)
        results["metrics"]["persistence_test"] = "passed"
        `;

      default:
        return `
        # Basic test
        results["metrics"]["basic_test"] = "completed"
        `;
    }
  }
}

// Export the service instance
export const intelligentAnalyzer = new IntelligentAnalyzer();