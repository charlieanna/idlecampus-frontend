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

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 shadow-md transition-all min-w-[140px] ${
        style.bgColor
      } ${style.borderColor} ${
        selected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' : 'hover:shadow-lg'
      }`}
    >
      {/* Input Handle (Top) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
      />

      {/* Node Content */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{style.icon}</span>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm ${style.color} truncate`}>
            {displayName}
          </div>
          {data.subtitle && (
            <div className="text-xs text-gray-500 truncate">{data.subtitle}</div>
          )}
        </div>
      </div>

      {/* Output Handle (Bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-green-500 !border-2 !border-white"
      />

      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
      />

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-3 h-3 !bg-green-500 !border-2 !border-white"
      />
    </div>
  );
}

export default memo(CustomNode);
