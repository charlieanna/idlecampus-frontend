# Migration Guide: Legacy → Refactored Architecture

This guide helps you migrate from the legacy monolithic component to the new refactored architecture.

## Overview

**From**: `TieredSystemDesignBuilder.tsx` (2,180 lines)  
**To**: `TieredSystemDesignBuilderRefactored.tsx` (380 lines) + modular architecture

## Quick Migration (5 minutes)

### Step 1: Update Import

```tsx
// Before
import { TieredSystemDesignBuilder } from '@/apps/system-design/builder/ui/TieredSystemDesignBuilder';

// After
import { TieredSystemDesignBuilder } from '@/apps/system-design/builder/ui/TieredSystemDesignBuilderRefactored';
```

### Step 2: Test

The API is the same, so existing usage works:

```tsx
// Usage remains unchanged
<TieredSystemDesignBuilder 
  challengeId="tiny_url"
  challenges={tieredChallenges}
/>
```

### Step 3: Verify

- ✅ All tabs load correctly
- ✅ Canvas interactions work
- ✅ Code editor functions
- ✅ Tests run properly
- ✅ State persists correctly

## Detailed Migration

### For Component Usage

No changes needed! The refactored component has the same props interface:

```tsx
interface TieredSystemDesignBuilderProps {
  challengeId?: string;
  challenges?: Challenge[];
}
```

### For State Access

If you were accessing internal state (not recommended), use stores instead:

```tsx
// Before (accessing internal state via refs or props)
const challenge = builderRef.current.selectedChallenge;
const graph = builderRef.current.systemGraph;

// After (using stores)
import { useBuilderStore, useCanvasStore } from './store';

const { selectedChallenge } = useBuilderStore();
const { systemGraph } = useCanvasStore();
```

### For Custom Extensions

If you extended the builder, update to use new architecture:

```tsx
// Before: Extending monolithic component
class CustomBuilder extends TieredSystemDesignBuilder {
  // Custom logic
}

// After: Create custom page/component
import { CanvasPage } from './pages/CanvasPage';

export const CustomCanvasPage = () => {
  // Custom logic
  return <CanvasPage {...props} />;
};
```

## Feature Parity Checklist

### ✅ Core Features
- [x] Challenge selection
- [x] Canvas design (ReactFlow)
- [x] Component palette
- [x] Python code editor
- [x] Test execution
- [x] Validation (connections, schema)
- [x] Results display
- [x] Solution loading

### ✅ Tab Navigation
- [x] Canvas tab
- [x] Python code tab
- [x] App server config tab
- [x] Load balancer config tab
- [x] Lessons tab
- [x] APIs reference tab
- [x] Dynamic component tabs

### ✅ State Management
- [x] Challenge state
- [x] Canvas state (nodes, edges)
- [x] Code state
- [x] Test results state
- [x] UI state (tabs, modals)

### ✅ Interactions
- [x] Add components
- [x] Update configs
- [x] Run tests
- [x] Submit solution
- [x] View solution
- [x] Collapse canvas
- [x] Help modal

### ✅ Special Features
- [x] TinyURL challenge
- [x] Web Crawler challenge
- [x] Generic code challenges
- [x] Multi-server Python code
- [x] Contextual help
- [x] Lessons integration

## Breaking Changes

### None! 🎉

The refactored component is designed to be a drop-in replacement with the same external API.

### Internal Changes (if you were accessing internals)

1. **State is now in stores**
   - Use `useBuilderStore`, `useCanvasStore`, etc.
   - Don't access component state directly

2. **Components are split**
   - Each tab is a separate page component
   - Use stores to share state between components

3. **Styling uses design system**
   - Import from `design-system/` for consistent UI
   - Use design tokens instead of magic values

## Rollback Plan

If you need to rollback:

### Step 1: Revert Import

```tsx
// Change back to legacy
import { TieredSystemDesignBuilder } from '@/apps/system-design/builder/ui/TieredSystemDesignBuilder';
```

### Step 2: Done

That's it! The legacy component remains unchanged and fully functional.

## Gradual Migration Strategy

### Phase 1: Shadow Launch (Week 1)

```tsx
// Use refactored version for specific challenges
const useRefactored = ['tiny_url', 'web_crawler'];

<TieredSystemDesignBuilder
  from={useRefactored.includes(challengeId) 
    ? './TieredSystemDesignBuilderRefactored'
    : './TieredSystemDesignBuilder'
  }
  challengeId={challengeId}
/>
```

### Phase 2: Percentage Rollout (Week 2-3)

```tsx
// Gradually increase percentage
const rolloutPercentage = 50; // Start with 50%
const useRefactored = Math.random() * 100 < rolloutPercentage;

<TieredSystemDesignBuilder
  from={useRefactored
    ? './TieredSystemDesignBuilderRefactored'
    : './TieredSystemDesignBuilder'
  }
  challengeId={challengeId}
/>
```

### Phase 3: Full Migration (Week 4)

```tsx
// Switch everyone to refactored version
import { TieredSystemDesignBuilder } from './TieredSystemDesignBuilderRefactored';
```

### Phase 4: Cleanup (Week 5+)

- Archive legacy component
- Remove unused code
- Update documentation

## Testing Checklist

Before deploying:

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Performance benchmarks met
- [ ] Accessibility verified
- [ ] Cross-browser testing done
- [ ] Mobile responsiveness checked

### Manual Testing Script

1. **Challenge Selection**
   - [ ] Can select challenge from list
   - [ ] Challenge loads correctly
   - [ ] Problem description shows

2. **Canvas Operations**
   - [ ] Can add components
   - [ ] Can remove components
   - [ ] Can connect components
   - [ ] Can update configs
   - [ ] Canvas collapses/expands

3. **Code Editor**
   - [ ] Python code loads
   - [ ] Can edit code
   - [ ] Syntax highlighting works
   - [ ] Monaco editor features work

4. **Testing**
   - [ ] Can run tests
   - [ ] Test results display
   - [ ] Error messages show
   - [ ] Can submit solution

5. **Navigation**
   - [ ] All tabs work
   - [ ] Tab state persists
   - [ ] Can navigate between tabs

6. **Special Features**
   - [ ] Solution loading works
   - [ ] Help modal opens
   - [ ] Lessons integration works
   - [ ] APIs reference displays

## Performance Comparison

### Metrics to Track

1. **Bundle Size**
   - Before: ~XkB
   - After: ~YkB (with code splitting)

2. **Initial Render**
   - Before: ~Xms
   - After: ~Yms

3. **Re-render Performance**
   - Before: ~Xms
   - After: ~Yms (with optimized state)

4. **Memory Usage**
   - Before: ~XMB
   - After: ~YMB

### How to Measure

```bash
# Bundle size
npm run build
npm run analyze

# Performance
# Use Chrome DevTools Performance tab
# Record interaction, analyze flame graph
```

## Troubleshooting

### Issue: Component doesn't render

**Symptoms**: Blank screen or error

**Solutions**:
1. Check console for errors
2. Verify all imports are correct
3. Ensure stores are properly initialized
4. Check that challenge data is valid

### Issue: State not updating

**Symptoms**: Changes don't reflect in UI

**Solutions**:
1. Verify correct store is being used
2. Check state selector is correct
3. Ensure component is subscribed to store
4. Add logging to debug state changes

### Issue: Styling looks wrong

**Symptoms**: Components look different

**Solutions**:
1. Check Tailwind classes are applied
2. Verify design tokens are imported
3. Inspect with browser DevTools
4. Compare with Figma design

### Issue: Performance degradation

**Symptoms**: App feels slow

**Solutions**:
1. Check for unnecessary re-renders (React DevTools)
2. Verify stores aren't over-subscribing
3. Add React.memo where appropriate
4. Profile with Chrome DevTools

## Support

### Getting Help

1. **Documentation**
   - `/docs/REFACTORING_SUMMARY.md`
   - `/docs/FIGMA_CODE_MAPPING.md`
   - `src/apps/system-design/builder/ui/README.md`

2. **Code Examples**
   - Check existing page components
   - Review store implementations
   - Study design system usage

3. **Debugging**
   - Use React DevTools
   - Check Zustand DevTools
   - Add console.log statements

### Reporting Issues

When reporting issues, include:
- [ ] Steps to reproduce
- [ ] Expected vs actual behavior
- [ ] Browser and version
- [ ] Console errors
- [ ] Screenshots/video

## Success Criteria

Migration is successful when:

- ✅ All tests pass
- ✅ No regressions in functionality
- ✅ Performance metrics are equal or better
- ✅ Code maintainability improved
- ✅ Team can work more efficiently
- ✅ Figma → Code workflow is smoother

## Next Steps After Migration

1. **Optimize Performance**
   - Add code splitting
   - Implement lazy loading
   - Optimize re-renders

2. **Improve Testing**
   - Add unit tests
   - Add integration tests
   - Set up E2E tests

3. **Enhance Documentation**
   - Add Storybook
   - Create video tutorials
   - Write best practices guide

4. **Design System Maturity**
   - Add more components
   - Create Figma library
   - Establish design review process

## Conclusion

The refactored architecture provides a solid foundation for:
- **Easier maintenance**: Smaller, focused files
- **Better collaboration**: Clear structure for teams
- **Figma integration**: 1:1 component mapping
- **Future growth**: Scalable architecture

Follow this guide for a smooth migration with minimal risk!

