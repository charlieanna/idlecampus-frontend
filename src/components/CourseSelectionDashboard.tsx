import { useEffect, useMemo, useState } from 'react';
import { Box, Code, Network, Server, Terminal, Shield, Cloud, Radio, Database, Globe, FlaskConical, Calculator, BookOpen, GraduationCap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { courseApi } from '../services/courseApi';
import { authService } from '../services/auth';

interface Course {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'coming-soon';
  features: string[];
  color: string;
}

const baseCourses: Course[] = [
  {
    id: 'linux',
    title: 'Linux Fundamentals',
    description: 'Build a solid foundation with essential Linux command line skills',
    icon: <Terminal className="w-12 h-12" />,
    status: 'available',
    features: [
      'Filesystem navigation & file operations',
      'File permissions & ownership',
      'Text processing & pipes',
      'Process & network management'
    ],
    color: 'from-orange-500 to-orange-700'
  },
  {
    id: 'security',
    title: 'Security Fundamentals',
    description: 'Master TLS/SSL, SSH, secrets management & security best practices',
    icon: <Shield className="w-12 h-12" />,
    status: 'available',
    features: [
      'TLS/SSL & HTTPS certificates',
      'SSH & key-based authentication',
      'Secrets management & encryption',
      'Security scanning & hardening'
    ],
    color: 'from-red-500 to-red-700'
  },
  {
    id: 'docker',
    title: 'Docker Fundamentals',
    description: 'Learn Docker containerization from basics to advanced concepts',
    icon: <Server className="w-12 h-12" />,
    status: 'available',
    features: [
      'Interactive docker terminal',
      'Container management',
      'Image creation & optimization',
      'Docker compose'
    ],
    color: 'from-cyan-500 to-cyan-700'
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes Complete Guide',
    description: 'Master Kubernetes from basics to advanced topics with hands-on labs and real-world scenarios',
    icon: <Box className="w-12 h-12" />,
    status: 'available',
    features: [
      'Interactive kubectl terminal',
      'Hands-on labs',
      'Multiple choice quizzes',
      'Progressive content unlocking'
    ],
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'system_design',
    title: 'System Design Builder (Beta)',
    description: 'Design distributed systems visually, run simulations, and get instant feedback - like LeetCode for System Design',
    icon: <Network className="w-12 h-12" />,
    status: 'available',
    features: [
      'Visual drag-and-drop canvas',
      'Simulation engine with real metrics',
      '3 challenges: Tiny URL, Food Blog, Todo App',
      'Pass/fail with bottleneck detection'
    ],
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'aws',
    title: 'AWS Cloud Architecture',
    description: 'Master AWS services with LocalStack and prepare for Solutions Architect cert',
    icon: <Cloud className="w-12 h-12" />,
    status: 'available',
    features: [
      'S3, EC2, Lambda, VPC',
      'LocalStack sandbox',
      'Hands-on AWS CLI labs',
      'Solutions Architect prep'
    ],
    color: 'from-orange-500 to-orange-700'
  },
  {
    id: 'postgresql',
    title: 'PostgreSQL Database Mastery',
    description: 'Master SQL, query optimization, transactions, and advanced PostgreSQL features',
    icon: <Database className="w-12 h-12" />,
    status: 'available',
    features: [
      'SQL fundamentals & optimization',
      'Indexes and performance tuning',
      'Transactions & ACID properties',
      'CTEs & window functions'
    ],
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'networking',
    title: 'Networking Fundamentals',
    description: 'Master TCP/IP, DNS, subnetting, CIDR, and prepare for network certifications',
    icon: <Globe className="w-12 h-12" />,
    status: 'available',
    features: [
      'TCP/IP & packet analysis',
      'Subnetting & CIDR notation',
      'DNS & routing (BGP)',
      'AWS networking prep'
    ],
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'envoy',
    title: 'Envoy Proxy Mastery',
    description: 'Master Envoy proxy, service mesh, and API gateway patterns',
    icon: <Radio className="w-12 h-12" />,
    status: 'available',
    features: [
      'Envoy proxy fundamentals',
      'Load balancing strategies',
      'Circuit breaking & retries',
      'Service mesh concepts'
    ],
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'chemistry',
    title: 'IIT JEE Chemistry',
    description: 'Master Organic and Physical Chemistry for IIT JEE Main and Advanced',
    icon: <FlaskConical className="w-12 h-12" />,
    status: 'available',
    features: [
      'Organic Chemistry fundamentals',
      'Physical Chemistry concepts',
      'IRT adaptive difficulty',
      'FSRS spaced repetition'
    ],
    color: 'from-green-600 to-green-800'
  },
  {
    id: 'mathematics',
    title: 'IIT JEE Mathematics',
    description: 'Master Calculus, Algebra, Trigonometry for IIT JEE Main and Advanced',
    icon: <Calculator className="w-12 h-12" />,
    status: 'available',
    features: [
      'Calculus & Integration',
      'Algebra & Coordinate Geometry',
      'Trigonometry & Vectors',
      'Formula mastery with SR'
    ],
    color: 'from-purple-600 to-purple-800'
  },
  {
    id: 'upsc',
    title: 'UPSC CSE Preparation',
    description: 'Comprehensive platform for UPSC Civil Services Examination preparation',
    icon: <BookOpen className="w-12 h-12" />,
    status: 'available',
    features: [
      'Prelims & Mains preparation',
      'Mock tests & answer writing',
      'Current affairs daily',
      'AI-powered evaluation'
    ],
    color: 'from-orange-600 to-orange-800'
  },
  {
    id: 'cat',
    title: 'CAT Exam Preparation',
    description: 'Comprehensive preparation for Common Admission Test (MBA entrance)',
    icon: <GraduationCap className="w-12 h-12" />,
    status: 'available',
    features: [
      'Quantitative Aptitude (QA)',
      'Data Interpretation & Logical Reasoning',
      'Verbal Ability & Reading Comprehension',
      'Mock tests & performance analytics'
    ],
    color: 'from-red-600 to-red-800'
  },
  {
    id: 'golang',
    title: 'Go Programming Fundamentals',
    description: 'Master Go programming from basics to advanced concurrency patterns',
    icon: <Code className="w-12 h-12" />,
    status: 'available',
    features: [
      'Go syntax & fundamentals',
      'Goroutines & channels',
      'Interfaces & composition',
      'Hands-on coding exercises'
    ],
    color: 'from-cyan-400 to-blue-600'
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Master DSA with Python: progressive lessons, in-browser coding, and mastery tracking',
    icon: <Code className="w-12 h-12" />,
    status: 'available',
    features: [
      'Progressive Python lessons',
      'In-browser code execution',
      'Mastery tracking & spaced repetition',
      '11 comprehensive modules'
    ],
    color: 'from-yellow-500 to-orange-600'
  }
];

export default function CourseSelectionDashboard() {
  const [courses, setCourses] = useState<Course[]>(baseCourses);

  // Map backend slugs to frontend course IDs
  const slugToId = useMemo(() => ({
    'linux-fundamentals': 'linux',
    'docker-fundamentals': 'docker',
    'kubernetes-complete-guide': 'kubernetes',
    'security-fundamentals': 'security',
    'aws-cloud-architecture': 'aws',
    'postgresql-mastery': 'postgresql',
    'networking-fundamentals': 'networking',
    'envoy-proxy-mastery': 'envoy',
    'iit-jee-inorganic-chemistry': 'chemistry',
    // Some math seeds may use a different slug; include known ones
    'iit-jee-mathematics': 'mathematics',
    'golang-fundamentals': 'golang',
  } as Record<string, string>), []);

  useEffect(() => {
    // Fetch courses from new API
    courseApi.listCourses()
      .then((published) => {
        const publishedIds = new Set(
          published
            .map((c) => slugToId[c.slug])
            .filter((id): id is string => !!id)
        );

        setCourses((prev) =>
          prev.map((c) => ({
            ...c,
            status: publishedIds.has(c.id) ? 'available' : c.status,
          }))
        );
      })
      .catch((error) => {
        console.error('Failed to fetch courses:', error);
        // Non-fatal: keep defaults on failure
      });
  }, [slugToId]);

  const handleCourseSelect = (courseId: string) => {
    // Navigate to course using route path
    window.location.href = `/${courseId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Learning Platform
          </h1>
          <p className="text-slate-600">
            Choose a course to start your learning journey
          </p>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => course.status === 'available' && handleCourseSelect(course.id)}
            >
              {/* Card Header with Gradient */}
              <div className={`bg-gradient-to-r ${course.color} p-6 text-white relative`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3">{course.icon}</div>
                    <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                    <p className="text-white/90 text-sm">{course.description}</p>
                  </div>
                  {course.status === 'coming-soon' && (
                    <Badge className="bg-white/20 text-white border-white/30">
                      Coming Soon
                    </Badge>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">📚</span>
                  What you'll learn:
                </h3>
                <ul className="space-y-2 mb-6">
                  {course.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <Button
                  className={`w-full ${course.status === 'available'
                    ? 'bg-gradient-to-r ' + course.color + ' hover:opacity-90'
                    : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  disabled={course.status === 'coming-soon'}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (course.status === 'available') {
                      handleCourseSelect(course.id);
                    }
                  }}
                >
                  {course.status === 'available' ? (
                    <>
                      Start Learning
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </>
                  ) : (
                    'Coming Soon'
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Footer */}
        <div className="mt-12 text-center text-slate-600">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div>
              <span className="font-bold text-2xl text-slate-900">
                {courses.filter(c => c.status === 'available').length}
              </span>
              <span className="ml-2">Available Courses</span>
            </div>
            <div className="h-8 w-px bg-slate-300"></div>
            <div>
              <span className="font-bold text-2xl text-slate-900">
                {courses.filter(c => c.status === 'coming-soon').length}
              </span>
              <span className="ml-2">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
