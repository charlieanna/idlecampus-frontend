import { useState, useEffect } from 'react';
import { Shield, GripVertical } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { Terminal } from '../../components/course/Terminal';
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

interface SecurityAppProps {
  courseModules?: Module[];
}

export default function SecurityApp({ courseModules = [] }: SecurityAppProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [terminalCommands, setTerminalCommands] = useState<string[]>([]);

  // Select first module and first lesson on mount
  useEffect(() => {
    if (courseModules && courseModules.length > 0 && !selectedModule) {
      const firstModule = courseModules[0];
      setSelectedModule(firstModule);

      // Select first lesson
      if (firstModule.lessons && firstModule.lessons.length > 0) {
        setSelectedItemId(firstModule.lessons[0].id);
      } else if (firstModule.labs && firstModule.labs.length > 0) {
        setSelectedItemId(firstModule.labs[0].id);
      } else if (firstModule.quizzes && firstModule.quizzes.length > 0) {
        setSelectedItemId(firstModule.quizzes[0].id);
      }
    }
  }, [courseModules, selectedModule]);

  const handleModuleChange = (module: Module) => {
    setSelectedModule(module);

    // Auto-select first available item in the module
    if (module.lessons && module.lessons.length > 0) {
      setSelectedItemId(module.lessons[0].id);
    } else if (module.labs && module.labs.length > 0) {
      setSelectedItemId(module.labs[0].id);
    } else if (module.quizzes && module.quizzes.length > 0) {
      setSelectedItemId(module.quizzes[0].id);
    }
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleCommandCopy = (command: string) => {
    setTerminalCommands(prev => [...prev, command]);
  };

  // Find current selected item
  let selectedContent = null;
  let contentType: 'lesson' | 'lab' | 'quiz' | null = null;

  if (selectedModule && selectedItemId) {
    // Check lessons
    const lesson = selectedModule.lessons?.find(l => l.id === selectedItemId);
    if (lesson) {
      selectedContent = lesson;
      contentType = 'lesson';
    }

    // Check labs
    const lab = selectedModule.labs?.find(l => l.id === selectedItemId);
    if (lab) {
      selectedContent = lab;
      contentType = 'lab';
    }

    // Check quizzes
    const quiz = selectedModule.quizzes?.find(q => q.id === selectedItemId);
    if (quiz) {
      selectedContent = quiz;
      contentType = 'quiz';
    }
  }

  // Use common gating hook
  const { canAccessLesson, getLessonAccessInfo } = useLessonGating(completedLessons, courseModules);

  // Get accessibility info for current lesson
  const { isAccessible: isCurrentLessonAccessible, previousLessonTitle } = selectedContent
    ? getLessonAccessInfo(selectedItemId)
    : { isAccessible: true, previousLessonTitle: undefined };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Security Fundamentals</h1>
            <p className="text-red-100 text-sm">Master TLS, SSH, secrets management & security best practices</p>
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
              onSelectLesson={handleItemSelect}
              completedLessons={completedLessons}
              completedCommands={new Set()}
              courseTitle="Security Fundamentals"
              courseSubtitle="Master TLS, SSH, secrets management & security best practices"
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
                    <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Select a lesson, lab, or quiz to begin</p>
                  </div>
                </div>
              )}

              {contentType === 'lesson' && selectedContent && (
                <LessonViewer
                  lesson={selectedContent}
                  onCommandCopy={handleCommandCopy}
                  isCompleted={completedLessons.has(selectedItemId)}
                  completedCommands={new Set()}
                  isAccessible={isCurrentLessonAccessible}
                  previousLessonTitle={previousLessonTitle}
                />
              )}

              {contentType === 'lab' && selectedContent && (
                <LabExercise
                  lab={selectedContent}
                  onCommandCopy={handleCommandCopy}
                />
              )}

              {contentType === 'quiz' && selectedContent && (
                <QuizViewer quiz={selectedContent} />
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right: Terminal */}
          <ResizablePanel defaultSize={30} minSize={20}>
            <Terminal
              commands={terminalCommands}
              terminalType="bash"
              promptText="user@security:~$"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
