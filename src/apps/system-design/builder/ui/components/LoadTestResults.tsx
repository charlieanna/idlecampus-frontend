import type { LoadTestMetrics } from '../../types/loadTest';

interface LoadTestResultsProps {
  metrics: LoadTestMetrics;
  onReset: () => void;
}

export function LoadTestResults({ metrics, onReset }: LoadTestResultsProps) {
  const passP99 = metrics.p99Latency < 100;
  const passErrorRate = metrics.errorRate < 0.01;
  const allPass = passP99 && passErrorRate;

  const formatLatency = (ms: number): string => {
    return `${ms.toFixed(0)}ms`;
  };

  const formatPercent = (ratio: number): string => {
    return `${(ratio * 100).toFixed(2)}%`;
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      {/* Overall Status */}
      <div className={`p-4 rounded-lg border-2 ${
        allPass
          ? 'bg-green-50 border-green-500'
          : 'bg-yellow-50 border-yellow-500'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{allPass ? '✅' : '⚠️'}</span>
            <div>
              <div className="font-semibold text-lg">
                {allPass ? 'Test Passed!' : 'Needs Optimization'}
              </div>
              <div className="text-sm text-gray-700">
                {metrics.successfulRequests.toLocaleString()} / {metrics.totalRequests.toLocaleString()} requests successful
              </div>
            </div>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            title="Run a new load test with different parameters"
          >
            🔄 Run New Test
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* P50 Latency */}
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="text-xs text-gray-600 font-medium mb-1">P50 Latency</div>
          <div className="text-xl font-bold text-gray-900">
            {formatLatency(metrics.p50Latency)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Median response time</div>
        </div>

        {/* P99 Latency */}
        <div className={`border rounded-lg p-3 ${
          passP99 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className={`text-xs font-medium mb-1 ${
            passP99 ? 'text-green-700' : 'text-red-700'
          }`}>
            P99 Latency {passP99 ? '✓' : '✗'}
          </div>
          <div className={`text-xl font-bold ${
            passP99 ? 'text-green-900' : 'text-red-900'
          }`}>
            {formatLatency(metrics.p99Latency)}
          </div>
          <div className={`text-xs mt-1 ${
            passP99 ? 'text-green-600' : 'text-red-600'
          }`}>
            Target: &lt;100ms
          </div>
        </div>

        {/* Throughput */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-700 font-medium mb-1">Throughput</div>
          <div className="text-xl font-bold text-blue-900">
            {metrics.throughput.toFixed(0)}
          </div>
          <div className="text-xs text-blue-600 mt-1">requests/sec</div>
        </div>

        {/* Error Rate */}
        <div className={`border rounded-lg p-3 ${
          passErrorRate ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className={`text-xs font-medium mb-1 ${
            passErrorRate ? 'text-green-700' : 'text-red-700'
          }`}>
            Error Rate {passErrorRate ? '✓' : '✗'}
          </div>
          <div className={`text-xl font-bold ${
            passErrorRate ? 'text-green-900' : 'text-red-900'
          }`}>
            {formatPercent(metrics.errorRate)}
          </div>
          <div className={`text-xs mt-1 ${
            passErrorRate ? 'text-green-600' : 'text-red-600'
          }`}>
            Target: &lt;1%
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Detailed Statistics</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Min Latency:</span>
            <span className="font-mono font-medium text-gray-900">
              {formatLatency(metrics.minLatency)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Avg Latency:</span>
            <span className="font-mono font-medium text-gray-900">
              {formatLatency(metrics.avgLatency)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">P95 Latency:</span>
            <span className="font-mono font-medium text-gray-900">
              {formatLatency(metrics.p95Latency)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Max Latency:</span>
            <span className="font-mono font-medium text-gray-900">
              {formatLatency(metrics.maxLatency)}
            </span>
          </div>
          <div className="border-t border-gray-300 my-2" />
          <div className="flex justify-between">
            <span className="text-gray-600">Total Requests:</span>
            <span className="font-mono font-medium text-gray-900">
              {metrics.totalRequests.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Successful:</span>
            <span className="font-mono font-medium text-green-700">
              {metrics.successfulRequests.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Failed:</span>
            <span className="font-mono font-medium text-red-700">
              {metrics.failedRequests.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-gray-300 my-2" />
          <div className="flex justify-between">
            <span className="text-gray-600">Test Duration:</span>
            <span className="font-mono font-medium text-gray-900">
              {metrics.duration.toFixed(1)}s
            </span>
          </div>
        </div>
      </div>

      {/* Latency Distribution Mini Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Latency Distribution</h4>
        <div className="flex items-end space-x-1 h-24">
          {metrics.latencyDistribution.length > 0 &&
            Array.from({ length: 50 }, (_, i) => {
              const bucket = Math.floor((i / 50) * metrics.latencyDistribution.length);
              const value = metrics.latencyDistribution[bucket] || 0;
              const maxLatency = Math.max(...metrics.latencyDistribution);
              const height = (value / maxLatency) * 100;

              return (
                <div
                  key={i}
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${height}%`, minHeight: '2px' }}
                  title={`${value.toFixed(0)}ms`}
                />
              );
            })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Alternative Reset Button at bottom for convenience */}
      <button
        onClick={onReset}
        className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
      >
        <span>🔄</span>
        <span>Run Another Test</span>
      </button>
    </div>
  );
}
