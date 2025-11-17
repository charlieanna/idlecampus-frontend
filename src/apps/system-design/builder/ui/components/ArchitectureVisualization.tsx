import React from 'react';
import { ArchitectureChange } from '../../types/nfrWizard';
import { ComponentType } from '../../types/problemDefinition';

interface ArchitectureVisualizationProps {
  changes: ArchitectureChange[];
}

interface VisualComponent {
  id: string;
  type: ComponentType | 'client';
  label: string;
  count?: number;
}

interface VisualConnection {
  from: string;
  to: string;
}

export function ArchitectureVisualization({ changes }: ArchitectureVisualizationProps) {
  // Build the architecture from changes
  const components: VisualComponent[] = [
    { id: 'client', type: 'client', label: 'Client' },
  ];
  const connections: VisualConnection[] = [];
  const highlights: string[] = [];

  changes.forEach((change) => {
    if (change.action === 'add_component' && change.componentType) {
      const existingIdx = components.findIndex((c) => c.type === change.componentType);
      if (existingIdx >= 0) {
        // Update count if exists
        if (change.config?.count) {
          components[existingIdx].count = change.config.count;
        }
      } else {
        // Add new component
        components.push({
          id: change.componentType,
          type: change.componentType,
          label: getComponentLabel(change.componentType),
          count: change.config?.count,
        });
      }
    }

    if (change.action === 'add_connection' && change.from && change.to) {
      const connExists = connections.some(
        (c) => c.from === change.from && c.to === change.to
      );
      if (!connExists) {
        connections.push({ from: change.from, to: change.to });
      }
    }

    if (change.action === 'highlight') {
      highlights.push(change.reason);
    }
  });

  if (components.length === 1 && highlights.length === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          Answer questions to see your architecture evolve!
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        📐 Your Architecture (Auto-Generated)
      </h3>

      {/* Component Flow Diagram */}
      <div className="space-y-3 mb-4">
        {components.map((component, idx) => {
          const nextComponent = components[idx + 1];
          const hasConnection =
            nextComponent &&
            connections.some(
              (c) =>
                (c.from === component.id || c.from === component.type) &&
                (c.to === nextComponent.id || c.to === nextComponent.type)
            );

          return (
            <div key={component.id}>
              {/* Component Box */}
              <div
                className={`p-3 rounded-lg border-2 ${getComponentStyle(component.type)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getComponentIcon(component.type)}</span>
                    <span className="font-medium text-sm">{component.label}</span>
                  </div>
                  {component.count && component.count > 1 && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded">
                      × {component.count}
                    </span>
                  )}
                </div>
              </div>

              {/* Connection Arrow */}
              {hasConnection && (
                <div className="flex justify-center py-1">
                  <div className="text-gray-400 text-xl">↓</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Highlights/Explanations */}
      {highlights.length > 0 && (
        <div className="space-y-2">
          {highlights.map((highlight, idx) => (
            <div
              key={idx}
              className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <p className="text-xs text-yellow-900">💡 {highlight}</p>
            </div>
          ))}
        </div>
      )}

      {/* Architecture Summary */}
      {components.length > 1 && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="text-xs text-blue-900">
            <span className="font-semibold">Components:</span>{' '}
            {components.length - 1} (excluding client)
          </div>
          <div className="text-xs text-blue-900 mt-1">
            <span className="font-semibold">Connections:</span> {connections.length}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getComponentLabel(type: ComponentType | 'client'): string {
  const labels: Record<string, string> = {
    client: 'Client',
    compute: 'App Servers',
    storage: 'Database',
    cache: 'Cache',
    load_balancer: 'Load Balancer',
    message_queue: 'Message Queue',
    object_storage: 'Object Storage',
    cdn: 'CDN',
    realtime_messaging: 'Real-time Messaging',
  };
  return labels[type] || type;
}

function getComponentIcon(type: ComponentType | 'client'): string {
  const icons: Record<string, string> = {
    client: '👤',
    compute: '🖥️',
    storage: '💾',
    cache: '⚡',
    load_balancer: '⚖️',
    message_queue: '📬',
    object_storage: '📦',
    cdn: '🌐',
    realtime_messaging: '💬',
  };
  return icons[type] || '📦';
}

function getComponentStyle(type: ComponentType | 'client'): string {
  const styles: Record<string, string> = {
    client: 'bg-gray-100 border-gray-300',
    compute: 'bg-blue-100 border-blue-400',
    storage: 'bg-green-100 border-green-400',
    cache: 'bg-purple-100 border-purple-400',
    load_balancer: 'bg-orange-100 border-orange-400',
    message_queue: 'bg-yellow-100 border-yellow-400',
    object_storage: 'bg-pink-100 border-pink-400',
    cdn: 'bg-indigo-100 border-indigo-400',
    realtime_messaging: 'bg-teal-100 border-teal-400',
  };
  return styles[type] || 'bg-gray-100 border-gray-300';
}
