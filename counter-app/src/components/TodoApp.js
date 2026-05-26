import React, { useState, useEffect } from 'react';
import './TodoApp.css';

const FILTERS = ['All', 'Active', 'Completed'];

function TodoApp() {
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
    <div className="todo-wrapper">
      <div className="todo-container">
        {/* Header */}
        <div className="todo-header">
          <span className="todo-icon">✅</span>
          <h1 className="todo-title">My To-Do List</h1>
          <p className="todo-subtitle">Stay organised, stay productive</p>
        </div>

        {/* Input */}
        <form className="todo-form" onSubmit={addTodo}>
          <input
            className="todo-input"
            type="text"
            placeholder="What needs to be done?"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <button className="todo-add-btn" type="submit" aria-label="Add task">
            Add
          </button>
        </form>

        {/* Stats bar */}
        {todos.length > 0 && (
          <div className="todo-stats">
            <button className="toggle-all-btn" onClick={toggleAll} title="Toggle all">
              {todos.every(t => t.completed) ? '▼ All done!' : '▼ Mark all done'}
            </button>
            <span className="stats-count">
              <strong>{activeCount}</strong> left · <strong>{completedCount}</strong> done
            </span>
          </div>
        )}

        {/* Filter tabs */}
        {todos.length > 0 && (
          <div className="todo-filters">
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

        {/* Todo List */}
        <ul className="todo-list">
          {filtered.length === 0 && (
            <li className="todo-empty">
              {filter === 'All'
                ? 'No tasks yet — add one above!'
                : `No ${filter.toLowerCase()} tasks.`}
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
                  <button className="cancel-btn" onClick={cancelEdit}>✕</button>
                </div>
              ) : (
                <div className="item-row">
                  <button
                    className={`checkbox ${todo.completed ? 'checked' : ''}`}
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {todo.completed && '✓'}
                  </button>
                  <span
                    className="todo-text"
                    onDoubleClick={() => startEdit(todo)}
                    title="Double-click to edit"
                  >
                    {todo.text}
                  </span>
                  <div className="item-actions">
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
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Footer */}
        {completedCount > 0 && (
          <div className="todo-footer">
            <button className="clear-btn" onClick={clearCompleted}>
              Clear completed ({completedCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoApp;
