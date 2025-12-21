import { GuidedTutorial } from '../../types/guidedTutorial';

export const linkedinProgressiveGuidedTutorial: GuidedTutorial = {
  id: 'linkedin-progressive-guided',
  title: 'Design LinkedIn - Progressive Journey',
  description: 'Build a professional networking platform that evolves from basic profiles to a full career ecosystem with job matching and content feeds',
  difficulty: 'progressive',
  estimatedTime: '4-6 hours across all phases',

  systemContext: {
    title: 'LinkedIn',
    description: 'A professional networking platform connecting professionals, enabling job search, and facilitating business relationships',
    requirements: [
      'Create and manage professional profiles',
      'Connect with other professionals (1st, 2nd, 3rd degree)',
      'Post updates and articles to a professional feed',
      'Search and apply for jobs',
      'Send messages and InMail',
      'Receive personalized job and connection recommendations'
    ],
    existingInfrastructure: 'Starting fresh - you are building a new professional networking platform'
  },

  phases: [
    {
      id: 'phase-1-beginner',
      name: 'Phase 1: Professional Profiles',
      description: 'Your startup "ProConnect" is building a professional network. Users need to create profiles and connect with each other. Start with the fundamentals.',
      difficulty: 'beginner',
      requiredSteps: ['step-1', 'step-2', 'step-3'],
      unlockCriteria: null
    },
    {
      id: 'phase-2-intermediate',
      name: 'Phase 2: Network & Feed',
      description: 'ProConnect has 1M users! They want to see updates from connections and discover content. Time to build the professional feed.',
      difficulty: 'intermediate',
      requiredSteps: ['step-4', 'step-5', 'step-6'],
      unlockCriteria: { completedPhases: ['phase-1-beginner'] }
    },
    {
      id: 'phase-3-advanced',
      name: 'Phase 3: Jobs & Messaging',
      description: 'ProConnect has 50M users. Companies want to post jobs, and users want to apply and message recruiters. Build the career platform.',
      difficulty: 'advanced',
      requiredSteps: ['step-7', 'step-8', 'step-9'],
      unlockCriteria: { completedPhases: ['phase-2-intermediate'] }
    },
    {
      id: 'phase-4-expert',
      name: 'Phase 4: Intelligence & Scale',
      description: 'ProConnect is competing with LinkedIn. Time to add AI-powered recommendations, skill assessments, and handle global scale.',
      difficulty: 'expert',
      requiredSteps: ['step-10', 'step-11', 'step-12'],
      unlockCriteria: { completedPhases: ['phase-3-advanced'] }
    }
  ],

  steps: [
    // ============== PHASE 1: PROFESSIONAL PROFILES ==============
    {
      id: 'step-1',
      title: 'Profile Data Model',
      phase: 'phase-1-beginner',
      description: 'Design the data model for professional profiles with work history, education, and skills',
      order: 1,

      educationalContent: {
        title: 'Modeling Professional Identity',
        explanation: `A LinkedIn profile is a structured resume with rich relationships. The data model must capture career history, skills, and credentials.

**Core Profile Model:**
\`\`\`typescript
interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  headline: string;  // "Senior Engineer at Google"
  summary: string;
  profilePhotoUrl: string;
  location: { city: string; country: string };
  visibility: 'public' | 'connections' | 'private';
  openToWork: boolean;
}

interface Experience {
  id: string;
  profileId: string;
  companyId: string;  // Links to Company entity
  title: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  startDate: Date;
  endDate?: Date;  // null = current
  description: string;
}

interface Education {
  id: string;
  profileId: string;
  schoolId: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number;
}

interface Skill {
  id: string;
  profileId: string;
  name: string;
  endorsementCount: number;
}
\`\`\`

**Company & School as Shared Entities:**
\`\`\`typescript
interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  followerCount: number;
}
\`\`\`

**Profile Completeness Score:**
LinkedIn gamifies profile completion to encourage users to fill out their profile fully.`,
        keyInsight: 'Professional profiles link to shared entities (companies, schools) creating a graph of professional relationships beyond just person-to-person connections',
        commonMistakes: [
          'Storing company name as string instead of linking to Company entity',
          'Not handling current positions (null end date)',
          'Missing profile completeness tracking'
        ],
        interviewTips: [
          'Discuss how companies and schools are shared entities',
          'Mention profile completeness as a gamification strategy',
          'Talk about privacy settings per profile section'
        ],
        realWorldExample: 'When you add "Google" as your employer, LinkedIn links to the Google company page. This enables features like "See all employees" and company follower counts.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Profile Service', 'Profile Database', 'Object Storage'],

      hints: [
        { trigger: 'stuck', content: 'Profiles have experiences, education, and skills. Companies and schools are separate shared entities.' },
        { trigger: 'string_company', content: 'Dont store company as a string. Link to a Company entity for shared data.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Profile Service' },
          { from: 'Profile Service', to: 'Profile Database' }
        ],
        requiredComponents: ['Profile Service', 'Profile Database', 'Object Storage']
      },

      thinkingFramework: {
        approach: 'data-modeling',
        questions: [
          'What sections make up a professional profile?',
          'How do we link profiles to companies and schools?',
          'How do we encourage profile completion?'
        ],
        tradeoffs: [
          { option: 'Embedded company data', pros: ['Simple queries'], cons: ['Data duplication'] },
          { option: 'Normalized with Company entity', pros: ['Shared data', 'Company pages'], cons: ['More joins'] }
        ]
      }
    },

    {
      id: 'step-2',
      title: 'Connection System',
      phase: 'phase-1-beginner',
      description: 'Implement the connection request and acceptance flow with degree relationships',
      order: 2,

      educationalContent: {
        title: 'Building a Professional Network Graph',
        explanation: `LinkedIn connections are bidirectional relationships with degree calculations (1st, 2nd, 3rd degree). This is fundamentally a graph problem.

**Connection Model:**
\`\`\`typescript
interface Connection {
  id: string;
  userId1: string;
  userId2: string;
  status: 'pending' | 'accepted' | 'blocked';
  requesterId: string;
  connectedAt?: Date;
}
\`\`\`

**Degree Calculation:**
\`\`\`
1st degree: Direct connections
2nd degree: Connections of your connections
3rd degree: Connections of 2nd degree

A ←→ B ←→ C ←→ D
From A: B is 1st, C is 2nd, D is 3rd degree
\`\`\`

**Scale Challenge:**
User with 500 connections, each has 500 connections:
2nd degree = up to 250,000 users!

Solutions:
- Pre-compute and cache
- Limit to mutual connections count
- Use graph database for efficient traversal`,
        keyInsight: 'Connection degree is a graph traversal problem - 2nd degree connections can number in the hundreds of thousands, requiring pre-computation or limiting queries',
        commonMistakes: [
          'Computing 2nd degree in real-time for all (too slow)',
          'Not handling blocked connections',
          'Missing the connection request notification flow'
        ],
        interviewTips: [
          'Discuss graph storage options (relational vs graph DB)',
          'Explain how 2nd degree explodes combinatorially',
          'Mention pre-computation strategies'
        ],
        realWorldExample: 'LinkedIn shows "500+ connections" because computing exact 2nd/3rd degree counts for users with many connections is expensive.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Connection Service', 'Graph Database', 'Notification Service'],

      hints: [
        { trigger: 'stuck', content: 'Connections form a graph. 1st degree is direct, 2nd degree is connections-of-connections.' },
        { trigger: 'realtime_2nd', content: '2nd degree can be 250K+ users. Pre-compute or use mutual connection counts instead.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Connection Service' },
          { from: 'Connection Service', to: 'Graph Database' }
        ],
        requiredComponents: ['Connection Service', 'Graph Database', 'Notification Service']
      },

      thinkingFramework: {
        approach: 'graph-modeling',
        questions: [
          'How do we store bidirectional connections?',
          'How do we compute connection degree efficiently?',
          'When should we use a graph database?'
        ],
        tradeoffs: [
          { option: 'Relational storage', pros: ['Familiar', 'Transactional'], cons: ['Complex graph queries'] },
          { option: 'Graph database', pros: ['Natural for connections', 'Fast traversal'], cons: ['Another system'] }
        ]
      }
    },

    {
      id: 'step-3',
      title: 'Profile Search',
      phase: 'phase-1-beginner',
      description: 'Implement search for finding professionals by name, company, title, and skills',
      order: 3,

      educationalContent: {
        title: 'People Search Engine',
        explanation: `LinkedIn search must find people by name, current/past companies, job titles, skills, and location - all with relevance ranking.

**Search Index Structure:**
\`\`\`typescript
interface ProfileSearchDoc {
  id: string;
  name: string;
  headline: string;
  currentTitle: string;
  currentCompany: string;
  allTitles: string[];
  allCompanies: string[];
  skills: string[];
  location: { city: string; country: string };
  connectionCount: number;
}
\`\`\`

**Connection-Aware Search:**
Results are re-ranked based on connection proximity:
- 1st connections matching: shown first
- 2nd connections with mutual connections: next
- 3rd+ connections: lower ranked

This requires combining search results with graph data!`,
        keyInsight: 'LinkedIn search combines text search (Elasticsearch) with graph proximity (connection degree) - results are re-ranked based on how close you are to each person in the network',
        commonMistakes: [
          'Not including connection proximity in ranking',
          'Only searching current position (missing past experience)',
          'Slow typeahead (must be <100ms)'
        ],
        interviewTips: [
          'Explain combining text search with graph data',
          'Discuss connection proximity boosting',
          'Mention the different entity types in autocomplete'
        ],
        realWorldExample: 'When you search for a name on LinkedIn, your connections appear first even if others have more complete profiles.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Search Service', 'Elasticsearch', 'Connection Service'],

      hints: [
        { trigger: 'stuck', content: 'Search combines text relevance with connection proximity - 1st degree connections rank higher' },
        { trigger: 'text_only', content: 'Text search alone isnt enough. Boost results based on connection degree.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Search Service' },
          { from: 'Search Service', to: 'Elasticsearch' }
        ],
        requiredComponents: ['Search Service', 'Elasticsearch']
      },

      thinkingFramework: {
        approach: 'search-ranking',
        questions: [
          'What fields should be searchable?',
          'How does connection proximity affect ranking?',
          'What entity types appear in autocomplete?'
        ],
        tradeoffs: [
          { option: 'Pure text relevance', pros: ['Simple', 'Predictable'], cons: ['Ignores network'] },
          { option: 'Network-weighted ranking', pros: ['Relevant to user'], cons: ['Complex'] }
        ]
      }
    },

    // ============== PHASE 2: NETWORK & FEED ==============
    {
      id: 'step-4',
      title: 'Activity Feed',
      phase: 'phase-2-intermediate',
      description: 'Build the home feed showing updates from connections and followed companies',
      order: 4,

      educationalContent: {
        title: 'Professional Content Feed',
        explanation: `The LinkedIn feed shows posts from connections, followed companies, and trending content.

**Feed Content Types:**
- Posts and articles from connections
- Shares and reposts
- Job changes and work anniversaries
- Company updates from followed companies

**Hybrid Feed Architecture:**
- Regular users: Push to connections' feeds (fast reads)
- Influencers (>10K followers): Pull on read (avoids fan-out explosion)

**Feed Ranking:**
Score = engagement_prediction × recency × relationship_strength`,
        keyInsight: 'Feed generation uses a hybrid push/pull model - push for regular users (fast reads), pull for influencers (avoids fan-out explosion)',
        commonMistakes: [
          'Pure pull model (slow for users with many connections)',
          'Pure push model (explodes for influencers)',
          'Chronological feed (overwhelming for active networks)'
        ],
        interviewTips: [
          'Explain the hybrid push/pull approach',
          'Discuss the celebrity/influencer problem',
          'Mention feed ranking vs chronological trade-offs'
        ],
        realWorldExample: 'LinkedIn shows "Top" posts by default (ranked) but offers "Recent" for chronological.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Feed Service', 'Post Service', 'Feed Cache', 'Ranking Service'],

      hints: [
        { trigger: 'stuck', content: 'Use hybrid model: push for regular users, pull for influencers (>10K followers)' },
        { trigger: 'pull_only', content: 'Pull is slow for users with many connections. Pre-compute feeds.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Feed Service' },
          { from: 'Feed Service', to: 'Feed Cache' }
        ],
        requiredComponents: ['Feed Service', 'Post Service', 'Feed Cache', 'Ranking Service']
      },

      thinkingFramework: {
        approach: 'feed-architecture',
        questions: [
          'How do we generate feeds efficiently?',
          'How do we handle users with millions of followers?',
          'Should feeds be ranked or chronological?'
        ],
        tradeoffs: [
          { option: 'Chronological feed', pros: ['Simple', 'No FOMO'], cons: ['Overwhelming'] },
          { option: 'Ranked feed', pros: ['Better content'], cons: ['Complex', 'Filter bubble'] }
        ]
      }
    },

    {
      id: 'step-5',
      title: 'Engagement System',
      phase: 'phase-2-intermediate',
      description: 'Implement likes, comments, and shares with notification delivery',
      order: 5,

      educationalContent: {
        title: 'Professional Engagement',
        explanation: `LinkedIn engagement includes reactions (like, celebrate, support), comments, and shares.

**Notification Aggregation:**
- <10 likes: notify for each
- 10-100 likes: batch ("10 people liked your post")
- >100 likes: aggregate ("Your post is trending")

High-engagement posts can get thousands of likes - notifications must aggregate to avoid overwhelming users.`,
        keyInsight: 'High-engagement posts can get thousands of likes - notifications must aggregate to avoid overwhelming users while still providing feedback',
        commonMistakes: [
          'Sending notification per like (overwhelming)',
          'Not supporting threaded comments',
          'Missing @ mention notifications'
        ],
        interviewTips: [
          'Discuss notification aggregation strategies',
          'Explain the reaction type options',
          'Mention threading for comments'
        ],
        realWorldExample: 'LinkedIn batches like notifications: "John, Sarah, and 48 others liked your post".'
      },

      requiredComponents: ['Client', 'API Gateway', 'Engagement Service', 'Notification Service', 'Post Database', 'Notification Queue'],

      hints: [
        { trigger: 'stuck', content: 'Aggregate notifications for likes - dont send one per like' },
        { trigger: 'per_like', content: 'Viral posts get thousands of likes. Aggregate into batched notifications.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Engagement Service' },
          { from: 'Engagement Service', to: 'Notification Queue' }
        ],
        requiredComponents: ['Engagement Service', 'Notification Service', 'Notification Queue']
      },

      thinkingFramework: {
        approach: 'notification-design',
        questions: [
          'How do we handle viral posts with thousands of likes?',
          'When should we aggregate vs individual notify?',
          'How do comment replies notify the right people?'
        ],
        tradeoffs: [
          { option: 'Per-action notifications', pros: ['Detailed'], cons: ['Overwhelming'] },
          { option: 'Aggregated notifications', pros: ['Manageable'], cons: ['Less immediate'] }
        ]
      }
    },

    {
      id: 'step-6',
      title: 'Company Pages',
      phase: 'phase-2-intermediate',
      description: 'Build company pages with followers, updates, and employee listings',
      order: 6,

      educationalContent: {
        title: 'Company Presence Platform',
        explanation: `Company pages aggregate employee data from profiles - employee count, skills distribution are computed from profiles listing the company.

**Company Page Model:**
\`\`\`typescript
interface CompanyPage {
  id: string;
  name: string;
  logo: string;
  description: string;
  industry: string;
  companySize: string;
  followerCount: number;
  employeeCount: number;  // Computed from profiles
  adminUserIds: string[];
}
\`\`\`

**Follow vs Connect:**
- Connections: Person ←→ Person (bidirectional)
- Follows: Person → Company (unidirectional)`,
        keyInsight: 'Company pages aggregate data from employee profiles - employee count and skills distribution are all computed from profiles listing the company',
        commonMistakes: [
          'Storing employee list on company (should query profiles)',
          'Not differentiating follow from connect',
          'Missing admin permissions for company posts'
        ],
        interviewTips: [
          'Explain how employee data is aggregated from profiles',
          'Discuss follow (unidirectional) vs connect (bidirectional)',
          'Mention verified company badges'
        ],
        realWorldExample: 'LinkedIn company pages show "12,345 employees on LinkedIn" - computed by counting profiles with current experience at that company.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Company Service', 'Company Database', 'Profile Service', 'Follow Service'],

      hints: [
        { trigger: 'stuck', content: 'Company pages aggregate employee data from profiles. Following is unidirectional.' },
        { trigger: 'store_employees', content: 'Dont store employee list on company. Query profiles where current company matches.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Company Service' },
          { from: 'Company Service', to: 'Profile Service' }
        ],
        requiredComponents: ['Company Service', 'Company Database', 'Follow Service']
      },

      thinkingFramework: {
        approach: 'entity-relationships',
        questions: [
          'How do company pages relate to user profiles?',
          'How do we compute employee statistics?',
          'Whats the difference between follow and connect?'
        ],
        tradeoffs: [
          { option: 'Store employee list on company', pros: ['Fast reads'], cons: ['Stale data'] },
          { option: 'Compute from profiles', pros: ['Always accurate'], cons: ['Slower queries'] }
        ]
      }
    },

    // ============== PHASE 3: JOBS & MESSAGING ==============
    {
      id: 'step-7',
      title: 'Job Listings',
      phase: 'phase-3-advanced',
      description: 'Build job posting, search, and application tracking system',
      order: 7,

      educationalContent: {
        title: 'Job Marketplace',
        explanation: `LinkedIn Jobs connects job seekers with opportunities with two key flows:

**Easy Apply Flow:**
Pre-fill application with profile data - dramatically increases completion rates.

**Applicant Tracking (ATS):**
Recruiter view to manage applications:
- Filter by status (new, reviewed, interviewing)
- Sort by "fit score" (ML-based)
- Move candidates through pipeline stages`,
        keyInsight: 'Easy Apply removes friction by pre-filling from profiles, dramatically increasing application rates. The ATS view helps recruiters manage high application volumes.',
        commonMistakes: [
          'Requiring resume upload when profile has all data',
          'No way for recruiters to filter/sort applicants',
          'Missing application status tracking'
        ],
        interviewTips: [
          'Explain Easy Apply as a friction reducer',
          'Discuss the recruiter ATS workflow',
          'Mention job matching/recommendation as next step'
        ],
        realWorldExample: 'LinkedIn Easy Apply increased application rates 4x by pre-filling from profiles.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Job Service', 'Job Database', 'Application Service', 'Search Service'],

      hints: [
        { trigger: 'stuck', content: 'Jobs have two flows: applicant applies (Easy Apply), recruiter manages (ATS view)' },
        { trigger: 'manual_entry', content: 'Easy Apply pre-fills from profile. Dont make users re-enter their experience.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Job Service' },
          { from: 'Job Service', to: 'Job Database' }
        ],
        requiredComponents: ['Job Service', 'Job Database', 'Application Service']
      },

      thinkingFramework: {
        approach: 'two-sided-marketplace',
        questions: [
          'How do we reduce friction for applicants?',
          'How do recruiters manage high application volume?',
          'What makes a good job search experience?'
        ],
        tradeoffs: [
          { option: 'Detailed application', pros: ['Better information'], cons: ['Lower completion'] },
          { option: 'Easy Apply', pros: ['High completion'], cons: ['More unqualified applicants'] }
        ]
      }
    },

    {
      id: 'step-8',
      title: 'Messaging & InMail',
      phase: 'phase-3-advanced',
      description: 'Build messaging between connections and premium InMail for non-connections',
      order: 8,

      educationalContent: {
        title: 'Professional Messaging',
        explanation: `Two-tier messaging system:

**Free Messaging:** To 1st degree connections
**InMail (Premium):** To non-connections using credits

**InMail Credit System:**
- Premium subscribers get X credits/month
- If recipient doesn't respond in 90 days → credit refunded
- Incentivizes quality outreach over spam`,
        keyInsight: 'InMail credits create a natural spam barrier - cold outreach costs credits, and they are refunded if no response, incentivizing quality over quantity',
        commonMistakes: [
          'No distinction between connection and non-connection messaging',
          'Missing InMail credit refund logic',
          'No spam prevention for mass outreach'
        ],
        interviewTips: [
          'Explain the two-tier messaging model',
          'Discuss InMail credit economics (refund on no-response)',
          'Mention spam prevention strategies'
        ],
        realWorldExample: 'LinkedIn InMail has a 10-25% response rate because credits are refunded for no response - incentivizes targeted messages.'
      },

      requiredComponents: ['Client', 'API Gateway', 'Messaging Service', 'Message Database', 'WebSocket Gateway', 'Credits Service'],

      hints: [
        { trigger: 'stuck', content: 'Two tiers: free for connections, InMail credits for non-connections.' },
        { trigger: 'free_all', content: 'Free messaging to everyone invites spam. InMail credits are a natural barrier.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Client', to: 'API Gateway' },
          { from: 'API Gateway', to: 'Messaging Service' },
          { from: 'Client', to: 'WebSocket Gateway' }
        ],
        requiredComponents: ['Messaging Service', 'Message Database', 'WebSocket Gateway', 'Credits Service']
      },

      thinkingFramework: {
        approach: 'monetization-design',
        questions: [
          'How do we enable outreach while preventing spam?',
          'What incentivizes quality over quantity?',
          'How does the credit system work?'
        ],
        tradeoffs: [
          { option: 'Free for all', pros: ['Easy networking'], cons: ['Spam'] },
          { option: 'Credit-based InMail', pros: ['Quality messages'], cons: ['Friction'] }
        ]
      }
    },

    {
      id: 'step-9',
      title: 'Recruiter Tools',
      phase: 'phase-3-advanced',
      description: 'Build advanced search and outreach tools for recruiters',
      order: 9,

      educationalContent: {
        title: 'LinkedIn Recruiter Platform',
        explanation: `Recruiter is LinkedIn's premium B2B product with:

**Boolean Search:**
"software engineer" AND (Google OR Facebook) AND Python AND NOT junior

**Projects & Pipelines:**
Saved candidate lists with stages (Sourced → Contacted → Responded → Interviewing)

**Team Collaboration:**
- Shared candidate pools
- "Already contacted by teammate" indicator
- Prevent duplicate outreach`,
        keyInsight: 'Recruiter tools add team collaboration and pipeline management - the "already contacted" indicator prevents embarrassing duplicate outreach',
        commonMistakes: [
          'No boolean/advanced search operators',
          'Missing team coordination (duplicate outreach)',
          'No pipeline tracking for candidates'
        ],
        interviewTips: [
          'Explain boolean search capabilities',
          'Discuss team collaboration features',
          'Mention ML signals like "likely to respond"'
        ],
        realWorldExample: 'LinkedIn Recruiter shows "InMailed by teammate 2 days ago" to prevent duplicate outreach.'
      },

      requiredComponents: ['API Gateway', 'Recruiter Service', 'Advanced Search', 'Project Database', 'Team Service', 'ML Scoring Service'],

      hints: [
        { trigger: 'stuck', content: 'Recruiter needs: boolean search, saved projects, team collaboration' },
        { trigger: 'basic_search', content: 'Recruiters need boolean operators (AND, OR, NOT) and structured filters.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'API Gateway', to: 'Recruiter Service' },
          { from: 'Recruiter Service', to: 'Advanced Search' },
          { from: 'Recruiter Service', to: 'Team Service' }
        ],
        requiredComponents: ['Recruiter Service', 'Advanced Search', 'Project Database', 'Team Service']
      },

      thinkingFramework: {
        approach: 'b2b-product',
        questions: [
          'What search capabilities do recruiters need?',
          'How do recruiting teams collaborate?',
          'What signals help identify good candidates?'
        ],
        tradeoffs: [
          { option: 'Simple search only', pros: ['Easy to use'], cons: ['Cant find specific candidates'] },
          { option: 'Boolean + filters', pros: ['Precise targeting'], cons: ['Learning curve'] }
        ]
      }
    },

    // ============== PHASE 4: INTELLIGENCE & SCALE ==============
    {
      id: 'step-10',
      title: 'Job Recommendations',
      phase: 'phase-4-expert',
      description: 'Build ML-powered job matching based on profile, activity, and preferences',
      order: 10,

      educationalContent: {
        title: 'AI-Powered Job Matching',
        explanation: `Job recommendations use multiple signals:

**Profile-Based:** Skills, experience, education
**Behavioral:** Jobs viewed, applied, saved, search queries
**Stated Preferences:** Open to work settings, desired titles, locations

**Two-Sided Matching:**
- Jobs for Candidates: "Jobs you might be interested in"
- Candidates for Jobs: "Recommended candidates for this role"`,
        keyInsight: 'Job matching is two-sided - recommend jobs to candidates AND candidates to recruiters. Both use the same matching signals but different ranking objectives.',
        commonMistakes: [
          'Only title matching (ignores skills and behavior)',
          'Not using behavioral signals (what they actually click)',
          'Missing the recruiter-side recommendations'
        ],
        interviewTips: [
          'Explain the multi-signal matching approach',
          'Discuss two-sided recommendations',
          'Mention cold start handling for new users'
        ],
        realWorldExample: 'LinkedIn learns your intent from behavior - if you keep viewing ML engineer jobs, it recommends those even if your title says "Data Analyst".'
      },

      requiredComponents: ['Recommendation Service', 'ML Model Service', 'Feature Store', 'Profile Service', 'Behavior Tracking', 'Job Service'],

      hints: [
        { trigger: 'stuck', content: 'Job matching uses profile data, behavioral signals, and stated preferences.' },
        { trigger: 'title_only', content: 'Title alone is insufficient. Use skills, behavior, and stated preferences.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Recommendation Service', to: 'ML Model Service' },
          { from: 'Recommendation Service', to: 'Feature Store' },
          { from: 'Recommendation Service', to: 'Behavior Tracking' }
        ],
        requiredComponents: ['Recommendation Service', 'ML Model Service', 'Feature Store', 'Behavior Tracking']
      },

      thinkingFramework: {
        approach: 'ml-matching',
        questions: [
          'What signals indicate job-candidate fit?',
          'How do we handle new users with no history?',
          'How do recruiter and candidate recommendations differ?'
        ],
        tradeoffs: [
          { option: 'Rule-based matching', pros: ['Explainable'], cons: ['Misses nuance'] },
          { option: 'ML-based matching', pros: ['Learns patterns'], cons: ['Black box'] }
        ]
      }
    },

    {
      id: 'step-11',
      title: 'Connection Recommendations',
      phase: 'phase-4-expert',
      description: 'Implement "People You May Know" using graph analysis and ML',
      order: 11,

      educationalContent: {
        title: 'People You May Know (PYMK)',
        explanation: `PYMK uses multiple signals:

**Graph-Based:**
- Mutual connections (strongest signal)
- Same company/school
- Triangle closing (if A-B and A-C, likely B-C)

**Similarity-Based:**
- Industry match, title similarity
- Skill overlap, location proximity

**Adamic-Adar Weighting:**
Weight mutual connections by their uniqueness - a shared connection with 100 connections is more meaningful than one with 10,000.`,
        keyInsight: 'PYMK combines graph analysis (mutual connections, triangle closing) with ML prediction of acceptance probability',
        commonMistakes: [
          'Only using mutual connections (misses other signals)',
          'Recommending already-connected or declined people',
          'Not weighting mutual connections by their uniqueness'
        ],
        interviewTips: [
          'Explain the graph signals (triadic closure)',
          'Discuss Adamic-Adar weighting for mutual connections',
          'Mention the ML acceptance prediction model'
        ],
        realWorldExample: 'LinkedIn weights mutual connections by uniqueness - a shared connection with 100 connections is more meaningful than one with 10,000.'
      },

      requiredComponents: ['Recommendation Service', 'Graph Service', 'ML Model Service', 'Feature Store', 'Connection Service'],

      hints: [
        { trigger: 'stuck', content: 'PYMK uses graph signals (mutual connections) plus ML to predict acceptance probability' },
        { trigger: 'mutual_only', content: 'Mutual connections are important but add company, school, industry signals too.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'Recommendation Service', to: 'Graph Service' },
          { from: 'Recommendation Service', to: 'ML Model Service' },
          { from: 'Graph Service', to: 'Connection Service' }
        ],
        requiredComponents: ['Graph Service', 'ML Model Service', 'Feature Store']
      },

      thinkingFramework: {
        approach: 'graph-ml',
        questions: [
          'What graph patterns indicate likely connections?',
          'How do we weight different mutual connections?',
          'What negative signals should filter out suggestions?'
        ],
        tradeoffs: [
          { option: 'Graph-only', pros: ['Interpretable'], cons: ['Misses behavioral signals'] },
          { option: 'ML with graph features', pros: ['Better predictions'], cons: ['Less interpretable'] }
        ]
      }
    },

    {
      id: 'step-12',
      title: 'Global Scale Architecture',
      phase: 'phase-4-expert',
      description: 'Design the architecture to handle 800M+ members globally',
      order: 12,

      educationalContent: {
        title: 'Scaling to 800M Members',
        explanation: `LinkedIn scale numbers:
- Members: 800M+
- Connections: 20B+ edges
- Feed impressions: 100B+/day

**Key Strategies:**

**Data Partitioning:**
- Partition by member ID for member-centric data
- Partition by company for company-centric data
- Graph needs specialized sharding

**Caching:**
- Pre-compute feeds for active members
- Cache connection lists
- Multi-layer caching (L1 local, L2 distributed)

**Multi-Region:**
- Write to primary region, read from nearest
- Eventual consistency acceptable for reads`,
        keyInsight: 'LinkedIn scale requires aggressive caching (pre-computed feeds), smart partitioning, and multi-region deployment with eventual consistency for reads',
        commonMistakes: [
          'Trying to compute feeds in real-time at this scale',
          'Single-region deployment (latency for global users)',
          'Not partitioning data by access pattern'
        ],
        interviewTips: [
          'Discuss partitioning strategies for different data types',
          'Explain feed pre-computation necessity at scale',
          'Mention eventual consistency trade-offs for global reads'
        ],
        realWorldExample: 'LinkedIn pre-computes feeds for active members and incrementally updates them when new posts are created.'
      },

      requiredComponents: ['API Gateway', 'Load Balancer', 'App Servers', 'Cache Cluster', 'Database Cluster', 'Search Cluster', 'Message Queue', 'CDN'],

      hints: [
        { trigger: 'stuck', content: 'Scale requires: sharding, pre-computed feeds, multi-region with eventual consistency' },
        { trigger: 'realtime_feed', content: 'Cant compute feeds real-time for 800M members. Pre-compute and update incrementally.' }
      ],

      validation: {
        requiredConnections: [
          { from: 'API Gateway', to: 'Load Balancer' },
          { from: 'Load Balancer', to: 'App Servers' },
          { from: 'App Servers', to: 'Cache Cluster' },
          { from: 'App Servers', to: 'Database Cluster' }
        ],
        requiredComponents: ['Cache Cluster', 'Database Cluster', 'Search Cluster', 'Message Queue', 'CDN']
      },

      thinkingFramework: {
        approach: 'scale-architecture',
        questions: [
          'How do we partition 800M members worth of data?',
          'How do we serve feeds at this scale?',
          'How do we handle global latency requirements?'
        ],
        tradeoffs: [
          { option: 'Strong consistency everywhere', pros: ['Simple model'], cons: ['High latency'] },
          { option: 'Eventual consistency for reads', pros: ['Low latency'], cons: ['Stale data possible'] }
        ]
      }
    }
  ],

  sandboxConfig: {
    availableComponents: [
      { type: 'Client', category: 'client' },
      { type: 'Mobile App', category: 'client' },
      { type: 'API Gateway', category: 'gateway' },
      { type: 'Load Balancer', category: 'gateway' },
      { type: 'CDN', category: 'gateway' },
      { type: 'WebSocket Gateway', category: 'gateway' },
      { type: 'Profile Service', category: 'service' },
      { type: 'Connection Service', category: 'service' },
      { type: 'Search Service', category: 'service' },
      { type: 'Feed Service', category: 'service' },
      { type: 'Post Service', category: 'service' },
      { type: 'Ranking Service', category: 'service' },
      { type: 'Engagement Service', category: 'service' },
      { type: 'Company Service', category: 'service' },
      { type: 'Follow Service', category: 'service' },
      { type: 'Job Service', category: 'service' },
      { type: 'Application Service', category: 'service' },
      { type: 'Messaging Service', category: 'service' },
      { type: 'Credits Service', category: 'service' },
      { type: 'Notification Service', category: 'service' },
      { type: 'Recruiter Service', category: 'service' },
      { type: 'Advanced Search', category: 'service' },
      { type: 'Team Service', category: 'service' },
      { type: 'Recommendation Service', category: 'service' },
      { type: 'Graph Service', category: 'service' },
      { type: 'ML Model Service', category: 'service' },
      { type: 'ML Scoring Service', category: 'service' },
      { type: 'Behavior Tracking', category: 'service' },
      { type: 'App Servers', category: 'service' },
      { type: 'Profile Database', category: 'database' },
      { type: 'Graph Database', category: 'database' },
      { type: 'Company Database', category: 'database' },
      { type: 'Job Database', category: 'database' },
      { type: 'Post Database', category: 'database' },
      { type: 'Message Database', category: 'database' },
      { type: 'Project Database', category: 'database' },
      { type: 'Database Cluster', category: 'database' },
      { type: 'Object Storage', category: 'storage' },
      { type: 'Feature Store', category: 'storage' },
      { type: 'Feed Cache', category: 'storage' },
      { type: 'Cache Cluster', category: 'storage' },
      { type: 'Elasticsearch', category: 'search' },
      { type: 'Search Cluster', category: 'search' },
      { type: 'Notification Queue', category: 'messaging' },
      { type: 'Message Queue', category: 'messaging' }
    ]
  },

  learningObjectives: [
    'Design professional profile data models with shared entities',
    'Build connection systems with graph-based degree calculations',
    'Implement people search combining text relevance with network proximity',
    'Build activity feeds using hybrid push/pull architecture',
    'Design engagement systems with notification aggregation',
    'Create company pages that aggregate from employee profiles',
    'Build job marketplace with Easy Apply and ATS features',
    'Implement tiered messaging (free + InMail credits)',
    'Design recruiter tools with boolean search and team collaboration',
    'Build ML-powered job recommendations',
    'Implement PYMK using graph analysis and ML',
    'Scale to 800M+ members with sharding and caching'
  ],

  prerequisites: [
    'Understanding of graph data structures',
    'Familiarity with search engines (Elasticsearch)',
    'Basic knowledge of recommendation systems',
    'Understanding of distributed systems concepts'
  ],

  interviewRelevance: {
    commonQuestions: [
      'Design LinkedIn',
      'Design a professional networking platform',
      'How would you implement People You May Know?',
      'Design a job matching system',
      'How would you build a news feed for professionals?'
    ],
    keyTakeaways: [
      'Profiles link to shared entities creating a rich graph',
      'Connection degree requires pre-computation at scale',
      'Feeds use hybrid push/pull model',
      'InMail credits naturally limit spam',
      'PYMK combines graph signals with ML prediction',
      'Global scale requires aggressive caching and eventual consistency'
    ],
    frequentMistakes: [
      'Computing 2nd degree connections in real-time',
      'Pure push feed model (fails for influencers)',
      'No distinction between connection and follow',
      'Free messaging to everyone (spam problem)'
    ]
  }
};
