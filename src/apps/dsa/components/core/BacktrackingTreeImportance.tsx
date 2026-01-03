import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle, XCircle, AlertCircle, Lightbulb } from 'lucide-react';

export function BacktrackingTreeImportance() {
  const [revealedSections, setRevealedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newRevealed = new Set(revealedSections);
    if (newRevealed.has(section)) {
      newRevealed.delete(section);
    } else {
      newRevealed.add(section);
    }
    setRevealedSections(newRevealed);
  };

  const revealAll = () => {
    setRevealedSections(new Set(['completeness', 'organization', 'code', 'complexity']));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <h2 className="mb-3">Why Drawing Trees is Essential for Backtracking</h2>
        <p className="text-gray-700">
          You just built permutations manually and saw them visualized as a tree. But why is the tree 
          representation so important? Let's explore four critical reasons.
        </p>
        <Button onClick={revealAll} className="mt-4" variant="outline" size="sm">
          Reveal All Reasons
        </Button>
      </Card>

      {/* Reason 1: Completeness */}
      <Card className="p-6">
        <button
          onClick={() => toggleSection('completeness')}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3>1. Guarantees Completeness</h3>
          </div>
          <span className="text-sm text-gray-500">
            {revealedSections.has('completeness') ? 'Click to hide' : 'Click to reveal'}
          </span>
        </button>

        {revealedSections.has('completeness') && (
          <div className="mt-6 space-y-4">
            <p className="text-gray-700">
              When you were finding permutations manually, how did you know you found them all? 
              The tree provides mathematical certainty.
            </p>

            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h4 className="text-sm mb-2">Without a tree (ad-hoc approach):</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <span>"Did I try starting with 1? I think so..."</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <span>"Is [1,3,2] different from [3,1,2]? Let me check again..."</span>
                </div>
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <span>"I have 5 permutations. Are there more?"</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h4 className="text-sm mb-2">With a tree (systematic approach):</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span><strong>Every path from root to leaf is one solution</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span><strong>If you traverse the whole tree, you find all solutions</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span><strong>For 3 elements: 3 choices × 2 choices × 1 choice = 6 permutations</strong></span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded">
              <Lightbulb className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-sm text-purple-900">
                <strong>Key insight:</strong> The tree structure mathematically guarantees you won't 
                miss any solutions. Each branch represents a valid choice, and by exploring all branches, 
                you explore all possibilities.
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Reason 2: Organization */}
      <Card className="p-6">
        <button
          onClick={() => toggleSection('organization')}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            <h3>2. Organizes Your Thinking</h3>
          </div>
          <span className="text-sm text-gray-500">
            {revealedSections.has('organization') ? 'Click to hide' : 'Click to reveal'}
          </span>
        </button>

        {revealedSections.has('organization') && (
          <div className="mt-6 space-y-4">
            <p className="text-gray-700">
              The tree transforms a chaotic problem into an organized exploration.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                <h4 className="text-sm mb-3">Problem Structure</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>State:</strong> Current permutation being built</li>
                  <li>• <strong>Choices:</strong> Which numbers haven't been used yet</li>
                  <li>• <strong>Goal:</strong> Use all numbers</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                <h4 className="text-sm mb-3">Tree Mapping</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Nodes:</strong> States (partial permutations)</li>
                  <li>• <strong>Edges:</strong> Choices (picking a number)</li>
                  <li>• <strong>Leaves:</strong> Complete permutations</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm">
                <strong>This organization makes the problem solvable:</strong> Instead of "generate all 
                permutations" (overwhelming!), you think "at each step, try each unused number, then 
                recurse" (manageable!).
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Reason 3: Direct Translation to Code */}
      <Card className="p-6">
        <button
          onClick={() => toggleSection('code')}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center bg-green-600 text-white rounded font-mono text-sm">
              {'</>'}
            </div>
            <h3>3. Translates Directly to Code</h3>
          </div>
          <span className="text-sm text-gray-500">
            {revealedSections.has('code') ? 'Click to hide' : 'Click to reveal'}
          </span>
        </button>

        {revealedSections.has('code') && (
          <div className="mt-6 space-y-4">
            <p className="text-gray-700">
              Here's the magic: once you have the tree, writing the code is mechanical.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm mb-3 bg-purple-100 px-3 py-2 rounded">Tree Concept</h4>
                <ul className="space-y-3 text-sm">
                  <li className="p-3 bg-gray-50 rounded">
                    <strong>Visiting a node:</strong><br />
                    Check if we have a complete solution
                  </li>
                  <li className="p-3 bg-gray-50 rounded">
                    <strong>Exploring branches:</strong><br />
                    Loop through available choices
                  </li>
                  <li className="p-3 bg-gray-50 rounded">
                    <strong>Going down a branch:</strong><br />
                    Make a choice, recurse
                  </li>
                  <li className="p-3 bg-gray-50 rounded">
                    <strong>Coming back up:</strong><br />
                    Undo the choice (backtrack)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm mb-3 bg-green-100 px-3 py-2 rounded">Code Implementation</h4>
                <ul className="space-y-3 text-sm">
                  <li className="p-3 bg-gray-50 rounded font-mono text-xs">
                    <span className="text-gray-600">if len(path) == n:</span><br />
                    <span className="ml-4 text-gray-600">result.append(path[:])</span>
                  </li>
                  <li className="p-3 bg-gray-50 rounded font-mono text-xs">
                    <span className="text-gray-600">for num in remaining:</span><br />
                    <span className="ml-4 text-gray-600">...</span>
                  </li>
                  <li className="p-3 bg-gray-50 rounded font-mono text-xs">
                    <span className="text-gray-600">path.append(num)</span><br />
                    <span className="text-gray-600">backtrack(...)</span>
                  </li>
                  <li className="p-3 bg-gray-50 rounded font-mono text-xs">
                    <span className="text-gray-600">path.pop()</span><br />
                    <span className="text-gray-600 text-xs"># Undo choice</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <p className="text-sm">
                <strong>The tree IS the algorithm.</strong> Every backtracking problem follows this pattern: 
                draw the tree, then translate each tree operation into code. That's why we say 
                "backtracking = DFS on a decision tree."
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Reason 4: Complexity Analysis */}
      <Card className="p-6">
        <button
          onClick={() => toggleSection('complexity')}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center bg-orange-600 text-white rounded text-xs">
              O(n!)
            </div>
            <h3>4. Enables Complexity Analysis</h3>
          </div>
          <span className="text-sm text-gray-500">
            {revealedSections.has('complexity') ? 'Click to hide' : 'Click to reveal'}
          </span>
        </button>

        {revealedSections.has('complexity') && (
          <div className="mt-6 space-y-4">
            <p className="text-gray-700">
              The tree makes it easy to analyze time and space complexity.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded p-4">
              <h4 className="text-sm mb-3">Time Complexity: Counting Tree Nodes</h4>
              <div className="space-y-2 text-sm">
                <p>For permutations of n elements:</p>
                <ul className="ml-4 space-y-1">
                  <li>• Level 1: n choices</li>
                  <li>• Level 2: (n-1) choices for each of the n nodes = n × (n-1) nodes</li>
                  <li>• Level 3: (n-2) choices for each = n × (n-1) × (n-2) nodes</li>
                  <li>• ... continuing until level n</li>
                  <li className="pt-2 border-t border-orange-300">
                    <strong>Total nodes ≈ n! (factorial)</strong>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded p-4">
              <h4 className="text-sm mb-3">Space Complexity: Tree Depth</h4>
              <div className="space-y-2 text-sm">
                <ul className="ml-4 space-y-1">
                  <li>• Maximum recursion depth = tree height = n levels</li>
                  <li>• Each level stores the current path (up to n elements)</li>
                  <li className="pt-2 border-t border-purple-300">
                    <strong>Space complexity: O(n)</strong> for recursion stack
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm">
                Without the tree, you'd have to trace through the code to count operations. With the tree, 
                you just count nodes and measure depth. Much easier!
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Summary */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <h3 className="mb-4">🎯 Summary: Why Trees are Essential</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Completeness:</strong> Guarantees you find all solutions
            </div>
          </div>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Organization:</strong> Structures your thinking
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-5 h-5 flex items-center justify-center bg-green-600 text-white rounded text-xs flex-shrink-0 mt-0.5">
              {'</>'}
            </div>
            <div>
              <strong>Translation:</strong> Maps directly to code
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-5 h-5 flex items-center justify-center bg-orange-600 text-white rounded text-xs flex-shrink-0 mt-0.5">
              O(n)
            </div>
            <div>
              <strong>Analysis:</strong> Makes complexity obvious
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded border border-gray-200">
          <Lightbulb className="w-6 h-6 text-yellow-600 mb-2" />
          <p className="text-sm">
            <strong>The core skill in backtracking:</strong> Given a problem, can you draw its decision tree? 
            If yes, you can solve it. If no, you'll struggle. That's why we always start by drawing the tree.
          </p>
        </div>
      </Card>
    </div>
  );
}
