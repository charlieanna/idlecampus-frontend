import { useState, useEffect, useMemo } from 'react';
import { Terminal as TerminalIcon, GripVertical } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { XTerminal } from '../../components/course/XTerminal';
import { CourseNavigation, Module } from '../../components/course/CourseNavigation';
import { LessonViewer } from '../../components/course/LessonViewer';
import { LabExercise } from '../../components/course/LabExercise';
import { QuizViewer } from '../../components/course/QuizViewer';
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

interface LinuxAppProps {
  courseModules?: Module[];
}

// localStorage keys for progress persistence
const LINUX_PROGRESS_KEY = 'linux-course-progress';

// Helper to load progress from localStorage
function loadProgress(): { completedLessons: Set<string>; completedCommands: Set<string> } {
  try {
    const saved = localStorage.getItem(LINUX_PROGRESS_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        completedLessons: new Set(data.completedLessons || []),
        completedCommands: new Set(data.completedCommands || [])
      };
    }
  } catch (e) {
    console.warn('Failed to load progress from localStorage:', e);
  }
  return { completedLessons: new Set(), completedCommands: new Set() };
}

export default function LinuxApp({ courseModules = [] }: LinuxAppProps) {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [terminalCommands, setTerminalCommands] = useState<string[]>([]);

  // Load progress from localStorage on mount
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => loadProgress().completedLessons);
  const [completedCommands, setCompletedCommands] = useState<Set<string>>(() => loadProgress().completedCommands);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LINUX_PROGRESS_KEY, JSON.stringify({
        completedLessons: Array.from(completedLessons),
        completedCommands: Array.from(completedCommands)
      }));
    } catch (e) {
      console.warn('Failed to save progress to localStorage:', e);
    }
  }, [completedLessons, completedCommands]);

  // Stable session ID for the terminal - only created once per component mount
  const terminalSessionId = useMemo(() => `linux-${Date.now()}`, []);

  // Select first module and first lesson on mount
  useEffect(() => {
    if (courseModules && courseModules.length > 0 && !selectedModule) {
      const firstModule = courseModules[0];
      setSelectedModule(firstModule.id);

      // Select first lesson
      if (firstModule.lessons && firstModule.lessons.length > 0) {
        setSelectedItemId(`${firstModule.id}-${firstModule.lessons[0].id}`);
      } else if (firstModule.labs && firstModule.labs.length > 0) {
        setSelectedItemId(`${firstModule.id}-${firstModule.labs[0].id}`);
      } else if (firstModule.quizzes && firstModule.quizzes.length > 0) {
        setSelectedItemId(`${firstModule.id}-${firstModule.quizzes[0].id}`);
      }
    }
  }, [courseModules, selectedModule]);

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    setSelectedModule(moduleId);
    // Combine moduleId and lessonId to match the format used in matching logic
    setSelectedItemId(`${moduleId}-${lessonId}`);
  };

  const handleCommandComplete = (commandId: string) => {
    setCompletedCommands(prev => {
      const newCompleted = new Set(prev).add(commandId);

      // Check if all commands in current lesson are now complete
      const lesson = currentModule?.lessons?.find(l => `${currentModule.id}-${l.id}` === selectedItemId);
      if (lesson?.items) {
        const commandItems = lesson.items.filter((item: any) => item.type === 'command');
        const totalCommands = commandItems.length;

        // Count completed commands for this lesson
        let completedCount = 0;
        for (let i = 0; i < totalCommands; i++) {
          const key = `${selectedItemId}-${i}`;
          if (newCompleted.has(key)) {
            completedCount++;
          }
        }

        console.log(`📊 Command progress: ${completedCount}/${totalCommands} for lesson ${selectedItemId}`);

        // If all commands complete, mark lesson as complete
        if (completedCount === totalCommands && totalCommands > 0) {
          console.log('🎉 All commands complete! Marking lesson as done:', selectedItemId);
          setCompletedLessons(prevLessons => new Set(prevLessons).add(selectedItemId));
        }
      }

      return newCompleted;
    });
  };

  const handleCommandCopy = (command: string) => {
    console.log('🖥️ Command copied:', command);
    setTerminalCommands(prev => {
      const newCommands = [...prev, command];
      console.log('📝 Terminal commands updated:', newCommands);
      return newCommands;
    });
  };

  // Check if command matches expected and mark complete
  const handleTerminalCommand = (typedCommand: string): string | null => {
    // Get the current lesson and its items
    const lesson = currentModule?.lessons?.find(l => `${currentModule.id}-${l.id}` === selectedItemId);
    if (!lesson || !lesson.items) {
      console.log('⚠️ No lesson or items found for command check');
      return null;
    }

    // Use selectedItemId as the lesson ID (same as LessonViewer uses)
    const lessonIdForKey = selectedItemId;

    // Find current command index
    let commandIndex = 0;
    for (const item of lesson.items) {
      if (item.type === 'command') {
        // Use selectedItemId to match LessonViewer's key format
        const commandKey = `${lessonIdForKey}-${commandIndex}`;
        if (!completedCommands.has(commandKey)) {
          // This is the current expected command
          const expectedCmd = item.command.command;

          console.log('🔍 Checking command:', { typed: typedCommand.trim(), expected: expectedCmd.trim(), commandKey });

          // Check if typed command matches expected
          if (typedCommand.trim() === expectedCmd.trim()) {
            // Success! Mark as complete
            console.log('✅ Command matched:', expectedCmd, commandKey);
            handleCommandComplete(commandKey);
          }

          // Always return null - let terminal execute and show output
          return null;
        }
        commandIndex++;
      }
    }

    // No expected command or all completed - just execute normally
    return null;
  };

  // Find current selected item
  let selectedContent = null;
  let contentType: 'lesson' | 'lab' | 'quiz' | null = null;
  const currentModule = courseModules.find(m => m.id === selectedModule);

  if (currentModule && selectedItemId) {
    // Check lessons
    const lesson = currentModule.lessons?.find(l => `${currentModule.id}-${l.id}` === selectedItemId);
    if (lesson) {
      console.log('🎯 [V2] LinuxApp found lesson:', {
        id: lesson.id,
        title: lesson.title,
        hasItems: !!lesson.items,
        itemsLength: lesson.items?.length,
        hasCommands: !!lesson.commands,
        commandsLength: lesson.commands?.length,
        itemTypes: lesson.items?.map((i: any) => i.type)
      });
      // Ensure the lesson has the correct ID format for the LessonViewer component
      selectedContent = { ...lesson, id: selectedItemId };
      contentType = 'lesson';
    }

    // Check labs
    const lab = currentModule.labs?.find(l => `${currentModule.id}-${l.id}` === selectedItemId);
    if (lab) {
      selectedContent = lab;
      contentType = 'lab';
    }

    // Check quizzes
    const quiz = currentModule.quizzes?.find(q => `${currentModule.id}-${q.id}` === selectedItemId);
    if (quiz) {
      selectedContent = quiz;
      contentType = 'quiz';
    }
  }

  // Get expected command for terminal validation
  let expectedCommand: string | null = null;
  if (contentType === 'lesson' && selectedContent && 'items' in selectedContent) {
    const lesson = selectedContent;
    let commandIndex = 0;
    for (const item of lesson.items) {
      if (item.type === 'command') {
        // Use lesson.id to match LessonViewer's key format
        const commandKey = `${lesson.id}-${commandIndex}`;
        if (!completedCommands.has(commandKey)) {
          expectedCommand = item.command.command;
          break;
        }
        commandIndex++;
      }
    }
  }

  // Use common gating hook
  const { canAccessLesson, getLessonAccessInfo } = useLessonGating(completedLessons, courseModules);

  // Get accessibility info for current lesson
  const { isAccessible: isCurrentLessonAccessible, previousLessonTitle } = selectedContent
    ? getLessonAccessInfo(selectedItemId)
    : { isAccessible: true, previousLessonTitle: undefined };

  // Find next lesson for navigation
  const getNextLesson = (): { moduleId: string; lessonId: string; title: string } | null => {
    if (!currentModule || !selectedItemId) return null;

    // Build flat list of all lessons across all modules
    const allLessons: { moduleId: string; lessonId: string; fullId: string; title: string }[] = [];
    for (const module of courseModules) {
      for (const lesson of module.lessons || []) {
        allLessons.push({
          moduleId: module.id,
          lessonId: lesson.id,
          fullId: `${module.id}-${lesson.id}`,
          title: lesson.title
        });
      }
    }

    // Find current lesson index
    const currentIndex = allLessons.findIndex(l => l.fullId === selectedItemId);
    if (currentIndex === -1 || currentIndex >= allLessons.length - 1) return null;

    // Return next lesson
    return allLessons[currentIndex + 1];
  };

  const nextLesson = getNextLesson();

  const handleNextLesson = () => {
    if (nextLesson) {
      handleSelectLesson(nextLesson.moduleId, nextLesson.lessonId);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <TerminalIcon className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Linux Fundamentals</h1>
            <p className="text-orange-100 text-sm">Master essential Linux skills for DevOps</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left: Navigation */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <CourseNavigation
              modules={courseModules}
              selectedModule={selectedModule}
              selectedLesson={selectedItemId}
              onSelectLesson={handleSelectLesson}
              completedLessons={completedLessons}
              completedCommands={completedCommands}
              courseTitle="Linux Fundamentals"
              courseSubtitle="Master essential Linux skills"
              canAccessLesson={canAccessLesson}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Middle: Content */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full overflow-auto bg-white">
              {!selectedContent && (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <TerminalIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Select a lesson, lab, or quiz to begin</p>
                  </div>
                </div>
              )}

              {contentType === 'lesson' && selectedContent && (
                <>
                  {console.log('📚 Rendering lesson:', selectedContent.title, 'Commands:', selectedContent.commands?.length || 0)}
                  <LessonViewer
                    lesson={selectedContent}
                    isCompleted={completedLessons.has(selectedItemId)}
                    completedCommands={completedCommands}
                    onCommandCopy={handleCommandCopy}
                    onCommandComplete={handleCommandComplete}
                    isAccessible={isCurrentLessonAccessible}
                    previousLessonTitle={previousLessonTitle}
                    showInlineExercises={false}
                    onNextLesson={nextLesson ? handleNextLesson : undefined}
                    nextLessonTitle={nextLesson?.title}
                  />
                </>
              )}

              {contentType === 'lab' && selectedContent && (
                <LabExercise
                  lab={selectedContent}
                  onComplete={() => {
                    setCompletedLessons(prev => new Set(prev).add(selectedItemId));
                  }}
                />
              )}

              {contentType === 'quiz' && selectedContent && (
                <QuizViewer
                  quiz={selectedContent}
                  onComplete={() => {
                    setCompletedLessons(prev => new Set(prev).add(selectedItemId));
                  }}
                />
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right: Terminal */}
          <ResizablePanel defaultSize={30} minSize={20}>
            {console.log('🔧 Terminal expected command:', expectedCommand)}
            <XTerminal
              onCommand={handleTerminalCommand}
              expectedCommand={expectedCommand}
              sessionId={terminalSessionId}
              containerImage="ubuntu:22.04"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
