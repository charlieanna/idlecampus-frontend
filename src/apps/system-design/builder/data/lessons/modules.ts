/**
 * System Design Course Module Structure
 *
 * Defines the progressive flow of lessons organized into modules.
 * Each module must be completed before the next module unlocks.
 */

export interface CourseModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  sequenceOrder: number;
  estimatedMinutes: number;
  lessonCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningObjectives: string[];
  prerequisites?: string[]; // Module IDs that must be completed first
}

/**
 * All System Design Course Modules
 */
export const courseModules: CourseModule[] = [
  {
    id: 'sd-module-1-fundamentals',
    slug: 'fundamentals',
    title: 'System Design Fundamentals',
    description: 'Master the basics of system design: core concepts, components, and capacity planning. Build a strong foundation for designing scalable systems.',
    sequenceOrder: 1,
    estimatedMinutes: 120,
    lessonCount: 3,
    difficulty: 'beginner',
    learningObjectives: [
      'Understand what system design is and why it matters',
      'Learn the basic building blocks: client, server, database, cache, load balancer',
      'Master capacity planning: calculate how many servers you need',
      'Apply trade-off thinking to real system design decisions',
    ],
    prerequisites: [],
  },
  {
    id: 'sd-module-2-components',
    slug: 'core-components',
    title: 'Core Components Deep Dive',
    description: 'Deep dive into caching and replication patterns. Learn when to use each pattern and how they impact system performance.',
    sequenceOrder: 2,
    estimatedMinutes: 60,
    lessonCount: 2,
    difficulty: 'beginner',
    learningObjectives: [
      'Master caching patterns: cache-aside, write-through, write-behind',
      'Understand replication: single-leader, multi-leader, leaderless',
      'Learn trade-offs between consistency and performance',
      'Apply caching and replication to real systems',
    ],
    prerequisites: ['sd-module-1-fundamentals'],
  },
  {
    id: 'sd-module-3-patterns',
    slug: 'design-patterns',
    title: 'System Design Patterns',
    description: 'Learn battle-tested patterns for scaling systems: multi-region strategies, caching, search, streaming, and more. Understand when and how to apply each pattern.',
    sequenceOrder: 3,
    estimatedMinutes: 615,
    lessonCount: 13,
    difficulty: 'intermediate',
    learningObjectives: [
      'Master multi-region architectures: active-active, active-passive, CDN',
      'Learn fundamental patterns: caching, search, streaming, gateway, storage',
      'Understand capacity planning with load parameters',
      'Measure system health with performance metrics and reliability',
      'Plan platform migrations and modernization strategies',
    ],
    prerequisites: ['sd-module-2-components'],
  },
  {
    id: 'sd-module-4-ddia',
    slug: 'ddia-deep-dive',
    title: 'Designing Data-Intensive Applications',
    description: 'Deep dive into distributed data systems based on the DDIA book. Master data models, storage engines, replication, partitioning, transactions, and distributed systems fundamentals.',
    sequenceOrder: 4,
    estimatedMinutes: 550,
    lessonCount: 11,
    difficulty: 'advanced',
    learningObjectives: [
      'Master data models: relational, document, graph',
      'Understand storage engines: B-trees, LSM-trees, indexes',
      'Learn encoding and schema evolution strategies',
      'Deep dive into replication: leaders, followers, consistency',
      'Master partitioning (sharding) and rebalancing',
      'Understand distributed transactions and consensus algorithms',
      'Learn batch and stream processing architectures',
    ],
    prerequisites: ['sd-module-3-patterns'],
  },
  {
    id: 'sd-module-5-primer',
    slug: 'system-design-primer',
    title: 'System Design Primer',
    description: 'Industry-standard concepts from the System Design Primer. Learn DNS, CDN, load balancing, databases, caching, asynchronism, and communication patterns used by major tech companies.',
    sequenceOrder: 5,
    estimatedMinutes: 300,
    lessonCount: 10,
    difficulty: 'intermediate',
    learningObjectives: [
      'Master performance and scalability fundamentals',
      'Understand DNS and how it routes traffic globally',
      'Learn CDN strategies for static content delivery',
      'Deep dive into load balancing algorithms and patterns',
      'Understand application layer architectures',
      'Master database scaling: replication, sharding, denormalization',
      'Learn asynchronous processing with queues and workers',
      'Understand communication patterns: REST, RPC, WebSockets',
      'Master security fundamentals for distributed systems',
    ],
    prerequisites: ['sd-module-4-ddia'],
  },
  {
    id: 'sd-module-6-nfr',
    slug: 'nfr-advanced',
    title: 'Non-Functional Requirements & Advanced Topics',
    description: 'Master non-functional requirements (NFRs): performance, reliability, scalability, consistency. Learn to make informed trade-offs based on business requirements.',
    sequenceOrder: 6,
    estimatedMinutes: 60,
    lessonCount: 2,
    difficulty: 'advanced',
    learningObjectives: [
      'Understand NFR fundamentals: what they are and why they matter',
      'Master data consistency models: strong, eventual, causal',
      'Learn to translate business requirements into technical NFRs',
      'Apply NFR thinking to system design decisions',
    ],
    prerequisites: ['sd-module-5-primer'],
  },
];

/**
 * Get module by ID
 */
export function getModuleById(moduleId: string): CourseModule | undefined {
  return courseModules.find(m => m.id === moduleId);
}

/**
 * Get module by slug
 */
export function getModuleBySlug(slug: string): CourseModule | undefined {
  return courseModules.find(m => m.slug === slug);
}

/**
 * Get all modules in sequence order
 */
export function getAllModulesInOrder(): CourseModule[] {
  return [...courseModules].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
}

/**
 * Get next module in sequence
 */
export function getNextModule(currentModuleId: string): CourseModule | undefined {
  const currentModule = getModuleById(currentModuleId);
  if (!currentModule) return undefined;

  return courseModules.find(m => m.sequenceOrder === currentModule.sequenceOrder + 1);
}

/**
 * Get previous module in sequence
 */
export function getPreviousModule(currentModuleId: string): CourseModule | undefined {
  const currentModule = getModuleById(currentModuleId);
  if (!currentModule) return undefined;

  return courseModules.find(m => m.sequenceOrder === currentModule.sequenceOrder - 1);
}

/**
 * Check if module prerequisites are met
 */
export function arePrerequisitesMet(
  moduleId: string,
  completedModuleIds: string[]
): boolean {
  const module = getModuleById(moduleId);
  if (!module) return false;

  // If no prerequisites, module is accessible
  if (!module.prerequisites || module.prerequisites.length === 0) {
    return true;
  }

  // Check if all prerequisites are completed
  return module.prerequisites.every(prereqId =>
    completedModuleIds.includes(prereqId)
  );
}
