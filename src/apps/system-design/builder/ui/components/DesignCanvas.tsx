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

// Default edge style (for all connections - simple straight arrow from source to target)
const defaultEdgeOptions = {
  type: 'custom',
  animated: false, // Disable animation to avoid confusion with direction
  style: { stroke: '#3b82f6', strokeWidth: 3 }, // Thicker line for better visibility
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

  // Counter for default positioning of new components (no auto-layout)
  const nextPositionRef = useRef({ x: 150, y: 100 });

  // Sync nodes with systemGraph components
  useEffect(() => {
    setNodes((currentNodes) => {
      const existingNodeIds = new Set(currentNodes.map((n) => n.id));
      const componentIds = new Set(systemGraph.components.map((c) => c.id));

      // Simple positioning - just place new components in a grid, no auto-layout
      const getNextPosition = (): { x: number; y: number } => {
        const pos = { ...nextPositionRef.current };
        // Move to next position (simple grid)
        nextPositionRef.current.x += 150;
        if (nextPositionRef.current.x > 600) {
          nextPositionRef.current.x = 150;
          nextPositionRef.current.y += 120;
        }
        return pos;
      };

      // Find new components that need nodes
      const newComponents = systemGraph.components.filter(
        (comp) => !existingNodeIds.has(comp.id)
      );

      // Create nodes for new components
      const newNodes: Node[] = newComponents.map((comp) => {
        const componentInfo = getComponentInfo(comp.type);

        // Use stored position from config, or get next grid position
        const storedPosition = comp.config?.position;
        const position = storedPosition
          ? { x: storedPosition.x, y: storedPosition.y }
          : getNextPosition();

        return {
          id: comp.id,
          type: 'custom',
          position,
          draggable: true, // All components are draggable
          selectable: true,
          data: {
            label: componentInfo.label,
            displayName: comp.config?.displayName || componentInfo.displayName,
            subtitle: comp.config?.subtitle || componentInfo.subtitle,
            componentType: comp.type,
            config: comp.config,
            onUpdateConfig: (newConfig: Record<string, any>) => onUpdateConfig(comp.id, newConfig),
          },
        };
      });

      // Update existing nodes: preserve position, only update data (NEVER recalculate position)
      const updatedNodes = currentNodes.map((node) => {
        const component = systemGraph.components.find(c => c.id === node.id);
        if (!component) return null;

        const componentInfo = getComponentInfo(component.type);

        return {
          ...node,
          // ALWAYS keep existing position - never recalculate
          position: node.position,
          data: {
            ...node.data,
            label: componentInfo.label,
            displayName: component.config?.displayName || componentInfo.displayName,
            subtitle: component.config?.subtitle || componentInfo.subtitle,
            componentType: component.type,
            config: component.config,
            onUpdateConfig: (newConfig: Record<string, any>) => onUpdateConfig(component.id, newConfig),
          },
        };
      }).filter(node => node !== null) as Node[];

      // Return updated nodes if there are changes
      const allNodes = [...updatedNodes, ...newNodes];

      if (newNodes.length > 0 || updatedNodes.length !== currentNodes.length) {
        return allNodes;
      }

      return updatedNodes;
    });
  }, [systemGraph.components, setNodes, onUpdateConfig]);

  // Sync edges with systemGraph connections
  useEffect(() => {
    // Deduplicate connections and create unique edge IDs
    const seenConnections = new Set<string>();
    const newEdges: Edge[] = [];
    
    systemGraph.connections.forEach((conn) => {
      // Create a unique key for this connection (include type to allow multiple connection types between same components)
      const connectionKey = `${conn.from}-${conn.to}-${conn.type}`;
      
      // Only add if we haven't seen this exact connection before
      if (!seenConnections.has(connectionKey)) {
        seenConnections.add(connectionKey);
        newEdges.push({
          id: connectionKey, // Use connectionKey as unique ID
          source: conn.from,
          target: conn.to,
          ...defaultEdgeOptions,
          data: { connectionType: conn.type },
        });
      }
    });
    
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

  // Handle node drag end - save position to component config
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Update component config with new position
      const component = systemGraph.components.find(c => c.id === node.id);
      if (component) {
        onUpdateConfig(node.id, {
          ...component.config,
          position: { x: node.position.x, y: node.position.y },
        });
      }
    },
    [systemGraph.components, onUpdateConfig]
  );

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

      // Create new component with the drop position stored in config
      const id = `${componentType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const componentInfo = getComponentInfo(componentType);
      const defaultConfig = getDefaultConfig(componentType);

      // Store position in component config so it persists across re-renders
      const newComponent = {
        id,
        type: componentType as any,
        config: {
          ...defaultConfig,
          position: { x: position.x, y: position.y }, // Store position in config
        },
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
          draggable: true, // Allow dragging for all components
          selectable: true,
          data: {
            label: componentInfo.label,
            displayName: componentInfo.displayName,
            subtitle: componentInfo.subtitle,
            componentType: componentType,
            config: newComponent.config,
            onUpdateConfig: (newConfig: Record<string, any>) => {
              // This will be set up properly by the useEffect sync
            },
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
          onNodeDragStop={onNodeDragStop}
          onPaneClick={onPaneClick}
          onInit={onInit}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 3 }}
          connectionLineType="straight"
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
      subtitle: 'Async messaging',
    },
    cdn: {
      label: '🌍 CDN',
      displayName: 'CDN',
      subtitle: 'Content delivery',
    },
    s3: {
      label: '☁️ Storage',
      displayName: 'Object Storage',
      subtitle: 'Object storage',
    },
  };
  return info[type] || { label: type, displayName: type, subtitle: '' };
}

export function getDefaultConfig(type: string): Record<string, any> {
  const defaults: Record<string, Record<string, any>> = {
    client: {},
    load_balancer: { algorithm: 'round_robin' },
    app_server: { 
      instances: 1,
      instanceType: 'commodity-app',
    },
    database: {
      instanceType: 'commodity-db',
      dataModel: 'relational',
      replicationMode: 'single-leader',
      replication: { enabled: false, replicas: 0, mode: 'async' },
      sharding: { enabled: false, shards: 1, shardKey: '' },
      isolationLevel: 'read-committed',
      consistency: 'strong',
      indexType: 'b-tree',
      storageType: 'gp3',
      storageSizeGB: 100,
      // Legacy fields for backward compatibility
      databaseType: 'postgresql',
      dbCategory: 'sql',
    },
    postgresql: {
      instanceType: 'commodity-db',
      replicationMode: 'single-leader',
      replication: { enabled: false, replicas: 0, mode: 'async' },
      sharding: { enabled: false, shards: 1, shardKey: '' },
      isolationLevel: 'read-committed',
      storageType: 'gp3',
      storageSizeGB: 100,
    },
    cache: {
      cacheType: 'redis',
      memorySizeGB: 4,
      ttl: 3600,
      hitRatio: 0.9,
      strategy: 'cache_aside',
    },
    redis: {
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
