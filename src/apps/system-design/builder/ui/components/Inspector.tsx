import { Node } from 'reactflow';
import { SystemGraph } from '../../types/graph';

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instances
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
              Number of app server instances
            </p>
          </div>
        )}

        {component.type === 'postgresql' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Read Capacity (ops/sec)
              </label>
              <input
                type="number"
                min="100"
                max="10000"
                step="100"
                value={component.config.readCapacity || 1000}
                onChange={(e) =>
                  handleChange('readCapacity', parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Write Capacity (ops/sec)
              </label>
              <input
                type="number"
                min="100"
                max="10000"
                step="100"
                value={component.config.writeCapacity || 1000}
                onChange={(e) =>
                  handleChange('writeCapacity', parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={component.config.replication || false}
                  onChange={(e) => handleChange('replication', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable Replication
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6">
                Adds fault tolerance (survives DB failures)
              </p>
            </div>
          </>
        )}

        {component.type === 'redis' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Memory Size (GB)
              </label>
              <input
                type="number"
                min="1"
                max="64"
                value={component.config.memorySizeGB || 4}
                onChange={(e) =>
                  handleChange('memorySizeGB', parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                value={component.config.ttl || 60}
                onChange={(e) => handleChange('ttl', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                Percentage of requests served from cache
              </p>
            </div>
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
