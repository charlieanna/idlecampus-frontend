import type { SystemDesignLesson } from '../../../types/lesson';

export const liveStreamingFailureLesson: SystemDesignLesson = {
  id: 'sd-foundations-live-streaming-failure',
  slug: 'live-streaming-latency-resilience',
  title: 'Live Streaming — Latency Tiers & Resilience',
  description:
    'Architect low-latency live streaming with RTMP/SRT/WebRTC ingest, HLS/DASH packaging, and resilient delivery under network and CDN issues with graceful degradation.',
  difficulty: 'intermediate',
  estimatedMinutes: 45,
  category: 'patterns',
  tags: ['streaming', 'rtmp', 'webrtc', 'hls', 'dash', 'abrs', 'latency'],
  moduleId: 'sd-module-7-failure-playbooks',
  sequenceOrder: 5,
  learningObjectives: [
    'Explain ingest protocols and packaging choices for different latency targets',
    'Design reconnection, buffering, and ABR policies',
    'Handle CDN/segment failures with fallback and time-shifted playback',
  ],
  stages: [
    {
      id: 'overview',
      type: 'concept',
      title: 'Architecture Overview',
      content: {
        markdown: `
### Pipeline
- Ingest: RTMP/SRT/WebRTC
- Transcode ladder: CPU/GPU; GOP size, keyframe alignment
- Packaging: HLS/DASH; LL-HLS/LL-DASH for low latency
- Distribution: CDN(s) + edge caching
- Player: ABR, buffer strategy, reconnect logic
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
- Ingest drops: encoder restarts, network jitter, mobile IP changes
- Transcoder overload: queue spikes cause ladder gaps
- Segment packaging delays: missing segments lead to stalling
- CDN POP issues: 404s, stale manifests, edge propagation lag
        `,
      },
    },
    {
      id: 'playbook',
      type: 'concept',
      title: 'Failure Playbook',
      content: {
        markdown: `
### Client strategies
- **ABR** with conservative ramp-up; cap max bitrate during incident
- **Rebuffering budget** logic: trade off latency vs smoothness
- **Reconnect** with backoff; resume from last good sequence number
- Shift to **time-shifted playback** (latency + buffer) if live edge unstable

### Server/CDN strategies
- Multi-ingest + primary/secondary transcoders; health-based failover
- Fill missing renditions with nearest ladder representation
- Multi-CDN routing; route around failing POPs
- Short TTLs on manifests; serve stale-if-error briefly
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
          question: 'If the live edge is unstable, a good user-side mitigation is:',
          type: 'multiple_choice',
          options: ['Increase bitrate', 'Disable ABR', 'Time-shifted playback', 'Longer keyframes'],
          correctAnswer: 'Time-shifted playback',
          explanation: 'Adding buffer smooths playback when the live edge is unstable.',
        },
        {
          id: 'q2',
          question: 'On server side, to handle a missing ladder rendition:',
          type: 'multiple_choice',
          options: ['Return 500', 'Fill with nearest ladder rep', 'Wait indefinitely', 'Purge CDN'],
          correctAnswer: 'Fill with nearest ladder rep',
          explanation: 'Providing nearest available quality avoids stalls.',
        },
      ],
      passingScore: 60,
      allowRetry: true,
    },
  ],
};


