import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './App';

describe('Counter Component', () => {
  describe('Rendering', () => {
    test('renders counter with initial value of 0', () => {
      render(<Counter initialValue={0} />);
      expect(screen.getByLabelText(/current count: 0/i)).toBeInTheDocument();
    });

    test('renders counter with custom initial value', () => {
      render(<Counter initialValue={10} />);
      expect(screen.getByLabelText(/current count: 10/i)).toBeInTheDocument();
    });

    test('renders increment, decrement, and reset buttons', () => {
      render(<Counter initialValue={0} />);
      expect(screen.getByRole('button', { name: /increment/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /decrement/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });

    test('renders input field for setting value', () => {
      render(<Counter initialValue={0} />);
      expect(screen.getByPlaceholderText(/set value/i)).toBeInTheDocument();
    });

    test('renders status message', () => {
      render(<Counter initialValue={0} />);
      expect(screen.getByText(/start here/i)).toBeInTheDocument();
    });
  });

  describe('increment functionality', () => {
    test('increments count by 1', () => {
      render(<Counter initialValue={0} />);
      fireEvent.click(screen.getByRole('button', { name: /increment/i }));
      expect(screen.getByLabelText(/current count: 1/i)).toBeInTheDocument();
    });

    test('adds value to history on increment', () => {
      render(<Counter initialValue={0} />);
      fireEvent.click(screen.getByRole('button', { name: /increment/i }));
      fireEvent.click(screen.getByRole('button', { name: /increment/i }));
      const history = screen.getByRole('list');
      expect(history).toHaveTextContent('1');
      expect(history).toHaveTextContent('2');
    });

    test('shows alert when maximum count (100) is reached', () => {
      window.alert = jest.fn();
      render(<Counter initialValue={100} />);
      fireEvent.click(screen.getByRole('button', { name: /increment/i }));
      expect(window.alert).toHaveBeenCalledWith('Maximum reached!');
    });
  });

  describe('decrement functionality', () => {
    test('decrements count by 1', () => {
      render(<Counter initialValue={5} />);
      fireEvent.click(screen.getByRole('button', { name: /decrement/i }));
      expect(screen.getByLabelText(/current count: 4/i)).toBeInTheDocument();
    });

    test('does not decrement below minimum (-50)', () => {
      render(<Counter initialValue={-50} />);
      fireEvent.click(screen.getByRole('button', { name: /decrement/i }));
      expect(screen.getByLabelText(/current count: -50/i)).toBeInTheDocument();
    });
  });

  describe('reset functionality', () => {
    test('resets count to initial value', () => {
      render(<Counter initialValue={5} />);
      fireEvent.click(screen.getByRole('button', { name: /increment/i }));
      fireEvent.click(screen.getByRole('button', { name: /increment/i }));
      expect(screen.getByLabelText(/current count: 7/i)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /reset/i }));
      expect(screen.getByLabelText(/current count: 5/i)).toBeInTheDocument();
    });

    test('clears history on reset', () => {
      render(<Counter initialValue={0} />);
      fireEvent.click(screen.getByRole('button', { name: /increment/i }));
      fireEvent.click(screen.getByRole('button', { name: /reset/i }));
      const history = screen.getByRole('list');
      expect(history).toBeEmptyDOMElement();
    });
  });

  describe('setValue functionality', () => {
    test('sets count to value from input', () => {
      render(<Counter initialValue={0} />);
      const input = screen.getByPlaceholderText(/set value/i);
      fireEvent.change(input, { target: { value: '42' } });
      expect(screen.getByLabelText(/current count: 42/i)).toBeInTheDocument();
    });
  });

  describe('status messages', () => {
    test('shows "Start here" when count is 0', () => {
      render(<Counter initialValue={0} />);
      expect(screen.getByText('Start here')).toBeInTheDocument();
    });

    test('shows "Keep going!" when count is positive but less than 50', () => {
      render(<Counter initialValue={25} />);
      expect(screen.getByText('Keep going!')).toBeInTheDocument();
    });

    test('shows "Good progress!" when count is between 50 and 80', () => {
      render(<Counter initialValue={60} />);
      expect(screen.getByText('Good progress!')).toBeInTheDocument();
    });

    test('shows "Excellent!" when count is above 80', () => {
      render(<Counter initialValue={90} />);
      expect(screen.getByText('Excellent!')).toBeInTheDocument();
    });

    test('shows "Negative territory" when count is negative', () => {
      render(<Counter initialValue={-10} />);
      expect(screen.getByText('Negative territory')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    test('buttons have accessible names', () => {
      render(<Counter initialValue={0} />);
      const incrementBtn = screen.getByRole('button', { name: /increment/i });
      const decrementBtn = screen.getByRole('button', { name: /decrement/i });
      const resetBtn = screen.getByRole('button', { name: /reset/i });
      expect(incrementBtn).toBeInTheDocument();
      expect(decrementBtn).toBeInTheDocument();
      expect(resetBtn).toBeInTheDocument();
    });

    test('count display has aria-label', () => {
      render(<Counter initialValue={0} />);
      expect(screen.getByLabelText(/current count/i)).toBeInTheDocument();
    });

    test('history has accessible label', () => {
      render(<Counter initialValue={0} />);
      expect(screen.getByLabelText(/history/i)).toBeInTheDocument();
    });
  });
});
