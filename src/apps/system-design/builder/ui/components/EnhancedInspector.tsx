import React, { useState } from 'react';
import { Node } from 'reactflow';
import { SystemGraph } from '../../types/graph';

interface InspectorProps {
  selectedNode: Node | null;
  systemGraph: SystemGraph;
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;
}

interface ConfigPreset {
  name: string;
  description: string;
  config: Record<string, any>;
  icon: string;
}

export function EnhancedInspector({
  selectedNode,
  systemGraph,
  onUpdateConfig,
}: InspectorProps) {
  const [expandedSection, setExpandedSection] = useState<string>('basic');

  if (!selectedNode) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Inspector</h2>
        <p className="text-sm text-gray-500">
          Select a component to configure its properties
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Click any component on the canvas to configure
            its capacity, cost, and performance settings.
          </p>
        </div>
      </div>
    );
  }

  const component = systemGraph.components.find((c) => c.id === selectedNode.id);
  if (!component) return null;

  const handleChange = (key: string, value: any) => {
    onUpdateConfig(selectedNode.id, { ...component.config, [key]: value });
  };

  const applyPreset = (preset: Record<string, any>) => {
    onUpdateConfig(selectedNode.id, { ...component.config, ...preset });
  };

  // Calculate estimated cost for current config
  const calculateCost = (): number => {
    switch (component.type) {
      case 'app_server':
        return (component.config.instances || 1) * 100;
      case 'redis':
        return (component.config.memorySizeGB || 4) * 50;
      case 'postgresql':
        let baseCost = 100;
        if (component.config.replication) baseCost += 100;
        return baseCost;
      case 'load_balancer':
        return 50;
      case 'cdn':
        return 0; // Pay per use
      case 's3':
        return (component.config.storageSizeGB || 100) * 0.023;
      default:
        return 0;
    }
  };

  const estimatedCost = calculateCost();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedNode.data.label}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {getComponentTypeLabel(component.type)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-green-600">
              ${estimatedCost.toFixed(0)}/mo
            </div>
            <div className="text-xs text-gray-500">Estimated cost</div>
          </div>
        </div>
      </div>

      {/* Configuration Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* App Server Config */}
        {component.type === 'app_server' && (
          <AppServerConfig
            config={component.config}
            onChange={handleChange}
            onApplyPreset={applyPreset}
          />
        )}

        {/* PostgreSQL Config */}
        {component.type === 'postgresql' && (
          <PostgreSQLConfig
            config={component.config}
            onChange={handleChange}
            onApplyPreset={applyPreset}
          />
        )}

        {/* Redis Config */}
        {component.type === 'redis' && (
          <RedisConfig
            config={component.config}
            onChange={handleChange}
            onApplyPreset={applyPreset}
          />
        )}

        {/* CDN Config */}
        {component.type === 'cdn' && (
          <CDNConfig
            config={component.config}
            onChange={handleChange}
          />
        )}

        {/* S3 Config */}
        {component.type === 's3' && (
          <S3Config
            config={component.config}
            onChange={handleChange}
          />
        )}

        {/* Load Balancer Config */}
        {component.type === 'load_balancer' && (
          <LoadBalancerConfig config={component.config} />
        )}
      </div>

      {/* Footer - Component Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <details className="text-xs">
          <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
            Component Details
          </summary>
          <div className="mt-2 space-y-1 text-gray-600">
            <p><strong>ID:</strong> <span className="font-mono">{component.id}</span></p>
            <p><strong>Type:</strong> {component.type}</p>
            <p><strong>Config Keys:</strong> {Object.keys(component.config).length}</p>
          </div>
        </details>
      </div>
    </div>
  );
}

// ============================================================================
// App Server Configuration
// ============================================================================

interface ConfigProps {
  config: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onApplyPreset?: (preset: Record<string, any>) => void;
}

function AppServerConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  const instances = config.instances || 1;
  const capacity = instances * 1000; // 1000 RPS per instance
  const cost = instances * 100;

  const presets: ConfigPreset[] = [
    {
      name: 'Minimal',
      description: '1 instance for low traffic',
      config: { instances: 1 },
      icon: '💰',
    },
    {
      name: 'Standard',
      description: '2 instances for redundancy',
      config: { instances: 2 },
      icon: '⚖️',
    },
    {
      name: 'High Availability',
      description: '4+ instances for scale',
      config: { instances: 4 },
      icon: '🚀',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Configuration</h3>

      {/* Presets */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset?.(preset.config)}
              className="p-2 text-left border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-lg">{preset.icon}</div>
              <div className="text-xs font-medium text-gray-900 mt-1">
                {preset.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Instances Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Instances
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={instances}
          onChange={(e) => onChange('instances', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-blue-600">{instances}</span>
          <div className="text-right">
            <div className="text-xs text-gray-500">Capacity</div>
            <div className="text-sm font-semibold text-gray-900">
              {capacity.toLocaleString()} RPS
            </div>
          </div>
        </div>
      </div>

      {/* Impact Card */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-2">💡 Impact</div>
        <div className="space-y-1 text-xs text-blue-800">
          <div className="flex justify-between">
            <span>Total Capacity:</span>
            <span className="font-semibold">{capacity.toLocaleString()} RPS</span>
          </div>
          <div className="flex justify-between">
            <span>Per Instance:</span>
            <span className="font-semibold">1,000 RPS</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Cost:</span>
            <span className="font-semibold">${cost}/month</span>
          </div>
          <div className="flex justify-between">
            <span>Base Latency:</span>
            <span className="font-semibold">10ms</span>
          </div>
        </div>
      </div>

      {/* Warning if instances = 1 */}
      {instances === 1 && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-xs font-medium text-yellow-900 mb-1">
            ⚠️ Single Point of Failure
          </div>
          <p className="text-xs text-yellow-800">
            With only 1 instance, your system has no redundancy. Consider using
            at least 2 instances for production.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PostgreSQL Configuration
// ============================================================================

function PostgreSQLConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  const readCapacity = config.readCapacity || 1000;
  const writeCapacity = config.writeCapacity || 1000;
  const replication = config.replication || false;
  const baseCost = replication ? 200 : 100;

  const presets: ConfigPreset[] = [
    {
      name: 'Basic',
      description: 'Low capacity, no replication',
      config: { readCapacity: 500, writeCapacity: 500, replication: false },
      icon: '💰',
    },
    {
      name: 'Standard',
      description: 'Moderate capacity',
      config: { readCapacity: 1000, writeCapacity: 1000, replication: false },
      icon: '⚖️',
    },
    {
      name: 'Production',
      description: 'High capacity + replication',
      config: { readCapacity: 2000, writeCapacity: 1000, replication: true },
      icon: '🔒',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Database Configuration</h3>

      {/* Presets */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset?.(preset.config)}
              className="p-2 text-left border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-lg">{preset.icon}</div>
              <div className="text-xs font-medium text-gray-900 mt-1">
                {preset.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Read Capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Read Capacity (ops/sec)
        </label>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={readCapacity}
          onChange={(e) => onChange('readCapacity', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">100</span>
          <span className="text-sm font-semibold text-blue-600">
            {readCapacity.toLocaleString()} ops/s
          </span>
          <span className="text-xs text-gray-500">5,000</span>
        </div>
      </div>

      {/* Write Capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Write Capacity (ops/sec)
        </label>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={writeCapacity}
          onChange={(e) => onChange('writeCapacity', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">100</span>
          <span className="text-sm font-semibold text-blue-600">
            {writeCapacity.toLocaleString()} ops/s
          </span>
          <span className="text-xs text-gray-500">5,000</span>
        </div>
      </div>

      {/* Replication */}
      <div className="p-3 border border-gray-200 rounded-lg">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={replication}
            onChange={(e) => onChange('replication', e.target.checked)}
            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">
              Enable Replication
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Adds read replicas for high availability. Survives database failures
              with automatic failover (&lt; 10s downtime).
            </p>
            <div className="mt-2 text-xs">
              <span className="text-gray-700">Additional cost:</span>{' '}
              <span className="font-semibold text-green-600">+$100/month</span>
            </div>
          </div>
        </label>
      </div>

      {/* Impact Card */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-2">📊 Capacity</div>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-800">Read Capacity</span>
              <span className="font-semibold text-blue-900">
                {readCapacity.toLocaleString()} ops/s
              </span>
            </div>
            <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600"
                style={{ width: `${(readCapacity / 5000) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-blue-800">Write Capacity</span>
              <span className="font-semibold text-blue-900">
                {writeCapacity.toLocaleString()} ops/s
              </span>
            </div>
            <div className="h-2 bg-green-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600"
                style={{ width: `${(writeCapacity / 5000) * 100}%` }}
              />
            </div>
          </div>
          <div className="pt-2 border-t border-blue-200 flex justify-between text-xs">
            <span className="text-blue-800">Monthly Cost:</span>
            <span className="font-semibold text-blue-900">${baseCost}/month</span>
          </div>
        </div>
      </div>

      {/* Warning if no replication */}
      {!replication && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-xs font-medium text-yellow-900 mb-1">
            ⚠️ No Replication
          </div>
          <p className="text-xs text-yellow-800">
            Database failures will cause 60s+ downtime. Enable replication for
            99.9%+ availability.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Redis Configuration
// ============================================================================

function RedisConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  const memorySizeGB = config.memorySizeGB || 4;
  const ttl = config.ttl || 3600;
  const hitRatio = config.hitRatio || 0.9;
  const cost = memorySizeGB * 50;

  const presets: ConfigPreset[] = [
    {
      name: 'Small',
      description: '2GB, 80% hit ratio',
      config: { memorySizeGB: 2, ttl: 1800, hitRatio: 0.8 },
      icon: '💰',
    },
    {
      name: 'Medium',
      description: '4GB, 90% hit ratio',
      config: { memorySizeGB: 4, ttl: 3600, hitRatio: 0.9 },
      icon: '⚡',
    },
    {
      name: 'Large',
      description: '8GB, 95% hit ratio',
      config: { memorySizeGB: 8, ttl: 7200, hitRatio: 0.95 },
      icon: '🚀',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Cache Configuration</h3>

      {/* Presets */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quick Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset?.(preset.config)}
              className="p-2 text-left border border-gray-200 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="text-lg">{preset.icon}</div>
              <div className="text-xs font-medium text-gray-900 mt-1">
                {preset.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Memory Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Memory Size (GB)
        </label>
        <input
          type="range"
          min="1"
          max="32"
          value={memorySizeGB}
          onChange={(e) => onChange('memorySizeGB', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">1 GB</span>
          <span className="text-sm font-semibold text-blue-600">
            {memorySizeGB} GB
          </span>
          <span className="text-xs text-gray-500">32 GB</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Larger cache = more keys stored = higher hit ratio
        </p>
      </div>

      {/* TTL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time to Live (TTL)
        </label>
        <input
          type="range"
          min="60"
          max="7200"
          step="60"
          value={ttl}
          onChange={(e) => onChange('ttl', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">1 min</span>
          <span className="text-sm font-semibold text-blue-600">
            {ttl >= 3600 ? `${(ttl / 3600).toFixed(1)} hours` : `${ttl / 60} minutes`}
          </span>
          <span className="text-xs text-gray-500">2 hours</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          How long cached data stays fresh before expiring
        </p>
      </div>

      {/* Hit Ratio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expected Hit Ratio
        </label>
        <input
          type="range"
          min="0.5"
          max="0.99"
          step="0.01"
          value={hitRatio}
          onChange={(e) => onChange('hitRatio', parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">50%</span>
          <span className="text-sm font-semibold text-blue-600">
            {(hitRatio * 100).toFixed(0)}%
          </span>
          <span className="text-xs text-gray-500">99%</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          % of requests served from cache (vs. hitting database)
        </p>
      </div>

      {/* Impact Card */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-2">💚 Cache Impact</div>
        <div className="space-y-1 text-xs text-green-800">
          <div className="flex justify-between">
            <span>Hit Ratio:</span>
            <span className="font-semibold">{(hitRatio * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span>DB Load Reduction:</span>
            <span className="font-semibold">{(hitRatio * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Cache Latency:</span>
            <span className="font-semibold">1ms</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Cost:</span>
            <span className="font-semibold">${cost}/month</span>
          </div>
        </div>
      </div>

      {/* Example Calculation */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-2">
          📊 Example: 1,000 RPS reads
        </div>
        <div className="space-y-1 text-xs text-blue-800">
          <div className="flex justify-between">
            <span>Cache Hits:</span>
            <span className="font-semibold">
              {((hitRatio * 1000).toFixed(0))} RPS
            </span>
          </div>
          <div className="flex justify-between">
            <span>Cache Misses (→ DB):</span>
            <span className="font-semibold">
              {(((1 - hitRatio) * 1000).toFixed(0))} RPS
            </span>
          </div>
          <div className="pt-2 border-t border-blue-200 flex justify-between">
            <span className="font-medium">DB Load Reduction:</span>
            <span className="font-semibold text-green-600">
              {((hitRatio * 100).toFixed(0))}% less!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CDN Configuration
// ============================================================================

function CDNConfig({ config, onChange }: Omit<ConfigProps, 'onApplyPreset'>) {
  const enabled = config.enabled !== false;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">CDN Configuration</h3>

      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange('enabled', e.target.checked)}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5"
          />
          <div>
            <span className="text-sm font-semibold text-gray-900">
              Enable CDN
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Distributes static content to edge locations worldwide for ultra-fast
              delivery (5ms latency vs 100ms from origin).
            </p>
          </div>
        </label>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-2">📊 CDN Stats</div>
        <div className="space-y-1 text-xs text-blue-800">
          <div className="flex justify-between">
            <span>Hit Ratio:</span>
            <span className="font-semibold">95%</span>
          </div>
          <div className="flex justify-between">
            <span>Edge Latency:</span>
            <span className="font-semibold">5ms</span>
          </div>
          <div className="flex justify-between">
            <span>Origin Latency:</span>
            <span className="font-semibold">100ms</span>
          </div>
          <div className="flex justify-between">
            <span>Pricing:</span>
            <span className="font-semibold">$0.01/GB</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-1">
          ✨ Best For
        </div>
        <ul className="text-xs text-green-800 space-y-1 ml-4 list-disc">
          <li>Images, videos, static files</li>
          <li>High-bandwidth applications</li>
          <li>Global user base</li>
          <li>Cost optimization for large files</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// S3 Configuration
// ============================================================================

function S3Config({ config, onChange }: Omit<ConfigProps, 'onApplyPreset'>) {
  const storageSizeGB = config.storageSizeGB || 100;
  const cost = storageSizeGB * 0.023;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Object Storage (S3)</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Storage Size (GB)
        </label>
        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={storageSizeGB}
          onChange={(e) => onChange('storageSizeGB', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">10 GB</span>
          <span className="text-sm font-semibold text-blue-600">
            {storageSizeGB} GB
          </span>
          <span className="text-xs text-gray-500">1,000 GB</span>
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-2">💰 Cost Breakdown</div>
        <div className="space-y-1 text-xs text-blue-800">
          <div className="flex justify-between">
            <span>Storage:</span>
            <span className="font-semibold">${cost.toFixed(2)}/month</span>
          </div>
          <div className="flex justify-between">
            <span>PUT requests:</span>
            <span className="font-semibold">$0.005 per 1,000</span>
          </div>
          <div className="flex justify-between">
            <span>GET requests:</span>
            <span className="font-semibold">$0.0004 per 1,000</span>
          </div>
          <div className="flex justify-between">
            <span>Data transfer:</span>
            <span className="font-semibold">$0.09/GB out</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="text-xs font-medium text-purple-900 mb-1">
          💡 Pro Tip
        </div>
        <p className="text-xs text-purple-800">
          Pair S3 with CDN to dramatically reduce data transfer costs and improve
          latency. CDN serves 95% of requests from edge, only 5% from S3.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Load Balancer Configuration (Read-only)
// ============================================================================

function LoadBalancerConfig({ config }: { config: Record<string, any> }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Load Balancer</h3>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700 mb-3">
          Load balancer has fixed configuration in MVP.
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Capacity:</span>
            <span className="font-semibold text-gray-900">100,000 RPS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Latency:</span>
            <span className="font-semibold text-gray-900">1ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Algorithm:</span>
            <span className="font-semibold text-gray-900">Round Robin</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Health Checks:</span>
            <span className="font-semibold text-gray-900">Enabled</span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-2">
            <span className="text-gray-600">Monthly Cost:</span>
            <span className="font-semibold text-green-600">$50</span>
          </div>
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-1">
          ℹ️ About Load Balancers
        </div>
        <p className="text-xs text-blue-800">
          Distributes incoming traffic across multiple servers to ensure no single
          server gets overwhelmed. Essential for high availability and scalability.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function getComponentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    client: 'Traffic Source',
    load_balancer: 'Load Balancer / Traffic Distribution',
    app_server: 'Application Server / Compute',
    postgresql: 'Relational Database',
    redis: 'In-Memory Cache',
    cdn: 'Content Delivery Network',
    s3: 'Object Storage',
  };
  return labels[type] || type;
}
