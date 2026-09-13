import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { TimerContext } from './TimerContext';
import Timer from './Timer';
import './TodoApp.css';

const TodoApp = () => {
  const { user, token, logout } = useAuth();
  const { initializeTimer } = useContext(TimerContext);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [expandedTimer, setExpandedTimer] = useState(null); // Track which todo has expanded timer

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/todos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setTodos(data.todos);
          // Initialize timers for all todos
          data.todos.forEach(todo => {
            initializeTimer(todo.id, todo.timeSpent || 0);
          });
        }
      } catch (err) {
        console.error('Failed to fetch todos', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadTodos();
    }
  }, [token, initializeTimer]);



  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });
      if (response.ok) {
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
        initializeTimer(newTodo.id, 0);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error('Failed to add todo', err);
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const updated = await response.json();
        setTodos(todos.map(t => t.id === id ? updated : t));
        setEditingId(null);
        setEditTitle('');
        setEditDescription('');
      }
    } catch (err) {
      console.error('Failed to update todo', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setTodos(todos.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete todo', err);
    }
  };

  const toggleComplete = (todo) => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const saveEdit = () => {
    if (editTitle.trim()) {
      updateTodo(editingId, { title: editTitle, description: editDescription });
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  };

  return (
    <div className="todo-app">
      <div className="todo-header">
        <div>
          <h1>My Memory Tasks</h1>
          <p>Welcome, {user?.name}!</p>
        </div>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <div className="stats">
        <div className="stat">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat">
          <span className="stat-number">{stats.active}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <form onSubmit={addTodo} className="add-todo-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="todo-textarea"
          rows="2"
        />
        <button type="submit" className="add-button">Add Task</button>
      </form>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : filteredTodos.length === 0 ? (
        <p className="empty-state">
          {todos.length === 0 ? 'No tasks yet. Add one to get started!' : 'No tasks in this filter.'}
        </p>
      ) : (
        <div className="todos-list">
          {filteredTodos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editingId === todo.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="edit-input"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="edit-textarea"
                    rows="2"
                  />
                  <div className="edit-buttons">
                    <button onClick={saveEdit} className="save-button">Save</button>
                    <button onClick={() => setEditingId(null)} className="cancel-button">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo)}
                    className="todo-checkbox"
                  />
                  <div className="todo-content">
                    <h3>{todo.title}</h3>
                    {todo.description && <p>{todo.description}</p>}
                  </div>
                  <div className="todo-actions">
                    <button
                      onClick={() => setExpandedTimer(expandedTimer === todo.id ? null : todo.id)}
                      className="timer-button"
                      title="Toggle Timer"
                    >
                      ⏱ Timer
                    </button>
                    <button
                      onClick={() => startEdit(todo)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
              {expandedTimer === todo.id && !editingId && (
                <div className="todo-timer-wrapper">
                  <Timer taskId={todo.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoApp;
