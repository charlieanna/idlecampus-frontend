## 2024-05-23 - Accessibility Patterns for Tabs
**Learning:** Standard `<button>` elements used as tabs need explicit `role="tab"`, `aria-selected`, and `aria-controls` attributes, along with a `role="tablist"` container.  Missing these makes it difficult for screen reader users to understand the relationship between the controls and the content panels.
**Action:** When implementing tab interfaces, always use the ARIA tab pattern (tablist -> tab -> tabpanel) or a component library that handles this automatically. Ensure `aria-labelledby` on panels points back to the tab trigger.
