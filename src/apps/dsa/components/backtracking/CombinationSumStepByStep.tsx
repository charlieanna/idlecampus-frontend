import { Card } from '../ui/card';

export default function CombinationSumStepByStep() {
  return (
    <Card className="p-6 bg-card border-2 border-primary/30">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Building the Combination Sum Solution Step by Step
          </h3>
          <p className="text-muted-foreground">
            Let's build the code line by line, learning 2 NEW critical concepts
          </p>
        </div>

        {/* Steps 1-4: Same as Subsets (abbreviated) */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="font-semibold mb-2">Steps 1-4: Basic Structure (Same as Subsets)</h4>
          <pre className="text-sm font-mono bg-background p-3 rounded">
{`def combinationSum(candidates, target):
    result = []
    current = []
    
    def backtrack(start, sum):
        # We'll build from here`}
          </pre>
          <p className="text-xs text-muted-foreground mt-2">
            Note: We now need a <code className="bg-primary/20 px-1 rounded">sum</code> parameter to track current total
          </p>
        </div>

        {/* Step 5: CRITICAL - Base Cases */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-bold">
              5
            </div>
            <h4 className="text-lg font-semibold text-foreground">Add base cases (NEW!)</h4>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border-2 border-accent">
            <p className="text-sm font-semibold mb-3">⚠️ CRITICAL: We need TWO base cases now!</p>
            
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded border border-primary">
                <p className="text-sm font-semibold text-primary mb-2">✅ Base Case 1: Success!</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`if sum == target:
    result.append(current[:])
    return  # Stop exploring this path`}
                </pre>
                <p className="text-xs text-primary mt-2">
                  When we reach the target, save the solution and return
                </p>
              </div>

              <div className="p-3 bg-primary/10 rounded border border-primary">
                <p className="text-sm font-semibold text-primary mb-2">✅ Base Case 2: Pruning!</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`if sum > target:
    return  # Dead end, stop exploring`}
                </pre>
                <p className="text-xs text-primary mt-2">
                  When we exceed the target, no point continuing - prune this branch
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded mt-3">
                <p className="text-xs font-semibold mb-2">Why this is NEW:</p>
                <div className="space-y-1 text-xs">
                  <p>• Subsets: All paths are valid, explore everything</p>
                  <p>• Combination Sum: Only paths that sum to target are valid</p>
                  <p>• Subsets: No early stopping</p>
                  <p>• Combination Sum: Stop when sum == target or sum &gt; target</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-3">Our code so far:</p>
            <pre className="text-sm font-mono bg-background p-3 rounded">
{`def combinationSum(candidates, target):
    result = []
    current = []
    
    def backtrack(start, sum):
        if sum == target:
            result.append(current[:])
            return
        if sum > target:
            return`}
            </pre>
          </div>
        </div>

        {/* Steps 6-7: Loop and append (same as Subsets) */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="font-semibold mb-2">Steps 6-7: Loop and Append (Same as Subsets)</h4>
          <pre className="text-sm font-mono bg-background p-3 rounded">
{`def backtrack(start, sum):
    if sum == target:
        result.append(current[:])
        return
    if sum > target:
        return
    
    for i in range(start, len(candidates)):
        current.append(candidates[i])`}
          </pre>
        </div>

        {/* Step 8: CRITICAL - Recursive call */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-bold">
              8
            </div>
            <h4 className="text-lg font-semibold text-foreground">Make the recursive call (DIFFERENT!)</h4>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border-2 border-accent">
            <p className="text-sm font-semibold mb-3">⚠️ CRITICAL: Pass i, NOT i+1!</p>
            
            <div className="space-y-4">
              <div className="p-3 bg-destructive/10 rounded border border-destructive">
                <p className="text-sm font-semibold text-destructive mb-2">❌ Wrong: backtrack(i+1, ...)</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`backtrack(i + 1, sum + candidates[i])`}
                </pre>
                <p className="text-xs text-destructive mt-2">
                  This prevents reusing elements! After choosing 2, can't choose 2 again.
                </p>
              </div>

              <div className="p-3 bg-primary/10 rounded border border-primary">
                <p className="text-sm font-semibold text-primary mb-2">✅ Correct: backtrack(i, ...)</p>
                <pre className="text-xs font-mono bg-background p-2 rounded">
{`backtrack(i, sum + candidates[i])`}
                </pre>
                <p className="text-xs text-primary mt-2">
                  Perfect! Allows reusing the same element. After choosing 2, can choose 2 again.
                </p>
              </div>

              <div className="p-3 bg-muted/50 rounded mt-3">
                <p className="text-xs font-semibold mb-2">Comparison:</p>
                <table className="w-full text-xs mt-2">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2">Problem</th>
                      <th className="text-left p-2">Parameter</th>
                      <th className="text-left p-2">Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-2">Subsets</td>
                      <td className="p-2 font-mono">i + 1</td>
                      <td className="p-2">Each element used once</td>
                    </tr>
                    <tr>
                      <td className="p-2">Combination Sum</td>
                      <td className="p-2 font-mono">i</td>
                      <td className="p-2">Can reuse elements</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Step 9-10: Complete */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              10
            </div>
            <h4 className="text-lg font-semibold text-foreground">Complete the solution</h4>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary">
            <p className="text-sm text-muted-foreground mb-3">Complete solution:</p>
            <pre className="text-sm font-mono bg-background p-3 rounded">
{`def combinationSum(candidates, target):
    result = []
    current = []
    
    def backtrack(start, sum):
        # NEW: Two base cases
        if sum == target:
            result.append(current[:])
            return
        if sum > target:
            return
        
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            backtrack(i, sum + candidates[i])  # DIFFERENT: Pass i
            current.pop()
    
    backtrack(0, 0)
    return result`}
            </pre>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/30">
          <h4 className="font-semibold text-foreground mb-3">Key Differences from Subsets</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✅ <strong className="text-foreground">Two base cases</strong> - Stop at target or when exceeded</p>
            <p>✅ <strong className="text-foreground">Track sum parameter</strong> - Pass through recursion</p>
            <p>✅ <strong className="text-foreground">Pass i not i+1</strong> - Allows reusing elements</p>
            <p>✅ <strong className="text-foreground">Still use current[:]</strong> - Create copies (same as Subsets)</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
