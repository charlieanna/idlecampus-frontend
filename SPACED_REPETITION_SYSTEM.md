# Spaced Repetition System (SRS) for Concept Mastery

A comprehensive spaced repetition learning system with **scenario-based questions** instead of traditional multiple-choice quizzes. This system ensures users truly understand concepts through critical thinking, not memorization.

## 🎯 Key Features

### 1. **Performance-Based Spaced Repetition**
- **SM-2 Algorithm**: Intelligently schedules reviews based on how well you answer
- **Adaptive Difficulty**: Questions adjust to your mastery level
- **Forgetting Curve Optimization**: Reviews concepts just before you'd forget them

### 2. **Scenario-Based Questions (Not MCQs!)**
- **Real-World Scenarios**: "You're building X with Y requirements..."
- **Critical Thinking Required**: Must explain reasoning and trade-offs
- **Free-Form Answers**: Write explanations in your own words
- **Variety**: Different scenarios for same concept to prevent memorization

### 3. **Intelligent Evaluation**
- **Key Concept Detection**: Checks if you mentioned required concepts
- **Trade-off Analysis**: Validates discussion of pros/cons
- **Anti-pattern Detection**: Flags incorrect approaches
- **Depth Scoring**: Rewards detailed reasoning

### 4. **Progress Tracking**
- **Mastery Levels**: Not Started → Learning → Familiar → Proficient → Mastered
- **Ease Factor**: Tracks how difficult each concept is for YOU personally
- **Success Rates**: Per-concept performance metrics
- **Review Streaks**: Gamification to maintain consistency

## 📁 Architecture

```
src/
├── types/spacedRepetition.ts          # Core data models (SM-2 state, concepts, questions)
├── services/
│   ├── spacedRepetitionService.ts     # SM-2 algorithm, review scheduling
│   └── scenarioEvaluator.ts           # Answer evaluation engine
├── data/srs/
│   ├── concepts.ts                    # System design concepts catalog
│   └── scenarioQuestions.ts           # Scenario-based questions
└── components/srs/
    ├── ScenarioQuestionPractice.tsx   # Question practice UI
    └── ReviewDashboard.tsx            # Progress dashboard
```

## 🚀 Quick Start

### 1. Add Concepts

Define learning concepts in `src/data/srs/concepts.ts`:

```typescript
{
  id: 'redis-vs-kafka',
  title: 'Redis vs Kafka for Queuing',
  category: 'messaging',
  description: 'When to use in-memory vs disk-based queues',
  prerequisites: ['redis-fundamentals', 'kafka-fundamentals'],
  difficultyLevel: 'intermediate',
  estimatedTimeMinutes: 15,
  tags: ['redis', 'kafka', 'trade-offs'],
}
```

### 2. Create Scenario Questions

Add questions in `src/data/srs/scenarioQuestions.ts`:

```typescript
{
  id: 'redis-kafka-q1',
  conceptId: 'redis-vs-kafka',
  scenario: {
    context: 'You are building a real-time notification system...',
    requirements: [
      'Notifications within 100ms',
      '10,000 notifications/sec',
      'Data loss acceptable',
    ],
    metrics: {
      'Latency Requirement': '<100ms',
      'Data Durability': 'Not critical',
    },
  },
  question: 'Would you use Redis or Kafka? Explain your reasoning.',
  questionType: 'component_choice',
  expectedAnswer: {
    keyPoints: [
      {
        concept: 'Redis is in-memory',
        keywords: ['redis', 'in-memory', 'faster', 'low latency'],
        weight: 1.0,
        mustMention: true,
      },
      {
        concept: 'Kafka is disk-based',
        keywords: ['kafka', 'disk', 'persistent', 'slower'],
        weight: 1.0,
        mustMention: true,
      },
    ],
    tradeoffs: [
      {
        aspect: 'Latency vs Durability',
        options: [
          { name: 'Redis', pros: ['Fast'], cons: ['Data loss'] },
          { name: 'Kafka', pros: ['Durable'], cons: ['Slower'] },
        ],
      },
    ],
    antipatterns: ['use kafka for temporary data'],
  },
  explanation: `Redis is better here because...`,
  difficulty: 'medium',
}
```

### 3. Use in Your App

```tsx
import { ReviewDashboard } from './components/srs/ReviewDashboard';
import { ScenarioQuestionPractice } from './components/srs/ScenarioQuestionPractice';

function App() {
  const userId = 'user123';

  return (
    <div>
      {/* Show dashboard */}
      <ReviewDashboard userId={userId} />

      {/* Practice questions */}
      <ScenarioQuestionPractice
        question={currentQuestion}
        userId={userId}
        onComplete={(response) => console.log('Score:', response.evaluation.score)}
      />
    </div>
  );
}
```

## 📊 How It Works

### SM-2 Algorithm Flow

```
1. User answers scenario question
2. System evaluates answer (0-100 score)
3. Convert score + confidence → quality (0-5)
4. Update ease factor based on quality
5. Calculate next review interval:
   - Quality < 3: Reset to 1 day
   - Repetition 1: 1 day
   - Repetition 2: 6 days
   - Repetition 3+: interval × easeFactor
```

### Evaluation Flow

```
1. Normalize answer text (lowercase, remove punctuation)
2. Check for required key points
3. Check for trade-off discussions
4. Detect anti-patterns
5. Calculate scores:
   - Key points: 60% of score
   - Trade-offs: 20% of score
   - Depth: 20% of score
6. Apply penalties (hints used, anti-patterns)
7. Generate feedback
```

## 🎓 Example Concepts Included

### Caching
- ✅ Cache Fundamentals
- ✅ Cache Writing Strategies (write-through, write-back, write-around)
- ✅ Cache Eviction Policies (LRU, LFU)

### Storage
- ✅ Redis In-Memory Store
- ✅ Memcached Basics
- ✅ Redis vs Memcached

### Messaging
- ✅ Message Queue Fundamentals
- ✅ Kafka Basics
- ✅ RabbitMQ Basics
- ✅ **Redis vs Kafka** (in-memory vs disk-based queues)

### Distributed Systems
- ✅ CAP Theorem
- ✅ Consistency Models

### Performance
- ✅ Latency vs Throughput
- ✅ Horizontal vs Vertical Scaling

## 📝 Example Scenario Questions

### Question 1: Redis vs Kafka for Notifications
**Scenario**: Real-time notifications, 100ms latency, 10K/sec, data loss OK

**Expected Learning**:
- Redis is in-memory → faster
- Kafka is disk-based → durable
- Trade-off: speed vs durability
- Choose Redis for ephemeral, low-latency workloads

### Question 2: Redis vs Kafka for Order Processing
**Scenario**: E-commerce orders, must survive crashes, replay last 7 days

**Expected Learning**:
- Kafka provides durability
- Kafka supports replay via offsets
- Redis loses data on crash
- Choose Kafka for critical business events

### Question 3: Write-Through vs Write-Back Caching
**Scenario**: Product catalog, read-heavy (1000:1), stale data OK for 5 seconds

**Expected Learning**:
- Write-through updates cache immediately
- Read-heavy workloads benefit from write-through
- Trade-off: write latency vs cache freshness

## 🔧 Customization

### Add New Concepts

```typescript
// src/data/srs/concepts.ts
export const systemDesignConcepts: Concept[] = [
  {
    id: 'your-concept',
    title: 'Your Concept Title',
    category: 'performance',
    description: 'What it teaches',
    difficultyLevel: 'intermediate',
    estimatedTimeMinutes: 15,
    tags: ['tag1', 'tag2'],
  },
];
```

### Add New Questions

```typescript
// src/data/srs/scenarioQuestions.ts
export const scenarioQuestions: ScenarioQuestion[] = [
  {
    id: 'your-question',
    conceptId: 'your-concept',
    scenario: {
      context: 'Business/technical context',
      requirements: ['Req 1', 'Req 2'],
      constraints: ['Constraint 1'],
      metrics: { 'Metric': 'Value' },
    },
    question: 'What would you do and why?',
    questionType: 'architecture_decision',
    expectedAnswer: {
      keyPoints: [
        {
          concept: 'Key concept name',
          keywords: ['keyword1', 'keyword2'],
          weight: 1.0,
          mustMention: true,
        },
      ],
    },
    explanation: 'Detailed explanation...',
    difficulty: 'medium',
  },
];
```

### Customize Evaluation Logic

Edit `src/services/scenarioEvaluator.ts`:

```typescript
// Adjust scoring weights
score += (requiredFound / requiredTotal) * 60;  // Key points: 60%
score += (tradeoffsDiscussed.length / totalTradeoffs) * 20;  // Tradeoffs: 20%
score += depth * 0.2;  // Depth: 20%

// Adjust penalties
score -= antipatternsMentioned.length * 10;  // -10 per anti-pattern
score -= hintsUsed * 5;  // -5 per hint
```

### Customize SM-2 Parameters

Edit `src/types/spacedRepetition.ts`:

```typescript
export function calculateNextReview(/* ... */) {
  const MIN_EASE_FACTOR = 1.3;  // Minimum ease factor

  // Adjust intervals
  if (newRepetitions === 1) newInterval = 1;     // First: 1 day
  else if (newRepetitions === 2) newInterval = 6; // Second: 6 days
  else newInterval = Math.round(currentInterval * newEaseFactor);
}
```

## 📈 Analytics & Insights

### User Statistics

```typescript
const stats = getUserStatistics(userId);
// {
//   totalConceptsReviewed: 15,
//   totalReviews: 47,
//   averageScore: 82,
//   masteryBreakdown: {
//     not_started: 5,
//     learning: 3,
//     familiar: 4,
//     proficient: 2,
//     mastered: 1,
//   },
//   streakDays: 7,
//   nextReviewDate: Date,
// }
```

### Concept-Level Metrics

```typescript
const state = getConceptState(userId, 'redis-vs-kafka');
// {
//   easeFactor: 2.3,           // How "easy" this concept is for user
//   interval: 12,              // Days until next review
//   repetitions: 4,            // Consecutive correct reviews
//   totalReviews: 6,
//   totalCorrect: 5,
//   totalIncorrect: 1,
//   averageConfidence: 4.2,    // User's self-reported confidence
//   masteryLevel: 'familiar',
// }
```

## 🎯 Best Practices

### Writing Good Scenario Questions

✅ **DO:**
- Use real-world business contexts
- Provide specific requirements and constraints
- Include metrics (traffic, latency, budget)
- Ask "why" not just "what"
- Require trade-off discussions

❌ **DON'T:**
- Ask for memorized definitions
- Have only one "correct" answer
- Use abstract theoretical scenarios
- Make it too easy to guess

### Example - Good vs Bad

**❌ Bad (MCQ style):**
```
Q: What is Redis?
A) In-memory database
B) Disk-based database
C) Message queue
D) Load balancer
```

**✅ Good (Scenario style):**
```
Scenario: You're building a session store for a web app.
Requirements: 100ms latency, 10K sessions, expire after 30 min.
Question: Would you use Redis or a SQL database? Explain trade-offs.
```

## 🔄 Integration with Existing System

This SRS system is **separate** from the complex system design challenges. Use both:

1. **SRS (Spaced Repetition)**: Teach individual concepts
   - "What is Redis?"
   - "Redis vs Kafka"
   - "Cache strategies"
   - Duration: 5-15 minutes
   - Format: Scenario questions
   - Goal: Concept mastery through repetition

2. **System Design Challenges**: Apply concepts in real systems
   - "Build Instagram"
   - "Design Netflix streaming"
   - Duration: 30-60 minutes
   - Format: Canvas + Python code
   - Goal: Practical application

**Recommended Flow:**
```
1. Learn concept via SRS (Redis vs Kafka)
2. Review concept over days (spaced repetition)
3. Apply in challenge (Build notification system using Redis)
```

## 📚 References

- **SM-2 Algorithm**: [SuperMemo 2 Documentation](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- **Spaced Repetition**: [How to Remember Everything](https://ncase.me/remember/)
- **Forgetting Curve**: Ebbinghaus's research on memory retention

## 🤝 Contributing

To add new concepts or questions:

1. Define concept in `src/data/srs/concepts.ts`
2. Create 2-3 scenario questions per concept
3. Ensure questions test understanding, not memorization
4. Test evaluation logic with sample answers
5. Submit PR with examples

## 📄 License

Same as main project.

---

**Built with ❤️ to help engineers truly understand system design concepts, not just memorize them.**
