# MVP Implementation Plan - System Design Builder

## 🎯 Goal

Build a minimal viable product (MVP) in **10-12 days** that allows users to:
1. Visually design simple systems (Tiny URL, Food Blog, Todo App)
2. Run simulations with traffic
3. Get pass/fail results with explanations
4. Learn system design concepts through practice

---

## 📋 MVP Scope

### In Scope ✅
- 3 challenges (Tiny URL, Food Blog, Todo App)
- 6 components (Load Balancer, App Server, PostgreSQL, Redis, CDN, S3)
- Visual canvas (drag & drop)
- Simple inspector panel
- Simulation engine (analytical model)
- Pass/fail results with explanations
- Cost estimation

### Out of Scope ❌
- Complex challenges (TicketMaster, Twitter)
- Advanced components (Kafka, Cassandra, message queues)
- Schema editor (use simplified data model assumptions)
- Multi-region deployments
- User accounts / save designs
- Scoring/grading (0-100 points)
- Leaderboards
- Discrete event simulation

---

## 🏗️ Project Structure

```
src/
├── apps/
│   └── system-design-builder/
│       ├── SystemDesignBuilderApp.tsx       # Main app component
│       ├── components/
│       │   ├── Canvas.tsx                   # Drag-and-drop canvas
│       │   ├── ComponentPalette.tsx         # Left sidebar with components
│       │   ├── Inspector.tsx                # Right sidebar for config
│       │   ├── TestRunner.tsx               # Modal for running tests
│       │   ├── ResultsPanel.tsx             # Show test results
│       │   └── Node.tsx                     # Visual component on canvas
│       ├── simulation/
│       │   ├── engine.ts                    # Main simulation engine
│       │   ├── components/
│       │   │   ├── Component.ts             # Base class
│       │   │   ├── LoadBalancer.ts
│       │   │   ├── AppServer.ts
│       │   │   ├── PostgreSQL.ts
│       │   │   ├── RedisCache.ts
│       │   │   ├── CDN.ts
│       │   │   └── S3.ts
│       │   ├── graph.ts                     # Graph representation
│       │   └── testRunner.ts                # Execute test cases
│       ├── challenges/
│       │   ├── challenge.ts                 # Challenge type definitions
│       │   ├── tinyUrl.ts                   # Tiny URL challenge
│       │   ├── foodBlog.ts                  # Food Blog challenge
│       │   └── todoApp.ts                   # Todo App challenge
│       ├── types/
│       │   ├── graph.ts                     # SystemGraph types
│       │   ├── metrics.ts                   # Metrics types
│       │   └── testCase.ts                  # TestCase types
│       └── utils/
│           ├── validation.ts                # Validate user designs
│           └── recommendations.ts           # Generate recommendations
└── data/
    └── system-design-challenges.json        # Challenge definitions
```

---

## 📅 Implementation Timeline (10-12 Days)

### **Phase 1: Simulation Engine** (Days 1-3)

**Goal**: Build and validate the core simulation engine with hardcoded examples

#### Day 1: Component Models
- [ ] Create base `Component` interface
- [ ] Implement 6 component classes:
  - LoadBalancer
  - AppServer
  - PostgreSQL
  - RedisCache
  - CDN
  - S3
- [ ] Write unit tests for each component
- [ ] Verify latency/cost calculations are reasonable

**Files to create**:
```typescript
// src/apps/system-design-builder/simulation/components/Component.ts
export interface ComponentMetrics {
  latency: number;
  errorRate: number;
  utilization: number;
  cost: number;
  [key: string]: any;
}

export abstract class Component {
  id: string;
  type: string;
  config: Record<string, any>;

  abstract simulate(rps: number, context?: any): ComponentMetrics;
}

// src/apps/system-design-builder/simulation/components/AppServer.ts
export class AppServer extends Component {
  // Implementation from SIMULATION_ENGINE_SPEC.md
}
```

**Validation**: Run hardcoded Tiny URL example, verify results match manual calculation

---

#### Day 2: Graph & Traffic Propagation
- [ ] Create `SystemGraph` data structure
- [ ] Implement topological sort
- [ ] Implement traffic propagation algorithm
- [ ] Handle cache hit ratio (reduces DB traffic)
- [ ] Calculate end-to-end latency

**Files to create**:
```typescript
// src/apps/system-design-builder/simulation/graph.ts
export interface SystemGraph {
  components: Component[];
  connections: Connection[];
}

export interface Connection {
  from: string;
  to: string;
  type: 'read' | 'write' | 'read_write';
}

export class GraphSimulator {
  simulate(graph: SystemGraph, traffic: Traffic): SimulationResult {
    // Implementation
  }
}
```

**Validation**: Create 2-3 different graph topologies, verify traffic flows correctly

---

#### Day 3: Test Runner & Pass/Fail Logic
- [ ] Implement test case runner
- [ ] Add failure injection (cache flush, DB crash)
- [ ] Implement pass/fail criteria checker
- [ ] Generate explanations
- [ ] Identify bottlenecks

**Files to create**:
```typescript
// src/apps/system-design-builder/simulation/testRunner.ts
export class TestRunner {
  runTestCase(graph: SystemGraph, testCase: TestCase): TestResult {
    // Implementation
  }

  private checkPassCriteria(metrics: Metrics, criteria: PassCriteria): boolean {
    // Implementation
  }

  private identifyBottlenecks(metrics: ComponentMetrics[]): Bottleneck[] {
    // Implementation
  }
}
```

**Validation**: Run 3 challenge test cases with hardcoded graphs, verify pass/fail is correct

---

### **Phase 2: Challenge Definitions** (Day 4)

**Goal**: Define 3 challenges with test cases and pass criteria

#### Day 4: Create Challenge JSON
- [ ] Define Tiny URL challenge
  - Problem statement
  - 3 test cases (normal, spike, cache flush)
  - Pass criteria
  - Learning objectives
- [ ] Define Food Blog challenge
  - 3 test cases (normal, viral post, image load)
- [ ] Define Todo App challenge
  - 3 test cases (normal, DB failure, hot user)

**Files to create**:
```typescript
// src/apps/system-design-builder/challenges/tinyUrl.ts
export const tinyUrlChallenge: Challenge = {
  id: 'tiny_url_beginner',
  title: 'Tiny URL Shortener',
  difficulty: 'beginner',
  description: '...',
  availableComponents: ['load_balancer', 'app_server', 'redis', 'postgresql'],
  testCases: [
    {
      name: 'Normal Load',
      traffic: { rps: 1100, readRatio: 0.91 },
      passCriteria: {
        maxP99Latency: 100,
        maxErrorRate: 0.01,
        maxMonthlyCost: 500
      }
    }
    // ... more test cases
  ],
  learningObjectives: [
    'Understand read-heavy workloads',
    'Learn when caching is beneficial',
    'Practice capacity planning'
  ]
};
```

**Validation**: Load challenges into simulation engine, run with sample graphs

---

### **Phase 3: UI - Canvas & Components** (Days 5-7)

**Goal**: Build visual interface for designing systems

#### Day 5: Component Palette & Canvas Setup
- [ ] Create left sidebar palette
- [ ] Draggable component items
- [ ] Canvas area with pan/zoom
- [ ] Drop component on canvas → creates node
- [ ] Basic styling (Tailwind)

**Files to create**:
```typescript
// src/apps/system-design-builder/components/ComponentPalette.tsx
export const ComponentPalette: React.FC = () => {
  const components = [
    { id: 'load_balancer', name: 'Load Balancer', icon: '🌐' },
    { id: 'app_server', name: 'App Server', icon: '📦' },
    // ...
  ];

  return (
    <div className="w-48 bg-gray-100 p-4">
      {components.map(comp => (
        <DraggableComponent key={comp.id} component={comp} />
      ))}
    </div>
  );
};

// src/apps/system-design-builder/components/Canvas.tsx
export const Canvas: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  // Handle drop, pan, zoom
  return (
    <div className="flex-1 bg-white relative">
      {/* Canvas implementation */}
    </div>
  );
};
```

**Libraries to use**:
- `react-dnd` or `@dnd-kit/core` for drag-and-drop
- `react-zoom-pan-pinch` for canvas pan/zoom
- OR use existing canvas libraries like `reactflow` or `xyflow`

**Validation**: Can drag components, drop on canvas, see visual nodes

---

#### Day 6: Connections & Inspector
- [ ] Click and drag between nodes to create connections
- [ ] Visual arrows/lines between components
- [ ] Click node → open inspector panel
- [ ] Inspector shows config options for selected component
- [ ] Update node config → save to state

**Files to create**:
```typescript
// src/apps/system-design-builder/components/Inspector.tsx
export const Inspector: React.FC<{ node: Node | null }> = ({ node }) => {
  if (!node) return <div>Select a component to configure</div>;

  switch (node.type) {
    case 'app_server':
      return <AppServerConfig node={node} />;
    case 'postgresql':
      return <PostgreSQLConfig node={node} />;
    // ... other components
  }
};

// Component-specific config panels
const AppServerConfig: React.FC<{ node: Node }> = ({ node }) => {
  return (
    <div>
      <label>Instances</label>
      <input
        type="number"
        value={node.config.instances}
        onChange={(e) => updateNodeConfig(node.id, { instances: +e.target.value })}
      />
    </div>
  );
};
```

**Validation**: Configure components, values persist, can create connected graph

---

#### Day 7: Challenge Selection & UI Polish
- [ ] Challenge selector (dropdown or cards)
- [ ] Show challenge description
- [ ] Display available components for challenge
- [ ] Show test cases for selected challenge
- [ ] Basic responsive layout
- [ ] Styling and icons

**Files to create**:
```typescript
// src/apps/system-design-builder/components/ChallengeSelector.tsx
export const ChallengeSelector: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  return (
    <div>
      <select onChange={(e) => loadChallenge(e.target.value)}>
        <option value="tiny_url">Tiny URL</option>
        <option value="food_blog">Food Blog</option>
        <option value="todo_app">Todo App</option>
      </select>

      {selectedChallenge && (
        <div>
          <h2>{selectedChallenge.title}</h2>
          <p>{selectedChallenge.description}</p>
        </div>
      )}
    </div>
  );
};
```

**Validation**: Can select challenge, see description, components filter correctly

---

### **Phase 4: Integration** (Days 8-9)

**Goal**: Connect UI to simulation engine

#### Day 8: Run Simulation from UI
- [ ] "Run Tests" button
- [ ] Convert canvas state → `SystemGraph` JSON
- [ ] Validate graph (all components connected)
- [ ] Pass graph to simulation engine
- [ ] Run all test cases
- [ ] Show loading state

**Files to create**:
```typescript
// src/apps/system-design-builder/utils/graphConverter.ts
export function canvasToGraph(nodes: Node[], connections: Connection[]): SystemGraph {
  return {
    components: nodes.map(node => ({
      id: node.id,
      type: node.type,
      config: node.config
    })),
    connections: connections.map(conn => ({
      from: conn.fromNodeId,
      to: conn.toNodeId,
      type: 'read_write'
    }))
  };
}

// src/apps/system-design-builder/components/TestRunner.tsx
export const TestRunner: React.FC = () => {
  const runTests = async () => {
    const graph = canvasToGraph(nodes, connections);
    const engine = new SimulationEngine();
    const results = challenge.testCases.map(tc => engine.runTestCase(graph, tc));
    setResults(results);
  };

  return (
    <button onClick={runTests}>Run Tests</button>
  );
};
```

**Validation**: Click button → simulation runs → console shows results

---

#### Day 9: Results Display
- [ ] Show test results panel
- [ ] Pass/fail indicators (✅/❌)
- [ ] Show metrics (latency, error rate, cost)
- [ ] Show bottlenecks with explanations
- [ ] Highlight bottleneck components on canvas
- [ ] Show recommendations

**Files to create**:
```typescript
// src/apps/system-design-builder/components/ResultsPanel.tsx
export const ResultsPanel: React.FC<{ results: TestResult[] }> = ({ results }) => {
  return (
    <div className="border-t p-4 bg-gray-50">
      <h2>Test Results</h2>
      {results.map((result, i) => (
        <TestResultCard key={i} result={result} testCase={challenge.testCases[i]} />
      ))}
    </div>
  );
};

const TestResultCard: React.FC<{ result: TestResult; testCase: TestCase }> = ({
  result,
  testCase
}) => {
  return (
    <div className={`p-4 border ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}>
      <h3>{result.passed ? '✅' : '❌'} {testCase.name}</h3>
      <div>p99 Latency: {result.metrics.p99Latency}ms</div>
      <div>Error Rate: {(result.metrics.errorRate * 100).toFixed(2)}%</div>
      <div>Cost: ${result.metrics.monthlyCost}/month</div>

      {result.bottlenecks.length > 0 && (
        <div>
          <h4>Bottlenecks:</h4>
          {result.bottlenecks.map(b => (
            <div key={b.componentId}>
              {b.componentId}: {b.issue} ({(b.utilization * 100).toFixed(0)}%)
              <br />
              💡 {b.recommendation}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

**Validation**: Results display correctly, bottlenecks show, recommendations make sense

---

### **Phase 5: Testing & Refinement** (Days 10-12)

#### Day 10: End-to-End Testing
- [ ] Test all 3 challenges
- [ ] Try deliberately bad designs (no cache, under-provisioned)
- [ ] Verify pass/fail is correct
- [ ] Check explanations are helpful
- [ ] Test edge cases (0 instances, disconnected components)
- [ ] Add validation errors for invalid designs

**Validation checklist**:
```
Challenge 1: Tiny URL
  ✅ No cache → fails spike test (DB overload)
  ✅ With cache → passes all tests
  ✅ Over-provisioned → passes but too expensive
  ✅ Cost explanation is accurate

Challenge 2: Food Blog
  ✅ No CDN → expensive bandwidth cost
  ✅ With CDN → passes and cheap
  ✅ Viral post test correctly simulates spike

Challenge 3: Todo App
  ✅ No replication → fails DB failure test
  ✅ With replication → passes all tests
  ✅ Hot user test shows contention
```

---

#### Day 11: User Testing
- [ ] Get 3-5 people to try it
- [ ] Observe where they get confused
- [ ] Collect feedback on:
  - Is it intuitive?
  - Do they understand feedback?
  - Did they learn something?
- [ ] Make UX improvements based on feedback

**Questions to ask testers**:
1. Can you complete the Tiny URL challenge?
2. When a test failed, did you understand why?
3. Did the recommendations help?
4. On a scale 1-10, how much did you learn?
5. What was most confusing?

---

#### Day 12: Polish & Documentation
- [ ] Fix bugs from user testing
- [ ] Add tooltips to components
- [ ] Add help text to inspector fields
- [ ] Write README for the app
- [ ] Add example solutions
- [ ] Deploy to preview environment

---

## 🔧 Technical Decisions

### Canvas Library Options

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **reactflow** | Full-featured, handles connections | Heavy, opinionated | ✅ Best for MVP |
| **react-dnd** | Lightweight, flexible | Need to build connections manually | OK if want control |
| **Custom** | Full control | Time-consuming | ❌ Too much work for MVP |

**Decision**: Use **reactflow** - it handles node positioning, connections, and pan/zoom out of the box.

---

### State Management

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| **useState** | Simple, no dependencies | Props drilling | ✅ Fine for MVP |
| **Context** | Avoids props drilling | More setup | OK if needed |
| **Zustand** | Clean, TypeScript-friendly | External dep | Good for scale |
| **Redux** | Powerful | Overkill | ❌ Too heavy |

**Decision**: Start with **useState**, refactor to Context/Zustand if props drilling becomes painful.

---

### Styling Approach

**Decision**: **Tailwind CSS**
- Already in project
- Fast to prototype
- Easy to make responsive

Component structure:
```tsx
<div className="flex h-screen">
  <ComponentPalette className="w-48 bg-gray-100" />
  <Canvas className="flex-1" />
  <Inspector className="w-80 bg-white border-l" />
</div>
```

---

## 🎯 Success Criteria (After 12 Days)

### Functional ✅
- [ ] Can select a challenge
- [ ] Can drag components onto canvas
- [ ] Can configure components
- [ ] Can connect components
- [ ] Can run simulation
- [ ] Can see pass/fail results
- [ ] Can see explanations and recommendations

### Quality ✅
- [ ] No major bugs
- [ ] Simulation results are reasonable
- [ ] UI is usable (not beautiful, but functional)
- [ ] 3 challenges work end-to-end

### Learning ✅
- [ ] 5 test users can complete at least 1 challenge
- [ ] Users report learning something
- [ ] Users understand pass/fail feedback

---

## 🚀 Post-MVP: What's Next?

If MVP validates the concept, prioritize:

### Phase 2 Features (Weeks 3-4)
- [ ] Save/load designs (localStorage or backend)
- [ ] More challenges (TicketMaster, Chat app)
- [ ] Scoring system (0-100 points)
- [ ] Better visualizations (timeline, graphs)
- [ ] Export design as image/PDF

### Phase 3 Features (Weeks 5-8)
- [ ] User accounts
- [ ] Leaderboards
- [ ] Community solutions
- [ ] More components (Kafka, Elasticsearch)
- [ ] Schema editor
- [ ] Multi-region support

### Phase 4 Features (Weeks 9-12)
- [ ] Discrete event simulation (more accurate)
- [ ] Real-time collaboration
- [ ] Interview mode (timed challenges)
- [ ] AI-powered hints
- [ ] Auto-grading for custom challenges

---

## 📦 Dependencies to Add

```json
{
  "dependencies": {
    "reactflow": "^11.10.0",
    "@dnd-kit/core": "^6.0.0",
    "react-zoom-pan-pinch": "^3.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "vitest": "^1.0.0"
  }
}
```

Install:
```bash
npm install reactflow @dnd-kit/core react-zoom-pan-pinch
```

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Test component calculations
describe('AppServer', () => {
  it('should calculate latency correctly under load', () => {
    const server = new AppServer({ instances: 2 });
    const result = server.simulate(1100);
    expect(result.latency).toBeLessThan(20);
  });

  it('should show high utilization when overloaded', () => {
    const server = new AppServer({ instances: 1 });
    const result = server.simulate(1500);
    expect(result.utilization).toBeGreaterThan(0.9);
  });
});
```

### Integration Tests
```typescript
// Test full simulation
describe('SimulationEngine', () => {
  it('should run Tiny URL challenge correctly', () => {
    const graph = createTinyUrlGraph();
    const engine = new SimulationEngine();
    const result = engine.runTestCase(graph, tinyUrlNormalLoadTest);
    expect(result.passed).toBe(true);
  });
});
```

### Manual Testing Checklist
```
Canvas:
  ✅ Can drag component from palette
  ✅ Can drop on canvas
  ✅ Can connect two components
  ✅ Can delete component
  ✅ Can pan canvas
  ✅ Can zoom canvas

Inspector:
  ✅ Shows correct fields for each component type
  ✅ Changes persist when switching components
  ✅ Validation prevents invalid values

Simulation:
  ✅ Handles disconnected components gracefully
  ✅ Shows error for invalid graphs
  ✅ Results display correctly
  ✅ Bottlenecks highlight on canvas
```

---

## 📝 Key Files Summary

```
Core Engine:
  simulation/engine.ts                    # Main simulation orchestrator
  simulation/components/*.ts              # 6 component implementations
  simulation/testRunner.ts                # Test execution

Challenges:
  challenges/tinyUrl.ts                   # Challenge 1
  challenges/foodBlog.ts                  # Challenge 2
  challenges/todoApp.ts                   # Challenge 3

UI:
  SystemDesignBuilderApp.tsx              # Root component
  components/Canvas.tsx                   # Main canvas
  components/ComponentPalette.tsx         # Left sidebar
  components/Inspector.tsx                # Right sidebar
  components/ResultsPanel.tsx             # Show results

Utils:
  utils/graphConverter.ts                 # Canvas → Graph JSON
  utils/validation.ts                     # Validate designs
  utils/recommendations.ts                # Generate suggestions
```

---

## 🎓 Learning Resources for Implementation

### React Flow (Canvas Library)
- Docs: https://reactflow.dev/
- Examples: https://reactflow.dev/examples

### Queueing Theory (For Latency Models)
- M/M/1 Queue: https://en.wikipedia.org/wiki/M/M/1_queue
- Little's Law: https://en.wikipedia.org/wiki/Little%27s_law

### System Design Concepts
- Database capacity planning
- Cache hit ratio calculations
- Cost modeling for cloud services

---

## 🚨 Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Simulation too inaccurate | High | Validate against real benchmarks, adjust models |
| UI too complex | Medium | Use reactflow library, keep it simple |
| Scope creep | High | Stick to 3 challenges, 6 components only |
| Users don't learn | High | User test early (Day 11), iterate on feedback |
| Takes too long | Medium | Time-box phases, cut features if needed |

---

## ✅ Definition of Done

An MVP is complete when:

1. **3 challenges work end-to-end**: User can select, design, simulate, see results
2. **Results are reasonable**: Simulation numbers match real-world intuition
3. **Feedback is helpful**: Users understand why tests pass/fail
4. **5 users complete a challenge**: Without getting stuck or confused
5. **Code is documented**: README explains how to run and extend

---

**Document Version**: 1.0
**Last Updated**: 2025-11-11
**Status**: Ready for Implementation
**Estimated Effort**: 10-12 days (single developer, full-time)
