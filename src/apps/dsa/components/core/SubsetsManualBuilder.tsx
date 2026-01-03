import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Plus, Undo, CheckCircle2, XCircle } from "lucide-react";

export default function SubsetsManualBuilder() {
  const nums = [1, 2, 3];
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [result, setResult] = useState<number[][]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [message, setMessage] = useState("");

  const correctSubsets = [
    [],
    [1],
    [1, 2],
    [1, 2, 3],
    [1, 3],
    [2],
    [2, 3],
    [3]
  ];

  const isSubsetInResult = (subset: number[]) => {
    return result.some(r => 
      r.length === subset.length && r.every((val, idx) => val === subset[idx])
    );
  };

  const handleSaveCurrent = () => {
    if (isSubsetInResult(currentPath)) {
      setMessage("❌ This subset is already in the result!");
      return;
    }
    
    setResult([...result, [...currentPath]]);
    setMessage("✅ Subset saved!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleInclude = (num: number) => {
    setCurrentPath([...currentPath, num]);
    const newIndex = nums.indexOf(num) + 1;
    setStartIndex(newIndex);
    setMessage(`Included ${num}. Now can only choose from [${nums.slice(newIndex).join(', ')}]`);
  };

  const handleBacktrack = () => {
    if (currentPath.length === 0) {
      setMessage("⚠️ Cannot backtrack - path is empty!");
      return;
    }
    
    const removed = currentPath[currentPath.length - 1];
    const newPath = currentPath.slice(0, -1);
    setCurrentPath(newPath);
    
    if (newPath.length === 0) {
      setStartIndex(0);
    } else {
      const lastIncluded = newPath[newPath.length - 1];
      setStartIndex(nums.indexOf(lastIncluded) + 1);
    }
    
    setMessage(`Backtracked - removed ${removed}`);
  };

  const handleReset = () => {
    setCurrentPath([]);
    setResult([]);
    setStartIndex(0);
    setMessage("Reset! Start building subsets from []");
  };

  const checkCompletion = () => {
    if (result.length !== correctSubsets.length) {
      return { complete: false, missing: correctSubsets.length - result.length };
    }
    
    const allCorrect = correctSubsets.every(subset =>
      result.some(r => 
        r.length === subset.length && r.every((val, idx) => val === subset[idx])
      )
    );
    
    return { complete: allCorrect, missing: 0 };
  };

  const completion = checkCompletion();
  const availableChoices = nums.slice(startIndex);

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Interactive Subset Builder</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Manually build all subsets of [1, 2, 3] using the backtracking approach
      </p>

      {/* Current State */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs font-semibold mb-1">Current Path:</p>
          <div className="flex items-center gap-1">
            {currentPath.length === 0 ? (
              <Badge variant="outline">[]</Badge>
            ) : (
              currentPath.map((num, idx) => (
                <Badge key={idx} variant="default">{num}</Badge>
              ))
            )}
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs font-semibold mb-1">Available Choices:</p>
          <div className="flex items-center gap-1">
            {availableChoices.length === 0 ? (
              <span className="text-xs text-muted-foreground">None (end of array)</span>
            ) : (
              availableChoices.map((num, idx) => (
                <Badge key={idx} variant="secondary">{num}</Badge>
              ))
            )}
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs font-semibold mb-1">Subsets Found:</p>
          <div className="text-lg font-bold">
            {result.length} / {correctSubsets.length}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          size="sm"
          variant="default"
          onClick={handleSaveCurrent}
          className="flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Save Current
        </Button>

        {availableChoices.map(num => (
          <Button
            key={num}
            size="sm"
            variant="secondary"
            onClick={() => handleInclude(num)}
            className="flex items-center gap-1"
          >
            Include {num}
          </Button>
        ))}

        <Button
          size="sm"
          variant="outline"
          onClick={handleBacktrack}
          disabled={currentPath.length === 0}
          className="flex items-center gap-1"
        >
          <Undo className="w-3 h-3" />
          Backtrack
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
          className="ml-auto"
        >
          Reset
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
          {message}
        </div>
      )}

      {/* Result Display */}
      <div className="p-3 bg-muted rounded-lg mb-4">
        <p className="text-xs font-semibold mb-2">Collected Subsets:</p>
        <div className="flex flex-wrap gap-2">
          {result.length === 0 ? (
            <span className="text-xs text-muted-foreground">No subsets saved yet</span>
          ) : (
            result.map((subset, idx) => (
              <Badge key={idx} variant="outline" className="font-mono">
                [{subset.join(', ') || ''}]
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Completion Status */}
      {completion.complete ? (
        <div className="p-3 bg-green-50 border-2 border-green-500 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-900">Perfect! 🎉</p>
            <p className="text-xs text-green-700">You've found all {correctSubsets.length} subsets!</p>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="text-xs text-yellow-800">
              Keep going! You need {completion.missing} more subset{completion.missing !== 1 ? 's' : ''}.
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Hint: Remember to save [] first, then systematically explore all paths.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
