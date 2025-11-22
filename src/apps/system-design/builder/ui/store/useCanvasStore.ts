import { create } from 'zustand';
import { SystemGraph } from '../../types/graph';

interface CanvasState {
  // Canvas state
  systemGraph: SystemGraph;
  selectedNode: any | null;
  canvasCollapsed: boolean;
  
  // Inspector modal
  showInspectorModal: boolean;
  inspectorModalNodeId: string | null;
  
  // Actions
  setSystemGraph: (graph: SystemGraph) => void;
  updateSystemGraph: (updater: (graph: SystemGraph) => SystemGraph) => void;
  setSelectedNode: (node: any | null) => void;
  setCanvasCollapsed: (collapsed: boolean) => void;
  setShowInspectorModal: (show: boolean) => void;
  setInspectorModalNodeId: (nodeId: string | null) => void;
  addNode: (node: any) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: any) => void;
  addEdge: (edge: any) => void;
  removeEdge: (edgeId: string) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial state
  systemGraph: {
    nodes: [],
    edges: [],
  },
  selectedNode: null,
  canvasCollapsed: false,
  showInspectorModal: false,
  inspectorModalNodeId: null,
  
  // Actions
  setSystemGraph: (graph) => set({ systemGraph: graph }),
  
  updateSystemGraph: (updater) => set((state) => ({
    systemGraph: updater(state.systemGraph),
  })),
  
  setSelectedNode: (node) => set({ selectedNode: node }),
  
  setCanvasCollapsed: (collapsed) => set({ canvasCollapsed: collapsed }),
  
  setShowInspectorModal: (show) => set({ showInspectorModal: show }),
  
  setInspectorModalNodeId: (nodeId) => set({ inspectorModalNodeId: nodeId }),
  
  addNode: (node) => set((state) => ({
    systemGraph: {
      ...state.systemGraph,
      nodes: [...state.systemGraph.nodes, node],
    },
  })),
  
  removeNode: (nodeId) => set((state) => ({
    systemGraph: {
      nodes: state.systemGraph.nodes.filter((n) => n.id !== nodeId),
      edges: state.systemGraph.edges.filter(
        (e) => e.source !== nodeId && e.target !== nodeId
      ),
    },
  })),
  
  updateNode: (nodeId, updates) => set((state) => ({
    systemGraph: {
      ...state.systemGraph,
      nodes: state.systemGraph.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    },
  })),
  
  addEdge: (edge) => set((state) => ({
    systemGraph: {
      ...state.systemGraph,
      edges: [...state.systemGraph.edges, edge],
    },
  })),
  
  removeEdge: (edgeId) => set((state) => ({
    systemGraph: {
      ...state.systemGraph,
      edges: state.systemGraph.edges.filter((e) => e.id !== edgeId),
    },
  })),
}));

