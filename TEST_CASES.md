# Memory Game - Test Cases

## Test Overview
This document contains comprehensive test cases covering all bug fixes in the memory game application.

---

## 1. Happy Path Tests

### TC-001: Basic Gameplay Flow
**Description:** Verify complete game flow from start to finish
**Steps:**
1. Click "Start Game" button
2. Click on first card
3. Click on second card
4. Verify cards either match or flip back
5. Repeat until all pairs matched
**Expected Result:** Game completes when all 8 pairs are matched, showing completion message

### TC-002: Card Matching
**Description:** Verify matching pairs stay face-up
**Steps:**
1. Start new game
2. Click two cards with same symbol
**Expected Result:** Both cards remain flipped with green background indicating match

### TC-003: Card Mismatch
**Description:** Verify non-matching cards flip back
**Steps:**
1. Start new game
2. Click two cards with different symbols
**Expected Result:** After 1 second delay, both cards flip back to hidden state

---

## 2. Edge Case Tests

### TC-004: Rapid Click Prevention
**Description:** Verify cannot flip more than 2 cards during match check
**Steps:**
1. Start new game
2. Click first card
3. Quickly click cards 2, 3, 4, 5 within 1 second
**Expected Result:** Only first two cards are flipped; extra clicks are ignored

### TC-005: Matched Card Click Prevention
**Description:** Verify already matched cards cannot be clicked
**Steps:**
1. Find and match a pair
2. Click on one of the matched cards again
**Expected Result:** Matched card remains locked and click is ignored

### TC-006: Reset During Gameplay
**Description:** Verify reset clears all state including pending timeouts
**Steps:**
1. Start game and flip 3+ cards
2. Click Reset button immediately
**Expected Result:** All cards reset, moves counter reset to 0, timer resets

### TC-007: Same Card Double-Click
**Description:** Verify clicking same card twice doesn't count as move
**Steps:**
1. Start new game
2. Click card A
3. Click card A again
**Expected Result:** Card stays flipped; no move counted until second different card clicked

---

## 3. Negative/Error Handling Tests

### TC-008: Leaderboard Network Error
**Description:** Verify graceful handling of network failures
**Steps:**
1. Start application
2. Show leaderboard
3. Simulate network failure (server unavailable)
**Expected Result:** Error message displayed "Failed to load scores"

### TC-009: LocalStorage Failure Handling
**Description:** Verify no crash when localStorage fails
**Steps:**
1. Complete a game
2. Attempt to save high score when localStorage is full/blocked
**Expected Result:** Console error logged, no application crash

### TC-010: Empty Leaderboard
**Description:** Verify UI handles empty scores gracefully
**Steps:**
1. Show leaderboard with no scores in database
**Expected Result:** "No scores yet. Be the first to play!" message displayed

---

## 4. Memory Safety Tests

### TC-011: Timer Cleanup on Unmount
**Description:** Verify intervals are cleared when component unmounts
**Steps:**
1. Start game
2. Navigate away or unmount component
**Expected Result:** No memory leaks, all intervals cleared

### TC-012: Timeout Cleanup on Reset
**Description:** Verify pending timeouts are cleared on game reset
**Steps:**
1. Start game
2. Flip 2 cards (triggers 1s timeout)
3. Immediately click Reset
**Expected Result:** Previous timeout cleared, new game starts clean

### TC-013: Event Listener Cleanup
**Description:** Verify resize listener removed on unmount
**Steps:**
1. Start game
2. Resize window multiple times
3. Unmount component
**Expected Result:** No duplicate listeners on subsequent mounts

---

## 5. Accessibility Tests

### TC-014: Keyboard Navigation
**Description:** Verify cards can be activated with keyboard
**Steps:**
1. Start new game
2. Tab to a card
3. Press Enter
**Expected Result:** Card flips on Enter key press

### TC-015: Screen Reader Support
**Description:** Verify ARIA labels are correct
**Steps:**
1. Inspect card elements
2. Check aria-label attributes
**Expected Result:** Labels read as "Card 🍎 showing" or "Card 🍎 hidden"

### TC-016: Button ARIA States
**Description:** Verify buttons have proper ARIA attributes
**Steps:**
1. Check Start/Reset buttons for aria-label
2. Check theme toggle for aria-pressed
**Expected Result:** All interactive elements have appropriate ARIA attributes

---

## 6. State Management Tests

### TC-017: Move Counter Accuracy
**Description:** Verify move counter increments correctly
**Steps:**
1. Start game
2. Make 5 moves (10 card clicks)
**Expected Result:** Moves counter shows 5

### TC-018: Timer Accuracy
**Description:** Verify game timer counts correctly
**Steps:**
1. Start game
2. Wait 5 seconds without flipping cards
**Expected Result:** Timer shows approximately 5 seconds

### TC-019: Game Completion Detection
**Description:** Verify game completion detected at correct time
**Steps:**
1. Match all 8 pairs
**Expected Result:** Status shows "🎉 Game Completed!" and Start button changes behavior

### TC-020: Score Calculation
**Description:** Verify score calculation uses safe arithmetic
**Steps:**
1. Complete game with 15 moves and 45 seconds
2. Formula: 1000 - (15 × 10) - (45 × 2)
**Expected Result:** Final score: 1000 - 150 - 90 = 760

---

## Test Data

### Card Symbols
```
🍎 Apple, 🍊 Orange, 🍋 Lemon, 🍇 Grapes, 🍓 Strawberry, 🍒 Cherry, 🥝 Kiwi, 🍑 Peach
```

### Test Scenarios Matrix
| Scenario | Moves | Time | Expected Score |
|----------|-------|------|----------------|
| Perfect game | 8 | 30s | 1000 - 80 - 60 = 860 |
| Average game | 15 | 60s | 1000 - 150 - 120 = 730 |
| Long game | 25 | 120s | 1000 - 250 - 240 = 510 |

---

## Test Environment Requirements
- Modern browser with ES6+ support
- React 16.8+ for hooks support
- LocalStorage enabled
- No ad blockers blocking /api/scores endpoint

---

## Test Execution Notes
1. Tests should be run in isolation
2. Clear localStorage between tests
3. Test rapid clicks with automated tools if available
4. Verify no console errors during normal gameplay