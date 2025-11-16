import { useEffect, useRef, useState } from 'react';
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

  const pathRef = useRef<SVGPathElement | null>(null);
  const [markerState, setMarkerState] = useState({ x: labelX, y: labelY, angle: Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI) });

  useEffect(() => {
    const pathElement = pathRef.current;

    if (!pathElement || typeof pathElement.getTotalLength !== 'function') {
      return;
    }

    try {
      const totalLength = pathElement.getTotalLength();
      if (!Number.isFinite(totalLength) || totalLength === 0) {
        return;
      }

      const midpointLength = totalLength / 2;
      const beforePoint = pathElement.getPointAtLength(Math.max(midpointLength - 1, 0));
      const afterPoint = pathElement.getPointAtLength(Math.min(midpointLength + 1, totalLength));
      const midpoint = pathElement.getPointAtLength(midpointLength);

      const tangentAngle = Math.atan2(afterPoint.y - beforePoint.y, afterPoint.x - beforePoint.x) * (180 / Math.PI);

      const angleToTarget = Math.atan2(targetY - midpoint.y, targetX - midpoint.x) * (180 / Math.PI);
      const angleToSource = Math.atan2(sourceY - midpoint.y, sourceX - midpoint.x) * (180 / Math.PI);

      const newState = {
        x: midpoint.x,
        y: midpoint.y,
        angle: angleToTarget,
      };

      setMarkerState(newState);
    } catch (error) {
      console.warn('[CustomEdge] getPointAtLength failed, using fallback', {
        id,
        error,
      });
      // Fallback: keep existing labelX/labelY based direction if getPointAtLength fails
      const fallbackAngle = Math.atan2(targetY - labelY, targetX - labelX) * (180 / Math.PI);
      setMarkerState({
        x: labelX,
        y: labelY,
        angle: fallbackAngle,
      });
    }
  }, [
    edgePath,
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    labelX,
    labelY,
  ]);

  const arrowColor = (style.stroke as string) || '#3b82f6';

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        ref={pathRef}
      />
      {/* Arrow marker in the middle pointing from source to target */}
      <g transform={`translate(${markerState.x}, ${markerState.y}) rotate(${markerState.angle})`}>
        {/* Larger arrow pointing to the right (will be rotated by the angle) */}
        <polygon
          points="0,-6 12,0 0,6"
          fill={arrowColor}
        />
      </g>
    </>
  );
}
