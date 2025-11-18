/**
 * Script to add challenge-level solutions to all converted challenges
 * 
 * This script:
 * 1. Converts all ProblemDefinitions to Challenges (via problemDefinitionConverter)
 * 2. Generates a basic solution for each challenge based on its requirements
 * 3. Ensures solutions use the new commodity hardware model
 * 4. Outputs solutions that can be added to challenge definitions
 * 
 * Usage:
 *   npx ts-node src/apps/system-design/builder/scripts/addSolutionsToChallenges.ts
 */

import { convertProblemDefinitionToChallenge } from '../challenges/problemDefinitionConverter';
import { allProblemDefinitions } from '../challenges/definitions';
import { Challenge, Solution } from '../types/testCase';

/**
 * Generate a basic solution for a challenge based on its requirements
 */
function generateSolution(challenge: Challenge): Solution | null {
  // Skip if challenge already has a solution
  if (challenge.solution) {
    return null;
  }

  const components: Solution['components'] = [];
  const connections: Solution['connections'] = [];

  // Always add client
  components.push({ type: 'client', config: {} });

  // Check what components are needed based on test cases and requirements
  const needsLoadBalancer = challenge.testCases.some(tc => 
    tc.traffic?.rps && tc.traffic.rps > 1000
  ) || challenge.requirements?.traffic?.includes('RPS') && 
     parseInt(challenge.requirements.traffic.match(/\d+/)?.[0] || '0') > 1000;

  const needsCache = challenge.availableComponents.includes('redis') || 
                     challenge.availableComponents.includes('cache') ||
                     challenge.requirements?.nfrs?.some(nfr => 
                       nfr.toLowerCase().includes('cache') || 
                       nfr.toLowerCase().includes('hit ratio')
                     );

  const needsDatabase = challenge.availableComponents.includes('database') ||
                        challenge.availableComponents.includes('postgresql');

  const needsCDN = challenge.availableComponents.includes('cdn') ||
                   challenge.requirements?.nfrs?.some(nfr => 
                     nfr.toLowerCase().includes('cdn') || 
                     nfr.toLowerCase().includes('static')
                   );

  const needsS3 = challenge.availableComponents.includes('s3') ||
                  challenge.requirements?.nfrs?.some(nfr => 
                    nfr.toLowerCase().includes('object storage') ||
                    nfr.toLowerCase().includes('file')
                  );

  const needsQueue = challenge.availableComponents.includes('message_queue') ||
                     challenge.requirements?.nfrs?.some(nfr => 
                       nfr.toLowerCase().includes('async') ||
                       nfr.toLowerCase().includes('queue')
                     );

  // Calculate required instances based on traffic
  let maxRps = 0;
  challenge.testCases.forEach(tc => {
    if (tc.traffic?.rps) {
      maxRps = Math.max(maxRps, tc.traffic.rps);
    }
    if (tc.traffic?.readRps && tc.traffic?.writeRps) {
      maxRps = Math.max(maxRps, tc.traffic.readRps + tc.traffic.writeRps);
    }
  });

  // Parse RPS from requirements string if available
  if (challenge.requirements?.traffic) {
    const rpsMatch = challenge.requirements.traffic.match(/(\d+)(?:K|k)?\s*RPS/i);
    if (rpsMatch) {
      let rps = parseInt(rpsMatch[1]);
      if (challenge.requirements.traffic.toLowerCase().includes('k')) {
        rps *= 1000;
      }
      maxRps = Math.max(maxRps, rps);
    }
  }

  // Calculate app server instances (1000 RPS per instance, add 20% headroom)
  const appServerInstances = Math.max(1, Math.ceil((maxRps * 1.2) / 1000));

  // Add load balancer if needed
  if (needsLoadBalancer && appServerInstances > 1) {
    components.push({ type: 'load_balancer', config: {} });
    connections.push({ from: 'client', to: 'load_balancer', type: 'read_write' });
  }

  // Add app server
  components.push({
    type: 'app_server',
    config: {
      instances: appServerInstances,
      lbStrategy: 'least-connections', // Better for variable load
    }
  });

  if (needsLoadBalancer && appServerInstances > 1) {
    connections.push({ from: 'load_balancer', to: 'app_server', type: 'read_write' });
  } else {
    connections.push({ from: 'client', to: 'app_server', type: 'read_write' });
  }

  // Add cache if needed
  if (needsCache) {
    components.push({
      type: 'redis',
      config: {
        sizeGB: 4, // Default cache size
        strategy: 'cache_aside',
      }
    });
    connections.push({ from: 'app_server', to: 'redis', type: 'read_write' });
  }

  // Add database
  if (needsDatabase) {
    // Calculate read/write RPS
    let readRps = 0;
    let writeRps = 0;
    
    challenge.testCases.forEach(tc => {
      if (tc.traffic?.readRps && tc.traffic?.writeRps) {
        readRps = Math.max(readRps, tc.traffic.readRps);
        writeRps = Math.max(writeRps, tc.traffic.writeRps);
      } else if (tc.traffic?.rps && tc.traffic?.readRatio !== undefined) {
        const totalRps = tc.traffic.rps;
        readRps = Math.max(readRps, totalRps * tc.traffic.readRatio);
        writeRps = Math.max(writeRps, totalRps * (1 - tc.traffic.readRatio));
      }
    });

    // Calculate required replicas for read capacity (1000 RPS per replica)
    const readReplicas = Math.max(0, Math.ceil((readRps * 1.2) / 1000));
    
    // Determine if sharding is needed for write capacity (100 RPS per shard base, 300 with multi-leader)
    const baseWriteCapacity = 100;
    const multiLeaderWriteCapacity = 300;
    const writeCapacityPerShard = multiLeaderWriteCapacity;
    const requiredShards = Math.max(1, Math.ceil((writeRps * 1.2) / writeCapacityPerShard));
    
    // Use multi-leader if we need more write capacity, otherwise single-leader
    const useMultiLeader = writeRps > 100;
    const replicationMode = useMultiLeader ? 'multi-leader' : 'single-leader';
    const replicas = useMultiLeader ? Math.max(2, Math.ceil(requiredShards / 2)) : readReplicas;
    const shards = useMultiLeader && requiredShards > 1 ? requiredShards : 1;

    components.push({
      type: 'postgresql',
      config: {
        instanceType: 'commodity-db',
        replicationMode,
        replication: {
          enabled: replicas > 0,
          replicas: replicas,
          mode: 'async',
        },
        sharding: {
          enabled: shards > 1,
          shards: shards,
          shardKey: 'id', // Default shard key
        }
      }
    });
    connections.push({ from: 'app_server', to: 'postgresql', type: 'read_write' });
  }

  // Add CDN if needed
  if (needsCDN) {
    components.push({
      type: 'cdn',
      config: {
        enabled: true,
      }
    });
    connections.push({ from: 'client', to: 'cdn', type: 'read' });
  }

  // Add S3 if needed
  if (needsS3) {
    components.push({
      type: 's3',
      config: {}
    });
    if (needsCDN) {
      connections.push({ from: 'cdn', to: 's3', type: 'read' });
    }
    connections.push({ from: 'app_server', to: 's3', type: 'read_write' });
  }

  // Add message queue if needed
  if (needsQueue) {
    components.push({
      type: 'message_queue',
      config: {}
    });
    connections.push({ from: 'app_server', to: 'message_queue', type: 'write' });
  }

  return {
    components,
    connections,
    explanation: `Comprehensive solution for ${challenge.title}:
- ${appServerInstances} app server instances (commodity hardware: 1000 RPS each)
- ${needsCache ? 'Redis cache with cache-aside strategy' : 'No cache'}
- ${needsDatabase ? `PostgreSQL with ${replicationMode} replication (${replicas} replicas${shards > 1 ? `, ${shards} shards` : ''})` : 'No database'}
- ${needsLoadBalancer ? 'Load balancer for traffic distribution' : 'Direct client-to-app-server connection'}
- ${needsCDN ? 'CDN for static content delivery' : ''}
- ${needsS3 ? 'S3 for object storage' : ''}
- ${needsQueue ? 'Message queue for async processing' : ''}

This solution is designed to handle the maximum traffic requirements across all test cases.`
  };
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Converting ProblemDefinitions to Challenges...\n');
  
  const challenges: Challenge[] = allProblemDefinitions.map(def => 
    convertProblemDefinitionToChallenge(def)
  );

  console.log(`✅ Converted ${challenges.length} ProblemDefinitions to Challenges\n`);
  console.log('📋 Generating solutions for challenges without solutions...\n');

  let solutionsGenerated = 0;
  let solutionsSkipped = 0;

  challenges.forEach((challenge, index) => {
    const solution = generateSolution(challenge);
    
    if (solution) {
      solutionsGenerated++;
      console.log(`${solutionsGenerated}. ${challenge.id}: ${challenge.title}`);
      console.log(`   Components: ${solution.components.length}`);
      console.log(`   Connections: ${solution.connections.length}`);
      
      // Check if this is a high-priority challenge (real-world systems)
      const priorityChallenges = ['twitter', 'instagram', 'facebook', 'netflix', 'youtube', 'amazon', 'uber', 'airbnb'];
      if (priorityChallenges.includes(challenge.id)) {
        console.log(`   ⚠️  PRIORITY: This challenge needs manual review and solution refinement`);
      }
    } else {
      solutionsSkipped++;
    }
  });

  console.log(`\n✅ Generated ${solutionsGenerated} solutions`);
  console.log(`⏭️  Skipped ${solutionsSkipped} challenges (already have solutions)`);
  console.log(`\n📝 Next Steps:`);
  console.log(`1. Review generated solutions for priority challenges`);
  console.log(`2. Test solutions against test cases`);
  console.log(`3. Refine solutions based on test results`);
  console.log(`4. Add solutions to challenge definitions`);
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { generateSolution };

