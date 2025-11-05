import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

// ============================================
// TYPES
// ============================================

interface TerminalLine {
  type: 'command' | 'output' | 'error';
  content: string;
}

interface TerminalProps {
  onCommand?: (command: string) => string | null;
  expectedCommand?: string | null;
}

// ============================================
// TERMINAL COMPONENT
// ============================================

export default function Terminal({ onCommand, expectedCommand }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'Welcome to CKAD Training Terminal' },
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

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setLines(prev => [...prev, { type: 'command', content: `$ ${trimmedCmd}` }]);
    setHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    let output = '';

    if (onCommand) {
      const customOutput = onCommand(trimmedCmd);
      if (customOutput !== null) {
        output = customOutput;
      } else {
        output = processCommand(trimmedCmd);
      }
    } else {
      output = processCommand(trimmedCmd);
    }

    const outputLines = output.split('\n');
    setLines(prev => [
      ...prev,
      ...outputLines.map(line => ({
        type: (line.startsWith('Error:') ? 'error' : 'output') as 'output' | 'error',
        content: line
      }))
    ]);
  };

  const processCommand = (cmd: string): string => {
    const parts = cmd.split(' ');
    const command = parts[0];

    switch (command) {
      case 'help':
        return `Available commands:
  kubectl - Kubernetes CLI tool
  clear - Clear terminal
  help - Show this help message

Try kubectl commands like:
  kubectl get pods
  kubectl get deployments
  kubectl get services`;

      case 'clear':
        setLines([]);
        return '';

      case 'kubectl':
        return handleKubectlCommand(parts.slice(1));

      default:
        return `Error: command not found: ${command}`;
    }
  };

  const handleKubectlCommand = (args: string[]): string => {
    if (args.length === 0) {
      return 'kubectl controls the Kubernetes cluster manager.\nUse "kubectl help" for more information.';
    }

    const action = args[0];
    const resource = args[1];

    switch (action) {
      case 'get':
        if (!resource) {
          return 'Error: resource type required';
        }
        return getMockResources(resource);

      case 'run':
        const podName = args.find((_, i) => args[i - 1] !== '--image' && i > 0) || 'pod';
        return `pod/${podName} created`;

      case 'create':
        if (resource === 'deployment') {
          return `deployment.apps/webapp created`;
        }
        if (resource === 'configmap') {
          return `configmap/app-config created`;
        }
        if (resource === 'secret') {
          return `secret/db-pass created`;
        }
        return `${resource} created`;

      case 'expose':
        return `service/webapp exposed`;

      case 'scale':
        return `deployment.apps/webapp scaled`;

      case 'describe':
        return `Name:         ${args[2] || 'resource'}
Namespace:    default
Status:       Running
...`;

      case 'delete':
        return `${resource}/${args[2] || 'resource'} deleted`;

      case 'rollout':
        if (args[1] === 'status') {
          return `deployment "${args[2]?.split('/')[1] || 'deployment'}" successfully rolled out`;
        }
        return `Error: unknown rollout command "${args[1]}"`;

      default:
        return `Error: unknown command "${action}"`;
    }
  };

  const getMockResources = (resourceType: string): string => {
    const resources: Record<string, string> = {
      'pods': `NAME          READY   STATUS    RESTARTS   AGE
nginx-pod     1/1     Running   0          2m
webapp-abc    1/1     Running   0          5m`,
      'pod': `NAME          READY   STATUS    RESTARTS   AGE
nginx-pod     1/1     Running   0          2m
webapp-abc    1/1     Running   0          5m`,
      'deployments': `NAME     READY   UP-TO-DATE   AVAILABLE   AGE
webapp   3/3     3            3           10m`,
      'deployment': `NAME     READY   UP-TO-DATE   AVAILABLE   AGE
webapp   3/3     3            3           10m`,
      'services': `NAME         TYPE        CLUSTER-IP      PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1       443/TCP   30d
webapp       ClusterIP   10.100.200.50   80/TCP    5m`,
      'svc': `NAME         TYPE        CLUSTER-IP      PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1       443/TCP   30d
webapp       ClusterIP   10.100.200.50   80/TCP    5m`,
      'configmaps': `NAME         DATA   AGE
app-config   1      2m`,
      'cm': `NAME         DATA   AGE
app-config   1      2m`,
      'secrets': `NAME      TYPE     DATA   AGE
db-pass   Opaque   1      1m`,
    };

    return resources[resourceType] || `No resources found in default namespace.`;
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
