import type { ExerciseSection, LessonSection, ProgressiveLesson } from '../types/progressive-lesson-enhanced';
import { module00a_PythonMechanicsLesson } from './modulePythonMechanicsLesson';
import { module00b_PythonAlgorithmicLesson } from './modulePythonAlgorithmicLesson';
import { module0_5PythonBasicsLesson } from './modulePythonBasicsLesson';
import { module1ArrayIterationLesson } from './moduleArrayIterationLesson';
import { module2HashMapLesson } from './moduleHashMapLesson';
import { module3BitManipulationLesson } from './moduleBitManipulationLesson';
import { module4_5PythonOOPLesson } from './modulePythonOOPLesson';
import { module5LinkedListLesson } from './moduleLinkedListLesson';
import { module6TreesLesson } from './moduleTreesLesson';
import { module7BinarySearchLesson } from './moduleBinarySearchLesson';
import { module8GraphsLesson } from './moduleGraphsLesson';
import { module9UnionFindLesson } from './moduleUnionFindLesson';
import { module9DynamicProgrammingLesson } from './moduleDPFoundationsLesson';
import { module9RecursionTreesLesson } from './moduleRecursionTreesLesson';
import { module10BacktrackingLesson } from './moduleBacktrackingBasicsLesson';
import { module10HeapsLesson } from './moduleHeapsLesson';
import { module11DynamicProgrammingLesson } from './moduleDynamicProgrammingLesson';
import { module12TriesLesson } from './moduleTriesLesson';
// module13AdvancedLesson removed
import { module14EdgeCaseDrillsLesson } from './moduleEdgeCaseDrillsLesson';
import { module15ParenthesesLesson } from './moduleParenthesesLesson';
import { modulePrefixSuffixLesson } from './modulePrefixSuffixLesson';
import { moduleSlidingWindowLesson } from './moduleSlidingWindowLesson';
import { moduleStackLesson } from './moduleStackLesson';
import { moduleQueueLesson } from './moduleQueueLesson';
import { moduleIntervalsLesson } from './moduleIntervalsLesson';

const MODULE_LESSONS: ProgressiveLesson[] = [
  module00a_PythonMechanicsLesson,
  module00b_PythonAlgorithmicLesson,
  module0_5PythonBasicsLesson,
  module1ArrayIterationLesson,
  module2HashMapLesson,
  module3BitManipulationLesson,
  module4_5PythonOOPLesson,
  module5LinkedListLesson,
  module6TreesLesson,
  module7BinarySearchLesson,
  module8GraphsLesson,
  module9UnionFindLesson,
  module9DynamicProgrammingLesson,
  module9RecursionTreesLesson,
  module10BacktrackingLesson,
  module10HeapsLesson,
  module11DynamicProgrammingLesson,
  module12TriesLesson,
  // module13AdvancedLesson removed
  module14EdgeCaseDrillsLesson,
  module15ParenthesesLesson,
  modulePrefixSuffixLesson,
  moduleSlidingWindowLesson,
  moduleStackLesson,
  moduleQueueLesson,
  moduleIntervalsLesson
];

const isExerciseSection = (section: LessonSection): section is ExerciseSection =>
  section.type === 'exercise';

export interface ExerciseWithModuleMeta extends ExerciseSection {
  moduleId: string;
  moduleTitle: string;
}

export function getAllModuleLessons(): ProgressiveLesson[] {
  return MODULE_LESSONS;
}

export function getAllModuleExercises(): ExerciseSection[] {
  return MODULE_LESSONS.flatMap(lesson => lesson.sections.filter(isExerciseSection));
}

export function getAllModuleExercisesWithMeta(): ExerciseWithModuleMeta[] {
  return MODULE_LESSONS.flatMap(lesson =>
    lesson.sections
      .filter(isExerciseSection)
      .map(section => ({
        ...section,
        moduleId: lesson.id,
        moduleTitle: lesson.title
      }))
  );
}

export function getPracticeExercisesWithMeta(): ExerciseWithModuleMeta[] {
  return getAllModuleExercisesWithMeta().filter(
    section => section.placement === 'practice'
  );
}
