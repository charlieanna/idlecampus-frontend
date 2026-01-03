import { motion } from 'framer-motion';
import React, { useState, useCallback, type ReactNode } from 'react';
import {
  CheckCircle2,
  Target,
  TrendingUp,
  Lightbulb,
  Zap,
  Award,
  ArrowRight,
  Code2,
  Brain,
  Trophy
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { renderStyledText } from '../../utils/styledTextRenderer';
import type { InlineExercise } from './InlineMiniEditor';

interface EnhancedReadingSectionProps {
  content: string | ReactNode;
  isCompleted: boolean;
  onComplete: () => void;
  isIntro?: boolean;
  customAction?: ReactNode; // Custom action button (e.g., Practice button)
  hasPracticeExercise?: boolean; // Whether this section has a practice exercise
  // For inline code editors
  inlineExercises?: InlineExercise[];
  runPythonCode?: (code: string) => Promise<{ output: string; error?: string }>;
  onExerciseComplete?: (exerciseId: string) => void;
}

export function EnhancedReadingSection({
  content,
  isCompleted,
  onComplete,
  isIntro = false,
  customAction,
  hasPracticeExercise = false,
  inlineExercises,
  runPythonCode,
  onExerciseComplete
}: EnhancedReadingSectionProps) {
  // Track completed inline exercises for progressive unlocking
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const handleExerciseComplete = useCallback((exerciseId: string) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
    onExerciseComplete?.(exerciseId);
  }, [onExerciseComplete]);

  const isStringContent = typeof content === 'string';
  const isModule1Intro =
    isStringContent &&
    (
      content.includes('Module 1: Array Iteration Techniques') ||
      content.includes('Array Iteration Techniques') ||
      content.includes('Module 1 – Array Iteration') ||
      content.includes('Module 1 - Array Iteration')
    );

  if (isModule1Intro) {
    const discoverySteps = [
      { step: 1, icon: Code2, title: 'Solve the problem', desc: 'Use any approach that works', borderColor: 'border-blue-500', bgColor: 'bg-blue-100', textColor: 'text-blue-700', iconColor: 'text-blue-600' },
      { step: 2, icon: TrendingUp, title: 'Measure your solution', desc: 'See time/space complexity', borderColor: 'border-purple-500', bgColor: 'bg-purple-100', textColor: 'text-purple-700', iconColor: 'text-purple-600' },
      { step: 3, icon: Target, title: 'Find the bottleneck', desc: 'Where is it slow?', borderColor: 'border-red-500', bgColor: 'bg-red-100', textColor: 'text-red-700', iconColor: 'text-red-600' },
      { step: 4, icon: Zap, title: 'Optimize it', desc: 'Make it faster!', borderColor: 'border-green-500', bgColor: 'bg-green-100', textColor: 'text-green-700', iconColor: 'text-green-600' },
      { step: 5, icon: Award, title: 'Understand why', desc: 'Pattern emerges naturally', borderColor: 'border-amber-500', bgColor: 'bg-amber-100', textColor: 'text-amber-700', iconColor: 'text-amber-600' },
    ];

    const expectations = [
      { icon: CheckCircle2, text: 'Brute force is welcome', sub: "It's often the best starting point" },
      { icon: TrendingUp, text: 'Multiple attempts encouraged', sub: 'Optimization is a skill' },
      { icon: Lightbulb, text: 'No wrong answers', sub: 'Every solution teaches something' },
      { icon: Award, text: 'Patterns come later', sub: 'After you experience the problem' },
    ];

    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 p-8 text-white shadow-xl"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
          
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">Module 1</span>
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-3">
              Array Iteration Techniques
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Master optimization through discovery - solve problems, measure complexity, and naturally learn patterns
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>3 Core Patterns</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                <span>12 Problems</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>8 Hours</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Philosophy Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-2 border-amber-200 bg-amber-50 p-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Lightbulb className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  A Different Approach
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  This isn't a traditional course where we teach patterns and you memorize them. 
                  Instead, you'll <strong>discover</strong> optimization techniques by solving real problems. 
                  The patterns will emerge naturally from your experience.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Discovery Process */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-600" />
            The Discovery Process
          </h2>
          <div className="grid gap-4">
            {discoverySteps.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <Card className={`border-l-4 ${item.borderColor} hover:shadow-lg transition-shadow`}>
                  <div className="p-5 flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${item.bgColor}`}>
                      <span className={`text-lg font-bold ${item.textColor}`}>{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      </div>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What to Expect */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What to Expect</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {expectations.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
              >
                <Card className="p-4 border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">{item.text}</p>
                      <p className="text-sm text-green-700 mt-1">{item.sub}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50 p-8 shadow-lg">
            <div className="text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="inline-block mb-4"
              >
                <div className="p-4 bg-blue-500 rounded-full shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Your First Challenge Awaits
              </h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                No lectures or pattern names yet. Just a problem to solve.
                {hasPracticeExercise ? 'Solve the practice exercise on the right to continue.' : 'Click below to continue.'}
              </p>

            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!isStringContent) {
    // If content is a React component, try to pass props to it
    // Check if it's Module1Intro or similar component that accepts isCompleted/onComplete
    let renderedContent = content;
    if (React.isValidElement(content)) {
      // Clone the element and inject props if the component accepts them
      renderedContent = React.cloneElement(content as React.ReactElement<any>, {
        isCompleted,
        onComplete,
      });
    }
    
    return (
      <div className="space-y-6">
        <div>{renderedContent}</div>
      </div>
    );
  }

  // Default rendering for other reading sections
  return (
    <div className="max-w-none">
      {typeof content === 'string'
        ? renderStyledText(content, {
            skipFirstH1: true,
            inlineExercises,
            runPythonCode,
            onExerciseComplete: handleExerciseComplete,
            completedExercises,
            progressiveLock: true
          })
        : content}

      {/* Custom action (e.g., Practice button) */}
      {customAction && (
        <div className="mt-6">
          {customAction}
        </div>
      )}
    </div>
  );
}
