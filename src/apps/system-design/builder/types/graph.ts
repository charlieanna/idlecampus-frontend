import { ComponentNode } from './component';

/**
 * Connection between components
 */
export interface Connection {
  from: string; // component ID
  to: string; // component ID
  type: 'read' | 'write' | 'read_write';
}

/**
 * System graph representing user's design
 */
export interface SystemGraph {
  components: ComponentNode[];
  connections: Connection[];
}

/**
 * Bottleneck identified in the system
 */
export interface Bottleneck {
  componentId: string;
  componentType: string;
  issue: string;
  utilization: number;
  recommendation: string;
}
