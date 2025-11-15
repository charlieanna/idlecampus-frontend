/**
 * Integration Tests for TieredSystemDesignBuilder
 *
 * Tests user flows and component interactions for the system design builder
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TieredSystemDesignBuilder } from '../TieredSystemDesignBuilder';
import { Challenge } from '../../types/testCase';

// Mock React Flow to avoid canvas rendering issues in tests
vi.mock('reactflow', () => ({
  default: ({ children }: any) => <div data-testid="react-flow">{children}</div>,
  ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
  useNodesState: () => [[], vi.fn(), vi.fn()],
  useEdgesState: () => [[], vi.fn(), vi.fn()],
  ReactFlow: ({ children }: any) => <div data-testid="react-flow">{children}</div>,
  Background: () => <div>Background</div>,
  Controls: () => <div>Controls</div>,
  addEdge: (edge: any, edges: any[]) => [...edges, edge],
  MarkerType: { ArrowClosed: 'arrowclosed' },
  BackgroundVariant: { Dots: 'dots' },
}));

// Mock Monaco Editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ value, onChange }: any) => (
    <textarea
      data-testid="monaco-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const mockTinyUrlChallenge: Challenge = {
  id: 'tiny_url',
  title: 'Tiny URL Shortener',
  difficulty: 'beginner',
  description: 'Design a URL shortening service',
  requirements: {
    functional: ['Shorten URLs', 'Expand URLs'],
    traffic: '1000 RPS',
    latency: 'P99 < 100ms',
    availability: '99.9%',
    budget: '$1000/month',
  },
  availableComponents: ['database', 'cache', 'redis', 'message_queue'],
  testCases: [],
  learningObjectives: ['Learn URL shortening'],
  pythonTemplate: `def shorten(url: str, context) -> str:
    # TODO: implement
    pass

def expand(code: str, context) -> str:
    # TODO: implement
    pass`,
  requiredAPIs: ['db'],
};

const renderBuilder = (challengeId?: string, challenges?: Challenge[]) => {
  return render(
    <BrowserRouter>
      <TieredSystemDesignBuilder
        challengeId={challengeId}
        challenges={challenges || [mockTinyUrlChallenge]}
      />
    </BrowserRouter>
  );
};

describe('TieredSystemDesignBuilder', () => {
  describe('Scenario 1: Initial Page Load', () => {
    it('should load challenge from URL parameter', () => {
      renderBuilder('tiny_url');
      expect(screen.getByText('Tiny URL Shortener')).toBeInTheDocument();
    });

    it('should show Canvas tab as active by default', () => {
      renderBuilder('tiny_url');
      const canvasTab = screen.getByText('🎨 Canvas');
      expect(canvasTab).toHaveClass('border-blue-600');
    });

    it('should show Python tab in tab bar', () => {
      renderBuilder('tiny_url');
      expect(screen.getByText('🐍 Python Application Server')).toBeInTheDocument();
    });

    it('should show problem description panel', () => {
      renderBuilder('tiny_url');
      expect(screen.getByText(/Design a URL shortening service/i)).toBeInTheDocument();
    });

    it('should show component palette', () => {
      renderBuilder('tiny_url');
      expect(screen.getByText(/Component Palette/i)).toBeInTheDocument();
    });

    it('should show submit button', () => {
      renderBuilder('tiny_url');
      expect(screen.getByText('▶️ Submit Solution')).toBeInTheDocument();
    });

    it('should convert URL dashes to underscores', () => {
      renderBuilder('tiny-url'); // URL format
      expect(screen.getByText('Tiny URL Shortener')).toBeInTheDocument();
    });

    it('should handle missing challenge gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderBuilder('nonexistent_challenge');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Challenge not found')
      );
      consoleSpy.mockRestore();
    });
  });

  describe('Scenario 2: View Python Template', () => {
    it('should switch to Python tab when clicked', () => {
      renderBuilder('tiny_url');
      const pythonTab = screen.getByText('🐍 Python Application Server');
      fireEvent.click(pythonTab);

      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    });

    it('should show Python template code', () => {
      renderBuilder('tiny_url');
      fireEvent.click(screen.getByText('🐍 Python Application Server'));

      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveValue(expect.stringContaining('def shorten'));
      expect(editor).toHaveValue(expect.stringContaining('def expand'));
    });

    it('should show API Connection Status on Python tab', () => {
      renderBuilder('tiny_url');
      fireEvent.click(screen.getByText('🐍 Python Application Server'));

      // Should show the API status component
      expect(screen.getByText(/No context APIs detected/i)).toBeInTheDocument();
    });
  });

  describe('Scenario 3: Write Code Using context.db', () => {
    it('should detect API usage when code is written', async () => {
      renderBuilder('tiny_url');
      fireEvent.click(screen.getByText('🐍 Python Application Server'));

      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, {
        target: { value: 'context.db.get(key)' },
      });

      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
      });
    });

    it('should show not connected status initially', async () => {
      renderBuilder('tiny_url');
      fireEvent.click(screen.getByText('🐍 Python Application Server'));

      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, {
        target: { value: 'context.db.get(key)' },
      });

      await waitFor(() => {
        expect(screen.getByText('✗ Not Connected')).toBeInTheDocument();
      });
    });

    it('should show warning message for missing connections', async () => {
      renderBuilder('tiny_url');
      fireEvent.click(screen.getByText('🐍 Python Application Server'));

      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, {
        target: { value: 'context.cache.get(key)' },
      });

      await waitFor(() => {
        expect(screen.getByText(/Connect missing components/i)).toBeInTheDocument();
      });
    });
  });

  describe('Scenario 6: Submit with Missing Connections', () => {
    it('should block submission when connections are missing', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      renderBuilder('tiny_url');

      // Write code using cache
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, {
        target: { value: 'context.cache.get(key)' },
      });

      // Go back to canvas and submit
      fireEvent.click(screen.getByText('🎨 Canvas'));
      const submitButton = screen.getByText('▶️ Submit Solution');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining('context.cache')
        );
      });

      alertSpy.mockRestore();
    });

    it('should show helpful error message in alert', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      renderBuilder('tiny_url');

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, {
        target: { value: 'context.queue.publish(msg)' },
      });

      fireEvent.click(screen.getByText('🎨 Canvas'));
      fireEvent.click(screen.getByText('▶️ Submit Solution'));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining('Add a')
        );
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining('message_queue')
        );
      });

      alertSpy.mockRestore();
    });

    it('should not trigger test execution when validation fails', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      renderBuilder('tiny_url');

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, {
        target: { value: 'context.db.get(key)' },
      });

      fireEvent.click(screen.getByText('🎨 Canvas'));
      const submitButton = screen.getByText('▶️ Submit Solution');
      fireEvent.click(submitButton);

      // Should not show "Running Tests..." because validation failed
      expect(screen.queryByText('⏳ Running Tests...')).not.toBeInTheDocument();

      alertSpy.mockRestore();
    });
  });

  describe('Scenario 9: Valid Submission', () => {
    it('should allow submission when no APIs used', async () => {
      renderBuilder('tiny_url');

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, {
        target: { value: 'def shorten(): return "abc"' },
      });

      fireEvent.click(screen.getByText('🎨 Canvas'));
      const submitButton = screen.getByText('▶️ Submit Solution');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('⏳ Running Tests...')).toBeInTheDocument();
      });
    });

    it('should show running state during submission', async () => {
      renderBuilder('tiny_url');

      const submitButton = screen.getByText('▶️ Submit Solution');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('⏳ Running Tests...')).toBeInTheDocument();
      });
    });

    it('should disable submit button while running', async () => {
      renderBuilder('tiny_url');

      const submitButton = screen.getByText('▶️ Submit Solution');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Scenario 16: Navigation', () => {
    it('should show "All Problems" button', () => {
      renderBuilder('tiny_url');
      expect(screen.getByText('All Problems')).toBeInTheDocument();
    });

    it('should have back button with icon', () => {
      renderBuilder('tiny_url');
      const backButton = screen.getByText('All Problems').closest('button');
      expect(backButton).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should switch between Canvas and Python tabs', () => {
      renderBuilder('tiny_url');

      // Initially on Canvas
      expect(screen.getByTestId('react-flow')).toBeInTheDocument();

      // Switch to Python
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();

      // Switch back to Canvas
      fireEvent.click(screen.getByText('🎨 Canvas'));
      expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    });

    it('should highlight active tab', () => {
      renderBuilder('tiny_url');

      const canvasTab = screen.getByText('🎨 Canvas');
      const pythonTab = screen.getByText('🐍 Python Application Server');

      // Canvas active initially
      expect(canvasTab).toHaveClass('border-blue-600');
      expect(pythonTab).not.toHaveClass('border-blue-600');

      // Switch to Python
      fireEvent.click(pythonTab);
      expect(pythonTab).toHaveClass('border-blue-600');
      expect(canvasTab).not.toHaveClass('border-blue-600');
    });
  });

  describe('Multiple Challenge Support', () => {
    const challenges: Challenge[] = [
      mockTinyUrlChallenge,
      {
        ...mockTinyUrlChallenge,
        id: 'food_blog',
        title: 'Food Blog Platform',
        pythonTemplate: 'def create_post(): pass',
      },
    ];

    it('should load different challenges by ID', () => {
      const { rerender } = render(
        <BrowserRouter>
          <TieredSystemDesignBuilder challengeId="tiny_url" challenges={challenges} />
        </BrowserRouter>
      );
      expect(screen.getByText('Tiny URL Shortener')).toBeInTheDocument();

      rerender(
        <BrowserRouter>
          <TieredSystemDesignBuilder challengeId="food_blog" challenges={challenges} />
        </BrowserRouter>
      );
      expect(screen.getByText('Food Blog Platform')).toBeInTheDocument();
    });

    it('should reset state when challenge changes', () => {
      const { rerender } = render(
        <BrowserRouter>
          <TieredSystemDesignBuilder challengeId="tiny_url" challenges={challenges} />
        </BrowserRouter>
      );

      // Modify state
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, { target: { value: 'modified code' } });

      // Switch challenge
      rerender(
        <BrowserRouter>
          <TieredSystemDesignBuilder challengeId="food_blog" challenges={challenges} />
        </BrowserRouter>
      );

      // Should have new template
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const newEditor = screen.getByTestId('monaco-editor');
      expect(newEditor).toHaveValue(expect.stringContaining('create_post'));
    });
  });

  describe('Edge Cases', () => {
    it('should handle challenge without Python template', () => {
      const challengeNoTemplate: Challenge = {
        ...mockTinyUrlChallenge,
        pythonTemplate: undefined,
      };

      renderBuilder('tiny_url', [challengeNoTemplate]);
      fireEvent.click(screen.getByText('🐍 Python Application Server'));

      const editor = screen.getByTestId('monaco-editor');
      expect(editor).toHaveValue('');
    });

    it('should handle challenge without required APIs', () => {
      const challengeNoAPIs: Challenge = {
        ...mockTinyUrlChallenge,
        requiredAPIs: undefined,
      };

      renderBuilder('tiny_url', [challengeNoAPIs]);
      expect(screen.getByText('Tiny URL Shortener')).toBeInTheDocument();
    });

    it('should handle challenge without available components', () => {
      const challengeNoComponents: Challenge = {
        ...mockTinyUrlChallenge,
        availableComponents: [],
      };

      renderBuilder('tiny_url', [challengeNoComponents]);
      expect(screen.getByText('Tiny URL Shortener')).toBeInTheDocument();
    });

    it('should handle empty challenge list', () => {
      renderBuilder('tiny_url', []);
      // Should show nothing as no challenge found
      expect(screen.queryByText('Tiny URL Shortener')).not.toBeInTheDocument();
    });

    it('should handle challenge with empty test cases', () => {
      renderBuilder('tiny_url');

      const submitButton = screen.getByText('▶️ Submit Solution');
      fireEvent.click(submitButton);

      // Should still allow submission
      expect(screen.getByText('⏳ Running Tests...')).toBeInTheDocument();
    });
  });

  describe('State Persistence', () => {
    it('should maintain Python code when switching tabs', () => {
      renderBuilder('tiny_url');

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, { target: { value: 'custom code' } });

      fireEvent.click(screen.getByText('🎨 Canvas'));
      fireEvent.click(screen.getByText('🐍 Python Application Server'));

      const editorAgain = screen.getByTestId('monaco-editor');
      expect(editorAgain).toHaveValue('custom code');
    });

    it('should not lose code during submission', async () => {
      renderBuilder('tiny_url');

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, { target: { value: 'persistent code' } });

      fireEvent.click(screen.getByText('🎨 Canvas'));
      fireEvent.click(screen.getByText('▶️ Submit Solution'));

      await waitFor(() => {
        expect(screen.getByText('⏳ Running Tests...')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editorAfter = screen.getByTestId('monaco-editor');
      expect(editorAfter).toHaveValue('persistent code');
    });
  });
});
