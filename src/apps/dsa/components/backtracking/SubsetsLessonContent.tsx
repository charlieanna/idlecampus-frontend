import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AlertCircle } from "lucide-react";
import SubsetsExplanation from "./SubsetsExplanation";
import SubsetsTreeVisualization from "./SubsetsTreeVisualization";
import SubsetsManualBuilder from "./SubsetsManualBuilder";

interface SubsetsLessonContentProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export default function SubsetsLessonContent({ onNext, onPrev }: SubsetsLessonContentProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Subsets Pattern Deep Dive</h1>
        <p className="text-sm text-muted-foreground">Master the include/exclude decision pattern</p>
      </div>

      {/* Problem-First: Build from [] */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Problem</h3>
        <div className="text-sm space-y-2">
          <p>Given an array, list all subsets (including the empty set).</p>
          <p className="text-xs text-muted-foreground">Start by building from an empty array and making simple include/skip decisions.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="p-3 bg-muted rounded">
              <p className="text-xs font-semibold mb-1">Start:</p>
              <code className="bg-background px-2 py-1 rounded text-xs">current = []</code>
              <p className="text-xs text-muted-foreground mt-2">Decide about each element: include or skip.</p>
            </div>
            <div className="p-3 bg-muted rounded">
              <p className="text-xs font-semibold mb-1">Result idea:</p>
              <code className="bg-background px-2 py-1 rounded text-xs block">[[], [1], [2], [1,2], ...]</code>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Example */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Example Run</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold mb-1">Input:</p>
            <code className="bg-muted px-2 py-1 rounded text-xs">[1, 2, 3]</code>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1">Output:</p>
            <code className="bg-muted px-2 py-1 rounded text-xs block">
              [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
            </code>
          </div>
        </div>
      </Card>

      {/* Decision Tree - Visual */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Decision Tree</h3>
        <pre className="text-xs text-muted-foreground font-mono">
{`                    []
          /         |         \\
       [1]         [2]        [3]
      /   \\         |
   [1,2] [1,3]    [2,3]
     |
  [1,2,3]`}
        </pre>
        <p className="text-xs text-muted-foreground mt-2">
          Each level decides: include element or skip to next
        </p>
      </Card>

      {/* Template Mapping */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Template Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">State</span>
            <div className="text-xs text-muted-foreground">current subset (current), start index</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Choices</span>
            <div className="text-xs text-muted-foreground">for i in [start..len(nums)-1]</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Complete?</span>
            <div className="text-xs text-muted-foreground">Every state is valid → save on entry</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Backtrack</span>
            <div className="text-xs text-muted-foreground">current.pop() after exploring</div>
          </div>
        </div>
      </Card>

      {/* The Code - After intuition */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Complete Solution (Using the Template)</h3>
        <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
          <code>{`def subsets(nums):
    result = []
    
    def backtrack(start, current):
        # Every state is valid - save it!
        result.append(current[:])  # CRITICAL: Use [:] to copy
        
        # Try including each remaining element
        for i in range(start, len(nums)):
            current.append(nums[i])      # Include element
            backtrack(i + 1, current)     # Explore with it
            current.pop()                 # Backtrack - remove it
    
    backtrack(0, [])
    return result`}</code>
        </pre>
      </Card>

      {/* Key Points - Ultra Concise */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Three Key Points</h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <span className="text-xs font-mono bg-primary/10 px-1 rounded">current[:]</span>
            <span className="text-xs text-muted-foreground">Copy to avoid reference bugs</span>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-mono bg-primary/10 px-1 rounded">start</span>
            <span className="text-xs text-muted-foreground">Prevents duplicates like [2,1]</span>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-mono bg-primary/10 px-1 rounded">i + 1</span>
            <span className="text-xs text-muted-foreground">Move forward, never repeat</span>
          </div>
        </div>
      </Card>

      {/* Interactive Tree Visualization */}
      <SubsetsTreeVisualization />
      
      {/* Interactive Manual Builder */}
      <SubsetsManualBuilder />
      
      {/* Detailed Explanation Component */}
      <SubsetsExplanation />
      
      {/* How the Tree Exploration Works */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          How the Decision Tree is Explored
        </h3>
        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded">
            <h4 className="text-sm font-semibold mb-2">Tree Structure for [1,2,3]:</h4>
            <pre className="text-xs font-mono">
{`                    []
          /         |         \\
       [1]         [2]        [3]
      /   \\         |
   [1,2] [1,3]    [2,3]
     |
  [1,2,3]`}
            </pre>
          </div>
          
          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Execution Order:</h4>
            <div className="text-xs space-y-1 font-mono">
              <div>1. Start: [] → Save []</div>
              <div>2. Include 1: [1] → Save [1]</div>
              <div>3. Include 2: [1,2] → Save [1,2]</div>
              <div>4. Include 3: [1,2,3] → Save [1,2,3]</div>
              <div>5. Backtrack: Remove 3 → [1,2]</div>
              <div>6. Backtrack: Remove 2 → [1]</div>
              <div>7. Include 3: [1,3] → Save [1,3]</div>
              <div>8. Continue until all paths explored...</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Critical Concepts */}
      <Card className="p-4 border-2 border-accent">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-accent" />
          Critical Concepts for Subsets
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why start parameter?</h4>
            <p className="text-xs text-muted-foreground">
              The start parameter ensures we only look forward in the array. 
              This prevents duplicates like [2,1] when we already have [1,2].
            </p>
            <pre className="text-xs bg-background p-2 rounded mt-2">
              <code>{`for i in range(start, len(nums)):  # Not from 0!`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why i + 1 in recursion?</h4>
            <p className="text-xs text-muted-foreground">
              We pass i+1 (not start+1!) because after choosing element at index i,
              we can only choose from elements after it.
            </p>
            <pre className="text-xs bg-background p-2 rounded mt-2">
              <code>{`backtrack(i + 1, current)  # Not start + 1!`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why append every time?</h4>
            <p className="text-xs text-muted-foreground">
              Unlike other patterns, EVERY state in subsets is valid - [], [1], [1,2], etc.
              So we save the current state immediately upon entering the function.
            </p>
          </div>
        </div>
      </Card>

      {/* Common Variations */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Common Variations</h3>
        <div className="space-y-3">
          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">Subsets with Duplicates:</p>
            <pre className="bg-background p-2 rounded text-xs">
              <code>{`def subsetsWithDup(nums):
    nums.sort()  # Sort to group duplicates
    result = []
    
    def backtrack(start, current):
        result.append(current[:])
        for i in range(start, len(nums)):
            # Skip duplicates
            if i > start and nums[i] == nums[i-1]:
                continue
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result`}</code>
            </pre>
          </div>
          
          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">Subsets of Size K:</p>
            <pre className="bg-background p-2 rounded text-xs">
              <code>{`def subsets_size_k(nums, k):
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])
            return  # Stop when size k
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
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
            <p className="text-xs font-semibold mb-1">❌ Forgetting to copy:</p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`result.append(current)  # BUG! All results will be same`}</code>
            </pre>
            <p className="text-xs text-muted-foreground mt-1">
              Always use current[:] to create a copy
            </p>
          </div>
          
          <div className="p-3 bg-destructive/10 rounded">
            <p className="text-xs font-semibold mb-1">❌ Wrong recursion parameter:</p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`backtrack(start + 1, current)  # BUG! Skips elements`}</code>
            </pre>
            <p className="text-xs text-muted-foreground mt-1">
              Use i + 1, not start + 1
            </p>
          </div>
          
          <div className="p-3 bg-destructive/10 rounded">
            <p className="text-xs font-semibold mb-1">❌ Forgetting to pop:</p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`current.append(nums[i])
backtrack(i + 1, current)
# Forgot current.pop()!`}</code>
            </pre>
            <p className="text-xs text-muted-foreground mt-1">
              Must undo the choice to try other options
            </p>
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
              Next: Permutations
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
