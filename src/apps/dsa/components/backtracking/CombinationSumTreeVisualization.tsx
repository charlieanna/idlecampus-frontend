import { Card } from '../ui/card';

export default function CombinationSumTreeVisualization() {
  return (
    <Card className="p-6 bg-card border-2 border-primary/30">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Decision Tree: Combination Sum
          </h3>
          <p className="text-muted-foreground">
            For candidates = [2, 3, 6, 7] and target = 7, see how the tree explores paths with variable lengths and pruning
          </p>
        </div>

        {/* Key Differences */}
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
          <h4 className="font-semibold mb-2">Key Differences from Subsets Tree:</h4>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Variable-length branches (paths stop at different depths)</li>
            <li>Pruned branches marked with ✗ (when sum &gt; target)</li>
            <li>Successful paths marked with ✓ (when sum == target)</li>
            <li>Can revisit same number (shows why we pass i not i+1)</li>
          </ul>
        </div>

        {/* Complete Tree Diagram */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">Complete Decision Tree</h4>
          
          {/* Level 0: Root */}
          <div className="space-y-2">
            <div className="text-center">
              <div className="inline-block p-3 bg-primary/20 rounded-lg border-2 border-primary">
                <div className="font-mono font-bold">[]</div>
                <div className="text-xs text-muted-foreground">sum = 0</div>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">Level 0: Starting point</p>
          </div>

          {/* Level 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="inline-block p-3 bg-muted rounded-lg border border-border">
                  <div className="font-mono font-bold">[2]</div>
                  <div className="text-xs text-muted-foreground">sum = 2</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block p-3 bg-muted rounded-lg border border-border">
                  <div className="font-mono font-bold">[3]</div>
                  <div className="text-xs text-muted-foreground">sum = 3</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block p-3 bg-muted rounded-lg border border-border">
                  <div className="font-mono font-bold">[6]</div>
                  <div className="text-xs text-muted-foreground">sum = 6</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block p-3 bg-primary/20 rounded-lg border-2 border-primary">
                  <div className="font-mono font-bold">[7]</div>
                  <div className="text-xs text-primary font-semibold">sum = 7 ✓</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">Level 1: Choose first element (can choose any)</p>
          </div>

          {/* Level 2 - From [2] */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">From [2] (sum=2), can add any element:</p>
            <div className="ml-8 flex items-center gap-4">
              <div className="text-center">
                <div className="inline-block p-2 bg-muted rounded border border-border">
                  <div className="font-mono text-sm font-bold">[2,2]</div>
                  <div className="text-xs text-muted-foreground">sum = 4</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block p-2 bg-muted rounded border border-border">
                  <div className="font-mono text-sm font-bold">[2,3]</div>
                  <div className="text-xs text-muted-foreground">sum = 5</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block p-2 bg-destructive/20 rounded border-2 border-destructive">
                  <div className="font-mono text-sm font-bold">[2,6]</div>
                  <div className="text-xs text-destructive font-semibold">sum = 8 ✗</div>
                </div>
              </div>
            </div>
            <p className="text-xs ml-8 text-muted-foreground">Note: [2,6] pruned (exceeds target)</p>
          </div>

          {/* Level 3 - From [2,2] */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">From [2,2] (sum=4), can add 2, 3, 6, or 7:</p>
            <div className="ml-16 flex items-center gap-4">
              <div className="text-center">
                <div className="inline-block p-2 bg-muted rounded border border-border">
                  <div className="font-mono text-sm font-bold">[2,2,2]</div>
                  <div className="text-xs text-muted-foreground">sum = 6</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block p-2 bg-primary/20 rounded border-2 border-primary">
                  <div className="font-mono text-sm font-bold">[2,2,3]</div>
                  <div className="text-xs text-primary font-semibold">sum = 7 ✓</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block p-2 bg-destructive/20 rounded border-2 border-destructive">
                  <div className="font-mono text-sm font-bold">[2,2,6]</div>
                  <div className="text-xs text-destructive font-semibold">sum = 10 ✗</div>
                </div>
              </div>
            </div>
            <p className="text-xs ml-16 text-muted-foreground">Found solution: [2,2,3]! Also pruned [2,2,6]</p>
          </div>

          {/* Level 3 - From [2,3] */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">From [2,3] (sum=5), exploring further would exceed target</p>
            <div className="ml-16 flex items-center gap-4">
              <div className="text-center">
                <div className="inline-block p-2 bg-destructive/20 rounded border-2 border-destructive">
                  <div className="font-mono text-sm font-bold">[2,3,3]</div>
                  <div className="text-xs text-destructive font-semibold">sum = 8 ✗</div>
                </div>
              </div>
            </div>
            <p className="text-xs ml-16 text-muted-foreground">All branches pruned</p>
          </div>

          {/* Level 2 - From [3] */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">From [3] (sum=3), can add 3, 6, or 7:</p>
            <div className="ml-8 flex items-center gap-4">
              <div className="text-center">
                <div className="inline-block p-2 bg-muted rounded border border-border">
                  <div className="font-mono text-sm font-bold">[3,3]</div>
                  <div className="text-xs text-muted-foreground">sum = 6</div>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block p-2 bg-destructive/20 rounded border-2 border-destructive">
                  <div className="font-mono text-sm font-bold">[3,6]</div>
                  <div className="text-xs text-destructive font-semibold">sum = 9 ✗</div>
                </div>
              </div>
            </div>
          </div>

          {/* Level 2 - From [6] */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">From [6] (sum=6), any addition exceeds target:</p>
            <div className="ml-8 flex items-center gap-4">
              <div className="text-center">
                <div className="inline-block p-2 bg-destructive/20 rounded border-2 border-destructive">
                  <div className="font-mono text-sm font-bold">[6,6]</div>
                  <div className="text-xs text-destructive font-semibold">sum = 12 ✗</div>
                </div>
              </div>
            </div>
            <p className="text-xs ml-8 text-muted-foreground">All branches pruned immediately</p>
          </div>
        </div>

        {/* Summary of Solutions */}
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
          <h4 className="font-semibold mb-3">Solutions Found:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <code className="font-mono bg-background px-3 py-1 rounded">[7]</code>
              <span className="text-sm text-muted-foreground">Found at depth 1</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <code className="font-mono bg-background px-3 py-1 rounded">[2, 2, 3]</code>
              <span className="text-sm text-muted-foreground">Found at depth 3</span>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Key Insights
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Variable-length paths:</strong> [7] reaches target at depth 1, 
              while [2,2,3] reaches at depth 3
            </p>
            <p>
              <strong className="text-foreground">Pruning saves work:</strong> When sum exceeds target, 
              we stop exploring that branch (marked with ✗)
            </p>
            <p>
              <strong className="text-foreground">Can reuse elements:</strong> Notice [2,2,3] reuses 2. 
              This is why we pass i not i+1 in the recursive call
            </p>
            <p>
              <strong className="text-foreground">Early termination:</strong> When we reach target, 
              we save the solution and return (no point exploring further from that path)
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
