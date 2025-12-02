import { Node } from 'reactflow';
import { SystemGraph } from '../../types/graph';
import { ComponentPalette } from './ComponentPalette';
import { EnhancedInspector } from './EnhancedInspector';

interface RightSidebarProps {
  availableComponents: string[];
  onAddComponent: (componentType: string) => void;
  selectedNode: Node | null;
  systemGraph: SystemGraph;
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;
  onBackToPalette: () => void;
  availableAPIs?: string[];
}

export function RightSidebar({
  availableComponents,
  onAddComponent,
  selectedNode,
  systemGraph,
  onUpdateConfig,
  onBackToPalette,
  availableAPIs = [],
}: RightSidebarProps) {
  // Show Inspector when a node is selected, otherwise show ComponentPalette
  if (selectedNode) {
    return (
      <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col">
        {/* Back Button */}
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <button
            onClick={onBackToPalette}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Components</span>
          </button>
        </div>

        {/* Inspector */}
        <div className="flex-1 overflow-y-auto">
          <EnhancedInspector
            selectedNode={selectedNode}
            systemGraph={systemGraph}
            onUpdateConfig={onUpdateConfig}
            availableAPIs={availableAPIs}
          />
        </div>
      </div>
    );
  }

  // Show ComponentPalette by default
  return (
    <ComponentPalette
      availableComponents={availableComponents}
      onAddComponent={onAddComponent}
    />
  );
}
