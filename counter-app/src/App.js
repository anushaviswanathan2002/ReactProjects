import React, { useState, useEffect } from 'react';
import './App.css';

const FILTERS = ['All', 'Active', 'Completed'];

function App() {
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('todos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setTodos([
      ...todos,
      { id: Date.now(), text, completed: false },
    ]);
    setInput('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    const text = editText.trim();
    if (!text) return;
    setTodos(todos.map(t => t.id === id ? { ...t, text } : t));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
  };

  const toggleAll = () => {
    const allDone = todos.every(t => t.completed);
    setTodos(todos.map(t => ({ ...t, completed: !allDone })));
  };

  const filtered = todos.filter(t => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="app">
      <div className="card">
        {/* Header */}
        <div className="header">
          <div className="header-icon">✓</div>
          <h1 className="header-title">My To-Do List</h1>
          <p className="header-subtitle">Stay organised, stay productive</p>
        </div>

        {/* Stats */}
        {todos.length > 0 && (
          <div className="stats">
            <div className="stat">
              <span className="stat-number">{todos.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-number stat-active">{activeCount}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat">
              <span className="stat-number stat-done">{completedCount}</span>
              <span className="stat-label">Done</span>
            </div>
          </div>
        )}

        {/* Input */}
        <form className="input-form" onSubmit={addTodo}>
          <input
            className="todo-input"
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <button className="add-btn" type="submit" disabled={!input.trim()}>
            Add
          </button>
        </form>

        {/* Filters */}
        {todos.length > 0 && (
          <div className="filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Toggle All */}
        {todos.length > 0 && (
          <div className="bulk-actions">
            <button className="toggle-all-btn" onClick={toggleAll}>
              {todos.every(t => t.completed) ? '↺ Unmark All' : '✓ Mark All Done'}
            </button>
            {completedCount > 0 && (
              <button className="clear-btn" onClick={clearCompleted}>
                🗑 Clear Completed ({completedCount})
              </button>
            )}
          </div>
        )}

        {/* Todo List */}
        <ul className="todo-list">
          {filtered.length === 0 && (
            <li className="empty-state">
              {filter === 'Completed'
                ? '🎯 No completed tasks yet'
                : filter === 'Active'
                ? '🎉 All tasks are done!'
                : '📝 Add your first task above!'}
            </li>
          )}

          {filtered.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editingId === todo.id ? (
                <div className="edit-row">
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit(todo.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    autoFocus
                  />
                  <button className="save-btn" onClick={() => saveEdit(todo.id)}>Save</button>
                  <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div className="todo-row">
                  <button
                    className={`check-btn ${todo.completed ? 'checked' : ''}`}
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {todo.completed && <span className="checkmark">✓</span>}
                  </button>
                  <span
                    className="todo-text"
                    onDoubleClick={() => startEdit(todo)}
                    title="Double-click to edit"
                  >
                    {todo.text}
                  </span>
                  <div className="todo-actions">
                    <button
                      className="edit-btn"
                      onClick={() => startEdit(todo)}
                      aria-label="Edit task"
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                      aria-label="Delete task"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Footer hint */}
        {todos.length > 0 && (
          <p className="hint">Double-click a task to edit it</p>
        )}
      </div>
    </div>
  );
}

export default App;
