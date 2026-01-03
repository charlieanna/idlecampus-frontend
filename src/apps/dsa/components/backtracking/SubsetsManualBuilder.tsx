import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Check, X, RotateCcw, Lightbulb } from 'lucide-react';

export default function SubsetsManualBuilder() {
  const nums = [1, 2, 3];
  const [userSubsets, setUserSubsets] = useState<number[][]>([]);
  const [currentSubset, setCurrentSubset] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // All correct subsets for [1, 2, 3]
  const correctSubsets = [
    [],
    [1],
    [2],
    [3],
    [1, 2],
    [1, 3],
    [2, 3],
    [1, 2, 3]
  ];

  const toggleNumber = (num: number) => {
    if (currentSubset.includes(num)) {
      setCurrentSubset(currentSubset.filter(n => n !== num));
    } else {
      setCurrentSubset([...currentSubset, num].sort());
    }
  };

  const addSubset = () => {
    // Check if this subset already exists
    const exists = userSubsets.some(subset => 
      subset.length === currentSubset.length && 
      subset.every((num, idx) => num === currentSubset[idx])
    );

    if (!exists) {
      const newSubsets = [...userSubsets, [...currentSubset]];
      setUserSubsets(newSubsets);
      setCurrentSubset([]);
      
      // Check if complete
      if (newSubsets.length === correctSubsets.length) {
        const allCorrect = correctSubsets.every(correct =>
          newSubsets.some(user => 
            user.length === correct.length && 
            user.every((num, idx) => num === correct[idx])
          )
        );
        if (allCorrect) {
          setIsComplete(true);
        }
      }
    }
  };

  const removeSubset = (index: number) => {
    setUserSubsets(userSubsets.filter((_, i) => i !== index));
    setIsComplete(false);
  };

  const reset = () => {
    setUserSubsets([]);
    setCurrentSubset([]);
    setIsComplete(false);
    setShowHint(false);
  };

  const getMissingSubsets = () => {
    return correctSubsets.filter(correct =>
      !userSubsets.some(user => 
        user.length === correct.length && 
        user.every((num, idx) => num === correct[idx])
      )
    );
  };

  const missingSubsets = getMissingSubsets();

  return (
    <Card className="p-6 bg-card border-2 border-primary/30">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Manual Building: Build All Subsets
          </h3>
          <p className="text-muted-foreground">
            Try to build all possible subsets of <code className="px-2 py-1 bg-primary/10 rounded">[{nums.join(', ')}]</code> by hand
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <Badge variant={isComplete ? 'default' : 'outline'} className="text-lg px-4 py-2">
            {userSubsets.length} / {correctSubsets.length} subsets found
          </Badge>
          {isComplete && (
            <div className="flex items-center gap-2 text-primary">
              <Check className="w-6 h-6" />
              <span className="font-semibold">Complete! 🎉</span>
            </div>
          )}
        </div>

        {/* Current Subset Builder */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold mb-3">Build a Subset:</h4>
          <div className="flex gap-3 items-center flex-wrap">
            {nums.map(num => (
              <Button
                key={num}
                onClick={() => toggleNumber(num)}
                variant={currentSubset.includes(num) ? 'default' : 'outline'}
                className="w-16 h-16 text-xl font-bold"
              >
                {num}
              </Button>
            ))}
          </div>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Current subset:</p>
              <div className="flex gap-2 items-center min-h-[48px] p-3 bg-background rounded border border-border">
                {currentSubset.length === 0 ? (
                  <span className="text-muted-foreground">[] (empty set)</span>
                ) : (
                  currentSubset.map((num, idx) => (
                    <div key={idx} className="w-10 h-10 bg-primary text-primary-foreground rounded flex items-center justify-center font-mono font-bold">
                      {num}
                    </div>
                  ))
                )}
              </div>
            </div>
            <Button 
              onClick={addSubset}
              disabled={userSubsets.some(subset => 
                subset.length === currentSubset.length && 
                subset.every((num, idx) => num === currentSubset[idx])
              )}
              className="mt-6"
            >
              Add to Collection
            </Button>
          </div>
        </div>

        {/* User's Subsets */}
        <div>
          <h4 className="font-semibold mb-3">Your Subsets Collection:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {userSubsets.map((subset, idx) => (
              <div 
                key={idx}
                className="p-3 bg-accent/10 rounded-lg border border-accent/30 relative group"
              >
                <button
                  onClick={() => removeSubset(idx)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove subset"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex gap-1 justify-center items-center min-h-[40px]">
                  {subset.length === 0 ? (
                    <span className="text-sm text-muted-foreground">[]</span>
                  ) : (
                    subset.map((num, numIdx) => (
                      <div key={numIdx} className="w-8 h-8 bg-accent text-accent-foreground rounded flex items-center justify-center font-mono text-sm font-bold">
                        {num}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: Math.max(0, correctSubsets.length - userSubsets.length) }).map((_, idx) => (
              <div 
                key={`empty-${idx}`}
                className="p-3 bg-muted/30 rounded-lg border border-dashed border-border min-h-[64px] flex items-center justify-center"
              >
                <span className="text-xs text-muted-foreground">?</span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 flex-wrap">
          <Button onClick={reset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={() => setShowHint(!showHint)} 
            variant="outline"
            disabled={isComplete}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </Button>
        </div>

        {/* Hint */}
        {showHint && !isComplete && (
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Hint
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              You're missing {missingSubsets.length} subset{missingSubsets.length !== 1 ? 's' : ''}:
            </p>
            <div className="flex gap-2 flex-wrap">
              {missingSubsets.slice(0, 3).map((subset, idx) => (
                <Badge key={idx} variant="outline">
                  [{subset.join(', ') || 'empty'}]
                </Badge>
              ))}
              {missingSubsets.length > 3 && (
                <Badge variant="outline">
                  +{missingSubsets.length - 3} more
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              💡 Tip: For each element, you can either include it or exclude it. That's 2 choices per element.
              With 3 elements, that's 2 × 2 × 2 = 8 total subsets!
            </p>
          </div>
        )}

        {/* Completion Message */}
        {isComplete && (
          <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
            <div className="flex items-start gap-3">
              <Check className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-primary mb-2">Perfect! You found all {correctSubsets.length} subsets! 🎉</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  You've discovered the fundamental pattern: for an array of n elements, there are 2^n total subsets.
                  Each element has 2 choices: include it or exclude it.
                </p>
                <p className="text-sm text-muted-foreground">
                  Now let's learn how to generate these programmatically using backtracking!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Insight */}
        <div className="p-4 bg-muted/50 rounded-lg border border-border">
          <h4 className="font-semibold mb-2">Understanding Subsets</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• A subset can contain any combination of elements (including none)</p>
            <p>• The empty set [] is always a valid subset</p>
            <p>• The full array [{nums.join(', ')}] is also a valid subset</p>
            <p>• For n elements, there are 2^n total subsets (2^3 = 8 subsets)</p>
            <p>• Order doesn't matter: [1,2] is the same as [2,1]</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
