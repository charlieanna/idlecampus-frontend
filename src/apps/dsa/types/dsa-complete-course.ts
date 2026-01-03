// Comprehensive type definitions for all DSA algorithm courses

export type VisualizationType = 
  | 'array'
  | 'tree'
  | 'graph'
  | 'linkedlist'
  | 'stack'
  | 'queue'
  | 'heap'
  | 'trie'
  | 'matrix'
  | 'none';

export interface ArrayVisualizationStep {
  type: 'array';
  array: number[];
  pointers?: { index: number; label: string; color?: string }[];
  highlight?: number[];
  partition?: { left: number; right: number; pivot?: number };
  description: string;
}

export interface TreeNode {
  value: string | number;
  left?: TreeNode;
  right?: TreeNode;
  children?: TreeNode[];
  highlight?: boolean;
  color?: string;
}

export interface TreeVisualizationStep {
  type: 'tree';
  tree: TreeNode;
  currentPath?: (string | number)[];
  description: string;
}

export interface GraphVisualizationStep {
  type: 'graph';
  nodes: { id: string; label: string; highlight?: boolean }[];
  edges: { from: string; to: string; weight?: number; highlight?: boolean }[];
  description: string;
}

export interface LinkedListNode {
  value: number | string;
  next?: LinkedListNode;
  highlight?: boolean;
}

export interface LinkedListVisualizationStep {
  type: 'linkedlist';
  head: LinkedListNode | null;
  pointers?: { node: number; label: string }[];
  description: string;
}

export interface StackVisualizationStep {
  type: 'stack';
  stack: (number | string)[];
  highlight?: number;
  operation?: 'push' | 'pop' | 'peek';
  description: string;
}

export interface QueueVisualizationStep {
  type: 'queue';
  queue: (number | string)[];
  front?: number;
  rear?: number;
  operation?: 'enqueue' | 'dequeue' | 'peek';
  description: string;
}

export interface HeapVisualizationStep {
  type: 'heap';
  heap: number[];
  highlight?: number[];
  operation?: 'insert' | 'extractMin' | 'extractMax' | 'heapify';
  description: string;
}

export interface TrieVisualizationStep {
  type: 'trie';
  root: TrieNode;
  currentWord?: string;
  description: string;
}

export interface TrieNode {
  char: string;
  children: Map<string, TrieNode>;
  isEndOfWord?: boolean;
  highlight?: boolean;
}

export type VisualizationStep = 
  | ArrayVisualizationStep
  | TreeVisualizationStep
  | GraphVisualizationStep
  | LinkedListVisualizationStep
  | StackVisualizationStep
  | QueueVisualizationStep
  | HeapVisualizationStep
  | TrieVisualizationStep;

export interface DSATask {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  expectedOutput: string;
  hint?: string;
  testCases?: {
    input: string;
    expectedOutput: string;
    description?: string;
  }[];
  visualization?: {
    type: VisualizationType;
    steps: VisualizationStep[];
  };
  difficulty?: 'easy' | 'medium' | 'hard';
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface DSALesson {
  id: string;
  title: string;
  description: string;
  content: string;
  interactiveTasks: DSATask[];
  completed?: boolean;
  conceptExplanation?: {
    title: string;
    points: string[];
    codeExample?: string;
    visualExample?: string;
  };
  practiceProblems?: {
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    link?: string;
  }[];
}

export interface DSAModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'fundamentals' | 'data-structures' | 'algorithms' | 'advanced';
  estimatedTime?: string;
  lessons: DSALesson[];
  completed?: boolean;
}

export interface DSACourse {
  title: string;
  description: string;
  modules: DSAModule[];
}
