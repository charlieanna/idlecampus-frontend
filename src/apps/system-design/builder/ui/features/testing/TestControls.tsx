import React from 'react';
import { Button } from '../../design-system';
import { useTestStore } from '../../store';

interface TestControlsProps {
  onRunTests: () => void;
  onSubmit: () => void;
  showRun?: boolean;
  showSubmit?: boolean;
}

/**
 * TestControls - Test execution buttons
 * Maps to Figma: TestControls component
 */
export const TestControls: React.FC<TestControlsProps> = ({
  onRunTests,
  onSubmit,
  showRun = true,
  showSubmit = true,
}) => {
  const { isRunning } = useTestStore();

  return (
    <div className="flex items-center gap-3">
      {showRun && (
        <Button
          variant="secondary"
          onClick={onRunTests}
          disabled={isRunning}
          loading={isRunning}
        >
          {isRunning ? 'Running...' : '▶️ Run Tests'}
        </Button>
      )}
      {showSubmit && (
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={isRunning}
        >
          ▶️ Submit Solution
        </Button>
      )}
    </div>
  );
};

