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
  previousLessonTitle
}: LessonViewerProps) {
  const [progressiveItems, setProgressiveItems] = useState<LessonItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);

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
          console.error('Failed to fetch reviews:', response.status);
          return;
        }

        const data = await response.json();
        if (data.success && data.has_reviews) {
          setReviewData(data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [lesson.id]);

  // Use progressive items if available, otherwise use regular lesson items
  let items: LessonItem[] = progressiveItems || lesson.items || [
    { type: 'content', markdown: lesson.content || '' },
    ...(lesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
  ];

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
    if (currentCommandIndex === -1) {
      return items;
    }

    const visibleItems: LessonItem[] = [];
    let commandIndex = 0;

    for (const item of items) {
      if (item.type === 'content') {
        const isContentVisible = commandIndex <= currentCommandIndex;
        if (isContentVisible) {
          visibleItems.push(item);
        } else {
          break;
        }
      } else if (item.type === 'command') {
        if (commandIndex <= currentCommandIndex) {
          visibleItems.push(item);
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

    lines.forEach((line, i) => {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        currentList.push(line.substring(2));
        return;
      }

      flushList();

      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-slate-900 mt-6 mb-3">{line.substring(2)}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-slate-900 mt-5 mb-2">{line.substring(3)}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-slate-900 mt-4 mb-2">{line.substring(4)}</h3>);
      } else if (line.match(/^\d+\./)) {
        const match = line.match(/^(\d+)\.\s*\*\*(.+?)\*\*:\s*(.+)$/);
        if (match) {
          elements.push(
            <div key={i} className="flex gap-2 mb-2">
              <span className="text-blue-600">{match[1]}. {match[2]}:</span>
              <span className="text-slate-700">{match[3]}</span>
            </div>
          );
        } else {
          elements.push(<p key={i} className="text-slate-700">{line}</p>);
        }
      } else if (line.trim()) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const rendered = parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        elements.push(<p key={i} className="text-slate-700 mb-2">{rendered}</p>);
      }
    });

    flushList();
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

  // Show locked screen if lesson is not accessible
  if (!isAccessible) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <Card className="max-w-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Lesson Locked</h2>
          <p className="text-slate-600 mb-4">
            {previousLessonTitle
              ? `Complete "${previousLessonTitle}" to unlock this lesson.`
              : 'Complete the previous lesson to unlock this lesson.'}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-800">
              <strong>💡 Progressive Learning:</strong> Lessons are unlocked sequentially to ensure you build a strong foundation before advancing to more complex topics.
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
