import { useState, useCallback } from 'react';
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
} from 'reactflow';
import { Challenge } from '../../types/testCase';
import { SystemGraph } from '../../types/graph';
import { TestResult } from '../../types/testCase';
import { ComponentPalette } from './ComponentPalette';
import { Inspector } from './Inspector';
import { ResultsPanel } from './ResultsPanel';

interface DesignCanvasProps {
  challenge: Challenge | null;
  systemGraph: SystemGraph;
  onSystemGraphChange: (graph: SystemGraph) => void;
  testResults: TestResult[] | null;
}

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
      setEdges((eds) => addEdge(connection, eds));

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
        x: 250 + Math.random() * 200,
        y: 100 + Math.random() * 200,
      };

      const newNode: Node = {
        id,
        type: 'default',
        position,
        data: {
          label: getComponentLabel(componentType),
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
    [systemGraph, onSystemGraphChange, setNodes]
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
      <div className="flex-1 bg-gray-100 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* Challenge Info Overlay */}
        {challenge && nodes.length === 0 && (
          <div className="absolute top-4 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl">
            <h3 className="font-semibold text-blue-900 mb-2">
              {challenge.title}
            </h3>
            <p className="text-sm text-blue-700 mb-3">{challenge.description}</p>
            <div className="text-xs text-blue-600">
              <div><strong>Traffic:</strong> {challenge.requirements.traffic}</div>
              <div><strong>Latency:</strong> {challenge.requirements.latency}</div>
              <div><strong>Budget:</strong> {challenge.requirements.budget}</div>
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
function getComponentLabel(type: string): string {
  const labels: Record<string, string> = {
    load_balancer: '🌐 Load Balancer',
    app_server: '📦 App Server',
    postgresql: '💾 PostgreSQL',
    redis: '⚡ Redis Cache',
    cdn: '🌍 CDN',
    s3: '📦 S3',
  };
  return labels[type] || type;
}

function getDefaultConfig(type: string): Record<string, any> {
  const defaults: Record<string, Record<string, any>> = {
    load_balancer: {},
    app_server: { instances: 1 },
    postgresql: { readCapacity: 1000, writeCapacity: 1000, replication: false },
    redis: { memorySizeGB: 4, ttl: 60, hitRatio: 0.9 },
    cdn: { enabled: true },
    s3: { storageSizeGB: 100 },
  };
  return defaults[type] || {};
}
