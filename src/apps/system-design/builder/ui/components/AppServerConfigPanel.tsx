import React from 'react';
import { SystemGraph } from '../../types/graph';

interface AppServerConfigPanelProps {
  systemGraph: SystemGraph;
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;
}

export function AppServerConfigPanel({
  systemGraph,
  onUpdateConfig,
}: AppServerConfigPanelProps) {
  // Find all app_server components
  const appServers = systemGraph.components.filter(comp => comp.type === 'app_server');

  if (appServers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">No App Servers Found</p>
          <p className="text-gray-400 text-sm">
            Add an App Server component to the canvas to configure it here.
          </p>
        </div>
      </div>
    );
  }

  // For now, configure the first app server (can be extended to handle multiple)
  const appServer = appServers[0];
  const config = appServer.config || {};
  const instances = config.instances || 1;
  const capacity = instances * 1000; // Fixed: 1000 RPS per commodity instance
  const cost = instances * 110; // Fixed: $110/mo per commodity instance

  const handleChange = (key: string, value: any) => {
    onUpdateConfig(appServer.id, { ...config, [key]: value });
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Left Panel: Configuration */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">App Server Configuration</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure number of app server instances
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Instances Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of App Server Instances
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={instances}
              onChange={(e) => handleChange('instances', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-2xl font-bold text-blue-600">{instances}</span>
              <div className="text-right">
                <div className="text-xs text-gray-500">Total Capacity</div>
                <div className="text-sm font-semibold text-gray-900">
                  {capacity.toLocaleString()} RPS
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Each instance handles 1,000 RPS (commodity hardware)
            </p>
            <p className="text-xs text-blue-600 mt-2">
              💡 Load balancing strategy is configured in the Load Balancer tab
            </p>
          </div>

          {/* Commodity Server Specs */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-3">🖥️ Commodity Server Specs (Fixed)</div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>vCPU:</span>
                <span className="font-semibold">8 cores</span>
              </div>
              <div className="flex justify-between">
                <span>Memory:</span>
                <span className="font-semibold">64 GB RAM</span>
              </div>
              <div className="flex justify-between">
                <span>Storage:</span>
                <span className="font-semibold">2 TB SSD</span>
              </div>
              <div className="flex justify-between">
                <span>Capacity per instance:</span>
                <span className="font-semibold">1,000 RPS</span>
              </div>
              <div className="flex justify-between">
                <span>Cost per instance:</span>
                <span className="font-semibold">$110/mo</span>
              </div>
            </div>
          </div>

          {/* Impact Summary */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-900 mb-3">💡 Current Configuration</div>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Total Instances:</span>
                <span className="font-semibold">{instances}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Capacity:</span>
                <span className="font-semibold">{capacity.toLocaleString()} RPS</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Cost:</span>
                <span className="font-semibold">${cost}/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Help/Info */}
      <div className="w-1/2 bg-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Scaling Guide</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">How to Calculate Instances</h4>
            <p className="text-sm text-gray-600 mb-2">
              Each commodity app server instance handles <strong>1,000 RPS</strong>.
            </p>
            <div className="bg-white p-3 rounded border border-gray-200">
              <code className="text-xs text-gray-700">
                instances_needed = ceil(peak_rps / 1000)
              </code>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Add 1-2 extra instances for headroom and redundancy.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Example Scenarios</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="bg-white p-2 rounded border border-gray-200">
                <strong>Low Traffic (100 RPS):</strong> 1 instance
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <strong>Normal Load (1,100 RPS):</strong> 2-3 instances
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <strong>High Traffic (5,000 RPS):</strong> 6 instances
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <strong>Viral Spike (10,000 RPS):</strong> 11-12 instances
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

