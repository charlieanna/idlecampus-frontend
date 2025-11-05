import { useState } from 'react';
import { CheckCircle2, Circle, Lightbulb, Code } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription } from '../ui/alert';

// ============================================
// TYPES
// ============================================

export interface Task {
  id: string;
  description: string;
  hint: string;
  validation: (command: string) => boolean;
  solution: string;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}

// ============================================
// LAB EXERCISE COMPONENT
// ============================================

export interface LabExerciseProps {
  lab: Lab;
  onTaskComplete: (taskId: string, command: string) => void;
  completedTasks: Set<string>;
  onCommand: (command: string) => string | null;
}

export function LabExercise({ lab, onTaskComplete: _onTaskComplete, completedTasks, onCommand: _onCommand }: LabExerciseProps) {
  const [showHints, setShowHints] = useState<Set<string>>(new Set());
  const [showSolutions, setShowSolutions] = useState<Set<string>>(new Set());
  const [attemptedCommands, _setAttemptedCommands] = useState<Map<string, string>>(new Map());

  const toggleHint = (taskId: string) => {
    setShowHints(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const toggleSolution = (taskId: string) => {
    setShowSolutions(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const totalTasks = lab.tasks.length;
  const completedCount = lab.tasks.filter((task: Task) => completedTasks.has(task.id)).length;
  const progress = (completedCount / totalTasks) * 100;

  return (
    <div className="h-full flex flex-col bg-white">
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl min-h-full">
          <div className="mb-6">
            <h1 className="text-slate-900 mb-2">{lab.title}</h1>
            <p className="text-slate-600 mb-4">{lab.description}</p>

            <div className="flex items-center gap-4">
              <div className="flex-1 bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-slate-600">
                {completedCount} / {totalTasks} tasks completed
              </span>
            </div>
          </div>

          {progress === 100 && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Congratulations! You've completed all tasks in this lab.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {lab.tasks.map((task: Task, index: number) => {
              const isCompleted = completedTasks.has(task.id);
              const showHint = showHints.has(task.id);
              const showSolution = showSolutions.has(task.id);
              const attemptedCommand = attemptedCommands.get(task.id);

              return (
                <Card key={task.id} className={`p-6 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-slate-500">Task {index + 1}</span>
                            {isCompleted && (
                              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-900">{task.description}</p>
                        </div>
                      </div>

                      {isCompleted && attemptedCommand && (
                        <div className="mb-3 p-3 bg-slate-900 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-3 h-3 text-green-400" />
                            <span className="text-green-400 text-sm">Your solution:</span>
                          </div>
                          <code className="text-green-400">{attemptedCommand}</code>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {!isCompleted && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleHint(task.id)}
                            >
                              <Lightbulb className="w-4 h-4 mr-2" />
                              {showHint ? 'Hide Hint' : 'Show Hint'}
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleSolution(task.id)}
                            >
                              <Code className="w-4 h-4 mr-2" />
                              {showSolution ? 'Hide Solution' : 'Show Solution'}
                            </Button>
                          </>
                        )}
                      </div>

                      {showHint && !isCompleted && (
                        <Alert className="mt-3 bg-blue-50 border-blue-200">
                          <Lightbulb className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            <span className="text-blue-900">Hint:</span> {task.hint}
                          </AlertDescription>
                        </Alert>
                      )}

                      {showSolution && !isCompleted && (
                        <div className="mt-3 p-3 bg-slate-900 rounded">
                          <div className="text-amber-400 text-sm mb-2">Solution:</div>
                          <code className="text-green-400">{task.solution}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
