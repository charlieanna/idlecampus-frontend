import React from 'react';

// Markdown renderer for styled content
export function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let currentList: string[] = [];
  let isNumberedList = false;
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let codeLanguage = '';
  let skipSection = false; // Track if we're in a section to skip

  const flushList = () => {
    if (currentList.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol key={`list-${elements.length}`} className="list-decimal list-inside space-y-1 ml-6 mb-3">
            {currentList.map((item, i) => (
              <li key={i} className="text-slate-700 text-sm">{item}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 ml-6 mb-3">
            {currentList.map((item, i) => (
              <li key={i} className="text-slate-700 text-sm">{item}</li>
            ))}
          </ul>
        );
      }
      currentList = [];
      isNumberedList = false;
    }
  };

  const flushCodeBlock = () => {
    if (codeLines.length > 0) {
      elements.push(
        <pre key={`code-${elements.length}`} className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4 border border-slate-700">
          <code className="text-sm font-mono">{codeLines.join('\n')}</code>
        </pre>
      );
      codeLines = [];
      codeLanguage = '';
    }
  };

  lines.forEach((line, i) => {
    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
        codeLanguage = line.trim().replace(/```/g, '').trim();
      }
      // If we're skipping, don't process code blocks
      if (skipSection) {
        return;
      }
      return;
    }

    if (inCodeBlock) {
      // If we're skipping, don't add to code block
      if (!skipSection) {
        codeLines.push(line);
      }
      return;
    }

    // Handle lists
    if (line.trim().match(/^\d+\.\s/)) {
      if (!skipSection) {
        const listItem = line.replace(/^\d+\.\s/, '');
        if (currentList.length === 0) {
          isNumberedList = true;
        }
        currentList.push(listItem);
      }
      return;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!skipSection) {
        const listItem = line.replace(/^[-*]\s/, '');
        if (currentList.length === 0) {
          isNumberedList = false;
        }
        currentList.push(listItem);
      }
      return;
    }
    
    flushList();

    // Handle headers
    if (line.startsWith('# ')) {
      const headerText = line.substring(2);
      // Check if this is a section we should skip
      if (headerText.includes('Test Cases First') || headerText.includes('BEDTIME')) {
        skipSection = true;
        return; // Skip this header and all content until next major section
      }
      // If we hit a major section header, stop skipping
      if (headerText.includes('Function Signature') || 
          headerText.includes('Examples') || 
          headerText.includes('Constraints') ||
          headerText.includes('Your Task')) {
        skipSection = false;
      }
      if (!skipSection) {
        elements.push(<h1 key={i} className="text-2xl font-bold text-slate-900 mt-6 mb-4">{headerText}</h1>);
      }
    } else if (line.startsWith('## ')) {
      const headerText = line.substring(3);
      // Check if this is a section we should skip
      if (headerText.includes('Test Cases First') || headerText.includes('BEDTIME')) {
        skipSection = true;
        return; // Skip this header and all content until next major section
      }
      // If we hit a major section header, stop skipping
      if (headerText.includes('Function Signature') || 
          headerText.includes('Examples') || 
          headerText.includes('Constraints') ||
          headerText.includes('Your Task')) {
        skipSection = false;
      }
      if (!skipSection) {
        elements.push(<h2 key={i} className="text-xl font-semibold text-slate-900 mt-5 mb-3">{headerText}</h2>);
      }
    } else if (line.startsWith('### ')) {
      const headerText = line.substring(4);
      // Check if this is a section we should skip
      if (headerText.includes('Test Cases First') || headerText.includes('BEDTIME')) {
        skipSection = true;
        return;
      }
      // If we hit a major section header, stop skipping
      if (headerText.includes('Function Signature') || 
          headerText.includes('Examples') || 
          headerText.includes('Constraints') ||
          headerText.includes('Your Task')) {
        skipSection = false;
      }
      if (!skipSection) {
        elements.push(<h3 key={i} className="text-lg font-semibold text-slate-900 mt-4 mb-2">{headerText}</h3>);
      }
    } else if (line.trim() && !skipSection) {
      // Skip lines that mention BEDTIME or "Before coding" in the context of test cases
      const lineLower = line.toLowerCase();
      if (lineLower.includes('bedtime') || 
          (lineLower.includes('before coding') && (lineLower.includes('test') || lineLower.includes('bedtime')))) {
        return; // Skip this line
      }
      
      // Handle inline code and bold
      const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
      const rendered = parts.map((part, idx) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={idx} className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-xs font-mono border border-slate-200">{part.slice(1, -1)}</code>;
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      elements.push(<p key={i} className="text-base text-slate-700 leading-7 mb-3">{rendered}</p>);
    }
  });

  flushList();
  flushCodeBlock();
  return elements;
}

