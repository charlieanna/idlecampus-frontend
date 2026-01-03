import type { ProblemHintStep } from '../types/dsa-course';

export type HintResolution = 'pending' | 'helped' | 'still-stuck';

/**
 * Normalize legacy string hints into structured hint steps.
 */
export function normalizeProblemHints(
  hints: (string | ProblemHintStep)[] | undefined,
  problemId?: string
): ProblemHintStep[] {
  if (!hints || hints.length === 0) return [];

  return hints.map((hint, index) => {
    if (typeof hint === 'string') {
      return {
        id: `${problemId ?? 'hint'}-${index + 1}`,
        order: index + 1,
        body: hint,
        conceptTags: [],
        severity: 'light',
      };
    }

    return {
      id: hint.id ?? `${problemId ?? 'hint'}-${index + 1}`,
      order: hint.order ?? index + 1,
      title: hint.title,
      body: hint.body ?? hint.title ?? '',
      conceptTags: hint.conceptTags,
      familyId: hint.familyId,
      severity: hint.severity ?? 'light',
    };
  });
}

/**
 * Helper to format a hint into plain text for fallbacks/toasts.
 */
export function formatHintText(hint: ProblemHintStep): string {
  if (hint.body && hint.body.trim().length > 0) return hint.body;
  if (hint.title && hint.title.trim().length > 0) return hint.title;
  return 'Review the key insight for this step.';
}

/**
 * Determine a normalized severity bucket.
 */
export function getHintSeverity(hint: ProblemHintStep): 'light' | 'medium' | 'heavy' {
  return hint.severity ?? 'light';
}

