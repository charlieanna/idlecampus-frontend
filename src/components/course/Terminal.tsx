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
  trackMastery?: boolean;
  currentChapter?: string;
  currentContext?: 'practice' | 'quiz' | 'lab';
}

// ============================================
// TERMINAL COMPONENT
// ============================================

export function Terminal({
  onCommand,
  expectedCommand,
  trackMastery = false,
  currentChapter,
  currentContext = 'practice'
}: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to Interactive Terminal' },
    { type: 'output', content: 'Type commands to practice. Use "clear" or Ctrl+L to clear screen.' },
    { type: 'output', content: '' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [attemptCount, setAttemptCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [commandAttempts, setCommandAttempts] = useState<Map<string, number>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Track command attempt via API
  const trackCommandAttempt = async (command: string, success: boolean, timeTaken: number) => {
    if (!trackMastery) return;

    const normalizedCommand = command.trim().toLowerCase();
    const currentAttempts = commandAttempts.get(normalizedCommand) || 0;

    try {
      const response = await fetch('/api/mastery/track_attempt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: command,
          success: success,
          context: currentContext,
          time_taken: timeTaken,
          attempt_number: currentAttempts + 1,
          expected_command: expectedCommand,
          chapter: currentChapter
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.mastery) {
          // Update attempt count
          setCommandAttempts(prev => new Map(prev).set(normalizedCommand, currentAttempts + 1));

          // Show mastery feedback if achieved or needs practice
          if (data.mastery.mastered) {
            setLines(prev => [...prev, {
              type: 'output',
              content: `✨ Command mastered! (${data.mastery.proficiency_score}% proficiency)`
            }]);
          } else if (data.mastery.needs_review) {
            setLines(prev => [...prev, {
              type: 'output',
              content: `💡 This command needs more practice (${data.mastery.current_score}%)`
            }]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to track command attempt:', error);
    }
  };

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Track start time
    const commandStartTime = Date.now();

    // Handle clear command
    if (trimmedCmd === 'clear') {
      setLines([
        { type: 'output', content: 'Welcome to Interactive Terminal' },
        { type: 'output', content: 'Type commands to practice. Use "clear" or Ctrl+L to clear screen.' },
        { type: 'output', content: '' }
      ]);
      setHistory(prev => [...prev, trimmedCmd]);
      setHistoryIndex(-1);
      return;
    }

    setLines(prev => [...prev, { type: 'command', content: `$ ${trimmedCmd}` }]);
    setHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // If onCommand handler is provided (for validation), get validation result
    if (onCommand) {
      const customOutput = onCommand(trimmedCmd);
      if (customOutput !== null) {
        // If validation failed (starts with ✗), show error and don't execute
        if (customOutput.startsWith('✗')) {
          const outputLines = customOutput.split('\n');
          setLines(prev => [
            ...prev,
            ...outputLines.map(line => ({
              type: 'error' as const,
              content: line
            }))
          ]);

          // Track failed attempt
          const timeTaken = Date.now() - commandStartTime;
          await trackCommandAttempt(trimmedCmd, false, timeTaken);
          return;
        }
      }
    }

    // Execute real Docker command via API
    const commandOutput = await executeDockerCommand(trimmedCmd);
    const isError = commandOutput.startsWith('Error:') || commandOutput.includes('error') || commandOutput.includes('command not found');

    // Show command output only (no validation messages)
    const outputLines = commandOutput.split('\n');
    setLines(prev => [
      ...prev,
      ...outputLines.map(line => ({
        type: (line.startsWith('Error:') || line.includes('error') ? 'error' : 'output') as 'output' | 'error',
        content: line
      }))
    ]);

    // Track attempt (success if no error)
    const timeTaken = Date.now() - commandStartTime;
    await trackCommandAttempt(trimmedCmd, !isError, timeTaken);
  };

  const executeDockerCommand = async (cmd: string): Promise<string> => {
    const trimmed = cmd.trim();
    const parts = trimmed.split(/\s+/);
    const baseCmd = parts[0];

    // Mock output for common Linux commands
    const linuxCommands: Record<string, string> = {
      'whoami': 'user',
      'date': new Date().toString(),
      'pwd': '/home/user',
      'ls': 'Desktop  Documents  Downloads  Pictures  Videos',
      'hostname': 'linux-training',
      'uname': 'Linux',
      'uname -a': 'Linux linux-training 5.15.0-generic #1 SMP x86_64 GNU/Linux',
      'echo hello': 'hello',
      'cat /etc/os-release': 'NAME="Ubuntu"\nVERSION="20.04 LTS"',
    };

    // Handle ls with flags
    if (baseCmd === 'ls') {
      const flags = parts.slice(1).filter(p => p.startsWith('-')).join('');
      if (flags.includes('l') && flags.includes('a')) {
        return `total 40
drwxr-xr-x  8 user user 4096 Dec 20 10:00 .
drwxr-xr-x  3 root root 4096 Dec 15 09:00 ..
-rw-------  1 user user  256 Dec 20 09:45 .bash_history
-rw-r--r--  1 user user  220 Dec 15 09:00 .bash_logout
-rw-r--r--  1 user user 3771 Dec 15 09:00 .bashrc
drwxr-xr-x  2 user user 4096 Dec 18 14:30 Desktop
drwxr-xr-x  2 user user 4096 Dec 19 11:20 Documents
drwxr-xr-x  2 user user 4096 Dec 17 16:45 Downloads
drwxr-xr-x  2 user user 4096 Dec 16 10:15 Pictures
drwxr-xr-x  2 user user 4096 Dec 15 09:30 Videos`;
      } else if (flags.includes('l')) {
        return `total 20
drwxr-xr-x  2 user user 4096 Dec 18 14:30 Desktop
drwxr-xr-x  2 user user 4096 Dec 19 11:20 Documents
drwxr-xr-x  2 user user 4096 Dec 17 16:45 Downloads
drwxr-xr-x  2 user user 4096 Dec 16 10:15 Pictures
drwxr-xr-x  2 user user 4096 Dec 15 09:30 Videos`;
      } else if (flags.includes('a')) {
        return `.  ..  .bash_history  .bash_logout  .bashrc  Desktop  Documents  Downloads  Pictures  Videos`;
      } else if (flags.includes('h')) {
        return `total 20K
drwxr-xr-x  2 user user 4.0K Dec 18 14:30 Desktop
drwxr-xr-x  2 user user 4.0K Dec 19 11:20 Documents
drwxr-xr-x  2 user user 4.0K Dec 17 16:45 Downloads
drwxr-xr-x  2 user user 4.0K Dec 16 10:15 Pictures
drwxr-xr-x  2 user user 4.0K Dec 15 09:30 Videos`;
      }
      return 'Desktop  Documents  Downloads  Pictures  Videos';
    }

    // Handle cd command
    if (baseCmd === 'cd') {
      const target = parts[1] || '~';
      if (target === '~' || target === '') {
        return ''; // cd to home - silent success
      } else if (target === '..') {
        return ''; // cd to parent - silent success
      } else if (target === '-') {
        return '/home/user'; // cd to previous directory
      } else if (target.startsWith('/')) {
        return ''; // absolute path - silent success
      }
      return ''; // relative path - silent success
    }

    // Handle echo with any argument
    if (baseCmd === 'echo') {
      return parts.slice(1).join(' ') || '';
    }

    // Check if it's a known Linux command
    const mockOutput = linuxCommands[trimmed];
    if (mockOutput) {
      return mockOutput;
    }

    // Try Docker API for docker commands
    if (cmd.trim().startsWith('docker')) {
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
    }

    // Command not found - check for typos and suggest corrections
    const commandName = parts[0];
    const knownCommands = ['ls', 'cd', 'pwd', 'whoami', 'date', 'echo', 'cat', 'hostname', 'uname', 'mkdir', 'rm', 'cp', 'mv', 'touch', 'head', 'tail', 'grep', 'find'];

    // Find similar commands using simple string distance
    const suggestions = knownCommands.filter(known => {
      // Check if it's a close match (off by 1-2 characters)
      if (Math.abs(known.length - commandName.length) > 2) return false;

      let differences = 0;
      for (let i = 0; i < Math.max(known.length, commandName.length); i++) {
        if (known[i] !== commandName[i]) differences++;
      }
      return differences <= 2;
    });

    if (suggestions.length > 0) {
      return `bash: ${commandName}: command not found\n\nDid you mean: ${suggestions[0]}?`;
    }

    return `bash: ${commandName}: command not found`;
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+L to clear terminal (common terminal shortcut)
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      handleClear();
      return;
    }

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
    setLines([
      { type: 'output', content: 'Welcome to Interactive Terminal' },
      { type: 'output', content: 'Type commands to practice. Use "clear" or Ctrl+L to clear screen.' },
      { type: 'output', content: '' }
    ]);
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
