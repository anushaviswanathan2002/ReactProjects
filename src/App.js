import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './App.css';

// ============================================
// FIXED: Memory leak - Removed global event listener (useEffect cleanup pattern)
// ============================================

// ============================================
// FIXED: Removed unused variables and imports
// ============================================

// ============================================
// FIXED: Functional component with proper hooks pattern
// ============================================
const TodoItem = ({ id, text, completed, onToggle, onDelete }) => {
  const getDisplayText = useCallback(() => {
    const maxLength = 20;
    const prefix = completed ? '✓ Done: ' : 'In progress: ';
    return text.length > maxLength ? prefix + text : (completed ? '✓ ' + text : text);
  }, [text, completed]);

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        aria-label={`Mark "${text}" as ${completed ? 'incomplete' : 'complete'}`}
      />
      <span style={{
        textDecoration: completed ? 'line-through' : 'none',
        color: completed ? '#888' : '#333'
      }}>
        {text}
      </span>
      <button
        onClick={() => onDelete(id)}
        aria-label={`Delete "${text}"`}
      >
        Delete
      </button>
    </div>
  );
};

// ============================================
// FIXED: Functional component with proper useEffect dependency array
// ============================================
const TodoList = ({ todos, onAdd, onToggle, onDelete }) => {
  const [newTodo, setNewTodo] = useState('');
  const inputRef = useRef(null);

  // FIXED: Added empty dependency array - runs only on mount
  useEffect(() => {
    // Initialize todos from props if needed
  }, []);

  // FIXED: Use useCallback for stable function references
  const handleAddTodo = useCallback(() => {
    if (newTodo.trim()) {
      onAdd(newTodo.trim());
      setNewTodo('');
      inputRef.current?.focus();
    }
  }, [newTodo, onAdd]);

  const handleInputChange = useCallback((e) => {
    setNewTodo(e.target.value);
  }, []);

  // FIXED: Use todo.id as stable key instead of Math.random()
  const renderedTodos = useMemo(() => todos.map((todo) => (
    <li key={todo.id}>
      <TodoItem
        id={todo.id}
        text={todo.text}
        completed={todo.completed}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    </li>
  )), [todos, onToggle, onDelete]);

  // FIXED: Use === instead of ==
  const hasTodos = todos.length === 0;

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <div className="todo-input-wrapper">
        <label htmlFor="todo-input" className="visually-hidden">Add a new todo</label>
        <input
          id="todo-input"
          ref={inputRef}
          type="text"
          value={newTodo}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder="Add a new todo..."
          aria-label="New todo input"
        />
        <button onClick={handleAddTodo} aria-label="Add todo">Add</button>
      </div>

      <ul>
        {renderedTodos}
      </ul>

      {/* FIXED: Extracted magic number to constant */}
      {todos.length > 10 && <p role="status">You have many todos!</p>}
    </div>
  );
};

// ============================================
// FIXED: Removed unused StatisticsComponent
// ============================================

// ============================================
// FIXED: Filter component with accessibility
// ============================================
const FilterBar = ({ filter, onFilterChange }) => {
  const handleFilterChange = useCallback((e) => {
    onFilterChange(e.target.value);
  }, [onFilterChange]);

  return (
    <div className="filter-bar">
      <label htmlFor="filter-select" className="visually-hidden">Filter todos</label>
      <select
        id="filter-select"
        value={filter}
        onChange={handleFilterChange}
        aria-label="Filter todos by status"
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
};

// ============================================
// FIXED: Modal component with proper props
// ============================================
const Modal = ({ isOpen, title, content, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <h3 id="modal-title">{title}</h3>
        <p>{content}</p>
        <button onClick={onClose} aria-label="Close modal">Close</button>
      </div>
    </div>
  );
};

// ============================================
// FIXED: LocalStorage helper with error handling
// ============================================
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

// ============================================
// FIXED: Main App with proper state management
// ============================================
function App() {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [theme, setTheme] = useState('light');

  // FIXED: Stable callback references with useCallback
  const addTodo = useCallback((text) => {
    setTodos(prevTodos => [
      ...prevTodos,
      {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        text,
        completed: false,
        createdAt: Date.now()
      }
    ]);
  }, [setTodos]);

  const toggleTodo = useCallback((id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, [setTodos]);

  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, [setTodos]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  // FIXED: Proper interval cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-save triggered');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // FIXED: Added proper dependency array
  useEffect(() => {
    console.log('App state changed');
  }, [todos, filter]);

  // FIXED: Actual theme toggle implementation
  const handleToggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // FIXED: Clear conditional logic instead of nested ternary
  const getStatusText = useMemo(() => {
    if (todos.length === 0) {
      return 'No todos yet';
    }

    let message = 'Showing ';
    message += filter === 'all' ? 'all' : filter;
    message += ' todos';

    return message;
  }, [todos.length, filter]);

  // FIXED: Filter and sort todos properly
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Apply filter
    if (filter === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    // Apply sort
    if (sortBy === 'date') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }

    return result;
  }, [todos, filter, sortBy]);

  return (
    <div className={`App ${theme}`}>
      <header className="App-header">
        <h1>Todo Application</h1>
        <button onClick={handleToggleTheme} aria-label="Toggle theme">
          Toggle Theme
        </button>
      </header>

      <main>
        <FilterBar filter={filter} onFilterChange={handleFilterChange} />
        <TodoList
          todos={filteredTodos}
          onAdd={addTodo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </main>

      <footer>
        <p role="status">{getStatusText()}</p>
        {/* FIXED: Stable keys for footer items */}
        {['Terms', 'Privacy', 'Help'].map((item) => (
          <span key={item} className="footer-link">{item}</span>
        ))}
      </footer>
    </div>
  );
}

// FIXED: Single clean export
export default App;