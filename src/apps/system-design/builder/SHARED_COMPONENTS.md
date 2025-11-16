# Shared Component Interfaces

This document defines the standard interfaces for shared components used across both the legacy challenge system (`SystemDesignBuilderApp`) and the tiered challenge system (`TieredSystemDesignBuilder`).

**Critical**: When adding new challenges or creating new challenge builders, ALWAYS use these exact prop signatures to ensure compatibility and prevent runtime errors.

---

## Core Shared Components

### 1. DesignCanvas

**Purpose**: React Flow canvas for designing system architecture

**Required Props**:
```typescript
interface DesignCanvasProps {
  systemGraph: SystemGraph;                                  // { components, connections }
  onSystemGraphChange: (graph: SystemGraph) => void;        // Update handler
  selectedNode: Node | null;                                 // Currently selected node
  onNodeSelect: (node: Node | null) => void;                // Selection handler
  onAddComponent: (componentType: string) => void;          // Add component handler
  onUpdateConfig: (nodeId: string, config: Record<string, any>) => void;  // Config update handler
}
```

**Correct Usage**:
```typescript
<DesignCanvas
  systemGraph={{ components, connections }}
  onSystemGraphChange={(graph) => {
    setComponents(graph.components);
    setConnections(graph.connections);
  }}
  selectedNode={selectedNode}
  onNodeSelect={setSelectedNode}
  onAddComponent={handleAddComponent}
  onUpdateConfig={handleUpdateConfig}
/>
```

**Common Mistakes**:
❌ Passing `components` and `connections` separately
❌ Missing `onUpdateConfig` handler
❌ Forgetting to wrap in `<ReactFlowProvider>`

---

### 2. ResultsPanel

**Purpose**: Display test results with metrics and visualizations

**Required Props**:
```typescript
interface ResultsPanelProps {
  results: TestResult[];          // Array of test results
  challenge: Challenge | null;    // Challenge with testCases for names/criteria
  onClose: () => void;             // Close handler
}
```

**Correct Usage**:
```typescript
<ResultsPanel
  results={testResults}
  challenge={selectedChallenge}  // TieredChallenge extends Challenge ✓
  onClose={() => setActiveView('design')}
/>
```

**Common Mistakes**:
❌ Passing `testCases` directly instead of `challenge`
❌ Missing `onClose` handler
❌ Passing wrong challenge type (must implement Challenge interface)

---

### 3. PythonCodeChallengePanel

**Purpose**: Code editor for Tier 1 challenges with integrated testing

**Required Props**:
```typescript
interface PythonCodeChallengePanelProps {
  pythonCode: string;
  setPythonCode: (code: string) => void;
  onRunTests: (code: string, testCases: TestCase[]) => Promise<TestResult[]>;
  onSubmit: () => void;
  exampleTestCases?: TestCase[];  // Optional - has defaults
  hiddenTestCases?: TestCase[];   // Optional - has defaults
}
```

**Correct Usage**:
```typescript
<PythonCodeChallengePanel
  pythonCode={pythonCode['app_server.py'] || ''}
  setPythonCode={(code) => setPythonCode(prev => ({...prev, 'app_server.py': code}))}
  onRunTests={handleRunPythonTests}
  onSubmit={() => {}}
  exampleTestCases={selectedChallenge.testCases.slice(0, 3)}
  hiddenTestCases={selectedChallenge.testCases.slice(3)}
/>
```

---

## Required Handler Implementations

### handleAddComponent

Must create component with proper structure:

```typescript
const handleAddComponent = (type: ComponentType) => {
  const newComponent: ComponentNode = {
    id: `${type}_${Date.now()}`,
    type,
    config: {},
  };

  // Optional: Add tier-specific logic
  if (tier === 'simple') {
    newComponent.customLogic = {
      enabled: true,
      pythonFile: 'app_server.py',
      functionName: 'process_request',
    };
  }

  setComponents([...components, newComponent]);
};
```

### handleUpdateConfig

Must preserve existing config and merge new values:

```typescript
const handleUpdateConfig = (nodeId: string, config: Record<string, any>) => {
  setComponents(prev => prev.map(comp =>
    comp.id === nodeId
      ? { ...comp, config: { ...comp.config, ...config } }  // Merge configs
      : comp
  ));
};
```

### handleSystemGraphChange

Must update both components AND connections:

```typescript
const handleSystemGraphChange = useCallback((graph: { components: ComponentNode[]; connections: any[] }) => {
  setComponents(graph.components);
  setConnections(graph.connections);
}, []);
```

---

## Type Compatibility

### Challenge Types Hierarchy

```typescript
Challenge (base interface)
  ├─ TieredChallenge extends Challenge     // ✓ Can be used as Challenge
  └─ Generated challenges                  // ✓ Implement Challenge
```

**Key Point**: `TieredChallenge extends Challenge`, so it can be passed to any component expecting `Challenge`.

### SystemGraph Structure

```typescript
interface SystemGraph {
  components: ComponentNode[];
  connections: Connection[];
}
```

Always pass as a single object, never separately.

---

## Checklist for Adding New Challenge Builders

When creating a new challenge builder component:

- [ ] Import shared components from `./components/`
- [ ] Implement all required handlers (handleAddComponent, handleUpdateConfig, handleSystemGraphChange)
- [ ] Use `systemGraph` object for DesignCanvas (not separate arrays)
- [ ] Pass complete `challenge` object to ResultsPanel (not just testCases)
- [ ] Wrap DesignCanvas in `<ReactFlowProvider>` if not already wrapped
- [ ] Use `useCallback` for handlers to prevent unnecessary re-renders
- [ ] Ensure challenge type extends or implements `Challenge` interface
- [ ] Test with multiple challenges to verify prop compatibility

---

## Migration Guide

### Converting Old Pattern to New Pattern

**Before** (Incorrect):
```typescript
<DesignCanvas
  components={components}
  connections={connections}
  onComponentsChange={setComponents}
  onConnectionsChange={setConnections}
/>
```

**After** (Correct):
```typescript
<DesignCanvas
  systemGraph={{ components, connections }}
  onSystemGraphChange={(graph) => {
    setComponents(graph.components);
    setConnections(graph.connections);
  }}
  selectedNode={null}
  onNodeSelect={setSelectedNode}
  onAddComponent={handleAddComponent}
  onUpdateConfig={handleUpdateConfig}
/>
```

---

## Testing Shared Components

When adding new challenges, test these integration points:

1. **Canvas Rendering**: Components appear on canvas
2. **Component Addition**: Drag & drop or palette click works
3. **Component Selection**: Click selects node properly
4. **Configuration**: EnhancedInspector shows and updates config
5. **Connections**: Can draw edges between components
6. **Results Display**: Test results render with proper test case names
7. **State Persistence**: Changes survive view switching

---

## Further Reading

- Type definitions: `/src/apps/system-design/builder/types/`
- Example implementations:
  - Legacy system: `SystemDesignBuilderApp.tsx`
  - Tiered system: `TieredSystemDesignBuilder.tsx`
- Component source: `/src/apps/system-design/builder/ui/components/`

---

**Last Updated**: 2025-01-14
**Maintainer**: System Design Team
