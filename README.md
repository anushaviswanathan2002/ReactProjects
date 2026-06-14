# Todo App with Issues

A React todo application intentionally designed with numerous bugs and issues for testing purposes.

## Issues Included

This app contains 50+ intentional issues across:

- **State Management**: Direct state mutations, missing setState calls
- **Memory Leaks**: Uncleaned intervals, global event listeners without cleanup
- **Performance**: Creating new functions on every render, using index as keys
- **Accessibility**: Missing ARIA labels, no form labels
- **React Patterns**: Class components mixing with hooks, incorrect useEffect dependencies
- **Code Quality**: Unused variables, magic numbers, nested ternaries
- **Logic Bugs**: Infinite loops, non-idempotent key generation, type coercion with == vs ===

## Purpose

This app is designed for bug-fixing practice and testing automated code analysis tools.
