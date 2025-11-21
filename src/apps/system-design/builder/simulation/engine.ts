import { SystemGraph, Bottleneck, Connection } from '../types/graph';
import { ComponentMetrics, SimulationContext } from '../types/component';
import { TestCase, TestMetrics } from '../types/testCase';
import { FlowVisualization } from '../types/request';
import { TrafficFlowEngine } from './trafficFlowEngine';
import { isDatabaseComponentType } from '../utils/database';
import { findHandlingServers, getServerDisplayName } from '../utils/apiRouting';
import {
  Component,
  Client,
  LoadBalancer,
  AppServer,
  Worker,
  PostgreSQL,
  RedisCache,
  CDN,
  S3,
} from './components';
import { MongoDB } from './components/MongoDB';
import { Cassandra } from './components/Cassandra';
import { MessageQueue } from './components/MessageQueue';
import { calculateRequestPercentiles } from './latencyDistribution';
import { isEnabled, verboseLog } from './featureFlags';
import {
  findAllDatabaseNodes,
  distributeTrafficAcrossShards,
  aggregateShardMetrics,
  getDefaultShardingConfig,
} from './sharding';
import {
  calculateEffectiveCapacity,
  CONNECTION_POOL_DEFAULTS,
  QueryComplexity,
  IOPattern,
} from './databaseCapacity';
import {
  calculateDynamicHitRatio,
  CacheAccessPattern,
} from './cacheModeling';
import {
  calculateTrafficAtTime,
  TrafficPatternConfig,
} from './trafficPatterns';
import {
  calculateFailureEffect,
  FailureInjectionConfig,
} from './failureInjection';
import {
  calculateRetryEffect,
  calculateCircuitBreakerEffect,
  calculateTimeoutEffect,
  calculateQueueEffect,
  calculateCombinedReliabilityEffect,
  RetryConfig,
  CircuitBreakerConfig,
  TimeoutConfig,
  QueueConfig,
  DEFAULT_RETRY_CONFIG,
  DEFAULT_CIRCUIT_BREAKER_CONFIG,
  DEFAULT_TIMEOUT_CONFIG,
  DEFAULT_QUEUE_CONFIG,
} from './reliabilityPatterns';

/**
 * Simulation Engine
 * Orchestrates traffic propagation through system graph
 */
export class SimulationEngine {
  private components: Map<string, Component> = new Map();
  private adjacency: Map<string, { to: string; type: Connection['type'] }[]> = new Map();
  private trafficFlowEngine: TrafficFlowEngine = new TrafficFlowEngine();

  // Advanced simulation configuration
  private trafficPatternConfig?: TrafficPatternConfig;
  private failureInjections: FailureInjectionConfig[] = [];
  private cacheAccessPattern: CacheAccessPattern = 'zipf';
  private queryComplexity: QueryComplexity = 'moderate';
  private ioPattern: IOPattern = 'random';

  // Reliability pattern configuration
  private retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG;
  private circuitBreakerConfig: CircuitBreakerConfig = DEFAULT_CIRCUIT_BREAKER_CONFIG;
  private timeoutConfig: TimeoutConfig = DEFAULT_TIMEOUT_CONFIG;
  private queueConfig: QueueConfig = DEFAULT_QUEUE_CONFIG;

  // Python code for code-aware simulation
  private pythonCode: string = '';
  private codeUsesCache: boolean = false;
  private codeUsesDatabase: boolean = false;
  private codeUsesQueue: boolean = false;

  /**
   * Set Python code and analyze what components it uses
   */
  setPythonCode(code: string): void {
    this.pythonCode = code;
    
    // Analyze code to determine what components it uses
    this.codeUsesCache = /context\[['"]cache['"]\]|context\.cache/.test(code);
    this.codeUsesDatabase = /context\[['"]db['"]\]|context\.db/.test(code);
    this.codeUsesQueue = /context\[['"]queue['"]\]|context\.queue/.test(code);
  }

  /**
   * Configure traffic pattern for simulation
   */
  setTrafficPattern(config: TrafficPatternConfig): void {
    this.trafficPatternConfig = config;
  }

  /**
   * Configure failure injection scenarios
   */
  setFailureInjections(injections: FailureInjectionConfig[]): void {
    this.failureInjections = injections;
  }

  /**
   * Configure cache access pattern
   */
  setCacheAccessPattern(pattern: CacheAccessPattern): void {
    this.cacheAccessPattern = pattern;
  }

  /**
   * Configure database query complexity
   */
  setQueryComplexity(complexity: QueryComplexity): void {
    this.queryComplexity = complexity;
  }

  /**
   * Configure database I/O pattern
   */
  setIOPattern(pattern: IOPattern): void {
    this.ioPattern = pattern;
  }

  /**
   * Configure retry logic
   */
  setRetryConfig(config: RetryConfig): void {
    this.retryConfig = config;
  }

  /**
   * Configure circuit breaker pattern
   */
  setCircuitBreakerConfig(config: CircuitBreakerConfig): void {
    this.circuitBreakerConfig = config;
  }

  /**
   * Configure timeout enforcement
   */
  setTimeoutConfig(config: TimeoutConfig): void {
    this.timeoutConfig = config;
  }

  /**
   * Configure queue/backpressure behavior
   */
  setQueueConfig(config: QueueConfig): void {
    this.queueConfig = config;
  }

  /**
   * Reset advanced configuration to defaults
   */
  resetAdvancedConfig(): void {
    this.trafficPatternConfig = undefined;
    this.failureInjections = [];
    this.cacheAccessPattern = 'zipf';
    this.queryComplexity = 'moderate';
    this.ioPattern = 'random';
    this.retryConfig = DEFAULT_RETRY_CONFIG;
    this.circuitBreakerConfig = DEFAULT_CIRCUIT_BREAKER_CONFIG;
    this.timeoutConfig = DEFAULT_TIMEOUT_CONFIG;
    this.queueConfig = DEFAULT_QUEUE_CONFIG;
  }

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
        case 'worker':
          component = new Worker(node.id, node.config);
          break;
        case 'database':
        case 'postgresql':
          component = new PostgreSQL(node.id, node.config);
          break;
        case 'mongodb':
          component = new MongoDB(node.id, node.config);
          break;
        case 'cassandra':
          component = new Cassandra(node.id, node.config);
          break;
        case 'cache':
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

  private findNodeIdByType(type: string): string | undefined {
      for (const comp of this.components.values()) {
        if (comp.type === type) return comp.id;
      }
      return undefined;
    }

  /**
   * Calculate incoming traffic for all nodes using BFS traversal
   */
  private calculateNodeTraffic(
      entryPoints: string[],
      totalReadRps: number,
      totalWriteRps: number
  ): Map<string, { read: number; write: number }> {
      const traffic = new Map<string, { read: number; write: number }>();

      // Initialize traffic map
      for (const id of this.components.keys()) {
          traffic.set(id, { read: 0, write: 0 });
      }

      // Initialize entry points
      // Split initial traffic equally among entry points (if multiple clients)
      const readPerEntry = totalReadRps / Math.max(1, entryPoints.length);
      const writePerEntry = totalWriteRps / Math.max(1, entryPoints.length);

      const queue: string[] = [];

      for (const entryId of entryPoints) {
          const current = traffic.get(entryId)!;
          current.read += readPerEntry;
          current.write += writePerEntry;
          queue.push(entryId);
      }

      // Process nodes in topological-like order (BFS is a good approximation for acyclic)
      // For true DAGs we might want Kahn's algo, but BFS handles simple cases well enough
      // We use a processing count to handle merges? No, just propagate.
      // For cycles, we need a visited set or limit depth. Let's limit depth for now.

      const processed = new Set<string>();
      let iteration = 0;
      const MAX_ITERATIONS = 1000; // Safety break

      while (queue.length > 0 && iteration < MAX_ITERATIONS) {
          iteration++;
          // BFS Level processing to handle merges better?
          // Actually, standard BFS is fine. But if A->B and A->C->B, B might be processed twice.
          // We should accumulate traffic.

          const nodeId = queue.shift()!;
          const input = traffic.get(nodeId)!;
          const component = this.components.get(nodeId)!;

          // Determine Output Traffic
          let outputRead = input.read;
          let outputWrite = input.write;

          // Special Component Logic
          if (component.type === 'redis' || component.type === 'cache') {
               // Need to calculate hit ratio to know what goes downstream
               // We can reuse the logic from simulate(), but simulate() needs the RPS.
               // Circular dependency?
               // No, simulate() uses RPS to calc utilization.
               // Hit Ratio is usually config based or capacity based.
               // For traffic propagation, let's look at config.
               const cacheConfig = (component as any).config || {};
               // Default hit ratio from config or 0.9
               // NOTE: Dynamic hit ratio logic is complex to invoke here without full context.
               // For propagation, let's stick to a simple model or re-invoke dynamic logic if critical.
               // Using a simple estimate for flow propagation:
               const hitRatio = (cacheConfig.hitRatio !== undefined) ? Number(cacheConfig.hitRatio) : 0.9;

               // Hits return, Misses continue.
               outputRead = input.read * (1 - hitRatio);
               // Writes usually go through (write-through or invalidate)
               outputWrite = input.write;
          }

          // Get connections
          const edges = this.adjacency.get(nodeId) || [];
          if (edges.length === 0) continue;

          // Distribute to children
          // Group edges by destination
          // Heuristic:
          // 1. Load Balancer: Split equally among all children.
          // 2. Others:
          //    - If connecting to same type (e.g. DB shards/replicas): Split?
          //    - If connecting to diff types (e.g. Cache and DB): Broadcast (Fanout).

          // Implementation:
          // If LB, splitFactor = 1 / edges.length.
          // Else, splitFactor = 1 (Broadcast).

          let splitFactorRead = 1.0;
          let splitFactorWrite = 1.0;

          if (component.type === 'load_balancer') {
              splitFactorRead = 1.0 / edges.length;
              splitFactorWrite = 1.0 / edges.length;
          } else {
               // Check if we are connecting to multiple instances of the same type (Sharding/Replication)
               const types = new Set(edges.map(e => this.components.get(e.to)?.type));
               if (types.size === 1 && edges.length > 1) {
                   // Connecting to multiple of same type -> Assumed Load Balancing/Sharding
                   splitFactorRead = 1.0 / edges.length;
                   splitFactorWrite = 1.0 / edges.length;
               }
               // Else (Diff types or Single child) -> Broadcast (1.0)
          }

          for (const edge of edges) {
               const childId = edge.to;
               const childTraffic = traffic.get(childId)!;

               let flowRead = 0;
               let flowWrite = 0;

               if (edge.type === 'read' || edge.type === 'read_write') {
                   flowRead = outputRead * splitFactorRead;
               }
               if (edge.type === 'write' || edge.type === 'read_write') {
                   flowWrite = outputWrite * splitFactorWrite;
               }

               // Add to child
               if (flowRead > 0 || flowWrite > 0) {
                   childTraffic.read += flowRead;
                   childTraffic.write += flowWrite;

                   // If child hasn't been queued yet (or needs re-processing in DAG), queue it.
                   // Simple BFS queues blindly.
                   // Optimization: Use indegree map for Kahn's?
                   // For now, to support A->B and A->C->B, we allow re-queueing but maybe limit visits?
                   // Actually, in BFS, B is visited after A.
                   // If C is visited after A, and C->B, B is queued again?
                   // Yes. traffic.read is accumulated.

                   // Avoid infinite loops for Cycles
                   // We use MAX_ITERATIONS.
                   queue.push(childId);
               }
          }
      }

      return traffic;
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
   * Generic implementation supporting arbitrary topologies
   */
  simulateTraffic(
    graph: SystemGraph,
    testCase: TestCase
  ): {
    metrics: TestMetrics;
    componentMetrics: Map<string, ComponentMetrics>;
    flowViz?: FlowVisualization;
  } {
    // Log for all NFR tests to debug failures
    const shouldLog = testCase.type !== 'functional';
    
    // 1. Build Components
    this.buildComponents(graph);
    this.trafficFlowEngine.buildGraph(graph, this.components);

    // 2. Determine Total RPS
    let totalReadRps = 0;
    let totalWriteRps = 0;
    let totalRps = 0;

    if (testCase.traffic.readRps !== undefined && testCase.traffic.writeRps !== undefined) {
      totalReadRps = testCase.traffic.readRps;
      totalWriteRps = testCase.traffic.writeRps;
      totalRps = totalReadRps + totalWriteRps;
    } else if (testCase.traffic.rps !== undefined) {
      totalRps = testCase.traffic.rps;
      const readRatio = testCase.traffic.readRatio !== undefined ? testCase.traffic.readRatio :
                        (testCase.traffic.type === 'write' ? 0.0 :
                         testCase.traffic.type === 'read' ? 1.0 : 0.5);
      totalReadRps = totalRps * readRatio;
      totalWriteRps = totalRps * (1 - readRatio);
    }

    // Apply traffic patterns
    if (isEnabled('ENABLE_TRAFFIC_PATTERNS') && this.trafficPatternConfig) {
       const patternResult = calculateTrafficAtTime(
        testCase.duration / 2,
        this.trafficPatternConfig,
        totalRps > 0 ? totalReadRps / totalRps : 0.9
      );
      totalRps = patternResult.rps;
      totalReadRps = patternResult.readRps;
      totalWriteRps = patternResult.writeRps;
    }

    if (shouldLog) {
        console.log(`  Traffic: ${totalRps} RPS (${totalReadRps.toFixed(0)} reads, ${totalWriteRps.toFixed(0)} writes)`);
    }

    // 3. Identify Entry Points
    const entryPoints: string[] = [];
    // Preferred: Clients
    for (const [id, comp] of this.components) {
        if (comp.type === 'client') entryPoints.push(id);
    }
    // Fallback: LB or App
    if (entryPoints.length === 0) {
        for (const [id, comp] of this.components) {
            if (comp.type === 'load_balancer') entryPoints.push(id);
        }
    }
    if (entryPoints.length === 0) {
        for (const [id, comp] of this.components) {
            if (comp.type === 'app_server') entryPoints.push(id);
        }
    }

    // 4. Calculate Traffic Distribution (Forward Pass)
    const nodeTraffic = this.calculateNodeTraffic(entryPoints, totalReadRps, totalWriteRps);

    // 5. Simulate Components
    const context: SimulationContext = {
      testCase,
      currentTime: testCase.duration / 2,
    };

    const componentMetrics = new Map<string, ComponentMetrics>();
    const failureEffects = new Map<string, ReturnType<typeof calculateFailureEffect>>();

    // Pre-calculate failure effects
    if (isEnabled('ENABLE_FAILURE_INJECTION') && this.failureInjections.length > 0) {
      for (const [compId] of this.components) {
        const effect = calculateFailureEffect(compId, context.currentTime, this.failureInjections);
        if (effect.isAffected) {
          failureEffects.set(compId, effect);
        }
      }
    }

    let totalSystemCost = 0;
    let infrastructureCost = 0;

    for (const [id, comp] of this.components) {
        const input = nodeTraffic.get(id)!;
        const inputTotal = input.read + input.write;

        // Skip simulation if no traffic (unless it's an infrastructure component that has base cost?)
        // For now, simulate everything to catch base costs.

        let metrics: ComponentMetrics;

        // Special handling for DBs to support read/write differentiation in simulation
        if (isDatabaseComponentType(comp.type)) {
             // Use simulateWithReadWrite if available or cast
             // Assuming PostgreSQL/Mongo/etc have this method.
             // We need to cast to access it if it's not on Component interface
             // Actually, we can try to check if method exists, or just use simulate(total)
             // Most DBs in this codebase seem to support simulateWithReadWrite or handle split internally?
             // Checking PostgreSQL.ts: simulateWithReadWrite is there.
             // But Component interface only has simulate.
             // We'll cast to any for now to support the generic call if method exists.
             if ((comp as any).simulateWithReadWrite) {
                 metrics = (comp as any).simulateWithReadWrite(input.read, input.write, context);
             } else {
                 metrics = comp.simulate(inputTotal, context);
             }
        } else {
            metrics = comp.simulate(inputTotal, context);
        }

        // Apply Failures
        const failureEffect = failureEffects.get(id);
        if (failureEffect && failureEffect.isAffected) {
            metrics = this.applyFailureEffect(metrics, failureEffect);
        }

        componentMetrics.set(id, metrics);
        totalSystemCost += metrics.cost;

        // Infrastructure Cost Logic
        if (comp.type === 'app_server' || comp.type === 'load_balancer' || comp.type === 'worker' || isDatabaseComponentType(comp.type) || comp.type === 'redis' || comp.type === 'cache') {
             infrastructureCost += metrics.cost;
        }
    }

    // 6. Path Aggregation (Reverse/Trace Pass) to find End-to-End Latency
    // We need to trace from Entry Points and sum up latencies weighted by flow.
    // Since we did Forward Pass, we can do a similar traversal or use the FlowViz logic?
    // Let's do a simple weighted average approach.

    let weightedLatencySum = 0;
    let totalFlowForLatency = 0;
    let combinedAvailability = 1.0;
    let combinedErrorRate = 0; // This is tricky for graphs. 1 - (1-e1)*(1-e2)... along paths.

    // Actually, latency is additive along a path.
    // Error rate is probability of failure along a path.
    // We can perform a DFS/BFS from Entry to Leaves to accumulate Path Latency.
    // PathLatency = L_node + L_next
    // TotalLatency = Sum(PathLatency * PathFlow) / TotalFlow
    
    // Let's use a recursive function with memoization or just BFS with path accumulation?
    // BFS with path accumulation can explode.
    // Better: "Expected Latency to Completion" for each node? (Reverse Topo)
    // Latency(Node) = Node_Processing_Time + WeightedAvg(Latency(Children))
    
    // Reverse Topo Sort would be ideal.
    // Or just a simple recursive function with cycle breaking.

    const getExpectedLatency = (nodeId: string, visited: Set<string>): number => {
         if (visited.has(nodeId)) return 0; // Cycle break
         visited.add(nodeId);

         const metrics = componentMetrics.get(nodeId)!;
         const ownLatency = metrics.latency || 0;

         const edges = this.adjacency.get(nodeId) || [];
         if (edges.length === 0) return ownLatency;

         // Calculate average latency of downstream
         let sumDownstreamLatency = 0;
         let count = 0;

         // Check split factors from calculateNodeTraffic logic
         // If LoadBalancer, we average children?
         // If Broadcast, we take MAX? (Parallel) or SUM? (Sequential).
         // The graph doesn't specify parallel/seq.
         // Standard assumption: Request goes to A, then B. (Sequential).
         // BUT `App -> Cache` and `App -> DB` is usually: Check Cache (return) OR Check DB.
         // If Cache Hit: Latency = CacheLat.
         // If Cache Miss: Latency = CacheLat + DBLat.
         // This conditional logic is hard to genericize without knowing it's a cache.

         // Heuristic:
         // If Node is Cache:
         //   Effective = Latency + (MissRatio * DownstreamLatency)
         // Else:
         //   Effective = Latency + Average(DownstreamLatency) [Split] or Sum(DownstreamLatency) [Broadcast]?
         //   Actually, if LB splits, a request only goes to ONE child. So Average is correct.
         //   If App calls ServiceA AND ServiceB (Fanout), it waits for both. So MAX (if parallel) or SUM (if serial).
         //   Let's assume SUM for fanout (safer/pessimistic).

         const comp = this.components.get(nodeId)!;

         if (comp.type === 'load_balancer' || isDatabaseComponentType(comp.type) && edges.length > 1) {
              // Split logic -> Weighted Average
              // Assumes uniform distribution for now (1/N)
              for (const edge of edges) {
                   sumDownstreamLatency += getExpectedLatency(edge.to, new Set(visited));
                   count++;
              }
              return ownLatency + (count > 0 ? sumDownstreamLatency / count : 0);
         } else if (comp.type === 'redis' || comp.type === 'cache') {
              // Cache Logic
              const cacheMetrics = metrics; // has cacheHits/Misses
              const totalOps = (cacheMetrics.cacheHits || 0) + (cacheMetrics.cacheMisses || 0);
              const missRatio = totalOps > 0 ? (cacheMetrics.cacheMisses || 0) / totalOps : 0; // Default 0 if no traffic?

              // Find downstream (DB)
              // Usually only 1 downstream for cache
              let downstreamLat = 0;
              if (edges.length > 0) {
                  // Pick first or avg?
                  downstreamLat = getExpectedLatency(edges[0].to, new Set(visited));
              }
              return ownLatency + (missRatio * downstreamLat);
         } else {
              // App Server or other components with potential read/write path separation
              // Check if edges have different types (read vs write)
              const readEdges = edges.filter(e => e.type === 'read' || e.type === 'read_write');
              const writeEdges = edges.filter(e => e.type === 'write' || e.type === 'read_write');

              // Get traffic distribution for this node
              const traffic = nodeTraffic.get(nodeId);
              const readRps = traffic?.read || 0;
              const writeRps = traffic?.write || 0;
              const totalRps = readRps + writeRps;

              // If we have separate read and write paths AND traffic, calculate weighted average
              if (readEdges.length > 0 && writeEdges.length > 0 && totalRps > 0) {
                  // Calculate read path latency (average if multiple read edges)
                  // Use separate visited sets for read and write paths since they are alternatives
                  let readPathLatency = 0;
                  for (const edge of readEdges) {
                      readPathLatency += getExpectedLatency(edge.to, new Set(visited));
                  }
                  readPathLatency = readEdges.length > 0 ? readPathLatency / readEdges.length : 0;

                  // Calculate write path latency (average if multiple write edges)
                  let writePathLatency = 0;
                  for (const edge of writeEdges) {
                      writePathLatency += getExpectedLatency(edge.to, new Set(visited));
                  }
                  writePathLatency = writeEdges.length > 0 ? writePathLatency / writeEdges.length : 0;

                  // Weighted average based on traffic distribution
                  const readRatio = readRps / totalRps;
                  const writeRatio = writeRps / totalRps;
                  const weightedDownstreamLatency = (readPathLatency * readRatio) + (writePathLatency * writeRatio);

                  const result = ownLatency + weightedDownstreamLatency;

                  // Defensive check for NaN or Infinity
                  if (!isFinite(result)) {
                      console.error('Invalid latency calculation:', {
                          nodeId,
                          ownLatency,
                          readPathLatency,
                          writePathLatency,
                          readRatio,
                          writeRatio,
                          weightedDownstreamLatency
                      });
                      return ownLatency; // Fallback to just own latency
                  }
                  return result;
              } else {
                  // Fallback: Broadcast/Fanout Logic (all edges are sequential)
                  // Assume Sequential (Sum) - pessimistic assumption
                  for (const edge of edges) {
                       sumDownstreamLatency += getExpectedLatency(edge.to, new Set(visited));
                  }
                  return ownLatency + sumDownstreamLatency;
              }
         }
    };

    // Calculate System-Wide Metrics
    let p50Latency = 0;
    if (entryPoints.length > 0) {
        // Average latency across entry points
        let totalLat = 0;
        for (const entry of entryPoints) {
            totalLat += getExpectedLatency(entry, new Set());
        }
        p50Latency = totalLat / entryPoints.length;
    }

    // Combine Error Rates
    // Simple heuristic: 1 - Product(1 - errorRate) for all ACTIVE nodes
    let successRate = 1.0;
    for (const [id, metrics] of componentMetrics) {
        const input = nodeTraffic.get(id)!;
        if (input.read + input.write > 0) {
            successRate *= (1 - metrics.errorRate);
        }
    }
    combinedErrorRate = 1 - successRate;

    // Availability (Min of all active nodes)
    for (const [id, metrics] of componentMetrics) {
        const input = nodeTraffic.get(id)!;
        if (input.read + input.write > 0 && metrics.downtime) {
             const nodeAvail = Math.max(0, 1 - metrics.downtime / testCase.duration);
             combinedAvailability = Math.min(combinedAvailability, nodeAvail);
        }
    }

    // Reliability Patterns
    // Apply global reliability effects if enabled
     const anyReliabilityEnabled =
      isEnabled('ENABLE_RETRY_LOGIC') ||
      isEnabled('ENABLE_CIRCUIT_BREAKER') ||
      isEnabled('ENABLE_TIMEOUT_ENFORCEMENT') ||
      isEnabled('ENABLE_BACKPRESSURE');

    if (anyReliabilityEnabled && totalRps > 0) {
      const reliabilityResult = calculateCombinedReliabilityEffect(
        totalRps,
        combinedErrorRate,
        p50Latency,
        p50Latency * 0.3,
        this.retryConfig,
        this.circuitBreakerConfig,
        this.timeoutConfig,
        this.queueConfig
      );

      combinedErrorRate = this.combineErrorRates(
        combinedErrorRate,
        reliabilityResult.effectiveErrorRate - combinedErrorRate
      );
      p50Latency = reliabilityResult.effectiveLatencyMs;

      // Warnings?
    }

    // Percentiles
    // We use the component count of the "longest path" as proxy?
    // Or just use componentMetrics.size?
    // Used for statistical distribution tail calculation
    const componentCount = componentMetrics.size;
    const maxUtilization = Math.max(
      ...Array.from(componentMetrics.values()).map(m => m.utilization || 0)
    );

    const percentiles = calculateRequestPercentiles(
      p50Latency, // Use generic p50 as base
      p50Latency * 1.5, // Estimate write latency as higher? Or just use same base.
      totalReadRps,
      totalWriteRps,
      {
        componentCount,
        cacheHitRatio: 0.5, // Hard to calc generic hit ratio, use median
        loadFactor: Math.min(1, maxUtilization),
      }
    );

    // Flow Visualization (Keep existing logic)
    let flowViz: FlowVisualization | undefined;
    try {
      const result = this.getTrafficFlowInternal(testCase);
      flowViz = result.flowViz;
    } catch (error) {
      console.warn('Flow visualization failed:', error);
      flowViz = undefined;
    }

    const finalMetrics: TestMetrics = {
      p50Latency,
      p90Latency: percentiles.p90,
      p95Latency: percentiles.p95,
      p99Latency: percentiles.p99,
      p999Latency: percentiles.p999,
      errorRate: combinedErrorRate,
      monthlyCost: totalSystemCost,
      infrastructureCost,
      availability: combinedAvailability,
    };

    return {
      metrics: finalMetrics,
      componentMetrics,
      flowViz
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
   * Apply failure injection effects to component metrics
   */
  private applyFailureEffect(
    metrics: ComponentMetrics,
    effect: ReturnType<typeof calculateFailureEffect>
  ): ComponentMetrics {
    const adjustedMetrics = { ...metrics };

    // Apply latency multiplier
    if (effect.latencyMultiplier === Infinity) {
      // Component is completely down
      adjustedMetrics.latency = 30000; // 30 second timeout
      adjustedMetrics.errorRate = 1.0;
      adjustedMetrics.utilization = 0;
      adjustedMetrics.downtime = (adjustedMetrics.downtime || 0) + 1; // Mark as down
    } else {
      adjustedMetrics.latency = (metrics.latency || 0) * effect.latencyMultiplier;
      if (adjustedMetrics.readLatency) {
        adjustedMetrics.readLatency *= effect.latencyMultiplier;
      }
      if (adjustedMetrics.writeLatency) {
        adjustedMetrics.writeLatency *= effect.latencyMultiplier;
      }
    }

    // Apply error rate increase
    adjustedMetrics.errorRate = this.combineErrorRates(
      metrics.errorRate,
      effect.errorRateIncrease
    );

    // Apply availability factor
    if (effect.availabilityFactor < 1) {
      // Reduce effective capacity
      adjustedMetrics.utilization = Math.min(
        1,
        (metrics.utilization || 0) / effect.availabilityFactor
      );

      // Add partial failure to error rate
      const unavailabilityError = 1 - effect.availabilityFactor;
      adjustedMetrics.errorRate = this.combineErrorRates(
        adjustedMetrics.errorRate,
        unavailabilityError * 0.5 // 50% of unavailable capacity causes errors
      );
    }

    // Add failure description to warnings
    if (!adjustedMetrics.warnings) {
      adjustedMetrics.warnings = [];
    }
    adjustedMetrics.warnings.push(effect.failureDescription);

    verboseLog('Applied failure effect', {
      originalLatency: metrics.latency,
      adjustedLatency: adjustedMetrics.latency,
      originalErrorRate: metrics.errorRate,
      adjustedErrorRate: adjustedMetrics.errorRate,
      failureDescription: effect.failureDescription,
    });

    return adjustedMetrics;
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
