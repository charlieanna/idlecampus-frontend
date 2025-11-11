# Frontend UI Enhancements

## Overview

This document describes the major UI and feature enhancements added to the IdleCampus learning platform frontend. These improvements follow the technical blueprint and significantly enhance the learning experience with interactive visualizations, multi-stage lessons, and advanced code editing capabilities.

## Table of Contents

1. [Interactive Visualizations](#interactive-visualizations)
2. [Enhanced Monaco Editor](#enhanced-monaco-editor)
3. [Multi-Stage Lesson System](#multi-stage-lesson-system)
4. [Integration Guide](#integration-guide)
5. [Examples](#examples)

---

## Interactive Visualizations

### 1. ArrayVisualization Component

**File**: `frontend/src/components/visualizations/ArrayVisualization.tsx`

A flexible, animated array visualization component for teaching array-based algorithms.

#### Features:
- **Highlighting**: Highlight specific indices with custom colors
- **Pointers**: Show labeled pointers above array elements (e.g., "left", "right", "i", "j")
- **Active Ranges**: Visualize sliding windows or subarrays
- **Animations**: Smooth Framer Motion animations
- **Customizable**: Adjustable cell size, colors, and styling

#### Usage:
```typescript
import { ArrayVisualization } from './components/visualizations/ArrayVisualization';

<ArrayVisualization
  array={[3, 1, 4, 1, 5, 9, 2, 6]}
  highlightIndices={[2, 4]}
  pointers={{ 0: 'start', 7: 'end' }}
  activeRange={[2, 5]}
  animate={true}
  showIndices={true}
/>
```

#### Props:
- `array`: Array of numbers or strings to visualize
- `highlightIndices`: Indices to highlight
- `highlightColors`: Custom color mapping for indices
- `pointers`: Labeled pointers ({ index: label })
- `activeRange`: [start, end] for window highlighting
- `animate`: Enable/disable animations
- `cellWidth`, `cellHeight`: Customize cell dimensions
- `showIndices`: Show index numbers below cells

---

### 2. SlidingWindowAnimation Component

**File**: `frontend/src/components/visualizations/SlidingWindowAnimation.tsx`

Interactive step-by-step animation for sliding window algorithm demonstrations.

#### Features:
- **Step Controls**: Play, pause, previous, next, reset
- **Progress Slider**: Jump to any step
- **Speed Control**: Adjustable animation speed
- **Code Display**: Optional code snippets for each step
- **Explanations**: Text explanation for each step
- **Auto-play**: Automatic progression through steps

#### Usage:
```typescript
import { SlidingWindowAnimation } from './components/visualizations/SlidingWindowAnimation';

const steps = [
  {
    windowStart: 0,
    windowEnd: 2,
    currentValue: 8,
    explanation: 'Initial window: sum = 2 + 1 + 5 = 8',
    code: 'let sum = arr[0] + arr[1] + arr[2];'
  },
  // ... more steps
];

<SlidingWindowAnimation
  array={[2, 1, 5, 1, 3, 2]}
  steps={steps}
  valueLabel="Sum"
  autoPlaySpeed={1000}
  showCode={true}
/>
```

#### Props:
- `array`: Array to visualize
- `steps`: Array of step configurations
- `valueLabel`: Label for current value display
- `autoPlaySpeed`: Milliseconds between auto-play steps
- `showCode`: Display code snippets
- `className`: Custom styling

---

### 3. TreeVisualization Component

**File**: `frontend/src/components/visualizations/TreeVisualization.tsx`

SVG-based binary tree visualization with recursive layout.

#### Features:
- **Automatic Layout**: Calculates node positions recursively
- **Path Highlighting**: Highlight specific paths through tree
- **Animations**: Smooth entry animations
- **Responsive**: Scales to container
- **Null Handling**: Properly displays null/missing nodes

#### Usage:
```typescript
import { TreeVisualization } from './components/visualizations/TreeVisualization';

const tree = {
  value: 10,
  left: {
    value: 5,
    left: { value: 3 },
    right: { value: 7 }
  },
  right: {
    value: 15,
    left: { value: 12 },
    right: { value: 20 }
  }
};

<TreeVisualization
  root={tree}
  highlightPath={['10', '15', '20']}
  animate={true}
/>
```

#### Props:
- `root`: Tree root node
- `highlightPath`: Array of node IDs to highlight
- `animate`: Enable animations
- `nodeRadius`: Size of tree nodes
- `levelHeight`: Vertical spacing between levels

---

### 4. GraphVisualization Component (Planned)

**Status**: Type definitions created, implementation pending

Will support:
- Directed/undirected graphs
- Weighted edges
- BFS/DFS path highlighting
- Auto-layout or manual positioning
- Interactive node dragging

---

## Enhanced Monaco Editor

**File**: `frontend/src/components/course/CodeEditor.tsx`

Significantly enhanced code editor with advanced Monaco Editor features.

### New Features:

#### 1. **Editor Settings Panel**
- Collapsible settings UI
- Theme selection (Dark, Light, High Contrast)
- Font size adjustment (12px - 20px)
- Tab size configuration (2, 4, 8 spaces)
- Word wrap toggle
- Minimap toggle
- Vim mode toggle (experimental)

#### 2. **Enhanced Editor Options**
- **Format on paste**: Auto-formats code when pasting
- **Format on type**: Formats as you type
- **IntelliSense**: Advanced code suggestions
- **Parameter hints**: Function signature help
- **Bracket colorization**: Matching bracket pairs
- **Smooth scrolling**: Better scroll experience
- **Cursor animations**: Smooth cursor movements

#### 3. **Keyboard Shortcuts**
- `Cmd/Ctrl + Enter`: Run code
- `Cmd/Ctrl + Shift + Enter`: Run tests
- `Cmd/Ctrl + Shift + F`: Format code

#### 4. **Persistent Settings**
- Settings saved to localStorage
- Auto-load on next visit
- Per-user preferences

### Usage:
```typescript
import { CodeEditor } from './components/course/CodeEditor';

<CodeEditor
  lab={codeLabData}
  onComplete={handleComplete}
/>
```

The component now includes a **Settings** button (gear icon) that reveals the settings panel when clicked.

---

## Multi-Stage Lesson System

A comprehensive system for creating complex, multi-step learning experiences.

### Architecture

1. **Type Definitions** (`frontend/src/types/multiStage.ts`)
2. **StageManager** (`frontend/src/components/course/StageManager.tsx`)
3. **MultiStageLessonViewer** (`frontend/src/components/course/MultiStageLessonViewer.tsx`)
4. **Example Lesson** (`frontend/src/data/lessons/timeComplexityLesson.ts`)

### Stage Types

The system supports 7 different stage types:

#### 1. **Concept Stage**
Introduces theory and explanations.

```typescript
{
  type: 'concept',
  title: 'What is Time Complexity?',
  content: {
    markdown: '# Introduction...',
    images: ['url1.png'],
    externalLinks: [{ title: 'Docs', url: 'https://...' }]
  },
  keyPoints: ['Point 1', 'Point 2']
}
```

Features:
- Rich markdown content
- Key takeaways section
- External resource links
- Images and videos

#### 2. **Visualization Stage**
Interactive animations and visualizations.

```typescript
{
  type: 'visualization',
  visualizationType: 'sliding_window',
  config: {
    type: 'sliding_window',
    array: [2, 1, 5, 1, 3, 2],
    steps: [/* ... */]
  },
  explanation: 'Markdown explanation...'
}
```

Supported visualizations:
- Array
- Sliding Window
- Tree
- Graph (planned)
- Custom components

#### 3. **Example Stage**
Step-by-step worked examples.

```typescript
{
  type: 'example',
  problem: 'Find element in array',
  solution: {
    steps: [
      {
        stepNumber: 1,
        title: 'Setup',
        explanation: 'First we...',
        code: 'const arr = [1,2,3];'
      }
    ],
    finalAnswer: 'O(n) time'
  }
}
```

Features:
- Multi-step walkthroughs
- Code snippets per step
- Visualizations per step
- Final answer display

#### 4. **Practice Stage**
Interactive problems for learners.

```typescript
{
  type: 'practice',
  problem: 'Write a function to...',
  hints: ['Hint 1', 'Hint 2'],
  validation: {
    type: 'code',
    testCases: [/* ... */]
  }
}
```

Features:
- Problem statement
- Progressive hints
- Multiple validation types
- Instant feedback

#### 5. **Code Stage**
Full code lab integration.

```typescript
{
  type: 'code',
  labId: 123, // Reference existing CodeLab
  // OR
  inlineConfig: {
    title: 'Binary Search',
    starterCode: '...',
    testCases: [/* ... */]
  }
}
```

#### 6. **Quiz Stage**
Assessment with multiple question types.

```typescript
{
  type: 'quiz',
  questions: [
    {
      question: 'What is O(n)?',
      type: 'multiple_choice',
      options: ['Linear', 'Constant', 'Quadratic'],
      correctAnswer: 'Linear',
      explanation: 'O(n) means...'
    }
  ],
  passingScore: 70
}
```

Question types:
- Multiple choice
- Multiple select
- True/false
- Short answer

#### 7. **Terminal Stage**
Command-line exercises (reuses progressive modules).

---

### StageManager Component

**File**: `frontend/src/components/course/StageManager.tsx`

Manages navigation and state for multi-stage lessons.

#### Features:
- **Progress Tracking**: Visual progress bar and percentage
- **Stage Breadcrumbs**: Click to navigate between stages
- **Completion Status**: Shows completed stages with checkmarks
- **Navigation Controls**: Previous, Next, Skip buttons
- **Auto-advance**: Moves to next stage on completion
- **localStorage Persistence**: Saves progress automatically
- **Keyboard Navigation**: Arrow keys support (planned)

#### Props:
```typescript
interface StageManagerProps {
  lesson: MultiStageLesson;
  initialProgress?: MultiStageProgress;
  onStageComplete?: (stageId: string, score?: number) => void;
  onLessonComplete?: () => void;
  onExit?: () => void;
  renderStage: (stage: MultiStage, onComplete: () => void) => React.ReactNode;
}
```

---

### MultiStageLessonViewer Component

**File**: `frontend/src/components/course/MultiStageLessonViewer.tsx`

Main viewer that renders each stage type.

#### Features:
- Renders all 7 stage types
- Integrates with StageManager
- Handles stage-specific interactions
- Progress persistence
- Responsive two-panel layout (content + visualization)

#### Usage:
```typescript
import { MultiStageLessonViewer } from './components/course/MultiStageLessonViewer';
import { timeComplexityLesson } from './data/lessons/timeComplexityLesson';

<MultiStageLessonViewer
  lesson={timeComplexityLesson}
  onComplete={() => console.log('Lesson complete!')}
  onExit={() => navigate('/courses')}
/>
```

---

## Integration Guide

### Adding Multi-Stage Lesson to GenericCourseApp

**Status**: Type definitions and components ready, GenericCourseApp integration pending

**Planned Integration**:

1. **Detect multi-stage lessons** in course data
2. **Route to MultiStageLessonViewer** instead of regular lesson viewer
3. **Track progress** via existing progress tracking API
4. **Backend API endpoints** (to be implemented):
   - `GET /api/v1/courses/:slug/lessons/:id/stages`
   - `POST /api/v1/courses/:slug/lessons/:id/stages/:stage_id/complete`
   - `GET /api/v1/courses/:slug/lessons/:id/progress`

### Creating a New Multi-Stage Lesson

1. **Create lesson definition** (TypeScript):

```typescript
// frontend/src/data/lessons/myLesson.ts
import type { MultiStageLesson } from '../../types/multiStage';

export const myLesson: MultiStageLesson = {
  id: 'my-lesson',
  slug: 'my-lesson-slug',
  title: 'My Lesson Title',
  description: 'Learn about...',
  difficulty: 'beginner',
  estimatedMinutes: 30,
  stages: [
    {
      type: 'concept',
      id: 'intro',
      title: 'Introduction',
      content: { markdown: '# Welcome...' }
    },
    // ... more stages
  ]
};
```

2. **Use in app**:

```typescript
import { myLesson } from './data/lessons/myLesson';

<MultiStageLessonViewer
  lesson={myLesson}
  onComplete={handleComplete}
/>
```

---

## Examples

### Complete Time Complexity Lesson

**File**: `frontend/src/data/lessons/timeComplexityLesson.ts`

A comprehensive 7-stage lesson demonstrating all features:

1. **Concept**: Introduction to time complexity
2. **Visualization**: Array showing growth rates
3. **Example**: O(1) constant time
4. **Example**: O(n) linear search
5. **Visualization**: Sliding window optimization
6. **Practice**: Identify complexity from code
7. **Quiz**: 4-question assessment

**Estimated Time**: 45 minutes
**Stages**: 7
**Difficulty**: Beginner

---

## Features Summary

### ✅ Completed

1. **ArrayVisualization** - Flexible array visualization with highlighting, pointers, and ranges
2. **SlidingWindowAnimation** - Interactive step-by-step sliding window demonstrations
3. **TreeVisualization** - SVG binary tree rendering with path highlighting
4. **Enhanced CodeEditor** - Advanced Monaco features, settings panel, keyboard shortcuts
5. **Multi-Stage Type System** - Comprehensive TypeScript types for 7 stage types
6. **StageManager** - Navigation and progress tracking for multi-stage lessons
7. **MultiStageLessonViewer** - Renders all stage types with proper UI
8. **Example Lesson** - Complete time complexity lesson demonstrating all features

### 🔄 In Progress

- **GraphVisualization** - Component for BFS/DFS algorithm visualization (types defined)
- **GenericCourseApp Integration** - Integrate multi-stage lessons into main course viewer

### 📋 Planned

- **Backend API** - Stage progress endpoints
- **More Example Lessons** - Backtracking, Dynamic Programming, Sorting
- **Collaborative Features** - Real-time collaboration in code editor
- **Mobile Optimization** - Touch-friendly visualizations
- **Accessibility** - Screen reader support, keyboard navigation

---

## File Structure

```
frontend/src/
├── components/
│   ├── course/
│   │   ├── CodeEditor.tsx (enhanced)
│   │   ├── StageManager.tsx (new)
│   │   └── MultiStageLessonViewer.tsx (new)
│   ├── visualizations/
│   │   ├── ArrayVisualization.tsx (new)
│   │   ├── SlidingWindowAnimation.tsx (new)
│   │   └── TreeVisualization.tsx (new)
│   └── ui/
│       ├── slider.tsx (new)
│       └── progress.tsx (existing)
├── types/
│   └── multiStage.ts (new - 300+ lines)
└── data/
    └── lessons/
        └── timeComplexityLesson.ts (new - example)
```

---

## Testing

### Manual Testing Checklist

#### Visualizations:
- [ ] ArrayVisualization renders with different array types
- [ ] Pointers display correctly above elements
- [ ] Active ranges highlight properly
- [ ] Animations are smooth
- [ ] SlidingWindowAnimation play/pause controls work
- [ ] Speed slider adjusts animation speed
- [ ] TreeVisualization renders balanced trees
- [ ] Tree animations work for large trees

#### Monaco Editor:
- [ ] Settings panel toggles open/closed
- [ ] Theme changes apply immediately
- [ ] Font size changes work
- [ ] Keyboard shortcuts execute commands
- [ ] Settings persist across page reloads
- [ ] Code formatting works (Cmd+Shift+F)
- [ ] IntelliSense suggestions appear

#### Multi-Stage Lessons:
- [ ] Stage navigation works (prev/next)
- [ ] Progress bar updates correctly
- [ ] Stage breadcrumbs are clickable
- [ ] Completed stages show checkmarks
- [ ] Progress persists in localStorage
- [ ] All 7 stage types render properly
- [ ] Quiz scoring works
- [ ] Example step navigation works
- [ ] Practice hints reveal progressively

---

## Performance Considerations

- **Visualizations**: Use `React.memo()` for expensive renders
- **Animations**: Framer Motion animations are GPU-accelerated
- **Monaco Editor**: Lazy loaded, doesn't block initial page load
- **Progress Persistence**: Throttled localStorage writes
- **Tree Rendering**: Optimized SVG rendering for trees up to depth 6

---

## Browser Support

- **Chrome/Edge**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: Full support ✅
- **Mobile**: Visualizations are responsive, touch-friendly controls needed

---

## Next Steps

1. **Integrate multi-stage lessons into GenericCourseApp**
2. **Create GraphVisualization component**
3. **Add more example lessons** (Sorting, DP, Backtracking)
4. **Backend API development** for stage progress
5. **Mobile optimization**
6. **Accessibility improvements**

---

## Resources

- [Monaco Editor Docs](https://microsoft.github.io/monaco-editor/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
- [Technical Blueprint](./TECHNICAL_BLUEPRINT.md)
- [Progress Tracking Integration](./PROGRESS_TRACKING_INTEGRATION.md)

---

## Support

For questions or issues:
1. Check this documentation
2. Review component TypeScript types
3. See example lesson: `timeComplexityLesson.ts`
4. Test in isolation using component props

---

**Last Updated**: November 10, 2025
**Version**: 1.0.0
**Status**: Ready for Testing & Integration
