import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface PermutationsLessonContentProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export default function PermutationsLessonContent({ onNext, onPrev }: PermutationsLessonContentProps = {}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Permutations Pattern Deep Dive</h1>
        <p className="text-sm text-muted-foreground">Master the art of arranging all elements where order matters</p>
      </div>

      {/* Problem-First: Build from [] */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Problem</h3>
        <div className="text-sm space-y-2">
          <p>Given an array of distinct numbers, generate all permutations.</p>
          <p className="text-xs text-muted-foreground">Start from an empty path and choose any unused element for the next position.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="p-3 bg-muted rounded">
              <p className="text-xs font-semibold mb-1">Build from empty:</p>
              <pre className="bg-background p-2 rounded text-xs">
{`current = []
• Pick any unused element for position 0
• Pick any unused element for position 1
• Continue until len(current) == n`}
              </pre>
            </div>
            <div className="p-3 bg-muted rounded">
              <p className="text-xs font-semibold mb-1">Leaf condition:</p>
              <code className="bg-background px-2 py-1 rounded text-xs block">len(current) == len(nums)</code>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Example with Trace */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Example Run with Execution Trace</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold mb-1">Input:</p>
            <code className="bg-muted px-2 py-1 rounded text-xs">[1, 2, 3]</code>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1">Output:</p>
            <code className="bg-muted px-2 py-1 rounded text-xs block">
              [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]
            </code>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-muted/50 rounded">
          <p className="text-xs font-semibold mb-2">Step-by-Step Execution:</p>
          <div className="text-xs font-mono space-y-1">
            <div>1. current=[] → Try 1: current=[1]</div>
            <div>2. current=[1] → Try 2: current=[1,2]</div>
            <div>3. current=[1,2] → Try 3: current=[1,2,3] ✓ Save!</div>
            <div>4. Backtrack: current=[1,2] → Try 3: current=[1,3]</div>
            <div>5. current=[1,3] → Try 2: current=[1,3,2] ✓ Save!</div>
            <div>6. Backtrack all the way to [] and continue...</div>
          </div>
        </div>
      </Card>

      {/* Visual Decision Tree with Annotations */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Decision Tree Visualization</h3>
        <pre className="text-xs text-muted-foreground font-mono">
{`                    [] (start)
          /         |         \\
        [1]        [2]        [3]      ← First position choices
       /   \\      /   \\      /   \\
    [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]  ← Second position choices
      |     |     |     |     |     |
   [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]  ← Complete permutations!`}
        </pre>
        <div className="mt-3 p-3 bg-primary/10 rounded">
          <p className="text-xs text-muted-foreground">
            <strong>Key Insight:</strong> Each level fills the next position. At each level, 
            we can choose ANY element we haven't used yet. This differs from combinations 
            where we only move forward.
          </p>
        </div>
      </Card>

      {/* Template Mapping */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Template Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">State</span>
            <div className="text-xs text-muted-foreground">current permutation (current)</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Choices</span>
            <div className="text-xs text-muted-foreground">any num in nums not yet in current</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Complete?</span>
            <div className="text-xs text-muted-foreground">len(current) == len(nums)</div>
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
          <code>{`def permute(nums):
    """
    Generate all permutations of a list of distinct numbers.
    Time Complexity: O(n! * n) - n! permutations, each takes O(n) to generate
    Space Complexity: O(n) - recursion depth and current permutation
    """
    result = []
    
    def backtrack(current):
        # BASE CASE: Complete permutation when we've used all elements
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        # RECURSIVE CASE: Try each unused element in this position
        for num in nums:
            if num in current:  # Already used in current path
                continue
            current.append(num)   # CHOOSE
            backtrack(current)    # EXPLORE
            current.pop()         # UNCHOOSE (backtrack)
    
    backtrack([])
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
            <h4 className="text-sm font-semibold mb-2">Step 1: Base Case Check</h4>
            <p className="text-xs text-muted-foreground mb-2">
              We check if we've used all elements (len(current) == len(nums)). 
              If yes, we've found a complete permutation!
            </p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`if len(current) == len(nums):
    result.append(current[:])  # Found complete permutation!`}</code>
            </pre>
          </div>

          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Step 2: Try Each Unused Element</h4>
            <p className="text-xs text-muted-foreground mb-2">
              For each element in nums, check if it's already used. If not, use it!
            </p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`for num in nums:
    if num in current:  # Already used?
        continue         # Skip it`}</code>
            </pre>
          </div>

          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Step 3: Make Choice & Explore</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Add the element, recursively build the rest, then remove it to try others.
            </p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`current.append(num)    # CHOOSE
backtrack(current)     # EXPLORE
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
            <h4 className="text-sm font-semibold mb-1">Why check "num in current"?</h4>
            <p className="text-xs text-muted-foreground">
              In permutations, each element can only appear once. We track which 
              elements are already used in the current partial permutation. This 
              differs from subsets where we use a start index to avoid revisiting.
            </p>
          </div>

          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why no start parameter?</h4>
            <p className="text-xs text-muted-foreground">
              Unlike subsets/combinations, permutations can use any unused element 
              next. [2,1,3] is different from [1,2,3]. We need to consider ALL 
              unused elements at each position, not just forward ones.
            </p>
          </div>

          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why copy with [:]?</h4>
            <p className="text-xs text-muted-foreground">
              Without copying, all results would reference the same list object. 
              As we backtrack and modify current, all "saved" results would change too!
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2 bg-destructive/10 rounded">
                <p className="text-xs font-semibold mb-1">❌ Wrong:</p>
                <code className="text-xs">result.append(current)</code>
              </div>
              <div className="p-2 bg-green-500/10 rounded">
                <p className="text-xs font-semibold mb-1">✓ Correct:</p>
                <code className="text-xs">result.append(current[:])</code>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Optimization with Boolean Array */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Optimization: Use Boolean Array for O(1) Lookup</h3>
        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
          <code>{`def permute_optimized(nums):
    result = []
    n = len(nums)
    # Track which elements are used with O(1) lookup
    used = [False] * n
    
    def backtrack(current):
        if len(current) == n:
            result.append(current[:])
            return
        
        # Iterate by index to use boolean array
        for i in range(n):
            if used[i]:  # O(1) check instead of O(n) "in" check
                continue
                
            # Mark as used
            used[i] = True
            current.append(nums[i])
            
            backtrack(current)
            
            # Unmark when backtracking
            current.pop()
            used[i] = False
    
    backtrack([])
    return result`}</code>
        </pre>
        <div className="mt-3 p-3 bg-primary/10 rounded">
          <p className="text-xs text-muted-foreground">
            <strong>Performance Impact:</strong> Changes the check from O(n) to O(1), 
            reducing overall complexity from O(n! × n²) to O(n! × n)
          </p>
        </div>
      </Card>

      {/* Common Variations */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Common Variations</h3>
        <div className="space-y-3">
          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">Permutations with Duplicates:</p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
              <code>{`def permuteUnique(nums):
    nums.sort()  # Sort to group duplicates
    result = []
    used = [False] * len(nums)
    
    def backtrack(current):
        if len(current) == len(nums):
            result.append(current[:])
            return
        
        for i in range(len(nums)):
            # Skip if used OR duplicate of previous unused
            if used[i] or (i > 0 and nums[i] == nums[i-1] and not used[i-1]):
                continue
            
            used[i] = True
            current.append(nums[i])
            backtrack(current)
            current.pop()
            used[i] = False
    
    backtrack([])
    return result`}</code>
            </pre>
          </div>

          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">K-Permutations (Choose k elements):</p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
              <code>{`def k_permutations(nums, k):
    result = []
    used = [False] * len(nums)
    
    def backtrack(current):
        if len(current) == k:  # Stop at k elements
            result.append(current[:])
            return
        
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            current.append(nums[i])
            backtrack(current)
            current.pop()
            used[i] = False
    
    backtrack([])
    return result`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Common Pitfalls */}
      <Card className="p-4 border-2 border-destructive">
        <h3 className="font-semibold mb-3 text-destructive">Common Pitfalls to Avoid</h3>
        <div className="space-y-3">
          <div className="p-3 bg-destructive/10 rounded">
            <div className="flex items-start gap-2 mb-2">
              <XCircle className="w-4 h-4 text-destructive mt-0.5" />
              <p className="text-xs font-semibold">Forgetting to copy when saving result</p>
            </div>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`# ❌ Wrong - all results will be same empty list
result.append(current)

# ✓ Correct - creates independent copy
result.append(current[:])`}</code>
            </pre>
          </div>

          <div className="p-3 bg-destructive/10 rounded">
            <div className="flex items-start gap-2 mb-2">
              <XCircle className="w-4 h-4 text-destructive mt-0.5" />
              <p className="text-xs font-semibold">Using start index like in subsets</p>
            </div>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`# ❌ Wrong - would miss permutations like [2,1,3]
for i in range(start, len(nums)):

# ✓ Correct - consider all unused elements
for i in range(len(nums)):
    if used[i]: continue`}</code>
            </pre>
          </div>

          <div className="p-3 bg-destructive/10 rounded">
            <div className="flex items-start gap-2 mb-2">
              <XCircle className="w-4 h-4 text-destructive mt-0.5" />
              <p className="text-xs font-semibold">Not resetting state when backtracking</p>
            </div>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`# ❌ Wrong - forgot to unmark as used
used[i] = True
current.append(nums[i])
backtrack(current)
current.pop()
# Missing: used[i] = False

# ✓ Correct - properly reset state
used[i] = True
current.append(nums[i])
backtrack(current)
current.pop()
used[i] = False`}</code>
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
          Try to trace through the algorithm with input [A, B]. What permutations are generated and in what order?
        </p>
        <details className="cursor-pointer">
          <summary className="text-xs font-semibold text-primary hover:underline">
            Click to see answer
          </summary>
          <div className="mt-2 p-2 bg-muted rounded text-xs">
            <p className="font-semibold mb-1">Order of generation:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>[A, B] - Choose A first, then B</li>
              <li>[B, A] - Choose B first, then A</li>
            </ol>
            <p className="mt-2 text-muted-foreground">
              The algorithm explores depth-first: completes all permutations starting with A before trying B.
            </p>
          </div>
        </details>
      </Card>

      {/* Navigation */}
      {(onNext || onPrev) && (
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          {onPrev && (
            <Button onClick={onPrev} variant="outline">
              Previous
            </Button>
          )}
          {onNext && (
            <Button onClick={onNext} className="ml-auto">
              Next: Combinations
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
