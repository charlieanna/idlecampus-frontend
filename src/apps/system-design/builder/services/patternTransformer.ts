import { SystemGraph } from '../types/graph';

/**
 * Pattern Transformer
 * 
 * Transforms a solution pattern (components + connections) into a SystemGraph
 * that can be used by the simulation engine.
 */

export function patternToGraph(pattern: any): SystemGraph {
  const components: any[] = [];
  const connections: any[] = [];

  // Create components
  pattern.components.forEach((comp: any, index: number) => {
    // Generate a unique ID if not provided
    // Use config.id if available, otherwise comp.id, otherwise generate one
    const id = comp.config?.id || comp.id || `${comp.type}_${index}`;
    
    components.push({
      id,
      type: comp.type,
      position: { x: index * 200, y: 100 }, // Simple layout
      config: comp.config || {},
    });
  });

  // Create connections
  pattern.connections.forEach((conn: any, index: number) => {
    // Find source and target nodes
    // This logic handles both "type-based" connections (connect all of type A to all of type B)
    // and "id-based" connections (connect specific node A to specific node B)
    
    const sourceNodes = components.filter(n => n.type === conn.from || n.id === conn.from);
    const targetNodes = components.filter(n => n.type === conn.to || n.id === conn.to);
    
    sourceNodes.forEach(source => {
      targetNodes.forEach(target => {
        // Avoid self-loops unless explicitly intended
        if (source.id !== target.id) {
          connections.push({
            id: `edge_${connections.length}`,
            from: source.id,
            to: target.id,
            type: 'read_write' // Default type
          });
        }
      });
    });
  });

  return {
    components,
    connections
  };
}