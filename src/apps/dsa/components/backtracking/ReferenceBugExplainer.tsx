import { Card } from '../ui/card';

export default function ReferenceBugExplainer() {
  return (
    <Card className="p-6 bg-card border-2 border-primary/30">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Concept A: Why current[:] Not current?
          </h3>
          <p className="text-muted-foreground">
            Understanding the reference vs copy bug - the most common mistake in backtracking
          </p>
        </div>

        {/* The Problem */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">The Bug: Using current Without [:]</h4>
          
          <div className="p-4 bg-destructive/5 rounded-lg border-2 border-destructive">
            <p className="text-sm font-semibold mb-2 text-destructive">❌ Broken Code:</p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    result = []
    current = []
    
    def backtrack(start):
        result.append(current)  # BUG: Stores reference!
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1)
            current.pop()`}
            </pre>
          </div>
        </div>

        {/* Step by Step What Happens */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-foreground">What Happens Step by Step</h4>

          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <h5 className="font-semibold">Start: current = []</h5>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="space-y-2">
                <p className="text-sm">Call: <code className="bg-background px-2 py-1 rounded">result.append(current)</code></p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-background rounded">
                    <p className="text-xs text-muted-foreground mb-1">current:</p>
                    <p className="font-mono">[]</p>
                  </div>
                  <div className="p-3 bg-background rounded">
                    <p className="text-xs text-muted-foreground mb-1">result:</p>
                    <p className="font-mono">[[]]</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">✓ Looks good so far</p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <h5 className="font-semibold">Append 1 to current</h5>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
              <div className="space-y-2">
                <p className="text-sm">Call: <code className="bg-background px-2 py-1 rounded">current.append(1)</code></p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-background rounded">
                    <p className="text-xs text-muted-foreground mb-1">current:</p>
                    <p className="font-mono">[1]</p>
                  </div>
                  <div className="p-3 bg-background rounded">
                    <p className="text-xs text-muted-foreground mb-1">result:</p>
                    <p className="font-mono">[[1]]</p>
                    <p className="text-xs text-destructive mt-1">⚠️ Wait, result changed too!</p>
                  </div>
                </div>
                <div className="p-2 bg-destructive/20 rounded mt-3">
                  <p className="text-sm text-destructive font-semibold">🐛 Bug appears: result[0] points to the same array as current!</p>
                  <p className="text-xs text-destructive mt-1">When current changes, result[0] changes automatically</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <h5 className="font-semibold">Add current to result again</h5>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
              <div className="space-y-2">
                <p className="text-sm">Call: <code className="bg-background px-2 py-1 rounded">result.append(current)</code></p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-background rounded">
                    <p className="text-xs text-muted-foreground mb-1">current:</p>
                    <p className="font-mono">[1]</p>
                  </div>
                  <div className="p-3 bg-background rounded">
                    <p className="text-xs text-muted-foreground mb-1">result:</p>
                    <p className="font-mono">[[1], [1]]</p>
                    <p className="text-xs text-destructive mt-1">⚠️ Both point to the same array!</p>
                  </div>
                </div>
                <div className="p-2 bg-destructive/20 rounded mt-3">
                  <p className="text-sm text-destructive font-semibold">🐛 Bug gets worse: result[0] and result[1] both point to current!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <h5 className="font-semibold">Append 2 to current</h5>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
              <div className="space-y-2">
                <p className="text-sm">Call: <code className="bg-background px-2 py-1 rounded">current.append(2)</code></p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-background rounded">
                    <p className="text-xs text-muted-foreground mb-1">current:</p>
                    <p className="font-mono">[1, 2]</p>
                  </div>
                  <div className="p-3 bg-background rounded">
                    <p className="text-xs text-muted-foreground mb-1">result:</p>
                    <p className="font-mono">[[1,2], [1,2]]</p>
                    <p className="text-xs text-destructive mt-1">⚠️ ALL results changed to [1,2]!</p>
                  </div>
                </div>
                <div className="p-2 bg-destructive/20 rounded mt-3">
                  <p className="text-sm text-destructive font-semibold">🐛 Catastrophic: Every element in result is the SAME array!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Final Result */}
          <div className="p-4 bg-destructive/10 rounded-lg border-2 border-destructive">
            <h5 className="font-semibold text-destructive mb-3">Final Broken Result:</h5>
            <p className="font-mono mb-2">result = [[1,2,3], [1,2,3], [1,2,3], [1,2,3], ...]</p>
            <p className="text-sm text-destructive">❌ All subsets are identical! This is wrong.</p>
          </div>
        </div>

        {/* Memory Diagram */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <h4 className="font-semibold mb-3">Memory Diagram: The Problem</h4>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="w-24">result[0]</span>
              <span className="text-destructive">───→</span>
              <span className="text-destructive">current (same memory location)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24">result[1]</span>
              <span className="text-destructive">───→</span>
              <span className="text-destructive">current (same memory location)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-24">result[2]</span>
              <span className="text-destructive">───→</span>
              <span className="text-destructive">current (same memory location)</span>
            </div>
          </div>
          <p className="text-xs text-destructive mt-3">⚠️ All result elements point to the same array in memory!</p>
        </div>

        {/* The Solution */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">The Solution: Using current[:]</h4>
          
          <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary">
            <p className="text-sm font-semibold mb-2 text-primary">✅ Fixed Code:</p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`def subsets(nums):
    result = []
    current = []
    
    def backtrack(start):
        result.append(current[:])  # FIXED: Creates copy!
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1)
            current.pop()`}
            </pre>
          </div>

          <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
            <p className="text-sm mb-3">With <code className="bg-background px-2 py-1 rounded">current[:]</code>, each append creates an <strong>independent copy</strong>:</p>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center gap-2">
                <span className="w-24">result[0]</span>
                <span className="text-primary">───→</span>
                <span className="text-primary">[] (memory location A)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24">result[1]</span>
                <span className="text-primary">───→</span>
                <span className="text-primary">[1] (memory location B)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-24">result[2]</span>
                <span className="text-primary">───→</span>
                <span className="text-primary">[2] (memory location C)</span>
              </div>
            </div>
            <p className="text-xs text-primary mt-3">✓ Each result element has its own independent array!</p>
          </div>

          <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
            <h5 className="font-semibold text-primary mb-3">Final Correct Result:</h5>
            <p className="font-mono mb-2">result = [[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]</p>
            <p className="text-sm text-primary">✅ All subsets are unique! This is correct.</p>
          </div>
        </div>

        {/* Key Takeaway */}
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Key Takeaway
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <code className="px-2 py-1 bg-destructive/20 rounded">result.append(current)</code> stores a <strong>reference</strong> (pointer) to the current array.
            </p>
            <p>
              When the current array changes later, all stored references see the change because they all point to the same memory location.
            </p>
            <p>
              <code className="px-2 py-1 bg-primary/20 rounded">result.append(current[:])</code> creates an <strong>independent copy</strong>.
            </p>
            <p>
              Each copy is a separate array in memory, so changes to current don't affect previously saved copies.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
