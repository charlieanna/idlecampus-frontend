import { useState, useCallback, useEffect, useRef } from 'react';
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
  NodeTypes,
  EdgeTypes,
  MarkerType,
  ReactFlowInstance,
} from 'reactflow';
import { SystemGraph } from '../../types/graph';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';

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

// Register custom edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Default edge style (for all connections - simple arrow from source to target)
const defaultEdgeOptions = {
  type: 'custom',
  animated: false, // Disable animation to avoid confusion with direction
  style: { stroke: '#3b82f6', strokeWidth: 2 },
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
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showCanvasTips, setShowCanvasTips] = useState(() => {
    // Check localStorage for user preference
    const stored = localStorage.getItem('showCanvasTips');
    return stored === null ? true : stored === 'true';
  });
  const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Handle dismissing canvas tips
  const dismissCanvasTips = useCallback(() => {
    setShowCanvasTips(false);
    localStorage.setItem('showCanvasTips', 'false');
  }, []);

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
        const isClient = comp.type === 'client';

        // Count total number of clients in the entire system (including existing ones)
        const totalClientsBeforeThis = systemGraph.components
          .filter(c => c.type === 'client' && systemGraph.components.indexOf(c) < systemGraph.components.indexOf(comp))
          .length;

        return {
          id: comp.id,
          type: 'custom',
          position: isClient
            ? {
                x: 50,
                y: 150 + (totalClientsBeforeThis * 120) // Stack clients vertically with 120px spacing
              }
            : {
                x: 300 + (currentNodes.length + index) * 40,
                y: 100 + (currentNodes.length + index) * 25,
              },
          draggable: !isClient, // Client is not draggable
          selectable: isClient, // Client is selectable (for info, but locked position)
          data: {
            label: componentInfo.label,
            displayName: comp.config?.displayName || componentInfo.displayName,
            subtitle: comp.config?.subtitle || componentInfo.subtitle,
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

  // Sync edges with systemGraph connections
  useEffect(() => {
    const newEdges: Edge[] = systemGraph.connections.map((conn) => ({
      id: `${conn.from}-${conn.to}`,
      source: conn.from,
      target: conn.to,
      ...defaultEdgeOptions,
      data: { connectionType: conn.type },
    }));
    setEdges(newEdges);
  }, [systemGraph.connections, setEdges]);

  // Handle new connections
  const onConnect = useCallback(
    (connection: Connection) => {
      // Arrow direction follows the drag direction exactly
      // User drags FROM source TO target → arrow points source → target
      // Traffic flows in the direction of the arrow
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
    [systemGraph, onSystemGraphChange]
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

  // Capture ReactFlow instance when it initializes
  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstanceRef.current = instance;
  }, []);

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDraggingOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  // Handle drop
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDraggingOver(false);

      const componentType = event.dataTransfer.getData('application/reactflow');

      if (!componentType || !reactFlowWrapper.current || !reactFlowInstanceRef.current) {
        return;
      }

      // Get the position relative to the ReactFlow canvas
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstanceRef.current.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create new component with the drop position
      const id = `${componentType}_${Date.now()}`;
      const componentInfo = getComponentInfo(componentType);

      const newComponent = {
        id,
        type: componentType as any,
        config: getDefaultConfig(componentType),
      };

      // Update system graph
      onSystemGraphChange({
        ...systemGraph,
        components: [...systemGraph.components, newComponent],
      });

      // Manually add node at drop position (will be synced by useEffect but this is faster)
      setNodes((nds) => [
        ...nds,
        {
          id,
          type: 'custom',
          position,
          data: {
            label: componentInfo.label,
            displayName: componentInfo.displayName,
            subtitle: componentInfo.subtitle,
            componentType: componentType,
          },
        },
      ]);
    },
    [systemGraph, onSystemGraphChange, setNodes]
  );

  return (
    <div
      ref={reactFlowWrapper}
      className={`flex-1 w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 relative transition-all ${
        isDraggingOver ? 'ring-4 ring-blue-400 ring-inset' : ''
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {showCanvasTips && (
        <div className="absolute top-3 left-3 z-20 max-w-xs rounded-md border border-slate-200 bg-white/90 p-3 text-[11px] leading-snug text-slate-600 shadow-sm backdrop-blur">
          <div className="flex items-start justify-between mb-1">
            <div className="font-semibold text-slate-700">Canvas Tips</div>
            <button
              onClick={dismissCanvasTips}
              className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Dismiss tips"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full border border-white bg-green-500 shadow-sm" />
            <span>Start connections here — source handle</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full border border-white bg-blue-500 shadow-sm" />
            <span>Finish connections here — target handle</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">
            Drag from a green dot to a blue dot. The arrow shows the flow direction (source → target).
          </div>
        </div>
      )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={onInit}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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
    database: {
      label: '💾 Database',
      displayName: 'Database',
      subtitle: 'SQL or NoSQL data store',
    },
    cache: {
      label: '⚡ Cache',
      displayName: 'Cache',
      subtitle: 'In-memory cache layer',
    },
    message_queue: {
      label: '📮 Queue',
      displayName: 'Message Queue',
      subtitle: 'Kafka/RabbitMQ',
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
    database: {
      databaseType: 'postgresql',
      dbCategory: 'sql',
      readCapacity: 1000,
      writeCapacity: 1000,
      replication: { enabled: false, replicas: 0 },
      storageSizeGB: 50,
    },
    cache: {
      cacheType: 'redis',
      memorySizeGB: 4,
      ttl: 3600,
      hitRatio: 0.9,
      strategy: 'cache_aside',
    },
    message_queue: {
      numBrokers: 3,
      numPartitions: 10,
      replicationFactor: 3,
      retentionHours: 24,
      semantics: 'at_least_once',
      orderingGuarantee: 'partition',
      batchingEnabled: true,
      compressionEnabled: true,
    },
    cdn: { enabled: true },
    s3: { storageSizeGB: 100 },
  };
  return defaults[type] || {};
}
