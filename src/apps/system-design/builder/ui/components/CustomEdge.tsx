import { EdgeProps, getBezierPath } from 'reactflow';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Calculate angle from source to target
  // This will work correctly regardless of which direction (left, right, up, down)
  const angle = Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI);

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* Arrow marker in the middle pointing from source to target */}
      <g transform={`translate(${labelX}, ${labelY}) rotate(${angle})`}>
        {/* Larger arrow pointing to the right (will be rotated by the angle) */}
        <polygon
          points="0,-6 12,0 0,6"
          fill="#3b82f6"
        />
      </g>
    </>
  );
}
