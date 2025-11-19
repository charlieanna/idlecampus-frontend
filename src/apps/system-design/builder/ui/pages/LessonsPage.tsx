import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allLessons } from '../../data/lessons';
import type { LessonDefinition } from '../../types/lesson';

export function LessonsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Group lessons by category
  const categories = ['all', 'fundamentals', 'components', 'patterns'];
  
  const filteredLessons = selectedCategory === 'all' 
    ? allLessons 
    : allLessons.filter(lesson => lesson.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Design Lessons</h1>
              <p className="mt-2 text-gray-600">
                Learn system design concepts before solving problems
              </p>
            </div>
            <button
              onClick={() => navigate('/system-design')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Problems →
            </button>
          </div>

          {/* Category Filter */}
          <div className="mt-6 flex gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => navigate(`/system-design/lessons/${lesson.id}`)}
              getDifficultyColor={getDifficultyColor}
            />
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No lessons found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LessonCard({ 
  lesson, 
  onClick, 
  getDifficultyColor 
}: { 
  lesson: LessonDefinition; 
  onClick: () => void;
  getDifficultyColor: (difficulty: string) => string;
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {lesson.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {lesson.description}
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(lesson.difficulty)}`}>
          {lesson.difficulty}
        </span>
        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
          {lesson.category}
        </span>
        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
          {lesson.estimatedMinutes} min
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
          {lesson.stages.length} stages
        </span>
      </div>

      {/* Arrow indicator */}
      <div className="mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Start Lesson
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

