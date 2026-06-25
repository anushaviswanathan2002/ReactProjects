import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

describe('Counter component', () => {
  test('renders heading and initial count of 0', () => {
    render(<Counter />);

    // Heading
    expect(screen.getByText(/Counter App/i)).toBeInTheDocument();

    // Initial count (target the element with the counter-number class)
    const countEl = screen.getByText('0', { selector: 'p.counter-number' });
    expect(countEl).toBeInTheDocument();
  });

  test('increase button increments the counter', () => {
    render(<Counter />);

    const increaseBtn = screen.getByText(/Increase/i);
    const countEl = screen.getByText('0', { selector: 'p.counter-number' });

    fireEvent.click(increaseBtn);
    expect(countEl.textContent).toBe('1');

    // clicking multiple times
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    expect(countEl.textContent).toBe('3');
  });

  test('decrease button decrements the counter', () => {
    render(<Counter />);

    const decreaseBtn = screen.getByText(/Decrease/i);
    const countEl = screen.getByText('0', { selector: 'p.counter-number' });

    fireEvent.click(decreaseBtn);
    expect(countEl.textContent).toBe('-1');

    fireEvent.click(decreaseBtn);
    expect(countEl.textContent).toBe('-2');
  });

  test('reset button sets the counter back to 0', () => {
    render(<Counter />);

    const increaseBtn = screen.getByText(/Increase/i);
    const resetBtn = screen.getByText(/Reset/i);
    const countEl = screen.getByText('0', { selector: 'p.counter-number' });

    // change the counter
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    expect(countEl.textContent).toBe('2');

    // reset
    fireEvent.click(resetBtn);
    expect(countEl.textContent).toBe('0');
  });
});
