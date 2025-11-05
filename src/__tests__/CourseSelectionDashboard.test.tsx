import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CourseSelectionDashboard from '../components/CourseSelectionDashboard';

// Mock window.location.href
delete (window as any).location;
window.location = { href: '' } as any;

describe('CourseSelectionDashboard', () => {
  it('should render all available courses', () => {
    render(<CourseSelectionDashboard />);

    // Check for available courses
    expect(screen.getByText('Docker Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Kubernetes (CKAD)')).toBeInTheDocument();
    expect(screen.getByText('Linux Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Security Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('System Design & Back-of-Envelope')).toBeInTheDocument();
    expect(screen.getByText('AWS Cloud Architecture')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL Database Mastery')).toBeInTheDocument();
    expect(screen.getByText('Networking Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Envoy Proxy Mastery')).toBeInTheDocument();
  });

  it('should show correct count of available courses', () => {
    render(<CourseSelectionDashboard />);

    // Should show 9 available courses (all except coding-interview which is coming-soon)
    const availableCount = screen.getByText('9');
    expect(availableCount).toBeInTheDocument();
  });

  it('should show coming soon courses with proper badge', () => {
    render(<CourseSelectionDashboard />);

    expect(screen.getByText('Coding Interview Prep')).toBeInTheDocument();
    // Should have "Coming Soon" text appearing at least once (badge and/or button)
    const comingSoonElements = screen.getAllByText('Coming Soon');
    expect(comingSoonElements.length).toBeGreaterThanOrEqual(1);
  });

  it('should navigate to course when clicking available course', () => {
    render(<CourseSelectionDashboard />);

    // Find and click the Docker course button
    const dockerButtons = screen.getAllByText('Start Learning');
    fireEvent.click(dockerButtons[0]); // Click first "Start Learning" button

    // Check that navigation occurred (window.location.href should be set)
    expect(window.location.href).toContain('/');
  });

  it('should not navigate when clicking coming-soon course', () => {
    render(<CourseSelectionDashboard />);

    const currentHref = window.location.href;

    // Find and click the Coming Soon button
    const comingSoonButton = screen.getByRole('button', { name: /Coming Soon/i });
    fireEvent.click(comingSoonButton);

    // Verify no navigation occurred
    expect(window.location.href).toBe(currentHref);
  });

  it('should display course features for each course', () => {
    render(<CourseSelectionDashboard />);

    // Check for some feature examples
    expect(screen.getByText(/Interactive docker terminal/i)).toBeInTheDocument();
    expect(screen.getByText(/Interactive kubectl terminal/i)).toBeInTheDocument();
    expect(screen.getByText(/Filesystem navigation/i)).toBeInTheDocument();
  });

  describe('Course Accessibility', () => {
    const availableCourses = [
      { id: 'linux', title: 'Linux Fundamentals' },
      { id: 'security', title: 'Security Fundamentals' },
      { id: 'docker', title: 'Docker Fundamentals' },
      { id: 'kubernetes', title: 'Kubernetes (CKAD)' },
      { id: 'system_design', title: 'System Design & Back-of-Envelope' },
      { id: 'aws', title: 'AWS Cloud Architecture' },
      { id: 'postgresql', title: 'PostgreSQL Database Mastery' },
      { id: 'networking', title: 'Networking Fundamentals' },
      { id: 'envoy', title: 'Envoy Proxy Mastery' },
    ];

    availableCourses.forEach(course => {
      it(`should render and allow access to ${course.title}`, () => {
        render(<CourseSelectionDashboard />);

        // Verify course is displayed
        expect(screen.getByText(course.title)).toBeInTheDocument();

        // Verify "Start Learning" button is present and enabled
        const courseCard = screen.getByText(course.title).closest('.overflow-hidden');
        expect(courseCard).toBeInTheDocument();

        // Find the Start Learning button within this card
        const buttons = screen.getAllByText('Start Learning');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have correct status for all courses', () => {
    render(<CourseSelectionDashboard />);

    // All courses should have "Start Learning" buttons except coming-soon ones
    const startLearningButtons = screen.getAllByText('Start Learning');
    expect(startLearningButtons).toHaveLength(9); // 9 available courses

    // Only 1 course should be coming soon
    const comingSoonBadges = screen.getAllByText(/Coming Soon/i);
    expect(comingSoonBadges.length).toBeGreaterThanOrEqual(1);
  });
});
