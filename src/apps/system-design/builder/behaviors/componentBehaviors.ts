/**
 * Component Behavior Library
 *
 * Reusable behaviors and performance profiles for system design components
 * Used across all 400 problems to ensure consistency
 */

import { WorkerBehavior } from '../types/challengeTiers';

/**
 * Worker behavior implementation details
 */
export interface WorkerBehaviorImpl {
  behavior: WorkerBehavior;
  baseLatency: number; // milliseconds
  throughputMultiplier: number; // relative to baseline
  errorRateMultiplier: number; // relative to baseline
  description: string;
  cpuIntensive: boolean;
  memoryIntensive: boolean;
  ioIntensive: boolean;
}

/**
 * Pre-defined worker behaviors
 */
export const WORKER_BEHAVIORS: Record<WorkerBehavior, WorkerBehaviorImpl> = {
  simple_write: {
    behavior: 'simple_write',
    baseLatency: 20,
    throughputMultiplier: 1.0,
    errorRateMultiplier: 1.0,
    description: 'Direct write to database without processing',
    cpuIntensive: false,
    memoryIntensive: false,
    ioIntensive: true,
  },

  validate_and_write: {
    behavior: 'validate_and_write',
    baseLatency: 50,
    throughputMultiplier: 0.8,
    errorRateMultiplier: 1.2,
    description: 'Validate data before writing to database',
    cpuIntensive: true,
    memoryIntensive: false,
    ioIntensive: true,
  },

  transform_and_write: {
    behavior: 'transform_and_write',
    baseLatency: 200,
    throughputMultiplier: 0.3,
    errorRateMultiplier: 1.5,
    description: 'Transform data (e.g., resize images) before writing',
    cpuIntensive: true,
    memoryIntensive: true,
    ioIntensive: true,
  },

  external_api_call: {
    behavior: 'external_api_call',
    baseLatency: 500,
    throughputMultiplier: 0.2,
    errorRateMultiplier: 2.0,
    description: 'Call external service (e.g., email, SMS, payment)',
    cpuIntensive: false,
    memoryIntensive: false,
    ioIntensive: true,
  },

  custom: {
    behavior: 'custom',
    baseLatency: 100, // Will be overridden by actual measurement
    throughputMultiplier: 0.5,
    errorRateMultiplier: 1.0,
    description: 'Custom implementation by student',
    cpuIntensive: true,
    memoryIntensive: false,
    ioIntensive: true,
  },
};

/**
 * Validation specification
 */
export interface ValidationSpec {
  name: string;
  latency: number; // milliseconds
  successRate: number; // 0-1
  description: string;
  requiresExternalCall?: boolean;
}

/**
 * Common validations used across problems
 */
export const VALIDATIONS: Record<string, ValidationSpec> = {
  // URL validations
  url_reachable: {
    name: 'URL Reachable',
    latency: 100,
    successRate: 0.95,
    description: 'Check if URL responds with 200 OK',
    requiresExternalCall: true,
  },
  not_malicious: {
    name: 'Malicious URL Check',
    latency: 50,
    successRate: 0.98,
    description: 'Check URL against malware/phishing blacklist',
    requiresExternalCall: false,
  },

  // Image validations
  valid_image_format: {
    name: 'Valid Image Format',
    latency: 10,
    successRate: 0.99,
    description: 'Verify image file format (JPG, PNG, etc.)',
    requiresExternalCall: false,
  },
  not_inappropriate: {
    name: 'Content Moderation',
    latency: 200,
    successRate: 0.9,
    description: 'AI-based inappropriate content detection',
    requiresExternalCall: true,
  },
  image_size_valid: {
    name: 'Image Size Check',
    latency: 5,
    successRate: 0.95,
    description: 'Verify image is within size limits',
    requiresExternalCall: false,
  },

  // Text validations
  not_spam: {
    name: 'Spam Detection',
    latency: 30,
    successRate: 0.92,
    description: 'ML-based spam content detection',
    requiresExternalCall: false,
  },
  profanity_check: {
    name: 'Profanity Filter',
    latency: 15,
    successRate: 0.99,
    description: 'Check for inappropriate language',
    requiresExternalCall: false,
  },

  // User validations
  email_verified: {
    name: 'Email Verification',
    latency: 150,
    successRate: 0.85,
    description: 'Verify email address is valid and exists',
    requiresExternalCall: true,
  },
  phone_verified: {
    name: 'Phone Verification',
    latency: 200,
    successRate: 0.8,
    description: 'Verify phone number via SMS',
    requiresExternalCall: true,
  },

  // Payment validations
  credit_card_valid: {
    name: 'Credit Card Validation',
    latency: 300,
    successRate: 0.9,
    description: 'Validate credit card with payment processor',
    requiresExternalCall: true,
  },
  fraud_check: {
    name: 'Fraud Detection',
    latency: 250,
    successRate: 0.95,
    description: 'ML-based fraud detection',
    requiresExternalCall: true,
  },
};

/**
 * Transformation specification
 */
export interface TransformationSpec {
  name: string;
  latency: number; // milliseconds
  cpuCost: 'low' | 'medium' | 'high';
  memoryCost: 'low' | 'medium' | 'high';
  description: string;
}

/**
 * Common transformations used across problems
 */
export const TRANSFORMATIONS: Record<string, TransformationSpec> = {
  // Image transformations
  resize_image_thumbnail: {
    name: 'Generate Thumbnail',
    latency: 100,
    cpuCost: 'high',
    memoryCost: 'medium',
    description: 'Resize image to 200x200 thumbnail',
  },
  resize_image_medium: {
    name: 'Generate Medium Size',
    latency: 150,
    cpuCost: 'high',
    memoryCost: 'medium',
    description: 'Resize image to 800x800',
  },
  resize_image_large: {
    name: 'Generate Large Size',
    latency: 200,
    cpuCost: 'high',
    memoryCost: 'high',
    description: 'Resize image to 1920x1080',
  },
  extract_exif_data: {
    name: 'Extract EXIF Data',
    latency: 20,
    cpuCost: 'low',
    memoryCost: 'low',
    description: 'Extract metadata from image',
  },
  apply_filters: {
    name: 'Apply Image Filters',
    latency: 300,
    cpuCost: 'high',
    memoryCost: 'high',
    description: 'Apply Instagram-style filters',
  },

  // Video transformations
  transcode_video: {
    name: 'Transcode Video',
    latency: 5000,
    cpuCost: 'high',
    memoryCost: 'high',
    description: 'Convert video to multiple resolutions',
  },
  generate_thumbnails: {
    name: 'Generate Video Thumbnails',
    latency: 500,
    cpuCost: 'high',
    memoryCost: 'medium',
    description: 'Extract thumbnail frames from video',
  },

  // Text transformations
  extract_metadata: {
    name: 'Extract Metadata',
    latency: 20,
    cpuCost: 'low',
    memoryCost: 'low',
    description: 'Extract title, description, keywords',
  },
  generate_summary: {
    name: 'Generate Summary',
    latency: 100,
    cpuCost: 'medium',
    memoryCost: 'medium',
    description: 'AI-based text summarization',
  },
  translate_text: {
    name: 'Translate Text',
    latency: 200,
    cpuCost: 'medium',
    memoryCost: 'medium',
    description: 'Translate to multiple languages',
  },

  // Data transformations
  aggregate_metrics: {
    name: 'Aggregate Metrics',
    latency: 50,
    cpuCost: 'medium',
    memoryCost: 'low',
    description: 'Calculate sums, averages, counts',
  },
  generate_report: {
    name: 'Generate Report',
    latency: 500,
    cpuCost: 'medium',
    memoryCost: 'medium',
    description: 'Create PDF/Excel report',
  },
  compress_data: {
    name: 'Compress Data',
    latency: 100,
    cpuCost: 'medium',
    memoryCost: 'medium',
    description: 'Compress for storage efficiency',
  },

  // ML transformations
  run_inference: {
    name: 'Run ML Inference',
    latency: 300,
    cpuCost: 'high',
    memoryCost: 'high',
    description: 'Run ML model prediction',
  },
  feature_extraction: {
    name: 'Extract Features',
    latency: 150,
    cpuCost: 'medium',
    memoryCost: 'medium',
    description: 'Extract ML features from data',
  },
};

/**
 * External API specification
 */
export interface ExternalAPISpec {
  name: string;
  latency: { p50: number; p99: number };
  successRate: number;
  costPerCall?: number; // in cents
  description: string;
}

/**
 * Common external APIs
 */
export const EXTERNAL_APIS: Record<string, ExternalAPISpec> = {
  // Communication APIs
  sendgrid: {
    name: 'SendGrid Email',
    latency: { p50: 200, p99: 500 },
    successRate: 0.99,
    costPerCall: 0.08,
    description: 'Send transactional email',
  },
  twilio: {
    name: 'Twilio SMS',
    latency: { p50: 300, p99: 800 },
    successRate: 0.97,
    costPerCall: 0.75,
    description: 'Send SMS message',
  },
  pusher: {
    name: 'Pusher WebSocket',
    latency: { p50: 50, p99: 150 },
    successRate: 0.995,
    costPerCall: 0.01,
    description: 'Real-time push notification',
  },

  // Payment APIs
  stripe: {
    name: 'Stripe Payment',
    latency: { p50: 400, p99: 1000 },
    successRate: 0.98,
    costPerCall: 29, // 2.9% + 30¢ per transaction
    description: 'Process credit card payment',
  },
  paypal: {
    name: 'PayPal Payment',
    latency: { p50: 500, p99: 1200 },
    successRate: 0.97,
    costPerCall: 30,
    description: 'Process PayPal payment',
  },

  // Cloud Services
  aws_s3: {
    name: 'AWS S3 Upload',
    latency: { p50: 100, p99: 300 },
    successRate: 0.999,
    costPerCall: 0.05,
    description: 'Upload object to S3',
  },
  cloudinary: {
    name: 'Cloudinary CDN',
    latency: { p50: 150, p99: 400 },
    successRate: 0.998,
    costPerCall: 0.08,
    description: 'Upload and transform images',
  },

  // AI/ML APIs
  openai_gpt: {
    name: 'OpenAI GPT',
    latency: { p50: 800, p99: 2000 },
    successRate: 0.95,
    costPerCall: 2.0,
    description: 'Generate text with GPT',
  },
  google_vision: {
    name: 'Google Vision API',
    latency: { p50: 300, p99: 700 },
    successRate: 0.97,
    costPerCall: 0.15,
    description: 'Image recognition and analysis',
  },
};

/**
 * Calculate total latency for a list of validations
 */
export function calculateValidationLatency(validationNames: string[]): number {
  return validationNames.reduce((total, name) => {
    const validation = VALIDATIONS[name];
    return total + (validation?.latency || 0);
  }, 0);
}

/**
 * Calculate total latency for a list of transformations
 */
export function calculateTransformationLatency(transformationNames: string[]): number {
  return transformationNames.reduce((total, name) => {
    const transformation = TRANSFORMATIONS[name];
    return total + (transformation?.latency || 0);
  }, 0);
}

/**
 * Calculate CPU cost factor for transformations
 */
export function calculateCPUCostFactor(transformationNames: string[]): number {
  const costMap = { low: 1.0, medium: 1.5, high: 2.0 };

  const totalCost = transformationNames.reduce((total, name) => {
    const transformation = TRANSFORMATIONS[name];
    if (transformation) {
      return total + costMap[transformation.cpuCost];
    }
    return total;
  }, 0);

  return totalCost / Math.max(1, transformationNames.length);
}

/**
 * Get realistic latency for external API call
 */
export function getExternalAPILatency(apiName: string, percentile: 'p50' | 'p99' = 'p50'): number {
  const api = EXTERNAL_APIS[apiName];
  if (!api) return 500; // Default fallback

  return api.latency[percentile];
}

/**
 * Calculate success rate for multiple validations
 */
export function calculateCombinedSuccessRate(validationNames: string[]): number {
  const successRate = validationNames.reduce((rate, name) => {
    const validation = VALIDATIONS[name];
    return rate * (validation?.successRate || 1.0);
  }, 1.0);

  return successRate;
}