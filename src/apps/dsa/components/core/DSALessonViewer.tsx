import { Code, CheckCircle2, Lock, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { DSALessonContent, DSALesson, TimeComplexityInfo } from "../../types/dsa-course";
import SubsetsStepByStep from "./SubsetsStepByStep";
import CombinationsStepByStep from "./CombinationsStepByStep";
import { PermutationsManualBuilder } from "./PermutationsManualBuilder";
import { PermutationsTreeVisualization } from "./PermutationsTreeVisualization";
import { BacktrackingTreeImportance } from "./BacktrackingTreeImportance";
import { TreeToCodeTranslation } from "./TreeToCodeTranslation";
import BacktrackingIntegratedLesson from "./BacktrackingIntegratedLesson";
import BacktrackingTreeLesson from "./BacktrackingTreeLesson";
import PracticeProblemsSection from "./PracticeProblemsSection";
import TrieIntegratedLesson from "./TrieIntegratedLesson";
import { TimeComplexityCard } from "./TimeComplexityCard";
import { TimeComplexityIntegratedLesson } from "./TimeComplexityIntegratedLesson";
import { TimeComplexityVisualization } from "./TimeComplexityVisualization";
import { TimeComplexityStageManager } from "./TimeComplexityStageManager";
import { renderStyledText } from "../../utils/styledTextRenderer";

interface DSALessonViewerProps {
  lessonTitle: string;
  lessonContent: string | DSALessonContent[];
  completedTasks: Set<string>;
  onTaskSelect: (taskId: string) => void;
  currentTaskId: string | null;
  complexityInfo?: TimeComplexityInfo; // NEW: Time complexity information
  completedQuizzes?: Set<string>; // For progressive lessons
  currentQuizIndex?: number; // Current quiz index for progressive lessons
}

export function DSALessonViewer({
  lessonTitle,
  lessonContent,
  completedTasks,
  onTaskSelect,
  currentTaskId,
  complexityInfo,
  completedQuizzes,
  currentQuizIndex = 0,
}: DSALessonViewerProps) {
  // Handle legacy string content
  if (typeof lessonContent === "string") {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="border-b bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
          <h2 className="text-indigo-900">{lessonTitle}</h2>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-none">
            <div className="text-base text-slate-700 leading-7 whitespace-pre-wrap">
              {lessonContent}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract all tasks to calculate progress
  const allTasks = lessonContent
    .filter((item) => item.type === "task" && item.task)
    .map((item) => item.task!);

  const completedCount = allTasks.filter((task) =>
    completedTasks.has(task.id),
  ).length;

  // Find first incomplete task
  const getCurrentTaskIndex = () => {
    for (let i = 0; i < allTasks.length; i++) {
      if (!completedTasks.has(allTasks[i].id)) {
        return i;
      }
    }
    return -1; // All tasks completed
  };

  const firstIncompleteIndex = getCurrentTaskIndex();
  const allTasksCompleted = firstIncompleteIndex === -1;

  // Determine which content items should be visible
  const getVisibleContent = () => {
    if (allTasksCompleted) {
      return lessonContent; // Show everything if all tasks complete
    }

    const visibleContent: DSALessonContent[] = [];
    let taskCount = 0;

    for (const item of lessonContent) {
      if (item.type === "task" && item.task) {
        // Show task only if all previous tasks are completed
        if (taskCount < firstIncompleteIndex) {
          // Completed task - show it
          visibleContent.push(item);
        } else if (taskCount === firstIncompleteIndex) {
          // Current task - show it
          visibleContent.push(item);
        }
        // Don't show future tasks at all
        taskCount++;
      } else {
        // Show text/code content only after completing previous task
        if (taskCount <= firstIncompleteIndex) {
          visibleContent.push(item);
        }
      }
    }

    return visibleContent;
  };

  const visibleContent = getVisibleContent();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
        <h2 className="text-indigo-900 mb-2">{lessonTitle}</h2>
        {allTasks.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-700">
              {completedCount}/{allTasks.length} tasks completed
            </div>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden max-w-xs">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${(completedCount / allTasks.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Lesson Content with Progressive Unlocking */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Time Complexity Card */}
          {complexityInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TimeComplexityCard info={complexityInfo} />
            </motion.div>
          )}

          {visibleContent.map((item, index) => {
            if (item.type === "text") {
              return (
                <motion.div
                  key={`text-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                  className="max-w-none"
                >
                  {item.content && renderStyledText(item.content, true)}
                </motion.div>
              );
            }

            if (item.type === "code") {
              return (
                <motion.div
                  key={`code-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  <Card className="p-4 bg-slate-900">
                    {item.title && (
                      <div className="text-sm text-slate-400 mb-2">
                        {item.title}
                      </div>
                    )}
                    <pre className="text-sm text-green-400 overflow-x-auto">
                      <code>{item.content}</code>
                    </pre>
                  </Card>
                </motion.div>
              );
            }

            if (
              item.type === "component" &&
              item.componentName
            ) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const ComponentMap: Record<string, React.ComponentType<any>> = {
                SubsetsStepByStep: SubsetsStepByStep,
                CombinationsStepByStep: CombinationsStepByStep,
                PermutationsManualBuilder:
                  PermutationsManualBuilder,
                PermutationsTreeVisualization:
                  PermutationsTreeVisualization,
                BacktrackingTreeImportance:
                  BacktrackingTreeImportance,
                TreeToCodeTranslation: TreeToCodeTranslation,
                BacktrackingIntegratedLesson:
                  BacktrackingIntegratedLesson,
                BacktrackingTreeLesson: BacktrackingTreeLesson,
                PracticeProblemsSection:
                  PracticeProblemsSection,
                TrieIntegratedLesson: TrieIntegratedLesson,
                TimeComplexityIntegratedLesson: TimeComplexityIntegratedLesson,
                TimeComplexityVisualization: TimeComplexityVisualization,
                TimeComplexityStageManager: TimeComplexityStageManager,
              };

              const Component =
                ComponentMap[item.componentName];

              if (Component) {
                // Pass props to TimeComplexityIntegratedLesson
                const componentProps = item.componentName === "TimeComplexityIntegratedLesson"
                  ? { currentQuizIndex }
                  : {};
                
                return (
                  <motion.div
                    key={`component-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                  >
                    <Component {...componentProps} />
                  </motion.div>
                );
              }
            }

            if (item.type === "task" && item.task) {
              const task = item.task;

              // Locked task
              if (item.content === "locked") {
                return (
                  <Card
                    key={`task-${index}`}
                    className="p-4 bg-slate-50 border-slate-200"
                  >
                    <div className="flex items-center gap-3 text-slate-400">
                      <Lock className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm">Next Task</div>
                        <div className="text-xs">
                          Complete previous tasks to unlock
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              }

              const isCompleted = completedTasks.has(task.id);
              const isCurrent = currentTaskId === task.id;
              const taskNumber =
                allTasks.findIndex((t) => t.id === task.id) + 1;

              return (
                <motion.div
                  key={`task-${task.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all border-2 ${
                      isCurrent
                        ? "bg-blue-50 border-blue-400 shadow-lg ring-4 ring-blue-100"
                        : isCompleted
                          ? "bg-green-50 border-green-300 shadow-sm"
                          : "bg-white border-slate-300 hover:bg-blue-50/30 hover:border-blue-200 hover:shadow-md"
                    }`}
                    onClick={() => onTaskSelect(task.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        {isCompleted ? (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        ) : isCurrent ? (
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                            <Code className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-slate-300 flex items-center justify-center">
                            <span className="text-sm text-slate-600">
                              {taskNumber}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant="outline"
                                className="text-xs"
                              >
                                Task {taskNumber}
                              </Badge>
                              {isCurrent && (
                                <Badge className="bg-blue-500 text-white text-xs">
                                  👉 Working on this
                                </Badge>
                              )}
                              {isCompleted && (
                                <Badge className="bg-green-500 text-white text-xs">
                                  ✓ Completed
                                </Badge>
                              )}
                            </div>
                            <h4
                              className={`text-lg ${
                                isCurrent
                                  ? "text-blue-900"
                                  : isCompleted
                                    ? "text-green-900"
                                    : "text-slate-900"
                              }`}
                            >
                              {task.title}
                            </h4>
                          </div>
                        </div>

                        <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                          {task.description}
                        </p>

                        <div className="text-sm bg-slate-100 px-3 py-2 rounded border border-slate-200">
                          <span className="text-slate-600">
                            Expected output:
                          </span>{" "}
                          <code className="text-indigo-700 font-mono">
                            {task.expectedOutput}
                          </code>
                        </div>

                        {isCurrent && (
                          <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-2 text-sm text-blue-900">
                              <Code className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium mb-1">
                                  Ready to code!
                                </p>
                                <p className="text-xs text-blue-700">
                                  Write your solution in the
                                  code editor on the right, then
                                  click "Run Code" to test it.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {isCompleted && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-green-700 font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Great job! Task completed
                            successfully.
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            }

            return null;
          })}

          {/* All Tasks Completed */}
          {allTasksCompleted && allTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6"
            >
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-green-900 mb-2">
                  Lesson Complete!
                </h3>
                <p className="text-sm text-green-700 mb-4">
                  You've completed all {allTasks.length} tasks
                  for this lesson.
                </p>
                <p className="text-sm text-slate-600">
                  Switch to <strong>Practice Mode</strong> to
                  solve full coding problems!
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}