import { Card } from '../ui/card';

export default function StepByStepCodeExplanation() {
  return (
    <Card className="p-6 bg-card border-2 border-primary/30">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Building the Backtracking Solution Step by Step
          </h3>
          <p className="text-muted-foreground">
            Let's build the code line by line, understanding WHY each line exists
          </p>
        </div>

        {/* Step 1: Basic Structure */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              1
            </div>
            <h4 className="text-lg font-semibold text-foreground">Set up the basic structure</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              We need a function that takes the input array and returns all subsets.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    # We'll build our solution here
    pass`}
            </pre>
          </div>
        </div>

        {/* Step 2: Result array */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              2
            </div>
            <h4 className="text-lg font-semibold text-foreground">Add a result array to store all subsets</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              We need somewhere to collect all the subsets we find.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    result = []  # Stores all subsets we discover
    pass`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              This array will hold our final answer: all 8 subsets
            </p>
          </div>
        </div>

        {/* Step 3: Current array */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              3
            </div>
            <h4 className="text-lg font-semibold text-foreground">Add a current array to track the subset we're building</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              As we explore the tree, we build up a subset by adding elements. We need to track this.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    result = []
    current = []  # The subset we're currently building
    pass`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              This array will change as we explore: grows with append(), shrinks with pop()
            </p>
          </div>
        </div>

        {/* Step 4: Backtrack function */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              4
            </div>
            <h4 className="text-lg font-semibold text-foreground">Create the backtrack helper function</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Backtracking uses recursion to explore all paths. We need a helper function for this.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    result = []
    current = []
    
    def backtrack(start):
        # This function will explore the tree
        pass`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              The <code className="bg-primary/20 px-1 rounded">start</code> parameter tells us which elements we can still choose
            </p>
          </div>
        </div>

        {/* Step 5: Save current subset - THE CRITICAL CONCEPT A */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-bold">
              5
            </div>
            <h4 className="text-lg font-semibold text-foreground">Save the current subset to results</h4>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border-2 border-accent">
            <p className="text-sm font-semibold mb-3">⚠️ CRITICAL DECISION: How do we save current?</p>
            
            <div className="space-y-4">
              <div className="p-3 bg-destructive/10 rounded border border-destructive">
                <p className="text-sm font-semibold text-destructive mb-2">❌ Wrong way:</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`def backtrack(start):
    result.append(current)  # BUG!`}
                </pre>
                <p className="text-xs text-destructive mt-2">
                  This stores a <strong>reference</strong> to current. When current changes later, all saved subsets change too!
                </p>
              </div>

              <div className="p-3 bg-primary/10 rounded border border-primary">
                <p className="text-sm font-semibold text-primary mb-2">✅ Correct way:</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`def backtrack(start):
    result.append(current[:])  # Creates a copy!`}
                </pre>
                <p className="text-xs text-primary mt-2">
                  <code className="bg-primary/20 px-1 rounded">current[:]</code> creates an <strong>independent copy</strong>. Changes to current won't affect this copy.
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded mt-3">
                <p className="text-xs font-semibold mb-2">Why this matters:</p>
                <div className="space-y-1 text-xs font-mono">
                  <p>Without [:]: result = [[1,2,3], [1,2,3], [1,2,3], ...]  ❌ All same!</p>
                  <p>With [:]: result = [[], [1], [2], [1,2], ...]  ✅ All unique!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Our code so far with the correct approach:
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    result = []
    current = []
    
    def backtrack(start):
        result.append(current[:])  # Save a copy of current state`}
            </pre>
          </div>
        </div>

        {/* Step 6: The loop */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              6
            </div>
            <h4 className="text-lg font-semibold text-foreground">Loop through available choices</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              At each node, we try adding each remaining element. This creates the tree branches.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    result = []
    current = []
    
    def backtrack(start):
        result.append(current[:])
        
        for i in range(start, len(nums)):
            # Try adding each element from start onwards`}
            </pre>
            <div className="p-3 bg-primary/5 rounded mt-3">
              <p className="text-xs text-muted-foreground">
                <strong>Why range(start, len(nums))?</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <code className="bg-primary/20 px-1 rounded">start</code> ensures we only consider elements we haven't decided on yet.
                If start=1, we can choose from [2, 3] only (elements at index 1 and 2).
              </p>
            </div>
          </div>
        </div>

        {/* Step 7: Add element to current */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              7
            </div>
            <h4 className="text-lg font-semibold text-foreground">Add the chosen element to current</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              When we choose to include an element, add it to current.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    result = []
    current = []
    
    def backtrack(start):
        result.append(current[:])
        
        for i in range(start, len(nums)):
            current.append(nums[i])  # Include this element`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              This grows current as we go deeper in the tree
            </p>
          </div>
        </div>

        {/* Step 8: Recursive call - CRITICAL CONCEPT C */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-bold">
              8
            </div>
            <h4 className="text-lg font-semibold text-foreground">Make the recursive call</h4>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border-2 border-accent">
            <p className="text-sm font-semibold mb-3">⚠️ CRITICAL DECISION: What parameter to pass?</p>
            
            <div className="space-y-4">
              <div className="p-3 bg-destructive/10 rounded border border-destructive">
                <p className="text-sm font-semibold text-destructive mb-2">❌ backtrack(i) - Wrong!</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`current.append(nums[i])
backtrack(i)  # Can choose same element again!`}
                </pre>
                <p className="text-xs text-destructive mt-2">
                  Infinite loop! We keep choosing the same element forever.
                </p>
              </div>

              <div className="p-3 bg-destructive/10 rounded border border-destructive">
                <p className="text-sm font-semibold text-destructive mb-2">❌ backtrack(start + 1) - Wrong!</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`current.append(nums[i])
backtrack(start + 1)  # Doesn't track which element chosen!`}
                </pre>
                <p className="text-xs text-destructive mt-2">
                  Creates duplicates like [1, 3, 3] because we can re-choose elements.
                </p>
              </div>

              <div className="p-3 bg-primary/10 rounded border border-primary">
                <p className="text-sm font-semibold text-primary mb-2">✅ backtrack(i + 1) - Correct!</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`current.append(nums[i])
backtrack(i + 1)  # Start after the element we chose`}
                </pre>
                <p className="text-xs text-primary mt-2">
                  Perfect! Next call starts from index i+1, ensuring we only choose elements AFTER the one we just picked.
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded mt-3">
                <p className="text-xs font-semibold mb-2">Example:</p>
                <div className="space-y-1 text-xs">
                  <p>If we choose element at i=1 (which is 2)</p>
                  <p>We call backtrack(1 + 1 = 2)</p>
                  <p>Next call can only choose from index 2 onwards: [3]</p>
                  <p>This prevents choosing 2 again ✓</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Our code with the correct recursive call:
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    result = []
    current = []
    
    def backtrack(start):
        result.append(current[:])
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1)  # Recurse with next index`}
            </pre>
          </div>
        </div>

        {/* Step 9: Backtrack (pop) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              9
            </div>
            <h4 className="text-lg font-semibold text-foreground">Remove the element (backtrack)</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              After exploring with an element included, remove it to try other options.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    result = []
    current = []
    
    def backtrack(start):
        result.append(current[:])
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1)
            current.pop()  # Remove element, try next option`}
            </pre>
            <div className="p-3 bg-accent/5 rounded mt-3">
              <p className="text-xs text-muted-foreground">
                <strong>Why pop()?</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This is the "backtrack" step! After exploring all paths with an element, remove it so we can try the next element.
                Example: After exploring [1,2] and [1,2,3], pop 2 to try [1,3].
              </p>
            </div>
          </div>
        </div>

        {/* Step 10: Call backtrack and return */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              10
            </div>
            <h4 className="text-lg font-semibold text-foreground">Start the process and return results</h4>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary">
            <p className="text-sm text-muted-foreground mb-3">
              Complete solution:
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    result = []
    current = []
    
    def backtrack(start):
        result.append(current[:])  # Concept A: Copy, not reference
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1)  # Concept C: i+1, not i or start+1
            current.pop()  # Backtrack
    
    backtrack(0)  # Start from index 0
    return result`}
            </pre>
          </div>

          <div className="p-3 bg-accent/10 rounded mt-3">
            <p className="text-sm font-semibold mb-2">Why start with backtrack(0)?</p>
            <p className="text-xs text-muted-foreground">
              We call backtrack(0) to start exploring from index 0, meaning all elements [1, 2, 3] are available to choose from.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/30">
          <h4 className="font-semibold text-foreground mb-3">Complete Solution Built!</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✅ <strong className="text-foreground">result.append(current[:])</strong> - Creates independent copies</p>
            <p>✅ <strong className="text-foreground">for i in range(start, len(nums))</strong> - Try all available choices</p>
            <p>✅ <strong className="text-foreground">backtrack(i + 1)</strong> - Recurse with next index</p>
            <p>✅ <strong className="text-foreground">current.pop()</strong> - Backtrack to try other options</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
