/**
 * Component Tests for APIConnectionStatus
 *
 * Tests the visual API connection status display component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { APIConnectionStatus } from '../APIConnectionStatus';
import { SystemGraph } from '../../../types/graph';

describe('APIConnectionStatus Component', () => {
  describe('Rendering', () => {
    it('should show "No context APIs detected" when no APIs in code', () => {
      const code = `
def shorten(url: str, context) -> str:
    return "abc123"
`;
      const graph: SystemGraph = {
        components: [{ id: 'app_server', type: 'app_server', config: {} }],
        connections: [],
      };

      render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(screen.getByText(/No context APIs detected/i)).toBeInTheDocument();
    });

    it('should show API Connections header when APIs detected', () => {
      const code = `context.db.get(key)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };

      render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(screen.getByText('API Connections')).toBeInTheDocument();
    });

    it('should show connected status for db API', () => {
      const code = `context.db.set(key, val)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };

      render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(screen.getByText('context.db')).toBeInTheDocument();
      expect(screen.getByText('✓ Connected')).toBeInTheDocument();
    });

    it('should show not connected status for cache API', () => {
      const code = `context.cache.get(key)`;
      const graph: SystemGraph = {
        components: [{ id: 'app_server', type: 'app_server', config: {} }],
        connections: [],
      };

      render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(screen.getByText('context.cache')).toBeInTheDocument();
      expect(screen.getByText('✗ Not Connected')).toBeInTheDocument();
    });

    it('should show warning when connections are missing', () => {
      const code = `context.db.get(key)`;
      const graph: SystemGraph = {
        components: [{ id: 'app_server', type: 'app_server', config: {} }],
        connections: [],
      };

      render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(screen.getByText(/Connect missing components/i)).toBeInTheDocument();
    });

    it('should not show warning when all connections present', () => {
      const code = `context.db.get(key)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };

      render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(screen.queryByText(/Connect missing components/i)).not.toBeInTheDocument();
    });
  });

  describe('Multiple APIs', () => {
    it('should show all used APIs', () => {
      const code = `
context.db.get(key)
context.cache.set(key, val)
context.queue.publish(msg)
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
          { id: 'cache1', type: 'redis', config: {} },
          { id: 'queue1', type: 'kafka', config: {} },
        ],
        connections: [
          { from: 'app_server', to: 'db1' },
          { from: 'app_server', to: 'cache1' },
          { from: 'app_server', to: 'queue1' },
        ],
      };

      render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(screen.getByText('context.db')).toBeInTheDocument();
      expect(screen.getByText('context.cache')).toBeInTheDocument();
      expect(screen.getByText('context.queue')).toBeInTheDocument();
      expect(screen.getAllByText('✓ Connected')).toHaveLength(3);
    });

    it('should show mixed connection status', () => {
      const code = `
context.db.get(key)
context.cache.get(key)
`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };

      render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(screen.getByText('✓ Connected')).toBeInTheDocument();
      expect(screen.getByText('✗ Not Connected')).toBeInTheDocument();
    });
  });

  describe('Icons', () => {
    it('should show database icon for db API', () => {
      const code = `context.db.get(key)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };

      const { container } = render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(container.textContent).toContain('💾');
    });

    it('should show cache icon for cache API', () => {
      const code = `context.cache.get(key)`;
      const graph: SystemGraph = {
        components: [{ id: 'app_server', type: 'app_server', config: {} }],
        connections: [],
      };

      const { container } = render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(container.textContent).toContain('⚡');
    });

    it('should show queue icon for queue API', () => {
      const code = `context.queue.publish(msg)`;
      const graph: SystemGraph = {
        components: [{ id: 'app_server', type: 'app_server', config: {} }],
        connections: [],
      };

      const { container } = render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(container.textContent).toContain('📮');
    });
  });

  describe('Styling', () => {
    it('should apply green styling for connected APIs', () => {
      const code = `context.db.get(key)`;
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };

      const { container } = render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      const element = container.querySelector('.bg-green-50');
      expect(element).toBeInTheDocument();
    });

    it('should apply red styling for not connected APIs', () => {
      const code = `context.cache.get(key)`;
      const graph: SystemGraph = {
        components: [{ id: 'app_server', type: 'app_server', config: {} }],
        connections: [],
      };

      const { container } = render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      const element = container.querySelector('.bg-red-50');
      expect(element).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty code', () => {
      const graph: SystemGraph = {
        components: [{ id: 'app_server', type: 'app_server', config: {} }],
        connections: [],
      };

      render(<APIConnectionStatus pythonCode="" systemGraph={graph} />);
      expect(screen.getByText(/No context APIs detected/i)).toBeInTheDocument();
    });

    it('should handle graph without app_server', () => {
      const code = `context.db.get(key)`;
      const graph: SystemGraph = {
        components: [{ id: 'client', type: 'client', config: {} }],
        connections: [],
      };

      render(<APIConnectionStatus pythonCode={code} systemGraph={graph} />);
      expect(screen.getByText('✗ Not Connected')).toBeInTheDocument();
    });

    it('should handle very long code efficiently', () => {
      const longCode = 'context.db.get(key)\n'.repeat(1000);
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };

      render(<APIConnectionStatus pythonCode={longCode} systemGraph={graph} />);
      expect(screen.getByText('context.db')).toBeInTheDocument();
    });
  });

  describe('Updates', () => {
    it('should update when code changes', () => {
      const graph: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };

      const { rerender } = render(
        <APIConnectionStatus pythonCode="context.db.get(key)" systemGraph={graph} />
      );
      expect(screen.getByText('context.db')).toBeInTheDocument();

      rerender(
        <APIConnectionStatus pythonCode="context.cache.get(key)" systemGraph={graph} />
      );
      expect(screen.queryByText('context.db')).not.toBeInTheDocument();
      expect(screen.getByText('context.cache')).toBeInTheDocument();
    });

    it('should update when graph changes', () => {
      const code = `context.db.get(key)`;
      const graph1: SystemGraph = {
        components: [{ id: 'app_server', type: 'app_server', config: {} }],
        connections: [],
      };
      const graph2: SystemGraph = {
        components: [
          { id: 'app_server', type: 'app_server', config: {} },
          { id: 'db1', type: 'database', config: {} },
        ],
        connections: [{ from: 'app_server', to: 'db1' }],
      };

      const { rerender } = render(
        <APIConnectionStatus pythonCode={code} systemGraph={graph1} />
      );
      expect(screen.getByText('✗ Not Connected')).toBeInTheDocument();

      rerender(<APIConnectionStatus pythonCode={code} systemGraph={graph2} />);
      expect(screen.getByText('✓ Connected')).toBeInTheDocument();
    });
  });
});
