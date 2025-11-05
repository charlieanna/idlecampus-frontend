import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

// ============================================
// TYPES
// ============================================

interface TerminalLine {
  type: 'command' | 'output' | 'error';
  content: string;
}

export interface TerminalProps {
  onCommand?: (command: string) => string | null;
  expectedCommand?: string | null;
}

// ============================================
// TERMINAL COMPONENT
// ============================================

export function Terminal({ onCommand, expectedCommand }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to Docker Training Terminal' },
    { type: 'output', content: 'Type "help" for available commands' },
    { type: 'output', content: '' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setLines(prev => [...prev, { type: 'command', content: `$ ${trimmedCmd}` }]);
    setHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    let validationOutput = '';

    // If onCommand handler is provided (for validation), get validation result
    if (onCommand) {
      const customOutput = onCommand(trimmedCmd);
      if (customOutput !== null) {
        validationOutput = customOutput;
        // If validation failed (starts with ✗), show error and don't execute
        if (validationOutput.startsWith('✗')) {
          const outputLines = validationOutput.split('\n');
          setLines(prev => [
            ...prev,
            ...outputLines.map(line => ({
              type: 'error' as const,
              content: line
            }))
          ]);
          return;
        }
      }
    }

    // Execute real Docker command via API
    const dockerOutput = await executeDockerCommand(trimmedCmd);

    // Show validation success message first, then Docker output
    const allOutput = validationOutput
      ? `${validationOutput}\n\n--- Docker Output ---\n${dockerOutput}`
      : dockerOutput;

    const outputLines = allOutput.split('\n');
    setLines(prev => [
      ...prev,
      ...outputLines.map(line => ({
        type: (line.startsWith('Error:') || line.includes('error') ? 'error' : 'output') as 'output' | 'error',
        content: line
      }))
    ]);
  };

  const executeDockerCommand = async (cmd: string): Promise<string> => {
    try {
      const response = await fetch('/api/v1/docker/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: cmd }),
      });

      if (!response.ok) {
        return `Error: Failed to execute command (${response.status})`;
      }

      const data = await response.json();

      if (data.success) {
        return data.output || 'Command executed successfully';
      } else {
        return data.error || 'Command execution failed';
      }
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Failed to connect to server'}`;
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setCurrentInput(history[newIndex]);
      }
    }
  };

  const handleClear = () => {
    setLines([]);
    setCurrentInput('');
  };

  return (
    <Card className="flex flex-col bg-slate-900 border-slate-700 h-full">
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-green-400" />
          <span className="text-green-400">Terminal</span>
          {expectedCommand && (
            <Badge className="bg-blue-600 text-white text-xs ml-2">
              Waiting for command
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={handleClear}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, index) => (
          <div
            key={index}
            className={
              line.type === 'command'
                ? 'text-green-400'
                : line.type === 'error'
                ? 'text-red-400'
                : 'text-slate-300'
            }
          >
            {line.content}
          </div>
        ))}

        <div className="flex items-center gap-2 mt-1">
          <span className="text-green-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-slate-300 font-mono"
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </Card>
  );
}
