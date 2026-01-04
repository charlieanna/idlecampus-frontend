import { ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module14EdgeCaseDrillsLessonSmartPracticeExercises } from './exercises/moduleEdgeCaseDrillsLessonSmartPracticeExercises';

export const module14EdgeCaseDrillsLesson: ProgressiveLesson = {
  id: 'edge-case-drills',
  title: 'Module: Edge Case Drills',
  description: 'This final module covers advanced algorithms, mixed-technique problems, and interview strategies. Students consolidate their learning, tackle complex multi-pattern problems, and prepare for real interviews.',
  unlockMode: 'sequential',
  sections: [
    ...module14EdgeCaseDrillsLessonSmartPracticeExercises,
  ],
};
