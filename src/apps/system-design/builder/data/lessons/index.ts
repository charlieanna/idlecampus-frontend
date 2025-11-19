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
// Will be added in Phase 6

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

