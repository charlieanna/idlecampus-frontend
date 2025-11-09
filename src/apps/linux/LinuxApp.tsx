import { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, GripVertical } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { Terminal } from '../../components/course/Terminal';
import { CourseNavigation, Module } from '../../components/course/CourseNavigation';
import { LessonViewer } from '../../components/course/LessonViewer';
import { LabExercise } from '../../components/course/LabExercise';
import { QuizViewer } from '../../components/course/QuizViewer';

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

export default function LinuxApp({ courseModules = [] }: LinuxAppProps) {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [terminalCommands, setTerminalCommands] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [completedCommands, setCompletedCommands] = useState<Set<string>>(new Set());

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
    setSelectedItemId(lessonId);
  };

  const handleCommandComplete = (commandId: string) => {
    setCompletedCommands(prev => new Set(prev).add(commandId));
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
    if (!lesson || !lesson.items) return null;

    // Find current command index
    let commandIndex = 0;
    for (const item of lesson.items) {
      if (item.type === 'command') {
        // Use lesson.id (not selectedItemId) to match LessonViewer's key format
        const commandKey = `${lesson.id}-${commandIndex}`;
        if (!completedCommands.has(commandKey)) {
          // This is the current expected command
          const expectedCmd = item.command.command;

          // Check if typed command matches expected
          if (typedCommand.trim() === expectedCmd.trim()) {
            // Success! Mark as complete silently
            console.log('✅ Command matched:', expectedCmd);
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
      selectedContent = lesson;
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

  // Lesson gating: Check if a lesson can be accessed
  const canAccessLesson = (lessonId: string, allLessonsInOrder: Array<{ id: string; sequenceOrder: number }>): boolean => {
    // Sort lessons by sequence order
    const sortedLessons = [...allLessonsInOrder].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

    // Find current lesson index
    const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);

    // First lesson is always accessible
    if (currentIndex <= 0) {
      return true;
    }

    // Check if previous lesson is completed
    const previousLesson = sortedLessons[currentIndex - 1];
    return completedLessons.has(previousLesson.id);
  };

  // Get previous lesson title for lock message
  const getPreviousLessonTitle = (lessonId: string): string | undefined => {
    const currentModule = courseModules.find(m =>
      m.lessons.some(l => l.id === lessonId)
    );
    if (!currentModule) return undefined;

    const allLessons = currentModule.lessons.map((l, idx) => ({
      id: l.id,
      title: l.title,
      sequenceOrder: l.sequenceOrder ?? idx
    }));

    const sortedLessons = [...allLessons].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
    const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);

    if (currentIndex > 0) {
      return sortedLessons[currentIndex - 1].title;
    }

    return undefined;
  };

  // Check if current lesson is accessible
  const currentModule = courseModules.find(m =>
    m.lessons.some(l => l.id === selectedItemId)
  );
  const isCurrentLessonAccessible = currentModule && selectedContent
    ? canAccessLesson(
        selectedItemId,
        currentModule.lessons.map((l, idx) => ({
          id: l.id,
          sequenceOrder: l.sequenceOrder ?? idx
        }))
      )
    : true;

  // Get previous lesson title for lock message
  const previousLessonTitle = selectedContent ? getPreviousLessonTitle(selectedItemId) : undefined;

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
            <Terminal
              onCommand={handleTerminalCommand}
              expectedCommand={expectedCommand}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
