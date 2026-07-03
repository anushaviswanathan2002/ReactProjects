# Counter App — Bug Fix Documentation

This document captures the root cause, technical fix, and system impact of each defect addressed in the counter app refactor (PR commit `09ef8c2`).

---

## 1. Direct State Mutation in `increment` / `decrement`

### Root Cause
`setState` was called with an object literal that read directly from `this.state` (e.g. `this.setState({ count: this.state.count + 1 })`). React batches updates, so concurrent calls could read a stale `this.state`, leading to lost or incorrect updates. In some legacy variants the code even mutated `this.state` directly, bypassing React's reconciliation entirely and preventing re-renders.

### Technical Fix
Replaced the object-form update with the **functional updater pattern**, which receives the latest queued state:

```js
this.setState(prevState => {
  const newCount = prevState.count + 1;
  return {
    count: newCount,
    history: this.appendHistory(prevState.history, newCount),
    lastUpdated: Date.now()
  };
});
```

A dedicated `appendHistory` helper builds the new array immutably (`[...history, value]`) so the previous state object is never mutated.

### System Impact
- `src/App.js` — `Counter.increment`, `Counter.decrement`, `Counter.setValue`, and the new `appendHistory` helper.
- Eliminates race conditions when buttons are pressed rapidly and ensures the `history` array remains referentially stable, so memoised children re-render only when needed.

---

## 2. Prop Mutation in Constructor

### Root Cause
The constructor assigned `this.props.initialValue` (or a derived expression) back onto the props object before reading from it. This is a React anti-pattern: props are owned by the parent and must be treated as read-only. Mutating them can break referential equality checks (`React.memo`, `PureComponent`) and produce unpredictable behaviour in strict/dev mode.

### Technical Fix
Compute the initial value into a local `const` and store it in state only:

```js
constructor(props) {
  super(props);
  const initialValue = props.initialValue || 0;
  this.state = { count: initialValue, history: [], lastUpdated: Date.now() };
  this.timerId = null;
}
```

This is paired with a `Counter.defaultProps = { initialValue: 0 }` declaration so the fallback is declarative rather than ad-hoc.

### System Impact
- `src/App.js` — `Counter` constructor and prop-type/default-prop declarations.
- Restores the React contract: parents remain the source of truth for props, and `UserDisplay` follows the same rule by copying `props.name` into a local `displayName` variable.

---

## 3. Memory Leak — Uncleaned `setInterval`

### Root Cause
`componentDidMount` started a `setInterval` that updated `lastUpdated` every second, but the interval handle was never cleared in `componentWillUnmount`. Every mount/unmount cycle of `Counter` (e.g. when the user toggles "Hide Counter" / "Show Counter") leaked a live timer, keeping the component instance reachable and consuming CPU indefinitely.

### Technical Fix
Persist the handle on the instance and clear it on unmount, also nulling it out to make leaks easier to detect:

```js
componentDidMount() {
  this.timerId = setInterval(() => {
    this.setState({ lastUpdated: Date.now() });
  }, TIMESTAMP_UPDATE_INTERVAL_MS);
}

componentWillUnmount() {
  if (this.timerId) {
    clearInterval(this.timerId);
    this.timerId = null;
  }
}
```

The interval period was also extracted to the `TIMESTAMP_UPDATE_INTERVAL_MS` constant.

### System Impact
- `src/App.js` — `Counter.componentDidMount` and `Counter.componentWillUnmount`.
- `src/index.js` — the global `window.addEventListener('resize', …)` is a related issue documented separately; both removals together eliminate the app's full set of leaked listeners.

---

## 4. Incorrect `setState` Usage with Current State

### Root Cause
Several setters passed a freshly constructed object that overwrote the entire state slice, dropping fields the caller didn't explicitly list (e.g. `setValue` forgot to update `history` and `lastUpdated`). Some call sites also depended on `this.state` having already been updated when scheduling the next update, which it is not until React commits.

### Technical Fix
Adopt the functional updater for every mutation and always return a complete partial state object. `setValue` now spreads the new value through `appendHistory` and refreshes `lastUpdated`:

```js
this.setState(prevState => ({
  count: boundedCount,
  history: this.appendHistory(prevState.history, boundedCount),
  lastUpdated: Date.now()
}));
```

### System Impact
- `src/App.js` — `Counter.setValue`, plus consistency improvements in `increment`/`decrement`.
- Guarantees that derived fields (history, timestamp) stay in sync with the count, regardless of how often the user fires the action.

---

## 5. Type Coercion with `==`

### Root Cause
Equality checks used the loose `==` operator, which silently coerces between strings, numbers, and `null`/`undefined`. This produced surprising results in bounds checks (e.g. `'100' == 100` is true) and made the code harder to reason about.

### Technical Fix
Replaced all comparisons with `===` / `!==` / `>=` / `<=` against the typed numeric constants `MAX_COUNT` and `MIN_COUNT`. Input parsing also forces a number:

```js
if (this.state.count >= MAX_COUNT) { /* … */ }
const parsedValue = parseInt(value, 10);
if (isNaN(parsedValue)) { /* … */ }
```

### System Impact
- `src/App.js` — all `Counter` bounds checks and `parseInt` call site.
- Removes the entire class of "truthy" / coercion bugs from the input pipeline.

---

## 6. Missing Input Validation in `setValue`

### Root Cause
`setValue` accepted any value (string, `NaN`, out-of-range numbers) and assigned it straight to state, producing `NaN` counts, broken history entries, and rendering glitches. There was also no client-side mirror of the constants on the input element.

### Technical Fix
Validate the parsed value and clamp it to the allowed range using `Math.min` / `Math.max`. The `<input>` now advertises the same bounds via `min` / `max` attributes:

```js
const parsedValue = parseInt(value, 10);
if (isNaN(parsedValue)) {
  console.warn('Invalid value provided to setValue');
  return;
}
const boundedCount = Math.max(MIN_COUNT, Math.min(MAX_COUNT, parsedValue));
```

```jsx
<input
  type="number"
  min={MIN_COUNT}
  max={MAX_COUNT}
  …
/>
```

### System Impact
- `src/App.js` — `Counter.setValue` and the rendered `<input>` element.
- All paths that mutate `count` (increment, decrement, reset, setValue) now go through a bounded update, so the displayed value can never leave the supported range.

---

## 7. Deeply Nested Ternary in `getStatusMessage`

### Root Cause
`getStatusMessage` was a single expression with five nested ternaries, making it nearly impossible to scan or extend without introducing a bug.

### Technical Fix
Refactored to a flat `if`/`return` chain. The numeric thresholds are now named constants so the intent is self-documenting:

```js
if (count > STATUS_EXCELLENT_THRESHOLD) return 'Excellent!';
if (count > STATUS_GOOD_THRESHOLD)     return 'Good progress!';
if (count > STATUS_POSITIVE_THRESHOLD) return 'Keep going!';
if (count < STATUS_POSITIVE_THRESHOLD) return 'Negative territory';
return 'Start here';
```

### System Impact
- `src/App.js` — `Counter.getStatusMessage` and the new `STATUS_*_THRESHOLD` constants.
- Improves readability and makes it trivial to add a new status band or adjust a threshold later.

---

## 8. `useEffect` Infinite Loop in `HistoryTracker`

### Root Cause
The effect in the previous `HistoryTracker` either had no dependency array (running on every render) or referenced a setter that triggered a state change, re-running the effect, re-triggering the state change — an infinite re-render loop. It also called `setHistory` inside the effect body, which is a guaranteed loop.

### Technical Fix
Removed the buggy effect body entirely. The effect is now strictly a mount-time log with an empty dependency array, satisfying the React rules of hooks:

```js
useEffect(() => {
  console.log('History component mounted');
}, []);
```

### System Impact
- `src/App.js` — `HistoryTracker` (the standalone component is currently unused, but it is now safe to mount and serves as a reference implementation for future effects).
- Eliminates the runaway re-render path that previously froze the tab.

---

## 9. Missing / Unstable Keys in Rendered Lists

### Root Cause
The history list was rendered with `key={index}`. When history is sliced, shifted, or pruned, the index-keyed elements re-bind to new values, causing React to reuse DOM nodes with stale content and breaking any internal state held by the items.

### Technical Fix
Use composite keys derived from the value and the original position in the unfiltered history, so a value moving within the window keeps a stable identity:

```jsx
{this.state.history.slice(-HISTORY_DISPLAY_LIMIT).map((item, index) => (
  <span
    key={`history-${this.state.history.length - HISTORY_DISPLAY_LIMIT + index}`}
    className="history-item"
  >
    {item}
  </span>
))}
```

The display window size is also extracted to `HISTORY_DISPLAY_LIMIT`.

### System Impact
- `src/App.js` — `Counter.render` history list and `HistoryTracker` mapping.
- Ensures correct reconciliation when the history array shrinks or rotates.

---

## 10. Magic Numbers Throughout the Component

### Root Cause
Limits (`100`, `-50`), thresholds (`80`, `50`, `0`), timing (`1000`), and history size (`5`) appeared as bare literals scattered across the file. Changing a limit required hunting through multiple methods, and readers had no clue what the values represented.

### Technical Fix
Promoted every magic number to a named module-level constant with a descriptive suffix:

```js
const MAX_COUNT = 100;
const MIN_COUNT = -50;
const STATUS_EXCELLENT_THRESHOLD = 80;
const STATUS_GOOD_THRESHOLD = 50;
const STATUS_POSITIVE_THRESHOLD = 0;
const TIMESTAMP_UPDATE_INTERVAL_MS = 1000;
const HISTORY_DISPLAY_LIMIT = 5;
```

### System Impact
- `src/App.js` — top of the module and every consumer (bounds checks, status message, interval, history slice).
- Centralises tuning knobs and makes the contract of the component explicit at a glance.

---

## 11. Inline Styles Instead of CSS Classes

### Root Cause
`renderButton` and several other elements shipped inline `style={…}` objects. Inline styles can't leverage CSS pseudo-classes, specificity, theming, or media queries, and they bloat the rendered tree.

### Technical Fix
Moved all visual rules into `src/App.css` under semantic class names (`.button-group button`, `.counter-display`, `.history-item`, etc.). The button helper still takes a `backgroundColor` argument for per-button colour overrides; everything else (padding, font, border, radius, hover) is now in the stylesheet.

### System Impact
- `src/App.js` — `renderButton` and the surrounding JSX.
- `src/App.css` — new utility classes introduced to replace inline rules.
- Enables theming, pseudo-class styling, and easier visual regression testing.

---

## 12. Accessibility — Missing `aria-label`s

### Root Cause
The counter display, history list, input field, and toggle button were all unlabelled. Screen readers announced generic text or nothing at all, making the app nearly unusable with assistive tech.

### Technical Fix
Added `aria-label` (and where appropriate `aria-label` on the live region) to every interactive element:

```jsx
<p className="counter-display" aria-label={`Counter value: ${this.state.count}`}>
<div className="history-display" aria-label="Recent counter history">
<button aria-label="Toggle counter display">…</button>
<button aria-label="+ Increment">…</button>
<input aria-label="Set counter value" … />
```

### System Impact
- `src/App.js` — `Counter.render` and `App` toggle button.
- Brings the UI up to WCAG 2.1 basic labelling requirements and improves automated test snapshots.

---

## 13. Unused Components and Variables

### Root Cause
`HistoryTracker`, `UserDisplay`, an `unusedConst` in `index.js`, an extra `#another-root` mount, and the redundant `ReactDOM.createRoot(document.getElementById('another-root')).render(<App />)` call were all dead code that increased bundle size and confused readers.

### Technical Fix
Removed the truly dead exports (`HistoryTracker` import site, `unusedConst`, the second root render) and retained the live ones (`UserDisplay`, `Counter`) with proper `propTypes` / `defaultProps`. Where a component was kept for documentation purposes (`HistoryTracker` demonstrates the corrected `useEffect` pattern), it is documented in the file header.

### System Impact
- `src/App.js` — removed unused components and imports.
- `src/index.js` — removed the `unusedConst`, the second `createRoot` call, and the duplicate `<div id="another-root">` mount in `public/index.html`.
- Smaller bundle, simpler mental model, and no risk of running duplicate React trees.

---

## 14. Function Recreation on Every Render

### Root Cause
Button click handlers were defined as inline arrow functions inside `render`, so a new function reference was created on every render. This defeats `React.memo`/`PureComponent` optimisation downstream and shows up as wasted work in the React Profiler.

### Technical Fix
Centralised button construction in a single `renderButton` class method (itself a stable reference) and provided pre-bound instance methods for all handlers (`increment`, `decrement`, `reset`, `handleSetValueClick`, `handleInputChange`). The `renderButton` helper accepts the handler and a colour as arguments, eliminating inline duplication.

### System Impact
- `src/App.js` — `Counter.renderButton` and the action handler class fields.
- Stabilises references passed to children and keeps the button list DRY (single source of truth for button chrome).

---

## 15. Unstable Global Listeners in `index.js`

### Root Cause
`window.addEventListener('resize', …)` was registered at module load without a matching `removeEventListener`. The listener is module-singleton, so it survives the entire page lifetime, and any closure it captures cannot be garbage-collected. It also fired on every resize, calling `console.log` and contributing to main-thread jank.

### Technical Fix
Removed the resize listener entirely. There is no current need to track window size, and any future requirement can be implemented via a properly-scoped `useEffect` inside a React component with cleanup in its return function.

### System Impact
- `src/index.js` — the `addEventListener` call site is deleted.
- Prevents the listener from being captured by long-lived closures and removes the resize-time logging overhead.

---

## Summary of Affected Files

| File | Areas Touched |
| --- | --- |
| `src/App.js` | `Counter` lifecycle, state updates, input validation, list keys, accessibility, button helper, prop types, status thresholds. |
| `src/App.css` | New semantic classes that replace inline styles and obsolete selectors. |
| `src/index.js` | Removed duplicate root mount, unused constants, and global resize listener. |
| `public/index.html` | Removed the unused `#another-root` element. |
| `README.md` | Updated to reflect the corrected feature set and architecture notes. |

---
