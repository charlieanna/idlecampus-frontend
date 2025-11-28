import React from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Renders markdown content with proper styling
 * Replaces ReactMarkdown with custom styled rendering
 */
export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  // Handle undefined/null content gracefully
  if (!content) {
    return <div className={className}>No content available</div>;
  }

  // Simple markdown parser that converts to styled HTML
  const parseMarkdown = (text: string): React.ReactNode => {
    if (!text || typeof text !== 'string') {
      return <div>No content available</div>;
    }
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLanguage = '';

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(' ');
        if (paragraphText.trim()) {
          elements.push(
            <p key={elements.length} className="mb-4 text-gray-700 leading-relaxed">
              {parseInlineMarkdown(paragraphText)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    lines.forEach((line, index) => {
      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <pre
              key={elements.length}
              className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm"
            >
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          // Start code block
          flushParagraph();
          codeBlockLanguage = line.substring(3).trim();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        flushParagraph();
        elements.push(
          <h1 key={elements.length} className="text-3xl font-bold mb-4 mt-6 text-gray-900">
            {parseInlineMarkdown(line.substring(2))}
          </h1>
        );
        return;
      }
      if (line.startsWith('## ')) {
        flushParagraph();
        elements.push(
          <h2 key={elements.length} className="text-2xl font-bold mb-3 mt-5 text-gray-900">
            {parseInlineMarkdown(line.substring(3))}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        flushParagraph();
        elements.push(
          <h3 key={elements.length} className="text-xl font-semibold mb-2 mt-4 text-gray-900">
            {parseInlineMarkdown(line.substring(4))}
          </h3>
        );
        return;
      }
      if (line.startsWith('#### ')) {
        flushParagraph();
        elements.push(
          <h4 key={elements.length} className="text-lg font-semibold mb-2 mt-3 text-gray-900">
            {parseInlineMarkdown(line.substring(5))}
          </h4>
        );
        return;
      }

      // Lists
      if (line.match(/^[-*]\s/)) {
        flushParagraph();
        const listItem = line.substring(2);
        elements.push(
          <li key={elements.length} className="mb-2 text-gray-700">
            {parseInlineMarkdown(listItem)}
          </li>
        );
        return;
      }

      // Numbered lists
      if (line.match(/^\d+\.\s/)) {
        flushParagraph();
        const listItem = line.replace(/^\d+\.\s/, '');
        elements.push(
          <li key={elements.length} className="mb-2 text-gray-700">
            {parseInlineMarkdown(listItem)}
          </li>
        );
        return;
      }

      // Horizontal rule
      if (line.trim() === '---' || line.trim() === '***') {
        flushParagraph();
        elements.push(<hr key={elements.length} className="my-6 border-gray-300" />);
        return;
      }

      // Empty line
      if (line.trim() === '') {
        flushParagraph();
        return;
      }

      // Regular paragraph
      currentParagraph.push(line);
    });

    flushParagraph();

    return <>{elements}</>;
  };

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;

    // Bold **text**
    const boldRegex = /\*\*(.+?)\*\*/g;
    // Italic *text*
    const italicRegex = /\*(.+?)\*/g;
    // Inline code `code`
    const codeRegex = /`(.+?)`/g;
    // Links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    // Combine all regex patterns
    const allMatches: Array<{
      index: number;
      length: number;
      type: 'bold' | 'italic' | 'code' | 'link';
      content: string;
      url?: string;
    }> = [];

    let match;
    while ((match = boldRegex.exec(text)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        type: 'bold',
        content: match[1],
      });
    }
    while ((match = italicRegex.exec(text)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        type: 'italic',
        content: match[1],
      });
    }
    while ((match = codeRegex.exec(text)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        type: 'code',
        content: match[1],
      });
    }
    while ((match = linkRegex.exec(text)) !== null) {
      allMatches.push({
        index: match.index,
        length: match[0].length,
        type: 'link',
        content: match[1],
        url: match[2],
      });
    }

    // Sort by index
    allMatches.sort((a, b) => a.index - b.index);

    allMatches.forEach((match, idx) => {
      // Add text before match
      if (match.index > currentIndex) {
        parts.push(text.substring(currentIndex, match.index));
      }

      // Add matched content
      switch (match.type) {
        case 'bold':
          parts.push(
            <strong key={`bold-${idx}`} className="font-bold text-gray-900">
              {match.content}
            </strong>
          );
          break;
        case 'italic':
          parts.push(
            <em key={`italic-${idx}`} className="italic text-gray-800">
              {match.content}
            </em>
          );
          break;
        case 'code':
          parts.push(
            <code
              key={`code-${idx}`}
              className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
            >
              {match.content}
            </code>
          );
          break;
        case 'link':
          parts.push(
            <a
              key={`link-${idx}`}
              href={match.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {match.content}
            </a>
          );
          break;
      }

      currentIndex = match.index + match.length;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.substring(currentIndex));
    }

    return parts.length > 0 ? <>{parts}</> : text;
  };

  return (
    <div className={`markdown-content ${className}`}>
      {parseMarkdown(content)}
    </div>
  );
}

