/**
 * Default Minimal Configurations for Components
 *
 * Philosophy: "Connect first, optimize later"
 * - Each component added with minimal config
 * - For APIs: Provide separate Python files (one per FR)
 * - For databases: Provide schema definition only
 * - For other components: Empty config (user configures later)
 * - No modal/wizard - just add and connect
 * - User tests bare minimum first, then optimizes
 */

import { ComponentType, ComponentConfig } from '../types/component';
import { ProblemDefinition } from '../types/problemDefinition';

/**
 * Get bare minimum config when user clicks to add component
 */
export function getMinimalComponentConfig(
  componentType: ComponentType,
  problem?: ProblemDefinition
): ComponentConfig {
  switch (componentType) {
    case 'app_server':
      return {
        // Cheapest instance - will likely fail under load
        instanceType: 't3.micro',
        instances: 1,
        // Reference to separate API files (one per FR)
        apiFiles: problem ? getAPIFiles(problem) : [],
      };

    case 'postgresql':
      return {
        // Cheapest DB instance
        instanceType: 'db.t3.micro',
        instances: 1,
        engine: 'postgresql',

        // Minimal config - user optimizes later
        storageType: 'gp3',
        storageSizeGB: 20,

        // Reference to schema file (defined, but user can modify)
        schemaFile: problem ? getSchemaFile(problem) : null,
      };

    case 'redis':
      return {
        // Small cache instance
        instanceType: 'cache.t3.micro',
        instances: 1,
        engine: 'redis',

        // Empty config - user can add cache config later
        // When user tests and DB is bottleneck, they'll configure this
      };

    case 'load_balancer':
      return {
        // Empty - will use default round-robin
      };

    case 'mongodb':
      return {
        instanceType: 't3.medium',
        instances: 1,
        engine: 'mongodb',
      };

    case 'cassandra':
      return {
        instanceType: 't3.medium',
        instances: 3, // Minimum for Cassandra
        replicationFactor: 3,
      };

    case 'message_queue':
      return {
        queueType: 'kafka',
        partitions: 1,
        replicationFactor: 1,
      };

    case 'cdn':
      return {
        // Empty - user configures when needed
      };

    case 's3':
      return {
        storageClass: 'standard',
      };

    case 'client':
      return {};

    default:
      return {};
  }
}

/**
 * Get API file references for problem's functional requirements
 * Each FR maps to a separate Python file
 */
function getAPIFiles(problem: ProblemDefinition): string[] {
  const files: string[] = [];

  // TinyURL: URL shortening service
  if (problem.id === 'tiny_url') {
    files.push('/tinyurl_create_short_url.py');  // FR: Given long URL, generate short URL
    files.push('/tinyurl_redirect.py');          // FR: Redirect from short URL
  }

  // Basic Full-Text Search: Search engine
  if (problem.id === 'basic-text-search') {
    files.push('/search_index_document.py');     // FR: Index text documents
    files.push('/search_query.py');              // FR: Search by keywords with ranking
  }

  // Web Crawler: Crawl and index web pages
  if (problem.id === 'web-crawler') {
    files.push('/webcrawler_crawl_page.py');     // FR: Crawl web pages
    files.push('/webcrawler_url_frontier.py');   // FR: Manage URL queue
  }

  // TODO: Add mappings for other problems (Instagram, Twitter, etc.)

  return files;
}

/**
 * Get schema file reference for problem's data model
 */
function getSchemaFile(problem: ProblemDefinition): string | null {
  // TinyURL
  if (problem.id === 'tiny_url') {
    return '/tinyurl_schema.sql';
  }

  // Basic Full-Text Search
  if (problem.id === 'basic-text-search') {
    return '/search_schema.sql';
  }

  // Web Crawler
  if (problem.id === 'web-crawler') {
    return '/webcrawler_schema.sql';
  }

  // TODO: Add mappings for other problems

  return null;
}

/**
 * Get human-readable description of what this config does
 */
export function getConfigDescription(componentType: ComponentType): string {
  switch (componentType) {
    case 'app_server':
      return 'Bare minimum app server (t3.micro). Will likely fail under load. You can optimize later.';
    case 'postgresql':
      return 'Cheapest PostgreSQL instance (db.t3.micro). No replication, minimal storage. Connect and test first!';
    case 'redis':
      return 'Small cache instance (cache.t3.micro). Basic LRU eviction. Add this to reduce DB load.';
    case 'load_balancer':
      return 'Basic round-robin load balancer. Distributes traffic across app servers.';
    default:
      return 'Basic configuration. Connect components to test, then optimize as needed.';
  }
}

/**
 * Get optimization hints after testing reveals bottlenecks
 */
export function getOptimizationHints(
  componentType: ComponentType,
  utilization: number
): string[] {
  const hints: string[] = [];

  if (componentType === 'app_server' && utilization > 0.8) {
    hints.push('App server saturated! Options:');
    hints.push('1. Upgrade to larger instance (t3.medium → m5.large)');
    hints.push('2. Add more instances (horizontal scaling)');
    hints.push('3. Add caching to reduce compute load');
  }

  if (componentType === 'postgresql' && utilization > 0.8) {
    hints.push('Database saturated! Options:');
    hints.push('1. Upgrade instance (db.t3.micro → db.m5.large)');
    hints.push('2. Add indexes to speed up queries');
    hints.push('3. Add read replicas for read-heavy workloads');
    hints.push('4. Add Redis cache to reduce DB hits');
  }

  if (componentType === 'redis' && utilization > 0.8) {
    hints.push('Cache saturated! Options:');
    hints.push('1. Upgrade to larger cache instance');
    hints.push('2. Adjust eviction policy (LRU → LFU)');
    hints.push('3. Reduce TTL to free up space faster');
  }

  return hints;
}
