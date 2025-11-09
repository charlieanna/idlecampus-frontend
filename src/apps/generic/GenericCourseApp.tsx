import { useState, useEffect } from 'react';
import { GripVertical } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { Terminal } from '../../components/course/Terminal';
import { CourseNavigation, Module } from '../../components/course/CourseNavigation';
import { LessonViewer } from '../../components/course/LessonViewer';
import { LabExercise } from '../../components/course/LabExercise';
import { QuizViewer } from '../../components/course/QuizViewer';
import { apiService } from '../../services/api';
import { useLessonGating } from '../../hooks/useLessonGating';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================
// RESIZABLE COMPONENTS
// ============================================

function ResizablePanelGroup({ className = '', ...props }: any) {
  return (
    <ResizablePrimitive.PanelGroup
      className={cn('flex h-full w-full', className)}
      {...props}
    />
  );
}

function ResizablePanel(props: any) {
  return <ResizablePrimitive.Panel {...props} />;
}

function ResizableHandle({ withHandle, className = '', ...props }: any) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        'relative flex w-px items-center justify-center bg-slate-200 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-slate-200 bg-slate-100">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================

interface GenericCourseAppProps {
  courseModules: Module[];
  courseTitle: string;
  courseSubtitle?: string;
}

export default function GenericCourseApp({
  courseModules,
  courseTitle,
  courseSubtitle
}: GenericCourseAppProps) {
  // Keep a local mutable copy of modules so we can inject quiz questions when
  // they are loaded on demand. Initialize from props and keep in sync if
  // props change.
  const [modules, setModules] = useState(() => courseModules);

  useEffect(() => {
    setModules(courseModules);
  }, [courseModules]);

  console.log(`📚 ${courseTitle} loaded:`, JSON.stringify({
    modulesCount: modules.length,
    firstModule: modules[0]?.title,
    firstLesson: modules[0]?.lessons?.[0]?.title
  }, null, 2));

  const [selectedModule, setSelectedModule] = useState(modules[0]?.id || '');
  const [selectedLesson, setSelectedLesson] = useState(modules[0]?.lessons?.[0]?.id || '');
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [completedCommands, setCompletedCommands] = useState<Set<string>>(new Set());

  const onSelectLesson = (moduleId: string, lessonId: string) => {
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);
  };

  const handleTaskComplete = (taskId: string, _command: string) => {
    setCompletedTasks(prev => new Set([...prev, taskId]));
  };

  const handleCommandComplete = (lessonId: string, commandIndex: number) => {
    const commandKey = `${lessonId}-${commandIndex}`;
    const newCompletedCommands = new Set([...completedCommands, commandKey]);
    setCompletedCommands(newCompletedCommands);

    const lesson = modules
      .flatMap(m => m.lessons)
      .find(l => l.id === lessonId);

    if (lesson) {
      const items = lesson.items || [
        { type: 'content' as const, markdown: lesson.content || '' },
        ...(lesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
      ];
      const commands = items.filter(item => item.type === 'command');

      if (commands.length > 0) {
        const allCommandsComplete = commands.every((_, i) => {
          const key = `${lessonId}-${i}`;
          return newCompletedCommands.has(key);
        });

        if (allCommandsComplete) {
          setCompletedLessons(prev => new Set([...prev, lessonId]));
        }
      }
    }
  };

  const currentModule = modules.find(m => m.id === selectedModule);
  const currentLesson = currentModule?.lessons.find(l => l.id === selectedLesson);
  const currentLab = currentModule?.labs.find(l => `${selectedModule}-${l.id}` === selectedLesson);
  const currentQuiz = currentModule?.quizzes?.find(q => `${selectedModule}-${q.id}` === selectedLesson);

  // When a quiz is selected, dynamically fetch its questions if they aren't
  // already present. We strip any `quiz-` prefix from the quiz id to send the
  // numeric id to the API.
  useEffect(() => {
    let mounted = true;

    const fetchQuestionsForQuiz = async () => {
      if (!currentQuiz) return;

      // If questions already exist, nothing to do
      if (Array.isArray(currentQuiz.questions) && currentQuiz.questions.length > 0) return;

      try {
        // currentQuiz.id format: 'quiz-<id>'
        const rawId = (currentQuiz.id || '').toString().replace(/^quiz-/, '');
        // Determine API track: default to courseTitle mapping
        const track = (courseTitle && courseTitle.toLowerCase().includes('chemistry')) ? 'chemistry' : undefined;
        const apiTrack = track || 'kubernetes';

        const questions = await apiService.fetchQuizQuestions(rawId, apiTrack as any);

        if (!mounted) return;

        // Map backend questions into QuizQuestion shape expected by QuizViewer
        const mapped = (questions || []).map((q: any) => {
          if (q.question_type === 'mcq' || q.type === 'mcq') {
            return {
              id: `q-${q.id}`,
              type: 'mcq' as const,
              question: q.question_text || q.text || q.question || '',
              options: q.options || q.choices || q.answers || [],
              correctAnswer: q.correct_option_index ?? q.correct_answer_index ?? 0,
              explanation: q.explanation || q.explain || ''
            };
          }

          // Default to command-type mapping
          return {
            id: `q-${q.id}`,
            type: 'command' as const,
            question: q.question_text || q.text || q.question || '',
            expectedCommand: q.expected_command || q.example || '',
            hint: q.hint || '',
            explanation: q.explanation || ''
          };
        });

        // Inject questions into the modules state
        setModules(prev => prev.map(mod => {
          if (mod.id !== currentModule?.id) return mod;
          return {
            ...mod,
            quizzes: mod.quizzes?.map(q => q.id === currentQuiz.id ? { ...q, questions: mapped } : q)
          };
        }));
      } catch (err) {
        console.error('Failed to load quiz questions:', err);
      }
    };

    fetchQuestionsForQuiz();

    return () => { mounted = false; };
  }, [currentQuiz, courseTitle]);

  const isQuiz = !!currentQuiz;
  const [quizCommandHandler, setQuizCommandHandler] = useState<((cmd: string) => { correct: boolean; message: string } | null) | null>(null);

  const handleQuizComplete = () => {
    setCompletedLessons(prev => new Set([...prev, selectedLesson]));
  };

  const handleQuizCommand = (command: string): string | null => {
    if (quizCommandHandler) {
      const result = quizCommandHandler(command);
      if (result) {
        return result.message;
      }
    }
    return null;
  };

  const handleGoToLab = () => {
    if (currentModule && currentModule.labs.length > 0) {
      const labId = `${currentModule.id}-${currentModule.labs[0].id}`;
      onSelectLesson(currentModule.id, labId);
    }
  };

  const getCurrentExpectedCommand = (): string | null => {
    if (!currentLesson) return null;

    const items = currentLesson.items || [
      { type: 'content' as const, markdown: currentLesson.content || '' },
      ...(currentLesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
    ];
    const commands = items.filter(item => item.type === 'command').map(item => item.command);

    if (commands.length === 0) return null;

    for (let i = 0; i < commands.length; i++) {
      const commandKey = `${currentLesson.id}-${i}`;
      if (!completedCommands.has(commandKey)) {
        return commands[i].example;
      }
    }
    return null;
  };

  const expectedCommand = getCurrentExpectedCommand();

  // Use common gating hook
  const { canAccessLesson, getLessonAccessInfo } = useLessonGating(completedLessons, modules);

  const handleTerminalCommand = (command: string): string | null => {
    if (currentLesson) {
      const items = currentLesson.items || [
        { type: 'content' as const, markdown: currentLesson.content || '' },
        ...(currentLesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
      ];
      const commands = items.filter(item => item.type === 'command').map(item => item.command);

      if (commands.length > 0) {
        for (let i = 0; i < commands.length; i++) {
          const commandKey = `${currentLesson.id}-${i}`;
          if (!completedCommands.has(commandKey)) {
            const expectedCommand = commands[i].example.trim();
            if (command.trim() === expectedCommand) {
              handleCommandComplete(currentLesson.id, i);
              const isLastCommand = i === commands.length - 1;
              if (isLastCommand) {
                return `✓ Correct! Command "${commands[i].command}" completed.\n\n🎉 Congratulations! You've completed all commands for this lesson!\nThe lesson is now marked as complete.`;
              } else {
                return `✓ Correct! Command "${commands[i].command}" completed.\nThe next command and content are now unlocked above.`;
              }
            } else {
              return `✗ This doesn't match the expected command.\nExpected: ${expectedCommand}\nYou typed: ${command}`;
            }
          }
        }
      }
    }
    return null;
  };

  // Get accessibility info for current lesson
  const { isAccessible: isCurrentLessonAccessible, previousLessonTitle } = currentLesson
    ? getLessonAccessInfo(currentLesson.id)
    : { isAccessible: true, previousLessonTitle: undefined };

  // Render the app with unified layout
  return (
    <div className="h-screen flex bg-white">
      <CourseNavigation
        modules={modules}
        selectedModule={selectedModule}
        selectedLesson={selectedLesson}
        onSelectLesson={onSelectLesson}
        completedLessons={completedLessons}
        completedCommands={completedCommands}
        courseTitle={courseTitle}
        courseSubtitle={courseSubtitle}
        canAccessLesson={canAccessLesson}
      />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="h-full overflow-hidden">
            {currentLesson && (
              <LessonViewer
                lesson={currentLesson}
                isCompleted={completedLessons.has(selectedLesson)}
                completedCommands={completedCommands}
                onGoToLab={currentModule?.labs && currentModule.labs.length > 0 ? handleGoToLab : undefined}
                isAccessible={isCurrentLessonAccessible}
                previousLessonTitle={previousLessonTitle}
              />
            )}

            {currentQuiz && (
              <QuizViewer
                quiz={currentQuiz}
                onComplete={handleQuizComplete}
                isCompleted={completedLessons.has(selectedLesson)}
                onRegisterCommandHandler={(handler) => setQuizCommandHandler(() => handler)}
                onGoToLab={currentModule?.labs && currentModule.labs.length > 0 ? handleGoToLab : undefined}
              />
            )}

            {currentLab && (
              <LabExercise
                lab={currentLab}
                onTaskComplete={handleTaskComplete}
                completedTasks={completedTasks}
                onCommand={(command: string) => {
                  for (const task of currentLab.tasks) {
                    if (!completedTasks.has(task.id) && task.validation(command)) {
                      handleTaskComplete(task.id, command);
                      return `✓ Task completed: ${task.description}`;
                    }
                  }
                  return null;
                }}
              />
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={40} minSize={25}>
          <Terminal
            expectedCommand={isQuiz ? null : expectedCommand}
            onCommand={
              isQuiz
                ? handleQuizCommand
                : handleTerminalCommand
            }
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
