import React from 'react';
import { InlineMiniEditor } from '../components/core/InlineMiniEditor';
import { InlineExercise } from '../types/progressive-lesson-enhanced';
import { Lock } from 'lucide-react';
import { SlidingWindowVisualizer } from '../components/core/SlidingWindowVisualizer';

export interface StyledTextOptions {
  skipFirstH1?: boolean;
  inlineExercises?: InlineExercise[];
  runPythonCode?: (code: string) => Promise<{ output: string; error?: string }>;
  onExerciseComplete?: (exerciseId: string) => void;
  completedExercises?: Set<string>; // Track which exercises are completed
  progressiveLock?: boolean; // If true, lock content after unsolved exercises
}

/**
 * Renders plain text with basic markdown-like styling or HTML content
 * Supports both markdown syntax, HTML tags, and inline code editors
 *
 * @param content - The text content to render (markdown or HTML)
 * @param options - Configuration options including skipFirstH1, inlineExercises, runPythonCode
 */
export function renderStyledText(
  content: string,
  optionsOrSkipFirstH1: boolean | StyledTextOptions = false
): React.ReactNode {
  if (!content) return null;

  // Handle backward compatibility: second param can be boolean or options object
  const options: StyledTextOptions = typeof optionsOrSkipFirstH1 === 'boolean'
    ? { skipFirstH1: optionsOrSkipFirstH1 }
    : optionsOrSkipFirstH1;

  const { skipFirstH1 = false, inlineExercises, runPythonCode, onExerciseComplete, completedExercises, progressiveLock = true } = options;

  // Check if content contains HTML tags - if so, render as HTML
  const hasHtmlTags = /<(h[1-6]|p|div|pre|code|strong|em|ul|ol|li|blockquote|table|tr|td|th|thead|tbody|span|a|br|details|summary)\b[^>]*>/i.test(content);

  // Check for inline code editors
  const hasInlineEditors = /<code-editor\s+data-id="([^"]+)"[^>]*><\/code-editor>/gi.test(content);
  const hasVisualizer = /<sliding-window-visualizer[^>]*><\/sliding-window-visualizer>/gi.test(content);

  if (hasHtmlTags) {
    // Process HTML content to add styling classes
    let styledHtml = content;

    // Code blocks: handle <pre><code> first, then standalone <pre>
    // Replace <pre><code> with styled version
    styledHtml = styledHtml.replace(
      /<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/gi,
      '<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm border border-slate-700 whitespace-pre"><code$1>$2</code></pre>'
    );

    // Replace standalone <pre> tags (without class attribute already)
    styledHtml = styledHtml.replace(
      /<pre>([^<]*(?:<(?!\/pre>)[^<]*)*)<\/pre>/gi,
      (match, content) => {
        // Skip if already has class (was processed above)
        if (match.includes('class=')) return match;
        return `<pre class="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm border border-slate-700 whitespace-pre">${content}</pre>`;
      }
    );

    // Headers
    styledHtml = styledHtml
      .replace(/<h1([^>]*)>/gi, '<h1$1 class="text-3xl font-bold text-slate-900 mt-8 mb-4">')
      .replace(/<h2([^>]*)>/gi, '<h2$1 class="text-2xl font-bold text-slate-900 mt-8 mb-4">')
      .replace(/<h3([^>]*)>/gi, '<h3$1 class="text-xl font-semibold text-slate-900 mt-6 mb-3">')
      .replace(/<h4([^>]*)>/gi, '<h4$1 class="text-lg font-semibold text-slate-900 mt-4 mb-2">')
      // Paragraphs
      .replace(/<p([^>]*)>/gi, '<p$1 class="text-slate-700 leading-7 mb-4">')
      // Inline code (not inside pre blocks)
      .replace(/<code>([^<]+)<\/code>(?![^<]*<\/pre>)/gi, '<code class="px-2 py-1 bg-slate-100 text-blue-600 rounded text-sm font-mono border border-slate-200">$1</code>')
      // Strong/Bold
      .replace(/<strong([^>]*)>/gi, '<strong$1 class="text-slate-900 font-semibold">')
      // Lists
      .replace(/<ul([^>]*)>/gi, '<ul$1 class="my-4 space-y-2 list-disc ml-6">')
      .replace(/<ol([^>]*)>/gi, '<ol$1 class="my-4 space-y-2 list-decimal ml-6">')
      .replace(/<li([^>]*)>/gi, '<li$1 class="text-slate-700 leading-relaxed">')
      // Tables
      .replace(/<table([^>]*)>/gi, '<table$1 class="min-w-full border-collapse border border-slate-300 rounded-lg my-6">')
      .replace(/<thead([^>]*)>/gi, '<thead$1 class="bg-slate-100">')
      .replace(/<th([^>]*)>/gi, '<th$1 class="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-700">')
      .replace(/<td([^>]*)>/gi, '<td$1 class="border border-slate-300 px-4 py-3 text-slate-600">')
      // Details/Summary (collapsible sections)
      .replace(/<details([^>]*)>/gi, '<details$1 class="my-4 border border-slate-300 rounded-lg overflow-hidden">')
      .replace(/<summary([^>]*)>/gi, '<summary$1 class="bg-slate-100 px-4 py-3 cursor-pointer font-medium text-slate-700 hover:bg-slate-200">')
      // Blockquotes
      .replace(/<blockquote([^>]*)>/gi, '<blockquote$1 class="my-6 pl-4 border-l-4 border-blue-400 bg-blue-50/50 py-4 pr-4 text-slate-700 italic">')
      // Horizontal rules
      .replace(/<hr([^>]*)\s*\/?>/gi, '<hr$1 class="my-6 border-slate-200" />');

    // Skip first H1 if requested
    if (skipFirstH1) {
      styledHtml = styledHtml.replace(/<h1[^>]*>[\s\S]*?<\/h1>/, '');
    }

    // If there are inline editors or visualizers, split content and render them
    if ((hasInlineEditors && inlineExercises && runPythonCode) || hasVisualizer) {
      // Split by code-editor tags OR visualizer tags
      // We need a more complex split to handle multiple types of components
      // Simple approach: Use a combined regex
      const componentRegex = /<(code-editor|sliding-window-visualizer)(?:\s+data-id="([^"]+)")?[^>]*><\/\1>/gi;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      let partKey = 0;
      let isLocked = false; // Track if we've hit an unsolved exercise
      let lockedExerciseId: string | null = null;

      // Reset regex state
      const matches: { index: number; length: number; type: string; id?: string }[] = [];
      while ((match = componentRegex.exec(styledHtml)) !== null) {
        matches.push({
          index: match.index,
          length: match[0].length,
          type: match[1],
          id: match[2]
        });
      }

      // Process matches
      for (let i = 0; i < matches.length; i++) {
        const m = matches[i];

        // Capture data-height if present
        const heightMatch = /data-height="([^"]+)"/i.exec(styledHtml.substring(m.index, m.index + m.length));
        const customHeight = heightMatch ? heightMatch[1] : undefined;

        // Add HTML before this editor (only if not locked)
        if (m.index > lastIndex && !isLocked) {
          const htmlBefore = styledHtml.substring(lastIndex, m.index);
          parts.push(
            <div
              key={`html-${partKey++}`}
              className="styled-text-content prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlBefore }}
            />
          );
        }

        if (m.type === 'sliding-window-visualizer') {
          parts.push(
            <SlidingWindowVisualizer key={`viz-${partKey++}`} />
          );
          lastIndex = m.index + m.length;
          continue;
        }

        // Find the exercise by ID
        const exercise = inlineExercises?.find(ex => ex.id === m.id);
        const isExerciseCompleted = m.id ? (completedExercises?.has(m.id) ?? false) : false;

        if (!isLocked) {
          if (exercise) {
            parts.push(
              <InlineMiniEditor
                key={`editor-${m.id}-${partKey++}`}
                exercise={exercise}
                runPythonCode={runPythonCode!}
                onComplete={onExerciseComplete}
                height={customHeight}
              />
            );

            // If progressive lock is enabled and this exercise isn't completed, lock remaining content
            if (progressiveLock && !isExerciseCompleted && m.id) {
              isLocked = true;
              lockedExerciseId = m.id;
            }
          } else {
            // Exercise not found - show placeholder
            parts.push(
              <div
                key={`missing-${partKey++}`}
                className="my-6 p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50 text-red-600 text-sm"
              >
                Exercise "{m.id}" not found in inlineExercises
              </div>
            );
          }
        }

        lastIndex = m.index + m.length;
      }

      // Add remaining HTML after last editor (only if not locked)
      if (lastIndex < styledHtml.length && !isLocked) {
        const htmlAfter = styledHtml.substring(lastIndex);
        parts.push(
          <div
            key={`html-${partKey++}`}
            className="styled-text-content prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlAfter }}
          />
        );
      }

      // If locked, show a locked indicator
      if (isLocked) {
        const remainingCount = matches.filter(m => m.type === 'code-editor').length;
        // Logic for remaining count is tricky with mixed types, simplify for now
        parts.push(
          <div
            key={`locked-${partKey++}`}
            className="mt-8 p-6 rounded-xl bg-gradient-to-b from-slate-100 to-slate-200 border-2 border-slate-300 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-300 mb-4">
              <Lock className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Complete the exercise above to continue
            </h3>
            <p className="text-slate-500 text-sm">
              {remainingCount > 0
                ? `${remainingCount} more exercise${remainingCount > 1 ? 's' : ''} and content await you`
                : 'More content awaits you'}
            </p>
          </div>
        );
      }

      return <div className="styled-text-with-editors">{parts}</div>;
    }

    return (
      <div
        className="styled-text-content prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: styledHtml }}
      />
    );
  }

  const lines = content.split('\n');
  let firstH1Skipped = false;
  const elements: React.ReactNode[] = [];
  let currentCodeBlock: string[] = [];
  let inCodeBlock = false;
  let currentList: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let currentTable: string[] = [];
  let inTable = false;
  let keyCounter = 0;

  const flushCodeBlock = () => {
    if (currentCodeBlock.length > 0) {
      const code = currentCodeBlock.join('\n');
      elements.push(
        <pre
          key={`code-${keyCounter++}`}
          className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm border border-slate-700"
        >
          <code>{code}</code>
        </pre>
      );
      currentCodeBlock = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      const ListTag = listType === 'ol' ? 'ol' : 'ul';
      elements.push(
        <ListTag
          key={`list-${keyCounter++}`}
          className={`my-4 space-y-2 ${listType === 'ol' ? 'list-decimal' : 'list-disc'} ml-6`}
        >
          {currentList.map((item, idx) => (
            <li key={idx} className="text-slate-700 leading-relaxed">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ListTag>
      );
      currentList = [];
      listType = null;
    }
  };

  const flushTable = () => {
    if (currentTable.length < 2) {
      currentTable = [];
      inTable = false;
      return;
    }

    // Parse table rows
    const parseRow = (row: string) =>
      row.split('|').map(cell => cell.trim()).filter((_, i, arr) => i > 0 && i < arr.length);

    const headerRow = parseRow(currentTable[0]);
    // Skip separator row (index 1)
    const bodyRows = currentTable.slice(2).map(parseRow);

    elements.push(
      <div key={`table-${keyCounter++}`} className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-slate-300 rounded-lg">
          <thead className="bg-slate-100">
            <tr>
              {headerRow.map((cell, idx) => (
                <th
                  key={idx}
                  className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-700"
                >
                  {renderInlineFormatting(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="border border-slate-300 px-4 py-3 text-slate-600"
                  >
                    {renderInlineFormatting(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    currentTable = [];
    inTable = false;
  };

  const renderInlineFormatting = (text: string): React.ReactNode => {
    // Handle bold **text**
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let match;
    let partKey = 0;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before bold
      if (match.index > lastIndex) {
        parts.push(
          <React.Fragment key={`text-${partKey++}`}>
            {renderInlineCode(text.substring(lastIndex, match.index))}
          </React.Fragment>
        );
      }
      // Add bold text
      parts.push(
        <strong key={`bold-${partKey++}`} className="text-slate-900 font-semibold">
          {renderInlineCode(match[1])}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <React.Fragment key={`text-${partKey++}`}>
          {renderInlineCode(text.substring(lastIndex))}
        </React.Fragment>
      );
    }

    return parts.length > 0 ? parts : renderInlineCode(text);
  };

  const renderInlineCode = (text: string): React.ReactNode => {
    // Handle inline code `code`
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const codeRegex = /`([^`]+)`/g;
    let match;
    let partKey = 0;

    while ((match = codeRegex.exec(text)) !== null) {
      // Add text before code
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add inline code
      parts.push(
        <code
          key={`inline-code-${partKey++}`}
          className="px-2 py-1 bg-slate-100 text-blue-600 rounded text-sm font-mono border border-slate-200"
        >
          {match[1]}
        </code>
      );
      lastIndex = match.index + match[0].length;
    }
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  lines.forEach((line, i) => {
    // Handle code blocks
    if (line.trim() === '```' || line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      currentCodeBlock.push(line);
      return;
    }

    // Handle tables - detect lines starting with |
    const isTableRow = line.trim().startsWith('|') && line.trim().endsWith('|');
    const isTableSeparator = /^\|[\s\-:|]+\|$/.test(line.trim());

    if (isTableRow || isTableSeparator) {
      if (!inTable) {
        flushList();
        flushCodeBlock();
        inTable = true;
      }
      currentTable.push(line);
      return;
    } else if (inTable) {
      // End of table
      flushTable();
    }

    // Handle lists
    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      flushCodeBlock();
      const isOrdered = /^\d+\./.test(listMatch[2]);
      const newListType = isOrdered ? 'ol' : 'ul';

      if (listType !== newListType) {
        flushList();
        listType = newListType;
      }

      currentList.push(listMatch[3]);
      return;
    }

    // If we hit a non-list line, flush any current list
    if (currentList.length > 0) {
      flushList();
    }

    // Handle headers
    if (line.startsWith('### ')) {
      flushCodeBlock();
      elements.push(
        <h3
          key={`h3-${keyCounter++}`}
          className="text-xl font-semibold text-slate-900 mt-6 mb-3"
        >
          {renderInlineFormatting(line.substring(4))}
        </h3>
      );
      return;
    }

    if (line.startsWith('## ')) {
      flushCodeBlock();
      elements.push(
        <h2
          key={`h2-${keyCounter++}`}
          className="text-2xl font-bold text-slate-900 mt-8 mb-4"
        >
          {renderInlineFormatting(line.substring(3))}
        </h2>
      );
      return;
    }

    if (line.startsWith('# ')) {
      flushCodeBlock();
      // Skip first H1 if requested (when title is shown separately)
      if (skipFirstH1 && !firstH1Skipped) {
        firstH1Skipped = true;
        return; // Skip this line
      }
      elements.push(
        <h1
          key={`h1-${keyCounter++}`}
          className="text-3xl font-bold text-slate-900 mt-8 mb-4"
        >
          {renderInlineFormatting(line.substring(2))}
        </h1>
      );
      return;
    }

    // Handle horizontal rules
    if (line.trim() === '---' || line.trim() === '***') {
      flushCodeBlock();
      elements.push(
        <hr
          key={`hr-${keyCounter++}`}
          className="my-6 border-slate-200"
        />
      );
      return;
    }

    // Handle regular paragraphs
    if (line.trim()) {
      flushCodeBlock();
      elements.push(
        <p
          key={`p-${keyCounter++}`}
          className="text-slate-700 leading-7 mb-4"
        >
          {renderInlineFormatting(line)}
        </p>
      );
    } else {
      // Empty line - just flush code blocks, spacing is handled by paragraph margins
      flushCodeBlock();
    }
  });

  // Flush any remaining code blocks, lists, or tables
  flushCodeBlock();
  flushList();
  flushTable();

  return (
    <div className="styled-text-content space-y-2">
      {elements}
    </div>
  );
}

