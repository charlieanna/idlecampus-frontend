import { getPracticeExercisesWithMeta } from '../data/allModuleExercises';
import type { ExerciseWithModuleMeta } from '../data/allModuleExercises';
import type { ExerciseSection } from '../types/progressive-lesson-enhanced';

type Difficulty = 'easy' | 'medium' | 'hard';

export interface PracticeExercise {
  id: string;
  title: string;
  prompt: string;
  description: string;
  instruction: string;
  starterCode: string;
  solution: string;
  testCases: Array<{ input: string; expectedOutput: string; hidden?: boolean; description?: string }>;
  difficulty: Difficulty;
  moduleId: string;
  moduleTitle: string;
  conceptFamily?: string;
  metadata?: ExerciseSection['metadata'];
  hints?: (string | { text?: string;[key: string]: any })[];
  targetComplexity?: { time: string; space: string };
}

const normalizeDifficulty = (difficulty?: ExerciseSection['difficulty']): Difficulty => {
  if (difficulty === 'easy' || difficulty === 'medium' || difficulty === 'hard') {
    return difficulty;
  }
  return 'medium';
};

const normalizeSolution = (exercise: ExerciseSection): string => {
  if (typeof exercise.solution === 'string') {
    return exercise.solution;
  }
  return exercise.solution?.text || exercise.expectedOutput || '';
};

const normalizeInstruction = (exercise: ExerciseSection): string => {
  if (exercise.instruction && exercise.instruction.trim().length > 0) {
    return exercise.instruction;
  }
  if (exercise.description && exercise.description.trim().length > 0) {
    return exercise.description;
  }
  return exercise.title;
};

const normalizeTestCases = (
  exercise: ExerciseSection
): Array<{ input: string; expectedOutput: string; hidden?: boolean; description?: string }> => {
  return (exercise.testCases || []).map(tc => ({
    input: tc.input ?? '',
    expectedOutput: tc.expectedOutput ?? '',
    hidden: (tc as any).hidden,
    description: tc.description
  }));
};

const mapExercise = (exercise: ExerciseWithModuleMeta): PracticeExercise => {
  const difficulty = normalizeDifficulty(exercise.difficulty);
  const instruction = normalizeInstruction(exercise);
  const patternKey = exercise.conceptFamily || exercise.metadata?.failureCategory;

  return {
    id: exercise.id,
    title: exercise.title,
    prompt: exercise.description || instruction,
    description: exercise.description || '',
    instruction,
    starterCode: exercise.starterCode || '',
    solution: normalizeSolution(exercise),
    testCases: normalizeTestCases(exercise),
    difficulty,
    moduleId: exercise.moduleId,
    moduleTitle: exercise.moduleTitle,
    conceptFamily: patternKey,
    metadata: exercise.metadata,
    hints: exercise.hints,
    targetComplexity: exercise.targetComplexity
  };
};

let practiceExercisesCache: PracticeExercise[] | null = null;

export function getAllPracticeExercises(): PracticeExercise[] {
  if (!practiceExercisesCache) {
    const exercises = getPracticeExercisesWithMeta();
    practiceExercisesCache = exercises.map(mapExercise);
  }
  return practiceExercisesCache;
}

export function getPracticeExerciseById(id: string): PracticeExercise | undefined {
  return getAllPracticeExercises().find(exercise => exercise.id === id);
}

export function getPracticeExercisesByConcept(concept: string): PracticeExercise[] {
  const normalized = concept.toLowerCase();
  return getAllPracticeExercises().filter(exercise => exercise.conceptFamily?.toLowerCase() === normalized);
}

export function getPracticeExercisesByModule(moduleId: string): PracticeExercise[] {
  return getAllPracticeExercises().filter(exercise => exercise.moduleId === moduleId);
}
