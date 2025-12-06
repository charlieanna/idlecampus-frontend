import { useMemo } from 'react';
import { SystemGraph } from '../types/graph';
import { ComponentType } from '../types/component';

interface CostBreakdownItem {
  componentType: string;
  displayName: string;
  count: number;
  unitCost: number;
  totalCost: number;
}

interface CostEstimate {
  totalCost: number;
  breakdown: CostBreakdownItem[];
  isUnderBudget: boolean;
  budgetRemaining: number;
  budgetUsedPercent: number;
}

const COST_PER_COMPONENT: Record<string, { base: number; perInstance?: number; perGB?: number; perReplica?: number }> = {
  app_server: { base: 30, perInstance: 30 },
  load_balancer: { base: 20 },
  postgresql: { base: 60, perReplica: 50 },
  mysql: { base: 60, perReplica: 50 },
  mongodb: { base: 80, perReplica: 40 },
  cassandra: { base: 100, perReplica: 60 },
  redis: { base: 15, perGB: 5 },
  cache: { base: 15, perGB: 5 },
  cdn: { base: 30 },
  s3: { base: 25 },
  message_queue: { base: 40 },
  worker: { base: 25, perInstance: 25 },
  elasticsearch: { base: 100 },
  dynamodb: { base: 50 },
  client: { base: 0 },
};

const DISPLAY_NAMES: Record<string, string> = {
  app_server: 'App Server',
  load_balancer: 'Load Balancer',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  mongodb: 'MongoDB',
  cassandra: 'Cassandra',
  redis: 'Redis Cache',
  cache: 'Cache',
  cdn: 'CDN',
  s3: 'Object Storage (S3)',
  message_queue: 'Message Queue',
  worker: 'Worker',
  elasticsearch: 'Elasticsearch',
  dynamodb: 'DynamoDB',
  client: 'Client',
};

function calculateComponentCost(type: ComponentType | string, config: Record<string, any> = {}): number {
  const pricing = COST_PER_COMPONENT[type];
  if (!pricing) return 0;

  let cost = pricing.base;

  const instances = config.instances || 1;
  if (pricing.perInstance && instances > 1) {
    cost = pricing.perInstance * instances;
  }

  const memorySizeGB = config.memorySizeGB || config.cacheSizeGB || 1;
  if (pricing.perGB) {
    cost = pricing.base + (pricing.perGB * memorySizeGB);
  }

  if (pricing.perReplica && config.replication?.enabled) {
    const replicas = config.replication.replicas || 1;
    cost += pricing.perReplica * replicas;
  }

  return cost;
}

export function useCostEstimate(
  systemGraph: SystemGraph | null,
  budgetTarget: number = 2500
): CostEstimate {
  return useMemo(() => {
    if (!systemGraph || !systemGraph.components || systemGraph.components.length === 0) {
      return {
        totalCost: 0,
        breakdown: [],
        isUnderBudget: true,
        budgetRemaining: budgetTarget,
        budgetUsedPercent: 0,
      };
    }

    const costByType: Record<string, { count: number; totalCost: number; unitCost: number }> = {};

    for (const component of systemGraph.components) {
      const type = component.type;
      const cost = calculateComponentCost(type, component.config || {});
      
      if (!costByType[type]) {
        costByType[type] = { count: 0, totalCost: 0, unitCost: cost };
      }
      costByType[type].count += 1;
      costByType[type].totalCost += cost;
    }

    const breakdown: CostBreakdownItem[] = Object.entries(costByType)
      .filter(([type]) => type !== 'client')
      .map(([type, data]) => ({
        componentType: type,
        displayName: DISPLAY_NAMES[type] || type,
        count: data.count,
        unitCost: data.unitCost,
        totalCost: data.totalCost,
      }))
      .sort((a, b) => b.totalCost - a.totalCost);

    const totalCost = breakdown.reduce((sum, item) => sum + item.totalCost, 0);
    const budgetRemaining = budgetTarget - totalCost;
    const budgetUsedPercent = Math.min(100, (totalCost / budgetTarget) * 100);

    return {
      totalCost,
      breakdown,
      isUnderBudget: totalCost <= budgetTarget,
      budgetRemaining,
      budgetUsedPercent,
    };
  }, [systemGraph, budgetTarget]);
}

export function calculateTotalCost(systemGraph: SystemGraph | null): number {
  if (!systemGraph || !systemGraph.components) return 0;
  
  return systemGraph.components.reduce((total, component) => {
    if (component.type === 'client') return total;
    return total + calculateComponentCost(component.type, component.config || {});
  }, 0);
}
