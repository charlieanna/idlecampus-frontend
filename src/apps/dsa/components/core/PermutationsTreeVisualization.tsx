import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TreeNode {
  value: string;
  children: TreeNode[];
  path: number[];
  remaining: number[];
  isLeaf: boolean;
}

export function PermutationsTreeVisualization() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [highlightedPath, setHighlightedPath] = useState<string | null>(null);
  const elements = [1, 2, 3];

  // Build the decision tree
  const buildTree = (): TreeNode => {
    const root: TreeNode = {
      value: 'Start []',
      children: [],
      path: [],
      remaining: elements,
      isLeaf: false
    };

    const buildNode = (path: number[], remaining: number[]): TreeNode => {
      const isLeaf = remaining.length === 0;
      const node: TreeNode = {
        value: isLeaf ? `✓ [${path.join(',')}]` : `[${path.join(',')}]`,
        children: [],
        path: [...path],
        remaining: [...remaining],
        isLeaf
      };

      if (!isLeaf) {
        for (let i = 0; i < remaining.length; i++) {
          const newPath = [...path, remaining[i]];
          const newRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
          node.children.push(buildNode(newPath, newRemaining));
        }
      }

      return node;
    };

    for (let i = 0; i < elements.length; i++) {
      const newPath = [elements[i]];
      const newRemaining = [...elements.slice(0, i), ...elements.slice(i + 1)];
      root.children.push(buildNode(newPath, newRemaining));
    }

    return root;
  };

  const tree = buildTree();

  const getNodeKey = (node: TreeNode): string => {
    return `${node.path.join(',')}-${node.remaining.join(',')}`;
  };

  const toggleNode = (nodeKey: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeKey)) {
      newExpanded.delete(nodeKey);
    } else {
      newExpanded.add(nodeKey);
    }
    setExpandedNodes(newExpanded);
  };

  const expandAll = () => {
    const allKeys = new Set<string>();
    const collectKeys = (node: TreeNode) => {
      allKeys.add(getNodeKey(node));
      node.children.forEach(collectKeys);
    };
    collectKeys(tree);
    setExpandedNodes(allKeys);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set(['root']));
  };

  const TreeNodeComponent: React.FC<{ node: TreeNode; level: number }> = ({ node, level }) => {
    const nodeKey = getNodeKey(node);
    const isExpanded = expandedNodes.has(nodeKey);
    const hasChildren = node.children.length > 0;
    const isHighlighted = highlightedPath === nodeKey;

    return (
      <div className="select-none">
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer transition-colors ${
            isHighlighted ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-50'
          } ${node.isLeaf ? 'bg-green-50' : ''}`}
          onClick={() => {
            if (hasChildren) toggleNode(nodeKey);
            setHighlightedPath(nodeKey);
          }}
          onMouseEnter={() => setHighlightedPath(nodeKey)}
          onMouseLeave={() => setHighlightedPath(null)}
        >
          <div style={{ marginLeft: `${level * 24}px` }} className="flex items-center gap-2">
            {hasChildren && (
              <button className="w-5 h-5 flex items-center justify-center">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-5" />}
            
            <div className="flex items-center gap-3">
              <span className={`font-mono ${node.isLeaf ? 'text-green-700' : ''}`}>
                {node.value}
              </span>
              
              {node.remaining.length > 0 && (
                <span className="text-xs text-gray-500">
                  choices: [{node.remaining.join(', ')}]
                </span>
              )}
            </div>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="border-l-2 border-gray-200 ml-3">
            {node.children.map((child, idx) => (
              <TreeNodeComponent key={idx} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const countLeaves = (node: TreeNode): number => {
    if (node.isLeaf) return 1;
    return node.children.reduce((sum, child) => sum + countLeaves(child), 0);
  };

  const totalPermutations = countLeaves(tree);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Permutation Decision Tree</h3>
          <div className="flex gap-2">
            <Button onClick={expandAll} variant="outline" size="sm">
              Expand All
            </Button>
            <Button onClick={collapseAll} variant="outline" size="sm">
              Collapse All
            </Button>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          This tree shows every decision you make when building permutations. Each branch represents 
          choosing a number, and each leaf (✓) is a complete permutation.
        </p>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="text-sm mb-2">Tree Statistics:</h4>
          <ul className="text-sm space-y-1">
            <li>• <strong>Total permutations (leaves):</strong> {totalPermutations}</li>
            <li>• <strong>Tree depth:</strong> {elements.length + 1} levels</li>
            <li>• <strong>Branching:</strong> At each level, branches = remaining choices</li>
          </ul>
        </div>

        {/* The tree */}
        <div className="border rounded p-4 bg-white overflow-auto max-h-[600px]">
          <TreeNodeComponent node={tree} level={0} />
        </div>
      </Card>

      {/* Explanation */}
      <Card className="p-6 bg-purple-50 border-purple-200">
        <h4 className="mb-3">🌳 Understanding the Tree</h4>
        <div className="space-y-3 text-sm">
          <div>
            <strong>Each level represents a decision:</strong>
            <ul className="mt-2 ml-4 space-y-1">
              <li>• Level 1: Choose the first number</li>
              <li>• Level 2: Choose the second number (from remaining)</li>
              <li>• Level 3: Choose the third number (only one left)</li>
            </ul>
          </div>
          
          <div>
            <strong>Key observations:</strong>
            <ul className="mt-2 ml-4 space-y-1">
              <li>• The tree naturally prevents duplicates - once we choose 1 first, we can't choose it again</li>
              <li>• Every path from root to leaf is a unique permutation</li>
              <li>• Total permutations = 3! = 3 × 2 × 1 = 6</li>
              <li>• The tree structure <em>guarantees</em> we find all permutations</li>
            </ul>
          </div>

          <div className="pt-3 border-t border-purple-300">
            <strong>💡 The Big Insight:</strong>
            <p className="mt-1 text-purple-900">
              When you were building permutations manually, you were implicitly traversing this tree! 
              The systematic approach you developed was a mental model of this exact tree structure.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
