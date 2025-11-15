/**
 * User Flow Tests for TinyURL Challenge
 *
 * End-to-end scenarios testing complete user workflows
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TieredSystemDesignBuilder } from '../ui/TieredSystemDesignBuilder';
import { Challenge } from '../types/testCase';

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

const tinyUrlChallenge: Challenge = {
  id: 'tiny_url',
  title: 'Tiny URL Shortener',
  difficulty: 'beginner',
  description: 'Design a URL shortening service like bit.ly',
  requirements: {
    functional: ['Shorten URLs', 'Expand short codes'],
    traffic: '1000 RPS',
    latency: 'P99 < 100ms',
    availability: '99.9%',
    budget: '$1000/month',
  },
  availableComponents: ['database', 'cache', 'redis', 'message_queue', 'cdn'],
  testCases: [],
  learningObjectives: ['Learn URL shortening'],
  pythonTemplate: `def shorten(url: str, context) -> str:
    # TODO: Generate short code and store mapping
    pass

def expand(code: str, context) -> str:
    # TODO: Retrieve original URL
    pass`,
  requiredAPIs: ['db'],
};

const renderApp = () => {
  return render(
    <BrowserRouter>
      <TieredSystemDesignBuilder challengeId="tiny_url" challenges={[tinyUrlChallenge]} />
    </BrowserRouter>
  );
};

describe('User Flow Tests', () => {
  describe('Flow 1: Beginner - Simple Database-Only Solution', () => {
    it('should guide user through basic implementation', async () => {
      renderApp();

      // Step 1: User sees the problem
      expect(screen.getByText('Tiny URL Shortener')).toBeInTheDocument();
      expect(screen.getByText(/Design a URL shortening service/i)).toBeInTheDocument();

      // Step 2: User clicks Python tab to see template
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();

      // Step 3: User writes simple implementation
      const editor = screen.getByTestId('monaco-editor');
      const simpleImplementation = `
def shorten(url: str, context) -> str:
    import hashlib
    code = hashlib.md5(url.encode()).hexdigest()[:6]
    context.db.set(code, url)
    return code

def expand(code: str, context) -> str:
    return context.db.get(code)
`;
      fireEvent.change(editor, { target: { value: simpleImplementation } });

      // Step 4: User sees API usage detected
      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
        expect(screen.getByText('✗ Not Connected')).toBeInTheDocument();
      });

      // Step 5: User goes back to canvas
      fireEvent.click(screen.getByText('🎨 Canvas'));

      // Step 6: User tries to submit without connecting database
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      fireEvent.click(screen.getByText('▶️ Submit Solution'));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining('context.db')
        );
      });
      alertSpy.mockRestore();

      // Submission blocked - user realizes they need to connect database
    });
  });

  describe('Flow 2: Intermediate - Add Caching Layer', () => {
    it('should allow user to optimize with cache', async () => {
      renderApp();

      // User implements with cache
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      const cachedImplementation = `
def shorten(url: str, context) -> str:
    # Check cache for existing mapping
    cached = context.cache.get(f"url:{url}")
    if cached:
        return cached

    # Generate new code
    import hashlib
    code = hashlib.md5(url.encode()).hexdigest()[:6]

    # Store in both
    context.db.set(code, url)
    context.cache.set(f"url:{url}", code, ttl=3600)
    context.cache.set(f"code:{code}", url, ttl=3600)

    return code

def expand(code: str, context) -> str:
    # Try cache first
    cached = context.cache.get(f"code:{code}")
    if cached:
        return cached

    # Fallback to database
    url = context.db.get(code)
    if url:
        context.cache.set(f"code:{code}", url, ttl=3600)
    return url
`;
      fireEvent.change(editor, { target: { value: cachedImplementation } });

      // User sees both APIs detected
      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
        expect(screen.getByText('context.cache')).toBeInTheDocument();
        expect(screen.getAllByText('✗ Not Connected')).toHaveLength(2);
      });

      // User realizes they need both database AND cache
      expect(screen.getByText(/Connect missing components/i)).toBeInTheDocument();
    });
  });

  describe('Flow 3: Advanced - Full Architecture with Analytics', () => {
    it('should support complex multi-component design', async () => {
      renderApp();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      const advancedImplementation = `
def shorten(url: str, context) -> str:
    import hashlib
    import time

    # Check cache
    cached = context.cache.get(f"url:{url}")
    if cached:
        # Async analytics
        context.queue.publish({
            "event": "cache_hit",
            "url": url,
            "timestamp": time.time()
        })
        return cached

    # Generate code
    code = hashlib.md5(url.encode()).hexdigest()[:6]

    # Store mapping
    context.db.set(code, url)
    context.cache.set(f"url:{url}", code, ttl=3600)

    # Analytics event
    context.queue.publish({
        "event": "url_created",
        "url": url,
        "code": code,
        "timestamp": time.time()
    })

    # Warm up CDN
    context.cdn.cache(f"/r/{code}")

    return code

def expand(code: str, context) -> str:
    # Try cache
    url = context.cache.get(f"code:{code}")
    if url:
        return url

    # Database lookup
    url = context.db.get(code)
    if url:
        context.cache.set(f"code:{code}", url, ttl=3600)

        # Track expansion
        context.queue.publish({
            "event": "url_expanded",
            "code": code
        })

    return url
`;
      fireEvent.change(editor, { target: { value: advancedImplementation } });

      // All 4 APIs detected
      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
        expect(screen.getByText('context.cache')).toBeInTheDocument();
        expect(screen.getByText('context.queue')).toBeInTheDocument();
        expect(screen.getByText('context.cdn')).toBeInTheDocument();
      });

      // All show not connected
      expect(screen.getAllByText('✗ Not Connected').length).toBeGreaterThan(0);
    });
  });

  describe('Flow 4: Error Recovery - Fix Missing Connections', () => {
    it('should help user recover from validation errors', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      renderApp();

      // User writes code with cache
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, {
        target: { value: 'context.cache.get(key)' },
      });

      // User tries to submit
      fireEvent.click(screen.getByText('🎨 Canvas'));
      fireEvent.click(screen.getByText('▶️ Submit Solution'));

      // User sees clear error
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining('context.cache')
        );
        expect(alertSpy).toHaveBeenCalledWith(
          expect.stringContaining('Add a')
        );
      });

      // User goes to Python tab to see status
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      expect(screen.getByText('✗ Not Connected')).toBeInTheDocument();
      expect(screen.getByText(/Connect missing components/i)).toBeInTheDocument();

      alertSpy.mockRestore();
    });
  });

  describe('Flow 5: Iterative Development', () => {
    it('should support incremental code changes', async () => {
      renderApp();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      // Iteration 1: Just database
      fireEvent.change(editor, {
        target: { value: 'context.db.set(k, v)' },
      });

      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
        expect(screen.queryByText('context.cache')).not.toBeInTheDocument();
      });

      // Iteration 2: Add cache
      fireEvent.change(editor, {
        target: {
          value: `
context.db.set(k, v)
context.cache.set(k, v)
`,
        },
      });

      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
        expect(screen.getByText('context.cache')).toBeInTheDocument();
      });

      // Iteration 3: Remove cache
      fireEvent.change(editor, {
        target: { value: 'context.db.set(k, v)' },
      });

      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
        expect(screen.queryByText('context.cache')).not.toBeInTheDocument();
      });
    });
  });

  describe('Flow 6: Code Comments and Experimentation', () => {
    it('should detect APIs even in commented code', async () => {
      renderApp();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      const codeWithComments = `
# TODO: Use context.cache.get() for performance
def expand(code: str, context) -> str:
    # For now, just use database
    # context.cache.get(code)  # Will add this later
    context.db.get(code)
`;
      fireEvent.change(editor, { target: { value: codeWithComments } });

      // Should detect both (including in comments)
      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
        expect(screen.getByText('context.cache')).toBeInTheDocument();
      });
    });
  });

  describe('Flow 7: Empty to Complete Implementation', () => {
    it('should track user progress from empty to complete', async () => {
      renderApp();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      // Start: Has template with TODOs
      expect(editor).toHaveValue(expect.stringContaining('TODO'));
      expect(screen.getByText(/No context APIs detected/i)).toBeInTheDocument();

      // Step 1: User adds basic structure
      fireEvent.change(editor, {
        target: {
          value: `
def shorten(url: str, context) -> str:
    # Still thinking...
    pass
`,
        },
      });

      await waitFor(() => {
        expect(screen.getByText(/No context APIs detected/i)).toBeInTheDocument();
      });

      // Step 2: User adds database call
      fireEvent.change(editor, {
        target: {
          value: `
def shorten(url: str, context) -> str:
    code = "abc"
    context.db.set(code, url)
    return code
`,
        },
      });

      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
      });

      // Step 3: User completes implementation
      fireEvent.change(editor, {
        target: {
          value: `
def shorten(url: str, context) -> str:
    import hashlib
    code = hashlib.md5(url.encode()).hexdigest()[:6]
    context.db.set(code, url)
    return code

def expand(code: str, context) -> str:
    return context.db.get(code)
`,
        },
      });

      // Still shows db API
      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
      });
    });
  });

  describe('Flow 8: Tab Switching Workflow', () => {
    it('should maintain context during tab switches', async () => {
      renderApp();

      // User workflow: Canvas → Python → Canvas → Python
      expect(screen.getByTestId('react-flow')).toBeInTheDocument();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, { target: { value: 'context.db.get(k)' } });

      fireEvent.click(screen.getByText('🎨 Canvas'));
      expect(screen.getByTestId('react-flow')).toBeInTheDocument();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editorAgain = screen.getByTestId('monaco-editor');
      expect(editorAgain).toHaveValue('context.db.get(k)');
      expect(screen.getByText('context.db')).toBeInTheDocument();
    });
  });

  describe('Flow 9: Multiple Submissions', () => {
    it('should allow multiple submission attempts', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      renderApp();

      // First attempt - fail validation
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');
      fireEvent.change(editor, { target: { value: 'context.cache.get(k)' } });

      fireEvent.click(screen.getByText('🎨 Canvas'));
      fireEvent.click(screen.getByText('▶️ Submit Solution'));

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalled();
      });

      // Second attempt - fix code
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      fireEvent.change(editor, { target: { value: 'return "ok"' } });

      fireEvent.click(screen.getByText('🎨 Canvas'));
      alertSpy.mockClear();
      fireEvent.click(screen.getByText('▶️ Submit Solution'));

      // Should proceed without alert
      await waitFor(() => {
        expect(screen.getByText('⏳ Running Tests...')).toBeInTheDocument();
      });
      expect(alertSpy).not.toHaveBeenCalled();

      alertSpy.mockRestore();
    });
  });

  describe('Flow 10: Discovery Learning', () => {
    it('should teach API-component relationship', async () => {
      renderApp();

      // User discovers by writing code first
      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      // User writes context.search without knowing what it means
      fireEvent.change(editor, {
        target: { value: 'context.search.query("test")' },
      });

      // System immediately shows feedback
      await waitFor(() => {
        expect(screen.getByText('context.search')).toBeInTheDocument();
        expect(screen.getByText('✗ Not Connected')).toBeInTheDocument();
        expect(screen.getByText(/Connect missing components/i)).toBeInTheDocument();
      });

      // User learns: "I need to add a search component!"
    });
  });
});

describe('Edge Case User Flows', () => {
  describe('Edge Flow 1: Rapid Code Changes', () => {
    it('should handle rapid successive edits', async () => {
      renderApp();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      // Rapid changes
      fireEvent.change(editor, { target: { value: 'context.db.get(k)' } });
      fireEvent.change(editor, { target: { value: 'context.cache.get(k)' } });
      fireEvent.change(editor, { target: { value: 'context.queue.publish(k)' } });

      // Should show final state
      await waitFor(() => {
        expect(screen.getByText('context.queue')).toBeInTheDocument();
        expect(screen.queryByText('context.db')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Flow 2: Delete All Code', () => {
    it('should handle deleting all code gracefully', async () => {
      renderApp();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      fireEvent.change(editor, { target: { value: 'context.db.get(k)' } });
      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
      });

      // Delete everything
      fireEvent.change(editor, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText(/No context APIs detected/i)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Flow 3: Copy-Paste Large Code', () => {
    it('should handle large code paste', async () => {
      renderApp();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      const largeCode = `
def shorten(url: str, context) -> str:
    ${Array(100)
      .fill(0)
      .map((_, i) => `    # Line ${i}`)
      .join('\n')}
    context.db.set(key, val)
    context.cache.set(key, val)
    return "abc"
`;

      fireEvent.change(editor, { target: { value: largeCode } });

      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
        expect(screen.getByText('context.cache')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Flow 4: Typos in API Names', () => {
    it('should not detect typos as valid APIs', async () => {
      renderApp();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      // User makes typos
      fireEvent.change(editor, {
        target: {
          value: `
context.databse.get(k)  # typo
context.cachee.set(k, v)  # typo
context.db.get(k)  # correct
`,
        },
      });

      await waitFor(() => {
        // Only valid API detected
        expect(screen.getByText('context.db')).toBeInTheDocument();
        expect(screen.queryByText('context.databse')).not.toBeInTheDocument();
        expect(screen.queryByText('context.cachee')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Flow 5: Special Characters in Code', () => {
    it('should handle special characters and unicode', async () => {
      renderApp();

      fireEvent.click(screen.getByText('🐍 Python Application Server'));
      const editor = screen.getByTestId('monaco-editor');

      fireEvent.change(editor, {
        target: {
          value: `
# 你好世界 🌍
def shorten(url: str, context) -> str:
    key = "短链接🔗"
    context.db.set(key, url)
    return "✓"
`,
        },
      });

      await waitFor(() => {
        expect(screen.getByText('context.db')).toBeInTheDocument();
      });
    });
  });
});
