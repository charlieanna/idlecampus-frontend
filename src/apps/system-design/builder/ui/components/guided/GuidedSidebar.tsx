import React from 'react';
import { GuidedStep } from '../../../types/guidedTutorial';

interface GuidedSidebarProps {
  currentStep: GuidedStep | null;
  onDragStart: (componentType: string) => void;
}

/**
 * Component definitions with metadata
 */
const COMPONENTS = [
  {
    type: 'app_server',
    name: 'App Server',
    icon: '🖥️',
    description: 'Process API requests and business logic',
    category: 'compute',
  },
  {
    type: 'postgresql',
    name: 'PostgreSQL',
    icon: '💾',
    description: 'Relational database for structured data',
    category: 'storage',
  },
  {
    type: 'redis',
    name: 'Redis',
    icon: '💨',
    description: 'In-memory cache for fast reads',
    category: 'cache',
  },
  {
    type: 's3',
    name: 'S3 Storage',
    icon: '📦',
    description: 'Object storage for files and media',
    category: 'object_storage',
  },
  {
    type: 'cdn',
    name: 'CDN',
    icon: '🌐',
    description: 'Content delivery network for static assets',
    category: 'cdn',
  },
  {
    type: 'load_balancer',
    name: 'Load Balancer',
    icon: '⚖️',
    description: 'Distribute traffic across servers',
    category: 'load_balancer',
  },
  {
    type: 'message_queue',
    name: 'Message Queue',
    icon: '📬',
    description: 'Async messaging between services',
    category: 'message_queue',
  },
];

/**
 * Normalize component type for matching
 */
function normalizeType(type: string): string {
  const normalizations: Record<string, string[]> = {
    'compute': ['compute', 'app_server'],
    'storage': ['storage', 'postgresql', 'database'],
    'cache': ['cache', 'redis'],
    'object_storage': ['object_storage', 's3'],
  };

  for (const [normalized, types] of Object.entries(normalizations)) {
    if (types.includes(type)) return normalized;
  }
  return type;
}

/**
 * Check if a component is relevant to the current step
 */
function isRelevantToStep(componentCategory: string, step: GuidedStep | null): boolean {
  if (!step) return true; // Show all if no step

  // Support both new structure (practicePhase) and legacy structure (teaching)
  const componentsNeeded = step.practicePhase?.componentsNeeded || step.teaching?.componentsNeeded || [];
  const neededTypes = componentsNeeded.map(c => normalizeType(c.type));
  return neededTypes.includes(normalizeType(componentCategory));
}

export function GuidedSidebar({ currentStep, onDragStart }: GuidedSidebarProps) {
  // Split components into suggested and other
  const suggestedComponents = currentStep
    ? COMPONENTS.filter(c => isRelevantToStep(c.category, currentStep))
    : [];
  const otherComponents = currentStep
    ? COMPONENTS.filter(c => !isRelevantToStep(c.category, currentStep))
    : COMPONENTS;

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Components</h3>
        <p className="text-xs text-gray-500 mt-1">
          Drag components onto the canvas
        </p>
      </div>

      {/* Scrollable component list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Suggested for this step */}
        {suggestedComponents.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-1">
              <span>✨</span> Suggested for this step
            </h4>
            <div className="space-y-2">
              {suggestedComponents.map(component => (
                <DraggableComponent
                  key={component.type}
                  component={component}
                  onDragStart={onDragStart}
                  highlighted
                />
              ))}
            </div>
          </div>
        )}

        {/* Other components */}
        {otherComponents.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {suggestedComponents.length > 0 ? 'Other Components' : 'All Components'}
            </h4>
            <div className="space-y-2">
              {otherComponents.map(component => (
                <DraggableComponent
                  key={component.type}
                  component={component}
                  onDragStart={onDragStart}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Help footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Tip:</span> Drag a component to the canvas,
          then click and drag between components to create connections.
        </p>
      </div>
    </div>
  );
}

interface DraggableComponentProps {
  component: {
    type: string;
    name: string;
    icon: string;
    description: string;
  };
  onDragStart: (componentType: string) => void;
  highlighted?: boolean;
}

function DraggableComponent({
  component,
  onDragStart,
  highlighted = false,
}: DraggableComponentProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('componentType', component.type);
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(component.type);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`
        p-3 rounded-lg border cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:shadow-md
        ${highlighted
          ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
          : 'bg-white border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-start gap-2">
        <span className="text-xl flex-shrink-0">{component.icon}</span>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${highlighted ? 'text-blue-900' : 'text-gray-900'}`}>
            {component.name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
            {component.description}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Export individual component for use elsewhere
 */
export { DraggableComponent };
