import { useMemo, useState, useRef, useEffect } from 'react';
import { isDatabaseComponentType } from '../../utils/database';

interface ComponentPaletteProps {
  availableComponents: string[];
  onAddComponent: (componentType: string, config?: any) => void;
}

const COMPONENT_INFO: Record<string, { icon: string; label: string; category: string }> = {
  client: { icon: '👤', label: 'Client', category: 'Traffic Source' },
  load_balancer: { icon: '🌐', label: 'Load Balancer', category: 'Network' },
  app_server: { icon: '📦', label: 'App Server', category: 'Compute' },

  // Data Layer
  database: { icon: '💾', label: 'Database', category: 'Data Storage' },
  cache: { icon: '⚡', label: 'Cache', category: 'Data Storage' },

  // Message Queue
  message_queue: { icon: '📮', label: 'Message Queue', category: 'Queue' },

  // CDN & Storage
  cdn: { icon: '🌍', label: 'CDN', category: 'Content Delivery' },
  s3: { icon: '☁️', label: 'Object Storage', category: 'File Storage' },
};

const DATA_MODELS = [
  { value: 'relational', label: 'Relational', icon: '💾', desc: 'ACID, JOINs' },
  { value: 'document', label: 'Document', icon: '📄', desc: 'Flexible schema' },
  { value: 'wide-column', label: 'Wide-Column', icon: '📊', desc: 'Time-series' },
  { value: 'graph', label: 'Graph', icon: '🔗', desc: 'Connections' },
  { value: 'key-value', label: 'Key-Value', icon: '🔑', desc: 'Simple lookups' },
];

export function ComponentPalette({
  availableComponents,
  onAddComponent,
}: ComponentPaletteProps) {
  const [draggingComponent, setDraggingComponent] = useState<string | null>(null);
  const [showDataModelDropdown, setShowDataModelDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const normalizedComponents = useMemo(() => {
    const normalized = availableComponents.map((comp) =>
      isDatabaseComponentType(comp) ? 'database' : comp
    );
    return Array.from(new Set(normalized));
  }, [availableComponents]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDataModelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group components by category
  const componentsByCategory = normalizedComponents.reduce((acc, comp) => {
    const category = COMPONENT_INFO[comp]?.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(comp);
    return acc;
  }, {} as Record<string, string[]>);

  const handleDragStart = (event: React.DragEvent, componentType: string) => {
    event.dataTransfer.setData('application/reactflow', componentType);
    event.dataTransfer.effectAllowed = 'move';
    setDraggingComponent(componentType);
  };

  const handleDragEnd = () => {
    setDraggingComponent(null);
  };

  const handleComponentClick = (componentType: string) => {
    if (componentType === 'database') {
      setShowDataModelDropdown(true);
    } else {
      onAddComponent(componentType);
    }
  };

  const handleDataModelSelect = (dataModel: string) => {
    onAddComponent('database', { dataModel });
    setShowDataModelDropdown(false);
  };

  return (
    <div className="w-56 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
        Components
      </h2>

      <div className="space-y-4">
        {Object.entries(componentsByCategory).map(([category, components]) => (
          <div key={category}>
            <h3 className="text-xs font-medium text-gray-500 mb-2">{category}</h3>
            <div className="space-y-1">
              {components.map((comp) => {
                const info = COMPONENT_INFO[comp] || {
                  icon: '🧩',
                  label: comp
                    .replace(/_/g, ' ')
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (c) => c.toUpperCase()),
                  category,
                };
                const isDragging = draggingComponent === comp;
                return (
                  <div key={comp} className="relative">
                    <button
                      draggable
                      onDragStart={(e) => handleDragStart(e, comp)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleComponentClick(comp)}
                      className={`w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-all border border-gray-200 hover:border-blue-300 flex items-center gap-2 cursor-move ${
                        isDragging ? 'opacity-50 scale-95' : ''
                      }`}
                      title="Click to add or drag to canvas"
                    >
                      <span className="text-lg">{info.icon}</span>
                      <span>{info.label}</span>
                    </button>

                    {/* Data Model Dropdown for Database */}
                    {comp === 'database' && showDataModelDropdown && (
                      <div
                        ref={dropdownRef}
                        className="absolute left-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                      >
                        <div className="p-2">
                          <div className="text-xs font-semibold text-gray-700 mb-2 px-2">
                            Select Data Model:
                          </div>
                          {DATA_MODELS.map((model) => (
                            <button
                              key={model.value}
                              onClick={() => handleDataModelSelect(model.value)}
                              className="w-full px-2 py-2 text-left text-sm rounded hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors"
                            >
                              <span className="text-lg">{model.icon}</span>
                              <div className="flex-1">
                                <div className="font-medium">{model.label}</div>
                                <div className="text-xs text-gray-500">{model.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {normalizedComponents.length === 0 && (
        <div className="text-sm text-gray-400 text-center py-8">
          Select a challenge to see available components
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">💡 Tip:</p>
          <p>Drag components to the canvas or click to add them. Connect components by dragging from one to another.</p>
        </div>
      </div>
    </div>
  );
}
