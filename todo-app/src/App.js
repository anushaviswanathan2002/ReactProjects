import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const PRIORITY_CONFIG = {
  high:   { label: 'High',   color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  medium: { label: 'Medium', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  low:    { label: 'Low',    color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0' },
};

const FILTERS = ['All', 'Active', 'Completed'];

const EMPTY_MESSAGES = {
  All:       { icon: '🗒️',  title: 'No tasks yet!',         sub: 'Add your first task above to get started.' },
  Active:    { icon: '✅',  title: 'All caught up!',         sub: 'No active tasks — time to relax.' },
  Completed: { icon: '🏆',  title: 'No completed tasks yet', sub: 'Finish something and it will show here.' },
};

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem('rta-todos');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (todos) => {
  try {
    localStorage.setItem('rta-todos', JSON.stringify(todos));
  } catch {
    // storage quota exceeded — fail silently
  }
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function PriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className="priority-badge"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  );
}

function TodoItem({
  todo,
  index,
  totalVisible,
  onToggle,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
}) {
  const [isEditing, setIsEditing]   = useState(false);
  const [editText, setEditText]     = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editDueDate, setEditDueDate]   = useState(todo.dueDate || '');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const startEdit = () => {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditDueDate(todo.dueDate || '');
    setIsEditing(true);
  };

  const commitEdit = () => {
    const trimmed = editText.trim();
    if (trimmed) {
      onEdit(todo.id, { text: trimmed, priority: editPriority, dueDate: editDueDate });
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter')  commitEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  const isOverdue =
    todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date(new Date().toDateString());

  const cfg = PRIORITY_CONFIG[todo.priority];

  return (
    <li
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      style={{ '--priority-color': cfg.color, '--priority-bg': cfg.bg }}
    >
      <div className="todo-item-left">
        <button
          className="move-btn"
          onClick={onMoveUp}
          disabled={index === 0}
          title="Move up"
          aria-label="Move task up"
        >▲</button>
        <button
          className="move-btn"
          onClick={onMoveDown}
          disabled={index === totalVisible - 1}
          title="Move down"
          aria-label="Move task down"
        >▼</button>
      </div>

      <label className="checkbox-wrapper" title={todo.completed ? 'Mark incomplete' : 'Mark complete'}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <span className="custom-checkbox" />
      </label>

      <div className="todo-body" onDoubleClick={!isEditing ? startEdit : undefined}>
        {isEditing ? (
          <div className="edit-area">
            <input
              ref={inputRef}
              className="edit-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Task text…"
            />
            <div className="edit-meta-row">
              <select
                className="edit-select"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <input
                type="date"
                className="edit-date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
              <button className="btn-save" onClick={commitEdit}>Save</button>
              <button className="btn-cancel" onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <span className="todo-text" title="Double-click to edit">{todo.text}</span>
            <div className="todo-meta">
              <PriorityBadge priority={todo.priority} />
              {todo.dueDate && (
                <span className={`due-date ${isOverdue ? 'overdue-label' : ''}`}>
                  {isOverdue ? '⚠️' : '📅'} {todo.dueDate}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      <div className="todo-item-actions">
        {!isEditing && (
          <button
            className="btn-edit"
            onClick={startEdit}
            title="Edit task"
            aria-label={`Edit task: ${todo.text}`}
          >✏️</button>
        )}
        <button
          className="btn-delete"
          onClick={() => onDelete(todo.id)}
          title="Delete task"
          aria-label={`Delete task: ${todo.text}`}
        >🗑️</button>
      </div>
    </li>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [todos, setTodos]         = useState(loadFromStorage);
  const [inputText, setInputText] = useState('');
  const [priority, setPriority]   = useState('medium');
  const [dueDate, setDueDate]     = useState('');
  const [filter, setFilter]       = useState('All');
  const [justAdded, setJustAdded] = useState(null);
  const inputRef = useRef(null);

  // ── Persist to localStorage whenever todos change
  useEffect(() => {
    saveToStorage(todos);
  }, [todos]);

  // ── Filtered view
  const filteredTodos = todos.filter((t) => {
    if (filter === 'Active')    return !t.completed;
    if (filter === 'Completed') return  t.completed;
    return true;
  });

  const activeCount     = todos.filter((t) => !t.completed).length;
  const completedCount  = todos.filter((t) =>  t.completed).length;

  // ── Actions
  const addTodo = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    const newTodo = {
      id:        generateId(),
      text:      trimmed,
      completed: false,
      priority,
      dueDate,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setJustAdded(newTodo.id);
    setInputText('');
    setDueDate('');
    setTimeout(() => setJustAdded(null), 600);
    inputRef.current?.focus();
  }, [inputText, priority, dueDate]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') addTodo();
  };

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTodo = useCallback((id, changes) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...changes } : t))
    );
  }, []);

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  // Move within the *full* todos array using the visible index
  const moveItem = useCallback((visibleIndex, direction) => {
    const visibleIds = filteredTodos.map((t) => t.id);
    const targetVisibleIndex = visibleIndex + direction;
    if (targetVisibleIndex < 0 || targetVisibleIndex >= visibleIds.length) return;

    const fromId = visibleIds[visibleIndex];
    const toId   = visibleIds[targetVisibleIndex];

    setTodos((prev) => {
      const fromIdx = prev.findIndex((t) => t.id === fromId);
      const toIdx   = prev.findIndex((t) => t.id === toId);
      const next = [...prev];
      [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
      return next;
    });
  }, [filteredTodos]);

  const toggleAll = () => {
    const allDone = todos.every((t) => t.completed);
    setTodos((prev) => prev.map((t) => ({ ...t, completed: !allDone })));
  };

  // ── Empty state
  const emptyMsg = EMPTY_MESSAGES[filter];

  return (
    <div className="app-wrapper">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="header-top">
          <span className="header-icon">✅</span>
          <h1 className="app-title">My To-Do List</h1>
        </div>
        <p className="app-subtitle">Stay organised, stay productive.</p>
      </header>

      <main className="app-main">
        {/* ── Input area ── */}
        <section className="input-section" aria-label="Add new task">
          <div className="input-row">
            <input
              ref={inputRef}
              className="task-input"
              type="text"
              placeholder="What needs to be done? (Press Enter to add)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleInputKeyDown}
              aria-label="New task text"
            />
            <button
              className="btn-add"
              onClick={addTodo}
              disabled={!inputText.trim()}
              aria-label="Add task"
            >
              + Add
            </button>
          </div>

          <div className="input-meta-row">
            <div className="meta-field">
              <label htmlFor="priority-select" className="meta-label">Priority</label>
              <select
                id="priority-select"
                className="select-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>

            <div className="meta-field">
              <label htmlFor="due-date" className="meta-label">Due Date</label>
              <input
                id="due-date"
                className="input-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {todos.length > 0 && (
              <button
                className="btn-toggle-all"
                onClick={toggleAll}
                title="Toggle all tasks"
              >
                {todos.every((t) => t.completed) ? '↩ Uncheck All' : '✔ Check All'}
              </button>
            )}
          </div>
        </section>

        {/* ── Stats bar ── */}
        {todos.length > 0 && (
          <div className="stats-bar" aria-live="polite">
            <span className="stat-item active-count">
              <strong>{activeCount}</strong> task{activeCount !== 1 ? 's' : ''} remaining
            </span>
            <span className="stat-divider">·</span>
            <span className="stat-item">
              <strong>{completedCount}</strong> completed
            </span>
            <span className="stat-divider">·</span>
            <span className="stat-item">
              <strong>{todos.length}</strong> total
            </span>
          </div>
        )}

        {/* ── Filter tabs ── */}
        <nav className="filter-bar" aria-label="Filter tasks">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f}
              {f === 'Active'    && activeCount    > 0 && (
                <span className="filter-badge">{activeCount}</span>
              )}
              {f === 'Completed' && completedCount > 0 && (
                <span className="filter-badge">{completedCount}</span>
              )}
            </button>
          ))}
        </nav>

        {/* ── Task list ── */}
        <section aria-label="Task list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{emptyMsg.icon}</div>
              <h2 className="empty-title">{emptyMsg.title}</h2>
              <p className="empty-sub">{emptyMsg.sub}</p>
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={index}
                  totalVisible={filteredTodos.length}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                  onMoveUp={() => moveItem(index, -1)}
                  onMoveDown={() => moveItem(index, 1)}
                  className={justAdded === todo.id ? 'item-enter' : ''}
                />
              ))}
            </ul>
          )}
        </section>

        {/* ── Footer actions ── */}
        {completedCount > 0 && (
          <div className="footer-actions">
            <button className="btn-clear-completed" onClick={clearCompleted}>
              🧹 Clear {completedCount} completed task{completedCount !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Double-click any task to edit it &nbsp;·&nbsp; Use ▲▼ to reorder</p>
      </footer>
    </div>
  );
}
