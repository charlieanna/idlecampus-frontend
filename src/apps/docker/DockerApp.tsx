import { useState, useEffect } from 'react';
import { Box, Layers, Network, FileKey, GripVertical, BookOpen, Check, Lock } from 'lucide-react';
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
              command: 'docker run',
              description: 'Create and run a pod',
              example: 'docker run nginx --image=nginx'
            }
          },
          {
            type: 'content',
            markdown: `Great! Now that you've created a pod, let's learn how to view it.

The **docker get pods** command lists all pods in the current namespace. The **-o wide** flag provides additional details like the node the pod is running on and its IP address.`
          },
          {
            type: 'command',
            command: {
              command: 'docker get pods',
              description: 'List all pods',
              example: 'docker get pods -o wide'
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
              command: 'docker describe pod',
              description: 'Show detailed information about a pod',
              example: 'docker describe pod nginx'
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
              command: 'docker delete pod',
              description: 'Delete a pod',
              example: 'docker delete pod nginx'
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
            hint: 'Use docker run command with --image flag',
            validation: (cmd) => cmd.includes('docker run') && cmd.includes('nginx-pod') && cmd.includes('nginx'),
            solution: 'docker run nginx-pod --image=nginx'
          },
          {
            id: 'task-2',
            description: 'List all pods in the current namespace',
            hint: 'Use docker get pods',
            validation: (cmd) => cmd.includes('docker get') && cmd.includes('pod'),
            solution: 'docker get pods'
          },
          {
            id: 'task-3',
            description: 'Get detailed information about the nginx-pod',
            hint: 'Use docker describe pod',
            validation: (cmd) => cmd.includes('docker describe pod') && cmd.includes('nginx-pod'),
            solution: 'docker describe pod nginx-pod'
          }
        ]
      }
    ],
    quizzes: [
      {
        id: 'pods-quiz',
        title: 'Pods Knowledge Check',
        description: 'Test your understanding of Kubernetes Pods and basic docker commands. Mix of theory and practical questions.',
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
            expectedCommand: 'docker run test-pod --image=nginx',
            hint: 'Use the docker run command with the --image flag',
            explanation: 'The "docker run" command is used to create and run a pod. The syntax is: docker run [pod-name] --image=[image-name]'
          },
          {
            id: 'q3',
            type: 'mcq',
            question: 'What flag can you add to "docker get pods" to see additional details like node and IP address?',
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
            expectedCommand: 'docker describe pod test-pod',
            hint: 'Use docker describe pod followed by the pod name',
            explanation: 'The "docker describe pod" command shows detailed information including events, configuration, status, and conditions.'
          },
          {
            id: 'q5',
            type: 'command',
            question: 'List all pods in wide output format to see additional details.',
            expectedCommand: 'docker get pods -o wide',
            hint: 'Use docker get pods with the -o wide flag',
            explanation: 'The "docker get pods -o wide" command lists all pods with additional information like IP address and node.'
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
            command: 'docker create deployment',
            description: 'Create a deployment',
            example: 'docker create deployment nginx --image=nginx --replicas=3'
          },
          {
            command: 'docker get deployments',
            description: 'List deployments',
            example: 'docker get deployments'
          },
          {
            command: 'docker scale deployment',
            description: 'Scale a deployment',
            example: 'docker scale deployment nginx --replicas=5'
          },
          {
            command: 'docker rollout status',
            description: 'Check rollout status',
            example: 'docker rollout status deployment/nginx'
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
            hint: 'Use docker create deployment with --replicas flag',
            validation: (cmd) => cmd.includes('docker create deployment') && cmd.includes('webapp') && cmd.includes('replicas=3'),
            solution: 'docker create deployment webapp --image=nginx --replicas=3'
          },
          {
            id: 'task-2',
            description: 'Scale the webapp deployment to 5 replicas',
            hint: 'Use docker scale deployment',
            validation: (cmd) => cmd.includes('docker scale') && cmd.includes('webapp') && cmd.includes('replicas=5'),
            solution: 'docker scale deployment webapp --replicas=5'
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
            command: 'docker expose',
            description: 'Expose a resource as a service',
            example: 'docker expose deployment nginx --port=80 --type=NodePort'
          },
          {
            command: 'docker get services',
            description: 'List services',
            example: 'docker get svc'
          },
          {
            command: 'docker describe service',
            description: 'Describe a service',
            example: 'docker describe svc nginx'
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
            hint: 'Use docker expose deployment',
            validation: (cmd) => cmd.includes('docker expose') && cmd.includes('webapp') && cmd.includes('port'),
            solution: 'docker expose deployment webapp --port=80'
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
            command: 'docker create configmap',
            description: 'Create a ConfigMap',
            example: 'docker create configmap app-config --from-literal=key=value'
          },
          {
            command: 'docker create secret',
            description: 'Create a Secret',
            example: 'docker create secret generic db-pass --from-literal=password=mypass'
          },
          {
            command: 'docker get configmaps',
            description: 'List ConfigMaps',
            example: 'docker get cm'
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
            hint: 'Use docker create configmap with --from-literal',
            validation: (cmd) => cmd.includes('docker create configmap') && cmd.includes('app-config'),
            solution: 'docker create configmap app-config --from-literal=env=production'
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
  const modules = propCourseModules && propCourseModules.length > 0 ? propCourseModules : courseModules;

  console.log('🐳 DockerApp received:', JSON.stringify({
    propProvided: !!propCourseModules,
    propLength: propCourseModules?.length,
    usingProp: propCourseModules && propCourseModules.length > 0,
    modulesUsed: modules.length,
    firstModule: modules[0]?.title,
    firstLesson: modules[0]?.lessons?.[0]?.title
  }, null, 2));

  // Debug first lesson structure
  if (modules[0]?.lessons?.[0]) {
    const firstLesson = modules[0].lessons[0];
    console.log('📄 First lesson structure:', JSON.stringify({
      id: firstLesson.id,
      title: firstLesson.title,
      hasItems: !!firstLesson.items,
      itemsLength: firstLesson.items?.length,
      hasContent: !!firstLesson.content,
      contentLength: firstLesson.content?.length,
      hasCommands: !!firstLesson.commands,
      commandsLength: firstLesson.commands?.length,
      firstItem: firstLesson.items?.[0]
    }, null, 2));
  }

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

          // Auto-navigate to next lesson after a short delay
          setTimeout(() => {
            const currentModule = modules.find(m => m.lessons.some(l => l.id === lessonId));
            if (currentModule) {
              const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === lessonId);
              const nextLesson = currentModule.lessons[currentLessonIndex + 1];

              if (nextLesson) {
                // Navigate to next lesson in same module
                onSelectLesson(currentModule.id, nextLesson.id);
              } else {
                // Check if there's a lab to go to
                if (currentModule.labs && currentModule.labs.length > 0) {
                  const labId = `${currentModule.id}-${currentModule.labs[0].id}`;
                  onSelectLesson(currentModule.id, labId);
                } else {
                  // Move to next module
                  const currentModuleIndex = modules.findIndex(m => m.id === currentModule.id);
                  const nextModule = modules[currentModuleIndex + 1];
                  if (nextModule && nextModule.lessons.length > 0) {
                    onSelectLesson(nextModule.id, nextModule.lessons[0].id);
                  }
                }
              }
            }
          }, 1500); // 1.5 second delay to show completion state
        }
      }
    }
  };

  const currentModule = modules.find(m => m.id === selectedModule);
  const currentLesson = currentModule?.lessons.find(l => l.id === selectedLesson);
  const currentLab = currentModule?.labs.find(l => `${selectedModule}-${l.id}` === selectedLesson);
  const currentQuiz = currentModule?.quizzes?.find(q => `${selectedModule}-${q.id}` === selectedLesson);

  const isQuiz = !!currentQuiz;

  // Check if Module 1 (Container Basics) is selected
  // Module 1 has id "module-1" after transformation, or slug "791" from API
  const isModule1 = currentModule?.id === 'module-1' ||
                    currentModule?.slug === '791' ||
                    currentModule?.title?.includes('Container Basics');
  const [quizCommandHandler, setQuizCommandHandler] = useState<((cmd: string) => { correct: boolean; message: string } | null) | null>(null);
  const [progressiveItems, setProgressiveItems] = useState<any[] | null>(null);

  // Reset progressive items when switching away from Module 1
  useEffect(() => {
    if (!isModule1) {
      setProgressiveItems(null);
    }
  }, [isModule1]);

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
      // Use progressive items if available (Module 1), otherwise use regular lesson items
      const items = progressiveItems || currentLesson.items || [
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

  // Render the app with unified layout
  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar with Navigation and Commands Button */}
      <div className="w-80 flex flex-col border-r border-slate-200 bg-slate-50">
        {/* Course Header */}
        <div className="p-4 border-b flex-shrink-0">
          <h1 className="text-blue-600">Docker Course</h1>
          <p className="text-slate-600 text-sm mt-1">Docker Fundamentals</p>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {modules.map((module) => {
              const moduleCompleted = module.lessons.every(lesson =>
                completedLessons.has(lesson.id)
              );

              return (
                <div key={module.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-600" />
                    <h3 className="text-slate-900 text-sm font-semibold">{module.title}</h3>
                  </div>

                  <div className="space-y-1 ml-6">
                    {module.lessons.map((lesson, index) => {
                      const isCompleted = completedLessons.has(lesson.id);
                      const isSelected = selectedModule === module.id && selectedLesson === lesson.id;

                      // Check if lesson is accessible
                      const allLessonsInModule = module.lessons.map((l, idx) => ({
                        id: l.id,
                        sequenceOrder: l.sequenceOrder ?? idx
                      }));
                      const isAccessible = canAccessLesson(lesson.id, allLessonsInModule);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => isAccessible && onSelectLesson(module.id, lesson.id)}
                          disabled={!isAccessible}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded text-sm transition-colors',
                            isSelected
                              ? 'bg-blue-100 text-blue-900'
                              : isAccessible
                              ? 'text-slate-700 hover:bg-slate-100'
                              : 'text-slate-400 cursor-not-allowed'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className={!isAccessible ? 'text-slate-400' : 'text-slate-500'}>{index + 1}.</span>
                            <span className="flex-1">{lesson.title}</span>
                            {!isAccessible && <Lock className="w-3 h-3 text-slate-400" />}
                            {isCompleted && isAccessible && <Check className="w-3 h-3 text-green-600" />}
                          </div>
                        </button>
                      );
                    })}

                    {/* Show labs if they exist */}
                    {module.labs && module.labs.length > 0 && module.labs.map((lab) => {
                      const labId = `${module.id}-${lab.id}`;
                      const isCompleted = completedLessons.has(labId);
                      const isSelected = selectedModule === module.id && selectedLesson === labId;

                      return (
                        <button
                          key={lab.id}
                          onClick={() => onSelectLesson(module.id, labId)}
                          className={cn(
                            'w-full text-left px-3 py-2 rounded text-sm transition-colors',
                            isSelected
                              ? 'bg-blue-100 text-blue-900'
                              : 'text-slate-700 hover:bg-slate-100'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium">LAB</span>
                            <span className="flex-1">{lab.title}</span>
                            {isCompleted && <Check className="w-3 h-3 text-green-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Course content with terminal */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={60} minSize={30}>
            <div className="h-full overflow-hidden">
              {currentLesson && (
                <LessonViewer
                  lesson={currentLesson}
                  isCompleted={completedLessons.has(selectedLesson)}
                  completedCommands={completedCommands}
                  onGoToLab={currentModule?.labs && currentModule.labs.length > 0 ? handleGoToLab : undefined}
                  progressiveMode={isModule1}
                  moduleSlug="container-lifecycle"
                  onProgressiveItemsLoaded={setProgressiveItems}
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
