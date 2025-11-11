import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ArrayVisualizationProps {
  array: (number | string)[];
  highlightIndices?: number[];
  highlightColors?: Record<number, string>;
  pointers?: Record<number, string>; // index -> label (e.g., "left", "right", "i", "j")
  activeRange?: [number, number]; // For sliding window visualization
  animate?: boolean;
  cellWidth?: number;
  cellHeight?: number;
  showIndices?: boolean;
  className?: string;
}

const defaultColors = {
  default: 'bg-slate-100 border-slate-300 text-slate-900',
  highlight: 'bg-blue-100 border-blue-400 text-blue-900',
  active: 'bg-green-100 border-green-400 text-green-900',
  pointer: 'bg-purple-100 border-purple-400 text-purple-900',
  range: 'bg-amber-50 border-amber-300 text-amber-900',
};

export function ArrayVisualization({
  array,
  highlightIndices = [],
  highlightColors = {},
  pointers = {},
  activeRange,
  animate = true,
  cellWidth = 80,
  cellHeight = 80,
  showIndices = true,
  className,
}: ArrayVisualizationProps) {
  const getCellColor = (index: number): string => {
    // Custom color override
    if (highlightColors[index]) {
      return highlightColors[index];
    }

    // Pointer gets highest priority
    if (pointers[index]) {
      return defaultColors.pointer;
    }

    // Active range
    if (activeRange && index >= activeRange[0] && index <= activeRange[1]) {
      return defaultColors.range;
    }

    // Highlighted indices
    if (highlightIndices.includes(index)) {
      return defaultColors.highlight;
    }

    // Default
    return defaultColors.default;
  };

  const getCellContent = (value: number | string): string => {
    if (typeof value === 'number') {
      return value.toString();
    }
    return value;
  };

  const CellComponent = animate ? motion.div : 'div';

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Array cells */}
      <div className="flex gap-2 items-end">
        {array.map((value, index) => (
          <div key={index} className="relative">
            {/* Pointer label above */}
            {pointers[index] && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                  {pointers[index]}
                </div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-purple-600 mx-auto"></div>
              </div>
            )}

            {/* Cell */}
            <CellComponent
              className={cn(
                'flex items-center justify-center border-2 rounded font-mono font-semibold transition-all duration-300',
                getCellColor(index)
              )}
              style={{
                width: `${cellWidth}px`,
                height: `${cellHeight}px`,
                fontSize: typeof value === 'string' && value.length > 3 ? '12px' : '18px',
              }}
              {...(animate && {
                initial: { scale: 0.8, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                transition: { duration: 0.3, delay: index * 0.05 },
              })}
            >
              {getCellContent(value)}
            </CellComponent>

            {/* Index label below */}
            {showIndices && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-500 font-mono">
                {index}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active range indicator */}
      {activeRange && (
        <div className="text-sm text-slate-600 font-mono">
          Window: [{activeRange[0]}, {activeRange[1]}]
        </div>
      )}

      {/* Legend */}
      {(highlightIndices.length > 0 || Object.keys(pointers).length > 0 || activeRange) && (
        <div className="flex gap-4 text-xs text-slate-600">
          {highlightIndices.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded"></div>
              <span>Highlighted</span>
            </div>
          )}
          {Object.keys(pointers).length > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-purple-100 border-2 border-purple-400 rounded"></div>
              <span>Pointer</span>
            </div>
          )}
          {activeRange && (
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-amber-50 border-2 border-amber-300 rounded"></div>
              <span>Active Range</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
