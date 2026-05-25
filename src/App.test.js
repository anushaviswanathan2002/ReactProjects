import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// ------------------------------------------------------------
// Test Scenarios:
//  1. Initial render  – shows the heading and input
//  2. Initial render  – shows the empty-state message
//  3. Initial render  – filter buttons and footer are hidden
//  4. Happy path      – adding a todo makes it appear in the list
//  5. Happy path      – adding a todo shows the footer with item count
//  6. Happy path      – adding multiple todos shows the correct count
//  7. Happy path      – completing a todo checks its checkbox
//  8. Happy path      – completing all todos shows 0 items left
//  9. Happy path      – deleting a todo removes it from the list
//  10. Happy path     – "Clear completed" button appears after a todo is checked
//  11. Happy path     – "Clear completed" removes only completed todos
//  12. Filter         – "Active" filter shows only incomplete todos
//  13. Filter         – "Completed" filter shows only completed todos
//  14. Filter         – "All" filter shows every todo
//  15. Edge case      – adding a whitespace-only todo does nothing
//  16. Edge case      – filter shows "No tasks in this view." when empty
// ------------------------------------------------------------

describe('App – integration', () => {
  const addTodo = async (user, text) => {
    await user.type(
      screen.getByPlaceholderText(/what needs to be done/i),
      `${text}{enter}`
    );
  };

  // ── Initial render ──────────────────────────────────────────

  test('renders the app heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /my to-do list/i })
    ).toBeInTheDocument();
  });

  test('renders the input field', () => {
    render(<App />);
    expect(
      screen.getByPlaceholderText(/what needs to be done/i)
    ).toBeInTheDocument();
  });

  test('shows the empty-state message on first load', () => {
    render(<App />);
    expect(
      screen.getByText(/no tasks yet\. add one above!/i)
    ).toBeInTheDocument();
  });

  test('hides filter buttons when there are no todos', () => {
    render(<App />);
    expect(screen.queryByRole('button', { name: /all/i })).not.toBeInTheDocument();
  });

  // ── Adding todos ────────────────────────────────────────────

  test('adding a todo makes it appear in the list', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Buy groceries');

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  test('adding a todo displays the footer with the correct item count', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Buy groceries');

    expect(screen.getByText(/1 item left/i)).toBeInTheDocument();
  });

  test('item count updates correctly with multiple todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Task one');
    await addTodo(user, 'Task two');
    await addTodo(user, 'Task three');

    expect(screen.getByText(/3 items left/i)).toBeInTheDocument();
  });

  test('whitespace-only input does not create a todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, '   ');

    expect(
      screen.getByText(/no tasks yet\. add one above!/i)
    ).toBeInTheDocument();
  });

  // ── Toggling todos ──────────────────────────────────────────

  test('checking a todo marks it as completed (checkbox becomes checked)', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Buy groceries');
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  test('completing a todo decrements the items-left counter', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Task one');
    await addTodo(user, 'Task two');

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(screen.getByText(/1 item left/i)).toBeInTheDocument();
  });

  test('completing all todos shows "0 items left"', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Only task');
    await user.click(screen.getByRole('checkbox'));

    expect(screen.getByText(/0 items left/i)).toBeInTheDocument();
  });

  // ── Deleting todos ──────────────────────────────────────────

  test('deleting a todo removes it from the list', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Buy groceries');
    await user.click(screen.getByRole('button', { name: /delete task/i }));

    expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
  });

  test('deleting the last todo shows the empty-state message again', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Only task');
    await user.click(screen.getByRole('button', { name: /delete task/i }));

    expect(
      screen.getByText(/no tasks yet\. add one above!/i)
    ).toBeInTheDocument();
  });

  // ── Clear completed ─────────────────────────────────────────

  test('"Clear completed" button appears only after a todo is completed', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Buy groceries');
    expect(
      screen.queryByRole('button', { name: /clear completed/i })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('checkbox'));
    expect(
      screen.getByRole('button', { name: /clear completed/i })
    ).toBeInTheDocument();
  });

  test('"Clear completed" removes only completed todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Keep me');
    await addTodo(user, 'Remove me');

    // Complete the second todo
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    await user.click(screen.getByRole('button', { name: /clear completed/i }));

    expect(screen.getByText('Keep me')).toBeInTheDocument();
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument();
  });

  // ── Filters ─────────────────────────────────────────────────

  test('"Active" filter shows only incomplete todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Active task');
    await addTodo(user, 'Done task');

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // complete "Done task"

    await user.click(screen.getByRole('button', { name: /^active$/i }));

    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.queryByText('Done task')).not.toBeInTheDocument();
  });

  test('"Completed" filter shows only completed todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Active task');
    await addTodo(user, 'Done task');

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // complete "Done task"

    await user.click(screen.getByRole('button', { name: /^completed$/i }));

    expect(screen.queryByText('Active task')).not.toBeInTheDocument();
    expect(screen.getByText('Done task')).toBeInTheDocument();
  });

  test('"All" filter shows every todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Active task');
    await addTodo(user, 'Done task');

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    // Switch to Active then back to All
    await user.click(screen.getByRole('button', { name: /^active$/i }));
    await user.click(screen.getByRole('button', { name: /^all$/i }));

    expect(screen.getByText('Active task')).toBeInTheDocument();
    expect(screen.getByText('Done task')).toBeInTheDocument();
  });

  test('filter shows "No tasks in this view." when no todos match', async () => {
    const user = userEvent.setup();
    render(<App />);

    await addTodo(user, 'Active task'); // nothing completed

    await user.click(screen.getByRole('button', { name: /^completed$/i }));

    expect(screen.getByText(/no tasks in this view/i)).toBeInTheDocument();
  });
});
