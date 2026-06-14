# Memory Game React App with Issues

A React-based memory card matching game intentionally filled with various issues for testing and debugging practice.

## Features

- Card matching gameplay
- Move counter
- Theme toggle
- Leaderboard (placeholder)

## Issues List

This app contains **84+ intentional issues** across multiple categories:

### React/Component Issues
- Direct state mutation
- Memory leaks (intervals not cleared)
- Using index as key in lists
- Creating functions in render
- Missing useEffect cleanup
- Stale closure in hooks
- Direct props mutation
- setState with stale values
- Context provider without proper values

### CSS Issues
- Duplicate selectors
- Deep nesting
- Using !important everywhere
- Magic numbers
- Overly specific selectors
- Inline styles instead of classes
- Unused CSS classes
- Inconsistent naming conventions

### JavaScript Issues
- Global variable pollution
- Using eval (security vulnerability)
- Type coercion with ==
- No error handling
- Memory leaks
- Missing accessibility attributes
- Shallow copy instead of deep copy

### Performance Issues
- Creating new functions on every render
- Not memoizing expensive computations
- Using index as key
- Inefficient array operations
- Multiple intervals running simultaneously

## Usage

```bash
npm install
npm start
```

## Purpose

This app is designed for:
- Learning to identify and fix common React issues
- Practice debugging techniques
- Testing code quality tools
- Understanding React best practices

## Note

All issues are intentional and should be fixed for production use.