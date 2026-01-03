/**
 * Problem Validator Component
 * 
 * Validates all Smart Practice problems by running their solutions against test cases.
 * This component can be added to the app for validation.
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { buildPythonTestHarness, normalizeSmartPracticeTestCases } from '../../utils/pythonTestHarness';
import { runPythonCode } from '../../utils/pyodideRunner';
import { getAllPracticeExercises } from '../../utils/practiceExerciseRegistry';

interface ValidationResult {
  problemId: string;
  title: string;
  passed: boolean;
  error?: string;
  failedTestCases?: number;
  totalTestCases?: number;
}

export function ProblemValidator() {
  const [validating, setValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [summary, setSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
  } | null>(null);

  const validateProblem = async (problem: {
    id: string;
    title: string;
    solution: string;
    testCases: Array<{ input: string; expectedOutput: string; hidden?: boolean }>;
  }): Promise<ValidationResult> => {
    if (!problem.solution || !problem.testCases || problem.testCases.length === 0) {
      return {
        problemId: problem.id,
        title: problem.title,
        passed: false,
        error: 'No solution or test cases'
      };
    }

    try {
      const normalizedTestCases = normalizeSmartPracticeTestCases(problem.testCases);
      const testCode = buildPythonTestHarness(problem.solution, normalizedTestCases);
      const result = await runPythonCode(testCode);

      if (result.error) {
        return {
          problemId: problem.id,
          title: problem.title,
          passed: false,
          error: result.error,
          totalTestCases: problem.testCases.length
        };
      }

      // Try to parse JSON results from output
      let testResults: any[] = [];
      try {
        const jsonMatch = result.output.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          testResults = Array.isArray(parsed) ? parsed : [parsed];
        }
      } catch (e) {
        // Check if output indicates success
        if (result.output.includes('All tests passed') || result.output.toLowerCase().includes('passed')) {
          return {
            problemId: problem.id,
            title: problem.title,
            passed: true,
            totalTestCases: problem.testCases.length
          };
        }
      }

      const passed = testResults.length > 0 && testResults.every((r: any) => r.passed);
      const failedCount = testResults.filter((r: any) => !r.passed).length;

      return {
        problemId: problem.id,
        title: problem.title,
        passed,
        failedTestCases: failedCount,
        totalTestCases: testResults.length || problem.testCases.length
      };
    } catch (error: any) {
      return {
        problemId: problem.id,
        title: problem.title,
        passed: false,
        error: error.message || String(error)
      };
    }
  };

  const startValidation = async () => {
    const problems = getAllPracticeExercises();
    setValidating(true);
    setResults([]);
    setCurrentIndex(0);
    setSummary(null);

    const validationResults: ValidationResult[] = [];
    let passedCount = 0;
    let failedCount = 0;

    // Process in small batches to avoid blocking
    const batchSize = 5;
    for (let i = 0; i < problems.length; i += batchSize) {
      setCurrentIndex(i);
      const batch = problems.slice(i, i + batchSize);

      const batchResults = await Promise.all(
        batch.map(problem => validateProblem(problem))
      );

      for (const result of batchResults) {
        validationResults.push(result);
        if (result.passed) {
          passedCount++;
        } else {
          failedCount++;
        }
      }

      setResults([...validationResults]);

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setSummary({
      total: problems.length,
      passed: passedCount,
      failed: failedCount
    });
    setValidating(false);
  };

  const failedResults = results.filter(r => !r.passed);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Problem Validator</h2>
      
      <Button 
        onClick={startValidation} 
        disabled={validating}
        className="mb-4"
      >
        {validating ? `Validating... ${currentIndex}/${results.length}` : 'Validate All Problems'}
      </Button>

      {summary && (
        <div className="mb-4 p-4 bg-slate-100 rounded">
          <h3 className="font-bold mb-2">Summary</h3>
          <p>Total: {summary.total}</p>
          <p className="text-green-600">Passed: {summary.passed}</p>
          <p className="text-red-600">Failed: {summary.failed}</p>
        </div>
      )}

      {failedResults.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Failed Problems ({failedResults.length})</h3>
          <div className="max-h-96 overflow-y-auto">
            {failedResults.slice(0, 100).map((result, idx) => (
              <div key={idx} className="p-2 border-b">
                <p className="font-medium">{result.problemId}: {result.title}</p>
                {result.error && <p className="text-red-600 text-sm">Error: {result.error}</p>}
                {result.failedTestCases !== undefined && (
                  <p className="text-sm">Failed: {result.failedTestCases}/{result.totalTestCases} tests</p>
                )}
              </div>
            ))}
            {failedResults.length > 100 && (
              <p className="text-sm text-gray-500">... and {failedResults.length - 100} more</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

