import { SystemGraph, Bottleneck } from '../types/graph';
import { ComponentMetrics, SimulationContext } from '../types/component';
import { TestCase, TestMetrics } from '../types/testCase';
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

/**
 * Simulation Engine
 * Orchestrates traffic propagation through system graph
 */
export class SimulationEngine {
  private components: Map<string, Component> = new Map();

  /**
   * Build component instances from graph
   */
  private buildComponents(graph: SystemGraph): void {
    this.components.clear();

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
        case 'redis':
          component = new RedisCache(node.id, node.config);
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
  } {
    this.buildComponents(graph);

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

    // Validate required components
    const appServer = this.findComponentByType('app_server');
    const db = this.findComponentByType('postgresql') as PostgreSQL | undefined;

    // If critical components are missing, system cannot function
    if (!appServer || !db) {
      return {
        metrics: {
          p50Latency: 0,
          p99Latency: 0,
          errorRate: 1.0, // 100% error rate - system can't handle requests
          monthlyCost: 0,
          availability: 0, // System is down without backend
        },
        componentMetrics,
      };
    }

    // Step 1: Load Balancer
    const lb = this.findComponentByType('load_balancer');
    if (lb) {
      const lbMetrics = lb.simulate(totalRps, context);
      componentMetrics.set(lb.id, lbMetrics);
      totalLatency += lbMetrics.latency;
      combinedErrorRate = this.combineErrorRates(
        combinedErrorRate,
        lbMetrics.errorRate
      );
      totalCost += lbMetrics.cost;
    }

    // Step 2: App Servers
    if (appServer) {
      const appMetrics = appServer.simulate(totalRps, context);
      componentMetrics.set(appServer.id, appMetrics);
      totalLatency += appMetrics.latency;
      combinedErrorRate = this.combineErrorRates(
        combinedErrorRate,
        appMetrics.errorRate
      );
      totalCost += appMetrics.cost;
    }

    // Step 3: Cache (if present)
    const cache = this.findComponentByType('redis');
    let dbReadRps = readRps;
    let dbWriteRps = writeRps;

    if (cache) {
      const cacheMetrics = cache.simulate(readRps, context);
      componentMetrics.set(cache.id, cacheMetrics);
      totalLatency += cacheMetrics.latency;
      totalCost += cacheMetrics.cost;

      // Cache reduces DB read load
      dbReadRps = cacheMetrics.cacheMisses || readRps;
    }

    // Step 4: Database
    if (db) {
      const dbMetrics = db.simulateWithReadWrite(dbReadRps, dbWriteRps, context);
      componentMetrics.set(db.id, dbMetrics);

      // For cache hits, we already added cache latency
      // For cache misses, add DB latency
      const cacheMissRatio = cache
        ? (dbReadRps / readRps)
        : 1.0;
      totalLatency += dbMetrics.latency * cacheMissRatio;

      combinedErrorRate = this.combineErrorRates(
        combinedErrorRate,
        dbMetrics.errorRate
      );
      totalCost += dbMetrics.cost;

      // Handle database failure
      if (dbMetrics.downtime) {
        availability = Math.max(
          0,
          1 - dbMetrics.downtime / testCase.duration
        );
      }
    }

    // Step 5: CDN (if present, for static content)
    const cdn = this.findComponentByType('cdn');
    if (cdn) {
      const avgResponseSize = testCase.traffic.avgResponseSizeMB || 2;
      const cdnMetrics = cdn.simulate(totalRps, context, avgResponseSize);
      componentMetrics.set(cdn.id, cdnMetrics);
      totalCost += cdnMetrics.cost;
    }

    // Step 6: S3 (if present, for object storage)
    const s3 = this.findComponentByType('s3');
    if (s3) {
      const avgObjectSize = testCase.traffic.avgResponseSizeMB || 2;
      const s3Metrics = s3.simulate(totalRps, context, avgObjectSize);
      componentMetrics.set(s3.id, s3Metrics);
      totalCost += s3Metrics.cost;
    }

    // Calculate final metrics
    const p50Latency = totalLatency;
    const p99Latency = totalLatency * 1.5; // Approximate (p99 ≈ 1.5x p50 for MVP)

    return {
      metrics: {
        p50Latency,
        p99Latency,
        errorRate: combinedErrorRate,
        monthlyCost: totalCost,
        availability,
      },
      componentMetrics,
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
