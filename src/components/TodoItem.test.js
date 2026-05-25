import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItem from './TodoItem';

// ------------------------------------------------------------
// Test Scenarios:
//  1. Happy path  – renders the todo text
//  2. Happy path  – renders an unchecked checkbox for an active todo
//  3. Happy path  – renders a checked checkbox for a completed todo
//  4. Happy path  – the completed class is applied when todo is done
//  5. Happy path  – clicking the checkbox calls onToggle with the todo id
//  6. Happy path  – clicking the Delete button calls onDelete with the todo id
//  7. Accessibility – Delete button has an accessible label
// ------------------------------------------------------------

describe('TodoItem', () => {
  const activeTodo = { id: 1, text: 'Buy groceries', completed: false };
  const completedTodo = { id: 2, text: 'Walk the dog', completed: true };

  const setup = (todo = activeTodo) => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();
    const { container } = render(
      <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
    );
    return { onToggle, onDelete, container };
  };

  test('renders the todo text', () => {
    setup();
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  test('renders an unchecked checkbox for an active todo', () => {
    setup(activeTodo);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('renders a checked checkbox for a completed todo', () => {
    setup(completedTodo);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('applies the "completed" CSS class when the todo is done', () => {
    const { container } = setup(completedTodo);
    expect(container.querySelector('li')).toHaveClass('completed');
  });

  test('does NOT apply the "completed" CSS class for an active todo', () => {
    const { container } = setup(activeTodo);
    expect(container.querySelector('li')).not.toHaveClass('completed');
  });

  test('calls onToggle with the todo id when the checkbox is clicked', async () => {
    const user = userEvent.setup();
    const { onToggle } = setup(activeTodo);

    await user.click(screen.getByRole('checkbox'));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(activeTodo.id);
  });

  test('calls onDelete with the todo id when the Delete button is clicked', async () => {
    const user = userEvent.setup();
    const { onDelete } = setup(activeTodo);

    await user.click(screen.getByRole('button', { name: /delete task/i }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(activeTodo.id);
  });

  test('Delete button has an accessible aria-label', () => {
    setup();
    expect(
      screen.getByRole('button', { name: /delete task/i })
    ).toBeInTheDocument();
  });
});
