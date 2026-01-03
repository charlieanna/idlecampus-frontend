import { useState, useEffect, useMemo } from 'react';
import { Box, Layers, Network, FileKey, GripVertical, BookOpen, Check, Lock, ChevronRight } from 'lucide-react';
import * as ResizablePrimitive from 'react-resizable-panels';
import { XTerminal } from '../../components/course/XTerminal';
import { CourseNavigation, Module } from '../../components/course/CourseNavigation';
import { CourseSidebar } from '../../components/course/CourseSidebar';
import { LessonViewer } from '../../components/course/LessonViewer';
import { LabExercise } from '../../components/course/LabExercise';
import { QuizViewer } from '../../components/course/QuizViewer';
import { useLessonGating } from '../../hooks/useLessonGating';

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
    id: 'introduction',
    title: 'Introduction to Docker',
    icon: 'box',
    sequenceOrder: 1,
    lessons: [
      {
        id: 'what-is-docker',
        title: 'What is Docker?',
        items: [
          {
            type: 'content',
            markdown: `# Welcome to Docker!

Imagine you're a chef who has perfected a recipe. You want to share it with other chefs around the world, but there's a problem: every kitchen is different. Different stoves, different utensils, different ingredients available. Your recipe might work perfectly in your kitchen but fail in others.

**This is exactly the problem developers faced for decades.**

"But it works on my machine!" became the most frustrating phrase in software development. An application that runs perfectly on a developer's laptop would mysteriously crash when deployed to a server.

## Enter Docker

Docker solves this by packaging your application along with everything it needs to run - the operating system, libraries, dependencies, and configuration - into a single portable unit called a **container**.

Think of it like shipping a complete, self-contained kitchen (with your recipe, ingredients, and exact oven settings) instead of just the recipe itself.

## Why Does This Matter?

Docker containers provide several key advantages that make them essential for modern software development:

- **Consistency**: Your app runs the same way everywhere - on your laptop, your colleague's machine, test servers, and production. No more "it works on my machine" problems.

- **Isolation**: Each container is like a separate apartment. Problems in one don't affect others. If one application crashes or gets compromised, others remain safe.

- **Speed**: Containers start in seconds, not minutes like virtual machines. This makes development faster and deployment more efficient.

- **Efficiency**: Containers share the host's operating system, using far less resources than VMs. You can run many more applications on the same hardware.

---

Let's see Docker in action! First, let's check if Docker is running on your system.`
          },
          {
            type: 'command',
            command: {
              command: 'docker --version',
              description: 'Check Docker version',
              example: 'docker --version'
            }
          },
          {
            type: 'content',
            markdown: `Great! Docker is installed and ready. You just ran your first Docker command!

## The Docker Ecosystem

Docker consists of three main concepts:

1. **Images**: Read-only templates containing your application and its dependencies. Think of them as the "recipe" or "blueprint".

2. **Containers**: Running instances of images. If an image is a recipe, a container is the actual dish you cooked from it.

3. **Registry**: A place to store and share images (like Docker Hub). Think of it as a cookbook library.

Let's see what's happening with Docker right now on your system.`
          },
          {
            type: 'command',
            command: {
              command: 'docker info',
              description: 'Display system-wide Docker information',
              example: 'docker info'
            }
          }
        ]
      },
      {
        id: 'containers-explained',
        title: 'Why Containers?',
        items: [
          {
            type: 'content',
            markdown: `# Why Containers? The Problems They Solve

Before we dive into commands, let's understand the real-world problems containers solve.

## The Nightmare Before Containers

Picture this scenario that happened at companies every day:

**Developer**: "I finished the new feature! It works perfectly on my laptop."
**Operations**: "We deployed it to production... and it crashed immediately."
**Developer**: "But it works on my machine!"

Why did this happen?
- Developer's laptop has Python 3.9, server has Python 3.6
- Developer installed a library globally, server doesn't have it
- Developer's config file is different from production
- Developer's OS is macOS, server runs Linux

**The result?** Hours of debugging, finger-pointing, and missed deadlines.

## What Containers Actually Do

A container packages your application with **everything it needs to run**:
- The exact version of your programming language
- All libraries and dependencies
- Configuration files
- Environment variables
- Even a minimal operating system

It's like shipping a terrarium instead of just a plant. The plant comes with its own soil, water, and controlled environment.`
          },
          {
            type: 'command',
            command: {
              command: 'docker ps',
              description: 'List running containers',
              example: 'docker ps'
            }
          },
          {
            type: 'content',
            markdown: `## Why You Should Use Containers

### 1. Consistency Everywhere
The same container runs identically on your laptop, your colleague's Windows machine, test servers, production, and cloud platforms (AWS, Google Cloud, Azure).

### 2. Isolation = Safety
Each container is isolated. If one app crashes or gets hacked, others are unaffected. It's like apartments - a fire in one unit doesn't burn down the building.

### 3. Speed and Efficiency
- **Start in seconds**: Containers launch almost instantly
- **Use less resources**: Run 10x more apps on the same hardware
- **Scale easily**: Need more capacity? Spin up more containers

### 4. Developer Productivity
- New team member? Run \`docker compose up\` and the entire dev environment is ready
- Testing a new database? Pull a container, test, delete it
- Experimenting with new tech? No need to install anything permanently

## Containers vs Virtual Machines

| Feature | Virtual Machine | Container |
|---------|----------------|-----------|
| Startup time | Minutes | Seconds |
| Memory usage | Gigabytes | Megabytes |
| Disk space | 10-50 GB each | 100-500 MB each |

**The analogy**: VMs are separate houses (each with foundation, plumbing). Containers are apartments (shared infrastructure, isolated spaces).

## Real-World Success Stories

- **Google** runs billions of containers weekly
- **Netflix** deploys thousands of times per day using containers
- **Spotify** migrated to containers for faster deployments
- **Uber** uses containers for their microservices

Let's see all containers on your system, including stopped ones.`
          },
          {
            type: 'command',
            command: {
              command: 'docker ps -a',
              description: 'List all containers (including stopped)',
              example: 'docker ps -a'
            }
          }
        ]
      },
      {
        id: 'images-explained',
        title: 'Understanding Docker Images',
        items: [
          {
            type: 'content',
            markdown: `# Docker Images: The Building Blocks

If containers are running applications, images are their blueprints.

## What's Inside an Image?

A Docker image contains:
- **Base Operating System** - Usually a minimal Linux distribution
- **Application Code** - Your actual program
- **Dependencies** - Libraries, packages, runtime environments
- **Configuration** - Environment variables, settings
- **Instructions** - Commands that run when the container starts

## The Layer System

Here's something clever about Docker images: they're built in **layers**.

Imagine building a cake:
1. Bottom layer: Base (flour, eggs, sugar)
2. Middle layer: Filling (cream, fruit)
3. Top layer: Frosting (chocolate, decorations)

Docker images work similarly:
1. Base layer: Operating system (Ubuntu, Alpine)
2. Middle layers: Dependencies (Python, Node.js, libraries)
3. Top layer: Your application code

**Why layers matter:**
- Layers are **cached** and **reused**
- If you change only your code, Docker doesn't rebuild the base layers
- Sharing common layers between images saves disk space
- Updates are fast because only changed layers need downloading

## Where Do Images Come From?

1. **Docker Hub**: The default public registry with millions of images
2. **Private Registries**: Company-specific image storage
3. **Build Your Own**: Create custom images with Dockerfiles

Let's see what images are already on your system.`
          },
          {
            type: 'command',
            command: {
              command: 'docker images',
              description: 'List all Docker images',
              example: 'docker images'
            }
          },
          {
            type: 'content',
            markdown: `The output shows:
- **REPOSITORY**: The image name (e.g., ubuntu, nginx, python)
- **TAG**: Version identifier (e.g., latest, 3.9, 22.04)
- **IMAGE ID**: Unique SHA256 hash
- **CREATED**: When the image was built
- **SIZE**: Disk space used

## Image Tags

Tags are like version numbers for images:
- \`nginx:latest\` - The most recent version
- \`python:3.11\` - Python version 3.11
- \`ubuntu:22.04\` - Ubuntu LTS release
- \`node:18-alpine\` - Node.js 18 on lightweight Alpine Linux

Always use specific tags in production! \`latest\` can change unexpectedly.

Let's download (pull) a small but powerful image to experiment with.`
          },
          {
            type: 'command',
            command: {
              command: 'docker pull',
              description: 'Download an image from a registry',
              example: 'docker pull alpine'
            }
          }
        ]
      }
    ],
    labs: [],
    quizzes: [
      {
        id: 'intro-quiz',
        title: 'Docker Fundamentals Check',
        description: 'Test your understanding of Docker basics.',
        questions: [
          {
            id: 'q1',
            type: 'mcq',
            question: 'What is a Docker container?',
            options: [
              'A virtual machine with its own kernel',
              'A running instance of a Docker image',
              'A type of server hardware',
              'A programming language'
            ],
            correctAnswer: 1,
            explanation: 'A container is a running instance of an image. It packages an application with all its dependencies into an isolated, portable unit.'
          },
          {
            id: 'q2',
            type: 'mcq',
            question: 'What is a key advantage of containers over virtual machines?',
            options: [
              'Containers have better security',
              'Containers can run Windows applications on Linux',
              'Containers start faster and use less resources',
              'Containers are free while VMs cost money'
            ],
            correctAnswer: 2,
            explanation: 'Containers share the host OS kernel, so they start in seconds and use megabytes of memory instead of gigabytes like VMs.'
          },
          {
            id: 'q3',
            type: 'command',
            question: 'What command shows all running containers?',
            expectedCommand: 'docker ps',
            hint: 'The command starts with "docker" followed by "ps"',
            explanation: 'docker ps lists all running containers. Add -a to see stopped containers too.'
          }
        ]
      }
    ]
  },
  {
    id: 'running-containers',
    title: 'Running Containers',
    icon: 'layers',
    sequenceOrder: 2,
    lessons: [
      {
        id: 'docker-run',
        title: 'Your First Container',
        items: [
          {
            type: 'content',
            markdown: `# Running Your First Container

It's time to get hands-on! We'll run a real container and see Docker's magic in action.

## The docker run Command

The \`docker run\` command is the heart of Docker. It:
1. **Pulls** the image (if not already downloaded)
2. **Creates** a new container from the image
3. **Starts** the container
4. **Runs** the specified command

## Hello, World!

Let's start with the classic "Hello World" - Docker style. This will download a tiny image and run a container that prints a welcome message.`
          },
          {
            type: 'command',
            command: {
              command: 'docker run hello-world',
              description: 'Run the Docker hello-world container',
              example: 'docker run hello-world'
            }
          },
          {
            type: 'content',
            markdown: `Congratulations! You just ran your first Docker container!

Let's break down what happened:
1. Docker looked for the \`hello-world\` image locally
2. When not found, it pulled it from Docker Hub
3. Docker created a container from this image
4. The container ran, printed the message, and exited

Notice how fast that was? Containers typically start in milliseconds!

## Running an Interactive Container

The hello-world container ran and exited immediately. Let's try something more interactive - a full Ubuntu Linux environment.

We'll use two important flags:
- \`-i\` (interactive): Keeps STDIN open
- \`-t\` (tty): Allocates a terminal

Let's run an interactive Alpine Linux container (a tiny, 5MB Linux distribution).`
          },
          {
            type: 'command',
            command: {
              command: 'docker run -it alpine sh',
              description: 'Run Alpine Linux interactively',
              example: 'docker run -it alpine sh'
            }
          },
          {
            type: 'content',
            markdown: `You're now inside an Alpine Linux container! You can run commands like \`ls\`, \`cat /etc/os-release\`, or \`whoami\`.

**Important**: You're inside a container now. Docker commands won't work here because Docker isn't installed inside containers by default. You can only run regular Linux commands.

Type \`exit\` when you're done exploring to return to your host machine.

---

## Running Containers in the Background

Now that you're back on your host machine (after typing \`exit\`), you can run Docker commands again.

For long-running services like web servers, you don't want to tie up your terminal. The \`-d\` flag runs containers in "detached" mode (background).

Let's run nginx (a popular web server) in the background.`
          },
          {
            type: 'command',
            command: {
              command: 'docker run -d nginx',
              description: 'Run nginx web server in background',
              example: 'docker run -d nginx'
            }
          },
          {
            type: 'content',
            markdown: `Docker returned a long ID - that's your container's unique identifier.

The nginx container is now running in the background! Let's verify it.`
          },
          {
            type: 'command',
            command: {
              command: 'docker ps',
              description: 'List running containers',
              example: 'docker ps'
            }
          }
        ]
      },
      {
        id: 'container-lifecycle',
        title: 'Container Lifecycle',
        items: [
          {
            type: 'content',
            markdown: `# Managing Container Lifecycle

Containers have a lifecycle: they're created, started, stopped, and eventually removed. Let's learn to manage this.

## Container States

A container can be in several states:
- **Created**: Container exists but hasn't started
- **Running**: Container is actively executing
- **Paused**: Container is temporarily suspended
- **Stopped**: Container has finished executing
- **Removed**: Container is deleted

## Naming Containers

Docker generates random names like "amazing_tesla" or "hungry_darwin". You can specify your own with \`--name\`.

Let's create a named container.`
          },
          {
            type: 'command',
            command: {
              command: 'docker run --name my-nginx -d nginx',
              description: 'Run a named nginx container',
              example: 'docker run --name my-nginx -d nginx'
            }
          },
          {
            type: 'content',
            markdown: `Now you have a container named "my-nginx". This makes it easier to reference in commands.

## Stopping Containers

To stop a running container gracefully (sends SIGTERM, then SIGKILL after timeout).`
          },
          {
            type: 'command',
            command: {
              command: 'docker stop',
              description: 'Stop a running container',
              example: 'docker stop my-nginx'
            }
          },
          {
            type: 'content',
            markdown: `The container is now stopped. Let's verify by listing all containers (including stopped ones).`
          },
          {
            type: 'command',
            command: {
              command: 'docker ps -a',
              description: 'List all containers including stopped',
              example: 'docker ps -a'
            }
          },
          {
            type: 'content',
            markdown: `## Starting Stopped Containers

You can restart a stopped container. It will retain its data and configuration.`
          },
          {
            type: 'command',
            command: {
              command: 'docker start',
              description: 'Start a stopped container',
              example: 'docker start my-nginx'
            }
          },
          {
            type: 'content',
            markdown: `## Removing Containers

When you're done with a container, remove it to free up resources.

First, stop it (if running), then remove it.`
          },
          {
            type: 'command',
            command: {
              command: 'docker rm',
              description: 'Remove a stopped container',
              example: 'docker rm my-nginx'
            }
          }
        ]
      },
      {
        id: 'container-logs',
        title: 'Viewing Container Logs',
        items: [
          {
            type: 'content',
            markdown: `# Container Logs and Debugging

When something goes wrong (or right!), you need to see what's happening inside your containers. Docker captures all output from your container's main process.

## Viewing Logs

First, let's start a container that produces some output.`
          },
          {
            type: 'command',
            command: {
              command: 'docker run -d --name webserver nginx',
              description: 'Start a web server container',
              example: 'docker run -d --name webserver nginx'
            }
          },
          {
            type: 'content',
            markdown: `Now let's view its logs.`
          },
          {
            type: 'command',
            command: {
              command: 'docker logs',
              description: 'View container logs',
              example: 'docker logs webserver'
            }
          },
          {
            type: 'content',
            markdown: `## Following Logs in Real-Time

Add \`-f\` to follow logs as they're written (like \`tail -f\`). Press Ctrl+C to stop.

## Viewing Recent Logs

Use \`--tail\` to see only the last N lines:
\`\`\`
docker logs --tail 10 webserver
\`\`\`

## Inspecting Containers

For detailed information about a container's configuration, use \`docker inspect\`.`
          },
          {
            type: 'command',
            command: {
              command: 'docker inspect',
              description: 'View detailed container information',
              example: 'docker inspect webserver'
            }
          },
          {
            type: 'content',
            markdown: `This shows everything: IP address, volumes, environment variables, and more.

## Executing Commands in Running Containers

Need to poke around inside a running container? Use \`docker exec\`. This command runs from your **host machine** and opens a shell inside the running container.`
          },
          {
            type: 'command',
            command: {
              command: 'docker exec -it webserver sh',
              description: 'Open a shell in a running container',
              example: 'docker exec -it webserver sh'
            }
          },
          {
            type: 'content',
            markdown: `You're now inside the running nginx container! You can explore the filesystem, check configurations, or debug issues.

**Remember**: While inside the container, you can only run regular Linux commands (like \`ls\`, \`cat\`, \`ps\`). Docker commands won't work here - you need to run them from your host machine.

Type \`exit\` to leave the container and return to your host machine (the container keeps running!).

## Cleanup

Let's clean up our containers.`
          },
          {
            type: 'command',
            command: {
              command: 'docker stop webserver && docker rm webserver',
              description: 'Stop and remove the webserver container',
              example: 'docker stop webserver && docker rm webserver'
            }
          }
        ]
      }
    ],
    labs: [
      {
        id: 'containers-lab',
        title: 'Container Management Lab',
        description: 'Practice running, managing, and debugging containers',
        tasks: [
          {
            id: 'task-1',
            description: 'Run an nginx container named "my-web" in the background',
            hint: 'Use docker run with -d and --name flags',
            validation: (cmd: string) => cmd.includes('docker run') && cmd.includes('-d') && cmd.includes('my-web') && cmd.includes('nginx'),
            solution: 'docker run -d --name my-web nginx'
          },
          {
            id: 'task-2',
            description: 'View the logs of the my-web container',
            hint: 'Use docker logs followed by the container name',
            validation: (cmd: string) => cmd.includes('docker logs') && cmd.includes('my-web'),
            solution: 'docker logs my-web'
          },
          {
            id: 'task-3',
            description: 'Stop the my-web container',
            hint: 'Use docker stop followed by the container name',
            validation: (cmd: string) => cmd.includes('docker stop') && cmd.includes('my-web'),
            solution: 'docker stop my-web'
          }
        ]
      }
    ],
    quizzes: []
  },
  {
    id: 'networking',
    title: 'Container Networking',
    icon: 'network',
    sequenceOrder: 3,
    lessons: [
      {
        id: 'port-mapping',
        title: 'Exposing Ports',
        items: [
          {
            type: 'content',
            markdown: `# Container Networking: Exposing Your Apps

So far, we've run containers, but they're isolated from the outside world. How do you access a web server running inside a container?

## The Port Mapping Problem

Containers have their own network. A web server listening on port 80 inside a container isn't automatically accessible from your machine.

**Port mapping** connects a port on your host machine to a port in the container.

## The -p Flag

The syntax is: \`-p HOST_PORT:CONTAINER_PORT\`

For example, \`-p 8080:80\` means:
- Traffic hitting port 8080 on your machine
- Gets forwarded to port 80 in the container

Let's run nginx and make it accessible on port 8080.`
          },
          {
            type: 'command',
            command: {
              command: 'docker run -d -p 8080:80 --name web nginx',
              description: 'Run nginx with port mapping',
              example: 'docker run -d -p 8080:80 --name web nginx'
            }
          },
          {
            type: 'content',
            markdown: `Now nginx is accessible at http://localhost:8080!

Let's verify it's running and check the port mapping.`
          },
          {
            type: 'command',
            command: {
              command: 'docker port web',
              description: 'View port mappings for a container',
              example: 'docker port web'
            }
          },
          {
            type: 'content',
            markdown: `## Testing the Web Server

Let's make a request to our containerized web server.`
          },
          {
            type: 'command',
            command: {
              command: 'curl http://localhost:8080',
              description: 'Test the nginx web server',
              example: 'curl http://localhost:8080'
            }
          },
          {
            type: 'content',
            markdown: `You should see nginx's welcome page HTML!

## Multiple Ports

Containers can expose multiple ports. For example, an app might have:
- Port 80 for HTTP
- Port 443 for HTTPS
- Port 9090 for metrics

You can map multiple ports:
\`\`\`
docker run -p 8080:80 -p 8443:443 myapp
\`\`\`

## Clean Up

Let's stop and remove our web container.`
          },
          {
            type: 'command',
            command: {
              command: 'docker stop web && docker rm web',
              description: 'Clean up the web container',
              example: 'docker stop web && docker rm web'
            }
          }
        ]
      }
    ],
    labs: [],
    quizzes: []
  },
  {
    id: 'volumes',
    title: 'Data Persistence',
    icon: 'file-key',
    sequenceOrder: 4,
    lessons: [
      {
        id: 'intro-volumes',
        title: 'Docker Volumes',
        items: [
          {
            type: 'content',
            markdown: `# Data Persistence with Volumes

Here's a critical concept: **containers are ephemeral**.

When a container is removed, all data inside it is lost. This is usually fine for stateless applications, but what about:
- Database files?
- User uploads?
- Configuration files?
- Log files you want to keep?

## Docker Volumes to the Rescue

Volumes are Docker's way of persisting data. They exist outside the container lifecycle.

**Key benefits:**
- Data survives container removal
- Volumes can be shared between containers
- Data is stored in a Docker-managed location
- Easier to backup and migrate

## Creating Volumes

Let's create a volume and use it with a container.`
          },
          {
            type: 'command',
            command: {
              command: 'docker volume create mydata',
              description: 'Create a Docker volume',
              example: 'docker volume create mydata'
            }
          },
          {
            type: 'content',
            markdown: `Now let's see our volumes.`
          },
          {
            type: 'command',
            command: {
              command: 'docker volume ls',
              description: 'List all volumes',
              example: 'docker volume ls'
            }
          },
          {
            type: 'content',
            markdown: `## Using Volumes with Containers

The \`-v\` flag mounts a volume into a container:
\`\`\`
-v VOLUME_NAME:CONTAINER_PATH
\`\`\`

Let's mount our volume and write some data.`
          },
          {
            type: 'command',
            command: {
              command: 'docker run -v mydata:/data alpine sh -c "echo Hello from container > /data/test.txt"',
              description: 'Write data to a volume',
              example: 'docker run -v mydata:/data alpine sh -c "echo Hello from container > /data/test.txt"'
            }
          },
          {
            type: 'content',
            markdown: `That container created a file and exited. Now let's prove the data persists by running a NEW container that reads the same volume.`
          },
          {
            type: 'command',
            command: {
              command: 'docker run -v mydata:/data alpine cat /data/test.txt',
              description: 'Read data from the volume in a new container',
              example: 'docker run -v mydata:/data alpine cat /data/test.txt'
            }
          },
          {
            type: 'content',
            markdown: `The data survived! This is how databases, file storage, and other stateful applications work with Docker.

## Cleanup

Volumes persist even when all containers using them are removed. To delete a volume:`
          },
          {
            type: 'command',
            command: {
              command: 'docker volume rm mydata',
              description: 'Remove a volume',
              example: 'docker volume rm mydata'
            }
          }
        ]
      }
    ],
    labs: [],
    quizzes: []
  }
];

// ============================================
// PROGRESS PERSISTENCE
// ============================================

const DOCKER_PROGRESS_KEY = 'docker-course-progress';

function loadDockerProgress(): { completedLessons: Set<string>; completedCommands: Set<string>; completedTasks: Set<string> } {
  try {
    const saved = localStorage.getItem(DOCKER_PROGRESS_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        completedLessons: new Set(data.completedLessons || []),
        completedCommands: new Set(data.completedCommands || []),
        completedTasks: new Set(data.completedTasks || [])
      };
    }
  } catch (e) {
    console.warn('Failed to load Docker progress from localStorage:', e);
  }
  return { completedLessons: new Set(), completedCommands: new Set(), completedTasks: new Set() };
}

// ============================================
// MAIN APP COMPONENT
// ============================================

interface AppProps {
  courseModules?: Module[];
}

export default function App({ courseModules: propCourseModules }: AppProps = {}) {
  // ALWAYS use the new hardcoded courseModules with proper Docker content
  // The API data from backend has outdated Kubernetes-style content
  const modules = courseModules;

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

  const [selectedModule, setSelectedModule] = useState(modules[0]?.id || 'introduction');
  const [selectedLesson, setSelectedLesson] = useState(modules[0]?.lessons?.[0]?.id || 'what-is-docker');

  // Load progress from localStorage on mount
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => loadDockerProgress().completedLessons);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(() => loadDockerProgress().completedTasks);
  const [completedCommands, setCompletedCommands] = useState<Set<string>>(() => loadDockerProgress().completedCommands);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(DOCKER_PROGRESS_KEY, JSON.stringify({
        completedLessons: Array.from(completedLessons),
        completedCommands: Array.from(completedCommands),
        completedTasks: Array.from(completedTasks)
      }));
    } catch (e) {
      console.warn('Failed to save Docker progress to localStorage:', e);
    }
  }, [completedLessons, completedCommands, completedTasks]);

  // Stable session ID for the terminal - only created once per component mount
  const terminalSessionId = useMemo(() => `docker-${Date.now()}`, []);

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

  // Check if we should use progressive mode for API-loaded modules
  // This is used when loading content from the backend API
  const isModule1 = currentModule?.id === 'module-1' ||
                    currentModule?.slug === '791';
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

  // Use common gating hook with progressive reveal
  const {
    canAccessLesson,
    canAccessModule,
    getLessonAccessInfo,
    getVisibleModules,
    isModuleTeaser,
    getProgressInfo,
    getModuleCompletionPercentage
  } = useLessonGating(completedLessons, modules);

  // Get accessibility info for current lesson
  const {
    isAccessible: isCurrentLessonAccessible,
    previousLessonTitle,
    moduleAccessible,
    previousModuleTitle
  } = currentLesson
    ? getLessonAccessInfo(currentLesson.id)
    : { isAccessible: true, previousLessonTitle: undefined, moduleAccessible: true, previousModuleTitle: undefined };

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

  // Get visibility and progress info for header
  const visibleModuleIds = getVisibleModules();
  const progressInfo = getProgressInfo();

  // Render the app with full-width layout
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Compact Top Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-blue-600">🐳 Docker Course</h1>
          <span className="text-slate-300">|</span>

          {/* Module Dropdown */}
          <select
            value={selectedModule || ''}
            onChange={(e) => {
              const module = modules.find(m => m.id === e.target.value);
              if (module && module.lessons.length > 0) {
                onSelectLesson(module.id, module.lessons[0].id);
              }
            }}
            className="text-sm font-medium text-slate-700 bg-transparent border-none focus:outline-none cursor-pointer hover:text-blue-600"
          >
            {modules.filter(m => visibleModuleIds.includes(m.id)).map((module) => {
              const moduleCompleted = module.lessons.every(lesson =>
                completedLessons.has(lesson.id)
              );
              const isModuleAccessible = canAccessModule(module.id);
              const completionPercentage = getModuleCompletionPercentage(module.id);

              return (
                <option key={module.id} value={module.id} disabled={!isModuleAccessible}>
                  {moduleCompleted && '✓ '}
                  {module.title}
                  {completionPercentage > 0 && !moduleCompleted && ` (${completionPercentage}%)`}
                  {!isModuleAccessible && ' 🔒'}
                </option>
              );
            })}
          </select>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            {progressInfo.completedModules}/{progressInfo.totalModules} modules
          </span>
          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressInfo.overallProgress}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-700">
            {progressInfo.overallProgress}%
          </span>
        </div>
      </div>

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Reusable Component */}
        <CourseSidebar
          currentModule={currentModule}
          currentLesson={currentLesson}
          selectedLesson={selectedLesson}
          completedLessons={completedLessons}
          getModuleCompletionPercentage={getModuleCompletionPercentage}
          canAccessLesson={canAccessLesson}
          onSelectLesson={onSelectLesson}
        />

        {/* Main content with terminal */}
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
                  moduleAccessible={moduleAccessible}
                  previousModuleTitle={previousModuleTitle}
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
            <XTerminal
              expectedCommand={isQuiz ? null : expectedCommand}
              onCommand={
                isQuiz
                  ? handleQuizCommand
                  : handleTerminalCommand
              }
              sessionId={terminalSessionId}
              containerImage="docker:cli"
              enableDocker={true}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
