import { useState, useCallback, useEffect } from 'react';
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
import { SystemGraph } from '../../types/graph';
import CustomNode from './CustomNode';

interface DesignCanvasProps {
  systemGraph: SystemGraph;
  onSystemGraphChange: (graph: SystemGraph) => void;
  selectedNode: Node | null;
  onNodeSelect: (node: Node | null) => void;
  onAddComponent: (componentType: string) => void;
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;
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
  systemGraph,
  onSystemGraphChange,
  selectedNode,
  onNodeSelect,
  onAddComponent,
  onUpdateConfig,
}: DesignCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync nodes with systemGraph components
  useEffect(() => {
    setNodes((currentNodes) => {
      const existingNodeIds = new Set(currentNodes.map((n) => n.id));
      const componentIds = new Set(systemGraph.components.map((c) => c.id));

      // Find new components that need nodes
      const newComponents = systemGraph.components.filter(
        (comp) => !existingNodeIds.has(comp.id)
      );

      // Create nodes for new components
      const newNodes: Node[] = newComponents.map((comp, index) => {
        const componentInfo = getComponentInfo(comp.type);
        return {
          id: comp.id,
          type: 'custom',
          position: {
            x: 250 + (currentNodes.length + index) * 50,
            y: 150 + (currentNodes.length + index) * 30,
          },
          data: {
            label: componentInfo.label,
            displayName: componentInfo.displayName,
            subtitle: componentInfo.subtitle,
            componentType: comp.type,
          },
        };
      });

      // Remove nodes for deleted components
      const remainingNodes = currentNodes.filter((node) =>
        componentIds.has(node.id)
      );

      // Return updated nodes if there are changes
      if (newNodes.length > 0 || remainingNodes.length !== currentNodes.length) {
        return [...remainingNodes, ...newNodes];
      }

      return currentNodes;
    });
  }, [systemGraph.components, setNodes]);

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
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
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
      </div>
    );
}

// Helper functions (exported for use by parent)
export function getComponentInfo(type: string): { label: string; displayName: string; subtitle: string } {
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

export function getDefaultConfig(type: string): Record<string, any> {
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
