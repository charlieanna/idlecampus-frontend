import { BookOpen, Clock, Target, ArrowRight, Play } from 'lucide-react';
import { Card } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Badge } from '../../../../../components/ui/badge';
import type { Challenge } from '../../types/testCase';
import type { SystemDesignLesson } from '../../types/lesson';
import { getRecommendedLessons } from '../../data/lessons';

export interface PreChallengeGuidanceProps {
  challenge: Challenge;
  onStartLearning?: (lesson: SystemDesignLesson) => void;
  onStartChallenge?: () => void;
}

export function PreChallengeGuidance({
  challenge,
  onStartLearning,
  onStartChallenge,
}: PreChallengeGuidanceProps) {
  const recommendedLessons = getRecommendedLessons(challenge.id || '');

  const estimatedTime = challenge.testCases?.length
    ? Math.ceil(challenge.testCases.length * 2)
    : 15;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Ready to Start?</h2>
        <p className="text-gray-600 text-lg">
          Before you begin, we recommend reviewing these lessons to help you succeed.
        </p>
      </div>

      {/* Challenge Info */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{challenge.title}</h3>
            <p className="text-gray-600 mb-4">{challenge.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>~{estimatedTime} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>{challenge.testCases?.length || 0} test cases</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recommended Lessons */}
      {recommendedLessons.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Recommended Lessons</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            These lessons cover concepts you'll need for this challenge:
          </p>
          <div className="space-y-3">
            {recommendedLessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{lesson.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {lesson.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {lesson.estimatedMinutes} min
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{lesson.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStartLearning?.(lesson)}
                  className="ml-4"
                >
                  Learn
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {recommendedLessons.length > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => onStartLearning?.(recommendedLessons[0])}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Start with Lessons
          </Button>
        )}
        <Button
          size="lg"
          onClick={onStartChallenge}
          className="flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          Jump to Challenge
        </Button>
      </div>

      {/* Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for Success</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Read the requirements carefully</li>
          <li>• Start with a simple design, then add complexity</li>
          <li>• Test your design with the test cases</li>
          <li>• Don't worry if you don't pass all tests on the first try!</li>
        </ul>
      </Card>
    </div>
  );
}

