import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Code2,
  CheckCircle2,
  XCircle,
  Clock,
  Lightbulb,
  BookOpen,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { DSAProblem, TestResult, CodeSubmission } from '../../types/dsa-course';

interface PythonEditorProps {
  problem: DSAProblem;
  onSubmit?: (submission: CodeSubmission) => void;
  showHints?: boolean;
  showSolution?: boolean;
}

export function PythonEditor({
  problem,
  onSubmit,
  showHints = true,
  showSolution = true,
}: PythonEditorProps) {
  const [code, setCode] = useState(problem.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showHintsPanel, setShowHintsPanel] = useState(false);
  const [showSolutionPanel, setShowSolutionPanel] = useState(false);
  const [submissions, setSubmissions] = useState<CodeSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'submissions' | 'discussion'>('description');
  const [expandedHints, setExpandedHints] = useState<Set<number>>(new Set());

  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Simulate code execution (in real app, would call backend)
  const runCode = async () => {
    setIsRunning(true);
    
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock test results (in production, would execute Python code)
    const results: TestResult[] = problem.testCases.map((testCase, idx) => {
      // Simulate random pass/fail for demo
      const passed = Math.random() > 0.3;
      
      return {
        testCaseId: testCase.id,
        passed,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: passed ? testCase.expectedOutput : 'Wrong output',
        executionTime: Math.floor(Math.random() * 100),
      };
    });

    setTestResults(results);
    setIsRunning(false);

    const submission: CodeSubmission = {
      code,
      timestamp: new Date(),
      testResults: results,
      passed: results.every(r => r.passed),
      executionTime: results.reduce((sum, r) => sum + (r.executionTime || 0), 0),
    };

    setSubmissions([submission, ...submissions]);

    if (onSubmit) {
      onSubmit(submission);
    }
  };

  const resetCode = () => {
    setCode(problem.starterCode);
    setTestResults([]);
  };

  const toggleHint = (index: number) => {
    const newExpanded = new Set(expandedHints);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedHints(newExpanded);
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(r => r.passed);
  const passedCount = testResults.filter(r => r.passed).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-screen max-h-screen">
      {/* Left Panel - Problem Description */}
      <div className="flex flex-col overflow-hidden">
        <Card className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="submissions">
                Submissions ({submissions.length})
              </TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Problem Header */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-slate-900">{problem.title}</h2>
                    <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {problem.topic}
                    </Badge>
                    {problem.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs bg-slate-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Problem Description */}
                <div>
                  <h3 className="text-slate-900 mb-3">Problem</h3>
                  <div className="prose prose-slate max-w-none text-slate-700">
                    {problem.description}
                  </div>
                </div>

                {/* Examples */}
                {problem.examples.length > 0 && (
                  <div>
                    <h3 className="text-slate-900 mb-3">Examples</h3>
                    <div className="space-y-4">
                      {problem.examples.map((example, idx) => (
                        <Card key={idx} className="p-4 bg-slate-50">
                          <div className="space-y-2">
                            <div>
                              <div className="text-xs text-slate-600 mb-1">Input:</div>
                              <code className="text-sm font-mono text-slate-900">
                                {example.input}
                              </code>
                            </div>
                            <div>
                              <div className="text-xs text-slate-600 mb-1">Output:</div>
                              <code className="text-sm font-mono text-slate-900">
                                {example.output}
                              </code>
                            </div>
                            {example.explanation && (
                              <div>
                                <div className="text-xs text-slate-600 mb-1">Explanation:</div>
                                <div className="text-sm text-slate-700">
                                  {example.explanation}
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints.length > 0 && (
                  <div>
                    <h3 className="text-slate-900 mb-3">Constraints</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                      {problem.constraints.map((constraint, idx) => (
                        <li key={idx}>{constraint}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Complexity */}
                <div>
                  <h3 className="text-slate-900 mb-3">Expected Complexity</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-3 bg-blue-50 border-blue-200">
                      <div className="text-xs text-blue-600 mb-1">Time Complexity</div>
                      <code className="text-sm text-blue-900">{problem.timeComplexity}</code>
                    </Card>
                    <Card className="p-3 bg-purple-50 border-purple-200">
                      <div className="text-xs text-purple-600 mb-1">Space Complexity</div>
                      <code className="text-sm text-purple-900">{problem.spaceComplexity}</code>
                    </Card>
                  </div>
                </div>

                {/* Hints */}
                {showHints && problem.hints.length > 0 && (
                  <div>
                    <h3 className="text-slate-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      Hints
                    </h3>
                    <div className="space-y-2">
                      {problem.hints.map((hint, idx) => (
                        <Card key={idx} className="p-3 bg-yellow-50 border-yellow-200">
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleHint(idx)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-yellow-900">Hint {idx + 1}</span>
                            </div>
                            {expandedHints.has(idx) ? (
                              <ChevronDown className="w-4 h-4 text-yellow-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-yellow-600" />
                            )}
                          </div>
                          <AnimatePresence>
                            {expandedHints.has(idx) && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-2 text-sm text-yellow-800"
                              >
                                {hint}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions" className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {submissions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Code2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No submissions yet</p>
                    <p className="text-xs">Run your code to see results here</p>
                  </div>
                ) : (
                  submissions.map((submission, idx) => (
                    <Card
                      key={idx}
                      className={`p-4 ${
                        submission.passed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {submission.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm text-slate-900">
                            {submission.passed ? 'Accepted' : 'Wrong Answer'}
                          </span>
                        </div>
                        <span className="text-xs text-slate-600">
                          {submission.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span>
                          {submission.testResults.filter(r => r.passed).length} /{' '}
                          {submission.testResults.length} test cases passed
                        </span>
                        {submission.executionTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {submission.executionTime}ms
                          </span>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Discussion Tab */}
            <TabsContent value="discussion" className="flex-1 overflow-y-auto p-6">
              <div className="text-center py-12 text-slate-500">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Discussion coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="flex flex-col gap-4 overflow-hidden">
        {/* Code Editor */}
        <Card className="flex-1 flex flex-col">
          <div className="p-3 border-b bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700">Code</span>
              <Badge variant="outline" className="text-xs">Python 3</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetCode}
                className="h-7 text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
              {showSolution && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSolutionPanel(!showSolutionPanel)}
                  className="h-7 text-xs"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  Solution
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full p-4 pl-14 font-mono text-sm bg-slate-900 text-slate-100 resize-none focus:outline-none"
              spellCheck={false}
              style={{ lineHeight: '1.6', tabSize: 4 }}
            />
            
            {/* Line numbers */}
            <div className="absolute left-0 top-0 w-12 h-full bg-slate-800 text-slate-500 text-xs font-mono p-4 select-none pointer-events-none overflow-hidden">
              {code.split('\n').map((_, i) => (
                <div key={i} style={{ lineHeight: '1.6' }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 border-t bg-slate-50">
            <Button
              onClick={runCode}
              disabled={isRunning}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isRunning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                  </motion.div>
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Code
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="max-h-64 flex flex-col">
            <div className="p-3 border-b bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700">Test Results</span>
                <Badge
                  className={
                    allTestsPassed
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  }
                >
                  {passedCount} / {testResults.length} Passed
                </Badge>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {testResults.map((result) => (
                <Card
                  key={result.testCaseId}
                  className={`p-3 ${
                    result.passed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">
                          Test Case {result.testCaseId}
                        </span>
                        {result.executionTime && (
                          <span className="text-xs text-slate-500">
                            {result.executionTime}ms
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono">
                        <div className="text-slate-600">Input: {result.input}</div>
                        {!result.passed && (
                          <>
                            <div className="text-red-700">
                              Expected: {result.expectedOutput}
                            </div>
                            <div className="text-red-700">
                              Got: {result.actualOutput}
                            </div>
                          </>
                        )}
                        {result.error && (
                          <div className="text-red-700 mt-1">{result.error}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Solution Panel */}
        <AnimatePresence>
          {showSolutionPanel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card className="max-h-96 flex flex-col">
                <div className="p-3 border-b bg-purple-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-900">Solution</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSolutionPanel(false)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <pre className="p-4 font-mono text-xs text-slate-100 bg-slate-900 overflow-x-auto">
                    {problem.solution}
                  </pre>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
