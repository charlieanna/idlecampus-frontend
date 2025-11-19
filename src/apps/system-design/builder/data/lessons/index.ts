// Export all system design lessons
// Lessons are organized by category: fundamentals, components, patterns, problem-solving

import type { SystemDesignLesson } from '../../types/lesson';

// Fundamentals lessons (Level 1)
import { introductionLesson } from './fundamentals/01-introduction.tsx';
import { componentsLesson } from './fundamentals/02-components.tsx';
import { capacityPlanningLesson } from './fundamentals/03-capacity-planning.tsx';

// Component lessons (Level 2)
import { cachingLesson } from './components/05-caching';
import { replicationLesson } from './components/06-replication';

// Pattern lessons (Level 3)
import { activeActiveMultiRegionLesson } from './patterns/active-active-multiregion';
import { basicMultiRegionLesson } from './patterns/basic-multiregion';
import { globalCdnLesson } from './patterns/global-cdn';
import { crossRegionDrLesson } from './patterns/cross-region-dr';
import { cachingFundamentalsLesson } from './patterns/caching-fundamentals.tsx';
import { searchFundamentalsLesson } from './patterns/search-fundamentals.tsx';
import { streamingFundamentalsLesson } from './patterns/streaming-fundamentals.tsx';
import { gatewayFundamentalsLesson } from './patterns/gateway-fundamentals.tsx';
import { storageFundamentalsLesson } from './patterns/storage-fundamentals.tsx';
import { loadParametersLesson } from './patterns/load-parameters.tsx';
import { performanceMetricsLesson } from './patterns/performance-metrics.tsx';
import { reliabilityMaintainabilityLesson } from './patterns/reliability-maintainability.tsx';
import { platformMigrationStrategiesLesson } from './patterns/platform-migration-strategies.tsx';

// DDIA Lessons (Chapters 2-4, 7-12)
import { ddiaChapter2DataModelsLesson } from './ddia/chapter2-data-models.tsx';
import { ddiaChapter3StorageRetrievalLesson } from './ddia/chapter3-storage-retrieval.tsx';
import { ddiaChapter4EncodingEvolutionLesson } from './ddia/chapter4-encoding-evolution.tsx';
import { ddiaChapter7TransactionsLesson } from './ddia/chapter7-transactions.tsx';
import { ddiaChapter8DistributedSystemsLesson } from './ddia/chapter8-distributed-systems.tsx';
import { ddiaChapter9ConsensusLesson } from './ddia/chapter9-consensus.tsx';
import { ddiaChapter10BatchProcessingLesson } from './ddia/chapter10-batch-processing.tsx';
import { ddiaChapter11StreamProcessingLesson } from './ddia/chapter11-stream-processing.tsx';
import { ddiaChapter12FutureDataSystemsLesson } from './ddia/chapter12-future-data-systems.tsx';
import { ddiaChapter5ReplicationLesson } from './ddia/chapter5-replication.tsx';
import { ddiaChapter6PartitioningLesson } from './ddia/chapter6-partitioning.tsx';

// System Design Primer Lessons
import { sdpPerformanceScalabilityLesson } from './sdp/01-performance-scalability.tsx';
import { sdpDnsLesson } from './sdp/02-dns.tsx';
import { sdpCdnLesson } from './sdp/03-cdn.tsx';
import { sdpLoadBalancersLesson } from './sdp/04-load-balancers.tsx';
import { sdpApplicationLayerLesson } from './sdp/05-application-layer.tsx';
import { sdpDatabaseLesson } from './sdp/06-database.tsx';
import { sdpCachingLesson } from './sdp/07-caching.tsx';
import { sdpAsynchronismLesson } from './sdp/08-asynchronism.tsx';
import { sdpCommunicationLesson } from './sdp/09-communication.tsx';
import { sdpSecurityLesson } from './sdp/10-security.tsx';

// NFR Thinking Lessons
import { nfrFundamentalsLesson } from './nfr/nfr-fundamentals.tsx';
import { nfrDataConsistencyLesson } from './nfr/nfr-data-consistency.tsx';

// Problem-solving lessons (Level 4)
// Will be added in Phase 6

/**
 * All system design lessons
 */
export const allLessons: SystemDesignLesson[] = [
  // Fundamentals
  introductionLesson,
  componentsLesson,
  capacityPlanningLesson,
  
  // Components
  cachingLesson,
  replicationLesson,
  
  // Patterns
  activeActiveMultiRegionLesson,
  basicMultiRegionLesson,
  globalCdnLesson,
  crossRegionDrLesson,
  cachingFundamentalsLesson,
  searchFundamentalsLesson,
  streamingFundamentalsLesson,
  gatewayFundamentalsLesson,
  storageFundamentalsLesson,
  loadParametersLesson,
  performanceMetricsLesson,
  reliabilityMaintainabilityLesson,
  platformMigrationStrategiesLesson,
  
  // DDIA Lessons
  ddiaChapter2DataModelsLesson,
  ddiaChapter3StorageRetrievalLesson,
  ddiaChapter4EncodingEvolutionLesson,
  ddiaChapter7TransactionsLesson,
  ddiaChapter8DistributedSystemsLesson,
  ddiaChapter9ConsensusLesson,
  ddiaChapter10BatchProcessingLesson,
  ddiaChapter11StreamProcessingLesson,
  ddiaChapter12FutureDataSystemsLesson,
  ddiaChapter5ReplicationLesson,
  ddiaChapter6PartitioningLesson,
  
  // System Design Primer Lessons
  sdpPerformanceScalabilityLesson,
  sdpDnsLesson,
  sdpCdnLesson,
  sdpLoadBalancersLesson,
  sdpApplicationLayerLesson,
  sdpDatabaseLesson,
  sdpCachingLesson,
  sdpAsynchronismLesson,
  sdpCommunicationLesson,
  sdpSecurityLesson,
  
  // NFR Thinking Lessons
  nfrFundamentalsLesson,
  nfrDataConsistencyLesson,
];

/**
 * Get lesson by slug
 */
export function getLessonBySlug(slug: string): SystemDesignLesson | undefined {
  return allLessons.find(lesson => lesson.slug === slug);
}

/**
 * Get lessons by category
 */
export function getLessonsByCategory(category: SystemDesignLesson['category']): SystemDesignLesson[] {
  return allLessons.filter(lesson => lesson.category === category);
}

/**
 * Get lessons by difficulty
 */
export function getLessonsByDifficulty(difficulty: SystemDesignLesson['difficulty']): SystemDesignLesson[] {
  return allLessons.filter(lesson => lesson.difficulty === difficulty);
}

/**
 * Get recommended lessons for a challenge
 */
export function getRecommendedLessons(challengeId: string): SystemDesignLesson[] {
  return allLessons.filter(lesson => 
    lesson.relatedChallenges?.includes(challengeId)
  );
}

