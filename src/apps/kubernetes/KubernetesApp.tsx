import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { Terminal } from '../../components/course/Terminal';
import { CourseNavigation, Module } from '../../components/course/CourseNavigation';
import { LessonViewer } from '../../components/course/LessonViewer';
import { LabExercise } from '../../components/course/LabExercise';
import { QuizViewer } from '../../components/course/QuizViewer';

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
// MAIN APP COMPONENT
// ============================================

interface AppProps {
  courseModules?: Module[];
}

export default function App({ courseModules: propCourseModules }: AppProps = {}) {
  // Use prop courseModules if provided, otherwise use hardcoded default
  console.log('🎯 KubernetesApp received courseModules:', {
    hasProp: !!propCourseModules,
    propLength: propCourseModules?.length || 0,
    willUseProp: !!(propCourseModules && propCourseModules.length > 0)
  });

  const modules = propCourseModules && propCourseModules.length > 0 ? propCourseModules : courseModules;

  console.log('🎯 KubernetesApp using modules:', {
    count: modules.length,
    titles: modules.map(m => m.title),
    source: propCourseModules && propCourseModules.length > 0 ? 'API' : 'HARDCODED'
  });

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

  // Lesson gating: Check if a lesson can be accessed
  const canAccessLesson = (lessonId: string, allLessonsInOrder: Array<{ id: string; sequenceOrder: number }>): boolean => {
    // Sort lessons by sequence order
    const sortedLessons = [...allLessonsInOrder].sort((a, b) => a.sequenceOrder - b.sequenceOrder);

    // Find current lesson index
    const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);

    // First lesson is always accessible
    if (currentIndex <= 0) {
      return true;
    }

    // Check if previous lesson is completed
    const previousLesson = sortedLessons[currentIndex - 1];
    return completedLessons.has(previousLesson.id);
  };

  // Get previous lesson title for lock message
  const getPreviousLessonTitle = (lessonId: string): string | undefined => {
    if (!currentModule) return undefined;

    const allLessons = currentModule.lessons.map((l, idx) => ({
      id: l.id,
      title: l.title,
      sequenceOrder: l.sequenceOrder ?? idx
    }));

    const sortedLessons = [...allLessons].sort((a, b) => a.sequenceOrder - b.sequenceOrder);
    const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);

    if (currentIndex > 0) {
      return sortedLessons[currentIndex - 1].title;
    }

    return undefined;
  };

  // Check if current lesson is accessible
  const isCurrentLessonAccessible = currentLesson && currentModule
    ? canAccessLesson(
        currentLesson.id,
        currentModule.lessons.map((l, idx) => ({
          id: l.id,
          sequenceOrder: l.sequenceOrder ?? idx
        }))
      )
    : true;

  // Get previous lesson title for lock message
  const previousLessonTitle = currentLesson ? getPreviousLessonTitle(currentLesson.id) : undefined;

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
        courseTitle="Kubernetes Complete Guide"
        courseSubtitle="Master Kubernetes from Basics to Advanced Topics"
        canAccessLesson={canAccessLesson}
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
                isAccessible={isCurrentLessonAccessible}
                previousLessonTitle={previousLessonTitle}
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
