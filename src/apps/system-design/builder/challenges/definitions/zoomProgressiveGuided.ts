import { GuidedTutorial } from '../../types/guidedTutorial';

export const zoomProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'zoom-progressive-guided',
  title: 'Design Zoom - Progressive Journey',
  description: 'Build a video conferencing platform that evolves from basic 1:1 calls to global-scale meetings with recording and virtual backgrounds',
  difficulty: 'progressive',
  estimatedTime: '4-6 hours across all phases',

  systemContext: {
    title: 'Zoom',
    description: 'A video conferencing platform enabling real-time video meetings, webinars, and collaboration at scale',
    requirements: [
      'Real-time video and audio communication',
      'Support 1:1 and group calls (up to 100s of participants)',
      'Screen sharing and presentation mode',
      'Meeting scheduling and calendar integration',
      'Recording and playback',
      'Virtual backgrounds and noise suppression'
    ],
    existingInfrastructure: 'Starting fresh - you are building a new video conferencing platform'
  },

  phases: [
    {
      id: 'phase-1-beginner',
      name: 'Phase 1: Basic Video Calls',
      description: 'Your startup "QuickMeet" is building video calling. Start with 1:1 calls using WebRTC for real-time communication.',
      difficulty: 'beginner',
      requiredSteps: ['step-1', 'step-2', 'step-3'],
      unlockCriteria: null
    },
    {
      id: 'phase-2-intermediate',
      name: 'Phase 2: Group Meetings',
      description: 'QuickMeet has 100K users! They want group calls with screen sharing and chat. Time to scale beyond 1:1.',
      difficulty: 'intermediate',
      requiredSteps: ['step-4', 'step-5', 'step-6'],
      unlockCriteria: { completedPhases: ['phase-1-beginner'] }
    },
    {
      id: 'phase-3-advanced',
      name: 'Phase 3: Enterprise Scale',
      description: 'QuickMeet has enterprise customers wanting 100+ participant meetings. You need media servers, recording, and reliability at scale.',
      difficulty: 'advanced',
      requiredSteps: ['step-7', 'step-8', 'step-9'],
      unlockCriteria: { completedPhases: ['phase-2-intermediate'] }
    },
    {
      id: 'phase-4-expert',
      name: 'Phase 4: Advanced Features',
      description: 'QuickMeet is competing with Zoom. Time to add virtual backgrounds, transcription, breakout rooms, and webinars.',
      difficulty: 'expert',
      requiredSteps: ['step-10', 'step-11', 'step-12'],
      unlockCriteria: { completedPhases: ['phase-3-advanced'] }
    }
  ],

  steps: [
    // ============== PHASE 1: BASIC VIDEO CALLS ==============
    {
      id: 'step-1',
      title: 'WebRTC Fundamentals',
      phase: 'phase-1-beginner',
      description: 'Understand WebRTC and implement peer-to-peer video between two participants',
      order: 1,

      educationalContent: {
        title: 'Real-Time Communication with WebRTC',
        explanation: `WebRTC (Web Real-Time Communication) is the foundation of browser-based video calling. It enables peer-to-peer audio/video/data transmission.

**WebRTC Architecture:**
\`\`\`
Peer A                          Peer B
  |                                |
  |←── Signaling Server ───────→|
  |    (exchange SDP, ICE)        |
  |                                |
  |←─────── Media Stream ────────→|
  |    (direct peer-to-peer)      |
\`\`\`

**Key Components:**

**1. Signaling (your server):**
Exchange connection information between peers:
- SDP (Session Description Protocol): codec capabilities, media formats
- ICE candidates: network paths to reach each peer

**2. STUN Server:**
Helps peers discover their public IP address:
\`\`\`
Your PC → STUN → "Your public IP is 203.0.113.1:54321"
\`\`\`
Most connections work with STUN alone (~80%).

**3. TURN Server:**
Relay server when direct connection fails (firewalls, symmetric NAT):
\`\`\`
Peer A → TURN Server → Peer B
(Adds latency but guarantees connectivity)
\`\`\`
~20% of connections need TURN.

**WebRTC Connection Flow:**
\`\`\`typescript
// 1. Create peer connection
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.example.com:19302' },
    { urls: 'turn:turn.example.com:3478',
      username: 'user', credential: 'pass' }
  ]
});

// 2. Add local media
const stream = await navigator.mediaDevices.getUserMedia({
  video: true, audio: true
});
stream.getTracks().forEach(track => pc.addTrack(track, stream));

// 3. Create and send offer (via signaling)
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);
signalingServer.send({ type: 'offer', sdp: offer });

// 4. Receive answer and ICE candidates
signalingServer.onmessage = async (msg) => {
  if (msg.type === 'answer') {
    await pc.setRemoteDescription(msg.sdp);
  } else if (msg.type === 'ice-candidate') {
    await pc.addIceCandidate(msg.candidate);
  }
};
\`\`\``,
        keyInsight: 'WebRTC enables peer-to-peer media streaming, but requires signaling (your server) to exchange connection info and STUN/TURN servers to handle NAT traversal',
        commonMistakes: [
          'Forgetting TURN server (fails for ~20% of users)',
          'Not handling ICE candidate trickling',
          'Assuming signaling is part of WebRTC (it\'s not)'
        ],
        interviewTips: [
          'Explain the difference between signaling and media paths',
          'Discuss STUN vs TURN and when each is needed',
          'Mention that WebRTC is peer-to-peer by default'
        ],
        realWorldExample: 'When you start a Google Meet call, your browser first contacts Google\'s signaling server, exchanges ICE candidates with the other participant, then establishes a direct peer connection. If that fails, it falls back to TURN relay.'
      },

      requiredComponents: ['Client', 'Signaling Server', 'STUN Server', 'TURN Server'],

      hints: [
        { trigger: 'stuck', content: 'WebRTC needs: (1) Signaling server to exchange SDP/ICE, (2) STUN for NAT traversal, (3) TURN as fallback' },
        { trigger: 'no_stun', content: 'Users behind NAT cant receive calls without STUN to discover their public IP.' },
        { trigger: 'no_turn', content: 'About 20% of users need TURN relay when direct connection fails (corporate firewalls).' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'Signaling Server' },
          { from: 'Client', to: 'STUN Server' },
          { from: 'Client', to: 'TURN Server' }
        ],
        requiredComponents: ['Signaling Server', 'STUN Server', 'TURN Server']
      },

      thinkingFramework: {
        approach: 'protocol-understanding',
        questions: [
          'What information needs to be exchanged to establish a call?',
          'Why cant two browsers connect directly without help?',
          'What happens when peer-to-peer fails?'
        ],
        tradeoffs: [
          { option: 'Peer-to-peer only', pros: ['Low latency', 'Cheap'], cons: ['20% failure rate'] },
          { option: 'P2P with TURN fallback', pros: ['100% connectivity'], cons: ['TURN bandwidth costs'] }
        ]
      }
    },

    {
      id: 'step-2',
      title: 'Signaling Service',
      phase: 'phase-1-beginner',
      description: 'Build the signaling server that coordinates call setup between participants',
      order: 2,

      educationalContent: {
        title: 'Building a Signaling Server',
        explanation: `The signaling server is your backend - it doesn't handle media, but coordinates everything else: users, rooms, and connection negotiation.

**Signaling Protocol Design:**
\`\`\`typescript
// Client → Server messages
type ClientMessage =
  | { type: 'join'; roomId: string; userId: string }
  | { type: 'leave'; roomId: string }
  | { type: 'offer'; targetUserId: string; sdp: RTCSessionDescription }
  | { type: 'answer'; targetUserId: string; sdp: RTCSessionDescription }
  | { type: 'ice-candidate'; targetUserId: string; candidate: RTCIceCandidate }
  | { type: 'mute'; track: 'audio' | 'video' };

// Server → Client messages
type ServerMessage =
  | { type: 'user-joined'; userId: string; userName: string }
  | { type: 'user-left'; userId: string }
  | { type: 'offer'; fromUserId: string; sdp: RTCSessionDescription }
  | { type: 'answer'; fromUserId: string; sdp: RTCSessionDescription }
  | { type: 'ice-candidate'; fromUserId: string; candidate: RTCIceCandidate }
  | { type: 'user-muted'; userId: string; track: 'audio' | 'video' };
\`\`\`

**Room Management:**
\`\`\`typescript
interface Room {
  id: string;
  participants: Map<string, Participant>;
  createdAt: Date;
  hostId: string;
}

interface Participant {
  userId: string;
  userName: string;
  socketId: string;
  audioMuted: boolean;
  videoMuted: boolean;
  joinedAt: Date;
}
\`\`\`

**WebSocket vs HTTP:**
Signaling must be bidirectional and low-latency:
- WebSocket: persistent connection, instant delivery
- HTTP polling: high latency, not suitable

**Signaling Flow (2 participants):**
\`\`\`
A joins room "xyz"
  Server: remembers A is in "xyz"
B joins room "xyz"
  Server: tells A about B, tells B about A
A creates offer, sends to server
  Server: forwards offer to B
B creates answer, sends to server
  Server: forwards answer to A
Both exchange ICE candidates via server
Connection established!
\`\`\`

**Handling Disconnection:**
\`\`\`typescript
socket.on('disconnect', () => {
  const room = getRoomBySocket(socket.id);
  if (room) {
    room.participants.delete(userId);
    broadcast(room.id, {
      type: 'user-left',
      userId
    });
  }
});
\`\`\``,
        keyInsight: 'Signaling is just message routing - forward offers, answers, and ICE candidates between participants. The complexity is in handling room state and disconnections gracefully.',
        commonMistakes: [
          'Using HTTP instead of WebSocket (too slow)',
          'Not handling reconnection scenarios',
          'Missing the "user left" notification to other participants'
        ],
        interviewTips: [
          'Explain that signaling is separate from media (design choice)',
          'Discuss room state management',
          'Mention handling network disconnections'
        ],
        realWorldExample: 'Zoom\'s signaling servers handle millions of concurrent WebSocket connections, using consistent hashing to route users in the same meeting to the same server for efficiency.'
      },

      requiredComponents: ['Client', 'Signaling Server', 'WebSocket Gateway', 'Room Service', 'Redis'],

      hints: [
        { trigger: 'stuck', content: 'Signaling server manages rooms and forwards SDP/ICE messages between participants' },
        { trigger: 'http_polling', content: 'HTTP polling is too slow for signaling. Use WebSocket for real-time messaging.' },
        { trigger: 'no_room_state', content: 'You need to track who is in each room to forward messages correctly.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'WebSocket Gateway' },
          { from: 'WebSocket Gateway', to: 'Signaling Server' },
          { from: 'Signaling Server', to: 'Room Service' },
          { from: 'Room Service', to: 'Redis' }
        ],
        requiredComponents: ['WebSocket Gateway', 'Room Service', 'Redis']
      },

      thinkingFramework: {
        approach: 'state-management',
        questions: [
          'What state does the signaling server need to maintain?',
          'How do we handle user disconnection?',
          'How do we scale signaling across multiple servers?'
        ],
        tradeoffs: [
          { option: 'Stateless signaling', pros: ['Easy to scale'], cons: ['Need external state store'] },
          { option: 'Sticky sessions', pros: ['Simple', 'Fast'], cons: ['Harder failover'] }
        ]
      }
    },

    {
      id: 'step-3',
      title: 'Media Controls',
      phase: 'phase-1-beginner',
      description: 'Implement mute/unmute, camera toggle, and call quality indicators',
      order: 3,

      educationalContent: {
        title: 'Controlling Media Streams',
        explanation: `Users need to control their audio/video during calls. This involves local track management and communicating state to other participants.

**Local Media Controls:**
\`\`\`typescript
class MediaControls {
  private stream: MediaStream;
  private audioTrack: MediaStreamTrack;
  private videoTrack: MediaStreamTrack;

  toggleAudio(): boolean {
    this.audioTrack.enabled = !this.audioTrack.enabled;
    // Notify other participants
    signalingServer.send({
      type: 'mute',
      track: 'audio',
      muted: !this.audioTrack.enabled
    });
    return this.audioTrack.enabled;
  }

  toggleVideo(): boolean {
    this.videoTrack.enabled = !this.videoTrack.enabled;
    signalingServer.send({
      type: 'mute',
      track: 'video',
      muted: !this.videoTrack.enabled
    });
    return this.videoTrack.enabled;
  }

  // Switch camera (mobile front/back)
  async switchCamera() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(d => d.kind === 'videoinput');
    // ... switch to next camera
  }
}
\`\`\`

**Track.enabled vs Track.stop():**
\`\`\`
enabled = false: Track still exists, sends silence/black
  → Quick to re-enable
  → Keeps connection alive

stop(): Track is destroyed, releases camera
  → Need to re-negotiate to restart
  → Frees hardware resources
\`\`\`

**Quality Indicators:**
Show users their connection quality:
\`\`\`typescript
interface ConnectionStats {
  // From RTCPeerConnection.getStats()
  roundTripTime: number;      // Latency in ms
  packetsLost: number;        // Packet loss count
  packetsLostPercent: number; // Loss percentage
  bitrate: number;            // Current bitrate
  frameRate: number;          // Video FPS
  resolution: { width: number; height: number };
}

function getQualityLevel(stats: ConnectionStats): 'good' | 'fair' | 'poor' {
  if (stats.packetsLostPercent > 5 || stats.roundTripTime > 300) {
    return 'poor';
  }
  if (stats.packetsLostPercent > 2 || stats.roundTripTime > 150) {
    return 'fair';
  }
  return 'good';
}
\`\`\`

**Bandwidth Adaptation:**
Reduce quality when network is poor:
\`\`\`typescript
async function reduceQuality(pc: RTCPeerConnection) {
  const sender = pc.getSenders().find(s => s.track?.kind === 'video');
  const params = sender.getParameters();
  params.encodings[0].maxBitrate = 500000; // 500kbps
  params.encodings[0].maxFramerate = 15;    // 15fps
  await sender.setParameters(params);
}
\`\`\``,
        keyInsight: 'Muting uses track.enabled (fast toggle) rather than stopping the track (requires renegotiation). Quality indicators come from WebRTC statistics API.',
        commonMistakes: [
          'Using track.stop() for mute (breaks reconnection)',
          'Not notifying other participants about mute state',
          'Ignoring connection quality feedback'
        ],
        interviewTips: [
          'Explain track.enabled vs track.stop()',
          'Discuss how to get connection statistics',
          'Mention adaptive bitrate based on network conditions'
        ],
        realWorldExample: 'Zoom shows a colored bar indicator for connection quality (green/yellow/red) based on packet loss and latency metrics from the WebRTC stats API.'
      },

      requiredComponents: ['Client', 'Signaling Server'],

      hints: [
        { trigger: 'stuck', content: 'Mute uses track.enabled (not stop). Notify others via signaling when mute state changes.' },
        { trigger: 'stop_track', content: 'track.stop() destroys the track. Use track.enabled for quick mute toggle.' },
        { trigger: 'no_stats', content: 'WebRTC provides statistics. Use getStats() to show connection quality.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'Signaling Server' }
        ],
        requiredComponents: ['Client', 'Signaling Server']
      },

      thinkingFramework: {
        approach: 'user-experience',
        questions: [
          'How do we make mute/unmute instant?',
          'How do other participants know someone is muted?',
          'How do we communicate connection quality to users?'
        ],
        tradeoffs: [
          { option: 'Always send track (muted)', pros: ['Fast toggle'], cons: ['Bandwidth even when muted'] },
          { option: 'Stop track when muted', pros: ['Saves bandwidth'], cons: ['Slow to unmute'] }
        ]
      }
    },

    // ============== PHASE 2: GROUP MEETINGS ==============
    {
      id: 'step-4',
      title: 'Mesh Topology for Small Groups',
      phase: 'phase-2-intermediate',
      description: 'Scale from 1:1 to small group calls using mesh topology',
      order: 4,

      educationalContent: {
        title: 'Group Calls with Mesh Topology',
        explanation: `For small groups (3-6 participants), each participant connects directly to every other participant. This is called mesh topology.

**Mesh Architecture:**
\`\`\`
4-person call = 6 peer connections

    A ←→ B
    ↕ ✕ ↕
    C ←→ D

Each participant:
- Sends their video 3 times (to each other person)
- Receives 3 video streams (from each other person)
\`\`\`

**Connection Formula:**
\`\`\`
Connections = n(n-1)/2

4 people: 4×3/2 = 6 connections
6 people: 6×5/2 = 15 connections
10 people: 10×9/2 = 45 connections

Bandwidth per participant = (n-1) × upload + (n-1) × download
\`\`\`

**Implementation:**
\`\`\`typescript
class MeshRoom {
  private connections: Map<string, RTCPeerConnection> = new Map();

  async onUserJoined(newUserId: string) {
    // Create connection to new user
    const pc = this.createPeerConnection(newUserId);
    this.connections.set(newUserId, pc);

    // Add local stream to connection
    this.localStream.getTracks().forEach(track => {
      pc.addTrack(track, this.localStream);
    });

    // Create offer if we're the "newer" peer
    if (this.myUserId > newUserId) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.signaling.send({
        type: 'offer',
        targetUserId: newUserId,
        sdp: offer
      });
    }
  }

  onUserLeft(userId: string) {
    const pc = this.connections.get(userId);
    if (pc) {
      pc.close();
      this.connections.delete(userId);
    }
  }
}
\`\`\`

**Mesh Limitations:**
\`\`\`
Upload bandwidth with 720p video (~2 Mbps per stream):

4 people: 3 × 2 Mbps = 6 Mbps upload needed
6 people: 5 × 2 Mbps = 10 Mbps upload needed
10 people: 9 × 2 Mbps = 18 Mbps upload needed

Most home connections can't handle 10+ participants!
\`\`\`

**When Mesh Works:**
- Small groups (≤6 participants)
- Good network conditions
- Low latency requirements
- Budget constraints (no server needed for media)`,
        keyInsight: 'Mesh topology is simple and low-latency, but bandwidth grows quadratically with participants - it only works for small groups before hitting upload bandwidth limits',
        commonMistakes: [
          'Trying to use mesh for large meetings (bandwidth explosion)',
          'Not handling mid-meeting joins gracefully',
          'Forgetting to close connections when users leave'
        ],
        interviewTips: [
          'Calculate bandwidth requirements for different group sizes',
          'Explain why mesh fails beyond ~6 participants',
          'Mention that mesh is still used for small groups (Google Meet)'
        ],
        realWorldExample: 'Google Meet uses mesh for 2-4 participants, then automatically switches to their SFU when the 5th person joins. Users don\'t notice the transition.'
      },

      requiredComponents: ['Client', 'Signaling Server', 'STUN Server', 'TURN Server'],

      hints: [
        { trigger: 'stuck', content: 'In mesh, every participant connects to every other participant directly' },
        { trigger: 'single_connection', content: 'With N participants, each person needs N-1 peer connections (one to each other person).' },
        { trigger: 'large_group', content: 'Mesh doesnt scale past 5-6 people. Upload bandwidth becomes the bottleneck.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'Signaling Server' },
          { from: 'Client', to: 'STUN Server' }
        ],
        requiredComponents: ['Client', 'Signaling Server', 'STUN Server']
      },

      thinkingFramework: {
        approach: 'topology-selection',
        questions: [
          'How many connections does each participant need?',
          'What limits the number of participants in mesh?',
          'When should we switch away from mesh?'
        ],
        tradeoffs: [
          { option: 'Mesh topology', pros: ['No media server', 'Low latency', 'Cheap'], cons: ['Bandwidth scales O(n²)', 'Max ~6 participants'] },
          { option: 'Server-based', pros: ['Scales to 100s'], cons: ['Server cost', 'Adds latency'] }
        ]
      }
    },

    {
      id: 'step-5',
      title: 'Screen Sharing',
      phase: 'phase-2-intermediate',
      description: 'Add the ability to share screen, window, or application',
      order: 5,

      educationalContent: {
        title: 'Implementing Screen Share',
        explanation: `Screen sharing is essential for meetings. WebRTC supports it natively, but there are important design decisions.

**Capturing Screen:**
\`\`\`typescript
async function startScreenShare(): Promise<MediaStream> {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: 'always',  // Show cursor
      displaySurface: 'monitor',  // Hint: prefer full screen
      logicalSurface: true,
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      frameRate: { ideal: 30, max: 30 }
    },
    audio: true  // System audio (if supported)
  });
  return stream;
}
\`\`\`

**Display Surface Options:**
User chooses what to share:
- Entire screen (shows everything)
- Application window (follows window)
- Browser tab (with tab audio)

**Replacing vs Adding Track:**
\`\`\`typescript
// Option 1: Replace camera with screen
const sender = pc.getSenders().find(s => s.track?.kind === 'video');
await sender.replaceTrack(screenTrack);

// Option 2: Add screen as second video track
pc.addTrack(screenTrack, screenStream);
// Requires renegotiation!

// UI consideration:
// Replace: Other see screen OR camera
// Add: Others see screen AND camera (picture-in-picture)
\`\`\`

**Screen Share Layout:**
\`\`\`
Presenter mode:
┌─────────────────────────────────┐
│                                 │
│       Screen Share (large)      │
│                                 │
├────────┬────────┬───────┬───────┤
│ User 1 │ User 2 │ User 3│ User 4│
└────────┴────────┴───────┴───────┘

Gallery mode with screen:
┌──────────────┬──────────────┐
│    Screen    │    User 1    │
├──────────────┼──────────────┤
│    User 2    │    User 3    │
└──────────────┴──────────────┘
\`\`\`

**Screen Share Challenges:**
1. **High resolution**: 1080p or 4K needs more bandwidth
2. **Variable frame rate**: Static screen needs less FPS
3. **Text readability**: Compression must preserve text
4. **Content protection**: Some apps block capture (DRM)`,
        keyInsight: 'Screen sharing uses getDisplayMedia API and can either replace the camera track (simple) or add as a second track (allows camera + screen simultaneously)',
        commonMistakes: [
          'Not handling screen share stop gracefully',
          'Using same encoding settings for screen and camera',
          'Forgetting to signal screen share state to other participants'
        ],
        interviewTips: [
          'Explain replace vs add track approaches',
          'Discuss layout changes when someone shares screen',
          'Mention bandwidth considerations for high-res screen share'
        ],
        realWorldExample: 'Zoom detects when youre sharing slides vs a video, and automatically adjusts encoding - lower framerate for slides (text clarity) and higher for video playback.'
      },

      requiredComponents: ['Client', 'Signaling Server'],

      hints: [
        { trigger: 'stuck', content: 'Use getDisplayMedia for screen capture. Either replace camera track or add as second track.' },
        { trigger: 'no_layout', content: 'Screen share changes the UI layout. Presenter mode shows screen large with small participant thumbnails.' },
        { trigger: 'same_encoding', content: 'Screen share (text) needs different encoding than camera (faces). Optimize for content type.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'Signaling Server' }
        ],
        requiredComponents: ['Client', 'Signaling Server']
      },

      thinkingFramework: {
        approach: 'feature-integration',
        questions: [
          'How do we capture the screen?',
          'How do we send screen alongside camera?',
          'How does the UI change when someone shares?'
        ],
        tradeoffs: [
          { option: 'Replace camera track', pros: ['Simple', 'No renegotiation'], cons: ['Cant show camera + screen'] },
          { option: 'Add second track', pros: ['Camera + screen together'], cons: ['Renegotiation needed', 'More bandwidth'] }
        ]
      }
    },

    {
      id: 'step-6',
      title: 'In-Meeting Chat',
      phase: 'phase-2-intermediate',
      description: 'Add text chat that runs parallel to the video call',
      order: 6,

      educationalContent: {
        title: 'Real-Time Meeting Chat',
        explanation: `In-meeting chat is essential for sharing links, asking questions without interrupting, and communicating when audio fails.

**Chat Architecture Options:**

**Option 1: WebRTC Data Channel**
\`\`\`typescript
// Create data channel on peer connection
const dataChannel = pc.createDataChannel('chat', {
  ordered: true,  // Messages arrive in order
});

dataChannel.onmessage = (event) => {
  const message = JSON.parse(event.data);
  displayMessage(message);
};

function sendMessage(text: string) {
  const message = {
    id: generateId(),
    senderId: myUserId,
    text,
    timestamp: Date.now()
  };
  dataChannel.send(JSON.stringify(message));
}
\`\`\`

**Option 2: Signaling Server**
Use existing WebSocket connection for chat:
\`\`\`typescript
signalingServer.send({
  type: 'chat',
  roomId,
  message: {
    id: generateId(),
    text,
    timestamp: Date.now()
  }
});
\`\`\`

**Comparison:**
\`\`\`
Data Channel:
  + Low latency (peer-to-peer)
  + Encrypted end-to-end
  - Need connection to each peer (mesh issue)
  - Lost if peer disconnects before receipt

Signaling Server:
  + Central delivery (guaranteed to room)
  + Chat history available
  - Additional server load
  - Higher latency
\`\`\`

**Chat Features:**
\`\`\`typescript
interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  type: 'message' | 'file' | 'reaction';

  // For private messages
  recipientId?: string;

  // For file sharing
  file?: {
    name: string;
    size: number;
    url: string;
  };

  // Reactions
  reaction?: string;  // "👍", "❤️"
  reactionTo?: string;  // Message ID being reacted to
}
\`\`\`

**Chat Moderation:**
Host controls:
- Disable chat entirely
- Disable private messages
- Only allow chat to host
- Clear chat for everyone`,
        keyInsight: 'WebRTC data channels enable peer-to-peer chat with low latency, but for reliability and history, routing through your server is often simpler',
        commonMistakes: [
          'Using HTTP for chat messages (too slow)',
          'Not handling chat when user joins mid-meeting (no history)',
          'Forgetting private message feature'
        ],
        interviewTips: [
          'Compare data channel vs signaling server approaches',
          'Discuss chat history for late joiners',
          'Mention host moderation controls'
        ],
        realWorldExample: 'Zoom uses their own servers for chat (not data channels) because they need features like chat history, file sharing, and moderation that require server involvement.'
      },

      requiredComponents: ['Client', 'Signaling Server', 'Chat Service', 'Message Database'],

      hints: [
        { trigger: 'stuck', content: 'Chat can use WebRTC data channels (P2P) or route through your server. Server is simpler for features.' },
        { trigger: 'data_channel_only', content: 'Data channels are P2P only. Late joiners wont see chat history without a server.' },
        { trigger: 'no_moderation', content: 'Hosts need controls: disable chat, private message only to host, clear chat.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'Signaling Server' },
          { from: 'Signaling Server', to: 'Chat Service' },
          { from: 'Chat Service', to: 'Message Database' }
        ],
        requiredComponents: ['Chat Service', 'Message Database']
      },

      thinkingFramework: {
        approach: 'architecture-choice',
        questions: [
          'Should chat use data channels or server?',
          'How do late joiners see chat history?',
          'What moderation features do hosts need?'
        ],
        tradeoffs: [
          { option: 'Data channels (P2P)', pros: ['Low latency', 'E2E encrypted'], cons: ['No history', 'Mesh complexity'] },
          { option: 'Server-routed chat', pros: ['History', 'Features', 'Simple'], cons: ['Server load', 'Higher latency'] }
        ]
      }
    },

    // ============== PHASE 3: ENTERPRISE SCALE ==============
    {
      id: 'step-7',
      title: 'SFU Architecture',
      phase: 'phase-3-advanced',
      description: 'Implement Selective Forwarding Unit for large meetings (10-100 participants)',
      order: 7,

      educationalContent: {
        title: 'Scaling with SFU (Selective Forwarding Unit)',
        explanation: `For meetings larger than ~6 people, mesh topology fails. The solution is an SFU - a server that receives all streams and forwards them selectively.

**SFU Architecture:**
\`\`\`
      ┌─────────────┐
      │    SFU      │
      │   Server    │
      └──────┬──────┘
        ↑    │    ↑
    ┌───┘    ↓    └───┐
    │        │        │
  ┌─┴─┐   ┌──┴──┐   ┌─┴─┐
  │ A │   │  B  │   │ C │
  └───┘   └─────┘   └───┘

Each participant:
- Uploads 1 stream to SFU
- Downloads N-1 streams from SFU
\`\`\`

**Bandwidth Comparison:**
\`\`\`
20-person meeting at 2 Mbps per stream:

Mesh:
  Upload: 19 × 2 = 38 Mbps per participant (impossible!)

SFU:
  Upload: 1 × 2 = 2 Mbps per participant
  Download: 19 × 2 = 38 Mbps (achievable for most connections)
\`\`\`

**Selective Forwarding:**
SFU doesn't decode video - it just routes packets:
\`\`\`
"Selective" because it can:
- Forward only active speakers
- Forward lower quality to constrained receivers
- Skip forwarding to users who have that video hidden
\`\`\`

**Simulcast:**
Sender encodes multiple qualities:
\`\`\`typescript
// Send 3 quality layers
const encodings = [
  { rid: 'low', maxBitrate: 150000, maxFramerate: 15 },
  { rid: 'medium', maxBitrate: 500000, maxFramerate: 30 },
  { rid: 'high', maxBitrate: 2500000, maxFramerate: 30 }
];

const sender = pc.addTransceiver('video', {
  sendEncodings: encodings
});
\`\`\`

SFU chooses which layer to forward:
- Active speaker: high quality
- Thumbnail: low quality
- Hidden: nothing

**SFU Technologies:**
- **Janus**: Open source, C-based
- **mediasoup**: Open source, Node.js
- **Jitsi Videobridge**: Open source, Java
- **Twilio**: Cloud service
- **Agora**: Cloud service`,
        keyInsight: 'SFU reduces upload bandwidth from O(n) to O(1) per participant, making large meetings possible. Combined with simulcast, it can adapt quality per receiver.',
        commonMistakes: [
          'Confusing SFU with MCU (SFU doesn\'t transcode)',
          'Not implementing simulcast (all receivers get same quality)',
          'Single SFU server (need distribution for scale)'
        ],
        interviewTips: [
          'Explain the bandwidth math for mesh vs SFU',
          'Discuss simulcast for adaptive quality',
          'Mention that SFU just forwards, doesn\'t transcode'
        ],
        realWorldExample: 'Zoom uses their own SFU infrastructure with data centers worldwide. Each SFU can handle thousands of participants, with simulcast enabling mobile users to receive lower quality.'
      },

      requiredComponents: ['Client', 'Signaling Server', 'SFU Server', 'Load Balancer'],

      hints: [
        { trigger: 'stuck', content: 'SFU receives one stream from each participant and forwards to others. Upload is O(1) per user.' },
        { trigger: 'mesh_still', content: 'Mesh doesnt scale past 6 people. SFU centralizes media routing.' },
        { trigger: 'no_simulcast', content: 'Without simulcast, everyone gets the same quality. Send multiple quality layers.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'Signaling Server' },
          { from: 'Client', to: 'SFU Server' },
          { from: 'Load Balancer', to: 'SFU Server' }
        ],
        requiredComponents: ['SFU Server', 'Load Balancer']
      },

      thinkingFramework: {
        approach: 'scalability',
        questions: [
          'Why doesn\'t mesh work for large meetings?',
          'How does SFU reduce bandwidth requirements?',
          'How do we handle different receiver capabilities?'
        ],
        tradeoffs: [
          { option: 'Mesh', pros: ['No server', 'Low latency'], cons: ['O(n²) bandwidth', 'Max ~6 people'] },
          { option: 'SFU', pros: ['Scales to 100s', 'O(n) bandwidth'], cons: ['Server infrastructure', 'Slightly higher latency'] }
        ]
      }
    },

    {
      id: 'step-8',
      title: 'Meeting Recording',
      phase: 'phase-3-advanced',
      description: 'Implement server-side recording of meetings for later playback',
      order: 8,

      educationalContent: {
        title: 'Recording Video Meetings',
        explanation: `Meeting recording is essential for enterprise customers. The challenge is recording multiple streams and producing a watchable video.

**Recording Approaches:**

**Option 1: Client-Side Recording**
Each participant records locally:
\`\`\`typescript
const recorder = new MediaRecorder(stream, {
  mimeType: 'video/webm;codecs=vp9'
});
recorder.ondataavailable = (e) => chunks.push(e.data);
\`\`\`
Problem: Only records what that client sees/hears.

**Option 2: SFU-Side Recording**
SFU saves all incoming streams:
\`\`\`
SFU receives:
- User A video/audio
- User B video/audio
- User C screen share

Save each as separate file, compose later
\`\`\`

**Option 3: Composite Recording**
Join meeting as a "recording bot":
\`\`\`
Recording Bot joins meeting
Receives combined layout
Encodes single video file

Pros: What you see is what you get
Cons: Fixed layout, more CPU
\`\`\`

**Recording Architecture:**
\`\`\`
           ┌─────────────┐
           │ SFU Server  │
           └──────┬──────┘
                  │ streams
           ┌──────┴──────┐
           │  Recording  │
           │   Service   │
           └──────┬──────┘
                  │ raw files
           ┌──────┴──────┐
           │ Transcoding │
           │   Queue     │
           └──────┬──────┘
                  │ processed
           ┌──────┴──────┐
           │   Storage   │
           └─────────────┘
\`\`\`

**Post-Processing Pipeline:**
1. Collect raw streams (separate audio/video per user)
2. Synchronize timestamps
3. Compose layout (grid, speaker view)
4. Transcode to standard format (MP4)
5. Generate chapters from speaker changes
6. Upload to storage, generate playback URL

**Storage Requirements:**
\`\`\`
1-hour meeting, 10 participants:
Raw: ~10GB (all streams)
Processed: ~500MB (single video)
\`\`\``,
        keyInsight: 'Server-side recording at the SFU captures all streams separately, then post-processes them into a composed video with proper layout and synchronization',
        commonMistakes: [
          'Client-side only recording (incomplete view)',
          'Not synchronizing multiple streams',
          'Storing raw streams without compression (expensive)'
        ],
        interviewTips: [
          'Compare client vs server-side recording',
          'Discuss the post-processing pipeline',
          'Mention storage and transcoding costs'
        ],
        realWorldExample: 'Zoom\'s cloud recording captures all streams server-side, then processes them into a single video with active speaker layout. The recording is available within hours of meeting end.'
      },

      requiredComponents: ['SFU Server', 'Recording Service', 'Transcoding Queue', 'Object Storage', 'CDN'],

      hints: [
        { trigger: 'stuck', content: 'Recording captures streams at the SFU, then post-processes into a composed video' },
        { trigger: 'client_only', content: 'Client recording only captures that clients view. Server-side captures everything.' },
        { trigger: 'no_processing', content: 'Raw streams need synchronization and composition. Add a transcoding pipeline.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'SFU Server', to: 'Recording Service' },
          { from: 'Recording Service', to: 'Transcoding Queue' },
          { from: 'Transcoding Queue', to: 'Object Storage' },
          { from: 'Object Storage', to: 'CDN' }
        ],
        requiredComponents: ['Recording Service', 'Transcoding Queue', 'Object Storage']
      },

      thinkingFramework: {
        approach: 'pipeline-design',
        questions: [
          'Where do we capture the recording?',
          'How do we synchronize multiple streams?',
          'How do we produce a watchable video file?'
        ],
        tradeoffs: [
          { option: 'Client recording', pros: ['No server load'], cons: ['Incomplete', 'Unreliable'] },
          { option: 'SFU recording', pros: ['Complete', 'Reliable'], cons: ['Storage cost', 'Processing time'] }
        ]
      }
    },

    {
      id: 'step-9',
      title: 'Global Distribution',
      phase: 'phase-3-advanced',
      description: 'Deploy SFU servers globally for low latency worldwide',
      order: 9,

      educationalContent: {
        title: 'Global Media Server Distribution',
        explanation: `Video calls are latency-sensitive. Users on different continents need nearby SFU servers, but meetings must still work across regions.

**Latency Impact:**
\`\`\`
Same city: ~20ms round trip
Same continent: ~50-100ms
Cross-Atlantic: ~150-200ms
US to Asia: ~250-300ms

> 200ms latency = noticeable delay in conversation
\`\`\`

**Regional SFU Deployment:**
\`\`\`
        US-West       US-East       Europe        Asia
         ┌───┐         ┌───┐         ┌───┐        ┌───┐
         │SFU│←───────→│SFU│←───────→│SFU│←──────→│SFU│
         └─┬─┘         └─┬─┘         └─┬─┘        └─┬─┘
           │             │             │            │
         Users         Users         Users        Users
\`\`\`

**Cascading SFU Architecture:**
When participants are in different regions:
\`\`\`
User A (US) → SFU-US ←→ SFU-EU ← User B (EU)

1. A connects to nearest SFU (US)
2. B connects to nearest SFU (EU)
3. SFUs cascade streams between each other
4. Each user experiences low latency to their SFU
5. Cross-region latency only between SFUs
\`\`\`

**Server Selection:**
\`\`\`typescript
async function selectSFU(userId: string): Promise<SFUServer> {
  // Get user's location from IP or explicit
  const userLocation = await geolocate(userId);

  // Find closest SFU with capacity
  const sfus = await getSFUServers();
  const available = sfus.filter(s => s.load < 0.8);

  return available.reduce((best, sfu) => {
    const distance = haversine(userLocation, sfu.location);
    return distance < best.distance ? { sfu, distance } : best;
  }, { sfu: null, distance: Infinity }).sfu;
}
\`\`\`

**Handling SFU Failure:**
\`\`\`
SFU-US fails:
1. Detect failure (health check timeout)
2. Migrate US users to SFU-US-2 or SFU-US-East
3. Re-establish peer connections
4. Brief interruption (~2-5 seconds)
\`\`\`

**Anycast vs GeoDNS:**
- **Anycast**: Same IP routes to nearest server (simpler)
- **GeoDNS**: Different IPs per region (more control)`,
        keyInsight: 'Global video calls require regional SFU servers with cascading between regions - users connect to nearby SFUs, and SFUs relay between each other for cross-region participants',
        commonMistakes: [
          'Single global SFU (high latency for distant users)',
          'No failover when regional SFU fails',
          'Not accounting for cross-region bandwidth costs'
        ],
        interviewTips: [
          'Explain cascading SFU architecture',
          'Discuss server selection based on latency',
          'Mention failover and migration strategies'
        ],
        realWorldExample: 'Zoom has data centers on every continent. When you join a meeting, you connect to the nearest one. If participants are worldwide, their SFUs cascade streams between regions.'
      },

      requiredComponents: ['Client', 'Signaling Server', 'SFU Server', 'Global Load Balancer', 'GeoDNS'],

      hints: [
        { trigger: 'stuck', content: 'Deploy SFUs in multiple regions. Users connect to nearest SFU, SFUs cascade streams between regions.' },
        { trigger: 'single_sfu', content: 'One SFU means high latency for distant users. Deploy regionally.' },
        { trigger: 'no_cascade', content: 'Cross-region calls need SFU cascading. Without it, all traffic routes through one region.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'GeoDNS' },
          { from: 'GeoDNS', to: 'Global Load Balancer' },
          { from: 'Global Load Balancer', to: 'SFU Server' }
        ],
        requiredComponents: ['Global Load Balancer', 'GeoDNS']
      },

      thinkingFramework: {
        approach: 'geographic-distribution',
        questions: [
          'How do we minimize latency for global users?',
          'How do cross-region meetings work?',
          'How do we handle regional server failure?'
        ],
        tradeoffs: [
          { option: 'Single region', pros: ['Simple'], cons: ['High latency for distant users'] },
          { option: 'Multi-region with cascading', pros: ['Low latency globally'], cons: ['Complex', 'Cross-region bandwidth costs'] }
        ]
      }
    },

    // ============== PHASE 4: ADVANCED FEATURES ==============
    {
      id: 'step-10',
      title: 'Virtual Backgrounds',
      phase: 'phase-4-expert',
      description: 'Implement real-time background replacement using ML segmentation',
      order: 10,

      educationalContent: {
        title: 'ML-Powered Virtual Backgrounds',
        explanation: `Virtual backgrounds replace or blur your real background in real-time, requiring per-frame ML inference.

**How It Works:**
\`\`\`
1. Capture camera frame
2. Run segmentation model (person vs background)
3. Apply mask to separate person
4. Replace/blur background
5. Composite final frame
6. Send to WebRTC
\`\`\`

**Segmentation Model:**
\`\`\`typescript
// Using TensorFlow.js or MediaPipe
const model = await bodyPix.load();

async function processFrame(video: HTMLVideoElement) {
  // Segment person from background
  const segmentation = await model.segmentPerson(video);

  // segmentation.data is a mask:
  // 1 = person, 0 = background
  return segmentation;
}
\`\`\`

**Rendering Pipeline:**
\`\`\`typescript
function applyVirtualBackground(
  frame: ImageData,
  mask: Uint8Array,
  background: ImageData | 'blur'
): ImageData {
  const output = new ImageData(frame.width, frame.height);

  for (let i = 0; i < mask.length; i++) {
    const pixelIndex = i * 4;
    if (mask[i] === 1) {
      // Person pixel - keep original
      output.data[pixelIndex] = frame.data[pixelIndex];
      output.data[pixelIndex + 1] = frame.data[pixelIndex + 1];
      output.data[pixelIndex + 2] = frame.data[pixelIndex + 2];
      output.data[pixelIndex + 3] = 255;
    } else {
      // Background pixel - replace
      if (background === 'blur') {
        // Apply blur to original
        output.data[pixelIndex] = blurredFrame[pixelIndex];
        // ...
      } else {
        // Use virtual background image
        output.data[pixelIndex] = background.data[pixelIndex];
        // ...
      }
    }
  }
  return output;
}
\`\`\`

**Performance Challenges:**
\`\`\`
30 FPS video = 33ms per frame budget

Model inference: 10-20ms (GPU) or 50-100ms (CPU)
Compositing: 2-5ms
Total: 15-25ms with GPU, too slow without

Solutions:
- Use WebGL for GPU acceleration
- Run inference every 2nd frame, interpolate
- Use lighter model (MobileNet-based)
- Offload to Web Worker
\`\`\`

**Edge Refinement:**
Raw segmentation has rough edges:
\`\`\`
Improvements:
- Feather mask edges (soft blend)
- Use joint bilateral filter
- Add temporal smoothing (reduce flicker)
\`\`\``,
        keyInsight: 'Virtual backgrounds require real-time ML segmentation (~30 FPS), which is only feasible with GPU acceleration via WebGL. Edge quality and temporal consistency are key UX factors.',
        commonMistakes: [
          'Running inference on CPU (too slow)',
          'Not feathering edges (looks cut out)',
          'No temporal smoothing (flickering edges)'
        ],
        interviewTips: [
          'Explain the per-frame processing pipeline',
          'Discuss GPU acceleration requirements',
          'Mention edge refinement and temporal consistency'
        ],
        realWorldExample: 'Zoom\'s virtual backgrounds use a neural network optimized for their app. They recommend a green screen for best results because segmentation without one is harder.'
      },

      requiredComponents: ['Client', 'ML Model', 'WebGL Renderer'],

      hints: [
        { trigger: 'stuck', content: 'Virtual backgrounds need: (1) ML segmentation model, (2) GPU rendering via WebGL, (3) Edge refinement' },
        { trigger: 'no_gpu', content: 'CPU inference is too slow for 30 FPS. Must use WebGL for GPU acceleration.' },
        { trigger: 'rough_edges', content: 'Raw segmentation has rough edges. Apply feathering and temporal smoothing.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'ML Model' },
          { from: 'ML Model', to: 'WebGL Renderer' }
        ],
        requiredComponents: ['ML Model', 'WebGL Renderer']
      },

      thinkingFramework: {
        approach: 'real-time-ml',
        questions: [
          'How do we achieve 30 FPS inference?',
          'How do we make edges look natural?',
          'What happens on devices without GPU?'
        ],
        tradeoffs: [
          { option: 'High-quality model', pros: ['Better segmentation'], cons: ['Slower', 'More power'] },
          { option: 'Lightweight model', pros: ['Fast', 'Works on more devices'], cons: ['Rougher edges'] }
        ]
      }
    },

    {
      id: 'step-11',
      title: 'Live Transcription',
      phase: 'phase-4-expert',
      description: 'Add real-time speech-to-text transcription and captions',
      order: 11,

      educationalContent: {
        title: 'Real-Time Meeting Transcription',
        explanation: `Live transcription converts speech to text in real-time, enabling captions, searchable meeting notes, and accessibility.

**Transcription Architecture:**
\`\`\`
Audio Stream → Speech-to-Text API → Text → Distribute to clients

Where to transcribe?
- Client-side: Lower latency, privacy, but limited accuracy
- Server-side: Better accuracy, more features, but latency
\`\`\`

**Server-Side Pipeline:**
\`\`\`
SFU → Audio Extractor → ASR Service → Text → WebSocket → Clients
                            ↓
                        Transcript DB
\`\`\`

**Speech Recognition Services:**
\`\`\`typescript
// Google Cloud Speech-to-Text (streaming)
const request = {
  config: {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
    enableAutomaticPunctuation: true,
    enableSpeakerDiarization: true,
    diarizationSpeakerCount: 4,
  },
  interimResults: true,  // Show partial results
};

const recognizeStream = speechClient
  .streamingRecognize(request)
  .on('data', (data) => {
    const transcript = data.results[0].alternatives[0].transcript;
    const isFinal = data.results[0].isFinal;
    broadcastTranscript({ transcript, isFinal, speakerId });
  });

// Pipe audio to recognition
audioStream.pipe(recognizeStream);
\`\`\`

**Speaker Diarization:**
Identify who is speaking:
\`\`\`
"Hello everyone" - Speaker 1
"Hi, good to see you" - Speaker 2
"Let's get started" - Speaker 1
\`\`\`

Approaches:
- Voice fingerprinting per participant
- Map ASR speaker IDs to meeting participants
- Use active speaker detection from SFU

**Latency Optimization:**
\`\`\`
Goal: < 2 second delay from speech to caption

Breakdown:
- Audio collection: 100ms chunks
- Network to ASR: 50ms
- ASR processing: 500-1000ms
- Broadcast to clients: 50ms
Total: 700-1200ms (acceptable)

Show interim results for faster feedback
\`\`\`

**Transcript Storage:**
\`\`\`typescript
interface TranscriptEntry {
  meetingId: string;
  timestamp: number;  // Video timestamp for sync
  speakerId: string;
  speakerName: string;
  text: string;
  confidence: number;
  isFinal: boolean;
}
\`\`\``,
        keyInsight: 'Real-time transcription uses streaming ASR with interim results for low perceived latency. Speaker diarization maps voice segments to meeting participants.',
        commonMistakes: [
          'Waiting for final results (too much delay)',
          'Not handling speaker identification',
          'Missing timestamp sync for recording playback'
        ],
        interviewTips: [
          'Explain streaming vs batch transcription',
          'Discuss speaker diarization approaches',
          'Mention latency targets for live captions'
        ],
        realWorldExample: 'Zoom\'s live transcription uses Otter.ai integration. Captions appear with ~1-2 second delay, showing interim results that refine as more audio is processed.'
      },

      requiredComponents: ['SFU Server', 'Audio Extractor', 'ASR Service', 'Transcript Database', 'WebSocket Gateway'],

      hints: [
        { trigger: 'stuck', content: 'Transcription: SFU extracts audio → ASR service → broadcast text to clients' },
        { trigger: 'wait_final', content: 'Show interim results immediately. Waiting for final text feels too slow.' },
        { trigger: 'no_speaker', content: 'Users need to know who said what. Add speaker diarization.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'SFU Server', to: 'Audio Extractor' },
          { from: 'Audio Extractor', to: 'ASR Service' },
          { from: 'ASR Service', to: 'Transcript Database' },
          { from: 'ASR Service', to: 'WebSocket Gateway' }
        ],
        requiredComponents: ['Audio Extractor', 'ASR Service', 'Transcript Database']
      },

      thinkingFramework: {
        approach: 'streaming-pipeline',
        questions: [
          'How do we minimize transcription latency?',
          'How do we identify who is speaking?',
          'How do we sync transcripts with recording playback?'
        ],
        tradeoffs: [
          { option: 'Client-side transcription', pros: ['Private', 'Low latency'], cons: ['Less accurate', 'Device dependent'] },
          { option: 'Server-side transcription', pros: ['More accurate', 'More features'], cons: ['Privacy concerns', 'Server cost'] }
        ]
      }
    },

    {
      id: 'step-12',
      title: 'Breakout Rooms & Webinars',
      phase: 'phase-4-expert',
      description: 'Implement breakout rooms for small group discussions and webinar mode for large audiences',
      order: 12,

      educationalContent: {
        title: 'Advanced Meeting Modes',
        explanation: `Breakout rooms split a meeting into smaller groups, while webinars support thousands of view-only attendees with a few presenters.

**Breakout Rooms:**
\`\`\`typescript
interface BreakoutRoom {
  id: string;
  name: string;
  parentMeetingId: string;
  participants: string[];
  duration?: number;  // Auto-return after N minutes
}

interface BreakoutSession {
  meetingId: string;
  rooms: BreakoutRoom[];
  status: 'configuring' | 'active' | 'closing';
  autoAssign: boolean;
  allowReturnToMain: boolean;
}
\`\`\`

**Breakout Flow:**
\`\`\`
1. Host creates breakout session
2. Assigns participants (manual or auto)
3. Host "opens" breakout rooms
4. Each room becomes a separate SFU session
5. Host can broadcast message to all rooms
6. Host can visit any room
7. Timer or host closes rooms → all return to main
\`\`\`

**Implementation:**
\`\`\`typescript
async function moveToBreakout(userId: string, roomId: string) {
  // 1. Leave main meeting SFU
  await mainSFU.removeParticipant(userId);

  // 2. Signal client to join breakout SFU
  signalingServer.send(userId, {
    type: 'join-breakout',
    roomId,
    sfuEndpoint: breakoutSFU.endpoint
  });

  // 3. Client establishes new connection
  // 4. Update room state
  breakoutRoom.participants.push(userId);
}
\`\`\`

**Webinar Architecture:**
\`\`\`
Webinar (1000+ attendees):

    Presenters (10)                    Attendees (1000+)
         │                                    │
         ↓                                    ↓
    ┌─────────┐                        ┌─────────────┐
    │   SFU   │───────────────────────→│ CDN / Media │
    └─────────┘                        │   Server    │
                                       └─────────────┘

Presenters: Full WebRTC (can speak, share)
Attendees: One-way stream (view only)
\`\`\`

**Webinar Features:**
\`\`\`typescript
interface Webinar {
  id: string;
  panelists: Panelist[];  // Can speak
  attendees: Attendee[];  // View only

  features: {
    qa: boolean;          // Attendees can ask questions
    chat: boolean;        // Attendee chat
    polling: boolean;     // Live polls
    handRaise: boolean;   // Request to speak
    registration: boolean; // Pre-registration required
  };

  capacity: number;  // Max attendees
}
\`\`\`

**Scaling Webinars:**
\`\`\`
10 presenters → SFU (WebRTC, full duplex)
1000 attendees → Media server / CDN (one-way, optimized)

Why not SFU for attendees?
- SFU tracks each connection individually
- 1000 WebRTC connections = expensive
- One-way stream can use simpler protocols (HLS, etc.)
\`\`\``,
        keyInsight: 'Breakout rooms are separate SFU sessions spawned from the main meeting. Webinars use different architectures for presenters (SFU) vs attendees (broadcast/CDN) to scale efficiently.',
        commonMistakes: [
          'Treating breakout as same SFU (cant separate audio)',
          'Using WebRTC for all webinar attendees (doesnt scale)',
          'No host visibility into breakout rooms'
        ],
        interviewTips: [
          'Explain breakout as separate SFU sessions',
          'Discuss webinar architecture (SFU for panelists, broadcast for attendees)',
          'Mention the difference in scaling requirements'
        ],
        realWorldExample: 'Zoom webinars support 50,000 attendees by streaming video to attendees via their optimized delivery network, while only presenters use WebRTC for full interactivity.'
      },

      requiredComponents: ['Signaling Server', 'SFU Server', 'Breakout Manager', 'Webinar Service', 'Media Broadcast', 'CDN'],

      hints: [
        { trigger: 'stuck', content: 'Breakouts are separate SFU sessions. Webinars use SFU for presenters, broadcast for attendees.' },
        { trigger: 'same_sfu', content: 'Breakout rooms need separate SFUs so audio doesnt mix between rooms.' },
        { trigger: 'webinar_all_sfu', content: 'WebRTC for 1000 attendees is expensive. Use one-way broadcast/CDN for view-only attendees.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Signaling Server', to: 'Breakout Manager' },
          { from: 'Breakout Manager', to: 'SFU Server' },
          { from: 'Signaling Server', to: 'Webinar Service' },
          { from: 'Webinar Service', to: 'Media Broadcast' },
          { from: 'Media Broadcast', to: 'CDN' }
        ],
        requiredComponents: ['Breakout Manager', 'Webinar Service', 'Media Broadcast', 'CDN']
      },

      thinkingFramework: {
        approach: 'mode-specific-architecture',
        questions: [
          'How do breakout rooms differ from the main meeting?',
          'Why cant we use the same architecture for 1000 attendees?',
          'How does the host manage multiple breakout rooms?'
        ],
        tradeoffs: [
          { option: 'Single SFU for all', pros: ['Simpler'], cons: ['Breakouts share audio', 'Doesnt scale for webinars'] },
          { option: 'Mode-specific architecture', pros: ['Optimized per use case'], cons: ['More complex', 'Multiple systems'] }
        ]
      }
    }
  ],

  sandboxConfig: {
    availableComponents: [
      // Clients
      { type: 'Client', category: 'client' },
      { type: 'Mobile App', category: 'client' },

      // Gateways
      { type: 'WebSocket Gateway', category: 'gateway' },
      { type: 'Load Balancer', category: 'gateway' },
      { type: 'Global Load Balancer', category: 'gateway' },
      { type: 'GeoDNS', category: 'gateway' },
      { type: 'CDN', category: 'gateway' },

      // WebRTC Infrastructure
      { type: 'Signaling Server', category: 'webrtc' },
      { type: 'STUN Server', category: 'webrtc' },
      { type: 'TURN Server', category: 'webrtc' },
      { type: 'SFU Server', category: 'webrtc' },

      // Services
      { type: 'Room Service', category: 'service' },
      { type: 'Chat Service', category: 'service' },
      { type: 'Recording Service', category: 'service' },
      { type: 'Breakout Manager', category: 'service' },
      { type: 'Webinar Service', category: 'service' },
      { type: 'Media Broadcast', category: 'service' },

      // ML/Processing
      { type: 'ML Model', category: 'ml' },
      { type: 'WebGL Renderer', category: 'ml' },
      { type: 'Audio Extractor', category: 'processing' },
      { type: 'ASR Service', category: 'processing' },
      { type: 'Transcoding Queue', category: 'processing' },

      // Databases
      { type: 'Message Database', category: 'database' },
      { type: 'Transcript Database', category: 'database' },

      // Storage
      { type: 'Object Storage', category: 'storage' },
      { type: 'Redis', category: 'storage' }
    ]
  },

  learningObjectives: [
    'Understand WebRTC fundamentals: signaling, STUN, TURN',
    'Build signaling servers for call coordination',
    'Implement media controls with WebRTC statistics',
    'Design mesh topology for small group calls',
    'Add screen sharing with layout adaptation',
    'Build in-meeting chat with data channels or server routing',
    'Scale to large meetings with SFU architecture',
    'Implement server-side meeting recording',
    'Deploy global SFU infrastructure with cascading',
    'Add virtual backgrounds with real-time ML segmentation',
    'Build live transcription with speaker diarization',
    'Design breakout rooms and webinar architectures'
  ],

  prerequisites: [
    'Basic understanding of WebRTC concepts',
    'Familiarity with WebSocket communication',
    'Understanding of video encoding basics',
    'Basic knowledge of ML inference'
  ],

  interviewRelevance: {
    commonQuestions: [
      'Design Zoom / video conferencing system',
      'How does WebRTC work?',
      'How would you scale video calls to 100 participants?',
      'Design a meeting recording system',
      'How do virtual backgrounds work?'
    ],
    keyTakeaways: [
      'WebRTC requires signaling (your server) plus STUN/TURN for NAT traversal',
      'Mesh topology only works for ~6 participants due to bandwidth',
      'SFU reduces upload from O(n) to O(1) per participant',
      'Simulcast enables quality adaptation per receiver',
      'Virtual backgrounds require GPU-accelerated ML inference at 30 FPS',
      'Webinars use different architectures for presenters vs attendees'
    ],
    frequentMistakes: [
      'Forgetting TURN server (~20% of connections need it)',
      'Trying to use mesh for large meetings',
      'Not implementing simulcast with SFU',
      'Running ML on CPU (too slow for real-time)'
    ]
  }
};
