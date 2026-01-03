import { Card } from "../ui/card";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function BaseCaseExplainer() {
  return (
    <Card className="p-6 mb-4 border-2 border-accent">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-accent" />
        Concept D: Base Cases and Early Termination
      </h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">What is a Base Case?</h4>
          <p className="text-xs text-muted-foreground mb-2">
            The condition that determines when to stop recursion and potentially save a solution.
          </p>
          <div className="bg-background p-2 rounded font-mono text-xs">
            <div className="text-primary"># Pattern 1: Size-based (Combinations, Permutations)</div>
            <div>if len(current) == k:</div>
            <div className="ml-4">result.append(current[:])</div>
            <div className="ml-4">return  # Stop exploring deeper</div>
            <div className="mt-2 text-primary"># Pattern 2: Target-based (Combination Sum)</div>
            <div>if target == 0:</div>
            <div className="ml-4">result.append(current[:])</div>
            <div className="ml-4">return</div>
          </div>
        </div>

        <div className="p-4 bg-primary/10 rounded-lg border border-primary">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Why Base Cases are Critical
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <div>
                <strong>Prevents Infinite Recursion:</strong> Without a base case, 
                the function would call itself forever until stack overflow.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <div>
                <strong>Captures Solutions:</strong> The base case is where we save 
                valid solutions before backtracking up the tree.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <div>
                <strong>Controls Tree Depth:</strong> Determines how deep we explore 
                (e.g., stop at k elements for combinations).
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-accent/10 rounded-lg border border-accent">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-accent" />
            Early Termination (Pruning)
          </h4>
          <p className="text-xs text-muted-foreground mb-2">
            Stop exploring branches that can't lead to valid solutions:
          </p>
          <div className="bg-background p-2 rounded font-mono text-xs space-y-2">
            <div>
              <div className="text-accent"># Prune when target exceeded</div>
              <div>if current_sum &gt; target:</div>
              <div className="ml-4">return  # No point exploring further</div>
            </div>
            <div className="mt-2">
              <div className="text-accent"># Prune when not enough elements left</div>
              <div>if len(current) + (n - start) &lt; k:</div>
              <div className="ml-4">return  # Can't reach k elements</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-destructive/10 rounded-lg border border-destructive">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-destructive" />
            Common Base Case Mistakes
          </h4>
          <div className="space-y-2 text-xs">
            <div className="font-mono bg-background p-2 rounded">
              <div className="text-destructive"># ❌ Forgetting to return after base case</div>
              <div>if len(current) == k:</div>
              <div className="ml-4">result.append(current[:])</div>
              <div className="ml-4 text-destructive"># Missing return! Will keep exploring</div>
            </div>
            <div className="font-mono bg-background p-2 rounded">
              <div className="text-destructive"># ❌ Wrong condition</div>
              <div>if len(current) &gt; k:  # Should be ==</div>
              <div className="ml-4">result.append(current[:])</div>
            </div>
            <div className="font-mono bg-background p-2 rounded">
              <div className="text-destructive"># ❌ Forgetting to copy</div>
              <div>if len(current) == k:</div>
              <div className="ml-4">result.append(current)  # Should be current[:]</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Quick Reference</h4>
          <div className="text-xs space-y-1">
            <div><strong>Subsets:</strong> No explicit base case - collect at every node</div>
            <div><strong>Combinations:</strong> len(current) == k</div>
            <div><strong>Permutations:</strong> len(current) == len(nums)</div>
            <div><strong>Combination Sum:</strong> target == 0 (success) or target &lt; 0 (prune)</div>
            <div><strong>N-Queens:</strong> row == n (all queens placed)</div>
          </div>
        </div>
      </div>
    </Card>
  );
}