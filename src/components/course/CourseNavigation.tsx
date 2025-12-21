import { Box, Layers, Network, FileKey, CheckCircle, Circle, Lock, ClipboardCheck, Sparkles, TrendingUp, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

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
  sequenceOrder?: number;
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
  canAccessLesson?: (lessonId: string, allLessonsInOrder: Array<{ id: string; sequenceOrder: number }>) => boolean;
  canAccessModule?: (moduleId: string) => boolean;
  getVisibleModules?: () => string[];
  isModuleTeaser?: (moduleId: string) => boolean;
  getProgressInfo?: () => {
    totalModules: number;
    completedModules: number;
    visibleModules: number;
    hiddenModules: number;
    currentModuleId?: string;
    currentModuleCompletion: number;
    overallProgress: number;
  };
  getModuleCompletionPercentage?: (moduleId: string) => number;
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
  canAccessLesson,
  canAccessModule,
  getVisibleModules,
  isModuleTeaser,
  getProgressInfo,
  getModuleCompletionPercentage,
}: CourseNavigationProps) {
  const [newlyUnlockedModule, setNewlyUnlockedModule] = useState<string | null>(null);
  const [showDiscoveryAnimation, setShowDiscoveryAnimation] = useState(false);

  // Get visibility and progress info
  // If getVisibleModules is not provided, show ALL modules (don't filter)
  const visibleModuleIds = getVisibleModules ? getVisibleModules() : null;
  const progressInfo = getProgressInfo ? getProgressInfo() : null;

  // Filter modules to only show visible ones - if visibleModuleIds is null, show all modules
  const visibleModules = visibleModuleIds ? modules.filter(m => visibleModuleIds.includes(m.id)) : modules;

  // Detect when a new module becomes visible
  useEffect(() => {
    const lastVisibleModule = visibleModules[visibleModules.length - 1];
    if (lastVisibleModule && isModuleTeaser?.(lastVisibleModule.id)) {
      // This is a newly revealed teaser module
      setNewlyUnlockedModule(lastVisibleModule.id);
      setShowDiscoveryAnimation(true);
      setTimeout(() => setShowDiscoveryAnimation(false), 3000);
    }
  }, [visibleModules.length, isModuleTeaser]);

  return (
    <div className="w-80 border-r bg-slate-50 flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-blue-600">{courseTitle}</h1>
        <p className="text-slate-600 text-sm mt-1">{courseSubtitle}</p>

        {/* Overall Progress */}
        {progressInfo && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Course Progress</span>
              <span className="font-semibold">{progressInfo.overallProgress}%</span>
            </div>
            <Progress value={progressInfo.overallProgress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{progressInfo.completedModules} of {progressInfo.visibleModules} modules</span>
              {progressInfo.hiddenModules > 0 && (
                <span className="flex items-center gap-1 text-blue-600">
                  <Eye className="w-3 h-3" />
                  {progressInfo.hiddenModules} to discover
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {visibleModules.map((module: Module) => {
              const Icon = iconMap[module.icon] || Box;
              const moduleCompleted = module.lessons.every(lesson =>
                completedLessons.has(lesson.id)
              );
              const isTeaser = isModuleTeaser?.(module.id) || false;
              const moduleCompletion = getModuleCompletionPercentage?.(module.id) || 0;

              // Check if module is accessible
              const isModuleAccessible = canAccessModule ? canAccessModule(module.id) : true;

              return (
                <motion.div
                  key={module.id}
                  initial={newlyUnlockedModule === module.id ? { opacity: 0, y: 20, scale: 0.95 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2"
                >
                  {/* Module Header */}
                  <div className="relative">
                    {isTeaser && showDiscoveryAnimation && newlyUnlockedModule === module.id && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1] }}
                          transition={{ duration: 1.5 }}
                          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg opacity-20 blur-xl"
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 2, delay: 0.3 }}
                          className="absolute -top-2 -right-2 text-2xl"
                        >
                          ✨
                        </motion.div>
                      </>
                    )}

                    <div className={`flex items-center gap-2 ${isTeaser ? 'opacity-60' : ''}`}>
                      {isTeaser ? (
                        <div className="flex-1">
                          <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg border border-blue-200">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-slate-700">Next Module</span>
                            <span className="ml-auto text-xs text-slate-500">
                              Complete {100 - (progressInfo?.currentModuleCompletion || 0)}% more to unlock
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Icon className={`w-4 h-4 ${isModuleAccessible ? 'text-blue-600' : 'text-slate-400'}`} />
                          <h3 className={`flex-1 ${isModuleAccessible ? 'text-slate-900' : 'text-slate-400'}`}>
                            {module.title}
                          </h3>
                          {!isModuleAccessible && (
                            <Lock className="w-4 h-4 text-slate-400" />
                          )}
                          {moduleCompleted && isModuleAccessible && (
                            <motion.div
                              initial={{ scale: 1 }}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.3 }}
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </motion.div>
                          )}
                          {!moduleCompleted && isModuleAccessible && moduleCompletion > 0 && (
                            <Badge
                              variant="outline"
                              className={`text-xs ${moduleCompletion >= 80 ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-purple-300 text-purple-700' : ''}`}
                            >
                              {moduleCompletion >= 80 && <TrendingUp className="w-3 h-3 inline mr-1" />}
                              {moduleCompletion}%
                            </Badge>
                          )}
                        </>
                      )}
                    </div>

                    {/* Module Progress Bar */}
                    {!isTeaser && isModuleAccessible && !moduleCompleted && moduleCompletion > 0 && (
                      <div className="mt-2 ml-6">
                        <Progress value={moduleCompletion} className="h-1" />
                      </div>
                    )}
                  </div>

                  {/* Lessons (only show if not a teaser) */}
                  {!isTeaser && (
                    <div className="space-y-1 ml-6">
                      {module.lessons.map((lesson: Lesson, index: number) => {
                        const isCompleted = completedLessons.has(lesson.id);
                        // selectedLesson can be either just lessonId or combined moduleId-lessonId format
                        const lessonFullId = `${module.id}-${lesson.id}`;
                        const isSelected = selectedModule === module.id && (selectedLesson === lesson.id || selectedLesson === lessonFullId);

                        // Check if lesson is accessible (considering both module and lesson level)
                        const allLessonsInModule = module.lessons.map((l, idx) => ({
                          id: l.id,
                          sequenceOrder: l.sequenceOrder ?? idx
                        }));
                        const isLessonAccessible = canAccessLesson ? canAccessLesson(lesson.id, allLessonsInModule) : true;
                        const isAccessible = isModuleAccessible && isLessonAccessible;

                        const items: LessonItem[] = lesson.items || [
                          { type: 'content', markdown: lesson.content || '' },
                          ...(lesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
                        ];

                        const commands = items.filter(item => item.type === 'command').map(item => item.command);
                        const hasCommands = commands.length > 0;

                        // Use lessonFullId for command keys to match LinuxApp format
                        const lessonCompletedCount = hasCommands ? commands.filter((_, i) =>
                          completedCommands.has(`${lessonFullId}-${i}`)
                        ).length : 0;
                        const lessonTotalCommands = commands.length;

                        let lessonCurrentCommandIndex = -1;
                        if (hasCommands && isSelected) {
                          for (let i = 0; i < commands.length; i++) {
                            const commandKey = `${lessonFullId}-${i}`;
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
                              onClick={() => isAccessible && onSelectLesson(module.id, lesson.id)}
                              disabled={!isAccessible}
                            >
                              <span className="flex items-center gap-2 w-full">
                                <span className={`${!isAccessible ? 'text-slate-400' : 'text-slate-500'}`}>
                                  {index + 1}.
                                </span>
                                <span className={`flex-1 text-left ${!isAccessible ? 'text-slate-400' : ''}`}>{lesson.title}</span>
                                {!isAccessible && (
                                  <Lock className="w-3 h-3 text-slate-400" />
                                )}
                                {isCompleted && isAccessible && (
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                )}
                                {hasCommands && isSelected && isAccessible && (
                                  <Badge variant="outline" className="text-xs">
                                    {lessonCompletedCount}/{lessonTotalCommands}
                                  </Badge>
                                )}
                              </span>
                            </Button>

                            {isSelected && hasCommands && isAccessible && (
                              <div className="ml-6 mt-2 space-y-1.5 pb-2">
                                {commands.map((cmd: Command, cmdIndex: number) => {
                                  const commandKey = `${lessonFullId}-${cmdIndex}`;
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
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Hidden Modules Teaser */}
          {progressInfo && progressInfo.hiddenModules > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-gradient-to-br from-slate-100 to-blue-50 rounded-lg border border-slate-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-slate-700">Keep Going!</span>
              </div>
              <p className="text-xs text-slate-600">
                {progressInfo.hiddenModules} more {progressInfo.hiddenModules === 1 ? 'module' : 'modules'} to discover.
                Complete your current module to reveal what's next!
              </p>
              {progressInfo.currentModuleCompletion >= 60 && (
                <div className="mt-2 text-xs text-blue-600 font-medium">
                  You're {100 - progressInfo.currentModuleCompletion}% away from unlocking the next module!
                </div>
              )}
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}