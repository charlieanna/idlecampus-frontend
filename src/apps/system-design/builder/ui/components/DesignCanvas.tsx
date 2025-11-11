import { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  NodeTypes,
  MarkerType,
} from 'reactflow';
import { Challenge } from '../../types/testCase';
import { SystemGraph } from '../../types/graph';
import { TestResult } from '../../types/testCase';
import { ComponentPalette } from './ComponentPalette';
import { Inspector } from './Inspector';
import { ResultsPanel } from './ResultsPanel';
import CustomNode from './CustomNode';

interface DesignCanvasProps {
  challenge: Challenge | null;
  systemGraph: SystemGraph;
  onSystemGraphChange: (graph: SystemGraph) => void;
  testResults: TestResult[] | null;
}

// Register custom node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Default edge style
const defaultEdgeOptions = {
  animated: true,
  style: { stroke: '#3b82f6', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#3b82f6',
  },
};

export function DesignCanvas({
  challenge,
  systemGraph,
  onSystemGraphChange,
  testResults,
}: DesignCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, ...defaultEdgeOptions }, eds));

      // Update system graph
      const newConnection = {
        from: connection.source!,
        to: connection.target!,
        type: 'read_write' as const,
      };

      onSystemGraphChange({
        ...systemGraph,
        connections: [...systemGraph.connections, newConnection],
      });
    },
    [systemGraph, onSystemGraphChange, setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    []
  );

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Add component to canvas
  const handleAddComponent = useCallback(
    (componentType: string) => {
      const id = `${componentType}_${Date.now()}`;
      const position = {
        x: 250 + nodes.length * 50,
        y: 150 + nodes.length * 30,
      };

      const componentInfo = getComponentInfo(componentType);

      const newNode: Node = {
        id,
        type: 'custom',
        position,
        data: {
          label: componentInfo.label,
          displayName: componentInfo.displayName,
          subtitle: componentInfo.subtitle,
          componentType,
        },
      };

      setNodes((nds) => [...nds, newNode]);

      // Update system graph
      const newComponent = {
        id,
        type: componentType as any,
        config: getDefaultConfig(componentType),
      };

      onSystemGraphChange({
        ...systemGraph,
        components: [...systemGraph.components, newComponent],
      });
    },
    [systemGraph, onSystemGraphChange, setNodes, nodes.length]
  );

  // Update component config
  const handleUpdateConfig = useCallback(
    (nodeId: string, config: Record<string, any>) => {
      const updatedComponents = systemGraph.components.map((comp) =>
        comp.id === nodeId ? { ...comp, config: { ...comp.config, ...config } } : comp
      );

      onSystemGraphChange({
        ...systemGraph,
        components: updatedComponents,
      });
    },
    [systemGraph, onSystemGraphChange]
  );

  return (
    <div className="flex-1 flex">
      {/* Left Sidebar - Component Palette */}
      <ComponentPalette
        availableComponents={challenge?.availableComponents || []}
        onAddComponent={handleAddComponent}
      />

      {/* Center - Canvas */}
      <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2 }}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.5}
            color="#cbd5e1"
          />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(node) => {
              const type = node.data.componentType || 'app_server';
              const colors: Record<string, string> = {
                client: '#6b7280',
                load_balancer: '#3b82f6',
                app_server: '#8b5cf6',
                postgresql: '#6366f1',
                redis: '#ef4444',
                cdn: '#10b981',
                s3: '#f97316',
              };
              return colors[type] || '#8b5cf6';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>

        {/* Instructions Overlay */}
        {challenge && nodes.length === 0 && (
          <div className="absolute top-6 left-6 right-6 max-w-2xl">
            <div className="bg-white border-2 border-blue-200 rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎯</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">{challenge.description}</p>

                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <div className="text-gray-600 font-medium">Traffic</div>
                        <div className="text-blue-700 font-semibold">{challenge.requirements.traffic}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 font-medium">Latency</div>
                        <div className="text-blue-700 font-semibold">{challenge.requirements.latency}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 font-medium">Budget</div>
                        <div className="text-blue-700 font-semibold">{challenge.requirements.budget}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-green-800 mb-2">
                      ✨ How to use:
                    </div>
                    <ol className="text-xs text-green-700 space-y-1 ml-4 list-decimal">
                      <li>Click components on the left to add them to the canvas</li>
                      <li>Drag from the <span className="text-green-600 font-semibold">green dot</span> on a component to the <span className="text-blue-600 font-semibold">blue dot</span> on another to connect them</li>
                      <li>Click a component to configure it in the right panel</li>
                      <li>Click "Run Simulation" to test your design!</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Connection Instructions (when components exist but no connections) */}
        {nodes.length > 0 && edges.length === 0 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-lg shadow-lg px-4 py-3 max-w-md">
              <div className="flex items-center gap-3">
                <div className="text-2xl">💡</div>
                <div className="text-sm">
                  <div className="font-semibold text-amber-900">Connect your components!</div>
                  <div className="text-amber-700">
                    Drag from a <span className="text-green-600 font-semibold">green</span> dot to a <span className="text-blue-600 font-semibold">blue</span> dot to create connections
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Inspector / Results */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {testResults ? (
          <ResultsPanel
            results={testResults}
            challenge={challenge}
            onClose={() => {}}
          />
        ) : (
          <Inspector
            selectedNode={selectedNode}
            systemGraph={systemGraph}
            onUpdateConfig={handleUpdateConfig}
          />
        )}
      </div>
    </div>
  );
}

// Helper functions
function getComponentInfo(type: string): { label: string; displayName: string; subtitle: string } {
  const info: Record<string, { label: string; displayName: string; subtitle: string }> = {
    client: {
      label: '👤 Client',
      displayName: 'Client',
      subtitle: 'Traffic source',
    },
    load_balancer: {
      label: '🌐 Load Balancer',
      displayName: 'Load Balancer',
      subtitle: 'Distributes traffic',
    },
    app_server: {
      label: '📦 App Server',
      displayName: 'App Server',
      subtitle: 'Handles requests',
    },
    postgresql: {
      label: '💾 PostgreSQL',
      displayName: 'PostgreSQL',
      subtitle: 'Relational DB',
    },
    redis: {
      label: '⚡ Redis',
      displayName: 'Redis Cache',
      subtitle: 'In-memory cache',
    },
    cdn: {
      label: '🌍 CDN',
      displayName: 'CDN',
      subtitle: 'Content delivery',
    },
    s3: {
      label: '☁️ S3',
      displayName: 'S3 Storage',
      subtitle: 'Object storage',
    },
  };
  return info[type] || { label: type, displayName: type, subtitle: '' };
}

function getDefaultConfig(type: string): Record<string, any> {
  const defaults: Record<string, Record<string, any>> = {
    client: {},
    load_balancer: {},
    app_server: { instances: 1 },
    postgresql: { readCapacity: 1000, writeCapacity: 1000, replication: false },
    redis: { memorySizeGB: 4, ttl: 60, hitRatio: 0.9 },
    cdn: { enabled: true },
    s3: { storageSizeGB: 100 },
  };
  return defaults[type] || {};
}
