/**
 * Request Types for Traffic Flow Simulation
 * Represents individual requests flowing through the system
 */

/**
 * Request type (read vs write)
 */
export type RequestType = 'read' | 'write';

/**
 * Request flowing through the system
 */
export interface Request {
  id: string;
  type: RequestType;
  startTime: number; // ms
  sizeMB?: number; // for CDN/S3 requests

  // Track the path this request has taken
  path: string[]; // component IDs

  // Accumulated metrics
  latency: number; // ms
  failed: boolean;
  failureReason?: string;
}

/**
 * Request batch (group of similar requests)
 */
export interface RequestBatch {
  type: RequestType;
  count: number;
  avgSizeMB?: number;
}

/**
 * Flow through a connection
 */
export interface ConnectionFlow {
  from: string;
  to: string;
  requestsPerSecond: number;
  type: RequestType;
}

/**
 * Component processing result
 */
export interface ProcessingResult {
  success: boolean;
  latencyMs: number;
  errorReason?: string;

  // For cache/CDN: whether request continues downstream
  passthrough?: boolean;

  // For load balancers: which downstream node to send to
  nextNodeId?: string;
}

/**
 * Traffic flow visualization data
 */
export interface FlowVisualization {
  // Requests per second on each connection
  connectionFlows: ConnectionFlow[];

  // Success rate per component
  componentSuccessRates: Map<string, number>;

  // Paths taken by requests (read vs write)
  readPaths: string[][];
  writePaths: string[][];

  // Failed requests and why
  failures: Array<{
    requestId: string;
    failedAt: string; // component ID
    reason: string;
  }>;
}
