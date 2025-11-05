// Types for progressive learning module system

export interface ValidationRule {
  type: 'exact' | 'pattern' | 'semantic';
  value?: string;
  pattern?: string;
  base_command?: string;
  required_flags?: string[];
  description: string;
}

export interface CommandItem {
  type: 'command';
  id: string;
  command: string;
  description: string;
  example: string;
  hint: string;
  validation: ValidationRule;
  alternatives: string[];
}

export interface ContentItem {
  type: 'content';
  id: string;
  markdown: string;
  title: string;
  estimated_minutes: number;
}

export type LessonItem = ContentItem | CommandItem;

export interface ProgressiveModule {
  id: number;
  slug: string;
  title: string;
  description: string;
  sequence_order: number;
  estimated_minutes: number;
  total_commands: number;
  items: LessonItem[];
}

export interface ProgressiveModuleResponse {
  module: ProgressiveModule;
}

export interface ProgressState {
  completedCommands: Set<string>;
  currentCommandIndex: number;
  attemptCounts: Map<string, number>;
  showingHint: boolean;
  showingAnswer: boolean;
}
