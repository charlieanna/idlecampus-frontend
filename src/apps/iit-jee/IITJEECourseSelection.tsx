import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { FlaskConical, Calculator, BookOpen, Clock, Layers } from 'lucide-react';
import { apiService } from '../../services/api';

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty_level: string;
  estimated_hours: number;
  module_count: number;
}

interface IITJEECourseSelectionProps {
  subject: 'chemistry' | 'mathematics';
}

export default function IITJEECourseSelection({ subject }: IITJEECourseSelectionProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, [subject]);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedCourses = await apiService.fetchCourses(subject);
      console.log(`✅ Loaded ${fetchedCourses.length} ${subject} courses`);
      setCourses(fetchedCourses);
    } catch (err) {
      console.error(`❌ Error loading ${subject} courses:`, err);
      setError(err instanceof Error ? err.message : 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (slug: string) => {
    navigate(`/${subject}/${slug}`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading {subject} courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md p-6">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Failed to Load Courses</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={loadCourses} className="bg-blue-600 hover:bg-blue-700">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const subjectInfo = {
    chemistry: {
      title: 'IIT JEE Chemistry',
      subtitle: 'Master Chemistry for IIT JEE Main and Advanced',
      icon: FlaskConical,
      gradient: 'from-emerald-500 to-emerald-700'
    },
    mathematics: {
      title: 'IIT JEE Mathematics',
      subtitle: 'Master Mathematics for IIT JEE Main and Advanced',
      icon: Calculator,
      gradient: 'from-violet-500 to-violet-700'
    }
  };

  const info = subjectInfo[subject];
  const Icon = info.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className={`bg-gradient-to-r ${info.gradient} text-white`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <Icon className="w-16 h-16" />
            <div>
              <h1 className="text-5xl font-bold">{info.title}</h1>
              <p className="text-xl text-white/90 mt-2">{info.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">{courses.length}</div>
              <div className="text-white/90">Courses Available</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">
                {courses.reduce((sum, c) => sum + c.module_count, 0)}
              </div>
              <div className="text-white/90">Total Modules</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">
                {courses.reduce((sum, c) => sum + c.estimated_hours, 0)}+
              </div>
              <div className="text-white/90">Hours of Content</div>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Choose a Course</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleCourseSelect(course.slug)}
            >
              {/* Course Header */}
              <div className={`bg-gradient-to-r ${info.gradient} p-6 text-white`}>
                <div className="flex items-start justify-between mb-3">
                  <BookOpen className="w-10 h-10" />
                  <Badge className="bg-white/20 text-white border-white/30">
                    {course.difficulty_level}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {course.title.replace(`IIT JEE ${subject === 'chemistry' ? 'Chemistry' : 'Mathematics'} - `, '')}
                </h3>
                <p className="text-white/90 text-sm line-clamp-2">{course.description}</p>
              </div>

              {/* Course Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>{course.module_count} modules</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span>{course.estimated_hours}h</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    IRT Adaptive Difficulty
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    FSRS Spaced Repetition
                  </div>
                  <div className="flex items-center text-sm text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    LaTeX Math Rendering
                  </div>
                </div>

                <Button
                  className={`w-full bg-gradient-to-r ${info.gradient} hover:opacity-90 text-white`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCourseSelect(course.slug);
                  }}
                >
                  Start Learning →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
