import { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Alert, AlertDescription } from '../ui/alert';

interface HintPanelProps {
  hints: string[];
  onHintRevealed?: (hintIndex: number) => void;
}

export function HintPanel({ hints, onHintRevealed }: HintPanelProps) {
  const [revealedHints, setRevealedHints] = useState<number>(0);

  // Reset revealed hints when a new problem (different hints array) is loaded
  useEffect(() => {
    setRevealedHints(0);
  }, [hints]);

  const handleRevealNextHint = () => {
    if (revealedHints < hints.length) {
      const nextHintIndex = revealedHints;
      setRevealedHints(nextHintIndex + 1);
      if (onHintRevealed) {
        onHintRevealed(nextHintIndex);
      }
    }
  };

  if (hints.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        <h3 className="font-semibold text-amber-900 dark:text-amber-100">Hints</h3>
        <Badge variant="outline" className="ml-auto">
          {revealedHints}/{hints.length} revealed
        </Badge>
      </div>

      {revealedHints === 0 && (
        <Alert className="mb-3 border-amber-300 dark:border-amber-700">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
            Using hints will be tracked in your practice metrics. Try solving it yourself first!
          </AlertDescription>
        </Alert>
      )}

      <ScrollArea className="max-h-[300px]">
        <div className="space-y-3">
          {hints.slice(0, revealedHints).map((hint, index) => (
            <div
              key={index}
              className="p-3 bg-white dark:bg-gray-900 rounded-lg border border-amber-200 dark:border-amber-700"
            >
              <div className="flex items-start gap-2">
                <Badge className="bg-amber-600 text-white shrink-0">
                  Hint {index + 1}
                </Badge>
                <p className="text-sm text-gray-700 dark:text-gray-300">{hint}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {revealedHints < hints.length && (
        <Button
          onClick={handleRevealNextHint}
          variant="outline"
          className="w-full mt-3 border-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/20"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Reveal Next Hint ({revealedHints + 1}/{hints.length})
          <ChevronRight className="w-4 h-4 ml-auto" />
        </Button>
      )}

      {revealedHints === hints.length && (
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-3 text-center">
          All hints revealed. You can do this! 💪
        </p>
      )}
    </Card>
  );
}
