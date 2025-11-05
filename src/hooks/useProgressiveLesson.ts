import { useState, useMemo, useCallback } from 'react';
import type { LessonItem, CommandItem, ProgressiveModule } from '../types/progressive';

export function useProgressiveLesson(module: ProgressiveModule | null) {
  const [completedCommands, setCompletedCommands] = useState<Set<string>>(new Set());
  const [attemptCounts, setAttemptCounts] = useState<Map<string, number>>(new Map());
  const [showingHint, setShowingHint] = useState(false);
  const [showingAnswer, setShowingAnswer] = useState(false);

  // Get current command index (which command user is working on)
  const currentCommandIndex = useMemo(() => {
    if (!module) return -1;

    let commandCount = 0;
    for (const item of module.items) {
      if (item.type === 'command') {
        if (!completedCommands.has(item.id)) {
          return commandCount;
        }
        commandCount++;
      }
    }
    return commandCount; // All commands completed
  }, [module, completedCommands]);

  // Get items that should be visible to the user
  const visibleItems = useMemo(() => {
    if (!module) return [];

    const items: LessonItem[] = [];
    let commandsSeen = 0;

    for (const item of module.items) {
      if (item.type === 'content') {
        // Show content if we've completed the command before it, or if it's the first item
        if (commandsSeen === 0 || commandsSeen <= currentCommandIndex) {
          items.push(item);
        }
      } else {
        // Command item
        if (commandsSeen <= currentCommandIndex) {
          items.push(item);
        }
        commandsSeen++;
      }
    }

    return items;
  }, [module, currentCommandIndex]);

  // Get the current command the user needs to complete
  const currentCommand = useMemo(() => {
    if (!module || currentCommandIndex >= module.total_commands) return null;

    let commandCount = 0;
    for (const item of module.items) {
      if (item.type === 'command') {
        if (commandCount === currentCommandIndex) {
          return item as CommandItem;
        }
        commandCount++;
      }
    }
    return null;
  }, [module, currentCommandIndex]);

  // Validate a command input
  const validateCommand = useCallback((input: string, command: CommandItem): boolean => {
    const cleanInput = input.trim().toLowerCase();
    const validation = command.validation;

    switch (validation.type) {
      case 'exact':
        // Check exact match or alternatives
        const cleanCommand = command.command.toLowerCase();
        if (cleanInput === cleanCommand) return true;

        return command.alternatives.some(alt =>
          cleanInput === alt.toLowerCase()
        );

      case 'pattern':
        // Regex pattern matching
        if (validation.pattern) {
          const regex = new RegExp(validation.pattern, 'i');
          return regex.test(input);
        }
        return false;

      case 'semantic':
        // Check if command has required parts
        if (validation.base_command && !cleanInput.startsWith(validation.base_command.toLowerCase())) {
          return false;
        }

        if (validation.required_flags) {
          return validation.required_flags.every(flag =>
            cleanInput.includes(flag.toLowerCase())
          );
        }
        return true;

      default:
        return false;
    }
  }, []);

  // Handle command submission
  const submitCommand = useCallback((input: string) => {
    if (!currentCommand) return { success: false, message: 'No command to validate' };

    const isValid = validateCommand(input, currentCommand);
    const commandId = currentCommand.id;
    const attempts = attemptCounts.get(commandId) || 0;

    if (isValid) {
      // Command is correct!
      setCompletedCommands(prev => new Set([...prev, commandId]));
      setAttemptCounts(prev => new Map(prev).set(commandId, attempts + 1));
      setShowingHint(false);
      setShowingAnswer(false);

      return {
        success: true,
        message: 'Correct! Moving to next section...',
        commandsCompleted: completedCommands.size + 1,
        totalCommands: module?.total_commands || 0
      };
    } else {
      // Command is incorrect
      const newAttempts = attempts + 1;
      setAttemptCounts(prev => new Map(prev).set(commandId, newAttempts));

      let message = 'Not quite right. Try again!';
      if (newAttempts === 1) {
        message = `${currentCommand.hint}`;
      } else if (newAttempts === 2) {
        message = 'Still not quite right. Click "Need a hint?" for more help.';
      } else if (newAttempts >= 3) {
        message = 'Having trouble? You can show the answer if needed.';
      }

      return {
        success: false,
        message,
        attempts: newAttempts
      };
    }
  }, [currentCommand, completedCommands, attemptCounts, validateCommand, module]);

  // Toggle hint visibility
  const toggleHint = useCallback(() => {
    setShowingHint(prev => !prev);
  }, []);

  // Show the answer
  const revealAnswer = useCallback(() => {
    if (!currentCommand) return;

    setShowingAnswer(true);
    // Also mark as completed but with a flag that they saw the answer
    setCompletedCommands(prev => new Set([...prev, currentCommand.id]));
  }, [currentCommand]);

  // Reset progress (for testing or restart)
  const resetProgress = useCallback(() => {
    setCompletedCommands(new Set());
    setAttemptCounts(new Map());
    setShowingHint(false);
    setShowingAnswer(false);
  }, []);

  return {
    // State
    completedCommands,
    currentCommandIndex,
    attemptCounts,
    showingHint,
    showingAnswer,

    // Computed values
    visibleItems,
    currentCommand,
    isComplete: currentCommandIndex >= (module?.total_commands || 0),
    progress: module ? (completedCommands.size / module.total_commands) * 100 : 0,

    // Actions
    submitCommand,
    toggleHint,
    revealAnswer,
    resetProgress,
  };
}
