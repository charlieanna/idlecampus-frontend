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
   * Find app servers that can handle specific API patterns
   * Returns IDs of app servers that handle the given method and path
   */
  private findAppServersForAPI(method: string, path: string, graph: SystemGraph): string[] {
    const nodes = graph.components.filter(node => node.type === 'app_server');

    const handlingServers = findHandlingServers(nodes, method, path);

    // If no servers have API patterns defined, return all app servers (backward compatibility)
    if (handlingServers.length === 0) {
      const defaultServers = nodes.filter(node =>
        !node.config.handledAPIs || node.config.handledAPIs.length === 0
      );
      return defaultServers.map(s => s.id);
    }

    return handlingServers.map(s => s.id);
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
    // Log for all NFR tests to debug failures
    const shouldLog = testCase.type !== 'functional';
    
    // Log the graph config before building components
    if (shouldLog) {
      const appServerNode = graph.components.find(c => c.type === 'app_server');
      if (appServerNode) {
        console.log(`\n🔵 ${testCase.name} (${testCase.requirement})`);
        console.log(`  📋 Graph has app_server with config:`, JSON.stringify(appServerNode.config));
      } else {
        console.log(`\n🔵 ${testCase.name} (${testCase.requirement})`);
        console.log(`  ⚠️ No app_server found in graph!`);
      }
    }
    
    this.buildComponents(graph);

    // Build traffic flow engine with the same components
    // (Validation is done internally but doesn't block simulation)
    this.trafficFlowEngine.buildGraph(graph, this.components);

    // Extract traffic parameters with optional traffic pattern modeling
    // If readRps and writeRps are specified separately, calculate totalRps from them
    let readRps: number;
    let writeRps: number;
    let totalRps: number;
    
    // If readRps/writeRps are specified separately, use them and calculate totalRps
    if (testCase.traffic.readRps !== undefined && testCase.traffic.writeRps !== undefined) {
      readRps = testCase.traffic.readRps;
      writeRps = testCase.traffic.writeRps;
      totalRps = readRps + writeRps;
    } else if (testCase.traffic.rps !== undefined) {
      // If totalRps is specified, calculate readRps/writeRps from readRatio
      totalRps = testCase.traffic.rps;
      const readRatio = testCase.traffic.readRatio !== undefined ? testCase.traffic.readRatio : 0.5;
      readRps = totalRps * readRatio;
      writeRps = totalRps * (1 - readRatio);
    } else {
      // Fallback: default to 0
      totalRps = 0;
      readRps = 0;
      writeRps = 0;
    }
    
    if (shouldLog) {
      console.log(`  Traffic: ${totalRps} RPS (${readRps.toFixed(0)} reads, ${writeRps.toFixed(0)} writes)`);
    }

    // Apply traffic pattern if configured and feature flag is enabled
    if (isEnabled('ENABLE_TRAFFIC_PATTERNS') && this.trafficPatternConfig) {
      const patternResult = calculateTrafficAtTime(
        testCase.duration / 2, // Sample at midpoint
        this.trafficPatternConfig,
        testCase.traffic.readRatio || 0.9
      );

      totalRps = patternResult.rps;
      readRps = patternResult.readRps;
      writeRps = patternResult.writeRps;

      verboseLog('Traffic pattern applied', {
        originalRps: testCase.traffic.rps,
        patternRps: totalRps,
        patternPhase: patternResult.patternPhase,
        isSpike: patternResult.isSpike,
      });
    }

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

    // Track failure effects across components
    const failureEffects = new Map<string, ReturnType<typeof calculateFailureEffect>>();
    if (isEnabled('ENABLE_FAILURE_INJECTION') && this.failureInjections.length > 0) {
      for (const [compId] of this.components) {
        const effect = calculateFailureEffect(compId, context.currentTime, this.failureInjections);
        if (effect.isAffected) {
          failureEffects.set(compId, effect);
          verboseLog('Failure effect on component', {
            componentId: compId,
            effect: effect.failureDescription,
          });
        }
      }
    }

    // Determine entry point and key components via graph connections
    const entryId =
      this.findNodeIdByType('client') ||
      this.findNodeIdByType('load_balancer') ||
      this.findNodeIdByType('app_server');

    // Find app servers based on API patterns (if specified)
    // For simulation, we'll distribute traffic among capable servers
    // In MVP, we'll assume read operations go to servers handling GET requests
    // and write operations go to servers handling POST/PUT/DELETE
    const readAppServerIds = this.findAppServersForAPI('GET', '/api/v1/*', graph);
    const writeAppServerIds = this.findAppServersForAPI('POST', '/api/v1/*', graph);

    // For backward compatibility, if no API-specific servers found, use any app server
    const appId = readAppServerIds.length > 0
      ? readAppServerIds[0]
      : writeAppServerIds.length > 0
        ? writeAppServerIds[0]
        : this.findNodeIdByType('app_server');

    // Find all database nodes (support for multi-database/sharding)
    const allDbIds = isEnabled('ENABLE_MULTI_DB')
      ? findAllDatabaseNodes(this.components)
      : [];

    // Fallback to single database for backward compatibility
    const dbId = allDbIds.length > 0
      ? allDbIds[0]
      : this.findNodeIdByType('database') ||
        this.findNodeIdByType('postgresql') ||
        this.findNodeIdByType('mongodb') ||
        this.findNodeIdByType('cassandra');

    const appServer = appId ? (this.components.get(appId) as AppServer) : undefined;
    const db = dbId ? (this.components.get(dbId) as PostgreSQL | MongoDB | Cassandra) : undefined;

    // Track if we're using multi-database mode
    const useMultiDb = isEnabled('ENABLE_MULTI_DB') && allDbIds.length > 1;

    verboseLog('Database configuration', {
      singleDbId: dbId,
      allDbIds,
      useMultiDb,
    });

    // Find paths based on connections
    let toAppPath: string[] | null = null;
    if (entryId && appId) {
      toAppPath = this.findPath(entryId, 'read_write', (n) => n === appId);
    }

    // Optional cache (check both 'redis' and 'cache' types)
    const cacheId = this.findNodeIdByType('redis') || this.findNodeIdByType('cache');
    const toCachePath = appId && cacheId ? this.findPath(appId, 'read', (n) => n === cacheId) : null;

    // Read DB path: In cache-aside pattern, reads go app_server → database (not cache → database)
    // Cache is checked first, but on miss, app_server queries database directly
    // So we always use app_server as the source for database reads
    const toDbReadPath = dbId && appId ? this.findPath(appId, 'read', (n) => n === dbId) : null;

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
    
    // Check path availability
    if (shouldLog && (!readPathAvailable || !writePathAvailable)) {
      console.log('❌ PATH ISSUE:', {
        readPathAvailable,
        writePathAvailable,
        hasApp: !!appServer,
        hasDb: !!db,
        toAppPath: !!toAppPath,
        toDbReadPath: !!toDbReadPath,
        toDbWritePath: !!toDbWritePath,
      });
    }

    if (!appServer || !db || !toAppPath) {
      if (shouldLog) {
        console.log('❌ EARLY RETURN - Missing components:', {
          hasAppServer: !!appServer,
          hasDb: !!db,
          hasToAppPath: !!toAppPath,
        });
      }
      return {
        metrics: {
          p50Latency: 0,
          p90Latency: 0,
          p95Latency: 0,
          p99Latency: 0,
          p999Latency: 0,
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
      if (comp.type === 'redis' || isDatabaseComponentType(comp.type) || comp.type === 'cdn' || comp.type === 's3') continue;
      pathToAppComponents.push(comp);
    }

    for (const comp of pathToAppComponents) {
      let metrics = comp.simulate(totalRps, context);

      // Apply failure injection effects if applicable
      const failureEffect = failureEffects.get(comp.id);
      if (failureEffect && failureEffect.isAffected) {
        metrics = this.applyFailureEffect(metrics, failureEffect);
      }

      componentMetrics.set(comp.id, metrics);
      totalLatency += metrics.latency;
      const errorBefore = combinedErrorRate;
      combinedErrorRate = this.combineErrorRates(combinedErrorRate, metrics.errorRate);
      if (shouldLog && comp.type === 'app_server') {
        const appMetrics = metrics as any;
        const instanceType = (comp as any).config?.instanceType || 't3.medium';
        const instances = appMetrics.instances || 1;
        const rpsPerInstance = appMetrics.rpsPerInstance || 0;
        const capacityPerInstance = instanceType === 't3.medium' ? 500 : (instanceType === 't3.small' ? 250 : 100);
        // Always log for app_server in NFR tests to debug
        console.log(`  ⚠️ ${comp.type}: ${instances} instances (config.instances=${(comp as any).config?.instances}), ${rpsPerInstance.toFixed(0)} RPS/instance, ${((metrics.utilization || 0) * 100).toFixed(1)}% util, ${(metrics.errorRate * 100).toFixed(1)}% errors`);
      }
    }

    // App server already included above as part of pathToAppComponents

    // Cache (if present and reachable)
    const cache = cacheId ? (this.components.get(cacheId) as RedisCache) : undefined;
    let dbReadRps = readRps;
    let dbWriteRps = writeRps;

    let cacheLatency = 0;
    let missRatio = 1;
    if (cache && toCachePath) {
      // Apply dynamic cache hit ratio modeling if enabled
      let dynamicHitRatio: number | undefined;

      if (isEnabled('ENABLE_DYNAMIC_CACHE_HIT')) {
        // Get cache configuration from component
        const cacheConfig = cache.config || {};
        const cacheSizeGB = (cacheConfig.memorySizeGB as number) || 10;
        const cacheTTL = (cacheConfig.ttlSeconds as number) || 3600;

        // Estimate working set from database configuration
        const dbComponent = db;
        const dbConfig = dbComponent?.config || {};
        const totalDataSizeGB = (dbConfig.storageSizeGB as number) || 100;
        const hotDataPercentage = 0.2; // Assume 20% of data is hot
        const avgItemSizeKB = 1; // Default 1KB per cached item

        const cacheHitResult = calculateDynamicHitRatio(
          {
            maxSizeGB: cacheSizeGB,
            ttlSeconds: cacheTTL,
            evictionPolicy: 'lru',
          },
          {
            totalDataSizeGB,
            hotDataPercentage,
            avgItemSizeKB,
            readRps,
            writeRps,
          },
          this.cacheAccessPattern
        );

        dynamicHitRatio = cacheHitResult.hitRatio;

        verboseLog('Dynamic cache hit ratio calculated', {
          hitRatio: dynamicHitRatio,
          effectiveCapacity: cacheHitResult.effectiveCapacity,
          evictionRate: cacheHitResult.evictionRate,
          warnings: cacheHitResult.warnings,
        });
      }

      const cacheMetrics = cache.simulate(readRps, context);

      // Apply failure injection effects to cache
      let finalCacheMetrics = cacheMetrics;
      const cacheFailureEffect = failureEffects.get(cache.id);
      if (cacheFailureEffect && cacheFailureEffect.isAffected) {
        finalCacheMetrics = this.applyFailureEffect(cacheMetrics, cacheFailureEffect);
      }

      componentMetrics.set(cache.id, finalCacheMetrics);
      cacheLatency = finalCacheMetrics.latency;
      totalCost += finalCacheMetrics.cost;

      // Use dynamic hit ratio if calculated, otherwise use component's calculation
      if (dynamicHitRatio !== undefined) {
        dbReadRps = readRps * (1 - dynamicHitRatio);
        missRatio = 1 - dynamicHitRatio;
      } else {
        dbReadRps = finalCacheMetrics.cacheMisses || readRps;
        missRatio = readRps > 0 ? dbReadRps / readRps : 0;
      }
    }

    // Database (with multi-database/sharding support)
    let dbMetrics: ComponentMetrics;

    if (useMultiDb && allDbIds.length > 1) {
      // Multi-database mode: distribute traffic across all databases
      const shardingConfig = getDefaultShardingConfig(allDbIds.length);
      const trafficDistribution = distributeTrafficAcrossShards(
        allDbIds,
        dbReadRps,
        dbWriteRps,
        shardingConfig
      );

      verboseLog('Multi-database traffic distribution', {
        numShards: allDbIds.length,
        distribution: trafficDistribution.map((d) => ({
          shardId: d.shardId,
          percentage: d.trafficPercentage.toFixed(2),
        })),
      });

      // Simulate each database shard
      const shardMetricsMap = new Map<string, ComponentMetrics>();
      for (const dist of trafficDistribution) {
        const shardDb = this.components.get(dist.shardId) as
          | PostgreSQL
          | MongoDB
          | Cassandra;
        if (shardDb) {
          const shardMetrics = shardDb.simulateWithReadWrite(
            dist.readRps,
            dist.writeRps,
            context
          );
          shardMetricsMap.set(dist.shardId, shardMetrics);
          componentMetrics.set(dist.shardId, shardMetrics);
        }
      }

      // Aggregate metrics from all shards
      const aggregated = aggregateShardMetrics(
        shardMetricsMap,
        trafficDistribution
      );

      // Create combined dbMetrics for downstream calculations
      dbMetrics = {
        latency: aggregated.maxReadLatency,
        readLatency: aggregated.maxReadLatency,
        writeLatency: aggregated.maxWriteLatency,
        errorRate: aggregated.combinedErrorRate,
        utilization: aggregated.maxUtilization,
        cost: aggregated.totalCost,
      };

      combinedErrorRate = this.combineErrorRates(
        combinedErrorRate,
        aggregated.combinedErrorRate
      );
      totalCost += aggregated.totalCost;

      // Check for hot shards and add to bottlenecks later
      if (aggregated.hotShards.length > 0) {
        verboseLog('Hot shards detected', aggregated.hotShards);
      }

      // Availability based on worst shard
      for (const [, metrics] of shardMetricsMap) {
        if (metrics.downtime) {
          availability = Math.min(
            availability,
            Math.max(0, 1 - metrics.downtime / testCase.duration)
          );
        }
      }
    } else {
      // Single database mode (legacy behavior)
      // Log database config before simulation
      if (shouldLog) {
        const dbConfig = (db as any).config;
        console.log(`  Database config:`, {
          replicationMode: dbConfig?.replicationMode,
          replicas: dbConfig?.replication?.replicas,
          shards: dbConfig?.sharding?.shards,
        });
      }
      
      dbMetrics = db.simulateWithReadWrite(dbReadRps, dbWriteRps, context);
      if (shouldLog && (dbMetrics.errorRate > 0 || dbMetrics.utilization > 0.5)) {
        console.log(`  Database: ${dbReadRps.toFixed(0)} read, ${dbWriteRps.toFixed(0)} write RPS → ${((dbMetrics.utilization || 0) * 100).toFixed(1)}% util, ${(dbMetrics.errorRate * 100).toFixed(1)}% errors`);
      }

      // Apply database capacity modeling if enabled
      if (isEnabled('ENABLE_DB_CONNECTION_POOL')) {
        const dbConfig = db.config || {};
        const instanceType = (dbConfig.instanceType as string) || 'db.t3.medium';
        const poolConfig = CONNECTION_POOL_DEFAULTS[instanceType] || CONNECTION_POOL_DEFAULTS['db.t3.medium'];

        const capacityResult = calculateEffectiveCapacity(
          dbMetrics.utilization ? dbMetrics.utilization * (dbReadRps + dbWriteRps) * 10 : 1000, // Estimate base capacity
          dbReadRps + dbWriteRps,
          {
            poolConfig,
            queryComplexity: this.queryComplexity,
            ioPattern: this.ioPattern,
            avgQueryDurationMs: dbMetrics.latency || 10,
          }
        );

        verboseLog('Database capacity modeling', {
          effectiveCapacity: capacityResult.effectiveCapacity,
          connectionPoolUtilization: capacityResult.connectionPoolUtilization,
          queryLatencyMultiplier: capacityResult.queryLatencyMultiplier,
          ioLatencyMultiplier: capacityResult.ioLatencyMultiplier,
          warnings: capacityResult.warnings,
        });

        // Adjust metrics based on capacity modeling
        const capacityFactor = capacityResult.effectiveCapacity / Math.max(dbReadRps + dbWriteRps, 1);
        if (capacityFactor < 1) {
          // Database is overloaded
          dbMetrics.errorRate = this.combineErrorRates(
            dbMetrics.errorRate,
            Math.min(0.5, (1 - capacityFactor) * 0.3) // Up to 30% additional errors from overload
          );
          dbMetrics.latency = (dbMetrics.latency || 10) * capacityResult.queryLatencyMultiplier;
          if (dbMetrics.readLatency) {
            dbMetrics.readLatency *= capacityResult.queryLatencyMultiplier;
          }
          if (dbMetrics.writeLatency) {
            dbMetrics.writeLatency *= capacityResult.queryLatencyMultiplier;
          }
        }

        // Add capacity warnings to component metrics
        if (capacityResult.warnings.length > 0) {
          dbMetrics.warnings = [...(dbMetrics.warnings || []), ...capacityResult.warnings];
        }
      }

      // Apply failure injection effects to database
      const dbFailureEffect = failureEffects.get(db.id);
      if (dbFailureEffect && dbFailureEffect.isAffected) {
        dbMetrics = this.applyFailureEffect(dbMetrics, dbFailureEffect);
      }

      componentMetrics.set(db.id, dbMetrics);
      const errorBeforeDb = combinedErrorRate;
      combinedErrorRate = this.combineErrorRates(
        combinedErrorRate,
        dbMetrics.errorRate
      );
      if (shouldLog && dbMetrics.errorRate > 0) {
        console.log(`  ⚠️ Database: ${(dbMetrics.errorRate * 100).toFixed(1)}% errors, ${((dbMetrics.utilization || 0) * 100).toFixed(1)}% util`);
      }
      totalCost += dbMetrics.cost;
      if (dbMetrics.downtime) {
        availability = Math.max(0, 1 - dbMetrics.downtime / testCase.duration);
      }
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
    
    if (shouldLog && combinedErrorRate > 0) {
      console.log(`  ⚠️ Combined error rate: ${(combinedErrorRate * 100).toFixed(1)}%`);
    }
    
    if (!readPathAvailable || !writePathAvailable) {
      const unreachableFrac = (readPathAvailable ? 0 : readFrac) + (writePathAvailable ? 0 : writeFrac);
      const errorBeforePath = combinedErrorRate;
      if (shouldLog) {
        console.log('❌ PATH UNAVAILABLE - Error rate will be 100% for', {
          unreachableFrac: (unreachableFrac * 100).toFixed(1) + '%',
          readPathAvailable,
          writePathAvailable,
        });
      }
      combinedErrorRate = this.combineErrorRates(combinedErrorRate, Math.min(1, unreachableFrac));
      if (shouldLog) {
        console.log(`  After path check: combinedErrorRate: ${(errorBeforePath * 100).toFixed(2)}% → ${(combinedErrorRate * 100).toFixed(2)}%`);
      }
      // If everything is unreachable, knock availability to 0
      if (unreachableFrac >= 0.999) availability = 0;
    }

    let p50Latency =
      totalRps > 0
        ? (readRps * readLatency + writeRps * writeLatency) / totalRps
        : 0;

    // Apply reliability patterns (retry, circuit breaker, timeout, queue)
    let reliabilityWarnings: string[] = [];
    let effectiveRps = totalRps;

    // Only apply if any reliability feature flag is enabled
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
        p50Latency * 0.3, // Estimate variance as 30% of mean
        this.retryConfig,
        this.circuitBreakerConfig,
        this.timeoutConfig,
        this.queueConfig
      );

      // Update metrics with reliability effects
      effectiveRps = reliabilityResult.effectiveRps;
      combinedErrorRate = this.combineErrorRates(
        combinedErrorRate,
        reliabilityResult.effectiveErrorRate - combinedErrorRate
      );
      p50Latency = reliabilityResult.effectiveLatencyMs;
      reliabilityWarnings = reliabilityResult.warnings;

      verboseLog('Reliability patterns applied', {
        originalRps: totalRps,
        effectiveRps: reliabilityResult.effectiveRps,
        originalErrorRate: combinedErrorRate,
        effectiveErrorRate: reliabilityResult.effectiveErrorRate,
        originalLatency: p50Latency,
        effectiveLatency: reliabilityResult.effectiveLatencyMs,
        warnings: reliabilityResult.warnings,
      });

      // Add reliability warnings to app server metrics (if present)
      if (appId && reliabilityWarnings.length > 0) {
        const appMetrics = componentMetrics.get(appId);
        if (appMetrics) {
          appMetrics.warnings = [
            ...(appMetrics.warnings || []),
            ...reliabilityWarnings,
          ];
        }
      }
    }

    // Calculate full percentile distribution
    // Uses feature flag to switch between legacy (hardcoded multipliers) and accurate (statistical) calculation
    const componentCount = pathToAppComponents.length + (cache ? 1 : 0) + 1; // +1 for DB
    const cacheHitRatio = cache ? (1 - missRatio) : 0;
    const maxUtilization = Math.max(
      ...Array.from(componentMetrics.values()).map(m => m.utilization || 0)
    );
    const loadFactor = Math.min(1, maxUtilization);

    verboseLog('Calculating percentiles', {
      p50Latency,
      componentCount,
      cacheHitRatio,
      loadFactor,
      useAccuratePercentiles: isEnabled('USE_ACCURATE_PERCENTILES'),
    });

    const percentiles = calculateRequestPercentiles(
      readLatency,
      writeLatency,
      readRps,
      writeRps,
      {
        componentCount,
        cacheHitRatio,
        loadFactor,
      }
    );

    const p90Latency = percentiles.p90;
    const p95Latency = percentiles.p95;
    const p99Latency = percentiles.p99;
    const p999Latency = percentiles.p999;

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

    const finalMetrics = {
      p50Latency,
      p90Latency,
      p95Latency,
      p99Latency,
      p999Latency,
      errorRate: combinedErrorRate,
      monthlyCost: totalCost,
      availability,
    };
    
    if (shouldLog) {
      const status = finalMetrics.errorRate > 0.01 ? '❌' : '✅';
      console.log(`  ${status} Result: ${(finalMetrics.errorRate * 100).toFixed(1)}% errors, ${finalMetrics.p99Latency.toFixed(0)}ms p99, $${finalMetrics.monthlyCost.toFixed(0)}/mo`);
    }
    
    return {
      metrics: finalMetrics,
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
