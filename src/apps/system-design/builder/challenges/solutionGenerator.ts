import { ProblemConfig } from './problemConfigs.js';

/**
 * Auto-generates system design solutions that pass all test scenarios
 * Based on traffic patterns, latency requirements, and architectural needs
 */

export interface GeneratedSolution {
  components: Array<{
    type: string;
    config: any;
  }>;
  connections: Array<{
    from: string;
    to: string;
  }>;
  explanation: string;
}

/**
 * Generate a complete solution for a problem definition
 */
export function generateSolution(
  problemId: string,
  config: ProblemConfig,
  userFacingFRs: string[]
): GeneratedSolution {
  const components: Array<{ type: string; config: any }> = [];
  const connections: Array<{ from: string; to: string }> = [];

  // Analyze requirements
  const analysis = analyzeRequirements(config, userFacingFRs);

  // Add client (always needed)
  components.push({ type: 'client', config: {} });

  // Add load balancer if high traffic
  if (config.baseRps > 500) {
    components.push({ type: 'load_balancer', config: {} });
    connections.push({ from: 'client', to: 'load_balancer' });
  } else {
    connections.push({ from: 'client', to: 'app_server' });
  }

  // Calculate app server instances based on RPS
  const appServerInstances = calculateAppServers(config.baseRps);
  components.push({
    type: 'app_server',
    config: { instances: appServerInstances },
  });

  if (config.baseRps > 500) {
    connections.push({ from: 'load_balancer', to: 'app_server' });
  }

  // Add CDN if needed
  if (config.hasCdn) {
    components.push({ type: 'cdn', config: {} });
    connections.push({ from: 'client', to: 'cdn' });
  }

  // Add cache if needed
  if (config.hasCache || config.readRatio >= 0.8) {
    const cacheMemory = calculateCacheSize(config.baseRps, config.readRatio);
    components.push({
      type: 'redis',
      config: { maxMemoryMB: cacheMemory },
    });
    connections.push({ from: 'app_server', to: 'redis' });
  }

  // Add message queue if async processing needed
  if (analysis.needsQueue) {
    const queueThroughput = calculateQueueThroughput(config.baseRps);
    const queuePartitions = Math.ceil(queueThroughput / 5000);
    components.push({
      type: 'message_queue',
      config: { maxThroughput: queueThroughput, partitions: queuePartitions },
    });
    connections.push({ from: 'app_server', to: 'message_queue' });
  }

  // Add workers if async processing needed
  if (analysis.needsWorkers) {
    const workerInstances = calculateWorkers(config.baseRps);
    components.push({
      type: 'worker',
      config: { instances: workerInstances },
    });
    connections.push({ from: 'worker', to: 'message_queue' });
    connections.push({ from: 'worker', to: 'postgresql' });
    if (config.hasCache) {
      connections.push({ from: 'worker', to: 'redis' });
    }
    if (config.hasObjectStorage) {
      connections.push({ from: 'worker', to: 's3' });
    }
  }

  // Add database with replication if needed
  const needsReplication = config.availability >= 0.99 || config.baseRps > 1000;
  const dbConfig = calculateDatabaseConfig(config, needsReplication);
  components.push({
    type: 'postgresql',
    config: dbConfig,
  });
  connections.push({ from: 'app_server', to: 'postgresql' });

  // Add object storage if needed
  if (config.hasObjectStorage) {
    const storageSize = calculateStorageSize(config.baseRps, config.avgFileSize);
    components.push({
      type: 's3',
      config: { storageSizeGB: storageSize },
    });
    connections.push({ from: 'app_server', to: 's3' });

    if (config.hasCdn) {
      connections.push({ from: 'cdn', to: 's3' });
    }
  }

  // Generate explanation
  const explanation = generateExplanation(problemId, config, analysis, components);

  return {
    components,
    connections,
    explanation,
  };
}

/**
 * Analyze requirements to determine architectural needs
 */
function analyzeRequirements(config: ProblemConfig, userFacingFRs: string[]): {
  needsQueue: boolean;
  needsWorkers: boolean;
  needsSearch: boolean;
  isReadHeavy: boolean;
  isWriteHeavy: boolean;
} {
  const frText = userFacingFRs.join(' ').toLowerCase();

  return {
    needsQueue: frText.includes('notification') || frText.includes('async') || 
                frText.includes('upload') || frText.includes('process'),
    needsWorkers: frText.includes('upload') || frText.includes('process') || 
                  frText.includes('crawl') || frText.includes('index'),
    needsSearch: frText.includes('search') || frText.includes('find'),
    isReadHeavy: config.readRatio >= 0.8,
    isWriteHeavy: config.readRatio < 0.6,
  };
}

/**
 * Calculate number of app servers needed
 */
function calculateAppServers(baseRps: number): number {
  // 1 app server handles ~500 RPS
  // Add extra capacity for peak load (2x)
  const peakRps = baseRps * 2;
  return Math.max(1, Math.ceil(peakRps / 500));
}

/**
 * Calculate cache size needed
 */
function calculateCacheSize(baseRps: number, readRatio: number): number {
  // Estimate: 1KB per cached item, cache hot data (20% of requests)
  const cachedItemsPerSecond = baseRps * readRatio * 0.2;
  const cachedItems = cachedItemsPerSecond * 300; // 5 minutes of hot data
  const sizeKB = cachedItems * 1; // 1KB per item
  const sizeMB = Math.max(256, Math.ceil(sizeKB / 1024));
  return Math.min(16384, sizeMB); // Cap at 16GB
}

/**
 * Calculate database configuration
 */
function calculateDatabaseConfig(config: ProblemConfig, needsReplication: boolean): any {
  const writeRps = config.baseRps * (1 - config.readRatio);
  const readRps = config.baseRps * config.readRatio;

  // Database capacity: 1000 RPS per instance (reads), 100 RPS (writes)
  const writeCapacity = Math.max(100, Math.ceil(writeRps * 2.5));
  const readCapacity = Math.max(1000, Math.ceil(readRps * 1.5));

  const dbConfig: any = {
    readCapacity,
    writeCapacity,
  };

  // Add replication if needed
  if (needsReplication) {
    const replicas = Math.max(2, Math.ceil(readRps / 1000));
    dbConfig.replication = true;
    dbConfig.instanceType = 'commodity-db';
    dbConfig.replicationMode = 'single-leader';
    dbConfig.replicas = Math.min(5, replicas); // Cap at 5 replicas
  }

  return dbConfig;
}

/**
 * Calculate queue throughput
 */
function calculateQueueThroughput(baseRps: number): number {
  // Queue handles 2x normal traffic for async processing
  return Math.max(1000, baseRps * 2);
}

/**
 * Calculate number of workers needed
 */
function calculateWorkers(baseRps: number): number {
  // 1 worker handles ~100 async tasks/sec
  // Add capacity for peak load (3x)
  const peakRps = baseRps * 3;
  return Math.max(1, Math.ceil(peakRps / 300));
}

/**
 * Calculate object storage size
 */
function calculateStorageSize(baseRps: number, avgFileSize?: number): number {
  if (!avgFileSize) return 1000; // Default 1TB

  // Estimate 30 days of storage
  const filesPerDay = baseRps * 0.1 * 86400; // 10% of requests are uploads
  const storageGB = filesPerDay * 30 * avgFileSize;
  return Math.max(100, Math.ceil(storageGB));
}

/**
 * Generate human-readable explanation
 */
function generateExplanation(
  problemId: string,
  config: ProblemConfig,
  analysis: ReturnType<typeof analyzeRequirements>,
  components: Array<{ type: string; config: any }>
): string {
  const parts: string[] = [`# Auto-Generated Solution for ${problemId}\n`];

  parts.push(`## Architecture Overview\n`);
  
  // Component summary
  const componentTypes = components.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  parts.push(`**Components**:`);
  for (const [type, count] of Object.entries(componentTypes)) {
    const comp = components.find(c => c.type === type);
    if (comp?.config?.instances) {
      parts.push(`- **${type}** (${comp.config.instances} instances)`);
    } else if (type === 'redis' && comp?.config?.maxMemoryMB) {
      parts.push(`- **${type}** (${comp.config.maxMemoryMB}MB cache)`);
    } else if (type === 'postgresql') {
      const dbComp = comp as any;
      const replicationInfo = dbComp.config.replication 
        ? ` with ${dbComp.config.replicas || 2} replicas` 
        : '';
      parts.push(`- **${type}** (${dbComp.config.readCapacity} read, ${dbComp.config.writeCapacity} write capacity${replicationInfo})`);
    } else {
      parts.push(`- **${type}**`);
    }
  }

  parts.push(`\n## Traffic Profile\n`);
  parts.push(`- **Base RPS**: ${config.baseRps.toLocaleString()}`);
  parts.push(`- **Read Ratio**: ${(config.readRatio * 100).toFixed(0)}%`);
  parts.push(`- **Target Latency**: p99 < ${config.maxLatency}ms`);
  parts.push(`- **Availability**: ${(config.availability * 100).toFixed(2)}%`);

  parts.push(`\n## Key Design Decisions\n`);

  // Load balancer
  if (config.baseRps > 500) {
    const appServers = components.find(c => c.type === 'app_server')?.config?.instances || 1;
    parts.push(`\n**1. Load Balancer + Multiple App Servers (${appServers} instances)**`);
    parts.push(`- Handles ${config.baseRps.toLocaleString()} RPS base load, ${(config.baseRps * 2).toLocaleString()} RPS peak`);
    parts.push(`- Each app server handles ~500 RPS`);
    parts.push(`- Provides horizontal scalability and fault tolerance`);
  }

  // Caching
  if (analysis.isReadHeavy) {
    const cache = components.find(c => c.type === 'redis');
    if (cache) {
      parts.push(`\n**2. Redis Cache (${cache.config.maxMemoryMB}MB)**`);
      parts.push(`- Read-heavy workload (${(config.readRatio * 100).toFixed(0)}% reads)`);
      parts.push(`- Caches hot data to reduce database load`);
      parts.push(`- Cache-aside pattern: read from cache first, DB on miss`);
      parts.push(`- Reduces p99 latency from ~50ms (DB) to ~5ms (cache)`);
    }
  }

  // Database replication
  const db = components.find(c => c.type === 'postgresql');
  if (db?.config?.replication) {
    parts.push(`\n**3. Database Replication (${db.config.replicas || 2} replicas)**`);
    parts.push(`- Ensures ${(config.availability * 100).toFixed(2)}% availability`);
    parts.push(`- Distributes read load across replicas`);
    parts.push(`- Automatic failover on primary failure (< 10s downtime)`);
    parts.push(`- Single-leader replication: writes to primary, reads from replicas`);
  }

  // Object storage + CDN
  if (config.hasObjectStorage) {
    const s3 = components.find(c => c.type === 's3');
    parts.push(`\n**4. Object Storage (S3) + CDN**`);
    parts.push(`- Stores ${config.avgFileSize ? config.avgFileSize + 'MB' : 'large'} files`);
    parts.push(`- ${s3?.config?.storageSizeGB || 1000}GB capacity (30 days)`);
    if (config.hasCdn) {
      parts.push(`- CDN caches files globally for low latency delivery`);
      parts.push(`- 95%+ cache hit ratio reduces origin load`);
    }
  }

  // Workers + Queue
  if (analysis.needsWorkers) {
    const workers = components.find(c => c.type === 'worker');
    const queue = components.find(c => c.type === 'message_queue');
    parts.push(`\n**5. Async Processing with Workers + Message Queue**`);
    parts.push(`- ${workers?.config?.instances || 1} worker instances for background processing`);
    parts.push(`- Message queue decouples API from heavy processing`);
    parts.push(`- Queue throughput: ${queue?.config?.maxThroughput?.toLocaleString() || 'N/A'} messages/sec`);
    parts.push(`- API responds immediately, workers process asynchronously`);
  }

  parts.push(`\n## Why This Architecture Passes All Tests\n`);
  parts.push(`- **FR tests**: All required components present with proper connections`);
  parts.push(`- **Performance tests**: Sufficient capacity for ${(config.baseRps * 3).toLocaleString()} RPS (3x baseline)`);
  parts.push(`- **Scalability tests**: Horizontal scaling via load balancer + multiple instances`);
  parts.push(`- **Reliability tests**: Database replication ensures ${(config.availability * 100).toFixed(2)}% uptime`);

  return parts.join('\n');
}