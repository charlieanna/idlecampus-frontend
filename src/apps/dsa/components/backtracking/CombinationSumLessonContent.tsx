import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AlertCircle, Target, Zap, TreePine } from "lucide-react";
import CombinationSumTreeVisualization from "./CombinationSumTreeVisualization";
import CombinationSumStepByStep from "./CombinationSumStepByStep";
import CombinationSumExplanation from "./CombinationSumExplanation";

interface CombinationSumLessonContentProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export default function CombinationSumLessonContent({ onNext, onPrev }: CombinationSumLessonContentProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Combination Sum Deep Dive</h1>
        <p className="text-sm text-muted-foreground">Master variable-length combinations with element reuse and target constraints</p>
      </div>

      {/* Problem-First: Build toward a target */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Problem</h3>
        <div className="text-sm space-y-2">
          <p>Given candidates and a target, find all combinations that sum to target (elements can be reused).</p>
          <p className="text-xs text-muted-foreground">Start from empty; pick numbers without changing order of indices; reuse by staying on the same index.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="p-3 bg-muted rounded">
              <p className="text-xs font-semibold mb-1">Build from empty:</p>
              <pre className="bg-background p-2 rounded text-xs">
{`current = [], total = 0
• Choose candidates[i] and stay at i to allow reuse
• Prune when total > target
• Leaf when total == target`}
              </pre>
            </div>
            <div className="p-3 bg-muted rounded">
              <p className="text-xs font-semibold mb-1">Leaf/prune:</p>
              <code className="bg-background px-2 py-1 rounded text-xs block">total == target → save</code>
              <code className="bg-background px-2 py-1 rounded text-xs block mt-1">total &gt; target → return</code>
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive Step-by-Step Tutorial */}
      <CombinationSumStepByStep />
      
      {/* Interactive Tree Visualization */}
      <CombinationSumTreeVisualization />
      
      {/* Detailed Explanation */}
      <CombinationSumExplanation />

      {/* Quick Example */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Example Run</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold mb-1">Input:</p>
            <code className="bg-muted px-2 py-1 rounded text-xs">
              candidates=[2,3,6,7], target=7
            </code>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1">Output:</p>
            <code className="bg-muted px-2 py-1 rounded text-xs block">
              [[2,2,3], [7]]
            </code>
          </div>
        </div>
      </Card>

      {/* Decision Tree - Visual */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Pruned Decision Tree</h3>
        <pre className="text-xs text-muted-foreground font-mono">
{`          [] (0)
     /      |      \\
   [2](2)  [3](3)  [6](6)  [7](7) ✓
    /  |     |       X
[2,2](4) [2,3](5) [3,3](6)
   |        |        |
[2,2,2](6) [2,2,3](7)✓ [3,3,3](9)X
   |
[2,2,2,2](8)X`}
        </pre>
        <p className="text-xs text-muted-foreground mt-2">
          X = pruned (exceeds target), ✓ = valid solution
        </p>
      </Card>

      {/* Template Mapping */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Template Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">State</span>
            <div className="text-xs text-muted-foreground">current combination (current), total sum, start index</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Choices</span>
            <div className="text-xs text-muted-foreground">for i in [start..], pick candidates[i] (reuse allowed via i)</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Complete?</span>
            <div className="text-xs text-muted-foreground">total == target → save</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Prune</span>
            <div className="text-xs text-muted-foreground">total &gt; target → return</div>
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
          <code>{`def combinationSum(candidates, target):
    result = []
    
    def backtrack(start, current, total):
        if total == target:
            result.append(current[:])
            return
        if total > target:
            return
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            backtrack(i, current, total + candidates[i])  # reuse allowed
            current.pop()
    
    backtrack(0, [], 0)
    return result`}</code>
        </pre>
      </Card>

      {/* How the Algorithm Works - Step by Step */}
      <Card className="p-4 border-2 border-primary">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary" />
          How Combination Sum Works - Step by Step
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Step 1: Two Base Cases</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Unlike other patterns, Combination Sum needs TWO base cases:
            </p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`if total == target:  # Success - found valid combination
    result.append(current[:])
    return

if total > target:  # Failed - exceeded target, prune this path
    return`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Step 2: The Critical Choice - Reuse Elements</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Pass i (not i+1!) to allow reusing the same element:
            </p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`backtrack(i, current, total + candidates[i])  # Can use candidates[i] again!
# Compare to combinations: backtrack(i + 1, current)  # Can't reuse`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Step 3: Variable-Length Solutions</h4>
            <p className="text-xs text-muted-foreground">
              Unlike Combinations which have fixed size k, Combination Sum solutions 
              can be ANY length: [7] and [2,2,3] are both valid for target=7.
            </p>
          </div>
        </div>
      </Card>

      {/* Critical Concepts */}
      <Card className="p-4 border-2 border-accent">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-accent" />
          Critical Concepts for Combination Sum
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why pass i instead of i+1?</h4>
            <p className="text-xs text-muted-foreground mb-2">
              This is THE key difference! Passing i allows reusing the same element multiple times.
              For target=8 and candidates=[2,3], we need [2,2,2,2] which requires using 2 four times.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-background p-2 rounded">
                <p className="text-xs font-semibold text-primary">✅ Correct (pass i):</p>
                <pre className="text-xs mt-1"><code>backtrack(i, ...)</code></pre>
                <p className="text-xs text-muted-foreground mt-1">Can make [2,2,2,2]</p>
              </div>
              <div className="bg-background p-2 rounded">
                <p className="text-xs font-semibold text-destructive">❌ Wrong (pass i+1):</p>
                <pre className="text-xs mt-1"><code>backtrack(i+1, ...)</code></pre>
                <p className="text-xs text-muted-foreground mt-1">Can only use each once</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why track running total?</h4>
            <p className="text-xs text-muted-foreground mb-2">
              We maintain a running sum (total) to enable early pruning. As soon as 
              total &gt; target, we stop exploring that branch. This dramatically reduces 
              the search space.
            </p>
            <pre className="text-xs bg-background p-2 rounded mt-2">
              <code>{`def backtrack(start, current, total):  # Track total
    if total > target:  # Prune immediately
        return`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why still use start parameter?</h4>
            <p className="text-xs text-muted-foreground">
              Even though we can reuse elements, we still need start to prevent 
              duplicate combinations. Without it, we'd get both [2,3] and [3,2] 
              for target=5, which are the same combination.
            </p>
          </div>
        </div>
      </Card>

      {/* Common Variations */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Common Variations</h3>
        <div className="space-y-3">
          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">Combination Sum II (No Reuse + Duplicates):</p>
            <pre className="bg-background p-2 rounded text-xs">
              <code>{`def combinationSum2(candidates, target):
    candidates.sort()  # Sort to handle duplicates
    result = []
    
    def backtrack(start, current, total):
        if total == target:
            result.append(current[:])
            return
        if total > target:
            return
        
        for i in range(start, len(candidates)):
            # Skip duplicates
            if i > start and candidates[i] == candidates[i-1]:
                continue
            current.append(candidates[i])
            backtrack(i + 1, current, total + candidates[i])  # i+1: no reuse!
            current.pop()
    
    backtrack(0, [], 0)
    return result`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">Combination Sum III (Fixed Size K + No Reuse):</p>
            <pre className="bg-background p-2 rounded text-xs">
              <code>{`def combinationSum3(k, target):
    result = []
    
    def backtrack(start, current, total):
        if len(current) == k and total == target:
            result.append(current[:])
            return
        if len(current) >= k or total >= target:
            return  # Prune: too many elements or exceeded target
        
        for i in range(start, 10):  # Numbers 1-9 only
            current.append(i)
            backtrack(i + 1, current, total + i)  # No reuse
            current.pop()
    
    backtrack(1, [], 0)
    return result`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Common Pitfalls */}
      <Card className="p-4 border-2 border-destructive">
        <h3 className="font-semibold mb-2 text-destructive">Common Pitfalls to Avoid</h3>
        <div className="space-y-3">
          <div className="p-3 bg-destructive/10 rounded">
            <p className="text-xs font-semibold mb-1">❌ Forgetting to return after base case:</p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`if total == target:
    result.append(current[:])
    # Missing return! Will continue exploring`}</code>
            </pre>
            <p className="text-xs text-muted-foreground mt-1">
              Always return after finding a solution to avoid unnecessary work
            </p>
          </div>
          
          <div className="p-3 bg-destructive/10 rounded">
            <p className="text-xs font-semibold mb-1">❌ Wrong recursion parameter (i+1 instead of i):</p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`backtrack(i + 1, current, total)  # BUG! Can't reuse elements`}</code>
            </pre>
            <p className="text-xs text-muted-foreground mt-1">
              Pass i to allow reuse, i+1 prevents using same element again
            </p>
          </div>
          
          <div className="p-3 bg-destructive/10 rounded">
            <p className="text-xs font-semibold mb-1">❌ Not tracking the running total:</p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`def backtrack(start, current):  # No total parameter
    if sum(current) == target:  # O(n) calculation each time!`}</code>
            </pre>
            <p className="text-xs text-muted-foreground mt-1">
              Track total incrementally for O(1) checks and early pruning
            </p>
          </div>
        </div>
      </Card>

      {/* Optimization Techniques */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          Optimization Techniques
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">1. Sort for Early Termination:</p>
            <pre className="bg-background p-2 rounded text-xs">
              <code>{`candidates.sort()  # Sort ascending

for i in range(start, len(candidates)):
    if candidates[i] > remain:
        break  # All remaining are too large`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">2. Pre-filter Invalid Candidates:</p>
            <pre className="bg-background p-2 rounded text-xs">
              <code>{`candidates = [c for c in candidates if c <= target]
# Remove elements larger than target upfront`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">3. Memoization for Overlapping Subproblems:</p>
            <pre className="bg-background p-2 rounded text-xs">
              <code>{`memo = {}
def backtrack(start, remain):
    key = (start, remain)
    if key in memo:
        return memo[key]
    # ... compute result ...
    memo[key] = result
    return result`}</code>
            </pre>
          </div>
        </div>
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
              Next: Optimization Toolkit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
