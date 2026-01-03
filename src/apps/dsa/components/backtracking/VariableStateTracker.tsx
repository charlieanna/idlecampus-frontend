import { Card } from '../ui/card';

export default function VariableStateTracker() {
  return (
    <Card className="p-6 bg-card border-2 border-primary/30">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Concept B: How Variables Change Through the Tree
          </h3>
          <p className="text-muted-foreground">
            Understanding how <code className="px-2 py-1 bg-primary/10 rounded">start</code>, 
            <code className="px-2 py-1 bg-primary/10 rounded mx-1">current</code>, and 
            <code className="px-2 py-1 bg-primary/10 rounded">i</code> change at each node
          </p>
        </div>

        {/* Introduction */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="font-semibold mb-2">Three Key Variables:</h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong>start:</strong> Controls which elements we can still choose from
            </div>
            <div>
              <strong>current:</strong> The subset we're building (grows going down, shrinks coming back up)
            </div>
            <div>
              <strong>i:</strong> Loop variable that determines which element we're considering
            </div>
          </div>
        </div>

        {/* Node by Node Walkthrough */}
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-foreground">Node-by-Node Variable States</h4>
          <p className="text-sm text-muted-foreground">
            For nums = [1, 2, 3], let's trace the variables at each node in the tree:
          </p>

          {/* Node 1: Root */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <h5 className="font-semibold">Node 1: Root (backtrack(0))</h5>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="p-2 bg-background rounded">
                  <p className="text-xs text-muted-foreground">start:</p>
                  <p className="font-mono font-bold">0</p>
                </div>
                <div className="p-2 bg-background rounded">
                  <p className="text-xs text-muted-foreground">current:</p>
                  <p className="font-mono font-bold">[]</p>
                </div>
                <div className="p-2 bg-background rounded">
                  <p className="text-xs text-muted-foreground">Available choices:</p>
                  <p className="font-mono font-bold">[1, 2, 3]</p>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded text-sm">
                <p className="font-semibold mb-1">What happens:</p>
                <p>1. Save current[:] → Save []</p>
                <p>2. Loop: i = 0, 1, 2 (try adding each element)</p>
              </div>
            </div>
          </div>

          {/* Node 2: After choosing 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <h5 className="font-semibold">Node 2: After adding 1 (backtrack(1))</h5>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/30">
              <div className="space-y-3">
                <div className="p-2 bg-background rounded text-sm">
                  <p className="text-muted-foreground mb-1">From Node 1, when i=0:</p>
                  <p className="font-mono">current.append(nums[0]) → current.append(1)</p>
                  <p className="font-mono">backtrack(0 + 1) → backtrack(1)</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">start:</p>
                    <p className="font-mono font-bold">1</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">current:</p>
                    <p className="font-mono font-bold">[1]</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">Available choices:</p>
                    <p className="font-mono font-bold">[2, 3]</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded text-sm mt-3">
                <p className="font-semibold mb-1">What happens:</p>
                <p>1. Save current[:] → Save [1]</p>
                <p>2. Loop: i = 1, 2 (can only choose from [2, 3])</p>
              </div>
            </div>
          </div>

          {/* Node 5: After choosing 1, then 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                5
              </div>
              <h5 className="font-semibold">Node 5: After adding 1, then 2 (backtrack(2))</h5>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/30">
              <div className="space-y-3">
                <div className="p-2 bg-background rounded text-sm">
                  <p className="text-muted-foreground mb-1">From Node 2, when i=1:</p>
                  <p className="font-mono">current.append(nums[1]) → current.append(2)</p>
                  <p className="font-mono">backtrack(1 + 1) → backtrack(2)</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">start:</p>
                    <p className="font-mono font-bold">2</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">current:</p>
                    <p className="font-mono font-bold">[1, 2]</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">Available choices:</p>
                    <p className="font-mono font-bold">[3]</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded text-sm mt-3">
                <p className="font-semibold mb-1">What happens:</p>
                <p>1. Save current[:] → Save [1, 2]</p>
                <p>2. Loop: i = 2 (can only choose 3)</p>
              </div>
            </div>
          </div>

          {/* Node 8: After choosing 1, 2, 3 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                8
              </div>
              <h5 className="font-semibold">Node 8: After adding 1, 2, 3 (backtrack(3))</h5>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/30">
              <div className="space-y-3">
                <div className="p-2 bg-background rounded text-sm">
                  <p className="text-muted-foreground mb-1">From Node 5, when i=2:</p>
                  <p className="font-mono">current.append(nums[2]) → current.append(3)</p>
                  <p className="font-mono">backtrack(2 + 1) → backtrack(3)</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">start:</p>
                    <p className="font-mono font-bold">3</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">current:</p>
                    <p className="font-mono font-bold">[1, 2, 3]</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">Available choices:</p>
                    <p className="font-mono font-bold">[] (empty)</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-primary/10 rounded text-sm mt-3">
                <p className="font-semibold mb-1">What happens:</p>
                <p>1. Save current[:] → Save [1, 2, 3]</p>
                <p>2. Loop: range(3, 3) is empty, no iterations</p>
                <p>3. Return (backtrack up)</p>
              </div>
            </div>
          </div>

          {/* Backtracking Up */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0 font-bold">
                ↑
              </div>
              <h5 className="font-semibold">Backtracking Up: Returning to Node 5</h5>
            </div>
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/30">
              <div className="space-y-3">
                <div className="p-2 bg-background rounded text-sm">
                  <p className="text-muted-foreground mb-1">After backtrack(3) returns:</p>
                  <p className="font-mono">current.pop() → Remove 3</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">start:</p>
                    <p className="font-mono font-bold">2</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">current:</p>
                    <p className="font-mono font-bold">[1, 2]</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">Next:</p>
                    <p className="font-mono font-bold">Loop finished, return</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-accent/10 rounded text-sm mt-3">
                <p className="font-semibold mb-1">Key insight:</p>
                <p>current.pop() restores the array to its previous state before we return</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complete Execution Flow Table */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground">Complete Execution Flow</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead className="bg-muted">
                <tr>
                  <th className="border border-border p-2">Node</th>
                  <th className="border border-border p-2">start</th>
                  <th className="border border-border p-2">current</th>
                  <th className="border border-border p-2">Saved</th>
                  <th className="border border-border p-2">Loop (i values)</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                <tr>
                  <td className="border border-border p-2">1</td>
                  <td className="border border-border p-2">0</td>
                  <td className="border border-border p-2">[]</td>
                  <td className="border border-border p-2">[]</td>
                  <td className="border border-border p-2">0, 1, 2</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">2</td>
                  <td className="border border-border p-2">1</td>
                  <td className="border border-border p-2">[1]</td>
                  <td className="border border-border p-2">[1]</td>
                  <td className="border border-border p-2">1, 2</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">5</td>
                  <td className="border border-border p-2">2</td>
                  <td className="border border-border p-2">[1,2]</td>
                  <td className="border border-border p-2">[1,2]</td>
                  <td className="border border-border p-2">2</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">8</td>
                  <td className="border border-border p-2">3</td>
                  <td className="border border-border p-2">[1,2,3]</td>
                  <td className="border border-border p-2">[1,2,3]</td>
                  <td className="border border-border p-2">(empty)</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">7</td>
                  <td className="border border-border p-2">3</td>
                  <td className="border border-border p-2">[1,3]</td>
                  <td className="border border-border p-2">[1,3]</td>
                  <td className="border border-border p-2">(empty)</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">3</td>
                  <td className="border border-border p-2">2</td>
                  <td className="border border-border p-2">[2]</td>
                  <td className="border border-border p-2">[2]</td>
                  <td className="border border-border p-2">2</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">6</td>
                  <td className="border border-border p-2">3</td>
                  <td className="border border-border p-2">[2,3]</td>
                  <td className="border border-border p-2">[2,3]</td>
                  <td className="border border-border p-2">(empty)</td>
                </tr>
                <tr>
                  <td className="border border-border p-2">4</td>
                  <td className="border border-border p-2">3</td>
                  <td className="border border-border p-2">[3]</td>
                  <td className="border border-border p-2">[3]</td>
                  <td className="border border-border p-2">(empty)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Visual Path Example */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <h4 className="font-semibold mb-3">Visual Path: Building [1, 2, 3]</h4>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex items-center gap-3">
              <span className="w-32">backtrack(0)</span>
              <span className="text-muted-foreground">current = []</span>
              <span className="text-primary">→ Save []</span>
            </div>
            <div className="flex items-center gap-3 ml-6">
              <span className="w-32">append(1)</span>
              <span className="text-muted-foreground">current = [1]</span>
            </div>
            <div className="flex items-center gap-3 ml-6">
              <span className="w-32">backtrack(1)</span>
              <span className="text-muted-foreground">current = [1]</span>
              <span className="text-primary">→ Save [1]</span>
            </div>
            <div className="flex items-center gap-3 ml-12">
              <span className="w-32">append(2)</span>
              <span className="text-muted-foreground">current = [1,2]</span>
            </div>
            <div className="flex items-center gap-3 ml-12">
              <span className="w-32">backtrack(2)</span>
              <span className="text-muted-foreground">current = [1,2]</span>
              <span className="text-primary">→ Save [1,2]</span>
            </div>
            <div className="flex items-center gap-3 ml-16">
              <span className="w-32">append(3)</span>
              <span className="text-muted-foreground">current = [1,2,3]</span>
            </div>
            <div className="flex items-center gap-3 ml-16">
              <span className="w-32">backtrack(3)</span>
              <span className="text-muted-foreground">current = [1,2,3]</span>
              <span className="text-primary">→ Save [1,2,3]</span>
            </div>
            <div className="flex items-center gap-3 ml-16">
              <span className="w-32">return</span>
            </div>
            <div className="flex items-center gap-3 ml-12">
              <span className="w-32">pop()</span>
              <span className="text-muted-foreground">current = [1,2]</span>
              <span className="text-accent">← Back up</span>
            </div>
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
              <strong className="text-foreground">start parameter:</strong> Increases as we go deeper (0 → 1 → 2 → 3), 
              ensuring we only consider elements after the one we just chose.
            </p>
            <p>
              <strong className="text-foreground">current array:</strong> Grows with .append() going down the tree, 
              shrinks with .pop() coming back up. This is how we explore all possibilities.
            </p>
            <p>
              <strong className="text-foreground">i loop variable:</strong> Determines which child branch we take. 
              At each node, we try all valid i values (from start to end).
            </p>
            <p>
              <strong className="text-foreground">The pattern:</strong> Go down (append + recurse), save state, 
              come back up (pop), repeat for next branch.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
