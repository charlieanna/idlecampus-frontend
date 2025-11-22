/**
 * Pattern Transformer
 * 
 * Transforms a solution pattern (components + connections) into a SystemGraph
 * that can be used by the simulation engine.
 */

export function patternToGraph(pattern) {
  const nodes = [];
  const edges = [];

  // Create nodes
  pattern.components.forEach((comp, index) => {
    // Generate a unique ID if not provided
    // Use config.id if available, otherwise comp.id, otherwise generate one
    const id = comp.config?.id || comp.id || `${comp.type}_${index}`;
    
    nodes.push({
      id,
      type: comp.type,
      position: { x: index * 200, y: 100 }, // Simple layout
      config: comp.config || {},
    });
  });

  // Create edges
  pattern.connections.forEach((conn, index) => {
    // Find source and target nodes
    // This logic handles both "type-based" connections (connect all of type A to all of type B)
    // and "id-based" connections (connect specific node A to specific node B)
    
    const sourceNodes = nodes.filter(n => n.type === conn.from || n.id === conn.from);
    const targetNodes = nodes.filter(n => n.type === conn.to || n.id === conn.to);
    
    sourceNodes.forEach(source => {
      targetNodes.forEach(target => {
        // Avoid self-loops unless explicitly intended
        if (source.id !== target.id) {
          edges.push({
            id: `edge_${edges.length}`,
            source: source.id,
            target: target.id,
          });
        }
      });
    });
  });

  return {
    nodes,
    edges,
    // Add components and connections properties to match SystemGraph interface
    components: nodes,
    connections: edges.map(e => ({
      from: e.source,
      to: e.target,
      id: e.id
    }))
  };
}