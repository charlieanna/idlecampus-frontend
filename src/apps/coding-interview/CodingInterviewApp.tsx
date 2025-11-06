import { useEffect, useMemo, useState } from 'react';
import { GripVertical, BookOpen, Code2, ClipboardList } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { LessonViewer } from '../../components/course/LessonViewer';
import { QuizViewer } from '../../components/course/QuizViewer';
import { CodeEditor } from '../../components/course/CodeEditor';
import type { CodeLab } from '../../types/codeLab';
import { apiService } from '../../services/api';

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

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

type ItemType = 'lesson' | 'quiz' | 'lab';

interface ModuleItemSummary {
  id: number;
  item_type: 'CourseLesson' | 'Quiz' | 'HandsOnLab';
  sequence_order: number;
  title: string;
  description?: string;
}

interface ModuleSummary {
  id: number;
  slug: string;
  title: string;
  description?: string;
  items: ModuleItemSummary[];
}

export default function CodingInterviewApp() {
  const courseSlug = 'coding-interview-mastery';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [selectedModuleSlug, setSelectedModuleSlug] = useState<string>('');
  const [selected, setSelected] = useState<{ type: ItemType; id: number } | null>(null);

  // Content state
  const [lessonContent, setLessonContent] = useState<{ title: string; content: string } | null>(null);
  const [quizData, setQuizData] = useState<{ id: string; title: string; description: string; questions: any[] } | null>(null);
  const [codeLab, setCodeLab] = useState<CodeLab | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiService.fetchModules(courseSlug, 'coding');

        // Expecting { modules: [...] }
        const mods = data as any[];
        const normalized: ModuleSummary[] = (Array.isArray((data as any).modules) ? (data as any).modules : mods).map((m: any) => ({
          id: m.id,
          slug: m.slug,
          title: m.title,
          description: m.description,
          items: (m.items || []).map((it: any) => ({
            id: it.id,
            item_type: it.item_type,
            sequence_order: it.sequence_order,
            title: it.title,
            description: it.description,
          }))
        }));

        if (normalized.length === 0) {
          setError('No modules were returned. Run the coding interview seed to populate content.');
          setModules([]);
          setSelected(null);
          return;
        }

        setModules(normalized);
        setSelectedModuleSlug(normalized[0].slug);
        const firstLesson = normalized[0].items.find(i => i.item_type === 'CourseLesson');
        if (firstLesson) {
          setSelected({ type: 'lesson', id: firstLesson.id });
          await loadLesson(normalized[0].slug, firstLesson.id);
        }
      } catch (e: any) {
        if (e?.status === 404) {
          setError(`Coding Interview course not found.

Run:
bundle exec rails runner "ActiveRecord::Base.transaction { load Rails.root.join('db','seeds','coding_interview_course.rb') }"

Then restart Rails and refresh this page.`);
        } else {
          setError(e?.message || 'Failed to load Coding Interview course.');
        }
        setModules([]);
        setSelected(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const loadLesson = async (moduleSlug: string, itemId: number) => {
    try {
      const res = await fetch(`/api/v1/coding/courses/${courseSlug}/modules/${moduleSlug}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Lesson not found. Ensure the coding interview seed has been run.');
        }
        throw new Error('Failed to load module');
      }
      const data = await res.json();
      const mod = data.module;
      const item = (mod.items || []).find((i: any) => i.id === itemId);
      if (item && item.item_type === 'CourseLesson') {
        setLessonContent({ title: item.title, content: item.content || '' });
        setQuizData(null);
        setCodeLab(null);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load lesson.');
      setLessonContent(null);
    }
  };

  const loadQuiz = async (moduleSlug: string, itemId: number) => {
    try {
      const res = await fetch(`/api/v1/coding/courses/${courseSlug}/modules/${moduleSlug}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Quiz not found. Run the coding interview seed to populate quizzes.');
        }
        throw new Error('Failed to load module');
      }
      const data = await res.json();
      const mod = data.module;
      const item = (mod.items || []).find((i: any) => i.id === itemId);
      if (item && item.item_type === 'Quiz') {
        // Map questions to QuizViewer format
        const questions = (item.questions || []).map((q: any, idx: number) => {
          if (q.question_type === 'mcq') {
            return {
              id: `q-${q.id}`,
              type: 'mcq' as const,
              question: q.question_text,
              options: q.options,
              correctAnswer: (q.options || []).indexOf(q.correct_answer),
              explanation: q.explanation || ''
            };
          }
          // Default to mcq if unknown
          return {
            id: `q-${q.id}`,
            type: 'mcq' as const,
            question: q.question_text || 'Question',
            options: q.options || [],
            correctAnswer: 0,
            explanation: q.explanation || ''
          };
        });

        setQuizData({ id: `quiz-${item.id}`, title: item.title, description: item.description || '', questions });
        setLessonContent(null);
        setCodeLab(null);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load quiz.');
      setQuizData(null);
    }
  };

  const loadLab = async (_moduleSlug: string, labId: number) => {
    try {
      const response = await apiService.fetchCodeLab(labId);
      setCodeLab(response.lab);
      setLessonContent(null);
      setQuizData(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load lab.');
      setCodeLab(null);
    }
  };

  const currentModule = useMemo(() => modules.find(m => m.slug === selectedModuleSlug), [modules, selectedModuleSlug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Coding Interview course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Card className="p-6 max-w-xl space-y-4">
          <div>
            <h2 className="text-red-600 text-xl mb-2">Unable to load Coding Interview course</h2>
            <p className="text-slate-700 whitespace-pre-line">{error}</p>
          </div>
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600">
              After running the seed, restart the Rails server and refresh this page to see the updated content.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Code2 className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Coding Interview Mastery</h1>
            <p className="text-purple-100 text-sm">Data Structures, Algorithms, and Interview Patterns</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left: Navigation */}
          <ResizablePanel defaultSize={22} minSize={16} maxSize={32}>
            <div className="h-full border-r bg-white flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-slate-900 text-base font-semibold">Course Modules</h2>
                <p className="text-slate-500 text-sm">Pick a lesson, quiz, or lab</p>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-4">
                  {modules.map((mod) => (
                    <div key={mod.id} className="">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200">Module</Badge>
                        <h3 className="text-slate-900 text-sm font-medium">{mod.title}</h3>
                      </div>
                      <div className="ml-2 space-y-1">
                        {mod.items
                          .filter(it => it.item_type === 'CourseLesson')
                          .map((it, idx) => (
                            <Button
                              key={it.id}
                              variant={selected?.type === 'lesson' && selected.id === it.id ? 'secondary' : 'ghost'}
                              className="w-full justify-start h-auto py-2 text-sm"
                              onClick={async () => {
                                setSelectedModuleSlug(mod.slug);
                                setSelected({ type: 'lesson', id: it.id });
                                await loadLesson(mod.slug, it.id);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-slate-600" />
                                <span className="text-slate-800">{idx + 1}. {it.title}</span>
                              </div>
                            </Button>
                          ))}

                        {mod.items
                          .filter(it => it.item_type === 'Quiz')
                          .map((it) => (
                            <Button
                              key={it.id}
                              variant={selected?.type === 'quiz' && selected.id === it.id ? 'secondary' : 'outline'}
                              className="w-full justify-start h-auto py-2 text-sm"
                              onClick={async () => {
                                setSelectedModuleSlug(mod.slug);
                                setSelected({ type: 'quiz', id: it.id });
                                await loadQuiz(mod.slug, it.id);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-indigo-600" />
                                <span className="text-slate-800">Quiz: {it.title}</span>
                              </div>
                            </Button>
                          ))}

                        {mod.items
                          .filter(it => it.item_type === 'HandsOnLab')
                          .map((it) => (
                            <Button
                              key={it.id}
                              variant={selected?.type === 'lab' && selected.id === it.id ? 'secondary' : 'ghost'}
                              className="w-full justify-start h-auto py-2 text-sm"
                              onClick={async () => {
                                setSelectedModuleSlug(mod.slug);
                                setSelected({ type: 'lab', id: it.id });
                                await loadLab(mod.slug, it.id);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-green-600" />
                                <span className="text-slate-800">Lab: {it.title}</span>
                              </div>
                            </Button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right: Content */}
          <ResizablePanel defaultSize={78} minSize={50}>
            <div className="h-full bg-white">
              {lessonContent && (
                <LessonViewer
                  lesson={{
                    id: 'lesson-1',
                    title: lessonContent.title,
                    items: [{ type: 'content', markdown: lessonContent.content }],
                  }}
                  isCompleted={false}
                  completedCommands={new Set()}
                  onGoToLab={() => {
                    const mod = currentModule;
                    if (!mod) return;
                    const lab = mod.items.find(i => i.item_type === 'HandsOnLab');
                    if (lab) {
                      setSelected({ type: 'lab', id: lab.id });
                      loadLab(mod.slug, lab.id);
                    }
                  }}
                />
              )}

              {quizData && (
                <QuizViewer
                  quiz={quizData}
                  onComplete={() => {}}
                  isCompleted={false}
                  onRegisterCommandHandler={() => {}}
                />
              )}

              {codeLab && (
                <CodeEditor lab={codeLab} onComplete={() => {}} />
              )}

              {!lessonContent && !quizData && !codeLab && (
                <div className="h-full flex items-center justify-center text-slate-500">
                  Select a lesson, quiz, or lab to begin
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
