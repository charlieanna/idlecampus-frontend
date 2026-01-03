import { useState } from 'react';
import { ChevronRight, Code, Zap, TrendingUp, CheckCircle2, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EvolutionStep } from '../../types/dsa-course';

interface SolutionEvolutionPanelProps {
  evolutionSteps: EvolutionStep[];
  onComplete?: () => void;
  onNextProblem?: () => void;
}

export function SolutionEvolutionPanel({ 
  evolutionSteps, 
  onComplete,
  onNextProblem 
}: SolutionEvolutionPanelProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [revealedSteps, setRevealedSteps] = useState<number[]>([0]);

  const handleNextStep = () => {
    if (currentStep < evolutionSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setRevealedSteps([...revealedSteps, nextStep]);
    } else {
      // All steps revealed
      if (onComplete) {
        onComplete();
      }
    }
  };

  const isLastStep = currentStep === evolutionSteps.length - 1;
  const currentEvolution = evolutionSteps[currentStep];

  const getStepIcon = (type: EvolutionStep['type']) => {
    switch (type) {
      case 'brute-force':
        return <Code className="w-5 h-5" />;
      case 'bottleneck':
        return <Lightbulb className="w-5 h-5" />;
      case 'optimized':
        return <Zap className="w-5 h-5" />;
    }
  };

  const getStepColor = (type: EvolutionStep['type']) => {
    switch (type) {
      case 'brute-force':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'bottleneck':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'optimized':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Solution Accepted!</h1>
          </div>
          <p className="text-emerald-100 text-sm">
            Now let's understand how we got to this solution...
          </p>
        </div>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            {evolutionSteps.map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  revealedSteps.includes(idx)
                    ? getStepColor(step.type)
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}>
                  {getStepIcon(step.type)}
                  <span>{step.title}</span>
                </div>
                {idx < evolutionSteps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evolution Step Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 shadow-lg">
                <div className="p-6">
                  {/* Step Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-3 rounded-lg ${getStepColor(currentEvolution.type)}`}>
                        {getStepIcon(currentEvolution.type)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {currentEvolution.title}
                        </h2>
                        {currentEvolution.complexity && (
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Time: {currentEvolution.complexity.time}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Space: {currentEvolution.complexity.space}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="mb-6">
                    <div className="prose prose-slate max-w-none">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                        {currentEvolution.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Code */}
                  {currentEvolution.code && (
                    <div className="mb-6">
                      <div className="rounded-lg overflow-hidden border border-slate-200">
                        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-300">Python</span>
                          {currentEvolution.highlight && (
                            <span className="text-xs text-amber-300">
                              {currentEvolution.highlight}
                            </span>
                          )}
                        </div>
                        <Editor
                          height="250px"
                          language="python"
                          value={currentEvolution.code}
                          options={{
                            readOnly: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            fontSize: 13,
                            lineNumbers: 'on',
                            renderLineHighlight: 'none'
                          }}
                          theme="vs-dark"
                        />
                      </div>
                    </div>
                  )}

                  {/* Highlight Callout for Bottleneck */}
                  {currentEvolution.type === 'bottleneck' && currentEvolution.highlight && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900 mb-1">
                            Bottleneck Identified
                          </p>
                          <p className="text-sm text-amber-800">
                            {currentEvolution.highlight}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optimization Callout */}
                  {currentEvolution.type === 'optimized' && (
                    <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-emerald-900 mb-1">
                            Optimized Solution
                          </p>
                          <p className="text-sm text-emerald-800">
                            This is the optimal approach that removes the bottleneck!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Action Footer */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Step {currentStep + 1} of {evolutionSteps.length}
          </div>
          <div className="flex items-center gap-3">
            {!isLastStep ? (
              <Button onClick={handleNextStep} className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                Next Step
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={onComplete}>
                  Done
                </Button>
                {onNextProblem && (
                  <Button 
                    onClick={onNextProblem}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    Next Problem
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
