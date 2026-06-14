# Test Scenarios for React Todo App Fix

## Overview
This document provides comprehensive test scenarios covering the 13 key improvements made in the React Todo App fix. Each scenario includes specific data values and assertions to validate correct behavior.

---

## Test Scenarios

### Happy Path Tests

#### HP-001: Complete Todo Lifecycle
| Field | Value |
|-------|-------|
| **Test Case Name** | HP-001_Complete_Todo_Lifecycle |
| **Description** | Verify a user can create, edit, complete, and delete a todo item with all state operations working correctly |
| **Preconditions** | App is loaded, localStorage is empty |
| **Test Steps** | 1. Enter "Buy groceries" in input field<br>2. Click "Add Todo" button<br>3. Verify todo appears with unique stable ID (e.g., `uuid-xxxx-xxxx`)<br>4. Click checkbox to mark complete<br>5. Verify strikethrough styling applied<br>6. Click delete button<br>7. Verify todo removed from list and localStorage |
| **Expected Results** | - Todo created with deterministic ID format (not Math.random())<br>- State updates use immutable patterns<br>- localStorage syncs correctly<br>- No memory leaks from event listeners |

#### HP-002: Todo Item Component Rendering
| Field | Value |
|-------|-------|
| **Test Case Name** | HP-002_TodoItem_Component_Rendering |
| **Description** | Verify TodoItem functional component renders correctly with all props |
| **Preconditions** | App has at least one todo item |
| **Test Steps** | 1. Load app with existing todo: `{ id: "todo-001", text: "Test todo", completed: false }`<br>2. Inspect rendered TodoItem component<br>3. Verify ARIA labels present: `aria-label="Toggle todo completion"`<br>4. Verify form label: `<label htmlFor="todo-input-{id}">`<br>5. Update todo text to "Updated todo"<br>6. Verify component re-renders with new text |
| **Expected Results** | - Functional component renders same output as class component<br>- Accessibility attributes present<br>- useCallback prevents unnecessary re-renders |

#### HP-003: Theme Toggle Functionality
| Field | Value |
|-------|-------|
| **Test Case Name** | HP-003_Theme_Toggle_Functionality |
| **Description** | Verify theme toggle switches between light and dark modes correctly |
| **Preconditions** | App loads in light theme |
| **Test Steps** | 1. Click theme toggle button<br>2. Verify body receives `data-theme="dark"` attribute<br>3. Verify CSS variables update (background: #1a1a2e, text: #eaeaea)<br>4. Toggle again to light theme<br>5. Verify CSS variables update (background: #ffffff, text: #333333)<br>6. Refresh page and verify theme persists from localStorage |
| **Expected Results** | - Theme state persists in localStorage<br>- Proper implementation without memory leaks<br>- Theme toggle button has accessible label |

#### HP-004: localStorage Persistence
| Field | Value |
|-------|-------|
| **Test Case Name** | HP-004_LocalStorage_Persistence |
| **Description** | Verify todos persist correctly across page reloads |
| **Preconditions** | App has 3 todos saved |
| **Test Steps** | 1. Create todos: "Todo 1", "Todo 2", "Todo 3"<br>2. Mark "Todo 2" as complete<br>3. Verify localStorage key "todos" contains valid JSON<br>4. Refresh page (F5)<br>5. Verify all 3 todos appear with same state<br>6. Verify "Todo 2" shows completed state |
| **Expected Results** | - JSON.parse wrapped in try-catch<br>- Invalid JSON doesn't crash app<br>- State correctly hydrated from localStorage |

#### HP-005: useEffect Cleanup - Interval Timer
| Field | Value |
|-------|-------|
| **Test Case Name** | HP-005_UseEffect_Cleanup_Interval |
| **Description** | Verify interval cleanup prevents memory leaks on unmount |
| **Preconditions** | App has an interval-based feature (auto-save, notifications) |
| **Test Steps** | 1. Load app and trigger interval-starting action<br>2. Navigate away from component or unmount<br>3. Monitor memory usage via DevTools Performance tab<br>4. Return to component and verify no duplicate intervals<br>5. Check for console warnings about unmounted components |
| **Expected Results** | - Interval cleared on unmount (clearInterval called)<br>- No "Can't perform React state update on unmounted component" warnings<br>- Memory stable over multiple mount/unmount cycles |

---

### Edge Case Tests

#### EC-001: Empty Todo Input Handling
| Field | Value |
|-------|-------|
| **Test Case Name** | EC-001_Empty_Todo_Input_Handling |
| **Description** | Verify app handles empty/whitespace-only todo inputs gracefully |
| **Preconditions** | Todo input field empty |
| **Test Steps** | 1. Leave input field empty<br>2. Click "Add Todo" button<br>3. Verify no todo created<br>4. Enter only spaces: "   "<br>5. Click "Add Todo" button<br>6. Verify no todo created (input trimmed) |
| **Expected Results** | - Empty string rejected (input trimmed before validation)<br>- No empty todos appear in list<br>- State remains unchanged |

#### EC-002: Maximum Todo List Length
| Field | Value |
|-------|-------|
| **Test Case Name** | EC-002_Maximum_Todo_List_Length |
| **Description** | Verify app handles large number of todos without performance degradation |
| **Preconditions** | App has no todos |
| **Test Steps** | 1. Create 100 todos rapidly (use script or rapid clicking)<br>2. Verify all todos appear in list<br>3. Mark todos 50-75 as complete<br>4. Delete todos 25-49<br>5. Scroll through list and verify smooth scrolling<br>6. Check React DevTools for render count |
| **Expected Results** | - useMemo/useCallback prevent unnecessary re-renders<br>- List renders without freezing<br>- Delete completes in < 100ms |

#### EC-003: LocalStorage Quota Exceeded
| Field | Value |
|-------|-------|
| **Test Case Name** | EC-003_LocalStorage_Quota_Exceeded |
| **Description** | Verify app handles localStorage quota exceeded gracefully |
| **Preconditions** | localStorage nearly full |
| **Test Steps** | 1. Mock localStorage.setItem to throw QuotaExceededError<br>2. Create a new todo<br>3. Attempt to toggle theme<br>4. Verify error caught and user notified (if error boundary present)<br>5. Verify app remains functional |
| **Expected Results** | - try-catch around localStorage operations<br>- App doesn't crash<br>- User sees fallback behavior or error message |

#### EC-004: Special Characters in Todo Text
| Field | Value |
|-------|-------|
| **Test Case Name** | EC-004_Special_Characters_In_Todo_Text |
| **Description** | Verify todos with special characters render and persist correctly |
| **Preconditions** | App empty |
| **Test Steps** | 1. Create todo with text: `Test <script>alert('xss')</script>`<br>2. Create todo with text: `Task with "quotes" and 'apostrophes'`<br>3. Create todo with text: `Unicode: 你好 🔥 🎉`<br>4. Create todo with text: `HTML: <div>&amp;</div>`<br>5. Persist and reload<br>6. Verify text renders safely (no XSS) |
| **Expected Results** | - Text safely escaped on render<br>- Special characters preserved<br>- No script execution possible |

#### EC-005: Rapid State Updates
| Field | Value |
|-------|-------|
| **Test Case Name** | EC-005_Rapid_State_Updates |
| **Description** | Verify immutable state pattern handles rapid concurrent updates |
| **Preconditions** | App has 5 todos |
| **Test Steps** | 1. Create 10 new todos rapidly within 100ms<br>2. Verify all 15 todos exist (no race conditions)<br>3. Toggle complete on multiple todos simultaneously<br>4. Delete multiple todos rapidly<br>5. Verify final state matches all operations |
| **Expected Results** | - prevTodos pattern prevents state mutations<br>- No todos lost or duplicated<br>- All operations applied in order |

#### EC-006: Null/Undefined localStorage Values
| Field | Value |
|-------|-------|
| **Test Case Name** | EC-006_Null_Undefined_LocalStorage |
| **Description** | Verify app handles corrupted/missing localStorage data |
| **Preconditions** | localStorage has invalid data for "todos" key |
| **Test Steps** | 1. Set localStorage.setItem('todos', 'null')<br>2. Set localStorage.setItem('todos', 'undefined')<br>3. Set localStorage.setItem('todos', '{invalid json}')<br>4. Set localStorage.setItem('todos', null)<br>5. Load app for each case<br>6. Verify app starts with empty todo list |
| **Expected Results** | - JSON.parse wrapped in try-catch<br>- Fallback to empty array on parse failure<br>- No crash on any invalid data |

#### EC-007: useEffect Dependency Array Verification
| Field | Value |
|-------|-------|
| **Test Case Name** | EC-007_UseEffect_Dependency_Array |
| **Description** | Verify effect only runs when dependencies change (no infinite loop) |
| **Preconditions** | Component with useEffect that depends on todo list |
| **Test Steps** | 1. Load app with 3 todos<br>2. Open React DevTools profiler<br>3. Monitor render count baseline (should be ~2-3 renders)<br>4. Add new todo<br>5. Verify effect runs once and stops<br>6. Add another todo, verify effect runs once<br>7. Check for "Maximum update depth exceeded" error |
| **Expected Results** | - No infinite loop (dependency array properly set)<br>- Effect runs only when todos array reference changes<br>- Render count increases minimally |

#### EC-008: Type-Safe Comparisons
| Field | Value |
|-------|-------|
| **Test Case Name** | EC-008_Type_Safe_Comparisons |
| **Description** | Verify == is correctly replaced with === for type-safe comparisons |
| **Preconditions** | Component with type comparison logic |
| **Test Steps** | 1. Create todo with ID type: string "123"<br>2. Compare with number 123 using strict equality<br>3. Verify comparison returns false (not true like with ==)<br>4. Compare identical types and verify correct behavior |
| **Expected Results** | - === used for all comparisons<br>- String "123" !== Number 123<br>- No implicit type coercion bugs |

---

### Negative Tests

#### NT-001: Invalid Todo ID Format
| Field | Value |
|-------|-------|
| **Test Case Name** | NT-001_Invalid_Todo_ID_Format |
| **Description** | Verify app handles invalid or duplicate todo IDs gracefully |
| **Preconditions** | App has existing todos |
| **Test Steps** | 1. Manually set todo with ID: null<br>2. Set todo with ID: undefined<br>3. Set todo with ID: "" (empty string)<br>4. Set todo with duplicate ID<br>5. Attempt to delete/update each |
| **Expected Results** | - Generated IDs are always valid UUIDs<br>- No crashes on edge case IDs<br>- Duplicate ID prevention works |

#### NT-002: localStorage JSON Parse Failure
| Field | Value |
|-------|-------|
| **Test Case Name** | NT-002_LocalStorage_Parse_Failure |
| **Description** | Verify JSON.parse failures are caught and handled |
| **Preconditions** | localStorage has malformed JSON |
| **Test Steps** | 1. Set localStorage: `todos = "not valid json {"`<br>2. Set localStorage: `todos = "[1, 2, 3]` (trailing comma issues)<br>3. Set localStorage: `todos = NaN`<br>4. Set localStorage: `todos = {"text": "test", "id": }` (incomplete object)<br>5. Load app for each case |
| **Expected Results** | - try-catch block catches SyntaxError<br>- App loads with empty todo list as fallback<br>- No unhandled promise rejections |

#### NT-003: Component Unmount During State Update
| Field | Value |
|-------|-------|
| **Test Case Name** | NT-003_Unmount_During_State_Update |
| **Description** | Verify no errors when component unmounts during async operation |
| **Preconditions** | Component performing async localStorage operation |
| **Test Steps** | 1. Start adding todo (triggers localStorage write)<br>2. Immediately navigate away before operation completes<br>3. Rapidly toggle todos while unmounting<br>4. Monitor console for React warnings |
| **Expected Results** | - No "Can't perform React state update on unmounted component" warnings<br>- Cleanup functions properly cancel pending operations<br>- App doesn't crash |

#### NT-004: Reachability Analysis
| Field | Value |
|-------|-------|
| **Test Case Name** | NT-004_Unreachable_Code_Removal |
| **Description** | Verify no code exists after return statements that could cause confusion |
| **Preconditions** | Source code has ternary operators and early returns |
| **Test Steps** | 1. Review code for patterns: `return x; someOtherCode();`<br>2. Trigger each code path that has early return<br>3. Verify only intended code executes<br>4. Check for simplified ternary logic (no nested ternaries) |
| **Expected Results** | - No dead code after return statements<br>- Ternary logic is readable (max 1 level nesting)<br>- Code coverage shows all paths reachable |

#### NT-005: Memory Leak Detection
| Field | Value |
|-------|-------|
| **Test Case Name** | NT-005_Memory_Leak_Detection |
| **Description** | Verify global event listeners and intervals are properly cleaned up |
| **Preconditions** | App has event listeners or intervals |
| **Test Steps** | 1. Load app and take heap snapshot (heap: ~50MB baseline)<br>2. Navigate to TodoList component 10 times<br>3. Take heap snapshot (heap: should still be ~50MB)<br>4. Check for detached DOM nodes in DevTools Memory tab<br>5. Verify addEventListener has corresponding removeEventListener |
| **Expected Results** | - Heap memory stable across mount/unmount cycles<br>- No detached DOM tree warnings<br>- Global listeners removed on component unmount |

#### NT-006: Form Submission with Empty Input
| Field | Value |
|-------|-------|
| **Test Case Name** | NT-006_Form_Submission_Empty_Input |
| **Description** | Verify form prevents submission with empty required fields |
| **Preconditions** | Todo input form present |
| **Test Steps** | 1. Focus input field<br>2. Press Enter without typing<br>3. Verify no todo created<br>4. Type only whitespace<br>5. Press Enter<br>6. Verify no todo created<br>7. Check ARIA validation attributes present |
| **Expected Results** | - Form has required attribute or client-side validation<br>- Empty submissions ignored<br>- aria-required or required attribute present |

#### NT-007: Race Condition in ID Generation
| Field | Value |
|-------|-------|
| **Test Case Name** | NT-007_Race_Condition_ID_Generation |
| **Description** | Verify ID generation is stable and doesn't produce duplicates under stress |
| **Preconditions** | App can create todos |
| **Test Steps** | 1. Rapidly create 50 todos in parallel (simulate concurrent clicks)<br>2. Collect all generated IDs<br>3. Check for duplicates<br>4. Verify IDs are deterministic (same input = same output) |
| **Expected Results** | - No duplicate IDs generated<br>- ID generation uses crypto.randomUUID() or equivalent stable method<br>- No Math.random() based IDs |

#### NT-008: Accessibility Audit
| Field | Value |
|-------|-------|
| **Test Case Name** | NT-008_Accessibility_Audit |
| **Description** | Verify all interactive elements have proper ARIA labels |
| **Preconditions** | App has interactive elements |
| **Test Steps** | 1. Run axe-core accessibility scan<br>2. Check all buttons have aria-label or visible text<br>3. Verify form inputs have associated labels<br>4. Check todo toggle has aria-label<br>5. Verify delete buttons have accessible labels |
| **Expected Results** | - Zero axe-core violations<br>- All interactive elements labeled<br>- Keyboard navigation works for all features |

---

## Test Execution Matrix

| Test ID | Priority | Type | Estimated Time | Tools/Automation |
|---------|----------|------|----------------|------------------|
| HP-001 | P0 | E2E | 2 min | Cypress/Playwright |
| HP-002 | P0 | Unit | 1 min | React Testing Library |
| HP-003 | P1 | E2E | 2 min | Playwright |
| HP-004 | P0 | Integration | 3 min | Cypress |
| HP-005 | P1 | Unit | 2 min | Jest + React Profiler |
| EC-001 | P1 | Unit | 1 min | Jest |
| EC-002 | P2 | Performance | 5 min | Lighthouse |
| EC-003 | P1 | Integration | 3 min | Jest + Mock |
| EC-004 | P1 | Security | 2 min | Manual + DOMPurify |
| EC-005 | P1 | Unit | 2 min | Jest |
| EC-006 | P2 | Unit | 1 min | Jest + Mock |
| EC-007 | P2 | Unit | 2 min | React Profiler |
| EC-008 | P1 | Unit | 1 min | Jest |
| NT-001 | P1 | Unit | 1 min | Jest |
| NT-002 | P1 | Unit | 1 min | Jest |
| NT-003 | P2 | Integration | 3 min | Cypress |
| NT-004 | P2 | Static | 1 min | ESLint |
| NT-005 | P1 | Performance | 5 min | Chrome DevTools |
| NT-006 | P1 | E2E | 1 min | Playwright |
| NT-007 | P2 | Unit | 2 min | Jest |
| NT-008 | P1 | Audit | 3 min | axe-core |

---

## Key Assertions Checklist

### Memory & Performance
- [ ] No memory leaks on component unmount
- [ ] Interval cleanup (clearInterval) implemented
- [ ] Event listener cleanup (removeEventListener) implemented
- [ ] useEffect dependency array correct (no infinite loops)
- [ ] useCallback/useMemo used for stable references

### State Management
- [ ] Immutable state updates (prevTodos pattern)
- [ ] Stable ID generation (no Math.random())
- [ ] localStorage wrapped in try-catch
- [ ] JSON.parse error handling

### Accessibility
- [ ] ARIA labels on all interactive elements
- [ ] Form labels properly associated (htmlFor/id)
- [ ] Keyboard navigation functional
- [ ] Screen reader announces state changes

### Code Quality
- [ ] === used instead of ==
- [ ] No unreachable code after return
- [ ] Ternary logic simplified (readable)
- [ ] Proper error boundaries

---

## Test Data Examples

```javascript
// Valid Todo IDs (stable format)
const validIds = [
  "550e8400-e29b-41d4-a716-446655440000",
  "f47ac10b-58cc-4372-a567-0e02b2c3d479"
];

// Invalid localStorage values to test
const invalidStorageValues = [
  null,
  undefined,
  "null",
  "undefined",
  "{invalid json}",
  "[1, 2, 3",
  "",
  NaN
];

// Special character test cases
const specialChars = [
  "<script>alert('xss')</script>",
  'Test with "quotes"',
  "Unicode: 你好 🔥",
  "Newlines\n\r\t",
  "HTML: <div>&amp;</div>"
];

// Boundary values
const boundaryValues = {
  emptyString: "",
  whitespaceOnly: "   \t\n  ",
  maxLength: "A".repeat(10000),
  emoji: "🔥🎉💯",
  zero: "0",
  negativeId: -1,
  floatId: 1.5
};
```

---

*Document Version: 1.0 | Last Updated: 2024*