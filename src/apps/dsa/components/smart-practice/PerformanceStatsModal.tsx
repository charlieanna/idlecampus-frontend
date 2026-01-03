import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import {
  History,
  TrendingDown,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  Ghost
} from "lucide-react";
import { usePracticeStore, PracticeEvent } from "../../stores/practiceStore";
import { formatDistanceToNow } from "date-fns";

interface PerformanceStatsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: any; // Using any for now to match parent usage, ideally should be typed
}

export function PerformanceStatsModal({ open, onOpenChange, colors }: PerformanceStatsModalProps) {
  const activityLog = usePracticeStore(state => state.activityLog);
  const recentStruggleModules = usePracticeStore(state => state.recentStruggleModules);
  const getActiveSpeedGoals = usePracticeStore(state => state.getActiveSpeedGoals);
  const speedGoals = getActiveSpeedGoals();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'solve': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'hint': return <HelpCircle className="w-4 h-4 text-amber-500" />;
      case 'skip': return <Ghost className="w-4 h-4 text-slate-400" />;
      default: return <History className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'solve': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      case 'fail': return 'bg-red-50 border-red-100 text-red-700';
      case 'hint': return 'bg-amber-50 border-amber-100 text-amber-700';
      case 'skip': return 'bg-slate-50 border-slate-100 text-slate-700';
      default: return 'bg-slate-50';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Performance Dashboard
          </DialogTitle>
          <DialogDescription>
            Review your practice history and track your improvements.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="history" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto bg-transparent">
            <TabsTrigger
              value="history"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-4 py-2"
            >
              Session History
            </TabsTrigger>
            <TabsTrigger
              value="weaknesses"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-4 py-2"
            >
              Focus Areas
              {recentStruggleModules.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px] bg-red-100 text-red-700 hover:bg-red-100">
                  {recentStruggleModules.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="speed"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-4 py-2"
            >
              Speed Targets
              {speedGoals.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px] bg-amber-100 text-amber-700 hover:bg-amber-100">
                  {speedGoals.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="flex-1 min-h-0 pt-4">
            <ScrollArea className="h-[50vh] pr-4">
              {activityLog.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <History className="w-12 h-12 mb-3 opacity-20" />
                  <p>No activity recorded yet.</p>
                  <p className="text-sm">Solve problems to see your history!</p>
                </div>
              ) : (
                <div className="space-y-3 pl-1">
                  {/* Timeline connector line would go here in a more complex UI */}
                  {activityLog.map((event) => (
                    <div
                      key={event.id}
                      className="flex gap-3 group"
                    >
                      <div className="flex flex-col items-center mt-1">
                        {/* Icon Circle */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${event.type === 'solve' ? 'bg-emerald-100 border-emerald-200' :
                            event.type === 'fail' ? 'bg-red-100 border-red-200' :
                              'bg-slate-100 border-slate-200'
                          }`}>
                          {getEventIcon(event.type)}
                        </div>
                        {/* Vertical Line */}
                        <div className="w-px h-full bg-slate-200 my-1 group-last:hidden" />
                      </div>

                      <div className={`flex-1 p-3 rounded-lg border text-sm ${getEventColor(event.type)}`}>
                        <div className="flex justify-between items-start">
                          <span className="font-medium">
                            {event.type === 'solve' && 'Solved: '}
                            {event.type === 'fail' && 'Attempt Failed: '}
                            {event.type === 'hint' && 'Used Hint for: '}
                            {event.type === 'skip' && 'Skipped: '}
                            {event.problemTitle}
                          </span>
                          <span className="text-xs opacity-70 whitespace-nowrap ml-2">
                            {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                          </span>
                        </div>

                        {(event.timeSpentMs || event.metadata) && (
                          <div className="mt-2 flex flex-wrap gap-2 text-xs opacity-80">
                            {event.timeSpentMs && (
                              <span className="flex items-center gap-1 bg-white/50 px-1.5 py-0.5 rounded">
                                <Clock className="w-3 h-3" />
                                {Math.round(event.timeSpentMs / 1000)}s
                              </span>
                            )}
                            {event.metadata?.attempts && (
                              <span className="flex items-center gap-1 bg-white/50 px-1.5 py-0.5 rounded">
                                {event.metadata.attempts} attempts
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Weaknesses Tab */}
          <TabsContent value="weaknesses" className="flex-1 min-h-0 pt-4">
            <ScrollArea className="h-[50vh] pr-4">
              {recentStruggleModules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-100" />
                  <p className="text-lg font-medium text-emerald-700">All Clear!</p>
                  <p className="text-sm">You haven't struggled with any modules recently.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex gap-2">
                    <TrendingDown className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Focus Needed</p>
                      <p>The Smart Practice engine has detected struggles in these areas. It will prioritize problems from these modules.</p>
                    </div>
                  </div>

                  {recentStruggleModules.map(moduleId => (
                    <Card key={moduleId} className="p-4 border-l-4 border-l-red-500">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg">{moduleId}</h3>
                          <p className="text-sm text-slate-500">Detected recently</p>
                        </div>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Needs Review
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* Speed Tab */}
          <TabsContent value="speed" className="flex-1 min-h-0 pt-4">
            <ScrollArea className="h-[50vh] pr-4">
              {speedGoals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Zap className="w-12 h-12 mb-3 text-yellow-100" />
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No Active Speed Goals</p>
                  <p className="text-sm">You are solving problems within target times! Great job.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 flex gap-2">
                    <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Speed Training Active</p>
                      <p>You'll see more problems of these types until your solving speed improves.</p>
                    </div>
                  </div>

                  {speedGoals.map((goal, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-base">{goal.familyTag}</h3>
                          <p className="text-xs text-slate-500">
                            Last updated {formatDistanceToNow(goal.lastUpdatedAt, { addSuffix: true })}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-slate-100">
                          Target: {Math.round(goal.targetMs / 60000)}m
                        </Badge>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-500">Consistency</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {goal.recentOnTime ? goal.recentOnTime.filter(Boolean).length : 0} / 3 recent
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {(goal.recentOnTime || []).map((passed, i) => (
                            <div
                              key={i}
                              className={`h-2 flex-1 rounded-full ${passed ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                            />
                          ))}
                          {Array.from({ length: Math.max(0, 3 - (goal.recentOnTime?.length || 0)) }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-800" />
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
