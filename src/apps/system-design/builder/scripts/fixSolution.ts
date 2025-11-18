/**
 * Universal Solution Fixing Script
 *
 * This script automatically fixes solutions across ALL system design challenges
 * by migrating from old config format to new commodity hardware model.
 *
 * Usage:
 *   import { fixSolution } from './scripts/fixSolution';
 *   const fixed = fixSolution(oldSolution, challengeContext);
 *
 * Features:
 * - Removes old capacity fields (readCapacity, writeCapacity)
 * - Converts replication boolean to object
 * - Adds required fields (instanceType, replicationMode, sharding)
 * - Fixes CDN config (removes cacheHitRatio, bandwidthGbps)
 * - Adds load balancer strategy
 * - Sets appropriate defaults based on challenge
 */

import { Solution } from '../types/testCase';

/**
 * Challenge context for making intelligent decisions
 */
export interface ChallengeContext {
  id: string; // Challenge ID (e.g., 'tinyurl', 'instagram')
  dataModel?: {
    entities: string[];
    primaryKey?: string; // Primary lookup key (e.g., 'short_code', 'user_id')
  };
  traffic?: {
    readHeavy: boolean; // True if read:write ratio > 5:1
    writeRps?: number; // Peak write RPS
    readRps?: number; // Peak read RPS
  };
}

/**
 * Fix a solution to use new commodity hardware model
 */
export function fixSolution(
  solution: Solution,
  context?: ChallengeContext
): Solution {
  const fixed = JSON.parse(JSON.stringify(solution)); // Deep clone

  // Fix each component
  for (const component of fixed.components) {
    if (component.type === 'postgresql' || component.type === 'database') {
      fixDatabaseComponent(component, context);
    } else if (component.type === 'app_server') {
      fixAppServerComponent(component);
    } else if (component.type === 'cdn') {
      fixCdnComponent(component);
    } else if (component.type === 'cache') {
      fixCacheComponent(component);
    }
  }

  return fixed;
}

/**
 * Fix database component configuration
 */
function fixDatabaseComponent(
  component: any,
  context?: ChallengeContext
): void {
  const config = component.config || {};

  // 1. Remove old capacity fields
  delete config.readCapacity;
  delete config.writeCapacity;

  // 2. Add required instanceType
  config.instanceType = 'commodity-db';

  // 3. Fix replication configuration
  if (config.replication === true || config.replication === false) {
    // Old boolean format - convert to object
    config.replication = {
      enabled: config.replication === true,
      replicas: config.replication === true ? 1 : 0,
      mode: 'async', // Default to async (cheaper, usually sufficient)
    };
  } else if (!config.replication || typeof config.replication !== 'object') {
    // Missing or invalid - set default
    config.replication = {
      enabled: false,
      replicas: 0,
      mode: 'async',
    };
  } else {
    // Object exists - ensure all required fields
    if (typeof config.replication.enabled !== 'boolean') {
      config.replication.enabled = false;
    }
    if (typeof config.replication.replicas !== 'number') {
      config.replication.replicas = config.replication.enabled ? 1 : 0;
    }
    if (!config.replication.mode) {
      config.replication.mode = 'async';
    }
  }

  // 4. Set replicationMode if missing
  if (!config.replicationMode) {
    // Default to single-leader (simplest, most common)
    config.replicationMode = 'single-leader';
  }

  // 5. Fix sharding configuration
  if (!config.sharding || typeof config.sharding !== 'object') {
    // Missing or invalid - set default
    config.sharding = {
      enabled: false,
      shards: 1,
      shardKey: inferShardKey(context),
    };
  } else {
    // Object exists - ensure all required fields
    if (typeof config.sharding.enabled !== 'boolean') {
      config.sharding.enabled = false;
    }
    if (typeof config.sharding.shards !== 'number') {
      config.sharding.shards = 1;
    }
    if (!config.sharding.shardKey) {
      config.sharding.shardKey = inferShardKey(context);
    }
  }

  component.config = config;
}

/**
 * Fix app_server component configuration
 */
function fixAppServerComponent(component: any): void {
  const config = component.config || {};

  // Add lbStrategy if missing (optional but recommended)
  if (!config.lbStrategy) {
    config.lbStrategy = 'round-robin'; // Default strategy
  }

  // Ensure instances is a number
  if (typeof config.instances !== 'number') {
    config.instances = 2; // Default to 2 instances
  }

  // instanceType is implicit (commodity-app), don't set it
  component.config = config;
}

/**
 * Fix CDN component configuration
 */
function fixCdnComponent(component: any): void {
  const config = component.config || {};

  // Remove invalid fields
  delete config.cacheHitRatio; // CDN hit ratio is fixed at 0.95
  delete config.bandwidthGbps; // Not configurable

  // Only keep enabled field
  config.enabled = config.enabled !== false; // Default to true

  component.config = config;
}

/**
 * Fix cache component configuration
 */
function fixCacheComponent(component: any): void {
  const config = component.config || {};

  // Ensure required fields exist with reasonable defaults
  if (typeof config.memorySizeGB !== 'number') {
    config.memorySizeGB = 4; // Default to 4GB
  }

  if (typeof config.hitRatio !== 'number') {
    config.hitRatio = 0.9; // Default to 90% hit ratio
  }

  if (!config.strategy) {
    config.strategy = 'cache_aside'; // Default to cache-aside pattern
  }

  component.config = config;
}

/**
 * Infer appropriate shard key based on challenge context
 */
function inferShardKey(context?: ChallengeContext): string {
  if (!context) {
    return ''; // No context - leave empty
  }

  // Use primary key if provided
  if (context.dataModel?.primaryKey) {
    return context.dataModel.primaryKey;
  }

  // Infer from challenge ID
  const id = context.id.toLowerCase();

  // Common patterns
  if (id.includes('tinyurl') || id.includes('url') || id === 'pastebin') {
    return 'short_code'; // URL shorteners
  }

  if (
    id.includes('instagram') ||
    id.includes('facebook') ||
    id.includes('twitter') ||
    id.includes('linkedin') ||
    id.includes('social')
  ) {
    return 'user_id'; // Social networks
  }

  if (
    id.includes('uber') ||
    id.includes('lyft') ||
    id.includes('doordash') ||
    id.includes('delivery')
  ) {
    return 'order_id'; // Delivery/rideshare
  }

  if (
    id.includes('ecommerce') ||
    id.includes('amazon') ||
    id.includes('shopify')
  ) {
    return 'user_id'; // E-commerce (partition by user)
  }

  if (id.includes('chat') || id.includes('messenger') || id.includes('slack')) {
    return 'user_id'; // Chat systems
  }

  if (id.includes('video') || id.includes('youtube') || id.includes('netflix')) {
    return 'video_id'; // Video platforms
  }

  // Default to user_id (most common)
  return 'user_id';
}

/**
 * Validate that a solution has been properly fixed
 */
export function validateFixedSolution(solution: Solution): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const component of solution.components) {
    const type = component.type;
    const config = component.config || {};

    // Check database components
    if (type === 'postgresql' || type === 'database') {
      if (config.readCapacity !== undefined) {
        errors.push(
          `Database component has deprecated 'readCapacity' field`
        );
      }
      if (config.writeCapacity !== undefined) {
        errors.push(
          `Database component has deprecated 'writeCapacity' field`
        );
      }
      if (!config.instanceType) {
        errors.push(`Database component missing 'instanceType' field`);
      }
      if (!config.replicationMode) {
        errors.push(`Database component missing 'replicationMode' field`);
      }
      if (!config.replication || typeof config.replication !== 'object') {
        errors.push(
          `Database component has invalid 'replication' field (must be object)`
        );
      }
      if (!config.sharding || typeof config.sharding !== 'object') {
        errors.push(
          `Database component has invalid 'sharding' field (must be object)`
        );
      }
    }

    // Check CDN components
    if (type === 'cdn') {
      if (config.cacheHitRatio !== undefined) {
        errors.push(`CDN component has deprecated 'cacheHitRatio' field`);
      }
      if (config.bandwidthGbps !== undefined) {
        errors.push(`CDN component has deprecated 'bandwidthGbps' field`);
      }
    }

    // Check cache components
    if (type === 'cache') {
      if (typeof config.memorySizeGB !== 'number') {
        errors.push(`Cache component missing 'memorySizeGB' field`);
      }
      if (typeof config.hitRatio !== 'number') {
        errors.push(`Cache component missing 'hitRatio' field`);
      }
      if (!config.strategy) {
        errors.push(`Cache component missing 'strategy' field`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Batch fix all solutions in a challenge
 */
export function fixChallengeSolutions(
  challenge: any,
  context?: ChallengeContext
): any {
  const fixed = JSON.parse(JSON.stringify(challenge)); // Deep clone

  // Fix challenge-level solution if exists
  if (fixed.solution) {
    fixed.solution = fixSolution(fixed.solution, context);
  }

  // Fix test case solutions
  if (fixed.testCases) {
    for (const testCase of fixed.testCases) {
      if (testCase.solution) {
        testCase.solution = fixSolution(testCase.solution, context);
      }
    }
  }

  return fixed;
}

/**
 * Auto-size components based on traffic requirements
 */
export function autoSizeComponents(
  solution: Solution,
  traffic: {
    readRps: number;
    writeRps: number;
  }
): Solution {
  const sized = JSON.parse(JSON.stringify(solution)); // Deep clone

  for (const component of sized.components) {
    const config = component.config || {};

    // Size app servers
    if (component.type === 'app_server') {
      const totalRps = traffic.readRps + traffic.writeRps;
      const instances = Math.ceil(totalRps / 1000);
      config.instances = Math.max(2, instances); // Minimum 2 for HA
    }

    // Size database
    if (component.type === 'postgresql' || component.type === 'database') {
      // Enable sharding if write RPS > 100
      if (traffic.writeRps > 100 && config.sharding) {
        config.sharding.enabled = true;
        config.sharding.shards = Math.ceil(traffic.writeRps / 100);
      }

      // Enable replication if read-heavy
      if (traffic.readRps > traffic.writeRps * 5 && config.replication) {
        config.replication.enabled = true;
        config.replication.replicas = Math.min(
          2,
          Math.ceil(traffic.readRps / 1000)
        );
      }
    }

    // Size cache
    if (component.type === 'cache') {
      const readRatio = traffic.readRps / (traffic.readRps + traffic.writeRps);
      if (readRatio > 0.8) {
        // Read-heavy - larger cache
        config.memorySizeGB = Math.max(4, Math.ceil(traffic.readRps / 500));
        config.hitRatio = 0.95;
      }
    }

    component.config = config;
  }

  return sized;
}

/**
 * Generate a report of changes made during fixing
 */
export function generateFixReport(
  original: Solution,
  fixed: Solution
): string {
  const changes: string[] = [];

  // Compare components
  for (let i = 0; i < original.components.length; i++) {
    const origComp = original.components[i];
    const fixedComp = fixed.components[i];

    if (!fixedComp) continue;

    const origConfig = origComp.config || {};
    const fixedConfig = fixedComp.config || {};

    // Check for removed fields
    if (origConfig.readCapacity !== undefined) {
      changes.push(
        `- Removed 'readCapacity: ${origConfig.readCapacity}' from ${origComp.type}`
      );
    }
    if (origConfig.writeCapacity !== undefined) {
      changes.push(
        `- Removed 'writeCapacity: ${origConfig.writeCapacity}' from ${origComp.type}`
      );
    }

    // Check for added fields
    if (
      fixedConfig.instanceType &&
      origConfig.instanceType !== fixedConfig.instanceType
    ) {
      changes.push(
        `- Added 'instanceType: ${fixedConfig.instanceType}' to ${origComp.type}`
      );
    }

    // Check for converted replication
    if (
      origConfig.replication === true &&
      typeof fixedConfig.replication === 'object'
    ) {
      changes.push(
        `- Converted 'replication: true' to object format in ${origComp.type}`
      );
    }

    // Check for added sharding
    if (
      !origConfig.sharding &&
      fixedConfig.sharding &&
      typeof fixedConfig.sharding === 'object'
    ) {
      changes.push(`- Added 'sharding' configuration to ${origComp.type}`);
    }
  }

  if (changes.length === 0) {
    return 'No changes needed - solution already in correct format.';
  }

  return `Changes made:\n${changes.join('\n')}`;
}
