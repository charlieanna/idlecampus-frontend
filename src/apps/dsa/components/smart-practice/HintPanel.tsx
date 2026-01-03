import React from 'react';
import type { ProblemHintStep } from '../../types/dsa-course';
import type { HintUsageStep } from '../../stores/practiceStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../../utils/cn';

interface HintPanelProps {
  hints: ProblemHintStep[];
  usage: HintUsageStep[];
  onRevealNext: () => void;
  canRevealNext: boolean;
  onHintFeedback: (hintId: string, resolution: 'helped' | 'still-stuck') => void;
}

export const HintPanel: React.FC<HintPanelProps> = ({
  hints,
  usage,
  onRevealNext,
  canRevealNext,
  onHintFeedback,
}) => {
  const revealedHintIds = new Set(usage.map((step) => step.hintId));
  const revealedHints = hints.filter((hint) => revealedHintIds.has(hint.id ?? ''));
  const pendingStep = usage.find((step) => step.resolution === 'pending');
  const total = hints.length;
  const revealedCount = revealedHints.length;

  const nextHintAvailable = revealedCount < total;

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Hints & Guidance</CardTitle>
        <Badge variant="outline">
          {revealedCount}/{total} used
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {revealedHints.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Need a nudge? Reveal hints one at a time and let us know whether they helped before moving on.
          </p>
        )}

        {revealedHints.map((hint) => {
          const usageInfo = usage.find((step) => step.hintId === (hint.id ?? ''));
          const isPending = usageInfo?.resolution === 'pending';
          const resolution = usageInfo?.resolution;

          return (
            <div
              key={hint.id}
              className={cn(
                'rounded-lg border p-3 text-sm space-y-2',
                isPending ? 'border-yellow-400/80 bg-yellow-50 dark:bg-yellow-950/30' : 'border-border bg-card'
              )}
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Hint {hint.order}</Badge>
                {hint.severity && (
                  <Badge variant="outline" className="uppercase tracking-wide">
                    {hint.severity}
                  </Badge>
                )}
              </div>
              <div className="whitespace-pre-line leading-tight">
                {hint.body || hint.title || 'Try applying the pattern you studied.'}
              </div>

              {hint.conceptTags && hint.conceptTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {hint.conceptTags.map((tag) => (
                    <Badge key={`${hint.id}-${tag}`} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {isPending ? (
                <div className="flex flex-col gap-2 pt-2">
                  <p className="text-xs text-muted-foreground">
                    Did this hint unblock you? Tell us before revealing the next one.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => onHintFeedback(usageInfo!.hintId, 'helped')}>
                      ✅ I made progress
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onHintFeedback(usageInfo!.hintId, 'still-stuck')}
                    >
                      😕 Still stuck
                    </Button>
                  </div>
                </div>
              ) : resolution && (
                <p className="text-xs text-muted-foreground">
                  {resolution === 'helped' ? 'Marked as helpful' : 'Marked as still stuck'}
                </p>
              )}
            </div>
          );
        })}

        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            onClick={onRevealNext}
            disabled={!nextHintAvailable || !canRevealNext}
          >
            {nextHintAvailable ? 'Reveal Next Hint' : 'All hints used'}
          </Button>
          {!canRevealNext && nextHintAvailable && (
            <p className="text-xs text-muted-foreground">
              Answer whether the current hint helped before unlocking the next hint.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

