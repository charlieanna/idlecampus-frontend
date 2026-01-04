import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent } from '../ui/tabs';
import { Badge } from '../ui/badge';
import {
  Zap,
  Scissors,
  FastForward,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Gauge
} from 'lucide-react';

export default function OptimizationLessonContent() {
  const [selectedTechnique, setSelectedTechnique] = useState<string>('pruning');
  const [showComparison, setShowComparison] = useState(false);

  const optimizationTechniques = [
    {
      id: 'pruning',
      name: 'Pruning',
      icon: Scissors,
      description: 'Cut branches that cannot lead to valid solutions',
      improvement: '50-80%',
      complexity: 'Same Big-O, better constants'
    },
    {
      id: 'ordering',
      name: 'Smart Ordering',
      icon: TrendingUp,
      description: 'Process choices in optimal order',
      improvement: '30-60%',
      complexity: 'Can improve average case'
    },
    {
      id: 'bounds',
      name: 'Bound Checking',
      icon: Gauge,
      description: 'Use bounds to eliminate branches early',
      improvement: '40-70%',
      complexity: 'Reduces search space'
    },
    {
      id: 'symmetry',
      name: 'Symmetry Breaking',
      icon: GitBranch,
      description: 'Avoid exploring symmetric solutions',
      improvement: '20-50%',
      complexity: 'Reduces redundant paths'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
          <Zap className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Optimization Techniques</h1>
          <p className="text-sm text-muted-foreground">Make your backtracking solutions faster</p>
        </div>
      </div>

      {/* Introduction */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <FastForward className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Beyond Basic Backtracking</h3>
              <p className="text-sm text-muted-foreground">
                While backtracking gives us correct solutions, real-world problems often require
                optimization to run in reasonable time. These techniques can reduce runtime
                from hours to milliseconds without changing the fundamental algorithm.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Technique Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {optimizationTechniques.map((technique) => {
          const Icon = technique.icon;
          const isSelected = selectedTechnique === technique.id;
          
          return (
            <button
              key={technique.id}
              onClick={() => setSelectedTechnique(technique.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              <p className="text-sm font-medium">{technique.name}</p>
              <Badge variant="secondary" className="mt-2 text-xs">
                {technique.improvement}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Technique Details */}
      <Tabs value={selectedTechnique} onValueChange={setSelectedTechnique}>
        <TabsContent value="pruning" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Scissors className="h-5 w-5" />
              Pruning Techniques
            </h3>
            
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Key Insight:</strong> If you can determine that a partial solution 
                  cannot lead to a valid complete solution, abandon it immediately.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                <Card className="p-4 border-l-4 border-l-green-500">
                  <h4 className="font-semibold mb-2">1. Constraint Propagation</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    After making a choice, immediately check if it violates any constraints.
                  </p>
                  <pre className="text-sm bg-muted/50 p-3 rounded">
                    <code>{`def solve_sudoku(board, row=0, col=0):
    # Early termination on invalid state
    if not is_valid_state(board):
        return False  # Prune this branch
    
    if row == 9:
        return True
    
    # ... rest of backtracking`}</code>
                  </pre>
                </Card>

                <Card className="p-4 border-l-4 border-l-blue-500">
                  <h4 className="font-semibold mb-2">2. Forward Checking</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Look ahead to see if current choice makes future choices impossible.
                  </p>
                  <pre className="text-sm bg-muted/50 p-3 rounded">
                    <code>{`def n_queens(board, row, cols_used, diag1, diag2):
    if row == len(board):
        return True
    
    for col in range(len(board)):
        # Check all constraints before recursing
        if col in cols_used:
            continue  # Prune: column already used
        if row - col in diag1:
            continue  # Prune: diagonal conflict
        if row + col in diag2:
            continue  # Prune: anti-diagonal conflict
            
        # Only recurse if all checks pass`}</code>
                  </pre>
                </Card>

                <Card className="p-4 border-l-4 border-l-purple-500">
                  <h4 className="font-semibold mb-2">3. Branch and Bound</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Keep track of best solution so far and prune branches that can't improve it.
                  </p>
                  <pre className="text-sm bg-muted/50 p-3 rounded">
                    <code>{`def knapsack(items, capacity, current_value, best_value):
    # Calculate upper bound for remaining items
    upper_bound = current_value + calculate_bound(remaining_items)
    
    if upper_bound <= best_value:
        return  # Prune: can't beat current best
    
    # Continue with backtracking...`}</code>
                  </pre>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="ordering" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Smart Choice Ordering
            </h3>

            <div className="space-y-4">
              <Alert className="border-blue-500/50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Principle:</strong> Try the most constraining choices first to 
                  fail fast, or the most promising choices first to find solutions quickly.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Most Constrained Variable (MCV)</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose the variable with fewest legal values first.
                  </p>
                  <pre className="text-sm bg-background/50 p-3 rounded">
                    <code>{`# Sudoku: Fill cells with fewer possibilities first
def get_next_cell(board):
    min_possibilities = 10
    best_cell = None
    
    for i in range(9):
        for j in range(9):
            if board[i][j] == 0:
                count = count_possibilities(board, i, j)
                if count < min_possibilities:
                    min_possibilities = count
                    best_cell = (i, j)
    
    return best_cell`}</code>
                  </pre>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Least Constraining Value (LCV)</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose the value that rules out the fewest future choices.
                  </p>
                  <pre className="text-sm bg-background/50 p-3 rounded">
                    <code>{`# Graph coloring: Use color that leaves most options
def order_colors(graph, node, available_colors):
    color_impact = []
    
    for color in available_colors:
        # Count how many neighbors can still use other colors
        impact = calculate_impact(graph, node, color)
        color_impact.append((color, impact))
    
    # Sort by least impact first
    return sorted(color_impact, key=lambda x: x[1])`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bounds" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Bound Checking
            </h3>

            <div className="space-y-4">
              <div className="grid gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Lower and Upper Bounds</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calculate optimistic and pessimistic estimates to prune branches.
                  </p>
                  <pre className="text-sm bg-muted/50 p-3 rounded">
                    <code>{`def tsp_backtrack(cities, current_path, current_cost, best_cost):
    # Lower bound: current cost + minimum spanning tree of remaining
    remaining = [c for c in cities if c not in current_path]
    lower_bound = current_cost + mst_cost(remaining)
    
    if lower_bound >= best_cost:
        return None  # Can't improve on best solution
    
    # Upper bound: current + nearest neighbor for remaining
    upper_bound = current_cost + nn_heuristic(remaining)
    
    if upper_bound < best_cost:
        best_cost = upper_bound  # Update best known
    
    # Continue backtracking...`}</code>
                  </pre>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-2">Feasibility Checking</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Check if remaining resources can satisfy remaining requirements.
                  </p>
                  <pre className="text-sm bg-muted/50 p-3 rounded">
                    <code>{`def subset_sum(nums, target, index, current_sum):
    # Check if remaining numbers can reach target
    remaining_sum = sum(nums[index:])
    
    if current_sum + remaining_sum < target:
        return False  # Impossible to reach target
    
    if current_sum > target:
        return False  # Already exceeded
    
    # Continue with backtracking...`}</code>
                  </pre>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="symmetry" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Symmetry Breaking
            </h3>

            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Many problems have symmetric solutions. We can eliminate redundant 
                  exploration by fixing certain choices or adding constraints.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <Card className="p-4 border-l-4 border-l-orange-500">
                  <h4 className="font-semibold mb-2">Example: N-Queens Symmetry</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    For N-Queens, we can fix the first queen to the left half of the board.
                  </p>
                  <pre className="text-sm bg-muted/50 p-3 rounded">
                    <code>{`def n_queens_optimized(n):
    solutions = []
    
    # Only try first queen in left half (symmetry breaking)
    for col in range((n + 1) // 2):
        board = [-1] * n
        board[0] = col
        
        if solve(board, 1):
            solutions.append(board[:])
            
            # If not center column, add mirrored solution
            if col != n // 2 or n % 2 == 0:
                mirrored = [n - 1 - pos for pos in board]
                solutions.append(mirrored)
    
    return solutions`}</code>
                  </pre>
                </Card>

                <Card className="p-4 border-l-4 border-l-teal-500">
                  <h4 className="font-semibold mb-2">Canonical Forms</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Generate only canonical (normalized) representations of solutions.
                  </p>
                  <pre className="text-sm bg-muted/50 p-3 rounded">
                    <code>{`def generate_subsets_canonical(nums):
    # Sort to ensure canonical order
    nums.sort()
    result = []
    
    def backtrack(start, path):
        result.append(path[:])
        
        # Always go forward (no looking back)
        for i in range(start, len(nums)):
            # Skip duplicates in sorted array
            if i > start and nums[i] == nums[i-1]:
                continue
                
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result`}</code>
                  </pre>
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Performance Comparison */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Impact
            </h3>
            <Button
              size="sm"
              variant={showComparison ? "default" : "outline"}
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? "Hide" : "Show"} Comparison
            </Button>
          </div>

          {showComparison && (
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Naive Backtracking</span>
                  <span className="text-sm text-muted-foreground">100% (baseline)</span>
                </div>
                <div className="h-3 bg-red-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">+ Pruning</span>
                  <span className="text-sm text-muted-foreground">30-50%</span>
                </div>
                <div className="h-3 bg-orange-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-2/5" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">+ Smart Ordering</span>
                  <span className="text-sm text-muted-foreground">15-30%</span>
                </div>
                <div className="h-3 bg-blue-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-1/4" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">+ All Optimizations</span>
                  <span className="text-sm text-muted-foreground">5-15%</span>
                </div>
                <div className="h-3 bg-green-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-1/10" style={{width: '10%'}} />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-3">🚀 Optimization Checklist</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p className="text-sm">Profile first - identify actual bottlenecks</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p className="text-sm">Start with simple pruning techniques</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p className="text-sm">Use domain knowledge for heuristics</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p className="text-sm">Combine multiple techniques for best results</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p className="text-sm">Test optimizations don't break correctness</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <p className="text-sm">Document your optimization rationale</p>
          </div>
        </div>
      </Card>
    </div>
  );
}