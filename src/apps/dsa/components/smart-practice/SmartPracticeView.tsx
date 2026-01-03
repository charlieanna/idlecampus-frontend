import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ExerciseBasedLesson from '../progressive-lesson/ExerciseBasedLesson';
import type { ProgressiveLesson, ProgressiveLessonProgress, SectionProgress, ExerciseSection } from '../../types/progressive-lesson-enhanced';
import { moduleSlidingWindowLessonSmartPracticeExercises } from '../../data/exercises/moduleSlidingWindowLessonSmartPracticeExercises';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';

// All available practice exercises from the Sliding Window module
const ALL_PRACTICE_EXERCISES: ExerciseSection[] = moduleSlidingWindowLessonSmartPracticeExercises;

// Storage key for practice session progress
const PRACTICE_PROGRESS_KEY = 'dsa-practice-session-progress';

// Detailed tracking per exercise
export interface PracticeExerciseStats {
  exerciseId: string;
  attempts: number;
  hintsUsed: number;
  solutionViewed: boolean;
  solvedAt?: string; // ISO timestamp
  timeToSolve?: number; // seconds
  startedAt?: string; // ISO timestamp
}

// Load practice stats from localStorage
const loadPracticeStats = (): Map<string, PracticeExerciseStats> => {
  try {
    const saved = localStorage.getItem(PRACTICE_PROGRESS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return new Map(parsed);
    }
  } catch (error) {
    console.error('Error loading practice stats:', error);
  }
  return new Map();
};

// Save practice stats to localStorage
const savePracticeStats = (stats: Map<string, PracticeExerciseStats>) => {
  try {
    localStorage.setItem(PRACTICE_PROGRESS_KEY, JSON.stringify(Array.from(stats.entries())));
  } catch (error) {
    console.error('Error saving practice stats:', error);
  }
};

type SmartPracticeViewProps = {
  onSelectProblem: (problemId: string) => void;
  runPythonCode: (code: string) => Promise<{ output: string; error?: string }>;
  // Solved problems tracking
  solvedProblems: Set<string>;
  setSolvedProblems: React.Dispatch<React.SetStateAction<Set<string>>>;
  // State management props passed from parent
  hintsUsed: Map<string, number>;
  setHintsUsed: (hints: Map<string, number>) => void;
  expandedLessons: Set<string>;
  setExpandedLessons: (lessons: Set<string>) => void;
  collapsedDescriptions: Set<string>;
  setCollapsedDescriptions: (descriptions: Set<string>) => void;
  bruteForceSolved: Set<string>;
  setBruteForceSolved: (solved: Set<string>) => void;
  showBruteForceBlocker: Set<string>;
  setShowBruteForceBlocker: (show: Set<string>) => void;
  highlightBruteForceBlocker: string | null;
  setHighlightBruteForceBlocker: (id: string | null) => void;
  exercisesAwaitingAnalysis: Set<string>;
  setExercisesAwaitingAnalysis: (exercises: Set<string>) => void;
  exercisesWithBeforeQuizCompleted: Set<string>;
  setExercisesWithBeforeQuizCompleted: (exercises: Set<string>) => void;
  showingBeforeQuizExplanation: string | null;
  setShowingBeforeQuizExplanation: (id: string | null) => void;
  readingQuizAnswers: Map<string, { answer: number | null; completed: boolean }>;
  setReadingQuizAnswers: (answers: Map<string, { answer: number | null; completed: boolean }>) => void;
  progressiveQuizIndex: number;
  setProgressiveQuizIndex: (index: number) => void;
  showLinkedListPractice: boolean;
  setShowLinkedListPractice: (show: boolean) => void;
  setCurrentModuleIndex?: (index: number) => void;
  setCurrentPracticeModule?: (module: number) => void;
};

export function SmartPracticeView({
  onSelectProblem,
  runPythonCode,
  solvedProblems,
  setSolvedProblems,
  hintsUsed,
  setHintsUsed,
  expandedLessons,
  setExpandedLessons,
  collapsedDescriptions,
  setCollapsedDescriptions,
  bruteForceSolved,
  setBruteForceSolved,
  showBruteForceBlocker,
  setShowBruteForceBlocker,
  highlightBruteForceBlocker,
  setHighlightBruteForceBlocker,
  exercisesAwaitingAnalysis,
  setExercisesAwaitingAnalysis,
  exercisesWithBeforeQuizCompleted,
  setExercisesWithBeforeQuizCompleted,
  showingBeforeQuizExplanation,
  setShowingBeforeQuizExplanation,
  readingQuizAnswers,
  setReadingQuizAnswers,
  progressiveQuizIndex,
  setProgressiveQuizIndex,
  showLinkedListPractice,
  setShowLinkedListPractice,
  setCurrentModuleIndex,
  setCurrentPracticeModule,
}: SmartPracticeViewProps) {
  // If true, include solved exercises in the session (otherwise show only unsolved).
  const [showSolvedProblems, setShowSolvedProblems] = useState(false);

  // Load and track detailed practice stats
  const [practiceStats, setPracticeStats] = useState<Map<string, PracticeExerciseStats>>(() => loadPracticeStats());

  // Filter out already-solved problems
  const unsolvedExercises = useMemo(() => {
    const filtered = ALL_PRACTICE_EXERCISES.filter(exercise => !solvedProblems.has(exercise.id));
    if (filtered.length !== ALL_PRACTICE_EXERCISES.length) {
      console.log('Practice: Showing', filtered.length, 'unsolved exercises (solved:', ALL_PRACTICE_EXERCISES.length - filtered.length, ')');
    }
    return filtered;
  }, [solvedProblems]);

  const visibleExercises = useMemo(
    () => (showSolvedProblems ? ALL_PRACTICE_EXERCISES : unsolvedExercises),
    [showSolvedProblems, unsolvedExercises]
  );

  const solvedCount = ALL_PRACTICE_EXERCISES.length - unsolvedExercises.length;

  // Create a progressive lesson with visible exercises
  const practiceLesson: ProgressiveLesson = useMemo(() => ({
    id: 'smart-practice-session',
    title: 'Practice: Sliding Window',
    description: 'Practice sliding window problems from the course',
    unlockMode: 'sequential',
    sections: visibleExercises,
  }), [visibleExercises]);

  // Initialize progress state for visible exercises, restoring attempts from stats
  const [progressiveLessonProgress, setProgressiveLessonProgress] = useState<ProgressiveLessonProgress>(() => {
    const sectionsProgress = new Map<string, SectionProgress>();
    visibleExercises.forEach((exercise, index) => {
      const stats = practiceStats.get(exercise.id);
      sectionsProgress.set(exercise.id, {
        sectionId: exercise.id,
        status: showSolvedProblems ? 'unlocked' : (index === 0 ? 'unlocked' : 'locked'),
        attempts: stats?.attempts || 0,
        timeSpent: 0,
        solutionViewed: stats?.solutionViewed || false,
        hintsUsedCount: stats?.hintsUsed || 0,
      });
    });
    const now = new Date();
    return {
      lessonId: 'smart-practice-session',
      currentSectionIndex: 0,
      sectionsProgress,
      overallProgress: 0,
      startedAt: now,
      lastActivityAt: now,
      totalTimeSpent: 0,
    };
  });

  // Update stats when hints are used
  useEffect(() => {
    const updatedStats = new Map(practiceStats);
    let hasChanges = false;
    
    hintsUsed.forEach((count, exerciseId) => {
      const existing = updatedStats.get(exerciseId);
      if (!existing) {
        updatedStats.set(exerciseId, {
          exerciseId,
          attempts: 0,
          hintsUsed: count,
          solutionViewed: false,
          startedAt: new Date().toISOString(),
        });
        hasChanges = true;
      } else if (existing.hintsUsed !== count) {
        updatedStats.set(exerciseId, { ...existing, hintsUsed: count });
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setPracticeStats(updatedStats);
      savePracticeStats(updatedStats);
    }
  }, [hintsUsed]);

  // Track the last section index to detect when user clicks "Next"
  const [lastSectionIndex, setLastSectionIndex] = useState(0);

  // Track attempts and solution viewing from progress updates
  // This function handles BOTH direct updates AND React setState callback style
  const handleProgressUpdate = useCallback((updatesOrCallback: Partial<ProgressiveLessonProgress> | ((prev: ProgressiveLessonProgress) => ProgressiveLessonProgress)) => {
    setProgressiveLessonProgress(prev => {
      // Handle both callback-style and direct updates
      let newProgress: ProgressiveLessonProgress;
      if (typeof updatesOrCallback === 'function') {
        newProgress = updatesOrCallback(prev);
      } else {
        newProgress = { ...prev, ...updatesOrCallback };
        if (updatesOrCallback.sectionsProgress) {
          newProgress.sectionsProgress = updatesOrCallback.sectionsProgress;
        }
      }
      return newProgress;
    });
  }, []);

  // Track practice stats separately when progress changes
  useEffect(() => {
    const updatedStats = new Map(practiceStats);
    let hasChanges = false;
    
    progressiveLessonProgress.sectionsProgress.forEach((progress, exerciseId) => {
      const existing = updatedStats.get(exerciseId) || {
        exerciseId,
        attempts: 0,
        hintsUsed: hintsUsed.get(exerciseId) || 0,
        solutionViewed: false,
      };
      
      // Check if solution should be visible (gave up)
      const exercise = ALL_PRACTICE_EXERCISES.find(e => e.id === exerciseId);
      const solutionAfterAttempt = exercise?.solution && typeof exercise.solution === 'object' 
        ? exercise.solution.afterAttempt 
        : null;
      const solutionViewed = solutionAfterAttempt !== null && progress.attempts >= solutionAfterAttempt;
      
      // Update if attempts changed or solution was viewed
      if (existing.attempts !== progress.attempts || existing.solutionViewed !== solutionViewed) {
        updatedStats.set(exerciseId, {
          ...existing,
          attempts: progress.attempts,
          solutionViewed: solutionViewed || existing.solutionViewed,
          hintsUsed: hintsUsed.get(exerciseId) || existing.hintsUsed,
          startedAt: existing.startedAt || new Date().toISOString(),
        });
        hasChanges = true;
      }
      
      // Mark as solved if completed
      if (progress.status === 'completed' && !existing.solvedAt) {
        const stats = updatedStats.get(exerciseId)!;
        updatedStats.set(exerciseId, {
          ...stats,
          solvedAt: new Date().toISOString(),
          timeToSolve: stats.startedAt 
            ? Math.floor((Date.now() - new Date(stats.startedAt).getTime()) / 1000)
            : undefined,
        });
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setPracticeStats(updatedStats);
      savePracticeStats(updatedStats);
    }
  }, [progressiveLessonProgress, hintsUsed]);

  // When currentSectionIndex changes (user clicked "Continue to Next Problem"), mark previous exercise as solved
  useEffect(() => {
    const currentIndex = progressiveLessonProgress.currentSectionIndex;
    
    // User clicked "Next" - moved to a new section
    if (currentIndex > lastSectionIndex) {
      // Find all completed exercises and mark them as solved
      const completedIds: string[] = [];
      progressiveLessonProgress.sectionsProgress.forEach((progress, exerciseId) => {
        if (progress.status === 'completed' && !solvedProblems.has(exerciseId)) {
          completedIds.push(exerciseId);
        }
      });
      
      if (completedIds.length > 0) {
        console.log('Practice: User clicked Next, marking as solved:', completedIds);
        setSolvedProblems(prev => {
          const newSet = new Set(prev);
          completedIds.forEach(id => newSet.add(id));
          return newSet;
        });
      }
    }
    
    setLastSectionIndex(currentIndex);
  }, [progressiveLessonProgress.currentSectionIndex, progressiveLessonProgress.sectionsProgress, lastSectionIndex, solvedProblems, setSolvedProblems]);

  // Re-initialize progress when visible exercises change (toggle solved / solved set updates)
  useEffect(() => {
    if (visibleExercises.length === 0) return;
    
    const sectionsProgress = new Map<string, SectionProgress>();
    visibleExercises.forEach((exercise, index) => {
      const existingProgress = progressiveLessonProgress.sectionsProgress.get(exercise.id);
      const stats = practiceStats.get(exercise.id);
      sectionsProgress.set(exercise.id, existingProgress || {
        sectionId: exercise.id,
        status: showSolvedProblems ? 'unlocked' : (index === 0 ? 'unlocked' : 'locked'),
        attempts: stats?.attempts || 0,
        timeSpent: 0,
        solutionViewed: stats?.solutionViewed || false,
        hintsUsedCount: stats?.hintsUsed || 0,
      });
    });
    
    // Check if exercises list changed (solved problem was removed)
    const currentIds = Array.from(progressiveLessonProgress.sectionsProgress.keys());
    const newIds = visibleExercises.map(e => e.id);
    const exercisesChanged = currentIds.length !== newIds.length || 
      currentIds.some(id => !newIds.includes(id));
    
    if (exercisesChanged) {
      console.log('Practice: Exercises changed, reinitializing with', newIds);
      const now = new Date();
      setProgressiveLessonProgress({
        lessonId: 'smart-practice-session',
        currentSectionIndex: 0,
        sectionsProgress,
        overallProgress: 0,
        startedAt: now,
        lastActivityAt: now,
        totalTimeSpent: 0,
      });
      setLastSectionIndex(0);
    }
  }, [visibleExercises, practiceStats, showSolvedProblems]);

  // Calculate stats summary for display
  const statsSummary = useMemo(() => {
    let totalAttempts = 0;
    let totalHints = 0;
    let solutionsViewed = 0;
    let solvedCount = 0;
    
    practiceStats.forEach(stats => {
      totalAttempts += stats.attempts;
      totalHints += stats.hintsUsed;
      if (stats.solutionViewed) solutionsViewed++;
      if (stats.solvedAt) solvedCount++;
    });
    
    return { totalAttempts, totalHints, solutionsViewed, solvedCount };
  }, [practiceStats]);

  const handleJumpToIndex = (idx: number) => {
    if (idx < 0 || idx >= practiceLesson.sections.length) return;
    // Avoid triggering the "mark solved on Next" effect when user is just jumping around.
    setLastSectionIndex(idx);
    setProgressiveLessonProgress(prev => ({ ...prev, currentSectionIndex: idx }));
    try {
      const next = practiceLesson.sections[idx] as ExerciseSection;
      onSelectProblem?.(next.id);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show completion message when all problems are solved (in unsolved-only mode)
  if (!showSolvedProblems && unsolvedExercises.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 max-w-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
            All Problems Solved!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You've completed all {ALL_PRACTICE_EXERCISES.length} sliding window problems. 
            Great job!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button
              variant="outline"
              onClick={() => setShowSolvedProblems(true)}
              className="w-full sm:w-auto"
            >
              Show solved problems
            </Button>
          </div>
          
          {/* Stats Summary */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Your Stats:</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Attempts:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{statsSummary.totalAttempts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Hints Used:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{statsSummary.totalHints}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Solutions Viewed:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{statsSummary.solutionsViewed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Solved Without Help:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {ALL_PRACTICE_EXERCISES.length - statsSummary.solutionsViewed}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Practice Header (Smart Practice hides the global header) */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-lg font-semibold text-slate-900">Smart Practice: Sliding Window</div>
              <div className="text-sm text-slate-600">
                Showing <strong>{practiceLesson.sections.length}</strong> / {ALL_PRACTICE_EXERCISES.length} problems
                {solvedCount > 0 ? (
                  <> (solved: <strong>{solvedCount}</strong>)</>
                ) : null}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700 select-none">
              <Checkbox
                checked={showSolvedProblems}
                onCheckedChange={(v) => setShowSolvedProblems(Boolean(v))}
              />
              Show solved
            </label>
          </div>

          {/* Jump selector */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">Jump to:</div>
            <select
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 max-w-full"
              value={String(progressiveLessonProgress.currentSectionIndex)}
              onChange={(e) => handleJumpToIndex(Number(e.target.value))}
            >
              {practiceLesson.sections.map((section, idx) => (
                <option key={section.id} value={String(idx)}>
                  {idx + 1}. {(section as ExerciseSection).title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ExerciseBasedLesson
          progressiveLesson={practiceLesson}
          progressiveLessonProgress={progressiveLessonProgress}
          setProgressiveLessonProgress={handleProgressUpdate}
          exercisesAwaitingAnalysis={exercisesAwaitingAnalysis}
          setExercisesAwaitingAnalysis={setExercisesAwaitingAnalysis}
          exercisesWithBeforeQuizCompleted={exercisesWithBeforeQuizCompleted}
          setExercisesWithBeforeQuizCompleted={setExercisesWithBeforeQuizCompleted}
          showingBeforeQuizExplanation={showingBeforeQuizExplanation}
          setShowingBeforeQuizExplanation={setShowingBeforeQuizExplanation}
          hintsUsed={hintsUsed}
          setHintsUsed={setHintsUsed}
          expandedLessons={expandedLessons}
          setExpandedLessons={setExpandedLessons}
          collapsedDescriptions={collapsedDescriptions}
          setCollapsedDescriptions={setCollapsedDescriptions}
          bruteForceSolved={bruteForceSolved}
          setBruteForceSolved={setBruteForceSolved}
          showBruteForceBlocker={showBruteForceBlocker}
          setShowBruteForceBlocker={setShowBruteForceBlocker}
          highlightBruteForceBlocker={highlightBruteForceBlocker}
          setHighlightBruteForceBlocker={setHighlightBruteForceBlocker}
          readingQuizAnswers={readingQuizAnswers}
          setReadingQuizAnswers={setReadingQuizAnswers}
          showLinkedListPractice={showLinkedListPractice}
          setShowLinkedListPractice={setShowLinkedListPractice}
          progressiveQuizIndex={progressiveQuizIndex}
          setProgressiveQuizIndex={setProgressiveQuizIndex}
          runPythonCode={runPythonCode}
          setCurrentModuleIndex={setCurrentModuleIndex}
          setCurrentPracticeModule={setCurrentPracticeModule}
        />
      </div>
    </div>
  );
}
