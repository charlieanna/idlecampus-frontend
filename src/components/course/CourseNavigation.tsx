import { Box, Layers, Network, FileKey, CheckCircle, Circle, Lock, ClipboardCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

// ============================================
// TYPES
// ============================================

export interface Command {
  command: string;
  description: string;
  example: string;
}

type LessonItem =
  | { type: 'content'; markdown: string }
  | { type: 'command'; command: Command };

export interface Lesson {
  id: string;
  title: string;
  items: LessonItem[];
  content?: string;
  commands?: Command[];
}

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

export type QuizQuestion =
  | {
      id: string;
      type: 'mcq';
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }
  | {
      id: string;
      type: 'command';
      question: string;
      expectedCommand: string;
      hint: string;
      explanation: string;
    };

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  lessons: Lesson[];
  labs: Lab[];
  quizzes?: Quiz[];
}

// ============================================
// ICON MAP
// ============================================

const iconMap: Record<string, any> = {
  box: Box,
  layers: Layers,
  network: Network,
  'file-key': FileKey,
};

// ============================================
// COURSE NAVIGATION COMPONENT
// ============================================

export interface CourseNavigationProps {
  modules: Module[];
  selectedModule: string;
  selectedLesson: string;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  completedLessons: Set<string>;
  completedCommands: Set<string>;
  courseTitle?: string;
  courseSubtitle?: string;
}

export function CourseNavigation({
  modules,
  selectedModule,
  selectedLesson,
  onSelectLesson,
  completedLessons,
  completedCommands,
  courseTitle = 'CKAD Course',
  courseSubtitle = 'Kubernetes Application Developer',
}: CourseNavigationProps) {
  return (
    <div className="w-80 border-r bg-slate-50 flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-blue-600">{courseTitle}</h1>
        <p className="text-slate-600 text-sm mt-1">{courseSubtitle}</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {modules.map((module: Module) => {
            const Icon = iconMap[module.icon] || Box;
            const moduleCompleted = module.lessons.every(lesson =>
              completedLessons.has(lesson.id)
            );

            return (
              <div key={module.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <h3 className="text-slate-900">{module.title}</h3>
                  {moduleCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                  )}
                </div>

                <div className="space-y-1 ml-6">
                  {module.lessons.map((lesson: Lesson, index: number) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    const isSelected = selectedModule === module.id && selectedLesson === lesson.id;

                    const items: LessonItem[] = lesson.items || [
                      { type: 'content', markdown: lesson.content || '' },
                      ...(lesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
                    ];

                    const commands = items.filter(item => item.type === 'command').map(item => item.command);
                    const hasCommands = commands.length > 0;

                    const lessonCompletedCount = hasCommands ? commands.filter((_, i) =>
                      completedCommands.has(`${lesson.id}-${i}`)
                    ).length : 0;
                    const lessonTotalCommands = commands.length;

                    let lessonCurrentCommandIndex = -1;
                    if (hasCommands && isSelected) {
                      for (let i = 0; i < commands.length; i++) {
                        const commandKey = `${lesson.id}-${i}`;
                        if (!completedCommands.has(commandKey)) {
                          lessonCurrentCommandIndex = i;
                          break;
                        }
                      }
                    }

                    return (
                      <div key={lesson.id}>
                        <Button
                          variant={isSelected ? 'secondary' : 'ghost'}
                          className="w-full justify-start text-sm h-auto py-2"
                          onClick={() => onSelectLesson(module.id, lesson.id)}
                        >
                          <span className="flex items-center gap-2 w-full">
                            <span className="text-slate-500">
                              {index + 1}.
                            </span>
                            <span className="flex-1 text-left">{lesson.title}</span>
                            {isCompleted && (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            )}
                            {hasCommands && isSelected && (
                              <Badge variant="outline" className="text-xs">
                                {lessonCompletedCount}/{lessonTotalCommands}
                              </Badge>
                            )}
                          </span>
                        </Button>

                        {isSelected && hasCommands && (
                          <div className="ml-6 mt-2 space-y-1.5 pb-2">
                            {commands.map((cmd: Command, cmdIndex: number) => {
                              const commandKey = `${lesson.id}-${cmdIndex}`;
                              const isCommandCompleted = completedCommands.has(commandKey);
                              const isCurrentCommand = cmdIndex === lessonCurrentCommandIndex;
                              const isLocked = cmdIndex > lessonCurrentCommandIndex && lessonCurrentCommandIndex !== -1;

                              return (
                                <div
                                  key={cmdIndex}
                                  className={`flex items-start gap-2 p-2 rounded transition-all duration-300 text-xs ${
                                    isCurrentCommand
                                      ? 'bg-blue-100 border border-blue-300'
                                      : isCommandCompleted
                                      ? 'bg-green-50 border border-green-200'
                                      : 'bg-slate-50 border border-slate-200'
                                  }`}
                                >
                                  <div className="mt-0.5 flex-shrink-0">
                                    {isCommandCompleted ? (
                                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                    ) : isCurrentCommand ? (
                                      <Circle className="w-3.5 h-3.5 text-blue-600 fill-blue-600 animate-pulse" />
                                    ) : isLocked ? (
                                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                                    ) : (
                                      <Circle className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <code className={`block truncate ${
                                      isCurrentCommand
                                        ? 'text-blue-700'
                                        : isCommandCompleted
                                        ? 'text-green-700'
                                        : isLocked
                                        ? 'text-slate-400'
                                        : 'text-slate-600'
                                    }`}>
                                      {cmd.command}
                                    </code>
                                    <p className={`mt-0.5 line-clamp-2 ${
                                      isLocked ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                      {cmd.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}

                            <div className="mt-2 pt-2 border-t border-slate-200">
                              <div className="bg-slate-200 rounded-full h-1.5">
                                <div
                                  className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${(lessonCompletedCount / lessonTotalCommands) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {module.quizzes && module.quizzes.map((quiz: Quiz) => {
                    const quizId = `${module.id}-${quiz.id}`;
                    const isSelected = selectedModule === module.id && selectedLesson === quizId;
                    const isCompleted = completedLessons.has(quizId);

                    return (
                      <Button
                        key={quiz.id}
                        variant={isSelected ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-sm h-auto py-2"
                        onClick={() => onSelectLesson(module.id, quizId)}
                      >
                        <span className="flex items-center gap-2 w-full">
                          <ClipboardCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span className="flex-1 text-left">{quiz.title}</span>
                          {isCompleted && (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          )}
                        </span>
                      </Button>
                    );
                  })}

                  {module.labs && module.labs.length > 0 && (
                    <>
                      {console.log(`🔬 Rendering labs for ${module.title}:`, module.labs)}
                      {module.labs.map((lab: Lab) => {
                        const labId = `${module.id}-${lab.id}`;
                        const isSelected = selectedModule === module.id && selectedLesson === labId;

                        return (
                          <Button
                            key={lab.id}
                            variant={isSelected ? 'secondary' : 'ghost'}
                            className="w-full justify-start text-sm h-auto py-2"
                            onClick={() => onSelectLesson(module.id, labId)}
                          >
                            <span className="flex items-center gap-2 w-full">
                              <Badge variant="outline" className="text-xs">Lab</Badge>
                              <span className="flex-1 text-left">{lab.title}</span>
                            </span>
                          </Button>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
