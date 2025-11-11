interface ComponentPaletteProps {
  availableComponents: string[];
  onAddComponent: (componentType: string) => void;
}

const COMPONENT_INFO: Record<string, { icon: string; label: string; category: string }> = {
  client: { icon: '👤', label: 'Client', category: 'Traffic Source' },
  load_balancer: { icon: '🌐', label: 'Load Balancer', category: 'Network' },
  app_server: { icon: '📦', label: 'App Server', category: 'Compute' },
  postgresql: { icon: '💾', label: 'PostgreSQL', category: 'Storage' },
  redis: { icon: '⚡', label: 'Redis Cache', category: 'Cache' },
  cdn: { icon: '🌍', label: 'CDN', category: 'Network' },
  s3: { icon: '☁️', label: 'S3', category: 'Storage' },
};

export function ComponentPalette({
  availableComponents,
  onAddComponent,
}: ComponentPaletteProps) {
  // Group components by category
  const componentsByCategory = availableComponents.reduce((acc, comp) => {
    const category = COMPONENT_INFO[comp]?.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(comp);
    return acc;
  }, {} as Record<string, string[]>);

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
                const info = COMPONENT_INFO[comp];
                return (
                  <button
                    key={comp}
                    onClick={() => onAddComponent(comp)}
                    className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors border border-gray-200 hover:border-blue-300 flex items-center gap-2"
                  >
                    <span className="text-lg">{info.icon}</span>
                    <span>{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {availableComponents.length === 0 && (
        <div className="text-sm text-gray-400 text-center py-8">
          Select a challenge to see available components
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="font-medium">💡 Tip:</p>
          <p>Click components to add them to the canvas. Connect them by dragging from one to another.</p>
        </div>
      </div>
    </div>
  );
}
