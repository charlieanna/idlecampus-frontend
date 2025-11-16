/**
 * Test Setup File
 *
 * Shared mocks and configuration for all test files
 */

import { vi } from 'vitest';

// Mock React Flow - Provides all necessary exports including default
export const setupReactFlowMocks = () => {
  vi.mock('reactflow', async () => {
    const actual = await vi.importActual<typeof import('reactflow')>('reactflow');
    return {
      ...actual,
      default: ({ children }: any) => <div data-testid="react-flow">{children}</div>,
      ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
      useNodesState: () => [[], vi.fn(), vi.fn()],
      useEdgesState: () => [[], vi.fn(), vi.fn()],
      ReactFlow: ({ children }: any) => <div data-testid="react-flow">{children}</div>,
      Background: () => null,
      Controls: () => null,
      addEdge: (edge: any, edges: any[]) => [...edges, edge],
      MarkerType: { ArrowClosed: 'arrowclosed' },
      BackgroundVariant: { Dots: 'dots' },
    };
  });
};

// Mock Monaco Editor
export const setupMonacoMocks = () => {
  vi.mock('@monaco-editor/react', () => ({
    default: ({ value, onChange }: any) => (
      <textarea
        data-testid="monaco-editor"
        value={value}
        onChange={(e: any) => onChange?.(e.target.value)}
      />
    ),
  }));
};

// Combined setup for convenience
export const setupAllMocks = () => {
  setupReactFlowMocks();
  setupMonacoMocks();
};
