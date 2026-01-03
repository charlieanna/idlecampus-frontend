import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Clock, BookOpen } from 'lucide-react';
import { ProgressiveLesson } from '../../types/progressive-lesson-enhanced';
import { renderStyledText } from '../../utils/styledTextRenderer';

interface GenericLessonStageManagerProps {
  lesson: ProgressiveLesson;
  currentQuizIndex: number;
}

export function GenericLessonStageManager({ lesson, currentQuizIndex }: GenericLessonStageManagerProps) {
  // Get quiz sections
  const quizSections = lesson.sections.filter(s => s.type === 'quiz');

  // Get the reading section that comes before the current quiz
  // Pattern: reading sections come before quiz sections
  const currentQuizSection = quizSections[currentQuizIndex];
  if (!currentQuizSection) return null;

  const quizSectionIndex = lesson.sections.findIndex(s => s.id === currentQuizSection.id);

  // Find the most recent reading section before this quiz
  const readingSection = lesson.sections
    .slice(0, quizSectionIndex)
    .reverse()
    .find(s => s.type === 'reading');

  if (!readingSection || readingSection.type !== 'reading') {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 text-slate-500">
        <p>No reading content available for this stage</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
        <div className="flex gap-1">
          {quizSections.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                idx < currentQuizIndex
                  ? 'bg-green-500'
                  : idx === currentQuizIndex
                  ? 'bg-blue-500'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-8">
          {/* Reading Section Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-indigo-900">
                  {readingSection.title}
                </h3>
                {readingSection.estimatedReadTime && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{readingSection.estimatedReadTime}s read</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reading Content */}
          <div className="max-w-none">
            {typeof readingSection.content === 'string' ? (
              renderStyledText(readingSection.content, true)
            ) : (
              readingSection.content
            )}
          </div>

          {/* Quiz Instruction */}
          <div className="mt-8 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">→</span>
              <div>
                <div className="text-indigo-900 mb-1">Ready for the Quiz?</div>
                <p className="text-sm text-indigo-800">
                  Answer the questions in the quiz panel on the right to test your understanding and unlock the next stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
