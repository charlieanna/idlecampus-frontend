import { Card } from '../ui/card';

export default function SubsetsTreeVisualization() {
  const nums = [1, 2, 3];

  return (
    <Card className="p-6 bg-card border-2 border-primary/30">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Decision Tree: How Subsets Are Built
          </h3>
          <p className="text-muted-foreground">
            For array <code className="px-2 py-1 bg-primary/10 rounded">[{nums.join(', ')}]</code>, the decision tree shows every include/exclude choice
          </p>
        </div>

        {/* The Complete Tree */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-foreground">The Complete Decision Tree</h4>
          <p className="text-muted-foreground text-sm">
            Each level represents a decision about one element. Left branch = exclude, Right branch = include.
          </p>
          
          <div className="p-6 bg-muted/30 rounded-lg border border-border overflow-x-auto">
            <div className="min-w-[800px] font-mono text-sm">
              {/* Root */}
              <div className="text-center mb-4">
                <div className="inline-block p-3 bg-primary/20 rounded-lg border-2 border-primary">
                  <div className="text-xs text-muted-foreground">Start</div>
                  <div className="font-bold">[]</div>
                </div>
              </div>

              {/* Level 1: Decision on element 1 */}
              <div className="text-center mb-2 text-xs text-muted-foreground">
                ↙ Exclude 1 | Include 1 ↘
              </div>
              <div className="flex justify-center gap-32 mb-4">
                <div className="p-2 bg-destructive/10 rounded border border-destructive/30">
                  <div className="text-xs text-destructive">Exclude 1</div>
                  <div className="font-bold">[]</div>
                </div>
                <div className="p-2 bg-primary/10 rounded border border-primary/30">
                  <div className="text-xs text-primary">Include 1</div>
                  <div className="font-bold">[1]</div>
                </div>
              </div>

              {/* Level 2: Decision on element 2 */}
              <div className="text-center mb-2 text-xs text-muted-foreground">
                For each node: ↙ Exclude 2 | Include 2 ↘
              </div>
              <div className="flex justify-center gap-12 mb-4">
                <div className="flex gap-12">
                  <div className="p-2 bg-destructive/10 rounded border border-destructive/30 text-xs">
                    <div className="text-destructive">✗ 2</div>
                    <div>[]</div>
                  </div>
                  <div className="p-2 bg-primary/10 rounded border border-primary/30 text-xs">
                    <div className="text-primary">✓ 2</div>
                    <div>[2]</div>
                  </div>
                </div>
                <div className="flex gap-12">
                  <div className="p-2 bg-destructive/10 rounded border border-destructive/30 text-xs">
                    <div className="text-destructive">✗ 2</div>
                    <div>[1]</div>
                  </div>
                  <div className="p-2 bg-primary/10 rounded border border-primary/30 text-xs">
                    <div className="text-primary">✓ 2</div>
                    <div>[1,2]</div>
                  </div>
                </div>
              </div>

              {/* Level 3: Decision on element 3 */}
              <div className="text-center mb-2 text-xs text-muted-foreground">
                For each of the 4 nodes: ↙ Exclude 3 | Include 3 ↘
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="space-y-2">
                  <div className="p-2 bg-destructive/10 rounded border border-destructive/30">
                    <div className="text-destructive">✗ 3</div>
                    <div>[]</div>
                  </div>
                  <div className="p-2 bg-primary/10 rounded border border-primary/30">
                    <div className="text-primary">✓ 3</div>
                    <div>[3]</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-destructive/10 rounded border border-destructive/30">
                    <div className="text-destructive">✗ 3</div>
                    <div>[2]</div>
                  </div>
                  <div className="p-2 bg-primary/10 rounded border border-primary/30">
                    <div className="text-primary">✓ 3</div>
                    <div>[2,3]</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-destructive/10 rounded border border-destructive/30">
                    <div className="text-destructive">✗ 3</div>
                    <div>[1]</div>
                  </div>
                  <div className="p-2 bg-primary/10 rounded border border-primary/30">
                    <div className="text-primary">✓ 3</div>
                    <div>[1,3]</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-destructive/10 rounded border border-destructive/30">
                    <div className="text-destructive">✗ 3</div>
                    <div>[1,2]</div>
                  </div>
                  <div className="p-2 bg-primary/10 rounded border border-primary/30">
                    <div className="text-primary">✓ 3</div>
                    <div>[1,2,3]</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-muted-foreground">
                Final leaf nodes: 8 unique subsets
              </div>
            </div>
          </div>
        </div>

        {/* Step by Step Explanation */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-foreground">Step-by-Step Tree Building</h4>

          {/* Level 0 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                0
              </div>
              <h5 className="font-semibold">Root: Start with empty subset</h5>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                We begin with an empty subset []. This is the root of our decision tree.
              </p>
              <div className="inline-block p-3 bg-background rounded border border-border">
                <div className="font-mono">[]</div>
              </div>
            </div>
          </div>

          {/* Level 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <h5 className="font-semibold">Level 1: Decision on element 1</h5>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                From [], we have 2 choices for element 1:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-destructive/5 rounded border border-destructive/20">
                  <div className="text-sm font-semibold text-destructive mb-2">Left branch: Exclude 1</div>
                  <div className="font-mono">[] → []</div>
                  <p className="text-xs text-muted-foreground mt-2">Don't add 1, keep []</p>
                </div>
                <div className="p-3 bg-primary/5 rounded border border-primary/20">
                  <div className="text-sm font-semibold text-primary mb-2">Right branch: Include 1</div>
                  <div className="font-mono">[] → [1]</div>
                  <p className="text-xs text-muted-foreground mt-2">Add 1 to get [1]</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Result: 2 nodes at this level</p>
            </div>
          </div>

          {/* Level 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <h5 className="font-semibold">Level 2: Decision on element 2</h5>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Each of the 2 nodes from Level 1 splits into 2 choices for element 2:
              </p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">From node: []</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-destructive/5 rounded border border-destructive/20">
                      <span className="text-destructive">Exclude 2:</span> [] → []
                    </div>
                    <div className="p-2 bg-primary/5 rounded border border-primary/20">
                      <span className="text-primary">Include 2:</span> [] → [2]
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-semibold mb-2">From node: [1]</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-destructive/5 rounded border border-destructive/20">
                      <span className="text-destructive">Exclude 2:</span> [1] → [1]
                    </div>
                    <div className="p-2 bg-primary/5 rounded border border-primary/20">
                      <span className="text-primary">Include 2:</span> [1] → [1,2]
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3">Result: 4 nodes at this level ([], [2], [1], [1,2])</p>
            </div>
          </div>

          {/* Level 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <h5 className="font-semibold">Level 3: Decision on element 3 (Final)</h5>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Each of the 4 nodes from Level 2 splits into 2 final subsets:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-background rounded border border-border">
                  <p className="font-semibold mb-2">From: []</p>
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <span className="text-destructive">✗ 3:</span>
                      <span>[] → <strong>[]</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary">✓ 3:</span>
                      <span>[] → <strong>[3]</strong></span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-background rounded border border-border">
                  <p className="font-semibold mb-2">From: [2]</p>
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <span className="text-destructive">✗ 3:</span>
                      <span>[2] → <strong>[2]</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary">✓ 3:</span>
                      <span>[2] → <strong>[2,3]</strong></span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-background rounded border border-border">
                  <p className="font-semibold mb-2">From: [1]</p>
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <span className="text-destructive">✗ 3:</span>
                      <span>[1] → <strong>[1]</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary">✓ 3:</span>
                      <span>[1] → <strong>[1,3]</strong></span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-background rounded border border-border">
                  <p className="font-semibold mb-2">From: [1,2]</p>
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <span className="text-destructive">✗ 3:</span>
                      <span>[1,2] → <strong>[1,2]</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-primary">✓ 3:</span>
                      <span>[1,2] → <strong>[1,2,3]</strong></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3">Result: 8 leaf nodes (final subsets)</p>
            </div>
          </div>
        </div>

        {/* Tree Properties */}
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
          <h4 className="font-semibold mb-3">Tree Properties</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Height:</strong> The tree has {nums.length + 1} levels (0 to {nums.length})
            </p>
            <p>
              <strong className="text-foreground">Branching:</strong> Each node (except leaf nodes) has exactly 2 children
            </p>
            <p>
              <strong className="text-foreground">Leaf Nodes:</strong> The bottom level has 2³ = 8 leaf nodes, representing all possible subsets
            </p>
            <p>
              <strong className="text-foreground">Paths:</strong> Each path from root to leaf represents one unique subset
            </p>
          </div>
        </div>

        {/* Key Insight */}
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Key Insight
          </h4>
          <p className="text-sm text-muted-foreground">
            The tree structure naturally emerges from the binary decision (include/exclude) we make for each element.
            The backtracking algorithm traverses this tree depth-first, exploring every path from root to leaf.
            Each leaf node represents one complete subset in our final result.
          </p>
        </div>
      </div>
    </Card>
  );
}
