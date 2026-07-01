# QA_Architect

## Happy Path
- **Counter increments and decrements within bounds**
  - Start with the default value `0`.
  - Click **+ Increment** and verify the count increases by 1, the input updates to the same value, and the status message reflects the new range.
  - Click **- Decrement** and verify the count decreases by 1 and the latest value is appended to history.
- **Manual value entry updates counter and history**
  - Enter a valid integer within `-50` to `100`.
  - Verify the displayed count, input value, recent history chips, and full history list all reflect the entered value.
- **Recent history display stays limited while full history keeps growing**
  - Perform more than 5 valid count changes.
  - Verify the inline recent-history area shows only the last 5 values, while the History panel shows every recorded change in order.
- **Reset clears current session history and restores initial state**
  - After several count changes, click **Reset**.
  - Verify the count returns to `0`, the input resets to `0`, the recent-history area is cleared, the History panel shows "No changes recorded yet.", and the document title returns to the default state.
- **Toggle hides and re-shows the counter cleanly**
  - Click **Toggle Counter** to hide the counter.
  - Verify the counter UI disappears while the History panel remains rendered.
  - Click **Toggle Counter** again and verify a fresh counter appears with count `0`, empty local history, and working controls.
- **Document title tracks history count**
  - With no history, verify the expected title is `React Counter Application`.
  - After one or more valid updates, verify the title changes to `Counter updates (n)` where `n` matches the History panel entry count.
- **Root rendering succeeds when `#root` exists**
  - In a standard page containing the `root` element, verify the app mounts without additional guard errors and renders in `React.StrictMode`.

## Edge Cases
- **Upper bound clamp and button stop at maximum**
  - Enter `100` directly and verify it is accepted.
  - Attempt another increment and verify the count stays at `100`, no new history item is added, and the input remains `100`.
  - Enter a value above the limit such as `101` or `999` and verify it is clamped to `100`.
- **Lower bound clamp and button stop at minimum**
  - Enter `-50` directly and verify it is accepted.
  - Attempt another decrement and verify the count stays at `-50`, no new history item is added, and the input remains `-50`.
  - Enter a value below the limit such as `-51` or `-999` and verify it is clamped to `-50`.
- **Empty input handling**
  - Clear the numeric input completely.
  - Verify the input can temporarily display an empty string without changing the current count or adding history.
- **Partial / formatted numeric input behavior**
  - Enter values such as `05`, `12abc`, or whitespace-padded integers if browser input allows them.
  - Verify accepted values resolve through integer parsing, update the count once, and remain bounded.
- **Status message boundary transitions**
  - Verify exact thresholds: `0` shows `Start here`, `1` to `50` shows `Keep going!`, `51` to `80` shows `Good progress!`, `81+` shows `Excellent!`, and negative values show `Negative territory`.
- **Effect cleanup during repeated history changes**
  - Perform multiple valid counter updates.
  - Verify title changes remain accurate after each update and no stale title is left behind between updates, accounting for cleanup/re-run behavior.
- **Toggle cycle cleanup expectations**
  - Make several updates, hide the counter, then show it again.
  - Verify the remounted counter starts from a fresh local state and the timer-driven "Last updated" timestamp resumes normally after remount.

## Negative Cases
- **Non-numeric input should be ignored gracefully**
  - Attempt to input non-numeric content if browser/devtools permits it.
  - Verify the app does not crash, the count does not change, and no invalid history entry is created.
- **No history callback failure during normal updates**
  - During valid count changes, verify history propagation from `Counter` to `App` occurs without runtime errors and the History panel stays in sync with the counter history.
- **Unmount cleanup prevents timer side effects**
  - Hide the counter after it has been running.
  - Verify no warnings, errors, or obvious side effects occur from the interval after unmount; `componentWillUnmount` should clear the timer.
- **Root rendering safety when `#root` is missing**
  - In a page without an element with id `root`, verify `index.js` does not call `createRoot`, does not throw an exception, and fails safely by rendering nothing.
- **StrictMode resilience**
  - Verify the implemented behavior remains stable under `React.StrictMode`, especially around mount/unmount-sensitive logic such as the interval and title effect cleanup.
