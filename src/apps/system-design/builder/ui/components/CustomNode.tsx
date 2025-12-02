import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const COMPONENT_STYLES: Record<string, { icon: string; color: string; bgColor: string; borderColor: string }> = {
  client: {
    icon: '👤',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300'
  },
  load_balancer: {
    icon: '🌐',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300'
  },
  app_server: {
    icon: '📦',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300'
  },
  database: {
    icon: '💾',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300'
  },
  cache: {
    icon: '⚡',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300'
  },
  message_queue: {
    icon: '📮',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300'
  },
  cdn: {
    icon: '🌍',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300'
  },
  s3: {
    icon: '☁️',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300'
  },
  // Legacy database types (for backward compatibility)
  postgresql: {
    icon: '💾',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300'
  },
  redis: {
    icon: '⚡',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300'
  },
};

const DATA_MODEL_BADGES: Record<string, { label: string; color: string }> = {
  relational: { label: 'SQL', color: 'bg-blue-100 text-blue-700' },
  document: { label: 'DOC', color: 'bg-green-100 text-green-700' },
  'wide-column': { label: 'COL', color: 'bg-purple-100 text-purple-700' },
  graph: { label: 'GRAPH', color: 'bg-orange-100 text-orange-700' },
  'key-value': { label: 'KV', color: 'bg-red-100 text-red-700' },
};

function CustomNode({ data, selected }: NodeProps) {
  const componentType = data.componentType || 'app_server';
  const style = COMPONENT_STYLES[componentType] || COMPONENT_STYLES.app_server;
  const displayName = data.displayName || data.label;
  const isClient = componentType === 'client';
  const [showContextMenu, setShowContextMenu] = useState(false);

  // Get database configuration if this is a database
  const isDatabase = componentType === 'database';
  const dataModel = data.config?.dataModel || 'relational';
  const replicationStrategy = data.config?.replicationStrategy || 'single-leader';
  const replicas = data.config?.replicas || 2;
  const isSharded = data.config?.partitioningEnabled || false;

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isDatabase) {
      e.preventDefault();
      setShowContextMenu(true);
    }
  };

  return (
    <div
      className={`px-2 py-1.5 rounded-lg border-2 shadow-sm transition-all w-[100px] max-w-[100px] ${style.bgColor
        } ${style.borderColor} ${selected ? 'ring-2 ring-blue-500 ring-offset-1 shadow-md' : 'hover:shadow-md'
        } ${isClient ? 'cursor-default' : ''} relative`}
      onContextMenu={handleContextMenu}
    >
      {/* Input Handle (Top) - Hidden for client since it's the source */}
      {!isClient && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-2 h-2 !bg-blue-500 !border !border-white"
        />
      )}

      {/* Node Content */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{style.icon}</span>
          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-xs ${style.color} truncate flex items-center gap-0.5`}>
              {displayName}
              {isClient && <span className="text-[10px]">🔒</span>}
            </div>
          </div>
        </div>

        {/* Database Configuration Display */}
        {isDatabase && (
          <div className="flex flex-wrap gap-0.5">
            {DATA_MODEL_BADGES[dataModel] && (
              <span className={`text-[10px] px-1 py-0.5 rounded font-medium ${DATA_MODEL_BADGES[dataModel].color}`}>
                {DATA_MODEL_BADGES[dataModel].label}
              </span>
            )}
            {replicas > 1 && (
              <span className="text-[10px] px-1 py-0.5 rounded bg-gray-100 text-gray-600">
                {replicas}R
              </span>
            )}
            {isSharded && (
              <span className="text-[10px] px-1 py-0.5 rounded bg-yellow-100 text-yellow-700">
                S
              </span>
            )}
          </div>
        )}

        {/* App Server API Display */}
        {componentType === 'app_server' && data.config?.handledAPIs && data.config.handledAPIs.length > 0 && (
          <div className="flex flex-wrap gap-0.5">
            {data.config.handledAPIs.slice(0, 2).map((api: string, index: number) => {
              const parts = api.trim().split(/\s+/);
              const method = parts.length > 1 ? parts[0] : '*';
              return (
                <span
                  key={index}
                  className="text-[10px] px-1 py-0.5 rounded bg-purple-100 text-purple-700 font-medium"
                  title={api}
                >
                  {method.substring(0, 3)}
                </span>
              );
            })}
            {data.config.handledAPIs.length > 2 && (
              <span className="text-[10px] px-1 py-0.5 rounded bg-gray-100 text-gray-600">
                +{data.config.handledAPIs.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Context Menu for Database */}
      {showContextMenu && isDatabase && (
        <div
          className="absolute top-full left-0 mt-1 z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[120px]"
          onMouseLeave={() => setShowContextMenu(false)}
        >
          <div className="px-2 py-1 text-[9px] font-semibold text-gray-500 border-b">
            Change Data Model
          </div>
          {Object.entries(DATA_MODEL_BADGES).map(([model, badge]) => (
            <button
              key={model}
              className="w-full px-2 py-1 text-[10px] text-left hover:bg-gray-50 flex items-center gap-1"
              onClick={() => {
                // Update the data model using the callback
                if (data.onUpdateConfig) {
                  data.onUpdateConfig({
                    ...data.config,
                    dataModel: model,
                  });
                }
                setShowContextMenu(false);
              }}
            >
              <span className={`px-1 rounded-sm ${badge.color} text-[7px]`}>
                {badge.label}
              </span>
              <span className="text-gray-700 capitalize">{model.replace('-', ' ')}</span>
            </button>
          ))}
        </div>
      )}

      {/* Output Handle (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 !bg-green-500 !border !border-white"
      />

      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-2 h-2 !bg-blue-500 !border !border-white"
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-2 h-2 !bg-green-500 !border !border-white"
      />
    </div>
  );
}

export default memo(CustomNode);
