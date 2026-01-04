
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CodeEditor } from '../CodeEditor';
import { vi } from 'vitest';
import React from 'react';
import { apiService } from '../../../services/api';

// Mock monaco-editor
vi.mock('@monaco-editor/react', () => ({
  default: ({ onChange }: any) => {
    return <textarea data-testid="monaco-editor" onChange={(e) => onChange(e.target.value)} />;
  },
}));

// Mock apiService
vi.mock('../../../services/api', () => ({
  apiService: {
    executeCode: vi.fn(),
    validateCode: vi.fn(),
    submitCode: vi.fn(),
    getCodeLabHint: vi.fn(),
  },
}));

describe('CodeEditor', () => {
  const mockLab = {
    id: 'lab-1',
    title: 'Test Lab',
    description: 'This is a test lab',
    difficulty: 'easy',
    programming_language: 'python',
    points_reward: 10,
    starter_code: 'print("Hello")',
    objectives: ['Print Hello'],
    test_cases: [],
  };

  const mockOnComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<CodeEditor lab={mockLab as any} onComplete={mockOnComplete} />);
    expect(screen.getByText('Test Lab')).toBeInTheDocument();
  });

  it('shows hint when requested and has accessible close button', async () => {
    const mockGetCodeLabHint = vi.mocked(apiService.getCodeLabHint);
    mockGetCodeLabHint.mockResolvedValue({ hint: 'Try using a loop' });

    render(<CodeEditor lab={mockLab as any} onComplete={mockOnComplete} />);

    const hintButton = screen.getByRole('button', { name: /Hint/i });
    fireEvent.click(hintButton);

    await waitFor(() => {
        expect(mockGetCodeLabHint).toHaveBeenCalled();
    });

    const hintText = await screen.findByText('Try using a loop');
    expect(hintText).toBeInTheDocument();

    // Check for close button with correct aria-label
    const closeButton = screen.getByRole('button', { name: 'Close hint' });
    expect(closeButton).toBeInTheDocument();

    // Verify it works
    fireEvent.click(closeButton);
    expect(screen.queryByText('Try using a loop')).not.toBeInTheDocument();
  });

  it('renders accessible tabs', () => {
    render(<CodeEditor lab={mockLab as any} onComplete={mockOnComplete} />);

    const tabList = screen.getByRole('tablist');
    expect(tabList).toBeInTheDocument();

    const testsTab = screen.getByRole('tab', { name: 'Test Cases' });
    const outputTab = screen.getByRole('tab', { name: 'Output' });

    expect(testsTab).toBeInTheDocument();
    expect(outputTab).toBeInTheDocument();

    // Check aria-selected
    expect(outputTab).toHaveAttribute('aria-selected', 'true');
    expect(testsTab).toHaveAttribute('aria-selected', 'false');

    // Check aria-controls
    expect(outputTab).toHaveAttribute('aria-controls', 'output-panel');
    expect(testsTab).toHaveAttribute('aria-controls', 'tests-panel');

    // Switch tab
    fireEvent.click(testsTab);
    expect(testsTab).toHaveAttribute('aria-selected', 'true');
    expect(outputTab).toHaveAttribute('aria-selected', 'false');

    // Check panel accessibility
    const testsPanel = screen.getByRole('tabpanel');
    expect(testsPanel).toHaveAttribute('id', 'tests-panel');
    expect(testsPanel).toHaveAttribute('aria-labelledby', 'tests-tab');
  });
});
