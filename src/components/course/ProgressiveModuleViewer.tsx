import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Lock, AlertCircle, Lightbulb } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { useProgressiveLesson } from '../../hooks/useProgressiveLesson';
import type { ProgressiveModule, LessonItem, CommandItem } from '../../types/progressive';

interface ProgressiveModuleViewerProps {
  courseSlug: string;
  moduleSlug: string;
}

export function ProgressiveModuleViewer({ courseSlug, moduleSlug }: ProgressiveModuleViewerProps) {
  const [module, setModule] = useState<ProgressiveModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commandInput, setCommandInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    visibleItems,
    currentCommand,
    isComplete,
    progress,
    submitCommand,
    showingHint,
    toggleHint,
    showingAnswer,
    revealAnswer,
    attemptCounts,
    completedCommands,
  } = useProgressiveLesson(module);

  // Fetch progressive module data
  useEffect(() => {
    const fetchModule = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/v1/docker/courses/${courseSlug}/modules/${moduleSlug}/progressive`
        );

        if (!response.ok) {
          throw new Error('Failed to load progressive module');
        }

        const data = await response.json();
        setModule(data.module);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load module');
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [courseSlug, moduleSlug]);

  // Handle command submission
  const handleCommandSubmit = () => {
    if (!commandInput.trim()) return;

    const result = submitCommand(commandInput);

    setFeedback({
      type: result.success ? 'success' : 'error',
      message: result.message,
    });

    if (result.success) {
      setCommandInput('');
      // Clear feedback after delay
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  // Render markdown content (simple version)
  const renderMarkdown = (markdown: string) => {
    const lines = markdown.split('\n');

    return lines.map((line, index) => {
      // Headings
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
      }

      // Code blocks
      if (line.startsWith('```')) {
        return null; // Handle code blocks separately if needed
      }

      // Inline code
      const parts = line.split(/`([^`]+)`/g);
      if (parts.length > 1) {
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <code key={i} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                  {part}
                </code>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      // Regular paragraph
      if (line.trim()) {
        return <p key={index} className="mb-2">{line}</p>;
      }

      return <br key={index} />;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progressive lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-2">Error Loading Module</h2>
          <p className="text-gray-600 text-center">{error || 'Module not found'}</p>
        </Card>
      </div>
    );
  }

  const currentAttempts = currentCommand ? attemptCounts.get(currentCommand.id) || 0 : 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{module.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{module.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Progress: {completedCommands.size} / {module.total_commands} commands
            </div>
            <Progress value={progress} className="w-48" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Content Panel */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 max-w-3xl mx-auto">
              <AnimatePresence mode="sync">
                {visibleItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item.type === 'content' ? (
                      <Card className="p-6 mb-6 bg-white dark:bg-gray-800">
                        <div className="prose dark:prose-invert max-w-none">
                          {renderMarkdown(item.markdown)}
                        </div>
                      </Card>
                    ) : (
                      <Card className="p-6 mb-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          {completedCommands.has(item.id) ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex-shrink-0 mt-1" />
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{item.description}</h3>
                            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm mb-2">
                              <code>$ {item.command}</code>
                            </div>
                            {currentCommand?.id === item.id && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Type this command in the terminal on the right →
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Locked Content Indicator */}
              {!isComplete && visibleItems.length < module.items.length && (
                <Card className="p-6 bg-gray-100 dark:bg-gray-800 border-dashed">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Lock className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-medium">More content locked</p>
                    <p className="text-sm">Complete the current command to continue</p>
                  </div>
                </Card>
              )}

              {/* Completion Message */}
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-300 dark:border-green-700">
                    <div className="text-center">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Module Complete!
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
                        You've completed all {module.total_commands} commands. Great work!
                      </p>
                      <Button size="lg">Continue to Next Module</Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Terminal Panel */}
        <div className="w-[500px] border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-lg">Practice Terminal</h2>
            {currentCommand && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Try: <code className="text-blue-600">{currentCommand.command}</code>
              </p>
            )}
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {/* Feedback Message */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        feedback.type === 'success'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}
                    >
                      {feedback.message}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Command Input */}
              <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">$</span>
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCommandSubmit();
                      }
                    }}
                    placeholder="Type your command here..."
                    className="flex-1 bg-transparent outline-none text-green-400 placeholder-gray-600"
                    disabled={isComplete}
                  />
                </div>
              </div>

              <Button onClick={handleCommandSubmit} className="w-full" disabled={isComplete}>
                Execute Command
              </Button>

              {/* Hints Section */}
              {currentCommand && currentAttempts >= 2 && !showingAnswer && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={toggleHint}
                    className="w-full"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {showingHint ? 'Hide Hint' : 'Need a Hint?'}
                  </Button>

                  <AnimatePresence>
                    {showingHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            {currentCommand.hint}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Show Answer Button */}
              {currentCommand && currentAttempts >= 3 && !showingAnswer && (
                <Button
                  variant="ghost"
                  onClick={revealAnswer}
                  className="w-full text-orange-600 hover:text-orange-700"
                >
                  Show Answer
                </Button>
              )}

              {/* Answer Display */}
              <AnimatePresence>
                {showingAnswer && currentCommand && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                      <p className="text-sm font-medium mb-2">Answer:</p>
                      <code className="block bg-gray-900 text-green-400 p-2 rounded font-mono text-sm">
                        {currentCommand.command}
                      </code>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Progress Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {completedCommands.size} / {module.total_commands} complete
              </span>
              <Badge variant={isComplete ? 'default' : 'secondary'}>
                {Math.round(progress)}%
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
