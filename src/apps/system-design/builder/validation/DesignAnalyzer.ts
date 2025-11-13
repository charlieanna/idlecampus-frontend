import { SystemGraph } from '../types/graph';
import { Scenario } from '../types/problemDefinition';
import { isDatabaseComponentType } from '../utils/database';

/**
 * Deep analysis of system design
 *
 * Provides detailed insights beyond pass/fail:
 * - Component utilization breakdown
 * - Cost breakdown by component
 * - Architectural patterns detected
 * - Potential optimizations
 * - Failure modes
 */

export interface ComponentAnalysis {
  id: string;
  type: string;
  utilization: number;  // 0-1
  capacity: {
    current: number;
    used: number;
    headroom: number; // %
  };
  cost: {
    monthly: number;
    breakdown: { item: string; cost: number }[];
  };
  status: 'healthy' | 'warning' | 'saturated' | 'over-provisioned';
  issues: string[];
  recommendations: string[];
}

export interface ArchitecturalPattern {
  name: string;
  detected: boolean;
  components: string[];
  description: string;
  pros: string[];
  cons: string[];
}

export interface DesignAnalysisResult {
  summary: {
    totalComponents: number;
    totalConnections: number;
    estimatedMonthlyCost: number;
    overallHealth: 'healthy' | 'warning' | 'critical';
  };
  componentAnalysis: ComponentAnalysis[];
  patterns: ArchitecturalPattern[];
  optimizations: {
    potential: string;
    impact: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }[];
  failureModes: {
    scenario: string;
    probability: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];
}

export class DesignAnalyzer {

  /**
   * Perform deep analysis of a system design
   */
  analyze(graph: SystemGraph, scenario: Scenario): DesignAnalysisResult {
    const componentAnalysis = this.analyzeComponents(graph, scenario);
    const patterns = this.detectPatterns(graph);
    const optimizations = this.findOptimizations(graph, componentAnalysis);
    const failureModes = this.analyzeFailureModes(graph);

    const totalCost = componentAnalysis.reduce((sum, c) => sum + c.cost.monthly, 0);
    const criticalComponents = componentAnalysis.filter(c => c.status === 'saturated').length;
    const warningComponents = componentAnalysis.filter(c => c.status === 'warning').length;

    return {
      summary: {
        totalComponents: graph.components.length,
        totalConnections: graph.connections.length,
        estimatedMonthlyCost: totalCost,
        overallHealth: criticalComponents > 0 ? 'critical' :
                       warningComponents > 0 ? 'warning' : 'healthy',
      },
      componentAnalysis,
      patterns,
      optimizations,
      failureModes,
    };
  }

  /**
   * Analyze each component in detail
   */
  private analyzeComponents(graph: SystemGraph, scenario: Scenario): ComponentAnalysis[] {
    return graph.components.map(component => {
      const analysis: ComponentAnalysis = {
        id: component.id,
        type: component.type,
        utilization: 0,
        capacity: { current: 0, used: 0, headroom: 0 },
        cost: { monthly: 0, breakdown: [] },
        status: 'healthy',
        issues: [],
        recommendations: [],
      };

      if (isDatabaseComponentType(component.type)) {
        return this.analyzeDatabase(component, scenario, analysis);
      }

      switch (component.type) {
        case 'app_server':
          return this.analyzeAppServer(component, scenario, analysis);
        case 'redis':
          return this.analyzeCache(component, scenario, analysis);
        case 'load_balancer':
          return this.analyzeLoadBalancer(component, scenario, analysis);
        case 's3':
          return this.analyzeObjectStorage(component, scenario, analysis);
        case 'cdn':
          return this.analyzeCDN(component, scenario, analysis);
        default:
          return analysis;
      }
    });
  }

  private analyzeAppServer(component: any, scenario: Scenario, analysis: ComponentAnalysis): ComponentAnalysis {
    const instances = component.config.instances || 1;
    const capacityPerInstance = 1000; // RPS per instance
    const totalCapacity = instances * capacityPerInstance;
    const usedCapacity = scenario.traffic.rps;

    analysis.capacity = {
      current: totalCapacity,
      used: usedCapacity,
      headroom: ((totalCapacity - usedCapacity) / totalCapacity * 100),
    };
    analysis.utilization = usedCapacity / totalCapacity;

    // Cost breakdown
    const costPerInstance = 50;
    analysis.cost = {
      monthly: instances * costPerInstance,
      breakdown: [
        { item: `${instances} instances @ $${costPerInstance}/mo`, cost: instances * costPerInstance },
      ],
    };

    // Status
    if (analysis.utilization > 0.9) {
      analysis.status = 'saturated';
      analysis.issues.push(`High utilization (${(analysis.utilization * 100).toFixed(0)}%)`);
      analysis.recommendations.push('Add more instances or scale up');
    } else if (analysis.utilization > 0.7) {
      analysis.status = 'warning';
      analysis.recommendations.push('Monitor closely, consider scaling');
    } else if (analysis.utilization < 0.3) {
      analysis.status = 'over-provisioned';
      analysis.recommendations.push(`Reduce instances (currently ${(analysis.utilization * 100).toFixed(0)}% utilized)`);
    }

    return analysis;
  }

  private analyzeDatabase(component: any, scenario: Scenario, analysis: ComponentAnalysis): ComponentAnalysis {
    const readCapacity = component.config.readCapacity || 100;
    const writeCapacity = component.config.writeCapacity || 100;
    const readRatio = scenario.traffic.readWriteRatio || 0.5;

    const reads = scenario.traffic.rps * readRatio;
    const writes = scenario.traffic.rps * (1 - readRatio);

    const readUtil = reads / readCapacity;
    const writeUtil = writes / writeCapacity;
    analysis.utilization = Math.max(readUtil, writeUtil);

    analysis.capacity = {
      current: Math.min(readCapacity, writeCapacity),
      used: Math.max(reads, writes),
      headroom: (1 - analysis.utilization) * 100,
    };

    // Cost breakdown
    const baseCost = 100;
    const replicationEnabled = typeof component.config.replication === 'boolean'
      ? component.config.replication
      : component.config.replication?.enabled || false;
    const replicationCost = replicationEnabled ? 100 : 0;
    analysis.cost = {
      monthly: baseCost + replicationCost,
      breakdown: [
        { item: 'Base database', cost: baseCost },
      ],
    };
    if (replicationCost > 0) {
      analysis.cost.breakdown.push({ item: 'Replication', cost: replicationCost });
    }

    // Status and recommendations
    if (readUtil > 0.9) {
      analysis.status = 'saturated';
      analysis.issues.push(`Read capacity saturated (${reads.toFixed(0)}/${readCapacity} RPS)`);
      analysis.recommendations.push('Increase read capacity or add read replicas');
    }
    if (writeUtil > 0.9) {
      analysis.status = 'saturated';
      analysis.issues.push(`Write capacity saturated (${writes.toFixed(0)}/${writeCapacity} RPS)`);
      analysis.recommendations.push('Increase write capacity or implement write buffering');
    }
    if (readUtil > 0.8 && readRatio > 0.8) {
      analysis.recommendations.push('Consider adding a cache layer (read-heavy workload)');
    }

    return analysis;
  }

  private analyzeCache(component: any, scenario: Scenario, analysis: ComponentAnalysis): ComponentAnalysis {
    const memorySizeGB = component.config.memorySizeGB || 1;
    const hitRatio = component.config.hitRatio || 0.9;

    analysis.capacity = {
      current: memorySizeGB * 1000, // MB
      used: memorySizeGB * 0.7 * 1000, // Assume 70% usage
      headroom: 30,
    };
    analysis.utilization = 0.7;

    // Cost
    const costPerGB = 20;
    analysis.cost = {
      monthly: memorySizeGB * costPerGB,
      breakdown: [
        { item: `${memorySizeGB}GB Redis @ $${costPerGB}/GB`, cost: memorySizeGB * costPerGB },
      ],
    };

    // Analyze effectiveness
    if (hitRatio < 0.7) {
      analysis.status = 'warning';
      analysis.issues.push(`Low cache hit ratio (${(hitRatio * 100).toFixed(0)}%)`);
      analysis.recommendations.push('Increase cache size or review caching strategy');
    } else if (hitRatio > 0.95) {
      analysis.recommendations.push('Excellent cache hit ratio - well optimized');
    }

    const dbLoadReduction = 1 / (1 - hitRatio);
    analysis.recommendations.push(
      `Cache reduces DB load by ${dbLoadReduction.toFixed(1)}x (${(hitRatio * 100).toFixed(0)}% hit ratio)`
    );

    return analysis;
  }

  private analyzeLoadBalancer(component: any, scenario: Scenario, analysis: ComponentAnalysis): ComponentAnalysis {
    analysis.capacity = {
      current: 100000, // LB can handle 100k RPS
      used: scenario.traffic.rps,
      headroom: ((100000 - scenario.traffic.rps) / 100000 * 100),
    };
    analysis.utilization = scenario.traffic.rps / 100000;

    analysis.cost = {
      monthly: 30,
      breakdown: [{ item: 'Load Balancer', cost: 30 }],
    };

    analysis.status = 'healthy';
    analysis.recommendations.push('Distributes traffic across multiple app servers');

    return analysis;
  }

  private analyzeObjectStorage(component: any, scenario: Scenario, analysis: ComponentAnalysis): ComponentAnalysis {
    // Assume storing 1TB
    const storageTB = 1;
    const storageCost = 25 * storageTB;

    // Transfer cost
    const avgFileSize = scenario.traffic.avgFileSize || 0.001; // MB
    const transferPerMonth = scenario.traffic.rps * avgFileSize * 2.6e6 / 1000; // GB
    const transferCost = transferPerMonth * 0.09; // $0.09/GB

    analysis.cost = {
      monthly: storageCost + transferCost,
      breakdown: [
        { item: `${storageTB}TB storage`, cost: storageCost },
        { item: `${transferPerMonth.toFixed(0)}GB transfer`, cost: transferCost },
      ],
    };

    if (transferCost > 100) {
      analysis.status = 'warning';
      analysis.issues.push('High egress costs');
      analysis.recommendations.push('Consider adding CDN to reduce S3 transfer costs');
    }

    return analysis;
  }

  private analyzeCDN(component: any, scenario: Scenario, analysis: ComponentAnalysis): ComponentAnalysis {
    const avgFileSize = scenario.traffic.avgFileSize || 0.001;
    const transferPerMonth = scenario.traffic.rps * avgFileSize * 2.6e6 / 1000;
    const cdnCost = 50 + (transferPerMonth * 0.01); // Base + $0.01/GB

    analysis.cost = {
      monthly: cdnCost,
      breakdown: [
        { item: 'CDN base', cost: 50 },
        { item: `${transferPerMonth.toFixed(0)}GB transfer @ $0.01/GB`, cost: transferPerMonth * 0.01 },
      ],
    };

    if (avgFileSize < 0.1) {
      analysis.status = 'warning';
      analysis.issues.push('CDN may be overkill for small responses');
      analysis.recommendations.push('Consider if CDN provides value for small payloads');
    }

    return analysis;
  }

  /**
   * Detect architectural patterns
   */
  private detectPatterns(graph: SystemGraph): ArchitecturalPattern[] {
    const patterns: ArchitecturalPattern[] = [];

    // 3-tier architecture
    const hasAppServer = graph.components.some(c => c.type === 'app_server');
    const hasDB = graph.components.some(c => isDatabaseComponentType(c.type));
    if (hasAppServer && hasDB) {
      patterns.push({
        name: '3-Tier Architecture',
        detected: true,
        components: ['client', 'app_server', 'database'],
        description: 'Classic presentation-logic-data separation',
        pros: ['Clear separation of concerns', 'Easy to understand', 'Scalable'],
        cons: ['Can have single points of failure', 'May be overkill for simple apps'],
      });
    }

    // Caching layer
    const hasCache = graph.components.some(c => c.type === 'redis');
    if (hasCache) {
      patterns.push({
        name: 'Cache-Aside Pattern',
        detected: true,
        components: ['app_server', 'redis', 'database'],
        description: 'App checks cache before hitting database',
        pros: ['Reduces database load', 'Improves latency', 'Cost-effective'],
        cons: ['Cache invalidation complexity', 'Eventual consistency'],
      });
    }

    // Load balancing
    const hasLB = graph.components.some(c => c.type === 'load_balancer');
    const appServers = graph.components.filter(c => c.type === 'app_server');
    const totalInstances = appServers.reduce((sum, s) => sum + (s.config.instances || 1), 0);
    if (hasLB && totalInstances > 1) {
      patterns.push({
        name: 'Horizontal Scaling',
        detected: true,
        components: ['load_balancer', 'app_server (multiple)'],
        description: 'Distribute load across multiple servers',
        pros: ['High availability', 'Better throughput', 'No single point of failure'],
        cons: ['Higher cost', 'Complexity in session management'],
      });
    }

    // CDN pattern
    const hasCDN = graph.components.some(c => c.type === 'cdn');
    const hasS3 = graph.components.some(c => c.type === 's3');
    if (hasCDN && hasS3) {
      patterns.push({
        name: 'CDN + Object Storage',
        detected: true,
        components: ['cdn', 's3'],
        description: 'Serve static content from edge locations',
        pros: ['Low latency globally', 'Reduced origin load', 'Lower bandwidth costs'],
        cons: ['Cache invalidation challenges', 'Not suitable for dynamic content'],
      });
    }

    return patterns;
  }

  /**
   * Find potential optimizations
   */
  private findOptimizations(
    graph: SystemGraph,
    componentAnalysis: ComponentAnalysis[]
  ): DesignAnalysisResult['optimizations'] {
    const optimizations: DesignAnalysisResult['optimizations'] = [];

    // Over-provisioned components
    const overProvisioned = componentAnalysis.filter(c => c.status === 'over-provisioned');
    for (const comp of overProvisioned) {
      optimizations.push({
        potential: `Reduce ${comp.type} capacity (${(comp.utilization * 100).toFixed(0)}% utilized)`,
        impact: `Save ~$${(comp.cost.monthly * 0.3).toFixed(0)}/month`,
        difficulty: 'easy',
      });
    }

    // Add cache if read-heavy without cache
    const hasCache = graph.components.some(c => c.type === 'redis');
    const dbAnalysis = componentAnalysis.find(c => isDatabaseComponentType(c.type));
    if (!hasCache && dbAnalysis && dbAnalysis.utilization > 0.7) {
      optimizations.push({
        potential: 'Add Redis cache to reduce database load',
        impact: 'Could reduce DB load by 5-10x with 90% hit ratio',
        difficulty: 'medium',
      });
    }

    // CDN for high bandwidth
    const hasCDN = graph.components.some(c => c.type === 'cdn');
    const hasS3 = graph.components.some(c => c.type === 's3');
    const s3Analysis = componentAnalysis.find(c => c.type === 's3');
    if (!hasCDN && hasS3 && s3Analysis) {
      const transferCost = s3Analysis.cost.breakdown.find(b => b.item.includes('transfer'));
      if (transferCost && transferCost.cost > 100) {
        optimizations.push({
          potential: 'Add CDN to reduce S3 egress costs',
          impact: `Save ~$${(transferCost.cost * 0.9).toFixed(0)}/month on bandwidth`,
          difficulty: 'medium',
        });
      }
    }

    return optimizations;
  }

  /**
   * Analyze potential failure modes
   */
  private analyzeFailureModes(graph: SystemGraph): DesignAnalysisResult['failureModes'] {
    const failureModes: DesignAnalysisResult['failureModes'] = [];

    // Single app server
    const appServers = graph.components.filter(c => c.type === 'app_server');
    const totalInstances = appServers.reduce((sum, s) => sum + (s.config.instances || 1), 0);
    const hasLB = graph.components.some(c => c.type === 'load_balancer');

    if (totalInstances === 1) {
      failureModes.push({
        scenario: 'App server failure',
        probability: 'medium',
        impact: 'high',
        mitigation: 'Add load balancer and multiple app server instances',
      });
    }

    // Single database without replication
    const databases = graph.components.filter(c => isDatabaseComponentType(c.type));
    const hasReplication = databases.some(db => db.config.replication);

    if (databases.length > 0 && !hasReplication) {
      failureModes.push({
        scenario: 'Database failure',
        probability: 'low',
        impact: 'high',
        mitigation: 'Enable database replication for high availability',
      });
    }

    // Cache failure without circuit breaker
    const hasCache = graph.components.some(c => c.type === 'redis');
    if (hasCache) {
      failureModes.push({
        scenario: 'Cache failure cascades to database',
        probability: 'low',
        impact: 'medium',
        mitigation: 'Implement circuit breaker and fallback to database',
      });
    }

    return failureModes;
  }
}
