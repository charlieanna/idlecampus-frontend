import { useState, useRef, useEffect } from 'react';
import { Box, Layers, Network, FileKey, CheckCircle, Circle, Lock, ClipboardCheck, GripVertical, Terminal as TerminalIcon, Copy, Check, CheckCircle2, X, Lightbulb, Code, XCircle, AlertCircle, Trophy, RotateCcw } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { ScrollArea } from './components/ui/scroll-area';
import { Alert, AlertDescription } from './components/ui/alert';
import { Progress } from './components/ui/progress';

// ============================================
// TYPES
// ============================================

interface Command {
  command: string;
  description: string;
  example: string;
}

type LessonItem = 
  | { type: 'content'; markdown: string }
  | { type: 'command'; command: Command };

interface Lesson {
  id: string;
  title: string;
  items: LessonItem[];
  content?: string;
  commands?: Command[];
}

interface Task {
  id: string;
  description: string;
  hint: string;
  validation: (command: string) => boolean;
  solution: string;
}

interface Lab {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}

type QuizQuestion = 
  | {
      id: string;
      type: 'mcq';
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }
  | {
      id: string;
      type: 'command';
      question: string;
      expectedCommand: string;
      hint: string;
      explanation: string;
    };

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

interface Module {
  id: string;
  title: string;
  icon: string;
  lessons: Lesson[];
  labs: Lab[];
  quizzes?: Quiz[];
}

// ============================================
// COURSE DATA
// ============================================

const courseModules: Module[] = [
  {
    id: 'pods',
    title: 'Pods',
    icon: 'box',
    lessons: [
      {
        id: 'pods-intro',
        title: 'Introduction to Pods',
        items: [
          {
            type: 'content',
            markdown: `# Introduction to Pods

Pods are the smallest deployable units in Kubernetes. A Pod represents a single instance of a running process in your cluster.

## Key Concepts:
- A Pod can contain one or more containers
- Containers in a Pod share the same network namespace
- Pods are ephemeral - they can be created and destroyed
- Each Pod gets its own IP address

Let's start by creating a simple pod using the nginx image.`
          },
          {
            type: 'command',
            command: {
              command: 'kubectl run',
              description: 'Create and run a pod',
              example: 'kubectl run nginx --image=nginx'
            }
          },
          {
            type: 'content',
            markdown: `Great! Now that you've created a pod, let's learn how to view it.

The **kubectl get pods** command lists all pods in the current namespace. The **-o wide** flag provides additional details like the node the pod is running on and its IP address.`
          },
          {
            type: 'command',
            command: {
              command: 'kubectl get pods',
              description: 'List all pods',
              example: 'kubectl get pods -o wide'
            }
          },
          {
            type: 'content',
            markdown: `## Pod Lifecycle

Pods go through several lifecycle phases:

1. **Pending**: Pod has been accepted but containers are not running yet
2. **Running**: Pod is bound to a node and all containers are created
3. **Succeeded**: All containers have terminated successfully
4. **Failed**: All containers have terminated, and at least one failed
5. **Unknown**: State cannot be determined

To see detailed information about a pod's state, events, and configuration, use the **describe** command.`
          },
          {
            type: 'command',
            command: {
              command: 'kubectl describe pod',
              description: 'Show detailed information about a pod',
              example: 'kubectl describe pod nginx'
            }
          },
          {
            type: 'content',
            markdown: `## Cleaning Up

When you're done with a pod, you should delete it to free up resources. Kubernetes will terminate all containers in the pod and remove it from the cluster.`
          },
          {
            type: 'command',
            command: {
              command: 'kubectl delete pod',
              description: 'Delete a pod',
              example: 'kubectl delete pod nginx'
            }
          }
        ]
      }
    ],
    labs: [
      {
        id: 'pods-lab-1',
        title: 'Create and Manage Pods',
        description: 'Practice creating, viewing, and managing pods',
        tasks: [
          {
            id: 'task-1',
            description: 'Create a pod named "nginx-pod" using the nginx image',
            hint: 'Use kubectl run command with --image flag',
            validation: (cmd) => cmd.includes('kubectl run') && cmd.includes('nginx-pod') && cmd.includes('nginx'),
            solution: 'kubectl run nginx-pod --image=nginx'
          },
          {
            id: 'task-2',
            description: 'List all pods in the current namespace',
            hint: 'Use kubectl get pods',
            validation: (cmd) => cmd.includes('kubectl get') && cmd.includes('pod'),
            solution: 'kubectl get pods'
          },
          {
            id: 'task-3',
            description: 'Get detailed information about the nginx-pod',
            hint: 'Use kubectl describe pod',
            validation: (cmd) => cmd.includes('kubectl describe pod') && cmd.includes('nginx-pod'),
            solution: 'kubectl describe pod nginx-pod'
          }
        ]
      }
    ],
    quizzes: [
      {
        id: 'pods-quiz',
        title: 'Pods Knowledge Check',
        description: 'Test your understanding of Kubernetes Pods and basic kubectl commands. Mix of theory and practical questions.',
        questions: [
          {
            id: 'q1',
            type: 'mcq',
            question: 'What is the smallest deployable unit in Kubernetes?',
            options: [
              'Container',
              'Pod',
              'Deployment',
              'Service'
            ],
            correctAnswer: 1,
            explanation: 'A Pod is the smallest deployable unit in Kubernetes. It can contain one or more containers that share the same network namespace.'
          },
          {
            id: 'q2',
            type: 'command',
            question: 'Create a pod named "test-pod" using the nginx image.',
            expectedCommand: 'kubectl run test-pod --image=nginx',
            hint: 'Use the kubectl run command with the --image flag',
            explanation: 'The "kubectl run" command is used to create and run a pod. The syntax is: kubectl run [pod-name] --image=[image-name]'
          },
          {
            id: 'q3',
            type: 'mcq',
            question: 'What flag can you add to "kubectl get pods" to see additional details like node and IP address?',
            options: [
              '-v',
              '--details',
              '-o wide',
              '--show-all'
            ],
            correctAnswer: 2,
            explanation: 'The "-o wide" flag provides additional columns including the node the pod is running on and its IP address.'
          },
          {
            id: 'q4',
            type: 'command',
            question: 'Get detailed information about a pod named "test-pod".',
            expectedCommand: 'kubectl describe pod test-pod',
            hint: 'Use kubectl describe pod followed by the pod name',
            explanation: 'The "kubectl describe pod" command shows detailed information including events, configuration, status, and conditions.'
          },
          {
            id: 'q5',
            type: 'command',
            question: 'List all pods in wide output format to see additional details.',
            expectedCommand: 'kubectl get pods -o wide',
            hint: 'Use kubectl get pods with the -o wide flag',
            explanation: 'The "kubectl get pods -o wide" command lists all pods with additional information like IP address and node.'
          }
        ]
      }
    ]
  },
  {
    id: 'deployments',
    title: 'Deployments',
    icon: 'layers',
    lessons: [
      {
        id: 'deployments-intro',
        title: 'Introduction to Deployments',
        content: `# Introduction to Deployments

Deployments provide declarative updates for Pods and ReplicaSets. They are the recommended way to manage stateless applications.

## Key Features:
- **Rolling Updates**: Update pods gradually without downtime
- **Rollback**: Revert to previous versions if needed
- **Scaling**: Easily scale up or down
- **Self-healing**: Automatically replace failed pods

## Common Use Cases:
- Deploy a web application
- Update application versions
- Scale applications based on load
- Rollback problematic releases

## Deployment Strategies:
- **Recreate**: Terminate all old pods, then create new ones
- **RollingUpdate**: Gradually replace old pods with new ones (default)`,
        commands: [
          {
            command: 'kubectl create deployment',
            description: 'Create a deployment',
            example: 'kubectl create deployment nginx --image=nginx --replicas=3'
          },
          {
            command: 'kubectl get deployments',
            description: 'List deployments',
            example: 'kubectl get deployments'
          },
          {
            command: 'kubectl scale deployment',
            description: 'Scale a deployment',
            example: 'kubectl scale deployment nginx --replicas=5'
          },
          {
            command: 'kubectl rollout status',
            description: 'Check rollout status',
            example: 'kubectl rollout status deployment/nginx'
          }
        ],
        items: []
      }
    ],
    labs: [
      {
        id: 'deployments-lab-1',
        title: 'Working with Deployments',
        description: 'Create and scale deployments',
        tasks: [
          {
            id: 'task-1',
            description: 'Create a deployment named "webapp" with nginx image and 3 replicas',
            hint: 'Use kubectl create deployment with --replicas flag',
            validation: (cmd) => cmd.includes('kubectl create deployment') && cmd.includes('webapp') && cmd.includes('replicas=3'),
            solution: 'kubectl create deployment webapp --image=nginx --replicas=3'
          },
          {
            id: 'task-2',
            description: 'Scale the webapp deployment to 5 replicas',
            hint: 'Use kubectl scale deployment',
            validation: (cmd) => cmd.includes('kubectl scale') && cmd.includes('webapp') && cmd.includes('replicas=5'),
            solution: 'kubectl scale deployment webapp --replicas=5'
          }
        ]
      }
    ],
    quizzes: []
  },
  {
    id: 'services',
    title: 'Services',
    icon: 'network',
    lessons: [
      {
        id: 'services-intro',
        title: 'Introduction to Services',
        content: `# Introduction to Services

Services provide stable network endpoints for accessing pods. They enable load balancing and service discovery.

## Service Types:

### ClusterIP (Default)
- Exposes service on cluster-internal IP
- Only accessible within the cluster
- Use for internal communication

### NodePort
- Exposes service on each Node's IP at a static port
- Accessible from outside cluster using NodeIP:NodePort
- Port range: 30000-32767

### LoadBalancer
- Creates an external load balancer
- Requires cloud provider support
- Gets external IP address

### ExternalName
- Maps service to DNS name
- No proxying, returns CNAME record

## Selectors:
Services use labels to select pods they route traffic to.`,
        commands: [
          {
            command: 'kubectl expose',
            description: 'Expose a resource as a service',
            example: 'kubectl expose deployment nginx --port=80 --type=NodePort'
          },
          {
            command: 'kubectl get services',
            description: 'List services',
            example: 'kubectl get svc'
          },
          {
            command: 'kubectl describe service',
            description: 'Describe a service',
            example: 'kubectl describe svc nginx'
          }
        ],
        items: []
      }
    ],
    labs: [
      {
        id: 'services-lab-1',
        title: 'Exposing Applications',
        description: 'Create services to expose deployments',
        tasks: [
          {
            id: 'task-1',
            description: 'Expose the webapp deployment on port 80 as a ClusterIP service',
            hint: 'Use kubectl expose deployment',
            validation: (cmd) => cmd.includes('kubectl expose') && cmd.includes('webapp') && cmd.includes('port'),
            solution: 'kubectl expose deployment webapp --port=80'
          }
        ]
      }
    ],
    quizzes: []
  },
  {
    id: 'configmaps',
    title: 'ConfigMaps & Secrets',
    icon: 'file-key',
    lessons: [
      {
        id: 'configmaps-intro',
        title: 'ConfigMaps and Secrets',
        content: `# ConfigMaps and Secrets

ConfigMaps and Secrets allow you to decouple configuration from container images.

## ConfigMaps
Store non-sensitive configuration data as key-value pairs.

**Use Cases:**
- Application configuration files
- Environment variables
- Command-line arguments

**Creation Methods:**
- From literal values
- From files
- From directories

## Secrets
Store sensitive data like passwords, tokens, and keys.

**Types:**
- **Opaque**: Arbitrary user-defined data
- **kubernetes.io/dockerconfigjson**: Docker registry credentials
- **kubernetes.io/tls**: TLS certificates

**Best Practices:**
- Enable encryption at rest
- Use RBAC to limit access
- Rotate secrets regularly`,
        commands: [
          {
            command: 'kubectl create configmap',
            description: 'Create a ConfigMap',
            example: 'kubectl create configmap app-config --from-literal=key=value'
          },
          {
            command: 'kubectl create secret',
            description: 'Create a Secret',
            example: 'kubectl create secret generic db-pass --from-literal=password=mypass'
          },
          {
            command: 'kubectl get configmaps',
            description: 'List ConfigMaps',
            example: 'kubectl get cm'
          }
        ],
        items: []
      }
    ],
    labs: [
      {
        id: 'configmaps-lab-1',
        title: 'Working with Configuration',
        description: 'Create and use ConfigMaps and Secrets',
        tasks: [
          {
            id: 'task-1',
            description: 'Create a ConfigMap named "app-config" with key "env" and value "production"',
            hint: 'Use kubectl create configmap with --from-literal',
            validation: (cmd) => cmd.includes('kubectl create configmap') && cmd.includes('app-config'),
            solution: 'kubectl create configmap app-config --from-literal=env=production'
          }
        ]
      }
    ],
    quizzes: []
  }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

// ============================================
// RESIZABLE COMPONENTS
// ============================================

function ResizablePanelGroup({ className = '', ...props }: any) {
  return (
    <ResizablePrimitive.PanelGroup
      className={cn('flex h-full w-full', className)}
      {...props}
    />
  );
}

function ResizablePanel(props: any) {
  return <ResizablePrimitive.Panel {...props} />;
}

function ResizableHandle({ withHandle, className = '', ...props }: any) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn(
        'relative flex w-px items-center justify-center bg-slate-200 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-slate-200 bg-slate-100">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  );
}

// ============================================
// TERMINAL COMPONENT
// ============================================

interface TerminalLine {
  type: 'command' | 'output' | 'error';
  content: string;
}

interface TerminalProps {
  onCommand?: (command: string) => string | null;
  expectedCommand?: string | null;
}

function Terminal({ onCommand, expectedCommand }: TerminalProps) {
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

// ============================================
// LESSON VIEWER COMPONENT (Part 1)
// ============================================

interface LessonViewerProps {
  lesson: Lesson;
  isCompleted: boolean;
  completedCommands: Set<string>;
  onGoToLab?: () => void;
}

function LessonViewer({ lesson, isCompleted, completedCommands, onGoToLab }: LessonViewerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const items: LessonItem[] = lesson.items || [
    { type: 'content', markdown: lesson.content || '' },
    ...(lesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
  ];

  const commandItems = items.filter(item => item.type === 'command');
  const totalCommands = commandItems.length;

  const getCurrentCommandIndex = () => {
    let commandIndex = 0;
    for (const item of items) {
      if (item.type === 'command') {
        const commandKey = `${lesson.id}-${commandIndex}`;
        if (!completedCommands.has(commandKey)) {
          return commandIndex;
        }
        commandIndex++;
      }
    }
    return -1;
  };

  const currentCommandIndex = getCurrentCommandIndex();

  const getVisibleItems = (): LessonItem[] => {
    if (currentCommandIndex === -1) {
      return items;
    }

    const visibleItems: LessonItem[] = [];
    let commandIndex = 0;

    for (const item of items) {
      if (item.type === 'content') {
        const isContentVisible = commandIndex <= currentCommandIndex;
        if (isContentVisible) {
          visibleItems.push(item);
        } else {
          break;
        }
      } else if (item.type === 'command') {
        if (commandIndex <= currentCommandIndex) {
          visibleItems.push(item);
        }
        commandIndex++;
      }
    }

    return visibleItems;
  };

  const visibleItems = getVisibleItems();
  const completedCount = commandItems.filter((_, i) => 
    completedCommands.has(`${lesson.id}-${i}`)
  ).length;

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 ml-4">
            {currentList.map((item, i) => (
              <li key={i} className="text-slate-700">{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, i) => {
      if (line.startsWith('- ') || line.startsWith('* ')) {
        currentList.push(line.substring(2));
        return;
      }
      
      flushList();

      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-slate-900 mt-6 mb-3">{line.substring(2)}</h1>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-slate-900 mt-5 mb-2">{line.substring(3)}</h2>);
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-slate-900 mt-4 mb-2">{line.substring(4)}</h3>);
      } else if (line.match(/^\d+\./)) {
        const match = line.match(/^(\d+)\.\s*\*\*(.+?)\*\*:\s*(.+)$/);
        if (match) {
          elements.push(
            <div key={i} className="flex gap-2 mb-2">
              <span className="text-blue-600">{match[1]}. {match[2]}:</span>
              <span className="text-slate-700">{match[3]}</span>
            </div>
          );
        } else {
          elements.push(<p key={i} className="text-slate-700">{line}</p>);
        }
      } else if (line.trim()) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const rendered = parts.map((part, idx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={idx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        elements.push(<p key={i} className="text-slate-700 mb-2">{rendered}</p>);
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl min-h-full pb-12">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-slate-900">{lesson.title}</h1>
            {isCompleted && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        <AnimatePresence mode="sync">
          <div className="space-y-6">
            {visibleItems.map((item, index) => {
              if (item.type === 'content') {
                return (
                  <motion.div
                    key={`content-${index}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="prose max-w-none"
                  >
                    {renderContent(item.markdown)}
                  </motion.div>
                );
              } else {
                let commandIndex = 0;
                for (let i = 0; i <= index; i++) {
                  if (items[i].type === 'command') {
                    if (i === index) break;
                    commandIndex++;
                  }
                }

                const cmd = item.command;
                const commandKey = `${lesson.id}-${commandIndex}`;
                const isCommandCompleted = completedCommands.has(commandKey);
                const isCurrentCommand = commandIndex === currentCommandIndex;

                return (
                  <motion.div
                    key={`command-${commandIndex}`}
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                      delay: 0.1
                    }}
                  >
                    <Card className={`p-4 transition-all duration-300 ${
                      isCurrentCommand 
                        ? 'bg-blue-50 border-blue-300 border-2 shadow-lg' 
                        : isCommandCompleted 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <code className={`px-2 py-1 rounded ${
                              isCurrentCommand ? 'text-blue-700 bg-blue-100' : 'text-blue-600 bg-blue-50'
                            }`}>
                              {cmd.command}
                            </code>
                            {isCommandCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                            {isCurrentCommand && (
                              <Badge className="bg-blue-600 animate-pulse">Practice this</Badge>
                            )}
                          </div>
                          <p className={`text-sm mb-3 ${
                            isCurrentCommand ? 'text-blue-800' : 'text-slate-600'
                          }`}>{cmd.description}</p>
                          <div className="bg-slate-900 text-green-400 p-3 rounded flex items-center justify-between group">
                            <code className="text-sm">{cmd.example}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white h-6 w-6 p-0"
                              onClick={() => copyToClipboard(cmd.example, commandIndex)}
                            >
                              {copiedIndex === commandIndex ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          {isCurrentCommand && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                              className="mt-3 flex items-start gap-2 text-blue-700 text-sm"
                            >
                              <TerminalIcon className="w-4 h-4 mt-0.5" />
                              <span>Type this command in the terminal on the right to continue</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              }
            })}
          </div>
        </AnimatePresence>

        {currentCommandIndex !== -1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <Card className="p-4 bg-slate-50 border-slate-200">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <p className="text-slate-600 text-sm">
                  {totalCommands - completedCount - 1} more {totalCommands - completedCount - 1 === 1 ? 'command' : 'commands'} and content will unlock as you progress
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {isCompleted && onGoToLab && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-blue-900 mb-1">Ready for Practice?</h3>
                  <p className="text-blue-700 text-sm">
                    Apply what you've learned in a hands-on lab exercise
                  </p>
                </div>
                <Button onClick={onGoToLab} className="bg-blue-600 hover:bg-blue-700">
                  Go to Lab →
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
        </div>
      </ScrollArea>
    </div>
  );
}

// ============================================
// LAB EXERCISE COMPONENT
// ============================================

interface LabExerciseProps {
  lab: Lab;
  onTaskComplete: (taskId: string, command: string) => void;
  completedTasks: Set<string>;
  onCommand: (command: string) => string | null;
}

function LabExercise({ lab, onTaskComplete: _onTaskComplete, completedTasks, onCommand: _onCommand }: LabExerciseProps) {
  const [showHints, setShowHints] = useState<Set<string>>(new Set());
  const [showSolutions, setShowSolutions] = useState<Set<string>>(new Set());
  const [attemptedCommands, _setAttemptedCommands] = useState<Map<string, string>>(new Map());

  const toggleHint = (taskId: string) => {
    setShowHints(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const toggleSolution = (taskId: string) => {
    setShowSolutions(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const totalTasks = lab.tasks.length;
  const completedCount = lab.tasks.filter((task: Task) => completedTasks.has(task.id)).length;
  const progress = (completedCount / totalTasks) * 100;

  return (
    <div className="h-full flex flex-col bg-white">
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl min-h-full">
          <div className="mb-6">
          <h1 className="text-slate-900 mb-2">{lab.title}</h1>
          <p className="text-slate-600 mb-4">{lab.description}</p>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-slate-600">
              {completedCount} / {totalTasks} tasks completed
            </span>
          </div>
        </div>

        {progress === 100 && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Congratulations! You've completed all tasks in this lab.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {lab.tasks.map((task: Task, index: number) => {
            const isCompleted = completedTasks.has(task.id);
            const showHint = showHints.has(task.id);
            const showSolution = showSolutions.has(task.id);
            const attemptedCommand = attemptedCommands.get(task.id);

            return (
              <Card key={task.id} className={`p-6 ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-slate-500">Task {index + 1}</span>
                          {isCompleted && (
                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-900">{task.description}</p>
                      </div>
                    </div>

                    {isCompleted && attemptedCommand && (
                      <div className="mb-3 p-3 bg-slate-900 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          <span className="text-green-400 text-sm">Your solution:</span>
                        </div>
                        <code className="text-green-400">{attemptedCommand}</code>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!isCompleted && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleHint(task.id)}
                          >
                            <Lightbulb className="w-4 h-4 mr-2" />
                            {showHint ? 'Hide Hint' : 'Show Hint'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSolution(task.id)}
                          >
                            <Code className="w-4 h-4 mr-2" />
                            {showSolution ? 'Hide Solution' : 'Show Solution'}
                          </Button>
                        </>
                      )}
                    </div>

                    {showHint && !isCompleted && (
                      <Alert className="mt-3 bg-blue-50 border-blue-200">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <span className="text-blue-900">Hint:</span> {task.hint}
                        </AlertDescription>
                      </Alert>
                    )}

                    {showSolution && !isCompleted && (
                      <div className="mt-3 p-3 bg-slate-900 rounded">
                        <div className="text-amber-400 text-sm mb-2">Solution:</div>
                        <code className="text-green-400">{task.solution}</code>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// ============================================
// QUIZ VIEWER COMPONENT (Part 1)
// ============================================

interface QuizViewerProps {
  quiz: Quiz;
  onComplete: () => void;
  isCompleted: boolean;
  onRegisterCommandHandler: (handler: (command: string) => { correct: boolean; message: string } | null) => void;
  onGoToLab?: () => void;
}

function QuizViewer({ quiz, onComplete, isCompleted, onRegisterCommandHandler, onGoToLab }: QuizViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Map<number, number | string>>(new Map());
  const [showResults, setShowResults] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    onRegisterCommandHandler(handleCommandAnswer);
  }, [currentQuestionIndex, answeredQuestions, showResults]);

  const handleSelectMCQAnswer = (optionIndex: number) => {
    if (showResults) return;
    
    const newAnswers = new Map(selectedAnswers);
    newAnswers.set(currentQuestionIndex, optionIndex);
    setSelectedAnswers(newAnswers);
    
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentQuestionIndex);
    setAnsweredQuestions(newAnswered);
  };

  const handleCommandAnswer = (command: string) => {
    if (showResults) return null;
    if (currentQuestion.type !== 'command') return null;

    const expectedCommand = currentQuestion.expectedCommand.trim();
    const isCorrect = command.trim() === expectedCommand;

    if (isCorrect) {
      const newAnswers = new Map(selectedAnswers);
      newAnswers.set(currentQuestionIndex, command);
      setSelectedAnswers(newAnswers);
      
      const newAnswered = new Set(answeredQuestions);
      newAnswered.add(currentQuestionIndex);
      setAnsweredQuestions(newAnswered);
      
      return {
        correct: true,
        message: `✓ Correct! This command is correct.\n\nYou can now proceed to the next question.`
      };
    } else {
      return {
        correct: false,
        message: `✗ Not quite right.\nExpected: ${expectedCommand}\nYou typed: ${command}\n\nHint: ${currentQuestion.hint}`
      };
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    const correctCount = quiz.questions.filter((q, i) => {
      const answer = selectedAnswers.get(i);
      if (q.type === 'mcq') {
        return answer === q.correctAnswer;
      } else {
        return answer !== undefined;
      }
    }).length;
    
    if (correctCount >= Math.ceil(totalQuestions * 0.7)) {
      onComplete();
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Map());
    setShowResults(false);
    setAnsweredQuestions(new Set());
  };

  const correctCount = quiz.questions.filter((q, i) => {
    const answer = selectedAnswers.get(i);
    if (q.type === 'mcq') {
      return answer === q.correctAnswer;
    } else {
      return answer !== undefined;
    }
  }).length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= 70;

  if (showResults) {
    return (
      <div className="h-full flex flex-col bg-white">
        <ScrollArea className="flex-1">
          <div className="p-6 max-w-4xl min-h-full pb-12">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-slate-900">{quiz.title}</h1>
              {isCompleted && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            <p className="text-slate-600 mt-2">{quiz.description}</p>
          </div>

          <Card className={`p-6 mb-6 ${passed ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
            <div className="flex items-center gap-4">
              {passed ? (
                <Trophy className="w-12 h-12 text-green-600" />
              ) : (
                <AlertCircle className="w-12 h-12 text-orange-600" />
              )}
              <div className="flex-1">
                <h2 className={passed ? 'text-green-900' : 'text-orange-900'}>
                  {passed ? '🎉 Congratulations!' : 'Keep Practicing'}
                </h2>
                <p className={`mt-1 ${passed ? 'text-green-700' : 'text-orange-700'}`}>
                  You scored {correctCount} out of {totalQuestions} ({score}%)
                </p>
                {passed ? (
                  <p className="text-green-600 text-sm mt-1">You've passed the quiz!</p>
                ) : (
                  <p className="text-orange-600 text-sm mt-1">You need 70% to pass. Review the lessons and try again.</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRetry} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry Quiz
                </Button>
              </div>
            </div>
          </Card>

          {passed && onGoToLab && (
            <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-blue-900 mb-1">Ready for Hands-On Practice?</h3>
                  <p className="text-blue-700 text-sm">
                    Apply what you've learned in the lab exercises
                  </p>
                </div>
                <Button onClick={onGoToLab} className="bg-blue-600 hover:bg-blue-700">
                  Go to Lab →
                </Button>
              </div>
            </Card>
          )}

          <div className="space-y-6">
            <h3 className="text-slate-900">Review Answers</h3>
            {quiz.questions.map((question, index) => {
              const selectedAnswer = selectedAnswers.get(index);
              let isCorrect = false;
              
              if (question.type === 'mcq') {
                isCorrect = selectedAnswer === question.correctAnswer;
              } else {
                isCorrect = selectedAnswer !== undefined;
              }

              return (
                <Card key={question.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-slate-500">{index + 1}.</span>
                        {question.type === 'command' && (
                          <Badge variant="outline" className="text-xs">
                            <TerminalIcon className="w-3 h-3 mr-1" />
                            Command
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-900">{question.question}</p>
                    </div>
                  </div>

                  <div className="ml-8 space-y-2">
                    {question.type === 'mcq' ? (
                      question.options.map((option, optionIndex) => {
                        const isSelected = selectedAnswer === optionIndex;
                        const isCorrectOption = optionIndex === question.correctAnswer;

                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded border ${
                              isCorrectOption
                                ? 'bg-green-50 border-green-300'
                                : isSelected
                                ? 'bg-red-50 border-red-300'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectOption && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                              {isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-red-600" />}
                              <span className={
                                isCorrectOption ? 'text-green-900' :
                                isSelected ? 'text-red-900' :
                                'text-slate-700'
                              }>
                                {option}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="bg-slate-900 text-green-400 p-3 rounded">
                        <div className="mb-2 text-slate-400 text-sm">Expected command:</div>
                        <code className="text-sm">{question.expectedCommand}</code>
                        {selectedAnswer && (
                          <>
                            <div className="mt-3 mb-2 text-slate-400 text-sm">Your answer:</div>
                            <code className="text-sm text-blue-400">{selectedAnswer as string}</code>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="ml-8 mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-blue-900 text-sm">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <ScrollArea className="flex-1">
        <div className="p-6 max-w-4xl min-h-full pb-12">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-slate-900">{quiz.title}</h1>
            {isCompleted && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          <p className="text-slate-600 mt-2">{quiz.description}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-slate-600">
              {answeredQuestions.size} answered
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                {currentQuestion.type === 'command' && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    <TerminalIcon className="w-3 h-3 mr-1" />
                    Command Question
                  </Badge>
                )}
              </div>
              
              <h2 className="text-slate-900 mb-6">{currentQuestion.question}</h2>

              {currentQuestion.type === 'mcq' ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswers.get(currentQuestionIndex) === optionIndex;

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleSelectMCQAnswer(optionIndex)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 shadow-md'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className={isSelected ? 'text-blue-900' : 'text-slate-700'}>
                            {option}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-blue-900 text-sm">
                          <strong>Hint:</strong> {currentQuestion.hint}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {answeredQuestions.has(currentQuestionIndex) ? (
                    <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Command entered correctly! Use the terminal on the right to practice.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900 border-2 border-blue-500 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-400 mb-2">
                        <TerminalIcon className="w-4 h-4" />
                        <span className="text-sm">Type your command in the terminal on the right →</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {quiz.questions.map((_q, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 w-6'
                    : answeredQuestions.has(index)
                    ? 'bg-green-600'
                    : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={answeredQuestions.size < totalQuestions}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// ============================================
// COURSE NAVIGATION COMPONENT
// ============================================

const iconMap: Record<string, any> = {
  box: Box,
  layers: Layers,
  network: Network,
  'file-key': FileKey,
};

interface CourseNavigationProps {
  modules: Module[];
  selectedModule: string;
  selectedLesson: string;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  completedLessons: Set<string>;
  completedCommands: Set<string>;
}

function CourseNavigation({
  modules,
  selectedModule,
  selectedLesson,
  onSelectLesson,
  completedLessons,
  completedCommands,
}: CourseNavigationProps) {
  return (
    <div className="w-80 border-r bg-slate-50 flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-blue-600">CKAD Course</h1>
        <p className="text-slate-600 text-sm mt-1">Kubernetes Application Developer</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {modules.map((module: Module) => {
            const Icon = iconMap[module.icon] || Box;
            const moduleCompleted = module.lessons.every(lesson => 
              completedLessons.has(lesson.id)
            );
            
            return (
              <div key={module.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <h3 className="text-slate-900">{module.title}</h3>
                  {moduleCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                  )}
                </div>
                
                <div className="space-y-1 ml-6">
                  {module.lessons.map((lesson: Lesson, index: number) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    const isSelected = selectedModule === module.id && selectedLesson === lesson.id;
                    
                    const items: LessonItem[] = lesson.items || [
                      { type: 'content', markdown: lesson.content || '' },
                      ...(lesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
                    ];
                    
                    const commands = items.filter(item => item.type === 'command').map(item => item.command);
                    const hasCommands = commands.length > 0;
                    
                    const lessonCompletedCount = hasCommands ? commands.filter((_, i) => 
                      completedCommands.has(`${lesson.id}-${i}`)
                    ).length : 0;
                    const lessonTotalCommands = commands.length;
                    
                    let lessonCurrentCommandIndex = -1;
                    if (hasCommands && isSelected) {
                      for (let i = 0; i < commands.length; i++) {
                        const commandKey = `${lesson.id}-${i}`;
                        if (!completedCommands.has(commandKey)) {
                          lessonCurrentCommandIndex = i;
                          break;
                        }
                      }
                    }
                    
                    return (
                      <div key={lesson.id}>
                        <Button
                          variant={isSelected ? 'secondary' : 'ghost'}
                          className="w-full justify-start text-sm h-auto py-2"
                          onClick={() => onSelectLesson(module.id, lesson.id)}
                        >
                          <span className="flex items-center gap-2 w-full">
                            <span className="text-slate-500">
                              {index + 1}.
                            </span>
                            <span className="flex-1 text-left">{lesson.title}</span>
                            {isCompleted && (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            )}
                            {hasCommands && isSelected && (
                              <Badge variant="outline" className="text-xs">
                                {lessonCompletedCount}/{lessonTotalCommands}
                              </Badge>
                            )}
                          </span>
                        </Button>
                        
                        {isSelected && hasCommands && (
                          <div className="ml-6 mt-2 space-y-1.5 pb-2">
                            {commands.map((cmd: Command, cmdIndex: number) => {
                              const commandKey = `${lesson.id}-${cmdIndex}`;
                              const isCommandCompleted = completedCommands.has(commandKey);
                              const isCurrentCommand = cmdIndex === lessonCurrentCommandIndex;
                              const isLocked = cmdIndex > lessonCurrentCommandIndex && lessonCurrentCommandIndex !== -1;

                              return (
                                <div
                                  key={cmdIndex}
                                  className={`flex items-start gap-2 p-2 rounded transition-all duration-300 text-xs ${
                                    isCurrentCommand
                                      ? 'bg-blue-100 border border-blue-300'
                                      : isCommandCompleted
                                      ? 'bg-green-50 border border-green-200'
                                      : 'bg-slate-50 border border-slate-200'
                                  }`}
                                >
                                  <div className="mt-0.5 flex-shrink-0">
                                    {isCommandCompleted ? (
                                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                    ) : isCurrentCommand ? (
                                      <Circle className="w-3.5 h-3.5 text-blue-600 fill-blue-600 animate-pulse" />
                                    ) : isLocked ? (
                                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                                    ) : (
                                      <Circle className="w-3.5 h-3.5 text-slate-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <code className={`block truncate ${
                                      isCurrentCommand
                                        ? 'text-blue-700'
                                        : isCommandCompleted
                                        ? 'text-green-700'
                                        : isLocked
                                        ? 'text-slate-400'
                                        : 'text-slate-600'
                                    }`}>
                                      {cmd.command}
                                    </code>
                                    <p className={`mt-0.5 line-clamp-2 ${
                                      isLocked ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                      {cmd.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                            
                            <div className="mt-2 pt-2 border-t border-slate-200">
                              <div className="bg-slate-200 rounded-full h-1.5">
                                <div
                                  className="bg-green-600 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${(lessonCompletedCount / lessonTotalCommands) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {module.quizzes && module.quizzes.map((quiz: Quiz) => {
                    const quizId = `${module.id}-${quiz.id}`;
                    const isSelected = selectedModule === module.id && selectedLesson === quizId;
                    const isCompleted = completedLessons.has(quizId);
                    
                    return (
                      <Button
                        key={quiz.id}
                        variant={isSelected ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-sm h-auto py-2"
                        onClick={() => onSelectLesson(module.id, quizId)}
                      >
                        <span className="flex items-center gap-2 w-full">
                          <ClipboardCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span className="flex-1 text-left">{quiz.title}</span>
                          {isCompleted && (
                            <CheckCircle className="w-3 h-3 text-green-600" />
                          )}
                        </span>
                      </Button>
                    );
                  })}

                  {module.labs.map((lab: Lab) => {
                    const labId = `${module.id}-${lab.id}`;
                    const isSelected = selectedModule === module.id && selectedLesson === labId;
                    
                    return (
                      <Button
                        key={lab.id}
                        variant={isSelected ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-sm h-auto py-2"
                        onClick={() => onSelectLesson(module.id, labId)}
                      >
                        <span className="flex items-center gap-2 w-full">
                          <Badge variant="outline" className="text-xs">Lab</Badge>
                          <span className="flex-1 text-left">{lab.title}</span>
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT
// ============================================

interface AppProps {
  courseModules?: Module[];
}

export default function App({ courseModules: propCourseModules }: AppProps = {}) {
  // Use prop courseModules if provided, otherwise use hardcoded default
  const modules = propCourseModules && propCourseModules.length > 0 ? propCourseModules : courseModules;
  
  const [selectedModule, setSelectedModule] = useState(modules[0]?.id || 'pods');
  const [selectedLesson, setSelectedLesson] = useState(modules[0]?.lessons?.[0]?.id || 'pods-intro');
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [completedCommands, setCompletedCommands] = useState<Set<string>>(new Set());

  const onSelectLesson = (moduleId: string, lessonId: string) => {
    setSelectedModule(moduleId);
    setSelectedLesson(lessonId);
  };

  const handleTaskComplete = (taskId: string, _command: string) => {
    setCompletedTasks(prev => new Set([...prev, taskId]));
  };

  const handleCommandComplete = (lessonId: string, commandIndex: number) => {
    const commandKey = `${lessonId}-${commandIndex}`;
    const newCompletedCommands = new Set([...completedCommands, commandKey]);
    setCompletedCommands(newCompletedCommands);

    const lesson = modules
      .flatMap(m => m.lessons)
      .find(l => l.id === lessonId);
    
    if (lesson) {
      const items = lesson.items || [
        { type: 'content' as const, markdown: lesson.content || '' },
        ...(lesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
      ];
      const commands = items.filter(item => item.type === 'command');
      
      if (commands.length > 0) {
        const allCommandsComplete = commands.every((_, i) => {
          const key = `${lessonId}-${i}`;
          return newCompletedCommands.has(key);
        });
        
        if (allCommandsComplete) {
          setCompletedLessons(prev => new Set([...prev, lessonId]));
        }
      }
    }
  };

  const currentModule = modules.find(m => m.id === selectedModule);
  const currentLesson = currentModule?.lessons.find(l => l.id === selectedLesson);
  const currentLab = currentModule?.labs.find(l => `${selectedModule}-${l.id}` === selectedLesson);
  const currentQuiz = currentModule?.quizzes?.find(q => `${selectedModule}-${q.id}` === selectedLesson);

  const isQuiz = !!currentQuiz;
  const [quizCommandHandler, setQuizCommandHandler] = useState<((cmd: string) => { correct: boolean; message: string } | null) | null>(null);

  const handleQuizComplete = () => {
    setCompletedLessons(prev => new Set([...prev, selectedLesson]));
  };

  const handleQuizCommand = (command: string): string | null => {
    if (quizCommandHandler) {
      const result = quizCommandHandler(command);
      if (result) {
        return result.message;
      }
    }
    return null;
  };

  const handleGoToLab = () => {
    if (currentModule && currentModule.labs.length > 0) {
      const labId = `${currentModule.id}-${currentModule.labs[0].id}`;
      onSelectLesson(currentModule.id, labId);
    }
  };

  const getCurrentExpectedCommand = (): string | null => {
    if (!currentLesson) return null;
    
    const items = currentLesson.items || [
      { type: 'content' as const, markdown: currentLesson.content || '' },
      ...(currentLesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
    ];
    const commands = items.filter(item => item.type === 'command').map(item => item.command);
    
    if (commands.length === 0) return null;
    
    for (let i = 0; i < commands.length; i++) {
      const commandKey = `${currentLesson.id}-${i}`;
      if (!completedCommands.has(commandKey)) {
        return commands[i].example;
      }
    }
    return null;
  };

  const expectedCommand = getCurrentExpectedCommand();

  const handleTerminalCommand = (command: string): string | null => {
    if (currentLesson) {
      const items = currentLesson.items || [
        { type: 'content' as const, markdown: currentLesson.content || '' },
        ...(currentLesson.commands || []).map(cmd => ({ type: 'command' as const, command: cmd }))
      ];
      const commands = items.filter(item => item.type === 'command').map(item => item.command);
      
      if (commands.length > 0) {
        for (let i = 0; i < commands.length; i++) {
          const commandKey = `${currentLesson.id}-${i}`;
          if (!completedCommands.has(commandKey)) {
            const expectedCommand = commands[i].example.trim();
            if (command.trim() === expectedCommand) {
              handleCommandComplete(currentLesson.id, i);
              const isLastCommand = i === commands.length - 1;
              if (isLastCommand) {
                return `✓ Correct! Command "${commands[i].command}" completed.\n\n🎉 Congratulations! You've completed all commands for this lesson!\nThe lesson is now marked as complete.`;
              } else {
                return `✓ Correct! Command "${commands[i].command}" completed.\nThe next command and content are now unlocked above.`;
              }
            } else {
              return `✗ This doesn't match the expected command.\nExpected: ${expectedCommand}\nYou typed: ${command}`;
            }
          }
        }
      }
    }
    return null;
  };

  return (
    <div className="h-screen flex bg-white">
      <CourseNavigation
        modules={modules}
        selectedModule={selectedModule}
        selectedLesson={selectedLesson}
        onSelectLesson={onSelectLesson}
        completedLessons={completedLessons}
        completedCommands={completedCommands}
      />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="h-full overflow-hidden">
            {currentLesson && (
              <LessonViewer
                lesson={currentLesson}
                isCompleted={completedLessons.has(selectedLesson)}
                completedCommands={completedCommands}
                onGoToLab={currentModule?.labs && currentModule.labs.length > 0 ? handleGoToLab : undefined}
              />
            )}
            
            {currentQuiz && (
              <QuizViewer
                quiz={currentQuiz}
                onComplete={handleQuizComplete}
                isCompleted={completedLessons.has(selectedLesson)}
                onRegisterCommandHandler={(handler) => setQuizCommandHandler(() => handler)}
                onGoToLab={currentModule?.labs && currentModule.labs.length > 0 ? handleGoToLab : undefined}
              />
            )}
            
            {currentLab && (
              <LabExercise
                lab={currentLab}
                onTaskComplete={handleTaskComplete}
                completedTasks={completedTasks}
                onCommand={(command: string) => {
                    for (const task of currentLab.tasks) {
                      if (!completedTasks.has(task.id) && task.validation(command)) {
                        handleTaskComplete(task.id, command);
                        return `✓ Task completed: ${task.description}`;
                      }
                    }
                    return null;
                  }}
              />
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={40} minSize={25}>
          <Terminal
            expectedCommand={isQuiz ? null : expectedCommand}
            onCommand={
              isQuiz
                ? handleQuizCommand
                : handleTerminalCommand
            }
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

