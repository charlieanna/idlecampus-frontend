import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Code as CodeIcon, Eye, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ComplexitySelector, ComplexityFeedback } from './ComplexitySelector';
import { TestResultsPanel } from './TestResultsPanel';
import { OutputPanel } from './OutputPanel';
import { CodeEditorCore } from './CodeEditorCore';

interface CodeEditorProps {
  initialCode?: string;
  onRun?: (code: string, complexity?: { time: string; space: string }) => { success: boolean; output: string; error?: string; complexityFeedback?: ComplexityFeedback; testResults?: any[] } | Promise<{ success: boolean; output: string; error?: string; complexityFeedback?: ComplexityFeedback; testResults?: any[] }>;
  expectedOutput?: any;
  readOnly?: boolean;
  language?: 'javascript' | 'python';
  solution?: string | { text?: string; code?: string }; // Optional solution code for testing
  requireComplexity?: boolean; // If true, show complexity dropdowns (defaults to true)
  targetComplexity?: {
    time: string;
    space: string;
  };
  onHintRequest?: () => void; // Callback when user clicks Hint button
  onNext?: () => void; // Callback when user clicks Continue after success
  hasNext?: boolean; // Whether there's a next section
  exerciseTitle?: string; // Title of the current exercise for success message
}

const COMPLEXITY_OPTIONS = [
  // Constant
  'O(1)',
  // Logarithmic
  'O(log n)',
  'O(log m)',
  'O(log k)',
  'O(log(m * n))',
  // Linear
  'O(n)',
  'O(m)',
  'O(k)',
  'O(t)',
  'O(h)',
  'O(w)',
  'O(W)',
  'O(K)',
  // Linear combinations
  'O(n + m)',
  'O(V + E)',
  'O(E log V)',
  // Linearithmic
  'O(n log n)',
  'O(n log m)',
  'O(n log k)',
  'O(N log K)',
  // Quadratic / Matrix
  'O(n * m)',
  'O(n*m)',
  'O(m * n)',
  'O(m*n)',
  'O(n × m)',
  'O(n*W)',
  'O(n * t)',
  'O(r * c)',
  'O(r·c)',
  'O(r*c)',
  'O(n·k)',
  'O(n²)',
  'O(n³)',
  // Exponential
  'O(2^n)',
  'O(2^t)',
  'O(2^n × n)',
  'O(n * 2^n)',
  'O(26^k × m)',
  'O(26^k * m)',
  'O(n!)',
  // Other
  'O(√n)',
  'O(max(m, n))',
  'O(min(n, m))',
];

/**
 * Clean solution code before inserting into editor.
 * - Normalizes tabs to spaces for Python consistency
 * - Removes duplicate function definitions (keeps first occurrence)
 */
const cleanSolutionCode = (code: string): string => {
  if (!code) return code;

  // Replace all tabs with 4 spaces for Python consistency
  let cleaned = code.replace(/\t/g, '    ');

  // Remove duplicate function definitions - keep only the first occurrence
  const lines = cleaned.split('\n');
  const seen = new Set<string>();
  const filteredLines: string[] = [];
  let skipUntilNextTopLevel = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const defMatch = line.match(/^def\s+(\w+)\s*\(/);

    if (defMatch) {
      const funcName = defMatch[1];

      if (seen.has(funcName)) {
        // Skip this duplicate function and its body
        skipUntilNextTopLevel = true;
        continue;
      }
      seen.add(funcName);
      skipUntilNextTopLevel = false;
    }

    if (skipUntilNextTopLevel) {
      // Skip lines until we hit a non-indented, non-empty, non-comment line
      const trimmed = line.trim();
      if (trimmed && !line.startsWith(' ') && !line.startsWith('    ') && !trimmed.startsWith('#')) {
        skipUntilNextTopLevel = false;
        filteredLines.push(line);
      }
      continue;
    }

    filteredLines.push(line);
  }

  return filteredLines.join('\n').trim();
};

export function CodeEditor({ initialCode = '', onRun, expectedOutput, readOnly = false, language = 'javascript', solution, requireComplexity = true, targetComplexity, onHintRequest, onNext, hasNext = false, exerciseTitle }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  // Complexity dropdowns start empty - user must select them
  const [timeComplexity, setTimeComplexity] = useState<string>('');
  const [spaceComplexity, setSpaceComplexity] = useState<string>('');
  const [complexityFeedback, setComplexityFeedback] = useState<ComplexityFeedback | null>(null);
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [showOutput, setShowOutput] = useState(false);

  // Reset state when exercise changes (new initialCode)
  useEffect(() => {
    setCode(initialCode);
    setOutput('');
    setError('');
    setIsSuccess(null);
    setComplexityFeedback(null);
    setTestResults(null);
    // Reset complexity dropdowns to empty for new exercise
    setTimeComplexity('');
    setSpaceComplexity('');
  }, [initialCode]); // Only trigger on new exercise

  const handleRun = async () => {
    setOutput('');
    setError('');
    setIsSuccess(null);
    setComplexityFeedback(null);
    setTestResults(null);
    setIsRunning(true);
    setShowOutput(true); // Show output panel when user runs code

    // Validate complexity if required - user must select both before running
    if (requireComplexity && (!timeComplexity || !spaceComplexity)) {
      setError('Please select both time and space complexity before running');
      setIsRunning(false);
      setIsSuccess(false);
      setShowOutput(true);
      return;
    }

    try {
      if (onRun) {
        // Show initializing message for Python
        if (language === 'python') {
          setOutput('Initializing Python environment...');
        }

        // Pass complexity values if required
        const complexity = requireComplexity ? { time: timeComplexity, space: spaceComplexity } : undefined;
        const result = await onRun(code, complexity);

        setOutput(result.output);
        setIsSuccess(result.success);
        if (result.error) {
          setError(result.error);
        }
        if (result.complexityFeedback) {
          setComplexityFeedback(result.complexityFeedback);
        }
        if (result.testResults) {
          setTestResults(result.testResults);
        }
      } else {
        // Default execution
        try {
          const func = new Function(code);
          const result = func();
          setOutput(String(result));
          setIsSuccess(true);
        } catch (err: any) {
          setError(err.message);
          setIsSuccess(false);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setIsSuccess(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setError('');
    setIsSuccess(null);
    setShowOutput(false); // Hide output panel when resetting
  };

  const handleShowSolution = () => {
    if (solution) {
      // Handle solution as string or object with .text property
      let solutionText = typeof solution === 'string'
        ? solution
        : (solution?.text || solution?.code || '');

      // Extract Python code from markdown code blocks if present
      let codeToSet = solutionText;
      const pythonCodeMatch = solutionText.match(/```python\n([\s\S]*?)```/);
      if (pythonCodeMatch && pythonCodeMatch[1]) {
        codeToSet = pythonCodeMatch[1].trim();
      }

      // Clean up solution code: remove nested function definitions and fix indentation issues
      codeToSet = cleanSolutionCode(codeToSet);

      setCode(codeToSet);
      setOutput('');
      setError('');
      setIsSuccess(null);
      setShowOutput(false); // Hide output panel to show complexity dropdowns
      setComplexityFeedback(null); // Clear any previous complexity feedback

      // Also set the correct complexity values
      // Use targetComplexity if provided, otherwise default to O(n)/O(1)
      const defaultComplexity = { time: 'O(n)', space: 'O(1)' };
      const effectiveComplexity = targetComplexity || defaultComplexity;

      // Ensure values match the dropdown options exactly
      let timeValue = effectiveComplexity.time || '';
      let spaceValue = effectiveComplexity.space || '';

      // Normalize complexity strings to match dropdown options
      const normalizeComplexity = (value: string): string => {
        if (!value) return '';

        // Helper to normalize a string for comparison (replace × with *, normalize spaces)
        const normalizeForCompare = (s: string) =>
          s.replace(/×/g, '*').replace(/\s+/g, ' ').toLowerCase();

        // Handle range expressions like "O(m) to O(26^k × m)" - extract the worst case
        if (value.toLowerCase().includes(' to ')) {
          const parts = value.split(/ to /i);
          if (parts.length === 2) {
            // Use the worst case (second part)
            value = parts[1].trim();
          }
        }

        // Handle special mappings
        const specialMappings: Record<string, string> = {
          'o(total chars)': 'O(m)', // "O(total chars)" maps to O(m) where m is word length
          'o(total characters)': 'O(m)',
          'o(n*m)': 'O(n * m)',
          'o(m*n)': 'O(m * n)',
        };

        const normalizedLower = normalizeForCompare(value);
        if (specialMappings[normalizedLower]) {
          value = specialMappings[normalizedLower];
        }

        // Try exact match first
        let match = COMPLEXITY_OPTIONS.find(opt =>
          opt.toLowerCase() === value.toLowerCase()
        );
        if (match) return match;

        // Try match after normalizing both sides
        match = COMPLEXITY_OPTIONS.find(opt =>
          normalizeForCompare(opt) === normalizeForCompare(value)
        );
        if (match) return match;

        // Try match after replacing ² with ^2
        match = COMPLEXITY_OPTIONS.find(opt =>
          opt.replace('²', '^2').toLowerCase() === value.replace('²', '^2').toLowerCase()
        );
        if (match) return match;

        // Handle exponential patterns like "O(26^k × m)" - try to match exact or similar exponential patterns
        const expMatch = value.match(/o\((\d+)\^(\w+)\s*[×*]\s*(\w+)\)/i);
        if (expMatch) {
          // First try exact match
          match = COMPLEXITY_OPTIONS.find(opt => {
            const optExpMatch = opt.match(/o\((\d+)\^(\w+)\s*[×*]\s*(\w+)\)/i);
            if (!optExpMatch) return false;
            // Match if base and variables are the same (e.g., 26^k × m matches 26^k × m)
            return optExpMatch[1] === expMatch[1] &&
              optExpMatch[2] === expMatch[2] &&
              optExpMatch[3] === expMatch[3];
          });
          if (match) return match;

          // If no exact match, try to find any exponential × linear pattern
          match = COMPLEXITY_OPTIONS.find(opt => {
            const optExpMatch = opt.match(/o\((\d+)\^(\w+)\s*[×*]\s*(\w+)\)/i);
            return optExpMatch !== null;
          });
          if (match) return match;
        }

        // For complex expressions like "O(n log n + n×m + k)", try to find closest match
        const normalized = normalizeForCompare(value);
        if (normalized.includes('+')) {
          // Try to match the most complex part
          const parts = normalized.split('+').map(p => p.trim());
          for (const part of parts) {
            match = COMPLEXITY_OPTIONS.find(opt =>
              normalizeForCompare(opt).includes(part) ||
              part.includes(normalizeForCompare(opt))
            );
            if (match) return match;
          }
        }

        // Try partial matching - check if any option is contained in the value or vice versa
        match = COMPLEXITY_OPTIONS.find(opt => {
          const optNorm = normalizeForCompare(opt);
          const valNorm = normalizeForCompare(value);
          return optNorm.includes(valNorm) || valNorm.includes(optNorm);
        });
        if (match) return match;

        // Last resort: try to find any option that shares key terms
        // Extract key terms from value (like "m", "n", "k", etc.)
        const keyTerms = value.match(/\b([a-z])\b/gi) || [];
        if (keyTerms.length > 0) {
          for (const term of keyTerms) {
            match = COMPLEXITY_OPTIONS.find(opt =>
              normalizeForCompare(opt).includes(term.toLowerCase())
            );
            if (match) return match;
          }
        }

        // If still no match, return empty string so dropdown shows "Select..." (better UX than wrong value)
        return '';
      };

      const normalizedTime = normalizeComplexity(timeValue);
      const normalizedSpace = normalizeComplexity(spaceValue);

      setTimeComplexity(normalizedTime);
      setSpaceComplexity(normalizedSpace);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  return (
    <Card className="flex flex-col bg-slate-900 border-slate-700 h-full relative w-full min-w-0" style={{ width: '100%', minWidth: 0, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
      {/* #region agent log */}
      {/* #endregion */}
      <div className="flex items-center justify-between p-3 border-b border-slate-700 min-w-0 relative z-10 flex-shrink-0">
        <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <CodeIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="text-blue-400 flex-shrink-0">Code Editor</span>
          {expectedOutput !== undefined && (
            <Badge className="bg-orange-600 text-white text-xs ml-2 flex-shrink-0">
              Exercise
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 relative z-20">
          {/* Hint button - always shown for consistency */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 flex-shrink-0 px-2 ${onHintRequest ? 'text-yellow-500 hover:text-yellow-400 hover:bg-yellow-950/50 border border-yellow-600/30' : 'text-slate-500 cursor-not-allowed opacity-50'}`}
            onClick={onHintRequest || undefined}
            disabled={!onHintRequest}
            title={onHintRequest ? 'Get a hint' : 'No hints available for this exercise'}
          >
            <Lightbulb className="w-4 h-4 mr-1.5" />
            <span>Hint</span>
          </Button>

          {/* Solution button - always shown for consistency */}
          <Button
            variant="ghost"
            size="sm"
            className={`h-7 flex-shrink-0 px-2 ${solution ? 'text-amber-400 hover:text-amber-300 hover:bg-slate-800' : 'text-slate-600 cursor-not-allowed'}`}
            onClick={solution ? handleShowSolution : undefined}
            disabled={!solution}
            title={solution ? 'Show solution' : 'No solution available for this exercise'}
          >
            <Eye className="w-3 h-3 mr-1" />
            <span>Solution</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 flex-shrink-0 px-2 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={handleReset}
            title="Reset code"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            <span>Reset</span>
          </Button>
          <Button
            size="sm"
            className="h-7 bg-green-600 hover:bg-green-700 flex-shrink-0 px-3"
            onClick={handleRun}
            disabled={readOnly || isRunning}
            style={{ visibility: 'visible', opacity: 1 }}
          >
            <Play className="w-3 h-3 mr-1" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>

      {/* Content area - Monaco Editor + Complexity Section */}
      <div className="flex-1 min-h-0 flex flex-col overflow-auto" style={{ display: 'flex', flexDirection: 'column' }}>

        {/* Complexity Section - Moved to top */}
        {requireComplexity && (
          <div className="border-b border-slate-700">
            <ComplexitySelector
              timeComplexity={timeComplexity}
              spaceComplexity={spaceComplexity}
              onTimeChange={setTimeComplexity}
              onSpaceChange={setSpaceComplexity}
              complexityFeedback={complexityFeedback}
              complexityOptions={COMPLEXITY_OPTIONS}
            />
          </div>
        )}

        {/* Monaco Editor - Takes remaining space */}
        <div className="flex-1 overflow-hidden" style={{ minHeight: '200px' }}>
          <CodeEditorCore
            code={code}
            language={language}
            readOnly={readOnly}
            onChange={handleEditorChange}
            height="100%"
          />
        </div>
      </div>

      {/* LeetCode-style Output Panel at Bottom */}
      {showOutput && requireComplexity && (
        <TestResultsPanel
          isRunning={isRunning}
          isSuccess={isSuccess}
          error={error}
          output={output}
          testResults={testResults}
          complexityFeedback={complexityFeedback}
          timeComplexity={timeComplexity}
          spaceComplexity={spaceComplexity}
          requireComplexity={requireComplexity}
          hasNext={hasNext}
          onNext={onNext}
          onClose={() => setShowOutput(false)}
        />
      )}

      {/* Output only - no complexity required */}
      {!requireComplexity && showOutput && (
        <OutputPanel
          isRunning={isRunning}
          isSuccess={isSuccess}
          error={error}
          output={output}
          onClose={() => setShowOutput(false)}
        />
      )}

    </Card>
  );
}
