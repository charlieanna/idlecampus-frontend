import { useState, isValidElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { allLessons } from '../../data/lessons';

import { 
  H1, H2, H3, P, Strong, Code, CodeBlock, UL, LI, Section, 
  ComparisonTable, KeyPoint, Example, Divider 
} from '../components/LessonContent';

// Simple markdown parser that converts to React components
function parseMarkdownToReact(markdown: string) {
  const lines = markdown.split('\n');
  const elements: JSX.Element[] = [];
  let currentList: string[] = [];
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(<CodeBlock key={`code-${i}`} language={codeBlockLanguage}>{codeBlockContent.trim()}</CodeBlock>);
        codeBlockContent = '';
        codeBlockLanguage = '';
        inCodeBlock = false;
      } else {
        // Start code block
        codeBlockLanguage = line.slice(3).trim();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      if (currentList.length > 0) {
        elements.push(<UL key={`ul-${i}`}>{currentList.map((item, idx) => <LI key={idx}>{parseInlineMarkdown(item)}</LI>)}</UL>);
        currentList = [];
      }
      elements.push(<H3 key={`h3-${i}`}>{parseInlineMarkdown(line.slice(4))}</H3>);
      continue;
    }

    if (line.startsWith('## ')) {
      if (currentList.length > 0) {
        elements.push(<UL key={`ul-${i}`}>{currentList.map((item, idx) => <LI key={idx}>{parseInlineMarkdown(item)}</LI>)}</UL>);
        currentList = [];
      }
      elements.push(<H2 key={`h2-${i}`}>{parseInlineMarkdown(line.slice(3))}</H2>);
      continue;
    }

    if (line.startsWith('# ')) {
      if (currentList.length > 0) {
        elements.push(<UL key={`ul-${i}`}>{currentList.map((item, idx) => <LI key={idx}>{parseInlineMarkdown(item)}</LI>)}</UL>);
        currentList = [];
      }
      elements.push(<H1 key={`h1-${i}`}>{parseInlineMarkdown(line.slice(2))}</H1>);
      continue;
    }

    // Lists
    if (line.match(/^[\-\*] /)) {
      currentList.push(line.replace(/^[\-\*] /, ''));
      continue;
    }

    if (line.match(/^\d+\. /)) {
      currentList.push(line.replace(/^\d+\. /, ''));
      continue;
    }

    // Empty line - flush list and add paragraph
    if (line.trim() === '') {
      if (currentList.length > 0) {
        elements.push(<UL key={`ul-${i}`}>{currentList.map((item, idx) => <LI key={idx}>{parseInlineMarkdown(item)}</LI>)}</UL>);
        currentList = [];
      }
      continue;
    }

    // Regular paragraph
    if (currentList.length > 0) {
      elements.push(<UL key={`ul-${i}`}>{currentList.map((item, idx) => <LI key={idx}>{parseInlineMarkdown(item)}</LI>)}</UL>);
      currentList = [];
    }
    elements.push(<P key={`p-${i}`}>{parseInlineMarkdown(line)}</P>);
  }

  // Flush remaining list
  if (currentList.length > 0) {
    elements.push(<UL key="ul-final">{currentList.map((item, idx) => <LI key={idx}>{parseInlineMarkdown(item)}</LI>)}</UL>);
  }

  return <Section>{elements}</Section>;
}

// Parse inline markdown (bold, italic, code)
function parseInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let current = text;
  let key = 0;

  // Handle code blocks first
  current = current.replace(/`([^`]+)`/g, (_, code) => {
    parts.push(<Code key={key++}>{code}</Code>);
    return `__CODE_${key - 1}__`;
  });

  // Handle bold
  current = current.replace(/\*\*([^*]+)\*\*/g, (_, bold) => {
    parts.push(<Strong key={key++}>{bold}</Strong>);
    return `__BOLD_${key - 1}__`;
  });

  // Handle italic
  current = current.replace(/\*([^*]+)\*/g, (_, italic) => {
    parts.push(<Em key={key++}>{italic}</Em>);
    return `__ITALIC_${key - 1}__`;
  });

  // Split by placeholders and reconstruct
  const segments = current.split(/(__(?:CODE|BOLD|ITALIC)_\d+__)/);
  const result: React.ReactNode[] = [];
  
  segments.forEach((segment, idx) => {
    const match = segment.match(/__(CODE|BOLD|ITALIC)_(\d+)__/);
    if (match) {
      const index = parseInt(match[2]);
      result.push(parts[index]);
    } else if (segment) {
      result.push(segment);
    }
  });

  return result.length > 0 ? <>{result}</> : text;
}

// Helper to render stage content
function renderStageContent(stage: any) {
  // If content is a React element, render it directly
  if (isValidElement(stage.content)) {
    return stage.content;
  }
  
  // If content has markdown property, parse and render with Tailwind
  if (stage.content && typeof stage.content === 'object' && 'markdown' in stage.content) {
    return parseMarkdownToReact(stage.content.markdown);
  }
  
  // If content is a string, parse and render with Tailwind
  if (typeof stage.content === 'string') {
    return parseMarkdownToReact(stage.content);
  }
  
  return <p className="text-slate-500">No content available</p>;
}

export function LessonViewer() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const lesson = allLessons.find(l => l.id === lessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h2>
          <p className="text-gray-600 mb-4">The lesson you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/system-design/lessons')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  const currentStage = lesson.stages[currentStageIndex];
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === lesson.stages.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/system-design/lessons')}
                className="text-slate-500 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{lesson.title}</h1>
                <p className="text-sm text-slate-600">
                  Stage {currentStageIndex + 1} of {lesson.stages.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200">
                {lesson.estimatedMinutes} min
              </span>
              <span className="px-3 py-1.5 bg-violet-50 text-violet-700 text-sm font-medium rounded-lg border border-violet-200">
                {lesson.difficulty}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex gap-1.5">
              {lesson.stages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    index === currentStageIndex
                      ? 'bg-blue-600 shadow-sm'
                      : index < currentStageIndex
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Stage Title */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-lg shadow-sm">
                STAGE {currentStageIndex + 1}
              </span>
              <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-200">
                {currentStage.type}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{currentStage.title}</h2>
          </div>

          {/* Stage Content */}
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-lg">
            {renderStageContent(currentStage)}
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t border-slate-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStageIndex(currentStageIndex - 1)}
              disabled={isFirstStage}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                isFirstStage
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-sm'
              }`}
            >
              ← Previous
            </button>

            <div className="text-sm text-slate-600 font-medium">
              {currentStageIndex + 1} / {lesson.stages.length}
            </div>

            {isLastStage ? (
              <button
                onClick={() => navigate('/system-design/lessons')}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-sm hover:shadow-md"
              >
                Complete Lesson ✓
              </button>
            ) : (
              <button
                onClick={() => setCurrentStageIndex(currentStageIndex + 1)}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

