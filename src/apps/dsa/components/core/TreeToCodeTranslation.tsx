import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, Code, Play } from 'lucide-react';

export function TreeToCodeTranslation() {
  const [activeStep, setActiveStep] = useState(0);
  const [showExecutionTrace, setShowExecutionTrace] = useState(false);

  const steps = [
    {
      title: 'Step 1: Identify the Tree Structure',
      treeDescription: (
        <div className="space-y-3">
          <p className="text-sm">For permutations, our decision tree has:</p>
          <ul className="ml-4 space-y-2 text-sm">
            <li>• <strong>Node:</strong> Current permutation being built (e.g., [1, 2])</li>
            <li>• <strong>Edges:</strong> Choices of next number to add</li>
            <li>• <strong>Depth:</strong> How many numbers we've chosen</li>
            <li>• <strong>Leaves:</strong> Complete permutations (depth = n)</li>
          </ul>
        </div>
      ),
      codeMapping: null,
      code: `# First, recognize the tree structure
# - Each node = a partial permutation
# - Each branch = choosing an unused number
# - Each leaf = a complete permutation`,
    },
    {
      title: 'Step 2: Setup - Initialize Result and Helper',
      treeDescription: (
        <div className="space-y-3">
          <p className="text-sm">We need:</p>
          <ul className="ml-4 space-y-2 text-sm">
            <li>• A place to store all complete permutations (leaves)</li>
            <li>• A helper function that traverses the tree</li>
          </ul>
        </div>
      ),
      codeMapping: (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-purple-900 mb-1">Tree Concept:</div>
            <div>Store all leaves we visit</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-green-900 mb-1">Code:</div>
            <code className="text-xs">result = []</code>
          </div>
        </div>
      ),
      code: `def permutations(nums):
    result = []  # Store all permutations (leaves)
    
    def backtrack(path, remaining):
        # We'll fill this in...
        pass
    
    return result`,
    },
    {
      title: 'Step 3: Base Case - Detect Leaves',
      treeDescription: (
        <div className="space-y-3">
          <p className="text-sm">How do we know when we've reached a leaf (complete permutation)?</p>
          <ul className="ml-4 space-y-2 text-sm">
            <li>• When no numbers remain to choose</li>
            <li>• OR when path length equals n</li>
            <li>• At this point, save the permutation!</li>
          </ul>
        </div>
      ),
      codeMapping: (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-purple-900 mb-1">Tree Concept:</div>
            <div>Reached a leaf → save solution</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-green-900 mb-1">Code:</div>
            <code className="text-xs">if not remaining: save path</code>
          </div>
        </div>
      ),
      code: `def permutations(nums):
    result = []
    
    def backtrack(path, remaining):
        # BASE CASE: Reached a leaf (no more choices)
        if not remaining:
            result.append(path[:])  # Save a copy
            return
    
    return result`,
    },
    {
      title: 'Step 4: Explore Branches - Loop Through Choices',
      treeDescription: (
        <div className="space-y-3">
          <p className="text-sm">At each node, we need to explore all branches:</p>
          <ul className="ml-4 space-y-2 text-sm">
            <li>• Each unused number is a possible branch</li>
            <li>• Loop through all remaining numbers</li>
            <li>• Try each one in turn</li>
          </ul>
        </div>
      ),
      codeMapping: (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-purple-900 mb-1">Tree Concept:</div>
            <div>Explore all branches from this node</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-green-900 mb-1">Code:</div>
            <code className="text-xs">for i in range(len(remaining))</code>
          </div>
        </div>
      ),
      code: `def permutations(nums):
    result = []
    
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        
        # EXPLORE: Loop through all possible branches
        for i in range(len(remaining)):
            # We'll choose each number in turn
            pass
    
    return result`,
    },
    {
      title: 'Step 5: Go Down Branch - Make Choice',
      treeDescription: (
        <div className="space-y-3">
          <p className="text-sm">To go down a branch:</p>
          <ul className="ml-4 space-y-2 text-sm">
            <li>• Add the chosen number to our current path</li>
            <li>• This moves us to a child node in the tree</li>
          </ul>
        </div>
      ),
      codeMapping: (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-purple-900 mb-1">Tree Concept:</div>
            <div>Travel from node to child</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-green-900 mb-1">Code:</div>
            <code className="text-xs">path.append(remaining[i])</code>
          </div>
        </div>
      ),
      code: `def permutations(nums):
    result = []
    
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        
        for i in range(len(remaining)):
            # CHOOSE: Go down this branch
            path.append(remaining[i])
    
    return result`,
    },
    {
      title: 'Step 6: Recurse - Visit Child Node',
      treeDescription: (
        <div className="space-y-3">
          <p className="text-sm">After moving to child node:</p>
          <ul className="ml-4 space-y-2 text-sm">
            <li>• Continue exploring from there (recursive call)</li>
            <li>• Pass updated path and remaining numbers</li>
            <li>• This explores the entire subtree</li>
          </ul>
        </div>
      ),
      codeMapping: (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-purple-900 mb-1">Tree Concept:</div>
            <div>Explore entire subtree from child</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-green-900 mb-1">Code:</div>
            <code className="text-xs">backtrack(path, new_remaining)</code>
          </div>
        </div>
      ),
      code: `def permutations(nums):
    result = []
    
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        
        for i in range(len(remaining)):
            path.append(remaining[i])
            
            # RECURSE: Explore the subtree
            new_remaining = remaining[:i] + remaining[i+1:]
            backtrack(path, new_remaining)
    
    return result`,
    },
    {
      title: 'Step 7: Backtrack - Return to Parent Node',
      treeDescription: (
        <div className="space-y-3">
          <p className="text-sm">After exploring a subtree:</p>
          <ul className="ml-4 space-y-2 text-sm">
            <li>• Undo the choice we made</li>
            <li>• Return to parent node</li>
            <li>• This lets us try the next branch</li>
            <li className="bg-yellow-50 p-2 rounded border border-yellow-300">
              <strong>This is the "backtrack" step!</strong> Going back up the tree.
            </li>
          </ul>
        </div>
      ),
      codeMapping: (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-purple-900 mb-1">Tree Concept:</div>
            <div>Return from child to parent node</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-green-900 mb-1">Code:</div>
            <code className="text-xs">path.pop()</code>
          </div>
        </div>
      ),
      code: `def permutations(nums):
    result = []
    
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        
        for i in range(len(remaining)):
            path.append(remaining[i])
            new_remaining = remaining[:i] + remaining[i+1:]
            backtrack(path, new_remaining)
            
            # BACKTRACK: Undo choice, return to parent
            path.pop()
    
    return result`,
    },
    {
      title: 'Step 8: Start the Exploration',
      treeDescription: (
        <div className="space-y-3">
          <p className="text-sm">Finally, start the tree traversal:</p>
          <ul className="ml-4 space-y-2 text-sm">
            <li>• Begin at the root (empty path)</li>
            <li>• All numbers are available</li>
            <li>• Let the recursion explore all branches!</li>
          </ul>
        </div>
      ),
      codeMapping: (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-purple-900 mb-1">Tree Concept:</div>
            <div>Start at root node</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-green-900 mb-1">Code:</div>
            <code className="text-xs">backtrack([], nums)</code>
          </div>
        </div>
      ),
      code: `def permutations(nums):
    result = []
    
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        
        for i in range(len(remaining)):
            path.append(remaining[i])
            new_remaining = remaining[:i] + remaining[i+1:]
            backtrack(path, new_remaining)
            path.pop()
    
    # START: Begin at root with empty path
    backtrack([], nums)
    return result`,
    },
  ];

  const executionTrace = [
    { call: 'backtrack([], [1,2,3])', depth: 0, action: 'Start at root' },
    { call: 'backtrack([1], [2,3])', depth: 1, action: 'Choose 1' },
    { call: 'backtrack([1,2], [3])', depth: 2, action: 'Choose 2' },
    { call: 'backtrack([1,2,3], [])', depth: 3, action: 'Choose 3' },
    { call: '→ Save [1,2,3]', depth: 3, action: 'Found leaf! Save it', highlight: true },
    { call: '← return to [1,2]', depth: 2, action: 'Backtrack (pop 3)', highlight: true },
    { call: 'backtrack([1,3], [2])', depth: 2, action: 'Choose 3' },
    { call: 'backtrack([1,3,2], [])', depth: 3, action: 'Choose 2' },
    { call: '→ Save [1,3,2]', depth: 3, action: 'Found leaf! Save it', highlight: true },
    { call: '← return to [1,3]', depth: 2, action: 'Backtrack (pop 2)', highlight: true },
    { call: '← return to [1]', depth: 1, action: 'Backtrack (pop 3)', highlight: true },
    { call: '← return to []', depth: 0, action: 'Backtrack (pop 1)', highlight: true },
    { call: '... (continues for all permutations)', depth: 0, action: 'Try starting with 2, then 3' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <h2 className="mb-3">From Tree to Code: Step-by-Step Translation</h2>
        <p className="text-gray-700">
          You've seen the tree structure. Now let's translate it into working code, step by step. 
          Each tree operation maps directly to a line of code.
        </p>
      </Card>

      {/* Step Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3>Progress: Step {activeStep + 1} of {steps.length}</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
              disabled={activeStep === steps.length - 1}
              variant="default"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        <div className="space-y-6">
          <h3 className="text-xl">{steps[activeStep].title}</h3>

          {/* Tree Description */}
          <div className="bg-purple-50 border border-purple-200 rounded p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 text-purple-700">🌳</div>
              <h4 className="text-sm">Tree Concept</h4>
            </div>
            {steps[activeStep].treeDescription}
          </div>

          {/* Code Mapping */}
          {steps[activeStep].codeMapping && (
            <div className="flex items-center gap-4">
              <ArrowRight className="w-6 h-6 text-gray-400" />
              {steps[activeStep].codeMapping}
            </div>
          )}

          {/* Code */}
          <div className="bg-gray-900 text-gray-100 rounded p-4 font-mono text-sm overflow-x-auto">
            <pre>{steps[activeStep].code}</pre>
          </div>
        </div>
      </Card>

      {/* Final Complete Code */}
      {activeStep === steps.length - 1 && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-6 h-6 text-green-700" />
            <h3>🎉 Complete Solution</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Congratulations! You've built the complete backtracking solution by systematically 
            translating each tree concept into code.
          </p>
          
          <div className="bg-white border border-green-300 rounded p-4">
            <h4 className="text-sm mb-3">The Pattern (works for ALL backtracking!):</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded">
                <strong className="block mb-2">1. Choose</strong>
                <code className="text-xs">path.append(choice)</code>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <strong className="block mb-2">2. Explore</strong>
                <code className="text-xs">backtrack(path, ...)</code>
              </div>
              <div className="p-3 bg-orange-50 rounded">
                <strong className="block mb-2">3. Unchoose</strong>
                <code className="text-xs">path.pop()</code>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Execution Trace */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-600" />
            <h3>Execution Trace</h3>
          </div>
          <Button
            onClick={() => setShowExecutionTrace(!showExecutionTrace)}
            variant="outline"
            size="sm"
          >
            {showExecutionTrace ? 'Hide' : 'Show'} Trace
          </Button>
        </div>

        {showExecutionTrace && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              Here's how the code actually executes for <code>[1,2,3]</code>. Notice how it 
              goes down the tree (recursive calls) and back up (backtracking):
            </p>
            {executionTrace.map((trace, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded font-mono text-sm ${
                  trace.highlight
                    ? 'bg-yellow-50 border border-yellow-300'
                    : 'bg-gray-50'
                }`}
                style={{ marginLeft: `${trace.depth * 20}px` }}
              >
                <span className="text-gray-500 text-xs mt-0.5">{idx + 1}.</span>
                <div className="flex-1">
                  <div className="text-xs">{trace.call}</div>
                  <div className="text-xs text-gray-600 mt-1">{trace.action}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="mb-3">💡 Key Takeaway</h3>
        <p className="text-sm">
          <strong>The tree structure directly dictates the code structure.</strong> Once you can draw 
          the decision tree for a problem, writing the backtracking code is mechanical:
        </p>
        <ul className="mt-3 ml-4 space-y-2 text-sm">
          <li>• Nodes = states in your recursive function</li>
          <li>• Edges = choices (loop iterations)</li>
          <li>• Going down = make choice + recurse</li>
          <li>• Going up = backtrack (undo choice)</li>
          <li>• Leaves = complete solutions (base case)</li>
        </ul>
        <p className="mt-4 text-sm text-blue-900 bg-white p-3 rounded border border-blue-300">
          <strong>Next step:</strong> Practice drawing trees for different problems. The code will follow naturally!
        </p>
      </Card>
    </div>
  );
}
