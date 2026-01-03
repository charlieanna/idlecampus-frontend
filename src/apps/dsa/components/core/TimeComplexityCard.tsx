import { Clock, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface TimeComplexityInfo {
  timeComplexity: string;
  spaceComplexity: string;
  explanation?: string;
  comparison?: {
    bruteForce: string;
    optimized: string;
    improvement: string;
  };
}

interface TimeComplexityCardProps {
  info: TimeComplexityInfo;
  compact?: boolean;
}

export function TimeComplexityCard({ info, compact = false }: TimeComplexityCardProps) {
  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('O(1)')) return 'text-green-600 bg-green-50 border-green-200';
    if (complexity.includes('O(log n)')) return 'text-green-600 bg-green-50 border-green-200';
    if (complexity.includes('O(n)')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (complexity.includes('O(n log n)')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (complexity.includes('O(n²)') || complexity.includes('O(n^2)')) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (complexity.includes('O(2^n)')) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-slate-600 bg-slate-50 border-slate-200';
  };

  const getComplexityIcon = (complexity: string) => {
    if (complexity.includes('O(1)') || complexity.includes('O(log n)')) return TrendingDown;
    if (complexity.includes('O(2^n)') || complexity.includes('O(n²)')) return TrendingUp;
    return Minus;
  };

  const TimeIcon = getComplexityIcon(info.timeComplexity);

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-slate-500" />
        <span className="text-slate-700">Time:</span>
        <Badge variant="outline" className={getComplexityColor(info.timeComplexity)}>
          {info.timeComplexity}
        </Badge>
        <span className="text-slate-400">|</span>
        <span className="text-slate-700">Space:</span>
        <Badge variant="outline" className={getComplexityColor(info.spaceComplexity)}>
          {info.spaceComplexity}
        </Badge>
      </div>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h4 className="text-slate-900">Complexity Analysis</h4>
        </div>

        {/* Main Complexities */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-600 mb-1">Time Complexity</div>
            <Badge variant="outline" className={`${getComplexityColor(info.timeComplexity)} text-base px-3 py-1`}>
              <TimeIcon className="w-4 h-4 mr-1" />
              {info.timeComplexity}
            </Badge>
          </div>
          <div>
            <div className="text-xs text-slate-600 mb-1">Space Complexity</div>
            <Badge variant="outline" className={`${getComplexityColor(info.spaceComplexity)} text-base px-3 py-1`}>
              {info.spaceComplexity}
            </Badge>
          </div>
        </div>

        {/* Explanation */}
        {info.explanation && (
          <div className="text-sm text-slate-700 bg-white/60 rounded p-2 border border-slate-200">
            {info.explanation}
          </div>
        )}

        {/* Comparison */}
        {info.comparison && (
          <div className="space-y-2">
            <div className="text-xs text-slate-600 uppercase tracking-wide">Comparison</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <div className="text-red-600 mb-1">Brute Force</div>
                <code className="text-red-800">{info.comparison.bruteForce}</code>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <div className="text-green-600 mb-1">Optimized</div>
                <code className="text-green-800">{info.comparison.optimized}</code>
              </div>
            </div>
            <div className="text-xs text-center text-slate-700 bg-white/60 rounded p-2 border border-slate-200">
              <span className="text-green-600">✓</span> {info.comparison.improvement}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Inline compact version for use in lesson text
interface InlineComplexityBadgeProps {
  complexity: string;
  type?: 'time' | 'space';
}

export function InlineComplexityBadge({ complexity, type = 'time' }: InlineComplexityBadgeProps) {
  const getComplexityColor = (complexity: string) => {
    if (complexity.includes('O(1)')) return 'text-green-700 bg-green-100 border-green-300';
    if (complexity.includes('O(log n)')) return 'text-green-700 bg-green-100 border-green-300';
    if (complexity.includes('O(n)')) return 'text-blue-700 bg-blue-100 border-blue-300';
    if (complexity.includes('O(n log n)')) return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    if (complexity.includes('O(n²)') || complexity.includes('O(n^2)')) return 'text-orange-700 bg-orange-100 border-orange-300';
    if (complexity.includes('O(2^n)')) return 'text-red-700 bg-red-100 border-red-300';
    return 'text-slate-700 bg-slate-100 border-slate-300';
  };

  return (
    <Badge 
      variant="outline" 
      className={`${getComplexityColor(complexity)} font-mono text-xs`}
    >
      {type === 'time' && <Clock className="w-3 h-3 mr-1" />}
      {complexity}
    </Badge>
  );
}
