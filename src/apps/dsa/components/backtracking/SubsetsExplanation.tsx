import { Card } from '../ui/card';

export default function SubsetsExplanation() {
  const nums = [1, 2, 3];

  return (
    <Card className="p-6 bg-card border-2 border-primary/30">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Understanding Subsets
          </h3>
          <p className="text-muted-foreground">
            For array <code className="px-2 py-1 bg-primary/10 rounded">[{nums.join(', ')}]</code>, let's understand how all possible subsets are generated
          </p>
        </div>

        {/* What is a Subset */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground">What is a Subset?</h4>
          <p className="text-muted-foreground">
            A subset is any combination of elements from an array, including the empty set and the full array itself.
            Order doesn't matter - [1,2] is the same subset as [2,1].
          </p>
        </div>

        {/* Step 1: Empty Set */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              1
            </div>
            <h4 className="text-lg font-semibold text-foreground">Start with the empty set</h4>
          </div>
          <p className="text-muted-foreground">
            Every array has at least one subset - the empty set. This is our starting point.
          </p>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex gap-3 flex-wrap">
              <div className="p-3 bg-background rounded-lg border border-border min-w-[80px] text-center">
                <span className="text-sm text-muted-foreground">[]</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Total subsets: 1</p>
          </div>
        </div>

        {/* Step 2: Consider element 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              2
            </div>
            <h4 className="text-lg font-semibold text-foreground">Consider element 1</h4>
          </div>
          <p className="text-muted-foreground">
            For element 1, we have 2 choices: <strong>include it</strong> or <strong>exclude it</strong>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <p className="text-sm font-semibold mb-2 text-destructive">Exclude 1</p>
              <div className="p-3 bg-background rounded-lg border border-border text-center">
                <span className="text-sm">[]</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Keep the empty set as is</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm font-semibold mb-2 text-primary">Include 1</p>
              <div className="p-3 bg-background rounded-lg border border-border text-center">
                <div className="inline-flex gap-1">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center font-mono text-sm font-bold">1</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Add 1 to the empty set → [1]</p>
            </div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm font-semibold mb-2">All subsets so far:</p>
            <div className="flex gap-3 flex-wrap">
              <div className="p-3 bg-background rounded-lg border border-border">[]</div>
              <div className="p-3 bg-background rounded-lg border border-border">[1]</div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Total subsets: 2</p>
          </div>
        </div>

        {/* Step 3: Consider element 2 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              3
            </div>
            <h4 className="text-lg font-semibold text-foreground">Consider element 2</h4>
          </div>
          <p className="text-muted-foreground">
            For element 2, we again have 2 choices for each existing subset. We can add 2 to [] → [2] and to [1] → [1,2].
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold mb-2">Existing: []</p>
              <div className="space-y-2">
                <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20 text-sm">
                  <span className="text-destructive font-semibold">Exclude 2:</span> [] stays []
                </div>
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-sm">
                  <span className="text-primary font-semibold">Include 2:</span> [] becomes [2]
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">Existing: [1]</p>
              <div className="space-y-2">
                <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/20 text-sm">
                  <span className="text-destructive font-semibold">Exclude 2:</span> [1] stays [1]
                </div>
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-sm">
                  <span className="text-primary font-semibold">Include 2:</span> [1] becomes [1,2]
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm font-semibold mb-2">All subsets so far:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-background rounded-lg border border-border text-center">[]</div>
              <div className="p-3 bg-background rounded-lg border border-border text-center">[1]</div>
              <div className="p-3 bg-background rounded-lg border border-border text-center">[2]</div>
              <div className="p-3 bg-background rounded-lg border border-border text-center">[1,2]</div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Total subsets: 4</p>
          </div>
        </div>

        {/* Step 4: Consider element 3 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
              4
            </div>
            <h4 className="text-lg font-semibold text-foreground">Consider element 3</h4>
          </div>
          <p className="text-muted-foreground">
            For element 3, we have 2 choices for each of the 4 existing subsets. Adding 3 to each gives us 4 more subsets.
          </p>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm font-semibold mb-3">For each existing subset, we can exclude or include 3:</p>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-2 bg-destructive/5 rounded border border-destructive/20">[] → [] (exclude 3)</div>
                <div className="p-2 bg-primary/5 rounded border border-primary/20">[] → [3] (include 3)</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-2 bg-destructive/5 rounded border border-destructive/20">[1] → [1] (exclude 3)</div>
                <div className="p-2 bg-primary/5 rounded border border-primary/20">[1] → [1,3] (include 3)</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-2 bg-destructive/5 rounded border border-destructive/20">[2] → [2] (exclude 3)</div>
                <div className="p-2 bg-primary/5 rounded border border-primary/20">[2] → [2,3] (include 3)</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="p-2 bg-destructive/5 rounded border border-destructive/20">[1,2] → [1,2] (exclude 3)</div>
                <div className="p-2 bg-primary/5 rounded border border-primary/20">[1,2] → [1,2,3] (include 3)</div>
              </div>
            </div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <p className="text-sm font-semibold mb-2">All subsets (complete):</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-background rounded-lg border border-border text-center">[]</div>
              <div className="p-3 bg-background rounded-lg border border-border text-center">[1]</div>
              <div className="p-3 bg-background rounded-lg border border-border text-center">[2]</div>
              <div className="p-3 bg-background rounded-lg border border-border text-center">[3]</div>
              <div className="p-3 bg-background rounded-lg border border-border text-center">[1,2]</div>
              <div className="p-3 bg-background rounded-lg border border-border text-center">[1,3]</div>
              <div className="p-3 bg-background rounded-lg border border-border text-center">[2,3]</div>
              <div className="p-3 bg-background rounded-lg border border-border text-center">[1,2,3]</div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Total subsets: 8 = 2³</p>
          </div>
        </div>

        {/* The Pattern */}
        <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
          <h4 className="font-semibold mb-3">The 2^n Pattern</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Binary Choices:</strong> For each element, we have exactly 2 choices - include it or exclude it.
            </p>
            <p>
              <strong className="text-foreground">Exponential Growth:</strong> With n elements, we make n binary decisions, giving us 2 × 2 × 2 × ... (n times) = 2^n total subsets.
            </p>
            <p>
              <strong className="text-foreground">For [{nums.join(', ')}]:</strong> We have 3 elements, so 2³ = 8 total subsets.
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
            The subset problem is fundamentally about making binary decisions (include/exclude) for each element.
            This creates a decision tree with 2^n leaf nodes, where each leaf represents one unique subset.
            Understanding this pattern is the foundation for implementing the backtracking solution.
          </p>
        </div>
      </div>
    </Card>
  );
}
