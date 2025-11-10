import { useState } from 'react';
import { CheckCircle2, XCircle, BookOpen, RotateCcw } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import type { Exercise } from '../../utils/dataTransformer';

// ============================================
// TYPES
// ============================================

interface ExercisePanelProps {
  exercises: Exercise[];
}

// ============================================
// EXERCISE PANEL COMPONENT
// ============================================

export function ExercisePanel({ exercises }: ExercisePanelProps) {
  const [exerciseAnswers, setExerciseAnswers] = useState<Map<string, number | string>>(new Map());
  const [exerciseSubmitted, setExerciseSubmitted] = useState<Set<string>>(new Set());
  const [exerciseShowResults, setExerciseShowResults] = useState<Set<string>>(new Set());

  const handleSelectMCQ = (exerciseId: string, optionIndex: number) => {
    if (exerciseShowResults.has(exerciseId)) return;
    const newAnswers = new Map(exerciseAnswers);
    newAnswers.set(exerciseId, optionIndex);
    setExerciseAnswers(newAnswers);
  };

  const handleSubmitExercise = (exerciseId: string) => {
    const selectedAnswer = exerciseAnswers.get(exerciseId);
    if (selectedAnswer === undefined) return;
    setExerciseSubmitted(prev => new Set(prev).add(exerciseId));
    setExerciseShowResults(prev => new Set(prev).add(exerciseId));
  };

  const handleResetExercise = (exerciseId: string) => {
    const newAnswers = new Map(exerciseAnswers);
    newAnswers.delete(exerciseId);
    setExerciseAnswers(newAnswers);
    setExerciseSubmitted(prev => {
      const newSet = new Set(prev);
      newSet.delete(exerciseId);
      return newSet;
    });
    setExerciseShowResults(prev => {
      const newSet = new Set(prev);
      newSet.delete(exerciseId);
      return newSet;
    });
  };

  if (exercises.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No exercises available for this lesson</p>
        </div>
      </div>
    );
  }

  // Sort exercises by sequence_order
  const sortedExercises = [...exercises].sort((a, b) => 
    (a.sequence_order || 0) - (b.sequence_order || 0)
  );

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">Exercises</h2>
          <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-300">
            {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {sortedExercises.map((exercise) => {
            const exData = exercise.exercise_data;
            const exerciseId = exercise.id;
            const isSubmitted = exerciseSubmitted.has(exerciseId);
            const showResults = exerciseShowResults.has(exerciseId);
            const selectedAnswer = exerciseAnswers.get(exerciseId);
            const isCorrect = exercise.exercise_type === 'mcq' && 
              selectedAnswer === exData.correct_answer_index;

            return (
              <Card key={exerciseId} className="p-4 bg-white border-slate-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs">
                        Exercise {exercise.sequence_order}
                      </Badge>
                      {exData.difficulty && (
                        <Badge variant="outline" className="text-xs">
                          {exData.difficulty}
                        </Badge>
                      )}
                      {showResults && (
                        <Badge variant="outline" className={isCorrect ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </Badge>
                      )}
                    </div>
                    {showResults && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResetExercise(exerciseId)}
                        className="h-6 px-2 text-xs"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>

                  {exercise.exercise_type === 'mcq' && exData.question && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-900">{exData.question}</h3>
                      {exData.options && exData.options.length > 0 && (
                        <div className="space-y-2">
                          {exData.options.map((option: string, optIndex: number) => {
                            const isSelected = selectedAnswer === optIndex;
                            const isCorrectOption = optIndex === exData.correct_answer_index;
                            const showCorrect = showResults && isCorrectOption;
                            const showIncorrect = showResults && isSelected && !isCorrectOption;

                            return (
                              <button
                                key={optIndex}
                                onClick={() => handleSelectMCQ(exerciseId, optIndex)}
                                disabled={showResults}
                                className={`w-full text-left p-2 rounded-lg border-2 transition-all text-sm ${
                                  showCorrect
                                    ? 'bg-green-50 border-green-400 text-green-900'
                                    : showIncorrect
                                    ? 'bg-red-50 border-red-400 text-red-900'
                                    : isSelected
                                    ? 'bg-blue-50 border-blue-400 text-blue-900'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                                } ${showResults ? 'cursor-default' : 'cursor-pointer'}`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                    isSelected 
                                      ? showCorrect
                                        ? 'border-green-500 bg-green-500'
                                        : showIncorrect
                                        ? 'border-red-500 bg-red-500'
                                        : 'border-blue-500 bg-blue-500'
                                      : 'border-slate-300'
                                  }`}>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                  <span className="font-medium text-xs">{String.fromCharCode(65 + optIndex)}.</span>
                                  <span className="flex-1 text-sm">{option}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {!showResults && selectedAnswer !== undefined && (
                        <Button
                          onClick={() => handleSubmitExercise(exerciseId)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 h-8"
                        >
                          Submit Answer
                        </Button>
                      )}
                      {showResults && exData.explanation && (
                        <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                          <p className="text-xs text-slate-700">
                            <strong>Explanation:</strong> {exData.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {(exercise.exercise_type === 'short_answer' || exercise.exercise_type === 'reflection' || exercise.exercise_type === 'checkpoint') && exData.prompt && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-900">{exData.prompt}</h3>
                      <textarea
                        value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
                        onChange={(e) => {
                          const newAnswers = new Map(exerciseAnswers);
                          newAnswers.set(exerciseId, e.target.value);
                          setExerciseAnswers(newAnswers);
                        }}
                        disabled={showResults}
                        placeholder={
                          exercise.exercise_type === 'reflection' 
                            ? '💭 Take a moment to reflect...'
                            : exercise.exercise_type === 'checkpoint'
                            ? '✓ Check your understanding...'
                            : 'Type your answer here...'
                        }
                        className="w-full p-3 bg-white rounded-lg border-2 border-slate-200 focus:border-blue-400 focus:outline-none resize-y min-h-[100px] text-sm text-slate-700 disabled:bg-slate-50 disabled:text-slate-500"
                      />
                      {!showResults && typeof selectedAnswer === 'string' && selectedAnswer.trim().length > 0 && (
                        <Button
                          onClick={() => handleSubmitExercise(exerciseId)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 h-8"
                        >
                          Submit Answer
                        </Button>
                      )}
                      {showResults && (
                        <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700">
                            ✓ Answer submitted! {exercise.exercise_type === 'reflection' ? 'Great reflection!' : 'Well done!'}
                          </p>
                        </div>
                      )}
                      {exData.hints && exData.hints.length > 0 && (
                        <div className="mt-3">
                          <details className="group">
                            <summary className="cursor-pointer text-xs font-medium text-blue-600 hover:text-blue-700">
                              💡 Show Hints
                            </summary>
                            <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                                {exData.hints.map((hint: string, hintIndex: number) => (
                                  <li key={hintIndex}>{hint}</li>
                                ))}
                              </ul>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

