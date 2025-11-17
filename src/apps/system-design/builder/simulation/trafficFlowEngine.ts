import { SystemGraph, Connection } from '../types/graph';
import { TestCase } from '../types/testCase';
import {
  Request,
  RequestType,
  ProcessingResult,
  FlowVisualization,
  ConnectionFlow,
} from '../types/request';
import { Component } from './components/Component';
import { SimulationContext } from '../types/component';
import {
  CycleAwareTraversalContext,
  detectCycles,
  validateGraphCycles,
  CycleDetectionResult,
} from './cycleDetection';
import { isEnabled, verboseLog } from './featureFlags';

/**
 * Traffic Flow Engine
 * Sends actual requests through the graph and traces their paths
 */
export class TrafficFlowEngine {
  private components: Map<string, Component> = new Map();
  private adjacency: Map<string, Connection[]> = new Map();
  private requestCounter = 0;
  private cycleDetectionResult: CycleDetectionResult | null = null;

  /**
   * Build graph from system design
   */
  buildGraph(graph: SystemGraph, componentInstances: Map<string, Component>): void {
    this.components = componentInstances;
    this.adjacency.clear();

    // Build adjacency list
    for (const conn of graph.connections || []) {
      const list = this.adjacency.get(conn.from) || [];
      list.push(conn);
      this.adjacency.set(conn.from, list);
    }

    // Perform cycle detection
    const adjacencyForCycles = new Map<string, { to: string; type: Connection['type'] }[]>();
    for (const [from, connections] of this.adjacency.entries()) {
      adjacencyForCycles.set(
        from,
        connections.map((c) => ({ to: c.to, type: c.type }))
      );
    }
    this.cycleDetectionResult = detectCycles(adjacencyForCycles);

    verboseLog('Graph built with cycle detection', {
      hasCycles: this.cycleDetectionResult.hasCycles,
      numCycles: this.cycleDetectionResult.cycles.length,
    });
  }

  /**
   * Get cycle detection results
   */
  getCycleDetectionResult(): CycleDetectionResult | null {
    return this.cycleDetectionResult;
  }

  /**
   * Validate that graph has valid paths for traffic
   */
  validateGraph(): { valid: boolean; errors: string[]; warnings?: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Find entry point (client, load_balancer, or app_server)
    const entryId =
      this.findNodeByType('client') ||
      this.findNodeByType('load_balancer') ||
      this.findNodeByType('app_server');

    if (!entryId) {
      errors.push('No entry point found (need client, load_balancer, or app_server)');
      return { valid: false, errors, warnings };
    }

    // Check if we can reach app server (if entry isn't app server itself)
    const appId = this.findNodeByType('app_server');
    if (!appId) {
      errors.push('No app server found - system cannot process requests');
      return { valid: false, errors, warnings };
    }

    // Only check path if entry is not the app server itself
    if (entryId !== appId) {
      const pathToApp = this.findPath(entryId, appId, 'read_write');
      if (!pathToApp) {
        errors.push('No path from entry point to app server - traffic cannot flow');
        return { valid: false, errors, warnings };
      }
    }

    // Check database connectivity (optional but warn if missing)
    const dbId = this.findNodeByType('postgresql');
    if (dbId) {
      const readPath = this.findPath(appId, dbId, 'read');
      const writePath = this.findPath(appId, dbId, 'write');

      if (!readPath && !writePath) {
        errors.push('No path from app server to database - data cannot be persisted');
      }
    }

    // Validate graph cycles
    if (this.cycleDetectionResult) {
      const adjacencyForValidation = new Map<string, { to: string; type: Connection['type'] }[]>();
      for (const [from, connections] of this.adjacency.entries()) {
        adjacencyForValidation.set(
          from,
          connections.map((c) => ({ to: c.to, type: c.type }))
        );
      }
      const cycleValidation = validateGraphCycles(adjacencyForValidation);

      if (!cycleValidation.valid) {
        // If cycles are not allowed, add as errors
        if (!isEnabled('ENABLE_GRAPH_CYCLES')) {
          errors.push(...cycleValidation.errors);
        } else {
          // If cycles are allowed, add as warnings
          warnings.push(...cycleValidation.errors);
        }
      }

      // Add cycle detection warnings
      if (this.cycleDetectionResult.warnings.length > 0) {
        warnings.push(...this.cycleDetectionResult.warnings);
      }
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  /**
   * Send traffic through the graph and trace paths
   */
  sendTraffic(
    testCase: TestCase,
    context: SimulationContext
  ): {
    requests: Request[];
    flowViz: FlowVisualization;
  } {
    const requests: Request[] = [];

    // Calculate number of requests to simulate (sample, not full duration)
    const totalRps = testCase.traffic.rps;
    const readRatio = testCase.traffic.readRatio || 1;
    const sampleSize = Math.min(1000, totalRps * 10); // Sample 10 seconds, max 1000 requests

    const numReads = Math.floor(sampleSize * readRatio);
    const numWrites = sampleSize - numReads;

    // Generate read requests
    for (let i = 0; i < numReads; i++) {
      const request = this.createRequest('read', testCase.traffic.avgResponseSizeMB);
      this.processRequest(request, context);
      requests.push(request);
    }

    // Generate write requests
    for (let i = 0; i < numWrites; i++) {
      const request = this.createRequest('write', testCase.traffic.avgResponseSizeMB);
      this.processRequest(request, context);
      requests.push(request);
    }

    // Build visualization data
    const flowViz = this.buildFlowVisualization(requests, totalRps / sampleSize);

    return { requests, flowViz };
  }

  /**
   * Process a single request through the graph
   */
  private processRequest(request: Request, context: SimulationContext): void {
    // Find entry point (client)
    const clientId = this.findNodeByType('client');
    if (!clientId) {
      request.failed = true;
      request.failureReason = 'No client component found';
      return;
    }

    // Start traversal with cycle-aware context
    const traversalContext = new CycleAwareTraversalContext();
    this.traverseGraph(request, clientId, context, traversalContext);

    // Log traversal stats if verbose logging is enabled
    const stats = traversalContext.getStats();
    verboseLog('Request traversal completed', {
      requestId: request.id,
      totalHops: stats.totalHops,
      uniqueNodes: stats.uniqueNodes,
      maxVisitsPerNode: stats.maxVisitsPerNode,
      failed: request.failed,
    });
  }

  /**
   * Recursively traverse graph following connections
   * Uses CycleAwareTraversalContext for controlled cycle support
   */
  private traverseGraph(
    request: Request,
    currentNodeId: string,
    context: SimulationContext,
    traversalContext: CycleAwareTraversalContext
  ): void {
    // Check if we can visit this node (respects cycle limits)
    if (!traversalContext.canVisit(currentNodeId)) {
      verboseLog('Cannot visit node - cycle limit reached', {
        nodeId: currentNodeId,
        path: traversalContext.getPath(),
      });
      return;
    }

    // Mark as visited
    traversalContext.visit(currentNodeId);

    // Add to path
    request.path.push(currentNodeId);

    // Get component
    const component = this.components.get(currentNodeId);
    if (!component) {
      request.failed = true;
      request.failureReason = `Component ${currentNodeId} not found`;
      traversalContext.unvisit(currentNodeId);
      return;
    }

    // Process through this component
    const result = this.processAtComponent(component, request, context);

    // Accumulate latency
    request.latency += result.latencyMs;

    // Check for failures
    if (!result.success) {
      request.failed = true;
      request.failureReason = result.errorReason || 'Component failed';
      traversalContext.unvisit(currentNodeId);
      return;
    }

    // Get outgoing connections
    const connections = this.adjacency.get(currentNodeId) || [];

    // Filter connections based on request type
    const validConnections = connections.filter((conn) => {
      if (request.type === 'read') {
        return conn.type === 'read' || conn.type === 'read_write';
      } else if (request.type === 'write') {
        return conn.type === 'write' || conn.type === 'read_write';
      }
      return false;
    });

    // If no outgoing connections, request completes here
    if (validConnections.length === 0) {
      traversalContext.unvisit(currentNodeId);
      return;
    }

    // For load balancers, choose specific next node
    if (result.nextNodeId) {
      const nextConn = validConnections.find((c) => c.to === result.nextNodeId);
      if (nextConn) {
        this.traverseGraph(request, nextConn.to, context, traversalContext);
      }
      traversalContext.unvisit(currentNodeId);
      return;
    }

    // For caching layers, might not pass through
    if (result.passthrough === false) {
      traversalContext.unvisit(currentNodeId);
      return; // Cache hit, no need to go to database
    }

    // Continue to all downstream nodes (typical case)
    for (const conn of validConnections) {
      // For database reads, check cache first
      const downstreamComp = this.components.get(conn.to);
      if (downstreamComp) {
        this.traverseGraph(request, conn.to, context, traversalContext);
        // For this simplified model, only follow first valid path
        break;
      }
    }

    traversalContext.unvisit(currentNodeId);
  }

  /**
   * Process request at a single component
   * Returns processing result (latency, success, etc.)
   */
  private processAtComponent(
    component: Component,
    request: Request,
    context: SimulationContext
  ): ProcessingResult {
    // Use component's simulate method (1 RPS = single request)
    const metrics = component.simulate(1, context, request.sizeMB);

    // Determine success based on error rate
    const success = Math.random() > metrics.errorRate;

    const result: ProcessingResult = {
      success,
      latencyMs: metrics.latency,
    };

    if (!success) {
      result.errorReason = `${component.type} failed (${(metrics.errorRate * 100).toFixed(1)}% error rate, ${(metrics.utilization * 100).toFixed(0)}% utilization)`;
    }

    // Handle cache behavior
    if (component.type === 'redis' && request.type === 'read') {
      const cacheHitRate = metrics.cacheHits
        ? metrics.cacheHits / (metrics.cacheHits + (metrics.cacheMisses || 0))
        : 0;
      const isHit = Math.random() < cacheHitRate;
      result.passthrough = !isHit; // Don't pass through if cache hit
    }

    return result;
  }

  /**
   * Build flow visualization data from completed requests
   */
  private buildFlowVisualization(
    requests: Request[],
    scaleFactor: number
  ): FlowVisualization {
    const connectionFlowMap = new Map<string, { read: number; write: number }>();
    const componentSuccessMap = new Map<string, { success: number; total: number }>();
    const readPaths: string[][] = [];
    const writePaths: string[][] = [];
    const failures: FlowVisualization['failures'] = [];

    for (const req of requests) {
      // Track paths
      if (req.type === 'read') {
        readPaths.push([...req.path]);
      } else {
        writePaths.push([...req.path]);
      }

      // Track connection flows
      for (let i = 0; i < req.path.length - 1; i++) {
        const from = req.path[i];
        const to = req.path[i + 1];
        const key = `${from}->${to}`;

        const flow = connectionFlowMap.get(key) || { read: 0, write: 0 };
        if (req.type === 'read') {
          flow.read++;
        } else {
          flow.write++;
        }
        connectionFlowMap.set(key, flow);
      }

      // Track component success rates
      for (const nodeId of req.path) {
        const stats = componentSuccessMap.get(nodeId) || { success: 0, total: 0 };
        stats.total++;
        if (!req.failed) {
          stats.success++;
        }
        componentSuccessMap.set(nodeId, stats);
      }

      // Track failures
      if (req.failed) {
        failures.push({
          requestId: req.id,
          failedAt: req.path[req.path.length - 1] || 'unknown',
          reason: req.failureReason || 'Unknown error',
        });
      }
    }

    // Convert to connection flows (scaled to RPS)
    const connectionFlows: ConnectionFlow[] = [];
    for (const [key, flow] of connectionFlowMap.entries()) {
      const [from, to] = key.split('->');

      if (flow.read > 0) {
        connectionFlows.push({
          from,
          to,
          requestsPerSecond: flow.read * scaleFactor,
          type: 'read',
        });
      }

      if (flow.write > 0) {
        connectionFlows.push({
          from,
          to,
          requestsPerSecond: flow.write * scaleFactor,
          type: 'write',
        });
      }
    }

    // Convert to success rates
    const componentSuccessRates = new Map<string, number>();
    for (const [nodeId, stats] of componentSuccessMap.entries()) {
      componentSuccessRates.set(nodeId, stats.success / stats.total);
    }

    return {
      connectionFlows,
      componentSuccessRates,
      readPaths,
      writePaths,
      failures: failures.slice(0, 10), // Limit to first 10 failures
    };
  }

  /**
   * Create a new request
   */
  private createRequest(type: RequestType, sizeMB?: number): Request {
    return {
      id: `req-${this.requestCounter++}`,
      type,
      startTime: Date.now(),
      sizeMB,
      path: [],
      latency: 0,
      failed: false,
    };
  }

  /**
   * Find first node with given type
   */
  private findNodeByType(type: string): string | undefined {
    for (const [id, component] of this.components.entries()) {
      if (component.type === type) {
        return id;
      }
    }
    return undefined;
  }

  /**
   * BFS to find path between nodes
   */
  private findPath(
    startId: string,
    endId: string,
    flowType: 'read' | 'write' | 'read_write'
  ): string[] | null {
    const queue: string[] = [startId];
    const parent = new Map<string, string | null>();
    parent.set(startId, null);

    const isValidEdge = (conn: Connection): boolean => {
      if (flowType === 'read_write') return true;
      if (flowType === 'read')
        return conn.type === 'read' || conn.type === 'read_write';
      if (flowType === 'write')
        return conn.type === 'write' || conn.type === 'read_write';
      return false;
    };

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current === endId) {
        // Reconstruct path
        const path: string[] = [];
        let node: string | null = current;
        while (node !== null) {
          path.unshift(node);
          node = parent.get(node) || null;
        }
        return path;
      }

      const connections = this.adjacency.get(current) || [];
      for (const conn of connections) {
        if (!isValidEdge(conn)) continue;
        if (parent.has(conn.to)) continue;

        parent.set(conn.to, current);
        queue.push(conn.to);
      }
    }

    return null;
  }
}
