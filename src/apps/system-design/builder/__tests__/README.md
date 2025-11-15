# Test Suite Documentation

## Overview
Comprehensive test suite for the TinyURL System Design Builder with Python-to-Canvas connection validation.

## Test Files

### 1. **connectionValidator.test.ts** (Unit Tests)
Tests the core validation logic for Python API usage and canvas connections.

**Coverage:**
- `detectAPIUsage()` - 60 test cases
- `getConnectedComponents()` - 20 test cases
- `componentTypesToAPIs()` - 25 test cases
- `validateConnections()` - 35 test cases
- `formatValidationErrors()` - 10 test cases
- Edge cases - 30 test cases

**Total: ~180 test cases**

### 2. **APIConnectionStatus.test.tsx** (Component Tests)
Tests the visual API connection status display component.

**Coverage:**
- Basic rendering states
- Connected/disconnected status display
- Multiple APIs handling
- Icon display
- Styling verification
- Real-time updates
- Edge cases

**Total: ~40 test cases**

### 3. **TieredSystemDesignBuilder.test.tsx** (Integration Tests)
Tests the main builder component and user interactions.

**Coverage:**
- Initial page load (Scenario 1)
- Python tab viewing (Scenario 2)
- Code writing and API detection (Scenario 3)
- Submission validation (Scenario 6, 9)
- Tab navigation
- Multiple challenge support
- State persistence
- Edge cases

**Total: ~50 test cases**

### 4. **userFlows.test.tsx** (End-to-End User Flows)
Tests complete user workflows from start to finish.

**User Flows Tested:**
1. **Beginner Flow** - Simple database-only solution
2. **Intermediate Flow** - Adding caching layer
3. **Advanced Flow** - Full architecture with analytics
4. **Error Recovery Flow** - Fixing missing connections
5. **Iterative Development Flow** - Incremental changes
6. **Code Comments Flow** - API detection in comments
7. **Empty to Complete Flow** - Full implementation journey
8. **Tab Switching Flow** - Context maintenance
9. **Multiple Submissions Flow** - Retry attempts
10. **Discovery Learning Flow** - Learning API-component relationship

**Edge Flows:**
- Rapid code changes
- Delete all code
- Large code paste
- Typos in API names
- Special characters

**Total: ~35 test cases**

### 5. **edgeCases.test.tsx** (Edge Cases & Error Handling)
Tests boundary conditions, error states, and unusual inputs.

**Coverage:**
- **Malformed Python Code** - Syntax errors, unclosed strings, bad indentation
- **Extreme Input Sizes** - Very long lines, many repeated calls, deep nesting
- **Special Characters** - Chinese, emojis, RTL text, control characters
- **Null/Undefined Handling** - All functions handle null gracefully
- **Edge Case API Patterns** - Chained calls, lambdas, list comprehensions
- **Unusual Graph Structures** - Empty, circular, self-referencing
- **Component Type Edge Cases** - Unknown types, case sensitivity
- **Connection Direction** - Incoming vs outgoing, bidirectional
- **Error Message Formatting** - Long messages, special characters
- **UI Component Behavior** - Missing data, rapid interactions
- **Browser Edge Cases** - Resize, navigation

**Total: ~70 test cases**

---

## Total Test Coverage

| Category | Test Files | Test Cases | Coverage |
|----------|-----------|------------|----------|
| Unit Tests | 1 | ~180 | Core validation logic |
| Component Tests | 1 | ~40 | UI components |
| Integration Tests | 1 | ~50 | Component interactions |
| User Flow Tests | 1 | ~35 | End-to-end scenarios |
| Edge Case Tests | 1 | ~70 | Boundary conditions |
| **TOTAL** | **5** | **~375** | **Comprehensive** |

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test connectionValidator.test.ts
npm test APIConnectionStatus.test.tsx
npm test TieredSystemDesignBuilder.test.tsx
npm test userFlows.test.tsx
npm test edgeCases.test.tsx
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

---

## Test Scenarios Mapped to User Stories

### Scenario 1: Initial Page Load ✅
- **Tests:** TieredSystemDesignBuilder.test.tsx (describe: "Scenario 1")
- **Coverage:** Page loads, tabs visible, components initialized

### Scenario 2: View Python Template ✅
- **Tests:** TieredSystemDesignBuilder.test.tsx (describe: "Scenario 2")
- **Coverage:** Python tab switch, template display, API status

### Scenario 3: Write Code Using context.db ✅
- **Tests:** TieredSystemDesignBuilder.test.tsx (describe: "Scenario 3")
- **Tests:** userFlows.test.tsx (Flow 1)
- **Coverage:** API detection, connection status updates

### Scenario 4: Add Database Component ⚠️
- **Coverage:** Canvas operations (requires React Flow testing)
- **Status:** Partially covered by integration tests

### Scenario 5: Connect App Server to Database ⚠️
- **Coverage:** Canvas connections (requires React Flow testing)
- **Status:** Partially covered by integration tests

### Scenario 6: Submit with Missing Connections ✅
- **Tests:** TieredSystemDesignBuilder.test.tsx (describe: "Scenario 6")
- **Tests:** userFlows.test.tsx (Flow 4)
- **Coverage:** Validation blocking, error alerts, clear messages

### Scenario 7: Multiple APIs Detection ✅
- **Tests:** connectionValidator.test.ts
- **Tests:** APIConnectionStatus.test.tsx
- **Coverage:** Multiple API usage, mixed connection status

### Scenario 8: Add Cache and Connect ⚠️
- **Coverage:** Canvas operations (requires React Flow testing)
- **Tests:** userFlows.test.tsx (Flow 2)

### Scenario 9: Valid Submission ✅
- **Tests:** TieredSystemDesignBuilder.test.tsx (describe: "Scenario 9")
- **Coverage:** Successful validation, test execution start

### Scenario 10: Complex Architecture ✅
- **Tests:** userFlows.test.tsx (Flow 3)
- **Coverage:** Queue + CDN + Database + Cache

### Scenario 11: Delete Component That's in Use ⚠️
- **Coverage:** Canvas operations (requires React Flow testing)
- **Status:** Validation logic covered

### Scenario 12: Tab Navigation Between Components ✅
- **Tests:** TieredSystemDesignBuilder.test.tsx (describe: "Tab Navigation")
- **Coverage:** Tab switching, state persistence

### Scenario 13: Collapse Canvas ⚠️
- **Coverage:** Canvas UI interactions
- **Status:** Requires canvas-specific tests

### Scenario 14: Empty Python Code ✅
- **Tests:** userFlows.test.tsx (Edge Flow 2)
- **Coverage:** Empty code handling, no API detection

### Scenario 15: Invalid Python Syntax ✅
- **Tests:** edgeCases.test.tsx (describe: "Malformed Python Code")
- **Coverage:** Syntax errors, unclosed strings, bad indentation

### Scenario 16: Back to All Problems ✅
- **Tests:** TieredSystemDesignBuilder.test.tsx (describe: "Scenario 16")
- **Coverage:** Navigation button present

---

## Additional Scenarios Covered

### Error Handling ✅
- Null/undefined inputs
- Malformed code
- Missing challenge data
- Unknown component types
- Invalid connections

### Performance ✅
- Very long code (100k+ chars)
- Many API calls (10k+ repetitions)
- Deeply nested code (1000+ levels)
- Rapid user interactions

### Internationalization ✅
- Chinese characters
- Hebrew (RTL text)
- Emojis
- Special characters
- Unicode handling

### User Experience ✅
- Iterative development
- Error recovery
- Discovery learning
- State persistence
- Multiple submissions

---

## Coverage Goals

| Component | Target | Current |
|-----------|--------|---------|
| connectionValidator.ts | 100% | ~95% |
| APIConnectionStatus.tsx | 90% | ~85% |
| TieredSystemDesignBuilder.tsx | 80% | ~70% |
| User Flows | 100% | 100% |
| Edge Cases | 90% | ~90% |

---

## Known Limitations

1. **Canvas Interactions** - React Flow interactions (drag, connect) require additional testing setup
2. **Monaco Editor** - Limited to textarea mock in tests
3. **Network Requests** - Python execution not tested (requires backend mock)
4. **Browser APIs** - Some browser-specific APIs mocked

---

## Future Test Additions

1. **Visual Regression Tests** - Screenshot comparison
2. **Performance Tests** - Load time, render time benchmarks
3. **Accessibility Tests** - ARIA labels, keyboard navigation
4. **E2E Tests** - Playwright/Cypress full browser tests
5. **Canvas Component Tests** - React Flow node/edge manipulation
6. **Python Execution Tests** - Mock backend for code execution

---

## Test Maintenance

### When to Update Tests

1. **New API Type Added** - Update connectionValidator.test.ts
2. **New Component Type** - Update validation tests
3. **UI Changes** - Update component tests
4. **New User Flow** - Add to userFlows.test.tsx
5. **Bug Found** - Add regression test to edgeCases.test.tsx

### Test Quality Checklist

- [ ] Tests are independent (no shared state)
- [ ] Tests have clear descriptions
- [ ] Edge cases are covered
- [ ] Error messages are tested
- [ ] Async operations use waitFor()
- [ ] Mocks are properly cleaned up
- [ ] Tests run in isolation

---

## CI/CD Integration

### Pre-commit Hooks
```bash
npm test -- --run
```

### GitHub Actions
```yaml
- name: Run tests
  run: npm test -- --run --coverage
```

### Coverage Requirements
- Minimum: 80% overall
- Critical files: 90%+

---

## Debugging Tests

### Run Single Test
```bash
npm test -- -t "should detect single API usage"
```

### Debug Mode
```bash
npm test -- --inspect-brk
```

### Verbose Output
```bash
npm test -- --verbose
```

---

## Contributing

When adding new features:

1. Write tests first (TDD)
2. Ensure all tests pass
3. Maintain coverage above 80%
4. Update this README with new scenarios
5. Add edge case tests for boundary conditions
