import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AlertCircle, CheckCircle, XCircle, Crown, Shield } from "lucide-react";

interface NQueensLessonContentProps {
  onNext?: () => void;
  onPrev?: () => void;
}

export default function NQueensLessonContent({ onNext, onPrev }: NQueensLessonContentProps = {}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">N-Queens Pattern Deep Dive</h1>
        <p className="text-sm text-muted-foreground">Master placing elements with complex constraints</p>
      </div>

      {/* Problem-First: Build from constraints */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Problem</h3>
        <div className="text-sm space-y-2">
          <p>Place n queens on an n×n board so no two queens attack each other.</p>
          <p className="text-xs text-muted-foreground">Build solutions row-by-row. At each row, try columns that don’t conflict with previous queens.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div className="p-3 bg-muted rounded">
              <p className="text-xs font-semibold mb-1">Build from row 0:</p>
              <pre className="bg-background p-2 rounded text-xs">
{`row = 0
• Try col in [0..n-1]
• Next row only tries safe columns
• Leaf when row == n (placed all queens)`}
              </pre>
            </div>
            <div className="p-3 bg-muted rounded">
              <p className="text-xs font-semibold mb-1">Leaf condition:</p>
              <code className="bg-background px-2 py-1 rounded text-xs block">row == n</code>
            </div>
          </div>
        </div>
      </Card>

      {/* Visual Examples */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">4-Queens Solutions Visualized</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold mb-2">Solution 1:</p>
            <pre className="bg-muted p-2 rounded text-xs font-mono">
{`.Q..  ← Row 0: Queen at col 1
...Q  ← Row 1: Queen at col 3
Q...  ← Row 2: Queen at col 0
..Q.  ← Row 3: Queen at col 2`}
            </pre>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2">Solution 2:</p>
            <pre className="bg-muted p-2 rounded text-xs font-mono">
{`..Q.  ← Row 0: Queen at col 2
Q...  ← Row 1: Queen at col 0
...Q  ← Row 2: Queen at col 3
.Q..  ← Row 3: Queen at col 1`}
            </pre>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Queens marked with 'Q', empty squares with '.'. No two queens share a row, column, or diagonal.
        </p>
      </Card>

      {/* Decision Tree Visualization */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Decision Tree for 4-Queens</h3>
        <pre className="text-xs text-muted-foreground font-mono">
{`Row 0: Try each column
    Col 0         Col 1✓        Col 2✓        Col 3
      |             |             |             |
   Row 1:        Col 3✓        Col 0✓      (pruned)
      |             |             |
   Row 2:        (pruned)      Col 3✓
                                  |
   Row 3:                      Col 1✓
                               Solution!`}
        </pre>
        <div className="mt-3 p-3 bg-primary/10 rounded">
          <p className="text-xs text-muted-foreground">
            <strong>Key Insight:</strong> We place queens row by row. For each row, we try each column 
            and check if it's safe. Many branches get pruned early when conflicts are detected.
          </p>
        </div>
      </Card>

      {/* Template Mapping */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Template Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">State</span>
            <div className="text-xs text-muted-foreground">board configuration, current row</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Choices</span>
            <div className="text-xs text-muted-foreground">columns 0..n-1 that pass isValid(row, col)</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Complete?</span>
            <div className="text-xs text-muted-foreground">row == n (all queens placed)</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <span className="font-medium">Backtrack</span>
            <div className="text-xs text-muted-foreground">remove 'Q' and restore any sets</div>
          </div>
        </div>
      </Card>

      {/* The Code - After tree/intuition */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Complete Solution (Using the Template)</h3>
        <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
          <code>{`def solveNQueens(n):
    result = []
    board = ['.' * n for _ in range(n)]
    
    def isValid(row, col):
        for i in range(row):
            if board[i][col] == 'Q':
                return False
        for i, j in zip(range(row-1, -1, -1), range(col-1, -1, -1)):
            if board[i][j] == 'Q':
                return False
        for i, j in zip(range(row-1, -1, -1), range(col+1, n)):
            if board[i][j] == 'Q':
                return False
        return True
    
    def backtrack(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            if isValid(row, col):
                board[row] = board[row][:col] + 'Q' + board[row][col+1:]
                backtrack(row + 1)
                board[row] = board[row][:col] + '.' + board[row][col+1:]
    
    backtrack(0)
    return result`}</code>
        </pre>
      </Card>

      {/* Step-by-Step Algorithm Explanation */}
      <Card className="p-4 border-2 border-primary">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Crown className="w-4 h-4 text-primary" />
          How the Algorithm Works - Step by Step
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Step 1: Row-by-Row Placement</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Process one row at a time. Since each row needs exactly one queen, 
              this simplifies our problem significantly.
            </p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`def backtrack(row):
    if row == n:  # All rows processed
        save_solution()`}</code>
            </pre>
          </div>

          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Step 2: Try Each Column</h4>
            <p className="text-xs text-muted-foreground mb-2">
              For the current row, try placing a queen in each column.
            </p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`for col in range(n):
    if isValid(row, col):
        place_queen(row, col)`}</code>
            </pre>
          </div>

          <div className="p-3 bg-primary/10 rounded">
            <h4 className="text-sm font-semibold mb-2">Step 3: Validate Placement</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Check three directions: up (column), up-left diagonal, up-right diagonal. 
              No need to check down or sideways - those rows are empty!
            </p>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`# Only check upward directions
check_column_above()
check_diagonal_up_left()
check_diagonal_up_right()`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Critical Concepts - Constraint Checking */}
      <Card className="p-4 border-2 border-accent">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          Understanding Constraint Checking
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why only check upward?</h4>
            <p className="text-xs text-muted-foreground">
              We place queens row by row from top to bottom. When placing a queen 
              at row i, rows i+1 to n-1 are still empty. So we only need to check 
              rows 0 to i-1 (upward directions).
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-background rounded">
                <p className="font-semibold">✓ Check:</p>
                <p>• Above (↑)</p>
                <p>• Up-left (↖)</p>
                <p>• Up-right (↗)</p>
              </div>
              <div className="p-2 bg-muted rounded">
                <p className="font-semibold">✗ Skip:</p>
                <p>• Below (↓)</p>
                <p>• Left/Right (←→)</p>
                <p>• Down diagonals</p>
              </div>
              <div className="p-2 bg-primary/10 rounded">
                <p className="font-semibold">Why?</p>
                <p>Those positions are empty or not yet placed!</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Diagonal Mathematics</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Understanding how diagonals work on a grid:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-background rounded">
                <p className="text-xs font-semibold">↖ Upper-left diagonal:</p>
                <p className="text-xs font-mono">row - col = constant</p>
                <p className="text-xs text-muted-foreground mt-1">
                  (2,3), (1,2), (0,1) all have row-col = -1
                </p>
              </div>
              <div className="p-2 bg-background rounded">
                <p className="text-xs font-semibold">↗ Upper-right diagonal:</p>
                <p className="text-xs font-mono">row + col = constant</p>
                <p className="text-xs text-muted-foreground mt-1">
                  (2,1), (1,2), (0,3) all have row+col = 3
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-accent/10 rounded">
            <h4 className="text-sm font-semibold mb-1">Why strings for board representation?</h4>
            <p className="text-xs text-muted-foreground">
              Python strings are immutable, so we rebuild the string when placing/removing queens. 
              While less efficient than using a 2D list, it makes the solution cleaner and matches 
              the expected output format directly.
            </p>
          </div>
        </div>
      </Card>

      {/* Optimization with Sets */}
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Optimization: Use Sets for O(1) Constraint Checking</h3>
        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
          <code>{`def solveNQueens_optimized(n):
    """Optimized version using sets for O(1) lookups"""
    result = []
    board = ['.' * n for _ in range(n)]
    
    # Track attacks using sets - O(1) lookup!
    cols = set()         # Columns with queens
    diag1 = set()        # row - col diagonals
    diag2 = set()        # row + col diagonals
    
    def backtrack(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        
        for col in range(n):
            # O(1) constraint checking!
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue
            
            # Place queen and update sets
            board[row] = board[row][:col] + 'Q' + board[row][col+1:]
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            
            backtrack(row + 1)
            
            # Remove queen and update sets
            board[row] = board[row][:col] + '.' + board[row][col+1:]
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)
    
    backtrack(0)
    return result`}</code>
        </pre>
        <div className="mt-3 p-3 bg-primary/10 rounded">
          <p className="text-xs text-muted-foreground">
            <strong>Performance Impact:</strong> Changes constraint checking from O(n) to O(1), 
            significantly faster for large boards!
          </p>
        </div>
      </Card>

      {/* Common Variations */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Common Variations</h3>
        <div className="space-y-3">
          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">Count Solutions (Don't Store Boards):</p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
              <code>{`def totalNQueens(n):
    """Just count valid configurations"""
    count = 0
    cols = set()
    diag1 = set()
    diag2 = set()
    
    def backtrack(row):
        nonlocal count
        if row == n:
            count += 1  # Just increment counter
            return
        
        for col in range(n):
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue
            
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            
            backtrack(row + 1)
            
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)
    
    backtrack(0)
    return count`}</code>
            </pre>
          </div>

          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">N-Rooks (Simpler Constraint):</p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
              <code>{`def solveNRooks(n):
    """Rooks only attack row/column, not diagonals"""
    result = []
    cols_used = set()
    current = []
    
    def backtrack(row):
        if row == n:
            result.append(current[:])
            return
        
        for col in range(n):
            if col not in cols_used:  # Only check column!
                current.append(col)
                cols_used.add(col)
                
                backtrack(row + 1)
                
                current.pop()
                cols_used.remove(col)
    
    backtrack(0)
    return result`}</code>
            </pre>
          </div>

          <div className="p-3 bg-muted rounded">
            <p className="text-xs font-semibold mb-2">Find One Solution (Early Exit):</p>
            <pre className="bg-background p-2 rounded text-xs overflow-x-auto">
              <code>{`def findOneNQueensSolution(n):
    """Return first valid solution found"""
    board = ['.' * n for _ in range(n)]
    cols = set()
    diag1 = set()
    diag2 = set()
    
    def backtrack(row):
        if row == n:
            return True  # Found solution!
        
        for col in range(n):
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue
            
            board[row] = board[row][:col] + 'Q' + board[row][col+1:]
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            
            if backtrack(row + 1):  # Early exit!
                return True
            
            board[row] = board[row][:col] + '.' + board[row][col+1:]
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)
        
        return False
    
    if backtrack(0):
        return board
    return None`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Common Pitfalls */}
      <Card className="p-4 border-2 border-destructive">
        <h3 className="font-semibold mb-3 text-destructive">Common Pitfalls to Avoid</h3>
        <div className="space-y-3">
          <div className="p-3 bg-destructive/10 rounded">
            <div className="flex items-start gap-2 mb-2">
              <XCircle className="w-4 h-4 text-destructive mt-0.5" />
              <p className="text-xs font-semibold">Checking all directions unnecessarily</p>
            </div>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`# ❌ Wrong - checking directions that are always empty
for i in range(n):  # Checks entire column
    if board[i][col] == 'Q':
        return False

# ✓ Correct - only check rows above
for i in range(row):  # Only rows 0 to row-1
    if board[i][col] == 'Q':
        return False`}</code>
            </pre>
          </div>

          <div className="p-3 bg-destructive/10 rounded">
            <div className="flex items-start gap-2 mb-2">
              <XCircle className="w-4 h-4 text-destructive mt-0.5" />
              <p className="text-xs font-semibold">Forgetting to restore state when backtracking</p>
            </div>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`# ❌ Wrong - forgot to remove from sets
cols.add(col)
diag1.add(row - col)
backtrack(row + 1)
# Missing: cols.remove(col), etc.

# ✓ Correct - properly restore state
cols.add(col)
diag1.add(row - col)
backtrack(row + 1)
cols.remove(col)
diag1.remove(row - col)`}</code>
            </pre>
          </div>

          <div className="p-3 bg-destructive/10 rounded">
            <div className="flex items-start gap-2 mb-2">
              <XCircle className="w-4 h-4 text-destructive mt-0.5" />
              <p className="text-xs font-semibold">Wrong diagonal formulas</p>
            </div>
            <pre className="text-xs bg-background p-2 rounded">
              <code>{`# ❌ Wrong - incorrect diagonal formulas
if (row+col) in diag1 or (row-col) in diag2:  # Swapped!

# ✓ Correct diagonal formulas
# row - col: constant for ↖ diagonal
# row + col: constant for ↗ diagonal
if (row-col) in diag1 or (row+col) in diag2:`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Practice Problem */}
      <Card className="p-4 bg-primary/5">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          Quick Practice
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          For a 3×3 board, why is there no solution to the 3-Queens problem?
        </p>
        <details className="cursor-pointer">
          <summary className="text-xs font-semibold text-primary hover:underline">
            Click to see answer
          </summary>
          <div className="mt-2 p-2 bg-muted rounded text-xs">
            <p className="font-semibold mb-2">No solution exists for n=3:</p>
            <pre className="font-mono bg-background p-2 rounded mb-2">
{`Try placing first queen:
Q.. → Forces row 2: ..Q
.?. → But col 1 is attacked by diagonal
..Q → No valid position for row 1!`}
            </pre>
            <p className="text-muted-foreground">
              On a 3×3 board, after placing 2 queens, all remaining squares are under attack. 
              The N-Queens problem has no solution for n=2 and n=3. Solutions exist for all n≥4 and n=1.
            </p>
          </div>
        </details>
      </Card>

      {/* Key Takeaways */}
      <Card className="p-4 bg-primary/5">
        <h3 className="font-semibold mb-2">Key Takeaways</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <Crown className="w-3 h-3 text-primary mt-0.5" />
            <p><strong>Row-by-row placement:</strong> Simplifies the problem by ensuring one queen per row</p>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-3 h-3 text-primary mt-0.5" />
            <p><strong>Smart constraint checking:</strong> Only check upward directions (rows already processed)</p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-3 h-3 text-primary mt-0.5" />
            <p><strong>Optimization with sets:</strong> Use sets for O(1) constraint checking instead of O(n) loops</p>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-3 h-3 text-primary mt-0.5" />
            <p><strong>Diagonal formula:</strong> row-col for ↖, row+col for ↗</p>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      {(onNext || onPrev) && (
        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          {onPrev && (
            <Button onClick={onPrev} variant="outline">
              Previous: Combinations
            </Button>
          )}
          {onNext && (
            <Button onClick={onNext} className="ml-auto">
              Next Lesson
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
