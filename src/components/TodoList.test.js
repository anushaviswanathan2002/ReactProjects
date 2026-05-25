import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoList from './TodoList';

// ------------------------------------------------------------
// Test Scenarios:
//  1. Empty state – shows "No tasks in this view." when list is empty
//  2. Happy path  – renders all todo items passed in
//  3. Happy path  – each item's text is visible
//  4. Happy path  – clicking a checkbox calls onToggle with the correct id
//  5. Happy path  – clicking a delete button calls onDelete with the correct id
// ------------------------------------------------------------

describe('TodoList', () => {
  const todos = [
    { id: 1, text: 'Buy groceries', completed: false },
    { id: 2, text: 'Walk the dog', completed: true },
    { id: 3, text: 'Read a book', completed: false },
  ];

  const setup = (todoList = todos) => {
    const onToggle = jest.fn();
    const onDelete = jest.fn();
    render(
      <TodoList todos={todoList} onToggle={onToggle} onDelete={onDelete} />
    );
    return { onToggle, onDelete };
  };

  test('shows an empty-state message when there are no todos', () => {
    setup([]);
    expect(screen.getByText(/no tasks in this view/i)).toBeInTheDocument();
  });

  test('does not show the empty-state message when todos exist', () => {
    setup();
    expect(
      screen.queryByText(/no tasks in this view/i)
    ).not.toBeInTheDocument();
  });

  test('renders the correct number of todo items', () => {
    setup();
    expect(screen.getAllByRole('checkbox')).toHaveLength(todos.length);
  });

  test('renders the text of every todo', () => {
    setup();
    todos.forEach(({ text }) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  test('calls onToggle with the correct id when a checkbox is clicked', async () => {
    const user = userEvent.setup();
    const { onToggle } = setup();

    // Click the checkbox for the first todo ("Buy groceries")
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(todos[0].id);
  });

  test('calls onDelete with the correct id when a delete button is clicked', async () => {
    const user = userEvent.setup();
    const { onDelete } = setup();

    const deleteButtons = screen.getAllByRole('button', { name: /delete task/i });
    await user.click(deleteButtons[1]); // delete second todo ("Walk the dog")

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(todos[1].id);
  });
});
