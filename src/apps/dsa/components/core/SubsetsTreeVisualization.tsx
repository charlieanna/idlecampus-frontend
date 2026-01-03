import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import { Play, RotateCcw, Pause } from "lucide-react";

interface TreeNode {
  value: number[];
  x: number;
  y: number;
  children: TreeNode[];
  visited: boolean;
}

export default function SubsetsTreeVisualization() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const buildTree = (): TreeNode => {
    const tree: TreeNode = {
      value: [],
      x: 400,
      y: 50,
      children: [],
      visited: false
    };

    // Build tree structure for [1,2,3]
    const addChildren = (node: TreeNode, remaining: number[], depth: number, baseX: number, width: number) => {
      if (remaining.length === 0) return;
      
      remaining.forEach((num, idx) => {
        const child: TreeNode = {
          value: [...node.value, num],
          x: baseX + (idx - remaining.length / 2 + 0.5) * width,
          y: node.y + 80,
          children: [],
          visited: false
        };
        node.children.push(child);
        addChildren(child, remaining.slice(idx + 1), depth + 1, child.x, width / 2);
      });
    };

    addChildren(tree, [1, 2, 3], 0, 400, 200);
    return tree;
  };

  const tree = buildTree();

  const getAllNodesInOrder = (node: TreeNode): TreeNode[] => {
    const nodes: TreeNode[] = [node];
    node.children.forEach(child => {
      nodes.push(...getAllNodesInOrder(child));
    });
    return nodes;
  };

  const allNodes = getAllNodesInOrder(tree);
  const visitedNodes = allNodes.slice(0, Math.min(currentStep + 1, allNodes.length));

  const handlePlay = () => {
    if (isPlaying) {
      if (intervalId) clearInterval(intervalId);
      setIsPlaying(false);
      setIntervalId(null);
    } else {
      setIsPlaying(true);
      const id = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= allNodes.length - 1) {
            if (intervalId) clearInterval(intervalId);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      setIntervalId(id);
    }
  };

  const handleReset = () => {
    if (intervalId) clearInterval(intervalId);
    setCurrentStep(0);
    setIsPlaying(false);
    setIntervalId(null);
  };

  const renderNode = (node: TreeNode) => {
    const isVisited = visitedNodes.includes(node);
    const isCurrent = allNodes[currentStep] === node;

    return (
      <g key={node.value.join(',')}>
        <circle
          cx={node.x}
          cy={node.y}
          r={25}
          fill={isCurrent ? "#4f46e5" : isVisited ? "#10b981" : "#e5e7eb"}
          stroke={isCurrent ? "#4338ca" : isVisited ? "#059669" : "#9ca3af"}
          strokeWidth={2}
        />
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          fill={isVisited || isCurrent ? "white" : "#374151"}
          fontSize="12"
          fontWeight="600"
        >
          {node.value.length === 0 ? "[]" : `[${node.value.join(',')}]`}
        </text>
        
        {node.children.map((child, idx) => (
          <g key={`child-${node.value.join(',')}-${child.value.join(',')}-${idx}`}>
            <line
              x1={node.x}
              y1={node.y + 25}
              x2={child.x}
              y2={child.y - 25}
              stroke={visitedNodes.includes(child) ? "#10b981" : "#d1d5db"}
              strokeWidth={2}
            />
            {renderNode(child)}
          </g>
        ))}
      </g>
    );
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Interactive Tree Visualization</h3>
      <p className="text-xs text-muted-foreground mb-3">
        Watch how the algorithm explores the decision tree
      </p>
      
      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={isPlaying ? "destructive" : "default"}
          onClick={handlePlay}
          className="flex items-center gap-1"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3 h-3" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              Play
            </>
          )}
        </Button>
        <Button size="sm" variant="outline" onClick={handleReset} className="flex items-center gap-1">
          <RotateCcw className="w-3 h-3" />
          Reset
        </Button>
        <div className="ml-auto text-xs text-muted-foreground flex items-center">
          Step {currentStep + 1} / {allNodes.length}
        </div>
      </div>

      <div className="border rounded bg-white overflow-x-auto">
        <svg width="800" height="400" className="min-w-[800px]">
          {renderNode(tree)}
        </svg>
      </div>

      <div className="mt-3 p-3 bg-muted rounded-lg text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-600 border-2 border-indigo-700" />
          <span>Current node being explored</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-600 border-2 border-green-700" />
          <span>Visited and added to result</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300 border-2 border-gray-400" />
          <span>Not yet visited</span>
        </div>
      </div>
    </Card>
  );
}
