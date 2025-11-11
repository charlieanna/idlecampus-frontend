import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Lock, Terminal as TerminalIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { CommandCard, Command } from './CommandCard';
import { StealthReviewPrompt, ReviewContent, ReviewResult } from './StealthReviewPrompt';

// ============================================
// TYPES
// ============================================

type LessonItem =
  | { type: 'content'; markdown: string }
  | { type: 'command'; command: Command }
  | {
      type: 'review';
      reviews: ReviewContent[];
      strategy: string;
      insertionPoint: { position: string; percentage: number };
      priority: number;
    }
  | {
      type: 'exercise';
      exercise: {
        id: string;
        exercise_type: string;
        sequence_order: number;
        exercise_data: {
          question?: string;
          prompt?: string;
          options?: string[];
          correct_answer?: string;
          correct_answer_index?: number;
          explanation?: string;
          description?: string;
          hints?: string[];
          require_pass?: boolean;
          difficulty?: string;
          slug?: string;
          [key: string]: any;
        };
      };
    };

export interface Lesson {
  id: string;
  title: string;
  items: LessonItem[];
  content?: string;
  commands?: Command[];
}

// ============================================
// LESSON VIEWER COMPONENT
// ============================================

export interface LessonViewerProps {
  lesson: Lesson;
  isCompleted: boolean;
  completedCommands: Set<string>;
  onGoToLab?: () => void;
  progressiveMode?: boolean;
  moduleSlug?: string;
  onProgressiveItemsLoaded?: (items: LessonItem[]) => void;
  onCommandCopy?: (command: string) => void;
  onCommandComplete?: (commandId: string) => void;
  isAccessible?: boolean;
  previousLessonTitle?: string;
  moduleAccessible?: boolean;
  previousModuleTitle?: string;
}

export function LessonViewer({
  lesson,
  isCompleted,
  completedCommands,
  onGoToLab,
  progressiveMode = false,
  moduleSlug,
  onProgressiveItemsLoaded,
  onCommandCopy,
  onCommandComplete,
  isAccessible = true,
  previousLessonTitle,
  moduleAccessible = true,
  previousModuleTitle
}: LessonViewerProps) {
  const [progressiveItems, setProgressiveItems] = useState<LessonItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  const [exerciseAnswers, setExerciseAnswers] = useState<Map<string, number | string>>(new Map());
  const [exerciseSubmitted, setExerciseSubmitted] = useState<Set<string>>(new Set());
  const [exerciseShowResults, setExerciseShowResults] = useState<Set<string>>(new Set());

  // Refs for auto-scroll functionality
  const lastItemRef = useRef<HTMLDivElement>(null);
  const prevVisibleCountRef = useRef(0);

  // Fetch progressive module data if in progressive mode
  useEffect(() => {
    if (!progressiveMode || !moduleSlug) {
      setProgressiveItems(null);
      return;
    }

    const fetchProgressiveData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/v1/docker/courses/docker-fundamentals/modules/${moduleSlug}/progressive`
        );

        if (!response.ok) {
          throw new Error('Failed to load progressive module');
        }

        const data = await response.json();

        // Transform progressive API items to LessonItem format
        const transformedItems: LessonItem[] = data.module.items.map((item: any) => {
          if (item.type === 'content') {
            return {
              type: 'content' as const,
              markdown: item.markdown
            };
          } else {
            return {
              type: 'command' as const,
              command: {
                command: item.command,
                description: item.description,
                example: item.command
              }
            };
          }
        });

        setProgressiveItems(transformedItems);

        // Notify parent component that progressive items are loaded
        if (onProgressiveItemsLoaded) {
          onProgressiveItemsLoaded(transformedItems);
        }
      } catch (err) {
        console.error('Failed to load progressive module:', err);
        setProgressiveItems(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressiveData();
  }, [progressiveMode, moduleSlug, onProgressiveItemsLoaded]);

  // Fetch pending reviews for this lesson
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/mastery/lesson_reviews?lesson_id=${lesson.id}`
        );

        if (!response.ok) {
          // Silently handle 404 or other errors - reviews are optional
          return;
        }

        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          // Response is not JSON (likely HTML error page), skip silently
          return;
        }

        const data = await response.json();
        // Only set review data if reviews are available
        if (data.success && data.has_reviews) {
          setReviewData(data);
        }
      } catch (error) {
        // Silently handle errors - reviews are optional features
        // Only log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.debug('Reviews not available for this lesson:', error);
        }
      }
    };

    fetchReviews();
  }, [lesson.id]);

  // Use progressive items if available, otherwise use regular lesson items
  // If lesson.items exists, use it (it may already include exercises from microlessons)
  let items: LessonItem[] = progressiveItems || lesson.items || [
    { type: 'content', markdown: lesson.content || '' },
    ...(lesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
  ];
  
  // Debug: Log items to see if exercises are included
  console.log('📚 LessonViewer items:', items.length, 'types:', items.map(i => i.type));
  const exerciseItems = items.filter(i => i.type === 'exercise');
  if (exerciseItems.length > 0) {
    console.log('✅ Found exercises:', exerciseItems.length, exerciseItems.map(e => (e as any).exercise?.exercise_type));
  }

  // Insert review items at appropriate position
  if (reviewData && reviewData.has_reviews) {
    const insertionPercentage = reviewData.insertion_point?.percentage || 50;
    const insertionIndex = Math.floor((items.length * insertionPercentage) / 100);

    const reviewItem: LessonItem = {
      type: 'review',
      reviews: reviewData.reviews,
      strategy: reviewData.strategy,
      insertionPoint: reviewData.insertion_point,
      priority: reviewData.priority
    };

    items = [
      ...items.slice(0, insertionIndex),
      reviewItem,
      ...items.slice(insertionIndex)
    ];
  }

  console.log('📋 LessonViewer items:', items.length, 'structure:', items.map(i => i.type));

  const commandItems = items.filter(item => item.type === 'command');
  const totalCommands = commandItems.length;

  const getCurrentCommandIndex = () => {
    let commandIndex = 0;
    for (const item of items) {
      if (item.type === 'command') {
        const commandKey = `${lesson.id}-${commandIndex}`;
        if (!completedCommands.has(commandKey)) {
          return commandIndex;
        }
        commandIndex++;
      }
    }
    return -1;
  };

  const currentCommandIndex = getCurrentCommandIndex();

  const getVisibleItems = (): LessonItem[] => {
    // Filter out exercises - they're now shown in the ExercisePanel on the right
    const itemsWithoutExercises = items.filter(item => item.type !== 'exercise');
    
    // If no commands or all commands completed, show all items (content, but not exercises)
    if (currentCommandIndex === -1 || totalCommands === 0) {
      // For lessons with no commands (like microlessons), show all items except exercises
      return itemsWithoutExercises;
    }

    // For lessons with commands, show progressive content (but not exercises)
    const visibleItems: LessonItem[] = [];
    let commandIndex = 0;

    for (const item of itemsWithoutExercises) {
      if (item.type === 'content' || item.type === 'review') {
        // Content and reviews are always visible (they come after content)
        visibleItems.push(item);
      } else if (item.type === 'command') {
        // Only show commands up to the current unlocked command
        if (commandIndex <= currentCommandIndex) {
          visibleItems.push(item);
        } else {
          // Don't show future commands
          break;
        }
        commandIndex++;
      }
    }

    return visibleItems;
  };

  const visibleItems = getVisibleItems();
  const completedCount = commandItems.filter((_, i) =>
    completedCommands.has(`${lesson.id}-${i}`)
  ).length;

  console.log('👁️ Visible items:', visibleItems.length, 'current command index:', currentCommandIndex);
  console.log('   Lesson ID:', lesson.id, 'completed commands:', Array.from(completedCommands));

  // Auto-scroll to newly unlocked content
  useEffect(() => {
    const currentCount = visibleItems.length;
    const prevCount = prevVisibleCountRef.current;

    // Only auto-scroll if new items were added (not on initial load)
    if (currentCount > prevCount && lastItemRef.current) {
      // Small delay to ensure DOM is updated after animation
      setTimeout(() => {
        lastItemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }, 100);
    }

    prevVisibleCountRef.current = currentCount;
  }, [visibleItems.length]);

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let inCodeBlock = false;
    let codeBlockLines: string[] = [];
    let codeLanguage = '';

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 ml-4">
            {currentList.map((item, i) => (
              <li key={i} className="text-slate-700">{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const flushCodeBlock = () => {
      if (codeBlockLines.length > 0) {
        elements.push(
          <pre key={`code-${elements.length}`} className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-4">
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        );
        codeBlockLines = [];
        codeLanguage = '';
      }
    };

    lines.forEach((line, i) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          // Start of code block
          flushList();
          inCodeBlock = true;
          codeLanguage = line.substring(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        return;
      }

      // Handle lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        currentList.push(line.substring(2));
        return;
      }

      flushList();

      // Handle headings
      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-2xl font-bold text-slate-900 mt-6 mb-3">{line.substring(2)}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-bold text-slate-900 mt-5 mb-2">{line.substring(3)}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-semibold text-slate-900 mt-4 mb-2">{line.substring(4)}</h3>);
      } else if (line.startsWith('#### ')) {
        elements.push(<h4 key={i} className="text-base font-semibold text-slate-900 mt-3 mb-2">{line.substring(5)}</h4>);
      } 
      // Handle tables
      else if (line.includes('|') && line.trim().startsWith('|')) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length > 0) {
          elements.push(
            <div key={i} className="overflow-x-auto my-2">
              <table className="min-w-full border border-slate-200">
                <tbody>
                  <tr>
                    {cells.map((cell, cellIdx) => (
                      <td key={cellIdx} className="border border-slate-200 px-4 py-2 text-slate-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }
      }
      // Handle numbered lists
      else if (line.match(/^\d+\./)) {
        const match = line.match(/^(\d+)\.\s*\*\*(.+?)\*\*:\s*(.+)$/);
        if (match) {
          elements.push(
            <div key={i} className="flex gap-2 mb-2">
              <span className="text-blue-600 font-medium">{match[1]}. {match[2]}:</span>
              <span className="text-slate-700">{match[3]}</span>
            </div>
          );
        } else {
          elements.push(<p key={i} className="text-slate-700 ml-4">{line}</p>);
        }
      } 
      // Handle inline code
      else if (line.includes('`')) {
        const parts = line.split(/`([^`]+)`/g);
        const rendered = parts.map((part, idx) => {
          if (idx % 2 === 1) {
            return <code key={idx} className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono">{part}</code>;
          }
          return part;
        });
        elements.push(<p key={i} className="text-slate-700 mb-2">{rendered}</p>);
      }
      // Handle bold text
      else if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const rendered = parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx} className="font-semibold">{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        elements.push(<p key={i} className="text-slate-700 mb-2">{rendered}</p>);
      } 
      // Regular paragraph
      else if (line.trim()) {
        elements.push(<p key={i} className="text-slate-700 mb-2">{line}</p>);
      } else {
        // Empty line
        elements.push(<br key={i} />);
      }
    });

    flushList();
    flushCodeBlock();
    return elements;
  };

  // Show loading state while fetching progressive data
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-slate-600">Loading progressive lesson...</p>
        </div>
      </div>
    );
  }

  // Show locked screen if lesson or module is not accessible
  if (!isAccessible || !moduleAccessible) {
    const isModuleLocked = !moduleAccessible;

    return (
      <div className="h-full flex items-center justify-center bg-white">
        <Card className="max-w-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {isModuleLocked ? 'Module Locked' : 'Lesson Locked'}
          </h2>
          <p className="text-slate-600 mb-4">
            {isModuleLocked ? (
              previousModuleTitle
                ? `Complete all lessons in "${previousModuleTitle}" to unlock this module.`
                : 'Complete all lessons in the previous module to unlock this module.'
            ) : (
              previousLessonTitle
                ? `Complete "${previousLessonTitle}" to unlock this lesson.`
                : 'Complete the previous lesson to unlock this lesson.'
            )}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-800">
              <strong>💡 Progressive Learning:</strong> {isModuleLocked ? 'Modules' : 'Lessons'} are unlocked sequentially to ensure you build a strong foundation before advancing to more complex topics.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl min-h-full pb-12">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-slate-900">{lesson.title}</h1>
              {isCompleted && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
              {progressiveMode && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Progressive Learning
                </Badge>
              )}
            </div>
          </div>

          <AnimatePresence mode="sync">
            <div className="space-y-6">
              {visibleItems.map((item, index) => {
                const isLastItem = index === visibleItems.length - 1;

                if (item.type === 'content') {
                  return (
                    <motion.div
                      key={`content-${index}`}
                      ref={isLastItem ? lastItemRef : null}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="prose max-w-none"
                    >
                      {renderContent(item.markdown)}
                    </motion.div>
                  );
                } else if (item.type === 'review') {
                  // Render stealth review prompt
                  return (
                    <div key={`review-${index}`} ref={isLastItem ? lastItemRef : null}>
                      <StealthReviewPrompt
                        reviews={item.reviews}
                        strategy={item.strategy}
                        insertionPoint={item.insertionPoint}
                        priority={item.priority}
                        onReviewComplete={(results: ReviewResult[]) => {
                          console.log('✅ Reviews completed:', results);
                          // Clear review data after completion
                          setReviewData(null);
                        }}
                      />
                    </div>
                  );
                } else if (item.type === 'exercise') {
                  // Render interactive exercise (MCQ, short answer, etc.)
                  const exercise = item.exercise;
                  const exData = exercise.exercise_data;
                  const exerciseId = exercise.id;
                  const isSubmitted = exerciseSubmitted.has(exerciseId);
                  const showResults = exerciseShowResults.has(exerciseId);
                  const selectedAnswer = exerciseAnswers.get(exerciseId);
                  const isCorrect = exercise.exercise_type === 'mcq' && 
                    selectedAnswer === exData.correct_answer_index;
                  
                  const handleSelectMCQ = (optionIndex: number) => {
                    if (showResults) return;
                    const newAnswers = new Map(exerciseAnswers);
                    newAnswers.set(exerciseId, optionIndex);
                    setExerciseAnswers(newAnswers);
                  };
                  
                  const handleSubmitExercise = () => {
                    if (selectedAnswer === undefined) return;
                    setExerciseSubmitted(prev => new Set(prev).add(exerciseId));
                    setExerciseShowResults(prev => new Set(prev).add(exerciseId));
                  };
                  
                  const handleResetExercise = () => {
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
                  
                  return (
                    <motion.div
                      key={`exercise-${exercise.id}`}
                      ref={isLastItem ? lastItemRef : null}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <Card className="p-6 bg-blue-50 border-blue-200">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
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
                                variant="outline"
                                size="sm"
                                onClick={handleResetExercise}
                                className="text-xs"
                              >
                                Try Again
                              </Button>
                            )}
                          </div>
                          
                          {exercise.exercise_type === 'mcq' && exData.question && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-slate-900">{exData.question}</h3>
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
                                        onClick={() => handleSelectMCQ(optIndex)}
                                        disabled={showResults}
                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                          showCorrect
                                            ? 'bg-green-50 border-green-400 text-green-900'
                                            : showIncorrect
                                            ? 'bg-red-50 border-red-400 text-red-900'
                                            : isSelected
                                            ? 'bg-blue-50 border-blue-400 text-blue-900'
                                            : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                                        } ${showResults ? 'cursor-default' : 'cursor-pointer'}`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                            isSelected 
                                              ? showCorrect
                                                ? 'border-green-500 bg-green-500'
                                                : showIncorrect
                                                ? 'border-red-500 bg-red-500'
                                                : 'border-blue-500 bg-blue-500'
                                              : 'border-slate-300'
                                          }`}>
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                          </div>
                                          <span className="font-medium">{String.fromCharCode(65 + optIndex)}.</span>
                                          <span className="flex-1">{option}</span>
                                          {showCorrect && (
                                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                                              Correct Answer
                                            </Badge>
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                              {!showResults && selectedAnswer !== undefined && (
                                <Button
                                  onClick={handleSubmitExercise}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Submit Answer
                                </Button>
                              )}
                              {showResults && exData.explanation && (
                                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                  <p className="text-sm text-slate-700">
                                    <strong>Explanation:</strong> {exData.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {(exercise.exercise_type === 'short_answer' || exercise.exercise_type === 'reflection' || exercise.exercise_type === 'checkpoint') && exData.prompt && (
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-slate-900">{exData.prompt}</h3>
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
                                    ? '💭 Take a moment to reflect on this question...'
                                    : exercise.exercise_type === 'checkpoint'
                                    ? '✓ Check your understanding...'
                                    : 'Type your answer here...'
                                }
                                className="w-full p-4 bg-white rounded-lg border-2 border-slate-200 focus:border-blue-400 focus:outline-none resize-y min-h-[120px] text-slate-700 disabled:bg-slate-50 disabled:text-slate-500"
                              />
                              {!showResults && typeof selectedAnswer === 'string' && selectedAnswer.trim().length > 0 && (
                                <Button
                                  onClick={handleSubmitExercise}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Submit Answer
                                </Button>
                              )}
                              {showResults && (
                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                  <p className="text-sm text-green-700">
                                    ✓ Answer submitted! {exercise.exercise_type === 'reflection' ? 'Great reflection!' : 'Well done!'}
                                  </p>
                                </div>
                              )}
                              {exData.hints && exData.hints.length > 0 && (
                                <div className="mt-4">
                                  <details className="group">
                                    <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
                                      💡 Show Hints
                                    </summary>
                                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
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
                          
                          {exercise.exercise_type !== 'mcq' && exercise.exercise_type !== 'short_answer' && exercise.exercise_type !== 'reflection' && exercise.exercise_type !== 'checkpoint' && (
                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                              <p className="text-sm text-yellow-800">
                                Exercise type: {exercise.exercise_type}
                              </p>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                } else {
                  // Calculate actual command index for this command item
                  let commandIndex = 0;
                  for (let i = 0; i <= index; i++) {
                    if (items[i].type === 'command') {
                      if (i === index) break;
                      commandIndex++;
                    }
                  }

                  const cmd = item.command;
                  const commandKey = `${lesson.id}-${commandIndex}`;
                  const isCommandCompleted = completedCommands.has(commandKey);
                  const isCurrentCommand = commandIndex === currentCommandIndex;

                  // Determine state for CommandCard
                  const state = isCurrentCommand
                    ? 'current'
                    : isCommandCompleted
                    ? 'completed'
                    : 'locked';

                  console.log(`🎯 CommandCard state for "${cmd.command}":`, {
                    commandIndex,
                    commandKey,
                    state,
                    isCurrentCommand,
                    isCommandCompleted,
                    currentCommandIndex
                  });

                  return (
                    <div key={`command-${commandIndex}`} ref={isLastItem ? lastItemRef : null}>
                      <CommandCard
                        command={cmd}
                        state={state}
                        commandIndex={commandIndex}
                        onCopy={(command) => {
                          console.log('🖱️ onCopy triggered in LessonViewer for:', command);
                          if (onCommandCopy) onCommandCopy(command);
                          if (onCommandComplete) onCommandComplete(commandKey);
                        }}
                      />
                    </div>
                  );
                }
              })}
            </div>
          </AnimatePresence>

          {currentCommandIndex !== -1 && currentCommandIndex < totalCommands - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <Card className="p-4 bg-slate-50 border-slate-200">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <p className="text-slate-600 text-sm">
                    {totalCommands - completedCount - 1} more {totalCommands - completedCount - 1 === 1 ? 'command' : 'commands'} and content will unlock as you progress
                  </p>
                </div>
              </Card>
            </motion.div>
          )}

          {isCompleted && onGoToLab && !progressiveMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6"
            >
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-blue-900 mb-1">Ready for Practice?</h3>
                    <p className="text-blue-700 text-sm">
                      Apply what you've learned in a hands-on lab exercise
                    </p>
                  </div>
                  <Button onClick={onGoToLab} className="bg-blue-600 hover:bg-blue-700">
                    Go to Lab →
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
