import React, { useState } from 'react';
import { Node } from 'reactflow';
import { SystemGraph } from '../../types/graph';

interface InspectorProps {
  node?: Node | null;
  selectedNode?: Node | null;
  systemGraph: SystemGraph;
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;
  onBack?: () => void;
  isModal?: boolean;
}

interface ConfigPreset {
  name: string;
  description: string;
  config: Record<string, any>;
  icon: string;
}

export function EnhancedInspector({
  node,
  selectedNode,
  systemGraph,
  onUpdateConfig,
  onBack,
  isModal = false,
}: InspectorProps) {
  // Support both 'node' and 'selectedNode' props for backward compatibility
  const activeNode = node || selectedNode;
  const [expandedSection, setExpandedSection] = useState<string>('basic');

  if (!activeNode) {
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

  const component = systemGraph.components.find((c) => c.id === activeNode.id);
  if (!component) return null;

  const handleChange = (key: string, value: any) => {
    onUpdateConfig(activeNode.id, { ...component.config, [key]: value });
  };

  const applyPreset = (preset: Record<string, any>) => {
    onUpdateConfig(activeNode.id, { ...component.config, ...preset });
  };

  // Calculate estimated cost for current config
  const calculateCost = (): number => {
    switch (component.type) {
      case 'app_server':
        return (component.config.instances || 1) * 100;
      case 'redis':
        return (component.config.memorySizeGB || 4) * 50;
      case 'postgresql':
        const instanceCosts: Record<string, number> = {
          'db.t3.micro': 13,
          'db.t3.small': 26,
          'db.t3.medium': 53,
          'db.m5.large': 133,
          'db.m5.xlarge': 266,
          'db.m5.2xlarge': 532,
        };
        const instanceType = component.config.instanceType || 'db.t3.medium';
        const baseCost = instanceCosts[instanceType] || 100;
        const replication = component.config.replication || { enabled: false, replicas: 0 };
        const replicationCost = replication.enabled ? baseCost * replication.replicas : 0;
        const storageCost = (component.config.storageSizeGB || 100) * 0.115;
        return baseCost + replicationCost + storageCost;
      case 'mongodb':
        const mongoNodes = component.config.numShards || 3;
        return mongoNodes * 100;
      case 'cassandra':
        const cassandraNodes = component.config.numNodes || 3;
        return 200 + (cassandraNodes - 1) * 150;
      case 'message_queue':
        return (component.config.numBrokers || 3) * 100;
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
      {/* Header - Only show if not in modal (modal has its own header) */}
      {!isModal && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {activeNode.data.label}
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

          {/* Back button - only when not in modal */}
          {onBack && (
            <button
              onClick={onBack}
              className="mt-4 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              ← Back to Palette
            </button>
          )}
        </div>
      )}

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

        {/* MongoDB Config */}
        {component.type === 'mongodb' && (
          <MongoDBConfig
            config={component.config}
            onChange={handleChange}
            onApplyPreset={applyPreset}
          />
        )}

        {/* Cassandra Config */}
        {component.type === 'cassandra' && (
          <CassandraConfig
            config={component.config}
            onChange={handleChange}
            onApplyPreset={applyPreset}
          />
        )}

        {/* Message Queue Config */}
        {component.type === 'message_queue' && (
          <MessageQueueConfig
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
  const instanceType = config.instanceType || 'db.t3.medium';
  const isolationLevel = config.isolationLevel || 'read-committed';
  const replication = config.replication || { enabled: false, replicas: 1, mode: 'async' };
  const sharding = config.sharding || { enabled: false, shards: 1, shardKey: '' };
  const storageType = config.storageType || 'gp3';
  const storageSizeGB = config.storageSizeGB || 100;
  const primaryKey = config.primaryKey || '';
  const indexes = config.indexes || '';

  // Calculate cost based on instance type
  const instanceCosts: Record<string, number> = {
    'db.t3.micro': 13,
    'db.t3.small': 26,
    'db.t3.medium': 53,
    'db.m5.large': 133,
    'db.m5.xlarge': 266,
    'db.m5.2xlarge': 532,
  };
  const baseCost = instanceCosts[instanceType] || 100;
  const replicationCost = replication.enabled ? baseCost * replication.replicas : 0;
  const totalCost = baseCost + replicationCost;

  const presets: ConfigPreset[] = [
    {
      name: 'Dev/Test',
      description: 'Low cost, minimal setup',
      config: {
        instanceType: 'db.t3.micro',
        isolationLevel: 'read-committed',
        replication: { enabled: false, replicas: 0, mode: 'async' },
        sharding: { enabled: false, shards: 1, shardKey: '' },
        storageType: 'gp3',
        storageSizeGB: 20,
      },
      icon: '💰',
    },
    {
      name: 'Production',
      description: 'HA + replication',
      config: {
        instanceType: 'db.m5.large',
        isolationLevel: 'read-committed',
        replication: { enabled: true, replicas: 2, mode: 'async' },
        sharding: { enabled: false, shards: 1, shardKey: '' },
        storageType: 'gp3',
        storageSizeGB: 100,
      },
      icon: '🔒',
    },
    {
      name: 'High Scale',
      description: 'Sharded + replicated',
      config: {
        instanceType: 'db.m5.xlarge',
        isolationLevel: 'read-committed',
        replication: { enabled: true, replicas: 2, mode: 'async' },
        sharding: { enabled: true, shards: 4, shardKey: 'user_id' },
        storageType: 'gp3',
        storageSizeGB: 500,
      },
      icon: '🚀',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">PostgreSQL Configuration</h3>

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

      {/* Data Model Section */}
      <div className="p-3 border-2 border-purple-200 rounded-lg bg-purple-50">
        <h4 className="text-xs font-semibold text-purple-900 mb-2">📊 Data Model</h4>

        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-purple-800 mb-1">
              Primary Key / Partition Key
            </label>
            <input
              type="text"
              value={primaryKey}
              onChange={(e) => onChange('primaryKey', e.target.value)}
              placeholder="e.g., short_code, user_id"
              className="w-full px-2 py-1 text-xs border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-purple-700 mt-1">
              How will you lookup data? This determines query performance.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-800 mb-1">
              Indexes (comma-separated)
            </label>
            <input
              type="text"
              value={indexes}
              onChange={(e) => onChange('indexes', e.target.value)}
              placeholder="e.g., created_at, user_id"
              className="w-full px-2 py-1 text-xs border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="text-xs text-purple-700 mt-1">
              Indexes speed up queries but slow down writes.
            </p>
          </div>
        </div>
      </div>

      {/* Instance Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instance Type
        </label>
        <select
          value={instanceType}
          onChange={(e) => onChange('instanceType', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <optgroup label="T3 - Dev/Testing (Burstable)">
            <option value="db.t3.micro">db.t3.micro - ~50 RPS, $13/mo</option>
            <option value="db.t3.small">db.t3.small - ~100 RPS, $26/mo</option>
            <option value="db.t3.medium">db.t3.medium - ~200 RPS, $53/mo</option>
          </optgroup>
          <optgroup label="M5 - Production (Recommended)">
            <option value="db.m5.large">db.m5.large - ~500 RPS, $133/mo</option>
            <option value="db.m5.xlarge">db.m5.xlarge - ~1000 RPS, $266/mo</option>
            <option value="db.m5.2xlarge">db.m5.2xlarge - ~2000 RPS, $532/mo</option>
          </optgroup>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Real AWS RDS instance types. Pick based on expected traffic.
        </p>
      </div>

      {/* Isolation Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction Isolation Level
        </label>
        <select
          value={isolationLevel}
          onChange={(e) => onChange('isolationLevel', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="read-uncommitted">Read Uncommitted - Fastest, dirty reads</option>
          <option value="read-committed">Read Committed - Default, good balance</option>
          <option value="repeatable-read">Repeatable Read - Slower, no phantom reads</option>
          <option value="serializable">Serializable - Slowest, strongest consistency</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Trade-off: Consistency vs Performance
        </p>
      </div>

      {/* Replication */}
      <div className="p-3 border border-gray-200 rounded-lg">
        <label className="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            checked={replication.enabled}
            onChange={(e) => onChange('replication', {
              ...replication,
              enabled: e.target.checked,
            })}
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
          </div>
        </label>

        {replication.enabled && (
          <div className="ml-6 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Number of Replicas
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={replication.replicas}
                onChange={(e) => onChange('replication', {
                  ...replication,
                  replicas: parseInt(e.target.value),
                })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cost multiplier: {1 + replication.replicas}x
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Replication Mode
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-xs">
                  <input
                    type="radio"
                    name="replicationMode"
                    value="async"
                    checked={replication.mode === 'async'}
                    onChange={(e) => onChange('replication', {
                      ...replication,
                      mode: e.target.value,
                    })}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Async</span> - Fast writes,
                    eventual consistency. May lose recent data on failover.
                  </div>
                </label>
                <label className="flex items-start gap-2 text-xs">
                  <input
                    type="radio"
                    name="replicationMode"
                    value="sync"
                    checked={replication.mode === 'sync'}
                    onChange={(e) => onChange('replication', {
                      ...replication,
                      mode: e.target.value,
                    })}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Sync</span> - 10x slower writes!
                    Strong consistency, no data loss.
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sharding */}
      <div className="p-3 border border-gray-200 rounded-lg">
        <label className="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            checked={sharding.enabled}
            onChange={(e) => onChange('sharding', {
              ...sharding,
              enabled: e.target.checked,
            })}
            className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900">
              Enable Sharding
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Horizontal partitioning for massive scale. Split data across multiple databases.
            </p>
          </div>
        </label>

        {sharding.enabled && (
          <div className="ml-6 space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Number of Shards
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={sharding.shards}
                onChange={(e) => onChange('sharding', {
                  ...sharding,
                  shards: parseInt(e.target.value),
                })}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Shard Key
              </label>
              <input
                type="text"
                value={sharding.shardKey}
                onChange={(e) => onChange('sharding', {
                  ...sharding,
                  shardKey: e.target.value,
                })}
                placeholder="e.g., user_id, region"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                How to distribute data across shards (e.g., hash(user_id))
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Storage Configuration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Storage Type
        </label>
        <select
          value={storageType}
          onChange={(e) => onChange('storageType', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="gp3">gp3 - General Purpose SSD (Recommended)</option>
          <option value="gp2">gp2 - General Purpose SSD (Legacy)</option>
          <option value="io1">io1 - Provisioned IOPS SSD (High performance)</option>
          <option value="io2">io2 - Provisioned IOPS SSD (Highest durability)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Storage Size: {storageSizeGB} GB
        </label>
        <input
          type="range"
          min="20"
          max="1000"
          step="10"
          value={storageSizeGB}
          onChange={(e) => onChange('storageSizeGB', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>20 GB</span>
          <span>1000 GB</span>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-2">💰 Cost Breakdown</div>
        <div className="space-y-1 text-xs text-green-800">
          <div className="flex justify-between">
            <span>Instance ({instanceType}):</span>
            <span className="font-semibold">${baseCost}/mo</span>
          </div>
          {replication.enabled && (
            <div className="flex justify-between">
              <span>Replication ({replication.replicas} replicas):</span>
              <span className="font-semibold">+${replicationCost}/mo</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Storage ({storageSizeGB} GB {storageType}):</span>
            <span className="font-semibold">${(storageSizeGB * 0.115).toFixed(0)}/mo</span>
          </div>
          <div className="pt-2 border-t border-green-300 flex justify-between font-semibold">
            <span>Total:</span>
            <span className="text-green-900">${(totalCost + storageSizeGB * 0.115).toFixed(0)}/mo</span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {!replication.enabled && (
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

      {!primaryKey && (
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-xs font-medium text-orange-900 mb-1">
            ⚠️ No Primary Key Defined
          </div>
          <p className="text-xs text-orange-800">
            Define your primary key to optimize query performance and data access patterns.
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
// MongoDB Configuration
// ============================================================================

function MongoDBConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  const numShards = config.numShards || 3;
  const replicationFactor = config.replicationFactor || 3;
  const consistencyLevel = config.consistencyLevel || 'eventual';
  const cost = numShards * 100;

  const presets: ConfigPreset[] = [
    {
      name: 'Single Node',
      description: 'Dev/test only',
      config: { numShards: 1, replicationFactor: 1, consistencyLevel: 'eventual' },
      icon: '💰',
    },
    {
      name: 'Standard',
      description: 'Replica set',
      config: { numShards: 3, replicationFactor: 3, consistencyLevel: 'eventual' },
      icon: '⚖️',
    },
    {
      name: 'Sharded',
      description: 'High scale',
      config: { numShards: 5, replicationFactor: 3, consistencyLevel: 'eventual' },
      icon: '🚀',
    },
  ];

  const consistencyOptions = [
    { value: 'strong', label: 'Strong (majority read/write)', icon: '🔒' },
    { value: 'eventual', label: 'Eventual (fast, default)', icon: '⚡' },
    { value: 'causal', label: 'Causal (ordered)', icon: '📊' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">MongoDB Configuration</h3>

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

      {/* Shards */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Shards
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={numShards}
          onChange={(e) => onChange('numShards', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-blue-600">{numShards}</span>
          <div className="text-right">
            <div className="text-xs text-gray-500">Monthly Cost</div>
            <div className="text-sm font-semibold text-green-600">${cost}/mo</div>
          </div>
        </div>
      </div>

      {/* Replication Factor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Replication Factor
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={replicationFactor}
          onChange={(e) => onChange('replicationFactor', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-purple-600">{replicationFactor}</span>
          <span className="text-xs text-gray-500">
            Can tolerate {replicationFactor - 1} node failure{replicationFactor > 2 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Consistency Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Consistency Level
        </label>
        <div className="space-y-2">
          {consistencyOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                consistencyLevel === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="consistencyLevel"
                value={option.value}
                checked={consistencyLevel === option.value}
                onChange={(e) => onChange('consistencyLevel', e.target.value)}
                className="mr-3"
              />
              <span className="text-lg mr-2">{option.icon}</span>
              <span className="text-sm text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-1">
          📚 MongoDB Use Cases
        </div>
        <p className="text-xs text-green-800">
          Perfect for: User profiles, product catalogs, content management.
          Flexible schema allows rapid iteration. Not ideal for complex joins or transactions.
        </p>
      </div>

      {/* Consistency Explanation */}
      {consistencyLevel === 'strong' && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-xs font-medium text-yellow-900 mb-1">
            ⚠️ Strong Consistency
          </div>
          <p className="text-xs text-yellow-800">
            Reads/writes wait for majority quorum. Slower but guarantees latest data.
            Use for: Financial data, inventory counts.
          </p>
        </div>
      )}

      {consistencyLevel === 'eventual' && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-blue-900 mb-1">
            ⚡ Eventual Consistency
          </div>
          <p className="text-xs text-blue-800">
            Fast reads/writes, may return slightly stale data.
            Use for: Social feeds, dashboards, analytics.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Cassandra Configuration
// ============================================================================

function CassandraConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  const numNodes = config.numNodes || 3;
  const replicationFactor = config.replicationFactor || 3;
  const readQuorum = config.readQuorum || 2;
  const writeQuorum = config.writeQuorum || 2;
  const cost = 200 + (numNodes - 1) * 150;

  // Check consistency
  const isStronglyConsistent = readQuorum + writeQuorum > replicationFactor;

  const presets: ConfigPreset[] = [
    {
      name: 'ONE (Fast)',
      description: 'Eventual consistency',
      config: { numNodes: 3, replicationFactor: 3, readQuorum: 1, writeQuorum: 1 },
      icon: '⚡',
    },
    {
      name: 'QUORUM',
      description: 'Balanced (common)',
      config: { numNodes: 3, replicationFactor: 3, readQuorum: 2, writeQuorum: 2 },
      icon: '⚖️',
    },
    {
      name: 'ALL (Safe)',
      description: 'Strong consistency',
      config: { numNodes: 3, replicationFactor: 3, readQuorum: 3, writeQuorum: 3 },
      icon: '🔒',
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Cassandra Configuration</h3>

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
              <div className="text-xs text-gray-500 mt-1">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Consistency Formula Explanation */}
      <div className={`p-4 rounded-lg border-2 ${
        isStronglyConsistent
          ? 'bg-green-50 border-green-500'
          : 'bg-yellow-50 border-yellow-500'
      }`}>
        <div className="text-sm font-semibold mb-2">
          {isStronglyConsistent ? '✅ Strong Consistency' : '⚠️ Eventual Consistency'}
        </div>
        <div className="text-xs space-y-1">
          <div className="font-mono">
            R={readQuorum} + W={writeQuorum} {isStronglyConsistent ? '>' : '≤'} N={replicationFactor}
          </div>
          <div className="text-gray-700">
            {isStronglyConsistent
              ? 'All reads see latest write (slower, consistent)'
              : 'Reads may be stale (faster, eventually consistent)'
            }
          </div>
        </div>
      </div>

      {/* Number of Nodes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Nodes
        </label>
        <input
          type="range"
          min="3"
          max="10"
          value={numNodes}
          onChange={(e) => onChange('numNodes', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-blue-600">{numNodes}</span>
          <div className="text-right">
            <div className="text-xs text-gray-500">Monthly Cost</div>
            <div className="text-sm font-semibold text-green-600">${cost}/mo</div>
          </div>
        </div>
      </div>

      {/* Replication Factor (N) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Replication Factor (N)
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={replicationFactor}
          onChange={(e) => onChange('replicationFactor', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-purple-600">{replicationFactor}</span>
          <span className="text-xs text-gray-500">Total copies of each row</span>
        </div>
      </div>

      {/* Read Quorum (R) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Read Quorum (R)
        </label>
        <input
          type="range"
          min="1"
          max={replicationFactor}
          value={Math.min(readQuorum, replicationFactor)}
          onChange={(e) => onChange('readQuorum', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-indigo-600">{readQuorum}</span>
          <span className="text-xs text-gray-500">Replicas must respond for read</span>
        </div>
      </div>

      {/* Write Quorum (W) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Write Quorum (W)
        </label>
        <input
          type="range"
          min="1"
          max={replicationFactor}
          value={Math.min(writeQuorum, replicationFactor)}
          onChange={(e) => onChange('writeQuorum', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-pink-600">{writeQuorum}</span>
          <span className="text-xs text-gray-500">Replicas must ack write</span>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-xs font-medium text-blue-900 mb-1">
          💡 Interview Tip
        </div>
        <p className="text-xs text-blue-800">
          <strong>R + W &gt; N = Strong Consistency</strong><br />
          For N=3, use R=2, W=2 (QUORUM) for balanced consistency and availability.
          Can tolerate {replicationFactor - Math.max(readQuorum, writeQuorum)} node failure(s).
        </p>
      </div>

      {/* Use Cases */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-1">
          📚 Cassandra Use Cases
        </div>
        <p className="text-xs text-green-800">
          Perfect for: IoT time-series, logging, high write throughput.
          Leaderless architecture = high availability. Not ideal for complex queries or transactions.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Message Queue Configuration
// ============================================================================

function MessageQueueConfig({ config, onChange, onApplyPreset }: ConfigProps) {
  const numBrokers = config.numBrokers || 3;
  const numPartitions = config.numPartitions || 10;
  const replicationFactor = config.replicationFactor || 3;
  const semantics = config.semantics || 'at_least_once';
  const orderingGuarantee = config.orderingGuarantee || 'partition';
  const cost = numBrokers * 100;

  const presets: ConfigPreset[] = [
    {
      name: 'Minimal',
      description: 'Single broker',
      config: { numBrokers: 1, numPartitions: 3, replicationFactor: 1 },
      icon: '💰',
    },
    {
      name: 'Standard',
      description: 'HA cluster',
      config: { numBrokers: 3, numPartitions: 10, replicationFactor: 3 },
      icon: '⚖️',
    },
    {
      name: 'High Throughput',
      description: 'Scaled for load',
      config: { numBrokers: 5, numPartitions: 20, replicationFactor: 3 },
      icon: '🚀',
    },
  ];

  const semanticsOptions = [
    { value: 'at_most_once', label: 'At-Most-Once (may lose)', icon: '⚡' },
    { value: 'at_least_once', label: 'At-Least-Once (may dup)', icon: '⚖️' },
    { value: 'exactly_once', label: 'Exactly-Once (slow)', icon: '🔒' },
  ];

  const orderingOptions = [
    { value: 'none', label: 'No Ordering (fastest)', icon: '⚡' },
    { value: 'partition', label: 'Per-Partition (common)', icon: '⚖️' },
    { value: 'global', label: 'Global Order (slow)', icon: '🔒' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-gray-900">Message Queue Configuration</h3>

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
              <div className="text-xs text-gray-500 mt-1">
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Number of Brokers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Brokers
        </label>
        <input
          type="range"
          min="1"
          max="7"
          value={numBrokers}
          onChange={(e) => onChange('numBrokers', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-blue-600">{numBrokers}</span>
          <div className="text-right">
            <div className="text-xs text-gray-500">Monthly Cost</div>
            <div className="text-sm font-semibold text-green-600">${cost}/mo</div>
          </div>
        </div>
      </div>

      {/* Number of Partitions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Partitions
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={numPartitions}
          onChange={(e) => onChange('numPartitions', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-purple-600">{numPartitions}</span>
          <span className="text-xs text-gray-500">
            Throughput: ~{(numPartitions * 10000).toLocaleString()} msg/sec
          </span>
        </div>
      </div>

      {/* Replication Factor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Replication Factor
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={replicationFactor}
          onChange={(e) => onChange('replicationFactor', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-2xl font-bold text-indigo-600">{replicationFactor}</span>
          <span className="text-xs text-gray-500">
            Can tolerate {replicationFactor - 1} broker failure{replicationFactor > 2 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Delivery Semantics */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Semantics
        </label>
        <div className="space-y-2">
          {semanticsOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                semantics === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="semantics"
                value={option.value}
                checked={semantics === option.value}
                onChange={(e) => onChange('semantics', e.target.value)}
                className="mr-3"
              />
              <span className="text-lg mr-2">{option.icon}</span>
              <span className="text-sm text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ordering Guarantee */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ordering Guarantee
        </label>
        <div className="space-y-2">
          {orderingOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                orderingGuarantee === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="orderingGuarantee"
                value={option.value}
                checked={orderingGuarantee === option.value}
                onChange={(e) => onChange('orderingGuarantee', e.target.value)}
                className="mr-3"
              />
              <span className="text-lg mr-2">{option.icon}</span>
              <span className="text-sm text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Semantics Explanation */}
      {semantics === 'exactly_once' && (
        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-xs font-medium text-yellow-900 mb-1">
            ⚠️ Exactly-Once Semantics
          </div>
          <p className="text-xs text-yellow-800">
            Slowest but guarantees no duplicates. Use for: payments, inventory updates.
            Requires idempotent consumers.
          </p>
        </div>
      )}

      {semantics === 'at_least_once' && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs font-medium text-blue-900 mb-1">
            ℹ️ At-Least-Once Semantics
          </div>
          <p className="text-xs text-blue-800">
            Most common. May deliver duplicates on retry.
            Use for: emails, notifications (duplicates annoying but not critical).
          </p>
        </div>
      )}

      {/* Use Cases */}
      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="text-xs font-medium text-green-900 mb-1">
          📚 Message Queue Use Cases
        </div>
        <p className="text-xs text-green-800">
          Perfect for: Async processing, decoupling services, buffering spikes, event streaming.
          Kafka = high throughput. RabbitMQ = complex routing.
        </p>
      </div>

      {/* Interview Tip */}
      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="text-xs font-medium text-purple-900 mb-1">
          💡 Interview Tip
        </div>
        <p className="text-xs text-purple-800">
          "I'd use Kafka with at-least-once semantics and partition-level ordering.
          For payments, I'd upgrade to exactly-once to prevent double-charging."
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
    postgresql: 'Relational Database (ACID)',
    mongodb: 'Document Database (NoSQL)',
    cassandra: 'Wide-Column Store (AP System)',
    redis: 'In-Memory Cache',
    message_queue: 'Message Queue (Kafka/RabbitMQ)',
    cdn: 'Content Delivery Network',
    s3: 'Object Storage',
  };
  return labels[type] || type;
}
