# Counter App

A React counter application demonstrating proper React patterns and best practices.

## Features

- Increment/decrement counter with configurable limits (-50 to 100)
- Reset counter to initial value
- Set custom counter value via input
- History tracking of recent values
- Status messages based on counter value

## Issues Fixed

This project was refactored from a version containing multiple React and code quality issues:

### App.js Fixes
| Issue | Fix |
|-------|-----|
| Direct state mutation | Use `setState` with functional updates or spread operator |
| Props mutation | Props are now treated as read-only |
| Memory leak (uncleared interval) | Added `clearInterval` in `componentWillUnmount` |
| `==` instead of `===` | Changed to strict equality |
| Missing accessibility attributes | Added `aria-label`, `aria-live`, `data-testid` |
| Duplicate inline styles | Extracted to CSS classes |
| Unused components | Removed unused components |
| Improper state updates | Using `setState` with callback pattern |

### App.css Fixes
| Issue | Fix |
|-------|-----|
| `!important` overuse | Removed all `!important` declarations |
| Deep CSS nesting | Flattened to shallow selectors |
| Duplicate properties | Consolidated single definitions |
| Magic numbers | Replaced with CSS custom properties where beneficial |
| Generic `div` selector | Removed overly broad selector |

### index.js Fixes
| Issue | Fix |
|-------|-----|
| Memory leak (unremoved event listener) | Removed global resize listener |
| Unused variables | Removed unused constants |
| Duplicate render calls | Removed extra `createRoot` call |

### index.css Fixes
| Issue | Fix |
|-------|-----|
| `!important` overuse | Removed all `!important` declarations |
| Specificity conflicts | Removed conflicting nested rules |
| Duplicate properties | Consolidated to single definitions |

### index.html Fixes
| Issue | Fix |
|-------|-----|
| Unused DOM element | Removed `div#another-root` |

## Installation

```bash
npm install
```

## Usage

```bash
npm start      # Start development server
npm test       # Run tests
npm run build  # Build for production
```

## Test Coverage

The test suite covers:
- Initial rendering with default and custom values
- Increment/decrement functionality
- Reset functionality
- Set value via input
- Boundary limits (-50 to 100)
- Status message updates
- Accessibility attributes

## Component API

### Counter

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialValue` | number | 0 | Starting value for the counter |

**State:**
| State | Type | Description |
|-------|------|-------------|
| `count` | number | Current counter value |
| `history` | array | Array of recent count values |

**Methods:**
| Method | Description |
|--------|-------------|
| `increment()` | Increase count by 1 (max: 100) |
| `decrement()` | Decrease count by 1 (min: -50) |
| `reset()` | Reset count to initial value |
| `setValue(value)` | Set count to specific value |

## Best Practices Applied

1. **State Management**: Never mutate state directly; always use `setState`
2. **Memory Management**: Clean up subscriptions and intervals
3. **Accessibility**: ARIA labels, semantic HTML, screen reader support
4. **CSS Architecture**: BEM-like naming, no `!important`, shallow selectors
5. **Code Organization**: Separated concerns, removed dead code
