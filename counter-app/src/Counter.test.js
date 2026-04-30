import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

describe('Counter Component', () => {
  test('renders counter heading', () => {
    render(<Counter />);
    const heading = screen.getByText('Counter App');
    expect(heading).toBeInTheDocument();
  });

  test('renders initial counter value as 0', () => {
    render(<Counter />);
    const counterNumber = screen.getByText('0');
    expect(counterNumber).toBeInTheDocument();
  });

  test('renders all three buttons', () => {
    render(<Counter />);
    expect(screen.getByText('Decrease')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Increase')).toBeInTheDocument();
  });

  test('increments counter when Increase button is clicked', () => {
    render(<Counter />);
    const increaseButton = screen.getByText('Increase');
    fireEvent.click(increaseButton);
    const counterNumber = screen.getByText('1');
    expect(counterNumber).toBeInTheDocument();
  });

  test('decrements counter when Decrease button is clicked', () => {
    render(<Counter />);
    const decreaseButton = screen.getByText('Decrease');
    fireEvent.click(decreaseButton);
    const counterNumber = screen.getByText('-1');
    expect(counterNumber).toBeInTheDocument();
  });

  test('resets counter to 0 when Reset button is clicked', () => {
    render(<Counter />);
    const increaseButton = screen.getByText('Increase');
    const resetButton = screen.getByText('Reset');
    
    // Increment twice
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);
    
    // Reset
    fireEvent.click(resetButton);
    
    const counterNumber = screen.getByText('0');
    expect(counterNumber).toBeInTheDocument();
  });

  test('multiple increments work correctly', () => {
    render(<Counter />);
    const increaseButton = screen.getByText('Increase');
    
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);
    
    const counterNumber = screen.getByText('3');
    expect(counterNumber).toBeInTheDocument();
  });

  test('multiple decrements work correctly', () => {
    render(<Counter />);
    const decreaseButton = screen.getByText('Decrease');
    
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    fireEvent.click(decreaseButton);
    
    const counterNumber = screen.getByText('-3');
    expect(counterNumber).toBeInTheDocument();
  });

  test('mixed increment and decrement operations work correctly', () => {
    render(<Counter />);
    const increaseButton = screen.getByText('Increase');
    const decreaseButton = screen.getByText('Decrease');
    
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);
    fireEvent.click(decreaseButton);
    
    const counterNumber = screen.getByText('1');
    expect(counterNumber).toBeInTheDocument();
  });

  test('displays footer text', () => {
    render(<Counter />);
    const footerText = screen.getByText('Click buttons to change the counter');
    expect(footerText).toBeInTheDocument();
  });
});
