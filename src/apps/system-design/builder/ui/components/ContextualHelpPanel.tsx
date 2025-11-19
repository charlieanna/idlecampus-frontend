import { Lightbulb, BookOpen, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Card } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Badge } from '../../../../../components/ui/badge';
import type { SystemGraph } from '../../types/graph';
import type { TestResult } from '../../types/testCase';
import type { SystemDesignLesson } from '../../types/lesson';
import { allLessons } from '../../data/lessons';

export interface ContextualHelpPanelProps {
  currentCanvas: SystemGraph;
  failedTests: TestResult[];
  onClose?: () => void;
  onOpenLesson?: (lesson: SystemDesignLesson) => void;
}

export function ContextualHelpPanel({
  currentCanvas,
  failedTests,
  onClose,
  onOpenLesson,
}: ContextualHelpPanelProps) {
  // Analyze failed tests to suggest help
  const analyzeFailures = () => {
    const issues: Array<{ type: string; message: string; lessonSlug?: string }> = [];

    failedTests.forEach(test => {
      // Check for high error rate
      if (test.metrics.errorRate > 0.1) {
        issues.push({
          type: 'error-rate',
          message: `High error rate (${(test.metrics.errorRate * 100).toFixed(0)}%) - system may be overloaded`,
          lessonSlug: 'understanding-scale',
        });
      }

      // Check for high latency
      if (test.metrics.p99Latency > 500) {
        issues.push({
          type: 'latency',
          message: `High latency (${test.metrics.p99Latency}ms p99) - consider adding cache or optimizing`,
          lessonSlug: 'caching-strategies',
        });
      }

      // Check for bottlenecks
      if (test.bottlenecks && test.bottlenecks.length > 0) {
        test.bottlenecks.forEach(bottleneck => {
          if (bottleneck.componentType === 'postgresql' && bottleneck.utilization > 0.9) {
            issues.push({
              type: 'database-overload',
              message: `Database overloaded (${(bottleneck.utilization * 100).toFixed(0)}% utilization) - consider replication or caching`,
              lessonSlug: 'database-replication',
            });
          } else if (bottleneck.componentType === 'app_server' && bottleneck.utilization > 0.9) {
            issues.push({
              type: 'app-overload',
              message: `App server overloaded (${(bottleneck.utilization * 100).toFixed(0)}% utilization) - add more instances`,
              lessonSlug: 'basic-components',
            });
          }
        });
      }

      // Check for missing components
      const hasCache = currentCanvas.components.some(c => c.type === 'cache');
      const hasLoadBalancer = currentCanvas.components.some(c => c.type === 'load_balancer');
      const hasDatabase = currentCanvas.components.some(c => c.type === 'postgresql' || c.type === 'mysql');

      if (!hasDatabase && test.explanation?.includes('database')) {
        issues.push({
          type: 'missing-database',
          message: 'Database may be needed for persistent storage',
          lessonSlug: 'basic-components',
        });
      }

      if (!hasCache && test.metrics.p99Latency > 200) {
        issues.push({
          type: 'missing-cache',
          message: 'Consider adding cache to reduce latency',
          lessonSlug: 'caching-strategies',
        });
      }
    });

    return issues;
  };

  const issues = analyzeFailures();
  const uniqueIssues = Array.from(
    new Map(issues.map(issue => [issue.type, issue])).values()
  );

  const getRelatedLessons = () => {
    const lessonSlugs = new Set(uniqueIssues.map(i => i.lessonSlug).filter(Boolean));
    return allLessons.filter(l => lessonSlugs.has(l.slug));
  };

  const relatedLessons = getRelatedLessons();

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold">Contextual Help</h3>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {failedTests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
          <p>All tests are passing! Great job!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Issues */}
          {uniqueIssues.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                Potential Issues
              </h4>
              <div className="space-y-2">
                {uniqueIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded"
                  >
                    <p className="text-sm text-orange-900">{issue.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hints */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              Hints
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Check if all required components are present</li>
              <li>• Verify connections between components</li>
              <li>• Ensure capacity matches traffic requirements</li>
              <li>• Consider adding cache for read-heavy workloads</li>
              <li>• Add replicas if database is overloaded</li>
            </ul>
          </div>

          {/* Related Lessons */}
          {relatedLessons.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Learn More
              </h4>
              <div className="space-y-2">
                {relatedLessons.map(lesson => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{lesson.title}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {lesson.description}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenLesson?.(lesson)}
                      className="ml-4"
                    >
                      Learn
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General Tips */}
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">General Tips</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Read test case requirements carefully</li>
              <li>• Start simple, then add complexity</li>
              <li>• Use the solution button to see a working example</li>
              <li>• Don't give up - learning from mistakes is valuable!</li>
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}

