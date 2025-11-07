/**
 * IIT JEE Chemistry Curriculum - Complete Export
 *
 * Comprehensive Chemistry course structure for IIT JEE preparation
 * Includes both Class 11 and Class 12 courses
 *
 * @module chemistry
 */

export * from './types';
export { class11ChemistryCourse } from './class11';
export { class12ChemistryCourse } from './class12';

import { class11ChemistryCourse } from './class11';
import { class12ChemistryCourse } from './class12';
import type { ChemistryCourse } from './types';

/**
 * All IIT JEE Chemistry Courses
 */
export const chemistryCourses: ChemistryCourse[] = [
  class11ChemistryCourse,
  class12ChemistryCourse,
];

/**
 * Get course by slug
 */
export function getChemistryCourse(slug: string): ChemistryCourse | undefined {
  return chemistryCourses.find(course => course.slug === slug);
}

/**
 * Get course by class
 */
export function getCourseByClass(classNum: 11 | 12): ChemistryCourse | undefined {
  return chemistryCourses.find(course => course.class === classNum);
}

/**
 * Curriculum Statistics
 */
export const curriculumStats = {
  totalCourses: chemistryCourses.length,
  class11Modules: class11ChemistryCourse.modules.length,
  class12Modules: class12ChemistryCourse.modules.length,
  totalModules: class11ChemistryCourse.modules.length + class12ChemistryCourse.modules.length,
  totalHours: class11ChemistryCourse.estimatedHours + class12ChemistryCourse.estimatedHours,
};
