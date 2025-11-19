import { useState, useMemo } from 'react';
import { BookOpen, Search, Filter, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Badge } from '../../../../../components/ui/badge';
import type { SystemDesignLesson } from '../../types/lesson';
import { allLessons, getLessonsByCategory, getLessonsByDifficulty } from '../../data/lessons';

export interface LessonHubProps {
  currentChallenge?: string;
  userProgress?: Map<string, { completed: boolean; progress: number }>;
  onSelectLesson?: (lesson: SystemDesignLesson) => void;
}

const categories: Array<{ id: SystemDesignLesson['category']; name: string; icon: string }> = [
  { id: 'fundamentals', name: 'Fundamentals', icon: '📚' },
  { id: 'components', name: 'Components', icon: '🧩' },
  { id: 'patterns', name: 'Patterns', icon: '🔀' },
  { id: 'scaling', name: 'Scaling', icon: '📈' },
  { id: 'problem-solving', name: 'Problem Solving', icon: '💡' },
];

const difficulties: Array<{ id: SystemDesignLesson['difficulty']; name: string }> = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

export function LessonHub({ currentChallenge, userProgress, onSelectLesson }: LessonHubProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SystemDesignLesson['category'] | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<SystemDesignLesson['difficulty'] | 'all'>('all');

  // Filter lessons
  const filteredLessons = useMemo(() => {
    let lessons = allLessons;

    // Filter by category
    if (selectedCategory !== 'all') {
      lessons = getLessonsByCategory(selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      lessons = lessons.filter(l => l.difficulty === selectedDifficulty);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      lessons = lessons.filter(
        lesson =>
          lesson.title.toLowerCase().includes(query) ||
          lesson.description.toLowerCase().includes(query) ||
          lesson.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Show recommended lessons first if currentChallenge is provided
    if (currentChallenge) {
      const recommended = lessons.filter(l => l.relatedChallenges?.includes(currentChallenge));
      const others = lessons.filter(l => !l.relatedChallenges?.includes(currentChallenge));
      return [...recommended, ...others];
    }

    return lessons;
  }, [searchQuery, selectedCategory, selectedDifficulty, currentChallenge]);

  const getProgress = (lessonId: string) => {
    return userProgress?.get(lessonId) || { completed: false, progress: 0 };
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">System Design Lessons</h1>
        </div>
        <p className="text-gray-600">
          Learn system design concepts through interactive lessons and practice exercises.
        </p>
      </div>

      {/* Filters */}
      <div className="p-6 border-b space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category and Difficulty Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.icon} {cat.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Difficulty:</span>
            <div className="flex gap-2">
              <Button
                variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty('all')}
              >
                All
              </Button>
              {difficulties.map(diff => (
                <Button
                  key={diff.id}
                  variant={selectedDifficulty === diff.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(diff.id)}
                >
                  {diff.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No lessons found matching your filters.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map(lesson => {
              const progress = getProgress(lesson.id);
              const isRecommended = currentChallenge && lesson.relatedChallenges?.includes(currentChallenge);

              return (
                <Card
                  key={lesson.id}
                  className={`p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                isRecommended ? 'border-2 border-blue-500' : ''
              }`}
                  onClick={() => onSelectLesson?.(lesson)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{lesson.title}</h3>
                        {isRecommended && (
                          <Badge variant="default" className="bg-blue-500">
                            Recommended
                          </Badge>
                        )}
                        {progress.completed && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{lesson.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.estimatedMinutes} min</span>
                    </div>
                    <Badge variant="outline">{lesson.difficulty}</Badge>
                    {lesson.category && (
                      <Badge variant="outline">
                        {categories.find(c => c.id === lesson.category)?.name || lesson.category}
                      </Badge>
                    )}
                  </div>

                  {lesson.tags && lesson.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {lesson.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {progress.progress > 0 && !progress.completed && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs font-medium text-gray-700 mb-1">You'll learn:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {lesson.learningObjectives.slice(0, 2).map((obj, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                        {lesson.learningObjectives.length > 2 && (
                          <li className="text-gray-500">
                            +{lesson.learningObjectives.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <Button
                    className="w-full mt-4"
                    variant={progress.completed ? 'outline' : 'default'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLesson?.(lesson);
                    }}
                  >
                    {progress.completed ? 'Review Lesson' : progress.progress > 0 ? 'Continue' : 'Start Lesson'}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

