// Export all system design lessons
// Lessons are organized by category: fundamentals, components, patterns, problem-solving

import type { SystemDesignLesson } from '../../types/lesson';

// Fundamentals lessons (Level 1)
import { introductionLesson } from './fundamentals/01-introduction';
import { componentsLesson } from './fundamentals/02-components';
import { capacityPlanningLesson } from './fundamentals/03-capacity-planning';

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

