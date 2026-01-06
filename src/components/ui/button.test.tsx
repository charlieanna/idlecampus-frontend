import { render, screen } from '@testing-library/react';
import { Button } from './button';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
  it('should render a loader when loading is true', () => {
    render(<Button loading>Test</Button>);
    const loader = screen.getByTestId('loader-icon');
    expect(loader).toBeInTheDocument();
  });

  it('should be disabled when loading is true', () => {
    render(<Button loading>Test</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
