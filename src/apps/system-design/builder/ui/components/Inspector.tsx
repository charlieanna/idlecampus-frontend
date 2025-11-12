import { Node } from 'reactflow';
import { SystemGraph } from '../../types/graph';
import {
  EC2_INSTANCES,
  RDS_INSTANCES,
  REDIS_INSTANCES,
  InstanceSpec,
} from '../../types/instanceTypes';

interface InspectorProps {
  selectedNode: Node | null;
  systemGraph: SystemGraph;
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;
}

export function Inspector({
  selectedNode,
  systemGraph,
  onUpdateConfig,
}: InspectorProps) {
  if (!selectedNode) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Inspector</h2>
        <p className="text-sm text-gray-500">
          Select a component to configure its properties
        </p>
      </div>
    );
  }

  const component = systemGraph.components.find((c) => c.id === selectedNode.id);
  if (!component) return null;

  const handleChange = (key: string, value: any) => {
    onUpdateConfig(selectedNode.id, { [key]: value });
  };

  return (
    <div className="p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {selectedNode.data.label}
      </h2>

      <div className="space-y-4">
        {component.type === 'app_server' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instance Type
              </label>
              <select
                value={component.config.instanceType || 't3.medium'}
                onChange={(e) => handleChange('instanceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="T3 - Burstable (Cheap, Variable Load)">
                  <option value="t3.micro">t3.micro - 2 vCPU, 1GB RAM, 100 RPS ($8/mo)</option>
                  <option value="t3.small">t3.small - 2 vCPU, 2GB RAM, 250 RPS ($15/mo)</option>
                  <option value="t3.medium">t3.medium - 2 vCPU, 4GB RAM, 500 RPS ($30/mo)</option>
                </optgroup>
                <optgroup label="M5 - General Purpose (Production)">
                  <option value="m5.large">m5.large - 2 vCPU, 8GB RAM, 1000 RPS ($70/mo)</option>
                  <option value="m5.xlarge">m5.xlarge - 4 vCPU, 16GB RAM, 2000 RPS ($140/mo)</option>
                  <option value="m5.2xlarge">m5.2xlarge - 8 vCPU, 32GB RAM, 4000 RPS ($280/mo)</option>
                </optgroup>
                <optgroup label="C5 - Compute Optimized (High CPU)">
                  <option value="c5.large">c5.large - 2 vCPU, 4GB RAM, 1500 RPS ($62/mo)</option>
                  <option value="c5.xlarge">c5.xlarge - 4 vCPU, 8GB RAM, 3000 RPS ($124/mo)</option>
                </optgroup>
              </select>
              {component.config.instanceType && EC2_INSTANCES[component.config.instanceType] && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                  <div className="font-medium text-blue-900 mb-1">Instance Specs:</div>
                  <div className="text-blue-700 space-y-0.5">
                    <div>• {EC2_INSTANCES[component.config.instanceType].vcpu} vCPU</div>
                    <div>• {EC2_INSTANCES[component.config.instanceType].memoryGB}GB RAM</div>
                    <div>• {EC2_INSTANCES[component.config.instanceType].networkGbps}Gbps network</div>
                    <div>• ~{EC2_INSTANCES[component.config.instanceType].requestsPerSecond} RPS capacity</div>
                    <div>• ${(EC2_INSTANCES[component.config.instanceType].costPerHour * 730).toFixed(0)}/month</div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Instances
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={component.config.instances || 1}
                onChange={(e) => handleChange('instances', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                For high availability, use 2+ instances
              </p>
            </div>
          </>
        )}

        {component.type === 'postgresql' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instance Type
              </label>
              <select
                value={component.config.instanceType || 'db.t3.medium'}
                onChange={(e) => handleChange('instanceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="T3 - Burstable (Dev/Testing)">
                  <option value="db.t3.micro">db.t3.micro - 2 vCPU, 1GB RAM, 50 RPS ($13/mo)</option>
                  <option value="db.t3.small">db.t3.small - 2 vCPU, 2GB RAM, 100 RPS ($26/mo)</option>
                  <option value="db.t3.medium">db.t3.medium - 2 vCPU, 4GB RAM, 200 RPS ($53/mo)</option>
                </optgroup>
                <optgroup label="M5 - General Purpose (Production)">
                  <option value="db.m5.large">db.m5.large - 2 vCPU, 8GB RAM, 500 RPS ($133/mo)</option>
                  <option value="db.m5.xlarge">db.m5.xlarge - 4 vCPU, 16GB RAM, 1000 RPS ($266/mo)</option>
                  <option value="db.m5.2xlarge">db.m5.2xlarge - 8 vCPU, 32GB RAM, 2000 RPS ($533/mo)</option>
                </optgroup>
              </select>
              {component.config.instanceType && RDS_INSTANCES[component.config.instanceType] && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                  <div className="font-medium text-blue-900 mb-1">Instance Specs:</div>
                  <div className="text-blue-700 space-y-0.5">
                    <div>• {RDS_INSTANCES[component.config.instanceType].vcpu} vCPU</div>
                    <div>• {RDS_INSTANCES[component.config.instanceType].memoryGB}GB RAM</div>
                    <div>• {RDS_INSTANCES[component.config.instanceType].storageIOPS} IOPS</div>
                    <div>• ~{RDS_INSTANCES[component.config.instanceType].requestsPerSecond} RPS capacity</div>
                    <div>• ${(RDS_INSTANCES[component.config.instanceType].costPerHour * 730).toFixed(0)}/month</div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Database Engine
              </label>
              <select
                value={component.config.engine || 'postgresql'}
                onChange={(e) => handleChange('engine', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="postgresql">PostgreSQL - ACID, complex queries</option>
                <option value="mysql">MySQL - Popular, proven</option>
                <option value="mongodb">MongoDB - NoSQL, flexible schema</option>
                <option value="cassandra">Cassandra - High write throughput</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Isolation Level
              </label>
              <select
                value={component.config.isolationLevel || 'read-committed'}
                onChange={(e) => handleChange('isolationLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="read-uncommitted">Read Uncommitted (Fastest, Least Safe)</option>
                <option value="read-committed">Read Committed (Default, Good Balance)</option>
                <option value="repeatable-read">Repeatable Read (Slower, More Consistent)</option>
                <option value="serializable">Serializable (Slowest, Fully Consistent)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Trade-off: Consistency vs Performance
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={component.config.replication?.enabled || false}
                  onChange={(e) => {
                    const replication = component.config.replication || {};
                    handleChange('replication', {
                      ...replication,
                      enabled: e.target.checked,
                      replicas: replication.replicas || 1,
                      mode: replication.mode || 'async',
                    });
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable Replication
                </span>
              </label>

              {component.config.replication?.enabled && (
                <div className="ml-6 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Number of Replicas
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={component.config.replication?.replicas || 1}
                      onChange={(e) => {
                        const replication = component.config.replication || {};
                        handleChange('replication', {
                          ...replication,
                          replicas: parseInt(e.target.value),
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Replication Mode
                    </label>
                    <select
                      value={component.config.replication?.mode || 'async'}
                      onChange={(e) => {
                        const replication = component.config.replication || {};
                        handleChange('replication', {
                          ...replication,
                          mode: e.target.value,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="async">Async (Fast, may lose recent writes)</option>
                      <option value="sync">Sync (Slow, strong consistency)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Async is 10x faster but eventual consistency
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Type
              </label>
              <select
                value={component.config.storageType || 'gp3'}
                onChange={(e) => handleChange('storageType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gp3">gp3 - SSD (Best balance)</option>
                <option value="io2">io2 - High Performance SSD</option>
                <option value="magnetic">Magnetic - Cheap, slow</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Size (GB)
              </label>
              <input
                type="number"
                min="20"
                max="1000"
                step="10"
                value={component.config.storageSizeGB || 100}
                onChange={(e) => handleChange('storageSizeGB', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {component.type === 'redis' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instance Type
              </label>
              <select
                value={component.config.instanceType || 'cache.t3.small'}
                onChange={(e) => handleChange('instanceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="T3 - Burstable (Dev/Testing)">
                  <option value="cache.t3.micro">cache.t3.micro - 0.5GB RAM, 10K RPS ($12/mo)</option>
                  <option value="cache.t3.small">cache.t3.small - 1.4GB RAM, 25K RPS ($25/mo)</option>
                </optgroup>
                <optgroup label="M5 - General Purpose">
                  <option value="cache.m5.large">cache.m5.large - 6.4GB RAM, 50K RPS ($99/mo)</option>
                </optgroup>
                <optgroup label="R5 - Memory Optimized">
                  <option value="cache.r5.large">cache.r5.large - 13GB RAM, 75K RPS ($137/mo)</option>
                </optgroup>
              </select>
              {component.config.instanceType && REDIS_INSTANCES[component.config.instanceType] && (
                <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                  <div className="font-medium text-blue-900 mb-1">Instance Specs:</div>
                  <div className="text-blue-700 space-y-0.5">
                    <div>• {REDIS_INSTANCES[component.config.instanceType].vcpu} vCPU</div>
                    <div>• {REDIS_INSTANCES[component.config.instanceType].memoryGB}GB RAM</div>
                    <div>• ~{REDIS_INSTANCES[component.config.instanceType].requestsPerSecond.toLocaleString()} RPS capacity</div>
                    <div>• ${(REDIS_INSTANCES[component.config.instanceType].costPerHour * 730).toFixed(0)}/month</div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cache Engine
              </label>
              <select
                value={component.config.engine || 'redis'}
                onChange={(e) => handleChange('engine', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="redis">Redis - Rich data structures, persistence</option>
                <option value="memcached">Memcached - Simple, no persistence</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Eviction Policy
              </label>
              <select
                value={component.config.evictionPolicy || 'lru'}
                onChange={(e) => handleChange('evictionPolicy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lru">LRU - Least Recently Used</option>
                <option value="lfu">LFU - Least Frequently Used</option>
                <option value="ttl">TTL - Time To Live</option>
                <option value="random">Random Eviction</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                How to remove items when cache is full
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TTL (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="3600"
                step="10"
                value={component.config.ttl || 3600}
                onChange={(e) => handleChange('ttl', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                How long to keep cached items
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Hit Ratio
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={component.config.hitRatio || 0.9}
                onChange={(e) => handleChange('hitRatio', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span className="font-medium text-blue-600">
                  {((component.config.hitRatio || 0.9) * 100).toFixed(0)}%
                </span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                % of requests served from cache (higher = less DB load)
              </p>
            </div>

            {component.config.engine === 'redis' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Persistence (Redis Only)
                </label>
                <select
                  value={component.config.persistence || 'rdb'}
                  onChange={(e) => handleChange('persistence', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">None - Fastest, lose data on restart</option>
                  <option value="rdb">RDB - Periodic snapshots (good balance)</option>
                  <option value="aof">AOF - Write log (most durable)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Trade-off: Speed vs Durability
                </p>
              </div>
            )}
          </>
        )}

        {component.type === 's3' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Storage Size (GB)
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={component.config.storageSizeGB || 100}
              onChange={(e) =>
                handleChange('storageSizeGB', parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {component.type === 'cdn' && (
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={component.config.enabled !== false}
                onChange={(e) => handleChange('enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Enable CDN
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Serves static content from edge locations (95% hit ratio)
            </p>
          </div>
        )}

        {component.type === 'load_balancer' && (
          <div className="text-sm text-gray-500">
            <p>Load balancer has fixed configuration in MVP.</p>
            <p className="mt-2">
              <strong>Capacity:</strong> 100,000 RPS
            </p>
            <p>
              <strong>Cost:</strong> $50/month
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">Component ID:</p>
          <p className="font-mono bg-gray-100 p-1 rounded">{component.id}</p>
        </div>
      </div>
    </div>
  );
}
