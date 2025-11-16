/**
 * DDIA Interactive Lessons Index
 *
 * All lessons organized by module, covering DDIA Part II (Distributed Data)
 */

import { Lesson, LessonModule, LessonCatalog } from '../types/lesson';
import { leaderFollowerReplicationLesson } from './replication-leader-follower';

// Export individual lessons
export { leaderFollowerReplicationLesson };

// All lessons
export const allLessons: Lesson[] = [
  leaderFollowerReplicationLesson,
  // More lessons will be added here...
];

// Module definitions
export const replicationModule: LessonModule = {
  id: 'replication',
  title: 'Replication',
  description: 'Keep copies of data on multiple machines for fault tolerance and performance',
  ddiaPartReference: 'DDIA Part II, Chapter 5',
  lessons: [
    'replication-leader-follower',
    // 'replication-multi-leader',
    // 'replication-leaderless',
  ],
  estimatedTotalTime: 35, // Will increase as more lessons added
  iconEmoji: '🔄',
};

export const partitioningModule: LessonModule = {
  id: 'partitioning',
  title: 'Partitioning (Sharding)',
  description: 'Split large datasets across multiple machines for scalability',
  ddiaPartReference: 'DDIA Part II, Chapter 6',
  lessons: [
    // 'partitioning-strategies',
    // 'partitioning-secondary-indexes',
    // 'partitioning-rebalancing',
  ],
  estimatedTotalTime: 0,
  iconEmoji: '🧩',
};

export const transactionsModule: LessonModule = {
  id: 'transactions',
  title: 'Transactions',
  description: 'Group operations into atomic units for data integrity',
  ddiaPartReference: 'DDIA Part II, Chapter 7',
  lessons: [
    // 'transactions-acid',
    // 'transactions-isolation-levels',
    // 'transactions-distributed',
  ],
  estimatedTotalTime: 0,
  iconEmoji: '🔐',
};

export const consistencyModule: LessonModule = {
  id: 'consistency',
  title: 'Consistency & Consensus',
  description: 'Understand consistency models and distributed agreement',
  ddiaPartReference: 'DDIA Part II, Chapters 8-9',
  lessons: [
    // 'consistency-linearizability',
    // 'consistency-eventual',
    // 'consistency-consensus',
  ],
  estimatedTotalTime: 0,
  iconEmoji: '🤝',
};

export const streamProcessingModule: LessonModule = {
  id: 'stream-processing',
  title: 'Stream Processing',
  description: 'Process unbounded data streams in real-time',
  ddiaPartReference: 'DDIA Part III, Chapters 10-11',
  lessons: [
    // 'batch-processing',
    // 'stream-processing',
    // 'event-sourcing-cqrs',
  ],
  estimatedTotalTime: 0,
  iconEmoji: '🌊',
};

export const cachingModule: LessonModule = {
  id: 'caching',
  title: 'Caching Strategies',
  description: 'Speed up reads with different caching patterns',
  ddiaPartReference: 'DDIA Part I, Chapter 3 & practical applications',
  lessons: [
    // 'caching-patterns',
    // 'caching-invalidation',
    // 'caching-distributed',
  ],
  estimatedTotalTime: 0,
  iconEmoji: '⚡',
};

// All modules in order
export const allModules: LessonModule[] = [
  cachingModule,
  replicationModule,
  partitioningModule,
  transactionsModule,
  consistencyModule,
  streamProcessingModule,
];

// Complete catalog
export const lessonCatalog: LessonCatalog = {
  modules: allModules,
  lessons: allLessons,
  totalEstimatedTime: allLessons.reduce((sum, lesson) => sum + lesson.estimatedTime, 0),
  conceptsCovered: [
    ...new Set(allLessons.flatMap(lesson => lesson.conceptTags)),
  ],
};

// Helper function to get lesson by ID
export const getLessonById = (id: string): Lesson | undefined => {
  return allLessons.find(lesson => lesson.id === id);
};

// Helper function to get lessons for a module
export const getLessonsForModule = (moduleId: string): Lesson[] => {
  const module = allModules.find(m => m.id === moduleId);
  if (!module) return [];

  return module.lessons
    .map(lessonId => getLessonById(lessonId))
    .filter((lesson): lesson is Lesson => lesson !== undefined);
};

// Helper function to check if all prerequisites are met
export const arePrerequisitesMet = (
  lessonId: string,
  completedLessons: string[]
): boolean => {
  const lesson = getLessonById(lessonId);
  if (!lesson || !lesson.prerequisites) return true;

  return lesson.prerequisites.every(prereq => completedLessons.includes(prereq));
};
