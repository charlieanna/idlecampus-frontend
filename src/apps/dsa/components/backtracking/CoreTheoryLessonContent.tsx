import React from 'react';
import { Card } from '../ui/card';
import { Alert } from '../ui/alert';
import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const CoreTheoryLessonContent: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-500" />
          The Universal Backtracking Template
        </h2>
        <p className="text-muted-foreground mb-4">
          After exploring different patterns, let's extract the core theory that unifies all backtracking problems.
          This template is the foundation that powers Subsets, Permutations, Combinations, N-Queens, and beyond.
        </p>
        <Alert className="border-amber-500/30 bg-amber-500/10">
          <Sparkles className="w-4 h-4" />
          <div>
            <strong>The Power of Abstraction:</strong> Once you master this template, you can solve 
            90% of backtracking problems by just identifying what constitutes a choice, a valid state, 
            and a complete solution.
          </div>
        </Alert>
      </Card>

      {/* The Universal Template */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">🎯 The Master Template</h3>
        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="explained">Explained</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="mt-4">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`def backtrack(state, choices, result):
    # 1. Base Case: Is this a complete/valid solution?
    if is_solution(state):
        result.append(copy(state))
        return
    
    # 2. Get available choices for current state
    for choice in get_choices(state):
        # 3. Make the choice (modify state)
        make_choice(state, choice)
        
        # 4. Recurse with new state
        backtrack(state, choices, result)
        
        # 5. Undo the choice (backtrack!)
        undo_choice(state, choice)

# The beauty: Same structure, different implementations!`}</code>
            </pre>
          </TabsContent>

          <TabsContent value="explained" className="mt-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">1</span>
                  State Representation
                </h4>
                <p className="text-sm text-muted-foreground">
                  The current partial solution being built. Could be an array, a string, 
                  a board configuration, or any data structure that represents progress.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">2</span>
                  Choice Space
                </h4>
                <p className="text-sm text-muted-foreground">
                  The available decisions at each step. These depend on the current state 
                  and problem constraints.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">3</span>
                  Make & Undo
                </h4>
                <p className="text-sm text-muted-foreground">
                  The essence of backtracking: try a choice, explore its consequences, 
                  then undo it to try alternatives.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">4</span>
                  Solution Check
                </h4>
                <p className="text-sm text-muted-foreground">
                  Determines when we've found a valid/complete solution. This varies dramatically 
                  between problems.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-3 text-blue-600">Subsets Pattern</h4>
                <ul className="text-sm space-y-2">
                  <li><strong>State:</strong> Current subset being built</li>
                  <li><strong>Choices:</strong> Include or exclude element</li>
                  <li><strong>Solution:</strong> Every state is valid</li>
                  <li><strong>Base:</strong> Processed all elements</li>
                </ul>
                <pre className="bg-muted p-2 mt-3 rounded text-xs">
                  <code>{`backtrack(index, path):
  result.append(path[:])
  for i in range(index, n):
    path.append(nums[i])
    backtrack(i+1, path)
    path.pop()`}</code>
                </pre>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3 text-purple-600">Permutations Pattern</h4>
                <ul className="text-sm space-y-2">
                  <li><strong>State:</strong> Current permutation</li>
                  <li><strong>Choices:</strong> Any unused element</li>
                  <li><strong>Solution:</strong> Used all elements</li>
                  <li><strong>Base:</strong> Path length equals n</li>
                </ul>
                <pre className="bg-muted p-2 mt-3 rounded text-xs">
                  <code>{`backtrack(path, remaining):
  if not remaining:
    result.append(path[:])
  for i in range(len(remaining)):
    path.append(remaining[i])
    backtrack(path, remaining[:i]+remaining[i+1:])
    path.pop()`}</code>
                </pre>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3 text-green-600">Combinations Pattern</h4>
                <ul className="text-sm space-y-2">
                  <li><strong>State:</strong> Current combination</li>
                  <li><strong>Choices:</strong> Numbers from start to n</li>
                  <li><strong>Solution:</strong> Path has k elements</li>
                  <li><strong>Base:</strong> len(path) == k</li>
                </ul>
                <pre className="bg-muted p-2 mt-3 rounded text-xs">
                  <code>{`backtrack(start, path):
  if len(path) == k:
    result.append(path[:])
  for i in range(start, n+1):
    path.append(i)
    backtrack(i+1, path)
    path.pop()`}</code>
                </pre>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-3 text-red-600">N-Queens Pattern</h4>
                <ul className="text-sm space-y-2">
                  <li><strong>State:</strong> Board configuration</li>
                  <li><strong>Choices:</strong> Valid columns in row</li>
                  <li><strong>Solution:</strong> All queens placed</li>
                  <li><strong>Base:</strong> row == n</li>
                </ul>
                <pre className="bg-muted p-2 mt-3 rounded text-xs">
                  <code>{`backtrack(row):
  if row == n:
    result.append(board[:])
  for col in range(n):
    if isValid(row, col):
      board[row] = col
      backtrack(row+1)
      board[row] = -1`}</code>
                </pre>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Decision Tree Visualization */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">🌳 The Decision Tree Mental Model</h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <h4 className="font-semibold mb-2">Visualize Every Backtracking Problem as a Tree</h4>
            <div className="space-y-3 mt-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <div>
                  <strong>Root:</strong> Empty/initial state
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <div>
                  <strong>Edges:</strong> Choices/decisions
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <div>
                  <strong>Nodes:</strong> Intermediate states
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <div>
                  <strong>Leaves:</strong> Complete solutions (or dead ends)
                </div>
              </div>
            </div>
          </div>

          <Alert className="border-green-500/30 bg-green-500/10">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <div>
              <strong>Key Insight:</strong> Backtracking is just a DFS traversal of this decision tree, 
              where we build the tree implicitly as we explore, and prune branches that can't lead to valid solutions.
            </div>
          </Alert>
        </div>
      </Card>

      {/* Common Optimizations */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">⚡ Universal Optimization Techniques</h3>
        <div className="space-y-3">
          <div className="border rounded-lg p-3">
            <h4 className="font-semibold mb-1">1. Pruning</h4>
            <p className="text-sm text-muted-foreground">
              Stop exploring a branch as soon as you know it can't lead to a valid solution.
              Example: In N-Queens, skip columns that would create conflicts.
            </p>
          </div>

          <div className="border rounded-lg p-3">
            <h4 className="font-semibold mb-1">2. Sorting</h4>
            <p className="text-sm text-muted-foreground">
              Sort input to enable better pruning or handle duplicates.
              Example: Sort array for combination sum to stop early when sum exceeds target.
            </p>
          </div>

          <div className="border rounded-lg p-3">
            <h4 className="font-semibold mb-1">3. Memoization</h4>
            <p className="text-sm text-muted-foreground">
              Cache results of expensive computations to avoid redundant work.
              Example: In word break problems, cache which substrings can be formed.
            </p>
          </div>

          <div className="border rounded-lg p-3">
            <h4 className="font-semibold mb-1">4. Smart State Representation</h4>
            <p className="text-sm text-muted-foreground">
              Use efficient data structures to represent state and check constraints.
              Example: Use bitmasks instead of arrays for subset problems when n ≤ 32.
            </p>
          </div>
        </div>
      </Card>

      {/* When to Use Backtracking */}
      <Card className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
        <h3 className="text-xl font-bold mb-4">🎯 When to Use Backtracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-green-600 mb-2">✅ Use When:</h4>
            <ul className="text-sm space-y-1">
              <li>• Finding ALL solutions</li>
              <li>• Exploring ALL paths</li>
              <li>• Generating ALL combinations/permutations</li>
              <li>• Problems with "generate", "list", "find all"</li>
              <li>• Constraint satisfaction problems</li>
              <li>• Decision problems with multiple choices</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-red-600 mb-2">❌ Avoid When:</h4>
            <ul className="text-sm space-y-1">
              <li>• Finding ONE optimal solution (try DP/Greedy)</li>
              <li>• Counting solutions only (try DP)</li>
              <li>• Problems with mathematical formulas</li>
              <li>• Graph shortest path (use BFS/Dijkstra)</li>
              <li>• Problems with large input (exponential time)</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Practice Checklist */}
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">📝 Your Backtracking Checklist</h3>
        <div className="space-y-2">
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>Can I draw the decision tree for this problem?</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>What constitutes a "choice" at each step?</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>How do I represent the current state?</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>When is a solution complete/valid?</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>How do I make and undo choices?</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>Can I prune invalid branches early?</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <span>Are there duplicate states I should avoid?</span>
          </label>
        </div>
      </Card>
    </div>
  );
};

export default CoreTheoryLessonContent;