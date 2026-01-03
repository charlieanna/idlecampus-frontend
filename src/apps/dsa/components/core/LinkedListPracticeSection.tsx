import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Trophy, Target, ArrowLeft } from 'lucide-react';
import { LeetCodeProblemPage } from './LeetCodeProblemPage';
import { Button } from '../ui/button';
import { DSAProblem } from '../../types/dsa-course';

interface LinkedListPracticeSectionProps {
  problems: DSAProblem[];
  onBack?: () => void;
}

export default function LinkedListPracticeSection({ problems, onBack }: LinkedListPracticeSectionProps) {
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  // If a problem is selected, show the full LeetCode problem page
  if (selectedProblemId) {
    const problem = problems.find(p => p.id === selectedProblemId);
    if (problem) {
      return (
        <LeetCodeProblemPage 
          problem={problem} 
          onBack={() => setSelectedProblemId(null)}
        />
      );
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'hard':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl text-blue-900">Linked List Practice</h2>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Module
            </Button>
          )}
        </div>
        <p className="text-slate-700 text-base">
          Practice solving linked list problems using the dummy node technique and other patterns you've learned.
        </p>
      </div>

      {/* Pro Tip */}
      <Card className="bg-amber-50 border-amber-200 p-5">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-900 mb-1">💡 Pro Tip</h4>
            <p className="text-sm text-slate-700">
              Remember the dummy node pattern: create a dummy node, build your list, then return <code className="bg-amber-100 px-1 rounded">dummy.next</code>.
              This eliminates edge cases and makes your code cleaner!
            </p>
          </div>
        </div>
      </Card>

      {/* Problem Cards */}
      {problems.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-600">No linked list problems available yet. Complete Module 5 exercises to unlock practice problems!</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {problems.map((problem, index) => (
            <Card
              key={problem.id}
              onClick={() => setSelectedProblemId(problem.id)}
              className="p-5 cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-300 bg-white"
            >
              <div className="flex items-start gap-4">
                {/* Number Badge */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                  #{index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-slate-900 font-semibold">{problem.title}</h3>
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {problem.description}
                  </p>

                  {/* Tags */}
                  {problem.tags && problem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs bg-slate-50 text-slate-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Arrow Icon */}
                <div className="flex-shrink-0 text-blue-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {problems.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 p-6 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-green-900 mb-2">Ready to Test Your Skills?</h3>
          <p className="text-sm text-slate-700">
            Click any problem above to open the full LeetCode-style editor and start coding!
          </p>
        </Card>
      )}
    </div>
  );
}

