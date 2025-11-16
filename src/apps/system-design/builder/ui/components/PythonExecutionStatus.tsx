import React, { useState, useEffect } from 'react';
import {
  Play,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader,
  Code,
  Clock,
  Zap,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BenchmarkResult } from '../../services/pythonExecutor';

interface PythonExecutionStatusProps {
  isExecuting: boolean;
  benchmarkResult?: BenchmarkResult | null;
  componentType: 'app_server' | 'worker';
  functionName: string;
  onRetry?: () => void;
}

/**
 * Python Execution Status Component
 *
 * Shows real-time status when Python code is being benchmarked
 * Displays performance results and warnings
 */
export function PythonExecutionStatus({
  isExecuting,
  benchmarkResult,
  componentType,
  functionName,
  onRetry,
}: PythonExecutionStatusProps) {
  const [expanded, setExpanded] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Animate execution progress
  useEffect(() => {
    if (isExecuting) {
      const interval = setInterval(() => {
        setAnimationStep(prev => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isExecuting]);

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return 'text-green-600';
    if (latency < 200) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLatencyLabel = (latency: number) => {
    if (latency < 50) return 'Excellent';
    if (latency < 100) return 'Good';
    if (latency < 200) return 'Acceptable';
    if (latency < 500) return 'Slow';
    return 'Too Slow';
  };

  const getErrorRateColor = (errorRate: number) => {
    if (errorRate === 0) return 'text-green-600';
    if (errorRate < 0.01) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceScore = () => {
    if (!benchmarkResult) return 0;

    // Calculate score based on latency and error rate
    const latencyScore = Math.max(0, 100 - (benchmarkResult.avgLatency / 10));
    const errorScore = (1 - benchmarkResult.errorRate) * 100;
    return Math.round((latencyScore * 0.7 + errorScore * 0.3));
  };

  if (!isExecuting && !benchmarkResult) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Code className="w-5 h-5 text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">
                Python Execution: {functionName}()
              </div>
              <div className="text-sm text-gray-600">
                {componentType === 'app_server' ? 'App Server' : 'Worker'} Component
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isExecuting ? (
              <div className="flex items-center space-x-2">
                <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-600 font-medium">
                  Benchmarking{'.'.repeat(animationStep)}
                </span>
              </div>
            ) : benchmarkResult ? (
              <div className="flex items-center space-x-2">
                {benchmarkResult.errorRate === 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : benchmarkResult.errorRate < 0.1 ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  benchmarkResult.errorRate === 0 ? 'text-green-600' :
                  benchmarkResult.errorRate < 0.1 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  Score: {getPerformanceScore()}/100
                </span>
              </div>
            ) : null}

            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Details (Expandable) */}
      {expanded && (
        <div className="p-4">
          {isExecuting ? (
            <div className="space-y-4">
              {/* Execution Progress */}
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                    <div
                      className="absolute inset-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-spin"
                      style={{ borderRightColor: 'transparent', borderTopColor: 'transparent' }}
                    ></div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Running {benchmarkResult?.samples?.length || 0}/100 test requests...
                  </p>
                </div>
              </div>
            </div>
          ) : benchmarkResult ? (
            <div className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Avg Latency</span>
                  </div>
                  <div className={`text-2xl font-bold ${getLatencyColor(benchmarkResult.avgLatency)}`}>
                    {benchmarkResult.avgLatency.toFixed(0)}ms
                  </div>
                  <div className={`text-xs ${getLatencyColor(benchmarkResult.avgLatency)}`}>
                    {getLatencyLabel(benchmarkResult.avgLatency)}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>P99 Latency</span>
                  </div>
                  <div className={`text-2xl font-bold ${getLatencyColor(benchmarkResult.p99Latency)}`}>
                    {benchmarkResult.p99Latency.toFixed(0)}ms
                  </div>
                  <div className="text-xs text-gray-500">
                    99% of requests
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Zap className="w-4 h-4" />
                    <span>Success Rate</span>
                  </div>
                  <div className={`text-2xl font-bold ${getErrorRateColor(benchmarkResult.errorRate)}`}>
                    {((1 - benchmarkResult.errorRate) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">
                    {benchmarkResult.successCount}/{benchmarkResult.successCount + benchmarkResult.errorCount}
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Throughput</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(1000 / benchmarkResult.avgLatency)}
                  </div>
                  <div className="text-xs text-gray-500">
                    req/sec
                  </div>
                </div>
              </div>

              {/* Performance Warnings */}
              {(benchmarkResult.avgLatency > 100 || benchmarkResult.errorRate > 0.01) && (
                <div className="space-y-2">
                  {benchmarkResult.avgLatency > 100 && (
                    <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-yellow-900">Slow Performance Detected</div>
                        <div className="text-sm text-yellow-700 mt-1">
                          Your {functionName}() function takes {benchmarkResult.avgLatency.toFixed(0)}ms on average.
                          {functionName === 'shorten' && (
                            <span> Consider using auto-increment IDs instead of collision checking.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {benchmarkResult.errorRate > 0.01 && (
                    <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-red-900">High Error Rate</div>
                        <div className="text-sm text-red-700 mt-1">
                          {(benchmarkResult.errorRate * 100).toFixed(1)}% of requests are failing.
                          Check for infinite loops or exceptions in your code.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Latency Distribution */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Latency Distribution</h4>
                <div className="h-32 relative bg-gray-50 rounded-lg p-2">
                  <svg className="w-full h-full">
                    {/* Histogram bars */}
                    {(() => {
                      const samples = benchmarkResult.samples.filter(s => s.success);
                      if (samples.length === 0) return null;

                      const maxLatency = Math.max(...samples.map(s => s.latency));
                      const bucketCount = 20;
                      const bucketSize = maxLatency / bucketCount;
                      const buckets = Array(bucketCount).fill(0);

                      samples.forEach(s => {
                        const bucketIndex = Math.min(
                          Math.floor(s.latency / bucketSize),
                          bucketCount - 1
                        );
                        buckets[bucketIndex]++;
                      });

                      const maxCount = Math.max(...buckets);
                      const barWidth = 100 / bucketCount;

                      return buckets.map((count, i) => {
                        const height = (count / maxCount) * 100;
                        const x = i * barWidth;
                        const color = i < bucketCount * 0.5 ? '#10b981' :
                                     i < bucketCount * 0.8 ? '#f59e0b' : '#ef4444';

                        return (
                          <rect
                            key={i}
                            x={`${x}%`}
                            y={`${100 - height}%`}
                            width={`${barWidth * 0.8}%`}
                            height={`${height}%`}
                            fill={color}
                            opacity={0.7}
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                    <span>0ms</span>
                    <span>{benchmarkResult.p99Latency.toFixed(0)}ms</span>
                  </div>
                </div>
              </div>

              {/* Retry Button */}
              {onRetry && benchmarkResult.errorRate > 0.01 && (
                <div className="pt-2">
                  <button
                    onClick={onRetry}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Re-run Benchmark</span>
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}