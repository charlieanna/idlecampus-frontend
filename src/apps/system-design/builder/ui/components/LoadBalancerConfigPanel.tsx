import React from 'react';
import { SystemGraph } from '../../types/graph';

interface LoadBalancerConfigPanelProps {
  systemGraph: SystemGraph;
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;
}

export function LoadBalancerConfigPanel({
  systemGraph,
  onUpdateConfig,
}: LoadBalancerConfigPanelProps) {
  // Find all load_balancer components
  const loadBalancers = systemGraph.components.filter(comp => comp.type === 'load_balancer');

  if (loadBalancers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">No Load Balancer Found</p>
          <p className="text-gray-400 text-sm">
            Add a Load Balancer component to the canvas to configure it here.
          </p>
        </div>
      </div>
    );
  }

  // For now, configure the first load balancer (can be extended to handle multiple)
  const loadBalancer = loadBalancers[0];
  const config = loadBalancer.config || {};
  // Map UI values (with hyphens) to simulation values (with underscores)
  const algorithmValue = config.algorithm || 'round_robin';
  const algorithm = algorithmValue.replace(/_/g, '-'); // Convert round_robin -> round-robin for UI
  const healthCheckInterval = config.healthCheckInterval || 30; // seconds
  const healthCheckTimeout = config.healthCheckTimeout || 5; // seconds
  const healthCheckFailureThreshold = config.healthCheckFailureThreshold || 3;
  const connectionTimeout = config.connectionTimeout || 60; // seconds
  const idleTimeout = config.idleTimeout || 300; // seconds

  const handleChange = (key: string, value: any) => {
    // Convert UI values (with hyphens) to simulation values (with underscores)
    const configValue = key === 'algorithm' ? value.replace(/-/g, '_') : value;
    onUpdateConfig(loadBalancer.id, { ...config, [key]: configValue });
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Left Panel: Configuration */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Load Balancer Configuration</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure load balancing algorithm, health checks, and timeouts
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Load Balancing Algorithm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Load Balancing Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => handleChange('algorithm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="round_robin">Round Robin - Even distribution</option>
              <option value="least_connections">Least Connections - Balance active connections</option>
              <option value="ip_hash">IP Hash - Sticky sessions per client</option>
              <option value="weighted_round_robin">Weighted Round Robin - Weighted distribution</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {algorithm === 'round_robin' && 'Distributes requests evenly across all backend servers'}
              {algorithm === 'least_connections' && 'Routes to server with fewest active connections'}
              {algorithm === 'ip_hash' && 'Same client always goes to same server (session affinity)'}
              {algorithm === 'weighted_round_robin' && 'Distributes based on server weights'}
            </p>
          </div>

          {/* Health Check Settings */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-3">🏥 Health Check Settings</div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Check Interval (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={healthCheckInterval}
                  onChange={(e) => handleChange('healthCheckInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How often to check backend server health
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Check Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={healthCheckTimeout}
                  onChange={(e) => handleChange('healthCheckTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum time to wait for health check response
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Failure Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={healthCheckFailureThreshold}
                  onChange={(e) => handleChange('healthCheckFailureThreshold', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of consecutive failures before marking server unhealthy
                </p>
              </div>
            </div>
          </div>

          {/* Timeout Settings */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-3">⏱️ Timeout Settings</div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Connection Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={connectionTimeout}
                  onChange={(e) => handleChange('connectionTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum time to establish connection to backend
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Idle Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={idleTimeout}
                  onChange={(e) => handleChange('idleTimeout', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum idle time before closing connection
                </p>
              </div>
            </div>
          </div>

          {/* Load Balancer Specs */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-3">⚖️ Load Balancer Specs (Fixed)</div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Capacity:</span>
                <span className="font-semibold">100,000 RPS</span>
              </div>
              <div className="flex justify-between">
                <span>Base Latency:</span>
                <span className="font-semibold">1ms</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Cost:</span>
                <span className="font-semibold">$50/mo</span>
              </div>
            </div>
          </div>

          {/* Current Configuration Summary */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-900 mb-3">💡 Current Configuration</div>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Algorithm:</span>
                <span className="font-semibold capitalize">{algorithm.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Health Check:</span>
                <span className="font-semibold">Every {healthCheckInterval}s</span>
              </div>
              <div className="flex justify-between">
                <span>Failure Threshold:</span>
                <span className="font-semibold">{healthCheckFailureThreshold} failures</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Help/Info */}
      <div className="w-1/2 bg-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Load Balancing Guide</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Load Balancing Algorithms</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <strong>Round Robin:</strong> Evenly distributes requests in order. Best for uniform workloads and equal server capacity.
              </div>
              <div>
                <strong>Least Connections:</strong> Routes to server with fewest active connections. Best for long-running requests or variable request duration.
              </div>
              <div>
                <strong>IP Hash:</strong> Same client IP always goes to same server. Best for session affinity or caching per client.
              </div>
              <div>
                <strong>Weighted Round Robin:</strong> Distributes based on server weights. Best when servers have different capacities.
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Health Checks</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <strong>Check Interval:</strong> How often to ping backend servers. Lower = faster failure detection, higher = less overhead.
              </div>
              <div>
                <strong>Check Timeout:</strong> Maximum time to wait for health check response. Should be less than check interval.
              </div>
              <div>
                <strong>Failure Threshold:</strong> Number of consecutive failures before removing server from pool. Prevents flapping.
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Timeouts</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <strong>Connection Timeout:</strong> Maximum time to establish connection to backend. Prevents hanging on slow servers.
              </div>
              <div>
                <strong>Idle Timeout:</strong> Maximum idle time before closing connection. Frees up resources from inactive connections.
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="bg-white p-2 rounded border border-gray-200">
                <strong>Health Checks:</strong> Set interval to 30s, timeout to 5s for most applications
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <strong>Timeouts:</strong> Connection timeout should be 10-60s, idle timeout 60-300s
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <strong>Algorithm:</strong> Use Round Robin for most cases, Least Connections for variable workloads
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

