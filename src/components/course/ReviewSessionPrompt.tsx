import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, BookOpen, Clock, TrendingUp, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import type { ResumePoint } from '../../services/courseApi';

export interface ReviewSessionPromptProps {
  resumePoint: ResumePoint;
  daysSinceLastAccess: number;
  courseName: string;
  onStartReview: () => void;
  onSkipReview: () => void;
  onClose?: () => void;
}

// Map review type to user-friendly labels and colors
const reviewTypeConfig = {
  quick_refresh: {
    label: 'Quick Refresh',
    description: 'A brief review of recent topics',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    badgeVariant: 'default' as const,
    estimatedTime: '5-10 minutes',
  },
  comprehensive_review: {
    label: 'Comprehensive Review',
    description: 'Thorough review of key concepts',
    icon: BookOpen,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    badgeVariant: 'secondary' as const,
    estimatedTime: '15-20 minutes',
  },
  forgotten_content: {
    label: 'Refresher Course',
    description: "Let's rebuild that knowledge foundation",
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    badgeVariant: 'destructive' as const,
    estimatedTime: '20-30 minutes',
  },
};

export function ReviewSessionPrompt({
  resumePoint,
  daysSinceLastAccess,
  courseName,
  onStartReview,
  onSkipReview,
  onClose,
}: ReviewSessionPromptProps) {
  if (resumePoint.type !== 'review_session' || !resumePoint.review_type) {
    return null;
  }

  const config = reviewTypeConfig[resumePoint.review_type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl mx-4"
        >
          <Card className="p-8 shadow-2xl border-2">
            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.bgColor} mb-4`}>
                <Icon className={`w-8 h-8 ${config.color}`} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back!
              </h2>
              <p className="text-gray-600">
                It's been <span className="font-semibold">{daysSinceLastAccess} days</span> since you last visited{' '}
                <span className="font-semibold">{courseName}</span>
              </p>
            </div>

            {/* Review Type Badge */}
            <div className="flex justify-center mb-6">
              <Badge variant={config.badgeVariant} className="text-sm px-4 py-2">
                {config.label} Recommended
              </Badge>
            </div>

            {/* Message */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium mb-1">{config.description}</p>
                  {resumePoint.message && (
                    <p className="text-gray-600 text-sm">{resumePoint.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Review Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Estimated Time</p>
                  <p className="text-sm font-semibold text-gray-900">{config.estimatedTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Review Type</p>
                  <p className="text-sm font-semibold text-gray-900">{config.label}</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-blue-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Why review?</span> Spaced repetition strengthens memory retention
                and helps you build lasting skills. A quick review now will make the rest of your learning more effective.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={onStartReview}
                className="flex-1 h-12 text-base font-semibold"
                size="lg"
              >
                Start {config.label}
              </Button>
              <Button
                onClick={onSkipReview}
                variant="outline"
                className="flex-1 h-12 text-base font-semibold"
                size="lg"
              >
                Skip & Continue
              </Button>
            </div>

            {/* Footer note */}
            <p className="text-xs text-center text-gray-500 mt-4">
              You can always access reviews from your course dashboard
            </p>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
