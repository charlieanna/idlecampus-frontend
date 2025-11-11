/**
 * Component Metrics returned by simulation
 */
export interface ComponentMetrics {
  latency: number; // milliseconds
  errorRate: number; // 0-1
  utilization: number; // 0-1
  cost: number; // monthly cost in dollars

  // Optional component-specific metrics
  cacheHits?: number;
  cacheMisses?: number;
  dbLoad?: number;
  downtime?: number; // seconds
  [key: string]: any;
}

/**
 * Traffic input to component
 */
export interface Traffic {
  rps: number; // requests per second
  readRps?: number;
  writeRps?: number;
  avgResponseSizeMB?: number; // for CDN/S3
}

/**
 * Simulation context (for failure injection, etc.)
 */
export interface SimulationContext {
  testCase?: any;
  currentTime?: number; // seconds into simulation
}

/**
 * Component types
 */
export type ComponentType =
  | 'client'
  | 'load_balancer'
  | 'app_server'
  | 'postgresql'
  | 'redis'
  | 'cdn'
  | 's3';

/**
 * Component configuration (user-defined)
 */
export interface ComponentConfig {
  [key: string]: any;
}

/**
 * Component representation in the graph
 */
export interface ComponentNode {
  id: string;
  type: ComponentType;
  config: ComponentConfig;
}
