/**
 * CourseViewerExample - Reference implementation showing how to use the new Course API
 *
 * This component demonstrates:
 * 1. Loading course data with useCourseWithModules hook
 * 2. Managing enrollment with useCourseEnrollment hook
 * 3. Tracking progress with useCourseProgress hook
 * 4. Completing lessons and updating progress
 *
 * Usage:
 * <CourseViewerExample courseSlug="kubernetes-fundamentals" />
 */

import { useState } from 'react';
import { useCourseWithModules } from '../../hooks/useCourses';
import { useEnrolledCourseProgress } from '../../hooks/useCourseProgress';
import { authService } from '../../services/auth';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert } from '../ui/alert';
import { Progress } from '../ui/progress';

interface CourseViewerExampleProps {
  courseSlug: string;
}

export default function CourseViewerExample({ courseSlug }: CourseViewerExampleProps) {
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  // Load course and modules
  const { course, modules, loading: loadingCourse, error: courseError } = useCourseWithModules(courseSlug);

  // Manage enrollment and progress
  const {
    enrolled,
    enrolling,
    enroll,
    progress,
    loading: loadingProgress,
    completedLessons,
    completeLesson,
    isLessonCompleted,
    isReady,
  } = useEnrolledCourseProgress(courseSlug);

  const isAuthenticated = authService.isAuthenticated();

  // Handle lesson completion
  const handleCompleteLesson = async () => {
    if (!modules[selectedModuleIndex]?.items?.[selectedLessonIndex]) return;

    const lesson = modules[selectedModuleIndex].items[selectedLessonIndex];
    const lessonSlug = lesson.title.toLowerCase().replace(/\s+/g, '-');

    try {
      await completeLesson(lessonSlug);
      console.log('Lesson completed successfully!');
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
  };

  // Render loading state
  if (loadingCourse || loadingProgress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading course...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (courseError) {
    return (
      <Alert className="m-6">
        <div className="text-red-600">
          <h3 className="font-semibold mb-2">Error Loading Course</h3>
          <p>{courseError}</p>
        </div>
      </Alert>
    );
  }

  // No course found
  if (!course) {
    return (
      <Alert className="m-6">
        <p>Course not found</p>
      </Alert>
    );
  }

  const currentModule = modules[selectedModuleIndex];
  const currentLesson = currentModule?.items?.[selectedLessonIndex];
  const currentLessonSlug = currentLesson?.title.toLowerCase().replace(/\s+/g, '-') || '';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{course.title}</h1>
          <p className="text-slate-600 mb-4">{course.description}</p>

          {/* Course Stats */}
          <div className="flex gap-4 items-center">
            <Badge>{course.difficulty_level}</Badge>
            <span className="text-sm text-slate-600">{course.estimated_hours} hours</span>
            {modules.length > 0 && (
              <span className="text-sm text-slate-600">{modules.length} modules</span>
            )}
          </div>

          {/* Enrollment Section */}
          {isAuthenticated ? (
            enrolled ? (
              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <Badge className="bg-green-500">Enrolled</Badge>
                  {progress && (
                    <div className="flex-1 max-w-md">
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Progress</span>
                        <span>{progress.completion_percentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress.completion_percentage} />
                      <p className="text-xs text-slate-500 mt-1">
                        {progress.completed_lessons} of {progress.total_lessons} lessons completed
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Button
                  onClick={enroll}
                  disabled={enrolling}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {enrolling ? 'Enrolling...' : 'Enroll in Course'}
                </Button>
              </div>
            )
          ) : (
            <Alert className="mt-4">
              <p className="text-sm">Please log in to enroll and track your progress</p>
            </Alert>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Module Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="font-semibold text-slate-900 mb-4">Course Content</h2>
              <div className="space-y-2">
                {modules.map((module, moduleIdx) => (
                  <div key={module.id}>
                    <button
                      onClick={() => {
                        setSelectedModuleIndex(moduleIdx);
                        setSelectedLessonIndex(0);
                      }}
                      className={`w-full text-left p-2 rounded transition-colors ${
                        moduleIdx === selectedModuleIndex
                          ? 'bg-blue-100 text-blue-900'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-medium text-sm">{module.title}</div>
                      <div className="text-xs text-slate-500">
                        {module.items?.length || 0} items
                      </div>
                    </button>

                    {/* Show lessons when module is selected */}
                    {moduleIdx === selectedModuleIndex && module.items && (
                      <div className="ml-4 mt-2 space-y-1">
                        {module.items.map((item, itemIdx) => {
                          const itemSlug = item.title.toLowerCase().replace(/\s+/g, '-');
                          const isCompleted = isLessonCompleted(itemSlug);

                          return (
                            <button
                              key={item.id}
                              onClick={() => setSelectedLessonIndex(itemIdx)}
                              className={`w-full text-left p-2 rounded text-sm transition-colors flex items-center gap-2 ${
                                itemIdx === selectedLessonIndex
                                  ? 'bg-blue-50 text-blue-900'
                                  : 'hover:bg-slate-50'
                              }`}
                            >
                              <span className={isCompleted ? 'text-green-500' : 'text-slate-400'}>
                                {isCompleted ? '✓' : '○'}
                              </span>
                              <span className="flex-1 truncate">{item.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              {currentLesson ? (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {currentLesson.title}
                      </h2>
                      {currentLesson.description && (
                        <p className="text-slate-600">{currentLesson.description}</p>
                      )}
                    </div>
                    {isLessonCompleted(currentLessonSlug) && (
                      <Badge className="bg-green-500">Completed</Badge>
                    )}
                  </div>

                  {/* Lesson Content */}
                  <div className="prose max-w-none mb-6">
                    {currentLesson.content ? (
                      <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                    ) : (
                      <p className="text-slate-500">No content available for this lesson.</p>
                    )}
                  </div>

                  {/* Lesson Actions */}
                  {enrolled && !isLessonCompleted(currentLessonSlug) && (
                    <div className="flex gap-4 pt-4 border-t border-slate-200">
                      <Button
                        onClick={handleCompleteLesson}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark as Complete
                      </Button>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-6 pt-4 border-t border-slate-200">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (selectedLessonIndex > 0) {
                          setSelectedLessonIndex(selectedLessonIndex - 1);
                        } else if (selectedModuleIndex > 0) {
                          setSelectedModuleIndex(selectedModuleIndex - 1);
                          setSelectedLessonIndex(modules[selectedModuleIndex - 1].items?.length || 0);
                        }
                      }}
                      disabled={selectedModuleIndex === 0 && selectedLessonIndex === 0}
                    >
                      ← Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const currentModuleItems = modules[selectedModuleIndex]?.items || [];
                        if (selectedLessonIndex < currentModuleItems.length - 1) {
                          setSelectedLessonIndex(selectedLessonIndex + 1);
                        } else if (selectedModuleIndex < modules.length - 1) {
                          setSelectedModuleIndex(selectedModuleIndex + 1);
                          setSelectedLessonIndex(0);
                        }
                      }}
                      disabled={
                        selectedModuleIndex === modules.length - 1 &&
                        selectedLessonIndex === (modules[selectedModuleIndex]?.items?.length || 0) - 1
                      }
                    >
                      Next →
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-500 py-12">
                  <p>No content selected</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
