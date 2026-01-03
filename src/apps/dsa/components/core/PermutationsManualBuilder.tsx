import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Check, X, RefreshCw } from 'lucide-react';

interface PermutationsManualBuilderProps {
  elements?: number[];
}

export function PermutationsManualBuilder({ elements = [1, 2, 3] }: PermutationsManualBuilderProps) {
  const [userPermutations, setUserPermutations] = useState<number[][]>([]);
  const [currentPermutation, setCurrentPermutation] = useState<number[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // Generate all permutations for validation
  const generateAllPermutations = (arr: number[]): number[][] => {
    const result: number[][] = [];
    
    const backtrack = (path: number[], remaining: number[]) => {
      if (remaining.length === 0) {
        result.push([...path]);
        return;
      }
      
      for (let i = 0; i < remaining.length; i++) {
        path.push(remaining[i]);
        backtrack(path, [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
        path.pop();
      }
    };
    
    backtrack([], arr);
    return result;
  };

  const allPermutations = generateAllPermutations(elements);

  const addToCurrentPermutation = (num: number) => {
    if (!currentPermutation.includes(num) && currentPermutation.length < elements.length) {
      setCurrentPermutation([...currentPermutation, num]);
    }
  };

  const removeLastFromCurrent = () => {
    setCurrentPermutation(currentPermutation.slice(0, -1));
  };

  const savePermutation = () => {
    if (currentPermutation.length === elements.length) {
      const permutationKey = currentPermutation.join(',');
      const alreadyExists = userPermutations.some(p => p.join(',') === permutationKey);
      
      if (!alreadyExists) {
        setUserPermutations([...userPermutations, [...currentPermutation]]);
      }
      setCurrentPermutation([]);
    }
  };

  const reset = () => {
    setUserPermutations([]);
    setCurrentPermutation([]);
    setShowFeedback(false);
  };

  const checkComplete = () => {
    setShowFeedback(true);
  };

  const isPermutationValid = (perm: number[]): boolean => {
    return allPermutations.some(p => p.join(',') === perm.join(','));
  };

  const missingPermutations = allPermutations.filter(
    p => !userPermutations.some(up => up.join(',') === p.join(','))
  );

  const progress = (userPermutations.length / allPermutations.length) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="mb-4">Manual Permutation Builder</h3>
        <p className="text-gray-600 mb-6">
          Build all possible permutations of <span className="font-mono bg-gray-100 px-2 py-1 rounded">[{elements.join(', ')}]</span> manually. 
          Click the numbers below to build each permutation, then click "Add to List" when complete.
        </p>

        {/* Current permutation builder */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm">Building:</span>
            <div className="flex gap-2 min-h-[44px] items-center flex-1 bg-gray-50 px-4 py-2 rounded border-2 border-dashed border-gray-300">
              {currentPermutation.length === 0 ? (
                <span className="text-gray-400 text-sm">Click numbers below to build a permutation</span>
              ) : (
                currentPermutation.map((num, idx) => (
                  <div key={idx} className="bg-blue-500 text-white px-3 py-1 rounded font-mono">
                    {num}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Number selector */}
          <div className="flex gap-3 mb-4">
            {elements.map(num => (
              <Button
                key={num}
                onClick={() => addToCurrentPermutation(num)}
                disabled={currentPermutation.includes(num) || currentPermutation.length >= elements.length}
                variant={currentPermutation.includes(num) ? 'secondary' : 'default'}
                className="w-16 h-16 text-xl"
              >
                {num}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={removeLastFromCurrent} variant="outline" disabled={currentPermutation.length === 0}>
              Remove Last
            </Button>
            <Button 
              onClick={savePermutation} 
              disabled={currentPermutation.length !== elements.length}
              className="bg-green-600 hover:bg-green-700"
            >
              Add to List
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress: {userPermutations.length} / {allPermutations.length} permutations</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* User's permutations */}
        {userPermutations.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm mb-3">Your Permutations:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {userPermutations.map((perm, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-2 px-3 py-2 rounded border ${
                    isPermutationValid(perm) 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-red-50 border-red-300'
                  }`}
                >
                  <span className="font-mono">[{perm.join(', ')}]</span>
                  {isPermutationValid(perm) ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={checkComplete} variant="default">
            Check My Answer
          </Button>
          <Button onClick={reset} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mt-4 p-4 rounded border ${
            missingPermutations.length === 0
              ? 'bg-green-50 border-green-300'
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            {missingPermutations.length === 0 ? (
              <div className="flex items-center gap-2 text-green-800">
                <Check className="w-5 h-5" />
                <p>Perfect! You found all {allPermutations.length} permutations!</p>
              </div>
            ) : (
              <div>
                <p className="text-yellow-800 mb-2">
                  You're missing {missingPermutations.length} permutation(s). Keep going!
                </p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-yellow-700 hover:text-yellow-900">
                    Show hint (missing permutations)
                  </summary>
                  <div className="mt-2 space-y-1">
                    {missingPermutations.slice(0, 3).map((perm, idx) => (
                      <div key={idx} className="font-mono text-yellow-900">
                        [{perm.join(', ')}]
                      </div>
                    ))}
                    {missingPermutations.length > 3 && (
                      <div className="text-yellow-700">
                        ... and {missingPermutations.length - 3} more
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Reflection Questions */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="mb-3">🤔 Think About It</h4>
        <ul className="space-y-2 text-sm">
          <li>• What pattern did you notice while building the permutations?</li>
          <li>• How did you make sure you didn't miss any permutations?</li>
          <li>• Did you develop a systematic approach? If so, what was it?</li>
          <li>• How would this scale if you had 4 or 5 elements instead of 3?</li>
        </ul>
      </Card>
    </div>
  );
}
