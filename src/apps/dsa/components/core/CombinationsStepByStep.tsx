import { Card } from '../ui/card';

export default function CombinationsStepByStep() {
  return (
    <Card className="p-6 bg-card border-2 border-primary/30">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Building the Combinations Solution Step by Step
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
              We need a function that takes n and k, returns all combinations of k numbers from 1 to n.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def combine(n, k):
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
            <h4 className="text-lg font-semibold text-foreground">Add a result array to store all combinations</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              We need somewhere to collect all the combinations we find.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def combine(n, k):
    result = []  # Stores all combinations we discover
    pass`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              For n=4, k=2, this will hold: [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]
            </p>
          </div>
        </div>

        {/* Step 3: Backtrack function */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              3
            </div>
            <h4 className="text-lg font-semibold text-foreground">Create the backtrack helper function</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Backtracking uses recursion to build combinations. We need a helper function.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def combine(n, k):
    result = []
    
    def backtrack(start, current):
        # start: which numbers we can still choose
        # current: the combination we're building
        pass`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              <code className="bg-primary/20 px-1 rounded">start</code> ensures we only move forward (no duplicates like [2,1])
            </p>
          </div>
        </div>

        {/* Step 4: Base case - CRITICAL CONCEPT */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-bold">
              4
            </div>
            <h4 className="text-lg font-semibold text-foreground">Check if we have k elements (base case)</h4>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border-2 border-accent">
            <p className="text-sm font-semibold mb-3">⚠️ CRITICAL: When do we save a combination?</p>
            
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded border border-primary">
                <p className="text-sm font-semibold text-primary mb-2">✅ Correct way:</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`def backtrack(start, current):
    if len(current) == k:
        result.append(current[:])  # Found k elements!
        return  # Stop exploring further`}
                </pre>
                <p className="text-xs text-primary mt-2">
                  Unlike subsets (where every state is valid), combinations need EXACTLY k elements.
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded">
                <p className="text-xs font-semibold mb-2">Why return?</p>
                <p className="text-xs text-muted-foreground">
                  Once we have k elements, we're done! Continuing would create invalid combinations with k+1, k+2 elements.
                </p>
              </div>

              <div className="p-3 bg-destructive/10 rounded border border-destructive mt-3">
                <p className="text-sm font-semibold text-destructive mb-2">❌ Common mistake:</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`if len(current) == k:
    result.append(current)  # BUG! Reference not copy!`}
                </pre>
                <p className="text-xs text-destructive mt-2">
                  Must use <code className="bg-destructive/20 px-1 rounded">current[:]</code> to create a copy, otherwise all results reference the same list!
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Our code so far:
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def combine(n, k):
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])  # Save copy
            return  # Stop here`}
            </pre>
          </div>
        </div>

        {/* Step 5: The loop */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              5
            </div>
            <h4 className="text-lg font-semibold text-foreground">Loop through available choices</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              Try adding each number from start to n. This ensures we only move forward.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def combine(n, k):
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])
            return
        
        for i in range(start, n + 1):
            # Try adding each number from start onwards`}
            </pre>
            <div className="p-3 bg-primary/5 rounded mt-3">
              <p className="text-xs text-muted-foreground">
                <strong>Why range(start, n + 1)?</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                For n=4: If start=1, we can choose [1,2,3,4]. If start=3, we can only choose [3,4].
                This prevents duplicates like [2,1] because after choosing 1, we only consider 2,3,4.
              </p>
            </div>
          </div>
        </div>

        {/* Step 6: Add element to current */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              6
            </div>
            <h4 className="text-lg font-semibold text-foreground">Add the chosen number to current</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              When we choose to include a number, add it to current.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def combine(n, k):
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])
            return
        
        for i in range(start, n + 1):
            current.append(i)  # Choose this number`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              Example: If i=2, current becomes [1, 2]
            </p>
          </div>
        </div>

        {/* Step 7: Recursive call - MOST CRITICAL */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-bold">
              7
            </div>
            <h4 className="text-lg font-semibold text-foreground">Make the recursive call</h4>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border-2 border-accent">
            <p className="text-sm font-semibold mb-3">⚠️ MOST CRITICAL DECISION: What parameter to pass?</p>
            
            <div className="space-y-4">
              <div className="p-3 bg-destructive/10 rounded border border-destructive">
                <p className="text-sm font-semibold text-destructive mb-2">❌ backtrack(i, current) - Wrong!</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`current.append(i)
backtrack(i, current)  # Can choose same number again!`}
                </pre>
                <p className="text-xs text-destructive mt-2">
                  Infinite loop! We keep choosing the same number forever.
                </p>
              </div>

              <div className="p-3 bg-destructive/10 rounded border border-destructive">
                <p className="text-sm font-semibold text-destructive mb-2">❌ backtrack(start + 1, current) - Wrong!</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`current.append(i)
backtrack(start + 1, current)  # Doesn't track which chosen!`}
                </pre>
                <p className="text-xs text-destructive mt-2">
                  Skips valid combinations! If start=1 and i=3, next call starts at 2 (wrong, should be 4).
                </p>
              </div>

              <div className="p-3 bg-primary/10 rounded border border-primary">
                <p className="text-sm font-semibold text-primary mb-2">✅ backtrack(i + 1, current) - Correct!</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`current.append(i)
backtrack(i + 1, current)  # Start after chosen number`}
                </pre>
                <p className="text-xs text-primary mt-2">
                  Perfect! After choosing number i, next call starts from i+1, ensuring we only move forward.
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded mt-3">
                <p className="text-xs font-semibold mb-2">Example walkthrough:</p>
                <div className="space-y-1 text-xs font-mono">
                  <p>Choose i=1: current=[1], call backtrack(2, [1])</p>
                  <p>  Choose i=2: current=[1,2], call backtrack(3, [1,2])</p>
                  <p>    len=2, save [1,2]! ✓</p>
                  <p>  Backtrack, try i=3: current=[1,3], save [1,3]! ✓</p>
                  <p>Choose i=2: current=[2], call backtrack(3, [2])</p>
                  <p>  Choose i=3: current=[2,3], save [2,3]! ✓</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Notice: We NEVER generate [2,1] because after choosing 2, we start from 3!
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Our code with the correct recursive call:
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def combine(n, k):
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])
            return
        
        for i in range(start, n + 1):
            current.append(i)
            backtrack(i + 1, current)  # i+1 is THE KEY!`}
            </pre>
          </div>
        </div>

        {/* Step 8: Backtrack (pop) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              8
            </div>
            <h4 className="text-lg font-semibold text-foreground">Remove the number (backtrack)</h4>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">
              After exploring with a number included, remove it to try the next number.
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def combine(n, k):
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])
            return
        
        for i in range(start, n + 1):
            current.append(i)
            backtrack(i + 1, current)
            current.pop()  # Remove number, try next`}
            </pre>
            <div className="p-3 bg-accent/5 rounded mt-3">
              <p className="text-xs text-muted-foreground">
                <strong>Why pop()?</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This is the "backtrack" step! After finding [1,2], we pop 2 to try [1,3].
                After finding [1,3], we pop 3 to try [1,4]. Then pop 1 to try starting with [2].
              </p>
            </div>
          </div>
        </div>

        {/* Step 9: Call backtrack and return */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              9
            </div>
            <h4 className="text-lg font-semibold text-foreground">Start the process and return results</h4>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary">
            <p className="text-sm text-muted-foreground mb-3">
              Complete solution:
            </p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def combine(n, k):
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current[:])  # Copy, not reference!
            return  # Stop at exactly k elements
        
        for i in range(start, n + 1):
            current.append(i)
            backtrack(i + 1, current)  # i+1, not i or start+1!
            current.pop()  # Backtrack
    
    backtrack(1, [])  # Start from number 1
    return result`}
            </pre>
          </div>

          <div className="p-3 bg-accent/10 rounded mt-3">
            <p className="text-sm font-semibold mb-2">Why start with backtrack(1, [])?</p>
            <p className="text-xs text-muted-foreground">
              We call backtrack(1, []) to start from number 1 with an empty combination.
              This means all numbers [1, 2, 3, ..., n] are available to choose from.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/30">
          <h4 className="font-semibold text-foreground mb-3">Complete Solution Built!</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✅ <strong className="text-foreground">len(current) == k</strong> - Base case: exactly k elements</p>
            <p>✅ <strong className="text-foreground">result.append(current[:])</strong> - Creates independent copies</p>
            <p>✅ <strong className="text-foreground">return after saving</strong> - Don't explore beyond k elements</p>
            <p>✅ <strong className="text-foreground">for i in range(start, n + 1)</strong> - Only move forward</p>
            <p>✅ <strong className="text-foreground">backtrack(i + 1, current)</strong> - THE CRITICAL LINE!</p>
            <p>✅ <strong className="text-foreground">current.pop()</strong> - Backtrack to try other options</p>
          </div>
          <div className="mt-4 p-3 bg-primary/10 rounded">
            <p className="text-xs font-semibold text-primary mb-1">Test it:</p>
            <p className="text-xs font-mono">combine(4, 2) → [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
