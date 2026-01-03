import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { 
  Trophy, 
  Target,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Code2,
  Users,
  Lightbulb,
  BookOpen
} from 'lucide-react';

export default function InterviewMasteryLessonContent() {
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
  const [showApproach, setShowApproach] = useState(false);

  const interviewPatterns = [
    {
      id: 'subsets',
      name: 'Subsets Pattern',
      frequency: 'Very High',
      difficulty: 'Medium',
      companies: ['Google', 'Facebook', 'Amazon'],
      examples: ['Subsets', 'Permutations', 'Combinations', 'Letter Combinations']
    },
    {
      id: 'combination-sum',
      name: 'Combination Sum Pattern',
      frequency: 'High',
      difficulty: 'Medium-Hard',
      companies: ['Microsoft', 'Apple', 'Uber'],
      examples: ['Combination Sum I/II/III', 'Target Sum', 'Partition Equal Subset']
    },
    {
      id: 'board-games',
      name: 'Board Games Pattern',
      frequency: 'Medium',
      difficulty: 'Hard',
      companies: ['Google', 'Bloomberg', 'Airbnb'],
      examples: ['N-Queens', 'Sudoku Solver', 'Word Search', 'Android Unlock Patterns']
    },
    {
      id: 'string-matching',
      name: 'String Matching Pattern',
      frequency: 'Medium',
      difficulty: 'Hard',
      companies: ['Facebook', 'LinkedIn', 'Snapchat'],
      examples: ['Word Break', 'Palindrome Partitioning', 'Restore IP Addresses']
    }
  ];

  const approachSteps = [
    { step: 1, title: 'Identify Pattern', time: '1-2 min' },
    { step: 2, title: 'Draw Decision Tree', time: '2-3 min' },
    { step: 3, title: 'Write Template', time: '3-5 min' },
    { step: 4, title: 'Handle Edge Cases', time: '2-3 min' },
    { step: 5, title: 'Optimize', time: '5-10 min' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
          <Trophy className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Interview Mastery</h1>
          <p className="text-sm text-muted-foreground">Ace backtracking problems in technical interviews</p>
        </div>
      </div>

      {/* Introduction */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Master the Interview</h3>
              <p className="text-sm text-muted-foreground">
                Backtracking problems are interview favorites because they test your ability to
                think recursively, handle complex state, and optimize solutions. Master these
                patterns and you'll confidently tackle any backtracking question.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Common Patterns */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Common Interview Patterns
        </h3>
        <div className="space-y-3">
          {interviewPatterns.map((pattern) => (
            <motion.div
              key={pattern.id}
              className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedPattern(expandedPattern === pattern.id ? null : pattern.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold">{pattern.name}</h4>
                  <Badge variant={
                    pattern.difficulty === 'Medium' ? 'secondary' :
                    pattern.difficulty === 'Medium-Hard' ? 'default' : 'destructive'
                  }>
                    {pattern.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {pattern.frequency} Frequency
                  </Badge>
                </div>
                <motion.div
                  animate={{ rotate: expandedPattern === pattern.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.div>
              </div>
              
              {expandedPattern === pattern.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3"
                >
                  <div>
                    <p className="text-sm font-medium mb-1">Companies asking this:</p>
                    <div className="flex gap-2">
                      {pattern.companies.map(company => (
                        <Badge key={company} variant="secondary" className="text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Example problems:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {pattern.examples.map(example => (
                        <li key={example} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Step-by-Step Approach */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              45-Minute Interview Approach
            </h3>
            <Button
              size="sm"
              variant={showApproach ? "default" : "outline"}
              onClick={() => setShowApproach(!showApproach)}
            >
              {showApproach ? "Hide" : "Show"} Timeline
            </Button>
          </div>

          {showApproach && (
            <div className="space-y-3">
              {approachSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{step.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {step.time}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Interview Tactics */}
      <Tabs defaultValue="communicate" className="w-full">
        <TabsList>
          <TabsTrigger value="communicate">Communication</TabsTrigger>
          <TabsTrigger value="template">Universal Template</TabsTrigger>
          <TabsTrigger value="optimize">Optimization</TabsTrigger>
          <TabsTrigger value="mistakes">Common Mistakes</TabsTrigger>
        </TabsList>

        <TabsContent value="communicate" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communication Strategy
            </h3>
            
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-l-blue-500">
                <h4 className="font-semibold mb-2">1. Clarify the Problem</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• "Can the input contain duplicates?"</li>
                  <li>• "Should I return all solutions or just count them?"</li>
                  <li>• "What's the expected time/space complexity?"</li>
                  <li>• "Can I modify the input?"</li>
                </ul>
              </Card>

              <Card className="p-4 border-l-4 border-l-green-500">
                <h4 className="font-semibold mb-2">2. Explain Your Approach</h4>
                <div className="text-sm bg-muted/50 p-3 rounded mt-2">
                  <p className="font-mono">
                    "I'll use backtracking because we need to explore all possible {'{combinations/permutations/paths}'}.
                    I'll build the solution incrementally, and backtrack when I hit an invalid state or complete a valid solution."
                  </p>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-purple-500">
                <h4 className="font-semibold mb-2">3. Think Aloud While Coding</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• "Here I'm checking if this choice is valid..."</li>
                  <li>• "Now I'll recurse to explore this branch..."</li>
                  <li>• "I need to undo this choice before trying the next..."</li>
                  <li>• "This base case handles when we've found a solution..."</li>
                </ul>
              </Card>

              <Card className="p-4 border-l-4 border-l-orange-500">
                <h4 className="font-semibold mb-2">4. Discuss Trade-offs</h4>
                <div className="text-sm space-y-2">
                  <p>
                    <strong>Time:</strong> "This is O(2^n) for subsets because we have 2 choices per element..."
                  </p>
                  <p>
                    <strong>Space:</strong> "O(n) for the recursion stack, plus O(k) for each solution..."
                  </p>
                  <p>
                    <strong>Optimization:</strong> "We could prune by checking constraints earlier..."
                  </p>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              The Universal Interview Template
            </h3>
            
            <Alert className="mb-4">
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                Memorize this template! It works for 90% of backtracking interview problems.
              </AlertDescription>
            </Alert>

            <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`class Solution:
    def solve(self, input_data):
        result = []
        
        def backtrack(current_state, remaining_choices, index=0):
            # Base case: Found a valid solution
            if is_valid_solution(current_state):
                result.append(current_state[:])  # Deep copy!
                return  # Or continue if finding all solutions
            
            # Pruning: Early termination
            if should_prune(current_state):
                return
            
            # Try all possible choices
            for i in range(index, len(remaining_choices)):
                choice = remaining_choices[i]
                
                # Skip invalid choices
                if not is_valid_choice(choice, current_state):
                    continue
                
                # Make the choice
                current_state.append(choice)
                
                # Recurse (note the index update)
                backtrack(
                    current_state, 
                    remaining_choices, 
                    i + 1  # or i for unlimited reuse
                )
                
                # Backtrack (undo the choice)
                current_state.pop()
        
        backtrack([], input_data)
        return result

# Key variations:
# 1. Subsets: index = i + 1 (no reuse)
# 2. Permutations: track used elements
# 3. Combinations: index = i + 1, fixed size
# 4. Combination Sum: index = i (reuse allowed)`}</code>
            </pre>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Card className="p-3">
                <h5 className="font-semibold text-sm mb-1">For Subsets/Combinations</h5>
                <p className="text-xs text-muted-foreground">Use start index to avoid duplicates</p>
              </Card>
              <Card className="p-3">
                <h5 className="font-semibold text-sm mb-1">For Permutations</h5>
                <p className="text-xs text-muted-foreground">Use visited array or swap elements</p>
              </Card>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="optimize" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Interview Optimization Tips
            </h3>

            <div className="space-y-3">
              <Alert className="border-green-500/50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tip 1:</strong> Always mention these optimizations even if not implementing them.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Quick Wins (Implement These)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Sort input for better pruning opportunities</li>
                    <li>• Skip duplicates in sorted arrays</li>
                    <li>• Early termination on invalid states</li>
                    <li>• Pre-calculate constraints (like target sums)</li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Advanced (Mention These)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Memoization for overlapping subproblems</li>
                    <li>• Iterative solution using stacks (no recursion limit)</li>
                    <li>• Bit manipulation for subset problems</li>
                    <li>• Branch and bound for optimization problems</li>
                  </ul>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="mistakes" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Common Interview Mistakes
            </h3>

            <div className="space-y-3">
              {[
                {
                  mistake: "Not making deep copies",
                  fix: "Always use result.append(current[:]) not result.append(current)",
                  severity: "critical"
                },
                {
                  mistake: "Forgetting to backtrack",
                  fix: "Always undo changes after recursion (pop, unmark, etc.)",
                  severity: "critical"
                },
                {
                  mistake: "Wrong index management",
                  fix: "Subsets: i+1, Combination Sum: i, Permutations: 0 with visited",
                  severity: "high"
                },
                {
                  mistake: "Not handling duplicates",
                  fix: "Sort first, then skip: if i > start and nums[i] == nums[i-1]: continue",
                  severity: "medium"
                },
                {
                  mistake: "Inefficient pruning",
                  fix: "Check constraints before recursing, not after",
                  severity: "medium"
                },
                {
                  mistake: "Not explaining complexity",
                  fix: "Always discuss time/space complexity, even if approximate",
                  severity: "low"
                }
              ].map((item, index) => (
                <Card key={index} className={`p-4 border-l-4 ${
                  item.severity === 'critical' ? 'border-l-red-500' :
                  item.severity === 'high' ? 'border-l-orange-500' :
                  item.severity === 'medium' ? 'border-l-yellow-500' :
                  'border-l-blue-500'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.mistake}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.fix}</p>
                    </div>
                    <Badge variant={
                      item.severity === 'critical' ? 'destructive' :
                      item.severity === 'high' ? 'default' :
                      'secondary'
                    } className="text-xs">
                      {item.severity}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Practice Problems by Company */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Company-Specific Practice
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-2 text-blue-600">Google</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Generate Parentheses</li>
              <li>• Android Unlock Patterns</li>
              <li>• Letter Combinations</li>
              <li>• Word Search II</li>
            </ul>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2 text-blue-600">Facebook/Meta</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Subsets II</li>
              <li>• Permutations II</li>
              <li>• Palindrome Partitioning</li>
              <li>• Remove Invalid Parentheses</li>
            </ul>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2 text-orange-600">Amazon</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Combination Sum</li>
              <li>• N-Queens</li>
              <li>• Word Break II</li>
              <li>• Gray Code</li>
            </ul>
          </Card>
          
          <Card className="p-4">
            <h4 className="font-semibold mb-2 text-green-600">Microsoft</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Sudoku Solver</li>
              <li>• Restore IP Addresses</li>
              <li>• Partition to K Equal Subsets</li>
              <li>• Beautiful Arrangement</li>
            </ul>
          </Card>
        </div>
      </Card>

      {/* Final Tips */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold mb-3">🏆 Interview Day Checklist</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
            <p className="text-sm">Draw the decision tree first</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
            <p className="text-sm">Start with brute force, then optimize</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
            <p className="text-sm">Test with small examples</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
            <p className="text-sm">Handle edge cases explicitly</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
            <p className="text-sm">Explain your thought process</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
            <p className="text-sm">Write clean, readable code</p>
          </div>
        </div>
      </Card>
    </div>
  );
}