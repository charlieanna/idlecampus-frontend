import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QuizViewer } from '../QuizViewer';

describe('QuizViewer', () => {
  it('renders placeholder when quiz has no questions', () => {
    const quiz = {
      id: 'quiz-1',
      title: 'Empty Quiz',
      description: 'No questions here',
      questions: []
    } as any;

    const onComplete = vi.fn();
    const onRegister = vi.fn();

    render(
      <QuizViewer
        quiz={quiz}
        onComplete={onComplete}
        isCompleted={false}
        onRegisterCommandHandler={onRegister}
      />
    );

    expect(screen.getByText('Empty Quiz')).toBeInTheDocument();
  expect(screen.getByText(/Questions are not available right now/i)).toBeInTheDocument();
    expect(onRegister).not.toHaveBeenCalled();
  });

  it('happy path: mcq question selection and submit triggers onComplete when correct', () => {
    const quiz = {
      id: 'quiz-2',
      title: 'Simple MCQ',
      description: 'One question',
      questions: [
        {
          id: 'q-1',
          type: 'mcq',
          question: 'What is 2+2?',
          options: ['3', '4', '5'],
          correctAnswer: 1,
          explanation: '2+2=4'
        }
      ]
    } as any;

    const onComplete = vi.fn();
    const onRegister = vi.fn();

    render(
      <QuizViewer
        quiz={quiz}
        onComplete={onComplete}
        isCompleted={false}
        onRegisterCommandHandler={onRegister}
      />
    );

    // Should show the question
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();

    // Select the correct option ('4')
    const optionButton = screen.getByText('4');
    fireEvent.click(optionButton);

    // Click Submit Quiz
    const submit = screen.getByRole('button', { name: /Submit Quiz/i });
    fireEvent.click(submit);

    // onComplete should be called because 1/1 correct (>=70%)
    expect(onComplete).toHaveBeenCalled();
  });
});
