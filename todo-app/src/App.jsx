import { useState, useEffect, useRef } from 'react';
import './App.css';

const FILTERS = ['All', 'Active', 'Completed'];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem('todo-tasks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const inputRef = useRef(null);
  const editRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editingId]);

  const addTask = () => {
    const text = inputValue.trim();
    if (!text) return;
    setTasks(prev => [
      { id: generateId(), text, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const commitEdit = (id) => {
    const text = editingText.trim();
    if (!text) {
      deleteTask(id);
    } else {
      setTasks(prev =>
        prev.map(t => t.id === id ? { ...t, text } : t)
      );
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleEditKeyDown = (e, id) => {
    if (e.key === 'Enter') commitEdit(id);
    if (e.key === 'Escape') cancelEdit();
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const toggleAll = () => {
    const allDone = tasks.every(t => t.completed);
    setTasks(prev => prev.map(t => ({ ...t, completed: !allDone })));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="app">
      {/* Background decoration */}
      <div className="bg-decoration">
        <div className="bg-blob blob-1" />
        <div className="bg-blob blob-2" />
        <div className="bg-blob blob-3" />
      </div>

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="header-icon">✓</div>
          <h1 className="title">My Tasks</h1>
          <p className="subtitle">Stay organised, stay productive</p>
        </header>

        {/* Input Area */}
        <div className="input-card">
          <div className="input-wrapper">
            <span className="input-icon">＋</span>
            <input
              ref={inputRef}
              className="task-input"
              type="text"
              placeholder="Add a new task…"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              maxLength={200}
            />
            <button
              className="add-btn"
              onClick={addTask}
              disabled={!inputValue.trim()}
              aria-label="Add task"
            >
              Add
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        {tasks.length > 0 && (
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-number">{tasks.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number active-num">{activeCount}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number done-num">{completedCount}</span>
              <span className="stat-label">Done</span>
            </div>
          </div>
        )}

        {/* Main Card */}
        {tasks.length > 0 && (
          <div className="main-card">
            {/* Toolbar */}
            <div className="toolbar">
              <div className="filter-group">
                {FILTERS.map(f => (
                  <button
                    key={f}
                    className={`filter-btn${filter === f ? ' active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                    {f === 'Active' && activeCount > 0 && (
                      <span className="badge">{activeCount}</span>
                    )}
                    {f === 'Completed' && completedCount > 0 && (
                      <span className="badge badge-done">{completedCount}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="toolbar-actions">
                {tasks.length > 1 && (
                  <button className="toggle-all-btn" onClick={toggleAll} title="Toggle all">
                    {tasks.every(t => t.completed) ? '↺ Undo All' : '✓ All Done'}
                  </button>
                )}
              </div>
            </div>

            {/* Task List */}
            <ul className="task-list">
              {filteredTasks.length === 0 ? (
                <li className="empty-state">
                  <span className="empty-icon">
                    {filter === 'Completed' ? '🎉' : '🌟'}
                  </span>
                  <p>
                    {filter === 'Completed'
                      ? 'No completed tasks yet'
                      : 'No active tasks — you\'re all caught up!'}
                  </p>
                </li>
              ) : (
                filteredTasks.map(task => (
                  <li
                    key={task.id}
                    className={`task-item${task.completed ? ' completed' : ''}${editingId === task.id ? ' editing' : ''}`}
                  >
                    {/* Checkbox */}
                    <button
                      className={`checkbox${task.completed ? ' checked' : ''}`}
                      onClick={() => toggleTask(task.id)}
                      aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {task.completed && (
                        <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>

                    {/* Task Text / Edit Input */}
                    {editingId === task.id ? (
                      <input
                        ref={editRef}
                        className="edit-input"
                        value={editingText}
                        onChange={e => setEditingText(e.target.value)}
                        onKeyDown={e => handleEditKeyDown(e, task.id)}
                        onBlur={() => commitEdit(task.id)}
                        maxLength={200}
                      />
                    ) : (
                      <span
                        className="task-text"
                        onDoubleClick={() => !task.completed && startEdit(task)}
                        title={task.completed ? '' : 'Double-click to edit'}
                      >
                        {task.text}
                      </span>
                    )}

                    {/* Actions */}
                    {editingId !== task.id && (
                      <div className="task-actions">
                        {!task.completed && (
                          <button
                            className="action-btn edit-btn"
                            onClick={() => startEdit(task)}
                            aria-label="Edit task"
                            title="Edit"
                          >
                            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.5 2.5L13.5 4.5L5.5 12.5L2.5 13.5L3.5 10.5L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        )}
                        <button
                          className="action-btn delete-btn"
                          onClick={() => deleteTask(task.id)}
                          aria-label="Delete task"
                          title="Delete"
                        >
                          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 4H13M5 4V3H11V4M6 7V12M10 7V12M4 4L4.5 13H11.5L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>

            {/* Footer */}
            <div className="card-footer">
              <span className="remaining-count">
                {activeCount === 0
                  ? 'All tasks complete! 🎉'
                  : `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`}
              </span>
              {completedCount > 0 && (
                <button className="clear-btn" onClick={clearCompleted}>
                  Clear completed ({completedCount})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty App State */}
        {tasks.length === 0 && (
          <div className="welcome-card">
            <div className="welcome-icon">📝</div>
            <h2>Nothing here yet!</h2>
            <p>Add your first task above to get started.</p>
          </div>
        )}

        <footer className="app-footer">
          Double-click a task to edit &nbsp;·&nbsp; Press Enter to add
        </footer>
      </div>
    </div>
  );
}

export default App;
