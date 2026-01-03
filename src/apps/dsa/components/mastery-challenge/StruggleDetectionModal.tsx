import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertCircle, ArrowRight, BrainCircuit } from 'lucide-react';
import { getAllFamilies } from '../../data/problemFamilyMapping';

interface StruggleDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  struggleReason: string[];
  insertedPrerequisites: string[];
  familyId: string;
}

export const StruggleDetectionModal: React.FC<StruggleDetectionModalProps> = ({
  isOpen,
  onClose,
  struggleReason,
  insertedPrerequisites,
  familyId
}) => {
  const allFamilies = getAllFamilies();

  const getFamilyName = (id: string) => {
    return allFamilies.find(f => f.familyId === id)?.familyName || id;
  };

  const currentFamilyName = getFamilyName(familyId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-orange-200 bg-orange-50/10 backdrop-blur-xl">
        <DialogHeader>
          <div className="mx-auto bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-orange-600" />
          </div>
          <DialogTitle className="text-center text-xl text-orange-900 dark:text-orange-100">
            Let's Pause & Build Foundation
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            We noticed you're finding <strong>{currentFamilyName}</strong> challenging right now.
            That's completely normal!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Reason */}
          {struggleReason.length > 0 && (
            <div className="bg-background/50 p-3 rounded-md border text-sm">
              <span className="font-semibold text-muted-foreground block mb-1 text-xs uppercase tracking-wide">
                What we detected:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                {struggleReason.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Plan */}
          <div className="bg-white dark:bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold">Adaptive Learning Plan Triggered</span>
            </div>

            <div className="space-y-3 relative">
              {/* Visual Connector Line */}
              <div className="absolute left-[19px] top-8 bottom-4 w-0.5 bg-indigo-100 dark:bg-indigo-900/50" />

              {/* Prereqs */}
              {insertedPrerequisites.map((prereqId, idx) => (
                <div key={prereqId} className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0 border-2 border-white dark:border-gray-800 shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="text-sm">
                    <span className="block font-medium">{getFamilyName(prereqId)}</span>
                    <span className="text-xs text-muted-foreground">Prerequisite Concept</span>
                  </div>
                </div>
              ))}

              {/* Target */}
              <div className="flex items-center gap-3 relative z-10 opacity-75">
                <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center shrink-0 border-2 border-white dark:border-gray-800">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <span className="block font-medium line-through decoration-orange-500/50">{currentFamilyName}</span>
                  <span className="text-xs text-orange-600">Paused until prerequisites mastered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all">
            Accept Adaptive Path
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
