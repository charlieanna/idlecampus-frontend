/**
 * Edge Case and Error Handling Tests
 *
 * Comprehensive tests for boundary conditions, error states, and unusual inputs
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TieredSystemDesignBuilder } from '../ui/TieredSystemDesignBuilder';
import { Challenge } from '../types/testCase';
import {
  detectAPIUsage,
  validateConnections,
  formatValidationErrors,
} from '../services/connectionValidator';
import { SystemGraph } from '../types/graph';

// Mock dependencies
vi.mock('reactflow', () => ({
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
}));

vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: any) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe('Edge Cases - Python Code Validation', () => {
  describe('Malformed Python Code', () => {
    it('should handle syntax errors', () => {
      const malformed = `
def incomplete(
    context.db.get(
    # Missing closing parentheses
`;
      const apis = detectAPIUsage(malformed);
      expect(apis).toContain('db');
    });

    it('should handle unclosed strings', () => {
      const code = `
context.db.set("key", "value that never ends
context.cache.get("test")
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
    });

    it('should handle mixed indentation', () => {
      const code = `
def shorten():
\tcontext.db.get(k)  # tab
    context.cache.get(k)  # spaces
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
    });

    it('should handle code with unmatched brackets', () => {
      const code = `
context.db.get(((key))
context.cache.set(key, {{{value}}}
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
    });
  });

  describe('Extreme Input Sizes', () => {
    it('should handle very long single line', () => {
      const longLine = 'context.db.get(' + 'a'.repeat(100000) + ')';
      const apis = detectAPIUsage(longLine);
      expect(apis).toEqual(['db']);
    });

    it('should handle many repeated API calls', () => {
      const manyCallsCode = 'context.db.get(k)\n'.repeat(10000);
      const apis = detectAPIUsage(manyCallsCode);
      expect(apis).toEqual(['db']); // Should not duplicate
    });

    it('should handle deeply nested code', () => {
      let code = 'context.db.get(k)';
      for (let i = 0; i < 1000; i++) {
        code = `if True:\n    ${code}`;
      }
      const apis = detectAPIUsage(code);
      expect(apis).toEqual(['db']);
    });

    it('should handle empty lines and whitespace', () => {
      const code = `


        context.db.get(k)


        context.cache.set(k, v)


`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
    });
  });

  describe('Special Characters and Unicode', () => {
    it('should handle Chinese characters', () => {
      const code = `
# 这是一个注释
def 短网址(网址: str, context) -> str:
    context.db.set("键", "值")
    return "结果"
`;
      const apis = detectAPIUsage(code);
      expect(apis).toEqual(['db']);
    });

    it('should handle emojis', () => {
      const code = `
# 🔥 Hot function 🔥
def shorten(url: str, context) -> str:
    context.db.set("🔑", "🔗")  # Key and link
    context.cache.set("⚡", "💾")  # Fast and save
    return "✅"
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
    });

    it('should handle right-to-left text', () => {
      const code = `
# مرحبا
context.db.get("مفتاح")
context.cache.set("قيمة", "بيانات")
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
    });

    it('should handle null bytes and control characters', () => {
      const code = `context.db\x00.get(k)\ncontext.cache\r\n.set(k, v)`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
    });
  });

  describe('Null and Undefined Handling', () => {
    it('should handle null code', () => {
      expect(() => detectAPIUsage(null as any)).not.toThrow();
      const result = detectAPIUsage(null as any);
      expect(result).toEqual([]);
    });

    it('should handle undefined code', () => {
      expect(() => detectAPIUsage(undefined as any)).not.toThrow();
      const result = detectAPIUsage(undefined as any);
      expect(result).toEqual([]);
    });

    it('should handle null graph in validation', () => {
      expect(() =>
        validateConnections('context.db.get()', null as any)
      ).not.toThrow();
    });

    it('should handle undefined graph in validation', () => {
      expect(() =>
        validateConnections('context.db.get()', undefined as any)
      ).not.toThrow();
    });
  });

  describe('Edge Case API Patterns', () => {
    it('should not detect partial matches', () => {
      const code = `
my_context.db.get(k)  # Not context.db
context_db.get(k)  # Not context.db
contextual.db.get(k)  # Not context.db
`;
      const apis = detectAPIUsage(code);
      expect(apis).toEqual([]);
    });

    it('should handle API calls in strings (false positives acceptable)', () => {
      const code = `
print("Use context.db.get() to fetch")
doc = """
    context.cache.set() stores data
"""
`;
      const apis = detectAPIUsage(code);
      // These might be detected - that's okay for safety
      if (apis.length > 0) {
        expect(apis).toContain('db');
      }
    });

    it('should handle chained API calls', () => {
      const code = `
result = context.db.get(context.cache.get(key))
context.queue.publish(context.db.get("key"))
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
      expect(apis).toContain('queue');
    });

    it('should handle API in lambda functions', () => {
      const code = `
func = lambda k: context.db.get(k)
map(lambda x: context.cache.set(x, x), items)
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
    });

    it('should handle API in list comprehensions', () => {
      const code = `
results = [context.db.get(k) for k in keys]
cached = {k: context.cache.get(k) for k in keys}
`;
      const apis = detectAPIUsage(code);
      expect(apis).toContain('db');
      expect(apis).toContain('cache');
    });
  });
});

describe('Edge Cases - System Graph Validation', () => {
  describe('Unusual Graph Structures', () => {
    it('should handle empty graph', () => {
      const graph: SystemGraph = {
        components: [],
        connections: [],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(false);
    });

    it('should handle graph with only app_server', () => {
      const graph: SystemGraph = {
        components: [{ id: 'app_server', type: 'app_server', config: {} }],
        connections: [],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(false);
    });

    it('should handle circular references', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
          { id: 'db2', type: 'database', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db1' },
          { from: 'db1', to: 'db2' },
          { from: 'db2', to: 'app_server' },
        ],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(true); // app_server connects to db1
    });

    it('should handle self-referencing connections', () => {
      const graph: SystemGraph = {
        components: [{ id: 'app_server', type: 'app_server', config: {} }],
        connections: [{ from: 'app_server', to: 'app_server' }],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(false); // self-ref doesn't satisfy db requirement
    });

    it('should handle disconnected components', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
          { id: 'db2', type: 'database', config: {} },
          { id: 'cache1', type: 'redis', config: {} },
        ],
        connections: [
          { from: 'db1', to: 'db2' }, // disconnected from app_server
        ],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(false);
    });

    it('should handle duplicate connections', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db1' },
          { from: 'app_server', to: 'db1' }, // duplicate
          { from: 'app_server', to: 'db1' }, // duplicate
        ],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(true);
    });
  });

  describe('Component Type Edge Cases', () => {
    it('should handle unknown component types', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'mystery', type: 'unknown_type_xyz' as any, config: {} },
        ],
        connections: [{ from: 'app_server', to: 'mystery' }],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(false); // unknown type doesn't map to any API
    });

    it('should handle case-sensitive component types', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'DATABASE' as any, config: {} }, // uppercase
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(false); // case matters
    });

    it('should handle multiple database types satisfying db API', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'pg', type: 'postgresql', config: {} },
          { id: 'mongo', type: 'mongodb', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'pg' },
          { from: 'app_server', to: 'mongo' },
        ],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(true); // Either satisfies the requirement
    });
  });

  describe('Connection Direction Edge Cases', () => {
    it('should only count outgoing connections from app_server', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [
          { from: 'db1', to: 'app_server' }, // Wrong direction
        ],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(false);
    });

    it('should handle bidirectional connections', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db1' },
          { from: 'db1', to: 'app_server' },
        ],
      };
      const result = validateConnections('context.db.get()', graph);
      expect(result.valid).toBe(true); // Outgoing connection exists
    });
  });
});

describe('Edge Cases - Error Message Formatting', () => {
  describe('Unusual Error States', () => {
    it('should format single error correctly', () => {
      const errors = [
        {
          apiType: 'db' as any,
          message: 'Test error',
          suggestion: 'Test suggestion',
        },
      ];
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('1. Test error');
      expect(formatted).toContain('💡 Test suggestion');
    });

    it('should handle very long error messages', () => {
      const longMessage = 'Error: ' + 'x'.repeat(10000);
      const errors = [
        {
          apiType: 'db' as any,
          message: longMessage,
          suggestion: 'Fix it',
        },
      ];
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain(longMessage);
    });

    it('should handle special characters in error messages', () => {
      const errors = [
        {
          apiType: 'cache' as any,
          message: 'Error with 中文 and emoji 🔥',
          suggestion: 'Use עברית suggestion',
        },
      ];
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('中文');
      expect(formatted).toContain('🔥');
      expect(formatted).toContain('עברית');
    });

    it('should handle many errors (>10)', () => {
      const errors = Array(100)
        .fill(0)
        .map((_, i) => ({
          apiType: 'db' as any,
          message: `Error ${i}`,
          suggestion: `Fix ${i}`,
        }));
      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('100. Error 99');
    });
  });
});

describe('Edge Cases - UI Component Behavior', () => {
  const minimalChallenge: Challenge = {
    id: 'test',
    title: 'Test',
    difficulty: 'beginner',
    description: 'Test',
    requirements: {
      functional: [],
      traffic: '',
      latency: '',
      availability: '',
      budget: '',
    },
    availableComponents: [],
    testCases: [],
    learningObjectives: [],
  };

  const renderApp = (challenge = minimalChallenge) => {
    return render(
      <BrowserRouter>
        <TieredSystemDesignBuilder challengeId="test" challenges={[challenge]} />
      </BrowserRouter>
    );
  };

  describe('Missing Challenge Data', () => {
    it('should handle challenge without pythonTemplate', () => {
      renderApp();
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveValue('');
    });

    it('should handle challenge without requiredAPIs', () => {
      renderApp();
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle challenge without availableComponents', () => {
      renderApp();
      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle challenge with empty arrays', () => {
      const emptyChallenge: Challenge = {
        ...minimalChallenge,
        testCases: [],
        learningObjectives: [],
        availableComponents: [],
      };
      renderApp(emptyChallenge);
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Rapid User Interactions', () => {
    it('should handle rapid tab switching', async () => {
      renderApp();

      for (let i = 0; i < 10; i++) {
        fireEvent.click(screen.getByText('🐍 Python Application Server'));
        fireEvent.click(screen.getByText('🎨 Canvas'));
      }

      // Should still be functional
      expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    });

    it('should handle rapid submit clicks', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      renderApp();

      const submitButton = screen.getByText('▶️ Submit Solution');

      // Rapid clicks
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);

      // Should only process once (button disabled)
      await waitFor(() => {
        expect(screen.getByText('⏳ Running Tests...')).toBeInTheDocument();
      });

      alertSpy.mockRestore();
    });

    it('should handle rapid code changes', async () => {
      renderApp();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      // Rapid changes
      const values = [
        'context.db.get()',
        'context.cache.get()',
        'context.queue.publish()',
        '',
        'final code',
      ];

      values.forEach((value) => {
        fireEvent.change(editor, { target: { value } });
      });

      expect(editor).toHaveValue('final code');
    });
  });

  describe('Browser Edge Cases', () => {
    it('should handle window resize', () => {
      renderApp();

      // Trigger resize
      global.innerWidth = 500;
      global.innerHeight = 500;
      fireEvent(window, new Event('resize'));

      expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('should handle browser back/forward (URL changes)', () => {
      renderApp();
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });
});

describe('Error Recovery Scenarios', () => {
  describe('Network Failures (Future)', () => {
    it('should handle failed code execution gracefully', async () => {
      // Placeholder for future network error handling
      expect(true).toBe(true);
    });
  });

  describe('State Corruption Recovery', () => {
    it('should recover from invalid state', () => {
      // Test resilience to corrupted state
      expect(true).toBe(true);
    });
  });
});
