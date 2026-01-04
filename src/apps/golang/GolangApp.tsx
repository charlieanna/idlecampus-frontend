import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Sparkles,
  FlaskConical,
  BookOpen,
  ClipboardList,
  ChevronRight,
  Clock3,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Command as CommandIcon
} from 'lucide-react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card } from '../../components/ui/card';
import { CommandCard } from '../../components/course/CommandCard';
import { CodeEditor } from '../../components/course/CodeEditor';
import { apiService, type Module, type ModuleItem } from '../../services/api';
import type { CodeLab } from '../../types/codeLab';

type ItemSelection = {
  moduleSlug: string;
  itemId: number;
  itemType: ModuleItem['item_type'];
};

interface InteractiveQuizOption {
  text: string;
  correct?: boolean;
}

interface NormalizedQuiz {
  question: string;
  options: InteractiveQuizOption[];
  correctIndex: number;
  explanation?: string;
}

const difficultyStyles: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  hard: 'bg-red-100 text-red-700 border-red-200'
};

const itemTypeConfig: Record<ModuleItem['item_type'], { label: string; icon: JSX.Element; badgeClass: string }> = {
  CourseLesson: {
    label: 'Lesson',
    icon: <BookOpen className="w-4 h-4" />,
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  Quiz: {
    label: 'Quiz',
    icon: <ClipboardList className="w-4 h-4" />,
    badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  HandsOnLab: {
    label: 'Hands-on Lab',
    icon: <FlaskConical className="w-4 h-4" />,
    badgeClass: 'bg-green-100 text-green-700 border-green-200'
  },
  InteractiveLearningUnit: {
    label: 'Interactive Unit',
    icon: <Sparkles className="w-4 h-4" />,
    badgeClass: 'bg-purple-100 text-purple-700 border-purple-200'
  }
};

const formatMinutes = (minutes?: number) => {
  if (!minutes || minutes <= 0) return 'Self-paced';
  return `${minutes} min`;
};

const normalizeStringArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch (err) {
      // ignore parse failure, fall back to splitting
    }
    return value
      .split(/\r?\n|,|;/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizeSteps = (value: any): Array<Record<string, any>> => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed as Array<Record<string, any>>;
      }
    } catch (err) {
      return [];
    }
  }
  return [];
};

const normalizeQuiz = (quiz: ModuleItem['quiz']): NormalizedQuiz | null => {
  if (!quiz || !quiz.question) return null;

  const options = (quiz.options || []).map((opt: any) => {
    if (typeof opt === 'string') {
      return { text: opt, correct: opt === quiz.correct_answer };
    }
    return {
      text: opt?.text ?? '',
      correct: typeof opt?.correct === 'boolean' ? opt.correct : opt?.text === quiz.correct_answer
    };
  }) as InteractiveQuizOption[];

  const correctIndex = options.findIndex((opt) => opt.correct);

  return {
    question: quiz.question,
    options,
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
    explanation: quiz.explanation
  };
};

const renderMarkdown = (markdown: string) => {
  const lines = markdown.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;
  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let elementKey = 0;

  const flushList = () => {
    if (listBuffer && listBuffer.items.length > 0) {
      if (listBuffer.type === 'ul') {
        elements.push(
          <ul key={`list-${elementKey++}`} className="list-disc list-inside space-y-1 ml-6">
            {listBuffer.items.map((item, idx) => (
              <li key={idx} className="text-slate-700">{item}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`list-${elementKey++}`} className="list-decimal list-inside space-y-1 ml-6">
            {listBuffer.items.map((item, idx) => (
              <li key={idx} className="text-slate-700">{item}</li>
            ))}
          </ol>
        );
      }
    }
    listBuffer = null;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      flushList();
      elements.push(
        <pre key={`code-${elementKey++}`} className="bg-slate-900 text-green-300 text-sm rounded-md p-4 overflow-x-auto">
          <code className={language ? `language-${language}` : ''}>{codeLines.join('\n')}</code>
        </pre>
      );
      i++; // skip closing ```
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!listBuffer || listBuffer.type !== 'ul') {
        flushList();
        listBuffer = { type: 'ul', items: [] };
      }
      listBuffer.items.push(line.slice(2));
      i++;
      continue;
    }

    const orderedMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      if (!listBuffer || listBuffer.type !== 'ol') {
        flushList();
        listBuffer = { type: 'ol', items: [] };
      }
      listBuffer.items.push(orderedMatch[2]);
      i++;
      continue;
    }

    flushList();

    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`quote-${elementKey++}`} className="border-l-4 border-purple-300 bg-purple-50 text-purple-800 px-4 py-2 italic">
          {line.slice(2)}
        </blockquote>
      );
      i++;
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={`h1-${elementKey++}`} className="text-3xl font-bold text-slate-900 mt-6 mb-4">{line.slice(2)}</h1>);
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(<h2 key={`h2-${elementKey++}`} className="text-2xl font-semibold text-slate-900 mt-5 mb-3">{line.slice(3)}</h2>);
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(<h3 key={`h3-${elementKey++}`} className="text-xl font-semibold text-slate-900 mt-4 mb-2">{line.slice(4)}</h3>);
      i++;
      continue;
    }

    if (line.trim().length === 0) {
      elements.push(<div key={`spacer-${elementKey++}`} className="h-3" />);
      i++;
      continue;
    }

    const inlineParts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={idx} className="bg-slate-200 text-slate-900 px-1 py-0.5 rounded text-sm">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });

    elements.push(
      <p key={`p-${elementKey++}`} className="text-slate-700 leading-relaxed">
        {inlineParts}
      </p>
    );

    i++;
  }

  flushList();
  return elements;
};

function InteractiveQuiz({ quiz }: { quiz: NormalizedQuiz }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!quiz.options.length) return null;

  const isCorrect = submitted && selected === quiz.correctIndex;

  return (
    <Card className="mt-8 border-purple-200 bg-purple-50">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h3 className="text-purple-700 font-semibold text-sm uppercase tracking-wide">Knowledge Check</h3>
        </div>
        <h4 className="text-lg font-semibold text-slate-900 mb-4">{quiz.question}</h4>
        <div className="space-y-2">
          {quiz.options.map((option, index) => {
            const isSelected = selected === index;
            const isOptionCorrect = index === quiz.correctIndex;
            const showCorrect = submitted && isOptionCorrect;

            return (
              <Button
                key={index}
                variant={isSelected ? 'secondary' : 'outline'}
                className={`w-full justify-start text-left py-3 ${showCorrect ? 'border-green-500 bg-green-50 text-green-700' : ''}`}
                onClick={() => !submitted && setSelected(index)}
                disabled={submitted}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 text-slate-500'}`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="flex-1 text-sm">{option.text}</span>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={() => {
              if (selected === null) return;
              setSubmitted(true);
            }}
            disabled={submitted || selected === null}
          >
            Submit Answer
          </Button>
          {submitted && (
            <div className={`flex items-center gap-2 text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCorrect ? 'Correct! Great job.' : 'Not quite. Review the lesson and try again.'}</span>
            </div>
          )}
        </div>

        {submitted && quiz.explanation && (
          <div className="mt-4 rounded-md border border-purple-200 bg-purple-100/70 p-3 text-sm text-purple-800">
            <strong className="block mb-1">Explanation:</strong>
            <span>{quiz.explanation}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function InteractiveUnitView({ unit }: { unit: ModuleItem }) {
  const quiz = useMemo(() => normalizeQuiz(unit.quiz), [unit.quiz]);
  const hints = normalizeStringArray(unit.practice_hints);

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="border-b bg-purple-600 text-white px-6 py-5">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6" />
          <div>
            <h1 className="text-2xl font-bold">{unit.title}</h1>
            <p className="text-purple-100 text-sm">Interactive learning unit</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {unit.difficulty && (
            <Badge className={difficultyStyles[unit.difficulty] || 'bg-purple-100 text-purple-700 border-purple-200'}>
              {unit.difficulty} difficulty
            </Badge>
          )}
          <Badge variant="outline" className="border-purple-200 text-purple-50">
            <Clock3 className="w-3 h-3 mr-1" />
            {formatMinutes(unit.estimated_minutes)}
          </Badge>
          {unit.concept_tags && unit.concept_tags.length > 0 && (
            <Badge variant="outline" className="border-purple-200 text-purple-50">
              {unit.concept_tags.join(', ')}
            </Badge>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-6 space-y-6">
          {unit.command_to_learn && (
            <Card className="border-blue-200 bg-blue-50">
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-blue-700">
                  <CommandIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Command to Practice</span>
                </div>
                <CommandCard
                  command={{
                    command: unit.command_to_learn,
                    description: 'Memorize this command and understand each flag.',
                    example: unit.command_to_learn
                  }}
                  state="current"
                />
              </div>
            </Card>
          )}

          {unit.content && (
            <Card className="p-6">
              <div className="prose max-w-none">
                {renderMarkdown(unit.content)}
              </div>
            </Card>
          )}

          {hints.length > 0 && (
            <Card className="p-5 border-amber-200 bg-amber-50">
              <div className="flex items-center gap-2 mb-3 text-amber-700">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm font-semibold uppercase tracking-wide">Practice Hints</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-amber-800 text-sm">
                {hints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            </Card>
          )}

          {quiz && <InteractiveQuiz quiz={quiz} />}
        </div>
      </ScrollArea>
    </div>
  );
}

function LabViewer({ lab }: { lab: ModuleItem }) {
  // Access lab data from nested content property
  const labContent = lab.content || lab;
  const objectives = normalizeStringArray(labContent.learning_objectives);
  const steps = normalizeSteps(labContent.steps);
  const visibleTestCases = (Array.isArray(labContent.test_cases) ? labContent.test_cases : []).filter((tc) => !tc?.hidden);
  const hints = Array.isArray(labContent.hints) ? labContent.hints : normalizeStringArray(labContent.hints);

  // Check if this is an interactive code editor lab
  const isCodeEditorLab = labContent.lab_format === 'code_editor' || labContent.programming_language === 'golang';

  // If it's a code editor lab, use the CodeEditor component
  if (isCodeEditorLab) {
    // Transform lab data to CodeLab format
    const codeLab: CodeLab = {
      id: labContent.id || lab.id,
      title: labContent.title || 'Lab',
      description: labContent.description || '',
      difficulty: labContent.difficulty || 'medium',
      programming_language: labContent.programming_language || 'go',
      lab_format: 'code_editor',
      estimated_minutes: labContent.estimated_minutes || 30,
      starter_code: labContent.starter_code || '',
      test_cases: labContent.test_cases || [],
      allowed_imports: labContent.allowed_imports || ['fmt'],
      objectives: objectives,
      points_reward: labContent.points_reward || 100,
      max_attempts: labContent.max_attempts || 3,
      time_limit_seconds: labContent.time_limit_seconds || 60,
      memory_limit_mb: labContent.memory_limit_mb || 128,
      has_solution: false,
      has_hints: hints.length > 0
    };

    return <CodeEditor lab={codeLab} onComplete={() => console.log('Lab completed!')} />;
  }

  // Otherwise, show the traditional step-by-step lab view
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="border-b bg-green-600 text-white px-6 py-5">
        <div className="flex items-center gap-3 mb-2">
          <FlaskConical className="w-6 h-6" />
          <div>
            <h1 className="text-2xl font-bold">{labContent.title}</h1>
            <p className="text-green-100 text-sm">Capstone Lab · Apply everything you learned</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {labContent.difficulty && (
            <Badge className={difficultyStyles[labContent.difficulty] || 'bg-green-100 text-green-700 border-green-200'}>
              {labContent.difficulty} difficulty
            </Badge>
          )}
          <Badge variant="outline" className="border-green-200 text-green-50">
            <Clock3 className="w-3 h-3 mr-1" />
            {formatMinutes(labContent.estimated_minutes)}
          </Badge>
          {typeof labContent.points_reward === 'number' && (
            <Badge variant="outline" className="border-green-200 text-green-50">
              {labContent.points_reward} pts
            </Badge>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="p-6 space-y-6">
          {labContent.description && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Scenario</h2>
              <p className="text-slate-700 leading-relaxed">{labContent.description}</p>
            </Card>
          )}

          {objectives.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Learning Objectives</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {objectives.map((objective, idx) => (
                  <li key={idx}>{objective}</li>
                ))}
              </ul>
            </Card>
          )}

          {steps.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Lab Steps</h2>
              <ol className="space-y-4">
                {steps.map((step: Record<string, any>, idx: number) => (
                  <li key={idx} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2 text-sm font-semibold text-slate-800">
                      <Badge variant="outline" className="border-slate-300 text-slate-600">
                        Step {idx + 1}
                      </Badge>
                      <span>{step.title || `Task ${idx + 1}`}</span>
                    </div>
                    {step.instruction && (
                      <p className="text-slate-700 mb-3">{step.instruction}</p>
                    )}
                    {step.command && (
                      <div className="bg-slate-900 text-green-300 rounded-md p-3 font-mono text-sm flex items-center justify-between gap-3">
                        <code className="flex-1">{step.command}</code>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-200"
                          onClick={() => navigator.clipboard.writeText(step.command)}
                        >
                          Copy
                        </Button>
                      </div>
                    )}
                    {step.hint && (
                      <div className="mt-3 flex items-start gap-2 text-amber-700 text-sm bg-amber-50 border border-amber-200 rounded-md p-2">
                        <Lightbulb className="w-4 h-4 mt-0.5" />
                        <span>{step.hint}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </Card>
          )}

          {labContent.starter_code && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Starter Code</h2>
              <pre className="bg-slate-900 text-green-300 text-sm rounded-md p-4 overflow-x-auto">
                <code>{labContent.starter_code}</code>
              </pre>
            </Card>
          )}

          {visibleTestCases.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Sample Test Cases</h2>
              <div className="space-y-3">
                {visibleTestCases.map((test: any, idx: number) => (
                  <div key={idx} className="border border-slate-200 rounded-md p-3">
                    <div className="flex items-center justify-between mb-2 text-sm text-slate-600">
                      <span>Test {idx + 1}</span>
                      {test.description && <span>{test.description}</span>}
                    </div>
                    {test.input && (
                      <div className="mb-2 text-xs text-slate-500">
                        <span className="font-semibold">Input:</span> {test.input}
                      </div>
                    )}
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold">Expected Output:</span> {test.expected_output}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {hints.length > 0 && (
            <Card className="p-6 border-amber-200 bg-amber-50">
              <h2 className="text-lg font-semibold text-amber-800 mb-3">Hints</h2>
              <ul className="list-disc list-inside space-y-1 text-amber-800 text-sm">
                {hints.map((hint: any, idx: number) => (
                  <li key={idx}>{typeof hint === 'string' ? hint : JSON.stringify(hint)}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function GolangApp() {
  const courseSlug = 'golang-fundamentals';

  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleSlug, setSelectedModuleSlug] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ItemSelection | null>(null);
  const [currentUnit, setCurrentUnit] = useState<ModuleItem | null>(null);
  const [currentLab, setCurrentLab] = useState<ModuleItem | null>(null);
  const [currentLesson, setCurrentLesson] = useState<ModuleItem | null>(null);

  const moduleCache = useRef<Record<string, Module>>({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const rawModules = await apiService.fetchModules(courseSlug, 'golang').catch(() => []);
        
        if (rawModules.length === 0) {
          const codeLabs = await apiService.fetchCodeLabs({ language: 'go' }).catch(() => ({ challenges: [] }));
          if (codeLabs.challenges && codeLabs.challenges.length > 0) {
            const mockModule: Module = {
              id: 1,
              slug: 'basics',
              title: 'Basics',
              description: 'Go Language Fundamentals',
              sequence_order: 1,
              estimated_minutes: 60,
              items: codeLabs.challenges.map((c: any, index: number) => ({
                id: c.id,
                module_item_id: index,
                sequence_order: index,
                item_type: 'HandsOnLab',
                title: c.title,
                description: c.description,
                content: c.starter_code,
                difficulty: c.difficulty
              }))
            };
            setModules([mockModule]);
            return;
          }
        }

        const normalized = (rawModules || []).map((mod: any) => ({
          ...mod,
          items: (mod.items || []).sort((a: ModuleItem, b: ModuleItem) => (a.sequence_order ?? 0) - (b.sequence_order ?? 0))
        })).sort((a: Module, b: Module) => (a.sequence_order ?? 0) - (b.sequence_order ?? 0));

        setModules(normalized);
        console.log('📦 Loaded modules:', normalized.length, normalized);

        if (normalized.length > 0) {
          const firstModule = normalized[0];
          setSelectedModuleSlug(firstModule.slug);

          // Load the first module's details to populate items
          const firstModuleDetail = await ensureModuleDetail(firstModule.slug);
          console.log('📦 First module details:', firstModuleDetail);

          if (firstModuleDetail.items && firstModuleDetail.items.length > 0) {
            await handleSelectItem(firstModule.slug, firstModuleDetail.items[0]);
          }
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load Go course.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const ensureModuleDetail = async (moduleSlug: string): Promise<Module> => {
    if (moduleCache.current[moduleSlug]) {
      return moduleCache.current[moduleSlug];
    }

    const detail = await apiService.fetchModule(courseSlug, moduleSlug, 'golang');
    const sortedDetail: Module = {
      ...detail,
      items: (detail.items || []).sort((a: ModuleItem, b: ModuleItem) => (a.sequence_order ?? 0) - (b.sequence_order ?? 0))
    };

    moduleCache.current[moduleSlug] = sortedDetail;
    setModules((prev) => prev.map((mod) => (mod.slug === moduleSlug ? { ...mod, items: sortedDetail.items } : mod)));
    return sortedDetail;
  };

  const handleSelectItem = async (moduleSlug: string, item: ModuleItem) => {
    const itemType = item.type || item.item_type;
    setSelectedModuleSlug(moduleSlug);
    setSelectedItem({ moduleSlug, itemId: item.id, itemType });
    setLoadingContent(true);

    try {
      const moduleDetail = await ensureModuleDetail(moduleSlug);
      const detailedItem = (moduleDetail.items || []).find((it) => it.id === item.id);

      if (!detailedItem) {
        throw new Error('Item not found in module');
      }

      const detailedItemType = detailedItem.type || detailedItem.item_type;
      if (detailedItemType === 'InteractiveLearningUnit') {
        setCurrentUnit(detailedItem);
        setCurrentLab(null);
        setCurrentLesson(null);
      } else if (detailedItemType === 'HandsOnLab') {
        setCurrentLab(detailedItem);
        setCurrentUnit(null);
        setCurrentLesson(null);
      } else if (detailedItemType === 'CourseLesson') {
        console.log('📚 CourseLesson detailedItem:', detailedItem);
        console.log('📚 Content structure:', detailedItem.content);
        setCurrentLesson(detailedItem);
        setCurrentLab(null);
        setCurrentUnit(null);
      } else {
        setCurrentUnit(null);
        setCurrentLab(null);
        setCurrentLesson(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load item content.');
    } finally {
      setLoadingContent(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Go course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Card className="p-6 max-w-lg space-y-4">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Unable to load Go course</h2>
          </div>
          <p className="text-slate-700">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-slate-50">
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-5 border-b bg-cyan-600 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-7 h-7" />
            <div>
              <h1 className="text-xl font-bold">Go Concurrency Journey</h1>
              <p className="text-cyan-100 text-xs">Interactive lessons with a capstone lab</p>
            </div>
          </div>
          <p className="text-sm text-cyan-50">Navigate modules from fundamentals to the capstone project.</p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {modules.map((mod) => (
              <div key={mod.id} className="space-y-2">
                <button
                  className="flex items-center gap-2 w-full text-left hover:bg-slate-50 p-2 rounded-md transition-colors"
                  onClick={async () => {
                    console.log('🔵 Module clicked:', mod.title);
                    await ensureModuleDetail(mod.slug);
                  }}
                >
                  <Badge variant="outline" className="border-cyan-200 text-cyan-700 text-xs">Module</Badge>
                  <h3 className="text-slate-900 text-sm font-semibold">{mod.title}</h3>
                  {mod.items && mod.items.length > 0 && (
                    <ChevronRight className="w-4 h-4 ml-auto text-slate-400" />
                  )}
                </button>
                <div className="ml-2 space-y-1">
                  {(mod.items || []).map((item) => {
                    const itemType = item.type || item.item_type;
                    const config = itemTypeConfig[itemType];
                    if (!config) {
                      console.warn('Unknown item type:', itemType, item);
                      return null;
                    }
                    const isSelected = selectedItem?.moduleSlug === mod.slug && selectedItem?.itemId === item.id;
                    return (
                      <Button
                        key={`${itemType}-${item.id}`}
                        variant={isSelected ? 'secondary' : 'ghost'}
                        className="w-full justify-start h-auto py-2 px-2 text-sm"
                        onClick={() => {
                          console.log('🔵 Button clicked:', item.title);
                          handleSelectItem(mod.slug, item);
                        }}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-9 h-9 rounded-md border flex items-center justify-center ${
                            isSelected ? 'border-cyan-500 bg-cyan-100 text-cyan-700' : 'border-slate-200 text-slate-500'
                          }`}>
                            {config.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800 truncate">{item.content?.title || item.title || config.label}</span>
                              <Badge variant="outline" className={`${config.badgeClass} text-[10px]`}>{config.label}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                              <Clock3 className="w-3 h-3" />
                              <span>{formatMinutes(item.content?.estimated_minutes || item.estimated_minutes)}</span>
                              <ChevronRight className="w-3 h-3" />
                              <span className="truncate">{item.content?.description || item.description || ''}</span>
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 bg-slate-100 relative">
        {loadingContent && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600 mx-auto mb-3"></div>
              <p className="text-slate-600 text-sm">Loading content...</p>
            </div>
          </div>
        )}

        {!loadingContent && currentUnit && <InteractiveUnitView unit={currentUnit} />}
        {!loadingContent && !currentUnit && currentLab && <LabViewer lab={currentLab} />}
        {!loadingContent && !currentUnit && !currentLab && currentLesson && (
          <ScrollArea className="h-full">
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                  {currentLesson.content?.title || 'Lesson'}
                </h1>
                {currentLesson.content?.reading_time_minutes && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock3 className="w-4 h-4" />
                    <span>{currentLesson.content.reading_time_minutes} min read</span>
                  </div>
                )}
              </div>

              <div className="prose prose-slate max-w-none text-slate-700">
                {currentLesson.content?.content && (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {currentLesson.content.content.split('\n').map((line, i) => {
                      // Headers
                      if (line.startsWith('### ')) {
                        return <h3 key={i} className="text-xl font-semibold text-slate-900 mt-5 mb-2">{line.substring(4)}</h3>;
                      }
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-2xl font-semibold text-slate-900 mt-6 mb-3">{line.substring(3)}</h2>;
                      }
                      if (line.startsWith('# ')) {
                        return <h1 key={i} className="text-3xl font-bold text-slate-900 mt-8 mb-4">{line.substring(2)}</h1>;
                      }

                      // Code blocks
                      if (line.startsWith('```')) {
                        return null; // Handle in a proper code block parser
                      }

                      // Lists
                      if (line.match(/^[\*\-]\s/)) {
                        return (
                          <li key={i} className="ml-6 mb-1">
                            {line.substring(2)}
                          </li>
                        );
                      }

                      // Empty lines
                      if (!line.trim()) {
                        return <div key={i} className="h-4" />;
                      }

                      // Regular paragraphs with inline formatting
                      const renderInlineFormatting = (text: string) => {
                        // Bold
                        const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
                        return parts.map((part, idx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={idx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
                          }
                          if (part.startsWith('`') && part.endsWith('`')) {
                            return <code key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
                          }
                          return <span key={idx}>{part}</span>;
                        });
                      };

                      return <p key={i} className="mb-3 leading-relaxed">{renderInlineFormatting(line)}</p>;
                    })}
                  </div>
                )}
              </div>

              {currentLesson.content?.key_concepts && normalizeStringArray(currentLesson.content.key_concepts).length > 0 && (
                <Card className="mt-8 p-6 bg-cyan-50 border-cyan-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-cyan-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Key Concepts</h3>
                  </div>
                  <ul className="space-y-2">
                    {normalizeStringArray(currentLesson.content.key_concepts).map((concept, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-cyan-600 mt-1 flex-shrink-0" />
                        <span>{concept}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          </ScrollArea>
        )}
        {!loadingContent && !currentUnit && !currentLab && !currentLesson && (
          <div className="h-full flex items-center justify-center text-slate-500">
            Select a module item to begin learning.
          </div>
        )}
      </div>
    </div>
  );
}
