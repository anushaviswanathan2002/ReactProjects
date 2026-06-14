# React Counter App with Issues

A counter React application intentionally built with numerous code quality issues for testing and debugging practice.

## Issues Included

This app contains many intentional issues to practice debugging and fixing:

### React Issues
- Direct state mutation instead of using setState properly
- Props mutation in constructor
- Missing cleanup in useEffect (memory leak)
- Nested useEffect hooks causing infinite loops
- Using index as key in mapped elements
- Creating new functions inside render (performance)
- Missing PropTypes validation
- Unused component state variables
- No input validation on user inputs
- Incorrect setState usage with current state

### JavaScript Issues
- Using `var` instead of `let/const`
- Using `==` instead of `===` (type coercion)
- Magic numbers without constants
- Unused variables and functions
- Silent failures on error conditions
- Memory leaks (intervals not cleared)

### CSS Issues
- Overusing `!important` declarations
- Deep selector nesting
- Duplicate CSS properties
- Unused CSS classes
- Inline styles everywhere
- Selector specificity wars
- Using px units instead of responsive units

### Architecture Issues
- Duplicate button code (not DRY)
- Inline styles instead of CSS classes
- Deeply nested ternary operators
- Unused components left in codebase
- No error boundaries
- Accessibility issues (missing aria-labels)

## Features

- Increment counter
- Decrement counter
- Reset counter
- Set custom value
- History tracking display

## Getting Started

```bash
npm install
npm start
```
