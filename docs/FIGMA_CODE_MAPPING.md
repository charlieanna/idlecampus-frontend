# Figma → Code Component Mapping

This document provides a complete mapping between Figma frames/components and React components.

## Quick Reference

| Figma Frame/Component | React Component | File Path |
|----------------------|-----------------|-----------|
| **Design System** | | |
| Button | `<Button>` | `ui/design-system/Button.tsx` |
| Panel | `<Panel>` | `ui/design-system/Panel.tsx` |
| Tabs | `<Tabs>` | `ui/design-system/Tabs.tsx` |
| Modal | `<Modal>` | `ui/design-system/Modal.tsx` |
| Toolbar | `<Toolbar>` | `ui/design-system/Toolbar.tsx` |
| **Layouts** | | |
| MainLayout | `<MainLayout>` | `ui/layouts/MainLayout.tsx` |
| TabLayout | `<TabLayout>` | `ui/layouts/TabLayout.tsx` |
| SplitPaneLayout | `<SplitPaneLayout>` | `ui/layouts/SplitPaneLayout.tsx` |
| PanelLayout | `<PanelLayout>` | `ui/layouts/PanelLayout.tsx` |
| **Pages** | | |
| CanvasPage | `<CanvasPage>` | `ui/pages/CanvasPage.tsx` |
| PythonCodePage | `<PythonCodePage>` | `ui/pages/PythonCodePage.tsx` |
| AppServerPage | `<AppServerPage>` | `ui/pages/AppServerPage.tsx` |
| LoadBalancerPage | `<LoadBalancerPage>` | `ui/pages/LoadBalancerPage.tsx` |
| LessonsPage | `<LessonsPage>` | `ui/pages/LessonsPage.tsx` |
| APIsPage | `<APIsPage>` | `ui/pages/APIsPage.tsx` |
| **Features** | | |
| TestControls | `<TestControls>` | `ui/features/testing/TestControls.tsx` |
| TestResults | `<TestResults>` | `ui/features/testing/TestResults.tsx` |

## Detailed Mapping

### Design System Components

#### Button

**Figma**: `Button` component with variants
- variant: primary, secondary, outline, ghost, danger
- size: sm, md, lg
- state: default, hover, active, disabled

**React**: `<Button>`
```tsx
<Button
  variant="primary"
  size="md"
  disabled={false}
  loading={false}
  leftIcon={icon}
  rightIcon={icon}
>
  Label
</Button>
```

**Props Mapping**:
- Figma `variant` → React `variant`
- Figma `size` → React `size`
- Figma `state=disabled` → React `disabled={true}`
- Figma loading indicator → React `loading={true}`

---

#### Panel

**Figma**: `Panel` component
- padding: none, sm, md, lg
- shadow: true/false
- border: true/false

**React**: `<Panel>`
```tsx
<Panel
  padding="md"
  shadow={true}
  border={true}
  className=""
>
  Content
</Panel>
```

---

#### Tabs

**Figma**: `Tabs` component with tab items

**React**: `<Tabs>`
```tsx
<Tabs
  tabs={[
    { id: 'tab1', label: 'Tab 1', icon: '🎨' },
    { id: 'tab2', label: 'Tab 2' }
  ]}
  activeTab="tab1"
  onChange={(tabId) => {}}
/>
```

---

#### Modal

**Figma**: `Modal` component
- size: sm, md, lg, xl, full
- with header, body, footer sections

**React**: `<Modal>`
```tsx
<Modal
  isOpen={true}
  onClose={() => {}}
  title="Modal Title"
  size="md"
  footer={<Button>Action</Button>}
>
  Modal content
</Modal>
```

---

#### Toolbar

**Figma**: `Toolbar` component with groups

**React**: `<Toolbar>`
```tsx
<Toolbar position="top">
  <ToolbarGroup>
    <Button size="sm">Action 1</Button>
    <Button size="sm">Action 2</Button>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarGroup>
    <Button size="sm">Action 3</Button>
  </ToolbarGroup>
</Toolbar>
```

---

### Layout Components

#### MainLayout

**Figma**: Full-page frame with header, main content, optional footer

**Structure**:
```
MainLayout Frame
├── Header (optional, fixed height)
├── Main Content (flex-1)
└── Footer (optional, fixed height)
```

**React**: `<MainLayout>`
```tsx
<MainLayout
  header={<Header />}
  footer={<Footer />}
>
  <PageContent />
</MainLayout>
```

---

#### TabLayout

**Figma**: Frame with tab navigation and content area

**Structure**:
```
TabLayout Frame
├── TabNavigation (fixed height)
├── Toolbar (optional, fixed height)
└── TabContent (flex-1)
```

**React**: `<TabLayout>`
```tsx
<TabLayout
  tabs={tabsArray}
  activeTab="tab1"
  onTabChange={(tab) => {}}
  toolbar={<Toolbar />}
>
  <TabContent />
</TabLayout>
```

---

#### SplitPaneLayout

**Figma**: Two-column frame with resizer

**Structure**:
```
SplitPaneLayout Frame
├── LeftPane (fixed width, resizable)
├── Resizer (1px)
└── RightPane (flex-1)
```

**React**: `<SplitPaneLayout>`
```tsx
<SplitPaneLayout
  left={<LeftContent />}
  right={<RightContent />}
  defaultLeftWidth={384}
  minLeftWidth={256}
  maxLeftWidth={640}
/>
```

---

### Page Components

#### CanvasPage

**Figma Frame Structure**:
```
CanvasPage
├── LeftPanel (w-96)
│   └── ProblemDescriptionPanel OR SubmissionResultsPanel
├── CenterPanel (flex-1)
│   ├── DesignCanvas
│   ├── CollapseButton (absolute top-right)
│   └── HelpButton (absolute bottom-right)
└── RightPanel (w-80)
    ├── ComponentPalette (flex-1)
    └── SubmitButton (fixed bottom)
```

**React Component**:
```tsx
<CanvasPage
  challenge={challenge}
  onAddComponent={(type) => {}}
  onUpdateConfig={(id, config) => {}}
  onSubmit={() => {}}
  onLoadSolution={() => {}}
/>
```

**Layout Mapping**:
- Figma `LeftPanel` → `ProblemDescriptionPanel` or `SubmissionResultsPanel`
- Figma `CenterPanel` → `DesignCanvas` with ReactFlow
- Figma `RightPanel` → `ComponentPalette` + Submit button

---

#### PythonCodePage

**Figma Frame Structure**:
```
PythonCodePage
├── LeftPanel (40% width)
│   ├── ProblemTitle
│   ├── ProblemDescription
│   ├── Requirements
│   └── Hints
└── RightPanel (60% width)
    ├── EditorHeader
    │   ├── Title
    │   └── SubmitButton
    └── MonacoEditor (flex-1)
```

**React Component**:
```tsx
<PythonCodePage
  challenge={challenge}
  systemGraph={graph}
  onRunTests={() => {}}
  onSubmit={() => {}}
  isTinyUrl={false}
  isWebCrawler={false}
  hasCodeChallenges={true}
  hasPythonTemplate={true}
/>
```

---

#### AppServerPage / LoadBalancerPage

**Figma Frame Structure**:
```
ConfigPage
└── ConfigPanel (full width)
    ├── Title
    ├── ConfigForm
    └── SaveButton
```

**React Components**:
```tsx
<AppServerPage
  systemGraph={graph}
  onUpdateConfig={(id, config) => {}}
/>

<LoadBalancerPage
  systemGraph={graph}
  onUpdateConfig={(id, config) => {}}
/>
```

---

#### LessonsPage

**Figma Frame Structure**:
```
LessonsPage
└── LessonHub OR LessonViewer
    ├── LessonList (if hub)
    └── LessonContent (if viewing)
```

**React Component**:
```tsx
<LessonsPage />
// Uses internal state to show hub or viewer
```

---

#### APIsPage

**Figma Frame Structure**:
```
APIsPage
└── APIsReference
    ├── APIsList
    └── APIDetails
```

**React Component**:
```tsx
<APIsPage />
```

---

### Feature Components

#### TestControls

**Figma Component**:
```
TestControls
├── RunTestsButton
└── SubmitButton
```

**React Component**:
```tsx
<TestControls
  onRunTests={() => {}}
  onSubmit={() => {}}
  showRun={true}
  showSubmit={true}
/>
```

---

#### TestResults

**Figma Component**:
```
TestResults
├── Summary (passed/total)
└── TestList
    └── TestItem (passed/failed status)
```

**React Component**:
```tsx
<TestResults
  testResults={resultsMap}
  currentTestIndex={0}
/>
```

---

## Design Token Mapping

### Colors

| Figma Variable | CSS/Tailwind | tokens.ts |
|---------------|--------------|-----------|
| `primary/600` | `bg-blue-600` | `colors.primary[600]` |
| `gray/200` | `bg-gray-200` | `colors.gray[200]` |
| `success/500` | `bg-green-500` | `colors.success[500]` |
| `error/600` | `bg-red-600` | `colors.error[600]` |

### Spacing

| Figma Variable | CSS/Tailwind | tokens.ts |
|---------------|--------------|-----------|
| `spacing/2` | `p-2` (8px) | `spacing[2]` |
| `spacing/4` | `p-4` (16px) | `spacing[4]` |
| `spacing/6` | `p-6` (24px) | `spacing[6]` |

### Typography

| Figma Style | CSS/Tailwind | tokens.ts |
|------------|--------------|-----------|
| `text/sm` | `text-sm` (14px) | `typography.fontSize.sm` |
| `text/base` | `text-base` (16px) | `typography.fontSize.base` |
| `text/xl` | `text-xl` (20px) | `typography.fontSize.xl` |

### Border Radius

| Figma Variable | CSS/Tailwind | tokens.ts |
|---------------|--------------|-----------|
| `radius/base` | `rounded` (4px) | `borderRadius.base` |
| `radius/lg` | `rounded-lg` (8px) | `borderRadius.lg` |
| `radius/full` | `rounded-full` | `borderRadius.full` |

### Shadows

| Figma Effect | CSS/Tailwind | tokens.ts |
|-------------|--------------|-----------|
| `shadow/sm` | `shadow-sm` | `shadows.sm` |
| `shadow/md` | `shadow-md` | `shadows.md` |
| `shadow/lg` | `shadow-lg` | `shadows.lg` |

---

## State Management Mapping

### Figma Interactive States

| Figma State | React State | Store |
|------------|-------------|-------|
| Selected challenge | `selectedChallenge` | `useBuilderStore` |
| Active tab | `activeTab` | `useUIStore` |
| Canvas nodes | `systemGraph` | `useCanvasStore` |
| Python code | `pythonCode` | `useCodeStore` |
| Test results | `testResults` | `useTestStore` |
| Running state | `isRunning` | `useTestStore` |

---

## Implementation Workflow

### 1. Design in Figma

1. Create frame/component in Figma
2. Apply design tokens (colors, spacing, typography)
3. Set up variants for different states
4. Document props in component description

### 2. Build in React

1. Create React component file
2. Import from design system (`Button`, `Panel`, etc.)
3. Use design tokens from `tokens.ts`
4. Apply Tailwind classes matching Figma values
5. Connect to appropriate store

### 3. Verify Match

1. Compare side-by-side (Figma vs Browser)
2. Check spacing (use browser DevTools)
3. Verify colors match exactly
4. Test all interactive states
5. Ensure responsive behavior

### 4. Document

1. Update this mapping document
2. Add examples to Storybook (if using)
3. Take screenshots for reference
4. Update design system changelog

---

## Quick Commands

### Find Component

**In Figma**: 
- Press `/` to search
- Type component name
- Jump to definition

**In Code**:
```bash
# Find component file
find src -name "ComponentName.tsx"

# Search for usage
grep -r "ComponentName" src/
```

### Update Design Token

**In Figma**:
1. Open variables panel
2. Find variable (e.g., `primary/600`)
3. Update value
4. Publish library

**In Code**:
```bash
# Edit tokens file
vim src/apps/system-design/builder/ui/design-system/tokens.ts

# Search for usage
grep -r "primary\[600\]" src/
```

---

## Troubleshooting

### Component looks different than Figma

1. **Check spacing**: Use browser DevTools → Computed tab
2. **Check colors**: Inspect element, compare hex values
3. **Check fonts**: Verify font-family and font-size
4. **Check shadows**: Inspect box-shadow property

### Auto Layout not working

1. **In Figma**: Ensure Auto Layout is enabled
2. **In React**: Check flex/grid container styles
3. **Verify**: Parent has proper display property

### State not syncing

1. **Check store**: Verify correct store is imported
2. **Check selector**: Ensure state path is correct
3. **Debug**: Add console.log in store hooks

---

## Resources

- **Figma File**: [Link to Figma file]
- **Component Library**: `src/apps/system-design/builder/ui/design-system/`
- **Design Tokens**: `src/apps/system-design/builder/ui/design-system/tokens.ts`
- **Store Files**: `src/apps/system-design/builder/ui/store/`
- **Pages**: `src/apps/system-design/builder/ui/pages/`

---

## Changelog

- **2024-01-XX**: Initial refactor complete
  - Created modular component architecture
  - Set up Zustand state management
  - Established Figma → Code mapping
  - Documented all components

