import type { Bottleneck } from '../../types/loadTest';

interface BottleneckAnalysisProps {
  bottlenecks: Bottleneck[];
}

export function BottleneckAnalysis({ bottlenecks }: BottleneckAnalysisProps) {
  if (bottlenecks.length === 0) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🎉</span>
          <div>
            <div className="font-semibold text-green-900">No Bottlenecks Detected</div>
            <div className="text-sm text-green-700 mt-1">
              Your code performs well under the tested load!
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityStyles = (severity: Bottleneck['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          icon: '🔴',
          textColor: 'text-red-900',
          badgeBg: 'bg-red-200',
          badgeText: 'text-red-800',
        };
      case 'error':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-300',
          icon: '⚠️',
          textColor: 'text-orange-900',
          badgeBg: 'bg-orange-200',
          badgeText: 'text-orange-800',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-300',
          icon: '⚡',
          textColor: 'text-yellow-900',
          badgeBg: 'bg-yellow-200',
          badgeText: 'text-yellow-800',
        };
    }
  };

  const getTypeLabel = (type: Bottleneck['type']) => {
    switch (type) {
      case 'high_latency':
        return 'High Latency';
      case 'high_error_rate':
        return 'High Error Rate';
      case 'low_throughput':
        return 'Low Throughput';
      case 'timeout':
        return 'Timeout Issues';
      case 'memory':
        return 'Memory Issues';
    }
  };

  // Sort by severity: critical > error > warning
  const sortedBottlenecks = [...bottlenecks].sort((a, b) => {
    const severityOrder = { critical: 0, error: 1, warning: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900">Performance Issues</h4>
        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
          {bottlenecks.length} {bottlenecks.length === 1 ? 'issue' : 'issues'}
        </span>
      </div>

      {sortedBottlenecks.map((bottleneck, index) => {
        const styles = getSeverityStyles(bottleneck.severity);

        return (
          <div
            key={index}
            className={`${styles.bg} border ${styles.border} rounded-lg p-4`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{styles.icon}</span>
                <div>
                  <div className={`text-sm font-semibold ${styles.textColor}`}>
                    {bottleneck.message}
                  </div>
                  {bottleneck.metric && (
                    <div className="text-xs text-gray-600 mt-0.5">
                      Measured: {bottleneck.metric.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${styles.badgeBg} ${styles.badgeText} font-medium`}>
                {getTypeLabel(bottleneck.type)}
              </span>
            </div>

            {/* Suggestions */}
            {bottleneck.suggestions.length > 0 && (
              <div className="mt-3 space-y-1">
                <div className="text-xs font-medium text-gray-700 mb-1.5">
                  💡 Suggestions:
                </div>
                <ul className="space-y-1">
                  {bottleneck.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex items-start">
                      <span className="text-gray-400 mr-2">→</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}

      {/* General Optimization Tips */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-xs font-medium text-blue-900 mb-2">
          🎯 General Optimization Tips
        </div>
        <ul className="space-y-1 text-xs text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Profile your code to identify slow operations</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Use appropriate data structures (dict for O(1) lookups)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Cache results of expensive computations</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Avoid nested loops when possible (reduce O(n²) complexity)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
