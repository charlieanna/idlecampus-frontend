import type { SystemDesignLesson } from '../../../types/lesson';

export const videoUploadFailureLesson: SystemDesignLesson = {
  id: 'sd-foundations-video-upload-failure',
  slug: 'reliable-video-upload-pipeline',
  title: 'Reliable Video Upload — Chunking, MPU, Validation, Transcoding',
  description:
    'Design a resilient video upload pipeline: resumable chunked uploads, malware scanning, metadata extraction, asynchronous transcoding, idempotency, and user-facing recovery.',
  difficulty: 'intermediate',
  estimatedMinutes: 45,
  category: 'patterns',
  tags: ['video', 'upload', 'multipart', 'mpu', 'transcode', 'idempotency'],
  moduleId: 'sd-module-7-failure-playbooks',
  sequenceOrder: 4,
  learningObjectives: [
    'Implement resumable, chunked uploads with MPU and checksums',
    'Design idempotent workflows with safe retries and deduplication',
    'Isolate and recover from failures during scanning and transcoding',
  ],
  stages: [
    {
      id: 'overview',
      type: 'concept',
      title: 'Architecture Overview',
      content: {
        markdown: `
### Stages
1) Client → Chunked upload (tus / S3 MPU) with checksums
2) Object finalization → AV scan + metadata extract
3) Async transcode ladder (HLS/DASH profiles)
4) Store manifests + thumbnails → CDN
5) Status API + webhooks for client progress
        `,
      },
    },
    {
      id: 'failure-modes',
      type: 'concept',
      title: 'Failure Modes',
      content: {
        markdown: `
### What goes wrong
- Chunk loss/timeouts; resumed uploads with wrong offsets
- Partial MPU completion; orphaned parts / dangling uploads
- AV scanner timeouts/false positives; quarantine handling
- Transcoder failures; long tail retries; hot spot queues
        `,
      },
    },
    {
      id: 'playbook',
      type: 'concept',
      title: 'Failure Playbook',
      content: {
        markdown: `
### Prevention & safety
- **Idempotency keys** for upload sessions; dedupe on server
- **Checksums** per chunk + final ETag validation
- **Upload state machine** (INIT → UPLOADING → FINALIZING → SCANNING → TRANSCODING → READY/FAILED)
- **Saga/Orchestrator** with compensations (abort MPU, cleanup parts)

### Recovery
- Resume support: client queries server for next chunk offset
- Exponential backoff with jitter for retries; cap attempts per stage
- Dead-letter queue for failed transcodes; operator visibility
- Partial degradation: serve lower ladder profile while higher transcodes run
        `,
      },
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Quick check',
      questions: [
        {
          id: 'q1',
          question: 'What ensures safe deduplication of upload retries?',
          type: 'multiple_choice',
          options: ['Bigger timeouts', 'Idempotency keys', 'Sync writes', 'Fewer chunks'],
          correctAnswer: 'Idempotency keys',
          explanation: 'Idempotency keys let the server treat duplicates safely.',
        },
        {
          id: 'q2',
          question: 'A robust state machine helps with:',
          type: 'multiple_choice',
          options: ['Lower bandwidth', 'Clear recovery steps', 'GPU utilization', 'Codec selection'],
          correctAnswer: 'Clear recovery steps',
          explanation: 'State machines define transitions and compensations explicitly.',
        },
      ],
      passingScore: 60,
      allowRetry: true,
    },
  ],
};


