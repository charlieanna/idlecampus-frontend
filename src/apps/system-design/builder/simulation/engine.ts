import { SystemGraph, Bottleneck, Connection } from '../types/graph';
import { ComponentMetrics, SimulationContext } from '../types/component';
import { TestCase, TestMetrics } from '../types/testCase';
import { FlowVisualization } from '../types/request';
import { TrafficFlowEngine } from './trafficFlowEngine';
import {
  Component,
  Client,
  LoadBalancer,
  AppServer,
  PostgreSQL,
  RedisCache,
  CDN,
  S3,
} from './components';
import { MongoDB } from './components/MongoDB';
import { Cassandra } from './components/Cassandra';
import { MessageQueue } from './components/MessageQueue';

/**
 * Simulation Engine
 * Orchestrates traffic propagation through system graph
 */
export class SimulationEngine {
  private components: Map<string, Component> = new Map();
  private adjacency: Map<string, { to: string; type: Connection['type'] }[]> = new Map();
  private trafficFlowEngine: TrafficFlowEngine = new TrafficFlowEngine();

  /**
   * Build component instances from graph
   */
  private buildComponents(graph: SystemGraph): void {
    this.components.clear();
    this.adjacency.clear();

    for (const node of graph.components) {
      let component: Component;

      switch (node.type) {
        case 'client':
          component = new Client(node.id, node.type, node.config);
          break;
        case 'load_balancer':
          component = new LoadBalancer(node.id, node.config);
          break;
        case 'app_server':
          component = new AppServer(node.id, node.config);
          break;
        case 'postgresql':
          component = new PostgreSQL(node.id, node.config);
          break;
        case 'mongodb':
          component = new MongoDB(node.id, node.config);
          break;
        case 'cassandra':
          component = new Cassandra(node.id, node.config);
          break;
        case 'redis':
          component = new RedisCache(node.id, node.config);
          break;
        case 'message_queue':
          component = new MessageQueue(node.id, node.config);
          break;
        case 'cdn':
          component = new CDN(node.id, node.config);
          break;
        case 's3':
          component = new S3(node.id, node.config);
          break;
        default:
          throw new Error(`Unknown component type: ${node.type}`);
      }

      this.components.set(node.id, component);
    }

    // Build adjacency from graph connections
    for (const conn of graph.connections || []) {
      const list = this.adjacency.get(conn.from) || [];
      list.push({ to: conn.to, type: conn.type });
      this.adjacency.set(conn.from, list);
    }
  }

  /**
   * Find component by type (assumes one of each type for MVP)
   */
  private findComponentByType(type: string): Component | undefined {
    for (const component of this.components.values()) {
      if (component.type === type) {
        return component;
      }
    }
    return undefined;
  }

  /**
   * Find the first node ID with a given component type
   */
  private findNodeIdByType(type: string): string | undefined {
    for (const comp of this.components.values()) {
      if (comp.type === type) return comp.id;
    }
    return undefined;
  }

  /**
   * BFS to find a path from start to a node matching predicate, following
   * only edges allowed by the given flow type ('read' or 'write').
   */
  private findPath(
    startId: string,
    flow: 'read' | 'write' | 'read_write',
    predicate: (nodeId: string) => boolean
  ): string[] | null {
    const allow = (edgeType: Connection['type']) => {
      if (flow === 'read_write') return true;
      if (flow === 'read') return edgeType === 'read' || edgeType === 'read_write';
      if (flow === 'write') return edgeType === 'write' || edgeType === 'read_write';
      return false;
    };

    const q: string[] = [startId];
    const parent = new Map<string, string | null>();
    parent.set(startId, null);

    while (q.length) {
      const cur = q.shift()!;
      if (predicate(cur)) {
        // Reconstruct path
        const path: string[] = [];
        let p: string | null = cur;
        while (p) {
          path.push(p);
          p = parent.get(p) ?? null;
        }
        return path.reverse();
      }
      const edges = this.adjacency.get(cur) || [];
      for (const e of edges) {
        if (!allow(e.type)) continue;
        if (!parent.has(e.to)) {
          parent.set(e.to, cur);
          q.push(e.to);
        }
      }
    }
    return null;
  }

  /**
   * Validate that the graph has valid traffic paths
   * Note: Assumes buildComponents() has already been called
   */
  private validateGraphInternal(graph: SystemGraph): { valid: boolean; errors: string[] } {
    this.trafficFlowEngine.buildGraph(graph, this.components);
    return this.trafficFlowEngine.validateGraph();
  }

  /**
   * Get traffic flow visualization data
   * Note: Assumes buildComponents() and trafficFlowEngine.buildGraph() have been called
   */
  private getTrafficFlowInternal(
    testCase: TestCase
  ): {
    flowViz: FlowVisualization;
    pathsFound: boolean;
  } {
    const context: SimulationContext = {
      testCase,
      currentTime: testCase.duration / 2,
    };

    const { flowViz } = this.trafficFlowEngine.sendTraffic(testCase, context);

    // Check if any successful paths were found
    const pathsFound = flowViz.readPaths.length > 0 || flowViz.writePaths.length > 0;

    return { flowViz, pathsFound };
  }

  /**
   * Simulate traffic through the system
   * Simplified for MVP - assumes typical web app topology:
   * Load Balancer → App Servers → Cache → Database
   */
  simulateTraffic(
    graph: SystemGraph,
    testCase: TestCase
  ): {
    metrics: TestMetrics;
    componentMetrics: Map<string, ComponentMetrics>;
    flowViz?: FlowVisualization;
  } {
    this.buildComponents(graph);

    // Build traffic flow engine with the same components
    // (Validation is done internally but doesn't block simulation)
    this.trafficFlowEngine.buildGraph(graph, this.components);

    // Extract traffic parameters
    const totalRps = testCase.traffic.rps;
    const readRps = testCase.traffic.readRps || totalRps * (testCase.traffic.readRatio || 1);
    const writeRps = testCase.traffic.writeRps || totalRps * (1 - (testCase.traffic.readRatio || 1));

    // Build simulation context
    const context: SimulationContext = {
      testCase,
      currentTime: testCase.duration / 2, // Sample at midpoint for failures
    };

    const componentMetrics = new Map<string, ComponentMetrics>();
    let totalLatency = 0;
    let combinedErrorRate = 0;
    let totalCost = 0;
    let availability = 1.0;

    // Determine entry point and key components via graph connections
    const entryId =
      this.findNodeIdByType('client') ||
      this.findNodeIdByType('load_balancer') ||
      this.findNodeIdByType('app_server');

    const appId = this.findNodeIdByType('app_server');
    const dbId = this.findNodeIdByType('postgresql');

    const appServer = appId ? (this.components.get(appId) as AppServer) : undefined;
    const db = dbId ? (this.components.get(dbId) as PostgreSQL) : undefined;

    // Find paths based on connections
    let toAppPath: string[] | null = null;
    if (entryId && appId) {
      toAppPath = this.findPath(entryId, 'read_write', (n) => n === appId);
    }

    // Optional cache
    const cacheId = this.findNodeIdByType('redis');
    const toCachePath = appId && cacheId ? this.findPath(appId, 'read', (n) => n === cacheId) : null;

    // Read DB path (from cache if present else from app)
    const readDbFromId = toCachePath ? toCachePath[toCachePath.length - 1] : appId;
    const toDbReadPath = dbId && readDbFromId ? this.findPath(readDbFromId, 'read', (n) => n === dbId) : null;

    // Write DB path (from app to db)
    const toDbWritePath = dbId && appId ? this.findPath(appId, 'write', (n) => n === dbId) : null;

    // CDN/S3 path (optional, for static content)
    const cdnId = this.findNodeIdByType('cdn');
    const s3Id = this.findNodeIdByType('s3');
    const toCdnPath = cdnId && entryId ? this.findPath(entryId, 'read', (n) => n === cdnId) : null;
    const cdnToS3Path = cdnId && s3Id ? this.findPath(cdnId, 'read', (n) => n === s3Id) : null;

    // If critical backend paths are missing, system cannot function for those flows
    const readPathAvailable = !!(toAppPath && (toCachePath || true) && toDbReadPath);
    const writePathAvailable = !!(toAppPath && toDbWritePath);

    if (!appServer || !db || !toAppPath) {
      return {
        metrics: {
          p50Latency: 0,
          p99Latency: 0,
          errorRate: 1.0,
          monthlyCost: 0,
          availability: 0,
        },
        componentMetrics,
      };
    }

    // Traverse path to app (accumulate latency/cost/errors)
    const pathToAppComponents: Component[] = [];
    for (const nodeId of toAppPath) {
      const comp = this.components.get(nodeId)!;
      // Skip duplicating DB/Cache here; handled later
      if (comp.type === 'redis' || comp.type === 'postgresql' || comp.type === 'cdn' || comp.type === 's3') continue;
      pathToAppComponents.push(comp);
    }

    for (const comp of pathToAppComponents) {
      const metrics = comp.simulate(totalRps, context);
      componentMetrics.set(comp.id, metrics);
      totalLatency += metrics.latency;
      combinedErrorRate = this.combineErrorRates(combinedErrorRate, metrics.errorRate);
      totalCost += metrics.cost;
    }

    // App server already included above as part of pathToAppComponents

    // Cache (if present and reachable)
    const cache = cacheId ? (this.components.get(cacheId) as RedisCache) : undefined;
    let dbReadRps = readRps;
    let dbWriteRps = writeRps;

    let cacheLatency = 0;
    let missRatio = 1;
    if (cache && toCachePath) {
      const cacheMetrics = cache.simulate(readRps, context);
      componentMetrics.set(cache.id, cacheMetrics);
      cacheLatency = cacheMetrics.latency;
      totalCost += cacheMetrics.cost;
      dbReadRps = cacheMetrics.cacheMisses || readRps;
      missRatio = readRps > 0 ? (dbReadRps / readRps) : 0;
    }

    // Database
    const dbMetrics = db.simulateWithReadWrite(dbReadRps, dbWriteRps, context);
    componentMetrics.set(db.id, dbMetrics);
    combinedErrorRate = this.combineErrorRates(combinedErrorRate, dbMetrics.errorRate);
    totalCost += dbMetrics.cost;
    if (dbMetrics.downtime) {
      availability = Math.max(0, 1 - dbMetrics.downtime / testCase.duration);
    }

    // CDN (if present and reachable)
    const cdn = cdnId ? (this.components.get(cdnId) as CDN) : undefined;
    if (cdn && toCdnPath) {
      const avgResponseSize = testCase.traffic.avgResponseSizeMB || 2;
      const cdnMetrics = cdn.simulate(totalRps, context, avgResponseSize);
      componentMetrics.set(cdn.id, cdnMetrics);
      totalCost += cdnMetrics.cost;
    }

    // Step 6: S3 (if present, for object storage)
    const s3 = s3Id ? (this.components.get(s3Id) as S3) : undefined;
    if (s3 && cdnToS3Path) {
      const avgObjectSize = testCase.traffic.avgResponseSizeMB || 2;
      const s3Metrics = s3.simulate(totalRps, context, avgObjectSize);
      componentMetrics.set(s3.id, s3Metrics);
      totalCost += s3Metrics.cost;
    }

    // Calculate final metrics
    // Compute end-to-end latency from traffic flow
    // Latency up to app (lb/app/etc.)
    const pathToAppLatency = totalLatency; // accumulated earlier

    // Read request average latency
    const readLatency = readPathAvailable
      ? pathToAppLatency + cacheLatency + (missRatio * (dbMetrics.readLatency ?? 0))
      : 0;

    // Write request average latency
    const writeLatency = writePathAvailable
      ? pathToAppLatency + (dbMetrics.writeLatency ?? 0)
      : 0;

    // If any path is unavailable, treat that fraction as failed (1.0 error)
    const readFrac = totalRps > 0 ? readRps / totalRps : 0;
    const writeFrac = totalRps > 0 ? writeRps / totalRps : 0;
    if (!readPathAvailable || !writePathAvailable) {
      const unreachableFrac = (readPathAvailable ? 0 : readFrac) + (writePathAvailable ? 0 : writeFrac);
      combinedErrorRate = this.combineErrorRates(combinedErrorRate, Math.min(1, unreachableFrac));
      // If everything is unreachable, knock availability to 0
      if (unreachableFrac >= 0.999) availability = 0;
    }

    const p50Latency =
      totalRps > 0
        ? (readRps * readLatency + writeRps * writeLatency) / totalRps
        : 0;
    const p99Latency = p50Latency * 1.5; // Approximate (p99 ≈ 1.5x p50)

    // Get flow visualization (components and traffic flow engine already built)
    // Note: Flow visualization is optional and runs on a sample of requests
    let flowViz: FlowVisualization | undefined;
    try {
      const result = this.getTrafficFlowInternal(testCase);
      flowViz = result.flowViz;
    } catch (error) {
      // Flow visualization failed, but don't block the main simulation
      console.warn('Flow visualization failed:', error);
      flowViz = undefined;
    }

    return {
      metrics: {
        p50Latency,
        p99Latency,
        errorRate: combinedErrorRate,
        monthlyCost: totalCost,
        availability,
      },
      componentMetrics,
      flowViz,
    };
  }

  /**
   * Combine error rates: overall_success = success1 * success2
   */
  private combineErrorRates(rate1: number, rate2: number): number {
    const successRate = (1 - rate1) * (1 - rate2);
    return 1 - successRate;
  }

  /**
   * Identify bottlenecks in the system
   */
  identifyBottlenecks(
    componentMetrics: Map<string, ComponentMetrics>
  ): Bottleneck[] {
    const bottlenecks: Bottleneck[] = [];

    for (const [id, metrics] of componentMetrics.entries()) {
      if (metrics.utilization > 0.8) {
        const component = this.components.get(id);
        if (!component) continue;

        bottlenecks.push({
          componentId: id,
          componentType: component.type,
          issue: metrics.utilization > 0.95
            ? 'Critical utilization - system overloaded'
            : 'High utilization - approaching capacity',
          utilization: metrics.utilization,
          recommendation: this.getRecommendation(component, metrics),
        });
      }
    }

    return bottlenecks;
  }

  /**
   * Get recommendation for a bottlenecked component
   */
  private getRecommendation(
    component: Component,
    metrics: ComponentMetrics
  ): string {
    switch (component.type) {
      case 'app_server':
        const currentInstances = (metrics as any).instances || 1;
        const suggestedInstances = Math.ceil(currentInstances * 1.5);
        return `Add more instances (currently: ${currentInstances}, suggested: ${suggestedInstances})`;

      case 'postgresql':
        if ((metrics as any).writeUtil > 0.8) {
          return `Database write capacity is saturated. Consider: (1) Increasing write capacity, (2) Adding write caching, (3) Sharding`;
        } else {
          return `Database read capacity is saturated. Consider: (1) Increasing read capacity, (2) Adding caching with higher hit ratio, (3) Adding read replicas`;
        }

      case 'redis':
        return `Cache is undersized or hit ratio is too low. Consider: (1) Increasing memory size, (2) Increasing TTL, (3) Pre-warming cache`;

      default:
        return `Scale this component to handle increased load`;
    }
  }
}
