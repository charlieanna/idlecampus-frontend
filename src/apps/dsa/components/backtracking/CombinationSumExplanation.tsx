import { Card } from '../ui/card';

export default function CombinationSumExplanation() {
  const candidates = [2, 3, 6, 7];
  const target = 7;

  return (
    <Card className="p-6 bg-card border-2 border-primary/30">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Understanding Combination Sum
          </h3>
          <p className="text-muted-foreground">
            For candidates <code className="px-2 py-1 bg-primary/10 rounded">[{candidates.join(', ')}]</code> and target <code className="px-2 py-1 bg-primary/10 rounded">{target}</code>, 
            let's understand how to find all combinations that sum to the target
          </p>
        </div>

        {/* What is Combination Sum */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground">What is Combination Sum?</h4>
          <p className="text-muted-foreground">
            Find all unique combinations of numbers from candidates that sum to the target. 
            You can use the same number <strong>unlimited times</strong>.
          </p>
          <div className="p-3 bg-accent/10 rounded">
            <p className="text-sm"><strong>Key difference from Subsets:</strong></p>
            <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
              <li>Subsets: Include/exclude each element once</li>
              <li>Combination Sum: Can reuse same element multiple times</li>
              <li>Combination Sum: Stop when we reach target (or exceed it)</li>
            </ul>
          </div>
        </div>

        {/* Example Walkthrough */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-foreground">Building Solutions Step by Step</h4>

          {/* Path 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <h5 className="font-semibold">Path: Start with 2</h5>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <p className="text-sm mb-2">Start: [] (sum = 0)</p>
                  <p className="text-sm mb-2">Add 2: [2] (sum = 2)</p>
                  <p className="text-sm mb-2">Add 2 again: [2, 2] (sum = 4)</p>
                  <p className="text-sm mb-2">Add 3: [2, 2, 3] (sum = 7) ✓</p>
                </div>
                <div className="p-2 bg-primary/10 rounded">
                  <p className="text-sm text-primary font-semibold">✓ Found solution: [2, 2, 3]</p>
                </div>
              </div>
            </div>
          </div>

          {/* Path 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <h5 className="font-semibold">Path: Start with 7</h5>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <p className="text-sm mb-2">Start: [] (sum = 0)</p>
                  <p className="text-sm mb-2">Add 7: [7] (sum = 7) ✓</p>
                </div>
                <div className="p-2 bg-primary/10 rounded">
                  <p className="text-sm text-primary font-semibold">✓ Found solution: [7]</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dead end example */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center flex-shrink-0 font-bold">
                ✗
              </div>
              <h5 className="font-semibold">Dead End: Exceeding target</h5>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
              <div className="space-y-3">
                <div className="p-3 bg-background rounded">
                  <p className="text-sm mb-2">Start: [] (sum = 0)</p>
                  <p className="text-sm mb-2">Add 6: [6] (sum = 6)</p>
                  <p className="text-sm mb-2 text-destructive">Add 6 again: [6, 6] (sum = 12) &gt; 7 ✗</p>
                </div>
                <div className="p-2 bg-destructive/20 rounded">
                  <p className="text-sm text-destructive font-semibold">✗ Exceeded target! Stop and backtrack</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Differences */}
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
          <h4 className="font-semibold mb-3">Key Insights</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold text-xs">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground">Reusable Elements</p>
                <p>We can use the same number multiple times: [2, 2, 3] uses 2 twice</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold text-xs">
                2
              </div>
              <div>
                <p className="font-semibold text-foreground">Variable-Length Paths</p>
                <p>Solutions can be different lengths: [7] has 1 element, [2,2,3] has 3 elements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold text-xs">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground">Pruning Dead Ends</p>
                <p>When sum exceeds target, we stop exploring that path (no point continuing)</p>
              </div>
            </div>
          </div>
        </div>

        {/* All Solutions */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="font-semibold mb-3">Complete Solutions for target = 7:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-background rounded border border-border">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center font-mono text-sm font-bold">2</div>
                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center font-mono text-sm font-bold">2</div>
                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center font-mono text-sm font-bold">3</div>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">2 + 2 + 3 = 7</p>
            </div>
            <div className="p-3 bg-background rounded border border-border">
              <div className="flex items-center gap-2 justify-center">
                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center font-mono text-sm font-bold">7</div>
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">7 = 7</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Total solutions: 2</p>
        </div>

        {/* Key Insight */}
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Key Insight
          </h4>
          <p className="text-sm text-muted-foreground">
            Combination Sum is about exploring paths until we either reach the target (success) or exceed it (dead end).
            Unlike subsets where we explore every element exactly once, here we can keep choosing the same element
            until we've used up our "budget" (the target sum).
          </p>
        </div>
      </div>
    </Card>
  );
}
