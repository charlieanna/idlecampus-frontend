/**
 * Graph Cycle Detection and Controlled Cycle Support
 *
 * This module provides utilities for:
 * 1. Detecting cycles in system graphs (for validation)
 * 2. Allowing controlled cycles (for circuit breaker patterns)
 * 3. Enforcing hop-count limits to prevent infinite loops
 */

import { Connection } from '../types/graph';
import { isEnabled, verboseLog } from './featureFlags';

/**
 * Result of cycle detection
 */
export interface CycleDetectionResult {
  hasCycles: boolean;
  cycles: string[][]; // List of cycles (each cycle is array of node IDs)
  maxCycleLength: number;
  warnings: string[];
}

/**
 * Configuration for controlled cycle traversal
 */
export interface CycleTraversalConfig {
  maxHops: number; // Maximum number of hops per request
  maxCycleDepth: number; // Maximum times same node can be visited
  allowedCyclePatterns?: string[][]; // Specific cycle patterns that are allowed
}

/**
 * Default configuration for cycle traversal
 */
export const DEFAULT_CYCLE_CONFIG: CycleTraversalConfig = {
  maxHops: 20, // Reasonable limit for most topologies
  maxCycleDepth: 2, // Allow a node to be visited at most twice (for circuit breaker)
};

/**
 * Detect all cycles in a graph using DFS
 * Returns all cycles found (for validation and reporting)
 */
export function detectCycles(
  adjacency: Map<string, { to: string; type: Connection['type'] }[]>
): CycleDetectionResult {
  const cycles: string[][] = [];
  const warnings: string[] = [];

  const visited = new Set<string>();
  const inStack = new Set<string>(); // Nodes in current DFS path
  const path: string[] = [];

  // DFS function to find cycles
  function dfs(nodeId: string): void {
    if (inStack.has(nodeId)) {
      // Found a cycle - extract it from the path
      const cycleStart = path.indexOf(nodeId);
      if (cycleStart !== -1) {
        const cycle = path.slice(cycleStart);
        cycle.push(nodeId); // Complete the cycle
        cycles.push(cycle);
      }
      return;
    }

    if (visited.has(nodeId)) {
      return;
    }

    visited.add(nodeId);
    inStack.add(nodeId);
    path.push(nodeId);

    const edges = adjacency.get(nodeId) || [];
    for (const edge of edges) {
      dfs(edge.to);
    }

    path.pop();
    inStack.delete(nodeId);
  }

  // Start DFS from each unvisited node
  for (const nodeId of adjacency.keys()) {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  }

  // Also check for isolated nodes that might have outgoing edges
  // but weren't visited (disconnected components)
  const allNodes = new Set<string>();
  for (const [from, edges] of adjacency.entries()) {
    allNodes.add(from);
    for (const edge of edges) {
      allNodes.add(edge.to);
    }
  }

  for (const nodeId of allNodes) {
    if (!visited.has(nodeId) && !adjacency.has(nodeId)) {
      // This node has no outgoing edges but might be a target
      // Not a cycle issue
    }
  }

  // Generate warnings for found cycles
  if (cycles.length > 0 && !isEnabled('ENABLE_GRAPH_CYCLES')) {
    warnings.push(
      `Graph contains ${cycles.length} cycle(s). Enable ENABLE_GRAPH_CYCLES flag to allow cycles.`
    );
  }

  // Check for self-loops
  for (const [nodeId, edges] of adjacency.entries()) {
    for (const edge of edges) {
      if (edge.to === nodeId) {
        warnings.push(`Self-loop detected at node ${nodeId}`);
      }
    }
  }

  const maxCycleLength =
    cycles.length > 0 ? Math.max(...cycles.map((c) => c.length)) : 0;

  verboseLog('Cycle detection complete', {
    hasCycles: cycles.length > 0,
    numCycles: cycles.length,
    maxCycleLength,
  });

  return {
    hasCycles: cycles.length > 0,
    cycles,
    maxCycleLength,
    warnings,
  };
}

/**
 * Validate graph for cycle safety
 * Returns validation result with specific issues
 */
export function validateGraphCycles(
  adjacency: Map<string, { to: string; type: Connection['type'] }[]>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const result = detectCycles(adjacency);

  if (result.hasCycles && !isEnabled('ENABLE_GRAPH_CYCLES')) {
    errors.push(
      `Graph contains cycles which are not allowed when ENABLE_GRAPH_CYCLES is disabled`
    );
    for (const cycle of result.cycles) {
      errors.push(`  Cycle: ${cycle.join(' → ')}`);
    }
  }

  // Check for problematic cycle patterns
  for (const cycle of result.cycles) {
    if (cycle.length > DEFAULT_CYCLE_CONFIG.maxHops) {
      errors.push(
        `Cycle length ${cycle.length} exceeds maximum allowed hops ${DEFAULT_CYCLE_CONFIG.maxHops}`
      );
    }
  }

  errors.push(...result.warnings);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Traversal context for controlled cycle support
 * Tracks per-request state for cycle-aware traversal
 */
export class CycleAwareTraversalContext {
  private visitCounts: Map<string, number> = new Map();
  private hopCount: number = 0;
  private path: string[] = [];
  private config: CycleTraversalConfig;

  constructor(config?: Partial<CycleTraversalConfig>) {
    this.config = { ...DEFAULT_CYCLE_CONFIG, ...config };
  }

  /**
   * Check if we can visit a node (respects cycle limits)
   */
  canVisit(nodeId: string): boolean {
    if (!isEnabled('ENABLE_GRAPH_CYCLES')) {
      // No cycles allowed - strict visited check
      return !this.visitCounts.has(nodeId);
    }

    // Check hop count
    if (this.hopCount >= this.config.maxHops) {
      verboseLog('Max hops reached', { hopCount: this.hopCount, nodeId });
      return false;
    }

    // Check cycle depth for this specific node
    const currentVisits = this.visitCounts.get(nodeId) ?? 0;
    if (currentVisits >= this.config.maxCycleDepth) {
      verboseLog('Max cycle depth reached for node', {
        nodeId,
        visits: currentVisits,
      });
      return false;
    }

    return true;
  }

  /**
   * Mark a node as visited
   */
  visit(nodeId: string): void {
    const currentVisits = this.visitCounts.get(nodeId) ?? 0;
    this.visitCounts.set(nodeId, currentVisits + 1);
    this.hopCount++;
    this.path.push(nodeId);
  }

  /**
   * Unmark a node (for backtracking in DFS)
   */
  unvisit(nodeId: string): void {
    const currentVisits = this.visitCounts.get(nodeId) ?? 0;
    if (currentVisits > 0) {
      this.visitCounts.set(nodeId, currentVisits - 1);
      if (currentVisits === 1) {
        this.visitCounts.delete(nodeId);
      }
    }
    this.hopCount = Math.max(0, this.hopCount - 1);
    this.path.pop();
  }

  /**
   * Check if a node has been visited at all
   */
  hasVisited(nodeId: string): boolean {
    return this.visitCounts.has(nodeId) && this.visitCounts.get(nodeId)! > 0;
  }

  /**
   * Get the current traversal path
   */
  getPath(): string[] {
    return [...this.path];
  }

  /**
   * Get current hop count
   */
  getHopCount(): number {
    return this.hopCount;
  }

  /**
   * Check if we're in a cycle (current node already in path)
   */
  isInCycle(nodeId: string): boolean {
    const visits = this.visitCounts.get(nodeId) ?? 0;
    return visits > 1;
  }

  /**
   * Get visit statistics
   */
  getStats(): { totalHops: number; uniqueNodes: number; maxVisitsPerNode: number } {
    let maxVisits = 0;
    for (const count of this.visitCounts.values()) {
      maxVisits = Math.max(maxVisits, count);
    }

    return {
      totalHops: this.hopCount,
      uniqueNodes: this.visitCounts.size,
      maxVisitsPerNode: maxVisits,
    };
  }

  /**
   * Reset the context for a new traversal
   */
  reset(): void {
    this.visitCounts.clear();
    this.hopCount = 0;
    this.path = [];
  }
}

/**
 * Find all paths between two nodes (allows cycles with limits)
 * Useful for visualizing all possible request paths
 */
export function findAllPaths(
  adjacency: Map<string, { to: string; type: Connection['type'] }[]>,
  startId: string,
  endId: string,
  config?: Partial<CycleTraversalConfig>
): string[][] {
  const allPaths: string[][] = [];
  const traversalConfig = { ...DEFAULT_CYCLE_CONFIG, ...config };

  function dfs(currentId: string, path: string[], visitCounts: Map<string, number>): void {
    // Check limits
    if (path.length > traversalConfig.maxHops) {
      return;
    }

    const currentVisits = visitCounts.get(currentId) ?? 0;
    if (
      !isEnabled('ENABLE_GRAPH_CYCLES') &&
      currentVisits > 0
    ) {
      return; // No cycles allowed
    }

    if (currentVisits >= traversalConfig.maxCycleDepth) {
      return; // Max cycle depth reached
    }

    // Add to path
    path.push(currentId);
    visitCounts.set(currentId, currentVisits + 1);

    if (currentId === endId) {
      allPaths.push([...path]);
    } else {
      const edges = adjacency.get(currentId) || [];
      for (const edge of edges) {
        dfs(edge.to, path, visitCounts);
      }
    }

    // Backtrack
    path.pop();
    visitCounts.set(currentId, currentVisits);
    if (currentVisits === 0) {
      visitCounts.delete(currentId);
    }
  }

  dfs(startId, [], new Map());

  verboseLog('Found all paths', {
    startId,
    endId,
    numPaths: allPaths.length,
    maxPathLength: allPaths.length > 0 ? Math.max(...allPaths.map((p) => p.length)) : 0,
  });

  return allPaths;
}

/**
 * Classify a graph as DAG, with-cycles, or complex
 */
export function classifyGraph(
  adjacency: Map<string, { to: string; type: Connection['type'] }[]>
): 'dag' | 'simple_cycle' | 'complex_cycles' {
  const result = detectCycles(adjacency);

  if (!result.hasCycles) {
    return 'dag';
  }

  if (result.cycles.length === 1 && result.maxCycleLength <= 3) {
    return 'simple_cycle';
  }

  return 'complex_cycles';
}

/**
 * Get suggested max hops based on graph structure
 */
export function getSuggestedMaxHops(
  adjacency: Map<string, { to: string; type: Connection['type'] }[]>
): number {
  const nodeCount = adjacency.size;
  const cycleResult = detectCycles(adjacency);

  if (!cycleResult.hasCycles) {
    // DAG: max hops is at most the number of nodes
    return Math.min(nodeCount, 20);
  }

  // With cycles: allow some extra hops for circuit breaker patterns
  // but not too many to prevent infinite loops
  return Math.min(nodeCount * 2, DEFAULT_CYCLE_CONFIG.maxHops);
}
