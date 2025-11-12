import { memo } from 'react';
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
};

function CustomNode({ data, selected }: NodeProps) {
  const componentType = data.componentType || 'app_server';
  const style = COMPONENT_STYLES[componentType] || COMPONENT_STYLES.app_server;
  const displayName = data.displayName || data.label;
  const isClient = componentType === 'client';

  return (
    <div
      className={`px-1.5 py-1 rounded border shadow-sm transition-all min-w-[70px] ${
        style.bgColor
      } ${style.borderColor} ${
        selected ? 'ring-2 ring-blue-500 ring-offset-1 shadow-md' : 'hover:shadow-md'
      } ${isClient ? 'cursor-default' : ''}`}
    >
      {/* Input Handle (Top) - Hidden for client since it's the source */}
      {!isClient && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-1.5 h-1.5 !bg-blue-500 !border !border-white"
        />
      )}

      {/* Node Content */}
      <div className="flex items-center gap-1">
        <span className="text-sm">{style.icon}</span>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-[10px] ${style.color} truncate flex items-center gap-0.5`}>
            {displayName}
            {isClient && <span className="text-[8px]">🔒</span>}
          </div>
          {data.subtitle && (
            <div className="text-[8px] text-gray-500 truncate">{data.subtitle}</div>
          )}
        </div>
      </div>

      {/* Output Handle (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-1.5 h-1.5 !bg-green-500 !border !border-white"
      />

      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-1.5 h-1.5 !bg-blue-500 !border !border-white"
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-1.5 h-1.5 !bg-green-500 !border !border-white"
      />
    </div>
  );
}

export default memo(CustomNode);
