# System Design Builder UI Architecture

This directory contains the refactored UI architecture for the System Design Builder application.

## Directory Structure

```
ui/
├── design-system/      # Reusable UI components (Button, Panel, Modal, etc.)
├── layouts/            # Layout components (MainLayout, TabLayout, etc.)
├── pages/              # Page-level components (one per tab)
├── features/           # Feature-specific components (testing, canvas, etc.)
├── store/              # Zustand state management stores
├── components/         # Legacy/existing components (kept as-is)
└── TieredSystemDesignBuilderRefactored.tsx  # New main component
```

## Quick Start

### Using the Refactored Component

```tsx
import { TieredSystemDesignBuilder } from './TieredSystemDesignBuilderRefactored';

<TieredSystemDesignBuilder challengeId="tiny_url" />
```

### Accessing State

```tsx
import { useBuilderStore, useCanvasStore, useCodeStore } from './store';

function MyComponent() {
  const { selectedChallenge } = useBuilderStore();
  const { systemGraph } = useCanvasStore();
  const { pythonCode } = useCodeStore();
  
  return <div>{selectedChallenge?.title}</div>;
}
```

### Using Design System

```tsx
import { Button, Panel, Tabs } from './design-system';

<Panel padding="md" shadow>
  <Button variant="primary">Click Me</Button>
</Panel>
```

## Documentation

- **Refactoring Summary**: `/docs/REFACTORING_SUMMARY.md`
- **Figma Structure**: `/docs/FIGMA_STRUCTURE.md`
- **Component Mapping**: `/docs/FIGMA_CODE_MAPPING.md`
- **Original Plan**: `/refactor.plan.md`

## Architecture Principles

1. **Separation of Concerns**: Each component has a single responsibility
2. **State Management**: Centralized in Zustand stores, not prop drilling
3. **Design System**: Reusable components with consistent styling
4. **Figma Mapping**: 1:1 relationship between Figma frames and React components
5. **Modularity**: Small, focused files (~100-300 lines each)

## File Size Targets

- Page components: 200-400 lines
- Feature components: 100-300 lines
- Design system components: 50-150 lines
- Store files: 50-100 lines

## Key Benefits

- ✅ Easier to style with Figma (1:1 mapping)
- ✅ Easier to maintain (smaller, focused files)
- ✅ Easier to test (isolated components)
- ✅ Easier to extend (clear patterns)
- ✅ Better performance (code splitting ready)

## Migration Status

- ✅ Infrastructure: Complete
- ✅ Design System: Complete
- ✅ Layouts: Complete
- ✅ Pages: Complete
- ✅ State Management: Complete
- ✅ Integration: Complete
- ✅ Documentation: Complete
- ⏳ Testing: Pending
- ⏳ Production Migration: Pending

## Support

For questions or issues:
1. Check documentation in `/docs/`
2. Review component examples in this directory
3. See `REFACTORING_SUMMARY.md` for detailed guide

