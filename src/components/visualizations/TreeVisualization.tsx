import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface TreeNode {
  value: number | string | null;
  left?: TreeNode;
  right?: TreeNode;
  id?: string; // Unique identifier for the node
  highlighted?: boolean;
  color?: string;
  label?: string; // Additional label to show below value
}

export interface TreeVisualizationProps {
  root: TreeNode | null;
  highlightPath?: string[]; // Array of node IDs to highlight as a path
  nodeSize?: number;
  levelGap?: number;
  animate?: boolean;
  showNullNodes?: boolean; // Show null leaf nodes
  className?: string;
}

interface NodePosition {
  x: number;
  y: number;
  node: TreeNode;
}

export function TreeVisualization({
  root,
  highlightPath = [],
  nodeSize = 40,
  levelGap = 80,
  animate = true,
  showNullNodes = false,
  className,
}: TreeVisualizationProps) {
  if (!root) {
    return (
      <div className={cn('flex items-center justify-center p-8 text-slate-400', className)}>
        Empty Tree
      </div>
    );
  }

  // Calculate tree dimensions
  const getTreeHeight = (node: TreeNode | null | undefined): number => {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  };

  const getTreeWidth = (node: TreeNode | null | undefined): number => {
    if (!node) return 0;
    if (!node.left && !node.right) return 1;
    return getTreeWidth(node.left) + getTreeWidth(node.right);
  };

  const height = getTreeHeight(root);
  const width = getTreeWidth(root);
  const svgWidth = Math.max(600, width * nodeSize * 2);
  const svgHeight = height * levelGap + nodeSize * 2;

  // Calculate node positions recursively
  const calculatePositions = (
    node: TreeNode | null | undefined,
    x: number,
    y: number,
    horizontalGap: number
  ): NodePosition[] => {
    if (!node || node.value === null) {
      if (showNullNodes && node) {
        return [{ x, y, node }];
      }
      return [];
    }

    const positions: NodePosition[] = [{ x, y, node }];

    if (node.left) {
      positions.push(
        ...calculatePositions(
          node.left,
          x - horizontalGap,
          y + levelGap,
          horizontalGap / 2
        )
      );
    }

    if (node.right) {
      positions.push(
        ...calculatePositions(
          node.right,
          x + horizontalGap,
          y + levelGap,
          horizontalGap / 2
        )
      );
    }

    return positions;
  };

  const positions = calculatePositions(root, svgWidth / 2, nodeSize, svgWidth / 4);

  // Get node color
  const getNodeColor = (node: TreeNode): string => {
    if (node.color) return node.color;
    if (node.highlighted) return 'fill-green-100 stroke-green-600';
    if (node.id && highlightPath.includes(node.id)) return 'fill-blue-100 stroke-blue-600';
    if (node.value === null) return 'fill-slate-50 stroke-slate-300';
    return 'fill-slate-100 stroke-slate-600';
  };

  const getTextColor = (node: TreeNode): string => {
    if (node.value === null) return 'text-slate-300';
    if (node.highlighted || (node.id && highlightPath.includes(node.id))) {
      return 'text-slate-900 font-bold';
    }
    return 'text-slate-700';
  };

  // Find edges
  const edges: Array<{ x1: number; y1: number; x2: number; y2: number; highlighted: boolean }> = [];

  positions.forEach(({ x: px, y: py, node: pNode }) => {
    if (pNode.left) {
      const childPos = positions.find(p => p.node === pNode.left);
      if (childPos) {
        const highlighted =
          (pNode.id && highlightPath.includes(pNode.id)) &&
          (pNode.left.id && highlightPath.includes(pNode.left.id));
        edges.push({
          x1: px,
          y1: py + nodeSize / 2,
          x2: childPos.x,
          y2: childPos.y - nodeSize / 2,
          highlighted
        });
      }
    }
    if (pNode.right) {
      const childPos = positions.find(p => p.node === pNode.right);
      if (childPos) {
        const highlighted =
          (pNode.id && highlightPath.includes(pNode.id)) &&
          (pNode.right.id && highlightPath.includes(pNode.right.id));
        edges.push({
          x1: px,
          y1: py + nodeSize / 2,
          x2: childPos.x,
          y2: childPos.y - nodeSize / 2,
          highlighted
        });
      }
    }
  });

  const CircleComponent = animate ? motion.circle : 'circle';
  const LineComponent = animate ? motion.line : 'line';

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        width={svgWidth}
        height={svgHeight}
        className="overflow-visible"
        style={{ maxWidth: '100%' }}
      >
        {/* Draw edges first (so they appear behind nodes) */}
        {edges.map((edge, i) => (
          <LineComponent
            key={`edge-${i}`}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke={edge.highlighted ? '#2563eb' : '#cbd5e1'}
            strokeWidth={edge.highlighted ? 3 : 2}
            {...(animate && {
              initial: { pathLength: 0, opacity: 0 },
              animate: { pathLength: 1, opacity: 1 },
              transition: { duration: 0.5, delay: i * 0.05 },
            })}
          />
        ))}

        {/* Draw nodes */}
        {positions.map(({ x, y, node }, i) => (
          <g key={`node-${i}`}>
            {/* Node circle */}
            <CircleComponent
              cx={x}
              cy={y}
              r={nodeSize / 2}
              className={cn('stroke-2', getNodeColor(node))}
              {...(animate && {
                initial: { scale: 0, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { duration: 0.3, delay: i * 0.1 },
              })}
            />

            {/* Node value */}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              className={cn('text-sm font-mono', getTextColor(node))}
            >
              {node.value !== null ? node.value : 'null'}
            </text>

            {/* Optional label below node */}
            {node.label && (
              <text
                x={x}
                y={y + nodeSize / 2 + 16}
                textAnchor="middle"
                className="text-xs text-slate-500 font-mono"
              >
                {node.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Legend */}
      {highlightPath.length > 0 && (
        <div className="mt-4 flex gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-600 rounded-full"></div>
            <span>Highlighted Path</span>
          </div>
        </div>
      )}
    </div>
  );
}
