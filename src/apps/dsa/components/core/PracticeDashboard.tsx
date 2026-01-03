import { useState, useEffect } from 'react';
import { TrendingUp, Target, Clock, Lightbulb, BarChart3, Calendar, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PracticeStorage } from '../../services/practiceStorage';
import { ProblemProgress, WeaknessMetrics } from '../../types/practice';

interface PracticeDashboardProps {
  problems: Array<{ id: string; title: string; difficulty: string }>;
  onSelectProblem?: (problemId: string) => void;
}

export function PracticeDashboard({ problems, onSelectProblem }: PracticeDashboardProps) {
  const [allProgress, setAllProgress] = useState<ProblemProgress[]>([]);
  const [weaknesses, setWeaknesses] = useState<WeaknessMetrics[]>([]);
  const [reviewProblems, setReviewProblems] = useState<string[]>([]);

  useEffect(() => {
    loadPracticeData();
  }, []);

  const loadPracticeData = () => {
    const progress = PracticeStorage.getAllProgress();
    const weak = PracticeStorage.getWeaknesses();
    const review = PracticeStorage.getProblemsForReview();
    
    setAllProgress(progress);
    setWeaknesses(weak);
    setReviewProblems(review);
  };

  const getProblemTitle = (problemId: string) => {
    const problem = problems.find(p => p.id === problemId);
    return problem?.title || problemId;
  };

  const getProblemDifficulty = (problemId: string) => {
    const problem = problems.find(p => p.id === problemId);
    return problem?.difficulty || 'medium';
  };

  const stats = {
    totalAttempts: allProgress.reduce((sum, p) => sum + p.totalAttempts, 0),
    problemsSolved: allProgress.filter(p => p.isSolved).length,
    totalProblems: problems.length,
    averageHints: allProgress.length > 0 
      ? allProgress.reduce((sum, p) => sum + p.averageHintsPerAttempt, 0) / allProgress.length 
      : 0,
    successRate: allProgress.length > 0
      ? (allProgress.reduce((sum, p) => sum + p.successfulAttempts, 0) / 
         allProgress.reduce((sum, p) => sum + p.totalAttempts, 0)) * 100
      : 0,
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Practice Dashboard</h1>
              <p className="text-slate-600">Track your progress and identify areas for improvement</p>
            </div>
            <Button onClick={loadPracticeData} variant="outline" size="sm">
              🔄 Refresh
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium">Solved</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {stats.problemsSolved}/{stats.totalProblems}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-emerald-700 font-medium">Success Rate</p>
                  <p className="text-2xl font-bold text-emerald-900">
                    {stats.successRate.toFixed(0)}%
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-700 font-medium">Attempts</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.totalAttempts}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-600 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-amber-700 font-medium">Avg Hints</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {stats.averageHints.toFixed(1)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-rose-700 font-medium">Due Review</p>
                  <p className="text-2xl font-bold text-rose-900">{reviewProblems.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto p-8">
          <Tabs defaultValue="weaknesses" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="weaknesses">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Weak Areas ({weaknesses.length})
              </TabsTrigger>
              <TabsTrigger value="review">
                <Clock className="w-4 h-4 mr-2" />
                Due for Review ({reviewProblems.length})
              </TabsTrigger>
              <TabsTrigger value="progress">
                <TrendingUp className="w-4 h-4 mr-2" />
                All Progress ({allProgress.length})
              </TabsTrigger>
            </TabsList>

            {/* Weaknesses Tab */}
            <TabsContent value="weaknesses">
              <div className="space-y-4">
                {weaknesses.length === 0 ? (
                  <Card className="p-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No weak areas detected!
                    </h3>
                    <p className="text-slate-600">
                      Start solving problems to get personalized practice recommendations.
                    </p>
                  </Card>
                ) : (
                  weaknesses.slice(0, 10).map((weakness) => {
                    const progress = allProgress.find(p => p.problemId === weakness.problemId);
                    const difficulty = getProblemDifficulty(weakness.problemId);
                    
                    return (
                      <Card key={weakness.problemId} className="p-5 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-lg font-semibold text-slate-900">
                                {getProblemTitle(weakness.problemId)}
                              </h3>
                              <Badge variant={
                                difficulty === 'easy' ? 'default' : 
                                difficulty === 'medium' ? 'secondary' : 
                                'destructive'
                              } className="text-xs">
                                {difficulty}
                              </Badge>
                              {weakness.needsReview && (
                                <Badge className="bg-rose-100 text-rose-700 text-xs">
                                  Due for Review
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Weakness Score</p>
                                <div className="flex items-center gap-2">
                                  <Progress value={weakness.weaknessScore} className="h-2 flex-1" />
                                  <span className="text-sm font-semibold text-slate-900">
                                    {weakness.weaknessScore.toFixed(0)}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Failure Rate</p>
                                <p className="text-sm font-semibold text-rose-700">
                                  {(weakness.failureRate * 100).toFixed(0)}%
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Avg Hints</p>
                                <p className="text-sm font-semibold text-amber-700">
                                  {weakness.avgHintsUsed.toFixed(1)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 mb-1">Last Practice</p>
                                <p className="text-sm font-semibold text-slate-700">
                                  {weakness.daysSinceLastPractice.toFixed(0)} days ago
                                </p>
                              </div>
                            </div>

                            {progress && (
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  {progress.successfulAttempts} passed
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="flex items-center gap-1">
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                  {progress.failedAttempts} failed
                                </span>
                                <span className="text-slate-400">•</span>
                                <span>{progress.totalAttempts} total attempts</span>
                              </div>
                            )}
                          </div>

                          {onSelectProblem && (
                            <Button 
                              onClick={() => onSelectProblem(weakness.problemId)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Practice
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* Review Tab */}
            <TabsContent value="review">
              <div className="space-y-4">
                {reviewProblems.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Nothing due for review
                    </h3>
                    <p className="text-slate-600">
                      Come back later when it's time to review problems based on spaced repetition.
                    </p>
                  </Card>
                ) : (
                  reviewProblems.map((problemId) => {
                    const progress = allProgress.find(p => p.problemId === problemId);
                    const difficulty = getProblemDifficulty(problemId);
                    
                    return (
                      <Card key={problemId} className="p-5 hover:shadow-lg transition-shadow border-rose-200 bg-rose-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-slate-900">
                                {getProblemTitle(problemId)}
                              </h3>
                              <Badge variant={
                                difficulty === 'easy' ? 'default' : 
                                difficulty === 'medium' ? 'secondary' : 
                                'destructive'
                              } className="text-xs">
                                {difficulty}
                              </Badge>
                            </div>
                            {progress && (
                              <p className="text-sm text-slate-600">
                                Last practiced: {formatDate(progress.lastAttemptDate)}
                              </p>
                            )}
                          </div>
                          {onSelectProblem && (
                            <Button 
                              onClick={() => onSelectProblem(problemId)}
                              className="bg-rose-600 hover:bg-rose-700"
                            >
                              Review Now
                            </Button>
                          )}
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* All Progress Tab */}
            <TabsContent value="progress">
              <div className="space-y-4">
                {allProgress.length === 0 ? (
                  <Card className="p-12 text-center">
                    <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No practice data yet
                    </h3>
                    <p className="text-slate-600">
                      Start solving problems to see your progress here.
                    </p>
                  </Card>
                ) : (
                  allProgress
                    .sort((a, b) => b.lastAttemptDate - a.lastAttemptDate)
                    .map((progress) => {
                      const difficulty = getProblemDifficulty(progress.problemId);
                      
                      return (
                        <Card key={progress.problemId} className="p-5 hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {getProblemTitle(progress.problemId)}
                                </h3>
                                <Badge variant={
                                  difficulty === 'easy' ? 'default' : 
                                  difficulty === 'medium' ? 'secondary' : 
                                  'destructive'
                                } className="text-xs">
                                  {difficulty}
                                </Badge>
                                {progress.isSolved && (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                )}
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">Total Attempts</p>
                                  <p className="text-sm font-semibold text-slate-900">
                                    {progress.totalAttempts}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">Success Rate</p>
                                  <p className="text-sm font-semibold text-emerald-700">
                                    {((progress.successfulAttempts / progress.totalAttempts) * 100).toFixed(0)}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">Hints Used</p>
                                  <p className="text-sm font-semibold text-amber-700">
                                    {progress.totalHintsUsed} ({progress.averageHintsPerAttempt.toFixed(1)} avg)
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">Best Time</p>
                                  <p className="text-sm font-semibold text-blue-700">
                                    {progress.bestTimeSeconds ? formatTime(progress.bestTimeSeconds) : 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">Last Practiced</p>
                                  <p className="text-sm font-semibold text-slate-700">
                                    {formatDate(progress.lastAttemptDate)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  {progress.successfulAttempts} passed
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="flex items-center gap-1">
                                  <XCircle className="w-3 h-3 text-rose-600" />
                                  {progress.failedAttempts} failed
                                </span>
                              </div>
                            </div>

                            {onSelectProblem && (
                              <Button 
                                onClick={() => onSelectProblem(progress.problemId)}
                                variant="outline"
                              >
                                Practice
                              </Button>
                            )}
                          </div>
                        </Card>
                      );
                    })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
