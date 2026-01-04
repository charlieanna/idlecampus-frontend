import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Brain,
  Zap,
  AlertCircle,
  CheckCircle,
  Code2,
  TreePine,
  Hash,
  Timer
} from 'lucide-react';

export default function MemoizationLessonContent() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showMemoization, setShowMemoization] = useState(false);

  // Tree structure for Fibonacci with repeated nodes
  const fibTree = {
    value: 'fib(5)',
    left: {
      value: 'fib(4)',
      left: {
        value: 'fib(3)',
        left: { value: 'fib(2)', left: { value: 'fib(1)' }, right: { value: 'fib(0)' } },
        right: { value: 'fib(1)' }
      },
      right: {
        value: 'fib(2)',
        left: { value: 'fib(1)' },
        right: { value: 'fib(0)' }
      }
    },
    right: {
      value: 'fib(3)',
      left: {
        value: 'fib(2)',
        left: { value: 'fib(1)' },
        right: { value: 'fib(0)' }
      },
      right: { value: 'fib(1)' }
    }
  };

  // Identify repeated computations
  const repeatedNodes = new Set(['fib(3)', 'fib(2)', 'fib(1)', 'fib(0)']);
  const memoizedResults = new Map([
    ['fib(0)', 0],
    ['fib(1)', 1],
    ['fib(2)', 1],
    ['fib(3)', 2],
    ['fib(4)', 3],
    ['fib(5)', 5]
  ]);

  const TreeNode: React.FC<{ 
    node: any, 
    x: number, 
    y: number, 
    level: number,
    isRepeated?: boolean 
  }> = ({ node, x, y, level, isRepeated = false }) => {
    if (!node) return null;
    
    const isSelected = selectedNode === node.value;
    const isMemoized = showMemoization && memoizedResults.has(node.value);
    const isRepeat = repeatedNodes.has(node.value);
    
    const offset = 150 / (level + 1);
    
    return (
      <>
        {/* Draw lines to children */}
        {node.left && (
          <line
            x1={x}
            y1={y}
            x2={x - offset}
            y2={y + 60}
            stroke={showMemoization && isRepeat ? "#f59e0b" : "#6b7280"}
            strokeWidth="2"
            strokeDasharray={isRepeat ? "5,5" : "0"}
          />
        )}
        {node.right && (
          <line
            x1={x}
            y1={y}
            x2={x + offset}
            y2={y + 60}
            stroke={showMemoization && isRepeat ? "#f59e0b" : "#6b7280"}
            strokeWidth="2"
            strokeDasharray={isRepeat ? "5,5" : "0"}
          />
        )}
        
        {/* Draw node */}
        <g
          className="cursor-pointer"
          onClick={() => setSelectedNode(node.value)}
        >
          <circle
            cx={x}
            cy={y}
            r="25"
            fill={
              isMemoized ? "#10b981" :
              isRepeat && showMemoization ? "#fbbf24" :
              isSelected ? "#3b82f6" : 
              "#ffffff"
            }
            stroke={
              isRepeated ? "#ef4444" :
              isSelected ? "#3b82f6" : "#d1d5db"
            }
            strokeWidth={isRepeated ? "3" : "2"}
            strokeDasharray={isRepeated && !showMemoization ? "3,3" : "0"}
          />
          <text
            x={x}
            y={y + 5}
            textAnchor="middle"
            fontSize="12"
            fill={isMemoized || (isRepeat && showMemoization) ? "white" : "black"}
            fontWeight="600"
          >
            {node.value}
          </text>
          {isMemoized && (
            <text
              x={x}
              y={y + 40}
              textAnchor="middle"
              fontSize="10"
              fill="#10b981"
              fontWeight="bold"
            >
              = {memoizedResults.get(node.value)}
            </text>
          )}
        </g>
        
        {/* Recursively draw children */}
        {node.left && (
          <TreeNode 
            node={node.left} 
            x={x - offset} 
            y={y + 60} 
            level={level + 1}
            isRepeated={isRepeated || (showMemoization && isRepeat)}
          />
        )}
        {node.right && (
          <TreeNode 
            node={node.right} 
            x={x + offset} 
            y={y + 60} 
            level={level + 1}
            isRepeated={isRepeated || (showMemoization && isRepeat)}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Memoization in Backtracking</h1>
          <p className="text-sm text-muted-foreground">Optimize by caching repeated subproblems</p>
        </div>
      </div>

      {/* Introduction */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Why Memoization?</h3>
              <p className="text-sm text-muted-foreground">
                In many backtracking problems, we compute the same subproblems multiple times.
                Memoization stores these results to avoid redundant calculations, dramatically
                improving performance from exponential to polynomial time complexity.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Visualization */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TreePine className="h-5 w-5" />
              Visualizing Repeated Subproblems
            </h3>
            <Button
              variant={showMemoization ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMemoization(!showMemoization)}
            >
              {showMemoization ? "Show Memoized" : "Show Original"}
            </Button>
          </div>

          <Alert className={showMemoization ? "border-green-500/50 bg-green-50 dark:bg-green-950/20" : ""}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {showMemoization ? (
                <>
                  <strong>With Memoization:</strong> Green nodes show cached results. 
                  Yellow nodes indicate where we'd normally recalculate but now use cached values.
                  Total calls reduced from 15 to 6!
                </>
              ) : (
                <>
                  <strong>Without Memoization:</strong> Notice the repeated calculations! 
                  The dashed red circles show nodes that are computed multiple times.
                  Click "Show Memoized" to see the optimization.
                </>
              )}
            </AlertDescription>
          </Alert>

          <div className="bg-muted/30 rounded-lg p-4 overflow-x-auto">
            <svg width="600" height="300" viewBox="0 0 600 300" className="mx-auto">
              <TreeNode node={fibTree} x={300} y={40} level={0} />
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 border-red-200 dark:border-red-900">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="h-4 w-4 text-red-500" />
                <span className="text-sm font-semibold">Without Memoization</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Time: O(2^n)</p>
                <p className="text-xs text-muted-foreground">Space: O(n) - call stack</p>
                <p className="text-xs text-muted-foreground">fib(5) calls: 15 total</p>
              </div>
            </Card>
            <Card className="p-4 border-green-200 dark:border-green-900">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span className="text-sm font-semibold">With Memoization</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Time: O(n)</p>
                <p className="text-xs text-muted-foreground">Space: O(n) - cache + stack</p>
                <p className="text-xs text-muted-foreground">fib(5) calls: 6 unique</p>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      {/* Implementation */}
      <Tabs defaultValue="pattern" className="w-full">
        <TabsList>
          <TabsTrigger value="pattern">Pattern Recognition</TabsTrigger>
          <TabsTrigger value="template">Template Code</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="pattern" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">When to Use Memoization</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Overlapping Subproblems</p>
                  <p className="text-sm text-muted-foreground">
                    The same state is reached through different paths
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Optimal Substructure</p>
                  <p className="text-sm text-muted-foreground">
                    Solution can be built from solutions of subproblems
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">State Can Be Uniquely Identified</p>
                  <p className="text-sm text-muted-foreground">
                    Parameters uniquely define each subproblem
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Memoization Template
            </h3>
            <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`def backtrack_with_memo(state, memo={}):
    # Create a unique key for this state
    key = tuple(state) if isinstance(state, list) else state
    
    # Check if we've solved this before
    if key in memo:
        return memo[key]
    
    # Base case
    if is_base_case(state):
        result = base_case_value(state)
        memo[key] = result
        return result
    
    # Recursive case
    result = initial_value()
    
    for choice in get_choices(state):
        # Make the choice
        make_choice(state, choice)
        
        # Recurse with memoization
        sub_result = backtrack_with_memo(state, memo)
        
        # Update result
        result = combine(result, sub_result)
        
        # Undo the choice (backtrack)
        undo_choice(state, choice)
    
    # Cache the result
    memo[key] = result
    return result`}</code>
            </pre>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Common Patterns</h3>
            <div className="grid gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">1. String/Array Index Memoization</h4>
                <pre className="text-sm">
                  <code>{`memo[(i, j, k)] = result  # For 3D problems
memo[(start, end)] = result  # For range problems`}</code>
                </pre>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">2. Subset/Combination Memoization</h4>
                <pre className="text-sm">
                  <code>{`memo[frozenset(items)] = result  # For sets
memo[tuple(sorted(items))] = result  # For lists`}</code>
                </pre>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-2">3. State Tuple Memoization</h4>
                <pre className="text-sm">
                  <code>{`memo[(pos, remaining, used_mask)] = result
memo[(row, col, visited_state)] = result`}</code>
                </pre>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Classic Examples</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium">Word Break (with memoization)</h4>
                <pre className="text-sm bg-muted/50 p-3 rounded mt-2">
                  <code>{`def wordBreak(s, wordDict, memo={}):
    if s in memo:
        return memo[s]
    
    if not s:
        return True
    
    for word in wordDict:
        if s.startswith(word):
            if wordBreak(s[len(word):], wordDict, memo):
                memo[s] = True
                return True
    
    memo[s] = False
    return False`}</code>
                </pre>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium">Target Sum (with memoization)</h4>
                <pre className="text-sm bg-muted/50 p-3 rounded mt-2">
                  <code>{`def findTargetSumWays(nums, target, i=0, current=0, memo={}):
    if (i, current) in memo:
        return memo[(i, current)]
    
    if i == len(nums):
        return 1 if current == target else 0
    
    # Try adding
    add = findTargetSumWays(nums, target, i+1, current+nums[i], memo)
    # Try subtracting  
    subtract = findTargetSumWays(nums, target, i+1, current-nums[i], memo)
    
    memo[(i, current)] = add + subtract
    return memo[(i, current)]`}</code>
                </pre>
              </div>
            </div>
          </Card>

          <Alert className="border-amber-500/50">
            <Hash className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> When the state space is too large, consider using 
              @lru_cache decorator in Python or limiting cache size with LRU eviction.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>

      {/* Key Takeaways */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <h3 className="text-lg font-semibold mb-3">🎯 Key Takeaways</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400">•</span>
            <span className="text-sm">Memoization transforms exponential algorithms to polynomial</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400">•</span>
            <span className="text-sm">Look for repeated subproblems in your recursion tree</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400">•</span>
            <span className="text-sm">State must be uniquely identifiable (hashable)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 dark:text-amber-400">•</span>
            <span className="text-sm">Trade space for time - cache size grows with unique states</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}