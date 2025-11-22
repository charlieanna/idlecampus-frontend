# Figma Design System Structure

This document outlines the Figma file structure that maps directly to the React component architecture.

## Figma File Organization

```
📁 System Design Builder - Design System
├── 📄 00 - Design Tokens
│   ├── Colors (Primary, Gray, Status)
│   ├── Typography (Font sizes, weights, families)
│   ├── Spacing (0-24 scale)
│   ├── Border Radius
│   └── Shadows
│
├── 📄 01 - Components
│   ├── Button (all variants: primary, secondary, outline, ghost, danger)
│   ├── Panel
│   ├── Tabs
│   ├── Modal
│   ├── Toolbar (with ToolbarGroup, ToolbarSeparator)
│   └── [All design system components]
│
├── 📄 02 - Layouts
│   ├── MainLayout
│   ├── TabLayout
│   ├── SplitPaneLayout
│   ├── VerticalSplitPaneLayout
│   └── PanelLayout
│
├── 📄 03 - Pages
│   ├── CanvasPage
│   ├── PythonCodePage
│   ├── AppServerPage
│   ├── LoadBalancerPage
│   ├── LessonsPage
│   └── APIsPage
│
└── 📄 04 - Features
    ├── Testing (TestControls, TestResults)
    ├── Canvas (CanvasView, CanvasToolbar)
    ├── Code Editor (CodeEditor, CodeToolbar)
    └── Inspector (Inspector, InspectorPanel)
```

## Design Tokens in Figma

### Setting up Variables

1. **Colors**
   - Create color variables matching `tokens.ts`:
     - `primary/50` through `primary/900`
     - `gray/50` through `gray/900`
     - `success/50`, `success/500`, `success/600`, `success/700`
     - Similar for `warning`, `error`, `info`

2. **Spacing**
   - Create number variables:
     - `spacing/0` = 0
     - `spacing/1` = 4
     - `spacing/2` = 8
     - ... up to `spacing/24` = 96

3. **Typography**
   - Create text styles:
     - `text/xs` (12px)
     - `text/sm` (14px)
     - `text/base` (16px)
     - ... up to `text/4xl` (36px)
   - Include weight variants (normal, medium, semibold, bold)

4. **Border Radius**
   - Create number variables:
     - `radius/none` = 0
     - `radius/sm` = 2
     - `radius/base` = 4
     - ... up to `radius/2xl` = 16

5. **Shadows**
   - Create effect styles:
     - `shadow/sm`
     - `shadow/base`
     - `shadow/md`
     - `shadow/lg`
     - `shadow/xl`

## Component Structure

### Design System Components

Each component in Figma should have:

1. **Main Component** (in 01 - Components page)
2. **Variants** for different states/sizes
3. **Auto Layout** enabled
4. **Variables** applied from design tokens

#### Example: Button Component

```
Component: Button
├── Variant: variant=primary, size=md, state=default
├── Variant: variant=primary, size=md, state=hover
├── Variant: variant=primary, size=md, state=disabled
├── Variant: variant=secondary, size=md, state=default
├── ... (all combinations)
```

Properties:
- variant: primary | secondary | outline | ghost | danger
- size: sm | md | lg
- state: default | hover | active | disabled

#### Example: Panel Component

```
Component: Panel
├── Variant: padding=none
├── Variant: padding=sm
├── Variant: padding=md
├── Variant: padding=lg
```

Properties:
- padding: none | sm | md | lg
- shadow: boolean
- border: boolean

### Layout Components

Create as **Auto Layout** frames with specific configurations:

#### MainLayout
- Direction: Vertical
- Items: header (optional), main (flex), footer (optional)
- Main fills parent height

#### TabLayout
- Direction: Vertical  
- Items: tabs (fixed), toolbar (optional, fixed), content (flex)

#### SplitPaneLayout
- Direction: Horizontal
- Items: left pane (fixed width), resizer (1px), right pane (flex)

### Page Components

Each page should be designed as a complete frame showing the full layout:

#### CanvasPage Frame Structure
```
CanvasPage
├── LeftPanel (ProblemDescription OR SubmissionResults)
├── CenterPanel (Canvas with collapse functionality)
│   ├── DesignCanvas
│   ├── CollapseButton (overlay)
│   └── HelpButton (overlay)
└── RightPanel (ComponentPalette + SubmitButton)
```

#### PythonCodePage Frame Structure
```
PythonCodePage
├── LeftPanel (Problem Statement - 40%)
└── RightPanel (Code Editor - 60%)
    ├── EditorHeader (with Submit button)
    └── MonacoEditor
```

## Applying Design Tokens

### In Figma

1. **Colors**: Use color variables for all fills, strokes
   - Button background: `primary/600`
   - Text: `gray/900`, `gray/700`, `gray/500`
   - Borders: `gray/200`, `gray/300`

2. **Spacing**: Use spacing variables for:
   - Padding: `spacing/4`, `spacing/6`
   - Gap between items: `spacing/2`, `spacing/3`
   - Margins: Auto layout spacing

3. **Typography**: Apply text styles
   - Headings: `text/2xl` with `weight/bold`
   - Body: `text/base` with `weight/normal`
   - Small text: `text/sm` with `weight/medium`

4. **Border Radius**: Use radius variables
   - Buttons: `radius/lg` (8px)
   - Panels: `radius/lg` (8px)
   - Modals: `radius/xl` (12px)

5. **Shadows**: Apply effect styles
   - Panels: `shadow/md`
   - Modals: `shadow/xl`
   - Buttons: `shadow/sm` on hover

### Syncing with Code

When a design token changes:

1. **Update in Figma**: Change the variable/style value
2. **Update in Code**: Update `tokens.ts` to match
3. **Update Tailwind**: If using custom values, update `tailwind.config.js`

## Component Props Mapping

| Figma Property | React Prop | Type |
|---------------|------------|------|
| variant | variant | 'primary' \| 'secondary' \| ... |
| size | size | 'sm' \| 'md' \| 'lg' |
| state | disabled | boolean |
| padding | padding | 'none' \| 'sm' \| 'md' \| 'lg' |
| shadow | shadow | boolean |
| border | border | boolean |

## Best Practices

1. **Naming Convention**
   - Use same names in Figma and code
   - Component: `Button` (Figma) → `Button.tsx` (code)
   - Page: `CanvasPage` (Figma) → `CanvasPage.tsx` (code)

2. **Variants**
   - Create variants for all interactive states
   - Use boolean properties for toggles (shadow, border)
   - Use string properties for categories (variant, size)

3. **Auto Layout**
   - Enable on all container components
   - Set proper resizing rules
   - Use constraints appropriately

4. **Documentation**
   - Add descriptions to components
   - Document prop values in component description
   - Link to code file in description

5. **Handoff**
   - Use Figma Dev Mode for developer handoff
   - Inspect panel shows all applied variables
   - CSS/Tailwind code can be copied directly

## Workflow

### Designer → Developer

1. Designer creates/updates component in Figma
2. Designer publishes library update
3. Developer receives notification
4. Developer updates React component to match
5. Developer verifies implementation matches design

### Developer → Designer

1. Developer creates new component in code
2. Developer documents props and variants
3. Designer creates matching Figma component
4. Designer adds to component library
5. Team reviews for consistency

## Tools & Plugins

Recommended Figma plugins:

1. **Figma to Code**: Generate React/HTML from designs
2. **Design Lint**: Ensure consistency in spacing, colors
3. **Contrast**: Check color accessibility
4. **Auto Layout**: Better auto layout management
5. **Token Studio**: Advanced design tokens management

## Maintenance

Regular tasks:

1. **Weekly**: Review new components, ensure Figma/code parity
2. **Monthly**: Audit design tokens, remove unused values
3. **Quarterly**: Major version update, breaking changes if needed
4. **Yearly**: Complete design system refresh

## Resources

- Design Tokens: `src/apps/system-design/builder/ui/design-system/tokens.ts`
- Components: `src/apps/system-design/builder/ui/design-system/`
- Layouts: `src/apps/system-design/builder/ui/layouts/`
- Pages: `src/apps/system-design/builder/ui/pages/`

