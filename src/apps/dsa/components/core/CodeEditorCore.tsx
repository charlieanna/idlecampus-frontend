import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorCoreProps {
  code: string;
  language: 'javascript' | 'python';
  readOnly: boolean;
  onChange: (value: string) => void;
  height: string;
}

export const CodeEditorCore: React.FC<CodeEditorCoreProps> = ({
  code,
  language,
  readOnly,
  onChange,
  height,
}) => {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle editor mount
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    // Force layout after mount with multiple delays to handle async container sizing
    const layoutEditor = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };
    // Layout immediately, then again after short delays
    layoutEditor();
    setTimeout(layoutEditor, 100);
    setTimeout(layoutEditor, 300);
    setTimeout(layoutEditor, 500);
    setTimeout(layoutEditor, 1000);
  };

  // Only update layout on window resize (not on every container change)
  useEffect(() => {
    const handleWindowResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden" style={{ 
      minWidth: 0, 
      width: '100%', 
      flexShrink: 1,
      flexGrow: 0,
      minHeight: '200px',
      height,
    }}>
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={code}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: false,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          readOnly: readOnly,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
};

