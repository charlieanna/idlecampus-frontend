import React from 'react';
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
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';

interface Module1IntroProps {
  isCompleted?: boolean;
  onComplete?: () => void;
}

export const Module1Intro: React.FC<Module1IntroProps> = ({ isCompleted = false, onComplete }) => {
  const discoverySteps = [
    { step: 1, icon: Code2, title: 'Solve the problem', desc: 'Use any approach that works', borderColor: 'border-blue-500', bgColor: 'bg-blue-100', textColor: 'text-blue-700', iconColor: 'text-blue-600' },
    { step: 2, icon: TrendingUp, title: 'Measure your solution', desc: 'See time/space complexity', borderColor: 'border-purple-500', bgColor: 'bg-purple-100', textColor: 'text-purple-700', iconColor: 'text-purple-600' },
    { step: 3, icon: Target, title: 'Find the bottleneck', desc: 'Where is it slow?', borderColor: 'border-red-500', bgColor: 'bg-red-100', textColor: 'text-red-700', iconColor: 'text-red-600' },
    { step: 4, icon: Zap, title: 'Optimize it', desc: 'Make it faster!', borderColor: 'border-green-500', bgColor: 'bg-green-100', textColor: 'text-green-700', iconColor: 'text-green-600' },
    { step: 5, icon: Award, title: 'Understand why', desc: 'The optimization emerges naturally', borderColor: 'border-amber-500', bgColor: 'bg-amber-100', textColor: 'text-amber-700', iconColor: 'text-amber-600' },
  ];

  const expectations = [
    { icon: CheckCircle2, text: 'Brute force is welcome', sub: "It's often the best starting point" },
    { icon: TrendingUp, text: 'Multiple attempts encouraged', sub: 'Optimization is a skill' },
    { icon: Lightbulb, text: 'No wrong answers', sub: 'Every solution teaches something' },
    { icon: Award, text: 'Optimization comes naturally', sub: 'After you experience the problem' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-slate-600">Module 1</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-3 text-slate-900">
          Array Iteration Techniques
        </h1>
        <p className="text-lg text-slate-700 mb-4">
          Master optimization through discovery - solve problems, measure complexity, and naturally learn to optimize
        </p>
        
        <div className="flex items-center gap-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>12 Problems</span>
          </div>
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            <span>Optimization Focus</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>8 Hours</span>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div>
        <Card className="border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-slate-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                A Different Approach
              </h3>
              <p className="text-slate-700 leading-relaxed">
                This isn't a traditional course where we teach patterns and you memorize them. 
                Instead, you'll <strong>discover</strong> optimization techniques by solving real problems. 
                The optimizations will emerge naturally from your experience.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Discovery Process */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-blue-600" />
          The Optimization Process
        </h2>
        <div className="grid gap-4">
          {discoverySteps.map((item, idx) => (
            <div key={idx}>
              <Card className="border-l-4 border-slate-300 hover:shadow-md transition-shadow">
                <div className="p-5 flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-100">
                    <span className="text-lg font-bold text-slate-700">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon className="w-5 h-5 text-slate-600" />
                      <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* What to Expect */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">What to Expect</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {expectations.map((item, idx) => (
            <div key={idx}>
              <Card className="p-4 border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-200 rounded-lg flex-shrink-0">
                    <item.icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{item.text}</p>
                    <p className="text-sm text-slate-600 mt-1">{item.sub}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div>
        <Card className="border border-slate-200 bg-slate-50 p-8">
          <div className="text-center">
            <div className="inline-block mb-4">
              <div className="p-4 bg-slate-200 rounded-full">
                <Target className="w-8 h-8 text-slate-700" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Your First Challenge Awaits
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              No lectures or pattern names yet. Just a problem to solve.
            </p>

            {isCompleted ? (
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Section Complete</span>
              </div>
            ) : onComplete ? (
              <button
                onClick={onComplete}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-lg py-4 px-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
              >
                <CheckCircle2 className="w-6 h-6" />
                Mark Complete & Continue
                <ArrowRight className="w-6 h-6" />
              </button>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
};
