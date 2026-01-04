
import { render, screen } from '@testing-library/react';
import { Button } from '../button';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
  it('should render a button with the correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should be disabled when the loading prop is true', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show a spinner when the loading prop is true', () => {
    const { container } = render(<Button loading>Click me</Button>);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should not show a spinner when the loading prop is false', () => {
    const { container } = render(<Button>Click me</Button>);
    expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
  });
});
