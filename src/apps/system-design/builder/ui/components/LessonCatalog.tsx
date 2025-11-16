/**
 * LessonCatalog Component
 *
 * Browse available DDIA lessons organized by modules
 */

import { Lesson, LessonModule } from '../../types/lesson';

interface LessonCatalogProps {
  modules: LessonModule[];
  lessons: Lesson[];
  completedLessons: string[];
  onSelectLesson: (lessonId: string) => void;
}

export function LessonCatalog({
  modules,
  lessons,
  completedLessons,
  onSelectLesson,
}: LessonCatalogProps) {
  const getLessonById = (id: string) => lessons.find(l => l.id === id);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Learn System Design</h1>
        <p className="mt-2 text-gray-600">
          Master DDIA concepts through interactive simulations and real trade-offs
        </p>

        {/* Stats */}
        <div className="mt-4 flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{lessons.length}</div>
            <div className="text-sm text-gray-500">Total Lessons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedLessons.length}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                lessons.reduce((sum, l) => sum + l.estimatedTime, 0) / 60
              )}h
            </div>
            <div className="text-sm text-gray-500">Total Content</div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="p-6 space-y-8">
        {modules.map(module => (
          <div key={module.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Module Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{module.iconEmoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{module.title}</h2>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                <span>📖 {module.ddiaPartReference}</span>
                <span>⏱️ ~{Math.round(module.estimatedTotalTime / 60)}h</span>
                <span>📚 {module.lessons.length} lessons</span>
              </div>
            </div>

            {/* Lessons in Module */}
            <div className="p-4 space-y-3">
              {module.lessons.map((lessonId, index) => {
                const lesson = getLessonById(lessonId);
                if (!lesson) return null;

                const isCompleted = completedLessons.includes(lesson.id);
                const isLocked =
                  lesson.prerequisites?.some(prereq => !completedLessons.includes(prereq)) || false;

                return (
                  <div
                    key={lesson.id}
                    onClick={() => !isLocked && onSelectLesson(lesson.id)}
                    className={`p-4 rounded-lg border transition-all ${
                      isLocked
                        ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
                        : isCompleted
                          ? 'bg-green-50 border-green-200 hover:border-green-300 cursor-pointer'
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {/* Lesson Number */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isLocked
                                ? 'bg-gray-300 text-gray-600'
                                : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {isCompleted ? '✓' : isLocked ? '🔒' : index + 1}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>

                          {/* Tags */}
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                              {lesson.difficulty}
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                              DDIA Ch.{lesson.ddiaChapter}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {lesson.estimatedTime} min
                            </span>
                          </div>

                          {/* Trade-offs explored */}
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">Trade-offs: </span>
                            <span className="text-xs text-gray-700">
                              {lesson.tradeoffsExplored.join(' • ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow or Lock */}
                      {!isLocked && (
                        <span className="text-gray-400">
                          →
                        </span>
                      )}
                    </div>

                    {/* Prerequisites warning */}
                    {isLocked && lesson.prerequisites && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                        <span className="font-medium">Prerequisites:</span>{' '}
                        {lesson.prerequisites.map(prereq => getLessonById(prereq)?.title || prereq).join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* DDIA Book Reference */}
      <div className="p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📖</span>
            <div>
              <h3 className="text-lg font-bold text-amber-900">Designed for Designing Data-Intensive Applications</h3>
              <p className="text-sm text-amber-700">by Martin Kleppmann</p>
            </div>
          </div>
          <p className="text-sm text-amber-800">
            These interactive lessons are designed to complement the concepts from DDIA.
            Each lesson includes direct chapter references so you can dive deeper into the theory
            after experiencing the trade-offs firsthand through simulations.
          </p>
        </div>
      </div>
    </div>
  );
}
