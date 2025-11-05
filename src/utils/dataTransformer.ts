// Transform Rails API data to App component format

import type { Course, Module as APIModule, Lesson as APILesson, Lab as APILab } from '../services/api';

// App component types
export interface Command {
  command: string;
  description: string;
  example: string;
}

export type LessonItem = 
  | { type: 'content'; markdown: string }
  | { type: 'command'; command: Command };

export interface Lesson {
  id: string;
  title: string;
  items: LessonItem[];
  content?: string;
  commands?: Command[];
}

export interface Task {
  id: string;
  description: string;
  hint: string;
  validation: (command: string) => boolean;
  solution: string;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}

export type QuizQuestion = 
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

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  lessons: Lesson[];
  labs: Lab[];
  quizzes?: Quiz[];
}

// Extract commands from markdown content
function extractCommandsFromContent(content: string, keyCommands?: string[]): { items: LessonItem[], commands: Command[] } {
  const items: LessonItem[] = [];
  const commands: Command[] = [];

  // FIXED: For Kubernetes lessons with key_commands, show ALL content first, then commands
  // This prevents commands from being inserted too early in the content
  if (keyCommands && keyCommands.length > 0) {
    // Add all content as a single markdown block first
    items.push({
      type: 'content',
      markdown: content
    });

    // Then add all commands at the end as interactive elements
    keyCommands.forEach(cmdString => {
      const cmd = parseCommand(cmdString);
      commands.push(cmd);
      items.push({
        type: 'command',
        command: cmd
      });
    });
  } else {
    // Just add the content as-is
    items.push({
      type: 'content',
      markdown: content
    });
  }

  return { items, commands };
}

// Parse command string into Command object
function parseCommand(cmdString: string): Command {
  // Format: "kubectl get pods - List all pods - kubectl get pods -o wide"
  // Or simpler formats
  const parts = cmdString.split(' - ').map(s => s.trim());
  
  if (parts.length >= 3) {
    return {
      command: parts[0],
      description: parts[1],
      example: parts[2]
    };
  } else if (parts.length === 2) {
    return {
      command: parts[0],
      description: parts[1],
      example: parts[0]
    };
  } else {
    return {
      command: cmdString,
      description: `Execute ${cmdString}`,
      example: cmdString
    };
  }
}

// Get icon for module based on title/slug
function getModuleIcon(title: string, slug: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerSlug = slug.toLowerCase();
  
  if (lowerTitle.includes('pod') || lowerSlug.includes('pod')) return 'box';
  if (lowerTitle.includes('deployment') || lowerSlug.includes('workload')) return 'layers';
  if (lowerTitle.includes('service') || lowerTitle.includes('network')) return 'network';
  if (lowerTitle.includes('config') || lowerTitle.includes('secret') || lowerSlug.includes('storage')) return 'file-key';
  if (lowerTitle.includes('troubleshoot')) return 'alert-circle';
  if (lowerTitle.includes('maintenance')) return 'settings';
  
  return 'box'; // default
}

// Transform API lesson to App lesson
function transformLesson(apiLesson: APILesson): Lesson {
  const { items, commands } = extractCommandsFromContent(
    apiLesson.content || '',
    apiLesson.key_commands
  );
  
  return {
    id: `lesson-${apiLesson.id}`,
    title: apiLesson.title,
    items,
    content: apiLesson.content,
    commands
  };
}

// Transform API lab to App lab
function transformLab(apiLab: APILab): Lab {
  const tasks: Task[] = [];

  // Transform steps into tasks
  if (apiLab.steps && Array.isArray(apiLab.steps)) {
    apiLab.steps.forEach((step: any, index: number) => {
      const taskId = `task-${apiLab.id}-${index + 1}`;

      // FIXED: Handle both API formats
      // API format 1: { title, instruction, expected_command, validation }
      // API format 2: { description, task, ... }
      // Use instruction as description (the full task text shown to user)
      const description = step.instruction || step.description || step.task || step.title || (typeof step === 'string' ? step : '');
      // Use title as hint (shown when user clicks "Show Hint")
      const hint = step.title || apiLab.hints?.[index] || 'Try the command shown in the solution';
      const solution = step.expected_command || apiLab.validation_commands?.[index] || '';

      tasks.push({
        id: taskId,
        description,
        hint,
        validation: (cmd: string) => {
          // Basic validation - check if command contains key parts
          const cleanCmd = cmd.trim().toLowerCase();
          const cleanSolution = solution.toLowerCase();
          return cleanCmd.includes(cleanSolution) || cleanCmd === cleanSolution;
        },
        solution
      });
    });
  }
  
  // If no steps, create a basic task structure from objectives
  if (tasks.length === 0 && apiLab.objectives) {
    // Handle both string and array objectives
    const objectivesArray = typeof apiLab.objectives === 'string'
      ? [apiLab.objectives]
      : Array.isArray(apiLab.objectives)
        ? apiLab.objectives
        : [];

    objectivesArray.forEach((obj: string, index: number) => {
      tasks.push({
        id: `task-${apiLab.id}-${index + 1}`,
        description: obj,
        hint: 'Use Docker commands to complete this objective',
        validation: () => false, // Will need actual implementation
        solution: 'docker help'
      });
    });
  }
  
  return {
    id: `lab-${apiLab.id}`,
    title: apiLab.title,
    description: apiLab.description || '',
    tasks
  };
}

// Transform API module to App module
export function transformModule(apiModule: APIModule, labs: APILab[], includeAllLabs: boolean = false): Module {
  // Backend API includes both lessons and labs in separate arrays
  // The `items` array (if present) has all content with a `type` field
  const lessonItems: Lesson[] = [];
  const labItems: Lab[] = [];

  // Check if API provides the combined `items` array (Kubernetes API format)
  const itemsArray = (apiModule as any).items || [];

  if (itemsArray.length > 0) {
    // Use the items array which has all content with type field
    itemsArray.forEach((item: any) => {
      if (item.type === 'lab') {
        // Transform lab item
        labItems.push(transformLab(item));
      } else if (item.type === 'lesson') {
        // Transform lesson item
        lessonItems.push(transformLesson(item));
      }
    });
  } else if (apiModule.lessons && apiModule.lessons.length > 0) {
    // Fallback: check if lessons array contains mixed content with contentType field (Docker API format)
    apiModule.lessons.forEach((item: any) => {
      if (item.contentType === 'HandsOnLab' || item.contentType === 'lab') {
        // Convert lab structure from API to Lab type
        const tasks: Task[] = [];

        if (item.steps && Array.isArray(item.steps)) {
          item.steps.forEach((step: any, index: number) => {
            tasks.push({
              id: `task-${item.id}-${index + 1}`,
              description: step.instruction || step.description || step.title || '',
              hint: step.title || item.hints?.[index] || 'Follow the instructions',
              validation: () => false, // Basic validation
              solution: step.expected_command || ''
            });
          });
        }

        console.log(`🧪 Transformed lab: ${item.title}, tasks: ${tasks.length}`, tasks);

        labItems.push({
          id: `lab-${item.id}`,
          title: item.title,
          description: item.description || '',
          tasks
        });
      } else if (item.contentType === 'Quiz') {
        // Handle Quiz items - for now, show as lesson with description
        lessonItems.push({
          id: `quiz-${item.id}`,
          title: item.title,
          items: [
            { type: 'content' as const, markdown: `# ${item.title}\n\n${item.content || item.description || 'Quiz content'}` }
          ],
          content: item.content || item.description,
          commands: []
        });
      } else {
        // Regular lesson (CourseLesson)
        lessonItems.push(transformLesson(item));
      }
    });
  }

  // Fallback: if no items at all, create overview lesson
  if (lessonItems.length === 0 && labItems.length === 0) {
    lessonItems.push({
      id: `module-${apiModule.id}-overview`,
      title: `${apiModule.title} Overview`,
      items: [
        { type: 'content' as const, markdown: apiModule.description || 'Content coming soon.' }
      ],
      content: apiModule.description || undefined,
      commands: []
    });
  }

  const result = {
    id: `module-${apiModule.id}`,
    title: apiModule.title,
    icon: getModuleIcon(apiModule.title, apiModule.slug),
    lessons: lessonItems,
    labs: labItems,
    quizzes: [] // TODO: Add quiz support when available
  };

  console.log(`📦 Module transformed: ${result.title}, lessons: ${lessonItems.length}, labs: ${labItems.length}`);

  return result;
}

// Transform full course data
export function transformCourseData(_course: Course, modules: APIModule[], labs: APILab[]): Module[] {
  // Transform modules - labs are already included in each module's lessons array by the backend
  const transformedModules = modules.map(mod => transformModule(mod, labs, false));

  // Backend API now organizes labs within modules, so no separate labs module needed
  return transformedModules;
}

