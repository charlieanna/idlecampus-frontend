import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { useFamilyMasteryStore } from '../../stores/familyMasteryStore';
import { getAllFamilies } from '../../data/problemFamilyMapping';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, PauseCircle, Layers, RefreshCw } from 'lucide-react';

// Decay calculation constants (same as AdaptiveStreamView)
const DECAY_THRESHOLD = 0.4;
const DECAY_RATE_PER_PROBLEM = 0.05;
const STRUGGLE_DECAY_MULTIPLIER = 1.4;

interface AdaptiveQueuePanelProps {
  onStartPractice?: (familyId: string) => void;
}

export const AdaptiveQueuePanel: React.FC<AdaptiveQueuePanelProps> = ({ onStartPractice }) => {
  const { learningQueue, familyRecords } = useFamilyMasteryStore();
  const allFamilies = getAllFamilies();

  // Calculate decayed items that need review
  const decayedItems = useMemo(() => {
    const records = Object.values(familyRecords);
    const masteredRecords = records.filter(r => r.isMastered && r.masteredAtIndex !== null);

    // Find max index as current position
    let currentIndex = 0;
    masteredRecords.forEach(r => {
      if (r.masteredAtIndex && r.masteredAtIndex > currentIndex) {
        currentIndex = r.masteredAtIndex;
      }
    });

    return masteredRecords
      .map(r => {
        const referenceIndex = r.lastReviewedAtIndex ?? r.masteredAtIndex ?? 0;
        const problemsSince = currentIndex - referenceIndex;
        let decay = problemsSince * DECAY_RATE_PER_PROBLEM;
        if (r.usedHelpOnMastery) decay *= STRUGGLE_DECAY_MULTIPLIER;
        return { ...r, decay: Math.min(decay, 0.8) };
      })
      .filter(r => r.decay >= DECAY_THRESHOLD)
      .sort((a, b) => b.decay - a.decay);
  }, [familyRecords]);

  if (!learningQueue) return null;

  const { queue, pausedFamilies } = learningQueue;

  const getFamilyName = (id: string) => {
    return allFamilies.find(f => f.familyId === id)?.familyName || id;
  };

  const getModule = (id: string) => {
    const f = allFamilies.find(f => f.familyId === id);
    return f ? `Module ${f.moduleId}` : '';
  };

  return (
    <Card className="h-full flex flex-col shadow-lg border-l-4 border-l-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Layers className="w-5 h-5 text-primary" />
          Adaptive Learning Queue
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col gap-4">

        {/* SECTION 0: DUE FOR REVIEW (Decayed items) */}
        {decayedItems.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-purple-600 mb-2 uppercase tracking-wider flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Due for Review ({decayedItems.length})
            </h3>
            <motion.div
              onClick={() => onStartPractice?.(decayedItems[0].familyId)}
              className="p-4 rounded-lg border-2 border-purple-500/50 bg-purple-500/5 shadow-sm relative overflow-hidden group cursor-pointer hover:border-purple-500 transition-colors"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg mb-1">{getFamilyName(decayedItems[0].familyId)}</h4>
                  <div className="flex gap-2">
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      {Math.round(decayedItems[0].decay * 100)}% Decayed
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getModule(decayedItems[0].familyId)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Retention fading - review to reinforce mastery
                  </p>
                </div>
                <RefreshCw className="w-8 h-8 text-purple-500 opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
            {decayedItems.length > 1 && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                +{decayedItems.length - 1} more concepts need review
              </p>
            )}
          </div>
        )}

        {/* SECTION 1: UP NEXT */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            {decayedItems.length > 0 ? 'New Concepts' : 'Up Next'}
          </h3>
          {queue.length > 0 ? (
            <motion.div
              layoutId={queue[0].familyId}
              onClick={() => onStartPractice?.(queue[0].familyId)}
              className="p-4 rounded-lg border bg-card shadow-sm relative overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-purple-500" />
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg mb-1">{getFamilyName(queue[0].familyId)}</h4>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {getModule(queue[0].familyId)}
                    </Badge>
                    {queue[0].reason === 'retry-after-prereqs' && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                        Ready to Retry
                      </Badge>
                    )}
                  </div>
                </div>
                <PlayCircle className="w-8 h-8 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ) : (
            <div className="p-4 rounded-lg border border-dashed text-center text-muted-foreground">
              Queue is empty! 🎉
            </div>
          )}
        </div>

        {/* SECTION 2: QUEUE LIST */}
        <div className="flex-1 min-h-0 flex flex-col">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider flex justify-between">
            <span>In Queue ({Math.max(0, queue.length - 1)})</span>
          </h3>
          <ScrollArea className="flex-1 -mx-2 px-2">
            <div className="space-y-2 pb-4">
              <AnimatePresence>
                {queue.slice(1).map((item, index) => (
                  <motion.div
                    key={item.familyId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => onStartPractice?.(item.familyId)}
                    className="p-3 rounded-md border bg-muted/30 flex justify-between items-center cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{getFamilyName(item.familyId)}</span>
                      <div className="flex gap-2 items-center text-xs text-muted-foreground">
                        <span>{getModule(item.familyId)}</span>
                        {item.reason === 'prerequisite-needed' && (
                          <Badge variant="outline" className="text-[10px] h-4 py-0 border-orange-200 text-orange-600">Considered Prerequisite</Badge>
                        )}
                      </div>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-background flex items-center justify-center border text-xs text-muted-foreground">
                      {index + 2}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* SECTION 3: PAUSED (Deferred) */}
        {pausedFamilies.length > 0 && (
          <div className="mt-auto pt-4 border-t border-border/50">
            <h3 className="text-xs font-semibold text-orange-600/80 mb-2 flex items-center gap-1">
              <PauseCircle className="w-3 h-3" />
              Paused for Prerequisites ({pausedFamilies.length})
            </h3>
            <div className="space-y-2">
              {pausedFamilies.map(paused => (
                <div key={paused.familyId} className="p-2 rounded border border-orange-100 bg-orange-50/50 dark:bg-orange-950/10 text-xs">
                  <div className="font-medium text-orange-800 dark:text-orange-200">
                    {getFamilyName(paused.familyId)}
                  </div>
                  <div className="mt-1 pl-1 border-l-2 border-orange-200 text-muted-foreground">
                    Waiting on: {paused.requiredPrerequisites.filter(pid => !paused.prereqProgress[pid]).map(getFamilyName).join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};
