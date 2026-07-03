# Counter App — Test Cases

High-level test scenarios for the bug fixes in this PR. Cases map to the fixes documented in [`BUG_FIXES.md`](./BUG_FIXES.md).

## Happy Path

| # | Scenario | Steps | Expected Result | Maps to Fix |
| - | -------- | ----- | --------------- | ----------- |
| H1 | Initial render | Load the app | Counter displays `0`, history is empty, status is "Start here" | — |
| H2 | Single increment | Click "+ Increment" once | Count becomes `1`, history shows `1` | #1, #4 |
| H3 | Single decrement | Click "- Decrement" once from 0 | Count becomes `-1`, history shows `-1` | #1, #4 |
| H4 | Sequential increments | Click "+ Increment" 5 times | Count is `5`, last 5 history items are `1,2,3,4,5` | #1, #4, #9 |
| H5 | Sequential decrements | Click "- Decrement" 3 times from 0 | Count is `-3`, history shows `-1,-2,-3` | #1, #4 |
| H6 | Reset | Increment to 5, click "Reset" | Count is `0`, history is `[]`, status is "Start here" | — |
| H7 | Increment after reset | Reset, then click "+" | Count is `1` (no stale state) | #1, #4 |
| H8 | Set value within range | Type `42` in input field, click "Set Value" | Count is `42`, history appended | #6 |
| H9 | Status thresholds | Increment count past 50, then 80 | Status text becomes "Good progress!" then "Excellent!" | #7, #10 |
| H10 | Toggle hide/show | Click "Hide Counter", then "Show Counter" | Counter unmounts and remounts cleanly; no leaked timers or listeners | #3, #15 |

## Edge Cases

| # | Scenario | Steps | Expected Result | Maps to Fix |
| - | -------- | ----- | ---------------------------- | ----------- |
| E1 | Increment at MAX | Increment to 100, click "+" again | Count stays at 100, console warns "Maximum reached!" (no `alert` side effect) | #5 |
| E2 | Decrement at MIN | Decrement to -50, click "-" again | Count stays at -50, console warns "Minimum reached!" | #5 |
| E3 | Set value above MAX | Type `500`, click "Set Value" | Count is clamped to `100` | #6 |
| E4 | Set value below MIN | Type `-999`, click "Set Value" | Count is clamped to `-50` | #6 |
| E5 | Empty input | Clear input, click "Set Value" | Count unchanged, no NaN | #6 |
| E6 | Negative input via `<input type="number">` min/max | Type `-9999` | Native browser clamps to `min={-50}` (and JS clamp is also applied) | #6 |
| E7 | History window | Increment 10 times | Only the last 5 are displayed (`6,7,8,9,10`) | #9, #10 |
| E8 | Status at boundary count=0 | Reset to 0 | Status reads "Start here" | #7 |
| E9 | Status at negative | Decrement to -1 | Status reads "Negative territory" | #7 |
| E10 | Rapid repeated clicks | Click "+" 100 times quickly | Final count is `100` (no dropped updates due to functional setState) | #1, #4 |
| E11 | Toggle while at MAX | Reach 100, click "Hide Counter" then "Show Counter" | Counter remounts at 0 (initialValue=0), no errors | #3 |
| E12 | History key stability | Trigger increments and decrements so history rotates | React reconciles correctly (no DOM thrash, no key collisions) | #9 |

## Negative Cases

| # | Scenario | Steps | Expected Result | Maps to Fix |
| - | -------- | ----- | --------------- | ----------- |
| N1 | Non-numeric input | Type `abc` into input, click "Set Value" | `parseInt` returns `NaN`; `console.warn` fires; count unchanged | #6 |
| N2 | Whitespace input | Type `"   "`, click "Set Value" | Same as N1 (NaN rejected) | #6 |
| N3 | Float input | Type `3.7`, click "Set Value" | `parseInt` floors to `3`; count becomes `3` | #6 |
| N4 | Out-of-range numeric | Type `10000` | Clamped to `100`; count becomes `100` | #6 |
| N5 | Out-of-range negative | Type `-10000` | Clamped to `-50`; count becomes `-50` | #6 |
| N6 | XSS attempt via input | Type `<script>alert(1)</script>` | Browser ignores non-numeric chars; count unchanged | #6 |
| N7 | Memory leak after toggle | Mount/unmount counter 50 times via toggle | `setInterval` handles are all released (verifiable via DevTools / heap snapshot) | #3 |
| N8 | Global listener leak | Resize the window repeatedly | No `console.log` spam from `window.addEventListener('resize', …)` (listener removed) | #15 |
| N9 | NaN propagation | After invalid input, perform increment | Count is correct (e.g. `0 + 1 = 1`); no `NaN` shown | #1, #4, #6 |
| N10 | Invalid `initialValue` prop | Render `<Counter initialValue={null} />` | Falls back to `0` via `defaultProps`; no crash | #2 |
| N11 | Missing `initialValue` prop | Render `<Counter />` | Falls back to `0` via `defaultProps`; no crash | #2 |
| N12 | Accessibility — screen reader | Inspect with NVDA / VoiceOver | Counter, history, input, and toggle all announce meaningful labels | #12 |
| N13 | Mounting second root | Load the page | No "Two React instances" warning; only one tree is rendered | #13 |
| N14 | CSS specificity war | Inspect computed styles on `.App` | `text-align: center` wins; no overridden chain | #13 (CSS cleanup) |
| N15 | Stale closure on handler | Reset, then fire a queued handler | Handler uses latest state; no resurrected old value | #1, #4 |

## Notes

- Tests are written at a high level (component/integration). Unit tests would require adding a test runner such as Jest + React Testing Library, which is out of scope for this PR.
- The `Counter` class component's `setInterval` cleanup should be verified with a React Testing Library `unmount()` assertion if/when tests are added.
- All accessibility assertions map to WAI-ARIA Authoring Practices for `button` and live regions.
