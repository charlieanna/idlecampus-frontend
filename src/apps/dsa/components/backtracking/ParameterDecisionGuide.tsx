import { Card } from '../ui/card';

export default function ParameterDecisionGuide() {
  return (
    <Card className="p-6 bg-card border-2 border-primary/30">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Concept C: Why backtrack(i + 1)?
          </h3>
          <p className="text-muted-foreground">
            Understanding why we pass <code className="px-2 py-1 bg-primary/10 rounded">i + 1</code> and not <code className="px-2 py-1 bg-primary/10 rounded">i</code> or <code className="px-2 py-1 bg-primary/10 rounded">start + 1</code>
          </p>
        </div>

        {/* The Question */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="font-semibold mb-2">The Question:</h4>
          <p className="text-sm text-muted-foreground mb-3">
            In the recursive call, what parameter should we pass?
          </p>
          <pre className="text-sm font-mono bg-background p-3 rounded">
{`for i in range(start, len(nums)):
    current.append(nums[i])
    backtrack(???)  # What should we pass here?
    current.pop()`}
          </pre>
        </div>

        {/* Option 1: backtrack(i) - WRONG */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center flex-shrink-0 font-bold">
              ✗
            </div>
            <h4 className="text-lg font-semibold text-foreground">Option 1: backtrack(i) - WRONG</h4>
          </div>

          <div className="p-4 bg-destructive/5 rounded-lg border-2 border-destructive">
            <p className="text-sm font-semibold mb-2 text-destructive">Code:</p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`for i in range(start, len(nums)):
    current.append(nums[i])
    backtrack(i)  # WRONG: Will revisit same element!
    current.pop()`}
            </pre>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">What happens with nums = [1, 2, 3]:</p>
            
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
              <div className="space-y-2 text-sm font-mono">
                <div className="p-2 bg-background rounded">
                  <p className="text-muted-foreground">Call: backtrack(0)</p>
                  <p>current = []</p>
                  <p className="text-xs text-muted-foreground">Loop: i = 0</p>
                </div>
                <div className="p-2 bg-background rounded ml-4">
                  <p className="text-muted-foreground">Append nums[0] = 1</p>
                  <p>current = [1]</p>
                  <p className="text-destructive">Call: backtrack(0) ← PROBLEM!</p>
                </div>
                <div className="p-2 bg-destructive/20 rounded ml-8">
                  <p className="text-destructive font-semibold">Loop again: i = 0</p>
                  <p className="text-destructive">Append nums[0] = 1 AGAIN</p>
                  <p className="text-destructive">current = [1, 1]</p>
                  <p className="text-destructive">Call: backtrack(0) again...</p>
                </div>
                <div className="p-2 bg-destructive/20 rounded ml-12">
                  <p className="text-destructive font-semibold">Loop again: i = 0</p>
                  <p className="text-destructive">current = [1, 1, 1]</p>
                  <p className="text-destructive">... infinite recursion!</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-destructive/20 rounded">
              <p className="text-sm text-destructive font-semibold">❌ Problem: Infinite recursion!</p>
              <p className="text-xs text-destructive mt-1">
                We keep choosing the same element over and over because start never moves forward.
              </p>
            </div>
          </div>
        </div>

        {/* Option 2: backtrack(start + 1) - WRONG */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center flex-shrink-0 font-bold">
              ✗
            </div>
            <h4 className="text-lg font-semibold text-foreground">Option 2: backtrack(start + 1) - WRONG</h4>
          </div>

          <div className="p-4 bg-destructive/5 rounded-lg border-2 border-destructive">
            <p className="text-sm font-semibold mb-2 text-destructive">Code:</p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`for i in range(start, len(nums)):
    current.append(nums[i])
    backtrack(start + 1)  # WRONG: Doesn't track chosen element!
    current.pop()`}
            </pre>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">What happens with nums = [1, 2, 3]:</p>
            
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
              <div className="space-y-3 text-sm">
                <div className="p-2 bg-background rounded">
                  <p className="font-mono text-muted-foreground mb-1">backtrack(0), i=0: Choose 1</p>
                  <p className="font-mono">current = [1]</p>
                  <p className="font-mono">Call: backtrack(0 + 1 = 1)</p>
                </div>
                
                <div className="p-2 bg-background rounded ml-4">
                  <p className="font-mono text-muted-foreground mb-1">backtrack(1), Loop: i=1,2</p>
                  <p className="font-semibold mb-2">Branch i=1: Choose 2</p>
                  <p className="font-mono">current = [1, 2]</p>
                  <p className="font-mono">Call: backtrack(1 + 1 = 2)</p>
                  <p className="text-xs text-primary mt-1">✓ This is fine</p>
                </div>

                <div className="p-2 bg-destructive/20 rounded ml-4">
                  <p className="font-semibold mb-2">Branch i=2: Choose 3</p>
                  <p className="font-mono">current = [1, 3]</p>
                  <p className="font-mono text-destructive">Call: backtrack(1 + 1 = 2) ← PROBLEM!</p>
                </div>

                <div className="p-2 bg-destructive/20 rounded ml-8">
                  <p className="font-mono text-destructive mb-1">backtrack(2), Loop: i=2</p>
                  <p className="font-mono text-destructive">Choose 3 AGAIN!</p>
                  <p className="font-mono text-destructive">current = [1, 3, 3]</p>
                  <p className="text-xs text-destructive mt-1">⚠️ Duplicate 3!</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-destructive/20 rounded">
              <p className="text-sm text-destructive font-semibold">❌ Problem: Creates duplicates like [1, 3, 3]</p>
              <p className="text-xs text-destructive mt-1">
                Using start + 1 doesn't account for which element we chose. We can re-choose the same element.
              </p>
            </div>

            <div className="p-3 bg-muted/50 rounded mt-3">
              <p className="text-sm font-semibold mb-2">Why this happens:</p>
              <p className="text-xs text-muted-foreground">
                When we choose element at index i=2 (which is 3), we call backtrack(start + 1 = 2).
                This means the next call can still access index 2, so it chooses 3 again!
              </p>
            </div>
          </div>
        </div>

        {/* Option 3: backtrack(i + 1) - CORRECT */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              ✓
            </div>
            <h4 className="text-lg font-semibold text-foreground">Option 3: backtrack(i + 1) - CORRECT</h4>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary">
            <p className="text-sm font-semibold mb-2 text-primary">Code:</p>
            <pre className="text-sm font-mono bg-background p-3 rounded overflow-x-auto">
{`for i in range(start, len(nums)):
    current.append(nums[i])
    backtrack(i + 1)  # CORRECT: Next call starts after chosen element
    current.pop()`}
            </pre>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">What happens with nums = [1, 2, 3]:</p>
            
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <div className="space-y-3 text-sm">
                <div className="p-2 bg-background rounded">
                  <p className="font-mono text-muted-foreground mb-1">backtrack(0), Loop: i=0,1,2</p>
                  <p className="font-semibold">When i=0: Choose nums[0]=1</p>
                  <p className="font-mono">current = [1]</p>
                  <p className="font-mono text-primary">Call: backtrack(0 + 1 = 1)</p>
                  <p className="text-xs text-primary mt-1">✓ Start from index 1 (after 1)</p>
                  <p className="text-xs text-muted-foreground">Can choose: [2, 3]</p>
                </div>

                <div className="p-2 bg-background rounded">
                  <p className="font-mono text-muted-foreground mb-1">backtrack(0), Loop: i=0,1,2</p>
                  <p className="font-semibold">When i=1: Choose nums[1]=2</p>
                  <p className="font-mono">current = [2]</p>
                  <p className="font-mono text-primary">Call: backtrack(1 + 1 = 2)</p>
                  <p className="text-xs text-primary mt-1">✓ Start from index 2 (after 2)</p>
                  <p className="text-xs text-muted-foreground">Can choose: [3]</p>
                </div>

                <div className="p-2 bg-background rounded">
                  <p className="font-mono text-muted-foreground mb-1">backtrack(0), Loop: i=0,1,2</p>
                  <p className="font-semibold">When i=2: Choose nums[2]=3</p>
                  <p className="font-mono">current = [3]</p>
                  <p className="font-mono text-primary">Call: backtrack(2 + 1 = 3)</p>
                  <p className="text-xs text-primary mt-1">✓ Start from index 3 (after 3)</p>
                  <p className="text-xs text-muted-foreground">Can choose: [] (done)</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-primary/20 rounded">
              <p className="text-sm text-primary font-semibold">✅ Result: All subsets are unique!</p>
              <p className="text-xs text-primary mt-1">
                By using i + 1, we ensure the next recursive call only considers elements AFTER the one we just chose.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Summary */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground">Quick Comparison</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="border border-border p-3 text-left">Approach</th>
                  <th className="border border-border p-3 text-left">What Happens</th>
                  <th className="border border-border p-3 text-left">Why Wrong/Right</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-3">
                    <code className="px-2 py-1 bg-destructive/20 rounded">backtrack(i)</code>
                  </td>
                  <td className="border border-border p-3">
                    Infinite loop
                  </td>
                  <td className="border border-border p-3 text-destructive">
                    ❌ Keeps choosing same element forever
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3">
                    <code className="px-2 py-1 bg-destructive/20 rounded">backtrack(start + 1)</code>
                  </td>
                  <td className="border border-border p-3">
                    Duplicates like [1,3,3]
                  </td>
                  <td className="border border-border p-3 text-destructive">
                    ❌ Doesn't track which element chosen
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-3">
                    <code className="px-2 py-1 bg-primary/20 rounded">backtrack(i + 1)</code>
                  </td>
                  <td className="border border-border p-3">
                    Correct subsets
                  </td>
                  <td className="border border-border p-3 text-primary">
                    ✅ Starts after chosen element
                  </td>
                </tr>
              </tbody>
            </table>
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
              <strong className="text-foreground">i + 1 is correct</strong> because it ensures the next recursive call 
              starts from the index AFTER the element we just chose.
            </p>
            <p>
              This prevents us from choosing the same element multiple times and avoids infinite loops.
            </p>
            <p>
              <strong className="text-foreground">The pattern:</strong> When we choose element at index i, 
              we pass i + 1 to say "for your choices, start from the next element."
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
