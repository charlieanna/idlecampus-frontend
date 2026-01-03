import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AlertCircle, CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface CombinationsLessonContentProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export default function CombinationsLessonContent({ onNext, onPrev }: CombinationsLessonContentProps = {}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Combinations Pattern Deep Dive</h1>
        <p className="text-sm text-muted-foreground">Master selecting k elements where order doesn't matter</p>
      </div>

      {/* Problem-First: Build from [] */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Problem</h3>
        <div className="text-sm space-y-2">
          <p>Choose k elements from 1..n (order doesn’t matter).</p>
          <p className="text-xs text-muted-foreground">Start from an empty selection; always move forward to avoid duplicates.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="p-3 bg-muted rounded">
              <p className="text-xs font-semibold mb-1">Build from empty:</p>
              <pre className="bg-background p-2 rounded text-xs">
{`current = []
• Pick first number from [1..n]
• Next pick is from numbers greater than the last pick
• Stop when len(current) == k`}
              </pre>
            </div>
            <div className="p-3 bg-muted rounded">
              <p className="text-xs font-semibold mb-1">Leaf condition:</p>
              <code className="bg-background px-2 py-1 rounded text-xs block">len(current) == k</code>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Example with Detailed Trace */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Example Run with Execution Trace</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold mb-1">Input:</p>
            <code className="bg-muted px-2 py-1 rounded text-xs">n=4, k=2</code>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1">Output:</p>
            <code className="bg-muted px-2 py-1 rounded text-xs block">
              [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
            </code>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-muted/50 rounded">
          <p className="text-xs font-semibold mb-2">Step-by-Step Execution (C(4,2)):</p>
          <div className="text-xs font-mono space-y-1">
            <div>1. start=1, current=[] → Add 1: current=[1]</div>
            <div>2. start=2, current=[1] → Add 2: current=[1,2] ✓ Save!</div>
            <div>3. Backtrack to [1] → Add 3: current=[1,3] ✓ Save!</div>
            <div>4. Backtrack to [1] → Add 4: current=[1,4] ✓ Save!</div>
            <div>5. Backtrack to [] → Add 2: current=[2]</div>
            <div>6. start=3, current=[2] → Add 3: current=[2,3] ✓ Save!</div>
            <div>7. Continue pattern until all combinations found...</div>
          </div>
        </div>
      </Card>

      {/* Visual Decision Tree with Annotations */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Decision Tree Visualization</h3>
        <pre className="text-xs text-muted-foreground font-mono">
{`            [] (start=1)
     /      |      \\      \\
   [1]     [2]     [3]    [4]    ← Choose first element
  / | \\     | \\      |
[1,2][1,3][1,4] [2,3][2,4] [3,4]  ← Choose second element (always larger!)
   ✓   ✓   ✓     ✓   ✓     ✓    ← All valid combinations!`}
        </pre>
        <div className="mt-3 p-3 bg-primary/10 rounded">
          <p className="text-xs text-muted-foreground">
            <strong>Key Insight:</strong> The start parameter ensures we only move forward. 
            After choosing 1, we only consider 2,3,4. After choosing 2, we only consider 3,4. 
            This prevents duplicates like [2,1] since we already have [1,2].
          </p>
        </div>
      </Card>

      {/* Template Mapping */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Template Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">State</span>
            <div className="text-xs text-muted-foreground">current combination (current), start index</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Choices</span>
            <div className="text-xs text-muted-foreground">for i in [start..n] (or array indices)</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Complete?</span>
            <div className="text-xs text-muted-foreground">len(current) == k</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Backtrack</span>
            <div className="text-xs text-muted-foreground">current.pop() after exploring</div>
          </div>
        </div>
      </Card>

      {/* The Code - After tree/intuition */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Complete Solution (Using the Template)</h3>
        <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
          <code>{`def combine(n, k):
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])
            return
        for i in range(start, n + 1):
            current.append(i)
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(1, [])
    return result`}</code>
        </pre>
      </Card>

      {/* Step-by-Step Algorithm Explanation */}
      <Card className="p-4 border-2 border-primary">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary" />
          How the Algorithm Works - Step by Step
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Step 1: Base Case - Size k</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Check if we've selected exactly k elements. If yes, save the combination.
            </p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`if len(current) == k:
    result.append(current[:])  # Found valid combination!
    return  # Stop exploring further`}</code>
            </pre>
          </div>

          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Step 2: Iterate from Start</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Loop from 'start' to n, ensuring we only pick numbers larger than previous ones.
            </p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`for i in range(start, n + 1):
    # All numbers from start onwards are valid choices`}</code>
            </pre>
          </div>

          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Step 3: Choose, Explore, Unchoose</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Add number, recursively build with larger numbers, then backtrack.
            </p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`current.append(i)      # CHOOSE number i
backtrack(i + 1, current)  # EXPLORE with numbers > i
current.pop()          # UNCHOOSE (backtrack)`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Critical Concepts */}
      <Card className="p-4 border-2 border-accent">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-accent" />
          Critical Concepts Explained
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why use start parameter?</h4>
            <p className="text-xs text-muted-foreground">
              The start parameter ensures we only look forward. Without it, we'd 
              generate [1,2] and [2,1] as separate combinations, but they're the 
              same set! By always moving forward, we generate each combination exactly once.
            </p>
            <div className="mt-2 p-2 bg-background rounded">
              <p className="text-xs font-semibold">Example:</p>
              <p className="text-xs font-mono">Choose 1 → Can choose: 2, 3, 4</p>
              <p className="text-xs font-mono">Choose 2 → Can choose: 3, 4 (NOT 1!)</p>
            </div>
          </div>

          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why pass i + 1, not start + 1?</h4>
            <p className="text-xs text-muted-foreground">
              We pass i+1 because after choosing element at position i, the next 
              element must be from position i+1 onwards. Using start+1 would skip 
              valid combinations!
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2 bg-destructive/10 rounded">
                <p className="text-xs font-semibold mb-1">❌ Wrong:</p>
                <code className="text-xs">backtrack(start + 1, current)</code>
                <p className="text-xs text-muted-foreground mt-1">Misses combinations!</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded">
                <p className="text-xs font-semibold mb-1">✓ Correct:</p>
                <code className="text-xs">backtrack(i + 1, current)</code>
                <p className="text-xs text-muted-foreground mt-1">Gets all combinations!</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why return after finding k elements?</h4>
            <p className="text-xs text-muted-foreground">
              Unlike subsets where every state is valid, combinations must have 
              exactly k elements. Once we have k, we stop exploring deeper to 
              avoid generating invalid combinations of size k+1, k+2, etc.
            </p>
          </div>
        </div>
      </Card>

      {/* Common Variations */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Common Variations of Combinations</h3>
        <div className="space-y-3">
          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">Combination Sum (Can Reuse Elements):</p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
              <code>{`def combinationSum(candidates, target):
    result = []
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            # Pass i (not i+1) to allow reuse!
            backtrack(i, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result`}</code>
            </pre>
          </div>

          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">Combinations with Array Elements:</p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
              <code>{`def combine_array(nums, k):
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])
            return
        
        # Work with array indices instead of 1..n
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result`}</code>
            </pre>
          </div>

          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">Combinations with Duplicates:</p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
              <code>{`def combineWithDup(nums, k):
    nums.sort()  # Sort to group duplicates
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])
            return
        
        for i in range(start, len(nums)):
            # Skip duplicates at same level
            if i > start and nums[i] == nums[i-1]:
                continue
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Optimization Tips */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Optimization: Early Pruning</h3>
        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
          <code>{`def combine_optimized(n, k):
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])
            return
        
        # OPTIMIZATION: Calculate remaining needed
        need = k - len(current)
        remain = n - start + 1
        
        # Prune if not enough elements left
        if remain < need:
            return
        
        for i in range(start, n + 1):
            # Another pruning opportunity
            # Stop if not enough numbers left for k elements
            if n - i + 1 < k - len(current):
                break
                
            current.append(i)
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(1, [])
    return result`}</code>
        </pre>
        <div className="mt-2 p-2 bg-primary/10 rounded">
          <p className="text-xs text-muted-foreground">
            <strong>Impact:</strong> Avoids exploring branches that can't produce valid combinations
          </p>
        </div>
      </Card>

      {/* Common Pitfalls */}
      <Card className="p-4 border-2 border-destructive">
        <h3 className="font-semibold mb-3 text-destructive">Common Pitfalls to Avoid</h3>
        <div className="space-y-3">
          <div className="p-3 bg-destructive/10 rounded">
            <div className="flex items-start gap-2 mb-2">
              <XCircle className="w-4 h-4 text-destructive mt-0.5" />
              <p className="text-xs font-semibold">Using wrong parameter in recursion</p>
            </div>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`# ❌ Wrong - skips valid combinations
backtrack(start + 1, current)  # Should be i + 1!

# ✓ Correct - explores all valid paths
backtrack(i + 1, current)`}</code>
            </pre>
          </div>

          <div className="p-3 bg-destructive/10 rounded">
            <div className="flex items-start gap-2 mb-2">
              <XCircle className="w-4 h-4 text-destructive mt-0.5" />
              <p className="text-xs font-semibold">Forgetting to copy when saving</p>
            </div>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`# ❌ Wrong - all results reference same list
if len(current) == k:
    result.append(current)  # BUG!

# ✓ Correct - creates independent copies
if len(current) == k:
    result.append(current[:])`}</code>
            </pre>
          </div>

          <div className="p-3 bg-destructive/10 rounded">
            <div className="flex items-start gap-2 mb-2">
              <XCircle className="w-4 h-4 text-destructive mt-0.5" />
              <p className="text-xs font-semibold">Not returning after base case</p>
            </div>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`# ❌ Wrong - continues exploring after finding k elements
if len(current) == k:
    result.append(current[:])
    # Missing return!

# ✓ Correct - stops at exactly k elements
if len(current) == k:
    result.append(current[:])
    return`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Practice Problem */}
      <Card className="p-4 bg-primary/5">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          Quick Practice
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Trace through combine(3, 2). What combinations are generated and in what order?
        </p>
        <details className="cursor-pointer">
          <summary className="text-xs font-semibold text-primary hover:underline">
            Click to see answer
          </summary>
          <div className="mt-2 p-2 bg-muted rounded text-xs">
            <p className="font-semibold mb-1">Order of generation:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>[1, 2] - Choose 1, then 2</li>
              <li>[1, 3] - Backtrack to 1, then choose 3</li>
              <li>[2, 3] - Backtrack to empty, choose 2, then 3</li>
            </ol>
            <p className="mt-2 text-muted-foreground">
              Total: C(3,2) = 3 combinations. Note how we never generate [2,1], [3,1], or [3,2]!
            </p>
          </div>
        </details>
      </Card>

      {/* Navigation */}
      {(onNext || onPrev) && (
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          {onPrev && (
            <Button onClick={onPrev} variant="outline">
              Previous: Permutations
            </Button>
          )}
          {onNext && (
            <Button onClick={onNext} className="ml-auto">
              Next: N-Queens
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
