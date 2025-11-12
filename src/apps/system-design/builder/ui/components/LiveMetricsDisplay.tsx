import type { LoadTestProgress } from '../../types/loadTest';

interface LiveMetricsDisplayProps {
  progress: LoadTestProgress;
}

export function LiveMetricsDisplay({ progress }: LiveMetricsDisplayProps) {
  const percentComplete = (progress.completed / progress.total) * 100;

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="p-4 space-y-4">
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-700 mb-2">
          <span className="font-medium">Test Progress</span>
          <span>{percentComplete.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 rounded-full relative overflow-hidden"
            style={{ width: `${percentComplete}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{progress.completed.toLocaleString()} / {progress.total.toLocaleString()} requests</span>
          <span>~{formatTime(progress.estimated)} remaining</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {/* Current RPS */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-700 font-medium mb-1">Current Throughput</div>
          <div className="text-2xl font-bold text-blue-900">
            {progress.currentRPS.toFixed(0)}
          </div>
          <div className="text-xs text-blue-700 mt-0.5">requests/sec</div>
        </div>

        {/* Elapsed Time */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-700 font-medium mb-1">Elapsed Time</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatTime(progress.elapsed)}
          </div>
          <div className="text-xs text-gray-700 mt-0.5">duration</div>
        </div>
      </div>

      {/* Status Message */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
        <span>Running load test...</span>
      </div>
    </div>
  );
}

// Add shimmer animation to your global CSS or Tailwind config
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// .animate-shimmer {
//   animation: shimmer 2s infinite;
// }
